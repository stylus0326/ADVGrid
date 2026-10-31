import React, { memo } from 'react';
import { SurfaceTheme } from '../types';

export interface GridTabletHeaderProps {
  surfaceTheme: SurfaceTheme;
  showRowNumber?: boolean;
  showSelectionCol?: boolean;
  onOpenSortFilter?: () => void;
  hasActiveFilterOrSort?: boolean;
}

export const GridTabletHeader = memo(({
  surfaceTheme: _surfaceTheme,
  showRowNumber = true,
  showSelectionCol = true,
  onOpenSortFilter,
  hasActiveFilterOrSort = false,
}: GridTabletHeaderProps) => {
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
      {(showRowNumber || showSelectionCol) && (
        <div className="w-10 shrink-0 text-center mr-2" style={{ color: 'var(--agv-text-muted)' }}>
          {showRowNumber ? 'TT' : ''}
        </div>
      )}
      <div className="flex-1 min-w-[180px] pr-3">
        Thông tin Node
      </div>
      <div className="flex-1 min-w-[160px] pr-3">
        Đo lường & Khu vực
      </div>
      <div className="w-[140px] shrink-0 pr-3">
        Biểu đồ 12T & AVG
      </div>
      <div className="w-[150px] shrink-0 text-right flex items-center justify-end gap-2">
        <span>Trạng thái</span>
        {onOpenSortFilter && (
          <button
            type="button"
            onClick={onOpenSortFilter}
            className="min-h-[28px] px-2 py-0.5 rounded border text-[10px] font-semibold cursor-pointer transition-colors uppercase tracking-normal"
            style={{
              backgroundColor: hasActiveFilterOrSort ? 'var(--agv-accent)' : 'var(--agv-bg-root)',
              color: hasActiveFilterOrSort ? 'var(--agv-accent-text, #ffffff)' : 'var(--agv-text-main)',
              borderColor: 'var(--agv-border)',
            }}
          >
            Lọc & Sắp Xếp
          </button>
        )}
      </div>
    </div>
  );
});

GridTabletHeader.displayName = 'GridTabletHeader';
