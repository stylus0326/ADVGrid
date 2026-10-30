import { GridThemeTokens } from '../common';
import { ThemeStyleProps } from './types';

/**
 * Chuyển đổi một bộ màu định dạng Tweakcn (ThemeStyleProps) sang cấu trúc GridThemeTokens của hệ thống.
 */
export function convertPresetToGridTokens(
  styles: ThemeStyleProps,
  mode: 'light' | 'dark' = 'light'
): GridThemeTokens {
  const isDark = mode === 'dark';

  return {
    bgRoot: styles.background,
    bgHeader: styles.card,
    bgRow: styles.background,
    bgRowAlt: styles.card,
    bgHover: styles.muted,
    bgSelected: styles.secondary,
    bgPopup: styles.popover,
    bgItemHover: styles.accent,
    bgItemActive: styles.secondary,
    bgControl: styles.card,
    bgControlHover: styles.accent,
    border: styles.border,
    borderStrong: styles.border,
    borderPopup: styles.border,
    textMain: styles.foreground,
    textHeader: styles['card-foreground'] || styles.foreground,
    textMuted: styles['muted-foreground'] || styles.foreground,
    textSubtle: styles['muted-foreground'] || styles.foreground,
    accent: styles.primary,
    accentText: styles['primary-foreground'] || '#ffffff',
    btnDefaultBg: styles.card,
    btnDefaultBorder: styles.border,
    btnDefaultText: styles.foreground,
    btnDefaultHover: styles.muted,
    danger: styles.destructive,
    dangerBg: `color-mix(in srgb, ${styles.destructive} ${isDark ? '22%' : '14%'}, transparent)`,
    dangerHover: styles.destructive,
    warning: styles['chart-2'] || styles.secondary,
    warningBg: `color-mix(in srgb, ${styles['chart-2'] || styles.secondary} ${isDark ? '20%' : '14%'}, transparent)`,
    success: styles['chart-1'] || styles.primary,
    successBg: `color-mix(in srgb, ${styles['chart-1'] || styles.primary} ${isDark ? '20%' : '14%'}, transparent)`,
    trendUp: styles['chart-3'] || styles.accent,
    trendDown: styles.destructive,
    pinnedShadow: isDark ? 'rgba(0, 0, 0, 0.45)' : 'rgba(0, 0, 0, 0.08)',
    backdropBg: isDark ? 'rgba(0, 0, 0, 0.65)' : 'rgba(0, 0, 0, 0.25)',
    scrollThumb: styles.border,
    scrollThumbHover: styles.primary,
  };
}

/**
 * Sinh chuỗi CSS variables hoàn chỉnh (cả biến chuẩn Shadcn lẫn biến nội bộ Grid Engine)
 * từ một ThemeStyleProps của Tweakcn.
 */
export function generatePresetCssVariables(
  styles: ThemeStyleProps,
  selector: string = ':root'
): string {
  return `
${selector} {
  --background: ${styles.background};
  --foreground: ${styles.foreground};
  --card: ${styles.card};
  --card-foreground: ${styles['card-foreground']};
  --popover: ${styles.popover};
  --popover-foreground: ${styles['popover-foreground']};
  --primary: ${styles.primary};
  --primary-foreground: ${styles['primary-foreground']};
  --secondary: ${styles.secondary};
  --secondary-foreground: ${styles['secondary-foreground']};
  --muted: ${styles.muted};
  --muted-foreground: ${styles['muted-foreground']};
  --accent: ${styles.accent};
  --accent-foreground: ${styles['accent-foreground']};
  --destructive: ${styles.destructive};
  --destructive-foreground: ${styles['destructive-foreground']};
  --border: ${styles.border};
  --input: ${styles.input};
  --ring: ${styles.ring};
  --radius: ${styles.radius || '0.5rem'};
  --chart-1: ${styles['chart-1']};
  --chart-2: ${styles['chart-2']};
  --chart-3: ${styles['chart-3']};
  --chart-4: ${styles['chart-4']};
  --chart-5: ${styles['chart-5']};
  ${styles.sidebar ? `--sidebar: ${styles.sidebar};` : ''}
  ${styles['sidebar-foreground'] ? `--sidebar-foreground: ${styles['sidebar-foreground']};` : ''}
  ${styles['sidebar-primary'] ? `--sidebar-primary: ${styles['sidebar-primary']};` : ''}
  ${styles['sidebar-primary-foreground'] ? `--sidebar-primary-foreground: ${styles['sidebar-primary-foreground']};` : ''}
  ${styles['sidebar-accent'] ? `--sidebar-accent: ${styles['sidebar-accent']};` : ''}
  ${styles['sidebar-accent-foreground'] ? `--sidebar-accent-foreground: ${styles['sidebar-accent-foreground']};` : ''}
  ${styles['sidebar-border'] ? `--sidebar-border: ${styles['sidebar-border']};` : ''}
  ${styles['sidebar-ring'] ? `--sidebar-ring: ${styles['sidebar-ring']};` : ''}
  ${styles['font-sans'] ? `--font-sans: ${styles['font-sans']};` : ''}

  /* Cầu nối Grid Engine với giá trị màu trực tiếp chuẩn xác */
  --agv-accent: ${styles.primary};
  --agv-accent-text: ${styles['primary-foreground'] || '#ffffff'};
  --agv-accent-hover: ${styles.primary};
  --agv-bg-root: ${styles.background};
  --agv-text-main: ${styles.foreground};
  --agv-border: ${styles.border};
  --agv-border-strong: ${styles.border};
  --agv-bg-header: ${styles.card};
  --agv-bg-row: ${styles.background};
  --agv-bg-row-alt: ${styles.muted || styles.card};
  --agv-bg-hover: ${styles.accent || styles.muted};
  --agv-bg-selected: ${styles.secondary};
  --agv-bg-popup: ${styles.popover};
  --agv-bg-control: ${styles.card};
  --agv-bg-control-hover: ${styles.accent};
  --agv-bg-item-hover: ${styles.accent};
  --agv-bg-item-active: ${styles.secondary};
  --agv-text-header: ${styles['card-foreground'] || styles.foreground};
  --agv-text-muted: ${styles['muted-foreground'] || styles.foreground};
  --agv-text-subtle: ${styles['muted-foreground'] || styles.foreground};
  --agv-text-active: ${styles.primary};
  --agv-success: ${styles['chart-1'] || styles.primary};
  --agv-success-bg: color-mix(in srgb, ${styles['chart-1'] || styles.primary} 16%, transparent);
  --agv-warning: ${styles['chart-2'] || styles.secondary};
  --agv-warning-bg: color-mix(in srgb, ${styles['chart-2'] || styles.secondary} 16%, transparent);
  --agv-danger: ${styles.destructive};
  --agv-danger-bg: color-mix(in srgb, ${styles.destructive} 16%, transparent);
  --agv-danger-hover: ${styles.destructive};
  --agv-trend-up: ${styles['chart-3'] || styles.accent};
  --agv-trend-down: ${styles.destructive};
  --scroll-thumb: ${styles.border};
  --scroll-thumb-hover: ${styles.primary};
}
`;
}
