import React from 'react';
import './queryBuilder.css';
import { ColumnDef, SurfaceTheme } from '../types';
import { QueryGroup } from './types';
import { getColumnFilterType } from '../FilterIcons';
export interface AdvGridQueryBuilderModalProps<T = any> {
    isOpen: boolean;
    onClose: () => void;
    gridId?: string;
    columns: ColumnDef<any>[];
    appliedTree: QueryGroup | null;
    onApply: (tree: QueryGroup | null) => void;
    totalFilteredRows: number;
    totalRowCount: number;
    surfaceTheme?: SurfaceTheme;
    data?: T[];
    getCellValue?: (rowIndex: number, colKey: string) => any;
    hasColumnEmptyCells?: (colKey: string) => boolean;
    getColumnDateBounds?: (colKey: string) => {
        min: string;
        max: string;
    };
    style?: React.CSSProperties;
    embedded?: boolean;
}
export declare const getColType: typeof getColumnFilterType;
export interface QuerySelectOption {
    value: string;
    label: string;
    icon?: React.ReactNode;
}
export interface QueryCustomSelectProps {
    value: string;
    options: QuerySelectOption[];
    onChange: (val: string) => void;
    className?: string;
    minWidth?: number;
    popupMinWidth?: number;
    theme?: string;
    showSearch?: boolean;
    iconOnly?: boolean;
}
export declare const QueryCustomSelect: React.NamedExoticComponent<QueryCustomSelectProps>;
export declare const AdvGridQueryBuilderModal: React.MemoExoticComponent<(<T = any>({ isOpen, onClose, gridId, columns, appliedTree, onApply, totalRowCount, surfaceTheme, data, getCellValue, hasColumnEmptyCells, getColumnDateBounds, style, embedded, }: AdvGridQueryBuilderModalProps<T>) => React.JSX.Element | null)>;
