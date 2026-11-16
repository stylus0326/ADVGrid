import React from 'react';
import { ButtonSize, ButtonVariant } from './controlFocus';
export type { ButtonVariant, ButtonSize } from './controlFocus';
export { getButtonClass, buttonVariants } from './controlFocus';
export interface AdvButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    active?: boolean;
}
export declare const AdvButton: React.ForwardRefExoticComponent<AdvButtonProps & React.RefAttributes<HTMLButtonElement>>;
export declare const Button: React.ForwardRefExoticComponent<AdvButtonProps & React.RefAttributes<HTMLButtonElement>>;
