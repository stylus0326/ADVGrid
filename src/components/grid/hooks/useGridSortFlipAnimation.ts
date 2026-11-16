import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { SortConfig, GroupSortConfig } from '../types';

type SortFlipMod = typeof import('./sortFlipEngine');
let _flipMod: SortFlipMod | null = null;
let _flipPromise: Promise<SortFlipMod> | null = null;

export function preloadSortFlipEngine(): void {
  if (_flipMod || _flipPromise) return;
  _flipPromise = import('./sortFlipEngine').then((m) => {
    _flipMod = m;
    return m;
  });
}

interface UseGridSortFlipAnimationParams<T> {
  enabled?: boolean;
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
  virtualScrollTopRef?: React.RefObject<number>;
  sortConfig?: SortConfig | null;
  sortRules?: SortConfig[];
  groupSortConfig?: GroupSortConfig | null;
  visibleRows?: Array<{ rowIndex: number; row: T }>;
  visibleChunksMap?: Map<number, T[]>;
  chunkSize?: number;
  actualRowHeight: number;
  findRowIndexAtOffset?: (offsetY: number) => number;
  viewportHeight: number;
  getRowKey: (row: T, index: number) => string | number;
}

export function useGridSortFlipAnimation<T>({
  enabled = true,
  scrollContainerRef,
  virtualScrollTopRef,
  sortConfig,
  sortRules,
  groupSortConfig,
  visibleRows,
  visibleChunksMap,
  chunkSize = 20,
  actualRowHeight,
  findRowIndexAtOffset,
  viewportHeight,
  getRowKey,
}: UseGridSortFlipAnimationParams<T>) {
  const rulesSig =
    sortRules && sortRules.length > 0
      ? sortRules.map((r) => `${r.key}:${r.direction}:${r.sortByMonth ?? ''}`).join(',')
      : `${sortConfig?.key ?? ''}:${sortConfig?.direction ?? ''}:${sortConfig?.sortByMonth ?? ''}`;
  const sortSignature = `${rulesSig}|${groupSortConfig?.colKey ?? ''}:${groupSortConfig?.direction ?? ''}`;
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
    if (!enabled) return;
    const isSortChanged =
      prevSortSignatureRef.current !== null &&
      prevSortSignatureRef.current !== sortSignature;
    prevSortSignatureRef.current = sortSignature;

    const viewportEl = scrollContainerRef.current;
    if (!isSortChanged || !viewportEl) return;

    const prevMap = prevRowIndexMapRef.current;
    const { startRow: prevStartRow, centerRow: viewportCenterRow } =
      prevViewportRowRangeRef.current;

    if (_flipMod) {
      _flipMod.runSortFlipAnimation({
        viewportEl,
        prevMap,
        prevStartRow,
        viewportCenterRow,
        actualRowHeight,
        activeAnimatedRowsRef,
        sortAnimRafRef,
        sortAnimTimeoutRef,
      });
      return;
    }

    if (!_flipPromise) {
      _flipPromise = import('./sortFlipEngine').then((m) => {
        _flipMod = m;
        return m;
      });
    }
    void _flipPromise.then((m) => {
      m.runSortFlipAnimation({
        viewportEl,
        prevMap,
        prevStartRow,
        viewportCenterRow,
        actualRowHeight,
        activeAnimatedRowsRef,
        sortAnimRafRef,
        sortAnimTimeoutRef,
      });
    });
  }, [enabled, scrollContainerRef, sortSignature, actualRowHeight]);

  // Theo dõi tọa độ dòng hiện tại sau commit (passive useEffect, zero work khi !enabled)
  useEffect(() => {
    if (!enabled) return;
    const nextMap = new Map<string, number>();
    if (visibleRows) {
      for (let i = 0; i < visibleRows.length; i++) {
        const item = visibleRows[i];
        const r = item.row as any;
        const actualIdx = item.rowIndex;
        const keyStr = r?._isGroupRow
          ? `group_${r.groupColumnKey || ''}_${r.groupValue ?? r.path ?? actualIdx}`
          : String(getRowKey(r, actualIdx));
        nextMap.set(keyStr, actualIdx);
      }
    } else if (visibleChunksMap) {
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
    }
    prevRowIndexMapRef.current = nextMap;

    const curTop =
      virtualScrollTopRef?.current || scrollContainerRef.current?.scrollTop || 0;
    const startRow = Math.max(
      0,
      findRowIndexAtOffset ? findRowIndexAtOffset(curTop) : Math.floor(curTop / actualRowHeight)
    );
    const endRow = findRowIndexAtOffset
      ? findRowIndexAtOffset(curTop + (viewportHeight || 600))
      : startRow + Math.max(1, Math.floor((viewportHeight || 600) / actualRowHeight));
    const visibleCount = Math.max(1, endRow - startRow + 1);
    prevViewportRowRangeRef.current = {
      startRow,
      centerRow: startRow + Math.floor(visibleCount / 2),
    };
  }, [
    enabled,
    scrollContainerRef,
    virtualScrollTopRef,
    visibleRows,
    visibleChunksMap,
    chunkSize,
    actualRowHeight,
    findRowIndexAtOffset,
    viewportHeight,
    getRowKey,
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
