import React, { memo, useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  ColumnDef,
  PinPosition,
  PIN_POSITIONS,
  ColumnAlign,
  ALIGNMENTS,
  DATA_TYPES,
  EDITOR_TYPES,
  CenterDockStatus,
  CENTER_DOCK_STATUSES,
  SurfaceTheme,
  CellRenderParams,
  GRID_EDIT_MODES,
  GridEditMode,
} from './types';
import {
  getPinnedDividerClass,
  getRightPinnedDividerClass,
  getThemeClasses,
  NO_AUTOFILL_PROPS,
  getGridControlRadiusClass,
} from './constants';
import { AdvDatePicker, AdvDateRangePicker, formatGridDateValue } from '../ui/AdvDatePicker';
import { formatGridNumber, getAlignTextClass, getAlignJustifyClass, parseGridNumber, isSelectionColumn } from './gridUtils';
import { handleNumericKeyDown, expandAllShortcuts } from './smartNumberUtils';
import { AdvComboBoxEdit, AdvSearchLookUpEdit, AdvLookUpColumn, AdvComboBoxEditOption } from '../ui';
import { MorphChevronIcon } from '../ui/MorphIcons';

const STATUS_COMBO_OPTIONS: AdvComboBoxEditOption[] = [
  { value: 'Healthy', label: 'Healthy (Bình thường)' },
  { value: 'Warning', label: 'Warning (Cảnh báo)' },
  { value: 'Critical', label: 'Critical (Nguy cấp)' },
  { value: 'Maintenance', label: 'Maintenance (Bảo trì)' },
  { value: 'Pending', label: 'Pending (Đang chờ)' },
];

interface RegionLookupItem {
  id: string;
  name: string;
  country: string;
  ping: string;
}

const REGION_LOOKUP_DATA: RegionLookupItem[] = [
  { id: 'VN-HAN-02', name: 'Hà Nội DC', country: 'Việt Nam', ping: '4ms' },
  { id: 'VN-SGN-01', name: 'Sài Gòn DC', country: 'Việt Nam', ping: '16ms' },
  { id: 'SG-SIN-01', name: 'Singapore DC', country: 'Singapore', ping: '38ms' },
  { id: 'JP-TYO-03', name: 'Tokyo DC', country: 'Nhật Bản', ping: '65ms' },
  { id: 'US-WST-02', name: 'Silicon Valley', country: 'Hoa Kỳ', ping: '160ms' },
  { id: 'DE-FRA-01', name: 'Frankfurt DC', country: 'Đức', ping: '185ms' },
];

const REGION_LOOKUP_COLUMNS: AdvLookUpColumn<RegionLookupItem>[] = [
  { key: 'id', title: 'Mã Vùng', width: 105, className: 'agv-cell-code' },
  { key: 'name', title: 'Trung Tâm', width: 120 },
  { key: 'country', title: 'Quốc Gia', width: 90 },
  { key: 'ping', title: 'Độ Trễ', width: 65, align: ALIGNMENTS.RIGHT },
];

export interface GridRowProps<T = any> {
  row: T;
  rowIndex: number;
  columns: ColumnDef<T>[];
  colWidths: Record<string, number>;
  rowHeight: number;
  isSelected: boolean;
  isChecked: boolean;
  onSelectRow?: (rowIndex: number, row: T) => void;
  onToggleCheck?: (rowIndex: number, row: T, e: React.MouseEvent) => void;
  onCellContextMenu?: (rowIndex: number, row: T, colKey: string, e: React.MouseEvent) => void;
  onGroupContextMenu?: (groupRow: any, e: React.MouseEvent) => void;
  surfaceTheme: SurfaceTheme;
  columnPins: Record<string, PinPosition>;
  leftOffsets: Record<string, number>;
  rightOffsets: Record<string, number>;
  lastEffectiveLeftColKey: string | null;
  firstEffectiveRightColKey: string | null;
  centerDockStatus: Record<string, CenterDockStatus>;
  centerLeftOffsets: Record<string, number>;
  centerRightOffsets: Record<string, number>;
  renderCell?: (params: CellRenderParams<T>) => React.ReactNode;
  editMode?: GridEditMode;
  editingCell?: { rowIndex: number; colKey: string } | null;
  onStartEditCell?: (rowIndex: number, colKey: string) => void;
  onEndEditCell?: () => void;
  onCellChange?: (rowIndex: number, row: T, colKey: string, newValue: any) => void;
  getColumnDateBounds?: (colKey: string) => { min: string; max: string };
  emptyColKeys?: Set<string>;
}

const isCellEditable = (col: ColumnDef<any>): boolean => {
  if (col.editable === false || col.dataType === DATA_TYPES.SYSTEM) return false;
  return true;
};

const getRawCellValue = (row: any, colKey: string): string => {
  if (row?.cells instanceof Map) {
    const c = row.cells.get(colKey);
    return c?.value !== undefined ? String(c.value) : '';
  }
  if (row?.[colKey] !== undefined) {
    return String(row[colKey]);
  }
  return '';
};

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
      className={`w-full h-full min-h-[28px] max-h-[30px] px-1.5 py-0 text-xs outline-none border-2 border-agv-accent ${getGridControlRadiusClass()} bg-[var(--agv-bg-root)] text-[var(--agv-text-main)] font-sans tabular-nums ${getAlignTextClass(
        align
      )}`}
    />
  );
};

const DateCellEditor: React.FC<{
  initialValue: string;
  showTime?: boolean;
  theme?: string;
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
  theme?: string;
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
  theme?: string;
  onSave: (val: string) => void;
  onCancel: () => void;
}> = ({ initialValue, theme, onSave, onCancel }) => {
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
        className={`w-full h-full inline-flex items-center justify-center px-2 py-0 ${getGridControlRadiusClass()} border-2 border-agv-accent`}
        style={{
          background: 'var(--agv-bg-root, var(--agv-bg-subtle, #ffffff))',
          minHeight: '28px',
          maxHeight: '30px',
        }}
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

export const GridRow = memo(
  <T extends any>({
    row,
    rowIndex,
    columns,
    colWidths,
    rowHeight,
    isSelected,
    isChecked,
    onSelectRow,
    onToggleCheck,
    surfaceTheme,
    columnPins,
    leftOffsets,
    rightOffsets,
    lastEffectiveLeftColKey,
    firstEffectiveRightColKey,
    centerDockStatus,
    centerLeftOffsets,
    centerRightOffsets,
    renderCell,
    onCellContextMenu,
    onGroupContextMenu,
    editMode = GRID_EDIT_MODES.VIEW,
    editingCell,
    onStartEditCell,
    onEndEditCell,
    onCellChange,
    getColumnDateBounds,
    emptyColKeys,
  }: GridRowProps<T>) => {
    const isEven = rowIndex % 2 === 0;
    const isRowActive = isSelected || isChecked;
    const theme = getThemeClasses(surfaceTheme);

    const baseBg = isRowActive
      ? theme.rowSelectedBg
      : isEven
      ? theme.rowEvenBg
      : theme.rowOddBg;

    const totalRowWidth = columns.reduce(
      (acc, col) => acc + (colWidths[col.key] || col.defaultWidth),
      0
    );

    // Xử lý dòng tiêu đề gom nhóm (Group Header Row)
    if ((row as any)?._isGroupRow) {
      const g = row as any;
      const isCollapsed = Boolean(g.isCollapsed);

      // Kiểm tra có cột STT ở đầu hay không để hiển thị Bộ Đếm Chỉ Số Nhóm [1], [2] chuẩn Toolbar3
      const firstCol = columns[0];
      const hasSttCol = Boolean(firstCol && (firstCol.isRowNumber || (firstCol.dataType === DATA_TYPES.SYSTEM && Boolean(firstCol.title))));
      const sttKey = firstCol?.key || '';
      const sttWidth = hasSttCol && sttKey ? (colWidths[sttKey] || firstCol?.defaultWidth || 44) : 0;

      // Tính toán vùng ghim trái (nếu có)
      const pinnedLeftCols = columns.filter(
        (c) => columnPins[c.key] === PIN_POSITIONS.LEFT || c.dataType === DATA_TYPES.SYSTEM || c.isRowNumber || c.isSelection
      );
      const pinnedLeftWidth = pinnedLeftCols.reduce(
        (acc, c) => acc + (colWidths[c.key] || c.defaultWidth),
        0
      );

      // Ô tiêu đề nhóm bắt đầu từ cột tiếp theo sau STT (nếu có STT)
      const titleStartIdx = hasSttCol ? 1 : 0;
      let titleColSpan = 1;
      let titleWidth = hasSttCol ? (pinnedLeftWidth - sttWidth) : pinnedLeftWidth;

      if (titleWidth <= 0 || pinnedLeftCols.length <= titleStartIdx) {
        titleWidth = colWidths[columns[titleStartIdx]?.key] || columns[titleStartIdx]?.defaultWidth || 180;
        let accum = titleWidth;
        titleColSpan = 1;
        while (titleStartIdx + titleColSpan < columns.length) {
          const nextCol = columns[titleStartIdx + titleColSpan];
          if (g.groupSums?.[nextCol.key] !== undefined || nextCol.dataType === DATA_TYPES.NUMBER) {
            break;
          }
          if (accum >= 220) {
            break;
          }
          accum += colWidths[nextCol.key] || nextCol.defaultWidth;
          titleColSpan++;
        }
        titleWidth = accum;
      } else {
        titleColSpan = pinnedLeftCols.length - titleStartIdx;
      }

      return (
        <div
          onClick={(e) => {
            e.stopPropagation();
            g.onToggleCollapse?.(g.path);
          }}
          onContextMenu={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onGroupContextMenu?.(g, e);
          }}
          style={{
            height: `${rowHeight}px`,
            width: `${totalRowWidth}px`,
            backgroundColor: 'var(--agv-bg-card, rgba(0,0,0,0.03))',
            borderColor: 'var(--agv-border)',
            animationDelay: `${(rowIndex % 20) * 4}ms`,
          }}
          className="agv-row-enter group flex items-center cursor-pointer select-none box-border min-h-[32px] max-h-[32px] font-semibold text-xs border-b border-[var(--agv-border)] transition-colors hover:bg-[var(--agv-bg-hover)]"
        >
          {columns.map((col, cIdx) => {
            // Cột đầu tiên là STT (Bộ đếm nhóm [1], [2]...)
            if (hasSttCol && (col.key === sttKey || cIdx === 0)) {
              const isPinned = pinnedLeftWidth > 0;
              return (
                <div
                  key="group_stt_cell"
                  style={{
                    position: isPinned ? 'sticky' : undefined,
                    left: 0,
                    zIndex: isPinned ? 23 : undefined,
                    width: `${sttWidth}px`,
                    minWidth: `${sttWidth}px`,
                    maxWidth: `${sttWidth}px`,
                    height: `${rowHeight}px`,
                    boxSizing: 'border-box',
                    backgroundColor: 'var(--agv-bg-card, var(--agv-bg-root))',
                  }}
                  className={`flex items-center justify-center font-bold text-xs shrink-0 select-none ${theme.borderBottom} ${theme.borderRight}`}
                >
                  <span style={{ color: 'var(--agv-text-muted)' }}>
                    [{g.groupIndexStr || g.groupIndex || 1}]
                  </span>
                </div>
              );
            }

            // Các cột nằm trong khoảng gộp của tiêu đề nhóm thì bỏ qua (không render trùng)
            if (cIdx > titleStartIdx && cIdx < titleStartIdx + titleColSpan) {
              return null;
            }

            // Cột tiêu đề nhóm (Render ô tiêu đề với Chevron + Tên nhóm + Bộ đếm dòng)
            if (cIdx === titleStartIdx) {
              const isPinned = pinnedLeftWidth > 0;
              const hasDivider = (titleWidth + (hasSttCol ? sttWidth : 0)) === pinnedLeftWidth;
              const titleLeftPos = hasSttCol ? sttWidth : 0;
              return (
                <div
                  key="group_title_cell"
                  style={{
                    position: isPinned ? 'sticky' : undefined,
                    left: isPinned ? `${titleLeftPos}px` : undefined,
                    zIndex: isPinned ? 22 : undefined,
                    width: `${titleWidth}px`,
                    minWidth: `${titleWidth}px`,
                    maxWidth: `${titleWidth}px`,
                    height: `${rowHeight}px`,
                    boxSizing: 'border-box',
                    backgroundColor: 'var(--agv-bg-card, var(--agv-bg-root))',
                  }}
                  className={`flex items-center px-3 gap-2 truncate shrink-0 ${theme.borderBottom} ${
                    hasDivider ? getPinnedDividerClass(surfaceTheme) : theme.borderRight
                  }`}
                >
                  <span
                    className="w-4 h-4 flex items-center justify-center shrink-0 select-none rounded transition-colors hover:bg-agv-bg-hover text-agv-accent"
                  >
                    <MorphChevronIcon expanded={!isCollapsed} size={14} spring="bouncy" />
                  </span>
                  <span className="truncate font-bold text-agv-accent">
                    {g.groupValue || '(Trống)'}
                  </span>
                  <span
                    className="text-[11px] font-normal px-2 py-0.5 rounded-full border shrink-0 bg-agv-bg-root border-agv-border text-agv-text-muted"
                  >
                    {g.count.toLocaleString('vi-VN')}
                  </span>
                </div>
              );
            }

            // Các cột từ titleColSpan trở đi: Render ô đúng kích thước và vị trí chuẩn xác của từng cột
            const width = colWidths[col.key] || col.defaultWidth;
            const pinPos = columnPins[col.key] || PIN_POSITIONS.NONE;
            const isPinnedLeft = pinPos === PIN_POSITIONS.LEFT;
            const isPinnedRight = pinPos === PIN_POSITIONS.RIGHT;
            const isCenterPinned = pinPos === PIN_POSITIONS.CENTER;
            const dock = isCenterPinned ? centerDockStatus[col.key] || CENTER_DOCK_STATUSES.NORMAL : CENTER_DOCK_STATUSES.NORMAL;

            const isDockedLeft = dock === CENTER_DOCK_STATUSES.LEFT;
            const isDockedRight = dock === CENTER_DOCK_STATUSES.RIGHT;

            const isLeftDivider = col.key === lastEffectiveLeftColKey;
            const isRightDivider = col.key === firstEffectiveRightColKey;

            const stickyStyle: React.CSSProperties = {
              width: `${width}px`,
              minWidth: `${width}px`,
              maxWidth: `${width}px`,
              height: `${rowHeight}px`,
              boxSizing: 'border-box',
              ...(isPinnedLeft
                ? { position: 'sticky', left: `${leftOffsets[col.key]}px`, zIndex: 20 }
                : isDockedLeft
                ? { position: 'sticky', left: `${centerLeftOffsets[col.key]}px`, zIndex: 20 }
                : isPinnedRight
                ? { position: 'sticky', right: `${rightOffsets[col.key]}px`, zIndex: 20 }
                : isDockedRight
                ? { position: 'sticky', right: `${centerRightOffsets[col.key]}px`, zIndex: 20 }
                : {}),
            };

            const borderClasses = `${theme.borderBottom} ${
              isLeftDivider ? getPinnedDividerClass(surfaceTheme) : theme.borderRight
            } ${isRightDivider ? getRightPinnedDividerClass(surfaceTheme) : ''}`;

            const sumVal = g.groupSums?.[col.key];

            return (
              <div
                key={col.key}
                style={{
                  ...stickyStyle,
                  backgroundColor: 'var(--agv-bg-card, var(--agv-bg-root))',
                }}
                className={`flex items-center px-2.5 text-xs tabular-nums shrink-0 truncate ${borderClasses} ${getAlignJustifyClass(
                  col.align
                )}`}
              >
                {sumVal !== undefined ? (
                  <span className="font-semibold tabular-nums" style={{ color: 'var(--agv-text-main)' }}>
                    {formatGridNumber(sumVal)}
                  </span>
                ) : null}
              </div>
            );
          })}
        </div>
      );
    }

    return (
      <div
        onClick={() => onSelectRow?.(rowIndex, row)}
        data-row-focused={isSelected ? 'true' : undefined}
        data-row-checked={isChecked ? 'true' : undefined}
        style={{
          height: `${rowHeight}px`,
          width: `${totalRowWidth}px`,
          animationDelay: `${(rowIndex % 20) * 4}ms`,
        }}
        className={`agv-row-enter group flex items-center ${baseBg} ${theme.defaultTextColor} cursor-default select-none box-border min-h-[32px] max-h-[32px]`}
      >
        {columns.map((col) => {
          const width = colWidths[col.key] || col.defaultWidth;
          const pinPos = columnPins[col.key] || PIN_POSITIONS.NONE;
          const isPinnedLeft = pinPos === PIN_POSITIONS.LEFT;
          const isPinnedRight = pinPos === PIN_POSITIONS.RIGHT;
          const isCenterPinned = pinPos === PIN_POSITIONS.CENTER;
          const dock = isCenterPinned ? centerDockStatus[col.key] || CENTER_DOCK_STATUSES.NORMAL : CENTER_DOCK_STATUSES.NORMAL;

          const isDockedLeft = dock === CENTER_DOCK_STATUSES.LEFT;
          const isDockedRight = dock === CENTER_DOCK_STATUSES.RIGHT;

          const isEffectiveLeft = isPinnedLeft || isDockedLeft;
          const isEffectiveRight = isPinnedRight || isDockedRight;

          const isLeftDivider = col.key === lastEffectiveLeftColKey;
          const isRightDivider = col.key === firstEffectiveRightColKey;

          const isSttCol = Boolean(
            col.isRowNumber ||
              col.key === 'col_stt' ||
              (col.dataType === DATA_TYPES.SYSTEM && Boolean(col.title))
          );
          const isChkCol = isSelectionColumn(col);
          const cellRole = isSttCol ? 'stt' : isChkCol ? 'chk' : 'data';

          const usesSharedHeaderBg =
            isEffectiveLeft ||
            isEffectiveRight ||
            col.dataType === DATA_TYPES.SYSTEM ||
            isSttCol ||
            isChkCol;

          const stickyStyle: React.CSSProperties = {
            width: `${width}px`,
            height: `${rowHeight}px`,
            ...(isPinnedLeft
              ? { position: 'sticky', left: `${leftOffsets[col.key]}px`, zIndex: 20 }
              : isDockedLeft
              ? { position: 'sticky', left: `${centerLeftOffsets[col.key]}px`, zIndex: 20 }
              : isPinnedRight
              ? { position: 'sticky', right: `${rightOffsets[col.key]}px`, zIndex: 20 }
              : isDockedRight
              ? { position: 'sticky', right: `${centerRightOffsets[col.key]}px`, zIndex: 20 }
              : {}),
          };

          const borderClasses = `${theme.borderBottom} ${
            isLeftDivider ? getPinnedDividerClass(surfaceTheme) : theme.borderRight
          } ${isRightDivider ? getRightPinnedDividerClass(surfaceTheme) : ''}`;

          const isEmptyCol = !!emptyColKeys?.has(col.key);

          const cellBgClasses = isEmptyCol
            ? 'bg-[var(--agv-bg-card,rgba(0,0,0,0.02))] opacity-60'
            : isRowActive
            ? `${theme.rowSelectedBg} ${theme.rowHoverBg}`
            : usesSharedHeaderBg
            ? `${theme.sharedHeaderCellBg} ${theme.rowHoverBg}`
            : `${isEven ? theme.rowEvenBg : theme.rowOddBg} ${theme.rowHoverBg}`;

          const isEditing = !isEmptyCol && editingCell?.rowIndex === rowIndex && editingCell?.colKey === col.key;
          const editable = !isEmptyCol && isCellEditable(col);

          // Render content: priority to inline editor -> col.renderCell -> global renderCell -> default cell fallback
          let cellContent: React.ReactNode = null;
          if (isEditing) {
            if (col.editorType === EDITOR_TYPES.DATERANGE || col.isDateRange) {
              const bounds = col.minDate && col.maxDate
                ? { min: col.minDate, max: col.maxDate }
                : (getColumnDateBounds?.(col.key) || { min: '2017-01-01', max: '2027-12-31' });

              cellContent = (
                <DateRangeCellEditor
                  initialValue={getRawCellValue(row, col.key)}
                  theme={surfaceTheme}
                  min={bounds.min}
                  max={bounds.max}
                  onSave={(newVal) => {
                    onCellChange?.(rowIndex, row, col.key, newVal);
                    onEndEditCell?.();
                  }}
                  onCancel={() => {
                    onEndEditCell?.();
                  }}
                />
              );
            } else if (col.editorType === EDITOR_TYPES.TIME || col.dataType === DATA_TYPES.TIME) {
              cellContent = (
                <TimeCellEditor
                  initialValue={getRawCellValue(row, col.key)}
                  theme={surfaceTheme}
                  onSave={(newVal) => {
                    onCellChange?.(rowIndex, row, col.key, newVal);
                    onEndEditCell?.();
                  }}
                  onCancel={() => {
                    onEndEditCell?.();
                  }}
                />
              );
            } else if (col.editorType === EDITOR_TYPES.DATE || col.dataType === DATA_TYPES.DATE) {
              const bounds = col.minDate && col.maxDate
                ? { min: col.minDate, max: col.maxDate }
                : (getColumnDateBounds?.(col.key) || { min: '2017-01-01', max: '2027-12-31' });

              cellContent = (
                <DateCellEditor
                  initialValue={getRawCellValue(row, col.key)}
                  showTime={Boolean(col.showTime)}
                  theme={surfaceTheme}
                  min={bounds.min}
                  max={bounds.max}
                  onSave={(newVal) => {
                    onCellChange?.(rowIndex, row, col.key, newVal);
                    onEndEditCell?.();
                  }}
                  onCancel={() => {
                    onEndEditCell?.();
                  }}
                />
              );
            } else if (col.editorType === EDITOR_TYPES.COMBOBOX) {
              cellContent = (
                <div className="w-full h-full flex items-center justify-center">
                  <AdvComboBoxEdit
                    value={getRawCellValue(row, col.key)}
                    options={STATUS_COMBO_OPTIONS}
                    allowCustomInput={true}
                    defaultOpen={true}
                    autoFocus={true}
                    theme={surfaceTheme}
                    size="sm"
                    className="w-full h-full"
                    onChange={(newVal) => {
                      onCellChange?.(rowIndex, row, col.key, newVal);
                      onEndEditCell?.();
                    }}
                    onClose={() => {
                      onEndEditCell?.();
                    }}
                  />
                </div>
              );
            } else if (col.editorType === EDITOR_TYPES.LOOKUP) {
              cellContent = (
                <div className="w-full h-full flex items-center justify-center">
                  <AdvSearchLookUpEdit
                    value={getRawCellValue(row, col.key)}
                    valueMember="id"
                    displayMember="id"
                    dataSource={REGION_LOOKUP_DATA}
                    columns={REGION_LOOKUP_COLUMNS}
                    multiSelect={false}
                    defaultOpen={true}
                    theme={surfaceTheme}
                    dropdownWidth={420}
                    className="w-full h-full"
                    onChange={(newVal) => {
                      onCellChange?.(rowIndex, row, col.key, newVal);
                      onEndEditCell?.();
                    }}
                    onClose={() => {
                      onEndEditCell?.();
                    }}
                  />
                </div>
              );
            } else {
              cellContent = (
                <CellEditor
                  initialValue={getRawCellValue(row, col.key)}
                  align={col.align}
                  isNumeric={col.dataType === DATA_TYPES.NUMBER || col.key.startsWith('col_m')}
                  onSave={(newVal) => {
                    onCellChange?.(rowIndex, row, col.key, newVal);
                    onEndEditCell?.();
                  }}
                  onCancel={() => {
                    onEndEditCell?.();
                  }}
                />
              );
            }
          } else {
            const params: CellRenderParams<T> = {
              column: col,
              row,
              rowIndex,
              isSelected,
              isChecked,
            };

            if (col.renderCell) {
              cellContent = col.renderCell(params);
            } else if (renderCell) {
              cellContent = renderCell(params);
            } else {
              // Default generic fallback: Check if row has cells Map or direct property
              const rowAny = row as any;
              if (rowAny?.cells instanceof Map) {
                const cellData = rowAny.cells.get(col.key);
                cellContent = cellData?.value !== undefined ? String(cellData.value) : '';
              } else if (rowAny?.[col.key] !== undefined) {
                cellContent = String(rowAny[col.key]);
              }
              if (col.dataType === DATA_TYPES.NUMBER) {
                cellContent = formatGridNumber(cellContent);
              } else if (col.dataType === DATA_TYPES.TIME || col.editorType === EDITOR_TYPES.TIME) {
                const s = String(cellContent || '');
                const m = s.match(/(\d{1,2}):(\d{2})/);
                if (m) {
                  cellContent = `${m[1].padStart(2, '0')}:${m[2]}`;
                }
              } else if (
                col.dataType === DATA_TYPES.DATE ||
                col.editorType === EDITOR_TYPES.DATE ||
                col.editorType === EDITOR_TYPES.DATERANGE ||
                col.isDateRange
              ) {
                cellContent = formatGridDateValue(cellContent, Boolean(col.showTime));
              }
            }
          }

          return (
            <div
              key={col.key}
              data-cell-role={isEmptyCol ? undefined : cellRole}
              style={stickyStyle}
              onClick={(e) => {
                if (isEmptyCol) return;
                if (editable && editMode === GRID_EDIT_MODES.SINGLE_CLICK) {
                  e.stopPropagation();
                  onSelectRow?.(rowIndex, row);
                  onStartEditCell?.(rowIndex, col.key);
                }
              }}
              onDoubleClick={(e) => {
                if (isEmptyCol) return;
                if (editable && editMode === GRID_EDIT_MODES.DOUBLE_CLICK) {
                  e.stopPropagation();
                  onSelectRow?.(rowIndex, row);
                  onStartEditCell?.(rowIndex, col.key);
                }
              }}
              onContextMenu={(e) => {
                // Chặn menu chuột phải trên cột hệ thống hoặc cột có disableContextMenu
                if (col.disableContextMenu || col.dataType === DATA_TYPES.SYSTEM) {
                  e.preventDefault();
                  e.stopPropagation();
                  return;
                }
                if (onCellContextMenu) {
                  e.preventDefault();
                  onCellContextMenu(rowIndex, row, col.key, e);
                }
              }}
              className={`flex items-center ${
                isEditing
                  ? 'p-0.5'
                  : col.cellPadding
                  ? col.cellPadding
                  : col.dataType === DATA_TYPES.SYSTEM
                  ? 'px-1'
                  : 'px-2.5'
              } text-xs ${borderClasses} shrink-0 overflow-hidden whitespace-nowrap tabular-nums box-border min-h-[32px] max-h-[32px] leading-[32px] ${
                col.dataType === DATA_TYPES.NUMBER
                  ? 'agv-cell-number '
                  : col.dataType === DATA_TYPES.DATE || col.dataType === DATA_TYPES.TIME || col.editorType === EDITOR_TYPES.DATE || col.editorType === EDITOR_TYPES.TIME || col.editorType === EDITOR_TYPES.DATERANGE || col.isDateRange
                  ? 'agv-cell-date '
                  : col.className
                  ? `${col.className} `
                  : ''
              }${
                isEmptyCol ? 'cursor-not-allowed select-none' : ''
              } ${getAlignJustifyClass(col.align)} ${cellBgClasses}`}
            >
              {cellContent}
            </div>
          );
        })}
      </div>
    );
  },
  (prev, next) => {
    const prevEditingInRow = prev.editingCell?.rowIndex === prev.rowIndex;
    const nextEditingInRow = next.editingCell?.rowIndex === next.rowIndex;
    if (prevEditingInRow || nextEditingInRow) {
      if (prev.editingCell?.colKey !== next.editingCell?.colKey) return false;
      if (prev.editingCell?.rowIndex !== next.editingCell?.rowIndex) return false;
    }
    if (prev.editMode !== next.editMode) return false;

    return (
      prev.row === next.row &&
      prev.rowIndex === next.rowIndex &&
      prev.rowHeight === next.rowHeight &&
      prev.isSelected === next.isSelected &&
      prev.isChecked === next.isChecked &&
      prev.surfaceTheme === next.surfaceTheme &&
      prev.colWidths === next.colWidths &&
      prev.columns === next.columns &&
      prev.columnPins === next.columnPins &&
      prev.leftOffsets === next.leftOffsets &&
      prev.rightOffsets === next.rightOffsets &&
      prev.lastEffectiveLeftColKey === next.lastEffectiveLeftColKey &&
      prev.firstEffectiveRightColKey === next.firstEffectiveRightColKey &&
      prev.centerDockStatus === next.centerDockStatus &&
      prev.centerLeftOffsets === next.centerLeftOffsets &&
      prev.centerRightOffsets === next.centerRightOffsets &&
      prev.renderCell === next.renderCell &&
      prev.emptyColKeys === next.emptyColKeys
    );
  }
) as <T = any>(props: GridRowProps<T>) => React.ReactElement | null;
