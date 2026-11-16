import React from 'react';
import '../phoneCard.css';
import { CellRenderParams, ColumnDef, SurfaceTheme } from '../types';
import { GridTabletRow } from './GridTabletRow';
import { GridPhoneCard } from './GridPhoneCard';
import type { CompiledPhoneCard, CompiledTabletGroup } from './responsiveColumnUtils';

export interface ResponsiveChunkRowProps<T = any> {
  activeMode: 'tablet' | 'phone';
  row: T;
  rowIndex: number;
  rowKey: string | number;
  columns: ColumnDef<T>[];
  compiledTabletGroups?: CompiledTabletGroup<T>[];
  compiledPhoneCard?: CompiledPhoneCard<T>;
  rowHeight: number;
  isSelected: boolean;
  isChecked: boolean;
  isExpanded: boolean;
  showRowNumber: boolean;
  showSelectionCol: boolean;
  onToggleExpand?: (rowKey: string | number, rowIndex: number) => void;
  onSelectRow?: (rowIndex: number, row: T) => void;
  onRowDetail?: (row: T, rowIndex: number) => void;
  onToggleCheck?: (rowIndex: number, row: T, e: React.MouseEvent) => void;
  onCellContextMenu?: (rowIndex: number, row: T, colKey: string, e: React.MouseEvent) => void;
  surfaceTheme: SurfaceTheme;
  renderCell?: (params: CellRenderParams<T>) => React.ReactNode;
  allowTextSelection: boolean;
}

export function ResponsiveChunkRow<T>({
  activeMode,
  row,
  rowIndex,
  rowKey,
  columns,
  compiledTabletGroups,
  compiledPhoneCard,
  rowHeight,
  isSelected,
  isChecked,
  isExpanded,
  showRowNumber,
  showSelectionCol,
  onToggleExpand,
  onSelectRow,
  onRowDetail,
  onToggleCheck,
  onCellContextMenu,
  surfaceTheme,
  renderCell,
  allowTextSelection,
}: ResponsiveChunkRowProps<T>) {
  if (activeMode === 'tablet') {
    return (
      <GridTabletRow
        row={row}
        rowIndex={rowIndex}
        rowKey={rowKey}
        columns={columns}
        compiledGroups={compiledTabletGroups}
        rowHeight={rowHeight}
        isSelected={isSelected}
        isChecked={isChecked}
        showRowNumber={showRowNumber}
        showSelectionCol={showSelectionCol}
        onSelectRow={onSelectRow}
        onToggleCheck={onToggleCheck}
        onCellContextMenu={onCellContextMenu}
        surfaceTheme={surfaceTheme}
        renderCell={renderCell}
        allowTextSelection={allowTextSelection}
      />
    );
  }

  return (
    <GridPhoneCard
      row={row}
      rowIndex={rowIndex}
      rowKey={rowKey}
      columns={columns}
      compiledPhoneCard={compiledPhoneCard}
      rowHeight={rowHeight}
      isSelected={isSelected}
      isChecked={isChecked}
      isExpanded={isExpanded}
      showRowNumber={showRowNumber}
      showSelectionCol={showSelectionCol}
      onToggleExpand={onToggleExpand}
      onSelectRow={onSelectRow}
      onRowDetail={onRowDetail}
      onToggleCheck={onToggleCheck}
      onCellContextMenu={onCellContextMenu}
      surfaceTheme={surfaceTheme}
      renderCell={renderCell}
      allowTextSelection={allowTextSelection}
    />
  );
}

export default ResponsiveChunkRow;
