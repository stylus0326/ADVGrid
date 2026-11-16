import React, { memo, lazy, Suspense } from 'react';
import {
  ColumnDef,
  PinPosition,
  PIN_POSITIONS,
  DATA_TYPES,
  CenterDockStatus,
  CENTER_DOCK_STATUSES,
  SurfaceTheme,
} from './types';
import {
  getPinnedDividerClass,
  getRightPinnedDividerClass,
  getThemeClasses,
} from './constants';
import { formatGridNumber, getAlignJustifyClass } from './gridFormatUtils';

const LazyRowGroupChevronMorphIcon = lazy(() =>
  import('./GridMorphPrimitives').then((m) => ({ default: m.RowGroupChevronMorphIcon }))
);

export interface GridGroupHeaderRowProps<T = any> {
  row: any;
  rowIndex: number;
  columns: ColumnDef<T>[];
  colWidths: Record<string, number>;
  rowHeight: number;
  totalRowWidth: number;
  surfaceTheme: SurfaceTheme;
  columnPins: Record<string, PinPosition>;
  leftOffsets: Record<string, number>;
  rightOffsets: Record<string, number>;
  lastEffectiveLeftColKey: string | null;
  firstEffectiveRightColKey: string | null;
  centerDockStatus: Record<string, CenterDockStatus>;
  centerLeftOffsets: Record<string, number>;
  centerRightOffsets: Record<string, number>;
  onGroupContextMenu?: (groupRow: any, e: React.MouseEvent) => void;
}

function GridGroupHeaderRowInner<T = any>({
  row: g,
  rowIndex,
  columns,
  colWidths,
  rowHeight,
  totalRowWidth,
  surfaceTheme,
  columnPins,
  leftOffsets,
  rightOffsets,
  lastEffectiveLeftColKey,
  firstEffectiveRightColKey,
  centerDockStatus,
  centerLeftOffsets,
  centerRightOffsets,
  onGroupContextMenu,
}: GridGroupHeaderRowProps<T>) {
    const theme = getThemeClasses(surfaceTheme);
    const isCollapsed = Boolean(g.isCollapsed);

    const firstCol = columns[0];
    const hasSttCol = Boolean(
      firstCol && (firstCol.isRowNumber || (firstCol.dataType === DATA_TYPES.SYSTEM && Boolean(firstCol.title)))
    );
    const sttKey = firstCol?.key || '';
    const sttWidth = hasSttCol && sttKey ? colWidths[sttKey] || firstCol?.defaultWidth || 44 : 0;

    const pinnedLeftCols = columns.filter(
      (c) => columnPins[c.key] === PIN_POSITIONS.LEFT || c.dataType === DATA_TYPES.SYSTEM || c.isRowNumber || c.isSelection
    );
    const pinnedLeftWidth = pinnedLeftCols.reduce(
      (acc, c) => acc + (colWidths[c.key] || c.defaultWidth),
      0
    );

    const titleStartIdx = hasSttCol ? 1 : 0;
    let titleColSpan = 1;
    let titleWidth = hasSttCol ? pinnedLeftWidth - sttWidth : pinnedLeftWidth;

    if (titleWidth <= 0 || pinnedLeftCols.length <= titleStartIdx) {
      titleWidth = colWidths[columns[titleStartIdx]?.key] || columns[titleStartIdx]?.defaultWidth || 180;
      let accum = titleWidth;
      titleColSpan = 1;
      while (titleStartIdx + titleColSpan < columns.length) {
        const nextCol = columns[titleStartIdx + titleColSpan];
        if (g.groupSums?.[nextCol.key] !== undefined || nextCol.dataType === DATA_TYPES.NUMBER) {
          break;
        }
        if (accum >= 220) {
          break;
        }
        accum += colWidths[nextCol.key] || nextCol.defaultWidth;
        titleColSpan++;
      }
      titleWidth = accum;
    } else {
      titleColSpan = pinnedLeftCols.length - titleStartIdx;
    }

    const groupFlipKey = `group_${g.groupColumnKey || ''}_${g.groupValue ?? g.path ?? rowIndex}`;

    return (
      <div
        data-row-key={groupFlipKey}
        data-row-idx={rowIndex}
        onClick={(e) => {
          e.stopPropagation();
          g.onToggleCollapse?.(g.path);
        }}
        onContextMenu={
          onGroupContextMenu
            ? (e) => {
                e.preventDefault();
                e.stopPropagation();
                onGroupContextMenu(g, e);
              }
            : undefined
        }
        style={{
          height: `${rowHeight}px`,
          width: `${totalRowWidth}px`,
          borderColor: 'var(--agv-border)',
          animationDelay: `${(rowIndex % 20) * 4}ms`,
        }}
        className="agv-group-row agv-row-enter flex items-center cursor-pointer select-none box-border min-h-[32px] max-h-[32px] font-semibold text-xs border-b border-[var(--agv-border)]"
      >
        {columns.map((col, cIdx) => {
          if (hasSttCol && (col.key === sttKey || cIdx === 0)) {
            const isPinned = pinnedLeftWidth > 0;
            return (
              <div
                key="group_stt_cell"
                style={{
                  position: isPinned ? 'sticky' : undefined,
                  left: 0,
                  zIndex: isPinned ? 23 : undefined,
                  width: `${sttWidth}px`,
                  minWidth: `${sttWidth}px`,
                  maxWidth: `${sttWidth}px`,
                  height: `${rowHeight}px`,
                  boxSizing: 'border-box',
                  backgroundColor: 'var(--agv-group-row-bg, var(--agv-bg-card, var(--agv-bg-root)))',
                }}
                className={`flex items-center justify-center font-bold text-xs shrink-0 select-none ${theme.borderBottom} ${theme.borderRight}`}
              >
                <span style={{ color: 'var(--agv-text-muted)' }}>
                  [{g.groupIndexStr || g.groupIndex || 1}]
                </span>
              </div>
            );
          }

          if (cIdx > titleStartIdx && cIdx < titleStartIdx + titleColSpan) {
            return null;
          }

          if (cIdx === titleStartIdx) {
            const isPinned = pinnedLeftWidth > 0;
            const hasDivider = titleWidth + (hasSttCol ? sttWidth : 0) === pinnedLeftWidth;
            const titleLeftPos = hasSttCol ? sttWidth : 0;
            const spannedColKeys = columns
              .slice(titleStartIdx, titleStartIdx + titleColSpan)
              .map((c) => c.key)
              .join(',');
            return (
              <div
                key="group_title_cell"
                data-group-span-keys={spannedColKeys}
                style={{
                  position: isPinned ? 'sticky' : undefined,
                  left: isPinned ? `${titleLeftPos}px` : undefined,
                  zIndex: isPinned ? 22 : undefined,
                  width: `${titleWidth}px`,
                  minWidth: `${titleWidth}px`,
                  maxWidth: `${titleWidth}px`,
                  height: `${rowHeight}px`,
                  boxSizing: 'border-box',
                  backgroundColor: 'var(--agv-group-row-bg, var(--agv-bg-card, var(--agv-bg-root)))',
                }}
                className={`flex items-center px-3 gap-2 truncate shrink-0 ${theme.borderBottom} ${
                  hasDivider ? getPinnedDividerClass(surfaceTheme) : theme.borderRight
                }`}
              >
                <span className="w-4 h-4 flex items-center justify-center shrink-0 select-none rounded transition-colors hover:bg-[var(--agv-bg-item-hover)] text-[var(--agv-accent)]">
                  <Suspense fallback={null}>
                    <LazyRowGroupChevronMorphIcon expanded={!isCollapsed} />
                  </Suspense>
                </span>
                <span className="truncate font-bold text-[var(--agv-accent)]">
                  {g.groupValue || '(Trống)'}
                </span>
                <span className="text-xs font-normal px-2 py-0.5 rounded-full border shrink-0 bg-[var(--agv-bg-root)] border-[var(--agv-border)] text-[var(--agv-text-muted)]">
                  {g.count.toLocaleString('vi-VN')}
                </span>
              </div>
            );
          }

          const width = colWidths[col.key] || col.defaultWidth;
          const pinPos = columnPins[col.key] || PIN_POSITIONS.NONE;
          const isPinnedLeft = pinPos === PIN_POSITIONS.LEFT;
          const isPinnedRight = pinPos === PIN_POSITIONS.RIGHT;
          const isCenterPinned = pinPos === PIN_POSITIONS.CENTER;
          const dock = isCenterPinned
            ? centerDockStatus[col.key] || CENTER_DOCK_STATUSES.NORMAL
            : CENTER_DOCK_STATUSES.NORMAL;

          const isDockedLeft = dock === CENTER_DOCK_STATUSES.LEFT;
          const isDockedRight = dock === CENTER_DOCK_STATUSES.RIGHT;

          const isLeftDivider = col.key === lastEffectiveLeftColKey;
          const isRightDivider = col.key === firstEffectiveRightColKey;

          const stickyStyle: React.CSSProperties = {
            width: `${width}px`,
            minWidth: `${width}px`,
            maxWidth: `${width}px`,
            height: `${rowHeight}px`,
            boxSizing: 'border-box',
            ...(isPinnedLeft
              ? { position: 'sticky', left: `${leftOffsets[col.key]}px`, zIndex: 20 }
              : isDockedLeft
              ? { position: 'sticky', left: `${centerLeftOffsets[col.key]}px`, zIndex: 20 }
              : isPinnedRight
              ? { position: 'sticky', right: `${rightOffsets[col.key]}px`, zIndex: 20 }
              : isDockedRight
              ? { position: 'sticky', right: `${centerRightOffsets[col.key]}px`, zIndex: 20 }
              : {}),
          };

          const borderClasses = `${theme.borderBottom} ${
            isLeftDivider ? getPinnedDividerClass(surfaceTheme) : theme.borderRight
          } ${isRightDivider ? getRightPinnedDividerClass(surfaceTheme) : ''}`;

          const sumVal = g.groupSums?.[col.key];

          return (
            <div
              key={col.key}
              data-col-key={col.key}
              style={{
                ...stickyStyle,
                backgroundColor: 'var(--agv-group-row-bg, var(--agv-bg-card, var(--agv-bg-root)))',
              }}
              className={`flex items-center px-2.5 text-xs tabular-nums shrink-0 truncate ${borderClasses} ${getAlignJustifyClass(
                col.align
              )}`}
            >
              {sumVal !== undefined ? (
                <span className="font-semibold tabular-nums" style={{ color: 'var(--agv-text-main)' }}>
                  {formatGridNumber(sumVal)}
                </span>
              ) : null}
            </div>
          );
        })}
      </div>
    );
}

GridGroupHeaderRowInner.displayName = 'GridGroupHeaderRow';

export const GridGroupHeaderRow = memo(GridGroupHeaderRowInner) as unknown as <T = any>(
  props: GridGroupHeaderRowProps<T>
) => React.ReactElement | null;
