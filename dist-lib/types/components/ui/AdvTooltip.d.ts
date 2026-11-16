import React from 'react';
export interface AdvTooltipProps {
    content: React.ReactNode;
    children: React.ReactNode;
    delay?: number;
    placement?: 'top' | 'bottom' | 'auto';
    theme?: string;
    disabled?: boolean;
    className?: string;
}
export declare const AdvTooltip: React.FC<AdvTooltipProps>;
