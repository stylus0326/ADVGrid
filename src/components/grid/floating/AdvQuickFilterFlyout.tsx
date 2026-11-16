import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { NO_AUTOFILL_PROPS } from '../constants';

export interface AdvQuickFilterFlyoutProps {
  quickFilterText: string;
  isQuickFilterSmart: boolean;
  onToggleSmart: () => void;
  onCommitFilter: (val: string) => void;
  onClose: () => void;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  embedded?: boolean;
}

export const AdvQuickFilterFlyout = React.memo(function AdvQuickFilterFlyout({
  quickFilterText,
  isQuickFilterSmart,
  onToggleSmart,
  onCommitFilter,
  onClose,
  inputRef: externalInputRef,
  embedded = false,
}: AdvQuickFilterFlyoutProps) {
  const [localVal, setLocalVal] = useState(quickFilterText || '');
  const internalInputRef = useRef<HTMLInputElement | null>(null);
  const inputRef = externalInputRef || internalInputRef;
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setLocalVal(quickFilterText || '');
  }, [quickFilterText]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, []);

  const commit = (val: string) => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = null;
    setLocalVal(val);
    onCommitFilter(val);
  };

  const handleChange = (val: string) => {
    setLocalVal(val);
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      commit(val);
    }, 250);
  };

  return (
    <div
      data-agv-popup="true"
      className={
        embedded
          ? 'relative flex w-[280px] max-w-[calc(100vw-48px)] min-h-[28px] h-7 items-center gap-1.5'
          : 'agv-popup-panel absolute left-[calc(100%+8px)] top-1/2 -translate-y-1/2 z-[1210] flex w-[280px] min-h-[32px] items-center gap-1.5 rounded-md border px-1.5 py-0.5 agv-spring-right'
      }
      style={
        embedded
          ? undefined
          : {
              backgroundColor: 'var(--popup-background)',
              borderColor: 'var(--brand, var(--agv-accent))',
              boxShadow: 'var(--popup-shadow)',
            }
      }
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => {
          onToggleSmart();
          inputRef.current?.focus();
        }}
        className="flex h-6 w-6 min-h-[24px] min-w-[24px] shrink-0 items-center justify-center rounded transition-colors cursor-pointer"
        style={{
          color: isQuickFilterSmart ? 'var(--agv-accent)' : 'var(--agv-text-muted)',
          backgroundColor: isQuickFilterSmart
            ? 'color-mix(in srgb, var(--agv-accent) 12%, transparent)'
            : 'transparent',
        }}
        aria-label={
          isQuickFilterSmart
            ? 'Chế độ tìm kiếm tách từ đang bật'
            : 'Chế độ tìm kiếm nguyên cụm đang bật'
        }
      >
        <Search className="h-3.5 w-3.5" />
      </button>

      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type="text"
        {...NO_AUTOFILL_PROPS}
        name="agv_quick_filter_floating"
        autoFocus
        value={localVal}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            commit(e.currentTarget.value);
          } else if (e.key === 'Escape') {
            commit('');
            onClose();
          }
        }}
        placeholder="Tìm kiếm nhanh..."
        className="h-7 min-h-[28px] flex-1 min-w-0 border-none bg-transparent px-1 text-xs outline-none placeholder:text-[var(--agv-text-muted)]"
        style={{ color: 'var(--agv-text-main)' }}
      />

      {localVal && (
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            commit('');
            inputRef.current?.focus();
          }}
          className="agv-inline-clear-ghost flex h-5 w-5 shrink-0 items-center justify-center rounded cursor-pointer"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
});
