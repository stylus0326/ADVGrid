import {
  ALIGNMENTS,
  ColumnAlign,
  ColumnDef,
  DATA_TYPES,
  FILTER_OPS,
  FilterOperation,
} from './types';

const REGEX_YMD_DATE = /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/;
const REGEX_DMY_OPT_YEAR = /^(\d{1,2})[/-](\d{1,2})(?:[/-](\d{4}))?/;
const REGEX_TIME_HM = /(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?/;

function pad2Date(n: number | string): string {
  const s = String(n);
  return s.length < 2 ? `0${s}` : s;
}

export interface ParsedDateYMD {
  year: number;
  month: number;
  day: number;
  key: string;
}

/**
 * Tách ngày dương lịch chuẩn { year, month, day, key: 'YYYY-MM-DD' } từ chuỗi ISO, DD/MM/YYYY hoặc Date object.
 * Dùng chung cho Checklist Date Tree, Criteria Summary và bộ lọc Checklist.
 */
export function parseDatePartsYMD(val: unknown): ParsedDateYMD | null {
  if (val === null || val === undefined || val === '') return null;
  if (val instanceof Date) {
    if (Number.isNaN(val.getTime())) return null;
    const year = val.getFullYear();
    const month = val.getMonth() + 1;
    const day = val.getDate();
    return {
      year,
      month,
      day,
      key: `${year}-${pad2Date(month)}-${pad2Date(day)}`,
    };
  }

  const s = String(val).trim();
  if (!s) return null;

  let year = 0;
  let month = 0;
  let day = 0;

  const ymd = REGEX_YMD_DATE.exec(s);
  if (ymd) {
    year = parseInt(ymd[1], 10);
    month = parseInt(ymd[2], 10);
    day = parseInt(ymd[3], 10);
  } else {
    const dmy = REGEX_DMY_OPT_YEAR.exec(s);
    if (!dmy || !dmy[3]) return null;
    day = parseInt(dmy[1], 10);
    month = parseInt(dmy[2], 10);
    year = parseInt(dmy[3], 10);
  }

  if (year < 1 || month < 1 || month > 12 || day < 1 || day > 31) {
    return null;
  }

  return {
    year,
    month,
    day,
    key: `${year}-${pad2Date(month)}-${pad2Date(day)}`,
  };
}

export function toDateKeyYMD(val: unknown): string | null {
  return parseDatePartsYMD(val)?.key ?? null;
}

export function formatDisplayDate(
  str: unknown,
  omitYear: boolean = false,
  includeTime: boolean = false
): string {
  if (!str) return '';
  if (str instanceof Date) {
    if (Number.isNaN(str.getTime())) return '';
    const dd = pad2Date(str.getDate());
    const mm = pad2Date(str.getMonth() + 1);
    const timeStr = includeTime
      ? ` ${pad2Date(str.getHours())}:${pad2Date(str.getMinutes())}`
      : '';
    return omitYear ? `${dd}/${mm}${timeStr}` : `${dd}/${mm}/${str.getFullYear()}${timeStr}`;
  }
  const s = String(str).trim();
  if (!s) return '';

  const timeMatch = REGEX_TIME_HM.exec(s);
  const timeSuffix =
    includeTime && timeMatch
      ? ` ${pad2Date(timeMatch[1])}:${pad2Date(timeMatch[2])}`
      : '';

  const ymd = REGEX_YMD_DATE.exec(s);
  if (ymd) {
    const dd = pad2Date(ymd[3]);
    const mm = pad2Date(ymd[2]);
    return omitYear ? `${dd}/${mm}${timeSuffix}` : `${dd}/${mm}/${ymd[1]}${timeSuffix}`;
  }

  const dmy = REGEX_DMY_OPT_YEAR.exec(s);
  if (dmy) {
    const dd = pad2Date(dmy[1]);
    const mm = pad2Date(dmy[2]);
    if (omitYear || !dmy[3]) return `${dd}/${mm}${timeSuffix}`;
    return `${dd}/${mm}/${dmy[3]}${timeSuffix}`;
  }

  return s;
}

/**
 * Định dạng ngày/tháng/năm chuẩn bảng dữ liệu (DD/MM/YYYY)
 * Đồng bộ 100% hiển thị giữa dữ liệu gốc và giá trị chọn từ date controls
 */
export function formatGridDateValue(
  val: unknown,
  includeTime: boolean = false
): string {
  if (val === null || val === undefined) return '';
  const s = String(val).trim();
  if (!s) return '';

  if (s.includes(' - ')) {
    const parts = s.split(' - ');
    const from = formatDisplayDate(parts[0], false, includeTime);
    const to = formatDisplayDate(parts[1], false, includeTime);
    return from && to ? `${from} - ${to}` : from || to || s;
  }
  if (s.includes('..')) {
    const parts = s.split('..');
    const from = formatDisplayDate(parts[0], false, includeTime);
    const to = formatDisplayDate(parts[1], false, includeTime);
    return from && to ? `${from} - ${to}` : from || to || s;
  }

  return formatDisplayDate(s, false, includeTime);
}

/**
 * Tự động tính toán độ rộng tối ưu cho cột STT dựa trên số chữ số của tổng số dòng
 */
export function getSttColWidth(totalRows: number, title = ''): number {
  const digits = Math.max(2, String(Math.max(1, totalRows || 0)).length);
  const textW = digits * 7.2;
  const titleW = title ? title.length * 7.5 : 0;
  return Math.max(36, Math.ceil(Math.max(textW, titleW) + 10));
}

/**
 * Chuyển đổi an toàn chuỗi nhập liệu hoặc giá trị bất kỳ thành số thực (number):
 * - Hỗ trợ số âm đặt trong ngoặc đơn: (1.000) -> -1000
 * - Hỗ trợ chuẩn phân cách hàng nghìn Việt Nam: 1.000 -> 1000, 45,86 -> 45.86
 * - Hỗ trợ chuẩn quốc tế: 1,234.56 -> 1234.56
 */
export function parseGridNumber(val: any): number {
  if (val === null || val === undefined || val === '') return NaN;
  if (typeof val === 'number') return val;
  let s = String(val).trim();
  if (!s) return NaN;

  let isNegative = false;
  if (/^\s*\((.*)\)\s*$/.test(s)) {
    isNegative = true;
    s = s.replace(/^\s*\((.*)\)\s*$/, '$1').trim();
  } else if (/^\s*-\s*(.*)$/.test(s)) {
    isNegative = true;
    s = s.replace(/^\s*-\s*/, '').trim();
  }

  s = s.replace(/[^0-9.,]/g, '');
  if (!s) return NaN;

  let result = NaN;
  const lastDot = s.lastIndexOf('.');
  const lastComma = s.lastIndexOf(',');

  if (lastDot !== -1 && lastComma !== -1) {
    if (lastDot < lastComma) {
      result = parseFloat(s.replace(/\./g, '').replace(',', '.'));
    } else {
      result = parseFloat(s.replace(/,/g, ''));
    }
  } else if (lastDot !== -1) {
    if (s.indexOf('.') !== lastDot) {
      result = parseFloat(s.replace(/\./g, ''));
    } else {
      const afterDot = s.slice(lastDot + 1);
      if (afterDot.length === 3) {
        result = parseFloat(s.replace(/\./g, ''));
      } else {
        result = parseFloat(s);
      }
    }
  } else if (lastComma !== -1) {
    if (s.indexOf(',') !== lastComma) {
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
 * Định dạng số đồng nhất toàn hệ thống theo chuẩn tài chính/kế toán (#,###.##)
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

export const ALIGN_TEXT_CLASSES: Record<ColumnAlign, string> = {
  [ALIGNMENTS.LEFT]: 'text-left',
  [ALIGNMENTS.CENTER]: 'text-center',
  [ALIGNMENTS.RIGHT]: 'text-right',
};

export function getAlignTextClass(align?: ColumnAlign): string {
  return (align && ALIGN_TEXT_CLASSES[align]) || ALIGN_TEXT_CLASSES[ALIGNMENTS.LEFT];
}

export const ALIGN_JUSTIFY_CLASSES: Record<ColumnAlign, string> = {
  [ALIGNMENTS.LEFT]: 'justify-start',
  [ALIGNMENTS.CENTER]: 'justify-center',
  [ALIGNMENTS.RIGHT]: 'justify-end',
};

export function getAlignJustifyClass(align?: ColumnAlign): string {
  return (align && ALIGN_JUSTIFY_CLASSES[align]) || ALIGN_JUSTIFY_CLASSES[ALIGNMENTS.LEFT];
}

export function isNoInputFilterOp(op?: string | null): boolean {
  if (!op) return false;
  return (
    op === FILTER_OPS.IS_EMPTY ||
    op === FILTER_OPS.IS_NOT_EMPTY ||
    op === FILTER_OPS.IS_POSITIVE ||
    op === FILTER_OPS.IS_NEGATIVE
  );
}

export function isBetweenFilterOp(op?: string | null): boolean {
  return op === FILTER_OPS.BETWEEN;
}

export function isNegativeFilterOp(op?: string | null): boolean {
  return op === FILTER_OPS.NOT_EQUALS || op === FILTER_OPS.NOT_CONTAINS;
}

export function isSelectionColumn<T = any>(col?: ColumnDef<T> | Partial<ColumnDef<T>> | null): boolean {
  if (!col) return false;
  return Boolean(col.isSelection) || col.key === 'col_chk';
}

export const DEFAULT_OP_BY_TYPE: Record<string, FilterOperation> = {
  text: FILTER_OPS.CONTAINS,
  number: FILTER_OPS.CONTAINS,
  date: FILTER_OPS.BETWEEN,
  time: FILTER_OPS.BETWEEN,
};

export function getColumnFilterType(
  colKey: string,
  columns?: Array<{ key: string; dataType?: string; isCurrency?: boolean }>
): typeof DATA_TYPES.TEXT | typeof DATA_TYPES.NUMBER | typeof DATA_TYPES.DATE | typeof DATA_TYPES.TIME {
  const col = columns?.find((c) => c.key === colKey);
  if (col?.isCurrency) return DATA_TYPES.NUMBER;
  if (col?.dataType === DATA_TYPES.DATE || col?.dataType === DATA_TYPES.TIME || col?.dataType === DATA_TYPES.NUMBER) {
    return col.dataType;
  }
  return DATA_TYPES.TEXT;
}

export function getDefaultFilterOpForColumn(
  colKey: string,
  columns?: Array<{ key: string; dataType?: string }>
): FilterOperation {
  const colType = getColumnFilterType(colKey, columns);
  return DEFAULT_OP_BY_TYPE[colType] || FILTER_OPS.CONTAINS;
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
 * Khởi tạo cấu hình bộ lọc cột chuẩn (ColumnFilterValue) với toán tử chỉ định (mặc định '=')
 */
export function createColumnFilter(
  val: any,
  op: FilterOperation = FILTER_OPS.EQUALS
) {
  return {
    op,
    val: val === null || val === undefined ? '' : String(val),
  };
}

export function createEqualsFilter(val: any) {
  return createColumnFilter(val, FILTER_OPS.EQUALS);
}

export function createContainsFilter(val: any) {
  return createColumnFilter(val, FILTER_OPS.CONTAINS);
}

export function createBetweenFilter(from: any, to: any) {
  return {
    op: FILTER_OPS.BETWEEN,
    val: `${from ?? ''}..${to ?? ''}`,
  };
}
