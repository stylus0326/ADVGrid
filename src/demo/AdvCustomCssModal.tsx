import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { NO_AUTOFILL_PROPS } from '../components/grid/constants';
import { DEFAULT_TEST_CSS_SNIPPET } from '../themes/customCssBridge';

export interface AdvCustomCssModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (cssCode: string) => void;
  initialCss?: string;
}

export const AdvCustomCssModal: React.FC<AdvCustomCssModalProps> = ({
  isOpen,
  onClose,
  onApply,
  initialCss,
}) => {
  const [cssCode, setCssCode] = useState<string>(() => {
    return initialCss || localStorage.getItem('agv_custom_test_css') || DEFAULT_TEST_CSS_SNIPPET;
  });

  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem('agv_custom_test_css');
      if (saved) {
        setCssCode(saved);
      } else if (initialCss) {
        setCssCode(initialCss);
      }
    }
  }, [isOpen, initialCss]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleApply = () => {
    localStorage.setItem('agv_custom_test_css', cssCode);
    onApply(cssCode);
    onClose();
  };

  return (
    <div
      className="agv-modal-portal fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xs select-none"
      data-agv-popup="true"
      style={{ backgroundColor: 'var(--agv-backdrop-bg, rgba(0, 0, 0, 0.65))' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-md border overflow-hidden flex flex-col max-h-[90vh] shadow-2xl"
        style={{
          backgroundColor: 'var(--agv-bg-popup, var(--agv-bg-root))',
          borderColor: 'var(--agv-border-strong)',
          color: 'var(--agv-text-main)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-2.5 border-b"
          style={{
            borderColor: 'var(--agv-border)',
            backgroundColor: 'var(--agv-bg-header, var(--agv-bg-root))',
          }}
        >
          <span className="font-bold text-sm" style={{ color: 'var(--agv-text-main)' }}>
            Nhập CSS Test Màu
          </span>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded hover:bg-[var(--agv-bg-hover)] transition cursor-pointer min-h-[28px] min-w-[28px] flex items-center justify-center"
            style={{ color: 'var(--agv-text-muted)' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 flex flex-col gap-2">
          <label
            className="text-xs font-semibold select-none"
            style={{ color: 'var(--agv-text-muted)' }}
          >
            Dán mã CSS cần test vào đây (@layer base / :root / .dark):
          </label>
          <textarea
            value={cssCode}
            onChange={(e) => setCssCode(e.target.value)}
            rows={12}
            {...NO_AUTOFILL_PROPS}
            className="w-full p-2.5 text-xs font-mono rounded border outline-none resize-y min-h-[200px] max-h-[420px]"
            style={{
              backgroundColor: 'var(--agv-bg-root)',
              borderColor: 'var(--agv-border-strong)',
              color: 'var(--agv-text-main)',
            }}
            placeholder="/* Dán mã CSS tại đây... */"
          />
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-end gap-2 px-4 py-2.5 border-t"
          style={{
            borderColor: 'var(--agv-border)',
            backgroundColor: 'var(--agv-bg-header, var(--agv-bg-root))',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 text-xs rounded border transition cursor-pointer min-h-[28px] hover:bg-[var(--agv-bg-hover)]"
            style={{
              borderColor: 'var(--agv-border)',
              color: 'var(--agv-text-main)',
            }}
          >
            Đóng
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="px-3 py-1 text-xs font-semibold rounded transition cursor-pointer min-h-[28px]"
            style={{
              backgroundColor: 'var(--agv-accent)',
              color: 'var(--agv-accent-text, #ffffff)',
            }}
          >
            Áp dụng
          </button>
        </div>
      </div>
    </div>
  );
};
