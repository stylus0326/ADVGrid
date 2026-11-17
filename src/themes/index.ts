import {
  SURFACE_THEMES,
  GridTheme,
  GridThemeTokens,
  normalizeThemeId,
} from './common';
import { LIGHT_THEME_TOKENS } from './light';
import { DARK_THEME_TOKENS } from './dark';

export * from './common';
export * from './light';
export * from './dark';

export const DAY_THEME_TOKENS: Record<string, GridThemeTokens> = {
  [SURFACE_THEMES.LIGHT]: LIGHT_THEME_TOKENS,
  [SURFACE_THEMES.LIQUID_LIGHT]: LIGHT_THEME_TOKENS,
};

export const NIGHT_THEME_TOKENS: Record<string, GridThemeTokens> = {
  [SURFACE_THEMES.DARK]: DARK_THEME_TOKENS,
  [SURFACE_THEMES.LIQUID_DARK]: DARK_THEME_TOKENS,
};

export const THEME_TOKENS: Record<string, GridThemeTokens> = {
  [SURFACE_THEMES.LIGHT]: LIGHT_THEME_TOKENS,
  [SURFACE_THEMES.DARK]: DARK_THEME_TOKENS,
  [SURFACE_THEMES.LIQUID_LIGHT]: LIGHT_THEME_TOKENS,
  [SURFACE_THEMES.LIQUID_DARK]: DARK_THEME_TOKENS,
};

export function getThemeTokens(
  theme: GridTheme | string = SURFACE_THEMES.LIGHT,
  isDark?: boolean
): GridThemeTokens {
  if (typeof isDark === 'boolean') {
    return isDark ? DARK_THEME_TOKENS : LIGHT_THEME_TOKENS;
  }
  return normalizeThemeId(theme) === SURFACE_THEMES.DARK
    ? DARK_THEME_TOKENS
    : LIGHT_THEME_TOKENS;
}

/**
 * CSS variables được nạp trực tiếp qua src/styles/design-tokens.css;
 * hàm này được giữ lại dưới dạng no-op tương thích.
 */
export function generateThemeCssVariables(): string {
  return '';
}
