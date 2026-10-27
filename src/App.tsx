import React, { useState, useMemo, useCallback, useRef, useDeferredValue } from 'react';
import { MorphCheckbox } from './components/ui/MorphIcons';
import {
  VirtualizedGrid,
  VirtualizedGridRef,
  SurfaceTheme,
  PinPosition,
  SortConfig,
  GridScrollMetrics,
  CellRenderParams,
  ColumnDef,
  BaseGroupDef,
  GridEditMode,
  ColumnFilterValue,
  GroupSortConfig,
  CHECK_FILTER_STATES,
  DATA_TYPES,
  FILTER_MODES,
  SORT_DIRECTIONS,
  FORMULA_MODES,
  MONTH_ANALYTICS_MODES,
} from './components/grid';
import {
  INITIAL_COLUMNS,
  BASE_GROUPS_DEF,
  fetchGridData,
  exportGridExcelApi,
  GridRecord,
  FormulaMode,
  MonthAnalyticsMode,
  FORMULA_CYCLE,
  FORMULA_META,
  FilterState,
  DEFAULT_FILTERS,
  REGIONS,
} from './services/apiService';
import {
  matchFilterValue,
  compareGridRows,
  getRowValueForSortGeneric,
  getColumnDateBoundsFromGetter,
  isNoInputFilterOp,
} from './components/grid/gridUtils';

const DEFAULT_CHUNK_SIZE = 20;
const DEFAULT_ROW_HEIGHT = 32;
import { TwelveMonthChartCell } from './demo/TwelveMonthChartCell';
import { PageToolbar } from './demo/PageToolbar';
import { PageFooter } from './demo/PageFooter';
import { generateThemeCssVariables } from './themes';
import { QueryGroup, hasActiveQueryRules, evaluateQueryTreeNode } from './components/grid/floating';
import { copyTextToClipboard, formatGridNumber } from './components/grid/gridUtils';

const STORAGE_KEY = 'agv_mock_grid_config_v2026';

interface PersistedGridConfig {
  columnOrder?: string[];
  hiddenColKeys?: string[];
  columnPins?: Record<string, PinPosition>;
  colWidths?: Record<string, number>;
  sortConfig?: SortConfig | null;
  groupByColumnKey?: string | null;
  groupSortConfig?: GroupSortConfig | null;
}

function loadPersistedGridConfig(): PersistedGridConfig | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const cfg = JSON.parse(raw);
    if (!cfg || typeof cfg !== 'object') return null;
    return cfg;
  } catch (e) {
    return null;
  }
}

function savePersistedGridConfig(update: Partial<PersistedGridConfig>) {
  try {
    const current = loadPersistedGridConfig() || {};
    const merged = { ...current, ...update };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  } catch (e) {
    // ignore
  }
}

function clearPersistedGridConfig() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    // ignore
  }
}

export function App() {
  const themeCss = useMemo(() => generateThemeCssVariables(), []);
  const [chunkSize] = useState<number>(DEFAULT_CHUNK_SIZE);
  const [overscanChunks] = useState<number>(3);
  const [rowHeight] = useState<number>(DEFAULT_ROW_HEIGHT);
  const [antiGhostMode] = useState<boolean>(true);
  const [rowSnapMode, setRowSnapMode] = useState<boolean>(true);
  const [rowsPerWheelStep, setRowsPerWheelStep] = useState<number>(3);
  const [surfaceTheme, setSurfaceTheme] = useState<SurfaceTheme>('light');
  const [editMode, setEditMode] = useState<GridEditMode>('double-click');
  const [dataVersion, setDataVersion] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRowKey, setSelectedRowKey] = useState<number | null>(0);
  const [autoScrolling, setAutoScrolling] = useState<boolean>(false);
  const [autoScrollSpeed] = useState<number>(32);
  const [jumpRowInput, setJumpRowInput] = useState<string>('');

  // Công thức & phân tích chu kỳ năm
  const [formulaMode, setFormulaMode] = useState<FormulaMode>('AVG');
  const [monthAnalyticsMode, setMonthAnalyticsMode] = useState<MonthAnalyticsMode>('2cols');

  const handleCycleFormula = useCallback(() => {
    setFormulaMode((prev) => {
      const idx = FORMULA_CYCLE.indexOf(prev);
      const next = FORMULA_CYCLE[(idx + 1) % FORMULA_CYCLE.length];
      return next;
    });
    setDataVersion((v) => v + 1);
  }, []);

  const handleFormulaModeChange = useCallback((mode: FormulaMode) => {
    setFormulaMode(mode);
    setDataVersion((v) => v + 1);
  }, []);

  const handleToggleMonthAnalyticsMode = useCallback(() => {
    setMonthAnalyticsMode((prev) =>
      prev === MONTH_ANALYTICS_MODES.THIRTEEN_COLS
        ? MONTH_ANALYTICS_MODES.TWO_COLS
        : MONTH_ANALYTICS_MODES.THIRTEEN_COLS
    );
  }, []);

  // Persisted state from localStorage
  const persisted = useMemo(() => loadPersistedGridConfig(), []);

  // 1. Column Order State (Persisted)
  const [columnOrder, setColumnOrder] = useState<string[]>(() => {
    if (persisted?.columnOrder && Array.isArray(persisted.columnOrder) && persisted.columnOrder.length > 0) {
      return persisted.columnOrder;
    }
    return INITIAL_COLUMNS.map((c) => c.key);
  });

  // 2. Column Pins State (Persisted)
  const [columnPins, setColumnPins] = useState<Record<string, PinPosition>>(() => {
    if (persisted?.columnPins && Object.keys(persisted.columnPins).length > 0) {
      return persisted.columnPins;
    }
    return {
      col_stt: 'left',
      col_chk: 'left',
      col_id: 'left',
    };
  });

  // 3. Hidden Columns State (Persisted)
  const [hiddenColKeys, setHiddenColKeys] = useState<Set<string>>(() => {
    if (persisted?.hiddenColKeys && Array.isArray(persisted.hiddenColKeys)) {
      return new Set(persisted.hiddenColKeys);
    }
    return new Set();
  });

  // 4. Column Widths State (Persisted)
  const [colWidths, setColWidths] = useState<Record<string, number>>(() => {
    const raw = persisted?.colWidths || {};
    const { col_stt, col_chk, ...rest } = raw;
    if (rest.col_chart === 200 || rest.col_chart === 245) {
      delete rest.col_chart;
    }
    return rest;
  });

  // 5. Sort Config State (Persisted)
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(() => {
    return persisted?.sortConfig || null;
  });

  // 6. Group By Column State (Persisted)
  const [groupByColumnKey, setGroupByColumnKey] = useState<string | null>(() => {
    return persisted?.groupByColumnKey || null;
  });

  // 7. Group Sort Config State (Sắp xếp nhóm theo Tổng)
  const [groupSortConfig, setGroupSortConfig] = useState<GroupSortConfig | null>(() => {
    return persisted?.groupSortConfig || null;
  });

  const handleToggleGroupSort = useCallback((colKey: string) => {
    setGroupSortConfig((prev) => {
      let next: GroupSortConfig | null = null;
      if (!prev || prev.colKey !== colKey) {
        next = { colKey, direction: SORT_DIRECTIONS.DESC };
      } else if (prev.direction === SORT_DIRECTIONS.DESC) {
        next = { colKey, direction: SORT_DIRECTIONS.ASC };
      } else {
        next = null;
      }
      savePersistedGridConfig({ groupSortConfig: next });
      return next;
    });
  }, []);

  // Expanded group paths state (mặc định rỗng => khi gom nhóm mặc định là thu gọn tất cả)
  const [expandedGroupPaths, setExpandedGroupPaths] = useState<Set<string>>(() => new Set());

  // Checkbox row state
  const [checkedRowIndices, setCheckedRowIndices] = useState<Set<number>>(() => new Set());

  // Inline column filter row state
  const [showFilterRow, setShowFilterRow] = useState<boolean>(true);
  const [columnFilters, setColumnFilters] = useState<Record<string, ColumnFilterValue>>({});
  const deferredColumnFilters = useDeferredValue(columnFilters);

  // Query builder tree
  const [appliedQueryTree, setAppliedQueryTree] = useState<QueryGroup | null>(null);

  // Tập hợp các cột rỗng (apiData nạp đầy đủ dữ liệu nên rỗng = empty Set)
  const emptyColKeys = useMemo(() => new Set<string>(), []);

  // Ordered Columns derived from columnOrder & monthAnalyticsMode
  const orderedColumns = useMemo((): ColumnDef<GridRecord>[] => {
    const colMapObj = new Map(INITIAL_COLUMNS.map((c) => [c.key, c]));
    const res: ColumnDef<GridRecord>[] = [];
    columnOrder.forEach((key) => {
      if (monthAnalyticsMode === MONTH_ANALYTICS_MODES.THIRTEEN_COLS && key === 'col_chart') return;
      if (monthAnalyticsMode === MONTH_ANALYTICS_MODES.TWO_COLS && key.startsWith('col_m')) return;

      const col = colMapObj.get(key);
      if (col) {
        res.push(col);
        colMapObj.delete(key);
      }
    });
    colMapObj.forEach((c) => {
      if (monthAnalyticsMode === MONTH_ANALYTICS_MODES.THIRTEEN_COLS && c.key === 'col_chart') return;
      if (monthAnalyticsMode === MONTH_ANALYTICS_MODES.TWO_COLS && c.key.startsWith('col_m')) return;
      res.push(c);
    });
    return res;
  }, [columnOrder, monthAnalyticsMode]);

  // Dynamic Column Groups derived from monthAnalyticsMode
  const dynamicColumnGroups = useMemo((): BaseGroupDef[] => {
    return BASE_GROUPS_DEF.map((grp) => {
      if (grp.id === 'grp_analytics') {
        return {
          ...grp,
          isCollapsed: monthAnalyticsMode === MONTH_ANALYTICS_MODES.TWO_COLS,
          keys:
            monthAnalyticsMode === MONTH_ANALYTICS_MODES.THIRTEEN_COLS
              ? [
                  'col_m1', 'col_m2', 'col_m3', 'col_m4', 'col_m5', 'col_m6',
                  'col_m7', 'col_m8', 'col_m9', 'col_m10', 'col_m11', 'col_m12',
                  'col_formula',
                ]
              : ['col_chart', 'col_formula'],
        };
      }
      return grp;
    });
  }, [monthAnalyticsMode]);

  const handleToggleGroup = useCallback((groupId: string) => {
    if (groupId === 'grp_analytics') {
      handleToggleMonthAnalyticsMode();
    }
  }, [handleToggleMonthAnalyticsMode]);

  const colMap = useMemo(() => {
    const map: Record<string, ColumnDef<GridRecord>> = {};
    INITIAL_COLUMNS.forEach((col) => {
      map[col.key] = col;
    });
    return map;
  }, []);

  // Gọi API lấy dữ liệu Plain JSON bất đồng bộ (Async Fetch)
  const [apiData, setApiData] = useState<GridRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  React.useEffect(() => {
    let active = true;
    setIsLoading(true);
    fetchGridData(50000).then((records) => {
      if (active) {
        setApiData(records);
        setIsLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  // Grid ref
  const gridRef = useRef<VirtualizedGridRef>(null);
  const groupedDisplayModelRef = useRef<any[] | null>(null);

  const totalRowCount = apiData.length;

  // Trích xuất giá trị ô từ mảng Plain JSON API phục vụ lọc, sắp xếp, tìm kiếm
  const getRowVal = useCallback(
    (r: number, k: string): any => {
      const row = apiData[r];
      if (!row) return undefined;
      if (k === 'col_formula') {
        const mVals = [
          Number(row.col_m1) || 0,
          Number(row.col_m2) || 0,
          Number(row.col_m3) || 0,
          Number(row.col_m4) || 0,
          Number(row.col_m5) || 0,
          Number(row.col_m6) || 0,
          Number(row.col_m7) || 0,
          Number(row.col_m8) || 0,
          Number(row.col_m9) || 0,
          Number(row.col_m10) || 0,
          Number(row.col_m11) || 0,
          Number(row.col_m12) || 0,
        ];
        let sum = 0;
        let min = Infinity;
        let max = -Infinity;
        for (let m = 0; m < 12; m++) {
          const v = mVals[m];
          sum += v;
          if (v < min) min = v;
          if (v > max) max = v;
        }
        if (formulaMode === FORMULA_MODES.MIN) return min;
        if (formulaMode === FORMULA_MODES.MAX) return max;
        if (formulaMode === FORMULA_MODES.SUM) return sum;
        return Math.round((sum / 12) * 100) / 100;
      }
      return (row as any)[k];
    },
    [apiData, formulaMode]
  );

  // Metrics telemetry
  const [metrics, setMetrics] = useState<GridScrollMetrics>({
    fps: 60,
    velocity: 0,
    startChunk: 0,
    endChunk: 5,
    mountedRowCount: 0,
    totalRows: totalRowCount,
  });

  const handleScrollMetrics = useCallback((nextMetrics: GridScrollMetrics) => {
    setMetrics(nextMetrics);
  }, []);

  // Column reordering handler
  const handleReorderColumns = useCallback((sourceKey: string, targetKey: string) => {
    setColumnOrder((prevOrder) => {
      const fromIdx = prevOrder.indexOf(sourceKey);
      const toIdx = prevOrder.indexOf(targetKey);
      if (fromIdx < 0 || toIdx < 0 || fromIdx === toIdx) return prevOrder;
      const next = [...prevOrder];
      const [moved] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, moved);
      savePersistedGridConfig({ columnOrder: next });
      return next;
    });
  }, []);

  // Column pin handler (Persisted)
  const handleColumnPinsChange = useCallback((pins: Record<string, PinPosition>) => {
    setColumnPins(pins);
    savePersistedGridConfig({ columnPins: pins });
  }, []);

  // Hidden columns handler (Persisted)
  const handleHiddenColKeysChange = useCallback((hidden: Set<string>) => {
    setHiddenColKeys(hidden);
    savePersistedGridConfig({ hiddenColKeys: Array.from(hidden) });
  }, []);

  // Column widths handler (Persisted)
  const handleColWidthsChange = useCallback((widths: Record<string, number>) => {
    const { col_stt, col_chk, ...filtered } = widths;
    setColWidths(filtered);
    savePersistedGridConfig({ colWidths: filtered });
  }, []);

  // Sort handler (Persisted)
  const handleSortChange = useCallback((sort: SortConfig | null) => {
    setSortConfig(sort);
    savePersistedGridConfig({ sortConfig: sort });
  }, []);

  // Toggle Group By Column
  const handleToggleGroupByColumn = useCallback((colKey: string) => {
    setGroupByColumnKey((prev) => {
      const next = prev === colKey ? null : colKey;
      savePersistedGridConfig({ groupByColumnKey: next, groupSortConfig: null });
      return next;
    });
    setGroupSortConfig(null);
    setExpandedGroupPaths(new Set());
  }, []);

  // Toggle Collapse/Expand nhóm với Cơ chế Neo Cuộn Thông Minh
  const handleToggleGroupCollapse = useCallback((path: string) => {
    const list = groupedDisplayModelRef.current;
    const container = gridRef.current?.getScrollContainer();

    if (list && container) {
      setExpandedGroupPaths((prev) => {
        const isCurrentlyExpanded = prev.has(path);
        const next = new Set(prev);
        if (isCurrentlyExpanded) next.delete(path);
        else next.add(path);

        const groupIdx = list.findIndex(
          (it) => it && it._isGroupRow && it.path === path
        );

        if (groupIdx >= 0) {
          const groupItem = list[groupIdx];
          const rH = 32;
          const currentScrollTop = container.scrollTop;

          if (isCurrentlyExpanded) {
            const countToRemove = groupItem.count || 0;
            const heightToRemove = countToRemove * rH;
            const groupTop = groupIdx * rH;
            const groupBottom = groupTop + (1 + countToRemove) * rH;

            let newScrollTop = currentScrollTop;
            if (currentScrollTop >= groupTop && currentScrollTop < groupBottom) {
              newScrollTop = groupTop;
            } else if (currentScrollTop >= groupBottom) {
              newScrollTop = Math.max(0, currentScrollTop - heightToRemove);
            }

            if (newScrollTop !== currentScrollTop) {
              container.scrollTop = newScrollTop;
              requestAnimationFrame(() => {
                if (container) {
                  container.scrollTop = newScrollTop;
                }
              });
            }
          } else {
            const groupTop = groupIdx * rH;
            const viewportHeight = container.clientHeight;

            if (groupTop > currentScrollTop + viewportHeight - 80) {
              const targetScrollTop = Math.max(0, groupTop - Math.min(viewportHeight * 0.25, 100));
              requestAnimationFrame(() => {
                if (container) {
                  container.scrollTo({ top: targetScrollTop, behavior: 'smooth' });
                }
              });
            }
          }
        }

        return next;
      });
    } else {
      setExpandedGroupPaths((prev) => {
        const next = new Set(prev);
        if (next.has(path)) next.delete(path);
        else next.add(path);
        return next;
      });
    }
  }, []);

  // Reset columns layout
  const handleResetColumns = useCallback(() => {
    clearPersistedGridConfig();
    setColumnOrder(INITIAL_COLUMNS.map((c) => c.key));
    setColumnPins({
      col_stt: 'left',
      col_chk: 'left',
      col_id: 'left',
    });
    setHiddenColKeys(new Set());
    setColWidths({});
    setSortConfig(null);
    setGroupByColumnKey(null);
    setGroupSortConfig(null);
    setExpandedGroupPaths(new Set());
  }, []);

  // Quick filter by cell value
  const handleQuickFilter = useCallback((colKey: string, val: any) => {
    if (val !== undefined && val !== null) {
      setSearchQuery(String(val));
    }
  }, []);

  // Toggle check row
  const handleToggleCheck = useCallback(
    (rowIndex: number, row: any, e: React.MouseEvent) => {
      e.stopPropagation();
      const origIdx = row?.originalIndex !== undefined ? row.originalIndex : rowIndex;
      setCheckedRowIndices((prev) => {
        const next = new Set(prev);
        if (next.has(origIdx)) next.delete(origIdx);
        else next.add(origIdx);
        return next;
      });
    },
    []
  );

  // Select row
  const handleSelectRow = useCallback(
    (rowIndex: number, row?: any) => {
      const origIdx = row?.originalIndex !== undefined ? row.originalIndex : rowIndex;
      setSelectedRowKey(origIdx);
    },
    []
  );

  // Handle cell edit change
  const handleCellChange = useCallback(
    (rowIndex: number, row: any, colKey: string, newValue: any) => {
      const origIdx = row?.originalIndex !== undefined ? row.originalIndex : rowIndex;
      setApiData((prev) => {
        const next = [...prev];
        if (next[origIdx]) {
          const updated: any = { ...next[origIdx], [colKey]: newValue };
          if (colKey.startsWith('col_m')) {
            let sum = 0;
            for (let m = 1; m <= 12; m++) {
              sum += Number(colKey === `col_m${m}` ? newValue : updated[`col_m${m}`]) || 0;
            }
            updated.col_formula = Math.round((sum / 12) * 100) / 100;
          }
          next[origIdx] = updated;
        }
        return next;
      });
      setDataVersion((v) => v + 1);
    },
    []
  );

  // Inline column filter handlers
  const handleColumnFilterChange = useCallback((colKey: string, filter: ColumnFilterValue) => {
    setColumnFilters((prev) => {
      if (colKey === 'col_chk') {
        if (!filter.val || filter.val === CHECK_FILTER_STATES.ALL) {
          const next = { ...prev };
          delete next[colKey];
          return next;
        }
        return { ...prev, [colKey]: filter };
      }
      return { ...prev, [colKey]: filter };
    });
  }, []);

  const handleClearAllColumnFilters = useCallback(() => {
    setColumnFilters({});
  }, []);

  const handleClearAllCriteria = useCallback(() => {
    setColumnFilters({});
    setSearchQuery('');
    setSortConfig(null);
    setGroupByColumnKey(null);
    setGroupSortConfig(null);
    setAppliedQueryTree(null);
    savePersistedGridConfig({
      sortConfig: null,
      groupByColumnKey: null,
      groupSortConfig: null,
    });
  }, []);

  const activeColumnFilterCount = useMemo(() => {
    return Object.entries(columnFilters).filter(([k, f]) => {
      if (!f) return false;
      if (k === 'col_chk') return f.val === CHECK_FILTER_STATES.CHECKED || f.val === CHECK_FILTER_STATES.UNCHECKED;
      const isChecklist = Boolean(
        f.includeBlanks || (Array.isArray(f.selectedValues) && f.selectedValues.length > 0)
      );
      const isMulti =
        f.mode === FILTER_MODES.MULTI &&
        Boolean(
          (Array.isArray(f.multiValues) && f.multiValues.length > 0) ||
          (Array.isArray(f.multiRanges) && f.multiRanges.length > 0)
        );
      const isNoInput = isNoInputFilterOp(f.op);
      const hasInput = typeof f.val === 'string' && f.val.trim().length > 0;

      return isChecklist || isMulti || isNoInput || hasInput;
    }).length;
  }, [columnFilters]);

  const activeColEntries = useMemo(() => {
    return Object.entries(deferredColumnFilters).filter(([k, f]) => {
      if (!f) return false;
      if (k === 'col_chk') return f.val === CHECK_FILTER_STATES.CHECKED || f.val === CHECK_FILTER_STATES.UNCHECKED;
      const isChecklist = Boolean(
        f.includeBlanks || (Array.isArray(f.selectedValues) && f.selectedValues.length > 0)
      );
      const isMulti =
        f.mode === FILTER_MODES.MULTI &&
        Boolean(
          (Array.isArray(f.multiValues) && f.multiValues.length > 0) ||
          (Array.isArray(f.multiRanges) && f.multiRanges.length > 0)
        );
      const isNoInput = isNoInputFilterOp(f.op);
      const hasInput = typeof f.val === 'string' && f.val.trim().length > 0;

      return isChecklist || isMulti || isNoInput || hasInput;
    });
  }, [deferredColumnFilters]);

  // Filter pipeline (<5ms for 50,000 rows)
  const filteredRowIndices = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const hasSearch = q.length > 0;
    const hasColFilters = activeColEntries.length > 0;
    const hasQueryTree = hasActiveQueryRules(appliedQueryTree);

    if (!hasSearch && !hasColFilters && !hasQueryTree) return null;

    const chkFilter = deferredColumnFilters['col_chk']?.val;
    const requireChecked = chkFilter === CHECK_FILTER_STATES.CHECKED;
    const requireUnchecked = chkFilter === CHECK_FILTER_STATES.UNCHECKED;

    const colFiltersCount = activeColEntries.length;
    const total = totalRowCount;
    const matched: number[] = [];

    for (let r = 0; r < total; r++) {
      if (requireChecked && !checkedRowIndices.has(r)) continue;
      if (requireUnchecked && checkedRowIndices.has(r)) continue;

      // Check Column Filters
      if (hasColFilters) {
        let matchedCols = true;
        for (let i = 0; i < colFiltersCount; i++) {
          const [colKey, fVal] = activeColEntries[i];
          if (colKey === 'col_chk') continue;
          const colDef = colMap[colKey];
          const dataType = colDef?.dataType || 'text';
          const cellVal = getRowVal(r, colKey);
          if (!matchFilterValue(cellVal, fVal.op, fVal.val, dataType, fVal)) {
            matchedCols = false;
            break;
          }
        }
        if (!matchedCols) continue;
      }

      // Global search query
      if (hasSearch) {
        const idVal = String(getRowVal(r, 'col_id') || '').toLowerCase();
        const node = String(getRowVal(r, 'col_node') || '').toLowerCase();
        const statusVal = String(getRowVal(r, 'col_status') || '').toLowerCase();
        const region = String(getRowVal(r, 'col_region') || '').toLowerCase();

        if (!idVal.includes(q) && !node.includes(q) && !statusVal.includes(q) && !region.includes(q)) {
          continue;
        }
      }

      // Query Builder tree filter
      if (hasQueryTree) {
        if (!evaluateQueryTreeNode(appliedQueryTree, null, r, (rowIdx, k) => getRowVal(rowIdx, k))) {
          continue;
        }
      }

      matched.push(r);
    }
    return matched;
  }, [
    searchQuery,
    appliedQueryTree,
    checkedRowIndices,
    activeColEntries,
    deferredColumnFilters,
    colMap,
    totalRowCount,
    formulaMode,
  ]);

  // Cache distinct values khi không có bộ lọc để mở phễu 0ms
  const fullTableDistinctCacheRef = useRef<Record<string, { values: string[]; hasBlanks: boolean }>>({});

  const getDistinctValuesForColumn = useCallback(
    (targetColKey: string) => {
      const q = searchQuery.trim().toLowerCase();
      const hasSearch = q.length > 0;
      const hasQueryTree = hasActiveQueryRules(appliedQueryTree);

      const chkFilter = deferredColumnFilters['col_chk']?.val;
      const requireChecked = chkFilter === CHECK_FILTER_STATES.CHECKED;
      const requireUnchecked = chkFilter === CHECK_FILTER_STATES.UNCHECKED;

      const otherColEntries = activeColEntries.filter(([k]) => k !== targetColKey);
      const targetFilter = deferredColumnFilters[targetColKey];
      const hasTargetRowFilter = Boolean(
        targetFilter &&
          (targetFilter.val ||
            targetFilter.mode === FILTER_MODES.MULTI ||
            isNoInputFilterOp(targetFilter.op))
      );

      const otherCount = otherColEntries.length;
      const hasAnyOtherFilter =
        hasSearch ||
        hasQueryTree ||
        requireChecked ||
        requireUnchecked ||
        otherCount > 0 ||
        hasTargetRowFilter;

      if (!hasAnyOtherFilter && fullTableDistinctCacheRef.current[targetColKey]) {
        return fullTableDistinctCacheRef.current[targetColKey];
      }

      const set = new Set<string>();
      let hasBlanks = false;

      if (
        !hasTargetRowFilter &&
        filteredRowIndices !== null &&
        (!targetFilter?.selectedValues || targetFilter.selectedValues.length === 0)
      ) {
        const len = filteredRowIndices.length;
        for (let i = 0; i < len; i++) {
          const r = filteredRowIndices[i];
          const val = getRowVal(r, targetColKey);
          if (val === null || val === undefined || String(val).trim() === '') {
            hasBlanks = true;
          } else {
            set.add(String(val).trim());
          }
        }
      } else {
        const total = totalRowCount;
        for (let r = 0; r < total; r++) {
          if (requireChecked && !checkedRowIndices.has(r)) continue;
          if (requireUnchecked && checkedRowIndices.has(r)) continue;

          if (otherCount > 0) {
            let matchedOther = true;
            for (let i = 0; i < otherCount; i++) {
              const [colKey, fVal] = otherColEntries[i];
              if (colKey === 'col_chk') continue;
              const colDef = colMap[colKey];
              const dataType = colDef?.dataType || 'text';
              const cellVal = getRowVal(r, colKey);
              if (!matchFilterValue(cellVal, fVal.op, fVal.val, dataType, fVal)) {
                matchedOther = false;
                break;
              }
            }
            if (!matchedOther) continue;
          }

          if (hasTargetRowFilter && targetFilter) {
            const colDef = colMap[targetColKey];
            const dataType = colDef?.dataType || 'text';
            const cellVal = getRowVal(r, targetColKey);
            const rowFilterObj = {
              ...targetFilter,
              selectedValues: undefined,
              includeBlanks: undefined,
            };
            if (!matchFilterValue(cellVal, targetFilter.op, targetFilter.val, dataType, rowFilterObj)) {
              continue;
            }
          }

          if (hasSearch) {
            const idVal = String(getRowVal(r, 'col_id') || '').toLowerCase();
            const node = String(getRowVal(r, 'col_node') || '').toLowerCase();
            const statusVal = String(getRowVal(r, 'col_status') || '').toLowerCase();
            const region = String(getRowVal(r, 'col_region') || '').toLowerCase();

            if (!idVal.includes(q) && !node.includes(q) && !statusVal.includes(q) && !region.includes(q)) {
              continue;
            }
          }

          if (hasQueryTree) {
            if (!evaluateQueryTreeNode(appliedQueryTree, null, r, (rowIdx, k) => getRowVal(rowIdx, k))) {
              continue;
            }
          }

          const val = getRowVal(r, targetColKey);
          if (val === null || val === undefined || String(val).trim() === '') {
            hasBlanks = true;
          } else {
            set.add(String(val).trim());
          }
        }
      }

      const dType = colMap[targetColKey]?.dataType || DATA_TYPES.TEXT;
      const isNumber = dType === DATA_TYPES.NUMBER;
      const isDate = dType === DATA_TYPES.DATE || dType === DATA_TYPES.TIME;

      let sorted: string[];
      if (isNumber) {
        sorted = Array.from(set).sort((a, b) => {
          const na = parseFloat(String(a).replace(/,/g, ''));
          const nb = parseFloat(String(b).replace(/,/g, ''));
          return (isNaN(na) ? 0 : na) - (isNaN(nb) ? 0 : nb);
        });
      } else if (isDate) {
        sorted = Array.from(set).sort();
      } else if (typeof Intl !== 'undefined' && Intl.Collator) {
        const viCollator = new Intl.Collator('vi', { sensitivity: 'base', numeric: true });
        sorted = Array.from(set).sort((a, b) => viCollator.compare(a, b));
      } else {
        sorted = Array.from(set).sort();
      }

      const result = { values: sorted, hasBlanks };
      if (!hasAnyOtherFilter) {
        fullTableDistinctCacheRef.current[targetColKey] = result;
      }
      return result;
    },
    [
      searchQuery,
      appliedQueryTree,
      checkedRowIndices,
      activeColEntries,
      deferredColumnFilters,
      colMap,
      totalRowCount,
      filteredRowIndices,
      getRowVal,
    ]
  );

  const getColDateBounds = useCallback(
    (colKey: string) => {
      return getColumnDateBoundsFromGetter(getRowVal, totalRowCount, colKey);
    },
    [getRowVal, totalRowCount]
  );

  const hasColEmptyCells = useCallback(
    (colKey: string) => {
      const sample = Math.min(totalRowCount, 300);
      for (let i = 0; i < sample; i++) {
        const val = getRowVal(i, colKey);
        if (val === null || val === undefined || String(val).trim() === '') return true;
      }
      return false;
    },
    [getRowVal, totalRowCount]
  );

  // Sort pipeline
  const displayRowIndices = useMemo(() => {
    let base = filteredRowIndices;
    if (!sortConfig) return base;

    if (!base) {
      base = Array.from({ length: totalRowCount }, (_, i) => i);
    }

    const n = base.length;
    const sortVals = new Array(n);
    const sortByMonth = Boolean(sortConfig.sortByMonth);
    const colDef = colMap[sortConfig.key];
    const dType = colDef?.dataType || 'text';
    for (let i = 0; i < n; i++) {
      const origIdx = base[i];
      if (sortConfig.key === 'col_stt' || sortConfig.key === 'col_id') {
        sortVals[i] = origIdx + 1;
      } else if (sortConfig.key === 'col_chk') {
        sortVals[i] = checkedRowIndices.has(origIdx) ? 1 : 0;
      } else if (sortConfig.key === 'col_chunk') {
        sortVals[i] = Math.floor(origIdx / chunkSize);
      } else {
        const row = apiData[origIdx];
        sortVals[i] = getRowValueForSortGeneric(row, sortConfig.key, dType, sortByMonth, formulaMode);
      }
    }

    const order = new Int32Array(n);
    for (let i = 0; i < n; i++) order[i] = i;

    const isAsc = sortConfig.direction === SORT_DIRECTIONS.ASC;
    order.sort((a, b) => {
      const va = sortVals[a];
      const vb = sortVals[b];
      if (typeof va === 'string' && typeof vb === 'string') {
        if (va < vb) return isAsc ? -1 : 1;
        if (va > vb) return isAsc ? 1 : -1;
        return 0;
      } else {
        if (va < vb) return isAsc ? -1 : 1;
        if (va > vb) return isAsc ? 1 : -1;
      }
      return 0;
    });

    const sorted = new Array(n);
    for (let i = 0; i < n; i++) {
      sorted[i] = base[order[i]];
    }
    return sorted;
  }, [filteredRowIndices, sortConfig, totalRowCount]);

  const activeRowIndices = displayRowIndices || filteredRowIndices;
  const totalFilteredRows = activeRowIndices ? activeRowIndices.length : totalRowCount;

  // Danh sách các cột số trong apiData phục vụ tính tổng cực tốc O(N)
  const numericColKeys = useMemo(() => {
    return INITIAL_COLUMNS.filter((c) => c.dataType === DATA_TYPES.NUMBER).map((c) => c.key);
  }, []);

  // TẦNG 1: Gom nhóm & Tính tổng cực tốc
  const baseGroupData = useMemo(() => {
    const numKeys = numericColKeys;
    const numCount = numKeys.length;
    const totalSums = new Float64Array(numCount);

    const count = activeRowIndices ? activeRowIndices.length : totalRowCount;

    // Fast path: Không gom nhóm
    if (!groupByColumnKey) {
      for (let i = 0; i < count; i++) {
        const origIdx = activeRowIndices ? activeRowIndices[i] : i;
        for (let c = 0; c < numCount; c++) {
          const val = getRowVal(origIdx, numKeys[c]);
          if (typeof val === 'number') {
            totalSums[c] += val;
          }
        }
      }
      const sumsObj: Record<string, number> = {};
      for (let c = 0; c < numCount; c++) {
        sumsObj[numKeys[c]] = totalSums[c];
      }
      return { columnSums: sumsObj, groupEntries: null, colTitle: '' };
    }

    // Single-pass Grouping + Summaries
    const groupsMap = new Map<string, { indices: number[]; sums: Float64Array }>();

    for (let i = 0; i < count; i++) {
      const origIdx = activeRowIndices ? activeRowIndices[i] : i;
      const rawVal = getRowVal(origIdx, groupByColumnKey);
      const valStr = rawVal === '' || rawVal === null || rawVal === undefined ? '(Trống)' : String(rawVal);
      let gBucket = groupsMap.get(valStr);
      if (!gBucket) {
        gBucket = { indices: [], sums: new Float64Array(numCount) };
        groupsMap.set(valStr, gBucket);
      }
      gBucket.indices.push(origIdx);

      const gSums = gBucket.sums;
      for (let c = 0; c < numCount; c++) {
        const val = getRowVal(origIdx, numKeys[c]);
        if (typeof val === 'number') {
          totalSums[c] += val;
          gSums[c] += val;
        }
      }
    }

    const tableSums: Record<string, number> = {};
    for (let c = 0; c < numCount; c++) {
      tableSums[numKeys[c]] = totalSums[c];
    }

    const entries = Array.from(groupsMap.entries()).map(([groupValue, data]) => {
      const gSumsObj: Record<string, number> = {};
      for (let c = 0; c < numCount; c++) {
        gSumsObj[numKeys[c]] = data.sums[c];
      }
      return {
        groupValue,
        indices: data.indices,
        sums: gSumsObj,
      };
    });

    const colTitle = colMap[groupByColumnKey]?.title || groupByColumnKey;
    return { columnSums: tableSums, groupEntries: entries, colTitle };
  }, [groupByColumnKey, activeRowIndices, totalRowCount, numericColKeys, formulaMode, colMap]);

  const columnSums = baseGroupData.columnSums;

  // TẦNG 2: Sắp xếp các nhóm & Chiếu mô hình hiển thị phẳng ảo hóa
  const groupedDisplayModel = useMemo(() => {
    const { groupEntries, colTitle } = baseGroupData;
    if (!groupEntries || !groupByColumnKey) return null;

    let sortedEntries = [...groupEntries];
    if (groupSortConfig && groupSortConfig.colKey) {
      const targetCol = groupSortConfig.colKey;
      const isAsc = groupSortConfig.direction === SORT_DIRECTIONS.ASC;
      sortedEntries.sort((a, b) => {
        const sumA = a.sums[targetCol] || 0;
        const sumB = b.sums[targetCol] || 0;
        return isAsc ? sumA - sumB : sumB - sumA;
      });
    }

    const resultList: any[] = [];
    const expandedSet = expandedGroupPaths;

    sortedEntries.forEach((entry, gIdx) => {
      const path = `group_${entry.groupValue}_${gIdx}`;
      const isExpanded = expandedSet.has(path);
      const groupRow = {
        _isGroupRow: true,
        path,
        groupColumnKey: groupByColumnKey,
        groupColumnTitle: colTitle,
        groupValue: entry.groupValue,
        groupIndex: gIdx + 1,
        count: entry.indices.length,
        isExpanded,
        groupSums: entry.sums,
        originalIndices: entry.indices,
      };

      resultList.push(groupRow);

      if (isExpanded) {
        const childIndices = entry.indices;
        const len = childIndices.length;
        for (let j = 0; j < len; j++) {
          resultList.push({
            originalIndex: childIndices[j],
            localIndex: j,
            groupIndex: gIdx + 1,
            groupPath: path,
          });
        }
      }
    });

    groupedDisplayModelRef.current = resultList;
    return resultList;
  }, [baseGroupData, groupByColumnKey, groupSortConfig, expandedGroupPaths]);

  const handleCollapseAllGroups = useCallback(() => {
    setExpandedGroupPaths(new Set());
  }, []);

  const handleExpandAllGroups = useCallback(() => {
    if (!baseGroupData.groupEntries) return;
    const allPaths = new Set<string>();
    baseGroupData.groupEntries.forEach((entry, gIdx) => {
      allPaths.add(`group_${entry.groupValue}_${gIdx}`);
    });
    setExpandedGroupPaths(allPaths);
  }, [baseGroupData]);

  const handleUngroup = useCallback(() => {
    setGroupByColumnKey(null);
    setGroupSortConfig(null);
    setExpandedGroupPaths(new Set());
    savePersistedGridConfig({ groupByColumnKey: null, groupSortConfig: null });
  }, []);

  const handleCopyGroupTable = useCallback(
    (groupRow: any, includeHeaders: boolean = false) => {
      if (!groupRow || !groupRow.originalIndices) return;
      const indices: number[] = groupRow.originalIndices;
      if (indices.length === 0) return;

      const hiddenSet = new Set(hiddenColKeys);
      const dataCols = orderedColumns.filter(
        (c: ColumnDef<GridRecord>) => c.key !== 'col_stt' && c.key !== 'col_chk' && c.key !== 'col_chart' && !hiddenSet.has(c.key)
      );

      const lines: string[] = [];
      indices.forEach((idx: number) => {
        const rowVals = dataCols.map((col: ColumnDef<GridRecord>) => {
          const v = getRowVal(idx, col.key);
          return v !== undefined && v !== null ? String(v) : '';
        });
        lines.push(rowVals.join('\t'));
      });

      let text = lines.join('\n');
      if (includeHeaders) {
        const headers = dataCols.map((col: ColumnDef<GridRecord>) => col.title || col.key).join('\t');
        text = `${headers}\n${text}`;
      }

      copyTextToClipboard(text);
    },
    [orderedColumns, hiddenColKeys, getRowVal]
  );

  const handleExportGroupExcel = useCallback(
    (groupRow: any) => {
      if (!groupRow || !groupRow.originalIndices) return;
      const indices: number[] = groupRow.originalIndices;
      if (indices.length === 0) return;

      const hiddenSet = new Set(hiddenColKeys);
      const dataCols = orderedColumns.filter(
        (c: ColumnDef<GridRecord>) => c.key !== 'col_stt' && c.key !== 'col_chk' && c.key !== 'col_chart' && !hiddenSet.has(c.key)
      );
      const safeVal = String(groupRow.groupValue || 'Nhom').replace(/[/\\?%*:|"<>]/g, '_');

      exportGridExcelApi({
        scope: 'group',
        filename: `Bang_${safeVal}_${Date.now()}`,
        groupKey: groupRow.groupColumnKey,
        groupValue: groupRow.groupValue,
        columns: dataCols,
        groupsDef: dynamicColumnGroups,
        records: apiData,
        rowIndices: indices,
        groupedData: [
          groupRow,
          ...indices.map((idx) => ({ originalIndex: idx })),
        ],
        getRowVal,
      });
    },
    [orderedColumns, hiddenColKeys, apiData, dynamicColumnGroups, getRowVal]
  );

  const handleExportAllExcel = useCallback(() => {
    const hiddenSet = new Set(hiddenColKeys);
    const dataCols = orderedColumns.filter(
      (c: ColumnDef<GridRecord>) => c.key !== 'col_stt' && c.key !== 'col_chk' && c.key !== 'col_chart' && !hiddenSet.has(c.key)
    );
    const indices = activeRowIndices || Array.from({ length: totalRowCount }, (_, i) => i);

    exportGridExcelApi({
      scope: 'all',
      filename: `DanhSach_HaTang_${Date.now()}`,
      columns: dataCols,
      groupsDef: dynamicColumnGroups,
      records: apiData,
      rowIndices: indices,
      groupedData: groupByColumnKey ? groupedDisplayModel : null,
      getRowVal,
      filters: columnFilters,
      searchQuery,
    });
  }, [
    orderedColumns,
    hiddenColKeys,
    activeRowIndices,
    totalRowCount,
    apiData,
    dynamicColumnGroups,
    groupByColumnKey,
    groupedDisplayModel,
    getRowVal,
    columnFilters,
    searchQuery,
  ]);

  const totalVirtualRowCount = groupedDisplayModel ? groupedDisplayModel.length : totalFilteredRows;

  // Row getter function for VirtualizedGrid (Đọc trực tiếp từ mảng Plain JSON API)
  const getRow = useCallback(
    (index: number): any => {
      if (groupedDisplayModel) {
        const item = groupedDisplayModel[index];
        if (item && item._isGroupRow) {
          return item;
        }
        const originalRowIdx = typeof item === 'object' && item.originalIndex !== undefined ? item.originalIndex : item;
        const localIndex = typeof item === 'object' && item.localIndex !== undefined ? item.localIndex : index;
        const groupIndex = typeof item === 'object' ? item.groupIndex : undefined;
        const baseRecord = apiData[originalRowIdx];
        if (!baseRecord) return null;
        return {
          ...baseRecord,
          rowIndex: index,
          originalIndex: originalRowIdx,
          localRowIndex: localIndex,
          groupIndex,
          col_stt: localIndex + 1,
          col_chk: checkedRowIndices.has(originalRowIdx),
          col_chunk: `C#${String(Math.floor(localIndex / chunkSize)).padStart(4, '0')}`,
        };
      }
      const originalRowIdx = activeRowIndices ? activeRowIndices[index] : index;
      const baseRecord = apiData[originalRowIdx];
      if (!baseRecord) return null;
      return {
        ...baseRecord,
        rowIndex: index,
        originalIndex: originalRowIdx,
        col_stt: index + 1,
        col_chk: checkedRowIndices.has(originalRowIdx),
        col_chunk: `C#${String(Math.floor(index / chunkSize)).padStart(4, '0')}`,
      };
    },
    [groupedDisplayModel, activeRowIndices, checkedRowIndices, chunkSize, apiData]
  );

  // Custom Cell Renderer (Tương thích 100% Plain JSON API Objects)
  const renderCell = useCallback(
    ({ column, row }: CellRenderParams<any>) => {
      if (!row) return null;

      // 1. Cột STT
      if (column.key === 'col_stt') {
        const sttVal = row.localRowIndex !== undefined ? row.localRowIndex + 1 : row.rowIndex + 1;
        return (
          <span
            className="text-xs font-semibold text-center w-full"
            style={{ color: 'var(--agv-text-muted)' }}
          >
            {sttVal}
          </span>
        );
      }

      // 2. Cột Checkbox
      if (column.key === 'col_chk') {
        return (
          <div className="flex items-center justify-center w-full h-full border-none bg-transparent">
            <MorphCheckbox
              checked={checkedRowIndices.has(row.originalIndex)}
              onChange={(e) => handleToggleCheck(row.rowIndex, row, e)}
              size={16}
              spring="bouncy"
            />
          </div>
        );
      }

      // Trích xuất số liệu 12 tháng phục vụ Biểu đồ & Công thức
      const mVals = [
        Number(row.col_m1) || 0,
        Number(row.col_m2) || 0,
        Number(row.col_m3) || 0,
        Number(row.col_m4) || 0,
        Number(row.col_m5) || 0,
        Number(row.col_m6) || 0,
        Number(row.col_m7) || 0,
        Number(row.col_m8) || 0,
        Number(row.col_m9) || 0,
        Number(row.col_m10) || 0,
        Number(row.col_m11) || 0,
        Number(row.col_m12) || 0,
      ];
      let minVal = Infinity;
      let maxVal = -Infinity;
      let minIdx = 0;
      let maxIdx = 0;
      let sumVal = 0;
      for (let m = 0; m < 12; m++) {
        const v = mVals[m];
        sumVal += v;
        if (v < minVal) {
          minVal = v;
          minIdx = m;
        }
        if (v > maxVal) {
          maxVal = v;
          maxIdx = m;
        }
      }
      const avgVal = Math.round((sumVal / 12) * 100) / 100;

      // 3. Cột Biểu đồ 12 Tháng (Catmull-Rom SVG Sparkline)
      if (column.key === 'col_chart') {
        const chartColWidth = colWidths['col_chart'] || column.defaultWidth || 150;
        return (
          <TwelveMonthChartCell
            values={mVals}
            minIdx={minIdx}
            maxIdx={maxIdx}
            minVal={minVal}
            maxVal={maxVal}
            avgVal={avgVal}
            surfaceTheme={surfaceTheme}
            width={chartColWidth}
          />
        );
      }

      // 4. Cột Công thức 12 Tháng
      if (column.key === 'col_formula') {
        if (formulaMode === FORMULA_MODES.MIN || formulaMode === FORMULA_MODES.MAX) {
          const monthIdx = formulaMode === FORMULA_MODES.MIN ? minIdx : maxIdx;
          const monthVal = formulaMode === FORMULA_MODES.MIN ? minVal : maxVal;
          const monthText = `T${monthIdx + 1}`;
          const formattedVal = formatGridNumber(monthVal, 1);

          return (
            <div className="flex items-center justify-between w-full font-medium tabular-nums text-xs px-1">
              <span
                className="text-[11px] font-semibold tracking-tight"
                style={{ color: 'var(--agv-text-muted)' }}
              >
                {monthText}
              </span>
              <span className="font-semibold text-right" style={{ color: 'var(--agv-text-main)' }}>
                {formattedVal}
              </span>
            </div>
          );
        }

        // Khi AVG hoặc SUM: Chỉ hiển thị con số căn phải, không thẻ badge
        let formulaDisplayVal = '';
        if (formulaMode === FORMULA_MODES.AVG) formulaDisplayVal = formatGridNumber(avgVal, 2);
        else if (formulaMode === FORMULA_MODES.SUM) formulaDisplayVal = formatGridNumber(sumVal, 1);

        return (
          <div className="flex items-center justify-end w-full font-semibold tabular-nums text-xs px-1">
            <span style={{ color: 'var(--agv-text-main)' }}>{formulaDisplayVal}</span>
          </div>
        );
      }

      // 5. Cột các Tháng (col_m1 -> col_m12)
      if (column.key.startsWith('col_m')) {
        const mIdx = parseInt(column.key.replace('col_m', ''), 10) - 1;
        const val = mVals[mIdx];
        const isMax = mIdx === maxIdx;
        const isMin = mIdx === minIdx;
        return (
          <span
            className={`text-xs tabular-nums ${
              isMax
                ? 'text-emerald-500 font-bold'
                : isMin
                ? 'text-rose-500 font-bold'
                : ''
            }`}
          >
            {formatGridNumber(val)}
          </span>
        );
      }

      // 6. Các cột số khác
      if (column.dataType === DATA_TYPES.NUMBER) {
        const val = (row as any)[column.key];
        const formatted = formatGridNumber(val);
        return <span className="text-xs font-medium tabular-nums">{formatted || '0'}</span>;
      }

      // 7. Cột Text mặc định (tự động áp dụng column.className nếu được cấu hình)
      const rawVal = (row as any)[column.key] !== undefined ? (row as any)[column.key] : '';
      return (
        <span className={`text-xs truncate ${column.className || ''}`.trim()}>
          {String(rawVal)}
        </span>
      );
    },
    [checkedRowIndices, handleToggleCheck, formulaMode, surfaceTheme, colWidths]
  );

  const jumpToRowNumber = useCallback(
    (rowNumberOneBased: number) => {
      const clampedIdx = Math.max(0, Math.min(totalVirtualRowCount - 1, rowNumberOneBased - 1));
      gridRef.current?.scrollToRow(clampedIdx);
      if (groupedDisplayModel) {
        const item = groupedDisplayModel[clampedIdx];
        if (item && !item._isGroupRow) {
          const origIdx = typeof item === 'object' && item.originalIndex !== undefined ? item.originalIndex : item;
          setSelectedRowKey(origIdx);
        }
      } else if (activeRowIndices) {
        setSelectedRowKey(activeRowIndices[clampedIdx]);
      } else {
        setSelectedRowKey(clampedIdx);
      }
    },
    [totalVirtualRowCount, groupedDisplayModel, activeRowIndices]
  );

  const leftPinnedCount = useMemo(() => {
    return Object.values(columnPins).filter((p) => p === 'left').length;
  }, [columnPins]);

  const centerPinnedCount = useMemo(() => {
    return Object.values(columnPins).filter((p) => p === 'center').length;
  }, [columnPins]);

  const rightPinnedCount = useMemo(() => {
    return Object.values(columnPins).filter((p) => p === 'right').length;
  }, [columnPins]);

  const selectedDisplayIndex = useMemo(() => {
    if (selectedRowKey === null) return undefined;
    if (groupedDisplayModel) {
      const idx = groupedDisplayModel.findIndex(
        (it) => it && !it._isGroupRow && (it.originalIndex === selectedRowKey || it === selectedRowKey)
      );
      return idx >= 0 ? idx : undefined;
    }
    if (activeRowIndices) {
      const idx = activeRowIndices.indexOf(selectedRowKey);
      return idx >= 0 ? idx : undefined;
    }
    return selectedRowKey < totalRowCount ? selectedRowKey : undefined;
  }, [selectedRowKey, groupedDisplayModel, activeRowIndices, totalRowCount]);

  const computedSortTitle = useMemo(() => {
    if (!sortConfig) return undefined;
    const baseTitle = colMap[sortConfig.key]?.title || sortConfig.key;
    if (sortConfig.key === 'col_formula' && sortConfig.sortByMonth) {
      return `${baseTitle} (Theo tháng)`;
    }
    return baseTitle;
  }, [sortConfig, colMap]);

  return (
    <div
      className="w-screen h-screen flex flex-col overflow-hidden select-none"
      style={{
        backgroundColor: 'var(--agv-bg-root)',
        color: 'var(--agv-text-main)',
        WebkitFontSmoothing:
          surfaceTheme === 'e-ink' || surfaceTheme === 'eink'
            ? 'subpixel-antialiased'
            : 'antialiased',
        MozOsxFontSmoothing:
          surfaceTheme === 'e-ink' || surfaceTheme === 'eink'
            ? 'subpixel-antialiased'
            : 'grayscale',
      }}
    >
      <style>{themeCss}</style>

      {/* 1. Page Header Toolbar */}
      <PageToolbar
        editMode={editMode}
        onEditModeChange={setEditMode}
        monthAnalyticsMode={monthAnalyticsMode}
        onToggleMonthAnalyticsMode={handleToggleMonthAnalyticsMode}
        formulaMode={formulaMode}
        onCycleFormula={handleCycleFormula}
        sortConfig={sortConfig}
        sortTitle={computedSortTitle}
        onClearSort={() => handleSortChange(null)}
        fps={metrics.fps}
        startChunkIndex={metrics.startChunk}
        endChunkIndex={metrics.endChunk}
        mountedRowCount={metrics.mountedRowCount}
        totalFilteredRows={totalFilteredRows}
        scrollVelocity={metrics.velocity}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeFilterCount={0}
        onOpenFilters={() => {}}
        showFilterRow={showFilterRow}
        onToggleFilterRow={() => setShowFilterRow((prev) => !prev)}
        activeColumnFilterCount={activeColumnFilterCount}
        jumpRowInput={jumpRowInput}
        onJumpRowInputChange={setJumpRowInput}
        onJumpToRowSubmit={() => {
          const num = parseInt(jumpRowInput, 10);
          if (!Number.isNaN(num)) jumpToRowNumber(num);
        }}
        surfaceTheme={surfaceTheme}
        onThemeChange={setSurfaceTheme}
        rowSnapMode={rowSnapMode}
        onToggleRowSnap={() => setRowSnapMode((prev) => !prev)}
        rowsPerWheelStep={rowsPerWheelStep}
        onRowsPerWheelStepChange={setRowsPerWheelStep}
        autoScrolling={autoScrolling}
        onToggleAutoScroll={() => setAutoScrolling((prev) => !prev)}
      />

      {/* 2. Main Viewport: Reusable VirtualizedGrid (2-Tier Header, LocalStorage Persisted) */}
      <div className="flex-1 flex min-h-0 relative">
        <VirtualizedGrid
          ref={gridRef}
          dataVersion={dataVersion}
          rowCount={totalVirtualRowCount}
          getRow={getRow}
          columns={orderedColumns}
          columnGroups={dynamicColumnGroups}
          onToggleGroup={handleToggleGroup}
          columnPins={columnPins}
          onColumnPinsChange={handleColumnPinsChange}
          colWidths={colWidths}
          onColWidthsChange={handleColWidthsChange}
          hiddenColKeys={hiddenColKeys}
          onHiddenColKeysChange={handleHiddenColKeysChange}
          onReorderColumns={handleReorderColumns}
          onResetColumns={handleResetColumns}
          sortConfig={sortConfig}
          onSortChange={handleSortChange}
          groupByColumnKey={groupByColumnKey}
          onToggleGroupByColumn={handleToggleGroupByColumn}
          groupSortConfig={groupSortConfig}
          onToggleGroupSort={handleToggleGroupSort}
          emptyColKeys={emptyColKeys}
          onCollapseAllGroups={handleCollapseAllGroups}
          onExpandAllGroups={handleExpandAllGroups}
          onUngroup={handleUngroup}
          formulaMode={formulaMode}
          onFormulaModeChange={handleFormulaModeChange}
          onCopyGroupTable={handleCopyGroupTable}
          onExportGroupExcel={handleExportGroupExcel}
          onExportExcel={handleExportAllExcel}
          selectedRowIndex={selectedDisplayIndex}
          selectedRowKey={selectedRowKey}
          onSelectRow={handleSelectRow}
          checkedRowIndices={checkedRowIndices}
          onToggleCheck={handleToggleCheck}
          getRowId={(row) => ((row as any)?._isGroupRow ? (row as any).path : (row.originalIndex ?? row.id))}
          renderCell={renderCell}
          chunkSize={chunkSize}
          rowHeight={rowHeight}
          overscanChunks={overscanChunks}
          antiGhostMode={antiGhostMode}
          surfaceTheme={surfaceTheme}
          rowSnapMode={rowSnapMode}
          rowsPerWheelStep={rowsPerWheelStep}
          autoScrolling={autoScrolling}
          autoScrollSpeed={autoScrollSpeed}
          onScrollMetrics={handleScrollMetrics}
          onQuickFilter={handleQuickFilter}
          showFilterRow={showFilterRow}
          columnFilters={columnFilters}
          onColumnFilterChange={handleColumnFilterChange}
          onClearAllColumnFilters={handleClearAllColumnFilters}
          onClearAllCriteria={handleClearAllCriteria}
          hasColumnEmptyCells={hasColEmptyCells}
          getColumnDateBounds={getColDateBounds}
          getCellValue={getRowVal}
          getDistinctValues={getDistinctValuesForColumn}
          matchFilterValue={matchFilterValue as any}
          columnSums={columnSums}
          quickFilterText={searchQuery}
          onQuickFilterTextChange={setSearchQuery}
          appliedQueryTree={appliedQueryTree}
          onApplyQueryTree={setAppliedQueryTree}
          editMode={editMode}
          onCellChange={handleCellChange}
        />
      </div>

      {/* 3. Page Footer Status Bar (Tích hợp Bộ Đếm Nhóm và Dòng chuẩn Toolbar3) */}
      <PageFooter
        totalRows={totalFilteredRows}
        columnCount={orderedColumns.length}
        leftPinnedCount={leftPinnedCount}
        centerPinnedCount={centerPinnedCount}
        rightPinnedCount={rightPinnedCount}
        sortConfig={sortConfig}
        sortTitle={computedSortTitle}
        visibleChunkCount={Math.max(0, metrics.endChunk - metrics.startChunk + 1)}
        groupByColumnKey={groupByColumnKey}
        groupTitle={groupByColumnKey ? (colMap[groupByColumnKey]?.title || groupByColumnKey) : undefined}
        totalGroupCount={baseGroupData.groupEntries ? baseGroupData.groupEntries.length : 0}
        expandedGroupCount={expandedGroupPaths.size}
        displayedRowCount={groupedDisplayModel ? groupedDisplayModel.length : undefined}
      />
    </div>
  );
}

export default App;
