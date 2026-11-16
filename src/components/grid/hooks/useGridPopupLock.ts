import React, { useState, useEffect, useRef, useCallback } from 'react';
import { POPUP_SELECTORS } from '../constants';
import {
  canWheelScrollInsidePopup,
  isTargetInsidePopupSelector,
  resolveEventTargetElement,
  shouldBlockGridInteractionWhenPopupOpen,
} from '../popupLockUtils';

export function isAnyPopupActive(): boolean {
  if (typeof document === 'undefined') return false;
  return Boolean(document.querySelector(POPUP_SELECTORS));
}

interface UseGridPopupLockParams {
  containerRef: React.RefObject<HTMLDivElement | null>;
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
  lastScrollTopRef: React.RefObject<number>;
  lastScrollLeftRef: React.RefObject<number>;
  activeContextMenu: any;
  isSortFilterModalOpen: boolean;
  activeEditingCell: any;
}

export function useGridPopupLock({
  containerRef,
  scrollContainerRef,
  lastScrollTopRef,
  lastScrollLeftRef,
  activeContextMenu,
  isSortFilterModalOpen,
  activeEditingCell,
}: UseGridPopupLockParams) {
  const [isToolbarPopupOpen, setIsToolbarPopupOpen] = useState(false);
  const [hasPortalPopupOpen, setHasPortalPopupOpen] = useState(false);
  const popupLockedScrollPosRef = useRef<{ top: number; left: number } | null>(null);
  const suppressNextGridClickRef = useRef(false);

  const isPopupLockActive = Boolean(
    activeContextMenu ||
      isSortFilterModalOpen ||
      isToolbarPopupOpen ||
      hasPortalPopupOpen
  );

  useEffect(() => {
    if (typeof document === 'undefined' || !document.body) return;
    const syncPortalPopups = () => {
      if (document.body.childElementCount <= 1) {
        setHasPortalPopupOpen((prev) => (prev ? false : prev));
        return;
      }
      const containerEl = containerRef.current;
      const children = document.body.children;
      let hasBodyPortalPopup = false;
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (containerEl && child.contains(containerEl)) continue;
        if (child.matches(POPUP_SELECTORS) || child.querySelector(POPUP_SELECTORS)) {
          hasBodyPortalPopup = true;
          break;
        }
      }
      setHasPortalPopupOpen((prev) => (prev === hasBodyPortalPopup ? prev : hasBodyPortalPopup));
    };
    syncPortalPopups();
    const observer = new MutationObserver(syncPortalPopups);
    observer.observe(document.body, { childList: true, subtree: false });
    return () => observer.disconnect();
  }, [containerRef]);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (isPopupLockActive) {
      if (!popupLockedScrollPosRef.current) {
        popupLockedScrollPosRef.current = {
          top: el ? el.scrollTop : lastScrollTopRef.current,
          left: el ? el.scrollLeft : lastScrollLeftRef.current,
        };
      }
    } else {
      popupLockedScrollPosRef.current = null;
    }
  }, [isPopupLockActive, scrollContainerRef, lastScrollTopRef, lastScrollLeftRef]);

  // Global capture lock cho wheel & touchmove khi Popup hoặc Editor đang mở
  useEffect(() => {
    if (!isPopupLockActive && !activeEditingCell) return;

    const handleLockedWheel = (e: WheelEvent) => {
      if (canWheelScrollInsidePopup(e.target, e.deltaX, e.deltaY, POPUP_SELECTORS)) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
    };

    const handleLockedTouchMove = (e: TouchEvent) => {
      if (isTargetInsidePopupSelector(e.target, POPUP_SELECTORS)) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
    };

    window.addEventListener('wheel', handleLockedWheel, { passive: false, capture: true });
    window.addEventListener('touchmove', handleLockedTouchMove, { passive: false, capture: true });
    return () => {
      window.removeEventListener('wheel', handleLockedWheel, true);
      window.removeEventListener('touchmove', handleLockedTouchMove, true);
    };
  }, [isPopupLockActive, activeEditingCell]);

  // Unified Wheel Listener trên scroll container: cho phép cuộn bên trong Popup con, khóa cuộn Grid
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      if (isTargetInsidePopupSelector(e.target, POPUP_SELECTORS)) {
        return;
      }
      if (activeContextMenu || activeEditingCell || isPopupLockActive || isAnyPopupActive()) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [scrollContainerRef, activeContextMenu, activeEditingCell, isPopupLockActive]);

  const isAllowedPopupTarget = useCallback(
    (target: EventTarget | null) => {
      const el = resolveEventTargetElement(target);
      if (!el) return false;
      if (el.closest(POPUP_SELECTORS)) return true;
      if (isToolbarPopupOpen && el.closest('.agv-floating-toolbar')) return true;
      return false;
    },
    [isToolbarPopupOpen]
  );

  const handleContainerMouseDownCapture = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const popupOpenNow = isPopupLockActive || isAnyPopupActive();
      if (!popupOpenNow || isAllowedPopupTarget(e.target)) return;
      suppressNextGridClickRef.current = true;
      e.preventDefault();
    },
    [isPopupLockActive, isAllowedPopupTarget]
  );

  const handleContainerSuppressClickCapture = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (suppressNextGridClickRef.current && !isAllowedPopupTarget(e.target)) {
        suppressNextGridClickRef.current = false;
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      const popupOpenNow = isPopupLockActive || isAnyPopupActive();
      if (
        shouldBlockGridInteractionWhenPopupOpen(popupOpenNow, e.target, POPUP_SELECTORS) &&
        !isAllowedPopupTarget(e.target)
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    [isPopupLockActive, isAllowedPopupTarget]
  );

  const handleContainerContextMenuCapture = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const popupOpenNow = isPopupLockActive || isAnyPopupActive();
      if (
        shouldBlockGridInteractionWhenPopupOpen(popupOpenNow, e.target, POPUP_SELECTORS) &&
        !isAllowedPopupTarget(e.target)
      ) {
        suppressNextGridClickRef.current = true;
        e.preventDefault();
        e.stopPropagation();
      }
    },
    [isPopupLockActive, isAllowedPopupTarget]
  );

  return {
    isToolbarPopupOpen,
    setIsToolbarPopupOpen,
    isPopupLockActive,
    popupLockedScrollPosRef,
    suppressNextGridClickRef,
    handleContainerMouseDownCapture,
    handleContainerSuppressClickCapture,
    handleContainerContextMenuCapture,
  };
}
