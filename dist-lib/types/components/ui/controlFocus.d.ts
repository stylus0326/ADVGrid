export type ControlSize = 'sm' | 'md';
export type ControlVariant = 'default' | 'auth';
export type ButtonVariant = 'default' | 'outline' | 'ghost' | 'destructive';
export type ButtonSize = 'sm' | 'default' | 'md' | 'icon-sm' | 'icon';
export declare const CONTROL_FOCUS_CLASS = "outline-none";
export declare const CONTROL_HOVER_CLASS = "";
export declare const CONTROL_POPUP_OPEN_CLASS = "";
export declare const BUTTON_FOCUS_VISIBLE_CLASS = "agv-focus-ring";
export declare const CONTROL_SURFACE_CLASS = "agv-control";
export declare const CONTROL_BOX_CLASS = "agv-control agv-control-box";
export declare const CONTROL_SIZE_CLASS: Record<ControlSize, string>;
export declare const getControlSizeClass: (size?: ControlSize) => string;
export interface ControlSurfaceClassesOptions {
    size?: ControlSize;
    variant?: ControlVariant;
    box?: boolean;
    defaultRadiusClass?: string;
    className?: string;
}
export declare function getControlSurfaceClasses({ size, variant, box, defaultRadiusClass, className, }?: ControlSurfaceClassesOptions): string;
export declare const CONTROL_INPUT_MD_CLASS: string;
export declare const CONTROL_INPUT_SM_CLASS: string;
export declare const CONTROL_BOX_MD_CLASS: string;
export declare const CONTROL_BOX_SM_CLASS: string;
export declare const CONTROL_TEXTAREA_CLASS = "agv-control p-2 text-xs placeholder:text-muted-foreground";
export interface ButtonVariantsOptions {
    variant?: ButtonVariant;
    size?: ButtonSize;
    active?: boolean;
    className?: string;
}
export declare function getButtonClass({ variant, size, active, className, }?: ButtonVariantsOptions): string;
export declare const buttonVariants: typeof getButtonClass;
export declare const CONTROL_BUTTON_OUTLINE_MD_CLASS: string;
export declare const CONTROL_BUTTON_OUTLINE_SM_CLASS: string;
export declare const CONTROL_ICON_BUTTON_OUTLINE_SM_CLASS: string;
export declare const CONTROL_BUTTON_PRIMARY_MD_CLASS: string;
export declare const CONTROL_BUTTON_PRIMARY_SM_CLASS: string;
export declare const CONTROL_BUTTON_GHOST_MD_CLASS: string;
export declare const CONTROL_BUTTON_GHOST_SM_CLASS: string;
export declare const CONTROL_ICON_BUTTON_GHOST_SM_CLASS: string;
export declare const CONTROL_BUTTON_DESTRUCTIVE_MD_CLASS: string;
export declare const CONTROL_BUTTON_DESTRUCTIVE_SM_CLASS: string;
export declare const CONTROL_ICON_BUTTON_DESTRUCTIVE_SM_CLASS: string;
export declare const POPUP_PANEL_CLASS = "agv-popup-panel rounded-md border border-border bg-popover text-popover-foreground";
export declare const POPUP_MENU_CLASS = "agv-popup-panel agv-popup-menu rounded-md border border-border bg-popover text-popover-foreground";
export declare const POPUP_ITEM_CLASS = "agv-popup-item";
