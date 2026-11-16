import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  memo,
} from 'react';
import { createPortal } from 'react-dom';
import {
  Calendar,
  Clock,
  Check,
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  ArrowRight,
} from 'lucide-react';
import { ensureDatePickerStyles } from './datepicker/datePickerStyles';
import { NO_AUTOFILL_PROPS, getGridControlRadiusClass } from '../grid/constants';
import { SURFACE_THEMES, GridTheme } from '../../themes';
import {
  getThemeClass,
  MONTH_LABELS,
  MONTH_SHORT_LABELS,
  CALENDAR_WEEKDAYS,
  REGEX_BARE_YEAR,
  REGEX_MULTI_SPLIT,
  formatDateToYMD,
  parseDateToTimestamp,
  formatDisplayDate,
  formatGridDateValue,
  parseDMYToDate,
  computePresetDateRange,
  normalizePresetList,
  getPresetLabel,
  isDateDisabledHelper,
  shiftMonth,
  CalendarCellItem,
  buildCalendarCells,
  usePopupDismiss,
  computeDropdownMenuCoords,
  computeCalendarCoords,
  resolveMinYearFromContext,
} from './datepicker/datePickerUtils';
import {
  TimePickerBlock,
  TimePickerBlockProps,
  AdvDevExpressCalendarBody,
  AdvDevExpressCalendarBodyProps,
} from './datepicker/AdvCalendarPrimitives';
import {
  AdvDatePresetSelect,
  AdvDatePresetSelectProps,
} from './datepicker/AdvDatePresetSelect';
import {
  AdvDateRangePicker,
  AdvDateRangePickerProps,
} from './datepicker/AdvDateRangePicker';

export {
  Calendar,
  Clock,
  Check,
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  ArrowRight,
  getThemeClass,
  MONTH_LABELS,
  MONTH_SHORT_LABELS,
  CALENDAR_WEEKDAYS,
  formatDateToYMD,
  parseDateToTimestamp,
  formatDisplayDate,
  formatGridDateValue,
  parseDMYToDate,
  computePresetDateRange,
  normalizePresetList,
  getPresetLabel,
  isDateDisabledHelper,
  shiftMonth,
  buildCalendarCells,
  usePopupDismiss,
  computeDropdownMenuCoords,
  computeCalendarCoords,
  TimePickerBlock,
  AdvDevExpressCalendarBody,
  AdvDatePresetSelect,
  AdvDateRangePicker,
};
export type {
  CalendarCellItem,
  TimePickerBlockProps,
  AdvDevExpressCalendarBodyProps,
  AdvDatePresetSelectProps,
  AdvDateRangePickerProps,
};

export interface AdvDatePickerProps {
  value?: string;
  preset?: string;
  onChange?: (
    val: string,
    range?: { from: string; to: string; preset?: string }
  ) => void;
  min?: string;
  max?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  onDoubleClick?: (e: React.MouseEvent) => void;
  theme?: GridTheme;
  size?: 'xs' | 'sm' | 'default' | 'md';
  showPreset?: boolean;
  showTime?: boolean;
  autoFocus?: boolean;
  defaultOpen?: boolean;
  onClose?: () => void;
  dateAnalysis?: any;
  bounds?: any;
  showCalendarIcon?: boolean;
  allowClear?: boolean;
}

export const AdvDatePicker = memo(function AdvDatePicker({
  value: propValue,
  preset: propPreset,
  onChange,
  onClose,
  min = '',
  max = '',
  placeholder = 'DD/MM/YYYY',
  disabled = false,
  className = '',
  onDoubleClick,
  theme = '',
  size = 'default',
  showPreset = false,
  showTime = false,
  autoFocus = false,
  defaultOpen = false,
  dateAnalysis,
  bounds,
  showCalendarIcon = false,
  allowClear = true,
}: AdvDatePickerProps) {
  useEffect(() => {
    ensureDatePickerStyles();
  }, []);

  const [internalVal, setInternalVal] = useState(propValue || '');
  const value = propValue !== undefined ? propValue : internalVal;

  const [presetValue, setPresetValue] = useState<string>(() => {
    if (!showPreset) return '';
    if (propPreset) return propPreset;
    if (
      propValue &&
      (propValue.startsWith('data_') || REGEX_BARE_YEAR.test(propValue.trim()))
    ) {
      return propValue.trim();
    }
    return '';
  });

  useEffect(() => {
    if (!showPreset) {
      setPresetValue('');
      return;
    }
    if (propPreset !== undefined) {
      setPresetValue(propPreset);
    }
  }, [showPreset, propPreset]);

  const emitChange = useCallback(
    (
      nextVal: string,
      rangeMeta?: { from: string; to: string; preset?: string }
    ) => {
      setInternalVal(nextVal);
      onChange?.(nextVal, rangeMeta);
    },
    [onChange]
  );

  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState(() =>
    presetValue ? getPresetLabel(presetValue) : formatDisplayDate(value, false, showTime)
  );

  const parsedCurrentDate = useMemo(() => (value ? parseDMYToDate(value) : null), [value]);

  const [timeVal, setTimeVal] = useState(() => ({
    h: parsedCurrentDate ? parsedCurrentDate.getHours() : 0,
    m: parsedCurrentDate ? parsedCurrentDate.getMinutes() : 0,
  }));

  const triggerRef = useRef<HTMLDivElement | null>(null);
  const calendarRef = useRef<HTMLDivElement | null>(null);
  const [coords, setCoords] = useState<{ top: number; left: number; bottom?: number; isFlipUp?: boolean }>({ top: 0, left: 0 });

  useEffect(() => {
    if (!value && !presetValue) {
      setInputText('');
      return;
    }
    if (
      showPreset &&
      value &&
      (value.startsWith('data_') || REGEX_BARE_YEAR.test(value.trim()))
    ) {
      const pId = REGEX_BARE_YEAR.test(value.trim())
        ? `data_year_${value.trim()}`
        : value.trim();
      setPresetValue(pId);
      setInputText(getPresetLabel(pId));
      return;
    }
    if (showPreset && presetValue) {
      const r = computePresetDateRange(presetValue);
      if (value === r.from || value === presetValue) {
        setInputText(
          r.from && r.to && r.from === r.to
            ? formatDisplayDate(r.from, false, showTime)
            : getPresetLabel(presetValue)
        );
        return;
      }
    }
    setInputText(formatDisplayDate(value, false, showTime));
    if (parsedCurrentDate) {
      setTimeVal({ h: parsedCurrentDate.getHours(), m: parsedCurrentDate.getMinutes() });
    }
  }, [value, presetValue, showPreset, showTime, parsedCurrentDate]);

  const discreteRanges = useMemo(() => {
    if (!presetValue) return null;
    const parts = presetValue
      .split(REGEX_MULTI_SPLIT)
      .map((s) => s.trim())
      .filter(Boolean);
    if (parts.length === 0) return null;
    const ranges: Array<{ fromTs: number | null; toTs: number | null }> = [];
    for (let i = 0; i < parts.length; i++) {
      const r = computePresetDateRange(parts[i]);
      if (!r.from && !r.to) continue;
      const d1 = r.from ? parseDMYToDate(r.from) : null;
      const d2 = r.to ? parseDMYToDate(r.to) : null;
      ranges.push({
        fromTs: d1 ? d1.getTime() : null,
        toTs: d2 ? d2.getTime() : null,
      });
    }
    return ranges.length > 0 ? ranges : null;
  }, [presetValue]);

  const parsedDate = useMemo(() => {
    if (discreteRanges && discreteRanges.length > 0 && discreteRanges[0].fromTs !== null) {
      return new Date(discreteRanges[0].fromTs);
    }
    return value ? parseDMYToDate(value) : null;
  }, [value, discreteRanges]);

  const parsedTs = useMemo(
    () => (parsedDate ? new Date(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate()).getTime() : null),
    [parsedDate]
  );

  const todayTs = useMemo(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  }, []);

  const currentRealYear = useMemo(() => new Date().getFullYear(), []);
  const dataMinYear = useMemo(
    () => resolveMinYearFromContext(undefined, min, dateAnalysis, bounds),
    [min, dateAnalysis, bounds]
  );

  const effMin = useMemo(() => {
    if (min && min.trim()) return min.trim();
    return `${dataMinYear}-01-01`;
  }, [min, dataMinYear]);

  const effMax = max && max.trim() ? max.trim() : `${currentRealYear + 1}-12-31`;

  const effMinYMD = useMemo(() => {
    const d = parseDMYToDate(effMin);
    return d ? formatDateToYMD(d, showTime) : '';
  }, [effMin, showTime]);

  const effMaxYMD = useMemo(() => {
    const d = parseDMYToDate(effMax);
    return d ? formatDateToYMD(d, showTime) : '';
  }, [effMax, showTime]);

  const minTs = useMemo(() => parseDateToTimestamp(effMin, false), [effMin]);
  const maxTs = useMemo(() => parseDateToTimestamp(effMax, true), [effMax]);

  const clampTargetDate = useCallback(
    (candidate: Date | null) => {
      const cur = candidate || new Date();
      const effMinDate = parseDMYToDate(effMin) || new Date(dataMinYear, 0, 1);
      const effMaxDate = parseDMYToDate(effMax) || new Date(currentRealYear + 1, 11, 31);
      if (cur.getTime() < effMinDate.getTime()) return effMinDate;
      if (cur.getTime() > effMaxDate.getTime()) return effMaxDate;
      return cur;
    },
    [effMin, effMax, dataMinYear, currentRealYear]
  );

  const [navYear, setNavYear] = useState(() => clampTargetDate(parsedDate).getFullYear());
  const [navMonth, setNavMonth] = useState(() => clampTargetDate(parsedDate).getMonth());
  const [calendarView, setCalendarView] = useState<'days' | 'months' | 'years'>('days');

  const popoverW = 264;
  const popoverH = (showPreset ? 40 : 0) + 265 + (showTime ? 40 : 0);

  const updateCoords = useCallback(() => {
    const next = computeCalendarCoords(
      triggerRef.current,
      popoverW,
      popoverH
    );
    setCoords((prev) =>
      prev.top === next.top && prev.left === next.left && prev.isFlipUp === next.isFlipUp ? prev : next
    );
  }, [popoverW, popoverH]);

  const closeCalendar = useCallback(() => {
    setIsOpen(false);
    onClose?.();
  }, [onClose]);

  const openCalendar = useCallback(() => {
    if (disabled) return;
    const target = clampTargetDate(parsedDate);
    setNavYear(target.getFullYear());
    setNavMonth(target.getMonth());
    setCalendarView('days');
    setCoords(
      computeCalendarCoords(
        triggerRef.current,
        popoverW,
        popoverH
      )
    );
    const isNested = Boolean(triggerRef.current?.closest('.agv-multi-filter-popup'));
    window.dispatchEvent(
      new CustomEvent('agv-close-all-popups', {
        detail: {
          except: isNested ? 'multi-filter' : 'datepicker',
          source: 'datepicker',
        },
      })
    );
    setIsOpen(true);
  }, [disabled, clampTargetDate, parsedDate, popoverW, popoverH]);

  useEffect(() => {
    if (autoFocus && triggerRef.current) {
      const input = triggerRef.current.querySelector('input');
      input?.focus({ preventScroll: true });
      input?.select();
    }
    if (defaultOpen) {
      openCalendar();
    }
  }, [autoFocus, defaultOpen, openCalendar]);

  usePopupDismiss(isOpen, closeCalendar, updateCoords, triggerRef, calendarRef);

  const calendarCells = useMemo(
    () => buildCalendarCells(navYear, navMonth),
    [navYear, navMonth]
  );

  const handleSelectDate = useCallback(
    (cell: CalendarCellItem) => {
      if (isDateDisabledHelper(cell.ts, minTs, maxTs)) return;
      setPresetValue('');
      const selected = new Date(cell.date);
      selected.setHours(timeVal.h, timeVal.m);
      const ymd = formatDateToYMD(selected, showTime);
      setInputText(formatDisplayDate(ymd, false, showTime));
      emitChange(ymd, { from: ymd, to: ymd, preset: '' });
      if (!showTime) {
        setIsOpen(false);
        onClose?.();
      }
    },
    [minTs, maxTs, timeVal, showTime, emitChange, onClose]
  );

  const handleApplyTime = useCallback(() => {
    const base = parsedDate || new Date();
    const finalDate = new Date(base.getFullYear(), base.getMonth(), base.getDate(), timeVal.h, timeVal.m);
    const ymd = formatDateToYMD(finalDate, showTime);
    setInputText(formatDisplayDate(ymd, false, showTime));
    emitChange(ymd, { from: ymd, to: ymd, preset: '' });
    setIsOpen(false);
    onClose?.();
  }, [parsedDate, timeVal, showTime, emitChange, onClose]);

  const handleInputBlur = useCallback(() => {
    if (isOpen) return;
    const raw = inputText.trim();
    if (!raw) {
      setPresetValue('');
      emitChange('', { from: '', to: '', preset: '' });
      return;
    }
    if (presetValue && raw === getPresetLabel(presetValue)) {
      return;
    }
    if (showPreset && REGEX_BARE_YEAR.test(raw)) {
      const pId = `data_year_${raw}`;
      const range = computePresetDateRange(pId);
      setPresetValue(pId);
      setInputText(getPresetLabel(pId));
      emitChange(range.from, { from: range.from, to: range.to, preset: pId });
      return;
    }
    setPresetValue('');
    const d = parseDMYToDate(raw);
    if (d) {
      let ymd = formatDateToYMD(d, showTime);
      const pureYmd = ymd.slice(0, 10);
      const pureMin = effMinYMD ? effMinYMD.slice(0, 10) : '';
      const pureMax = effMaxYMD ? effMaxYMD.slice(0, 10) : '';
      if (pureMin && pureYmd < pureMin) ymd = effMinYMD;
      if (pureMax && pureYmd > pureMax) ymd = effMaxYMD;
      emitChange(ymd, { from: ymd, to: ymd, preset: '' });
      setInputText(formatDisplayDate(ymd, false, showTime));
    } else {
      setInputText(formatDisplayDate(value, false, showTime));
    }
  }, [isOpen, inputText, presetValue, showPreset, effMinYMD, effMaxYMD, value, showTime, emitChange]);

  const checkSingleMonthSelected = useCallback(
    (y: number, m: number) => {
      if (discreteRanges && discreteRanges.length > 0) {
        const mStart = new Date(y, m, 1, 0, 0, 0, 0).getTime();
        const mEnd = new Date(y, m + 1, 0, 23, 59, 59, 999).getTime();
        return discreteRanges.some(
          (r) =>
            r.fromTs !== null &&
            r.toTs !== null &&
            r.fromTs <= mEnd &&
            r.toTs >= mStart
        );
      }
      return Boolean(
        parsedDate &&
          parsedDate.getFullYear() === y &&
          parsedDate.getMonth() === m
      );
    },
    [discreteRanges, parsedDate]
  );

  const checkSingleYearSelected = useCallback(
    (y: number) => {
      if (discreteRanges && discreteRanges.length > 0) {
        const yStart = new Date(y, 0, 1, 0, 0, 0, 0).getTime();
        const yEnd = new Date(y, 11, 31, 23, 59, 59, 999).getTime();
        return discreteRanges.some(
          (r) =>
            r.fromTs !== null &&
            r.toTs !== null &&
            r.fromTs <= yEnd &&
            r.toTs >= yStart
        );
      }
      return Boolean(parsedDate && parsedDate.getFullYear() === y);
    },
    [discreteRanges, parsedDate]
  );

  const renderSingleDayCell = useCallback(
    (cell: CalendarCellItem, idx: number) => {
      const ts = cell.ts;
      const disabledCell = isDateDisabledHelper(ts, minTs, maxTs);
      const todayCell = ts === todayTs;

      let isStart = false;
      let isEnd = false;
      let inRange = false;
      let selectedCell = false;

      if (discreteRanges && discreteRanges.length > 0) {
        for (let i = 0; i < discreteRanges.length; i++) {
          const r = discreteRanges[i];
          if (r.fromTs !== null && ts === r.fromTs) isStart = true;
          if (r.toTs !== null && ts === r.toTs) isEnd = true;
          if (
            r.fromTs !== null &&
            r.toTs !== null &&
            ts >= r.fromTs &&
            ts <= r.toTs
          ) {
            inRange = true;
          }
        }
      } else {
        selectedCell = parsedTs !== null && ts === parsedTs;
      }

      let cellClass = 'agv-cal-day-cell';
      if (cell.isWeekend) cellClass += ' is-weekend';
      if (!cell.isCurrentMonth) cellClass += ' is-other-month';
      if (disabledCell) cellClass += ' is-disabled';
      if (isStart) cellClass += ' is-range-start is-selected';
      if (isEnd) cellClass += ' is-range-end is-selected';
      if (inRange) cellClass += ' is-in-range';
      if (selectedCell) cellClass += ' is-selected';
      if (todayCell && !selectedCell && !isStart && !isEnd) {
        cellClass += ' is-today';
      }

      return (
        <button
          key={idx}
          type="button"
          disabled={disabledCell}
          onClick={() => handleSelectDate(cell)}
          className={cellClass}
        >
          {cell.dayNum}
        </button>
      );
    },
    [minTs, maxTs, todayTs, discreteRanges, parsedTs, handleSelectDate]
  );

  const sizeClass = size === 'xs' ? 'is-xs' : size === 'md' ? 'is-md' : 'is-sm';

  return (
    <div className={`agv-datepicker-container ${className}`} ref={triggerRef}>
      <div
        className={`agv-datepicker-input-box ${getGridControlRadiusClass()} ${
          isOpen ? 'is-focused' : ''
        } ${sizeClass}`}
      >
        {showCalendarIcon && (
          <Calendar className="pointer-events-none h-3 w-3 shrink-0 text-[var(--agv-text-subtle)]" />
        )}
        <input
          type="text"
          name="agv_date_picker"
          {...NO_AUTOFILL_PROPS}
          disabled={disabled}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onBlur={handleInputBlur}
          onKeyDown={(e) => e.key === 'Enter' && handleInputBlur()}
          onClick={() => (isOpen ? closeCalendar() : openCalendar())}
          onDoubleClick={onDoubleClick}
          placeholder={showTime ? "DD/MM/YYYY HH:mm" : placeholder}
          className="agv-datepicker-text"
        />
        {allowClear && (value || presetValue) && !disabled && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setPresetValue('');
              setInputText('');
              emitChange('', { from: '', to: '', preset: '' });
            }}
            className="agv-datepicker-clear-btn agv-inline-clear-destructive"
          >
            ×
          </button>
        )}
      </div>

      {isOpen &&
        createPortal(
          <div
            ref={calendarRef}
            style={{
              position: 'fixed',
              ...(coords.isFlipUp
                ? { bottom: `${coords.bottom}px`, top: 'auto' }
                : { top: `${coords.top}px`, bottom: 'auto' }),
              left: `${coords.left}px`,
              zIndex: 999999999,
            }}
            className={`agv-calendar-popover agv-popup-panel ${
              coords.isFlipUp ? 'agv-spring-up' : 'agv-spring-down'
            } ${showPreset ? 'agv-has-preset agv-daterange-popover' : ''} ${theme ? getThemeClass(theme) : ''}`}
            data-theme={theme || undefined}
            data-agv-popup="true"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {showPreset && (
              <div className="agv-datepicker-preset-section agv-daterange-preset-section mb-2 border-b border-[var(--agv-border)] pb-2">
                <AdvDatePresetSelect
                  value={presetValue}
                  min={effMin}
                  max={effMax}
                  dateAnalysis={dateAnalysis}
                  label="Mốc thời gian:"
                  theme={theme}
                  onSelect={(presetId: string, isMulti?: boolean) => {
                    setPresetValue(presetId);
                    if (presetId) {
                      const range = computePresetDateRange(presetId);
                      const parsedMin = parseDMYToDate(effMin);
                      const parsedMax = parseDMYToDate(effMax);
                      let finalFrom = range.from;
                      let finalTo = range.to;
                      let dFrom = range.from ? parseDMYToDate(range.from) : null;
                      let dTo = range.to ? parseDMYToDate(range.to) : null;
                      if (dFrom && parsedMin && dFrom.getTime() < parsedMin.getTime()) {
                        finalFrom = formatDateToYMD(parsedMin, false);
                      }
                      if (dTo && parsedMax && dTo.getTime() > parsedMax.getTime()) {
                        finalTo = formatDateToYMD(parsedMax, false);
                      }
                      const targetDateStr = finalFrom || finalTo;
                      if (targetDateStr) {
                        const isSingleDay =
                          Boolean(finalFrom && finalTo) &&
                          finalFrom === finalTo;
                        setInputText(
                          isSingleDay
                            ? formatDisplayDate(targetDateStr, false, showTime)
                            : getPresetLabel(presetId)
                        );
                        emitChange(targetDateStr, {
                          from: finalFrom,
                          to: finalTo,
                          preset: presetId,
                        });
                        const d = parseDMYToDate(targetDateStr);
                        if (d) {
                          setNavYear(d.getFullYear());
                          setNavMonth(d.getMonth());
                        }
                      }
                      setCalendarView('days');
                      if (!isMulti && !showTime) {
                        setIsOpen(false);
                      }
                    } else {
                      setInputText('');
                      emitChange('', { from: '', to: '', preset: '' });
                      if (!isMulti && !showTime) {
                        setIsOpen(false);
                      }
                    }
                  }}
                />
              </div>
            )}

            <AdvDevExpressCalendarBody
              calendarView={calendarView}
              setCalendarView={setCalendarView}
              navYear={navYear}
              setNavYear={setNavYear}
              navMonth={navMonth}
              setNavMonth={setNavMonth}
              calendarCells={calendarCells}
              activeDate={parsedDate}
              minTs={minTs}
              maxTs={maxTs}
              minYear={dataMinYear}
              isMonthSelected={checkSingleMonthSelected}
              isYearSelected={checkSingleYearSelected}
              renderDayCell={renderSingleDayCell}
            />

            {/* SINGLE DATE TIME FOOTER */}
            {showTime && (
              <div className="agv-time-footer">
                <div className="flex items-center gap-2">
                  <TimePickerBlock
                    hours={timeVal.h}
                    minutes={timeVal.m}
                    onChangeTime={(h, m) => setTimeVal({ h, m })}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const d = new Date();
                      setTimeVal({ h: d.getHours(), m: d.getMinutes() });
                    }}
                    className="agv-time-quick-btn"
                  >
                    Hiện tại
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleApplyTime}
                  className="agv-apply-btn"
                >
                  Áp dụng
                </button>
              </div>
            )}
          </div>,
          triggerRef.current?.ownerDocument?.body || document.body
        )}
    </div>
  );
});

// Short aliases for convenient library consumption
export {
  AdvDatePicker as DatePicker,
  AdvDateRangePicker as DateRangePicker,
  AdvDatePresetSelect as DatePresetSelect,
  AdvDatePicker as App,
};

export default AdvDatePicker;