import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

export interface UseVirtualListOptions {
  itemCount: number;
  itemHeight: number;
  viewportRef: React.RefObject<HTMLDivElement | null>;
  overscan?: number;
  threshold?: number;
  enabled?: boolean;
  defaultViewportHeight?: number;
  topOffset?: number;
}

export interface UseVirtualListResult {
  isVirtualized: boolean;
  startIndex: number;
  endIndex: number;
  totalHeight: number;
  offsetY: number;
  topSpacer: number;
  bottomSpacer: number;
  handleScroll: (e: React.UIEvent<HTMLDivElement>) => void;
  scrollToIndex: (index: number, insetTop?: number, insetBottom?: number) => void;
  resetScroll: () => void;
  syncFromViewport: () => void;
}

interface VirtualRange {
  startIndex: number;
  endIndex: number;
}

function computeVirtualWindow(
  scrollTop: number,
  viewportHeight: number,
  itemCount: number,
  itemHeight: number,
  overscan: number,
  topOffset: number
): VirtualRange {
  if (itemCount <= 0) return { startIndex: 0, endIndex: 0 };
  const safeTop = Math.max(0, scrollTop);
  const visibleBodyHeight = Math.max(itemHeight, viewportHeight - Math.max(0, topOffset));
  const startIndex = Math.max(0, Math.floor(safeTop / itemHeight) - overscan);
  const endIndex = Math.min(
    itemCount,
    Math.ceil((safeTop + visibleBodyHeight) / itemHeight) + overscan
  );
  return { startIndex, endIndex };
}

/**
 * Hook ảo hóa danh sách theo chiều cao cố định, chỉ render vùng nhìn thấy + buffer và cập nhật state theo mốc dòng.
 */
export function useVirtualList({
  itemCount,
  itemHeight,
  viewportRef,
  overscan = 6,
  threshold = 40,
  enabled = true,
  defaultViewportHeight = 232,
  topOffset = 0,
}: UseVirtualListOptions): UseVirtualListResult {
  const isVirtualized = enabled && itemCount >= threshold && itemHeight > 0;
  const measuredHeightRef = useRef<number>(defaultViewportHeight);

  // Luôn khởi tạo & giữ range ở kích thước cửa sổ hiển thị gọn (không bao giờ bung 0..itemCount lúc đóng hoặc chờ mở)
  const [range, setRange] = useState<VirtualRange>(() =>
    computeVirtualWindow(0, defaultViewportHeight, itemCount, itemHeight, overscan, topOffset)
  );

  const commitRange = useCallback(
    (scrollTop: number, vpHeight: number) => {
      const next = isVirtualized
        ? computeVirtualWindow(
            scrollTop,
            vpHeight,
            itemCount,
            itemHeight,
            overscan,
            topOffset
          )
        : computeVirtualWindow(
            0,
            defaultViewportHeight,
            itemCount,
            itemHeight,
            overscan,
            topOffset
          );
      setRange((prev) =>
        prev.startIndex === next.startIndex && prev.endIndex === next.endIndex ? prev : next
      );
    },
    [isVirtualized, defaultViewportHeight, itemCount, itemHeight, overscan, topOffset]
  );

  const syncFromViewport = useCallback(() => {
    const vp = viewportRef.current;
    const h = vp && vp.clientHeight > 0 ? vp.clientHeight : defaultViewportHeight;
    measuredHeightRef.current = h;
    commitRange(vp ? vp.scrollTop : 0, h);
  }, [viewportRef, defaultViewportHeight, commitRange]);

  useLayoutEffect(() => {
    syncFromViewport();
  }, [syncFromViewport]);

  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp || !isVirtualized || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(() => {
      syncFromViewport();
    });
    observer.observe(vp);
    return () => observer.disconnect();
  }, [viewportRef, isVirtualized, syncFromViewport]);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      if (!isVirtualized) return;
      const vp = e.currentTarget;
      const h = vp.clientHeight > 0 ? vp.clientHeight : measuredHeightRef.current;
      measuredHeightRef.current = h;
      commitRange(vp.scrollTop, h);
    },
    [isVirtualized, commitRange]
  );

  const scrollToIndex = useCallback(
    (index: number, insetTop = 0, insetBottom = 0) => {
      if (index < 0 || index >= itemCount) return;
      const vp = viewportRef.current;
      if (!vp) return;

      const vpHeight = vp.clientHeight > 0 ? vp.clientHeight : defaultViewportHeight;
      const safeTopOffset = Math.max(0, topOffset);
      const itemStart = safeTopOffset + index * itemHeight;
      const itemEnd = itemStart + itemHeight;
      const visibleStart = vp.scrollTop + safeTopOffset + Math.max(0, insetTop);
      const visibleEnd = vp.scrollTop + vpHeight - Math.max(0, insetBottom);

      let nextScrollTop = vp.scrollTop;
      if (itemStart < visibleStart) {
        nextScrollTop = Math.max(0, itemStart - safeTopOffset - Math.max(0, insetTop));
      } else if (itemEnd > visibleEnd) {
        nextScrollTop = Math.max(0, itemEnd - vpHeight + Math.max(0, insetBottom));
      }

      if (Math.abs(nextScrollTop - vp.scrollTop) > 0.5) {
        vp.scrollTop = nextScrollTop;
        commitRange(nextScrollTop, vpHeight);
      } else {
        commitRange(vp.scrollTop, vpHeight);
      }
    },
    [itemCount, viewportRef, defaultViewportHeight, topOffset, itemHeight, commitRange]
  );

  const resetScroll = useCallback(() => {
    const vp = viewportRef.current;
    if (vp && vp.scrollTop !== 0) {
      vp.scrollTop = 0;
    }
    const h = vp && vp.clientHeight > 0 ? vp.clientHeight : defaultViewportHeight;
    commitRange(0, h);
  }, [viewportRef, defaultViewportHeight, commitRange]);

  if (!isVirtualized) {
    return {
      isVirtualized: false,
      startIndex: 0,
      endIndex: itemCount,
      totalHeight: itemCount * itemHeight,
      offsetY: 0,
      topSpacer: 0,
      bottomSpacer: 0,
      handleScroll,
      scrollToIndex,
      resetScroll,
      syncFromViewport,
    };
  }

  const startIndex = Math.min(range.startIndex, itemCount);
  const endIndex = Math.min(Math.max(range.endIndex, startIndex), itemCount);
  const totalHeight = itemCount * itemHeight;
  const offsetY = startIndex * itemHeight;
  const bottomSpacer = Math.max(0, (itemCount - endIndex) * itemHeight);

  return {
    isVirtualized: true,
    startIndex,
    endIndex,
    totalHeight,
    offsetY,
    topSpacer: offsetY,
    bottomSpacer,
    handleScroll,
    scrollToIndex,
    resetScroll,
    syncFromViewport,
  };
}
