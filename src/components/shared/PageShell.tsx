import React from 'react';

export interface PageShellProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Khóa chiều cao theo viewport để DataGrid ảo hóa cuộn mượt (mặc định true) */
  viewportLocked?: boolean;
}

/**
 * Khung trang nền `bg-background` đồng bộ theo `b2b-pnt` PageShell.
 */
export const PageShell: React.FC<PageShellProps> = ({
  children,
  className = '',
  viewportLocked = true,
  ...rest
}) => {
  return (
    <div
      className={`relative z-10 w-full bg-background text-foreground ${
        viewportLocked
          ? 'flex-1 flex flex-col min-h-0 px-0 sm:px-4 sm:py-3 overflow-hidden'
          : 'px-0 sm:px-4 py-3 space-y-4'
      } ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
};
