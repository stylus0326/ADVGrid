import React from 'react';
import { MorphIcon, MorphIconProps } from 'morphicons/react';
import { SortDirection } from '../grid/types';
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp, ArrowUp, ArrowDown } from 'lucide';
import { MorphCheckbox, type MorphCheckboxProps } from './MorphCheckbox';
export { MorphIcon, MorphCheckbox };
export type { MorphCheckboxProps };
export interface MorphActionIconProps extends Omit<MorphIconProps, 'icon'> {
    active: boolean;
    activeIcon: any;
    inactiveIcon: any;
    spring?: 'bouncy' | 'snappy' | 'smooth';
}
export declare const MorphActionIcon: React.FC<MorphActionIconProps>;
export interface MorphSortIconProps {
    direction: SortDirection;
    size?: number;
    className?: string;
    spring?: 'bouncy' | 'snappy' | 'smooth';
}
export declare const MorphSortIcon: React.FC<MorphSortIconProps>;
export interface MorphChevronIconProps {
    expanded: boolean;
    size?: number;
    className?: string;
    spring?: 'bouncy' | 'snappy' | 'smooth';
    type?: 'right-down' | 'down-up';
}
export declare const MorphChevronIcon: React.FC<MorphChevronIconProps>;
export { ChevronLeft, ChevronRight, ChevronDown, ChevronUp, ArrowUp, ArrowDown, };
