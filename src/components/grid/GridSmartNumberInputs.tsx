import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { FILTER_OPS, FilterOperation } from './types';
import { RangeArrowSeparator } from './FilterIcons';
import { NO_AUTOFILL_PROPS } from './constants';

type SmartNumberModule = typeof import('./smartNumberUtils');
let _smartMod: SmartNumberModule | null = null;
let _smartPromise: Promise<SmartNumberModule> | null = null;

function preloadSmartNumberUtils(): Promise<SmartNumberModule> {
  if (_smartMod) return Promise.resolve(_smartMod);
  if (!_smartPromise) {
    _smartPromise = import('./smartNumberUtils').then((m) => {
      _smartMod = m;
      return m;
    });
  }
  return _smartPromise;
}

const ALLOWED_SPECIAL_KEYS = [
  'Backspace',
  'Delete',
  'ArrowLeft',
  'ArrowRight',
  'ArrowUp',
  'ArrowDown',
  'Tab',
  'Home',
  'End',
  'PageUp',
  'PageDown',
  'Enter',
  'Escape',
];

function safeHandleNumericKeyDown(e: React.KeyboardEvent): void {
  if (_smartMod) {
    _smartMod.handleNumericKeyDown(e);
    return;
  }
  void preloadSmartNumberUtils();
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  if (ALLOWED_SPECIAL_KEYS.includes(e.key)) return;
  if (!/^[0-9/,\-. ;kmtrby()~]$/i.test(e.key)) {
    e.preventDefault();
  }
}

/**
 * Bộ lọc khoảng số [Từ...] — [Đến...]
 * Hỗ trợ nhập phím tắt nhanh k, m, tr, b, ty
 */
export const NumberRangeFilterInput: React.FC<{
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

  const applyFormat = (raw: string, isFrom: boolean) => {
    if (_smartMod) {
      const formatted = _smartMod.formatSmartInputText(raw);
      if (isFrom) {
        setFromText(formatted);
        onChange(formatted, toText);
      } else {
        setToText(formatted);
        onChange(fromText, formatted);
      }
      return;
    }
    if (isFrom) {
      setFromText(raw);
      onChange(raw, toText);
    } else {
      setToText(raw);
      onChange(fromText, raw);
    }
    void preloadSmartNumberUtils().then((m) => {
      const formatted = m.formatSmartInputText(raw);
      if (formatted !== raw) {
        if (isFrom) {
          setFromText(formatted);
          onChange(formatted, toText);
        } else {
          setToText(formatted);
          onChange(fromText, formatted);
        }
      }
    });
  };

  return (
    <div className="relative w-full h-full flex items-center gap-1 px-1">
      <input
        type="text"
        placeholder="Từ"
        value={fromText}
        onChange={(e) => applyFormat(e.target.value, true)}
        onKeyDown={safeHandleNumericKeyDown}
        onMouseEnter={() => void preloadSmartNumberUtils()}
        onFocus={() => {
          void preloadSmartNumberUtils();
          onFocus?.();
        }}
        onBlur={() => {
          applyFormat(fromText, true);
          onBlur?.();
        }}
        {...NO_AUTOFILL_PROPS}
        className="w-full h-full flex-1 min-w-0 bg-transparent text-xs font-medium outline-none text-center p-0 placeholder:text-[var(--agv-text-muted)] placeholder:opacity-60 tabular-nums"
        style={{ color: 'var(--agv-text-main)' }}
      />
      <RangeArrowSeparator className="mx-0.5" />
      <input
        type="text"
        placeholder="Đến"
        value={toText}
        onChange={(e) => applyFormat(e.target.value, false)}
        onKeyDown={safeHandleNumericKeyDown}
        onMouseEnter={() => void preloadSmartNumberUtils()}
        onFocus={() => {
          void preloadSmartNumberUtils();
          onFocus?.();
        }}
        onBlur={() => {
          applyFormat(toText, false);
          onBlur?.();
        }}
        {...NO_AUTOFILL_PROPS}
        className="w-full h-full flex-1 min-w-0 bg-transparent text-xs font-medium outline-none text-center p-0 placeholder:text-[var(--agv-text-muted)] placeholder:opacity-60 tabular-nums"
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
 * Bộ lọc ô số đơn lẻ thông minh (hỗ trợ phím tắt k, m, tr, b, ty và tự động chuyển Trong khoảng)
 */
export const SmartNumberFilterInput: React.FC<{
  value: string;
  onChange: (val: string, opOverride?: FilterOperation) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onClear?: () => void;
  placeholder?: string;
  hasValue?: boolean;
  isHighlightPlaceholder?: boolean;
}> = ({ value, onChange, onFocus, onBlur, onClear, placeholder, hasValue, isHighlightPlaceholder }) => {
  const [localVal, setLocalVal] = useState(value || '');

  useEffect(() => {
    setLocalVal(value || '');
  }, [value]);

  const evaluateSmart = (raw: string, mod: SmartNumberModule) => {
    const formatted = mod.formatSmartInputText(raw);
    setLocalVal(formatted);
    const trimmedFormatted = formatted.trim();
    const range = mod.parseSmartNumericRange(formatted);
    if (range && range.from && range.to) {
      onChange(range.formatted, FILTER_OPS.BETWEEN);
      return;
    }
    if (
      trimmedFormatted.length > 1 &&
      (trimmedFormatted.endsWith('-') ||
        trimmedFormatted.endsWith('/') ||
        trimmedFormatted.endsWith('..'))
    ) {
      onChange(formatted, FILTER_OPS.BETWEEN);
      return;
    }
    onChange(formatted);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (_smartMod) {
      evaluateSmart(raw, _smartMod);
      return;
    }
    setLocalVal(raw);
    onChange(raw);
    void preloadSmartNumberUtils().then((m) => evaluateSmart(raw, m));
  };

  const handleBlur = () => {
    if (_smartMod) {
      const formatted = _smartMod.formatSmartInputText(localVal);
      setLocalVal(formatted);
      const range = _smartMod.parseSmartNumericRange(formatted);
      if (range && range.from && range.to) {
        onChange(range.formatted, FILTER_OPS.BETWEEN);
      } else {
        onChange(formatted);
      }
    } else {
      void preloadSmartNumberUtils().then((m) => evaluateSmart(localVal, m));
    }
    onBlur?.();
  };

  return (
    <div className="relative w-full h-full flex items-center min-w-0">
      <input
        type="text"
        value={localVal}
        onMouseEnter={() => void preloadSmartNumberUtils()}
        onFocus={() => {
          void preloadSmartNumberUtils();
          onFocus?.();
        }}
        onBlur={handleBlur}
        onChange={handleChange}
        onKeyDown={safeHandleNumericKeyDown}
        placeholder={placeholder}
        {...NO_AUTOFILL_PROPS}
        className={`w-full h-full bg-transparent px-1 text-xs outline-none border-none tabular-nums disabled:cursor-not-allowed ${
          isHighlightPlaceholder
            ? 'placeholder:text-[var(--agv-accent)] placeholder:opacity-100 placeholder:font-semibold'
            : 'placeholder:text-[var(--agv-text-muted)] placeholder:opacity-60'
        } ${hasValue ? 'pr-5' : 'pr-1'}`}
        style={{
          color: 'var(--agv-text-main)',
        }}
      />
      {hasValue && (
        <button
          type="button"
          onClick={onClear}
          className="agv-inline-clear-destructive absolute right-1 top-1/2 -translate-y-1/2 w-4 h-4"
        >
          <X size={10} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
};
