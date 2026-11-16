import React, { useState, useRef, useCallback, useMemo, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { Check } from 'lucide-react';
import {
  getPortalThemeVars,
  computeEditorCoords,
  areEditorCoordsEqual,
  computeDropdownPageStep,
  computeNextHighlightedIndex,
  scrollDropdownItemIntoView,
  useClickOutside,
  normalizeSearchText,
  getThemeClass,
  SURFACE_THEMES,
} from './enterpriseEditorUtils';
import { NO_AUTOFILL_PROPS, getGridControlRadiusClass } from '../grid/constants';
import {
  CONTROL_BOX_CLASS,
  POPUP_PANEL_CLASS,
  getControlSizeClass,
} from './controlFocus';
import { AdvOverlayScroll } from './AdvOverlayScroll';
import { useVirtualList } from './useVirtualList';

const COMBO_ROW_STRIDE = 30;

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
  const [searchText, setSearchText] = useState('');
  const curVal = isControlled && !isUserTyping ? value : internalVal;

  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isKeyboardNav, setIsKeyboardNav] = useState(false);
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
  const scrollViewportRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const navSourceRef = useRef<'pointer' | 'keyboard' | 'init'>('init');
  const isKeyboardNavRef = useRef(false);

  const setKeyboardNavActive = useCallback((active: boolean) => {
    if (isKeyboardNavRef.current === active) return;
    isKeyboardNavRef.current = active;
    setIsKeyboardNav(active);
  }, []);

  const normalizedOptions = useMemo<AdvComboBoxEditOption[]>(() => {
    return options.map((opt) => (typeof opt === 'string' ? { value: opt, label: opt } : opt));
  }, [options]);

  const optionIndexMap = useMemo(() => {
    const map = new Map<string, number>();
    for (let i = 0; i < normalizedOptions.length; i++) {
      const opt = normalizedOptions[i];
      if (!map.has(opt.value)) map.set(opt.value, i);
      if (!map.has(opt.label)) map.set(opt.label, i);
    }
    return map;
  }, [normalizedOptions]);

  const checkVal = isControlled ? value : internalVal;
  const matchedIndex = checkVal !== undefined ? (optionIndexMap.get(checkVal) ?? -1) : -1;
  const matchedSelectedOption = matchedIndex >= 0 ? normalizedOptions[matchedIndex] : null;
  const selectedIndex = matchedIndex >= 0 ? matchedIndex : 0;
  const selectedOption = normalizedOptions[selectedIndex] || null;

  const isSelectOnly = !allowCustomInput;
  const displayVal = isSelectOnly
    ? isOpen
      ? searchText
      : matchedSelectedOption
      ? matchedSelectedOption.label
      : curVal
    : isUserTyping
    ? internalVal
    : selectedOption && (selectedOption.value === curVal || selectedOption.label === curVal)
    ? selectedOption.label
    : curVal;

  const activePlaceholder = isSelectOnly && isOpen && matchedSelectedOption
    ? matchedSelectedOption.label
    : placeholder;

  const [highlightedIndex, setHighlightedIndex] = useState(selectedIndex);

  useEffect(() => {
    if (isControlled && value !== undefined && !isUserTyping) {
      setInternalVal(value);
    }
  }, [isControlled, value, isUserTyping]);

  useLayoutEffect(() => {
    if (isOpen && !isUserTyping) {
      const idx = curVal !== undefined ? (optionIndexMap.get(curVal) ?? -1) : -1;
      navSourceRef.current = 'init';
      setHighlightedIndex(idx >= 0 ? idx : 0);
    }
  }, [isOpen, curVal, optionIndexMap, isUserTyping]);

  const searchCacheRef = useRef<{
    optionsRef: AdvComboBoxEditOption[];
    labels: string[];
    values: string[];
  } | null>(null);

  // Bộ lọc danh sách tức thì khi gõ (tiền chuẩn hóa lazy 1 lần theo options)
  const filteredOptions = useMemo<AdvComboBoxEditOption[]>(() => {
    const query = isSelectOnly ? searchText : isUserTyping ? curVal : '';
    if (!query || !query.trim()) return normalizedOptions;
    const q = normalizeSearchText(query);
    if (!q) return normalizedOptions;

    let cache = searchCacheRef.current;
    if (!cache || cache.optionsRef !== normalizedOptions) {
      const len = normalizedOptions.length;
      const labels = new Array<string>(len);
      const values = new Array<string>(len);
      for (let i = 0; i < len; i++) {
        const opt = normalizedOptions[i];
        labels[i] = normalizeSearchText(opt.label);
        values[i] = normalizeSearchText(opt.value);
      }
      cache = { optionsRef: normalizedOptions, labels, values };
      searchCacheRef.current = cache;
    }

    const out: AdvComboBoxEditOption[] = [];
    for (let i = 0; i < normalizedOptions.length; i++) {
      if (cache.labels[i].includes(q) || cache.values[i].includes(q)) {
        out.push(normalizedOptions[i]);
      }
    }
    return out;
  }, [normalizedOptions, isSelectOnly, searchText, isUserTyping, curVal]);

  const updateCoords = useCallback(() => {
    if (triggerRef.current) {
      const next = computeEditorCoords(triggerRef.current, 220, 180);
      setCoords((prev) => (areEditorCoordsEqual(prev, next) ? prev : next));
    }
  }, []);

  useLayoutEffect(() => {
    if (defaultOpen && triggerRef.current) {
      updateCoords();
    }
  }, [defaultOpen, updateCoords]);

  const maxPopupViewportHeight = Math.max(118, coords.maxHeight - 2);

  const virtual = useVirtualList({
    itemCount: filteredOptions.length,
    itemHeight: COMBO_ROW_STRIDE,
    viewportRef: scrollViewportRef,
    overscan: 6,
    threshold: 40,
    enabled: isOpen,
    defaultViewportHeight: maxPopupViewportHeight,
  });

  useLayoutEffect(() => {
    if (!isOpen || navSourceRef.current === 'pointer') return;
    if (virtual.isVirtualized) {
      virtual.scrollToIndex(highlightedIndex, 4, 4);
      return;
    }
    const container = scrollViewportRef.current;
    if (!container) return;
    const itemEl = container.querySelector<HTMLElement>(`[data-combo-idx="${highlightedIndex}"]`);
    if (itemEl) {
      scrollDropdownItemIntoView(container, itemEl, 4, 4);
    }
  }, [isOpen, highlightedIndex, filteredOptions.length, virtual.isVirtualized, virtual.scrollToIndex]);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus({ preventScroll: true });
      inputRef.current.select();
    }
  }, [autoFocus]);

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
    setIsUserTyping(false);
    setSearchText('');
    setKeyboardNavActive(false);
    onClose?.();
  }, [setKeyboardNavActive, onClose]);

  useClickOutside(
    isOpen,
    () => {
      if (isUserTyping && allowCustomInput) {
        onChange?.(internalVal);
      }
      closeDropdown();
    },
    updateCoords,
    triggerRef,
    dropdownRef
  );

  const handleSelect = (optVal: string) => {
    setInternalVal(optVal);
    onChange?.(optVal);
    closeDropdown();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    if (isSelectOnly) {
      setSearchText(v);
      navSourceRef.current = 'keyboard';
      setKeyboardNavActive(v.trim().length > 0);
      setHighlightedIndex(0);
      virtual.resetScroll();
      if (!isOpen) {
        updateCoords();
        setIsOpen(true);
      }
      return;
    }
    setInternalVal(v);
    setIsUserTyping(true);
    navSourceRef.current = 'keyboard';
    setKeyboardNavActive(v.trim().length > 0);
    setHighlightedIndex(0);
    virtual.resetScroll();
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

    const isNavKey =
      e.key === 'ArrowDown' ||
      e.key === 'ArrowUp' ||
      e.key === 'PageDown' ||
      e.key === 'PageUp' ||
      (isSelectOnly && !searchText && (e.key === 'Home' || e.key === 'End'));

    if (isNavKey) {
      e.preventDefault();
      if (!isOpen) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          updateCoords();
          navSourceRef.current = 'init';
          setIsUserTyping(false);
          setSearchText('');
          setKeyboardNavActive(true);
          setIsOpen(true);
          const idx = curVal !== undefined ? (optionIndexMap.get(curVal) ?? -1) : -1;
          setHighlightedIndex(idx >= 0 ? idx : 0);
        }
      } else if (filteredOptions.length > 0) {
        const container = scrollViewportRef.current;
        const firstItem = container?.querySelector<HTMLElement>('[data-combo-idx]');
        const pageStep = computeDropdownPageStep(
          container?.clientHeight || 212,
          virtual.isVirtualized ? COMBO_ROW_STRIDE : firstItem?.offsetHeight || 28,
          6
        );
        navSourceRef.current = 'keyboard';
        setKeyboardNavActive(true);
        setHighlightedIndex((prev) => {
          const next = computeNextHighlightedIndex(e.key, prev, filteredOptions.length, pageStep);
          return next !== null ? next : prev;
        });
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
      } else if (isOpen && isSelectOnly) {
        e.preventDefault();
        closeDropdown();
      } else {
        if (isUserTyping && allowCustomInput) {
          onChange?.(internalVal);
          setIsUserTyping(false);
        }
        setKeyboardNavActive(false);
        if (isOpen) {
          setIsOpen(false);
        }
      }
      return;
    }

    if (e.key === 'Tab' && isOpen) {
      if (isUserTyping && allowCustomInput) {
        onChange?.(internalVal);
      }
      closeDropdown();
      return;
    }

    if (e.key === 'Escape') {
      if (isOpen) {
        e.preventDefault();
        closeDropdown();
      } else {
        onClose?.();
      }
      return;
    }
  };

  const handleTriggerClick = () => {
    if (disabled) return;
    if (!isOpen) {
      updateCoords();
      navSourceRef.current = 'init';
      const idx = curVal !== undefined ? (optionIndexMap.get(curVal) ?? -1) : -1;
      setHighlightedIndex(idx >= 0 ? idx : 0);
      setIsUserTyping(false);
      setSearchText('');
      setKeyboardNavActive(false);
      setIsOpen(true);
    }
    inputRef.current?.focus({ preventScroll: true });
  };

  const renderComboOptionRow = (
    opt: AdvComboBoxEditOption,
    idx: number,
    isVirtualRow: boolean
  ) => {
    const isSelected = opt.value === curVal || opt.label === curVal;
    const isHighlighted = isKeyboardNav && idx === highlightedIndex;

    return (
      <div
        key={opt.value}
        data-combo-idx={idx}
        onClick={(e) => {
          e.stopPropagation();
          handleSelect(opt.value);
        }}
        className={`agv-popup-item justify-between ${
          isVirtualRow ? 'h-[28px] min-h-[28px] mb-[2px]' : ''
        } ${
          isSelected ? 'is-selected' : isHighlighted ? 'is-highlighted' : ''
        }`.trim()}
      >
        <span className="truncate">{opt.label}</span>
        {isSelected && (
          <Check size={13} strokeWidth={2.5} className="ml-1.5 shrink-0" />
        )}
      </div>
    );
  };

  const themeClass = theme ? getThemeClass(theme) : '';

  return (
    <div
      ref={triggerRef}
      data-agv-trigger="true"
      data-theme={theme || undefined}
      data-state={isOpen ? 'open' : 'closed'}
      aria-expanded={isOpen}
      aria-disabled={disabled || undefined}
      style={{
        ...getPortalThemeVars(theme),
        ...style,
      }}
      onClick={handleTriggerClick}
      className={`agv-comboboxedit-wrapper relative inline-flex items-center ${CONTROL_BOX_CLASS} ${getGridControlRadiusClass()} ${getControlSizeClass(
        size
      )} w-full ${isOpen ? 'is-open' : ''} ${
        disabled ? 'opacity-50 pointer-events-none' : 'cursor-text'
      } ${themeClass} ${className}`.trim()}
    >
      {/* Ô nhập thuần túy, tràn viền 100%, không chứa icon phụ theo đúng yêu cầu */}
      <input
        ref={inputRef}
        type="text"
        disabled={disabled}
        value={displayVal}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        onKeyDown={handleKeyDown}
        placeholder={activePlaceholder}
        {...NO_AUTOFILL_PROPS}
        className={`agv-comboboxedit-input w-full h-full bg-transparent border-0 px-2.5 text-foreground outline-none placeholder:text-muted-foreground ${
          size === 'md' ? 'text-sm' : 'text-xs'
        }`}
      />

      {/* Popup Dropdown danh sách qua Portal */}
      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            data-theme={theme || undefined}
            style={{
              position: 'fixed',
              ...(coords.isFlipUp
                ? { bottom: `${coords.bottom}px`, top: 'auto' }
                : { top: `${coords.top}px`, bottom: 'auto' }),
              left: `${coords.left}px`,
              width: `${coords.width}px`,
              maxHeight: `${coords.maxHeight}px`,
              zIndex: 99999999,
              ...getPortalThemeVars(theme),
            }}
            className={`agv-comboboxedit-dropdown ${POPUP_PANEL_CLASS} overflow-hidden select-none text-xs ${
              coords.isFlipUp ? 'agv-spring-up' : 'agv-spring-down'
            } ${themeClass}`}
            data-agv-popup="true"
            onMouseMove={() => {
              if (isKeyboardNavRef.current) {
                navSourceRef.current = 'pointer';
                setKeyboardNavActive(false);
              }
            }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <AdvOverlayScroll
              viewportRef={scrollViewportRef}
              onScroll={virtual.handleScroll}
              viewportClassName="overflow-y-auto overflow-x-hidden p-1"
              viewportStyle={{ maxHeight: `${maxPopupViewportHeight}px` }}
              contentSignature={`${filteredOptions.length}:${virtual.startIndex}:${virtual.endIndex}`}
            >
              {filteredOptions.length === 0 ? (
                <div className="px-3 py-2 text-center text-xs text-muted-foreground select-none">
                  Không tìm thấy kết quả
                </div>
              ) : virtual.isVirtualized ? (
                <div style={{ height: `${virtual.totalHeight}px`, position: 'relative' }}>
                  <div style={{ transform: `translate3d(0, ${virtual.offsetY}px, 0)` }}>
                    {filteredOptions
                      .slice(virtual.startIndex, virtual.endIndex)
                      .map((opt, offset) =>
                        renderComboOptionRow(opt, virtual.startIndex + offset, true)
                      )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-0.5">
                  {filteredOptions.map((opt, idx) => renderComboOptionRow(opt, idx, false))}
                </div>
              )}
            </AdvOverlayScroll>
          </div>,
          document.body
        )}
    </div>
  );
};

export default AdvComboBoxEdit;
