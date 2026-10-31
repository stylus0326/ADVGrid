import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ColumnDef, SortConfig, SortDirection, SurfaceTheme } from '../types';
import { createContainsFilter } from '../gridUtils';
import { NO_AUTOFILL_PROPS } from '../constants';
import { AdvComboBoxEdit } from '../../ui/AdvComboBoxEdit';

export interface ResponsiveSortFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  columns: ColumnDef<any>[];
  totalRows: number;
  sortConfig?: SortConfig | null;
  onSortChange?: (sort: SortConfig | null) => void;
  searchQuery?: string;
  onSearchQueryChange?: (q: string) => void;
  columnFilters?: Record<string, any>;
  onColumnFilterChange?: (colKey: string, filter: any) => void;
  onClearAllColumnFilters?: () => void;
  surfaceTheme?: SurfaceTheme;
}

export const ResponsiveSortFilterModal: React.FC<ResponsiveSortFilterModalProps> = ({
  isOpen,
  onClose,
  columns,
  totalRows,
  sortConfig,
  onSortChange,
  searchQuery = '',
  onSearchQueryChange,
  columnFilters = {},
  onColumnFilterChange,
  onClearAllColumnFilters,
  surfaceTheme = 'light',
}) => {
  const modalContentRef = useRef<HTMLDivElement | null>(null);

  // 1. State Sắp xếp (Sort)
  const [selectedSortCol, setSelectedSortCol] = useState<string>(sortConfig?.key || '');
  const [selectedSortDir, setSelectedSortDir] = useState<'asc' | 'desc' | 'none'>(
    sortConfig ? sortConfig.direction : 'none'
  );

  // 2. State Tìm kiếm & Bộ lọc (Filter)
  const [searchScope, setSearchScope] = useState<string>('__ALL__');
  const [searchText, setSearchText] = useState<string>(searchQuery);

  // Đồng bộ state cục bộ khi mở modal hoặc props thay đổi
  useEffect(() => {
    if (isOpen) {
      setSelectedSortCol(sortConfig?.key || '');
      setSelectedSortDir(sortConfig ? sortConfig.direction : 'none');
      setSearchScope('__ALL__');
      setSearchText(searchQuery || '');
    }
  }, [isOpen, sortConfig, searchQuery]);

  // Danh sách các cột khả dụng cho sắp xếp và tìm kiếm (loại trừ cột hệ thống stt/chk)
  const filterableColumns = useMemo(() => {
    return columns.filter((col) => !col.isSelection && col.key !== 'col_chk' && col.key !== 'col_stt');
  }, [columns]);

  // Options cho ComboBox chọn cột sắp xếp
  const sortColOptions = useMemo(() => {
    return [
      { label: 'Không sắp xếp', value: '' },
      ...filterableColumns.map((col) => ({
        label: col.title || col.key,
        value: col.key,
      })),
    ];
  }, [filterableColumns]);

  // Options cho ComboBox chọn phạm vi tìm kiếm
  const filterScopeOptions = useMemo(() => {
    return [
      { label: 'Tất cả các cột (Toàn văn)', value: '__ALL__' },
      ...filterableColumns.map((col) => ({
        label: col.title || col.key,
        value: col.key,
      })),
    ];
  }, [filterableColumns]);

  // Thay đổi phạm vi tìm kiếm -> nạp từ khóa hiện có của phạm vi đó
  const handleScopeChange = (newScope: string) => {
    setSearchScope(newScope);
    if (newScope === '__ALL__') {
      setSearchText(searchQuery || '');
    } else {
      const activeColFilter = columnFilters[newScope];
      setSearchText(activeColFilter?.val || '');
    }
  };

  // Chọn cột sắp xếp -> nếu đang 'none' thì tự động bật 'asc'
  const handleSortColChange = (newColKey: string) => {
    setSelectedSortCol(newColKey);
    if (!newColKey) {
      setSelectedSortDir('none');
    } else if (selectedSortDir === 'none') {
      setSelectedSortDir('asc');
    }
  };

  // Nút Áp dụng: lưu cấu hình và đóng modal
  const handleApply = () => {
    // Áp dụng Sort
    if (selectedSortCol && selectedSortDir !== 'none') {
      onSortChange?.({
        key: selectedSortCol,
        direction: selectedSortDir as SortDirection,
      });
    } else {
      onSortChange?.(null);
    }

    // Áp dụng Filter / Search
    const trimmed = searchText.trim();
    if (searchScope === '__ALL__') {
      onSearchQueryChange?.(trimmed);
    } else {
      if (trimmed) {
        onColumnFilterChange?.(searchScope, createContainsFilter(trimmed));
      } else {
        onColumnFilterChange?.(searchScope, createContainsFilter(''));
      }
    }

    onClose();
  };

  // Nút Đặt lại: xóa hết cấu hình sắp xếp và tìm kiếm
  const handleReset = () => {
    setSelectedSortCol('');
    setSelectedSortDir('none');
    setSearchScope('__ALL__');
    setSearchText('');

    onSortChange?.(null);
    onSearchQueryChange?.('');
    onClearAllColumnFilters?.();

    onClose();
  };

  // Đóng modal khi nhấn ESC
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="agv-modal-portal fixed inset-0 z-50 flex items-center justify-center p-4 select-none"
      data-agv-popup="true"
      style={{ backgroundColor: 'var(--agv-backdrop-bg, rgba(0, 0, 0, 0.65))' }}
      onClick={(e) => {
        // Chỉ đóng khi click trực tiếp vào lớp nền tối backdrop (không đóng khi click bên trong modal hoặc portal con)
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={modalContentRef}
        className="w-full max-w-[440px] rounded-lg border overflow-hidden flex flex-col max-h-[85vh] transition-all shadow-2xl"
        style={{
          backgroundColor: 'var(--agv-bg-popup, var(--agv-bg-root))',
          borderColor: 'var(--agv-border)',
          color: 'var(--agv-text-main)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header theo Mockup: Tiêu đề + Phụ đề */}
        <div
          className="px-5 py-3.5 border-b"
          style={{
            backgroundColor: 'var(--agv-bg-header, var(--agv-bg-root))',
            borderColor: 'var(--agv-border)',
          }}
        >
          <div className="text-center">
            <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--agv-text-main)' }}>
              LỌC & SẮP XẾP
            </h3>
            <p className="text-[11px] mt-0.5" style={{ color: 'var(--agv-text-muted)' }}>
              Áp dụng cho dữ liệu hiển thị ({totalRows.toLocaleString()} dòng)
            </p>
          </div>
        </div>

        {/* Nội dung Modal (Cuộn mượt nếu màn hình ngắn) */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs">
          {/* MỤC 1. SẮP XẾP DỮ LIỆU */}
          <div className="space-y-2">
            <div className="font-semibold text-xs uppercase tracking-wide" style={{ color: 'var(--agv-text-main)' }}>
              1. SẮP XẾP DỮ LIỆU
            </div>

            <div className="space-y-1">
              <label className="text-[11px] block font-medium" style={{ color: 'var(--agv-text-muted)' }}>
                Cột cần sắp xếp:
              </label>
              <AdvComboBoxEdit
                value={selectedSortCol}
                onChange={handleSortColChange}
                options={sortColOptions}
                allowCustomInput={false}
                placeholder="Chọn cột (ví dụ: Node, CPU, Ngày GD...)"
                theme={surfaceTheme}
                size="sm"
                className="w-full min-h-[32px]"
              />
            </div>

            <div className="space-y-1 pt-1">
              <label className="text-[11px] block font-medium" style={{ color: 'var(--agv-text-muted)' }}>
                Chiều sắp xếp:
              </label>
              <div
                className="flex border rounded-md overflow-hidden"
                style={{ borderColor: 'var(--agv-border)' }}
              >
                <button
                  type="button"
                  onClick={() => setSelectedSortDir('asc')}
                  className="flex-1 min-h-[32px] px-2 text-xs font-medium transition-colors cursor-pointer text-center"
                  style={{
                    backgroundColor: selectedSortDir === 'asc' ? 'var(--agv-accent)' : 'transparent',
                    color: selectedSortDir === 'asc' ? 'var(--agv-accent-text, #ffffff)' : 'var(--agv-text-main)',
                  }}
                >
                  Tăng dần
                </button>
                <div className="w-[1px] shrink-0" style={{ backgroundColor: 'var(--agv-border)' }} />
                <button
                  type="button"
                  onClick={() => setSelectedSortDir('desc')}
                  className="flex-1 min-h-[32px] px-2 text-xs font-medium transition-colors cursor-pointer text-center"
                  style={{
                    backgroundColor: selectedSortDir === 'desc' ? 'var(--agv-accent)' : 'transparent',
                    color: selectedSortDir === 'desc' ? 'var(--agv-accent-text, #ffffff)' : 'var(--agv-text-main)',
                  }}
                >
                  Giảm dần
                </button>
                <div className="w-[1px] shrink-0" style={{ backgroundColor: 'var(--agv-border)' }} />
                <button
                  type="button"
                  onClick={() => setSelectedSortDir('none')}
                  className="flex-1 min-h-[32px] px-2 text-xs font-medium transition-colors cursor-pointer text-center"
                  style={{
                    backgroundColor: selectedSortDir === 'none' ? 'var(--agv-accent)' : 'transparent',
                    color: selectedSortDir === 'none' ? 'var(--agv-accent-text, #ffffff)' : 'var(--agv-text-main)',
                  }}
                >
                  Không sắp xếp
                </button>
              </div>
            </div>
          </div>

          <div className="h-[1px] w-full" style={{ backgroundColor: 'var(--agv-border)' }} />

          {/* MỤC 2. TÌM KIẾM & BỘ LỌC */}
          <div className="space-y-2">
            <div className="font-semibold text-xs uppercase tracking-wide" style={{ color: 'var(--agv-text-main)' }}>
              2. TÌM KIẾM & BỘ LỌC
            </div>

            <div className="space-y-1">
              <label className="text-[11px] block font-medium" style={{ color: 'var(--agv-text-muted)' }}>
                Phạm vi tìm kiếm:
              </label>
              <AdvComboBoxEdit
                value={searchScope}
                onChange={handleScopeChange}
                options={filterScopeOptions}
                allowCustomInput={false}
                placeholder="Chọn phạm vi tìm kiếm..."
                theme={surfaceTheme}
                size="sm"
                className="w-full min-h-[32px]"
              />
            </div>

            <div className="space-y-1 pt-1">
              <label className="text-[11px] block font-medium" style={{ color: 'var(--agv-text-muted)' }}>
                Từ khóa tìm kiếm:
              </label>
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleApply();
                  }
                }}
                placeholder="Nhập dữ liệu cần tìm..."
                {...NO_AUTOFILL_PROPS}
                className="w-full min-h-[32px] px-3 py-1.5 rounded-md border text-xs outline-none transition-colors"
                style={{
                  backgroundColor: 'var(--agv-bg-root)',
                  borderColor: 'var(--agv-border)',
                  color: 'var(--agv-text-main)',
                }}
              />
            </div>
          </div>
        </div>

        {/* Footer: 2 nút Đặt lại và Áp dụng chuẩn Mockup */}
        <div
          className="flex items-center justify-between px-5 py-3 border-t gap-3"
          style={{
            backgroundColor: 'var(--agv-bg-header, var(--agv-bg-root))',
            borderColor: 'var(--agv-border)',
          }}
        >
          <button
            type="button"
            onClick={handleReset}
            className="min-h-[32px] px-4 rounded-md border text-xs font-semibold cursor-pointer transition-colors"
            style={{
              backgroundColor: 'var(--agv-bg-root)',
              borderColor: 'var(--agv-border)',
              color: 'var(--agv-text-main)',
            }}
          >
            Đặt lại
          </button>

          <button
            type="button"
            onClick={handleApply}
            className="min-h-[32px] px-5 rounded-md text-xs font-semibold cursor-pointer transition-opacity"
            style={{
              backgroundColor: 'var(--agv-accent)',
              color: 'var(--agv-accent-text, #ffffff)',
            }}
          >
            Áp dụng
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
