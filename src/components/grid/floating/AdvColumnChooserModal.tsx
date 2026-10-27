import React, { useState, useRef, useMemo, useEffect } from 'react';
import {
  RotateCcw,
  X,
  Search,
  ChevronRight,
  ChevronDown,
  Layers,
} from 'lucide-react';
import { ColumnDef, BaseGroupDef, PinPosition, SurfaceTheme, DATA_TYPES } from '../types';
import { AdvCheckbox } from '../AdvCheckbox';
import { NO_AUTOFILL_PROPS } from '../constants';

export interface AdvColumnChooserModalProps<T = any> {
  columns: ColumnDef<any>[];
  columnGroups?: BaseGroupDef[];
  visibleColKeys: string[];
  onVisibleColKeysChange: (keys: string[]) => void;
  columnPins?: Record<string, PinPosition>;
  onColumnPinChange?: (colKey: string, pin: PinPosition) => void;
  onResetColumns: () => void;
  onAutoFitColumn?: (colKey: string) => void;
  onReorderColumns?: (sourceKey: string, targetKey: string) => void;
  onClose?: () => void;
  style?: React.CSSProperties;
  surfaceTheme?: SurfaceTheme;
}

export interface ColumnTreeNode {
  key?: string;
  title: string;
  children?: ColumnTreeNode[];
  dataType?: string;
  defaultWidth?: number;
  isAtomicGroup?: boolean;
  atomicKeys?: string[];
}

export const AdvColumnChooserModal = React.memo(function AdvColumnChooserModal<T = any>({
  columns,
  columnGroups = [],
  visibleColKeys,
  onVisibleColKeysChange,
  columnPins,
  onColumnPinChange,
  onResetColumns,
  onAutoFitColumn,
  onReorderColumns,
  onClose: _onClose,
  style,
}: AdvColumnChooserModalProps<T>) {
  const [chooserSearch, setChooserSearch] = useState('');
  const [collapsedBands, setCollapsedBands] = useState<Record<string, boolean>>({});
  const [width, setWidth] = useState<number>(240);
  const isResizingRef = useRef(false);

  // Smooth Pointer Drag states (Danh sách phẳng)
  const [chooserDrag, setChooserDrag] = useState<{
    key: string;
    fromIdx: number;
    toIdx: number;
    offsetY: number;
  } | null>(null);
  const chooserDragRef = useRef<{
    key: string;
    fromIdx: number;
    toIdx: number;
    startY: number;
    itemHeight: number;
    itemCount: number;
    scrollEl: HTMLElement | null;
  } | null>(null);
  const chooserDidDragRecentlyRef = useRef(false);

  // Smooth Pointer Drag states (Cây phân cấp Banded Tree)
  const [treeDrag, setTreeDrag] = useState<{
    parentKey: string;
    key: string;
    fromIdx: number;
    toIdx: number;
    offsetY: number;
  } | null>(null);
  const treeDragRef = useRef<{
    parentKey: string;
    key: string;
    fromIdx: number;
    toIdx: number;
    startY: number;
    itemHeight: number;
    totalCount: number;
    scrollEl: HTMLElement | null;
  } | null>(null);
  const treeDidDragRecentlyRef = useRef(false);

  const q = chooserSearch.trim().toLowerCase();

  // Lọc danh sách cột dữ liệu chuẩn (gỡ bỏ hoàn toàn 2 cột hệ thống STT và Checkbox chọn dòng)
  const dataColumns = useMemo(() => {
    return columns.filter(
      (c) => c.dataType !== DATA_TYPES.SYSTEM && !c.isRowNumber && !c.isSelection
    );
  }, [columns]);

  // Xây dựng cây phân cấp đa tầng (orderedRawColumns) từ columnGroups và dataColumns
  const { orderedRawColumns, hasBands, columnBandPaths } = useMemo(() => {
    const colMap = new Map(dataColumns.map((c) => [c.key, c]));
    const tree: ColumnTreeNode[] = [];
    const bandPaths: Record<string, string> = {};

    const nonSystemGroups = columnGroups.filter(
      (g) => g.keys.some((k) => colMap.has(k))
    );

    const hasRealBands = nonSystemGroups.some(
      (g) => !g.isStandalone && g.keys.length > 0
    );

    if (hasRealBands) {
      nonSystemGroups.forEach((grp) => {
        if (grp.isStandalone) {
          const col = colMap.get(grp.keys[0]);
          if (col) {
            tree.push({
              key: col.key,
              title: col.title,
              dataType: col.dataType,
              defaultWidth: col.defaultWidth,
            });
            bandPaths[col.key] = col.title;
          }
        } else if (grp.isAtomic) {
          // Nhóm nguyên khối (Atomic Group): Gom toàn bộ các cột trong nhóm thành 1 dòng duy nhất trong Chooser
          const allAtomicKeys = Array.from(new Set(grp.keys));
          tree.push({
            key: grp.id,
            title: grp.title,
            isAtomicGroup: true,
            atomicKeys: allAtomicKeys,
          });
          allAtomicKeys.forEach((k) => {
            bandPaths[k] = grp.title;
          });
        } else {
          const childCols: ColumnTreeNode[] = [];
          grp.keys.forEach((k) => {
            const c = colMap.get(k);
            if (c) {
              childCols.push({
                key: c.key,
                title: c.title,
                dataType: c.dataType,
                defaultWidth: c.defaultWidth,
              });
              bandPaths[c.key] = `${grp.title} › ${c.title}`;
            }
          });

          if (childCols.length > 0) {
            tree.push({
              key: grp.id,
              title: grp.title,
              children: childCols,
            });
          }
        }
      });

      // Bổ sung các cột không nằm trong bất kỳ group nào (loại trừ các cột thuộc atomic group)
      const atomicKeySet = new Set(
        nonSystemGroups
          .filter((g) => g.isAtomic)
          .flatMap((g) => g.keys)
      );
      const groupedKeySet = new Set([
        ...nonSystemGroups.flatMap((g) => g.keys),
        ...atomicKeySet,
      ]);
      dataColumns.forEach((c) => {
        if (!groupedKeySet.has(c.key)) {
          tree.push({
            key: c.key,
            title: c.title,
            dataType: c.dataType,
            defaultWidth: c.defaultWidth,
          });
          bandPaths[c.key] = c.title;
        }
      });
    } else {
      // Trường hợp bảng phẳng không có bands
      dataColumns.forEach((c) => {
        tree.push({
          key: c.key,
          title: c.title,
          dataType: c.dataType,
          defaultWidth: c.defaultWidth,
        });
        bandPaths[c.key] = c.title;
      });
    }

    return {
      orderedRawColumns: tree,
      hasBands: hasRealBands,
      columnBandPaths: bandPaths,
    };
  }, [dataColumns, columnGroups]);

  // Resizer xử lý kéo dãn chiều ngang cả mép trái và mép phải
  const handleResizeStart = (
    e: React.MouseEvent | React.PointerEvent,
    direction: 'left' | 'right'
  ) => {
    e.preventDefault();
    e.stopPropagation();
    isResizingRef.current = true;
    const startX = e.clientX;
    const startWidth = width;

    const onPointerMove = (moveEv: PointerEvent) => {
      if (!isResizingRef.current) return;
      const deltaX = direction === 'left' ? startX - moveEv.clientX : moveEv.clientX - startX;
      setWidth(Math.max(220, Math.min(520, startWidth + deltaX)));
    };

    const onPointerUp = () => {
      isResizingRef.current = false;
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  // 1. Helper tính tất cả leaf keys con của một node (phục vụ toggle cả band)
  const getAllDescendantLeafKeys = (node: ColumnTreeNode): string[] => {
    if (node.isAtomicGroup && node.atomicKeys && node.atomicKeys.length > 0) {
      return node.atomicKeys;
    }
    if (!node.children || node.children.length === 0) {
      return node.key ? [node.key] : [];
    }
    return node.children.flatMap((c) => getAllDescendantLeafKeys(c));
  };

  // 2. Toggle ẩn/hiện toàn bộ nhóm cột con
  const toggleBandGroupVisibility = (node: ColumnTreeNode) => {
    const leafKeys = getAllDescendantLeafKeys(node);
    if (leafKeys.length === 0) return;
    const isAllVisible = leafKeys.every((k) => visibleColKeys.includes(k));
    if (isAllVisible) {
      onVisibleColKeysChange(visibleColKeys.filter((k) => !leafKeys.includes(k)));
    } else {
      onVisibleColKeysChange(Array.from(new Set([...visibleColKeys, ...leafKeys])));
    }
  };

  // 3. Toggle thu gọn/mở rộng từng nhánh nhóm (tuyệt đối không thu gọn khi đang hoặc vừa mới kéo di chuyển)
  const toggleBandCollapse = (bandId: string, currentCollapsed: boolean) => {
    if (
      treeDrag !== null ||
      chooserDrag !== null ||
      treeDidDragRecentlyRef.current ||
      chooserDidDragRecentlyRef.current
    ) {
      return;
    }
    setCollapsedBands((prev) => ({
      ...prev,
      [bandId]: !currentCollapsed,
    }));
  };

  // 4. Hàm đệ quy render node trong Cây phân cấp đa tầng (Banded Tree)
  const renderTreeChooserNode = (
    node: ColumnTreeNode,
    depth = 0,
    siblingIdx = 0,
    parentKey = 'root',
    siblingList: ColumnTreeNode[] = orderedRawColumns
  ): React.ReactNode => {
    const isLeaf = !node.children || node.children.length === 0;
    const nodeId = node.key || node.title || String(siblingIdx);
    const bandId = `${parentKey}/${nodeId}`;
    const isThisItemDragging = Boolean(
      treeDrag && treeDrag.parentKey === parentKey && treeDrag.key === nodeId
    );

    let siblingTranslateY = 0;
    if (treeDrag && treeDrag.parentKey === parentKey && !isThisItemDragging) {
      const { fromIdx, toIdx } = treeDrag;
      const itemH = treeDragRef.current?.itemHeight || 26;
      if (fromIdx < toIdx && siblingIdx > fromIdx && siblingIdx <= toIdx) {
        siblingTranslateY = -itemH;
      } else if (fromIdx > toIdx && siblingIdx >= toIdx && siblingIdx < fromIdx) {
        siblingTranslateY = itemH;
      }
    }

    if (isLeaf) {
      if (!node.key) return null;
      const colKey = node.key;
      const isAtomic = Boolean(node.isAtomicGroup);
      const atomicKeys = node.atomicKeys || [colKey];
      const isChecked = isAtomic
        ? atomicKeys.some((k) => visibleColKeys.includes(k))
        : visibleColKeys.includes(colKey);

      if (q) {
        const titleMatch = node.title.toLowerCase().includes(q);
        const pathMatch = (columnBandPaths[colKey] || '').toLowerCase().includes(q);
        const keyMatch = colKey.toLowerCase().includes(q);
        if (!titleMatch && !pathMatch && !keyMatch) return null;
      }

      return (
        <div
          key={colKey}
          data-sibling-parent={parentKey}
          data-sibling-idx={siblingIdx}
          style={{
            paddingLeft: `${Math.max(8, depth * 14 + 8)}px`,
            transform: isThisItemDragging
              ? `translateY(${treeDrag!.offsetY}px)`
              : siblingTranslateY
              ? `translateY(${siblingTranslateY}px)`
              : undefined,
            transition: isThisItemDragging
              ? 'none'
              : 'transform 0.2s cubic-bezier(0.2, 0, 0, 1), background-color 0.15s ease, box-shadow 0.2s ease',
            zIndex: isThisItemDragging ? 50 : siblingTranslateY ? 10 : 1,
            position: 'relative',
            pointerEvents: isThisItemDragging ? 'none' : undefined,
          }}
          className={`agv-chooser-item flex items-center justify-between rounded px-1.5 py-0.5 text-xs transition-colors select-none ${
            isThisItemDragging
              ? 'scale-[1.01] bg-[var(--agv-bg-control)] text-[var(--agv-text-main)] shadow-lg opacity-95 border border-agv-accent'
              : !isChecked
              ? 'opacity-60 hover:opacity-100 cursor-grab active:cursor-grabbing touch-none'
              : 'bg-[var(--agv-bg-item-active)] hover:bg-[var(--agv-bg-item-hover)] cursor-grab active:cursor-grabbing touch-none'
          }`}
          onPointerDown={
            siblingList.length > 1
              ? (e) => {
                  if (e.button !== 0 || q) return;
                  const target = e.target as HTMLElement;
                  if (
                    target.closest('button') ||
                    target.closest('.agv-chooser-action-btn')
                  ) {
                    return;
                  }

                  const itemEl = e.currentTarget as HTMLElement;
                  const scrollEl = itemEl.closest('.agv-chooser-scroll') as HTMLElement;
                  const itemHeight = Math.max(24, itemEl.offsetHeight || 26);
                  const startY = e.clientY;
                  const fromIdx = siblingIdx;
                  const currentKey = nodeId;
                  const totalCount = siblingList.length;
                  let isDraggingStarted = false;

                  const onPointerMove = (ev: PointerEvent) => {
                    const deltaY = ev.clientY - startY;
                    if (!isDraggingStarted) {
                      if (Math.abs(deltaY) > 3) {
                        isDraggingStarted = true;
                        treeDragRef.current = {
                          parentKey,
                          key: currentKey,
                          fromIdx,
                          toIdx: fromIdx,
                          startY,
                          itemHeight,
                          totalCount,
                          scrollEl,
                        };
                        document.body.style.cursor = 'grabbing';
                        document.body.style.userSelect = 'none';
                        setTreeDrag({
                          parentKey,
                          key: currentKey,
                          fromIdx,
                          toIdx: fromIdx,
                          offsetY: deltaY,
                        });
                      } else {
                        return;
                      }
                    }

                    if (!treeDragRef.current) return;
                    const ref = treeDragRef.current;
                    const currentDeltaY = ev.clientY - ref.startY;

                    const offsetIdx = Math.round(currentDeltaY / ref.itemHeight);
                    let newToIdx = Math.max(0, Math.min(ref.totalCount - 1, ref.fromIdx + offsetIdx));

                    const elemUnder = document.elementFromPoint(ev.clientX, ev.clientY);
                    const hoveredEl = elemUnder?.closest('[data-sibling-parent]') as HTMLElement | null;
                    if (hoveredEl && hoveredEl.getAttribute('data-sibling-parent') === ref.parentKey) {
                      const hIdx = parseInt(hoveredEl.getAttribute('data-sibling-idx') || '', 10);
                      if (!isNaN(hIdx) && hIdx >= 0 && hIdx < ref.totalCount) {
                        newToIdx = hIdx;
                      }
                    }

                    ref.toIdx = newToIdx;
                    setTreeDrag({
                      parentKey: ref.parentKey,
                      key: ref.key,
                      fromIdx: ref.fromIdx,
                      toIdx: newToIdx,
                      offsetY: currentDeltaY,
                    });

                    if (ref.scrollEl) {
                      const rect = ref.scrollEl.getBoundingClientRect();
                      if (ev.clientY < rect.top + 25) {
                        ref.scrollEl.scrollTop -= 5;
                      } else if (ev.clientY > rect.bottom - 25) {
                        ref.scrollEl.scrollTop += 5;
                      }
                    }
                  };

                  const onPointerUp = () => {
                    window.removeEventListener('pointermove', onPointerMove);
                    window.removeEventListener('pointerup', onPointerUp);
                    window.removeEventListener('pointercancel', onPointerUp);
                    document.body.style.cursor = '';
                    document.body.style.userSelect = '';

                    if (isDraggingStarted) {
                      const ref = treeDragRef.current;
                      treeDragRef.current = null;
                      setTreeDrag(null);
                      treeDidDragRecentlyRef.current = true;
                      setTimeout(() => {
                        treeDidDragRecentlyRef.current = false;
                      }, 350);

                      if (ref && onReorderColumns) {
                        const { fromIdx: fIdx, toIdx: tIdx } = ref;
                        if (fIdx !== tIdx && siblingList[fIdx]?.key && siblingList[tIdx]?.key) {
                          onReorderColumns(siblingList[fIdx]!.key!, siblingList[tIdx]!.key!);
                        }
                      }
                    }
                  };

                  window.addEventListener('pointermove', onPointerMove);
                  window.addEventListener('pointerup', onPointerUp);
                  window.addEventListener('pointercancel', onPointerUp);
                }
              : undefined
          }
          onClick={() => {
            if (treeDidDragRecentlyRef.current) return;
            if (isAtomic) {
              if (isChecked) {
                onVisibleColKeysChange(
                  visibleColKeys.filter((k) => !atomicKeys.includes(k))
                );
              } else {
                onVisibleColKeysChange(
                  Array.from(new Set([...visibleColKeys, ...atomicKeys]))
                );
              }
            } else {
              onVisibleColKeysChange(
                isChecked ? visibleColKeys.filter((k) => k !== colKey) : [...visibleColKeys, colKey]
              );
            }
          }}
        >
          <div
            className="flex min-w-0 flex-1 cursor-pointer select-none items-center gap-2 py-0.5"
          >
            <AdvCheckbox
              checked={isChecked}
              className="agv-chooser-checkbox"
            />

            <span
              className={`truncate text-xs ${
                !isChecked
                  ? 'text-[var(--agv-text-subtle)] line-through'
                  : 'font-semibold text-[var(--agv-text-main)]'
              }`}
            >
              {node.title}
            </span>
          </div>
        </div>
      );
    }

    // Nhánh nhóm tầng (Band Node)
    const leafKeys = getAllDescendantLeafKeys(node);
    const visibleCount = leafKeys.filter((k) => visibleColKeys.includes(k)).length;
    const isAllVisible = leafKeys.length > 0 && visibleCount === leafKeys.length;
    const isSomeVisible = visibleCount > 0 && !isAllVisible;

    if (q) {
      const anyDescendantMatches =
        leafKeys.some((k) => {
          const colMeta = dataColumns.find((c) => c.key === k);
          return (
            colMeta?.title.toLowerCase().includes(q) ||
            (columnBandPaths[k] || '').toLowerCase().includes(q)
          );
        }) || node.title.toLowerCase().includes(q);
      if (!anyDescendantMatches) return null;
    }

    const isCollapsed = q ? false : Boolean(collapsedBands[bandId]);

    return (
      <div
        key={bandId}
        data-sibling-parent={parentKey}
        data-sibling-idx={siblingIdx}
        style={{
          transform: isThisItemDragging
            ? `translateY(${treeDrag!.offsetY}px)`
            : siblingTranslateY
            ? `translateY(${siblingTranslateY}px)`
            : undefined,
          transition: isThisItemDragging
            ? 'none'
            : 'transform 0.2s cubic-bezier(0.2, 0, 0, 1), background-color 0.15s ease, box-shadow 0.2s ease',
          zIndex: isThisItemDragging ? 50 : siblingTranslateY ? 10 : 1,
          position: 'relative',
          pointerEvents: isThisItemDragging ? 'none' : undefined,
        }}
        className={`agv-chooser-band-group mb-1 transition-all ${
          isThisItemDragging
            ? 'scale-[1.01] rounded bg-[var(--agv-bg-control)] text-[var(--agv-text-main)] shadow-lg opacity-95 border border-agv-accent'
            : ''
        }`}
      >
        <div
          className={`flex min-h-[28px] select-none items-center justify-between rounded border px-2 py-0.5 transition-colors ${
            depth === 0
              ? 'border-[var(--agv-border-strong)] bg-[var(--agv-bg-control)] font-bold text-[var(--agv-text-header)] hover:bg-[var(--agv-bg-item-hover)] cursor-grab active:cursor-grabbing'
              : 'ml-1.5 border-[var(--agv-border)] bg-[var(--agv-bg-control)] font-semibold text-[var(--agv-text-main)] hover:bg-[var(--agv-bg-item-hover)] cursor-grab active:cursor-grabbing'
          }`}
          onPointerDown={
            siblingList.length > 1
              ? (e) => {
                  if (e.button !== 0 || q) return;
                  const target = e.target as HTMLElement;
                  if (
                    target.closest('button') ||
                    target.closest('.agv-chooser-checkbox')
                  ) {
                    return;
                  }

                  const itemEl = e.currentTarget as HTMLElement;
                  const scrollEl = itemEl.closest('.agv-chooser-scroll') as HTMLElement;
                  const itemHeight = Math.max(28, itemEl.offsetHeight || 30);
                  const startY = e.clientY;
                  const fromIdx = siblingIdx;
                  const currentKey = nodeId;
                  const totalCount = siblingList.length;
                  let isDraggingStarted = false;

                  const onPointerMove = (moveEv: PointerEvent) => {
                    const deltaY = moveEv.clientY - startY;
                    if (!isDraggingStarted) {
                      if (Math.abs(deltaY) > 4) {
                        isDraggingStarted = true;
                        treeDragRef.current = {
                          parentKey,
                          key: currentKey,
                          fromIdx,
                          toIdx: fromIdx,
                          startY,
                          itemHeight,
                          totalCount,
                          scrollEl,
                        };
                        document.body.style.cursor = 'grabbing';
                        document.body.style.userSelect = 'none';
                        setTreeDrag({
                          parentKey,
                          key: currentKey,
                          fromIdx,
                          toIdx: fromIdx,
                          offsetY: deltaY,
                        });
                      } else {
                        return;
                      }
                    }

                    if (!treeDragRef.current) return;
                    const ref = treeDragRef.current;
                    const currentDeltaY = moveEv.clientY - ref.startY;

                    const offsetIdx = Math.round(currentDeltaY / ref.itemHeight);
                    let newToIdx = Math.max(0, Math.min(ref.totalCount - 1, ref.fromIdx + offsetIdx));

                    const elemUnder = document.elementFromPoint(moveEv.clientX, moveEv.clientY);
                    const hoveredEl = elemUnder?.closest('[data-sibling-parent]') as HTMLElement | null;
                    if (hoveredEl && hoveredEl.getAttribute('data-sibling-parent') === ref.parentKey) {
                      const hIdx = parseInt(hoveredEl.getAttribute('data-sibling-idx') || '', 10);
                      if (!isNaN(hIdx) && hIdx >= 0 && hIdx < ref.totalCount) {
                        newToIdx = hIdx;
                      }
                    }

                    ref.toIdx = newToIdx;
                    setTreeDrag({
                      parentKey: ref.parentKey,
                      key: ref.key,
                      fromIdx: ref.fromIdx,
                      toIdx: newToIdx,
                      offsetY: currentDeltaY,
                    });

                    if (ref.scrollEl) {
                      const rect = ref.scrollEl.getBoundingClientRect();
                      if (moveEv.clientY < rect.top + 25) {
                        ref.scrollEl.scrollTop -= 5;
                      } else if (moveEv.clientY > rect.bottom - 25) {
                        ref.scrollEl.scrollTop += 5;
                      }
                    }
                  };

                  const onPointerUp = () => {
                    window.removeEventListener('pointermove', onPointerMove);
                    window.removeEventListener('pointerup', onPointerUp);
                    window.removeEventListener('pointercancel', onPointerUp);
                    document.body.style.cursor = '';
                    document.body.style.userSelect = '';

                    if (isDraggingStarted) {
                      const ref = treeDragRef.current;
                      treeDragRef.current = null;
                      setTreeDrag(null);
                      treeDidDragRecentlyRef.current = true;
                      setTimeout(() => {
                        treeDidDragRecentlyRef.current = false;
                      }, 350);

                      if (ref && onReorderColumns) {
                        const { fromIdx: fIdx, toIdx: tIdx } = ref;
                        if (fIdx !== tIdx && siblingList[fIdx]?.key && siblingList[tIdx]?.key) {
                          onReorderColumns(siblingList[fIdx]!.key!, siblingList[tIdx]!.key!);
                        }
                      }
                    }
                  };

                  window.addEventListener('pointermove', onPointerMove);
                  window.addEventListener('pointerup', onPointerUp);
                  window.addEventListener('pointercancel', onPointerUp);
                }
              : undefined
          }
          onClick={(e) => {
            if (treeDidDragRecentlyRef.current || treeDrag !== null) return;
            const target = e.target as HTMLElement;
            if (target.closest('.agv-chooser-checkbox') || target.closest('button')) return;
            toggleBandCollapse(bandId, isCollapsed);
          }}
        >
          <div className="flex min-w-0 items-center gap-1.5">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (treeDidDragRecentlyRef.current || treeDrag !== null) return;
                toggleBandCollapse(bandId, isCollapsed);
              }}
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-[var(--agv-text-subtle)] hover:text-[var(--agv-text-main)] cursor-pointer"
            >
              {isCollapsed ? (
                <ChevronRight className="h-3.5 w-3.5 stroke-[2.5]" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5 stroke-[2.5]" />
              )}
            </button>

            <div onPointerDown={(e) => e.stopPropagation()}>
              <AdvCheckbox
                checked={isAllVisible}
                indeterminate={isSomeVisible}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleBandGroupVisibility(node);
                }}
                className="agv-chooser-checkbox"
              />
            </div>

            <Layers
              className={`h-3.5 w-3.5 shrink-0 ${
                depth === 0 ? 'text-agv-accent' : 'text-[var(--agv-text-subtle)]'
              }`}
            />

            <span className="truncate text-xs tracking-tight text-[var(--agv-text-main)]">
              {node.title}
            </span>
          </div>

          <span
            className={`py-0.5 shrink-0 rounded-full px-1.5 text-[10px] font-semibold ${
              isAllVisible
                ? 'bg-[var(--agv-bg-item-active)] text-agv-accent'
                : visibleCount > 0
                ? 'bg-[var(--agv-warning-bg)] text-[var(--agv-warning)]'
                : 'bg-[var(--agv-bg-control)] text-[var(--agv-text-subtle)]'
            }`}
          >
            {visibleCount}/{leafKeys.length}
          </span>
        </div>

        {!isCollapsed && (
          <div className="ml-3 mt-0.5 space-y-0.5 border-l-2 border-[var(--agv-border)] pl-1">
            {node.children!.map((child, cIdx) =>
              renderTreeChooserNode(child, depth + 1, cIdx, bandId, node.children!)
            )}
          </div>
        )}
      </div>
    );
  };

  // 7. Lọc danh sách phẳng khi hiển thị dạng phẳng (không có bands)
  const filteredFlatColumns = useMemo(() => {
    return dataColumns.filter((col) => {
      if (!q) return true;
      const titleMatch = col.title.toLowerCase().includes(q);
      const keyMatch = col.key.toLowerCase().includes(q);
      const pathMatch = (columnBandPaths[col.key] || '').toLowerCase().includes(q);
      return titleMatch || keyMatch || pathMatch;
    });
  }, [dataColumns, q, columnBandPaths]);

  return (
    <div
      data-agv-popup="true"
      style={{
        boxShadow: '0 12px 28px -4px rgba(0, 0, 0, 0.25), 0 8px 12px -6px rgba(0, 0, 0, 0.15)',
        ...style,
        width: `${width}px`,
        minWidth: '200px',
        maxWidth: '450px',
        maxHeight: style?.maxHeight || 'calc(100% - 80px)',
        height: 'auto',
      }}
      className="agv-column-chooser relative flex flex-col rounded-md border border-[var(--agv-border-popup)] bg-[var(--agv-bg-popup)] text-[var(--agv-text-main)] p-2 text-xs select-none agv-spring-left"
      onClick={(e) => e.stopPropagation()}
      onWheel={(e) => e.stopPropagation()}
    >
      {/* Thanh kéo điều chỉnh chiều ngang ở mép trái */}
      <div
        onMouseDown={(e) => handleResizeStart(e, 'left')}
        onPointerDown={(e) => handleResizeStart(e, 'left')}
        className="agv-chooser-resizer-left absolute -left-1.5 top-0 bottom-0 w-3 cursor-ew-resize select-none touch-none z-30 group flex items-center justify-center"
      >
        <div className="w-[3px] h-8 rounded-full bg-[var(--agv-border-strong)] group-hover:bg-agv-accent group-active:bg-agv-accent transition-colors" />
      </div>

      {/* Thanh kéo điều chỉnh chiều ngang ở mép phải */}
      <div
        onMouseDown={(e) => handleResizeStart(e, 'right')}
        onPointerDown={(e) => handleResizeStart(e, 'right')}
        className="agv-chooser-resizer-right absolute -right-1.5 top-0 bottom-0 w-3 cursor-ew-resize select-none touch-none z-30 group flex items-center justify-center"
      >
        <div className="w-[3px] h-8 rounded-full bg-[var(--agv-border-strong)] group-hover:bg-agv-accent group-active:bg-agv-accent transition-colors" />
      </div>

      {/* Ô tìm kiếm cột nhanh & Nút phục hồi mặc định */}
      <div className="mb-2 flex items-center gap-1.5 shrink-0">
        <div className="relative flex-1 flex items-center">
          <Search className="absolute left-2 h-3.5 w-3.5 text-[var(--agv-text-subtle)] pointer-events-none" />
          <input
            type="text"
            value={chooserSearch}
            onChange={(e) => setChooserSearch(e.target.value)}
            placeholder="Tìm kiếm tên cột..."
            {...NO_AUTOFILL_PROPS}
            className="w-full min-h-[28px] h-7 pl-7 pr-7 text-xs rounded border border-[var(--agv-border-strong)] bg-[var(--agv-bg-control)] text-[var(--agv-text-main)] outline-none focus:border-agv-accent transition-colors"
          />
          {chooserSearch && (
            <button
              type="button"
              onClick={() => setChooserSearch('')}
              className="absolute right-1.5 text-[var(--agv-text-subtle)] hover:text-[var(--agv-text-main)] cursor-pointer"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* Nút phục hồi mặc định */}
        <button
          type="button"
          onClick={() => {
            onResetColumns();
            setCollapsedBands({});
            setChooserSearch('');
            setWidth(240);
          }}
          className="flex min-h-[28px] min-w-[28px] h-7 w-7 shrink-0 items-center justify-center rounded border border-[var(--agv-border-strong)] bg-[var(--agv-bg-control)] text-[var(--agv-text-muted)] transition-colors hover:border-agv-accent hover:bg-[var(--agv-bg-control-hover)] hover:text-[var(--agv-text-main)] cursor-pointer select-none"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Danh sách các cột (Hỗ trợ cả Cây phân cấp Banded Tree và Danh sách phẳng) */}
      <div
        className="agv-chooser-scroll overflow-y-auto overflow-x-hidden pr-0.5 flex-1 min-h-0"
        style={{ overscrollBehavior: 'contain' }}
      >
        <div className="space-y-0.5 min-w-full">
          {hasBands ? (
            orderedRawColumns.map((col, idx) =>
              renderTreeChooserNode(col, 0, idx, 'root', orderedRawColumns)
            )
          ) : filteredFlatColumns.length === 0 ? (
            <div className="py-6 text-center text-xs italic text-[var(--agv-text-subtle)]">
              Không tìm thấy cột phù hợp với từ khóa "{chooserSearch}"
            </div>
          ) : (
            filteredFlatColumns.map((col, idx) => {
              const isChecked = visibleColKeys.includes(col.key);
              const isDragging = chooserDrag?.key === col.key;

              let translateY = 0;
              if (chooserDrag && !isDragging) {
                const { fromIdx, toIdx } = chooserDrag;
                const itemH = chooserDragRef.current?.itemHeight || 27;
                if (fromIdx < toIdx && idx > fromIdx && idx <= toIdx) {
                  translateY = -itemH;
                } else if (fromIdx > toIdx && idx >= toIdx && idx < fromIdx) {
                  translateY = itemH;
                }
              }

              return (
                <div
                  key={col.key}
                  style={{
                    transform: isDragging
                      ? `translateY(${chooserDrag.offsetY}px)`
                      : translateY
                      ? `translateY(${translateY}px)`
                      : undefined,
                    transition: isDragging
                      ? 'none'
                      : 'transform 0.2s cubic-bezier(0.2, 0, 0, 1), background-color 0.15s ease, box-shadow 0.2s ease',
                    zIndex: isDragging ? 50 : translateY ? 10 : 1,
                    position: 'relative',
                  }}
                  className={`agv-chooser-item flex items-center justify-between rounded px-1.5 py-0.5 select-none cursor-grab active:cursor-grabbing touch-none ${
                    isDragging
                      ? 'is-dragging bg-[var(--agv-bg-control)] text-[var(--agv-text-main)] shadow-lg scale-[1.01]'
                      : isChecked
                      ? 'is-checked bg-[var(--agv-bg-item-active)] hover:bg-[var(--agv-bg-item-hover)]'
                      : 'opacity-60 hover:opacity-100 hover:bg-[var(--agv-bg-item-hover)]'
                  }`}
                  onPointerDown={(e) => {
                    if (e.button !== 0) return;
                    const target = e.target as HTMLElement;
                    if (target.closest('button') || target.closest('.agv-chooser-action-btn')) {
                      return;
                    }

                    const itemEl = e.currentTarget as HTMLElement;
                    const scrollEl = itemEl.closest('.agv-chooser-scroll') as HTMLElement;
                    const itemHeight = itemEl.offsetHeight + 2;
                    const startY = e.clientY;
                    const fromIdx = idx;
                    const colKey = col.key;
                    const totalCount = filteredFlatColumns.length;
                    let isDraggingStarted = false;

                    const onPointerMove = (ev: PointerEvent) => {
                      const deltaY = ev.clientY - startY;
                      if (!isDraggingStarted) {
                        if (Math.abs(deltaY) > 3) {
                          isDraggingStarted = true;
                          chooserDragRef.current = {
                            key: colKey,
                            fromIdx,
                            toIdx: fromIdx,
                            startY,
                            itemHeight,
                            itemCount: totalCount,
                            scrollEl,
                          };
                          document.body.style.cursor = 'grabbing';
                          document.body.style.userSelect = 'none';
                          setChooserDrag({
                            key: colKey,
                            fromIdx,
                            toIdx: fromIdx,
                            offsetY: deltaY,
                          });
                        } else {
                          return;
                        }
                      }

                      if (!chooserDragRef.current) return;
                      const ref = chooserDragRef.current;
                      const currentDeltaY = ev.clientY - ref.startY;
                      const offsetIdx = Math.round(currentDeltaY / ref.itemHeight);
                      const newToIdx = Math.max(
                        0,
                        Math.min(ref.itemCount - 1, ref.fromIdx + offsetIdx)
                      );
                      ref.toIdx = newToIdx;

                      setChooserDrag({
                        key: ref.key,
                        fromIdx: ref.fromIdx,
                        toIdx: newToIdx,
                        offsetY: currentDeltaY,
                      });

                      if (ref.scrollEl) {
                        const rect = ref.scrollEl.getBoundingClientRect();
                        if (ev.clientY < rect.top + 25) {
                          ref.scrollEl.scrollTop -= 5;
                        } else if (ev.clientY > rect.bottom - 25) {
                          ref.scrollEl.scrollTop += 5;
                        }
                      }
                    };

                    const onPointerUp = () => {
                      window.removeEventListener('pointermove', onPointerMove);
                      window.removeEventListener('pointerup', onPointerUp);
                      window.removeEventListener('pointercancel', onPointerUp);
                      document.body.style.cursor = '';
                      document.body.style.userSelect = '';

                      if (isDraggingStarted) {
                        const ref = chooserDragRef.current;
                        chooserDragRef.current = null;
                        setChooserDrag(null);
                        chooserDidDragRecentlyRef.current = true;
                        setTimeout(() => {
                          chooserDidDragRecentlyRef.current = false;
                        }, 350);

                        if (ref && onReorderColumns) {
                          const { key, fromIdx, toIdx } = ref;
                          if (fromIdx !== toIdx) {
                            const targetCol = filteredFlatColumns[toIdx];
                            if (targetCol && targetCol.key !== key) {
                              onReorderColumns(key, targetCol.key);
                            }
                          }
                        }
                      }
                    };

                    window.addEventListener('pointermove', onPointerMove);
                    window.addEventListener('pointerup', onPointerUp);
                    window.addEventListener('pointercancel', onPointerUp);
                  }}
                  onClick={() => {
                    if (chooserDidDragRecentlyRef.current) return;
                    onVisibleColKeysChange(
                      isChecked ? visibleColKeys.filter((k) => k !== col.key) : [...visibleColKeys, col.key]
                    );
                  }}
                >
                  {/* Checkbox & Tiêu đề cột */}
                  <div
                    className="flex min-w-0 flex-1 select-none items-center gap-1.5 py-0.5"
                  >
                    <AdvCheckbox
                      checked={isChecked}
                      className="agv-chooser-checkbox"
                    />
                    <span
                      className={`truncate text-xs ${
                        !isChecked
                          ? 'text-[var(--agv-text-subtle)] line-through'
                          : 'font-semibold text-[var(--agv-text-main)]'
                      }`}
                    >
                      {col.title}
                    </span>
                    {hasBands && columnBandPaths[col.key] && (
                      <span
                        className="mt-0.5 block truncate pl-2 text-[10px] text-[var(--agv-text-subtle)]"
                      >
                        {columnBandPaths[col.key]}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
});
