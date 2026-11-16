import React, { useState, useEffect, useMemo, useRef } from 'react';
import { X } from 'lucide-react';
import {
  ColumnDef,
  ColumnFilterValue,
  DATA_TYPES,
  EDITOR_TYPES,
  FILTER_MODES,
  FILTER_OPS,
  FilterOperation,
  SortConfig,
  SortDirection,
  SurfaceTheme,
} from '../types';
import {
  FilterOpIcon,
  FILTER_OP_META,
  getAllowedFilterOpsForColumn,
  getColumnFilterType,
  getDefaultFilterOpForColumn,
} from '../FilterIcons';
import { isBetweenFilterOp, isNoInputFilterOp } from '../gridFormatUtils';
import { expandAllShortcuts } from '../smartNumberUtils';
import { parseTimeToMinutes } from '../floating/queryUtils';
import {
  NumberRangeFilterInput,
  SmartNumberFilterInput,
} from '../GridSmartNumberInputs';
import {
  TimeFilterInput,
  TimeRangeFilterInput,
} from '../GridTimeFilterInputs';
import { AdvDatePicker, AdvDateRangePicker, formatDisplayDate } from '../../ui/AdvDatePicker';
import { NO_AUTOFILL_PROPS } from '../constants';
import { AdvButton } from '../../ui/AdvButton';
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerSwipeHandle,
  DrawerTitle,
} from '../../ui/AdvDrawer';

type DrawerTabKey = 'filter' | 'sort';
type MobileColInputMode = 'simple' | 'multi';

interface MobileColDraft {
  mode: MobileColInputMode;
  op: FilterOperation;
  singleVal: string;
  multiText: string;
  multiRanges: Array<{ from: string; to: string }>;
  discreteDates: string[];
}

const SORT_DIRECTION_BUTTONS: { dir: SortDirection; label: string }[] = [
  { dir: 'asc', label: 'Tăng dần' },
  { dir: 'desc', label: 'Giảm dần' },
];

const COL_INPUT_MODE_BUTTONS: { mode: MobileColInputMode; label: string }[] = [
  { mode: 'simple', label: 'Một giá trị' },
  { mode: 'multi', label: 'Nhiều giá trị' },
];

export function parseMultiValueTokens(rawText: string): string[] {
  if (!rawText.trim()) return [];
  const tokens = rawText
    .split(/[\r\n,;\t]+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 0);

  const seen = new Set<string>();
  const result: string[] = [];
  for (const token of tokens) {
    const lower = token.toLowerCase();
    if (!seen.has(lower)) {
      seen.add(lower);
      result.push(token);
    }
  }
  return result;
}

function splitRangePair(
  rawVal: string,
  colType: string,
  isDateRangeCol?: boolean
): { from: string; to: string } {
  if (!rawVal) return { from: '', to: '' };
  if (rawVal.includes('..')) {
    const parts = rawVal.split('..');
    return { from: parts[0]?.trim() || '', to: parts[1]?.trim() || '' };
  }
  if (rawVal.includes(' - ')) {
    const parts = rawVal.split(' - ');
    return { from: parts[0]?.trim() || '', to: parts[1]?.trim() || '' };
  }
  if (colType === DATA_TYPES.NUMBER && rawVal.includes('/')) {
    const parts = rawVal.split('/');
    return { from: parts[0]?.trim() || '', to: parts[1]?.trim() || '' };
  }
  if (rawVal.includes('~')) {
    const parts = rawVal.split('~');
    return { from: parts[0]?.trim() || '', to: parts[1]?.trim() || '' };
  }
  const trimmed = rawVal.trim();
  if (!trimmed) return { from: '', to: '' };
  if (colType === DATA_TYPES.DATE) {
    return { from: trimmed, to: isDateRangeCol ? trimmed : trimmed };
  }
  return { from: trimmed, to: '' };
}

function hasActiveColFilter(f?: ColumnFilterValue): boolean {
  if (!f) return false;
  if (isNoInputFilterOp(f.op)) return true;
  if (
    f.mode === FILTER_MODES.MULTI &&
    ((Array.isArray(f.multiValues) && f.multiValues.length > 0) ||
      (Array.isArray(f.multiRanges) && f.multiRanges.length > 0))
  ) {
    return true;
  }
  return typeof f.val === 'string' && f.val.trim().length > 0;
}

export interface ResponsiveSortFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  columns: ColumnDef<any>[];
  totalRows: number;
  sortConfig?: SortConfig | null;
  onSortChange?: (sort: SortConfig | null) => void;
  searchQuery?: string;
  onSearchQueryChange?: (q: string) => void;
  columnFilters?: Record<string, any>;
  onColumnFilterChange?: (colKey: string, filter: any) => void;
  onClearAllColumnFilters?: () => void;
  hasColumnEmptyCells?: (colKey: string) => boolean;
  getColumnDateBounds?: (colKey: string) => { min: string; max: string };
  surfaceTheme?: SurfaceTheme;
  enableSorting?: boolean;
  enableFiltering?: boolean;
  enableQuickSearch?: boolean;
}

export const ResponsiveSortFilterModal: React.FC<ResponsiveSortFilterModalProps> = ({
  isOpen,
  onClose,
  columns,
  totalRows,
  sortConfig,
  onSortChange,
  searchQuery = '',
  onSearchQueryChange,
  columnFilters = {},
  onColumnFilterChange,
  onClearAllColumnFilters,
  hasColumnEmptyCells,
  getColumnDateBounds,
  surfaceTheme = 'light',
  enableSorting = true,
  enableFiltering = true,
  enableQuickSearch = true,
}) => {
  const canSearchAll = enableQuickSearch && Boolean(onSearchQueryChange);
  const canFilterByCol = enableFiltering && Boolean(onColumnFilterChange);
  const canSearchOrFilter = canSearchAll || canFilterByCol;
  const canSort = enableSorting && Boolean(onSortChange);
  const hasBothTabs = canSort && canSearchOrFilter;

  const [activeTab, setActiveTab] = useState<DrawerTabKey>(canSearchOrFilter ? 'filter' : 'sort');

  // 1. State Sắp xếp (Sort)
  const [selectedSortCol, setSelectedSortCol] = useState<string>(sortConfig?.key || '');
  const [selectedSortDir, setSelectedSortDir] = useState<SortDirection>(
    sortConfig?.direction || 'asc'
  );

  // 2. State Tìm kiếm & Bộ lọc (Filter)
  const [searchScope, setSearchScope] = useState<string>('__ALL__');
  const [allSearchDraft, setAllSearchDraft] = useState<string>('');
  const [colDrafts, setColDrafts] = useState<Record<string, MobileColDraft>>({});
  const [dateAddPickerVal, setDateAddPickerVal] = useState<string>('');
  const dirtyScopesRef = useRef<Set<string>>(new Set());
  const wasOpenRef = useRef<boolean>(false);

  // Cột dữ liệu phục vụ Sắp xếp (loại trừ cột hệ thống stt/chk và cột tắt sắp xếp)
  const sortableColumns = useMemo(() => {
    return columns.filter(
      (col) =>
        !col.isSelection &&
        col.key !== 'col_chk' &&
        col.key !== 'col_stt' &&
        col.sortable !== false &&
        !col.isChart
    );
  }, [columns]);

  // Cột dữ liệu phục vụ Lọc (loại trừ cột hệ thống stt/chk và cột tắt lọc)
  const filterableColumns = useMemo(() => {
    return columns.filter(
      (col) =>
        !col.isSelection &&
        col.key !== 'col_chk' &&
        col.key !== 'col_stt' &&
        col.filterable !== false &&
        !col.isChart
    );
  }, [columns]);

  const filterColMap = useMemo(() => {
    const map: Record<string, ColumnDef<any>> = {};
    filterableColumns.forEach((c) => {
      map[c.key] = c;
    });
    return map;
  }, [filterableColumns]);

  const getOpsForColumn = (col: ColumnDef<any>, mode: MobileColInputMode): FilterOperation[] => {
    const allowed = getAllowedFilterOpsForColumn(col.key, [col], hasColumnEmptyCells);
    if (mode === 'multi') {
      return allowed.filter((op) => !FILTER_OP_META[op]?.noInput);
    }
    return allowed;
  };

  const getDefaultInputOpForColumn = (
    col: ColumnDef<any>,
    mode: MobileColInputMode
  ): FilterOperation => {
    const ops = getOpsForColumn(col, mode);
    if (col.isDateRange && ops.includes(FILTER_OPS.BETWEEN)) {
      return FILTER_OPS.BETWEEN;
    }
    const def = getDefaultFilterOpForColumn(col.key, [col]);
    if (ops.includes(def) && !FILTER_OP_META[def]?.noInput) {
      return def;
    }
    const firstInputOp = ops.find((o) => !FILTER_OP_META[o]?.noInput);
    return firstInputOp || ops[0] || FILTER_OPS.CONTAINS;
  };

  const buildInitialColDraft = (
    col: ColumnDef<any>,
    existing?: ColumnFilterValue
  ): MobileColDraft => {
    const colType = getColumnFilterType(col.key, [col]);
    const simpleOps = getOpsForColumn(col, 'simple');
    const multiOps = getOpsForColumn(col, 'multi');
    const defaultSimpleOp = getDefaultInputOpForColumn(col, 'simple');
    const defaultMultiOp = getDefaultInputOpForColumn(col, 'multi');

    const isMulti =
      existing?.mode === FILTER_MODES.MULTI &&
      ((Array.isArray(existing.multiValues) && existing.multiValues.length > 0) ||
        (Array.isArray(existing.multiRanges) && existing.multiRanges.length > 0));

    if (isMulti && existing) {
      const resolvedOp =
        existing.op && multiOps.includes(existing.op) ? existing.op : defaultMultiOp;
      const multiValues = Array.isArray(existing.multiValues) ? existing.multiValues : [];
      const multiRanges =
        Array.isArray(existing.multiRanges) && existing.multiRanges.length > 0
          ? existing.multiRanges.map((r) => ({ from: r.from || '', to: r.to || '' }))
          : [{ from: '', to: '' }];

      return {
        mode: 'multi',
        op: resolvedOp,
        singleVal: '',
        multiText: colType === DATA_TYPES.DATE ? '' : multiValues.join('\n'),
        multiRanges,
        discreteDates: colType === DATA_TYPES.DATE ? [...multiValues] : [],
      };
    }

    if (existing && hasActiveColFilter(existing)) {
      const resolvedOp =
        existing.op && simpleOps.includes(existing.op) ? existing.op : defaultSimpleOp;
      const rawVal = typeof existing.val === 'string' ? existing.val : '';
      const parsedPair = splitRangePair(rawVal, colType, col.isDateRange);
      const isRangeVal = rawVal.includes('..') || isBetweenFilterOp(resolvedOp);

      return {
        mode: 'simple',
        op: resolvedOp,
        singleVal: isNoInputFilterOp(resolvedOp) ? '' : rawVal,
        multiText: !isRangeVal && colType !== DATA_TYPES.DATE ? rawVal : '',
        multiRanges:
          isRangeVal && (parsedPair.from || parsedPair.to)
            ? [parsedPair]
            : [{ from: '', to: '' }],
        discreteDates:
          !isRangeVal && colType === DATA_TYPES.DATE && rawVal.trim() ? [rawVal.trim()] : [],
      };
    }

    return {
      mode: 'simple',
      op: defaultSimpleOp,
      singleVal: '',
      multiText: '',
      multiRanges: [{ from: '', to: '' }],
      discreteDates: [],
    };
  };

  // Options cho phạm vi tìm kiếm (dạng Chip chạm trực tiếp)
  const filterScopeOptions = useMemo(() => {
    const opts: { label: string; value: string }[] = [];
    if (canSearchAll) {
      opts.push({ label: 'Tất cả các cột (Toàn văn)', value: '__ALL__' });
    }
    if (canFilterByCol) {
      filterableColumns.forEach((col) => {
        opts.push({
          label: col.title || col.key,
          value: col.key,
        });
      });
    }
    return opts;
  }, [canSearchAll, canFilterByCol, filterableColumns]);

  // Khởi tạo dữ liệu nháp khi mở Drawer từ trạng thái đóng -> mở
  useEffect(() => {
    if (isOpen && !wasOpenRef.current) {
      setSelectedSortCol(sortConfig?.key || '');
      setSelectedSortDir(sortConfig?.direction || 'asc');
      setAllSearchDraft(searchQuery || '');
      setDateAddPickerVal('');

      const nextColDrafts: Record<string, MobileColDraft> = {};
      let firstFilteredColKey = '';

      filterableColumns.forEach((col) => {
        const existing = columnFilters[col.key] as ColumnFilterValue | undefined;
        nextColDrafts[col.key] = buildInitialColDraft(col, existing);
        if (!firstFilteredColKey && hasActiveColFilter(existing)) {
          firstFilteredColKey = col.key;
        }
      });

      setColDrafts(nextColDrafts);
      dirtyScopesRef.current = new Set();

      let defaultScope = '__ALL__';
      if (canSearchAll && (searchQuery || '').trim().length > 0) {
        defaultScope = '__ALL__';
      } else if (canFilterByCol && firstFilteredColKey) {
        defaultScope = firstFilteredColKey;
      } else if (canSearchAll) {
        defaultScope = '__ALL__';
      } else {
        defaultScope = filterableColumns[0]?.key || '__ALL__';
      }
      setSearchScope(defaultScope);
      setActiveTab(canSearchOrFilter ? 'filter' : 'sort');
    }
    wasOpenRef.current = isOpen;
  }, [
    isOpen,
    sortConfig,
    searchQuery,
    canSearchAll,
    canFilterByCol,
    canSearchOrFilter,
    filterableColumns,
    columnFilters,
  ]);

  // Giữ activeTab hợp lệ nếu feature flags thay đổi động
  useEffect(() => {
    if (activeTab === 'filter' && !canSearchOrFilter && canSort) {
      setActiveTab('sort');
    } else if (activeTab === 'sort' && !canSort && canSearchOrFilter) {
      setActiveTab('filter');
    }
  }, [activeTab, canSearchOrFilter, canSort]);

  const updateColDraft = (col: ColumnDef<any>, patch: Partial<MobileColDraft>) => {
    dirtyScopesRef.current.add(col.key);
    setColDrafts((prev) => {
      const current = prev[col.key] ?? buildInitialColDraft(col, columnFilters[col.key]);
      return {
        ...prev,
        [col.key]: {
          ...current,
          ...patch,
        },
      };
    });
  };

  const handleAllSearchTextChange = (val: string) => {
    dirtyScopesRef.current.add('__ALL__');
    setAllSearchDraft(val);
  };

  const handleSwitchColInputMode = (col: ColumnDef<any>, nextMode: MobileColInputMode) => {
    const colType = getColumnFilterType(col.key, [col]);
    const current = colDrafts[col.key] ?? buildInitialColDraft(col, columnFilters[col.key]);
    const allowedNextOps = getOpsForColumn(col, nextMode);
    const fallbackOp = getDefaultInputOpForColumn(col, nextMode);

    let nextOp = current.op;
    if (!allowedNextOps.includes(nextOp) || isNoInputFilterOp(nextOp)) {
      nextOp = fallbackOp;
    }

    if (nextMode === 'multi') {
      const patch: Partial<MobileColDraft> = {
        mode: 'multi',
        op: nextOp,
      };
      if (isBetweenFilterOp(nextOp)) {
        const hasAnyRange = current.multiRanges.some(
          (r) => r.from.trim().length > 0 || r.to.trim().length > 0
        );
        if (!hasAnyRange && current.singleVal.trim()) {
          const pair = splitRangePair(current.singleVal, colType, col.isDateRange);
          if (pair.from || pair.to) {
            patch.multiRanges = [pair];
          }
        }
      } else if (colType === DATA_TYPES.DATE) {
        if (current.discreteDates.length === 0 && current.singleVal.trim() && !current.singleVal.includes('..')) {
          const formatted =
            formatDisplayDate(current.singleVal.trim(), false, Boolean(col.showTime)) ||
            current.singleVal.trim();
          patch.discreteDates = [formatted];
        }
      } else if (!current.multiText.trim() && current.singleVal.trim() && !current.singleVal.includes('..')) {
        patch.multiText = current.singleVal.trim();
      }
      updateColDraft(col, patch);
    } else {
      const patch: Partial<MobileColDraft> = {
        mode: 'simple',
        op: nextOp,
      };
      if (!current.singleVal.trim()) {
        if (isBetweenFilterOp(nextOp)) {
          const firstRange = current.multiRanges.find(
            (r) => r.from.trim().length > 0 || r.to.trim().length > 0
          );
          if (firstRange) {
            const f = firstRange.from.trim();
            const t = firstRange.to.trim();
            patch.singleVal = f && t ? `${f}..${t}` : f ? `${f}..` : t ? `..${t}` : '';
          }
        } else if (colType === DATA_TYPES.DATE && current.discreteDates.length === 1) {
          patch.singleVal = current.discreteDates[0];
        } else {
          const tokens = parseMultiValueTokens(current.multiText);
          if (tokens.length === 1) {
            patch.singleVal = tokens[0];
          }
        }
      }
      updateColDraft(col, patch);
    }
  };

  const handleSelectColOp = (col: ColumnDef<any>, nextOp: FilterOperation) => {
    const current = colDrafts[col.key] ?? buildInitialColDraft(col, columnFilters[col.key]);
    if (isNoInputFilterOp(nextOp)) {
      updateColDraft(col, { mode: 'simple', op: nextOp });
    } else {
      updateColDraft(col, { op: nextOp });
    }
  };

  // Tự chuyển sang Nhiều giá trị khi người dùng dán văn bản nhiều dòng / tab vào ô chữ đơn
  const handleTextSinglePaste = (
    col: ColumnDef<any>,
    e: React.ClipboardEvent<HTMLInputElement>
  ) => {
    const pasted = e.clipboardData?.getData('text') ?? '';
    if (/[\r\n\t]/.test(pasted)) {
      e.preventDefault();
      const current = colDrafts[col.key] ?? buildInitialColDraft(col, columnFilters[col.key]);
      const multiOps = getOpsForColumn(col, 'multi');
      const resolvedOp =
        multiOps.includes(current.op) && !isNoInputFilterOp(current.op)
          ? current.op
          : getDefaultInputOpForColumn(col, 'multi');
      const merged = current.singleVal.trim()
        ? `${current.singleVal.trim()}\n${pasted}`
        : pasted;
      updateColDraft(col, {
        mode: 'multi',
        op: resolvedOp,
        multiText: merged,
      });
    }
  };

  const handleAddDiscreteDate = (col: ColumnDef<any>, rawDate: string) => {
    const trimmed = rawDate.trim();
    if (!trimmed) return;
    const formatted = formatDisplayDate(trimmed, false, Boolean(col.showTime)) || trimmed;
    const current = colDrafts[col.key] ?? buildInitialColDraft(col, columnFilters[col.key]);
    if (!current.discreteDates.includes(formatted)) {
      updateColDraft(col, {
        discreteDates: [...current.discreteDates, formatted],
      });
    }
    setDateAddPickerVal('');
  };

  const handleRemoveDiscreteDate = (col: ColumnDef<any>, targetDate: string) => {
    const current = colDrafts[col.key] ?? buildInitialColDraft(col, columnFilters[col.key]);
    updateColDraft(col, {
      discreteDates: current.discreteDates.filter((d) => d !== targetDate),
    });
  };

  const handleUpdateRangeRow = (
    col: ColumnDef<any>,
    idx: number,
    from: string,
    to: string
  ) => {
    const current = colDrafts[col.key] ?? buildInitialColDraft(col, columnFilters[col.key]);
    const nextRanges = [...current.multiRanges];
    nextRanges[idx] = { from, to };
    updateColDraft(col, { multiRanges: nextRanges });
  };

  const handleRemoveRangeRow = (col: ColumnDef<any>, idx: number) => {
    const current = colDrafts[col.key] ?? buildInitialColDraft(col, columnFilters[col.key]);
    const nextRanges =
      current.multiRanges.length <= 1
        ? [{ from: '', to: '' }]
        : current.multiRanges.filter((_, i) => i !== idx);
    updateColDraft(col, { multiRanges: nextRanges });
  };

  const handleAddRangeRow = (col: ColumnDef<any>) => {
    const current = colDrafts[col.key] ?? buildInitialColDraft(col, columnFilters[col.key]);
    updateColDraft(col, {
      multiRanges: [...current.multiRanges, { from: '', to: '' }],
    });
  };

  // Chạm chọn cột sắp xếp: chạm vào cột đang chọn sẽ bỏ sắp xếp
  const handleToggleSortCol = (colKey: string) => {
    if (selectedSortCol === colKey) {
      setSelectedSortCol('');
    } else {
      setSelectedSortCol(colKey);
    }
  };

  // Nút Áp dụng: lưu cấu hình cả Tìm kiếm/Lọc & Sắp xếp rồi đóng Drawer
  const handleApply = () => {
    if (canSort) {
      if (selectedSortCol) {
        onSortChange?.({
          key: selectedSortCol,
          direction: selectedSortDir,
        });
      } else {
        onSortChange?.(null);
      }
    }

    if (canSearchOrFilter) {
      dirtyScopesRef.current.forEach((scopeKey) => {
        if (scopeKey === '__ALL__') {
          if (canSearchAll) {
            onSearchQueryChange?.(allSearchDraft.trim());
          }
          return;
        }

        if (!canFilterByCol) return;
        const col = filterColMap[scopeKey];
        const draft = colDrafts[scopeKey];
        if (!col || !draft) return;

        const existing = (columnFilters[scopeKey] || {}) as ColumnFilterValue;
        const colType = getColumnFilterType(col.key, [col]);

        if (isNoInputFilterOp(draft.op)) {
          onColumnFilterChange?.(scopeKey, {
            ...existing,
            op: draft.op,
            val: '',
            mode: FILTER_MODES.SIMPLE,
            multiValues: undefined,
            multiRanges: undefined,
          });
          return;
        }

        if (draft.mode === 'multi') {
          let finalMultiValues: string[] | undefined;
          let finalMultiRanges: Array<{ from: string; to: string }> | undefined;

          if (
            isBetweenFilterOp(draft.op) &&
            (colType === DATA_TYPES.NUMBER ||
              colType === DATA_TYPES.DATE ||
              colType === DATA_TYPES.TIME)
          ) {
            finalMultiRanges = draft.multiRanges
              .map((r) => ({ from: r.from.trim(), to: r.to.trim() }))
              .filter((r) => r.from.length > 0 || r.to.length > 0);
          } else if (colType === DATA_TYPES.DATE) {
            finalMultiValues = draft.discreteDates.filter((d) => d.trim().length > 0);
          } else if (colType === DATA_TYPES.NUMBER) {
            finalMultiValues = parseMultiValueTokens(draft.multiText)
              .map((t) => expandAllShortcuts(t))
              .filter((t) => !isNaN(parseFloat(t.replace(/,/g, ''))));
          } else if (colType === DATA_TYPES.TIME || col.editorType === EDITOR_TYPES.TIME) {
            finalMultiValues = parseMultiValueTokens(draft.multiText).filter(
              (t) => parseTimeToMinutes(t) !== null
            );
          } else {
            finalMultiValues = parseMultiValueTokens(draft.multiText);
          }

          const hasVals = Array.isArray(finalMultiValues) && finalMultiValues.length > 0;
          const hasRanges = Array.isArray(finalMultiRanges) && finalMultiRanges.length > 0;

          if (!hasVals && !hasRanges) {
            onColumnFilterChange?.(scopeKey, {
              ...existing,
              op: getDefaultInputOpForColumn(col, 'simple'),
              val: '',
              mode: FILTER_MODES.SIMPLE,
              multiValues: undefined,
              multiRanges: undefined,
            });
            return;
          }

          onColumnFilterChange?.(scopeKey, {
            ...existing,
            op: draft.op,
            val: hasVals ? finalMultiValues!.join('; ') : `${finalMultiRanges!.length} khoảng`,
            mode: FILTER_MODES.MULTI,
            multiValues: finalMultiValues,
            multiRanges: finalMultiRanges,
          });
          return;
        }

        const trimmedVal = draft.singleVal.trim();
        onColumnFilterChange?.(scopeKey, {
          ...existing,
          op: draft.op,
          val: trimmedVal,
          mode: FILTER_MODES.SIMPLE,
          multiValues: undefined,
          multiRanges: undefined,
        });
      });
    }

    onClose();
  };

  // Nút Đặt lại: xóa toàn bộ cấu hình sắp xếp và tìm kiếm/lọc
  const handleReset = () => {
    setSelectedSortCol('');
    setSelectedSortDir('asc');
    setSearchScope(canSearchAll ? '__ALL__' : filterableColumns[0]?.key || '__ALL__');
    setAllSearchDraft('');
    setColDrafts({});
    setDateAddPickerVal('');
    dirtyScopesRef.current = new Set();

    if (canSort) onSortChange?.(null);
    if (canSearchAll) onSearchQueryChange?.('');
    if (canFilterByCol) onClearAllColumnFilters?.();

    onClose();
  };

  if (!canSort && !canSearchOrFilter) return null;

  const modalTitle =
    canSort && canSearchOrFilter
      ? 'LỌC & SẮP XẾP'
      : canSort
      ? 'SẮP XẾP'
      : 'TÌM KIẾM & BỘ LỌC';

  const resolvedTab: DrawerTabKey = hasBothTabs
    ? activeTab
    : canSearchOrFilter
    ? 'filter'
    : 'sort';

  const activeScopeCol = searchScope !== '__ALL__' ? filterColMap[searchScope] : undefined;
  const activeColDraft = activeScopeCol
    ? colDrafts[activeScopeCol.key] ??
      buildInitialColDraft(activeScopeCol, columnFilters[activeScopeCol.key])
    : undefined;
  const activeColType = activeScopeCol
    ? getColumnFilterType(activeScopeCol.key, [activeScopeCol])
    : DATA_TYPES.TEXT;
  const activeColOps =
    activeScopeCol && activeColDraft
      ? getOpsForColumn(activeScopeCol, activeColDraft.mode)
      : [];
  const isActiveColNoInput = activeColDraft ? isNoInputFilterOp(activeColDraft.op) : false;

  const activeDateBounds = activeScopeCol
    ? activeScopeCol.minDate && activeScopeCol.maxDate
      ? { min: activeScopeCol.minDate, max: activeScopeCol.maxDate }
      : getColumnDateBounds?.(activeScopeCol.key) || { min: '2017-01-01', max: '2027-12-31' }
    : { min: '2017-01-01', max: '2027-12-31' };

  return (
    <Drawer
      open={isOpen}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
      surfaceTheme={surfaceTheme}
    >
      <DrawerContent>
        <DrawerSwipeHandle />
        <DrawerHeader>
          <DrawerTitle>{modalTitle}</DrawerTitle>
          <DrawerDescription>
            Áp dụng cho dữ liệu hiển thị ({totalRows.toLocaleString('vi-VN')})
          </DrawerDescription>

          {hasBothTabs && (
            <div
              role="tablist"
              aria-label={modalTitle}
              className="mt-3 grid grid-cols-2 rounded-md border overflow-hidden"
              style={{ borderColor: 'var(--control-border)' }}
            >
              <button
                type="button"
                role="tab"
                aria-selected={resolvedTab === 'filter'}
                onClick={() => setActiveTab('filter')}
                className={`h-9 min-h-[36px] px-3 text-xs font-semibold cursor-pointer touch-manipulation ${
                  resolvedTab === 'filter' ? '' : 'hover:bg-surface-hover'
                }`}
                style={{
                  backgroundColor:
                    resolvedTab === 'filter'
                      ? 'var(--popup-item-selected-bg)'
                      : 'var(--control-background)',
                  color:
                    resolvedTab === 'filter'
                      ? 'var(--popup-item-selected-fg, #ffffff)'
                      : 'var(--agv-text-main)',
                }}
              >
                Tìm kiếm & Lọc
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={resolvedTab === 'sort'}
                onClick={() => setActiveTab('sort')}
                className={`h-9 min-h-[36px] px-3 text-xs font-semibold border-l cursor-pointer touch-manipulation ${
                  resolvedTab === 'sort' ? '' : 'hover:bg-surface-hover'
                }`}
                style={{
                  borderColor: 'var(--agv-border)',
                  backgroundColor:
                    resolvedTab === 'sort'
                      ? 'var(--popup-item-selected-bg)'
                      : 'var(--control-background)',
                  color:
                    resolvedTab === 'sort'
                      ? 'var(--popup-item-selected-fg, #ffffff)'
                      : 'var(--agv-text-main)',
                }}
              >
                Sắp xếp
              </button>
            </div>
          )}
        </DrawerHeader>

        <DrawerBody className="space-y-3">
          {/* TAB 1: TÌM KIẾM & LỌC */}
          {resolvedTab === 'filter' && canSearchOrFilter && (
            <div role="tabpanel" className="space-y-3">
              {/* PHẠM VI TOÀN VĂN: Giữ nguyên 1 ô tìm kiếm gọn nhẹ */}
              {searchScope === '__ALL__' && canSearchAll && (
                <input
                  type="text"
                  value={allSearchDraft}
                  onChange={(e) => handleAllSearchTextChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleApply();
                    }
                  }}
                  placeholder="Nhập dữ liệu cần tìm..."
                  {...NO_AUTOFILL_PROPS}
                  className="agv-control w-full h-10 md:h-9 min-h-[36px] px-3 text-xs"
                />
              )}

              {/* PHẠM VI THEO CỘT CỤ THỂ: Thanh icon toán tử 1 hàng + Ô nhập đồng bộ PC */}
              {activeScopeCol && activeColDraft && (
                <div className="space-y-2">
                  {/* Dòng 1: <Tên cột> · <Tên toán tử> + [ Một giá trị | Nhiều giá trị ] */}
                  <div className="flex items-center justify-between gap-2">
                    <div
                      className="flex items-center gap-1 min-w-0 flex-1 text-xs font-medium"
                      style={{ color: 'var(--agv-text-muted)' }}
                    >
                      <span className="truncate">
                        {activeScopeCol.title || activeScopeCol.key}
                      </span>
                      <span className="shrink-0">
                        · {FILTER_OP_META[activeColDraft.op]?.label || activeColDraft.op}
                      </span>
                    </div>

                    <div
                      className="inline-flex rounded-md border overflow-hidden shrink-0"
                      style={{ borderColor: 'var(--control-border)' }}
                    >
                      {COL_INPUT_MODE_BUTTONS.map((btn, idx) => {
                        const isModeActive =
                          !isActiveColNoInput && activeColDraft.mode === btn.mode;
                        return (
                          <button
                            key={btn.mode}
                            type="button"
                            aria-pressed={isModeActive}
                            onClick={() => handleSwitchColInputMode(activeScopeCol, btn.mode)}
                            className={`h-8 min-h-[32px] px-3 text-xs font-medium cursor-pointer touch-manipulation ${
                              idx > 0 ? 'border-l' : ''
                            } ${isModeActive ? '' : 'hover:bg-surface-hover'}`}
                            style={{
                              borderColor: idx > 0 ? 'var(--agv-border)' : undefined,
                              backgroundColor: isModeActive
                                ? 'var(--popup-item-selected-bg)'
                                : 'var(--control-background)',
                              color: isModeActive
                                ? 'var(--popup-item-selected-fg, #ffffff)'
                                : 'var(--agv-text-main)',
                            }}
                          >
                            {btn.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Dòng 2: Thanh Toán Tử Chỉ Hiện Icon — 1 Hàng Chia Đều, 0 Cuộn Ngang */}
                  {activeColOps.length > 0 && (
                    <div
                      role="radiogroup"
                      aria-label={`Toán tử lọc ${activeScopeCol.title || activeScopeCol.key}`}
                      className="grid w-full rounded-md border overflow-hidden"
                      style={{
                        borderColor: 'var(--control-border)',
                        gridTemplateColumns: `repeat(${activeColOps.length}, minmax(0, 1fr))`,
                      }}
                    >
                      {activeColOps.map((op, idx) => {
                        const isOpSelected = activeColDraft.op === op;
                        return (
                          <button
                            key={op}
                            type="button"
                            role="radio"
                            aria-checked={isOpSelected}
                            aria-label={FILTER_OP_META[op]?.label || op}
                            onClick={() => handleSelectColOp(activeScopeCol, op)}
                            className={`h-9 min-h-[36px] flex items-center justify-center cursor-pointer touch-manipulation ${
                              idx > 0 ? 'border-l' : ''
                            } ${isOpSelected ? '' : 'hover:bg-surface-hover'}`}
                            style={{
                              borderColor: idx > 0 ? 'var(--agv-border)' : undefined,
                              backgroundColor: isOpSelected
                                ? 'var(--popup-item-selected-bg)'
                                : 'var(--control-background)',
                              color: isOpSelected
                                ? 'var(--popup-item-selected-fg, #ffffff)'
                                : 'var(--agv-text-main)',
                            }}
                          >
                            <FilterOpIcon op={op} size={14} className="shrink-0" />
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Dòng 3: Ô Nhập Liệu Đồng Bộ Theo Dạng Cột & Toán Tử Như PC */}
                  {!isActiveColNoInput &&
                    (activeColDraft.mode === 'simple' ? (
                      (() => {
                        const opLabel =
                          FILTER_OP_META[activeColDraft.op]?.label || 'Nhập dữ liệu';
                        const hasSingleVal = activeColDraft.singleVal.trim().length > 0;
                        const rangePair = splitRangePair(
                          activeColDraft.singleVal,
                          activeColType,
                          activeScopeCol.isDateRange
                        );

                        if (activeColType === DATA_TYPES.DATE) {
                          if (
                            activeScopeCol.isDateRange ||
                            isBetweenFilterOp(activeColDraft.op)
                          ) {
                            return (
                              <AdvDateRangePicker
                                from={rangePair.from}
                                to={rangePair.to}
                                onChange={(range) => {
                                  const f = range.from || '';
                                  const t = range.to || '';
                                  const combined =
                                    f && t ? `${f}..${t}` : f ? `${f}..` : t ? `..${t}` : '';
                                  updateColDraft(activeScopeCol, {
                                    singleVal: combined,
                                    op: FILTER_OPS.BETWEEN,
                                  });
                                }}
                                min={activeDateBounds.min}
                                max={activeDateBounds.max}
                                placeholderFrom={activeScopeCol.isDateRange ? 'Ngày đi' : 'Từ'}
                                placeholderTo={activeScopeCol.isDateRange ? 'Ngày về' : 'Đến'}
                                theme={surfaceTheme}
                                size="md"
                                showPreset={true}
                                dualMonth={false}
                                showTime={Boolean(activeScopeCol.showTime)}
                              />
                            );
                          }

                          return (
                            <AdvDatePicker
                              value={activeColDraft.singleVal}
                              onChange={(val, range) => {
                                if (range && range.from && range.to && range.from !== range.to) {
                                  updateColDraft(activeScopeCol, {
                                    singleVal: `${range.from}..${range.to}`,
                                    op: FILTER_OPS.BETWEEN,
                                  });
                                } else {
                                  updateColDraft(activeScopeCol, { singleVal: val });
                                }
                              }}
                              min={activeDateBounds.min}
                              max={activeDateBounds.max}
                              placeholder={`${opLabel}...`}
                              showTime={Boolean(activeScopeCol.showTime)}
                              theme={surfaceTheme}
                              showPreset={true}
                              size="md"
                              className="w-full"
                            />
                          );
                        }

                        if (activeColType === DATA_TYPES.TIME) {
                          if (isBetweenFilterOp(activeColDraft.op)) {
                            return (
                              <div className="agv-control agv-control-box w-full h-10 md:h-9 min-h-[36px] flex items-center px-2">
                                <TimeRangeFilterInput
                                  from={rangePair.from}
                                  to={rangePair.to}
                                  onChange={(f, t) => {
                                    const combined =
                                      f && t
                                        ? f === t
                                          ? f
                                          : `${f}..${t}`
                                        : f || (t ? `..${t}` : '');
                                    updateColDraft(activeScopeCol, { singleVal: combined });
                                  }}
                                  onClear={() => updateColDraft(activeScopeCol, { singleVal: '' })}
                                  hasValue={hasSingleVal}
                                />
                              </div>
                            );
                          }

                          return (
                            <div className="agv-control agv-control-box w-full h-10 md:h-9 min-h-[36px] flex items-center px-2">
                              <TimeFilterInput
                                value={activeColDraft.singleVal}
                                onChange={(val) =>
                                  updateColDraft(activeScopeCol, { singleVal: val })
                                }
                                onClear={() => updateColDraft(activeScopeCol, { singleVal: '' })}
                                placeholder="HH:mm"
                                hasValue={hasSingleVal}
                              />
                            </div>
                          );
                        }

                        if (activeColType === DATA_TYPES.NUMBER) {
                          if (isBetweenFilterOp(activeColDraft.op)) {
                            return (
                              <div className="agv-control agv-control-box w-full h-10 md:h-9 min-h-[36px] flex items-center px-2">
                                <NumberRangeFilterInput
                                  from={rangePair.from}
                                  to={rangePair.to}
                                  onChange={(f, t) => {
                                    const combined =
                                      f && t ? `${f}..${t}` : f ? `${f}..` : t ? `..${t}` : '';
                                    updateColDraft(activeScopeCol, {
                                      singleVal: combined,
                                      op: FILTER_OPS.BETWEEN,
                                    });
                                  }}
                                  onClear={() => updateColDraft(activeScopeCol, { singleVal: '' })}
                                  hasValue={hasSingleVal}
                                />
                              </div>
                            );
                          }

                          return (
                            <div className="agv-control agv-control-box w-full h-10 md:h-9 min-h-[36px] flex items-center px-2">
                              <SmartNumberFilterInput
                                value={activeColDraft.singleVal}
                                onChange={(val, opOverride) => {
                                  updateColDraft(activeScopeCol, {
                                    singleVal: val,
                                    ...(opOverride ? { op: opOverride } : {}),
                                  });
                                }}
                                onClear={() => updateColDraft(activeScopeCol, { singleVal: '' })}
                                placeholder={`${opLabel}...`}
                                hasValue={hasSingleVal}
                              />
                            </div>
                          );
                        }

                        return (
                          <div className="agv-control agv-control-box relative w-full h-10 md:h-9 min-h-[36px] flex items-center px-3">
                            <input
                              type="text"
                              value={activeColDraft.singleVal}
                              onChange={(e) =>
                                updateColDraft(activeScopeCol, { singleVal: e.target.value })
                              }
                              onPaste={(e) => handleTextSinglePaste(activeScopeCol, e)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleApply();
                                }
                              }}
                              placeholder={`${opLabel}...`}
                              {...NO_AUTOFILL_PROPS}
                              className={`w-full h-full bg-transparent text-xs outline-none border-none placeholder:text-[var(--agv-text-muted)] placeholder:opacity-60 ${
                                hasSingleVal ? 'pr-7' : ''
                              }`}
                              style={{ color: 'var(--agv-text-main)', minHeight: '28px' }}
                            />
                            {hasSingleVal && (
                              <button
                                type="button"
                                aria-label="Xóa giá trị lọc"
                                onClick={() => updateColDraft(activeScopeCol, { singleVal: '' })}
                                className="agv-inline-clear-destructive absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 min-h-[28px] min-w-[28px] rounded touch-manipulation"
                              >
                                <X size={13} strokeWidth={2.2} />
                              </button>
                            )}
                          </div>
                        );
                      })()
                    ) : (
                      /* CHẾ ĐỘ NHIỀU GIÁ TRỊ (MULTI) ĐỒNG BỘ THEO DẠNG CỘT & TOÁN TỬ NHƯ PC */
                      (() => {
                        if (
                          isBetweenFilterOp(activeColDraft.op) &&
                          (activeColType === DATA_TYPES.NUMBER ||
                            activeColType === DATA_TYPES.DATE ||
                            activeColType === DATA_TYPES.TIME)
                        ) {
                          const addLabel =
                            activeColType === DATA_TYPES.DATE
                              ? '+ Thêm khoảng ngày'
                              : activeColType === DATA_TYPES.TIME
                              ? '+ Thêm khoảng giờ'
                              : '+ Thêm khoảng số';

                          return (
                            <div className="space-y-2">
                              <div
                                className={`space-y-2 ${
                                  activeColDraft.multiRanges.length > 3
                                    ? 'max-h-[148px] overflow-y-auto pr-1'
                                    : ''
                                }`}
                              >
                                {activeColDraft.multiRanges.map((rng, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center gap-2 w-full min-w-0"
                                  >
                                    <span
                                      className="text-xs w-6 min-w-[24px] shrink-0 text-center select-none tabular-nums"
                                      style={{ color: 'var(--agv-text-muted)' }}
                                    >
                                      #{idx + 1}
                                    </span>

                                    <div className="flex-1 min-w-0">
                                      {activeColType === DATA_TYPES.DATE ? (
                                        <AdvDateRangePicker
                                          from={rng.from}
                                          to={rng.to}
                                          onChange={(range) =>
                                            handleUpdateRangeRow(
                                              activeScopeCol,
                                              idx,
                                              range.from || '',
                                              range.to || ''
                                            )
                                          }
                                          min={activeDateBounds.min}
                                          max={activeDateBounds.max}
                                          placeholderFrom="Từ"
                                          placeholderTo="Đến"
                                          theme={surfaceTheme}
                                          size="md"
                                          showPreset={true}
                                          dualMonth={false}
                                          showTime={Boolean(activeScopeCol.showTime)}
                                        />
                                      ) : activeColType === DATA_TYPES.TIME ? (
                                        <div className="agv-control agv-control-box w-full h-10 md:h-9 min-h-[36px] flex items-center px-2">
                                          <TimeRangeFilterInput
                                            from={rng.from}
                                            to={rng.to}
                                            onChange={(f, t) =>
                                              handleUpdateRangeRow(activeScopeCol, idx, f, t)
                                            }
                                            hasValue={false}
                                          />
                                        </div>
                                      ) : (
                                        <div className="agv-control agv-control-box w-full h-10 md:h-9 min-h-[36px] flex items-center px-2">
                                          <NumberRangeFilterInput
                                            from={rng.from}
                                            to={rng.to}
                                            onChange={(f, t) =>
                                              handleUpdateRangeRow(activeScopeCol, idx, f, t)
                                            }
                                            hasValue={false}
                                          />
                                        </div>
                                      )}
                                    </div>

                                    <AdvButton
                                      variant="destructive"
                                      size="icon"
                                      aria-label={`Xóa khoảng ${idx + 1}`}
                                      onClick={() => handleRemoveRangeRow(activeScopeCol, idx)}
                                      className="touch-manipulation"
                                    >
                                      <X size={14} strokeWidth={2.2} />
                                    </AdvButton>
                                  </div>
                                ))}
                              </div>

                              <AdvButton
                                variant="ghost"
                                size="default"
                                onClick={() => handleAddRangeRow(activeScopeCol)}
                                className="w-full text-[var(--agv-accent)] font-medium touch-manipulation"
                              >
                                {addLabel}
                              </AdvButton>
                            </div>
                          );
                        }

                        if (activeColType === DATA_TYPES.DATE) {
                          return (
                            <div className="space-y-2">
                              <AdvDatePicker
                                value={dateAddPickerVal}
                                onChange={(val, rangeMeta) => {
                                  if (
                                    rangeMeta?.from &&
                                    rangeMeta?.to &&
                                    rangeMeta.from !== rangeMeta.to
                                  ) {
                                    handleAddDiscreteDate(activeScopeCol, rangeMeta.from);
                                    handleAddDiscreteDate(activeScopeCol, rangeMeta.to);
                                  } else if (val) {
                                    handleAddDiscreteDate(activeScopeCol, val);
                                  }
                                }}
                                min={activeDateBounds.min}
                                max={activeDateBounds.max}
                                placeholder="Chọn ngày để thêm vào danh sách..."
                                showTime={Boolean(activeScopeCol.showTime)}
                                theme={surfaceTheme}
                                showPreset={true}
                                size="md"
                                className="w-full"
                              />

                              <div
                                className="flex flex-wrap gap-2 min-h-[52px] max-h-[120px] overflow-y-auto p-2 rounded-md border"
                                style={{
                                  borderColor: 'var(--control-border)',
                                  backgroundColor: 'var(--control-background)',
                                }}
                              >
                                {activeColDraft.discreteDates.length === 0 ? (
                                  <span
                                    className="text-xs italic self-center"
                                    style={{ color: 'var(--agv-text-muted)' }}
                                  >
                                    Chưa chọn ngày nào.
                                  </span>
                                ) : (
                                  activeColDraft.discreteDates.map((d) => (
                                    <AdvButton
                                      key={d}
                                      variant="destructive"
                                      size="sm"
                                      onClick={() => handleRemoveDiscreteDate(activeScopeCol, d)}
                                      className="px-2 gap-1 font-medium touch-manipulation"
                                    >
                                      <span className="tabular-nums">{d}</span>
                                      <X size={12} strokeWidth={2.2} className="shrink-0" />
                                    </AdvButton>
                                  ))
                                )}
                              </div>
                            </div>
                          );
                        }

                        return (
                          <textarea
                            rows={3}
                            value={activeColDraft.multiText}
                            onChange={(e) =>
                              updateColDraft(activeScopeCol, { multiText: e.target.value })
                            }
                            placeholder="Dán hoặc nhập danh sách (mỗi dòng hoặc dấu phẩy)..."
                            {...NO_AUTOFILL_PROPS}
                            className="agv-control w-full min-h-[80px] max-h-[120px] px-3 py-2 text-xs leading-relaxed resize-y overflow-y-auto"
                          />
                        );
                      })()
                    ))}
                </div>
              )}

              {canFilterByCol && filterScopeOptions.length > 1 && (
                <div className="space-y-2">
                  <div
                    className="text-xs font-medium"
                    style={{ color: 'var(--agv-text-muted)' }}
                  >
                    Chọn phạm vi tìm kiếm:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {filterScopeOptions.map((opt) => {
                      const isScopeSelected = searchScope === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          aria-pressed={isScopeSelected}
                          onClick={() => setSearchScope(opt.value)}
                          className={`min-h-[36px] h-9 px-3 py-2 inline-flex items-center justify-center rounded-md border text-xs font-medium cursor-pointer touch-manipulation ${
                            isScopeSelected ? '' : 'hover:bg-surface-hover'
                          }`}
                          style={{
                            backgroundColor: isScopeSelected
                              ? 'var(--popup-item-selected-bg)'
                              : 'var(--control-background)',
                            borderColor: isScopeSelected
                              ? 'var(--popup-item-selected-bg)'
                              : 'var(--control-border)',
                            color: isScopeSelected
                              ? 'var(--popup-item-selected-fg, #ffffff)'
                              : 'var(--agv-text-main)',
                          }}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SẮP XẾP */}
          {resolvedTab === 'sort' && canSort && (
            <div role="tabpanel" className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <span
                  className="text-xs font-medium shrink-0"
                  style={{ color: 'var(--agv-text-muted)' }}
                >
                  Chiều sắp xếp
                </span>
                <div
                  className="inline-flex rounded-md border overflow-hidden shrink-0"
                  style={{ borderColor: 'var(--control-border)' }}
                >
                  {SORT_DIRECTION_BUTTONS.map((opt, idx) => {
                    const hasSelectedCol = Boolean(selectedSortCol);
                    const isDirActive = hasSelectedCol && selectedSortDir === opt.dir;
                    return (
                      <button
                        key={opt.dir}
                        type="button"
                        disabled={!hasSelectedCol}
                        aria-pressed={isDirActive}
                        onClick={() => setSelectedSortDir(opt.dir)}
                        className={`h-9 min-h-[36px] px-3 text-xs font-medium touch-manipulation ${
                          idx > 0 ? 'border-l' : ''
                        } ${
                          !hasSelectedCol
                            ? 'opacity-50 cursor-not-allowed'
                            : isDirActive
                            ? 'cursor-pointer'
                            : 'cursor-pointer hover:bg-surface-hover'
                        }`}
                        style={{
                          borderColor: idx > 0 ? 'var(--agv-border)' : undefined,
                          backgroundColor: isDirActive
                            ? 'var(--popup-item-selected-bg)'
                            : 'var(--control-background)',
                          color: isDirActive
                            ? 'var(--popup-item-selected-fg, #ffffff)'
                            : 'var(--agv-text-main)',
                        }}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div
                role="listbox"
                aria-label="Danh sách cột sắp xếp"
                className="rounded-md border overflow-hidden"
                style={{
                  borderColor: 'var(--control-border)',
                  backgroundColor: 'var(--control-background)',
                }}
              >
                {sortableColumns.map((col, idx) => {
                  const isColSelected = selectedSortCol === col.key;
                  return (
                    <button
                      key={col.key}
                      type="button"
                      role="option"
                      aria-selected={isColSelected}
                      onClick={() => handleToggleSortCol(col.key)}
                      className={`min-h-[40px] w-full px-3 py-2 text-left text-xs cursor-pointer touch-manipulation flex items-center ${
                        idx > 0 ? 'border-t' : ''
                      } ${
                        isColSelected
                          ? 'font-semibold'
                          : 'font-medium hover:bg-surface-hover'
                      }`}
                      style={{
                        borderColor: idx > 0 ? 'var(--agv-border)' : undefined,
                        backgroundColor: isColSelected
                          ? 'var(--popup-item-selected-bg)'
                          : 'var(--control-background)',
                        color: isColSelected
                          ? 'var(--popup-item-selected-fg, #ffffff)'
                          : 'var(--agv-text-main)',
                      }}
                    >
                      <span className="truncate">{col.title || col.key}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </DrawerBody>

        <DrawerFooter>
          <AdvButton
            variant="outline"
            size="default"
            onClick={handleReset}
            className="w-full font-semibold touch-manipulation"
          >
            Đặt lại
          </AdvButton>

          <AdvButton
            variant="default"
            size="default"
            onClick={handleApply}
            className="w-full font-semibold touch-manipulation"
          >
            Áp dụng
          </AdvButton>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
