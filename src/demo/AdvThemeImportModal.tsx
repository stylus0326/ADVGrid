import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { NO_AUTOFILL_PROPS, getGridControlRadiusClass } from '../components/grid/constants';
import {
  parseTweakcnThemeInput,
  saveCustomPreset,
  deleteCustomPreset,
  loadCustomPresets,
  ThemePreset,
} from '../themes/presets';

export interface AdvThemeImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onThemeApplied: (themeId: string) => void;
}

export const AdvThemeImportModal: React.FC<AdvThemeImportModalProps> = ({
  isOpen,
  onClose,
  onThemeApplied,
}) => {
  const [themeName, setThemeName] = useState('');
  const [rawCode, setRawCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [customThemes, setCustomThemes] = useState<Record<string, ThemePreset>>({});
  const modalRef = useRef<HTMLDivElement | null>(null);

  const refreshCustomList = useCallback(() => {
    setCustomThemes(loadCustomPresets());
  }, []);

  useEffect(() => {
    if (isOpen) {
      setErrorMsg('');
      refreshCustomList();
    }
  }, [isOpen, refreshCustomList]);

  // Phím Escape để đóng modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleApply = () => {
    setErrorMsg('');
    const res = parseTweakcnThemeInput(rawCode, themeName);
    if (!res.success || !res.preset) {
      setErrorMsg(res.error || 'Cú pháp theme không hợp lệ.');
      return;
    }

    saveCustomPreset(res.preset);
    const appliedId = res.preset.id || 'custom-' + Date.now().toString(36);
    onThemeApplied(appliedId);
    setThemeName('');
    setRawCode('');
    onClose();
  };

  const handleDelete = (id: string) => {
    deleteCustomPreset(id);
    refreshCustomList();
  };

  const savedList = Object.values(customThemes);
  const radiusClass = getGridControlRadiusClass();

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{
        zIndex: 999999999,
        backgroundColor: 'var(--agv-backdrop-bg, rgba(0, 0, 0, 0.55))',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      data-agv-popup="true"
    >
      <div
        ref={modalRef}
        className={`agv-spring-down flex flex-col max-h-[90vh] w-full max-w-[560px] overflow-hidden rounded-xl border shadow-2xl`}
        style={{
          backgroundColor: 'var(--agv-bg-popup)',
          borderColor: 'var(--agv-border-popup)',
          color: 'var(--agv-text-main)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between border-b px-5 py-3 shrink-0"
          style={{ borderColor: 'var(--agv-border)' }}
        >
          <h2 className="text-sm font-bold tracking-tight text-[var(--agv-text-main)] select-none">
            Nhập Theme Tùy Biến (Tweakcn Community)
          </h2>
          <button
            type="button"
            onClick={onClose}
            className={`inline-flex items-center justify-center min-h-[28px] min-w-[28px] h-7 w-7 rounded-lg transition cursor-pointer hover:bg-[var(--agv-bg-hover)] text-[var(--agv-text-muted)] hover:text-[var(--agv-text-main)]`}
          >
            <X className="w-4 h-4 stroke-[2]" />
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 text-xs">
          {/* Ô nhập tên theme */}
          <div className="space-y-1.5">
            <label className="block font-semibold text-[var(--agv-text-muted)] select-none">
              Tên theme:
            </label>
            <input
              type="text"
              value={themeName}
              onChange={(e) => setThemeName(e.target.value)}
              placeholder="Nhập tên theme (ví dụ: Cyberpunk Neon)..."
              {...NO_AUTOFILL_PROPS}
              className={`w-full min-h-[28px] h-8 px-3 text-xs outline-none ${radiusClass} border border-[var(--agv-border)] bg-[var(--agv-bg-control)] text-[var(--agv-text-main)] placeholder:text-[var(--agv-text-muted)] focus:border-[var(--agv-accent)] transition-colors`}
            />
          </div>

          {/* Vùng dán mã CSS hoặc JSON */}
          <div className="space-y-1.5">
            <label className="block font-semibold text-[var(--agv-text-muted)] select-none">
              Dán mã CSS hoặc JSON từ tweakcn.com:
            </label>
            <textarea
              value={rawCode}
              onChange={(e) => {
                setRawCode(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              rows={8}
              placeholder={`:root {\n  --background: oklch(0.98 0.01 240);\n  --primary: oklch(0.55 0.18 260);\n  ...\n}\n.dark {\n  --background: oklch(0.18 0.02 260);\n  ...\n}`}
              {...NO_AUTOFILL_PROPS}
              className={`w-full min-h-[140px] p-3 text-xs font-mono outline-none resize-y ${radiusClass} border border-[var(--agv-border)] bg-[var(--agv-bg-control)] text-[var(--agv-text-main)] placeholder:text-[var(--agv-text-muted)] focus:border-[var(--agv-accent)] transition-colors`}
            />
          </div>

          {/* Thông báo lỗi nếu có */}
          {errorMsg && (
            <div
              className="px-3 py-2 rounded-lg text-xs font-medium"
              style={{
                backgroundColor: 'var(--agv-danger-bg)',
                color: 'var(--agv-danger)',
                border: '1px solid var(--agv-danger)',
              }}
            >
              {errorMsg}
            </div>
          )}

          {/* Danh sách theme tùy biến đã lưu */}
          {savedList.length > 0 && (
            <div className="pt-2 border-t space-y-2" style={{ borderColor: 'var(--agv-border)' }}>
              <div className="font-semibold text-[var(--agv-text-muted)] select-none">
                Các theme tùy biến đã lưu (nếu có):
              </div>
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {savedList.map((item) => {
                  const itemId = item.id || '';
                  return (
                    <div
                      key={itemId}
                      className={`flex items-center justify-between px-3 py-1.5 rounded-lg border text-xs`}
                      style={{
                        backgroundColor: 'var(--agv-bg-root)',
                        borderColor: 'var(--agv-border)',
                      }}
                    >
                      <span className="font-medium text-[var(--agv-text-main)] truncate max-w-[340px]">
                        {item.label}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDelete(itemId)}
                        className={`inline-flex items-center justify-center px-2 py-0.5 rounded text-[11px] font-medium min-h-[28px] border transition cursor-pointer hover:opacity-85`}
                        style={{
                          backgroundColor: 'var(--agv-danger-bg)',
                          borderColor: 'var(--agv-danger)',
                          color: 'var(--agv-danger)',
                        }}
                      >
                        Xóa
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div
          className="flex items-center justify-end gap-2 border-t px-5 py-3 shrink-0"
          style={{ borderColor: 'var(--agv-border)' }}
        >
          <button
            type="button"
            onClick={onClose}
            className={`inline-flex items-center justify-center px-3.5 py-1 text-xs font-semibold rounded-lg border transition cursor-pointer min-h-[28px] hover:bg-[var(--agv-bg-hover)]`}
            style={{
              backgroundColor: 'var(--agv-bg-control)',
              borderColor: 'var(--agv-border)',
              color: 'var(--agv-text-main)',
            }}
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleApply}
            className={`inline-flex items-center justify-center px-4 py-1 text-xs font-semibold rounded-lg border transition cursor-pointer min-h-[28px] hover:opacity-90`}
            style={{
              backgroundColor: 'var(--agv-accent)',
              borderColor: 'var(--agv-accent)',
              color: 'var(--agv-accent-text, #ffffff)',
            }}
          >
            Áp Dụng
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AdvThemeImportModal;
