import React from 'react';
import { BaseGroupDef, ColumnDef, GridToolbarPopupType, PinPosition, SortConfig, SurfaceTheme } from './types';
export interface GridExternalPopupTarget {
    type: GridToolbarPopupType;
    anchorEl: HTMLElement | null;
}
export interface GridExternalPopupHostProps<T = any> {
    popup: GridExternalPopupTarget | null;
    onClose: () => void;
    gridId?: string;
    surfaceTheme?: SurfaceTheme;
    quickFilterText: string;
    onQuickFilterChange: (text: string) => void;
    isQuickFilterSmart: boolean;
    onToggleQuickFilterSmart: () => void;
    appliedQueryTree?: any;
    onApplyQueryTree?: (tree: any) => void;
    totalFilteredRows?: number;
    totalRowCount: number;
    data?: T[];
    getCellValue?: (rowIndex: number, colKey: string) => any;
    hasColumnEmptyCells?: (colKey: string) => boolean;
    getColumnDateBounds?: (colKey: string) => {
        min: string;
        max: string;
    };
    columns: ColumnDef<any>[];
    columnGroups?: BaseGroupDef[];
    visibleColKeys: string[];
    onVisibleColKeysChange: (keys: string[]) => void;
    columnPins?: Record<string, PinPosition>;
    onColumnPinChange?: (colKey: string, pin: PinPosition) => void;
    onResetColumns: () => void;
    onAutoFitColumn?: (colKey: string) => void;
    onReorderColumns?: (sourceKey: string, targetKey: string) => void;
    enableColumnHide?: boolean;
    sortRules: SortConfig[];
    onApplySortRules: (rules: SortConfig[]) => void;
}
export declare const GridExternalPopupHost: React.MemoExoticComponent<(<T = any>({ popup, onClose, gridId, surfaceTheme, quickFilterText, onQuickFilterChange, isQuickFilterSmart, onToggleQuickFilterSmart, appliedQueryTree, onApplyQueryTree, totalFilteredRows, totalRowCount, data, getCellValue, hasColumnEmptyCells, getColumnDateBounds, columns, columnGroups, visibleColKeys, onVisibleColKeysChange, columnPins, onColumnPinChange, onResetColumns, onAutoFitColumn, onReorderColumns, enableColumnHide, sortRules, onApplySortRules, }: GridExternalPopupHostProps<T>) => React.JSX.Element | null)>;
