import React, { useRef, useCallback } from 'react';
import { ColumnDef, DATA_TYPES } from '../types';

type ResizeEngineMod = typeof import('./columnResizeEngine');
let _resizeEngine: ResizeEngineMod | null = null;
let _resizeEnginePromise: Promise<ResizeEngineMod> | null = null;

export function preloadColumnResizeEngine(): void {
  if (_resizeEngine || _resizeEnginePromise) return;
  _resizeEnginePromise = import('./columnResizeEngine').then((m) => {
    _resizeEngine = m;
    return m;
  });
}

interface UseColumnResizeParams<T> {
  colMap: Record<string, ColumnDef<T>>;
  colWidths: Record<string, number>;
  setColWidth: (key: string, width: number) => void;
}

export function useColumnResize<T>({
  colMap,
  colWidths,
  setColWidth,
}: UseColumnResizeParams<T>) {
  const resizingRef = useRef<{ key: string; startX: number; startWidth: number } | null>(null);
  const colWidthsRef = useRef(colWidths);
  colWidthsRef.current = colWidths;

  const handleMouseDownResize = useCallback(
    (key: string, e: React.MouseEvent) => {
      const colDef = colMap[key];
      if (
        !colDef ||
        colDef.resizable === false ||
        colDef.dataType === DATA_TYPES.SYSTEM ||
        colDef.isRowNumber ||
        colDef.isSelection
      ) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();

      if (_resizeEngine) {
        _resizeEngine.startColumnResizeSession({
          key,
          event: e,
          colMap,
          colWidthsRef,
          setColWidth,
          resizingRef,
        });
        return;
      }

      const clientX = e.clientX;
      const currentTarget = e.currentTarget as HTMLElement | null;
      const syntheticEvt = { clientX, currentTarget } as unknown as React.MouseEvent;
      if (!_resizeEnginePromise) {
        _resizeEnginePromise = import('./columnResizeEngine').then((m) => {
          _resizeEngine = m;
          return m;
        });
      }
      void _resizeEnginePromise.then((m) => {
        m.startColumnResizeSession({
          key,
          event: syntheticEvt,
          colMap,
          colWidthsRef,
          setColWidth,
          resizingRef,
        });
      });
    },
    [setColWidth, colMap]
  );

  return {
    handleMouseDownResize,
    resizingRef,
  };
}
