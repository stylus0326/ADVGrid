import { useState, useRef, useEffect, useCallback, RefObject } from 'react';

interface UseInCellEditorParams {
  controlledEditingCell?: { rowIndex: number; colKey: string } | null;
  onStartEditCell?: (rowIndex: number, colKey: string) => void;
  onEndEditCell?: () => void;
  scrollContainerRef: RefObject<HTMLDivElement | null>;
}

export function useInCellEditor({
  controlledEditingCell,
  onStartEditCell,
  onEndEditCell,
  scrollContainerRef,
}: UseInCellEditorParams) {
  const [internalEditingCell, setInternalEditingCell] = useState<{
    rowIndex: number;
    colKey: string;
  } | null>(null);

  const activeEditingCell =
    controlledEditingCell !== undefined ? controlledEditingCell : internalEditingCell;

  const handleStartEditCell = useCallback(
    (rowIndex: number, colKey: string) => {
      onStartEditCell?.(rowIndex, colKey);
      setInternalEditingCell({ rowIndex, colKey });
    },
    [onStartEditCell]
  );

  const handleEndEditCell = useCallback(() => {
    onEndEditCell?.();
    setInternalEditingCell(null);
  }, [onEndEditCell]);

  const lockedScrollPosRef = useRef<{ top: number; left: number } | null>(null);

  // In-Cell Editing Scroll Lock: Ghi nhớ và bảo vệ tọa độ cuộn khi đang sửa ô (global wheel lock do VirtualizedGrid hợp nhất xử lý)
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    if (activeEditingCell) {
      lockedScrollPosRef.current = {
        top: el.scrollTop,
        left: el.scrollLeft,
      };
    } else if (lockedScrollPosRef.current) {
      el.scrollTop = lockedScrollPosRef.current.top;
      el.scrollLeft = lockedScrollPosRef.current.left;
      lockedScrollPosRef.current = null;
    }
  }, [activeEditingCell, scrollContainerRef]);

  return {
    activeEditingCell,
    handleStartEditCell,
    handleEndEditCell,
    lockedScrollPosRef,
  };
}
