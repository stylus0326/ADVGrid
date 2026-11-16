import {
  ColumnDef,
  FilterOperation,
  SortConfig,
  FILTER_OPS,
  DATA_TYPES,
  FILTER_MODES,
  SORT_DIRECTIONS,
  FORMULA_MODES,
  FormulaMode,
} from './types';
import { expandAllShortcuts } from './smartNumberUtils';
import {
  formatGridNumber,
  getGridCellValue,
  isBetweenFilterOp,
  isNegativeFilterOp,
  isNoInputFilterOp,
  parseGridNumber,
  toDateKeyYMD,
} from './gridFormatUtils';

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
 * Hàm kiểm tra bộ lọc dữ liệu siêu tốc O(1) chuẩn DevExtreme cho mọi kiểu dữ liệu (text, number, date, time)
 */
export function matchFilterValue(
  cellVal: any,
  op: FilterOperation,
  query: string,
  dataType: string = DATA_TYPES.TEXT,
  filterObj?: any
): boolean {
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
        const isDateCol = dataType === DATA_TYPES.DATE;
        const cellDateKey = isDateCol ? toDateKeyYMD(cellVal) : null;
        const matched = selectedValues.some((v: any) => {
          const vStr = String(v).trim();
          if (vStr === cellValStr) return true;
          if (isDateCol && cellDateKey) {
            if (vStr === cellDateKey) return true;
            if (vStr.length !== 10) {
              const vDateKey = toDateKeyYMD(vStr);
              if (vDateKey && vDateKey === cellDateKey) return true;
            }
          }
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

  if (isMultiActive) {
    if (Array.isArray(filterObj.multiRanges) && filterObj.multiRanges.length > 0) {
      return filterObj.multiRanges.some((rng: { from?: string; to?: string }) => {
        const f = String(rng?.from ?? '').trim();
        const t = String(rng?.to ?? '').trim();
        if (!f && !t) return false;
        if (f && t) {
          return matchFilterValue(cellVal, FILTER_OPS.BETWEEN, `${f}..${t}`, dataType);
        }
        if (f) {
          return matchFilterValue(cellVal, FILTER_OPS.GREATER_EQUALS, f, dataType);
        }
        return matchFilterValue(cellVal, FILTER_OPS.LESS_EQUALS, t, dataType);
      });
    }

    if (Array.isArray(filterObj.multiValues) && filterObj.multiValues.length > 0) {
      const validVals = filterObj.multiValues
        .map((v: any) => String(v ?? '').trim())
        .filter((v: string) => v.length > 0);
      if (validVals.length === 0) return true;
      if (isNegativeFilterOp(op)) {
        return validVals.every((mv: string) => matchFilterValue(cellVal, op, mv, dataType));
      }
      return validVals.some((mv: string) => matchFilterValue(cellVal, op, mv, dataType));
    }
  }

  const q = query.trim();
  if (!q) return true;

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
