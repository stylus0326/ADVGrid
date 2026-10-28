import React from 'react';
import { SortConfig, SORT_DIRECTIONS } from '../components/grid/types';

export interface PageFooterProps {
  totalRows: number;
  columnCount: number;
  leftPinnedCount: number;
  centerPinnedCount: number;
  rightPinnedCount: number;
  sortConfig: SortConfig | null;
  sortTitle?: string;
  visibleChunkCount: number;
  groupByColumnKey?: string | null;
  groupTitle?: string;
  totalGroupCount?: number;
  expandedGroupCount?: number;
  displayedRowCount?: number;
  checkedRowCount?: number;
}

export const PageFooter: React.FC<PageFooterProps> = ({
  totalRows,
  columnCount,
  leftPinnedCount,
  centerPinnedCount,
  rightPinnedCount,
  sortConfig,
  sortTitle,
  visibleChunkCount,
  groupByColumnKey,
  groupTitle,
  totalGroupCount = 0,
  expandedGroupCount = 0,
  displayedRowCount,
  checkedRowCount = 0,
}) => {
  return (
    <footer
      className="border-t px-4 py-2 text-[11px] flex flex-wrap items-center justify-between gap-2 shrink-0 select-none transition-colors"
      style={{
        backgroundColor: 'var(--agv-bg-header)',
        borderColor: 'var(--agv-border)',
        color: 'var(--agv-text-muted)',
      }}
    >
      <div className="flex items-center gap-4">
        {groupByColumnKey ? (
          <span>
            Gom nhóm ({groupTitle || groupByColumnKey}):{' '}
            <strong className="text-[var(--agv-warning)] font-bold">
              {totalGroupCount} Nhóm
            </strong>{' '}
            <span className="text-[10px] text-[var(--agv-text-muted)]">
              ({expandedGroupCount} mở • {totalGroupCount - expandedGroupCount} đóng)
            </span>
            {' • '}
            <strong style={{ color: 'var(--agv-text-main)' }}>
              {totalRows.toLocaleString('vi-VN')} dòng
            </strong>
            {displayedRowCount !== undefined && (
              <span className="text-[10px] text-[var(--agv-text-muted)]">
                {' '}(Hiển thị: {displayedRowCount.toLocaleString('vi-VN')} mục)
              </span>
            )}
          </span>
        ) : (
          <span>
            Kích thước:{' '}
            <strong style={{ color: 'var(--agv-text-main)' }}>
              {totalRows.toLocaleString('vi-VN')} dòng × {columnCount} cột
            </strong>
          </span>
        )}
        <span>
          Ghim:{' '}
          <strong className="text-[var(--agv-accent)] font-bold">{leftPinnedCount} Trái</strong> •{' '}
          <strong className="text-[var(--agv-accent)] font-bold">{centerPinnedCount} Giữa</strong> •{' '}
          <strong className="text-[var(--agv-accent)] font-bold">{rightPinnedCount} Phải</strong>
        </span>
        {sortConfig && (
          <span>
            Sắp xếp:{' '}
            <strong className="text-[var(--agv-success)] font-bold">
              {sortTitle || sortConfig.key} (
              {sortConfig.direction === SORT_DIRECTIONS.ASC ? 'Tăng dần' : 'Giảm dần'})
            </strong>
          </span>
        )}
        <span>
          Đã chọn:{' '}
          <strong style={{ color: 'var(--agv-text-main)' }}>
            {checkedRowCount.toLocaleString('vi-VN')} dòng
          </strong>
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span>
          Đang vẽ <strong style={{ color: 'var(--agv-accent)' }}>{visibleChunkCount} Chunks</strong>
        </span>
      </div>
    </footer>
  );
};
