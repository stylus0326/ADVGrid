import React, { useState, useRef, useCallback, useMemo, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { Check } from 'lucide-react';
import {
  getPortalThemeVars,
  computeEditorCoords,
  useClickOutside,
  normalizeSearchText,
  getThemeClass,
  SURFACE_THEMES,
} from './enterpriseEditorUtils';
import { NO_AUTOFILL_PROPS, getGridControlRadiusClass } from '../grid/constants';

/* ==============================================================================
   CONTROL: AdvComboBoxEdit (Animate UI Base UI Architecture)
   Hộp chọn hiện đại: nhấn vào mở popup tức thì, không icon rườm rà, hiệu ứng lò xo
   ============================================================================== */

export interface AdvComboBoxEditOption {
  value: string;
  label: string;
}

export interface AdvComboBoxEditProps {
  value?: string;
  defaultValue?: string;
  onChange?: (val: string) => void;
  options?: (string | AdvComboBoxEditOption)[];
  allowCustomInput?: boolean;
  defaultOpen?: boolean;
  autoFocus?: boolean;
  placeholder?: string;
  size?: 'sm' | 'md';
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  theme?: string;
  onClose?: () => void;
}

export const AdvComboBoxEdit: React.FC<AdvComboBoxEditProps> = ({
  value,
  defaultValue = '',
  onChange,
  options = [],
  allowCustomInput = true,
  defaultOpen = false,
  autoFocus = false,
  placeholder = 'Nhập hoặc chọn...',
  size = 'sm',
  disabled = false,
  className = '',
  style = {},
  theme = '',
  onClose,
}) => {
  const isControlled = value !== undefined;
  const [internalVal, setInternalVal] = useState<string>(isControlled ? value : defaultValue);
  const [isUserTyping, setIsUserTyping] = useState(false);
  const curVal = isControlled && !isUserTyping ? value : internalVal;

  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [coords, setCoords] = useState<{
    top: number;
    left: number;
    bottom?: number;
    width: number;
    maxHeight: number;
    isFlipUp?: boolean;
  }>({ top: 0, left: 0, width: 200, maxHeight: 220 });

  const triggerRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const normalizedOptions = useMemo<AdvComboBoxEditOption[]>(() => {
    return options.map((opt) => (typeof opt === 'string' ? { value: opt, label: opt } : opt));
  }, [options]);

  const selectedIndex = useMemo(() => {
    const checkVal = isControlled ? value : internalVal;
    const idx = normalizedOptions.findIndex((opt) => opt.value === checkVal || opt.label === checkVal);
    return idx >= 0 ? idx : 0;
  }, [normalizedOptions, isControlled, value, internalVal]);

  const selectedOption = useMemo(() => {
    return normalizedOptions[selectedIndex] || null;
  }, [normalizedOptions, selectedIndex]);

  const displayVal = isUserTyping
    ? internalVal
    : selectedOption && (selectedOption.value === curVal || selectedOption.label === curVal)
    ? selectedOption.label
    : curVal;

  const [highlightedIndex, setHighlightedIndex] = useState(selectedIndex);

  useEffect(() => {
    if (isControlled && value !== undefined && !isUserTyping) {
      setInternalVal(value);
    }
  }, [isControlled, value, isUserTyping]);

  useEffect(() => {
    if (isOpen && !isUserTyping) {
      const idx = normalizedOptions.findIndex((opt) => opt.value === curVal || opt.label === curVal);
      setHighlightedIndex(idx >= 0 ? idx : 0);
    }
  }, [isOpen, curVal, normalizedOptions, isUserTyping]);

  // Bộ lọc danh sách tức thì khi gõ
  const filteredOptions = useMemo<AdvComboBoxEditOption[]>(() => {
    if (!isUserTyping) return normalizedOptions;
    if (!curVal || !curVal.trim()) return normalizedOptions;
    const q = normalizeSearchText(curVal);
    return normalizedOptions.filter(
      (opt) =>
        normalizeSearchText(opt.label).includes(q) ||
        normalizeSearchText(opt.value).includes(q)
    );
  }, [normalizedOptions, isUserTyping, curVal]);

  const updateCoords = useCallback(() => {
    if (triggerRef.current) {
      setCoords(computeEditorCoords(triggerRef.current, 220, 180));
    }
  }, []);

  useLayoutEffect(() => {
    if (defaultOpen && triggerRef.current) {
      updateCoords();
    }
  }, [defaultOpen, updateCoords]);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus({ preventScroll: true });
      inputRef.current.select();
    }
  }, [autoFocus]);

  useClickOutside(
    isOpen,
    () => {
      if (isUserTyping && allowCustomInput) {
        onChange?.(internalVal);
      }
      setIsOpen(false);
      setIsUserTyping(false);
      onClose?.();
    },
    updateCoords,
    triggerRef,
    dropdownRef
  );

  const handleSelect = (optVal: string) => {
    setInternalVal(optVal);
    onChange?.(optVal);
    setIsUserTyping(false);
    setIsOpen(false);
    onClose?.();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!allowCustomInput) return;
    const v = e.target.value;
    setInternalVal(v);
    setIsUserTyping(true);
    setHighlightedIndex(0);
    if (!isOpen) {
      updateCoords();
      setIsOpen(true);
    }
  };

  const handleInputBlur = () => {
    if (isUserTyping && allowCustomInput) {
      onChange?.(internalVal);
      setIsUserTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) {
        updateCoords();
        setIsUserTyping(false);
        setIsOpen(true);
        setHighlightedIndex(0);
      } else if (filteredOptions.length > 0) {
        setHighlightedIndex((prev) => (prev + 1) % filteredOptions.length);
      }
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (isOpen && filteredOptions.length > 0) {
        setHighlightedIndex((prev) => (prev - 1 + filteredOptions.length) % filteredOptions.length);
      }
      return;
    }

    if (e.key === 'Enter') {
      if (isOpen && filteredOptions.length > 0) {
        e.preventDefault();
        const targetIdx = highlightedIndex >= 0 && highlightedIndex < filteredOptions.length ? highlightedIndex : 0;
        const matched = filteredOptions[targetIdx];
        if (matched) {
          handleSelect(matched.value);
        }
      } else {
        if (isUserTyping && allowCustomInput) {
          onChange?.(internalVal);
          setIsUserTyping(false);
        }
        if (isOpen) {
          setIsOpen(false);
        }
      }
      return;
    }

    if (e.key === 'Escape') {
      if (isOpen) {
        e.preventDefault();
        setIsOpen(false);
        setIsUserTyping(false);
      }
      onClose?.();
      return;
    }
  };

  const handleTriggerClick = () => {
    if (disabled) return;
    if (!isOpen) {
      updateCoords();
      setIsUserTyping(false);
      setIsOpen(true);
    }
    inputRef.current?.focus({ preventScroll: true });
  };

  const themeClass = theme ? getThemeClass(theme) : '';
  const sizeHeight = size === 'md' ? 'h-8' : 'h-7';

  return (
    <div
      ref={triggerRef}
      style={{ ...getPortalThemeVars(theme), ...style }}
      onClick={handleTriggerClick}
      className={`agv-comboboxedit-wrapper relative inline-flex items-center ${getGridControlRadiusClass()} bg-[var(--agv-bg-control)] min-h-[28px] max-h-[30px] w-full h-full ${sizeHeight} ${
        isOpen
          ? 'is-open border-2 border-[var(--agv-accent)]'
          : 'border border-[var(--agv-border)]'
      } ${disabled ? 'opacity-50 pointer-events-none' : 'cursor-text'} ${themeClass} ${className}`.trim()}
    >
      {/* Ô nhập thuần túy, tràn viền 100%, không chứa icon phụ theo đúng yêu cầu */}
      <input
        ref={inputRef}
        type="text"
        disabled={disabled}
        readOnly={!allowCustomInput}
        value={displayVal}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        {...NO_AUTOFILL_PROPS}
        className={`agv-comboboxedit-input w-full h-full bg-transparent px-2.5 text-xs text-[var(--agv-text-main)] outline-none placeholder:text-[var(--agv-text-muted)] ${
          !allowCustomInput ? 'cursor-pointer select-none' : ''
        }`}
      />

      {/* Popup Dropdown danh sách qua Portal (Chuẩn Animate UI + Base UI) */}
      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            style={{
              position: 'fixed',
              ...(coords.isFlipUp
                ? { bottom: `${coords.bottom}px`, top: 'auto' }
                : { top: `${coords.top}px`, bottom: 'auto' }),
              left: `${coords.left}px`,
              width: `${coords.width}px`,
              maxHeight: `${coords.maxHeight}px`,
              zIndex: 99999999,
              boxShadow: '0 12px 28px -4px rgba(0, 0, 0, 0.25), 0 8px 12px -6px rgba(0, 0, 0, 0.15)',
              ...getPortalThemeVars(theme),
            }}
            className={`agv-comboboxedit-dropdown rounded-md border border-[var(--agv-border-popup)] bg-[var(--agv-bg-popup)] p-1 overflow-y-auto text-xs ${
              coords.isFlipUp ? 'agv-spring-up' : 'agv-spring-down'
            } ${themeClass}`}
            data-agv-popup="true"
            onMouseDown={(e) => e.stopPropagation()}
          >
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-center text-xs text-[var(--agv-text-muted)] select-none">
                Không tìm thấy kết quả
              </div>
            ) : (
              <div className="flex flex-col gap-0.5">
                {filteredOptions.map((opt, idx) => {
                  const isSelected = opt.value === curVal || opt.label === curVal;
                  const isHighlighted = idx === highlightedIndex;

                  let itemClass = 'text-[var(--agv-text-main)] hover:bg-[var(--agv-bg-item-hover)]';
                  if (isSelected) {
                    itemClass = 'bg-[var(--agv-accent)] text-[var(--agv-accent-text,#ffffff)] font-semibold';
                  } else if (isHighlighted) {
                    itemClass = 'bg-[var(--agv-bg-item-hover)] text-[var(--agv-text-main)]';
                  }

                  return (
                    <div
                      key={opt.value}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelect(opt.value);
                      }}
                      onMouseEnter={() => setHighlightedIndex(idx)}
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded cursor-pointer transition-colors text-xs select-none ${itemClass}`}
                    >
                      <span className="truncate">{opt.label}</span>
                      {isSelected && (
                        <Check size={13} strokeWidth={2.5} className="ml-2 shrink-0 text-current" />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>,
          document.body
        )}
    </div>
  );
};

export default AdvComboBoxEdit;
