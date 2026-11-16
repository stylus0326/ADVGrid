import React from 'react';
import { MorphIcon, MorphIconProps } from 'morphicons/react';
import { SortDirection, SORT_DIRECTIONS } from '../grid/types';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ArrowUp,
  ArrowDown,
} from 'lucide';
import { MorphCheckbox, type MorphCheckboxProps } from './MorphCheckbox';

export { MorphIcon, MorphCheckbox };
export type { MorphCheckboxProps };

export interface MorphActionIconProps extends Omit<MorphIconProps, 'icon'> {
  active: boolean;
  activeIcon: any;
  inactiveIcon: any;
  spring?: 'bouncy' | 'snappy' | 'smooth';
}

export const MorphActionIcon: React.FC<MorphActionIconProps> = ({
  active,
  activeIcon,
  inactiveIcon,
  spring = 'snappy',
  ...rest
}) => {
  return (
    <MorphIcon
      icon={active ? activeIcon : inactiveIcon}
      spring={spring}
      {...rest}
    />
  );
};

export interface MorphSortIconProps {
  direction: SortDirection;
  size?: number;
  className?: string;
  spring?: 'bouncy' | 'snappy' | 'smooth';
}

export const MorphSortIcon: React.FC<MorphSortIconProps> = ({
  direction,
  size = 11,
  className = '',
  spring = 'snappy',
}) => {
  return (
    <MorphIcon
      icon={direction === SORT_DIRECTIONS.ASC ? ArrowUp : ArrowDown}
      size={size}
      spring={spring}
      className={className}
    />
  );
};

export interface MorphChevronIconProps {
  expanded: boolean;
  size?: number;
  className?: string;
  spring?: 'bouncy' | 'snappy' | 'smooth';
  type?: 'right-down' | 'down-up';
}

export const MorphChevronIcon: React.FC<MorphChevronIconProps> = ({
  expanded,
  size = 14,
  className = '',
  spring = 'bouncy',
  type = 'right-down',
}) => {
  const icon =
    type === 'down-up'
      ? expanded
        ? ChevronUp
        : ChevronDown
      : expanded
      ? ChevronDown
      : ChevronRight;

  return (
    <MorphIcon
      icon={icon}
      size={size}
      spring={spring}
      className={className}
    />
  );
};

export {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ArrowUp,
  ArrowDown,
};
