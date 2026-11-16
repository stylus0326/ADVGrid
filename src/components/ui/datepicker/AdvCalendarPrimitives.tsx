import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { Clock } from 'lucide-react';
import { NO_AUTOFILL_PROPS } from '../../grid/constants';
import {
  pad2,
  MONTH_LABELS,
  MONTH_SHORT_LABELS,
  CALENDAR_WEEKDAYS,
  shiftMonth,
  CalendarCellItem,
} from './datePickerUtils';

export interface TimePickerBlockProps {
  hours: number;
  minutes: number;
  onChangeTime: (h: number, m: number) => void;
  label?: string;
}

export const TimePickerBlock = memo(function TimePickerBlock({
  hours,
  minutes,
  onChangeTime,
  label = '',
}: TimePickerBlockProps) {
  const [hText, setHText] = useState(() => pad2(hours));
  const [mText, setMText] = useState(() => pad2(minutes));

  useEffect(() => {
    setHText(pad2(hours));
  }, [hours]);

  useEffect(() => {
    setMText(pad2(minutes));
  }, [minutes]);

  const commitH = () => {
    let val = parseInt(hText, 10);
    if (Number.isNaN(val) || val < 0) val = 0;
    if (val > 23) val = 23;
    setHText(pad2(val));
    onChangeTime(val, minutes);
  };

  const commitM = () => {
    let val = parseInt(mText, 10);
    if (Number.isNaN(val) || val < 0) val = 0;
    if (val > 59) val = 59;
    setMText(pad2(val));
    onChangeTime(hours, val);
  };

  return (
    <div className="agv-time-picker-block">
      {label && <span className="text-xs text-[var(--agv-text-subtle)] font-medium mr-1">{label}:</span>}
      <div className="agv-time-input-wrap">
        <Clock className="h-3 w-3 text-[var(--agv-text-subtle)] mr-1" />
        <input
          type="text"
          maxLength={2}
          value={hText}
          onChange={(e) => setHText(e.target.value.replace(/\D/g, ''))}
          onBlur={commitH}
          onKeyDown={(e) => e.key === 'Enter' && commitH()}
          className="agv-time-num-input"
          {...NO_AUTOFILL_PROPS}
        />
        <span className="agv-time-sep">:</span>
        <input
          type="text"
          maxLength={2}
          value={mText}
          onChange={(e) => setMText(e.target.value.replace(/\D/g, ''))}
          onBlur={commitM}
          onKeyDown={(e) => e.key === 'Enter' && commitM()}
          className="agv-time-num-input"
          {...NO_AUTOFILL_PROPS}
        />
      </div>
    </div>
  );
});

export interface AdvDevExpressCalendarBodyProps {
  calendarView: 'days' | 'months' | 'years';
  setCalendarView: (view: 'days' | 'months' | 'years') => void;
  navYear: number;
  setNavYear: React.Dispatch<React.SetStateAction<number>>;
  navMonth: number;
  setNavMonth: React.Dispatch<React.SetStateAction<number>>;
  calendarCells: CalendarCellItem[];
  renderDayCell: (cell: CalendarCellItem, idx: number) => React.ReactNode;
  onGridMouseLeave?: () => void;
  activeDate?: Date | null;
  minTs?: number | null;
  maxTs?: number | null;
  minYear?: number;
  maxYear?: number;
  isMonthSelected?: (year: number, month: number) => boolean;
  getMonthRangeStatus?: (year: number, month: number) => { isStart: boolean; isEnd: boolean; inRange: boolean; isSelected: boolean };
  isYearSelected?: (year: number) => boolean;
  hideNavLeft?: boolean;
  hideNavRight?: boolean;
  onPrevMonth?: () => void;
  onNextMonth?: () => void;
}

export const AdvDevExpressCalendarBody = memo(
  function AdvDevExpressCalendarBody({
    calendarView,
    setCalendarView,
    navYear,
    setNavYear,
    navMonth,
    setNavMonth,
    calendarCells,
    renderDayCell,
    onGridMouseLeave,
    activeDate,
    minTs = null,
    maxTs = null,
    minYear,
    maxYear,
    isMonthSelected,
    getMonthRangeStatus,
    isYearSelected,
    hideNavLeft = false,
    hideNavRight = false,
    onPrevMonth,
    onNextMonth,
  }: AdvDevExpressCalendarBodyProps) {
    const nowParts = useMemo(() => {
      const d = new Date();
      return { year: d.getFullYear(), month: d.getMonth() };
    }, []);

    const decadeStart = Math.floor(navYear / 10) * 10;
    const decadeEnd = decadeStart + 9;

    const decadeYears = useMemo(() => {
      const years: Array<{
        year: number;
        isOtherDecade: boolean;
        startTs: number;
        endTs: number;
      }> = [];
      for (let y = decadeStart - 1; y <= decadeStart + 10; y++) {
        years.push({
          year: y,
          isOtherDecade: y < decadeStart || y > decadeEnd,
          startTs: new Date(y, 0, 1, 0, 0, 0, 0).getTime(),
          endTs: new Date(y, 11, 31, 23, 59, 59, 999).getTime(),
        });
      }
      return years;
    }, [decadeStart, decadeEnd]);

    const monthBounds = useMemo(() => {
      return MONTH_SHORT_LABELS.map((label, m) => ({
        m,
        label,
        startTs: new Date(navYear, m, 1, 0, 0, 0, 0).getTime(),
        endTs: new Date(navYear, m + 1, 0, 23, 59, 59, 999).getTime(),
      }));
    }, [navYear]);

    const canGoPrev = useMemo(() => {
      if (minTs === null && minYear === undefined) return true;
      if (calendarView === 'days') {
        const prevMonthLastDay = new Date(
          navYear,
          navMonth,
          0,
          23,
          59,
          59,
          999
        ).getTime();
        return minTs !== null ? prevMonthLastDay >= minTs : true;
      }
      const effMinY =
        minYear !== undefined
          ? minYear
          : minTs !== null
            ? new Date(minTs).getFullYear()
            : 2026;
      if (calendarView === 'months') return navYear > effMinY;
      if (calendarView === 'years') return decadeStart > effMinY;
      return true;
    }, [calendarView, navYear, navMonth, minTs, minYear, decadeStart]);

    const canGoNext = useMemo(() => {
      if (maxTs === null && maxYear === undefined) return true;
      if (calendarView === 'days') {
        const nextMonthFirstDay = new Date(
          navYear,
          navMonth + 1,
          1,
          0,
          0,
          0,
          0
        ).getTime();
        return maxTs !== null ? nextMonthFirstDay <= maxTs : true;
      }
      const effMaxY =
        maxYear !== undefined
          ? maxYear
          : maxTs !== null
            ? new Date(maxTs).getFullYear()
            : nowParts.year + 1;
      if (calendarView === 'months') return navYear < effMaxY;
      if (calendarView === 'years') return decadeEnd < effMaxY;
      return true;
    }, [calendarView, navYear, navMonth, maxTs, maxYear, decadeEnd, nowParts.year]);

    const handlePrev = useCallback(() => {
      if (!canGoPrev) return;
      if (onPrevMonth) {
        onPrevMonth();
        return;
      }
      if (calendarView === 'days') {
        const s = shiftMonth(navMonth, navYear, -1);
        setNavMonth(s.month);
        setNavYear(s.year);
      } else if (calendarView === 'months') {
        setNavYear((y) => y - 1);
      } else if (calendarView === 'years') {
        setNavYear((y) => y - 10);
      }
    }, [canGoPrev, onPrevMonth, calendarView, navMonth, navYear, setNavMonth, setNavYear]);

    const handleNext = useCallback(() => {
      if (!canGoNext) return;
      if (onNextMonth) {
        onNextMonth();
        return;
      }
      if (calendarView === 'days') {
        const s = shiftMonth(navMonth, navYear, 1);
        setNavMonth(s.month);
        setNavYear(s.year);
      } else if (calendarView === 'months') {
        setNavYear((y) => y + 1);
      } else if (calendarView === 'years') {
        setNavYear((y) => y + 10);
      }
    }, [canGoNext, onNextMonth, calendarView, navMonth, navYear, setNavMonth, setNavYear]);

    const handleTitleClick = useCallback(() => {
      if (calendarView === 'days') {
        setCalendarView('months');
      } else if (calendarView === 'months') {
        setCalendarView('years');
      }
    }, [calendarView, setCalendarView]);

    const headerTitle =
      calendarView === 'days'
        ? `${MONTH_LABELS[navMonth]}, ${navYear}`
        : calendarView === 'months'
          ? `${navYear}`
          : `${decadeStart} - ${decadeEnd}`;

    return (
      <div className="agv-calendar-body-wrap">
        <div className="agv-calendar-header">
          {!hideNavLeft ? (
            <button
              type="button"
              onClick={handlePrev}
              disabled={!canGoPrev}
              className={`agv-cal-nav-btn ${!canGoPrev ? 'is-disabled' : ''}`}
            >
              ‹
            </button>
          ) : (
            <div className="w-[28px]" />
          )}

          <button
            type="button"
            onClick={handleTitleClick}
            className={`agv-cal-title-btn ${
              calendarView === 'years' ? 'is-static' : ''
            }`}
          >
            {headerTitle}
          </button>

          {!hideNavRight ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={!canGoNext}
              className={`agv-cal-nav-btn ${!canGoNext ? 'is-disabled' : ''}`}
            >
              ›
            </button>
          ) : (
            <div className="w-[28px]" />
          )}
        </div>

        {calendarView === 'days' && (
          <>
            <div className="agv-calendar-weekdays">
              {CALENDAR_WEEKDAYS.map((w) => (
                <div
                  key={w.label}
                  className={`agv-calendar-weekday ${
                    w.isWeekend ? 'is-weekend' : ''
                  }`}
                >
                  {w.label}
                </div>
              ))}
            </div>

            <div className="agv-calendar-grid" onMouseLeave={onGridMouseLeave}>
              {calendarCells.map((cell, idx) => renderDayCell(cell, idx))}
            </div>
          </>
        )}

        {calendarView === 'months' && (
          <div className="agv-cal-matrix-grid">
            {monthBounds.map(({ m, label, startTs, endTs }) => {
              const status = getMonthRangeStatus
                ? getMonthRangeStatus(navYear, m)
                : {
                    isStart: false,
                    isEnd: false,
                    inRange: false,
                    isSelected: isMonthSelected
                      ? isMonthSelected(navYear, m)
                      : Boolean(
                          activeDate &&
                            activeDate.getFullYear() === navYear &&
                            activeDate.getMonth() === m
                        ),
                  };

              const isCurrent =
                nowParts.year === navYear && nowParts.month === m;
              const isDisabled =
                (minTs !== null && endTs < minTs) ||
                (maxTs !== null && startTs > maxTs);

              let cls = 'agv-cal-matrix-cell';
              if (isDisabled) cls += ' is-disabled';
              else if (status.isStart && status.isEnd) cls += ' is-selected is-range-single';
              else if (status.isStart) cls += ' is-range-start is-selected';
              else if (status.isEnd) cls += ' is-range-end is-selected';
              else if (status.inRange) cls += ' is-in-range';
              else if (status.isSelected) cls += ' is-selected';
              else if (isCurrent) cls += ' is-current';

              return (
                <button
                  key={m}
                  type="button"
                  disabled={isDisabled}
                  className={cls}
                  onClick={() => {
                    if (isDisabled) return;
                    setNavMonth(m);
                    setCalendarView('days');
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}

        {calendarView === 'years' && (
          <div className="agv-cal-matrix-grid">
            {decadeYears.map(({ year: y, isOtherDecade, startTs, endTs }) => {
              const isSelected = isYearSelected
                ? isYearSelected(y)
                : Boolean(activeDate && activeDate.getFullYear() === y);
              const isCurrent = nowParts.year === y;
              const isDisabled =
                (minTs !== null && endTs < minTs) ||
                (maxTs !== null && startTs > maxTs);

              let cls = 'agv-cal-matrix-cell';
              if (isOtherDecade) cls += ' is-other-decade';
              if (isDisabled) cls += ' is-disabled';
              else if (isSelected) cls += ' is-selected';
              else if (isCurrent) cls += ' is-current';

              return (
                <button
                  key={y}
                  type="button"
                  disabled={isDisabled}
                  className={cls}
                  onClick={() => {
                    if (isDisabled) return;
                    setNavYear(y);
                    setCalendarView('months');
                  }}
                >
                  {y}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }
);
