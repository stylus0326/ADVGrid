export interface FilteredSelectionState {
    allChecked: boolean;
    isIndeterminate: boolean;
    selectedCount: number;
    totalCount: number;
}
export declare function computeFilteredSelectionState(totalRows: number, checkedRowIndices: Set<number>, activeRowIndices?: number[] | null): FilteredSelectionState;
export declare function toggleFilteredRowsSelection(totalRows: number, currentChecked: Set<number>, activeRowIndices?: number[] | null, forceSelect?: boolean): Set<number>;
