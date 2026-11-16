import React, { memo, lazy, Suspense, useLayoutEffect, useRef } from 'react';
import {
  ColumnDef,
  PinPosition,
  CenterDockStatus,
  SurfaceTheme,
  CellRenderParams,
  GridEditMode,
} from './types';
import { getThemeClasses } from './constants';
import { GridRow } from './GridRow';
import type { GridLayoutSnapshot } from './colRenderMeta';
import type { RowSpanPlan } from './gridCellSpanEngine';
import type { ResponsiveChunkRowProps } from './responsive/ResponsiveChunkRow';
import type { CompiledPhoneCard, CompiledTabletGroup } from './responsive/responsiveColumnUtils';

const LazyResponsiveChunkRow = lazy(
  () => import('./responsive/ResponsiveChunkRow')
) as unknown as React.LazyExoticComponent<React.ComponentType<ResponsiveChunkRowProps<any>>>;

export interface GridVirtualRowSlotProps<T = any> {
  row: T;
  rowIndex: number;
  rowKey: string | number;
  rowTop: number;
  rowHeight: number;
  slotHeight: number;
  dynamicRowHeight: boolean;
  columns: ColumnDef<T>[];
  colWidths: Record<string, number>;
  layoutSnapshot: GridLayoutSnapshot<T>;
  totalGridWidth: number;
  isSelected: boolean;
  isChecked: boolean;
  isCardExpanded: boolean;
  showRowNumber: boolean;
  showSelectionCol: boolean;
  onToggleExpandPhoneCard?: (rowKey: string | number, rowIndex: number) => void;
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
  renderCell?: (params: CellRenderParams<T>) => React.ReactNode;
  editMode?: GridEditMode;
  rowEditingCell: { rowIndex: number; colKey: string } | null;
  onStartEditCell?: (rowIndex: number, colKey: string) => void;
  onEndEditCell?: () => void;
  onCellChange?: (rowIndex: number, row: T, colKey: string, newValue: any) => void;
  getColumnDateBounds?: (colKey: string) => { min: string; max: string };
  emptyColKeys?: Set<string>;
  activeMode?: 'pc' | 'tablet' | 'phone';
  tabletTrackMinWidth: number;
  compiledTabletGroups?: CompiledTabletGroup<T>[];
  compiledPhoneCard?: CompiledPhoneCard<T>;
  delegatedEvents?: boolean;
  observeRowSlot?: (el: HTMLElement, rowKey: string | number, rowIndex: number) => void;
  unobserveRowSlot?: (el: HTMLElement) => void;
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

const GridVirtualRowSlotInner = <T extends any>({
  row,
  rowIndex,
  rowKey,
  rowTop,
  rowHeight,
  slotHeight,
  dynamicRowHeight,
  columns,
  colWidths,
  layoutSnapshot,
  totalGridWidth,
  isSelected,
  isChecked,
  isCardExpanded,
  showRowNumber,
  showSelectionCol,
  onToggleExpandPhoneCard,
  onSelectRow,
  onRowDetail,
  onToggleCheck,
  onCellContextMenu,
  onGroupContextMenu,
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
  renderCell,
  editMode,
  rowEditingCell,
  onStartEditCell,
  onEndEditCell,
  onCellChange,
  getColumnDateBounds,
  emptyColKeys,
  activeMode = 'pc',
  tabletTrackMinWidth,
  compiledTabletGroups,
  compiledPhoneCard,
  delegatedEvents = false,
  observeRowSlot,
  unobserveRowSlot,
  rowSpanPlan,
  treeColumnKey,
  treeIndentSize,
  onToggleTreeExpand,
  detailExpandColKey,
  isDetailExpanded,
  canExpandDetail,
  onToggleRowDetail,
  renderDetailRow,
}: GridVirtualRowSlotProps<T>) => {
  const slotRef = useRef<HTMLDivElement | null>(null);
  const isResponsiveCard = activeMode === 'tablet' || activeMode === 'phone';
  const theme = getThemeClasses(surfaceTheme);
  const isDetailRow = Boolean((row as any)?._isDetailRow);
  const isDetailFixed = Boolean(
    isDetailRow &&
      typeof (row as any)?._detailFixedHeight === 'number' &&
      Number.isFinite((row as any)._detailFixedHeight)
  );
  const isSlotAutoHeight = Boolean(dynamicRowHeight || (isDetailRow && !isDetailFixed));
  const isSpanRow = Boolean(rowSpanPlan?.hasVerticalSpan || rowSpanPlan?.hasCoveredFromAbove);
  const hasCoveredFromAbove = Boolean(rowSpanPlan?.hasCoveredFromAbove);

  // Đăng ký & đồng bộ ResizeObserver khi bật dòng cao động (zero-work ở chế độ chiều cao cố định)
  useLayoutEffect(() => {
    const el = slotRef.current;
    if (!el || !observeRowSlot) return;
    observeRowSlot(el, rowKey, rowIndex);
  }, [observeRowSlot, rowKey, rowIndex, row, colWidths, layoutSnapshot, dynamicRowHeight]);

  useLayoutEffect(() => {
    const el = slotRef.current;
    if (!el || !unobserveRowSlot) return;
    return () => {
      unobserveRowSlot(el);
    };
  }, [unobserveRowSlot]);

  return (
    <div
      ref={slotRef}
      data-agv-fullwidth={isResponsiveCard ? undefined : 'true'}
      data-row-slot-idx={rowIndex}
      style={{
        position: 'absolute',
        top: isSpanRow ? `${Math.round(rowTop)}px` : 0,
        left: 0,
        width: isResponsiveCard ? '100%' : `var(--agv-total-grid-w, ${totalGridWidth}px)`,
        minWidth: isResponsiveCard
          ? tabletTrackMinWidth > 0
            ? `${tabletTrackMinWidth}px`
            : '100%'
          : `var(--agv-total-grid-w, ${totalGridWidth}px)`,
        ...(isSlotAutoHeight
          ? { minHeight: `${rowHeight}px` }
          : { height: `${slotHeight}px` }),
        ...(isSpanRow
          ? {}
          : {
              transform: `translate3d(0px, ${Math.round(rowTop)}px, 0px)`,
              willChange: antiGhostMode ? 'transform' : undefined,
              backfaceVisibility: antiGhostMode ? 'hidden' : undefined,
            }),
        ...(hasCoveredFromAbove ? { pointerEvents: 'none' as const } : {}),
        contain: isSpanRow
          ? 'style'
          : antiGhostMode
          ? isSlotAutoHeight
            ? 'layout style'
            : isResponsiveCard
            ? 'layout paint'
            : 'strict'
          : undefined,
      }}
      className={`agv-chunk-block agv-row-slot ${hasCoveredFromAbove ? 'bg-transparent' : theme.chunkBg}`}
    >
      {isResponsiveCard ? (
        <Suspense fallback={null}>
          <LazyResponsiveChunkRow
            activeMode={activeMode}
            row={row}
            rowIndex={rowIndex}
            rowKey={rowKey}
            columns={columns}
            compiledTabletGroups={compiledTabletGroups}
            compiledPhoneCard={compiledPhoneCard}
            rowHeight={rowHeight}
            isSelected={isSelected}
            isChecked={isChecked}
            isExpanded={isCardExpanded}
            showRowNumber={showRowNumber}
            showSelectionCol={showSelectionCol}
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
      ) : (
        <GridRow
          rowKey={rowKey}
          row={row}
          rowIndex={rowIndex}
          columns={columns}
          colWidths={colWidths}
          colRenderMetas={layoutSnapshot.colRenderMetas}
          layoutSnapshot={layoutSnapshot}
          delegatedEvents={delegatedEvents}
          dynamicRowHeight={dynamicRowHeight}
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
          editingCell={rowEditingCell}
          onStartEditCell={onStartEditCell}
          onEndEditCell={onEndEditCell}
          onCellChange={onCellChange}
          getColumnDateBounds={getColumnDateBounds}
          emptyColKeys={emptyColKeys}
          rowSpanPlan={rowSpanPlan}
          treeColumnKey={treeColumnKey}
          treeIndentSize={treeIndentSize}
          onToggleTreeExpand={onToggleTreeExpand}
          detailExpandColKey={detailExpandColKey}
          isDetailExpanded={isDetailExpanded}
          canExpandDetail={canExpandDetail}
          onToggleRowDetail={onToggleRowDetail}
          renderDetailRow={renderDetailRow}
        />
      )}
    </div>
  );
};

export const GridVirtualRowSlot = memo(
  GridVirtualRowSlotInner,
  (prev, next) =>
    prev.row === next.row &&
    prev.rowIndex === next.rowIndex &&
    prev.rowKey === next.rowKey &&
    prev.rowTop === next.rowTop &&
    prev.rowHeight === next.rowHeight &&
    prev.slotHeight === next.slotHeight &&
    prev.dynamicRowHeight === next.dynamicRowHeight &&
    prev.layoutSnapshot === next.layoutSnapshot &&
    prev.totalGridWidth === next.totalGridWidth &&
    prev.isSelected === next.isSelected &&
    prev.isChecked === next.isChecked &&
    prev.isCardExpanded === next.isCardExpanded &&
    prev.showRowNumber === next.showRowNumber &&
    prev.showSelectionCol === next.showSelectionCol &&
    prev.surfaceTheme === next.surfaceTheme &&
    prev.activeMode === next.activeMode &&
    prev.tabletTrackMinWidth === next.tabletTrackMinWidth &&
    prev.compiledTabletGroups === next.compiledTabletGroups &&
    prev.compiledPhoneCard === next.compiledPhoneCard &&
    prev.delegatedEvents === next.delegatedEvents &&
    prev.editMode === next.editMode &&
    prev.rowEditingCell?.colKey === next.rowEditingCell?.colKey &&
    prev.renderCell === next.renderCell &&
    prev.onSelectRow === next.onSelectRow &&
    prev.onRowDetail === next.onRowDetail &&
    prev.onToggleCheck === next.onToggleCheck &&
    prev.onToggleExpandPhoneCard === next.onToggleExpandPhoneCard &&
    prev.onCellContextMenu === next.onCellContextMenu &&
    prev.onGroupContextMenu === next.onGroupContextMenu &&
    prev.observeRowSlot === next.observeRowSlot &&
    prev.unobserveRowSlot === next.unobserveRowSlot &&
    prev.rowSpanPlan === next.rowSpanPlan &&
    prev.treeColumnKey === next.treeColumnKey &&
    prev.treeIndentSize === next.treeIndentSize &&
    prev.onToggleTreeExpand === next.onToggleTreeExpand &&
    prev.detailExpandColKey === next.detailExpandColKey &&
    prev.isDetailExpanded === next.isDetailExpanded &&
    prev.canExpandDetail === next.canExpandDetail &&
    prev.onToggleRowDetail === next.onToggleRowDetail &&
    prev.renderDetailRow === next.renderDetailRow
) as <T = any>(props: GridVirtualRowSlotProps<T>) => React.ReactElement | null;
