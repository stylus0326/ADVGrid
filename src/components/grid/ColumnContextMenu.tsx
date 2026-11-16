import React, { useState } from 'react';
import { MorphChevronIcon } from '../ui/MorphIcons';
import { AdvButton } from '../ui/AdvButton';
import { AdvAnchoredPopover } from '../ui/AdvPopover';
import {
  PinPosition,
  PIN_POSITIONS,
  SortDirection,
  SORT_DIRECTIONS,
  SurfaceTheme,
  ColumnDef,
  BaseGroupDef,
  SortConfig,
  GroupSortConfig,
  DATA_TYPES,
  FORMULA_MODES,
  FormulaMode,
  CONTEXT_MENU_TYPES,
  ContextMenuType,
  ContextMenuData,
} from './types';
import { copyTextToClipboard } from './gridClipboardUtils';

export { FORMULA_MODES, CONTEXT_MENU_TYPES };
export type { FormulaMode, ContextMenuType, ContextMenuData };

export interface ColumnContextMenuProps {
  menu: ContextMenuData;
  surfaceTheme: SurfaceTheme;
  onClose: () => void;
  // Header Callbacks
  onSetPin?: (colKey: string, pin: PinPosition) => void;
  onAutoFitColumn?: (colKey: string) => void;
  onAutoFitAllColumns?: () => void;
  onHideColumn?: (colKey: string) => void;
  onShowAllHiddenColumns?: () => void;
  // Band Callbacks
  onSetBandPin?: (groupId: string, pin: PinPosition) => void;
  onAutoFitBandColumns?: (groupId: string) => void;
  onHideBand?: (groupId: string) => void;
  // Row Callbacks
  onFilterByValue?: (colKey: string, val: any) => void;
  onScrollToTop?: () => void;
  onScrollToBottom?: () => void;
  isRowPinned?: boolean;
  pinnedRowCount?: number;
  onTogglePinRow?: () => void;
  onClearPinnedRows?: () => void;
  checkedRowCount?: number;
  onClearCheckedRows?: () => void;
  columns?: ColumnDef[];
  columnGroups?: BaseGroupDef[];
  // Grouping
  groupByColumnKey?: string | null;
  onToggleGroupByColumn?: (colKey: string) => void;
  onCollapseAllGroups?: () => void;
  onExpandAllGroups?: () => void;
  onUngroup?: () => void;
  onCopyGroupTable?: (groupRow: any, includeHeaders: boolean) => void;
  // Formula Callbacks
  formulaMode?: FormulaMode;
  onSelectFormulaMode?: (mode: FormulaMode) => void;
  // Smart Empty Column Handling
  emptyColKeys?: Set<string>;
  onHideAllEmptyColumns?: () => void;
  // Group Sorting (Sắp xếp nhóm theo Tổng)
  groupSortConfig?: GroupSortConfig | null;
  onToggleGroupSort?: (colKey: string) => void;
  // Sorting for Formula Column
  sortConfig?: SortConfig | null;
  onSortChange?: (sort: SortConfig | null) => void;
  sortRules?: SortConfig[];
  // Module feature gates
  enableColumnPinning?: boolean;
  enableCenterDock?: boolean;
}

export const ColumnContextMenu: React.FC<ColumnContextMenuProps> = ({
  menu,
  surfaceTheme,
  onClose,
  onSetPin,
  onAutoFitColumn,
  onAutoFitAllColumns,
  onHideColumn,
  onShowAllHiddenColumns,
  onSetBandPin,
  onAutoFitBandColumns,
  onHideBand,
  onFilterByValue,
  onScrollToTop,
  onScrollToBottom,
  isRowPinned = false,
  pinnedRowCount = 0,
  onTogglePinRow,
  onClearPinnedRows,
  checkedRowCount = 0,
  onClearCheckedRows,
  columns = [],
  columnGroups = [],
  groupByColumnKey,
  onToggleGroupByColumn,
  onCollapseAllGroups,
  onExpandAllGroups,
  onUngroup,
  onCopyGroupTable,
  formulaMode = FORMULA_MODES.MAX,
  onSelectFormulaMode,
  emptyColKeys,
  onHideAllEmptyColumns,
  groupSortConfig,
  onToggleGroupSort,
  sortConfig,
  onSortChange,
  enableColumnPinning = true,
  enableCenterDock = true,
}) => {
  const [isAutoFitExpanded, setIsAutoFitExpanded] = useState(false);
  const [isGroupActionsExpanded, setIsGroupActionsExpanded] = useState(false);

  const renderPinButtons = (
    currentPin: PinPosition,
    canPinSide: boolean,
    canPinCenter: boolean,
    onSelect: (pin: PinPosition) => void
  ) => {
    const pinOptions: Array<{ pin: PinPosition; label: string }> = [];
    if (canPinSide) pinOptions.push({ pin: PIN_POSITIONS.LEFT, label: 'Trái' });
    if (canPinCenter) pinOptions.push({ pin: PIN_POSITIONS.CENTER, label: 'Giữa' });
    if (canPinSide) pinOptions.push({ pin: PIN_POSITIONS.RIGHT, label: 'Phải' });
    if (pinOptions.length === 0) return null;
    const gridColsClass =
      pinOptions.length === 3 ? 'grid-cols-3' : pinOptions.length === 2 ? 'grid-cols-2' : 'grid-cols-1';
    return (
      <div className={`grid ${gridColsClass} gap-1`}>
        {pinOptions.map(({ pin, label }) => {
          const isActive = currentPin === pin;
          return (
            <button
              key={pin}
              type="button"
              onClick={() => {
                onSelect(isActive ? PIN_POSITIONS.NONE : pin);
                onClose();
              }}
              className={`flex flex-col items-center justify-center py-1 px-1 rounded-sm border text-center cursor-pointer select-none min-h-[28px] ${
                isActive
                  ? 'bg-[var(--popup-item-selected-bg)] border-[var(--popup-item-selected-bg)] text-[var(--popup-item-selected-fg)]'
                  : 'bg-[var(--agv-bg-root)] border-[var(--agv-border)] text-[var(--agv-text-main)] hover:bg-[var(--popup-item-hover-bg)]'
              }`}
            >
              <span className="text-xs font-semibold">{label}</span>
            </button>
          );
        })}
      </div>
    );
  };

  const resolvedMenu = ((): { width: number; content: React.ReactNode } | null => {
  // ============================================================================
  // 1. RENDER MENU TIÊU ĐỀ CỘT (HEADER CONTEXT MENU)
  // ============================================================================
  if (menu.type === CONTEXT_MENU_TYPES.HEADER) {
    const { column, currentPin, hasHiddenColumns } = menu;
    const isFormulaCol = Boolean(column.isFormula);
    const isChartCol = Boolean(column.isChart);
    const isEmptyCol = !!emptyColKeys?.has(column.key);
    const colDisplayName = column.title || column.key;

    const canPinSide = enableColumnPinning && Boolean(onSetPin) && column.pinnable !== false;
    const canPinCenter = enableCenterDock && Boolean(onSetPin) && column.pinnable !== false;
    const canPinCol = canPinSide || canPinCenter;
    const isPinned =
      (canPinSide && (currentPin === PIN_POSITIONS.LEFT || currentPin === PIN_POSITIONS.RIGHT)) ||
      (canPinCenter && currentPin === PIN_POSITIONS.CENTER);

    // Menu chuột phải siêu tinh gọn cho cột rỗng (chỉ giữ Ẩn cột rỗng & Ẩn tất cả cột rỗng)
    if (isEmptyCol) {
      const canHideEmpty = Boolean(onHideColumn) && column.hideable !== false;
      const canHideAllEmpty = Boolean(onHideAllEmptyColumns);
      const canShowHiddenEmpty = Boolean(hasHiddenColumns && onShowAllHiddenColumns);

      if (!canHideEmpty && !canHideAllEmpty && !canShowHiddenEmpty) {
        return null;
      }

      return {
        width: 190,
        content: (
          <div className="py-0.5 space-y-0.5">
            {canHideEmpty && (
              <button
                type="button"
                onClick={() => {
                  onHideColumn?.(column.key);
                  onClose();
                }}
                className="w-full flex items-center px-2.5 py-1.5 rounded-sm text-left text-xs cursor-pointer min-h-[28px] hover:bg-[var(--popup-item-hover-bg)]"
                style={{ color: 'var(--agv-text-main)' }}
              >
                <span>Ẩn cột rỗng</span>
              </button>
            )}
            {canHideAllEmpty && (
              <button
                type="button"
                onClick={() => {
                  onHideAllEmptyColumns?.();
                  onClose();
                }}
                className="w-full flex items-center px-2.5 py-1.5 rounded-sm text-left text-xs cursor-pointer min-h-[28px] hover:bg-[var(--popup-item-hover-bg)]"
                style={{ color: 'var(--agv-text-main)' }}
              >
                <span>Ẩn tất cả cột rỗng</span>
              </button>
            )}
            {canShowHiddenEmpty && (
              <>
                {(canHideEmpty || canHideAllEmpty) && (
                  <div className="my-1 border-b border-[var(--agv-border)]" />
                )}
                <button
                  type="button"
                  onClick={() => {
                    onShowAllHiddenColumns?.();
                    onClose();
                  }}
                  className="w-full flex items-center px-2.5 py-1.5 rounded-sm text-left text-xs cursor-pointer min-h-[28px] hover:bg-[var(--popup-item-hover-bg)] text-[var(--agv-accent)]"
                >
                  <span className="font-semibold">Hiện lại các cột đã ẩn</span>
                </button>
              </>
            )}
          </div>
        ),
      };
    }

    const canFormula = isFormulaCol && Boolean(onSelectFormulaMode);
    const canGroupCol =
      Boolean(onToggleGroupByColumn) &&
      column.groupable !== false &&
      column.dataType !== DATA_TYPES.SYSTEM &&
      !column.isRowNumber &&
      !column.isSelection &&
      !isChartCol &&
      !isFormulaCol;
    const parentBand = columnGroups?.find((g) => g.keys.includes(column.key));
    const canHideItem =
      column.hideable !== false && (parentBand?.isAtomic ? Boolean(onHideBand) : Boolean(onHideColumn));
    const canShowHidden = Boolean(hasHiddenColumns && onShowAllHiddenColumns);
    const canGroupSort =
      Boolean(groupByColumnKey) &&
      column.dataType === DATA_TYPES.NUMBER &&
      Boolean(onToggleGroupSort);
    const hasBandAutoFit = Boolean(parentBand && !parentBand.isStandalone && onAutoFitBandColumns);
    const hasAllAutoFit = Boolean((!parentBand || parentBand.isStandalone) && onAutoFitAllColumns);
    const canAutoFit =
      !isChartCol &&
      (Boolean(onAutoFitColumn) ||
        hasBandAutoFit ||
        hasAllAutoFit ||
        (isFormulaCol && Boolean(onToggleGroupByColumn)));

    const hasDirectTaskItems = canGroupCol || canHideItem || canShowHidden || canGroupSort;
    const hasTasksSection = hasDirectTaskItems || canAutoFit;

    if (!canPinCol && !canFormula && !hasTasksSection) {
      return null;
    }

    const autoFitButtons = (
      <>
        {/* Nhóm theo cột thu gọn riêng cho cột công thức (isFormula) */}
        {isFormulaCol && onToggleGroupByColumn && (
          <button
            type="button"
            disabled={isEmptyCol}
            onClick={() => {
              if (isEmptyCol) return;
              onToggleGroupByColumn(column.key);
              onClose();
            }}
            className={`w-full flex items-center px-2.5 py-1.5 rounded-sm text-left text-xs min-h-[28px] ${
              isEmptyCol
                ? 'opacity-40 cursor-not-allowed'
                : 'cursor-pointer hover:bg-[var(--popup-item-hover-bg)]'
            } ${groupByColumnKey === column.key ? 'text-[var(--agv-accent)] font-semibold' : 'text-[var(--agv-text-main)]'}`}
          >
            <span>{groupByColumnKey === column.key ? 'Hủy nhóm cột' : 'Nhóm theo cột'}</span>
          </button>
        )}

        {onAutoFitColumn && (
          <button
            type="button"
            onClick={() => {
              onAutoFitColumn(column.key);
              onClose();
            }}
            className="w-full flex items-center px-2.5 py-1.5 rounded-sm text-left text-xs cursor-pointer min-h-[28px] hover:bg-[var(--popup-item-hover-bg)]"
            style={{ color: 'var(--agv-text-main)' }}
          >
            <span>Vừa độ rộng cột</span>
          </button>
        )}

        {hasBandAutoFit && parentBand && (
          <button
            type="button"
            onClick={() => {
              onAutoFitBandColumns?.(parentBand.id);
              onClose();
            }}
            className="w-full flex items-center px-2.5 py-1.5 rounded-sm text-left text-xs cursor-pointer min-h-[28px] hover:bg-[var(--popup-item-hover-bg)]"
            style={{ color: 'var(--agv-text-main)' }}
          >
            <span>Vừa độ rộng các cột trong tầng</span>
          </button>
        )}

        {hasAllAutoFit && (
          <button
            type="button"
            onClick={() => {
              onAutoFitAllColumns?.();
              onClose();
            }}
            className="w-full flex items-center px-2.5 py-1.5 rounded-sm text-left text-xs cursor-pointer min-h-[28px] hover:bg-[var(--popup-item-hover-bg)]"
            style={{ color: 'var(--agv-text-main)' }}
          >
            <span>Vừa độ rộng tất cả cột</span>
          </button>
        )}
      </>
    );

    return {
      width: 215,
      content: (
        <>
          {/* Tiêu đề & Cụm 3 nút Ghim cột */}
        {canPinCol && (
          <div className={`p-1 ${canFormula || hasTasksSection ? 'border-b border-[var(--agv-border)]' : ''}`}>
            <div
              className="text-xs font-bold uppercase tracking-wider mb-1.5 px-0.5 truncate flex items-center justify-between gap-1.5"
              style={{ color: 'var(--agv-text-muted)' }}
            >
              <span className="truncate">
                Ghim: <span className="font-extrabold text-[var(--agv-accent)]">{colDisplayName}</span>
              </span>
              {isPinned && (
                <span className="shrink-0 text-xs font-normal text-[var(--agv-warning)] lowercase">bỏ ghim</span>
              )}
            </div>

            {renderPinButtons(currentPin, canPinSide, canPinCenter, (nextPin) => {
              onSetPin?.(column.key, nextPin);
            })}
          </div>
        )}

        {/* Tùy chọn Công Thức riêng cho cột công thức (isFormula) */}
        {canFormula && onSelectFormulaMode && (
          <div className={`py-1 ${hasTasksSection ? 'border-b border-[var(--agv-border)]' : ''}`}>
            <div
              className="text-xs font-bold uppercase tracking-wider mb-1 px-2.5 truncate"
              style={{ color: 'var(--agv-text-muted)' }}
            >
              Công thức
            </div>
            <div className="space-y-0.5">
              {(
                [
                  { id: FORMULA_MODES.AVG, label: 'Trung Bình' },
                  { id: FORMULA_MODES.SUM, label: 'Tổng' },
                  { id: FORMULA_MODES.MIN, label: 'Nhỏ Nhất' },
                  { id: FORMULA_MODES.MAX, label: 'Cao Nhất' },
                ] as const
              ).map((item) => {
                const isActive = formulaMode === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onSelectFormulaMode(item.id);
                      onClose();
                    }}
                    className={`w-full flex items-center px-2.5 py-1.5 rounded-sm text-left text-xs cursor-pointer min-h-[28px] ${
                      isActive
                        ? 'bg-[var(--popup-item-selected-bg)] text-[var(--popup-item-selected-fg)] font-semibold'
                        : 'text-[var(--agv-text-main)] hover:bg-[var(--popup-item-hover-bg)]'
                    }`}
                  >
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Nút 1 chạm đổi luân phiên sắp xếp theo tháng / theo số */}
            {(formulaMode === FORMULA_MODES.MIN || formulaMode === FORMULA_MODES.MAX) && onSortChange && column && (
              <div className="pt-1 mt-1 border-t border-[var(--agv-border)]">
                {(() => {
                  const targetColKey = column.key;
                  const isFormulaSorted = sortConfig?.key === targetColKey;
                  const isMonthSort = isFormulaSorted && Boolean(sortConfig?.sortByMonth);
                  const isMonthAsc = isMonthSort && sortConfig?.direction === SORT_DIRECTIONS.ASC;
                  const isMonthDesc = isMonthSort && sortConfig?.direction === SORT_DIRECTIONS.DESC;

                  let label = 'Sắp xếp: Theo số (Mặc định)';
                  if (isMonthAsc) label = 'Sắp xếp: Theo tháng (T1 → T12)';
                  else if (isMonthDesc) label = 'Sắp xếp: Theo tháng (T12 → T1)';

                  const handleCycleSort = () => {
                    if (!isMonthSort) {
                      onSortChange({ key: targetColKey, direction: SORT_DIRECTIONS.ASC, sortByMonth: true });
                    } else if (isMonthAsc) {
                      onSortChange({ key: targetColKey, direction: SORT_DIRECTIONS.DESC, sortByMonth: true });
                    } else {
                      onSortChange({ key: targetColKey, direction: SORT_DIRECTIONS.ASC, sortByMonth: false });
                    }
                  };

                  return (
                    <button
                      type="button"
                      onClick={handleCycleSort}
                      className={`w-full flex items-center px-2.5 py-1.5 rounded-sm text-left text-xs cursor-pointer min-h-[28px] ${
                        isMonthSort
                          ? 'bg-[var(--popup-item-selected-bg)] text-[var(--popup-item-selected-fg)] font-semibold'
                          : 'text-[var(--agv-text-main)] hover:bg-[var(--popup-item-hover-bg)]'
                      }`}
                    >
                      <span>{label}</span>
                    </button>
                  );
                })()}
              </div>
            )}
          </div>
        )}

        {/* Các tác vụ cột */}
        {hasTasksSection && (
          <div className="py-1 space-y-0.5">
            {canGroupCol && (
              <button
                type="button"
                disabled={isEmptyCol}
                onClick={() => {
                  if (isEmptyCol) return;
                  onToggleGroupByColumn?.(column.key);
                  onClose();
                }}
                className={`w-full flex items-center px-2.5 py-1.5 rounded-sm text-left text-xs min-h-[28px] ${
                  isEmptyCol
                    ? 'opacity-40 cursor-not-allowed'
                    : 'cursor-pointer hover:bg-[var(--popup-item-hover-bg)]'
                } ${groupByColumnKey === column.key ? 'text-[var(--agv-accent)] font-semibold' : 'text-[var(--agv-text-main)]'}`}
              >
                <span>{groupByColumnKey === column.key ? 'Hủy nhóm cột' : 'Nhóm theo cột'}</span>
              </button>
            )}

            {canHideItem && parentBand?.isAtomic && (
              <button
                type="button"
                onClick={() => {
                  onHideBand?.(parentBand.id);
                  onClose();
                }}
                className="w-full flex items-center px-2.5 py-1.5 rounded-sm text-left text-xs cursor-pointer min-h-[28px] hover:bg-[var(--popup-item-hover-bg)] text-[var(--agv-text-main)]"
              >
                <span>Ẩn nhóm {parentBand.title || parentBand.id || ''}</span>
              </button>
            )}

            {canHideItem && !parentBand?.isAtomic && (
              <button
                type="button"
                onClick={() => {
                  onHideColumn?.(column.key);
                  onClose();
                }}
                className="w-full flex items-center px-2.5 py-1.5 rounded-sm text-left text-xs cursor-pointer min-h-[28px] hover:bg-[var(--popup-item-hover-bg)] text-[var(--agv-text-main)]"
              >
                <span>Ẩn cột này</span>
              </button>
            )}

            {canShowHidden && (
              <button
                type="button"
                onClick={() => {
                  onShowAllHiddenColumns?.();
                  onClose();
                }}
                className="w-full flex items-center px-2.5 py-1.5 rounded-sm text-left text-xs cursor-pointer min-h-[28px] hover:bg-[var(--popup-item-hover-bg)] text-[var(--agv-accent)]"
              >
                <span className="font-semibold">Hiện lại các cột đã ẩn</span>
              </button>
            )}

            {/* Sắp xếp nhóm theo Tổng (Phương án B chuẩn Toolbar3: chỉ hiện khi có gom nhóm và cột là số) */}
            {canGroupSort && onToggleGroupSort && (
              <div className={canGroupCol || canHideItem || canShowHidden ? 'pt-1 mt-1 border-t border-[var(--agv-border)]' : ''}>
                {(() => {
                  const isCurrentColSorted = groupSortConfig?.colKey === column.key;
                  const currentDir = isCurrentColSorted ? groupSortConfig.direction : null;
                  const label =
                    currentDir === SORT_DIRECTIONS.DESC
                      ? 'Sắp xếp nhóm: Tổng giảm dần'
                      : currentDir === SORT_DIRECTIONS.ASC
                      ? 'Sắp xếp nhóm: Tổng tăng dần'
                      : 'Sắp xếp nhóm theo Tổng';

                  return (
                    <button
                      type="button"
                      onClick={() => {
                        onToggleGroupSort(column.key);
                        onClose();
                      }}
                      className={`w-full flex items-center justify-center px-2.5 py-1.5 rounded-md text-center text-xs font-semibold cursor-pointer select-none min-h-[28px] ${
                        isCurrentColSorted
                          ? 'bg-[var(--popup-item-selected-bg)] text-[var(--popup-item-selected-fg)]'
                          : 'text-[var(--agv-text-main)] bg-[var(--agv-bg-popup)] border border-[var(--agv-border)] hover:bg-[var(--popup-item-hover-bg)]'
                      }`}
                    >
                      <span>{label}</span>
                    </button>
                  );
                })()}
              </div>
            )}

            {/* Thanh mỏng mở rộng tùy chọn Vừa độ rộng (hoặc hiện thẳng nếu chỉ còn tác vụ Vừa độ rộng) */}
            {canAutoFit && (
              canPinCol || canFormula || hasDirectTaskItems ? (
                <div className="pt-0.5 mt-0.5 border-t border-[var(--agv-border)]">
                  <AdvButton
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsAutoFitExpanded((prev) => !prev)}
                    className="w-full"
                  >
                    <MorphChevronIcon
                      expanded={isAutoFitExpanded}
                      type="down-up"
                      size={12}
                      spring="snappy"
                    />
                  </AdvButton>

                  {isAutoFitExpanded && (
                    <div className="pt-0.5 space-y-0.5 animate-in fade-in duration-150">
                      {autoFitButtons}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-0.5">{autoFitButtons}</div>
              )
            )}
          </div>
        )}
        </>
      ),
    };
  }

  // ============================================================================
  // 2. RENDER MENU NHÓM TẦNG 1 (BAND CONTEXT MENU)
  // ============================================================================
  if (menu.type === CONTEXT_MENU_TYPES.BAND) {
    const { groupDef, currentPin } = menu;
    const canPinSide = enableColumnPinning && Boolean(onSetBandPin);
    const canPinCenter = enableCenterDock && Boolean(onSetBandPin);
    const canPinBand = canPinSide || canPinCenter;
    const isPinned =
      (canPinSide && (currentPin === PIN_POSITIONS.LEFT || currentPin === PIN_POSITIONS.RIGHT)) ||
      (canPinCenter && currentPin === PIN_POSITIONS.CENTER);
    const canHide = Boolean(onHideBand) && menu.childColumns.every((c) => c.hideable !== false);
    const canAutoFit = groupDef.id !== 'grp_analytics' && Boolean(onAutoFitBandColumns);

    if (!canPinBand && !canHide && !canAutoFit) {
      return null;
    }

    return {
      width: 215,
      content: (
        <>
          {/* Tiêu đề & Cụm nút Ghim nhóm tầng */}
        {canPinBand && (
          <div className={`p-1 ${canHide || canAutoFit ? 'border-b border-[var(--agv-border)]' : ''}`}>
            <div
              className="text-xs font-bold uppercase tracking-wider mb-1.5 px-0.5 truncate flex items-center justify-between gap-1.5"
              style={{ color: 'var(--agv-text-muted)' }}
            >
              <span className="truncate">
                Ghim tầng: <span className="font-extrabold text-[var(--agv-accent)]">{groupDef.title}</span>
              </span>
              {isPinned && (
                <span className="shrink-0 text-xs font-normal text-[var(--agv-warning)] lowercase">bỏ ghim</span>
              )}
            </div>

            {renderPinButtons(currentPin, canPinSide, canPinCenter, (nextPin) => {
              onSetBandPin?.(groupDef.id, nextPin);
            })}
          </div>
        )}

        {/* Các tác vụ trên nhóm tầng */}
        {(canHide || canAutoFit) && (
          <div className="py-1 space-y-0.5">
            {canHide && (
              <button
                type="button"
                onClick={() => {
                  onHideBand?.(groupDef.id);
                  onClose();
                }}
                className="w-full flex items-center px-2.5 py-1.5 rounded-sm text-left text-xs cursor-pointer min-h-[28px] hover:bg-[var(--popup-item-hover-bg)]"
                style={{ color: 'var(--agv-text-main)' }}
              >
                <span>Ẩn toàn bộ nhóm tầng</span>
              </button>
            )}

            {/* Thanh mỏng mở rộng tùy chọn Vừa độ rộng */}
            {canAutoFit && (
              canPinBand || canHide ? (
                <div className="pt-0.5 mt-0.5 border-t border-[var(--agv-border)]">
                  <AdvButton
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsAutoFitExpanded((prev) => !prev)}
                    className="w-full"
                  >
                    <MorphChevronIcon
                      expanded={isAutoFitExpanded}
                      type="down-up"
                      size={12}
                      spring="snappy"
                    />
                  </AdvButton>

                  {isAutoFitExpanded && (
                    <div className="pt-0.5 space-y-0.5 animate-in fade-in duration-150">
                      <button
                        type="button"
                        onClick={() => {
                          onAutoFitBandColumns?.(groupDef.id);
                          onClose();
                        }}
                        className="w-full flex items-center px-2.5 py-1.5 rounded-sm text-left text-xs cursor-pointer min-h-[28px] hover:bg-[var(--popup-item-hover-bg)]"
                        style={{ color: 'var(--agv-text-main)' }}
                      >
                        <span>Vừa độ rộng các cột trong tầng</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    onAutoFitBandColumns?.(groupDef.id);
                    onClose();
                  }}
                  className="w-full flex items-center px-2.5 py-1.5 rounded-sm text-left text-xs cursor-pointer min-h-[28px] hover:bg-[var(--popup-item-hover-bg)]"
                  style={{ color: 'var(--agv-text-main)' }}
                >
                  <span>Vừa độ rộng các cột trong tầng</span>
                </button>
              )
            )}
          </div>
        )}
        </>
      ),
    };
  }

  // ============================================================================
  // 3. RENDER MENU TIÊU ĐỀ NHÓM (GROUP HEADER CONTEXT MENU)
  // ============================================================================
  if (menu.type === CONTEXT_MENU_TYPES.GROUP) {
    const { groupRow } = menu;
    const canUngroup = Boolean(onUngroup);
    const canCollapseAll = Boolean(onCollapseAllGroups);
    const canExpandAll = Boolean(onExpandAllGroups);
    const canCopyGroup = Boolean(onCopyGroupTable);
    const hasExpandSection = canCollapseAll || canExpandAll;
    const hasSecondarySection = canCopyGroup;

    if (!canUngroup && !hasExpandSection && !hasSecondarySection) {
      return null;
    }

    return {
      width: 215,
      content: (
        <>
          {/* 1. Hủy nhóm cột */}
        {canUngroup && (
          <button
            type="button"
            onClick={() => {
              onUngroup?.();
              onClose();
            }}
            className="w-full flex items-center px-2.5 py-1.5 rounded-sm text-left text-xs cursor-pointer min-h-[28px] hover:bg-[var(--popup-item-hover-bg)] text-[var(--agv-accent)] font-semibold"
          >
            <span>Hủy nhóm cột</span>
          </button>
        )}

        {canUngroup && hasExpandSection && (
          <div className="my-1 border-b border-[var(--agv-border)]" />
        )}

        {/* 2. Thu gọn tất cả */}
        {canCollapseAll && (
          <button
            type="button"
            onClick={() => {
              onCollapseAllGroups?.();
              onClose();
            }}
            className="w-full flex items-center px-2.5 py-1.5 rounded-sm text-left text-xs cursor-pointer min-h-[28px] hover:bg-[var(--popup-item-hover-bg)]"
            style={{ color: 'var(--agv-text-main)' }}
          >
            <span>Thu gọn tất cả</span>
          </button>
        )}

        {/* 3. Mở rộng tất cả */}
        {canExpandAll && (
          <button
            type="button"
            onClick={() => {
              onExpandAllGroups?.();
              onClose();
            }}
            className="w-full flex items-center px-2.5 py-1.5 rounded-sm text-left text-xs cursor-pointer min-h-[28px] hover:bg-[var(--popup-item-hover-bg)]"
            style={{ color: 'var(--agv-text-main)' }}
          >
            <span>Mở rộng tất cả</span>
          </button>
        )}

        {/* Thanh mỏng mở rộng tác vụ Sao chép bảng */}
        {hasSecondarySection && (
          <div className={canUngroup || hasExpandSection ? 'pt-0.5 mt-0.5 border-t border-[var(--agv-border)]' : ''}>
            {canUngroup || hasExpandSection ? (
              <>
                <AdvButton
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsGroupActionsExpanded((prev) => !prev)}
                  className="w-full"
                >
                  <MorphChevronIcon
                    expanded={isGroupActionsExpanded}
                    type="down-up"
                    size={12}
                    spring="snappy"
                  />
                </AdvButton>

                {isGroupActionsExpanded && (
                  <div className="pt-0.5 space-y-0.5 animate-in fade-in duration-150">
                    {canCopyGroup && (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            onCopyGroupTable?.(groupRow, false);
                            onClose();
                          }}
                          className="w-full flex items-center px-2.5 py-1.5 rounded-sm text-left text-xs cursor-pointer min-h-[28px] hover:bg-[var(--popup-item-hover-bg)]"
                          style={{ color: 'var(--agv-text-main)' }}
                        >
                          <span>Sao chép bảng</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onCopyGroupTable?.(groupRow, true);
                            onClose();
                          }}
                          className="w-full flex items-center px-2.5 py-1.5 rounded-sm text-left text-xs cursor-pointer min-h-[28px] hover:bg-[var(--popup-item-hover-bg)]"
                          style={{ color: 'var(--agv-text-main)' }}
                        >
                          <span>Sao chép bảng kèm tên cột</span>
                        </button>
                      </>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-0.5">
                {canCopyGroup && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        onCopyGroupTable?.(groupRow, false);
                        onClose();
                      }}
                      className="w-full flex items-center px-2.5 py-1.5 rounded-sm text-left text-xs cursor-pointer min-h-[28px] hover:bg-[var(--popup-item-hover-bg)]"
                      style={{ color: 'var(--agv-text-main)' }}
                    >
                      <span>Sao chép bảng</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onCopyGroupTable?.(groupRow, true);
                        onClose();
                      }}
                      className="w-full flex items-center px-2.5 py-1.5 rounded-sm text-left text-xs cursor-pointer min-h-[28px] hover:bg-[var(--popup-item-hover-bg)]"
                      style={{ color: 'var(--agv-text-main)' }}
                    >
                      <span>Sao chép bảng kèm tên cột</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        )}
        </>
      ),
    };
  }

  // ============================================================================
  // 4. RENDER MENU DÒNG & Ô DỮ LIỆU (ROW / CELL CONTEXT MENU)
  // ============================================================================
  const { row, column, cellValue } = menu;
  const isFormulaCol = Boolean(column?.isFormula);
  const isCellEmptyCol = column ? !!emptyColKeys?.has(column.key) : false;

  const handleCopyCell = () => {
    let text = '';
    if (cellValue !== undefined && cellValue !== null) {
      text = String(cellValue);
    } else if (column && row) {
      if (row.cells instanceof Map) {
        text = String(row.cells.get(column.key)?.value ?? '');
      } else if (row[column.key] !== undefined) {
        text = String(row[column.key]);
      }
    }
    copyTextToClipboard(text);
    onClose();
  };

  return {
    width: 215,
    content: (
      <div className="py-0.5 space-y-0.5">
        {/* Nếu click trên ô công thức (isFormula), cho phép đổi công thức trực tiếp */}
        {isFormulaCol && onSelectFormulaMode && (
          <div className="pb-1 mb-1 border-b border-[var(--agv-border)]">
            <div
              className="text-xs font-bold uppercase tracking-wider mb-1 px-2.5 truncate"
              style={{ color: 'var(--agv-text-muted)' }}
            >
              Công thức
            </div>
            <div className="space-y-0.5">
              {(
                [
                  { id: FORMULA_MODES.AVG, label: 'Trung Bình' },
                  { id: FORMULA_MODES.SUM, label: 'Tổng' },
                  { id: FORMULA_MODES.MIN, label: 'Nhỏ Nhất' },
                  { id: FORMULA_MODES.MAX, label: 'Cao Nhất' },
                ] as const
              ).map((item) => {
                const isActive = formulaMode === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onSelectFormulaMode(item.id);
                      onClose();
                    }}
                    className={`w-full flex items-center px-2.5 py-1.5 rounded-sm text-left text-xs cursor-pointer min-h-[28px] ${
                      isActive
                        ? 'bg-[var(--popup-item-selected-bg)] text-[var(--popup-item-selected-fg)] font-semibold'
                        : 'text-[var(--agv-text-main)] hover:bg-[var(--popup-item-hover-bg)]'
                    }`}
                  >
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Nút 1 chạm đổi luân phiên sắp xếp theo tháng / theo số */}
            {(formulaMode === FORMULA_MODES.MIN || formulaMode === FORMULA_MODES.MAX) && onSortChange && column && (
              <div className="pt-1 mt-1 border-t border-[var(--agv-border)]">
                {(() => {
                  const targetColKey = column.key;
                  const isFormulaSorted = sortConfig?.key === targetColKey;
                  const isMonthSort = isFormulaSorted && Boolean(sortConfig?.sortByMonth);
                  const isMonthAsc = isMonthSort && sortConfig?.direction === SORT_DIRECTIONS.ASC;
                  const isMonthDesc = isMonthSort && sortConfig?.direction === SORT_DIRECTIONS.DESC;

                  let label = 'Sắp xếp: Theo số (Mặc định)';
                  if (isMonthAsc) label = 'Sắp xếp: Theo tháng (T1 → T12)';
                  else if (isMonthDesc) label = 'Sắp xếp: Theo tháng (T12 → T1)';

                  const handleCycleSort = () => {
                    if (!isMonthSort) {
                      onSortChange({ key: targetColKey, direction: SORT_DIRECTIONS.ASC, sortByMonth: true });
                    } else if (isMonthAsc) {
                      onSortChange({ key: targetColKey, direction: SORT_DIRECTIONS.DESC, sortByMonth: true });
                    } else {
                      onSortChange({ key: targetColKey, direction: SORT_DIRECTIONS.ASC, sortByMonth: false });
                    }
                  };

                  return (
                    <button
                      type="button"
                      onClick={handleCycleSort}
                      className={`w-full flex items-center px-2.5 py-1.5 rounded-sm text-left text-xs cursor-pointer min-h-[28px] ${
                        isMonthSort
                          ? 'bg-[var(--popup-item-selected-bg)] text-[var(--popup-item-selected-fg)] font-semibold'
                          : 'text-[var(--agv-text-main)] hover:bg-[var(--popup-item-hover-bg)]'
                      }`}
                    >
                      <span>{label}</span>
                    </button>
                  );
                })()}
              </div>
            )}
          </div>
        )}

        {/* Sao chép giá trị ô */}
        <button
          type="button"
          onClick={handleCopyCell}
          className="w-full flex items-center px-2.5 py-1.5 rounded-sm text-left text-xs cursor-pointer min-h-[28px] hover:bg-[var(--popup-item-hover-bg)]"
          style={{ color: 'var(--agv-text-main)' }}
        >
          <span>Sao chép giá trị ô</span>
        </button>

        {/* Lọc theo giá trị ô */}
        {column && onFilterByValue && (
          <button
            type="button"
            disabled={isCellEmptyCol || column.filterable === false}
            onClick={() => {
              if (isCellEmptyCol || column.filterable === false) return;
              const val =
                cellValue !== undefined
                  ? cellValue
                  : row?.cells instanceof Map
                  ? row.cells.get(column.key)?.value
                  : row?.[column.key];
              onFilterByValue(column.key, val);
              onClose();
            }}
            className={`w-full flex items-center px-2.5 py-1.5 rounded-sm text-left text-xs min-h-[28px] ${
              isCellEmptyCol || column.filterable === false
                ? 'opacity-40 cursor-not-allowed'
                : 'cursor-pointer hover:bg-[var(--popup-item-hover-bg)]'
            }`}
            style={{ color: 'var(--agv-text-main)' }}
          >
            <span>Lọc theo</span>
          </button>
        )}

        {/* Ghim dòng lên đầu / Bỏ ghim dòng & Bỏ chọn tất cả dòng */}
        {((onTogglePinRow && !row?._isGroupRow) || (checkedRowCount > 0 && onClearCheckedRows)) && (
          <>
            <div className="my-1 border-b border-[var(--agv-border)]" />
            {onTogglePinRow && !row?._isGroupRow && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    onTogglePinRow();
                    onClose();
                  }}
                  className={`w-full flex items-center px-2.5 py-1.5 rounded-sm text-left text-xs cursor-pointer min-h-[28px] hover:bg-[var(--popup-item-hover-bg)] ${
                    isRowPinned ? 'text-[var(--agv-accent)] font-semibold' : ''
                  }`}
                  style={isRowPinned ? undefined : { color: 'var(--agv-text-main)' }}
                >
                  <span>{isRowPinned ? 'Bỏ ghim dòng' : 'Ghim dòng lên đầu'}</span>
                </button>
                {pinnedRowCount > 0 && onClearPinnedRows && (
                  <button
                    type="button"
                    onClick={() => {
                      onClearPinnedRows();
                      onClose();
                    }}
                    className="w-full flex items-center px-2.5 py-1.5 rounded-sm text-left text-xs cursor-pointer min-h-[28px] hover:bg-[var(--popup-item-hover-bg)]"
                    style={{ color: 'var(--agv-text-main)' }}
                  >
                    <span>Bỏ ghim tất cả dòng ({pinnedRowCount})</span>
                  </button>
                )}
              </>
            )}
            {checkedRowCount > 0 && onClearCheckedRows && (
              <button
                type="button"
                onClick={() => {
                  onClearCheckedRows();
                  onClose();
                }}
                className="w-full flex items-center px-2.5 py-1.5 rounded-sm text-left text-xs cursor-pointer min-h-[28px] hover:bg-[var(--popup-item-hover-bg)]"
                style={{ color: 'var(--agv-text-main)' }}
              >
                <span>Bỏ chọn tất cả dòng ({checkedRowCount.toLocaleString('vi-VN')})</span>
              </button>
            )}
          </>
        )}

        {(onScrollToTop || onScrollToBottom) && (
          <>
            <div className="my-1 border-b border-[var(--agv-border)]" />

            {/* Cuộn lên đầu */}
            {onScrollToTop && (
              <button
                type="button"
                onClick={() => {
                  onScrollToTop();
                  onClose();
                }}
                className="w-full flex items-center px-2.5 py-1.5 rounded-sm text-left text-xs cursor-pointer min-h-[28px] hover:bg-[var(--popup-item-hover-bg)]"
                style={{ color: 'var(--agv-text-main)' }}
              >
                <span>Cuộn lên đầu</span>
              </button>
            )}

            {/* Cuộn cuối trang */}
            {onScrollToBottom && (
              <button
                type="button"
                onClick={() => {
                  onScrollToBottom();
                  onClose();
                }}
                className="w-full flex items-center px-2.5 py-1.5 rounded-sm text-left text-xs cursor-pointer min-h-[28px] hover:bg-[var(--popup-item-hover-bg)]"
                style={{ color: 'var(--agv-text-main)' }}
              >
                <span>Cuộn cuối trang</span>
              </button>
            )}
          </>
        )}
      </div>
    ),
  };
  })();

  if (!resolvedMenu) return null;

  return (
    <AdvAnchoredPopover
      isOpen={true}
      virtualAnchor={{ left: menu.x, top: menu.y }}
      onClose={onClose}
      placement="bottom-start"
      showArrow={true}
      offset={10}
      width={resolvedMenu.width}
      minWidth={resolvedMenu.width}
      paddingClassName="p-0"
      contentClassName="text-xs agv-context-menu"
      zIndex={9999}
      theme={surfaceTheme}
      ignoreClickOutsideSelectors=""
    >
      <div
        onContextMenu={(e) => e.preventDefault()}
        className="p-1 rounded-md overflow-hidden select-none"
      >
        {resolvedMenu.content}
      </div>
    </AdvAnchoredPopover>
  );
};

export default ColumnContextMenu;
