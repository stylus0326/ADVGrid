import { type CellSpanParams, type CenterDockStatus, type ColumnDef, type GridSpanMethod, type PinPosition } from './types';
export type CellSpanCellPlan = {
    kind: 'normal';
} | {
    kind: 'omit';
} | {
    kind: 'spacer';
    widthPx: number;
} | {
    kind: 'anchor';
    rowSpan: number;
    colSpan: number;
    widthPx: number;
    heightPx?: number;
    hasRightPinnedDivider?: boolean;
};
export interface RowSpanPlan {
    cells: CellSpanCellPlan[];
    hasVerticalSpan: boolean;
    hasCoveredFromAbove: boolean;
}
export interface SpanWindowPlan {
    rowPlans: Map<number, RowSpanPlan>;
    anchorRowsBeforeStart: number[];
    hasAnyVerticalSpan: boolean;
}
export interface AutoRowSpanOptions<T = any> {
    maxSpan?: number;
    canMerge?: (row: T, rowIndex: number) => boolean;
}
export declare function createAutoRowSpan<T = any>(selector: (keyof T & string) | ((row: T) => unknown), options?: AutoRowSpanOptions<T>): (params: CellSpanParams<T>) => number;
export declare function computeSpanWindowPlan<T = any>(params: {
    startRow: number;
    endRow: number;
    totalRows: number;
    baseRowHeight: number;
    getRowTop: (rowIndex: number) => number;
    columns: ColumnDef<T>[];
    colWidths: Record<string, number>;
    columnPins: Record<string, PinPosition>;
    centerDockStatus: Record<string, CenterDockStatus>;
    lastEffectiveLeftColKey: string | null;
    getRowItem: (rowIndex: number) => T;
    spanMethod?: GridSpanMethod<T>;
    maxLookback?: number;
}): SpanWindowPlan;
