import {
  ColumnDef,
  DATA_TYPES,
  FORMULA_MODES,
  FormulaMode,
  SORT_DIRECTIONS,
  SortConfig,
} from './types';

/**
 * Chuẩn hóa danh sách quy tắc sắp xếp (hỗ trợ đồng bộ từ `sortRules` hoặc `sortConfig` đơn lẻ).
 */
export function normalizeSortRules(
  sortRules?: SortConfig[] | null,
  sortConfig?: SortConfig | null
): SortConfig[] {
  const source = Array.isArray(sortRules)
    ? sortRules
    : sortConfig?.key
    ? [sortConfig]
    : [];

  const seen = new Set<string>();
  const normalized: SortConfig[] = [];
  for (const item of source) {
    if (!item || typeof item.key !== 'string') continue;
    const key = item.key.trim();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    normalized.push({
      key,
      direction:
        item.direction === SORT_DIRECTIONS.DESC
          ? SORT_DIRECTIONS.DESC
          : SORT_DIRECTIONS.ASC,
      ...(item.sortByMonth !== undefined ? { sortByMonth: Boolean(item.sortByMonth) } : {}),
    });
  }
  return normalized;
}

/**
 * Chuyển đổi quy tắc sắp xếp khi click hoặc Shift+Click tiêu đề cột.
 */
export function toggleColumnSortRules(
  currentRules: SortConfig[],
  colKey: string,
  options?: { multi?: boolean; enableMultiSort?: boolean }
): SortConfig[] {
  const rules = normalizeSortRules(currentRules);
  const isMulti = Boolean(options?.multi) && options?.enableMultiSort !== false;

  if (isMulti) {
    const idx = rules.findIndex((r) => r.key === colKey);
    if (idx < 0) {
      return [...rules, { key: colKey, direction: SORT_DIRECTIONS.ASC }];
    }
    if (rules[idx].direction === SORT_DIRECTIONS.ASC) {
      return rules.map((r, i) =>
        i === idx ? { ...r, direction: SORT_DIRECTIONS.DESC } : r
      );
    }
    return rules.filter((_, i) => i !== idx);
  }

  if (rules.length === 1 && rules[0].key === colKey) {
    if (rules[0].direction === SORT_DIRECTIONS.ASC) {
      return [{ key: colKey, direction: SORT_DIRECTIONS.DESC }];
    }
    return [];
  }

  if (
    rules.length > 1 &&
    rules[0].key === colKey &&
    rules[0].direction === SORT_DIRECTIONS.ASC
  ) {
    return [{ key: colKey, direction: SORT_DIRECTIONS.DESC }];
  }

  return [{ key: colKey, direction: SORT_DIRECTIONS.ASC }];
}

/**
 * Đổi vị trí một quy tắc sắp xếp từ `fromIndex` sang `toIndex`.
 */
export function reorderSortRules(
  rules: SortConfig[],
  fromIndex: number,
  toIndex: number
): SortConfig[] {
  if (
    fromIndex === toIndex ||
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= rules.length ||
    toIndex >= rules.length
  ) {
    return rules;
  }
  const next = [...rules];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next;
}

export interface SortRowIndicesMultiParams<TRecord> {
  baseIndices: number[];
  rules: SortConfig[];
  colMap: Record<string, ColumnDef<TRecord>>;
  getRowVal: (origIdx: number, colKey: string) => any;
  rows: TRecord[];
  rowKeys: (string | number)[];
  getRowKeyAt?: (origIdx: number) => string | number;
  checkedRowKeys: Set<string | number>;
  formulaMode?: FormulaMode | string;
}

/**
 * Sắp xếp chỉ số dòng đa cấp theo cơ chế Lazy Tie-Breaker:
 * chỉ tính giá trị cho tầng sau khi các tầng trước so sánh bằng nhau.
 */
export function sortRowIndicesMulti<TRecord>({
  baseIndices,
  rules,
  colMap,
  getRowVal,
  rows,
  rowKeys,
  getRowKeyAt,
  checkedRowKeys,
  formulaMode,
}: SortRowIndicesMultiParams<TRecord>): number[] {
  const normalizedRules = normalizeSortRules(rules);
  if (normalizedRules.length === 0 || baseIndices.length <= 1) {
    return baseIndices;
  }

  const collator = new Intl.Collator('vi', { sensitivity: 'base', numeric: true });

  const extractSortVal = (levelIdx: number, localIdx: number): number | string => {
    const rule = normalizedRules[levelIdx];
    const origIdx = baseIndices[localIdx];
    if (rule.key === 'col_stt') return origIdx + 1;
    if (rule.key === 'col_chk') {
      if (checkedRowKeys.size === 0) return 0;
      const rk = getRowKeyAt ? getRowKeyAt(origIdx) : rowKeys[origIdx];
      return checkedRowKeys.has(rk) ? 1 : 0;
    }

    const colDef = colMap[rule.key];

    if (
      rule.sortByMonth &&
      (formulaMode === FORMULA_MODES.MIN || formulaMode === FORMULA_MODES.MAX)
    ) {
      const rec = rows[origIdx] as any;
      const baseRec = rec?._baseRecord ?? rec;
      if (colDef?.monthIndexGetter) {
        return colDef.monthIndexGetter(baseRec, formulaMode);
      }
      let targetIdx = 0;
      let extremeVal = formulaMode === FORMULA_MODES.MIN ? Infinity : -Infinity;
      for (let m = 1; m <= 12; m++) {
        const v = Number(baseRec?.[`col_m${m}`]) || 0;
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

    const dType = colDef?.dataType || DATA_TYPES.TEXT;
    const val = getRowVal(origIdx, rule.key);

    if (dType === DATA_TYPES.NUMBER) {
      const num = Number(val);
      return Number.isFinite(num) ? num : -Infinity;
    }
    if (dType === DATA_TYPES.DATE) {
      const ms = val ? Date.parse(String(val)) : NaN;
      return Number.isFinite(ms) ? ms : -Infinity;
    }
    if (dType === DATA_TYPES.TIME) {
      const m = /^(\d{1,2}):?(\d{0,2})$/.exec(String(val ?? '').trim());
      if (!m) return -Infinity;
      const mins = parseInt(m[1], 10) * 60 + (m[2] ? parseInt(m[2], 10) : 0);
      return Number.isFinite(mins) ? mins : -Infinity;
    }

    const rec = rows[origIdx] as any;
    let resolved = val;
    if (resolved === undefined && rec) {
      resolved = rec.cells instanceof Map ? rec.cells.get(rule.key)?.value : rec[rule.key];
    }
    return String(resolved ?? '').toLowerCase();
  };

  // Tính sẵn mảng tầng ưu tiên 0 (O(N)); các tầng 1..K-1 cấp phát lười (Lazy)
  const level0Vals = baseIndices.map((_, localIdx) => extractSortVal(0, localIdx));
  const lazyCaches: Array<Array<number | string | undefined>> = normalizedRules.map(
    (_, idx) => (idx === 0 ? level0Vals : new Array(baseIndices.length))
  );

  const getCachedVal = (levelIdx: number, localIdx: number): number | string => {
    const cache = lazyCaches[levelIdx];
    let v = cache[localIdx];
    if (v === undefined) {
      v = extractSortVal(levelIdx, localIdx);
      cache[localIdx] = v;
    }
    return v;
  };

  const order = Array.from({ length: baseIndices.length }, (_, i) => i);
  order.sort((a, b) => {
    for (let level = 0; level < normalizedRules.length; level++) {
      const va = getCachedVal(level, a);
      const vb = getCachedVal(level, b);
      const isAsc = normalizedRules[level].direction === SORT_DIRECTIONS.ASC;

      let cmp = 0;
      if (typeof va === 'number' && typeof vb === 'number') {
        if (va !== vb) {
          cmp = va < vb ? -1 : 1;
        }
      } else {
        cmp = collator.compare(String(va), String(vb));
      }

      if (cmp !== 0) {
        return isAsc ? cmp : -cmp;
      }
    }
    return a - b;
  });

  return order.map((localIdx) => baseIndices[localIdx]);
}
