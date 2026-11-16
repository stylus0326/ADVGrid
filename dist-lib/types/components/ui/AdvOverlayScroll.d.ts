import React from 'react';
export interface AdvOverlayScrollProps {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    viewportClassName?: string;
    viewportStyle?: React.CSSProperties;
    viewportRef?: React.Ref<HTMLDivElement>;
    onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
    onViewportMouseMove?: React.MouseEventHandler<HTMLDivElement>;
    scrollX?: boolean;
    trackTopInset?: number;
    trackBottomInset?: number;
    alwaysShow?: boolean;
    contentSignature?: unknown;
}
export declare const AdvOverlayScroll: React.FC<AdvOverlayScrollProps>;
export default AdvOverlayScroll;
