import React from 'react';
import { Calendar, Clock, Check, ChevronRight, ChevronDown, ChevronLeft, ArrowRight } from 'lucide-react';
import { GridTheme } from '../../themes';
import { getThemeClass, MONTH_LABELS, MONTH_SHORT_LABELS, CALENDAR_WEEKDAYS, formatDateToYMD, parseDateToTimestamp, formatDisplayDate, formatGridDateValue, parseDMYToDate, computePresetDateRange, normalizePresetList, getPresetLabel, isDateDisabledHelper, shiftMonth, CalendarCellItem, buildCalendarCells, usePopupDismiss, computeDropdownMenuCoords, computeCalendarCoords } from './datepicker/datePickerUtils';
import { TimePickerBlock, TimePickerBlockProps, AdvDevExpressCalendarBody, AdvDevExpressCalendarBodyProps } from './datepicker/AdvCalendarPrimitives';
import { AdvDatePresetSelect, AdvDatePresetSelectProps } from './datepicker/AdvDatePresetSelect';
import { AdvDateRangePicker, AdvDateRangePickerProps } from './datepicker/AdvDateRangePicker';
export { Calendar, Clock, Check, ChevronRight, ChevronDown, ChevronLeft, ArrowRight, getThemeClass, MONTH_LABELS, MONTH_SHORT_LABELS, CALENDAR_WEEKDAYS, formatDateToYMD, parseDateToTimestamp, formatDisplayDate, formatGridDateValue, parseDMYToDate, computePresetDateRange, normalizePresetList, getPresetLabel, isDateDisabledHelper, shiftMonth, buildCalendarCells, usePopupDismiss, computeDropdownMenuCoords, computeCalendarCoords, TimePickerBlock, AdvDevExpressCalendarBody, AdvDatePresetSelect, AdvDateRangePicker, };
export type { CalendarCellItem, TimePickerBlockProps, AdvDevExpressCalendarBodyProps, AdvDatePresetSelectProps, AdvDateRangePickerProps, };
export interface AdvDatePickerProps {
    value?: string;
    preset?: string;
    onChange?: (val: string, range?: {
        from: string;
        to: string;
        preset?: string;
    }) => void;
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
export declare const AdvDatePicker: React.NamedExoticComponent<AdvDatePickerProps>;
export { AdvDatePicker as DatePicker, AdvDateRangePicker as DateRangePicker, AdvDatePresetSelect as DatePresetSelect, AdvDatePicker as App, };
export default AdvDatePicker;
