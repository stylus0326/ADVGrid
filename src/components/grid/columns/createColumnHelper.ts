import type {
  AccessorColumnDef,
  DisplayColumnDef,
  GroupColumnDef,
} from './columnTypes';
import {
  buildChart12mColumn,
  buildCodeNameColumn,
  buildCurrencyColumn,
  buildFormula12mColumn,
  buildTwelveMonthsPair,
  type Chart12mColumnOptions,
  type CodeNameColumnOptions,
  type CurrencyColumnOptions,
  type Formula12mColumnOptions,
  type TwelveMonthsPairOptions,
} from './columnPresets';

export interface ColumnHelper<TData> {
  accessor<TAccessor extends keyof TData & string>(
    accessorKey: TAccessor,
    column: Omit<AccessorColumnDef<TData, TData[TAccessor]>, 'accessorKey' | 'accessorFn'>
  ): AccessorColumnDef<TData, TData[TAccessor]>;
  accessor<TValue = any>(
    accessorKey: string & {},
    column: Omit<AccessorColumnDef<TData, TValue>, 'accessorKey' | 'accessorFn'>
  ): AccessorColumnDef<TData, TValue>;
  accessor<TValue>(
    accessorFn: (row: TData, index: number) => TValue,
    column: Omit<AccessorColumnDef<TData, TValue>, 'accessorKey' | 'accessorFn'> & { id: string }
  ): AccessorColumnDef<TData, TValue>;
  display(column: DisplayColumnDef<TData>): DisplayColumnDef<TData>;
  group(column: GroupColumnDef<TData>): GroupColumnDef<TData>;
  codeName(column: CodeNameColumnOptions<TData>): AccessorColumnDef<TData, string>;
  currency<TAccessor extends keyof TData & string>(
    accessorKey: TAccessor,
    column: CurrencyColumnOptions<TData>
  ): AccessorColumnDef<TData, TData[TAccessor]>;
  currency(
    accessorFn: (row: TData, index: number) => number | null | undefined,
    column: CurrencyColumnOptions<TData> & { id: string }
  ): AccessorColumnDef<TData, number | null | undefined>;
  formula12m(column?: Formula12mColumnOptions<TData>): AccessorColumnDef<TData, number | undefined>;
  chart12m(column?: Chart12mColumnOptions<TData>): AccessorColumnDef<TData, number | undefined>;
  twelveMonths(
    options?: TwelveMonthsPairOptions<TData>
  ): readonly [
    AccessorColumnDef<TData, number | undefined>,
    AccessorColumnDef<TData, number | undefined>,
  ];
}

/**
 * Factory chuẩn TanStack Table v8 để khai báo định nghĩa cột an toàn kiểu dữ liệu.
 */
export function createColumnHelper<TData>(): ColumnHelper<TData> {
  return {
    accessor(accessorOrFn: any, column: any): any {
      if (typeof accessorOrFn === 'function') {
        return {
          ...column,
          accessorFn: accessorOrFn,
        };
      }
      return {
        ...column,
        id: column?.id ?? accessorOrFn,
        accessorKey: accessorOrFn,
      };
    },
    display(column) {
      return { ...column };
    },
    group(column) {
      return { ...column };
    },
    codeName(column) {
      return buildCodeNameColumn<TData>(column);
    },
    currency(accessorOrFn: any, column: any): any {
      return buildCurrencyColumn<TData>(accessorOrFn, column);
    },
    formula12m(column) {
      return buildFormula12mColumn<TData>(column);
    },
    chart12m(column) {
      return buildChart12mColumn<TData>(column);
    },
    twelveMonths(options) {
      return buildTwelveMonthsPair<TData>(options);
    },
  };
}
