import React from 'react';
export interface GridDetailRowProps<T = any> {
    row: T;
    rowIndex: number;
    rowKey: string | number;
    totalRowWidth: number;
    renderDetailRow?: (row: T) => React.ReactNode;
}
export declare const GridDetailRow: <T = any>(props: GridDetailRowProps<T>) => React.ReactElement | null;
