import React, { memo } from 'react';
import { SurfaceTheme } from '../types';
import { MorphCheckbox } from '../../ui/MorphIcons';
import { formatGridNumber, getOrComputeMonthStats } from '../gridUtils';
import { TwelveMonthChartCell } from '../../../demo/TwelveMonthChartCell';

export interface GridTabletRowProps<T = any> {
  row: T;
  rowIndex: number;
  rowKey: string | number;
  rowHeight: number;
  isSelected: boolean;
  isChecked: boolean;
  showRowNumber?: boolean;
  showSelectionCol?: boolean;
  onSelectRow?: (rowIndex: number, row: any) => void;
  onToggleCheck?: (rowIndex: number, row: any, e: React.MouseEvent) => void;
  surfaceTheme: SurfaceTheme;
  renderCell?: (params: any) => React.ReactNode;
}

export const GridTabletRow = memo(<T extends any>({
  row,
  rowIndex,
  rowKey,
  rowHeight,
  isSelected,
  isChecked,
  showRowNumber = true,
  showSelectionCol = true,
  onSelectRow,
  onToggleCheck,
  surfaceTheme,
}: GridTabletRowProps<T>) => {
  const isEven = rowIndex % 2 === 0;

  // Trích xuất dữ liệu thân thiện
  const r = row as any;
  const nodeTitle = r.col_node || r.node || r.title || r.name || `NODE-${1000 + (rowIndex % 9000)}`;
  const rowId = r.col_id || r.id || (typeof rowKey === 'string' && isNaN(Number(rowKey)) ? rowKey : undefined) || `ROW-${String(rowIndex + 1).padStart(6, '0')}`;
  const region = r.col_region || r.region || 'US-East';
  const status = (r.col_status || r.status || 'ONLINE').toUpperCase();
  const cpu = typeof r.col_dec_cpu === 'number' ? r.col_dec_cpu : typeof r.cpu === 'number' ? r.cpu : 45.5;
  const sla = typeof r.col_dec_sla === 'number' ? r.col_dec_sla : typeof r.sla === 'number' ? r.sla : 99.8;
  const ngaygd = r.col_date || r.ngaygd || r.date || '28/10/2026';
  const thoigian = r.col_time || r.thoigian || r.time || '15:30';
  const formulaVal = r.col_formula !== undefined ? r.col_formula : 78.4;

  // Thống kê 12 tháng chuẩn hệ thống (tái sử dụng O(1) qua WeakMap)
  const monthStats = getOrComputeMonthStats(row);

  // Badge màu sắc theo status
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

  return (
    <div
      onClick={() => onSelectRow?.(rowIndex, row)}
      data-row-idx={rowIndex}
      data-row-parity={isEven ? 'even' : 'odd'}
      data-row-focused={isSelected ? 'true' : undefined}
      data-row-checked={isChecked ? 'true' : undefined}
      style={{
        height: `${rowHeight}px`,
        maxHeight: `${rowHeight}px`,
        boxSizing: 'border-box',
        borderColor: 'var(--agv-border)',
        backgroundColor: 'var(--agv-row-data-bg)',
      }}
      className="agv-grid-row flex items-center border-b px-3 text-xs cursor-default select-none transition-colors"
    >
      {/* 1. Ô Chọn & STT */}
      {(showRowNumber || showSelectionCol) && (
        <div className="w-10 shrink-0 flex flex-col items-center justify-center gap-1 mr-2">
          {showRowNumber && (
            <span
              data-cell-role="stt"
              className="text-[10px] tabular-nums font-mono font-medium px-1 rounded transition-colors"
              style={{
                backgroundColor: isSelected ? 'var(--agv-accent)' : 'transparent',
                color: isSelected ? 'var(--agv-accent-text, #ffffff)' : 'var(--agv-text-muted)',
              }}
            >
              {String(rowIndex + 1).padStart(2, '0')}
            </span>
          )}
          {showSelectionCol && (
            <div onClick={(e) => e.stopPropagation()}>
              <MorphCheckbox
                checked={isChecked}
                onChange={(e) => onToggleCheck?.(rowIndex, row, e)}
                size={16}
                spring="snappy"
              />
            </div>
          )}
        </div>
      )}

      {/* 2. Cột 1: Thông tin Node & Định danh (Bỏ avatar tròn theo yêu cầu) */}
      <div className="flex-1 min-w-[190px] pr-3 flex flex-col justify-center">
        <div className="font-semibold text-[13px] truncate" style={{ color: 'var(--agv-text-main)' }}>
          {nodeTitle}
        </div>
        <div className="text-[11px] truncate flex items-center gap-1.5 mt-0.5" style={{ color: 'var(--agv-text-muted)' }}>
          <span className="font-mono">{rowId}</span>
          <span>·</span>
          <span>{ngaygd}</span>
        </div>
      </div>

      {/* 3. Cột 2: Đo lường & Khu vực */}
      <div className="flex-1 min-w-[170px] pr-3">
        <div className="text-[11px] font-medium truncate" style={{ color: 'var(--agv-text-main)' }}>
          Khu vực: <span className="font-semibold">{region}</span>
        </div>
        <div className="text-[11px] flex items-center gap-2 mt-0.5 tabular-nums">
          <span style={{ color: isCpuHigh ? 'var(--agv-warning)' : 'var(--agv-text-muted)' }}>
            CPU: <b className="font-semibold">{Number(cpu).toFixed(1)}%</b>
          </span>
          <span style={{ color: 'var(--agv-border)' }}>|</span>
          <span style={{ color: isSlaLow ? 'var(--agv-danger)' : 'var(--agv-text-muted)' }}>
            SLA: <b className="font-semibold">{Number(sla).toFixed(2)}%</b>
          </span>
        </div>
      </div>

      {/* 4. Cột 3: Biểu đồ 12T & Công thức */}
      <div className="w-[150px] shrink-0 pr-3 flex flex-col justify-center gap-1">
        <div className="w-full h-[22px] flex items-center overflow-hidden">
          <TwelveMonthChartCell
            values={monthStats.mVals}
            minIdx={monthStats.minIdx}
            maxIdx={monthStats.maxIdx}
            minVal={monthStats.minVal}
            maxVal={monthStats.maxVal}
            avgVal={monthStats.avgVal}
            surfaceTheme={surfaceTheme}
            height={22}
            width={140}
          />
        </div>
        <div className="text-[11px] flex items-center justify-between tabular-nums" style={{ color: 'var(--agv-text-muted)' }}>
          <span>
            AVG: <b className="font-semibold text-[var(--agv-accent)]">{formatGridNumber(formulaVal !== undefined ? formulaVal : monthStats.avgVal)}</b>
          </span>
          <span className="font-mono text-[10px]">{thoigian}</span>
        </div>
      </div>

      {/* 5. Cột 4: Trạng thái & Thao tác */}
      <div className="w-[120px] shrink-0 flex flex-col items-end justify-center">
        <span
          className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase shadow-2xs"
          style={statusBadgeStyle}
        >
          {status}
        </span>
        <div className="text-[10px] mt-1 text-right" style={{ color: 'var(--agv-text-muted)' }}>
          Đã đồng bộ
        </div>
      </div>
    </div>
  );
});

GridTabletRow.displayName = 'GridTabletRow';
