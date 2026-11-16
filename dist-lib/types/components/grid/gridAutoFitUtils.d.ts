import { ColumnDef } from './types';
export declare function measureTextWidth(text: string | number, font?: string): number;
export declare function calcColAutoFitWidth<T = any>(col: ColumnDef<T>, sampleData?: T[], maxLimit?: number, minLimit?: number, summaryValues?: (number | string)[], totalRows?: number, fontFamily?: string): number;
export declare function collectAutoFitSampleRows<T = any>(totalRows: number, getRowItem?: (idx: number) => T | undefined, sampleLimit?: number): T[];
