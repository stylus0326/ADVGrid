export interface UseGridOverlayScrollbarOptions {
    overlayHostRef: React.RefObject<HTMLDivElement | null>;
    scrollContainerRef: React.RefObject<HTMLDivElement | null>;
    alwaysShow?: boolean;
    isWindowScroll: boolean;
    verticalTrackTopInset: number;
    isLockedRef: React.MutableRefObject<boolean>;
    totalContentHeight: number;
    totalGridWidth: number;
    viewportHeight: number;
}
export interface UseGridOverlayScrollbarResult {
    vBarRef: React.RefObject<HTMLDivElement | null>;
    vThumbRef: React.RefObject<HTMLDivElement | null>;
    hBarRef: React.RefObject<HTMLDivElement | null>;
    hThumbRef: React.RefObject<HTMLDivElement | null>;
    notifyScroll: () => void;
    syncScrollbars: () => void;
    hostInteractionProps: {
        onMouseEnter: () => void;
        onMouseLeave: () => void;
        onTouchStart: () => void;
    };
    onVerticalTrackMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
    onHorizontalTrackMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
    onVerticalThumbPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
    onHorizontalThumbPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
}
export declare function useGridOverlayScrollbar({ overlayHostRef, scrollContainerRef, alwaysShow, isWindowScroll, verticalTrackTopInset, isLockedRef, totalContentHeight, totalGridWidth, viewportHeight, }: UseGridOverlayScrollbarOptions): UseGridOverlayScrollbarResult;
