import React from 'react';
import { MorphCheckbox } from '../ui/MorphCheckbox';

/* ==============================================================================
   HỆ THỐNG CHECKBOX CHUẨN DÙNG CHUNG (AdvCheckbox)
   Tích hợp 100% MorphIcons: Square <-> SquareCheck <-> SquareMinus (mặc định spring snappy nhanh dứt khoát)
   Tuân thủ 100% theme hệ thống qua CSS variables và hỗ trợ Indeterminate
   ============================================================================== */

export interface AdvCheckboxProps {
  checked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean, event: React.MouseEvent<HTMLDivElement>) => void;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  className?: string;
  title?: string;
  style?: React.CSSProperties;
  size?: number;
  spring?: 'bouncy' | 'snappy' | 'smooth';
}

export const AdvCheckbox: React.FC<AdvCheckboxProps> = ({
  checked = false,
  indeterminate = false,
  disabled = false,
  onChange,
  onClick,
  className = '',
  title,
  style,
  size = 16,
  spring = 'snappy',
}) => {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    onClick?.(e);
    onChange?.(!checked, e);
  };

  return (
    <MorphCheckbox
      checked={checked}
      indeterminate={indeterminate}
      disabled={disabled}
      onClick={handleClick}
      size={size}
      spring={spring}
      title={title}
      style={style}
      className={className}
    />
  );
};
