import React from 'react';
import { GridTheme } from '../../../themes';
export interface AdvDatePresetSelectProps {
    value?: string;
    defaultOpen?: boolean;
    onSelect?: (presetId: string, isMulti?: boolean) => void;
    dateAnalysis?: any;
    label?: string;
    theme?: GridTheme;
    size?: 'xs' | 'sm' | 'default' | 'md';
    hideClear?: boolean;
    min?: string;
    max?: string;
    minYear?: number;
    maxYear?: number;
}
export declare const AdvDatePresetSelect: React.NamedExoticComponent<AdvDatePresetSelectProps>;
