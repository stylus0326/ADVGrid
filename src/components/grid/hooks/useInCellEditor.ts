import { useState, useRef, useEffect, useCallback, RefObject } from 'react';
import { POPUP_SELECTORS } from '../constants';

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
  // In-Cell Editing State (uncontrolled fallback)
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

  // In-Cell Editing Scroll Lock: Ghi nhớ và bảo vệ tuyệt đối tọa độ cuộn (ngang & dọc) khi đang sửa ô
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    if (activeEditingCell) {
      lockedScrollPosRef.current = {
        top: el.scrollTop,
        left: el.scrollLeft,
      };
    } else {
      if (lockedScrollPosRef.current) {
        el.scrollTop = lockedScrollPosRef.current.top;
        el.scrollLeft = lockedScrollPosRef.current.left;
        lockedScrollPosRef.current = null;
      }
    }
  }, [activeEditingCell, scrollContainerRef]);

  // In-Cell Editing Global Event Lock: Chặn 100% sự kiện cuộn (wheel, touchpad, touchmove) trên toàn màn hình khi đang sửa
  useEffect(() => {
    if (!activeEditingCell) return;

    const handleGlobalWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement | null;
      // Cho phép cuộn bên trong danh sách thả xuống của Dropdown editor (ComboBox, SearchLookUp, DatePicker)
      if (target && target.closest(POPUP_SELECTORS)) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
    };

    const handleGlobalTouchMove = (e: TouchEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && target.closest(POPUP_SELECTORS)) {
        return;
      }
      e.preventDefault();
    };

    window.addEventListener('wheel', handleGlobalWheel, { passive: false, capture: true });
    window.addEventListener('touchmove', handleGlobalTouchMove, { passive: false, capture: true });

    return () => {
      window.removeEventListener('wheel', handleGlobalWheel, { capture: true });
      window.removeEventListener('touchmove', handleGlobalTouchMove, { capture: true });
    };
  }, [activeEditingCell]);

  return {
    activeEditingCell,
    handleStartEditCell,
    handleEndEditCell,
    lockedScrollPosRef,
  };
}
