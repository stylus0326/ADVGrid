import React from 'react';
import { FilterOperation } from './types';
export declare const NumberRangeFilterInput: React.FC<{
    from: string;
    to: string;
    onChange: (from: string, to: string) => void;
    onFocus?: () => void;
    onBlur?: () => void;
    onClear?: () => void;
    hasValue?: boolean;
}>;
export declare const SmartNumberFilterInput: React.FC<{
    value: string;
    onChange: (val: string, opOverride?: FilterOperation) => void;
    onFocus?: () => void;
    onBlur?: () => void;
    onClear?: () => void;
    placeholder?: string;
    hasValue?: boolean;
    isHighlightPlaceholder?: boolean;
}>;
