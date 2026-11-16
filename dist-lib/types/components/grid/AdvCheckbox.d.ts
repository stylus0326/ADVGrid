import React from 'react';
export interface AdvCheckboxProps {
    checked?: boolean;
    indeterminate?: boolean;
    disabled?: boolean;
    onChange?: (checked: boolean, event: React.MouseEvent<HTMLDivElement>) => void;
    onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
    className?: string;
    title?: string;
    style?: React.CSSProperties;
    size?: number;
    spring?: 'bouncy' | 'snappy' | 'smooth';
}
export declare const AdvCheckbox: React.FC<AdvCheckboxProps>;
