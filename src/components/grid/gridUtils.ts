import {
  ColumnDef,
  ColumnAlign,
  FilterOperation,
  ColumnFilterValue,
  SortConfig,
  FILTER_OPS,
  DATA_TYPES,
  FILTER_MODES,
  SORT_DIRECTIONS,
  ALIGNMENTS,
  FORMULA_MODES,
  FormulaMode,
} from './types';
import { expandAllShortcuts } from './smartNumberUtils';

let _measureCanvas: HTMLCanvasElement | null = null;

/**
 * Đo chiều rộng văn bản chính xác theo pixel bằng HTML5 Canvas ẩn
 */
export function measureTextWidth(
  text: string | number,
  font = '12px Montserrat, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
): number {
  if (typeof document === 'undefined') return 100;
  if (!_measureCanvas) _measureCanvas = document.createElement('canvas');
  const ctx = _measureCanvas.getContext('2d');
  if (!ctx) return 100;
  ctx.font = font;
  return ctx.measureText(String(text ?? '')).width;
}

/**
 * Tự động tính toán độ rộng tối ưu cho cột STT dựa trên số chữ số của tổng số dòng
 */
export function getSttColWidth(totalRows: number, title = ''): number {
  const digits = Math.max(2, String(Math.max(1, totalRows || 0)).length);
  // Font 12px Montserrat: ~7.2px mỗi chữ số, padding tối thiểu 5px mỗi bên (10px)
  const textW = digits * 7.2;
  const titleW = title ? title.length * 7.5 : 0;
  return Math.max(36, Math.ceil(Math.max(textW, titleW) + 10));
}

/**
 * Tự động tính toán độ rộng tối ưu cho cột (Auto-Fit Column Width) bao gồm cả Dữ liệu, Tổng nhóm và Tổng bảng
 */
export function calcColAutoFitWidth<T = any>(
  col: ColumnDef<T>,
  sampleData: T[] = [],
  maxLimit = 380,
  minLimit = 65,
  summaryValues?: (number | string)[],
  totalRows?: number
): number {
  if (!col) return 120;
  if (col.dataType === DATA_TYPES.SYSTEM) {
    if (!col.title) return col.defaultWidth || 32;
    return getSttColWidth(totalRows || (Array.isArray(sampleData) ? sampleData.length : 100), col.title);
  }
  if (col.isChart) return col.minWidth || col.defaultWidth || 150;

  const isNumeric = col.align === ALIGNMENTS.RIGHT || col.dataType === DATA_TYPES.NUMBER;
  const textFont = isNumeric
    ? '12px Montserrat, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    : '12px Montserrat, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

  // 1. Kích thước cần thiết cho Tiêu đề cột (Header Title + khoảng cách an toàn)
  const titleW = measureTextWidth(col.title || col.key, 'bold 11px Montserrat, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif');
  const headerNeeded = titleW + 36; // 36px cho padding 2 bên và icon sắp xếp

  // 2. Kích thước cần thiết cho Dữ liệu các dòng (lấy mẫu 100 dòng đầu để đạt hiệu năng tức thì)
  let maxDataW = 0;
  const sample = Array.isArray(sampleData) ? sampleData.slice(0, 100) : [];
  sample.forEach((row: any) => {
    let val: any = '';
    if (row?._isGroupRow) {
      val = row.groupSums?.[col.key];
    } else if (col.isFormula) {
      val = 'T12: 100.0';
    } else if (row?.cells instanceof Map) {
      val = row.cells.get(col.key)?.value;
    } else if (row?.cells && typeof row.cells === 'object' && row.cells[col.key] !== undefined) {
      val = row.cells[col.key]?.value ?? row.cells[col.key];
    } else if (row?.[col.key] !== undefined) {
      val = row[col.key];
    }
    if (val !== undefined && val !== null && val !== '' && typeof val !== 'boolean') {
      const str = typeof val === 'number' ? val.toLocaleString('vi-VN') : String(val);
      const w = measureTextWidth(str, textFont);
      if (w > maxDataW) maxDataW = w;
    }
  });

  // 3. Kích thước cần thiết cho các giá trị Tổng nhóm (Group Sums) & Tổng toàn bảng (Column Sums)
  if (Array.isArray(summaryValues) && summaryValues.length > 0) {
    summaryValues.forEach((s) => {
      if (s !== undefined && s !== null && s !== '') {
        const str = typeof s === 'number' ? s.toLocaleString('vi-VN') : String(s);
        const w = measureTextWidth(str, 'bold 12px Montserrat, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif');
        if (w > maxDataW) maxDataW = w;
      }
    });
  }

  const dataNeeded = maxDataW > 0 ? maxDataW + 28 : 0; // 28px padding ô (px-2.5) + an toàn
  const needed = Math.max(headerNeeded, dataNeeded);
  const calculated = Math.max(col.minWidth || minLimit, Math.ceil(needed));
  return maxLimit ? Math.min(maxLimit, calculated) : calculated;
}

/**
 * Tính toán tọa độ an toàn cho Menu ngữ cảnh, chống tràn ra ngoài khung nhìn (Boundary Clamping)
 */
export function computeContextMenuCoords(
  clickX: number,
  clickY: number,
  menuW = 210,
  menuH = 200,
  rootEl?: HTMLElement | null
): { top: number; left: number } {
  let left = clickX;
  let top = clickY;

  if (rootEl) {
    const gridRect = rootEl.getBoundingClientRect();
    if (left + menuW > gridRect.right - 8) {
      left = Math.max(gridRect.left + 8, gridRect.right - menuW - 8);
    }
    if (left < gridRect.left + 8) {
      left = gridRect.left + 8;
    }
    if (top + menuH > gridRect.bottom - 8) {
      top = Math.max(gridRect.top + 8, gridRect.bottom - menuH - 8);
    }
    if (top < gridRect.top + 8) {
      top = gridRect.top + 8;
    }
  } else if (typeof window !== 'undefined') {
    if (left + menuW > window.innerWidth - 8) {
      left = Math.max(8, window.innerWidth - menuW - 8);
    }
    if (top + menuH > window.innerHeight - 8) {
      top = Math.max(8, window.innerHeight - menuH - 8);
    }
  }

  return { top, left };
}

/**
 * Sao chép văn bản vào Clipboard an toàn (hỗ trợ cả navigator.clipboard lẫn execCommand fallback)
 */
export async function copyTextToClipboard(text: string): Promise<boolean> {
  if (!text) return false;
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fallback nếu trình duyệt chặn quyền clipboard
  }

  try {
    if (typeof document !== 'undefined') {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      textarea.style.top = '-9999px';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textarea);
      return success;
    }
  } catch {
    // im lặng nếu không sao chép được
  }
  return false;
}

export { formatGridDateValue } from '../ui/AdvDatePicker';

/**
 * Chuyển đổi mọi giá trị chuỗi hoặc số thành kiểu number chuẩn xác.
 * Hỗ trợ nhận diện thông minh cả chuẩn Việt Nam (1.234,56) lẫn chuẩn Quốc tế (1,234.56).
 */
/**
 * Chuyển đổi an toàn chuỗi nhập liệu hoặc giá trị bất kỳ thành số thực (number):
 * - Hỗ trợ số âm đặt trong ngoặc đơn: (1.000) -> -1000, (1.234,56) -> -1234.56
 * - Hỗ trợ chuẩn phân cách hàng nghìn Việt Nam (chấm hàng nghìn, phẩy thập phân): 1.000 -> 1000
 * - Hỗ trợ chuẩn quốc tế (phẩy hàng nghìn, chấm thập phân): 1,234.56 -> 1234.56
 */
export function parseGridNumber(val: any): number {
  if (val === null || val === undefined || val === '') return NaN;
  if (typeof val === 'number') return val;
  let s = String(val).trim();
  if (!s) return NaN;

  // 1. Nhận diện số âm dạng ngoặc đơn: (1.234) hoặc (1234) hoặc có tiền tố dấu âm -1234
  let isNegative = false;
  if (/^\s*\((.*)\)\s*$/.test(s)) {
    isNegative = true;
    s = s.replace(/^\s*\((.*)\)\s*$/, '$1').trim();
  } else if (/^\s*-\s*(.*)$/.test(s)) {
    isNegative = true;
    s = s.replace(/^\s*-\s*/, '').trim();
  }

  // 2. Loại bỏ các ký tự không phải số, dấu chấm, dấu phẩy
  s = s.replace(/[^0-9.,]/g, '');
  if (!s) return NaN;

  let result = NaN;
  const lastDot = s.lastIndexOf('.');
  const lastComma = s.lastIndexOf(',');

  if (lastDot !== -1 && lastComma !== -1) {
    if (lastDot < lastComma) {
      // Chuẩn Việt Nam: "1.234,56" (chấm hàng nghìn, phẩy thập phân)
      result = parseFloat(s.replace(/\./g, '').replace(',', '.'));
    } else {
      // Chuẩn Quốc tế: "1,234.56" (phẩy hàng nghìn, chấm thập phân)
      result = parseFloat(s.replace(/,/g, ''));
    }
  } else if (lastDot !== -1) {
    // Chỉ có dấu chấm
    if (s.indexOf('.') !== lastDot) {
      // Nhiều dấu chấm: "1.000.000" -> chắc chắn là phân cách hàng nghìn
      result = parseFloat(s.replace(/\./g, ''));
    } else {
      // Đúng 1 dấu chấm: vd "1.000" vs "12.5"
      const afterDot = s.slice(lastDot + 1);
      if (afterDot.length === 3) {
        // Đúng 3 chữ số sau dấu chấm (vd "1.000", "50.000") -> phân cách hàng nghìn chuẩn VN
        result = parseFloat(s.replace(/\./g, ''));
      } else {
        // Khác 3 chữ số (vd "12.5", "12.50") -> dấu chấm thập phân
        result = parseFloat(s);
      }
    }
  } else if (lastComma !== -1) {
    // Chỉ có dấu phẩy: vd "45,86" -> chuẩn thập phân VN
    if (s.indexOf(',') !== lastComma) {
      // Nhiều dấu phẩy: "1,000,000" -> phân cách hàng nghìn
      result = parseFloat(s.replace(/,/g, ''));
    } else {
      result = parseFloat(s.replace(',', '.'));
    }
  } else {
    result = parseFloat(s);
  }

  if (isNaN(result)) return NaN;
  return isNegative ? -result : result;
}

/**
 * Định dạng số đồng nhất toàn hệ thống theo chuẩn tài chính/kế toán (#,###.##):
 * - Hàng nghìn: Dấu chấm '.' (VD: 1.000, 1.000.000)
 * - Thập phân: Dấu phẩy ',' (VD: 45,86; 42,51)
 * - Số nguyên: Không hiển thị phần thập phân thừa (VD: 5.000 thay vì 5.000,00)
 * - Số âm: Luôn đặt trong ngoặc đơn (VD: (1.000), (1.234,56), (500))
 */
export function formatGridNumber(val: any, decimals?: number): string {
  const num = typeof val === 'number' ? val : parseGridNumber(val);
  if (isNaN(num)) return typeof val === 'string' ? val : '';

  const isNeg = num < 0;
  const absNum = Math.abs(num);

  let formatted = '';
  if (decimals !== undefined) {
    formatted = absNum.toLocaleString('vi-VN', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  } else {
    const hasDecimal = absNum % 1 !== 0;
    formatted = absNum.toLocaleString('vi-VN', {
      maximumFractionDigits: hasDecimal ? 2 : 0,
    });
  }

  return isNeg ? `(${formatted})` : formatted;
}

/**
 * Bản đồ và hàm tiện ích chuẩn hóa lớp CSS căn chỉnh văn bản (Text Alignment)
 */
export const ALIGN_TEXT_CLASSES: Record<ColumnAlign, string> = {
  [ALIGNMENTS.LEFT]: 'text-left',
  [ALIGNMENTS.CENTER]: 'text-center',
  [ALIGNMENTS.RIGHT]: 'text-right',
};

export function getAlignTextClass(align?: ColumnAlign): string {
  return (align && ALIGN_TEXT_CLASSES[align]) || ALIGN_TEXT_CLASSES[ALIGNMENTS.LEFT];
}

/**
 * Bản đồ và hàm tiện ích chuẩn hóa lớp CSS căn chỉnh Flexbox (Justify Alignment)
 */
export const ALIGN_JUSTIFY_CLASSES: Record<ColumnAlign, string> = {
  [ALIGNMENTS.LEFT]: 'justify-start',
  [ALIGNMENTS.CENTER]: 'justify-center',
  [ALIGNMENTS.RIGHT]: 'justify-end',
};

export function getAlignJustifyClass(align?: ColumnAlign): string {
  return (align && ALIGN_JUSTIFY_CLASSES[align]) || ALIGN_JUSTIFY_CLASSES[ALIGNMENTS.LEFT];
}

/**
 * Phân tách chuỗi dải ngày thành cặp [từ_ngày, đến_ngày]
 */
export function splitDateRange(s: string): [string, string] | null {
  if (!s) return null;
  const str = s.trim();
  if (str.includes('..')) {
    const parts = str.split('..');
    return [parts[0].trim(), parts[1].trim()];
  }
  if (/\s+-\s+|\s+đến\s+|\s+to\s+/i.test(str)) {
    const parts = str.split(/\s+-\s+|\s+đến\s+|\s+to\s+/i);
    return [parts[0].trim(), parts[1].trim()];
  }
  return null;
}

/**
 * Chuyển đổi chuỗi ngày thành timestamp milliseconds
 */
export function parseSingleDateTimestamp(s: string, isEnd: boolean = false): number | null {
  if (!s) return null;
  const str = s.trim();
  const dmy = str.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
  if (dmy) {
    const d = parseInt(dmy[1], 10);
    const m = parseInt(dmy[2], 10) - 1;
    const y = parseInt(dmy[3], 10);
    return new Date(y, m, d, isEnd ? 23 : 0, isEnd ? 59 : 0, isEnd ? 59 : 0, isEnd ? 999 : 0).getTime();
  }
  const ymd = str.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/);
  if (ymd) {
    const y = parseInt(ymd[1], 10);
    const m = parseInt(ymd[2], 10) - 1;
    const d = parseInt(ymd[3], 10);
    return new Date(y, m, d, isEnd ? 23 : 0, isEnd ? 59 : 0, isEnd ? 59 : 0, isEnd ? 999 : 0).getTime();
  }
  const yr = str.match(/^(\d{4})$/);
  if (yr) {
    const y = parseInt(yr[1], 10);
    return isEnd ? new Date(y, 11, 31, 23, 59, 59, 999).getTime() : new Date(y, 0, 1, 0, 0, 0, 0).getTime();
  }
  return null;
}

/**
 * Chuyển đổi chuỗi giờ phút HH:mm thành số phút trong ngày (0..1439)
 */
export function parseTimeToMinutes(s: string): number | null {
  if (!s) return null;
  const match = s.trim().match(/^(\d{1,2}):?(\d{0,2})$/);
  if (!match) return null;
  const h = parseInt(match[1], 10);
  const m = match[2] ? parseInt(match[2], 10) : 0;
  if (isNaN(h) || isNaN(m)) return null;
  return h * 60 + m;
}

/**
 * Kiểm tra toán tử có phải thuộc nhóm không cần giá trị nhập liệu (Để trống, Không để trống, Số dương, Số âm)
 */
export function isNoInputFilterOp(op?: string | null): boolean {
  if (!op) return false;
  return (
    op === FILTER_OPS.IS_EMPTY ||
    op === FILTER_OPS.IS_NOT_EMPTY ||
    op === FILTER_OPS.IS_POSITIVE ||
    op === FILTER_OPS.IS_NEGATIVE
  );
}

/**
 * Kiểm tra toán tử khoảng (Trong khoảng / Between)
 */
export function isBetweenFilterOp(op?: string | null): boolean {
  return op === FILTER_OPS.BETWEEN;
}

/**
 * Kiểm tra toán tử phủ định (Khác, Không chứa)
 */
export function isNegativeFilterOp(op?: string | null): boolean {
  return op === FILTER_OPS.NOT_EQUALS || op === FILTER_OPS.NOT_CONTAINS;
}

/**
 * Khởi tạo cấu hình bộ lọc cột chuẩn (ColumnFilterValue) với toán tử chỉ định (mặc định '=')
 */
export function createColumnFilter(
  val: any,
  op: FilterOperation = FILTER_OPS.EQUALS
): ColumnFilterValue {
  return {
    op,
    val: val === null || val === undefined ? '' : String(val),
  };
}

export function createEqualsFilter(val: any): ColumnFilterValue {
  return createColumnFilter(val, FILTER_OPS.EQUALS);
}

export function createContainsFilter(val: any): ColumnFilterValue {
  return createColumnFilter(val, FILTER_OPS.CONTAINS);
}

export function createBetweenFilter(from: any, to: any): ColumnFilterValue {
  return {
    op: FILTER_OPS.BETWEEN,
    val: `${from ?? ''}..${to ?? ''}`,
  };
}

/**
 * Hàm kiểm tra bộ lọc dữ liệu siêu tốc O(1) chuẩn DevExtreme cho mọi kiểu dữ liệu (text, number, date, time)
 */
export function matchFilterValue(
  cellVal: any,
  op: FilterOperation,
  query: string,
  dataType: string = DATA_TYPES.TEXT,
  filterObj?: any
): boolean {
  // 1. Kiểm tra bộ lọc Checklist nếu có
  const isChecklistActive = Boolean(
    filterObj &&
      ((Array.isArray(filterObj.selectedValues) && filterObj.selectedValues.length > 0) ||
        filterObj.includeBlanks)
  );

  if (isChecklistActive) {
    const { selectedValues = [], includeBlanks } = filterObj;
    const isBlank =
      cellVal === undefined ||
      cellVal === null ||
      (typeof cellVal === 'string' && cellVal.trim() === '');
    if (isBlank) {
      if (!includeBlanks) return false;
    } else {
      if (selectedValues.length > 0) {
        const cellValStr = String(cellVal).trim();
        const matched = selectedValues.some((v: any) => {
          const vStr = String(v).trim();
          if (vStr === cellValStr) return true;
          if (dataType === DATA_TYPES.NUMBER) {
            const cleanV = vStr.replace(/,/g, '');
            const cleanC = cellValStr.replace(/,/g, '');
            if (cleanV === cleanC) return true;
          }
          return false;
        });
        if (!matched) return false;
      } else if (!includeBlanks) {
        return false;
      }
    }
  }

  // 2. Kiểm tra bộ lọc Row Filter
  const isMultiActive =
    filterObj?.mode === FILTER_MODES.MULTI &&
    Boolean(
      (Array.isArray(filterObj.multiValues) && filterObj.multiValues.length > 0) ||
      (Array.isArray(filterObj.multiRanges) && filterObj.multiRanges.length > 0)
    );
  const isNoInputOp = isNoInputFilterOp(op);
  const hasInputVal = typeof query === 'string' && query.trim().length > 0;

  const isRowFilterActive = isMultiActive || isNoInputOp || hasInputVal;

  if (!isRowFilterActive) {
    return true;
  }

  // Các toán tử trạng thái không cần input
  if (op === FILTER_OPS.IS_EMPTY) {
    return cellVal === null || cellVal === undefined || String(cellVal).trim() === '';
  }
  if (op === FILTER_OPS.IS_NOT_EMPTY) {
    return cellVal !== null && cellVal !== undefined && String(cellVal).trim() !== '';
  }
  if (op === FILTER_OPS.IS_POSITIVE) {
    const num = parseGridNumber(cellVal);
    return !isNaN(num) && num > 0;
  }
  if (op === FILTER_OPS.IS_NEGATIVE) {
    const num = parseGridNumber(cellVal);
    return !isNaN(num) && num < 0;
  }

  const q = query.trim();
  if (!q) return true;

  // Kiểu Ngày Tháng (Date / Datetime / DateRange)
  if (dataType === DATA_TYPES.DATE) {
    const cellStr = String(cellVal ?? '').trim();

    const cellRange = splitDateRange(cellStr);
    let cellStart: number | null = null;
    let cellEnd: number | null = null;

    if (cellRange) {
      cellStart = parseSingleDateTimestamp(cellRange[0], false);
      cellEnd = parseSingleDateTimestamp(cellRange[1], true);
    } else {
      cellStart = parseSingleDateTimestamp(cellStr, false);
      cellEnd = parseSingleDateTimestamp(cellStr, true);
    }

    const qRange = splitDateRange(q);
    let qStart: number | null = null;
    let qEnd: number | null = null;

    if (qRange) {
      qStart = parseSingleDateTimestamp(qRange[0], false);
      qEnd = parseSingleDateTimestamp(qRange[1], true);
    } else {
      qStart = parseSingleDateTimestamp(q, false);
      qEnd = parseSingleDateTimestamp(q, true);
    }

    if (cellStart !== null && cellEnd !== null && qStart !== null) {
      const effQEnd = qEnd !== null ? qEnd : qStart;

      if (qRange || isBetweenFilterOp(op)) {
        return cellStart <= effQEnd && cellEnd >= qStart;
      }

      switch (op) {
        case FILTER_OPS.EQUALS:
          return qStart >= cellStart && qStart <= cellEnd;
        case FILTER_OPS.NOT_EQUALS:
          return !(qStart >= cellStart && qStart <= cellEnd);
        case FILTER_OPS.GREATER_THAN:
          return cellEnd > effQEnd;
        case FILTER_OPS.GREATER_EQUALS:
          return cellEnd >= qStart;
        case FILTER_OPS.LESS_THAN:
          return cellStart < qStart;
        case FILTER_OPS.LESS_EQUALS:
          return cellStart <= effQEnd;
      }
    }

    return cellStr.toLowerCase().includes(q.toLowerCase());
  }

  // Kiểu Giờ Phút (Time: HH:mm)
  if (dataType === DATA_TYPES.TIME) {
    const cellStr = String(cellVal ?? '').trim();
    const cellMinutes = parseTimeToMinutes(cellStr);

    const isRangeQuery = /\s*-\s*|\.\.|\~/.test(q);
    if (isRangeQuery || isBetweenFilterOp(op)) {
      const parts = q.split(/\s*-\s*|\.\.|\~/);
      const fromMin = parseTimeToMinutes(parts[0]?.trim() || '');
      const toMin = parts.length > 1 ? parseTimeToMinutes(parts[1]?.trim() || '') : null;

      if (cellMinutes === null) return false;
      if (fromMin !== null && toMin !== null) {
        const minT = Math.min(fromMin, toMin);
        const maxT = Math.max(fromMin, toMin);
        return cellMinutes >= minT && cellMinutes <= maxT;
      }
      if (fromMin !== null) return cellMinutes >= fromMin;
      if (toMin !== null) return cellMinutes <= toMin;
      return true;
    }

    const qMinutes = parseTimeToMinutes(q);
    if (cellMinutes !== null && qMinutes !== null) {
      switch (op) {
        case FILTER_OPS.EQUALS:
          return cellMinutes === qMinutes;
        case FILTER_OPS.NOT_EQUALS:
          return cellMinutes !== qMinutes;
        case FILTER_OPS.GREATER_EQUALS:
          return cellMinutes >= qMinutes;
        case FILTER_OPS.LESS_EQUALS:
          return cellMinutes <= qMinutes;
      }
    }

    return cellStr.toLowerCase().includes(q.toLowerCase());
  }

  // Toán tử Trong khoảng (between) cho kiểu số hoặc text
  const expandedQ = expandAllShortcuts(q);

  if (
    isBetweenFilterOp(op) ||
    (dataType === DATA_TYPES.NUMBER && (expandedQ.includes('..') || expandedQ.includes(' - ') || expandedQ.includes('/') || expandedQ.includes('~')))
  ) {
    let fromStr = '';
    let toStr = '';
    if (expandedQ.includes('..')) {
      const parts = expandedQ.split('..');
      fromStr = parts[0]?.trim() || '';
      toStr = parts[1]?.trim() || '';
    } else if (expandedQ.includes(' - ')) {
      const parts = expandedQ.split(' - ');
      fromStr = parts[0]?.trim() || '';
      toStr = parts[1]?.trim() || '';
    } else if (expandedQ.includes('/')) {
      const parts = expandedQ.split('/');
      fromStr = parts[0]?.trim() || '';
      toStr = parts[1]?.trim() || '';
    } else if (expandedQ.includes('~')) {
      const parts = expandedQ.split('~');
      fromStr = parts[0]?.trim() || '';
      toStr = parts[1]?.trim() || '';
    } else {
      const dashMatch = expandedQ.match(/^([^–—-]+)\s*[-–—]\s*(.*)$/);
      if (dashMatch) {
        fromStr = dashMatch[1]?.trim() || '';
        toStr = dashMatch[2]?.trim() || '';
      } else {
        fromStr = expandedQ;
      }
    }

    const min = parseGridNumber(fromStr);
    const max = parseGridNumber(toStr);
    const num = parseGridNumber(cellVal);

    if (!isNaN(num)) {
      if (!isNaN(min) && !isNaN(max)) {
        return num >= Math.min(min, max) && num <= Math.max(min, max);
      }
      if (!isNaN(min)) return num >= min;
      if (!isNaN(max)) return num <= max;
      return true;
    }

    const strVal = String(cellVal ?? '').toLowerCase();
    const sMin = fromStr.toLowerCase();
    const sMax = toStr.toLowerCase();
    if (sMin && sMax) return strVal >= sMin && strVal <= sMax;
    if (sMin) return strVal >= sMin;
    if (sMax) return strVal <= sMax;
    return strVal.includes(expandedQ.toLowerCase());
  }

  // Kiểu số
  if (dataType === DATA_TYPES.NUMBER) {
    const numVal = parseGridNumber(cellVal);
    const numQ = parseGridNumber(expandedQ);

    if (!isNaN(numVal) && !isNaN(numQ)) {
      switch (op) {
        case FILTER_OPS.EQUALS:
          return Math.abs(numVal - numQ) < 0.001;
        case FILTER_OPS.NOT_EQUALS:
          return Math.abs(numVal - numQ) >= 0.001;
        case FILTER_OPS.GREATER_THAN:
          return numVal > numQ;
        case FILTER_OPS.GREATER_EQUALS:
          return numVal >= numQ;
        case FILTER_OPS.LESS_THAN:
          return numVal < numQ;
        case FILTER_OPS.LESS_EQUALS:
          return numVal <= numQ;
        case FILTER_OPS.CONTAINS: {
          const rawCellStr = String(cellVal ?? '');
          const formattedCellStr = formatGridNumber(cellVal);
          const cleanQ = expandedQ.trim();
          return rawCellStr.includes(cleanQ) || formattedCellStr.includes(cleanQ);
        }
      }
    }
  }

  // Mặc định là chuỗi / văn bản
  const strVal = String(cellVal ?? '').toLowerCase();
  const strQ = q.toLowerCase();

  switch (op) {
    case FILTER_OPS.CONTAINS:
      return strVal.includes(strQ);
    case FILTER_OPS.NOT_CONTAINS:
      return !strVal.includes(strQ);
    case FILTER_OPS.STARTS_WITH:
      return strVal.startsWith(strQ);
    case FILTER_OPS.ENDS_WITH:
      return strVal.endsWith(strQ);
    case FILTER_OPS.EQUALS:
      return strVal === strQ;
    case FILTER_OPS.NOT_EQUALS:
      return strVal !== strQ;
    case FILTER_OPS.GREATER_THAN:
      return strVal > strQ;
    case FILTER_OPS.GREATER_EQUALS:
      return strVal >= strQ;
    case FILTER_OPS.LESS_THAN:
      return strVal < strQ;
    case FILTER_OPS.LESS_EQUALS:
      return strVal <= strQ;
    default:
      return strVal.includes(strQ);
  }
}

/**
 * Trích xuất an toàn giá trị ô từ bất kỳ đối tượng dòng nào (hỗ trợ cả plain object lẫn Map)
 */
export function getGridCellValue(row: any, colKey: string): any {
  if (!row) return undefined;
  if (row.cells instanceof Map) {
    const c = row.cells.get(colKey);
    return c?.value !== undefined ? c.value : undefined;
  }
  if (typeof row === 'object' && row[colKey] !== undefined) {
    return row[colKey];
  }
  return undefined;
}

/**
 * Trích xuất giá trị ô để phục vụ pipeline sắp xếp mảng
 */
export function getRowValueForSortGeneric(
  row: any,
  colKey: string,
  dataType?: string,
  sortByMonth?: boolean,
  formulaMode?: FormulaMode | string
): number | string {
  if (!row) return '';
  const rawVal = getGridCellValue(row, colKey);

  // Đặc biệt khi sắp xếp theo tháng (cho cột công thức MIN/MAX)
  if (sortByMonth && (formulaMode === FORMULA_MODES.MIN || formulaMode === FORMULA_MODES.MAX)) {
    let targetIdx = 0;
    let extremeVal = formulaMode === FORMULA_MODES.MIN ? Infinity : -Infinity;
    for (let m = 1; m <= 12; m++) {
      const v = Number(row[`col_m${m}`]) || 0;
      if (formulaMode === FORMULA_MODES.MIN && v < extremeVal) {
        extremeVal = v;
        targetIdx = m - 1;
      } else if (formulaMode === FORMULA_MODES.MAX && v > extremeVal) {
        extremeVal = v;
        targetIdx = m - 1;
      }
    }
    return targetIdx;
  }

  if (dataType === DATA_TYPES.NUMBER) {
    const num = parseGridNumber(rawVal);
    return isNaN(num) ? 0 : num;
  }
  if (dataType === DATA_TYPES.DATE) {
    const ts = parseSingleDateTimestamp(String(rawVal ?? ''));
    return ts !== null ? ts : 0;
  }
  if (dataType === DATA_TYPES.TIME) {
    const mins = parseTimeToMinutes(String(rawVal ?? ''));
    return mins !== null ? mins : 0;
  }
  return String(rawVal ?? '').toLowerCase();
}

/**
 * So sánh 2 dòng dữ liệu phục vụ sắp xếp mảng bất kỳ
 */
export function compareGridRows(
  rowA: any,
  rowB: any,
  sortConfig: SortConfig | null,
  columns?: ColumnDef<any>[],
  formulaMode?: string
): number {
  if (!sortConfig) return 0;
  const colDef = columns?.find((c) => c.key === sortConfig.key);
  const dataType = colDef?.dataType || DATA_TYPES.TEXT;
  const valA = getRowValueForSortGeneric(rowA, sortConfig.key, dataType, sortConfig.sortByMonth, formulaMode);
  const valB = getRowValueForSortGeneric(rowB, sortConfig.key, dataType, sortConfig.sortByMonth, formulaMode);

  if (valA === valB) return 0;
  if (valA === null || valA === undefined || valA === '') return 1;
  if (valB === null || valB === undefined || valB === '') return -1;

  const comparison = valA < valB ? -1 : 1;
  return sortConfig.direction === SORT_DIRECTIONS.ASC ? comparison : -comparison;
}

/**
 * Lấy giới hạn ngày nhỏ nhất và lớn nhất dựa trên dữ liệu thực tế
 */
export function getColumnDateBoundsFromGetter(
  getVal: (r: number, k: string) => any,
  totalRows: number,
  colKey: string,
  sampleSize: number = 300
): { min: string; max: string } {
  let minTs = Infinity;
  let maxTs = -Infinity;

  const checkVal = (v: any) => {
    if (v === null || v === undefined || v === '') return;
    const s = String(v).trim();
    if (!s) return;
    const range = splitDateRange(s);
    if (range) {
      const t1 = parseSingleDateTimestamp(range[0], false);
      const t2 = parseSingleDateTimestamp(range[1], true);
      if (t1 !== null && t1 < minTs) minTs = t1;
      if (t2 !== null && t2 > maxTs) maxTs = t2;
    } else {
      const t = parseSingleDateTimestamp(s, false);
      if (t !== null) {
        if (t < minTs) minTs = t;
        if (t > maxTs) maxTs = t;
      }
    }
  };

  const sampleCount = Math.min(totalRows, sampleSize);
  for (let r = 0; r < sampleCount; r++) {
    checkVal(getVal(r, colKey));
  }

  if (minTs === Infinity || maxTs === -Infinity) {
    return { min: '2017-01-01', max: '2027-12-31' };
  }

  const dMin = new Date(minTs);
  const dMax = new Date(maxTs);
  const pad = (n: number) => String(n).padStart(2, '0');
  return {
    min: `${dMin.getFullYear()}-${pad(dMin.getMonth() + 1)}-${pad(dMin.getDate())}`,
    max: `${dMax.getFullYear()}-${pad(dMax.getMonth() + 1)}-${pad(dMax.getDate())}`,
  };
}

/**
 * Predicate kiểm tra xem một cột có phải là cột chọn dòng (Selection Column / Checkbox Column) hay không.
 * Đóng gói tập trung điều kiện col.isSelection hoặc col.key === 'col_chk'.
 */
export function isSelectionColumn<T = any>(col?: ColumnDef<T> | Partial<ColumnDef<T>> | null): boolean {
  if (!col) return false;
  return Boolean(col.isSelection) || col.key === 'col_chk';
}

/**
 * Cấu trúc trạng thái chọn dòng khi có hoặc không có bộ lọc
 */
export interface FilteredSelectionState {
  allChecked: boolean;
  isIndeterminate: boolean;
  selectedCount: number;
  totalCount: number;
}

/**
 * Tính toán trạng thái chọn dòng tối ưu hóa:
 * Khi bảng không bật bộ lọc (activeRowIndices === null) và số lượng dòng đang chọn < tổng số dòng,
 * hàm chỉ duyệt qua tập checkedRowIndices (k phần tử) thay vì quét đủ 50.000 dòng.
 */
export function computeFilteredSelectionState(
  totalRows: number,
  checkedRowIndices: Set<number>,
  activeRowIndices: number[] | null = null
): FilteredSelectionState {
  const isFiltered = activeRowIndices !== null;
  const totalCount = isFiltered ? activeRowIndices.length : Math.max(0, totalRows);

  if (totalCount === 0) {
    return {
      allChecked: false,
      isIndeterminate: false,
      selectedCount: 0,
      totalCount: 0,
    };
  }

  let selectedCount = 0;

  if (isFiltered) {
    for (let i = 0; i < activeRowIndices.length; i++) {
      if (checkedRowIndices.has(activeRowIndices[i])) {
        selectedCount++;
      }
    }
  } else {
    // Fast-path: Khi bảng không bật bộ lọc (activeRowIndices === null)
    // Chỉ duyệt qua tập checkedRowIndices (k phần tử) thay vì quét đủ 50.000 dòng.
    if (checkedRowIndices.size === 0) {
      selectedCount = 0;
    } else {
      for (const idx of checkedRowIndices) {
        if (idx >= 0 && idx < totalCount) {
          selectedCount++;
        }
      }
    }
  }

  const allChecked = selectedCount > 0 && selectedCount === totalCount;
  const isIndeterminate = selectedCount > 0 && selectedCount < totalCount;

  return {
    allChecked,
    isIndeterminate,
    selectedCount,
    totalCount,
  };
}

/**
 * Đảo / Bật / Tắt chọn hàng loạt các dòng theo bộ lọc đang hiển thị:
 * Fast-path O(1): Khi bỏ chọn toàn bộ trên bảng đang không lọc, trả về ngay new Set<number>() trong O(1)
 * thay vì chạy 50.000 lệnh .delete().
 */
export function toggleFilteredRowsSelection(
  totalRows: number,
  currentChecked: Set<number>,
  activeRowIndices: number[] | null = null,
  forceSelect?: boolean
): Set<number> {
  const selectionState = computeFilteredSelectionState(totalRows, currentChecked, activeRowIndices);
  const shouldSelect = forceSelect !== undefined ? forceSelect : !selectionState.allChecked;

  // Fast-path O(1): Khi bỏ chọn toàn bộ trên bảng đang không lọc, trả về ngay new Set<number>() trong O(1)
  if (!shouldSelect && (activeRowIndices === null || activeRowIndices.length === totalRows)) {
    return new Set<number>();
  }

  const next = new Set<number>(currentChecked);

  if (activeRowIndices === null) {
    if (shouldSelect) {
      for (let i = 0; i < totalRows; i++) {
        next.add(i);
      }
    } else {
      for (let i = 0; i < totalRows; i++) {
        next.delete(i);
      }
    }
  } else {
    for (let i = 0; i < activeRowIndices.length; i++) {
      const idx = activeRowIndices[i];
      if (shouldSelect) {
        next.add(idx);
      } else {
        next.delete(idx);
      }
    }
  }

  return next;
}

/**
 * Kết quả tính toán trạng thái FLIP (First - Last - Invert - Play) cho từng dòng khi Sort
 */
export interface SortRowFlipState {
  deltaY: number;
  initialOpacity: number;
  zIndex: number;
}

/**
 * Tính toán độ lệch vị trí dọc (FLIP Invert deltaY) cho hiệu ứng trượt dòng khi Sort chuẩn AG Grid:
 * 1. Nếu dòng di chuyển trong vùng nhìn thấy / lân cận (<= maxDirectRows):
 *    Trượt FLIP chính xác 100% từ tọa độ dòng cũ (oldRowIndex) sang tọa độ dòng mới (newRowIndex).
 * 2. Nếu dòng bay từ vùng xa ngoài khung nhìn vào (> maxDirectRows hoặc ngoài vùng chunk cũ):
 *    Giữ đúng chiều bay thực tế và phân tầng quãng đường trượt (3.5 .. 11.2 dòng)
 *    để các dòng lướt đan xen tự nhiên như AG Grid thay vì dịch chuyển cứng thành 1 khối.
 * 3. Luôn khóa biên trên (newRowIndex + deltaRows >= 0) để dòng không bao giờ trồi lên vùng Header.
 */
export function computeSortRowFlipState(params: {
  rowKey: string;
  newRowIndex: number;
  oldRowIndex: number | undefined;
  rowHeight: number;
  viewportCenterRow: number;
  prevStartRow: number;
  maxDirectRows?: number;
}): SortRowFlipState | null {
  const {
    rowKey,
    newRowIndex,
    oldRowIndex,
    rowHeight,
    maxDirectRows = 12,
  } = params;

  if (rowHeight <= 0 || newRowIndex < 0) return null;

  if (oldRowIndex !== undefined) {
    const rawDeltaRows = oldRowIndex - newRowIndex;
    if (rawDeltaRows === 0) return null;

    if (Math.abs(rawDeltaRows) <= maxDirectRows) {
      const safeDeltaRows = Math.max(-newRowIndex, rawDeltaRows);
      const deltaY = Math.round(safeDeltaRows * rowHeight);
      if (deltaY === 0) return null;
      return {
        deltaY,
        initialOpacity: 1,
        zIndex: rawDeltaRows < 0 ? 3 : 2,
      };
    }
  }

  // Với các dòng nhảy từ xa vào khung nhìn: Phân bổ đan chéo 2 chiều (Lên / Xuống) trong phạm vi ±2..±4.5 dòng
  // giúp lấp đầy 100% mép trên bảng (slot 2 -> 0, slot 3 -> 1) và tạo hiệu ứng các dòng trượt đan qua nhau đặc trưng của AG Grid.
  const INTERLEAVE_OFFSETS = [2.5, 4.0, -2.0, -2.0, 3.5, -3.0, 3.0, -3.5];
  const baseOffset = INTERLEAVE_OFFSETS[newRowIndex % INTERLEAVE_OFFSETS.length];

  let hash = 0;
  for (let i = 0; i < rowKey.length; i++) {
    hash = (hash * 31 + rowKey.charCodeAt(i)) | 0;
  }
  const jitter = ((Math.abs(hash) % 3) - 1) * 0.25;
  const rawTravelRows = baseOffset + (baseOffset > 0 ? jitter : -jitter);
  const clampedRows = Math.max(-newRowIndex, Math.min(maxDirectRows, rawTravelRows));

  const deltaY = Math.round(clampedRows * rowHeight);
  if (deltaY === 0) return null;

  return {
    deltaY,
    initialOpacity: 1,
    zIndex: clampedRows < 0 ? 3 : 2,
  };
}

