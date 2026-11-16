import React from 'react';
import { BUTTON_FOCUS_VISIBLE_CLASS } from '../ui/controlFocus';

export interface StatusTabItem<T extends string = string> {
  value: T;
  label: string;
  count?: number;
}

export interface StatusTabsProps<T extends string = string> {
  items: StatusTabItem<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

/**
 * Thanh tab trạng thái chuẩn `b2b-pnt`:
 * sử dụng gạch chân Brand Gold (`border-b-2 border-brand-gold text-brand-gold-on-light`),
 * dành Teal cho CTA & control focus.
 */
export function StatusTabs<T extends string = string>({
  items,
  value,
  onChange,
  className = '',
}: StatusTabsProps<T>) {
  return (
    <div
      role="tablist"
      className={`flex items-center gap-1 border-b border-border overflow-x-auto overflow-y-hidden ${className}`}
    >
      {items.map((item) => {
        const isActive = item.value === value;
        return (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(item.value)}
            className={`relative inline-flex items-center gap-1.5 min-h-[28px] h-9 px-3 text-label whitespace-nowrap shrink-0 border-b-2 transition-colors ${BUTTON_FOCUS_VISIBLE_CLASS} ${
              isActive
                ? 'border-brand-gold text-brand-gold-on-light font-semibold'
                : 'border-transparent text-muted-foreground font-medium hover:bg-muted/30 hover:text-foreground'
            }`}
          >
            <span>{item.label}</span>
            {typeof item.count === 'number' && (
              <span
                className={`inline-flex items-center justify-center rounded-full px-1.5 py-0.5 text-[11px] leading-none font-mono tabular-nums ${
                  isActive
                    ? 'bg-surface-selected text-brand-gold-on-light'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {item.count.toLocaleString()}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
