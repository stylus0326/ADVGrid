import React, { useEffect } from 'react';
import { getThemeTokens, getThemeClass, GridTheme } from '../../themes';
export { getThemeClass };

/**
 * Trích xuất biến CSS Theme Variables để bảo vệ Dropdown Portal và Control luôn đồng bộ 100% theme
 */
export function getPortalThemeVars(theme: string = 'bezier-arthouse'): React.CSSProperties {
  const tokens = getThemeTokens(theme as GridTheme);
  return {
    '--agv-bg-root': tokens.bgRoot,
    '--agv-bg-header': tokens.bgHeader,
    '--agv-bg-row': tokens.bgRow,
    '--agv-bg-row-alt': tokens.bgRowAlt,
    '--agv-bg-hover': tokens.bgHover,
    '--agv-bg-selected': tokens.bgSelected,
    '--agv-bg-popup': tokens.bgPopup,
    '--agv-bg-item-hover': tokens.bgItemHover,
    '--agv-bg-item-active': tokens.bgItemActive,
    '--agv-bg-control': tokens.bgControl,
    '--agv-bg-control-hover': tokens.bgControlHover,
    '--agv-border': tokens.border,
    '--agv-border-strong': tokens.borderStrong,
    '--agv-border-popup': tokens.borderPopup,
    '--agv-border-subtle': tokens.border,
    '--agv-text-main': tokens.textMain,
    '--agv-text-header': tokens.textHeader,
    '--agv-text-muted': tokens.textMuted,
    '--agv-text-subtle': tokens.textSubtle,
    '--agv-text-active': tokens.accent,
    '--agv-accent': tokens.accent,
    '--agv-accent-hover': tokens.accent,
    '--agv-accent-hover-border': tokens.accentHoverBorder || `color-mix(in srgb, ${tokens.accent} 55%, ${tokens.borderStrong})`,
    '--agv-accent-text': tokens.accentText,
    '--agv-focus-ring': tokens.accent,
    '--agv-btn-default-bg': tokens.btnDefaultBg,
    '--agv-btn-default-border': tokens.btnDefaultBorder,
    '--agv-btn-default-text': tokens.btnDefaultText,
    '--agv-btn-default-hover': tokens.btnDefaultHover,
  } as React.CSSProperties;
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

/**
 * Hook lắng nghe sự kiện click ra ngoài để tự động đóng popup (Click Outside)
 */
export function useClickOutside(
  isOpen: boolean,
  onClose: () => void,
  onUpdateCoords?: () => void,
  triggerRef?: React.RefObject<HTMLElement | null>,
  popupRef?: React.RefObject<HTMLElement | null>
) {
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (triggerRef?.current && triggerRef.current.contains(target)) return;
      if (popupRef?.current && popupRef.current.contains(target)) return;
      onClose();
    };

    const handleWindowResizeOrScroll = () => {
      if (onUpdateCoords) {
        onUpdateCoords();
      }
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
  }, [isOpen, onClose, onUpdateCoords, triggerRef, popupRef]);
}

/**
 * Tiện ích chuẩn hóa tiếng Việt không dấu cho tìm kiếm siêu tốc
 */
export function normalizeSearchText(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd');
}
