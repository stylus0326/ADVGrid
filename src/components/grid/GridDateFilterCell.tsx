import React from 'react';
import { AdvDatePicker, AdvDateRangePicker } from '../ui/AdvDatePicker';
import { isBetweenFilterOp } from './gridFormatUtils';
import type { ColumnDef, FilterOperation, SurfaceTheme } from './types';

export interface GridDateFilterCellProps<T = any> {
  col: ColumnDef<T>;
  inputVal: string;
  currentOp: FilterOperation;
  placeholderText: string;
  surfaceTheme?: SurfaceTheme;
  getColumnDateBounds?: (colKey: string) => { min: string; max: string };
  onCommitValue: (colKey: string, val: string) => void;
}

export const GridDateFilterCell: React.FC<GridDateFilterCellProps> = ({
  col,
  inputVal,
  currentOp,
  placeholderText,
  surfaceTheme,
  getColumnDateBounds,
  onCommitValue,
}) => {
  const dateBounds =
    col.minDate && col.maxDate
      ? { min: col.minDate, max: col.maxDate }
      : getColumnDateBounds?.(col.key) || { min: '2017-01-01', max: '2027-12-31' };

  if (col.isDateRange || isBetweenFilterOp(currentOp)) {
    let rangeFrom = '';
    let rangeTo = '';
    if (inputVal.includes('..')) {
      const parts = inputVal.split('..');
      rangeFrom = parts[0]?.trim() || '';
      rangeTo = parts[1]?.trim() || '';
    } else if (inputVal.includes(' - ')) {
      const parts = inputVal.split(' - ');
      rangeFrom = parts[0]?.trim() || '';
      rangeTo = parts[1]?.trim() || '';
    } else if (inputVal.trim()) {
      rangeFrom = inputVal.trim();
      rangeTo = inputVal.trim();
    }

    return (
      <div className="w-full h-full agv-filter-datepicker flex items-center">
        <AdvDateRangePicker
          from={rangeFrom}
          to={rangeTo}
          onChange={(range) => {
            const f = range.from || '';
            const t = range.to || '';
            const combined = f && t ? `${f}..${t}` : f ? `${f}..` : t ? `..${t}` : '';
            onCommitValue(col.key, combined);
          }}
          min={dateBounds.min}
          max={dateBounds.max}
          placeholderFrom={col.isDateRange ? 'Ngày đi' : 'Từ'}
          placeholderTo={col.isDateRange ? 'Ngày về' : 'Đến'}
          theme={surfaceTheme}
          size="xs"
          showPreset={true}
          dualMonth={false}
          showTime={Boolean(col.showTime)}
        />
      </div>
    );
  }

  return (
    <div className="w-full h-full agv-filter-datepicker flex items-center">
      <AdvDatePicker
        value={inputVal}
        onChange={(val, range) => {
          if (range && range.from && range.to && range.from !== range.to) {
            onCommitValue(col.key, `${range.from}..${range.to}`);
          } else {
            onCommitValue(col.key, val);
          }
        }}
        min={dateBounds.min}
        max={dateBounds.max}
        placeholder={placeholderText}
        showTime={Boolean(col.showTime)}
        theme={surfaceTheme}
        showPreset={true}
        size="xs"
        className="w-full h-full"
      />
    </div>
  );
};
