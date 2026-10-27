import React from 'react';
import { Check } from 'lucide-react';

/* ==============================================================================
   HỆ THỐNG CHECKBOX CHUẨN DÙNG CHUNG (AdvCheckbox)
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
}) => {
  const isChecked = checked && !indeterminate;

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (onClick) onClick(e);
    if (onChange) onChange(!checked, e);
  };

  return (
    <div
      role="checkbox"
      aria-checked={indeterminate ? 'mixed' : checked}
      aria-disabled={disabled || undefined}
      style={style}
      onClick={handleClick}
      className={`agv-custom-checkbox agv-select-checkbox flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded border transition-colors select-none ${
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
      } ${
        isChecked || indeterminate
          ? 'border-agv-accent bg-agv-accent text-agv-accent-text is-checked'
          : 'border-agv-border-strong bg-agv-bg-root hover:border-agv-accent'
      } ${className}`}
    >
      {isChecked && <Check className="h-2.5 w-2.5 stroke-[3.5]" />}
      {indeterminate && (
        <span className="block h-0.5 w-2 rounded-full bg-agv-accent-text" />
      )}
    </div>
  );
};
