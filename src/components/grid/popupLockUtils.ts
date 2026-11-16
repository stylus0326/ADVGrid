export interface ScrollableElementMetrics {
  clientHeight: number;
  scrollHeight: number;
  scrollTop: number;
  clientWidth: number;
  scrollWidth: number;
  scrollLeft: number;
}

/**
 * Chuẩn hóa EventTarget thành Element (xử lý trường hợp sự kiện phát sinh trên Text node con).
 */
export function resolveEventTargetElement(target: EventTarget | null): Element | null {
  if (!target || typeof Element === 'undefined') return null;
  if (target instanceof Element) return target;
  if (typeof Node !== 'undefined' && target instanceof Node) {
    return target.parentElement;
  }
  return null;
}

/**
 * Kiểm tra EventTarget có nằm bên trong vùng selector popup hay không.
 */
export function isTargetInsidePopupSelector(
  target: EventTarget | null,
  popupSelector: string
): boolean {
  const el = resolveEventTargetElement(target);
  return Boolean(el && typeof (el as Element).closest === 'function' && el.closest(popupSelector));
}

/**
 * Kiểm tra giá trị CSS overflow có cho phép cuộn hay không.
 */
export function isScrollableOverflowValue(overflow: string): boolean {
  return overflow === 'auto' || overflow === 'scroll' || overflow === 'overlay';
}

/**
 * Kiểm tra phần tử còn khoảng cuộn theo đúng trục và chiều delta hay không.
 */
export function canElementScrollOnAxis(
  el: ScrollableElementMetrics,
  axis: 'y' | 'x',
  delta: number
): boolean {
  if (delta === 0) return false;

  if (axis === 'y') {
    const maxScrollTop = Math.max(0, el.scrollHeight - el.clientHeight);
    if (maxScrollTop <= 0.5) return false;
    return delta > 0 ? el.scrollTop < maxScrollTop - 0.2 : el.scrollTop > 0.2;
  }

  const maxScrollLeft = Math.max(0, el.scrollWidth - el.clientWidth);
  if (maxScrollLeft <= 0.5) return false;
  return delta > 0 ? el.scrollLeft < maxScrollLeft - 0.2 : el.scrollLeft > 0.2;
}

/**
 * Chỉ cho phép sự kiện wheel cuộn khi con trỏ nằm trong một vùng cuộn hợp lệ
 * bên trong popup và vùng đó vẫn còn cuộn tiếp được theo hướng lăn chuột.
 */
export function canWheelScrollInsidePopup(
  target: EventTarget | null,
  deltaX: number,
  deltaY: number,
  popupSelector: string
): boolean {
  const startEl = resolveEventTargetElement(target);
  if (!startEl) {
    return false;
  }

  const popupRoot = startEl.closest(popupSelector);
  if (!popupRoot) {
    return false;
  }

  let current: Element | null = startEl;
  while (current) {
    const style = window.getComputedStyle(current);
    if (
      Math.abs(deltaY) > 0 &&
      isScrollableOverflowValue(style.overflowY) &&
      canElementScrollOnAxis(current, 'y', deltaY)
    ) {
      return true;
    }

    if (
      Math.abs(deltaX) > 0 &&
      isScrollableOverflowValue(style.overflowX) &&
      canElementScrollOnAxis(current, 'x', deltaX)
    ) {
      return true;
    }

    if (current === popupRoot) break;
    current = current.parentElement;
  }

  return false;
}

/**
 * Xác định có cần chặn tương tác trên Grid khi đang mở popup hay không.
 */
export function shouldBlockGridInteractionWhenPopupOpen(
  hasPopupOpen: boolean,
  target: EventTarget | null,
  popupSelector: string
): boolean {
  if (!hasPopupOpen) return false;
  return !isTargetInsidePopupSelector(target, popupSelector);
}
