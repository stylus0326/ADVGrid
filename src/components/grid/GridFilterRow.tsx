import React, { useState, useEffect, useMemo } from 'react';
import { X, Check } from 'lucide-react';
import { AdvAnchoredPopover } from '../ui/AdvPopover';
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
import './filterRow.css';
import { getPinnedDividerClass, getRightPinnedDividerClass, NO_AUTOFILL_PROPS, getGridControlRadiusClass } from './constants';
import { CONTROL_BOX_CLASS } from '../ui/controlFocus';
import { AdvButton } from '../ui/AdvButton';
import {
  createEqualsFilter,
  formatGridNumber,
  isNoInputFilterOp,
  isBetweenFilterOp,
  isNegativeFilterOp,
  isSelectionColumn,
} from './gridFormatUtils';
import { getThemeClass } from '../../themes';
import { GridSelectionCheckbox } from './GridSelectionCheckbox';
import { hasActiveQueryRules } from './floating/queryRuleCheck';
const LazyNumberRangeFilterInput = React.lazy(() =>
  import('./GridSmartNumberInputs').then((m) => ({ default: m.NumberRangeFilterInput }))
);
const LazySmartNumberFilterInput = React.lazy(() =>
  import('./GridSmartNumberInputs').then((m) => ({ default: m.SmartNumberFilterInput }))
);

const LazyTimeRangeFilterInput = React.lazy(() =>
  import('./GridTimeFilterInputs').then((m) => ({ default: m.TimeRangeFilterInput }))
);
const LazyTimeFilterInput = React.lazy(() =>
  import('./GridTimeFilterInputs').then((m) => ({ default: m.TimeFilterInput }))
);

const LazyGridDateFilterCell = React.lazy(() =>
  import('./GridDateFilterCell').then((m) => ({ default: m.GridDateFilterCell }))
);
const LazyAdvMultiFilterPopup = React.lazy(() =>
  import('./AdvMultiFilterPopup').then((m) => ({ default: m.AdvMultiFilterPopup }))
);
const LazyAdvCriteriaSummaryPopup = React.lazy(() =>
  import('./AdvCriteriaSummaryPopup').then((m) => ({ default: m.AdvCriteriaSummaryPopup }))
);

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
  sortRules?: SortConfig[];
  groupSortConfig?: GroupSortConfig | null;
  appliedQueryTree?: any;
  pinnedRows?: Array<{ rowKey: string | number; rowIndex: number; row: any }>;
  onUngroup?: () => void;
  onSortChange?: (sort: SortConfig | null) => void;
  onRemoveSortRule?: (colKey: string) => void;
  onToggleGroupSort?: (colKey: string) => void;
  onQuickFilterTextChange?: (text: string) => void;
  onApplyQueryTree?: (tree: any) => void;
  onUnpinRow?: (rowKey: string | number) => void;
  onClearPinnedRows?: () => void;
}

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
  sortRules,
  groupSortConfig,
  appliedQueryTree,
  pinnedRows = [],
  onUngroup,
  onSortChange,
  onRemoveSortRule,
  onToggleGroupSort,
  onQuickFilterTextChange,
  onApplyQueryTree,
  onUnpinRow,
  onClearPinnedRows,
}) => {
  // Quản lý popup tập hợp tiêu chí đang áp dụng (STT cell)
  const [isSummaryPopupOpen, setIsSummaryPopupOpen] = useState(false);
  const [summaryAnchorEl, setSummaryAnchorEl] = useState<HTMLElement | null>(null);
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
      setSummaryAnchorEl(e.currentTarget);
      setSummaryAnchorRect(e.currentTarget.getBoundingClientRect());
      setIsSummaryPopupOpen(true);
    }
  };

  // Tính tổng số tiêu chí đang active để hiển thị badge số lượng chuẩn
  const totalActiveCriteriaCount = useMemo(() => {
    let count = activeFilterCount;
    if (groupByColumnKey) count += 1;
    if (quickFilterText && quickFilterText.trim().length > 0) count += 1;
    const activeSortCount =
      sortRules && sortRules.length > 0
        ? sortRules.length
        : sortConfig && sortConfig.key
        ? 1
        : 0;
    count += activeSortCount;
    if (groupSortConfig && groupSortConfig.colKey) count += 1;
    if (appliedQueryTree && hasActiveQueryRules(appliedQueryTree)) count += 1;
    if (pinnedRows && pinnedRows.length > 0) count += pinnedRows.length;
    return count;
  }, [
    activeFilterCount,
    groupByColumnKey,
    quickFilterText,
    sortConfig,
    sortRules,
    groupSortConfig,
    appliedQueryTree,
    pinnedRows,
  ]);

  // Quản lý popup chọn toán tử đang mở
  const [openDropdownColKey, setOpenDropdownColKey] = useState<string | null>(null);
  const [focusedColKey, setFocusedColKey] = useState<string | null>(null);
  const [dropdownAnchorEl, setDropdownAnchorEl] = useState<HTMLButtonElement | null>(null);

  // Quản lý popup lọc nhiều điều kiện (OR) khi chuột phải vào ô filter
  const [multiFilterColKey, setMultiFilterColKey] = useState<string | null>(null);
  const [multiFilterAnchorEl, setMultiFilterAnchorEl] = useState<HTMLElement | null>(null);

  const handleOpenMultiFilter = (colKey: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Đóng ngay menu toán tử nếu đang mở
    setOpenDropdownColKey(null);
    setDropdownAnchorEl(null);
    window.dispatchEvent(
      new CustomEvent('agv-close-all-popups', {
        detail: { except: 'multi-filter', source: 'multi-filter' },
      })
    );
    setMultiFilterAnchorEl(e.currentTarget as HTMLElement);
    setMultiFilterColKey(colKey);
  };

  // Lắng nghe sự kiện đóng tất cả popup toàn hệ thống để bảo đảm duy nhất 1 popup hiển thị
  useEffect(() => {
    const handleCloseAll = (e: Event) => {
      const ce = e as CustomEvent;
      if (ce.detail?.except !== 'filter-op') {
        setOpenDropdownColKey(null);
        setDropdownAnchorEl(null);
      }
      if (ce.detail?.except !== 'multi-filter') {
        setMultiFilterColKey(null);
        setMultiFilterAnchorEl(null);
      }
    };
    window.addEventListener('agv-close-all-popups', handleCloseAll);
    return () => {
      window.removeEventListener('agv-close-all-popups', handleCloseAll);
    };
  }, []);

  const handleOpenDropdown = (colKey: string, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    // Đóng ngay popup multi filter nếu đang mở
    setMultiFilterColKey(null);
    setMultiFilterAnchorEl(null);
    window.dispatchEvent(
      new CustomEvent('agv-close-all-popups', {
        detail: { except: 'filter-op', source: 'filter-op' },
      })
    );
    if (openDropdownColKey === colKey) {
      setOpenDropdownColKey(null);
      setDropdownAnchorEl(null);
      return;
    }
    setDropdownAnchorEl(e.currentTarget);
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
    setDropdownAnchorEl(null);
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
      <div
        data-agv-fullwidth="true"
        data-agv-filter-row="true"
        style={{
          width: `var(--agv-total-grid-w, ${totalGridWidth}px)`,
          minWidth: `var(--agv-total-grid-w, ${totalGridWidth}px)`,
          height: '34px',
          top: `${headerTopOffset}px`,
          backgroundColor: 'var(--agv-bg-header)',
          borderColor: 'var(--agv-border)',
        }}
        className="flex items-center box-border h-[34px] min-h-[34px] max-h-[34px] border-b-2 border-b-[var(--agv-border)] select-none sticky z-20"
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

          // 0. CỘT MỞ RỘNG DETAIL VIEW: Ô trống đồng bộ hệ thống
          if (col.isDetailExpand || col.key === 'col_detail_expand') {
            return (
              <div
                key={`filter_${col.key}`}
                data-col-key={col.key}
                style={stickyFilterStyle}
                className={`flex items-center justify-center px-0.5 ${cellBorderRight} ${cellBorderLeft} border-b-2 border-b-[var(--agv-border)] shrink-0 box-border h-[34px]`}
              />
            );
          }

          // 1. CỘT STT: Nút mở Popup Tập Hợp Tiêu Chí Đang Áp Dụng (STT cell)
          if (col.isRowNumber || (col.dataType === DATA_TYPES.SYSTEM && (Boolean(col.title) || cIdx === 0))) {
            return (
              <div
                key={`filter_${col.key}`}
                data-col-key={col.key}
                style={stickyFilterStyle}
                className={`flex items-center justify-center px-0.5 ${cellBorderRight} ${cellBorderLeft} border-b-2 border-b-[var(--agv-border)] shrink-0 box-border h-[34px]`}
              >
                {totalActiveCriteriaCount > 0 ? (
                  <AdvButton
                    variant="destructive"
                    size="sm"
                    data-summary-trigger="true"
                    data-agv-popover-trigger="true"
                    onClick={handleToggleSummaryPopup}
                    className={`w-full px-1 font-bold gap-0.5 select-none ${getGridControlRadiusClass()}`}
                  >
                    <X size={11} strokeWidth={2.5} className="shrink-0" />
                    <span className="text-xs font-bold leading-none">({totalActiveCriteriaCount})</span>
                  </AdvButton>
                ) : (
                  <AdvButton
                    variant="ghost"
                    size="sm"
                    data-summary-trigger="true"
                    data-agv-popover-trigger="true"
                    onClick={handleToggleSummaryPopup}
                    className={`w-full px-1 text-[var(--agv-text-muted)] select-none ${getGridControlRadiusClass()}`}
                  >
                    Lọc
                  </AdvButton>
                )}
              </div>
            );
          }

          // 2. CỘT CHỌN: Checkbox 3 trạng thái (ALL ➔ CHECKED ➔ UNCHECKED) biến hình lò xo MorphIcons
          if (isSelectionColumn(col)) {
            const chkState = filterVal?.val || CHECK_FILTER_STATES.ALL;
            const nextState =
              chkState === CHECK_FILTER_STATES.ALL
                ? CHECK_FILTER_STATES.CHECKED
                : chkState === CHECK_FILTER_STATES.CHECKED
                ? CHECK_FILTER_STATES.UNCHECKED
                : CHECK_FILTER_STATES.ALL;

            const isAll = chkState === CHECK_FILTER_STATES.ALL;
            const isChecked = chkState === CHECK_FILTER_STATES.CHECKED;

            return (
              <div
                key={`filter_${col.key}`}
                data-col-key={col.key}
                style={stickyFilterStyle}
                className={`flex items-center justify-center px-0.5 ${cellBorderRight} ${cellBorderLeft} border-b-2 border-b-[var(--agv-border)] shrink-0 box-border h-[34px]`}
              >
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    onColumnFilterChange?.(
                      col.key,
                      createEqualsFilter(nextState === CHECK_FILTER_STATES.ALL ? '' : nextState)
                    );
                  }}
                  className="w-full h-[28px] min-h-[28px] bg-transparent flex items-center justify-center cursor-pointer select-none p-0 outline-none"
                >
                  <GridSelectionCheckbox
                    checked={isChecked}
                    indeterminate={isAll}
                    size={16}
                    spring="snappy"
                    className="pointer-events-none"
                  />
                </div>
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
                className={`flex items-center justify-center px-1 ${cellBorderRight} ${cellBorderLeft} border-b-2 border-b-[var(--agv-border)] shrink-0 box-border h-[34px]`}
              >
                <span className="text-xs text-[var(--agv-text-muted)] italic opacity-60">
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
                className={`flex items-center justify-center px-1 ${cellBorderRight} ${cellBorderLeft} border-b-2 border-b-[var(--agv-border)] shrink-0 box-border h-[34px]`}
              >
                <div
                  onFocus={() => {
                    if (!isEmptyCol) {
                      setFocusedColKey(col.key);
                      setOpenDropdownColKey(null);
                      setDropdownAnchorEl(null);
                      setMultiFilterColKey(null);
                      setMultiFilterAnchorEl(null);
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
                  className={`flex items-center w-full h-[28px] min-h-[28px] ${getGridControlRadiusClass()} overflow-hidden agv-filter-cell-box ${
                    isEmptyCol
                      ? 'bg-muted/40 border border-border opacity-60 cursor-not-allowed'
                      : `${CONTROL_BOX_CLASS} ${isFocused || isCellActive ? 'is-focused' : ''}`
                  }`}
                >
                  {/* Nút Icon Toán Tử DevExtreme (chỉ hiển thị khi cột có dữ liệu; cột rỗng để trống hoàn toàn) */}
                  {!isEmptyCol && (
                    <button
                      type="button"
                      data-op-trigger={col.key}
                      data-agv-popover-trigger="true"
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
                              className="px-1.5 py-0.5 rounded text-xs font-semibold flex items-center gap-1 truncate max-w-[calc(100%-20px)] bg-[var(--agv-accent)] text-[var(--agv-accent-text,#ffffff)]"
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
                              className="agv-inline-clear-destructive w-4 h-4 shrink-0"
                            >
                              <X size={10} strokeWidth={2.5} />
                            </button>
                          </div>
                        );
                      })()
                    ) : isNoInputOp ? (
                      <div className="w-full h-full flex items-center px-2 text-xs italic text-[var(--agv-text-muted)] opacity-70">
                        {meta.label}
                      </div>
                    ) : dataType === DATA_TYPES.DATE ? (
                    <React.Suspense fallback={null}>
                      <LazyGridDateFilterCell
                        col={col}
                        inputVal={inputVal}
                        currentOp={currentOp}
                        placeholderText={placeholderText}
                        surfaceTheme={surfaceTheme}
                        getColumnDateBounds={getColumnDateBounds}
                        onCommitValue={(colKey, val) => handleInputChange(colKey, val)}
                      />
                    </React.Suspense>
                  ) : dataType === DATA_TYPES.TIME ? (
                    <React.Suspense fallback={null}>
                      {isBetweenFilterOp(currentOp) ? (
                        <LazyTimeRangeFilterInput
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
                        <LazyTimeFilterInput
                          value={inputVal}
                          onChange={(val) => handleInputChange(col.key, val)}
                          onFocus={() => setFocusedColKey(col.key)}
                          onBlur={() => setFocusedColKey((prev) => (prev === col.key ? null : prev))}
                          onClear={() => handleClearColFilter(col.key)}
                          placeholder="HH:mm"
                          hasValue={hasActiveVal}
                        />
                      )}
                    </React.Suspense>
                  ) : dataType === DATA_TYPES.NUMBER ? (
                    <React.Suspense fallback={null}>
                      {isBetweenFilterOp(currentOp) ? (
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
                            <LazyNumberRangeFilterInput
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
                        <LazySmartNumberFilterInput
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
                      )}
                    </React.Suspense>
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
                        className="w-full h-full bg-transparent px-1.5 text-xs outline-none border-none placeholder:text-[var(--agv-text-muted)] placeholder:opacity-60 disabled:cursor-not-allowed"
                        style={{
                          color: 'var(--agv-text-main)',
                        }}
                      />

                      {/* Nút x xóa nhanh giá trị của cột text/number */}
                      {hasActiveVal && (
                        <button
                          type="button"
                          onClick={() => handleClearColFilter(col.key)}
                          className="agv-inline-clear-destructive absolute right-1 top-1/2 -translate-y-1/2 w-4 h-4"
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

      {/* Popup Menu Danh Sách Toán Tử (Đồng bộ AdvAnchoredPopover phẳng chuẩn Element Plus) */}
      <AdvAnchoredPopover
        isOpen={Boolean(openDropdownColKey && dropdownAnchorEl)}
        anchorEl={dropdownAnchorEl}
        onClose={() => {
          setOpenDropdownColKey(null);
          setDropdownAnchorEl(null);
        }}
        placement="bottom-start"
        showArrow={true}
        offset={10}
        width={192}
        minWidth={192}
        paddingClassName="agv-popup-menu"
        contentClassName="text-xs flex flex-col gap-0.5 select-none"
        zIndex={99999999}
        theme={surfaceTheme}
        ignoreClickOutsideSelectors=".agv-filter-op-btn, [data-op-trigger], [data-agv-popover-trigger='true']"
      >
        {openDropdownColKey &&
          (() => {
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
                  className={`agv-popup-item ${isSelected ? 'is-selected' : ''}`}
                >
                  <FilterOpIcon op={op} size={14} className="shrink-0" />
                  <span className="flex-1 truncate">{opMeta.label}</span>
                  {isSelected && (
                    <Check size={13} strokeWidth={2.5} className="shrink-0" />
                  )}
                </button>
              );
            });
          })()}
      </AdvAnchoredPopover>

      {/* Popup Lọc nhiều điều kiện (OR) khi chuột phải vào ô filter */}
      {multiFilterColKey && (
        (() => {
          const colDef = columns.find((c) => c.key === multiFilterColKey);
          if (!colDef) return null;
          return (
            <React.Suspense fallback={null}>
              <LazyAdvMultiFilterPopup
                isOpen={Boolean(multiFilterColKey)}
                onClose={() => {
                  setMultiFilterColKey(null);
                  setMultiFilterAnchorEl(null);
                }}
                anchorEl={multiFilterAnchorEl}
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
            </React.Suspense>
          );
        })()
      )}

      {/* Popup Tập hợp tiêu chí đang áp dụng khi click vào ô STT */}
      {isSummaryPopupOpen && (
        <React.Suspense fallback={null}>
          <LazyAdvCriteriaSummaryPopup
            isOpen={isSummaryPopupOpen}
            onClose={() => setIsSummaryPopupOpen(false)}
            anchorRect={summaryAnchorRect}
            anchorEl={summaryAnchorEl}
            surfaceTheme={surfaceTheme}
            columns={columns}
            groupByColumnKey={groupByColumnKey}
            columnFilters={columnFilters}
            quickFilterText={quickFilterText}
            sortConfig={sortConfig}
            sortRules={sortRules}
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
            onRemoveSortRule={onRemoveSortRule}
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
        </React.Suspense>
      )}
    </>
  );
});
