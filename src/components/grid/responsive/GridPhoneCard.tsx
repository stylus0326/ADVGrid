import React, { memo } from 'react';
import { SurfaceTheme } from '../types';
import { MorphCheckbox, MorphChevronIcon } from '../../ui/MorphIcons';
import { formatGridNumber, getOrComputeMonthStats } from '../gridUtils';
import { TwelveMonthChartCell } from '../../../demo/TwelveMonthChartCell';

export interface GridPhoneCardProps<T = any> {
  row: T;
  rowIndex: number;
  rowKey: string | number;
  rowHeight: number;
  isSelected: boolean;
  isChecked: boolean;
  isExpanded?: boolean;
  showRowNumber?: boolean;
  showSelectionCol?: boolean;
  onToggleExpand?: (rowKey: string | number, rowIndex: number) => void;
  onSelectRow?: (rowIndex: number, row: any) => void;
  onToggleCheck?: (rowIndex: number, row: any, e: React.MouseEvent) => void;
  surfaceTheme: SurfaceTheme;
}

export const GridPhoneCard = memo(<T extends any>({
  row,
  rowIndex,
  rowKey,
  rowHeight = 104,
  isSelected,
  isChecked,
  isExpanded = false,
  showRowNumber = true,
  showSelectionCol = true,
  onToggleExpand,
  onSelectRow,
  onToggleCheck,
  surfaceTheme,
}: GridPhoneCardProps<T>) => {

  const r = row as any;
  const nodeTitle = r.col_node || r.node || r.title || r.name || `NODE-${1000 + (rowIndex % 9000)}`;
  const rowId = r.col_id || r.id || (typeof rowKey === 'string' && isNaN(Number(rowKey)) ? rowKey : undefined) || `ROW-${String(rowIndex + 1).padStart(6, '0')}`;
  const region = r.col_region || r.region || 'US-East';
  const status = (r.col_status || r.status || 'ONLINE').toUpperCase();
  const cpu = typeof r.col_dec_cpu === 'number' ? r.col_dec_cpu : typeof r.cpu === 'number' ? r.cpu : 45.5;
  const sla = typeof r.col_dec_sla === 'number' ? r.col_dec_sla : typeof r.sla === 'number' ? r.sla : 99.8;
  const ngaygd = r.col_date || r.ngaygd || r.date || '28/10/2026';
  const thoigian = r.col_time || r.thoigian || r.time || '15:30:00';
  const formulaVal = r.col_formula !== undefined ? r.col_formula : 78.4;

  let statusBadgeStyle: React.CSSProperties = {
    backgroundColor: 'var(--agv-bg-subtle, rgba(16, 185, 129, 0.12))',
    color: 'var(--agv-success, #10b981)',
    border: '1px solid var(--agv-border-subtle, rgba(16, 185, 129, 0.25))',
  };
  if (status === 'DEGRADED') {
    statusBadgeStyle = {
      backgroundColor: 'var(--agv-bg-subtle, rgba(245, 158, 11, 0.12))',
      color: 'var(--agv-warning, #f59e0b)',
      border: '1px solid var(--agv-border-subtle, rgba(245, 158, 11, 0.25))',
    };
  } else if (status === 'OVERLOAD') {
    statusBadgeStyle = {
      backgroundColor: 'var(--agv-bg-subtle, rgba(239, 68, 68, 0.12))',
      color: 'var(--agv-danger, #ef4444)',
      border: '1px solid var(--agv-border-subtle, rgba(239, 68, 68, 0.25))',
    };
  }

  const isCpuHigh = Number(cpu) > 70;
  const isSlaLow = Number(sla) < 98;

  // Thống kê 12 tháng chuẩn hệ thống (tái sử dụng O(1) qua WeakMap)
  const monthStats = getOrComputeMonthStats(row);

  const slotHeight = isExpanded ? rowHeight + 150 : rowHeight;
  const cardHeight = slotHeight - 8;

  return (
    <div
      style={{
        height: `${slotHeight}px`,
        maxHeight: `${slotHeight}px`,
        padding: '4px 8px',
        boxSizing: 'border-box',
      }}
      className="agv-phone-card-slot w-full shrink-0"
    >
      <article
        onClick={() => onSelectRow?.(rowIndex, row)}
        data-row-idx={rowIndex}
        data-card-focused={isSelected ? 'true' : undefined}
        data-card-checked={isChecked ? 'true' : undefined}
        style={{
          height: `${cardHeight}px`,
          maxHeight: `${cardHeight}px`,
          boxSizing: 'border-box',
        }}
        className="agv-phone-card w-full rounded-xl border px-3 py-2 text-xs select-none shadow-2xs transition-colors cursor-default flex flex-col justify-between overflow-hidden"
      >
      {/* Header của Card: Checkbox + STT + Tên + Badge Status (Gỡ bỏ avatar theo yêu cầu) */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {showSelectionCol && (
            <div onClick={(e) => e.stopPropagation()} className="shrink-0">
              <MorphCheckbox
                checked={isChecked}
                onChange={(e) => onToggleCheck?.(rowIndex, row, e)}
                size={16}
                spring="snappy"
              />
            </div>
          )}
          {showRowNumber && (
            <span
              data-cell-role="stt"
              className="text-[10px] tabular-nums font-mono font-medium px-1 rounded shrink-0 transition-colors"
              style={{
                backgroundColor: isSelected ? 'var(--agv-accent)' : 'transparent',
                color: isSelected ? 'var(--agv-accent-text, #ffffff)' : 'var(--agv-text-muted)',
              }}
            >
              {String(rowIndex + 1).padStart(2, '0')}
            </span>
          )}
          <div className="min-w-0">
            <div className="font-bold text-[13px] truncate" style={{ color: 'var(--agv-text-main)' }}>
              {nodeTitle}
            </div>
            <div className="text-[10px] font-mono truncate" style={{ color: 'var(--agv-text-muted)' }}>
              {rowId} · {region}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end shrink-0 gap-1">
          <span
            className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide"
            style={statusBadgeStyle}
          >
            {status}
          </span>
          <span className="text-[10px]" style={{ color: 'var(--agv-text-muted)' }}>
            {ngaygd}
          </span>
        </div>
      </div>

      {/* Dòng Tóm tắt Chỉ số (Key Metrics Summary) */}
      <div
        className="mt-1 pt-1.5 border-t flex items-center justify-between tabular-nums text-[11px]"
        style={{ borderColor: 'var(--agv-border)' }}
      >
        <div className="flex items-center gap-2">
          <span style={{ color: isCpuHigh ? 'var(--agv-warning)' : 'var(--agv-text-muted)' }}>
            CPU: <b className="font-semibold">{Number(cpu).toFixed(1)}%</b>
          </span>
          <span style={{ color: 'var(--agv-border)' }}>·</span>
          <span style={{ color: isSlaLow ? 'var(--agv-danger)' : 'var(--agv-text-muted)' }}>
            SLA: <b className="font-semibold">{Number(sla).toFixed(2)}%</b>
          </span>
          <span style={{ color: 'var(--agv-border)' }}>·</span>
          <span style={{ color: 'var(--agv-text-main)' }}>
            AVG: <b className="font-semibold text-[var(--agv-accent)]">{formatGridNumber(formulaVal)}</b>
          </span>
        </div>

        {/* Nút bấm mở rộng chi tiết dạng Accordion */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleExpand?.(rowKey, rowIndex);
          }}
          className="p-1 rounded-md transition-colors hover:bg-[var(--agv-bg-hover)] cursor-pointer"
          style={{ color: 'var(--agv-text-muted)' }}
          aria-label={isExpanded ? 'Thu gọn' : 'Xem chi tiết'}
        >
          <MorphChevronIcon expanded={isExpanded} size={16} spring="snappy" />
        </button>
      </div>

      {/* Phần Mở Rộng Chi Tiết (Accordion Drawer) - Chiều cao cố định chính xác 150px (height 140px + marginTop 10px) */}
      {isExpanded && (
        <div
          style={{
            height: '140px',
            maxHeight: '140px',
            marginTop: '10px',
            boxSizing: 'border-box',
            borderColor: 'var(--agv-border)',
          }}
          className="pt-2 border-t flex flex-col justify-between text-[11px] overflow-hidden"
        >
          {/* Khối Biểu đồ 12T dạng Thẻ tài chính 2 Cột (Financial Card Layout) */}
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider mb-1" style={{ color: 'var(--agv-text-muted)' }}>
              Biểu đồ biến thiên 12 tháng:
            </div>
            <div
              className="p-2 rounded-xl border flex items-center gap-2.5 overflow-hidden"
              style={{
                backgroundColor: 'var(--agv-bg-subtle, var(--agv-bg-root))',
                borderColor: 'var(--agv-border)',
              }}
            >
              {/* Cột trái: Sóng Catmull-Rom spline uốn lượn sâu (cao 48px) */}
              <div className="flex-1 min-w-0 h-[48px] flex items-center">
                <TwelveMonthChartCell
                  values={monthStats.mVals}
                  minIdx={monthStats.minIdx}
                  maxIdx={monthStats.maxIdx}
                  minVal={monthStats.minVal}
                  maxVal={monthStats.maxVal}
                  avgVal={monthStats.avgVal}
                  surfaceTheme={surfaceTheme}
                  height={48}
                />
              </div>

              {/* Vạch ngăn cách dọc nhẹ giữa 2 cột */}
              <div className="w-[1px] h-[44px] shrink-0" style={{ backgroundColor: 'var(--agv-border)' }} />

              {/* Cột phải: Bảng số liệu tóm tắt xếp tầng dọc gọn gàng */}
              <div className="w-[140px] shrink-0 flex flex-col justify-center gap-1 text-[11px] tabular-nums">
                <div className="truncate">
                  <span style={{ color: 'var(--agv-text-muted)' }}>Cao nhất: </span>
                  <b className="font-semibold" style={{ color: 'var(--agv-trend-up)' }}>
                    {monthStats.maxVal.toFixed(1)}%
                  </b>
                  <span className="text-[10px] ml-1 font-mono" style={{ color: 'var(--agv-text-muted)' }}>
                    (T{String(monthStats.maxIdx + 1).padStart(2, '0')})
                  </span>
                </div>
                <div className="truncate">
                  <span style={{ color: 'var(--agv-text-muted)' }}>Thấp nhất: </span>
                  <b className="font-semibold" style={{ color: 'var(--agv-trend-down)' }}>
                    {monthStats.minVal.toFixed(1)}%
                  </b>
                  <span className="text-[10px] ml-1 font-mono" style={{ color: 'var(--agv-text-muted)' }}>
                    (T{String(monthStats.minIdx + 1).padStart(2, '0')})
                  </span>
                </div>
                <div className="truncate text-[10px]" style={{ color: 'var(--agv-text-muted)' }}>
                  <span>Trung bình: </span>
                  <b className="font-semibold" style={{ color: 'var(--agv-text-main)' }}>
                    {monthStats.avgVal.toFixed(1)}%
                  </b>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 border-t" style={{ borderColor: 'var(--agv-border)' }}>
            <div>
              <span className="text-[10px]" style={{ color: 'var(--agv-text-muted)' }}>Thời gian GD:</span>
              <div className="font-mono font-semibold" style={{ color: 'var(--agv-text-main)' }}>{thoigian}</div>
            </div>
            <div>
              <span className="text-[10px]" style={{ color: 'var(--agv-text-muted)' }}>Khu vực máy chủ:</span>
              <div className="font-semibold" style={{ color: 'var(--agv-text-main)' }}>{region}</div>
            </div>
          </div>
        </div>
      )}
    </article>
    </div>
  );
});

GridPhoneCard.displayName = 'GridPhoneCard';
