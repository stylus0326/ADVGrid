import { ThemePreset, ThemeStyleProps } from './types';

const CUSTOM_THEMES_STORAGE_KEY = 'agv_custom_theme_presets';

/**
 * Trích xuất toàn bộ biến CSS (--ten-bien: gia-tri;) từ một chuỗi CSS block
 */
function extractCssVariables(cssBlock: string): Record<string, string> {
  const vars: Record<string, string> = {};
  const regex = /--([a-zA-Z0-9_-]+)\s*:\s*([^;]+);/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(cssBlock)) !== null) {
    vars[match[1].trim()] = match[2].trim();
  }
  return vars;
}

/**
 * Ánh xạ map các biến CSS sang ThemeStyleProps đầy đủ với giá trị fallback an toàn
 */
function mapVarsToThemeStyles(vars: Record<string, string>, fallbackMode: 'light' | 'dark' = 'light'): ThemeStyleProps {
  const isDark = fallbackMode === 'dark';
  const defaultBg = isDark ? 'oklch(0.20 0.02 260)' : 'oklch(0.98 0.005 260)';
  const defaultFg = isDark ? 'oklch(0.95 0.01 260)' : 'oklch(0.25 0.04 260)';
  const defaultPrimary = isDark ? 'oklch(0.65 0.18 260)' : 'oklch(0.48 0.15 260)';
  const defaultBorder = isDark ? 'oklch(0.32 0.03 260)' : 'oklch(0.85 0.01 260)';

  const background = vars['background'] || defaultBg;
  const foreground = vars['foreground'] || defaultFg;
  const primary = vars['primary'] || defaultPrimary;
  const primaryForeground = vars['primary-foreground'] || (isDark ? 'oklch(0.15 0.02 260)' : '#ffffff');
  const card = vars['card'] || background;
  const cardForeground = vars['card-foreground'] || foreground;
  const popover = vars['popover'] || card;
  const popoverForeground = vars['popover-foreground'] || cardForeground;
  const secondary = vars['secondary'] || (isDark ? 'oklch(0.30 0.03 260)' : 'oklch(0.92 0.02 260)');
  const secondaryForeground = vars['secondary-foreground'] || foreground;
  const muted = vars['muted'] || (isDark ? 'oklch(0.25 0.03 260)' : 'oklch(0.94 0.01 260)');
  const mutedForeground = vars['muted-foreground'] || (isDark ? 'oklch(0.65 0.04 260)' : 'oklch(0.48 0.05 260)');
  const accent = vars['accent'] || secondary;
  const accentForeground = vars['accent-foreground'] || foreground;
  const destructive = vars['destructive'] || (isDark ? 'oklch(0.55 0.18 25)' : 'oklch(0.57 0.20 25)');
  const destructiveForeground = vars['destructive-foreground'] || '#ffffff';
  const border = vars['border'] || defaultBorder;
  const input = vars['input'] || border;
  const ring = vars['ring'] || primary;
  const radius = vars['radius'] || '0.5rem';

  const chart1 = vars['chart-1'] || primary;
  const chart2 = vars['chart-2'] || vars['secondary'] || 'oklch(0.70 0.15 150)';
  const chart3 = vars['chart-3'] || vars['accent'] || 'oklch(0.65 0.16 200)';
  const chart4 = vars['chart-4'] || border;
  const chart5 = vars['chart-5'] || destructive;

  return {
    background,
    foreground,
    card,
    'card-foreground': cardForeground,
    popover,
    'popover-foreground': popoverForeground,
    primary,
    'primary-foreground': primaryForeground,
    secondary,
    'secondary-foreground': secondaryForeground,
    muted,
    'muted-foreground': mutedForeground,
    accent,
    'accent-foreground': accentForeground,
    destructive,
    'destructive-foreground': destructiveForeground,
    border,
    input,
    ring,
    radius,
    'chart-1': chart1,
    'chart-2': chart2,
    'chart-3': chart3,
    'chart-4': chart4,
    'chart-5': chart5,
    sidebar: vars['sidebar'] || card,
    'sidebar-foreground': vars['sidebar-foreground'] || cardForeground,
    'sidebar-primary': vars['sidebar-primary'] || primary,
    'sidebar-primary-foreground': vars['sidebar-primary-foreground'] || primaryForeground,
    'sidebar-accent': vars['sidebar-accent'] || accent,
    'sidebar-accent-foreground': vars['sidebar-accent-foreground'] || accentForeground,
    'sidebar-border': vars['sidebar-border'] || border,
    'sidebar-ring': vars['sidebar-ring'] || ring,
  };
}

/**
 * Phân tích cú pháp chuỗi đầu vào (CSS hoặc JSON) thành một ThemePreset hoàn chỉnh
 */
export function parseTweakcnThemeInput(
  rawInput: string,
  userGivenName?: string
): { success: boolean; preset?: ThemePreset; error?: string } {
  const text = rawInput.trim();
  if (!text) {
    return { success: false, error: 'Vui lòng dán mã CSS hoặc JSON của theme.' };
  }

  const themeLabel = (userGivenName && userGivenName.trim()) || 'Custom Theme';
  const themeId = 'custom-' + themeLabel.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Date.now().toString(36);

  // 1. Thử phân tích JSON
  if (text.startsWith('{') || text.startsWith('[')) {
    try {
      const parsed = JSON.parse(text);

      // Định dạng ThemePreset chuẩn: { styles: { light, dark }, ... }
      if (parsed.styles?.light && parsed.styles?.dark) {
        return {
          success: true,
          preset: {
            id: themeId,
            label: parsed.label || parsed.name || themeLabel,
            createdAt: new Date().toISOString().slice(0, 10),
            styles: {
              light: mapVarsToThemeStyles(parsed.styles.light, 'light'),
              dark: mapVarsToThemeStyles(parsed.styles.dark, 'dark'),
            },
          },
        };
      }

      // Định dạng { light: { ... }, dark: { ... } }
      if (parsed.light && parsed.dark) {
        return {
          success: true,
          preset: {
            id: themeId,
            label: parsed.label || parsed.name || themeLabel,
            createdAt: new Date().toISOString().slice(0, 10),
            styles: {
              light: mapVarsToThemeStyles(parsed.light, 'light'),
              dark: mapVarsToThemeStyles(parsed.dark, 'dark'),
            },
          },
        };
      }

      // Định dạng phẳng { background, foreground, primary... }
      if (parsed.background || parsed.primary) {
        return {
          success: true,
          preset: {
            id: themeId,
            label: parsed.label || parsed.name || themeLabel,
            createdAt: new Date().toISOString().slice(0, 10),
            styles: {
              light: mapVarsToThemeStyles(parsed, 'light'),
              dark: mapVarsToThemeStyles(parsed, 'dark'),
            },
          },
        };
      }
    } catch {
      // Không phải JSON hợp lệ, tiếp tục thử phân tích dạng CSS
    }
  }

  // 2. Phân tích định dạng CSS (Tweakcn raw export)
  const rootMatch = text.match(/:root\s*\{([^}]+)\}/i);
  const darkMatch = text.match(/\.dark\s*\{([^}]+)\}/i) || text.match(/\[data-theme-mode=["']?dark["']?\]\s*\{([^}]+)\}/i);

  const rootVars = rootMatch ? extractCssVariables(rootMatch[1]) : {};
  const darkVars = darkMatch ? extractCssVariables(darkMatch[1]) : {};

  // Nếu không thấy :root {...}, thử quét tất cả các biến --... trong toàn bộ văn bản
  if (Object.keys(rootVars).length === 0 && Object.keys(darkVars).length === 0) {
    const allVars = extractCssVariables(text);
    if (Object.keys(allVars).length > 0) {
      return {
        success: true,
        preset: {
          id: themeId,
          label: themeLabel,
          createdAt: new Date().toISOString().slice(0, 10),
          styles: {
            light: mapVarsToThemeStyles(allVars, 'light'),
            dark: mapVarsToThemeStyles(allVars, 'dark'),
          },
        },
      };
    }
    return {
      success: false,
      error: 'Không tìm thấy định dạng CSS Variables (--background, --primary...) hoặc JSON hợp lệ.',
    };
  }

  // Nếu chỉ có :root mà không có .dark (hoặc ngược lại), dùng chung fallback
  const finalLightStyles = Object.keys(rootVars).length > 0
    ? mapVarsToThemeStyles(rootVars, 'light')
    : mapVarsToThemeStyles(darkVars, 'light');

  const finalDarkStyles = Object.keys(darkVars).length > 0
    ? mapVarsToThemeStyles(darkVars, 'dark')
    : mapVarsToThemeStyles(rootVars, 'dark');

  return {
    success: true,
    preset: {
      id: themeId,
      label: themeLabel,
      createdAt: new Date().toISOString().slice(0, 10),
      styles: {
        light: finalLightStyles,
        dark: finalDarkStyles,
      },
    },
  };
}

/**
 * Đọc danh sách theme tùy biến đã lưu từ localStorage
 */
export function loadCustomPresets(): Record<string, ThemePreset> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(CUSTOM_THEMES_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

/**
 * Lưu một theme tùy biến vào localStorage
 */
export function saveCustomPreset(preset: ThemePreset): void {
  if (typeof window === 'undefined') return;
  try {
    const current = loadCustomPresets();
    const presetId = preset.id || 'custom-' + Date.now().toString(36);
    current[presetId] = { ...preset, id: presetId };
    localStorage.setItem(CUSTOM_THEMES_STORAGE_KEY, JSON.stringify(current));
  } catch (err) {
    console.error('Không thể lưu theme tùy biến vào localStorage:', err);
  }
}

/**
 * Xóa một theme tùy biến khỏi localStorage
 */
export function deleteCustomPreset(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const current = loadCustomPresets();
    delete current[id];
    localStorage.setItem(CUSTOM_THEMES_STORAGE_KEY, JSON.stringify(current));
  } catch (err) {
    console.error('Không thể xóa theme tùy biến khỏi localStorage:', err);
  }
}
