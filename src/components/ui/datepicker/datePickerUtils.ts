import React, { useEffect, useRef } from 'react';
import { SURFACE_THEMES } from '../../../themes';

export function getThemeClass(theme?: string): string {
  switch (theme) {
    case SURFACE_THEMES.DARK:
    case SURFACE_THEMES.CALIBRATED_DARK:
    case SURFACE_THEMES.DEEP_DARK:
      return 'agv-theme-dark agv-dark';
    case SURFACE_THEMES.E_INK:
    case SURFACE_THEMES.EINK:
      return 'agv-theme-eink agv-e-ink theme-eink';
    case SURFACE_THEMES.BEZIER_ARTHOUSE:
      return 'agv-theme-bezier agv-bezier-arthouse';
    case SURFACE_THEMES.LIGHT:
    case SURFACE_THEMES.DAYLIGHT:
    default:
      return 'agv-theme-light agv-light';
  }
}

export const MONTH_LABELS = [
  'Tháng 1',
  'Tháng 2',
  'Tháng 3',
  'Tháng 4',
  'Tháng 5',
  'Tháng 6',
  'Tháng 7',
  'Tháng 8',
  'Tháng 9',
  'Tháng 10',
  'Tháng 11',
  'Tháng 12',
];

export const MONTH_SHORT_LABELS = [
  'Thg 1',
  'Thg 2',
  'Thg 3',
  'Thg 4',
  'Thg 5',
  'Thg 6',
  'Thg 7',
  'Thg 8',
  'Thg 9',
  'Thg 10',
  'Thg 11',
  'Thg 12',
];

export const CALENDAR_WEEKDAYS = [
  { label: 'CN', isWeekend: true },
  { label: 'T2', isWeekend: false },
  { label: 'T3', isWeekend: false },
  { label: 'T4', isWeekend: false },
  { label: 'T5', isWeekend: false },
  { label: 'T6', isWeekend: false },
  { label: 'T7', isWeekend: true },
];

export const REGEX_DMY_DATETIME =
  /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})(?:\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/;
export const REGEX_YMD_DATETIME =
  /^(\d{4})[/-](\d{1,2})[/-](\d{1,2})(?:\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/;
export const REGEX_YMD_DATE = /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/;
export const REGEX_DMY_OPT_YEAR = /^(\d{1,2})[/-](\d{1,2})(?:[/-](\d{4}))?/;
export const REGEX_DMY_STRICT = /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})/;
export const REGEX_DM_ONLY = /^(\d{1,2})[/-](\d{1,2})$/;
export const REGEX_DATA_QUARTER = /^data_quarter_(\d{4})_q([1-4])$/;
export const REGEX_DATA_MONTH = /^data_month_(\d{4})_m(\d{1,2})$/;
export const REGEX_DATA_YEAR = /^data_year_(\d{4})$/;
export const REGEX_BARE_YEAR = /^(\d{4})$/;
export const REGEX_ANY_YEAR_TOKEN = /(?:data_year_|data_quarter_|data_month_)(\d{4})/;
export const REGEX_UNDERSCORE_YEAR = /_(\d{4})/;
export const REGEX_MULTI_SPLIT = /[,;]/;
export const REGEX_RANGE_INPUT_SPLIT = /[;\u2014]|\.\.|\s-\s/;
export const REGEX_TIME_HM = /(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?/;

export const ROMAN_QUARTERS: Record<number, string> = {
  1: 'I',
  2: 'II',
  3: 'III',
  4: 'IV',
};

export function pad2(n: number | string): string {
  const s = String(n);
  return s.length < 2 ? `0${s}` : s;
}

export function formatDateToYMD(
  d: Date | null | undefined,
  includeTime: boolean = false
): string {
  if (!d) return '';
  const time = d.getTime();
  if (Number.isNaN(time)) return '';
  const ymd = `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
  if (!includeTime) return ymd;
  return `${ymd} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

export function parseDateToTimestamp(
  str: unknown,
  isEndOfDay: boolean = false
): number | null {
  if (!str) return null;
  if (str instanceof Date) {
    const t = str.getTime();
    return Number.isNaN(t) ? null : t;
  }
  const s = String(str).trim();
  if (!s) return null;

  const dmy = REGEX_DMY_DATETIME.exec(s);
  if (dmy) {
    const day = parseInt(dmy[1], 10);
    const month = parseInt(dmy[2], 10) - 1;
    const year = parseInt(dmy[3], 10);
    const hour = dmy[4] !== undefined ? parseInt(dmy[4], 10) : isEndOfDay ? 23 : 0;
    const min = dmy[5] !== undefined ? parseInt(dmy[5], 10) : isEndOfDay ? 59 : 0;
    const sec = dmy[6] !== undefined ? parseInt(dmy[6], 10) : isEndOfDay ? 59 : 0;
    const ms = isEndOfDay && dmy[4] === undefined ? 999 : 0;
    const d = new Date(year, month, day, hour, min, sec, ms);
    if (
      d.getFullYear() === year &&
      d.getMonth() === month &&
      d.getDate() === day
    ) {
      return d.getTime();
    }
    return null;
  }

  const ymd = REGEX_YMD_DATETIME.exec(s);
  if (ymd) {
    const year = parseInt(ymd[1], 10);
    const month = parseInt(ymd[2], 10) - 1;
    const day = parseInt(ymd[3], 10);
    const hour = ymd[4] !== undefined ? parseInt(ymd[4], 10) : isEndOfDay ? 23 : 0;
    const min = ymd[5] !== undefined ? parseInt(ymd[5], 10) : isEndOfDay ? 59 : 0;
    const sec = ymd[6] !== undefined ? parseInt(ymd[6], 10) : isEndOfDay ? 59 : 0;
    const ms = isEndOfDay && ymd[4] === undefined ? 999 : 0;
    const d = new Date(year, month, day, hour, min, sec, ms);
    if (
      d.getFullYear() === year &&
      d.getMonth() === month &&
      d.getDate() === day
    ) {
      return d.getTime();
    }
    return null;
  }

  const parsed = Date.parse(s);
  return Number.isNaN(parsed) ? null : parsed;
}

export function formatDisplayDate(
  str: unknown,
  omitYear: boolean = false,
  includeTime: boolean = false
): string {
  if (!str) return '';
  if (str instanceof Date) {
    if (Number.isNaN(str.getTime())) return '';
    const dd = pad2(str.getDate());
    const mm = pad2(str.getMonth() + 1);
    const timeStr = includeTime
      ? ` ${pad2(str.getHours())}:${pad2(str.getMinutes())}`
      : '';
    return omitYear ? `${dd}/${mm}${timeStr}` : `${dd}/${mm}/${str.getFullYear()}${timeStr}`;
  }
  const s = String(str).trim();
  if (!s) return '';

  const timeMatch = REGEX_TIME_HM.exec(s);
  const timeSuffix =
    includeTime && timeMatch
      ? ` ${pad2(timeMatch[1])}:${pad2(timeMatch[2])}`
      : '';

  const ymd = REGEX_YMD_DATE.exec(s);
  if (ymd) {
    const dd = pad2(ymd[3]);
    const mm = pad2(ymd[2]);
    return omitYear ? `${dd}/${mm}${timeSuffix}` : `${dd}/${mm}/${ymd[1]}${timeSuffix}`;
  }

  const dmy = REGEX_DMY_OPT_YEAR.exec(s);
  if (dmy) {
    const dd = pad2(dmy[1]);
    const mm = pad2(dmy[2]);
    if (omitYear || !dmy[3]) return `${dd}/${mm}${timeSuffix}`;
    return `${dd}/${mm}/${dmy[3]}${timeSuffix}`;
  }

  return s;
}

/**
 * Định dạng ngày/tháng/năm chuẩn bảng dữ liệu (DD/MM/YYYY)
 * Đồng bộ 100% hiển thị giữa dữ liệu gốc và giá trị chọn từ date controls (AdvDatePicker / AdvDateRangePicker)
 */
export function formatGridDateValue(
  val: unknown,
  includeTime: boolean = false
): string {
  if (val === null || val === undefined) return '';
  const s = String(val).trim();
  if (!s) return '';

  // 1. Khoảng ngày: chứa " - " hoặc ".."
  if (s.includes(' - ')) {
    const parts = s.split(' - ');
    const from = formatDisplayDate(parts[0], false, includeTime);
    const to = formatDisplayDate(parts[1], false, includeTime);
    return from && to ? `${from} - ${to}` : from || to || s;
  }
  if (s.includes('..')) {
    const parts = s.split('..');
    const from = formatDisplayDate(parts[0], false, includeTime);
    const to = formatDisplayDate(parts[1], false, includeTime);
    return from && to ? `${from} - ${to}` : from || to || s;
  }

  // 2. Ngày đơn hoặc ngày giờ
  return formatDisplayDate(s, false, includeTime);
}

export function parseDMYToDate(str: unknown, fallbackYear?: number): Date | null {
  if (!str) return null;
  if (str instanceof Date) {
    return Number.isNaN(str.getTime())
      ? null
      : new Date(str.getFullYear(), str.getMonth(), str.getDate(), str.getHours(), str.getMinutes());
  }
  const s = String(str).trim();
  if (!s) return null;

  const dmy = REGEX_DMY_DATETIME.exec(s);
  if (dmy) {
    const day = parseInt(dmy[1], 10);
    const month = parseInt(dmy[2], 10) - 1;
    const year = parseInt(dmy[3], 10);
    const hour = dmy[4] !== undefined ? parseInt(dmy[4], 10) : 0;
    const min = dmy[5] !== undefined ? parseInt(dmy[5], 10) : 0;
    const date = new Date(year, month, day, hour, min, 0);
    if (
      date.getFullYear() === year &&
      date.getMonth() === month &&
      date.getDate() === day
    ) {
      return date;
    }
  }

  const ymd = REGEX_YMD_DATETIME.exec(s);
  if (ymd) {
    const year = parseInt(ymd[1], 10);
    const month = parseInt(ymd[2], 10) - 1;
    const day = parseInt(ymd[3], 10);
    const hour = ymd[4] !== undefined ? parseInt(ymd[4], 10) : 0;
    const min = ymd[5] !== undefined ? parseInt(ymd[5], 10) : 0;
    const date = new Date(year, month, day, hour, min, 0);
    if (
      date.getFullYear() === year &&
      date.getMonth() === month &&
      date.getDate() === day
    ) {
      return date;
    }
  }

  const dm = REGEX_DM_ONLY.exec(s);
  if (dm) {
    const day = parseInt(dm[1], 10);
    const month = parseInt(dm[2], 10) - 1;
    const year = fallbackYear || new Date().getFullYear();
    const date = new Date(year, month, day);
    if (
      date.getFullYear() === year &&
      date.getMonth() === month &&
      date.getDate() === day
    ) {
      return date;
    }
  }

  const ts = parseDateToTimestamp(s);
  if (ts !== null) {
    return new Date(ts);
  }
  return null;
}

export function computePresetDateRange(
  presetId: string,
  customYear?: number
): { from: string; to: string } {
  if (!presetId) return { from: '', to: '' };

  if (presetId.includes(',') || presetId.includes(';')) {
    const parts = presetId
      .split(REGEX_MULTI_SPLIT)
      .map((s) => s.trim())
      .filter(Boolean);
    if (parts.length === 0) return { from: '', to: '' };
    if (parts.length === 1) {
      return computePresetDateRange(parts[0], customYear);
    }
    let minFrom = '';
    let maxTo = '';
    for (let i = 0; i < parts.length; i++) {
      const r = computePresetDateRange(parts[i], customYear);
      if (r.from && (!minFrom || r.from < minFrom)) minFrom = r.from;
      if (r.to && (!maxTo || r.to > maxTo)) maxTo = r.to;
    }
    return { from: minFrom, to: maxTo };
  }

  const now = new Date();
  const currentRealYear = now.getFullYear();
  const curMonth = now.getMonth();
  const curDate = now.getDate();

  switch (presetId) {
    case 'today': {
      const today = formatDateToYMD(now);
      return { from: today, to: today };
    }
    case 'yesterday': {
      const str = formatDateToYMD(new Date(currentRealYear, curMonth, curDate - 1));
      return { from: str, to: str };
    }
    case 'mon': {
      const dayOfWeek = (now.getDay() + 6) % 7;
      const str = formatDateToYMD(
        new Date(currentRealYear, curMonth, curDate - dayOfWeek)
      );
      return { from: str, to: str };
    }
    case 'sat_prev_week': {
      const dayOfWeek = (now.getDay() + 6) % 7;
      const str = formatDateToYMD(
        new Date(currentRealYear, curMonth, curDate - dayOfWeek - 2)
      );
      return { from: str, to: str };
    }
    case 'sun_prev_week': {
      const dayOfWeek = (now.getDay() + 6) % 7;
      const str = formatDateToYMD(
        new Date(currentRealYear, curMonth, curDate - dayOfWeek - 1)
      );
      return { from: str, to: str };
    }
    case 'this_week': {
      const dayOfWeek = (now.getDay() + 6) % 7;
      const mon = new Date(currentRealYear, curMonth, curDate - dayOfWeek);
      const sun = new Date(currentRealYear, curMonth, curDate - dayOfWeek + 6);
      return { from: formatDateToYMD(mon), to: formatDateToYMD(sun) };
    }
    case 'last_week': {
      const dayOfWeek = (now.getDay() + 6) % 7;
      const mon = new Date(currentRealYear, curMonth, curDate - dayOfWeek - 7);
      const sun = new Date(currentRealYear, curMonth, curDate - dayOfWeek - 1);
      return { from: formatDateToYMD(mon), to: formatDateToYMD(sun) };
    }
    case 'this_month': {
      const start = new Date(currentRealYear, curMonth, 1);
      const end = new Date(currentRealYear, curMonth + 1, 0);
      return { from: formatDateToYMD(start), to: formatDateToYMD(end) };
    }
    case 'this_quarter': {
      const q = Math.floor(curMonth / 3);
      const start = new Date(currentRealYear, q * 3, 1);
      const end = new Date(currentRealYear, q * 3 + 3, 0);
      return { from: formatDateToYMD(start), to: formatDateToYMD(end) };
    }
    case 'this_year':
      return { from: `${currentRealYear}-01-01`, to: `${currentRealYear}-12-31` };
    case 'last_year':
      return {
        from: `${currentRealYear - 1}-01-01`,
        to: `${currentRealYear - 1}-12-31`,
      };
    case 'q1': {
      const y = customYear || currentRealYear;
      return { from: `${y}-01-01`, to: `${y}-03-31` };
    }
    case 'q2': {
      const y = customYear || currentRealYear;
      return { from: `${y}-04-01`, to: `${y}-06-30` };
    }
    case 'q3': {
      const y = customYear || currentRealYear;
      return { from: `${y}-07-01`, to: `${y}-09-30` };
    }
    case 'q4': {
      const y = customYear || currentRealYear;
      return { from: `${y}-10-01`, to: `${y}-12-31` };
    }
    default: {
      if (REGEX_BARE_YEAR.test(presetId)) {
        const y = parseInt(presetId, 10);
        return { from: `${y}-01-01`, to: `${y}-12-31` };
      }
      if (presetId.startsWith('m')) {
        const m = parseInt(presetId.substring(1), 10);
        if (!Number.isNaN(m) && m >= 1 && m <= 12) {
          const y = customYear || currentRealYear;
          const start = new Date(y, m - 1, 1);
          const end = new Date(y, m, 0);
          return { from: formatDateToYMD(start), to: formatDateToYMD(end) };
        }
      }
      if (presetId.startsWith('data_year_')) {
        const y = parseInt(presetId.slice(10), 10);
        if (!Number.isNaN(y)) {
          return { from: `${y}-01-01`, to: `${y}-12-31` };
        }
      }
      if (presetId.startsWith('data_quarter_')) {
        const match = REGEX_DATA_QUARTER.exec(presetId);
        if (match) {
          const y = match[1];
          const q = parseInt(match[2], 10);
          const startMonth = pad2((q - 1) * 3 + 1);
          const endMonth = pad2(q * 3);
          const endDay = q === 1 || q === 4 ? '31' : '30';
          return { from: `${y}-${startMonth}-01`, to: `${y}-${endMonth}-${endDay}` };
        }
      }
      if (presetId.startsWith('data_month_')) {
        const match = REGEX_DATA_MONTH.exec(presetId);
        if (match) {
          const y = parseInt(match[1], 10);
          const m = parseInt(match[2], 10);
          const start = new Date(y, m - 1, 1);
          const end = new Date(y, m, 0);
          return { from: formatDateToYMD(start), to: formatDateToYMD(end) };
        }
      }
      return { from: '', to: '' };
    }
  }
}

export function normalizePresetList(list: string[]): string[] {
  const set = new Set<string>();
  const years = new Set<number>();

  for (let i = 0; i < list.length; i++) {
    const id = list[i];
    if (!id) continue;
    set.add(id);
    const ym = REGEX_UNDERSCORE_YEAR.exec(id);
    if (ym) years.add(Number(ym[1]));
  }

  for (const y of years) {
    for (let q = 1; q <= 4; q++) {
      const qId = `data_quarter_${y}_q${q}`;
      const m1 = `data_month_${y}_m${(q - 1) * 3 + 1}`;
      const m2 = `data_month_${y}_m${(q - 1) * 3 + 2}`;
      const m3 = `data_month_${y}_m${(q - 1) * 3 + 3}`;

      if (set.has(m1) && set.has(m2) && set.has(m3)) {
        set.delete(m1);
        set.delete(m2);
        set.delete(m3);
        set.add(qId);
      }

      if (set.has(qId)) {
        set.delete(m1);
        set.delete(m2);
        set.delete(m3);
      }
    }

    const yId = `data_year_${y}`;
    const q1 = `data_quarter_${y}_q1`;
    const q2 = `data_quarter_${y}_q2`;
    const q3 = `data_quarter_${y}_q3`;
    const q4 = `data_quarter_${y}_q4`;

    if (set.has(q1) && set.has(q2) && set.has(q3) && set.has(q4)) {
      set.delete(q1);
      set.delete(q2);
      set.delete(q3);
      set.delete(q4);
      set.add(yId);
    }

    if (set.has(yId)) {
      for (let q = 1; q <= 4; q++) {
        set.delete(`data_quarter_${y}_q${q}`);
      }
      for (let m = 1; m <= 12; m++) {
        set.delete(`data_month_${y}_m${m}`);
      }
    }
  }

  return Array.from(set);
}

export function getPresetLabel(presetId: string, customYear?: number): string {
  if (!presetId) return '';

  if (presetId.includes(',') || presetId.includes(';')) {
    const parts = presetId
      .split(REGEX_MULTI_SPLIT)
      .map((s) => s.trim())
      .filter(Boolean);
    if (parts.length === 0) return '';
    if (parts.length === 1) return getPresetLabel(parts[0], customYear);

    const itemMatches: Array<{
      type: 'q' | 'm' | 'y';
      year: string;
      val: string;
      order: number;
    } | null> = parts.map((p) => {
      const qm = REGEX_DATA_QUARTER.exec(p);
      if (qm) return { type: 'q', year: qm[1], val: qm[2], order: Number(qm[2]) * 10 };
      const mm = REGEX_DATA_MONTH.exec(p);
      if (mm) return { type: 'm', year: mm[1], val: mm[2], order: Number(mm[2]) };
      const ym = REGEX_DATA_YEAR.exec(p);
      if (ym) return { type: 'y', year: ym[1], val: ym[1], order: 0 };
      return null;
    });

    if (itemMatches.every((it) => it !== null)) {
      const validMatches = itemMatches as Array<{
        type: 'q' | 'm' | 'y';
        year: string;
        val: string;
        order: number;
      }>;
      const firstY = validMatches[0].year;
      if (validMatches.every((it) => it.year === firstY)) {
        const sorted = [...validMatches].sort((a, b) => a.order - b.order);
        const shortLabels = sorted.map((it) => {
          if (it.type === 'q') return `Q${ROMAN_QUARTERS[Number(it.val)] || 'IV'}`;
          if (it.type === 'm') return `T${it.val}`;
          return `Năm ${it.val}`;
        });
        if (shortLabels.length <= 4) {
          return `${shortLabels.join(', ')} (${firstY})`;
        }
        return `${shortLabels.slice(0, 3).join(', ')}... (+${
          shortLabels.length - 3
        }) (${firstY})`;
      }
    }

    const labels = parts.map((p) => getPresetLabel(p, customYear));
    if (labels.length <= 3) {
      return labels.join(', ');
    }
    return `${labels.slice(0, 2).join(', ')}... (${labels.length} mốc)`;
  }

  const currentRealYear = new Date().getFullYear();
  switch (presetId) {
    case 'today':
      return 'Hôm nay';
    case 'yesterday':
      return 'Hôm qua';
    case 'mon':
      return 'Thứ 2';
    case 'sat_prev_week':
      return 'Thứ 7 tuần trước';
    case 'sun_prev_week':
      return 'Chủ nhật tuần trước';
    case 'this_week':
      return 'Tuần này';
    case 'last_week':
      return 'Tuần trước';
    case 'this_month':
      return 'Tháng này';
    case 'this_quarter':
      return 'Quý này';
    case 'this_year':
      return `Năm nay (${currentRealYear})`;
    case 'last_year':
      return `Năm trước (${currentRealYear - 1})`;
    case 'q1':
      return customYear && customYear !== currentRealYear ? `Quý I (${customYear})` : 'Quý I';
    case 'q2':
      return customYear && customYear !== currentRealYear ? `Quý II (${customYear})` : 'Quý II';
    case 'q3':
      return customYear && customYear !== currentRealYear ? `Quý III (${customYear})` : 'Quý III';
    case 'q4':
      return customYear && customYear !== currentRealYear ? `Quý IV (${customYear})` : 'Quý IV';
    default: {
      if (REGEX_BARE_YEAR.test(presetId)) {
        return `Năm ${presetId}`;
      }
      if (presetId.startsWith('m')) {
        const m = parseInt(presetId.substring(1), 10);
        if (!Number.isNaN(m) && m >= 1 && m <= 12) {
          return customYear && customYear !== currentRealYear
            ? `Tháng ${m} (${customYear})`
            : `Tháng ${m}`;
        }
      }
      if (presetId.startsWith('data_year_')) {
        return `Năm ${presetId.slice(10)}`;
      }
      if (presetId.startsWith('data_quarter_')) {
        const match = REGEX_DATA_QUARTER.exec(presetId);
        if (match) {
          const roman = ROMAN_QUARTERS[Number(match[2])] || 'IV';
          return `Quý ${roman} (${match[1]})`;
        }
      }
      if (presetId.startsWith('data_month_')) {
        const match = REGEX_DATA_MONTH.exec(presetId);
        if (match) {
          return `Tháng ${match[2]} (${match[1]})`;
        }
      }
      return presetId;
    }
  }
}

export function isDateDisabledHelper(
  dateOrTs: Date | number,
  minTs: number | null,
  maxTs: number | null
): boolean {
  const ts = typeof dateOrTs === 'number' ? dateOrTs : dateOrTs.getTime();
  if (minTs !== null && ts < minTs) return true;
  if (maxTs !== null && ts > maxTs) return true;
  return false;
}

export function shiftMonth(m: number, y: number, delta: number) {
  let newM = m + delta;
  let newY = y;
  if (newM < 0) {
    newM = 11;
    newY--;
  } else if (newM > 11) {
    newM = 0;
    newY++;
  }
  return { month: newM, year: newY };
}

export interface CalendarCellItem {
  date: Date;
  dayNum: number;
  isCurrentMonth: boolean;
  ts: number;
  isWeekend: boolean;
}

export function buildCalendarCells(
  navYear: number,
  navMonth: number
): CalendarCellItem[] {
  const firstDay = new Date(navYear, navMonth, 1);
  const lastDay = new Date(navYear, navMonth + 1, 0);
  const startDayOfWeek = firstDay.getDay();
  const daysInMonth = lastDay.getDate();
  const daysInPrevMonth = new Date(navYear, navMonth, 0).getDate();

  const cells: CalendarCellItem[] = new Array(42);
  let cursor = 0;

  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i;
    const date = new Date(navYear, navMonth - 1, d);
    const dow = date.getDay();
    cells[cursor++] = {
      date,
      dayNum: d,
      isCurrentMonth: false,
      ts: date.getTime(),
      isWeekend: dow === 0 || dow === 6,
    };
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(navYear, navMonth, d);
    const dow = date.getDay();
    cells[cursor++] = {
      date,
      dayNum: d,
      isCurrentMonth: true,
      ts: date.getTime(),
      isWeekend: dow === 0 || dow === 6,
    };
  }

  const remaining = 42 - cursor;
  for (let d = 1; d <= remaining; d++) {
    const date = new Date(navYear, navMonth + 1, d);
    const dow = date.getDay();
    cells[cursor++] = {
      date,
      dayNum: d,
      isCurrentMonth: false,
      ts: date.getTime(),
      isWeekend: dow === 0 || dow === 6,
    };
  }

  return cells;
}

export function usePopupDismiss(
  isOpen: boolean,
  onClose: () => void,
  onUpdateCoords?: () => void,
  triggerRef?: React.RefObject<HTMLElement | null>,
  popupRef?: React.RefObject<HTMLElement | null>
) {
  const onCloseRef = useRef(onClose);
  const onUpdateCoordsRef = useRef(onUpdateCoords);

  useEffect(() => {
    onCloseRef.current = onClose;
    onUpdateCoordsRef.current = onUpdateCoords;
  });

  useEffect(() => {
    if (!isOpen) return;

    let rafId: number | null = null;

    const handleOutside = (e: MouseEvent) => {
      const t = e.target as Node | null;
      if (!t) return;
      if (
        (t as HTMLElement)?.closest?.(
          '.agv-portal-dropdown, .agv-preset-dropdown-menu, .agv-calendar-popover, .agv-daterange-popover, .agv-custom-select-dropdown'
        )
      ) {
        return;
      }
      if (triggerRef?.current && triggerRef.current.contains(t)) {
        return;
      }
      if (popupRef?.current && popupRef.current.contains(t)) {
        return;
      }
      onCloseRef.current();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onCloseRef.current();
      }
    };

    const scheduleReposition = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = null;
        onUpdateCoordsRef.current?.();
      });
    };

    const handleContextMenu = (e: MouseEvent) => {
      const t = e.target as Node | null;
      if (!t) return;
      if (!popupRef?.current || !popupRef.current.contains(t)) {
        onCloseRef.current();
      }
    };

    const handleCloseAll = (e: Event) => {
      const ce = e as CustomEvent;
      const isNested = Boolean(triggerRef?.current?.closest('.agv-multi-filter-popup'));
      if (isNested && ce.detail?.except === 'multi-filter') {
        return;
      }
      if (ce.detail?.except === 'datepicker') {
        return;
      }
      if (ce.detail?.except === 'focus-cell') {
        if (triggerRef?.current) {
          const cellBox = triggerRef.current.closest('.agv-filter-cell-box');
          if (cellBox && (cellBox.contains(document.activeElement) || cellBox === document.activeElement)) {
            return;
          }
        }
      }
      onCloseRef.current();
    };

    document.addEventListener('mousedown', handleOutside, { passive: true });
    document.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('agv-close-all-popups', handleCloseAll);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', scheduleReposition, { passive: true });
    window.addEventListener('scroll', scheduleReposition, {
      capture: true,
      passive: true,
    });

    return () => {
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('agv-close-all-popups', handleCloseAll);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', scheduleReposition);
      window.removeEventListener('scroll', scheduleReposition, true);
    };
  }, [isOpen, triggerRef, popupRef]);
}

export function computeDropdownMenuCoords(
  triggerEl: HTMLElement | null,
  preferredHeight = 250,
  minWidth = 200
) {
  if (!triggerEl || typeof window === 'undefined') {
    return { top: 0, left: 0, bottom: 0, width: minWidth, maxHeight: preferredHeight, isFlipUp: false };
  }
  const filterCell =
    triggerEl.closest<HTMLElement>('.agv-filter-cell-box') ||
    triggerEl.closest<HTMLElement>('.agv-filter-cell');
  const anchorEl = filterCell || triggerEl;
  const rect = anchorEl.getBoundingClientRect();
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const menuWidth = Math.max(minWidth, Math.round(rect.width));
  let left = Math.round(rect.left);
  if (left + menuWidth > vw - 10) {
    left = Math.max(10, vw - menuWidth - 10);
  }
  if (left < 10) left = 10;

  const spaceBelow = vh - rect.bottom - 12;
  const spaceAbove = rect.top - 12;
  const isFlipUp = spaceBelow < 180 && spaceAbove > spaceBelow;
  let top = Math.round(rect.bottom + 4);
  let maxHeight = Math.min(preferredHeight, Math.max(140, spaceBelow));

  if (isFlipUp) {
    maxHeight = Math.min(preferredHeight, Math.max(140, spaceAbove));
    top = Math.max(8, Math.round(rect.top - maxHeight - 4));
  }
  const bottom = Math.round(vh - rect.top + 4);

  return { top, left, bottom, width: menuWidth, maxHeight, isFlipUp };
}

export function computeCalendarCoords(
  triggerEl: HTMLElement | null,
  calWidth = 264,
  calHeight = 310
) {
  if (!triggerEl || typeof window === 'undefined') {
    return { top: 0, left: 0, bottom: 0, isFlipUp: false };
  }
  const filterCell =
    triggerEl.closest<HTMLElement>('.agv-filter-cell-box') ||
    triggerEl.closest<HTMLElement>('.agv-filter-cell');
  const anchorEl = filterCell || triggerEl;
  const rect = anchorEl.getBoundingClientRect();
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  let left = Math.round(rect.left);
  if (left + calWidth > vw - 12) {
    left = Math.max(12, vw - calWidth - 12);
  }
  if (left < 12) left = 12;

  const spaceBelow = vh - rect.bottom - 8;
  const spaceAbove = rect.top - 8;
  const isFlipUp = spaceBelow < calHeight && spaceAbove > spaceBelow;

  const top = isFlipUp
    ? Math.max(8, Math.round(rect.top - calHeight - 4))
    : Math.round(rect.bottom + 4);
  const bottom = Math.round(vh - rect.top + 4);

  return { top, left, bottom, isFlipUp };
}

export function resolveMinYearFromContext(
  minYearProp?: number,
  minStr?: string,
  dateAnalysis?: any,
  bounds?: any
): number {
  if (minYearProp !== undefined) return minYearProp;

  let minDataYear: number | undefined;
  if (bounds?.minDate instanceof Date && !Number.isNaN(bounds.minDate.getTime())) {
    minDataYear = bounds.minDate.getFullYear();
  } else if (bounds?.minTs && bounds.minTs !== Infinity) {
    minDataYear = new Date(bounds.minTs).getFullYear();
  } else if (dateAnalysis?.minYear !== undefined && dateAnalysis.minYear > 1900) {
    minDataYear = dateAnalysis.minYear;
  } else if (
    dateAnalysis?.minDate instanceof Date &&
    !Number.isNaN(dateAnalysis.minDate.getTime())
  ) {
    minDataYear = dateAnalysis.minDate.getFullYear();
  } else if (dateAnalysis?.yearCounts) {
    const keys = Object.keys(dateAnalysis.yearCounts);
    for (let i = 0; i < keys.length; i++) {
      const y = Number(keys[i]);
      if (y > 1900 && (dateAnalysis.yearCounts[y] || 0) > 0) {
        if (minDataYear === undefined || y < minDataYear) minDataYear = y;
      }
    }
  }

  let minPropYear: number | undefined;
  if (minStr && minStr.trim()) {
    const d = parseDMYToDate(minStr);
    if (d) {
      minPropYear = d.getFullYear();
    } else {
      const n = parseInt(minStr.trim(), 10);
      if (!Number.isNaN(n) && n > 1900 && n < 2200) minPropYear = n;
    }
  }

  const candidateMin =
    minDataYear !== undefined && minPropYear !== undefined
      ? Math.min(minDataYear, minPropYear)
      : minDataYear !== undefined
        ? minDataYear
        : minPropYear;

  if (candidateMin !== undefined && candidateMin < 2026) {
    return candidateMin;
  }
  return 2026;
}
