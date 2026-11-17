import React from 'react';
import { ControlVariant } from './controlFocus';
export interface AdvSelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}
export interface AdvSelectProps {
    id?: string;
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
    variant?: ControlVariant;
    leadingIcon?: React.ReactNode;
    width?: number | string;
    invalid?: boolean;
    'aria-invalid'?: React.AriaAttributes['aria-invalid'];
    'aria-describedby'?: string;
    'aria-errormessage'?: string;
}
export declare const AdvSelect: React.FC<AdvSelectProps>;
