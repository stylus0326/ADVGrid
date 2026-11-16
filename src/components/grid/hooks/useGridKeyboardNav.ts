import React, { useEffect, useRef } from 'react';

interface UseGridKeyboardNavParams<T> {
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
  activeContextMenu: any;
  activeEditingCell: any;
  isAnyPopupActive: () => boolean;
  totalRows: number;
  selectedRowIndex?: number | null;
  onSelectRow?: (rowIndex: number, row: T) => void;
  onToggleCheck?: (rowIndex: number, row: T, e: React.MouseEvent) => void;
  getRowItem: (index: number) => T;
  viewportHeight: number;
  actualRowHeight: number;
  getRowTop?: (rowIndex: number) => number;
  getRowHeight?: (rowIndex: number) => number;
  pinnedRowsHeight?: number;
  customHeaderHeight?: number;
  middleElements: { type: string }[];
  showFilterRow: boolean;
  pinnedRowsLength: number;
  stickyGroupRow: any;
  isWindowScroll?: boolean;
}

export function useGridKeyboardNav<T>({
  scrollContainerRef,
  activeContextMenu,
  activeEditingCell,
  isAnyPopupActive,
  totalRows,
  selectedRowIndex,
  onSelectRow,
  onToggleCheck,
  getRowItem,
  viewportHeight,
  actualRowHeight,
  getRowTop,
  getRowHeight,
  pinnedRowsHeight,
  customHeaderHeight,
  middleElements,
  showFilterRow,
  pinnedRowsLength,
  stickyGroupRow,
  isWindowScroll = false,
}: UseGridKeyboardNavParams<T>) {
  const keyNavStateRef = useRef({
    activeContextMenu,
    activeEditingCell,
    isAnyPopupActive,
    totalRows,
    selectedRowIndex,
    onSelectRow,
    onToggleCheck,
    getRowItem,
    viewportHeight,
    actualRowHeight,
    getRowTop,
    getRowHeight,
    pinnedRowsHeight,
    customHeaderHeight,
    middleElements,
    showFilterRow,
    pinnedRowsLength,
    stickyGroupRow,
    isWindowScroll,
  });

  keyNavStateRef.current = {
    activeContextMenu,
    activeEditingCell,
    isAnyPopupActive,
    totalRows,
    selectedRowIndex,
    onSelectRow,
    onToggleCheck,
    getRowItem,
    viewportHeight,
    actualRowHeight,
    getRowTop,
    getRowHeight,
    pinnedRowsHeight,
    customHeaderHeight,
    middleElements,
    showFilterRow,
    pinnedRowsLength,
    stickyGroupRow,
    isWindowScroll,
  };

  useEffect(() => {
    const findNearestDataRow = (
      startIdx: number,
      dir: 1 | -1,
      total: number,
      getItem: (idx: number) => any
    ): number | null => {
      let i = Math.max(0, Math.min(total - 1, startIdx));
      while (i >= 0 && i < total) {
        const row = getItem(i);
        if (row && !row._isGroupRow && !row._isDetailRow) return i;
        i += dir;
      }
      return null;
    };

    const handleKeyDownNav = (e: KeyboardEvent) => {
      if (e.defaultPrevented) return;
      const st = keyNavStateRef.current;
      if (st.activeContextMenu || st.activeEditingCell || st.isAnyPopupActive()) return;
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return;
      }
      if (st.totalRows <= 0) return;

      const hasValidSelection =
        typeof st.selectedRowIndex === 'number' &&
        st.selectedRowIndex >= 0 &&
        st.selectedRowIndex < st.totalRows;

      if (
        e.key === 'ArrowDown' ||
        e.key === 'ArrowUp' ||
        e.key === 'PageDown' ||
        e.key === 'PageUp'
      ) {
        if (!st.onSelectRow) return;
        e.preventDefault();
        const pageStep = Math.max(
          1,
          Math.floor((st.viewportHeight || 400) / st.actualRowHeight) - 1
        );

        let nextIdx: number | null = null;
        if (!hasValidSelection) {
          // Khi chưa có dòng nào được chọn, bắt đầu từ dòng dữ liệu đầu tiên (hoặc cuối cùng nếu nhấn PageUp?)
          nextIdx = findNearestDataRow(0, 1, st.totalRows, st.getRowItem);
        } else {
          const curIdx = st.selectedRowIndex as number;
          const isUp = e.key === 'ArrowUp' || e.key === 'PageUp';
          const delta = e.key === 'PageDown' || e.key === 'PageUp' ? pageStep : 1;
          const candidateIdx = isUp
            ? Math.max(0, curIdx - delta)
            : Math.min(st.totalRows - 1, curIdx + delta);
          if (candidateIdx === curIdx) return;
          nextIdx = findNearestDataRow(
            candidateIdx,
            isUp ? -1 : 1,
            st.totalRows,
            st.getRowItem
          );
          if (nextIdx === null || nextIdx === curIdx) return;
        }

        if (nextIdx === null) return;
        const nextRow = st.getRowItem(nextIdx);
        if (!nextRow || (nextRow as any)._isGroupRow || (nextRow as any)._isDetailRow) return;
        st.onSelectRow(nextIdx, nextRow);

        const el = scrollContainerRef.current;
        if (el) {
          const rowTop = st.getRowTop ? st.getRowTop(nextIdx) : nextIdx * st.actualRowHeight;
          const curRowHeight = st.getRowHeight ? st.getRowHeight(nextIdx) : st.actualRowHeight;
          const rowBottom = rowTop + curRowHeight;
          const resolvedPinnedHeight =
            st.pinnedRowsHeight ?? st.pinnedRowsLength * st.actualRowHeight;
          const stickyHeaderHeight =
            (st.customHeaderHeight ??
              (st.middleElements.some((m) => m.type === 'group') ? 64 : 34)) +
            (st.showFilterRow ? 34 : 0) +
            resolvedPinnedHeight +
            (st.stickyGroupRow ? st.actualRowHeight : 0);

          if (st.isWindowScroll && typeof window !== 'undefined') {
            const rect = el.getBoundingClientRect();
            const rowViewportTop = rect.top + stickyHeaderHeight + rowTop;
            const rowViewportBottom = rect.top + stickyHeaderHeight + rowBottom;
            const stickyBottom = Math.max(0, rect.top) + stickyHeaderHeight;
            const viewH = window.innerHeight || 600;
            if (rowViewportTop < stickyBottom) {
              window.scrollTo({
                top: Math.max(0, window.scrollY + (rowViewportTop - stickyBottom)),
              });
            } else if (rowViewportBottom > viewH) {
              window.scrollTo({
                top: Math.max(0, window.scrollY + (rowViewportBottom - viewH)),
              });
            }
          } else {
            const viewTop = el.scrollTop;
            const visibleDataHeight = Math.max(
              curRowHeight,
              el.clientHeight - stickyHeaderHeight
            );
            if (rowTop < viewTop) {
              el.scrollTop = rowTop;
            } else if (rowBottom > viewTop + visibleDataHeight) {
              el.scrollTop = Math.max(0, rowBottom - visibleDataHeight);
            }
          }
        }
      } else if (
        e.key === ' ' &&
        hasValidSelection &&
        st.onToggleCheck &&
        !target?.closest?.('button, a, [role="button"], [role="checkbox"]')
      ) {
        const curIdx = st.selectedRowIndex as number;
        const curRow = st.getRowItem(curIdx) as any;
        if (curRow && !curRow._isGroupRow && !curRow._isDetailRow) {
          e.preventDefault();
          st.onToggleCheck(curIdx, curRow, e as unknown as React.MouseEvent);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDownNav);
    return () => window.removeEventListener('keydown', handleKeyDownNav);
  }, [scrollContainerRef]);
}
