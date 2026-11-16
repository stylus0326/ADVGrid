import React from 'react';
import { GridTheme } from '../../../themes';
export interface AdvDateRangePickerProps {
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
    preset?: string;
    showPreset?: boolean;
    dualMonth?: boolean;
    showTime?: boolean;
    autoFocus?: boolean;
    defaultOpen?: boolean;
    onClose?: () => void;
    allowClear?: boolean;
    className?: string;
}
export declare const AdvDateRangePicker: React.NamedExoticComponent<AdvDateRangePickerProps>;
