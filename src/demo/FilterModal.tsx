import React from 'react';
import { Filter, X, RotateCcw } from 'lucide-react';
import { MorphCheckbox } from '../components/ui/MorphIcons';
import { FilterState, REGIONS } from '../services/apiService';
import { SurfaceTheme } from '../components/grid/types';

export interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFiltersChange: React.Dispatch<React.SetStateAction<FilterState>>;
  onResetFilters: () => void;
  surfaceTheme: SurfaceTheme;
  totalFilteredRows: number;
  activeFilterCount: number;
  checkedRowCount: number;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  onResetFilters,
  surfaceTheme,
  totalFilteredRows,
  activeFilterCount,
  checkedRowCount,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="agv-modal-portal fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xs select-none"
      data-agv-popup="true"
      style={{ backgroundColor: 'var(--agv-backdrop-bg, rgba(0, 0, 0, 0.65))' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-md border overflow-hidden flex flex-col max-h-[90vh] transition-all shadow-2xl"
        style={{
          backgroundColor: 'var(--agv-bg-popup, var(--agv-bg-root))',
          borderColor: 'var(--agv-border-strong)',
          color: 'var(--agv-text-main)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center justify-between px-5 py-3.5 border-b"
          style={{
            backgroundColor: 'var(--agv-bg-header)',
            borderColor: 'var(--agv-border)',
          }}
        >
          <div className="flex items-center gap-2">
            <div
              className="p-1.5 rounded-lg"
              style={{
                backgroundColor: 'var(--agv-bg-selected)',
                color: 'var(--agv-accent)',
              }}
            >
              <Filter className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold" style={{ color: 'var(--agv-text-main)' }}>
                Bộ Lọc Giá Trị (50.000 dòng)
              </h3>
              <p className="text-[11px]" style={{ color: 'var(--agv-text-muted)' }}>
                Mặc định tất cả là tắt (false). Hãy tích chọn tiêu chí bạn muốn lọc.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:opacity-80 transition cursor-pointer"
            style={{ color: 'var(--agv-text-muted)' }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          <div
            className="p-3 rounded-xl border"
            style={{
              backgroundColor: 'var(--agv-bg-root)',
              borderColor: 'var(--agv-border)',
            }}
          >
            <div className="font-semibold mb-2" style={{ color: 'var(--agv-text-main)' }}>
              1. Dòng Đã Chọn (Checkbox)
            </div>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <MorphCheckbox
                checked={filters.onlyChecked}
                onChange={() =>
                  onFiltersChange((prev) => ({ ...prev, onlyChecked: !prev.onlyChecked }))
                }
                size={16}
                spring="bouncy"
              />
              <span style={{ color: 'var(--agv-text-main)' }}>
                Chỉ hiển thị các dòng đã đánh dấu chọn ({checkedRowCount} dòng)
              </span>
            </label>
          </div>

          <div
            className="p-3 rounded-xl border"
            style={{
              backgroundColor: 'var(--agv-bg-root)',
              borderColor: 'var(--agv-border)',
            }}
          >
            <div className="font-semibold mb-2 flex items-center justify-between">
              <span style={{ color: 'var(--agv-text-main)' }}>2. Trạng Thái Hoạt Động</span>
              <span className="text-[11px] font-normal" style={{ color: 'var(--agv-text-muted)' }}>
                (Không tick = Hiện tất cả)
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(['ONLINE', 'DEGRADED', 'OVERLOAD'] as const).map((st) => (
                <label
                  key={st}
                  className="flex items-center gap-2 p-2 rounded-lg border cursor-pointer select-none hover:opacity-90"
                  style={{
                    backgroundColor: 'var(--agv-bg-hover)',
                    borderColor: 'var(--agv-border)',
                  }}
                >
                  <MorphCheckbox
                    checked={filters.status[st]}
                    onChange={() =>
                      onFiltersChange((prev) => ({
                        ...prev,
                        status: { ...prev.status, [st]: !prev.status[st] },
                      }))
                    }
                    size={16}
                    spring="bouncy"
                  />
                  <span className="font-medium text-[11px]" style={{ color: 'var(--agv-text-main)' }}>
                    {st}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div
            className="p-3 rounded-xl border"
            style={{
              backgroundColor: 'var(--agv-bg-root)',
              borderColor: 'var(--agv-border)',
            }}
          >
            <div className="font-semibold mb-2 flex items-center justify-between">
              <span style={{ color: 'var(--agv-text-main)' }}>3. Khu Vực</span>
              <span className="text-[11px] font-normal" style={{ color: 'var(--agv-text-muted)' }}>
                (Không tick = Hiện tất cả)
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {REGIONS.map((reg) => (
                <label
                  key={reg}
                  className="flex items-center gap-2 p-2 rounded-lg border cursor-pointer select-none hover:opacity-90"
                  style={{
                    backgroundColor: 'var(--agv-bg-hover)',
                    borderColor: 'var(--agv-border)',
                  }}
                >
                  <MorphCheckbox
                    checked={!!filters.regions[reg]}
                    onChange={() =>
                      onFiltersChange((prev) => ({
                        ...prev,
                        regions: { ...prev.regions, [reg]: !prev.regions[reg] },
                      }))
                    }
                    size={16}
                    spring="bouncy"
                  />
                  <span className="font-medium text-[11px]" style={{ color: 'var(--agv-text-main)' }}>
                    {reg}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div
            className="p-3 rounded-xl border"
            style={{
              backgroundColor: 'var(--agv-bg-root)',
              borderColor: 'var(--agv-border)',
            }}
          >
            <div className="font-semibold mb-2" style={{ color: 'var(--agv-text-main)' }}>
              4. Điều Kiện Hiệu Năng & SLA
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <MorphCheckbox
                  checked={filters.highCpu}
                  onChange={() =>
                    onFiltersChange((prev) => ({ ...prev, highCpu: !prev.highCpu }))
                  }
                  size={16}
                  spring="bouncy"
                />
                <span style={{ color: 'var(--agv-text-main)' }}>Tải CPU cao (&gt; 70.00%)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <MorphCheckbox
                  checked={filters.lowSla}
                  onChange={() =>
                    onFiltersChange((prev) => ({ ...prev, lowSla: !prev.lowSla }))
                  }
                  size={16}
                  spring="bouncy"
                />
                <span style={{ color: 'var(--agv-text-main)' }}>SLA cảnh báo vi phạm (&lt; 98.00%)</span>
              </label>
            </div>
          </div>
        </div>

        <div
          className="px-5 py-3 border-t flex flex-wrap items-center justify-between gap-3"
          style={{
            backgroundColor: 'var(--agv-bg-header)',
            borderColor: 'var(--agv-border)',
          }}
        >
          <div className="text-xs" style={{ color: 'var(--agv-text-main)' }}>
            Khớp:{' '}
            <strong className="text-[var(--agv-success)] font-bold">
              {totalFilteredRows.toLocaleString()} / 50.000 dòng
            </strong>
            {activeFilterCount > 0 && (
              <span className="text-[var(--agv-accent)] font-semibold ml-1.5">
                ({activeFilterCount} tiêu chí đang bật)
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onResetFilters}
              className="px-3 py-1.5 rounded-lg border transition text-xs inline-flex items-center gap-1.5 cursor-pointer hover:opacity-80 min-h-[28px]"
              style={{
                backgroundColor: 'var(--agv-bg-root)',
                borderColor: 'var(--agv-border)',
                color: 'var(--agv-text-main)',
              }}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Bỏ chọn tất cả
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg font-semibold transition text-xs cursor-pointer min-h-[28px]"
              style={{
                backgroundColor: 'var(--agv-accent)',
                color: 'var(--agv-accent-text, #ffffff)',
              }}
            >
              Áp Dụng & Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
