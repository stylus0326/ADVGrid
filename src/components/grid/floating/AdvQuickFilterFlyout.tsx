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
}

export const AdvQuickFilterFlyout = React.memo(function AdvQuickFilterFlyout({
  quickFilterText,
  isQuickFilterSmart,
  onToggleSmart,
  onCommitFilter,
  onClose,
  inputRef: externalInputRef,
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
      className="agv-float-search-flyout"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => {
          onToggleSmart();
          inputRef.current?.focus();
        }}
        className={`agv-float-search-mode-btn ${isQuickFilterSmart ? 'is-smart' : ''}`}
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
        className="agv-float-search-input"
      />

      {localVal && (
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            commit('');
            inputRef.current?.focus();
          }}
          className="agv-float-search-clear"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
});
