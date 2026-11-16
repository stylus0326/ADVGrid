import React from 'react';
import { SURFACE_THEMES, type GridTheme } from '../../themes';
import { GRID_VARIANTS, resolveGridFeatures, type GridVariant, type GridFeatureProps, type ResolvedGridFeatures } from './gridFeatures';
import type { GridColumnMeta, TabletFieldKey, TabletLineSlot, TabletGroupLines, TabletColumnGroup, PhoneCardConfig } from './columns/columnTypes';
export { SURFACE_THEMES, GRID_VARIANTS, resolveGridFeatures, };
export type SurfaceTheme = GridTheme;
export type { GridVariant, GridFeatureProps, ResolvedGridFeatures, TabletFieldKey, TabletLineSlot, TabletGroupLines, TabletColumnGroup, PhoneCardConfig, };
export declare const PIN_POSITIONS: {
    readonly NONE: "none";
    readonly LEFT: "left";
    readonly RIGHT: "right";
    readonly CENTER: "center";
};
export type PinPosition = (typeof PIN_POSITIONS)[keyof typeof PIN_POSITIONS];
export declare const CENTER_DOCK_STATUSES: {
    readonly LEFT: "left";
    readonly RIGHT: "right";
    readonly NORMAL: "normal";
};
export type CenterDockStatus = (typeof CENTER_DOCK_STATUSES)[keyof typeof CENTER_DOCK_STATUSES];
export declare const SORT_DIRECTIONS: {
    readonly ASC: "asc";
    readonly DESC: "desc";
};
export type SortDirection = (typeof SORT_DIRECTIONS)[keyof typeof SORT_DIRECTIONS];
export interface SortConfig {
    key: string;
    direction: SortDirection;
    sortByMonth?: boolean;
}
export interface CellRenderParams<T = any> {
    column: ColumnDef<T>;
    row: T;
    rowIndex: number;
    isSelected: boolean;
    isChecked: boolean;
    isResponsive?: boolean;
}
export declare const GRID_EDIT_MODES: {
    readonly VIEW: "view";
    readonly SINGLE_CLICK: "single-click";
    readonly DOUBLE_CLICK: "double-click";
};
export type GridEditMode = (typeof GRID_EDIT_MODES)[keyof typeof GRID_EDIT_MODES];
export declare const GRID_LAYOUT_MODES: {
    readonly AUTO: "auto";
    readonly PC: "pc";
    readonly TABLET: "tablet";
    readonly PHONE: "phone";
};
export type GridLayoutMode = (typeof GRID_LAYOUT_MODES)[keyof typeof GRID_LAYOUT_MODES];
export declare const FORMULA_MODES: {
    readonly AVG: "AVG";
    readonly SUM: "SUM";
    readonly MIN: "MIN";
    readonly MAX: "MAX";
};
export type FormulaMode = (typeof FORMULA_MODES)[keyof typeof FORMULA_MODES];
export declare const MONTH_ANALYTICS_MODES: {
    readonly THIRTEEN_COLS: "13cols";
    readonly TWO_COLS: "2cols";
};
export type MonthAnalyticsMode = (typeof MONTH_ANALYTICS_MODES)[keyof typeof MONTH_ANALYTICS_MODES];
export declare const FILTER_OPS: {
    readonly CONTAINS: "contains";
    readonly NOT_CONTAINS: "not_contains";
    readonly STARTS_WITH: "starts_with";
    readonly ENDS_WITH: "ends_with";
    readonly EQUALS: "equals";
    readonly NOT_EQUALS: "not_equals";
    readonly GREATER_THAN: "greater_than";
    readonly GREATER_EQUALS: "greater_equals";
    readonly LESS_THAN: "less_than";
    readonly LESS_EQUALS: "less_equals";
    readonly BETWEEN: "between";
    readonly IS_POSITIVE: "is_positive";
    readonly IS_NEGATIVE: "is_negative";
    readonly IS_EMPTY: "is_empty";
    readonly IS_NOT_EMPTY: "is_not_empty";
};
export type FilterOperation = (typeof FILTER_OPS)[keyof typeof FILTER_OPS];
export declare const FILTER_MODES: {
    readonly SIMPLE: "simple";
    readonly CHECKLIST: "checklist";
    readonly MULTI: "multi";
};
export type FilterMode = (typeof FILTER_MODES)[keyof typeof FILTER_MODES];
export declare const CHECK_FILTER_STATES: {
    readonly ALL: "ALL";
    readonly CHECKED: "CHECKED";
    readonly UNCHECKED: "UNCHECKED";
};
export type CheckFilterState = (typeof CHECK_FILTER_STATES)[keyof typeof CHECK_FILTER_STATES];
export interface ColumnFilterValue {
    op: FilterOperation;
    val: string;
    mode?: FilterMode;
    selectedValues?: any[];
    includeBlanks?: boolean;
    multiValues?: string[];
    multiRanges?: Array<{
        from: string;
        to: string;
    }>;
}
export declare const EDITOR_TYPES: {
    readonly TEXT: "text";
    readonly NUMBER: "number";
    readonly DATE: "date";
    readonly DATERANGE: "daterange";
    readonly TIME: "time";
    readonly COMBOBOX: "combobox";
    readonly LOOKUP: "lookup";
};
export type ColumnEditorType = (typeof EDITOR_TYPES)[keyof typeof EDITOR_TYPES];
export declare const DATA_TYPES: {
    readonly TEXT: "text";
    readonly NUMBER: "number";
    readonly DATE: "date";
    readonly TIME: "time";
    readonly SYSTEM: "system";
};
export type ColumnDataType = (typeof DATA_TYPES)[keyof typeof DATA_TYPES];
export declare const ALIGNMENTS: {
    readonly LEFT: "left";
    readonly CENTER: "center";
    readonly RIGHT: "right";
};
export type ColumnAlign = (typeof ALIGNMENTS)[keyof typeof ALIGNMENTS];
export interface CellSpanParams<T = any> {
    row: T;
    rowIndex: number;
    column: ColumnDef<T>;
    colIndex: number;
    getRowAt: (rowIndex: number) => T | null;
}
export interface CellSpanResult {
    rowSpan?: number;
    colSpan?: number;
}
export type GridSpanMethod<T = any> = (params: CellSpanParams<T>) => CellSpanResult | readonly [rowSpan: number, colSpan: number] | undefined | null;
export interface TreeRowExpandEvent<T = any> {
    row: T;
    rowKey: string | number;
    expanded: boolean;
    depth: number;
}
export interface TreeDataConfig<T = any> {
    treeColumnKey?: string;
    childrenField?: (keyof T & string) | (string & {});
    getSubRows?: (row: T) => readonly T[] | undefined | null;
    parentKeyField?: (keyof T & string) | (string & {});
    rootParentValue?: unknown;
    indentSize?: number;
    defaultExpandAll?: boolean;
    defaultExpandedDepth?: number;
    defaultExpandedKeys?: readonly (string | number)[];
    expandedKeys?: ReadonlySet<string | number> | readonly (string | number)[];
    onExpandedKeysChange?: (keys: (string | number)[]) => void;
    onRowExpand?: (event: TreeRowExpandEvent<T>) => void;
    filterMode?: 'preserveAncestors' | 'strict';
}
export interface DetailRowContext<T = any> {
    row: T;
    rowKey: string | number;
    rowIndex: number;
    close: () => void;
}
export interface DetailExpandChangeEvent<T = any> {
    row: T;
    rowKey: string | number;
    expanded: boolean;
}
export interface DetailRowConfig<T = any> {
    renderDetail: (ctx: DetailRowContext<T>) => React.ReactNode;
    height?: number | 'auto';
    estimatedHeight?: number;
    expandColumnKey?: string;
    showExpandColumn?: boolean;
    expandOnRowClick?: boolean;
    accordion?: boolean;
    unstyled?: boolean;
    canExpand?: (row: T, rowIndex: number) => boolean;
    defaultExpandedKeys?: readonly (string | number)[];
    expandedKeys?: ReadonlySet<string | number> | readonly (string | number)[];
    onExpandedKeysChange?: (keys: (string | number)[]) => void;
    onExpandChange?: (event: DetailExpandChangeEvent<T>) => void;
}
export interface ColumnDef<T = any> {
    key: string;
    title: string;
    defaultWidth: number;
    minWidth?: number;
    maxWidth?: number;
    align?: ColumnAlign;
    dataType?: ColumnDataType;
    editorType?: ColumnEditorType;
    showTime?: boolean;
    isDateRange?: boolean;
    editorOptions?: any;
    sortable?: boolean;
    filterable?: boolean;
    enableGlobalFilter?: boolean;
    resizable?: boolean;
    pinnable?: boolean;
    hideable?: boolean;
    groupable?: boolean;
    disableHeaderContextMenu?: boolean;
    disableContextMenu?: boolean;
    editable?: boolean;
    minDate?: string;
    maxDate?: string;
    className?: string;
    cellPadding?: string;
    isFormula?: boolean;
    isChart?: boolean;
    isRowNumber?: boolean;
    isSelection?: boolean;
    isDetailExpand?: boolean;
    meta?: GridColumnMeta<T>;
    valueGetter?: (row: T, index: number) => any;
    colSpan?: (params: CellSpanParams<T>) => number;
    rowSpan?: (params: CellSpanParams<T>) => number;
    tabletLabelGetter?: (row: T, rowIndex: number) => string | undefined;
    monthIndexGetter?: (row: T, mode: FormulaMode) => number;
    wrapText?: boolean;
    renderHeader?: () => React.ReactNode;
    renderCell?: (params: CellRenderParams<T>) => React.ReactNode;
}
export declare const CONTEXT_MENU_TYPES: {
    readonly HEADER: "header";
    readonly ROW: "row";
    readonly BAND: "band";
    readonly GROUP: "group";
};
export type ContextMenuType = (typeof CONTEXT_MENU_TYPES)[keyof typeof CONTEXT_MENU_TYPES];
export type ContextMenuData = {
    type: typeof CONTEXT_MENU_TYPES.HEADER;
    x: number;
    y: number;
    column: ColumnDef;
    currentPin: PinPosition;
    hasHiddenColumns?: boolean;
} | {
    type: typeof CONTEXT_MENU_TYPES.BAND;
    x: number;
    y: number;
    groupDef: BaseGroupDef;
    childColumns: ColumnDef[];
    currentPin: PinPosition;
} | {
    type: typeof CONTEXT_MENU_TYPES.ROW;
    x: number;
    y: number;
    rowIndex: number;
    row: any;
    column?: ColumnDef;
    cellValue?: any;
} | {
    type: typeof CONTEXT_MENU_TYPES.GROUP;
    x: number;
    y: number;
    groupRow: any;
};
export interface BaseGroupDef {
    id: string;
    title: string;
    isStandalone?: boolean;
    keys: string[];
    isToggleable?: boolean;
    isCollapsed?: boolean;
    isAtomic?: boolean;
}
export type GridToolbarPopupType = 'search' | 'queryBuilder' | 'multiSort' | 'columnChooser';
export interface GridToolbarState {
    activePopup: GridToolbarPopupType | null;
    quickFilterText: string;
    isQuickFilterActive: boolean;
    activeQueryRuleCount: number;
    visibleColumnCount: number;
    totalColumnCount: number;
    sortRuleCount: number;
    enableQuickSearch: boolean;
    enableQueryBuilder: boolean;
    enableColumnChooser: boolean;
    enableMultiSort: boolean;
}
export interface DataGridToolbarApi {
    state: GridToolbarState;
    openPopup: (type: GridToolbarPopupType, anchorEl: HTMLElement | null) => void;
    togglePopup: (type: GridToolbarPopupType, anchorEl: HTMLElement | null) => void;
    closePopup: () => void;
}
export interface VirtualizedGridRef {
    scrollToRow: (rowIndex: number, behavior?: ScrollBehavior) => void;
    scrollToChunk: (chunkIndex: number, behavior?: ScrollBehavior) => void;
    getScrollContainer: () => HTMLDivElement | null;
    openPopup: (type: GridToolbarPopupType, anchorEl: HTMLElement | null) => void;
    togglePopup: (type: GridToolbarPopupType, anchorEl: HTMLElement | null) => void;
    closePopup: () => void;
    expandAllTree?: () => void;
    collapseAllTree?: () => void;
    expandTreeToDepth?: (depth: number) => void;
    toggleTreeRow?: (rowKey: string | number, forceExpanded?: boolean) => void;
    toggleDetailRow?: (rowKey: string | number, forceExpanded?: boolean) => void;
    expandAllDetails?: () => void;
    collapseAllDetails?: () => void;
}
export interface GroupSortConfig {
    colKey: string;
    direction: SortDirection;
}
export interface VirtualizedGridProps<T = any> extends GridFeatureProps {
    data?: T[];
    pinnedTopRowData?: T[];
    rowCount?: number;
    getRow?: (index: number) => T;
    getRowId?: (row: T, index: number) => string | number;
    dataVersion?: number;
    columns: ColumnDef<T>[];
    columnGroups?: BaseGroupDef[];
    tabletGroups?: readonly TabletColumnGroup<T>[];
    phoneCard?: PhoneCardConfig<T>;
    columnPins?: Record<string, PinPosition>;
    defaultColumnPins?: Record<string, PinPosition>;
    onColumnPinsChange?: (pins: Record<string, PinPosition>) => void;
    colWidths?: Record<string, number>;
    defaultColWidths?: Record<string, number>;
    onColWidthsChange?: (widths: Record<string, number>) => void;
    hiddenColKeys?: Set<string>;
    defaultHiddenColKeys?: Set<string>;
    onHiddenColKeysChange?: (hidden: Set<string>) => void;
    onReorderColumns?: (sourceKey: string, targetKey: string) => void;
    onResetColumns?: () => void;
    headerHeight?: number;
    groupByColumnKey?: string | null;
    onToggleGroupByColumn?: (colKey: string) => void;
    columnSums?: Record<string, number>;
    sortConfig?: SortConfig | null;
    onSortChange?: (sort: SortConfig | null) => void;
    sortRules?: SortConfig[];
    onSortRulesChange?: (rules: SortConfig[]) => void;
    selectedRowIndex?: number | null;
    selectedRowKey?: string | number | null;
    onSelectRow?: (rowIndex: number, row: T) => void;
    checkedRowIndices?: Set<number | string>;
    onToggleCheck?: (rowIndex: number, row: T, e: React.MouseEvent) => void;
    onClearCheckedRows?: () => void;
    showFilterRow?: boolean;
    columnFilters?: Record<string, ColumnFilterValue>;
    onColumnFilterChange?: (colKey: string, filter: ColumnFilterValue) => void;
    onClearAllColumnFilters?: () => void;
    onClearAllCriteria?: () => void;
    hasColumnEmptyCells?: (colKey: string) => boolean;
    getColumnDateBounds?: (colKey: string) => {
        min: string;
        max: string;
    };
    formatChecklistDisplay?: (colKey: string, val: any) => string;
    getCellValue?: (rowIndex: number, colKey: string) => any;
    getDistinctValues?: (colKey: string) => {
        values: string[];
        hasBlanks: boolean;
    };
    matchFilterValue?: (cellVal: any, op: FilterOperation, targetVal: string, dataType: string, filterObj?: ColumnFilterValue) => boolean;
    renderCell?: (params: CellRenderParams<T>) => React.ReactNode;
    editMode?: GridEditMode;
    onEditModeChange?: (mode: GridEditMode) => void;
    editingCell?: {
        rowIndex: number;
        colKey: string;
    } | null;
    onStartEditCell?: (rowIndex: number, colKey: string) => void;
    onEndEditCell?: () => void;
    onCellChange?: (rowIndex: number, row: T, colKey: string, newValue: any) => void;
    layoutMode?: GridLayoutMode;
    onLayoutModeChange?: (mode: GridLayoutMode) => void;
    chunkSize?: number;
    rowHeight?: number;
    overscanChunks?: number;
    overscanRows?: number;
    scrollbarAlwaysOn?: boolean;
    dynamicRowHeight?: boolean;
    estimatedRowHeight?: number;
    getRowHeight?: (row: T, rowIndex: number) => number;
    antiGhostMode?: boolean;
    surfaceTheme?: SurfaceTheme;
    spanMethod?: GridSpanMethod<T>;
    maxRowSpanLookback?: number;
    treeColumnKey?: string;
    treeIndentSize?: number;
    onToggleTreeExpand?: (rowKey: string | number, row: T, depth?: number) => void;
    detailExpandColKey?: string;
    isRowDetailExpanded?: (rowKey: string | number) => boolean;
    canExpandRowDetail?: (row: T, rowIndex: number) => boolean;
    onToggleRowDetail?: (rowKey: string | number, row: T) => void;
    renderDetailRow?: (row: any) => React.ReactNode;
    hasDynamicDetailRows?: boolean;
    treeDetailActions?: {
        expandAllTree?: () => void;
        collapseAllTree?: () => void;
        expandTreeToDepth?: (depth: number) => void;
        toggleTreeRow?: (rowKey: string | number, forceExpanded?: boolean) => void;
        toggleDetailRow?: (rowKey: string | number, forceExpanded?: boolean) => void;
        expandAllDetails?: () => void;
        collapseAllDetails?: () => void;
    };
    onToggleGroup?: (groupId: string) => void;
    onQuickFilter?: (colKey: string, value: any) => void;
    formulaMode?: FormulaMode;
    onFormulaModeChange?: (mode: FormulaMode) => void;
    onRowDetail?: (row: T, index: number) => void;
    className?: string;
    style?: React.CSSProperties;
    enableFloatingToolbar?: boolean;
    quickFilterText?: string;
    onQuickFilterTextChange?: (text: string) => void;
    appliedQueryTree?: any;
    onApplyQueryTree?: (tree: any) => void;
    onToolbarStateChange?: (state: GridToolbarState) => void;
    onCollapseAllGroups?: () => void;
    onExpandAllGroups?: () => void;
    onUngroup?: () => void;
    onCopyGroupTable?: (groupRow: any, includeHeaders: boolean) => void;
    emptyColKeys?: Set<string>;
    groupSortConfig?: GroupSortConfig | null;
    onToggleGroupSort?: (colKey: string) => void;
    gridId?: string;
    loading?: boolean;
    refreshing?: boolean;
    error?: string | null;
    onRetry?: () => void;
    emptyText?: string;
    statusBar?: React.ReactNode;
    showSummaryRow?: boolean;
    onShowSummaryRowChange?: (show: boolean) => void;
    showStatusBar?: boolean;
    onShowStatusBarChange?: (show: boolean) => void;
    _resolvedFeatures?: ResolvedGridFeatures;
}
