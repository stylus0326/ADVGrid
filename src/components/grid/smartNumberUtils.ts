// smartNumberUtils.ts - Bộ công cụ xử lý số thông minh, phím tắt k, m, tr, b, ty và bộ lọc khoảng số cho AdvGridView
import { parseGridNumber, formatGridNumber } from './gridFormatUtils';

/**
 * Regex nhận diện các phím tắt đơn vị số theo quy ước chuẩn:
 * - k / K: nghìn (x1.000)
 * - m / M, tr / TR: triệu (x1.000.000)
 * - b / B, ty / TY: tỷ (x1.000.000.000)
 * Hỗ trợ cả số thập phân (1.5tr, 2,5k) và số phụ (1tr5 -> 1.500.000, 2k5 -> 2.500, 1ty2 -> 1.200.000.000)
 */
export const NUMERIC_SHORTCUT_REGEX =
  /(^|[^a-zA-Z0-9à-ỹÀ-Ỹ])(\d+(?:[.,]\d+)*)\s*(tr|ty|k|m|b)(?:\s*(\d+))?(?=$|[^a-zA-Z0-9à-ỹÀ-Ỹ])/gi;

/**
 * Mở rộng tất cả các ký tự phím tắt đơn vị số thành số thực tế:
 * VD: '1k' -> '1000', '1m' / '1tr' -> '1000000', '1b' / '1ty' -> '1000000000', '1.5tr' -> '1500000', '1tr5' -> '1500000'
 */
export function expandAllShortcuts(text: any): string {
  if (text === null || text === undefined) return '';
  return String(text).replace(
    NUMERIC_SHORTCUT_REGEX,
    (match, prefix, numStr, unit, subStr) => {
      const mainNum = parseGridNumber(numStr);
      if (isNaN(mainNum)) return match;
      const u = String(unit).toLowerCase();
      let mult = 1;
      if (u === 'k') mult = 1000;
      else if (u === 'm' || u === 'tr') mult = 1000000;
      else if (u === 'b' || u === 'ty') mult = 1000000000;
      let subVal = 0;
      if (subStr) {
        subVal = parseFloat(String(subStr)) / Math.pow(10, String(subStr).length);
      }
      const total = Math.round((mainNum + subVal) * mult * 1e6) / 1e6;
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
  if (/[a-zA-Zà-ỹÀ-Ỹ]/.test(s)) return s;
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
export function formatSmartInputText(v: any, bounds?: any, _autoDashAtFrom: boolean = false): string {
  if (v === null || v === undefined) return '';
  const s = String(v);
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
        if (/\d[.,]$/.test(t)) return t;
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

  if (/\d[.,]$/.test(expanded)) {
    return expanded;
  }

  const numOnly = cleanNumericInput(expanded);
  return numOnly ? formatNumberWithCommas(numOnly) : expanded;
}

/**
 * Chặn các ký tự chữ cái không hợp lệ khi gõ vào ô số, CHỈ cho phép số, dấu phân cách, dấu âm trong ngoặc và phím tắt ghi gọn (k, m, tr, b, ty)
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
  // Chỉ cho phép: số 0-9, dấu phân cách .,/-, dấu ngoặc (), dấu cách, và các phím tắt k, m, tr, b, ty
  if (!/^[0-9/,\-. ;kmtrby()~]$/i.test(e.key)) {
    e.preventDefault();
  }
}
