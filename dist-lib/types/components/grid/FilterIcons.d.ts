import React from 'react';
import { FilterOperation } from './types';
interface IconProps {
    className?: string;
    size?: number;
}
export declare const RangeArrowSeparator: React.FC<{
    className?: string;
    size?: number;
}>;
export declare const IconOpEquals: React.FC<IconProps>;
export declare const IconOpNotEquals: React.FC<IconProps>;
export declare const IconOpContains: React.FC<IconProps>;
export declare const IconOpNotContains: React.FC<IconProps>;
export declare const IconOpStartsWith: React.FC<IconProps>;
export declare const IconOpEndsWith: React.FC<IconProps>;
export declare const IconOpBetween: React.FC<IconProps>;
export declare const IconOpGreaterThan: React.FC<IconProps>;
export declare const IconOpGreaterEqual: React.FC<IconProps>;
export declare const IconOpLessThan: React.FC<IconProps>;
export declare const IconOpLessEqual: React.FC<IconProps>;
export declare const IconOpPositive: React.FC<IconProps>;
export declare const IconOpNegative: React.FC<IconProps>;
export declare const IconOpBlank: React.FC<IconProps>;
export declare const IconOpNotBlank: React.FC<IconProps>;
export declare const FILTER_OP_META: Record<FilterOperation, {
    label: string;
    icon: React.FC<IconProps>;
    noInput?: boolean;
}>;
export declare const ALLOWED_OPS_BY_TYPE: Record<string, FilterOperation[]>;
import { DEFAULT_OP_BY_TYPE, getColumnFilterType, getDefaultFilterOpForColumn } from './gridFormatUtils';
export { DEFAULT_OP_BY_TYPE, getColumnFilterType, getDefaultFilterOpForColumn, };
export declare const FilterOpIcon: React.FC<{
    op: FilterOperation;
    className?: string;
    size?: number;
}>;
export declare function getAllowedFilterOpsForColumn(colKey: string, columns?: Array<{
    key: string;
    dataType?: string;
}>, hasColumnEmptyCells?: (colKey: string) => boolean): FilterOperation[];
