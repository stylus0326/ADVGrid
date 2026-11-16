import { ColumnDef, FilterOperation, SortConfig, FormulaMode } from './types';
export declare function splitDateRange(s: string): [string, string] | null;
export declare function parseSingleDateTimestamp(s: string, isEnd?: boolean): number | null;
export declare function parseTimeToMinutes(s: string): number | null;
export declare function matchFilterValue(cellVal: any, op: FilterOperation, query: string, dataType?: string, filterObj?: any): boolean;
export declare function getRowValueForSortGeneric(row: any, colKey: string, dataType?: string, sortByMonth?: boolean, formulaMode?: FormulaMode | string): number | string;
export declare function compareGridRows(rowA: any, rowB: any, sortConfig: SortConfig | null, columns?: ColumnDef<any>[], formulaMode?: string): number;
export declare function getColumnDateBoundsFromGetter(getVal: (r: number, k: string) => any, totalRows: number, colKey: string, sampleSize?: number): {
    min: string;
    max: string;
};
