import React, { useState, useRef, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ExternalLink, Globe } from 'lucide-react';
import { getPortalThemeVars, getThemeClass } from './enterpriseEditorUtils';

export interface AdvPreviewLinkCardProps {
  url: string;
  title: string;
  description?: string;
  imageUrl?: string;
  domain?: string;
  children?: React.ReactNode;
  theme?: string;
  className?: string;
}

export const AdvPreviewLinkCard: React.FC<AdvPreviewLinkCardProps> = ({
  url,
  title,
  description,
  imageUrl,
  domain,
  children,
  theme = 'bezier-arthouse',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const openTimerRef = useRef<any>(null);
  const closeTimerRef = useRef<any>(null);

  const triggerRef = useRef<HTMLAnchorElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const [coords, setCoords] = useState<{
    top: number;
    left: number;
    isFlipUp: boolean;
  } | null>(null);

  const resolvedDomain = domain || (() => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  })();

  const updateCoords = useCallback(() => {
    if (!triggerRef.current || typeof window === 'undefined') return;
    const rect = triggerRef.current.getBoundingClientRect();
    const vh = window.innerHeight;
    const vw = window.innerWidth;

    const cardW = 300;
    const cardH = cardRef.current ? cardRef.current.offsetHeight : 200;

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
  }, []);

  const handleMouseEnter = () => {
    clearTimeout(closeTimerRef.current);
    openTimerRef.current = setTimeout(() => {
      updateCoords();
      setIsOpen(true);
    }, 150);
  };

  const handleMouseLeave = () => {
    clearTimeout(openTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  useEffect(() => {
    return () => {
      clearTimeout(openTimerRef.current);
      clearTimeout(closeTimerRef.current);
    };
  }, []);

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
      <a
        ref={triggerRef}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`inline-flex items-center gap-1 text-[var(--agv-accent)] hover:underline text-xs ${className}`}
      >
        {children || (
          <>
            <span className="truncate">{title || resolvedDomain}</span>
            <ExternalLink size={12} strokeWidth={2} className="shrink-0 opacity-70" />
          </>
        )}
      </a>

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
              className={`pointer-events-auto absolute w-[300px] rounded-lg border shadow-xl select-none overflow-hidden ${
                coords.isFlipUp ? 'agv-spring-up' : 'agv-spring-down'
              }`}
              style={{
                top: `${coords.top}px`,
                left: `${coords.left}px`,
                backgroundColor: 'var(--agv-bg-popup)',
                borderColor: 'var(--agv-border)',
                color: 'var(--agv-text-main)',
                boxShadow: '0 12px 28px -4px rgba(0, 0, 0, 0.25), 0 4px 10px -2px rgba(0, 0, 0, 0.1)',
              }}
            >
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:opacity-95 transition-opacity"
              >
                {imageUrl && (
                  <div className="w-full h-32 bg-[var(--agv-bg-control)] overflow-hidden border-b border-[var(--agv-border)]">
                    <img
                      src={imageUrl}
                      alt={title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}

                <div className="p-3">
                  <div className="font-semibold text-xs text-[var(--agv-text-main)] line-clamp-1 mb-1">
                    {title}
                  </div>

                  {description && (
                    <div className="text-[11px] text-[var(--agv-text-muted)] line-clamp-2 leading-relaxed mb-2.5">
                      {description}
                    </div>
                  )}

                  <div className="flex items-center gap-1.5 text-[10px] text-[var(--agv-text-muted)] border-t border-[var(--agv-border)] pt-2">
                    <Globe size={11} strokeWidth={2} className="shrink-0" />
                    <span className="truncate font-mono">{resolvedDomain}</span>
                    <ExternalLink size={10} strokeWidth={2} className="ml-auto shrink-0 opacity-60" />
                  </div>
                </div>
              </a>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};
