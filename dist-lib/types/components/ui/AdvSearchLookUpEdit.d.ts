import React from 'react';
import { FilterOperation, ColumnAlign } from '../grid/types';
import { ControlVariant } from './controlFocus';
export type LookUpFilterOp = FilterOperation;
export type AdvLookUpSelectionMode = 'row' | 'cell';
export interface AdvLookUpSelectedCell<T = any> {
    row: T;
    rowKey: string | number;
    colKey: keyof T | string;
    value: any;
}
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
    id?: string;
    value?: any;
    defaultValue?: any;
    onChange?: (val: any, itemOrItems?: any) => void;
    dataSource?: T[];
    valueMember: keyof T | string;
    displayMember: keyof T | string;
    columns: AdvLookUpColumn<T>[];
    placeholder?: string;
    size?: 'sm' | 'md';
    variant?: ControlVariant;
    leadingIcon?: React.ReactNode;
    disabled?: boolean;
    dropdownWidth?: number;
    className?: string;
    style?: React.CSSProperties;
    theme?: string;
    invalid?: boolean;
    'aria-invalid'?: React.AriaAttributes['aria-invalid'];
    'aria-describedby'?: string;
    'aria-errormessage'?: string;
    searchPlaceholder?: string;
    searchFields?: (keyof T | string)[];
    showFooterCount?: boolean;
    showFilterRow?: boolean;
    selectionMode?: AdvLookUpSelectionMode;
    multiSelect?: boolean;
    defaultOpen?: boolean;
    autoFocus?: boolean;
    onClose?: () => void;
}
export declare function AdvSearchLookUpEdit<T extends Record<string, any> = any>({ id, value, defaultValue, onChange, dataSource, valueMember, displayMember, columns, placeholder, size, variant, leadingIcon, disabled, dropdownWidth, className, style, theme, invalid, 'aria-invalid': ariaInvalidProp, 'aria-describedby': ariaDescribedBy, 'aria-errormessage': ariaErrorMessage, searchPlaceholder, searchFields, showFooterCount, showFilterRow, selectionMode, multiSelect, defaultOpen, autoFocus, onClose, }: AdvSearchLookUpEditProps<T>): React.JSX.Element;
export default AdvSearchLookUpEdit;
