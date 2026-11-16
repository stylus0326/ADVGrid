import React from 'react';
import { CellRenderParams, ColumnDef, SurfaceTheme } from '../types';
import { type CompiledPhoneCard } from './responsiveColumnUtils';
export interface GridPhoneCardProps<T = any> {
    row: T;
    rowIndex: number;
    rowKey: string | number;
    columns: ColumnDef<T>[];
    compiledPhoneCard?: CompiledPhoneCard<T>;
    rowHeight: number;
    isSelected: boolean;
    isChecked: boolean;
    isExpanded?: boolean;
    showRowNumber?: boolean;
    showSelectionCol?: boolean;
    onToggleExpand?: (rowKey: string | number, rowIndex: number) => void;
    onSelectRow?: (rowIndex: number, row: T) => void;
    onRowDetail?: (row: T, rowIndex: number) => void;
    onToggleCheck?: (rowIndex: number, row: T, e: React.MouseEvent) => void;
    onCellContextMenu?: (rowIndex: number, row: T, colKey: string, e: React.MouseEvent) => void;
    surfaceTheme: SurfaceTheme;
    renderCell?: (params: CellRenderParams<T>) => React.ReactNode;
    allowTextSelection?: boolean;
}
export declare const GridPhoneCard: <T = any>(props: GridPhoneCardProps<T>) => React.ReactElement | null;
