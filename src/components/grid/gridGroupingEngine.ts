import {
  ColumnDef,
  DATA_TYPES,
  GroupSortConfig,
  SORT_DIRECTIONS,
} from './types';

export interface GroupBucketEntry {
  groupValue: string;
  indices: number[];
  sums: Record<string, number>;
}

export interface GroupBucketsResult {
  colTitle: string;
  entries: GroupBucketEntry[];
}

export function buildGroupBuckets<T>(params: {
  groupByColumnKey: string;
  pagedRowIndices: number[] | null;
  totalPageRowCount: number;
  getRowVal: (origIdx: number, colKey: string) => any;
  colMap: Record<string, ColumnDef<T>>;
  numericColumnKeys: string[];
}): GroupBucketsResult {
  const {
    groupByColumnKey,
    pagedRowIndices,
    totalPageRowCount,
    getRowVal,
    colMap,
    numericColumnKeys,
  } = params;
  const count = pagedRowIndices ? pagedRowIndices.length : totalPageRowCount;
  const groupsMap = new Map<string, number[]>();

  for (let i = 0; i < count; i++) {
    const origIdx = pagedRowIndices ? pagedRowIndices[i] : i;
    const rawVal = getRowVal(origIdx, groupByColumnKey);
    const valStr =
      rawVal === '' || rawVal === null || rawVal === undefined
        ? '(Trống)'
        : String(rawVal);
    const bucket = groupsMap.get(valStr);
    if (bucket) bucket.push(origIdx);
    else groupsMap.set(valStr, [origIdx]);
  }

  const colTitle = colMap[groupByColumnKey]?.title || groupByColumnKey;
  return {
    colTitle,
    entries: Array.from(groupsMap.entries()).map(([groupValue, indices]) => {
      const sums: Record<string, number> = {};
      for (const numKey of numericColumnKeys) {
        let total = 0;
        for (let i = 0; i < indices.length; i++) {
          const v = Number(getRowVal(indices[i], numKey));
          if (Number.isFinite(v)) total += v;
        }
        sums[numKey] = total;
      }
      return { groupValue, indices, sums };
    }),
  };
}

export function buildGroupedDisplayModel(params: {
  groupBuckets: GroupBucketsResult;
  groupByColumnKey: string;
  groupSortConfig: GroupSortConfig | null;
  expandedGroupPaths: Set<string>;
  onToggleCollapse: (path: string) => void;
}): any[] {
  const {
    groupBuckets,
    groupByColumnKey,
    groupSortConfig,
    expandedGroupPaths,
    onToggleCollapse,
  } = params;
  const sortedEntries = [...groupBuckets.entries];
  if (groupSortConfig?.colKey) {
    const isAsc = groupSortConfig.direction === SORT_DIRECTIONS.ASC;
    sortedEntries.sort((a, b) => {
      const sa = a.sums[groupSortConfig.colKey] || 0;
      const sb = b.sums[groupSortConfig.colKey] || 0;
      return isAsc ? sa - sb : sb - sa;
    });
  }

  const list: any[] = [];
  sortedEntries.forEach((entry, gIdx) => {
    const path = `group_${entry.groupValue}_${gIdx}`;
    const isExpanded = expandedGroupPaths.has(path);
    list.push({
      _isGroupRow: true,
      path,
      groupColumnKey: groupByColumnKey,
      groupColumnTitle: groupBuckets.colTitle,
      groupValue: entry.groupValue,
      groupIndex: gIdx + 1,
      count: entry.indices.length,
      isExpanded,
      isCollapsed: !isExpanded,
      onToggleCollapse,
      groupSums: entry.sums,
      originalIndices: entry.indices,
    });

    if (isExpanded) {
      entry.indices.forEach((origIdx, localIdx) => {
        list.push({
          _isGroupRow: false,
          originalIndex: origIdx,
          localIndex: localIdx,
          groupIndex: gIdx + 1,
          groupPath: path,
        });
      });
    }
  });

  return list;
}

export async function copyGroupTableToClipboard<T>(params: {
  groupRow: any;
  includeHeaders?: boolean;
  orderedColumns: ColumnDef<T>[];
  hiddenColKeys: Set<string>;
  getRowVal: (origIdx: number, colKey: string) => any;
}): Promise<void> {
  const { groupRow, includeHeaders = false, orderedColumns, hiddenColKeys, getRowVal } = params;
  if (!groupRow?.originalIndices?.length) return;
  const exportCols = orderedColumns.filter(
    (c) =>
      c.dataType !== DATA_TYPES.SYSTEM &&
      !c.isRowNumber &&
      !c.isSelection &&
      !hiddenColKeys.has(c.key)
  );
  const lines = (groupRow.originalIndices as number[]).map((origIdx) =>
    exportCols
      .map((c) => {
        const v = getRowVal(origIdx, c.key);
        return v != null ? String(v) : '';
      })
      .join('\t')
  );
  const body = lines.join('\n');
  const text = includeHeaders ? `${exportCols.map((c) => c.title).join('\t')}\n${body}` : body;
  const { copyTextToClipboard } = await import('./gridClipboardUtils');
  await copyTextToClipboard(text);
}

export function computeStickyGroupIndexAtTop(params: {
  currentTop: number;
  totalRows: number;
  actualRowHeight: number;
  getRowItem: (idx: number) => any;
  getRowTop?: (idx: number) => number;
  findRowIndexAtOffset?: (offsetY: number) => number;
}): number | null {
  const { currentTop, totalRows, actualRowHeight, getRowItem, getRowTop, findRowIndexAtOffset } =
    params;
  if (totalRows <= 0 || currentTop <= 0 || actualRowHeight <= 0) return null;
  const rawIdx = findRowIndexAtOffset
    ? findRowIndexAtOffset(currentTop)
    : Math.floor(currentTop / actualRowHeight);
  const topRowIdx = Math.min(totalRows - 1, Math.max(0, rawIdx));
  const rowAtTop = getRowItem(topRowIdx) as any;
  if (!rowAtTop) return null;
  if (rowAtTop._isGroupRow) {
    const groupTop = getRowTop ? getRowTop(topRowIdx) : topRowIdx * actualRowHeight;
    if (!rowAtTop.isCollapsed && rowAtTop.count > 0 && currentTop > groupTop) {
      return topRowIdx;
    }
    return null;
  }
  if (typeof rowAtTop.localRowIndex === 'number') {
    const gIdx = topRowIdx - rowAtTop.localRowIndex - 1;
    if (gIdx >= 0 && gIdx < totalRows) {
      const gRow = getRowItem(gIdx) as any;
      if (gRow && gRow._isGroupRow && !gRow.isCollapsed) {
        return gIdx;
      }
    }
  }
  for (let k = topRowIdx - 1; k >= 0; k--) {
    const candidate = getRowItem(k) as any;
    if (candidate && candidate._isGroupRow) {
      return !candidate.isCollapsed ? k : null;
    }
  }
  return null;
}
