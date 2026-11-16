import React from 'react';
import './columnChooser.css';
import { ColumnDef, BaseGroupDef, PinPosition, SurfaceTheme } from '../types';
export interface AdvColumnChooserModalProps<T = any> {
    columns: ColumnDef<any>[];
    columnGroups?: BaseGroupDef[];
    visibleColKeys: string[];
    onVisibleColKeysChange: (keys: string[]) => void;
    columnPins?: Record<string, PinPosition>;
    onColumnPinChange?: (colKey: string, pin: PinPosition) => void;
    onResetColumns: () => void;
    onAutoFitColumn?: (colKey: string) => void;
    onReorderColumns?: (sourceKey: string, targetKey: string) => void;
    enableColumnHide?: boolean;
    onClose?: () => void;
    style?: React.CSSProperties;
    surfaceTheme?: SurfaceTheme;
    embedded?: boolean;
}
export interface ColumnTreeNode {
    key?: string;
    title: string;
    children?: ColumnTreeNode[];
    dataType?: string;
    defaultWidth?: number;
    isAtomicGroup?: boolean;
    atomicKeys?: string[];
}
export declare const AdvColumnChooserModal: React.MemoExoticComponent<(<T = any>({ columns, columnGroups, visibleColKeys, onVisibleColKeysChange, columnPins, onColumnPinChange, onResetColumns, onAutoFitColumn, onReorderColumns, enableColumnHide, onClose: _onClose, style, embedded, }: AdvColumnChooserModalProps<T>) => React.JSX.Element)>;
