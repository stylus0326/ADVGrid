import React from 'react';
export interface UseVirtualListOptions {
    itemCount: number;
    itemHeight: number;
    viewportRef: React.RefObject<HTMLDivElement | null>;
    overscan?: number;
    threshold?: number;
    enabled?: boolean;
    defaultViewportHeight?: number;
    topOffset?: number;
}
export interface UseVirtualListResult {
    isVirtualized: boolean;
    startIndex: number;
    endIndex: number;
    totalHeight: number;
    offsetY: number;
    topSpacer: number;
    bottomSpacer: number;
    handleScroll: (e: React.UIEvent<HTMLDivElement>) => void;
    scrollToIndex: (index: number, insetTop?: number, insetBottom?: number) => void;
    resetScroll: () => void;
    syncFromViewport: () => void;
}
export declare function useVirtualList({ itemCount, itemHeight, viewportRef, overscan, threshold, enabled, defaultViewportHeight, topOffset, }: UseVirtualListOptions): UseVirtualListResult;
