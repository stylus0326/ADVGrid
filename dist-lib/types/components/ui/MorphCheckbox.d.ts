import React from 'react';
export interface MorphCheckboxProps {
    checked?: boolean;
    indeterminate?: boolean;
    onChange?: (e: React.MouseEvent<HTMLDivElement>) => void;
    onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
    size?: number;
    className?: string;
    spring?: 'bouncy' | 'snappy' | 'smooth';
    disabled?: boolean;
    title?: string;
    style?: React.CSSProperties;
}
export declare const MorphCheckbox: React.FC<MorphCheckboxProps>;
