import { DATA_TYPES, FILTER_MODES, FILTER_OPS, type FilterOperation } from './types';
import { formatGridNumber, isNoInputFilterOp, parseGridNumber } from './gridFormatUtils';

const SHORTCUT_UNIT_REGEX = /\d\s*(k|m|tr|b|ty)\b/i;

/**
 * Kiểm tra bộ lọc có đòi hỏi full engine (Date/Time/Multi/Between/Numeric shortcuts) hay không.
 */
export function needsFullFilterEngine(
  op: FilterOperation,
  query: string,
  dataType: string = DATA_TYPES.TEXT,
  filterObj?: any
): boolean {
  if (filterObj?.mode === FILTER_MODES.MULTI) return true;
  if (op === FILTER_OPS.BETWEEN) return true;
  if (dataType === DATA_TYPES.DATE || dataType === DATA_TYPES.TIME) {
    return typeof query === 'string' && query.trim().length > 0 && !isNoInputFilterOp(op);
  }
  if (dataType === DATA_TYPES.NUMBER && typeof query === 'string') {
    const q = query.trim();
    if (
      q.includes('..') ||
      q.includes(' - ') ||
      q.includes('/') ||
      q.includes('~') ||
      SHORTCUT_UNIT_REGEX.test(q)
    ) {
      return true;
    }
  }
  return false;
}

/**
 * Bộ lọc đồng bộ nhẹ dùng khi cold-start (không kéo Date/Time/Shortcut regex bundle).
 */
export function matchSimpleFilterSync(
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
    } else if (selectedValues.length > 0) {
      const cellValStr = String(cellVal).trim();
      const matched = selectedValues.some((v: any) => {
        const vStr = String(v).trim();
        if (vStr === cellValStr) return true;
        if (dataType === DATA_TYPES.NUMBER) {
          return vStr.replace(/,/g, '') === cellValStr.replace(/,/g, '');
        }
        return false;
      });
      if (!matched) return false;
    } else if (!includeBlanks) {
      return false;
    }
  }

  const isNoInputOp = isNoInputFilterOp(op);
  const q = typeof query === 'string' ? query.trim() : '';
  if (!isNoInputOp && !q) return true;

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

  if (dataType === DATA_TYPES.NUMBER) {
    const numVal = parseGridNumber(cellVal);
    const numQ = parseGridNumber(q);
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
          return rawCellStr.includes(q) || formattedCellStr.includes(q);
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
