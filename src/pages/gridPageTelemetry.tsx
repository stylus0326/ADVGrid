import React, { useLayoutEffect, useState } from 'react';

export interface ResourceTelemetrySnapshot {
  jsDecodedKb: number;
  jsFileCount: number;
  heapUsedMb: number | null;
  heapTotalMb: number | null;
}

export function captureRuntimeTelemetry(): ResourceTelemetrySnapshot {
  let jsDecodedKb = 0;
  let jsFileCount = 0;

  if (typeof performance !== 'undefined' && typeof performance.getEntriesByType === 'function') {
    const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    const seen = new Set<string>();
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      if (seen.has(entry.name)) continue;
      if (
        entry.name.includes('/@vite/client') ||
        entry.name.includes('/@react-refresh') ||
        (entry.name.includes('?v=') && entry.name.includes('vite'))
      ) {
        continue;
      }
      const isJsEntry =
        entry.initiatorType === 'script' || /\.(m?js|tsx?)(\?|$)/.test(entry.name);
      if (!isJsEntry) continue;
      seen.add(entry.name);
      jsFileCount++;
      const bytes =
        entry.decodedBodySize > 0
          ? entry.decodedBodySize
          : entry.transferSize > 0
            ? entry.transferSize
            : entry.encodedBodySize;
      jsDecodedKb += bytes / 1024;
    }
  }

  let heapUsedMb: number | null = null;
  let heapTotalMb: number | null = null;
  const perfMemory = (
    performance as unknown as {
      memory?: { usedJSHeapSize?: number; totalJSHeapSize?: number };
    }
  ).memory;
  if (perfMemory && typeof perfMemory.usedJSHeapSize === 'number') {
    heapUsedMb = Math.round((perfMemory.usedJSHeapSize / (1024 * 1024)) * 100) / 100;
  }
  if (perfMemory && typeof perfMemory.totalJSHeapSize === 'number') {
    heapTotalMb = Math.round((perfMemory.totalJSHeapSize / (1024 * 1024)) * 100) / 100;
  }

  return {
    jsDecodedKb: Math.round(jsDecodedKb * 10) / 10,
    jsFileCount,
    heapUsedMb,
    heapTotalMb,
  };
}

export function countGridDomNodes(hostEl: HTMLElement | null): number {
  if (!hostEl) return 0;
  const gridRoot = hostEl.classList.contains('agv-grid-root')
    ? hostEl
    : hostEl.querySelector<HTMLElement>('.agv-grid-root');
  if (gridRoot) {
    return 1 + gridRoot.querySelectorAll('*').length;
  }
  return hostEl.querySelectorAll('*').length;
}

export interface GridStageTelemetryState {
  renderMs: number | null;
  domNodes: number;
  jsPayloadKb: number | null;
  jsFileCount: number;
  heapUsedMb: number | null;
  heapTotalMb: number | null;
}

export function useGridStageTelemetry(
  stageRef: React.RefObject<HTMLElement | null>,
  renderStartRef: React.MutableRefObject<number>,
  deps: readonly unknown[],
  loading: boolean
): GridStageTelemetryState {
  const [renderMs, setRenderMs] = useState<number | null>(null);
  const [domNodes, setDomNodes] = useState<number>(0);
  const [jsPayloadKb, setJsPayloadKb] = useState<number | null>(null);
  const [jsFileCount, setJsFileCount] = useState<number>(0);
  const [heapUsedMb, setHeapUsedMb] = useState<number | null>(null);
  const [heapTotalMb, setHeapTotalMb] = useState<number | null>(null);

  useLayoutEffect(() => {
    if (loading) return;

    const rafId = window.requestAnimationFrame(() => {
      const elapsed = Math.round((performance.now() - renderStartRef.current) * 10) / 10;
      const snap = captureRuntimeTelemetry();
      setRenderMs(elapsed);
      setDomNodes(countGridDomNodes(stageRef.current));
      setJsPayloadKb(snap.jsDecodedKb);
      setJsFileCount(snap.jsFileCount);
      setHeapUsedMb(snap.heapUsedMb);
      setHeapTotalMb(snap.heapTotalMb);
    });

    // Cập nhật lại DOM và JS payload sau khi các lazy chunk con (như StatusBar, FilterRow) hoàn tất mount
    const settleTimerId = window.setTimeout(() => {
      const snap = captureRuntimeTelemetry();
      setDomNodes(countGridDomNodes(stageRef.current));
      setJsPayloadKb(snap.jsDecodedKb);
      setJsFileCount(snap.jsFileCount);
      setHeapUsedMb(snap.heapUsedMb);
      setHeapTotalMb(snap.heapTotalMb);
    }, 120);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(settleTimerId);
    };
  }, [loading, ...deps]);

  return {
    renderMs,
    domNodes,
    jsPayloadKb,
    jsFileCount,
    heapUsedMb,
    heapTotalMb,
  };
}

export interface GridTelemetryLineProps extends GridStageTelemetryState {
  apiLoadMs: number | null;
}

export const GridTelemetryLine: React.FC<GridTelemetryLineProps> = ({
  apiLoadMs,
  renderMs,
  jsPayloadKb,
  jsFileCount,
  heapUsedMb,
  heapTotalMb,
  domNodes,
}) => {
  return (
    <div
      data-testid="grid-telemetry"
      className="text-xs text-muted-foreground tabular-nums"
    >
      Đo thực tế | Tải API: {apiLoadMs !== null ? `${apiLoadMs}ms` : '...'} | Render bảng:{' '}
      {renderMs !== null ? `${renderMs.toFixed(1)}ms` : '...'} | JS đã nạp:{' '}
      {jsPayloadKb !== null
        ? `${jsPayloadKb.toLocaleString('vi-VN')} kB (${jsFileCount} files)`
        : '...'}{' '}
      | RAM JS Heap:{' '}
      {heapUsedMb !== null
        ? `${heapUsedMb.toFixed(2)} / ${heapTotalMb !== null ? heapTotalMb.toFixed(2) : '?'} MB`
        : 'N/A'}{' '}
      | DOM trong bảng: {domNodes.toLocaleString('vi-VN')} nodes
    </div>
  );
};
