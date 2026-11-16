import React from 'react';
import { ColumnDef, SurfaceTheme } from '../types';
import { type CompiledTabletGroup } from './responsiveColumnUtils';
export interface GridTabletHeaderProps {
    surfaceTheme: SurfaceTheme;
    columns?: ColumnDef<any>[];
    compiledGroups?: CompiledTabletGroup<any>[];
    showRowNumber?: boolean;
    showSelectionCol?: boolean;
    onOpenSortFilter?: () => void;
    hasActiveFilterOrSort?: boolean;
    sortFilterLabel?: string;
}
export declare const GridTabletHeader: React.MemoExoticComponent<({ surfaceTheme: _surfaceTheme, columns, compiledGroups, showRowNumber, showSelectionCol, onOpenSortFilter, hasActiveFilterOrSort, sortFilterLabel, }: GridTabletHeaderProps) => React.JSX.Element>;
