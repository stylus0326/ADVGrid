import React from 'react';
import {
  ButtonSize,
  ButtonVariant,
  getButtonClass,
} from './controlFocus';

export type { ButtonVariant, ButtonSize } from './controlFocus';
export { getButtonClass, buttonVariants } from './controlFocus';

export interface AdvButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Trạng thái đang kích hoạt/mở (áp nền accent + chữ trắng chuẩn theme) */
  active?: boolean;
}

/**
 * Component Nút bấm chuẩn nguồn đơn toàn hệ thống (4 phân loại: default, outline, ghost, destructive).
 */
export const AdvButton = React.forwardRef<HTMLButtonElement, AdvButtonProps>(
  (
    {
      variant = 'default',
      size = 'default',
      active = false,
      type = 'button',
      className = '',
      ...rest
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        data-variant={variant}
        data-size={size}
        data-active={active ? 'true' : undefined}
        className={getButtonClass({ variant, size, active, className })}
        {...rest}
      />
    );
  }
);

AdvButton.displayName = 'AdvButton';

/** Alias chuẩn shadcn/ui */
export const Button = AdvButton;
