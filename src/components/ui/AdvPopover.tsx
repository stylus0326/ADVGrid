import React, { useState, useRef, useCallback, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  getPortalThemeVars,
  getThemeClass,
  useClickOutside,
} from './enterpriseEditorUtils';

export interface AdvPopoverProps {
  trigger: React.ReactNode;
  content: React.ReactNode | ((props: { close: () => void }) => React.ReactNode);
  isOpen?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: 'bottom' | 'top' | 'auto';
  showArrow?: boolean;
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
  placement = 'auto',
  showArrow = false,
  theme = 'bezier-arthouse',
  className = '',
  contentClassName = '',
  width = 'auto',
  minWidth = 200,
}) => {
  const isControlled = controlledOpen !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = isControlled ? controlledOpen : internalOpen;

  const triggerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [coords, setCoords] = useState<{
    top: number;
    left: number;
    isFlipUp: boolean;
  } | null>(null);

  const calculateCoords = useCallback(() => {
    if (!triggerRef.current || typeof window === 'undefined') return null;
    const rect = triggerRef.current.getBoundingClientRect();
    const vh = window.innerHeight;
    const vw = window.innerWidth;

    const popupW = contentRef.current ? contentRef.current.offsetWidth : (typeof width === 'number' ? width : minWidth);
    const popupH = contentRef.current ? contentRef.current.offsetHeight : 180;

    const spaceBelow = vh - rect.bottom - 8;
    const spaceAbove = rect.top - 8;

    const shouldFlip = placement === 'top' || (placement === 'auto' && spaceBelow < popupH && spaceAbove > spaceBelow);

    let left = Math.round(rect.left);
    if (left + popupW > vw - 12) {
      left = Math.max(12, vw - popupW - 12);
    }
    if (left < 12) left = 12;

    const top = shouldFlip
      ? Math.max(12, Math.round(rect.top - popupH - 6))
      : Math.round(rect.bottom + 6);

    return { top, left, isFlipUp: shouldFlip };
  }, [width, minWidth, placement]);

  const updateCoords = useCallback(() => {
    const next = calculateCoords();
    if (next) setCoords(next);
  }, [calculateCoords]);

  const setOpen = useCallback(
    (nextOpen: boolean) => {
      if (nextOpen) {
        updateCoords();
      }
      if (!isControlled) {
        setInternalOpen(nextOpen);
      }
      onOpenChange?.(nextOpen);
    },
    [isControlled, onOpenChange, updateCoords]
  );

  const close = useCallback(() => setOpen(false), [setOpen]);
  const toggle = useCallback(() => {
    if (!open) {
      updateCoords();
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [open, setOpen, updateCoords]);

  useLayoutEffect(() => {
    if (open) {
      updateCoords();
    }
  }, [open, updateCoords]);

  useClickOutside(open, close, updateCoords, triggerRef, contentRef);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, close]);

  const themeVars = getPortalThemeVars(theme);
  const themeClass = getThemeClass(theme);

  return (
    <>
      <div
        ref={triggerRef}
        onClick={toggle}
        className={`inline-flex shrink-0 ${className}`}
      >
        {trigger}
      </div>

      {open && coords && typeof document !== 'undefined' &&
        createPortal(
          <div
            className={`fixed inset-0 pointer-events-none z-[999999] ${themeClass}`}
            style={themeVars}
          >
            <div
              ref={contentRef}
              data-agv-popup="true"
              onClick={(e) => e.stopPropagation()}
              className={`pointer-events-auto absolute p-3 rounded-md border select-none ${
                coords.isFlipUp ? 'agv-spring-up' : 'agv-spring-down'
              } ${contentClassName}`}
              style={{
                top: `${coords.top}px`,
                left: `${coords.left}px`,
                width: typeof width === 'number' ? `${width}px` : width,
                minWidth: `${minWidth}px`,
                backgroundColor: 'var(--agv-bg-popup)',
                borderColor: 'var(--agv-border)',
                color: 'var(--agv-text-main)',
                boxShadow: '0 12px 28px -4px rgba(0, 0, 0, 0.25), 0 4px 10px -2px rgba(0, 0, 0, 0.1)',
              }}
            >
              {showArrow && (
                <div
                  className={`absolute left-4 w-2 h-2 rotate-45 border pointer-events-none ${
                    coords.isFlipUp
                      ? '-bottom-1 border-t-0 border-l-0'
                      : '-top-1 border-b-0 border-r-0'
                  }`}
                  style={{
                    backgroundColor: 'var(--agv-bg-popup)',
                    borderColor: 'var(--agv-border)',
                  }}
                />
              )}
              {typeof content === 'function' ? content({ close }) : content}
            </div>
          </div>,
          document.body
        )}
    </>
  );
};
