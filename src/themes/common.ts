import { TWEAKCN_THEME_PRESETS } from './presets/data';

/* ==============================================================================
   HỆ THỐNG MÀU GIAO DIỆN CHUNG (COMMON THEME SYSTEM) - TWEAKCN 42 THEMES
   Quản lý toàn diện: Types, Selectors, Theme Class Registry, Helpers & CSS Engine
   ============================================================================== */

export const SURFACE_THEMES = {
  MODERN_MINIMAL: 'modern-minimal',
  VIOLET_BLOOM: 'violet-bloom',
  T3_CHAT: 't3-chat',
  MOCHA_MOUSSE: 'mocha-mousse',
  AMETHYST_HAZE: 'amethyst-haze',
  DOOM_64: 'doom-64',
  KODAMA_GROVE: 'kodama-grove',
  COSMIC_NIGHT: 'cosmic-night',
  QUANTUM_ROSE: 'quantum-rose',
  BOLD_TECH: 'bold-tech',
  ELEGANT_LUXURY: 'elegant-luxury',
  AMBER_MINIMAL: 'amber-minimal',
  NEO_BRUTALISM: 'neo-brutalism',
  SOLAR_DUSK: 'solar-dusk',
  PASTEL_DREAMS: 'pastel-dreams',
  CLEAN_SLATE: 'clean-slate',
  OCEAN_BREEZE: 'ocean-breeze',
  RETRO_ARCADE: 'retro-arcade',
  MIDNIGHT_BLOOM: 'midnight-bloom',
  NORTHERN_LIGHTS: 'northern-lights',
  VINTAGE_PAPER: 'vintage-paper',
  SUNSET_HORIZON: 'sunset-horizon',
  STARRY_NIGHT: 'starry-night',
  SOFT_POP: 'soft-pop',
  SAGE_GARDEN: 'sage-garden',
  TWITTER: 'twitter',
  BUBBLEGUM: 'bubblegum',
  NOTEBOOK: 'notebook',
  CATPPUCCIN: 'catppuccin',
  GRAPHITE: 'graphite',
  PERPETUITY: 'perpetuity',
  TANGERINE: 'tangerine',
  NATURE: 'nature',
  SUPABASE: 'supabase',
  CLAYMORPHISM: 'claymorphism',
  CYBERPUNK: 'cyberpunk',
  CAFFEINE: 'caffeine',
  CANDYLAND: 'candyland',
  CLAUDE: 'claude',
  VERCEL: 'vercel',
  DARKMATTER: 'darkmatter',
  MONO: 'mono',

  // Alias để bảo toàn tương thích ngược cho các component gọi tên cũ
  LIGHT: 'modern-minimal',
  DAYLIGHT: 'modern-minimal',
  DARK: 'darkmatter',
  CALIBRATED_DARK: 'darkmatter',
  DEEP_DARK: 'darkmatter',
  BEZIER_ARTHOUSE: 'amber-minimal',
  E_INK: 'vintage-paper',
  EINK: 'vintage-paper',
  TWEAKCN_DEMO: 'amber-minimal',
  TWEAKCN_DEMO_DARK: 'darkmatter',
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
 * Registry danh sách toàn bộ 42 giao diện Tweakcn được đăng ký trong hệ thống
 */
export const REGISTERED_THEMES: ThemeMeta[] = Object.entries(TWEAKCN_THEME_PRESETS).map(
  ([key, preset]) => ({
    id: key,
    name: preset.label,
    class: `agv-theme-${key}`,
    iconName: 'Palette',
    iconColorClass: 'text-[var(--agv-accent)]',
  })
);

/**
 * Bản đồ ánh xạ tên Theme -> CSS Class tương ứng.
 */
export const THEME_CLASS_MAP: Record<string, string> = {
  ...Object.fromEntries(
    Object.keys(TWEAKCN_THEME_PRESETS).map((k) => [k, `agv-theme-${k}`])
  ),
  light: 'agv-theme-modern-minimal',
  dark: 'agv-theme-darkmatter agv-dark',
  'bezier-arthouse': 'agv-theme-amber-minimal',
  'e-ink': 'agv-theme-vintage-paper',
  eink: 'agv-theme-vintage-paper',
};

/**
 * Chuẩn hóa tên theme về id chính thức
 */
export function normalizeThemeId(theme?: string | null): string {
  if (!theme) return 'modern-minimal';
  if (theme === 'light' || theme === 'daylight') return 'modern-minimal';
  if (theme === 'dark' || theme === 'calibrated-dark' || theme === 'deep-dark') return 'darkmatter';
  if (theme === 'bezier-arthouse') return 'amber-minimal';
  if (theme === 'e-ink' || theme === 'eink') return 'vintage-paper';
  if (TWEAKCN_THEME_PRESETS[theme]) return theme;
  return 'modern-minimal';
}

/**
 * Lấy class CSS chuẩn của theme.
 */
export function getThemeClass(theme?: string | null, fallback: string = 'agv-theme-modern-minimal'): string {
  if (!theme) return fallback;
  const norm = normalizeThemeId(theme);
  if (THEME_CLASS_MAP[norm]) return THEME_CLASS_MAP[norm];
  if (theme.startsWith('agv-')) return theme;
  return `agv-theme-${norm}`;
}

/**
 * Lấy thông tin metadata (tên hiển thị, icon, màu sắc) của theme
 */
export function getThemeMeta(theme?: string | null): ThemeMeta {
  const norm = normalizeThemeId(theme);
  return (
    REGISTERED_THEMES.find((t) => t.id === norm) || {
      id: norm,
      name: TWEAKCN_THEME_PRESETS[norm]?.label || norm,
      class: getThemeClass(norm),
      iconName: 'Palette',
      iconColorClass: 'text-[var(--agv-accent)]',
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
  const cls = themeClass || `agv-theme-${themeKey}`;
  const baseSelectors = [
    `.agv-app-container.${cls}`,
    `.agv-grid-root.${cls}`,
    `[data-theme="${themeKey}"]`,
    `.${cls}`,
  ];

  if (themeKey === 'modern-minimal') {
    return [
      ':root',
      '.agv-app-container',
      '.agv-grid-root',
      ...baseSelectors,
    ];
  }

  return baseSelectors;
}

/**
 * Danh sách Theme Selectors cố định tối ưu hóa tra cứu O(1)
 */
export const THEME_SELECTORS: Record<string, string[]> = Object.fromEntries(
  Object.keys(TWEAKCN_THEME_PRESETS).map((key) => [
    key,
    buildThemeSelectors(key, `agv-theme-${key}`),
  ])
);

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
    --agv-bg-row-hover: color-mix(in srgb, ${tokens.accent} 6%, ${tokens.bgHover});
    --agv-bg-selected: ${tokens.bgSelected};
    --agv-bg-selected-hover: color-mix(in srgb, ${tokens.accent} 16%, ${tokens.bgHover});
    --agv-bg-focused: color-mix(in srgb, ${tokens.accent} 11%, ${tokens.bgRoot});
    --agv-bg-focused-hover: color-mix(in srgb, ${tokens.accent} 15%, ${tokens.bgRoot});
    --agv-bg-checked-focused: color-mix(in srgb, ${tokens.accent} 24%, ${tokens.bgRoot});
    --agv-bg-checked-focused-hover: color-mix(in srgb, ${tokens.accent} 28%, ${tokens.bgRoot});
    --agv-bg-popup: ${tokens.bgPopup};
    --agv-bg-panel: ${tokens.bgPopup};
    --agv-bg-surface: ${tokens.bgPopup};
    --agv-bg-subtle: ${tokens.bgRowAlt};
    --agv-bg-card: ${tokens.bgRowAlt};
    --agv-bg-item-hover: ${tokens.bgItemHover};
    --agv-bg-item-active: ${tokens.bgItemActive};
    --agv-bg-control: ${tokens.bgControl};
    --agv-bg-control-hover: ${tokens.bgControlHover};
    --agv-border: ${tokens.border};
    --agv-border-subtle: ${tokens.border};
    --agv-border-strong: ${tokens.borderStrong};
    --agv-border-popup: ${tokens.borderPopup};
    --agv-text-main: ${tokens.textMain};
    --agv-text-header: ${tokens.textHeader};
    --agv-text-muted: ${tokens.textMuted};
    --agv-text-subtle: ${tokens.textSubtle};
    --agv-text-active: ${tokens.accent};
    --agv-accent: ${tokens.accent};
    --agv-accent-soft: color-mix(in srgb, ${tokens.accent} 18%, transparent);
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
    --agv-weekend: ${tokens.danger};
    --agv-warning: ${tokens.warning};
    --agv-warning-bg: ${tokens.warningBg};
    --agv-success: ${tokens.success};
    --agv-success-bg: ${tokens.successBg};
    --agv-info: ${tokens.accent};
    --agv-trend-up: ${tokens.trendUp};
    --agv-trend-down: ${tokens.trendDown};
    --agv-shadow-pinned: ${tokens.pinnedShadow};
    --agv-pinned-shadow: ${tokens.pinnedShadow};
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

    /* Biến chuẩn Tweakcn / Shadcn UI */
    --background: ${tokens.bgRoot};
    --foreground: ${tokens.textMain};
    --card: ${tokens.bgRowAlt || tokens.bgControl};
    --card-foreground: ${tokens.textMain};
    --popover: ${tokens.bgPopup};
    --popover-foreground: ${tokens.textMain};
    --primary: ${tokens.accent};
    --primary-foreground: ${tokens.accentText};
    --secondary: ${tokens.bgSelected};
    --secondary-foreground: ${tokens.textMain};
    --muted: ${tokens.bgControl};
    --muted-foreground: ${tokens.textMuted};
    --accent: ${tokens.bgHover};
    --accent-foreground: ${tokens.textMain};
    --destructive: ${tokens.danger};
    --destructive-foreground: #ffffff;
    --border: ${tokens.border};
    --input: ${tokens.borderStrong};
    --ring: ${tokens.accent};
    --radius: 0.5rem;
    --scroll-thumb: ${tokens.scrollThumb || tokens.borderStrong};
    --scroll-thumb-hover: ${tokens.scrollThumbHover || tokens.textSubtle};
  }
`;
}
