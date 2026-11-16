import { ColumnDef, BaseGroupDef } from '../types';
interface UseColumnAutoFitParams<T> {
    colMap: Record<string, ColumnDef<T>>;
    effectiveColumns: ColumnDef<T>[];
    columnGroups?: BaseGroupDef[];
    getRowItem: (idx: number) => T;
    columnSums?: Record<string, number>;
    totalRows: number;
    setColWidth: (key: string, width: number) => void;
    setMultipleColWidths: (updates: Record<string, number>) => void;
}
export declare function useColumnAutoFit<T>({ colMap, effectiveColumns, columnGroups, getRowItem, columnSums, totalRows, setColWidth, setMultipleColWidths, }: UseColumnAutoFitParams<T>): {
    handleAutoFitColumn: (colKey: string) => void;
    handleAutoFitAllColumns: () => void;
    handleAutoFitBandColumns: (groupId: string) => void;
};
export {};
