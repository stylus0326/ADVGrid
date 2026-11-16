import { GridTheme, GridThemeTokens } from './common';
export * from './common';
export * from './light';
export * from './dark';
export declare const DAY_THEME_TOKENS: Record<string, GridThemeTokens>;
export declare const NIGHT_THEME_TOKENS: Record<string, GridThemeTokens>;
export declare const THEME_TOKENS: Record<string, GridThemeTokens>;
export declare function getThemeTokens(theme?: GridTheme | string, isDark?: boolean): GridThemeTokens;
export declare function generateThemeCssVariables(): string;
