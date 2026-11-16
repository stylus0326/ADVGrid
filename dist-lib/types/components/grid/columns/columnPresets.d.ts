import { type FormulaMode } from '../types';
import type { AccessorColumnDef, ColumnDefCommon, DefaultColDef } from './columnTypes';
export type CodeNamePattern = 'code-dash-name' | 'name-paren-code';
export interface FormatCodeNameOptions {
    pattern?: CodeNamePattern;
    separator?: string;
    fallback?: string;
}
export declare function formatCodeName(code: unknown, name: unknown, options?: FormatCodeNameOptions): string;
export declare function formatGridCurrency(amount: unknown, suffix?: string): string;
export declare function createStandardDefaultColDef<TData = any>(): DefaultColDef<TData>;
export interface CodeNameColumnOptions<TData> extends Omit<ColumnDefCommon<TData, string>, 'id'> {
    id: string;
    code: (keyof TData & string) | ((row: TData) => unknown);
    name: (keyof TData & string) | ((row: TData) => unknown);
    pattern?: CodeNamePattern;
    separator?: string;
    fallback?: string | ((row: TData) => string);
}
export declare function buildCodeNameColumn<TData>(options: CodeNameColumnOptions<TData>): AccessorColumnDef<TData, string>;
export interface CurrencyColumnOptions<TData> extends Omit<ColumnDefCommon<TData, number | null | undefined>, 'id'> {
    id?: string;
    suffix?: string;
    formatValue?: (val: unknown) => string;
    highlightNegative?: boolean;
}
export declare function buildCurrencyColumn<TData>(accessorOrFn: any, options: CurrencyColumnOptions<TData>): AccessorColumnDef<TData, any>;
export declare const FORMULA_12M_LABELS: Record<FormulaMode, {
    columnHeader: string;
    short: string;
}>;
export interface ComputedTwelveMonthStats {
    values: number[];
    minIdx: number;
    maxIdx: number;
    minVal: number;
    maxVal: number;
    avgVal: number;
    sumVal: number;
}
export type TwelveMonthSource<TData> = (row: TData) => readonly number[] | null | undefined;
export declare function createTwelveMonthStatsGetter<TData>(getMonths?: TwelveMonthSource<TData>): (row: TData) => ComputedTwelveMonthStats;
export interface Formula12mColumnOptions<TData> extends Omit<ColumnDefCommon<TData, number | undefined>, 'id'> {
    id?: string;
    getMonths?: TwelveMonthSource<TData>;
    formatValue?: (val: number) => string;
    headerLabels?: Partial<Record<FormulaMode, string>>;
    tabletLabels?: Partial<Record<FormulaMode, string>>;
}
export declare function buildFormula12mColumn<TData>(options?: Formula12mColumnOptions<TData>, sharedStatsGetter?: (row: TData) => ComputedTwelveMonthStats): AccessorColumnDef<TData, number | undefined>;
export interface Chart12mColumnOptions<TData> extends Omit<ColumnDefCommon<TData, number | undefined>, 'id'> {
    id?: string;
    getMonths?: TwelveMonthSource<TData>;
    formatValue?: (val: number) => string;
}
export declare function buildChart12mColumn<TData>(options?: Chart12mColumnOptions<TData>, sharedStatsGetter?: (row: TData) => ComputedTwelveMonthStats): AccessorColumnDef<TData, number | undefined>;
export interface TwelveMonthsPairOptions<TData> {
    getMonths?: TwelveMonthSource<TData>;
    formatValue?: (val: number) => string;
    formulaId?: string;
    chartId?: string;
    formulaColumn?: Partial<Omit<Formula12mColumnOptions<TData>, 'getMonths' | 'formatValue'>>;
    chartColumn?: Partial<Omit<Chart12mColumnOptions<TData>, 'getMonths' | 'formatValue'>>;
}
export declare function buildTwelveMonthsPair<TData>(options?: TwelveMonthsPairOptions<TData>): readonly [AccessorColumnDef<TData, number | undefined>, AccessorColumnDef<TData, number | undefined>];
