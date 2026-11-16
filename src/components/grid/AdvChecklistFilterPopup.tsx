import React, {
  useState,
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useMemo,
  useCallback,
} from 'react';
import { createPortal } from 'react-dom';
import { Search, X, FilterX } from 'lucide-react';
import { getThemeClass } from '../../themes';
import { normalizeSearchText } from '../ui/enterpriseEditorUtils';
import { AdvOverlayScroll } from '../ui/AdvOverlayScroll';
import { AdvAnchoredPopover } from '../ui/AdvPopover';
import { useVirtualList } from '../ui/useVirtualList';
import { AdvCheckbox } from './AdvCheckbox';
import { MorphChevronIcon } from '../ui/MorphIcons';
import { AdvButton } from '../ui/AdvButton';
import { isNoInputFilterOp, parseDatePartsYMD, toDateKeyYMD } from './gridFormatUtils';
import { FILTER_MODES, DATA_TYPES, SURFACE_THEMES } from './types';
import { NO_AUTOFILL_PROPS } from './constants';

/* ==============================================================================
   1. ĐỐI TƯỢNG SO SÁNH TIẾNG VIỆT CHUẨN INTL COLLATOR
   ============================================================================== */
const VI_COLLATOR =
  typeof Intl !== 'undefined' && Intl.Collator
    ? new Intl.Collator('vi', { sensitivity: 'base', numeric: true })
    : null;

function parseNumberVal(val: any): number {
  if (typeof val === 'number') return val;
  const s = String(val ?? '').replace(/,/g, '').trim();
  const n = parseFloat(s);
  return isNaN(n) ? NaN : n;
}

/* ==============================================================================
   2. HÀM LẤY DANH SÁCH GIÁ TRỊ PHÂN BIỆT (DISTINCT VALUES CACHE)
   ============================================================================== */
export function getDistinctColumnValues(
  colKey: string,
  data: any[],
  dType: string | undefined,
  cacheRef?: React.MutableRefObject<Record<string, { values: string[]; hasBlanks: boolean }>>,
  getRowItem?: (idx: number) => any,
  totalRowCount?: number,
  getCellValue?: (rowIndex: number, colKey: string) => any
): { values: string[]; hasBlanks: boolean } {
  if (cacheRef?.current?.[colKey]) {
    return cacheRef.current[colKey];
  }

  const set = new Set<string>();
  let hasBlanks = false;

  // 1. Nếu có getCellValue siêu tốc trực tiếp từ dataset đầy đủ (50.000 dòng chạy dưới 15ms)
  if (getCellValue && totalRowCount && totalRowCount > 0) {
    for (let r = 0; r < totalRowCount; r++) {
      const val = getCellValue(r, colKey);
      if (val === null || val === undefined || String(val).trim() === '') {
        hasBlanks = true;
      } else {
        set.add(String(val).trim());
      }
    }
  } else {
    const extractVal = (row: any, rIdx: number) => {
      if (!row || row._isGroupRow) return undefined;
      // Kiểm tra nếu ô nằm trong Map cells (RowData)
      if (row.cells && typeof row.cells.get === 'function') {
        const cell = row.cells.get(colKey);
        if (cell !== undefined) return cell?.value;
      }
      // Kiểm tra nếu có trường trực tiếp trên row object
      if (row[colKey] !== undefined) {
        return row[colKey];
      }
      return undefined;
    };

    if (Array.isArray(data) && data.length > 0) {
      const len = data.length;
      for (let i = 0; i < len; i++) {
        const val = extractVal(data[i], i);
        if (val === null || val === undefined || String(val).trim() === '') {
          hasBlanks = true;
        } else {
          set.add(String(val).trim());
        }
      }
    } else if (getRowItem && totalRowCount && totalRowCount > 0) {
      for (let i = 0; i < totalRowCount; i++) {
        const row = getRowItem(i);
        const val = extractVal(row, i);
        if (val === null || val === undefined || String(val).trim() === '') {
          hasBlanks = true;
        } else {
          set.add(String(val).trim());
        }
      }
    }
  }

  const isNumber = dType === DATA_TYPES.NUMBER;
  const isDate = dType === DATA_TYPES.DATE || dType === DATA_TYPES.TIME;

  let sorted: string[];
  if (isNumber) {
    sorted = Array.from(set).sort((a, b) => {
      const numA = parseNumberVal(a);
      const numB = parseNumberVal(b);
      if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
      return a.localeCompare(b);
    });
  } else if (isDate) {
    sorted = Array.from(set).sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  } else if (VI_COLLATOR) {
    sorted = Array.from(set).sort(VI_COLLATOR.compare);
  } else {
    sorted = Array.from(set).sort((a, b) =>
      String(a).localeCompare(String(b), 'vi', { sensitivity: 'base', numeric: true })
    );
  }

  const result = {
    values: sorted,
    hasBlanks,
  };

  if (cacheRef?.current) {
    cacheRef.current[colKey] = result;
  }

  return result;
}



/* ==============================================================================
   4. ADVCHECKLIST VIRTUAL LIST (Ảo hóa DOM danh sách chọn lọc - Giới hạn vẽ ~15-20 node)
   ============================================================================== */
export interface AdvChecklistVirtualListProps {
  items: any[];
  selectedSet: Set<any>;
  onToggle: (val: any) => void;
  formatDisplay: (colKey: string, val: any) => string;
  colKey: string;
  showBlanksInList: boolean;
}

export const AdvChecklistVirtualList: React.FC<AdvChecklistVirtualListProps> = React.memo(
  ({ items, selectedSet, onToggle, formatDisplay, colKey, showBlanksInList }) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const virtual = useVirtualList({
      itemCount: items.length,
      itemHeight: 28,
      viewportRef: containerRef,
      overscan: 6,
      threshold: 1,
      defaultViewportHeight: 224,
    });

    const visibleItems = items.slice(virtual.startIndex, virtual.endIndex);

    useEffect(() => {
      virtual.resetScroll();
    }, [items]);

    if (items.length === 0 && !showBlanksInList) {
      return (
        <div className="max-h-52 px-2 py-4 text-center text-xs italic text-[var(--agv-text-muted)]">
          Không tìm thấy giá trị phù hợp
        </div>
      );
    }

    return (
      <AdvOverlayScroll
        viewportRef={containerRef}
        onScroll={virtual.handleScroll}
        viewportClassName="max-h-56 overflow-y-auto overflow-x-hidden p-1 overscroll-contain select-none"
        viewportStyle={{ maxHeight: '224px' }}
        contentSignature={items.length}
      >
        {virtual.topSpacer > 0 && (
          <div
            className="agv-checklist-spacer-top pointer-events-none select-none"
            style={{ height: `${virtual.topSpacer}px` }}
            aria-hidden="true"
          />
        )}
        {visibleItems.map((val) => {
          const isChecked = selectedSet.has(val);
          const displayLabel = formatDisplay(colKey, val);

          return (
            <div
              key={String(val)}
              onClick={() => onToggle(val)}
              className="flex h-[28px] min-h-[28px] cursor-pointer select-none items-center gap-2 rounded-sm px-2 text-xs text-[var(--agv-text-main)] hover:bg-[var(--popup-item-hover-bg)]"
            >
              <AdvCheckbox checked={isChecked} />
              <span className="truncate">
                {displayLabel}
              </span>
            </div>
          );
        })}
        {virtual.bottomSpacer > 0 && (
          <div
            className="agv-checklist-spacer-bottom pointer-events-none select-none"
            style={{ height: `${virtual.bottomSpacer}px` }}
            aria-hidden="true"
          />
        )}
      </AdvOverlayScroll>
    );
  }
);
AdvChecklistVirtualList.displayName = 'AdvChecklistVirtualList';

/* ==============================================================================
   4B. CÂY LỌC THỜI GIAN PHÂN CẤP (Năm -> Tháng -> Ngày) & ẢO HÓA DOM
   ============================================================================== */
interface ChecklistDateDayNode {
  key: string; // 'YYYY-MM-DD'
  day: number;
  dayLabel: string; // '01'..'31'
  fullLabel: string; // '01/08/2026'
}

interface ChecklistDateMonthNode {
  key: string; // 'YYYY-MM'
  year: number;
  month: number;
  label: string; // 'Tháng 08'
  days: ChecklistDateDayNode[];
  dayKeys: string[];
}

interface ChecklistDateYearNode {
  key: string; // 'YYYY'
  year: number;
  label: string; // '2026'
  months: ChecklistDateMonthNode[];
  dayKeys: string[];
  isDefaultExpanded: boolean;
}

type ChecklistDateTreeRow =
  | { kind: 'year'; node: ChecklistDateYearNode; isExpanded: boolean }
  | { kind: 'month'; node: ChecklistDateMonthNode; isExpanded: boolean }
  | { kind: 'day'; node: ChecklistDateDayNode }
  | { kind: 'raw'; value: string };

function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

function buildFilteredDateTree(
  rawValues: string[],
  q: string,
  noToneQ: string
): {
  years: ChecklistDateYearNode[];
  unparsed: string[];
  matchingKeys: string[];
} {
  const yearMap = new Map<
    number,
    Map<number, Map<number, ChecklistDateDayNode>>
  >();
  const unparsedAll: string[] = [];
  const seenUnparsed = new Set<string>();

  for (let i = 0; i < rawValues.length; i++) {
    const raw = rawValues[i];
    const parsed = parseDatePartsYMD(raw);
    if (!parsed) {
      const str = String(raw).trim();
      if (str && !seenUnparsed.has(str)) {
        seenUnparsed.add(str);
        unparsedAll.push(str);
      }
      continue;
    }

    let monthMap = yearMap.get(parsed.year);
    if (!monthMap) {
      monthMap = new Map();
      yearMap.set(parsed.year, monthMap);
    }
    let dayMap = monthMap.get(parsed.month);
    if (!dayMap) {
      dayMap = new Map();
      monthMap.set(parsed.month, dayMap);
    }
    if (!dayMap.has(parsed.day)) {
      const dd = pad2(parsed.day);
      const mm = pad2(parsed.month);
      dayMap.set(parsed.day, {
        key: parsed.key,
        day: parsed.day,
        dayLabel: dd,
        fullLabel: `${dd}/${mm}/${parsed.year}`,
      });
    }
  }

  const sortedYears = Array.from(yearMap.keys()).sort((a, b) => b - a);
  const years: ChecklistDateYearNode[] = [];
  const matchingKeys: string[] = [];

  for (let yi = 0; yi < sortedYears.length; yi++) {
    const y = sortedYears[yi];
    const yStr = String(y);
    const yMatches = Boolean(q) && yStr.includes(q);
    const monthMap = yearMap.get(y)!;
    const sortedMonths = Array.from(monthMap.keys()).sort((a, b) => a - b);

    const months: ChecklistDateMonthNode[] = [];
    const yDayKeys: string[] = [];

    for (let mi = 0; mi < sortedMonths.length; mi++) {
      const m = sortedMonths[mi];
      const mPad = pad2(m);
      const mLabel = `Tháng ${mPad}`;
      const mSearchStr = `${mLabel} thang ${m} thang ${mPad} ${mPad}/${yStr} ${m}/${yStr} ${yStr}-${mPad}`.toLowerCase();
      const mMatches =
        Boolean(q) &&
        (mSearchStr.includes(q) || normalizeSearchText(mSearchStr).includes(noToneQ));

      const dayMap = monthMap.get(m)!;
      const sortedDays = Array.from(dayMap.keys()).sort((a, b) => a - b);
      const days: ChecklistDateDayNode[] = [];
      const mDayKeys: string[] = [];

      for (let di = 0; di < sortedDays.length; di++) {
        const dNode = dayMap.get(sortedDays[di])!;
        if (q && !yMatches && !mMatches) {
          const dayMatches =
            dNode.dayLabel.includes(q) ||
            dNode.fullLabel.includes(q) ||
            dNode.key.includes(q);
          if (!dayMatches) continue;
        }
        days.push(dNode);
        mDayKeys.push(dNode.key);
        yDayKeys.push(dNode.key);
        matchingKeys.push(dNode.key);
      }

      if (days.length > 0) {
        months.push({
          key: `${yStr}-${mPad}`,
          year: y,
          month: m,
          label: mLabel,
          days,
          dayKeys: mDayKeys,
        });
      }
    }

    if (months.length > 0) {
      years.push({
        key: yStr,
        year: y,
        label: yStr,
        months,
        dayKeys: yDayKeys,
        isDefaultExpanded: yi === 0,
      });
    }
  }

  const unparsed = q
    ? unparsedAll.filter((v) => {
        const lower = v.toLowerCase();
        return lower.includes(q) || normalizeSearchText(lower).includes(noToneQ);
      })
    : unparsedAll;

  for (let i = 0; i < unparsed.length; i++) {
    matchingKeys.push(unparsed[i]);
  }

  return { years, unparsed, matchingKeys };
}

interface AdvChecklistDateTreeListProps {
  years: ChecklistDateYearNode[];
  unparsed: string[];
  isSearching: boolean;
  selectedSet: Set<any>;
  onToggleMany: (keys: string[], shouldSelect: boolean) => void;
  expandedMap: Record<string, boolean>;
  onToggleExpand: (nodeKey: string, defaultExpanded: boolean) => void;
  showBlanksInList: boolean;
}

const AdvChecklistDateTreeList: React.FC<AdvChecklistDateTreeListProps> = React.memo(
  ({
    years,
    unparsed,
    isSearching,
    selectedSet,
    onToggleMany,
    expandedMap,
    onToggleExpand,
    showBlanksInList,
  }) => {
    const containerRef = useRef<HTMLDivElement | null>(null);

    const flatRows = useMemo<ChecklistDateTreeRow[]>(() => {
      const rows: ChecklistDateTreeRow[] = [];
      for (let yi = 0; yi < years.length; yi++) {
        const yNode = years[yi];
        const yExpanded = isSearching
          ? true
          : (expandedMap[yNode.key] ?? yNode.isDefaultExpanded);
        rows.push({ kind: 'year', node: yNode, isExpanded: yExpanded });
        if (!yExpanded) continue;

        for (let mi = 0; mi < yNode.months.length; mi++) {
          const mNode = yNode.months[mi];
          const mExpanded = isSearching ? true : Boolean(expandedMap[mNode.key]);
          rows.push({ kind: 'month', node: mNode, isExpanded: mExpanded });
          if (!mExpanded) continue;

          for (let di = 0; di < mNode.days.length; di++) {
            rows.push({ kind: 'day', node: mNode.days[di] });
          }
        }
      }
      for (let i = 0; i < unparsed.length; i++) {
        rows.push({ kind: 'raw', value: unparsed[i] });
      }
      return rows;
    }, [years, unparsed, isSearching, expandedMap]);

    const virtual = useVirtualList({
      itemCount: flatRows.length,
      itemHeight: 28,
      viewportRef: containerRef,
      overscan: 6,
      threshold: 1,
      defaultViewportHeight: 224,
    });

    const visibleRows = flatRows.slice(virtual.startIndex, virtual.endIndex);

    useEffect(() => {
      if (isSearching) {
        virtual.resetScroll();
      }
    }, [isSearching, years.length]);

    if (flatRows.length === 0 && !showBlanksInList) {
      return (
        <div className="max-h-52 px-2 py-4 text-center text-xs italic text-[var(--agv-text-muted)]">
          Không tìm thấy giá trị phù hợp
        </div>
      );
    }

    return (
      <AdvOverlayScroll
        viewportRef={containerRef}
        onScroll={virtual.handleScroll}
        viewportClassName="max-h-56 overflow-y-auto overflow-x-hidden p-1 overscroll-contain select-none"
        viewportStyle={{ maxHeight: '224px' }}
        contentSignature={flatRows.length}
      >
        {virtual.topSpacer > 0 && (
          <div
            className="agv-checklist-spacer-top pointer-events-none select-none"
            style={{ height: `${virtual.topSpacer}px` }}
            aria-hidden="true"
          />
        )}
        {visibleRows.map((row) => {
          if (row.kind === 'year') {
            const { node, isExpanded } = row;
            let selectedCount = 0;
            for (let i = 0; i < node.dayKeys.length; i++) {
              if (selectedSet.has(node.dayKeys[i])) selectedCount++;
            }
            const isAll = selectedCount > 0 && selectedCount === node.dayKeys.length;
            const isSome = selectedCount > 0 && selectedCount < node.dayKeys.length;

            return (
              <div
                key={`y:${node.key}`}
                onClick={() => onToggleMany(node.dayKeys, !isAll)}
                className="flex h-[28px] min-h-[28px] cursor-pointer select-none items-center gap-1 rounded-sm pl-1 pr-2 text-xs font-medium text-[var(--agv-text-main)] hover:bg-[var(--popup-item-hover-bg)]"
              >
                <AdvButton
                  variant="ghost"
                  size="icon-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleExpand(node.key, node.isDefaultExpanded);
                  }}
                  aria-label={isExpanded ? `Thu gọn năm ${node.label}` : `Mở rộng năm ${node.label}`}
                  className="rounded-sm"
                >
                  <MorphChevronIcon expanded={isExpanded} size={14} spring="snappy" />
                </AdvButton>
                <AdvCheckbox checked={isAll} indeterminate={isSome} />
                <span className="ml-1 truncate">{node.label}</span>
              </div>
            );
          }

          if (row.kind === 'month') {
            const { node, isExpanded } = row;
            let selectedCount = 0;
            for (let i = 0; i < node.dayKeys.length; i++) {
              if (selectedSet.has(node.dayKeys[i])) selectedCount++;
            }
            const isAll = selectedCount > 0 && selectedCount === node.dayKeys.length;
            const isSome = selectedCount > 0 && selectedCount < node.dayKeys.length;

            return (
              <div
                key={`m:${node.key}`}
                onClick={() => onToggleMany(node.dayKeys, !isAll)}
                className="flex h-[28px] min-h-[28px] cursor-pointer select-none items-center gap-1 rounded-sm pl-4 pr-2 text-xs text-[var(--agv-text-main)] hover:bg-[var(--popup-item-hover-bg)]"
              >
                <AdvButton
                  variant="ghost"
                  size="icon-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleExpand(node.key, false);
                  }}
                  aria-label={isExpanded ? `Thu gọn ${node.label}` : `Mở rộng ${node.label}`}
                  className="rounded-sm"
                >
                  <MorphChevronIcon expanded={isExpanded} size={14} spring="snappy" />
                </AdvButton>
                <AdvCheckbox checked={isAll} indeterminate={isSome} />
                <span className="ml-1 truncate">{node.label}</span>
              </div>
            );
          }

          if (row.kind === 'day') {
            const { node } = row;
            const isChecked = selectedSet.has(node.key);
            return (
              <div
                key={`d:${node.key}`}
                onClick={() => onToggleMany([node.key], !isChecked)}
                className="flex h-[28px] min-h-[28px] cursor-pointer select-none items-center gap-2 rounded-sm pl-[60px] pr-2 text-xs text-[var(--agv-text-main)] hover:bg-[var(--popup-item-hover-bg)]"
              >
                <AdvCheckbox checked={isChecked} />
                <span className="truncate">{node.dayLabel}</span>
              </div>
            );
          }

          const isChecked = selectedSet.has(row.value);
          return (
            <div
              key={`r:${row.value}`}
              onClick={() => onToggleMany([row.value], !isChecked)}
              className="flex h-[28px] min-h-[28px] cursor-pointer select-none items-center gap-2 rounded-sm px-2 text-xs text-[var(--agv-text-main)] hover:bg-[var(--popup-item-hover-bg)]"
            >
              <AdvCheckbox checked={isChecked} />
              <span className="truncate">{row.value}</span>
            </div>
          );
        })}
        {virtual.bottomSpacer > 0 && (
          <div
            className="agv-checklist-spacer-bottom pointer-events-none select-none"
            style={{ height: `${virtual.bottomSpacer}px` }}
            aria-hidden="true"
          />
        )}
      </AdvOverlayScroll>
    );
  }
);
AdvChecklistDateTreeList.displayName = 'AdvChecklistDateTreeList';

/* ==============================================================================
   5. ADVCHECKLIST FILTER POPUP (Isolated Component - Zero Re-render bảng chính)
   ============================================================================== */
export interface AdvChecklistFilterPopupRef {
  open: (
    colKey: string,
    coords: { top: number; left: number; bottom?: number; isFlipUp?: boolean; anchorEl?: HTMLElement | null },
    curFilter: any
  ) => void;
  close: () => void;
  updateCoords: (coords: { top: number; left: number; bottom?: number; isFlipUp?: boolean; anchorEl?: HTMLElement | null }) => void;
  isOpen: () => boolean;
  isOpenFor: (colKey: string) => boolean;
  getActiveCol: () => string | null;
}

export interface AdvChecklistFilterPopupProps {
  data?: any[];
  getRowItem?: (idx: number) => any;
  totalRowCount?: number;
  getCellValue?: (rowIndex: number, colKey: string) => any;
  getDistinctValues?: (colKey: string) => { values: string[]; hasBlanks: boolean };
  columnDataTypes?: Record<string, string>;
  distinctValuesCacheRef?: React.MutableRefObject<
    Record<string, { values: string[]; hasBlanks: boolean }>
  >;
  surfaceTheme?: string;
  portalRoot?: HTMLElement | null;
  formatChecklistDisplay?: (colKey: string, val: any) => string;
  matchFilterValue?: (
    cellVal: any,
    op: any,
    targetVal: string,
    dataType: string,
    filterObj?: any
  ) => boolean;
  onApply: (colKey: string, selected: Set<any>, includeBlanks: boolean) => void;
  onClear: (colKey: string) => void;
  onActiveColChange?: (colKey: string | null) => void;
}

export const AdvChecklistFilterPopup = forwardRef<
  AdvChecklistFilterPopupRef,
  AdvChecklistFilterPopupProps
>((props, ref) => {
  const {
    data,
    getRowItem,
    totalRowCount,
    getCellValue,
    getDistinctValues,
    columnDataTypes = {},
    distinctValuesCacheRef,
    surfaceTheme = SURFACE_THEMES.LIGHT,
    portalRoot,
    formatChecklistDisplay = (_k, v) => String(v ?? ''),
    matchFilterValue,
    onApply,
    onClear,
    onActiveColChange,
  } = props;

  const [activeCol, setActiveCol] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ top: number; left: number; bottom?: number; isFlipUp?: boolean; anchorEl?: HTMLElement | null }>({ top: 0, left: 0 });
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<any>>(new Set());
  const [includeBlanks, setIncludeBlanks] = useState(false);
  const [currentFilter, setCurrentFilter] = useState<any>(null);
  const [expandedDateNodes, setExpandedDateNodes] = useState<Record<string, boolean>>({});
  const columnDataTypesRef = useRef(columnDataTypes);
  columnDataTypesRef.current = columnDataTypes;
  const popupRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    onActiveColChange?.(activeCol);
  }, [activeCol, onActiveColChange]);

  useEffect(() => {
    return () => {
      onActiveColChange?.(null);
    };
  }, [onActiveColChange]);

  useImperativeHandle(
    ref,
    () => ({
      open: (colKey: string, nextCoords: { top: number; left: number; bottom?: number; isFlipUp?: boolean; anchorEl?: HTMLElement | null }, curFilter: any) => {
        setActiveCol(colKey);
        setCoords(nextCoords);
        setSearch('');
        setExpandedDateNodes({});
        setCurrentFilter(curFilter || null);
        if (Array.isArray(curFilter?.selectedValues) && curFilter.selectedValues.length > 0) {
          const isDateCol = columnDataTypesRef.current[colKey] === DATA_TYPES.DATE;
          if (isDateCol) {
            setSelected(
              new Set(
                curFilter.selectedValues.map((v: any) => toDateKeyYMD(v) || String(v).trim())
              )
            );
          } else {
            setSelected(new Set(curFilter.selectedValues));
          }
        } else {
          setSelected(new Set());
        }
        setIncludeBlanks(Boolean(curFilter?.includeBlanks));
      },
      close: () => {
        setActiveCol(null);
      },
      updateCoords: (nextCoords: { top: number; left: number; bottom?: number; isFlipUp?: boolean; anchorEl?: HTMLElement | null }) => {
        setCoords(nextCoords);
      },
      isOpen: () => activeCol !== null,
      isOpenFor: (colKey: string) => activeCol === colKey,
      getActiveCol: () => activeCol,
    }),
    [activeCol]
  );

  // Click outside listener tự động đóng popup theo quy tắc AGENTS.md
  useEffect(() => {
    if (!activeCol || coords.anchorEl) return;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (popupRef.current && popupRef.current.contains(target)) return;
      // Bấm trúng nút mở phễu trên header thì không đóng để trigger xử lý toggle
      if (target.closest && (target.closest('.agv-header-filter-btn') || target.closest('[data-checklist-trigger]'))) return;
      setActiveCol(null);
    };

    document.addEventListener('mousedown', handlePointerDown, true);
    document.addEventListener('touchstart', handlePointerDown, true);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown, true);
      document.removeEventListener('touchstart', handlePointerDown, true);
    };
  }, [activeCol, coords.anchorEl]);

  // Kiểm tra xem Row Filter có đang hoạt động trên cột này không
  const isRowFilterActive = useMemo(() => {
    if (!currentFilter) return false;
    if (isNoInputFilterOp(currentFilter.op)) {
      return true;
    }
    if (
      currentFilter.mode === FILTER_MODES.MULTI &&
      ((Array.isArray(currentFilter.multiValues) && currentFilter.multiValues.length > 0) ||
        (Array.isArray(currentFilter.multiRanges) && currentFilter.multiRanges.length > 0))
    ) {
      return true;
    }
    return typeof currentFilter.val === 'string' && currentFilter.val.trim().length > 0;
  }, [currentFilter]);

  if (!activeCol) return null;

  const distinctInfo = getDistinctValues
    ? getDistinctValues(activeCol)
    : getDistinctColumnValues(
        activeCol,
        data || [],
        columnDataTypes[activeCol],
        distinctValuesCacheRef,
        getRowItem,
        totalRowCount,
        getCellValue
      );

  const dType = (columnDataTypes && columnDataTypes[activeCol]) || 'text';
  const rawValues = distinctInfo.values || [];

  const rowFilterObj =
    isRowFilterActive && currentFilter
      ? {
          ...currentFilter,
          selectedValues: undefined,
          includeBlanks: undefined,
        }
      : undefined;

  // Khi Row Filter đang active, danh sách phễu chỉ hiển thị các giá trị thỏa mãn Row Filter
  const baseValues =
    isRowFilterActive && matchFilterValue && currentFilter
      ? rawValues.filter((v) =>
          matchFilterValue(v, currentFilter.op, currentFilter.val, dType, rowFilterObj)
        )
      : rawValues;

  const hasBlanks =
    Boolean(distinctInfo.hasBlanks) &&
    (!isRowFilterActive || !matchFilterValue || !currentFilter
      ? true
      : matchFilterValue('', currentFilter.op, currentFilter.val, dType, rowFilterObj));

  // Lọc danh sách theo từ khóa tìm kiếm bên trong popup
  const q = search.trim().toLowerCase();
  const noToneQ = q ? normalizeSearchText(q) : '';
  const isDateCol = dType === DATA_TYPES.DATE;

  const dateTreeData = isDateCol
    ? buildFilteredDateTree(baseValues, q, noToneQ)
    : null;

  const filteredValues = isDateCol
    ? dateTreeData!.matchingKeys
    : q
    ? baseValues.filter((v) => {
        const s = String(v).toLowerCase();
        if (s.includes(q)) return true;
        if (normalizeSearchText(s).includes(noToneQ)) return true;
        const display = formatChecklistDisplay(activeCol, v).toLowerCase();
        if (display !== s) {
          if (display.includes(q)) return true;
          if (normalizeSearchText(display).includes(noToneQ)) return true;
        }
        return false;
      })
    : baseValues;

  const showBlanksInList =
    hasBlanks &&
    (!q ||
      '(trống)'.includes(q) ||
      'trong'.includes(noToneQ) ||
      'rong'.includes(noToneQ));

  // Kiểm tra trạng thái chọn tất cả
  const selectedCount = selected.size;
  let isAllChecked = false;
  let isSomeChecked = false;

  if (filteredValues.length > 0) {
    if (selectedCount === 0) {
      isAllChecked = false;
      isSomeChecked = showBlanksInList && includeBlanks;
    } else {
      isAllChecked =
        filteredValues.every((v) => selected.has(v)) &&
        (!showBlanksInList || includeBlanks);
      isSomeChecked =
        !isAllChecked &&
        ((showBlanksInList && includeBlanks) || filteredValues.some((v) => selected.has(v)));
    }
  } else {
    isAllChecked = showBlanksInList && includeBlanks;
    isSomeChecked = false;
  }

  const handleToggleAll = () => {
    if (isAllChecked) {
      const next = new Set(selected);
      filteredValues.forEach((v) => next.delete(v));
      setSelected(next);
      const nextInclude = showBlanksInList ? false : includeBlanks;
      if (showBlanksInList) setIncludeBlanks(false);
      onApply(activeCol, next, nextInclude);
    } else {
      const next = new Set(selected);
      filteredValues.forEach((v) => next.add(v));
      setSelected(next);
      const nextInclude = showBlanksInList ? true : includeBlanks;
      if (showBlanksInList) setIncludeBlanks(true);
      onApply(activeCol, next, nextInclude);
    }
  };

  const handleToggleDateKeys = (keys: string[], shouldSelect: boolean) => {
    const next = new Set(selected);
    for (let i = 0; i < keys.length; i++) {
      if (shouldSelect) next.add(keys[i]);
      else next.delete(keys[i]);
    }
    setSelected(next);
    onApply(activeCol, next, includeBlanks);
  };

  const handleToggleDateExpand = (nodeKey: string, defaultExpanded: boolean) => {
    setExpandedDateNodes((prev) => ({
      ...prev,
      [nodeKey]: !(prev[nodeKey] ?? defaultExpanded),
    }));
  };

  const hasSelected = selected.size > 0 || includeBlanks;

  const handleClearSelected = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelected(new Set());
    setIncludeBlanks(false);
    onClear(activeCol);
  };

  const checklistBody = (
    <>
      {/* 1. Ô tìm kiếm giá trị (No Autofill theo chuẩn AGENTS.md) */}
      <div className="border-b border-[var(--agv-border)] p-1.5">
        <div className="agv-control agv-control-box relative flex items-center w-full h-[28px] min-h-[28px] px-2">
          <Search size={14} className="text-[var(--agv-text-muted)] mr-1.5 shrink-0" />
          <input
            name="agv_checklist_search_no_autofill"
            {...NO_AUTOFILL_PROPS}
            placeholder="Tìm kiếm giá trị..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setActiveCol(null);
              }
            }}
            className="w-full bg-transparent border-none outline-none text-xs text-[var(--agv-text-main)] placeholder-[var(--agv-text-muted)]"
            autoFocus
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="agv-inline-clear-ghost p-0.5 shrink-0 mr-1"
            >
              <X size={10} strokeWidth={2.5} />
            </button>
          )}

          {/* Nút SVG xóa các mục đã chọn (vị trí khoanh đỏ ở góc phải) */}
          <button
            type="button"
            onClick={hasSelected ? handleClearSelected : undefined}
            disabled={!hasSelected}
            className={`p-1 transition shrink-0 flex items-center justify-center rounded ${
              hasSelected
                ? 'text-[var(--agv-danger)] hover:bg-[var(--agv-danger-bg)] cursor-pointer'
                : 'text-[var(--agv-text-muted)] opacity-25 cursor-not-allowed'
            }`}
          >
            <FilterX size={13} strokeWidth={2.2} />
          </button>
        </div>
      </div>

      {/* 2. Tùy chọn (Tất cả) & (Trống) */}
      <div className="border-b border-[var(--agv-border)] bg-[var(--agv-bg-popup)] p-1 text-xs">
        <div
          onClick={handleToggleAll}
          className="flex min-h-[28px] cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1 text-[var(--agv-text-main)] hover:bg-[var(--popup-item-hover-bg)]"
        >
          <AdvCheckbox checked={isAllChecked} indeterminate={isSomeChecked} />
          <span className="font-medium text-[var(--agv-text-main)]">(Tất cả)</span>
        </div>

        {showBlanksInList && (
          <div
            onClick={() => {
              const nextInclude = !includeBlanks;
              setIncludeBlanks(nextInclude);
              onApply(activeCol, selected, nextInclude);
            }}
            className="flex min-h-[28px] cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1 text-[var(--agv-text-main)] hover:bg-[var(--popup-item-hover-bg)]"
          >
            <AdvCheckbox checked={includeBlanks} />
            <span className="italic text-[var(--agv-text-muted)]">(Trống)</span>
          </div>
        )}
      </div>

      {/* 3. Danh sách giá trị phân biệt - Ảo hóa DOM (Cây Năm/Tháng/Ngày cho cột DATE hoặc List phẳng) */}
      {isDateCol && dateTreeData ? (
        <AdvChecklistDateTreeList
          years={dateTreeData.years}
          unparsed={dateTreeData.unparsed}
          isSearching={q.length > 0}
          selectedSet={selected}
          onToggleMany={handleToggleDateKeys}
          expandedMap={expandedDateNodes}
          onToggleExpand={handleToggleDateExpand}
          showBlanksInList={showBlanksInList}
        />
      ) : (
        <AdvChecklistVirtualList
          items={filteredValues}
          selectedSet={selected}
          onToggle={(val) => {
            const next = new Set(selected);
            if (next.has(val)) next.delete(val);
            else next.add(val);
            setSelected(next);
            onApply(activeCol, next, includeBlanks);
          }}
          formatDisplay={formatChecklistDisplay}
          colKey={activeCol}
          showBlanksInList={showBlanksInList}
        />
      )}
    </>
  );

  if (coords.anchorEl) {
    return (
      <AdvAnchoredPopover
        isOpen={Boolean(activeCol)}
        anchorEl={coords.anchorEl}
        onClose={() => setActiveCol(null)}
        placement="bottom-end"
        showArrow={true}
        offset={10}
        width={270}
        minWidth={240}
        maxWidth="90vw"
        paddingClassName="p-0"
        contentClassName="text-xs"
        zIndex={99999999}
        theme={surfaceTheme}
        ignoreClickOutsideSelectors=".agv-header-filter-btn, [data-checklist-trigger], [data-agv-popover-trigger='true']"
      >
        <div className="flex max-h-[calc(100vh-80px)] flex-col overflow-hidden rounded-md text-xs select-none">
          {checklistBody}
        </div>
      </AdvAnchoredPopover>
    );
  }

  return createPortal(
    <div
      ref={popupRef}
      style={{
        position: 'fixed',
        ...(coords.isFlipUp
          ? { bottom: `${coords.bottom}px`, top: 'auto' }
          : { top: `${coords.top}px`, bottom: 'auto' }),
        left: `${coords.left}px`,
        zIndex: 99999999,
        backgroundColor: 'var(--popup-background)',
        borderColor: 'var(--popup-border)',
        boxShadow: 'var(--popup-shadow)',
        color: 'var(--agv-text-main)',
        width: '270px',
        maxWidth: '90vw',
        maxHeight: 'calc(100vh - 20px)',
        display: 'flex',
        flexDirection: 'column',
      }}
      className={`agv-checklist-filter-popup agv-popup-panel flex flex-col rounded-md border text-xs overflow-hidden select-none ${
        coords.isFlipUp ? 'agv-spring-up' : 'agv-spring-down'
      } ${getThemeClass(
        surfaceTheme as any
      )}`}
      data-theme={surfaceTheme}
      data-agv-popup="true"
      onClick={(e) => e.stopPropagation()}
      onWheel={(e) => e.stopPropagation()}
    >
      {checklistBody}
    </div>,
    portalRoot || (typeof document !== 'undefined' ? document.body : (null as any))
  );
});

AdvChecklistFilterPopup.displayName = 'AdvChecklistFilterPopup';
