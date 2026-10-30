import React from 'react';
import { MorphIcon, MorphIconProps } from 'morphicons/react';
import { SortDirection, SORT_DIRECTIONS } from '../grid/types';
import {
  Square,
  SquareCheck,
  SquareMinus,
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
  checked?: boolean;
  indeterminate?: boolean;
  onChange?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  size?: number;
  className?: string;
  spring?: 'bouncy' | 'snappy' | 'smooth';
  disabled?: boolean;
  title?: string;
  style?: React.CSSProperties;
}

export const MorphCheckbox: React.FC<MorphCheckboxProps> = ({
  checked = false,
  indeterminate = false,
  onChange,
  onClick,
  size = 16,
  className = '',
  spring = 'snappy',
  disabled = false,
  title,
  style,
}) => {
  const isSelected = checked && !indeterminate;
  const activeIcon = indeterminate ? SquareMinus : isSelected ? SquareCheck : Square;
  const isAccent = isSelected || indeterminate;

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    onClick?.(e);
    onChange?.(e);
  };

  return (
    <div
      role="checkbox"
      aria-checked={indeterminate ? 'mixed' : isSelected}
      aria-disabled={disabled || undefined}
      onClick={handleClick}
      title={title}
      className={`agv-morph-checkbox inline-flex items-center justify-center transition-colors border-none bg-transparent p-0 select-none ${
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:opacity-85'
      } ${className}`}
      style={{
        color: isAccent ? 'var(--agv-accent)' : 'var(--agv-text-muted)',
        ...style,
      }}
    >
      <MorphIcon
        icon={activeIcon}
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
