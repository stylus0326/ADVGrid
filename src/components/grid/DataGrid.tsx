import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
  useLayoutEffect,
  lazy,
  Suspense,
} from 'react';
import './gridCore.css';
import { getThemeClass } from '../../themes';
import {
  DEFAULT_CHUNK_SIZE,
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE_SIZE_OPTIONS,
  DEFAULT_ROW_HEIGHT,
  getThemeClasses,
} from './constants';
import {
  ALIGNMENTS,
  DATA_TYPES,
  EDITOR_TYPES,
  GRID_LAYOUT_MODES,
  SURFACE_THEMES,
  resolveGridFeatures,
  type BaseGroupDef,
  type CellRenderParams,
  type ColumnDef,
  type DataGridToolbarApi,
  type DetailRowConfig,
  type FormulaMode,
  type GridFeatureProps,
  type GridLayoutMode,
  type GridSpanMethod,
  type GridToolbarState,
  type PhoneCardConfig,
  type PinPosition,
  type ResolvedGridFeatures,
  type SurfaceTheme,
  type TabletColumnGroup,
  type TreeDataConfig,
  type VirtualizedGridRef,
} from './types';
import {
  formatGridDateValue,
  formatGridNumber,
  getAlignJustifyClass,
  getSttColWidth,
} from './gridFormatUtils';
import {
  normalizeGridColumns,
  type DefaultColDef,
  type GridColumnDef,
  type PaginationConfig,
} from './columns/normalizeColumns';
import { isAnyPopupActive, useGridPopupLock } from './hooks/useGridPopupLock';
import { useGridOverlayScrollbar } from './hooks/useGridOverlayScrollbar';
import { AdvButton } from '../ui/AdvButton';

const LazyGridStatusBar = lazy(() =>
  import('./GridStatusBar').then((m) => ({ default: m.GridStatusBar }))
);

const LazyDataGridEnterprise = lazy(() =>
  import('./DataGridEnterprise').then((m) => ({ default: m.DataGridEnterprise }))
) as <TRecord extends Record<string, any>>(
  props: DataGridProps<TRecord>
) => React.ReactElement | null;

export interface UseDataGridControllerOptions<TRecord extends Record<string, any>>
  extends GridFeatureProps {
  gridId?: string;
  /** @deprecated Dùng `gridId` thay thế */
  pageKey?: string;
  rows?: TRecord[];
  /** Alias thân thiện kiểu `<Table data={...} />` cho `rows` */
  data?: TRecord[];
  /** Alias chuẩn AG Grid cho `rows` */
  rowData?: TRecord[];
  columns?: readonly GridColumnDef<TRecord, any>[];
  /** Alias chuẩn AG Grid cho `columns` */
  columnDefs?: readonly GridColumnDef<TRecord, any>[];
  columnGroups?: BaseGroupDef[];
  tabletGroups?: readonly TabletColumnGroup<TRecord>[];
  phoneCard?: PhoneCardConfig<TRecord>;
  formulaMode?: FormulaMode;
  defaultFormulaMode?: FormulaMode;
  onFormulaModeChange?: (mode: FormulaMode) => void;
  surfaceTheme?: SurfaceTheme;
  dynamicRowHeight?: boolean;
  defaultColDef?: DefaultColDef<TRecord>;
  defaultPins?: Record<string, PinPosition>;
  getRowKey?: (row: TRecord, index: number) => string;
  /** Alias chuẩn AG Grid cho `getRowKey` */
  getRowId?: (row: TRecord, index: number) => string | number;
  /** Alias thân thiện kiểu `<Table rowKey="id" />` cho `getRowKey` */
  rowKey?: keyof TRecord | ((row: TRecord, index: number) => string | number);
  getCellValue?: (row: TRecord, colKey: string) => unknown;
  getSearchText?: (row: TRecord) => string;
  renderCell?: (params: CellRenderParams<any>) => React.ReactNode;
  pinnedTopRowData?: TRecord[];
  onRowClick?: (row: TRecord, index: number) => void;
  onRowDetail?: (row: TRecord, index: number) => void;
  pagination?: boolean | PaginationConfig;
  enablePagination?: boolean;
  page?: number;
  defaultPage?: number;
  pageSize?: number;
  defaultPageSize?: number;
  pageSizeOptions?: readonly number[];
  serverTotal?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  spanMethod?: GridSpanMethod<TRecord>;
  maxRowSpanLookback?: number;
  treeData?: TreeDataConfig<TRecord>;
  detailRow?: DetailRowConfig<TRecord>;
}

export type DataGridRef = VirtualizedGridRef;
export type { DataGridToolbarApi };

export interface DataGridProps<TRecord extends Record<string, any>>
  extends UseDataGridControllerOptions<TRecord> {
  surfaceTheme?: SurfaceTheme;
  title?: string;
  description?: string;
  toolbarSlot?: React.ReactNode | ((api: DataGridToolbarApi) => React.ReactNode);
  onToolbarStateChange?: (state: GridToolbarState) => void;
  truncated?: boolean;
  loading?: boolean;
  refreshing?: boolean;
  error?: string | null;
  onRetry?: () => void;
  emptyText?: string;
  height?: number | string;
  style?: React.CSSProperties;
  className?: string;
  onShowSummaryRowChange?: (show: boolean) => void;
  onShowStatusBarChange?: (show: boolean) => void;
  showDebugChunkCount?: boolean;
  overscanRows?: number;
  scrollbarAlwaysOn?: boolean;
  dynamicRowHeight?: boolean;
  estimatedRowHeight?: number;
  getRowHeight?: (row: TRecord, rowIndex: number) => number;
  layoutMode?: GridLayoutMode;
  onLayoutModeChange?: (mode: GridLayoutMode) => void;
  gridRef?: React.Ref<VirtualizedGridRef>;
}

interface BasicColMeta<T = any> {
  col: ColumnDef<T>;
  key: string;
  width: number;
  isStt: boolean;
  isNumber: boolean;
  isTime: boolean;
  isDateLike: boolean;
  hasCustomRender: boolean;
  cellStyle: React.CSSProperties;
  classNameEven: string;
  classNameOdd: string;
  classNameSelected: string;
}

const EMPTY_ROWS: any[] = [];
const INITIAL_VIEWPORT_HEIGHT = Math.max(600, DEFAULT_CHUNK_SIZE * DEFAULT_ROW_HEIGHT);

function defaultGetRowKey<TRecord extends Record<string, any>>(
  row: TRecord,
  index: number
): string {
  const candidate = row?._rowKey ?? row?.id ?? row?.Id ?? row?.ID ?? row?.key ?? row?.code;
  if (candidate !== undefined && candidate !== null && String(candidate) !== '') {
    return String(candidate);
  }
  return `row_${index}`;
}

function resolveBasicRowKey<TRecord extends Record<string, any>>(
  row: TRecord,
  index: number,
  getRowId?: (row: TRecord, index: number) => string | number,
  getRowKey?: (row: TRecord, index: number) => string,
  rowKey?: keyof TRecord | ((row: TRecord, index: number) => string | number)
): string {
  if (getRowId) return String(getRowId(row, index));
  if (getRowKey) return getRowKey(row, index);
  if (typeof rowKey === 'function') return String(rowKey(row, index));
  if (rowKey !== undefined && row && row[rowKey] !== undefined && row[rowKey] !== null) {
    return String(row[rowKey]);
  }
  return defaultGetRowKey(row, index);
}

function formatBasicCellTime(rawValue: unknown): string {
  const s = String(rawValue ?? '');
  const m = s.match(/(\d{1,2}):(\d{2})/);
  return m ? `${m[1].padStart(2, '0')}:${m[2]}` : s;
}

function hasComplexColumnFeatures<TRecord>(
  defs: readonly GridColumnDef<TRecord, any>[] | undefined
): boolean {
  if (!defs || defs.length === 0) return false;
  for (let i = 0; i < defs.length; i++) {
    const col = defs[i] as any;
    if (!col || typeof col !== 'object') continue;
    if ('columns' in col && Array.isArray(col.columns)) return true;
    if (col.colSpan || col.rowSpan || col.meta?.colSpan || col.meta?.rowSpan) return true;
  }
  return false;
}

function canUseBasicViewEngine<TRecord extends Record<string, any>>(
  props: DataGridProps<TRecord>,
  features: ResolvedGridFeatures
): boolean {
  if (
    features.enableFiltering ||
    features.showFilterRow ||
    features.enableHeaderFilter ||
    features.enableQuickSearch ||
    features.enableQueryBuilder ||
    features.enableSorting ||
    features.enableMultiSort ||
    features.enableColumnResize ||
    features.enableColumnReorder ||
    features.enableColumnPinning ||
    features.enableCenterDock ||
    features.enableColumnHide ||
    features.enableSelection ||
    features.enableGrouping ||
    features.enableRowPinning ||
    features.enableCellEditing ||
    features.enableResponsiveLayout ||
    features.enableSummary ||
    features.enableContextMenu ||
    features.enableFloatingToolbar ||
    features.enableColumnChooser ||
    features.enableFullscreen ||
    features.enableCrossHover ||
    features.enableCellSpan ||
    features.enableTreeData ||
    features.enableRowDetail
  ) {
    return false;
  }

  if (
    props.gridRef ||
    (props.columnGroups && props.columnGroups.length > 0) ||
    (props.pinnedTopRowData && props.pinnedTopRowData.length > 0) ||
    props.dynamicRowHeight ||
    props.getRowHeight ||
    props.spanMethod ||
    props.treeData ||
    props.detailRow ||
    typeof props.toolbarSlot === 'function'
  ) {
    return false;
  }

  const inputCols = props.columns ?? props.columnDefs;
  if (hasComplexColumnFeatures(inputCols)) {
    return false;
  }

  return true;
}

function BasicDataGridView<TRecord extends Record<string, any>>({
  props,
  features,
  effectiveEnableStatusBar,
  isAutoSized,
}: {
  props: DataGridProps<TRecord>;
  features: ResolvedGridFeatures;
  effectiveEnableStatusBar: boolean;
  isAutoSized: boolean;
}) {
  const {
    rows: rawRows,
    data,
    rowData,
    columns: inputColumns,
    columnDefs,
    defaultColDef,
    getRowId,
    getRowKey,
    rowKey,
    getCellValue: customGetCellValue,
    renderCell: customRenderCell,
    onRowClick,
    pagination,
    page: controlledPage,
    defaultPage = 1,
    pageSize: controlledPageSize,
    defaultPageSize = DEFAULT_PAGE_SIZE,
    pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
    serverTotal,
    onPageChange: controlledOnPageChange,
    onPageSizeChange: controlledOnPageSizeChange,
    surfaceTheme = SURFACE_THEMES.LIGHT,
    title,
    description,
    toolbarSlot,
    truncated = false,
    loading = false,
    refreshing = false,
    error = null,
    onRetry,
    emptyText = 'Không tìm thấy dữ liệu phù hợp.',
    height,
    style,
    className,
    overscanRows = 5,
    scrollbarAlwaysOn = false,
  } = props;

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

  const [internalPage, setInternalPage] = useState<number>(() =>
    Math.max(1, resolvedDefaultPage)
  );
  const [internalPageSize, setInternalPageSize] = useState<number>(() =>
    resolvedDefaultPageSize > 0 ? resolvedDefaultPageSize : DEFAULT_PAGE_SIZE
  );

  const isServerPaginated = Boolean(resolvedOnPageChange || resolvedOnPageSizeChange);
  const currentPageSize =
    resolvedControlledPageSize !== undefined && resolvedControlledPageSize > 0
      ? Math.floor(resolvedControlledPageSize)
      : internalPageSize;
  const rawPage =
    resolvedControlledPage !== undefined && resolvedControlledPage > 0
      ? Math.floor(resolvedControlledPage)
      : internalPage;
  const totalRowsAll = inputRows.length;
  const totalPagerItems = isServerPaginated
    ? resolvedServerTotal ?? totalRowsAll
    : totalRowsAll;
  const shouldSliceClientPage = effectiveEnableStatusBar && !isServerPaginated;
  const clientTotalPages =
    totalRowsAll > 0 ? Math.max(1, Math.ceil(totalRowsAll / currentPageSize)) : 1;
  const currentPage = shouldSliceClientPage
    ? totalRowsAll > 0
      ? Math.min(Math.max(1, rawPage), clientTotalPages)
      : 1
    : Math.max(1, rawPage);

  const pageStartOffset = shouldSliceClientPage ? (currentPage - 1) * currentPageSize : 0;
  const totalPageRowCount = shouldSliceClientPage
    ? Math.max(0, Math.min(totalRowsAll, pageStartOffset + currentPageSize) - pageStartOffset)
    : totalRowsAll;
  const rowNumberOffset = effectiveEnableStatusBar ? (currentPage - 1) * currentPageSize : 0;

  const rowHeight = DEFAULT_ROW_HEIGHT;
  const overscan = Math.max(1, overscanRows);
  const totalContentHeight = totalPageRowCount * rowHeight;

  const [selectedRowKey, setSelectedRowKey] = useState<string | null>(null);
  const [viewportHeight, setViewportHeight] = useState<number>(INITIAL_VIEWPORT_HEIGHT);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const overlayHostRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const virtualScrollTopRef = useRef<number>(0);
  const lastScrollTopRef = useRef<number>(0);
  const lastScrollLeftRef = useRef<number>(0);
  const scrollStopTimeoutRef = useRef<number | null>(null);
  const isScrollingAttrSetRef = useRef<boolean>(false);

  const isWindowScroll =
    features.autoHeight &&
    features.maxHeight === undefined &&
    (style?.height === undefined || style?.height === 'auto') &&
    style?.maxHeight === undefined;

  const getVisibleRowRange = useCallback(
    (scrollTop: number, vH: number): { start: number; end: number } => {
      if (totalPageRowCount <= 0) return { start: 0, end: -1 };
      const safeH = Math.max(rowHeight, vH || INITIAL_VIEWPORT_HEIGHT);
      const maxTop = Math.max(0, totalContentHeight - safeH);
      const clampedTop = Math.max(0, Math.min(scrollTop, maxTop));
      const firstVisible = Math.min(
        totalPageRowCount - 1,
        Math.max(0, Math.floor(clampedTop / rowHeight))
      );
      const lastVisible = Math.min(
        totalPageRowCount - 1,
        Math.max(firstVisible, Math.floor((clampedTop + safeH - 1) / rowHeight))
      );
      const start = Math.max(0, firstVisible - overscan);
      const end = Math.min(totalPageRowCount - 1, Math.max(start, lastVisible + overscan));
      return { start, end };
    },
    [totalPageRowCount, totalContentHeight, rowHeight, overscan]
  );

  const [rowWindow, setRowWindow] = useState<{ start: number; end: number }>(() =>
    getVisibleRowRange(0, INITIAL_VIEWPORT_HEIGHT)
  );
  const activeRowWindowRef = useRef(rowWindow);

  const updateRowWindow = useCallback(
    (scrollTop: number, vH: number) => {
      const next = getVisibleRowRange(scrollTop, vH);
      if (
        next.start !== activeRowWindowRef.current.start ||
        next.end !== activeRowWindowRef.current.end
      ) {
        activeRowWindowRef.current = next;
        setRowWindow(next);
      }
    },
    [getVisibleRowRange]
  );

  const currentWindowRange = useMemo(() => {
    const rawTop = isWindowScroll
      ? virtualScrollTopRef.current
      : scrollContainerRef.current?.scrollTop ?? virtualScrollTopRef.current;
    return getVisibleRowRange(rawTop, viewportHeight);
  }, [rowWindow, getVisibleRowRange, viewportHeight, isWindowScroll]);

  const {
    isPopupLockActive,
    popupLockedScrollPosRef,
    suppressNextGridClickRef,
    handleContainerMouseDownCapture,
    handleContainerSuppressClickCapture,
    handleContainerContextMenuCapture,
  } = useGridPopupLock({
    containerRef,
    scrollContainerRef,
    lastScrollTopRef,
    lastScrollLeftRef,
    activeContextMenu: null,
    isSortFilterModalOpen: false,
    activeEditingCell: null,
  });

  const isPopupLockRef = useRef(false);
  isPopupLockRef.current = isPopupLockActive;

  useLayoutEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    if (isWindowScroll) {
      const syncWindowScroll = () => {
        if (isPopupLockRef.current || isAnyPopupActive()) return;
        el.style.setProperty('--agv-viewport-w', `${el.clientWidth || 600}px`);
        const rect = el.getBoundingClientRect();
        const vTop = Math.max(0, -rect.top);
        const vH = window.innerHeight || INITIAL_VIEWPORT_HEIGHT;
        virtualScrollTopRef.current = vTop;
        lastScrollTopRef.current = vTop;
        setViewportHeight((prev) => (prev === vH ? prev : vH));
        updateRowWindow(vTop, vH);
      };

      syncWindowScroll();
      window.addEventListener('scroll', syncWindowScroll, { passive: true });
      window.addEventListener('resize', syncWindowScroll, { passive: true });
      return () => {
        window.removeEventListener('scroll', syncWindowScroll);
        window.removeEventListener('resize', syncWindowScroll);
      };
    }

    const syncContainerSize = () => {
      el.style.setProperty('--agv-viewport-w', `${el.clientWidth || 600}px`);
      const nextH = el.clientHeight || INITIAL_VIEWPORT_HEIGHT;
      const top = el.scrollTop || 0;
      virtualScrollTopRef.current = top;
      lastScrollTopRef.current = top;
      setViewportHeight((prev) => (prev === nextH ? prev : nextH));
      updateRowWindow(top, nextH);
    };
    syncContainerSize();

    const observer = new ResizeObserver(syncContainerSize);
    observer.observe(el);
    return () => observer.disconnect();
  }, [isWindowScroll, updateRowWindow]);

  useEffect(() => {
    const rawTop = isWindowScroll
      ? virtualScrollTopRef.current
      : scrollContainerRef.current?.scrollTop ?? virtualScrollTopRef.current;
    updateRowWindow(rawTop, viewportHeight);
  }, [getVisibleRowRange, viewportHeight, isWindowScroll, updateRowWindow]);

  useEffect(() => {
    return () => {
      if (scrollStopTimeoutRef.current !== null) {
        window.clearTimeout(scrollStopTimeoutRef.current);
        scrollStopTimeoutRef.current = null;
      }
    };
  }, []);

  const theme = useMemo(() => getThemeClasses(surfaceTheme), [surfaceTheme]);

  const { flatColumns: normalizedCols } = useMemo(
    () =>
      normalizeGridColumns(inputColumns ?? columnDefs, defaultColDef, {
        enableColumnPinning: false,
        enableCenterDock: false,
        surfaceTheme,
      }),
    [inputColumns, columnDefs, defaultColDef, surfaceTheme]
  );

  const sttDisplayTotal = Math.max(totalPageRowCount, rowNumberOffset + totalPageRowCount);
  const autoSttWidth = useMemo(() => getSttColWidth(sttDisplayTotal), [sttDisplayTotal]);

  const { basicCols, totalGridWidth } = useMemo(() => {
    const hasRowNumber = normalizedCols.some((c) => c.isRowNumber || c.key === 'col_stt');
    const finalCols: ColumnDef<TRecord>[] =
      features.enableRowNumber && !hasRowNumber
        ? [
            {
              key: 'col_stt',
              title: '#',
              defaultWidth: 48,
              align: ALIGNMENTS.CENTER,
              dataType: DATA_TYPES.SYSTEM,
              isRowNumber: true,
            },
            ...normalizedCols,
          ]
        : normalizedCols;

    const compiled: BasicColMeta<TRecord>[] = new Array(finalCols.length);
    let totalW = 0;

    for (let i = 0; i < finalCols.length; i++) {
      const col = finalCols[i];
      const isStt = Boolean(
        col.isRowNumber ||
          col.key === 'col_stt' ||
          (col.dataType === DATA_TYPES.SYSTEM && Boolean(col.title))
      );
      const width = isStt ? col.defaultWidth || autoSttWidth || 48 : col.defaultWidth;
      totalW += width;

      const isNumber = col.dataType === DATA_TYPES.NUMBER;
      const isTime = col.dataType === DATA_TYPES.TIME || col.editorType === EDITOR_TYPES.TIME;
      const isDateLike =
        col.dataType === DATA_TYPES.DATE ||
        col.editorType === EDITOR_TYPES.DATE ||
        col.editorType === EDITOR_TYPES.DATERANGE ||
        Boolean(col.isDateRange);

      const typeCls = isNumber
        ? 'agv-cell-number '
        : isDateLike || isTime
        ? 'agv-cell-date '
        : col.className
        ? `${col.className} `
        : '';

      const padNormal = col.cellPadding
        ? col.cellPadding
        : col.dataType === DATA_TYPES.SYSTEM || isStt
        ? 'px-1'
        : 'px-2.5';

      const alignCls = getAlignJustifyClass(col.align);
      const borderClasses = `${theme.borderBottom} ${theme.borderRight}`;
      const tailCommon = `text-xs ${borderClasses} shrink-0 overflow-hidden whitespace-nowrap min-h-[32px] max-h-[32px] leading-[32px] tabular-nums box-border ${typeCls}${alignCls}`;

      const bgFixed = isStt || col.dataType === DATA_TYPES.SYSTEM ? theme.sharedHeaderCellBg : '';
      const bgEven = bgFixed || theme.rowEvenBg;
      const bgOdd = bgFixed || theme.rowOddBg;
      const bgSelected = bgFixed || theme.rowSelectedBg;

      compiled[i] = {
        col,
        key: col.key,
        width,
        isStt,
        isNumber,
        isTime,
        isDateLike,
        hasCustomRender: Boolean(col.renderCell),
        cellStyle: { width: `${width}px`, height: `${rowHeight}px` },
        classNameEven: `flex items-center ${padNormal} ${tailCommon} ${bgEven}`,
        classNameOdd: `flex items-center ${padNormal} ${tailCommon} ${bgOdd}`,
        classNameSelected: `flex items-center ${padNormal} ${tailCommon} ${bgSelected}`,
      };
    }

    return { basicCols: compiled, totalGridWidth: totalW };
  }, [normalizedCols, features.enableRowNumber, autoSttWidth, theme, rowHeight]);

  const isOverlayLockedRef = useRef(false);
  isOverlayLockedRef.current = isPopupLockActive;

  const {
    vBarRef,
    vThumbRef,
    hBarRef,
    hThumbRef,
    notifyScroll: notifyOverlayScrollbar,
    hostInteractionProps: overlayHostInteractionProps,
    onVerticalTrackMouseDown,
    onHorizontalTrackMouseDown,
    onVerticalThumbPointerDown,
    onHorizontalThumbPointerDown,
  } = useGridOverlayScrollbar({
    overlayHostRef,
    scrollContainerRef,
    alwaysShow: scrollbarAlwaysOn,
    isWindowScroll,
    verticalTrackTopInset: 36,
    isLockedRef: isOverlayLockedRef,
    totalContentHeight,
    totalGridWidth,
    viewportHeight,
  });

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const target = e.currentTarget;

      if (isPopupLockActive || isAnyPopupActive()) {
        const lockedPos = popupLockedScrollPosRef.current;
        if (!isWindowScroll) {
          target.scrollTop = lockedPos ? lockedPos.top : lastScrollTopRef.current;
        }
        target.scrollLeft = lockedPos ? lockedPos.left : lastScrollLeftRef.current;
        return;
      }

      const currentScrollLeft = target.scrollLeft;
      if (currentScrollLeft !== lastScrollLeftRef.current) {
        lastScrollLeftRef.current = currentScrollLeft;
      }

      if (!isWindowScroll) {
        const currentTop = target.scrollTop;
        if (currentTop !== lastScrollTopRef.current) {
          lastScrollTopRef.current = currentTop;
          virtualScrollTopRef.current = currentTop;
          updateRowWindow(currentTop, viewportHeight);
        }
      }

      notifyOverlayScrollbar();

      if (!isScrollingAttrSetRef.current) {
        isScrollingAttrSetRef.current = true;
        target.setAttribute('data-agv-scrolling', 'true');
      }
      if (scrollStopTimeoutRef.current !== null) {
        window.clearTimeout(scrollStopTimeoutRef.current);
      }
      scrollStopTimeoutRef.current = window.setTimeout(() => {
        if (isScrollingAttrSetRef.current) {
          isScrollingAttrSetRef.current = false;
          scrollContainerRef.current?.removeAttribute('data-agv-scrolling');
        }
      }, 110);
    },
    [
      isPopupLockActive,
      popupLockedScrollPosRef,
      isWindowScroll,
      updateRowWindow,
      viewportHeight,
      notifyOverlayScrollbar,
    ]
  );

  const handleViewportClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isPopupLockActive || isAnyPopupActive()) return;
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (
        target.closest(
          'button, a, input, select, textarea, [role="button"], [role="checkbox"], [contenteditable="true"]'
        )
      ) {
        return;
      }
      const rowEl = target.closest('[data-agv-row="true"]') as HTMLElement | null;
      if (!rowEl) return;
      const rowIdx = Number(rowEl.getAttribute('data-row-idx'));
      if (!Number.isFinite(rowIdx) || rowIdx < 0 || rowIdx >= totalPageRowCount) return;

      const sourceIdx = pageStartOffset + rowIdx;
      const rec = inputRows[sourceIdx];
      if (!rec) return;
      const key = resolveBasicRowKey(rec, sourceIdx, getRowId, getRowKey, rowKey);
      setSelectedRowKey(key);
      onRowClick?.(rec, rowIdx);
    },
    [
      isPopupLockActive,
      totalPageRowCount,
      pageStartOffset,
      inputRows,
      getRowId,
      getRowKey,
      rowKey,
      onRowClick,
    ]
  );

  const scrollToTopReset = useCallback(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
    virtualScrollTopRef.current = 0;
    lastScrollTopRef.current = 0;
    updateRowWindow(0, viewportHeight);
  }, [updateRowWindow, viewportHeight]);

  const handlePageChange = useCallback(
    (nextPage: number) => {
      const normalized = Math.max(1, Math.floor(nextPage));
      if (resolvedOnPageChange) {
        resolvedOnPageChange(normalized);
      } else {
        setInternalPage(normalized);
      }
      scrollToTopReset();
    },
    [resolvedOnPageChange, scrollToTopReset]
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
      scrollToTopReset();
    },
    [resolvedOnPageSizeChange, resolvedOnPageChange, scrollToTopReset]
  );

  const visibleRows = useMemo(() => {
    if (totalPageRowCount <= 0 || currentWindowRange.end < currentWindowRange.start) {
      return EMPTY_ROWS as Array<{ rowIndex: number; row: TRecord; key: string }>;
    }
    const list: Array<{ rowIndex: number; row: TRecord; key: string }> = [];
    for (let r = currentWindowRange.start; r <= currentWindowRange.end; r++) {
      const sourceIdx = pageStartOffset + r;
      const rec = inputRows[sourceIdx];
      if (rec) {
        list.push({
          rowIndex: r,
          row: rec,
          key: resolveBasicRowKey(rec, sourceIdx, getRowId, getRowKey, rowKey),
        });
      }
    }
    return list;
  }, [
    totalPageRowCount,
    currentWindowRange,
    pageStartOffset,
    inputRows,
    getRowId,
    getRowKey,
    rowKey,
  ]);

  const showHeaderBanner = Boolean(title || description || toolbarSlot);
  const resolvedGridClassName =
    className ?? (isAutoSized ? 'border-0 rounded-none' : 'flex-1 min-h-0 border-0 rounded-none');
  const resolvedMaxHeightStyle: React.CSSProperties =
    features.autoHeight && features.maxHeight !== undefined
      ? {
          maxHeight:
            typeof features.maxHeight === 'number'
              ? `${features.maxHeight}px`
              : features.maxHeight,
        }
      : {};

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
                  <span className="text-caption text-muted-foreground">{description}</span>
                ) : null}
              </div>
              <div className="flex items-center gap-3 text-caption text-muted-foreground">
                <span>
                  Đã tải{' '}
                  <strong className="font-mono tabular-nums text-foreground">
                    {totalRowsAll.toLocaleString('vi-VN')}
                  </strong>
                  {resolvedServerTotal !== undefined && resolvedServerTotal > totalRowsAll
                    ? ` / ${resolvedServerTotal.toLocaleString('vi-VN')}`
                    : ''}{' '}
                  dòng
                  {truncated ? ' (giới hạn tải tối đa)' : ''}
                </span>
              </div>
            </div>
          ) : null}

          {toolbarSlot ? <div>{toolbarSlot as React.ReactNode}</div> : null}
        </section>
      ) : null}

      <div
        ref={containerRef}
        data-theme={surfaceTheme}
        className={`relative ${isAutoSized ? 'w-full' : 'flex-1'} flex flex-col min-h-0 overflow-hidden agv-grid-root ${getThemeClass(surfaceTheme)} ${resolvedGridClassName}`}
        style={
          {
            '--agv-total-grid-w': `${totalGridWidth}px`,
            ...resolvedMaxHeightStyle,
            ...(height !== undefined ? { height, ...style } : style),
          } as React.CSSProperties
        }
        onMouseDownCapture={handleContainerMouseDownCapture}
        onClickCapture={handleContainerSuppressClickCapture}
        onDoubleClickCapture={handleContainerSuppressClickCapture}
        onContextMenuCapture={handleContainerContextMenuCapture}
      >
        <div
          ref={overlayHostRef}
          {...overlayHostInteractionProps}
          data-overlay-scroll-active={scrollbarAlwaysOn ? 'true' : 'false'}
          className={`agv-grid-scroll-overlay-host relative ${isAutoSized ? 'flex-initial min-h-0' : 'flex-1 min-h-0'} flex flex-col`}
        >
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            onClick={handleViewportClick}
            style={{
              willChange: 'scroll-position',
              WebkitOverflowScrolling: 'touch',
              backgroundColor: 'var(--agv-bg-root)',
            }}
            className={`agv-scroll-viewport agv-scroll-overlay ${isAutoSized ? 'flex-initial min-h-0' : 'flex-1'} overflow-auto relative ${theme.viewportBg}`}
          >
            {/* Sticky Header 1 tầng 34px */}
            <div
              data-agv-header-root="true"
              data-agv-fullwidth="true"
              style={{
                width: `var(--agv-total-grid-w, ${totalGridWidth}px)`,
                minWidth: `var(--agv-total-grid-w, ${totalGridWidth}px)`,
                transform: 'translateZ(0)',
                height: '34px',
                backgroundColor: 'var(--agv-bg-header)',
                color: 'var(--agv-text-header, var(--agv-text-main))',
              }}
              className={`sticky top-0 z-30 flex box-border ${theme.headerBg}`}
            >
              {basicCols.map((meta) => {
                const { col, key, width, isStt } = meta;
                const isSystemCol = isStt || col.dataType === DATA_TYPES.SYSTEM;
                return (
                  <div
                    key={key}
                    data-col-key={key}
                    style={{
                      width: `${width}px`,
                      minWidth: `${width}px`,
                      maxWidth: `${width}px`,
                      height: '34px',
                      backgroundColor: 'var(--agv-bg-header)',
                      color: 'var(--agv-text-header, var(--agv-text-main))',
                    }}
                    className={`group/th flex flex-col justify-center items-center text-center ${
                      isSystemCol ? 'px-0.5' : 'px-1.5'
                    } ${theme.systemBorderBottom} ${theme.sharedHeaderCellBg} ${theme.headerHoverBg} ${theme.headerBorderRight} relative z-10 shrink-0 select-none box-border cursor-default transition-colors`}
                  >
                    <div className="inline-flex items-center justify-center gap-1 max-w-full px-0.5 min-w-0">
                      {col.renderHeader ? (
                        <div className="inline-flex items-center justify-center max-w-full min-w-0 text-xs font-bold uppercase tracking-wider truncate text-center">
                          {col.renderHeader()}
                        </div>
                      ) : (
                        <span className="text-xs font-bold uppercase tracking-wider truncate text-center">
                          {isSystemCol && !col.title ? '' : col.title}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Virtualized Rows Canvas */}
            <div
              className="agv-rows-canvas"
              data-agv-fullwidth="true"
              style={{
                height: `${totalContentHeight}px`,
                width: `var(--agv-total-grid-w, ${totalGridWidth}px)`,
                minWidth: `var(--agv-total-grid-w, ${totalGridWidth}px)`,
                position: 'relative',
                isolation: 'isolate',
                zIndex: 1,
              }}
            >
              {visibleRows.map(({ rowIndex, row, key: rKey }) => {
                const isEven = rowIndex % 2 === 0;
                const isSelected = selectedRowKey !== null && selectedRowKey === rKey;
                const rowY = rowIndex * rowHeight;

                return (
                  <div
                    key={rKey}
                    data-agv-row="true"
                    data-agv-fullwidth="true"
                    data-row-key={rKey}
                    data-row-idx={rowIndex}
                    data-row-parity={isEven ? 'even' : 'odd'}
                    data-row-focused={isSelected ? 'true' : undefined}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: `var(--agv-total-grid-w, ${totalGridWidth}px)`,
                      minWidth: `var(--agv-total-grid-w, ${totalGridWidth}px)`,
                      height: `${rowHeight}px`,
                      transform: `translate3d(0px, ${rowY}px, 0px)`,
                      willChange: 'transform',
                      backfaceVisibility: 'hidden',
                      contain: 'strict',
                    }}
                    className={`agv-grid-row flex items-center min-h-[32px] max-h-[32px] ${
                      isEven ? theme.rowEvenBg : theme.rowOddBg
                    } ${theme.defaultTextColor} cursor-default select-text box-border`}
                  >
                    {basicCols.map((meta) => {
                      const col = meta.col;
                      let cellContent: React.ReactNode = null;

                      if (meta.isStt && !meta.hasCustomRender) {
                        cellContent = (
                          <span
                            className="w-full text-center text-xs font-semibold tabular-nums"
                            style={{ color: 'var(--agv-text-muted)' }}
                          >
                            {rowNumberOffset + rowIndex + 1}
                          </span>
                        );
                      } else if (meta.hasCustomRender) {
                        cellContent = col.renderCell!({
                          column: col,
                          row,
                          rowIndex,
                          isSelected,
                          isChecked: false,
                        });
                      } else if (customRenderCell) {
                        cellContent = customRenderCell({
                          column: col,
                          row,
                          rowIndex,
                          isSelected,
                          isChecked: false,
                        });
                      } else {
                        const rawValue = customGetCellValue
                          ? customGetCellValue(row, meta.key)
                          : col.valueGetter
                          ? col.valueGetter(row, rowIndex)
                          : (row as any)?.[meta.key];

                        if (rawValue !== null && rawValue !== undefined && rawValue !== '') {
                          if (meta.isNumber) {
                            cellContent = (
                              <span className="truncate tabular-nums">
                                {formatGridNumber(rawValue) || String(rawValue)}
                              </span>
                            );
                          } else if (meta.isTime) {
                            cellContent = (
                              <span className="truncate tabular-nums">
                                {formatBasicCellTime(rawValue)}
                              </span>
                            );
                          } else if (meta.isDateLike) {
                            cellContent = (
                              <span className="truncate tabular-nums">
                                {formatGridDateValue(rawValue, Boolean(col.showTime)) ||
                                  String(rawValue)}
                              </span>
                            );
                          } else {
                            cellContent = <span className="truncate">{String(rawValue)}</span>;
                          }
                        }
                      }

                      return (
                        <div
                          key={meta.key}
                          data-col-key={meta.key}
                          data-cell-role={meta.isStt ? 'stt' : 'data'}
                          style={meta.cellStyle}
                          className={
                            isSelected
                              ? meta.classNameSelected
                              : isEven
                              ? meta.classNameEven
                              : meta.classNameOdd
                          }
                        >
                          {cellContent}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            {(loading || refreshing) && totalPageRowCount > 0 ? (
              <div className="sticky left-0 bottom-2 px-3 flex justify-end pointer-events-none z-20">
                <div
                  className="rounded-md border px-3 py-1 text-xs font-medium"
                  style={{
                    backgroundColor: 'var(--agv-bg-popup, var(--agv-bg-root))',
                    borderColor: 'var(--agv-border)',
                    color: 'var(--agv-text-muted)',
                  }}
                >
                  Đang cập nhật...
                </div>
              </div>
            ) : null}

            {!loading && error && totalPageRowCount > 0 ? (
              <div className="sticky left-0 bottom-2 px-3 z-20">
                <div
                  role="alert"
                  className="inline-flex flex-wrap items-center gap-3 rounded-md border px-3 py-2 text-xs"
                  style={{
                    backgroundColor: 'var(--agv-danger-bg)',
                    borderColor: 'var(--agv-danger)',
                    color: 'var(--agv-danger)',
                  }}
                >
                  <span>{error}</span>
                  {onRetry ? (
                    <AdvButton variant="default" size="sm" onClick={onRetry}>
                      Thử lại
                    </AdvButton>
                  ) : null}
                </div>
              </div>
            ) : null}

            {totalPageRowCount === 0 ? (
              <div className="sticky left-0 min-h-[200px] flex flex-col items-center justify-center gap-3 p-6 text-center select-none">
                {loading ? (
                  <span className="text-xs font-medium" style={{ color: 'var(--agv-text-muted)' }}>
                    Đang tải dữ liệu...
                  </span>
                ) : error ? (
                  <>
                    <span className="text-xs font-medium" style={{ color: 'var(--agv-danger)' }}>
                      {error}
                    </span>
                    {onRetry ? (
                      <AdvButton variant="default" size="sm" onClick={onRetry}>
                        Thử lại
                      </AdvButton>
                    ) : null}
                  </>
                ) : (
                  <span className="text-xs font-medium" style={{ color: 'var(--agv-text-muted)' }}>
                    {emptyText}
                  </span>
                )}
              </div>
            ) : null}
          </div>

          {!isWindowScroll && (
            <div
              ref={vBarRef}
              aria-hidden="true"
              onMouseDown={onVerticalTrackMouseDown}
              className="agv-overlay-scroll-bar is-vertical"
              style={{ display: 'none' }}
            >
              <div
                ref={vThumbRef}
                onPointerDown={onVerticalThumbPointerDown}
                className="agv-overlay-scroll-thumb is-vertical"
              />
            </div>
          )}
          <div
            ref={hBarRef}
            aria-hidden="true"
            onMouseDown={onHorizontalTrackMouseDown}
            className="agv-overlay-scroll-bar is-horizontal"
            style={{ display: 'none' }}
          >
            <div
              ref={hThumbRef}
              onPointerDown={onHorizontalThumbPointerDown}
              className="agv-overlay-scroll-thumb is-horizontal"
            />
          </div>
        </div>

        {effectiveEnableStatusBar ? (
          <Suspense fallback={null}>
            <LazyGridStatusBar
              page={currentPage}
              pageSize={currentPageSize}
              totalItems={totalPagerItems}
              pageSizeOptions={resolvedPageSizeOptions}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              surfaceTheme={surfaceTheme}
              disabled={loading}
            />
          </Suspense>
        ) : null}

        {isPopupLockActive ? (
          <div
            aria-hidden="true"
            className="agv-grid-popup-shield absolute inset-0 bg-transparent pointer-events-auto select-none"
            style={{ zIndex: 1220 }}
            onMouseDown={(e) => {
              suppressNextGridClickRef.current = true;
              e.preventDefault();
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onDoubleClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onContextMenu={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          />
        ) : null}
      </div>
    </div>
  );
}

export function DataGrid<TRecord extends Record<string, any>>(props: DataGridProps<TRecord>) {
  const {
    pagination,
    enablePagination,
    enableStatusBar,
    enableCellSpan,
    spanMethod,
    enableTreeData,
    treeData,
    enableRowDetail,
    detailRow,
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
    showStatusBar,
    enableContextMenu,
    enableFloatingToolbar,
    enableColumnChooser,
    enableSettings,
    enableFullscreen,
    enableCrossHover,
    crossHoverHighlightHeader,
    height,
    style,
    surfaceTheme = SURFACE_THEMES.LIGHT,
  } = props;

  const paginationObj =
    typeof pagination === 'object' && pagination !== null ? pagination : undefined;
  const resolvedFeatureStatusBar =
    pagination === false
      ? false
      : pagination === true || paginationObj !== undefined
      ? true
      : enableStatusBar;

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
        enableStatusBar: resolvedFeatureStatusBar,
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
      resolvedFeatureStatusBar,
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

  const effectiveEnableStatusBar =
    pagination === false ? false : enablePagination ?? features.enableStatusBar;
  const isAutoSized = features.autoHeight && height === undefined;

  if (canUseBasicViewEngine(props, features)) {
    return (
      <BasicDataGridView
        props={props}
        features={features}
        effectiveEnableStatusBar={effectiveEnableStatusBar}
        isAutoSized={isAutoSized}
      />
    );
  }

  return (
    <Suspense
      fallback={
        <div
          data-theme={surfaceTheme}
          className={`${
            isAutoSized ? 'w-full' : 'flex-1 min-h-0'
          } flex flex-col agv-grid-root ${getThemeClass(surfaceTheme)}`}
          style={height !== undefined ? { height, ...style } : style}
        />
      }
    >
      <LazyDataGridEnterprise {...props} />
    </Suspense>
  );
}
