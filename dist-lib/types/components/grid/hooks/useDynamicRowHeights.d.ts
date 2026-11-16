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
export declare function useDynamicRowHeights<T = any>({ totalRows, baseRowHeight, dynamicRowHeight, hasDynamicDetailRows, estimatedRowHeight, getRowHeightProp, getRowItem, getRowKey, overscanRows, isPhoneMode, phoneExpandedRows, expandedCardExtraHeight, dataVersion, layoutResetKey, scrollContainerRef, virtualScrollTopRef, lastScrollTopRef, isWindowScroll, }: UseDynamicRowHeightsOptions<T>): UseDynamicRowHeightsResult;
