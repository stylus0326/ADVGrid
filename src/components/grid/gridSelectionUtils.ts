/**
 * Cấu trúc trạng thái chọn dòng khi có hoặc không có bộ lọc
 */
export interface FilteredSelectionState {
  allChecked: boolean;
  isIndeterminate: boolean;
  selectedCount: number;
  totalCount: number;
}

/**
 * Tính toán trạng thái chọn dòng tối ưu hóa:
 * Khi bảng không bật bộ lọc (activeRowIndices === null) và số lượng dòng đang chọn < tổng số dòng,
 * hàm chỉ duyệt qua tập checkedRowIndices (k phần tử) thay vì quét đủ 50.000 dòng.
 */
export function computeFilteredSelectionState(
  totalRows: number,
  checkedRowIndices: Set<number>,
  activeRowIndices: number[] | null = null
): FilteredSelectionState {
  const isFiltered = activeRowIndices !== null;
  const totalCount = isFiltered ? activeRowIndices.length : Math.max(0, totalRows);

  if (totalCount === 0) {
    return {
      allChecked: false,
      isIndeterminate: false,
      selectedCount: 0,
      totalCount: 0,
    };
  }

  let selectedCount = 0;

  if (isFiltered) {
    for (let i = 0; i < activeRowIndices.length; i++) {
      if (checkedRowIndices.has(activeRowIndices[i])) {
        selectedCount++;
      }
    }
  } else {
    if (checkedRowIndices.size === 0) {
      selectedCount = 0;
    } else {
      for (const idx of checkedRowIndices) {
        if (idx >= 0 && idx < totalCount) {
          selectedCount++;
        }
      }
    }
  }

  const allChecked = selectedCount > 0 && selectedCount === totalCount;
  const isIndeterminate = selectedCount > 0 && selectedCount < totalCount;

  return {
    allChecked,
    isIndeterminate,
    selectedCount,
    totalCount,
  };
}

/**
 * Đảo / Bật / Tắt chọn hàng loạt các dòng theo bộ lọc đang hiển thị:
 * Fast-path O(1): Khi bỏ chọn toàn bộ trên bảng đang không lọc, trả về ngay new Set<number>() trong O(1).
 */
export function toggleFilteredRowsSelection(
  totalRows: number,
  currentChecked: Set<number>,
  activeRowIndices: number[] | null = null,
  forceSelect?: boolean
): Set<number> {
  const selectionState = computeFilteredSelectionState(totalRows, currentChecked, activeRowIndices);
  const shouldSelect = forceSelect !== undefined ? forceSelect : !selectionState.allChecked;

  if (!shouldSelect && (activeRowIndices === null || activeRowIndices.length === totalRows)) {
    return new Set<number>();
  }

  const next = new Set<number>(currentChecked);

  if (activeRowIndices === null) {
    if (shouldSelect) {
      for (let i = 0; i < totalRows; i++) {
        next.add(i);
      }
    } else {
      for (let i = 0; i < totalRows; i++) {
        next.delete(i);
      }
    }
  } else {
    for (let i = 0; i < activeRowIndices.length; i++) {
      const idx = activeRowIndices[i];
      if (shouldSelect) {
        next.add(idx);
      } else {
        next.delete(idx);
      }
    }
  }

  return next;
}
