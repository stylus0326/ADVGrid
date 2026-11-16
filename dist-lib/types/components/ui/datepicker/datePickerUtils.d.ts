import React from 'react';
import { getThemeClass } from '../../../themes';
export { getThemeClass };
export declare const MONTH_LABELS: string[];
export declare const MONTH_SHORT_LABELS: string[];
export declare const CALENDAR_WEEKDAYS: {
    label: string;
    isWeekend: boolean;
}[];
export declare const REGEX_DMY_DATETIME: RegExp;
export declare const REGEX_YMD_DATETIME: RegExp;
export declare const REGEX_YMD_DATE: RegExp;
export declare const REGEX_DMY_OPT_YEAR: RegExp;
export declare const REGEX_DMY_STRICT: RegExp;
export declare const REGEX_DM_ONLY: RegExp;
export declare const REGEX_DATA_WEEK: RegExp;
export declare const REGEX_DATA_QUARTER: RegExp;
export declare const REGEX_DATA_MONTH: RegExp;
export declare const REGEX_DATA_YEAR: RegExp;
export declare const REGEX_BARE_YEAR: RegExp;
export declare const REGEX_ANY_YEAR_TOKEN: RegExp;
export declare const REGEX_UNDERSCORE_YEAR: RegExp;
export declare const REGEX_MULTI_SPLIT: RegExp;
export declare const REGEX_RANGE_INPUT_SPLIT: RegExp;
export declare const REGEX_TIME_HM: RegExp;
export declare const ROMAN_QUARTERS: Record<number, string>;
export declare function pad2(n: number | string): string;
export declare function formatDateToYMD(d: Date | null | undefined, includeTime?: boolean): string;
export declare function parseDateToTimestamp(str: unknown, isEndOfDay?: boolean): number | null;
export { formatDisplayDate, formatGridDateValue } from '../../grid/gridFormatUtils';
export declare function parseDMYToDate(str: unknown, fallbackYear?: number): Date | null;
export declare function computePresetDateRange(presetId: string, customYear?: number): {
    from: string;
    to: string;
};
export declare function getISOWeekAndYear(date: Date): {
    week: number;
    year: number;
};
export declare function getISOWeekDateRange(isoYear: number, week: number): {
    from: string;
    to: string;
};
export declare function normalizePresetList(list: string[]): string[];
export declare function getPresetLabel(presetId: string, customYear?: number): string;
export declare function isDateDisabledHelper(dateOrTs: Date | number, minTs: number | null, maxTs: number | null): boolean;
export declare function shiftMonth(m: number, y: number, delta: number): {
    month: number;
    year: number;
};
export interface CalendarCellItem {
    date: Date;
    dayNum: number;
    isCurrentMonth: boolean;
    ts: number;
    isWeekend: boolean;
}
export declare function buildCalendarCells(navYear: number, navMonth: number): CalendarCellItem[];
export declare function usePopupDismiss(isOpen: boolean, onClose: () => void, onUpdateCoords?: () => void, triggerRef?: React.RefObject<HTMLElement | null>, popupRef?: React.RefObject<HTMLElement | null>): void;
export declare function computeDropdownMenuCoords(triggerEl: HTMLElement | null, preferredHeight?: number, minWidth?: number): {
    top: number;
    left: number;
    bottom: number;
    width: number;
    maxHeight: number;
    isFlipUp: boolean;
};
export declare function computeCalendarCoords(triggerEl: HTMLElement | null, calWidth?: number, calHeight?: number): {
    top: number;
    left: number;
    bottom: number;
    isFlipUp: boolean;
};
export declare function resolveMinYearFromContext(minYearProp?: number, minStr?: string, dateAnalysis?: any, bounds?: any): number;
