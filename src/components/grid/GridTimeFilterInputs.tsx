import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { RangeArrowSeparator } from './FilterIcons';
import { NO_AUTOFILL_PROPS } from './constants';

/**
 * Bộ lọc dải giờ phút [Từ HH:mm] — [Đến HH:mm]
 * Hỗ trợ nhập trực tiếp hoặc tự động chuẩn hóa định dạng HH:mm, zero autofill, min-h 28px
 */
export const TimeRangeFilterInput: React.FC<{
  from: string;
  to: string;
  onChange: (from: string, to: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onClear?: () => void;
  hasValue?: boolean;
}> = ({ from, to, onChange, onFocus, onBlur, onClear, hasValue }) => {
  const [fromText, setFromText] = useState(from);
  const [toText, setToText] = useState(to);

  useEffect(() => {
    setFromText(from);
  }, [from]);

  useEffect(() => {
    setToText(to);
  }, [to]);

  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9:]/g, '').slice(0, 5);
    setFromText(raw);
    onChange(raw, toText);
  };

  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9:]/g, '').slice(0, 5);
    setToText(raw);
    onChange(fromText, raw);
  };

  const formatOnBlur = (val: string, isFrom: boolean) => {
    if (!val) return;
    const m = val.match(/^(\d{1,2}):?(\d{0,2})$/);
    if (m) {
      let h = parseInt(m[1], 10);
      if (h > 23) h = 23;
      let min = m[2] ? parseInt(m[2], 10) : 0;
      if (min > 59) min = 59;
      const formatted = `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
      if (isFrom) {
        setFromText(formatted);
        onChange(formatted, toText);
      } else {
        setToText(formatted);
        onChange(fromText, formatted);
      }
    }
  };

  return (
    <div className="relative w-full h-full flex items-center gap-1 px-1">
      <input
        type="text"
        placeholder="Từ"
        value={fromText}
        onChange={handleFromChange}
        onFocus={onFocus}
        onBlur={() => {
          formatOnBlur(fromText, true);
          onBlur?.();
        }}
        {...NO_AUTOFILL_PROPS}
        className="w-full h-full flex-1 min-w-0 bg-transparent text-xs font-medium outline-none text-center p-0 placeholder:text-[var(--agv-text-muted)] placeholder:opacity-60"
        style={{ color: 'var(--agv-text-main)' }}
      />
      <RangeArrowSeparator className="mx-0.5" />
      <input
        type="text"
        placeholder="Đến"
        value={toText}
        onChange={handleToChange}
        onFocus={onFocus}
        onBlur={() => {
          formatOnBlur(toText, false);
          onBlur?.();
        }}
        {...NO_AUTOFILL_PROPS}
        className="w-full h-full flex-1 min-w-0 bg-transparent text-xs font-medium outline-none text-center p-0 placeholder:text-[var(--agv-text-muted)] placeholder:opacity-60"
        style={{ color: 'var(--agv-text-main)' }}
      />
      {hasValue && (
        <button
          type="button"
          onClick={onClear}
          className="agv-inline-clear-destructive absolute right-0.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5"
        >
          <X size={10} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
};

/**
 * Bộ lọc giờ đơn lẻ (Bằng, Khác, Lớn hơn hoặc bằng, Nhỏ hơn hoặc bằng, Có chứa...)
 */
export const TimeFilterInput: React.FC<{
  value: string;
  onChange: (val: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onClear?: () => void;
  placeholder?: string;
  hasValue?: boolean;
}> = ({ value, onChange, onFocus, onBlur, onClear, placeholder = 'HH:mm', hasValue }) => {
  const [text, setText] = useState(value);

  useEffect(() => {
    setText(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9:]/g, '').slice(0, 5);
    setText(raw);
    onChange(raw);
  };

  const handleBlur = () => {
    if (text) {
      const m = text.match(/^(\d{1,2}):?(\d{0,2})$/);
      if (m) {
        let h = parseInt(m[1], 10);
        if (h > 23) h = 23;
        let min = m[2] ? parseInt(m[2], 10) : 0;
        if (min > 59) min = 59;
        const formatted = `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
        setText(formatted);
        onChange(formatted);
      }
    }
    onBlur?.();
  };

  return (
    <div className="relative w-full h-full flex items-center px-1">
      <input
        type="text"
        placeholder={placeholder}
        value={text}
        onChange={handleChange}
        onFocus={onFocus}
        onBlur={handleBlur}
        {...NO_AUTOFILL_PROPS}
        className="w-full h-full bg-transparent text-xs font-medium outline-none text-center p-0 placeholder:text-[var(--agv-text-muted)] placeholder:opacity-60"
        style={{ color: 'var(--agv-text-main)' }}
      />
      {hasValue && (
        <button
          type="button"
          onClick={onClear}
          className="agv-inline-clear-destructive absolute right-0.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5"
        >
          <X size={10} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
};
