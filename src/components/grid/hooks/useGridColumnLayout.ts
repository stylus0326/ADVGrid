import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  BaseGroupDef,
  CENTER_DOCK_STATUSES,
  CenterDockStatus,
  ColumnDef,
  DATA_TYPES,
  PIN_POSITIONS,
  PinPosition,
  ResolvedGridFeatures,
} from '../types';
import { getSttColWidth, isSelectionColumn } from '../gridFormatUtils';

export type GridMiddleElement<T = any> =
  | { type: 'standalone'; col: ColumnDef<T>; isCenterPinned?: boolean }
  | { type: 'group'; def: BaseGroupDef; segmentKey: string; children: ColumnDef<T>[] };

const EMPTY_PINS: Record<string, PinPosition> = {};
const EMPTY_CENTER_KEYS: string[] = [];
const EMPTY_DOCK_STATUS: Record<string, CenterDockStatus> = {};
const EMPTY_POSITIONS: Record<string, { left: number; width: number }> = {};

interface UseGridColumnLayoutParams<T> {
  columns: ColumnDef<T>[];
  columnGroups?: BaseGroupDef[];
  totalRows: number;
  features: ResolvedGridFeatures;
  controlledWidths?: Record<string, number>;
  defaultColWidths?: Record<string, number>;
  onColWidthsChange?: (widths: Record<string, number>) => void;
  controlledPins?: Record<string, PinPosition>;
  defaultColumnPins?: Record<string, PinPosition>;
  onColumnPinsChange?: (pins: Record<string, PinPosition>) => void;
  controlledHiddenColKeys?: Set<string>;
  defaultHiddenColKeys?: Set<string>;
  onHiddenColKeysChange?: (hidden: Set<string>) => void;
  controlledOnResetColumns?: () => void;
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
}

export function useGridColumnLayout<T>({
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
}: UseGridColumnLayoutParams<T>) {
  const [internalWidths, setInternalWidths] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    columns.forEach((c) => {
      initial[c.key] = defaultColWidths?.[c.key] ?? c.defaultWidth;
    });
    return initial;
  });

  const rawColWidths = controlledWidths ?? internalWidths;
  const autoSttWidth = useMemo(() => getSttColWidth(totalRows), [totalRows]);

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
      if (
        col.dataType === DATA_TYPES.SYSTEM ||
        col.isRowNumber ||
        isSelectionColumn(col) ||
        col.isDetailExpand
      ) {
        if (col.isDetailExpand) {
          res[col.key] = res[col.key] || col.defaultWidth || 36;
        } else if (col.isRowNumber || col.title) {
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
      if (
        !targetCol ||
        targetCol.resizable === false ||
        targetCol.dataType === DATA_TYPES.SYSTEM ||
        targetCol.isRowNumber ||
        isSelectionColumn(targetCol) ||
        targetCol.isDetailExpand
      ) {
        return;
      }
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
        if (
          targetCol &&
          targetCol.resizable !== false &&
          targetCol.dataType !== DATA_TYPES.SYSTEM &&
          !targetCol.isRowNumber &&
          !isSelectionColumn(targetCol) &&
          !targetCol.isDetailExpand
        ) {
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

  const [internalPins, setInternalPins] = useState<Record<string, PinPosition>>(
    () => defaultColumnPins ?? {}
  );

  const columnPins = useMemo<Record<string, PinPosition>>(() => {
    if (!features.enableColumnPinning && !features.enableCenterDock) {
      return EMPTY_PINS;
    }
    const rawPins = controlledPins ?? internalPins;
    if (features.enableColumnPinning && features.enableCenterDock) {
      return rawPins;
    }
    const filtered: Record<string, PinPosition> = {};
    for (const [k, v] of Object.entries(rawPins)) {
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
  }, [features.enableColumnPinning, features.enableCenterDock, controlledPins, internalPins]);

  const setColumnPin = useCallback(
    (colKey: string, pin: PinPosition) => {
      if (pin === PIN_POSITIONS.CENTER && !features.enableCenterDock) return;
      if (
        (pin === PIN_POSITIONS.LEFT || pin === PIN_POSITIONS.RIGHT) &&
        !features.enableColumnPinning
      ) {
        return;
      }
      if (
        pin === PIN_POSITIONS.NONE &&
        !features.enableColumnPinning &&
        !features.enableCenterDock
      ) {
        return;
      }
      const currentPin = columnPins[colKey] || PIN_POSITIONS.NONE;
      const nextPin = currentPin === pin ? PIN_POSITIONS.NONE : pin;
      const next = { ...columnPins, [colKey]: nextPin };
      if (onColumnPinsChange) onColumnPinsChange(next);
      else setInternalPins(next);
    },
    [features.enableColumnPinning, features.enableCenterDock, columnPins, onColumnPinsChange]
  );

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

  const columnDataTypes = useMemo(() => {
    const map: Record<string, string> = {};
    columns.forEach((col) => {
      map[col.key] = col.dataType || DATA_TYPES.TEXT;
    });
    return map;
  }, [columns]);

  const effectiveColumnGroups = useMemo(() => {
    if (!columnGroups || columnGroups.length === 0) return columnGroups;
    const orderMap = new Map<string, number>();
    columns.forEach((c, idx) => orderMap.set(c.key, idx));

    const withSortedKeys = columnGroups.map((grp) => {
      if (!grp.keys || grp.keys.length <= 1) return grp;
      const sortedKeys = [...grp.keys].sort(
        (a, b) => (orderMap.get(a) ?? 999999) - (orderMap.get(b) ?? 999999)
      );
      return { ...grp, keys: sortedKeys };
    });

    return [...withSortedKeys].sort((a, b) => {
      const minA = Math.min(...a.keys.map((k) => orderMap.get(k) ?? 999999));
      const minB = Math.min(...b.keys.map((k) => orderMap.get(k) ?? 999999));
      return minA - minB;
    });
  }, [columnGroups, columns]);

  const activeColKeys = useMemo(() => {
    const isAllowed = (k: string) => {
      const col = colMap[k];
      if (
        !features.enableRowNumber &&
        (col?.isRowNumber || (col?.dataType === DATA_TYPES.SYSTEM && Boolean(col?.title)))
      ) {
        return false;
      }
      if (!features.enableSelection && isSelectionColumn(col)) return false;
      return true;
    };

    if (effectiveColumnGroups && effectiveColumnGroups.length > 0) {
      const keys: string[] = [];
      effectiveColumnGroups.forEach((grp) => {
        grp.keys.forEach((k) => {
          if (colMap[k] && !hiddenColKeys.has(k) && isAllowed(k)) keys.push(k);
        });
      });
      return keys;
    }
    return effectiveColumns.filter((c) => isAllowed(c.key)).map((c) => c.key);
  }, [
    effectiveColumnGroups,
    colMap,
    effectiveColumns,
    hiddenColKeys,
    features.enableRowNumber,
    features.enableSelection,
  ]);

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
    [columns, setHiddenColKeys]
  );

  const handleResetColumns = useCallback(() => {
    if (controlledOnResetColumns) {
      controlledOnResetColumns();
      return;
    }
    setHiddenColKeys(new Set());
    if (defaultColumnPins && (features.enableColumnPinning || features.enableCenterDock)) {
      if (onColumnPinsChange) onColumnPinsChange(defaultColumnPins);
      else setInternalPins(defaultColumnPins);
    }
  }, [
    controlledOnResetColumns,
    setHiddenColKeys,
    defaultColumnPins,
    features.enableColumnPinning,
    features.enableCenterDock,
    onColumnPinsChange,
  ]);

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

  const centerPinnedColKeys = useMemo(() => {
    if (!features.enableCenterDock) return EMPTY_CENTER_KEYS;
    const keys = activeColKeys.filter((k) => columnPins[k] === PIN_POSITIONS.CENTER);
    return keys.length > 0 ? keys : EMPTY_CENTER_KEYS;
  }, [features.enableCenterDock, activeColKeys, columnPins]);

  const columnNaturalPositions = useMemo(() => {
    if (centerPinnedColKeys.length === 0) return EMPTY_POSITIONS;
    const pos: Record<string, { left: number; width: number }> = {};
    let currentX = 0;
    flatColumns.forEach((c) => {
      const w = colWidths[c.key] || c.defaultWidth;
      pos[c.key] = { left: currentX, width: w };
      currentX += w;
    });
    return pos;
  }, [centerPinnedColKeys.length, flatColumns, colWidths]);

  const totalGridWidth = useMemo(() => {
    return flatColumns.reduce((acc, col) => acc + (colWidths[col.key] || col.defaultWidth), 0);
  }, [flatColumns, colWidths]);

  const [centerDockStatus, setCenterDockStatus] =
    useState<Record<string, CenterDockStatus>>(EMPTY_DOCK_STATUS);

  const computeCenterDock = useCallback(
    (scrollLeft: number, clientWidth: number) => {
      if (centerPinnedColKeys.length === 0) {
        setCenterDockStatus((prev) => (Object.keys(prev).length === 0 ? prev : EMPTY_DOCK_STATUS));
        return;
      }

      const nextStatus: Record<string, CenterDockStatus> = {};
      let runningLeftEdge = scrollLeft + totalLeftWidth;
      let runningRightEdge = scrollLeft + clientWidth - totalRightWidth;

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

  // Chỉ gắn ResizeObserver cho center dock khi thực sự có cột center-pinned
  useEffect(() => {
    if (centerPinnedColKeys.length === 0) {
      setCenterDockStatus((prev) => (Object.keys(prev).length === 0 ? prev : EMPTY_DOCK_STATUS));
      return;
    }
    const el = scrollContainerRef.current;
    if (!el) return;
    computeCenterDock(el.scrollLeft, el.clientWidth);
    const observer = new ResizeObserver(() => {
      computeCenterDock(el.scrollLeft, el.clientWidth);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [centerPinnedColKeys.length, computeCenterDock, scrollContainerRef]);

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

  const middleElements = useMemo(() => {
    const midElements: GridMiddleElement<T>[] = [];

    if (!effectiveColumnGroups || effectiveColumnGroups.length === 0) {
      middleColumns.forEach((col) => {
        midElements.push({
          type: 'standalone',
          col,
          isCenterPinned: columnPins[col.key] === PIN_POSITIONS.CENTER,
        });
      });
      return midElements;
    }

    effectiveColumnGroups.forEach((grp) => {
      if (grp.isStandalone) {
        const key = grp.keys[0];
        const pin = columnPins[key] || PIN_POSITIONS.NONE;
        if (
          activeColKeys.includes(key) &&
          (pin === PIN_POSITIONS.NONE || pin === PIN_POSITIONS.CENTER)
        ) {
          const col = colMap[key];
          if (col) {
            midElements.push({
              type: 'standalone',
              col,
              isCenterPinned: pin === PIN_POSITIONS.CENTER,
            });
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
          const dock =
            pin === PIN_POSITIONS.CENTER
              ? centerDockStatus[k] || CENTER_DOCK_STATUSES.NORMAL
              : CENTER_DOCK_STATUSES.NORMAL;

          if (
            pin === PIN_POSITIONS.CENTER &&
            (dock === CENTER_DOCK_STATUSES.LEFT || dock === CENTER_DOCK_STATUSES.RIGHT)
          ) {
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
  }, [
    effectiveColumnGroups,
    middleColumns,
    columnPins,
    activeColKeys,
    colMap,
    centerDockStatus,
    hiddenColKeys,
  ]);

  const gridColVars = useMemo<React.CSSProperties>(() => {
    const vars: Record<string, string> = {};
    flatColumns.forEach((col) => {
      const w = colWidths[col.key] || col.defaultWidth;
      vars[`--agv-col-w-${col.key}`] = `${w}px`;
    });
    vars['--agv-total-grid-w'] = `${totalGridWidth}px`;
    leftColumns.forEach((col) => {
      vars[`--agv-left-offset-${col.key}`] = `${leftOffsets[col.key]}px`;
    });
    rightColumns.forEach((col) => {
      vars[`--agv-right-offset-${col.key}`] = `${rightOffsets[col.key]}px`;
    });
    centerPinnedColKeys.forEach((key) => {
      vars[`--agv-center-left-offset-${key}`] = `${centerLeftOffsets[key]}px`;
      vars[`--agv-center-right-offset-${key}`] = `${centerRightOffsets[key]}px`;
    });
    return vars as unknown as React.CSSProperties;
  }, [
    flatColumns,
    colWidths,
    totalGridWidth,
    leftColumns,
    leftOffsets,
    rightColumns,
    rightOffsets,
    centerPinnedColKeys,
    centerLeftOffsets,
    centerRightOffsets,
  ]);

  return {
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
    middleColumns,
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
  };
}
