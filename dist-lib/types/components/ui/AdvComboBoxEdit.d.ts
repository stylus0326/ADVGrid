import React from 'react';
import { ControlVariant } from './controlFocus';
export interface AdvComboBoxEditOption {
    value: string;
    label: string;
}
export interface AdvComboBoxEditProps {
    id?: string;
    value?: string;
    defaultValue?: string;
    onChange?: (val: string) => void;
    options?: (string | AdvComboBoxEditOption)[];
    allowCustomInput?: boolean;
    defaultOpen?: boolean;
    autoFocus?: boolean;
    placeholder?: string;
    size?: 'sm' | 'md';
    variant?: ControlVariant;
    leadingIcon?: React.ReactNode;
    disabled?: boolean;
    className?: string;
    style?: React.CSSProperties;
    theme?: string;
    onClose?: () => void;
    invalid?: boolean;
    'aria-invalid'?: React.AriaAttributes['aria-invalid'];
    'aria-describedby'?: string;
    'aria-errormessage'?: string;
}
export declare const AdvComboBoxEdit: React.FC<AdvComboBoxEditProps>;
export default AdvComboBoxEdit;
