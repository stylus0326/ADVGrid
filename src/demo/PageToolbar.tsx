import React, { useState } from 'react';
import { AnimateUIPrimitivesDemoModal } from './AnimateUIPrimitivesDemoModal';
import {
  Search,
  Filter,
  Sun,
  Moon,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import {
  MorphIcon,
  Play,
  Pause,
} from '../components/ui/MorphIcons';
import { NO_AUTOFILL_PROPS } from '../components/grid/constants';
import {
  SurfaceTheme,
  SortConfig,
  GridEditMode,
  GridLayoutMode,
} from '../components/grid/types';
import { AdvComboBoxEdit, AdvComboBoxEditOption } from '../components/ui/AdvComboBoxEdit';

const THEME_OPTIONS: AdvComboBoxEditOption[] = [
  { value: 'light', label: 'Sáng' },
  { value: 'dark', label: 'Balham Dark' },
  { value: 'bezier-arthouse', label: 'Bezier Art House' },
  { value: 'e-ink', label: 'Giấy E-Ink' },
  { value: 'custom', label: 'CSS Tùy Biến' },
];

export interface PageToolbarProps {
  monthAnalyticsMode?: any;
  onToggleMonthAnalyticsMode?: () => void;
  formulaMode?: any;
  onCycleFormula?: () => void;
  editMode?: GridEditMode;
  onEditModeChange?: (mode: GridEditMode) => void;
  sortConfig?: SortConfig | null;
  sortTitle?: string;
  onClearSort?: () => void;
  fps?: number;
  startChunkIndex?: number;
  endChunkIndex?: number;
  mountedRowCount?: number;
  totalFilteredRows?: number;
  scrollVelocity?: number;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeFilterCount: number;
  onOpenFilters: () => void;
  showFilterRow?: boolean;
  onToggleFilterRow?: () => void;
  activeColumnFilterCount?: number;
  jumpRowInput?: string;
  onJumpRowInputChange?: (val: string) => void;
  onJumpToRowSubmit?: () => void;
  surfaceTheme: SurfaceTheme;
  onThemeChange: (theme: SurfaceTheme) => void;
  onOpenCustomCssModal?: () => void;
  isDark?: boolean;
  onToggleColorScheme?: (isDark: boolean) => void;
  autoScrolling: boolean;
  onToggleAutoScroll: () => void;
  gridLayoutMode?: GridLayoutMode;
  onGridLayoutModeChange?: (mode: GridLayoutMode) => void;
}

export const PageToolbar: React.FC<PageToolbarProps> = React.memo(({
  searchQuery,
  onSearchChange,
  activeFilterCount,
  onOpenFilters,
  surfaceTheme,
  onThemeChange,
  onOpenCustomCssModal,
  isDark = false,
  onToggleColorScheme,
  autoScrolling,
  onToggleAutoScroll,
}) => {
  const [showPrimitivesDemo, setShowPrimitivesDemo] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      return localStorage.getItem('agv_page_toolbar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const handleToggleCollapse = (collapsed: boolean) => {
    setIsCollapsed(collapsed);
    try {
      localStorage.setItem('agv_page_toolbar_collapsed', String(collapsed));
    } catch {}
  };

  // Khi thu gọn: Render thanh Strip Bar tinh gọn 34px tiết kiệm 90% diện tích màn hình
  if (isCollapsed) {
    return (
      <header
        className="px-3 py-1 shrink-0 select-none border-b transition-all flex items-center justify-end gap-2"
        style={{
          height: '34px',
          minHeight: '34px',
          backgroundColor: 'var(--agv-bg-header, var(--agv-bg-root))',
          borderColor: 'var(--agv-border)',
          color: 'var(--agv-text-main)',
        }}
      >
        {/* Nút bung mở lại Toolbar: [ Hiện Toolbar ▼ ] */}
        <button
          type="button"
          onClick={() => handleToggleCollapse(false)}
          className="inline-flex items-center gap-1.5 px-3 h-[28px] min-h-[28px] rounded-lg border text-xs font-semibold transition cursor-pointer shrink-0 select-none shadow-2xs hover:bg-[var(--agv-bg-hover)]"
          style={{
            backgroundColor: 'var(--agv-bg-root)',
            borderColor: 'var(--agv-border)',
            color: 'var(--agv-text-main)',
          }}
        >
          <span>Hiện Toolbar</span>
          <ChevronDown size={14} />
        </button>
      </header>
    );
  }

  return (
    <header
      className="px-4 py-2.5 shrink-0 select-none border-b transition-colors"
      style={{
        backgroundColor: 'var(--agv-bg-header, var(--agv-bg-root))',
        borderColor: 'var(--agv-border)',
        color: 'var(--agv-text-main)',
      }}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Left Side: Search, Bộ Lọc, Primitives & Theme Switcher */}
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

          {/* Surface Theme switcher: ComboBox 4 themes + Nhập CSS */}
          <div className="flex items-center gap-1.5">
            <div
              className="flex items-center gap-1 rounded-lg border p-1"
              style={{
                backgroundColor: 'var(--agv-bg-root)',
                borderColor: 'var(--agv-border-strong)',
              }}
            >
              <span
                className="text-[11px] px-1.5 font-semibold shrink-0"
                style={{ color: 'var(--agv-text-muted)' }}
              >
                Theme:
              </span>
              <div style={{ width: 175 }}>
                <AdvComboBoxEdit
                  value={surfaceTheme}
                  onChange={(val) => onThemeChange(val as SurfaceTheme)}
                  options={THEME_OPTIONS}
                  placeholder="Chọn theme..."
                  size="sm"
                  theme={surfaceTheme}
                  allowCustomInput={false}
                />
              </div>
            </div>

            {onOpenCustomCssModal && (
              <button
                type="button"
                onClick={onOpenCustomCssModal}
                className="inline-flex items-center justify-center px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition cursor-pointer min-h-[28px] hover:opacity-85"
                style={{
                  backgroundColor: 'var(--agv-bg-root)',
                  borderColor: 'var(--agv-border-strong)',
                  color: 'var(--agv-text-main)',
                }}
              >
                <span>Nhập CSS</span>
              </button>
            )}

            {onToggleColorScheme && (
              <div
                className="flex items-center rounded-lg border p-0.5 min-h-[28px]"
                style={{
                  backgroundColor: 'var(--agv-bg-root)',
                  borderColor: 'var(--agv-border-strong)',
                }}
              >
                <button
                  type="button"
                  onClick={() => onToggleColorScheme(false)}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium transition cursor-pointer min-h-[24px]"
                  style={
                    !isDark
                      ? {
                          backgroundColor: 'var(--agv-accent)',
                          color: 'var(--agv-accent-text, #ffffff)',
                          fontWeight: 600,
                        }
                      : {
                          backgroundColor: 'transparent',
                          color: 'var(--agv-text-muted)',
                        }
                  }
                >
                  <Sun size={13} />
                  <span>Ngày</span>
                </button>
                <button
                  type="button"
                  onClick={() => onToggleColorScheme(true)}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium transition cursor-pointer min-h-[24px]"
                  style={
                    isDark
                      ? {
                          backgroundColor: 'var(--agv-accent)',
                          color: 'var(--agv-accent-text, #ffffff)',
                          fontWeight: 600,
                        }
                      : {
                          backgroundColor: 'transparent',
                          color: 'var(--agv-text-muted)',
                        }
                  }
                >
                  <Moon size={13} />
                  <span>Đêm</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Test Cuộn Cao Tốc & Ẩn Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
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

          {/* Nút Ẩn Toolbar */}
          <button
            type="button"
            onClick={() => handleToggleCollapse(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold border transition cursor-pointer min-h-[28px] text-xs hover:bg-[var(--agv-bg-hover)] select-none shadow-2xs"
            style={{
              backgroundColor: 'var(--agv-bg-root)',
              borderColor: 'var(--agv-border)',
              color: 'var(--agv-text-main)',
            }}
          >
            <span>Ẩn Toolbar</span>
            <ChevronUp size={14} />
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
});
