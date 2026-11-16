import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

const EMPTY_NUMBERS: number[] = [];
const EMPTY_SET: Set<number> = new Set();

export interface RowWindowRange {
  start: number;
  end: number;
}

export interface UseDynamicRowHeightsOptions<T = any> {
  totalRows: number;
  baseRowHeight: number;
  dynamicRowHeight: boolean;
  hasDynamicDetailRows?: boolean;
  estimatedRowHeight?: number;
  getRowHeightProp?: (row: T, rowIndex: number) => number;
  getRowItem: (index: number) => T;
  getRowKey: (row: T, index: number) => string | number;
  overscanRows: number;
  isPhoneMode: boolean;
  phoneExpandedRows: Map<string | number, number>;
  expandedCardExtraHeight: number;
  dataVersion?: number | string;
  layoutResetKey?: string;
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
  virtualScrollTopRef: React.MutableRefObject<number>;
  lastScrollTopRef: React.MutableRefObject<number>;
  isWindowScroll: boolean;
}

export interface UseDynamicRowHeightsResult {
  isDynamicActive: boolean;
  totalContentHeight: number;
  measureVersion: number;
  getRowTop: (rowIndex: number) => number;
  getRowHeight: (rowIndex: number) => number;
  findRowIndexAtOffset: (offsetY: number) => number;
  getVisibleRowRange: (scrollTop: number, viewportHeight: number) => RowWindowRange;
  observeRowSlot: (el: HTMLElement, rowKey: string | number, rowIndex: number) => void;
  unobserveRowSlot: (el: HTMLElement) => void;
}

interface SlotMeta {
  rowKey: string | number;
  rowIndex: number;
}

function binarySearchOffsets(offsets: Float64Array, totalRows: number, y: number): number {
  if (totalRows <= 0) return 0;
  if (y <= 0) return 0;
  const totalH = offsets[totalRows];
  if (y >= totalH) return totalRows - 1;

  let lo = 0;
  let hi = totalRows - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >>> 1;
    const top = offsets[mid];
    const nextTop = offsets[mid + 1];
    if (y < top) {
      hi = mid - 1;
    } else if (y >= nextTop) {
      lo = mid + 1;
    } else {
      return mid;
    }
  }
  return Math.max(0, Math.min(totalRows - 1, lo));
}

function countSortedLessThan(sortedIndices: number[], target: number): number {
  if (sortedIndices.length === 0) return 0;
  if (sortedIndices.length <= 8) {
    let count = 0;
    for (let i = 0; i < sortedIndices.length; i++) {
      if (sortedIndices[i] < target) count++;
      else break;
    }
    return count;
  }
  let lo = 0;
  let hi = sortedIndices.length;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (sortedIndices[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

export function useDynamicRowHeights<T = any>({
  totalRows,
  baseRowHeight,
  dynamicRowHeight,
  hasDynamicDetailRows = false,
  estimatedRowHeight,
  getRowHeightProp,
  getRowItem,
  getRowKey,
  overscanRows,
  isPhoneMode,
  phoneExpandedRows,
  expandedCardExtraHeight,
  dataVersion,
  layoutResetKey = '',
  scrollContainerRef,
  virtualScrollTopRef,
  lastScrollTopRef,
  isWindowScroll,
}: UseDynamicRowHeightsOptions<T>): UseDynamicRowHeightsResult {
  const isDynamicActive = Boolean(dynamicRowHeight || getRowHeightProp || hasDynamicDetailRows);
  const needsResizeObserver = Boolean(
    (dynamicRowHeight && !getRowHeightProp) || hasDynamicDetailRows
  );
  const resolvedEstimatedHeight = Math.max(
    baseRowHeight,
    Math.round(estimatedRowHeight ?? baseRowHeight)
  );

  // Tối ưu riêng cho chế độ Phone có các thẻ mở rộng mà không cần cấp phát Float64Array
  const expandedIndicesSorted = useMemo(() => {
    if (!isPhoneMode || phoneExpandedRows.size === 0) return EMPTY_NUMBERS;
    return Array.from(phoneExpandedRows.values())
      .filter((idx) => idx >= 0 && idx < totalRows)
      .sort((a, b) => a - b);
  }, [isPhoneMode, phoneExpandedRows, totalRows]);

  const expandedIdxSet = useMemo(() => {
    if (expandedIndicesSorted.length === 0) return EMPTY_SET;
    return new Set(expandedIndicesSorted);
  }, [expandedIndicesSorted]);

  const heightsRef = useRef<Float32Array>(new Float32Array(0));
  const offsetsRef = useRef<Float64Array>(new Float64Array(1));
  const measuredCacheRef = useRef<Map<string | number, number>>(new Map());
  const prevLayoutResetKeyRef = useRef<string>(layoutResetKey);

  // Quản lý phần tử DOM đang mount để ResizeObserver dùng chung 1 observer duy nhất
  const slotElementsRef = useRef<Map<HTMLElement, SlotMeta>>(new Map());
  const pendingMeasureRef = useRef<Map<string | number, { rowIndex: number; height: number }>>(
    new Map()
  );
  const flushRafRef = useRef<number | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const [measureVersion, setMeasureVersion] = useState(0);

  // Ref giữ trạng thái mới nhất cho rAF flush callback
  const latestStateRef = useRef({
    totalRows,
    baseRowHeight,
    isDynamicActive,
    dynamicRowHeight: Boolean(dynamicRowHeight),
    hasDynamicDetailRows: Boolean(hasDynamicDetailRows),
    hasGetRowHeightProp: Boolean(getRowHeightProp),
    getRowItem,
    isWindowScroll,
    scrollContainerRef,
    virtualScrollTopRef,
    lastScrollTopRef,
    expandedIdxSet,
    expandedCardExtraHeight,
  });
  latestStateRef.current = {
    totalRows,
    baseRowHeight,
    isDynamicActive,
    dynamicRowHeight: Boolean(dynamicRowHeight),
    hasDynamicDetailRows: Boolean(hasDynamicDetailRows),
    hasGetRowHeightProp: Boolean(getRowHeightProp),
    getRowItem,
    isWindowScroll,
    scrollContainerRef,
    virtualScrollTopRef,
    lastScrollTopRef,
    expandedIdxSet,
    expandedCardExtraHeight,
  };

  // Xóa cache chiều cao dòng ẩn khi độ rộng cột wrapText hoặc chế độ hiển thị đổi
  if (prevLayoutResetKeyRef.current !== layoutResetKey) {
    prevLayoutResetKeyRef.current = layoutResetKey;
    if (measuredCacheRef.current.size > 0) {
      measuredCacheRef.current.clear();
    }
  }

  // Xây dựng mảng heights & prefix offsets khi bật Dynamic Row Height
  const rebuiltTotalHeight = useMemo(() => {
    if (!isDynamicActive) {
      heightsRef.current = new Float32Array(0);
      offsetsRef.current = new Float64Array(1);
      return totalRows * baseRowHeight + expandedIndicesSorted.length * expandedCardExtraHeight;
    }

    if (totalRows <= 0) {
      heightsRef.current = new Float32Array(0);
      offsetsRef.current = new Float64Array(1);
      offsetsRef.current[0] = 0;
      return 0;
    }

    const heights =
      heightsRef.current.length === totalRows ? heightsRef.current : new Float32Array(totalRows);
    const offsets =
      offsetsRef.current.length === totalRows + 1
        ? offsetsRef.current
        : new Float64Array(totalRows + 1);
    heightsRef.current = heights;
    offsetsRef.current = offsets;

    const cache = measuredCacheRef.current;
    offsets[0] = 0;

    // Fast-path O(N) thuần số học khi chưa có phép đo và không dùng callback ngoài
    if (
      !getRowHeightProp &&
      !hasDynamicDetailRows &&
      cache.size === 0 &&
      resolvedEstimatedHeight === baseRowHeight &&
      expandedIdxSet.size === 0
    ) {
      heights.fill(baseRowHeight);
      for (let i = 0; i < totalRows; i++) {
        offsets[i + 1] = offsets[i] + baseRowHeight;
      }
      return offsets[totalRows];
    }

    for (let i = 0; i < totalRows; i++) {
      const row = getRowItem(i);
      const rowAny = row as any;
      let h = dynamicRowHeight ? resolvedEstimatedHeight : baseRowHeight;

      if (rowAny && rowAny._isGroupRow) {
        h = baseRowHeight;
      } else if (rowAny && rowAny._isDetailRow) {
        const fixedH = rowAny._detailFixedHeight;
        if (typeof fixedH === 'number' && Number.isFinite(fixedH)) {
          h = Math.max(28, Math.round(fixedH));
        } else {
          const estDetailH =
            typeof rowAny._detailEstimatedHeight === 'number' &&
            Number.isFinite(rowAny._detailEstimatedHeight)
              ? Math.max(28, Math.round(rowAny._detailEstimatedHeight))
              : Math.max(baseRowHeight, 120);
          const key = getRowKey(row, i);
          const cached = cache.get(key);
          h = cached !== undefined ? cached : estDetailH;
        }
      } else if (getRowHeightProp) {
        h = Math.max(baseRowHeight, Math.round(getRowHeightProp(row, i)));
      } else if (dynamicRowHeight && row) {
        const key = getRowKey(row, i);
        const cached = cache.get(key);
        if (cached !== undefined) {
          h = cached;
        }
      }

      if (expandedIdxSet.size > 0 && expandedIdxSet.has(i)) {
        h += expandedCardExtraHeight;
      }

      heights[i] = h;
      offsets[i + 1] = offsets[i] + h;
    }

    return offsets[totalRows];
  }, [
    isDynamicActive,
    dynamicRowHeight,
    hasDynamicDetailRows,
    totalRows,
    baseRowHeight,
    resolvedEstimatedHeight,
    getRowHeightProp,
    getRowItem,
    getRowKey,
    expandedIndicesSorted,
    expandedIdxSet,
    expandedCardExtraHeight,
    dataVersion,
    layoutResetKey,
  ]);

  const flushMeasurements = useCallback(() => {
    flushRafRef.current = null;
    const pending = pendingMeasureRef.current;
    if (pending.size === 0) return;

    const st = latestStateRef.current;
    if (!st.isDynamicActive || st.totalRows <= 0) {
      pending.clear();
      return;
    }

    const heights = heightsRef.current;
    const offsets = offsetsRef.current;
    if (heights.length !== st.totalRows || offsets.length !== st.totalRows + 1) {
      pending.clear();
      return;
    }

    // Lưu neo cuộn trước khi cộng bù để tránh giật thanh cuộn khi dòng phía trên viewport đổi chiều cao
    const scrollEl = st.scrollContainerRef.current;
    const currentScrollTop = st.isWindowScroll
      ? st.virtualScrollTopRef.current
      : scrollEl
      ? scrollEl.scrollTop
      : st.lastScrollTopRef.current;

    const anchorIdx =
      currentScrollTop > 0 ? binarySearchOffsets(offsets, st.totalRows, currentScrollTop) : 0;
    const anchorOffsetInside =
      currentScrollTop > 0 ? Math.max(0, currentScrollTop - offsets[anchorIdx]) : 0;

    let minChangedIdx = st.totalRows;
    const cache = measuredCacheRef.current;

    pending.forEach(({ rowIndex, height }, rowKey) => {
      if (rowIndex < 0 || rowIndex >= st.totalRows) return;
      const row = st.getRowItem(rowIndex) as any;
      const minH = row?._isDetailRow ? 28 : st.baseRowHeight;
      const targetHeight = Math.max(minH, Math.round(height));
      const extraPhone = st.expandedIdxSet.has(rowIndex) ? st.expandedCardExtraHeight : 0;
      const finalHeight = targetHeight + extraPhone;
      const prevHeight = heights[rowIndex];

      // Lưu cache chiều cao cơ bản (không gồm phần phoneExpanded nếu có)
      cache.set(rowKey, targetHeight);

      if (Math.abs(finalHeight - prevHeight) >= 1) {
        heights[rowIndex] = finalHeight;
        if (rowIndex < minChangedIdx) {
          minChangedIdx = rowIndex;
        }
      }
    });

    pending.clear();

    if (minChangedIdx >= st.totalRows) return;

    for (let i = minChangedIdx; i < st.totalRows; i++) {
      offsets[i + 1] = offsets[i] + heights[i];
    }

    if (currentScrollTop > 0 && anchorIdx > 0) {
      const nextScrollTop = offsets[anchorIdx] + anchorOffsetInside;
      const delta = nextScrollTop - currentScrollTop;
      if (Math.abs(delta) >= 1) {
        if (st.isWindowScroll) {
          if (typeof window !== 'undefined') {
            window.scrollBy(0, delta);
          }
          st.virtualScrollTopRef.current = Math.max(0, st.virtualScrollTopRef.current + delta);
          st.lastScrollTopRef.current = Math.max(0, st.lastScrollTopRef.current + delta);
        } else if (scrollEl) {
          const nextTop = Math.max(0, scrollEl.scrollTop + delta);
          scrollEl.scrollTop = nextTop;
          st.virtualScrollTopRef.current = nextTop;
          st.lastScrollTopRef.current = nextTop;
        }
      }
    }

    setMeasureVersion((v) => v + 1);
  }, []);

  const scheduleFlush = useCallback(() => {
    if (flushRafRef.current !== null || typeof window === 'undefined') return;
    flushRafRef.current = window.requestAnimationFrame(flushMeasurements);
  }, [flushMeasurements]);

  // Đọc kích thước thực từ DOM element (chủ yếu theo phần tử con GridRow hoặc chính slot)
  const measureElementNow = useCallback(
    (el: HTMLElement, meta: SlotMeta) => {
      if (meta.rowIndex < 0 || meta.rowIndex >= latestStateRef.current.totalRows) return;
      const firstChild = el.firstElementChild as HTMLElement | null;
      if (
        firstChild?.getAttribute('data-agv-group-row') === 'true' ||
        firstChild?.classList.contains('agv-group-row')
      ) {
        return;
      }
      const isDetailEl = firstChild?.getAttribute('data-agv-detail-row') === 'true';
      if (isDetailEl) {
        if (firstChild?.getAttribute('data-agv-detail-fixed') === 'true') {
          return;
        }
      } else if (
        !latestStateRef.current.dynamicRowHeight ||
        latestStateRef.current.hasGetRowHeightProp
      ) {
        return;
      }
      const rawH = firstChild
        ? firstChild.offsetHeight || Math.round(firstChild.getBoundingClientRect().height)
        : el.offsetHeight || Math.round(el.getBoundingClientRect().height);
      if (rawH > 0) {
        pendingMeasureRef.current.set(meta.rowKey, {
          rowIndex: meta.rowIndex,
          height: rawH,
        });
        scheduleFlush();
      }
    },
    [scheduleFlush]
  );

  // Khởi tạo duy nhất 1 ResizeObserver cho toàn bảng khi bật dynamicRowHeight hoặc dynamic detail rows
  useEffect(() => {
    if (!needsResizeObserver || typeof ResizeObserver === 'undefined') {
      resizeObserverRef.current?.disconnect();
      resizeObserverRef.current = null;
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const slotMap = slotElementsRef.current;
      let queued = false;
      for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
        const target = entry.target as HTMLElement;
        const meta = slotMap.get(target);
        if (!meta) continue;
        if (meta.rowIndex < 0 || meta.rowIndex >= latestStateRef.current.totalRows) continue;

        const firstChild = target.firstElementChild as HTMLElement | null;
        if (
          firstChild?.getAttribute('data-agv-group-row') === 'true' ||
          firstChild?.classList.contains('agv-group-row')
        ) {
          continue;
        }
        const isDetailEl = firstChild?.getAttribute('data-agv-detail-row') === 'true';
        if (isDetailEl) {
          if (firstChild?.getAttribute('data-agv-detail-fixed') === 'true') {
            continue;
          }
        } else if (
          !latestStateRef.current.dynamicRowHeight ||
          latestStateRef.current.hasGetRowHeightProp
        ) {
          continue;
        }

        const borderBoxH =
          entry.borderBoxSize && entry.borderBoxSize.length > 0
            ? Math.round(entry.borderBoxSize[0].blockSize)
            : target.offsetHeight || Math.round(entry.contentRect.height);

        const nextH =
          firstChild && firstChild.offsetHeight > 0 ? firstChild.offsetHeight : borderBoxH;
        if (nextH > 0) {
          pendingMeasureRef.current.set(meta.rowKey, {
            rowIndex: meta.rowIndex,
            height: nextH,
          });
          queued = true;
        }
      }
      if (queued) {
        scheduleFlush();
      }
    });

    resizeObserverRef.current = observer;
    slotElementsRef.current.forEach((_, el) => {
      observer.observe(el);
    });

    return () => {
      observer.disconnect();
      if (resizeObserverRef.current === observer) {
        resizeObserverRef.current = null;
      }
    };
  }, [needsResizeObserver, scheduleFlush]);

  // Sau khi layoutResetKey đổi, đo lại các dòng đang mount ngay trong frame kế tiếp
  useLayoutEffect(() => {
    if (!needsResizeObserver) return;
    if (slotElementsRef.current.size === 0) return;
    slotElementsRef.current.forEach((meta, el) => {
      measureElementNow(el, meta);
    });
  }, [needsResizeObserver, layoutResetKey, dataVersion, measureElementNow]);

  useEffect(() => {
    return () => {
      if (flushRafRef.current !== null && typeof window !== 'undefined') {
        window.cancelAnimationFrame(flushRafRef.current);
        flushRafRef.current = null;
      }
      resizeObserverRef.current?.disconnect();
    };
  }, []);

  const observeRowSlot = useCallback(
    (el: HTMLElement, rowKey: string | number, rowIndex: number) => {
      if (!needsResizeObserver) return;
      const slotMap = slotElementsRef.current;
      const observer = resizeObserverRef.current;
      const existing = slotMap.get(el);
      const nextMeta: SlotMeta = { rowKey, rowIndex };
      slotMap.set(el, nextMeta);

      if (!existing) {
        observer?.observe(el);
        measureElementNow(el, nextMeta);
      } else if (existing.rowKey !== rowKey || existing.rowIndex !== rowIndex) {
        measureElementNow(el, nextMeta);
      }
    },
    [needsResizeObserver, measureElementNow]
  );

  const unobserveRowSlot = useCallback((el: HTMLElement) => {
    slotElementsRef.current.delete(el);
    resizeObserverRef.current?.unobserve(el);
  }, []);

  const totalContentHeight = useMemo(() => {
    if (!isDynamicActive) return rebuiltTotalHeight;
    if (totalRows <= 0) return 0;
    const offsets = offsetsRef.current;
    return offsets.length === totalRows + 1 ? offsets[totalRows] : rebuiltTotalHeight;
  }, [isDynamicActive, totalRows, rebuiltTotalHeight, measureVersion]);

  const getRowTop = useCallback(
    (rowIndex: number): number => {
      if (totalRows <= 0) return 0;
      const clampedIdx = Math.max(0, Math.min(totalRows, rowIndex));
      if (isDynamicActive) {
        const offsets = offsetsRef.current;
        if (offsets.length === totalRows + 1) {
          return offsets[clampedIdx];
        }
      }
      if (expandedIndicesSorted.length === 0) {
        return clampedIdx * baseRowHeight;
      }
      const beforeCount = countSortedLessThan(expandedIndicesSorted, clampedIdx);
      return clampedIdx * baseRowHeight + beforeCount * expandedCardExtraHeight;
    },
    [
      totalRows,
      isDynamicActive,
      expandedIndicesSorted,
      baseRowHeight,
      expandedCardExtraHeight,
      measureVersion,
    ]
  );

  const getRowHeight = useCallback(
    (rowIndex: number): number => {
      if (totalRows <= 0 || rowIndex < 0 || rowIndex >= totalRows) return baseRowHeight;
      if (isDynamicActive) {
        const heights = heightsRef.current;
        if (heights.length === totalRows) {
          return heights[rowIndex];
        }
      }
      if (expandedIdxSet.has(rowIndex)) {
        return baseRowHeight + expandedCardExtraHeight;
      }
      return baseRowHeight;
    },
    [totalRows, baseRowHeight, isDynamicActive, expandedIdxSet, expandedCardExtraHeight, measureVersion]
  );

  const findRowIndexAtOffset = useCallback(
    (offsetY: number): number => {
      if (totalRows <= 0) return 0;
      if (offsetY <= 0) return 0;
      if (isDynamicActive) {
        const offsets = offsetsRef.current;
        if (offsets.length === totalRows + 1) {
          return binarySearchOffsets(offsets, totalRows, offsetY);
        }
      }
      if (expandedIndicesSorted.length === 0) {
        return Math.min(totalRows - 1, Math.max(0, Math.floor(offsetY / baseRowHeight)));
      }
      // Binary search trên Phone mode có thẻ mở rộng
      let lo = 0;
      let hi = totalRows - 1;
      while (lo <= hi) {
        const mid = (lo + hi) >>> 1;
        const top = mid * baseRowHeight + countSortedLessThan(expandedIndicesSorted, mid) * expandedCardExtraHeight;
        const h = baseRowHeight + (expandedIdxSet.has(mid) ? expandedCardExtraHeight : 0);
        if (offsetY < top) {
          hi = mid - 1;
        } else if (offsetY >= top + h) {
          lo = mid + 1;
        } else {
          return mid;
        }
      }
      return Math.max(0, Math.min(totalRows - 1, lo));
    },
    [
      totalRows,
      isDynamicActive,
      expandedIndicesSorted,
      expandedIdxSet,
      baseRowHeight,
      expandedCardExtraHeight,
      measureVersion,
    ]
  );

  const getVisibleRowRange = useCallback(
    (scrollTop: number, viewportHeight: number): RowWindowRange => {
      if (totalRows <= 0) return { start: 0, end: -1 };
      const safeH = Math.max(baseRowHeight, viewportHeight || 600);
      const maxTop = Math.max(0, totalContentHeight - safeH);
      const clampedTop = Math.max(0, Math.min(scrollTop, maxTop));
      const firstVisible = findRowIndexAtOffset(clampedTop);
      const lastVisible = findRowIndexAtOffset(clampedTop + safeH - 1);
      const start = Math.max(0, firstVisible - overscanRows);
      const end = Math.min(totalRows - 1, Math.max(start, lastVisible + overscanRows));
      return { start, end };
    },
    [totalRows, baseRowHeight, totalContentHeight, findRowIndexAtOffset, overscanRows]
  );

  return {
    isDynamicActive,
    totalContentHeight,
    measureVersion,
    getRowTop,
    getRowHeight,
    findRowIndexAtOffset,
    getVisibleRowRange,
    observeRowSlot,
    unobserveRowSlot,
  };
}
