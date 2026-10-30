import React, { useState, useMemo, useCallback, useRef, useDeferredValue, useEffect } from 'react';
import { MorphCheckbox } from './components/ui/MorphIcons';
import {
  VirtualizedGrid,
  VirtualizedGridRef,
  SurfaceTheme,
  SURFACE_THEMES,
  PinPosition,
  PIN_POSITIONS,
  SortConfig,
  GridScrollMetrics,
  CellRenderParams,
  ColumnDef,
  BaseGroupDef,
  GridEditMode,
  GRID_EDIT_MODES,
  ColumnFilterValue,
  GroupSortConfig,
  CHECK_FILTER_STATES,
  DATA_TYPES,
  FILTER_MODES,
  SORT_DIRECTIONS,
  FORMULA_MODES,
  MONTH_ANALYTICS_MODES,
  DEFAULT_CHUNK_SIZE,
  DEFAULT_ROW_HEIGHT,
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
  createEqualsFilter,
} from './components/grid/gridUtils';
import { TwelveMonthChartCell } from './demo/TwelveMonthChartCell';
import { PageToolbar } from './demo/PageToolbar';
import { PageFooter } from './demo/PageFooter';
import { AdvCustomCssModal } from './demo/AdvCustomCssModal';
import {
  generateThemeCssVariables,
  getThemeClass,
  generateCustomThemeCssBlock,
  DEFAULT_TEST_CSS_SNIPPET,
} from './themes';
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
  surfaceTheme?: SurfaceTheme;
  rowSnapMode?: boolean;
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
  const [rowsPerWheelStep] = useState<number>(3);
  // Persisted state from localStorage
  const persisted = useMemo(() => loadPersistedGridConfig(), []);

  const [rowSnapMode, setRowSnapMode] = useState<boolean>(() => {
    return persisted?.rowSnapMode !== undefined ? persisted.rowSnapMode : true;
  });

  const handleRowSnapModeChange = useCallback((enabled: boolean) => {
    setRowSnapMode(enabled);
    savePersistedGridConfig({ rowSnapMode: enabled });
  }, []);

  const [surfaceTheme, setSurfaceTheme] = useState<SurfaceTheme>(() => {
    return persisted?.surfaceTheme || SURFACE_THEMES.LIGHT;
  });

  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('agv_color_scheme');
    if (saved) return saved === 'dark';
    return (persisted?.surfaceTheme || SURFACE_THEMES.LIGHT) === SURFACE_THEMES.DARK;
  });

  const handleToggleColorScheme = useCallback((dark: boolean) => {
    setIsDark(dark);
    localStorage.setItem('agv_color_scheme', dark ? 'dark' : 'light');
  }, []);

  const handleSurfaceThemeChange = useCallback((nextTheme: SurfaceTheme) => {
    setSurfaceTheme(nextTheme);
    savePersistedGridConfig({ surfaceTheme: nextTheme });
    if (nextTheme === SURFACE_THEMES.DARK || nextTheme === 'dark' || nextTheme === 'calibrated-dark') {
      setIsDark(true);
      localStorage.setItem('agv_color_scheme', 'dark');
    } else if (nextTheme === SURFACE_THEMES.LIGHT || nextTheme === 'light') {
      setIsDark(false);
      localStorage.setItem('agv_color_scheme', 'light');
    }
  }, []);

  const [isCustomCssModalOpen, setIsCustomCssModalOpen] = useState<boolean>(false);
  const [customCssCode, setCustomCssCode] = useState<string>(() => {
    return localStorage.getItem('agv_custom_test_css') || DEFAULT_TEST_CSS_SNIPPET;
  });

  const customCssStyleBlock = useMemo(() => {
    if (!customCssCode) return '';
    return generateCustomThemeCssBlock(customCssCode);
  }, [customCssCode]);

  const handleApplyCustomCss = useCallback((code: string) => {
    setCustomCssCode(code);
    setSurfaceTheme('custom' as SurfaceTheme);
    savePersistedGridConfig({ surfaceTheme: 'custom' as SurfaceTheme });
  }, []);

  // Đồng bộ class Theme và Dark Mode lên document.documentElement để mọi Portal (render vào body) tự động hưởng 100% theme
  useEffect(() => {
    const themeClass = getThemeClass(surfaceTheme);
    const rootEl = document.documentElement;
    rootEl.classList.remove('agv-light', 'agv-dark', 'agv-bezier-arthouse', 'agv-e-ink', 'theme-eink', 'agv-theme-custom');
    const tokens = themeClass.split(' ').filter(Boolean);
    tokens.forEach((t) => rootEl.classList.add(t));
    if (isDark) {
      rootEl.classList.add('dark');
    } else {
      rootEl.classList.remove('dark');
    }
  }, [surfaceTheme, isDark]);

  const [editMode, setEditMode] = useState<GridEditMode>(GRID_EDIT_MODES.DOUBLE_CLICK);
  const [dataVersion, setDataVersion] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const [selectedRowKey, setSelectedRowKey] = useState<number | null>(0);
  const [autoScrolling, setAutoScrolling] = useState<boolean>(false);
  const [autoScrollSpeed] = useState<number>(32);
  const [jumpRowInput, setJumpRowInput] = useState<string>('');

  // Công thức & phân tích chu kỳ năm
  const [formulaMode, setFormulaMode] = useState<FormulaMode>(FORMULA_MODES.AVG);
  const [monthAnalyticsMode, setMonthAnalyticsMode] = useState<MonthAnalyticsMode>(MONTH_ANALYTICS_MODES.TWO_COLS);

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

  // 1. Column Order State (Persisted)
  const [columnOrder, setColumnOrder] = useState<string[]>(() => {
    const allKeys = INITIAL_COLUMNS.map((c) => c.key);
    if (persisted?.columnOrder && Array.isArray(persisted.columnOrder) && persisted.columnOrder.length > 0) {
      const validPersisted = persisted.columnOrder.filter((k) => allKeys.includes(k));
      const missingKeys = allKeys.filter((k) => !validPersisted.includes(k));
      return [...validPersisted, ...missingKeys];
    }
    return allKeys;
  });

  // 2. Column Pins State (Persisted)
  const [columnPins, setColumnPins] = useState<Record<string, PinPosition>>(() => {
    if (persisted?.columnPins && Object.keys(persisted.columnPins).length > 0) {
      return persisted.columnPins;
    }
    return {
      col_stt: PIN_POSITIONS.LEFT,
      col_chk: PIN_POSITIONS.LEFT,
      col_id: PIN_POSITIONS.LEFT,
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

  // Dynamic Column Groups derived from monthAnalyticsMode & columnOrder
  const dynamicColumnGroups = useMemo((): BaseGroupDef[] => {
    const orderMap = new Map<string, number>();
    columnOrder.forEach((k, idx) => orderMap.set(k, idx));

    const groupsWithSortedKeys = BASE_GROUPS_DEF.map((grp) => {
      let baseKeys = grp.keys;
      if (grp.id === 'grp_analytics') {
        baseKeys =
          monthAnalyticsMode === MONTH_ANALYTICS_MODES.THIRTEEN_COLS
            ? [
                'col_m1', 'col_m2', 'col_m3', 'col_m4', 'col_m5', 'col_m6',
                'col_m7', 'col_m8', 'col_m9', 'col_m10', 'col_m11', 'col_m12',
                'col_formula',
              ]
            : ['col_chart', 'col_formula'];
      }
      const sortedKeys = [...baseKeys].sort(
        (a, b) => (orderMap.get(a) ?? 999999) - (orderMap.get(b) ?? 999999)
      );
      return {
        ...grp,
        ...(grp.id === 'grp_analytics'
          ? { isCollapsed: monthAnalyticsMode === MONTH_ANALYTICS_MODES.TWO_COLS }
          : {}),
        keys: sortedKeys,
      };
    });

    return groupsWithSortedKeys.sort((a, b) => {
      const minA = Math.min(...a.keys.map((k) => orderMap.get(k) ?? 999999));
      const minB = Math.min(...b.keys.map((k) => orderMap.get(k) ?? 999999));
      return minA - minB;
    });
  }, [monthAnalyticsMode, columnOrder]);

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

  // Bộ đệm WeakMap lưu thống kê 12 tháng gắn trực tiếp theo baseRecord gốc (apiData[r])
  // Giúp tái sử dụng O(1) xuyên suốt cả getRowVal (lọc/tính tổng 50.000 dòng) lẫn renderCell mà không cấp phát mảng tạm lặp lại
  const monthStatsCacheRef = useRef(
    new WeakMap<
      object,
      {
        mVals: number[];
        minVal: number;
        maxVal: number;
        minIdx: number;
        maxIdx: number;
        sumVal: number;
        avgVal: number;
      }
    >()
  );

  const getOrComputeMonthStats = useCallback((recordObj: any) => {
    let stats = monthStatsCacheRef.current.get(recordObj);
    if (!stats) {
      const mVals = [
        Number(recordObj.col_m1) || 0,
        Number(recordObj.col_m2) || 0,
        Number(recordObj.col_m3) || 0,
        Number(recordObj.col_m4) || 0,
        Number(recordObj.col_m5) || 0,
        Number(recordObj.col_m6) || 0,
        Number(recordObj.col_m7) || 0,
        Number(recordObj.col_m8) || 0,
        Number(recordObj.col_m9) || 0,
        Number(recordObj.col_m10) || 0,
        Number(recordObj.col_m11) || 0,
        Number(recordObj.col_m12) || 0,
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
      stats = { mVals, minVal, maxVal, minIdx, maxIdx, sumVal, avgVal };
      monthStatsCacheRef.current.set(recordObj, stats);
    }
    return stats;
  }, []);

  // Trích xuất giá trị ô từ mảng Plain JSON API phục vụ lọc, sắp xếp, tìm kiếm
  const getRowVal = useCallback(
    (r: number, k: string): any => {
      const row = apiData[r];
      if (!row) return undefined;
      if (k === 'col_formula') {
        const stats = getOrComputeMonthStats(row);
        if (formulaMode === FORMULA_MODES.MIN) return stats.minVal;
        if (formulaMode === FORMULA_MODES.MAX) return stats.maxVal;
        if (formulaMode === FORMULA_MODES.SUM) return stats.sumVal;
        return stats.avgVal;
      }
      return (row as any)[k];
    },
    [apiData, formulaMode, getOrComputeMonthStats]
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

  // Column reordering handler (hỗ trợ kéo thả cột đơn, cột con trong nhóm 2 tầng, và cả nhóm cột Band/Atomic)
  const handleReorderColumns = useCallback((sourceKey: string, targetKey: string) => {
    if (!sourceKey || !targetKey || sourceKey === targetKey) return;

    const getGroupMemberKeys = (grp: BaseGroupDef): string[] => {
      if (grp.id === 'grp_analytics') {
        return [
          'col_m1', 'col_m2', 'col_m3', 'col_m4', 'col_m5', 'col_m6',
          'col_m7', 'col_m8', 'col_m9', 'col_m10', 'col_m11', 'col_m12',
          'col_chart', 'col_formula',
        ];
      }
      return grp.keys;
    };

    const resolveGroupInfo = (keyOrId: string) => {
      const byId = BASE_GROUPS_DEF.find((g) => g.id === keyOrId);
      if (byId) {
        return {
          groupId: byId.id,
          isWholeGroup: true,
          memberKeys: getGroupMemberKeys(byId),
        };
      }
      const byMember = BASE_GROUPS_DEF.find((g) => getGroupMemberKeys(g).includes(keyOrId));
      if (byMember) {
        return {
          groupId: byMember.id,
          isWholeGroup: false,
          memberKeys: getGroupMemberKeys(byMember),
        };
      }
      return {
        groupId: keyOrId,
        isWholeGroup: false,
        memberKeys: [keyOrId],
      };
    };

    const srcInfo = resolveGroupInfo(sourceKey);
    const tgtInfo = resolveGroupInfo(targetKey);

    // Nếu kéo thả nhóm cha đè lên chính cột con của nó (hoặc ngược lại) thì bỏ qua
    if (srcInfo.groupId === tgtInfo.groupId && (srcInfo.isWholeGroup || tgtInfo.isWholeGroup)) {
      return;
    }

    setColumnOrder((prevOrder) => {
      // Trường hợp 1: Kéo thả 2 cột con nằm trong cùng 1 nhóm Band
      if (srcInfo.groupId === tgtInfo.groupId) {
        const fromIdx = prevOrder.indexOf(sourceKey);
        const toIdx = prevOrder.indexOf(targetKey);
        if (fromIdx < 0 || toIdx < 0 || fromIdx === toIdx) return prevOrder;
        const next = [...prevOrder];
        const [moved] = next.splice(fromIdx, 1);
        next.splice(toIdx, 0, moved);
        savePersistedGridConfig({ columnOrder: next });
        return next;
      }

      // Trường hợp 2: Kéo thả giữa các cột độc lập hoặc các nhóm Band cấp 1
      const srcSet = new Set(srcInfo.memberKeys);
      const tgtSet = new Set(tgtInfo.memberKeys);
      const srcBlock = prevOrder.filter((k) => srcSet.has(k));
      const tgtBlock = prevOrder.filter((k) => tgtSet.has(k));
      if (srcBlock.length === 0 || tgtBlock.length === 0) return prevOrder;

      const srcFirstIdx = prevOrder.indexOf(srcBlock[0]);
      const tgtFirstIdx = prevOrder.indexOf(tgtBlock[0]);
      if (srcFirstIdx < 0 || tgtFirstIdx < 0 || srcFirstIdx === tgtFirstIdx) return prevOrder;

      const remaining = prevOrder.filter((k) => !srcSet.has(k));
      if (srcFirstIdx < tgtFirstIdx) {
        const lastTgtKey = tgtBlock[tgtBlock.length - 1];
        const insertAfterIdx = remaining.indexOf(lastTgtKey);
        if (insertAfterIdx < 0) return prevOrder;
        remaining.splice(insertAfterIdx + 1, 0, ...srcBlock);
      } else {
        const firstTgtKey = tgtBlock[0];
        const insertBeforeIdx = remaining.indexOf(firstTgtKey);
        if (insertBeforeIdx < 0) return prevOrder;
        remaining.splice(insertBeforeIdx, 0, ...srcBlock);
      }

      savePersistedGridConfig({ columnOrder: remaining });
      return remaining;
    });

    // Đồng bộ vùng ghim (Left / Middle / Right) nếu kéo cột sang vùng ghim khác trên Header / Chooser
    setColumnPins((prevPins) => {
      const getPinZone = (pin?: PinPosition): PinPosition => {
        if (pin === PIN_POSITIONS.LEFT) return PIN_POSITIONS.LEFT;
        if (pin === PIN_POSITIONS.RIGHT) return PIN_POSITIONS.RIGHT;
        return PIN_POSITIONS.NONE;
      };
      const srcRepKey = !srcInfo.isWholeGroup ? sourceKey : srcInfo.memberKeys[0];
      const tgtRepKey = !tgtInfo.isWholeGroup ? targetKey : tgtInfo.memberKeys[0];
      const srcZone = getPinZone(prevPins[srcRepKey]);
      const tgtZone = getPinZone(prevPins[tgtRepKey]);
      if (srcZone === tgtZone) return prevPins;

      const nextPins = { ...prevPins };
      const keysToUpdate = srcInfo.groupId === tgtInfo.groupId ? [sourceKey] : srcInfo.memberKeys;
      keysToUpdate.forEach((k) => {
        nextPins[k] = tgtZone;
      });
      savePersistedGridConfig({ columnPins: nextPins });
      return nextPins;
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

  // Column widths handler (Persisted with 150ms debounce to avoid blocking 60fps resize drag)
  const saveColWidthsTimerRef = useRef<number | null>(null);
  const handleColWidthsChange = useCallback((widths: Record<string, number>) => {
    const { col_stt, col_chk, ...filtered } = widths;
    setColWidths(filtered);
    if (saveColWidthsTimerRef.current !== null) {
      window.clearTimeout(saveColWidthsTimerRef.current);
    }
    saveColWidthsTimerRef.current = window.setTimeout(() => {
      saveColWidthsTimerRef.current = null;
      savePersistedGridConfig({ colWidths: filtered });
    }, 150);
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
    if (saveColWidthsTimerRef.current !== null) {
      window.clearTimeout(saveColWidthsTimerRef.current);
      saveColWidthsTimerRef.current = null;
    }
    clearPersistedGridConfig();
    setColumnOrder(INITIAL_COLUMNS.map((c) => c.key));
    setColumnPins({
      col_stt: PIN_POSITIONS.LEFT,
      col_chk: PIN_POSITIONS.LEFT,
      col_id: PIN_POSITIONS.LEFT,
    });
    setHiddenColKeys(new Set());
    setColWidths({});
    setSortConfig(null);
    setGroupByColumnKey(null);
    setGroupSortConfig(null);
    setExpandedGroupPaths(new Set());
    setRowSnapMode(true);
  }, []);

  // Quick filter by cell value
  const handleQuickFilter = useCallback((colKey: string, val: any) => {
    if (val !== undefined && val !== null) {
      setSearchQuery(String(val));
    }
  }, []);

  const lastCheckedRowRef = useRef<{ displayIdx: number; origIdx: number } | null>(null);
  const activeRowIndicesRef = useRef<number[] | null>(null);

  // Toggle check row (hỗ trợ Shift + Click chọn/bỏ chọn dải dòng liên tiếp theo thứ tự đang hiển thị)
  const handleToggleCheck = useCallback(
    (rowIndex: number, row: any, e: React.MouseEvent) => {
      e.stopPropagation();
      const origIdx = row?.originalIndex !== undefined ? row.originalIndex : rowIndex;
      const dispIdx = typeof row?.rowIndex === 'number' && row.rowIndex >= 0 ? row.rowIndex : rowIndex;

      setCheckedRowIndices((prev) => {
        const next = new Set(prev);
        const shouldCheck = !next.has(origIdx);

        if (e?.shiftKey && lastCheckedRowRef.current !== null) {
          const prevInfo = lastCheckedRowRef.current;
          const gModel = groupedDisplayModelRef.current;

          if (gModel && gModel.length > 0) {
            const curD =
              dispIdx >= 0 &&
              gModel[dispIdx] &&
              !gModel[dispIdx]._isGroupRow &&
              gModel[dispIdx].originalIndex === origIdx
                ? dispIdx
                : gModel.findIndex((it) => it && !it._isGroupRow && it.originalIndex === origIdx);
            const prevD =
              prevInfo.displayIdx >= 0 &&
              gModel[prevInfo.displayIdx] &&
              !gModel[prevInfo.displayIdx]._isGroupRow &&
              gModel[prevInfo.displayIdx].originalIndex === prevInfo.origIdx
                ? prevInfo.displayIdx
                : gModel.findIndex((it) => it && !it._isGroupRow && it.originalIndex === prevInfo.origIdx);

            if (curD >= 0 && prevD >= 0) {
              const start = Math.min(prevD, curD);
              const end = Math.max(prevD, curD);
              for (let i = start; i <= end; i++) {
                const it = gModel[i];
                if (it && !it._isGroupRow) {
                  const rOrig = it.originalIndex !== undefined ? it.originalIndex : it;
                  if (shouldCheck) next.add(rOrig);
                  else next.delete(rOrig);
                }
              }
            } else {
              if (shouldCheck) next.add(origIdx);
              else next.delete(origIdx);
            }
          } else {
            const activeArr = activeRowIndicesRef.current;
            if (activeArr) {
              const curD =
                dispIdx >= 0 && activeArr[dispIdx] === origIdx
                  ? dispIdx
                  : activeArr.indexOf(origIdx);
              const prevD =
                prevInfo.displayIdx >= 0 && activeArr[prevInfo.displayIdx] === prevInfo.origIdx
                  ? prevInfo.displayIdx
                  : activeArr.indexOf(prevInfo.origIdx);

              if (curD >= 0 && prevD >= 0) {
                const start = Math.min(prevD, curD);
                const end = Math.max(prevD, curD);
                for (let i = start; i <= end; i++) {
                  const rOrig = activeArr[i];
                  if (shouldCheck) next.add(rOrig);
                  else next.delete(rOrig);
                }
              } else {
                if (shouldCheck) next.add(origIdx);
                else next.delete(origIdx);
              }
            } else {
              const start = Math.min(prevInfo.origIdx, origIdx);
              const end = Math.max(prevInfo.origIdx, origIdx);
              for (let r = start; r <= end; r++) {
                if (shouldCheck) next.add(r);
                else next.delete(r);
              }
            }
          }
        } else {
          if (shouldCheck) next.add(origIdx);
          else next.delete(origIdx);
        }

        if (next.size === 0) {
          setColumnFilters((prevFilters) => {
            if (prevFilters['col_chk']?.val === CHECK_FILTER_STATES.CHECKED) {
              const nextFilters = { ...prevFilters };
              delete nextFilters['col_chk'];
              return nextFilters;
            }
            return prevFilters;
          });
        }
        return next;
      });

      lastCheckedRowRef.current = {
        displayIdx: dispIdx >= 0 ? dispIdx : origIdx,
        origIdx,
      };
    },
    []
  );

  // Bỏ chọn tất cả dòng (từ menu chuột phải dòng)
  const handleClearCheckedRows = useCallback(() => {
    lastCheckedRowRef.current = null;
    setCheckedRowIndices(new Set());
    setColumnFilters((prevFilters) => {
      if (prevFilters['col_chk']?.val === CHECK_FILTER_STATES.CHECKED) {
        const nextFilters = { ...prevFilters };
        delete nextFilters['col_chk'];
        return nextFilters;
      }
      return prevFilters;
    });
  }, []);

  // Toggle "Chỉ hiện các dòng đang chọn" từ PageFooter
  const handleToggleFilterCheckedOnly = useCallback(() => {
    if (checkedRowIndices.size === 0) return;
    setColumnFilters((prev) => {
      if (prev['col_chk']?.val === CHECK_FILTER_STATES.CHECKED) {
        const next = { ...prev };
        delete next['col_chk'];
        return next;
      }
      return {
        ...prev,
        col_chk: createEqualsFilter(CHECK_FILTER_STATES.CHECKED),
      };
    });
  }, [checkedRowIndices.size]);

  const selectedDisplayIndexHintRef = useRef<number | null>(null);

  // Select row
  const handleSelectRow = useCallback(
    (rowIndex: number, row?: any) => {
      selectedDisplayIndexHintRef.current = rowIndex;
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
            let min = Infinity;
            let max = -Infinity;
            for (let m = 1; m <= 12; m++) {
              const v = Number(colKey === `col_m${m}` ? newValue : updated[`col_m${m}`]) || 0;
              sum += v;
              if (v < min) min = v;
              if (v > max) max = v;
            }
            if (formulaMode === FORMULA_MODES.MIN) updated.col_formula = min;
            else if (formulaMode === FORMULA_MODES.MAX) updated.col_formula = max;
            else if (formulaMode === FORMULA_MODES.SUM) updated.col_formula = sum;
            else updated.col_formula = Math.round((sum / 12) * 100) / 100;
          }
          next[origIdx] = updated;
        }
        return next;
      });
      setDataVersion((v) => v + 1);
    },
    [formulaMode]
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

  const checkedRowIndicesRef = useRef(checkedRowIndices);
  checkedRowIndicesRef.current = checkedRowIndices;

  const chkFilterVal = deferredColumnFilters['col_chk']?.val;
  const isChkFilterActive =
    chkFilterVal === CHECK_FILTER_STATES.CHECKED || chkFilterVal === CHECK_FILTER_STATES.UNCHECKED;
  const effectiveCheckedForFilter = isChkFilterActive ? checkedRowIndices : null;

  const isSortingByChk = sortConfig?.key === 'col_chk';
  const effectiveCheckedForSort = isSortingByChk ? checkedRowIndices : null;

  // Filter pipeline (<5ms for 50,000 rows)
  const filteredRowIndices = useMemo(() => {
    const q = deferredSearchQuery.trim().toLowerCase();
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
      if (requireChecked && !effectiveCheckedForFilter?.has(r)) continue;
      if (requireUnchecked && effectiveCheckedForFilter?.has(r)) continue;

      // Check Column Filters
      if (hasColFilters) {
        let matchedCols = true;
        for (let i = 0; i < colFiltersCount; i++) {
          const [colKey, fVal] = activeColEntries[i];
          if (colKey === 'col_chk') continue;
          const colDef = colMap[colKey];
          const dataType = colDef?.dataType || DATA_TYPES.TEXT;
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
        if (!evaluateQueryTreeNode(appliedQueryTree, null, r, getRowVal)) {
          continue;
        }
      }

      matched.push(r);
    }
    return matched;
  }, [
    deferredSearchQuery,
    appliedQueryTree,
    effectiveCheckedForFilter,
    activeColEntries,
    deferredColumnFilters,
    colMap,
    totalRowCount,
    formulaMode,
    getRowVal,
  ]);

  // Cache distinct values khi không có bộ lọc để mở phễu 0ms
  const fullTableDistinctCacheRef = useRef<Record<string, { values: string[]; hasBlanks: boolean }>>({});

  const getDistinctValuesForColumn = useCallback(
    (targetColKey: string) => {
      const q = deferredSearchQuery.trim().toLowerCase();
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
          if (requireChecked && !effectiveCheckedForFilter?.has(r)) continue;
          if (requireUnchecked && effectiveCheckedForFilter?.has(r)) continue;

          if (otherCount > 0) {
            let matchedOther = true;
            for (let i = 0; i < otherCount; i++) {
              const [colKey, fVal] = otherColEntries[i];
              if (colKey === 'col_chk') continue;
              const colDef = colMap[colKey];
              const dataType = colDef?.dataType || DATA_TYPES.TEXT;
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
            const dataType = colDef?.dataType || DATA_TYPES.TEXT;
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
            if (!evaluateQueryTreeNode(appliedQueryTree, null, r, getRowVal)) {
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
      deferredSearchQuery,
      appliedQueryTree,
      effectiveCheckedForFilter,
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
    const dType = colDef?.dataType || DATA_TYPES.TEXT;
    for (let i = 0; i < n; i++) {
      const origIdx = base[i];
      if (sortConfig.key === 'col_stt' || sortConfig.key === 'col_id') {
        sortVals[i] = origIdx + 1;
      } else if (sortConfig.key === 'col_chk') {
        sortVals[i] = effectiveCheckedForSort?.has(origIdx) ? 1 : 0;
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
  }, [filteredRowIndices, sortConfig, totalRowCount, colMap, effectiveCheckedForSort, chunkSize, apiData, formulaMode]);

  const activeRowIndices = displayRowIndices || filteredRowIndices;
  activeRowIndicesRef.current = activeRowIndices;
  const totalFilteredRows = activeRowIndices ? activeRowIndices.length : totalRowCount;

  // Danh sách các cột số trong apiData phục vụ tính tổng cực tốc O(N)
  const numericColKeys = useMemo(() => {
    return INITIAL_COLUMNS.filter((c) => c.dataType === DATA_TYPES.NUMBER).map((c) => c.key);
  }, []);

  // TẦNG 1A: Chia nhóm cấu trúc (Chỉ chạy lại khi đổi cột gom nhóm hoặc bộ lọc/sắp xếp, KHÔNG chạy lại khi tích chọn dòng)
  const rawGroupBuckets = useMemo(() => {
    if (!groupByColumnKey) return null;
    const count = activeRowIndices ? activeRowIndices.length : totalRowCount;
    const groupsMap = new Map<string, number[]>();

    for (let i = 0; i < count; i++) {
      const origIdx = activeRowIndices ? activeRowIndices[i] : i;
      const rawVal = getRowVal(origIdx, groupByColumnKey);
      const valStr = rawVal === '' || rawVal === null || rawVal === undefined ? '(Trống)' : String(rawVal);
      let indices = groupsMap.get(valStr);
      if (!indices) {
        indices = [];
        groupsMap.set(valStr, indices);
      }
      indices.push(origIdx);
    }

    const colTitle = colMap[groupByColumnKey]?.title || groupByColumnKey;
    return {
      colTitle,
      buckets: Array.from(groupsMap.entries()).map(([groupValue, indices]) => ({
        groupValue,
        indices,
      })),
    };
  }, [groupByColumnKey, activeRowIndices, totalRowCount, colMap, getRowVal]);

  // TẦNG 1B-1: Bộ đệm Tổng Toàn Bảng mặc định khi chưa chọn dòng (Giúp thao tác bỏ tích về 0 dòng đạt O(1) 0ms thay vì quét lại 50.000 dòng)
  const uncheckedBaseGroupData = useMemo(() => {
    const numKeys = numericColKeys;
    const numCount = numKeys.length;
    const totalSums = new Float64Array(numCount);
    const count = activeRowIndices ? activeRowIndices.length : totalRowCount;

    if (!rawGroupBuckets) {
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

    const entries = rawGroupBuckets.buckets.map((bucket) => {
      const gSums = new Float64Array(numCount);
      const bIndices = bucket.indices;
      const bLen = bIndices.length;
      for (let i = 0; i < bLen; i++) {
        const origIdx = bIndices[i];
        for (let c = 0; c < numCount; c++) {
          const val = getRowVal(origIdx, numKeys[c]);
          if (typeof val === 'number') {
            totalSums[c] += val;
            gSums[c] += val;
          }
        }
      }
      const gSumsObj: Record<string, number> = {};
      for (let c = 0; c < numCount; c++) {
        gSumsObj[numKeys[c]] = gSums[c];
      }
      return {
        groupValue: bucket.groupValue,
        indices: bIndices,
        sums: gSumsObj,
      };
    });

    const tableSums: Record<string, number> = {};
    for (let c = 0; c < numCount; c++) {
      tableSums[numKeys[c]] = totalSums[c];
    }

    return { columnSums: tableSums, groupEntries: entries, colTitle: rawGroupBuckets.colTitle };
  }, [rawGroupBuckets, activeRowIndices, totalRowCount, numericColKeys, getRowVal]);

  // TẦNG 1B-2: Tính tổng cực tốc (Khi có dòng được chọn, tính O(K) theo các dòng đang chọn; khi bỏ chọn về 0 dòng, trả về cache O(1) tức thì)
  const baseGroupData = useMemo(() => {
    const hasCheckedRows = checkedRowIndices.size > 0;
    if (!hasCheckedRows) {
      return uncheckedBaseGroupData;
    }

    const numKeys = numericColKeys;
    const numCount = numKeys.length;
    const totalSums = new Float64Array(numCount);
    const count = activeRowIndices ? activeRowIndices.length : totalRowCount;

    // Fast path: Không gom nhóm
    if (!rawGroupBuckets) {
      if (!activeRowIndices) {
        checkedRowIndices.forEach((origIdx) => {
          if (origIdx < 0 || origIdx >= totalRowCount) return;
          for (let c = 0; c < numCount; c++) {
            const val = getRowVal(origIdx, numKeys[c]);
            if (typeof val === 'number') {
              totalSums[c] += val;
            }
          }
        });
      } else {
        for (let i = 0; i < count; i++) {
          const origIdx = activeRowIndices[i];
          if (!checkedRowIndices.has(origIdx)) continue;
          for (let c = 0; c < numCount; c++) {
            const val = getRowVal(origIdx, numKeys[c]);
            if (typeof val === 'number') {
              totalSums[c] += val;
            }
          }
        }
      }
      const sumsObj: Record<string, number> = {};
      for (let c = 0; c < numCount; c++) {
        sumsObj[numKeys[c]] = totalSums[c];
      }
      return { columnSums: sumsObj, groupEntries: null, colTitle: '' };
    }

    // Tính tổng trực tiếp trên các bucket đã chia nhóm
    const entries = rawGroupBuckets.buckets.map((bucket) => {
      const gSums = new Float64Array(numCount);
      const bIndices = bucket.indices;
      const bLen = bIndices.length;
      for (let i = 0; i < bLen; i++) {
        const origIdx = bIndices[i];
        if (!checkedRowIndices.has(origIdx)) continue;
        for (let c = 0; c < numCount; c++) {
          const val = getRowVal(origIdx, numKeys[c]);
          if (typeof val === 'number') {
            totalSums[c] += val;
            gSums[c] += val;
          }
        }
      }
      const gSumsObj: Record<string, number> = {};
      for (let c = 0; c < numCount; c++) {
        gSumsObj[numKeys[c]] = gSums[c];
      }
      return {
        groupValue: bucket.groupValue,
        indices: bIndices,
        sums: gSumsObj,
      };
    });

    const tableSums: Record<string, number> = {};
    for (let c = 0; c < numCount; c++) {
      tableSums[numKeys[c]] = totalSums[c];
    }

    return { columnSums: tableSums, groupEntries: entries, colTitle: rawGroupBuckets.colTitle };
  }, [uncheckedBaseGroupData, rawGroupBuckets, activeRowIndices, totalRowCount, numericColKeys, checkedRowIndices, getRowVal]);

  const columnSums = baseGroupData.columnSums;

  // TẦNG 2: Sắp xếp các nhóm & Chiếu mô hình hiển thị phẳng ảo hóa
  const groupedDisplayModel = useMemo(() => {
    const { groupEntries, colTitle } = baseGroupData;
    if (!groupEntries || !groupByColumnKey) {
      groupedDisplayModelRef.current = null;
      return null;
    }

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
        isCollapsed: !isExpanded,
        onToggleCollapse: handleToggleGroupCollapse,
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
  }, [baseGroupData, groupByColumnKey, groupSortConfig, expandedGroupPaths, handleToggleGroupCollapse]);

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

      const dataCols = orderedColumns.filter(
        (c: ColumnDef<GridRecord>) => c.key !== 'col_stt' && c.key !== 'col_chk' && c.key !== 'col_chart' && !hiddenColKeys.has(c.key)
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

      const dataCols = orderedColumns.filter(
        (c: ColumnDef<GridRecord>) => c.key !== 'col_stt' && c.key !== 'col_chk' && c.key !== 'col_chart' && !hiddenColKeys.has(c.key)
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
    const dataCols = orderedColumns.filter(
      (c: ColumnDef<GridRecord>) => c.key !== 'col_stt' && c.key !== 'col_chk' && c.key !== 'col_chart' && !hiddenColKeys.has(c.key)
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

  // Row getter function for VirtualizedGrid (Đọc trực tiếp từ mảng Plain JSON API, bảo toàn tham chiếu row khi tích checkbox)
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
          _baseRecord: baseRecord,
          rowIndex: index,
          originalIndex: originalRowIdx,
          localRowIndex: localIndex,
          groupIndex,
          col_stt: localIndex + 1,
          col_chk: checkedRowIndicesRef.current.has(originalRowIdx),
          col_chunk: `C#${String(Math.floor(localIndex / chunkSize)).padStart(4, '0')}`,
        };
      }
      const originalRowIdx = activeRowIndices ? activeRowIndices[index] : index;
      const baseRecord = apiData[originalRowIdx];
      if (!baseRecord) return null;
      return {
        ...baseRecord,
        _baseRecord: baseRecord,
        rowIndex: index,
        originalIndex: originalRowIdx,
        col_stt: index + 1,
        col_chk: checkedRowIndicesRef.current.has(originalRowIdx),
        col_chunk: `C#${String(Math.floor(index / chunkSize)).padStart(4, '0')}`,
      };
    },
    [groupedDisplayModel, activeRowIndices, chunkSize, apiData]
  );

  const chartColumnWidth = colWidths['col_chart'];

  // Custom Cell Renderer (Tương thích 100% Plain JSON API Objects, bảo toàn React.memo của GridRow)
  const renderCell = useCallback(
    ({ column, row, isChecked }: CellRenderParams<any>) => {
      if (!row) return null;

      // 1. Cột STT
      if (column.key === 'col_stt') {
        const sttVal = row.localRowIndex !== undefined ? row.localRowIndex + 1 : row.rowIndex + 1;
        return (
          <span
            className="text-xs font-semibold text-center w-full"
            style={{ color: 'var(--agv-stt-cell-text, var(--agv-text-muted))' }}
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
              checked={Boolean(isChecked)}
              onChange={(e) => handleToggleCheck(row.rowIndex, row, e)}
              size={16}
              spring="bouncy"
            />
          </div>
        );
      }

      // 3, 4, 5. Tái sử dụng O(1) thống kê 12 tháng gắn theo baseRecord gốc
      const isMonthCol = column.key.startsWith('col_m');
      if (column.key === 'col_chart' || column.key === 'col_formula' || isMonthCol) {
        const { mVals, minVal, maxVal, minIdx, maxIdx, sumVal, avgVal } =
          getOrComputeMonthStats(row._baseRecord || row);

        // 3. Cột Biểu đồ 12 Tháng (Catmull-Rom SVG Sparkline)
        if (column.key === 'col_chart') {
          const chartColWidth = chartColumnWidth || column.defaultWidth || 150;
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
        const mIdx = parseInt(column.key.replace('col_m', ''), 10) - 1;
        const val = mVals[mIdx];
        const isMax = mIdx === maxIdx;
        const isMin = mIdx === minIdx;
        return (
          <span
            className={`text-xs tabular-nums ${
              isMax
                ? 'text-[var(--agv-trend-up)] font-bold'
                : isMin
                ? 'text-[var(--agv-trend-down)] font-bold'
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
    [handleToggleCheck, formulaMode, surfaceTheme, chartColumnWidth, getOrComputeMonthStats]
  );

  const handleGetRowId = useCallback(
    (row: any) => (row?._isGroupRow ? row.path : (row.originalIndex ?? row.id)),
    []
  );

  const jumpToRowNumber = useCallback(
    (rowNumberOneBased: number) => {
      const clampedIdx = Math.max(0, Math.min(totalVirtualRowCount - 1, rowNumberOneBased - 1));
      selectedDisplayIndexHintRef.current = clampedIdx;
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
    return Object.values(columnPins).filter((p) => p === PIN_POSITIONS.LEFT).length;
  }, [columnPins]);

  const centerPinnedCount = useMemo(() => {
    return Object.values(columnPins).filter((p) => p === PIN_POSITIONS.CENTER).length;
  }, [columnPins]);

  const rightPinnedCount = useMemo(() => {
    return Object.values(columnPins).filter((p) => p === PIN_POSITIONS.RIGHT).length;
  }, [columnPins]);

  const selectedDisplayIndex = useMemo(() => {
    if (selectedRowKey === null) return undefined;
    const hintIdx = selectedDisplayIndexHintRef.current;
    if (groupedDisplayModel) {
      if (hintIdx !== null && hintIdx >= 0 && hintIdx < groupedDisplayModel.length) {
        const hintedItem = groupedDisplayModel[hintIdx];
        if (
          hintedItem &&
          !hintedItem._isGroupRow &&
          (hintedItem.originalIndex === selectedRowKey || hintedItem === selectedRowKey)
        ) {
          return hintIdx;
        }
      }
      const idx = groupedDisplayModel.findIndex(
        (it) => it && !it._isGroupRow && (it.originalIndex === selectedRowKey || it === selectedRowKey)
      );
      selectedDisplayIndexHintRef.current = idx >= 0 ? idx : null;
      return idx >= 0 ? idx : undefined;
    }
    if (activeRowIndices) {
      if (
        hintIdx !== null &&
        hintIdx >= 0 &&
        hintIdx < activeRowIndices.length &&
        activeRowIndices[hintIdx] === selectedRowKey
      ) {
        return hintIdx;
      }
      const idx = activeRowIndices.indexOf(selectedRowKey);
      selectedDisplayIndexHintRef.current = idx >= 0 ? idx : null;
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

  const handleClearSort = useCallback(() => handleSortChange(null), [handleSortChange]);
  const handleNoopOpenFilters = useCallback(() => {}, []);
  const handleToggleFilterRow = useCallback(() => setShowFilterRow((prev) => !prev), []);
  const handleJumpToRowSubmit = useCallback(() => {
    const num = parseInt(jumpRowInput, 10);
    if (!Number.isNaN(num)) jumpToRowNumber(num);
  }, [jumpRowInput, jumpToRowNumber]);
  const handleToggleAutoScroll = useCallback(() => setAutoScrolling((prev) => !prev), []);

  return (
    <div
      data-theme={surfaceTheme}
      className={`agv-app-container ${getThemeClass(surfaceTheme)} ${isDark ? 'dark' : ''} w-screen h-screen flex flex-col overflow-hidden select-none`}
      style={{
        backgroundColor: 'var(--agv-bg-root)',
        color: 'var(--agv-text-main)',
        WebkitFontSmoothing:
          surfaceTheme === SURFACE_THEMES.E_INK || surfaceTheme === SURFACE_THEMES.EINK
            ? 'subpixel-antialiased'
            : 'antialiased',
        MozOsxFontSmoothing:
          surfaceTheme === SURFACE_THEMES.E_INK || surfaceTheme === SURFACE_THEMES.EINK
            ? 'subpixel-antialiased'
            : 'grayscale',
      }}
    >
      <style>{themeCss}</style>
      {customCssStyleBlock && <style id="agv-custom-css-theme">{customCssStyleBlock}</style>}

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
        onClearSort={handleClearSort}
        fps={metrics.fps}
        startChunkIndex={metrics.startChunk}
        endChunkIndex={metrics.endChunk}
        mountedRowCount={metrics.mountedRowCount}
        totalFilteredRows={totalFilteredRows}
        scrollVelocity={metrics.velocity}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeFilterCount={0}
        onOpenFilters={handleNoopOpenFilters}
        showFilterRow={showFilterRow}
        onToggleFilterRow={handleToggleFilterRow}
        activeColumnFilterCount={activeColumnFilterCount}
        jumpRowInput={jumpRowInput}
        onJumpRowInputChange={setJumpRowInput}
        onJumpToRowSubmit={handleJumpToRowSubmit}
        surfaceTheme={surfaceTheme}
        onThemeChange={handleSurfaceThemeChange}
        onOpenCustomCssModal={() => setIsCustomCssModalOpen(true)}
        isDark={isDark}
        onToggleColorScheme={handleToggleColorScheme}
        autoScrolling={autoScrolling}
        onToggleAutoScroll={handleToggleAutoScroll}
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
          onClearCheckedRows={handleClearCheckedRows}
          getRowId={handleGetRowId}
          renderCell={renderCell}
          chunkSize={chunkSize}
          rowHeight={rowHeight}
          overscanChunks={overscanChunks}
          antiGhostMode={antiGhostMode}
          surfaceTheme={surfaceTheme}
          rowSnapMode={rowSnapMode}
          onRowSnapModeChange={handleRowSnapModeChange}
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
        checkedRowCount={checkedRowIndices.size}
        isFilterCheckedOnly={columnFilters['col_chk']?.val === CHECK_FILTER_STATES.CHECKED}
        onToggleFilterCheckedOnly={handleToggleFilterCheckedOnly}
      />

      {/* 4. Modal Nhập CSS Test Màu */}
      <AdvCustomCssModal
        isOpen={isCustomCssModalOpen}
        onClose={() => setIsCustomCssModalOpen(false)}
        onApply={handleApplyCustomCss}
        initialCss={customCssCode}
      />
    </div>
  );
}

export default App;
