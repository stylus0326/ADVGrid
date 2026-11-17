/* ==============================================================================
   HỆ THỐNG CHỦ ĐỀ SÁNG / TỐI PNT B2B (COMMON THEME SYSTEM)
   Đồng bộ 100% theo bộ token tại D:\Dự án\b2b-pnt\styles\design-tokens.css
   ============================================================================== */

export const SURFACE_THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  LIQUID_LIGHT: 'liquid-light',
  LIQUID_DARK: 'liquid-dark',
} as const;

export type GridTheme = (typeof SURFACE_THEMES)[keyof typeof SURFACE_THEMES] | string;

export interface GridThemeTokens {
  bgRoot: string;
  bgHeader: string;
  bgRow: string;
  bgRowAlt: string;
  bgHover: string;
  bgSelected: string;
  bgPopup: string;
  bgItemHover: string;
  bgItemActive: string;
  bgControl: string;
  bgControlHover: string;
  border: string;
  borderStrong: string;
  borderPopup: string;
  textMain: string;
  textHeader: string;
  textMuted: string;
  textSubtle: string;
  accent: string;
  accentHover?: string;
  accentActive?: string;
  accentHoverBorder?: string;
  accentText: string;
  focusRing?: string;
  focusHalo?: string;
  btnDefaultBg: string;
  btnDefaultBorder: string;
  btnDefaultText: string;
  btnDefaultHover: string;
  btnDefaultActive?: string;
  danger: string;
  dangerBg: string;
  dangerHover: string;
  warning: string;
  warningBg: string;
  success: string;
  successBg: string;
  trendUp: string;
  trendDown: string;
  pinnedShadow: string;
  backdropBg: string;
  scrollThumb?: string;
  scrollThumbHover?: string;
  bgSticky?: string;
  bgStickyEven?: string;
  bgStickyOdd?: string;
  badgeActiveBg?: string;
  badgePendingBg?: string;
  badgePendingText?: string;
  badgeLockedBg?: string;
}

export interface ThemeMeta {
  id: 'light' | 'dark';
  name: string;
  class: string;
  iconName: 'Sun' | 'Moon';
  iconColorClass: string;
}

export const REGISTERED_THEMES: ThemeMeta[] = [
  {
    id: SURFACE_THEMES.LIGHT,
    name: 'Sáng',
    class: '',
    iconName: 'Sun',
    iconColorClass: 'text-status-warning-foreground',
  },
  {
    id: SURFACE_THEMES.DARK,
    name: 'Tối',
    class: 'dark',
    iconName: 'Moon',
    iconColorClass: 'text-brand-gold-on-dark',
  },
];

export const THEME_CLASS_MAP: Record<string, string> = {
  [SURFACE_THEMES.LIGHT]: '',
  [SURFACE_THEMES.DARK]: 'dark',
  [SURFACE_THEMES.LIQUID_LIGHT]: 'agv-liquid',
  [SURFACE_THEMES.LIQUID_DARK]: 'dark agv-liquid',
};

/**
 * Kiểm tra theme có thuộc chế độ kính lỏng (Liquid Glass) hay không.
 */
export function isLiquidTheme(theme?: string | null): boolean {
  if (!theme) return false;
  const v = theme.trim().toLowerCase();
  return v === 'liquid' || v === 'liquid-light' || v === 'liquid-dark' || v === 'glass';
}

/**
 * Chuẩn hóa tên theme về 'light' hoặc 'dark' theo b2b-pnt.
 */
export function normalizeThemeId(theme?: string | null): 'light' | 'dark' {
  if (!theme) return SURFACE_THEMES.LIGHT;
  const v = theme.trim().toLowerCase();
  if (
    v === 'dark' ||
    v === 'calibrated-dark' ||
    v === 'deep-dark' ||
    v === 'liquid-dark'
  ) {
    return SURFACE_THEMES.DARK;
  }
  return SURFACE_THEMES.LIGHT;
}

/**
 * Trả về class theme chuẩn Tailwind dark mode ('dark' / 'agv-liquid') cho Grid và Portal.
 */
export function getThemeClass(theme?: string | null, _fallback = ''): string {
  const dark = normalizeThemeId(theme) === SURFACE_THEMES.DARK;
  const liquid = isLiquidTheme(theme);
  return [dark ? 'dark' : '', liquid ? 'agv-liquid' : ''].filter(Boolean).join(' ');
}

export function getThemeMeta(theme?: string | null): ThemeMeta {
  const norm = normalizeThemeId(theme);
  return REGISTERED_THEMES.find((m) => m.id === norm) || REGISTERED_THEMES[0];
}

export function getThemeName(theme?: string | null): string {
  return getThemeMeta(theme).name;
}

export function getNextTheme(currentTheme?: string | null): 'light' | 'dark' {
  return normalizeThemeId(currentTheme) === SURFACE_THEMES.DARK
    ? SURFACE_THEMES.LIGHT
    : SURFACE_THEMES.DARK;
}
