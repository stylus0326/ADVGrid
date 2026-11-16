/** @type {import('tailwindcss').Config} */
const withCssExpr = (expr) => ({ opacityValue }) => {
  if (
    opacityValue === undefined ||
    opacityValue === '1' ||
    Number(opacityValue) === 1 ||
    String(opacityValue).includes('--tw-')
  ) {
    return expr;
  }
  const pct = Math.round(Number(opacityValue) * 1000) / 10;
  return Number.isFinite(pct)
    ? `color-mix(in srgb, ${expr} ${pct}%, transparent)`
    : expr;
};

const withVar = (cssVar) => withCssExpr(`var(${cssVar})`);

export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-app-sans)', 'Roboto', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['var(--font-app-sans)', 'Roboto', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Helvetica', 'Arial', 'sans-serif'],
      },
      fontSize: {
        caption: 'var(--font-size-caption)',
        label: 'var(--font-size-label)',
        body: 'var(--font-size-body)',
        'section-title': 'var(--font-size-section-title)',
        'page-title': 'var(--font-size-page-title)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        xl: 'calc(var(--radius) + 4px)',
      },
      spacing: {
        control: 'var(--control-height)',
        touch: 'var(--touch-target)',
      },
      zIndex: {
        shell: 'var(--z-shell)',
        'action-bar': 'var(--z-action-bar)',
        sidebar: 'var(--z-sidebar)',
        overlay: 'var(--z-overlay)',
        popover: 'var(--z-popover)',
        tooltip: 'var(--z-tooltip)',
        toast: 'var(--z-toast)',
        capture: 'var(--z-capture)',
      },
      colors: {
        border: withVar('--border'),
        input: withVar('--input'),
        control: withVar('--control-border'),
        'control-surface': withCssExpr('var(--form-field-label-background, var(--control-background))'),
        'control-hover': withCssExpr('var(--control-hover-background, var(--accent))'),
        ring: withVar('--ring'),
        background: withVar('--background'),
        foreground: withVar('--foreground'),
        primary: {
          DEFAULT: withVar('--primary'),
          foreground: withVar('--primary-foreground'),
        },
        secondary: {
          DEFAULT: withVar('--secondary'),
          foreground: withVar('--secondary-foreground'),
        },
        destructive: {
          DEFAULT: withVar('--destructive'),
          foreground: '#ffffff',
        },
        muted: {
          DEFAULT: withVar('--muted'),
          foreground: withVar('--muted-foreground'),
        },
        accent: {
          DEFAULT: withVar('--accent'),
          foreground: withVar('--accent-foreground'),
        },
        popover: {
          DEFAULT: withVar('--popover'),
          foreground: withVar('--popover-foreground'),
        },
        card: {
          DEFAULT: withVar('--card'),
          foreground: withVar('--card-foreground'),
        },
        brand: {
          DEFAULT: withVar('--brand'),
          foreground: withVar('--brand-foreground'),
          soft: withVar('--brand-soft'),
          teal: withVar('--brand-teal'),
          shell: withVar('--brand-shell'),
          deep: withVar('--brand-deep'),
          'teal-50': withVar('--brand-teal-50'),
          'teal-100': withVar('--brand-teal-100'),
          gold: withVar('--brand-gold'),
          'gold-on-light': withVar('--brand-gold-on-light'),
          'gold-on-dark': withVar('--brand-gold-on-dark'),
        },
        surface: {
          ground: withVar('--surface-ground'),
          hover: withVar('--surface-hover'),
          selected: withVar('--surface-selected'),
          subtle: withVar('--surface-subtle'),
          raised: withVar('--surface-raised'),
        },
        'table-header': withVar('--table-header'),
        status: {
          success: withVar('--status-success'),
          'success-foreground': withVar('--status-success-foreground'),
          'success-border': withVar('--status-success-border'),
          warning: withVar('--status-warning'),
          'warning-foreground': withVar('--status-warning-foreground'),
          'warning-border': withVar('--status-warning-border'),
          danger: withVar('--status-danger'),
          'danger-foreground': withVar('--status-danger-foreground'),
          'danger-border': withVar('--status-danger-border'),
          info: withVar('--status-info'),
          'info-foreground': withVar('--status-info-foreground'),
          'info-border': withVar('--status-info-border'),
          brand: withVar('--status-brand'),
          'brand-foreground': withVar('--status-brand-foreground'),
          'brand-border': withVar('--status-brand-border'),
        },
        sidebar: {
          DEFAULT: withVar('--sidebar'),
          foreground: withVar('--sidebar-foreground'),
          primary: withVar('--sidebar-primary'),
          'primary-foreground': withVar('--sidebar-primary-foreground'),
          accent: withVar('--sidebar-accent'),
          'accent-foreground': withVar('--sidebar-accent-foreground'),
          border: withVar('--sidebar-border'),
          ring: withVar('--sidebar-ring'),
          marker: withVar('--sidebar-marker'),
        },
        agv: {
          accent: 'var(--agv-accent)',
          'accent-text': 'var(--agv-accent-text, #ffffff)',
          'accent-hover': 'var(--agv-accent-hover, var(--agv-accent))',
          'accent-hover-border': 'var(--agv-accent-hover-border)',
          border: 'var(--agv-border)',
          'border-strong': 'var(--agv-border-strong)',
          'border-popup': 'var(--agv-border-popup)',
          'bg-root': 'var(--agv-bg-root)',
          'bg-header': 'var(--agv-bg-header)',
          'bg-row': 'var(--agv-bg-row)',
          'bg-row-alt': 'var(--agv-bg-row-alt)',
          'bg-hover': 'var(--agv-bg-hover)',
          'bg-selected': 'var(--agv-bg-selected)',
          'bg-popup': 'var(--agv-bg-popup)',
          'bg-control': 'var(--agv-bg-control)',
          'bg-control-hover': 'var(--agv-bg-control-hover)',
          'bg-item-hover': 'var(--agv-bg-item-hover)',
          'bg-item-active': 'var(--agv-bg-item-active)',
          'text-main': 'var(--agv-text-main)',
          'text-header': 'var(--agv-text-header)',
          'text-muted': 'var(--agv-text-muted)',
          'text-subtle': 'var(--agv-text-subtle)',
          'text-active': 'var(--agv-text-active, var(--agv-accent))',
          danger: 'var(--agv-danger, #b91c1c)',
          'danger-bg': 'var(--agv-danger-bg)',
          warning: 'var(--agv-warning, #92400e)',
          'warning-bg': 'var(--agv-warning-bg)',
          success: 'var(--agv-success, #065f46)',
          'success-bg': 'var(--agv-success-bg)',
          'trend-up': 'var(--agv-trend-up)',
          'trend-down': 'var(--agv-trend-down)',
        },
      },
    },
  },
  plugins: [],
};
