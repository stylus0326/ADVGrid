import { SurfaceTheme } from './types';

export const DEFAULT_CHUNK_SIZE = 20;
export const DEFAULT_ROW_HEIGHT = 32;

/**
 * Bộ 9 thuộc tính chặn triệt để popup gợi ý tự động (Autofill/Autocomplete) của trình duyệt và tiện ích mở rộng (1Password, Bitwarden, LastPass, v.v.)
 */
export const NO_AUTOFILL_PROPS = {
  autoComplete: 'off',
  autoCorrect: 'off',
  autoCapitalize: 'off',
  spellCheck: false,
  'aria-autocomplete': 'none' as const,
  'data-lpignore': 'true',
  'data-form-type': 'other',
  'data-1p-ignore': 'true',
  'data-bwignore': 'true',
};

export const POPUP_SELECTORS = [
  '.agv-calendar-popover',
  '.agv-preset-dropdown-menu',
  '.agv-portal-dropdown',
  '.agv-comboboxedit-dropdown',
  '.agv-searchlookupedit-dropdown',
  '.agv-lookup-op-menu',
  '.agv-context-menu',
  '.agv-modal-portal',
  '.agv-filter-dropdown-menu',
  '.agv-settings-popup',
  '.agv-column-chooser',
  '.agv-query-builder-modal',
  '[data-agv-popup="true"]',
].join(', ');

/**
 * Chuẩn hóa độ bo góc (Border Radius) toàn hệ thống cho Controls & Editors:
 * - Ô In-Cell Editor (Text/Number CellEditor, TimeCellEditor)
 * - Ô In-Cell Dropdown (AdvComboBoxEdit, AdvSearchLookUpEdit)
 * - Hộp nhập trên hàng lọc (GridFilterRow filter cell box)
 * Khi muốn đổi độ bo góc toàn hệ thống (ví dụ: 'rounded-md', 'rounded', 'rounded-sm', 'rounded-lg' hoặc 'rounded-[6px]'),
 * CHỈ CẦN CHỈNH GIÁ TRỊ TẠI ĐÂY LÀ TOÀN BỘ ĐỒNG LOẠT THAY ĐỔI THEO!
 */
export const GRID_CONTROL_RADIUS_CLASS = 'rounded-md';

export const getGridControlRadiusClass = (): string => GRID_CONTROL_RADIUS_CLASS;

export const getPinnedDividerClass = (_theme?: SurfaceTheme) =>
  'border-r-2 border-r-agv-accent';

export const getRightPinnedDividerClass = (_theme?: SurfaceTheme) =>
  'border-l-2 border-l-agv-accent';

export const getThemeClasses = (_theme?: SurfaceTheme) => {
  return {
    viewportBg: 'bg-[var(--agv-bg-root)]',
    headerBg: 'bg-[var(--agv-bg-header)] text-[var(--agv-text-header)]',
    headerBorderBottom: 'border-b border-b-[var(--agv-border)]',
    systemBorderBottom: 'border-b-2 border-b-[var(--agv-border-strong)]',
    filterBorderBottom: 'border-b-2 border-b-[var(--agv-border-strong)]',
    headerBorderRight: 'border-r border-r-[var(--agv-border)]',
    headerHoverBg: 'hover:bg-[var(--agv-bg-hover)]',
    tier1Bg: 'bg-[var(--agv-bg-header)] text-[var(--agv-text-header)]',
    tier1Border: 'border-r-[var(--agv-border)] border-b-[var(--agv-border-strong)]',
    chunkBg: 'bg-[var(--agv-bg-root)]',
    borderBottom: 'border-b border-b-[var(--agv-border)]',
    borderRight: 'border-r border-r-[var(--agv-border)]',
    defaultTextColor: 'text-[var(--agv-text-main)]',
    rowSelectedBg: 'bg-[var(--agv-bg-selected)]',
    rowEvenBg: 'bg-[var(--agv-bg-row)]',
    rowOddBg: 'bg-[var(--agv-bg-row-alt)]',
    rowHoverBg: 'group-hover:bg-[var(--agv-bg-hover)]',
    sharedHeaderCellBg: 'bg-[var(--agv-bg-header)]',
    sharedHeaderCellSelectedBg: 'bg-[var(--agv-bg-selected)]',
    sharedHeaderCellHoverBg: 'group-hover:bg-[var(--agv-bg-hover)]',
    contextMenuBg: 'bg-[var(--agv-bg-popup)] text-[var(--agv-text-main)] border-[var(--agv-border-popup)] shadow-xl',
    contextMenuBtnBg: 'bg-[var(--agv-btn-default-bg)] hover:bg-[var(--agv-btn-default-hover)] text-[var(--agv-btn-default-text)] border-[var(--agv-btn-default-border)]',
  };
};
