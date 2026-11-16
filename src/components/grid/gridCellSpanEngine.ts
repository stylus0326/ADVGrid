import {
  CENTER_DOCK_STATUSES,
  PIN_POSITIONS,
  type CellSpanParams,
  type CenterDockStatus,
  type ColumnDef,
  type GridSpanMethod,
  type PinPosition,
} from './types';
import { DATA_TYPES } from './types';
import { isSelectionColumn } from './gridFormatUtils';

export type CellSpanCellPlan =
  | { kind: 'normal' }
  | { kind: 'omit' }
  | { kind: 'spacer'; widthPx: number }
  | {
      kind: 'anchor';
      rowSpan: number;
      colSpan: number;
      widthPx: number;
      heightPx?: number;
      hasRightPinnedDivider?: boolean;
    };

export interface RowSpanPlan {
  cells: CellSpanCellPlan[];
  hasVerticalSpan: boolean;
  hasCoveredFromAbove: boolean;
}

export interface SpanWindowPlan {
  rowPlans: Map<number, RowSpanPlan>;
  anchorRowsBeforeStart: number[];
  hasAnyVerticalSpan: boolean;
}

export interface AutoRowSpanOptions<T = any> {
  /** Số dòng tối đa gộp chung 1 khối để tối ưu lookback ảo hóa (mặc định 32) */
  maxSpan?: number;
  /** Cho phép kiểm soát điều kiện gộp theo từng dòng */
  canMerge?: (row: T, rowIndex: number) => boolean;
}

function isSyntheticGridRow(row: any): boolean {
  return Boolean(!row || row._isGroupRow || row._isDetailRow);
}

function isSystemSpanBlockedCol<T>(col: ColumnDef<T>): boolean {
  return Boolean(
    col.isRowNumber ||
      col.key === 'col_stt' ||
      isSelectionColumn(col) ||
      col.isDetailExpand ||
      col.key === 'col_detail_expand' ||
      col.dataType === DATA_TYPES.SYSTEM
  );
}

function getPinPartition(
  colKey: string,
  columnPins: Record<string, PinPosition>,
  centerDockStatus: Record<string, CenterDockStatus>
): 'left' | 'right' | 'center' {
  const pin = columnPins[colKey] || PIN_POSITIONS.NONE;
  if (pin === PIN_POSITIONS.LEFT) return 'left';
  if (pin === PIN_POSITIONS.RIGHT) return 'right';
  if (pin === PIN_POSITIONS.CENTER) {
    const dock = centerDockStatus[colKey] || CENTER_DOCK_STATUSES.NORMAL;
    if (dock === CENTER_DOCK_STATUSES.LEFT) return 'left';
    if (dock === CENTER_DOCK_STATUSES.RIGHT) return 'right';
  }
  return 'center';
}

function normalizeSpanPair(
  raw: ReturnType<GridSpanMethod<any>>
): { rowSpan: number; colSpan: number } {
  if (!raw) return { rowSpan: 1, colSpan: 1 };
  if (Array.isArray(raw)) {
    return {
      rowSpan: typeof raw[0] === 'number' && Number.isFinite(raw[0]) ? Math.max(0, Math.floor(raw[0])) : 1,
      colSpan: typeof raw[1] === 'number' && Number.isFinite(raw[1]) ? Math.max(0, Math.floor(raw[1])) : 1,
    };
  }
  const obj = raw as { rowSpan?: number; colSpan?: number };
  return {
    rowSpan: typeof obj.rowSpan === 'number' && Number.isFinite(obj.rowSpan) ? Math.max(0, Math.floor(obj.rowSpan)) : 1,
    colSpan: typeof obj.colSpan === 'number' && Number.isFinite(obj.colSpan) ? Math.max(0, Math.floor(obj.colSpan)) : 1,
  };
}

/**
 * Helper tạo nhanh hàm `rowSpan` tự động gộp các dòng liền kề trùng giá trị.
 * Hỗ trợ tìm ngược có giới hạn (`maxSpan`, mặc định 32) để bảo toàn hiệu năng cuộn ảo hóa O(1).
 */
export function createAutoRowSpan<T = any>(
  selector: (keyof T & string) | ((row: T) => unknown),
  options: AutoRowSpanOptions<T> = {}
): (params: CellSpanParams<T>) => number {
  const maxSpan = Math.max(2, Math.min(64, Math.floor(options.maxSpan ?? 32)));
  const getValue =
    typeof selector === 'function'
      ? selector
      : (row: T) => (row ? (row as any)[selector] : undefined);

  const isEmpty = (v: unknown) => v === null || v === undefined || v === '';

  return ({ row, rowIndex, getRowAt }) => {
    if (isSyntheticGridRow(row)) return 1;
    if (options.canMerge && !options.canMerge(row, rowIndex)) return 1;
    const baseVal = getValue(row);
    if (isEmpty(baseVal)) return 1;

    let runOffset = 0;
    for (let step = 1; step < maxSpan && rowIndex - step >= 0; step++) {
      const prevRow = getRowAt(rowIndex - step);
      if (isSyntheticGridRow(prevRow)) break;
      if (options.canMerge && !options.canMerge(prevRow as T, rowIndex - step)) break;
      if (getValue(prevRow as T) !== baseVal) break;
      runOffset++;
    }

    if (runOffset > 0) {
      return 0;
    }

    let count = 1;
    for (let step = 1; step < maxSpan; step++) {
      const nextRow = getRowAt(rowIndex + step);
      if (isSyntheticGridRow(nextRow)) break;
      if (options.canMerge && !options.canMerge(nextRow as T, rowIndex + step)) break;
      if (getValue(nextRow as T) !== baseVal) break;
      count++;
    }
    return count;
  };
}

/**
 * Tính kế hoạch gộp ô 2D (`colSpan`, `rowSpan`, `rowSpan + colSpan`) cho cửa sổ dòng đang hiển thị.
 * - Giới hạn ngang trong cùng phân vùng ghim (trái | giữa | phải) để không vỡ cột sticky.
 * - Phát hiện các ô neo nằm phía trên `startRow` nhưng có phần thân trải vào viewport để giữ slot không bị mất ô khi cuộn.
 */
export function computeSpanWindowPlan<T = any>(params: {
  startRow: number;
  endRow: number;
  totalRows: number;
  baseRowHeight: number;
  getRowTop: (rowIndex: number) => number;
  columns: ColumnDef<T>[];
  colWidths: Record<string, number>;
  columnPins: Record<string, PinPosition>;
  centerDockStatus: Record<string, CenterDockStatus>;
  lastEffectiveLeftColKey: string | null;
  getRowItem: (rowIndex: number) => T;
  spanMethod?: GridSpanMethod<T>;
  maxLookback?: number;
}): SpanWindowPlan {
  const {
    startRow,
    endRow,
    totalRows,
    baseRowHeight,
    getRowTop,
    columns,
    colWidths,
    columnPins,
    centerDockStatus,
    lastEffectiveLeftColKey,
    getRowItem,
    spanMethod,
    maxLookback = 32,
  } = params;

  const rowPlans = new Map<number, RowSpanPlan>();
  const anchorRowsBeforeStart: number[] = [];
  let hasAnyVerticalSpan = false;

  if (totalRows <= 0 || columns.length === 0 || endRow < startRow) {
    return { rowPlans, anchorRowsBeforeStart, hasAnyVerticalSpan };
  }

  const numCols = columns.length;
  const colWidthsArr = new Float64Array(numCols);
  const colSystemBlocked = new Uint8Array(numCols);
  const colPartitions: Array<'left' | 'right' | 'center'> = new Array(numCols);
  const maxColSpanInPart = new Int32Array(numCols);

  let hasAnySpanFn = Boolean(spanMethod);
  for (let c = 0; c < numCols; c++) {
    const col = columns[c];
    colWidthsArr[c] = colWidths[col.key] || col.defaultWidth;
    colSystemBlocked[c] = isSystemSpanBlockedCol(col) ? 1 : 0;
    colPartitions[c] = getPinPartition(col.key, columnPins, centerDockStatus);
    if (col.colSpan || col.rowSpan) {
      hasAnySpanFn = true;
    }
  }

  if (!hasAnySpanFn) {
    return { rowPlans, anchorRowsBeforeStart, hasAnyVerticalSpan };
  }

  for (let c = 0; c < numCols; c++) {
    if (colSystemBlocked[c]) {
      maxColSpanInPart[c] = 1;
      continue;
    }
    const part = colPartitions[c];
    let spanLimit = 1;
    while (
      c + spanLimit < numCols &&
      !colSystemBlocked[c + spanLimit] &&
      colPartitions[c + spanLimit] === part
    ) {
      spanLimit++;
    }
    maxColSpanInPart[c] = spanLimit;
  }

  const safeLookback = Math.max(1, Math.min(64, Math.floor(maxLookback)));
  const scanStart = Math.max(0, startRow - safeLookback);
  const scanEnd = Math.min(totalRows - 1, endRow);
  const scanCount = scanEnd - scanStart + 1;

  // 0 = tự do, 1 = bị gộp ngang cùng hàng, 2 = bị che dọc từ hàng phía trên
  const occupancy = new Uint8Array(scanCount * numCols);
  const rowCache: Array<T | null> = new Array(scanCount);

  const safeGetRow = (rIdx: number): T | null => {
    if (rIdx < 0 || rIdx >= totalRows) return null;
    if (rIdx >= scanStart && rIdx <= scanEnd) {
      const local = rIdx - scanStart;
      if (rowCache[local] === undefined) {
        rowCache[local] = getRowItem(rIdx) ?? null;
      }
      return rowCache[local];
    }
    return getRowItem(rIdx) ?? null;
  };

  for (let r = scanStart; r <= scanEnd; r++) {
    const localR = r - scanStart;
    const rowOffset = localR * numCols;
    const row = safeGetRow(r);
    const isVisibleOrBeforeTarget = r <= endRow;

    if (isSyntheticGridRow(row)) {
      continue;
    }

    const rowCells: CellSpanCellPlan[] = new Array(numCols);
    let rowHasSpecial = false;
    let rowHasVerticalSpan = false;
    let rowHasCoveredFromAbove = false;

    for (let c = 0; c < numCols; c++) {
      const occ = occupancy[rowOffset + c];
      if (occ === 1) {
        rowCells[c] = { kind: 'omit' };
        rowHasSpecial = true;
        continue;
      }
      if (occ === 2) {
        rowCells[c] = { kind: 'spacer', widthPx: colWidthsArr[c] };
        rowHasSpecial = true;
        rowHasCoveredFromAbove = true;
        continue;
      }

      const col = columns[c];
      if (colSystemBlocked[c] || (!spanMethod && !col.colSpan && !col.rowSpan)) {
        rowCells[c] = { kind: 'normal' };
        continue;
      }

      const ctx: CellSpanParams<T> = {
        row: row as T,
        rowIndex: r,
        column: col,
        colIndex: c,
        getRowAt: safeGetRow,
      };

      let rawRowSpan = 1;
      let rawColSpan = 1;

      if (spanMethod) {
        const pair = normalizeSpanPair(spanMethod(ctx));
        rawRowSpan = pair.rowSpan;
        rawColSpan = pair.colSpan;
      }
      if (rawRowSpan === 1 && col.rowSpan) {
        const rs = col.rowSpan(ctx);
        if (typeof rs === 'number' && Number.isFinite(rs)) {
          rawRowSpan = Math.max(0, Math.floor(rs));
        }
      }
      if (rawColSpan === 1 && col.colSpan) {
        const cs = col.colSpan(ctx);
        if (typeof cs === 'number' && Number.isFinite(cs)) {
          rawColSpan = Math.max(0, Math.floor(cs));
        }
      }

      // Chặn ô trả về 0 khi không có ô neo phủ phía trên để tránh hổng bảng
      if (rawRowSpan <= 0 || rawColSpan <= 0) {
        rowCells[c] = { kind: 'normal' };
        continue;
      }

      // Giới hạn colSpan trong cùng pin partition và không đè vào ô đã chiếm
      let effColSpan = Math.min(rawColSpan, maxColSpanInPart[c]);
      for (let dc = 1; dc < effColSpan; dc++) {
        if (occupancy[rowOffset + c + dc] !== 0) {
          effColSpan = dc;
          break;
        }
      }

      // Giới hạn rowSpan không vượt quá tổng số dòng, safeLookback, dòng tổng hợp hoặc ô đã chiếm
      let effRowSpan = Math.min(rawRowSpan, totalRows - r, safeLookback);
      for (let dr = 1; dr < effRowSpan; dr++) {
        const checkRow = safeGetRow(r + dr);
        if (isSyntheticGridRow(checkRow)) {
          effRowSpan = dr;
          break;
        }
        const checkLocalR = localR + dr;
        if (checkLocalR < scanCount) {
          const checkBase = checkLocalR * numCols;
          let conflict = false;
          for (let dc = 0; dc < effColSpan; dc++) {
            if (occupancy[checkBase + c + dc] !== 0) {
              conflict = true;
              break;
            }
          }
          if (conflict) {
            effRowSpan = dr;
            break;
          }
        }
      }

      if (effColSpan <= 1 && effRowSpan <= 1) {
        rowCells[c] = { kind: 'normal' };
        continue;
      }

      // Đánh dấu vùng bị chiếm trên lưới 2D
      for (let dc = 1; dc < effColSpan; dc++) {
        occupancy[rowOffset + c + dc] = 1;
      }
      if (effRowSpan > 1) {
        for (let dr = 1; dr < effRowSpan; dr++) {
          const targetLocalR = localR + dr;
          if (targetLocalR >= scanCount) break;
          const targetBase = targetLocalR * numCols;
          for (let dc = 0; dc < effColSpan; dc++) {
            occupancy[targetBase + c + dc] = 2;
          }
        }
      }

      let widthPx = 0;
      for (let dc = 0; dc < effColSpan; dc++) {
        widthPx += colWidthsArr[c + dc];
      }

      const endColKey = columns[c + effColSpan - 1]?.key;
      const hasRightPinnedDivider = Boolean(
        lastEffectiveLeftColKey && endColKey === lastEffectiveLeftColKey
      );

      let heightPx: number | undefined;
      if (effRowSpan > 1) {
        rowHasVerticalSpan = true;
        hasAnyVerticalSpan = true;
        heightPx = Math.max(baseRowHeight, getRowTop(r + effRowSpan) - getRowTop(r));
      }

      rowCells[c] = {
        kind: 'anchor',
        rowSpan: effRowSpan,
        colSpan: effColSpan,
        widthPx,
        heightPx,
        hasRightPinnedDivider,
      };
      rowHasSpecial = true;
    }

    const reachesVisibleWindow =
      r >= startRow || (rowHasVerticalSpan && r + safeLookback >= startRow);

    if (rowHasSpecial && isVisibleOrBeforeTarget && reachesVisibleWindow) {
      let anchorReachesStart = r >= startRow;
      if (!anchorReachesStart && rowHasVerticalSpan) {
        for (let c = 0; c < numCols; c++) {
          const plan = rowCells[c];
          if (plan.kind === 'anchor' && plan.rowSpan > 1 && r + plan.rowSpan - 1 >= startRow) {
            anchorReachesStart = true;
            anchorRowsBeforeStart.push(r);
            break;
          }
        }
      }
      if (anchorReachesStart) {
        rowPlans.set(r, {
          cells: rowCells,
          hasVerticalSpan: rowHasVerticalSpan,
          hasCoveredFromAbove: rowHasCoveredFromAbove,
        });
      }
    }
  }

  return { rowPlans, anchorRowsBeforeStart, hasAnyVerticalSpan };
}
