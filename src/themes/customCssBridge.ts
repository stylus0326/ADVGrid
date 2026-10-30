/**
 * Bộ công cụ phân tích và ánh xạ CSS Theme tùy biến sang Grid Engine (Zero-Conflict Bridge)
 */

import {
  GridThemeTokens,
  renderTokensCssBlock,
  setCustomTokens,
} from './common';

export const DEFAULT_TEST_CSS_SNIPPET = `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 24 33.3333% 97.0588%;
    --foreground: 0 0% 10.1961%;
    --card: 24 33.3333% 97.0588%;
    --card-foreground: 0 0% 10.1961%;
    --popover: 24 33.3333% 97.0588%;
    --popover-foreground: 0 0% 10.1961%;
    --primary: 0 55.7789% 39.0196%;
    --primary-foreground: 0 0% 100%;
    --secondary: 43.0769 90.6977% 91.5686%;
    --secondary-foreground: 39.8438 100% 25.0980%;
    --muted: 22.5000 21.0526% 92.5490%;
    --muted-foreground: 33.3333 5.4545% 32.3529%;
    --accent: 48.0000 96.4912% 88.8235%;
    --accent-foreground: 0 62.8205% 30.5882%;
    --destructive: 0 70% 35.2941%;
    --destructive-foreground: 0 0% 100%;
    --border: 37.7143 63.6364% 89.2157%;
    --input: 37.7143 63.6364% 89.2157%;
    --ring: 0 55.7789% 39.0196%;
    --chart-1: 0 73.7089% 41.7647%;
    --chart-2: 0 55.7789% 39.0196%;
    --chart-3: 0 62.8205% 30.5882%;
    --chart-4: 25.9649 90.4762% 37.0588%;
    --chart-5: 22.7273 82.5000% 31.3725%;
    --sidebar: 22.5000 21.0526% 92.5490%;
    --sidebar-foreground: 0 0% 10.1961%;
    --sidebar-primary: 0 55.7789% 39.0196%;
    --sidebar-primary-foreground: 0 0% 100%;
    --sidebar-accent: 48.0000 96.4912% 88.8235%;
    --sidebar-accent-foreground: 0 62.8205% 30.5882%;
    --sidebar-border: 37.7143 63.6364% 89.2157%;
    --sidebar-ring: 0 55.7789% 39.0196%;
    --font-sans: Poppins, sans-serif;
    --font-serif: Libre Baskerville, serif;
    --font-mono: IBM Plex Mono, monospace;
    --radius: 0.375rem;
    --shadow-x: 1px;
    --shadow-y: 1px;
    --shadow-blur: 16px;
    --shadow-spread: -2px;
    --shadow-opacity: 0.12;
    --shadow-color: hsl(0 63% 18%);
    --shadow-2xs: 1px 1px 16px -2px hsl(0 63% 18% / 0.06);
    --shadow-xs: 1px 1px 16px -2px hsl(0 63% 18% / 0.06);
    --shadow-sm: 1px 1px 16px -2px hsl(0 63% 18% / 0.12), 1px 1px 2px -3px hsl(0 63% 18% / 0.12);
    --shadow: 1px 1px 16px -2px hsl(0 63% 18% / 0.12), 1px 1px 2px -3px hsl(0 63% 18% / 0.12);
    --shadow-md: 1px 1px 16px -2px hsl(0 63% 18% / 0.12), 1px 2px 4px -3px hsl(0 63% 18% / 0.12);
    --shadow-lg: 1px 1px 16px -2px hsl(0 63% 18% / 0.12), 1px 4px 6px -3px hsl(0 63% 18% / 0.12);
    --shadow-xl: 1px 1px 16px -2px hsl(0 63% 18% / 0.12), 1px 8px 10px -3px hsl(0 63% 18% / 0.12);
    --shadow-2xl: 1px 1px 16px -2px hsl(0 63% 18% / 0.30);
    --tracking-normal: 0em;
    --spacing: 0.25rem;
  }

  .dark {
    --background: 24 9.8039% 10%;
    --foreground: 60 4.7619% 95.8824%;
    --card: 12.0000 6.4935% 15.0980%;
    --card-foreground: 60 4.7619% 95.8824%;
    --popover: 12.0000 6.4935% 15.0980%;
    --popover-foreground: 60 4.7619% 95.8824%;
    --primary: 0 73.7089% 41.7647%;
    --primary-foreground: 24 33.3333% 97.0588%;
    --secondary: 22.7273 82.5000% 31.3725%;
    --secondary-foreground: 48.0000 96.4912% 88.8235%;
    --muted: 24 8.7719% 11.1765%;
    --muted-foreground: 24.0000 5.7471% 82.9412%;
    --accent: 25.9649 90.4762% 37.0588%;
    --accent-foreground: 48.0000 96.4912% 88.8235%;
    --destructive: 0 84.2365% 60.1961%;
    --destructive-foreground: 0 0% 100%;
    --border: 30 6.2500% 25.0980%;
    --input: 30 6.2500% 25.0980%;
    --ring: 0 73.7089% 41.7647%;
    --chart-1: 0 90.6040% 70.7843%;
    --chart-2: 0 84.2365% 60.1961%;
    --chart-3: 0 72.2222% 50.5882%;
    --chart-4: 43.2558 96.4126% 56.2745%;
    --chart-5: 37.6923 92.1260% 50.1961%;
    --sidebar: 24 9.8039% 10%;
    --sidebar-foreground: 60 4.7619% 95.8824%;
    --sidebar-primary: 0 73.7089% 41.7647%;
    --sidebar-primary-foreground: 24 33.3333% 97.0588%;
    --sidebar-accent: 25.9649 90.4762% 37.0588%;
    --sidebar-accent-foreground: 48.0000 96.4912% 88.8235%;
    --sidebar-border: 30 6.2500% 25.0980%;
    --sidebar-ring: 0 73.7089% 41.7647%;
    --font-sans: Poppins, sans-serif;
    --font-serif: Libre Baskerville, serif;
    --font-mono: IBM Plex Mono, monospace;
    --radius: 0.375rem;
    --shadow-x: 1px;
    --shadow-y: 1px;
    --shadow-blur: 16px;
    --shadow-spread: -2px;
    --shadow-opacity: 0.12;
    --shadow-color: hsl(0 63% 18%);
    --shadow-2xs: 1px 1px 16px -2px hsl(0 63% 18% / 0.06);
    --shadow-xs: 1px 1px 16px -2px hsl(0 63% 18% / 0.06);
    --shadow-sm: 1px 1px 16px -2px hsl(0 63% 18% / 0.12), 1px 1px 2px -3px hsl(0 63% 18% / 0.12);
    --shadow: 1px 1px 16px -2px hsl(0 63% 18% / 0.12), 1px 1px 2px -3px hsl(0 63% 18% / 0.12);
    --shadow-md: 1px 1px 16px -2px hsl(0 63% 18% / 0.12), 1px 2px 4px -3px hsl(0 63% 18% / 0.12);
    --shadow-lg: 1px 1px 16px -2px hsl(0 63% 18% / 0.12), 1px 4px 6px -3px hsl(0 63% 18% / 0.12);
    --shadow-xl: 1px 1px 16px -2px hsl(0 63% 18% / 0.12), 1px 8px 10px -3px hsl(0 63% 18% / 0.12);
    --shadow-2xl: 1px 1px 16px -2px hsl(0 63% 18% / 0.30);
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}`;

/**
 * Chuẩn hóa giá trị màu:
 * - Nếu đã có hàm (hsl, rgb, oklch) hoặc mã hex (#): giữ nguyên
 * - Nếu là số HSL phân tách dấu cách (space-separated, vd: "251.9 55.76% 57.45%"): bọc hsl(...)
 */
function toCssColor(val?: string, fallback = '#000000'): string {
  if (!val) return fallback;
  const trimmed = val.trim();
  if (
    trimmed.startsWith('#') ||
    trimmed.startsWith('rgb') ||
    trimmed.startsWith('hsl') ||
    trimmed.startsWith('oklch') ||
    trimmed.startsWith('color(') ||
    trimmed.startsWith('var(')
  ) {
    return trimmed;
  }
  return `hsl(${trimmed})`;
}

/**
 * Trích xuất các biến CSS từ khối văn bản
 */
export function extractCssVariables(blockText: string): Record<string, string> {
  const vars: Record<string, string> = {};
  const regex = /--([a-zA-Z0-9_-]+)\s*:\s*([^;]+);/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(blockText)) !== null) {
    const key = match[1].trim();
    const val = match[2].trim();
    vars[key] = val;
  }
  return vars;
}

/**
 * Phân tích mã CSS người dùng dán vào (chứa :root và .dark)
 */
export function parseUserCustomCss(cssText: string): {
  rootVars: Record<string, string>;
  darkVars: Record<string, string>;
} {
  // Tìm khối :root {...}
  let rootBlock = '';
  const rootMatch = /:root\s*\{([\s\S]*?)\}/.exec(cssText);
  if (rootMatch) {
    rootBlock = rootMatch[1];
  } else {
    // Nếu không có :root, quét toàn bộ
    rootBlock = cssText;
  }

  // Tìm khối .dark {...}
  let darkBlock = '';
  const darkMatch = /\.dark\s*\{([\s\S]*?)\}/.exec(cssText);
  if (darkMatch) {
    darkBlock = darkMatch[1];
  }

  const rootVars = extractCssVariables(rootBlock);
  const darkVars = extractCssVariables(darkBlock);

  return { rootVars, darkVars };
}

/**
 * Ánh xạ danh sách biến CSS của người dùng sang GridThemeTokens chuẩn
 */
export function mapVarsToGridThemeTokens(vars: Record<string, string>): GridThemeTokens {
  const primary = toCssColor(vars.primary, '#6366f1');
  const primaryFg = toCssColor(vars['primary-foreground'], '#ffffff');
  const background = toCssColor(vars.background, '#ffffff');
  const foreground = toCssColor(vars.foreground, '#0f172a');
  const card = toCssColor(vars.card, background);
  const cardFg = toCssColor(vars['card-foreground'], foreground);
  const popover = toCssColor(vars.popover, card);
  const secondary = toCssColor(vars.secondary, '#f1f5f9');
  const muted = toCssColor(vars.muted, '#f8fafc');
  const mutedFg = toCssColor(vars['muted-foreground'], '#64748b');
  const accent = toCssColor(vars.accent, '#f1f5f9');
  const destructive = toCssColor(vars.destructive, '#ef4444');
  const border = toCssColor(vars.border, '#e2e8f0');
  const ring = toCssColor(vars.ring, primary);

  return {
    bgRoot: background,
    bgHeader: card,
    bgRow: background,
    bgRowAlt: muted,
    bgHover: accent,
    bgSelected: secondary,
    bgPopup: popover,
    bgItemHover: accent,
    bgItemActive: primary,
    bgControl: card,
    bgControlHover: accent,
    border: border,
    borderStrong: border,
    borderPopup: border,
    textMain: foreground,
    textHeader: cardFg,
    textMuted: mutedFg,
    textSubtle: mutedFg,
    accent: primary,
    accentHover: `color-mix(in srgb, ${primary} 88%, ${foreground})`,
    accentActive: `color-mix(in srgb, ${primary} 78%, black)`,
    accentHoverBorder: ring,
    accentText: primaryFg,
    focusRing: primary,
    focusHalo: `color-mix(in srgb, ${primary} 24%, transparent)`,
    btnDefaultBg: card,
    btnDefaultBorder: border,
    btnDefaultText: foreground,
    btnDefaultHover: accent,
    btnDefaultActive: `color-mix(in srgb, ${accent} 85%, ${foreground})`,
    danger: destructive,
    dangerBg: `color-mix(in srgb, ${destructive} 16%, transparent)`,
    dangerHover: `color-mix(in srgb, ${destructive} 80%, black)`,
    warning: '#f59e0b',
    warningBg: '#fef3c7',
    success: '#10b981',
    successBg: '#d1fae5',
    trendUp: toCssColor(vars['chart-3'], primary),
    trendDown: destructive,
    pinnedShadow: 'rgba(0, 0, 0, 0.12)',
    backdropBg: 'rgba(0, 0, 0, 0.45)',
    scrollThumb: border,
    scrollThumbHover: primary,
  };
}

/**
 * Sinh chuỗi CSS hoàn chỉnh cho giao diện Custom kèm cầu nối AGV Engine
 */
export function generateCustomThemeCssBlock(
  cssText: string,
  _defaultSelector?: string
): string {
  const { rootVars, darkVars } = parseUserCustomCss(cssText);
  const hasRoot = Object.keys(rootVars).length > 0;
  const hasDark = Object.keys(darkVars).length > 0;
  if (!hasRoot && !hasDark) return '';

  const effectiveRootVars = hasRoot ? rootVars : darkVars;
  const rootTokens = mapVarsToGridThemeTokens(effectiveRootVars);
  const darkTokens = hasDark ? mapVarsToGridThemeTokens(darkVars) : rootTokens;
  setCustomTokens(rootTokens, darkTokens);

  const rootSelectors = [
    ':root.agv-theme-custom',
    'html.agv-theme-custom',
    'body.agv-theme-custom',
    '.agv-theme-custom',
    '[data-theme="custom"]',
    '.agv-app-container.agv-theme-custom',
    '.agv-grid-root.agv-theme-custom',
  ];

  let out = renderTokensCssBlock(rootTokens, rootSelectors);

  // In lại các biến chuẩn Shadcn cho Root
  const rootExtraLines: string[] = [];
  Object.entries(effectiveRootVars).forEach(([k, v]) => {
    rootExtraLines.push(`    --${k}: ${v};`);
  });
  if (rootExtraLines.length > 0) {
    out += `\n  ${rootSelectors.join(',\n  ')} {\n${rootExtraLines.join('\n')}\n  }`;
  }

  // Nếu có khối .dark riêng biệt thì render khối dark
  if (hasDark) {
    const darkTokens = mapVarsToGridThemeTokens(darkVars);
    const darkSelectors = [
      'html.agv-theme-custom.dark',
      'html.dark .agv-theme-custom',
      'body.agv-theme-custom.dark',
      'body.dark .agv-theme-custom',
      '.dark .agv-theme-custom',
      '.dark[data-theme="custom"]',
      '.agv-theme-custom.dark',
      '[data-theme="custom"].dark',
    ];

    out += '\n' + renderTokensCssBlock(darkTokens, darkSelectors);

    const darkExtraLines: string[] = [];
    Object.entries(darkVars).forEach(([k, v]) => {
      darkExtraLines.push(`    --${k}: ${v};`);
    });
    if (darkExtraLines.length > 0) {
      out += `\n  ${darkSelectors.join(',\n  ')} {\n${darkExtraLines.join('\n')}\n  }`;
    }
  }

  return out.trim();
}
