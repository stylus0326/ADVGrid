export interface UseGridCrossHoverOptions {
    enabled: boolean;
    highlightHeader?: boolean;
    isResponsiveMode?: boolean;
    isPopupLockActive?: boolean;
    scrollContainerRef: React.RefObject<HTMLDivElement | null>;
    visibleVersion?: number | string;
}
export declare function useGridCrossHover({ enabled, highlightHeader, isResponsiveMode, isPopupLockActive, scrollContainerRef, visibleVersion, }: UseGridCrossHoverOptions): void;
