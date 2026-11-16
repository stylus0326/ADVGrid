import React, { memo, lazy, Suspense, useMemo } from 'react';
import {
  ColumnDef,
  PinPosition,
  DATA_TYPES,
  CenterDockStatus,
  SurfaceTheme,
  CellRenderParams,
  GridEditMode,
} from './types';
import { getThemeClasses } from './constants';
import { GridRow } from './GridRow';
import { buildColRenderMetas, type GridLayoutSnapshot } from './colRenderMeta';
import type { ResponsiveChunkRowProps } from './responsive/ResponsiveChunkRow';
import {
  computeTabletTrackMinWidth,
  type CompiledPhoneCard,
  type CompiledTabletGroup,
} from './responsive/responsiveColumnUtils';

const LazyResponsiveChunkRow = lazy(
  () => import('./responsive/ResponsiveChunkRow')
) as unknown as React.LazyExoticComponent<React.ComponentType<ResponsiveChunkRowProps<any>>>;

export interface GridChunkBlockProps<T = any> {
  chunkIndex: number;
  rows: T[];
  startRowIndex: number;
  columns: ColumnDef<T>[];
  colWidths: Record<string, number>;
  layoutSnapshot?: GridLayoutSnapshot<T>;
  delegatedEvents?: boolean;
  rowHeight: number;
  chunkSize: number;
  topOffset?: number;
  chunkHeight?: number;
  phoneExpandedRows?: Map<string | number, number>;
  onToggleExpandPhoneCard?: (rowKey: string | number, rowIndex: number) => void;
  showRowNumber?: boolean;
  showSelectionCol?: boolean;
  selectedRowIndex: number | null;
  selectedRowKey?: string | number | null;
  checkedRowIndices?: Set<number | string>;
  onSelectRow?: (rowIndex: number, row: T) => void;
  onRowDetail?: (row: T, rowIndex: number) => void;
  onToggleCheck?: (rowIndex: number, row: T, e: React.MouseEvent) => void;
  onCellContextMenu?: (rowIndex: number, row: T, colKey: string, e: React.MouseEvent) => void;
  onGroupContextMenu?: (groupRow: any, e: React.MouseEvent) => void;
  antiGhostMode?: boolean;
  surfaceTheme: SurfaceTheme;
  columnPins: Record<string, PinPosition>;
  leftOffsets: Record<string, number>;
  rightOffsets: Record<string, number>;
  lastEffectiveLeftColKey: string | null;
  firstEffectiveRightColKey: string | null;
  centerDockStatus: Record<string, CenterDockStatus>;
  centerLeftOffsets: Record<string, number>;
  centerRightOffsets: Record<string, number>;
  getRowId?: (row: T, index: number) => string | number;
  renderCell?: (params: CellRenderParams<T>) => React.ReactNode;
  editMode?: GridEditMode;
  editingCell?: { rowIndex: number; colKey: string } | null;
  onStartEditCell?: (rowIndex: number, colKey: string) => void;
  onEndEditCell?: () => void;
  onCellChange?: (rowIndex: number, row: T, colKey: string, newValue: any) => void;
  getColumnDateBounds?: (colKey: string) => { min: string; max: string };
  emptyColKeys?: Set<string>;
  activeMode?: 'pc' | 'tablet' | 'phone';
  compiledTabletGroups?: CompiledTabletGroup<T>[];
  compiledPhoneCard?: CompiledPhoneCard<T>;
}

export const GridChunkBlock = memo(
  <T extends any>({
    chunkIndex,
    rows,
    startRowIndex,
    columns,
    colWidths,
    layoutSnapshot,
    delegatedEvents = false,
    rowHeight,
    chunkSize,
    topOffset,
    chunkHeight,
    phoneExpandedRows,
    onToggleExpandPhoneCard,
    showRowNumber,
    showSelectionCol,
    selectedRowIndex,
    selectedRowKey,
    checkedRowIndices,
    onSelectRow,
    onRowDetail,
    onToggleCheck,
    antiGhostMode = true,
    surfaceTheme,
    columnPins,
    leftOffsets,
    rightOffsets,
    lastEffectiveLeftColKey,
    firstEffectiveRightColKey,
    centerDockStatus,
    centerLeftOffsets,
    centerRightOffsets,
    getRowId,
    renderCell,
    onCellContextMenu,
    onGroupContextMenu,
    editMode,
    editingCell,
    onStartEditCell,
    onEndEditCell,
    onCellChange,
    getColumnDateBounds,
    emptyColKeys,
    activeMode = 'pc',
    compiledTabletGroups,
    compiledPhoneCard,
  }: GridChunkBlockProps<T>) => {
    const isResponsiveCard = activeMode === 'tablet' || activeMode === 'phone';
    const effectiveChunkHeight = chunkHeight !== undefined ? chunkHeight : rows.length * rowHeight;
    const effectiveTopOffset = topOffset !== undefined ? topOffset : Math.round(chunkIndex * chunkSize * rowHeight);
    const theme = getThemeClasses(surfaceTheme);

    const fallbackMetaResult = useMemo(
      () =>
        layoutSnapshot
          ? null
          : buildColRenderMetas({
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
            }),
      [
        layoutSnapshot,
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
      ]
    );

    const colRenderMetas = layoutSnapshot
      ? layoutSnapshot.colRenderMetas
      : fallbackMetaResult!.metas;
    const totalGridWidth = layoutSnapshot
      ? layoutSnapshot.totalRowWidth
      : fallbackMetaResult!.totalWidth;

    const chkCol = columns.find((c) => c.isSelection || (c.dataType === DATA_TYPES.SYSTEM && !c.title));
    const chkColKey = chkCol?.key;
    const effectiveShowSelectionCol = showSelectionCol !== undefined ? showSelectionCol : Boolean(chkCol);

    const isRowNumberCol = (col: ColumnDef<any> | undefined | null) =>
      Boolean(col?.isRowNumber || col?.key === 'col_stt' || (col?.dataType === DATA_TYPES.SYSTEM && Boolean(col?.title)));
    const hasRowNumberCol = columns.some(isRowNumberCol);
    const effectiveShowRowNumber = showRowNumber !== undefined ? showRowNumber : hasRowNumberCol;

    const tabletTrackMinWidth =
      activeMode === 'tablet' && compiledTabletGroups && compiledTabletGroups.length > 0
        ? computeTabletTrackMinWidth(
            compiledTabletGroups,
            effectiveShowRowNumber,
            effectiveShowSelectionCol
          )
        : 0;

    return (
      <div
        data-agv-fullwidth={isResponsiveCard ? undefined : "true"}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: isResponsiveCard ? '100%' : `var(--agv-total-grid-w, ${totalGridWidth}px)`,
          minWidth: isResponsiveCard
            ? tabletTrackMinWidth > 0
              ? `${tabletTrackMinWidth}px`
              : '100%'
            : `var(--agv-total-grid-w, ${totalGridWidth}px)`,
          height: `${effectiveChunkHeight}px`,
          transform: `translate3d(0px, ${effectiveTopOffset}px, 0px)`,
          willChange: antiGhostMode ? 'transform' : undefined,
          backfaceVisibility: antiGhostMode ? 'hidden' : undefined,
          contain: antiGhostMode ? (isResponsiveCard ? 'layout paint' : 'strict') : undefined,
        }}
        className={`agv-chunk-block ${theme.chunkBg}`}
      >
        {rows.map((row, localIdx) => {
          const actualRowIndex = startRowIndex + localIdx;
          const rowKey = getRowId
            ? getRowId(row, actualRowIndex)
            : (row as any)?.originalIndex ?? (row as any)?.id ?? actualRowIndex;

          const isSelected =
            selectedRowKey !== undefined && selectedRowKey !== null
              ? selectedRowKey === rowKey || (selectedRowIndex !== null && selectedRowIndex === actualRowIndex)
              : selectedRowIndex !== null && selectedRowIndex === actualRowIndex;

          const isChecked = checkedRowIndices
            ? checkedRowIndices.has(rowKey as any) ||
              ((row as any)?.originalIndex !== undefined &&
                checkedRowIndices.has((row as any).originalIndex))
            : (Boolean(chkColKey) && (row as any)?.cells?.get?.(chkColKey!)?.value === true) ||
              (Boolean(chkColKey) && (row as any)?.[chkColKey!] === true) ||
              (row as any)?.isChecked === true;

          const key = rowKey;

          if (activeMode === 'tablet' || activeMode === 'phone') {
            const isCardExpanded = activeMode === 'phone' ? Boolean(phoneExpandedRows?.has(rowKey)) : false;
            return (
              <Suspense key={key} fallback={null}>
                <LazyResponsiveChunkRow
                  activeMode={activeMode}
                  row={row}
                  rowIndex={actualRowIndex}
                  rowKey={rowKey}
                  columns={columns}
                  compiledTabletGroups={compiledTabletGroups}
                  compiledPhoneCard={compiledPhoneCard}
                  rowHeight={rowHeight}
                  isSelected={isSelected}
                  isChecked={isChecked}
                  isExpanded={isCardExpanded}
                  showRowNumber={effectiveShowRowNumber}
                  showSelectionCol={effectiveShowSelectionCol}
                  onToggleExpand={onToggleExpandPhoneCard}
                  onSelectRow={onSelectRow}
                  onRowDetail={onRowDetail}
                  onToggleCheck={onToggleCheck}
                  onCellContextMenu={onCellContextMenu}
                  surfaceTheme={surfaceTheme}
                  renderCell={renderCell}
                  allowTextSelection={!onCellContextMenu}
                />
              </Suspense>
            );
          }

          return (
            <GridRow
              key={key}
              rowKey={rowKey}
              row={row}
              rowIndex={actualRowIndex}
              columns={columns}
              colWidths={colWidths}
              colRenderMetas={colRenderMetas}
              layoutSnapshot={layoutSnapshot}
              delegatedEvents={delegatedEvents}
              totalRowWidth={totalGridWidth}
              rowHeight={rowHeight}
              isSelected={isSelected}
              isChecked={isChecked}
              onSelectRow={onSelectRow}
              onToggleCheck={onToggleCheck}
              surfaceTheme={surfaceTheme}
              columnPins={columnPins}
              leftOffsets={leftOffsets}
              rightOffsets={rightOffsets}
              lastEffectiveLeftColKey={lastEffectiveLeftColKey}
              firstEffectiveRightColKey={firstEffectiveRightColKey}
              centerDockStatus={centerDockStatus}
              centerLeftOffsets={centerLeftOffsets}
              centerRightOffsets={centerRightOffsets}
              renderCell={renderCell}
              onCellContextMenu={onCellContextMenu}
              onGroupContextMenu={onGroupContextMenu}
              editMode={editMode}
              editingCell={editingCell}
              onStartEditCell={onStartEditCell}
              onEndEditCell={onEndEditCell}
              onCellChange={onCellChange}
              getColumnDateBounds={getColumnDateBounds}
              emptyColKeys={emptyColKeys}
            />
          );
        })}
      </div>
    );
  },
  (prev, next) => {
    if (prev.delegatedEvents !== next.delegatedEvents) return false;
    if (prev.compiledTabletGroups !== next.compiledTabletGroups) return false;
    if (
      prev.activeMode === 'tablet' ||
      prev.activeMode === 'phone' ||
      next.activeMode === 'tablet' ||
      next.activeMode === 'phone'
    ) {
      if (prev.columns !== next.columns) return false;
    }
    if (prev.layoutSnapshot || next.layoutSnapshot) {
      if (prev.layoutSnapshot !== next.layoutSnapshot) return false;
    } else {
      if (prev.columns !== next.columns) return false;
      if (prev.columnPins !== next.columnPins) return false;
      if (prev.leftOffsets !== next.leftOffsets) return false;
      if (prev.rightOffsets !== next.rightOffsets) return false;
      if (prev.lastEffectiveLeftColKey !== next.lastEffectiveLeftColKey) return false;
      if (prev.firstEffectiveRightColKey !== next.firstEffectiveRightColKey) return false;
      if (prev.centerDockStatus !== next.centerDockStatus) return false;
      if (prev.centerLeftOffsets !== next.centerLeftOffsets) return false;
      if (prev.centerRightOffsets !== next.centerRightOffsets) return false;
      if (prev.emptyColKeys !== next.emptyColKeys) return false;
      if (prev.surfaceTheme !== next.surfaceTheme) return false;
      if (prev.colWidths !== next.colWidths) return false;
      if (prev.rowHeight !== next.rowHeight) return false;
    }
    if (prev.rows !== next.rows) return false;
    if (prev.showRowNumber !== next.showRowNumber) return false;
    if (prev.showSelectionCol !== next.showSelectionCol) return false;
    if (prev.topOffset !== next.topOffset) return false;
    if (prev.chunkHeight !== next.chunkHeight) return false;
    if (prev.activeMode === 'phone' || next.activeMode === 'phone') {
      if (prev.phoneExpandedRows !== next.phoneExpandedRows) {
        const start = next.startRowIndex;
        for (let i = 0; i < next.rows.length; i++) {
          const r = next.rows[i] as any;
          const actualIdx = start + i;
          const rKey = next.getRowId
            ? next.getRowId(r, actualIdx)
            : r?.originalIndex ?? r?.id ?? actualIdx;
          const wasExp = Boolean(prev.phoneExpandedRows?.has(rKey));
          const nowExp = Boolean(next.phoneExpandedRows?.has(rKey));
          if (wasExp !== nowExp) return false;
        }
      }
    }
    if (prev.checkedRowIndices !== next.checkedRowIndices) {
      if (!prev.checkedRowIndices || !next.checkedRowIndices) return false;
      const start = next.startRowIndex;
      let chunkCheckChanged = false;
      for (let i = 0; i < next.rows.length; i++) {
        const r = next.rows[i] as any;
        const actualIdx = start + i;
        const rKey = next.getRowId
          ? next.getRowId(r, actualIdx)
          : r?.originalIndex ?? r?.id ?? actualIdx;
        const origIdx = r?.originalIndex;
        const wasChecked =
          prev.checkedRowIndices.has(rKey as any) ||
          (origIdx !== undefined && prev.checkedRowIndices.has(origIdx));
        const nowChecked =
          next.checkedRowIndices.has(rKey as any) ||
          (origIdx !== undefined && next.checkedRowIndices.has(origIdx));
        if (wasChecked !== nowChecked) {
          chunkCheckChanged = true;
          break;
        }
      }
      if (chunkCheckChanged) return false;
    }
    if (
      prev.selectedRowKey !== next.selectedRowKey ||
      prev.selectedRowIndex !== next.selectedRowIndex
    ) {
      const start = next.startRowIndex;
      const end = start + next.rows.length - 1;
      const prevIdxInChunk =
        prev.selectedRowIndex !== null &&
        prev.selectedRowIndex !== undefined &&
        prev.selectedRowIndex >= start &&
        prev.selectedRowIndex <= end;
      const nextIdxInChunk =
        next.selectedRowIndex !== null &&
        next.selectedRowIndex !== undefined &&
        next.selectedRowIndex >= start &&
        next.selectedRowIndex <= end;

      if (prevIdxInChunk || nextIdxInChunk) return false;

      if (prev.selectedRowKey !== next.selectedRowKey) {
        for (let i = 0; i < next.rows.length; i++) {
          const r = next.rows[i] as any;
          const actualIdx = start + i;
          const rKey = next.getRowId
            ? next.getRowId(r, actualIdx)
            : r?.originalIndex ?? r?.id ?? actualIdx;
          if (rKey === prev.selectedRowKey || rKey === next.selectedRowKey) {
            return false;
          }
        }
      }
    }
    if (prev.editMode !== next.editMode) return false;
    if (prev.editingCell !== next.editingCell) {
      const start = next.startRowIndex;
      const end = start + next.rows.length - 1;
      const prevEditInChunk =
        prev.editingCell !== null &&
        prev.editingCell !== undefined &&
        prev.editingCell.rowIndex >= start &&
        prev.editingCell.rowIndex <= end;
      const nextEditInChunk =
        next.editingCell !== null &&
        next.editingCell !== undefined &&
        next.editingCell.rowIndex >= start &&
        next.editingCell.rowIndex <= end;
      if (prevEditInChunk || nextEditInChunk) return false;
    }
    if (prev.renderCell !== next.renderCell) return false;
    if (!next.delegatedEvents) {
      if (prev.onCellContextMenu !== next.onCellContextMenu) return false;
    }
    if (prev.onGroupContextMenu !== next.onGroupContextMenu) return false;

    return (
      prev.chunkIndex === next.chunkIndex &&
      prev.chunkSize === next.chunkSize &&
      prev.antiGhostMode === next.antiGhostMode &&
      prev.rows === next.rows &&
      prev.activeMode === next.activeMode &&
      prev.showRowNumber === next.showRowNumber &&
      prev.showSelectionCol === next.showSelectionCol
    );
  }
) as <T = any>(props: GridChunkBlockProps<T>) => React.ReactElement | null;
