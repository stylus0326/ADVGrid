/* Hợp đồng nguồn đơn focus, hover, nền, kích thước & viền chuẩn đồng bộ từ D:\Dự án\b2b-pnt (CSS chi tiết tại src/index.css) */

export type ControlSize = 'sm' | 'md';

/** 4 phân loại nút chuẩn duy nhất toàn hệ thống (tham chiếu shadcn/ui Base Button) */
export type ButtonVariant = 'default' | 'outline' | 'ghost' | 'destructive';

/** 4 kích thước nút chuẩn (+ 'md' là alias tương thích ngược của 'default') */
export type ButtonSize = 'sm' | 'default' | 'md' | 'icon-sm' | 'icon';

/** Focus chuẩn cho input/trigger được quản lý tập trung qua .agv-control trong src/index.css */
export const CONTROL_FOCUS_CLASS = 'outline-none';

/** Hover cho control được quản lý tập trung qua .agv-control:hover trong src/index.css (tự khóa khi focus/open/disabled) */
export const CONTROL_HOVER_CLASS = '';

/** Trạng thái mở popup ([data-state="open"] / [aria-expanded="true"] / .is-open) do .agv-control đảm nhiệm */
export const CONTROL_POPUP_OPEN_CLASS = '';

/** Focus-visible chuẩn bàn phím cho button thường / tab / CTA (.agv-focus-ring trong src/index.css) */
export const BUTTON_FOCUS_VISIBLE_CLASS = 'agv-focus-ring';

/** Nền/viền/trạng thái đơn cho input, textarea, select, trigger button */
export const CONTROL_SURFACE_CLASS = 'agv-control';

/** Wrapper bọc input / nhiều phân đoạn bên trong (kích hoạt border/inset-ring khi :focus-within) */
export const CONTROL_BOX_CLASS = 'agv-control agv-control-box';

/** Kích thước chuẩn thống nhất toàn hệ thống: sm = 28px, md = var(--control-height) (36px) */
export const CONTROL_SIZE_CLASS: Record<ControlSize, string> = {
  sm: 'h-7 min-h-[28px] text-xs',
  md: 'h-control min-h-[28px] text-sm',
};

export const getControlSizeClass = (size: ControlSize = 'sm'): string =>
  CONTROL_SIZE_CLASS[size];

export const CONTROL_INPUT_MD_CLASS =
  `${CONTROL_SURFACE_CLASS} ${CONTROL_SIZE_CLASS.md} px-2.5 py-1 placeholder:text-muted-foreground`;

export const CONTROL_INPUT_SM_CLASS =
  `${CONTROL_SURFACE_CLASS} ${CONTROL_SIZE_CLASS.sm} px-2 placeholder:text-muted-foreground`;

export const CONTROL_BOX_MD_CLASS =
  `${CONTROL_BOX_CLASS} ${CONTROL_SIZE_CLASS.md} px-2.5`;

export const CONTROL_BOX_SM_CLASS =
  `${CONTROL_BOX_CLASS} ${CONTROL_SIZE_CLASS.sm} px-2`;

export const CONTROL_TEXTAREA_CLASS =
  `${CONTROL_SURFACE_CLASS} p-2 text-xs placeholder:text-muted-foreground`;

const BUTTON_VARIANT_CLASS: Record<ButtonVariant, string> = {
  default: 'agv-btn agv-btn-default',
  outline: `agv-btn agv-btn-outline ${CONTROL_SURFACE_CLASS}`,
  ghost: 'agv-btn agv-btn-ghost',
  destructive: 'agv-btn agv-btn-destructive',
};

export interface ButtonVariantsOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  active?: boolean;
  className?: string;
}

/** Hợp đồng nguồn đơn class cho 4 phân loại nút: default, outline, ghost, destructive */
export function getButtonClass({
  variant = 'default',
  size = 'default',
  active = false,
  className = '',
}: ButtonVariantsOptions = {}): string {
  const isIconSize = size === 'icon' || size === 'icon-sm';
  const hasH = /(?:^|\s)!?h-/.test(className);
  const hasW = /(?:^|\s)!?w-/.test(className);
  const hasPx = /\b!?p(?:x|l|r)?-/.test(className);
  const hasFont = /\b!?font-(?:thin|extralight|light|normal|medium|semibold|bold|extrabold|black)\b/.test(className);
  const hasTextSize = /\b!?text-(?:xs|sm|base|lg|xl|\[)/.test(className);

  const sizeTokens: string[] = [];
  if (size === 'sm') {
    if (!hasH) sizeTokens.push('h-7');
    sizeTokens.push('min-h-[28px]');
    if (!hasPx) sizeTokens.push('px-3');
    sizeTokens.push('gap-1 leading-4');
    if (!hasTextSize) sizeTokens.push('text-xs');
  } else if (size === 'default' || size === 'md') {
    if (!hasH) sizeTokens.push('h-control');
    sizeTokens.push('min-h-[28px]');
    if (!hasPx) sizeTokens.push('px-4');
    sizeTokens.push('gap-2');
    if (!hasTextSize) sizeTokens.push('text-sm');
  } else if (size === 'icon-sm') {
    if (!hasH) sizeTokens.push('h-7');
    if (!hasW) sizeTokens.push('w-7');
    sizeTokens.push('min-h-[28px] min-w-[28px] shrink-0');
    if (!hasPx) sizeTokens.push('p-0');
    if (!hasTextSize) sizeTokens.push('text-xs');
  } else if (size === 'icon') {
    if (!hasH) sizeTokens.push('h-9');
    if (!hasW) sizeTokens.push('w-9');
    sizeTokens.push('min-h-[36px] min-w-[36px] shrink-0');
    if (!hasPx) sizeTokens.push('p-0');
    if (!hasTextSize) sizeTokens.push('text-sm');
  }

  const weightClass =
    isIconSize || hasFont
      ? ''
      : variant === 'default' && size === 'sm'
      ? 'font-semibold'
      : 'font-medium';
  const shadowClass = variant === 'default' ? 'shadow-sm' : '';
  const activeClass = active ? 'is-active' : '';

  return [
    BUTTON_VARIANT_CLASS[variant],
    ...sizeTokens,
    weightClass,
    shadowClass,
    activeClass,
    BUTTON_FOCUS_VISIBLE_CLASS,
    className,
  ]
    .filter(Boolean)
    .join(' ');
}

/** Alias tương thích chuẩn shadcn/ui */
export const buttonVariants = getButtonClass;

export const CONTROL_BUTTON_OUTLINE_MD_CLASS = getButtonClass({
  variant: 'outline',
  size: 'default',
});

export const CONTROL_BUTTON_OUTLINE_SM_CLASS = getButtonClass({
  variant: 'outline',
  size: 'sm',
});

/** Nút icon vuông tối thiểu 28×28, dùng size icon-sm để không chèn px gây co icon < 8px */
export const CONTROL_ICON_BUTTON_OUTLINE_SM_CLASS = getButtonClass({
  variant: 'outline',
  size: 'icon-sm',
});

export const CONTROL_BUTTON_PRIMARY_MD_CLASS = getButtonClass({
  variant: 'default',
  size: 'default',
});

export const CONTROL_BUTTON_PRIMARY_SM_CLASS = getButtonClass({
  variant: 'default',
  size: 'sm',
});

export const CONTROL_BUTTON_GHOST_MD_CLASS = getButtonClass({
  variant: 'ghost',
  size: 'default',
});

export const CONTROL_BUTTON_GHOST_SM_CLASS = getButtonClass({
  variant: 'ghost',
  size: 'sm',
});

export const CONTROL_ICON_BUTTON_GHOST_SM_CLASS = getButtonClass({
  variant: 'ghost',
  size: 'icon-sm',
});

export const CONTROL_BUTTON_DESTRUCTIVE_MD_CLASS = getButtonClass({
  variant: 'destructive',
  size: 'default',
});

export const CONTROL_BUTTON_DESTRUCTIVE_SM_CLASS = getButtonClass({
  variant: 'destructive',
  size: 'sm',
});

export const CONTROL_ICON_BUTTON_DESTRUCTIVE_SM_CLASS = getButtonClass({
  variant: 'destructive',
  size: 'icon-sm',
});

export const POPUP_PANEL_CLASS =
  'agv-popup-panel rounded-md border border-border bg-popover text-popover-foreground';

export const POPUP_MENU_CLASS =
  'agv-popup-panel agv-popup-menu rounded-md border border-border bg-popover text-popover-foreground';

export const POPUP_ITEM_CLASS = 'agv-popup-item';
