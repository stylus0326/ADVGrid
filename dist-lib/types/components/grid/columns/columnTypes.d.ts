import React from 'react';
import type { BaseGroupDef, CellSpanParams, ColumnAlign, ColumnDataType, ColumnDef, ColumnEditorType, FormulaMode, PinPosition, SurfaceTheme } from '../types';
export interface ColumnRuntimeContext<TData = any> {
    column: ColumnDef<TData>;
    formulaMode: FormulaMode;
    surfaceTheme: SurfaceTheme;
}
export interface GridColumnMeta<TData = any> {
    align?: ColumnAlign;
    dataType?: ColumnDataType;
    className?: string;
    cellPadding?: string;
    editorType?: ColumnEditorType;
    editorOptions?: ColumnDef<TData>['editorOptions'];
    showTime?: boolean;
    isDateRange?: boolean;
    minDate?: string;
    maxDate?: string;
    isFormula?: boolean;
    isChart?: boolean;
    wrapText?: boolean;
    disableHeaderContextMenu?: boolean;
    disableContextMenu?: boolean;
    colSpan?: (params: CellSpanParams<TData>) => number;
    rowSpan?: (params: CellSpanParams<TData>) => number;
    bindColumnRuntime?: (ctx: ColumnRuntimeContext<TData>) => Partial<ColumnDef<TData>>;
}
export interface HeaderContext<TData = any> {
    column: ColumnDef<TData>;
}
export interface FooterContext<TData = any> {
    column: ColumnDef<TData>;
}
export interface CellContextRow<TData = any> {
    original: TData;
    index: number;
    id: string;
}
export interface CellContext<TData = any, TValue = any> {
    getValue: () => TValue;
    renderValue: () => TValue | null;
    row: CellContextRow<TData>;
    column: ColumnDef<TData>;
    isSelected: boolean;
    isChecked: boolean;
    isResponsive?: boolean;
}
export type ColumnPinSetting = PinPosition | false;
export interface DefaultColDef<TData = any> {
    size?: number;
    minSize?: number;
    maxSize?: number;
    enableSorting?: boolean;
    enableMultiSort?: boolean;
    enableColumnFilter?: boolean;
    enableGlobalFilter?: boolean;
    enableResizing?: boolean;
    enablePinning?: boolean;
    enableHiding?: boolean;
    enableGrouping?: boolean;
    enableEditing?: boolean;
    wrapText?: boolean;
    colSpan?: (params: CellSpanParams<TData>) => number;
    rowSpan?: (params: CellSpanParams<TData>) => number;
    header?: string | ((ctx: HeaderContext<TData>) => React.ReactNode);
    cell?(ctx: CellContext<TData, any>): React.ReactNode;
    footer?: string | ((ctx: FooterContext<TData>) => React.ReactNode);
    meta?: GridColumnMeta<TData>;
}
export interface ColumnDefCommon<TData = any, TValue = any> {
    id?: string;
    header?: string | ((ctx: HeaderContext<TData>) => React.ReactNode);
    cell?(ctx: CellContext<TData, TValue>): React.ReactNode;
    footer?: string | ((ctx: FooterContext<TData>) => React.ReactNode);
    size?: number;
    minSize?: number;
    maxSize?: number;
    enableSorting?: boolean;
    enableMultiSort?: boolean;
    enableColumnFilter?: boolean;
    enableGlobalFilter?: boolean;
    enableResizing?: boolean;
    enablePinning?: boolean;
    enableHiding?: boolean;
    enableGrouping?: boolean;
    enableEditing?: boolean;
    wrapText?: boolean;
    colSpan?: (params: CellSpanParams<TData>) => number;
    rowSpan?: (params: CellSpanParams<TData>) => number;
    pinned?: ColumnPinSetting;
    meta?: GridColumnMeta<TData>;
}
export interface AccessorColumnDef<TData = any, TValue = any> extends ColumnDefCommon<TData, TValue> {
    accessorKey?: (keyof TData & string) | (string & {});
    accessorFn?(row: TData, index: number): TValue;
}
export interface DisplayColumnDef<TData = any> extends ColumnDefCommon<TData, unknown> {
    id: string;
}
export interface GroupColumnDef<TData = any> {
    id?: string;
    header: string | ((ctx: HeaderContext<TData>) => React.ReactNode);
    title?: string;
    columns: GridColumnDef<TData, any>[];
    isToggleable?: boolean;
    isCollapsed?: boolean;
    isAtomic?: boolean;
    meta?: GridColumnMeta<TData>;
}
export type GridColumnDef<TData = any, TValue = any> = AccessorColumnDef<TData, TValue> | DisplayColumnDef<TData> | GroupColumnDef<TData> | ColumnDef<TData>;
export interface PaginationConfig {
    page?: number;
    defaultPage?: number;
    pageSize?: number;
    defaultPageSize?: number;
    pageSizeOptions?: readonly number[];
    total?: number;
    serverTotal?: number;
    onPageChange?: (page: number) => void;
    onPageSizeChange?: (pageSize: number) => void;
}
export interface NormalizedGridColumnsResult<TData = any> {
    flatColumns: ColumnDef<TData>[];
    columnGroups?: BaseGroupDef[];
    columnDefinedPins: Record<string, PinPosition>;
}
export type TabletFieldKey<TData> = (keyof TData & string) | (string & {});
export type TabletLineSlot<TData> = TabletFieldKey<TData> | readonly [TabletFieldKey<TData>, ...TabletFieldKey<TData>[]] | {
    col: TabletFieldKey<TData>;
    label?: string | boolean | ((row: TData, rowIndex: number) => string | undefined);
    join?: readonly TabletFieldKey<TData>[];
    joinSeparator?: string;
    emphasis?: 'strong' | 'normal' | 'muted';
};
export type TabletGroupLines<TData> = readonly [TabletLineSlot<TData>] | readonly [TabletLineSlot<TData>, TabletLineSlot<TData>] | readonly [TabletLineSlot<TData>, TabletLineSlot<TData>, TabletLineSlot<TData>];
export interface TabletColumnGroup<TData = any> {
    id?: string;
    header: string;
    width?: number;
    minWidth?: number;
    align?: ColumnAlign;
    lines: TabletGroupLines<TData>;
}
export interface PhoneCardConfig<TData = any> {
    title?: TabletLineSlot<TData>;
    badge?: TabletLineSlot<TData>;
    summary?: readonly TabletLineSlot<TData>[];
    details?: readonly TabletLineSlot<TData>[];
    chart?: boolean | {
        formula?: TabletFieldKey<TData>;
        chart: TabletFieldKey<TData>;
    };
    detailButtonLabel?: string | false;
}
