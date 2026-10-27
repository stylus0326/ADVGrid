import { GridThemeTokens } from './common';

/* ==============================================================================
   THEME 4: BỘ NỀN GIẤY E-INK (WARM E-INK PAPER THEME)
   Chuẩn Bảng Màu & Quang Học Khử Bóng Mờ Dành Cho Dữ Liệu Lớn (Zero-Ghosting)
   ============================================================================== */

export const EINK_PAPER_THEME_TOKENS: GridThemeTokens = {
  bgRoot: '#E6E2D8',
  bgHeader: '#E4DFD3',
  bgRow: '#F5F2EB',
  bgRowAlt: '#EBE7DE',
  bgHover: '#DED9CD',
  bgSelected: '#D3E0EA',
  bgPopup: '#F2EFE9',
  bgItemHover: '#DED9CD',
  bgItemActive: '#D3E0EA',
  bgControl: '#F2EFE9',
  bgControlHover: '#DED9CD',
  border: '#CFC9BC',
  borderStrong: '#B8B1A2',
  borderPopup: '#CFC9BC',
  textMain: '#2C302E',
  textHeader: '#2C302E',
  textMuted: '#787F7B',
  textSubtle: '#5A605D',
  accent: '#0369A1',
  accentHoverBorder: '#0284c7',
  accentText: '#FFFFFF',
  btnDefaultBg: '#F2EFE9',
  btnDefaultBorder: '#CFC9BC',
  btnDefaultText: '#2C302E',
  btnDefaultHover: '#DED9CD',
  danger: '#B91C1C',
  dangerBg: 'rgba(185, 28, 28, 0.14)',
  dangerHover: '#991B1B',
  warning: '#B45309',
  warningBg: 'rgba(180, 83, 9, 0.14)',
  success: '#15803D',
  successBg: 'rgba(21, 128, 61, 0.14)',
  trendUp: '#15803D',
  trendDown: '#B91C1C',
  pinnedShadow: 'rgba(44, 48, 46, 0.12)',
  backdropBg: 'rgba(44, 48, 46, 0.35)',

  scrollThumb: '#A8A295',
  scrollThumbHover: '#787368',
  bgSticky: '#ECE8DF',
  bgStickyEven: '#EEEAE0',
  bgStickyOdd: '#E6E2D8',
  badgeActiveBg: 'rgba(21, 128, 61, 0.14)',
  badgePendingBg: 'rgba(180, 83, 9, 0.14)',
  badgePendingText: '#B45309',
  badgeLockedBg: 'rgba(185, 28, 28, 0.14)',
};

export const EINK_THEME_TOKENS = EINK_PAPER_THEME_TOKENS;
export const WARM_EINK_THEME_TOKENS = EINK_PAPER_THEME_TOKENS;

export const einkPalette = {
  bgEven: '#f5f2eb',
  bgOdd: '#ebe7de',
  bgSelected: '#d3e0ea',
  bgHeader: '#e4dfd3',
  bgStickyEven: '#eeeae0',
  bgStickyOdd: '#e6e2d8',
  borderColor: '#cfc9bc',
  textPrimary: '#2c302e',
  textSecondary: '#5a605d',
  accentColor: '#0369a1',
  posColor: '#15803d',
  negColor: '#b91c1c',
};
