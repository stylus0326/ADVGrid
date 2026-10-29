import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from 'react';
import {
  VirtualizedGridProps,
  VirtualizedGridRef,
  ColumnDef,
  BaseGroupDef,
  PinPosition,
  PIN_POSITIONS,
  DATA_TYPES,
  SORT_DIRECTIONS,
  FILTER_MODES,
  CenterDockStatus,
  CENTER_DOCK_STATUSES,
  GridScrollMetrics,
  GRID_EDIT_MODES,
  SURFACE_THEMES,
} from './types';
import {
  DEFAULT_CHUNK_SIZE,
  DEFAULT_ROW_HEIGHT,
  getThemeClasses,
} from './constants';
import { getThemeClass } from '../../themes';
import { GridHeader } from './GridHeader';
import { GridFilterRow } from './GridFilterRow';
import { GridChunkBlock } from './GridChunkBlock';
import { GridRow } from './GridRow';
import { ColumnContextMenu, ContextMenuData, CONTEXT_MENU_TYPES } from './ColumnContextMenu';
import {
  calcColAutoFitWidth,
  getSttColWidth,
  matchFilterValue as defaultMatchFilterValue,
  getColumnDateBoundsFromGetter,
  getGridCellValue,
  createColumnFilter,
  createEqualsFilter,
  isNoInputFilterOp,
  isSelectionColumn,
} from './gridUtils';
import {
  AdvChecklistFilterPopup,
  AdvChecklistFilterPopupRef,
} from './AdvChecklistFilterPopup';
import { getDefaultFilterOpForColumn } from './FilterIcons';
import { GridFloatingToolbar } from './GridFloatingToolbar';
import { GridSettingsState, QueryGroup, DENSITY_MODES } from './floating/types';
import { useColumnResize, useColumnAutoFit, useInCellEditor } from './hooks';

const POPUP_SELECTORS = [
  '.agv-calendar-popover',
  '.agv-preset-dropdown-menu',
  '.agv-portal-dropdown',
  '.agv-comboboxedit-dropdown',
  '.agv-searchlookupedit-dropdown',
  '.agv-lookup-op-menu',
  '.agv-context-menu',
  '.agv-modal-portal',
  '.agv-filter-dropdown-menu',
  '.agv-settings-popup',
  '.agv-column-chooser',
  '.agv-query-builder-modal',
  '[data-agv-popup="true"]',
].join(', ');

let cachedPopupActive = false;
let lastPopupCheckTime = 0;

function isAnyPopupActive(force: boolean = false): boolean {
  if (typeof document === 'undefined') return false;
  const now = performance.now();
  if (!force && now - lastPopupCheckTime < 64) {
    return cachedPopupActive;
  }
  lastPopupCheckTime = now;
  cachedPopupActive = Boolean(document.querySelector(POPUP_SELECTORS));
  return cachedPopupActive;
}

const VirtualizedGridComponent = forwardRef<VirtualizedGridRef, VirtualizedGridProps>(
  <T extends any>(
    {
      data,
      rowCount: customRowCount,
      getRow,
      getRowId,
      columns,
      columnGroups,
      columnPins: controlledPins,
      defaultColumnPins,
      onColumnPinsChange,
      colWidths: controlledWidths,
      defaultColWidths,
      onColWidthsChange,
      sortConfig,
      onSortChange,
      selectedRowIndex,
      selectedRowKey,
      onSelectRow,
      checkedRowIndices,
      onToggleCheck,
      onClearCheckedRows,
      renderCell,
      chunkSize = DEFAULT_CHUNK_SIZE,
      rowHeight = DEFAULT_ROW_HEIGHT,
      overscanChunks = 3,
      antiGhostMode = true,
      surfaceTheme = SURFACE_THEMES.LIGHT,
      rowSnapMode = true,
      rowsPerWheelStep = 3,
      autoScrolling = false,
      autoScrollSpeed = 32,
      onScrollMetrics,
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
      showFilterRow = true,
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
      enableFloatingToolbar = true,
      quickFilterText: controlledQuickFilterText,
      onQuickFilterTextChange: controlledOnQuickFilterTextChange,
      appliedQueryTree: controlledAppliedQueryTree,
      onApplyQueryTree: controlledOnApplyQueryTree,
      onExportExcel: controlledOnExportExcel,
      isExporting: controlledIsExporting = false,
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
      onExportGroupExcel,
      groupSortConfig,
      onToggleGroupSort,
      matchFilterValue,
      dataVersion = 0,
    }: VirtualizedGridProps<T>,
    ref: React.Ref<VirtualizedGridRef>
  ) => {
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

    // Bộ lọc dữ liệu mặc định O(1) nếu không truyền từ bên ngoài
    const effectiveMatchFilterValue = matchFilterValue || defaultMatchFilterValue;

    // Tự động phát hiện cột có ô trống nếu không truyền hàm riêng
    const defaultHasColumnEmptyCells = useCallback(
      (colKey: string) => {
        const sample = Math.min(totalRows, 300);
        for (let i = 0; i < sample; i++) {
          const val = effectiveGetCellValue(i, colKey);
          if (val === null || val === undefined || String(val).trim() === '') return true;
        }
        return false;
      },
      [totalRows, effectiveGetCellValue]
    );

    // Tự động tìm giới hạn ngày nếu không truyền hàm riêng
    const defaultGetColumnDateBounds = useCallback(
      (colKey: string) => {
        return getColumnDateBoundsFromGetter(effectiveGetCellValue, totalRows, colKey);
      },
      [effectiveGetCellValue, totalRows]
    );

    const effectiveHasColumnEmptyCells = hasColumnEmptyCells || defaultHasColumnEmptyCells;
    const effectiveGetColumnDateBounds = getColumnDateBounds || defaultGetColumnDateBounds;

    // Column widths state (controlled or uncontrolled)
    const [internalWidths, setInternalWidths] = useState<Record<string, number>>(() => {
      const initial: Record<string, number> = {};
      columns.forEach((c) => {
        initial[c.key] = defaultColWidths?.[c.key] ?? c.defaultWidth;
      });
      return initial;
    });

    const scrollContainerRef = useRef<HTMLDivElement | null>(null);

    // In-Cell Editing Hook (quản lý trạng thái sửa ô, In-Cell scroll lock & global event lock)
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

    const rawColWidths = controlledWidths ?? internalWidths;

    const autoSttWidth = useMemo(
      () => getSttColWidth(totalRows),
      [totalRows]
    );

    // Column Map
    const colMap = useMemo(() => {
      const map: Record<string, ColumnDef<T>> = {};
      columns.forEach((col) => {
        map[col.key] = col;
      });
      return map;
    }, [columns]);

    const colWidths = useMemo<Record<string, number>>(() => {
      const res: Record<string, number> = { ...(rawColWidths || {}) };
      for (const col of columns) {
        if (col.dataType === DATA_TYPES.SYSTEM || col.isRowNumber || isSelectionColumn(col)) {
          if (col.isRowNumber || col.title) {
            res[col.key] = res[col.key] || autoSttWidth || col.defaultWidth || 46;
          } else {
            res[col.key] = res[col.key] || col.defaultWidth || 32;
          }
        }
      }
      return res;
    }, [rawColWidths, autoSttWidth, columns]);

    const colWidthsRef = useRef(colWidths);
    colWidthsRef.current = colWidths;

    const setColWidth = useCallback(
      (key: string, width: number) => {
        const targetCol = colMap[key];
        if (!targetCol || targetCol.resizable === false || targetCol.dataType === DATA_TYPES.SYSTEM || targetCol.isRowNumber || isSelectionColumn(targetCol)) return;
        if (onColWidthsChange) {
          onColWidthsChange({ ...colWidthsRef.current, [key]: width });
        } else {
          setInternalWidths((prev) => ({ ...prev, [key]: width }));
        }
      },
      [onColWidthsChange, colMap]
    );

    const setMultipleColWidths = useCallback(
      (updates: Record<string, number>) => {
        if (!updates || Object.keys(updates).length === 0) return;
        const filteredUpdates: Record<string, number> = {};
        for (const [k, v] of Object.entries(updates)) {
          const targetCol = colMap[k];
          if (targetCol && targetCol.resizable !== false && targetCol.dataType !== DATA_TYPES.SYSTEM && !targetCol.isRowNumber && !isSelectionColumn(targetCol)) {
            filteredUpdates[k] = v;
          }
        }
        if (Object.keys(filteredUpdates).length === 0) return;
        if (onColWidthsChange) {
          onColWidthsChange({ ...colWidthsRef.current, ...filteredUpdates });
        } else {
          setInternalWidths((prev) => ({ ...prev, ...filteredUpdates }));
        }
      },
      [onColWidthsChange, colMap]
    );

    // Column pins state (controlled or uncontrolled)
    const [internalPins, setInternalPins] = useState<Record<string, PinPosition>>(
      () => defaultColumnPins ?? {}
    );

    const columnPins = controlledPins ?? internalPins;

    const setColumnPin = useCallback(
      (colKey: string, pin: PinPosition) => {
        const currentPin = columnPins[colKey] || PIN_POSITIONS.NONE;
        const nextPin = currentPin === pin ? PIN_POSITIONS.NONE : pin;
        const next = { ...columnPins, [colKey]: nextPin };
        if (onColumnPinsChange) onColumnPinsChange(next);
        else setInternalPins(next);
      },
      [columnPins, onColumnPinsChange]
    );

    const containerRef = useRef<HTMLDivElement | null>(null);

    // Floating Toolbar internal states
    const [internalQuickFilterText, setInternalQuickFilterText] = useState('');
    const [isQuickFilterSmart, setIsQuickFilterSmart] = useState(true);
    const [internalQueryTree, setInternalQueryTree] = useState<QueryGroup | null>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

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
      if (enableFloatingToolbar) return; // Khi enableFloatingToolbar = true, toolbar đã xử lý
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
    }, [enableFloatingToolbar, toggleFullscreen, isFullscreen]);

    const [gridSettings, setGridSettings] = useState<GridSettingsState>(() => ({
      quickSearchEnabled: true,
      pinnedShadowEnabled: true,
      showVerticalGridlines: true,
      showRowNumber: true,
      showSelectionCol: true,
      densityMode: DENSITY_MODES.STANDARD,
      showSummaryRow: true,
      showPagerBar: true,
    }));

    const actualRowHeight = gridSettings.densityMode === DENSITY_MODES.COMPACT ? 28 : rowHeight;

    // Hidden columns state (controlled or uncontrolled)
    const [internalHiddenColKeys, setInternalHiddenColKeys] = useState<Set<string>>(
      () => defaultHiddenColKeys ?? new Set()
    );
    const hiddenColKeys = controlledHiddenColKeys ?? internalHiddenColKeys;
    const setHiddenColKeys = useCallback(
      (next: Set<string> | ((prev: Set<string>) => Set<string>)) => {
        const resolved = typeof next === 'function' ? next(hiddenColKeys) : next;
        if (onHiddenColKeysChange) onHiddenColKeysChange(resolved);
        else setInternalHiddenColKeys(resolved);
      },
      [hiddenColKeys, onHiddenColKeysChange]
    );

    const effectiveColumns = useMemo(
      () => columns.filter((c) => !hiddenColKeys.has(c.key)),
      [columns, hiddenColKeys]
    );

    // Column Data Types Map
    const columnDataTypes = useMemo(() => {
      const map: Record<string, string> = {};
      columns.forEach((col) => {
        map[col.key] = col.dataType || DATA_TYPES.TEXT;
      });
      return map;
    }, [columns]);

    // Active column keys in order (reflecting hidden columns & settings for STT / Checkbox)
    const activeColKeys = useMemo(() => {
      const isAllowed = (k: string) => {
        const col = colMap[k];
        if (!gridSettings.showRowNumber && (col?.isRowNumber || (col?.dataType === DATA_TYPES.SYSTEM && Boolean(col?.title)))) return false;
        if (!gridSettings.showSelectionCol && isSelectionColumn(col)) return false;
        return true;
      };

      if (columnGroups && columnGroups.length > 0) {
        const keys: string[] = [];
        columnGroups.forEach((grp) => {
          grp.keys.forEach((k) => {
            if (colMap[k] && !hiddenColKeys.has(k) && isAllowed(k)) keys.push(k);
          });
        });
        return keys;
      }
      return effectiveColumns.filter((c) => isAllowed(c.key)).map((c) => c.key);
    }, [columnGroups, colMap, effectiveColumns, hiddenColKeys, gridSettings.showRowNumber, gridSettings.showSelectionCol]);

    const visibleColKeys = useMemo(
      () => columns.filter((c) => !hiddenColKeys.has(c.key)).map((c) => c.key),
      [columns, hiddenColKeys]
    );

    const handleVisibleColKeysChange = useCallback(
      (keys: string[]) => {
        const nextHidden = new Set<string>();
        columns.forEach((c) => {
          if (!keys.includes(c.key)) nextHidden.add(c.key);
        });
        setHiddenColKeys(nextHidden);
      },
      [columns]
    );

    const handleResetColumns = useCallback(() => {
      if (controlledOnResetColumns) {
        controlledOnResetColumns();
        return;
      }
      setHiddenColKeys(new Set());
      if (defaultColumnPins) {
        if (onColumnPinsChange) onColumnPinsChange(defaultColumnPins);
        else setInternalPins(defaultColumnPins);
      }
    }, [controlledOnResetColumns, defaultColumnPins, onColumnPinsChange]);

    const handleExportExcel = useCallback(() => {
      if (controlledOnExportExcel) {
        controlledOnExportExcel();
        return;
      }
      try {
        const exportCols = columns.filter((c) => !hiddenColKeys.has(c.key));
        const headers = exportCols.map((c) => `"${(c.title || c.key).replace(/"/g, '""')}"`).join(',');
        const rows: string[] = [];
        const maxExport = Math.min(totalRows, 300000);
        for (let i = 0; i < maxExport; i++) {
          const rowVals = exportCols.map((col) => {
            let val = '';
            if (getCellValue) {
              val = String(getCellValue(i, col.key) ?? '');
            } else {
              const item: any = getRowItem(i);
              val = String(item?.cells?.get ? item.cells.get(col.key)?.value ?? '' : item?.[col.key] ?? '');
            }
            return `"${val.replace(/"/g, '""')}"`;
          });
          rows.push(rowVals.join(','));
        }
        const csvContent = '\uFEFF' + [headers, ...rows].join('\r\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `Du_Lieu_Grid_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch (err) {
        console.error('Failed to export:', err);
      }
    }, [controlledOnExportExcel, columns, hiddenColKeys, totalRows, getCellValue, getRowItem]);

    // Column partitioning: Left - Middle - Right
    const { leftColumns, middleColumns, rightColumns, flatColumns } = useMemo(() => {
      const leftCols: ColumnDef<T>[] = [];
      const rightCols: ColumnDef<T>[] = [];
      const midCols: ColumnDef<T>[] = [];

      activeColKeys.forEach((key) => {
        const pin = columnPins[key] || PIN_POSITIONS.NONE;
        const col = colMap[key];
        if (!col) return;

        if (pin === PIN_POSITIONS.LEFT) leftCols.push(col);
        else if (pin === PIN_POSITIONS.RIGHT) rightCols.push(col);
        else midCols.push(col);
      });

      return {
        leftColumns: leftCols,
        middleColumns: midCols,
        rightColumns: rightCols,
        flatColumns: [...leftCols, ...midCols, ...rightCols],
      };
    }, [activeColKeys, columnPins, colMap]);

    // Sticky offsets for Left and Right
    const { leftOffsets, rightOffsets, totalLeftWidth, totalRightWidth } = useMemo(() => {
      const lOffsets: Record<string, number> = {};
      let curLeft = 0;
      leftColumns.forEach((col) => {
        lOffsets[col.key] = curLeft;
        curLeft += colWidths[col.key] || col.defaultWidth;
      });

      const rOffsets: Record<string, number> = {};
      let curRight = 0;
      for (let i = rightColumns.length - 1; i >= 0; i--) {
        const col = rightColumns[i];
        rOffsets[col.key] = curRight;
        curRight += colWidths[col.key] || col.defaultWidth;
      }

      return {
        leftOffsets: lOffsets,
        rightOffsets: rOffsets,
        totalLeftWidth: curLeft,
        totalRightWidth: curRight,
      };
    }, [leftColumns, rightColumns, colWidths]);

    // Natural X position of each column
    const columnNaturalPositions = useMemo(() => {
      const pos: Record<string, { left: number; width: number }> = {};
      let currentX = 0;
      flatColumns.forEach((c) => {
        const w = colWidths[c.key] || c.defaultWidth;
        pos[c.key] = { left: currentX, width: w };
        currentX += w;
      });
      return pos;
    }, [flatColumns, colWidths]);

    const totalGridWidth = useMemo(() => {
      return flatColumns.reduce((acc, col) => acc + (colWidths[col.key] || col.defaultWidth), 0);
    }, [flatColumns, colWidths]);

    // Center-pinned column keys
    const centerPinnedColKeys = useMemo(() => {
      return activeColKeys.filter((k) => columnPins[k] === PIN_POSITIONS.CENTER);
    }, [activeColKeys, columnPins]);

    // Docking status of center-pinned columns
    const [centerDockStatus, setCenterDockStatus] = useState<Record<string, CenterDockStatus>>({});

    // Compute center dock offsets & border dividers
    const {
      centerLeftOffsets,
      centerRightOffsets,
      lastEffectiveLeftColKey,
      firstEffectiveRightColKey,
    } = useMemo(() => {
      const cLeftOffsets: Record<string, number> = {};
      const cRightOffsets: Record<string, number> = {};

      let runningLeft = totalLeftWidth;
      let lastDockedLeftKey: string | null = null;
      centerPinnedColKeys.forEach((key) => {
        cLeftOffsets[key] = runningLeft;
        const w = colWidths[key] || 120;
        if (centerDockStatus[key] === CENTER_DOCK_STATUSES.LEFT) {
          runningLeft += w;
          lastDockedLeftKey = key;
        }
      });

      let runningRight = totalRightWidth;
      let firstDockedRightKey: string | null = null;
      for (let i = centerPinnedColKeys.length - 1; i >= 0; i--) {
        const key = centerPinnedColKeys[i];
        cRightOffsets[key] = runningRight;
        const w = colWidths[key] || 120;
        if (centerDockStatus[key] === CENTER_DOCK_STATUSES.RIGHT) {
          runningRight += w;
          firstDockedRightKey = key;
        }
      }

      const effectiveLastLeft =
        lastDockedLeftKey !== null
          ? lastDockedLeftKey
          : leftColumns.length > 0
          ? leftColumns[leftColumns.length - 1].key
          : null;

      const effectiveFirstRight =
        firstDockedRightKey !== null
          ? firstDockedRightKey
          : rightColumns.length > 0
          ? rightColumns[0].key
          : null;

      return {
        centerLeftOffsets: cLeftOffsets,
        centerRightOffsets: cRightOffsets,
        lastEffectiveLeftColKey: effectiveLastLeft,
        firstEffectiveRightColKey: effectiveFirstRight,
      };
    }, [
      centerPinnedColKeys,
      totalLeftWidth,
      totalRightWidth,
      colWidths,
      centerDockStatus,
      leftColumns,
      rightColumns,
    ]);

    // Middle elements structure (splits groups into segments when a center-pinned column docks)
    const middleElements = useMemo(() => {
      type MiddleElement =
        | { type: 'standalone'; col: ColumnDef<T>; isCenterPinned?: boolean }
        | { type: 'group'; def: BaseGroupDef; segmentKey: string; children: ColumnDef<T>[] };

      const midElements: MiddleElement[] = [];

      if (!columnGroups || columnGroups.length === 0) {
        middleColumns.forEach((col) => {
          midElements.push({
            type: 'standalone',
            col,
            isCenterPinned: columnPins[col.key] === PIN_POSITIONS.CENTER,
          });
        });
        return midElements;
      }

      columnGroups.forEach((grp) => {
        if (grp.isStandalone) {
          const key = grp.keys[0];
          const pin = columnPins[key] || PIN_POSITIONS.NONE;
          if (activeColKeys.includes(key) && (pin === PIN_POSITIONS.NONE || pin === PIN_POSITIONS.CENTER)) {
            const col = colMap[key];
            if (col) {
              midElements.push({ type: 'standalone', col, isCenterPinned: pin === PIN_POSITIONS.CENTER });
            }
          }
        } else {
          const middleGroupKeys = grp.keys.filter((k) => {
            if (hiddenColKeys.has(k)) return false;
            const pin = columnPins[k] || PIN_POSITIONS.NONE;
            return pin === PIN_POSITIONS.NONE || pin === PIN_POSITIONS.CENTER;
          });

          let currentSegment: ColumnDef<T>[] = [];
          let segIdx = 0;

          middleGroupKeys.forEach((k) => {
            const col = colMap[k];
            if (!col) return;
            const pin = columnPins[k] || PIN_POSITIONS.NONE;
            const dock = pin === PIN_POSITIONS.CENTER ? centerDockStatus[k] || CENTER_DOCK_STATUSES.NORMAL : CENTER_DOCK_STATUSES.NORMAL;

            if (pin === PIN_POSITIONS.CENTER && (dock === CENTER_DOCK_STATUSES.LEFT || dock === CENTER_DOCK_STATUSES.RIGHT)) {
              if (currentSegment.length > 0) {
                midElements.push({
                  type: 'group',
                  def: grp,
                  segmentKey: `${grp.id}_seg_${segIdx++}`,
                  children: currentSegment,
                });
                currentSegment = [];
              }
              midElements.push({ type: 'standalone', col, isCenterPinned: true });
            } else {
              currentSegment.push(col);
            }
          });

          if (currentSegment.length > 0) {
            midElements.push({
              type: 'group',
              def: grp,
              segmentKey: `${grp.id}_seg_${segIdx++}`,
              children: currentSegment,
            });
          }
        }
      });

      return midElements;
    }, [columnGroups, middleColumns, columnPins, activeColKeys, colMap, centerDockStatus]);

    // Column Resizing Hook
    const { handleMouseDownResize, resizingRef } = useColumnResize({
      colMap,
      colWidths,
      setColWidth,
    });

    // Sample rows for auto-fit calculation (first 100 rows)
    const sampleRows = useMemo(() => {
      const count = Math.min(100, totalRows);
      const rows: T[] = [];
      for (let i = 0; i < count; i++) {
        rows.push(getRowItem(i));
      }
      return rows;
    }, [totalRows, getRowItem, dataVersion]);

    // Context Menu State (Header, Band, Row)
    const [activeContextMenu, setActiveContextMenu] = useState<ContextMenuData | null>(null);

    // Column Auto-Fit Hook (vừa độ rộng tối ưu dựa trên đo chữ canvas)
    const {
      handleAutoFitColumn,
      handleAutoFitAllColumns,
      handleAutoFitBandColumns,
    } = useColumnAutoFit({
      colMap,
      effectiveColumns,
      columnGroups,
      sampleRows,
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
        const targetKeys = group.keys;

        targetKeys.forEach((key) => {
          setColumnPin(key, pin);
        });
        setActiveContextMenu(null);
      },
      [columnGroups, setColumnPin]
    );

    // Hide / Show columns & bands handlers
    const handleHideColumn = useCallback((colKey: string) => {
      setHiddenColKeys((prev) => new Set(prev).add(colKey));
      setActiveContextMenu(null);
    }, []);

    const handleHideAllEmptyColumns = useCallback(() => {
      if (!emptyColKeys || emptyColKeys.size === 0) return;
      setHiddenColKeys((prev) => {
        const next = new Set(prev);
        emptyColKeys.forEach((k) => next.add(k));
        return next;
      });
      setActiveContextMenu(null);
    }, [emptyColKeys]);

    const handleShowAllHiddenColumns = useCallback(() => {
      setHiddenColKeys(new Set());
      setActiveContextMenu(null);
    }, []);

    const handleHideBand = useCallback(
      (groupId: string) => {
        const group = columnGroups?.find((g) => g.id === groupId);
        if (!group) return;
        const targetKeys = group.keys;

        setHiddenColKeys((prev) => {
          const next = new Set(prev);
          targetKeys.forEach((k) => next.add(k));
          return next;
        });
        setActiveContextMenu(null);
      },
      [columnGroups]
    );

    // Distinct values cache ref để mở lại Checklist popup 0ms
    const distinctValuesCacheRef = useRef<
      Record<string, { values: string[]; hasBlanks: boolean }>
    >({});

    // Xóa distinctValuesCacheRef khi tiêu chí lọc hoặc dữ liệu thay đổi để phễu cập nhật chuẩn xác
    useEffect(() => {
      distinctValuesCacheRef.current = {};
    }, [columnFilters, controlledQuickFilterText, controlledAppliedQueryTree, dataVersion]);

    // Checklist Popup Ref
    const checklistPopupRef = useRef<AdvChecklistFilterPopupRef | null>(null);

    // Mở popup lọc checklist cho cột (Zero re-render: chỉ popup mở độc lập)
    // Lắng nghe đóng tất cả popups để đảm bảo chỉ có duy nhất 1 popup hiển thị trên Grid
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
        if (emptyColKeys?.has(colKey)) return;
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

        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const vh = window.innerHeight;
        const spaceBelow = vh - rect.bottom - 8;
        const spaceAbove = rect.top - 8;
        const isFlipUp = spaceBelow < 320 && spaceAbove > spaceBelow;

        let left = Math.round(rect.left);
        if (left + 270 > window.innerWidth - 10) {
          left = Math.max(10, window.innerWidth - 270 - 10);
        }

        const curFilter = columnFilters[colKey];
        checklistPopupRef.current?.open(
          colKey,
          {
            top: rect.bottom + 4,
            bottom: isFlipUp ? vh - rect.top + 4 : undefined,
            left,
            isFlipUp,
          },
          curFilter
        );
      },
      [columnFilters, emptyColKeys]
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
        return [...prev, { rowKey: rKey, rowIndex: resolvedIdx, row }];
      });
    }, [activeContextMenu, getRowKey]);

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

        let cellValue: any = undefined;
        if ((row as any)?.cells instanceof Map) {
          cellValue = (row as any).cells.get(colKey)?.value;
        } else if ((row as any)?.[colKey] !== undefined) {
          cellValue = (row as any)[colKey];
        }
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

    // Sorting toggle handler
    const handleToggleSort = useCallback(
      (colKey: string) => {
        if (!onSortChange) return;
        if (sortConfig?.key === colKey) {
          if (sortConfig.direction === SORT_DIRECTIONS.ASC) {
            onSortChange({ key: colKey, direction: SORT_DIRECTIONS.DESC });
          } else {
            onSortChange(null);
          }
        } else {
          onSortChange({ key: colKey, direction: SORT_DIRECTIONS.ASC });
        }
      },
      [sortConfig, onSortChange]
    );

    // Virtualization Geometry
    const [viewportHeight, setViewportHeight] = useState<number>(600);
    const [viewportWidth, setViewportWidth] = useState<number>(1200);

    const totalChunks = Math.ceil(totalRows / chunkSize);
    const chunkPixelHeight = chunkSize * actualRowHeight;
    const totalContentHeight = totalRows * actualRowHeight;

    const [chunkWindow, setChunkWindow] = useState<{ start: number; end: number }>(() => {
      if (totalRows === 0) return { start: 0, end: -1 };
      return { start: 0, end: Math.min(totalChunks - 1, 5) };
    });
    const activeChunkWindowRef = useRef<{ start: number; end: number }>(
      totalRows === 0 ? { start: 0, end: -1 } : { start: 0, end: Math.min(totalChunks - 1, 5) }
    );

    // Center docking computation
    const computeCenterDock = useCallback(
      (scrollLeft: number, clientWidth: number) => {
        if (centerPinnedColKeys.length === 0) {
          setCenterDockStatus((prev) => (Object.keys(prev).length === 0 ? prev : {}));
          return;
        }

        const nextStatus: Record<string, CenterDockStatus> = {};
        let runningLeftEdge = scrollLeft + totalLeftWidth;
        let runningRightEdge = scrollLeft + clientWidth - totalRightWidth;

        // Check left docking
        for (let i = 0; i < centerPinnedColKeys.length; i++) {
          const key = centerPinnedColKeys[i];
          const pos = columnNaturalPositions[key];
          if (!pos) continue;
          if (pos.left < runningLeftEdge) {
            nextStatus[key] = CENTER_DOCK_STATUSES.LEFT;
            runningLeftEdge += pos.width;
          } else {
            nextStatus[key] = CENTER_DOCK_STATUSES.NORMAL;
          }
        }

        // Check right docking
        for (let i = centerPinnedColKeys.length - 1; i >= 0; i--) {
          const key = centerPinnedColKeys[i];
          if (nextStatus[key] === CENTER_DOCK_STATUSES.LEFT) continue;
          const pos = columnNaturalPositions[key];
          if (!pos) continue;
          if (pos.left + pos.width > runningRightEdge) {
            nextStatus[key] = CENTER_DOCK_STATUSES.RIGHT;
            runningRightEdge -= pos.width;
          }
        }

        setCenterDockStatus((prev) => {
          let hasChange = Object.keys(prev).length !== Object.keys(nextStatus).length;
          if (!hasChange) {
            for (const k of centerPinnedColKeys) {
              if (prev[k] !== nextStatus[k]) {
                hasChange = true;
                break;
              }
            }
          }
          return hasChange ? nextStatus : prev;
        });
      },
      [centerPinnedColKeys, totalLeftWidth, totalRightWidth, columnNaturalPositions]
    );

    // Sync center dock on resize or viewport width change
    useEffect(() => {
      const el = scrollContainerRef.current;
      if (!el) return;
      computeCenterDock(el.scrollLeft, el.clientWidth);
    }, [computeCenterDock, viewportWidth]);

    // Viewport resize observer
    useEffect(() => {
      const el = scrollContainerRef.current;
      if (!el) return;

      const updateSize = () => {
        setViewportHeight(el.clientHeight);
        setViewportWidth(el.clientWidth);
      };
      updateSize();

      const observer = new ResizeObserver(updateSize);
      observer.observe(el);
      return () => observer.disconnect();
    }, []);

    // Update chunk window on viewport/chunk changes
    useEffect(() => {
      const currentTop = scrollContainerRef.current?.scrollTop || 0;
      if (totalChunks === 0) {
        activeChunkWindowRef.current = { start: 0, end: -1 };
        setChunkWindow({ start: 0, end: -1 });
        return;
      }
      const rawStart = Math.floor(currentTop / chunkPixelHeight);
      const rawEnd = Math.floor((currentTop + viewportHeight) / chunkPixelHeight);
      const start = Math.max(0, rawStart - overscanChunks);
      const end = Math.min(totalChunks - 1, rawEnd + overscanChunks);

      activeChunkWindowRef.current = { start, end };
      setChunkWindow({ start, end });
    }, [viewportHeight, chunkPixelHeight, totalChunks, overscanChunks]);

    // Tính toán dòng tiêu đề nhóm dính trên đỉnh khi cuộn dọc (Sticky Group Header)
    const [stickyGroupRowIndex, setStickyGroupRowIndex] = useState<number | null>(null);

    const computeStickyGroupIdx = useCallback(
      (currentTop: number): number | null => {
        if (!groupByColumnKey || totalRows <= 0 || currentTop <= 0) return null;
        const topRowIdx = Math.min(
          totalRows - 1,
          Math.max(0, Math.floor(currentTop / actualRowHeight))
        );
        const rowAtTop = getRowItem(topRowIdx) as any;
        if (!rowAtTop) return null;
        if (rowAtTop._isGroupRow) {
          if (!rowAtTop.isCollapsed && rowAtTop.count > 0 && currentTop > topRowIdx * actualRowHeight) {
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
      },
      [groupByColumnKey, totalRows, actualRowHeight, getRowItem]
    );

    useEffect(() => {
      const currentTop = scrollContainerRef.current?.scrollTop || 0;
      const nextIdx = computeStickyGroupIdx(currentTop);
      setStickyGroupRowIndex((prev) => (prev === nextIdx ? prev : nextIdx));
    }, [computeStickyGroupIdx, dataVersion]);

    const stickyGroupRow = useMemo(() => {
      if (
        !groupByColumnKey ||
        stickyGroupRowIndex === null ||
        stickyGroupRowIndex < 0 ||
        stickyGroupRowIndex >= totalRows
      ) {
        return null;
      }
      const r = getRowItem(stickyGroupRowIndex);
      return (r as any)?._isGroupRow ? r : null;
    }, [groupByColumnKey, stickyGroupRowIndex, totalRows, getRowItem, dataVersion]);

    // Velocity & FPS tracking
    const lastScrollTopRef = useRef<number>(0);
    const lastScrollLeftRef = useRef<number>(0);
    const lastScrollTimeRef = useRef<number>(performance.now());
    const lastMetricsEmitTimeRef = useRef<number>(0);
    const windowAccumDistanceRef = useRef<number>(0);
    const windowStartTimeRef = useRef<number>(performance.now());
    const scrollStopTimeoutRef = useRef<number | null>(null);
    const currentVelocityRef = useRef<number>(0);
    const currentFpsRef = useRef<number>(60);

    useEffect(() => {
      let frameCount = 0;
      let lastTime = performance.now();
      let rafId: number;

      const measureFps = (now: number) => {
        frameCount++;
        if (now - lastTime >= 500) {
          const fps = Math.min(144, Math.round((frameCount * 1000) / (now - lastTime)));
          currentFpsRef.current = fps;
          frameCount = 0;
          lastTime = now;
        }
        rafId = requestAnimationFrame(measureFps);
      };

      rafId = requestAnimationFrame(measureFps);
      return () => cancelAnimationFrame(rafId);
    }, []);

    // Wheel snapping listener
    useEffect(() => {
      const el = scrollContainerRef.current;
      if (!el || !rowSnapMode) return;

      const handleWheelSnap = (e: WheelEvent) => {
        if (activeContextMenu || activeEditingCell || isAnyPopupActive()) {
          e.preventDefault();
          return;
        }
        if (e.shiftKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
        if (e.deltaY === 0) return;

        e.preventDefault();

        const direction = Math.sign(e.deltaY);
        const rawNotches =
          e.deltaMode === 1
            ? Math.max(1, Math.round(Math.abs(e.deltaY) / 3))
            : Math.max(1, Math.round(Math.abs(e.deltaY) / 100));

        const stepRows = direction * rawNotches * rowsPerWheelStep;
        const maxScroll = Math.max(0, el.scrollHeight - el.clientHeight);

        const currentSnappedRow = Math.round(el.scrollTop / actualRowHeight);
        const targetRow = currentSnappedRow + stepRows;
        const nextScrollTop = Math.max(0, Math.min(maxScroll, targetRow * actualRowHeight));

        el.scrollTop = nextScrollTop;
      };

      el.addEventListener('wheel', handleWheelSnap, { passive: false });
      return () => el.removeEventListener('wheel', handleWheelSnap);
    }, [rowSnapMode, rowsPerWheelStep, actualRowHeight, activeContextMenu, activeEditingCell]);

    // Popup Scroll Lock: Chặn cuộn chuột khi có bất kỳ Popup / Menu / Editor nào đang mở
    useEffect(() => {
      const el = scrollContainerRef.current;
      if (!el) return;

      const handleWheelLock = (e: WheelEvent) => {
        const target = e.target as HTMLElement | null;
        if (target && target.closest(POPUP_SELECTORS)) {
          return; // Cho phép cuộn bên trong chính popup đó
        }
        if (activeContextMenu || activeEditingCell || isAnyPopupActive()) {
          e.preventDefault();
          e.stopPropagation();
        }
      };

      el.addEventListener('wheel', handleWheelLock, { passive: false });
      return () => {
        el.removeEventListener('wheel', handleWheelLock);
      };
    }, [activeContextMenu, activeEditingCell]);

    // Điều hướng dòng bằng bàn phím (ArrowUp / ArrowDown / PageUp / PageDown / Space) - Giữ cố định listener qua Ref khi nhấn giữ phím liên tục
    const keyNavStateRef = useRef({
      activeContextMenu,
      activeEditingCell,
      totalRows,
      selectedRowIndex,
      onSelectRow,
      onToggleCheck,
      getRowItem,
      viewportHeight,
      actualRowHeight,
      customHeaderHeight,
      middleElements,
      showFilterRow,
      pinnedRowsLength: pinnedRows.length,
      stickyGroupRow,
    });
    keyNavStateRef.current = {
      activeContextMenu,
      activeEditingCell,
      totalRows,
      selectedRowIndex,
      onSelectRow,
      onToggleCheck,
      getRowItem,
      viewportHeight,
      actualRowHeight,
      customHeaderHeight,
      middleElements,
      showFilterRow,
      pinnedRowsLength: pinnedRows.length,
      stickyGroupRow,
    };

    useEffect(() => {
      const handleKeyDownNav = (e: KeyboardEvent) => {
        const st = keyNavStateRef.current;
        if (st.activeContextMenu || st.activeEditingCell || isAnyPopupActive()) return;
        const target = e.target as HTMLElement | null;
        if (
          target &&
          (target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.tagName === 'SELECT' ||
            target.isContentEditable)
        ) {
          return;
        }
        if (st.totalRows <= 0) return;

        if (
          e.key === 'ArrowDown' ||
          e.key === 'ArrowUp' ||
          e.key === 'PageDown' ||
          e.key === 'PageUp'
        ) {
          if (!st.onSelectRow) return;
          e.preventDefault();
          const pageStep = Math.max(
            1,
            Math.floor((st.viewportHeight || 400) / st.actualRowHeight) - 1
          );
          const curIdx: number =
            typeof st.selectedRowIndex === 'number' && st.selectedRowIndex >= 0
              ? st.selectedRowIndex
              : 0;
          let nextIdx: number = curIdx;
          if (e.key === 'ArrowDown') nextIdx = Math.min(st.totalRows - 1, curIdx + 1);
          else if (e.key === 'ArrowUp') nextIdx = Math.max(0, curIdx - 1);
          else if (e.key === 'PageDown') nextIdx = Math.min(st.totalRows - 1, curIdx + pageStep);
          else if (e.key === 'PageUp') nextIdx = Math.max(0, curIdx - pageStep);

          if (nextIdx === curIdx) return;

          const nextRow = st.getRowItem(nextIdx);
          st.onSelectRow(nextIdx, nextRow);

          const el = scrollContainerRef.current;
          if (el) {
            const rowTop = nextIdx * st.actualRowHeight;
            const rowBottom = rowTop + st.actualRowHeight;
            const viewTop = el.scrollTop;
            const stickyHeaderHeight =
              (st.customHeaderHeight ??
                (st.middleElements.some((m) => m.type === 'group') ? 64 : 34)) +
              (st.showFilterRow ? 34 : 0) +
              st.pinnedRowsLength * st.actualRowHeight +
              (st.stickyGroupRow ? st.actualRowHeight : 0);
            const visibleDataHeight = Math.max(
              st.actualRowHeight,
              el.clientHeight - stickyHeaderHeight
            );
            if (rowTop < viewTop) {
              el.scrollTop = rowTop;
            } else if (rowBottom > viewTop + visibleDataHeight) {
              el.scrollTop = Math.max(0, rowBottom - visibleDataHeight);
            }
          }
        } else if (
          e.key === ' ' &&
          typeof st.selectedRowIndex === 'number' &&
          st.selectedRowIndex >= 0 &&
          st.onToggleCheck
        ) {
          const curRow = st.getRowItem(st.selectedRowIndex) as any;
          if (curRow && !curRow._isGroupRow) {
            e.preventDefault();
            st.onToggleCheck(st.selectedRowIndex, curRow, e as unknown as React.MouseEvent);
          }
        }
      };

      window.addEventListener('keydown', handleKeyDownNav);
      return () => window.removeEventListener('keydown', handleKeyDownNav);
    }, []);

    // Auto scrolling test mode (Tối ưu dt mượt 60-144Hz, không đọc scrollHeight gây Forced Reflow)
    useEffect(() => {
      if (!autoScrolling) return;
      let rafId: number;
      let direction = 1;
      let lastFrameTime = performance.now();
      let virtualTop = scrollContainerRef.current?.scrollTop || 0;

      const step = (now: number) => {
        const el = scrollContainerRef.current;
        if (el) {
          const dt = Math.min(50, Math.max(1, now - lastFrameTime));
          lastFrameTime = now;

          const maxScroll = Math.max(0, totalContentHeight - (viewportHeight || el.clientHeight));
          const stepPx = (autoScrollSpeed * dt) / 16.667;

          virtualTop += direction * stepPx;
          if (virtualTop >= maxScroll) {
            virtualTop = maxScroll;
            direction = -1;
          } else if (virtualTop <= 0) {
            virtualTop = 0;
            direction = 1;
          }
          el.scrollTop = Math.round(virtualTop);
        }
        rafId = requestAnimationFrame(step);
      };

      rafId = requestAnimationFrame(step);
      return () => {
        cancelAnimationFrame(rafId);
        // Khi dừng auto-scroll, căn chỉnh snap dòng mượt mà và đưa vận tốc hiển thị về 0 px/s
        const el = scrollContainerRef.current;
        if (el && rowSnapMode && actualRowHeight > 0) {
          const snapped = Math.round(el.scrollTop / actualRowHeight) * actualRowHeight;
          if (Math.abs(snapped - el.scrollTop) > 0.5) {
            el.scrollTop = snapped;
          }
        }
        currentVelocityRef.current = 0;
        windowAccumDistanceRef.current = 0;
        windowStartTimeRef.current = performance.now();
        if (onScrollMetrics) {
          onScrollMetrics({
            fps: currentFpsRef.current,
            velocity: 0,
            startChunk: activeChunkWindowRef.current.start,
            endChunk: activeChunkWindowRef.current.end,
            mountedRowCount:
              (activeChunkWindowRef.current.end - activeChunkWindowRef.current.start + 1) *
              chunkSize,
            totalRows,
          });
        }
      };
    }, [
      autoScrolling,
      autoScrollSpeed,
      rowSnapMode,
      actualRowHeight,
      totalContentHeight,
      viewportHeight,
      onScrollMetrics,
      chunkSize,
      totalRows,
    ]);

    // Scroll handler
    const handleScroll = useCallback(
      (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.currentTarget;

        // Popup & Editing Scroll Lock: Khi đang sửa hoặc có popup mở thì Grid tuyệt đối không được cuộn (khóa cả ngang lẫn dọc)
        if (!autoScrolling && (activeContextMenu || activeEditingCell || isAnyPopupActive())) {
          const lockedPos = lockedScrollPosRef.current;
          target.scrollTop = lockedPos ? lockedPos.top : lastScrollTopRef.current;
          target.scrollLeft = lockedPos ? lockedPos.left : lastScrollLeftRef.current;
          return;
        }

        let currentTop = target.scrollTop;
        const currentScrollLeft = target.scrollLeft;

        if (currentScrollLeft !== lastScrollLeftRef.current) {
          lastScrollLeftRef.current = currentScrollLeft;
          if (centerPinnedColKeys.length > 0) {
            computeCenterDock(currentScrollLeft, target.clientWidth);
          }
        }

        if (rowSnapMode && !autoScrolling) {
          const maxScroll = Math.max(0, totalContentHeight - (viewportHeight || target.clientHeight));
          const remainder = currentTop % actualRowHeight;
          if (remainder !== 0 && currentTop < maxScroll) {
            const snapped = Math.min(maxScroll, Math.round(currentTop / actualRowHeight) * actualRowHeight);
            if (Math.abs(snapped - currentTop) > 0.5) {
              target.scrollTop = snapped;
              currentTop = snapped;
            }
          }
        }

        const now = performance.now();
        const dy = Math.abs(currentTop - lastScrollTopRef.current);
        windowAccumDistanceRef.current += dy;

        lastScrollTopRef.current = currentTop;
        lastScrollTimeRef.current = now;

        let start = activeChunkWindowRef.current.start;
        let end = activeChunkWindowRef.current.end;
        let chunkChanged = false;
        if (totalChunks > 0) {
          const rawStart = Math.floor(currentTop / chunkPixelHeight);
          const rawEnd = Math.floor((currentTop + viewportHeight) / chunkPixelHeight);
          start = Math.max(0, rawStart - overscanChunks);
          end = Math.min(totalChunks - 1, rawEnd + overscanChunks);

          if (
            start !== activeChunkWindowRef.current.start ||
            end !== activeChunkWindowRef.current.end
          ) {
            chunkChanged = true;
            activeChunkWindowRef.current = { start, end };
            setChunkWindow({ start, end });
          }
        }

        if (groupByColumnKey) {
          const nextStickyIdx = computeStickyGroupIdx(currentTop);
          setStickyGroupRowIndex((prev) => (prev === nextStickyIdx ? prev : nextStickyIdx));
        }

        if (!autoScrolling) {
          if (scrollStopTimeoutRef.current) {
            window.clearTimeout(scrollStopTimeoutRef.current);
          }
          scrollStopTimeoutRef.current = window.setTimeout(() => {
            currentVelocityRef.current = 0;
            windowAccumDistanceRef.current = 0;
            windowStartTimeRef.current = performance.now();
            lastMetricsEmitTimeRef.current = performance.now();
            if (onScrollMetrics) {
              onScrollMetrics({
                fps: currentFpsRef.current,
                velocity: 0,
                startChunk: activeChunkWindowRef.current.start,
                endChunk: activeChunkWindowRef.current.end,
                mountedRowCount:
                  (activeChunkWindowRef.current.end - activeChunkWindowRef.current.start + 1) *
                  chunkSize,
                totalRows,
              });
            }
          }, 110);
        }

        // Đo vận tốc trung bình trên toàn chu kỳ 120ms và tách khỏi frame mount chunk mới
        const windowElapsed = now - lastMetricsEmitTimeRef.current;
        if (onScrollMetrics && !chunkChanged && windowElapsed >= 120) {
          const measureDt = Math.max(1, now - windowStartTimeRef.current);
          const pxPerSec = autoScrolling
            ? Math.round(autoScrollSpeed * 60)
            : Math.round((windowAccumDistanceRef.current / measureDt) * 1000);
          currentVelocityRef.current = pxPerSec;
          windowAccumDistanceRef.current = 0;
          windowStartTimeRef.current = now;
          lastMetricsEmitTimeRef.current = now;
          onScrollMetrics({
            fps: currentFpsRef.current,
            velocity: pxPerSec,
            startChunk: start,
            endChunk: end,
            mountedRowCount: (end - start + 1) * chunkSize,
            totalRows,
          });
        }
      },
      [
        centerPinnedColKeys.length,
        computeCenterDock,
        rowSnapMode,
        autoScrolling,
        actualRowHeight,
        totalContentHeight,
        totalChunks,
        chunkPixelHeight,
        viewportHeight,
        overscanChunks,
        onScrollMetrics,
        chunkSize,
        totalRows,
        activeContextMenu,
        activeEditingCell,
        groupByColumnKey,
        computeStickyGroupIdx,
      ]
    );

    // Visible chunks list - Tính toán đồng bộ tức thì (Zero-Delay Sync, loại bỏ 2-pass render)
    const visibleChunkIndices = useMemo(() => {
      if (totalChunks === 0) return [] as number[];

      const currentTop = scrollContainerRef.current?.scrollTop || 0;
      const rawStart = Math.floor(currentTop / chunkPixelHeight);
      const rawEnd = Math.floor((currentTop + (viewportHeight || 600)) / chunkPixelHeight);
      const start = Math.max(0, Math.min(totalChunks - 1, rawStart - overscanChunks));
      const end = Math.min(totalChunks - 1, Math.max(start, rawEnd + overscanChunks));

      const indices: number[] = [];
      for (let c = start; c <= end; c++) {
        indices.push(c);
      }
      return indices;
    }, [chunkWindow, totalChunks, chunkPixelHeight, viewportHeight, overscanChunks]);

    // Bộ đệm lưu trữ mảng dòng của từng Chunk (Giữ nguyên tham chiếu chunkRows cho các chunk cũ khi cuộn, giúp GridChunkBlock đạt 100% React.memo hit)
    const chunkRowsCacheRef = useRef<{
      key: string;
      getRowRef: any;
      map: Map<number, T[]>;
    }>({ key: '', getRowRef: null, map: new Map() });

    // Rows in visible chunks
    const visibleChunksMap = useMemo(() => {
      const cacheKey = `${chunkSize}_${totalRows}_${dataVersion ?? 0}`;
      if (
        chunkRowsCacheRef.current.key !== cacheKey ||
        chunkRowsCacheRef.current.getRowRef !== getRowItem
      ) {
        chunkRowsCacheRef.current = {
          key: cacheKey,
          getRowRef: getRowItem,
          map: new Map<number, T[]>(),
        };
      }
      const cache = chunkRowsCacheRef.current.map;
      const map = new Map<number, T[]>();
      for (const cIdx of visibleChunkIndices) {
        let chunkRows = cache.get(cIdx);
        if (!chunkRows) {
          const startRow = cIdx * chunkSize;
          const endRow = Math.min(totalRows, startRow + chunkSize);
          chunkRows = [];
          for (let i = startRow; i < endRow; i++) {
            chunkRows.push(getRowItem(i));
          }
          cache.set(cIdx, chunkRows);
        }
        map.set(cIdx, chunkRows);
      }
      if (cache.size > 40) {
        for (const cachedIdx of cache.keys()) {
          if (!map.has(cachedIdx)) {
            cache.delete(cachedIdx);
            if (cache.size <= 30) break;
          }
        }
      }
      return map;
    }, [visibleChunkIndices, chunkSize, totalRows, getRowItem, dataVersion]);

    // Imperative Ref API
    useImperativeHandle(
      ref,
      () => ({
        scrollToRow: (rowIndex: number, behavior: ScrollBehavior = 'auto') => {
          const el = scrollContainerRef.current;
          if (!el || totalRows === 0) return;
          const clamped = Math.max(0, Math.min(totalRows - 1, rowIndex));
          const targetTop = clamped * actualRowHeight;
          if (rowSnapMode || behavior === 'auto') {
            el.scrollTop = targetTop;
          } else {
            el.scrollTo({ top: targetTop, behavior });
          }
        },
        scrollToChunk: (chunkIndex: number, behavior: ScrollBehavior = 'auto') => {
          const el = scrollContainerRef.current;
          if (!el || totalChunks === 0) return;
          const clamped = Math.max(0, Math.min(totalChunks - 1, chunkIndex));
          const targetTop = clamped * chunkPixelHeight;
          if (rowSnapMode || behavior === 'auto') {
            el.scrollTop = targetTop;
          } else {
            el.scrollTo({ top: targetTop, behavior });
          }
        },
        getScrollContainer: () => scrollContainerRef.current,
      }),
      [totalRows, actualRowHeight, rowSnapMode, totalChunks, chunkPixelHeight]
    );

    const theme = getThemeClasses(surfaceTheme);

    return (
      <div
        ref={containerRef}
        data-theme={surfaceTheme}
        className={`relative flex-1 flex flex-col min-h-0 overflow-hidden agv-grid-root ${isFullscreen ? 'agv-grid-fullscreen' : ''} ${getThemeClass(surfaceTheme)} ${className}`}
        style={style}
        onContextMenu={(e) => {
          // Vô hiệu hóa chuột phải mặc định của trình duyệt trong Grid
          e.preventDefault();
        }}
      >
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          data-agv-editing={activeEditingCell ? 'true' : undefined}
          onContextMenu={(e) => {
            // Vô hiệu hóa chuột phải mặc định của trình duyệt trong vùng cuộn Grid
            e.preventDefault();
          }}
          style={{
            willChange: 'scroll-position',
            WebkitOverflowScrolling: 'touch',
            backgroundColor: 'var(--agv-bg-root)',
          }}
          className={`flex-1 overflow-auto relative ${theme.viewportBg}`}
        >
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
            surfaceTheme={surfaceTheme}
            columnFilters={columnFilters}
            onOpenChecklistFilter={handleOpenChecklistFilter}
            onToggleSort={handleToggleSort}
            onColumnContextMenu={handleColumnContextMenu}
            onBandContextMenu={handleBandContextMenu}
            onMouseDownResize={handleMouseDownResize}
            onToggleGroup={onToggleGroup}
            onReorderColumns={onReorderColumns}
            headerHeight={customHeaderHeight ?? (middleElements.some((e) => e.type === 'group') ? 64 : 34)}
            emptyColKeys={emptyColKeys}
            hasFilterRow={showFilterRow}
          />

          {/* Sticky Inline Filter Row */}
          {showFilterRow && (
            <GridFilterRow
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
              columnSums={columnSums}
              hasCheckedRows={Boolean(checkedRowIndices && checkedRowIndices.size > 0)}
              emptyColKeys={emptyColKeys}
              groupByColumnKey={groupByColumnKey}
              quickFilterText={controlledQuickFilterText}
              sortConfig={sortConfig}
              groupSortConfig={groupSortConfig}
              appliedQueryTree={controlledAppliedQueryTree}
              pinnedRows={pinnedRows}
              onUngroup={onUngroup}
              onSortChange={onSortChange}
              onToggleGroupSort={onToggleGroupSort}
              onQuickFilterTextChange={controlledOnQuickFilterTextChange}
              onApplyQueryTree={controlledOnApplyQueryTree}
              onUnpinRow={handleUnpinRow}
              onClearPinnedRows={handleClearPinnedRows}
            />
          )}

          {/* Sticky Pinned Rows (Ghim dòng cố định trên đầu bảng) */}
          {pinnedRows.length > 0 && (
            <div
              style={{
                position: 'sticky',
                top: `${
                  (customHeaderHeight ?? (middleElements.some((e) => e.type === 'group') ? 64 : 34)) +
                  (showFilterRow ? 34 : 0)
                }px`,
                width: `${totalGridWidth}px`,
                zIndex: 19,
                backgroundColor: 'var(--agv-bg-root)',
              }}
              className="border-b-2 border-b-[var(--agv-border-strong)] select-none"
            >
              {pinnedRows.map((p, pinIdx) => {
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
                    onCellContextMenu={handleCellContextMenu}
                    onGroupContextMenu={handleGroupContextMenu}
                    editMode={editMode}
                    editingCell={activeEditingCell}
                    onStartEditCell={handleStartEditCell}
                    onEndEditCell={handleEndEditCell}
                    onCellChange={handleInternalCellChange}
                    getColumnDateBounds={getColumnDateBounds}
                    emptyColKeys={emptyColKeys}
                  />
                );
              })}
            </div>
          )}

          {/* Sticky Group Header (Dính tiêu đề nhóm trên đỉnh khi cuộn dọc) */}
          {stickyGroupRow && (stickyGroupRow as any)._isGroupRow && stickyGroupRowIndex !== null && (
            <div
              style={{
                position: 'sticky',
                top: `${
                  (customHeaderHeight ?? (middleElements.some((e) => e.type === 'group') ? 64 : 34)) +
                  (showFilterRow ? 34 : 0) +
                  pinnedRows.length * actualRowHeight
                }px`,
                width: `${totalGridWidth}px`,
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
                onCellContextMenu={handleCellContextMenu}
                onGroupContextMenu={handleGroupContextMenu}
                editMode={editMode}
                editingCell={activeEditingCell}
                onStartEditCell={handleStartEditCell}
                onEndEditCell={handleEndEditCell}
                onCellChange={handleInternalCellChange}
                getColumnDateBounds={getColumnDateBounds}
                emptyColKeys={emptyColKeys}
              />
            </div>
          )}

          {/* Virtualized Rows Canvas */}
          <div
            style={{
              height: `${totalContentHeight}px`,
              width: `${totalGridWidth}px`,
              position: 'relative',
            }}
          >
            {visibleChunkIndices.map((chunkIdx) => {
              const chunkRows = visibleChunksMap.get(chunkIdx);
              if (!chunkRows) return null;

              return (
                <GridChunkBlock
                  key={`chunk_${chunkSize}_${chunkIdx}`}
                  chunkIndex={chunkIdx}
                  rows={chunkRows}
                  startRowIndex={chunkIdx * chunkSize}
                  columns={flatColumns}
                  colWidths={colWidths}
                  rowHeight={actualRowHeight}
                  chunkSize={chunkSize}
                  selectedRowIndex={selectedRowIndex ?? null}
                  selectedRowKey={selectedRowKey}
                  checkedRowIndices={checkedRowIndices}
                  onSelectRow={onSelectRow}
                  onToggleCheck={onToggleCheck}
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
                  getRowId={getRowId}
                  renderCell={renderCell}
                  onCellContextMenu={handleCellContextMenu}
                  onGroupContextMenu={handleGroupContextMenu}
                  editMode={editMode}
                  editingCell={activeEditingCell}
                  onStartEditCell={handleStartEditCell}
                  onEndEditCell={handleEndEditCell}
                  onCellChange={handleInternalCellChange}
                  getColumnDateBounds={getColumnDateBounds}
                  emptyColKeys={emptyColKeys}
                />
              );
            })}
          </div>
        </div>

        {/* Universal Context Menu (Header / Band / Row) */}
        {activeContextMenu && (
          <ColumnContextMenu
            menu={activeContextMenu}
            surfaceTheme={surfaceTheme}
            columns={columns}
            columnGroups={columnGroups}
            onClose={() => setActiveContextMenu(null)}
            onSetPin={handleSetPin}
            onAutoFitColumn={handleAutoFitColumn}
            onAutoFitAllColumns={handleAutoFitAllColumns}
            onHideColumn={handleHideColumn}
            onShowAllHiddenColumns={handleShowAllHiddenColumns}
            onSetBandPin={handleSetBandPin}
            onAutoFitBandColumns={handleAutoFitBandColumns}
            onHideBand={handleHideBand}
            onFilterByValue={handleFilterByValue}
            onScrollToTop={handleScrollToTop}
            onScrollToBottom={handleScrollToBottom}
            isRowPinned={
              activeContextMenu.type === CONTEXT_MENU_TYPES.ROW && activeContextMenu.row
                ? pinnedRowKeysSet.has(getRowKey(activeContextMenu.row, activeContextMenu.rowIndex))
                : false
            }
            pinnedRowCount={pinnedRows.length}
            onTogglePinRow={handleTogglePinContextMenuRow}
            onClearPinnedRows={handleClearPinnedRows}
            checkedRowCount={checkedRowIndices ? checkedRowIndices.size : 0}
            onClearCheckedRows={onClearCheckedRows}
            groupByColumnKey={groupByColumnKey}
            onToggleGroupByColumn={onToggleGroupByColumn}
            onCollapseAllGroups={onCollapseAllGroups}
            onExpandAllGroups={onExpandAllGroups}
            onUngroup={onUngroup}
            onCopyGroupTable={onCopyGroupTable}
            onExportGroupExcel={onExportGroupExcel}
            formulaMode={formulaMode}
            onSelectFormulaMode={onFormulaModeChange}
            emptyColKeys={emptyColKeys}
            onHideAllEmptyColumns={handleHideAllEmptyColumns}
            groupSortConfig={groupSortConfig}
            onToggleGroupSort={onToggleGroupSort}
            sortConfig={sortConfig}
            onSortChange={onSortChange}
          />
        )}

        {/* Portal: Checklist Filter Popup (Zero re-render: chỉ popup mở độc lập) */}
        <AdvChecklistFilterPopup
          ref={checklistPopupRef}
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
        />

        {/* Floating Toolbar (Right-docked, 6 Buttons, 4 Popups, strictly bounded inside Grid) */}
        {enableFloatingToolbar && (
          <GridFloatingToolbar
            gridContainerRef={containerRef}
            surfaceTheme={surfaceTheme}
            headerHeight={
              (customHeaderHeight ?? (middleElements.some((e) => e.type === 'group') ? 64 : 34)) +
              (showFilterRow ? 34 : 0)
            }
            quickFilterText={currentQuickFilterText}
            onQuickFilterChange={handleQuickFilterChange}
            isQuickFilterSmart={isQuickFilterSmart}
            onToggleQuickFilterSmart={handleToggleQuickFilterSmart}
            appliedQueryTree={currentQueryTree}
            onApplyQueryTree={handleApplyQueryTree}
            totalFilteredRows={totalRows}
            totalRowCount={totalRows}
            data={data}
            getCellValue={effectiveGetCellValue}
            hasColumnEmptyCells={effectiveHasColumnEmptyCells}
            getColumnDateBounds={effectiveGetColumnDateBounds}
            columns={columns}
            columnGroups={columnGroups}
            visibleColKeys={visibleColKeys}
            onVisibleColKeysChange={handleVisibleColKeysChange}
            columnPins={columnPins}
            onColumnPinChange={handleSetPin}
            onResetColumns={handleResetColumns}
            onAutoFitColumn={handleAutoFitColumn}
            onAutoFitAllColumns={handleAutoFitAllColumns}
            onReorderColumns={onReorderColumns}
            settings={gridSettings}
            onUpdateSettings={setGridSettings}
            onExportExcel={handleExportExcel}
            isExporting={controlledIsExporting}
            isFullscreen={isFullscreen}
            onToggleFullscreen={toggleFullscreen}
          />
        )}
      </div>
    );
  }
);

VirtualizedGridComponent.displayName = 'VirtualizedGrid';

export const VirtualizedGrid = React.memo(VirtualizedGridComponent) as unknown as <T = any>(
  props: VirtualizedGridProps<T> & { ref?: React.Ref<VirtualizedGridRef> }
) => React.ReactElement | null;
