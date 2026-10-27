/* ==============================================================================
   HỆ THỐNG MÀU GIAO DIỆN CHUNG (COMMON THEME SYSTEM) - SINGLE SOURCE OF TRUTH
   Quản lý toàn diện: Types, Selectors, Theme Class Registry, Helpers & CSS Engine
   ============================================================================== */

export type GridTheme = 'light' | 'dark' | 'bezier-arthouse' | 'e-ink' | 'eink' | string;

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
  accentHoverBorder?: string;
  accentText: string;
  btnDefaultBg: string;
  btnDefaultBorder: string;
  btnDefaultText: string;
  btnDefaultHover: string;
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
  id: string;
  name: string;
  class: string;
  iconName: 'Sun' | 'Moon' | 'BookOpen' | 'Palette' | string;
  iconColorClass: string;
}

/**
 * Registry danh sách toàn bộ các giao diện được đăng ký trong hệ thống
 */
export const REGISTERED_THEMES: ThemeMeta[] = [
  {
    id: 'light',
    name: 'Sáng',
    class: 'agv-light',
    iconName: 'Sun',
    iconColorClass: 'text-amber-500',
  },
  {
    id: 'dark',
    name: 'Balham Dark',
    class: 'agv-dark',
    iconName: 'Moon',
    iconColorClass: 'text-blue-400',
  },
  {
    id: 'bezier-arthouse',
    name: 'Bezier Art House',
    class: 'agv-bezier-arthouse',
    iconName: 'Palette',
    iconColorClass: 'text-amber-400',
  },
  {
    id: 'e-ink',
    name: 'Giấy E-Ink',
    class: 'agv-e-ink theme-eink',
    iconName: 'BookOpen',
    iconColorClass: 'text-emerald-700',
  },
];

/**
 * Bản đồ ánh xạ tên Theme -> CSS Class tương ứng.
 */
export const THEME_CLASS_MAP: Record<string, string> = {
  light: 'agv-light',
  daylight: 'agv-light',
  dark: 'agv-dark',
  'calibrated-dark': 'agv-dark',
  'deep-dark': 'agv-dark',
  'bezier-arthouse': 'agv-bezier-arthouse',
  'e-ink': 'agv-e-ink theme-eink',
  eink: 'agv-e-ink theme-eink',
};

/**
 * Chuẩn hóa tên theme về các id chính thức ('light', 'dark', 'bezier-arthouse', 'e-ink')
 */
export function normalizeThemeId(theme?: string | null): string {
  if (!theme) return 'light';
  if (theme === 'daylight') return 'light';
  if (theme === 'calibrated-dark' || theme === 'deep-dark') return 'dark';
  if (theme === 'eink') return 'e-ink';
  return theme;
}

/**
 * Lấy class CSS chuẩn của theme.
 */
export function getThemeClass(theme?: string | null, fallback: string = 'agv-light'): string {
  if (!theme) return fallback;
  if (THEME_CLASS_MAP[theme]) return THEME_CLASS_MAP[theme];
  if (theme.startsWith('agv-')) return theme;
  return `agv-${theme}`;
}

/**
 * Lấy thông tin metadata (tên hiển thị, icon, màu sắc) của theme
 */
export function getThemeMeta(theme?: string | null): ThemeMeta {
  const norm = normalizeThemeId(theme);
  return (
    REGISTERED_THEMES.find((t) => t.id === norm) || {
      id: norm,
      name: norm,
      class: getThemeClass(norm),
      iconName: 'Sun',
      iconColorClass: 'text-gray-400',
    }
  );
}

/**
 * Lấy tên thân thiện để hiển thị của theme
 */
export function getThemeName(theme?: string | null): string {
  return getThemeMeta(theme).name;
}

/**
 * Tự động chuyển đổi xoay vòng sang giao diện kế tiếp trong danh sách REGISTERED_THEMES.
 */
export function getNextTheme(currentTheme?: string | null): GridTheme {
  const norm = normalizeThemeId(currentTheme);
  const idx = REGISTERED_THEMES.findIndex((t) => t.id === norm);
  if (idx === -1 || idx === REGISTERED_THEMES.length - 1) {
    return REGISTERED_THEMES[0].id;
  }
  return REGISTERED_THEMES[idx + 1].id;
}

/**
 * Sinh danh sách CSS Selectors tự động cho mọi theme
 */
export function buildThemeSelectors(themeKey: string, themeClass?: string): string[] {
  const cls = themeClass || (themeKey === 'e-ink' || themeKey === 'eink' ? 'agv-e-ink' : `agv-${themeKey}`);
  const baseSelectors = [
    `.agv-app-container.${cls}`,
    `.agv-grid-root.${cls}`,
    `[data-theme="${themeKey}"]`,
    `.${cls}`,
  ];

  if (themeKey === 'light') {
    return [
      ':root',
      '.agv-app-container.agv-light',
      '.agv-app-container',
      '.agv-grid-root',
      '.agv-grid-root.agv-light',
      ...baseSelectors,
    ];
  }

  if (themeKey === 'e-ink' || themeKey === 'eink') {
    return [
      ...baseSelectors,
      '.agv-app-container.theme-eink',
      '.agv-grid-root.theme-eink',
      'html.theme-eink',
    ];
  }

  return baseSelectors;
}

/**
 * Danh sách selector DOM được áp dụng biến CSS cho từng Theme
 */
export const THEME_SELECTORS: Record<string, string[]> = {
  light: buildThemeSelectors('light', 'agv-light'),
  dark: buildThemeSelectors('dark', 'agv-dark'),
  'bezier-arthouse': buildThemeSelectors('bezier-arthouse', 'agv-bezier-arthouse'),
  'e-ink': buildThemeSelectors('e-ink', 'agv-e-ink'),
  eink: buildThemeSelectors('e-ink', 'agv-e-ink'),
};

/**
 * Render chuỗi CSS variables từ một bộ token màu
 */
export function renderTokensCssBlock(tokens: GridThemeTokens, selectors: string[]): string {
  const selectorList = selectors.join(',\n  ');
  return `
  ${selectorList} {
    --agv-bg-root: ${tokens.bgRoot};
    --agv-bg-header: ${tokens.bgHeader};
    --agv-bg-row: ${tokens.bgRow};
    --agv-bg-row-alt: ${tokens.bgRowAlt};
    --agv-bg-hover: ${tokens.bgHover};
    --agv-bg-selected: ${tokens.bgSelected};
    --agv-bg-popup: ${tokens.bgPopup};
    --agv-bg-item-hover: ${tokens.bgItemHover};
    --agv-bg-item-active: ${tokens.bgItemActive};
    --agv-bg-control: ${tokens.bgControl};
    --agv-bg-control-hover: ${tokens.bgControlHover};
    --agv-border: ${tokens.border};
    --agv-border-strong: ${tokens.borderStrong};
    --agv-border-popup: ${tokens.borderPopup};
    --agv-text-main: ${tokens.textMain};
    --agv-text-header: ${tokens.textHeader};
    --agv-text-muted: ${tokens.textMuted};
    --agv-text-subtle: ${tokens.textSubtle};
    --agv-text-active: ${tokens.accent};
    --agv-accent: ${tokens.accent};
    --agv-accent-hover: ${tokens.accent};
    --agv-accent-hover-border: ${tokens.accentHoverBorder || `color-mix(in srgb, ${tokens.accent} 55%, ${tokens.borderStrong})`};
    --agv-accent-text: ${tokens.accentText};
    --agv-focus-ring: ${tokens.accent};
    --agv-btn-default-bg: ${tokens.btnDefaultBg};
    --agv-btn-default-border: ${tokens.btnDefaultBorder};
    --agv-btn-default-text: ${tokens.btnDefaultText};
    --agv-btn-default-hover: ${tokens.btnDefaultHover};
    --agv-danger: ${tokens.danger};
    --agv-danger-bg: ${tokens.dangerBg};
    --agv-danger-hover: ${tokens.dangerHover};
    --agv-warning: ${tokens.warning};
    --agv-warning-bg: ${tokens.warningBg};
    --agv-success: ${tokens.success};
    --agv-success-bg: ${tokens.successBg};
    --agv-trend-up: ${tokens.trendUp};
    --agv-trend-down: ${tokens.trendDown};
    --agv-shadow-pinned: ${tokens.pinnedShadow};
    --agv-backdrop-bg: ${tokens.backdropBg};

    /* Biến đặc tả Specification Variables */
    --bg-app: ${tokens.bgRoot};
    --bg-panel: ${tokens.bgPopup};
    --bg-row-even: ${tokens.bgRow};
    --bg-row-odd: ${tokens.bgRowAlt};
    --bg-row-hover: ${tokens.bgHover};
    --bg-row-selected: ${tokens.bgSelected};
    --bg-header: ${tokens.bgHeader};
    --bg-sticky: ${tokens.bgSticky || tokens.bgRowAlt};
    --border-color: ${tokens.border};
    --text-primary: ${tokens.textMain};
    --text-secondary: ${tokens.textSubtle};
    --text-muted: ${tokens.textMuted};
    --accent-color: ${tokens.accent};
    --pos-color: ${tokens.trendUp};
    --neg-color: ${tokens.trendDown};
    --scroll-thumb: ${tokens.scrollThumb || tokens.borderStrong};
    --scroll-thumb-hover: ${tokens.scrollThumbHover || tokens.textSubtle};
  }
`;
}
