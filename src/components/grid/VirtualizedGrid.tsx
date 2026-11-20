import React, {
  lazy,
  Suspense,
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useMemo,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from 'react';
import {
  VirtualizedGridProps,
  VirtualizedGridRef,
  GridToolbarPopupType,
  ColumnDef,
  PinPosition,
  PIN_POSITIONS,
  DATA_TYPES,
  FILTER_MODES,
  CONTEXT_MENU_TYPES,
  ContextMenuData,
  GRID_EDIT_MODES,
  SURFACE_THEMES,
  GRID_LAYOUT_MODES,
  resolveGridFeatures,
} from './types';
import {
  DEFAULT_CHUNK_SIZE,
  DEFAULT_ROW_HEIGHT,
  getThemeClasses,
} from './constants';
import { getThemeClass } from '../../themes';
import { AdvButton } from '../ui/AdvButton';
import { GridHeader } from './GridHeader';
import { GridVirtualRowSlot } from './GridVirtualRowSlot';
import { GridRow } from './GridRow';
import { buildGridLayoutSnapshot } from './colRenderMeta';
import type { AdvChecklistFilterPopupRef } from './AdvChecklistFilterPopup';
import { normalizeSortRules, toggleColumnSortRules } from './multiSortUtils';
import {
  createEqualsFilter,
  getDefaultFilterOpForColumn,
  getGridCellValue,
  isNoInputFilterOp,
  isSelectionColumn,
} from './gridFormatUtils';
import { matchSimpleFilterSync } from './gridSimpleFilter';
import { QueryGroup } from './floating/types';
import { countActiveQueryRules, hasActiveQueryRules } from './floating/queryRuleCheck';
import { useGridLayoutMode } from './responsive/useGridLayoutMode';
import {
  compilePhoneCard,
  compileTabletGroups,
  computeTabletTrackMinWidth,
} from './responsive/responsiveColumnUtils';

const LazyGridFilterRow = lazy(() =>
  import('./GridFilterRow').then((m) => ({ default: m.GridFilterRow }))
);
const LazyColumnContextMenu = lazy(() =>
  import('./ColumnContextMenu').then((m) => ({ default: m.ColumnContextMenu }))
);
const LazyAdvChecklistFilterPopup = lazy(() =>
  import('./AdvChecklistFilterPopup').then((m) => ({ default: m.AdvChecklistFilterPopup }))
);
const LazyGridExternalPopupHost = lazy(() =>
  import('./GridExternalPopupHost').then((m) => ({ default: m.GridExternalPopupHost }))
);
const LazyGridResponsiveHeader = lazy(() =>
  import('./responsive/GridResponsiveHeader').then((m) => ({
    default: m.GridResponsiveHeader,
  }))
);
const LazyResponsiveSortFilterModal = lazy(() =>
  import('./responsive/ResponsiveSortFilterModal').then((m) => ({
    default: m.ResponsiveSortFilterModal,
  }))
);
import './grid.css';
import {
  useColumnResize,
  useColumnAutoFit,
  useInCellEditor,
  useGridKeyboardNav,
  useGridSortFlipAnimation,
  useGridPopupLock,
  useGridColumnLayout,
  useDynamicRowHeights,
  useGridOverlayScrollbar,
  useGridCrossHover,
  isAnyPopupActive,
} from './hooks';
import { computeSpanWindowPlan, type SpanWindowPlan } from './gridCellSpanEngine';

const EMPTY_NUMBERS: number[] = [];

const VirtualizedGridComponent = forwardRef<VirtualizedGridRef, VirtualizedGridProps>(
  <T extends any>(
    {
      data,
      rowCount: customRowCount,
      getRow,
      getRowId,
      columns,
      columnGroups,
      tabletGroups,
      phoneCard,
      columnPins: controlledPins,
      defaultColumnPins,
      onColumnPinsChange,
      colWidths: controlledWidths,
      defaultColWidths,
      onColWidthsChange,
      sortConfig,
      onSortChange,
      sortRules,
      onSortRulesChange,
      selectedRowIndex,
      selectedRowKey,
      onSelectRow,
      onRowDetail,
      checkedRowIndices,
      onToggleCheck,
      onClearCheckedRows,
      renderCell,
      chunkSize = DEFAULT_CHUNK_SIZE,
      rowHeight = DEFAULT_ROW_HEIGHT,
      overscanChunks: _overscanChunks = 3,
      overscanRows = 5,
      scrollbarAlwaysOn = false,
      dynamicRowHeight = false,
      estimatedRowHeight,
      getRowHeight: getRowHeightProp,
      antiGhostMode = true,
      surfaceTheme = SURFACE_THEMES.LIGHT,
      onToggleGroup,
      onQuickFilter,
      formulaMode,
      onFormulaModeChange,
      editMode = GRID_EDIT_MODES.VIEW,
      onEditModeChange: _onEditModeChange,
      editingCell: controlledEditingCell,
      onStartEditCell,
      onEndEditCell,
      onCellChange,
      variant,
      autoHeight,
      maxHeight,
      persistState,
      enableFiltering,
      showFilterRow: rawShowFilterRow,
      enableHeaderFilter,
      enableQuickSearch,
      enableQueryBuilder,
      enableSorting,
      enableMultiSort,
      enableColumnResize,
      enableColumnReorder,
      enableColumnPinning,
      enableColumnHide,
      enableRowNumber,
      enableSelection,
      enableGrouping,
      enableRowPinning,
      enableSummary,
      enableStatusBar,
      enableContextMenu,
      columnFilters = {},
      onColumnFilterChange,
      onClearAllColumnFilters,
      onClearAllCriteria,
      hasColumnEmptyCells,
      getColumnDateBounds,
      formatChecklistDisplay,
      getCellValue,
      getDistinctValues,
      className = '',
      style,
      enableFloatingToolbar: rawEnableFloatingToolbar,
      enableColumnChooser,
      enableFullscreen,
      quickFilterText: controlledQuickFilterText,
      onQuickFilterTextChange: controlledOnQuickFilterTextChange,
      appliedQueryTree: controlledAppliedQueryTree,
      onApplyQueryTree: controlledOnApplyQueryTree,
      onToolbarStateChange,
      hiddenColKeys: controlledHiddenColKeys,
      defaultHiddenColKeys,
      onHiddenColKeysChange,
      onReorderColumns,
      onResetColumns: controlledOnResetColumns,
      headerHeight: customHeaderHeight,
      groupByColumnKey,
      onToggleGroupByColumn,
      columnSums,
      emptyColKeys,
      onCollapseAllGroups,
      onExpandAllGroups,
      onUngroup,
      onCopyGroupTable,
      groupSortConfig,
      onToggleGroupSort,
      matchFilterValue,
      dataVersion = 0,
      layoutMode = GRID_LAYOUT_MODES.AUTO,
      gridId,
      loading = false,
      refreshing = false,
      error = null,
      onRetry,
      emptyText,
      statusBar,
      showSummaryRow: controlledShowSummaryRow,
      showStatusBar: controlledShowStatusBar,
      modules,
      pinnedTopRowData,
      enableCenterDock,
      enableCellEditing,
      enableResponsiveLayout,
      enableCrossHover,
      crossHoverHighlightHeader,
      enableCellSpan,
      enableTreeData,
      enableRowDetail,
      spanMethod,
      maxRowSpanLookback,
      treeColumnKey,
      treeIndentSize,
      onToggleTreeExpand,
      detailExpandColKey,
      isRowDetailExpanded,
      canExpandRowDetail,
      onToggleRowDetail,
      renderDetailRow,
      hasDynamicDetailRows,
      treeDetailActions,
      _resolvedFeatures,
    }: VirtualizedGridProps<T>,
    ref: React.Ref<VirtualizedGridRef>
  ) => {
    const features = useMemo(
      () =>
        _resolvedFeatures ??
        resolveGridFeatures({
          modules,
          variant,
          autoHeight,
          maxHeight,
          persistState,
          enableFiltering,
          showFilterRow: rawShowFilterRow,
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
          enableCrossHover,
          crossHoverHighlightHeader,
          enableCellSpan: enableCellSpan ?? (spanMethod !== undefined ? true : undefined),
          enableTreeData,
          enableRowDetail,
          enableSummary,
          showSummaryRow: controlledShowSummaryRow,
          enableStatusBar,
          showStatusBar: controlledShowStatusBar,
          enableContextMenu,
          enableFloatingToolbar: rawEnableFloatingToolbar,
          enableColumnChooser,
          enableFullscreen,
        }),
      [
        _resolvedFeatures,
        modules,
        variant,
        autoHeight,
        maxHeight,
        persistState,
        enableFiltering,
        rawShowFilterRow,
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
        enableCrossHover,
        crossHoverHighlightHeader,
        enableCellSpan,
        spanMethod,
        enableTreeData,
        enableRowDetail,
        enableSummary,
        controlledShowSummaryRow,
        enableStatusBar,
        controlledShowStatusBar,
        enableContextMenu,
        rawEnableFloatingToolbar,
        enableColumnChooser,
        enableFullscreen,
      ]
    );
    const effectiveEditMode = features.enableCellEditing ? editMode : GRID_EDIT_MODES.VIEW;
    // Active column filter count (hỗ trợ cả Row Filter và Checklist độc lập)
    const activeColumnFilterCount = useMemo(() => {
      return Object.values(columnFilters).filter((f) => {
        if (!f) return false;
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
    // Total row count
    const totalRows = customRowCount !== undefined ? customRowCount : data ? data.length : 0;

    // Row getter
    const getRowItem = useCallback(
      (index: number): T => {
        if (getRow) return getRow(index);
        if (data) return data[index];
        throw new Error('VirtualizedGrid requires either data array or getRow function');
      },
      [data, getRow]
    );

    // Tự động nhận diện trích xuất giá trị ô nếu props getCellValue không được truyền
    const effectiveGetCellValue = useCallback(
      (rowIndex: number, colKey: string) => {
        if (getCellValue) return getCellValue(rowIndex, colKey);
        const row = getRowItem(rowIndex);
        return getGridCellValue(row, colKey);
      },
      [getCellValue, getRowItem]
    );

    // Bộ lọc dữ liệu mặc định nhẹ nếu không truyền từ bên ngoài
    const effectiveMatchFilterValue = matchFilterValue || matchSimpleFilterSync;

    // Tự động phát hiện cột có ô trống nếu không truyền hàm riêng
    const defaultHasColumnEmptyCells = useCallback(
      (colKey: string) => {
        const sample = Math.min(totalRows, 300);
        for (let i = 0; i < sample; i++) {
          const val = effectiveGetCellValue(i, colKey);
          if (val !== null && val !== undefined && String(val).trim() === '') return true;
        }
        return false;
      },
      [totalRows, effectiveGetCellValue]
    );

    const filterEngineRef = useRef<typeof import('./gridFilterEngine') | null>(null);
    const [, setFilterEngineVersion] = useState(0);

    // Tự động tìm giới hạn ngày (lazy-load gridFilterEngine khi dùng độc lập không qua DataGrid)
    const defaultGetColumnDateBounds = useCallback(
      (colKey: string) => {
        if (filterEngineRef.current) {
          return filterEngineRef.current.getColumnDateBoundsFromGetter(
            effectiveGetCellValue,
            totalRows,
            colKey
          );
        }
        void import('./gridFilterEngine').then((m) => {
          filterEngineRef.current = m;
          setFilterEngineVersion((v) => v + 1);
        });
        return { min: '', max: '' };
      },
      [effectiveGetCellValue, totalRows]
    );

    const effectiveHasColumnEmptyCells = hasColumnEmptyCells || defaultHasColumnEmptyCells;
    const effectiveGetColumnDateBounds = getColumnDateBounds || defaultGetColumnDateBounds;

    const containerRef = useRef<HTMLDivElement | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);
    const lastScrollTopRef = useRef<number>(0);
    const virtualScrollTopRef = useRef<number>(0);
    const lastScrollLeftRef = useRef<number>(0);

    // In-Cell Editing Hook (quản lý trạng thái sửa ô & scroll restore)
    const {
      activeEditingCell,
      handleStartEditCell,
      handleEndEditCell,
      lockedScrollPosRef,
    } = useInCellEditor({
      controlledEditingCell,
      onStartEditCell,
      onEndEditCell,
      scrollContainerRef,
    });
    const effectiveEditingCell = features.enableCellEditing ? activeEditingCell : null;
    const effectiveStartEditCell = features.enableCellEditing ? handleStartEditCell : undefined;

    // Bố cục cột, độ rộng, ghim trái/phải/giữa, ẩn cột & CSS variables
    const {
      colMap,
      colWidths,
      setColWidth,
      setMultipleColWidths,
      columnPins,
      setColumnPin,
      hiddenColKeys,
      setHiddenColKeys,
      effectiveColumns,
      columnDataTypes,
      effectiveColumnGroups,
      visibleColKeys,
      handleVisibleColKeysChange,
      handleResetColumns,
      leftColumns,
      rightColumns,
      flatColumns,
      leftOffsets,
      rightOffsets,
      centerPinnedColKeys,
      centerDockStatus,
      computeCenterDock,
      centerLeftOffsets,
      centerRightOffsets,
      lastEffectiveLeftColKey,
      firstEffectiveRightColKey,
      totalGridWidth,
      middleElements,
      gridColVars,
    } = useGridColumnLayout({
      columns,
      columnGroups,
      totalRows,
      features,
      controlledWidths,
      defaultColWidths,
      onColWidthsChange,
      controlledPins,
      defaultColumnPins,
      onColumnPinsChange,
      controlledHiddenColKeys,
      defaultHiddenColKeys,
      onHiddenColKeysChange,
      controlledOnResetColumns,
      scrollContainerRef,
    });

    // External Popover states
    const [internalQuickFilterText, setInternalQuickFilterText] = useState('');
    const [isQuickFilterSmart, setIsQuickFilterSmart] = useState(true);
    const [internalQueryTree, setInternalQueryTree] = useState<QueryGroup | null>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [externalPopup, setExternalPopup] = useState<{
      type: GridToolbarPopupType;
      anchorEl: HTMLElement | null;
    } | null>(null);

    const currentQuickFilterText =
      controlledQuickFilterText !== undefined
        ? controlledQuickFilterText
        : internalQuickFilterText;

    const handleQuickFilterChange = useCallback(
      (text: string) => {
        if (controlledOnQuickFilterTextChange) {
          controlledOnQuickFilterTextChange(text);
        } else {
          setInternalQuickFilterText(text);
        }
        if (onQuickFilter) {
          onQuickFilter('all', text);
        }
      },
      [controlledOnQuickFilterTextChange, onQuickFilter]
    );

    const handleToggleQuickFilterSmart = useCallback(() => {
      setIsQuickFilterSmart((prev) => !prev);
    }, []);

    const currentQueryTree =
      controlledAppliedQueryTree !== undefined
        ? controlledAppliedQueryTree
        : internalQueryTree;

    const handleApplyQueryTree = useCallback(
      (tree: QueryGroup | null) => {
        if (controlledOnApplyQueryTree) {
          controlledOnApplyQueryTree(tree);
        } else {
          setInternalQueryTree(tree);
        }
      },
      [controlledOnApplyQueryTree]
    );

    const toggleFullscreen = useCallback(() => {
      setIsFullscreen((prev) => !prev);
    }, []);

    // Shortcut Alt + Shift + F: Kích hoạt mở rộng / thu nhỏ toàn màn hình (Fullscreen toggle)
    useEffect(() => {
      if (!features.enableFullscreen) {
        if (isFullscreen) setIsFullscreen(false);
        return;
      }
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.altKey && e.shiftKey && (e.key === 'f' || e.key === 'F')) {
          e.preventDefault();
          toggleFullscreen();
        } else if (e.key === 'Escape' && isFullscreen) {
          e.preventDefault();
          setIsFullscreen(false);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [features.enableFullscreen, toggleFullscreen, isFullscreen]);

    const { activeMode } = useGridLayoutMode({
      layoutMode,
      containerRef,
      enabled: features.enableResponsiveLayout,
    });
    const isTabletMode = activeMode === 'tablet';
    const isPhoneMode = activeMode === 'phone';
    const isResponsiveMode = isTabletMode || isPhoneMode;

    const showSummaryRow = features.enableSummary ? (controlledShowSummaryRow ?? true) : false;
    const showStatusBar = features.enableStatusBar ? (controlledShowStatusBar ?? true) : false;

    const actualRowHeight = isTabletMode ? 76 : isPhoneMode ? 108 : rowHeight;
    const compiledTabletGroups = useMemo(
      () =>
        isTabletMode
          ? compileTabletGroups(flatColumns, tabletGroups, effectiveColumnGroups, hiddenColKeys)
          : undefined,
      [isTabletMode, flatColumns, tabletGroups, effectiveColumnGroups, hiddenColKeys]
    );
    const compiledPhoneCard = useMemo(
      () =>
        isPhoneMode
          ? compilePhoneCard(flatColumns, phoneCard, hiddenColKeys)
          : undefined,
      [isPhoneMode, flatColumns, phoneCard, hiddenColKeys]
    );
    const EXPANDED_CARD_EXTRA_HEIGHT = compiledPhoneCard?.extraHeight ?? 140;
    const [phoneExpandedRows, setPhoneExpandedRows] = useState<Map<string | number, number>>(
      () => new Map()
    );

    const handleToggleExpandPhoneCard = useCallback((rowKey: string | number, rowIndex: number) => {
      setPhoneExpandedRows((prev) => {
        const next = new Map(prev);
        if (next.has(rowKey)) next.delete(rowKey);
        else next.set(rowKey, rowIndex);
        return next;
      });
    }, []);

    useEffect(() => {
      if (activeMode !== 'phone' && phoneExpandedRows.size > 0) {
        setPhoneExpandedRows(new Map());
      }
    }, [activeMode, phoneExpandedRows.size]);

    useEffect(() => {
      if (phoneExpandedRows.size > 0) {
        setPhoneExpandedRows(new Map());
      }
    }, [dataVersion, totalRows]);

    // Context Menu State & Responsive Sort/Filter Modal
    const [activeContextMenu, setActiveContextMenu] = useState<ContextMenuData | null>(null);
    const [isSortFilterModalOpen, setIsSortFilterModalOpen] = useState(false);

    // Khóa cuộn & chặn tương tác nền khi mở bất kỳ Popup/Modal nào
    const {
      isToolbarPopupOpen,
      setIsToolbarPopupOpen,
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
      activeContextMenu,
      isSortFilterModalOpen,
      activeEditingCell,
    });

    useEffect(() => {
      setIsToolbarPopupOpen(externalPopup !== null);
    }, [externalPopup, setIsToolbarPopupOpen]);

    const isPopupTypeEnabled = useCallback(
      (type: GridToolbarPopupType) => {
        switch (type) {
          case 'search':
            return features.enableQuickSearch;
          case 'queryBuilder':
            return features.enableQueryBuilder;
          case 'columnChooser':
            return features.enableColumnChooser;
          case 'multiSort':
            return features.enableMultiSort;
          default:
            return false;
        }
      },
      [
        features.enableQuickSearch,
        features.enableQueryBuilder,
        features.enableColumnChooser,
        features.enableMultiSort,
      ]
    );

    const openExternalPopup = useCallback(
      (type: GridToolbarPopupType, anchorEl: HTMLElement | null) => {
        if (!isPopupTypeEnabled(type)) return;
        if (typeof window !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent('agv-close-all-popups', { detail: { except: 'external-popover' } })
          );
        }
        setExternalPopup({ type, anchorEl });
      },
      [isPopupTypeEnabled]
    );

    const toggleExternalPopup = useCallback(
      (type: GridToolbarPopupType, anchorEl: HTMLElement | null) => {
        if (!isPopupTypeEnabled(type)) return;
        setExternalPopup((prev) => {
          if (prev && prev.type === type && prev.anchorEl === anchorEl) {
            return null;
          }
          if (typeof window !== 'undefined') {
            window.dispatchEvent(
              new CustomEvent('agv-close-all-popups', { detail: { except: 'external-popover' } })
            );
          }
          return { type, anchorEl };
        });
      },
      [isPopupTypeEnabled]
    );

    const closeExternalPopup = useCallback(() => {
      setExternalPopup(null);
    }, []);

    useEffect(() => {
      if (externalPopup && !isPopupTypeEnabled(externalPopup.type)) {
        setExternalPopup(null);
      }
    }, [externalPopup, isPopupTypeEnabled]);

    // Column Resizing & Auto-Fit Hooks
    const { handleMouseDownResize } = useColumnResize({
      colMap,
      colWidths,
      setColWidth,
    });

    const {
      handleAutoFitColumn,
      handleAutoFitAllColumns,
      handleAutoFitBandColumns,
    } = useColumnAutoFit({
      colMap,
      effectiveColumns,
      columnGroups,
      getRowItem,
      columnSums,
      totalRows,
      setColWidth,
      setMultipleColWidths,
    });

    // Column & Band Pinning handlers
    const handleSetPin = useCallback(
      (colKey: string, pin: PinPosition) => {
        setColumnPin(colKey, pin);
        setActiveContextMenu(null);
      },
      [setColumnPin]
    );

    const handleSetBandPin = useCallback(
      (groupId: string, pin: PinPosition) => {
        const group = columnGroups?.find((g) => g.id === groupId);
        if (!group) return;
        group.keys.forEach((key) => setColumnPin(key, pin));
        setActiveContextMenu(null);
      },
      [columnGroups, setColumnPin]
    );

    // Hide / Show columns & bands handlers
    const handleHideColumn = useCallback(
      (colKey: string) => {
        setHiddenColKeys((prev) => new Set(prev).add(colKey));
        setActiveContextMenu(null);
      },
      [setHiddenColKeys]
    );

    const handleHideAllEmptyColumns = useCallback(() => {
      if (!emptyColKeys || emptyColKeys.size === 0) return;
      setHiddenColKeys((prev) => {
        const next = new Set(prev);
        emptyColKeys.forEach((k) => next.add(k));
        return next;
      });
      setActiveContextMenu(null);
    }, [emptyColKeys, setHiddenColKeys]);

    const handleShowAllHiddenColumns = useCallback(() => {
      setHiddenColKeys(new Set());
      setActiveContextMenu(null);
    }, [setHiddenColKeys]);

    const handleHideBand = useCallback(
      (groupId: string) => {
        const group = columnGroups?.find((g) => g.id === groupId);
        if (!group) return;
        setHiddenColKeys((prev) => {
          const next = new Set(prev);
          group.keys.forEach((k) => next.add(k));
          return next;
        });
        setActiveContextMenu(null);
      },
      [columnGroups, setHiddenColKeys]
    );

    // Distinct values cache ref để mở lại Checklist popup 0ms
    const distinctValuesCacheRef = useRef<
      Record<string, { values: string[]; hasBlanks: boolean }>
    >({});

    useEffect(() => {
      distinctValuesCacheRef.current = {};
    }, [columnFilters, controlledQuickFilterText, controlledAppliedQueryTree, dataVersion]);

    // Checklist Popup (mount lười khi người dùng bấm phễu lần đầu)
    const checklistPopupRef = useRef<AdvChecklistFilterPopupRef | null>(null);
    const [isChecklistMounted, setIsChecklistMounted] = useState(false);
    const [activeChecklistColKey, setActiveChecklistColKey] = useState<string | null>(null);
    const pendingChecklistOpenRef = useRef<{ colKey: string; pos: any; curFilter: any } | null>(null);

    const handleChecklistPopupRef = useCallback((node: AdvChecklistFilterPopupRef | null) => {
      checklistPopupRef.current = node;
      if (node && pendingChecklistOpenRef.current) {
        const pending = pendingChecklistOpenRef.current;
        pendingChecklistOpenRef.current = null;
        node.open(pending.colKey, pending.pos, pending.curFilter);
      }
    }, []);

    const effectiveSortRules = useMemo(
      () => normalizeSortRules(sortRules, sortConfig),
      [sortRules, sortConfig]
    );

    const hasActiveFilterOrSort = Boolean(
      (features.enableSorting && effectiveSortRules.length > 0) ||
      (features.enableQuickSearch && currentQuickFilterText && currentQuickFilterText.trim().length > 0) ||
      (features.enableFiltering && columnFilters && Object.values(columnFilters).some((f) => f && f.val !== undefined && f.val !== ''))
    );

    useEffect(() => {
      if (!features.enableContextMenu && activeContextMenu) {
        setActiveContextMenu(null);
      }
    }, [features.enableContextMenu, activeContextMenu]);

    useEffect(() => {
      const handleCloseAll = (e: Event) => {
        const ce = e as CustomEvent;
        if (ce.detail?.except !== 'context-menu') {
          setActiveContextMenu(null);
        }
        if (ce.detail?.except !== FILTER_MODES.CHECKLIST) {
          checklistPopupRef.current?.close();
        }
      };
      window.addEventListener('agv-close-all-popups', handleCloseAll);
      return () => {
        window.removeEventListener('agv-close-all-popups', handleCloseAll);
      };
    }, []);

    const handleOpenChecklistFilter = useCallback(
      (colKey: string, e: React.MouseEvent) => {
        if (!features.enableHeaderFilter || emptyColKeys?.has(colKey)) return;
        if (checklistPopupRef.current?.isOpenFor(colKey)) {
          checklistPopupRef.current.close();
          return;
        }

        window.dispatchEvent(
          new CustomEvent('agv-close-all-popups', {
            detail: { except: FILTER_MODES.CHECKLIST, source: FILTER_MODES.CHECKLIST },
          })
        );
        setActiveContextMenu(null);

        const anchorEl = e.currentTarget as HTMLElement;
        const rect = anchorEl.getBoundingClientRect();
        const vh = window.innerHeight;
        const spaceBelow = vh - rect.bottom - 8;
        const spaceAbove = rect.top - 8;
        const isFlipUp = spaceBelow < 320 && spaceAbove > spaceBelow;

        let left = Math.round(rect.left);
        if (left + 270 > window.innerWidth - 10) {
          left = Math.max(10, window.innerWidth - 270 - 10);
        }

        const pos = {
          top: rect.bottom + 4,
          bottom: isFlipUp ? vh - rect.top + 4 : undefined,
          left,
          isFlipUp,
          anchorEl,
        };
        const curFilter = columnFilters[colKey];

        if (checklistPopupRef.current) {
          checklistPopupRef.current.open(colKey, pos, curFilter);
        } else {
          pendingChecklistOpenRef.current = { colKey, pos, curFilter };
          setIsChecklistMounted(true);
        }
      },
      [features.enableHeaderFilter, columnFilters, emptyColKeys]
    );

    // Áp dụng giá trị lọc checklist khi tick/untick (giữ nguyên độc lập Row Filter của cột)
    const handleApplyChecklistFilter = useCallback(
      (colKey: string, selected: Set<any>, includeBlanks: boolean) => {
        if (!onColumnFilterChange) return;
        const cur = columnFilters[colKey] || {
          op: getDefaultFilterOpForColumn(colKey, flatColumns),
          val: '',
        };

        onColumnFilterChange(colKey, {
          ...cur,
          selectedValues: Array.from(selected),
          includeBlanks,
        });
      },
      [onColumnFilterChange, columnFilters, flatColumns]
    );

    // Xóa bộ lọc checklist cho cột (bảo toàn trọn vẹn Row Filter)
    const handleClearChecklistFilter = useCallback(
      (colKey: string) => {
        if (!onColumnFilterChange) return;
        const cur = columnFilters[colKey] || {
          op: getDefaultFilterOpForColumn(colKey, flatColumns),
          val: '',
        };
        onColumnFilterChange(colKey, {
          ...cur,
          selectedValues: [],
          includeBlanks: false,
        });
      },
      [onColumnFilterChange, columnFilters, flatColumns]
    );

    // Scroll to Top / Bottom handlers
    const handleScrollToTop = useCallback(() => {
      const el = scrollContainerRef.current;
      if (el) {
        el.scrollTo({ top: 0, behavior: 'smooth' });
      }
      setActiveContextMenu(null);
    }, []);

    const handleScrollToBottom = useCallback(() => {
      const el = scrollContainerRef.current;
      if (el) {
        el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
      }
      setActiveContextMenu(null);
    }, []);

    // Quản lý danh sách dòng ghim cố định trên đầu bảng (Pin Row to Top)
    const getRowKey = useCallback(
      (row: T, rowIndex: number): string | number => {
        if (getRowId) return getRowId(row, rowIndex);
        return (row as any)?.originalIndex ?? (row as any)?.id ?? rowIndex;
      },
      [getRowId]
    );

    const [pinnedRows, setPinnedRows] = useState<
      Array<{ rowKey: string | number; rowIndex: number; row: T }>
    >([]);

    const effectivePinnedRows = useMemo(() => {
      if (!features.enableRowPinning) return [];
      const staticPinned = (pinnedTopRowData ?? []).map((row, idx) => ({
        rowKey: getRowKey(row, -(idx + 1)),
        rowIndex: -(idx + 1),
        row,
      }));
      if (staticPinned.length === 0) return pinnedRows;
      if (pinnedRows.length === 0) return staticPinned;
      const staticKeySet = new Set(staticPinned.map((p) => p.rowKey));
      return [...staticPinned, ...pinnedRows.filter((p) => !staticKeySet.has(p.rowKey))];
    }, [features.enableRowPinning, pinnedTopRowData, pinnedRows, getRowKey]);

    const pinnedRowKeysSet = useMemo(
      () => new Set(pinnedRows.map((p) => p.rowKey)),
      [pinnedRows]
    );

    const handleTogglePinContextMenuRow = useCallback(() => {
      if (!activeContextMenu || activeContextMenu.type !== CONTEXT_MENU_TYPES.ROW) return;
      const { row, rowIndex } = activeContextMenu;
      if (!row || (row as any)._isGroupRow) return;
      const rKey = getRowKey(row, rowIndex);
      setPinnedRows((prev) => {
        if (prev.some((p) => p.rowKey === rKey)) {
          return prev.filter((p) => p.rowKey !== rKey);
        }
        const resolvedIdx =
          typeof (row as any)?.rowIndex === 'number' && (row as any).rowIndex >= 0
            ? (row as any).rowIndex
            : rowIndex;
        const snapshotRow =
          (row as any)?._rowKey !== undefined && typeof (row as any)?.rowIndex === 'number'
            ? row
            : ({
                ...(row as any),
                _baseRecord: (row as any)?._baseRecord ?? row,
                _rowKey: rKey,
                rowIndex: resolvedIdx,
                ...(renderCell || (row as any)?.col_stt !== undefined
                  ? {}
                  : { col_stt: resolvedIdx + 1 }),
              } as T);
        return [...prev, { rowKey: rKey, rowIndex: resolvedIdx, row: snapshotRow }];
      });
    }, [activeContextMenu, getRowKey, renderCell]);

    const handleUnpinRow = useCallback((rowKey: string | number) => {
      setPinnedRows((prev) => prev.filter((p) => p.rowKey !== rowKey));
    }, []);

    const handleClearPinnedRows = useCallback(() => {
      setPinnedRows([]);
    }, []);

    const handleInternalCellChange = useCallback(
      (rIdx: number, rObj: T, cKey: string, newVal: any) => {
        setPinnedRows((prev) => {
          if (prev.length === 0) return prev;
          const rKey = getRowKey(rObj, rIdx);
          if (!prev.some((p) => p.rowKey === rKey)) return prev;
          return prev.map((p) =>
            p.rowKey === rKey
              ? { ...p, row: { ...(p.row as any), [cKey]: newVal } }
              : p
          );
        });
        onCellChange?.(rIdx, rObj, cKey, newVal);
      },
      [getRowKey, onCellChange]
    );

    // Context Menu Triggers
    const handleColumnContextMenu = useCallback(
      (colKey: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const col = colMap[colKey];
        if (!col || col.dataType === DATA_TYPES.SYSTEM || col.isRowNumber || isSelectionColumn(col) || col.disableHeaderContextMenu) return;
        checklistPopupRef.current?.close();
        window.dispatchEvent(
          new CustomEvent('agv-close-all-popups', {
            detail: { except: 'context-menu', source: 'context-menu' },
          })
        );
        setActiveContextMenu({
          type: CONTEXT_MENU_TYPES.HEADER,
          x: e.clientX,
          y: e.clientY,
          column: col,
          currentPin: columnPins[colKey] || PIN_POSITIONS.NONE,
          hasHiddenColumns: hiddenColKeys.size > 0,
        });
      },
      [colMap, columnPins, hiddenColKeys]
    );

    const handleBandContextMenu = useCallback(
      (groupId: string, childCols: ColumnDef<T>[], e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const group = columnGroups?.find((g) => g.id === groupId);
        if (!group) return;
        const currentPin = childCols[0] ? columnPins[childCols[0].key] || PIN_POSITIONS.NONE : PIN_POSITIONS.NONE;
        checklistPopupRef.current?.close();
        window.dispatchEvent(
          new CustomEvent('agv-close-all-popups', {
            detail: { except: 'context-menu', source: 'context-menu' },
          })
        );
        setActiveContextMenu({
          type: CONTEXT_MENU_TYPES.BAND,
          x: e.clientX,
          y: e.clientY,
          groupDef: group,
          childColumns: childCols,
          currentPin,
        });
      },
      [columnGroups, columnPins]
    );

    const handleCellContextMenu = useCallback(
      (rowIndex: number, row: T, colKey: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const col = colMap[colKey];
        // Vô hiệu hóa chuột phải ở cột hệ thống hoặc cột có disableContextMenu
        if (!col || col.disableContextMenu || col.dataType === DATA_TYPES.SYSTEM) return;

        checklistPopupRef.current?.close();
        window.dispatchEvent(
          new CustomEvent('agv-close-all-popups', {
            detail: { except: 'context-menu', source: 'context-menu' },
          })
        );

        // Nếu là cột rỗng, mở trực tiếp menu chuột phải cột rỗng ("Ẩn cột rỗng" & "Ẩn tất cả cột rỗng")
        if (emptyColKeys?.has(colKey) && col) {
          setActiveContextMenu({
            type: CONTEXT_MENU_TYPES.HEADER,
            x: e.clientX,
            y: e.clientY,
            column: col,
            currentPin: columnPins[colKey] || PIN_POSITIONS.NONE,
            hasHiddenColumns: hiddenColKeys.size > 0,
          });
          return;
        }

        const cellValue = col.valueGetter
          ? col.valueGetter((row as any)?._baseRecord ?? row, rowIndex)
          : getGridCellValue(row, colKey);
        setActiveContextMenu({
          type: CONTEXT_MENU_TYPES.ROW,
          x: e.clientX,
          y: e.clientY,
          rowIndex,
          row,
          column: col,
          cellValue,
        });
      },
      [colMap, emptyColKeys, columnPins, hiddenColKeys]
    );

    // Handler lọc theo giá trị của ô (Filter by cell value)
    const handleFilterByValue = useCallback(
      (colKey: string, val: any) => {
        if (!colKey) return;
        if (onColumnFilterChange) {
          onColumnFilterChange(colKey, createEqualsFilter(val));
        } else if (onQuickFilter) {
          onQuickFilter(colKey, val);
        }
      },
      [onColumnFilterChange, onQuickFilter]
    );

    // Group header context menu handler
    const handleGroupContextMenu = useCallback(
      (groupRow: any, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        checklistPopupRef.current?.close();
        window.dispatchEvent(
          new CustomEvent('agv-close-all-popups', {
            detail: { except: 'context-menu', source: 'context-menu' },
          })
        );
        setActiveContextMenu({
          type: CONTEXT_MENU_TYPES.GROUP,
          x: e.clientX,
          y: e.clientY,
          groupRow,
        });
      },
      []
    );

    // Sorting toggle handler (hỗ trợ Shift+Click ghép sắp xếp đa cấp khi bật enableMultiSort)
    const handleToggleSort = useCallback(
      (colKey: string, e?: React.MouseEvent) => {
        if (!features.enableSorting || (!onSortChange && !onSortRulesChange)) return;
        const isMulti = Boolean(e?.shiftKey) && features.enableMultiSort;
        const nextRules = toggleColumnSortRules(effectiveSortRules, colKey, {
          multi: isMulti,
          enableMultiSort: features.enableMultiSort,
        });
        if (onSortRulesChange) {
          onSortRulesChange(nextRules);
        } else {
          onSortChange?.(nextRules[0] ?? null);
        }
      },
      [features.enableSorting, features.enableMultiSort, effectiveSortRules, onSortChange, onSortRulesChange]
    );

    const handleApplyMultiSortRules = useCallback(
      (nextRules: typeof effectiveSortRules) => {
        if (!features.enableSorting) return;
        const normalized = normalizeSortRules(nextRules);
        if (onSortRulesChange) {
          onSortRulesChange(normalized);
        } else {
          onSortChange?.(normalized[0] ?? null);
        }
      },
      [features.enableSorting, onSortRulesChange, onSortChange]
    );

    const handleRemoveSortRule = useCallback(
      (colKey: string) => {
        const nextRules = effectiveSortRules.filter((r) => r.key !== colKey);
        handleApplyMultiSortRules(nextRules);
      },
      [effectiveSortRules, handleApplyMultiSortRules]
    );

    // Virtualization Geometry & Window Scroll vs Container Scroll
    const [viewportHeight, setViewportHeight] = useState<number>(600);
    const isAutoSizedRoot = features.autoHeight && !isFullscreen;
    const isWindowScroll =
      isAutoSizedRoot &&
      features.maxHeight === undefined &&
      (style?.height === undefined || style?.height === 'auto') &&
      style?.maxHeight === undefined;

    const getRowKeyForVirtual = useCallback(
      (row: T, idx: number): string | number =>
        getRowId
          ? getRowId(row, idx)
          : (row as any)?.originalIndex ?? (row as any)?.id ?? idx,
      [getRowId]
    );

    const isDynamicPcEnabled = Boolean(dynamicRowHeight && !isResponsiveMode);
    const dynamicLayoutResetKey = useMemo(() => {
      if (!isDynamicPcEnabled) return '';
      return `${activeMode}:${flatColumns
        .filter((c) => c.wrapText)
        .map((c) => `${c.key}=${colWidths[c.key] ?? c.defaultWidth}`)
        .join('|')}`;
    }, [isDynamicPcEnabled, activeMode, flatColumns, colWidths]);

    const {
      isDynamicActive: isDynamicRowHeightActive,
      totalContentHeight,
      measureVersion: dynamicHeightVersion,
      getRowTop,
      getRowHeight: getDynamicRowHeightAtIndex,
      findRowIndexAtOffset,
      getVisibleRowRange,
      observeRowSlot,
      unobserveRowSlot,
    } = useDynamicRowHeights({
      totalRows,
      baseRowHeight: actualRowHeight,
      dynamicRowHeight: isDynamicPcEnabled,
      hasDynamicDetailRows: Boolean(hasDynamicDetailRows),
      estimatedRowHeight,
      getRowHeightProp,
      getRowItem,
      getRowKey: getRowKeyForVirtual,
      overscanRows,
      isPhoneMode,
      phoneExpandedRows,
      expandedCardExtraHeight: EXPANDED_CARD_EXTRA_HEIGHT,
      dataVersion,
      layoutResetKey: dynamicLayoutResetKey,
      scrollContainerRef,
      virtualScrollTopRef,
      lastScrollTopRef,
      isWindowScroll,
    });

    const initialRowWindow = useMemo(
      () => getVisibleRowRange(0, 600),
      // Chỉ tính dải dòng khởi tạo lần đầu khi mount
      // eslint-disable-next-line react-hooks/exhaustive-deps
      []
    );
    const [rowWindow, setRowWindow] = useState<{ start: number; end: number }>(
      () => initialRowWindow
    );
    const activeRowWindowRef = useRef<{ start: number; end: number }>(initialRowWindow);

    const updateRowWindow = useCallback(
      (scrollTop: number, vHeight: number) => {
        const nextRange = getVisibleRowRange(scrollTop, vHeight);
        if (
          nextRange.start !== activeRowWindowRef.current.start ||
          nextRange.end !== activeRowWindowRef.current.end
        ) {
          activeRowWindowRef.current = nextRange;
          setRowWindow(nextRange);
        }
      },
      [getVisibleRowRange]
    );

    // Sticky Group Header (chỉ nạp gridGroupingEngine khi bật gom nhóm và có groupByColumnKey)
    const [stickyGroupRowIndex, setStickyGroupRowIndex] = useState<number | null>(null);
    const groupingEngineRef = useRef<typeof import('./gridGroupingEngine') | null>(null);
    const [isGroupingEngineReady, setIsGroupingEngineReady] = useState(false);

    useEffect(() => {
      if (!features.enableGrouping || !groupByColumnKey || groupingEngineRef.current) return;
      let active = true;
      void import('./gridGroupingEngine').then((m) => {
        groupingEngineRef.current = m;
        if (active) setIsGroupingEngineReady(true);
      });
      return () => {
        active = false;
      };
    }, [features.enableGrouping, groupByColumnKey]);

    const computeStickyGroupIdx = useCallback(
      (currentTop: number): number | null => {
        if (!features.enableGrouping || !groupByColumnKey || !groupingEngineRef.current) {
          return null;
        }
        return groupingEngineRef.current.computeStickyGroupIndexAtTop({
          currentTop,
          totalRows,
          actualRowHeight,
          getRowItem,
          getRowTop,
          findRowIndexAtOffset,
        });
      },
      [
        features.enableGrouping,
        groupByColumnKey,
        totalRows,
        actualRowHeight,
        getRowItem,
        getRowTop,
        findRowIndexAtOffset,
        isGroupingEngineReady,
      ]
    );

    const computeStickyGroupIdxRef = useRef(computeStickyGroupIdx);
    computeStickyGroupIdxRef.current = computeStickyGroupIdx;

    const isLockedForScrollRef = useRef(false);
    isLockedForScrollRef.current = Boolean(
      activeContextMenu || activeEditingCell || isPopupLockActive
    );

    // Đo kích thước viewport + theo dõi cuộn Window / Container trong 1 pass trước paint
    useLayoutEffect(() => {
      const el = scrollContainerRef.current;
      if (!el) return;

      if (isWindowScroll) {
        const syncWindowScroll = () => {
          if (isLockedForScrollRef.current || isAnyPopupActive()) return;
          el.style.setProperty('--agv-viewport-w', `${el.clientWidth || 600}px`);
          const rect = el.getBoundingClientRect();
          const vTop = Math.max(0, -rect.top);
          const vH = window.innerHeight || 600;
          virtualScrollTopRef.current = vTop;
          lastScrollTopRef.current = vTop;
          setViewportHeight((prev) => (prev === vH ? prev : vH));
          updateRowWindow(vTop, vH);
          if (features.enableGrouping && groupByColumnKey) {
            const nextSticky = computeStickyGroupIdxRef.current(vTop);
            setStickyGroupRowIndex((prev) => (prev === nextSticky ? prev : nextSticky));
          }
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
        const nextH = el.clientHeight || 600;
        virtualScrollTopRef.current = el.scrollTop || 0;
        setViewportHeight((prev) => (prev === nextH ? prev : nextH));
        updateRowWindow(virtualScrollTopRef.current, nextH);
      };
      syncContainerSize();

      const observer = new ResizeObserver(syncContainerSize);
      observer.observe(el);
      return () => observer.disconnect();
    }, [isWindowScroll, updateRowWindow, features.enableGrouping, groupByColumnKey]);

    useEffect(() => {
      updateRowWindow(virtualScrollTopRef.current, viewportHeight);
    }, [updateRowWindow, viewportHeight]);

    useEffect(() => {
      if (!features.enableGrouping || !groupByColumnKey) {
        setStickyGroupRowIndex((prev) => (prev === null ? prev : null));
        return;
      }
      const currentTop = isWindowScroll
        ? virtualScrollTopRef.current
        : (scrollContainerRef.current?.scrollTop || 0);
      const nextIdx = computeStickyGroupIdx(currentTop);
      setStickyGroupRowIndex((prev) => (prev === nextIdx ? prev : nextIdx));
    }, [features.enableGrouping, groupByColumnKey, computeStickyGroupIdx, dataVersion, isWindowScroll]);

    const stickyGroupRow = useMemo(() => {
      if (
        !features.enableGrouping ||
        !groupByColumnKey ||
        stickyGroupRowIndex === null ||
        stickyGroupRowIndex < 0 ||
        stickyGroupRowIndex >= totalRows
      ) {
        return null;
      }
      const r = getRowItem(stickyGroupRowIndex);
      return (r as any)?._isGroupRow ? r : null;
    }, [features.enableGrouping, groupByColumnKey, stickyGroupRowIndex, totalRows, getRowItem, dataVersion]);

    const scrollStopTimeoutRef = useRef<number | null>(null);
    const isScrollingAttrSetRef = useRef<boolean>(false);

    const pinnedRowsContainerRef = useRef<HTMLDivElement | null>(null);
    const [measuredPinnedHeight, setMeasuredPinnedHeight] = useState<number>(0);

    useLayoutEffect(() => {
      if (isResponsiveMode || effectivePinnedRows.length === 0) {
        setMeasuredPinnedHeight(0);
        return;
      }
      const el = pinnedRowsContainerRef.current;
      if (!el) return;
      const syncPinnedHeight = () => {
        const nextH = el.offsetHeight || effectivePinnedRows.length * actualRowHeight;
        setMeasuredPinnedHeight((prev) => (prev === nextH ? prev : nextH));
      };
      syncPinnedHeight();
      if (!isDynamicPcEnabled || typeof ResizeObserver === 'undefined') return;
      const ro = new ResizeObserver(syncPinnedHeight);
      ro.observe(el);
      return () => ro.disconnect();
    }, [
      isResponsiveMode,
      effectivePinnedRows.length,
      actualRowHeight,
      isDynamicPcEnabled,
      colWidths,
    ]);

    const effectivePinnedRowsHeight =
      !isResponsiveMode && effectivePinnedRows.length > 0
        ? measuredPinnedHeight > 0
          ? measuredPinnedHeight
          : effectivePinnedRows.length * actualRowHeight
        : 0;

    const stickyHeaderTotalHeight =
      (customHeaderHeight ?? (middleElements.some((e) => e.type === 'group') ? 64 : 34)) +
      (features.showFilterRow ? 34 : 0);

    const hasStickyGroupBanner = Boolean(
      features.enableGrouping &&
        stickyGroupRow &&
        (stickyGroupRow as any)._isGroupRow &&
        stickyGroupRowIndex !== null
    );
    const verticalTrackTopInset =
      (isResponsiveMode
        ? 44
        : stickyHeaderTotalHeight +
          effectivePinnedRowsHeight +
          (hasStickyGroupBanner ? actualRowHeight : 0)) + 2;

    const overlayHostRef = useRef<HTMLDivElement | null>(null);
    const isOverlayInteractionLockedRef = useRef(false);
    isOverlayInteractionLockedRef.current = Boolean(
      activeContextMenu || activeEditingCell || isPopupLockActive
    );

    const {
      vBarRef,
      vThumbRef,
      hBarRef,
      hThumbRef,
      notifyScroll: notifyOverlayScrollbar,
      syncScrollbars: syncOverlayScrollbars,
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
      verticalTrackTopInset,
      isLockedRef: isOverlayInteractionLockedRef,
      totalContentHeight,
      totalGridWidth,
      viewportHeight,
    });

    useEffect(() => {
      syncOverlayScrollbars();
    }, [dynamicHeightVersion, syncOverlayScrollbars]);

    useEffect(() => {
      return () => {
        if (scrollStopTimeoutRef.current !== null) {
          window.clearTimeout(scrollStopTimeoutRef.current);
          scrollStopTimeoutRef.current = null;
        }
      };
    }, []);

    const effectiveSelectedRowIndex = useMemo(() => {
      if (typeof selectedRowIndex === 'number' && selectedRowIndex >= 0) {
        return selectedRowIndex;
      }
      if (selectedRowKey === undefined || selectedRowKey === null) {
        return null;
      }
      for (let i = 0; i < totalRows; i++) {
        const r = getRowItem(i);
        if (
          r &&
          !(r as any)._isGroupRow &&
          !(r as any)._isDetailRow &&
          getRowKeyForVirtual(r, i) === selectedRowKey
        ) {
          return i;
        }
      }
      return null;
    }, [selectedRowIndex, selectedRowKey, totalRows, getRowItem, getRowKeyForVirtual]);

    const chkColKey = useMemo(
      () => flatColumns.find((c) => isSelectionColumn(c))?.key,
      [flatColumns]
    );
    const showSelectionCol = Boolean(features.enableSelection && Boolean(chkColKey));

    // Điều hướng dòng bằng bàn phím (ArrowUp / ArrowDown / PageUp / PageDown / Space)
    useGridKeyboardNav({
      scrollContainerRef,
      activeContextMenu,
      activeEditingCell,
      isAnyPopupActive,
      totalRows,
      selectedRowIndex: effectiveSelectedRowIndex,
      onSelectRow,
      onToggleCheck: showSelectionCol ? onToggleCheck : undefined,
      getRowItem,
      viewportHeight,
      actualRowHeight,
      getRowTop,
      getRowHeight: getDynamicRowHeightAtIndex,
      pinnedRowsHeight: effectivePinnedRowsHeight,
      customHeaderHeight,
      middleElements,
      showFilterRow: features.showFilterRow,
      pinnedRowsLength: effectivePinnedRows.length,
      stickyGroupRow,
      isWindowScroll,
    });

    // Scroll handler (tách bạch Window Scroll vs Container Scroll để cuộn ngang không reset virtualScrollTop)
    const handleScroll = useCallback(
      (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.currentTarget;

        // Popup & Editing Scroll Lock: Khi đang sửa hoặc có popup mở thì Grid tuyệt đối không được cuộn
        if (activeContextMenu || activeEditingCell || isPopupLockActive || isAnyPopupActive()) {
          const lockedPos = lockedScrollPosRef.current || popupLockedScrollPosRef.current;
          if (!isWindowScroll) {
            target.scrollTop = lockedPos ? lockedPos.top : lastScrollTopRef.current;
          }
          target.scrollLeft = lockedPos ? lockedPos.left : lastScrollLeftRef.current;
          return;
        }

        const currentScrollLeft = target.scrollLeft;
        if (currentScrollLeft !== lastScrollLeftRef.current) {
          lastScrollLeftRef.current = currentScrollLeft;
          if (centerPinnedColKeys.length > 0) {
            computeCenterDock(currentScrollLeft, target.clientWidth);
          }
        }

        if (!isWindowScroll) {
          const currentTop = target.scrollTop;
          lastScrollTopRef.current = currentTop;
          virtualScrollTopRef.current = currentTop;
          updateRowWindow(currentTop, viewportHeight);

          if (features.enableGrouping && groupByColumnKey) {
            const nextStickyIdx = computeStickyGroupIdx(currentTop);
            setStickyGroupRowIndex((prev) => (prev === nextStickyIdx ? prev : nextStickyIdx));
          }
        }

        notifyOverlayScrollbar();

        if (!isScrollingAttrSetRef.current) {
          isScrollingAttrSetRef.current = true;
          target.setAttribute('data-agv-scrolling', 'true');
        }
        if (scrollStopTimeoutRef.current) {
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
        activeContextMenu,
        activeEditingCell,
        isPopupLockActive,
        lockedScrollPosRef,
        popupLockedScrollPosRef,
        centerPinnedColKeys.length,
        computeCenterDock,
        isWindowScroll,
        updateRowWindow,
        viewportHeight,
        features.enableGrouping,
        groupByColumnKey,
        computeStickyGroupIdx,
        notifyOverlayScrollbar,
      ]
    );

    const hasColLevelSpan = useMemo(
      () => flatColumns.some((c) => Boolean(c.colSpan || c.rowSpan)),
      [flatColumns]
    );
    const isSpanActive = Boolean(
      !isResponsiveMode &&
        (features.enableCellSpan || hasColLevelSpan) &&
        (spanMethod || hasColLevelSpan)
    );

    const currentWindowRange = useMemo(() => {
      if (totalRows <= 0) return { start: 0, end: -1 };
      const rawTop = isWindowScroll
        ? virtualScrollTopRef.current
        : (scrollContainerRef.current?.scrollTop ?? virtualScrollTopRef.current);
      return getVisibleRowRange(rawTop, viewportHeight || 600);
    }, [
      rowWindow,
      totalRows,
      getVisibleRowRange,
      viewportHeight,
      isWindowScroll,
      dynamicHeightVersion,
    ]);

    const spanWindowPlan = useMemo<SpanWindowPlan | null>(() => {
      if (!isSpanActive || totalRows <= 0 || currentWindowRange.end < currentWindowRange.start) {
        return null;
      }
      return computeSpanWindowPlan({
        startRow: currentWindowRange.start,
        endRow: currentWindowRange.end,
        totalRows,
        baseRowHeight: actualRowHeight,
        getRowTop,
        columns: flatColumns,
        colWidths,
        columnPins,
        centerDockStatus,
        lastEffectiveLeftColKey,
        getRowItem,
        spanMethod,
        maxLookback: maxRowSpanLookback,
      });
    }, [
      isSpanActive,
      totalRows,
      currentWindowRange,
      actualRowHeight,
      getRowTop,
      flatColumns,
      colWidths,
      columnPins,
      centerDockStatus,
      lastEffectiveLeftColKey,
      getRowItem,
      spanMethod,
      maxRowSpanLookback,
      dataVersion,
    ]);

    // Danh sách dòng hiển thị theo cửa sổ trượt row-level cố định (~28–32 dòng ở cả Window Scroll lẫn Container Scroll)
    const visibleRowsList = useMemo(() => {
      if (totalRows <= 0) return [] as Array<{ rowIndex: number; row: T }>;
      const { start, end } = currentWindowRange;
      if (end < start) return [] as Array<{ rowIndex: number; row: T }>;

      const rows: Array<{ rowIndex: number; row: T }> = [];
      const added = new Set<number>();

      if (spanWindowPlan && spanWindowPlan.anchorRowsBeforeStart.length > 0) {
        const sortedAnchors = [...spanWindowPlan.anchorRowsBeforeStart].sort((a, b) => a - b);
        for (let i = 0; i < sortedAnchors.length; i++) {
          const ar = sortedAnchors[i];
          if (ar >= 0 && ar < start && !added.has(ar)) {
            added.add(ar);
            rows.push({ rowIndex: ar, row: getRowItem(ar) });
          }
        }
      }

      for (let r = start; r <= end; r++) {
        if (!added.has(r)) {
          rows.push({ rowIndex: r, row: getRowItem(r) });
        }
      }
      return rows;
    }, [totalRows, currentWindowRange, spanWindowPlan, getRowItem, dataVersion]);

    useGridCrossHover({
      enabled: features.enableCrossHover,
      highlightHeader: features.crossHoverHighlightHeader,
      isResponsiveMode,
      isPopupLockActive: Boolean(activeContextMenu || activeEditingCell || isPopupLockActive),
      scrollContainerRef,
      visibleVersion: `${currentWindowRange.start}_${currentWindowRange.end}_${dataVersion ?? 0}_${flatColumns.length}`,
    });

    // Động cơ hiệu ứng trượt dòng FLIP khi Sort (bỏ qua toàn bộ chi phí tracking khi tắt Sort hoặc đang responsive)
    useGridSortFlipAnimation({
      enabled: features.enableSorting && !isResponsiveMode,
      scrollContainerRef,
      virtualScrollTopRef,
      sortConfig,
      sortRules: effectiveSortRules,
      groupSortConfig,
      visibleRows: visibleRowsList,
      actualRowHeight,
      findRowIndexAtOffset,
      viewportHeight,
      getRowKey,
    });

    // Anchor Row Preservation khi chuyển đổi giữa PC, Tablet và Phone
    const prevActiveModeRef = useRef<string>(activeMode);
    const prevActualRowHeightRef = useRef<number>(actualRowHeight);
    const prevFindRowIndexAtOffsetRef = useRef<(y: number) => number>(findRowIndexAtOffset);

    useLayoutEffect(() => {
      const prevMode = prevActiveModeRef.current;
      const prevRowH = prevActualRowHeightRef.current;

      if (prevMode !== activeMode && prevRowH > 0 && actualRowHeight > 0) {
        const scrollEl = scrollContainerRef.current;
        const currentScrollTop = isWindowScroll
          ? virtualScrollTopRef.current
          : scrollEl
          ? scrollEl.scrollTop
          : lastScrollTopRef.current;

        const anchorRowIndex = Math.max(
          0,
          prevFindRowIndexAtOffsetRef.current
            ? prevFindRowIndexAtOffsetRef.current(currentScrollTop)
            : Math.floor(currentScrollTop / prevRowH)
        );

        if (anchorRowIndex > 0) {
          const maxScroll = Math.max(0, totalContentHeight - (viewportHeight || 600));
          const targetScrollTop = Math.min(maxScroll, getRowTop(anchorRowIndex));

          if (scrollEl && !isWindowScroll) {
            scrollEl.scrollTop = targetScrollTop;
          }
          lastScrollTopRef.current = targetScrollTop;
          virtualScrollTopRef.current = targetScrollTop;
          updateRowWindow(targetScrollTop, viewportHeight || 600);
        }
      }

      prevActiveModeRef.current = activeMode;
      prevActualRowHeightRef.current = actualRowHeight;
      prevFindRowIndexAtOffsetRef.current = findRowIndexAtOffset;
    }, [
      activeMode,
      actualRowHeight,
      isWindowScroll,
      totalContentHeight,
      viewportHeight,
      getRowTop,
      findRowIndexAtOffset,
      updateRowWindow,
    ]);

    const activeQueryRuleCount = useMemo(
      () => countActiveQueryRules(currentQueryTree),
      [currentQueryTree]
    );

    const { visibleColumnCount, totalColumnCount } = useMemo(() => {
      const dataCols = columns.filter(
        (c) => c.dataType !== DATA_TYPES.SYSTEM && !c.isRowNumber && !c.isSelection
      );
      const atomicGroups = (effectiveColumnGroups || []).filter((g) => g.isAtomic);
      const allAtomicKeys = new Set(atomicGroups.flatMap((g) => g.keys));
      const nonAtomicCols = dataCols.filter((c) => !allAtomicKeys.has(c.key));
      const nonAtomicVisible = nonAtomicCols.filter((c) => visibleColKeys.includes(c.key)).length;
      const atomicVisible = atomicGroups.filter((g) =>
        g.keys.some((k) => visibleColKeys.includes(k))
      ).length;
      return {
        totalColumnCount: nonAtomicCols.length + atomicGroups.length,
        visibleColumnCount: nonAtomicVisible + atomicVisible,
      };
    }, [columns, effectiveColumnGroups, visibleColKeys]);

    useEffect(() => {
      onToolbarStateChange?.({
        activePopup: externalPopup?.type ?? null,
        quickFilterText: currentQuickFilterText,
        isQuickFilterActive: Boolean(currentQuickFilterText.trim()),
        activeQueryRuleCount,
        visibleColumnCount,
        totalColumnCount,
        sortRuleCount: effectiveSortRules.length,
        enableQuickSearch: features.enableQuickSearch,
        enableQueryBuilder: features.enableQueryBuilder,
        enableColumnChooser: features.enableColumnChooser,
        enableMultiSort: features.enableMultiSort,
      });
    }, [
      onToolbarStateChange,
      externalPopup,
      currentQuickFilterText,
      activeQueryRuleCount,
      visibleColumnCount,
      totalColumnCount,
      effectiveSortRules.length,
      features.enableQuickSearch,
      features.enableQueryBuilder,
      features.enableColumnChooser,
      features.enableMultiSort,
    ]);

    // Imperative Ref API
    useImperativeHandle(
      ref,
      () => ({
        scrollToRow: (rowIndex: number, behavior: ScrollBehavior = 'auto') => {
          const el = scrollContainerRef.current;
          if (!el || totalRows === 0) return;
          const clamped = Math.max(0, Math.min(totalRows - 1, rowIndex));
          const targetTop = getRowTop(clamped);
          if (isWindowScroll && typeof window !== 'undefined') {
            const winTop = Math.max(
              0,
              window.scrollY + el.getBoundingClientRect().top + targetTop - stickyHeaderTotalHeight
            );
            window.scrollTo({ top: winTop, behavior });
            return;
          }
          if (behavior === 'auto') {
            el.scrollTop = targetTop;
          } else {
            el.scrollTo({ top: targetTop, behavior });
          }
        },
        scrollToChunk: (chunkIndex: number, behavior: ScrollBehavior = 'auto') => {
          const el = scrollContainerRef.current;
          if (!el || totalRows === 0) return;
          const targetRow = Math.max(0, Math.min(totalRows - 1, chunkIndex * chunkSize));
          const targetTop = getRowTop(targetRow);
          if (isWindowScroll && typeof window !== 'undefined') {
            const winTop = Math.max(
              0,
              window.scrollY + el.getBoundingClientRect().top + targetTop - stickyHeaderTotalHeight
            );
            window.scrollTo({ top: winTop, behavior });
            return;
          }
          if (behavior === 'auto') {
            el.scrollTop = targetTop;
          } else {
            el.scrollTo({ top: targetTop, behavior });
          }
        },
        getScrollContainer: () => scrollContainerRef.current,
        openPopup: openExternalPopup,
        togglePopup: toggleExternalPopup,
        closePopup: closeExternalPopup,
        expandAllTree: treeDetailActions?.expandAllTree,
        collapseAllTree: treeDetailActions?.collapseAllTree,
        expandTreeToDepth: treeDetailActions?.expandTreeToDepth,
        toggleTreeRow: treeDetailActions?.toggleTreeRow,
        toggleDetailRow: treeDetailActions?.toggleDetailRow,
        expandAllDetails: treeDetailActions?.expandAllDetails,
        collapseAllDetails: treeDetailActions?.collapseAllDetails,
      }),
      [
        totalRows,
        chunkSize,
        getRowTop,
        isWindowScroll,
        stickyHeaderTotalHeight,
        openExternalPopup,
        toggleExternalPopup,
        closeExternalPopup,
        treeDetailActions,
      ]
    );

    const layoutSnapshot = useMemo(
      () =>
        buildGridLayoutSnapshot({
          columns: flatColumns,
          colWidths,
          rowHeight: actualRowHeight,
          surfaceTheme,
          columnPins,
          leftOffsets,
          rightOffsets,
          lastEffectiveLeftColKey,
          firstEffectiveRightColKey,
          centerDockStatus,
          centerLeftOffsets,
          centerRightOffsets,
          emptyColKeys,
          dynamicRowHeight: isDynamicPcEnabled,
        }),
      [
        flatColumns,
        colWidths,
        actualRowHeight,
        surfaceTheme,
        columnPins,
        leftOffsets,
        rightOffsets,
        lastEffectiveLeftColKey,
        firstEffectiveRightColKey,
        centerDockStatus,
        centerLeftOffsets,
        centerRightOffsets,
        emptyColKeys,
        isDynamicPcEnabled,
      ]
    );

    const resolveDelegatedRow = useCallback(
      (target: EventTarget | null): { rowIndex: number; row: T } | null => {
        const targetEl = target as HTMLElement | null;
        if (targetEl?.closest?.('[data-agv-detail-row="true"]')) return null;
        const rowEl = targetEl?.closest?.('[data-agv-row="true"]') as HTMLElement | null;
        if (!rowEl) return null;
        const rawIdx = rowEl.getAttribute('data-row-idx');
        if (rawIdx === null) return null;
        const rowIndex = Number(rawIdx);
        if (!Number.isFinite(rowIndex)) return null;
        const row =
          rowIndex < 0
            ? effectivePinnedRows[-1 - rowIndex]?.row
            : rowIndex < totalRows
            ? getRowItem(rowIndex)
            : undefined;
        if (!row) return null;
        return { rowIndex, row };
      },
      [effectivePinnedRows, totalRows, getRowItem]
    );

    const handleViewportClick = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (isResponsiveMode) return;
        const resolved = resolveDelegatedRow(e.target);
        if (!resolved) return;
        const { rowIndex, row } = resolved;
        if (effectiveEditMode === GRID_EDIT_MODES.SINGLE_CLICK && effectiveStartEditCell) {
          const cellEl = (e.target as HTMLElement | null)?.closest?.('[data-col-key]') as HTMLElement | null;
          const colKey = cellEl?.getAttribute('data-col-key');
          const meta = colKey ? layoutSnapshot.colMetaByKey[colKey] : undefined;
          if (meta && !meta.isEmptyCol && meta.editable) {
            if (effectiveEditingCell?.rowIndex === rowIndex && effectiveEditingCell?.colKey === meta.key) return;
            e.stopPropagation();
            onSelectRow?.(rowIndex, row);
            effectiveStartEditCell(rowIndex, meta.key);
            return;
          }
        }
        onSelectRow?.(rowIndex, row);
      },
      [
        isResponsiveMode,
        resolveDelegatedRow,
        effectiveEditMode,
        effectiveStartEditCell,
        layoutSnapshot,
        effectiveEditingCell,
        onSelectRow,
      ]
    );

    const handleViewportDoubleClick = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (
          isResponsiveMode ||
          effectiveEditMode !== GRID_EDIT_MODES.DOUBLE_CLICK ||
          !effectiveStartEditCell
        ) {
          return;
        }
        const resolved = resolveDelegatedRow(e.target);
        if (!resolved) return;
        const { rowIndex, row } = resolved;
        const cellEl = (e.target as HTMLElement | null)?.closest?.('[data-col-key]') as HTMLElement | null;
        const colKey = cellEl?.getAttribute('data-col-key');
        const meta = colKey ? layoutSnapshot.colMetaByKey[colKey] : undefined;
        if (!meta || meta.isEmptyCol || !meta.editable) return;
        if (effectiveEditingCell?.rowIndex === rowIndex && effectiveEditingCell?.colKey === meta.key) return;
        e.stopPropagation();
        onSelectRow?.(rowIndex, row);
        effectiveStartEditCell(rowIndex, meta.key);
      },
      [
        isResponsiveMode,
        effectiveEditMode,
        effectiveStartEditCell,
        resolveDelegatedRow,
        layoutSnapshot,
        effectiveEditingCell,
        onSelectRow,
      ]
    );

    const handleViewportContextMenu = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (!features.enableContextMenu) return;
        e.preventDefault();
        if (isResponsiveMode) return;
        const resolved = resolveDelegatedRow(e.target);
        if (!resolved) return;
        const cellEl = (e.target as HTMLElement | null)?.closest?.('[data-col-key]') as HTMLElement | null;
        const colKey = cellEl?.getAttribute('data-col-key');
        const meta = colKey ? layoutSnapshot.colMetaByKey[colKey] : undefined;
        if (!meta) return;
        if (meta.isDisableContextMenu) {
          e.stopPropagation();
          return;
        }
        handleCellContextMenu(resolved.rowIndex, resolved.row, meta.key, e);
      },
      [
        features.enableContextMenu,
        isResponsiveMode,
        resolveDelegatedRow,
        layoutSnapshot,
        handleCellContextMenu,
      ]
    );

    const theme = getThemeClasses(surfaceTheme);
    const isRowNumberCol = (col: ColumnDef<any> | undefined | null) =>
      Boolean(col?.isRowNumber || col?.key === 'col_stt' || (col?.dataType === DATA_TYPES.SYSTEM && Boolean(col?.title)));
    const showRowNumber = Boolean(features.enableRowNumber && flatColumns.some(isRowNumberCol));
    const tabletTrackMinWidth =
      isTabletMode && compiledTabletGroups && compiledTabletGroups.length > 0
        ? computeTabletTrackMinWidth(compiledTabletGroups, showRowNumber, showSelectionCol)
        : 0;
    const resolvedMaxHeightStyle: React.CSSProperties =
      isAutoSizedRoot && features.maxHeight !== undefined
        ? {
            maxHeight:
              typeof features.maxHeight === 'number'
                ? `${features.maxHeight}px`
                : features.maxHeight,
          }
        : {};

    return (
      <div
        ref={containerRef}
        data-theme={surfaceTheme}
        className={`relative ${isAutoSizedRoot ? 'w-full' : 'flex-1'} flex flex-col min-h-0 overflow-hidden agv-grid-root ${isFullscreen ? 'agv-grid-fullscreen' : ''} ${getThemeClass(surfaceTheme)} ${className}`}
        style={{ ...gridColVars, ...resolvedMaxHeightStyle, ...style }}
        onMouseDownCapture={handleContainerMouseDownCapture}
        onClickCapture={handleContainerSuppressClickCapture}
        onDoubleClickCapture={handleContainerSuppressClickCapture}
        onContextMenuCapture={handleContainerContextMenuCapture}
        onContextMenu={
          features.enableContextMenu
            ? (e) => {
                // Vô hiệu hóa chuột phải mặc định của trình duyệt trong Grid khi menu ngữ cảnh được bật
                e.preventDefault();
              }
            : undefined
        }
      >
        <div
          ref={overlayHostRef}
          {...overlayHostInteractionProps}
          data-overlay-scroll-active={scrollbarAlwaysOn ? 'true' : 'false'}
          className={`agv-grid-scroll-overlay-host relative ${isAutoSizedRoot ? 'flex-initial min-h-0' : 'flex-1 min-h-0'} flex flex-col`}
        >
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          onClick={!isResponsiveMode ? handleViewportClick : undefined}
          onDoubleClick={
            !isResponsiveMode && effectiveEditMode === GRID_EDIT_MODES.DOUBLE_CLICK && effectiveStartEditCell
              ? handleViewportDoubleClick
              : undefined
          }
          data-agv-editing={effectiveEditingCell ? 'true' : undefined}
          onContextMenu={features.enableContextMenu ? handleViewportContextMenu : undefined}
          style={{
            willChange: 'scroll-position',
            WebkitOverflowScrolling: 'touch',
            backgroundColor: 'var(--agv-bg-root)',
          }}
          className={`agv-scroll-viewport agv-scroll-overlay ${isAutoSizedRoot ? 'flex-initial min-h-0' : 'flex-1'} overflow-auto relative ${theme.viewportBg}`}
        >
          {/* Header & Filter Row */}
          {isResponsiveMode ? (
            <Suspense fallback={null}>
              <LazyGridResponsiveHeader
                activeMode={isTabletMode ? 'tablet' : 'phone'}
                surfaceTheme={surfaceTheme}
                columns={flatColumns}
                compiledTabletGroups={compiledTabletGroups}
                showRowNumber={showRowNumber}
                showSelectionCol={showSelectionCol}
                totalRows={totalRows}
                onOpenSortFilter={
                  features.enableResponsiveSortFilter ? () => setIsSortFilterModalOpen(true) : undefined
                }
                hasActiveFilterOrSort={hasActiveFilterOrSort}
                sortFilterLabel={features.responsiveSortFilterLabel}
              />
            </Suspense>
          ) : (
            <>
              {/* Sticky Header (1-tier 34px or 2-tier 64px) */}
              <GridHeader
                totalGridWidth={totalGridWidth}
                leftColumns={leftColumns}
                middleElements={middleElements}
                rightColumns={rightColumns}
                colWidths={colWidths}
                columnPins={columnPins}
                leftOffsets={leftOffsets}
                rightOffsets={rightOffsets}
                centerDockStatus={centerDockStatus}
                centerLeftOffsets={centerLeftOffsets}
                centerRightOffsets={centerRightOffsets}
                lastEffectiveLeftColKey={lastEffectiveLeftColKey}
                firstEffectiveRightColKey={firstEffectiveRightColKey}
                sortConfig={sortConfig}
                sortRules={effectiveSortRules}
                surfaceTheme={surfaceTheme}
                columnFilters={columnFilters}
                activeChecklistColKey={activeChecklistColKey}
                onOpenChecklistFilter={features.enableHeaderFilter ? handleOpenChecklistFilter : undefined}
                onToggleSort={handleToggleSort}
                onColumnContextMenu={features.enableContextMenu ? handleColumnContextMenu : undefined}
                onBandContextMenu={features.enableContextMenu ? handleBandContextMenu : undefined}
                onMouseDownResize={features.enableColumnResize ? handleMouseDownResize : undefined}
                onToggleGroup={onToggleGroup}
                onReorderColumns={features.enableColumnReorder ? onReorderColumns : undefined}
                headerHeight={customHeaderHeight ?? (middleElements.some((e) => e.type === 'group') ? 64 : 34)}
                emptyColKeys={emptyColKeys}
                hasFilterRow={features.showFilterRow}
                enableSorting={features.enableSorting}
                enableColumnResize={features.enableColumnResize}
                enableContextMenu={features.enableContextMenu}
              />

              {/* Sticky Inline Filter Row */}
              {features.showFilterRow && (
                <Suspense
                  fallback={
                    <div
                      data-agv-filter-row="true"
                      style={{
                        height: '34px',
                        width: `var(--agv-total-grid-w, ${totalGridWidth}px)`,
                        minWidth: `var(--agv-total-grid-w, ${totalGridWidth}px)`,
                        backgroundColor: 'var(--agv-bg-header)',
                      }}
                      className="sticky z-25 border-b border-[var(--agv-border)] shrink-0"
                    />
                  }
                >
                  <LazyGridFilterRow
                    totalGridWidth={totalGridWidth}
                    columns={flatColumns}
                    colWidths={colWidths}
                    columnPins={columnPins}
                    leftOffsets={leftOffsets}
                    rightOffsets={rightOffsets}
                    centerDockStatus={centerDockStatus}
                    centerLeftOffsets={centerLeftOffsets}
                    centerRightOffsets={centerRightOffsets}
                    lastEffectiveLeftColKey={lastEffectiveLeftColKey}
                    firstEffectiveRightColKey={firstEffectiveRightColKey}
                    surfaceTheme={surfaceTheme}
                    columnFilters={columnFilters}
                    onColumnFilterChange={onColumnFilterChange}
                    onClearAllColumnFilters={onClearAllColumnFilters}
                    onClearAllCriteria={onClearAllCriteria}
                    activeFilterCount={activeColumnFilterCount}
                    hasColumnEmptyCells={effectiveHasColumnEmptyCells}
                    getColumnDateBounds={effectiveGetColumnDateBounds}
                    headerTopOffset={customHeaderHeight ?? (middleElements.some((e) => e.type === 'group') ? 64 : 34)}
                    columnSums={showSummaryRow ? columnSums : undefined}
                    hasCheckedRows={Boolean(checkedRowIndices && checkedRowIndices.size > 0)}
                    emptyColKeys={emptyColKeys}
                    groupByColumnKey={features.enableGrouping ? groupByColumnKey : null}
                    quickFilterText={controlledQuickFilterText}
                    sortConfig={sortConfig}
                    sortRules={effectiveSortRules}
                    groupSortConfig={groupSortConfig}
                    appliedQueryTree={controlledAppliedQueryTree}
                    pinnedRows={effectivePinnedRows}
                    onUngroup={features.enableGrouping ? onUngroup : undefined}
                    onSortChange={features.enableSorting ? (s) => {
                      if (onSortRulesChange) {
                        onSortRulesChange(s ? [s] : []);
                      } else {
                        onSortChange?.(s);
                      }
                    } : undefined}
                    onRemoveSortRule={features.enableSorting ? handleRemoveSortRule : undefined}
                    onToggleGroupSort={features.enableGrouping && features.enableSorting ? onToggleGroupSort : undefined}
                    onQuickFilterTextChange={controlledOnQuickFilterTextChange}
                    onApplyQueryTree={controlledOnApplyQueryTree}
                    onUnpinRow={handleUnpinRow}
                    onClearPinnedRows={handleClearPinnedRows}
                  />
                </Suspense>
              )}
            </>
          )}

          {/* Sticky Pinned Rows (Ghim dòng cố định trên đầu bảng trên PC) */}
          {!isResponsiveMode && effectivePinnedRows.length > 0 && (
            <div
              ref={pinnedRowsContainerRef}
              data-agv-fullwidth="true"
              data-agv-pinned-rows="true"
              style={{
                position: 'sticky',
                top: `${stickyHeaderTotalHeight}px`,
                width: `var(--agv-total-grid-w, ${totalGridWidth}px)`,
                minWidth: `var(--agv-total-grid-w, ${totalGridWidth}px)`,
                zIndex: 19,
                backgroundColor: 'var(--agv-row-sticky-surface, var(--agv-bg-header))',
              }}
              className="border-b-2 border-b-[var(--agv-border-strong)] select-none"
            >
              {effectivePinnedRows.map((p, pinIdx) => {
                const rowKey = p.rowKey;
                const isSelected =
                  selectedRowKey !== undefined && selectedRowKey !== null
                    ? selectedRowKey === rowKey ||
                      (selectedRowIndex !== null && selectedRowIndex === p.rowIndex)
                    : selectedRowIndex !== null && selectedRowIndex === p.rowIndex;

                const chkCol = flatColumns.find(
                  (c) => c.isSelection || (c.dataType === DATA_TYPES.SYSTEM && !c.title)
                );
                const chkColKey = chkCol?.key;
                const isChecked = checkedRowIndices
                  ? checkedRowIndices.has(rowKey as any) ||
                    ((p.row as any)?.originalIndex !== undefined &&
                      checkedRowIndices.has((p.row as any).originalIndex))
                  : (Boolean(chkColKey) && (p.row as any)?.[chkColKey!] === true) ||
                    (p.row as any)?.isChecked === true;

                const effectiveRow =
                  chkColKey && checkedRowIndices
                    ? ({ ...(p.row as any), [chkColKey]: isChecked } as T)
                    : p.row;

                return (
                  <GridRow
                    key={`pinned_${rowKey}`}
                    row={effectiveRow}
                    rowIndex={-1 - pinIdx}
                    columns={flatColumns}
                    colWidths={colWidths}
                    rowHeight={actualRowHeight}
                    isSelected={Boolean(isSelected)}
                    isChecked={Boolean(isChecked)}
                    onSelectRow={onSelectRow}
                    onToggleCheck={onToggleCheck}
                    surfaceTheme={surfaceTheme}
                    columnPins={columnPins}
                    leftOffsets={leftOffsets}
                    rightOffsets={rightOffsets}
                    lastEffectiveLeftColKey={lastEffectiveLeftColKey}
                    firstEffectiveRightColKey={firstEffectiveRightColKey}
                    centerDockStatus={centerDockStatus}
                    centerLeftOffsets={centerLeftOffsets}
                    centerRightOffsets={centerRightOffsets}
                    renderCell={renderCell}
                    onCellContextMenu={features.enableContextMenu ? handleCellContextMenu : undefined}
                    onGroupContextMenu={features.enableContextMenu ? handleGroupContextMenu : undefined}
                    editMode={effectiveEditMode}
                    editingCell={effectiveEditingCell}
                    onStartEditCell={effectiveStartEditCell}
                    onEndEditCell={handleEndEditCell}
                    onCellChange={handleInternalCellChange}
                    getColumnDateBounds={getColumnDateBounds}
                    emptyColKeys={emptyColKeys}
                    layoutSnapshot={layoutSnapshot}
                    delegatedEvents={!isResponsiveMode}
                  />
                );
              })}
            </div>
          )}

          {/* Sticky Group Header (Dính tiêu đề nhóm trên đỉnh khi cuộn dọc) */}
          {features.enableGrouping && stickyGroupRow && (stickyGroupRow as any)._isGroupRow && stickyGroupRowIndex !== null && (
            <div
              data-agv-fullwidth="true"
              data-agv-sticky-group="true"
              style={{
                position: 'sticky',
                top: `${stickyHeaderTotalHeight + effectivePinnedRowsHeight}px`,
                width: `var(--agv-total-grid-w, ${totalGridWidth}px)`,
                minWidth: `var(--agv-total-grid-w, ${totalGridWidth}px)`,
                height: 0,
                overflow: 'visible',
                zIndex: 18,
              }}
              className="select-none"
            >
              <GridRow
                key={`sticky_group_${(stickyGroupRow as any).path || stickyGroupRowIndex}`}
                row={stickyGroupRow}
                rowIndex={stickyGroupRowIndex}
                columns={flatColumns}
                colWidths={colWidths}
                rowHeight={actualRowHeight}
                isSelected={false}
                isChecked={false}
                onSelectRow={onSelectRow}
                onToggleCheck={onToggleCheck}
                surfaceTheme={surfaceTheme}
                columnPins={columnPins}
                leftOffsets={leftOffsets}
                rightOffsets={rightOffsets}
                lastEffectiveLeftColKey={lastEffectiveLeftColKey}
                firstEffectiveRightColKey={firstEffectiveRightColKey}
                centerDockStatus={centerDockStatus}
                centerLeftOffsets={centerLeftOffsets}
                centerRightOffsets={centerRightOffsets}
                renderCell={renderCell}
                onCellContextMenu={features.enableContextMenu ? handleCellContextMenu : undefined}
                onGroupContextMenu={features.enableContextMenu ? handleGroupContextMenu : undefined}
                editMode={effectiveEditMode}
                editingCell={effectiveEditingCell}
                onStartEditCell={effectiveStartEditCell}
                onEndEditCell={handleEndEditCell}
                onCellChange={handleInternalCellChange}
                getColumnDateBounds={getColumnDateBounds}
                emptyColKeys={emptyColKeys}
                layoutSnapshot={layoutSnapshot}
                delegatedEvents={!isResponsiveMode}
              />
            </div>
          )}

          {/* Virtualized Rows Canvas */}
          <div
            className="agv-rows-canvas"
            data-agv-fullwidth={isResponsiveMode ? undefined : "true"}
            style={{
              height: `${totalContentHeight}px`,
              width: isResponsiveMode ? '100%' : `var(--agv-total-grid-w, ${totalGridWidth}px)`,
              minWidth:
                isTabletMode && tabletTrackMinWidth > 0
                  ? `${tabletTrackMinWidth}px`
                  : isResponsiveMode
                    ? '100%'
                    : `var(--agv-total-grid-w, ${totalGridWidth}px)`,
              position: 'relative',
              isolation: 'isolate',
              zIndex: 1,
            }}
          >
            {visibleRowsList.map(({ rowIndex, row }) => {
              const rowKey = getRowKeyForVirtual(row, rowIndex);
              const isSelected =
                selectedRowKey !== undefined && selectedRowKey !== null
                  ? selectedRowKey === rowKey ||
                    (selectedRowIndex !== undefined &&
                      selectedRowIndex !== null &&
                      selectedRowIndex === rowIndex)
                  : selectedRowIndex !== undefined &&
                    selectedRowIndex !== null &&
                    selectedRowIndex === rowIndex;
              const isChecked = checkedRowIndices
                ? checkedRowIndices.has(rowKey as any) ||
                  ((row as any)?.originalIndex !== undefined &&
                    checkedRowIndices.has((row as any).originalIndex))
                : (Boolean(chkColKey) && (row as any)?.cells?.get?.(chkColKey!)?.value === true) ||
                  (Boolean(chkColKey) && (row as any)?.[chkColKey!] === true) ||
                  (row as any)?.isChecked === true;
              const isCardExpanded = isPhoneMode ? Boolean(phoneExpandedRows.has(rowKey)) : false;
              const rowTop = getRowTop(rowIndex);
              const slotHeight = getDynamicRowHeightAtIndex(rowIndex);
              const rowEditingCell =
                effectiveEditingCell && effectiveEditingCell.rowIndex === rowIndex
                  ? effectiveEditingCell
                  : null;
              const isSyntheticNonDataRow = Boolean(
                (row as any)?._isDetailRow || (row as any)?._isGroupRow
              );
              const shouldObserveRowSlots = Boolean(
                (isDynamicRowHeightActive && !getRowHeightProp) || hasDynamicDetailRows
              );

              return (
                <GridVirtualRowSlot
                  key={rowKey}
                  row={row}
                  rowIndex={rowIndex}
                  rowKey={rowKey}
                  rowTop={rowTop}
                  rowHeight={actualRowHeight}
                  slotHeight={slotHeight}
                  dynamicRowHeight={isDynamicRowHeightActive}
                  columns={flatColumns}
                  colWidths={colWidths}
                  layoutSnapshot={layoutSnapshot}
                  totalGridWidth={totalGridWidth}
                  isSelected={isSelected}
                  isChecked={isChecked}
                  isCardExpanded={isCardExpanded}
                  showRowNumber={showRowNumber}
                  showSelectionCol={showSelectionCol}
                  onToggleExpandPhoneCard={handleToggleExpandPhoneCard}
                  onSelectRow={onSelectRow}
                  onRowDetail={onRowDetail}
                  onToggleCheck={onToggleCheck}
                  onCellContextMenu={
                    features.enableContextMenu ? handleCellContextMenu : undefined
                  }
                  onGroupContextMenu={
                    features.enableContextMenu ? handleGroupContextMenu : undefined
                  }
                  antiGhostMode={antiGhostMode}
                  surfaceTheme={surfaceTheme}
                  columnPins={columnPins}
                  leftOffsets={leftOffsets}
                  rightOffsets={rightOffsets}
                  lastEffectiveLeftColKey={lastEffectiveLeftColKey}
                  firstEffectiveRightColKey={firstEffectiveRightColKey}
                  centerDockStatus={centerDockStatus}
                  centerLeftOffsets={centerLeftOffsets}
                  centerRightOffsets={centerRightOffsets}
                  renderCell={renderCell}
                  editMode={effectiveEditMode}
                  rowEditingCell={rowEditingCell}
                  onStartEditCell={effectiveStartEditCell}
                  onEndEditCell={handleEndEditCell}
                  onCellChange={handleInternalCellChange}
                  getColumnDateBounds={getColumnDateBounds}
                  emptyColKeys={emptyColKeys}
                  activeMode={activeMode}
                  tabletTrackMinWidth={tabletTrackMinWidth}
                  compiledTabletGroups={compiledTabletGroups}
                  compiledPhoneCard={compiledPhoneCard}
                  delegatedEvents={!isResponsiveMode}
                  observeRowSlot={shouldObserveRowSlots ? observeRowSlot : undefined}
                  unobserveRowSlot={shouldObserveRowSlots ? unobserveRowSlot : undefined}
                  rowSpanPlan={spanWindowPlan?.rowPlans.get(rowIndex)}
                  treeColumnKey={features.enableTreeData ? treeColumnKey : undefined}
                  treeIndentSize={treeIndentSize}
                  onToggleTreeExpand={features.enableTreeData ? onToggleTreeExpand : undefined}
                  detailExpandColKey={features.enableRowDetail ? detailExpandColKey : undefined}
                  isDetailExpanded={
                    features.enableRowDetail && !isSyntheticNonDataRow
                      ? Boolean(isRowDetailExpanded?.(rowKey))
                      : false
                  }
                  canExpandDetail={
                    features.enableRowDetail && !isSyntheticNonDataRow
                      ? canExpandRowDetail
                        ? canExpandRowDetail(row, rowIndex)
                        : true
                      : false
                  }
                  onToggleRowDetail={features.enableRowDetail ? onToggleRowDetail : undefined}
                  renderDetailRow={renderDetailRow}
                />
              );
            })}
          </div>

          {(loading || refreshing) && totalRows > 0 ? (
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

          {!loading && error && totalRows > 0 ? (
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

          {totalRows === 0 ? (
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
                <>
                  <span className="text-xs font-medium" style={{ color: 'var(--agv-text-muted)' }}>
                    {emptyText || 'Không có dữ liệu phù hợp'}
                  </span>
                  {(activeColumnFilterCount > 0 ||
                    Boolean(currentQuickFilterText && currentQuickFilterText.trim().length > 0) ||
                    hasActiveQueryRules(currentQueryTree)) &&
                  (onClearAllCriteria || onClearAllColumnFilters) ? (
                    <AdvButton
                      variant="destructive"
                      size="sm"
                      onClick={onClearAllCriteria || onClearAllColumnFilters}
                    >
                      Xóa bộ lọc
                    </AdvButton>
                  ) : null}
                </>
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

        {showStatusBar && statusBar ? statusBar : null}

        {/* Popup Interaction Shield: Chặn mọi thao tác chuột, hover, resize, drag, chọn dòng trên Grid khi đang mở Popup */}
        {isPopupLockActive && !effectiveEditingCell && (
          <div
            aria-hidden="true"
            className="agv-grid-popup-shield absolute inset-0 bg-transparent pointer-events-auto select-none"
            style={{ zIndex: isToolbarPopupOpen ? 1150 : 1220 }}
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
        )}

        {/* Universal Context Menu (Header / Band / Row) */}
        {features.enableContextMenu && activeContextMenu && (
          <Suspense fallback={null}>
            <LazyColumnContextMenu
              menu={activeContextMenu}
              surfaceTheme={surfaceTheme}
              columns={columns}
              columnGroups={effectiveColumnGroups}
              onClose={() => setActiveContextMenu(null)}
              enableColumnPinning={features.enableColumnPinning}
              enableCenterDock={features.enableCenterDock}
              onSetPin={
                features.enableColumnPinning || features.enableCenterDock
                  ? handleSetPin
                  : undefined
              }
              onAutoFitColumn={features.enableColumnResize ? handleAutoFitColumn : undefined}
              onAutoFitAllColumns={features.enableColumnResize ? handleAutoFitAllColumns : undefined}
              onHideColumn={features.enableColumnHide ? handleHideColumn : undefined}
              onShowAllHiddenColumns={features.enableColumnHide ? handleShowAllHiddenColumns : undefined}
              onSetBandPin={
                features.enableColumnPinning || features.enableCenterDock
                  ? handleSetBandPin
                  : undefined
              }
              onAutoFitBandColumns={features.enableColumnResize ? handleAutoFitBandColumns : undefined}
              onHideBand={features.enableColumnHide ? handleHideBand : undefined}
              onFilterByValue={features.enableFiltering ? handleFilterByValue : undefined}
              onScrollToTop={handleScrollToTop}
              onScrollToBottom={handleScrollToBottom}
              isRowPinned={
                features.enableRowPinning &&
                activeContextMenu.type === CONTEXT_MENU_TYPES.ROW &&
                activeContextMenu.row
                  ? pinnedRowKeysSet.has(getRowKey(activeContextMenu.row, activeContextMenu.rowIndex))
                  : false
              }
              pinnedRowCount={features.enableRowPinning ? effectivePinnedRows.length : 0}
              onTogglePinRow={features.enableRowPinning ? handleTogglePinContextMenuRow : undefined}
              onClearPinnedRows={features.enableRowPinning ? handleClearPinnedRows : undefined}
              checkedRowCount={features.enableSelection && checkedRowIndices ? checkedRowIndices.size : 0}
              onClearCheckedRows={features.enableSelection ? onClearCheckedRows : undefined}
              groupByColumnKey={features.enableGrouping ? groupByColumnKey : null}
              onToggleGroupByColumn={features.enableGrouping ? onToggleGroupByColumn : undefined}
              onCollapseAllGroups={features.enableGrouping ? onCollapseAllGroups : undefined}
              onExpandAllGroups={features.enableGrouping ? onExpandAllGroups : undefined}
              onUngroup={features.enableGrouping ? onUngroup : undefined}
              onCopyGroupTable={features.enableGrouping ? onCopyGroupTable : undefined}
              formulaMode={formulaMode}
              onSelectFormulaMode={onFormulaModeChange}
              emptyColKeys={emptyColKeys}
              onHideAllEmptyColumns={features.enableColumnHide ? handleHideAllEmptyColumns : undefined}
              groupSortConfig={groupSortConfig}
              onToggleGroupSort={features.enableGrouping && features.enableSorting ? onToggleGroupSort : undefined}
              sortConfig={sortConfig}
              onSortChange={features.enableSorting ? onSortChange : undefined}
            />
          </Suspense>
        )}

        {/* Portal: Checklist Filter Popup (chỉ mount khi bấm phễu lần đầu) */}
        {features.enableHeaderFilter && isChecklistMounted && (
          <Suspense fallback={null}>
            <LazyAdvChecklistFilterPopup
              ref={handleChecklistPopupRef}
              data={data}
              getRowItem={getRowItem}
              totalRowCount={totalRows}
              getCellValue={effectiveGetCellValue}
              getDistinctValues={getDistinctValues}
              columnDataTypes={columnDataTypes}
              distinctValuesCacheRef={distinctValuesCacheRef}
              surfaceTheme={surfaceTheme}
              formatChecklistDisplay={formatChecklistDisplay}
              matchFilterValue={effectiveMatchFilterValue}
              onApply={handleApplyChecklistFilter}
              onClear={handleClearChecklistFilter}
              onActiveColChange={setActiveChecklistColKey}
            />
          </Suspense>
        )}

        {/* Responsive Sort & Filter Modal cho Tablet & Phone */}
        {features.enableResponsiveSortFilter && isResponsiveMode && (
          <Suspense fallback={null}>
            <LazyResponsiveSortFilterModal
              isOpen={isSortFilterModalOpen}
              onClose={() => setIsSortFilterModalOpen(false)}
              columns={flatColumns}
              totalRows={totalRows}
              sortConfig={sortConfig}
              onSortChange={onSortChange}
              searchQuery={currentQuickFilterText}
              onSearchQueryChange={handleQuickFilterChange}
              columnFilters={columnFilters}
              onColumnFilterChange={onColumnFilterChange}
              onClearAllColumnFilters={onClearAllColumnFilters}
              hasColumnEmptyCells={effectiveHasColumnEmptyCells}
              getColumnDateBounds={effectiveGetColumnDateBounds}
              surfaceTheme={surfaceTheme}
              enableSorting={features.enableSorting}
              enableFiltering={features.enableFiltering}
              enableQuickSearch={features.enableQuickSearch}
            />
          </Suspense>
        )}

        {/* External Anchored Popover Host (called via imperative openPopup / togglePopup API) */}
        {externalPopup && (
          <Suspense fallback={null}>
            <LazyGridExternalPopupHost
              popup={externalPopup}
              onClose={closeExternalPopup}
              gridId={gridId}
              surfaceTheme={surfaceTheme}
              quickFilterText={currentQuickFilterText}
              onQuickFilterChange={handleQuickFilterChange}
              isQuickFilterSmart={isQuickFilterSmart}
              onToggleQuickFilterSmart={handleToggleQuickFilterSmart}
              appliedQueryTree={currentQueryTree}
              onApplyQueryTree={handleApplyQueryTree}
              totalRowCount={totalRows}
              data={data}
              getCellValue={effectiveGetCellValue}
              hasColumnEmptyCells={effectiveHasColumnEmptyCells}
              getColumnDateBounds={effectiveGetColumnDateBounds}
              columns={columns}
              columnGroups={effectiveColumnGroups}
              visibleColKeys={visibleColKeys}
              onVisibleColKeysChange={handleVisibleColKeysChange}
              columnPins={columnPins}
              onColumnPinChange={features.enableColumnPinning ? handleSetPin : undefined}
              onResetColumns={handleResetColumns}
              onAutoFitColumn={features.enableColumnResize ? handleAutoFitColumn : undefined}
              onReorderColumns={features.enableColumnReorder ? onReorderColumns : undefined}
              enableColumnHide={features.enableColumnHide}
              sortRules={effectiveSortRules}
              onApplySortRules={handleApplyMultiSortRules}
            />
          </Suspense>
        )}
      </div>
    );
  }
);

VirtualizedGridComponent.displayName = 'VirtualizedGrid';

export const VirtualizedGrid = React.memo(VirtualizedGridComponent) as unknown as <T = any>(
  props: VirtualizedGridProps<T> & { ref?: React.Ref<VirtualizedGridRef> }
) => React.ReactElement | null;
