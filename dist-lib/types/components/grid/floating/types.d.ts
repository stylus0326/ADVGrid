import React from 'react';
import { ColumnDef, BaseGroupDef, PinPosition, SurfaceTheme, FilterOperation, SortConfig } from '../types';
export interface QueryRule {
    id?: string;
    field: string;
    operator: FilterOperation | 'preset';
    value: any;
    valueTo?: any;
    multiValues?: string[];
    multiRanges?: Array<{
        from: string;
        to: string;
    }>;
}
export declare const QUERY_COMBINATORS: {
    readonly AND: "and";
    readonly OR: "or";
};
export type QueryCombinator = (typeof QUERY_COMBINATORS)[keyof typeof QUERY_COMBINATORS];
export interface QueryGroup {
    id?: string;
    combinator: QueryCombinator;
    rules: (QueryRule | QueryGroup)[];
}
export type QueryTreeNode = QueryGroup | QueryRule;
export interface QueryPreset {
    id: string;
    name: string;
    tree: QueryGroup;
    createdAt: number;
    cmdText?: string;
}
export declare const TOOLBAR_POPUPS: {
    readonly SEARCH: "search";
    readonly QUERY_BUILDER: "queryBuilder";
    readonly MULTI_SORT: "multiSort";
    readonly COLUMN_CHOOSER: "columnChooser";
};
export type FloatingPopupType = (typeof TOOLBAR_POPUPS)[keyof typeof TOOLBAR_POPUPS] | null;
export interface GridFloatingToolbarProps<T = any> {
    gridContainerRef: React.RefObject<HTMLDivElement | null>;
    gridId?: string;
    persistState?: boolean;
    surfaceTheme?: SurfaceTheme;
    headerHeight?: number;
    enableQuickSearch?: boolean;
    enableQueryBuilder?: boolean;
    enableMultiSort?: boolean;
    enableColumnChooser?: boolean;
    enableFullscreen?: boolean;
    enableColumnPinning?: boolean;
    enableColumnReorder?: boolean;
    enableColumnHide?: boolean;
    quickFilterText: string;
    onQuickFilterChange: (text: string) => void;
    isQuickFilterSmart: boolean;
    onToggleQuickFilterSmart: () => void;
    appliedQueryTree: QueryGroup | null;
    onApplyQueryTree: (tree: QueryGroup | null) => void;
    totalFilteredRows: number;
    totalRowCount: number;
    data?: T[];
    getCellValue?: (rowIndex: number, colKey: string) => any;
    hasColumnEmptyCells?: (colKey: string) => boolean;
    getColumnDateBounds?: (colKey: string) => {
        min: string;
        max: string;
    };
    sortRules?: SortConfig[];
    onApplySortRules?: (rules: SortConfig[]) => void;
    columns: ColumnDef<any>[];
    columnGroups?: BaseGroupDef[];
    visibleColKeys: string[];
    onVisibleColKeysChange: (keys: string[]) => void;
    columnPins: Record<string, PinPosition>;
    onColumnPinChange?: (colKey: string, pin: PinPosition) => void;
    onResetColumns: () => void;
    onAutoFitColumn?: (colKey: string) => void;
    onAutoFitAllColumns?: () => void;
    onReorderColumns?: (sourceKey: string, targetKey: string) => void;
    isFullscreen: boolean;
    onToggleFullscreen: () => void;
    onActivePopupChange?: (hasOpenPopup: boolean) => void;
}
