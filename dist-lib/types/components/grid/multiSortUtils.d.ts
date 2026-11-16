import { ColumnDef, FormulaMode, SortConfig } from './types';
export declare function normalizeSortRules(sortRules?: SortConfig[] | null, sortConfig?: SortConfig | null): SortConfig[];
export declare function toggleColumnSortRules(currentRules: SortConfig[], colKey: string, options?: {
    multi?: boolean;
    enableMultiSort?: boolean;
}): SortConfig[];
export declare function reorderSortRules(rules: SortConfig[], fromIndex: number, toIndex: number): SortConfig[];
export interface SortRowIndicesMultiParams<TRecord> {
    baseIndices: number[];
    rules: SortConfig[];
    colMap: Record<string, ColumnDef<TRecord>>;
    getRowVal: (origIdx: number, colKey: string) => any;
    rows: TRecord[];
    rowKeys: (string | number)[];
    getRowKeyAt?: (origIdx: number) => string | number;
    checkedRowKeys: Set<string | number>;
    formulaMode?: FormulaMode | string;
}
export declare function sortRowIndicesMulti<TRecord>({ baseIndices, rules, colMap, getRowVal, rows, rowKeys, getRowKeyAt, checkedRowKeys, formulaMode, }: SortRowIndicesMultiParams<TRecord>): number[];
