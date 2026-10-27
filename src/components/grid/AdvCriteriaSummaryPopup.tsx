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
} from './types';
import { getThemeClass } from '../../themes';
import { FILTER_OP_META } from './FilterIcons';
import { formatDisplayDate } from '../ui/AdvDatePicker';
import { hasActiveQueryRules, generateNaturalLanguage } from './floating/queryUtils';
import { isNoInputFilterOp, isBetweenFilterOp } from './gridUtils';

export interface AdvCriteriaSummaryPopupProps {
  isOpen: boolean;
  onClose: () => void;
  anchorRect: { top: number; left: number; bottom: number; right: number; width?: number; height?: number } | null;
  surfaceTheme?: string;
  columns: ColumnDef<any>[];
  groupByColumnKey?: string | null;
  columnFilters?: Record<string, ColumnFilterValue>;
  quickFilterText?: string;
  sortConfig?: SortConfig | null;
  groupSortConfig?: GroupSortConfig | null;
  appliedQueryTree?: any;
  onClearRowFilter?: (colKey: string) => void;
  onClearChecklistFilter?: (colKey: string) => void;
  onClearGroup?: () => void;
  onClearQuickSearch?: () => void;
  onClearSortRow?: () => void;
  onClearSortGroup?: () => void;
  onClearQueryTree?: () => void;
  onClearAll?: () => void;
}

export const AdvCriteriaSummaryPopup: React.FC<AdvCriteriaSummaryPopupProps> = ({
  isOpen,
  onClose,
  anchorRect,
  surfaceTheme = 'light',
  columns,
  groupByColumnKey,
  columnFilters = {},
  quickFilterText,
  sortConfig,
  groupSortConfig,
  appliedQueryTree,
  onClearRowFilter,
  onClearChecklistFilter,
  onClearGroup,
  onClearQuickSearch,
  onClearSortRow,
  onClearSortGroup,
  onClearQueryTree,
  onClearAll,
}) => {
  const popupRef = useRef<HTMLDivElement>(null);

  // Click outside to close (ngoại trừ click vào chính nút trigger để trigger tự toggle)
  useEffect(() => {
    if (!isOpen) return;
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
      const parts: string[] = [];
      if (hasSelected) {
        const preview = f.selectedValues!.slice(0, 2).join(', ');
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
  const sortRowInfo = useMemo(() => {
    if (!sortConfig || !sortConfig.key) return null;
    const title = colTitleMap[sortConfig.key] || sortConfig.key;
    const dir = sortConfig.direction === SORT_DIRECTIONS.ASC ? 'Tăng dần' : 'Giảm dần';
    return { label: title, dir };
  }, [sortConfig, colTitleMap]);

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

  // Tổng số tiêu chí đang active
  const totalActive = useMemo(() => {
    return (
      (groupText ? 1 : 0) +
      rowFilterItems.length +
      checklistItems.length +
      (searchText ? 1 : 0) +
      (sortRowInfo ? 1 : 0) +
      (sortGroupInfo ? 1 : 0) +
      (queryTreeText ? 1 : 0)
    );
  }, [groupText, rowFilterItems, checklistItems, searchText, sortRowInfo, sortGroupInfo, queryTreeText]);

  if (!isOpen || !anchorRect) return null;

  // Geometry calculation
  const popupWidth = 360;
  const padding = 8;
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  let left = anchorRect.left;
  if (left + popupWidth > vw - padding) {
    left = vw - popupWidth - padding;
  }
  if (left < padding) left = padding;

  const spaceBelow = vh - anchorRect.bottom - padding;
  const spaceAbove = anchorRect.top - padding;
  const isFlipUp = spaceBelow < 260 && spaceAbove > spaceBelow;

  const maxHeight = isFlipUp
    ? Math.max(160, Math.min(520, spaceAbove - 8))
    : Math.max(160, Math.min(520, spaceBelow - 8));

  const popupStyle: React.CSSProperties = {
    position: 'fixed',
    left: `${left}px`,
    width: `${popupWidth}px`,
    maxWidth: 'calc(100vw - 16px)',
    maxHeight: `${maxHeight}px`,
    zIndex: 99999999,
    backgroundColor: 'var(--agv-bg-popup)',
    borderColor: 'var(--agv-border-popup, var(--agv-border))',
    boxShadow: '0 12px 28px -4px rgba(0, 0, 0, 0.25), 0 8px 12px -6px rgba(0, 0, 0, 0.15)',
    color: 'var(--agv-text-main)',
  };

  if (isFlipUp) {
    popupStyle.bottom = `${vh - anchorRect.top + 4}px`;
    popupStyle.top = 'auto';
  } else {
    popupStyle.top = `${anchorRect.bottom + 4}px`;
    popupStyle.bottom = 'auto';
  }

  return createPortal(
    <div
      ref={popupRef}
      style={popupStyle}
      className={`agv-criteria-summary-popup flex flex-col rounded-md border text-xs overflow-hidden select-none ${
        isFlipUp ? 'agv-spring-up' : 'agv-spring-down'
      } ${getThemeClass(
        surfaceTheme as any
      )}`}
      data-theme={surfaceTheme}
      data-agv-popup="true"
      onClick={(e) => e.stopPropagation()}
      onWheel={(e) => e.stopPropagation()}
    >
      {/* Body: Thiết kế tinh gọn, chỉ liệt kê phần nào CÓ tiêu chí */}
      <div className="p-2.5 flex flex-col gap-2.5 overflow-y-auto max-h-[380px]">
        {totalActive === 0 ? (
          <div className="py-6 text-center text-xs text-[var(--agv-text-muted)] italic select-none">
            Chưa có tiêu chí nào đang áp dụng
          </div>
        ) : (
          <>
            {/* 1. Nhóm theo (Chỉ hiện khi có) */}
            {groupText && (
              <div className="flex flex-col gap-1.5">
                <span className="font-bold text-[11px] text-[var(--agv-text-muted)] uppercase tracking-wide">
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
                      className="min-h-[28px] min-w-[28px] h-7 w-7 flex items-center justify-center text-xs text-[var(--agv-text-muted)] hover:text-[var(--agv-danger,#ef4444)] hover:bg-[var(--agv-danger-bg,rgba(239,68,68,0.1))] transition cursor-pointer select-none border-l border-[var(--agv-border)]"
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
                <span className="font-bold text-[11px] text-[var(--agv-text-muted)] uppercase tracking-wide">
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
                        className="min-h-[28px] min-w-[28px] h-7 w-7 flex items-center justify-center text-xs text-[var(--agv-text-muted)] hover:text-[var(--agv-danger,#ef4444)] hover:bg-[var(--agv-danger-bg,rgba(239,68,68,0.1))] transition cursor-pointer select-none border-l border-[var(--agv-border)]"
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
                <span className="font-bold text-[11px] text-[var(--agv-text-muted)] uppercase tracking-wide">
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
                        className="min-h-[28px] min-w-[28px] h-7 w-7 flex items-center justify-center text-xs text-[var(--agv-text-muted)] hover:text-[var(--agv-danger,#ef4444)] hover:bg-[var(--agv-danger-bg,rgba(239,68,68,0.1))] transition cursor-pointer select-none border-l border-[var(--agv-border)]"
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
                <span className="font-bold text-[11px] text-[var(--agv-text-muted)] uppercase tracking-wide">
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
                      className="min-h-[28px] min-w-[28px] h-7 w-7 flex items-center justify-center text-xs text-[var(--agv-text-muted)] hover:text-[var(--agv-danger,#ef4444)] hover:bg-[var(--agv-danger-bg,rgba(239,68,68,0.1))] transition cursor-pointer select-none border-l border-[var(--agv-border)]"
                    >
                      <X size={11} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 5. Sắp xếp dòng theo (Chỉ hiện khi có) */}
            {sortRowInfo && (
              <div className="flex flex-col gap-1.5">
                <span className="font-bold text-[11px] text-[var(--agv-text-muted)] uppercase tracking-wide">
                  SẮP XẾP DÒNG THEO (1)
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <div className="inline-flex items-center rounded border border-[var(--agv-border-strong)] bg-[var(--agv-bg-control)] overflow-hidden">
                    <span className="min-h-[28px] h-7 px-2.5 flex items-center justify-center bg-agv-accent text-agv-accent-text font-bold text-xs select-none">
                      {sortRowInfo.label}
                    </span>
                    <span className="min-h-[28px] h-7 px-2 flex items-center text-xs text-[var(--agv-text-main)] select-none border-l border-[var(--agv-border)]">
                      {sortRowInfo.dir}
                    </span>
                    <button
                      type="button"
                      onClick={onClearSortRow}
                      className="min-h-[28px] min-w-[28px] h-7 w-7 flex items-center justify-center text-xs text-[var(--agv-text-muted)] hover:text-[var(--agv-danger,#ef4444)] hover:bg-[var(--agv-danger-bg,rgba(239,68,68,0.1))] transition cursor-pointer select-none border-l border-[var(--agv-border)]"
                    >
                      <X size={11} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 6. Sắp xếp nhóm theo (Chỉ hiện khi có) */}
            {sortGroupInfo && (
              <div className="flex flex-col gap-1.5">
                <span className="font-bold text-[11px] text-[var(--agv-text-muted)] uppercase tracking-wide">
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
                      className="min-h-[28px] min-w-[28px] h-7 w-7 flex items-center justify-center text-xs text-[var(--agv-text-muted)] hover:text-[var(--agv-danger,#ef4444)] hover:bg-[var(--agv-danger-bg,rgba(239,68,68,0.1))] transition cursor-pointer select-none border-l border-[var(--agv-border)]"
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
                <span className="font-bold text-[11px] text-[var(--agv-text-muted)] uppercase tracking-wide">
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
                      className="min-h-[28px] min-w-[28px] h-7 w-7 flex items-center justify-center text-xs text-[var(--agv-text-muted)] hover:text-[var(--agv-danger,#ef4444)] hover:bg-[var(--agv-danger-bg,rgba(239,68,68,0.1))] transition cursor-pointer select-none border-l border-[var(--agv-border)] shrink-0"
                    >
                      <X size={11} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer: Chỉ hiển thị nút Xóa tất cả tiêu chí; KHÔNG CÓ NÚT ĐÓNG */}
      {totalActive > 0 && (
        <div className="px-3 py-2 border-t border-[var(--agv-border)] bg-[var(--agv-bg-header)] shrink-0 min-h-[38px] flex items-center">
          <button
            type="button"
            onClick={() => {
              onClearAll?.();
              onClose();
            }}
            className="w-full min-h-[28px] h-7 px-3 rounded border border-[var(--agv-danger,#ef4444)] text-[var(--agv-danger,#ef4444)] bg-[var(--agv-danger-bg,rgba(239,68,68,0.1))] hover:opacity-90 font-medium text-xs transition cursor-pointer select-none"
          >
            Xóa tất cả tiêu chí
          </button>
        </div>
      )}
    </div>,
    document.body
  );
};
