import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  memo,
} from 'react';
import { createPortal } from 'react-dom';
import { ArrowRight } from 'lucide-react';
import { ensureDatePickerStyles } from './datePickerStyles';
import { NO_AUTOFILL_PROPS, getGridControlRadiusClass } from '../../grid/constants';
import { SURFACE_THEMES, GridTheme } from '../../../themes';
import {
  getThemeClass,
  REGEX_MULTI_SPLIT,
  REGEX_RANGE_INPUT_SPLIT,
  formatDateToYMD,
  parseDateToTimestamp,
  formatDisplayDate,
  parseDMYToDate,
  computePresetDateRange,
  getPresetLabel,
  isDateDisabledHelper,
  shiftMonth,
  CalendarCellItem,
  buildCalendarCells,
  usePopupDismiss,
  computeCalendarCoords,
  resolveMinYearFromContext,
} from './datePickerUtils';
import { TimePickerBlock, AdvDevExpressCalendarBody } from './AdvCalendarPrimitives';
import { AdvDatePresetSelect } from './AdvDatePresetSelect';

export interface AdvDateRangePickerProps {
  from?: string;
  to?: string;
  onChange?: (range: { from: string; to: string; preset?: string }) => void;
  min?: string;
  max?: string;
  placeholderFrom?: string;
  placeholderTo?: string;
  theme?: GridTheme;
  dateAnalysis?: any;
  bounds?: any;
  size?: 'xs' | 'sm' | 'default' | 'md';
  preset?: string;
  showPreset?: boolean;
  dualMonth?: boolean;
  showTime?: boolean;
  autoFocus?: boolean;
  defaultOpen?: boolean;
  onClose?: () => void;
  allowClear?: boolean;
  className?: string;
}

export const AdvDateRangePicker = memo(function AdvDateRangePicker({
  from: propFrom,
  to: propTo,
  preset: propPreset,
  onChange,
  onClose,
  min = '',
  max = '',
  placeholderFrom = 'Từ',
  placeholderTo = 'Đến',
  theme = '',
  dateAnalysis,
  bounds,
  size = 'default',
  showPreset = true,
  dualMonth = true,
  showTime = false,
  autoFocus = false,
  defaultOpen = false,
  allowClear = true,
  className = '',
}: AdvDateRangePickerProps) {
  useEffect(() => {
    ensureDatePickerStyles();
  }, []);

  const [internalRange, setInternalRange] = useState({
    from: propFrom || '',
    to: propTo || '',
    preset: propPreset || '',
  });

  const from = propFrom !== undefined ? propFrom : internalRange.from;
  const to = propTo !== undefined ? propTo : internalRange.to;

  const [isOpen, setIsOpen] = useState(false);
  const [presetValue, setPresetValue] = useState<string>(propPreset || '');

  useEffect(() => {
    if (propPreset !== undefined) {
      setPresetValue(propPreset);
    }
  }, [propPreset]);

  const emitChange = useCallback(
    (next: { from: string; to: string; preset?: string }) => {
      setInternalRange({
        from: next.from,
        to: next.to,
        preset: next.preset || '',
      });
      onChange?.(next);
    },
    [onChange]
  );

  const triggerRef = useRef<HTMLDivElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const [coords, setCoords] = useState<{ top: number; left: number; bottom?: number; isFlipUp?: boolean }>({ top: 0, left: 0 });

  const dFrom = useMemo(() => (from ? parseDMYToDate(from) : null), [from]);
  const dTo = useMemo(() => (to ? parseDMYToDate(to) : null), [to]);

  const [timeFrom, setTimeFrom] = useState(() => ({
    h: dFrom ? dFrom.getHours() : 0,
    m: dFrom ? dFrom.getMinutes() : 0,
  }));
  const [timeTo, setTimeTo] = useState(() => ({
    h: dTo ? dTo.getHours() : 23,
    m: dTo ? dTo.getMinutes() : 59,
  }));

  const isSameDate = Boolean(
    from && to && (from === to || (dFrom && dTo && dFrom.toDateString() === dTo.toDateString()))
  );

  const isSameYear = Boolean(
    (dFrom && dTo && dFrom.getFullYear() === dTo.getFullYear()) ||
      (dateAnalysis?.yearCounts &&
        Object.keys(dateAnalysis.yearCounts).length === 1) ||
      (dateAnalysis?.minDate &&
        dateAnalysis?.maxDate &&
        dateAnalysis.minDate.getFullYear() ===
          dateAnalysis.maxDate.getFullYear())
  );

  const effPlaceholderFrom = placeholderFrom || 'Từ';
  const effPlaceholderTo = placeholderTo || 'Đến';

  const [selectingState, setSelectingState] = useState<'start' | 'end'>('start');
  const [tempFrom, setTempFrom] = useState<Date | null>(() => dFrom);
  const [tempTo, setTempTo] = useState<Date | null>(() => dTo);
  const [hoverTs, setHoverTs] = useState<number | null>(null);

  const [inputFromText, setInputFromText] = useState(() => {
    const sameY = Boolean(
      dFrom && dTo && dFrom.getFullYear() === dTo.getFullYear() && from !== to
    );
    return formatDisplayDate(from, sameY, showTime);
  });
  const [inputToText, setInputToText] = useState(() => {
    const sameY = Boolean(
      dFrom && dTo && dFrom.getFullYear() === dTo.getFullYear() && from !== to
    );
    return formatDisplayDate(to, sameY, showTime);
  });

  const [calendarView, setCalendarView] = useState<'days' | 'months' | 'years'>('days');

  useEffect(() => {
    setTempFrom(dFrom);
    setTempTo(dTo);
    if (dFrom) setTimeFrom({ h: dFrom.getHours(), m: dFrom.getMinutes() });
    if (dTo) setTimeTo({ h: dTo.getHours(), m: dTo.getMinutes() });
    const sameY = Boolean(
      dFrom && dTo && dFrom.getFullYear() === dTo.getFullYear() && from !== to
    );
    setInputFromText(formatDisplayDate(from, sameY, showTime));
    setInputToText(formatDisplayDate(to, sameY, showTime));
  }, [from, to, dFrom, dTo, showTime]);

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

  const clampTargetDate = useCallback(
    (candidate: Date | null) => {
      const cur = candidate || new Date();
      const effMinDate =
        parseDMYToDate(effMin) || new Date(dataMinYear, 0, 1);
      const effMaxDate =
        parseDMYToDate(effMax) || new Date(currentRealYear + 1, 11, 31);
      if (cur.getTime() < effMinDate.getTime()) return effMinDate;
      if (cur.getTime() > effMaxDate.getTime()) return effMaxDate;
      return cur;
    },
    [effMin, effMax, dataMinYear, currentRealYear]
  );

  const [navYear, setNavYear] = useState(() =>
    clampTargetDate(dFrom).getFullYear()
  );
  const [navMonth, setNavMonth] = useState(() =>
    clampTargetDate(dFrom).getMonth()
  );

  const rightNav = useMemo(() => shiftMonth(navMonth, navYear, 1), [navMonth, navYear]);

  const popoverWidth = dualMonth ? 518 : 264;
  const popoverHeight = (showPreset ? 40 : 0) + 265 + (showTime ? (dualMonth ? 40 : 70) : 0);

  const updateCoords = useCallback(() => {
    const next = computeCalendarCoords(triggerRef.current, popoverWidth, popoverHeight);
    setCoords((prev) =>
      prev.top === next.top && prev.left === next.left && prev.isFlipUp === next.isFlipUp ? prev : next
    );
  }, [popoverWidth, popoverHeight]);

  const closePopover = useCallback(() => {
    setIsOpen(false);
    setHoverTs(null);
    if (tempFrom && !tempTo) {
      const ymd = formatDateToYMD(tempFrom, showTime);
      emitChange({ from: ymd, to: ymd, preset: '' });
      setInputToText(formatDisplayDate(ymd, false, showTime));
    }
    onClose?.();
  }, [onClose, tempFrom, tempTo, showTime, emitChange]);

  const openCalendar = useCallback(
    (preferredState?: 'start' | 'end') => {
      const target = clampTargetDate(preferredState === 'end' && dTo ? dTo : dFrom);
      setNavYear(target.getFullYear());
      setNavMonth(target.getMonth());
      setSelectingState(preferredState || (from && !to ? 'end' : 'start'));
      setTempFrom(dFrom);
      setTempTo(dTo);
      setHoverTs(null);
      setCalendarView('days');
      setCoords(computeCalendarCoords(triggerRef.current, popoverWidth, popoverHeight));
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
    },
    [clampTargetDate, dFrom, dTo, from, to, popoverWidth, popoverHeight]
  );

  usePopupDismiss(isOpen, closePopover, updateCoords, triggerRef, popoverRef);

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

  const minTs = useMemo(() => parseDateToTimestamp(effMin, false), [effMin]);
  const maxTs = useMemo(() => parseDateToTimestamp(effMax, true), [effMax]);

  const leftCalendarCells = useMemo(
    () => buildCalendarCells(navYear, navMonth),
    [navYear, navMonth]
  );

  const rightCalendarCells = useMemo(
    () => buildCalendarCells(rightNav.year, rightNav.month),
    [rightNav]
  );

  const tempFromTs = useMemo(
    () =>
      tempFrom
        ? new Date(
            tempFrom.getFullYear(),
            tempFrom.getMonth(),
            tempFrom.getDate()
          ).getTime()
        : null,
    [tempFrom]
  );

  const tempToTs = useMemo(
    () =>
      tempTo
        ? new Date(
            tempTo.getFullYear(),
            tempTo.getMonth(),
            tempTo.getDate()
          ).getTime()
        : null,
    [tempTo]
  );

  const handleCellClick = useCallback(
    (cell: CalendarCellItem) => {
      if (isDateDisabledHelper(cell.ts, minTs, maxTs)) return;
      setPresetValue('');

      if (
        selectingState === 'start' ||
        (!tempFrom && !tempTo) ||
        (tempFrom && tempTo && selectingState !== 'end')
      ) {
        const newStart = new Date(cell.date);
        newStart.setHours(timeFrom.h, timeFrom.m);
        setTempFrom(newStart);
        setTempTo(null);
        setHoverTs(null);
        setSelectingState('end');
        const fromYMD = formatDateToYMD(newStart, showTime);
        setInputFromText(formatDisplayDate(fromYMD, false, showTime));
        setInputToText('');
      } else {
        // selectingState === 'end'
        if (tempFromTs !== null && cell.ts < tempFromTs) {
          // User clicked a date earlier than start: swap them into valid [from, to]
          const newStart = new Date(cell.date);
          newStart.setHours(timeFrom.h, timeFrom.m);
          const newEnd = tempFrom || newStart;
          setTempFrom(newStart);
          setTempTo(newEnd);
          setHoverTs(null);
          setSelectingState('start');
          const fromYMD = formatDateToYMD(newStart, showTime);
          const toYMD = formatDateToYMD(newEnd, showTime);
          setInputFromText(formatDisplayDate(fromYMD, false, showTime));
          setInputToText(formatDisplayDate(toYMD, false, showTime));
          emitChange({ from: fromYMD, to: toYMD, preset: '' });
          if (!showTime) {
            setIsOpen(false);
            onClose?.();
          }
        } else {
          const newEnd = new Date(cell.date);
          newEnd.setHours(timeTo.h, timeTo.m);
          setTempTo(newEnd);
          setHoverTs(null);
          setSelectingState('start');
          const fromYMD = formatDateToYMD(tempFrom || newEnd, showTime);
          const toYMD = formatDateToYMD(newEnd, showTime);
          setInputToText(formatDisplayDate(toYMD, false, showTime));
          emitChange({ from: fromYMD, to: toYMD, preset: '' });
          if (!showTime) {
            setIsOpen(false);
            onClose?.();
          }
        }
      }
    },
    [minTs, maxTs, selectingState, tempFrom, tempTo, tempFromTs, timeFrom, timeTo, showTime, emitChange, onClose]
  );

  const handleApplyWithTime = useCallback(() => {
    if (tempFrom) {
      const start = new Date(tempFrom);
      start.setHours(timeFrom.h, timeFrom.m);
      const end = tempTo ? new Date(tempTo) : new Date(tempFrom);
      end.setHours(timeTo.h, timeTo.m);
      const fStr = formatDateToYMD(start, showTime);
      const tStr = formatDateToYMD(end, showTime);
      emitChange({ from: fStr, to: tStr, preset: '' });
      setInputFromText(formatDisplayDate(fStr, false, showTime));
      setInputToText(formatDisplayDate(tStr, false, showTime));
    }
    setIsOpen(false);
    onClose?.();
  }, [tempFrom, tempTo, timeFrom, timeTo, showTime, emitChange, onClose]);

  const handleFromBlur = useCallback(() => {
    if (isOpen) return;
    setPresetValue('');
    if (!inputFromText.trim()) {
      emitChange({ from: '', to, preset: '' });
      return;
    }
    const targetYear = dTo ? dTo.getFullYear() : undefined;
    const d = parseDMYToDate(inputFromText, targetYear);
    if (d) {
      let ymd = formatDateToYMD(d, showTime);
      if (effMinYMD && ymd < effMinYMD) ymd = effMinYMD;
      if (to && ymd > to) ymd = to;
      emitChange({ from: ymd, to, preset: '' });
      const nextSameYear = Boolean(
        dTo && dTo.getFullYear() === d.getFullYear() && ymd !== to
      );
      setInputFromText(formatDisplayDate(ymd, nextSameYear, showTime));
    } else {
      setInputFromText(formatDisplayDate(from, isSameYear && !isSameDate, showTime));
    }
  }, [isOpen, inputFromText, to, dTo, effMinYMD, from, isSameYear, isSameDate, showTime, emitChange]);

  const handleToBlur = useCallback(() => {
    if (isOpen) return;
    setPresetValue('');
    if (!inputToText.trim()) {
      emitChange({ from, to: '', preset: '' });
      return;
    }
    const targetYear = dFrom ? dFrom.getFullYear() : undefined;
    const d = parseDMYToDate(inputToText, targetYear);
    if (d) {
      let ymd = formatDateToYMD(d, showTime);
      if (from && ymd < from) ymd = from;
      if (effMaxYMD && ymd > effMaxYMD) ymd = effMaxYMD;
      emitChange({ from, to: ymd, preset: '' });
      const nextSameYear = Boolean(
        dFrom && dFrom.getFullYear() === d.getFullYear() && from !== ymd
      );
      setInputToText(formatDisplayDate(ymd, nextSameYear, showTime));
    } else {
      setInputToText(formatDisplayDate(to, isSameYear && !isSameDate, showTime));
    }
  }, [isOpen, inputToText, from, dFrom, effMaxYMD, to, isSameYear, isSameDate, showTime, emitChange]);

  const handleSingleBlur = useCallback(() => {
    if (isOpen) return;
    setPresetValue('');
    const raw = inputFromText.trim();
    if (!raw) {
      emitChange({ from: '', to: '', preset: '' });
      return;
    }
    if (
      raw.includes(';') ||
      raw.includes(' - ') ||
      raw.includes('—') ||
      raw.includes('..')
    ) {
      const parts = raw
        .split(REGEX_RANGE_INPUT_SPLIT)
        .map((s) => s.trim())
        .filter(Boolean);
      if (parts.length >= 2) {
        const d1 = parseDMYToDate(parts[0]);
        const d2 = parseDMYToDate(parts[1]);
        if (d1 && d2) {
          let ymd1 = formatDateToYMD(d1, showTime);
          let ymd2 = formatDateToYMD(d2, showTime);
          if (effMinYMD && ymd1 < effMinYMD) ymd1 = effMinYMD;
          if (effMaxYMD && ymd2 > effMaxYMD) ymd2 = effMaxYMD;
          const finalFrom = ymd1 <= ymd2 ? ymd1 : ymd2;
          const finalTo = ymd1 <= ymd2 ? ymd2 : ymd1;
          emitChange({ from: finalFrom, to: finalTo, preset: '' });
          setInputFromText(formatDisplayDate(finalFrom, false, showTime));
          setInputToText(formatDisplayDate(finalTo, false, showTime));
          return;
        }
      }
    }
    const d = parseDMYToDate(raw);
    if (d) {
      let ymd = formatDateToYMD(d, showTime);
      if (effMinYMD && ymd < effMinYMD) ymd = effMinYMD;
      if (effMaxYMD && ymd > effMaxYMD) ymd = effMaxYMD;
      emitChange({ from: ymd, to: ymd, preset: '' });
      setInputFromText(formatDisplayDate(ymd, false, showTime));
      setInputToText(formatDisplayDate(ymd, false, showTime));
    } else {
      setInputFromText(formatDisplayDate(from, false, showTime));
      setInputToText(formatDisplayDate(to, false, showTime));
    }
  }, [isOpen, inputFromText, effMinYMD, effMaxYMD, from, to, showTime, emitChange]);

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

  const checkMonthSelected = useCallback(
    (y: number, m: number) => {
      const mStart = new Date(y, m, 1, 0, 0, 0, 0).getTime();
      const mEnd = new Date(y, m + 1, 0, 23, 59, 59, 999).getTime();
      if (discreteRanges && discreteRanges.length > 0) {
        return discreteRanges.some(
          (r) =>
            r.fromTs !== null &&
            r.toTs !== null &&
            r.fromTs <= mEnd &&
            r.toTs >= mStart
        );
      }
      if (tempFromTs !== null && tempToTs !== null) {
        return tempFromTs <= mEnd && tempToTs >= mStart;
      }
      return Boolean(
        (tempFrom &&
          tempFrom.getFullYear() === y &&
          tempFrom.getMonth() === m) ||
          (tempTo && tempTo.getFullYear() === y && tempTo.getMonth() === m)
      );
    },
    [discreteRanges, tempFromTs, tempToTs, tempFrom, tempTo]
  );

  const getMonthRangeStatus = useCallback(
    (y: number, m: number) => {
      const mStart = new Date(y, m, 1, 0, 0, 0, 0).getTime();
      const mEnd = new Date(y, m + 1, 0, 23, 59, 59, 999).getTime();

      let hasStart = false;
      let hasEnd = false;
      let inRange = false;

      if (discreteRanges && discreteRanges.length > 0) {
        for (let i = 0; i < discreteRanges.length; i++) {
          const r = discreteRanges[i];
          if (r.fromTs !== null && r.toTs !== null) {
            const isStartMonth = r.fromTs >= mStart && r.fromTs <= mEnd;
            const isEndMonth = r.toTs >= mStart && r.toTs <= mEnd;
            if (isStartMonth) hasStart = true;
            if (isEndMonth) hasEnd = true;
            if (r.fromTs <= mEnd && r.toTs >= mStart && !isStartMonth && !isEndMonth) {
              inRange = true;
            }
          }
        }
      } else if (tempFromTs !== null && tempToTs !== null) {
        const isStartMonth = tempFromTs >= mStart && tempFromTs <= mEnd;
        const isEndMonth = tempToTs >= mStart && tempToTs <= mEnd;
        if (isStartMonth) hasStart = true;
        if (isEndMonth) hasEnd = true;
        if (tempFromTs <= mEnd && tempToTs >= mStart && !isStartMonth && !isEndMonth) {
          inRange = true;
        }
      } else if (tempFromTs !== null) {
        if (tempFromTs >= mStart && tempFromTs <= mEnd) {
          hasStart = true;
          hasEnd = true;
        }
      }

      return {
        isStart: hasStart,
        isEnd: hasEnd,
        inRange,
        isSelected: hasStart || hasEnd || inRange,
      };
    },
    [discreteRanges, tempFromTs, tempToTs]
  );

  const checkYearSelected = useCallback(
    (y: number) => {
      const yStart = new Date(y, 0, 1, 0, 0, 0, 0).getTime();
      const yEnd = new Date(y, 11, 31, 23, 59, 59, 999).getTime();
      if (discreteRanges && discreteRanges.length > 0) {
        return discreteRanges.some(
          (r) =>
            r.fromTs !== null &&
            r.toTs !== null &&
            r.fromTs <= yEnd &&
            r.toTs >= yStart
        );
      }
      if (tempFromTs !== null && tempToTs !== null) {
        return tempFromTs <= yEnd && tempToTs >= yStart;
      }
      return Boolean(
        (tempFrom && tempFrom.getFullYear() === y) ||
          (tempTo && tempTo.getFullYear() === y)
      );
    },
    [discreteRanges, tempFromTs, tempToTs, tempFrom, tempTo]
  );

  const handleGridMouseLeave = useCallback(() => {
    setHoverTs((prev) => (prev === null ? prev : null));
  }, []);

  const renderRangeDayCell = useCallback(
    (cell: CalendarCellItem, idx: number) => {
      const ts = cell.ts;
      const disabled = isDateDisabledHelper(ts, minTs, maxTs);

      let isStart = false;
      let isEnd = false;
      let inRange = false;
      let inHover = false;

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
        isStart = tempFromTs !== null && ts === tempFromTs;
        isEnd = tempToTs !== null && ts === tempToTs;
        if (
          tempFromTs !== null &&
          tempToTs !== null &&
          ts >= tempFromTs &&
          ts <= tempToTs
        ) {
          inRange = true;
        }
        if (
          selectingState === 'end' &&
          tempFromTs !== null &&
          tempToTs === null &&
          hoverTs !== null &&
          hoverTs >= tempFromTs &&
          ts >= tempFromTs &&
          ts <= hoverTs
        ) {
          inHover = true;
        }
      }

      const isFirstDayOfWeek = cell.date.getDay() === 0;
      const isLastDayOfWeek = cell.date.getDay() === 6;
      const isSingle = isStart && isEnd;

      let cls = 'agv-cal-day-cell';
      if (cell.isWeekend) cls += ' is-weekend';
      if (!cell.isCurrentMonth) cls += ' is-other-month';
      if (disabled) cls += ' is-disabled';
      if (isSingle) {
        cls += ' is-selected is-range-single';
      } else {
        if (isStart) cls += ' is-range-start is-selected';
        if (isEnd) cls += ' is-range-end is-selected';
      }
      if (inRange && !isSingle) {
        cls += ' is-in-range';
        if (isFirstDayOfWeek) cls += ' is-week-start';
        if (isLastDayOfWeek) cls += ' is-week-end';
      }
      if (inHover && !isStart && !isEnd) cls += ' is-in-hover';

      return (
        <button
          key={idx}
          type="button"
          disabled={disabled}
          onClick={() => handleCellClick(cell)}
          onMouseEnter={() => {
            if (selectingState === 'end') {
              setHoverTs((prev) => (prev === ts ? prev : ts));
            }
          }}
          className={cls}
        >
          {cell.dayNum}
        </button>
      );
    },
    [
      minTs,
      maxTs,
      discreteRanges,
      tempFromTs,
      tempToTs,
      selectingState,
      hoverTs,
      handleCellClick,
    ]
  );

  const sizeClass = size === 'xs' ? 'is-xs' : size === 'md' ? 'is-md' : 'is-sm';

  return (
    <div className={`agv-daterange-picker-wrap ${className}`} ref={triggerRef}>
      <div
        className={`agv-daterange-bar ${getGridControlRadiusClass()} ${isOpen ? 'is-focused' : ''} ${sizeClass}`}
        onClick={() => (isOpen ? closePopover() : openCalendar())}
      >
        {presetValue ? (
          <div className="agv-daterange-segment flex w-full items-center justify-center overflow-hidden px-1">
            <span
              className="truncate font-normal text-foreground"
            >
              {getPresetLabel(presetValue)}
            </span>
          </div>
        ) : isSameDate ? (
          <div className="agv-daterange-segment">
            <input
              type="text"
              name="agv_daterange_single"
              {...NO_AUTOFILL_PROPS}
              value={inputFromText}
              onClick={(e) => {
                e.stopPropagation();
                openCalendar('start');
              }}
              onChange={(e) => {
                setInputFromText(e.target.value);
                setInputToText(e.target.value);
              }}
              onBlur={handleSingleBlur}
              onKeyDown={(e) => e.key === 'Enter' && handleSingleBlur()}
              placeholder={showTime ? "DD/MM/YYYY HH:mm" : "DD/MM/YYYY"}
              className="agv-daterange-text text-center font-normal"
            />
          </div>
        ) : (
          <>
            <div className="agv-daterange-segment">
              <input
                type="text"
                name="agv_daterange_from"
                {...NO_AUTOFILL_PROPS}
                value={inputFromText}
                onClick={(e) => {
                  e.stopPropagation();
                  openCalendar('start');
                }}
                onChange={(e) => setInputFromText(e.target.value)}
                onBlur={handleFromBlur}
                onKeyDown={(e) => e.key === 'Enter' && handleFromBlur()}
                placeholder={effPlaceholderFrom}
                className="agv-daterange-text text-center font-normal"
              />
            </div>
            <span className="agv-daterange-sep inline-flex items-center justify-center shrink-0">
              <ArrowRight size={10} strokeWidth={2} className="opacity-50 select-none pointer-events-none" />
            </span>
            <div className="agv-daterange-segment">
              <input
                type="text"
                name="agv_daterange_to"
                {...NO_AUTOFILL_PROPS}
                value={inputToText}
                onClick={(e) => {
                  e.stopPropagation();
                  openCalendar('end');
                }}
                onChange={(e) => setInputToText(e.target.value)}
                onBlur={handleToBlur}
                onKeyDown={(e) => e.key === 'Enter' && handleToBlur()}
                placeholder={effPlaceholderTo}
                className="agv-daterange-text text-center font-normal"
              />
            </div>
          </>
        )}
        {allowClear && (from || to || presetValue) && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setPresetValue('');
              setTempFrom(null);
              setTempTo(null);
              setHoverTs(null);
              setInputFromText('');
              setInputToText('');
              setSelectingState('start');
              emitChange({ from: '', to: '', preset: '' });
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
            ref={popoverRef}
            style={{
              position: 'fixed',
              ...(coords.isFlipUp
                ? { bottom: `${coords.bottom}px`, top: 'auto' }
                : { top: `${coords.top}px`, bottom: 'auto' }),
              left: `${coords.left}px`,
              zIndex: 999999999,
            }}
            className={`agv-calendar-popover agv-daterange-popover agv-popup-panel ${
              coords.isFlipUp ? 'agv-spring-up' : 'agv-spring-down'
            } ${dualMonth ? 'is-dual' : ''} ${theme ? getThemeClass(theme) : ''}`}
            data-theme={theme || undefined}
            data-agv-popup="true"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {showPreset && (
              <div className="agv-daterange-preset-section mb-2 border-b border-[var(--agv-border)] pb-2">
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
                      let nextFrom = range.from ? parseDMYToDate(range.from) : null;
                      let nextTo = range.to ? parseDMYToDate(range.to) : null;
                      let finalFrom = range.from;
                      let finalTo = range.to;
                      if (nextFrom && parsedMin && nextFrom.getTime() < parsedMin.getTime()) {
                        nextFrom = parsedMin;
                        finalFrom = formatDateToYMD(parsedMin, false);
                      }
                      if (nextTo && parsedMax && nextTo.getTime() > parsedMax.getTime()) {
                        nextTo = parsedMax;
                        finalTo = formatDateToYMD(parsedMax, false);
                      }
                      setTempFrom(nextFrom);
                      setTempTo(nextTo);
                      setInputFromText(formatDisplayDate(finalFrom, false, showTime));
                      setInputToText(formatDisplayDate(finalTo, false, showTime));
                      emitChange({
                        from: finalFrom,
                        to: finalTo,
                        preset: presetId,
                      });
                      if (nextFrom) {
                        setNavYear(nextFrom.getFullYear());
                        setNavMonth(nextFrom.getMonth());
                      }
                      setCalendarView('days');
                      if (!isMulti && !showTime) {
                        setIsOpen(false);
                      }
                    } else {
                      setTempFrom(null);
                      setTempTo(null);
                      setInputFromText('');
                      setInputToText('');
                      emitChange({ from: '', to: '', preset: '' });
                      if (!isMulti && !showTime) {
                        setIsOpen(false);
                      }
                    }
                  }}
                />
              </div>
            )}

            {/* DUAL OR SINGLE CALENDAR CONTAINER */}
            {dualMonth && calendarView === 'days' ? (
              <div className="agv-dual-calendars-container">
                {/* Tháng thứ nhất (Bên trái) */}
                <div className="agv-dual-calendar-pane">
                  <AdvDevExpressCalendarBody
                    calendarView={calendarView}
                    setCalendarView={setCalendarView}
                    navYear={navYear}
                    setNavYear={setNavYear}
                    navMonth={navMonth}
                    setNavMonth={setNavMonth}
                    calendarCells={leftCalendarCells}
                    activeDate={tempFrom || tempTo}
                    minTs={minTs}
                    maxTs={maxTs}
                    minYear={dataMinYear}
                    isMonthSelected={checkMonthSelected}
                    getMonthRangeStatus={getMonthRangeStatus}
                    isYearSelected={checkYearSelected}
                    onGridMouseLeave={handleGridMouseLeave}
                    renderDayCell={renderRangeDayCell}
                    hideNavRight={true}
                    onPrevMonth={() => {
                      const s = shiftMonth(navMonth, navYear, -1);
                      setNavMonth(s.month);
                      setNavYear(s.year);
                    }}
                  />
                </div>

                <div className="agv-dual-divider" />

                {/* Tháng thứ hai (Bên phải - liền kề) */}
                <div className="agv-dual-calendar-pane">
                  <AdvDevExpressCalendarBody
                    calendarView={calendarView}
                    setCalendarView={setCalendarView}
                    navYear={rightNav.year}
                    setNavYear={() => {}}
                    navMonth={rightNav.month}
                    setNavMonth={() => {}}
                    calendarCells={rightCalendarCells}
                    activeDate={tempFrom || tempTo}
                    minTs={minTs}
                    maxTs={maxTs}
                    minYear={dataMinYear}
                    isMonthSelected={checkMonthSelected}
                    getMonthRangeStatus={getMonthRangeStatus}
                    isYearSelected={checkYearSelected}
                    onGridMouseLeave={handleGridMouseLeave}
                    renderDayCell={renderRangeDayCell}
                    hideNavLeft={true}
                    onNextMonth={() => {
                      const s = shiftMonth(navMonth, navYear, 1);
                      setNavMonth(s.month);
                      setNavYear(s.year);
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="w-full">
                <AdvDevExpressCalendarBody
                  calendarView={calendarView}
                  setCalendarView={setCalendarView}
                  navYear={navYear}
                  setNavYear={setNavYear}
                  navMonth={navMonth}
                  setNavMonth={setNavMonth}
                  calendarCells={leftCalendarCells}
                  activeDate={tempFrom || tempTo}
                  minTs={minTs}
                  maxTs={maxTs}
                  minYear={dataMinYear}
                  isMonthSelected={checkMonthSelected}
                  getMonthRangeStatus={getMonthRangeStatus}
                  isYearSelected={checkYearSelected}
                  onGridMouseLeave={handleGridMouseLeave}
                  renderDayCell={renderRangeDayCell}
                />
              </div>
            )}

            {/* TIME HH:MM FOOTER FOR RANGE PICKER */}
            {showTime && (
              dualMonth ? (
                /* Dual Month: Giao diện 1 hàng ngang rộng rãi */
                <div className="agv-time-footer">
                  <div className="flex items-center gap-3">
                    <TimePickerBlock
                      label="Từ"
                      hours={timeFrom.h}
                      minutes={timeFrom.m}
                      onChangeTime={(h, m) => setTimeFrom({ h, m })}
                    />
                    <ArrowRight size={10} strokeWidth={2} className="text-[var(--agv-text-subtle)] opacity-50 shrink-0 select-none pointer-events-none mx-0.5" />
                    <TimePickerBlock
                      label="Đến"
                      hours={timeTo.h}
                      minutes={timeTo.m}
                      onChangeTime={(h, m) => setTimeTo({ h, m })}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setTimeFrom({ h: 0, m: 0 });
                        setTimeTo({ h: 23, m: 59 });
                      }}
                      className="agv-time-quick-btn ml-1"
                    >
                      Cả ngày
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyWithTime}
                    className="agv-apply-btn"
                  >
                    Áp dụng
                  </button>
                </div>
              ) : (
                /* Single Month: Giao diện 2 tầng chuyên nghiệp, không vỡ chữ */
                <div className="agv-time-footer is-compact-range">
                  <div className="agv-time-range-inputs">
                    <TimePickerBlock
                      label="Từ"
                      hours={timeFrom.h}
                      minutes={timeFrom.m}
                      onChangeTime={(h, m) => setTimeFrom({ h, m })}
                    />
                    <ArrowRight size={10} strokeWidth={2} className="text-[var(--agv-text-subtle)] opacity-50 shrink-0 select-none pointer-events-none mx-0.5" />
                    <TimePickerBlock
                      label="Đến"
                      hours={timeTo.h}
                      minutes={timeTo.m}
                      onChangeTime={(h, m) => setTimeTo({ h, m })}
                    />
                  </div>
                  <div className="agv-time-range-actions">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setTimeFrom({ h: 0, m: 0 });
                          setTimeTo({ h: 23, m: 59 });
                        }}
                        className="agv-time-quick-btn"
                      >
                        Cả ngày
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const d = new Date();
                          setTimeFrom({ h: d.getHours(), m: d.getMinutes() });
                          setTimeTo({ h: d.getHours(), m: d.getMinutes() });
                        }}
                        className="agv-time-quick-btn"
                      >
                        Hiện tại
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={handleApplyWithTime}
                      className="agv-apply-btn"
                    >
                      Áp dụng
                    </button>
                  </div>
                </div>
              )
            )}
          </div>,
          triggerRef.current?.ownerDocument?.body || document.body
        )}
    </div>
  );
});
