import React from 'react';
import { ColumnDef, SortConfig, SurfaceTheme } from '../types';
export declare function parseMultiValueTokens(rawText: string): string[];
export interface ResponsiveSortFilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    columns: ColumnDef<any>[];
    totalRows: number;
    sortConfig?: SortConfig | null;
    onSortChange?: (sort: SortConfig | null) => void;
    searchQuery?: string;
    onSearchQueryChange?: (q: string) => void;
    columnFilters?: Record<string, any>;
    onColumnFilterChange?: (colKey: string, filter: any) => void;
    onClearAllColumnFilters?: () => void;
    hasColumnEmptyCells?: (colKey: string) => boolean;
    getColumnDateBounds?: (colKey: string) => {
        min: string;
        max: string;
    };
    surfaceTheme?: SurfaceTheme;
    enableSorting?: boolean;
    enableFiltering?: boolean;
    enableQuickSearch?: boolean;
}
export declare const ResponsiveSortFilterModal: React.FC<ResponsiveSortFilterModalProps>;
