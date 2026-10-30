import {
  GridTheme,
  GridThemeTokens,
  SURFACE_THEMES,
  THEME_SELECTORS,
  REGISTERED_THEMES,
  buildThemeSelectors,
  renderTokensCssBlock,
  getCustomTokens,
  setCustomTokens,
} from './common';
import { LIGHT_THEME_TOKENS, LIGHT_THEME_DARK_TOKENS } from './light';
import { DARK_THEME_TOKENS, DARK_THEME_LIGHT_TOKENS } from './dark';
import { BEZIER_ARTHOUSE_THEME_TOKENS, BEZIER_ARTHOUSE_LIGHT_TOKENS } from './bezierArthouse';
import { EINK_PAPER_THEME_TOKENS, EINK_DARK_THEME_TOKENS } from './eink';

export * from './common';
export * from './light';
export * from './dark';
export * from './bezierArthouse';
export * from './eink';
export * from './customCssBridge';

/**
 * Bảng màu chế độ Ngày (Day Mode) cho toàn bộ các theme
 */
export const DAY_THEME_TOKENS: Record<string, GridThemeTokens> = {
  [SURFACE_THEMES.LIGHT]: LIGHT_THEME_TOKENS,
  [SURFACE_THEMES.DAYLIGHT]: LIGHT_THEME_TOKENS,
  [SURFACE_THEMES.DARK]: DARK_THEME_LIGHT_TOKENS,
  [SURFACE_THEMES.CALIBRATED_DARK]: DARK_THEME_LIGHT_TOKENS,
  [SURFACE_THEMES.DEEP_DARK]: DARK_THEME_LIGHT_TOKENS,
  [SURFACE_THEMES.BEZIER_ARTHOUSE]: BEZIER_ARTHOUSE_LIGHT_TOKENS,
  [SURFACE_THEMES.E_INK]: EINK_PAPER_THEME_TOKENS,
  [SURFACE_THEMES.EINK]: EINK_PAPER_THEME_TOKENS,
};

/**
 * Bảng màu chế độ Đêm (Night / Dark Mode) cho toàn bộ các theme
 */
export const NIGHT_THEME_TOKENS: Record<string, GridThemeTokens> = {
  [SURFACE_THEMES.LIGHT]: LIGHT_THEME_DARK_TOKENS,
  [SURFACE_THEMES.DAYLIGHT]: LIGHT_THEME_DARK_TOKENS,
  [SURFACE_THEMES.DARK]: DARK_THEME_TOKENS,
  [SURFACE_THEMES.CALIBRATED_DARK]: DARK_THEME_TOKENS,
  [SURFACE_THEMES.DEEP_DARK]: DARK_THEME_TOKENS,
  [SURFACE_THEMES.BEZIER_ARTHOUSE]: BEZIER_ARTHOUSE_THEME_TOKENS,
  [SURFACE_THEMES.E_INK]: EINK_DARK_THEME_TOKENS,
  [SURFACE_THEMES.EINK]: EINK_DARK_THEME_TOKENS,
};

/**
 * Tập hợp mặc định bảng màu cho các giao diện chính (Backward Compatibility)
 */
export const THEME_TOKENS: Record<string, GridThemeTokens> = {
  [SURFACE_THEMES.LIGHT]: LIGHT_THEME_TOKENS,
  [SURFACE_THEMES.DAYLIGHT]: LIGHT_THEME_TOKENS,
  [SURFACE_THEMES.DARK]: DARK_THEME_TOKENS,
  [SURFACE_THEMES.CALIBRATED_DARK]: DARK_THEME_TOKENS,
  [SURFACE_THEMES.DEEP_DARK]: DARK_THEME_TOKENS,
  [SURFACE_THEMES.BEZIER_ARTHOUSE]: BEZIER_ARTHOUSE_THEME_TOKENS,
  [SURFACE_THEMES.E_INK]: EINK_PAPER_THEME_TOKENS,
  [SURFACE_THEMES.EINK]: EINK_PAPER_THEME_TOKENS,
};

/**
 * Đăng ký / cập nhật token động cho giao diện Custom CSS
 */
export function setCustomThemeTokens(tokens: GridThemeTokens, darkTokens?: GridThemeTokens): void {
  setCustomTokens(tokens, darkTokens);
  THEME_TOKENS[SURFACE_THEMES.CUSTOM] = tokens;
  THEME_TOKENS['custom'] = tokens;
}

/**
 * Lấy token màu theo theme và trạng thái Ngày/Đêm, fallback an toàn nếu không tìm thấy
 */
export function getThemeTokens(
  theme: GridTheme | string = SURFACE_THEMES.LIGHT,
  isDark = false
): GridThemeTokens {
  if (theme === SURFACE_THEMES.CUSTOM || theme === 'custom') {
    const cust = getCustomTokens(isDark);
    if (cust) return cust;
  }
  const tokenMap = isDark ? NIGHT_THEME_TOKENS : DAY_THEME_TOKENS;
  return tokenMap[theme as string] || (isDark ? DARK_THEME_TOKENS : LIGHT_THEME_TOKENS);
}

/**
 * Sinh mã CSS Variables tự động cho toàn bộ ứng dụng từ toàn bộ các theme đã đăng ký.
 * Hỗ trợ song song cả 2 trạng thái Ngày (Day) và Đêm (Night) cho từng theme.
 */
export function generateThemeCssVariables(
  customTokens?: Record<string, GridThemeTokens>
): string {
  const cssBlocks: string[] = [];

  // 1. Theme Sáng (Light - Daylight)
  cssBlocks.push(renderTokensCssBlock(LIGHT_THEME_TOKENS, [
    'html:not(.dark) .agv-light',
    'html:not(.dark).agv-light',
    'body:not(.dark) .agv-light',
    'body:not(.dark).agv-light',
    'html:not(.dark) [data-theme="light"]',
    'body:not(.dark) [data-theme="light"]',
    '[data-theme="light"]:not(.dark)',
    '[data-theme="daylight"]:not(.dark)',
    '.agv-light:not(.dark)',
    '.agv-app-container.agv-light:not(.dark)',
    '.agv-grid-root.agv-light:not(.dark)',
    '.agv-light',
    '[data-theme="light"]',
    '[data-theme="daylight"]',
  ]));
  cssBlocks.push(renderTokensCssBlock(LIGHT_THEME_DARK_TOKENS, [
    'html.dark .agv-light',
    'html.dark.agv-light',
    'body.dark .agv-light',
    'body.dark.agv-light',
    'html.dark [data-theme="light"]',
    'body.dark [data-theme="light"]',
    '.dark .agv-light',
    '.dark.agv-light',
    '.dark[data-theme="light"]',
    '.dark[data-theme="daylight"]',
    '.agv-light.dark',
    '.agv-app-container.agv-light.dark',
    '.agv-grid-root.agv-light.dark',
  ]));

  // 2. Theme Balham
  cssBlocks.push(renderTokensCssBlock(DARK_THEME_LIGHT_TOKENS, [
    'html:not(.dark) .agv-dark',
    'html:not(.dark).agv-dark',
    'body:not(.dark) .agv-dark',
    'body:not(.dark).agv-dark',
    'html:not(.dark) [data-theme="dark"]',
    'html:not(.dark)[data-theme="dark"]',
    'body:not(.dark) [data-theme="dark"]',
    'body:not(.dark)[data-theme="dark"]',
    'html:not(.dark) [data-theme="calibrated-dark"]',
    'html:not(.dark) [data-theme="deep-dark"]',
    '.agv-dark:not(.dark)',
    '[data-theme="dark"]:not(.dark)',
  ]));
  cssBlocks.push(renderTokensCssBlock(DARK_THEME_TOKENS, [
    'html.dark .agv-dark',
    'html.dark.agv-dark',
    'body.dark .agv-dark',
    'body.dark.agv-dark',
    'html.dark [data-theme="dark"]',
    'body.dark [data-theme="dark"]',
    '.dark .agv-dark',
    '.dark.agv-dark',
    '.dark[data-theme="dark"]',
    '.dark[data-theme="calibrated-dark"]',
    '.dark[data-theme="deep-dark"]',
    '.agv-dark.dark',
    '.agv-dark',
    '[data-theme="dark"]',
    '[data-theme="calibrated-dark"]',
    '[data-theme="deep-dark"]',
    '.agv-app-container.agv-dark',
    '.agv-grid-root.agv-dark',
  ]));

  // 3. Theme The Bezier (Art House)
  cssBlocks.push(renderTokensCssBlock(BEZIER_ARTHOUSE_LIGHT_TOKENS, [
    'html:not(.dark) .agv-bezier-arthouse',
    'html:not(.dark).agv-bezier-arthouse',
    'body:not(.dark) .agv-bezier-arthouse',
    'body:not(.dark).agv-bezier-arthouse',
    'html:not(.dark) [data-theme="bezier-arthouse"]',
    'html:not(.dark)[data-theme="bezier-arthouse"]',
    'body:not(.dark) [data-theme="bezier-arthouse"]',
    '.agv-bezier-arthouse:not(.dark)',
    '[data-theme="bezier-arthouse"]:not(.dark)',
  ]));
  cssBlocks.push(renderTokensCssBlock(BEZIER_ARTHOUSE_THEME_TOKENS, [
    'html.dark .agv-bezier-arthouse',
    'html.dark.agv-bezier-arthouse',
    'body.dark .agv-bezier-arthouse',
    'body.dark.agv-bezier-arthouse',
    'html.dark [data-theme="bezier-arthouse"]',
    'body.dark [data-theme="bezier-arthouse"]',
    '.dark .agv-bezier-arthouse',
    '.dark.agv-bezier-arthouse',
    '.dark[data-theme="bezier-arthouse"]',
    '.agv-bezier-arthouse.dark',
    '.agv-bezier-arthouse',
    '[data-theme="bezier-arthouse"]',
    '.agv-app-container.agv-bezier-arthouse',
    '.agv-grid-root.agv-bezier-arthouse',
  ]));

  // 4. Theme Giấy E-Ink
  cssBlocks.push(renderTokensCssBlock(EINK_PAPER_THEME_TOKENS, [
    'html:not(.dark) .agv-e-ink',
    'html:not(.dark).agv-e-ink',
    'body:not(.dark) .agv-e-ink',
    'body:not(.dark).agv-e-ink',
    'html:not(.dark) .theme-eink',
    'html:not(.dark) [data-theme="e-ink"]',
    'body:not(.dark) [data-theme="e-ink"]',
    '.agv-e-ink:not(.dark)',
    '.theme-eink:not(.dark)',
    '[data-theme="e-ink"]:not(.dark)',
    '.agv-e-ink',
    '.theme-eink',
    '[data-theme="e-ink"]',
    '[data-theme="eink"]',
    '.agv-app-container.agv-e-ink',
    '.agv-grid-root.agv-e-ink',
  ]));
  cssBlocks.push(renderTokensCssBlock(EINK_DARK_THEME_TOKENS, [
    'html.dark .agv-e-ink',
    'html.dark.agv-e-ink',
    'html.dark .theme-eink',
    'html.dark.theme-eink',
    'body.dark .agv-e-ink',
    'body.dark.agv-e-ink',
    'body.dark .theme-eink',
    'body.dark.theme-eink',
    'html.dark [data-theme="e-ink"]',
    'body.dark [data-theme="e-ink"]',
    '.dark .agv-e-ink',
    '.dark.agv-e-ink',
    '.dark .theme-eink',
    '.dark.theme-eink',
    '.dark[data-theme="e-ink"]',
    '.dark[data-theme="eink"]',
    '.agv-e-ink.dark',
  ]));

  const einkOptimizationCss = `
    .agv-e-ink,
    .theme-eink,
    html.theme-eink {
      -webkit-font-smoothing: subpixel-antialiased !important;
      -moz-osx-font-smoothing: auto !important;
    }
  `;

  return [...cssBlocks, einkOptimizationCss].join('\n');
}
