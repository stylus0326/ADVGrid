import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import { createPortal } from 'react-dom';
import { GripVertical, X } from 'lucide-react';
import { MorphSortIcon } from '../ui/MorphIcons';
import {
  ColumnDef,
  DATA_TYPES,
  SORT_DIRECTIONS,
  SortConfig,
  SortDirection,
  SURFACE_THEMES,
  SurfaceTheme,
} from './types';
import { AdvSelect } from '../ui/AdvSelect';
import { AdvOverlayScroll } from '../ui/AdvOverlayScroll';
import { getPortalThemeVars, getThemeClass } from '../ui/enterpriseEditorUtils';
import { normalizeSortRules, reorderSortRules } from './multiSortUtils';
import { AdvButton } from '../ui/AdvButton';
import {
  BUTTON_FOCUS_VISIBLE_CLASS,
} from '../ui/controlFocus';

export interface AdvMultiSortPopupProps {
  isOpen: boolean;
  onClose: () => void;
  anchorPos: { x: number; y: number } | null;
  initialColumnKey?: string | null;
  columns: ColumnDef<any>[];
  sortRules: SortConfig[];
  onApply: (rules: SortConfig[]) => void;
  surfaceTheme?: SurfaceTheme;
  embedded?: boolean;
}

/**
 * Popup cấu hình sắp xếp phân cấp nhiều cột (mở từ thanh công cụ nổi).
 * Mọi thay đổi đều được áp dụng tức thì lên Grid.
 */
export const AdvMultiSortPopup: React.FC<AdvMultiSortPopupProps> = ({
  isOpen,
  onClose,
  anchorPos,
  initialColumnKey,
  columns,
  sortRules,
  onApply,
  surfaceTheme = SURFACE_THEMES.LIGHT,
  embedded = false,
}) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const listScrollRef = useRef<HTMLDivElement>(null);
  const rowRefsMap = useRef<Map<string, HTMLDivElement>>(new Map());
  const onApplyRef = useRef(onApply);
  onApplyRef.current = onApply;

  const sortableColumns = useMemo(
    () =>
      columns.filter(
        (c) =>
          c.dataType !== DATA_TYPES.SYSTEM &&
          !c.isRowNumber &&
          !c.isSelection &&
          !c.isChart &&
          c.sortable !== false
      ),
    [columns]
  );

  const sortableKeySet = useMemo(
    () => new Set(sortableColumns.map((c) => c.key)),
    [sortableColumns]
  );

  const [rules, setRules] = useState<SortConfig[]>([]);
  const prevIsOpenRef = useRef(false);

  // Smooth Pointer Drag state (cơ chế tương đồng AdvColumnChooserModal)
  const [sortDrag, setSortDrag] = useState<{
    key: string;
    fromIdx: number;
    toIdx: number;
    offsetY: number;
  } | null>(null);
  const sortDragRef = useRef<{
    key: string;
    fromIdx: number;
    toIdx: number;
    startY: number;
    itemHeight: number;
    itemCount: number;
    scrollEl: HTMLElement | null;
    lastOffsetY: number;
  } | null>(null);
  const dragCleanupRef = useRef<(() => void) | null>(null);

  // FLIP settle sau khi thả chuột để tránh nhảy khung sibling và trượt mượt vào khe đích
  const dropSettleRef = useRef<{
    movedKey: string;
    residualY: number;
  } | null>(null);
  const [settleTick, setSettleTick] = useState(0);
  const settleRafRef = useRef<number | null>(null);
  const settleTimeoutRef = useRef<number | null>(null);

  const clearSettleTimers = useCallback(() => {
    if (settleRafRef.current !== null) {
      cancelAnimationFrame(settleRafRef.current);
      settleRafRef.current = null;
    }
    if (settleTimeoutRef.current !== null) {
      window.clearTimeout(settleTimeoutRef.current);
      settleTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!isOpen) {
      prevIsOpenRef.current = false;
      dragCleanupRef.current?.();
      dragCleanupRef.current = null;
      sortDragRef.current = null;
      setSortDrag(null);
      dropSettleRef.current = null;
      clearSettleTimers();
      return;
    }

    if (prevIsOpenRef.current) return;
    prevIsOpenRef.current = true;

    const normalized = normalizeSortRules(sortRules).filter((r) => sortableKeySet.has(r.key));
    if (normalized.length > 0) {
      setRules(normalized);
    } else if (initialColumnKey && sortableKeySet.has(initialColumnKey)) {
      const initialRule: SortConfig[] = [{ key: initialColumnKey, direction: SORT_DIRECTIONS.ASC }];
      setRules(initialRule);
      onApplyRef.current(initialRule);
    } else {
      setRules([]);
    }
    setSortDrag(null);
  }, [isOpen, sortRules, initialColumnKey, sortableKeySet, clearSettleTimers]);

  useEffect(() => {
    return () => {
      dragCleanupRef.current?.();
      dragCleanupRef.current = null;
      clearSettleTimers();
    };
  }, [clearSettleTimers]);

  useLayoutEffect(() => {
    const settle = dropSettleRef.current;
    if (!settle) return;
    dropSettleRef.current = null;
    clearSettleTimers();

    const rowEls = Array.from(rowRefsMap.current.entries());
    const movedEl = rowRefsMap.current.get(settle.movedKey);

    for (const [k, el] of rowEls) {
      if (k === settle.movedKey) continue;
      el.style.transition = 'none';
      el.style.transform = '';
      el.style.zIndex = '';
    }

    if (movedEl && Math.abs(settle.residualY) > 0.5) {
      movedEl.style.transition = 'none';
      movedEl.style.transform = `translateY(${settle.residualY}px)`;
      movedEl.style.zIndex = '40';
    }

    void listScrollRef.current?.offsetHeight;

    settleRafRef.current = requestAnimationFrame(() => {
      settleRafRef.current = null;
      for (const [k, el] of rowRefsMap.current.entries()) {
        if (k === settle.movedKey) continue;
        el.style.transition = '';
      }
      if (movedEl && Math.abs(settle.residualY) > 0.5) {
        movedEl.style.transition = 'transform 0.2s cubic-bezier(0.2, 0, 0, 1)';
        movedEl.style.transform = 'translateY(0px)';
      }
    });

    settleTimeoutRef.current = window.setTimeout(() => {
      settleTimeoutRef.current = null;
      if (movedEl) {
        movedEl.style.transition = '';
        movedEl.style.transform = '';
        movedEl.style.zIndex = '';
      }
    }, 220);
  }, [rules, settleTick, clearSettleTimers]);

  useEffect(() => {
    if (!isOpen || embedded) return;
    const handleCloseAll = (e: Event) => {
      const ce = e as CustomEvent;
      if (ce.detail?.except !== 'multi-sort') {
        onClose();
      }
    };
    window.addEventListener('agv-close-all-popups', handleCloseAll);
    return () => {
      window.removeEventListener('agv-close-all-popups', handleCloseAll);
    };
  }, [isOpen, onClose, embedded]);

  useEffect(() => {
    if (!isOpen || embedded) return;

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (sortDragRef.current) return;
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (popupRef.current && popupRef.current.contains(target)) return;
      if (target.closest?.('.agv-select-portal, .agv-portal-dropdown, .agv-float-toolbar-btn')) return;
      onClose();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside, true);
    document.addEventListener('touchstart', handleClickOutside, true);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
      document.removeEventListener('touchstart', handleClickOutside, true);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, embedded]);

  const usedKeys = useMemo(() => new Set(rules.map((r) => r.key)), [rules]);

  const unusedColumns = useMemo(
    () => sortableColumns.filter((c) => !usedKeys.has(c.key)),
    [sortableColumns, usedKeys]
  );

  const popupWidth = 440;

  const popupCoords = useMemo(() => {
    if (!isOpen || !anchorPos) {
      return { left: 8, top: 8, maxListHeight: 260 };
    }
    const initialCount = Math.max(1, sortRules.length || (initialColumnKey ? 1 : 0));
    const estimatedHeight = Math.max(128, Math.min(420, 88 + initialCount * 40));
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1280;
    const vh = typeof window !== 'undefined' ? window.innerHeight : 800;

    let left = Math.round(anchorPos.x);
    if (left + popupWidth > vw - 8) {
      left = Math.max(8, vw - popupWidth - 8);
    }
    if (left < 8) left = 8;

    let top = Math.round(anchorPos.y + 6);
    if (top + estimatedHeight > vh - 8) {
      top = Math.max(8, vh - estimatedHeight - 8);
    }
    if (top < 8) top = 8;

    const maxListHeight = Math.min(260, Math.max(116, vh - top - 88));
    return { left, top, maxListHeight };
    // Giữ tọa độ neo ổn định trong suốt phiên mở popup tránh nhảy khung khi thêm/bớt dòng
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, anchorPos?.x, anchorPos?.y]);

  const applyRules = useCallback(
    (nextRules: SortConfig[]) => {
      setRules(nextRules);
      onApply(nextRules);
    },
    [onApply]
  );

  if (!isOpen || (!embedded && (!anchorPos || typeof document === 'undefined'))) {
    return null;
  }

  const themeClass = getThemeClass(surfaceTheme);
  const themeVars = getPortalThemeVars(surfaceTheme);

  const handleChangeRuleColumn = (index: number, nextKey: string) => {
    const next = rules.map((rule, idx) => (idx === index ? { ...rule, key: nextKey } : rule));
    applyRules(next);
  };

  const handleChangeRuleDirection = (index: number, nextDir: SortDirection) => {
    const next = rules.map((rule, idx) =>
      idx === index ? { ...rule, direction: nextDir } : rule
    );
    applyRules(next);
  };

  const handleRemoveRule = (index: number) => {
    const next = rules.filter((_, idx) => idx !== index);
    applyRules(next);
  };

  const handleAddRule = (colKey: string) => {
    if (!colKey || usedKeys.has(colKey)) return;
    const next = [...rules, { key: colKey, direction: SORT_DIRECTIONS.ASC }];
    applyRules(next);
  };

  const handleClearAll = () => {
    if (rules.length === 0) return;
    applyRules([]);
  };

  const canDrag = rules.length > 1;

  const popupBody = (
    <div
      ref={popupRef}
      data-agv-popup="true"
      onClick={(e) => e.stopPropagation()}
      onContextMenu={(e) => e.preventDefault()}
      className={
        embedded
          ? 'select-none'
          : 'agv-multi-sort-popup agv-popup-panel pointer-events-auto fixed rounded-md border p-3 select-none agv-spring-zoom'
      }
      style={
        embedded
          ? {
              width: `min(${popupWidth}px, calc(100vw - 48px))`,
              color: 'var(--agv-text-main)',
            }
          : {
              left: `${popupCoords.left}px`,
              top: `${popupCoords.top}px`,
              width: `min(${popupWidth}px, calc(100vw - 16px))`,
              backgroundColor: 'var(--popup-background)',
              borderColor: 'var(--popup-border)',
              color: 'var(--agv-text-main)',
              boxShadow: 'var(--popup-shadow)',
            }
      }
    >
        {/* Danh sách các cấp sắp xếp */}
        {rules.length === 0 ? (
          <div
            className="py-4 text-center text-xs"
            style={{ color: 'var(--agv-text-muted)' }}
          >
            Chưa có quy tắc sắp xếp nào
          </div>
        ) : (
          <AdvOverlayScroll
            viewportRef={listScrollRef}
            viewportClassName="agv-multisort-scroll overflow-y-auto overflow-x-hidden pr-0 space-y-1.5 overscroll-contain"
            viewportStyle={{
              maxHeight: `${popupCoords.maxListHeight}px`,
            }}
            contentSignature={rules.length}
          >
            {rules.map((rule, index) => {
              const isDragging = sortDrag?.key === rule.key;
              const isAsc = rule.direction === SORT_DIRECTIONS.ASC;
              const columnOptions = sortableColumns.map((col) => ({
                value: col.key,
                label: col.title || col.key,
                disabled: rules.some((r, idx) => idx !== index && r.key === col.key),
              }));

              let translateY = 0;
              if (sortDrag && !isDragging) {
                const { fromIdx, toIdx } = sortDrag;
                const itemH = sortDragRef.current?.itemHeight || 38;
                if (fromIdx < toIdx && index > fromIdx && index <= toIdx) {
                  translateY = -itemH;
                } else if (fromIdx > toIdx && index >= toIdx && index < fromIdx) {
                  translateY = itemH;
                }
              }

              return (
                <div
                  key={rule.key}
                  ref={(el) => {
                    if (el) {
                      rowRefsMap.current.set(rule.key, el);
                    } else {
                      rowRefsMap.current.delete(rule.key);
                    }
                  }}
                  style={{
                    transform: isDragging
                      ? `translateY(${sortDrag.offsetY}px)`
                      : translateY
                      ? `translateY(${translateY}px)`
                      : undefined,
                    transition: isDragging
                      ? 'none'
                      : 'transform 0.2s cubic-bezier(0.2, 0, 0, 1), box-shadow 0.2s ease',
                    zIndex: isDragging ? 50 : translateY ? 10 : 1,
                    position: 'relative',
                  }}
                  className={`agv-multisort-item flex items-center gap-2 rounded-md px-1.5 py-0.5 select-none ${
                    canDrag ? 'cursor-grab active:cursor-grabbing touch-none' : ''
                  } ${
                    isDragging
                      ? 'is-dragging bg-[var(--agv-bg-control)] shadow-lg scale-[1.01]'
                      : 'hover:bg-[var(--agv-bg-item-hover)]'
                  }`}
                  onPointerDown={
                    canDrag
                      ? (e) => {
                          if (e.button !== 0) return;
                          const target = e.target as HTMLElement;
                          if (target.closest('button, input, select, textarea, [data-no-drag="true"]')) {
                            return;
                          }

                          const itemEl = e.currentTarget as HTMLElement;
                          const scrollEl = itemEl.closest('.agv-multisort-scroll') as HTMLElement;
                          const siblings = itemEl.parentElement
                            ? (Array.from(itemEl.parentElement.children) as HTMLElement[])
                            : [];
                          let itemHeight = itemEl.offsetHeight + 6;
                          if (siblings.length > 1) {
                            const nextEl = siblings[index + 1];
                            const prevEl = siblings[index - 1];
                            if (nextEl) {
                              itemHeight = nextEl.offsetTop - itemEl.offsetTop;
                            } else if (prevEl) {
                              itemHeight = itemEl.offsetTop - prevEl.offsetTop;
                            }
                          }

                          const startY = e.clientY;
                          const fromIdx = index;
                          const ruleKey = rule.key;
                          const currentRulesSnapshot = rules;
                          const totalCount = currentRulesSnapshot.length;
                          let isDraggingStarted = false;

                          const onPointerMove = (ev: PointerEvent) => {
                            const deltaY = ev.clientY - startY;
                            if (!isDraggingStarted) {
                              if (Math.abs(deltaY) > 3) {
                                isDraggingStarted = true;
                                clearSettleTimers();
                                dropSettleRef.current = null;
                                sortDragRef.current = {
                                  key: ruleKey,
                                  fromIdx,
                                  toIdx: fromIdx,
                                  startY,
                                  itemHeight,
                                  itemCount: totalCount,
                                  scrollEl,
                                  lastOffsetY: deltaY,
                                };
                                document.body.style.cursor = 'grabbing';
                                document.body.style.userSelect = 'none';
                                setSortDrag({
                                  key: ruleKey,
                                  fromIdx,
                                  toIdx: fromIdx,
                                  offsetY: deltaY,
                                });
                              } else {
                                return;
                              }
                            }

                            const dragState = sortDragRef.current;
                            if (!dragState) return;
                            const currentDeltaY = ev.clientY - dragState.startY;
                            const offsetIdx = Math.round(currentDeltaY / dragState.itemHeight);
                            const newToIdx = Math.max(
                              0,
                              Math.min(dragState.itemCount - 1, dragState.fromIdx + offsetIdx)
                            );
                            dragState.toIdx = newToIdx;
                            dragState.lastOffsetY = currentDeltaY;

                            setSortDrag({
                              key: dragState.key,
                              fromIdx: dragState.fromIdx,
                              toIdx: newToIdx,
                              offsetY: currentDeltaY,
                            });

                            if (dragState.scrollEl) {
                              const rect = dragState.scrollEl.getBoundingClientRect();
                              if (ev.clientY < rect.top + 25) {
                                dragState.scrollEl.scrollTop -= 5;
                              } else if (ev.clientY > rect.bottom - 25) {
                                dragState.scrollEl.scrollTop += 5;
                              }
                            }
                          };

                          const cleanupListeners = () => {
                            window.removeEventListener('pointermove', onPointerMove);
                            window.removeEventListener('pointerup', onPointerUp);
                            window.removeEventListener('pointercancel', onPointerUp);
                            document.body.style.cursor = '';
                            document.body.style.userSelect = '';
                            if (dragCleanupRef.current === cleanupListeners) {
                              dragCleanupRef.current = null;
                            }
                          };

                          const onPointerUp = () => {
                            cleanupListeners();
                            if (!isDraggingStarted) return;

                            const dragState = sortDragRef.current;
                            sortDragRef.current = null;
                            setSortDrag(null);

                            if (!dragState) return;
                            const residualY =
                              dragState.lastOffsetY -
                              (dragState.toIdx - dragState.fromIdx) * dragState.itemHeight;
                            dropSettleRef.current = {
                              movedKey: dragState.key,
                              residualY,
                            };

                            if (dragState.fromIdx !== dragState.toIdx) {
                              const reordered = reorderSortRules(
                                currentRulesSnapshot,
                                dragState.fromIdx,
                                dragState.toIdx
                              );
                              applyRules(reordered);
                            } else {
                              setSettleTick((t) => t + 1);
                            }
                          };

                          dragCleanupRef.current?.();
                          dragCleanupRef.current = cleanupListeners;
                          window.addEventListener('pointermove', onPointerMove);
                          window.addEventListener('pointerup', onPointerUp);
                          window.addEventListener('pointercancel', onPointerUp);
                        }
                      : undefined
                  }
                >
                  <span
                    className={`inline-flex items-center justify-center shrink-0 ${
                      canDrag ? '' : 'opacity-40'
                    }`}
                    style={{ color: 'var(--agv-text-muted)' }}
                  >
                    <GripVertical size={14} strokeWidth={2} />
                  </span>

                  <span
                    className="w-[84px] shrink-0 text-xs font-medium whitespace-nowrap"
                    style={{ color: 'var(--agv-text-muted)' }}
                  >
                    {index === 0 ? 'Sắp xếp theo' : 'Sau đó theo'}
                  </span>

                  <div className="flex-1 min-w-[140px]">
                    <AdvSelect
                      value={rule.key}
                      onChange={(val) => handleChangeRuleColumn(index, val)}
                      options={columnOptions}
                      theme={surfaceTheme}
                      size="sm"
                      width="100%"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      handleChangeRuleDirection(
                        index,
                        isAsc ? SORT_DIRECTIONS.DESC : SORT_DIRECTIONS.ASC
                      )
                    }
                    aria-label={isAsc ? 'Sắp xếp tăng dần' : 'Sắp xếp giảm dần'}
                    className={`min-h-[28px] min-w-[28px] h-7 w-7 inline-flex items-center justify-center rounded-md border transition cursor-pointer shrink-0 ${BUTTON_FOCUS_VISIBLE_CLASS}`}
                    style={{
                      backgroundColor: 'var(--agv-accent)',
                      borderColor: 'var(--agv-accent)',
                      color: 'var(--agv-accent-text, #ffffff)',
                    }}
                  >
                    <MorphSortIcon direction={rule.direction} size={14} spring="snappy" />
                  </button>

                  <AdvButton
                    variant="destructive"
                    size="icon-sm"
                    onClick={() => handleRemoveRule(index)}
                  >
                    <X size={14} strokeWidth={2.2} />
                  </AdvButton>
                </div>
              );
            })}
          </AdvOverlayScroll>
        )}

        {/* Thanh chân popup */}
        <div
          className="border-t pt-2.5 mt-2.5 flex items-center justify-between gap-2"
          style={{ borderColor: 'var(--agv-border)' }}
        >
          <div className="flex-1 min-w-[165px]">
            <AdvSelect
              value=""
              onChange={handleAddRule}
              options={unusedColumns.map((col) => ({
                value: col.key,
                label: col.title || col.key,
              }))}
              placeholder="Chọn thêm cột sắp xếp..."
              disabled={unusedColumns.length === 0}
              theme={surfaceTheme}
              size="sm"
              width="100%"
            />
          </div>

          <AdvButton
            variant="destructive"
            size="sm"
            disabled={rules.length === 0}
            onClick={handleClearAll}
            className="shrink-0"
          >
            Xóa hết
          </AdvButton>
        </div>
      </div>
  );

  if (embedded) {
    return popupBody;
  }

  return createPortal(
    <div
      className={`fixed inset-0 pointer-events-none z-[1250] ${themeClass}`}
      style={themeVars}
    >
      {popupBody}
    </div>,
    document.body
  );
};
