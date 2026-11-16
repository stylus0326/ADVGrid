import React, { useState, useRef, useCallback, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  getPortalThemeVars,
  getThemeClass,
  SURFACE_THEMES,
  areEditorCoordsEqual,
  useClickOutside,
} from './enterpriseEditorUtils';

export type AdvPopoverPlacement =
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'auto';

export interface AdvPopoverVirtualAnchor {
  left: number;
  top: number;
  right?: number;
  bottom?: number;
  width?: number;
  height?: number;
}

interface PopoverCoords {
  top: number;
  left: number;
  isFlipUp: boolean;
  arrowLeft: number;
}

function arePopoverCoordsEqual(a: PopoverCoords, b: PopoverCoords): boolean {
  return (
    areEditorCoordsEqual(a, b) &&
    a.isFlipUp === b.isFlipUp &&
    a.arrowLeft === b.arrowLeft
  );
}

function resolveAnchorRect(
  anchorEl: HTMLElement | null,
  virtualAnchor?: AdvPopoverVirtualAnchor | null
): { left: number; top: number; right: number; bottom: number; width: number; height: number } | null {
  if (virtualAnchor) {
    const width = virtualAnchor.width ?? 0;
    const height = virtualAnchor.height ?? 0;
    return {
      left: virtualAnchor.left,
      top: virtualAnchor.top,
      right: virtualAnchor.right ?? virtualAnchor.left + width,
      bottom: virtualAnchor.bottom ?? virtualAnchor.top + height,
      width,
      height,
    };
  }
  if (!anchorEl) return null;
  const r = anchorEl.getBoundingClientRect();
  return {
    left: r.left,
    top: r.top,
    right: r.right,
    bottom: r.bottom,
    width: r.width,
    height: r.height,
  };
}

function computePopoverCoords(
  anchorEl: HTMLElement | null,
  virtualAnchor: AdvPopoverVirtualAnchor | null | undefined,
  contentEl: HTMLElement | null,
  placement: AdvPopoverPlacement,
  offset: number,
  fallbackWidth: number
): PopoverCoords | null {
  if (typeof window === 'undefined') return null;
  const rect = resolveAnchorRect(anchorEl, virtualAnchor);
  if (!rect) return null;
  const vh = window.innerHeight;
  const vw = window.innerWidth;

  const popupW = contentEl ? contentEl.offsetWidth : fallbackWidth;
  const popupH = contentEl ? contentEl.offsetHeight : 180;

  const spaceBelow = vh - rect.bottom - offset - 12;
  const spaceAbove = rect.top - offset - 12;
  const preferTop = placement === 'top' || placement === 'top-start' || placement === 'top-end';
  const shouldFlip = preferTop
    ? !(spaceAbove < popupH && spaceBelow > spaceAbove)
    : spaceBelow < popupH && spaceAbove > spaceBelow;

  let left: number;
  // Center arrow neatly over narrow triggers (< 32px) or point virtual anchors (0px)
  // so rounded corners (12px radius) don't clamp the arrow off-center.
  const narrowOverhang = rect.width > 0 && rect.width < 32 ? Math.ceil((32 - rect.width) / 2) : 0;
  if (placement === 'bottom-end' || placement === 'top-end') {
    left = Math.round(rect.right + narrowOverhang - popupW);
  } else if (placement === 'bottom' || placement === 'top') {
    left = Math.round(rect.left + rect.width / 2 - popupW / 2);
  } else if (rect.width === 0) {
    left = Math.round(rect.left - 15);
  } else {
    left = Math.round(rect.left - narrowOverhang);
  }

  const maxLeft = Math.max(12, vw - popupW - 12);
  if (left > maxLeft) left = maxLeft;
  if (left < 12) left = 12;

  const rawTop = shouldFlip
    ? Math.round(rect.top - popupH - offset)
    : Math.round(rect.bottom + offset);
  const top = Math.max(12, Math.min(Math.max(12, vh - popupH - 12), rawTop));

  const triggerCenterX = rect.left + rect.width / 2;
  const arrowLeft = Math.max(
    10,
    Math.min(Math.max(10, popupW - 20), Math.round(triggerCenterX - left - 5))
  );

  return { top, left, isFlipUp: shouldFlip, arrowLeft };
}

export const DEFAULT_POPOVER_IGNORE_SELECTORS =
  '.agv-select-portal, .agv-portal-dropdown, .agv-calendar-popover, .agv-daterange-popover, .agv-preset-dropdown-menu, .agv-floating-popup, .agv-multi-filter-popup, .agv-multi-filter-op-menu, .agv-query-dropdown, .agv-lookup-op-menu';

export interface AdvAnchoredPopoverProps {
  isOpen: boolean;
  anchorEl?: HTMLElement | null;
  virtualAnchor?: AdvPopoverVirtualAnchor | null;
  onClose: () => void;
  children: React.ReactNode;
  placement?: AdvPopoverPlacement;
  showArrow?: boolean;
  offset?: number;
  theme?: string;
  width?: number | string;
  minWidth?: number;
  maxWidth?: string;
  paddingClassName?: string;
  contentClassName?: string;
  zIndex?: number;
  ignoreClickOutsideSelectors?: string;
}

/**
 * Portal Popover neo theo phần tử tham chiếu bất kỳ (tham khảo Element Plus Popover: placement, offset, showArrow, click outside, ESC).
 */
export const AdvAnchoredPopover: React.FC<AdvAnchoredPopoverProps> = ({
  isOpen,
  anchorEl = null,
  virtualAnchor = null,
  onClose,
  children,
  placement = 'bottom-end',
  showArrow = true,
  offset,
  theme = SURFACE_THEMES.LIGHT,
  width = 'auto',
  minWidth = 200,
  maxWidth = 'calc(100vw - 24px)',
  paddingClassName = 'p-3',
  contentClassName = '',
  zIndex = 1250,
  ignoreClickOutsideSelectors = `${DEFAULT_POPOVER_IGNORE_SELECTORS}, [data-agv-popover-trigger="true"]`,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLElement | null>(anchorEl);
  anchorRef.current = anchorEl;
  const virtualAnchorRef = useRef<AdvPopoverVirtualAnchor | null>(virtualAnchor);
  virtualAnchorRef.current = virtualAnchor;

  const hasAnchor = Boolean(anchorEl || virtualAnchor);
  const resolvedOffset = offset ?? (showArrow ? 10 : 6);
  const fallbackWidth = typeof width === 'number' ? width : minWidth;

  const [coords, setCoords] = useState<PopoverCoords | null>(null);

  const updateCoords = useCallback(() => {
    const next = computePopoverCoords(
      anchorRef.current,
      virtualAnchorRef.current,
      contentRef.current,
      placement,
      resolvedOffset,
      fallbackWidth
    );
    if (!next) return;
    setCoords((prev) => (prev && arePopoverCoordsEqual(prev, next) ? prev : next));
  }, [placement, resolvedOffset, fallbackWidth]);

  useLayoutEffect(() => {
    if (!isOpen || !hasAnchor) {
      setCoords(null);
      return;
    }
    updateCoords();
    const rafId = requestAnimationFrame(updateCoords);
    return () => cancelAnimationFrame(rafId);
  }, [
    isOpen,
    hasAnchor,
    anchorEl,
    virtualAnchor?.left,
    virtualAnchor?.top,
    virtualAnchor?.width,
    virtualAnchor?.height,
    updateCoords,
  ]);

  useEffect(() => {
    if (!isOpen || !contentRef.current || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => {
      updateCoords();
    });
    ro.observe(contentRef.current);
    return () => ro.disconnect();
  }, [isOpen, updateCoords, coords !== null]);

  useClickOutside(
    isOpen && hasAnchor,
    onClose,
    updateCoords,
    anchorRef,
    contentRef,
    undefined,
    ignoreClickOutsideSelectors
  );

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !hasAnchor || !coords || typeof document === 'undefined') {
    return null;
  }

  const themeVars = getPortalThemeVars(theme);
  const themeClass = getThemeClass(theme);

  return createPortal(
    <div
      className={`fixed inset-0 pointer-events-none ${themeClass}`}
      style={{ ...themeVars, zIndex }}
    >
      <div
        ref={contentRef}
        data-agv-popup="true"
        onClick={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
        className={`agv-popup-panel pointer-events-auto absolute ${paddingClassName} select-none ${
          coords.isFlipUp ? 'agv-spring-up' : 'agv-spring-down'
        } ${contentClassName}`}
        style={{
          top: `${coords.top}px`,
          left: `${coords.left}px`,
          width: typeof width === 'number' ? `${width}px` : width,
          minWidth: `${minWidth}px`,
          maxWidth,
          backgroundColor: 'var(--popup-background)',
          borderColor: 'var(--popup-border)',
          color: 'var(--popover-foreground)',
          boxShadow: 'var(--popup-shadow)',
        }}
      >
        {showArrow && (
          <div
            aria-hidden="true"
            className={`absolute w-2.5 h-2.5 rotate-45 border pointer-events-none ${
              coords.isFlipUp
                ? '-bottom-[6px] border-t-0 border-l-0'
                : '-top-[6px] border-b-0 border-r-0'
            }`}
            style={{
              left: `${coords.arrowLeft}px`,
              backgroundColor: 'var(--popup-background)',
              borderColor: 'var(--popup-border)',
            }}
          />
        )}
        {children}
      </div>
    </div>,
    document.body
  );
};

export interface AdvPopoverProps {
  trigger: React.ReactNode;
  content: React.ReactNode | ((props: { close: () => void }) => React.ReactNode);
  isOpen?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: AdvPopoverPlacement;
  showArrow?: boolean;
  offset?: number;
  theme?: string;
  className?: string;
  contentClassName?: string;
  width?: number | string;
  minWidth?: number;
}

export const AdvPopover: React.FC<AdvPopoverProps> = ({
  trigger,
  content,
  isOpen: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  placement = 'bottom-end',
  showArrow = true,
  offset,
  theme = SURFACE_THEMES.LIGHT,
  className = '',
  contentClassName = '',
  width = 'auto',
  minWidth = 200,
}) => {
  const isControlled = controlledOpen !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = isControlled ? controlledOpen : internalOpen;

  const triggerRef = useRef<HTMLDivElement>(null);

  const setOpen = useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setInternalOpen(nextOpen);
      }
      onOpenChange?.(nextOpen);
    },
    [isControlled, onOpenChange]
  );

  const close = useCallback(() => setOpen(false), [setOpen]);
  const toggle = useCallback(() => {
    setOpen(!open);
  }, [open, setOpen]);

  return (
    <>
      <div
        ref={triggerRef}
        onClick={toggle}
        className={`inline-flex shrink-0 ${className}`}
      >
        {trigger}
      </div>

      <AdvAnchoredPopover
        isOpen={open}
        anchorEl={triggerRef.current}
        onClose={close}
        placement={placement}
        showArrow={showArrow}
        offset={offset}
        theme={theme}
        width={width}
        minWidth={minWidth}
        contentClassName={contentClassName}
        ignoreClickOutsideSelectors={DEFAULT_POPOVER_IGNORE_SELECTORS}
      >
        {typeof content === 'function' ? content({ close }) : content}
      </AdvAnchoredPopover>
    </>
  );
};
