import React, { memo, lazy, Suspense, useMemo } from 'react';
import {
  ColumnDef,
  PinPosition,
  CenterDockStatus,
  SurfaceTheme,
  CellRenderParams,
  GRID_EDIT_MODES,
  GridEditMode,
} from './types';
import { getThemeClasses } from './constants';
import { formatGridDateValue, formatGridNumber } from './gridFormatUtils';
import { buildColRenderMetas, type ColRenderMeta, type GridLayoutSnapshot } from './colRenderMeta';
import type { GridInCellEditorProps } from './editors/GridInCellEditor';
import type { GridGroupHeaderRowProps } from './GridGroupHeaderRow';
import type { GridDetailRowProps } from './GridDetailRow';
import type { RowSpanPlan } from './gridCellSpanEngine';
import { AdvButton } from '../ui/AdvButton';

const LazyRowGroupChevronMorphIcon = lazy(() =>
  import('./GridMorphPrimitives').then((m) => ({ default: m.RowGroupChevronMorphIcon }))
);

const LazyGridInCellEditor = lazy(
  () => import('./editors/GridInCellEditor')
) as unknown as React.LazyExoticComponent<React.ComponentType<GridInCellEditorProps<any>>>;
const LazyGridGroupHeaderRow = lazy(() =>
  import('./GridGroupHeaderRow').then((m) => ({ default: m.GridGroupHeaderRow }))
) as unknown as React.LazyExoticComponent<React.ComponentType<GridGroupHeaderRowProps<any>>>;
const LazyGridDetailRow = lazy(() =>
  import('./GridDetailRow').then((m) => ({ default: m.GridDetailRow }))
) as unknown as React.LazyExoticComponent<React.ComponentType<GridDetailRowProps<any>>>;

export interface GridRowProps<T = any> {
  row: T;
  rowIndex: number;
  rowKey?: string | number;
  columns: ColumnDef<T>[];
  colWidths: Record<string, number>;
  colRenderMetas?: ColRenderMeta<T>[];
  layoutSnapshot?: GridLayoutSnapshot<T>;
  delegatedEvents?: boolean;
  totalRowWidth?: number;
  rowHeight: number;
  isSelected: boolean;
  isChecked: boolean;
  onSelectRow?: (rowIndex: number, row: T) => void;
  onToggleCheck?: (rowIndex: number, row: T, e: React.MouseEvent) => void;
  onCellContextMenu?: (rowIndex: number, row: T, colKey: string, e: React.MouseEvent) => void;
  onGroupContextMenu?: (groupRow: any, e: React.MouseEvent) => void;
  surfaceTheme: SurfaceTheme;
  columnPins: Record<string, PinPosition>;
  leftOffsets: Record<string, number>;
  rightOffsets: Record<string, number>;
  lastEffectiveLeftColKey: string | null;
  firstEffectiveRightColKey: string | null;
  centerDockStatus: Record<string, CenterDockStatus>;
  centerLeftOffsets: Record<string, number>;
  centerRightOffsets: Record<string, number>;
  renderCell?: (params: CellRenderParams<T>) => React.ReactNode;
  editMode?: GridEditMode;
  editingCell?: { rowIndex: number; colKey: string } | null;
  onStartEditCell?: (rowIndex: number, colKey: string) => void;
  onEndEditCell?: () => void;
  onCellChange?: (rowIndex: number, row: T, colKey: string, newValue: any) => void;
  getColumnDateBounds?: (colKey: string) => { min: string; max: string };
  emptyColKeys?: Set<string>;
  dynamicRowHeight?: boolean;
  rowSpanPlan?: RowSpanPlan;
  treeColumnKey?: string;
  treeIndentSize?: number;
  onToggleTreeExpand?: (rowKey: string | number, row: any) => void;
  detailExpandColKey?: string;
  isDetailExpanded?: boolean;
  canExpandDetail?: boolean;
  onToggleRowDetail?: (rowKey: string | number, row: any) => void;
  renderDetailRow?: (row: T) => React.ReactNode;
}

const getRawCellValue = (row: any, col: ColumnDef<any>, rowIndex: number): string => {
  if (col.valueGetter) {
    const val = col.valueGetter(row?._baseRecord ?? row, rowIndex);
    return val !== undefined && val !== null ? String(val) : '';
  }
  if (row?.cells instanceof Map) {
    const c = row.cells.get(col.key);
    return c?.value !== undefined ? String(c.value) : '';
  }
  if (row?.[col.key] !== undefined) {
    return String(row[col.key]);
  }
  return '';
};

export const GridRow = memo(
  <T extends any>({
    row,
    rowIndex,
    rowKey,
    columns,
    colWidths,
    colRenderMetas,
    layoutSnapshot,
    delegatedEvents = false,
    dynamicRowHeight,
    totalRowWidth: passedTotalRowWidth,
    rowHeight,
    isSelected,
    isChecked,
    onSelectRow,
    onToggleCheck,
    surfaceTheme,
    columnPins,
    leftOffsets,
    rightOffsets,
    lastEffectiveLeftColKey,
    firstEffectiveRightColKey,
    centerDockStatus,
    centerLeftOffsets,
    centerRightOffsets,
    renderCell,
    onCellContextMenu,
    onGroupContextMenu,
    editMode = GRID_EDIT_MODES.VIEW,
    editingCell,
    onStartEditCell,
    onEndEditCell,
    onCellChange,
    getColumnDateBounds,
    emptyColKeys,
    rowSpanPlan,
    treeColumnKey,
    treeIndentSize,
    onToggleTreeExpand,
    detailExpandColKey,
    isDetailExpanded,
    canExpandDetail,
    onToggleRowDetail,
    renderDetailRow,
  }: GridRowProps<T>) => {
    const isEven = rowIndex % 2 === 0;
    const isRowActive = isSelected || isChecked;
    const theme = getThemeClasses(surfaceTheme);

    const baseBg = isRowActive
      ? theme.rowSelectedBg
      : isEven
      ? theme.rowEvenBg
      : theme.rowOddBg;

    const fallbackLayout = useMemo(() => {
      if (layoutSnapshot || (colRenderMetas && passedTotalRowWidth !== undefined)) return null;
      return buildColRenderMetas({
        columns,
        colWidths,
        rowHeight,
        surfaceTheme,
        columnPins,
        leftOffsets,
        rightOffsets,
        lastEffectiveLeftColKey,
        firstEffectiveRightColKey,
        centerDockStatus,
        centerLeftOffsets,
        centerRightOffsets,
        emptyColKeys,
      });
    }, [
      layoutSnapshot,
      colRenderMetas,
      passedTotalRowWidth,
      columns,
      colWidths,
      rowHeight,
      surfaceTheme,
      columnPins,
      leftOffsets,
      rightOffsets,
      lastEffectiveLeftColKey,
      firstEffectiveRightColKey,
      centerDockStatus,
      centerLeftOffsets,
      centerRightOffsets,
      emptyColKeys,
    ]);

    const metas = layoutSnapshot ? layoutSnapshot.colRenderMetas : (colRenderMetas || fallbackLayout!.metas);
    const totalRowWidth = layoutSnapshot
      ? layoutSnapshot.totalRowWidth
      : passedTotalRowWidth !== undefined
      ? passedTotalRowWidth
      : fallbackLayout!.totalWidth;
    const isDynamicRowHeight = Boolean(dynamicRowHeight ?? layoutSnapshot?.dynamicRowHeight);
    const rowBoxStyle = layoutSnapshot
      ? layoutSnapshot.rowBoxStyle
      : isDynamicRowHeight
      ? { minHeight: `${rowHeight}px`, width: `${totalRowWidth}px` }
      : { height: `${rowHeight}px`, width: `${totalRowWidth}px` };

    // Xử lý dòng tiêu đề gom nhóm (Group Header Row - lazy-loaded chỉ khi có nhóm)
    if ((row as any)?._isGroupRow) {
      return (
        <Suspense
          fallback={
            <div
              style={{ height: `${rowHeight}px`, width: `${totalRowWidth}px` }}
              className="agv-group-row border-b border-[var(--agv-border)]"
            />
          }
        >
          <LazyGridGroupHeaderRow
            row={row}
            rowIndex={rowIndex}
            columns={columns}
            colWidths={colWidths}
            rowHeight={rowHeight}
            totalRowWidth={totalRowWidth}
            surfaceTheme={surfaceTheme}
            columnPins={columnPins}
            leftOffsets={leftOffsets}
            rightOffsets={rightOffsets}
            lastEffectiveLeftColKey={lastEffectiveLeftColKey}
            firstEffectiveRightColKey={firstEffectiveRightColKey}
            centerDockStatus={centerDockStatus}
            centerLeftOffsets={centerLeftOffsets}
            centerRightOffsets={centerRightOffsets}
            onGroupContextMenu={onGroupContextMenu}
          />
        </Suspense>
      );
    }

    if ((row as any)?._isDetailRow) {
      return (
        <Suspense
          fallback={
            <div
              data-agv-detail-row="true"
              style={{
                width: `var(--agv-total-grid-w, ${totalRowWidth}px)`,
                minHeight: `${Math.max(28, (row as any)?._detailFixedHeight ?? rowHeight)}px`,
                backgroundColor: 'var(--agv-bg-root)',
              }}
              className="agv-detail-row border-b border-[var(--agv-border)] box-border"
            />
          }
        >
          <LazyGridDetailRow
            row={row}
            rowIndex={rowIndex}
            rowKey={rowKey ?? (row as any)?.id ?? rowIndex}
            totalRowWidth={totalRowWidth}
            renderDetailRow={renderDetailRow}
          />
        </Suspense>
      );
    }

    const resolvedFlipKey = String(
      rowKey ?? (row as any)?.originalIndex ?? (row as any)?.id ?? rowIndex
    );

    const findColMetaFromTarget = (target: EventTarget | null): ColRenderMeta<T> | undefined => {
      const cellEl = (target as HTMLElement | null)?.closest?.('[data-col-key]') as HTMLElement | null;
      const colKey = cellEl?.getAttribute('data-col-key');
      if (!colKey) return undefined;
      for (let i = 0; i < metas.length; i++) {
        if (metas[i].key === colKey) return metas[i];
      }
      return undefined;
    };

    const handleRowClick = delegatedEvents
      ? undefined
      : (e: React.MouseEvent) => {
          if (editMode === GRID_EDIT_MODES.SINGLE_CLICK && onStartEditCell) {
            const meta = findColMetaFromTarget(e.target);
            if (meta && !meta.isEmptyCol && meta.editable) {
              if (editingCell?.rowIndex === rowIndex && editingCell?.colKey === meta.key) return;
              e.stopPropagation();
              onSelectRow?.(rowIndex, row);
              onStartEditCell(rowIndex, meta.key);
              return;
            }
          }
          onSelectRow?.(rowIndex, row);
        };

    const handleRowDoubleClick =
      !delegatedEvents && editMode === GRID_EDIT_MODES.DOUBLE_CLICK && onStartEditCell
        ? (e: React.MouseEvent) => {
            const meta = findColMetaFromTarget(e.target);
            if (!meta || meta.isEmptyCol || !meta.editable) return;
            if (editingCell?.rowIndex === rowIndex && editingCell?.colKey === meta.key) return;
            e.stopPropagation();
            onSelectRow?.(rowIndex, row);
            onStartEditCell(rowIndex, meta.key);
          }
        : undefined;

    const handleRowContextMenu =
      !delegatedEvents && onCellContextMenu
        ? (e: React.MouseEvent) => {
            const meta = findColMetaFromTarget(e.target);
            if (!meta) return;
            if (meta.isDisableContextMenu) {
              e.preventDefault();
              e.stopPropagation();
              return;
            }
            e.preventDefault();
            onCellContextMenu(rowIndex, row, meta.key, e);
          }
        : undefined;

    const isSpanRow = Boolean(rowSpanPlan?.hasVerticalSpan || rowSpanPlan?.hasCoveredFromAbove);
    const hasCoveredFromAbove = Boolean(rowSpanPlan?.hasCoveredFromAbove);
    const effectiveRowBoxStyle: React.CSSProperties = hasCoveredFromAbove
      ? { ...rowBoxStyle, backgroundColor: 'transparent', pointerEvents: 'none' }
      : rowBoxStyle;

    return (
      <div
        onClick={handleRowClick}
        onDoubleClick={handleRowDoubleClick}
        onContextMenu={handleRowContextMenu}
        data-agv-row="true"
        data-agv-span-row={isSpanRow ? 'true' : undefined}
        data-row-key={resolvedFlipKey}
        data-row-idx={rowIndex}
        data-row-parity={isEven ? 'even' : 'odd'}
        data-row-focused={isSelected ? 'true' : undefined}
        data-row-checked={isChecked ? 'true' : undefined}
        style={effectiveRowBoxStyle}
        className={`agv-grid-row flex ${isDynamicRowHeight ? 'items-stretch min-h-[32px]' : 'items-center min-h-[32px] max-h-[32px]'} ${hasCoveredFromAbove ? 'bg-transparent' : baseBg} ${theme.defaultTextColor} cursor-default ${onCellContextMenu ? 'select-none' : 'select-text'} box-border`}
      >
        {metas.map((meta, colIdx) => {
          const cellPlan = rowSpanPlan?.cells[colIdx];
          if (cellPlan?.kind === 'omit') {
            return null;
          }
          if (cellPlan?.kind === 'spacer') {
            const spacerStyle: React.CSSProperties = {
              ...meta.stickyStyle,
              width: `${cellPlan.widthPx}px`,
              minWidth: `${cellPlan.widthPx}px`,
              backgroundColor: 'transparent',
              border: 'none',
              pointerEvents: 'none',
            };
            return (
              <div
                key={meta.key}
                data-col-key={meta.key}
                data-span-spacer="true"
                aria-hidden="true"
                style={spacerStyle}
                className="shrink-0 box-border select-none"
              />
            );
          }

          const col = meta.col;
          const isEditing =
            !meta.isEmptyCol &&
            editingCell?.rowIndex === rowIndex &&
            editingCell?.colKey === meta.key;

          let cellContent: React.ReactNode = null;
          if (isEditing) {
            cellContent = (
              <Suspense fallback={null}>
                <LazyGridInCellEditor
                  column={col}
                  row={row}
                  rowIndex={rowIndex}
                  initialValue={getRawCellValue(row, col, rowIndex)}
                  surfaceTheme={surfaceTheme}
                  getColumnDateBounds={getColumnDateBounds}
                  onCellChange={onCellChange}
                  onEndEditCell={onEndEditCell}
                />
              </Suspense>
            );
          } else if (meta.cellRole === 'expand' && !meta.hasCustomCellRender) {
            const detailTargetKey = rowKey ?? (row as any)?.id ?? rowIndex;
            if (canExpandDetail !== false) {
              cellContent = (
                <AdvButton
                  variant="ghost"
                  size="icon-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleRowDetail?.(detailTargetKey, row);
                  }}
                  onDoubleClick={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                  aria-expanded={Boolean(isDetailExpanded)}
                  aria-label={isDetailExpanded ? 'Đóng chi tiết' : 'Mở chi tiết'}
                >
                  <Suspense fallback={null}>
                    <LazyRowGroupChevronMorphIcon expanded={Boolean(isDetailExpanded)} />
                  </Suspense>
                </AdvButton>
              );
            }
          } else if (meta.hasCustomCellRender || (renderCell && meta.cellRole !== 'expand')) {
            const params: CellRenderParams<T> = {
              column: col,
              row,
              rowIndex,
              isSelected,
              isChecked,
            };
            cellContent = meta.hasCustomCellRender ? col.renderCell!(params) : renderCell!(params);
          } else {
            const rowAny = row as any;
            if (col.valueGetter) {
              const v = col.valueGetter(rowAny?._baseRecord ?? rowAny, rowIndex);
              cellContent = v !== undefined && v !== null ? String(v) : '';
            } else if (rowAny?.cells instanceof Map) {
              const cellData = rowAny.cells.get(meta.key);
              cellContent = cellData?.value !== undefined ? String(cellData.value) : '';
            } else if (rowAny?.[meta.key] !== undefined) {
              cellContent = String(rowAny[meta.key]);
            }
            if (meta.isNumber) {
              cellContent = formatGridNumber(cellContent);
            } else if (meta.isTime) {
              const s = String(cellContent || '');
              const m = s.match(/(\d{1,2}):(\d{2})/);
              if (m) {
                cellContent = `${m[1].padStart(2, '0')}:${m[2]}`;
              }
            } else if (meta.isDateLike) {
              cellContent = formatGridDateValue(cellContent, Boolean(col.showTime));
            }
          }

          if (!isEditing && treeColumnKey && meta.key === treeColumnKey) {
            const rowAny = row as any;
            const treeDepth = typeof rowAny?._treeDepth === 'number' ? rowAny._treeDepth : 0;
            const treeHasChildren = Boolean(rowAny?._treeHasChildren);
            const treeExpanded = Boolean(rowAny?._treeExpanded);
            const treeTargetKey = rowAny?._treeKey ?? rowKey ?? rowAny?.id ?? rowIndex;
            const indentPx = Math.max(0, treeDepth * (treeIndentSize ?? 20));
            cellContent = (
              <div className="flex items-center min-w-0 w-full h-full">
                {indentPx > 0 && (
                  <span className="shrink-0" style={{ width: `${indentPx}px` }} aria-hidden="true" />
                )}
                {treeHasChildren ? (
                  <AdvButton
                    variant="ghost"
                    size="icon-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleTreeExpand?.(treeTargetKey, row);
                    }}
                    onDoubleClick={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                    aria-expanded={treeExpanded}
                    aria-label={treeExpanded ? 'Thu gọn nhánh' : 'Mở rộng nhánh'}
                    className="mr-1"
                  >
                    <Suspense fallback={null}>
                      <LazyRowGroupChevronMorphIcon expanded={treeExpanded} />
                    </Suspense>
                  </AdvButton>
                ) : (
                  <span className="w-7 h-7 mr-1 shrink-0 inline-block" aria-hidden="true" />
                )}
                <div className="min-w-0 flex-1 truncate">{cellContent}</div>
              </div>
            );
          }

          if (
            !isEditing &&
            meta.cellRole !== 'expand' &&
            detailExpandColKey &&
            meta.key === detailExpandColKey
          ) {
            const detailTargetKey = rowKey ?? (row as any)?.id ?? rowIndex;
            cellContent = (
              <div className="flex items-center min-w-0 w-full h-full">
                {canExpandDetail !== false ? (
                  <AdvButton
                    variant="ghost"
                    size="icon-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleRowDetail?.(detailTargetKey, row);
                    }}
                    onDoubleClick={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                    aria-expanded={Boolean(isDetailExpanded)}
                    aria-label={isDetailExpanded ? 'Đóng chi tiết' : 'Mở chi tiết'}
                    className="mr-1"
                  >
                    <Suspense fallback={null}>
                      <LazyRowGroupChevronMorphIcon expanded={Boolean(isDetailExpanded)} />
                    </Suspense>
                  </AdvButton>
                ) : (
                  <span className="w-7 h-7 mr-1 shrink-0 inline-block" aria-hidden="true" />
                )}
                <div className="min-w-0 flex-1 truncate">{cellContent}</div>
              </div>
            );
          }

          let cellClassName = isEditing
            ? meta.classNameEditing
            : isRowActive
            ? meta.classNameSelected
            : isEven
            ? meta.classNameEven
            : meta.classNameOdd;

          if (cellPlan?.kind === 'anchor') {
            const isPinnedSticky = meta.stickyStyle.position === 'sticky';
            const endMeta = metas[colIdx + cellPlan.colSpan - 1];
            const resolvedRight =
              meta.stickyStyle.right !== undefined && endMeta?.stickyStyle.right !== undefined
                ? endMeta.stickyStyle.right
                : meta.stickyStyle.right;
            const anchorBorderCls = cellPlan.hasRightPinnedDivider
              ? ' border-r-2 border-r-[var(--agv-border)]'
              : '';

            if (cellPlan.rowSpan > 1) {
              const spanHeightPx =
                cellPlan.heightPx ?? Math.max(rowHeight, cellPlan.rowSpan * rowHeight);
              const outerStyle: React.CSSProperties = {
                width: `${cellPlan.widthPx}px`,
                minWidth: `${cellPlan.widthPx}px`,
                ...(isDynamicRowHeight ? { minHeight: `${rowHeight}px` } : { height: `${rowHeight}px` }),
                position: isPinnedSticky ? 'sticky' : 'relative',
                ...(isPinnedSticky && meta.stickyStyle.left !== undefined
                  ? { left: meta.stickyStyle.left }
                  : {}),
                ...(isPinnedSticky && resolvedRight !== undefined ? { right: resolvedRight } : {}),
                zIndex: isPinnedSticky ? 21 : 2,
                overflow: 'visible',
                backgroundColor: 'transparent',
                border: 'none',
                pointerEvents: hasCoveredFromAbove ? 'auto' : undefined,
              };
              const innerStyle: React.CSSProperties = {
                position: 'absolute',
                top: 0,
                left: 0,
                width: `${cellPlan.widthPx}px`,
                minWidth: `${cellPlan.widthPx}px`,
                height: `${spanHeightPx}px`,
                minHeight: `${spanHeightPx}px`,
                maxHeight: `${spanHeightPx}px`,
                lineHeight: 'normal',
                pointerEvents: 'auto',
              };
              return (
                <div
                  key={meta.key}
                  data-col-key={meta.key}
                  data-cell-role={meta.isEmptyCol ? undefined : meta.cellRole}
                  data-row-span={cellPlan.rowSpan}
                  data-col-span={cellPlan.colSpan > 1 ? cellPlan.colSpan : undefined}
                  style={outerStyle}
                  className="shrink-0 box-border"
                >
                  <div
                    data-span-anchor-inner="true"
                    style={innerStyle}
                    className={`${cellClassName}${anchorBorderCls}`}
                  >
                    {cellContent}
                  </div>
                </div>
              );
            }

            const horizStyle: React.CSSProperties = {
              ...meta.stickyStyle,
              ...(resolvedRight !== undefined ? { right: resolvedRight } : {}),
              width: `${cellPlan.widthPx}px`,
              minWidth: `${cellPlan.widthPx}px`,
              ...(hasCoveredFromAbove ? { pointerEvents: 'auto' } : {}),
            };
            return (
              <div
                key={meta.key}
                data-col-key={meta.key}
                data-cell-role={meta.isEmptyCol ? undefined : meta.cellRole}
                data-col-span={cellPlan.colSpan}
                style={horizStyle}
                className={`${cellClassName}${anchorBorderCls}`}
              >
                {cellContent}
              </div>
            );
          }

          const finalCellStyle: React.CSSProperties = hasCoveredFromAbove
            ? { ...meta.stickyStyle, pointerEvents: 'auto' }
            : meta.stickyStyle;

          return (
            <div
              key={meta.key}
              data-col-key={meta.key}
              data-cell-role={meta.isEmptyCol ? undefined : meta.cellRole}
              style={finalCellStyle}
              className={cellClassName}
            >
              {cellContent}
            </div>
          );
        })}
      </div>
    );
  },
  (prev, next) => {
    const prevEditingInRow = prev.editingCell?.rowIndex === prev.rowIndex;
    const nextEditingInRow = next.editingCell?.rowIndex === next.rowIndex;
    if (prevEditingInRow || nextEditingInRow) {
      if (prev.editingCell?.colKey !== next.editingCell?.colKey) return false;
      if (prev.editingCell?.rowIndex !== next.editingCell?.rowIndex) return false;
    }
    if (prev.editMode !== next.editMode) return false;
    if (prev.delegatedEvents !== next.delegatedEvents) return false;

    if (
      prev.row !== next.row ||
      prev.rowIndex !== next.rowIndex ||
      prev.isSelected !== next.isSelected ||
      prev.isChecked !== next.isChecked ||
      prev.renderCell !== next.renderCell ||
      prev.onGroupContextMenu !== next.onGroupContextMenu ||
      prev.rowSpanPlan !== next.rowSpanPlan ||
      prev.treeColumnKey !== next.treeColumnKey ||
      prev.treeIndentSize !== next.treeIndentSize ||
      prev.onToggleTreeExpand !== next.onToggleTreeExpand ||
      prev.detailExpandColKey !== next.detailExpandColKey ||
      prev.isDetailExpanded !== next.isDetailExpanded ||
      prev.canExpandDetail !== next.canExpandDetail ||
      prev.onToggleRowDetail !== next.onToggleRowDetail ||
      prev.renderDetailRow !== next.renderDetailRow
    ) {
      return false;
    }

    if (prev.layoutSnapshot || next.layoutSnapshot) {
      if (prev.layoutSnapshot !== next.layoutSnapshot) return false;
      if (next.delegatedEvents) return true;
      return (
        prev.onStartEditCell === next.onStartEditCell &&
        prev.onCellContextMenu === next.onCellContextMenu
      );
    }

    return (
      prev.rowHeight === next.rowHeight &&
      prev.surfaceTheme === next.surfaceTheme &&
      prev.colRenderMetas === next.colRenderMetas &&
      prev.totalRowWidth === next.totalRowWidth &&
      prev.colWidths === next.colWidths &&
      prev.columns === next.columns &&
      prev.columnPins === next.columnPins &&
      prev.leftOffsets === next.leftOffsets &&
      prev.rightOffsets === next.rightOffsets &&
      prev.lastEffectiveLeftColKey === next.lastEffectiveLeftColKey &&
      prev.firstEffectiveRightColKey === next.firstEffectiveRightColKey &&
      prev.centerDockStatus === next.centerDockStatus &&
      prev.centerLeftOffsets === next.centerLeftOffsets &&
      prev.centerRightOffsets === next.centerRightOffsets &&
      prev.onStartEditCell === next.onStartEditCell &&
      prev.emptyColKeys === next.emptyColKeys &&
      prev.onCellContextMenu === next.onCellContextMenu
    );
  }
) as <T = any>(props: GridRowProps<T>) => React.ReactElement | null;
