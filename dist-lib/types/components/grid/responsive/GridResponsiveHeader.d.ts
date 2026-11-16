import React from 'react';
import { ColumnDef, SurfaceTheme } from '../types';
import { type CompiledTabletGroup } from './responsiveColumnUtils';
export interface GridResponsiveHeaderProps {
    activeMode: 'tablet' | 'phone';
    surfaceTheme: SurfaceTheme;
    columns?: ColumnDef<any>[];
    compiledTabletGroups?: CompiledTabletGroup<any>[];
    showRowNumber?: boolean;
    showSelectionCol?: boolean;
    totalRows: number;
    onOpenSortFilter?: () => void;
    hasActiveFilterOrSort?: boolean;
    sortFilterLabel?: string;
}
export declare const GridResponsiveHeader: React.MemoExoticComponent<({ activeMode, surfaceTheme, columns, compiledTabletGroups, showRowNumber, showSelectionCol, totalRows, onOpenSortFilter, hasActiveFilterOrSort, sortFilterLabel, }: GridResponsiveHeaderProps) => React.JSX.Element>;
