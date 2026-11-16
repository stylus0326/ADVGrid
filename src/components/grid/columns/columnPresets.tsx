import React from 'react';
import { formatGridDateValue } from '../gridFormatUtils';

const LazyTwelveMonthChartCell = React.lazy(() =>
  import('../TwelveMonthChartCell').then((m) => ({ default: m.TwelveMonthChartCell }))
);
import {
  ALIGNMENTS,
  DATA_TYPES,
  FORMULA_MODES,
  SURFACE_THEMES,
  type CellRenderParams,
  type ColumnDef,
  type FormulaMode,
  type SurfaceTheme,
} from '../types';
import type {
  AccessorColumnDef,
  ColumnDefCommon,
  DefaultColDef,
} from './columnTypes';

const VI_NUMBER_FORMATTER = new Intl.NumberFormat('vi-VN');

export type CodeNamePattern = 'code-dash-name' | 'name-paren-code';

export interface FormatCodeNameOptions {
  pattern?: CodeNamePattern;
  separator?: string;
  fallback?: string;
}

/**
 * Ghép cặp Mã & Tên an toàn, tự khử trùng không phân biệt hoa/thường (vd: `admin` + `admin` -> `admin`).
 */
export function formatCodeName(
  code: unknown,
  name: unknown,
  options?: FormatCodeNameOptions
): string {
  const c = code !== null && code !== undefined ? String(code).trim() : '';
  const n = name !== null && name !== undefined ? String(name).trim() : '';
  if (c && n) {
    if (c.toLowerCase() === n.toLowerCase()) {
      return n;
    }
    if (options?.pattern === 'name-paren-code') {
      return `${n} (${c})`;
    }
    return `${c}${options?.separator ?? ' — '}${n}`;
  }
  return n || c || (options?.fallback ?? '');
}

/**
 * Định dạng tiền tệ chuẩn vi-VN (mặc định thêm hậu tố ` đ`), trả về `—` khi rỗng hoặc không hợp lệ.
 */
export function formatGridCurrency(amount: unknown, suffix = ' đ'): string {
  if (amount === undefined || amount === null || amount === '') return '—';
  const num = Number(amount);
  if (!Number.isFinite(num)) return '—';
  return `${VI_NUMBER_FORMATTER.format(num)}${suffix}`;
}

/**
 * Cấu hình cột mặc định chuẩn hệ thống:
 * - Tự hiển thị `—` mờ khi ô rỗng
 * - Tự format cột ngày (`DATA_TYPES.DATE`) theo `DD/MM/YYYY` / `DD/MM/YYYY HH:mm`
 * - Giữ nguyên khả năng kế thừa màu `emphasis` (`strong`/`muted`) trên Tablet/Phone
 */
export function createStandardDefaultColDef<TData = any>(): DefaultColDef<TData> {
  return {
    cell: ({ getValue, column, isResponsive }) => {
      const rawVal = getValue();
      const isDate = column.dataType === DATA_TYPES.DATE;
      const displayVal = isDate ? formatGridDateValue(rawVal, Boolean(column.showTime)) : rawVal;
      const hasVal =
        displayVal !== undefined && displayVal !== null && String(displayVal).trim() !== '';

      if (isResponsive) {
        if (!hasVal) {
          return <span style={{ color: 'var(--agv-text-muted)' }}>—</span>;
        }
        const text = String(displayVal);
        return column.className ? <span className={column.className}>{text}</span> : text;
      }

      return (
        <span
          className={`truncate text-xs ${
            hasVal && column.className ? column.className : ''
          } ${isDate ? 'tabular-nums' : ''}`.trim()}
          style={{ color: hasVal ? 'var(--agv-text-main)' : 'var(--agv-text-muted)' }}
        >
          {hasVal ? String(displayVal) : '—'}
        </span>
      );
    },
  };
}

export interface CodeNameColumnOptions<TData>
  extends Omit<ColumnDefCommon<TData, string>, 'id'> {
  id: string;
  code: (keyof TData & string) | ((row: TData) => unknown);
  name: (keyof TData & string) | ((row: TData) => unknown);
  pattern?: CodeNamePattern;
  separator?: string;
  fallback?: string | ((row: TData) => string);
}

function readRowFieldOrFn<TData>(
  row: TData,
  getter: (keyof TData & string) | ((row: TData) => unknown)
): unknown {
  if (typeof getter === 'function') {
    return getter(row);
  }
  return row ? (row as any)[getter] : undefined;
}

export function buildCodeNameColumn<TData>(
  options: CodeNameColumnOptions<TData>
): AccessorColumnDef<TData, string> {
  const { code, name, pattern, separator, fallback, meta, ...rest } = options;
  return {
    ...rest,
    accessorFn: (row) => {
      const codeVal = readRowFieldOrFn(row, code);
      const nameVal = readRowFieldOrFn(row, name);
      const fb = typeof fallback === 'function' ? fallback(row) : fallback;
      return formatCodeName(codeVal, nameVal, { pattern, separator, fallback: fb });
    },
    meta: {
      align: ALIGNMENTS.LEFT,
      dataType: DATA_TYPES.TEXT,
      ...meta,
    },
  };
}

export interface CurrencyColumnOptions<TData>
  extends Omit<ColumnDefCommon<TData, number | null | undefined>, 'id'> {
  id?: string;
  suffix?: string;
  formatValue?: (val: unknown) => string;
  highlightNegative?: boolean;
}

export function buildCurrencyColumn<TData>(
  accessorOrFn: any,
  options: CurrencyColumnOptions<TData>
): AccessorColumnDef<TData, any> {
  const {
    suffix = ' đ',
    formatValue,
    highlightNegative = true,
    meta,
    enableGlobalFilter = false,
    cell,
    ...rest
  } = options;
  const fmt = formatValue ?? ((val: unknown) => formatGridCurrency(val, suffix));
  const resolvedMeta = {
    align: ALIGNMENTS.RIGHT,
    dataType: DATA_TYPES.NUMBER,
    ...meta,
  };
  const currencyCell =
    cell ??
    (({ getValue }) => {
      const val = getValue();
      const hasBal =
        val !== undefined &&
        val !== null &&
        String(val).trim() !== '' &&
        Number.isFinite(Number(val));
      return (
        <span
          className="text-xs font-semibold font-mono tabular-nums"
          style={{
            color: hasBal
              ? highlightNegative && Number(val) < 0
                ? 'var(--agv-danger)'
                : 'var(--agv-text-main)'
              : 'var(--agv-text-muted)',
          }}
        >
          {fmt(val)}
        </span>
      );
    });

  if (typeof accessorOrFn === 'function') {
    return {
      ...rest,
      accessorFn: accessorOrFn,
      enableGlobalFilter,
      meta: resolvedMeta,
      cell: currencyCell,
    };
  }
  return {
    ...rest,
    id: rest.id ?? accessorOrFn,
    accessorKey: accessorOrFn,
    enableGlobalFilter,
    meta: resolvedMeta,
    cell: currencyCell,
  };
}

export const FORMULA_12M_LABELS: Record<
  FormulaMode,
  { columnHeader: string; short: string }
> = {
  [FORMULA_MODES.AVG]: { columnHeader: 'Doanh số TB (12T)', short: 'TB' },
  [FORMULA_MODES.SUM]: { columnHeader: 'Tổng doanh số (12T)', short: 'Tổng' },
  [FORMULA_MODES.MIN]: { columnHeader: 'Thấp nhất (12T)', short: 'Thấp nhất' },
  [FORMULA_MODES.MAX]: { columnHeader: 'Cao nhất (12T)', short: 'Cao nhất' },
};

export interface ComputedTwelveMonthStats {
  values: number[];
  minIdx: number;
  maxIdx: number;
  minVal: number;
  maxVal: number;
  avgVal: number;
  sumVal: number;
}

const EMPTY_12M_STATS: ComputedTwelveMonthStats = {
  values: [],
  minIdx: 0,
  maxIdx: 0,
  minVal: 0,
  maxVal: 0,
  avgVal: 0,
  sumVal: 0,
};

export type TwelveMonthSource<TData> = (row: TData) => readonly number[] | null | undefined;

function extractRawMonthSeries<TData>(
  target: TData,
  getMonths?: TwelveMonthSource<TData>
): readonly number[] | null {
  if (getMonths) {
    const res = getMonths(target);
    return Array.isArray(res) && res.length > 0 ? res : null;
  }
  const anyTarget = target as any;
  if (Array.isArray(anyTarget.months12) && anyTarget.months12.length > 0) {
    return anyTarget.months12;
  }
  let hasColMonth = false;
  for (let m = 1; m <= 12; m++) {
    if (anyTarget[`col_m${m}`] !== undefined) {
      hasColMonth = true;
      break;
    }
  }
  if (!hasColMonth) return null;
  const arr: number[] = [];
  for (let m = 1; m <= 12; m++) {
    arr.push(Number(anyTarget[`col_m${m}`]) || 0);
  }
  return arr;
}

function computeStatsFromSeries(raw: readonly number[]): ComputedTwelveMonthStats {
  const len = raw.length;
  if (len === 0) return EMPTY_12M_STATS;

  const values: number[] = new Array(len);
  let sumVal = 0;
  let minVal = Infinity;
  let maxVal = -Infinity;
  let minIdx = 0;
  let maxIdx = 0;

  for (let i = 0; i < len; i++) {
    const n = Number(raw[i]);
    const v = Number.isFinite(n) ? n : 0;
    values[i] = v;
    sumVal += v;
    if (v < minVal) {
      minVal = v;
      minIdx = i;
    }
    if (v > maxVal) {
      maxVal = v;
      maxIdx = i;
    }
  }

  return {
    values,
    minIdx,
    maxIdx,
    minVal,
    maxVal,
    avgVal: Math.round(sumVal / len),
    sumVal,
  };
}

export function createTwelveMonthStatsGetter<TData>(
  getMonths?: TwelveMonthSource<TData>
): (row: TData) => ComputedTwelveMonthStats {
  const cache = new WeakMap<object, ComputedTwelveMonthStats>();
  return (row: TData): ComputedTwelveMonthStats => {
    const target = ((row as any)?._baseRecord ?? row) as TData | null | undefined;
    if (!target || typeof target !== 'object') return EMPTY_12M_STATS;
    const cached = cache.get(target as object);
    if (cached) return cached;

    const raw = extractRawMonthSeries(target, getMonths);
    const computed = raw ? computeStatsFromSeries(raw) : EMPTY_12M_STATS;
    cache.set(target as object, computed);
    return computed;
  };
}

function resolveFormulaMetricValue(
  stats: ComputedTwelveMonthStats,
  mode: FormulaMode
): number | undefined {
  if (stats.values.length === 0) return undefined;
  switch (mode) {
    case FORMULA_MODES.SUM:
      return stats.sumVal;
    case FORMULA_MODES.MIN:
      return stats.minVal;
    case FORMULA_MODES.MAX:
      return stats.maxVal;
    case FORMULA_MODES.AVG:
    default:
      return stats.avgVal;
  }
}

export interface Formula12mColumnOptions<TData>
  extends Omit<ColumnDefCommon<TData, number | undefined>, 'id'> {
  id?: string;
  getMonths?: TwelveMonthSource<TData>;
  formatValue?: (val: number) => string;
  headerLabels?: Partial<Record<FormulaMode, string>>;
  tabletLabels?: Partial<Record<FormulaMode, string>>;
}

export function buildFormula12mColumn<TData>(
  options: Formula12mColumnOptions<TData> = {},
  sharedStatsGetter?: (row: TData) => ComputedTwelveMonthStats
): AccessorColumnDef<TData, number | undefined> {
  const {
    id = 'MonthlyFormulaVal',
    getMonths,
    formatValue,
    headerLabels,
    tabletLabels,
    size = 168,
    minSize = 136,
    enableGlobalFilter = false,
    meta,
    header,
    cell: customCell,
    ...rest
  } = options;

  const statsGetter = sharedStatsGetter ?? createTwelveMonthStatsGetter(getMonths);
  const fmt = formatValue ?? ((val: number) => formatGridCurrency(val));
  const defaultHeader =
    typeof header === 'string'
      ? header
      : headerLabels?.[FORMULA_MODES.MAX] ?? FORMULA_12M_LABELS[FORMULA_MODES.MAX].columnHeader;
  const explicitRenderCell = (rest as Partial<ColumnDef<TData>>).renderCell;
  const hasExplicitCell = Boolean(customCell || explicitRenderCell);

  const makeFormulaRenderCell =
    (mode: FormulaMode) =>
    (params: CellRenderParams<TData>): React.ReactNode => {
      const stats = statsGetter(params.row);
      const val = resolveFormulaMetricValue(stats, mode);
      if (val === undefined || !Number.isFinite(val)) {
        return (
          <span className="text-xs font-mono" style={{ color: 'var(--agv-text-muted)' }}>
            —
          </span>
        );
      }

      const colorStyle: React.CSSProperties =
        mode === FORMULA_MODES.MAX
          ? { color: 'var(--agv-trend-up)' }
          : mode === FORMULA_MODES.MIN
            ? { color: 'var(--agv-trend-down)' }
            : { color: 'var(--agv-text-main)' };

      if (params.isResponsive) {
        return (
          <span
            className="text-xs font-semibold font-mono tabular-nums"
            style={colorStyle}
          >
            {fmt(val)}
          </span>
        );
      }

      if (mode === FORMULA_MODES.MIN || mode === FORMULA_MODES.MAX) {
        const monthIdx = mode === FORMULA_MODES.MIN ? stats.minIdx : stats.maxIdx;
        return (
          <div className="flex items-center justify-between w-full font-medium tabular-nums text-xs">
            <span
              className="text-[11px] font-semibold tracking-tight"
              style={{ color: 'var(--agv-text-muted)' }}
            >
              {`T${monthIdx + 1}`}
            </span>
            <span className="font-semibold font-mono text-right" style={colorStyle}>
              {fmt(val)}
            </span>
          </div>
        );
      }

      return (
        <div className="flex items-center justify-end w-full font-semibold font-mono tabular-nums text-xs">
          <span style={colorStyle}>{fmt(val)}</span>
        </div>
      );
    };

  const colDef: AccessorColumnDef<TData, number | undefined> &
    Partial<Pick<ColumnDef<TData>, 'renderCell'>> = {
    ...rest,
    id,
    header: header ?? defaultHeader,
    size,
    minSize,
    enableGlobalFilter,
    accessorFn: (row) => resolveFormulaMetricValue(statsGetter(row), FORMULA_MODES.MAX),
    cell: customCell,
    renderCell: hasExplicitCell
      ? explicitRenderCell
      : makeFormulaRenderCell(FORMULA_MODES.MAX),
    meta: {
      align: ALIGNMENTS.RIGHT,
      dataType: DATA_TYPES.NUMBER,
      ...meta,
      isFormula: true,
      bindColumnRuntime: ({ formulaMode }) => {
        const dynamicTitle =
          typeof header === 'string'
            ? header
            : headerLabels?.[formulaMode] ?? FORMULA_12M_LABELS[formulaMode].columnHeader;

        const patch: Partial<ColumnDef<TData>> = {
          title: dynamicTitle,
          valueGetter: (row) => resolveFormulaMetricValue(statsGetter(row), formulaMode),
          monthIndexGetter: (row, mode) => {
            const s = statsGetter(row);
            return mode === FORMULA_MODES.MIN ? s.minIdx : s.maxIdx;
          },
          tabletLabelGetter: (row) => {
            const s = statsGetter(row);
            if (s.values.length === 0) return undefined;
            const shortPrefix = tabletLabels?.[formulaMode] ?? FORMULA_12M_LABELS[formulaMode].short;
            if (formulaMode === FORMULA_MODES.MAX) {
              return `${shortPrefix} T${s.maxIdx + 1}`;
            }
            if (formulaMode === FORMULA_MODES.MIN) {
              return `${shortPrefix} T${s.minIdx + 1}`;
            }
            return shortPrefix;
          },
        };

        if (!hasExplicitCell) {
          patch.renderCell = makeFormulaRenderCell(formulaMode);
        }

        return patch;
      },
    },
  };

  return colDef;
}

export interface Chart12mColumnOptions<TData>
  extends Omit<ColumnDefCommon<TData, number | undefined>, 'id'> {
  id?: string;
  getMonths?: TwelveMonthSource<TData>;
  formatValue?: (val: number) => string;
}

export function buildChart12mColumn<TData>(
  options: Chart12mColumnOptions<TData> = {},
  sharedStatsGetter?: (row: TData) => ComputedTwelveMonthStats
): AccessorColumnDef<TData, number | undefined> {
  const {
    id = 'MonthlyTrendChart',
    header = 'Xu hướng 12 tháng',
    getMonths,
    formatValue,
    size = 172,
    minSize = 140,
    enableSorting = false,
    enableColumnFilter = false,
    enableGlobalFilter = false,
    meta,
    cell: customCell,
    ...rest
  } = options;

  const statsGetter = sharedStatsGetter ?? createTwelveMonthStatsGetter(getMonths);
  const fmt = formatValue ?? ((val: number) => formatGridCurrency(val));
  const explicitRenderCell = (rest as Partial<ColumnDef<TData>>).renderCell;
  const hasExplicitCell = Boolean(customCell || explicitRenderCell);

  const makeChartRenderCell =
    (theme: SurfaceTheme) =>
    (params: CellRenderParams<TData>): React.ReactNode => {
      const s = statsGetter(params.row);
      if (s.values.length === 0) return null;
      return (
        <React.Suspense fallback={null}>
          <LazyTwelveMonthChartCell
            values={s.values}
            minIdx={s.minIdx}
            maxIdx={s.maxIdx}
            minVal={s.minVal}
            maxVal={s.maxVal}
            avgVal={s.avgVal}
            surfaceTheme={theme}
            formatValue={fmt}
          />
        </React.Suspense>
      );
    };

  const colDef: AccessorColumnDef<TData, number | undefined> &
    Partial<Pick<ColumnDef<TData>, 'renderCell'>> = {
    ...rest,
    id,
    header,
    size,
    minSize,
    enableSorting,
    enableColumnFilter,
    enableGlobalFilter,
    accessorFn: (row) => {
      const s = statsGetter(row);
      return s.values.length > 0 ? s.avgVal : undefined;
    },
    cell: customCell,
    renderCell: hasExplicitCell
      ? explicitRenderCell
      : makeChartRenderCell(SURFACE_THEMES.LIGHT),
    meta: {
      align: ALIGNMENTS.CENTER,
      dataType: DATA_TYPES.TEXT,
      cellPadding: 'none',
      ...meta,
      isChart: true,
      bindColumnRuntime: ({ surfaceTheme }) => {
        const patch: Partial<ColumnDef<TData>> = {
          valueGetter: (row) => {
            const s = statsGetter(row);
            return s.values.length > 0 ? s.avgVal : undefined;
          },
        };

        if (!hasExplicitCell) {
          patch.renderCell = makeChartRenderCell(surfaceTheme);
        }

        return patch;
      },
    },
  };

  return colDef;
}

export interface TwelveMonthsPairOptions<TData> {
  getMonths?: TwelveMonthSource<TData>;
  formatValue?: (val: number) => string;
  formulaId?: string;
  chartId?: string;
  formulaColumn?: Partial<Omit<Formula12mColumnOptions<TData>, 'getMonths' | 'formatValue'>>;
  chartColumn?: Partial<Omit<Chart12mColumnOptions<TData>, 'getMonths' | 'formatValue'>>;
}

export function buildTwelveMonthsPair<TData>(
  options: TwelveMonthsPairOptions<TData> = {}
): readonly [AccessorColumnDef<TData, number | undefined>, AccessorColumnDef<TData, number | undefined>] {
  const sharedStatsGetter = createTwelveMonthStatsGetter(options.getMonths);
  return [
    buildFormula12mColumn(
      {
        ...(options.formulaColumn ?? {}),
        ...(options.formulaId ? { id: options.formulaId } : {}),
        getMonths: options.getMonths,
        formatValue: options.formatValue,
      },
      sharedStatsGetter
    ),
    buildChart12mColumn(
      {
        ...(options.chartColumn ?? {}),
        ...(options.chartId ? { id: options.chartId } : {}),
        getMonths: options.getMonths,
        formatValue: options.formatValue,
      },
      sharedStatsGetter
    ),
  ] as const;
}
