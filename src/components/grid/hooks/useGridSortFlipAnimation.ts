import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { SortConfig, GroupSortConfig } from '../types';
import { computeSortRowFlipState } from '../gridUtils';

interface UseGridSortFlipAnimationParams<T> {
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
  sortConfig?: SortConfig | null;
  groupSortConfig?: GroupSortConfig | null;
  visibleChunksMap: Map<number, T[]>;
  chunkSize: number;
  actualRowHeight: number;
  viewportHeight: number;
  getRowKey: (row: T, index: number) => string | number;
  autoScrolling: boolean;
}

export function useGridSortFlipAnimation<T>({
  scrollContainerRef,
  sortConfig,
  groupSortConfig,
  visibleChunksMap,
  chunkSize,
  actualRowHeight,
  viewportHeight,
  getRowKey,
  autoScrolling,
}: UseGridSortFlipAnimationParams<T>) {
  const sortSignature = `${sortConfig?.key ?? ''}:${sortConfig?.direction ?? ''}:${
    sortConfig?.sortByMonth ?? ''
  }|${groupSortConfig?.colKey ?? ''}:${groupSortConfig?.direction ?? ''}`;
  const prevSortSignatureRef = useRef<string | null>(null);
  const prevRowIndexMapRef = useRef<Map<string, number>>(new Map());
  const prevViewportRowRangeRef = useRef<{ startRow: number; centerRow: number }>({
    startRow: 0,
    centerRow: 10,
  });
  const sortAnimRafRef = useRef<number | null>(null);
  const sortAnimTimeoutRef = useRef<number | null>(null);
  const activeAnimatedRowsRef = useRef<HTMLElement[]>([]);

  useLayoutEffect(() => {
    const isSortChanged =
      prevSortSignatureRef.current !== null &&
      prevSortSignatureRef.current !== sortSignature;
    prevSortSignatureRef.current = sortSignature;

    const viewportEl = scrollContainerRef.current;

    if (isSortChanged && viewportEl && !autoScrolling) {
      if (sortAnimRafRef.current !== null) {
        cancelAnimationFrame(sortAnimRafRef.current);
        sortAnimRafRef.current = null;
      }
      if (sortAnimTimeoutRef.current !== null) {
        window.clearTimeout(sortAnimTimeoutRef.current);
        sortAnimTimeoutRef.current = null;
      }
      for (const el of activeAnimatedRowsRef.current) {
        el.style.transition = '';
        el.style.transform = '';
        el.style.opacity = '';
        el.style.zIndex = '';
        el.style.willChange = '';
      }
      activeAnimatedRowsRef.current = [];

      const prevMap = prevRowIndexMapRef.current;
      const { startRow: prevStartRow, centerRow: viewportCenterRow } =
        prevViewportRowRangeRef.current;
      const rowNodes = viewportEl.querySelectorAll<HTMLElement>(
        '.agv-rows-canvas [data-row-key]'
      );
      const animatedEls: HTMLElement[] = [];

      rowNodes.forEach((rowEl) => {
        const rKey = rowEl.getAttribute('data-row-key');
        const rIdxAttr = rowEl.getAttribute('data-row-idx');
        if (!rKey || rIdxAttr === null) return;
        const newRowIdx = parseInt(rIdxAttr, 10);
        if (Number.isNaN(newRowIdx) || newRowIdx < 0) return;

        const oldRowIdx = prevMap.get(rKey);
        const flip = computeSortRowFlipState({
          rowKey: rKey,
          newRowIndex: newRowIdx,
          oldRowIndex: oldRowIdx,
          rowHeight: actualRowHeight,
          viewportCenterRow,
          prevStartRow,
        });

        rowEl.style.animation = 'none';
        if (!flip) return;

        // Bước 1 (Invert): Đặt dòng ở vị trí cũ ngay trước khi trình duyệt paint
        rowEl.style.transition = 'none';
        rowEl.style.willChange = 'transform, opacity';
        rowEl.style.transform = `translate3d(0px, ${flip.deltaY}px, 0px)`;
        if (flip.initialOpacity < 1) {
          rowEl.style.opacity = String(flip.initialOpacity);
        }
        rowEl.style.zIndex = String(flip.zIndex);
        animatedEls.push(rowEl);
      });

      if (animatedEls.length > 0) {
        viewportEl.setAttribute('data-agv-sorting', 'true');
        activeAnimatedRowsRef.current = animatedEls;
        void viewportEl.offsetHeight;

        // Bước 2 (Play): Trượt mượt GPU 300ms về vị trí mới (0px)
        sortAnimRafRef.current = requestAnimationFrame(() => {
          sortAnimRafRef.current = null;
          for (const el of animatedEls) {
            el.style.transition =
              'transform 300ms cubic-bezier(0.22, 1, 0.36, 1), opacity 220ms ease-out';
            el.style.transform = 'translate3d(0px, 0px, 0px)';
            el.style.opacity = '1';
          }
        });

        // Bước 3 (Cleanup): Xóa sạch inline styles sau 320ms để bảo toàn 100% position: sticky và contain: strict
        sortAnimTimeoutRef.current = window.setTimeout(() => {
          sortAnimTimeoutRef.current = null;
          for (const el of activeAnimatedRowsRef.current) {
            el.style.transition = '';
            el.style.transform = '';
            el.style.opacity = '';
            el.style.zIndex = '';
            el.style.willChange = '';
          }
          activeAnimatedRowsRef.current = [];
          viewportEl.removeAttribute('data-agv-sorting');
        }, 320);
      }
    }

    // Cập nhật bản đồ tọa độ dòng hiện hành phục vụ lần Sort kế tiếp
    const nextMap = new Map<string, number>();
    for (const [cIdx, cRows] of visibleChunksMap.entries()) {
      const baseIdx = cIdx * chunkSize;
      for (let i = 0; i < cRows.length; i++) {
        const r = cRows[i] as any;
        const actualIdx = baseIdx + i;
        const keyStr = r?._isGroupRow
          ? `group_${r.groupColumnKey || ''}_${r.groupValue ?? r.path ?? actualIdx}`
          : String(getRowKey(r, actualIdx));
        nextMap.set(keyStr, actualIdx);
      }
    }
    prevRowIndexMapRef.current = nextMap;

    const curTop = viewportEl?.scrollTop || 0;
    const startRow = Math.max(0, Math.floor(curTop / actualRowHeight));
    const visibleCount = Math.max(1, Math.floor((viewportHeight || 600) / actualRowHeight));
    prevViewportRowRangeRef.current = {
      startRow,
      centerRow: startRow + Math.floor(visibleCount / 2),
    };
  }, [
    scrollContainerRef,
    sortSignature,
    visibleChunksMap,
    chunkSize,
    actualRowHeight,
    viewportHeight,
    getRowKey,
    autoScrolling,
  ]);

  useEffect(() => {
    return () => {
      if (sortAnimRafRef.current !== null) {
        cancelAnimationFrame(sortAnimRafRef.current);
      }
      if (sortAnimTimeoutRef.current !== null) {
        window.clearTimeout(sortAnimTimeoutRef.current);
      }
    };
  }, []);
}
