import React from 'react';
import { SortConfig, GroupSortConfig } from '../types';
export declare function preloadSortFlipEngine(): void;
interface UseGridSortFlipAnimationParams<T> {
    enabled?: boolean;
    scrollContainerRef: React.RefObject<HTMLDivElement | null>;
    virtualScrollTopRef?: React.RefObject<number>;
    sortConfig?: SortConfig | null;
    sortRules?: SortConfig[];
    groupSortConfig?: GroupSortConfig | null;
    visibleRows?: Array<{
        rowIndex: number;
        row: T;
    }>;
    visibleChunksMap?: Map<number, T[]>;
    chunkSize?: number;
    actualRowHeight: number;
    findRowIndexAtOffset?: (offsetY: number) => number;
    viewportHeight: number;
    getRowKey: (row: T, index: number) => string | number;
}
export declare function useGridSortFlipAnimation<T>({ enabled, scrollContainerRef, virtualScrollTopRef, sortConfig, sortRules, groupSortConfig, visibleRows, visibleChunksMap, chunkSize, actualRowHeight, findRowIndexAtOffset, viewportHeight, getRowKey, }: UseGridSortFlipAnimationParams<T>): void;
export {};
