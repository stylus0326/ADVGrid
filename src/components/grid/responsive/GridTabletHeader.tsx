import React, { memo } from 'react';
import { ALIGNMENTS, ColumnDef, SurfaceTheme } from '../types';
import { AdvButton } from '../../ui/AdvButton';
import {
  compileTabletGroups,
  computeTabletTrackMinWidth,
  type CompiledTabletGroup,
} from './responsiveColumnUtils';

export interface GridTabletHeaderProps {
  surfaceTheme: SurfaceTheme;
  columns?: ColumnDef<any>[];
  compiledGroups?: CompiledTabletGroup<any>[];
  showRowNumber?: boolean;
  showSelectionCol?: boolean;
  onOpenSortFilter?: () => void;
  hasActiveFilterOrSort?: boolean;
  sortFilterLabel?: string;
}

export const GridTabletHeader = memo(({
  surfaceTheme: _surfaceTheme,
  columns = [],
  compiledGroups,
  showRowNumber = true,
  showSelectionCol = true,
  onOpenSortFilter,
  hasActiveFilterOrSort = false,
  sortFilterLabel = 'Lọc & Sắp Xếp',
}: GridTabletHeaderProps) => {
  const effectiveGroups =
    compiledGroups && compiledGroups.length > 0
      ? compiledGroups
      : compileTabletGroups(columns);
  const trackMinWidth = computeTabletTrackMinWidth(
    effectiveGroups,
    showRowNumber,
    showSelectionCol
  );

  return (
    <div
      data-agv-responsive-header="true"
      style={{
        minHeight: '44px',
        minWidth: trackMinWidth > 0 ? `${trackMinWidth}px` : undefined,
        backgroundColor: 'var(--agv-bg-header, var(--agv-bg-root))',
        borderColor: 'var(--agv-border)',
        color: 'var(--agv-text-main)',
      }}
      className="w-full flex items-center border-b px-3 py-2 text-xs font-semibold select-none shrink-0"
    >
      {(showRowNumber || showSelectionCol) && (
        <div className="w-10 shrink-0 text-center mr-2" style={{ color: 'var(--agv-text-muted)' }}>
          {showRowNumber ? '#' : ''}
        </div>
      )}

      {effectiveGroups.map((group, idx) => {
        const isFirst = idx === 0;
        const isLast = idx === effectiveGroups.length - 1;
        const padClass = isFirst ? 'pr-3' : isLast ? 'pl-3' : 'px-3';
        const alignClass =
          group.align === ALIGNMENTS.RIGHT
            ? 'justify-end text-right'
            : group.align === ALIGNMENTS.CENTER
              ? 'justify-center text-center'
              : 'justify-start text-left';

        const sizeStyle: React.CSSProperties = group.width
          ? { width: `${group.width}px` }
          : { minWidth: `${group.minWidth}px` };

        return (
          <div
            key={group.id}
            style={sizeStyle}
            className={`relative flex items-center gap-2 min-w-0 ${
              group.width ? 'shrink-0' : 'flex-1'
            } ${padClass} ${isLast && onOpenSortFilter ? 'justify-between' : alignClass}`}
          >
            {idx > 0 && (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 w-px h-4"
                style={{ backgroundColor: 'var(--agv-border)' }}
              />
            )}
            <span className="truncate">{group.header}</span>
            {isLast && onOpenSortFilter && (
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
      })}
    </div>
  );
});

GridTabletHeader.displayName = 'GridTabletHeader';
