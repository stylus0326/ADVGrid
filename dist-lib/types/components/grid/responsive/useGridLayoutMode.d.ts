import { GridLayoutMode } from '../types';
export interface UseGridLayoutModeOptions {
    enabled?: boolean;
    layoutMode?: GridLayoutMode;
    containerRef: React.RefObject<HTMLDivElement | null>;
    debounceMs?: number;
    hysteresisBuffer?: number;
}
export interface UseGridLayoutModeResult {
    activeMode: 'pc' | 'tablet' | 'phone';
    containerWidthRef: React.MutableRefObject<number>;
}
export declare function useGridLayoutMode({ enabled, layoutMode, containerRef, debounceMs, hysteresisBuffer, }: UseGridLayoutModeOptions): UseGridLayoutModeResult;
