import React from 'react';
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
    middleElements: {
        type: string;
    }[];
    showFilterRow: boolean;
    pinnedRowsLength: number;
    stickyGroupRow: any;
    isWindowScroll?: boolean;
}
export declare function useGridKeyboardNav<T>({ scrollContainerRef, activeContextMenu, activeEditingCell, isAnyPopupActive, totalRows, selectedRowIndex, onSelectRow, onToggleCheck, getRowItem, viewportHeight, actualRowHeight, getRowTop, getRowHeight, pinnedRowsHeight, customHeaderHeight, middleElements, showFilterRow, pinnedRowsLength, stickyGroupRow, isWindowScroll, }: UseGridKeyboardNavParams<T>): void;
export {};
