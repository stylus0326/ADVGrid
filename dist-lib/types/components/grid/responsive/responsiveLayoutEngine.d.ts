import { GridLayoutMode } from '../types';
export declare const GRID_BREAKPOINTS: {
    readonly PHONE: 768;
    readonly TABLET: 1024;
    readonly DEFAULT_HYSTERESIS: 16;
    readonly DEFAULT_DEBOUNCE_MS: 120;
};
export declare function resolveActiveModeWithHysteresis(width: number, currentMode: 'pc' | 'tablet' | 'phone', buffer?: number): 'pc' | 'tablet' | 'phone';
export declare function getInitialGridMode(width: number): 'pc' | 'tablet' | 'phone';
export declare function attachResponsiveLayoutObserver(params: {
    containerEl: HTMLDivElement | null;
    layoutMode: GridLayoutMode;
    debounceMs: number;
    hysteresisBuffer: number;
    currentModeRef: React.MutableRefObject<'pc' | 'tablet' | 'phone'>;
    isFirstMeasurementRef: React.MutableRefObject<boolean>;
    debounceTimerRef: React.MutableRefObject<ReturnType<typeof setTimeout> | null>;
    containerWidthRef: React.MutableRefObject<number>;
    setAutoActiveMode: (mode: 'pc' | 'tablet' | 'phone') => void;
}): () => void;
