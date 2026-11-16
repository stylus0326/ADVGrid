import React from 'react';
import { ColumnDef, BaseGroupDef, PinPosition, CenterDockStatus, SurfaceTheme, SortConfig, ColumnFilterValue } from './types';
export interface GridHeaderProps<T = any> {
    totalGridWidth: number;
    leftColumns: ColumnDef<T>[];
    middleElements: ({
        type: 'standalone';
        col: ColumnDef<T>;
        isCenterPinned?: boolean;
    } | {
        type: 'group';
        def: BaseGroupDef;
        segmentKey: string;
        children: ColumnDef<T>[];
    })[];
    rightColumns: ColumnDef<T>[];
    colWidths: Record<string, number>;
    columnPins: Record<string, PinPosition>;
    leftOffsets: Record<string, number>;
    rightOffsets: Record<string, number>;
    centerDockStatus: Record<string, CenterDockStatus>;
    centerLeftOffsets: Record<string, number>;
    centerRightOffsets: Record<string, number>;
    lastEffectiveLeftColKey: string | null;
    firstEffectiveRightColKey: string | null;
    sortConfig?: SortConfig | null;
    sortRules?: SortConfig[];
    surfaceTheme: SurfaceTheme;
    columnFilters?: Record<string, ColumnFilterValue>;
    activeChecklistColKey?: string | null;
    emptyColKeys?: Set<string>;
    onOpenChecklistFilter?: (colKey: string, e: React.MouseEvent) => void;
    onToggleSort: (colKey: string, e?: React.MouseEvent) => void;
    onColumnContextMenu?: (colKey: string, e: React.MouseEvent) => void;
    onBandContextMenu?: (groupId: string, childCols: ColumnDef<T>[], e: React.MouseEvent) => void;
    onMouseDownResize?: (colKey: string, e: React.MouseEvent) => void;
    onToggleGroup?: (groupId: string) => void;
    onReorderColumns?: (sourceKey: string, targetKey: string) => void;
    headerHeight?: number;
    hasFilterRow?: boolean;
    enableSorting?: boolean;
    enableColumnResize?: boolean;
    enableContextMenu?: boolean;
}
export declare const GridHeader: React.FC<GridHeaderProps>;
