import React from 'react';
import { ArrowRight } from 'lucide-react';
import { FilterOperation, FILTER_OPS, DATA_TYPES } from './types';

interface IconProps {
  className?: string;
  size?: number;
}

/**
 * Biểu tượng phân cách dải khoảng [Từ -> Đến] đồng nhất toàn hệ thống từ Lucide (ArrowRight)
 */
export const RangeArrowSeparator: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 10,
}) => (
  <ArrowRight
    size={size}
    strokeWidth={2}
    className={`shrink-0 text-[var(--agv-text-muted)] opacity-50 select-none pointer-events-none ${className}`}
    aria-hidden="true"
  />
);

/**
 * 15 Biểu tượng toán tử SVG chuyên dụng chuẩn DevExtreme DataGrid
 * Sử dụng stroke="currentColor" và fill="none" để tự động tương thích 100% với 4 theme
 * (Light, Dark, Bezier Art House, E-Ink) qua biến CSS var(--agv-*).
 */

export const IconOpEquals: React.FC<IconProps> = ({ className = '', size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    className={className}
  >
    <line x1="5" y1="9" x2="19" y2="9" />
    <line x1="5" y1="15" x2="19" y2="15" />
  </svg>
);

export const IconOpNotEquals: React.FC<IconProps> = ({ className = '', size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    className={className}
  >
    <line x1="5" y1="9" x2="19" y2="9" />
    <line x1="5" y1="15" x2="19" y2="15" />
    <line x1="19" y1="5" x2="5" y2="19" />
  </svg>
);

export const IconOpContains: React.FC<IconProps> = ({ className = '', size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    className={className}
  >
    <path d="M17 6H11a6 6 0 0 0 0 12h6" />
    <line x1="6" y1="12" x2="14" y2="12" />
  </svg>
);

export const IconOpNotContains: React.FC<IconProps> = ({ className = '', size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    className={className}
  >
    <path d="M17 6H11a6 6 0 0 0 0 12h6" />
    <line x1="6" y1="12" x2="14" y2="12" />
    <line x1="19" y1="5" x2="5" y2="19" />
  </svg>
);

export const IconOpStartsWith: React.FC<IconProps> = ({ className = '', size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    className={className}
  >
    <line x1="4" y1="5" x2="4" y2="19" />
    <path d="M8 7h9a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H8" />
  </svg>
);

export const IconOpEndsWith: React.FC<IconProps> = ({ className = '', size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    className={className}
  >
    <path d="M16 7H7a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h9" />
    <line x1="20" y1="5" x2="20" y2="19" />
  </svg>
);

export const IconOpBetween: React.FC<IconProps> = ({ className = '', size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    className={className}
  >
    <line x1="4" y1="5" x2="4" y2="19" />
    <line x1="20" y1="5" x2="20" y2="19" />
    <polyline points="8 9 5 12 8 15" />
    <polyline points="16 9 19 12 16 15" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export const IconOpGreaterThan: React.FC<IconProps> = ({ className = '', size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    className={className}
  >
    <polyline points="8 5 15 12 8 19" />
  </svg>
);

export const IconOpGreaterEqual: React.FC<IconProps> = ({ className = '', size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    className={className}
  >
    <polyline points="8 4 15 10 8 16" />
    <line x1="7" y1="20" x2="17" y2="20" />
  </svg>
);

export const IconOpLessThan: React.FC<IconProps> = ({ className = '', size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    className={className}
  >
    <polyline points="16 5 9 12 16 19" />
  </svg>
);

export const IconOpLessEqual: React.FC<IconProps> = ({ className = '', size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    className={className}
  >
    <polyline points="16 4 9 10 16 16" />
    <line x1="7" y1="20" x2="17" y2="20" />
  </svg>
);

export const IconOpPositive: React.FC<IconProps> = ({ className = '', size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    className={className}
  >
    <circle cx="12" cy="12" r="9" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

export const IconOpNegative: React.FC<IconProps> = ({ className = '', size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    className={className}
  >
    <circle cx="12" cy="12" r="9" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

export const IconOpBlank: React.FC<IconProps> = ({ className = '', size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeDasharray="3 3"
    className={className}
  >
    <rect x="4" y="4" width="16" height="16" rx="2" />
  </svg>
);

export const IconOpNotBlank: React.FC<IconProps> = ({ className = '', size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    className={className}
  >
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <circle cx="12" cy="12" r="3" fill="currentColor" />
  </svg>
);

export const FILTER_OP_META: Record<
  FilterOperation,
  { label: string; icon: React.FC<IconProps>; noInput?: boolean }
> = {
  [FILTER_OPS.CONTAINS]: { label: 'Có chứa', icon: IconOpContains },
  [FILTER_OPS.NOT_CONTAINS]: { label: 'Không chứa', icon: IconOpNotContains },
  [FILTER_OPS.STARTS_WITH]: { label: 'Bắt đầu bằng', icon: IconOpStartsWith },
  [FILTER_OPS.ENDS_WITH]: { label: 'Kết thúc bằng', icon: IconOpEndsWith },
  [FILTER_OPS.EQUALS]: { label: 'Bằng', icon: IconOpEquals },
  [FILTER_OPS.NOT_EQUALS]: { label: 'Khác', icon: IconOpNotEquals },
  [FILTER_OPS.GREATER_THAN]: { label: 'Lớn hơn', icon: IconOpGreaterThan },
  [FILTER_OPS.GREATER_EQUALS]: { label: 'Lớn hơn hoặc bằng', icon: IconOpGreaterEqual },
  [FILTER_OPS.LESS_THAN]: { label: 'Nhỏ hơn', icon: IconOpLessThan },
  [FILTER_OPS.LESS_EQUALS]: { label: 'Nhỏ hơn hoặc bằng', icon: IconOpLessEqual },
  [FILTER_OPS.BETWEEN]: { label: 'Trong khoảng', icon: IconOpBetween },
  [FILTER_OPS.IS_POSITIVE]: { label: 'Số dương (> 0)', icon: IconOpPositive, noInput: true },
  [FILTER_OPS.IS_NEGATIVE]: { label: 'Số âm (< 0)', icon: IconOpNegative, noInput: true },
  [FILTER_OPS.IS_EMPTY]: { label: 'Để trống', icon: IconOpBlank, noInput: true },
  [FILTER_OPS.IS_NOT_EMPTY]: { label: 'Không để trống', icon: IconOpNotBlank, noInput: true },
};

export const ALLOWED_OPS_BY_TYPE: Record<string, FilterOperation[]> = {
  text: [
    FILTER_OPS.CONTAINS,
    FILTER_OPS.NOT_CONTAINS,
    FILTER_OPS.STARTS_WITH,
    FILTER_OPS.ENDS_WITH,
    FILTER_OPS.EQUALS,
    FILTER_OPS.NOT_EQUALS,
    FILTER_OPS.IS_EMPTY,
    FILTER_OPS.IS_NOT_EMPTY,
  ],
  number: [
    FILTER_OPS.EQUALS,
    FILTER_OPS.NOT_EQUALS,
    FILTER_OPS.GREATER_EQUALS,
    FILTER_OPS.LESS_EQUALS,
    FILTER_OPS.BETWEEN,
    FILTER_OPS.IS_POSITIVE,
    FILTER_OPS.IS_NEGATIVE,
    FILTER_OPS.CONTAINS,
    FILTER_OPS.IS_EMPTY,
    FILTER_OPS.IS_NOT_EMPTY,
  ],
  date: [
    FILTER_OPS.EQUALS,
    FILTER_OPS.NOT_EQUALS,
    FILTER_OPS.BETWEEN,
    FILTER_OPS.GREATER_EQUALS,
    FILTER_OPS.LESS_EQUALS,
    FILTER_OPS.IS_EMPTY,
    FILTER_OPS.IS_NOT_EMPTY,
  ],
  time: [
    FILTER_OPS.BETWEEN,
    FILTER_OPS.EQUALS,
    FILTER_OPS.NOT_EQUALS,
    FILTER_OPS.GREATER_EQUALS,
    FILTER_OPS.LESS_EQUALS,
    FILTER_OPS.CONTAINS,
    FILTER_OPS.IS_EMPTY,
    FILTER_OPS.IS_NOT_EMPTY,
  ],
};

export const DEFAULT_OP_BY_TYPE: Record<string, FilterOperation> = {
  text: FILTER_OPS.CONTAINS,
  number: FILTER_OPS.CONTAINS,
  date: FILTER_OPS.BETWEEN,
  time: FILTER_OPS.BETWEEN,
};

export const FilterOpIcon: React.FC<{ op: FilterOperation; className?: string; size?: number }> = ({
  op,
  className = '',
  size = 14,
}) => {
  const meta = FILTER_OP_META[op];
  if (!meta) return <IconOpEquals className={className} size={size} />;
  const Comp = meta.icon;
  return <Comp className={className} size={size} />;
};

/**
 * Lấy kiểu dữ liệu lọc chuẩn hóa của cột (text, number, date, time)
 * Dùng chung đồng bộ cho cả GridFilterRow và AdvGridQueryBuilderModal
 */
export function getColumnFilterType(
  colKey: string,
  columns?: Array<{ key: string; dataType?: string; isCurrency?: boolean }>
): 'text' | 'number' | 'date' | 'time' {
  const col = columns?.find((c) => c.key === colKey);
  // Quyết định kiểu toán tử thuần túy 100% theo kiểu dữ liệu truyền vào (dataType / isCurrency)
  // Tuyệt đối không dùng colKey để đoán mò chuỗi ký tự tránh gây sai lệch toán tử
  if (col?.isCurrency) return 'number';
  if (col?.dataType === DATA_TYPES.DATE || col?.dataType === DATA_TYPES.TIME || col?.dataType === DATA_TYPES.NUMBER) {
    return col.dataType;
  }
  return DATA_TYPES.TEXT;
}

/**
 * Hàm DUY NHẤT toàn hệ thống trả về danh sách toán tử lọc được phép cho một cột.
 * Đảm bảo đồng bộ 100% giữa GridFilterRow và AdvGridQueryBuilderModal:
 * - Dựa trên kiểu dữ liệu chuẩn của cột (date, time, number, text)
 * - Tự động loại trừ 'is_empty' và 'is_not_empty' khi cột không có ô trống nào (hasColumnEmptyCells(colKey) === false)
 */
export function getAllowedFilterOpsForColumn(
  colKey: string,
  columns?: Array<{ key: string; dataType?: string }>,
  hasColumnEmptyCells?: (colKey: string) => boolean
): FilterOperation[] {
  const colType = getColumnFilterType(colKey, columns);
  const rawOps = ALLOWED_OPS_BY_TYPE[colType] || ALLOWED_OPS_BY_TYPE.text;

  // 2 toán tử trống và không trống chỉ xuất hiện khi cột có xuất hiện ô trống
  const hasEmpty = hasColumnEmptyCells ? hasColumnEmptyCells(colKey) : true;
  if (!hasEmpty) {
    return rawOps.filter((op) => op !== FILTER_OPS.IS_EMPTY && op !== FILTER_OPS.IS_NOT_EMPTY);
  }
  return rawOps;
}

/**
 * Hàm DUY NHẤT toàn hệ thống trả về toán tử lọc mặc định cho một cột.
 * Đảm bảo đồng bộ 100% giữa GridFilterRow và AdvGridQueryBuilderModal.
 */
export function getDefaultFilterOpForColumn(
  colKey: string,
  columns?: Array<{ key: string; dataType?: string }>
): FilterOperation {
  const colType = getColumnFilterType(colKey, columns);
  return DEFAULT_OP_BY_TYPE[colType] || FILTER_OPS.CONTAINS;
}

