import React from 'react';
import { type ControlVariant } from '../controlFocus';
import { GridTheme } from '../../../themes';
export interface AdvDateRangePickerProps {
    id?: string;
    from?: string;
    to?: string;
    onChange?: (range: {
        from: string;
        to: string;
        preset?: string;
    }) => void;
    min?: string;
    max?: string;
    placeholderFrom?: string;
    placeholderTo?: string;
    theme?: GridTheme;
    dateAnalysis?: any;
    bounds?: any;
    size?: 'xs' | 'sm' | 'default' | 'md';
    variant?: ControlVariant;
    leadingIcon?: React.ReactNode;
    preset?: string;
    showPreset?: boolean;
    dualMonth?: boolean;
    showTime?: boolean;
    autoFocus?: boolean;
    defaultOpen?: boolean;
    onClose?: () => void;
    allowClear?: boolean;
    className?: string;
    invalid?: boolean;
    'aria-invalid'?: React.AriaAttributes['aria-invalid'];
    'aria-describedby'?: string;
    'aria-errormessage'?: string;
}
export declare const AdvDateRangePicker: React.NamedExoticComponent<AdvDateRangePickerProps>;
