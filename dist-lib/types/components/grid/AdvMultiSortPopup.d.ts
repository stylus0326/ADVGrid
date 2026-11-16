import React from 'react';
import { ColumnDef, SortConfig, SurfaceTheme } from './types';
export interface AdvMultiSortPopupProps {
    isOpen: boolean;
    onClose: () => void;
    anchorPos: {
        x: number;
        y: number;
    } | null;
    initialColumnKey?: string | null;
    columns: ColumnDef<any>[];
    sortRules: SortConfig[];
    onApply: (rules: SortConfig[]) => void;
    surfaceTheme?: SurfaceTheme;
    embedded?: boolean;
}
export declare const AdvMultiSortPopup: React.FC<AdvMultiSortPopupProps>;
