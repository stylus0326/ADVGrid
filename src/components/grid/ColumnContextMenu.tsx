import React, { useState, useEffect, useRef } from 'react';
import { MorphChevronIcon } from '../ui/MorphIcons';
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
} from './types';
import { getThemeClasses } from './constants';
import { computeContextMenuCoords, copyTextToClipboard } from './gridUtils';

export { FORMULA_MODES };
export type { FormulaMode };

/**
 * Danh mục phân loại menu ngữ cảnh chuột phải
 */
export const CONTEXT_MENU_TYPES = {
  HEADER: 'header',
  ROW: 'row',
  BAND: 'band',
  GROUP: 'group',
} as const;
export type ContextMenuType = (typeof CONTEXT_MENU_TYPES)[keyof typeof CONTEXT_MENU_TYPES];

export type ContextMenuData =
  | {
      type: typeof CONTEXT_MENU_TYPES.HEADER;
      x: number;
      y: number;
      column: ColumnDef;
      currentPin: PinPosition;
      hasHiddenColumns?: boolean;
    }
  | {
      type: typeof CONTEXT_MENU_TYPES.BAND;
      x: number;
      y: number;
      groupDef: BaseGroupDef;
      childColumns: ColumnDef[];
      currentPin: PinPosition;
    }
  | {
      type: typeof CONTEXT_MENU_TYPES.ROW;
      x: number;
      y: number;
      rowIndex: number;
      row: any;
      column?: ColumnDef;
      cellValue?: any;
    }
  | {
      type: typeof CONTEXT_MENU_TYPES.GROUP;
      x: number;
      y: number;
      groupRow: any;
    };

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
  columns?: ColumnDef[];
  columnGroups?: BaseGroupDef[];
  // Grouping
  groupByColumnKey?: string | null;
  onToggleGroupByColumn?: (colKey: string) => void;
  onCollapseAllGroups?: () => void;
  onExpandAllGroups?: () => void;
  onUngroup?: () => void;
  onCopyGroupTable?: (groupRow: any, includeHeaders: boolean) => void;
  onExportGroupExcel?: (groupRow: any) => void;
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
  columns = [],
  columnGroups = [],
  groupByColumnKey,
  onToggleGroupByColumn,
  onCollapseAllGroups,
  onExpandAllGroups,
  onUngroup,
  onCopyGroupTable,
  onExportGroupExcel,
  formulaMode = 'AVG',
  onSelectFormulaMode,
  emptyColKeys,
  onHideAllEmptyColumns,
  groupSortConfig,
  onToggleGroupSort,
  sortConfig,
  onSortChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAutoFitExpanded, setIsAutoFitExpanded] = useState(false);
  const [isGroupActionsExpanded, setIsGroupActionsExpanded] = useState(false);
  const themeClasses = getThemeClasses(surfaceTheme);

  // Cơ chế đóng khi nhấp chuột ra ngoài (Click Outside) hoặc bấm ESC
  useEffect(() => {
    const handleGlobalMouseDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleGlobalMouseDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleGlobalMouseDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  // Tính toán tọa độ hiển thị an toàn chống tràn mép màn hình
  const isHeaderEmpty = menu.type === CONTEXT_MENU_TYPES.HEADER && emptyColKeys?.has(menu.column.key);
  const isNumericGroupSort =
    menu.type === CONTEXT_MENU_TYPES.HEADER &&
    Boolean(groupByColumnKey) &&
    menu.column.dataType === DATA_TYPES.NUMBER &&
    !isHeaderEmpty;
  const activeCol =
    menu.type === CONTEXT_MENU_TYPES.HEADER
      ? menu.column
      : menu.type === CONTEXT_MENU_TYPES.ROW
      ? menu.column
      : undefined;
  const isColFormula = Boolean(activeCol?.isFormula);
  const isColChart = Boolean(activeCol?.isChart);
  const isMinMaxFormula = isColFormula && (formulaMode === FORMULA_MODES.MIN || formulaMode === FORMULA_MODES.MAX);
  const menuWidth = isHeaderEmpty ? 190 : 220;
  const menuHeight =
    menu.type === CONTEXT_MENU_TYPES.HEADER
      ? isColFormula
        ? isMinMaxFormula ? 335 : 285
        : isColChart
        ? 120
        : isHeaderEmpty
        ? menu.hasHiddenColumns
          ? 110
          : 75
        : isNumericGroupSort
        ? 265
        : 220
      : menu.type === CONTEXT_MENU_TYPES.BAND
      ? 180
      : menu.type === CONTEXT_MENU_TYPES.GROUP
      ? 230
      : isColFormula
      ? isMinMaxFormula ? 410 : 360
      : 250;
  const coords = computeContextMenuCoords(menu.x, menu.y, menuWidth, menuHeight);

  // ============================================================================
  // 1. RENDER MENU TIÊU ĐỀ CỘT (HEADER CONTEXT MENU)
  // ============================================================================
  if (menu.type === CONTEXT_MENU_TYPES.HEADER) {
    const { column, currentPin, hasHiddenColumns } = menu;
    const isPinned = currentPin !== 'none';
    const isFormulaCol = Boolean(column.isFormula);
    const isChartCol = Boolean(column.isChart);
    const isEmptyCol = !!emptyColKeys?.has(column.key);
    const colDisplayName = column.title || column.key;

    // Menu chuột phải siêu tinh gọn cho cột rỗng (chỉ giữ Ẩn cột rỗng & Ẩn tất cả cột rỗng)
    if (isEmptyCol) {
      return (
        <div
          ref={containerRef}
          style={{
            position: 'fixed',
            left: `${coords.left}px`,
            top: `${coords.top}px`,
            zIndex: 9999,
            boxShadow: '0 12px 28px -4px rgba(0, 0, 0, 0.25), 0 8px 12px -6px rgba(0, 0, 0, 0.15)',
          }}
          onClick={(e) => e.stopPropagation()}
          onContextMenu={(e) => e.preventDefault()}
          className={`agv-context-menu w-[190px] p-1.5 rounded-md border backdrop-blur-md select-none transition-all agv-spring-zoom ${themeClasses.contextMenuBg}`}
          data-agv-popup="true"
        >
          <div className="py-0.5 space-y-0.5">
            <button
              type="button"
              onClick={() => {
                onHideColumn?.(column.key);
                onClose();
              }}
              className="w-full flex items-center px-2.5 py-1.5 rounded-md text-left text-xs transition cursor-pointer min-h-[28px] hover:bg-[var(--agv-bg-hover)]"
              style={{ color: 'var(--agv-text-main)' }}
            >
              <span>Ẩn cột rỗng</span>
            </button>
            {onHideAllEmptyColumns && (
              <button
                type="button"
                onClick={() => {
                  onHideAllEmptyColumns();
                  onClose();
                }}
                className="w-full flex items-center px-2.5 py-1.5 rounded-md text-left text-xs transition cursor-pointer min-h-[28px] hover:bg-[var(--agv-bg-hover)]"
                style={{ color: 'var(--agv-text-main)' }}
              >
                <span>Ẩn tất cả cột rỗng</span>
              </button>
            )}
            {hasHiddenColumns && (
              <>
                <div className="my-1 border-b border-[var(--agv-border)]" />
                <button
                  type="button"
                  onClick={() => {
                    onShowAllHiddenColumns?.();
                    onClose();
                  }}
                  className="w-full flex items-center px-2.5 py-1.5 rounded-md text-left text-xs transition cursor-pointer min-h-[28px] hover:bg-agv-bg-hover text-agv-accent"
                >
                  <span className="font-semibold">Hiện lại các cột đã ẩn</span>
                </button>
              </>
            )}
          </div>
        </div>
      );
    }

    return (
      <div
        ref={containerRef}
        style={{
          position: 'fixed',
          left: `${coords.left}px`,
          top: `${coords.top}px`,
          zIndex: 9999,
          boxShadow: '0 12px 28px -4px rgba(0, 0, 0, 0.25), 0 8px 12px -6px rgba(0, 0, 0, 0.15)',
        }}
        onClick={(e) => e.stopPropagation()}
        onContextMenu={(e) => e.preventDefault()}
        className={`agv-context-menu w-[215px] p-1.5 rounded-md border backdrop-blur-md select-none transition-all agv-spring-zoom ${themeClasses.contextMenuBg}`}
        data-agv-popup="true"
      >
        {/* Tiêu đề & Cụm 3 nút Ghim cột */}
        <div className="p-1 border-b border-[var(--agv-border)]">
          <div
            className="text-[10px] font-bold uppercase tracking-wider mb-1.5 px-0.5 truncate flex items-center justify-between"
            style={{ color: 'var(--agv-text-muted)' }}
          >
            <span className="truncate">
              Ghim: <span className="font-extrabold text-agv-accent">{colDisplayName}</span>
            </span>
            {isPinned && (
              <span className="text-[9px] font-normal text-amber-500 lowercase">bỏ ghim</span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-1">
            {/* Nút Trái */}
            <button
              type="button"
              onClick={() => {
                onSetPin?.(
                  column.key,
                  currentPin === PIN_POSITIONS.LEFT ? PIN_POSITIONS.NONE : PIN_POSITIONS.LEFT
                );
                onClose();
              }}
              className={`flex flex-col items-center justify-center py-1 px-1 rounded-lg border text-center transition cursor-pointer select-none min-h-[28px] ${
                currentPin === PIN_POSITIONS.LEFT
                  ? 'bg-agv-accent border-agv-accent text-agv-accent-text'
                  : 'bg-agv-bg-root border-agv-border text-agv-text-main hover:bg-agv-bg-hover'
              }`}
            >
              <span className="text-[10px] font-semibold">Trái</span>
            </button>

            {/* Nút Giữa */}
            <button
              type="button"
              onClick={() => {
                onSetPin?.(
                  column.key,
                  currentPin === PIN_POSITIONS.CENTER ? PIN_POSITIONS.NONE : PIN_POSITIONS.CENTER
                );
                onClose();
              }}
              className={`flex flex-col items-center justify-center py-1 px-1 rounded-lg border text-center transition cursor-pointer select-none min-h-[28px] ${
                currentPin === PIN_POSITIONS.CENTER
                  ? 'bg-agv-accent border-agv-accent text-agv-accent-text'
                  : 'bg-agv-bg-root border-agv-border text-agv-text-main hover:bg-agv-bg-hover'
              }`}
            >
              <span className="text-[10px] font-semibold">Giữa</span>
            </button>

            {/* Nút Phải */}
            <button
              type="button"
              onClick={() => {
                onSetPin?.(
                  column.key,
                  currentPin === PIN_POSITIONS.RIGHT ? PIN_POSITIONS.NONE : PIN_POSITIONS.RIGHT
                );
                onClose();
              }}
              className={`flex flex-col items-center justify-center py-1 px-1 rounded-lg border text-center transition cursor-pointer select-none min-h-[28px] ${
                currentPin === PIN_POSITIONS.RIGHT
                  ? 'bg-agv-accent border-agv-accent text-agv-accent-text'
                  : 'bg-agv-bg-root border-agv-border text-agv-text-main hover:bg-agv-bg-hover'
              }`}
            >
              <span className="text-[10px] font-semibold">Phải</span>
            </button>
          </div>
        </div>

        {/* Tùy chọn Công Thức riêng cho cột công thức (isFormula) */}
        {isFormulaCol && onSelectFormulaMode && (
          <div className="py-1 border-b border-[var(--agv-border)]">
            <div
              className="text-[10px] font-bold uppercase tracking-wider mb-1 px-2.5 truncate"
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
                    className={`w-full flex items-center px-2.5 py-1.5 rounded-md text-left text-xs transition cursor-pointer min-h-[28px] ${
                      isActive
                        ? 'bg-agv-accent text-agv-accent-text font-semibold'
                        : 'text-agv-text-main hover:bg-agv-bg-hover'
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
                      className={`w-full flex items-center px-2.5 py-1.5 rounded-md text-left text-xs transition cursor-pointer min-h-[28px] ${
                        isMonthSort
                          ? 'bg-agv-accent text-agv-accent-text font-semibold'
                          : 'text-agv-text-main hover:bg-agv-bg-hover'
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
        <div className="py-1 space-y-0.5">
          {onToggleGroupByColumn && column.dataType !== DATA_TYPES.SYSTEM && !column.isRowNumber && !column.isSelection && !isChartCol && !isFormulaCol && (
            <button
              type="button"
              disabled={isEmptyCol}
              onClick={() => {
                if (isEmptyCol) return;
                onToggleGroupByColumn(column.key);
                onClose();
              }}
              className={`w-full flex items-center px-2.5 py-1.5 rounded-md text-left text-xs transition min-h-[28px] ${
                isEmptyCol
                  ? 'opacity-40 cursor-not-allowed'
                  : 'cursor-pointer hover:bg-agv-bg-hover'
              } ${groupByColumnKey === column.key ? 'text-agv-accent font-semibold' : 'text-agv-text-main'}`}
            >
              <span>{groupByColumnKey === column.key ? 'Hủy nhóm cột' : 'Nhóm theo cột'}</span>
            </button>
          )}

          {(() => {
            const parentBand = columnGroups?.find((g) => g.keys.includes(column.key));
            if (parentBand && parentBand.isAtomic) {
              return (
                <button
                  type="button"
                  onClick={() => {
                    onHideBand?.(parentBand.id);
                    onClose();
                  }}
                  className="w-full flex items-center px-2.5 py-1.5 rounded-md text-left text-xs transition cursor-pointer min-h-[28px] hover:bg-agv-bg-hover text-agv-text-main"
                >
                  <span>Ẩn nhóm {parentBand.title || parentBand.id || ''}</span>
                </button>
              );
            }

            return (
              <button
                type="button"
                onClick={() => {
                  onHideColumn?.(column.key);
                  onClose();
                }}
                className="w-full flex items-center px-2.5 py-1.5 rounded-md text-left text-xs transition cursor-pointer min-h-[28px] hover:bg-agv-bg-hover text-agv-text-main"
              >
                <span>Ẩn cột này</span>
              </button>
            );
          })()}

          {hasHiddenColumns && (
            <button
              type="button"
              onClick={() => {
                onShowAllHiddenColumns?.();
                onClose();
              }}
              className="w-full flex items-center px-2.5 py-1.5 rounded-md text-left text-xs transition cursor-pointer min-h-[28px] hover:bg-agv-bg-hover text-agv-accent"
            >
              <span className="font-semibold">Hiện lại các cột đã ẩn</span>
            </button>
          )}

          {/* Sắp xếp nhóm theo Tổng (Phương án B chuẩn Toolbar3: chỉ hiện khi có gom nhóm và cột là số) */}
          {Boolean(groupByColumnKey) && column.dataType === DATA_TYPES.NUMBER && onToggleGroupSort && (
            <div className="pt-1 mt-1 border-t border-[var(--agv-border)]">
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
                    className={`w-full flex items-center justify-center px-2.5 py-1.5 rounded-md text-center text-xs font-semibold transition cursor-pointer select-none min-h-[28px] ${
                      isCurrentColSorted
                        ? 'bg-agv-accent text-agv-accent-text'
                        : 'text-agv-text-main bg-agv-bg-card border border-agv-border hover:bg-agv-bg-hover'
                    }`}
                  >
                    <span>{label}</span>
                  </button>
                );
              })()}
            </div>
          )}

          {/* Thanh mỏng mở rộng tùy chọn Vừa độ rộng (mặc định ẩn, không chữ, chỉ có mũi tên) - Ẩn trên cột biểu đồ */}
          {!isChartCol && (
            <div className="pt-0.5 mt-0.5 border-t border-[var(--agv-border)]">
              <button
                type="button"
                onClick={() => setIsAutoFitExpanded((prev) => !prev)}
                className="w-full flex items-center justify-center py-0.5 rounded transition cursor-pointer hover:bg-[var(--agv-bg-hover)] text-[var(--agv-text-muted)] hover:text-[var(--agv-text-main)]"
                style={{ minHeight: '18px', height: '18px' }}
              >
                <MorphChevronIcon
                  expanded={isAutoFitExpanded}
                  type="down-up"
                  size={12}
                  spring="snappy"
                />
              </button>

              {isAutoFitExpanded && (
                <div className="pt-0.5 space-y-0.5 animate-in fade-in duration-150">
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
                      className={`w-full flex items-center px-2.5 py-1.5 rounded-md text-left text-xs transition min-h-[28px] ${
                        isEmptyCol
                          ? 'opacity-40 cursor-not-allowed'
                          : 'cursor-pointer hover:bg-agv-bg-hover'
                      } ${groupByColumnKey === column.key ? 'text-agv-accent font-semibold' : 'text-agv-text-main'}`}
                    >
                      <span>{groupByColumnKey === column.key ? 'Hủy nhóm cột' : 'Nhóm theo cột'}</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      onAutoFitColumn?.(column.key);
                      onClose();
                    }}
                    className="w-full flex items-center px-2.5 py-1.5 rounded-md text-left text-xs transition cursor-pointer min-h-[28px] hover:bg-[var(--agv-bg-hover)]"
                    style={{ color: 'var(--agv-text-main)' }}
                  >
                    <span>Vừa độ rộng cột</span>
                  </button>

                  {(() => {
                    const parentBand = columnGroups.find(
                      (g) => !g.isStandalone && g.keys.includes(column.key)
                    );
                    if (parentBand) {
                      return (
                        <button
                          type="button"
                          onClick={() => {
                            onAutoFitBandColumns?.(parentBand.id);
                            onClose();
                          }}
                          className="w-full flex items-center px-2.5 py-1.5 rounded-md text-left text-xs transition cursor-pointer min-h-[28px] hover:bg-[var(--agv-bg-hover)]"
                          style={{ color: 'var(--agv-text-main)' }}
                        >
                          <span>Vừa độ rộng các cột trong tầng</span>
                        </button>
                      );
                    }
                    return (
                      <button
                        type="button"
                        onClick={() => {
                          onAutoFitAllColumns?.();
                          onClose();
                        }}
                        className="w-full flex items-center px-2.5 py-1.5 rounded-md text-left text-xs transition cursor-pointer min-h-[28px] hover:bg-[var(--agv-bg-hover)]"
                        style={{ color: 'var(--agv-text-main)' }}
                      >
                        <span>Vừa độ rộng tất cả cột</span>
                      </button>
                    );
                  })()}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ============================================================================
  // 2. RENDER MENU NHÓM TẦNG 1 (BAND CONTEXT MENU)
  // ============================================================================
  if (menu.type === CONTEXT_MENU_TYPES.BAND) {
    const { groupDef, currentPin } = menu;
    const isPinned = currentPin !== 'none';

    return (
      <div
        ref={containerRef}
        style={{
          position: 'fixed',
          left: `${coords.left}px`,
          top: `${coords.top}px`,
          zIndex: 9999,
          boxShadow: '0 12px 28px -4px rgba(0, 0, 0, 0.25), 0 8px 12px -6px rgba(0, 0, 0, 0.15)',
        }}
        onClick={(e) => e.stopPropagation()}
        onContextMenu={(e) => e.preventDefault()}
        className={`agv-context-menu w-[215px] p-1.5 rounded-md border backdrop-blur-md select-none transition-all agv-spring-zoom ${themeClasses.contextMenuBg}`}
        data-agv-popup="true"
      >
        {/* Tiêu đề & Cụm 3 nút Ghim nhóm tầng */}
        <div className="p-1 border-b border-[var(--agv-border)]">
          <div
            className="text-[10px] font-bold uppercase tracking-wider mb-1.5 px-0.5 truncate flex items-center justify-between"
            style={{ color: 'var(--agv-text-muted)' }}
          >
            <span className="truncate">
              Ghim tầng: <span className="font-extrabold text-agv-accent">{groupDef.title}</span>
            </span>
            {isPinned && (
              <span className="text-[9px] font-normal text-amber-500 lowercase">bỏ ghim</span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-1">
            <button
              type="button"
              onClick={() => {
                onSetBandPin?.(
                  groupDef.id,
                  currentPin === PIN_POSITIONS.LEFT ? PIN_POSITIONS.NONE : PIN_POSITIONS.LEFT
                );
                onClose();
              }}
              className={`flex flex-col items-center justify-center py-1 px-1 rounded-lg border text-center transition cursor-pointer select-none min-h-[28px] ${
                currentPin === PIN_POSITIONS.LEFT
                  ? 'bg-agv-accent border-agv-accent text-agv-accent-text'
                  : 'bg-agv-bg-root border-agv-border text-agv-text-main hover:bg-agv-bg-hover'
              }`}
            >
              <span className="text-[10px] font-semibold">Trái</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onSetBandPin?.(
                  groupDef.id,
                  currentPin === PIN_POSITIONS.CENTER ? PIN_POSITIONS.NONE : PIN_POSITIONS.CENTER
                );
                onClose();
              }}
              className={`flex flex-col items-center justify-center py-1 px-1 rounded-lg border text-center transition cursor-pointer select-none min-h-[28px] ${
                currentPin === PIN_POSITIONS.CENTER
                  ? 'bg-agv-accent border-agv-accent text-agv-accent-text'
                  : 'bg-agv-bg-root border-agv-border text-agv-text-main hover:bg-agv-bg-hover'
              }`}
            >
              <span className="text-[10px] font-semibold">Giữa</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onSetBandPin?.(
                  groupDef.id,
                  currentPin === PIN_POSITIONS.RIGHT ? PIN_POSITIONS.NONE : PIN_POSITIONS.RIGHT
                );
                onClose();
              }}
              className={`flex flex-col items-center justify-center py-1 px-1 rounded-lg border text-center transition cursor-pointer select-none min-h-[28px] ${
                currentPin === PIN_POSITIONS.RIGHT
                  ? 'bg-agv-accent border-agv-accent text-agv-accent-text'
                  : 'bg-agv-bg-root border-agv-border text-agv-text-main hover:bg-agv-bg-hover'
              }`}
            >
              <span className="text-[10px] font-semibold">Phải</span>
            </button>
          </div>
        </div>

        {/* Các tác vụ trên nhóm tầng */}
        <div className="py-1 space-y-0.5">
          <button
            type="button"
            onClick={() => {
              onHideBand?.(groupDef.id);
              onClose();
            }}
            className="w-full flex items-center px-2.5 py-1.5 rounded-md text-left text-xs transition cursor-pointer min-h-[28px] hover:bg-[var(--agv-bg-hover)]"
            style={{ color: 'var(--agv-text-main)' }}
          >
            <span>Ẩn toàn bộ nhóm tầng</span>
          </button>

          {/* Thanh mỏng mở rộng tùy chọn Vừa độ rộng - Ẩn đối với nhóm Chu kỳ năm & Công thức */}
          {groupDef.id !== 'grp_analytics' && (
            <div className="pt-0.5 mt-0.5 border-t border-[var(--agv-border)]">
              <button
                type="button"
                onClick={() => setIsAutoFitExpanded((prev) => !prev)}
                className="w-full flex items-center justify-center py-0.5 rounded transition cursor-pointer hover:bg-[var(--agv-bg-hover)] text-[var(--agv-text-muted)] hover:text-[var(--agv-text-main)]"
                style={{ minHeight: '18px', height: '18px' }}
              >
                <MorphChevronIcon
                  expanded={isAutoFitExpanded}
                  type="down-up"
                  size={12}
                  spring="snappy"
                />
              </button>

              {isAutoFitExpanded && (
                <div className="pt-0.5 space-y-0.5 animate-in fade-in duration-150">
                  <button
                    type="button"
                    onClick={() => {
                      onAutoFitBandColumns?.(groupDef.id);
                      onClose();
                    }}
                    className="w-full flex items-center px-2.5 py-1.5 rounded-md text-left text-xs transition cursor-pointer min-h-[28px] hover:bg-[var(--agv-bg-hover)]"
                    style={{ color: 'var(--agv-text-main)' }}
                  >
                    <span>Vừa độ rộng các cột trong tầng</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ============================================================================
  // 3. RENDER MENU TIÊU ĐỀ NHÓM (GROUP HEADER CONTEXT MENU)
  // ============================================================================
  if (menu.type === CONTEXT_MENU_TYPES.GROUP) {
    const { groupRow } = menu;

    return (
      <div
        ref={containerRef}
        style={{
          position: 'fixed',
          top: `${coords.top}px`,
          left: `${coords.left}px`,
          zIndex: 9999,
          boxShadow: '0 12px 28px -4px rgba(0, 0, 0, 0.25), 0 8px 12px -6px rgba(0, 0, 0, 0.15)',
        }}
        className={`agv-context-menu w-[215px] p-1.5 rounded-md border backdrop-blur-md select-none transition-all agv-spring-zoom ${themeClasses.contextMenuBg}`}
        onClick={(e) => e.stopPropagation()}
        onContextMenu={(e) => e.preventDefault()}
        data-agv-popup="true"
      >
        {/* 1. Hủy nhóm cột (Đưa lên đầu, đồng bộ màu xanh accent, chữ đậm và không icon với Header Menu) */}
        <button
          type="button"
          onClick={() => {
            onUngroup?.();
            onClose();
          }}
          className="w-full flex items-center px-2.5 py-1.5 rounded-md text-left text-xs transition cursor-pointer min-h-[28px] hover:bg-agv-bg-hover text-agv-accent font-semibold"
        >
          <span>Hủy nhóm cột</span>
        </button>

        <div className="my-1 border-b border-[var(--agv-border)]" />

        {/* 2. Thu gọn tất cả */}
        <button
          type="button"
          onClick={() => {
            onCollapseAllGroups?.();
            onClose();
          }}
          className="w-full flex items-center px-2.5 py-1.5 rounded-md text-left text-xs transition cursor-pointer min-h-[28px] hover:bg-[var(--agv-bg-hover)]"
          style={{ color: 'var(--agv-text-main)' }}
        >
          <span>Thu gọn tất cả</span>
        </button>

        {/* 3. Mở rộng tất cả */}
        <button
          type="button"
          onClick={() => {
            onExpandAllGroups?.();
            onClose();
          }}
          className="w-full flex items-center px-2.5 py-1.5 rounded-md text-left text-xs transition cursor-pointer min-h-[28px] hover:bg-[var(--agv-bg-hover)]"
          style={{ color: 'var(--agv-text-main)' }}
        >
          <span>Mở rộng tất cả</span>
        </button>

        {/* Thanh mỏng mở rộng 3 tác vụ Sao chép / Xuất Excel */}
        <div className="pt-0.5 mt-0.5 border-t border-[var(--agv-border)]">
          <button
            type="button"
            onClick={() => setIsGroupActionsExpanded((prev) => !prev)}
            className="w-full flex items-center justify-center py-0.5 rounded transition cursor-pointer hover:bg-[var(--agv-bg-hover)] text-[var(--agv-text-muted)] hover:text-[var(--agv-text-main)]"
            style={{ minHeight: '18px', height: '18px' }}
          >
            <MorphChevronIcon
              expanded={isGroupActionsExpanded}
              type="down-up"
              size={12}
              spring="snappy"
            />
          </button>

          {isGroupActionsExpanded && (
            <div className="pt-0.5 space-y-0.5 animate-in fade-in duration-150">
              {/* 4. Sao chép bảng */}
              <button
                type="button"
                onClick={() => {
                  onCopyGroupTable?.(groupRow, false);
                  onClose();
                }}
                className="w-full flex items-center px-2.5 py-1.5 rounded-md text-left text-xs transition cursor-pointer min-h-[28px] hover:bg-[var(--agv-bg-hover)]"
                style={{ color: 'var(--agv-text-main)' }}
              >
                <span>Sao chép bảng</span>
              </button>

              {/* 5. Sao chép bảng kèm tên cột */}
              <button
                type="button"
                onClick={() => {
                  onCopyGroupTable?.(groupRow, true);
                  onClose();
                }}
                className="w-full flex items-center px-2.5 py-1.5 rounded-md text-left text-xs transition cursor-pointer min-h-[28px] hover:bg-[var(--agv-bg-hover)]"
                style={{ color: 'var(--agv-text-main)' }}
              >
                <span>Sao chép bảng kèm tên cột</span>
              </button>

              {/* 6. Xuất Excel bảng */}
              <button
                type="button"
                onClick={() => {
                  onExportGroupExcel?.(groupRow);
                  onClose();
                }}
                className="w-full flex items-center px-2.5 py-1.5 rounded-md text-left text-xs transition cursor-pointer min-h-[28px] hover:bg-[var(--agv-bg-hover)]"
                style={{ color: 'var(--agv-text-main)' }}
              >
                <span>Xuất Excel bảng</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
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

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        left: `${coords.left}px`,
        top: `${coords.top}px`,
        zIndex: 9999,
        boxShadow: '0 12px 28px -4px rgba(0, 0, 0, 0.25), 0 8px 12px -6px rgba(0, 0, 0, 0.15)',
      }}
      onClick={(e) => e.stopPropagation()}
      onContextMenu={(e) => e.preventDefault()}
      className={`agv-context-menu w-[215px] p-1.5 rounded-md border backdrop-blur-md select-none transition-all agv-spring-zoom ${themeClasses.contextMenuBg}`}
      data-agv-popup="true"
    >
      <div className="py-0.5 space-y-0.5">
        {/* Nếu click trên ô công thức (isFormula), cho phép đổi công thức trực tiếp */}
        {isFormulaCol && onSelectFormulaMode && (
          <div className="pb-1 mb-1 border-b border-[var(--agv-border)]">
            <div
              className="text-[10px] font-bold uppercase tracking-wider mb-1 px-2.5 truncate"
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
                    className={`w-full flex items-center px-2.5 py-1.5 rounded-md text-left text-xs transition cursor-pointer min-h-[28px] ${
                      isActive
                        ? 'bg-agv-accent text-agv-accent-text font-semibold'
                        : 'text-agv-text-main hover:bg-agv-bg-hover'
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
                      className={`w-full flex items-center px-2.5 py-1.5 rounded-md text-left text-xs transition cursor-pointer min-h-[28px] ${
                        isMonthSort
                          ? 'bg-agv-accent text-agv-accent-text font-semibold'
                          : 'text-agv-text-main hover:bg-agv-bg-hover'
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
          className="w-full flex items-center px-2.5 py-1.5 rounded-md text-left text-xs transition cursor-pointer min-h-[28px] hover:bg-[var(--agv-bg-hover)]"
          style={{ color: 'var(--agv-text-main)' }}
        >
          <span>Sao chép giá trị ô</span>
        </button>

        {/* Lọc theo giá trị ô */}
        {column && (
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
              onFilterByValue?.(column.key, val);
              onClose();
            }}
            className={`w-full flex items-center px-2.5 py-1.5 rounded-md text-left text-xs transition min-h-[28px] ${
              isCellEmptyCol || column.filterable === false
                ? 'opacity-40 cursor-not-allowed'
                : 'cursor-pointer hover:bg-[var(--agv-bg-hover)]'
            }`}
            style={{ color: 'var(--agv-text-main)' }}
          >
            <span>Lọc theo</span>
          </button>
        )}

        <div className="my-1 border-b border-[var(--agv-border)]" />

        {/* Cuộn lên đầu */}
        <button
          type="button"
          onClick={() => {
            onScrollToTop?.();
            onClose();
          }}
          className="w-full flex items-center px-2.5 py-1.5 rounded-md text-left text-xs transition cursor-pointer min-h-[28px] hover:bg-[var(--agv-bg-hover)]"
          style={{ color: 'var(--agv-text-main)' }}
        >
          <span>Cuộn lên đầu</span>
        </button>

        {/* Cuộn cuối trang */}
        <button
          type="button"
          onClick={() => {
            onScrollToBottom?.();
            onClose();
          }}
          className="w-full flex items-center px-2.5 py-1.5 rounded-md text-left text-xs transition cursor-pointer min-h-[28px] hover:bg-[var(--agv-bg-hover)]"
          style={{ color: 'var(--agv-text-main)' }}
        >
          <span>Cuộn cuối trang</span>
        </button>
      </div>
    </div>
  );
};
