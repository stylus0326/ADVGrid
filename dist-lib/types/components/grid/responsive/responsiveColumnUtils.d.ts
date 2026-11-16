import React from 'react';
import { BaseGroupDef, CellRenderParams, ColumnAlign, ColumnDef, PhoneCardConfig, TabletColumnGroup } from '../types';
export interface CompiledTabletLine<T = any> {
    col: ColumnDef<T>;
    colIndex: number;
    label?: string;
    labelGetter?: (row: T, rowIndex: number) => string | undefined;
    joinCols?: Array<{
        col: ColumnDef<T>;
        colIndex: number;
    }>;
    joinSeparator: string;
    isChart: boolean;
    isPrimaryFirstLine: boolean;
    emphasis: 'strong' | 'normal' | 'muted';
}
export interface CompiledTabletGroup<T = any> {
    id: string;
    header: string;
    width?: number;
    minWidth: number;
    align: ColumnAlign;
    hasStandaloneChart: boolean;
    lines: CompiledTabletLine<T>[];
}
export interface CompiledPhoneChartBand<T = any> {
    chartLine: CompiledTabletLine<T>;
    formulaLine?: CompiledTabletLine<T>;
}
export interface CompiledPhoneInfoRow<T = any> {
    left?: CompiledTabletLine<T>;
    right?: CompiledTabletLine<T>;
    showDetailButton?: boolean;
}
export interface CompiledPhoneCard<T = any> {
    title?: CompiledTabletLine<T>;
    badge?: CompiledTabletLine<T>;
    summary: CompiledTabletLine<T>[];
    chartBand?: CompiledPhoneChartBand<T>;
    infoRows: CompiledPhoneInfoRow<T>[];
    detailButtonLabel?: string;
    hasExpandableDrawer: boolean;
    extraHeight: number;
}
export declare function resolveCompiledLineLabel<T>(line: CompiledTabletLine<T>, row: T, rowIndex: number): string | undefined;
export declare function computeTabletTrackMinWidth(groups: CompiledTabletGroup<any>[] | undefined, showRowNumber: boolean, showSelectionCol: boolean): number;
export declare function isResponsiveSystemColumn<T>(col: ColumnDef<T> | undefined | null): boolean;
export declare function getResponsiveDataColumns<T>(columns?: ColumnDef<T>[]): ColumnDef<T>[];
export declare function extractResponsiveRawValue<T>(row: T, col: ColumnDef<T>, rowIndex?: number): any;
export declare function formatResponsiveFieldValue<T>(col: ColumnDef<T>, rawVal: any): string;
export declare function renderResponsiveField<T>(params: {
    row: T;
    rowIndex: number;
    colIndex?: number;
    col: ColumnDef<T>;
    isSelected: boolean;
    isChecked: boolean;
    renderCell?: (p: CellRenderParams<T>) => React.ReactNode;
}): React.ReactNode;
export declare function compileTabletGroups<T>(columns: ColumnDef<T>[], tabletGroups?: readonly TabletColumnGroup<T>[], columnGroups?: BaseGroupDef[], hiddenColKeys?: Set<string>): CompiledTabletGroup<T>[];
export declare function compilePhoneCard<T>(columns: ColumnDef<T>[], phoneCard?: PhoneCardConfig<T>, hiddenColKeys?: Set<string>): CompiledPhoneCard<T>;
