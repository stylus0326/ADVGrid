import { ColumnAlign, ColumnDef, DATA_TYPES, FilterOperation } from './types';
export interface ParsedDateYMD {
    year: number;
    month: number;
    day: number;
    key: string;
}
export declare function parseDatePartsYMD(val: unknown): ParsedDateYMD | null;
export declare function toDateKeyYMD(val: unknown): string | null;
export declare function formatDisplayDate(str: unknown, omitYear?: boolean, includeTime?: boolean): string;
export declare function formatGridDateValue(val: unknown, includeTime?: boolean): string;
export declare function getSttColWidth(totalRows: number, title?: string): number;
export declare function parseGridNumber(val: any): number;
export declare function formatGridNumber(val: any, decimals?: number): string;
export declare const ALIGN_TEXT_CLASSES: Record<ColumnAlign, string>;
export declare function getAlignTextClass(align?: ColumnAlign): string;
export declare const ALIGN_JUSTIFY_CLASSES: Record<ColumnAlign, string>;
export declare function getAlignJustifyClass(align?: ColumnAlign): string;
export declare function isNoInputFilterOp(op?: string | null): boolean;
export declare function isBetweenFilterOp(op?: string | null): boolean;
export declare function isNegativeFilterOp(op?: string | null): boolean;
export declare function isSelectionColumn<T = any>(col?: ColumnDef<T> | Partial<ColumnDef<T>> | null): boolean;
export declare const DEFAULT_OP_BY_TYPE: Record<string, FilterOperation>;
export declare function getColumnFilterType(colKey: string, columns?: Array<{
    key: string;
    dataType?: string;
    isCurrency?: boolean;
}>): typeof DATA_TYPES.TEXT | typeof DATA_TYPES.NUMBER | typeof DATA_TYPES.DATE | typeof DATA_TYPES.TIME;
export declare function getDefaultFilterOpForColumn(colKey: string, columns?: Array<{
    key: string;
    dataType?: string;
}>): FilterOperation;
export declare function getGridCellValue(row: any, colKey: string): any;
export declare function createColumnFilter(val: any, op?: FilterOperation): {
    op: FilterOperation;
    val: string;
};
export declare function createEqualsFilter(val: any): {
    op: FilterOperation;
    val: string;
};
export declare function createContainsFilter(val: any): {
    op: FilterOperation;
    val: string;
};
export declare function createBetweenFilter(from: any, to: any): {
    op: "between";
    val: string;
};
