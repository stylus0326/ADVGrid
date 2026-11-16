import React, { useEffect, useRef } from 'react';
import { getThemeClass, GridTheme, SURFACE_THEMES } from '../../themes';
export { getThemeClass, SURFACE_THEMES };
export type { GridTheme };

/**
 * Kế thừa tự nhiên 100% biến CSS Theme từ document.documentElement.
 * Luôn trả về {} rỗng để tránh sinh Inline Style đè lên CSS variables của theme và chế độ Ngày/Đêm.
 */
export function getPortalThemeVars(_theme?: string, _isDark?: boolean): React.CSSProperties {
  return {};
}

export interface EditorCoords {
  top: number;
  bottom?: number;
  left: number;
  width: number;
  maxHeight: number;
  isFlipUp?: boolean;
}

/**
 * Tiện ích tính toán tọa độ mở dropdown chuẩn neo dưới nút bấm/ô nhập
 */
export function computeEditorCoords(
  triggerEl: HTMLElement | null,
  preferredHeight = 260,
  minWidth = 200
): EditorCoords {
  if (!triggerEl) return { top: 0, bottom: 0, left: 0, width: minWidth, maxHeight: preferredHeight, isFlipUp: false };
  const rect = triggerEl.getBoundingClientRect();
  const vh = window.innerHeight;
  const vw = window.innerWidth;
  const spaceBelow = vh - rect.bottom - 10;
  const spaceAbove = rect.top - 10;
  const menuWidth = Math.max(minWidth, Math.round(rect.width));
  let left = Math.round(rect.left);
  if (left + menuWidth > vw - 10) {
    left = Math.max(10, vw - menuWidth - 10);
  }
  if (left < 10) left = 10;

  // Tự động lật lên phía trên (flip up) nếu không gian bên dưới không đủ và phía trên rộng hơn
  const flipUp = spaceBelow < preferredHeight && spaceAbove > spaceBelow;
  const availableSpace = flipUp ? spaceAbove : spaceBelow;
  const maxHeight = Math.min(preferredHeight, Math.max(120, availableSpace));
  const top = flipUp
    ? Math.max(10, Math.round(rect.top - maxHeight - 4))
    : Math.round(rect.bottom + 4);
  const bottom = Math.round(vh - rect.top + 4);

  return {
    top,
    bottom,
    left,
    width: menuWidth,
    maxHeight,
    isFlipUp: flipUp,
  };
}

export function areEditorCoordsEqual(
  a: Partial<EditorCoords> | null | undefined,
  b: Partial<EditorCoords> | null | undefined
): boolean {
  if (a === b) return true;
  if (!a || !b) return false;
  return (
    a.top === b.top &&
    a.bottom === b.bottom &&
    a.left === b.left &&
    a.width === b.width &&
    a.maxHeight === b.maxHeight &&
    Boolean(a.isFlipUp) === Boolean(b.isFlipUp)
  );
}

/**
 * Tính số bước nhảy cho phím PageDown/PageUp dựa theo chiều cao vùng hiển thị danh sách.
 */
export function computeDropdownPageStep(
  containerHeight: number,
  itemHeight = 28,
  fallbackStep = 6
): number {
  if (
    !Number.isFinite(containerHeight) ||
    containerHeight <= 0 ||
    !Number.isFinite(itemHeight) ||
    itemHeight <= 0
  ) {
    return Math.max(1, fallbackStep);
  }
  return Math.max(1, Math.floor(containerHeight / itemHeight));
}

/**
 * Tính chỉ số mục kế tiếp khi điều hướng danh sách bằng bàn phím (ArrowUp/Down, PageUp/Down, Home/End).
 */
export function computeNextHighlightedIndex(
  key: string,
  currentIndex: number,
  totalCount: number,
  pageStep = 6
): number | null {
  if (totalCount <= 0) return null;
  if (currentIndex < 0 || currentIndex >= totalCount) {
    if (key === 'ArrowUp' || key === 'End') return totalCount - 1;
    if (key === 'ArrowDown' || key === 'PageDown' || key === 'PageUp' || key === 'Home') return 0;
    return null;
  }

  const step = Math.max(1, pageStep);
  switch (key) {
    case 'ArrowDown':
      return (currentIndex + 1) % totalCount;
    case 'ArrowUp':
      return (currentIndex - 1 + totalCount) % totalCount;
    case 'PageDown':
      return Math.min(totalCount - 1, currentIndex + step);
    case 'PageUp':
      return Math.max(0, currentIndex - step);
    case 'Home':
      return 0;
    case 'End':
      return totalCount - 1;
    default:
      return null;
  }
}

/**
 * Cuộn mục đang được chọn/highlight vào vùng nhìn thấy của container cuộn (có trừ chiều cao sticky header nếu có).
 */
export function scrollDropdownItemIntoView(
  container: HTMLElement | null,
  itemEl: HTMLElement | null,
  topInsetPx = 0,
  bottomInsetPx = 0
): void {
  if (!container || !itemEl) return;
  const containerRect = container.getBoundingClientRect();
  const itemRect = itemEl.getBoundingClientRect();
  const scaleY =
    container.offsetHeight > 0 && containerRect.height > 0
      ? containerRect.height / container.offsetHeight
      : 1;
  const visibleTop =
    containerRect.top + (container.clientTop + Math.max(0, topInsetPx)) * scaleY;
  const visibleBottom =
    containerRect.top +
    (container.clientTop + container.clientHeight - Math.max(0, bottomInsetPx)) * scaleY;

  if (itemRect.top < visibleTop) {
    container.scrollTop -= (visibleTop - itemRect.top) / scaleY;
  } else if (itemRect.bottom > visibleBottom) {
    container.scrollTop += (itemRect.bottom - visibleBottom) / scaleY;
  }
}

/**
 * Hook lắng nghe sự kiện click ra ngoài để tự động đóng popup (Click Outside)
 */
export function useClickOutside(
  isOpen: boolean,
  onClose: () => void,
  onUpdateCoords?: () => void,
  triggerRef?: React.RefObject<HTMLElement | null>,
  popupRef?: React.RefObject<HTMLElement | null>,
  secondaryPopupRef?: React.RefObject<HTMLElement | null>,
  ignoreSelector?: string
) {
  const onCloseRef = useRef(onClose);
  const onUpdateCoordsRef = useRef(onUpdateCoords);

  useEffect(() => {
    onCloseRef.current = onClose;
    onUpdateCoordsRef.current = onUpdateCoords;
  });

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (triggerRef?.current && triggerRef.current.contains(target)) return;
      if (popupRef?.current && popupRef.current.contains(target)) return;
      if (secondaryPopupRef?.current && secondaryPopupRef.current.contains(target)) return;
      if (ignoreSelector && target instanceof Element && target.closest(ignoreSelector)) return;
      onCloseRef.current();
    };

    const handleWindowResizeOrScroll = (e: Event) => {
      if (
        e.type === 'scroll' &&
        typeof Node !== 'undefined' &&
        e.target instanceof Node &&
        ((popupRef?.current && popupRef.current.contains(e.target)) ||
          (secondaryPopupRef?.current && secondaryPopupRef.current.contains(e.target)))
      ) {
        return;
      }
      onUpdateCoordsRef.current?.();
    };

    document.addEventListener('mousedown', handlePointerDown, true);
    document.addEventListener('touchstart', handlePointerDown, true);
    window.addEventListener('resize', handleWindowResizeOrScroll, { passive: true });
    window.addEventListener('scroll', handleWindowResizeOrScroll, { passive: true, capture: true });

    return () => {
      document.removeEventListener('mousedown', handlePointerDown, true);
      document.removeEventListener('touchstart', handlePointerDown, true);
      window.removeEventListener('resize', handleWindowResizeOrScroll);
      window.removeEventListener('scroll', handleWindowResizeOrScroll, true);
    };
  }, [isOpen, triggerRef, popupRef, secondaryPopupRef]);
}

const NON_ASCII_SEARCH_RE = /[^\x00-\x7F]/;

/**
 * Tiện ích chuẩn hóa tiếng Việt không dấu cho tìm kiếm siêu tốc
 */
export function normalizeSearchText(str: string): string {
  if (!str) return '';
  const lower = str.toLowerCase();
  if (!NON_ASCII_SEARCH_RE.test(lower)) return lower;
  return lower
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd');
}
