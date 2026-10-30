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
  customHeaderHeight?: number;
  middleElements: { type: string }[];
  showFilterRow: boolean;
  pinnedRowsLength: number;
  stickyGroupRow: any;
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
  customHeaderHeight,
  middleElements,
  showFilterRow,
  pinnedRowsLength,
  stickyGroupRow,
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
    customHeaderHeight,
    middleElements,
    showFilterRow,
    pinnedRowsLength,
    stickyGroupRow,
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
    customHeaderHeight,
    middleElements,
    showFilterRow,
    pinnedRowsLength,
    stickyGroupRow,
  };

  useEffect(() => {
    const handleKeyDownNav = (e: KeyboardEvent) => {
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
        const curIdx: number =
          typeof st.selectedRowIndex === 'number' && st.selectedRowIndex >= 0
            ? st.selectedRowIndex
            : 0;
        let nextIdx: number = curIdx;
        if (e.key === 'ArrowDown') nextIdx = Math.min(st.totalRows - 1, curIdx + 1);
        else if (e.key === 'ArrowUp') nextIdx = Math.max(0, curIdx - 1);
        else if (e.key === 'PageDown') nextIdx = Math.min(st.totalRows - 1, curIdx + pageStep);
        else if (e.key === 'PageUp') nextIdx = Math.max(0, curIdx - pageStep);

        if (nextIdx === curIdx) return;

        const nextRow = st.getRowItem(nextIdx);
        st.onSelectRow(nextIdx, nextRow);

        const el = scrollContainerRef.current;
        if (el) {
          const rowTop = nextIdx * st.actualRowHeight;
          const rowBottom = rowTop + st.actualRowHeight;
          const viewTop = el.scrollTop;
          const stickyHeaderHeight =
            (st.customHeaderHeight ??
              (st.middleElements.some((m) => m.type === 'group') ? 64 : 34)) +
            (st.showFilterRow ? 34 : 0) +
            st.pinnedRowsLength * st.actualRowHeight +
            (st.stickyGroupRow ? st.actualRowHeight : 0);
          const visibleDataHeight = Math.max(
            st.actualRowHeight,
            el.clientHeight - stickyHeaderHeight
          );
          if (rowTop < viewTop) {
            el.scrollTop = rowTop;
          } else if (rowBottom > viewTop + visibleDataHeight) {
            el.scrollTop = Math.max(0, rowBottom - visibleDataHeight);
          }
        }
      } else if (
        e.key === ' ' &&
        typeof st.selectedRowIndex === 'number' &&
        st.selectedRowIndex >= 0 &&
        st.onToggleCheck
      ) {
        const curRow = st.getRowItem(st.selectedRowIndex) as any;
        if (curRow && !curRow._isGroupRow) {
          e.preventDefault();
          st.onToggleCheck(st.selectedRowIndex, curRow, e as unknown as React.MouseEvent);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDownNav);
    return () => window.removeEventListener('keydown', handleKeyDownNav);
  }, [scrollContainerRef]);
}
