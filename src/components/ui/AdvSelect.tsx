import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';
import {
  getPortalThemeVars,
  getThemeClass,
  computeEditorCoords,
  useClickOutside,
} from './enterpriseEditorUtils';

export interface AdvSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface AdvSelectProps {
  value?: string;
  defaultValue?: string;
  onChange?: (val: string) => void;
  options: (string | AdvSelectOption)[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  theme?: string;
  size?: 'sm' | 'md';
  width?: number | string;
}

export const AdvSelect: React.FC<AdvSelectProps> = ({
  value: controlledVal,
  defaultValue = '',
  onChange,
  options = [],
  placeholder = 'Chọn một mục...',
  disabled = false,
  className = '',
  style = {},
  theme = 'bezier-arthouse',
  size = 'sm',
  width = '100%',
}) => {
  const isControlled = controlledVal !== undefined;
  const [internalVal, setInternalVal] = useState<string>(isControlled ? controlledVal : defaultValue);
  const curVal = isControlled ? controlledVal : internalVal;

  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const [coords, setCoords] = useState<{
    top: number;
    bottom?: number;
    left: number;
    width: number;
    maxHeight: number;
    isFlipUp?: boolean;
  } | null>(null);

  const normalizedOptions = useMemo<AdvSelectOption[]>(() => {
    return options.map((opt) => {
      if (typeof opt === 'string') return { value: opt, label: opt };
      return opt;
    });
  }, [options]);

  const selectedOption = useMemo(() => {
    return normalizedOptions.find((o) => o.value === curVal);
  }, [normalizedOptions, curVal]);

  const updateCoords = useCallback(() => {
    if (!triggerRef.current) return;
    const c = computeEditorCoords(triggerRef.current, 240, 140);
    setCoords(c);
  }, []);

  const openDropdown = useCallback(() => {
    if (disabled) return;
    updateCoords();
    setIsOpen(true);
    const idx = normalizedOptions.findIndex((o) => o.value === curVal);
    setHighlightedIndex(idx >= 0 ? idx : 0);
  }, [disabled, updateCoords, normalizedOptions, curVal]);

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
    setHighlightedIndex(-1);
  }, []);

  const toggleDropdown = useCallback(() => {
    if (isOpen) closeDropdown();
    else openDropdown();
  }, [isOpen, closeDropdown, openDropdown]);

  useClickOutside(isOpen, closeDropdown, updateCoords, triggerRef, popupRef);

  const handleSelect = useCallback(
    (optVal: string) => {
      if (!isControlled) {
        setInternalVal(optVal);
      }
      onChange?.(optVal);
      closeDropdown();
      triggerRef.current?.focus();
    },
    [isControlled, onChange, closeDropdown]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) {
        openDropdown();
      } else {
        setHighlightedIndex((prev) => (prev < normalizedOptions.length - 1 ? prev + 1 : 0));
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!isOpen) {
        openDropdown();
      } else {
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : normalizedOptions.length - 1));
      }
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!isOpen) {
        openDropdown();
      } else if (highlightedIndex >= 0 && normalizedOptions[highlightedIndex]) {
        const item = normalizedOptions[highlightedIndex];
        if (!item.disabled) handleSelect(item.value);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      closeDropdown();
    }
  };

  const themeVars = getPortalThemeVars(theme);
  const themeClass = getThemeClass(theme);

  return (
    <div
      className={`relative inline-block select-none ${className}`}
      style={{ width, ...style }}
    >
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={toggleDropdown}
        onKeyDown={handleKeyDown}
        className={`w-full flex items-center justify-between gap-2 px-2.5 rounded-md text-xs font-normal border transition-colors outline-none cursor-pointer min-h-[28px] box-border ${
          size === 'md' ? 'h-[32px] text-sm' : 'h-[28px]'
        } ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-[var(--agv-border-strong)]'
        } ${
          isOpen ? 'border-[var(--agv-accent)] ring-1 ring-[var(--agv-accent)]' : 'border-[var(--agv-border)]'
        }`}
        style={{
          backgroundColor: 'var(--agv-bg-control, transparent)',
          color: selectedOption ? 'var(--agv-text-main)' : 'var(--agv-text-muted)',
        }}
      >
        <span className="truncate text-left flex-1">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          size={14}
          strokeWidth={2}
          className={`shrink-0 transition-transform duration-150 ${
            isOpen ? 'rotate-180 text-[var(--agv-accent)]' : 'text-[var(--agv-text-muted)]'
          }`}
        />
      </button>

      {isOpen && coords && typeof document !== 'undefined' &&
        createPortal(
          <div
            className={`fixed inset-0 pointer-events-none z-[999999] ${themeClass}`}
            style={themeVars}
          >
            <div
              ref={popupRef}
              data-agv-popup="true"
              onClick={(e) => e.stopPropagation()}
              className={`pointer-events-auto absolute p-1 rounded-md border select-none overflow-y-auto max-h-[240px] shadow-xl ${
                coords.isFlipUp ? 'agv-spring-up' : 'agv-spring-down'
              }`}
              style={{
                top: coords.isFlipUp ? undefined : `${coords.top}px`,
                bottom: coords.isFlipUp ? `${coords.bottom}px` : undefined,
                left: `${coords.left}px`,
                width: `${coords.width}px`,
                backgroundColor: 'var(--agv-bg-popup)',
                borderColor: 'var(--agv-border)',
                color: 'var(--agv-text-main)',
                boxShadow: '0 12px 28px -4px rgba(0, 0, 0, 0.25), 0 4px 10px -2px rgba(0, 0, 0, 0.1)',
              }}
            >
              {normalizedOptions.length === 0 ? (
                <div className="px-2.5 py-1.5 text-xs text-[var(--agv-text-muted)] text-center">
                  Không có tùy chọn
                </div>
              ) : (
                <div className="space-y-0.5">
                  {normalizedOptions.map((opt, idx) => {
                    const isSelected = opt.value === curVal;
                    const isHighlighted = idx === highlightedIndex;

                    return (
                      <button
                        key={opt.value}
                        type="button"
                        disabled={opt.disabled}
                        onClick={() => !opt.disabled && handleSelect(opt.value)}
                        onMouseEnter={() => !opt.disabled && setHighlightedIndex(idx)}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs text-left transition cursor-pointer min-h-[28px] ${
                          opt.disabled ? 'opacity-40 cursor-not-allowed' : ''
                        }`}
                        style={
                          isHighlighted
                            ? {
                                backgroundColor: 'var(--agv-accent)',
                                color: 'var(--agv-accent-text, #ffffff)',
                              }
                            : isSelected
                            ? {
                                backgroundColor: 'var(--agv-bg-item-active, rgba(0,0,0,0.06))',
                                color: 'var(--agv-text-main)',
                              }
                            : {
                                color: 'var(--agv-text-main)',
                              }
                        }
                      >
                        <span className={`truncate ${isSelected ? 'font-semibold' : ''}`}>
                          {opt.label}
                        </span>
                        {isSelected && (
                          <Check
                            size={13}
                            strokeWidth={2.5}
                            className="shrink-0 ml-1.5"
                            style={{
                              color: isHighlighted ? 'var(--agv-accent-text, #ffffff)' : 'var(--agv-accent)',
                            }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};
