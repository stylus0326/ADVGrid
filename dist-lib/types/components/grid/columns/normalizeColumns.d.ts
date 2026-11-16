import type { FormulaMode, SurfaceTheme } from '../types';
import type { AccessorColumnDef, DefaultColDef, DisplayColumnDef, GridColumnDef, GroupColumnDef, NormalizedGridColumnsResult } from './columnTypes';
export type { AccessorColumnDef, DefaultColDef, DisplayColumnDef, GridColumnDef, GroupColumnDef, PaginationConfig, } from './columnTypes';
export interface BasicColumnHelper<TData> {
    accessor<TAccessor extends keyof TData & string>(accessorKey: TAccessor, column: Omit<AccessorColumnDef<TData, TData[TAccessor]>, 'accessorKey' | 'accessorFn'>): AccessorColumnDef<TData, TData[TAccessor]>;
    accessor<TValue = any>(accessorKey: string & {}, column: Omit<AccessorColumnDef<TData, TValue>, 'accessorKey' | 'accessorFn'>): AccessorColumnDef<TData, TValue>;
    accessor<TValue>(accessorFn: (row: TData, index: number) => TValue, column: Omit<AccessorColumnDef<TData, TValue>, 'accessorKey' | 'accessorFn'> & {
        id: string;
    }): AccessorColumnDef<TData, TValue>;
    display(column: DisplayColumnDef<TData>): DisplayColumnDef<TData>;
    group(column: GroupColumnDef<TData>): GroupColumnDef<TData>;
}
export declare function createBasicColumnHelper<TData>(): BasicColumnHelper<TData>;
export interface NormalizeColumnsOptions {
    enableColumnPinning?: boolean;
    enableCenterDock?: boolean;
    formulaMode?: FormulaMode;
    surfaceTheme?: SurfaceTheme;
}
export declare function normalizeGridColumns<TData = any>(defs: readonly GridColumnDef<TData, any>[] | undefined, defaultColDef?: DefaultColDef<TData>, options?: NormalizeColumnsOptions): NormalizedGridColumnsResult<TData>;
