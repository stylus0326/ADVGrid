import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import './floatingToolbar.css';
import {
  GripVertical,
  Search,
  GitBranch,
  ArrowUpDown,
  Columns,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { ColumnDef, DATA_TYPES, SURFACE_THEMES } from '../../types';
import { POPUP_SELECTORS } from '../../constants';
import {
  GridFloatingToolbarProps,
  FloatingPopupType,
  TOOLBAR_POPUPS,
} from '../../floating/types';
import { hasActiveQueryRules, countActiveQueryRules } from '../../floating/queryRuleCheck';
import { getFloatingToolbarTopKey, readGridStorageRaw, writeGridStorageRaw } from '../../gridStorage';

// Code Splitting (Lazy Loading) cho các flyout/popup & modals của floating toolbar
const LazyAdvQuickFilterFlyout = React.lazy(() =>
  import('../../floating/AdvQuickFilterFlyout').then((m) => ({ default: m.AdvQuickFilterFlyout }))
);
const LazyAdvMultiSortPopup = React.lazy(() =>
  import('../../AdvMultiSortPopup').then((m) => ({ default: m.AdvMultiSortPopup }))
);
const AdvColumnChooserModal = React.lazy(() =>
  import('../../floating/AdvColumnChooserModal').then((m) => ({ default: m.AdvColumnChooserModal }))
);
const AdvGridQueryBuilderModal = React.lazy(() =>
  import('../../floating/AdvGridQueryBuilderModal').then((m) => ({ default: m.AdvGridQueryBuilderModal }))
);

export const GridFloatingToolbar = React.memo(function GridFloatingToolbar<T = any>({
  gridContainerRef,
  gridId,
  persistState = true,
  surfaceTheme = SURFACE_THEMES.LIGHT,
  headerHeight = 64,

  // Feature Flags
  enableQuickSearch = true,
  enableQueryBuilder = false,
  enableMultiSort = false,
  enableColumnChooser = false,
  enableFullscreen = false,
  enableColumnPinning = true,
  enableColumnReorder = true,
  enableColumnHide = true,

  // 1. Quick Filter
  quickFilterText,
  onQuickFilterChange,
  isQuickFilterSmart,
  onToggleQuickFilterSmart,

  // 2. Query Builder
  appliedQueryTree,
  onApplyQueryTree,
  totalFilteredRows,
  totalRowCount,
  data,
  getCellValue,
  hasColumnEmptyCells,
  getColumnDateBounds,

  // Multi-Sort
  sortRules = [],
  onApplySortRules,

  // 3. Column Chooser
  columns,
  columnGroups,
  visibleColKeys,
  onVisibleColKeysChange,
  columnPins,
  onColumnPinChange,
  onResetColumns,
  onAutoFitColumn,
  onAutoFitAllColumns,
  onReorderColumns,

  // Fullscreen
  isFullscreen,
  onToggleFullscreen,

  // Popup state sync
  onActivePopupChange,
}: GridFloatingToolbarProps<T>) {
  const toolbarRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // Active popup state: 'search' | 'queryBuilder' | 'columnChooser' | 'settings' | null
  const [activePopup, setActivePopup] = useState<FloatingPopupType>(null);

  useEffect(() => {
    onActivePopupChange?.(activePopup !== null);
  }, [activePopup, onActivePopupChange]);

  useEffect(() => {
    return () => {
      onActivePopupChange?.(false);
    };
  }, [onActivePopupChange]);

  // Popup coordinates within Grid
  const [popupTop, setPopupTop] = useState<number>(headerHeight + 8);
  const [popupMaxHeight, setPopupMaxHeight] = useState<number>(380);
  const [multiSortAnchorPos, setMultiSortAnchorPos] = useState<{ x: number; y: number } | null>(null);
  const [isDraggingToolbar, setIsDraggingToolbar] = useState(false);
  const [isHoverLinger, setIsHoverLinger] = useState(false);
  const hoverLingerTimerRef = useRef<number | null>(null);

  const clearHoverLingerTimer = useCallback(() => {
    if (hoverLingerTimerRef.current !== null) {
      window.clearTimeout(hoverLingerTimerRef.current);
      hoverLingerTimerRef.current = null;
    }
  }, []);

  const handleToolbarMouseEnter = useCallback(() => {
    clearHoverLingerTimer();
    setIsHoverLinger(true);
  }, [clearHoverLingerTimer]);

  const handleToolbarMouseLeave = useCallback(() => {
    clearHoverLingerTimer();
    hoverLingerTimerRef.current = window.setTimeout(() => {
      hoverLingerTimerRef.current = null;
      setIsHoverLinger(false);
    }, 5000);
  }, [clearHoverLingerTimer]);

  useEffect(() => {
    return () => {
      clearHoverLingerTimer();
    };
  }, [clearHoverLingerTimer]);

  const toolbarTopStorageKey = useMemo(
    () => (persistState ? getFloatingToolbarTopKey(gridId) : null),
    [persistState, gridId]
  );

  // Vertical Toolbar Top Position
  const [toolbarTop, setToolbarTop] = useState<number>(() => {
    const minAllowed = headerHeight + 4;
    if (persistState) {
      const saved = readGridStorageRaw(getFloatingToolbarTopKey(gridId));
      if (saved) {
        const val = parseInt(saved, 10);
        if (!isNaN(val) && val >= 64) return Math.max(minAllowed, val);
      }
    }
    return headerHeight + 16;
  });

  useEffect(() => {
    const minAllowed = headerHeight + 4;
    if (toolbarTopStorageKey) {
      const saved = readGridStorageRaw(toolbarTopStorageKey);
      if (saved) {
        const val = parseInt(saved, 10);
        if (!isNaN(val) && val >= 64) {
          setToolbarTop(Math.max(minAllowed, val));
          return;
        }
      }
    }
    setToolbarTop(headerHeight + 16);
  }, [toolbarTopStorageKey, headerHeight]);

  const isDraggingRef = useRef(false);
  const dragStartYRef = useRef(0);
  const dragInitialTopRef = useRef(toolbarTop);

  // Danh sách cột dữ liệu thông thường (loại trừ các cột hệ thống system, rowNumber, selection)
  const dataColumns = useMemo<ColumnDef<any>[]>(() => {
    return (columns || []).filter(
      (c: ColumnDef<any>) => c.dataType !== DATA_TYPES.SYSTEM && !c.isRowNumber && !c.isSelection
    );
  }, [columns]);

  // Đếm số lượng cột hiển thị trong Column Chooser (gom nhóm nguyên khối như 12 tháng thành 1 đơn vị đếm)
  const { totalChooserItemCount, visibleChooserItemCount } = useMemo(() => {
    const atomicGroups = (columnGroups || []).filter((g) => g.isAtomic);
    const allAtomicKeys = new Set(atomicGroups.flatMap((g) => g.keys));

    const nonAtomicDataCols = dataColumns.filter((c) => !allAtomicKeys.has(c.key));
    const nonAtomicVisibleCount = nonAtomicDataCols.filter((c) => visibleColKeys.includes(c.key)).length;

    let atomicVisibleCount = 0;
    atomicGroups.forEach((g) => {
      if (g.keys.some((k) => visibleColKeys.includes(k))) {
        atomicVisibleCount += 1;
      }
    });

    const total = nonAtomicDataCols.length + atomicGroups.length;
    const visible = nonAtomicVisibleCount + atomicVisibleCount;

    return {
      totalChooserItemCount: total,
      visibleChooserItemCount: visible,
    };
  }, [dataColumns, columnGroups, visibleColKeys]);

  // Close all popups
  const closeAllPopups = useCallback(() => {
    setActivePopup(null);
  }, []);

  // Compute safe top position & maxHeight for a popup to strictly fit within the Grid container & Viewport
  const computePopupGeometry = useCallback(
    (btnElement: HTMLElement, preferredHeight: number = 380) => {
      const gridEl = gridContainerRef.current;
      if (!gridEl) {
        return { top: headerHeight + 6, maxHeight: preferredHeight };
      }

      const gridRect = gridEl.getBoundingClientRect();
      const btnRect = btnElement.getBoundingClientRect();
      const btnTopInGrid = btnRect.top - gridRect.top;

      const minTop = headerHeight + 6;
      const bottomMargin = 16;

      // Giới hạn mép dưới: Không vượt quá đáy Grid và không vượt quá đáy Viewport trình duyệt
      const viewportMaxBottomInGrid = window.innerHeight - 16 - gridRect.top;
      const maxBottom = Math.max(
        minTop + 160,
        Math.min(gridRect.height - bottomMargin, viewportMaxBottomInGrid)
      );

      // Tổng chiều cao tối đa có thể hiển thị trong khung Grid từ minTop đến maxBottom
      const maxAvailableHeight = Math.max(160, maxBottom - minTop);
      const targetHeight = Math.min(preferredHeight, maxAvailableHeight);

      // Ưu tiên đặt ngang hàng nút toolbar
      let top = btnTopInGrid;
      // Nếu mép dưới popup bị tràn qua maxBottom thì đẩy ngược lên
      if (top + targetHeight > maxBottom) {
        top = maxBottom - targetHeight;
      }
      top = Math.max(minTop, top);

      // Chiều cao tối đa an toàn tuyệt đối tính từ vị trí top đến đáy giới hạn
      const safeMaxHeight = Math.max(160, maxBottom - top);

      return {
        top,
        maxHeight: safeMaxHeight,
      };
    },
    [gridContainerRef, headerHeight]
  );

  // Khi cửa sổ resize, tự động tính lại vị trí và maxHeight nếu popup đang mở
  useEffect(() => {
    if (!activePopup) return;
    const handleWindowResize = () => {
      const gridEl = gridContainerRef.current;
      if (!gridEl) return;
      const gridRect = gridEl.getBoundingClientRect();
      const minTop = headerHeight + 6;
      const bottomMargin = 16;
      const viewportMaxBottomInGrid = window.innerHeight - 16 - gridRect.top;
      const maxBottom = Math.max(
        minTop + 160,
        Math.min(gridRect.height - bottomMargin, viewportMaxBottomInGrid)
      );
      const safeMaxHeight = Math.max(160, maxBottom - popupTop);
      setPopupMaxHeight(safeMaxHeight);
      if (popupTop + safeMaxHeight > maxBottom) {
        setPopupTop(Math.max(minTop, maxBottom - safeMaxHeight));
      }
    };
    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, [activePopup, popupTop, headerHeight, gridContainerRef]);

  // Handle Dragging
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();

    isDraggingRef.current = true;
    setIsDraggingToolbar(true);
    dragStartYRef.current = e.clientY;
    dragInitialTopRef.current = toolbarTop;

    const gridEl = gridContainerRef.current;
    const toolbarEl = toolbarRef.current;
    if (!gridEl || !toolbarEl) return;

    const gridRect = gridEl.getBoundingClientRect();
    const toolbarHeight = toolbarEl.offsetHeight || 230;
    const minTop = headerHeight + 4;
    const maxTop = Math.max(minTop, gridRect.height - toolbarHeight - 12);

    let animId: number | null = null;

    const onPointerMove = (moveEv: PointerEvent) => {
      if (!isDraggingRef.current) return;
      const deltaY = moveEv.clientY - dragStartYRef.current;
      const rawTop = dragInitialTopRef.current + deltaY;
      const clamped = Math.max(minTop, Math.min(maxTop, rawTop));

      if (animId) cancelAnimationFrame(animId);
      animId = requestAnimationFrame(() => {
        if (toolbarEl) {
          toolbarEl.style.top = `${clamped}px`;
        }
      });
    };

    const onPointerUp = (upEv: PointerEvent) => {
      if (animId) cancelAnimationFrame(animId);
      isDraggingRef.current = false;
      setIsDraggingToolbar(false);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);

      const deltaY = upEv.clientY - dragStartYRef.current;
      const rawTop = dragInitialTopRef.current + deltaY;
      const clamped = Math.max(minTop, Math.min(maxTop, rawTop));
      setToolbarTop(clamped);

      if (toolbarTopStorageKey) {
        writeGridStorageRaw(toolbarTopStorageKey, String(clamped));
      }
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  // Đóng popup nếu tính năng tương ứng vừa bị tắt từ props
  useEffect(() => {
    if (
      (activePopup === TOOLBAR_POPUPS.SEARCH && !enableQuickSearch) ||
      (activePopup === TOOLBAR_POPUPS.QUERY_BUILDER && !enableQueryBuilder) ||
      (activePopup === TOOLBAR_POPUPS.MULTI_SORT && !enableMultiSort) ||
      (activePopup === TOOLBAR_POPUPS.COLUMN_CHOOSER && !enableColumnChooser)
    ) {
      setActivePopup(null);
    }
  }, [
    activePopup,
    enableQuickSearch,
    enableQueryBuilder,
    enableMultiSort,
    enableColumnChooser,
  ]);

  // Keyboard Shortcuts (Alt+Shift+F for Fullscreen, Ctrl+F / Alt+F for Quick Search, ESC to close popups/fullscreen)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Phím tắt Alt + Shift + F: Kích hoạt mở rộng / thu nhỏ toàn màn hình (Fullscreen toggle)
      if (enableFullscreen && e.altKey && e.shiftKey && (e.key === 'f' || e.key === 'F')) {
        e.preventDefault();
        onToggleFullscreen();
        return;
      }

      // 2. Phím tắt Ctrl+F / Cmd+F / Alt+F: Tìm kiếm nhanh (Quick Search)
      if (
        enableQuickSearch &&
        (e.ctrlKey || e.metaKey || (e.altKey && !e.shiftKey)) &&
        (e.key === 'f' || e.key === 'F')
      ) {
        e.preventDefault();
        setActivePopup((prev) => {
          const next = prev === TOOLBAR_POPUPS.SEARCH ? null : TOOLBAR_POPUPS.SEARCH;
          if (next === TOOLBAR_POPUPS.SEARCH) {
            setTimeout(() => {
              searchInputRef.current?.focus();
              searchInputRef.current?.select();
            }, 50);
          }
          return next;
        });
      } else if (e.key === 'Escape') {
        if (activePopup) {
          e.preventDefault();
          closeAllPopups();
        } else if (enableFullscreen && isFullscreen && !document.querySelector(POPUP_SELECTORS)) {
          e.preventDefault();
          onToggleFullscreen();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    activePopup,
    closeAllPopups,
    isFullscreen,
    onToggleFullscreen,
    enableFullscreen,
    enableQuickSearch,
  ]);

  // Click outside listener tự động đóng popup toolbar khi nhấp chuột ra ngoài (loại trừ các nút toolbar để nút tự toggle luân chuyển)
  useEffect(() => {
    if (!activePopup) return;
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (toolbarRef.current && toolbarRef.current.contains(target)) return;
      if (target.closest?.('.agv-float-toolbar-btn')) return;
      if (target.closest?.('[data-agv-popup="true"]') || target.closest?.('.agv-floating-popup')) return;
      closeAllPopups();
    };
    document.addEventListener('mousedown', handleClickOutside, true);
    document.addEventListener('touchstart', handleClickOutside, true);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
      document.removeEventListener('touchstart', handleClickOutside, true);
    };
  }, [activePopup, closeAllPopups]);

  // Active rules count for badge
  const activeRuleCount = countActiveQueryRules(appliedQueryTree);
  const hasQueryRules = hasActiveQueryRules(appliedQueryTree);

  const hasActivePopup = activePopup !== null;
  const isExpanded = hasActivePopup || isHoverLinger || isDraggingToolbar;

  const hasGroupPopups =
    enableQuickSearch || enableQueryBuilder || enableMultiSort || enableColumnChooser;
  const hasGroupFullscreen = enableFullscreen;

  if (!hasGroupPopups && !hasGroupFullscreen) {
    return null;
  }

  return (
    <>
      {/* 1. Backdrop Overlay when any popup is active: bounded within Grid container */}
      {hasActivePopup && (
        <div
          data-testid="agv-grid-backdrop"
          className="agv-grid-backdrop absolute inset-0 z-[1150]"
          onClick={(e) => {
            e.stopPropagation();
            closeAllPopups();
          }}
        />
      )}

      {/* 2. Floating Toolbar Left-Docked */}
      <div
        ref={toolbarRef}
        data-testid="agv-floating-toolbar"
        onMouseEnter={handleToolbarMouseEnter}
        onMouseLeave={handleToolbarMouseLeave}
        style={{
          position: 'absolute',
          top: `${toolbarTop}px`,
          left: 0,
        }}
        className={`agv-floating-toolbar select-none z-[1200] ${
          isExpanded ? 'is-expanded' : ''
        } ${isDraggingToolbar ? 'is-dragging' : ''}`}
      >
        {/* Grip Handle */}
        <div
          onPointerDown={handlePointerDown}
          className="agv-float-toolbar-handle cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="h-3.5 w-3.5 rotate-90 text-[var(--agv-text-subtle)] hover:text-[var(--agv-text-main)]" />
        </div>

        <div className="agv-float-toolbar-divider" />

        {/* 1. Nút Tìm kiếm nhanh (Quick Filter) */}
        {enableQuickSearch && (
          <div className="agv-floating-search-wrap relative flex items-center">
            <button
              type="button"
              data-testid="agv-floating-search-btn"
              onMouseEnter={() => {
                void import('../../floating/AdvQuickFilterFlyout');
              }}
              onClick={(e) => {
                const next = activePopup === TOOLBAR_POPUPS.SEARCH ? null : TOOLBAR_POPUPS.SEARCH;
                setActivePopup(next);
                if (next === TOOLBAR_POPUPS.SEARCH) {
                  const geo = computePopupGeometry(e.currentTarget, 38);
                  setPopupTop(geo.top);
                  setPopupMaxHeight(geo.maxHeight);
                  setTimeout(() => {
                    searchInputRef.current?.focus();
                    searchInputRef.current?.select();
                  }, 50);
                }
              }}
              className={`agv-float-toolbar-btn agv-floating-toolbar-btn-search ${
                activePopup === TOOLBAR_POPUPS.SEARCH ? 'is-active' : ''
              }`}
            >
              <Search className="h-4 w-4" />
              {Boolean(quickFilterText) && <span className="agv-float-dot-badge" />}
            </button>

            {/* Popup 1: Quick Filter Flyout */}
            {activePopup === TOOLBAR_POPUPS.SEARCH && (
              <React.Suspense fallback={null}>
                <LazyAdvQuickFilterFlyout
                  quickFilterText={quickFilterText}
                  isQuickFilterSmart={isQuickFilterSmart}
                  onToggleSmart={onToggleQuickFilterSmart}
                  onCommitFilter={onQuickFilterChange}
                  onClose={closeAllPopups}
                  inputRef={searchInputRef}
                />
              </React.Suspense>
            )}
          </div>
        )}

        {/* 2. Nút Bộ lọc nâng cao (Query Builder) */}
        {enableQueryBuilder && (
          <button
            type="button"
            data-testid="agv-floating-query-builder-btn"
            onClick={(e) => {
              if (activePopup === TOOLBAR_POPUPS.QUERY_BUILDER) {
                closeAllPopups();
              } else {
                const geo = computePopupGeometry(e.currentTarget, 420);
                setPopupTop(geo.top);
                setPopupMaxHeight(geo.maxHeight);
                setActivePopup(TOOLBAR_POPUPS.QUERY_BUILDER);
              }
            }}
            className={`agv-float-toolbar-btn agv-query-builder-btn relative ${
              activePopup === TOOLBAR_POPUPS.QUERY_BUILDER ? 'is-active' : ''
            }`}
          >
            <GitBranch className="h-4 w-4" />
            {hasQueryRules && (
              <span className="agv-float-count-badge">{activeRuleCount}</span>
            )}
          </button>
        )}

        {/* 3. Nút Sắp xếp phân cấp (Multi-Sort) */}
        {enableMultiSort && onApplySortRules && (
          <button
            type="button"
            data-testid="agv-floating-multi-sort-btn"
            onMouseEnter={() => {
              void import('../../AdvMultiSortPopup');
            }}
            onClick={(e) => {
              if (activePopup === TOOLBAR_POPUPS.MULTI_SORT) {
                closeAllPopups();
              } else {
                const rect = e.currentTarget.getBoundingClientRect();
                setMultiSortAnchorPos({ x: rect.right + 8, y: rect.top - 6 });
                setActivePopup(TOOLBAR_POPUPS.MULTI_SORT);
              }
            }}
            className={`agv-float-toolbar-btn agv-multi-sort-btn relative ${
              activePopup === TOOLBAR_POPUPS.MULTI_SORT ? 'is-active' : ''
            }`}
          >
            <ArrowUpDown className="h-4 w-4" />
            {sortRules.length > 0 && (
              <span className="agv-float-count-badge">{sortRules.length}</span>
            )}
          </button>
        )}

        {/* 4. Nút Tùy chọn cột (Column Chooser) */}
        {enableColumnChooser && (
          <button
            type="button"
            data-testid="agv-floating-chooser-btn"
            onClick={(e) => {
              if (activePopup === TOOLBAR_POPUPS.COLUMN_CHOOSER) {
                closeAllPopups();
              } else {
                const geo = computePopupGeometry(e.currentTarget, 380);
                setPopupTop(geo.top);
                setPopupMaxHeight(geo.maxHeight);
                setActivePopup(TOOLBAR_POPUPS.COLUMN_CHOOSER);
              }
            }}
            className={`agv-float-toolbar-btn agv-chooser-btn relative ${
              activePopup === TOOLBAR_POPUPS.COLUMN_CHOOSER ? 'is-active' : ''
            }`}
          >
            <Columns className="h-4 w-4" />
            <span className="agv-float-count-badge">
              {visibleChooserItemCount}
            </span>
          </button>
        )}

        {/* Phân tách nhóm nút có popup và nhóm hành động trực tiếp */}
        {hasGroupPopups && hasGroupFullscreen && (
          <div className="agv-float-toolbar-divider" />
        )}

        {/* Nút Toàn màn hình (Fullscreen) */}
        {hasGroupFullscreen && (
          <button
            type="button"
            data-testid="agv-floating-fullscreen-btn"
            onClick={onToggleFullscreen}
            className={`agv-float-toolbar-btn ${isFullscreen ? 'is-active' : ''}`}
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </button>
        )}
      </div>

      {/* Popup 2: Query Builder Modal (bounded inside Grid, Lazy Loaded) */}
      {enableQueryBuilder && activePopup === TOOLBAR_POPUPS.QUERY_BUILDER && (
        <React.Suspense fallback={null}>
          <AdvGridQueryBuilderModal
            isOpen={true}
            onClose={closeAllPopups}
            gridId={gridId}
            columns={dataColumns}
            appliedTree={appliedQueryTree}
            onApply={onApplyQueryTree}
            totalFilteredRows={totalFilteredRows}
            totalRowCount={totalRowCount}
            surfaceTheme={surfaceTheme}
            data={data}
            getCellValue={getCellValue}
            hasColumnEmptyCells={hasColumnEmptyCells}
            getColumnDateBounds={getColumnDateBounds}
            style={{
              top: `${popupTop}px`,
              maxHeight: `${popupMaxHeight}px`,
              left: '46px',
            }}
          />
        </React.Suspense>
      )}

      {/* Popup: Multi-Sort (Sắp xếp phân cấp nhiều cột) */}
      {enableMultiSort && onApplySortRules && activePopup === TOOLBAR_POPUPS.MULTI_SORT && (
        <React.Suspense fallback={null}>
          <LazyAdvMultiSortPopup
            isOpen={true}
            onClose={closeAllPopups}
            anchorPos={multiSortAnchorPos}
            columns={columns}
            sortRules={sortRules}
            onApply={onApplySortRules}
            surfaceTheme={surfaceTheme}
          />
        </React.Suspense>
      )}

      {/* Popup 3: Column Chooser Modal (bounded inside Grid, Lazy Loaded) */}
      {enableColumnChooser && activePopup === TOOLBAR_POPUPS.COLUMN_CHOOSER && (
        <React.Suspense fallback={null}>
          <AdvColumnChooserModal
            columns={dataColumns}
            columnGroups={columnGroups}
            visibleColKeys={visibleColKeys}
            onVisibleColKeysChange={onVisibleColKeysChange}
            columnPins={columnPins}
            onColumnPinChange={enableColumnPinning ? onColumnPinChange : undefined}
            onResetColumns={onResetColumns}
            onAutoFitColumn={onAutoFitColumn}
            onReorderColumns={enableColumnReorder ? onReorderColumns : undefined}
            enableColumnHide={enableColumnHide}
            onClose={closeAllPopups}
            surfaceTheme={surfaceTheme}
            style={{
              position: 'absolute',
              top: `${popupTop}px`,
              maxHeight: `${popupMaxHeight}px`,
              left: '46px',
              zIndex: 1250,
            }}
          />
        </React.Suspense>
      )}
    </>
  );
});
