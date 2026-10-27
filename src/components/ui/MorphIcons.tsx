import React from 'react';
import { MorphIcon, MorphIconProps } from 'morphicons/react';
import { SortDirection, SORT_DIRECTIONS } from '../grid/types';
import {
  Square,
  Check,
  CheckSquare,
  Play,
  Pause,
  Eye,
  EyeOff,
  Magnet,
  Unlock,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ArrowUp,
  ArrowDown,
  Sun,
  Moon,
  Monitor,
  Palette,
  BookOpen,
  Filter,
  X,
  Columns as ColumnsIcon,
  BarChart2,
} from 'lucide';

export { MorphIcon };

export interface MorphCheckboxProps {
  checked: boolean;
  onChange?: (e: React.MouseEvent) => void;
  size?: number;
  className?: string;
  spring?: 'bouncy' | 'snappy' | 'smooth';
}

export const MorphCheckbox: React.FC<MorphCheckboxProps> = ({
  checked,
  onChange,
  size = 16,
  className = '',
  spring = 'bouncy',
}) => {
  return (
    <div
      onClick={onChange}
      className={`inline-flex items-center justify-center cursor-pointer transition-colors border-none bg-transparent p-0 select-none ${className}`}
      style={{
        color: checked
          ? 'var(--agv-accent, #2563eb)'
          : 'var(--agv-text-muted, #94a3b8)',
      }}
    >
      <MorphIcon
        icon={checked ? Check : Square}
        size={size}
        spring={spring}
      />
    </div>
  );
};

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
  Square,
  Check,
  CheckSquare,
  Play,
  Pause,
  Eye,
  EyeOff,
  Magnet,
  Unlock,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ArrowUp,
  ArrowDown,
  Sun,
  Moon,
  Monitor,
  Palette,
  BookOpen,
  Filter,
  X,
  ColumnsIcon,
  BarChart2,
};
