import { useState, useEffect, useRef } from 'react';
import { GridLayoutMode, GRID_LAYOUT_MODES } from '../types';

export interface UseGridLayoutModeOptions {
  layoutMode?: GridLayoutMode;
  containerRef: React.RefObject<HTMLDivElement | null>;
  debounceMs?: number;
  hysteresisBuffer?: number;
}

export interface UseGridLayoutModeResult {
  activeMode: 'pc' | 'tablet' | 'phone';
  containerWidth: number;
}

/**
 * Ngưỡng Breakpoint chuẩn:
 * - Phone: < 768px
 * - Tablet: 768px - 1023px
 * - PC: >= 1024px
 * - Hysteresis Buffer: 16px (vùng đệm chống rung ranh giới do thanh cuộn dọc 15px)
 * - Debounce: 120ms (trì hoãn khi người dùng đang kéo chuột liên tục)
 */
export const GRID_BREAKPOINTS = {
  PHONE: 768,
  TABLET: 1024,
  DEFAULT_HYSTERESIS: 16,
  DEFAULT_DEBOUNCE_MS: 120,
} as const;

/**
 * Helper tính toán Active Mode kết hợp vùng đệm trễ Hysteresis Buffer chống rung giật 1px
 * và chống vòng lặp layout do thanh cuộn (Scrollbar Layout Shift)
 */
export function resolveActiveModeWithHysteresis(
  width: number,
  currentMode: 'pc' | 'tablet' | 'phone',
  buffer: number = GRID_BREAKPOINTS.DEFAULT_HYSTERESIS
): 'pc' | 'tablet' | 'phone' {
  if (width <= 0) return currentMode;

  if (currentMode === 'phone') {
    // Chỉ rời khỏi Phone khi chiều rộng vượt hẳn ngưỡng Phone + buffer
    if (width >= GRID_BREAKPOINTS.TABLET + buffer) return 'pc';
    if (width >= GRID_BREAKPOINTS.PHONE + buffer) return 'tablet';
    return 'phone';
  }

  if (currentMode === 'tablet') {
    // Chỉ tụt xuống Phone khi nhỏ hơn hẳn ngưỡng Phone - buffer
    if (width < GRID_BREAKPOINTS.PHONE - buffer) return 'phone';
    // Chỉ tăng lên PC khi lớn hơn hẳn ngưỡng Tablet + buffer
    if (width >= GRID_BREAKPOINTS.TABLET + buffer) return 'pc';
    return 'tablet';
  }

  // currentMode === 'pc'
  // Chỉ tụt xuống Tablet khi nhỏ hơn hẳn ngưỡng Tablet - buffer
  if (width < GRID_BREAKPOINTS.PHONE - buffer) return 'phone';
  if (width < GRID_BREAKPOINTS.TABLET - buffer) return 'tablet';
  return 'pc';
}

/**
 * Helper tính mode chuẩn cho lần đầu tiên tải trang
 */
export function getInitialGridMode(width: number): 'pc' | 'tablet' | 'phone' {
  if (width < GRID_BREAKPOINTS.PHONE) return 'phone';
  if (width < GRID_BREAKPOINTS.TABLET) return 'tablet';
  return 'pc';
}

export function useGridLayoutMode({
  layoutMode = GRID_LAYOUT_MODES.AUTO,
  containerRef,
  debounceMs = GRID_BREAKPOINTS.DEFAULT_DEBOUNCE_MS,
  hysteresisBuffer = GRID_BREAKPOINTS.DEFAULT_HYSTERESIS,
}: UseGridLayoutModeOptions): UseGridLayoutModeResult {
  const [containerWidth, setContainerWidth] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth;
    }
    return 1200;
  });

  const [autoActiveMode, setAutoActiveMode] = useState<'pc' | 'tablet' | 'phone'>(() => {
    const initialWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
    return getInitialGridMode(initialWidth);
  });

  const currentModeRef = useRef<'pc' | 'tablet' | 'phone'>(autoActiveMode);
  currentModeRef.current = autoActiveMode;

  const isFirstMeasurementRef = useRef<boolean>(true);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Dọn dẹp timer khi unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el && typeof window === 'undefined') return;

    const processNewWidth = (w: number) => {
      if (w <= 0) return;
      setContainerWidth(w);

      if (layoutMode !== GRID_LAYOUT_MODES.AUTO) return;

      // Lần đo đầu tiên khi mount: Xác định mode ngay lập tức không trễ
      if (isFirstMeasurementRef.current) {
        isFirstMeasurementRef.current = false;
        const initialMode = getInitialGridMode(w);
        currentModeRef.current = initialMode;
        setAutoActiveMode(initialMode);
        return;
      }

      // Các lần resize tiếp theo: Áp dụng Hysteresis Buffer
      const targetMode = resolveActiveModeWithHysteresis(w, currentModeRef.current, hysteresisBuffer);

      if (targetMode === currentModeRef.current) {
        // Nếu kích thước vẫn thuộc mode hiện tại (nằm trong vùng đệm trễ): Hủy timer nếu có
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
          debounceTimerRef.current = null;
        }
        return;
      }

      // Nếu cần đổi mode: Áp dụng Debounce để triệt tiêu rung lắc khi người dùng đang kéo chuột liên tục
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
      const w = el ? el.clientWidth : window.innerWidth;
      processNewWidth(w);
    };

    updateWidth();

    if (typeof ResizeObserver !== 'undefined' && el) {
      const ro = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const w = entry.contentRect.width;
          processNewWidth(w);
        }
      });
      ro.observe(el);
      return () => {
        ro.disconnect();
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }
      };
    } else {
      window.addEventListener('resize', updateWidth);
      return () => {
        window.removeEventListener('resize', updateWidth);
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }
      };
    }
  }, [containerRef, layoutMode, debounceMs, hysteresisBuffer]);

  let activeMode: 'pc' | 'tablet' | 'phone' = 'pc';

  if (layoutMode === GRID_LAYOUT_MODES.PC) {
    activeMode = 'pc';
  } else if (layoutMode === GRID_LAYOUT_MODES.TABLET) {
    activeMode = 'tablet';
  } else if (layoutMode === GRID_LAYOUT_MODES.PHONE) {
    activeMode = 'phone';
  } else {
    activeMode = autoActiveMode;
  }

  return { activeMode, containerWidth };
}
