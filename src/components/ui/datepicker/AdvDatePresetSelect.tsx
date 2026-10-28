import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  memo,
} from 'react';
import { createPortal } from 'react-dom';
import { Check, ChevronRight, ChevronDown } from 'lucide-react';
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
  computePresetDateRange,
  normalizePresetList,
  getPresetLabel,
  usePopupDismiss,
  computeDropdownMenuCoords,
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

export const AdvDatePresetSelect = memo(function AdvDatePresetSelect({
  value,
  defaultOpen = false,
  onSelect,
  dateAnalysis,
  label = 'Mốc nhanh:',
  theme = SURFACE_THEMES.BEZIER_ARTHOUSE,
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
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [coords, setCoords] = useState<{
    top: number;
    left: number;
    bottom?: number;
    width: number;
    maxHeight: number;
    isFlipUp?: boolean;
  }>({
    top: 0,
    left: 0,
    width: 320,
    maxHeight: 360,
  });

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

  const updateCoords = useCallback(() => {
    const next = computeDropdownMenuCoords(triggerRef.current, 360, 320);
    setCoords((prev) =>
      prev.top === next.top &&
      prev.left === next.left &&
      prev.width === next.width &&
      prev.maxHeight === next.maxHeight
        ? prev
        : next
    );
  }, []);

  const closeMenu = useCallback(() => setIsOpen(false), []);

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => {
      if (!prev) {
        setCoords(computeDropdownMenuCoords(triggerRef.current, 360, 320));
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
      return !prev;
    });
  }, []);

  usePopupDismiss(isOpen, closeMenu, updateCoords, triggerRef, dropdownRef);

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

  const toggleExpandYear = useCallback((y: number, e: React.MouseEvent) => {
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
          id.startsWith('data_month_')
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

  const { dayItems, rangeItems, yearsData } = useMemo(() => {
    const yearCounts = dateAnalysis?.yearCounts || {};
    const yearMonthCounts = dateAnalysis?.yearMonthCounts || {};
    const yearQuarterCounts = dateAnalysis?.yearQuarterCounts || {};
    const presetCounts = dateAnalysis?.presetCounts || {};

    const hasAnalysis = Boolean(
      dateAnalysis &&
        (Object.keys(yearCounts).length > 0 ||
          Object.keys(presetCounts).length > 0)
    );

    const rawDays = [
      { id: 'today', label: 'Hôm nay', count: presetCounts.today },
      { id: 'yesterday', label: 'Hôm qua', count: presetCounts.yesterday },
      { id: 'mon', label: 'Thứ 2', count: presetCounts.mon },
      {
        id: 'sat_prev_week',
        label: 'Thứ 7 tuần trước',
        count: presetCounts.sat_prev_week,
      },
      {
        id: 'sun_prev_week',
        label: 'Chủ nhật tuần trước',
        count: presetCounts.sun_prev_week,
      },
    ];
    const filteredDays = rawDays.filter((item) => {
      const r = computePresetDateRange(item.id);
      const fromTs = r.from ? parseDateToTimestamp(r.from, false) : null;
      const toTs = r.to ? parseDateToTimestamp(r.to, true) : null;
      if (!isRangeOverlapping(fromTs, toTs)) return false;
      if (hasAnalysis) {
        return selectedIds.has(item.id) || (item.count || 0) > 0;
      }
      return true;
    });

    const rawRanges = [
      { id: 'this_week', label: 'Tuần này', count: presetCounts.this_week },
      { id: 'last_week', label: 'Tuần trước', count: presetCounts.last_week },
      { id: 'this_month', label: 'Tháng này', count: presetCounts.this_month },
      { id: 'this_quarter', label: 'Quý này', count: presetCounts.this_quarter },
    ];
    const filteredRanges = rawRanges.filter((item) => {
      const r = computePresetDateRange(item.id);
      const fromTs = r.from ? parseDateToTimestamp(r.from, false) : null;
      const toTs = r.to ? parseDateToTimestamp(r.to, true) : null;
      if (!isRangeOverlapping(fromTs, toTs)) return false;
      if (hasAnalysis) {
        return selectedIds.has(item.id) || (item.count || 0) > 0;
      }
      return true;
    });

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
      dayItems: filteredDays,
      rangeItems: filteredRanges,
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

  const themeCls = getThemeClass(theme);

  return (
    <div className="agv-custom-select-wrap">
      {label && <label className="agv-popup-label">{label}</label>}
      <button
        ref={triggerRef}
        type="button"
        onClick={toggleOpen}
        className={`agv-custom-select-trigger agv-preset-trigger ${getGridControlRadiusClass()} ${
          isOpen ? 'is-open' : ''
        } ${size === 'sm' ? 'is-sm' : ''} ${
          activeValue ? 'has-selected' : ''
        } ${themeCls}`}
      >
        <div className="agv-custom-select-trigger-content min-w-0 flex-1 text-left">
          <span className="agv-custom-select-trigger-label block truncate font-medium">
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

      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            style={{
              position: 'fixed',
              ...(coords.isFlipUp
                ? { bottom: `${coords.bottom}px`, top: 'auto' }
                : { top: `${coords.top}px`, bottom: 'auto' }),
              left: `${coords.left}px`,
              minWidth: '320px',
              width: `${Math.max(coords.width, 320)}px`,
              maxHeight: `${coords.maxHeight}px`,
              zIndex: 999999999,
              boxShadow: '0 12px 28px -4px rgba(0, 0, 0, 0.25), 0 8px 12px -6px rgba(0, 0, 0, 0.15)',
            }}
            className={`agv-custom-select-dropdown agv-preset-dropdown-menu agv-portal-dropdown ${
              coords.isFlipUp ? 'agv-spring-up' : 'agv-spring-down'
            } ${themeCls}`}
            data-theme={theme}
            data-agv-popup="true"
          >
            {(dayItems.length > 0 || rangeItems.length > 0) && (
              <div className="agv-preset-group agv-preset-matrix-group">
                <div className="agv-preset-columns-grid">
                  {dayItems.length > 0 && (
                    <div className="agv-preset-col">
                      <div className="agv-preset-col-title">Ngày gần đây</div>
                      <div className="agv-preset-col-items">
                        {dayItems.map((item) => {
                          const isSelected = selectedIds.has(item.id);
                          return (
                            <div
                              key={item.id}
                              onClick={() => {
                                setInternalValue(item.id);
                                onSelect?.(item.id, false);
                                setIsOpen(false);
                              }}
                              className={`agv-preset-item agv-preset-col-item ${
                                isSelected ? 'is-active' : ''
                              }`}
                            >
                              <span className="agv-preset-item-text truncate">
                                {item.label}
                              </span>
                              <div className="flex flex-shrink-0 items-center gap-1">
                                {item.count !== undefined && item.count > 0 && (
                                  <span className="agv-preset-item-count has-data">
                                    {item.count.toLocaleString('vi-VN')}
                                  </span>
                                )}
                                {isSelected && (
                                  <Check className="h-3 w-3 flex-shrink-0 text-[var(--agv-accent-text)]" />
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {dayItems.length > 0 && rangeItems.length > 0 && (
                    <div className="agv-preset-col-divider" />
                  )}

                  {rangeItems.length > 0 && (
                    <div className="agv-preset-col">
                      <div className="agv-preset-col-title">Khoảng chu kỳ</div>
                      <div className="agv-preset-col-items">
                        {rangeItems.map((item) => {
                          const isSelected = selectedIds.has(item.id);
                          return (
                            <div
                              key={item.id}
                              onClick={() => {
                                setInternalValue(item.id);
                                onSelect?.(item.id, false);
                                setIsOpen(false);
                              }}
                              className={`agv-preset-item agv-preset-col-item ${
                                isSelected ? 'is-active' : ''
                              }`}
                            >
                              <span className="agv-preset-item-text truncate">
                                {item.label}
                              </span>
                              <div className="flex flex-shrink-0 items-center gap-1">
                                {item.count !== undefined && item.count > 0 && (
                                  <span className="agv-preset-item-count has-data">
                                    {item.count.toLocaleString('vi-VN')}
                                  </span>
                                )}
                                {isSelected && (
                                  <Check className="h-3 w-3 flex-shrink-0 text-[var(--agv-accent-text)]" />
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {yearsData.length > 0 && (
              <div className="agv-preset-group">
                <div className="agv-preset-group-title">Mốc theo năm</div>
                {yearsData.map((yItem) => {
                  const y = yItem.year;
                  const isExpanded = Boolean(expandedYears[y]);
                  const isYearSelected = selectedIds.has(yItem.id);
                  const hasQuarters = yItem.quarters.length > 0;
                  const hasMonths = yItem.months.length > 0;

                  return (
                    <div key={y} className="agv-preset-year-group">
                      <div
                        onClick={() => {
                          setInternalValue(yItem.id);
                          onSelect?.(yItem.id, false);
                          setIsOpen(false);
                        }}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleExpandYear(y, e);
                        }}
                        className={`agv-preset-item agv-preset-year-row ${
                          isYearSelected ? 'is-active' : ''
                        }`}
                      >
                        <div className="flex min-w-0 items-center gap-1.5 overflow-hidden">
                          <button
                            type="button"
                            onClick={(e) => toggleExpandYear(y, e)}
                            onContextMenu={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleExpandYear(y, e);
                            }}
                            className="agv-preset-expand-btn"
                          >
                            <ChevronRight
                              className={`h-3.5 w-3.5 text-[var(--agv-text-subtle)] transition-transform duration-150 ${
                                isExpanded
                                  ? 'rotate-90 text-[var(--agv-accent)]'
                                  : ''
                              }`}
                            />
                          </button>
                          <span className="agv-preset-item-text truncate font-semibold">
                            {yItem.label}
                          </span>
                        </div>

                        <div className="flex flex-shrink-0 items-center gap-1.5">
                          {yItem.count !== undefined && yItem.count > 0 && (
                            <span
                              className="agv-preset-item-count has-data"
                            >
                              {yItem.count.toLocaleString('vi-VN')}
                            </span>
                          )}
                          {isYearSelected && (
                            <Check className="h-3.5 w-3.5 flex-shrink-0 text-[var(--agv-accent-text)]" />
                          )}
                        </div>
                      </div>

                      {isExpanded && (hasQuarters || hasMonths) && (
                        <div className="agv-preset-subgrid">
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

            {selectedIds.size > 0 && (
              <div className="sticky bottom-0 mt-2 flex items-center justify-between border-t border-[var(--agv-border)] bg-[var(--agv-bg-popup)] px-2.5 py-1.5 text-[11px]">
                <span className="truncate font-medium text-[var(--agv-text-muted)]">
                  Đã chọn:{' '}
                  <strong className="text-[var(--agv-accent)]">
                    {currentItemLabel}
                  </strong>
                </span>
                <div className="ml-2 flex shrink-0 items-center gap-1.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setInternalValue('');
                      onSelect?.('', true);
                    }}
                    className="rounded px-2 py-0.5 text-[10.5px] text-[var(--agv-text-subtle)] hover:bg-[var(--agv-bg-item-hover)] hover:text-[var(--agv-text-main)]"
                  >
                    Bỏ chọn
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsOpen(false);
                    }}
                    className="rounded bg-[var(--agv-accent)] px-2.5 py-0.5 text-[10.5px] font-semibold text-[var(--agv-accent-text,#fff)] hover:opacity-90"
                  >
                    Áp dụng
                  </button>
                </div>
              </div>
            )}
          </div>,
          triggerRef.current?.ownerDocument?.body || document.body
        )}
    </div>
  );
});
