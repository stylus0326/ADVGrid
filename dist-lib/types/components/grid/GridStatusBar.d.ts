import React from 'react';
import { SurfaceTheme } from './types';
export interface GridStatusBarProps {
    page?: number;
    pageSize?: number;
    totalItems: number;
    pageSizeOptions?: readonly number[];
    onPageChange?: (page: number) => void;
    onPageSizeChange?: (pageSize: number) => void;
    surfaceTheme?: SurfaceTheme;
    disabled?: boolean;
}
export declare const GridStatusBar: React.FC<GridStatusBarProps>;
