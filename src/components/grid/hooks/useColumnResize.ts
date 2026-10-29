import React, { useRef, useCallback } from 'react';
import { ColumnDef, DATA_TYPES } from '../types';

interface UseColumnResizeParams<T> {
  colMap: Record<string, ColumnDef<T>>;
  colWidths: Record<string, number>;
  setColWidth: (key: string, width: number) => void;
  containerRef?: React.RefObject<HTMLDivElement | null>;
  totalGridWidth?: number;
  leftColumns?: ColumnDef<T>[];
  rightColumns?: ColumnDef<T>[];
  leftOffsets?: Record<string, number>;
  rightOffsets?: Record<string, number>;
}

export function useColumnResize<T>({
  colMap,
  colWidths,
  setColWidth,
  containerRef,
  totalGridWidth = 0,
  leftColumns,
  rightColumns,
  leftOffsets,
  rightOffsets,
}: UseColumnResizeParams<T>) {
  const resizingRef = useRef<{
    key: string;
    startX: number;
    startWidth: number;
    currentWidth: number;
    startTotalWidth: number;
  } | null>(null);

  const colWidthsRef = useRef(colWidths);
  colWidthsRef.current = colWidths;

  const totalGridWidthRef = useRef(totalGridWidth);
  totalGridWidthRef.current = totalGridWidth;

  const leftColumnsRef = useRef(leftColumns);
  leftColumnsRef.current = leftColumns;

  const rightColumnsRef = useRef(rightColumns);
  rightColumnsRef.current = rightColumns;

  const leftOffsetsRef = useRef(leftOffsets);
  leftOffsetsRef.current = leftOffsets;

  const rightOffsetsRef = useRef(rightOffsets);
  rightOffsetsRef.current = rightOffsets;

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

      const startWidth = colWidthsRef.current[key] || colDef.defaultWidth || 100;
      const startTotalGridWidth = totalGridWidthRef.current;

      resizingRef.current = {
        key,
        startX: e.clientX,
        startWidth,
        currentWidth: startWidth,
        startTotalWidth: startTotalGridWidth,
      };

      // Khóa cursor: col-resize, user-select: none trên body và gắn class agv-resizing-column
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      (document.body.style as any).webkitUserSelect = 'none';
      document.body.classList.add('agv-resizing-column');

      let rafId: number | null = null;
      let latestClientX = e.clientX;

      const applyResize = () => {
        rafId = null;
        if (!resizingRef.current || !containerRef?.current) return;
        const delta = latestClientX - resizingRef.current.startX;
        const targetColDef = colMap[resizingRef.current.key];
        const minW = targetColDef?.minWidth || 50;
        const maxW = targetColDef?.maxWidth || 1200;
        const newWidth = Math.min(maxW, Math.max(minW, Math.round(resizingRef.current.startWidth + delta)));

        resizingRef.current.currentWidth = newWidth;
        const widthDiff = newWidth - resizingRef.current.startWidth;

        // Cập nhật trực tiếp biến CSS độ rộng cột trên DOM (Zero React render trong lúc di chuột)
        containerRef.current.style.setProperty(`--agv-col-w-${resizingRef.current.key}`, `${newWidth}px`);

        // Cập nhật biến CSS tổng độ rộng bảng trên DOM
        const newTotalWidth = resizingRef.current.startTotalWidth + widthDiff;
        containerRef.current.style.setProperty('--agv-total-grid-w', `${newTotalWidth}px`);

        // Cập nhật offset các cột ghim bị ảnh hưởng
        if (leftColumnsRef.current && leftOffsetsRef.current) {
          const leftCols = leftColumnsRef.current;
          const colIdx = leftCols.findIndex((c) => c.key === resizingRef.current!.key);
          if (colIdx !== -1) {
            for (let i = colIdx + 1; i < leftCols.length; i++) {
              const nextCol = leftCols[i];
              const baseOffset = leftOffsetsRef.current[nextCol.key] || 0;
              containerRef.current.style.setProperty(
                `--agv-left-offset-${nextCol.key}`,
                `${baseOffset + widthDiff}px`
              );
            }
          }
        }

        if (rightColumnsRef.current && rightOffsetsRef.current) {
          const rightCols = rightColumnsRef.current;
          const colIdx = rightCols.findIndex((c) => c.key === resizingRef.current!.key);
          if (colIdx !== -1) {
            for (let i = 0; i < colIdx; i++) {
              const prevCol = rightCols[i];
              const baseOffset = rightOffsetsRef.current[prevCol.key] || 0;
              containerRef.current.style.setProperty(
                `--agv-right-offset-${prevCol.key}`,
                `${baseOffset + widthDiff}px`
              );
            }
          }
        }
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

        // Khôi phục cursor & user-select trên body
        document.body.style.removeProperty('cursor');
        document.body.style.removeProperty('user-select');
        (document.body.style as any).removeProperty('-webkit-user-select');
        document.body.classList.remove('agv-resizing-column');

        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);

        if (resizingRef.current) {
          const { key, startWidth, currentWidth } = resizingRef.current;
          resizingRef.current = null;
          // Chỉ khi nhả chuột (mouseup), hệ thống mới gọi setColWidth đúng 1 lần duy nhất để đồng bộ vào React state và lưu localStorage
          if (currentWidth !== startWidth) {
            setColWidth(key, currentWidth);
          }
        }
      };

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    },
    [setColWidth, colMap, containerRef]
  );

  return {
    handleMouseDownResize,
    resizingRef,
  };
}
