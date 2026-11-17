import React from 'react';

export interface ListPagePanelProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Cho phép panel co giãn hết chiều cao còn lại cho bảng ảo hóa (mặc định true) */
  fillHeight?: boolean;
}

/**
 * Panel thẻ bề mặt `bg-card` đặt trên nền `bg-background`, đồng bộ `ListPagePanel` của `b2b-pnt`.
 */
export const ListPagePanel: React.FC<ListPagePanelProps> = ({
  children,
  className = '',
  fillHeight = true,
  ...rest
}) => {
  return (
    <div
      className={`agv-list-page-panel border-y bg-card text-card-foreground sm:rounded-xl sm:border sm:shadow-sm ${
        fillHeight ? 'flex-1 flex flex-col min-h-0 overflow-hidden' : ''
      } ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
};
