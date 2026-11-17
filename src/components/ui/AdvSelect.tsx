import React, { useState, useRef, useCallback, useEffect, useLayoutEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';
import {
  getPortalThemeVars,
  getThemeClass,
  SURFACE_THEMES,
  computeEditorCoords,
  areEditorCoordsEqual,
  computeDropdownPageStep,
  computeNextHighlightedIndex,
  scrollDropdownItemIntoView,
  useClickOutside,
} from './enterpriseEditorUtils';
import { getGridControlRadiusClass } from '../grid/constants';
import {
  POPUP_PANEL_CLASS,
  ControlVariant,
  getControlSurfaceClasses,
} from './controlFocus';
import { AdvOverlayScroll } from './AdvOverlayScroll';
import { useVirtualList } from './useVirtualList';

const SELECT_ROW_STRIDE = 30;
const SELECT_MAX_HEIGHT = 240;

export interface AdvSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface AdvSelectProps {
  id?: string;
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
  variant?: ControlVariant;
  leadingIcon?: React.ReactNode;
  width?: number | string;
  invalid?: boolean;
  'aria-invalid'?: React.AriaAttributes['aria-invalid'];
  'aria-describedby'?: string;
  'aria-errormessage'?: string;
}

export const AdvSelect: React.FC<AdvSelectProps> = ({
  id,
  value: controlledVal,
  defaultValue = '',
  onChange,
  options = [],
  placeholder = 'Chọn một mục...',
  disabled = false,
  className = '',
  style = {},
  theme = SURFACE_THEMES.LIGHT,
  size = 'sm',
  variant = 'default',
  leadingIcon,
  width = '100%',
  invalid,
  'aria-invalid': ariaInvalidProp,
  'aria-describedby': ariaDescribedBy,
  'aria-errormessage': ariaErrorMessage,
}) => {
  const isInvalid = Boolean(invalid || ariaInvalidProp);
  const isControlled = controlledVal !== undefined;
  const [internalVal, setInternalVal] = useState<string>(isControlled ? controlledVal : defaultValue);
  const curVal = isControlled ? controlledVal : internalVal;

  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isKeyboardNav, setIsKeyboardNav] = useState(false);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const scrollViewportRef = useRef<HTMLDivElement>(null);
  const navSourceRef = useRef<'pointer' | 'keyboard' | 'init'>('init');
  const isKeyboardNavRef = useRef(false);

  const setKeyboardNavActive = useCallback((active: boolean) => {
    if (isKeyboardNavRef.current === active) return;
    isKeyboardNavRef.current = active;
    setIsKeyboardNav(active);
  }, []);

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

  const optionIndexMap = useMemo(() => {
    const map = new Map<string, number>();
    for (let i = 0; i < normalizedOptions.length; i++) {
      const val = normalizedOptions[i].value;
      if (!map.has(val)) map.set(val, i);
    }
    return map;
  }, [normalizedOptions]);

  const selectedIndex = optionIndexMap.get(curVal) ?? -1;
  const selectedOption = selectedIndex >= 0 ? normalizedOptions[selectedIndex] : undefined;

  const updateCoords = useCallback(() => {
    if (!triggerRef.current) return;
    const c = computeEditorCoords(triggerRef.current, 240, 140);
    setCoords((prev) => (areEditorCoordsEqual(prev, c) ? prev : c));
  }, []);

  const openDropdown = useCallback((fromKeyboard = false) => {
    if (disabled) return;
    updateCoords();
    navSourceRef.current = fromKeyboard ? 'keyboard' : 'init';
    setKeyboardNavActive(fromKeyboard);
    setIsOpen(true);
    const idx = optionIndexMap.get(curVal) ?? -1;
    setHighlightedIndex(idx >= 0 ? idx : 0);
  }, [disabled, updateCoords, optionIndexMap, curVal, setKeyboardNavActive]);

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
    setKeyboardNavActive(false);
    setHighlightedIndex(-1);
  }, [setKeyboardNavActive]);

  const toggleDropdown = useCallback(() => {
    if (isOpen) closeDropdown();
    else openDropdown(false);
  }, [isOpen, closeDropdown, openDropdown]);

  const maxPopupViewportHeight = coords
    ? Math.min(SELECT_MAX_HEIGHT - 2, Math.max(118, coords.maxHeight - 2))
    : SELECT_MAX_HEIGHT - 2;

  const virtual = useVirtualList({
    itemCount: normalizedOptions.length,
    itemHeight: SELECT_ROW_STRIDE,
    viewportRef: scrollViewportRef,
    overscan: 6,
    threshold: 40,
    enabled: isOpen,
    defaultViewportHeight: maxPopupViewportHeight,
  });

  useClickOutside(isOpen, closeDropdown, updateCoords, triggerRef, popupRef);

  useLayoutEffect(() => {
    if (!isOpen || navSourceRef.current === 'pointer') return;
    if (virtual.isVirtualized) {
      virtual.scrollToIndex(highlightedIndex, 4, 4);
      return;
    }
    const container = scrollViewportRef.current;
    if (!container) return;
    const itemEl = container.querySelector<HTMLElement>(`[data-select-idx="${highlightedIndex}"]`);
    if (itemEl) {
      scrollDropdownItemIntoView(container, itemEl, 4, 4);
    }
  }, [isOpen, highlightedIndex, normalizedOptions.length, virtual.isVirtualized, virtual.scrollToIndex]);

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
    if (
      e.key === 'ArrowDown' ||
      e.key === 'ArrowUp' ||
      e.key === 'PageDown' ||
      e.key === 'PageUp' ||
      e.key === 'Home' ||
      e.key === 'End'
    ) {
      e.preventDefault();
      if (!isOpen) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          openDropdown(true);
        }
      } else if (normalizedOptions.length > 0) {
        const container = scrollViewportRef.current;
        const firstItem = container?.querySelector<HTMLElement>('[data-select-idx]');
        const pageStep = computeDropdownPageStep(
          container?.clientHeight || 232,
          virtual.isVirtualized ? SELECT_ROW_STRIDE : firstItem?.offsetHeight || 28,
          6
        );
        navSourceRef.current = 'keyboard';
        setKeyboardNavActive(true);
        setHighlightedIndex((prev) => {
          const next = computeNextHighlightedIndex(e.key, prev, normalizedOptions.length, pageStep);
          return next !== null ? next : prev;
        });
      }
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!isOpen) {
        openDropdown(true);
      } else if (highlightedIndex >= 0 && normalizedOptions[highlightedIndex]) {
        const item = normalizedOptions[highlightedIndex];
        if (!item.disabled) handleSelect(item.value);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      closeDropdown();
    }
  };

  const renderOptionRow = (opt: AdvSelectOption, idx: number, isVirtualRow: boolean) => {
    const isSelected = opt.value === curVal;
    const isHighlighted = isKeyboardNav && idx === highlightedIndex;

    return (
      <button
        key={opt.value}
        type="button"
        data-select-idx={idx}
        disabled={opt.disabled}
        onClick={() => !opt.disabled && handleSelect(opt.value)}
        className={`agv-popup-item justify-between ${
          isVirtualRow ? 'h-[28px] min-h-[28px] mb-[2px]' : ''
        } ${
          isSelected ? 'is-selected' : isHighlighted ? 'is-highlighted' : ''
        }`.trim()}
      >
        <span className="truncate">{opt.label}</span>
        {isSelected && (
          <Check
            size={13}
            strokeWidth={2.5}
            className="shrink-0 ml-1.5"
          />
        )}
      </button>
    );
  };

  const themeVars = getPortalThemeVars(theme);
  const themeClass = getThemeClass(theme);

  return (
    <div
      data-theme={theme || undefined}
      className={`relative inline-block select-none ${themeClass} ${className}`.trim()}
      style={{ width, ...style }}
    >
      <button
        ref={triggerRef}
        id={id}
        type="button"
        disabled={disabled}
        data-agv-trigger="true"
        data-state={isOpen ? 'open' : 'closed'}
        aria-expanded={isOpen}
        aria-invalid={isInvalid || undefined}
        aria-describedby={ariaDescribedBy}
        aria-errormessage={ariaErrorMessage}
        onClick={toggleDropdown}
        onKeyDown={handleKeyDown}
        className={getControlSurfaceClasses({
          size,
          variant,
          defaultRadiusClass: getGridControlRadiusClass(),
          className: `w-full flex items-center justify-between gap-2 ${
            variant === 'auth' ? 'px-3' : 'px-2.5'
          } font-normal cursor-pointer outline-none ${
            selectedOption ? 'text-foreground' : 'text-muted-foreground'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`.trim(),
        })}
      >
        {leadingIcon ? (
          <span
            aria-hidden="true"
            className="shrink-0 inline-flex items-center text-[var(--agv-text-muted)]"
          >
            {leadingIcon}
          </span>
        ) : null}
        <span className="truncate text-left flex-1">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          size={14}
          strokeWidth={2}
          className={`shrink-0 transition-transform duration-150 ${
            isOpen ? 'rotate-180 text-brand' : 'text-muted-foreground'
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
              onMouseMove={() => {
                if (isKeyboardNavRef.current) {
                  navSourceRef.current = 'pointer';
                  setKeyboardNavActive(false);
                }
              }}
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
              className={`agv-select-portal agv-portal-dropdown pointer-events-auto absolute ${POPUP_PANEL_CLASS} overflow-hidden select-none ${
                coords.isFlipUp ? 'agv-spring-up' : 'agv-spring-down'
              }`}
              style={{
                top: coords.isFlipUp ? undefined : `${coords.top}px`,
                bottom: coords.isFlipUp ? `${coords.bottom}px` : undefined,
                left: `${coords.left}px`,
                width: `${coords.width}px`,
              }}
            >
              <AdvOverlayScroll
                viewportRef={scrollViewportRef}
                onScroll={virtual.handleScroll}
                viewportClassName="overflow-y-auto overflow-x-hidden p-1"
                viewportStyle={{ maxHeight: `${maxPopupViewportHeight}px` }}
                contentSignature={`${normalizedOptions.length}:${virtual.startIndex}:${virtual.endIndex}`}
              >
                {normalizedOptions.length === 0 ? (
                  <div className="px-2.5 py-1.5 text-xs text-muted-foreground text-center">
                    Không có tùy chọn
                  </div>
                ) : virtual.isVirtualized ? (
                  <div style={{ height: `${virtual.totalHeight}px`, position: 'relative' }}>
                    <div style={{ transform: `translate3d(0, ${virtual.offsetY}px, 0)` }}>
                      {normalizedOptions
                        .slice(virtual.startIndex, virtual.endIndex)
                        .map((opt, offset) => renderOptionRow(opt, virtual.startIndex + offset, true))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-0.5">
                    {normalizedOptions.map((opt, idx) => renderOptionRow(opt, idx, false))}
                  </div>
                )}
              </AdvOverlayScroll>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};
