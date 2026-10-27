import React, { useState, useRef, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { getPortalThemeVars, getThemeClass } from './enterpriseEditorUtils';

export interface AdvHoverCardProps {
  trigger: React.ReactNode;
  content: React.ReactNode;
  openDelay?: number;
  closeDelay?: number;
  width?: number | string;
  theme?: string;
  className?: string;
  contentClassName?: string;
}

export const AdvHoverCard: React.FC<AdvHoverCardProps> = ({
  trigger,
  content,
  openDelay = 150,
  closeDelay = 200,
  width = 280,
  theme = 'bezier-arthouse',
  className = '',
  contentClassName = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const openTimerRef = useRef<any>(null);
  const closeTimerRef = useRef<any>(null);

  const triggerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

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

    const cardW = typeof width === 'number' ? width : 280;
    const cardH = cardRef.current ? cardRef.current.offsetHeight : 160;

    const spaceBelow = vh - rect.bottom - 8;
    const spaceAbove = rect.top - 8;

    const shouldFlip = spaceBelow < cardH && spaceAbove > spaceBelow;

    let left = Math.round(rect.left);
    if (left + cardW > vw - 12) {
      left = Math.max(12, vw - cardW - 12);
    }
    if (left < 12) left = 12;

    const top = shouldFlip
      ? Math.max(12, Math.round(rect.top - cardH - 6))
      : Math.round(rect.bottom + 6);

    setCoords({ top, left, isFlipUp: shouldFlip });
  }, [width]);

  const handleMouseEnter = () => {
    clearTimeout(closeTimerRef.current);
    openTimerRef.current = setTimeout(() => {
      updateCoords();
      setIsOpen(true);
    }, openDelay);
  };

  const handleMouseLeave = () => {
    clearTimeout(openTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      setIsOpen(false);
    }, closeDelay);
  };

  useEffect(() => {
    return () => {
      clearTimeout(openTimerRef.current);
      clearTimeout(closeTimerRef.current);
    };
  }, []);

  // Đóng khi cuộn trang
  useEffect(() => {
    if (!isOpen) return;
    const handleScroll = () => {
      clearTimeout(openTimerRef.current);
      clearTimeout(closeTimerRef.current);
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
        {trigger}
      </div>

      {isOpen && coords && typeof document !== 'undefined' &&
        createPortal(
          <div
            className={`fixed inset-0 pointer-events-none z-[999999] ${themeClass}`}
            style={themeVars}
          >
            <div
              ref={cardRef}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className={`pointer-events-auto absolute p-3.5 rounded-lg border shadow-xl select-none ${
                coords.isFlipUp ? 'agv-spring-up' : 'agv-spring-down'
              } ${contentClassName}`}
              style={{
                top: `${coords.top}px`,
                left: `${coords.left}px`,
                width: typeof width === 'number' ? `${width}px` : width,
                backgroundColor: 'var(--agv-bg-popup)',
                borderColor: 'var(--agv-border)',
                color: 'var(--agv-text-main)',
                boxShadow: '0 12px 28px -4px rgba(0, 0, 0, 0.25), 0 4px 10px -2px rgba(0, 0, 0, 0.1)',
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
