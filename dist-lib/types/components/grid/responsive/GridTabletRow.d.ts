import React from 'react';
import { CellRenderParams, ColumnDef, SurfaceTheme } from '../types';
import { type CompiledTabletGroup } from './responsiveColumnUtils';
export interface GridTabletRowProps<T = any> {
    row: T;
    rowIndex: number;
    rowKey: string | number;
    columns: ColumnDef<T>[];
    compiledGroups?: CompiledTabletGroup<T>[];
    rowHeight: number;
    isSelected: boolean;
    isChecked: boolean;
    showRowNumber?: boolean;
    showSelectionCol?: boolean;
    onSelectRow?: (rowIndex: number, row: T) => void;
    onToggleCheck?: (rowIndex: number, row: T, e: React.MouseEvent) => void;
    onCellContextMenu?: (rowIndex: number, row: T, colKey: string, e: React.MouseEvent) => void;
    surfaceTheme: SurfaceTheme;
    renderCell?: (params: CellRenderParams<T>) => React.ReactNode;
    allowTextSelection?: boolean;
}
export declare const GridTabletRow: <T = any>(props: GridTabletRowProps<T>) => React.ReactElement | null;
