import React from 'react';
export declare const TimeRangeFilterInput: React.FC<{
    from: string;
    to: string;
    onChange: (from: string, to: string) => void;
    onFocus?: () => void;
    onBlur?: () => void;
    onClear?: () => void;
    hasValue?: boolean;
}>;
export declare const TimeFilterInput: React.FC<{
    value: string;
    onChange: (val: string) => void;
    onFocus?: () => void;
    onBlur?: () => void;
    onClear?: () => void;
    placeholder?: string;
    hasValue?: boolean;
}>;
