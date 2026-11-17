import React from 'react';
import { NO_AUTOFILL_PROPS, getGridControlRadiusClass } from '../grid/constants';
import {
  ControlSize,
  ControlVariant,
  getControlSurfaceClasses,
} from './controlFocus';

export interface AdvInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: ControlSize;
  variant?: ControlVariant;
  leadingIcon?: React.ReactNode;
  endAdornment?: React.ReactNode;
  allowAutofill?: boolean;
  invalid?: boolean;
  containerClassName?: string;
}

/**
 * Component ô nhập liệu chuẩn nguồn đơn `.agv-control`, hỗ trợ icon dẫn đầu,
 * nút phụ cuối ô, dáng `default` (`sm`/`md`) và dáng `auth` (`48px / bo 8px đồng bộ`).
 */
export const AdvInput = React.forwardRef<HTMLInputElement, AdvInputProps>(function AdvInput(
  {
    size = 'md',
    variant = 'default',
    leadingIcon,
    endAdornment,
    allowAutofill = false,
    invalid,
    type = 'text',
    className = '',
    containerClassName = '',
    disabled = false,
    readOnly,
    'aria-invalid': ariaInvalidProp,
    ...rest
  },
  ref
) {
  const isInvalid = Boolean(invalid || ariaInvalidProp);
  const autofillProps = allowAutofill ? undefined : NO_AUTOFILL_PROPS;
  const paddingLeftCls = leadingIcon ? 'pl-9' : 'pl-3';
  const paddingRightCls = endAdornment ? 'pr-12' : 'pr-3';

  const surfaceCls = getControlSurfaceClasses({
    size,
    variant,
    defaultRadiusClass: getGridControlRadiusClass(),
    className: [
      'w-full min-w-0 py-1 outline-none placeholder:text-muted-foreground',
      'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
      readOnly && variant === 'default' ? 'text-muted-foreground' : 'text-foreground',
      paddingLeftCls,
      paddingRightCls,
      className,
    ]
      .filter(Boolean)
      .join(' '),
  });

  const inputElement = (
    <input
      ref={ref}
      type={type}
      disabled={disabled}
      readOnly={readOnly}
      aria-invalid={isInvalid || undefined}
      className={surfaceCls}
      {...autofillProps}
      {...rest}
    />
  );

  if (!leadingIcon && !endAdornment) {
    return inputElement;
  }

  return (
    <div className={`relative flex items-center min-w-0 w-full ${containerClassName}`.trim()}>
      {leadingIcon ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-3 z-10 inline-flex items-center justify-center text-[var(--agv-text-muted)]"
        >
          {leadingIcon}
        </span>
      ) : null}
      {inputElement}
      {endAdornment ? (
        <div className="absolute right-2 z-10 flex items-center">{endAdornment}</div>
      ) : null}
    </div>
  );
});

AdvInput.displayName = 'AdvInput';
