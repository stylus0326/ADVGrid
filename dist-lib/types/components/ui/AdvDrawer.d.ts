import React from 'react';
import { SurfaceTheme } from '../grid/types';
export interface DrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    surfaceTheme?: SurfaceTheme;
    dismissible?: boolean;
    children: React.ReactNode;
}
export declare const Drawer: React.FC<DrawerProps>;
export interface DrawerPortalProps {
    children: React.ReactNode;
}
export declare const DrawerPortal: React.FC<DrawerPortalProps>;
export type DrawerOverlayProps = React.HTMLAttributes<HTMLDivElement>;
export declare const DrawerOverlay: React.FC<DrawerOverlayProps>;
export type DrawerContentProps = React.HTMLAttributes<HTMLDivElement>;
export declare const DrawerContent: React.FC<DrawerContentProps>;
export type DrawerSwipeHandleProps = React.HTMLAttributes<HTMLDivElement>;
export declare const DrawerSwipeHandle: React.FC<DrawerSwipeHandleProps>;
export type DrawerHeaderProps = React.HTMLAttributes<HTMLDivElement>;
export declare const DrawerHeader: React.FC<DrawerHeaderProps>;
export type DrawerTitleProps = React.HTMLAttributes<HTMLHeadingElement>;
export declare const DrawerTitle: React.FC<DrawerTitleProps>;
export type DrawerDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;
export declare const DrawerDescription: React.FC<DrawerDescriptionProps>;
export type DrawerBodyProps = React.HTMLAttributes<HTMLDivElement>;
export declare const DrawerBody: React.FC<DrawerBodyProps>;
export type DrawerFooterProps = React.HTMLAttributes<HTMLDivElement>;
export declare const DrawerFooter: React.FC<DrawerFooterProps>;
export type DrawerCloseProps = React.ButtonHTMLAttributes<HTMLButtonElement>;
export declare const DrawerClose: React.FC<DrawerCloseProps>;
