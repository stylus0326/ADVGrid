import React from 'react';
import { FilterOperation, ColumnAlign } from '../grid/types';
export type LookUpFilterOp = FilterOperation;
export interface LookUpColumnFilterState {
    val: string;
    op: LookUpFilterOp;
}
export declare const LOOKUP_FILTER_OPERATORS: {
    id: LookUpFilterOp;
    label: string;
}[];
export interface AdvLookUpColumn<T = any> {
    key: keyof T | string;
    title: string;
    width?: number | string;
    align?: ColumnAlign;
    className?: string;
}
export interface AdvSearchLookUpEditProps<T = any> {
    value?: any;
    defaultValue?: any;
    onChange?: (val: any, itemOrItems?: any) => void;
    dataSource?: T[];
    valueMember: keyof T | string;
    displayMember: keyof T | string;
    columns: AdvLookUpColumn<T>[];
    placeholder?: string;
    size?: 'sm' | 'md';
    disabled?: boolean;
    dropdownWidth?: number;
    className?: string;
    style?: React.CSSProperties;
    theme?: string;
    searchPlaceholder?: string;
    searchFields?: (keyof T | string)[];
    showFooterCount?: boolean;
    showFilterRow?: boolean;
    multiSelect?: boolean;
    defaultOpen?: boolean;
    autoFocus?: boolean;
    onClose?: () => void;
}
export declare function AdvSearchLookUpEdit<T extends Record<string, any> = any>({ value, defaultValue, onChange, dataSource, valueMember, displayMember, columns, placeholder, size, disabled, dropdownWidth, className, style, theme, searchPlaceholder, searchFields, showFooterCount, showFilterRow, multiSelect, defaultOpen, autoFocus, onClose, }: AdvSearchLookUpEditProps<T>): React.JSX.Element;
export default AdvSearchLookUpEdit;
