import React, { memo } from 'react';
import { ColumnDef, SurfaceTheme } from '../types';
import { AdvButton } from '../../ui/AdvButton';
import { GridTabletHeader } from './GridTabletHeader';
import {
  compileTabletGroups,
  computeTabletTrackMinWidth,
  type CompiledTabletGroup,
} from './responsiveColumnUtils';

export interface GridResponsiveHeaderProps {
  activeMode: 'tablet' | 'phone';
  surfaceTheme: SurfaceTheme;
  columns?: ColumnDef<any>[];
  compiledTabletGroups?: CompiledTabletGroup<any>[];
  showRowNumber?: boolean;
  showSelectionCol?: boolean;
  totalRows: number;
  onOpenSortFilter?: () => void;
  hasActiveFilterOrSort?: boolean;
  sortFilterLabel?: string;
}

export const GridResponsiveHeader = memo(({
  activeMode,
  surfaceTheme,
  columns = [],
  compiledTabletGroups,
  showRowNumber = true,
  showSelectionCol = true,
  totalRows,
  onOpenSortFilter,
  hasActiveFilterOrSort = false,
  sortFilterLabel = 'Lọc & Sắp Xếp',
}: GridResponsiveHeaderProps) => {
  if (activeMode === 'tablet') {
    const effectiveGroups =
      compiledTabletGroups && compiledTabletGroups.length > 0
        ? compiledTabletGroups
        : compileTabletGroups(columns);
    const trackMinWidth = computeTabletTrackMinWidth(
      effectiveGroups,
      showRowNumber,
      showSelectionCol
    );
    return (
      <div
        className="sticky top-0 z-30 w-full"
        style={{
          minWidth: trackMinWidth > 0 ? `${trackMinWidth}px` : undefined,
        }}
      >
        <GridTabletHeader
          surfaceTheme={surfaceTheme}
          columns={columns}
          compiledGroups={effectiveGroups}
          showRowNumber={showRowNumber}
          showSelectionCol={showSelectionCol}
          onOpenSortFilter={onOpenSortFilter}
          hasActiveFilterOrSort={hasActiveFilterOrSort}
          sortFilterLabel={sortFilterLabel}
        />
      </div>
    );
  }

  return (
    <div
      className="sticky top-0 z-30 min-h-[44px] px-3 py-2 border-b flex items-center justify-between gap-2 text-xs font-semibold select-none"
      style={{
        backgroundColor: 'var(--agv-bg-header, var(--agv-bg-root))',
        borderColor: 'var(--agv-border)',
        color: 'var(--agv-text-main)',
      }}
    >
      <span>Tổng số: {totalRows.toLocaleString('vi-VN')} dòng</span>
      {onOpenSortFilter && (
        <AdvButton
          variant="outline"
          size="sm"
          active={hasActiveFilterOrSort}
          onClick={onOpenSortFilter}
          className="font-semibold"
        >
          {sortFilterLabel}
        </AdvButton>
      )}
    </div>
  );
});

GridResponsiveHeader.displayName = 'GridResponsiveHeader';
