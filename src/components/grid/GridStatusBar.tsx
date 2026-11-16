import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AdvSelect } from '../ui/AdvSelect';
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE_SIZE_OPTIONS,
  NO_AUTOFILL_PROPS,
} from './constants';
import { CONTROL_INPUT_SM_CLASS } from '../ui/controlFocus';
import { AdvButton } from '../ui/AdvButton';
import { SURFACE_THEMES, SurfaceTheme } from './types';

export interface GridStatusBarProps {
  page?: number;
  pageSize?: number;
  totalItems: number;
  pageSizeOptions?: readonly number[];
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  surfaceTheme?: SurfaceTheme;
  disabled?: boolean;
}

export const GridStatusBar: React.FC<GridStatusBarProps> = React.memo(({
  page = 1,
  pageSize = DEFAULT_PAGE_SIZE,
  totalItems,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  onPageChange,
  onPageSizeChange,
  surfaceTheme = SURFACE_THEMES.LIGHT,
  disabled = false,
}) => {
  const safePageSize =
    Number.isFinite(pageSize) && pageSize > 0 ? Math.floor(pageSize) : DEFAULT_PAGE_SIZE;
  const safeTotalItems =
    Number.isFinite(totalItems) && totalItems > 0 ? Math.floor(totalItems) : 0;
  const totalPages = safeTotalItems > 0 ? Math.max(1, Math.ceil(safeTotalItems / safePageSize)) : 0;
  const currentPage =
    safeTotalItems > 0 ? Math.min(Math.max(1, Math.floor(page || 1)), totalPages) : 0;

  const startItem = safeTotalItems > 0 ? (currentPage - 1) * safePageSize + 1 : 0;
  const endItem = safeTotalItems > 0 ? Math.min(safeTotalItems, currentPage * safePageSize) : 0;

  const [draftPage, setDraftPage] = useState<string>(() =>
    safeTotalItems > 0 ? String(currentPage) : '0'
  );

  useEffect(() => {
    setDraftPage(safeTotalItems > 0 ? String(currentPage) : '0');
  }, [currentPage, safeTotalItems]);

  const selectOptions = useMemo(() => {
    const merged = Array.from(
      new Set(
        [...pageSizeOptions, safePageSize].filter(
          (val) => Number.isFinite(val) && val > 0
        )
      )
    );
    return merged.map((val) => String(val));
  }, [pageSizeOptions, safePageSize]);

  const commitDraftPage = useCallback(() => {
    if (!onPageChange || safeTotalItems <= 0 || totalPages <= 0) {
      setDraftPage(safeTotalItems > 0 ? String(currentPage) : '0');
      return;
    }

    const parsed = Number.parseInt(draftPage.trim(), 10);
    if (!Number.isFinite(parsed)) {
      setDraftPage(String(currentPage));
      return;
    }

    const clamped = Math.min(Math.max(1, parsed), totalPages);
    setDraftPage(String(clamped));
    if (clamped !== currentPage) {
      onPageChange(clamped);
    }
  }, [onPageChange, safeTotalItems, totalPages, draftPage, currentPage]);

  const handlePageSizeSelect = useCallback(
    (val: string) => {
      const nextSize = Number.parseInt(val, 10);
      if (Number.isFinite(nextSize) && nextSize > 0 && nextSize !== safePageSize) {
        onPageSizeChange?.(nextSize);
      }
    },
    [onPageSizeChange, safePageSize]
  );

  const canGoPrev = !disabled && safeTotalItems > 0 && currentPage > 1 && Boolean(onPageChange);
  const canGoNext =
    !disabled && safeTotalItems > 0 && currentPage < totalPages && Boolean(onPageChange);

  return (
    <footer
      data-testid="agv-status-bar"
      className="border-t px-3 py-2 text-xs flex flex-wrap items-center justify-between gap-2 shrink-0 select-none transition-colors"
      style={{
        backgroundColor: 'var(--agv-bg-header)',
        borderColor: 'var(--agv-border)',
        color: 'var(--agv-text-muted)',
      }}
    >
      <div className="flex items-center gap-1">
        <AdvSelect
          value={String(safePageSize)}
          options={selectOptions}
          onChange={handlePageSizeSelect}
          size="sm"
          width={72}
          theme={surfaceTheme}
          disabled={disabled || !onPageSizeChange}
        />

        <AdvButton
          variant="ghost"
          size="icon-sm"
          data-testid="agv-pager-prev"
          aria-label="Trang trước"
          disabled={!canGoPrev}
          onClick={() => onPageChange?.(Math.max(1, currentPage - 1))}
        >
          <ChevronLeft size={15} strokeWidth={2} />
        </AdvButton>

        <input
          type="text"
          inputMode="numeric"
          data-testid="agv-pager-input"
          aria-label="Số trang"
          value={draftPage}
          disabled={disabled || safeTotalItems <= 0}
          onChange={(e) => setDraftPage(e.target.value.replace(/\D+/g, ''))}
          onFocus={(e) => e.currentTarget.select()}
          onBlur={commitDraftPage}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              commitDraftPage();
              e.currentTarget.blur();
            } else if (e.key === 'Escape') {
              e.preventDefault();
              setDraftPage(safeTotalItems > 0 ? String(currentPage) : '0');
              e.currentTarget.blur();
            }
          }}
          {...NO_AUTOFILL_PROPS}
          className={`${CONTROL_INPUT_SM_CLASS} w-11 px-1 text-center font-medium tabular-nums`}
        />

        <span
          data-testid="agv-pager-total-pages"
          className="text-xs font-semibold tabular-nums text-[var(--agv-text-main)] whitespace-nowrap px-1"
        >
          / {totalPages}
        </span>

        <AdvButton
          variant="ghost"
          size="icon-sm"
          data-testid="agv-pager-next"
          aria-label="Trang sau"
          disabled={!canGoNext}
          onClick={() => onPageChange?.(Math.min(totalPages, currentPage + 1))}
        >
          <ChevronRight size={15} strokeWidth={2} />
        </AdvButton>
      </div>

      <div
        data-testid="agv-pager-range"
        className="text-xs tabular-nums whitespace-nowrap text-[var(--agv-text-muted)]"
      >
        {safeTotalItems > 0 ? `${startItem}-${endItem} / ` : '0 / '}
        <strong className="font-semibold text-[var(--agv-accent)]">{safeTotalItems}</strong>
      </div>
    </footer>
  );
});

GridStatusBar.displayName = 'GridStatusBar';
