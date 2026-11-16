import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  ColumnAlign,
  ColumnDef,
  DATA_TYPES,
  EDITOR_TYPES,
  SurfaceTheme,
} from '../types';
import { NO_AUTOFILL_PROPS, getGridControlRadiusClass } from '../constants';
import { AdvDatePicker, AdvDateRangePicker } from '../../ui/AdvDatePicker';
import { formatGridDateValue, formatGridNumber, getAlignTextClass, parseGridNumber } from '../gridFormatUtils';
import { handleNumericKeyDown, expandAllShortcuts } from '../smartNumberUtils';
import { AdvComboBoxEdit, AdvSearchLookUpEdit } from '../../ui';
import { CONTROL_BOX_CLASS, CONTROL_SURFACE_CLASS } from '../../ui/controlFocus';

const CellEditor: React.FC<{
  initialValue: string;
  align?: ColumnAlign;
  isNumeric?: boolean;
  onSave: (val: any) => void;
  onCancel: () => void;
}> = ({ initialValue, align, isNumeric, onSave, onCancel }) => {
  const [val, setVal] = useState(() => {
    if (isNumeric && initialValue !== undefined && initialValue !== null && initialValue !== '') {
      const num = parseGridNumber(initialValue);
      return !isNaN(num) ? formatGridNumber(num) : String(initialValue);
    }
    return String(initialValue ?? '');
  });
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus({ preventScroll: true });
      inputRef.current.select();
    }
  }, []);

  const commitValue = useCallback(() => {
    if (isNumeric) {
      const trimmed = val.trim();
      if (!trimmed) {
        onSave('');
        return;
      }
      const expanded = expandAllShortcuts(trimmed);
      const num = parseGridNumber(expanded);
      if (!isNaN(num)) {
        onSave(num);
      } else {
        // Chặn không lưu chữ cái rác vào cột số, khôi phục giá trị cũ
        onCancel();
      }
    } else {
      onSave(val);
    }
  }, [isNumeric, val, onSave, onCancel]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      commitValue();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      onCancel();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      e.stopPropagation();
      commitValue();
    } else if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown'].includes(e.key)) {
      // Chặn phím cuộn trang hoặc điều hướng dòng làm dịch chuyển vị trí bảng khi đang gõ
      e.preventDefault();
      e.stopPropagation();
    } else if (isNumeric) {
      handleNumericKeyDown(e);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    if (isNumeric) {
      const pasted = e.clipboardData.getData('text');
      const expanded = expandAllShortcuts(pasted.trim());
      const num = parseGridNumber(expanded);
      if (isNaN(num)) {
        e.preventDefault();
      }
    }
  };

  return (
    <input
      ref={inputRef}
      type="text"
      value={val}
      onChange={(e) => setVal(e.target.value)}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      onBlur={commitValue}
      {...NO_AUTOFILL_PROPS}
      className={`${CONTROL_SURFACE_CLASS} is-focused agv-incell-control w-full px-1.5 py-0 text-xs outline-none ${getGridControlRadiusClass()} text-[var(--agv-text-main)] font-sans tabular-nums ${getAlignTextClass(
        align
      )}`}
    />
  );
};

const DateCellEditor: React.FC<{
  initialValue: string;
  showTime?: boolean;
  theme?: SurfaceTheme;
  min?: string;
  max?: string;
  onSave: (val: string) => void;
  onCancel: () => void;
}> = ({ initialValue, showTime, theme, min, max, onSave, onCancel }) => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <AdvDatePicker
        value={initialValue}
        showTime={showTime}
        theme={theme}
        min={min}
        max={max}
        showPreset={false}
        defaultOpen={true}
        autoFocus={false}
        allowClear={false}
        size="sm"
        onClose={onCancel}
        onChange={(val) => {
          onSave(formatGridDateValue(val, showTime));
        }}
        className="w-full h-full agv-incell-datepicker"
      />
    </div>
  );
};

const DateRangeCellEditor: React.FC<{
  initialValue: string;
  theme?: SurfaceTheme;
  min?: string;
  max?: string;
  onSave: (val: string) => void;
  onCancel: () => void;
}> = ({ initialValue, theme, min, max, onSave, onCancel }) => {
  let rangeFrom = '';
  let rangeTo = '';
  if (initialValue.includes('..')) {
    const parts = initialValue.split('..');
    rangeFrom = parts[0]?.trim() || '';
    rangeTo = parts[1]?.trim() || '';
  } else if (initialValue.includes(' - ')) {
    const parts = initialValue.split(' - ');
    rangeFrom = parts[0]?.trim() || '';
    rangeTo = parts[1]?.trim() || '';
  } else {
    rangeFrom = initialValue.trim();
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <AdvDateRangePicker
        from={rangeFrom}
        to={rangeTo}
        min={min}
        max={max}
        placeholderFrom="Ngày đi"
        placeholderTo="Ngày về"
        theme={theme}
        size="sm"
        showPreset={false}
        dualMonth={false}
        defaultOpen={true}
        autoFocus={false}
        allowClear={false}
        onClose={onCancel}
        onChange={(r) => {
          // Chỉ hoàn tất lưu khi người dùng đã chọn đủ cả 2 mốc (ngày đi - ngày về)
          if (r.from && r.to) {
            const f = formatGridDateValue(r.from, false);
            const t = formatGridDateValue(r.to, false);
            onSave(`${f} - ${t}`);
          }
        }}
        className="w-full h-full agv-incell-datepicker"
      />
    </div>
  );
};

/**
 * Component chỉnh sửa ô giờ in-cell (HH:mm)
 * Nhập 2 số giờ -> tự nhảy phút, phím mũi tên tăng giảm, Enter/Click outside lưu, Esc hủy, zero autofill, min-h 28px
 */
const TimeCellEditor: React.FC<{
  initialValue: string;
  onSave: (val: string) => void;
  onCancel: () => void;
}> = ({ initialValue, onSave, onCancel }) => {
  const parsed = useMemo(() => {
    const m = (initialValue || '').match(/(\d{1,2}):(\d{2})/);
    if (m) {
      return {
        h: m[1].padStart(2, '0'),
        m: m[2].padStart(2, '0'),
      };
    }
    return { h: '00', m: '00' };
  }, [initialValue]);

  const [hours, setHours] = useState(parsed.h);
  const [minutes, setMinutes] = useState(parsed.m);
  const hRef = useRef<HTMLInputElement>(null);
  const mRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    hRef.current?.focus({ preventScroll: true });
    hRef.current?.select();
  }, []);

  const commitAndSave = useCallback(() => {
    let hNum = parseInt(hours, 10);
    if (isNaN(hNum) || hNum < 0) hNum = 0;
    if (hNum > 23) hNum = 23;
    let mNum = parseInt(minutes, 10);
    if (isNaN(mNum) || mNum < 0) mNum = 0;
    if (mNum > 59) mNum = 59;
    const finalVal = `${String(hNum).padStart(2, '0')}:${String(mNum).padStart(2, '0')}`;
    onSave(finalVal);
  }, [hours, minutes, onSave]);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        commitAndSave();
      }
    };
    document.addEventListener('mousedown', handleOutside, true);
    return () => document.removeEventListener('mousedown', handleOutside, true);
  }, [commitAndSave]);

  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 2);
    setHours(val);
    if (val.length === 2 || parseInt(val, 10) > 2) {
      mRef.current?.focus({ preventScroll: true });
      mRef.current?.select();
    }
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 2);
    setMinutes(val);
  };

  const handleHourKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      commitAndSave();
    } else if (e.key === 'Escape') {
      onCancel();
    } else if (e.key === 'ArrowRight') {
      mRef.current?.focus({ preventScroll: true });
      mRef.current?.select();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      let hNum = (parseInt(hours, 10) || 0) + 1;
      if (hNum > 23) hNum = 0;
      setHours(String(hNum).padStart(2, '0'));
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      let hNum = (parseInt(hours, 10) || 0) - 1;
      if (hNum < 0) hNum = 23;
      setHours(String(hNum).padStart(2, '0'));
    }
  };

  const handleMinuteKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      commitAndSave();
    } else if (e.key === 'Escape') {
      onCancel();
    } else if (e.key === 'ArrowLeft') {
      hRef.current?.focus({ preventScroll: true });
      hRef.current?.select();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      let mNum = (parseInt(minutes, 10) || 0) + 1;
      if (mNum > 59) mNum = 0;
      setMinutes(String(mNum).padStart(2, '0'));
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      let mNum = (parseInt(minutes, 10) || 0) - 1;
      if (mNum < 0) mNum = 59;
      setMinutes(String(mNum).padStart(2, '0'));
    }
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex items-center justify-center"
      style={{ minHeight: '28px' }}
    >
      <div
        className={`${CONTROL_BOX_CLASS} is-focused agv-incell-control w-full inline-flex items-center justify-center px-2 py-0 ${getGridControlRadiusClass()}`}
      >
        <input
          ref={hRef}
          type="text"
          maxLength={2}
          value={hours}
          onChange={handleHourChange}
          onKeyDown={handleHourKeyDown}
          {...NO_AUTOFILL_PROPS}
          className="w-5 text-center text-xs font-semibold bg-transparent outline-none border-none p-0"
          style={{ color: 'var(--agv-text-main)' }}
        />
        <span className="text-xs font-bold px-0.5 select-none" style={{ color: 'var(--agv-text-muted)' }}>
          :
        </span>
        <input
          ref={mRef}
          type="text"
          maxLength={2}
          value={minutes}
          onChange={handleMinuteChange}
          onKeyDown={handleMinuteKeyDown}
          {...NO_AUTOFILL_PROPS}
          className="w-5 text-center text-xs font-semibold bg-transparent outline-none border-none p-0"
          style={{ color: 'var(--agv-text-main)' }}
        />
      </div>
    </div>
  );
};

export interface GridInCellEditorProps<T = any> {
  column: ColumnDef<T>;
  row: T;
  rowIndex: number;
  initialValue: string;
  surfaceTheme: SurfaceTheme;
  getColumnDateBounds?: (colKey: string) => { min: string; max: string };
  onCellChange?: (rowIndex: number, row: T, colKey: string, newValue: any) => void;
  onEndEditCell?: () => void;
}

export function GridInCellEditor<T>({
  column,
  row,
  rowIndex,
  initialValue,
  surfaceTheme,
  getColumnDateBounds,
  onCellChange,
  onEndEditCell,
}: GridInCellEditorProps<T>) {
  if (column.editorType === EDITOR_TYPES.DATERANGE || column.isDateRange) {
    const bounds =
      column.minDate && column.maxDate
        ? { min: column.minDate, max: column.maxDate }
        : getColumnDateBounds?.(column.key) || { min: '2017-01-01', max: '2027-12-31' };

    return (
      <DateRangeCellEditor
        initialValue={initialValue}
        theme={surfaceTheme}
        min={bounds.min}
        max={bounds.max}
        onSave={(newVal) => {
          onCellChange?.(rowIndex, row, column.key, newVal);
          onEndEditCell?.();
        }}
        onCancel={() => {
          onEndEditCell?.();
        }}
      />
    );
  }

  if (column.editorType === EDITOR_TYPES.TIME || column.dataType === DATA_TYPES.TIME) {
    return (
      <TimeCellEditor
        initialValue={initialValue}
        onSave={(newVal) => {
          onCellChange?.(rowIndex, row, column.key, newVal);
          onEndEditCell?.();
        }}
        onCancel={() => {
          onEndEditCell?.();
        }}
      />
    );
  }

  if (column.editorType === EDITOR_TYPES.DATE || column.dataType === DATA_TYPES.DATE) {
    const bounds =
      column.minDate && column.maxDate
        ? { min: column.minDate, max: column.maxDate }
        : getColumnDateBounds?.(column.key) || { min: '2017-01-01', max: '2027-12-31' };

    return (
      <DateCellEditor
        initialValue={initialValue}
        showTime={Boolean(column.showTime)}
        theme={surfaceTheme}
        min={bounds.min}
        max={bounds.max}
        onSave={(newVal) => {
          onCellChange?.(rowIndex, row, column.key, newVal);
          onEndEditCell?.();
        }}
        onCancel={() => {
          onEndEditCell?.();
        }}
      />
    );
  }

  if (column.editorType === EDITOR_TYPES.COMBOBOX) {
    const comboOpts = column.editorOptions || {};
    return (
      <div className="w-full h-full flex items-center justify-center">
        <AdvComboBoxEdit
          value={initialValue}
          options={comboOpts.options || []}
          allowCustomInput={
            comboOpts.allowCustomInput !== undefined ? comboOpts.allowCustomInput : true
          }
          defaultOpen={true}
          autoFocus={true}
          theme={surfaceTheme}
          size="sm"
          className="w-full agv-incell-control"
          onChange={(newVal) => {
            onCellChange?.(rowIndex, row, column.key, newVal);
            onEndEditCell?.();
          }}
          onClose={() => {
            onEndEditCell?.();
          }}
        />
      </div>
    );
  }

  if (column.editorType === EDITOR_TYPES.LOOKUP) {
    const lookupOpts = column.editorOptions || {};
    return (
      <div className="w-full h-full flex items-center justify-center">
        <AdvSearchLookUpEdit
          value={initialValue}
          valueMember={lookupOpts.valueMember || 'id'}
          displayMember={lookupOpts.displayMember || 'id'}
          dataSource={lookupOpts.dataSource || []}
          columns={lookupOpts.columns || []}
          multiSelect={Boolean(lookupOpts.multiSelect)}
          defaultOpen={true}
          theme={surfaceTheme}
          dropdownWidth={lookupOpts.dropdownWidth || 420}
          className="w-full agv-incell-control"
          onChange={(newVal) => {
            onCellChange?.(rowIndex, row, column.key, newVal);
            onEndEditCell?.();
          }}
          onClose={() => {
            onEndEditCell?.();
          }}
        />
      </div>
    );
  }

  return (
    <CellEditor
      initialValue={initialValue}
      align={column.align}
      isNumeric={column.dataType === DATA_TYPES.NUMBER || column.key.startsWith('col_m')}
      onSave={(newVal) => {
        onCellChange?.(rowIndex, row, column.key, newVal);
        onEndEditCell?.();
      }}
      onCancel={() => {
        onEndEditCell?.();
      }}
    />
  );
}

export default GridInCellEditor;
