export interface SortRowFlipState {
    deltaY: number;
    initialOpacity: number;
    zIndex: number;
}
export declare function computeSortRowFlipState(params: {
    rowKey: string;
    newRowIndex: number;
    oldRowIndex: number | undefined;
    rowHeight: number;
    viewportCenterRow: number;
    prevStartRow: number;
    maxDirectRows?: number;
}): SortRowFlipState | null;
export declare function runSortFlipAnimation(params: {
    viewportEl: HTMLDivElement;
    prevMap: Map<string, number>;
    prevStartRow: number;
    viewportCenterRow: number;
    actualRowHeight: number;
    activeAnimatedRowsRef: React.MutableRefObject<HTMLElement[]>;
    sortAnimRafRef: React.MutableRefObject<number | null>;
    sortAnimTimeoutRef: React.MutableRefObject<number | null>;
}): void;
