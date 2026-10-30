import { useState, useEffect } from 'react';
import { GridLayoutMode, GRID_LAYOUT_MODES } from '../types';

export interface UseGridLayoutModeOptions {
  layoutMode?: GridLayoutMode;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export interface UseGridLayoutModeResult {
  activeMode: 'pc' | 'tablet' | 'phone';
  containerWidth: number;
}

export function useGridLayoutMode({
  layoutMode = GRID_LAYOUT_MODES.AUTO,
  containerRef,
}: UseGridLayoutModeOptions): UseGridLayoutModeResult {
  const [containerWidth, setContainerWidth] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth;
    }
    return 1200;
  });

  useEffect(() => {
    const el = containerRef.current;
    if (!el && typeof window === 'undefined') return;

    const updateWidth = () => {
      const w = el ? el.clientWidth : window.innerWidth;
      if (w > 0) {
        setContainerWidth(w);
      }
    };

    updateWidth();

    if (typeof ResizeObserver !== 'undefined' && el) {
      const ro = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const w = entry.contentRect.width;
          if (w > 0) {
            setContainerWidth(w);
          }
        }
      });
      ro.observe(el);
      return () => ro.disconnect();
    } else {
      window.addEventListener('resize', updateWidth);
      return () => window.removeEventListener('resize', updateWidth);
    }
  }, [containerRef]);

  let activeMode: 'pc' | 'tablet' | 'phone' = 'pc';

  if (layoutMode === GRID_LAYOUT_MODES.PC) {
    activeMode = 'pc';
  } else if (layoutMode === GRID_LAYOUT_MODES.TABLET) {
    activeMode = 'tablet';
  } else if (layoutMode === GRID_LAYOUT_MODES.PHONE) {
    activeMode = 'phone';
  } else {
    // AUTO mode theo breakpoint chuẩn
    if (containerWidth < 768) {
      activeMode = 'phone';
    } else if (containerWidth < 1024) {
      activeMode = 'tablet';
    } else {
      activeMode = 'pc';
    }
  }

  return { activeMode, containerWidth };
}
