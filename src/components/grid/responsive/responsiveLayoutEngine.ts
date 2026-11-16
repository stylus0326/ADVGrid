import { GridLayoutMode, GRID_LAYOUT_MODES } from '../types';

export const GRID_BREAKPOINTS = {
  PHONE: 768,
  TABLET: 1024,
  DEFAULT_HYSTERESIS: 16,
  DEFAULT_DEBOUNCE_MS: 120,
} as const;

export function resolveActiveModeWithHysteresis(
  width: number,
  currentMode: 'pc' | 'tablet' | 'phone',
  buffer: number = GRID_BREAKPOINTS.DEFAULT_HYSTERESIS
): 'pc' | 'tablet' | 'phone' {
  if (width <= 0) return currentMode;

  if (currentMode === 'phone') {
    if (width >= GRID_BREAKPOINTS.TABLET + buffer) return 'pc';
    if (width >= GRID_BREAKPOINTS.PHONE + buffer) return 'tablet';
    return 'phone';
  }

  if (currentMode === 'tablet') {
    if (width < GRID_BREAKPOINTS.PHONE - buffer) return 'phone';
    if (width >= GRID_BREAKPOINTS.TABLET + buffer) return 'pc';
    return 'tablet';
  }

  if (width < GRID_BREAKPOINTS.PHONE - buffer) return 'phone';
  if (width < GRID_BREAKPOINTS.TABLET - buffer) return 'tablet';
  return 'pc';
}

export function getInitialGridMode(width: number): 'pc' | 'tablet' | 'phone' {
  if (width < GRID_BREAKPOINTS.PHONE) return 'phone';
  if (width < GRID_BREAKPOINTS.TABLET) return 'tablet';
  return 'pc';
}

export function attachResponsiveLayoutObserver(params: {
  containerEl: HTMLDivElement | null;
  layoutMode: GridLayoutMode;
  debounceMs: number;
  hysteresisBuffer: number;
  currentModeRef: React.MutableRefObject<'pc' | 'tablet' | 'phone'>;
  isFirstMeasurementRef: React.MutableRefObject<boolean>;
  debounceTimerRef: React.MutableRefObject<ReturnType<typeof setTimeout> | null>;
  containerWidthRef: React.MutableRefObject<number>;
  setAutoActiveMode: (mode: 'pc' | 'tablet' | 'phone') => void;
}): () => void {
  const {
    containerEl,
    layoutMode,
    debounceMs,
    hysteresisBuffer,
    currentModeRef,
    isFirstMeasurementRef,
    debounceTimerRef,
    containerWidthRef,
    setAutoActiveMode,
  } = params;

  const processNewWidth = (w: number) => {
    if (w <= 0) return;
    containerWidthRef.current = w;

    if (layoutMode !== GRID_LAYOUT_MODES.AUTO) return;

    if (isFirstMeasurementRef.current) {
      isFirstMeasurementRef.current = false;
      const initialMode = getInitialGridMode(w);
      currentModeRef.current = initialMode;
      setAutoActiveMode(initialMode);
      return;
    }

    const targetMode = resolveActiveModeWithHysteresis(w, currentModeRef.current, hysteresisBuffer);
    if (targetMode === currentModeRef.current) {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
      return;
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      currentModeRef.current = targetMode;
      setAutoActiveMode(targetMode);
      debounceTimerRef.current = null;
    }, debounceMs);
  };

  const updateWidth = () => {
    const w = containerEl ? containerEl.clientWidth : window.innerWidth;
    processNewWidth(w);
  };

  updateWidth();

  if (typeof ResizeObserver !== 'undefined' && containerEl) {
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        processNewWidth(entry.contentRect.width);
      }
    });
    ro.observe(containerEl);
    return () => {
      ro.disconnect();
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }

  window.addEventListener('resize', updateWidth);
  return () => {
    window.removeEventListener('resize', updateWidth);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
  };
}
