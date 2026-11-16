import React from 'react';
import { ColumnDef, ColumnFilterValue, SortConfig, GroupSortConfig } from './types';
export interface AdvCriteriaSummaryPopupProps {
    isOpen: boolean;
    onClose: () => void;
    anchorRect: {
        top: number;
        left: number;
        bottom: number;
        right: number;
        width?: number;
        height?: number;
    } | null;
    anchorEl?: HTMLElement | null;
    surfaceTheme?: string;
    columns: ColumnDef<any>[];
    groupByColumnKey?: string | null;
    columnFilters?: Record<string, ColumnFilterValue>;
    quickFilterText?: string;
    sortConfig?: SortConfig | null;
    sortRules?: SortConfig[];
    groupSortConfig?: GroupSortConfig | null;
    appliedQueryTree?: any;
    pinnedRows?: Array<{
        rowKey: string | number;
        rowIndex: number;
        row: any;
    }>;
    onClearRowFilter?: (colKey: string) => void;
    onClearChecklistFilter?: (colKey: string) => void;
    onClearGroup?: () => void;
    onClearQuickSearch?: () => void;
    onClearSortRow?: () => void;
    onRemoveSortRule?: (colKey: string) => void;
    onClearSortGroup?: () => void;
    onClearQueryTree?: () => void;
    onUnpinRow?: (rowKey: string | number) => void;
    onClearAll?: () => void;
}
export declare const AdvCriteriaSummaryPopup: React.FC<AdvCriteriaSummaryPopupProps>;
