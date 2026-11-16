import React from 'react';
export declare function isAnyPopupActive(): boolean;
interface UseGridPopupLockParams {
    containerRef: React.RefObject<HTMLDivElement | null>;
    scrollContainerRef: React.RefObject<HTMLDivElement | null>;
    lastScrollTopRef: React.RefObject<number>;
    lastScrollLeftRef: React.RefObject<number>;
    activeContextMenu: any;
    isSortFilterModalOpen: boolean;
    activeEditingCell: any;
}
export declare function useGridPopupLock({ containerRef, scrollContainerRef, lastScrollTopRef, lastScrollLeftRef, activeContextMenu, isSortFilterModalOpen, activeEditingCell, }: UseGridPopupLockParams): {
    isToolbarPopupOpen: boolean;
    setIsToolbarPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isPopupLockActive: boolean;
    popupLockedScrollPosRef: React.RefObject<{
        top: number;
        left: number;
    } | null>;
    suppressNextGridClickRef: React.RefObject<boolean>;
    handleContainerMouseDownCapture: (e: React.MouseEvent<HTMLDivElement>) => void;
    handleContainerSuppressClickCapture: (e: React.MouseEvent<HTMLDivElement>) => void;
    handleContainerContextMenuCapture: (e: React.MouseEvent<HTMLDivElement>) => void;
};
export {};
