import React from 'react';

export interface AdvProgressProps {
  value?: number;
  max?: number;
  showValue?: boolean;
  label?: string;
  indeterminate?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const AdvProgress: React.FC<AdvProgressProps> = ({
  value = 0,
  max = 100,
  showValue = false,
  label,
  indeterminate = false,
  size = 'sm',
  color = 'var(--agv-accent)',
  className = '',
  style = {},
}) => {
  const percentage = Math.max(0, Math.min(100, Math.round(((value || 0) / (max || 100)) * 100)));

  const heightClasses = {
    xs: 'h-1.5',
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  }[size];

  return (
    <div className={`w-full select-none ${className}`} style={style}>
      {(label || showValue) && (
        <div className="flex items-center justify-between text-xs font-medium mb-1.5 text-[var(--agv-text-main)]">
          {label && <span>{label}</span>}
          {showValue && (
            <span className="text-[var(--agv-text-muted)] font-mono tabular-nums ml-auto">
              {indeterminate ? 'Đang xử lý...' : `${percentage}%`}
            </span>
          )}
        </div>
      )}

      <div
        className={`w-full ${heightClasses} rounded-full overflow-hidden relative border box-border`}
        style={{
          backgroundColor: 'var(--agv-bg-control, rgba(0, 0, 0, 0.06))',
          borderColor: 'var(--agv-border)',
        }}
      >
        {indeterminate ? (
          <div
            className="h-full rounded-full animate-pulse"
            style={{
              width: '60%',
              backgroundColor: color,
              animation: 'agv-progress-indeterminate 1.5s infinite linear',
            }}
          />
        ) : (
          <div
            className="h-full rounded-full transition-all duration-300 ease-out"
            style={{
              width: `${percentage}%`,
              backgroundColor: color,
            }}
          />
        )}
      </div>
    </div>
  );
};
