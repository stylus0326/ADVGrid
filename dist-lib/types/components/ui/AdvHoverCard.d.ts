import React from 'react';
export interface AdvHoverCardProps {
    trigger: React.ReactNode;
    content: React.ReactNode;
    openDelay?: number;
    closeDelay?: number;
    width?: number | string;
    theme?: string;
    className?: string;
    contentClassName?: string;
}
export declare const AdvHoverCard: React.FC<AdvHoverCardProps>;
