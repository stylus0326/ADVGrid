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
      const initialWidth =
        colWidthsRef.current[key] || colDef.defaultWidth || 100;
      resizingRef.current = {
        key,
        startX: e.clientX,
        startWidth: initialWidth,
      };

      const prevBodyCursor = document.body.style.cursor;
      const prevBodyUserSelect = document.body.style.userSelect;
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      document.documentElement.setAttribute('data-agv-resizing', 'true');

      const handleEl = e.currentTarget as HTMLElement | null;
      handleEl?.setAttribute('data-resizing-active', 'true');
      const viewportEl = handleEl?.closest<HTMLElement>('.agv-scroll-viewport') || null;

      type CellItem = { el: HTMLElement; hasMin: boolean; hasMax: boolean };
      type SpanCellItem = { el: HTMLElement; startWidth: number };
      type StickyFollowerItem = { el: HTMLElement; side: 'left' | 'right'; startOffset: number };

      // Pre-cache and partition DOM nodes into Visible Viewport vs Off-Screen Overscan Chunks
      // so mousemove only layouts the ~25 visible rows on screen (skipping 100+ off-screen overscan rows)
      const visibleTargetCells: CellItem[] = [];
      const overscanTargetCells: CellItem[] = [];
      const visibleGroupSpanCells: SpanCellItem[] = [];
      const overscanGroupSpanCells: SpanCellItem[] = [];
      const bandContainers: { el: HTMLElement; origWidthStyle: string }[] = [];
      let startBandWidth = 0;
      const visibleFullWidthContainers: HTMLElement[] = [];
      const overscanFullWidthContainers: HTMLElement[] = [];
      let startTotalWidth = 0;
      const visibleStickyFollowers: StickyFollowerItem[] = [];
      const overscanStickyFollowers: StickyFollowerItem[] = [];

      if (viewportEl) {
        const vpRect = viewportEl.getBoundingClientRect();
        const visibleChunkSet = new Set<HTMLElement>();
        const allChunks = viewportEl.querySelectorAll<HTMLElement>('.agv-chunk-block');
        allChunks.forEach((chunkEl) => {
          const cRect = chunkEl.getBoundingClientRect();
          if (cRect.bottom >= vpRect.top - 64 && cRect.top <= vpRect.bottom + 64) {
            visibleChunkSet.add(chunkEl);
          }
        });

        const isNodeVisible = (el: HTMLElement): boolean => {
          const chunk = el.closest<HTMLElement>('.agv-chunk-block');
          return !chunk || visibleChunkSet.has(chunk);
        };

        const cellNodeList = viewportEl.querySelectorAll<HTMLElement>(
          `[data-col-key="${key}"], [data-tier2-col-key="${key}"]`
        );
        cellNodeList.forEach((el) => {
          const item: CellItem = {
            el,
            hasMin: Boolean(el.style.minWidth),
            hasMax: Boolean(el.style.maxWidth),
          };
          if (isNodeVisible(el)) {
            visibleTargetCells.push(item);
          } else {
            overscanTargetCells.push(item);
          }
        });

        const spanNodeList = viewportEl.querySelectorAll<HTMLElement>('[data-group-span-keys]');
        spanNodeList.forEach((el) => {
          const rawKeys = el.getAttribute('data-group-span-keys') || '';
          if (rawKeys.split(',').includes(key)) {
            const startW = parseFloat(el.style.width) || el.getBoundingClientRect().width;
            const spanItem: SpanCellItem = { el, startWidth: startW };
            if (isNodeVisible(el)) {
              visibleGroupSpanCells.push(spanItem);
            } else {
              overscanGroupSpanCells.push(spanItem);
            }
          }
        });

        const tier2Header = viewportEl.querySelector<HTMLElement>(`[data-tier2-col-key="${key}"]`);
        const bandWrap = tier2Header?.closest<HTMLElement>('[data-band-key]');
        if (bandWrap) {
          startBandWidth = parseFloat(bandWrap.style.width) || bandWrap.getBoundingClientRect().width;
          bandContainers.push({ el: bandWrap, origWidthStyle: bandWrap.style.width });
          for (let i = 0; i < bandWrap.children.length; i++) {
            const child = bandWrap.children[i] as HTMLElement;
            if (child && child.style) {
              bandContainers.push({ el: child, origWidthStyle: child.style.width });
            }
          }
        }

        const fwList = viewportEl.querySelectorAll<HTMLElement>(
          '[data-agv-fullwidth="true"], .agv-rows-canvas, .agv-chunk-block, .agv-grid-row, .agv-group-row'
        );
        fwList.forEach((el) => {
          if (startTotalWidth === 0) {
            startTotalWidth = parseFloat(el.style.width) || el.getBoundingClientRect().width;
          }
          if (isNodeVisible(el)) {
            visibleFullWidthContainers.push(el);
          } else {
            overscanFullWidthContainers.push(el);
          }
        });

        const headerCell = viewportEl.querySelector<HTMLElement>(
          `[data-agv-header-root="true"] [data-col-key="${key}"]`
        );
        if (headerCell && headerCell.style.position === 'sticky') {
          if (headerCell.style.left !== '') {
            const myLeft = parseFloat(headerCell.style.left) || 0;
            const allLeftHeaders = viewportEl.querySelectorAll<HTMLElement>(
              '[data-agv-header-root="true"] [data-col-key]'
            );
            const followerKeys: string[] = [];
            allLeftHeaders.forEach((hEl) => {
              if (hEl.style.position === 'sticky' && hEl.style.left !== '') {
                const hLeft = parseFloat(hEl.style.left) || 0;
                const cKey = hEl.getAttribute('data-col-key');
                if (cKey && cKey !== key && hLeft > myLeft) {
                  followerKeys.push(cKey);
                }
              }
            });
            if (followerKeys.length > 0) {
              const sel = followerKeys.map((k) => `[data-col-key="${k}"]`).join(',');
              viewportEl.querySelectorAll<HTMLElement>(sel).forEach((el) => {
                if (el.style.position === 'sticky' && el.style.left !== '') {
                  const fItem: StickyFollowerItem = {
                    el,
                    side: 'left',
                    startOffset: parseFloat(el.style.left) || 0,
                  };
                  if (isNodeVisible(el)) {
                    visibleStickyFollowers.push(fItem);
                  } else {
                    overscanStickyFollowers.push(fItem);
                  }
                }
              });
            }
          } else if (headerCell.style.right !== '') {
            const myRight = parseFloat(headerCell.style.right) || 0;
            const allRightHeaders = viewportEl.querySelectorAll<HTMLElement>(
              '[data-agv-header-root="true"] [data-col-key]'
            );
            const followerKeys: string[] = [];
            allRightHeaders.forEach((hEl) => {
              if (hEl.style.position === 'sticky' && hEl.style.right !== '') {
                const hRight = parseFloat(hEl.style.right) || 0;
                const cKey = hEl.getAttribute('data-col-key');
                if (cKey && cKey !== key && hRight > myRight) {
                  followerKeys.push(cKey);
                }
              }
            });
            if (followerKeys.length > 0) {
              const sel = followerKeys.map((k) => `[data-col-key="${k}"]`).join(',');
              viewportEl.querySelectorAll<HTMLElement>(sel).forEach((el) => {
                if (el.style.position === 'sticky' && el.style.right !== '') {
                  const fItem: StickyFollowerItem = {
                    el,
                    side: 'right',
                    startOffset: parseFloat(el.style.right) || 0,
                  };
                  if (isNodeVisible(el)) {
                    visibleStickyFollowers.push(fItem);
                  } else {
                    overscanStickyFollowers.push(fItem);
                  }
                }
              });
            }
          }
        }
      }

      let rafId: number | null = null;
      let latestClientX = e.clientX;
      let lastAppliedWidth = initialWidth;

      const mutateNodeBatch = (
        cells: CellItem[],
        spanCells: SpanCellItem[],
        fwContainers: HTMLElement[],
        followers: StickyFollowerItem[],
        newWidth: number,
        actualDelta: number
      ) => {
        const wPx = `${newWidth}px`;
        for (let i = 0; i < cells.length; i++) {
          const item = cells[i];
          item.el.style.width = wPx;
          if (item.hasMin) item.el.style.minWidth = wPx;
          if (item.hasMax) item.el.style.maxWidth = wPx;
        }
        for (let i = 0; i < spanCells.length; i++) {
          const sc = spanCells[i];
          const swPx = `${sc.startWidth + actualDelta}px`;
          sc.el.style.width = swPx;
          sc.el.style.minWidth = swPx;
          sc.el.style.maxWidth = swPx;
        }
        if (fwContainers.length > 0 && startTotalWidth > 0) {
          const totalPx = `${startTotalWidth + actualDelta}px`;
          for (let i = 0; i < fwContainers.length; i++) {
            fwContainers[i].style.width = totalPx;
          }
        }
        for (let i = 0; i < followers.length; i++) {
          const f = followers[i];
          const nextOff = `${f.startOffset + actualDelta}px`;
          if (f.side === 'left') f.el.style.left = nextOff;
          else f.el.style.right = nextOff;
        }
      };

      const applyResize = () => {
        rafId = null;
        if (!resizingRef.current) return;
        const delta = latestClientX - resizingRef.current.startX;
        const targetColDef = colMap[resizingRef.current.key];
        const minW = targetColDef?.minWidth || 50;
        const maxW = targetColDef?.maxWidth || 1200;
        const newWidth = Math.round(
          Math.min(maxW, Math.max(minW, resizingRef.current.startWidth + delta))
        );
        if (newWidth === lastAppliedWidth) return;
        lastAppliedWidth = newWidth;

        if (visibleTargetCells.length > 0) {
          const actualDelta = newWidth - initialWidth;
          mutateNodeBatch(
            visibleTargetCells,
            visibleGroupSpanCells,
            visibleFullWidthContainers,
            visibleStickyFollowers,
            newWidth,
            actualDelta
          );
          if (bandContainers.length > 0) {
            const bandPx = `${startBandWidth + actualDelta}px`;
            for (let i = 0; i < bandContainers.length; i++) {
              bandContainers[i].el.style.width = bandPx;
            }
          }
        } else {
          setColWidth(resizingRef.current.key, newWidth);
        }
      };

      const handleMouseMove = (moveEvent: MouseEvent) => {
        if (!resizingRef.current) return;
        latestClientX = moveEvent.clientX;
        if (rafId === null) {
          rafId = window.requestAnimationFrame(applyResize);
        }
      };

      const cleanupResize = () => {
        if (rafId !== null) {
          window.cancelAnimationFrame(rafId);
          rafId = null;
          applyResize();
        }
        handleEl?.removeAttribute('data-resizing-active');
        const activeResize = resizingRef.current;
        resizingRef.current = null;
        document.body.style.cursor = prevBodyCursor;
        document.body.style.userSelect = prevBodyUserSelect;
        document.documentElement.removeAttribute('data-agv-resizing');
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', cleanupResize);
        window.removeEventListener('blur', cleanupResize);
        if (activeResize && lastAppliedWidth !== activeResize.startWidth) {
          const finalDelta = lastAppliedWidth - initialWidth;
          mutateNodeBatch(
            overscanTargetCells,
            overscanGroupSpanCells,
            overscanFullWidthContainers,
            overscanStickyFollowers,
            lastAppliedWidth,
            finalDelta
          );
          for (let i = 0; i < bandContainers.length; i++) {
            bandContainers[i].el.style.width = bandContainers[i].origWidthStyle;
          }
          setColWidth(activeResize.key, lastAppliedWidth);
        }
      };

      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      window.addEventListener('mouseup', cleanupResize);
      window.addEventListener('blur', cleanupResize);
    },
    [setColWidth, colMap]
  );

  return {
    handleMouseDownResize,
    resizingRef,
  };
}
