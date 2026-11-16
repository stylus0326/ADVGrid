import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useDeferredValue,
  useEffect,
} from 'react';
import { VirtualizedGrid } from './VirtualizedGrid';
import {
  DEFAULT_CHUNK_SIZE,
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE_SIZE_OPTIONS,
  DEFAULT_ROW_HEIGHT,
} from './constants';
import {
  ALIGNMENTS,
  BaseGroupDef,
  CHECK_FILTER_STATES,
  CellRenderParams,
  ColumnDef,
  ColumnFilterValue,
  DATA_TYPES,
  FILTER_MODES,
  FORMULA_MODES,
  FormulaMode,
  GRID_EDIT_MODES,
  GRID_LAYOUT_MODES,
  GridFeatureProps,
  GridLayoutMode,
  GridToolbarState,
  GroupSortConfig,
  PIN_POSITIONS,
  PhoneCardConfig,
  PinPosition,
  SORT_DIRECTIONS,
  SURFACE_THEMES,
  SortConfig,
  SurfaceTheme,
  TabletColumnGroup,
  VirtualizedGridRef,
  GridSpanMethod,
  TreeDataConfig,
  DetailRowConfig,
  resolveGridFeatures,
} from './types';
import {
  buildTreeForest,
  flattenVisibleTreeNodes,
  type FlattenedTreeRow,
} from './gridTreeDataEngine';
import {
  DefaultColDef,
  GridColumnDef,
  PaginationConfig,
  normalizeGridColumns,
} from './columns';
import {
  formatGridDateValue,
  formatGridNumber,
  isNoInputFilterOp,
  createEqualsFilter,
} from './gridFormatUtils';
import { matchSimpleFilterSync, needsFullFilterEngine } from './gridSimpleFilter';
import { normalizeSortRules, sortRowIndicesMulti } from './multiSortUtils';
import {
  getDataGridConfigStorageKey,
  readGridStorageJson,
  writeGridStorageJson,
} from './gridStorage';
import type { QueryGroup } from './floating/types';
import { hasActiveQueryRules } from './floating/queryRuleCheck';
import { GridSelectionCheckbox } from './GridSelectionCheckbox';
import type {
  DataGridProps,
  DataGridRef,
  DataGridToolbarApi,
  UseDataGridControllerOptions,
} from './DataGrid';
import type { GroupBucketsResult } from './gridGroupingEngine';

const LazyGridStatusBar = React.lazy(() =>
  import('./GridStatusBar').then((m) => ({ default: m.GridStatusBar }))
);

type QueryTreeEvaluator = typeof import('./floating/queryUtils').evaluateQueryTreeNode;
type FilterEngineMod = typeof import('./gridFilterEngine');
type GroupingEngineMod = typeof import('./gridGroupingEngine');

let _filterEngineMod: FilterEngineMod | null = null;
let _filterEnginePromise: Promise<FilterEngineMod> | null = null;
function ensureFilterEngine(): Promise<FilterEngineMod> {
  if (_filterEngineMod) return Promise.resolve(_filterEngineMod);
  if (!_filterEnginePromise) {
    _filterEnginePromise = import('./gridFilterEngine').then((m) => {
      _filterEngineMod = m;
      return m;
    });
  }
  return _filterEnginePromise;
}

let _groupingMod: GroupingEngineMod | null = null;
let _groupingPromise: Promise<GroupingEngineMod> | null = null;
function ensureGroupingEngine(): Promise<GroupingEngineMod> {
  if (_groupingMod) return Promise.resolve(_groupingMod);
  if (!_groupingPromise) {
    _groupingPromise = import('./gridGroupingEngine').then((m) => {
      _groupingMod = m;
      return m;
    });
  }
  return _groupingPromise;
}

interface PersistedDataGridConfig {
  columnOrder?: string[];
  hiddenColKeys?: string[];
  columnPins?: Record<string, PinPosition>;
  colWidths?: Record<string, number>;
  sortConfig?: SortConfig | null;
  sortRules?: SortConfig[];
  groupByColumnKey?: string | null;
  groupSortConfig?: GroupSortConfig | null;
}

const EMPTY_ROWS: any[] = [];
const EMPTY_SUMS: Record<string, number> = {};
const EMPTY_PINS: Record<string, PinPosition> = {};

function defaultGetRowKey<TRecord extends Record<string, any>>(row: TRecord, index: number): string {
  const candidate = row?._rowKey ?? row?.id ?? row?.Id ?? row?.ID ?? row?.key ?? row?.code;
  if (candidate !== undefined && candidate !== null && String(candidate) !== '') {
    return String(candidate);
  }
  return `row_${index}`;
}

function defaultGetCellValue<TRecord extends Record<string, any>>(
  row: TRecord,
  colKey: string
): unknown {
  return row ? row[colKey] : undefined;
}

export function useDataGridController<TRecord extends Record<string, any>>({
  gridId,
  pageKey,
  rows: rawRows,
  data,
  rowData,
  columns: inputColumns,
  columnDefs,
  columnGroups: propColumnGroups,
  tabletGroups: _tabletGroups,
  phoneCard: _phoneCard,
  formulaMode: controlledFormulaMode,
  defaultFormulaMode = FORMULA_MODES.MAX,
  onFormulaModeChange: controlledOnFormulaModeChange,
  surfaceTheme = SURFACE_THEMES.LIGHT,
  dynamicRowHeight = false,
  defaultColDef,
  defaultPins: customDefaultPins,
  getRowKey: customGetRowKey,
  getRowId,
  rowKey,
  getCellValue: customGetCellValue,
  getSearchText: customGetSearchText,
  renderCell: customRenderCell,
  pinnedTopRowData: _pinnedTopRowData,
  onRowClick,
  onRowDetail,
  modules,
  variant,
  autoHeight,
  maxHeight,
  persistState,
  enableFiltering,
  showFilterRow,
  enableHeaderFilter,
  enableQuickSearch,
  enableQueryBuilder,
  enableSorting,
  enableMultiSort,
  enableColumnResize,
  enableColumnReorder,
  enableColumnPinning,
  enableCenterDock,
  enableColumnHide,
  enableRowNumber,
  enableSelection,
  enableGrouping,
  enableRowPinning,
  enableCellEditing,
  enableResponsiveLayout,
  enableSummary,
  showSummaryRow,
  enableStatusBar,
  showStatusBar,
  enableContextMenu,
  enableFloatingToolbar,
  enableColumnChooser,
  enableSettings,
  enableFullscreen,
  enableCrossHover,
  crossHoverHighlightHeader,
  enableCellSpan,
  enableTreeData,
  enableRowDetail,
  spanMethod,
  maxRowSpanLookback,
  treeData,
  detailRow,
  pagination,
  enablePagination,
  page: controlledPage,
  defaultPage = 1,
  pageSize: controlledPageSize,
  defaultPageSize = DEFAULT_PAGE_SIZE,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  serverTotal,
  onPageChange: controlledOnPageChange,
  onPageSizeChange: controlledOnPageSizeChange,
}: UseDataGridControllerOptions<TRecord>) {
  const inputRows = rawRows ?? data ?? rowData ?? (EMPTY_ROWS as TRecord[]);

  const paginationObj =
    typeof pagination === 'object' && pagination !== null ? pagination : undefined;
  const resolvedDefaultPage = paginationObj?.defaultPage ?? defaultPage;
  const resolvedDefaultPageSize = paginationObj?.defaultPageSize ?? defaultPageSize;
  const resolvedControlledPage = paginationObj?.page ?? controlledPage;
  const resolvedControlledPageSize = paginationObj?.pageSize ?? controlledPageSize;
  const resolvedPageSizeOptions = paginationObj?.pageSizeOptions ?? pageSizeOptions;
  const resolvedServerTotal = paginationObj?.serverTotal ?? paginationObj?.total ?? serverTotal;
  const resolvedOnPageChange = paginationObj?.onPageChange ?? controlledOnPageChange;
  const resolvedOnPageSizeChange =
    paginationObj?.onPageSizeChange ?? controlledOnPageSizeChange;
  const effectiveEnableStatusBar =
    pagination === false
      ? false
      : pagination === true || paginationObj !== undefined
      ? true
      : enableStatusBar;

  const [internalPage, setInternalPage] = useState<number>(Math.max(1, resolvedDefaultPage));
  const [internalPageSize, setInternalPageSize] = useState<number>(
    resolvedDefaultPageSize > 0 ? resolvedDefaultPageSize : DEFAULT_PAGE_SIZE
  );

  const [internalFormulaMode, setInternalFormulaMode] = useState<FormulaMode>(defaultFormulaMode);
  const effectiveFormulaMode = controlledFormulaMode ?? internalFormulaMode;
  const handleFormulaModeChange = useCallback(
    (nextMode: FormulaMode) => {
      if (controlledFormulaMode === undefined) {
        setInternalFormulaMode(nextMode);
      }
      controlledOnFormulaModeChange?.(nextMode);
    },
    [controlledFormulaMode, controlledOnFormulaModeChange]
  );

  const features = useMemo(
    () =>
      resolveGridFeatures({
        modules,
        variant,
        autoHeight,
        maxHeight,
        persistState,
        enableFiltering,
        showFilterRow,
        enableHeaderFilter,
        enableQuickSearch,
        enableQueryBuilder,
        enableSorting,
        enableMultiSort,
        enableColumnResize,
        enableColumnReorder,
        enableColumnPinning,
        enableCenterDock,
        enableColumnHide,
        enableRowNumber,
        enableSelection,
        enableGrouping,
        enableRowPinning,
        enableCellEditing,
        enableResponsiveLayout,
        enableSummary,
        showSummaryRow,
        enableStatusBar: effectiveEnableStatusBar,
        showStatusBar,
        enableContextMenu,
        enableFloatingToolbar,
        enableColumnChooser,
        enableSettings,
        enableFullscreen,
        enableCrossHover,
        crossHoverHighlightHeader,
        enableCellSpan: enableCellSpan ?? (spanMethod !== undefined ? true : undefined),
        enableTreeData: enableTreeData ?? (treeData !== undefined ? true : undefined),
        enableRowDetail: enableRowDetail ?? (detailRow !== undefined ? true : undefined),
      }),
    [
      modules,
      variant,
      autoHeight,
      maxHeight,
      persistState,
      enableFiltering,
      showFilterRow,
      enableHeaderFilter,
      enableQuickSearch,
      enableQueryBuilder,
      enableSorting,
      enableMultiSort,
      enableColumnResize,
      enableColumnReorder,
      enableColumnPinning,
      enableCenterDock,
      enableColumnHide,
      enableRowNumber,
      enableSelection,
      enableGrouping,
      enableRowPinning,
      enableCellEditing,
      enableResponsiveLayout,
      enableSummary,
      showSummaryRow,
      effectiveEnableStatusBar,
      showStatusBar,
      enableContextMenu,
      enableFloatingToolbar,
      enableColumnChooser,
      enableSettings,
      enableFullscreen,
      enableCrossHover,
      crossHoverHighlightHeader,
      enableCellSpan,
      spanMethod,
      enableTreeData,
      treeData,
      enableRowDetail,
      detailRow,
    ]
  );

  const isTreeActive = Boolean(features.enableTreeData && treeData);
  const isDetailActive = Boolean(features.enableRowDetail && detailRow);

  const effectiveGridId = (gridId || pageKey || 'default').trim() || 'default';
  const storageKey = useMemo(
    () => getDataGridConfigStorageKey(effectiveGridId),
    [effectiveGridId]
  );

  const gridRef = useRef<VirtualizedGridRef>(null);

  const {
    flatColumns: normalizedInputColumns,
    columnGroups: normalizedColumnGroups,
    columnDefinedPins,
  } = useMemo(
    () =>
      normalizeGridColumns(inputColumns ?? columnDefs, defaultColDef, {
        enableColumnPinning: features.enableColumnPinning,
        enableCenterDock: features.enableCenterDock,
        formulaMode: effectiveFormulaMode,
        surfaceTheme,
      }),
    [
      inputColumns,
      columnDefs,
      defaultColDef,
      features.enableColumnPinning,
      features.enableCenterDock,
      effectiveFormulaMode,
      surfaceTheme,
    ]
  );

  const resolvedColumns = useMemo<ColumnDef<TRecord>[]>(() => {
    const hasRowNumber = normalizedInputColumns.some((c) => c.isRowNumber || c.key === 'col_stt');
    const hasSelection = normalizedInputColumns.some((c) => c.isSelection || c.key === 'col_chk');
    const hasDetailExpand = normalizedInputColumns.some(
      (c) => c.isDetailExpand || c.key === 'col_detail_expand'
    );
    const prefix: ColumnDef<TRecord>[] = [];

    if (features.enableRowNumber && !hasRowNumber) {
      prefix.push({
        key: 'col_stt',
        title: '#',
        defaultWidth: 48,
        align: ALIGNMENTS.CENTER,
        dataType: DATA_TYPES.SYSTEM,
        isRowNumber: true,
        pinnable: false,
        resizable: false,
        sortable: true,
        disableHeaderContextMenu: true,
      });
    }

    if (features.enableSelection && !hasSelection) {
      prefix.push({
        key: 'col_chk',
        title: '',
        defaultWidth: 36,
        align: ALIGNMENTS.CENTER,
        dataType: DATA_TYPES.SYSTEM,
        isSelection: true,
        pinnable: false,
        resizable: false,
        sortable: true,
        filterable: true,
        disableHeaderContextMenu: true,
      });
    }

    if (
      isDetailActive &&
      detailRow?.showExpandColumn !== false &&
      !detailRow?.expandColumnKey &&
      !hasDetailExpand
    ) {
      prefix.push({
        key: 'col_detail_expand',
        title: '',
        defaultWidth: 36,
        minWidth: 36,
        maxWidth: 36,
        align: ALIGNMENTS.CENTER,
        dataType: DATA_TYPES.SYSTEM,
        isDetailExpand: true,
        pinnable: false,
        resizable: false,
        sortable: false,
        filterable: false,
        enableGlobalFilter: false,
        hideable: false,
        groupable: false,
        disableHeaderContextMenu: true,
        disableContextMenu: true,
      });
    }

    return prefix.length > 0 ? [...prefix, ...normalizedInputColumns] : normalizedInputColumns;
  }, [
    normalizedInputColumns,
    features.enableRowNumber,
    features.enableSelection,
    isDetailActive,
    detailRow?.showExpandColumn,
    detailRow?.expandColumnKey,
  ]);

  const resolvedColumnGroups = useMemo<BaseGroupDef[] | undefined>(() => {
    const baseGroups = propColumnGroups ?? normalizedColumnGroups;
    if (!baseGroups || baseGroups.length === 0) return baseGroups;
    const existingKeys = new Set(baseGroups.flatMap((g) => g.keys));
    const prefixGroups: BaseGroupDef[] = [];
    resolvedColumns.forEach((col) => {
      if ((col.isRowNumber || col.isSelection || col.isDetailExpand) && !existingKeys.has(col.key)) {
        prefixGroups.push({
          id: col.key,
          title: col.title,
          isStandalone: true,
          keys: [col.key],
        });
      }
    });
    return prefixGroups.length > 0 ? [...prefixGroups, ...baseGroups] : baseGroups;
  }, [propColumnGroups, normalizedColumnGroups, resolvedColumns]);

  const colMap = useMemo(() => {
    const map: Record<string, ColumnDef<TRecord>> = {};
    resolvedColumns.forEach((c) => {
      map[c.key] = c;
    });
    return map;
  }, [resolvedColumns]);

  const defaultPins = useMemo<Record<string, PinPosition>>(() => {
    if (!features.enableColumnPinning && !features.enableCenterDock) return EMPTY_PINS;
    const basePins: Record<string, PinPosition> = {};
    if (
      features.enableColumnPinning &&
      features.enableRowNumber &&
      resolvedColumns.some((c) => c.key === 'col_stt')
    ) {
      basePins.col_stt = PIN_POSITIONS.LEFT;
    }
    if (
      features.enableColumnPinning &&
      features.enableSelection &&
      resolvedColumns.some((c) => c.key === 'col_chk')
    ) {
      basePins.col_chk = PIN_POSITIONS.LEFT;
    }
    if (
      features.enableColumnPinning &&
      resolvedColumns.some((c) => c.key === 'col_detail_expand')
    ) {
      basePins.col_detail_expand = PIN_POSITIONS.LEFT;
    }
    const merged: Record<string, PinPosition> = {
      ...basePins,
      ...columnDefinedPins,
      ...(customDefaultPins ?? {}),
    };
    if (features.enableColumnPinning && features.enableCenterDock) {
      return merged;
    }
    const filtered: Record<string, PinPosition> = {};
    for (const [k, v] of Object.entries(merged)) {
      if (
        features.enableColumnPinning &&
        (v === PIN_POSITIONS.LEFT || v === PIN_POSITIONS.RIGHT)
      ) {
        filtered[k] = v;
      } else if (features.enableCenterDock && v === PIN_POSITIONS.CENTER) {
        filtered[k] = v;
      }
    }
    return filtered;
  }, [
    features.enableColumnPinning,
    features.enableCenterDock,
    features.enableRowNumber,
    features.enableSelection,
    columnDefinedPins,
    customDefaultPins,
    resolvedColumns,
  ]);

  const loadConfig = useCallback(
    () =>
      features.persistState
        ? readGridStorageJson<PersistedDataGridConfig | null>(storageKey, null)
        : null,
    [features.persistState, storageKey]
  );

  const saveConfig = useCallback(
    (update: Partial<PersistedDataGridConfig>) => {
      if (!features.persistState) return;
      const current = readGridStorageJson<PersistedDataGridConfig>(storageKey, {});
      writeGridStorageJson(storageKey, { ...current, ...update });
    },
    [features.persistState, storageKey]
  );

  const persisted = useMemo(() => loadConfig(), [loadConfig]);

  const [selectedRowKey, setSelectedRowKey] = useState<string | number | null>(null);
  const [checkedRowKeys, setCheckedRowKeys] = useState<Set<string | number>>(() => new Set());
  const checkedRowKeysRef = useRef(checkedRowKeys);
  useEffect(() => {
    checkedRowKeysRef.current = checkedRowKeys;
  }, [checkedRowKeys]);

  const lastCheckedRowRef = useRef<{ displayIdx: number; rowKey: string } | null>(null);
  const groupedDisplayModelRef = useRef<any[] | null>(null);
  const pagedRowIndicesRef = useRef<number[] | null>(null);

  const [columnFilters, setColumnFilters] = useState<Record<string, ColumnFilterValue>>({});
  const deferredColumnFilters = useDeferredValue(columnFilters);
  const [quickFilterText, setQuickFilterText] = useState('');
  const deferredQuickFilterText = useDeferredValue(quickFilterText);
  const [appliedQueryTree, setAppliedQueryTree] = useState<QueryGroup | null>(null);
  const [queryEvaluator, setQueryEvaluator] = useState<QueryTreeEvaluator | null>(null);

  useEffect(() => {
    if (queryEvaluator) return;
    if (!features.enableQueryBuilder && !hasActiveQueryRules(appliedQueryTree)) return;
    let active = true;
    import('./floating/queryUtils').then((m) => {
      if (active) {
        setQueryEvaluator(() => m.evaluateQueryTreeNode);
      }
    });
    return () => {
      active = false;
    };
  }, [queryEvaluator, features.enableQueryBuilder, appliedQueryTree]);

  const [sortRules, setSortRules] = useState<SortConfig[]>(() =>
    normalizeSortRules(persisted?.sortRules, persisted?.sortConfig)
  );
  const sortConfig = sortRules[0] ?? null;
  const [groupByColumnKey, setGroupByColumnKey] = useState<string | null>(
    () => persisted?.groupByColumnKey ?? null
  );
  const [groupSortConfig, setGroupSortConfig] = useState<GroupSortConfig | null>(
    () => persisted?.groupSortConfig ?? null
  );
  const [expandedGroupPaths, setExpandedGroupPaths] = useState<Set<string>>(() => new Set());

  const [columnPins, setColumnPins] = useState<Record<string, PinPosition>>(
    () => persisted?.columnPins ?? defaultPins
  );
  const [colWidths, setColWidths] = useState<Record<string, number>>(
    () => persisted?.colWidths ?? {}
  );
  const [hiddenColKeys, setHiddenColKeys] = useState<Set<string>>(
    () => new Set(persisted?.hiddenColKeys ?? [])
  );
  const [columnOrder, setColumnOrder] = useState<string[]>(() => persisted?.columnOrder ?? []);

  const prevGridIdRef = useRef(effectiveGridId);
  const prevPersistRef = useRef(features.persistState);
  useEffect(() => {
    if (
      prevGridIdRef.current === effectiveGridId &&
      prevPersistRef.current === features.persistState
    ) {
      return;
    }
    prevGridIdRef.current = effectiveGridId;
    prevPersistRef.current = features.persistState;
    const cfg = loadConfig();
    setSelectedRowKey(null);
    setCheckedRowKeys(new Set());
    lastCheckedRowRef.current = null;
    setColumnFilters({});
    setQuickFilterText('');
    setAppliedQueryTree(null);
    setSortRules(normalizeSortRules(cfg?.sortRules, cfg?.sortConfig));
    setGroupByColumnKey(cfg?.groupByColumnKey ?? null);
    setGroupSortConfig(cfg?.groupSortConfig ?? null);
    setExpandedGroupPaths(new Set());
    setColumnPins(cfg?.columnPins ?? defaultPins);
    setColWidths(cfg?.colWidths ?? {});
    setHiddenColKeys(new Set(cfg?.hiddenColKeys ?? []));
    setColumnOrder(cfg?.columnOrder ?? []);
  }, [effectiveGridId, features.persistState, loadConfig, defaultPins]);

  const effectiveColumnPins = useMemo<Record<string, PinPosition>>(() => {
    const needAutoExpandLeftPin = Boolean(
      features.enableColumnPinning && resolvedColumns.some((c) => c.key === 'col_detail_expand')
    );
    if (!features.enableColumnPinning && !features.enableCenterDock) return EMPTY_PINS;
    if (features.enableColumnPinning && features.enableCenterDock) {
      return needAutoExpandLeftPin && !columnPins.col_detail_expand
        ? { ...columnPins, col_detail_expand: PIN_POSITIONS.LEFT }
        : columnPins;
    }
    const filtered: Record<string, PinPosition> = {};
    for (const [k, v] of Object.entries(columnPins)) {
      if (
        features.enableColumnPinning &&
        (v === PIN_POSITIONS.LEFT || v === PIN_POSITIONS.RIGHT)
      ) {
        filtered[k] = v;
      } else if (features.enableCenterDock && v === PIN_POSITIONS.CENTER) {
        filtered[k] = v;
      }
    }
    if (needAutoExpandLeftPin && !filtered.col_detail_expand) {
      filtered.col_detail_expand = PIN_POSITIONS.LEFT;
    }
    return filtered;
  }, [features.enableColumnPinning, features.enableCenterDock, columnPins, resolvedColumns]);

  const getRowKey = useMemo<(row: TRecord, index: number) => string>(() => {
    if (customGetRowKey) return customGetRowKey;
    if (getRowId) {
      return (row: TRecord, index: number) => String(getRowId(row, index));
    }
    if (typeof rowKey === 'function') {
      return (row: TRecord, index: number) => String(rowKey(row, index));
    }
    if (rowKey !== undefined && rowKey !== null) {
      return (row: TRecord, index: number) => {
        const val = row?.[rowKey as string];
        if (val !== undefined && val !== null && String(val) !== '') {
          return String(val);
        }
        return defaultGetRowKey(row, index);
      };
    }
    return defaultGetRowKey;
  }, [customGetRowKey, getRowId, rowKey]);

  const treeForest = useMemo(
    () => (isTreeActive ? buildTreeForest(inputRows, getRowKey, treeData) : null),
    [isTreeActive, inputRows, getRowKey, treeData]
  );
  const rows = treeForest ? treeForest.flatRecords : inputRows;

  const treeInitSigRef = useRef<string>('');
  const [internalTreeExpandedKeys, setInternalTreeExpandedKeys] = useState<Set<string>>(() => {
    if (!isTreeActive || !treeForest || treeForest.roots.length === 0) {
      return new Set(treeData?.defaultExpandedKeys?.map(String) ?? []);
    }
    treeInitSigRef.current = `${effectiveGridId}|${treeData?.defaultExpandAll ? 'all' : ''}|${
      treeData?.defaultExpandedDepth ?? ''
    }|${treeData?.defaultExpandedKeys ? treeData.defaultExpandedKeys.join(',') : ''}`;
    if (treeData?.defaultExpandedKeys) {
      return new Set(treeData.defaultExpandedKeys.map(String));
    }
    if (treeData?.defaultExpandAll) {
      return new Set(treeForest.allExpandableKeys);
    }
    if (typeof treeData?.defaultExpandedDepth === 'number') {
      return new Set(treeForest.getKeysUpToDepth(treeData.defaultExpandedDepth));
    }
    return new Set();
  });

  useEffect(() => {
    if (!isTreeActive || !treeForest || treeForest.roots.length === 0) return;
    const sig = `${effectiveGridId}|${treeData?.defaultExpandAll ? 'all' : ''}|${
      treeData?.defaultExpandedDepth ?? ''
    }|${treeData?.defaultExpandedKeys ? treeData.defaultExpandedKeys.join(',') : ''}`;
    if (treeInitSigRef.current === sig) return;
    treeInitSigRef.current = sig;
    if (treeData?.expandedKeys !== undefined) return;
    if (treeData?.defaultExpandedKeys) {
      setInternalTreeExpandedKeys(new Set(treeData.defaultExpandedKeys.map(String)));
    } else if (treeData?.defaultExpandAll) {
      setInternalTreeExpandedKeys(new Set(treeForest.allExpandableKeys));
    } else if (typeof treeData?.defaultExpandedDepth === 'number') {
      setInternalTreeExpandedKeys(new Set(treeForest.getKeysUpToDepth(treeData.defaultExpandedDepth)));
    } else {
      setInternalTreeExpandedKeys(new Set());
    }
  }, [
    isTreeActive,
    treeForest,
    effectiveGridId,
    treeData?.expandedKeys,
    treeData?.defaultExpandAll,
    treeData?.defaultExpandedDepth,
    treeData?.defaultExpandedKeys,
  ]);

  const effectiveTreeExpandedKeys = useMemo<ReadonlySet<string>>(() => {
    if (treeData?.expandedKeys !== undefined) {
      const next = new Set<string>();
      treeData.expandedKeys.forEach((k) => next.add(String(k)));
      return next;
    }
    return internalTreeExpandedKeys;
  }, [treeData?.expandedKeys, internalTreeExpandedKeys]);

  const treeDataRef = useRef(treeData);
  treeDataRef.current = treeData;
  const treeExpandedRef = useRef(effectiveTreeExpandedKeys);
  treeExpandedRef.current = effectiveTreeExpandedKeys;
  const treeForestRef = useRef(treeForest);
  treeForestRef.current = treeForest;

  const commitTreeExpandedKeys = useCallback((nextSet: Set<string>) => {
    if (treeDataRef.current?.expandedKeys === undefined) {
      setInternalTreeExpandedKeys(nextSet);
    }
    treeDataRef.current?.onExpandedKeysChange?.(Array.from(nextSet));
  }, []);

  const toggleTreeRow = useCallback(
    (rowKeyVal: string | number, forceExpanded?: boolean) => {
      const keyStr = String(rowKeyVal);
      const prevSet = treeExpandedRef.current;
      const nextExpanded = forceExpanded !== undefined ? forceExpanded : !prevSet.has(keyStr);
      const nextSet = new Set(prevSet);
      if (nextExpanded) nextSet.add(keyStr);
      else nextSet.delete(keyStr);
      commitTreeExpandedKeys(nextSet);

      const node = treeForestRef.current?.nodeByKey.get(keyStr);
      if (node && treeDataRef.current?.onRowExpand) {
        treeDataRef.current.onRowExpand({
          row: node.record,
          rowKey: node.key,
          expanded: nextExpanded,
          depth: node.depth,
        });
      }
    },
    [commitTreeExpandedKeys]
  );

  const handleGridToggleTreeExpand = useCallback(
    (rowKeyVal: string | number) => {
      toggleTreeRow(rowKeyVal);
    },
    [toggleTreeRow]
  );

  const expandAllTree = useCallback(() => {
    const forest = treeForestRef.current;
    if (!forest) return;
    commitTreeExpandedKeys(new Set(forest.allExpandableKeys));
  }, [commitTreeExpandedKeys]);

  const collapseAllTree = useCallback(() => {
    commitTreeExpandedKeys(new Set());
  }, [commitTreeExpandedKeys]);

  const expandTreeToDepth = useCallback(
    (depth: number) => {
      const forest = treeForestRef.current;
      if (!forest) return;
      commitTreeExpandedKeys(new Set(forest.getKeysUpToDepth(depth)));
    },
    [commitTreeExpandedKeys]
  );

  const [internalDetailExpandedKeys, setInternalDetailExpandedKeys] = useState<Set<string>>(() =>
    new Set(detailRow?.defaultExpandedKeys?.map(String) ?? [])
  );
  const detailDefaultSigRef = useRef<string>(
    detailRow?.defaultExpandedKeys ? detailRow.defaultExpandedKeys.join(',') : ''
  );
  useEffect(() => {
    const nextSig = detailRow?.defaultExpandedKeys ? detailRow.defaultExpandedKeys.join(',') : '';
    if (detailDefaultSigRef.current === nextSig) return;
    detailDefaultSigRef.current = nextSig;
    if (detailRow?.expandedKeys === undefined) {
      setInternalDetailExpandedKeys(new Set(detailRow?.defaultExpandedKeys?.map(String) ?? []));
    }
  }, [detailRow?.defaultExpandedKeys, detailRow?.expandedKeys]);

  const effectiveDetailExpandedKeys = useMemo<ReadonlySet<string>>(() => {
    if (detailRow?.expandedKeys !== undefined) {
      const next = new Set<string>();
      detailRow.expandedKeys.forEach((k) => next.add(String(k)));
      return next;
    }
    return internalDetailExpandedKeys;
  }, [detailRow?.expandedKeys, internalDetailExpandedKeys]);

  const detailRowRef = useRef(detailRow);
  detailRowRef.current = detailRow;
  const detailExpandedRef = useRef(effectiveDetailExpandedKeys);
  detailExpandedRef.current = effectiveDetailExpandedKeys;

  const commitDetailExpandedKeys = useCallback((nextSet: Set<string>) => {
    if (detailRowRef.current?.expandedKeys === undefined) {
      setInternalDetailExpandedKeys(nextSet);
    }
    detailRowRef.current?.onExpandedKeysChange?.(Array.from(nextSet));
  }, []);

  const getCellValue = useMemo<(row: TRecord, colKey: string) => unknown>(() => {
    if (customGetCellValue) return customGetCellValue;
    return (row: TRecord, colKey: string) => {
      const col = colMap[colKey];
      if (col?.valueGetter) return col.valueGetter(row, 0);
      return defaultGetCellValue(row, colKey);
    };
  }, [customGetCellValue, colMap]);

  const searchableColumnKeys = useMemo(
    () =>
      resolvedColumns
        .filter(
          (c) =>
            c.dataType !== DATA_TYPES.SYSTEM &&
            !c.isRowNumber &&
            !c.isSelection &&
            !c.isDetailExpand &&
            c.enableGlobalFilter !== false
        )
        .map((c) => c.key),
    [resolvedColumns]
  );

  const getSearchText = useMemo(() => {
    if (customGetSearchText) return customGetSearchText;
    return (row: TRecord) =>
      searchableColumnKeys
        .map((k) => getCellValue(row, k))
        .filter((v) => v !== null && v !== undefined && String(v).trim() !== '')
        .join(' ');
  }, [customGetSearchText, searchableColumnKeys, getCellValue]);

  const rowKeyCacheRef = useRef<{
    rowsRef: TRecord[];
    getRowKeyRef: (row: TRecord, index: number) => string;
    arr: (string | undefined)[];
  }>({ rowsRef: rows, getRowKeyRef: getRowKey, arr: [] });

  if (
    rowKeyCacheRef.current.rowsRef !== rows ||
    rowKeyCacheRef.current.getRowKeyRef !== getRowKey
  ) {
    rowKeyCacheRef.current = {
      rowsRef: rows,
      getRowKeyRef: getRowKey,
      arr: new Array(rows.length),
    };
  }

  const getRowKeyAt = useCallback((origIdx: number): string => {
    const cache = rowKeyCacheRef.current;
    let k = cache.arr[origIdx];
    if (k === undefined) {
      const rec = cache.rowsRef[origIdx];
      k = rec !== undefined ? cache.getRowKeyRef(rec, origIdx) : `row_${origIdx}`;
      cache.arr[origIdx] = k;
    }
    return k;
  }, []);

  // Loại bỏ key đã chọn không còn trong tập dữ liệu mới (bỏ qua ngay khi chưa tick dòng nào)
  useEffect(() => {
    if (checkedRowKeysRef.current.size === 0) return;
    const valid = new Set<string>();
    for (let i = 0; i < rows.length; i++) {
      valid.add(getRowKeyAt(i));
    }
    setCheckedRowKeys((prev) => {
      if (prev.size === 0) return prev;
      let changed = false;
      const next = new Set<string | number>();
      prev.forEach((k) => {
        if (valid.has(String(k))) next.add(k);
        else changed = true;
      });
      return changed ? next : prev;
    });
  }, [rows, getRowKey, getRowKeyAt]);

  const getRowVal = useCallback(
    (rowIndex: number, colKey: string): unknown => {
      const rec = rows[rowIndex];
      if (!rec) return undefined;
      return getCellValue(rec, colKey);
    },
    [rows, getCellValue]
  );

  const activeColEntries = useMemo(() => {
    return Object.entries(deferredColumnFilters).filter(([k, f]) => {
      if (!f) return false;
      if (k === 'col_chk') {
        return f.val === CHECK_FILTER_STATES.CHECKED || f.val === CHECK_FILTER_STATES.UNCHECKED;
      }
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

  const [filterEngine, setFilterEngine] = useState<FilterEngineMod | null>(() => _filterEngineMod);
  const hasDateOrTimeCol = useMemo(
    () => resolvedColumns.some((c) => c.dataType === DATA_TYPES.DATE || c.dataType === DATA_TYPES.TIME),
    [resolvedColumns]
  );
  const requiresFullFilter = useMemo(
    () =>
      activeColEntries.some(([k, f]) =>
        needsFullFilterEngine(f.op, f.val, colMap[k]?.dataType || DATA_TYPES.TEXT, f)
      ),
    [activeColEntries, colMap]
  );

  useEffect(() => {
    if (filterEngine) return;
    if (!requiresFullFilter && !(features.enableFiltering && hasDateOrTimeCol)) return;
    let active = true;
    ensureFilterEngine().then((m) => {
      if (active) setFilterEngine(() => m);
    });
    return () => {
      active = false;
    };
  }, [filterEngine, requiresFullFilter, features.enableFiltering, hasDateOrTimeCol]);

  const effectiveMatchFilter = filterEngine ? filterEngine.matchFilterValue : matchSimpleFilterSync;

  const chkFilterVal = deferredColumnFilters['col_chk']?.val;
  const totalRowCount = rows.length;

  const filteredRowIndices = useMemo(() => {
    if (
      !features.enableFiltering &&
      !features.enableQuickSearch &&
      !features.enableQueryBuilder
    ) {
      return null;
    }

    const q = deferredQuickFilterText.trim().toLowerCase();
    const hasSearch = features.enableQuickSearch && q.length > 0;
    const hasColFilters = features.enableFiltering && activeColEntries.length > 0;
    const hasQueryTree = features.enableQueryBuilder && hasActiveQueryRules(appliedQueryTree);

    if (!hasSearch && !hasColFilters && !hasQueryTree) return null;

    const requireChecked = features.enableFiltering && chkFilterVal === CHECK_FILTER_STATES.CHECKED;
    const requireUnchecked = features.enableFiltering && chkFilterVal === CHECK_FILTER_STATES.UNCHECKED;
    const needRowKey = requireChecked || requireUnchecked;
    const matched: number[] = [];

    for (let r = 0; r < totalRowCount; r++) {
      const rec = rows[r];
      if (!rec) continue;
      if (needRowKey) {
        const rKey = getRowKeyAt(r);
        if (requireChecked && !checkedRowKeys.has(rKey)) continue;
        if (requireUnchecked && checkedRowKeys.has(rKey)) continue;
      }

      if (hasColFilters) {
        let matchedCols = true;
        for (let i = 0; i < activeColEntries.length; i++) {
          const [colKey, fVal] = activeColEntries[i];
          if (colKey === 'col_chk') continue;
          const dataType = colMap[colKey]?.dataType || DATA_TYPES.TEXT;
          const cellVal = getRowVal(r, colKey);
          if (!effectiveMatchFilter(cellVal, fVal.op, fVal.val, dataType, fVal)) {
            matchedCols = false;
            break;
          }
        }
        if (!matchedCols) continue;
      }

      if (hasSearch) {
        const text = getSearchText(rec).toLowerCase();
        if (!text.includes(q)) continue;
      }

      if (hasQueryTree && queryEvaluator) {
        if (!queryEvaluator(appliedQueryTree!, null, r, getRowVal)) {
          continue;
        }
      }

      matched.push(r);
    }

    return matched;
  }, [
    features.enableFiltering,
    features.enableQuickSearch,
    features.enableQueryBuilder,
    deferredQuickFilterText,
    activeColEntries,
    appliedQueryTree,
    queryEvaluator,
    chkFilterVal,
    totalRowCount,
    rows,
    getRowKeyAt,
    checkedRowKeys,
    colMap,
    getRowVal,
    getSearchText,
    effectiveMatchFilter,
  ]);

  const getDistinctValues = useCallback(
    (targetColKey: string) => {
      const q = deferredQuickFilterText.trim().toLowerCase();
      const hasSearch = q.length > 0;
      const hasQueryTree = hasActiveQueryRules(appliedQueryTree);
      const requireChecked = chkFilterVal === CHECK_FILTER_STATES.CHECKED;
      const requireUnchecked = chkFilterVal === CHECK_FILTER_STATES.UNCHECKED;
      const needRowKey = requireChecked || requireUnchecked;
      const otherColEntries = activeColEntries.filter(([k]) => k !== targetColKey);
      const targetFilter = deferredColumnFilters[targetColKey];
      const hasTargetRowFilter = Boolean(
        targetFilter &&
          (targetFilter.val ||
            targetFilter.mode === FILTER_MODES.MULTI ||
            isNoInputFilterOp(targetFilter.op))
      );

      const valuesSet = new Set<string>();
      let hasBlanks = false;

      for (let r = 0; r < totalRowCount; r++) {
        const rec = rows[r];
        if (!rec) continue;
        if (needRowKey) {
          const rKey = getRowKeyAt(r);
          if (requireChecked && !checkedRowKeys.has(rKey)) continue;
          if (requireUnchecked && checkedRowKeys.has(rKey)) continue;
        }

        if (otherColEntries.length > 0) {
          let matchedOther = true;
          for (let i = 0; i < otherColEntries.length; i++) {
            const [colKey, fVal] = otherColEntries[i];
            if (colKey === 'col_chk') continue;
            const dataType = colMap[colKey]?.dataType || DATA_TYPES.TEXT;
            if (!effectiveMatchFilter(getRowVal(r, colKey), fVal.op, fVal.val, dataType, fVal)) {
              matchedOther = false;
              break;
            }
          }
          if (!matchedOther) continue;
        }

        if (hasTargetRowFilter && targetFilter) {
          const dataType = colMap[targetColKey]?.dataType || DATA_TYPES.TEXT;
          const rowFilterObj = {
            ...targetFilter,
            selectedValues: undefined,
            includeBlanks: undefined,
          };
          if (
            !effectiveMatchFilter(
              getRowVal(r, targetColKey),
              targetFilter.op,
              targetFilter.val,
              dataType,
              rowFilterObj
            )
          ) {
            continue;
          }
        }

        if (hasSearch && !getSearchText(rec).toLowerCase().includes(q)) {
          continue;
        }

        if (hasQueryTree && queryEvaluator && !queryEvaluator(appliedQueryTree!, null, r, getRowVal)) {
          continue;
        }

        const val = getRowVal(r, targetColKey);
        if (val === null || val === undefined || String(val).trim() === '') {
          hasBlanks = true;
        } else {
          valuesSet.add(String(val).trim());
        }
      }

      const values = Array.from(valuesSet);
      const targetType = colMap[targetColKey]?.dataType || DATA_TYPES.TEXT;
      if (targetType === DATA_TYPES.NUMBER) {
        values.sort((a, b) => Number(a) - Number(b));
      } else {
        const collator = new Intl.Collator('vi', { sensitivity: 'base', numeric: true });
        values.sort((a, b) => collator.compare(a, b));
      }

      return { values, hasBlanks };
    },
    [
      deferredQuickFilterText,
      appliedQueryTree,
      queryEvaluator,
      chkFilterVal,
      activeColEntries,
      deferredColumnFilters,
      totalRowCount,
      rows,
      getRowKeyAt,
      checkedRowKeys,
      colMap,
      getRowVal,
      getSearchText,
      effectiveMatchFilter,
    ]
  );

  const getColumnDateBounds = useCallback(
    (colKey: string) => {
      if (filterEngine) {
        return filterEngine.getColumnDateBoundsFromGetter(getRowVal, totalRowCount, colKey);
      }
      void ensureFilterEngine().then((m) => setFilterEngine(() => m));
      return { min: '', max: '' };
    },
    [filterEngine, totalRowCount, getRowVal]
  );

  const matchedTreeIndexSet = useMemo<ReadonlySet<number> | null>(() => {
    if (!isTreeActive || !filteredRowIndices) return null;
    return new Set(filteredRowIndices);
  }, [isTreeActive, filteredRowIndices]);

  const treeSortRankBySourceIndex = useMemo<Int32Array | null>(() => {
    if (!isTreeActive || !features.enableSorting || sortRules.length === 0 || totalRowCount <= 0) {
      return null;
    }
    const base = Array.from({ length: totalRowCount }, (_, i) => i);
    const effectiveRules = features.enableMultiSort ? sortRules : sortRules.slice(0, 1);
    const sorted = sortRowIndicesMulti({
      baseIndices: base,
      rules: effectiveRules,
      colMap,
      getRowVal,
      rows,
      rowKeys: EMPTY_ROWS,
      getRowKeyAt,
      checkedRowKeys,
      formulaMode: effectiveFormulaMode,
    });
    const ranks = new Int32Array(totalRowCount);
    for (let i = 0; i < sorted.length; i++) {
      ranks[sorted[i]] = i;
    }
    return ranks;
  }, [
    isTreeActive,
    features.enableSorting,
    features.enableMultiSort,
    sortRules,
    totalRowCount,
    colMap,
    getRowVal,
    rows,
    getRowKeyAt,
    checkedRowKeys,
    effectiveFormulaMode,
  ]);

  const flattenedTreeRows = useMemo<FlattenedTreeRow[] | null>(() => {
    if (!isTreeActive || !treeForest) return null;
    return flattenVisibleTreeNodes({
      forest: treeForest,
      expandedKeys: effectiveTreeExpandedKeys,
      matchedIndexSet: matchedTreeIndexSet,
      filterMode: treeData?.filterMode ?? 'preserveAncestors',
      sortRankBySourceIndex: treeSortRankBySourceIndex,
    });
  }, [
    isTreeActive,
    treeForest,
    effectiveTreeExpandedKeys,
    matchedTreeIndexSet,
    treeData?.filterMode,
    treeSortRankBySourceIndex,
  ]);

  const treeMetaBySourceIndex = useMemo(() => {
    if (!flattenedTreeRows) return null;
    const map = new Map<number, FlattenedTreeRow>();
    for (let i = 0; i < flattenedTreeRows.length; i++) {
      map.set(flattenedTreeRows[i].sourceIndex, flattenedTreeRows[i]);
    }
    return map;
  }, [flattenedTreeRows]);

  const displayRowIndices = useMemo(() => {
    if (flattenedTreeRows) {
      return flattenedTreeRows.map((item) => item.sourceIndex);
    }
    let base = filteredRowIndices;
    if (!features.enableSorting || sortRules.length === 0) return base;
    if (!base) {
      base = Array.from({ length: totalRowCount }, (_, i) => i);
    }

    const effectiveRules = features.enableMultiSort ? sortRules : sortRules.slice(0, 1);
    return sortRowIndicesMulti({
      baseIndices: base,
      rules: effectiveRules,
      colMap,
      getRowVal,
      rows,
      rowKeys: EMPTY_ROWS,
      getRowKeyAt,
      checkedRowKeys,
      formulaMode: effectiveFormulaMode,
    });
  }, [
    flattenedTreeRows,
    features.enableSorting,
    features.enableMultiSort,
    filteredRowIndices,
    sortRules,
    totalRowCount,
    colMap,
    checkedRowKeys,
    getRowKeyAt,
    getRowVal,
    rows,
    effectiveFormulaMode,
  ]);

  const activeRowIndices = displayRowIndices ?? filteredRowIndices;
  const totalFilteredRows = activeRowIndices ? activeRowIndices.length : totalRowCount;

  const isServerPaginated = Boolean(resolvedOnPageChange || resolvedOnPageSizeChange);
  const effectivePaginationEnabled =
    pagination === false ? false : enablePagination ?? features.enableStatusBar;
  const currentPageSize =
    resolvedControlledPageSize !== undefined && resolvedControlledPageSize > 0
      ? Math.floor(resolvedControlledPageSize)
      : internalPageSize;
  const rawPage =
    resolvedControlledPage !== undefined && resolvedControlledPage > 0
      ? Math.floor(resolvedControlledPage)
      : internalPage;
  const totalPagerItems = isServerPaginated
    ? (resolvedServerTotal ?? totalFilteredRows)
    : totalFilteredRows;
  const shouldSliceClientPage = effectivePaginationEnabled && !isServerPaginated;
  const clientTotalPages =
    totalFilteredRows > 0 ? Math.max(1, Math.ceil(totalFilteredRows / currentPageSize)) : 1;
  const currentPage = shouldSliceClientPage
    ? totalFilteredRows > 0
      ? Math.min(Math.max(1, rawPage), clientTotalPages)
      : 1
    : Math.max(1, rawPage);

  const pagedRowIndices = useMemo<number[] | null>(() => {
    if (!shouldSliceClientPage) return activeRowIndices;
    if (totalFilteredRows === 0) return EMPTY_ROWS as number[];
    const start = (currentPage - 1) * currentPageSize;
    const end = Math.min(totalFilteredRows, start + currentPageSize);
    if (activeRowIndices) {
      return activeRowIndices.slice(start, end);
    }
    const sliced: number[] = [];
    for (let i = start; i < end; i++) {
      sliced.push(i);
    }
    return sliced;
  }, [shouldSliceClientPage, activeRowIndices, totalFilteredRows, currentPage, currentPageSize]);
  pagedRowIndicesRef.current = pagedRowIndices;

  const totalPageRowCount = shouldSliceClientPage ? pagedRowIndices?.length ?? 0 : totalFilteredRows;
  const rowNumberOffset = effectivePaginationEnabled ? (currentPage - 1) * currentPageSize : 0;

  const selectionHeaderState = useMemo(() => {
    const visibleCount = pagedRowIndices ? pagedRowIndices.length : totalPageRowCount;
    if (visibleCount === 0 || checkedRowKeys.size === 0) {
      return { allChecked: false, indeterminate: false };
    }
    let checkedVisible = 0;
    for (let i = 0; i < visibleCount; i++) {
      const origIdx = pagedRowIndices ? pagedRowIndices[i] : i;
      if (checkedRowKeys.has(getRowKeyAt(origIdx))) {
        checkedVisible++;
      }
    }
    return {
      allChecked: checkedVisible === visibleCount,
      indeterminate: checkedVisible > 0 && checkedVisible < visibleCount,
    };
  }, [pagedRowIndices, totalPageRowCount, checkedRowKeys, getRowKeyAt]);

  const handleToggleAllVisible = useCallback(() => {
    const visibleCount = pagedRowIndices ? pagedRowIndices.length : totalPageRowCount;
    if (visibleCount === 0) return;

    setCheckedRowKeys((prev) => {
      const next = new Set(prev);
      if (selectionHeaderState.allChecked) {
        if (!pagedRowIndices) return new Set();
        for (let i = 0; i < visibleCount; i++) {
          next.delete(getRowKeyAt(pagedRowIndices[i]));
        }
      } else {
        for (let i = 0; i < visibleCount; i++) {
          const origIdx = pagedRowIndices ? pagedRowIndices[i] : i;
          next.add(getRowKeyAt(origIdx));
        }
      }
      return next;
    });
  }, [pagedRowIndices, totalPageRowCount, selectionHeaderState.allChecked, getRowKeyAt]);

  const columns = useMemo<ColumnDef<TRecord>[]>(() => {
    return resolvedColumns.map((col) => {
      if (col.key === 'col_chk') {
        return {
          ...col,
          title: '',
          renderHeader: () => (
            <GridSelectionCheckbox
              checked={selectionHeaderState.allChecked}
              indeterminate={selectionHeaderState.indeterminate}
              onChange={handleToggleAllVisible}
              size={16}
              spring="snappy"
            />
          ),
        } as ColumnDef<TRecord>;
      }
      return col;
    });
  }, [
    resolvedColumns,
    selectionHeaderState.allChecked,
    selectionHeaderState.indeterminate,
    handleToggleAllVisible,
  ]);

  const orderedColumns = useMemo<ColumnDef<TRecord>[]>(() => {
    if (columnOrder.length === 0) return columns;
    const map = new Map(columns.map((c) => [c.key, c]));
    const ordered: ColumnDef<TRecord>[] = [];
    columnOrder.forEach((key) => {
      const col = map.get(key);
      if (col) {
        ordered.push(col);
        map.delete(key);
      }
    });
    map.forEach((col) => ordered.push(col));
    return ordered;
  }, [columns, columnOrder]);

  const resolvedTreeColumnKey = useMemo(() => {
    if (!isTreeActive) return undefined;
    if (treeData?.treeColumnKey) return treeData.treeColumnKey;
    return orderedColumns.find(
      (c) =>
        c.dataType !== DATA_TYPES.SYSTEM &&
        !c.isRowNumber &&
        !c.isSelection &&
        !c.isDetailExpand &&
        !hiddenColKeys.has(c.key)
    )?.key;
  }, [isTreeActive, treeData?.treeColumnKey, orderedColumns, hiddenColKeys]);

  const handleToggleGroupCollapse = useCallback((path: string) => {
    setExpandedGroupPaths((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  }, []);

  const numericColumnKeys = useMemo(
    () =>
      resolvedColumns
        .filter(
          (c) =>
            c.dataType === DATA_TYPES.NUMBER &&
            !c.isRowNumber &&
            !c.isSelection &&
            !c.isDetailExpand
        )
        .map((c) => c.key),
    [resolvedColumns]
  );

  const columnSums = useMemo<Record<string, number>>(() => {
    if (!features.enableSummary || numericColumnKeys.length === 0) return EMPTY_SUMS;
    const sums: Record<string, number> = {};

    for (const key of numericColumnKeys) {
      sums[key] = 0;
    }

    const count = pagedRowIndices ? pagedRowIndices.length : totalPageRowCount;
    for (let i = 0; i < count; i++) {
      const origIdx = pagedRowIndices ? pagedRowIndices[i] : i;
      for (const key of numericColumnKeys) {
        const raw = getRowVal(origIdx, key);
        if (typeof raw === 'number') {
          if (Number.isFinite(raw)) sums[key] += raw;
          continue;
        }
        if (raw === null || raw === undefined || String(raw).trim() === '') continue;
        const num = Number(raw);
        if (Number.isFinite(num)) {
          sums[key] += num;
        }
      }
    }

    return sums;
  }, [features.enableSummary, numericColumnKeys, pagedRowIndices, totalPageRowCount, getRowVal]);

  const [groupingMod, setGroupingMod] = useState<GroupingEngineMod | null>(() => _groupingMod);
  useEffect(() => {
    if (groupingMod || !features.enableGrouping || !groupByColumnKey) return;
    let active = true;
    ensureGroupingEngine().then((m) => {
      if (active) setGroupingMod(() => m);
    });
    return () => {
      active = false;
    };
  }, [groupingMod, features.enableGrouping, groupByColumnKey]);

  const groupBuckets = useMemo<GroupBucketsResult | null>(() => {
    if (!features.enableGrouping || !groupByColumnKey || !groupingMod || isTreeActive) return null;
    return groupingMod.buildGroupBuckets({
      groupByColumnKey,
      pagedRowIndices,
      totalPageRowCount,
      getRowVal,
      colMap,
      numericColumnKeys,
    });
  }, [
    groupingMod,
    features.enableGrouping,
    groupByColumnKey,
    pagedRowIndices,
    totalPageRowCount,
    getRowVal,
    colMap,
    numericColumnKeys,
  ]);

  const groupedDisplayModel = useMemo(() => {
    if (!groupBuckets || !groupByColumnKey || !groupingMod) return null;
    return groupingMod.buildGroupedDisplayModel({
      groupBuckets,
      groupByColumnKey,
      groupSortConfig,
      expandedGroupPaths,
      onToggleCollapse: handleToggleGroupCollapse,
    });
  }, [
    groupingMod,
    groupBuckets,
    groupByColumnKey,
    groupSortConfig,
    expandedGroupPaths,
    handleToggleGroupCollapse,
  ]);

  useEffect(() => {
    groupedDisplayModelRef.current = groupedDisplayModel;
  }, [groupedDisplayModel]);

  const toggleDetailRow = useCallback(
    (rowKeyVal: string | number, forceExpanded?: boolean, rowObj?: any, rowIdx?: number) => {
      if (!isDetailActive) return;
      const keyStr = String(rowKeyVal);
      const prevSet = detailExpandedRef.current;
      const nextExpanded = forceExpanded !== undefined ? forceExpanded : !prevSet.has(keyStr);
      if (
        nextExpanded &&
        rowObj !== undefined &&
        detailRowRef.current?.canExpand &&
        !detailRowRef.current.canExpand(rowObj, rowIdx ?? 0)
      ) {
        return;
      }
      const nextSet =
        detailRowRef.current?.accordion && nextExpanded ? new Set<string>([keyStr]) : new Set(prevSet);
      if (nextExpanded) nextSet.add(keyStr);
      else nextSet.delete(keyStr);
      commitDetailExpandedKeys(nextSet);
      detailRowRef.current?.onExpandChange?.({
        row: rowObj,
        rowKey: keyStr,
        expanded: nextExpanded,
      });
    },
    [isDetailActive, commitDetailExpandedKeys]
  );

  const handleGridToggleRowDetail = useCallback(
    (rowKeyVal: string | number, rowObj: any) => {
      const idx = typeof rowObj?._dataPageIndex === 'number' ? rowObj._dataPageIndex : 0;
      toggleDetailRow(rowKeyVal, undefined, rowObj?._baseRecord ?? rowObj, idx);
    },
    [toggleDetailRow]
  );

  const expandAllDetails = useCallback(() => {
    if (!isDetailActive) return;
    const pIndices = pagedRowIndicesRef.current;
    const count = pIndices ? pIndices.length : rows.length;
    const next = new Set<string>();
    for (let i = 0; i < count; i++) {
      const origIdx = pIndices ? pIndices[i] : i;
      const rec = rows[origIdx];
      if (!rec) continue;
      if (detailRowRef.current?.canExpand && !detailRowRef.current.canExpand(rec, i)) continue;
      next.add(getRowKeyAt(origIdx));
      if (detailRowRef.current?.accordion) break;
    }
    commitDetailExpandedKeys(next);
  }, [isDetailActive, rows, getRowKeyAt, commitDetailExpandedKeys]);

  const collapseAllDetails = useCallback(() => {
    commitDetailExpandedKeys(new Set());
  }, [commitDetailExpandedKeys]);

  const isRowDetailExpanded = useCallback(
    (rowKeyVal: string | number) => effectiveDetailExpandedKeys.has(String(rowKeyVal)),
    [effectiveDetailExpandedKeys]
  );

  const canExpandRowDetail = useMemo(() => {
    if (!isDetailActive || !detailRow?.canExpand) return undefined;
    const fn = detailRow.canExpand;
    return (rowObj: any, idx: number) => fn(rowObj?._baseRecord ?? rowObj, idx);
  }, [isDetailActive, detailRow?.canExpand]);

  const renderDetailRow = useMemo(() => {
    if (!isDetailActive || !detailRow?.renderDetail) return undefined;
    return (syntheticRow: any) =>
      detailRow.renderDetail({
        row: syntheticRow._parentRow,
        rowKey: syntheticRow._parentKey,
        rowIndex: syntheticRow._parentPageIndex ?? 0,
        close: () => toggleDetailRow(syntheticRow._parentKey, false, syntheticRow._parentRow),
      });
  }, [isDetailActive, detailRow, toggleDetailRow]);

  const hasDynamicDetailRows = Boolean(
    isDetailActive && (detailRow?.height === undefined || detailRow?.height === 'auto')
  );

  const detailDisplaySlots = useMemo(() => {
    if (!isDetailActive || groupedDisplayModel || effectiveDetailExpandedKeys.size === 0) {
      return null;
    }
    const slots: Array<
      | { kind: 'data'; origIdx: number; dataPageIndex: number; rowKey: string }
      | {
          kind: 'detail';
          origIdx: number;
          dataPageIndex: number;
          parentKey: string;
          baseRecord: any;
        }
    > = [];
    for (let i = 0; i < totalPageRowCount; i++) {
      const origIdx = pagedRowIndices ? pagedRowIndices[i] : i;
      const baseRecord = rows[origIdx];
      if (!baseRecord) continue;
      const rKey = getRowKeyAt(origIdx);
      slots.push({ kind: 'data', origIdx, dataPageIndex: i, rowKey: rKey });
      if (
        effectiveDetailExpandedKeys.has(rKey) &&
        (!detailRow?.canExpand || detailRow.canExpand(baseRecord, i))
      ) {
        slots.push({
          kind: 'detail',
          origIdx,
          dataPageIndex: i,
          parentKey: rKey,
          baseRecord,
        });
      }
    }
    return slots;
  }, [
    isDetailActive,
    groupedDisplayModel,
    effectiveDetailExpandedKeys,
    totalPageRowCount,
    pagedRowIndices,
    rows,
    getRowKeyAt,
    detailRow?.canExpand,
  ]);

  const totalVirtualRowCount = groupedDisplayModel
    ? groupedDisplayModel.length
    : detailDisplaySlots
    ? detailDisplaySlots.length
    : totalPageRowCount;

  const getRow = useCallback(
    (index: number): any => {
      if (groupedDisplayModel) {
        const item = groupedDisplayModel[index];
        if (!item) return null;
        if (item._isGroupRow) return item;
        const baseRecord = rows[item.originalIndex];
        if (!baseRecord) return null;
        const rKey = getRowKeyAt(item.originalIndex);
        return {
          ...baseRecord,
          _baseRecord: baseRecord,
          _rowKey: rKey,
          rowIndex: index,
          originalIndex: item.originalIndex,
          localRowIndex: item.localIndex,
          groupIndex: item.groupIndex,
          col_stt: item.localIndex + 1,
          col_chk: checkedRowKeysRef.current.has(rKey),
        };
      }

      if (detailDisplaySlots) {
        const slot = detailDisplaySlots[index];
        if (!slot) return null;
        if (slot.kind === 'detail') {
          return {
            _isDetailRow: true,
            _rowKey: `__detail__${slot.parentKey}`,
            _parentRow: slot.baseRecord,
            _parentKey: slot.parentKey,
            _parentPageIndex: slot.dataPageIndex,
            _detailFixedHeight:
              typeof detailRow?.height === 'number' ? detailRow.height : undefined,
            _detailEstimatedHeight: detailRow?.estimatedHeight,
            _detailUnstyled: Boolean(detailRow?.unstyled),
          };
        }
        const baseRecord = rows[slot.origIdx];
        if (!baseRecord) return null;
        const treeMeta = treeMetaBySourceIndex?.get(slot.origIdx);
        return {
          ...baseRecord,
          _baseRecord: baseRecord,
          _rowKey: slot.rowKey,
          originalIndex: slot.origIdx,
          _dataPageIndex: slot.dataPageIndex,
          col_stt: rowNumberOffset + slot.dataPageIndex + 1,
          col_chk: checkedRowKeysRef.current.has(slot.rowKey),
          ...(treeMeta
            ? {
                _treeDepth: treeMeta.depth,
                _treeHasChildren: treeMeta.hasChildren,
                _treeExpanded: treeMeta.isExpanded,
                _treeKey: treeMeta.key,
              }
            : {}),
        };
      }

      const origIdx = pagedRowIndices ? pagedRowIndices[index] : index;
      const baseRecord = rows[origIdx] ?? null;
      if (!baseRecord) return null;
      if (isTreeActive && treeMetaBySourceIndex) {
        const treeMeta = treeMetaBySourceIndex.get(origIdx);
        const rKey = getRowKeyAt(origIdx);
        if (treeMeta) {
          return {
            ...baseRecord,
            _baseRecord: baseRecord,
            _rowKey: rKey,
            originalIndex: origIdx,
            _treeDepth: treeMeta.depth,
            _treeHasChildren: treeMeta.hasChildren,
            _treeExpanded: treeMeta.isExpanded,
            _treeKey: treeMeta.key,
          };
        }
      }
      return baseRecord;
    },
    [
      groupedDisplayModel,
      detailDisplaySlots,
      detailRow?.height,
      detailRow?.estimatedHeight,
      detailRow?.unstyled,
      treeMetaBySourceIndex,
      isTreeActive,
      pagedRowIndices,
      rows,
      getRowKeyAt,
      rowNumberOffset,
    ]
  );

  const handlePageChange = useCallback(
    (nextPage: number) => {
      const normalized = Math.max(1, Math.floor(nextPage));
      if (resolvedOnPageChange) {
        resolvedOnPageChange(normalized);
      } else {
        setInternalPage(normalized);
      }
      gridRef.current?.scrollToRow(0);
    },
    [resolvedOnPageChange]
  );

  const handlePageSizeChange = useCallback(
    (nextSize: number) => {
      const normalized = nextSize > 0 ? Math.floor(nextSize) : DEFAULT_PAGE_SIZE;
      if (resolvedOnPageSizeChange) {
        resolvedOnPageSizeChange(normalized);
      } else {
        setInternalPageSize(normalized);
        if (resolvedOnPageChange) {
          resolvedOnPageChange(1);
        } else {
          setInternalPage(1);
        }
      }
      gridRef.current?.scrollToRow(0);
    },
    [resolvedOnPageSizeChange, resolvedOnPageChange]
  );

  const handleGetRowId = useCallback(
    (row: any, index: number): string => {
      if (row?._isGroupRow) return row.path;
      if (row?._rowKey !== undefined) return String(row._rowKey);
      if (index >= 0) {
        const pIndices = pagedRowIndicesRef.current;
        const origIdx = pIndices ? pIndices[index] : index;
        if (origIdx !== undefined && origIdx >= 0 && origIdx < rows.length && rows[origIdx] === row) {
          return getRowKeyAt(origIdx);
        }
      }
      return getRowKey(row, index);
    },
    [rows, getRowKeyAt, getRowKey]
  );

  const handleToggleCheck = useCallback(
    (rowIndex: number, row: any, e: React.MouseEvent) => {
      e.stopPropagation();
      if (!row || row._isGroupRow || row._isDetailRow) return;
      const targetKey =
        row?._rowKey !== undefined ? String(row._rowKey) : handleGetRowId(row, rowIndex);
      if (!targetKey) return;

      const dispIdx =
        typeof row?._dataPageIndex === 'number'
          ? row._dataPageIndex
          : typeof row?.rowIndex === 'number'
          ? row.rowIndex
          : rowIndex;

      setCheckedRowKeys((prev) => {
        const next = new Set(prev);
        const shouldCheck = !next.has(targetKey);

        if (e?.shiftKey && lastCheckedRowRef.current !== null) {
          const prevInfo = lastCheckedRowRef.current;
          const gModel = groupedDisplayModelRef.current;

          if (gModel && gModel.length > 0) {
            const start = Math.min(prevInfo.displayIdx, dispIdx);
            const end = Math.max(prevInfo.displayIdx, dispIdx);
            for (let i = start; i <= end; i++) {
              const it = gModel[i];
              if (it && !it._isGroupRow) {
                const k = getRowKeyAt(it.originalIndex);
                if (k) {
                  if (shouldCheck) next.add(k);
                  else next.delete(k);
                }
              }
            }
          } else {
            const pIndices = pagedRowIndicesRef.current;
            const maxLen = pIndices ? pIndices.length : rows.length;
            const start = Math.max(0, Math.min(prevInfo.displayIdx, dispIdx));
            const end = Math.min(maxLen - 1, Math.max(prevInfo.displayIdx, dispIdx));
            for (let i = start; i <= end; i++) {
              const origIdx = pIndices ? pIndices[i] : i;
              const k = getRowKeyAt(origIdx);
              if (k) {
                if (shouldCheck) next.add(k);
                else next.delete(k);
              }
            }
          }
        } else {
          if (shouldCheck) next.add(targetKey);
          else next.delete(targetKey);
        }

        if (next.size === 0) {
          setColumnFilters((prevFilters) => {
            if (prevFilters['col_chk']?.val === CHECK_FILTER_STATES.CHECKED) {
              const copy = { ...prevFilters };
              delete copy['col_chk'];
              return copy;
            }
            return prevFilters;
          });
        }

        return next;
      });

      lastCheckedRowRef.current = { displayIdx: dispIdx, rowKey: targetKey };
    },
    [handleGetRowId, getRowKeyAt, rows.length]
  );

  const handleClearCheckedRows = useCallback(() => {
    lastCheckedRowRef.current = null;
    setCheckedRowKeys(new Set());
    setColumnFilters((prevFilters) => {
      if (prevFilters['col_chk']?.val === CHECK_FILTER_STATES.CHECKED) {
        const copy = { ...prevFilters };
        delete copy['col_chk'];
        return copy;
      }
      return prevFilters;
    });
  }, []);

  const onRowClickRef = useRef(onRowClick);
  onRowClickRef.current = onRowClick;
  const onRowDetailRef = useRef(onRowDetail);
  onRowDetailRef.current = onRowDetail;

  const resolveRowCallbackArgs = useCallback(
    (row: any, rowIndex: number): [TRecord, number] => {
      const baseRecord = (row._baseRecord ?? row) as TRecord;
      const pIndices = pagedRowIndicesRef.current;
      const resolvedIdx =
        typeof row.originalIndex === 'number'
          ? row.originalIndex
          : rowIndex >= 0 && pIndices
          ? (pIndices[rowIndex] ?? rowIndex)
          : rowIndex;
      return [baseRecord, resolvedIdx];
    },
    []
  );

  const handleSelectRow = useCallback(
    (rowIndex: number, row: any) => {
      if (!row || row._isGroupRow || row._isDetailRow) return;
      const rk = row._rowKey !== undefined ? String(row._rowKey) : handleGetRowId(row, rowIndex);
      setSelectedRowKey(rk);
      if (isDetailActive && detailRowRef.current?.expandOnRowClick) {
        const pageIdx = typeof row._dataPageIndex === 'number' ? row._dataPageIndex : rowIndex;
        toggleDetailRow(rk, undefined, row._baseRecord ?? row, pageIdx);
      }
      if (onRowClickRef.current) {
        const [baseRecord, resolvedIdx] = resolveRowCallbackArgs(row, rowIndex);
        onRowClickRef.current(baseRecord, resolvedIdx);
      }
    },
    [handleGetRowId, resolveRowCallbackArgs, isDetailActive, toggleDetailRow]
  );

  const handleRowDetail = useCallback(
    (row: any, rowIndex: number) => {
      if (!row || row._isGroupRow || row._isDetailRow) return;
      const rk = row._rowKey !== undefined ? String(row._rowKey) : handleGetRowId(row, rowIndex);
      setSelectedRowKey(rk);
      const handler = onRowDetailRef.current ?? onRowClickRef.current;
      if (handler) {
        const [baseRecord, resolvedIdx] = resolveRowCallbackArgs(row, rowIndex);
        handler(baseRecord, resolvedIdx);
      }
    },
    [handleGetRowId, resolveRowCallbackArgs]
  );

  const handleColumnFilterChange = useCallback((colKey: string, filter: ColumnFilterValue) => {
    setColumnFilters((prev) => {
      if (colKey === 'col_chk') {
        if (!filter.val || filter.val === CHECK_FILTER_STATES.ALL) {
          const next = { ...prev };
          delete next[colKey];
          return next;
        }
        return { ...prev, [colKey]: createEqualsFilter(filter.val) };
      }
      return { ...prev, [colKey]: filter };
    });
  }, []);

  const handleClearAllColumnFilters = useCallback(() => {
    setColumnFilters({});
  }, []);

  const handleClearAllCriteria = useCallback(() => {
    setColumnFilters({});
    setQuickFilterText('');
    setSortRules([]);
    setGroupByColumnKey(null);
    setGroupSortConfig(null);
    setAppliedQueryTree(null);
    saveConfig({
      sortConfig: null,
      sortRules: [],
      groupByColumnKey: null,
      groupSortConfig: null,
    });
  }, [saveConfig]);

  const handleSortRulesChange = useCallback(
    (nextRules: SortConfig[]) => {
      const normalized = normalizeSortRules(nextRules);
      setSortRules(normalized);
      saveConfig({ sortRules: normalized, sortConfig: normalized[0] ?? null });
    },
    [saveConfig]
  );

  const handleSortChange = useCallback(
    (nextSort: SortConfig | null) => {
      const nextRules = nextSort ? normalizeSortRules([nextSort]) : [];
      setSortRules(nextRules);
      saveConfig({ sortRules: nextRules, sortConfig: nextRules[0] ?? null });
    },
    [saveConfig]
  );

  const handleColumnPinsChange = useCallback(
    (nextPins: Record<string, PinPosition>) => {
      setColumnPins(nextPins);
      saveConfig({ columnPins: nextPins });
    },
    [saveConfig]
  );

  const handleColWidthsChange = useCallback(
    (nextWidths: Record<string, number>) => {
      setColWidths(nextWidths);
      saveConfig({ colWidths: nextWidths });
    },
    [saveConfig]
  );

  const handleHiddenColKeysChange = useCallback(
    (nextHidden: Set<string>) => {
      setHiddenColKeys(nextHidden);
      saveConfig({ hiddenColKeys: Array.from(nextHidden) });
    },
    [saveConfig]
  );

  const handleReorderColumns = useCallback(
    (sourceKey: string, targetKey: string) => {
      if (!sourceKey || !targetKey || sourceKey === targetKey) return;
      setColumnOrder((prev) => {
        const base = prev.length > 0 ? [...prev] : columns.map((c) => c.key);
        const fromIdx = base.indexOf(sourceKey);
        const toIdx = base.indexOf(targetKey);
        if (fromIdx < 0 || toIdx < 0 || fromIdx === toIdx) return base;
        const [moved] = base.splice(fromIdx, 1);
        base.splice(toIdx, 0, moved);
        saveConfig({ columnOrder: base });
        return base;
      });
    },
    [columns, saveConfig]
  );

  const handleResetColumns = useCallback(() => {
    setColumnOrder([]);
    setColumnPins(defaultPins);
    setHiddenColKeys(new Set());
    setColWidths({});
    setSortRules([]);
    setGroupByColumnKey(null);
    setGroupSortConfig(null);
    setExpandedGroupPaths(new Set());
    writeGridStorageJson(storageKey, {});
  }, [defaultPins, storageKey]);

  const handleToggleGroupByColumn = useCallback(
    (colKey: string) => {
      setGroupByColumnKey((prev) => {
        const next = prev === colKey ? null : colKey;
        saveConfig({ groupByColumnKey: next, groupSortConfig: null });
        return next;
      });
      setGroupSortConfig(null);
      setExpandedGroupPaths(new Set());
    },
    [saveConfig]
  );

  const handleToggleGroupSort = useCallback(
    (colKey: string) => {
      setGroupSortConfig((prev) => {
        let next: GroupSortConfig | null;
        if (!prev || prev.colKey !== colKey) {
          next = { colKey, direction: SORT_DIRECTIONS.DESC };
        } else if (prev.direction === SORT_DIRECTIONS.DESC) {
          next = { colKey, direction: SORT_DIRECTIONS.ASC };
        } else {
          next = null;
        }
        saveConfig({ groupSortConfig: next });
        return next;
      });
    },
    [saveConfig]
  );

  const handleCollapseAllGroups = useCallback(() => {
    setExpandedGroupPaths(new Set());
  }, []);

  const handleExpandAllGroups = useCallback(() => {
    if (!groupBuckets) return;
    const all = new Set<string>();
    groupBuckets.entries.forEach((entry, idx) => {
      all.add(`group_${entry.groupValue}_${idx}`);
    });
    setExpandedGroupPaths(all);
  }, [groupBuckets]);

  const handleUngroup = useCallback(() => {
    setGroupByColumnKey(null);
    setGroupSortConfig(null);
    setExpandedGroupPaths(new Set());
    saveConfig({ groupByColumnKey: null, groupSortConfig: null });
  }, [saveConfig]);

  const handleCopyGroupTable = useCallback(
    (groupRow: any, includeHeaders = false) => {
      if (!groupRow?.originalIndices?.length) return;
      void ensureGroupingEngine().then((m) =>
        m.copyGroupTableToClipboard({
          groupRow,
          includeHeaders,
          orderedColumns,
          hiddenColKeys,
          getRowVal,
        })
      );
    },
    [orderedColumns, hiddenColKeys, getRowVal]
  );

  const renderCell = useCallback(
    (params: CellRenderParams<any>) => {
      const { column, row, isChecked } = params;
      if (!row) return null;

      if (column.key === 'col_stt' || column.isRowNumber) {
        const sttVal =
          row.localRowIndex !== undefined
            ? row.localRowIndex + 1
            : row.col_stt !== undefined
            ? row.col_stt
            : params.rowIndex >= 0
            ? rowNumberOffset + params.rowIndex + 1
            : typeof row.rowIndex === 'number' && row.rowIndex >= 0
            ? rowNumberOffset + row.rowIndex + 1
            : 1;
        return (
          <span
            className="w-full text-center text-xs font-semibold tabular-nums"
            style={{ color: 'var(--agv-text-muted)' }}
          >
            {sttVal}
          </span>
        );
      }

      if (column.key === 'col_detail_expand' || column.isDetailExpand) {
        return null;
      }

      if (column.key === 'col_chk' || column.isSelection) {
        const targetRowIndex =
          typeof row._dataPageIndex === 'number'
            ? row._dataPageIndex
            : typeof row.rowIndex === 'number'
            ? row.rowIndex
            : params.rowIndex;
        return (
          <GridSelectionCheckbox
            checked={Boolean(isChecked)}
            onChange={(e) => handleToggleCheck(targetRowIndex, row, e)}
            size={16}
            spring="snappy"
          />
        );
      }

      if (customRenderCell) {
        return customRenderCell(params);
      }

      const rawValue = getCellValue(row._baseRecord ?? row, column.key);
      if (rawValue === null || rawValue === undefined || rawValue === '') {
        return null;
      }

      const shouldWrap = Boolean(dynamicRowHeight && column.wrapText);
      const wrapOrTruncateCls = shouldWrap
        ? 'whitespace-normal [overflow-wrap:anywhere]'
        : 'truncate';

      if (column.dataType === DATA_TYPES.NUMBER) {
        const formatted = formatGridNumber(rawValue);
        return (
          <span className={`${wrapOrTruncateCls} tabular-nums`}>
            {formatted || String(rawValue)}
          </span>
        );
      }

      if (column.dataType === DATA_TYPES.DATE) {
        const formatted = formatGridDateValue(rawValue);
        return (
          <span className={`${wrapOrTruncateCls} tabular-nums`}>
            {formatted || String(rawValue)}
          </span>
        );
      }

      return <span className={wrapOrTruncateCls}>{String(rawValue)}</span>;
    },
    [handleToggleCheck, customRenderCell, getCellValue, rowNumberOffset, dynamicRowHeight]
  );

  const emptyColKeys = useMemo(() => {
    const emptySet = new Set<string>();
    if (
      rows.length === 0 ||
      (!features.enableColumnHide && !features.enableHeaderFilter && !features.showFilterRow)
    ) {
      return emptySet;
    }
    const sample = Math.min(rows.length, 300);
    for (const col of resolvedColumns) {
      if (col.dataType === DATA_TYPES.SYSTEM || col.isRowNumber || col.isSelection || col.isDetailExpand) {
        continue;
      }
      let hasData = false;
      for (let i = 0; i < sample; i++) {
        const v = getRowVal(i, col.key);
        if (v !== null && v !== undefined && v !== '' && (typeof v !== 'string' || v.trim() !== '')) {
          hasData = true;
          break;
        }
      }
      if (!hasData) emptySet.add(col.key);
    }
    return emptySet;
  }, [
    rows.length,
    resolvedColumns,
    getRowVal,
    features.enableColumnHide,
    features.enableHeaderFilter,
    features.showFilterRow,
  ]);

  const treeDetailActions = useMemo(
    () => ({
      expandAllTree,
      collapseAllTree,
      expandTreeToDepth,
      toggleTreeRow,
      toggleDetailRow,
      expandAllDetails,
      collapseAllDetails,
    }),
    [
      expandAllTree,
      collapseAllTree,
      expandTreeToDepth,
      toggleTreeRow,
      toggleDetailRow,
      expandAllDetails,
      collapseAllDetails,
    ]
  );

  return {
    features,
    effectiveGridId,
    gridRef,
    rows,
    totalFilteredRows,
    totalVirtualRowCount,
    getRow,
    handleGetRowId,
    orderedColumns,
    columnGroups: resolvedColumnGroups,
    columnPins: effectiveColumnPins,
    handleColumnPinsChange,
    colWidths,
    handleColWidthsChange,
    hiddenColKeys,
    handleHiddenColKeysChange,
    handleReorderColumns,
    handleResetColumns,
    sortConfig,
    sortRules,
    handleSortChange,
    handleSortRulesChange,
    groupByColumnKey,
    handleToggleGroupByColumn,
    groupSortConfig,
    handleToggleGroupSort,
    handleCollapseAllGroups,
    handleExpandAllGroups,
    handleUngroup,
    handleCopyGroupTable,
    selectedRowKey,
    handleSelectRow,
    handleRowDetail,
    checkedRowKeys,
    handleToggleCheck,
    handleClearCheckedRows,
    columnFilters,
    handleColumnFilterChange,
    handleClearAllColumnFilters,
    handleClearAllCriteria,
    getRowVal,
    getDistinctValues,
    getColumnDateBounds,
    effectiveMatchFilter,
    renderCell,
    quickFilterText,
    setQuickFilterText,
    appliedQueryTree,
    setAppliedQueryTree,
    emptyColKeys,
    columnSums,
    groupedDisplayModel,
    currentPage,
    currentPageSize,
    pageSizeOptions: resolvedPageSizeOptions,
    totalPagerItems,
    handlePageChange,
    handlePageSizeChange,
    formulaMode: effectiveFormulaMode,
    handleFormulaModeChange,
    treeColumnKey: isTreeActive ? resolvedTreeColumnKey : undefined,
    treeIndentSize: treeData?.indentSize ?? 20,
    onToggleTreeExpand: isTreeActive ? handleGridToggleTreeExpand : undefined,
    detailExpandColKey: isDetailActive ? detailRow?.expandColumnKey : undefined,
    isRowDetailExpanded,
    canExpandRowDetail,
    onToggleRowDetail: isDetailActive ? handleGridToggleRowDetail : undefined,
    renderDetailRow,
    hasDynamicDetailRows,
    treeDetailActions,
  };
}

export function DataGridEnterprise<TRecord extends Record<string, any>>({
  surfaceTheme = SURFACE_THEMES.LIGHT,
  title,
  description,
  toolbarSlot,
  onToolbarStateChange: controlledOnToolbarStateChange,
  truncated = false,
  loading = false,
  refreshing = false,
  error = null,
  onRetry,
  emptyText = 'Không tìm thấy dữ liệu phù hợp.',
  height,
  style,
  className,
  onShowSummaryRowChange,
  onShowStatusBarChange,
  showDebugChunkCount = false,
  overscanRows,
  scrollbarAlwaysOn,
  dynamicRowHeight,
  estimatedRowHeight,
  getRowHeight,
  layoutMode: controlledLayoutMode,
  onLayoutModeChange: controlledOnLayoutModeChange,
  gridRef: externalGridRef,
  ...controllerOptions
}: DataGridProps<TRecord>) {
  const [internalLayoutMode, setInternalLayoutMode] = useState<GridLayoutMode>(
    GRID_LAYOUT_MODES.AUTO
  );
  const layoutMode = controlledLayoutMode ?? internalLayoutMode;
  const onLayoutModeChange = controlledOnLayoutModeChange ?? setInternalLayoutMode;

  const ctrl = useDataGridController({ ...controllerOptions, surfaceTheme, dynamicRowHeight });
  const setMergedGridRef = useCallback(
    (instance: VirtualizedGridRef | null) => {
      (ctrl.gridRef as React.MutableRefObject<VirtualizedGridRef | null>).current = instance;
      if (typeof externalGridRef === 'function') {
        externalGridRef(instance);
      } else if (externalGridRef && typeof externalGridRef === 'object') {
        (externalGridRef as React.MutableRefObject<VirtualizedGridRef | null>).current = instance;
      }
    },
    [ctrl.gridRef, externalGridRef]
  );
  const { features } = ctrl;
  const [toolbarState, setToolbarState] = useState<GridToolbarState>(() => ({
    activePopup: null,
    quickFilterText: ctrl.quickFilterText,
    isQuickFilterActive: Boolean(ctrl.quickFilterText.trim()),
    activeQueryRuleCount: 0,
    visibleColumnCount: 0,
    totalColumnCount: 0,
    sortRuleCount: ctrl.sortRules.length,
    enableQuickSearch: features.enableQuickSearch,
    enableQueryBuilder: features.enableQueryBuilder,
    enableColumnChooser: features.enableColumnChooser,
    enableMultiSort: features.enableMultiSort,
  }));

  const handleToolbarStateChange = useCallback(
    (nextState: GridToolbarState) => {
      setToolbarState(nextState);
      controlledOnToolbarStateChange?.(nextState);
    },
    [controlledOnToolbarStateChange]
  );

  const toolbarApi = useMemo<DataGridToolbarApi>(
    () => ({
      state: toolbarState,
      openPopup: (type, anchorEl) => ctrl.gridRef.current?.openPopup(type, anchorEl),
      togglePopup: (type, anchorEl) => ctrl.gridRef.current?.togglePopup(type, anchorEl),
      closePopup: () => ctrl.gridRef.current?.closePopup(),
    }),
    [toolbarState, ctrl.gridRef]
  );

  const resolvedToolbarSlot = useMemo(
    () => (typeof toolbarSlot === 'function' ? toolbarSlot(toolbarApi) : toolbarSlot),
    [toolbarSlot, toolbarApi]
  );
  const resolvedServerTotal =
    typeof controllerOptions.pagination === 'object' && controllerOptions.pagination !== null
      ? (controllerOptions.pagination.serverTotal ??
        controllerOptions.pagination.total ??
        controllerOptions.serverTotal)
      : controllerOptions.serverTotal;
  const isAutoSized = features.autoHeight && height === undefined;
  const resolvedGridFeatures = useMemo(
    () => (features.autoHeight === isAutoSized ? features : { ...features, autoHeight: isAutoSized }),
    [features, isAutoSized]
  );
  const resolvedGridClassName =
    className ?? (isAutoSized ? 'border-0 rounded-none' : 'flex-1 min-h-0 border-0 rounded-none');

  const showHeaderBanner = Boolean(title || description || resolvedToolbarSlot);

  const statusBarNode = features.enableStatusBar ? (
    <React.Suspense fallback={null}>
      <LazyGridStatusBar
        page={ctrl.currentPage}
        pageSize={ctrl.currentPageSize}
        totalItems={ctrl.totalPagerItems}
        pageSizeOptions={ctrl.pageSizeOptions}
        onPageChange={ctrl.handlePageChange}
        onPageSizeChange={ctrl.handlePageSizeChange}
        surfaceTheme={surfaceTheme}
        disabled={loading}
      />
    </React.Suspense>
  ) : null;

  return (
    <div className={isAutoSized ? 'w-full flex flex-col' : 'flex-1 min-h-0 flex flex-col'}>
      {showHeaderBanner ? (
        <section className="px-4 py-3 border-b border-border bg-card text-card-foreground shrink-0 space-y-2.5">
          {title || description || resolvedServerTotal !== undefined || truncated ? (
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div className="flex flex-wrap items-baseline gap-2.5">
                {title ? (
                  <h2 className="text-section-title font-semibold text-foreground tracking-tight">
                    {title}
                  </h2>
                ) : null}
                {description ? (
                  <span className="text-caption text-muted-foreground">
                    {description}
                  </span>
                ) : null}
              </div>
              <div className="flex items-center gap-3 text-caption text-muted-foreground">
                <span>
                  Đã tải{' '}
                  <strong className="font-mono tabular-nums text-foreground">
                    {ctrl.rows.length.toLocaleString('vi-VN')}
                  </strong>
                  {resolvedServerTotal !== undefined && resolvedServerTotal > ctrl.rows.length
                    ? ` / ${resolvedServerTotal.toLocaleString('vi-VN')}`
                    : ''}{' '}
                  dòng
                  {truncated ? ' (giới hạn tải tối đa)' : ''}
                </span>
              </div>
            </div>
          ) : null}

          {resolvedToolbarSlot ? <div>{resolvedToolbarSlot}</div> : null}
        </section>
      ) : null}

      <VirtualizedGrid
        ref={setMergedGridRef}
        gridId={ctrl.effectiveGridId}
        style={height !== undefined ? { height, ...style } : style}
        rowCount={ctrl.totalVirtualRowCount}
        getRow={ctrl.getRow}
        getRowId={ctrl.handleGetRowId}
        columns={ctrl.orderedColumns}
        columnGroups={ctrl.columnGroups}
        tabletGroups={controllerOptions.tabletGroups}
        phoneCard={controllerOptions.phoneCard}
        pinnedTopRowData={controllerOptions.pinnedTopRowData}
        modules={controllerOptions.modules}
        columnPins={ctrl.columnPins}
        onColumnPinsChange={ctrl.handleColumnPinsChange}
        colWidths={ctrl.colWidths}
        onColWidthsChange={ctrl.handleColWidthsChange}
        hiddenColKeys={ctrl.hiddenColKeys}
        onHiddenColKeysChange={ctrl.handleHiddenColKeysChange}
        onReorderColumns={ctrl.handleReorderColumns}
        onResetColumns={ctrl.handleResetColumns}
        sortConfig={ctrl.sortConfig}
        onSortChange={ctrl.handleSortChange}
        sortRules={ctrl.sortRules}
        onSortRulesChange={ctrl.handleSortRulesChange}
        groupByColumnKey={ctrl.groupByColumnKey}
        onToggleGroupByColumn={ctrl.handleToggleGroupByColumn}
        groupSortConfig={ctrl.groupSortConfig}
        onToggleGroupSort={ctrl.handleToggleGroupSort}
        onCollapseAllGroups={ctrl.handleCollapseAllGroups}
        onExpandAllGroups={ctrl.handleExpandAllGroups}
        onUngroup={ctrl.handleUngroup}
        onCopyGroupTable={ctrl.handleCopyGroupTable}
        selectedRowKey={ctrl.selectedRowKey}
        onSelectRow={ctrl.handleSelectRow}
        onRowDetail={ctrl.handleRowDetail}
        checkedRowIndices={ctrl.checkedRowKeys}
        onToggleCheck={ctrl.handleToggleCheck}
        onClearCheckedRows={ctrl.handleClearCheckedRows}
        variant={features.variant}
        autoHeight={isAutoSized}
        maxHeight={features.maxHeight}
        persistState={features.persistState}
        enableFiltering={features.enableFiltering}
        showFilterRow={features.showFilterRow}
        enableHeaderFilter={features.enableHeaderFilter}
        enableQuickSearch={features.enableQuickSearch}
        enableQueryBuilder={features.enableQueryBuilder}
        enableSorting={features.enableSorting}
        enableMultiSort={features.enableMultiSort}
        enableColumnResize={features.enableColumnResize}
        enableColumnReorder={features.enableColumnReorder}
        enableColumnPinning={features.enableColumnPinning}
        enableCenterDock={features.enableCenterDock}
        enableColumnHide={features.enableColumnHide}
        enableRowNumber={features.enableRowNumber}
        enableSelection={features.enableSelection}
        enableGrouping={features.enableGrouping}
        enableRowPinning={features.enableRowPinning}
        enableCellEditing={features.enableCellEditing}
        enableResponsiveLayout={features.enableResponsiveLayout}
        enableSummary={features.enableSummary}
        showSummaryRow={controllerOptions.showSummaryRow}
        enableStatusBar={features.enableStatusBar}
        showStatusBar={controllerOptions.showStatusBar}
        enableContextMenu={features.enableContextMenu}
        enableFloatingToolbar={features.enableFloatingToolbar}
        enableColumnChooser={features.enableColumnChooser}
        enableSettings={features.enableSettings}
        enableFullscreen={features.enableFullscreen}
        enableCrossHover={features.enableCrossHover}
        crossHoverHighlightHeader={features.crossHoverHighlightHeader}
        enableCellSpan={features.enableCellSpan}
        enableTreeData={features.enableTreeData}
        enableRowDetail={features.enableRowDetail}
        spanMethod={controllerOptions.spanMethod}
        maxRowSpanLookback={controllerOptions.maxRowSpanLookback}
        treeColumnKey={ctrl.treeColumnKey}
        treeIndentSize={ctrl.treeIndentSize}
        onToggleTreeExpand={ctrl.onToggleTreeExpand}
        detailExpandColKey={ctrl.detailExpandColKey}
        isRowDetailExpanded={ctrl.isRowDetailExpanded}
        canExpandRowDetail={ctrl.canExpandRowDetail}
        onToggleRowDetail={ctrl.onToggleRowDetail}
        renderDetailRow={ctrl.renderDetailRow}
        hasDynamicDetailRows={ctrl.hasDynamicDetailRows}
        treeDetailActions={ctrl.treeDetailActions}
        columnFilters={ctrl.columnFilters}
        onColumnFilterChange={ctrl.handleColumnFilterChange}
        onClearAllColumnFilters={ctrl.handleClearAllColumnFilters}
        onClearAllCriteria={ctrl.handleClearAllCriteria}
        getCellValue={ctrl.getRowVal}
        getDistinctValues={ctrl.getDistinctValues}
        getColumnDateBounds={ctrl.getColumnDateBounds}
        matchFilterValue={ctrl.effectiveMatchFilter}
        renderCell={ctrl.renderCell}
        columnSums={ctrl.columnSums}
        formulaMode={ctrl.formulaMode}
        onFormulaModeChange={ctrl.handleFormulaModeChange}
        editMode={GRID_EDIT_MODES.VIEW}
        layoutMode={layoutMode}
        onLayoutModeChange={onLayoutModeChange}
        chunkSize={DEFAULT_CHUNK_SIZE}
        overscanChunks={3}
        overscanRows={overscanRows}
        scrollbarAlwaysOn={scrollbarAlwaysOn}
        dynamicRowHeight={dynamicRowHeight}
        estimatedRowHeight={estimatedRowHeight}
        getRowHeight={getRowHeight}
        rowHeight={DEFAULT_ROW_HEIGHT}
        surfaceTheme={surfaceTheme}
        quickFilterText={ctrl.quickFilterText}
        onQuickFilterTextChange={ctrl.setQuickFilterText}
        appliedQueryTree={ctrl.appliedQueryTree}
        onApplyQueryTree={ctrl.setAppliedQueryTree}
        onToolbarStateChange={handleToolbarStateChange}
        emptyColKeys={ctrl.emptyColKeys}
        loading={loading}
        refreshing={refreshing}
        error={error}
        onRetry={onRetry}
        emptyText={emptyText}
        statusBar={statusBarNode}
        onShowSummaryRowChange={onShowSummaryRowChange}
        onShowStatusBarChange={onShowStatusBarChange}
        className={resolvedGridClassName}
        _resolvedFeatures={resolvedGridFeatures}
      />
    </div>
  );
}
