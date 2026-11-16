import React from 'react';
import { ColumnDef } from '../types';
export interface ColumnResizeSessionParams<T> {
    key: string;
    event: React.MouseEvent;
    colMap: Record<string, ColumnDef<T>>;
    colWidthsRef: React.MutableRefObject<Record<string, number>>;
    setColWidth: (key: string, width: number) => void;
    resizingRef: React.MutableRefObject<{
        key: string;
        startX: number;
        startWidth: number;
    } | null>;
}
export declare function startColumnResizeSession<T>({ key, event, colMap, colWidthsRef, setColWidth, resizingRef, }: ColumnResizeSessionParams<T>): void;
