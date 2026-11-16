import React from 'react';
export interface AdvQuickFilterFlyoutProps {
    quickFilterText: string;
    isQuickFilterSmart: boolean;
    onToggleSmart: () => void;
    onCommitFilter: (val: string) => void;
    onClose: () => void;
    inputRef?: React.RefObject<HTMLInputElement | null>;
    embedded?: boolean;
}
export declare const AdvQuickFilterFlyout: React.NamedExoticComponent<AdvQuickFilterFlyoutProps>;
