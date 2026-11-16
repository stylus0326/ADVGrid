import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { X, Check } from 'lucide-react';
import { MorphChevronIcon } from '../ui/MorphIcons';
import { ColumnDef, FilterOperation, ColumnFilterValue, FILTER_OPS, DATA_TYPES, FILTER_MODES, EDITOR_TYPES, SURFACE_THEMES } from './types';
import { getAllowedFilterOpsForColumn, getDefaultFilterOpForColumn, FilterOpIcon, FILTER_OP_META, RangeArrowSeparator } from './FilterIcons';
import { getThemeClass } from '../../themes';
import { AdvOverlayScroll } from '../ui/AdvOverlayScroll';
import { AdvAnchoredPopover, DEFAULT_POPOVER_IGNORE_SELECTORS } from '../ui/AdvPopover';
import { AdvButton } from '../ui/AdvButton';
import { AdvDatePicker, AdvDateRangePicker, formatDisplayDate } from '../ui/AdvDatePicker';
import { parseDateToNum, parseTimeToMinutes } from './floating/queryUtils';
import { formatSmartInputText, handleNumericKeyDown, expandAllShortcuts } from './smartNumberUtils';
import { isBetweenFilterOp, isNegativeFilterOp } from './gridFormatUtils';
import { NO_AUTOFILL_PROPS } from './constants';

export interface AdvMultiFilterPopupProps {
  isOpen: boolean;
  onClose: () => void;
  anchorEl?: HTMLElement | null;
  anchorRect?: { top: number; left: number; bottom: number; right: number; width?: number; height?: number } | null;
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
  anchorEl,
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

  const isNegativeOp = isNegativeFilterOp(selectedOp);

  const handleToggleOpMenu = () => {
    setIsOpMenuOpen((prev) => !prev);
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

  // Click outside listener (fallback khi gọi không qua anchorEl / AdvAnchoredPopover)
  useEffect(() => {
    if (!isOpen || anchorEl) return;
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
  }, [isOpen, anchorEl, onClose]);

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

  if (!isOpen || (!anchorEl && !anchorRect)) return null;

  const dateBounds = getColumnDateBounds?.(column.key) || { min: '01/09/2026', max: '30/09/2026' };

  const innerSections = (
    <>
          {/* 1. Header: Tiêu đề cột & Nút đóng */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--agv-border)] bg-[var(--agv-bg-header)] shrink-0">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="font-semibold text-xs text-[var(--agv-text-main)] truncate">
                {isNegativeOp ? 'Lọc loại trừ (AND)' : 'Lọc nhiều điều kiện (OR)'}
              </span>
              <span className="text-xs text-[var(--agv-text-muted)] truncate">
                : {column.title || column.key}
              </span>
            </div>
            <AdvButton
              variant="ghost"
              size="icon-sm"
              onClick={onClose}
              className="text-[var(--agv-text-muted)]"
            >
              <X size={14} strokeWidth={2.2} />
            </AdvButton>
          </div>

          {/* 2. Dòng chọn toán tử so sánh (Toán tử chuẩn của cột) */}
          <div className="flex items-center justify-between px-3 py-1.5 border-b border-[var(--agv-border)] bg-[var(--agv-bg-header)] shrink-0">
            <span className="text-xs text-[var(--agv-text-muted)] font-medium">Toán tử so khớp:</span>
            <div className="relative">
              <button
                ref={opBtnRef}
                type="button"
                data-agv-trigger="true"
                data-agv-popover-trigger="true"
                aria-expanded={isOpMenuOpen}
                onClick={handleToggleOpMenu}
                className="agv-control flex items-center gap-1.5 rounded-md px-2 h-[28px] min-h-[28px] text-xs text-[var(--agv-text-main)] cursor-pointer outline-none"
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
      <AdvOverlayScroll
        className="flex-initial min-h-0"
        viewportClassName="p-3 flex flex-col gap-2.5 overflow-y-auto overflow-x-hidden max-h-[calc(100vh-140px)] overscroll-contain"
        contentSignature={`${dataType}-${ranges.length}-${discreteDates.length}`}
      >
        {/* === 3.1 DỮ LIỆU CHUỖI (TEXT) === */}
        {dataType === DATA_TYPES.TEXT && (
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[var(--agv-text-muted)]">
                Dán hoặc nhập danh sách từ khóa (mỗi dòng 1 từ):
              </span>
              {rawText && (
                <AdvButton
                  variant="destructive"
                  size="sm"
                  onClick={() => setRawText('')}
                  className="px-2"
                >
                  Xóa trắng
                </AdvButton>
              )}
            </div>
            <textarea
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="VD:&#10;VN123&#10;VJ456&#10;QH789&#10;(hỗ trợ phân tách bằng xuống dòng, dấu phẩy, tab)"
              {...NO_AUTOFILL_PROPS}
              rows={6}
              className="agv-control w-full p-2 text-xs text-[var(--agv-text-main)] placeholder:text-[var(--agv-text-muted)] resize-y min-h-[120px] max-h-[220px]"
            />
          </div>
        )}

        {/* === 3.2 DỮ LIỆU SỐ (NUMBER) === */}
        {dataType === DATA_TYPES.NUMBER && (
          <div className="flex flex-col gap-2">
            {isBetweenFilterOp(selectedOp) ? (
              <div className="flex flex-col gap-2">
                <AdvOverlayScroll
                  className="flex-initial min-h-0"
                  viewportClassName={`flex flex-col gap-1.5 py-0.5 pr-0.5 overflow-x-hidden ${
                    ranges.length > 3 ? 'max-h-[140px] overflow-y-auto overscroll-contain' : 'overflow-hidden'
                  }`}
                  contentSignature={ranges.length}
                >
                  {ranges.map((rng, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 w-full min-w-0 h-[28px] min-h-[28px]">
                      <span className="text-xs text-[var(--agv-text-muted)] min-w-[20px] shrink-0 text-center select-none font-mono tabular-nums">#{idx + 1}</span>
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
                        className="agv-control flex-1 min-w-0 h-[28px] min-h-[28px] box-border px-1.5 text-xs tabular-nums"
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
                        className="agv-control flex-1 min-w-0 h-[28px] min-h-[28px] box-border px-1.5 text-xs tabular-nums"
                      />
                      <AdvButton
                        variant="destructive"
                        size="icon-sm"
                        onClick={() => {
                          setRanges((prev) => {
                            if (prev.length <= 1) return [{ from: '', to: '' }];
                            return prev.filter((_, i) => i !== idx);
                          });
                        }}
                      >
                        <X size={12} strokeWidth={2.2} className="shrink-0" />
                      </AdvButton>
                    </div>
                  ))}
                </AdvOverlayScroll>
                <AdvButton
                  variant="ghost"
                  size="sm"
                  onClick={() => setRanges((prev) => [...prev, { from: '', to: '' }])}
                  className="w-full text-agv-accent"
                >
                  + Thêm khoảng số
                </AdvButton>
              </div>
            ) : (
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--agv-text-muted)]">
                    Dán hoặc nhập danh sách số (mỗi dòng 1 số):
                  </span>
                  {rawText && (
                    <AdvButton
                      variant="destructive"
                      size="sm"
                      onClick={() => setRawText('')}
                      className="px-2"
                    >
                      Xóa trắng
                    </AdvButton>
                  )}
                </div>
                <textarea
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder="Nhập hoặc dán các số (VD: 10, 25, 50, 100)..."
                  {...NO_AUTOFILL_PROPS}
                  rows={5}
                  className="agv-control w-full p-2 text-xs text-[var(--agv-text-main)] placeholder:text-[var(--agv-text-muted)] resize-y min-h-[100px] max-h-[200px]"
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
                <AdvOverlayScroll
                  className="flex-initial min-h-0"
                  viewportClassName={`flex flex-col gap-1.5 py-0.5 pr-0.5 overflow-x-hidden ${
                    ranges.length > 3 ? 'max-h-[140px] overflow-y-auto overscroll-contain' : 'overflow-hidden'
                  }`}
                  contentSignature={ranges.length}
                >
                  {ranges.map((rng, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 w-full min-w-0 h-[28px] min-h-[28px]">
                      <span className="text-xs text-[var(--agv-text-muted)] min-w-[20px] shrink-0 text-center select-none font-mono tabular-nums">#{idx + 1}</span>
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
                      <AdvButton
                        variant="destructive"
                        size="icon-sm"
                        onClick={() => {
                          setRanges((prev) => {
                            if (prev.length <= 1) return [{ from: '', to: '' }];
                            return prev.filter((_, i) => i !== idx);
                          });
                        }}
                      >
                        <X size={12} strokeWidth={2.2} className="shrink-0" />
                      </AdvButton>
                    </div>
                  ))}
                </AdvOverlayScroll>
                <AdvButton
                  variant="ghost"
                  size="sm"
                  onClick={() => setRanges((prev) => [...prev, { from: '', to: '' }])}
                  className="w-full text-agv-accent"
                >
                  + Thêm khoảng ngày
                </AdvButton>
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
                <AdvOverlayScroll
                  className="rounded border border-[var(--agv-border)] bg-[var(--agv-bg-control)]"
                  viewportClassName="flex flex-wrap gap-1 max-h-[140px] overflow-y-auto overflow-x-hidden p-1.5 min-h-[60px] overscroll-contain"
                  contentSignature={discreteDates.length}
                >
                  {discreteDates.length === 0 ? (
                    <span className="text-xs text-[var(--agv-text-muted)] italic self-center">
                      Chưa chọn ngày nào. Click lịch ở trên để chọn.
                    </span>
                  ) : (
                    discreteDates.map((d) => (
                      <span
                        key={d}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-[var(--agv-bg-card)] border border-[var(--agv-border)] text-[var(--agv-text-main)]"
                      >
                        {d}
                        <button
                          type="button"
                          onClick={() => handleRemoveDiscreteDate(d)}
                          className="agv-inline-clear-destructive p-0.5"
                        >
                          <X size={11} strokeWidth={2.2} />
                        </button>
                      </span>
                    ))
                  )}
                </AdvOverlayScroll>
                {discreteDates.length > 0 && (
                  <div className="flex justify-between items-center text-xs text-[var(--agv-text-muted)]">
                    <span>Đã chọn: <strong className="text-agv-accent">{discreteDates.length}</strong> ngày</span>
                    <AdvButton
                      variant="destructive"
                      size="sm"
                      onClick={() => setDiscreteDates([])}
                      className="px-2"
                    >
                      Xóa tất cả
                    </AdvButton>
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
                <AdvOverlayScroll
                  className="flex-initial min-h-0"
                  viewportClassName={`flex flex-col gap-1.5 py-0.5 pr-0.5 overflow-x-hidden ${
                    ranges.length > 3 ? 'max-h-[140px] overflow-y-auto overscroll-contain' : 'overflow-hidden'
                  }`}
                  contentSignature={ranges.length}
                >
                  {ranges.map((rng, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 w-full min-w-0 h-[28px] min-h-[28px]">
                      <span className="text-xs text-[var(--agv-text-muted)] min-w-[20px] shrink-0 text-center select-none font-mono tabular-nums">#{idx + 1}</span>
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
                        className="agv-control flex-1 min-w-0 h-[28px] min-h-[28px] box-border px-1.5 text-xs tabular-nums"
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
                        className="agv-control flex-1 min-w-0 h-[28px] min-h-[28px] box-border px-1.5 text-xs tabular-nums"
                      />
                      <AdvButton
                        variant="destructive"
                        size="icon-sm"
                        onClick={() => {
                          setRanges((prev) => {
                            if (prev.length <= 1) return [{ from: '', to: '' }];
                            return prev.filter((_, i) => i !== idx);
                          });
                        }}
                      >
                        <X size={12} strokeWidth={2.2} className="shrink-0" />
                      </AdvButton>
                    </div>
                  ))}
                </AdvOverlayScroll>
                <AdvButton
                  variant="ghost"
                  size="sm"
                  onClick={() => setRanges((prev) => [...prev, { from: '', to: '' }])}
                  className="w-full text-agv-accent"
                >
                  + Thêm khoảng giờ
                </AdvButton>
              </div>
            ) : (
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--agv-text-muted)]">
                    Dán hoặc nhập danh sách giờ (mỗi dòng 1 mốc giờ HH:mm):
                  </span>
                  {rawText && (
                    <AdvButton
                      variant="destructive"
                      size="sm"
                      onClick={() => setRawText('')}
                      className="px-2"
                    >
                      Xóa trắng
                    </AdvButton>
                  )}
                </div>
                <textarea
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder="VD:&#10;08:30&#10;12:00&#10;17:45"
                  {...NO_AUTOFILL_PROPS}
                  rows={5}
                  className="agv-control w-full p-2 text-xs text-[var(--agv-text-main)] placeholder:text-[var(--agv-text-muted)] resize-y min-h-[100px] max-h-[200px]"
                />
              </div>
            )}
          </div>
        )}
      </AdvOverlayScroll>

      {/* 4. Footer: Đếm số điều kiện & 2 nút Xóa / Áp dụng */}
      <div className="flex items-center justify-between px-3 py-2 border-t border-[var(--agv-border)] bg-[var(--agv-bg-header)] shrink-0">
        <div className="text-xs text-[var(--agv-text-muted)]">
          {totalConditionsCount > 0 ? (
            <span>
              Tổng cộng: <strong className="text-agv-accent">{totalConditionsCount}</strong> điều kiện ({isNegativeOp ? 'AND' : 'OR'})
            </span>
          ) : (
            <span className="italic">Chưa có điều kiện</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <AdvButton
            variant="destructive"
            size="sm"
            onClick={() => {
              onClear(column.key);
              onClose();
            }}
            className="px-2.5"
          >
            Xóa
          </AdvButton>
          <AdvButton
            variant="default"
            size="sm"
            onClick={handleApply}
          >
            Áp dụng
          </AdvButton>
        </div>
      </div>
    </>
  );

  const renderFallbackPortal = () => {
    if (!anchorRect) return null;
    const popupWidth = 390;
    const padding = 8;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let left =
      anchorRect.width && anchorRect.width <= 120
        ? anchorRect.right - popupWidth
        : anchorRect.left;

    if (left + popupWidth > viewportWidth - padding) {
      left = viewportWidth - popupWidth - padding;
    }
    if (left < padding) {
      left = padding;
    }

    const spaceBelow = viewportHeight - anchorRect.bottom - padding;
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
      backgroundColor: 'var(--popup-background)',
      borderColor: 'var(--popup-border)',
      boxShadow: 'var(--popup-shadow)',
      color: 'var(--agv-text-main)',
      ...(isFlipUp
        ? { bottom: `${viewportHeight - anchorRect.top + 4}px`, top: 'auto' }
        : { top: `${anchorRect.bottom + 4}px`, bottom: 'auto' }),
    };

    return createPortal(
      <div
        ref={popupRef}
        style={popupStyle}
        className={`agv-multi-filter-popup agv-popup-panel flex flex-col rounded-md border text-xs overflow-hidden select-none ${
          isFlipUp ? 'agv-spring-up' : 'agv-spring-down'
        } ${getThemeClass(surfaceTheme as any)}`}
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

  const anchorWidth = anchorEl ? anchorEl.getBoundingClientRect().width : 0;

  return (
    <>
      {anchorEl ? (
        <AdvAnchoredPopover
          isOpen={isOpen}
          anchorEl={anchorEl}
          onClose={onClose}
          placement={anchorWidth > 0 && anchorWidth <= 120 ? 'bottom-end' : 'bottom-start'}
          showArrow={true}
          offset={10}
          width={390}
          minWidth={320}
          maxWidth="calc(100vw - 16px)"
          paddingClassName="p-0"
          contentClassName="text-xs agv-multi-filter-popup"
          zIndex={99999999}
          theme={surfaceTheme}
          ignoreClickOutsideSelectors={`${DEFAULT_POPOVER_IGNORE_SELECTORS}, .agv-custom-select-dropdown, .agv-datepicker-popup, .agv-modal-portal, [data-agv-popover-trigger="true"]`}
        >
          <div
            data-theme={surfaceTheme}
            className="flex flex-col max-h-[min(520px,calc(100vh-80px))] rounded-md overflow-hidden text-xs text-[var(--agv-text-main)] select-none"
          >
            {innerSections}
          </div>
        </AdvAnchoredPopover>
      ) : (
        renderFallbackPortal()
      )}

      {/* Dropdown danh sách toán tử qua AdvAnchoredPopover */}
      <AdvAnchoredPopover
        isOpen={isOpMenuOpen}
        anchorEl={opBtnRef.current}
        onClose={() => setIsOpMenuOpen(false)}
        placement="bottom-end"
        showArrow={true}
        offset={10}
        width={192}
        minWidth={192}
        paddingClassName="p-0"
        contentClassName="text-xs agv-multi-filter-op-menu"
        zIndex={100000000}
        theme={surfaceTheme}
        ignoreClickOutsideSelectors=""
      >
        <div
          data-theme={surfaceTheme}
          onMouseDown={(e) => e.stopPropagation()}
          className="w-full rounded-md overflow-hidden flex flex-col select-none"
        >
          <AdvOverlayScroll
            className="flex-initial min-h-0"
            viewportClassName="p-1 overflow-y-auto overflow-x-hidden flex flex-col gap-0.5 overscroll-contain"
            viewportStyle={{ maxHeight: '222px' }}
            contentSignature={allowedOps.length}
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
                    className={`agv-popup-item ${isSel ? 'is-selected' : ''}`}
                  >
                    <FilterOpIcon op={op} size={14} className="shrink-0" />
                    <span className="flex-1 truncate">{FILTER_OP_META[op]?.label}</span>
                    {isSel && <Check size={13} strokeWidth={2.5} className="shrink-0" />}
                  </div>
                );
              })}
          </AdvOverlayScroll>
        </div>
      </AdvAnchoredPopover>
    </>
  );
};
