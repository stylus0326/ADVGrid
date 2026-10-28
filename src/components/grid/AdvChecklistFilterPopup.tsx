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
import { AdvCheckbox } from './AdvCheckbox';
import { isNoInputFilterOp } from './gridUtils';
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
    const [scrollTop, setScrollTop] = useState(0);

    const ITEM_HEIGHT = 26;
    const VIEWPORT_HEIGHT = 208; // 8 items hiển thị trong khung 208px
    const BUFFER = 6;

    const totalItems = items.length;
    const startIndex = Math.max(0, Math.floor(scrollTop / ITEM_HEIGHT) - BUFFER);
    const endIndex = Math.min(
      totalItems,
      Math.ceil((scrollTop + VIEWPORT_HEIGHT) / ITEM_HEIGHT) + BUFFER
    );

    const visibleItems = items.slice(startIndex, endIndex);
    const topSpacer = startIndex * ITEM_HEIGHT;
    const bottomSpacer = Math.max(0, (totalItems - endIndex) * ITEM_HEIGHT);

    useEffect(() => {
      if (containerRef.current) {
        containerRef.current.scrollTop = 0;
      }
      setScrollTop(0);
    }, [items]);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
      setScrollTop(e.currentTarget.scrollTop);
    };

    if (items.length === 0 && !showBlanksInList) {
      return (
        <div className="max-h-52 px-2 py-4 text-center text-xs italic text-[var(--agv-text-muted)]">
          Không tìm thấy giá trị phù hợp
        </div>
      );
    }

    return (
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="max-h-52 overflow-y-auto px-2 py-1 pb-1.5 overscroll-contain select-none"
        style={{ maxHeight: '208px' }}
      >
        {topSpacer > 0 && (
          <div
            className="agv-checklist-spacer-top pointer-events-none select-none"
            style={{ height: `${topSpacer}px` }}
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
              className="flex h-[26px] cursor-pointer select-none items-center gap-2 rounded px-1.5 text-xs text-[var(--agv-text-main)] hover:bg-[var(--agv-bg-item-hover)]"
            >
              <AdvCheckbox checked={isChecked} />
              <span className="truncate">
                {displayLabel}
              </span>
            </div>
          );
        })}
        {bottomSpacer > 0 && (
          <div
            className="agv-checklist-spacer-bottom pointer-events-none select-none"
            style={{ height: `${bottomSpacer}px` }}
            aria-hidden="true"
          />
        )}
      </div>
    );
  }
);
AdvChecklistVirtualList.displayName = 'AdvChecklistVirtualList';

/* ==============================================================================
   5. ADVCHECKLIST FILTER POPUP (Isolated Component - Zero Re-render bảng chính)
   ============================================================================== */
export interface AdvChecklistFilterPopupRef {
  open: (
    colKey: string,
    coords: { top: number; left: number; bottom?: number; isFlipUp?: boolean },
    curFilter: any
  ) => void;
  close: () => void;
  updateCoords: (coords: { top: number; left: number; bottom?: number; isFlipUp?: boolean }) => void;
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
    surfaceTheme = SURFACE_THEMES.BEZIER_ARTHOUSE,
    portalRoot,
    formatChecklistDisplay = (_k, v) => String(v ?? ''),
    matchFilterValue,
    onApply,
    onClear,
  } = props;

  const [activeCol, setActiveCol] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ top: number; left: number; bottom?: number; isFlipUp?: boolean }>({ top: 0, left: 0 });
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<any>>(new Set());
  const [includeBlanks, setIncludeBlanks] = useState(false);
  const [currentFilter, setCurrentFilter] = useState<any>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);

  useImperativeHandle(
    ref,
    () => ({
      open: (colKey: string, nextCoords: { top: number; left: number; bottom?: number; isFlipUp?: boolean }, curFilter: any) => {
        setActiveCol(colKey);
        setCoords(nextCoords);
        setSearch('');
        setCurrentFilter(curFilter || null);
        if (Array.isArray(curFilter?.selectedValues) && curFilter.selectedValues.length > 0) {
          setSelected(new Set(curFilter.selectedValues));
        } else {
          setSelected(new Set());
        }
        setIncludeBlanks(Boolean(curFilter?.includeBlanks));
      },
      close: () => {
        setActiveCol(null);
      },
      updateCoords: (nextCoords: { top: number; left: number; bottom?: number; isFlipUp?: boolean }) => {
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
    if (!activeCol) return;

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
  }, [activeCol]);

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

  const filteredValues = q
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

  const hasSelected = selected.size > 0 || includeBlanks;

  const handleClearSelected = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelected(new Set());
    setIncludeBlanks(false);
    onClear(activeCol);
  };

  const popupContent = (
    <div
      ref={popupRef}
      style={{
        position: 'fixed',
        ...(coords.isFlipUp
          ? { bottom: `${coords.bottom}px`, top: 'auto' }
          : { top: `${coords.top}px`, bottom: 'auto' }),
        left: `${coords.left}px`,
        zIndex: 99999999,
        backgroundColor: 'var(--agv-bg-popup)',
        borderColor: 'var(--agv-border-popup, var(--agv-border))',
        boxShadow: '0 12px 28px -4px rgba(0, 0, 0, 0.25), 0 8px 12px -6px rgba(0, 0, 0, 0.15)',
        color: 'var(--agv-text-main)',
        width: '270px',
        maxWidth: '90vw',
        maxHeight: 'calc(100vh - 20px)',
        display: 'flex',
        flexDirection: 'column',
      }}
      className={`agv-checklist-filter-popup flex flex-col rounded-md border text-xs overflow-hidden select-none ${
        coords.isFlipUp ? 'agv-spring-up' : 'agv-spring-down'
      } ${getThemeClass(
        surfaceTheme as any
      )}`}
      data-theme={surfaceTheme}
      data-agv-popup="true"
      onClick={(e) => e.stopPropagation()}
      onWheel={(e) => e.stopPropagation()}
    >
      {/* 1. Ô tìm kiếm giá trị (No Autofill theo chuẩn AGENTS.md) */}
      <div className="border-b border-[var(--agv-border)] p-1.5">
        <div className="relative flex items-center w-full h-[28px] min-h-[28px] rounded border border-[var(--agv-border)] bg-[var(--agv-bg-root)] px-2">
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
              className="text-agv-text-muted hover:text-agv-accent p-0.5 transition cursor-pointer shrink-0 mr-1"
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
                ? 'text-[var(--agv-danger, #ef4444)] hover:bg-[var(--agv-bg-item-hover)] cursor-pointer'
                : 'text-[var(--agv-text-muted)] opacity-25 cursor-not-allowed'
            }`}
          >
            <FilterX size={13} strokeWidth={2.2} />
          </button>
        </div>
      </div>

      {/* 2. Tùy chọn (Tất cả) & (Trống) */}
      <div className="border-b border-[var(--agv-border)] bg-[var(--agv-bg-popup)] px-2 pb-1 pt-1 text-xs">
        <div
          onClick={handleToggleAll}
          className="flex cursor-pointer select-none items-center gap-2 rounded px-1.5 py-1 text-[var(--agv-text-main)] hover:bg-[var(--agv-bg-item-hover)]"
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
            className="flex cursor-pointer select-none items-center gap-2 rounded px-1.5 py-1 text-[var(--agv-text-main)] hover:bg-[var(--agv-bg-item-hover)]"
          >
            <AdvCheckbox checked={includeBlanks} />
            <span className="italic text-[var(--agv-text-muted)]">(Trống)</span>
          </div>
        )}
      </div>

      {/* 3. Danh sách giá trị phân biệt - Ảo hóa DOM (Virtual List ~15-20 node) */}
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
    </div>
  );

  return createPortal(
    popupContent,
    portalRoot || (typeof document !== 'undefined' ? document.body : (null as any))
  );
});

AdvChecklistFilterPopup.displayName = 'AdvChecklistFilterPopup';
