import React, { useState } from 'react';
import { AnimateUIPrimitivesDemoModal } from './AnimateUIPrimitivesDemoModal';
import {
  Layers,
  Sparkles,
  X,
  Activity,
  Cpu,
  Zap,
  Search,
  Filter,
} from 'lucide-react';
import {
  MorphIcon,
  Play,
  Pause,
  Magnet,
  Unlock,
  Sun,
  Moon,
  Monitor,
  Palette,
  BookOpen,
  ColumnsIcon,
  BarChart2,
} from '../components/ui/MorphIcons';
import { FormulaMode, MonthAnalyticsMode, FORMULA_META } from '../services/apiService';
import { NO_AUTOFILL_PROPS } from '../components/grid/constants';
import {
  SurfaceTheme,
  SURFACE_THEMES,
  SortConfig,
  GridEditMode,
  GRID_EDIT_MODES,
  SORT_DIRECTIONS,
  MONTH_ANALYTICS_MODES,
} from '../components/grid/types';
import { REGISTERED_THEMES, normalizeThemeId } from '../themes';

export interface PageToolbarProps {
  monthAnalyticsMode: MonthAnalyticsMode;
  onToggleMonthAnalyticsMode: () => void;
  formulaMode: FormulaMode;
  onCycleFormula: () => void;
  editMode: GridEditMode;
  onEditModeChange: (mode: GridEditMode) => void;
  sortConfig: SortConfig | null;
  sortTitle?: string;
  onClearSort: () => void;
  fps: number;
  startChunkIndex: number;
  endChunkIndex: number;
  mountedRowCount: number;
  totalFilteredRows: number;
  scrollVelocity: number;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeFilterCount: number;
  onOpenFilters: () => void;
  showFilterRow?: boolean;
  onToggleFilterRow?: () => void;
  activeColumnFilterCount?: number;
  jumpRowInput: string;
  onJumpRowInputChange: (val: string) => void;
  onJumpToRowSubmit: () => void;
  surfaceTheme: SurfaceTheme;
  onThemeChange: (theme: SurfaceTheme) => void;
  rowSnapMode: boolean;
  onToggleRowSnap: () => void;
  rowsPerWheelStep: number;
  onRowsPerWheelStepChange: (step: number) => void;
  autoScrolling: boolean;
  onToggleAutoScroll: () => void;
}

export const PageToolbar: React.FC<PageToolbarProps> = ({
  monthAnalyticsMode,
  onToggleMonthAnalyticsMode,
  formulaMode,
  onCycleFormula,
  editMode,
  onEditModeChange,
  sortConfig,
  sortTitle,
  onClearSort,
  fps,
  startChunkIndex,
  endChunkIndex,
  mountedRowCount,
  totalFilteredRows,
  scrollVelocity,
  searchQuery,
  onSearchChange,
  activeFilterCount,
  onOpenFilters,
  showFilterRow = true,
  onToggleFilterRow,
  activeColumnFilterCount = 0,
  jumpRowInput,
  onJumpRowInputChange,
  onJumpToRowSubmit,
  surfaceTheme,
  onThemeChange,
  rowSnapMode,
  onToggleRowSnap,
  rowsPerWheelStep,
  onRowsPerWheelStepChange,
  autoScrolling,
  onToggleAutoScroll,
}) => {
  const [showPrimitivesDemo, setShowPrimitivesDemo] = useState(false);

  return (
    <header
      className="px-4 py-3 shrink-0 select-none border-b transition-colors"
      style={{
        backgroundColor: 'var(--agv-bg-header)',
        borderColor: 'var(--agv-border)',
        color: 'var(--agv-text-main)',
      }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left branding and action tags */}
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{
              backgroundColor: 'var(--agv-accent)',
              color: 'var(--agv-accent-text, #ffffff)',
            }}
          >
            <Layers className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1
                className="text-base font-bold tracking-tight"
                style={{ color: 'var(--agv-text-main)' }}
              >
                Hạ Tầng Điện Toán Đám Mây (50,000 Dòng)
              </h1>

              <button
                type="button"
                onClick={onToggleMonthAnalyticsMode}
                className="inline-flex items-center gap-1.5 px-2.5 h-[28px] min-h-[28px] rounded-lg border text-xs font-semibold transition cursor-pointer select-none"
                style={
                  monthAnalyticsMode === MONTH_ANALYTICS_MODES.TWO_COLS
                    ? {
                        backgroundColor: 'var(--agv-accent)',
                        borderColor: 'var(--agv-accent)',
                        color: 'var(--agv-accent-text, #ffffff)',
                      }
                    : {
                        backgroundColor: 'var(--agv-bg-root)',
                        borderColor: 'var(--agv-border)',
                        color: 'var(--agv-text-main)',
                      }
                }
              >
                <MorphIcon
                  icon={monthAnalyticsMode === MONTH_ANALYTICS_MODES.THIRTEEN_COLS ? ColumnsIcon : BarChart2}
                  size={13}
                  spring="bouncy"
                />
                <span>
                  {monthAnalyticsMode === MONTH_ANALYTICS_MODES.THIRTEEN_COLS
                    ? 'Chế độ: 13 Cột'
                    : 'Chế độ: 2 Cột Chart'}
                </span>
              </button>

              <button
                type="button"
                onClick={onCycleFormula}
                className="inline-flex items-center gap-1.5 px-2.5 h-[28px] min-h-[28px] rounded-lg border text-xs font-semibold transition cursor-pointer select-none"
                style={{
                  backgroundColor: 'var(--agv-bg-root)',
                  borderColor: 'var(--agv-border)',
                  color: 'var(--agv-text-main)',
                }}
              >
                <Sparkles className="w-3.5 h-3.5 text-[var(--agv-warning)]" />
                <span>Công Thức: {FORMULA_META[formulaMode].label}</span>
              </button>

              {sortConfig && (
                <div
                  className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border"
                  style={{
                    backgroundColor: 'var(--agv-success-bg)',
                    color: 'var(--agv-success)',
                    borderColor: 'var(--agv-success)',
                  }}
                >
                  <span>
                    Sắp xếp: {sortTitle || sortConfig.key} (
                    {sortConfig.direction === SORT_DIRECTIONS.ASC ? 'Tăng dần' : 'Giảm dần'})
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onClearSort();
                    }}
                    className="p-0.5 rounded hover:opacity-75 transition cursor-pointer"
                    style={{ color: 'var(--agv-success)' }}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
            <p
              className="text-xs mt-0.5"
              style={{ color: 'var(--agv-text-muted)' }}
            >
              Nhấn tên cột để sắp xếp • Nhấp chuột phải vào cột / tầng 2 để Ghim vị trí (Trái / Giữa / Phải) • Tái click để hủy ghim
            </p>
          </div>
        </div>

        {/* Real-time Telemetry Metrics */}
        <div className="flex flex-wrap items-center gap-2">
          <div
            className="rounded-lg px-3 py-1.5 flex items-center gap-2 border"
            style={{
              backgroundColor: 'var(--agv-bg-root)',
              borderColor: 'var(--agv-border)',
            }}
          >
            <Activity className="w-4 h-4 text-[var(--agv-success)]" />
            <div>
              <div
                className="text-[10px] uppercase tracking-wider"
                style={{ color: 'var(--agv-text-muted)' }}
              >
                FPS thực
              </div>
              <div className="text-xs font-bold text-[var(--agv-success)]">{fps} FPS</div>
            </div>
          </div>

          <div
            className="rounded-lg px-3 py-1.5 flex items-center gap-2 border"
            style={{
              backgroundColor: 'var(--agv-bg-root)',
              borderColor: 'var(--agv-border)',
            }}
          >
            <Layers className="w-4 h-4 text-[var(--agv-accent)]" />
            <div>
              <div
                className="text-[10px] uppercase tracking-wider"
                style={{ color: 'var(--agv-text-muted)' }}
              >
                Chunks Active
              </div>
              <div className="text-xs font-bold text-[var(--agv-accent)]">
                #{startChunkIndex} → #{Math.max(0, endChunkIndex)}
              </div>
            </div>
          </div>

          <div
            className="rounded-lg px-3 py-1.5 flex items-center gap-2 border"
            style={{
              backgroundColor: 'var(--agv-bg-root)',
              borderColor: 'var(--agv-border)',
            }}
          >
            <Cpu className="w-4 h-4 text-[var(--agv-accent)]" />
            <div>
              <div
                className="text-[10px] uppercase tracking-wider"
                style={{ color: 'var(--agv-text-muted)' }}
              >
                DOM Rows
              </div>
              <div className="text-xs font-bold text-[var(--agv-accent)]">
                {mountedRowCount} / {totalFilteredRows.toLocaleString()} dòng
              </div>
            </div>
          </div>

          <div
            className="rounded-lg px-3 py-1.5 flex items-center gap-2 border"
            style={{
              backgroundColor: 'var(--agv-bg-root)',
              borderColor: 'var(--agv-border)',
            }}
          >
            <Zap className="w-4 h-4 text-[var(--agv-warning)]" />
            <div>
              <div
                className="text-[10px] uppercase tracking-wider"
                style={{ color: 'var(--agv-text-muted)' }}
              >
                Tốc độ cuộn
              </div>
              <div className="text-xs font-bold text-[var(--agv-warning)]">
                {scrollVelocity.toLocaleString()} px/s
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Control Actions Row */}
      <div
        className="mt-3 pt-2.5 border-t flex flex-wrap items-center justify-between gap-2 text-xs"
        style={{ borderColor: 'var(--agv-border)' }}
      >
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Box */}
          <div
            className="relative flex items-center rounded-lg border text-xs"
            style={{
              backgroundColor: 'var(--agv-bg-root)',
              borderColor: 'var(--agv-border)',
            }}
          >
            <Search
              className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--agv-text-muted)' }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Tìm trong 50.000 dòng..."
              {...NO_AUTOFILL_PROPS}
              className="bg-transparent pl-8 pr-3 py-1.5 text-xs outline-none w-44"
              style={{ color: 'var(--agv-text-main)' }}
            />
          </div>

          {/* Filter Modal Trigger */}
          <button
            type="button"
            onClick={onOpenFilters}
            className="inline-flex items-center gap-1.5 px-2.5 h-[28px] min-h-[28px] rounded-lg border text-xs font-semibold transition cursor-pointer hover:opacity-90"
            style={{
              backgroundColor: activeFilterCount > 0 ? 'var(--agv-accent)' : 'var(--agv-bg-root)',
              borderColor: activeFilterCount > 0 ? 'var(--agv-accent)' : 'var(--agv-border)',
              color: activeFilterCount > 0 ? 'var(--agv-accent-text, #ffffff)' : 'var(--agv-text-main)',
            }}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Bộ Lọc</span>
            {activeFilterCount > 0 && (
              <span
                className="px-1.5 py-0.2 rounded-full text-[10px] font-bold"
                style={{
                  backgroundColor: 'var(--agv-accent-text, #ffffff)',
                  color: 'var(--agv-accent)',
                }}
              >
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Inline Filter Row Toggle (No Icon, min-h 28px) */}
          <button
            type="button"
            onClick={onToggleFilterRow}
            className="inline-flex items-center gap-1.5 px-2.5 h-[28px] min-h-[28px] rounded-lg border text-xs font-semibold transition cursor-pointer"
            style={{
              backgroundColor: showFilterRow ? 'var(--agv-accent)' : 'var(--agv-bg-root)',
              borderColor: showFilterRow ? 'var(--agv-accent)' : 'var(--agv-border)',
              color: showFilterRow ? 'var(--agv-accent-text, #ffffff)' : 'var(--agv-text-main)',
            }}
          >
            <span>Dòng Lọc</span>
            {activeColumnFilterCount > 0 && (
              <span
                className="px-1.5 py-0.2 rounded-full text-[10px] font-bold"
                style={{
                  backgroundColor: showFilterRow ? '#ffffff' : 'var(--agv-accent)',
                  color: showFilterRow ? 'var(--agv-accent)' : '#ffffff',
                }}
              >
                {activeColumnFilterCount}
              </span>
            )}
          </button>

          {/* Nút mở Modal Thử nghiệm Primitives */}
          <button
            type="button"
            onClick={() => setShowPrimitivesDemo(true)}
            className="inline-flex items-center gap-1 px-2.5 h-[28px] min-h-[28px] rounded-lg border text-xs font-semibold transition cursor-pointer border-[var(--agv-border)] hover:border-[var(--agv-accent)]"
            style={{
              backgroundColor: 'var(--agv-bg-root)',
              color: 'var(--agv-text-main)',
            }}
          >
            <span>🧪 Primitives</span>
          </button>

          {/* Jump to row form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onJumpToRowSubmit();
            }}
            className="flex items-center gap-1 rounded-lg border p-1"
            style={{
              backgroundColor: 'var(--agv-bg-root)',
              borderColor: 'var(--agv-border)',
            }}
          >
            <input
              type="number"
              min={1}
              max={totalFilteredRows}
              value={jumpRowInput}
              onChange={(e) => onJumpRowInputChange(e.target.value)}
              placeholder={`Tới dòng (1-${totalFilteredRows || 300000})`}
              {...NO_AUTOFILL_PROPS}
              className="bg-transparent px-2 py-0.5 text-xs outline-none w-36"
              style={{ color: 'var(--agv-text-main)' }}
            />
            <button
              type="submit"
              className="px-2 py-0.5 rounded text-[11px] font-medium transition cursor-pointer min-h-[28px]"
              style={{
                backgroundColor: 'var(--agv-accent)',
                color: 'var(--agv-accent-text, #ffffff)',
              }}
            >
              Nhảy
            </button>
          </form>

          {/* Chế độ Sửa (Edit Mode): Xem / Sửa (1 click) / Sửa (2 click) */}
          <div
            className="flex items-center gap-1 rounded-lg border p-1 min-h-[28px]"
            style={{
              backgroundColor: 'var(--agv-bg-root)',
              borderColor: 'var(--agv-border-strong)',
            }}
          >
            <span
              className="text-[11px] px-1.5 font-semibold select-none"
              style={{ color: 'var(--agv-text-muted)' }}
            >
              Chế độ:
            </span>
            {(
              [
                { id: GRID_EDIT_MODES.VIEW, label: 'Xem' },
                { id: GRID_EDIT_MODES.SINGLE_CLICK, label: 'Sửa (1 click)' },
                { id: GRID_EDIT_MODES.DOUBLE_CLICK, label: 'Sửa (2 click)' },
              ] as const
            ).map((item) => {
              const isActive = editMode === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onEditModeChange(item.id)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition cursor-pointer min-h-[28px] flex items-center justify-center select-none ${
                    isActive ? '' : 'hover:opacity-75'
                  }`}
                  style={
                    isActive
                      ? {
                          backgroundColor: 'var(--agv-accent)',
                          color: 'var(--agv-accent-text, #ffffff)',
                        }
                      : {
                          backgroundColor: 'transparent',
                          color: 'var(--agv-text-muted)',
                        }
                  }
                >
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Surface Theme switcher */}
          <div
            className="flex items-center gap-1 rounded-lg border p-1"
            style={{
              backgroundColor: 'var(--agv-bg-root)',
              borderColor: 'var(--agv-border-strong)',
            }}
          >
            <span
              className="text-[11px] px-1.5 font-semibold"
              style={{ color: 'var(--agv-text-muted)' }}
            >
              Theme:
            </span>
            {REGISTERED_THEMES.map((t) => {
              const isActive = normalizeThemeId(surfaceTheme) === t.id;

              const IconComp =
                t.iconName === 'Sun'
                  ? Sun
                  : t.iconName === 'Moon'
                  ? Moon
                  : t.iconName === 'Palette'
                  ? Palette
                  : BookOpen;

              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => onThemeChange(t.id as SurfaceTheme)}
                  className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-[11px] font-semibold transition cursor-pointer min-h-[28px] ${
                    isActive ? '' : 'hover:opacity-75'
                  }`}
                  style={
                    isActive
                      ? {
                          backgroundColor: 'var(--agv-accent)',
                          color: 'var(--agv-accent-text, #ffffff)',
                        }
                      : {
                          color: 'var(--agv-text-muted)',
                          backgroundColor: 'transparent',
                        }
                  }
                >
                  <MorphIcon
                    icon={IconComp}
                    size={13}
                    spring="snappy"
                    className={isActive ? 'text-[var(--agv-accent-text,#ffffff)]' : t.iconColorClass}
                  />
                  <span>{t.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right side toggles */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Row snap toggle */}
          <div
            className="flex items-center gap-1 rounded-lg border p-1"
            style={{
              backgroundColor: 'var(--agv-bg-root)',
              borderColor: 'var(--agv-border)',
            }}
          >
            <button
              type="button"
              onClick={onToggleRowSnap}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-semibold transition cursor-pointer min-h-[28px] ${
                rowSnapMode ? '' : 'hover:opacity-80'
              }`}
              style={
                rowSnapMode
                  ? {
                      backgroundColor: 'var(--agv-accent)',
                      color: 'var(--agv-accent-text, #ffffff)',
                    }
                  : {
                      color: 'var(--agv-text-muted)',
                      backgroundColor: 'transparent',
                    }
              }
            >
              <MorphIcon
                icon={rowSnapMode ? Magnet : Unlock}
                size={14}
                spring="bouncy"
              />
              Khớp Dòng: {rowSnapMode ? 'BẬT' : 'TẮT'}
            </button>

            {rowSnapMode && (
              <div
                className="flex items-center gap-0.5 pl-1 border-l"
                style={{ borderColor: 'var(--agv-border)' }}
              >
                <span
                  className="text-[10px] px-1"
                  style={{ color: 'var(--agv-text-muted)' }}
                >
                  Nấc:
                </span>
                {[1, 3, 5, 20].map((step) => (
                  <button
                    key={step}
                    type="button"
                    onClick={() => onRowsPerWheelStepChange(step)}
                    className={`px-1.5 py-0.5 rounded text-[10px] transition cursor-pointer min-h-[28px] ${
                      rowsPerWheelStep === step
                        ? 'font-bold'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                    style={
                      rowsPerWheelStep === step
                        ? {
                            backgroundColor: 'var(--agv-accent)',
                            color: 'var(--agv-accent-text, #ffffff)',
                          }
                        : { color: 'var(--agv-text-muted)' }
                    }
                  >
                    {step === 20 ? '1Chunk' : `${step}d`}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Auto-scroll button */}
          <button
            type="button"
            onClick={onToggleAutoScroll}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium border transition cursor-pointer min-h-[28px]"
            style={
              autoScrolling
                ? {
                    backgroundColor: 'var(--agv-warning-bg)',
                    borderColor: 'var(--agv-warning)',
                    color: 'var(--agv-warning)',
                  }
                : {
                    backgroundColor: 'var(--agv-accent)',
                    borderColor: 'var(--agv-accent)',
                    color: 'var(--agv-accent-text, #ffffff)',
                  }
            }
          >
            <MorphIcon
              icon={autoScrolling ? Pause : Play}
              size={14}
              spring="bouncy"
            />
            {autoScrolling ? 'Dừng Test' : 'Test Cuộn Cao Tốc'}
          </button>
        </div>
      </div>

      <AnimateUIPrimitivesDemoModal
        isOpen={showPrimitivesDemo}
        onClose={() => setShowPrimitivesDemo(false)}
        surfaceTheme={surfaceTheme}
      />
    </header>
  );
};
