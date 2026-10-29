import {
  GridTheme,
  GridThemeTokens,
  SURFACE_THEMES,
  THEME_SELECTORS,
  REGISTERED_THEMES,
  buildThemeSelectors,
  renderTokensCssBlock,
} from './common';
import {
  TWEAKCN_THEME_PRESETS,
  getPresetById,
  getPresetTokens,
  DEFAULT_PRESET_ID,
  getAllPresetOptions,
  convertPresetToGridTokens,
  generatePresetCssVariables,
} from './presets';

export * from './common';
export * from './presets';

/**
 * Các hằng số tương thích ngược xuất phát từ 42 presets mới
 */
export const LIGHT_THEME_TOKENS: GridThemeTokens = getPresetTokens('modern-minimal', 'light');
export const DARK_THEME_TOKENS: GridThemeTokens = getPresetTokens('darkmatter', 'dark');
export const BEZIER_ARTHOUSE_THEME_TOKENS: GridThemeTokens = getPresetTokens('amber-minimal', 'light');
export const EINK_PAPER_THEME_TOKENS: GridThemeTokens = getPresetTokens('vintage-paper', 'light');
export const TWEAKCN_DEMO_LIGHT_THEME_TOKENS: GridThemeTokens = getPresetTokens('amber-minimal', 'light');
export const TWEAKCN_DEMO_DARK_THEME_TOKENS: GridThemeTokens = getPresetTokens('amber-minimal', 'dark');

/**
 * Tập hợp toàn bộ bảng màu của 42 giao diện Tweakcn (Light mode mặc định)
 */
export const THEME_TOKENS: Record<string, GridThemeTokens> = Object.fromEntries(
  Object.keys(TWEAKCN_THEME_PRESETS).map((key) => [
    key,
    getPresetTokens(key, 'light'),
  ])
);

/**
 * Lấy token màu theo theme và mode (mặc định light)
 */
export function getThemeTokens(
  theme: GridTheme | string = DEFAULT_PRESET_ID,
  mode: 'light' | 'dark' = 'light'
): GridThemeTokens {
  const isDark = mode === 'dark' || (typeof theme === 'string' && theme.endsWith('-dark'));
  const cleanId = typeof theme === 'string' ? theme.replace(/-dark$/, '') : DEFAULT_PRESET_ID;
  return getPresetTokens(cleanId, isDark ? 'dark' : 'light');
}

/**
 * Sinh mã CSS Variables tự động cho toàn bộ ứng dụng từ toàn bộ 42 theme đã đăng ký.
 * Hỗ trợ cả 2 chế độ Sáng (Light) và Tối (Dark).
 */
export function generateThemeCssVariables(): string {
  const cssBlocks = REGISTERED_THEMES.map((themeMeta) => {
    const lightTokens = getPresetTokens(themeMeta.id, 'light');
    const darkTokens = getPresetTokens(themeMeta.id, 'dark');

    const lightSelectors = buildThemeSelectors(themeMeta.id, themeMeta.class);
    const darkSelectors = [
      `.dark .agv-app-container.${themeMeta.class}`,
      `.dark .${themeMeta.class}`,
      `[data-theme-mode="dark"] .${themeMeta.class}`,
      `[data-theme-mode="dark"].${themeMeta.class}`,
      `.agv-app-container.dark.${themeMeta.class}`,
      `.agv-app-container.${themeMeta.class}.dark`,
    ];

    const lightCss = renderTokensCssBlock(lightTokens, lightSelectors);
    const darkCss = renderTokensCssBlock(darkTokens, darkSelectors);
    return `${lightCss}\n${darkCss}`;
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

  return [...cssBlocks, scrollbarCss].join('\n');
}
