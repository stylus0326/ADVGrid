import React from 'react';
import { SurfaceTheme } from '../grid/types';
export type FormFieldLabelPosition = 'top' | 'border';
export interface AdvFormFieldOverlayScopeProps {
    labelPosition?: FormFieldLabelPosition;
    children: React.ReactNode;
}
export declare function AdvFormFieldOverlayScope({ labelPosition, children, }: AdvFormFieldOverlayScopeProps): React.JSX.Element;
export interface AdvFormFieldProps {
    label: string;
    labelPosition?: FormFieldLabelPosition;
    required?: boolean;
    error?: React.ReactNode;
    hint?: React.ReactNode;
    htmlFor?: string;
    labelBackground?: string;
    theme?: SurfaceTheme;
    className?: string;
    labelClassName?: string;
    children: React.ReactElement<any>;
}
export declare const AdvFormField: React.FC<AdvFormFieldProps>;
export declare const FormField: React.FC<AdvFormFieldProps>;
