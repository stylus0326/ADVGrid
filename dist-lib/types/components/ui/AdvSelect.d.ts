import React from 'react';
export interface AdvSelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}
export interface AdvSelectProps {
    value?: string;
    defaultValue?: string;
    onChange?: (val: string) => void;
    options: (string | AdvSelectOption)[];
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    style?: React.CSSProperties;
    theme?: string;
    size?: 'sm' | 'md';
    width?: number | string;
}
export declare const AdvSelect: React.FC<AdvSelectProps>;
