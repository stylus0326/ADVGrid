import {
  GridTheme,
  GridThemeTokens,
  SURFACE_THEMES,
  THEME_SELECTORS,
  REGISTERED_THEMES,
  buildThemeSelectors,
  renderTokensCssBlock,
} from './common';
import { LIGHT_THEME_TOKENS } from './light';
import { DARK_THEME_TOKENS } from './dark';
import { BEZIER_ARTHOUSE_THEME_TOKENS } from './bezierArthouse';
import { EINK_PAPER_THEME_TOKENS } from './eink';

export * from './common';
export * from './light';
export * from './dark';
export * from './bezierArthouse';
export * from './eink';

/**
 * Tập hợp toàn bộ bảng màu của các giao diện chính
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
 * Lấy token màu theo theme, fallback về Light nếu không tìm thấy
 */
export function getThemeTokens(theme: GridTheme | string = SURFACE_THEMES.LIGHT): GridThemeTokens {
  return THEME_TOKENS[theme as string] || THEME_TOKENS[SURFACE_THEMES.LIGHT];
}

/**
 * Sinh mã CSS Variables tự động cho toàn bộ ứng dụng từ toàn bộ các theme đã đăng ký.
 */
export function generateThemeCssVariables(
  customTokens?: Record<string, GridThemeTokens>
): string {
  const mergedTokens: Record<string, GridThemeTokens | undefined> = {
    ...THEME_TOKENS,
    ...(customTokens || {}),
  };

  const activeThemeKeys = REGISTERED_THEMES.map((t) => t.id);

  const cssBlocks = activeThemeKeys.map((themeKey) => {
    const tokens = mergedTokens[themeKey] || mergedTokens.light || LIGHT_THEME_TOKENS;
    const selectors = THEME_SELECTORS[themeKey] || buildThemeSelectors(themeKey);
    return renderTokensCssBlock(tokens, selectors);
  });

  const scrollbarCss = `
    /* Đồng bộ thanh cuộn (Scrollbar) theo biến màu theme */
    * {
      scrollbar-width: thin;
      scrollbar-color: var(--scroll-thumb, var(--agv-border-strong, #cbd5e1)) var(--agv-bg-root, transparent);
    }

    ::-webkit-scrollbar {
      width: 10px;
      height: 10px;
    }

    ::-webkit-scrollbar-track {
      background: var(--agv-bg-root, transparent);
    }

    ::-webkit-scrollbar-thumb {
      background: var(--scroll-thumb, var(--agv-border-strong, #cbd5e1));
      border-radius: 6px;
      border: 2px solid var(--agv-bg-root, transparent);
    }

    ::-webkit-scrollbar-thumb:hover {
      background: var(--scroll-thumb-hover, var(--agv-text-muted, #94a3b8));
    }

    ::-webkit-scrollbar-corner {
      background: var(--agv-bg-root, transparent);
    }
  `;

  const einkOptimizationCss = `
    .agv-e-ink,
    .theme-eink,
    html.theme-eink {
      -webkit-font-smoothing: subpixel-antialiased !important;
      -moz-osx-font-smoothing: auto !important;
    }
  `;

  return [...cssBlocks, scrollbarCss, einkOptimizationCss].join('\n');
}
