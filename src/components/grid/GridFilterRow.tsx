import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { X, Check } from 'lucide-react';
import {
  ColumnDef,
  ColumnFilterValue,
  FilterOperation,
  FILTER_OPS,
  CHECK_FILTER_STATES,
  DATA_TYPES,
  FILTER_MODES,
  PIN_POSITIONS,
  PinPosition,
  CenterDockStatus,
  CENTER_DOCK_STATUSES,
  SurfaceTheme,
  SURFACE_THEMES,
  SortConfig,
  GroupSortConfig,
} from './types';
import {
  FilterOpIcon,
  FILTER_OP_META,
  ALLOWED_OPS_BY_TYPE,
  DEFAULT_OP_BY_TYPE,
  getAllowedFilterOpsForColumn,
  getDefaultFilterOpForColumn,
  RangeArrowSeparator,
} from './FilterIcons';
import { getPinnedDividerClass, getRightPinnedDividerClass, NO_AUTOFILL_PROPS, getGridControlRadiusClass } from './constants';
import { AdvDatePicker, AdvDateRangePicker } from '../ui/AdvDatePicker';
import {
  formatGridNumber,
  isNoInputFilterOp,
  isBetweenFilterOp,
  isNegativeFilterOp,
  createEqualsFilter,
  isSelectionColumn,
} from './gridUtils';
import { getThemeClass } from '../../themes';
import { AdvMultiFilterPopup } from './AdvMultiFilterPopup';
import { AdvCriteriaSummaryPopup } from './AdvCriteriaSummaryPopup';
import { hasActiveQueryRules } from './floating/queryUtils';
import {
  formatSmartInputText,
  parseSmartNumericRange,
  handleNumericKeyDown,
} from './smartNumberUtils';

export interface GridFilterRowProps<T = any> {
  totalGridWidth: number;
  columns: ColumnDef<T>[];
  colWidths: Record<string, number>;
  columnPins: Record<string, PinPosition>;
  leftOffsets: Record<string, number>;
  rightOffsets: Record<string, number>;
  centerDockStatus?: Record<string, CenterDockStatus>;
  centerLeftOffsets?: Record<string, number>;
  centerRightOffsets?: Record<string, number>;
  lastEffectiveLeftColKey?: string | null;
  firstEffectiveRightColKey?: string | null;
  surfaceTheme?: SurfaceTheme;
  columnFilters?: Record<string, ColumnFilterValue>;
  onColumnFilterChange?: (colKey: string, filter: ColumnFilterValue) => void;
  onClearAllColumnFilters?: () => void;
  onClearAllCriteria?: () => void;
  activeFilterCount?: number;
  hasColumnEmptyCells?: (colKey: string) => boolean;
  getColumnDateBounds?: (colKey: string) => { min: string; max: string };
  headerTopOffset?: number;
  columnSums?: Record<string, number>;
  hasCheckedRows?: boolean;
  emptyColKeys?: Set<string>;
  groupByColumnKey?: string | null;
  quickFilterText?: string;
  sortConfig?: SortConfig | null;
  groupSortConfig?: GroupSortConfig | null;
  appliedQueryTree?: any;
  pinnedRows?: Array<{ rowKey: string | number; rowIndex: number; row: any }>;
  onUngroup?: () => void;
  onSortChange?: (sort: SortConfig | null) => void;
  onToggleGroupSort?: (colKey: string) => void;
  onQuickFilterTextChange?: (text: string) => void;
  onApplyQueryTree?: (tree: any) => void;
  onUnpinRow?: (rowKey: string | number) => void;
  onClearPinnedRows?: () => void;
}

/**
 * Bộ lọc dải giờ phút [Từ HH:mm] — [Đến HH:mm]
 * Hỗ trợ nhập trực tiếp hoặc tự động chuẩn hóa định dạng HH:mm, zero autofill, min-h 28px
 */
export const TimeRangeFilterInput: React.FC<{
  from: string;
  to: string;
  onChange: (from: string, to: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onClear?: () => void;
  hasValue?: boolean;
}> = ({ from, to, onChange, onFocus, onBlur, onClear, hasValue }) => {
  const [fromText, setFromText] = useState(from);
  const [toText, setToText] = useState(to);

  useEffect(() => {
    setFromText(from);
  }, [from]);

  useEffect(() => {
    setToText(to);
  }, [to]);

  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9:]/g, '').slice(0, 5);
    setFromText(raw);
    onChange(raw, toText);
  };

  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9:]/g, '').slice(0, 5);
    setToText(raw);
    onChange(fromText, raw);
  };

  const formatOnBlur = (val: string, isFrom: boolean) => {
    if (!val) return;
    const m = val.match(/^(\d{1,2}):?(\d{0,2})$/);
    if (m) {
      let h = parseInt(m[1], 10);
      if (h > 23) h = 23;
      let min = m[2] ? parseInt(m[2], 10) : 0;
      if (min > 59) min = 59;
      const formatted = `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
      if (isFrom) {
        setFromText(formatted);
        onChange(formatted, toText);
      } else {
        setToText(formatted);
        onChange(fromText, formatted);
      }
    }
  };

  return (
    <div className="relative w-full h-full flex items-center gap-1 px-1" style={{ minHeight: '28px' }}>
      <input
        type="text"
        placeholder="Từ"
        value={fromText}
        onChange={handleFromChange}
        onFocus={onFocus}
        onBlur={() => {
          formatOnBlur(fromText, true);
          onBlur?.();
        }}
        {...NO_AUTOFILL_PROPS}
        className="w-full flex-1 min-w-0 bg-transparent text-[11px] font-medium outline-none text-center p-0 placeholder:text-[var(--agv-text-muted)] placeholder:opacity-60"
        style={{ color: 'var(--agv-text-main)', minHeight: '28px' }}
      />
      <RangeArrowSeparator className="mx-0.5" />
      <input
        type="text"
        placeholder="Đến"
        value={toText}
        onChange={handleToChange}
        onFocus={onFocus}
        onBlur={() => {
          formatOnBlur(toText, false);
          onBlur?.();
        }}
        {...NO_AUTOFILL_PROPS}
        className="w-full flex-1 min-w-0 bg-transparent text-[11px] font-medium outline-none text-center p-0 placeholder:text-[var(--agv-text-muted)] placeholder:opacity-60"
        style={{ color: 'var(--agv-text-main)', minHeight: '28px' }}
      />
      {hasValue && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-0.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[var(--agv-text-muted)] hover:text-[var(--agv-danger,#ef4444)] transition cursor-pointer"
        >
          <X size={10} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
};

/**
 * Bộ lọc giờ đơn lẻ (Bằng, Khác, Lớn hơn hoặc bằng, Nhỏ hơn hoặc bằng, Có chứa...)
 */
export const TimeFilterInput: React.FC<{
  value: string;
  onChange: (val: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onClear?: () => void;
  placeholder?: string;
  hasValue?: boolean;
}> = ({ value, onChange, onFocus, onBlur, onClear, placeholder = 'HH:mm', hasValue }) => {
  const [text, setText] = useState(value);

  useEffect(() => {
    setText(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9:]/g, '').slice(0, 5);
    setText(raw);
    onChange(raw);
  };

  const handleBlur = () => {
    if (text) {
      const m = text.match(/^(\d{1,2}):?(\d{0,2})$/);
      if (m) {
        let h = parseInt(m[1], 10);
        if (h > 23) h = 23;
        let min = m[2] ? parseInt(m[2], 10) : 0;
        if (min > 59) min = 59;
        const formatted = `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
        setText(formatted);
        onChange(formatted);
      }
    }
    onBlur?.();
  };

  return (
    <div className="relative w-full h-full flex items-center px-1" style={{ minHeight: '28px' }}>
      <input
        type="text"
        placeholder={placeholder}
        value={text}
        onChange={handleChange}
        onFocus={onFocus}
        onBlur={handleBlur}
        {...NO_AUTOFILL_PROPS}
        className="w-full h-full bg-transparent text-[11px] font-medium outline-none text-center p-0 placeholder:text-[var(--agv-text-muted)] placeholder:opacity-60"
        style={{ color: 'var(--agv-text-main)', minHeight: '28px' }}
      />
      {hasValue && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-0.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[var(--agv-text-muted)] hover:text-[var(--agv-danger,#ef4444)] transition cursor-pointer"
        >
          <X size={10} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
};

/**
 * Bộ lọc khoảng số [Từ...] — [Đến...]
 * Hỗ trợ nhập phím tắt nhanh 1tr, 1k, 1t (VD: 100k -> 100,000; 1tr -> 1,000,000; 1t -> 1,000,000,000)
 */
export const NumberRangeFilterInput: React.FC<{
  from: string;
  to: string;
  onChange: (from: string, to: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onClear?: () => void;
  hasValue?: boolean;
}> = ({ from, to, onChange, onFocus, onBlur, onClear, hasValue }) => {
  const [fromText, setFromText] = useState(from);
  const [toText, setToText] = useState(to);

  useEffect(() => {
    setFromText(from);
  }, [from]);

  useEffect(() => {
    setToText(to);
  }, [to]);

  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const formatted = formatSmartInputText(raw);
    setFromText(formatted);
    onChange(formatted, toText);
  };

  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const formatted = formatSmartInputText(raw);
    setToText(formatted);
    onChange(fromText, formatted);
  };

  const handleBlurFrom = () => {
    const formatted = formatSmartInputText(fromText);
    setFromText(formatted);
    onChange(formatted, toText);
    onBlur?.();
  };

  const handleBlurTo = () => {
    const formatted = formatSmartInputText(toText);
    setToText(formatted);
    onChange(fromText, formatted);
    onBlur?.();
  };

  return (
    <div className="relative w-full h-full flex items-center gap-1 px-1" style={{ minHeight: '28px' }}>
      <input
        type="text"
        placeholder="Từ"
        value={fromText}
        onChange={handleFromChange}
        onKeyDown={handleNumericKeyDown}
        onFocus={onFocus}
        onBlur={handleBlurFrom}
        {...NO_AUTOFILL_PROPS}
        className="w-full flex-1 min-w-0 bg-transparent text-[11px] font-medium outline-none text-center p-0 placeholder:text-[var(--agv-text-muted)] placeholder:opacity-60 tabular-nums"
        style={{ color: 'var(--agv-text-main)', minHeight: '28px' }}
      />
      <RangeArrowSeparator className="mx-0.5" />
      <input
        type="text"
        placeholder="Đến"
        value={toText}
        onChange={handleToChange}
        onKeyDown={handleNumericKeyDown}
        onFocus={onFocus}
        onBlur={handleBlurTo}
        {...NO_AUTOFILL_PROPS}
        className="w-full flex-1 min-w-0 bg-transparent text-[11px] font-medium outline-none text-center p-0 placeholder:text-[var(--agv-text-muted)] placeholder:opacity-60 tabular-nums"
        style={{ color: 'var(--agv-text-main)', minHeight: '28px' }}
      />
      {hasValue && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-0.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[var(--agv-text-muted)] hover:text-[var(--agv-danger,#ef4444)] transition cursor-pointer"
        >
          <X size={10} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
};

/**
 * Bộ lọc ô số đơn lẻ thông minh (hỗ trợ phím tắt 1tr, 1k, 1t và tự động phát hiện khoảng số nếu gõ - hoặc /)
 */
export const SmartNumberFilterInput: React.FC<{
  value: string;
  onChange: (val: string, opOverride?: FilterOperation) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onClear?: () => void;
  placeholder?: string;
  hasValue?: boolean;
  isHighlightPlaceholder?: boolean;
}> = ({ value, onChange, onFocus, onBlur, onClear, placeholder, hasValue, isHighlightPlaceholder }) => {
  const [localVal, setLocalVal] = useState(value || '');

  useEffect(() => {
    setLocalVal(value || '');
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const formatted = formatSmartInputText(raw, undefined, true);
    setLocalVal(formatted);

    // Kiểm tra nếu người dùng vừa nhập dải khoảng số (VD: '100k - 500k', '1tr/5tr', '10k..50k')
    const range = parseSmartNumericRange(formatted);
    if (range && range.from && range.to) {
      onChange(range.formatted, FILTER_OPS.BETWEEN);
      return;
    }

    if (formatted.trim().endsWith('-') || formatted.trim().endsWith('/')) {
      onChange(formatted, FILTER_OPS.BETWEEN);
      return;
    }

    onChange(formatted);
  };

  const handleBlur = () => {
    const formatted = formatSmartInputText(localVal);
    setLocalVal(formatted);
    const range = parseSmartNumericRange(formatted);
    if (range && range.from && range.to) {
      onChange(range.formatted, FILTER_OPS.BETWEEN);
    } else {
      onChange(formatted);
    }
    onBlur?.();
  };

  return (
    <div className="relative w-full h-full flex items-center min-w-0">
      <input
        type="text"
        value={localVal}
        onFocus={onFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        onKeyDown={handleNumericKeyDown}
        placeholder={placeholder}
        {...NO_AUTOFILL_PROPS}
        className={`w-full h-full bg-transparent px-1 text-[11px] outline-none border-none tabular-nums disabled:cursor-not-allowed ${
          isHighlightPlaceholder
            ? 'placeholder:text-[var(--agv-accent)] placeholder:opacity-100 placeholder:font-semibold'
            : 'placeholder:text-[var(--agv-text-muted)] placeholder:opacity-60'
        } ${hasValue ? 'pr-5' : 'pr-1'}`}
        style={{
          color: 'var(--agv-text-main)',
          minHeight: '28px',
        }}
      />
      {hasValue && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-1 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full flex items-center justify-center text-[var(--agv-text-muted)] hover:text-[var(--agv-danger,#ef4444)] transition cursor-pointer"
        >
          <X size={10} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
};

export const GridFilterRow: React.FC<GridFilterRowProps> = React.memo(({
  totalGridWidth,
  columns,
  colWidths,
  columnPins,
  leftOffsets,
  rightOffsets,
  centerDockStatus = {},
  centerLeftOffsets = {},
  centerRightOffsets = {},
  lastEffectiveLeftColKey,
  firstEffectiveRightColKey,
  surfaceTheme = SURFACE_THEMES.LIGHT,
  columnFilters = {},
  onColumnFilterChange,
  onClearAllColumnFilters,
  onClearAllCriteria,
  activeFilterCount = 0,
  hasColumnEmptyCells,
  getColumnDateBounds,
  headerTopOffset = 64,
  columnSums = {},
  hasCheckedRows = false,
  emptyColKeys,
  groupByColumnKey,
  quickFilterText,
  sortConfig,
  groupSortConfig,
  appliedQueryTree,
  pinnedRows = [],
  onUngroup,
  onSortChange,
  onToggleGroupSort,
  onQuickFilterTextChange,
  onApplyQueryTree,
  onUnpinRow,
  onClearPinnedRows,
}) => {
  // Quản lý popup tập hợp tiêu chí đang áp dụng (STT cell)
  const [isSummaryPopupOpen, setIsSummaryPopupOpen] = useState(false);
  const [summaryAnchorRect, setSummaryAnchorRect] = useState<{
    top: number;
    left: number;
    bottom: number;
    right: number;
    width?: number;
    height?: number;
  } | null>(null);

  // Toggle bật/tắt popup khi click hoặc tái nhấn vào nút ở ô STT
  const handleToggleSummaryPopup = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (isSummaryPopupOpen) {
      setIsSummaryPopupOpen(false);
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      setSummaryAnchorRect(rect);
      setIsSummaryPopupOpen(true);
    }
  };

  // Tính tổng số tiêu chí đang active để hiển thị badge số lượng chuẩn
  const totalActiveCriteriaCount = useMemo(() => {
    let count = activeFilterCount;
    if (groupByColumnKey) count += 1;
    if (quickFilterText && quickFilterText.trim().length > 0) count += 1;
    if (sortConfig && sortConfig.key) count += 1;
    if (groupSortConfig && groupSortConfig.colKey) count += 1;
    if (appliedQueryTree && hasActiveQueryRules(appliedQueryTree)) count += 1;
    if (pinnedRows && pinnedRows.length > 0) count += pinnedRows.length;
    return count;
  }, [
    activeFilterCount,
    groupByColumnKey,
    quickFilterText,
    sortConfig,
    groupSortConfig,
    appliedQueryTree,
    pinnedRows,
  ]);

  // Quản lý popup chọn toán tử đang mở
  const [openDropdownColKey, setOpenDropdownColKey] = useState<string | null>(null);
  const [focusedColKey, setFocusedColKey] = useState<string | null>(null);
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number; bottom?: number; isFlipUp?: boolean } | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Quản lý popup lọc nhiều điều kiện (OR) khi chuột phải vào ô filter
  const [multiFilterColKey, setMultiFilterColKey] = useState<string | null>(null);
  const [multiFilterAnchor, setMultiFilterAnchor] = useState<{
    top: number;
    left: number;
    bottom: number;
    right: number;
    width: number;
    height: number;
  } | null>(null);

  const handleOpenMultiFilter = (colKey: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Đóng ngay menu toán tử nếu đang mở
    setOpenDropdownColKey(null);
    setDropdownPos(null);
    window.dispatchEvent(
      new CustomEvent('agv-close-all-popups', {
        detail: { except: 'multi-filter', source: 'multi-filter' },
      })
    );
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setMultiFilterAnchor({
      top: rect.top,
      left: rect.left,
      bottom: rect.bottom,
      right: rect.right,
      width: rect.width,
      height: rect.height,
    });
    setMultiFilterColKey(colKey);
  };

  // Lắng nghe sự kiện đóng tất cả popup toàn hệ thống để bảo đảm duy nhất 1 popup hiển thị
  useEffect(() => {
    const handleCloseAll = (e: Event) => {
      const ce = e as CustomEvent;
      if (ce.detail?.except !== 'filter-op') {
        setOpenDropdownColKey(null);
        setDropdownPos(null);
      }
      if (ce.detail?.except !== 'multi-filter') {
        setMultiFilterColKey(null);
        setMultiFilterAnchor(null);
      }
    };
    window.addEventListener('agv-close-all-popups', handleCloseAll);
    return () => {
      window.removeEventListener('agv-close-all-popups', handleCloseAll);
    };
  }, []);

  // Click outside listener tự động đóng popup (loại trừ click vào chính nút trigger toán tử để nút tự toggle luân chuyển)
  useEffect(() => {
    if (!openDropdownColKey) return;
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (dropdownRef.current && dropdownRef.current.contains(target)) return;
      if (target.closest?.('.agv-filter-op-btn') || target.closest?.('[data-op-trigger]')) return;
      setOpenDropdownColKey(null);
      setDropdownPos(null);
    };
    document.addEventListener('mousedown', handleClickOutside, true);
    document.addEventListener('touchstart', handleClickOutside, true);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
      document.removeEventListener('touchstart', handleClickOutside, true);
    };
  }, [openDropdownColKey]);

  const handleOpenDropdown = (colKey: string, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    // Đóng ngay popup multi filter nếu đang mở
    setMultiFilterColKey(null);
    setMultiFilterAnchor(null);
    window.dispatchEvent(
      new CustomEvent('agv-close-all-popups', {
        detail: { except: 'filter-op', source: 'filter-op' },
      })
    );
    if (openDropdownColKey === colKey) {
      setOpenDropdownColKey(null);
      setDropdownPos(null);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const vh = window.innerHeight;
    const spaceBelow = vh - rect.bottom - 8;
    const spaceAbove = rect.top - 8;
    const isFlipUp = spaceBelow < 280 && spaceAbove > spaceBelow;

    setDropdownPos({
      top: isFlipUp ? Math.max(8, rect.top - 4) : rect.bottom + 4,
      bottom: isFlipUp ? vh - rect.top + 4 : undefined,
      left: Math.max(8, Math.min(window.innerWidth - 220, rect.left)),
      isFlipUp,
    });
    setOpenDropdownColKey(colKey);
  };

  const getDefaultOpForCol = (colKey: string) => {
    return getDefaultFilterOpForColumn(colKey, columns);
  };

  const handleSelectOp = (colKey: string, op: FilterOperation) => {
    const defaultOp = getDefaultOpForCol(colKey);
    const current = columnFilters[colKey] || { op: defaultOp, val: '' };
    onColumnFilterChange?.(colKey, {
      ...current,
      op,
      val: FILTER_OP_META[op]?.noInput ? '' : current.val,
    });
    setOpenDropdownColKey(null);
    setDropdownPos(null);
  };

  const handleInputChange = (colKey: string, val: string, opOverride?: FilterOperation) => {
    const current = columnFilters[colKey];
    const defaultOp = getDefaultOpForCol(colKey);
    onColumnFilterChange?.(colKey, {
      ...current,
      op: opOverride || current?.op || defaultOp,
      val,
      mode: current?.mode === FILTER_MODES.MULTI ? FILTER_MODES.SIMPLE : current?.mode,
    });
  };

  const handleClearColFilter = (colKey: string) => {
    const current = columnFilters[colKey];
    const defaultOp = getDefaultOpForCol(colKey);
    onColumnFilterChange?.(colKey, {
      ...current,
      op: current?.op || defaultOp,
      val: '',
      mode: FILTER_MODES.SIMPLE,
      multiValues: undefined,
      multiRanges: undefined,
    });
  };

  return (
    <>
      <style>{`
        .agv-filter-cell-box:focus-within {
          border-color: var(--agv-accent) !important;
          box-shadow: 0 0 0 1px var(--agv-accent) !important;
        }
        .agv-filter-cell-box:focus-within .agv-filter-op-btn {
          color: var(--agv-accent) !important;
        }
        .agv-filter-op-btn {
          padding-right: 0px !important;
          background-color: transparent !important;
        }
        .agv-filter-op-btn:hover {
          color: var(--agv-accent) !important;
          background-color: transparent !important;
        }
        .agv-filter-datepicker .agv-datepicker-input-box,
        .agv-filter-datepicker .agv-daterange-bar {
          border: none !important;
          background: transparent !important;
          border-radius: 0 !important;
          padding: 0 4px !important;
          box-shadow: none !important;
          min-height: 26px !important;
          height: 100% !important;
        }
      `}</style>
      <div
        data-agv-fullwidth="true"
        style={{
          width: `var(--agv-total-grid-w, ${totalGridWidth}px)`,
          minWidth: `var(--agv-total-grid-w, ${totalGridWidth}px)`,
          height: '34px',
          top: `${headerTopOffset}px`,
          backgroundColor: 'var(--agv-bg-header)',
          borderColor: 'var(--agv-border)',
        }}
        className="flex items-center box-border h-[34px] min-h-[34px] max-h-[34px] border-b-2 border-b-[var(--agv-border-strong)] select-none sticky z-20"
        onContextMenu={(e) => e.preventDefault()}
      >
        {columns.map((col, cIdx) => {
          const width = colWidths[col.key] || col.defaultWidth;
          const pinPos = columnPins[col.key] || PIN_POSITIONS.NONE;
          const isPinnedLeft = pinPos === PIN_POSITIONS.LEFT;
          const isPinnedRight = pinPos === PIN_POSITIONS.RIGHT;
          const isCenterPinned = pinPos === PIN_POSITIONS.CENTER;
          const dock = isCenterPinned ? centerDockStatus[col.key] || CENTER_DOCK_STATUSES.NORMAL : CENTER_DOCK_STATUSES.NORMAL;

          const isDockedLeft = dock === CENTER_DOCK_STATUSES.LEFT;
          const isDockedRight = dock === CENTER_DOCK_STATUSES.RIGHT;
          const isEffectiveLeft = isPinnedLeft || isDockedLeft;
          const isEffectiveRight = isPinnedRight || isDockedRight;

          const isLastPinnedLeft = col.key === lastEffectiveLeftColKey;
          const isFirstPinnedRight = col.key === firstEffectiveRightColKey;

          const filterVal = columnFilters[col.key];
          const isMultiActive =
            filterVal?.mode === FILTER_MODES.MULTI &&
            Boolean(
              (Array.isArray(filterVal.multiValues) && filterVal.multiValues.length > 0) ||
              (Array.isArray(filterVal.multiRanges) && filterVal.multiRanges.length > 0)
            );
          const hasActiveVal =
            isMultiActive ||
            (!!filterVal && (filterVal.val.trim().length > 0 || FILTER_OP_META[filterVal.op]?.noInput));

          const stickyFilterStyle: React.CSSProperties = {
            width: `var(--agv-col-w-${col.key}, ${width}px)`,
            minWidth: `var(--agv-col-w-${col.key}, ${width}px)`,
            maxWidth: `var(--agv-col-w-${col.key}, ${width}px)`,
            height: '34px',
            backgroundColor: 'var(--agv-bg-header)',
            ...(isPinnedLeft
              ? { position: 'sticky', left: `var(--agv-left-offset-${col.key}, ${leftOffsets[col.key]}px)`, zIndex: 25 }
              : isDockedLeft
              ? { position: 'sticky', left: `var(--agv-center-left-offset-${col.key}, ${centerLeftOffsets[col.key]}px)`, zIndex: 24 }
              : isPinnedRight
              ? { position: 'sticky', right: `var(--agv-right-offset-${col.key}, ${rightOffsets[col.key]}px)`, zIndex: 25 }
              : isDockedRight
              ? { position: 'sticky', right: `var(--agv-center-right-offset-${col.key}, ${centerRightOffsets[col.key]}px)`, zIndex: 24 }
              : {}),
          };

          const isLeftDivider = isEffectiveLeft && (isLastPinnedLeft || isDockedLeft);
          const isRightDivider = isEffectiveRight && (isFirstPinnedRight || isDockedRight);

          const cellBorderRight = isLeftDivider
            ? getPinnedDividerClass(surfaceTheme)
            : 'border-r border-r-[var(--agv-border)]';

          const cellBorderLeft = isRightDivider
            ? getRightPinnedDividerClass(surfaceTheme)
            : '';

          // 1. CỘT STT: Nút mở Popup Tập Hợp Tiêu Chí Đang Áp Dụng (STT cell)
          if (col.isRowNumber || (col.dataType === DATA_TYPES.SYSTEM && (Boolean(col.title) || cIdx === 0))) {
            return (
              <div
                key={`filter_${col.key}`}
                data-col-key={col.key}
                style={stickyFilterStyle}
                className={`flex items-center justify-center px-0.5 ${cellBorderRight} ${cellBorderLeft} border-b-2 border-b-[var(--agv-border-strong)] shrink-0 box-border h-[34px]`}
              >
                {totalActiveCriteriaCount > 0 ? (
                  <button
                    type="button"
                    data-summary-trigger="true"
                    onClick={handleToggleSummaryPopup}
                    className={`w-full h-[28px] min-h-[28px] ${getGridControlRadiusClass()} px-0.5 flex items-center justify-center gap-0.5 transition cursor-pointer select-none`}
                    style={{
                      backgroundColor: 'var(--agv-danger-bg, rgba(239, 68, 68, 0.15))',
                      color: 'var(--agv-danger, #ef4444)',
                      border: '1px solid var(--agv-danger, #ef4444)',
                    }}
                  >
                    <X size={11} strokeWidth={2.5} className="shrink-0" />
                    <span className="text-[10px] font-bold leading-none">({totalActiveCriteriaCount})</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    data-summary-trigger="true"
                    onClick={handleToggleSummaryPopup}
                    className={`w-full h-[28px] min-h-[28px] ${getGridControlRadiusClass()} px-0.5 flex items-center justify-center text-[11px] text-[var(--agv-text-muted)] hover:text-[var(--agv-text-main)] hover:bg-[var(--agv-bg-item-hover)] transition cursor-pointer select-none`}
                  >
                    Lọc
                  </button>
                )}
              </div>
            );
          }

          // 2. CỘT CHỌN: Checkbox 3 trạng thái (ALL ➔ CHECKED ➔ UNCHECKED), bỏ viền ngoài giữ checkbox thuần
          if (isSelectionColumn(col)) {
            const chkState = filterVal?.val || CHECK_FILTER_STATES.ALL;
            const nextState =
              chkState === CHECK_FILTER_STATES.ALL
                ? CHECK_FILTER_STATES.CHECKED
                : chkState === CHECK_FILTER_STATES.CHECKED
                ? CHECK_FILTER_STATES.UNCHECKED
                : CHECK_FILTER_STATES.ALL;

            return (
              <div
                key={`filter_${col.key}`}
                data-col-key={col.key}
                style={stickyFilterStyle}
                className={`flex items-center justify-center px-0.5 ${cellBorderRight} ${cellBorderLeft} border-b-2 border-b-[var(--agv-border-strong)] shrink-0 box-border h-[34px]`}
              >
                <button
                  type="button"
                  onClick={() => {
                    onColumnFilterChange?.(
                      col.key,
                      createEqualsFilter(nextState === CHECK_FILTER_STATES.ALL ? '' : nextState)
                    );
                  }}
                  className="w-full h-[28px] min-h-[28px] bg-transparent border-0 border-none outline-none flex items-center justify-center transition cursor-pointer hover:opacity-80 p-0"
                >
                  {chkState === CHECK_FILTER_STATES.CHECKED ? (
                    /* Checkbox Đã chọn: Ô vuông màu chủ đạo có dấu tích trắng ✓ */
                    <div className="w-[15px] h-[15px] rounded-[3px] bg-[var(--agv-accent)] text-[var(--agv-accent-text,#ffffff)] flex items-center justify-center">
                      <Check size={11} strokeWidth={3} />
                    </div>
                  ) : chkState === CHECK_FILTER_STATES.UNCHECKED ? (
                    /* Checkbox Chưa chọn: Ô vuông viền cam/vàng ☐ */
                    <div className="w-[15px] h-[15px] rounded-[3px] border-2 border-[var(--agv-warning,#f59e0b)] bg-transparent flex items-center justify-center" />
                  ) : (
                    /* Checkbox Tất cả (Indeterminate / All): Ô vuông viền xám có gạch ngang - */
                    <div className="w-[15px] h-[15px] rounded-[3px] border border-[var(--agv-border-strong,var(--agv-border))] bg-transparent flex items-center justify-center">
                      <span className="w-2 h-0.5 rounded-full bg-[var(--agv-text-muted)] opacity-60" />
                    </div>
                  )}
                </button>
              </div>
            );
          }

          // 3. CỘT KHÔNG LỌC (filterable === false hoặc isChart): Bỏ qua ô lọc
          if (col.filterable === false || col.isChart) {
            return (
              <div
                key={`filter_${col.key}`}
                data-col-key={col.key}
                style={stickyFilterStyle}
                className={`flex items-center justify-center px-1 ${cellBorderRight} ${cellBorderLeft} border-b-2 border-b-[var(--agv-border-strong)] shrink-0 box-border h-[34px]`}
              >
                <span className="text-[10px] text-[var(--agv-text-muted)] italic opacity-60">
                  —
                </span>
              </div>
            );
          }

          // 4. CÁC CỘT DỮ LIỆU CÒN LẠI: Nút icon toán tử + Input lọc
          const dataType = col.dataType || DATA_TYPES.TEXT;
          const defaultOp = getDefaultOpForCol(col.key);
          const currentOp = filterVal?.op || defaultOp;
          const meta = FILTER_OP_META[currentOp] || FILTER_OP_META[defaultOp];
          const isNoInputOp = isNoInputFilterOp(currentOp);
          const inputVal = filterVal?.val ?? '';
          const isFocused = focusedColKey === col.key || openDropdownColKey === col.key;
          const isCellActive = isFocused || hasActiveVal;

          let placeholderText =
            isBetweenFilterOp(currentOp)
              ? 'VD: 10..50'
              : isNoInputOp
              ? meta.label
              : `${meta.label}...`;

          if (col.dataType === DATA_TYPES.NUMBER && columnSums && columnSums[col.key] !== undefined) {
            const sumVal = columnSums[col.key] || 0;
            const formattedSum = Math.abs(sumVal) >= 1000
              ? formatGridNumber(Math.round(sumVal))
              : formatGridNumber(sumVal, 2);
            placeholderText = isNoInputOp ? meta.label : formattedSum;
          }

            const isEmptyCol = !!emptyColKeys?.has(col.key);

            return (
              <div
                key={`filter_${col.key}`}
                data-col-key={col.key}
                style={stickyFilterStyle}
                className={`flex items-center justify-center px-1 ${cellBorderRight} ${cellBorderLeft} border-b-2 border-b-[var(--agv-border-strong)] shrink-0 box-border h-[34px]`}
              >
                <div
                  onFocus={() => {
                    if (!isEmptyCol) {
                      setFocusedColKey(col.key);
                      setOpenDropdownColKey(null);
                      setDropdownPos(null);
                      setMultiFilterColKey(null);
                      setMultiFilterAnchor(null);
                      window.dispatchEvent(
                        new CustomEvent('agv-close-all-popups', {
                          detail: {
                            except: dataType === DATA_TYPES.DATE ? 'datepicker' : 'focus-cell',
                            source: 'filter-cell',
                          },
                        })
                      );
                    }
                  }}
                  onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                      setFocusedColKey((prev) => (prev === col.key ? null : prev));
                    }
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!isEmptyCol && col.dataType !== DATA_TYPES.SYSTEM && col.filterable !== false && !col.isChart) {
                      handleOpenMultiFilter(col.key, e);
                    }
                  }}
                  className={`flex items-center w-full h-[28px] min-h-[28px] ${getGridControlRadiusClass()} border transition-colors overflow-hidden agv-filter-cell-box ${
                    isEmptyCol ? 'opacity-60 cursor-not-allowed' : isFocused ? 'is-focused' : ''
                  }`}
                  style={{
                    backgroundColor: isEmptyCol ? 'var(--agv-bg-card, rgba(0,0,0,0.02))' : 'var(--agv-bg-root)',
                    borderColor: isCellActive && !isEmptyCol ? 'var(--agv-accent)' : 'var(--agv-border)',
                    boxShadow: isFocused && !isEmptyCol ? '0 0 0 1px var(--agv-accent)' : 'none',
                  }}
                >
                  {/* Nút Icon Toán Tử DevExtreme (chỉ hiển thị khi cột có dữ liệu; cột rỗng để trống hoàn toàn) */}
                  {!isEmptyCol && (
                    <button
                      type="button"
                      data-op-trigger={col.key}
                      disabled={isEmptyCol}
                      onClick={(e) => !isEmptyCol && handleOpenDropdown(col.key, e)}
                      className={`h-full pl-1.5 pr-0 flex items-center justify-center shrink-0 border-none bg-transparent transition-colors agv-filter-op-btn ${
                        isEmptyCol
                          ? 'opacity-30 cursor-not-allowed text-[var(--agv-text-muted)]'
                          : isCellActive
                          ? 'cursor-pointer text-[var(--agv-accent)]'
                          : 'cursor-pointer text-[var(--agv-text-muted)] hover:text-[var(--agv-accent)]'
                      }`}
                    >
                      <FilterOpIcon op={currentOp} size={14} />
                    </button>
                  )}

                  {/* Input Lọc: Phân nhánh Empty / Multi / Date / DateRange / Text / Number */}
                  <div className="relative flex-1 h-full flex items-center min-w-0">
                    {isEmptyCol ? (
                      <div className="w-full h-full cursor-not-allowed select-none" />
                    ) : isMultiActive ? (
                      (() => {
                        const isNegativeMulti = isNegativeFilterOp(filterVal?.op);
                        return (
                          <div
                            onClick={(e) => handleOpenMultiFilter(col.key, e)}
                            className="w-full h-full flex items-center justify-between px-1.5 cursor-pointer select-none"
                          >
                            <span
                              className="px-1.5 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 truncate max-w-[calc(100%-20px)] bg-[var(--agv-accent)] text-[var(--agv-accent-text,#ffffff)]"
                            >
                              {isNegativeMulti ? 'AND: ' : 'OR: '}{filterVal?.multiRanges && filterVal.multiRanges.length > 0
                                ? `${filterVal.multiRanges.length} khoảng`
                                : `${filterVal?.multiValues?.length || 1} mục`}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleClearColFilter(col.key);
                              }}
                              className="w-4 h-4 rounded-full flex items-center justify-center text-[var(--agv-text-muted)] hover:text-[var(--agv-danger,#ef4444)] transition cursor-pointer"
                            >
                              <X size={10} strokeWidth={2.5} />
                            </button>
                          </div>
                        );
                      })()
                    ) : isNoInputOp ? (
                      <div className="w-full h-full flex items-center px-2 text-[11px] italic text-[var(--agv-text-muted)] opacity-70">
                        {meta.label}
                      </div>
                    ) : dataType === DATA_TYPES.DATE ? (
                    (() => {
                      const dateBounds = col.minDate && col.maxDate
                        ? { min: col.minDate, max: col.maxDate }
                        : (getColumnDateBounds?.(col.key) || { min: '2017-01-01', max: '2027-12-31' });

                      return col.isDateRange || isBetweenFilterOp(currentOp) ? (
                        <div className="w-full h-full agv-filter-datepicker flex items-center">
                          {(() => {
                            let rangeFrom = '';
                            let rangeTo = '';
                            if (inputVal.includes('..')) {
                              const parts = inputVal.split('..');
                              rangeFrom = parts[0]?.trim() || '';
                              rangeTo = parts[1]?.trim() || '';
                            } else if (inputVal.includes(' - ')) {
                              const parts = inputVal.split(' - ');
                              rangeFrom = parts[0]?.trim() || '';
                              rangeTo = parts[1]?.trim() || '';
                            } else if (inputVal.trim()) {
                              rangeFrom = inputVal.trim();
                              rangeTo = inputVal.trim();
                            }

                            return (
                              <AdvDateRangePicker
                                from={rangeFrom}
                                to={rangeTo}
                                onChange={(range) => {
                                  const f = range.from || '';
                                  const t = range.to || '';
                                  const combined = f && t ? `${f}..${t}` : f ? `${f}..` : t ? `..${t}` : '';
                                  handleInputChange(col.key, combined);
                                }}
                                min={dateBounds.min}
                                max={dateBounds.max}
                                placeholderFrom={col.isDateRange ? 'Ngày đi' : 'Từ'}
                                placeholderTo={col.isDateRange ? 'Ngày về' : 'Đến'}
                                theme={surfaceTheme}
                                size="xs"
                                showPreset={true}
                                dualMonth={false}
                                showTime={Boolean(col.showTime)}
                              />
                            );
                          })()}
                        </div>
                      ) : (
                        <div className="w-full h-full agv-filter-datepicker flex items-center">
                          <AdvDatePicker
                            value={inputVal}
                            onChange={(val, range) => {
                              if (range && range.from && range.to && range.from !== range.to) {
                                handleInputChange(col.key, `${range.from}..${range.to}`);
                              } else {
                                handleInputChange(col.key, val);
                              }
                            }}
                            min={dateBounds.min}
                            max={dateBounds.max}
                            placeholder={placeholderText}
                            showTime={Boolean(col.showTime)}
                            theme={surfaceTheme}
                            showPreset={true}
                            size="xs"
                            className="w-full h-full"
                          />
                        </div>
                      );
                    })()
                  ) : dataType === DATA_TYPES.TIME ? (
                    isBetweenFilterOp(currentOp) ? (
                      <TimeRangeFilterInput
                        from={(() => {
                          if (inputVal.includes('..')) return inputVal.split('..')[0]?.trim() || '';
                          if (inputVal.includes(' - ')) return inputVal.split(' - ')[0]?.trim() || '';
                          return inputVal.trim();
                        })()}
                        to={(() => {
                          if (inputVal.includes('..')) return inputVal.split('..')[1]?.trim() || '';
                          if (inputVal.includes(' - ')) return inputVal.split(' - ')[1]?.trim() || '';
                          return '';
                        })()}
                        onChange={(f, t) => {
                          const combined = f && t ? (f === t ? f : `${f}..${t}`) : f || (t ? `..${t}` : '');
                          handleInputChange(col.key, combined);
                        }}
                        onFocus={() => setFocusedColKey(col.key)}
                        onBlur={() => setFocusedColKey((prev) => (prev === col.key ? null : prev))}
                        onClear={() => handleClearColFilter(col.key)}
                        hasValue={hasActiveVal}
                      />
                    ) : (
                      <TimeFilterInput
                        value={inputVal}
                        onChange={(val) => handleInputChange(col.key, val)}
                        onFocus={() => setFocusedColKey(col.key)}
                        onBlur={() => setFocusedColKey((prev) => (prev === col.key ? null : prev))}
                        onClear={() => handleClearColFilter(col.key)}
                        placeholder="HH:mm"
                        hasValue={hasActiveVal}
                      />
                    )
                  ) : dataType === DATA_TYPES.NUMBER ? (
                    isBetweenFilterOp(currentOp) ? (
                      (() => {
                        let rangeFrom = '';
                        let rangeTo = '';
                        if (inputVal.includes('..')) {
                          const parts = inputVal.split('..');
                          rangeFrom = parts[0]?.trim() || '';
                          rangeTo = parts[1]?.trim() || '';
                        } else if (inputVal.includes(' - ')) {
                          const parts = inputVal.split(' - ');
                          rangeFrom = parts[0]?.trim() || '';
                          rangeTo = parts[1]?.trim() || '';
                        } else if (inputVal.includes('/')) {
                          const parts = inputVal.split('/');
                          rangeFrom = parts[0]?.trim() || '';
                          rangeTo = parts[1]?.trim() || '';
                        } else if (inputVal.includes('~')) {
                          const parts = inputVal.split('~');
                          rangeFrom = parts[0]?.trim() || '';
                          rangeTo = parts[1]?.trim() || '';
                        } else if (inputVal.trim()) {
                          rangeFrom = inputVal.trim();
                        }

                        return (
                          <NumberRangeFilterInput
                            from={rangeFrom}
                            to={rangeTo}
                            onChange={(f, t) => {
                              const combined = f && t ? `${f}..${t}` : f ? `${f}..` : t ? `..${t}` : '';
                              handleInputChange(col.key, combined, FILTER_OPS.BETWEEN);
                            }}
                            onFocus={() => setFocusedColKey(col.key)}
                            onBlur={() => setFocusedColKey((prev) => (prev === col.key ? null : prev))}
                            onClear={() => handleClearColFilter(col.key)}
                            hasValue={hasActiveVal}
                          />
                        );
                      })()
                    ) : (
                      <SmartNumberFilterInput
                        value={inputVal}
                        onChange={(val, opOverride) => handleInputChange(col.key, val, opOverride)}
                        onFocus={() => setFocusedColKey(col.key)}
                        onBlur={() => setFocusedColKey((prev) => (prev === col.key ? null : prev))}
                        onClear={() => handleClearColFilter(col.key)}
                        placeholder={placeholderText}
                        hasValue={hasActiveVal}
                        isHighlightPlaceholder={Boolean(
                          hasCheckedRows && columnSums && columnSums[col.key] !== undefined && !isNoInputOp
                        )}
                      />
                    )
                  ) : (
                    <>
                      <input
                        type="text"
                        value={inputVal}
                        onFocus={() => setFocusedColKey(col.key)}
                        onBlur={() => setFocusedColKey((prev) => (prev === col.key ? null : prev))}
                        onChange={(e) => handleInputChange(col.key, e.target.value)}
                        placeholder={placeholderText}
                        {...NO_AUTOFILL_PROPS}
                        className="w-full h-full bg-transparent px-1.5 text-[11px] outline-none border-none placeholder:text-[var(--agv-text-muted)] placeholder:opacity-60 disabled:cursor-not-allowed"
                        style={{
                          color: 'var(--agv-text-main)',
                          minHeight: '28px',
                        }}
                      />

                      {/* Nút x xóa nhanh giá trị của cột text/number */}
                      {hasActiveVal && (
                        <button
                          type="button"
                          onClick={() => handleClearColFilter(col.key)}
                          className="absolute right-1 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full flex items-center justify-center text-[var(--agv-text-muted)] hover:text-[var(--agv-danger,#ef4444)] transition cursor-pointer"
                        >
                          <X size={10} strokeWidth={2.5} />
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Popup Menu Danh Sách Toán Tử (DevExtreme Style Operation Menu) */}
      {openDropdownColKey && dropdownPos && (
        <div
          ref={dropdownRef}
          style={{
            position: 'fixed',
            ...(dropdownPos.isFlipUp
              ? { bottom: `${dropdownPos.bottom}px`, top: 'auto' }
              : { top: `${dropdownPos.top}px`, bottom: 'auto' }),
            left: `${dropdownPos.left}px`,
            zIndex: 99999999,
            backgroundColor: 'var(--agv-bg-popup)',
            borderColor: 'var(--agv-border-popup, var(--agv-border))',
            boxShadow: '0 12px 28px -4px rgba(0, 0, 0, 0.25), 0 8px 12px -6px rgba(0, 0, 0, 0.15)',
            color: 'var(--agv-text-main)',
          }}
          className={`agv-filter-dropdown-menu w-48 py-1 rounded-md border text-xs overflow-hidden select-none ${
            dropdownPos.isFlipUp ? 'agv-spring-up' : 'agv-spring-down'
          } ${getThemeClass(surfaceTheme)}`}
          data-theme={surfaceTheme}
          data-agv-popup="true"
        >
          {(() => {
            const allowedOps = getAllowedFilterOpsForColumn(
              openDropdownColKey,
              columns,
              hasColumnEmptyCells
            );
            const currentOp = columnFilters[openDropdownColKey]?.op || getDefaultOpForCol(openDropdownColKey);

            return allowedOps.map((op) => {
              const opMeta = FILTER_OP_META[op];
              const isSelected = op === currentOp;

              return (
                <button
                  key={op}
                  type="button"
                  onClick={() => handleSelectOp(openDropdownColKey, op)}
                  className={`w-full h-[28px] min-h-[28px] px-2.5 flex items-center gap-2 text-left transition cursor-pointer ${
                    isSelected
                      ? 'bg-[var(--agv-accent)] text-[var(--agv-accent-text,#ffffff)]'
                      : 'text-[var(--agv-text-main)] hover:bg-[var(--agv-bg-item-hover)]'
                  }`}
                >
                  <FilterOpIcon op={op} size={14} className="shrink-0" />
                  <span className="flex-1 truncate">{opMeta.label}</span>
                  {isSelected && (
                    <Check size={12} strokeWidth={2.5} className="shrink-0 text-[var(--agv-accent-text,#ffffff)]" />
                  )}
                </button>
              );
            });
          })()}
        </div>
      )}

      {/* Popup Lọc nhiều điều kiện (OR) khi chuột phải vào ô filter */}
      {multiFilterColKey && (
        (() => {
          const colDef = columns.find((c) => c.key === multiFilterColKey);
          if (!colDef) return null;
          return (
            <AdvMultiFilterPopup
              isOpen={Boolean(multiFilterColKey)}
              onClose={() => {
                setMultiFilterColKey(null);
                setMultiFilterAnchor(null);
              }}
              anchorRect={multiFilterAnchor}
              column={colDef}
              currentFilter={columnFilters[multiFilterColKey]}
              onApply={(key, nextFilter) => {
                onColumnFilterChange?.(key, nextFilter);
              }}
              onClear={(key) => {
                handleClearColFilter(key);
              }}
              hasColumnEmptyCells={hasColumnEmptyCells}
              getColumnDateBounds={getColumnDateBounds}
              surfaceTheme={surfaceTheme}
            />
          );
        })()
      )}

      {/* Popup Tập hợp tiêu chí đang áp dụng khi click vào ô STT */}
      {isSummaryPopupOpen && (
        <AdvCriteriaSummaryPopup
          isOpen={isSummaryPopupOpen}
          onClose={() => setIsSummaryPopupOpen(false)}
          anchorRect={summaryAnchorRect}
          surfaceTheme={surfaceTheme}
          columns={columns}
          groupByColumnKey={groupByColumnKey}
          columnFilters={columnFilters}
          quickFilterText={quickFilterText}
          sortConfig={sortConfig}
          groupSortConfig={groupSortConfig}
          appliedQueryTree={appliedQueryTree}
          pinnedRows={pinnedRows}
          onClearRowFilter={(colKey) => handleClearColFilter(colKey)}
          onClearChecklistFilter={(colKey) => {
            const current = columnFilters[colKey];
            onColumnFilterChange?.(colKey, {
              ...current,
              selectedValues: undefined,
              includeBlanks: undefined,
            });
          }}
          onClearGroup={onUngroup}
          onClearQuickSearch={() => onQuickFilterTextChange?.('')}
          onClearSortRow={() => onSortChange?.(null)}
          onClearSortGroup={() => onToggleGroupSort?.('')}
          onClearQueryTree={() => onApplyQueryTree?.(null)}
          onUnpinRow={onUnpinRow}
          onClearAll={() => {
            onClearPinnedRows?.();
            if (onClearAllCriteria) {
              onClearAllCriteria();
            } else {
              onClearAllColumnFilters?.();
            }
          }}
        />
      )}
    </>
  );
});
