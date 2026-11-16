import React from 'react';
import { ColumnDef, PinPosition, CenterDockStatus, SurfaceTheme } from './types';
export interface ColRenderMeta<T = any> {
    col: ColumnDef<T>;
    key: string;
    width: number;
    cellRole: 'stt' | 'chk' | 'expand' | 'data';
    editable: boolean;
    isEmptyCol: boolean;
    isDisableContextMenu: boolean;
    isNumber: boolean;
    isTime: boolean;
    isDateLike: boolean;
    hasCustomCellRender: boolean;
    stickyStyle: React.CSSProperties;
    classNameEven: string;
    classNameOdd: string;
    classNameSelected: string;
    classNameEditing: string;
}
export interface GridLayoutSnapshot<T = any> {
    columns: ColumnDef<T>[];
    colWidths: Record<string, number>;
    rowHeight: number;
    totalRowWidth: number;
    rowBoxStyle: React.CSSProperties;
    colRenderMetas: ColRenderMeta<T>[];
    colMetaByKey: Record<string, ColRenderMeta<T>>;
    surfaceTheme: SurfaceTheme;
    columnPins: Record<string, PinPosition>;
    leftOffsets: Record<string, number>;
    rightOffsets: Record<string, number>;
    lastEffectiveLeftColKey: string | null;
    firstEffectiveRightColKey: string | null;
    centerDockStatus: Record<string, CenterDockStatus>;
    centerLeftOffsets: Record<string, number>;
    centerRightOffsets: Record<string, number>;
    emptyColKeys?: Set<string>;
    dynamicRowHeight?: boolean;
}
export declare function buildColRenderMetas<T = any>(params: {
    columns: ColumnDef<T>[];
    colWidths: Record<string, number>;
    rowHeight: number;
    surfaceTheme: SurfaceTheme;
    columnPins: Record<string, PinPosition>;
    leftOffsets: Record<string, number>;
    rightOffsets: Record<string, number>;
    lastEffectiveLeftColKey: string | null;
    firstEffectiveRightColKey: string | null;
    centerDockStatus: Record<string, CenterDockStatus>;
    centerLeftOffsets: Record<string, number>;
    centerRightOffsets: Record<string, number>;
    emptyColKeys?: Set<string>;
    dynamicRowHeight?: boolean;
}): {
    metas: ColRenderMeta<T>[];
    totalWidth: number;
};
export declare function buildGridLayoutSnapshot<T = any>(params: {
    columns: ColumnDef<T>[];
    colWidths: Record<string, number>;
    rowHeight: number;
    surfaceTheme: SurfaceTheme;
    columnPins: Record<string, PinPosition>;
    leftOffsets: Record<string, number>;
    rightOffsets: Record<string, number>;
    lastEffectiveLeftColKey: string | null;
    firstEffectiveRightColKey: string | null;
    centerDockStatus: Record<string, CenterDockStatus>;
    centerLeftOffsets: Record<string, number>;
    centerRightOffsets: Record<string, number>;
    emptyColKeys?: Set<string>;
    dynamicRowHeight?: boolean;
}): GridLayoutSnapshot<T>;
