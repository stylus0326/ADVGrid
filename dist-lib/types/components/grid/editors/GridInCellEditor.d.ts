import React from 'react';
import { ColumnDef, SurfaceTheme } from '../types';
export interface GridInCellEditorProps<T = any> {
    column: ColumnDef<T>;
    row: T;
    rowIndex: number;
    initialValue: string;
    surfaceTheme: SurfaceTheme;
    getColumnDateBounds?: (colKey: string) => {
        min: string;
        max: string;
    };
    onCellChange?: (rowIndex: number, row: T, colKey: string, newValue: any) => void;
    onEndEditCell?: () => void;
}
export declare function GridInCellEditor<T>({ column, row, rowIndex, initialValue, surfaceTheme, getColumnDateBounds, onCellChange, onEndEditCell, }: GridInCellEditorProps<T>): React.JSX.Element;
export default GridInCellEditor;
