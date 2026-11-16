import React from 'react';
import type { SortDirection } from './types';
export interface HeaderSortMorphIconProps {
    direction: SortDirection;
    size?: number;
}
export declare const HeaderSortMorphIcon: React.FC<HeaderSortMorphIconProps>;
export interface HeaderBandToggleMorphIconProps {
    direction: 'left' | 'right';
}
export declare const HeaderBandToggleMorphIcon: React.FC<HeaderBandToggleMorphIconProps>;
export interface RowGroupChevronMorphIconProps {
    expanded: boolean;
}
export declare const RowGroupChevronMorphIcon: React.FC<RowGroupChevronMorphIconProps>;
