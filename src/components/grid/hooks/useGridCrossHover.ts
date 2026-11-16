import { useEffect, useRef } from 'react';

export interface UseGridCrossHoverOptions {
  enabled: boolean;
  highlightHeader?: boolean;
  isResponsiveMode?: boolean;
  isPopupLockActive?: boolean;
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
  visibleVersion?: number | string;
}

function escapeAttrValue(value: string): string {
  if (typeof CSS !== 'undefined' && typeof CSS.escape === 'function') {
    return CSS.escape(value);
  }
  return value.replace(/["\\]/g, '\\$&');
}

/**
 * Theo dõi giao điểm Dòng × Cột khi rê chuột theo cơ chế DOM delegation (0 re-render React).
 * Tự động gắn `data-cross-hover="col" | "cell" | "header"` lên các ô đang hiển thị.
 */
export function useGridCrossHover({
  enabled,
  highlightHeader = true,
  isResponsiveMode = false,
  isPopupLockActive = false,
  scrollContainerRef,
  visibleVersion,
}: UseGridCrossHoverOptions): void {
  const hoveredColKeyRef = useRef<string | null>(null);
  const hoveredCellElRef = useRef<HTMLElement | null>(null);
  const isLockedRef = useRef(isPopupLockActive);
  isLockedRef.current = isPopupLockActive;

  useEffect(() => {
    const viewport = scrollContainerRef.current;
    if (!viewport) return;

    const clearMarkers = () => {
      const marked = viewport.querySelectorAll('[data-cross-hover]');
      for (let i = 0; i < marked.length; i++) {
        marked[i].removeAttribute('data-cross-hover');
      }
      hoveredColKeyRef.current = null;
      hoveredCellElRef.current = null;
    };

    if (!enabled || isResponsiveMode) {
      clearMarkers();
      return;
    }

    const applyColumnMarkers = (colKey: string, activeCell: HTMLElement | null) => {
      const escaped = escapeAttrValue(colKey);
      const bodyCells = viewport.querySelectorAll(
        `.agv-grid-row [data-col-key="${escaped}"]:not([data-span-spacer="true"])`
      );
      for (let i = 0; i < bodyCells.length; i++) {
        const el = bodyCells[i];
        el.setAttribute('data-cross-hover', el === activeCell ? 'cell' : 'col');
      }

      if (highlightHeader) {
        const headerCells = viewport.querySelectorAll(
          `[data-agv-header-root="true"] [data-col-key="${escaped}"]`
        );
        for (let i = 0; i < headerCells.length; i++) {
          headerCells[i].setAttribute('data-cross-hover', 'header');
        }
      }
    };

    const handlePointerOver = (e: PointerEvent) => {
      if (
        isLockedRef.current ||
        viewport.getAttribute('data-agv-scrolling') === 'true' ||
        (typeof document !== 'undefined' &&
          document.documentElement.getAttribute('data-agv-resizing') === 'true')
      ) {
        if (hoveredColKeyRef.current !== null) clearMarkers();
        return;
      }

      const rawTarget = e.target as HTMLElement | null;
      if (!rawTarget) return;

      if (rawTarget.closest('[data-agv-detail-row="true"], .agv-group-row')) {
        if (hoveredColKeyRef.current !== null) clearMarkers();
        return;
      }

      const rowEl = rawTarget.closest('[data-agv-row="true"]') as HTMLElement | null;
      if (!rowEl || !rowEl.classList.contains('agv-grid-row')) {
        if (hoveredColKeyRef.current !== null) clearMarkers();
        return;
      }

      const cellEl = rawTarget.closest('[data-col-key]') as HTMLElement | null;
      if (!cellEl || !rowEl.contains(cellEl) || cellEl.getAttribute('data-span-spacer') === 'true') {
        if (hoveredColKeyRef.current !== null) clearMarkers();
        return;
      }

      const colKey = cellEl.getAttribute('data-col-key');
      const cellRole = cellEl.getAttribute('data-cell-role');
      if (
        !colKey ||
        cellRole === 'stt' ||
        cellRole === 'chk' ||
        cellRole === 'expand' ||
        colKey === 'col_detail_expand'
      ) {
        if (hoveredColKeyRef.current !== null) clearMarkers();
        return;
      }

      if (hoveredColKeyRef.current === colKey) {
        if (hoveredCellElRef.current && hoveredCellElRef.current !== cellEl && hoveredCellElRef.current.isConnected) {
          hoveredCellElRef.current.setAttribute('data-cross-hover', 'col');
        }
        cellEl.setAttribute('data-cross-hover', 'cell');
        hoveredCellElRef.current = cellEl;
        return;
      }

      clearMarkers();
      hoveredColKeyRef.current = colKey;
      hoveredCellElRef.current = cellEl;
      applyColumnMarkers(colKey, cellEl);
    };

    const handlePointerLeave = () => {
      clearMarkers();
    };

    viewport.addEventListener('pointerover', handlePointerOver, { passive: true });
    viewport.addEventListener('pointerleave', handlePointerLeave, { passive: true });

    return () => {
      viewport.removeEventListener('pointerover', handlePointerOver);
      viewport.removeEventListener('pointerleave', handlePointerLeave);
      clearMarkers();
    };
  }, [enabled, highlightHeader, isResponsiveMode, scrollContainerRef]);

  // Đồng bộ lại các ô cột mới mount khi cửa sổ ảo hóa trượt trong lúc đang trỏ chuột
  useEffect(() => {
    const viewport = scrollContainerRef.current;
    const colKey = hoveredColKeyRef.current;
    if (!viewport || !enabled || isResponsiveMode || !colKey) return;

    const escaped = escapeAttrValue(colKey);
    const activeCell = hoveredCellElRef.current;
    const bodyCells = viewport.querySelectorAll(
      `.agv-grid-row [data-col-key="${escaped}"]:not([data-span-spacer="true"])`
    );
    for (let i = 0; i < bodyCells.length; i++) {
      const el = bodyCells[i];
      const nextAttr = el === activeCell ? 'cell' : 'col';
      if (el.getAttribute('data-cross-hover') !== nextAttr) {
        el.setAttribute('data-cross-hover', nextAttr);
      }
    }
  }, [enabled, isResponsiveMode, scrollContainerRef, visibleVersion]);
}
