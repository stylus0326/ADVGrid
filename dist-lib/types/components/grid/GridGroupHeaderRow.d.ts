import React from 'react';
import { ColumnDef, PinPosition, CenterDockStatus, SurfaceTheme } from './types';
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
export declare const GridGroupHeaderRow: <T = any>(props: GridGroupHeaderRowProps<T>) => React.ReactElement | null;
