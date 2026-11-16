import React from 'react';
import { getThemeClass, GridTheme, SURFACE_THEMES } from '../../themes';
export { getThemeClass, SURFACE_THEMES };
export type { GridTheme };
export declare function getPortalThemeVars(_theme?: string, _isDark?: boolean): React.CSSProperties;
export interface EditorCoords {
    top: number;
    bottom?: number;
    left: number;
    width: number;
    maxHeight: number;
    isFlipUp?: boolean;
}
export declare function computeEditorCoords(triggerEl: HTMLElement | null, preferredHeight?: number, minWidth?: number): EditorCoords;
export declare function areEditorCoordsEqual(a: Partial<EditorCoords> | null | undefined, b: Partial<EditorCoords> | null | undefined): boolean;
export declare function computeDropdownPageStep(containerHeight: number, itemHeight?: number, fallbackStep?: number): number;
export declare function computeNextHighlightedIndex(key: string, currentIndex: number, totalCount: number, pageStep?: number): number | null;
export declare function scrollDropdownItemIntoView(container: HTMLElement | null, itemEl: HTMLElement | null, topInsetPx?: number, bottomInsetPx?: number): void;
export declare function useClickOutside(isOpen: boolean, onClose: () => void, onUpdateCoords?: () => void, triggerRef?: React.RefObject<HTMLElement | null>, popupRef?: React.RefObject<HTMLElement | null>, secondaryPopupRef?: React.RefObject<HTMLElement | null>, ignoreSelector?: string): void;
export declare function normalizeSearchText(str: string): string;
