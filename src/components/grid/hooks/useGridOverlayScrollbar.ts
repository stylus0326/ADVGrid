import { useCallback, useEffect, useRef } from 'react';
import { isAnyPopupActive } from './useGridPopupLock';

const MIN_THUMB_PX = 24;
const HIDE_DELAY_MS = 700;
const TRACK_PAD_PX = 2;
const CROSS_AXIS_RESERVE_PX = 10;

export interface UseGridOverlayScrollbarOptions {
  overlayHostRef: React.RefObject<HTMLDivElement | null>;
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
  alwaysShow?: boolean;
  isWindowScroll: boolean;
  verticalTrackTopInset: number;
  isLockedRef: React.MutableRefObject<boolean>;
  totalContentHeight: number;
  totalGridWidth: number;
  viewportHeight: number;
}

export interface UseGridOverlayScrollbarResult {
  vBarRef: React.RefObject<HTMLDivElement | null>;
  vThumbRef: React.RefObject<HTMLDivElement | null>;
  hBarRef: React.RefObject<HTMLDivElement | null>;
  hThumbRef: React.RefObject<HTMLDivElement | null>;
  notifyScroll: () => void;
  syncScrollbars: () => void;
  hostInteractionProps: {
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onTouchStart: () => void;
  };
  onVerticalTrackMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  onHorizontalTrackMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  onVerticalThumbPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
  onHorizontalThumbPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
}

export function useGridOverlayScrollbar({
  overlayHostRef,
  scrollContainerRef,
  alwaysShow = false,
  isWindowScroll,
  verticalTrackTopInset,
  isLockedRef,
  totalContentHeight,
  totalGridWidth,
  viewportHeight,
}: UseGridOverlayScrollbarOptions): UseGridOverlayScrollbarResult {
  const vBarRef = useRef<HTMLDivElement | null>(null);
  const vThumbRef = useRef<HTMLDivElement | null>(null);
  const hBarRef = useRef<HTMLDivElement | null>(null);
  const hThumbRef = useRef<HTMLDivElement | null>(null);

  const isHoveredRef = useRef(false);
  const isScrollingRef = useRef(false);
  const isDraggingRef = useRef(false);
  const hideTimerRef = useRef<number | null>(null);
  const syncRafRef = useRef<number | null>(null);

  const latestRef = useRef({
    alwaysShow,
    isWindowScroll,
    verticalTrackTopInset,
    isLockedRef,
  });
  latestRef.current = {
    alwaysShow,
    isWindowScroll,
    verticalTrackTopInset,
    isLockedRef,
  };

  const vMetricRef = useRef({ trackLen: 0, thumbLen: 0, maxScroll: 0 });
  const hMetricRef = useRef({ trackLen: 0, thumbLen: 0, maxScroll: 0 });

  const updateHostActiveAttr = useCallback(() => {
    const hostEl = overlayHostRef.current;
    if (!hostEl) return;
    const isActive =
      latestRef.current.alwaysShow ||
      isHoveredRef.current ||
      isScrollingRef.current ||
      isDraggingRef.current;
    hostEl.setAttribute('data-overlay-scroll-active', isActive ? 'true' : 'false');
  }, [overlayHostRef]);

  const syncScrollbarsNow = useCallback(() => {
    syncRafRef.current = null;
    const vpEl = scrollContainerRef.current;
    if (!vpEl) return;

    const { isWindowScroll: winScroll, verticalTrackTopInset: rawTopInset } = latestRef.current;
    const topInset = Math.max(TRACK_PAD_PX, Math.round(rawTopInset));

    const clientHeight = vpEl.clientHeight;
    const scrollHeight = vpEl.scrollHeight;
    const clientWidth = vpEl.clientWidth;
    const scrollWidth = vpEl.scrollWidth;

    const maxScrollY = Math.max(0, scrollHeight - clientHeight);
    const maxScrollX = Math.max(0, scrollWidth - clientWidth);
    const hasV = !winScroll && maxScrollY > 1;
    const hasH = maxScrollX > 1;

    const vBar = vBarRef.current;
    const vThumb = vThumbRef.current;
    if (vBar && vThumb) {
      if (!hasV) {
        vBar.style.display = 'none';
        vMetricRef.current = { trackLen: 0, thumbLen: 0, maxScroll: 0 };
      } else {
        const bottomInset = hasH ? CROSS_AXIS_RESERVE_PX : TRACK_PAD_PX;
        const trackLen = Math.max(0, clientHeight - topInset - bottomInset);
        const thumbLen = Math.min(
          trackLen,
          Math.max(MIN_THUMB_PX, Math.round((clientHeight / scrollHeight) * trackLen))
        );
        const maxTravel = Math.max(0, trackLen - thumbLen);
        const ratio = maxScrollY > 0 ? Math.min(1, Math.max(0, vpEl.scrollTop / maxScrollY)) : 0;
        const offset = Math.round(ratio * maxTravel);

        vBar.style.display = 'block';
        vBar.style.top = `${topInset}px`;
        vBar.style.bottom = `${bottomInset}px`;
        vThumb.style.height = `${thumbLen}px`;
        vThumb.style.transform = `translate3d(0px, ${offset}px, 0px)`;
        vMetricRef.current = { trackLen, thumbLen, maxScroll: maxScrollY };
      }
    }

    const hBar = hBarRef.current;
    const hThumb = hThumbRef.current;
    if (hBar && hThumb) {
      if (!hasH) {
        hBar.style.display = 'none';
        hMetricRef.current = { trackLen: 0, thumbLen: 0, maxScroll: 0 };
      } else {
        const rightInset = hasV ? CROSS_AXIS_RESERVE_PX : TRACK_PAD_PX;
        if (winScroll) {
          const rect = vpEl.getBoundingClientRect();
          const winH = typeof window !== 'undefined' ? window.innerHeight : 800;
          if (rect.height <= topInset + 16 || rect.bottom <= 44 || rect.top >= winH - 10) {
            hBar.style.display = 'none';
            hMetricRef.current = { trackLen: 0, thumbLen: 0, maxScroll: 0 };
            return;
          }
          const barTop = Math.max(topInset, Math.min(rect.height - 8, winH - rect.top - 8));
          hBar.style.top = '0px';
          hBar.style.bottom = 'auto';
          hBar.style.transform = `translate3d(0px, ${Math.round(barTop)}px, 0px)`;
        } else {
          hBar.style.top = '';
          hBar.style.bottom = `${TRACK_PAD_PX}px`;
          hBar.style.transform = '';
        }

        const trackLen = Math.max(0, clientWidth - TRACK_PAD_PX - rightInset);
        const thumbLen = Math.min(
          trackLen,
          Math.max(MIN_THUMB_PX, Math.round((clientWidth / scrollWidth) * trackLen))
        );
        const maxTravel = Math.max(0, trackLen - thumbLen);
        const ratio = maxScrollX > 0 ? Math.min(1, Math.max(0, vpEl.scrollLeft / maxScrollX)) : 0;
        const offset = Math.round(ratio * maxTravel);

        hBar.style.display = 'block';
        hBar.style.right = `${rightInset}px`;
        hThumb.style.width = `${thumbLen}px`;
        hThumb.style.transform = `translate3d(${offset}px, 0px, 0px)`;
        hMetricRef.current = { trackLen, thumbLen, maxScroll: maxScrollX };
      }
    }
  }, [scrollContainerRef]);

  const scheduleSync = useCallback(() => {
    if (syncRafRef.current !== null || typeof window === 'undefined') {
      return;
    }
    syncRafRef.current = window.requestAnimationFrame(syncScrollbarsNow);
  }, [syncScrollbarsNow]);

  const notifyScroll = useCallback(() => {
    syncScrollbarsNow();
    if (latestRef.current.alwaysShow) {
      updateHostActiveAttr();
      return;
    }
    isScrollingRef.current = true;
    updateHostActiveAttr();
    if (hideTimerRef.current !== null && typeof window !== 'undefined') {
      window.clearTimeout(hideTimerRef.current);
    }
    if (typeof window !== 'undefined') {
      hideTimerRef.current = window.setTimeout(() => {
        isScrollingRef.current = false;
        hideTimerRef.current = null;
        updateHostActiveAttr();
      }, HIDE_DELAY_MS);
    }
  }, [syncScrollbarsNow, updateHostActiveAttr]);

  // Đồng bộ khi kích thước nội dung, chiều cao tiêu đề sticky hoặc trạng thái alwaysShow thay đổi
  useEffect(() => {
    updateHostActiveAttr();
    syncScrollbarsNow();
  }, [
    alwaysShow,
    isWindowScroll,
    verticalTrackTopInset,
    totalContentHeight,
    totalGridWidth,
    viewportHeight,
    updateHostActiveAttr,
    syncScrollbarsNow,
  ]);

  // Theo dõi cuộn Window & thay đổi kích thước viewport
  useEffect(() => {
    const vpEl = scrollContainerRef.current;
    if (!vpEl) return;

    const ro =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => {
            scheduleSync();
          })
        : null;
    ro?.observe(vpEl);

    const onWinScrollOrResize = () => {
      scheduleSync();
    };
    if (typeof window !== 'undefined') {
      if (isWindowScroll) {
        window.addEventListener('scroll', onWinScrollOrResize, { passive: true });
      }
      window.addEventListener('resize', onWinScrollOrResize, { passive: true });
    }

    return () => {
      ro?.disconnect();
      if (typeof window !== 'undefined') {
        window.removeEventListener('scroll', onWinScrollOrResize);
        window.removeEventListener('resize', onWinScrollOrResize);
      }
    };
  }, [scrollContainerRef, isWindowScroll, scheduleSync]);

  useEffect(() => {
    return () => {
      if (hideTimerRef.current !== null && typeof window !== 'undefined') {
        window.clearTimeout(hideTimerRef.current);
      }
      if (syncRafRef.current !== null && typeof window !== 'undefined') {
        window.cancelAnimationFrame(syncRafRef.current);
      }
    };
  }, []);

  const isInteractionLocked = () =>
    latestRef.current.isLockedRef.current || isAnyPopupActive();

  const onMouseEnter = useCallback(() => {
    isHoveredRef.current = true;
    updateHostActiveAttr();
    scheduleSync();
  }, [updateHostActiveAttr, scheduleSync]);

  const onMouseLeave = useCallback(() => {
    isHoveredRef.current = false;
    updateHostActiveAttr();
  }, [updateHostActiveAttr]);

  const onTouchStart = useCallback(() => {
    if (latestRef.current.alwaysShow) return;
    isScrollingRef.current = true;
    updateHostActiveAttr();
    if (hideTimerRef.current !== null && typeof window !== 'undefined') {
      window.clearTimeout(hideTimerRef.current);
    }
    if (typeof window !== 'undefined') {
      hideTimerRef.current = window.setTimeout(() => {
        isScrollingRef.current = false;
        hideTimerRef.current = null;
        updateHostActiveAttr();
      }, HIDE_DELAY_MS);
    }
  }, [updateHostActiveAttr]);

  const startDrag = useCallback(
    (axis: 'vertical' | 'horizontal', e: React.PointerEvent<HTMLDivElement>) => {
      if (e.button !== 0 || isInteractionLocked()) return;
      const vpEl = scrollContainerRef.current;
      if (!vpEl) return;

      const metric = axis === 'vertical' ? vMetricRef.current : hMetricRef.current;
      const maxTravel = Math.max(0, metric.trackLen - metric.thumbLen);
      if (maxTravel <= 0 || metric.maxScroll <= 0) return;

      e.preventDefault();
      e.stopPropagation();

      const startPos = axis === 'vertical' ? e.clientY : e.clientX;
      const startScroll = axis === 'vertical' ? vpEl.scrollTop : vpEl.scrollLeft;
      const thumbEl = axis === 'vertical' ? vThumbRef.current : hThumbRef.current;

      isDraggingRef.current = true;
      thumbEl?.classList.add('is-dragging');
      updateHostActiveAttr();

      const onPointerMove = (moveEvent: PointerEvent) => {
        if (isInteractionLocked()) return;
        const deltaPointer = (axis === 'vertical' ? moveEvent.clientY : moveEvent.clientX) - startPos;
        const nextScroll = startScroll + (deltaPointer / maxTravel) * metric.maxScroll;
        const clamped = Math.max(0, Math.min(metric.maxScroll, nextScroll));
        if (axis === 'vertical') {
          vpEl.scrollTop = clamped;
        } else {
          vpEl.scrollLeft = clamped;
        }
        syncScrollbarsNow();
      };

      const onPointerUp = () => {
        isDraggingRef.current = false;
        thumbEl?.classList.remove('is-dragging');
        updateHostActiveAttr();
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
        window.removeEventListener('pointercancel', onPointerUp);
      };

      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
      window.addEventListener('pointercancel', onPointerUp);
    },
    [scrollContainerRef, updateHostActiveAttr, syncScrollbarsNow]
  );

  const onVerticalThumbPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => startDrag('vertical', e),
    [startDrag]
  );

  const onHorizontalThumbPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => startDrag('horizontal', e),
    [startDrag]
  );

  const onVerticalTrackMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target !== vBarRef.current || isInteractionLocked()) return;
      const vpEl = scrollContainerRef.current;
      const barEl = vBarRef.current;
      if (!vpEl || !barEl) return;
      const metric = vMetricRef.current;
      const maxTravel = Math.max(0, metric.trackLen - metric.thumbLen);
      if (maxTravel <= 0 || metric.maxScroll <= 0) return;

      e.preventDefault();
      e.stopPropagation();
      const rect = barEl.getBoundingClientRect();
      const clickPos = e.clientY - rect.top - metric.thumbLen / 2;
      const ratio = Math.max(0, Math.min(1, clickPos / maxTravel));
      vpEl.scrollTop = ratio * metric.maxScroll;
      syncScrollbarsNow();
    },
    [scrollContainerRef, syncScrollbarsNow]
  );

  const onHorizontalTrackMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target !== hBarRef.current || isInteractionLocked()) return;
      const vpEl = scrollContainerRef.current;
      const barEl = hBarRef.current;
      if (!vpEl || !barEl) return;
      const metric = hMetricRef.current;
      const maxTravel = Math.max(0, metric.trackLen - metric.thumbLen);
      if (maxTravel <= 0 || metric.maxScroll <= 0) return;

      e.preventDefault();
      e.stopPropagation();
      const rect = barEl.getBoundingClientRect();
      const clickPos = e.clientX - rect.left - metric.thumbLen / 2;
      const ratio = Math.max(0, Math.min(1, clickPos / maxTravel));
      vpEl.scrollLeft = ratio * metric.maxScroll;
      syncScrollbarsNow();
    },
    [scrollContainerRef, syncScrollbarsNow]
  );

  return {
    vBarRef,
    vThumbRef,
    hBarRef,
    hThumbRef,
    notifyScroll,
    syncScrollbars: scheduleSync,
    hostInteractionProps: {
      onMouseEnter,
      onMouseLeave,
      onTouchStart,
    },
    onVerticalTrackMouseDown,
    onHorizontalTrackMouseDown,
    onVerticalThumbPointerDown,
    onHorizontalThumbPointerDown,
  };
}
