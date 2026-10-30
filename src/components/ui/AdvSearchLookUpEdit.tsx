import React, { useState, useRef, useEffect, useLayoutEffect, useCallback, useMemo, startTransition } from 'react';
import { createPortal } from 'react-dom';
import { Check } from 'lucide-react';
import {
  getPortalThemeVars,
  computeEditorCoords,
  useClickOutside,
  normalizeSearchText,
  getThemeClass,
  SURFACE_THEMES,
  EditorCoords,
} from './enterpriseEditorUtils';
import { FilterOpIcon } from '../grid/FilterIcons';
import { FilterOperation, FILTER_OPS, ALIGNMENTS, ColumnAlign } from '../grid/types';
import { isNoInputFilterOp, getAlignTextClass } from '../grid/gridUtils';
import { NO_AUTOFILL_PROPS, getGridControlRadiusClass } from '../grid/constants';

/* ==============================================================================
   CONTROL: AdvSearchLookUpEdit (LookUp danh mục tích hợp Tìm kiếm, Filter Row & Multi-Select)
   ============================================================================== */

export type LookUpFilterOp = FilterOperation;

export interface LookUpColumnFilterState {
  val: string;
  op: LookUpFilterOp;
}

export const LOOKUP_FILTER_OPERATORS: { id: LookUpFilterOp; label: string }[] = [
  { id: FILTER_OPS.CONTAINS, label: 'Có chứa' },
  { id: FILTER_OPS.STARTS_WITH, label: 'Bắt đầu bằng' },
  { id: FILTER_OPS.ENDS_WITH, label: 'Kết thúc bằng' },
  { id: FILTER_OPS.EQUALS, label: 'Bằng' },
  { id: FILTER_OPS.NOT_EQUALS, label: 'Không bằng' },
  { id: FILTER_OPS.NOT_CONTAINS, label: 'Không chứa' },
  { id: FILTER_OPS.IS_EMPTY, label: 'Trống' },
  { id: FILTER_OPS.IS_NOT_EMPTY, label: 'Không trống' },
];

export interface AdvLookUpColumn<T = any> {
  key: keyof T | string;
  title: string;
  width?: number | string;
  align?: ColumnAlign;
  className?: string;
}

export interface AdvSearchLookUpEditProps<T = any> {
  value?: any; // Đơn giá trị nếu single-select, hoặc mảng giá trị (any[]) nếu multiSelect=true
  defaultValue?: any;
  onChange?: (val: any, itemOrItems?: any) => void;
  dataSource?: T[];
  valueMember: keyof T | string;
  displayMember: keyof T | string;
  columns: AdvLookUpColumn<T>[];
  placeholder?: string;
  size?: 'sm' | 'md';
  disabled?: boolean;
  dropdownWidth?: number;
  className?: string;
  style?: React.CSSProperties;
  theme?: string;

  // Ô tìm kiếm nhanh trên đầu
  searchPlaceholder?: string;
  searchFields?: (keyof T | string)[];
  showFooterCount?: boolean;

  // Hàng lọc từng cột (Filter Row)
  showFilterRow?: boolean;

  // Chế độ chọn nhiều giá trị
  multiSelect?: boolean;
  defaultOpen?: boolean;
  autoFocus?: boolean;
  onClose?: () => void;
}

export function AdvSearchLookUpEdit<T extends Record<string, any> = any>({
  value,
  defaultValue,
  onChange,
  dataSource = [],
  valueMember,
  displayMember,
  columns = [],
  placeholder = 'Tìm kiếm hoặc chọn...',
  size = 'sm',
  disabled = false,
  dropdownWidth = 460,
  className = '',
  style = {},
  theme = SURFACE_THEMES.BEZIER_ARTHOUSE,
  searchPlaceholder = 'Tìm kiếm nhanh trong danh mục...',
  searchFields,
  showFooterCount = true,
  showFilterRow = false,
  multiSelect = false,
  defaultOpen = false,
  autoFocus = false,
  onClose,
}: AdvSearchLookUpEditProps<T>) {
  const isControlled = value !== undefined;
  const [internalVal, setInternalVal] = useState<any>(
    isControlled ? value : defaultValue !== undefined ? defaultValue : multiSelect ? [] : undefined
  );
  const curVal = isControlled ? value : internalVal;

  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [searchText, setSearchText] = useState('');
  const [filterStates, setFilterStates] = useState<Record<string, LookUpColumnFilterState>>({});
  const [activeOpMenuCol, setActiveOpMenuCol] = useState<string | null>(null);
  const [opMenuCoords, setOpMenuCoords] = useState<{ top: number; left: number; bottom?: number; isFlipUp?: boolean }>({ top: 0, left: 0 });
  const [isFilterRowVisible, setIsFilterRowVisible] = useState(showFilterRow);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [coords, setCoords] = useState<EditorCoords>({ top: 0, left: 0, width: dropdownWidth, maxHeight: 360 });

  const triggerRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const opMenuRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const tableBodyRef = useRef<HTMLDivElement | null>(null);

  // Set các keys đang được chọn (dành cho multiSelect và highlight)
  const selectedKeysSet = useMemo(() => {
    if (multiSelect) {
      const arr = Array.isArray(curVal)
        ? curVal
        : curVal !== undefined && curVal !== null && curVal !== ''
        ? [curVal]
        : [];
      return new Set(arr.map(String));
    }
    return new Set(curVal !== undefined && curVal !== null && curVal !== '' ? [String(curVal)] : []);
  }, [curVal, multiSelect]);

  // Danh sách các phần tử đã được chọn
  const selectedItems = useMemo(() => {
    if (multiSelect) {
      return dataSource.filter((item) => selectedKeysSet.has(String(item[valueMember])));
    }
    const single = dataSource.find((item) => String(item[valueMember]) === String(curVal));
    return single ? [single] : [];
  }, [dataSource, selectedKeysSet, curVal, valueMember, multiSelect]);

  const updateCoords = useCallback(() => {
    if (triggerRef.current) {
      setCoords(computeEditorCoords(triggerRef.current, 360, dropdownWidth));
    }
  }, [dropdownWidth]);

  useLayoutEffect(() => {
    if (defaultOpen && triggerRef.current) {
      updateCoords();
    }
  }, [defaultOpen, updateCoords]);

  const toggleDropdown = () => {
    if (disabled) return;
    if (!isOpen) {
      setSearchText('');
      const curKey = String(curVal);
      const curIdx = dataSource.findIndex((item) => String(item[valueMember]) === curKey);
      setHighlightedIndex(curIdx >= 0 ? curIdx : 0);
      updateCoords();
    } else {
      setActiveOpMenuCol(null);
    }
    setIsOpen((prev) => !prev);
  };

  useClickOutside(
    isOpen,
    () => {
      setIsOpen(false);
      setActiveOpMenuCol(null);
      onClose?.();
    },
    updateCoords,
    triggerRef,
    dropdownRef
  );

  // Click outside để tự đóng Menu Toán Tử Lọc
  useEffect(() => {
    if (!activeOpMenuCol) return;
    const handleOutside = (e: MouseEvent) => {
      if (opMenuRef.current && !opMenuRef.current.contains(e.target as Node)) {
        setActiveOpMenuCol(null);
      }
    };
    window.addEventListener('mousedown', handleOutside, true);
    return () => window.removeEventListener('mousedown', handleOutside, true);
  }, [activeOpMenuCol]);

  // Focus ô tìm kiếm khi mở popup
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus({ preventScroll: true });
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Tự động cuộn lên đầu danh sách khi tìm kiếm, filter hoặc mở popup
  useEffect(() => {
    if (tableBodyRef.current && tableBodyRef.current.scrollTop > 0) {
      tableBodyRef.current.scrollTop = 0;
    }
  }, [searchText, filterStates, isOpen]);

  // Bộ lọc kết hợp: Ô tìm kiếm trên đầu + Hàng lọc từng cột (Filter Row với Toán tử chuẩn Grid)
  const filteredData = useMemo(() => {
    let result = dataSource;

    // 1. Ô tìm kiếm nhanh trên đầu
    const q = normalizeSearchText(searchText.trim());
    if (q) {
      const fieldsToInspect =
        searchFields && searchFields.length > 0 ? searchFields : columns.map((c) => c.key);
      result = result.filter((item) => {
        return fieldsToInspect.some((f) => {
          const valStr = normalizeSearchText(String(item[f] ?? ''));
          return valStr.includes(q);
        });
      });
    }

    // 2. Hàng lọc từng cột (Filter Row với toán tử chuẩn DevExpress)
    const activeFilters = Object.entries(filterStates).filter(([_, state]) => {
      if (!state) return false;
      if (isNoInputFilterOp(state.op)) return true;
      return state.val && state.val.trim().length > 0;
    });

    if (activeFilters.length > 0) {
      result = result.filter((item) => {
        return activeFilters.every(([colKey, state]) => {
          const rawVal = item[colKey];
          const itemValStr = normalizeSearchText(String(rawVal ?? ''));
          const colQ = normalizeSearchText(state.val?.trim() || '');

          switch (state.op) {
            case FILTER_OPS.IS_EMPTY:
              return rawVal === undefined || rawVal === null || String(rawVal).trim() === '';
            case FILTER_OPS.IS_NOT_EMPTY:
              return rawVal !== undefined && rawVal !== null && String(rawVal).trim() !== '';
            case FILTER_OPS.EQUALS:
              return !colQ || itemValStr === colQ;
            case FILTER_OPS.NOT_EQUALS:
              return !colQ || itemValStr !== colQ;
            case FILTER_OPS.STARTS_WITH:
              return !colQ || itemValStr.startsWith(colQ);
            case FILTER_OPS.ENDS_WITH:
              return !colQ || itemValStr.endsWith(colQ);
            case FILTER_OPS.NOT_CONTAINS:
              return !colQ || !itemValStr.includes(colQ);
            case FILTER_OPS.CONTAINS:
            default:
              return !colQ || itemValStr.includes(colQ);
          }
        });
      });
    }

    return result;
  }, [dataSource, searchText, searchFields, columns, filterStates]);

  useEffect(() => {
    if (isOpen && !multiSelect && curVal !== undefined && curVal !== null && curVal !== '') {
      const curKey = String(curVal);
      const curIdx = filteredData.findIndex((item) => String(item[valueMember]) === curKey);
      if (curIdx >= 0) {
        setHighlightedIndex(curIdx);
      }
    }
  }, [isOpen, curVal, valueMember, multiSelect, filteredData]);

  // Trạng thái kiểm tra checkbox trên Header (Chọn tất cả / 1 phần)
  const isAllFilteredSelected = useMemo(() => {
    if (filteredData.length === 0) return false;
    return filteredData.every((item) => selectedKeysSet.has(String(item[valueMember])));
  }, [filteredData, selectedKeysSet, valueMember]);

  const isSomeFilteredSelected = useMemo(() => {
    if (filteredData.length === 0 || isAllFilteredSelected) return false;
    return filteredData.some((item) => selectedKeysSet.has(String(item[valueMember])));
  }, [filteredData, selectedKeysSet, isAllFilteredSelected, valueMember]);

  // Chọn dòng (Single-Select)
  const handleSelectSingleRow = (item: T) => {
    const newVal = item[valueMember];
    if (!isControlled) setInternalVal(newVal);
    onChange?.(newVal, item);
    setIsOpen(false);
    onClose?.();
  };

  // Đảo trạng thái chọn dòng (Multi-Select)
  const handleToggleMultiRow = (item: T, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const itemKey = item[valueMember];
    const itemKeyStr = String(itemKey);
    const currentArr: any[] = Array.isArray(curVal)
      ? [...curVal]
      : curVal !== undefined && curVal !== null && curVal !== ''
      ? [curVal]
      : [];
    const exists = currentArr.some((k) => String(k) === itemKeyStr);

    let nextArr: any[];
    if (exists) {
      nextArr = currentArr.filter((k) => String(k) !== itemKeyStr);
    } else {
      nextArr = [...currentArr, itemKey];
    }

    if (!isControlled) setInternalVal(nextArr);
    const nextItems = dataSource.filter((d) => nextArr.map(String).includes(String(d[valueMember])));
    onChange?.(nextArr, nextItems);
  };

  // Toggle chọn tất cả các dòng đang hiển thị trong bộ lọc
  const handleToggleSelectAll = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const currentArr: any[] = Array.isArray(curVal)
      ? [...curVal]
      : curVal !== undefined && curVal !== null && curVal !== ''
      ? [curVal]
      : [];
    const filteredKeys = filteredData.map((d) => d[valueMember]);

    let nextArr: any[];
    if (isAllFilteredSelected) {
      // Bỏ chọn tất cả các dòng hiển thị
      const filteredKeysSet = new Set(filteredKeys.map(String));
      nextArr = currentArr.filter((k) => !filteredKeysSet.has(String(k)));
    } else {
      // Thêm các dòng còn thiếu
      const currentSet = new Set(currentArr.map(String));
      const toAdd = filteredKeys.filter((k) => !currentSet.has(String(k)));
      nextArr = [...currentArr, ...toAdd];
    }

    if (!isControlled) setInternalVal(nextArr);
    const nextItems = dataSource.filter((d) => nextArr.map(String).includes(String(d[valueMember])));
    onChange?.(nextArr, nextItems);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchText(val);
    startTransition(() => {
      setHighlightedIndex(0);
    });
  };

  const handleFilterRowChange = (key: string, val: string) => {
    startTransition(() => {
      setFilterStates((prev) => ({
        ...prev,
        [key]: {
          op: prev[key]?.op || FILTER_OPS.CONTAINS,
          val,
        },
      }));
      setHighlightedIndex(0);
    });
  };

  const handleFilterOpChange = (key: string, op: LookUpFilterOp) => {
    startTransition(() => {
      setFilterStates((prev) => ({
        ...prev,
        [key]: {
          val: prev[key]?.val || '',
          op,
        },
      }));
      setActiveOpMenuCol(null);
      setHighlightedIndex(0);
    });
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (filteredData.length > 0) {
        setHighlightedIndex((prev) => (prev + 1) % filteredData.length);
      }
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (filteredData.length > 0) {
        setHighlightedIndex((prev) => (prev - 1 + filteredData.length) % filteredData.length);
      }
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredData.length > 0) {
        const targetIdx =
          highlightedIndex >= 0 && highlightedIndex < filteredData.length ? highlightedIndex : 0;
        const targetItem = filteredData[targetIdx];
        if (multiSelect) {
          handleToggleMultiRow(targetItem);
        } else {
          handleSelectSingleRow(targetItem);
        }
      }
      return;
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      onClose?.();
      return;
    }
  };

  const themeClass = getThemeClass(theme);
  const sizeHeight = size === 'md' ? 'min-h-[32px]' : 'min-h-[28px]';

  // Hiển thị nội dung trên Trigger
  const renderTriggerContent = () => {
    if (multiSelect) {
      if (selectedItems.length === 0) {
        return <span className="text-[var(--agv-text-muted)] truncate">{placeholder}</span>;
      }
      return (
        <div className="flex flex-wrap items-center gap-1 py-0.5 max-w-full">
          {selectedItems.map((item) => (
            <span
              key={String(item[valueMember])}
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-medium bg-[var(--agv-bg-subtle)] text-[var(--agv-text-main)] border border-[var(--agv-border)] select-none shrink-0"
            >
              <span className="truncate max-w-[120px]">{String(item[displayMember] ?? '')}</span>
              <span
                role="button"
                onClick={(e) => handleToggleMultiRow(item, e)}
                className="hover:text-[var(--agv-danger,#ef4444)] cursor-pointer text-xs leading-none font-bold ml-0.5"
              >
                ×
              </span>
            </span>
          ))}
        </div>
      );
    }

    if (selectedItems.length > 0) {
      return (
        <span className="truncate font-medium text-[var(--agv-text-main)]">
          {String(selectedItems[0][displayMember] ?? '')}
        </span>
      );
    }

    return <span className="text-[var(--agv-text-muted)] truncate">{placeholder}</span>;
  };

  return (
    <div
      ref={triggerRef}
      data-theme={theme || undefined}
      style={{
        backgroundColor: 'var(--agv-bg-control, var(--agv-bg-root))',
        color: 'var(--agv-text-main)',
        borderColor: isOpen ? 'var(--agv-accent)' : 'var(--agv-border)',
        ...getPortalThemeVars(theme),
        ...style,
      }}
      onClick={toggleDropdown}
      className={`agv-searchlookupedit-wrapper relative inline-flex items-center ${getGridControlRadiusClass()} cursor-pointer select-none ${sizeHeight} min-h-[28px] max-h-[30px] w-full h-full ${
        isOpen
          ? 'is-open border-2'
          : 'border'
      } ${disabled ? 'opacity-50 pointer-events-none' : ''} ${themeClass} ${className}`.trim()}
    >
      <div className="agv-searchlookupedit-display w-full h-full flex items-center px-2.5 py-0.5 truncate text-xs flex-1 min-w-0">
        {renderTriggerContent()}
      </div>

      {/* Popup Bảng danh mục tích hợp Search Box, Filter Row và Multi-Select qua Portal */}
      {isOpen && (coords.top > 0 || (coords.bottom ?? 0) > 0) &&
        createPortal(
          <div
            ref={dropdownRef}
            data-theme={theme || undefined}
            style={{
              position: 'fixed',
              ...(coords.isFlipUp
                ? { bottom: `${coords.bottom}px`, top: 'auto' }
                : { top: `${coords.top}px`, bottom: 'auto' }),
              left: `${coords.left}px`,
              width: `${coords.width}px`,
              maxHeight: `${coords.maxHeight}px`,
              zIndex: 99999999,
              backgroundColor: 'var(--agv-bg-popup)',
              borderColor: 'var(--agv-border-popup, var(--agv-border))',
              color: 'var(--agv-text-main)',
              boxShadow: '0 12px 28px -4px rgba(0, 0, 0, 0.25), 0 8px 12px -6px rgba(0, 0, 0, 0.15)',
              ...getPortalThemeVars(theme),
            }}
            className={`agv-searchlookupedit-dropdown rounded-md border overflow-hidden flex flex-col text-xs ${
              coords.isFlipUp ? 'agv-spring-up' : 'agv-spring-down'
            } ${themeClass}`}
            data-agv-popup="true"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 1. Header: Ô tìm kiếm nhanh trên đầu (Find Panel) */}
            <div className="p-2 border-b border-[var(--agv-border)] bg-[var(--agv-bg-root)]">
              <div className="relative flex items-center">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchText}
                  onChange={handleSearchChange}
                  onKeyDown={handleSearchKeyDown}
                  placeholder={searchPlaceholder}
                  {...NO_AUTOFILL_PROPS}
                  className="w-full h-7 min-h-[28px] rounded border border-[var(--agv-border)] bg-[var(--agv-bg-control)] px-2.5 text-xs text-[var(--agv-text-main)] placeholder-[var(--agv-text-muted)] outline-none focus:border-[var(--agv-accent)]"
                />
                {searchText && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchText('');
                      setHighlightedIndex(0);
                      searchInputRef.current?.focus();
                    }}
                    className="absolute right-2 text-xs text-[var(--agv-text-muted)] hover:text-[var(--agv-text-main)] cursor-pointer"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* 2. Body: Lưới dữ liệu nhiều cột kèm Filter Row */}
            <div ref={tableBodyRef} className="overflow-auto flex-1 max-h-[230px]">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[var(--agv-bg-header)] sticky top-0 z-10 border-b border-[var(--agv-border)] text-[11px] font-semibold text-[var(--agv-text-header)]">
                  {/* Hàng 1: Tiêu đề cột */}
                  <tr>
                    {multiSelect && (
                      <th
                        style={{ width: 36 }}
                        className="px-2 py-1.5 text-center cursor-pointer select-none"
                        onClick={handleToggleSelectAll}
                      >
                        <span
                          className={`inline-flex items-center justify-center w-4 h-4 rounded border transition-colors ${
                            isAllFilteredSelected || isSomeFilteredSelected
                              ? 'bg-[var(--agv-accent)] border-[var(--agv-accent)] text-[var(--agv-accent-text,#ffffff)]'
                              : 'border-[var(--agv-border)] bg-[var(--agv-bg-control)]'
                          }`}
                        >
                          {isAllFilteredSelected && (
                            <Check size={11} strokeWidth={3} />
                          )}
                          {isSomeFilteredSelected && (
                            <span className="w-2 h-0.5 bg-current rounded-sm" />
                          )}
                        </span>
                      </th>
                    )}
                    {columns.map((col) => (
                      <th
                        key={String(col.key)}
                        style={{ width: col.width }}
                        className={`px-2.5 py-1.5 select-none ${getAlignTextClass(col.align)}`}
                      >
                        {col.title}
                      </th>
                    ))}
                  </tr>

                  {/* Hàng 2: Hàng lọc từng cột (Filter Row) */}
                  {isFilterRowVisible && (
                    <tr className="bg-[var(--agv-bg-root)] border-t border-[var(--agv-border)]">
                      {multiSelect && <th className="px-1 py-1 text-center bg-[var(--agv-bg-header)]" />}
                      {columns.map((col) => {
                        const colKeyStr = String(col.key);
                        const curColState = filterStates[colKeyStr] || { val: '', op: FILTER_OPS.CONTAINS };
                        const curOpDef =
                          LOOKUP_FILTER_OPERATORS.find((o) => o.id === curColState.op) ||
                          LOOKUP_FILTER_OPERATORS[0];
                        const isBlankOp = isNoInputFilterOp(curColState.op);

                        return (
                          <th key={`filter_${colKeyStr}`} className="p-1 font-normal">
                            <div className="flex h-7 min-h-[28px] items-center rounded border border-[var(--agv-border)] bg-[var(--agv-bg-control)] overflow-hidden focus-within:border-[var(--agv-accent)]">
                              {/* Nút bấm chọn Toán tử lọc */}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (activeOpMenuCol === colKeyStr) {
                                    setActiveOpMenuCol(null);
                                  } else {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    const vh = window.innerHeight;
                                    const spaceBelow = vh - rect.bottom - 8;
                                    const spaceAbove = rect.top - 8;
                                    const isFlipUp = spaceBelow < 200 && spaceAbove > spaceBelow;
                                    setOpMenuCoords({
                                      top: Math.round(rect.bottom + 4),
                                      bottom: Math.round(vh - rect.top + 4),
                                      left: Math.round(rect.left),
                                      isFlipUp,
                                    });
                                    setActiveOpMenuCol(colKeyStr);
                                  }
                                }}
                                className="flex h-full min-h-[28px] w-7 min-w-[28px] items-center justify-center border-r border-[var(--agv-border)] bg-[var(--agv-bg-header)] text-[var(--agv-text-muted)] hover:bg-[var(--agv-bg-item-hover)] hover:text-[var(--agv-text-main)] cursor-pointer select-none transition-colors p-0"
                              >
                                <FilterOpIcon op={curColState.op as FilterOperation} size={13} />
                              </button>

                              {/* Ô input nhập điều kiện lọc */}
                              <div className="relative flex flex-1 items-center h-full">
                                <input
                                  type="text"
                                  value={isBlankOp ? `(${curOpDef.label})` : curColState.val}
                                  disabled={isBlankOp}
                                  onChange={(e) => handleFilterRowChange(colKeyStr, e.target.value)}
                                  placeholder="Lọc..."
                                  {...NO_AUTOFILL_PROPS}
                                  className={`w-full h-full min-h-[28px] bg-transparent px-2 text-xs text-[var(--agv-text-main)] placeholder-[var(--agv-text-muted)] outline-none ${
                                    isBlankOp ? 'italic opacity-70 select-none cursor-not-allowed' : ''
                                  }`}
                                />
                                {!isBlankOp && curColState.val && (
                                  <button
                                    type="button"
                                    onClick={() => handleFilterRowChange(colKeyStr, '')}
                                    className="absolute right-1 text-xs text-[var(--agv-text-muted)] hover:text-[var(--agv-text-main)] cursor-pointer select-none"
                                  >
                                    ×
                                  </button>
                                )}
                              </div>
                            </div>
                          </th>
                        );
                      })}
                    </tr>
                  )}
                </thead>
                <tbody className="divide-y divide-[var(--agv-border)]">
                  {filteredData.length === 0 ? (
                    <tr>
                      <td
                        colSpan={columns.length + (multiSelect ? 1 : 0)}
                        className="px-3 py-4 text-center text-xs text-[var(--agv-text-muted)]"
                      >
                        Không tìm thấy dữ liệu phù hợp
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((item, idx) => {
                      const itemKeyStr = String(item[valueMember]);
                      const isSelected = selectedKeysSet.has(itemKeyStr);
                      const isHighlighted = idx === highlightedIndex;

                      let rowClass = 'text-[var(--agv-text-main)] hover:bg-[var(--agv-bg-hover)]';
                      if (isHighlighted || isSelected) {
                        rowClass =
                          'bg-[var(--agv-accent)] text-[var(--agv-accent-text,#ffffff)] font-medium';
                      }

                      return (
                        <tr
                          key={itemKeyStr || idx}
                          onClick={(e) => {
                            if (multiSelect) {
                              handleToggleMultiRow(item, e);
                            } else {
                              handleSelectSingleRow(item);
                            }
                          }}
                          onMouseEnter={() => setHighlightedIndex(idx)}
                          className={`cursor-pointer transition-colors ${rowClass}`}
                        >
                          {multiSelect && (
                            <td
                              className="px-2 py-1.5 text-center"
                              onClick={(e) => handleToggleMultiRow(item, e)}
                            >
                              <span
                                className={`inline-flex items-center justify-center w-4 h-4 rounded border transition-colors ${
                                  isSelected
                                    ? 'bg-[var(--agv-accent)] border-[var(--agv-accent-text,#ffffff)] text-[var(--agv-accent-text,#ffffff)]'
                                    : 'border-[var(--agv-border)] bg-[var(--agv-bg-control)]'
                                }`}
                              >
                                {isSelected && (
                                  <Check size={11} strokeWidth={3} />
                                )}
                              </span>
                            </td>
                          )}
                          {columns.map((col) => (
                            <td
                              key={String(col.key)}
                              className={`px-2.5 py-1.5 truncate ${col.className ? `${col.className} ` : ''}${getAlignTextClass(
                                col.align
                              )}`}
                            >
                              {String(item[col.key] ?? '')}
                            </td>
                          ))}
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>,
          document.body
        )}

      {/* 4. Portal Operator Menu (Tự đóng khi click outside) */}
      {activeOpMenuCol &&
        createPortal(
          <div
            ref={opMenuRef}
            data-theme={theme || undefined}
            style={{
              position: 'fixed',
              ...(opMenuCoords.isFlipUp
                ? { bottom: `${opMenuCoords.bottom}px`, top: 'auto' }
                : { top: `${opMenuCoords.top}px`, bottom: 'auto' }),
              left: `${opMenuCoords.left}px`,
              zIndex: 100000000,
              backgroundColor: 'var(--agv-bg-popup)',
              borderColor: 'var(--agv-border-popup, var(--agv-border))',
              color: 'var(--agv-text-main)',
              boxShadow: '0 12px 28px -4px rgba(0, 0, 0, 0.25), 0 8px 12px -6px rgba(0, 0, 0, 0.15)',
              ...getPortalThemeVars(theme),
            }}
            className={`agv-lookup-op-menu rounded-md border overflow-hidden flex flex-col text-xs py-1 min-w-[145px] ${
              opMenuCoords.isFlipUp ? 'agv-spring-up' : 'agv-spring-down'
            } ${themeClass}`}
            data-agv-popup="true"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {LOOKUP_FILTER_OPERATORS.map((opItem) => {
              const curColState = filterStates[activeOpMenuCol] || { val: '', op: FILTER_OPS.CONTAINS };
              const isSelected = curColState.op === opItem.id;
              return (
                <div
                  key={opItem.id}
                  onClick={() => handleFilterOpChange(activeOpMenuCol, opItem.id)}
                  className={`flex min-h-[28px] cursor-pointer items-center gap-2 px-2.5 py-1 transition-colors select-none ${
                    isSelected
                      ? 'bg-[var(--agv-accent)] font-semibold text-[var(--agv-accent-text,#ffffff)]'
                      : 'text-[var(--agv-text-main)] hover:bg-[var(--agv-bg-item-hover)]'
                  }`}
                >
                  <span className="w-4 flex items-center justify-center shrink-0">
                    <FilterOpIcon op={opItem.id as FilterOperation} size={13} />
                  </span>
                  <span>{opItem.label}</span>
                </div>
              );
            })}
          </div>,
          document.body
        )}
    </div>
  );
}

export default AdvSearchLookUpEdit;
