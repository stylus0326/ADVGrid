import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, User, Plane, Calendar, Info, RefreshCw } from 'lucide-react';
import {
  AdvSelect,
  AdvPopover,
  AdvHoverCard,
  AdvTooltip,
  AdvProgress,
  AdvPreviewLinkCard,
} from '../components/ui';
import { getThemeClass, getPortalThemeVars, SURFACE_THEMES } from '../components/ui/enterpriseEditorUtils';

export interface AnimateUIPrimitivesDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  surfaceTheme?: string;
}

export const AnimateUIPrimitivesDemoModal: React.FC<AnimateUIPrimitivesDemoModalProps> = ({
  isOpen,
  onClose,
  surfaceTheme = SURFACE_THEMES.BEZIER_ARTHOUSE,
}) => {
  const [selectedCity, setSelectedCity] = useState('HAN');
  const [selectedStatus, setSelectedStatus] = useState('completed');
  const [progressVal, setProgressVal] = useState(65);
  const [isIndeterminate, setIsIndeterminate] = useState(false);

  if (!isOpen) return null;

  const themeVars = getPortalThemeVars(surfaceTheme);
  const themeClass = getThemeClass(surfaceTheme);

  return createPortal(
    <div
      className={`fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-[var(--agv-backdrop-bg)] backdrop-blur-xs select-none ${themeClass}`}
      style={themeVars}
      onClick={onClose}
    >
      <div
        data-agv-popup="true"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-xl border shadow-2xl overflow-hidden agv-spring-zoom"
        style={{
          backgroundColor: 'var(--agv-bg-popup, #ffffff)',
          borderColor: 'var(--agv-border)',
          color: 'var(--agv-text-main)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--agv-border)]">
          <div>
            <div className="text-sm font-bold text-[var(--agv-text-main)]">
              Thử Nghiệm Primitives (Animate UI / Base UI)
            </div>
            <div className="text-[11px] text-[var(--agv-text-muted)] mt-0.5">
              Tập hợp 6 primitives độc lập, chuẩn theme tokens, hiệu ứng lò xo và tương tác bàn phím
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-md text-[var(--agv-text-muted)] hover:text-[var(--agv-text-main)] hover:bg-[var(--agv-bg-item-hover)] transition cursor-pointer"
          >
            <X size={16} strokeWidth={2} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-6">
          {/* 1. AdvSelect */}
          <div className="p-4 rounded-lg border border-[var(--agv-border)] bg-[var(--agv-bg-card,transparent)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--agv-text-muted)]">
                1. Select (Dropdown chọn thuần túy)
              </span>
              <span className="text-[11px] font-mono text-[var(--agv-accent)]">
                Đang chọn: {selectedCity} | {selectedStatus}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[var(--agv-text-muted)] mb-1">
                  Sân bay / Thành phố
                </label>
                <AdvSelect
                  value={selectedCity}
                  onChange={setSelectedCity}
                  theme={surfaceTheme}
                  options={[
                    { value: 'HAN', label: 'Hà Nội (HAN)' },
                    { value: 'SGN', label: 'TP. Hồ Chí Minh (SGN)' },
                    { value: 'DAD', label: 'Đà Nẵng (DAD)' },
                    { value: 'CXR', label: 'Nha Trang (CXR)' },
                    { value: 'PQC', label: 'Phú Quốc (PQC)' },
                    { value: 'VCA', label: 'Cần Thơ (VCA - Đang bảo trì)', disabled: true },
                  ]}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--agv-text-muted)] mb-1">
                  Trạng thái
                </label>
                <AdvSelect
                  value={selectedStatus}
                  onChange={setSelectedStatus}
                  theme={surfaceTheme}
                  options={[
                    { value: 'pending', label: 'Chờ xử lý' },
                    { value: 'processing', label: 'Đang bay' },
                    { value: 'completed', label: 'Đã hoàn thành' },
                    { value: 'cancelled', label: 'Đã hủy chuyến' },
                  ]}
                />
              </div>
            </div>
          </div>

          {/* 2. AdvPopover */}
          <div className="p-4 rounded-lg border border-[var(--agv-border)] bg-[var(--agv-bg-card,transparent)] space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-[var(--agv-text-muted)]">
              2. Popover (Nội dung tương tác tùy biến)
            </div>
            <div className="flex flex-wrap gap-3">
              <AdvPopover
                theme={surfaceTheme}
                width={260}
                trigger={
                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-md text-xs font-medium border border-[var(--agv-border)] bg-[var(--agv-btn-default-bg)] text-[var(--agv-btn-default-text)] hover:bg-[var(--agv-btn-default-hover)] transition cursor-pointer min-h-[28px]"
                  >
                    Mở Form Xác Nhận
                  </button>
                }
                content={({ close }) => (
                  <div className="space-y-3">
                    <div className="font-semibold text-xs text-[var(--agv-text-main)]">
                      Xác nhận thao tác
                    </div>
                    <div className="text-[11px] text-[var(--agv-text-muted)] leading-relaxed">
                      Bạn có chắc chắn muốn áp dụng thay đổi cấu hình hiển thị cho bảng hiện tại?
                    </div>
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--agv-border)]">
                      <button
                        type="button"
                        onClick={close}
                        className="px-2.5 py-1 rounded text-xs text-[var(--agv-text-muted)] hover:bg-[var(--agv-bg-item-hover)] transition cursor-pointer min-h-[28px]"
                      >
                        Hủy
                      </button>
                      <button
                        type="button"
                        onClick={close}
                        className="px-3 py-1 rounded text-xs font-medium bg-[var(--agv-accent)] text-[var(--agv-accent-text,#ffffff)] hover:opacity-90 transition cursor-pointer min-h-[28px]"
                      >
                        Đồng ý
                      </button>
                    </div>
                  </div>
                )}
              />

              <AdvPopover
                theme={surfaceTheme}
                width={240}
                trigger={
                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-md text-xs font-medium border border-[var(--agv-border)] bg-[var(--agv-btn-default-bg)] text-[var(--agv-btn-default-text)] hover:bg-[var(--agv-btn-default-hover)] transition cursor-pointer min-h-[28px]"
                  >
                    Bộ Lọc Nhanh Popover
                  </button>
                }
                content={({ close }) => (
                  <div className="space-y-2">
                    <div className="font-semibold text-xs text-[var(--agv-text-main)]">
                      Lọc nhanh theo hạng vé
                    </div>
                    {['Hạng Phổ Thông (Economy)', 'Hạng Thương Gia (Business)', 'Hạng Nhất (First Class)'].map(
                      (item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={close}
                          className="w-full text-left px-2 py-1.5 rounded text-xs hover:bg-[var(--agv-bg-item-hover)] text-[var(--agv-text-main)] transition cursor-pointer min-h-[28px]"
                        >
                          {item}
                        </button>
                      )
                    )}
                  </div>
                )}
              />
            </div>
          </div>

          {/* 3. AdvHoverCard */}
          <div className="p-4 rounded-lg border border-[var(--agv-border)] bg-[var(--agv-bg-card,transparent)] space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-[var(--agv-text-muted)]">
              3. Hover Card (Rê chuột xem trước thẻ chi tiết)
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <AdvHoverCard
                theme={surfaceTheme}
                trigger={
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border border-[var(--agv-border)] hover:border-[var(--agv-accent)] cursor-pointer bg-[var(--agv-bg-control)] transition">
                    <User size={13} strokeWidth={2} />
                    <span>Hành khách: Nguyễn Văn A</span>
                  </span>
                }
                content={
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-[var(--agv-accent)] text-[var(--agv-accent-text,#ffffff)] flex items-center justify-center font-bold text-xs">
                        NA
                      </div>
                      <div>
                        <div className="font-bold text-xs text-[var(--agv-text-main)]">
                          Nguyễn Văn A
                        </div>
                        <div className="text-[11px] text-[var(--agv-text-muted)]">
                          Thẻ Vàng Lotusmiles #VN98472
                        </div>
                      </div>
                    </div>
                    <div className="text-[11px] text-[var(--agv-text-main)] border-t border-[var(--agv-border)] pt-2 space-y-1">
                      <div className="flex justify-between">
                        <span className="text-[var(--agv-text-muted)]">Chuyến bay:</span>
                        <span className="font-semibold">VN-210 (HAN → SGN)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--agv-text-muted)]">Ghế ngồi:</span>
                        <span className="font-semibold text-[var(--agv-accent)]">12A (Cửa sổ)</span>
                      </div>
                    </div>
                  </div>
                }
              />

              <AdvHoverCard
                theme={surfaceTheme}
                trigger={
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border border-[var(--agv-border)] hover:border-[var(--agv-accent)] cursor-pointer bg-[var(--agv-bg-control)] transition">
                    <Plane size={13} strokeWidth={2} />
                    <span>Chuyến bay VN-210</span>
                  </span>
                }
                content={
                  <div className="space-y-2">
                    <div className="font-bold text-xs text-[var(--agv-text-main)] flex items-center justify-between">
                      <span>Airbus A350-900</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--agv-accent)] text-[var(--agv-accent-text,#ffffff)]">
                        Đúng giờ
                      </span>
                    </div>
                    <div className="text-[11px] text-[var(--agv-text-muted)]">
                      Khởi hành: 08:30 (HAN) ➔ Hạ cánh: 10:45 (SGN)
                    </div>
                    <div className="text-[10px] text-[var(--agv-text-muted)] border-t border-[var(--agv-border)] pt-1.5 flex items-center gap-1">
                      <Calendar size={11} />
                      <span>Ngày bay: 26/10/2026</span>
                    </div>
                  </div>
                }
              />
            </div>
          </div>

          {/* 4. AdvProgress */}
          <div className="p-4 rounded-lg border border-[var(--agv-border)] bg-[var(--agv-bg-card,transparent)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--agv-text-muted)]">
                4. Progress (Thanh tiến trình)
              </span>
              <button
                type="button"
                onClick={() => setIsIndeterminate(!isIndeterminate)}
                className="inline-flex items-center gap-1 text-[11px] text-[var(--agv-accent)] hover:underline cursor-pointer"
              >
                <RefreshCw size={11} />
                <span>{isIndeterminate ? 'Chế độ % cố định' : 'Chế độ lướt sóng vô hạn'}</span>
              </button>
            </div>

            <AdvProgress
              value={progressVal}
              max={100}
              showValue={true}
              indeterminate={isIndeterminate}
              label="Tiến độ xử lý dữ liệu lớn (339.737 dòng)"
              size="sm"
            />

            {!isIndeterminate && (
              <div className="flex items-center gap-3 pt-1">
                <span className="text-[11px] text-[var(--agv-text-muted)]">Kéo chỉnh:</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progressVal}
                  onChange={(e) => setProgressVal(Number(e.target.value))}
                  className="w-full accent-[var(--agv-accent)] cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* 5. AdvPreviewLinkCard */}
          <div className="p-4 rounded-lg border border-[var(--agv-border)] bg-[var(--agv-bg-card,transparent)] space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-[var(--agv-text-muted)]">
              5. Preview Link Card (Xem trước liên kết web)
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <AdvPreviewLinkCard
                theme={surfaceTheme}
                url="https://animate-ui.com/docs/primitives/base-ui/combobox"
                title="Animate UI - Base UI Combobox"
                description="Modern animated primitives combining Base UI accessibility with high-performance spring motion."
                domain="animate-ui.com"
              />

              <AdvPreviewLinkCard
                theme={surfaceTheme}
                url="https://vietnamairlines.com"
                title="Vietnam Airlines - Cổng thông tin vé máy bay"
                description="Tra cứu lịch bay, đặt vé trực tuyến và quản lý hành trình trên các tuyến nội địa và quốc tế."
                domain="vietnamairlines.com"
              />
            </div>
          </div>

          {/* 6. AdvTooltip */}
          <div className="p-4 rounded-lg border border-[var(--agv-border)] bg-[var(--agv-bg-card,transparent)] space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-[var(--agv-text-muted)]">
              6. Tooltip (Hiệu ứng lò xo chuyển động mượt mà)
            </div>
            <div className="flex items-center gap-3">
              <AdvTooltip content="Tải lại toàn bộ dữ liệu bảng" theme={surfaceTheme}>
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-md text-xs font-medium border border-[var(--agv-border)] hover:bg-[var(--agv-bg-item-hover)] text-[var(--agv-text-main)] transition cursor-pointer min-h-[28px] inline-flex items-center gap-1.5"
                >
                  <RefreshCw size={13} strokeWidth={2} />
                  <span>Rê chuột vào đây</span>
                </button>
              </AdvTooltip>

              <AdvTooltip content="Thông tin bảo mật và mã hóa TLS 1.3" theme={surfaceTheme}>
                <button
                  type="button"
                  className="p-1.5 rounded-md border border-[var(--agv-border)] hover:bg-[var(--agv-bg-item-hover)] text-[var(--agv-text-muted)] hover:text-[var(--agv-text-main)] transition cursor-pointer min-h-[28px] min-w-[28px] flex items-center justify-center"
                >
                  <Info size={14} strokeWidth={2} />
                </button>
              </AdvTooltip>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-5 py-3 border-t border-[var(--agv-border)] bg-[var(--agv-bg-card,transparent)]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-md text-xs font-semibold bg-[var(--agv-accent)] text-[var(--agv-accent-text,#ffffff)] hover:opacity-90 transition cursor-pointer min-h-[28px]"
          >
            Đóng bảng thử nghiệm
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
