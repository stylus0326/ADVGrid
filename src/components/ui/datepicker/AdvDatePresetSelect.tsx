import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  memo,
} from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { MorphChevronIcon } from '../MorphIcons';
import { AdvOverlayScroll } from '../AdvOverlayScroll';
import { AdvButton } from '../AdvButton';
import { AdvAnchoredPopover, DEFAULT_POPOVER_IGNORE_SELECTORS } from '../AdvPopover';
import { ensureDatePickerStyles } from './datePickerStyles';
import { getGridControlRadiusClass } from '../../grid/constants';
import { SURFACE_THEMES, GridTheme } from '../../../themes';
import {
  getThemeClass,
  REGEX_MULTI_SPLIT,
  REGEX_DATA_MONTH,
  REGEX_DATA_QUARTER,
  REGEX_DATA_YEAR,
  REGEX_ANY_YEAR_TOKEN,
  ROMAN_QUARTERS,
  parseDMYToDate,
  parseDateToTimestamp,
  getISOWeekAndYear,
  getISOWeekDateRange,
  normalizePresetList,
  getPresetLabel,
  resolveMinYearFromContext,
} from './datePickerUtils';

export interface AdvDatePresetSelectProps {
  value?: string;
  defaultOpen?: boolean;
  onSelect?: (presetId: string, isMulti?: boolean) => void;
  dateAnalysis?: any;
  label?: string;
  theme?: GridTheme;
  size?: 'xs' | 'sm' | 'default' | 'md';
  hideClear?: boolean;
  min?: string;
  max?: string;
  minYear?: number;
  maxYear?: number;
}

const DEFAULT_VISIBLE_WEEKS = 16;

export const AdvDatePresetSelect = memo(function AdvDatePresetSelect({
  value,
  defaultOpen = false,
  onSelect,
  dateAnalysis,
  label = 'Mốc thời gian:',
  theme = '',
  size = 'default',
  hideClear = false,
  min = '',
  max = '',
  minYear,
  maxYear,
}: AdvDatePresetSelectProps) {
  useEffect(() => {
    ensureDatePickerStyles();
  }, []);

  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [weeksExpanded, setWeeksExpanded] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setWeeksExpanded(false);
    }
  }, [isOpen]);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [internalValue, setInternalValue] = useState<string>(value || '');

  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  const activeValue = value !== undefined ? value : internalValue;

  const selectedIds = useMemo(() => {
    if (!activeValue) return new Set<string>();
    return new Set(
      activeValue
        .split(REGEX_MULTI_SPLIT)
        .map((s) => s.trim())
        .filter(Boolean)
    );
  }, [activeValue]);

  const closeMenu = useCallback(() => setIsOpen(false), []);

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => {
      if (!prev) {
        // Khi nằm trong portal của DatePicker/DateRangePicker, popup cha đã xử lý đóng các popup ngoài trước đó;
        // phát lại `except: 'datepicker'` từ trong portal (ngoài DOM của .agv-multi-filter-popup) sẽ làm đóng mất AdvMultiFilterPopup.
        const isInsideCalendarPopover = Boolean(
          triggerRef.current?.closest('.agv-calendar-popover, .agv-daterange-popover')
        );
        if (!isInsideCalendarPopover) {
          const isNested = Boolean(triggerRef.current?.closest('.agv-multi-filter-popup'));
          window.dispatchEvent(
            new CustomEvent('agv-close-all-popups', {
              detail: {
                except: isNested ? 'multi-filter' : 'datepicker',
                source: 'datepicker-preset',
              },
            })
          );
        }
      }
      return !prev;
    });
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleCloseAll = (e: Event) => {
      const ce = e as CustomEvent;
      const isNested = Boolean(triggerRef.current?.closest('.agv-multi-filter-popup'));
      if (isNested && ce.detail?.except === 'multi-filter') {
        return;
      }
      if (ce.detail?.except === 'datepicker') {
        return;
      }
      if (ce.detail?.except === 'focus-cell' && triggerRef.current) {
        const cellBox = triggerRef.current.closest('.agv-filter-cell-box');
        if (cellBox && (cellBox.contains(document.activeElement) || cellBox === document.activeElement)) {
          return;
        }
      }
      setIsOpen(false);
    };
    window.addEventListener('agv-close-all-popups', handleCloseAll);
    return () => window.removeEventListener('agv-close-all-popups', handleCloseAll);
  }, [isOpen]);

  const currentRealYear = useMemo(() => new Date().getFullYear(), []);

  const effectiveMinYear = useMemo(
    () => resolveMinYearFromContext(minYear, min, dateAnalysis),
    [minYear, min, dateAnalysis]
  );

  const effectiveMaxYear = useMemo(() => {
    if (maxYear !== undefined) return maxYear;
    if (max && max.trim()) {
      const d = parseDMYToDate(max);
      if (d) return d.getFullYear();
      const n = parseInt(max.trim(), 10);
      if (!Number.isNaN(n) && n > 1900 && n < 2200) return n;
    }
    if (
      dateAnalysis?.maxDate instanceof Date &&
      !Number.isNaN(dateAnalysis.maxDate.getTime())
    ) {
      return dateAnalysis.maxDate.getFullYear();
    }
    return currentRealYear + 1;
  }, [maxYear, max, dateAnalysis, currentRealYear]);

  const [expandedYears, setExpandedYears] = useState<Record<number, boolean>>({});

  const toggleExpandYear = useCallback((y: number, e: React.SyntheticEvent) => {
    e.stopPropagation();
    setExpandedYears((prev) => ({ ...prev, [y]: !prev[y] }));
  }, []);

  const minTs = useMemo(() => (min ? parseDateToTimestamp(min, false) : null), [min]);
  const maxTs = useMemo(() => (max ? parseDateToTimestamp(max, true) : null), [max]);

  const isRangeOverlapping = useCallback(
    (from: number | null, to: number | null) => {
      if (from === null && to === null) return true;
      if (minTs !== null && to !== null && to < minTs) return false;
      if (maxTs !== null && from !== null && from > maxTs) return false;
      return true;
    },
    [minTs, maxTs]
  );

  const handleToggleChipMultiSelect = useCallback(
    (targetId: string) => {
      const currentList = activeValue
        ? activeValue
            .split(REGEX_MULTI_SPLIT)
            .map((s) => s.trim())
            .filter(Boolean)
        : [];

      const isOnlyChips = currentList.every(
        (id) =>
          id.startsWith('data_year_') ||
          id.startsWith('data_quarter_') ||
          id.startsWith('data_month_') ||
          id.startsWith('data_week_')
      );

      let baseList =
        !isOnlyChips || currentList.length === 0 ? [] : [...currentList];

      const monthMatch = REGEX_DATA_MONTH.exec(targetId);
      const quarterMatch = REGEX_DATA_QUARTER.exec(targetId);
      const yearMatch = REGEX_DATA_YEAR.exec(targetId);

      if (monthMatch) {
        const y = Number(monthMatch[1]);
        const m = Number(monthMatch[2]);
        const q = Math.ceil(m / 3);
        const qId = `data_quarter_${y}_q${q}`;
        const yId = `data_year_${y}`;

        if (baseList.includes(targetId)) {
          baseList = baseList.filter((id) => id !== targetId);
        } else if (baseList.includes(qId)) {
          baseList = baseList.filter((id) => id !== qId);
          for (let otherM = (q - 1) * 3 + 1; otherM <= q * 3; otherM++) {
            if (otherM !== m) {
              baseList.push(`data_month_${y}_m${otherM}`);
            }
          }
        } else if (baseList.includes(yId)) {
          baseList = baseList.filter((id) => id !== yId);
          for (let otherQ = 1; otherQ <= 4; otherQ++) {
            if (otherQ !== q) {
              baseList.push(`data_quarter_${y}_q${otherQ}`);
            } else {
              for (let otherM = (q - 1) * 3 + 1; otherM <= q * 3; otherM++) {
                if (otherM !== m) {
                  baseList.push(`data_month_${y}_m${otherM}`);
                }
              }
            }
          }
        } else {
          baseList.push(targetId);
        }
      } else if (quarterMatch) {
        const y = Number(quarterMatch[1]);
        const q = Number(quarterMatch[2]);
        const yId = `data_year_${y}`;

        if (baseList.includes(targetId)) {
          baseList = baseList.filter((id) => id !== targetId);
        } else if (baseList.includes(yId)) {
          baseList = baseList.filter((id) => id !== yId);
          for (let otherQ = 1; otherQ <= 4; otherQ++) {
            if (otherQ !== q) {
              baseList.push(`data_quarter_${y}_q${otherQ}`);
            }
          }
        } else {
          for (let m = (q - 1) * 3 + 1; m <= q * 3; m++) {
            const mId = `data_month_${y}_m${m}`;
            baseList = baseList.filter((id) => id !== mId);
          }
          baseList.push(targetId);
        }
      } else if (yearMatch) {
        if (baseList.includes(targetId)) {
          baseList = baseList.filter((id) => id !== targetId);
        } else {
          const y = Number(yearMatch[1]);
          const qPrefix = `data_quarter_${y}_`;
          const mPrefix = `data_month_${y}_`;
          baseList = baseList.filter(
            (id) => !id.startsWith(qPrefix) && !id.startsWith(mPrefix)
          );
          baseList.push(targetId);
        }
      } else {
        if (baseList.includes(targetId)) {
          baseList = baseList.filter((id) => id !== targetId);
        } else {
          baseList.push(targetId);
        }
      }

      const nextList = normalizePresetList(baseList);
      const nextVal = nextList.join(',');
      setInternalValue(nextVal);
      onSelect?.(nextVal, true);
    },
    [activeValue, onSelect]
  );

  const { weekItems, yearsData } = useMemo(() => {
    const yearCounts = dateAnalysis?.yearCounts || {};
    const yearMonthCounts = dateAnalysis?.yearMonthCounts || {};
    const yearQuarterCounts = dateAnalysis?.yearQuarterCounts || {};
    const presetCounts = dateAnalysis?.presetCounts || {};

    const hasAnalysis = Boolean(
      dateAnalysis &&
        (Object.keys(yearCounts).length > 0 ||
          Object.keys(presetCounts).length > 0)
    );

    const { week: currentIsoWeek, year: currentIsoYear } = getISOWeekAndYear(
      new Date()
    );
    const weeks: Array<{ id: string; label: string }> = [];
    for (let w = currentIsoWeek; w >= 1; w--) {
      const id = `data_week_${currentIsoYear}_w${w}`;
      const r = getISOWeekDateRange(currentIsoYear, w);
      const fromTs = r.from ? parseDateToTimestamp(r.from, false) : null;
      const toTs = r.to ? parseDateToTimestamp(r.to, true) : null;
      if (!isRangeOverlapping(fromTs, toTs)) continue;
      weeks.push({ id, label: String(w) });
    }

    let yearsList: number[] = [];
    if (dateAnalysis && Object.keys(yearCounts).length > 0) {
      yearsList = Object.keys(yearCounts)
        .map(Number)
        .filter((y) => {
          if ((yearCounts[y] || 0) <= 0) return false;
          const yStart = new Date(y, 0, 1, 0, 0, 0, 0).getTime();
          const yEnd = new Date(y, 11, 31, 23, 59, 59, 999).getTime();
          if (!isRangeOverlapping(yStart, yEnd)) return false;
          return y >= effectiveMinYear && y <= effectiveMaxYear;
        })
        .sort((a, b) => b - a);
    }

    if (yearsList.length === 0) {
      for (let y = effectiveMaxYear; y >= effectiveMinYear; y--) {
        const yStart = new Date(y, 0, 1, 0, 0, 0, 0).getTime();
        const yEnd = new Date(y, 11, 31, 23, 59, 59, 999).getTime();
        if (!isRangeOverlapping(yStart, yEnd)) continue;
        yearsList.push(y);
      }
    }

    const years = yearsList
      .map((y) => {
        const qList = [1, 2, 3, 4]
          .map((q) => {
            const roman = ROMAN_QUARTERS[q];
            const qStart = new Date(y, (q - 1) * 3, 1, 0, 0, 0, 0).getTime();
            const qEnd = new Date(y, q * 3, 0, 23, 59, 59, 999).getTime();
            const inRange = isRangeOverlapping(qStart, qEnd);
            return {
              q,
              id: `data_quarter_${y}_q${q}`,
              label: `Q${roman}`,
              fullName: `Quý ${roman}`,
              count: yearQuarterCounts[y]?.[q] || 0,
              inRange,
            };
          })
          .filter((item) => {
            if (!item.inRange) return false;
            if (hasAnalysis) {
              return selectedIds.has(item.id) || item.count > 0;
            }
            return true;
          });

        const mList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
          .map((m) => {
            const mStart = new Date(y, m - 1, 1, 0, 0, 0, 0).getTime();
            const mEnd = new Date(y, m, 0, 23, 59, 59, 999).getTime();
            const inRange = isRangeOverlapping(mStart, mEnd);
            return {
              m,
              id: `data_month_${y}_m${m}`,
              label: `T${m}`,
              fullName: `Tháng ${m}`,
              count: yearMonthCounts[y]?.[m] || 0,
              inRange,
            };
          })
          .filter((item) => {
            if (!item.inRange) return false;
            if (hasAnalysis) {
              return selectedIds.has(item.id) || item.count > 0;
            }
            return true;
          });

        return {
          year: y,
          id: `data_year_${y}`,
          label: `Năm ${y}`,
          count: yearCounts[y] || 0,
          quarters: qList,
          months: mList,
        };
      })
      .filter((yItem) => yItem.quarters.length > 0 || yItem.months.length > 0);

    return {
      weekItems: weeks,
      yearsData: years,
    };
  }, [
    dateAnalysis,
    effectiveMinYear,
    effectiveMaxYear,
    selectedIds,
    isRangeOverlapping,
  ]);

  useEffect(() => {
    if (isOpen && yearsData.length > 0) {
      let targetYear = yearsData[0].year;
      if (activeValue) {
        const match = REGEX_ANY_YEAR_TOKEN.exec(activeValue);
        if (match) {
          targetYear = parseInt(match[1], 10);
        }
      } else if (yearsData.some((yd) => yd.year === currentRealYear)) {
        targetYear = currentRealYear;
      }
      setExpandedYears((prev) =>
        prev[targetYear] ? prev : { ...prev, [targetYear]: true }
      );
    }
  }, [activeValue, isOpen, currentRealYear, yearsData]);

  const currentItemLabel = useMemo(
    () => (activeValue ? getPresetLabel(activeValue) : ''),
    [activeValue]
  );

  const themeCls = theme ? getThemeClass(theme) : '';

  return (
    <div className="agv-custom-select-wrap">
      {label && <label className="agv-popup-label">{label}</label>}
      <button
        ref={triggerRef}
        type="button"
        data-agv-popover-trigger="true"
        onClick={toggleOpen}
        className={`agv-custom-select-trigger agv-preset-trigger ${getGridControlRadiusClass()} ${
          isOpen ? 'is-open' : ''
        } ${size === 'xs' ? 'is-xs' : size === 'md' ? 'is-md' : 'is-sm'} ${
          activeValue ? 'has-selected' : ''
        } ${themeCls}`}
      >
        <div className="agv-custom-select-trigger-content min-w-0 flex-1 text-left">
          <span
            className={`agv-custom-select-trigger-label block truncate font-normal ${
              activeValue ? 'text-foreground' : 'text-muted-foreground'
            }`}
          >
            {currentItemLabel || 'Chọn mốc...'}
          </span>
        </div>
        <div className="flex flex-shrink-0 items-center gap-1">
          {activeValue && !hideClear && (
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                setInternalValue('');
                onSelect?.('');
              }}
              className="agv-preset-trigger-clear"
            >
              ×
            </span>
          )}
          <ChevronDown
            className={`${
              size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5'
            } text-[var(--agv-text-subtle)] transition-transform duration-150 ${
              isOpen ? 'rotate-180 text-[var(--agv-accent)]' : ''
            }`}
          />
        </div>
      </button>

      <AdvAnchoredPopover
        isOpen={isOpen}
        anchorEl={triggerRef.current}
        onClose={closeMenu}
        placement="bottom-start"
        showArrow={true}
        offset={10}
        width={Math.max(triggerRef.current?.offsetWidth || 0, 320)}
        minWidth={320}
        paddingClassName="p-0"
        contentClassName="text-xs agv-preset-dropdown-menu agv-portal-dropdown"
        zIndex={999999999}
        theme={theme || SURFACE_THEMES.LIGHT}
        ignoreClickOutsideSelectors={DEFAULT_POPOVER_IGNORE_SELECTORS}
      >
        <div
          ref={dropdownRef}
          onMouseDown={(e) => e.stopPropagation()}
          className={`flex flex-col rounded-md overflow-hidden ${themeCls}`}
          data-theme={theme || undefined}
        >
          <AdvOverlayScroll
            className="flex-initial min-h-0"
            viewportClassName="overflow-y-auto overflow-x-hidden p-1.5 overscroll-contain"
            viewportStyle={{
              maxHeight:
                selectedIds.size > 0
                  ? 'min(316px, calc(100vh - 140px))'
                  : 'min(358px, calc(100vh - 100px))',
            }}
            contentSignature={`${weeksExpanded ? weekItems.length : DEFAULT_VISIBLE_WEEKS}-${selectedIds.size}`}
          >
            {weekItems.length > 0 && (
              <div className="agv-preset-group agv-preset-matrix-group">
                <div className="agv-preset-group-title">Mốc theo tuần</div>
                <div className="agv-preset-week-grid">
                  {(weeksExpanded
                    ? weekItems
                    : weekItems.slice(0, DEFAULT_VISIBLE_WEEKS)
                  ).map((wItem) => {
                    const isSelected = selectedIds.has(wItem.id);
                    return (
                      <button
                        key={wItem.id}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (e.ctrlKey || e.metaKey) {
                            handleToggleChipMultiSelect(wItem.id);
                            return;
                          }
                          setInternalValue(wItem.id);
                          onSelect?.(wItem.id, false);
                          setIsOpen(false);
                        }}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleToggleChipMultiSelect(wItem.id);
                        }}
                        className={`agv-preset-chip is-week-chip ${
                          isSelected ? 'is-active' : ''
                        }`}
                      >
                        <span className="agv-chip-label">{wItem.label}</span>
                      </button>
                    );
                  })}
                </div>
                {weekItems.length > DEFAULT_VISIBLE_WEEKS && (
                  <div className="agv-preset-week-expand-wrap">
                    <button
                      type="button"
                      aria-label={weeksExpanded ? 'Thu gọn tuần' : 'Mở rộng thêm tuần'}
                      onClick={(e) => {
                        e.stopPropagation();
                        setWeeksExpanded((prev) => !prev);
                      }}
                      className="agv-preset-week-expand-btn"
                    >
                      <MorphChevronIcon
                        expanded={weeksExpanded}
                        type="down-up"
                        size={12}
                        spring="snappy"
                      />
                    </button>
                  </div>
                )}
              </div>
            )}

            {yearsData.length > 0 && (
              <div className="agv-preset-group">
                {yearsData.map((yItem) => {
                  const y = yItem.year;
                  const isExpanded = Boolean(expandedYears[y]);
                  const isYearSelected = selectedIds.has(yItem.id);
                  const hasQuarters = yItem.quarters.length > 0;
                  const hasMonths = yItem.months.length > 0;

                  return (
                    <div key={y} className="agv-preset-year-group">
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={(e) => toggleExpandYear(y, e)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            toggleExpandYear(y, e);
                          }
                        }}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleExpandYear(y, e);
                        }}
                        className="agv-preset-item agv-preset-year-row"
                      >
                        <div className="flex min-w-0 items-center gap-1.5 overflow-hidden">
                          <span
                            className="agv-preset-expand-btn"
                            aria-hidden="true"
                          >
                            <ChevronRight
                              className={`h-3.5 w-3.5 text-[var(--agv-text-subtle)] transition-transform duration-150 ${
                                isExpanded
                                  ? 'rotate-90 text-[var(--agv-accent)]'
                                  : ''
                              }`}
                            />
                          </span>
                          <span className="agv-preset-item-text truncate font-medium">
                            {yItem.label}
                          </span>
                        </div>

                        {yItem.count !== undefined && yItem.count > 0 && (
                          <div className="flex flex-shrink-0 items-center gap-1.5">
                            <span className="agv-preset-item-count has-data">
                              {yItem.count.toLocaleString('vi-VN')}
                            </span>
                          </div>
                        )}
                      </div>

                      {isExpanded && (
                        <div className="agv-preset-subgrid">
                          <div className="agv-preset-chips-section">
                            <span className="agv-preset-chips-label">Năm:</span>
                            <div className="agv-preset-chips-list">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (e.ctrlKey || e.metaKey) {
                                    handleToggleChipMultiSelect(yItem.id);
                                    return;
                                  }
                                  setInternalValue(yItem.id);
                                  onSelect?.(yItem.id, false);
                                  setIsOpen(false);
                                }}
                                onContextMenu={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleToggleChipMultiSelect(yItem.id);
                                }}
                                className={`agv-preset-chip ${
                                  isYearSelected ? 'is-active' : ''
                                }`}
                              >
                                <span className="agv-chip-label">Cả năm</span>
                              </button>
                            </div>
                          </div>
                          {hasQuarters && (
                            <div className="agv-preset-chips-section">
                              <span className="agv-preset-chips-label">Quý:</span>
                              <div className="agv-preset-chips-list">
                                {yItem.quarters.map((q) => {
                                  const isQSelected = selectedIds.has(q.id);
                                  const isQIncluded =
                                    !isQSelected && isYearSelected;
                                  return (
                                    <button
                                      key={q.id}
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (e.ctrlKey || e.metaKey) {
                                          handleToggleChipMultiSelect(q.id);
                                          return;
                                        }
                                        setInternalValue(q.id);
                                        onSelect?.(q.id, false);
                                        setIsOpen(false);
                                      }}
                                      onContextMenu={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleToggleChipMultiSelect(q.id);
                                      }}
                                      className={`agv-preset-chip ${
                                        isQSelected ? 'is-active' : ''
                                      } ${isQIncluded ? 'is-included' : ''}`}
                                    >
                                      <span className="agv-chip-label">
                                        {q.label}
                                      </span>
                                      {q.count !== undefined && q.count > 0 && (
                                        <span className="agv-chip-count">
                                          {q.count.toLocaleString('vi-VN')}
                                        </span>
                                      )}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {hasMonths && (
                            <div className="agv-preset-chips-section">
                              <span className="agv-preset-chips-label">
                                Tháng:
                              </span>
                              <div className="agv-preset-chips-list">
                                {yItem.months.map((m) => {
                                  const isMSelected = selectedIds.has(m.id);
                                  const qOfM = Math.ceil(m.m / 3);
                                  const isMIncludedInQuarter = selectedIds.has(
                                    `data_quarter_${y}_q${qOfM}`
                                  );
                                  const isMIncluded =
                                    !isMSelected &&
                                    (isMIncludedInQuarter || isYearSelected);
                                  return (
                                    <button
                                      key={m.id}
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (e.ctrlKey || e.metaKey) {
                                          handleToggleChipMultiSelect(m.id);
                                          return;
                                        }
                                        setInternalValue(m.id);
                                        onSelect?.(m.id, false);
                                        setIsOpen(false);
                                      }}
                                      onContextMenu={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleToggleChipMultiSelect(m.id);
                                      }}
                                      className={`agv-preset-chip ${
                                        isMSelected ? 'is-active' : ''
                                      } ${isMIncluded ? 'is-included' : ''}`}
                                    >
                                      <span className="agv-chip-label">
                                        {m.label}
                                      </span>
                                      {m.count !== undefined && m.count > 0 && (
                                        <span className="agv-chip-count">
                                          {m.count.toLocaleString('vi-VN')}
                                        </span>
                                      )}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            </AdvOverlayScroll>

            {selectedIds.size > 0 && (
              <div className="flex shrink-0 items-center justify-between border-t border-[var(--agv-border)] bg-[var(--agv-bg-popup)] px-2.5 py-1.5 text-xs">
                <span className="truncate font-medium text-[var(--agv-text-muted)]">
                  Đã chọn:{' '}
                  <strong className="text-[var(--agv-accent)]">
                    {currentItemLabel}
                  </strong>
                </span>
                <div className="ml-2 flex shrink-0 items-center gap-1.5">
                  <AdvButton
                    variant="destructive"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setInternalValue('');
                      onSelect?.('', true);
                    }}
                    className="px-2"
                  >
                    Bỏ chọn
                  </AdvButton>
                  <AdvButton
                    variant="default"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsOpen(false);
                    }}
                    className="px-3"
                  >
                    Áp dụng
                  </AdvButton>
                </div>
              </div>
            )}
        </div>
      </AdvAnchoredPopover>
    </div>
  );
});
