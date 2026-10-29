import React from 'react';
import { MorphCheckbox } from '../../ui/MorphIcons';
import { GridSettingsState } from './types';

export interface AdvGridSettingsPopupProps {
  settings: GridSettingsState;
  onUpdateSettings: (updater: (prev: GridSettingsState) => GridSettingsState) => void;
  style?: React.CSSProperties;
  onClose?: () => void;
}

export const AdvGridSettingsPopup = React.memo(function AdvGridSettingsPopup({
  settings,
  onUpdateSettings,
  style,
}: AdvGridSettingsPopupProps) {
  return (
    <div
      data-agv-popup="true"
      style={{
        backgroundColor: 'var(--agv-bg-popup)',
        borderColor: 'var(--agv-border-popup, var(--agv-border))',
        color: 'var(--agv-text-main)',
        boxShadow: '0 12px 28px -4px rgba(0, 0, 0, 0.25), 0 8px 12px -6px rgba(0, 0, 0, 0.15)',
        ...style,
      }}
      className="agv-settings-popup select-none flex flex-col gap-0.5 rounded-md border p-1.5 text-xs agv-spring-left"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Nhóm 1: Cột hệ thống */}
      <div
        onClick={() =>
          onUpdateSettings((prev) => ({
            ...prev,
            showRowNumber: !prev.showRowNumber,
          }))
        }
        className="group flex min-h-[28px] cursor-pointer select-none items-center gap-2.5 rounded px-2 py-1.5 transition-colors hover:bg-[var(--agv-bg-item-hover)]"
      >
        <MorphCheckbox checked={settings.showRowNumber} size={15} className="pointer-events-none shrink-0" />
        <span className="whitespace-nowrap text-xs font-medium text-[var(--agv-text-main)]">
          Cột số thứ tự
        </span>
      </div>

      <div
        onClick={() =>
          onUpdateSettings((prev) => ({
            ...prev,
            showSelectionCol: !prev.showSelectionCol,
          }))
        }
        className="group flex min-h-[28px] cursor-pointer select-none items-center gap-2.5 rounded px-2 py-1.5 transition-colors hover:bg-[var(--agv-bg-item-hover)]"
      >
        <MorphCheckbox checked={settings.showSelectionCol} size={15} className="pointer-events-none shrink-0" />
        <span className="whitespace-nowrap text-xs font-medium text-[var(--agv-text-main)]">
          Cột chọn dòng
        </span>
      </div>

      <div className="agv-menu-divider my-1 border-b border-[var(--agv-border)]" />

      {/* Nhóm 2: Dòng & Thanh trạng thái */}
      <div
        onClick={() =>
          onUpdateSettings((prev) => ({
            ...prev,
            showSummaryRow: !prev.showSummaryRow,
          }))
        }
        className="group flex min-h-[28px] cursor-pointer select-none items-center gap-2.5 rounded px-2 py-1.5 transition-colors hover:bg-[var(--agv-bg-item-hover)]"
      >
        <MorphCheckbox checked={settings.showSummaryRow} size={15} className="pointer-events-none shrink-0" />
        <span className="whitespace-nowrap text-xs font-medium text-[var(--agv-text-main)]">
          Dòng công thức
        </span>
      </div>

      <div
        onClick={() =>
          onUpdateSettings((prev) => ({
            ...prev,
            showPagerBar: !prev.showPagerBar,
          }))
        }
        className="group flex min-h-[28px] cursor-pointer select-none items-center gap-2.5 rounded px-2 py-1.5 transition-colors hover:bg-[var(--agv-bg-item-hover)]"
      >
        <MorphCheckbox checked={settings.showPagerBar} size={15} className="pointer-events-none shrink-0" />
        <span className="whitespace-nowrap text-xs font-medium text-[var(--agv-text-main)]">
          Dòng chọn trang
        </span>
      </div>

      <div className="agv-menu-divider my-1 border-b border-[var(--agv-border)]" />

      {/* Nhóm 3: Chế độ cuộn */}
      <div
        onClick={() =>
          onUpdateSettings((prev) => ({
            ...prev,
            rowSnapMode: !prev.rowSnapMode,
          }))
        }
        className="group flex min-h-[28px] cursor-pointer select-none items-center gap-2.5 rounded px-2 py-1.5 transition-colors hover:bg-[var(--agv-bg-item-hover)]"
      >
        <MorphCheckbox checked={settings.rowSnapMode} size={15} className="pointer-events-none shrink-0" />
        <span className="whitespace-nowrap text-xs font-medium text-[var(--agv-text-main)]">
          Cuộn khớp dòng
        </span>
      </div>
    </div>
  );
});
