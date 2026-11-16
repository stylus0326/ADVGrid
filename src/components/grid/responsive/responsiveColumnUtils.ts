import React from 'react';
import {
  ALIGNMENTS,
  BaseGroupDef,
  CellRenderParams,
  ColumnAlign,
  ColumnDef,
  DATA_TYPES,
  PhoneCardConfig,
  TabletColumnGroup,
} from '../types';
import { formatGridNumber, getGridCellValue } from '../gridFormatUtils';
import type { TabletFieldKey, TabletLineSlot } from '../columns/columnTypes';

export interface CompiledTabletLine<T = any> {
  col: ColumnDef<T>;
  colIndex: number;
  label?: string;
  labelGetter?: (row: T, rowIndex: number) => string | undefined;
  joinCols?: Array<{ col: ColumnDef<T>; colIndex: number }>;
  joinSeparator: string;
  isChart: boolean;
  isPrimaryFirstLine: boolean;
  emphasis: 'strong' | 'normal' | 'muted';
}

export interface CompiledTabletGroup<T = any> {
  id: string;
  header: string;
  width?: number;
  minWidth: number;
  align: ColumnAlign;
  hasStandaloneChart: boolean;
  lines: CompiledTabletLine<T>[];
}

export interface CompiledPhoneChartBand<T = any> {
  chartLine: CompiledTabletLine<T>;
  formulaLine?: CompiledTabletLine<T>;
}

export interface CompiledPhoneInfoRow<T = any> {
  left?: CompiledTabletLine<T>;
  right?: CompiledTabletLine<T>;
  showDetailButton?: boolean;
}

export interface CompiledPhoneCard<T = any> {
  title?: CompiledTabletLine<T>;
  badge?: CompiledTabletLine<T>;
  summary: CompiledTabletLine<T>[];
  chartBand?: CompiledPhoneChartBand<T>;
  infoRows: CompiledPhoneInfoRow<T>[];
  detailButtonLabel?: string;
  hasExpandableDrawer: boolean;
  extraHeight: number;
}

export function resolveCompiledLineLabel<T>(
  line: CompiledTabletLine<T>,
  row: T,
  rowIndex: number
): string | undefined {
  return line.labelGetter
    ? line.labelGetter(((row as any)?._baseRecord ?? row) as T, rowIndex)
    : line.label;
}

export function computeTabletTrackMinWidth(
  groups: CompiledTabletGroup<any>[] | undefined,
  showRowNumber: boolean,
  showSelectionCol: boolean
): number {
  if (!groups || groups.length === 0) return 0;
  return (
    24 +
    (showRowNumber || showSelectionCol ? 48 : 0) +
    groups.reduce((acc, g) => acc + (g.width ?? g.minWidth), 0)
  );
}

export function isResponsiveSystemColumn<T>(col: ColumnDef<T> | undefined | null): boolean {
  return Boolean(
    !col ||
      col.dataType === DATA_TYPES.SYSTEM ||
      col.isRowNumber ||
      col.isSelection ||
      col.key === 'col_stt' ||
      col.key === 'col_chk'
  );
}

export function getResponsiveDataColumns<T>(columns: ColumnDef<T>[] = []): ColumnDef<T>[] {
  return columns.filter((col) => !isResponsiveSystemColumn(col));
}

export function extractResponsiveRawValue<T>(
  row: T,
  col: ColumnDef<T>,
  rowIndex: number = 0
): any {
  if (col.valueGetter) {
    return col.valueGetter(((row as any)?._baseRecord ?? row) as T, rowIndex);
  }
  return getGridCellValue(row, col.key);
}

export function formatResponsiveFieldValue<T>(col: ColumnDef<T>, rawVal: any): string {
  if (rawVal === null || rawVal === undefined || rawVal === '') return '—';
  if (col.dataType === DATA_TYPES.NUMBER) {
    return formatGridNumber(rawVal);
  }
  return String(rawVal);
}

export function renderResponsiveField<T>(params: {
  row: T;
  rowIndex: number;
  colIndex?: number;
  col: ColumnDef<T>;
  isSelected: boolean;
  isChecked: boolean;
  renderCell?: (p: CellRenderParams<T>) => React.ReactNode;
}): React.ReactNode {
  const { row, rowIndex, col, isSelected, isChecked, renderCell } = params;
  if (col.renderCell) {
    const customColCell = col.renderCell({
      column: col,
      row,
      rowIndex,
      isSelected,
      isChecked,
      isResponsive: true,
    });
    if (customColCell !== undefined && customColCell !== null) {
      return customColCell;
    }
  }
  if (renderCell) {
    const custom = renderCell({
      column: col,
      row,
      rowIndex,
      isSelected,
      isChecked,
      isResponsive: true,
    });
    if (custom !== undefined && custom !== null) {
      return custom;
    }
  }
  const rawVal = extractResponsiveRawValue(row, col, rowIndex);
  return formatResponsiveFieldValue(col, rawVal);
}

type IndexedDataCol<T> = { col: ColumnDef<T>; colIndex: number };

function packDataColsIntoGroups<T>(
  items: IndexedDataCol<T>[],
  options?: {
    idPrefix?: string;
    headerOverride?: string;
    markFirstPrimary?: boolean;
  }
): CompiledTabletGroup<T>[] {
  const groups: CompiledTabletGroup<T>[] = [];
  const prefix = options?.idPrefix ?? 'auto_tb';
  let i = 0;

  while (i < items.length) {
    const cur = items[i];
    const next = items[i + 1];

    // Cặp Formula + Chart -> 1 siêu-cột 2 dòng (dòng 1 là số thống kê, dòng 2 là sóng 12 tháng)
    if (cur.col.isFormula && next?.col.isChart) {
      groups.push({
        id: `${prefix}_${groups.length}`,
        header: options?.headerOverride ?? (cur.col.title || cur.col.key),
        width: 175,
        minWidth: 160,
        align: cur.col.align ?? ALIGNMENTS.RIGHT,
        hasStandaloneChart: false,
        lines: [
          {
            col: cur.col,
            colIndex: cur.colIndex,
            label: cur.col.tabletLabelGetter ? undefined : cur.col.title || cur.col.key,
            labelGetter: cur.col.tabletLabelGetter,
            joinSeparator: ' · ',
            isChart: false,
            isPrimaryFirstLine: false,
            emphasis: 'normal',
          },
          {
            col: next.col,
            colIndex: next.colIndex,
            joinSeparator: ' · ',
            isChart: true,
            isPrimaryFirstLine: false,
            emphasis: 'normal',
          },
        ],
      });
      i += 2;
      continue;
    }

    // Cột Chart đứng lẻ -> tách riêng 1 siêu-cột để sóng thoáng rõ (cao ~42px)
    if (cur.col.isChart) {
      groups.push({
        id: `${prefix}_${groups.length}`,
        header: options?.headerOverride ?? (cur.col.title || cur.col.key),
        width: 165,
        minWidth: 150,
        align: ALIGNMENTS.CENTER,
        hasStandaloneChart: true,
        lines: [
          {
            col: cur.col,
            colIndex: cur.colIndex,
            joinSeparator: ' · ',
            isChart: true,
            isPrimaryFirstLine: false,
            emphasis: 'normal',
          },
        ],
      });
      i += 1;
      continue;
    }

    // Các cột dữ liệu chữ/số thường: gom tối đa 3 cột vào 1 siêu-cột
    const bucket: IndexedDataCol<T>[] = [];
    while (i < items.length && bucket.length < 3) {
      const candidate = items[i];
      if (candidate.col.isChart) break;
      if (candidate.col.isFormula && items[i + 1]?.col.isChart) break;
      bucket.push(candidate);
      i += 1;
    }

    const isFirstGroup = Boolean(options?.markFirstPrimary) && groups.length === 0;
    const isLastChunk = i >= items.length;
    const lines: CompiledTabletLine<T>[] = bucket.map((item, lineIdx) => {
      const isPrimaryFirstLine = isFirstGroup && lineIdx === 0;
      const shouldShowLabel =
        bucket.length > 1 && !isPrimaryFirstLine && !(isLastChunk && bucket.length <= 2 && lineIdx === 0);
      return {
        col: item.col,
        colIndex: item.colIndex,
        label: shouldShowLabel ? item.col.title || item.col.key : undefined,
        joinSeparator: ' · ',
        isChart: false,
        isPrimaryFirstLine,
        emphasis: isPrimaryFirstLine ? 'strong' : 'normal',
      };
    });

    groups.push({
      id: `${prefix}_${groups.length}`,
      header: options?.headerOverride ?? (bucket[0].col.title || bucket[0].col.key),
      width: isLastChunk && bucket.length <= 2 && groups.length > 0 ? 156 : undefined,
      minWidth: isFirstGroup ? 175 : 150,
      align: isLastChunk && bucket.length <= 2 && groups.length > 0 ? ALIGNMENTS.RIGHT : ALIGNMENTS.LEFT,
      hasStandaloneChart: false,
      lines,
    });
  }

  return groups;
}

export function compileTabletGroups<T>(
  columns: ColumnDef<T>[],
  tabletGroups?: readonly TabletColumnGroup<T>[],
  columnGroups?: BaseGroupDef[],
  hiddenColKeys?: Set<string>
): CompiledTabletGroup<T>[] {
  const dataCols = getResponsiveDataColumns(columns);
  if (dataCols.length === 0) return [];

  const colByKey = new Map<string, IndexedDataCol<T>>();
  dataCols.forEach((col, colIndex) => {
    colByKey.set(col.key, { col, colIndex });
  });

  const resolveSlotCol = (colKey: string): IndexedDataCol<T> | undefined => {
    if (hiddenColKeys?.has(colKey)) return undefined;
    const existing = colByKey.get(colKey);
    if (existing) return existing;
    return createFallbackSlotCol<T>(colKey);
  };

  // Tầng 1: Khai báo tường minh `tabletGroups`
  if (tabletGroups && tabletGroups.length > 0) {
    const compiled: CompiledTabletGroup<T>[] = [];
    tabletGroups.forEach((group, groupIdx) => {
      const compiledLines: CompiledTabletLine<T>[] = [];
      let firstLineExplicitEmphasis = false;
      const rawSlots = group.lines.slice(0, 3);
      for (const slot of rawSlots) {
        const line = compileResponsiveSlot(slot, resolveSlotCol, { defaultLabel: false });
        if (!line) continue;

        if (compiledLines.length === 0) {
          firstLineExplicitEmphasis =
            typeof slot === 'object' && !isTupleSlot(slot) && Boolean(slot.emphasis);
        }

        compiledLines.push(line);
      }

      if (compiledLines.length === 0) return;

      if (compiled.length === 0 && !compiledLines[0].isChart) {
        compiledLines[0].isPrimaryFirstLine = true;
        if (!firstLineExplicitEmphasis) {
          compiledLines[0].emphasis = 'strong';
        }
      }

      const hasChart = compiledLines.some((l) => l.isChart);
      const hasStandaloneChart = compiledLines.length === 1 && compiledLines[0].isChart;
      compiled.push({
        id: group.id || `tg_${groupIdx}`,
        header: group.header,
        width: group.width,
        minWidth: group.minWidth ?? (hasChart ? 150 : 140),
        align:
          group.align ??
          (compiledLines.length === 1 && compiledLines[0].col.align
            ? compiledLines[0].col.align
            : ALIGNMENTS.LEFT),
        hasStandaloneChart,
        lines: compiledLines,
      });
    });

    if (compiled.length > 0) return compiled;
  }

  // Tầng 2: Kế thừa `columnGroups` nếu trang chưa khai báo `tabletGroups`
  if (columnGroups && columnGroups.length > 0) {
    const compiledFromBands: CompiledTabletGroup<T>[] = [];
    columnGroups.forEach((cg, bandIdx) => {
      if (cg.isStandalone) return;
      const items = cg.keys
        .map((k) => colByKey.get(k))
        .filter((item): item is IndexedDataCol<T> => Boolean(item));
      if (items.length === 0) return;
      const packed = packDataColsIntoGroups(items, {
        idPrefix: `band_${cg.id || bandIdx}`,
        headerOverride: cg.title || undefined,
        markFirstPrimary: compiledFromBands.length === 0,
      });
      compiledFromBands.push(...packed);
    });
    if (compiledFromBands.length > 0) return compiledFromBands;
  }

  // Tầng 3: Auto-Packer mặc định tối đa 3 dòng / siêu-cột
  const allItems: IndexedDataCol<T>[] = dataCols.map((col, colIndex) => ({ col, colIndex }));
  return packDataColsIntoGroups(allItems, {
    idPrefix: 'auto_tb',
    markFirstPrimary: true,
  });
}

function createFallbackSlotCol<T>(colKey: string): IndexedDataCol<T> {
  return {
    col: {
      key: colKey,
      title: colKey,
      defaultWidth: 120,
      dataType: DATA_TYPES.TEXT,
    },
    colIndex: -1,
  };
}

function isTupleSlot<T>(
  s: TabletLineSlot<T>
): s is readonly [TabletFieldKey<T>, ...TabletFieldKey<T>[]] {
  return Array.isArray(s);
}

function compileResponsiveSlot<T>(
  slot: TabletLineSlot<T>,
  resolveSlotCol: (colKey: string) => IndexedDataCol<T> | undefined,
  options?: { defaultLabel?: boolean; defaultEmphasis?: 'strong' | 'normal' | 'muted' }
): CompiledTabletLine<T> | undefined {
  let found: IndexedDataCol<T> | undefined;
  let resolvedLabel: string | undefined;
  let labelGetter: ((row: T, rowIndex: number) => string | undefined) | undefined;
  let joinCols: IndexedDataCol<T>[] | undefined;
  let joinSeparator = ' · ';
  let explicitEmphasis: 'strong' | 'normal' | 'muted' | undefined;

  const applyColumnLabel = (target: IndexedDataCol<T>) => {
    if (target.col.tabletLabelGetter) {
      labelGetter = target.col.tabletLabelGetter;
    } else {
      resolvedLabel = target.col.title || target.col.key;
    }
  };

  if (isTupleSlot(slot)) {
    const resolved = slot
      .map((jk) => resolveSlotCol(jk))
      .filter((item): item is IndexedDataCol<T> => Boolean(item));
    if (resolved.length === 0) return undefined;
    found = resolved[0];
    if (resolved.length > 1) {
      joinCols = resolved.slice(1);
    }
  } else {
    const colKey = typeof slot === 'string' ? slot : slot.col;
    found = resolveSlotCol(colKey);
    if (!found) return undefined;

    if (typeof slot === 'string') {
      if (options?.defaultLabel) {
        applyColumnLabel(found);
      }
    } else {
      if (slot.label === false) {
        resolvedLabel = undefined;
        labelGetter = undefined;
      } else if (typeof slot.label === 'function') {
        labelGetter = slot.label;
      } else if (slot.label === true || (slot.label === undefined && options?.defaultLabel)) {
        applyColumnLabel(found);
      } else if (typeof slot.label === 'string' && slot.label.trim().length > 0) {
        resolvedLabel = slot.label;
      }

      if (slot.join && slot.join.length > 0) {
        const resolvedJoins = slot.join
          .map((jk) => resolveSlotCol(jk))
          .filter((item): item is IndexedDataCol<T> => Boolean(item));
        if (resolvedJoins.length > 0) {
          joinCols = resolvedJoins;
        }
      }
      if (slot.joinSeparator) {
        joinSeparator = slot.joinSeparator;
      }
      if (slot.emphasis) {
        explicitEmphasis = slot.emphasis;
      }
    }
  }

  return {
    col: found.col,
    colIndex: found.colIndex,
    label: resolvedLabel,
    labelGetter,
    joinCols,
    joinSeparator,
    isChart: Boolean(found.col.isChart),
    isPrimaryFirstLine: false,
    emphasis: explicitEmphasis ?? options?.defaultEmphasis ?? 'normal',
  };
}

export function compilePhoneCard<T>(
  columns: ColumnDef<T>[],
  phoneCard?: PhoneCardConfig<T>,
  hiddenColKeys?: Set<string>
): CompiledPhoneCard<T> {
  const allDataCols = getResponsiveDataColumns(columns);
  const visibleIndexedCols: IndexedDataCol<T>[] = [];
  const colByKey = new Map<string, IndexedDataCol<T>>();

  allDataCols.forEach((col, colIndex) => {
    if (hiddenColKeys?.has(col.key)) return;
    const item = { col, colIndex };
    visibleIndexedCols.push(item);
    colByKey.set(col.key, item);
  });

  const detailButtonLabel =
    phoneCard?.detailButtonLabel === false
      ? undefined
      : phoneCard?.detailButtonLabel || 'Xem chi tiết';

  if (visibleIndexedCols.length === 0) {
    return {
      summary: [],
      infoRows: [],
      detailButtonLabel,
      hasExpandableDrawer: false,
      extraHeight: 0,
    };
  }

  const resolveSlotCol = (colKey: string): IndexedDataCol<T> | undefined => {
    if (hiddenColKeys?.has(colKey)) return undefined;
    const existing = colByKey.get(colKey);
    if (existing) return existing;
    return createFallbackSlotCol<T>(colKey);
  };

  // 1. Tự nhận diện (hoặc chỉ định) khối sóng 12 tháng + chỉ số công thức
  let chartBand: CompiledPhoneChartBand<T> | undefined;
  if (phoneCard?.chart !== false) {
    let chartItem: IndexedDataCol<T> | undefined;
    let formulaItem: IndexedDataCol<T> | undefined;
    if (typeof phoneCard?.chart === 'object') {
      chartItem = colByKey.get(phoneCard.chart.chart);
      if (chartItem) {
        formulaItem = phoneCard.chart.formula
          ? colByKey.get(phoneCard.chart.formula)
          : visibleIndexedCols.find((x) => x.col.isFormula);
      }
    } else {
      chartItem = visibleIndexedCols.find((x) => x.col.isChart);
      if (chartItem) {
        formulaItem = visibleIndexedCols.find((x) => x.col.isFormula);
      }
    }

    if (chartItem) {
      const chartLine: CompiledTabletLine<T> = {
        col: chartItem.col,
        colIndex: chartItem.colIndex,
        joinSeparator: ' · ',
        isChart: true,
        isPrimaryFirstLine: false,
        emphasis: 'normal',
      };
      const formulaLine: CompiledTabletLine<T> | undefined = formulaItem
        ? {
            col: formulaItem.col,
            colIndex: formulaItem.colIndex,
            label: formulaItem.col.tabletLabelGetter
              ? undefined
              : formulaItem.col.title || formulaItem.col.key,
            labelGetter: formulaItem.col.tabletLabelGetter,
            joinSeparator: ' · ',
            isChart: false,
            isPrimaryFirstLine: false,
            emphasis: 'strong',
          }
        : undefined;
      chartBand = { chartLine, formulaLine };
    }
  }

  const usedKeys = new Set<string>();
  const markLineUsed = (line: CompiledTabletLine<T> | undefined) => {
    if (!line) return;
    usedKeys.add(line.col.key);
    line.joinCols?.forEach((j) => usedKeys.add(j.col.key));
  };

  markLineUsed(chartBand?.chartLine);
  markLineUsed(chartBand?.formulaLine);

  const plainCols = visibleIndexedCols.filter((x) => !x.col.isChart && !x.col.isFormula);

  // 2. Title bên trái hàng 1
  let title: CompiledTabletLine<T> | undefined;
  if (phoneCard?.title !== undefined) {
    title = compileResponsiveSlot(phoneCard.title, resolveSlotCol, {
      defaultLabel: false,
      defaultEmphasis: 'strong',
    });
  } else if (plainCols.length >= 2) {
    title = compileResponsiveSlot([plainCols[0].col.key, plainCols[1].col.key], resolveSlotCol, {
      defaultLabel: false,
      defaultEmphasis: 'strong',
    });
  } else if (plainCols.length === 1) {
    title = compileResponsiveSlot(plainCols[0].col.key, resolveSlotCol, {
      defaultLabel: false,
      defaultEmphasis: 'strong',
    });
  }
  markLineUsed(title);

  // 3. Badge trạng thái bên phải hàng 1
  let badge: CompiledTabletLine<T> | undefined;
  if (phoneCard?.badge !== undefined) {
    badge = compileResponsiveSlot(phoneCard.badge, resolveSlotCol, { defaultLabel: false });
  } else {
    const statusCol = plainCols.find(
      (x) =>
        !usedKeys.has(x.col.key) &&
        /status|trạng\s*thái/i.test(`${x.col.key} ${x.col.title || ''}`)
    );
    if (statusCol) {
      badge = compileResponsiveSlot(statusCol.col.key, resolveSlotCol, { defaultLabel: false });
    }
  }
  markLineUsed(badge);

  // 4. Thông tin tóm tắt ở hàng 2 bên trái nút mở rộng
  let summary: CompiledTabletLine<T>[] = [];
  if (phoneCard?.summary !== undefined) {
    summary = phoneCard.summary
      .map((s) => compileResponsiveSlot(s, resolveSlotCol, { defaultLabel: true }))
      .filter((line): line is CompiledTabletLine<T> => Boolean(line));
  } else {
    summary = plainCols
      .filter((x) => !usedKeys.has(x.col.key))
      .slice(0, 2)
      .map((x) => compileResponsiveSlot(x.col.key, resolveSlotCol, { defaultLabel: true }))
      .filter((line): line is CompiledTabletLine<T> => Boolean(line));
  }
  summary.forEach(markLineUsed);

  // 5. Các trường trong ngăn kéo mở rộng (tự co khít theo có/không Chart, 0 thanh cuộn)
  const rawDetails =
    phoneCard?.details !== undefined
      ? phoneCard.details
          .map((s) => compileResponsiveSlot(s, resolveSlotCol, { defaultLabel: true }))
          .filter((line): line is CompiledTabletLine<T> => Boolean(line))
      : plainCols
          .filter((x) => !usedKeys.has(x.col.key))
          .map((x) => compileResponsiveSlot(x.col.key, resolveSlotCol, { defaultLabel: true }))
          .filter((line): line is CompiledTabletLine<T> => Boolean(line));

  const maxSlots = chartBand ? (detailButtonLabel ? 3 : 4) : detailButtonLabel ? 5 : 6;
  const cappedDetails = rawDetails.slice(0, maxSlots);

  const infoRows: CompiledPhoneInfoRow<T>[] = [];
  for (let i = 0; i < cappedDetails.length; i += 2) {
    infoRows.push({
      left: cappedDetails[i],
      right: cappedDetails[i + 1],
    });
  }

  if (detailButtonLabel) {
    if (infoRows.length === 0) {
      if (chartBand || phoneCard) {
        infoRows.push({ showDetailButton: true });
      }
    } else if (!infoRows[infoRows.length - 1].right) {
      infoRows[infoRows.length - 1].showDetailButton = true;
    } else {
      infoRows.push({ showDetailButton: true });
    }
  }

  const hasExpandableDrawer = Boolean(chartBand) || infoRows.length > 0;
  let extraHeight = 0;
  if (hasExpandableDrawer) {
    // mt-2 (8) + border-t (1) + pt-2 (8) = 17px; thẻ đóng 99px trong khung 100px có sẵn 1px dự phòng => 16px
    let drawerPx = 16;
    if (chartBand) {
      drawerPx += 52;
      if (infoRows.length > 0) drawerPx += 8; // gap-2
    }
    if (infoRows.length > 0) {
      drawerPx += infoRows.length * 28 + (infoRows.length - 1) * 8; // mọi dòng chuẩn 28px + gap-2 (8px)
    }
    extraHeight = drawerPx;
  }

  return {
    title,
    badge,
    summary,
    chartBand,
    infoRows,
    detailButtonLabel,
    hasExpandableDrawer,
    extraHeight,
  };
}
