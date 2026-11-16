import { QueryGroup, QueryRule, QueryTreeNode, QUERY_COMBINATORS } from './types';
import { ColumnDef, FILTER_OPS, DATA_TYPES } from '../types';
import { isNoInputFilterOp, isBetweenFilterOp, isNegativeFilterOp } from '../gridFormatUtils';
import { isRuleActive, hasActiveQueryRules, countActiveQueryRules } from './queryRuleCheck';

export { isRuleActive, hasActiveQueryRules, countActiveQueryRules };

export function parseDateToNum(val: any): number | null {
  if (!val) return null;
  const s = String(val).trim();
  const m1 = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (m1) {
    const d = parseInt(m1[1], 10);
    const m = parseInt(m1[2], 10);
    const y = parseInt(m1[3], 10);
    return y * 10000 + m * 100 + d;
  }
  const m2 = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (m2) {
    const y = parseInt(m2[1], 10);
    const m = parseInt(m2[2], 10);
    const d = parseInt(m2[3], 10);
    return y * 10000 + m * 100 + d;
  }
  return null;
}

export function parseTimeToMinutes(val: any): number | null {
  if (!val) return null;
  const s = String(val).trim();
  const m = s.match(/^(\d{1,2}):(\d{2})/);
  if (m) {
    return parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
  }
  return null;
}

export function evaluateValueCondition(
  cellVal: any,
  operator: QueryRule['operator'],
  targetVal: any,
  dataType: string = DATA_TYPES.TEXT,
  targetValTo?: any
): boolean {
  const isNil = cellVal === null || cellVal === undefined || cellVal === '';

  if (operator === FILTER_OPS.IS_EMPTY) return isNil;
  if (operator === FILTER_OPS.IS_NOT_EMPTY) return !isNil;

  if (dataType === DATA_TYPES.NUMBER) {
    const num = Number(cellVal);
    if (isNaN(num)) return false;

    if (operator === FILTER_OPS.IS_POSITIVE) return num > 0;
    if (operator === FILTER_OPS.IS_NEGATIVE) return num < 0;

    const tNum = Number(targetVal);
    if (isNaN(tNum) && !isBetweenFilterOp(operator)) return true;

    if (operator === FILTER_OPS.EQUALS) return num === tNum;
    if (operator === FILTER_OPS.NOT_EQUALS) return num !== tNum;
    if (operator === FILTER_OPS.GREATER_THAN) return num > tNum;
    if (operator === FILTER_OPS.GREATER_EQUALS) return num >= tNum;
    if (operator === FILTER_OPS.LESS_THAN) return num < tNum;
    if (operator === FILTER_OPS.LESS_EQUALS) return num <= tNum;
    if (isBetweenFilterOp(operator)) {
      const tTo = Number(targetValTo);
      if (isNaN(tTo)) return num >= tNum;
      return num >= Math.min(tNum, tTo) && num <= Math.max(tNum, tTo);
    }
  }

  if (dataType === DATA_TYPES.DATE) {
    const dCell = parseDateToNum(cellVal);
    if (dCell === null) return false;
    const dTarget = parseDateToNum(targetVal);

    if (operator === FILTER_OPS.EQUALS) return dTarget !== null && dCell === dTarget;
    if (operator === FILTER_OPS.NOT_EQUALS) return dTarget !== null && dCell !== dTarget;
    if (operator === FILTER_OPS.GREATER_THAN) return dTarget !== null && dCell > dTarget;
    if (operator === FILTER_OPS.GREATER_EQUALS) return dTarget !== null && dCell >= dTarget;
    if (operator === FILTER_OPS.LESS_THAN) return dTarget !== null && dCell < dTarget;
    if (operator === FILTER_OPS.LESS_EQUALS) return dTarget !== null && dCell <= dTarget;
    if (isBetweenFilterOp(operator)) {
      const dTargetTo = parseDateToNum(targetValTo);
      if (dTarget === null && dTargetTo === null) return true;
      if (dTarget !== null && dTargetTo === null) return dCell >= dTarget;
      if (dTarget === null && dTargetTo !== null) return dCell <= dTargetTo;
      return dCell >= Math.min(dTarget!, dTargetTo!) && dCell <= Math.max(dTarget!, dTargetTo!);
    }
  }

  if (dataType === DATA_TYPES.TIME) {
    const tCell = parseTimeToMinutes(cellVal);
    if (tCell === null) return false;
    const tTarget = parseTimeToMinutes(targetVal);

    if (operator === FILTER_OPS.EQUALS) return tTarget !== null && tCell === tTarget;
    if (operator === FILTER_OPS.NOT_EQUALS) return tTarget !== null && tCell !== tTarget;
    if (operator === FILTER_OPS.GREATER_THAN) return tTarget !== null && tCell > tTarget;
    if (operator === FILTER_OPS.GREATER_EQUALS) return tTarget !== null && tCell >= tTarget;
    if (operator === FILTER_OPS.LESS_THAN) return tTarget !== null && tCell < tTarget;
    if (operator === FILTER_OPS.LESS_EQUALS) return tTarget !== null && tCell <= tTarget;
    if (isBetweenFilterOp(operator)) {
      const tTargetTo = parseTimeToMinutes(targetValTo);
      if (tTarget === null && tTargetTo === null) return true;
      if (tTarget !== null && tTargetTo === null) return tCell >= tTarget;
      if (tTarget === null && tTargetTo !== null) return tCell <= tTargetTo;
      return tCell >= Math.min(tTarget!, tTargetTo!) && tCell <= Math.max(tTarget!, tTargetTo!);
    }
    if (operator === FILTER_OPS.CONTAINS) {
      return String(cellVal).includes(String(targetVal));
    }
  }

  const strVal = String(cellVal ?? '').toLowerCase();
  const strTarget = String(targetVal ?? '').toLowerCase();

  switch (operator) {
    case FILTER_OPS.CONTAINS:
      return strVal.includes(strTarget);
    case FILTER_OPS.NOT_CONTAINS:
      return !strVal.includes(strTarget);
    case FILTER_OPS.STARTS_WITH:
      return strVal.startsWith(strTarget);
    case FILTER_OPS.ENDS_WITH:
      return strVal.endsWith(strTarget);
    case FILTER_OPS.EQUALS:
      return strVal === strTarget;
    case FILTER_OPS.NOT_EQUALS:
      return strVal !== strTarget;
    case FILTER_OPS.GREATER_THAN:
      return strVal > strTarget;
    case FILTER_OPS.GREATER_EQUALS:
      return strVal >= strTarget;
    case FILTER_OPS.LESS_THAN:
      return strVal < strTarget;
    case FILTER_OPS.LESS_EQUALS:
      return strVal <= strTarget;
    case FILTER_OPS.BETWEEN: {
      const strTo = String(targetValTo ?? '').toLowerCase();
      return strVal >= strTarget && strVal <= strTo;
    }
    default:
      return strVal.includes(strTarget);
  }
}

export function evaluateQueryTreeNode(
  node: QueryTreeNode | null,
  rowItem: any,
  rowIndex: number,
  getCellValue?: (rowIndex: number, colKey: string) => any,
  columnDataTypes: Record<string, string> = {}
): boolean {
  if (!node) return true;

  if ('combinator' in node) {
    if (!Array.isArray(node.rules) || node.rules.length === 0) return true;
    const activeChildren = node.rules.filter((child) => hasActiveQueryRules(child));
    if (activeChildren.length === 0) return true;

    if (node.combinator === QUERY_COMBINATORS.AND) {
      return activeChildren.every((child) =>
        evaluateQueryTreeNode(child, rowItem, rowIndex, getCellValue, columnDataTypes)
      );
    } else {
      return activeChildren.some((child) =>
        evaluateQueryTreeNode(child, rowItem, rowIndex, getCellValue, columnDataTypes)
      );
    }
  }

  if (!isRuleActive(node)) return true;

  const { field, operator, value, valueTo } = node;
  let cellVal: any;
  if (getCellValue) {
    cellVal = getCellValue(rowIndex, field);
  } else if (rowItem && typeof rowItem === 'object') {
    cellVal = rowItem.cells?.get ? rowItem.cells.get(field)?.value : rowItem[field];
  }

  const dType = columnDataTypes[field] || DATA_TYPES.TEXT;

  // Lọc nhiều giá trị (multiValues từ AdvMultiFilterPopup)
  if (Array.isArray(node.multiValues) && node.multiValues.length > 0) {
    const isNegative = isNegativeFilterOp(operator);
    if (isNegative) {
      return node.multiValues.every((mv) => evaluateValueCondition(cellVal, operator, mv, dType));
    } else {
      return node.multiValues.some((mv) => evaluateValueCondition(cellVal, operator, mv, dType));
    }
  }

  // Lọc nhiều khoảng số/ngày (multiRanges từ AdvMultiFilterPopup)
  if (Array.isArray(node.multiRanges) && node.multiRanges.length > 0) {
    return node.multiRanges.some((rng) => evaluateValueCondition(cellVal, FILTER_OPS.BETWEEN, rng.from, dType, rng.to));
  }

  return evaluateValueCondition(cellVal, operator, value, dType, valueTo);
}

export const QUERY_OP_DISPLAY_MAP: Record<string, string> = {
  [FILTER_OPS.CONTAINS]: 'Có chứa',
  [FILTER_OPS.NOT_CONTAINS]: 'Không chứa',
  [FILTER_OPS.STARTS_WITH]: 'Bắt đầu với',
  [FILTER_OPS.ENDS_WITH]: 'Kết thúc với',
  [FILTER_OPS.EQUALS]: '=',
  [FILTER_OPS.NOT_EQUALS]: '≠',
  [FILTER_OPS.GREATER_THAN]: '>',
  [FILTER_OPS.GREATER_EQUALS]: '≥',
  [FILTER_OPS.LESS_THAN]: '<',
  [FILTER_OPS.LESS_EQUALS]: '≤',
  [FILTER_OPS.BETWEEN]: 'nằm giữa',
  [FILTER_OPS.IS_POSITIVE]: 'dương (> 0)',
  [FILTER_OPS.IS_NEGATIVE]: 'âm (< 0)',
  [FILTER_OPS.IS_EMPTY]: 'trống',
  [FILTER_OPS.IS_NOT_EMPTY]: 'không trống',
};

export function formatQueryRuleSummary(rule: QueryRule, columns: ColumnDef<any>[]): string {
  const col = columns.find((c) => c.key === rule.field);
  const colName = col?.title || rule.field;
  const opLabel =
    rule.operator === FILTER_OPS.BETWEEN
      ? 'từ'
      : QUERY_OP_DISPLAY_MAP[rule.operator] || rule.operator;
  if (Array.isArray(rule.multiValues) && rule.multiValues.length > 0) {
    const count = rule.multiValues.length;
    const preview = rule.multiValues
      .slice(0, 2)
      .map((v) => `"${v}"`)
      .join(', ');
    const more = count > 2 ? ` +${count - 2}` : '';
    return `[${colName}] ${opLabel} (${preview}${more})`;
  }
  if (Array.isArray(rule.multiRanges) && rule.multiRanges.length > 0) {
    return `[${colName}] (${rule.multiRanges.length} khoảng)`;
  }
  if (isBetweenFilterOp(rule.operator)) {
    const fromVal = rule.value !== undefined && rule.value !== '' ? `"${rule.value}"` : '...';
    const toVal = rule.valueTo !== undefined && rule.valueTo !== '' ? `"${rule.valueTo}"` : '...';
    return `[${colName}] từ ${fromVal} đến ${toVal}`;
  }
  if (isNoInputFilterOp(rule.operator)) {
    return `[${colName}] là ${opLabel}`;
  }
  const hasVal = rule.value !== undefined && rule.value !== null && String(rule.value).trim() !== '';
  return `[${colName}] ${opLabel} ${hasVal ? `"${rule.value}"` : '...'}`;
}

export function generateNaturalLanguage(
  node: QueryTreeNode | null,
  columns: ColumnDef<any>[]
): string {
  if (!node) return '';
  const colMap = new Map(columns.map((c) => [c.key, c.title || c.key]));

  if ('combinator' in node) {
    const parts = (node.rules || [])
      .map((child) => generateNaturalLanguage(child, columns))
      .filter(Boolean);
    if (parts.length === 0) return '';
    const glue = node.combinator === QUERY_COMBINATORS.AND ? ' VÀ ' : ' HOẶC ';
    return parts.length === 1 ? parts[0] : `(${parts.join(glue)})`;
  }

  if (!isRuleActive(node)) return '';
  const colName = colMap.get(node.field) || node.field;
  const opLabel = QUERY_OP_DISPLAY_MAP[node.operator] || node.operator;
  if (Array.isArray(node.multiValues) && node.multiValues.length > 0) {
    const listStr = node.multiValues.map((v) => `"${v}"`).join(', ');
    return `[${colName}] ${opLabel} (${listStr})`;
  }
  if (Array.isArray(node.multiRanges) && node.multiRanges.length > 0) {
    const rangesStr = node.multiRanges.map((r) => `từ "${r.from}" đến "${r.to}"`).join(', ');
    return `[${colName}] trong các khoảng (${rangesStr})`;
  }
  if (isBetweenFilterOp(node.operator)) {
    return `[${colName}] từ "${node.value}" đến "${node.valueTo}"`;
  }
  if (isNoInputFilterOp(node.operator)) {
    return `[${colName}] là ${opLabel}`;
  }
  return `[${colName}] ${opLabel} "${node.value}"`;
}

/**
 * Kiểm tra tính hợp lệ của cây điều kiện so với danh sách cột hiện tại
 */
export function validateQueryTreeAgainstColumns(
  node: QueryTreeNode | null,
  columns: ColumnDef<any>[]
): { isValid: boolean; error?: string } {
  if (!node) return { isValid: true };
  const colKeys = new Set(columns.map((c) => c.key));
  const colTitleMap = new Map(columns.map((c) => [c.key, c.title || c.key]));

  if ('combinator' in node) {
    if (!Array.isArray(node.rules) || node.rules.length === 0) return { isValid: true };
    for (const child of node.rules) {
      const res = validateQueryTreeAgainstColumns(child, columns);
      if (!res.isValid) return res;
    }
    return { isValid: true };
  }

  if (node.field && !colKeys.has(node.field)) {
    const displayCol = colTitleMap.get(node.field) || node.field;
    return {
      isValid: false,
      error: `Cột [${displayCol}] không tồn tại trên bảng dữ liệu hiện tại.`,
    };
  }
  return { isValid: true };
}

/**
 * Phân tích cú pháp chuỗi lệnh CMD thành Cây điều kiện (QueryGroup),
 * tự động kiểm tra tính hợp lệ (cột, toán tử, ngoặc).
 */
export function parseCmdToQueryTree(
  cmdText: string,
  columns: ColumnDef<any>[]
): { isValid: boolean; tree?: QueryGroup; error?: string } {
  if (!cmdText || typeof cmdText !== 'string' || !cmdText.trim()) {
    return { isValid: false, error: 'Chuỗi lệnh CMD không được để trống.' };
  }

  const trimmed = cmdText.trim().replace(/^>\s*/, '');
  const colMap = new Map<string, string>();
  for (const c of columns) {
    if (c.title) colMap.set(c.title.toLowerCase().trim(), c.key);
    if (c.key) colMap.set(c.key.toLowerCase().trim(), c.key);
  }

  let idx = 0;
  const len = trimmed.length;

  function peekChar() {
    return idx < len ? trimmed[idx] : null;
  }

  function skipWhitespace() {
    while (idx < len && /\s/.test(trimmed[idx])) {
      idx++;
    }
  }

  // Kiểm tra cân xứng dấu ngoặc đơn
  let parenDepth = 0;
  for (let i = 0; i < len; i++) {
    const ch = trimmed[i];
    if (ch === '(') parenDepth++;
    else if (ch === ')') {
      parenDepth--;
      if (parenDepth < 0) {
        return { isValid: false, error: 'Dấu ngoặc đơn thừa dấu ngoặc đóng ")".' };
      }
    }
  }
  if (parenDepth > 0) {
    return { isValid: false, error: 'Dấu ngoặc đơn thiếu dấu ngoặc đóng ")".' };
  }

  function parseExpression(): QueryTreeNode | null {
    return parseOrTerm();
  }

  function parseOrTerm(): QueryTreeNode | null {
    const rules: QueryTreeNode[] = [];
    const first = parseAndTerm();
    if (!first) return null;
    rules.push(first);

    while (true) {
      skipWhitespace();
      const saveIdx = idx;
      if (matchWord('hoặc') || matchWord('or') || matchSymbol('||')) {
        const next = parseAndTerm();
        if (!next) {
          throw new Error('Thiếu điều kiện sau từ nối HOẶC.');
        }
        rules.push(next);
      } else {
        idx = saveIdx;
        break;
      }
    }

    if (rules.length === 1) return rules[0];
    return {
      combinator: QUERY_COMBINATORS.OR,
      rules,
    };
  }

  function parseAndTerm(): QueryTreeNode | null {
    const rules: QueryTreeNode[] = [];
    const first = parseFactor();
    if (!first) return null;
    rules.push(first);

    while (true) {
      skipWhitespace();
      const saveIdx = idx;
      if (matchWord('và') || matchWord('and') || matchSymbol('&&')) {
        const next = parseFactor();
        if (!next) {
          throw new Error('Thiếu điều kiện sau từ nối VÀ.');
        }
        rules.push(next);
      } else {
        idx = saveIdx;
        break;
      }
    }

    if (rules.length === 1) return rules[0];
    return {
      combinator: QUERY_COMBINATORS.AND,
      rules,
    };
  }

  function parseFactor(): QueryTreeNode | null {
    skipWhitespace();
    if (peekChar() === '(') {
      idx++; // bỏ '('
      const expr = parseExpression();
      skipWhitespace();
      if (peekChar() !== ')') {
        throw new Error('Thiếu dấu ngoặc đóng ")".');
      }
      idx++; // bỏ ')'
      if (!expr) throw new Error('Biểu thức trong dấu ngoặc rỗng.');
      if ('combinator' in expr) return expr;
      return {
        combinator: QUERY_COMBINATORS.AND,
        rules: [expr],
      };
    }
    return parseRule();
  }

  function matchWord(word: string): boolean {
    skipWhitespace();
    const wLen = word.length;
    if (idx + wLen <= len) {
      const sub = trimmed.substring(idx, idx + wLen);
      if (sub.toLowerCase() === word.toLowerCase()) {
        const after = idx + wLen < len ? trimmed[idx + wLen] : ' ';
        if (/[\s()\[\]]/.test(after) || after === ' ') {
          idx += wLen;
          return true;
        }
      }
    }
    return false;
  }

  function matchSymbol(sym: string): boolean {
    skipWhitespace();
    const sLen = sym.length;
    if (idx + sLen <= len && trimmed.substring(idx, idx + sLen) === sym) {
      idx += sLen;
      return true;
    }
    return false;
  }

  function parseRule(): QueryRule {
    skipWhitespace();
    if (peekChar() !== '[') {
      const remaining = trimmed.substring(idx, Math.min(len, idx + 20));
      throw new Error(`Kỳ vọng mở ngoặc vuông [Tên Cột], nhưng gặp: "${remaining}"`);
    }
    idx++; // bỏ '['
    const colStart = idx;
    while (idx < len && trimmed[idx] !== ']') {
      idx++;
    }
    if (idx >= len) {
      throw new Error('Thiếu dấu đóng ngoặc vuông "]" cho tên cột.');
    }
    const rawColName = trimmed.substring(colStart, idx).trim();
    idx++; // bỏ ']'

    // Kiểm tra tên cột
    const matchedColKey = colMap.get(rawColName.toLowerCase());
    if (!matchedColKey) {
      throw new Error(`Cột [${rawColName}] không tồn tại trên bảng dữ liệu hiện tại.`);
    }

    skipWhitespace();

    // Các toán tử đặc biệt
    if (matchWord('là trống') || matchWord('trống') || matchWord(FILTER_OPS.IS_EMPTY) || matchWord('is empty')) {
      return { field: matchedColKey, operator: FILTER_OPS.IS_EMPTY, value: '' };
    }
    if (matchWord('là không trống') || matchWord('không trống') || matchWord(FILTER_OPS.IS_NOT_EMPTY) || matchWord('is not empty')) {
      return { field: matchedColKey, operator: FILTER_OPS.IS_NOT_EMPTY, value: '' };
    }
    if (matchWord('là dương') || matchWord('dương') || matchWord('dương (> 0)') || matchWord(FILTER_OPS.IS_POSITIVE)) {
      return { field: matchedColKey, operator: FILTER_OPS.IS_POSITIVE, value: '' };
    }
    if (matchWord('là âm') || matchWord('âm') || matchWord('âm (< 0)') || matchWord(FILTER_OPS.IS_NEGATIVE)) {
      return { field: matchedColKey, operator: FILTER_OPS.IS_NEGATIVE, value: '' };
    }

    // Between
    if (matchWord('từ') || matchWord('nằm giữa') || matchWord(FILTER_OPS.BETWEEN)) {
      const val1 = parseValue();
      if (!matchWord('đến') && !matchWord('và') && !matchWord(QUERY_COMBINATORS.AND)) {
        throw new Error(`Toán tử "từ" cần có chữ "đến" (Ví dụ: [${rawColName}] từ "10" đến "20").`);
      }
      const val2 = parseValue();
      return {
        field: matchedColKey,
        operator: FILTER_OPS.BETWEEN,
        value: val1,
        valueTo: val2,
      };
    }

    // Các toán tử so sánh
    let op: QueryRule['operator'] | null = null;
    if (matchSymbol('>=') || matchSymbol('≥') || matchWord('lớn hơn hoặc bằng')) op = FILTER_OPS.GREATER_EQUALS;
    else if (matchSymbol('<=') || matchSymbol('≤') || matchWord('nhỏ hơn hoặc bằng')) op = FILTER_OPS.LESS_EQUALS;
    else if (matchSymbol('!=') || matchSymbol('≠') || matchSymbol('<>') || matchWord('khác') || matchWord(FILTER_OPS.NOT_EQUALS)) op = FILTER_OPS.NOT_EQUALS;
    else if (matchSymbol('==') || matchSymbol('=') || matchWord('bằng') || matchWord(FILTER_OPS.EQUALS)) op = FILTER_OPS.EQUALS;
    else if (matchSymbol('>') || matchWord('lớn hơn') || matchWord(FILTER_OPS.GREATER_THAN)) op = FILTER_OPS.GREATER_THAN;
    else if (matchSymbol('<') || matchWord('nhỏ hơn') || matchWord(FILTER_OPS.LESS_THAN)) op = FILTER_OPS.LESS_THAN;
    else if (matchWord('không chứa') || matchWord(FILTER_OPS.NOT_CONTAINS)) op = FILTER_OPS.NOT_CONTAINS;
    else if (matchWord('có chứa') || matchWord('chứa') || matchWord(FILTER_OPS.CONTAINS)) op = FILTER_OPS.CONTAINS;
    else if (matchWord('bắt đầu với') || matchWord('bắt đầu bằng') || matchWord(FILTER_OPS.STARTS_WITH)) op = FILTER_OPS.STARTS_WITH;
    else if (matchWord('kết thúc với') || matchWord('kết thúc bằng') || matchWord(FILTER_OPS.ENDS_WITH)) op = FILTER_OPS.ENDS_WITH;

    if (!op) {
      const remaining = trimmed.substring(idx, Math.min(len, idx + 20));
      throw new Error(`Toán tử không hợp lệ sau cột [${rawColName}]: "${remaining}"`);
    }

    // Kiểm tra xem giá trị có phải là danh sách nhiều giá trị: ("A1", "A2", ...)
    skipWhitespace();
    if (peekChar() === '(') {
      idx++; // bỏ '('
      const mValues: string[] = [];
      while (idx < len && peekChar() !== ')') {
        mValues.push(parseValue());
        skipWhitespace();
        if (peekChar() === ',') {
          idx++;
          skipWhitespace();
        }
      }
      if (peekChar() === ')') idx++;
      return {
        field: matchedColKey,
        operator: op,
        value: mValues[0] || '',
        multiValues: mValues,
      };
    }

    const val = parseValue();
    return {
      field: matchedColKey,
      operator: op,
      value: val,
    };
  }

  function parseValue(): string {
    skipWhitespace();
    if (idx >= len) {
      throw new Error('Thiếu giá trị so sánh.');
    }
    const quote = peekChar();
    if (quote === '"' || quote === "'") {
      idx++;
      const start = idx;
      while (idx < len && trimmed[idx] !== quote) {
        idx++;
      }
      if (idx >= len) {
        throw new Error(`Thiếu dấu đóng ngoặc kép ${quote} cho giá trị.`);
      }
      const val = trimmed.substring(start, idx);
      idx++;
      return val;
    }

    const start = idx;
    while (idx < len && !/[\s()\[\]]/.test(trimmed[idx])) {
      idx++;
    }
    const val = trimmed.substring(start, idx);
    if (!val) {
      throw new Error('Thiếu giá trị so sánh.');
    }
    return val;
  }

  try {
    const parsed = parseExpression();
    if (!parsed) {
      return { isValid: false, error: 'Không thể phân tích câu lệnh.' };
    }
    skipWhitespace();
    if (idx < len) {
      const remaining = trimmed.substring(idx, Math.min(len, idx + 20));
      return { isValid: false, error: `Cú pháp dư thừa không nhận diện được: "${remaining}"` };
    }

    let rootGroup: QueryGroup;
    if ('combinator' in parsed) {
      rootGroup = parsed;
    } else {
      rootGroup = {
        combinator: QUERY_COMBINATORS.AND,
        rules: [parsed],
      };
    }
    return { isValid: true, tree: rootGroup };
  } catch (err: any) {
    return { isValid: false, error: err.message || 'Lỗi cú pháp câu lệnh.' };
  }
}
