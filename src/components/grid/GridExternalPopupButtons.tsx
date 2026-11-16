import React from 'react';
import { ArrowUpDown, Columns, GitBranch, Search } from 'lucide-react';
import { DataGridToolbarApi, GridToolbarPopupType } from './types';
import { AdvButton } from '../ui/AdvButton';

export interface GridExternalPopupButtonsProps {
  api: DataGridToolbarApi;
  className?: string;
}

interface PopupButtonSpec {
  type: GridToolbarPopupType;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  enabled: boolean;
  hasDot?: boolean;
  count?: number;
}

export const GridExternalPopupButtons = React.memo(function GridExternalPopupButtons({
  api,
  className = '',
}: GridExternalPopupButtonsProps) {
  const { state, togglePopup } = api;

  const items: PopupButtonSpec[] = [
    {
      type: 'search',
      label: 'Tìm kiếm nhanh',
      Icon: Search,
      enabled: state.enableQuickSearch,
      hasDot: state.isQuickFilterActive,
    },
    {
      type: 'queryBuilder',
      label: 'Bộ lọc truy vấn',
      Icon: GitBranch,
      enabled: state.enableQueryBuilder,
      count: state.activeQueryRuleCount,
    },
    {
      type: 'columnChooser',
      label: 'Chọn cột hiển thị',
      Icon: Columns,
      enabled: state.enableColumnChooser,
      count: state.visibleColumnCount,
    },
    {
      type: 'multiSort',
      label: 'Sắp xếp nhiều cột',
      Icon: ArrowUpDown,
      enabled: state.enableMultiSort,
      count: state.sortRuleCount,
    },
  ];

  const visibleItems = items.filter((item) => item.enabled);
  if (visibleItems.length === 0) return null;

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      {visibleItems.map((item) => {
        const isActive = state.activePopup === item.type;
        const Icon = item.Icon;
        const showCountBadge = typeof item.count === 'number' && item.count > 0;
        const showDotBadge = Boolean(item.hasDot) && !showCountBadge;

        return (
          <AdvButton
            key={item.type}
            variant="outline"
            size="icon"
            active={isActive}
            data-agv-popover-trigger="true"
            data-testid={`agv-external-popup-btn-${item.type}`}
            aria-label={item.label}
            aria-expanded={isActive}
            onClick={(e) => togglePopup(item.type, e.currentTarget)}
            className="relative select-none"
          >
            <Icon className="h-4 w-4" />

            {showDotBadge && (
              <span
                className="pointer-events-none absolute right-1 top-1 h-2 w-2 rounded-full border"
                style={{
                  backgroundColor: isActive
                    ? 'var(--agv-accent-text, #ffffff)'
                    : 'var(--agv-accent)',
                  borderColor: isActive
                    ? 'var(--agv-accent)'
                    : 'var(--agv-bg-control, var(--agv-bg-root))',
                }}
              />
            )}

            {showCountBadge && (
              <span
                className="pointer-events-none absolute -right-1.5 -top-1.5 inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-xs font-bold leading-none tabular-nums border"
                style={{
                  backgroundColor: isActive
                    ? 'var(--agv-accent-text, #ffffff)'
                    : 'var(--agv-accent)',
                  color: isActive
                    ? 'var(--agv-accent)'
                    : 'var(--agv-accent-text, #ffffff)',
                  borderColor: isActive
                    ? 'var(--agv-accent)'
                    : 'var(--agv-bg-root)',
                }}
              >
                {item.count}
              </span>
            )}
          </AdvButton>
        );
      })}
    </div>
  );
});
