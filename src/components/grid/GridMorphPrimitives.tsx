import React from 'react';
import {
  MorphIcon,
  MorphSortIcon,
  MorphChevronIcon,
  ChevronLeft,
  ChevronRight,
} from '../ui/MorphIcons';
import type { SortDirection } from './types';

export interface HeaderSortMorphIconProps {
  direction: SortDirection;
  size?: number;
}

export const HeaderSortMorphIcon: React.FC<HeaderSortMorphIconProps> = ({
  direction,
  size = 11,
}) => <MorphSortIcon direction={direction} size={size} spring="snappy" />;

export interface HeaderBandToggleMorphIconProps {
  direction: 'left' | 'right';
}

export const HeaderBandToggleMorphIcon: React.FC<HeaderBandToggleMorphIconProps> = ({
  direction,
}) => (
  <MorphIcon
    icon={direction === 'right' ? ChevronRight : ChevronLeft}
    size={14}
    strokeWidth={2.5}
    spring="bouncy"
  />
);

export interface RowGroupChevronMorphIconProps {
  expanded: boolean;
}

export const RowGroupChevronMorphIcon: React.FC<RowGroupChevronMorphIconProps> = ({
  expanded,
}) => <MorphChevronIcon expanded={expanded} size={14} spring="bouncy" />;
