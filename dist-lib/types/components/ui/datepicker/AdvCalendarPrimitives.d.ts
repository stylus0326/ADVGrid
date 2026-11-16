import React from 'react';
import { CalendarCellItem } from './datePickerUtils';
export interface TimePickerBlockProps {
    hours: number;
    minutes: number;
    onChangeTime: (h: number, m: number) => void;
    label?: string;
}
export declare const TimePickerBlock: React.NamedExoticComponent<TimePickerBlockProps>;
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
    getMonthRangeStatus?: (year: number, month: number) => {
        isStart: boolean;
        isEnd: boolean;
        inRange: boolean;
        isSelected: boolean;
    };
    isYearSelected?: (year: number) => boolean;
    hideNavLeft?: boolean;
    hideNavRight?: boolean;
    onPrevMonth?: () => void;
    onNextMonth?: () => void;
}
export declare const AdvDevExpressCalendarBody: React.NamedExoticComponent<AdvDevExpressCalendarBodyProps>;
