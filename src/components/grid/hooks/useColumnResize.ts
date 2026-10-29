import React, { useRef, useCallback } from 'react';
import { ColumnDef, DATA_TYPES } from '../types';

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
      resizingRef.current = {
        key,
        startX: e.clientX,
        startWidth: colWidths[key] || 100,
      };

      let rafId: number | null = null;
      let latestClientX = e.clientX;

      const applyResize = () => {
        rafId = null;
        if (!resizingRef.current) return;
        const delta = latestClientX - resizingRef.current.startX;
        const targetColDef = colMap[resizingRef.current.key];
        const minW = targetColDef?.minWidth || 50;
        const maxW = targetColDef?.maxWidth || 1200;
        const newWidth = Math.min(maxW, Math.max(minW, resizingRef.current.startWidth + delta));
        setColWidth(resizingRef.current.key, newWidth);
      };

      const handleMouseMove = (moveEvent: MouseEvent) => {
        if (!resizingRef.current) return;
        latestClientX = moveEvent.clientX;
        if (rafId === null) {
          rafId = window.requestAnimationFrame(applyResize);
        }
      };

      const handleMouseUp = () => {
        if (rafId !== null) {
          window.cancelAnimationFrame(rafId);
          rafId = null;
        }
        resizingRef.current = null;
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    },
    [colWidths, setColWidth, colMap]
  );

  return {
    handleMouseDownResize,
    resizingRef,
  };
}
