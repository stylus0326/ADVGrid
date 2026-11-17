import React from 'react';
import { ControlSize, ControlVariant } from './controlFocus';
export interface AdvInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
    size?: ControlSize;
    variant?: ControlVariant;
    leadingIcon?: React.ReactNode;
    endAdornment?: React.ReactNode;
    allowAutofill?: boolean;
    invalid?: boolean;
    containerClassName?: string;
}
export declare const AdvInput: React.ForwardRefExoticComponent<AdvInputProps & React.RefAttributes<HTMLInputElement>>;
