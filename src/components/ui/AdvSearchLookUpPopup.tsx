import React, { useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check } from 'lucide-react';
import { MorphCheckbox } from './MorphCheckbox';
import { AdvOverlayScroll } from './AdvOverlayScroll';
import { AdvAnchoredPopover } from './AdvPopover';
import { useVirtualList } from './useVirtualList';
import {
  getPortalThemeVars,
  EditorCoords,
  scrollDropdownItemIntoView,
} from './enterpriseEditorUtils';
import { FilterOpIcon } from '../grid/FilterIcons';
import { FilterOperation, FILTER_OPS } from '../grid/types';
import { isNoInputFilterOp, getAlignTextClass } from '../grid/gridFormatUtils';
import { NO_AUTOFILL_PROPS, getGridControlRadiusClass } from '../grid/constants';
import {
  BUTTON_FOCUS_VISIBLE_CLASS,
  CONTROL_BOX_CLASS,
  POPUP_PANEL_CLASS,
} from './controlFocus';
import type {
  AdvLookUpColumn,
  LookUpColumnFilterState,
  LookUpFilterOp,
} from './AdvSearchLookUpEdit';

export interface AdvSearchLookUpPopupProps<T extends Record<string, any> = any> {
  theme: string;
  themeClass: string;
  coords: EditorCoords;
  multiSelect: boolean;
  columns: AdvLookUpColumn<T>[];
  hasAnySelection: boolean;
  isAllFilteredSelected: boolean;
  isFilterRowVisible: boolean;
  filterStates: Record<string, LookUpColumnFilterState>;
  filterOperators: { id: LookUpFilterOp; label: string }[];
  filteredData: T[];
  valueMember: keyof T | string;
  selectedKeysSet: Set<string>;
  isKeyboardNav: boolean;
  highlightedIndex: number;
  activeOpMenuCol: string | null;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  opMenuRef: React.RefObject<HTMLDivElement | null>;
  tableBodyRef: React.RefObject<HTMLDivElement | null>;
  theadRef: React.RefObject<HTMLTableSectionElement | null>;
  isKeyboardNavRef: React.MutableRefObject<boolean>;
  navSourceRef: React.MutableRefObject<'pointer' | 'keyboard' | 'init'>;
  setKeyboardNavActive: (active: boolean) => void;
  setActiveOpMenuCol: React.Dispatch<React.SetStateAction<string | null>>;
  handleListNavigationKeyDown: (e: React.KeyboardEvent) => void;
  handleClearMultiAll: (e: React.MouseEvent) => void;
  handleFilterRowChange: (key: string, val: string) => void;
  handleFilterOpChange: (key: string, op: LookUpFilterOp) => void;
  handleToggleMultiRow: (item: T, e?: React.MouseEvent) => void;
  handleSelectSingleRow: (item: T) => void;
}

const LOOKUP_ROW_HEIGHT = 32;

export function AdvSearchLookUpPopup<T extends Record<string, any> = any>({
  theme,
  themeClass,
  coords,
  multiSelect,
  columns,
  hasAnySelection,
  isAllFilteredSelected,
  isFilterRowVisible,
  filterStates,
  filterOperators,
  filteredData,
  valueMember,
  selectedKeysSet,
  isKeyboardNav,
  highlightedIndex,
  activeOpMenuCol,
  dropdownRef,
  opMenuRef,
  tableBodyRef,
  theadRef,
  isKeyboardNavRef,
  navSourceRef,
  setKeyboardNavActive,
  setActiveOpMenuCol,
  handleListNavigationKeyDown,
  handleClearMultiAll,
  handleFilterRowChange,
  handleFilterOpChange,
  handleToggleMultiRow,
  handleSelectSingleRow,
}: AdvSearchLookUpPopupProps<T>) {
  const [theadHeight, setTheadHeight] = useState(0);
  const opBtnRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useLayoutEffect(() => {
    const theadEl = theadRef.current;
    if (!theadEl) return;
    const syncHeaderH = () => {
      const h = theadEl.offsetHeight || 0;
      setTheadHeight((prev) => (prev === h ? prev : h));
    };
    syncHeaderH();
    if (typeof ResizeObserver === 'undefined') return;
    const obs = new ResizeObserver(syncHeaderH);
    obs.observe(theadEl);
    return () => obs.disconnect();
  }, [theadRef, isFilterRowVisible, columns.length]);

  const maxViewportHeight = Math.max(118, coords.maxHeight - 2);
  const virtual = useVirtualList({
    itemCount: filteredData.length,
    itemHeight: LOOKUP_ROW_HEIGHT,
    viewportRef: tableBodyRef,
    overscan: 6,
    threshold: 40,
    defaultViewportHeight: maxViewportHeight,
    topOffset: theadHeight,
  });

  useLayoutEffect(() => {
    if (navSourceRef.current === 'pointer') return;
    if (virtual.isVirtualized) {
      virtual.scrollToIndex(highlightedIndex, 0, 0);
      return;
    }
    const container = tableBodyRef.current;
    if (!container) return;
    const rowEl = container.querySelector<HTMLElement>(`tr[data-lookup-idx="${highlightedIndex}"]`);
    if (rowEl) {
      scrollDropdownItemIntoView(container, rowEl, theadHeight);
    }
  }, [
    highlightedIndex,
    filteredData.length,
    theadHeight,
    virtual.isVirtualized,
    virtual.scrollToIndex,
    tableBodyRef,
    navSourceRef,
  ]);

  const visibleRows = virtual.isVirtualized
    ? filteredData.slice(virtual.startIndex, virtual.endIndex)
    : filteredData;
  const startRowIndex = virtual.isVirtualized ? virtual.startIndex : 0;
  const totalColCount = columns.length + (multiSelect ? 1 : 0);

  return (
    <>
      {createPortal(
        <div
          ref={dropdownRef}
          data-theme={theme || undefined}
          style={{
            position: 'fixed',
            ...(coords.isFlipUp
              ? { bottom: `${coords.bottom}px`, top: 'auto' }
              : { top: `${coords.top}px`, bottom: 'auto' }),
            left: `${coords.left}px`,
            width: `${coords.width}px`,
            maxHeight: `${coords.maxHeight}px`,
            zIndex: 99999999,
            ...getPortalThemeVars(theme),
          }}
          className={`agv-searchlookupedit-dropdown ${POPUP_PANEL_CLASS} overflow-hidden flex flex-col text-xs ${
            coords.isFlipUp ? 'agv-spring-up' : 'agv-spring-down'
          } ${themeClass}`}
          data-agv-popup="true"
          tabIndex={-1}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            if (!e.defaultPrevented && !activeOpMenuCol) {
              handleListNavigationKeyDown(e);
            }
          }}
        >
          {/* Lưới dữ liệu nhiều cột kèm Filter Row */}
          <AdvOverlayScroll
            className="flex-initial min-h-0"
            viewportRef={tableBodyRef}
            onScroll={virtual.handleScroll}
            onViewportMouseMove={() => {
              if (isKeyboardNavRef.current) {
                navSourceRef.current = 'pointer';
                setKeyboardNavActive(false);
              }
            }}
            viewportClassName="overflow-auto bg-popover"
            viewportStyle={{ maxHeight: `${maxViewportHeight}px` }}
            scrollX={true}
            trackTopInset={theadHeight > 0 ? theadHeight + 2 : 2}
            contentSignature={`${filteredData.length}:${virtual.startIndex}:${virtual.endIndex}:${theadHeight}`}
          >
            <table className="w-full table-fixed text-left border-separate border-spacing-0">
              <colgroup>
                {multiSelect && <col style={{ width: 36 }} />}
                {columns.map((col) => (
                  <col
                    key={`col_${String(col.key)}`}
                    style={col.width ? { width: col.width } : undefined}
                  />
                ))}
              </colgroup>
              <thead ref={theadRef} className="bg-table-header sticky top-0 z-10 text-xs font-semibold text-foreground">
                {/* Hàng 1: Tiêu đề cột */}
                <tr>
                  {multiSelect && (
                    <th
                      style={{ width: 36 }}
                      className={`px-1 py-0.5 text-center select-none bg-table-header border-b border-r border-[var(--agv-border)] ${
                        hasAnySelection ? 'cursor-pointer' : 'cursor-default'
                      }`}
                      onClick={hasAnySelection ? handleClearMultiAll : (e) => e.stopPropagation()}
                    >
                      <MorphCheckbox
                        checked={isAllFilteredSelected}
                        indeterminate={!isAllFilteredSelected && hasAnySelection}
                        disabled={!hasAnySelection}
                        size={16}
                        className="pointer-events-none"
                      />
                    </th>
                  )}
                  {columns.map((col) => (
                    <th
                      key={String(col.key)}
                      style={{ width: col.width }}
                      className={`px-2.5 py-1.5 select-none bg-table-header border-b border-r last:border-r-0 border-[var(--agv-border)] ${getAlignTextClass(col.align)}`}
                    >
                      {col.title}
                    </th>
                  ))}
                </tr>

                {/* Hàng 2: Hàng lọc từng cột (Filter Row) */}
                {isFilterRowVisible && (
                  <tr className="bg-table-header">
                    {multiSelect && (
                      <th className="px-1 py-1 text-center bg-table-header border-b border-r border-[var(--agv-border)]" />
                    )}
                    {columns.map((col) => {
                      const colKeyStr = String(col.key);
                      const curColState = filterStates[colKeyStr] || { val: '', op: FILTER_OPS.CONTAINS };
                      const curOpDef =
                        filterOperators.find((o) => o.id === curColState.op) || filterOperators[0];
                      const isBlankOp = isNoInputFilterOp(curColState.op);

                      return (
                        <th
                          key={`filter_${colKeyStr}`}
                          className="p-1 font-normal bg-table-header border-b border-r last:border-r-0 border-[var(--agv-border)]"
                        >
                          <div className={`${CONTROL_BOX_CLASS} ${getGridControlRadiusClass()} flex h-7 min-h-[28px] items-center overflow-hidden`}>
                            {/* Nút bấm chọn Toán tử lọc */}
                            <button
                              ref={(el) => {
                                opBtnRefs.current[colKeyStr] = el;
                              }}
                              type="button"
                              data-agv-popover-trigger="true"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveOpMenuCol(activeOpMenuCol === colKeyStr ? null : colKeyStr);
                              }}
                              className={`flex h-full w-7 shrink-0 items-center justify-center border-r border-[var(--agv-border)] bg-table-header text-muted-foreground hover:bg-surface-hover hover:text-foreground cursor-pointer select-none transition-colors p-0 ${BUTTON_FOCUS_VISIBLE_CLASS}`}
                            >
                              <FilterOpIcon op={curColState.op as FilterOperation} size={13} />
                            </button>

                            {/* Ô input nhập điều kiện lọc */}
                            <div className="relative flex flex-1 items-center h-full">
                              <input
                                type="text"
                                value={isBlankOp ? `(${curOpDef.label})` : curColState.val}
                                disabled={isBlankOp}
                                onChange={(e) => handleFilterRowChange(colKeyStr, e.target.value)}
                                placeholder="Lọc..."
                                {...NO_AUTOFILL_PROPS}
                                className={`w-full h-full bg-transparent border-0 px-2 text-xs text-foreground placeholder:text-muted-foreground outline-none ${
                                  isBlankOp ? 'italic opacity-70 select-none cursor-not-allowed' : ''
                                }`}
                              />
                              {!isBlankOp && curColState.val && (
                                <button
                                  type="button"
                                  onClick={() => handleFilterRowChange(colKeyStr, '')}
                                  className="agv-inline-clear-ghost absolute right-1 text-xs select-none"
                                >
                                  ×
                                </button>
                              )}
                            </div>
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                )}
              </thead>
              <tbody className="select-none">
                {filteredData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length + (multiSelect ? 1 : 0)}
                      className="px-3 py-4 text-center text-xs text-muted-foreground border-b border-[var(--agv-border)]"
                    >
                      Không tìm thấy dữ liệu phù hợp
                    </td>
                  </tr>
                ) : (
                  <>
                    {virtual.isVirtualized && virtual.topSpacer > 0 && (
                      <tr aria-hidden="true" style={{ height: `${virtual.topSpacer}px` }}>
                        <td colSpan={totalColCount} className="p-0 border-0" />
                      </tr>
                    )}
                    {visibleRows.map((item, offset) => {
                      const idx = startRowIndex + offset;
                      const itemKeyStr = String(item[valueMember]);
                      const isSelected = selectedKeysSet.has(itemKeyStr);
                      const isHighlighted = isKeyboardNav && idx === highlightedIndex;

                      let rowClass = 'text-foreground hover:bg-surface-hover';
                      if (isSelected) {
                        rowClass = multiSelect
                          ? 'bg-surface-selected text-foreground font-medium'
                          : 'bg-[var(--popup-item-selected-bg)] text-[var(--popup-item-selected-fg)] font-medium';
                      } else if (isHighlighted) {
                        rowClass = 'bg-accent text-accent-foreground';
                      }

                      return (
                        <tr
                          key={itemKeyStr || idx}
                          data-lookup-idx={idx}
                          style={{ height: `${LOOKUP_ROW_HEIGHT}px` }}
                          onClick={(e) => {
                            if (multiSelect) {
                              handleToggleMultiRow(item, e);
                            } else {
                              handleSelectSingleRow(item);
                            }
                          }}
                          className={`cursor-pointer select-none h-8 ${rowClass}`}
                        >
                          {multiSelect && (
                            <td
                              className="h-8 px-1 py-0 text-center border-b border-r border-[var(--agv-border)]"
                              onClick={(e) => handleToggleMultiRow(item, e)}
                            >
                              <MorphCheckbox
                                checked={isSelected}
                                size={16}
                                className="pointer-events-none"
                              />
                            </td>
                          )}
                          {columns.map((col) => (
                            <td
                              key={String(col.key)}
                              className={`h-8 px-2.5 py-0 truncate border-b border-r last:border-r-0 border-[var(--agv-border)] ${col.className ? `${col.className} ` : ''}${getAlignTextClass(
                                col.align
                              )}`}
                            >
                              {String(item[col.key] ?? '')}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                    {virtual.isVirtualized && virtual.bottomSpacer > 0 && (
                      <tr aria-hidden="true" style={{ height: `${virtual.bottomSpacer}px` }}>
                        <td colSpan={totalColCount} className="p-0 border-0" />
                      </tr>
                    )}
                  </>
                )}
              </tbody>
            </table>
          </AdvOverlayScroll>
        </div>,
        document.body
      )}

      {/* 4. Popover Operator Menu (Tự đóng khi click outside / ESC) */}
      <AdvAnchoredPopover
        isOpen={Boolean(activeOpMenuCol && opBtnRefs.current[activeOpMenuCol])}
        anchorEl={activeOpMenuCol ? opBtnRefs.current[activeOpMenuCol] ?? null : null}
        onClose={() => setActiveOpMenuCol(null)}
        placement="bottom-start"
        showArrow={true}
        offset={10}
        width="auto"
        minWidth={165}
        paddingClassName="p-0"
        contentClassName="text-xs agv-lookup-op-menu"
        zIndex={100000000}
        theme={theme}
        ignoreClickOutsideSelectors=""
      >
        {activeOpMenuCol && (
          <div
            ref={opMenuRef}
            data-theme={theme || undefined}
            onMouseDown={(e) => e.stopPropagation()}
            className={`flex flex-col gap-0.5 rounded-md overflow-hidden p-1 text-xs min-w-[165px] ${themeClass}`}
          >
            {filterOperators.map((opItem) => {
              const curColState = filterStates[activeOpMenuCol] || { val: '', op: FILTER_OPS.CONTAINS };
              const isSelected = curColState.op === opItem.id;
              return (
                <div
                  key={opItem.id}
                  onClick={() => handleFilterOpChange(activeOpMenuCol, opItem.id)}
                  className={`agv-popup-item ${isSelected ? 'is-selected' : ''}`}
                >
                  <FilterOpIcon op={opItem.id as FilterOperation} size={14} className="shrink-0" />
                  <span className="flex-1 truncate">{opItem.label}</span>
                  {isSelected && <Check size={13} strokeWidth={2.5} className="shrink-0" />}
                </div>
              );
            })}
          </div>
        )}
      </AdvAnchoredPopover>
    </>
  );
}

export default AdvSearchLookUpPopup;
