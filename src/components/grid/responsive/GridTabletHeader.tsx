import React, { memo } from 'react';
import { SurfaceTheme } from '../types';

export interface GridTabletHeaderProps {
  surfaceTheme: SurfaceTheme;
}

export const GridTabletHeader = memo(({ surfaceTheme: _surfaceTheme }: GridTabletHeaderProps) => {
  return (
    <div
      style={{
        height: '34px',
        backgroundColor: 'var(--agv-bg-header, var(--agv-bg-root))',
        borderColor: 'var(--agv-border)',
        color: 'var(--agv-text-main)',
      }}
      className="flex items-center border-b px-3 text-[11px] font-bold uppercase tracking-wider select-none shrink-0"
    >
      <div className="w-10 shrink-0 text-center mr-2" style={{ color: 'var(--agv-text-muted)' }}>
        TT
      </div>
      <div className="flex-1 min-w-[190px] pr-3">
        Thông tin Node
      </div>
      <div className="flex-1 min-w-[170px] pr-3">
        Đo lường & Khu vực
      </div>
      <div className="w-[150px] shrink-0 pr-3">
        Biểu đồ 12T & AVG
      </div>
      <div className="w-[120px] shrink-0 text-right">
        Trạng thái
      </div>
    </div>
  );
});

GridTabletHeader.displayName = 'GridTabletHeader';
