import React from 'react';
import { ColumnDef, ColumnFilterValue } from './types';
export interface AdvMultiFilterPopupProps {
    isOpen: boolean;
    onClose: () => void;
    anchorEl?: HTMLElement | null;
    anchorRect?: {
        top: number;
        left: number;
        bottom: number;
        right: number;
        width?: number;
        height?: number;
    } | null;
    column: ColumnDef<any>;
    currentFilter?: ColumnFilterValue;
    onApply: (colKey: string, filter: ColumnFilterValue) => void;
    onClear: (colKey: string) => void;
    hasColumnEmptyCells?: (colKey: string) => boolean;
    getColumnDateBounds?: (colKey: string) => {
        min: string;
        max: string;
    };
    surfaceTheme?: string;
}
export declare const AdvMultiFilterPopup: React.FC<AdvMultiFilterPopupProps>;
