import React from 'react';

export type StatusBadgeTone =
  | 'success'
  | 'danger'
  | 'muted'
  | 'warning'
  | 'info'
  | 'brand';

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: StatusBadgeTone;
}

const TONE_CLASS_MAP: Record<StatusBadgeTone, string> = {
  success:
    'border-status-success-border bg-status-success text-status-success-foreground',
  danger:
    'border-status-danger-border bg-status-danger text-status-danger-foreground',
  warning:
    'border-status-warning-border bg-status-warning text-status-warning-foreground',
  info: 'border-status-info-border bg-status-info text-status-info-foreground',
  brand:
    'border-status-brand-border bg-status-brand text-status-brand-foreground',
  muted: 'border-transparent bg-muted text-muted-foreground',
};

/**
 * Nhãn trạng thái dạng pill chuẩn `b2b-pnt`.
 */
export const StatusBadge: React.FC<StatusBadgeProps> = ({
  tone = 'muted',
  className = '',
  children,
  ...rest
}) => {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 leading-tight ${TONE_CLASS_MAP[tone]} ${className}`}
      {...rest}
    >
      {children}
    </span>
  );
};
