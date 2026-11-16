import React, { useCallback, useEffect, useLayoutEffect, useRef } from 'react';

export interface AdvOverlayScrollProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  viewportClassName?: string;
  viewportStyle?: React.CSSProperties;
  viewportRef?: React.Ref<HTMLDivElement>;
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
  onViewportMouseMove?: React.MouseEventHandler<HTMLDivElement>;
  scrollX?: boolean;
  trackTopInset?: number;
  trackBottomInset?: number;
  alwaysShow?: boolean;
  contentSignature?: unknown;
}

const MIN_THUMB_PX = 24;
const TRACK_EDGE_PX = 2;
const HIDE_DELAY_MS = 700;

interface DragSession {
  axis: 'x' | 'y';
  startPointer: number;
  startScroll: number;
  maxScroll: number;
  maxThumbOffset: number;
}

/**
 * Container cuộn với thanh kéo nổi 6px kiểu overlay: ẩn thanh cuộn gốc và chỉ hiện thumb khi rê chuột/cuộn.
 */
export const AdvOverlayScroll: React.FC<AdvOverlayScrollProps> = ({
  children,
  className = '',
  style,
  viewportClassName = '',
  viewportStyle,
  viewportRef,
  onScroll,
  onViewportMouseMove,
  scrollX = false,
  trackTopInset = TRACK_EDGE_PX,
  trackBottomInset = TRACK_EDGE_PX,
  alwaysShow = false,
  contentSignature,
}) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const internalViewportRef = useRef<HTMLDivElement | null>(null);
  const vBarRef = useRef<HTMLDivElement | null>(null);
  const vThumbRef = useRef<HTMLDivElement | null>(null);
  const hBarRef = useRef<HTMLDivElement | null>(null);
  const hThumbRef = useRef<HTMLDivElement | null>(null);

  const hoveredRef = useRef(false);
  const scrollingRef = useRef(false);
  const draggingRef = useRef<DragSession | null>(null);
  const hideTimerRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const syncedInCommitRef = useRef(false);

  const metricsRef = useRef({
    maxScrollTop: 0,
    maxThumbTop: 0,
    thumbH: 0,
    maxScrollLeft: 0,
    maxThumbLeft: 0,
    thumbW: 0,
  });

  const assignViewportRef = useCallback(
    (node: HTMLDivElement | null) => {
      internalViewportRef.current = node;
      if (typeof viewportRef === 'function') {
        viewportRef(node);
      } else if (viewportRef && 'current' in viewportRef) {
        (viewportRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }
    },
    [viewportRef]
  );

  const updateActiveAttribute = useCallback(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const isActive =
      alwaysShow || hoveredRef.current || scrollingRef.current || draggingRef.current !== null;
    wrapper.setAttribute('data-overlay-scroll-active', isActive ? 'true' : 'false');
  }, [alwaysShow]);

  const syncMetrics = useCallback(() => {
    const vp = internalViewportRef.current;
    const vBar = vBarRef.current;
    const vThumb = vThumbRef.current;
    if (!vp || !vBar || !vThumb) return;

    const clientH = vp.clientHeight;
    const scrollH = vp.scrollHeight;
    const clientW = vp.clientWidth;
    const scrollW = vp.scrollWidth;

    const maxScrollLeft = scrollX ? Math.max(0, scrollW - clientW) : 0;
    const hasX = scrollX && maxScrollLeft > 1 && clientW > 32;

    const topInset = Math.max(TRACK_EDGE_PX, trackTopInset);
    const bottomInset = Math.max(TRACK_EDGE_PX, trackBottomInset + (hasX ? 8 : 0));
    const vTrackLen = Math.max(0, clientH - topInset - bottomInset);
    const maxScrollTop = Math.max(0, scrollH - clientH);
    const hasY = maxScrollTop > 1 && vTrackLen >= MIN_THUMB_PX;

    if (hasY) {
      const thumbH = Math.min(vTrackLen, Math.max(MIN_THUMB_PX, Math.round((clientH / scrollH) * vTrackLen)));
      const maxThumbTop = Math.max(0, vTrackLen - thumbH);
      const thumbTop = maxScrollTop > 0 ? Math.min(maxThumbTop, (vp.scrollTop / maxScrollTop) * maxThumbTop) : 0;

      vBar.style.display = 'block';
      vBar.style.top = `${topInset}px`;
      vBar.style.bottom = `${bottomInset}px`;
      vThumb.style.height = `${thumbH}px`;
      vThumb.style.transform = `translate3d(0, ${thumbTop}px, 0)`;

      metricsRef.current.maxScrollTop = maxScrollTop;
      metricsRef.current.maxThumbTop = maxThumbTop;
      metricsRef.current.thumbH = thumbH;
    } else {
      vBar.style.display = 'none';
      metricsRef.current.maxScrollTop = 0;
      metricsRef.current.maxThumbTop = 0;
      metricsRef.current.thumbH = 0;
    }

    const hBar = hBarRef.current;
    const hThumb = hThumbRef.current;
    if (hBar && hThumb) {
      const rightInset = hasY ? 10 : TRACK_EDGE_PX;
      const hTrackLen = Math.max(0, clientW - TRACK_EDGE_PX - rightInset);
      if (hasX && hTrackLen >= MIN_THUMB_PX) {
        const thumbW = Math.min(hTrackLen, Math.max(MIN_THUMB_PX, Math.round((clientW / scrollW) * hTrackLen)));
        const maxThumbLeft = Math.max(0, hTrackLen - thumbW);
        const thumbLeft = maxScrollLeft > 0 ? Math.min(maxThumbLeft, (vp.scrollLeft / maxScrollLeft) * maxThumbLeft) : 0;

        hBar.style.display = 'block';
        hBar.style.left = `${TRACK_EDGE_PX}px`;
        hBar.style.right = `${rightInset}px`;
        hThumb.style.width = `${thumbW}px`;
        hThumb.style.transform = `translate3d(${thumbLeft}px, 0, 0)`;

        metricsRef.current.maxScrollLeft = maxScrollLeft;
        metricsRef.current.maxThumbLeft = maxThumbLeft;
        metricsRef.current.thumbW = thumbW;
      } else {
        hBar.style.display = 'none';
        metricsRef.current.maxScrollLeft = 0;
        metricsRef.current.maxThumbLeft = 0;
        metricsRef.current.thumbW = 0;
      }
    }
  }, [scrollX, trackTopInset, trackBottomInset]);

  const scheduleSync = useCallback(() => {
    if (rafRef.current !== null) return;
    rafRef.current = window.requestAnimationFrame(() => {
      rafRef.current = null;
      syncMetrics();
    });
  }, [syncMetrics]);

  useLayoutEffect(() => {
    updateActiveAttribute();
    syncMetrics();
    syncedInCommitRef.current = true;
  }, [updateActiveAttribute, syncMetrics, contentSignature]);

  useLayoutEffect(() => {
    if (syncedInCommitRef.current) {
      syncedInCommitRef.current = false;
      return;
    }
    scheduleSync();
  });

  useEffect(() => {
    const vp = internalViewportRef.current;
    if (!vp) return;

    const resizeObserver =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => scheduleSync()) : null;
    resizeObserver?.observe(vp);

    const mutationObserver =
      typeof MutationObserver !== 'undefined' ? new MutationObserver(() => scheduleSync()) : null;
    mutationObserver?.observe(vp, { childList: true });

    return () => {
      resizeObserver?.disconnect();
      mutationObserver?.disconnect();
    };
  }, [scheduleSync]);

  useEffect(() => {
    return () => {
      if (hideTimerRef.current !== null) {
        window.clearTimeout(hideTimerRef.current);
      }
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const handleViewportScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      syncMetrics();
      scrollingRef.current = true;
      updateActiveAttribute();
      if (hideTimerRef.current !== null) {
        window.clearTimeout(hideTimerRef.current);
      }
      hideTimerRef.current = window.setTimeout(() => {
        hideTimerRef.current = null;
        scrollingRef.current = false;
        updateActiveAttribute();
      }, HIDE_DELAY_MS);
      onScroll?.(e);
    },
    [syncMetrics, updateActiveAttribute, onScroll]
  );

  const handleThumbMouseDown = useCallback(
    (axis: 'x' | 'y', e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      const vp = internalViewportRef.current;
      if (!vp) return;

      const m = metricsRef.current;
      const session: DragSession =
        axis === 'y'
          ? {
              axis: 'y',
              startPointer: e.clientY,
              startScroll: vp.scrollTop,
              maxScroll: m.maxScrollTop,
              maxThumbOffset: m.maxThumbTop,
            }
          : {
              axis: 'x',
              startPointer: e.clientX,
              startScroll: vp.scrollLeft,
              maxScroll: m.maxScrollLeft,
              maxThumbOffset: m.maxThumbLeft,
            };

      if (session.maxThumbOffset <= 0 || session.maxScroll <= 0) return;

      draggingRef.current = session;
      const activeThumb = axis === 'y' ? vThumbRef.current : hThumbRef.current;
      activeThumb?.classList.add('is-dragging');
      updateActiveAttribute();

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const drag = draggingRef.current;
        const viewport = internalViewportRef.current;
        if (!drag || !viewport) return;
        const deltaPointer =
          (drag.axis === 'y' ? moveEvent.clientY : moveEvent.clientX) - drag.startPointer;
        const nextScroll = drag.startScroll + (deltaPointer / drag.maxThumbOffset) * drag.maxScroll;
        if (drag.axis === 'y') {
          viewport.scrollTop = nextScroll;
        } else {
          viewport.scrollLeft = nextScroll;
        }
      };

      const handleMouseUp = () => {
        draggingRef.current = null;
        activeThumb?.classList.remove('is-dragging');
        updateActiveAttribute();
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    },
    [updateActiveAttribute]
  );

  const handleTrackMouseDown = useCallback((axis: 'x' | 'y', e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    e.preventDefault();
    e.stopPropagation();
    const vp = internalViewportRef.current;
    if (!vp) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const m = metricsRef.current;
    if (axis === 'y' && m.maxThumbTop > 0) {
      const clickOffset = e.clientY - rect.top - m.thumbH / 2;
      const ratio = Math.min(1, Math.max(0, clickOffset / m.maxThumbTop));
      vp.scrollTop = ratio * m.maxScrollTop;
    } else if (axis === 'x' && m.maxThumbLeft > 0) {
      const clickOffset = e.clientX - rect.left - m.thumbW / 2;
      const ratio = Math.min(1, Math.max(0, clickOffset / m.maxThumbLeft));
      vp.scrollLeft = ratio * m.maxScrollLeft;
    }
  }, []);

  return (
    <div
      ref={wrapperRef}
      data-overlay-scroll-active={alwaysShow ? 'true' : 'false'}
      onMouseEnter={() => {
        hoveredRef.current = true;
        updateActiveAttribute();
      }}
      onMouseLeave={() => {
        hoveredRef.current = false;
        updateActiveAttribute();
      }}
      className={`relative flex flex-col min-h-0 ${className}`.trim()}
      style={style}
    >
      <div
        ref={assignViewportRef}
        onScroll={handleViewportScroll}
        onMouseMove={onViewportMouseMove}
        className={`agv-overlay-scroll-viewport ${viewportClassName}`.trim()}
        style={viewportStyle}
      >
        {children}
      </div>

      <div
        ref={vBarRef}
        onMouseDown={(e) => handleTrackMouseDown('y', e)}
        className="agv-overlay-scroll-bar is-vertical"
        style={{ display: 'none' }}
        aria-hidden="true"
      >
        <div
          ref={vThumbRef}
          onMouseDown={(e) => handleThumbMouseDown('y', e)}
          className="agv-overlay-scroll-thumb is-vertical"
        />
      </div>

      {scrollX && (
        <div
          ref={hBarRef}
          onMouseDown={(e) => handleTrackMouseDown('x', e)}
          className="agv-overlay-scroll-bar is-horizontal"
          style={{ display: 'none' }}
          aria-hidden="true"
        >
          <div
            ref={hThumbRef}
            onMouseDown={(e) => handleThumbMouseDown('x', e)}
            className="agv-overlay-scroll-thumb is-horizontal"
          />
        </div>
      )}
    </div>
  );
};

export default AdvOverlayScroll;
