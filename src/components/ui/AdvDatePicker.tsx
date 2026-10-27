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

export { Calendar, Clock, Check, ChevronRight, ChevronDown, ChevronLeft, ArrowRight };

export function getThemeClass(theme?: string): string {
  switch (theme) {
    case 'dark':
    case 'calibrated-dark':
    case 'deep-dark':
      return 'agv-theme-dark agv-dark';
    case 'e-ink':
    case 'eink':
      return 'agv-theme-eink agv-e-ink theme-eink';
    case 'bezier-arthouse':
      return 'agv-theme-bezier agv-bezier-arthouse';
    case 'light':
    case 'daylight':
    default:
      return 'agv-theme-light agv-light';
  }
}

import { ensureDatePickerStyles } from './datepicker/datePickerStyles';
import { NO_AUTOFILL_PROPS, getGridControlRadiusClass } from '../grid/constants';

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

const REGEX_DMY_DATETIME =
  /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})(?:\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/;
const REGEX_YMD_DATETIME =
  /^(\d{4})[/-](\d{1,2})[/-](\d{1,2})(?:\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/;
const REGEX_YMD_DATE = /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/;
const REGEX_DMY_OPT_YEAR = /^(\d{1,2})[/-](\d{1,2})(?:[/-](\d{4}))?/;
const REGEX_DMY_STRICT = /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})/;
const REGEX_DM_ONLY = /^(\d{1,2})[/-](\d{1,2})$/;
const REGEX_DATA_QUARTER = /^data_quarter_(\d{4})_q([1-4])$/;
const REGEX_DATA_MONTH = /^data_month_(\d{4})_m(\d{1,2})$/;
const REGEX_DATA_YEAR = /^data_year_(\d{4})$/;
const REGEX_BARE_YEAR = /^(\d{4})$/;
const REGEX_ANY_YEAR_TOKEN = /(?:data_year_|data_quarter_|data_month_)(\d{4})/;
const REGEX_UNDERSCORE_YEAR = /_(\d{4})/;
const REGEX_MULTI_SPLIT = /[,;]/;
const REGEX_RANGE_INPUT_SPLIT = /[;\u2014]|\.\.|\s-\s/;
const REGEX_TIME_HM = /(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?/;

const ROMAN_QUARTERS: Record<number, string> = {
  1: 'I',
  2: 'II',
  3: 'III',
  4: 'IV',
};

function pad2(n: number | string): string {
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

function resolveMinYearFromContext(
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
      {label && <span className="text-[11px] text-[var(--agv-text-subtle)] font-medium mr-1">{label}:</span>}
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

export interface AdvDatePresetSelectProps {
  value?: string;
  defaultOpen?: boolean;
  onSelect?: (presetId: string, isMulti?: boolean) => void;
  dateAnalysis?: any;
  label?: string;
  theme?: 'light' | 'dark' | 'bezier-arthouse' | 'e-ink' | string;
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
  theme = 'bezier-arthouse',
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
                                  const romanQ = ROMAN_QUARTERS[qOfM];
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
            <div className="w-[26px]" />
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
            <div className="w-[26px]" />
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

export interface AdvDateRangePickerProps {
  from?: string;
  to?: string;
  onChange?: (range: { from: string; to: string; preset?: string }) => void;
  min?: string;
  max?: string;
  placeholderFrom?: string;
  placeholderTo?: string;
  theme?: 'light' | 'dark' | 'bezier-arthouse' | 'e-ink' | 'eink' | string;
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
  theme = 'bezier-arthouse',
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

  const sizeClass = size === 'xs' ? 'is-xs' : size === 'sm' ? 'is-sm' : 'is-md';

  return (
    <div className={`agv-daterange-picker-wrap ${className}`} ref={triggerRef}>
      <div
        className={`agv-daterange-bar ${getGridControlRadiusClass()} ${isOpen ? 'is-focused' : ''} ${sizeClass}`}
        onClick={() => (isOpen ? closePopover() : openCalendar())}
      >
        {presetValue ? (
          <div className="agv-daterange-segment flex w-full items-center justify-center overflow-hidden px-1">
            <span
              className="truncate text-[11px] font-semibold text-[var(--agv-text-main)]"
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
              className="agv-daterange-text text-center font-medium"
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
                className="agv-daterange-text text-center font-medium"
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
                className="agv-daterange-text text-center font-medium"
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
            className="agv-datepicker-clear-btn"
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
              boxShadow: '0 12px 28px -4px rgba(0, 0, 0, 0.25), 0 8px 12px -6px rgba(0, 0, 0, 0.15)',
            }}
            className={`agv-calendar-popover agv-daterange-popover ${
              coords.isFlipUp ? 'agv-spring-up' : 'agv-spring-down'
            } ${dualMonth ? 'is-dual' : ''} ${getThemeClass(theme)}`}
            data-theme={theme}
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
                  label="Mốc nhanh:"
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
  theme?: 'light' | 'dark' | 'bezier-arthouse' | 'e-ink' | 'eink' | string;
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
  theme = 'bezier-arthouse',
  size = 'default',
  showPreset = true,
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
    if (propPreset !== undefined) {
      setPresetValue(propPreset);
    }
  }, [propPreset]);

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
    if (presetValue) {
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
  }, [value, presetValue, showTime, parsedCurrentDate]);

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
    if (REGEX_BARE_YEAR.test(raw)) {
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
  }, [isOpen, inputText, presetValue, effMinYMD, effMaxYMD, value, showTime, emitChange]);

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

  const sizeClass = size === 'xs' ? 'is-xs' : size === 'sm' ? 'is-sm' : 'is-md';

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
            className="agv-datepicker-clear-btn"
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
              boxShadow: '0 12px 28px -4px rgba(0, 0, 0, 0.25), 0 8px 12px -6px rgba(0, 0, 0, 0.15)',
            }}
            className={`agv-calendar-popover ${
              coords.isFlipUp ? 'agv-spring-up' : 'agv-spring-down'
            } ${showPreset ? 'agv-has-preset agv-daterange-popover' : ''} ${getThemeClass(theme)}`}
            data-theme={theme}
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
                  label="Mốc nhanh:"
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