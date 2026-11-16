import React, {
  Suspense,
  lazy,
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
  useMemo,
  startTransition,
} from 'react';
import {
  getPortalThemeVars,
  computeEditorCoords,
  areEditorCoordsEqual,
  computeDropdownPageStep,
  computeNextHighlightedIndex,
  useClickOutside,
  normalizeSearchText,
  getThemeClass,
  SURFACE_THEMES,
  EditorCoords,
} from './enterpriseEditorUtils';
import { FilterOperation, FILTER_OPS, ColumnAlign } from '../grid/types';
import { isNoInputFilterOp } from '../grid/gridFormatUtils';
import { NO_AUTOFILL_PROPS, getGridControlRadiusClass } from '../grid/constants';
import {
  CONTROL_BOX_CLASS,
  getControlSizeClass,
} from './controlFocus';
import type { AdvSearchLookUpPopupProps } from './AdvSearchLookUpPopup';

const LazyAdvSearchLookUpPopup = lazy(
  () => import('./AdvSearchLookUpPopup')
) as unknown as <T extends Record<string, any> = any>(
  props: AdvSearchLookUpPopupProps<T>
) => React.ReactElement | null;

const preloadAdvSearchLookUpPopup = () => {
  void import('./AdvSearchLookUpPopup');
};

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
  theme = SURFACE_THEMES.LIGHT,
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
  const [isFilterRowVisible, setIsFilterRowVisible] = useState(showFilterRow);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [isKeyboardNav, setIsKeyboardNav] = useState(false);
  const [coords, setCoords] = useState<EditorCoords>({ top: 0, left: 0, width: dropdownWidth, maxHeight: 360 });

  const triggerRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const opMenuRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const tableBodyRef = useRef<HTMLDivElement | null>(null);
  const theadRef = useRef<HTMLTableSectionElement | null>(null);
  const navSourceRef = useRef<'pointer' | 'keyboard' | 'init'>('init');
  const isKeyboardNavRef = useRef(false);

  const setKeyboardNavActive = (active: boolean) => {
    if (isKeyboardNavRef.current === active) return;
    isKeyboardNavRef.current = active;
    setIsKeyboardNav(active);
  };

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

  // Snapshot các key đã chọn tại thời điểm mở popup để ghim lên đầu danh sách (không nhảy dòng khi đang thao tác)
  const [pinnedOpenKeys, setPinnedOpenKeys] = useState<Set<string>>(() =>
    defaultOpen ? new Set(selectedKeysSet) : new Set()
  );

  const rowByKeyMap = useMemo(() => {
    const map = new Map<string, T>();
    for (let i = 0; i < dataSource.length; i++) {
      const item = dataSource[i];
      const k = String(item[valueMember]);
      if (!map.has(k)) map.set(k, item);
    }
    return map;
  }, [dataSource, valueMember]);

  // Danh sách các phần tử đã được chọn (tra cứu O(1) theo Map)
  const selectedItems = useMemo(() => {
    if (multiSelect) {
      const items: T[] = [];
      selectedKeysSet.forEach((k) => {
        const hit = rowByKeyMap.get(k);
        if (hit) items.push(hit);
      });
      return items;
    }
    const curKey = curVal !== undefined && curVal !== null && curVal !== '' ? String(curVal) : '';
    const single = curKey ? rowByKeyMap.get(curKey) : undefined;
    return single ? [single] : [];
  }, [rowByKeyMap, selectedKeysSet, curVal, multiSelect]);

  const updateCoords = useCallback(() => {
    if (triggerRef.current) {
      const next = computeEditorCoords(triggerRef.current, 360, dropdownWidth);
      setCoords((prev) => (areEditorCoordsEqual(prev, next) ? prev : next));
    }
  }, [dropdownWidth]);

  useLayoutEffect(() => {
    if (defaultOpen && triggerRef.current) {
      updateCoords();
    }
  }, [defaultOpen, updateCoords]);

  const handleDropdownClose = useCallback(() => {
    setIsOpen(false);
    setPinnedOpenKeys(new Set());
    setSearchText('');
    setActiveOpMenuCol(null);
    setKeyboardNavActive(false);
    onClose?.();
  }, [onClose]);

  const openDropdown = useCallback(() => {
    if (disabled) return;
    setSearchText('');
    const snapshot = new Set(selectedKeysSet);
    setPinnedOpenKeys(snapshot);
    navSourceRef.current = 'init';
    setKeyboardNavActive(false);
    setHighlightedIndex(0);
    updateCoords();
    setIsOpen(true);
  }, [disabled, selectedKeysSet, updateCoords]);

  const handleTriggerClick = () => {
    if (disabled) return;
    if (!isOpen) {
      openDropdown();
    }
    searchInputRef.current?.focus({ preventScroll: true });
  };

  useClickOutside(
    isOpen,
    handleDropdownClose,
    updateCoords,
    triggerRef,
    dropdownRef,
    opMenuRef
  );

  useEffect(() => {
    if ((autoFocus || defaultOpen) && searchInputRef.current) {
      searchInputRef.current.focus({ preventScroll: true });
    }
  }, [autoFocus, defaultOpen]);

  useEffect(() => {
    if (isOpen && searchInputRef.current && document.activeElement !== searchInputRef.current) {
      searchInputRef.current.focus({ preventScroll: true });
    }
  }, [isOpen]);

  const searchCacheRef = useRef<{
    dataSource: T[];
    byField: Map<string, string[]>;
  } | null>(null);

  // Bộ lọc kết hợp 1 lượt: Ô tìm kiếm trên đầu + Hàng lọc từng cột + Ghim các dòng đã chọn lên đầu
  const filteredData = useMemo(() => {
    const q = normalizeSearchText(searchText.trim());
    const activeFilters = Object.entries(filterStates).filter(([_, state]) => {
      if (!state) return false;
      if (isNoInputFilterOp(state.op)) return true;
      return Boolean(state.val && state.val.trim().length > 0);
    });

    if (!q && activeFilters.length === 0 && pinnedOpenKeys.size === 0) {
      return dataSource;
    }

    const getFieldNormalized = (fieldKey: string): string[] => {
      let cache = searchCacheRef.current;
      if (!cache || cache.dataSource !== dataSource) {
        cache = { dataSource, byField: new Map() };
        searchCacheRef.current = cache;
      }
      let arr = cache.byField.get(fieldKey);
      if (!arr) {
        const len = dataSource.length;
        arr = new Array<string>(len);
        for (let i = 0; i < len; i++) {
          arr[i] = normalizeSearchText(String(dataSource[i][fieldKey] ?? ''));
        }
        cache.byField.set(fieldKey, arr);
      }
      return arr;
    };

    const fieldsToInspect = q
      ? (searchFields && searchFields.length > 0 ? searchFields : columns.map((c) => c.key)).map(String)
      : [];
    const searchFieldCols = fieldsToInspect.map((f) => getFieldNormalized(f));

    const parsedFilters = activeFilters.map(([colKey, state]) => ({
      colKey,
      op: state.op,
      colQ: normalizeSearchText(state.val?.trim() || ''),
      normCol: isNoInputFilterOp(state.op) ? null : getFieldNormalized(colKey),
    }));

    const hasPinned = pinnedOpenKeys.size > 0;
    const pinned: T[] = [];
    const rest: T[] = [];

    for (let i = 0; i < dataSource.length; i++) {
      const item = dataSource[i];

      if (q) {
        let matchedQuick = false;
        for (let f = 0; f < searchFieldCols.length; f++) {
          if (searchFieldCols[f][i].includes(q)) {
            matchedQuick = true;
            break;
          }
        }
        if (!matchedQuick) continue;
      }

      if (parsedFilters.length > 0) {
        let matchedAllFilters = true;
        for (let f = 0; f < parsedFilters.length; f++) {
          const flt = parsedFilters[f];
          if (flt.op === FILTER_OPS.IS_EMPTY) {
            const rawVal = item[flt.colKey];
            if (!(rawVal === undefined || rawVal === null || String(rawVal).trim() === '')) {
              matchedAllFilters = false;
              break;
            }
            continue;
          }
          if (flt.op === FILTER_OPS.IS_NOT_EMPTY) {
            const rawVal = item[flt.colKey];
            if (!(rawVal !== undefined && rawVal !== null && String(rawVal).trim() !== '')) {
              matchedAllFilters = false;
              break;
            }
            continue;
          }
          const colQ = flt.colQ;
          if (!colQ) continue;
          const itemValStr = flt.normCol![i];
          let ok = true;
          switch (flt.op) {
            case FILTER_OPS.EQUALS:
              ok = itemValStr === colQ;
              break;
            case FILTER_OPS.NOT_EQUALS:
              ok = itemValStr !== colQ;
              break;
            case FILTER_OPS.STARTS_WITH:
              ok = itemValStr.startsWith(colQ);
              break;
            case FILTER_OPS.ENDS_WITH:
              ok = itemValStr.endsWith(colQ);
              break;
            case FILTER_OPS.NOT_CONTAINS:
              ok = !itemValStr.includes(colQ);
              break;
            case FILTER_OPS.CONTAINS:
            default:
              ok = itemValStr.includes(colQ);
              break;
          }
          if (!ok) {
            matchedAllFilters = false;
            break;
          }
        }
        if (!matchedAllFilters) continue;
      }

      if (hasPinned && pinnedOpenKeys.has(String(item[valueMember]))) {
        pinned.push(item);
      } else {
        rest.push(item);
      }
    }

    return pinned.length > 0 ? [...pinned, ...rest] : rest;
  }, [dataSource, searchText, searchFields, columns, filterStates, pinnedOpenKeys, valueMember]);

  useEffect(() => {
    if (
      isOpen &&
      !multiSelect &&
      !searchText.trim() &&
      curVal !== undefined &&
      curVal !== null &&
      curVal !== ''
    ) {
      const curKey = String(curVal);
      const curIdx = filteredData.findIndex((item) => String(item[valueMember]) === curKey);
      if (curIdx >= 0) {
        setHighlightedIndex(curIdx);
      }
    }
  }, [isOpen, curVal, valueMember, multiSelect, filteredData, searchText]);

  // Danh sách tự đồng bộ cuộn theo highlightedIndex bên trong AdvSearchLookUpPopup (kể cả khi ảo hóa)

  // Trạng thái checkbox trên Header (chỉ cho phép Hủy chọn tất cả khi đang có mục chọn, không cho Chọn tất cả)
  const hasAnySelection = selectedKeysSet.size > 0;
  const isAllFilteredSelected = useMemo(() => {
    if (!multiSelect || filteredData.length === 0 || selectedKeysSet.size < filteredData.length) {
      return false;
    }
    return filteredData.every((item) => selectedKeysSet.has(String(item[valueMember])));
  }, [multiSelect, filteredData, selectedKeysSet, valueMember]);

  // Chọn dòng (Single-Select)
  const handleSelectSingleRow = (item: T) => {
    const newVal = item[valueMember];
    if (!isControlled) setInternalVal(newVal);
    onChange?.(newVal, item);
    setSearchText('');
    setKeyboardNavActive(false);
    setActiveOpMenuCol(null);
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
    const nextItems: T[] = [];
    for (let i = 0; i < nextArr.length; i++) {
      const hit = rowByKeyMap.get(String(nextArr[i]));
      if (hit) nextItems.push(hit);
    }
    onChange?.(nextArr, nextItems);
  };

  // Xóa toàn bộ lựa chọn (Multi-Select)
  const handleClearMultiAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!hasAnySelection) return;
    if (!isControlled) setInternalVal([]);
    onChange?.([], []);
  };

  const scrollTableToTop = () => {
    if (tableBodyRef.current && tableBodyRef.current.scrollTop > 0) {
      tableBodyRef.current.scrollTop = 0;
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchText(val);
    if (!isOpen) {
      setPinnedOpenKeys(new Set(selectedKeysSet));
      updateCoords();
      setIsOpen(true);
    }
    navSourceRef.current = 'keyboard';
    setKeyboardNavActive(val.trim().length > 0);
    scrollTableToTop();
    startTransition(() => {
      setHighlightedIndex(0);
    });
  };

  const handleFilterRowChange = (key: string, val: string) => {
    navSourceRef.current = 'keyboard';
    setKeyboardNavActive(val.trim().length > 0);
    scrollTableToTop();
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
    navSourceRef.current = 'keyboard';
    setKeyboardNavActive(false);
    scrollTableToTop();
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

  const handleListNavigationKeyDown = (e: React.KeyboardEvent) => {
    if (
      e.key === 'ArrowDown' ||
      e.key === 'ArrowUp' ||
      e.key === 'PageDown' ||
      e.key === 'PageUp'
    ) {
      e.preventDefault();
      if (filteredData.length > 0) {
        const containerEl = tableBodyRef.current;
        const firstRow = containerEl?.querySelector<HTMLElement>('tbody tr[data-lookup-idx]');
        const itemHeight = filteredData.length >= 40 ? 32 : firstRow?.offsetHeight || 32;
        const bodyVisibleH = containerEl
          ? Math.max(itemHeight, containerEl.clientHeight - (theadRef.current?.offsetHeight || 0))
          : 224;
        const pageStep = computeDropdownPageStep(bodyVisibleH, itemHeight, 6);
        navSourceRef.current = 'keyboard';
        setKeyboardNavActive(true);
        setHighlightedIndex((prev) => {
          const next = computeNextHighlightedIndex(e.key, prev, filteredData.length, pageStep);
          return next !== null ? next : prev;
        });
      }
      return;
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      handleDropdownClose();
      return;
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    if (
      e.key === 'ArrowDown' ||
      e.key === 'ArrowUp' ||
      e.key === 'PageDown' ||
      e.key === 'PageUp' ||
      e.key === 'Escape'
    ) {
      if (!isOpen) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          e.preventDefault();
          openDropdown();
          setKeyboardNavActive(true);
        }
        return;
      }
      handleListNavigationKeyDown(e);
      return;
    }
    if (e.key === 'Tab') {
      if (isOpen) {
        handleDropdownClose();
      }
      return;
    }
    if (e.key === 'Enter' && isOpen) {
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
  };

  const themeClass = getThemeClass(theme);

  const selectedDisplayText = useMemo(() => {
    if (multiSelect) {
      if (selectedItems.length === 0) return '';
      if (selectedItems.length === 1) return String(selectedItems[0][displayMember] ?? '');
      return `Đã chọn ${selectedItems.length} mục`;
    }
    return selectedItems.length > 0 ? String(selectedItems[0][displayMember] ?? '') : '';
  }, [multiSelect, selectedItems, displayMember]);

  const showMultiClear = multiSelect && selectedItems.length > 0 && !disabled;
  const textSizeClass = size === 'md' ? 'text-sm' : 'text-xs';

  return (
    <div
      ref={triggerRef}
      data-agv-trigger="true"
      data-theme={theme || undefined}
      data-state={isOpen ? 'open' : 'closed'}
      aria-expanded={isOpen}
      aria-disabled={disabled || undefined}
      style={{
        ...getPortalThemeVars(theme),
        ...style,
      }}
      onMouseEnter={preloadAdvSearchLookUpPopup}
      onFocus={preloadAdvSearchLookUpPopup}
      onClick={handleTriggerClick}
      className={`agv-searchlookupedit-wrapper relative inline-flex items-center ${CONTROL_BOX_CLASS} ${getGridControlRadiusClass()} ${getControlSizeClass(
        size
      )} w-full ${isOpen ? 'is-open' : ''} ${
        disabled ? 'opacity-50 pointer-events-none' : 'cursor-text'
      } ${themeClass} ${className}`.trim()}
    >
      <input
        ref={searchInputRef}
        type="text"
        disabled={disabled}
        value={isOpen ? searchText : selectedDisplayText}
        onChange={handleSearchChange}
        onKeyDown={handleSearchKeyDown}
        placeholder={isOpen ? searchPlaceholder : placeholder}
        {...NO_AUTOFILL_PROPS}
        className={`agv-searchlookupedit-input flex-1 min-w-0 h-full bg-transparent border-0 pl-2.5 ${
          showMultiClear ? 'pr-0.5' : 'pr-2.5'
        } text-foreground outline-none truncate placeholder:text-muted-foreground ${textSizeClass} ${
          disabled ? '' : isOpen ? 'cursor-text' : 'cursor-pointer'
        }`}
      />
      {showMultiClear && (
        <button
          type="button"
          tabIndex={-1}
          aria-label="Xóa tất cả lựa chọn"
          onClick={handleClearMultiAll}
          className="agv-inline-clear-destructive w-6 h-full shrink-0 text-sm leading-none"
        >
          ×
        </button>
      )}

      {/* Popup Bảng danh mục qua Portal (nạp lười khi mở popup) */}
      {isOpen && (coords.top > 0 || (coords.bottom ?? 0) > 0) && (
        <Suspense fallback={null}>
          <LazyAdvSearchLookUpPopup
            theme={theme}
            themeClass={themeClass}
            coords={coords}
            multiSelect={multiSelect}
            columns={columns}
            hasAnySelection={hasAnySelection}
            isAllFilteredSelected={isAllFilteredSelected}
            isFilterRowVisible={isFilterRowVisible}
            filterStates={filterStates}
            filterOperators={LOOKUP_FILTER_OPERATORS}
            filteredData={filteredData}
            valueMember={valueMember}
            selectedKeysSet={selectedKeysSet}
            isKeyboardNav={isKeyboardNav}
            highlightedIndex={highlightedIndex}
            activeOpMenuCol={activeOpMenuCol}
            dropdownRef={dropdownRef}
            opMenuRef={opMenuRef}
            tableBodyRef={tableBodyRef}
            theadRef={theadRef}
            isKeyboardNavRef={isKeyboardNavRef}
            navSourceRef={navSourceRef}
            setKeyboardNavActive={setKeyboardNavActive}
            setActiveOpMenuCol={setActiveOpMenuCol}
            handleListNavigationKeyDown={handleListNavigationKeyDown}
            handleClearMultiAll={handleClearMultiAll}
            handleFilterRowChange={handleFilterRowChange}
            handleFilterOpChange={handleFilterOpChange}
            handleToggleMultiRow={handleToggleMultiRow}
            handleSelectSingleRow={handleSelectSingleRow}
          />
        </Suspense>
      )}
    </div>
  );
}

export default AdvSearchLookUpEdit;
