import React from 'react';
export interface AdvComboBoxEditOption {
    value: string;
    label: string;
}
export interface AdvComboBoxEditProps {
    value?: string;
    defaultValue?: string;
    onChange?: (val: string) => void;
    options?: (string | AdvComboBoxEditOption)[];
    allowCustomInput?: boolean;
    defaultOpen?: boolean;
    autoFocus?: boolean;
    placeholder?: string;
    size?: 'sm' | 'md';
    disabled?: boolean;
    className?: string;
    style?: React.CSSProperties;
    theme?: string;
    onClose?: () => void;
}
export declare const AdvComboBoxEdit: React.FC<AdvComboBoxEditProps>;
export default AdvComboBoxEdit;
