import React from 'react';
export declare function getDistinctColumnValues(colKey: string, data: any[], dType: string | undefined, cacheRef?: React.MutableRefObject<Record<string, {
    values: string[];
    hasBlanks: boolean;
}>>, getRowItem?: (idx: number) => any, totalRowCount?: number, getCellValue?: (rowIndex: number, colKey: string) => any): {
    values: string[];
    hasBlanks: boolean;
};
export interface AdvChecklistVirtualListProps {
    items: any[];
    selectedSet: Set<any>;
    onToggle: (val: any) => void;
    formatDisplay: (colKey: string, val: any) => string;
    colKey: string;
    showBlanksInList: boolean;
}
export declare const AdvChecklistVirtualList: React.FC<AdvChecklistVirtualListProps>;
export interface AdvChecklistFilterPopupRef {
    open: (colKey: string, coords: {
        top: number;
        left: number;
        bottom?: number;
        isFlipUp?: boolean;
        anchorEl?: HTMLElement | null;
    }, curFilter: any) => void;
    close: () => void;
    updateCoords: (coords: {
        top: number;
        left: number;
        bottom?: number;
        isFlipUp?: boolean;
        anchorEl?: HTMLElement | null;
    }) => void;
    isOpen: () => boolean;
    isOpenFor: (colKey: string) => boolean;
    getActiveCol: () => string | null;
}
export interface AdvChecklistFilterPopupProps {
    data?: any[];
    getRowItem?: (idx: number) => any;
    totalRowCount?: number;
    getCellValue?: (rowIndex: number, colKey: string) => any;
    getDistinctValues?: (colKey: string) => {
        values: string[];
        hasBlanks: boolean;
    };
    columnDataTypes?: Record<string, string>;
    distinctValuesCacheRef?: React.MutableRefObject<Record<string, {
        values: string[];
        hasBlanks: boolean;
    }>>;
    surfaceTheme?: string;
    portalRoot?: HTMLElement | null;
    formatChecklistDisplay?: (colKey: string, val: any) => string;
    matchFilterValue?: (cellVal: any, op: any, targetVal: string, dataType: string, filterObj?: any) => boolean;
    onApply: (colKey: string, selected: Set<any>, includeBlanks: boolean) => void;
    onClear: (colKey: string) => void;
    onActiveColChange?: (colKey: string | null) => void;
}
export declare const AdvChecklistFilterPopup: React.ForwardRefExoticComponent<AdvChecklistFilterPopupProps & React.RefAttributes<AdvChecklistFilterPopupRef>>;
