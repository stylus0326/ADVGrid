import { useState, useEffect, useCallback, useRef } from 'react';
import { DEFAULT_PAGE_SIZE } from '../components/grid/constants';
import { NormalizedPage } from '../services/b2bApi';

interface CachedPageEntry<TItem> {
  items: TItem[];
  total: number;
  ts: number;
}

const MAX_CACHE_ENTRIES = 60;
const CACHE_TTL_MS = 5 * 60 * 1000;

// Bộ đệm LRU cấp module tách riêng theo từng hàm fetcher để quay lại trang đã tải trong 0ms
const pageCacheStore = new WeakMap<Function, Map<string, CachedPageEntry<any>>>();

function serializeStableValue(val: unknown): string {
  if (val === null || val === undefined) return String(val);
  if (typeof val !== 'object') return JSON.stringify(val);
  if (Array.isArray(val)) {
    return `[${val.map(serializeStableValue).join(',')}]`;
  }
  const obj = val as Record<string, unknown>;
  const keys = Object.keys(obj).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${serializeStableValue(obj[k])}`).join(',')}}`;
}

function buildCacheKey(filters: unknown, page: number, pageSize: number): string {
  return `${page}|${pageSize}|${serializeStableValue(filters)}`;
}

function getFetcherCacheMap(fetcher: Function): Map<string, CachedPageEntry<any>> {
  let map = pageCacheStore.get(fetcher);
  if (!map) {
    map = new Map();
    pageCacheStore.set(fetcher, map);
  }
  return map;
}

function getCachedEntry<TItem>(
  fetcher: Function,
  key: string
): CachedPageEntry<TItem> | null {
  const map = pageCacheStore.get(fetcher);
  if (!map) return null;
  const entry = map.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > CACHE_TTL_MS) {
    map.delete(key);
    return null;
  }
  // Đưa entry lên cuối Map để duy trì thứ tự LRU
  map.delete(key);
  map.set(key, entry);
  return entry as CachedPageEntry<TItem>;
}

function setCachedEntry<TItem>(
  fetcher: Function,
  key: string,
  entry: CachedPageEntry<TItem>
): void {
  const map = getFetcherCacheMap(fetcher);
  if (map.has(key)) {
    map.delete(key);
  } else if (map.size >= MAX_CACHE_ENTRIES) {
    const oldestKey = map.keys().next().value;
    if (oldestKey !== undefined) {
      map.delete(oldestKey);
    }
  }
  map.set(key, entry);
}

/**
 * Hook dùng chung quản lý phân trang server-side cho các trang danh mục B2B-PNT.
 * Hỗ trợ LRU Page Cache (0ms khi quay lại trang đã tải) và keepPreviousData (giữ DOM cũ khi chờ trang mới).
 */
export function usePagedListQuery<TItem, TFilters>(
  appliedFilters: TFilters,
  fetcher: (
    filters: TFilters & { page: number; pageSize: number },
    signal: AbortSignal
  ) => Promise<NormalizedPage<TItem>>,
  fallbackErrorMessage: string
) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [reloadTick, setReloadTick] = useState(0);

  const prevFiltersRef = useRef(appliedFilters);
  const filtersChanged = prevFiltersRef.current !== appliedFilters;
  if (filtersChanged) {
    prevFiltersRef.current = appliedFilters;
    if (page !== 1) {
      setPage(1);
    }
  }
  const effectivePage = filtersChanged ? 1 : page;
  const cacheKey = buildCacheKey(appliedFilters, effectivePage, pageSize);

  const [rows, setRows] = useState<TItem[]>(() => {
    const hit = getCachedEntry<TItem>(fetcher, cacheKey);
    return hit ? hit.items : [];
  });
  const [serverTotal, setServerTotal] = useState<number>(() => {
    const hit = getCachedEntry<TItem>(fetcher, cacheKey);
    return hit ? hit.total : 0;
  });
  const [loading, setLoading] = useState<boolean>(() => !getCachedEntry(fetcher, cacheKey));
  const [error, setError] = useState<string | null>(null);
  const [apiLoadMs, setApiLoadMs] = useState<number | null>(() =>
    getCachedEntry(fetcher, cacheKey) ? 0 : null
  );
  const renderStartRef = useRef<number>(performance.now());
  const rowsRef = useRef<TItem[]>(rows);
  rowsRef.current = rows;

  useEffect(() => {
    const hit = getCachedEntry<TItem>(fetcher, cacheKey);
    if (hit) {
      if (rowsRef.current !== hit.items) {
        renderStartRef.current = performance.now();
      }
      setApiLoadMs(0);
      setRows(hit.items);
      setServerTotal(hit.total);
      setError(null);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const t0 = performance.now();
    setLoading(true);
    setError(null);

    fetcher({ ...appliedFilters, page: effectivePage, pageSize }, controller.signal)
      .then((res) => {
        if (controller.signal.aborted) return;
        const elapsed = Math.round(performance.now() - t0);
        renderStartRef.current = performance.now();
        setApiLoadMs(elapsed);
        setCachedEntry(fetcher, cacheKey, {
          items: res.items,
          total: res.total,
          ts: Date.now(),
        });
        setRows(res.items);
        setServerTotal(res.total);
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : fallbackErrorMessage);
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [appliedFilters, effectivePage, pageSize, reloadTick, cacheKey, fetcher, fallbackErrorMessage]);

  const handlePageSizeChange = useCallback((nextSize: number) => {
    setPageSize(nextSize);
    setPage(1);
  }, []);

  const refresh = useCallback(() => {
    pageCacheStore.get(fetcher)?.clear();
    setReloadTick((v) => v + 1);
  }, [fetcher]);

  return {
    page: effectivePage,
    setPage,
    pageSize,
    handlePageSizeChange,
    rows,
    serverTotal,
    loading,
    error,
    refresh,
    apiLoadMs,
    renderStartRef,
  };
}
