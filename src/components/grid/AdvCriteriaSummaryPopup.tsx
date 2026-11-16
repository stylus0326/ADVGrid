import React, { useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import {
  ColumnDef,
  ColumnFilterValue,
  SortConfig,
  GroupSortConfig,
  FILTER_OPS,
  CHECK_FILTER_STATES,
  DATA_TYPES,
  EDITOR_TYPES,
  FILTER_MODES,
  SORT_DIRECTIONS,
  SURFACE_THEMES,
} from './types';
import { getThemeClass } from '../../themes';
import { AdvOverlayScroll } from '../ui/AdvOverlayScroll';
import { AdvAnchoredPopover } from '../ui/AdvPopover';
import { AdvButton } from '../ui/AdvButton';
import { BUTTON_FOCUS_VISIBLE_CLASS } from '../ui/controlFocus';
import { FILTER_OP_META } from './FilterIcons';
import { formatDisplayDate, isNoInputFilterOp, isBetweenFilterOp } from './gridFormatUtils';
import { hasActiveQueryRules, generateNaturalLanguage } from './floating/queryUtils';

export interface AdvCriteriaSummaryPopupProps {
  isOpen: boolean;
  onClose: () => void;
  anchorRect: { top: number; left: number; bottom: number; right: number; width?: number; height?: number } | null;
  anchorEl?: HTMLElement | null;
  surfaceTheme?: string;
  columns: ColumnDef<any>[];
  groupByColumnKey?: string | null;
  columnFilters?: Record<string, ColumnFilterValue>;
  quickFilterText?: string;
  sortConfig?: SortConfig | null;
  sortRules?: SortConfig[];
  groupSortConfig?: GroupSortConfig | null;
  appliedQueryTree?: any;
  pinnedRows?: Array<{ rowKey: string | number; rowIndex: number; row: any }>;
  onClearRowFilter?: (colKey: string) => void;
  onClearChecklistFilter?: (colKey: string) => void;
  onClearGroup?: () => void;
  onClearQuickSearch?: () => void;
  onClearSortRow?: () => void;
  onRemoveSortRule?: (colKey: string) => void;
  onClearSortGroup?: () => void;
  onClearQueryTree?: () => void;
  onUnpinRow?: (rowKey: string | number) => void;
  onClearAll?: () => void;
}

export const AdvCriteriaSummaryPopup: React.FC<AdvCriteriaSummaryPopupProps> = ({
  isOpen,
  onClose,
  anchorRect,
  anchorEl = null,
  surfaceTheme = SURFACE_THEMES.LIGHT,
  columns,
  groupByColumnKey,
  columnFilters = {},
  quickFilterText,
  sortConfig,
  sortRules,
  groupSortConfig,
  appliedQueryTree,
  pinnedRows = [],
  onClearRowFilter,
  onClearChecklistFilter,
  onClearGroup,
  onClearQuickSearch,
  onClearSortRow,
  onRemoveSortRule,
  onClearSortGroup,
  onClearQueryTree,
  onUnpinRow,
  onClearAll,
}) => {
  const popupRef = useRef<HTMLDivElement>(null);

  // Click outside to close (ngoại trừ click vào chính nút trigger để trigger tự toggle)
  useEffect(() => {
    if (!isOpen || anchorEl) return;
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (popupRef.current && popupRef.current.contains(target)) return;
      if (target.closest('[data-summary-trigger="true"]')) return;
      onClose();
    };
    document.addEventListener('mousedown', handleClickOutside, true);
    document.addEventListener('touchstart', handleClickOutside, true);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
      document.removeEventListener('touchstart', handleClickOutside, true);
    };
  }, [isOpen, onClose]);

  // Map colKey -> title
  const colTitleMap = useMemo(() => {
    const map: Record<string, string> = {};
    for (const c of columns) {
      map[c.key] = c.title || c.key;
    }
    return map;
  }, [columns]);

  const colDefMap = useMemo(() => {
    const map: Record<string, ColumnDef<any>> = {};
    for (const c of columns) {
      map[c.key] = c;
    }
    return map;
  }, [columns]);

  // 1. Nhóm theo
  const groupText = useMemo(() => {
    if (!groupByColumnKey) return null;
    return colTitleMap[groupByColumnKey] || groupByColumnKey;
  }, [groupByColumnKey, colTitleMap]);

  // 2. Lọc theo (Dòng filter)
  const rowFilterItems = useMemo(() => {
    const items: Array<{ key: string; label: string; valueText: string }> = [];
    for (const [k, f] of Object.entries(columnFilters)) {
      if (!f) continue;
      const title = colTitleMap[k] || k;
      const targetCol = colDefMap[k];
      if (targetCol?.isSelection || (targetCol?.dataType === DATA_TYPES.SYSTEM && !targetCol.title)) {
        if (f.val === CHECK_FILTER_STATES.CHECKED || f.val === CHECK_FILTER_STATES.UNCHECKED) {
          items.push({
            key: k,
            label: title,
            valueText: f.val === CHECK_FILTER_STATES.CHECKED ? 'Đã chọn' : 'Chưa chọn',
          });
        }
        continue;
      }

      const isMulti =
        f.mode === FILTER_MODES.MULTI &&
        Boolean(
          (Array.isArray(f.multiValues) && f.multiValues.length > 0) ||
          (Array.isArray(f.multiRanges) && f.multiRanges.length > 0)
        );
      const isUnary = isNoInputFilterOp(f.op);
      const hasVal = typeof f.val === 'string' && f.val.trim().length > 0;
      const opLabel = FILTER_OP_META[f.op]?.label || f.op;

      if (isMulti) {
        if (Array.isArray(f.multiValues) && f.multiValues.length > 0) {
          items.push({
            key: k,
            label: title,
            valueText: `${opLabel} (${f.multiValues.length} giá trị)`,
          });
        } else if (Array.isArray(f.multiRanges) && f.multiRanges.length > 0) {
          items.push({
            key: k,
            label: title,
            valueText: `${f.multiRanges.length} khoảng`,
          });
        }
      } else if (isUnary) {
        items.push({
          key: k,
          label: title,
          valueText: opLabel,
        });
      } else if (isBetweenFilterOp(f.op)) {
        if (f.val) {
          const [fromVal, toVal] = f.val.split('..');
          const targetCol = colDefMap[k];
          const isDateCol = targetCol?.dataType === DATA_TYPES.DATE || targetCol?.editorType === EDITOR_TYPES.DATE || targetCol?.isDateRange;
          const displayFrom = isDateCol && fromVal ? formatDisplayDate(fromVal, false) : fromVal;
          const displayTo = isDateCol && toVal ? formatDisplayDate(toVal, false) : toVal;
          items.push({
            key: k,
            label: title,
            valueText: `${displayFrom || '...'} → ${displayTo || '...'}`,
          });
        }
      } else if (hasVal) {
        items.push({
          key: k,
          label: title,
          valueText:
            f.op === FILTER_OPS.CONTAINS || f.op === FILTER_OPS.EQUALS
              ? `"${f.val}"`
              : `${opLabel} "${f.val}"`,
        });
      }
    }
    return items;
  }, [columnFilters, colTitleMap, colDefMap]);

  // 3. Đang chọn (Phễu)
  const checklistItems = useMemo(() => {
    const items: Array<{ key: string; label: string; valueText: string }> = [];
    for (const [k, f] of Object.entries(columnFilters)) {
      if (!f) continue;
      const hasSelected = Array.isArray(f.selectedValues) && f.selectedValues.length > 0;
      const hasBlanks = Boolean(f.includeBlanks);
      if (!hasSelected && !hasBlanks) continue;

      const title = colTitleMap[k] || k;
      const isDateCol = colDefMap[k]?.dataType === DATA_TYPES.DATE;
      const parts: string[] = [];
      if (hasSelected) {
        const formattedValues = isDateCol
          ? f.selectedValues!.slice(0, 2).map((v) => formatDisplayDate(v))
          : f.selectedValues!.slice(0, 2);
        const preview = formattedValues.join(', ');
        const extra = f.selectedValues!.length > 2 ? ` (+${f.selectedValues!.length - 2})` : '';
        parts.push(`${preview}${extra}`);
      }
      if (hasBlanks) {
        parts.push('(Trống)');
      }
      items.push({
        key: k,
        label: title,
        valueText: parts.join(', '),
      });
    }
    return items;
  }, [columnFilters, colTitleMap, colDefMap]);

  // 4. Tìm giá trị theo
  const searchText = useMemo(() => {
    if (!quickFilterText || !quickFilterText.trim()) return null;
    return `"${quickFilterText.trim()}"`;
  }, [quickFilterText]);

  // 5. Sắp xếp dòng theo
  const sortRowItems = useMemo(() => {
    const active =
      sortRules && sortRules.length > 0
        ? sortRules
        : sortConfig?.key
        ? [sortConfig]
        : [];
    return active.map((rule, idx) => {
      const title = colTitleMap[rule.key] || rule.key;
      const dir = rule.direction === SORT_DIRECTIONS.ASC ? 'Tăng dần' : 'Giảm dần';
      return {
        key: rule.key,
        label: active.length >= 2 ? `${idx + 1}. ${title}` : title,
        dir,
      };
    });
  }, [sortRules, sortConfig, colTitleMap]);

  // 6. Sắp xếp nhóm theo
  const sortGroupInfo = useMemo(() => {
    if (!groupSortConfig || !groupSortConfig.colKey) return null;
    const title = colTitleMap[groupSortConfig.colKey] || groupSortConfig.colKey;
    const dir = groupSortConfig.direction === SORT_DIRECTIONS.ASC ? 'Tăng dần' : 'Giảm dần';
    return { label: title, dir };
  }, [groupSortConfig, colTitleMap]);

  // 7. Cây điều kiện
  const queryTreeText = useMemo(() => {
    if (!appliedQueryTree || !hasActiveQueryRules(appliedQueryTree)) return null;
    return generateNaturalLanguage(appliedQueryTree, columns);
  }, [appliedQueryTree, columns]);

  // 8. Dòng đang ghim
  const pinnedRowItems = useMemo(() => {
    if (!pinnedRows || pinnedRows.length === 0) return [];
    const displayCols = columns.filter(
      (c) =>
        !c.isRowNumber &&
        !c.isSelection &&
        c.dataType !== DATA_TYPES.SYSTEM &&
        !c.isChart
    );
    return pinnedRows.map((p) => {
      const origIdx =
        typeof p.row?.originalIndex === 'number' ? p.row.originalIndex : p.rowIndex;
      const stt = origIdx + 1;
      let valText = '';
      for (const col of displayCols) {
        const raw = p.row?.[col.key];
        if (raw !== undefined && raw !== null && String(raw).trim() !== '') {
          valText = String(raw).trim();
          break;
        }
      }
      if (!valText) {
        valText = `${stt}`;
      }
      return {
        rowKey: p.rowKey,
        label: `Dòng #${stt}`,
        valueText: valText,
      };
    });
  }, [pinnedRows, columns]);

  // Tổng số tiêu chí đang active
  const totalActive = useMemo(() => {
    return (
      (groupText ? 1 : 0) +
      rowFilterItems.length +
      checklistItems.length +
      (searchText ? 1 : 0) +
      sortRowItems.length +
      (sortGroupInfo ? 1 : 0) +
      (queryTreeText ? 1 : 0) +
      pinnedRowItems.length
    );
  }, [
    groupText,
    rowFilterItems,
    checklistItems,
    searchText,
    sortRowItems,
    sortGroupInfo,
    queryTreeText,
    pinnedRowItems,
  ]);

  if (!isOpen || (!anchorEl && !anchorRect)) return null;

  const vw = typeof window !== 'undefined' ? window.innerWidth : 1280;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
  const padding = 8;
  const popupWidth = 360;

  let left = anchorRect ? anchorRect.left : padding;
  if (left + popupWidth > vw - padding) {
    left = vw - popupWidth - padding;
  }
  if (left < padding) left = padding;

  const spaceBelow = anchorRect ? vh - anchorRect.bottom - padding : vh - 120;
  const spaceAbove = anchorRect ? anchorRect.top - padding : 120;
  const isFlipUp = Boolean(anchorRect && spaceBelow < 260 && spaceAbove > spaceBelow);

  const maxHeight = anchorEl
    ? Math.max(200, Math.min(520, vh - 120))
    : isFlipUp
    ? Math.max(160, Math.min(520, spaceAbove - 8))
    : Math.max(160, Math.min(520, spaceBelow - 8));

  const innerSections = (
    <>
      {/* Body: Thiết kế tinh gọn, chỉ liệt kê phần nào CÓ tiêu chí */}
      <AdvOverlayScroll
        className="flex-initial min-h-0"
        viewportClassName="p-3 flex flex-col gap-2.5 overflow-y-auto overflow-x-hidden overscroll-contain"
        viewportStyle={{ maxHeight: `${Math.max(160, maxHeight - (totalActive > 0 ? 44 : 0))}px` }}
        contentSignature={totalActive}
      >
        {totalActive === 0 ? (
          <div className="py-6 text-center text-xs text-[var(--agv-text-muted)] italic select-none">
            Chưa có tiêu chí nào đang áp dụng
          </div>
        ) : (
          <>
            {/* 1. Nhóm theo (Chỉ hiện khi có) */}
            {groupText && (
              <div className="flex flex-col gap-1.5">
                <span className="font-bold text-xs text-[var(--agv-text-muted)] uppercase tracking-wide">
                  NHÓM THEO (1)
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <div className="inline-flex items-center rounded border border-[var(--agv-border-strong)] bg-[var(--agv-bg-control)] overflow-hidden">
                    <span className="min-h-[28px] h-7 px-2.5 flex items-center justify-center bg-agv-accent text-agv-accent-text font-bold text-xs select-none">
                      {groupText}
                    </span>
                    <span className="min-h-[28px] h-7 px-2 flex items-center text-xs text-[var(--agv-text-main)] select-none border-l border-[var(--agv-border)]">
                      Nhóm
                    </span>
                    <button
                      type="button"
                      onClick={onClearGroup}
                      className={`min-h-[28px] min-w-[28px] h-7 w-7 flex items-center justify-center text-xs text-[var(--agv-text-muted)] hover:text-[var(--agv-danger)] hover:bg-[var(--agv-danger-bg)] transition cursor-pointer select-none border-l border-[var(--agv-border)] ${BUTTON_FOCUS_VISIBLE_CLASS}`}
                    >
                      <X size={11} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Lọc theo (Chỉ hiện khi có) */}
            {rowFilterItems.length > 0 && (
              <div className="flex flex-col gap-1.5">
                <span className="font-bold text-xs text-[var(--agv-text-muted)] uppercase tracking-wide">
                  LỌC THEO ({rowFilterItems.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {rowFilterItems.map((item) => (
                    <div
                      key={item.key}
                      className="inline-flex items-center rounded border border-[var(--agv-border-strong)] bg-[var(--agv-bg-control)] overflow-hidden"
                    >
                      <span className="min-h-[28px] h-7 px-2.5 flex items-center justify-center bg-agv-accent text-agv-accent-text font-bold text-xs select-none">
                        {item.label}
                      </span>
                      <span className="min-h-[28px] h-7 px-2 flex items-center text-xs text-[var(--agv-text-main)] select-none border-l border-[var(--agv-border)] max-w-[180px] truncate">
                        {item.valueText}
                      </span>
                      <button
                        type="button"
                        onClick={() => onClearRowFilter?.(item.key)}
                        className={`min-h-[28px] min-w-[28px] h-7 w-7 flex items-center justify-center text-xs text-[var(--agv-text-muted)] hover:text-[var(--agv-danger)] hover:bg-[var(--agv-danger-bg)] transition cursor-pointer select-none border-l border-[var(--agv-border)] ${BUTTON_FOCUS_VISIBLE_CLASS}`}
                      >
                        <X size={11} strokeWidth={2.5} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Đang chọn (Chỉ hiện khi có) */}
            {checklistItems.length > 0 && (
              <div className="flex flex-col gap-1.5">
                <span className="font-bold text-xs text-[var(--agv-text-muted)] uppercase tracking-wide">
                  ĐANG CHỌN ({checklistItems.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {checklistItems.map((item) => (
                    <div
                      key={item.key}
                      className="inline-flex items-center rounded border border-[var(--agv-border-strong)] bg-[var(--agv-bg-control)] overflow-hidden"
                    >
                      <span className="min-h-[28px] h-7 px-2.5 flex items-center justify-center bg-agv-accent text-agv-accent-text font-bold text-xs select-none">
                        {item.label}
                      </span>
                      <span className="min-h-[28px] h-7 px-2 flex items-center text-xs text-[var(--agv-text-main)] select-none border-l border-[var(--agv-border)] max-w-[180px] truncate">
                        {item.valueText}
                      </span>
                      <button
                        type="button"
                        onClick={() => onClearChecklistFilter?.(item.key)}
                        className={`min-h-[28px] min-w-[28px] h-7 w-7 flex items-center justify-center text-xs text-[var(--agv-text-muted)] hover:text-[var(--agv-danger)] hover:bg-[var(--agv-danger-bg)] transition cursor-pointer select-none border-l border-[var(--agv-border)] ${BUTTON_FOCUS_VISIBLE_CLASS}`}
                      >
                        <X size={11} strokeWidth={2.5} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Tìm giá trị theo (Chỉ hiện khi có - không có tag xanh) */}
            {searchText && (
              <div className="flex flex-col gap-1.5">
                <span className="font-bold text-xs text-[var(--agv-text-muted)] uppercase tracking-wide">
                  TÌM GIÁ TRỊ THEO (1)
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <div className="inline-flex items-center rounded border border-[var(--agv-border-strong)] bg-[var(--agv-bg-control)] overflow-hidden">
                    <span className="min-h-[28px] h-7 px-2.5 flex items-center text-xs text-[var(--agv-text-main)] select-none max-w-[280px] truncate">
                      {searchText}
                    </span>
                    <button
                      type="button"
                      onClick={onClearQuickSearch}
                      className={`min-h-[28px] min-w-[28px] h-7 w-7 flex items-center justify-center text-xs text-[var(--agv-text-muted)] hover:text-[var(--agv-danger)] hover:bg-[var(--agv-danger-bg)] transition cursor-pointer select-none border-l border-[var(--agv-border)] ${BUTTON_FOCUS_VISIBLE_CLASS}`}
                    >
                      <X size={11} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 5. Sắp xếp dòng theo (Chỉ hiện khi có) */}
            {sortRowItems.length > 0 && (
              <div className="flex flex-col gap-1.5">
                <span className="font-bold text-xs text-[var(--agv-text-muted)] uppercase tracking-wide">
                  SẮP XẾP DÒNG THEO ({sortRowItems.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {sortRowItems.map((item) => (
                    <div
                      key={item.key}
                      className="inline-flex items-center rounded border border-[var(--agv-border-strong)] bg-[var(--agv-bg-control)] overflow-hidden"
                    >
                      <span className="min-h-[28px] h-7 px-2.5 flex items-center justify-center bg-agv-accent text-agv-accent-text font-bold text-xs select-none">
                        {item.label}
                      </span>
                      <span className="min-h-[28px] h-7 px-2 flex items-center text-xs text-[var(--agv-text-main)] select-none border-l border-[var(--agv-border)]">
                        {item.dir}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          onRemoveSortRule ? onRemoveSortRule(item.key) : onClearSortRow?.()
                        }
                        className={`min-h-[28px] min-w-[28px] h-7 w-7 flex items-center justify-center text-xs text-[var(--agv-text-muted)] hover:text-[var(--agv-danger)] hover:bg-[var(--agv-danger-bg)] transition cursor-pointer select-none border-l border-[var(--agv-border)] ${BUTTON_FOCUS_VISIBLE_CLASS}`}
                      >
                        <X size={11} strokeWidth={2.5} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. Sắp xếp nhóm theo (Chỉ hiện khi có) */}
            {sortGroupInfo && (
              <div className="flex flex-col gap-1.5">
                <span className="font-bold text-xs text-[var(--agv-text-muted)] uppercase tracking-wide">
                  SẮP XẾP NHÓM THEO (1)
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <div className="inline-flex items-center rounded border border-[var(--agv-border-strong)] bg-[var(--agv-bg-control)] overflow-hidden">
                    <span className="min-h-[28px] h-7 px-2.5 flex items-center justify-center bg-agv-accent text-agv-accent-text font-bold text-xs select-none">
                      {sortGroupInfo.label}
                    </span>
                    <span className="min-h-[28px] h-7 px-2 flex items-center text-xs text-[var(--agv-text-main)] select-none border-l border-[var(--agv-border)]">
                      {sortGroupInfo.dir}
                    </span>
                    <button
                      type="button"
                      onClick={onClearSortGroup}
                      className={`min-h-[28px] min-w-[28px] h-7 w-7 flex items-center justify-center text-xs text-[var(--agv-text-muted)] hover:text-[var(--agv-danger)] hover:bg-[var(--agv-danger-bg)] transition cursor-pointer select-none border-l border-[var(--agv-border)] ${BUTTON_FOCUS_VISIBLE_CLASS}`}
                    >
                      <X size={11} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 7. Cây điều kiện (Chỉ hiện khi có - không có tag xanh) */}
            {queryTreeText && (
              <div className="flex flex-col gap-1.5">
                <span className="font-bold text-xs text-[var(--agv-text-muted)] uppercase tracking-wide">
                  CÂY ĐIỀU KIỆN (1)
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <div className="inline-flex items-center rounded border border-[var(--agv-border-strong)] bg-[var(--agv-bg-control)] overflow-hidden w-full max-w-full justify-between">
                    <span
                      className="min-h-[28px] h-auto py-1 px-2.5 flex items-center text-xs text-[var(--agv-text-main)] select-none flex-1 truncate"
                    >
                      {queryTreeText}
                    </span>
                    <button
                      type="button"
                      onClick={onClearQueryTree}
                      className={`min-h-[28px] min-w-[28px] h-7 w-7 flex items-center justify-center text-xs text-[var(--agv-text-muted)] hover:text-[var(--agv-danger)] hover:bg-[var(--agv-danger-bg)] transition cursor-pointer select-none border-l border-[var(--agv-border)] shrink-0 ${BUTTON_FOCUS_VISIBLE_CLASS}`}
                    >
                      <X size={11} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 8. Dòng đang ghim (Chỉ hiện khi có) */}
            {pinnedRowItems.length > 0 && (
              <div className="flex flex-col gap-1.5">
                <span className="font-bold text-xs text-[var(--agv-text-muted)] uppercase tracking-wide">
                  DÒNG ĐANG GHIM ({pinnedRowItems.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {pinnedRowItems.map((item) => (
                    <div
                      key={String(item.rowKey)}
                      className="inline-flex items-center rounded border border-[var(--agv-border-strong)] bg-[var(--agv-bg-control)] overflow-hidden"
                    >
                      <span className="min-h-[28px] h-7 px-2.5 flex items-center justify-center bg-agv-accent text-agv-accent-text font-bold text-xs select-none">
                        {item.label}
                      </span>
                      <span className="min-h-[28px] h-7 px-2 flex items-center text-xs text-[var(--agv-text-main)] select-none border-l border-[var(--agv-border)] max-w-[180px] truncate">
                        {item.valueText}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUnpinRow?.(item.rowKey)}
                        className={`min-h-[28px] min-w-[28px] h-7 w-7 flex items-center justify-center text-xs text-[var(--agv-text-muted)] hover:text-[var(--agv-danger)] hover:bg-[var(--agv-danger-bg)] transition cursor-pointer select-none border-l border-[var(--agv-border)] ${BUTTON_FOCUS_VISIBLE_CLASS}`}
                      >
                        <X size={11} strokeWidth={2.5} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </AdvOverlayScroll>

      {/* Footer: Chỉ hiển thị nút Xóa tất cả tiêu chí; KHÔNG CÓ NÚT ĐÓNG */}
      {totalActive > 0 && (
        <div
          className={`px-3 py-2 border-t border-[var(--agv-border)] shrink-0 min-h-[38px] flex items-center ${
            anchorEl ? 'bg-transparent' : 'bg-[var(--agv-bg-header)]'
          }`}
        >
          <AdvButton
            variant="destructive"
            size="sm"
            onClick={() => {
              onClearAll?.();
              onClose();
            }}
            className="w-full"
          >
            Xóa tất cả tiêu chí
          </AdvButton>
        </div>
      )}
    </>
  );

  if (anchorEl) {
    return (
      <AdvAnchoredPopover
        isOpen={isOpen}
        anchorEl={anchorEl}
        onClose={onClose}
        placement="bottom-start"
        showArrow={true}
        offset={10}
        width={popupWidth}
        minWidth={300}
        maxWidth="calc(100vw - 24px)"
        paddingClassName="p-0"
        contentClassName="text-xs"
        zIndex={99999999}
        theme={surfaceTheme}
        ignoreClickOutsideSelectors=".agv-select-portal, .agv-portal-dropdown, .agv-floating-popup, [data-summary-trigger='true'], [data-agv-popover-trigger='true']"
      >
        <div className="flex flex-col text-xs overflow-hidden rounded-md select-none">
          {innerSections}
        </div>
      </AdvAnchoredPopover>
    );
  }

  const popupStyle: React.CSSProperties = {
    position: 'fixed',
    left: `${left}px`,
    width: `${popupWidth}px`,
    maxWidth: 'calc(100vw - 16px)',
    maxHeight: `${maxHeight}px`,
    zIndex: 99999999,
    backgroundColor: 'var(--popup-background)',
    borderColor: 'var(--popup-border)',
    boxShadow: 'var(--popup-shadow)',
    color: 'var(--agv-text-main)',
  };

  if (isFlipUp && anchorRect) {
    popupStyle.bottom = `${vh - anchorRect.top + 4}px`;
    popupStyle.top = 'auto';
  } else if (anchorRect) {
    popupStyle.top = `${anchorRect.bottom + 4}px`;
    popupStyle.bottom = 'auto';
  }

  return createPortal(
    <div
      ref={popupRef}
      style={popupStyle}
      className={`agv-criteria-summary-popup agv-popup-panel flex flex-col rounded-md border text-xs overflow-hidden select-none ${
        isFlipUp ? 'agv-spring-up' : 'agv-spring-down'
      } ${getThemeClass(
        surfaceTheme as any
      )}`}
      data-theme={surfaceTheme}
      data-agv-popup="true"
      onClick={(e) => e.stopPropagation()}
      onWheel={(e) => e.stopPropagation()}
    >
      {innerSections}
    </div>,
    document.body
  );
};
