import { useState, useEffect, useRef } from 'react';
import { GridLayoutMode, GRID_LAYOUT_MODES } from '../types';

export interface UseGridLayoutModeOptions {
  enabled?: boolean;
  layoutMode?: GridLayoutMode;
  containerRef: React.RefObject<HTMLDivElement | null>;
  debounceMs?: number;
  hysteresisBuffer?: number;
}

export interface UseGridLayoutModeResult {
  activeMode: 'pc' | 'tablet' | 'phone';
  containerWidthRef: React.MutableRefObject<number>;
}

export function useGridLayoutMode({
  enabled = true,
  layoutMode = GRID_LAYOUT_MODES.AUTO,
  containerRef,
  debounceMs = 120,
  hysteresisBuffer = 16,
}: UseGridLayoutModeOptions): UseGridLayoutModeResult {
  const containerWidthRef = useRef<number>(
    enabled && typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  const [autoActiveMode, setAutoActiveMode] = useState<'pc' | 'tablet' | 'phone'>(() => {
    if (!enabled) return 'pc';
    const w = typeof window !== 'undefined' ? window.innerWidth : 1200;
    if (w < 768) return 'phone';
    if (w < 1024) return 'tablet';
    return 'pc';
  });

  const currentModeRef = useRef<'pc' | 'tablet' | 'phone'>(autoActiveMode);
  currentModeRef.current = autoActiveMode;

  const isFirstMeasurementRef = useRef<boolean>(true);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    let cleanupFn: (() => void) | undefined;

    void import('./responsiveLayoutEngine').then(({ attachResponsiveLayoutObserver }) => {
      if (cancelled) return;
      cleanupFn = attachResponsiveLayoutObserver({
        containerEl: containerRef.current,
        layoutMode,
        debounceMs,
        hysteresisBuffer,
        currentModeRef,
        isFirstMeasurementRef,
        debounceTimerRef,
        containerWidthRef,
        setAutoActiveMode,
      });
    });

    return () => {
      cancelled = true;
      cleanupFn?.();
    };
  }, [enabled, containerRef, layoutMode, debounceMs, hysteresisBuffer]);

  if (!enabled) {
    return { activeMode: 'pc', containerWidthRef };
  }

  let activeMode: 'pc' | 'tablet' | 'phone' = autoActiveMode;
  if (layoutMode === GRID_LAYOUT_MODES.PC) activeMode = 'pc';
  else if (layoutMode === GRID_LAYOUT_MODES.TABLET) activeMode = 'tablet';
  else if (layoutMode === GRID_LAYOUT_MODES.PHONE) activeMode = 'phone';

  return { activeMode, containerWidthRef };
}
