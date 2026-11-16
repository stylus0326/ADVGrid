import React from 'react';
import type { ColumnDef, FilterOperation, SurfaceTheme } from './types';
export interface GridDateFilterCellProps<T = any> {
    col: ColumnDef<T>;
    inputVal: string;
    currentOp: FilterOperation;
    placeholderText: string;
    surfaceTheme?: SurfaceTheme;
    getColumnDateBounds?: (colKey: string) => {
        min: string;
        max: string;
    };
    onCommitValue: (colKey: string, val: string) => void;
}
export declare const GridDateFilterCell: React.FC<GridDateFilterCellProps>;
