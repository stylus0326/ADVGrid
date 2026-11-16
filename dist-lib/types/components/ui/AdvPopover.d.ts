import React from 'react';
export type AdvPopoverPlacement = 'bottom' | 'bottom-start' | 'bottom-end' | 'top' | 'top-start' | 'top-end' | 'auto';
export interface AdvPopoverVirtualAnchor {
    left: number;
    top: number;
    right?: number;
    bottom?: number;
    width?: number;
    height?: number;
}
export declare const DEFAULT_POPOVER_IGNORE_SELECTORS = ".agv-select-portal, .agv-portal-dropdown, .agv-calendar-popover, .agv-daterange-popover, .agv-preset-dropdown-menu, .agv-floating-popup, .agv-multi-filter-popup, .agv-multi-filter-op-menu, .agv-query-dropdown, .agv-lookup-op-menu";
export interface AdvAnchoredPopoverProps {
    isOpen: boolean;
    anchorEl?: HTMLElement | null;
    virtualAnchor?: AdvPopoverVirtualAnchor | null;
    onClose: () => void;
    children: React.ReactNode;
    placement?: AdvPopoverPlacement;
    showArrow?: boolean;
    offset?: number;
    theme?: string;
    width?: number | string;
    minWidth?: number;
    maxWidth?: string;
    paddingClassName?: string;
    contentClassName?: string;
    zIndex?: number;
    ignoreClickOutsideSelectors?: string;
}
export declare const AdvAnchoredPopover: React.FC<AdvAnchoredPopoverProps>;
export interface AdvPopoverProps {
    trigger: React.ReactNode;
    content: React.ReactNode | ((props: {
        close: () => void;
    }) => React.ReactNode);
    isOpen?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    placement?: AdvPopoverPlacement;
    showArrow?: boolean;
    offset?: number;
    theme?: string;
    className?: string;
    contentClassName?: string;
    width?: number | string;
    minWidth?: number;
}
export declare const AdvPopover: React.FC<AdvPopoverProps>;
