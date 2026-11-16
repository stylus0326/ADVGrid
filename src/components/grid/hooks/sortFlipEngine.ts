/**
 * Kết quả tính toán trạng thái FLIP (First - Last - Invert - Play) cho từng dòng khi Sort
 */
export interface SortRowFlipState {
  deltaY: number;
  initialOpacity: number;
  zIndex: number;
}

/**
 * Tính toán độ lệch vị trí dọc (FLIP Invert deltaY) cho hiệu ứng trượt dòng khi Sort chuẩn AG Grid:
 * 1. Nếu dòng di chuyển trong vùng nhìn thấy / lân cận (<= maxDirectRows):
 *    Trượt FLIP chính xác 100% từ tọa độ dòng cũ (oldRowIndex) sang tọa độ dòng mới (newRowIndex).
 * 2. Nếu dòng bay từ vùng xa ngoài khung nhìn vào (> maxDirectRows hoặc ngoài vùng chunk cũ):
 *    Phân bổ đan chéo 2 chiều để các dòng lướt đan xen tự nhiên.
 * 3. Luôn khóa biên trên (newRowIndex + deltaRows >= 0) để dòng không bao giờ trồi lên vùng Header.
 */
export function computeSortRowFlipState(params: {
  rowKey: string;
  newRowIndex: number;
  oldRowIndex: number | undefined;
  rowHeight: number;
  viewportCenterRow: number;
  prevStartRow: number;
  maxDirectRows?: number;
}): SortRowFlipState | null {
  const {
    rowKey,
    newRowIndex,
    oldRowIndex,
    rowHeight,
    maxDirectRows = 12,
  } = params;

  if (rowHeight <= 0 || newRowIndex < 0) return null;

  if (oldRowIndex !== undefined) {
    const rawDeltaRows = oldRowIndex - newRowIndex;
    if (rawDeltaRows === 0) return null;

    if (Math.abs(rawDeltaRows) <= maxDirectRows) {
      const safeDeltaRows = Math.max(-newRowIndex, rawDeltaRows);
      const deltaY = Math.round(safeDeltaRows * rowHeight);
      if (deltaY === 0) return null;
      return {
        deltaY,
        initialOpacity: 1,
        zIndex: rawDeltaRows < 0 ? 3 : 2,
      };
    }
  }

  const INTERLEAVE_OFFSETS = [2.5, 4.0, -2.0, -2.0, 3.5, -3.0, 3.0, -3.5];
  const baseOffset = INTERLEAVE_OFFSETS[newRowIndex % INTERLEAVE_OFFSETS.length];

  let hash = 0;
  for (let i = 0; i < rowKey.length; i++) {
    hash = (hash * 31 + rowKey.charCodeAt(i)) | 0;
  }
  const jitter = ((Math.abs(hash) % 3) - 1) * 0.25;
  const rawTravelRows = baseOffset + (baseOffset > 0 ? jitter : -jitter);
  const clampedRows = Math.max(-newRowIndex, Math.min(maxDirectRows, rawTravelRows));

  const deltaY = Math.round(clampedRows * rowHeight);
  if (deltaY === 0) return null;

  return {
    deltaY,
    initialOpacity: 1,
    zIndex: clampedRows < 0 ? 3 : 2,
  };
}

export function runSortFlipAnimation(params: {
  viewportEl: HTMLDivElement;
  prevMap: Map<string, number>;
  prevStartRow: number;
  viewportCenterRow: number;
  actualRowHeight: number;
  activeAnimatedRowsRef: React.MutableRefObject<HTMLElement[]>;
  sortAnimRafRef: React.MutableRefObject<number | null>;
  sortAnimTimeoutRef: React.MutableRefObject<number | null>;
}): void {
  const {
    viewportEl,
    prevMap,
    prevStartRow,
    viewportCenterRow,
    actualRowHeight,
    activeAnimatedRowsRef,
    sortAnimRafRef,
    sortAnimTimeoutRef,
  } = params;

  if (sortAnimRafRef.current !== null) {
    cancelAnimationFrame(sortAnimRafRef.current);
    sortAnimRafRef.current = null;
  }
  if (sortAnimTimeoutRef.current !== null) {
    window.clearTimeout(sortAnimTimeoutRef.current);
    sortAnimTimeoutRef.current = null;
  }
  for (const el of activeAnimatedRowsRef.current) {
    el.style.transition = '';
    el.style.transform = '';
    el.style.opacity = '';
    el.style.zIndex = '';
    el.style.willChange = '';
  }
  activeAnimatedRowsRef.current = [];

  const rowNodes = viewportEl.querySelectorAll<HTMLElement>(
    '.agv-rows-canvas [data-row-key]'
  );
  const animatedEls: HTMLElement[] = [];

  rowNodes.forEach((rowEl) => {
    const rKey = rowEl.getAttribute('data-row-key');
    const rIdxAttr = rowEl.getAttribute('data-row-idx');
    if (!rKey || rIdxAttr === null) return;
    const newRowIdx = parseInt(rIdxAttr, 10);
    if (Number.isNaN(newRowIdx) || newRowIdx < 0) return;

    const oldRowIdx = prevMap.get(rKey);
    const flip = computeSortRowFlipState({
      rowKey: rKey,
      newRowIndex: newRowIdx,
      oldRowIndex: oldRowIdx,
      rowHeight: actualRowHeight,
      viewportCenterRow,
      prevStartRow,
    });

    rowEl.style.animation = 'none';
    if (!flip) return;

    rowEl.style.transition = 'none';
    rowEl.style.willChange = 'transform, opacity';
    rowEl.style.transform = `translate3d(0px, ${flip.deltaY}px, 0px)`;
    if (flip.initialOpacity < 1) {
      rowEl.style.opacity = String(flip.initialOpacity);
    }
    rowEl.style.zIndex = String(flip.zIndex);
    animatedEls.push(rowEl);
  });

  if (animatedEls.length > 0) {
    viewportEl.setAttribute('data-agv-sorting', 'true');
    activeAnimatedRowsRef.current = animatedEls;
    void viewportEl.offsetHeight;

    sortAnimRafRef.current = requestAnimationFrame(() => {
      sortAnimRafRef.current = null;
      for (const el of animatedEls) {
        el.style.transition =
          'transform 300ms cubic-bezier(0.22, 1, 0.36, 1), opacity 220ms ease-out';
        el.style.transform = 'translate3d(0px, 0px, 0px)';
        el.style.opacity = '1';
      }
    });

    sortAnimTimeoutRef.current = window.setTimeout(() => {
      sortAnimTimeoutRef.current = null;
      for (const el of activeAnimatedRowsRef.current) {
        el.style.transition = '';
        el.style.transform = '';
        el.style.opacity = '';
        el.style.zIndex = '';
        el.style.willChange = '';
      }
      activeAnimatedRowsRef.current = [];
      viewportEl.removeAttribute('data-agv-sorting');
    }, 320);
  }
}

