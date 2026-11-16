import { RefObject } from 'react';
interface UseInCellEditorParams {
    controlledEditingCell?: {
        rowIndex: number;
        colKey: string;
    } | null;
    onStartEditCell?: (rowIndex: number, colKey: string) => void;
    onEndEditCell?: () => void;
    scrollContainerRef: RefObject<HTMLDivElement | null>;
}
export declare function useInCellEditor({ controlledEditingCell, onStartEditCell, onEndEditCell, scrollContainerRef, }: UseInCellEditorParams): {
    activeEditingCell: {
        rowIndex: number;
        colKey: string;
    } | null;
    handleStartEditCell: (rowIndex: number, colKey: string) => void;
    handleEndEditCell: () => void;
    lockedScrollPosRef: RefObject<{
        top: number;
        left: number;
    } | null>;
};
export {};
