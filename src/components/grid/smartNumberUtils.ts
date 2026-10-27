// smartNumberUtils.ts - Bộ công cụ xử lý số thông minh, phím tắt 1tr, 1k, 1t và bộ lọc khoảng số cho AdvGridView
import { parseGridNumber, formatGridNumber } from './gridUtils';

/**
 * Regex nhận diện các phím tắt đơn vị số:
 * - k / K: nghìn (1.000)
 * - tr / TR / triệu / m / M: triệu (1.000.000)
 * - t / T / ty / tỷ / b / B: tỷ (1.000.000.000)
 * Hỗ trợ cả số thập phân (1.5tr, 2.5k) và số phụ (1tr5 -> 1.500.000, 2k5 -> 2.500, 1t2 -> 1.200.000.000)
 */
export const NUMERIC_SHORTCUT_REGEX =
  /(^|[^a-zA-Z0-9à-ỹÀ-Ỹ])(\d+(?:[.,]\d+)?)\s*(tr|triệu|ty|tỷ|k|m|b|t)(?:\s*(\d+))?(?=$|[^a-zA-Z0-9à-ỹÀ-Ỹ])/gi;

/**
 * Mở rộng tất cả các ký tự phím tắt đơn vị số thành số thực tế:
 * VD: '1k' -> '1000', '1tr' -> '1000000', '1t' -> '1000000000', '1.5tr' -> '1500000', '1tr5' -> '1500000'
 */
export function expandAllShortcuts(text: any): string {
  if (text === null || text === undefined) return '';
  return String(text).replace(
    NUMERIC_SHORTCUT_REGEX,
    (_match, prefix, numStr, unit, subStr) => {
      const mainNum = parseFloat(String(numStr).replace(',', '.'));
      const u = String(unit).toLowerCase();
      let mult = 1;
      if (u === 'k') mult = 1000;
      else if (u === 'tr' || u === 'triệu' || u === 'm') mult = 1000000;
      else if (u === 't' || u === 'ty' || u === 'tỷ' || u === 'b') mult = 1000000000;
      let subVal = 0;
      if (subStr) {
        subVal = parseFloat(String(subStr)) / Math.pow(10, String(subStr).length);
      }
      const total = Math.round((mainNum + subVal) * mult);
      return prefix + total;
    }
  );
}

/**
 * Định dạng số với dấu chấm phân tách hàng nghìn và dấu phẩy phân cách phần thập phân (chuẩn Việt Nam)
 * VD: 1000000 -> 1.000.000, 45.86 -> 45,86
 */
export function formatNumberWithCommas(val: any): string {
  if (val === null || val === undefined || val === '') return '';
  const s = String(val).trim();
  const num = parseGridNumber(s);
  if (isNaN(num)) return s;
  return formatGridNumber(num);
}

/**
 * Làm sạch chuỗi nhập số, mở rộng phím tắt và giữ lại phần số/thập phân/dấu âm
 */
export function cleanNumericInput(val: any): string {
  if (val === null || val === undefined) return '';
  const s = String(val).trim();
  const expanded = expandAllShortcuts(s);
  return expanded;
}

export interface SmartNumericRange {
  isRange: boolean;
  from: string;
  to: string;
  fromNum: number;
  toNum: number;
  formatted: string;
}

/**
 * Phân tích khoảng số thông minh từ các cú pháp:
 * 1. '..' (VD: 100k..500k, 1tr..5tr)
 * 2. '/'  (VD: 100k/500k, 1tr/5tr)
 * 3. '-'  (VD: 100k - 500k, 1tr - 5tr, 1000 - 5000)
 * 4. '~'  (VD: 100k~500k)
 */
export function parseSmartNumericRange(str: any, bounds?: any): SmartNumericRange | null {
  if (str === null || str === undefined) return null;
  const s = String(str).trim();
  if (!s) return null;

  // 1. Phân tách theo '..'
  if (s.includes('..')) {
    const parts = s.split('..');
    const cleanLeft = cleanNumericInput(parts[0]?.trim() || '');
    const cleanRight = cleanNumericInput(parts[1]?.trim() || '');
    const formattedLeft = cleanLeft ? formatNumberWithCommas(cleanLeft) : '';
    const formattedRight = cleanRight ? formatNumberWithCommas(cleanRight) : '';
    if (!formattedLeft && !formattedRight) return null;
    return {
      isRange: true,
      from: formattedLeft,
      to: formattedRight,
      fromNum: formattedLeft ? parseGridNumber(formattedLeft) : NaN,
      toNum: formattedRight ? parseGridNumber(formattedRight) : NaN,
      formatted: `${formattedLeft}..${formattedRight}`,
    };
  }

  // 2. Phân tách theo '/'
  if (s.includes('/')) {
    const parts = s.split('/');
    const cleanLeft = cleanNumericInput(parts[0]?.trim() || '');
    const cleanRight = cleanNumericInput(parts[1]?.trim() || '');
    const formattedLeft = cleanLeft ? formatNumberWithCommas(cleanLeft) : '';
    const formattedRight = cleanRight ? formatNumberWithCommas(cleanRight) : '';
    if (!formattedLeft && !formattedRight) return null;
    return {
      isRange: true,
      from: formattedLeft,
      to: formattedRight,
      fromNum: formattedLeft ? parseGridNumber(formattedLeft) : NaN,
      toNum: formattedRight ? parseGridNumber(formattedRight) : NaN,
      formatted: `${formattedLeft} / ${formattedRight}`,
    };
  }

  // 3. Phân tách theo '~'
  if (s.includes('~')) {
    const parts = s.split('~');
    const cleanLeft = cleanNumericInput(parts[0]?.trim() || '');
    const cleanRight = cleanNumericInput(parts[1]?.trim() || '');
    const formattedLeft = cleanLeft ? formatNumberWithCommas(cleanLeft) : '';
    const formattedRight = cleanRight ? formatNumberWithCommas(cleanRight) : '';
    if (!formattedLeft && !formattedRight) return null;
    return {
      isRange: true,
      from: formattedLeft,
      to: formattedRight,
      fromNum: formattedLeft ? parseGridNumber(formattedLeft) : NaN,
      toNum: formattedRight ? parseGridNumber(formattedRight) : NaN,
      formatted: `${formattedLeft} - ${formattedRight}`,
    };
  }

  // 4. Phân tách theo '-'
  const dashMatch = s.match(/^([^–—-]+)\s*[-–—]\s*(.*)$/);
  if (dashMatch) {
    const cleanLeft = cleanNumericInput(dashMatch[1]);
    const cleanRight = cleanNumericInput(dashMatch[2]);
    const formattedLeft = cleanLeft ? formatNumberWithCommas(cleanLeft) : '';
    const formattedRight = cleanRight ? formatNumberWithCommas(cleanRight) : '';
    if (!formattedLeft && !formattedRight) return null;
    return {
      isRange: true,
      from: formattedLeft,
      to: formattedRight,
      fromNum: formattedLeft ? parseGridNumber(formattedLeft) : NaN,
      toNum: formattedRight ? parseGridNumber(formattedRight) : NaN,
      formatted: `${formattedLeft} - ${formattedRight}`,
    };
  }

  return null;
}

/**
 * Định dạng chuỗi nhập liệu thông minh cho ô số, hỗ trợ phím tắt và khoảng số
 */
export function formatSmartInputText(v: any, bounds?: any, autoDashAtFrom: boolean = false): string {
  if (v === null || v === undefined) return '';
  const s = String(v);

  // Nếu đang ở chế độ Trong khoảng và vừa gõ xong đơn vị phím tắt k, tr, ty, t, m, b
  const isShortcutAtFrom =
    autoDashAtFrom &&
    !s.includes('-') &&
    !s.includes('/') &&
    !s.includes('..') &&
    !s.includes(';') &&
    /\d+(?:[.,]\d+)?\s*(k|tr|triệu|ty|tỷ|m|b|t)$/i.test(s);

  const expanded = expandAllShortcuts(s);

  if (expanded.includes(';') && !expanded.includes('..')) {
    return expanded
      .split(';')
      .map((p) => {
        const t = p.trim();
        if (!t) return '';
        if (t.includes('/') || t.includes('-')) {
          const rng = parseSmartNumericRange(t, bounds);
          return rng ? rng.formatted : t;
        }
        if (/[a-zA-Zà-ỹÀ-Ỹ]/.test(t)) return t;
        const c = cleanNumericInput(t);
        return c ? formatNumberWithCommas(c) : t;
      })
      .join('; ');
  }

  if (expanded.includes('..') || expanded.includes('/') || expanded.includes('-') || expanded.includes('~')) {
    const range = parseSmartNumericRange(expanded, bounds);
    if (range) {
      if (s.trim().endsWith('-') || s.trim().endsWith('/')) {
        return range.from ? `${range.from} - ` : '';
      }
      return range.formatted;
    }
  }

  if (/[a-zA-Zà-ỹÀ-Ỹ]/.test(expanded)) {
    return expanded;
  }

  const numOnly = cleanNumericInput(expanded);
  const formatted = numOnly ? formatNumberWithCommas(numOnly) : expanded;
  if (isShortcutAtFrom && formatted) {
    return `${formatted} - `;
  }
  return formatted;
}

/**
 * Chặn các ký tự chữ cái không hợp lệ khi gõ vào ô số, CHỈ cho phép số, dấu phân cách, dấu âm trong ngoặc và phím tắt ghi gọn (k, tr, m, b, t, ty, tỷ)
 */
export function handleNumericKeyDown(e: React.KeyboardEvent): void {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  const allowedSpecial = [
    'Backspace',
    'Delete',
    'ArrowLeft',
    'ArrowRight',
    'ArrowUp',
    'ArrowDown',
    'Tab',
    'Home',
    'End',
    'PageUp',
    'PageDown',
    'Enter',
    'Escape',
  ];
  if (allowedSpecial.includes(e.key)) return;
  // Chỉ cho phép: số 0-9, dấu phân cách .,/-, dấu ngoặc (), dấu cách, và các phím tắt k, tr, m, b, t, ty, tỷ
  if (!/^[0-9/,\-. ;kKtTrRyYỷỶmMbB()~]$/i.test(e.key)) {
    e.preventDefault();
  }
}
