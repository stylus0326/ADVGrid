import React, { useState, useRef, useCallback, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  areEditorCoordsEqual,
  getPortalThemeVars,
  getThemeClass,
  SURFACE_THEMES,
} from './enterpriseEditorUtils';

export interface AdvTooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  delay?: number;
  placement?: 'top' | 'bottom' | 'auto';
  theme?: string;
  disabled?: boolean;
  className?: string;
}

export const AdvTooltip: React.FC<AdvTooltipProps> = ({
  content,
  children,
  delay = 200,
  placement = 'auto',
  theme = SURFACE_THEMES.LIGHT,
  disabled = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const timerRef = useRef<any>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const [coords, setCoords] = useState<{
    top: number;
    left: number;
    isFlipUp: boolean;
  } | null>(null);

  const updateCoords = useCallback(() => {
    if (!triggerRef.current || typeof window === 'undefined') return;
    const rect = triggerRef.current.getBoundingClientRect();
    const vh = window.innerHeight;
    const vw = window.innerWidth;

    const tipW = tooltipRef.current ? tooltipRef.current.offsetWidth : 120;
    const tipH = tooltipRef.current ? tooltipRef.current.offsetHeight : 28;

    const spaceBelow = vh - rect.bottom - 6;
    const spaceAbove = rect.top - 6;

    const shouldFlip = placement === 'top' || (placement === 'auto' && spaceAbove > 36 && spaceBelow < 40);

    let left = Math.round(rect.left + rect.width / 2 - tipW / 2);
    if (left + tipW > vw - 8) {
      left = Math.max(8, vw - tipW - 8);
    }
    if (left < 8) left = 8;

    const top = shouldFlip
      ? Math.max(8, Math.round(rect.top - tipH - 6))
      : Math.round(rect.bottom + 6);

    const next = { top, left, isFlipUp: shouldFlip };
    setCoords((prev) => (prev && areEditorCoordsEqual(prev, next) ? prev : next));
  }, [placement]);

  useLayoutEffect(() => {
    if (isOpen) {
      updateCoords();
    }
  }, [isOpen, updateCoords]);

  const handleMouseEnter = () => {
    if (disabled || !content) return;
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      updateCoords();
      setIsOpen(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    clearTimeout(timerRef.current);
    setIsOpen(false);
  };

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleScroll = () => {
      clearTimeout(timerRef.current);
      setIsOpen(false);
    };
    window.addEventListener('scroll', handleScroll, { passive: true, capture: true });
    return () => window.removeEventListener('scroll', handleScroll, { capture: true });
  }, [isOpen]);

  const themeVars = getPortalThemeVars(theme);
  const themeClass = getThemeClass(theme);

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`inline-flex shrink-0 ${className}`}
      >
        {children}
      </div>

      {isOpen && coords && !disabled && Boolean(content) && typeof document !== 'undefined' &&
        createPortal(
          <div
            className={`fixed inset-0 pointer-events-none z-[999999] ${themeClass}`}
            style={themeVars}
          >
            <div
              ref={tooltipRef}
              className={`agv-popup-panel absolute px-2.5 py-1 text-xs font-sans select-none whitespace-nowrap ${
                coords.isFlipUp ? 'agv-spring-up' : 'agv-spring-down'
              }`}
              style={{
                top: `${coords.top}px`,
                left: `${coords.left}px`,
                backgroundColor: 'var(--popup-background)',
                color: 'var(--popover-foreground)',
                borderColor: 'var(--popup-border)',
                boxShadow: 'var(--popup-shadow)',
              }}
            >
              {content}
            </div>
          </div>,
          document.body
        )}
    </>
  );
};
