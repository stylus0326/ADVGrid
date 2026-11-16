import React from 'react';
import { Filter } from 'lucide-react';

import { preloadColumnResizeEngine } from './hooks/useColumnResize';
import { preloadSortFlipEngine } from './hooks/useGridSortFlipAnimation';

const preloadGridMorphIcons = () => {
  void import('./GridMorphPrimitives');
  preloadSortFlipEngine();
};
const preloadChecklistPopup = () => {
  void import('./AdvChecklistFilterPopup');
};

const LazyHeaderSortMorphIcon = React.lazy(() =>
  import('./GridMorphPrimitives').then((m) => ({ default: m.HeaderSortMorphIcon }))
);
const LazyHeaderBandToggleMorphIcon = React.lazy(() =>
  import('./GridMorphPrimitives').then((m) => ({ default: m.HeaderBandToggleMorphIcon }))
);
import {
  ColumnDef,
  BaseGroupDef,
  PinPosition,
  PIN_POSITIONS,
  CenterDockStatus,
  CENTER_DOCK_STATUSES,
  SurfaceTheme,
  SortConfig,
  ColumnFilterValue,
  DATA_TYPES,
  FILTER_MODES,
  SORT_DIRECTIONS,
} from './types';
import {
  getPinnedDividerClass,
  getRightPinnedDividerClass,
  getThemeClasses,
} from './constants';
import { isSelectionColumn } from './gridFormatUtils';

export interface GridHeaderProps<T = any> {
  totalGridWidth: number;
  leftColumns: ColumnDef<T>[];
  middleElements: (
    | { type: 'standalone'; col: ColumnDef<T>; isCenterPinned?: boolean }
    | { type: 'group'; def: BaseGroupDef; segmentKey: string; children: ColumnDef<T>[] }
  )[];
  rightColumns: ColumnDef<T>[];
  colWidths: Record<string, number>;
  columnPins: Record<string, PinPosition>;
  leftOffsets: Record<string, number>;
  rightOffsets: Record<string, number>;
  centerDockStatus: Record<string, CenterDockStatus>;
  centerLeftOffsets: Record<string, number>;
  centerRightOffsets: Record<string, number>;
  lastEffectiveLeftColKey: string | null;
  firstEffectiveRightColKey: string | null;
  sortConfig?: SortConfig | null;
  sortRules?: SortConfig[];
  surfaceTheme: SurfaceTheme;
  columnFilters?: Record<string, ColumnFilterValue>;
  activeChecklistColKey?: string | null;
  emptyColKeys?: Set<string>;
  onOpenChecklistFilter?: (colKey: string, e: React.MouseEvent) => void;
  onToggleSort: (colKey: string, e?: React.MouseEvent) => void;
  onColumnContextMenu?: (colKey: string, e: React.MouseEvent) => void;
  onBandContextMenu?: (groupId: string, childCols: ColumnDef<T>[], e: React.MouseEvent) => void;
  onMouseDownResize?: (colKey: string, e: React.MouseEvent) => void;
  onToggleGroup?: (groupId: string) => void;
  onReorderColumns?: (sourceKey: string, targetKey: string) => void;
  headerHeight?: number;
  hasFilterRow?: boolean;
  enableSorting?: boolean;
  enableColumnResize?: boolean;
  enableContextMenu?: boolean;
}

export const GridHeader: React.FC<GridHeaderProps> = React.memo(({
  totalGridWidth,
  leftColumns,
  middleElements,
  rightColumns,
  colWidths,
  columnPins,
  leftOffsets,
  rightOffsets,
  centerDockStatus,
  centerLeftOffsets,
  centerRightOffsets,
  lastEffectiveLeftColKey,
  firstEffectiveRightColKey,
  sortConfig,
  sortRules,
  surfaceTheme,
  columnFilters = {},
  activeChecklistColKey = null,
  emptyColKeys,
  onOpenChecklistFilter,
  onToggleSort,
  onColumnContextMenu,
  onBandContextMenu,
  onMouseDownResize,
  onToggleGroup,
  onReorderColumns,
  headerHeight,
  hasFilterRow = true,
  enableSorting = true,
  enableColumnResize = true,
  enableContextMenu = true,
}) => {
  const theme = getThemeClasses(surfaceTheme);
  const bottomBorderClass = hasFilterRow ? theme.headerBorderBottom : theme.systemBorderBottom;

  // Determine if header has multi-tier group bands
  const isMultiTier = middleElements.some((e) => e.type === 'group');
  const headerH = headerHeight ?? (isMultiTier ? 64 : 34);
  const headerHStr = `${headerH}px`;

  // Drag and drop column reorder state
  const [dragOverColKey, setDragOverColKey] = React.useState<string | null>(null);
  const [draggingColKey, setDraggingColKey] = React.useState<string | null>(null);
  const draggingColKeyRef = React.useRef<string | null>(null);

  const createDragProps = (
    targetKey: string,
    disabled = false,
    blockedSourceKeys?: Set<string>
  ) => {
    const isResizingActive =
      typeof document !== 'undefined' &&
      (document.documentElement.getAttribute('data-agv-resizing') === 'true' ||
        document.body.classList.contains('agv-resizing-column'));
    const canDrag = !disabled && Boolean(onReorderColumns) && !isResizingActive;
    return {
      draggable: canDrag,
      onDragStart: (e: React.DragEvent<HTMLDivElement>) => {
        if (
          !canDrag ||
          (typeof document !== 'undefined' &&
            (document.documentElement.getAttribute('data-agv-resizing') === 'true' ||
              document.body.classList.contains('agv-resizing-column')))
        ) {
          e.preventDefault();
          return;
        }
        e.stopPropagation();
        draggingColKeyRef.current = targetKey;
        e.dataTransfer.setData('text/plain', targetKey);
        e.dataTransfer.effectAllowed = 'move';
        requestAnimationFrame(() => {
          setDraggingColKey(targetKey);
        });
      },
      onDragEnd: () => {
        draggingColKeyRef.current = null;
        setDraggingColKey(null);
        setDragOverColKey(null);
      },
      onDragOver: (e: React.DragEvent<HTMLDivElement>) => {
        const activeKey = draggingColKeyRef.current || draggingColKey;
        if (
          canDrag &&
          activeKey &&
          activeKey !== targetKey &&
          !blockedSourceKeys?.has(activeKey)
        ) {
          e.preventDefault();
          e.stopPropagation();
          e.dataTransfer.dropEffect = 'move';
          if (dragOverColKey !== targetKey) {
            setDragOverColKey(targetKey);
          }
        }
      },
      onDragLeave: (e: React.DragEvent<HTMLDivElement>) => {
        const related = e.relatedTarget as Node | null;
        if (related && e.currentTarget.contains(related)) return;
        if (dragOverColKey === targetKey) {
          setDragOverColKey(null);
        }
      },
      onDrop: (e: React.DragEvent<HTMLDivElement>) => {
        if (canDrag) {
          e.preventDefault();
          e.stopPropagation();
          const src =
            e.dataTransfer.getData('text/plain') ||
            draggingColKeyRef.current ||
            draggingColKey;
          if (src && src !== targetKey && !blockedSourceKeys?.has(src)) {
            onReorderColumns?.(src, targetKey);
          }
        }
        draggingColKeyRef.current = null;
        setDragOverColKey(null);
        setDraggingColKey(null);
      },
    };
  };

  /**
   * Helper chuẩn hóa DRY cho nội dung ô header (tiêu đề, icon sort, nút checklist filter, thanh resize)
   * dùng chung cho cả 4 vùng: Pinned Left, Middle Standalone, Middle Band Child, Pinned Right
   */
  const renderHeaderCellContent = (col: ColumnDef<any>, isTier2 = false) => {
    const activeRules = enableSorting
      ? sortRules && sortRules.length > 0
        ? sortRules
        : sortConfig?.key
        ? [sortConfig]
        : []
      : [];
    const ruleIdx = activeRules.findIndex((r) => r.key === col.key);
    const activeRule = ruleIdx >= 0 ? activeRules[ruleIdx] : null;
    const isSorted = Boolean(activeRule);
    const showRuleOrder = activeRules.length >= 2;
    const isSystemCol = col.dataType === DATA_TYPES.SYSTEM || Boolean(col.isRowNumber) || isSelectionColumn(col);
    const curFilter = columnFilters[col.key];
    const isChecklistActive = Boolean(
      curFilter &&
        (curFilter.mode === FILTER_MODES.CHECKLIST ||
          (Array.isArray(curFilter.selectedValues) && curFilter.selectedValues.length > 0) ||
          curFilter.includeBlanks)
    );
    const isChecklistOpen = activeChecklistColKey === col.key;

    return (
      <>
        <div className="inline-flex items-center justify-center gap-1 max-w-full px-0.5 min-w-0">
          {col.renderHeader ? (
            <div
              className={`inline-flex items-center justify-center max-w-full min-w-0 text-xs font-bold uppercase tracking-wider truncate text-center ${
                isSorted ? 'text-[var(--agv-accent)]' : ''
              }`}
              onClick={isSelectionColumn(col) ? (e) => e.stopPropagation() : undefined}
            >
              {col.renderHeader()}
            </div>
          ) : (
            <span
              className={`text-xs font-bold uppercase tracking-wider truncate text-center ${
                isSorted ? 'text-[var(--agv-accent)]' : ''
              }`}
            >
              {isSystemCol && !col.title ? '' : col.title}
            </span>
          )}
          {activeRule && (
            <span className="shrink-0 inline-flex items-center text-[var(--agv-accent)]">
              <React.Suspense fallback={null}>
                <LazyHeaderSortMorphIcon
                  direction={activeRule.direction === SORT_DIRECTIONS.ASC ? SORT_DIRECTIONS.ASC : SORT_DIRECTIONS.DESC}
                  size={isTier2 ? 10 : 11}
                />
              </React.Suspense>
              {showRuleOrder && (
                <span className="text-xs font-extrabold leading-none tabular-nums ml-0.5">
                  {ruleIdx + 1}
                </span>
              )}
            </span>
          )}
        </div>

        {/* Nút lọc hình phễu ở góc phải header (mở checklist filter popup) - ẩn với cột rỗng và cột hệ thống */}
        {onOpenChecklistFilter && !isSystemCol && col.filterable !== false && !emptyColKeys?.has(col.key) && (
          <div
            className={`absolute z-10 flex shrink-0 items-center ${
              isTier2 ? 'right-0.5 top-1/2 -translate-y-1/2' : 'right-1 top-1.5'
            }`}
          >
            <button
              type="button"
              data-checklist-trigger={col.key}
              data-agv-popover-trigger="true"
              onMouseEnter={preloadChecklistPopup}
              onClick={(e) => {
                e.stopPropagation();
                onOpenChecklistFilter(col.key, e);
              }}
              className={`agv-header-filter-btn flex items-center justify-center rounded transition-colors cursor-pointer border-none ${
                isTier2 ? 'w-3.5 h-3.5' : 'w-4 h-4'
              } ${
                isChecklistOpen
                  ? 'bg-[var(--agv-bg-item-hover)] text-[var(--agv-accent)] opacity-100 ring-1 ring-[var(--agv-accent)]/40'
                  : isChecklistActive
                  ? 'bg-transparent text-[var(--agv-accent)] opacity-100'
                  : 'bg-transparent text-[var(--agv-text-muted)] opacity-0 group-hover/th:opacity-100 focus:opacity-100 focus-visible:opacity-100 hover:text-[var(--agv-accent)]'
              }`}
            >
              <Filter size={isTier2 ? 10 : 11} strokeWidth={2.5} />
            </button>
          </div>
        )}

        {/* Thanh kéo độ rộng cột (col resize handle) - vùng bắt chuột 9px cân tâm viền phải */}
        {enableColumnResize && onMouseDownResize && col.resizable !== false && !isSystemCol && (
          <div
            data-col-resize-handle={col.key}
            draggable={false}
            onMouseEnter={preloadColumnResizeEngine}
            onDragStart={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
              onMouseDownResize(col.key, e);
            }}
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="agv-col-resize-handle absolute -right-[4px] top-0 bottom-0 w-[9px] cursor-col-resize z-50 flex items-center justify-center group/resize"
          >
            <span className="w-[2px] h-full transition-colors group-hover/resize:bg-[var(--agv-accent)] group-active/resize:bg-[var(--agv-accent)]" />
          </div>
        )}
      </>
    );
  };

  return (
    <div
      data-agv-header-root="true"
      data-agv-fullwidth="true"
      style={{
        width: `var(--agv-total-grid-w, ${totalGridWidth}px)`,
        minWidth: `var(--agv-total-grid-w, ${totalGridWidth}px)`,
        transform: 'translateZ(0)',
        height: headerHStr,
        backgroundColor: 'var(--agv-bg-header)',
        color: 'var(--agv-text-header, var(--agv-text-main))',
      }}
      className={`sticky top-0 z-30 flex box-border ${theme.headerBg}`}
    >
      {/* 1. KHU VỰC GHIM TRÁI (PINNED LEFT) */}
      {leftColumns.map((col) => {
        const width = colWidths[col.key] || col.defaultWidth;
        const isLeftDivider = col.key === lastEffectiveLeftColKey;
        const isSystemCol = col.dataType === DATA_TYPES.SYSTEM || Boolean(col.isRowNumber) || isSelectionColumn(col);
        const canSort = enableSorting && col.sortable !== false;
        const canContextMenu = enableContextMenu && Boolean(onColumnContextMenu) && !isSystemCol && !col.disableHeaderContextMenu;
        const isDragOver = dragOverColKey === col.key;

        const headerBottomBorder = `${bottomBorderClass} ${theme.sharedHeaderCellBg} ${theme.headerHoverBg}`;
        const headerRightBorder = isLeftDivider
          ? getPinnedDividerClass(surfaceTheme)
          : theme.headerBorderRight;

        return (
          <div
            key={`left_${col.key}`}
            data-col-key={col.key}
            {...createDragProps(col.key, isSystemCol)}
            onMouseEnter={canSort ? preloadGridMorphIcons : undefined}
            onClick={(e) => canSort && onToggleSort(col.key, e)}
            onContextMenu={(e) => {
              if (canContextMenu) {
                e.preventDefault();
                e.stopPropagation();
                onColumnContextMenu?.(col.key, e);
              } else if (enableContextMenu) {
                e.preventDefault();
                e.stopPropagation();
              }
            }}
            style={{
              width: `var(--agv-col-w-${col.key}, ${width}px)`,
              minWidth: `var(--agv-col-w-${col.key}, ${width}px)`,
              maxWidth: `var(--agv-col-w-${col.key}, ${width}px)`,
              height: headerHStr,
              position: 'sticky',
              left: `var(--agv-left-offset-${col.key}, ${leftOffsets[col.key]}px)`,
              backgroundColor: 'var(--agv-bg-header)',
              color: 'var(--agv-text-header, var(--agv-text-main))',
            }}
            className={`group/th flex flex-col justify-center items-center text-center ${
              isSystemCol ? 'px-0.5' : 'px-1.5'
            } ${headerBottomBorder} ${headerRightBorder} shrink-0 sticky z-40 select-none box-border ${canSort ? 'cursor-pointer' : 'cursor-default'} transition-colors relative ${
              isDragOver ? 'ring-2 ring-inset ring-[var(--agv-accent)]' : ''
            }`}
          >
            {renderHeaderCellContent(col)}
          </div>
        );
      })}

      {/* 2. KHU VỰC Ở GIỮA (MIDDLE): Cột độc lập hoặc nhóm 2 tầng có các cột con còn lại */}
      {middleElements.map((elem) => {
        if (elem.type === 'standalone') {
          const col = elem.col;
          const width = colWidths[col.key] || col.defaultWidth;
          const isCenterPinned = columnPins[col.key] === PIN_POSITIONS.CENTER;
          const dock = isCenterPinned ? centerDockStatus[col.key] || CENTER_DOCK_STATUSES.NORMAL : CENTER_DOCK_STATUSES.NORMAL;

          const isDockedLeft = dock === CENTER_DOCK_STATUSES.LEFT;
          const isDockedRight = dock === CENTER_DOCK_STATUSES.RIGHT;
          const isLeftDivider = col.key === lastEffectiveLeftColKey;
          const isRightDivider = col.key === firstEffectiveRightColKey;
          const isSystemCol = col.dataType === DATA_TYPES.SYSTEM || Boolean(col.isRowNumber) || isSelectionColumn(col);

          const stickyHeaderStyle: React.CSSProperties = {
            width: `var(--agv-col-w-${col.key}, ${width}px)`,
            minWidth: `var(--agv-col-w-${col.key}, ${width}px)`,
            maxWidth: `var(--agv-col-w-${col.key}, ${width}px)`,
            height: headerHStr,
            backgroundColor: 'var(--agv-bg-header)',
            color: 'var(--agv-text-header, var(--agv-text-main))',
            ...(isDockedLeft
              ? { position: 'sticky', left: `var(--agv-center-left-offset-${col.key}, ${centerLeftOffsets[col.key]}px)`, zIndex: 40 }
              : isDockedRight
              ? { position: 'sticky', right: `var(--agv-center-right-offset-${col.key}, ${centerRightOffsets[col.key]}px)`, zIndex: 40 }
              : {}),
          };

          const headerBottomBorder = `${bottomBorderClass} ${theme.sharedHeaderCellBg} ${theme.headerHoverBg}`;
          const headerRightBorder = isLeftDivider
            ? getPinnedDividerClass(surfaceTheme)
            : theme.headerBorderRight;
          const headerLeftBorder = isRightDivider
            ? getRightPinnedDividerClass(surfaceTheme)
            : '';

          const canSort = enableSorting && col.sortable !== false;
          const canContextMenu = enableContextMenu && Boolean(onColumnContextMenu) && !isSystemCol && !col.disableHeaderContextMenu;
          const isDragOver = dragOverColKey === col.key;

          return (
            <div
              key={`mid_standalone_${col.key}`}
              data-col-key={col.key}
              {...createDragProps(col.key, isSystemCol)}
              onMouseEnter={canSort ? preloadGridMorphIcons : undefined}
              onClick={(e) => canSort && onToggleSort(col.key, e)}
              onContextMenu={(e) => {
                if (canContextMenu) {
                  e.preventDefault();
                  e.stopPropagation();
                  onColumnContextMenu?.(col.key, e);
                } else if (enableContextMenu) {
                  e.preventDefault();
                  e.stopPropagation();
                }
              }}
              style={stickyHeaderStyle}
              className={`group/th flex flex-col justify-center items-center text-center px-1.5 ${headerBottomBorder} ${headerRightBorder} ${headerLeftBorder} ${
                isDockedLeft || isDockedRight ? 'sticky z-40' : 'relative z-10'
              } shrink-0 select-none box-border ${canSort ? 'cursor-pointer' : 'cursor-default'} transition-colors relative ${
                isDragOver ? 'ring-2 ring-inset ring-[var(--agv-accent)]' : ''
              }`}
            >
              {renderHeaderCellContent(col)}
            </div>
          );
        } else {
          const group = elem.def;
          const childCols = elem.children;
          const groupWidth = childCols.reduce(
            (sum, c) => sum + (colWidths[c.key] || c.defaultWidth),
            0
          );
          const childKeySet = new Set(childCols.map((c) => c.key));
          const isBandDragOver = dragOverColKey === group.id;

          const groupWidthCalc = `calc(${childCols.map((c) => `var(--agv-col-w-${c.key}, ${colWidths[c.key] || c.defaultWidth}px)`).join(' + ')})`;

          return (
            <div
              key={elem.segmentKey}
              data-band-key={group.id}
              style={{ width: groupWidthCalc, minWidth: groupWidthCalc, height: '64px' }}
              className="flex flex-col shrink-0 relative z-10 select-none box-border h-[64px] min-h-[64px] max-h-[64px]"
            >
              {/* Tầng 1: Tiêu đề nhóm */}
              <div
                {...createDragProps(group.id, false, childKeySet)}
                style={{
                  width: groupWidthCalc,
                  minWidth: groupWidthCalc,
                  height: '32px',
                  backgroundColor: 'var(--agv-bg-header)',
                  color: 'var(--agv-text-header, var(--agv-text-main))',
                }}
                onContextMenu={(e) => {
                  if (enableContextMenu && onBandContextMenu) {
                    e.preventDefault();
                    e.stopPropagation();
                    onBandContextMenu(group.id, childCols, e);
                  } else if (enableContextMenu) {
                    e.preventDefault();
                    e.stopPropagation();
                  }
                }}
                className={`relative flex items-center justify-center text-center px-8 text-xs font-bold uppercase tracking-wider border-r border-b ${theme.tier1Border} ${theme.tier1Bg} shrink-0 box-border h-[32px] min-h-[32px] max-h-[32px] leading-[32px] cursor-pointer ${
                  isBandDragOver ? 'ring-2 ring-inset ring-[var(--agv-accent)]' : ''
                }`}
              >
                {group.isToggleable && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onToggleGroup?.(group.id);
                    }}
                    className="absolute left-1.5 top-1/2 -translate-y-1/2 h-5 w-5 flex items-center justify-center p-0 border-none bg-transparent hover:opacity-75 transition cursor-pointer select-none outline-none"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--agv-text-main)',
                    }}
                  >
                    <React.Suspense fallback={null}>
                      <LazyHeaderBandToggleMorphIcon
                        direction={group.isCollapsed ? 'right' : 'left'}
                      />
                    </React.Suspense>
                  </button>
                )}

                <span className="truncate text-center w-full">{group.title}</span>

                {group.isToggleable && !group.isCollapsed && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onToggleGroup?.(group.id);
                    }}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 h-5 w-5 flex items-center justify-center p-0 border-none bg-transparent hover:opacity-75 transition cursor-pointer select-none outline-none"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--agv-text-main)',
                    }}
                  >
                    <React.Suspense fallback={null}>
                      <LazyHeaderBandToggleMorphIcon direction="left" />
                    </React.Suspense>
                  </button>
                )}
              </div>

              {/* Tầng 2: Cột con */}
              <div
                style={{ width: groupWidthCalc, minWidth: groupWidthCalc, height: '32px' }}
                className="flex items-center shrink-0 box-border h-[32px] min-h-[32px] max-h-[32px]"
              >
                {childCols.map((col) => {
                  const width = colWidths[col.key] || col.defaultWidth;
                  const isSystemCol = col.dataType === DATA_TYPES.SYSTEM || Boolean(col.isRowNumber) || isSelectionColumn(col);
                  const canSort = enableSorting && col.sortable !== false;
                  const canContextMenu = enableContextMenu && Boolean(onColumnContextMenu) && !isSystemCol && !col.disableHeaderContextMenu;
                  const isChildDragOver = dragOverColKey === col.key;

                  return (
                    <div
                      key={col.key}
                      data-col-key={col.key}
                      data-tier2-col-key={col.key}
                      {...createDragProps(col.key, isSystemCol, new Set([group.id]))}
                      onMouseEnter={canSort ? preloadGridMorphIcons : undefined}
                      onClick={(e) => canSort && onToggleSort(col.key, e)}
                      onContextMenu={(e) => {
                        if (canContextMenu) {
                          e.preventDefault();
                          e.stopPropagation();
                          onColumnContextMenu?.(col.key, e);
                        } else if (enableContextMenu) {
                          e.preventDefault();
                          e.stopPropagation();
                        }
                      }}
                      style={{
                        width: `var(--agv-col-w-${col.key}, ${width}px)`,
                        minWidth: `var(--agv-col-w-${col.key}, ${width}px)`,
                        maxWidth: `var(--agv-col-w-${col.key}, ${width}px)`,
                        height: '32px',
                        backgroundColor: 'var(--agv-bg-header)',
                        color: 'var(--agv-text-header, var(--agv-text-main))',
                      }}
                      className={`group/th flex items-center justify-center text-center px-1 text-xs font-bold uppercase tracking-wider ${theme.headerBorderRight} ${bottomBorderClass} ${theme.sharedHeaderCellBg} ${theme.headerHoverBg} shrink-0 relative box-border h-[32px] min-h-[32px] max-h-[32px] leading-[32px] ${canSort ? 'cursor-pointer' : 'cursor-default'} transition-colors ${
                        isChildDragOver ? 'ring-2 ring-inset ring-[var(--agv-accent)]' : ''
                      }`}
                    >
                      {renderHeaderCellContent(col, true)}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        }
      })}

      {/* 3. KHU VỰC GHIM PHẢI (PINNED RIGHT): Mỗi cột chiếm trọn 2 tầng 64px độc lập */}
      {rightColumns.map((col) => {
        const width = colWidths[col.key] || col.defaultWidth;
        const isRightDivider = col.key === firstEffectiveRightColKey;
        const isSystemCol = col.dataType === DATA_TYPES.SYSTEM || Boolean(col.isRowNumber) || isSelectionColumn(col);
        const canSort = enableSorting && col.sortable !== false;
        const canContextMenu = enableContextMenu && Boolean(onColumnContextMenu) && !isSystemCol && !col.disableHeaderContextMenu;

        const headerBottomBorder = `${bottomBorderClass} ${theme.sharedHeaderCellBg} ${theme.headerHoverBg}`;
        const headerRightBorder = theme.headerBorderRight;
        const isDragOver = dragOverColKey === col.key;

        return (
          <div
            key={`right_${col.key}`}
            data-col-key={col.key}
            {...createDragProps(col.key, isSystemCol)}
            onMouseEnter={canSort ? preloadGridMorphIcons : undefined}
            onClick={(e) => canSort && onToggleSort(col.key, e)}
            onContextMenu={(e) => {
              if (canContextMenu) {
                e.preventDefault();
                e.stopPropagation();
                onColumnContextMenu?.(col.key, e);
              } else if (enableContextMenu) {
                e.preventDefault();
                e.stopPropagation();
              }
            }}
            style={{
              width: `var(--agv-col-w-${col.key}, ${width}px)`,
              minWidth: `var(--agv-col-w-${col.key}, ${width}px)`,
              maxWidth: `var(--agv-col-w-${col.key}, ${width}px)`,
              height: headerHStr,
              position: 'sticky',
              right: `var(--agv-right-offset-${col.key}, ${rightOffsets[col.key]}px)`,
              backgroundColor: 'var(--agv-bg-header)',
              color: 'var(--agv-text-header, var(--agv-text-main))',
            }}
            className={`group/th flex flex-col justify-center items-center text-center px-1.5 ${headerBottomBorder} ${headerRightBorder} shrink-0 sticky z-40 select-none box-border ${canSort ? 'cursor-pointer' : 'cursor-default'} transition-colors ${
              isRightDivider ? getRightPinnedDividerClass(surfaceTheme) : ''
            } relative ${isDragOver ? 'ring-2 ring-inset ring-[var(--agv-accent)]' : ''}`}
          >
            {renderHeaderCellContent(col)}
          </div>
        );
      })}
    </div>
  );
});
