import React from 'react';
import { ColumnDef } from '../types';
export declare function preloadColumnResizeEngine(): void;
interface UseColumnResizeParams<T> {
    colMap: Record<string, ColumnDef<T>>;
    colWidths: Record<string, number>;
    setColWidth: (key: string, width: number) => void;
}
export declare function useColumnResize<T>({ colMap, colWidths, setColWidth, }: UseColumnResizeParams<T>): {
    handleMouseDownResize: (key: string, e: React.MouseEvent) => void;
    resizingRef: React.RefObject<{
        key: string;
        startX: number;
        startWidth: number;
    } | null>;
};
export {};
