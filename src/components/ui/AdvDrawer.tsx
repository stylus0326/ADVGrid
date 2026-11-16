import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { getPortalThemeVars, getThemeClass } from './enterpriseEditorUtils';
import { SurfaceTheme } from '../grid/types';

type DrawerPhase = 'closed' | 'entering' | 'open' | 'closing';

interface DrawerContextValue {
  open: boolean;
  phase: DrawerPhase;
  dragY: number;
  isDragging: boolean;
  dismissible: boolean;
  surfaceTheme?: SurfaceTheme;
  titleId: string;
  descriptionId: string;
  hasDescription: boolean;
  setHasDescription: (present: boolean) => void;
  contentRef: React.RefObject<HTMLDivElement | null>;
  requestClose: () => void;
  setDragState: (dragging: boolean, y: number) => void;
}

const DrawerContext = createContext<DrawerContextValue | null>(null);

function useDrawerContext(componentName: string): DrawerContextValue {
  const ctx = useContext(DrawerContext);
  if (!ctx) {
    throw new Error(`${componentName} must be used inside <Drawer>.`);
  }
  return ctx;
}

const CHILD_POPUP_SELECTOR =
  '.agv-comboboxedit-dropdown, .agv-searchlookupedit-dropdown, .agv-calendar-popover, .agv-daterange-popover, .agv-preset-dropdown-menu';

export interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  surfaceTheme?: SurfaceTheme;
  dismissible?: boolean;
  children: React.ReactNode;
}

/**
 * Primitive Drawer theo chuẩn shadcn/ui (base/drawer) & kích thước responsive b2b-pnt:
 * Trượt từ đáy màn hình lên (max 90dvh, Phone 100% / Tablet max-w-lg), vuốt xuống để đóng,
 * nhấn nền tối hoặc Escape để đóng, tự động khóa cuộn Grid thông qua data-agv-popup="true".
 */
export const Drawer: React.FC<DrawerProps> = ({
  open,
  onOpenChange,
  surfaceTheme,
  dismissible = true,
  children,
}) => {
  const [phase, setPhase] = useState<DrawerPhase>(open ? 'entering' : 'closed');
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [hasDescription, setHasDescription] = useState(false);

  const titleId = useId();
  const descriptionId = useId();
  const contentRef = useRef<HTMLDivElement | null>(null);
  const onOpenChangeRef = useRef(onOpenChange);
  onOpenChangeRef.current = onOpenChange;

  const requestClose = useCallback(() => {
    if (!dismissible) return;
    onOpenChangeRef.current(false);
  }, [dismissible]);

  const setDragState = useCallback((dragging: boolean, y: number) => {
    setIsDragging(dragging);
    setDragY(y);
  }, []);

  useLayoutEffect(() => {
    let raf1 = 0;
    let raf2 = 0;
    let closeTimer = 0;

    if (open) {
      setIsDragging(false);
      setDragY(0);
      setPhase('entering');
      raf1 = window.requestAnimationFrame(() => {
        raf2 = window.requestAnimationFrame(() => {
          setPhase('open');
        });
      });
    } else {
      setPhase((prev) => {
        if (prev === 'closed') return 'closed';
        return 'closing';
      });
      setIsDragging(false);
      closeTimer = window.setTimeout(() => {
        setPhase('closed');
        setDragY(0);
        setIsDragging(false);
      }, 250);
    }

    return () => {
      if (raf1) window.cancelAnimationFrame(raf1);
      if (raf2) window.cancelAnimationFrame(raf2);
      if (closeTimer) window.clearTimeout(closeTimer);
    };
  }, [open]);

  // Đóng Drawer bằng phím Escape (nhường cho portal combobox/calendar con nếu đang mở)
  useEffect(() => {
    if (!open || !dismissible) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || e.defaultPrevented) return;
      if (document.querySelector(CHILD_POPUP_SELECTOR)) return;
      e.preventDefault();
      requestClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, dismissible, requestClose]);

  const contextValue = useMemo<DrawerContextValue>(
    () => ({
      open,
      phase,
      dragY,
      isDragging,
      dismissible,
      surfaceTheme,
      titleId,
      descriptionId,
      hasDescription,
      setHasDescription,
      contentRef,
      requestClose,
      setDragState,
    }),
    [
      open,
      phase,
      dragY,
      isDragging,
      dismissible,
      surfaceTheme,
      titleId,
      descriptionId,
      hasDescription,
      requestClose,
      setDragState,
    ]
  );

  if (!open && phase === 'closed') return null;

  return <DrawerContext.Provider value={contextValue}>{children}</DrawerContext.Provider>;
};

export interface DrawerPortalProps {
  children: React.ReactNode;
}

export const DrawerPortal: React.FC<DrawerPortalProps> = ({ children }) => {
  const { open, phase, surfaceTheme } = useDrawerContext('DrawerPortal');
  if (typeof document === 'undefined') return null;
  if (!open && phase === 'closed') return null;

  const themeClass = surfaceTheme ? getThemeClass(surfaceTheme) : '';
  const portalClass = [
    open ? 'agv-drawer-portal' : 'pointer-events-none',
    'fixed inset-0 z-[10000] select-none',
    themeClass,
  ]
    .filter(Boolean)
    .join(' ');

  return createPortal(
    <div
      data-slot="drawer-portal"
      data-theme={surfaceTheme || undefined}
      data-agv-popup={open ? 'true' : undefined}
      className={portalClass}
      style={getPortalThemeVars(surfaceTheme)}
    >
      {children}
    </div>,
    document.body
  );
};

export type DrawerOverlayProps = React.HTMLAttributes<HTMLDivElement>;

export const DrawerOverlay: React.FC<DrawerOverlayProps> = ({
  className = '',
  style,
  onClick,
  onPointerDownCapture,
  ...props
}) => {
  const { open, phase, dragY, isDragging, dismissible, contentRef, requestClose } =
    useDrawerContext('DrawerOverlay');
  const hadChildPopupOnDownRef = useRef(false);

  let backdropOpacity = 0;
  if (open && phase === 'open') {
    const sheetH = contentRef.current?.offsetHeight || 360;
    backdropOpacity = dragY > 0 ? Math.max(0, 1 - Math.min(1, dragY / sheetH)) : 1;
  }

  return (
    <div
      data-slot="drawer-overlay"
      aria-hidden="true"
      className={`fixed inset-0 ${className}`.trim()}
      style={{
        backgroundColor: 'var(--agv-backdrop-bg)',
        opacity: backdropOpacity,
        transition: isDragging ? 'none' : 'opacity 240ms cubic-bezier(0.32, 0.72, 0, 1)',
        ...style,
      }}
      onPointerDownCapture={(e) => {
        onPointerDownCapture?.(e);
        hadChildPopupOnDownRef.current = Boolean(document.querySelector(CHILD_POPUP_SELECTOR));
      }}
      onClick={(e) => {
        onClick?.(e);
        if (hadChildPopupOnDownRef.current) {
          hadChildPopupOnDownRef.current = false;
          return;
        }
        if (!e.defaultPrevented && e.target === e.currentTarget && dismissible) {
          requestClose();
        }
      }}
      {...props}
    />
  );
};

interface DragSession {
  pointerId: number;
  startX: number;
  startY: number;
  lastY: number;
  lastTime: number;
  vy: number;
  fromBody: boolean;
  active: boolean;
}

export type DrawerContentProps = React.HTMLAttributes<HTMLDivElement>;

export const DrawerContent: React.FC<DrawerContentProps> = ({
  className = '',
  style,
  children,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
  onClick,
  ...props
}) => {
  const {
    open,
    phase,
    dragY,
    isDragging,
    dismissible,
    titleId,
    descriptionId,
    hasDescription,
    contentRef,
    requestClose,
    setDragState,
  } = useDrawerContext('DrawerContent');

  const dragSessionRef = useRef<DragSession | null>(null);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    onPointerDown?.(e);
    if (e.defaultPrevented || !open || !dismissible || e.button !== 0 || e.isPrimary === false) {
      dragSessionRef.current = null;
      return;
    }

    const target = e.target instanceof Element ? e.target : null;
    if (!target) {
      dragSessionRef.current = null;
      return;
    }

    const isInteractiveTarget = Boolean(
      target.closest(
        'input, textarea, select, button, a, [role="tab"], [role="listbox"], [role="radiogroup"], [role="radio"], .agv-control, .agv-comboboxedit-wrapper, .agv-datepicker-container, .agv-daterange-picker-wrap'
      )
    );
    const inHandleOrHeader = Boolean(
      !isInteractiveTarget &&
        target.closest('[data-slot="drawer-swipe-handle"], [data-slot="drawer-header"]')
    );
    const bodyEl = target.closest<HTMLElement>('[data-slot="drawer-body"]');
    const inScrollTopBody = Boolean(
      !inHandleOrHeader && bodyEl && bodyEl.scrollTop <= 1 && !isInteractiveTarget
    );

    if (!inHandleOrHeader && !inScrollTopBody) {
      dragSessionRef.current = null;
      return;
    }

    dragSessionRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      lastY: e.clientY,
      lastTime: performance.now(),
      vy: 0,
      fromBody: inScrollTopBody,
      active: false,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    onPointerMove?.(e);
    const session = dragSessionRef.current;
    if (!session || session.pointerId !== e.pointerId) return;

    const dx = e.clientX - session.startX;
    const dy = e.clientY - session.startY;

    if (!session.active) {
      if (session.fromBody && dy < -6) {
        dragSessionRef.current = null;
        return;
      }
      if (Math.abs(dx) > 6 && Math.abs(dx) >= Math.abs(dy)) {
        dragSessionRef.current = null;
        return;
      }
      if (dy > 6 && dy > Math.abs(dx)) {
        session.active = true;
        session.lastY = e.clientY;
        session.lastTime = performance.now();
        try {
          e.currentTarget.setPointerCapture?.(e.pointerId);
        } catch {
          // Synthetic pointer events may not have active capture registration
        }
        setDragState(true, dy);
      }
      return;
    }

    const now = performance.now();
    const dt = Math.max(1, now - session.lastTime);
    session.vy = (e.clientY - session.lastY) / dt;
    session.lastY = e.clientY;
    session.lastTime = now;
    setDragState(true, Math.max(0, dy));
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    onPointerUp?.(e);
    try {
      if (e.currentTarget.hasPointerCapture?.(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Ignore capture cleanup errors
    }

    const session = dragSessionRef.current;
    dragSessionRef.current = null;
    if (!session || session.pointerId !== e.pointerId || !session.active) return;

    const finalDragY = Math.max(0, e.clientY - session.startY);
    const sheetHeight = contentRef.current?.offsetHeight || 360;
    const shouldClose =
      finalDragY >= Math.min(96, sheetHeight * 0.28) || (session.vy > 0.55 && finalDragY >= 28);

    if (shouldClose) {
      setDragState(false, finalDragY);
      requestClose();
    } else {
      setDragState(false, 0);
    }
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    onPointerCancel?.(e);
    try {
      if (e.currentTarget.hasPointerCapture?.(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Ignore capture cleanup errors
    }
    const session = dragSessionRef.current;
    dragSessionRef.current = null;
    if (session?.active) {
      setDragState(false, 0);
    }
  };

  let currentTransform = 'translate3d(0, 100%, 0)';
  if (open && phase === 'open') {
    currentTransform = dragY > 0 ? `translate3d(0, ${Math.round(dragY)}px, 0)` : 'translate3d(0, 0, 0)';
  }

  return (
    <DrawerPortal>
      <DrawerOverlay />
      <div className="fixed inset-0 pointer-events-none flex items-end justify-center">
        <div
          ref={contentRef}
          data-slot="drawer-content"
          data-state={open ? 'open' : 'closed'}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={hasDescription ? descriptionId : undefined}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          onClick={(e) => {
            onClick?.(e);
            e.stopPropagation();
          }}
          style={{
            backgroundColor: 'var(--popup-background)',
            borderColor: 'var(--popup-border)',
            color: 'var(--popover-foreground)',
            boxShadow: 'var(--popup-shadow)',
            transform: currentTransform,
            transition: isDragging
              ? 'none'
              : open
              ? 'transform 320ms cubic-bezier(0.32, 0.72, 0, 1)'
              : 'transform 240ms cubic-bezier(0.32, 0.72, 0, 1)',
            ...style,
          }}
          className={`agv-drawer-content pointer-events-auto relative flex flex-col w-full max-w-none md:mx-auto md:max-w-lg h-auto min-h-[132px] max-h-[min(90dvh,calc(100dvh-var(--safe-area-top,0px)))] rounded-t-xl border-t md:border-x overflow-hidden outline-none ${className}`.trim()}
          {...props}
        >
          {children}
        </div>
      </div>
    </DrawerPortal>
  );
};

export type DrawerSwipeHandleProps = React.HTMLAttributes<HTMLDivElement>;

export const DrawerSwipeHandle: React.FC<DrawerSwipeHandleProps> = ({
  className = '',
  style,
  ...props
}) => (
  <div
    data-slot="drawer-swipe-handle"
    aria-hidden="true"
    className={`mx-auto mt-3 h-1 w-12 shrink-0 rounded-full touch-none cursor-grab active:cursor-grabbing ${className}`.trim()}
    style={{
      backgroundColor: 'color-mix(in srgb, var(--muted-foreground) 30%, transparent)',
      ...style,
    }}
    {...props}
  />
);

export type DrawerHeaderProps = React.HTMLAttributes<HTMLDivElement>;

export const DrawerHeader: React.FC<DrawerHeaderProps> = ({
  className = '',
  style,
  ...props
}) => (
  <div
    data-slot="drawer-header"
    className={`shrink-0 px-4 sm:px-5 py-3 border-b text-center touch-none ${className}`.trim()}
    style={{
      borderColor: 'var(--agv-border)',
      ...style,
    }}
    {...props}
  />
);

export type DrawerTitleProps = React.HTMLAttributes<HTMLHeadingElement>;

export const DrawerTitle: React.FC<DrawerTitleProps> = ({
  className = '',
  id,
  ...props
}) => {
  const { titleId } = useDrawerContext('DrawerTitle');
  return (
    <h3
      id={id ?? titleId}
      data-slot="drawer-title"
      className={`text-xs font-bold uppercase tracking-wider text-foreground ${className}`.trim()}
      {...props}
    />
  );
};

export type DrawerDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

export const DrawerDescription: React.FC<DrawerDescriptionProps> = ({
  className = '',
  id,
  ...props
}) => {
  const { descriptionId, setHasDescription } = useDrawerContext('DrawerDescription');

  useLayoutEffect(() => {
    setHasDescription(true);
    return () => setHasDescription(false);
  }, [setHasDescription]);

  return (
    <p
      id={id ?? descriptionId}
      data-slot="drawer-description"
      className={`text-xs mt-1 text-muted-foreground ${className}`.trim()}
      {...props}
    />
  );
};

export type DrawerBodyProps = React.HTMLAttributes<HTMLDivElement>;

export const DrawerBody: React.FC<DrawerBodyProps> = ({
  className = '',
  ...props
}) => (
  <div
    data-slot="drawer-body"
    className={`min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 sm:px-5 space-y-4 text-xs ${className}`.trim()}
    {...props}
  />
);

export type DrawerFooterProps = React.HTMLAttributes<HTMLDivElement>;

export const DrawerFooter: React.FC<DrawerFooterProps> = ({
  className = '',
  style,
  ...props
}) => (
  <div
    data-slot="drawer-footer"
    className={`mt-auto shrink-0 grid grid-cols-2 gap-2 px-4 sm:px-5 pt-3 pb-[calc(0.75rem+var(--safe-area-bottom,0px))] border-t ${className}`.trim()}
    style={{
      backgroundColor: 'var(--popup-background)',
      borderColor: 'var(--agv-border)',
      ...style,
    }}
    {...props}
  />
);

export type DrawerCloseProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const DrawerClose: React.FC<DrawerCloseProps> = ({
  type = 'button',
  onClick,
  ...props
}) => {
  const { requestClose } = useDrawerContext('DrawerClose');
  return (
    <button
      type={type}
      data-slot="drawer-close"
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented) {
          requestClose();
        }
      }}
      {...props}
    />
  );
};
