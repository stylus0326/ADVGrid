import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { X, Check } from 'lucide-react';
import { MorphChevronIcon } from '../ui/MorphIcons';
import { ColumnDef, FilterOperation, ColumnFilterValue, FILTER_OPS, DATA_TYPES, FILTER_MODES, EDITOR_TYPES, SURFACE_THEMES } from './types';
import { getAllowedFilterOpsForColumn, getDefaultFilterOpForColumn, FilterOpIcon, FILTER_OP_META, RangeArrowSeparator } from './FilterIcons';
import { getThemeClass } from '../../themes';
import { AdvDatePicker, AdvDateRangePicker, formatDisplayDate } from '../ui/AdvDatePicker';
import { parseDateToNum, parseTimeToMinutes } from './floating/queryUtils';
import { formatSmartInputText, handleNumericKeyDown, expandAllShortcuts } from './smartNumberUtils';
import { isBetweenFilterOp, isNegativeFilterOp } from './gridUtils';
import { NO_AUTOFILL_PROPS } from './constants';

export interface AdvMultiFilterPopupProps {
  isOpen: boolean;
  onClose: () => void;
  anchorRect: { top: number; left: number; bottom: number; right: number; width?: number; height?: number } | null;
  column: ColumnDef<any>;
  currentFilter?: ColumnFilterValue;
  onApply: (colKey: string, filter: ColumnFilterValue) => void;
  onClear: (colKey: string) => void;
  hasColumnEmptyCells?: (colKey: string) => boolean;
  getColumnDateBounds?: (colKey: string) => { min: string; max: string };
  surfaceTheme?: string;
}

export const AdvMultiFilterPopup: React.FC<AdvMultiFilterPopupProps> = ({
  isOpen,
  onClose,
  anchorRect,
  column,
  currentFilter,
  onApply,
  onClear,
  hasColumnEmptyCells,
  getColumnDateBounds,
  surfaceTheme = SURFACE_THEMES.LIGHT,
}) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const dataType = column.dataType || DATA_TYPES.TEXT;

  // Allowed operators for this column
  const allowedOps = useMemo(() => {
    return getAllowedFilterOpsForColumn(column.key, [column], hasColumnEmptyCells);
  }, [column, hasColumnEmptyCells]);

  // Current selected operator
  const [selectedOp, setSelectedOp] = useState<FilterOperation>(() => {
    if (currentFilter?.op && allowedOps.includes(currentFilter.op)) {
      return currentFilter.op;
    }
    const defaultOp = getDefaultFilterOpForColumn(column.key, [column]);
    return allowedOps.includes(defaultOp) ? defaultOp : (allowedOps[0] || FILTER_OPS.EQUALS);
  });

  const [isOpMenuOpen, setIsOpMenuOpen] = useState(false);
  const opBtnRef = useRef<HTMLButtonElement>(null);
  const [opMenuPos, setOpMenuPos] = useState<{
    top: number;
    left: number;
    bottom?: number;
    isFlipUp?: boolean;
  } | null>(null);

  const isNegativeOp = isNegativeFilterOp(selectedOp);

  const handleToggleOpMenu = () => {
    if (!isOpMenuOpen && opBtnRef.current) {
      const rect = opBtnRef.current.getBoundingClientRect();
      const menuWidth = 192;
      let left = rect.right - menuWidth;
      if (left < 8) left = 8;
      if (left + menuWidth > window.innerWidth - 8) {
        left = window.innerWidth - menuWidth - 8;
      }
      const menuMaxHeight = 224;
      const spaceBelow = window.innerHeight - rect.bottom - 8;
      const spaceAbove = rect.top - 8;
      const flipUp = spaceBelow < menuMaxHeight && spaceAbove > spaceBelow;
      let top: number;
      let bottom: number | undefined;
      if (flipUp) {
        bottom = window.innerHeight - rect.top + 4;
        top = Math.max(8, rect.top - menuMaxHeight - 4);
      } else {
        top = rect.bottom + 4;
      }
      setOpMenuPos({ top, left, bottom, isFlipUp: flipUp });
      setIsOpMenuOpen(true);
    } else {
      setIsOpMenuOpen(false);
    }
  };

  // Textarea raw value
  const [rawText, setRawText] = useState<string>(() => {
    if (currentFilter?.mode === FILTER_MODES.MULTI && currentFilter.multiValues) {
      return currentFilter.multiValues.join('\n');
    }
    if (currentFilter?.val && currentFilter.mode !== FILTER_MODES.MULTI) {
      return currentFilter.val;
    }
    return '';
  });

  // Multiple Ranges: Array of { from, to }
  const [ranges, setRanges] = useState<Array<{ from: string; to: string }>>(() => {
    if (currentFilter?.mode === FILTER_MODES.MULTI && currentFilter.multiRanges && currentFilter.multiRanges.length > 0) {
      return currentFilter.multiRanges.map((r) => ({ ...r }));
    }
    return [{ from: '', to: '' }];
  });

  // Selected discrete dates
  const [discreteDates, setDiscreteDates] = useState<string[]>(() => {
    if (currentFilter?.mode === FILTER_MODES.MULTI && currentFilter.multiValues && dataType === DATA_TYPES.DATE) {
      return [...currentFilter.multiValues];
    }
    return [];
  });

  const [datePickerVal, setDatePickerVal] = useState<string>('');

  // Sync when reopening for another column or filter
  useEffect(() => {
    if (isOpen) {
      if (currentFilter?.op && allowedOps.includes(currentFilter.op)) {
        setSelectedOp(currentFilter.op);
      } else {
        const defaultOp = getDefaultFilterOpForColumn(column.key, [column]);
        setSelectedOp(allowedOps.includes(defaultOp) ? defaultOp : (allowedOps[0] || FILTER_OPS.EQUALS));
      }

      if (currentFilter?.mode === FILTER_MODES.MULTI && currentFilter.multiRanges && currentFilter.multiRanges.length > 0) {
        setRanges(currentFilter.multiRanges.map((r) => ({ ...r })));
      } else if (currentFilter?.val && currentFilter.val.includes('..')) {
        const [f, t] = currentFilter.val.split('..');
        setRanges([{ from: f?.trim() || '', to: t?.trim() || '' }]);
      } else {
        setRanges([{ from: '', to: '' }]);
      }

      if (currentFilter?.mode === FILTER_MODES.MULTI && currentFilter.multiValues) {
        setRawText(currentFilter.multiValues.join('\n'));
        if (dataType === DATA_TYPES.DATE) setDiscreteDates([...currentFilter.multiValues]);
      } else if (currentFilter?.val) {
        setRawText(currentFilter.val);
        if (dataType === DATA_TYPES.DATE && !currentFilter.val.includes('..')) {
          setDiscreteDates([currentFilter.val]);
        }
      } else {
        setRawText('');
        setDiscreteDates([]);
      }
      setIsOpMenuOpen(false);
    }
  }, [isOpen, currentFilter, column.key, allowedOps, dataType]);

  // Lắng nghe đóng popup khi có popup khác mở trên Grid (đảm bảo chỉ 1 popup hiển thị)
  useEffect(() => {
    if (!isOpen) return;
    const handleCloseAll = (e: Event) => {
      const ce = e as CustomEvent;
      if (ce.detail?.except !== 'multi-filter') {
        onClose();
      }
    };
    window.addEventListener('agv-close-all-popups', handleCloseAll);
    return () => {
      window.removeEventListener('agv-close-all-popups', handleCloseAll);
    };
  }, [isOpen, onClose]);

  // Click outside listener
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (popupRef.current && popupRef.current.contains(target)) return;
      // Tránh đóng khi nhấp vào popups con của AdvDatePicker hoặc menu toán tử con (mở qua portal ở document.body)
      if (
        target.closest?.(
          '.agv-calendar-popover, .agv-daterange-popover, .agv-preset-dropdown-menu, .agv-portal-dropdown, .agv-custom-select-dropdown, .agv-datepicker-popup, .agv-modal-portal, .agv-multi-filter-op-menu'
        )
      ) {
        return;
      }
      onClose();
    };

    document.addEventListener('mousedown', handleClickOutside, true);
    document.addEventListener('touchstart', handleClickOutside, true);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
      document.removeEventListener('touchstart', handleClickOutside, true);
    };
  }, [isOpen, onClose]);

  // Click outside listener riêng cho menu toán tử con
  useEffect(() => {
    if (!isOpMenuOpen) return;
    const handleOpMenuClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (opBtnRef.current && opBtnRef.current.contains(target)) return;
      if (target.closest?.('.agv-multi-filter-op-menu')) return;
      setIsOpMenuOpen(false);
    };
    document.addEventListener('mousedown', handleOpMenuClickOutside, true);
    document.addEventListener('touchstart', handleOpMenuClickOutside, true);
    return () => {
      document.removeEventListener('mousedown', handleOpMenuClickOutside, true);
      document.removeEventListener('touchstart', handleOpMenuClickOutside, true);
    };
  }, [isOpMenuOpen]);

  // Parse text into tokens
  const recognizedTokens = useMemo(() => {
    if (!rawText.trim()) return [];
    const tokens = rawText
      .split(/[\r\n,;\t]+/)
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    // Deduplicate preserving order
    const seen = new Set<string>();
    const res: string[] = [];
    for (const t of tokens) {
      const key = t.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        res.push(t);
      }
    }
    return res;
  }, [rawText]);

  // Valid numbers
  const recognizedNumbers = useMemo(() => {
    if (dataType !== DATA_TYPES.NUMBER) return [];
    return recognizedTokens
      .map((t) => expandAllShortcuts(t))
      .filter((t) => {
        const num = parseFloat(t.replace(/,/g, ''));
        return !isNaN(num);
      });
  }, [recognizedTokens, dataType]);

  // Valid dates (DD/MM/YYYY or YYYY-MM-DD)
  const recognizedDates = useMemo(() => {
    if (dataType !== DATA_TYPES.DATE) return [];
    return recognizedTokens.filter((t) => parseDateToNum(t) !== null);
  }, [recognizedTokens, dataType]);

  // Valid times (HH:mm)
  const recognizedTimes = useMemo(() => {
    if (dataType !== DATA_TYPES.TIME && column.editorType !== EDITOR_TYPES.TIME) return [];
    return recognizedTokens.filter((t) => parseTimeToMinutes(t) !== null);
  }, [recognizedTokens, dataType, column.editorType]);

  // Active ranges (only those with from or to)
  const validRanges = useMemo(() => {
    return ranges.filter((r) => r.from.trim().length > 0 || r.to.trim().length > 0);
  }, [ranges]);

  // Total count of conditions
  const totalConditionsCount = useMemo(() => {
    if (dataType === DATA_TYPES.TEXT) return recognizedTokens.length;
    if (dataType === DATA_TYPES.NUMBER) {
      return isBetweenFilterOp(selectedOp) ? validRanges.length : recognizedNumbers.length;
    }
    if (dataType === DATA_TYPES.DATE) {
      return isBetweenFilterOp(selectedOp) ? validRanges.length : discreteDates.length;
    }
    if (dataType === DATA_TYPES.TIME) {
      return isBetweenFilterOp(selectedOp) ? validRanges.length : recognizedTimes.length;
    }
    return recognizedTokens.length;
  }, [
    dataType,
    selectedOp,
    recognizedTokens.length,
    recognizedNumbers.length,
    recognizedDates.length,
    recognizedTimes.length,
    validRanges.length,
    discreteDates.length,
  ]);

  // Handle Apply
  const handleApply = () => {
    let finalMultiValues: string[] | undefined;
    let finalMultiRanges: Array<{ from: string; to: string }> | undefined;

    if (dataType === DATA_TYPES.TEXT) {
      finalMultiValues = recognizedTokens;
    } else if (dataType === DATA_TYPES.NUMBER) {
      if (isBetweenFilterOp(selectedOp)) {
        finalMultiRanges = validRanges;
      } else {
        finalMultiValues = recognizedNumbers;
      }
    } else if (dataType === DATA_TYPES.DATE) {
      if (isBetweenFilterOp(selectedOp)) {
        finalMultiRanges = validRanges;
      } else {
        finalMultiValues = discreteDates;
      }
    } else if (dataType === DATA_TYPES.TIME) {
      if (isBetweenFilterOp(selectedOp)) {
        finalMultiRanges = validRanges;
      } else {
        finalMultiValues = recognizedTimes;
      }
    } else {
      finalMultiValues = recognizedTokens;
    }

    const hasVals = Array.isArray(finalMultiValues) && finalMultiValues.length > 0;
    const hasRanges = Array.isArray(finalMultiRanges) && finalMultiRanges.length > 0;

    if (!hasVals && !hasRanges) {
      onClear(column.key);
      onClose();
      return;
    }

    onApply(column.key, {
      ...currentFilter,
      op: selectedOp,
      val: hasVals ? finalMultiValues!.join('; ') : `${finalMultiRanges!.length} khoảng`,
      mode: FILTER_MODES.MULTI,
      multiValues: finalMultiValues,
      multiRanges: finalMultiRanges,
    });
    onClose();
  };

  // Add date to discrete list
  const handleAddDiscreteDate = (d: string) => {
    const trimmed = d.trim();
    if (!trimmed) return;
    const formatted = formatDisplayDate(trimmed, false, false) || trimmed;
    if (!discreteDates.includes(formatted)) {
      setDiscreteDates((prev) => [...prev, formatted]);
    }
    setDatePickerVal('');
  };

  const handleRemoveDiscreteDate = (d: string) => {
    setDiscreteDates((prev) => prev.filter((item) => item !== d));
  };

  if (!isOpen || !anchorRect) return null;

  // Geometry computation
  const popupWidth = 390;
  const padding = 8;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // 1. Tính toán vị trí ngang (left)
  let left: number;
  if (anchorRect.width && anchorRect.width <= 120) {
    // Với trigger nhỏ (như nút SVG hoặc chip tóm tắt trên Query Builder), căn mép phải của popup theo mép phải trigger
    left = anchorRect.right - popupWidth;
  } else {
    // Với trigger lớn (như ô filter trên GridFilterRow), căn theo mép trái của ô
    left = anchorRect.left;
  }

  // Kẹp biên ngang viewport
  if (left + popupWidth > viewportWidth - padding) {
    left = viewportWidth - popupWidth - padding;
  }
  if (left < padding) {
    left = padding;
  }

  // 2. Tính toán vị trí dọc (top / bottom)
  const spaceBelow = viewportHeight - anchorRect.bottom - padding;
  const spaceAbove = anchorRect.top - padding;
  // Lật lên trên nếu khoảng trống bên dưới quá hẹp (< 260px) và phía trên rộng hơn
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
    // Khi lật lên trên: đáy của popup neo dính sát đỉnh của nút bấm (cách 4px), không bao giờ bị bay lơ lửng
    popupStyle.bottom = `${viewportHeight - anchorRect.top + 4}px`;
    popupStyle.top = 'auto';
  } else {
    // Khi mở xuống dưới: đỉnh của popup dính sát đáy của nút bấm (cách 4px)
    popupStyle.top = `${anchorRect.bottom + 4}px`;
    popupStyle.bottom = 'auto';
  }

  const dateBounds = getColumnDateBounds?.(column.key) || { min: '01/09/2026', max: '30/09/2026' };

  return (
    <>
      {createPortal(
        <div
          ref={popupRef}
          style={popupStyle}
          className={`agv-multi-filter-popup flex flex-col rounded-md border text-xs overflow-hidden select-none ${
            isFlipUp ? 'agv-spring-up' : 'agv-spring-down'
          } ${getThemeClass(
            surfaceTheme as any
          )}`}
          data-theme={surfaceTheme}
          data-agv-popup="true"
          onClick={(e) => e.stopPropagation()}
          onWheel={(e) => e.stopPropagation()}
        >
          {/* 1. Header: Tiêu đề cột & Nút đóng */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--agv-border)] bg-[var(--agv-bg-header)] shrink-0">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="font-semibold text-xs text-[var(--agv-text-main)] truncate">
                {isNegativeOp ? 'Lọc loại trừ (AND)' : 'Lọc nhiều điều kiện (OR)'}
              </span>
              <span className="text-[11px] text-[var(--agv-text-muted)] truncate">
                : {column.title || column.key}
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-5 h-5 flex items-center justify-center rounded text-[var(--agv-text-muted)] hover:text-[var(--agv-text-main)] hover:bg-[var(--agv-bg-item-hover)] transition cursor-pointer"
            >
              <X size={14} strokeWidth={2.2} />
            </button>
          </div>

          {/* 2. Dòng chọn toán tử so sánh (Toán tử chuẩn của cột) */}
          <div className="flex items-center justify-between px-3 py-1.5 border-b border-[var(--agv-border)] bg-[var(--agv-bg-root)] shrink-0">
            <span className="text-[11px] text-[var(--agv-text-muted)] font-medium">Toán tử so khớp:</span>
            <div className="relative">
              <button
                ref={opBtnRef}
                type="button"
                onClick={handleToggleOpMenu}
                className="flex items-center gap-1.5 px-2 h-[28px] min-h-[28px] rounded border border-[var(--agv-border)] bg-[var(--agv-bg-popup)] hover:border-primary text-xs text-[var(--agv-text-main)] transition cursor-pointer"
              >
                <FilterOpIcon op={selectedOp} size={13} />
                <span className="font-medium">{FILTER_OP_META[selectedOp]?.label || selectedOp}</span>
                <MorphChevronIcon
                  expanded={isOpMenuOpen}
                  size={12}
                  type="down-up"
                  className="text-[var(--agv-text-muted)] shrink-0"
                />
              </button>
            </div>
          </div>

      {/* 3. Phân nhánh controls theo dataType */}
      <div className="p-3 flex flex-col gap-2.5 overflow-y-auto max-h-[calc(100vh-140px)]">
        {/* === 3.1 DỮ LIỆU CHUỖI (TEXT) === */}
        {dataType === DATA_TYPES.TEXT && (
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[var(--agv-text-muted)]">
                Dán hoặc nhập danh sách từ khóa (mỗi dòng 1 từ):
              </span>
              {rawText && (
                <button
                  type="button"
                  onClick={() => setRawText('')}
                  className="text-[11px] text-[var(--agv-danger)] hover:underline cursor-pointer"
                >
                  Xóa trắng
                </button>
              )}
            </div>
            <textarea
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="VD:&#10;VN123&#10;VJ456&#10;QH789&#10;(hỗ trợ phân tách bằng xuống dòng, dấu phẩy, tab)"
              {...NO_AUTOFILL_PROPS}
              rows={6}
              className="w-full p-2 rounded border border-[var(--agv-border)] bg-[var(--agv-bg-root)] text-xs text-[var(--agv-text-main)] placeholder:text-[var(--agv-text-muted)] placeholder:opacity-60 outline-none focus:border-primary focus:ring-1 focus:ring-ring resize-y min-h-[120px] max-h-[220px]"
            />
          </div>
        )}

        {/* === 3.2 DỮ LIỆU SỐ (NUMBER) === */}
        {dataType === DATA_TYPES.NUMBER && (
          <div className="flex flex-col gap-2">
            {isBetweenFilterOp(selectedOp) ? (
              <div className="flex flex-col gap-2">
                <div className={`flex flex-col gap-1.5 py-0.5 pr-0.5 overflow-x-hidden ${ranges.length > 3 ? 'max-h-[140px] overflow-y-auto' : 'overflow-hidden'}`}>
                  {ranges.map((rng, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 w-full min-w-0 h-[28px] min-h-[28px]">
                      <span className="text-[11px] text-[var(--agv-text-muted)] w-4 shrink-0 text-center select-none font-mono">#{idx + 1}</span>
                      <input
                        type="text"
                        value={rng.from}
                        onChange={(e) => {
                          const val = formatSmartInputText(e.target.value);
                          setRanges((prev) => {
                            const next = [...prev];
                            next[idx] = { ...next[idx], from: val };
                            return next;
                          });
                        }}
                        onKeyDown={handleNumericKeyDown}
                        placeholder="Từ..."
                        {...NO_AUTOFILL_PROPS}
                        className="flex-1 min-w-0 h-[28px] min-h-[28px] box-border px-1.5 rounded border border-[var(--agv-border)] bg-[var(--agv-bg-root)] text-xs text-[var(--agv-text-main)] outline-none focus:border-primary tabular-nums"
                      />
                      <RangeArrowSeparator className="mx-0.5" />
                      <input
                        type="text"
                        value={rng.to}
                        onChange={(e) => {
                          const val = formatSmartInputText(e.target.value);
                          setRanges((prev) => {
                            const next = [...prev];
                            next[idx] = { ...next[idx], to: val };
                            return next;
                          });
                        }}
                        onKeyDown={handleNumericKeyDown}
                        placeholder="Đến..."
                        {...NO_AUTOFILL_PROPS}
                        className="flex-1 min-w-0 h-[28px] min-h-[28px] box-border px-1.5 rounded border border-[var(--agv-border)] bg-[var(--agv-bg-root)] text-xs text-[var(--agv-text-main)] outline-none focus:border-primary tabular-nums"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setRanges((prev) => {
                            if (prev.length <= 1) return [{ from: '', to: '' }];
                            return prev.filter((_, i) => i !== idx);
                          });
                        }}
                        className="w-6 h-[28px] min-h-[28px] shrink-0 flex items-center justify-center rounded border border-[var(--agv-border)] text-[var(--agv-text-muted)] hover:text-[var(--agv-danger)] hover:border-[var(--agv-danger)] transition cursor-pointer text-xs"
                      >
                        <X size={12} strokeWidth={2.2} />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setRanges((prev) => [...prev, { from: '', to: '' }])}
                  className="w-full h-[28px] min-h-[28px] rounded border border-dashed border-[var(--agv-border)] hover:border-primary text-[11px] font-medium text-primary hover:bg-[var(--agv-bg-item-hover)] transition cursor-pointer flex items-center justify-center gap-1"
                >
                  + Thêm khoảng số
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-[var(--agv-text-muted)]">
                    Dán hoặc nhập danh sách số (mỗi dòng 1 số):
                  </span>
                  {rawText && (
                    <button
                      type="button"
                      onClick={() => setRawText('')}
                      className="text-[11px] text-[var(--agv-danger)] hover:underline cursor-pointer"
                    >
                      Xóa trắng
                    </button>
                  )}
                </div>
                <textarea
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder="Nhập hoặc dán các số (VD: 10, 25, 50, 100)..."
                  {...NO_AUTOFILL_PROPS}
                  rows={5}
                  className="w-full p-2 rounded border border-[var(--agv-border)] bg-[var(--agv-bg-root)] text-xs text-[var(--agv-text-main)] placeholder:text-[var(--agv-text-muted)] placeholder:opacity-60 outline-none focus:border-primary resize-y min-h-[100px] max-h-[200px]"
                />
              </div>
            )}
          </div>
        )}

        {/* === 3.3 DỮ LIỆU NGÀY THÁNG (DATE) === */}
        {dataType === DATA_TYPES.DATE && (
          <div className="flex flex-col gap-2">
            {isBetweenFilterOp(selectedOp) ? (
              /* Trường hợp 1: Toán tử "Trong khoảng" (between) -> Dùng AdvDateRangePicker cho từng khoảng */
              <div className="flex flex-col gap-2">
                <div className={`flex flex-col gap-1.5 py-0.5 pr-0.5 overflow-x-hidden ${ranges.length > 3 ? 'max-h-[140px] overflow-y-auto' : 'overflow-hidden'}`}>
                  {ranges.map((rng, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 w-full min-w-0 h-[28px] min-h-[28px]">
                      <span className="text-[11px] text-[var(--agv-text-muted)] w-4 shrink-0 text-center select-none font-mono">#{idx + 1}</span>
                      <div className="flex-1 min-w-0 h-[28px] min-h-[28px] box-border">
                        <AdvDateRangePicker
                          from={rng.from}
                          to={rng.to}
                          onChange={(range) => {
                            setRanges((prev) => {
                              const next = [...prev];
                              next[idx] = { from: range.from || '', to: range.to || '' };
                              return next;
                            });
                          }}
                          min={dateBounds.min}
                          max={dateBounds.max}
                          placeholderFrom="Từ"
                          placeholderTo="Đến"
                          theme={surfaceTheme}
                          size="xs"
                          showPreset={true}
                          dualMonth={false}
                          showTime={Boolean(column.showTime)}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setRanges((prev) => {
                            if (prev.length <= 1) return [{ from: '', to: '' }];
                            return prev.filter((_, i) => i !== idx);
                          });
                        }}
                        className="w-6 h-[28px] min-h-[28px] shrink-0 flex items-center justify-center rounded border border-[var(--agv-border)] text-[var(--agv-text-muted)] hover:text-[var(--agv-danger)] hover:border-[var(--agv-danger)] transition cursor-pointer text-xs"
                      >
                        <X size={12} strokeWidth={2.2} />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setRanges((prev) => [...prev, { from: '', to: '' }])}
                  className="w-full h-[28px] min-h-[28px] rounded border border-dashed border-[var(--agv-border)] hover:border-primary text-[11px] font-medium text-primary hover:bg-[var(--agv-bg-item-hover)] transition cursor-pointer flex items-center justify-center gap-1"
                >
                  + Thêm khoảng ngày
                </button>
              </div>
            ) : (
              /* Trường hợp 2: Toán tử Bằng, Khác, Lớn hơn, Nhỏ hơn... -> Chọn ngày tích lũy chip qua AdvDatePicker */
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="flex-1 h-[28px] min-h-[28px]">
                    <AdvDatePicker
                      value={datePickerVal}
                      onChange={(val, rangeMeta) => {
                        if (rangeMeta?.from && rangeMeta?.to && rangeMeta.from !== rangeMeta.to) {
                          handleAddDiscreteDate(rangeMeta.from);
                          handleAddDiscreteDate(rangeMeta.to);
                        } else if (val) {
                          handleAddDiscreteDate(val);
                        }
                      }}
                      min={dateBounds.min}
                      max={dateBounds.max}
                      placeholder="Chọn ngày để thêm vào danh sách..."
                      theme={surfaceTheme}
                      showPreset={true}
                      size="xs"
                    />
                  </div>
                </div>

                {/* Danh sách thẻ chip ngày đã chọn */}
                <div className="flex flex-wrap gap-1 max-h-[140px] overflow-y-auto p-1.5 rounded border border-[var(--agv-border)] bg-[var(--agv-bg-root)] min-h-[60px]">
                  {discreteDates.length === 0 ? (
                    <span className="text-[11px] text-[var(--agv-text-muted)] italic self-center">
                      Chưa chọn ngày nào. Click lịch ở trên để chọn.
                    </span>
                  ) : (
                    discreteDates.map((d) => (
                      <span
                        key={d}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-[var(--agv-bg-card)] border border-[var(--agv-border)] text-[var(--agv-text-main)]"
                      >
                        {d}
                        <button
                          type="button"
                          onClick={() => handleRemoveDiscreteDate(d)}
                          className="hover:text-[var(--agv-danger)] text-[var(--agv-text-muted)] cursor-pointer flex items-center"
                        >
                          <X size={11} strokeWidth={2.2} />
                        </button>
                      </span>
                    ))
                  )}
                </div>
                {discreteDates.length > 0 && (
                  <div className="flex justify-between items-center text-[11px] text-[var(--agv-text-muted)]">
                    <span>Đã chọn: <strong className="text-primary">{discreteDates.length}</strong> ngày</span>
                    <button
                      type="button"
                      onClick={() => setDiscreteDates([])}
                      className="text-[var(--agv-danger)] hover:underline cursor-pointer"
                    >
                      Xóa tất cả
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* === 3.4 DỮ LIỆU GIỜ PHÚT (TIME) === */}
        {dataType === DATA_TYPES.TIME && (
          <div className="flex flex-col gap-2">
            {isBetweenFilterOp(selectedOp) ? (
              <div className="flex flex-col gap-2">
                <div className={`flex flex-col gap-1.5 py-0.5 pr-0.5 overflow-x-hidden ${ranges.length > 3 ? 'max-h-[140px] overflow-y-auto' : 'overflow-hidden'}`}>
                  {ranges.map((rng, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 w-full min-w-0 h-[28px] min-h-[28px]">
                      <span className="text-[11px] text-[var(--agv-text-muted)] w-4 shrink-0 text-center select-none font-mono">#{idx + 1}</span>
                      <input
                        type="text"
                        value={rng.from}
                        onChange={(e) => {
                          const val = e.target.value;
                          setRanges((prev) => {
                            const next = [...prev];
                            next[idx] = { ...next[idx], from: val };
                            return next;
                          });
                        }}
                        placeholder="HH:mm"
                        {...NO_AUTOFILL_PROPS}
                        className="flex-1 min-w-0 h-[28px] min-h-[28px] box-border px-1.5 rounded border border-[var(--agv-border)] bg-[var(--agv-bg-root)] text-xs text-[var(--agv-text-main)] outline-none focus:border-primary"
                      />
                      <RangeArrowSeparator className="mx-0.5" />
                      <input
                        type="text"
                        value={rng.to}
                        onChange={(e) => {
                          const val = e.target.value;
                          setRanges((prev) => {
                            const next = [...prev];
                            next[idx] = { ...next[idx], to: val };
                            return next;
                          });
                        }}
                        placeholder="HH:mm"
                        {...NO_AUTOFILL_PROPS}
                        className="flex-1 min-w-0 h-[28px] min-h-[28px] box-border px-1.5 rounded border border-[var(--agv-border)] bg-[var(--agv-bg-root)] text-xs text-[var(--agv-text-main)] outline-none focus:border-primary"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setRanges((prev) => {
                            if (prev.length <= 1) return [{ from: '', to: '' }];
                            return prev.filter((_, i) => i !== idx);
                          });
                        }}
                        className="w-6 h-[28px] min-h-[28px] shrink-0 flex items-center justify-center rounded border border-[var(--agv-border)] text-[var(--agv-text-muted)] hover:text-[var(--agv-danger)] hover:border-[var(--agv-danger)] transition cursor-pointer text-xs"
                      >
                        <X size={12} strokeWidth={2.2} />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setRanges((prev) => [...prev, { from: '', to: '' }])}
                  className="w-full h-[28px] min-h-[28px] rounded border border-dashed border-[var(--agv-border)] hover:border-primary text-[11px] font-medium text-primary hover:bg-[var(--agv-bg-item-hover)] transition cursor-pointer flex items-center justify-center gap-1"
                >
                  + Thêm khoảng giờ
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-[var(--agv-text-muted)]">
                    Dán hoặc nhập danh sách giờ (mỗi dòng 1 mốc giờ HH:mm):
                  </span>
                  {rawText && (
                    <button
                      type="button"
                      onClick={() => setRawText('')}
                      className="text-[11px] text-[var(--agv-danger)] hover:underline cursor-pointer"
                    >
                      Xóa trắng
                    </button>
                  )}
                </div>
                <textarea
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder="VD:&#10;08:30&#10;12:00&#10;17:45"
                  {...NO_AUTOFILL_PROPS}
                  rows={5}
                  className="w-full p-2 rounded border border-[var(--agv-border)] bg-[var(--agv-bg-root)] text-xs text-[var(--agv-text-main)] placeholder:text-[var(--agv-text-muted)] placeholder:opacity-60 outline-none focus:border-primary resize-y min-h-[100px] max-h-[200px]"
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4. Footer: Đếm số điều kiện & 2 nút Xóa / Áp dụng */}
      <div className="flex items-center justify-between px-3 py-2 border-t border-[var(--agv-border)] bg-[var(--agv-bg-header)] shrink-0">
        <div className="text-[11px] text-[var(--agv-text-muted)]">
          {totalConditionsCount > 0 ? (
            <span>
              Tổng cộng: <strong className="text-primary">{totalConditionsCount}</strong> điều kiện ({isNegativeOp ? 'AND' : 'OR'})
            </span>
          ) : (
            <span className="italic">Chưa có điều kiện</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              onClear(column.key);
              onClose();
            }}
            className="px-2.5 h-[28px] min-h-[28px] rounded border border-[var(--agv-border)] hover:bg-[var(--agv-bg-item-hover)] text-xs text-[var(--agv-text-muted)] hover:text-[var(--agv-danger)] transition cursor-pointer"
          >
            Xóa
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="px-3 h-[28px] min-h-[28px] rounded font-medium text-xs bg-primary hover:opacity-90 text-primary-foreground transition cursor-pointer flex items-center gap-1"
          >
            Áp dụng
          </button>
        </div>
      </div>
    </div>,
    document.body
  )}

  {/* Dropdown danh sách toán tử đưa ra ngoài vùng (Portal body) để tránh bị tràn/cắt mất dòng */}
  {isOpMenuOpen && opMenuPos && createPortal(
    <div
      style={{
        position: 'fixed',
        left: `${opMenuPos.left}px`,
        ...(opMenuPos.isFlipUp
          ? { bottom: `${opMenuPos.bottom}px`, top: 'auto' }
          : { top: `${opMenuPos.top}px`, bottom: 'auto' }),
        zIndex: 999999999,
        backgroundColor: 'var(--agv-bg-popup)',
        borderColor: 'var(--agv-border)',
        boxShadow: '0 12px 28px -4px rgba(0, 0, 0, 0.25), 0 8px 12px -6px rgba(0, 0, 0, 0.15)',
        color: 'var(--agv-text-main)',
      }}
      className={`agv-multi-filter-op-menu w-48 max-h-56 overflow-y-auto rounded-md border py-1 flex flex-col select-none ${
        opMenuPos.isFlipUp ? 'agv-spring-up' : 'agv-spring-down'
      } ${getThemeClass(
        surfaceTheme as any
      )}`}
      data-theme={surfaceTheme}
      data-agv-popup="true"
      onClick={(e) => e.stopPropagation()}
      onWheel={(e) => e.stopPropagation()}
    >
      {allowedOps
        .filter((op) => !FILTER_OP_META[op]?.noInput)
        .map((op) => {
          const isSel = op === selectedOp;
          return (
            <div
              key={op}
              onClick={() => {
                setSelectedOp(op);
                setIsOpMenuOpen(false);
              }}
              className={`flex items-center justify-between px-2.5 h-[28px] min-h-[28px] cursor-pointer text-xs transition ${
                isSel
                  ? 'bg-primary text-primary-foreground font-semibold'
                  : 'text-[var(--agv-text-main)] hover:bg-[var(--agv-bg-item-hover)]'
              }`}
            >
              <div className="flex items-center gap-2">
                <FilterOpIcon op={op} size={13} />
                <span>{FILTER_OP_META[op]?.label}</span>
              </div>
              {isSel && <Check size={13} strokeWidth={2.5} className="shrink-0" />}
            </div>
          );
        })}
    </div>,
    document.body
  )}
    </>
  );
};
