import React from 'react';
import { ColumnDef, BaseGroupDef, PinPosition, SurfaceTheme, FilterOperation, SortConfig } from '../types';

export interface QueryRule {
  id?: string;
  field: string;
  operator: FilterOperation | 'preset';
  value: any;
  valueTo?: any;
  multiValues?: string[];
  multiRanges?: Array<{ from: string; to: string }>;
}

/**
 * Danh mục toán tử kết hợp cây điều kiện (VÀ / HOẶC)
 */
export const QUERY_COMBINATORS = {
  AND: 'and',
  OR: 'or',
} as const;
export type QueryCombinator = (typeof QUERY_COMBINATORS)[keyof typeof QUERY_COMBINATORS];

export interface QueryGroup {
  id?: string;
  combinator: QueryCombinator;
  rules: (QueryRule | QueryGroup)[];
}

export type QueryTreeNode = QueryGroup | QueryRule;

export interface QueryPreset {
  id: string;
  name: string;
  tree: QueryGroup;
  createdAt: number;
  cmdText?: string;
}

/**
 * Danh mục định danh popup mở trên thanh công cụ nổi (Floating Toolbar)
 */
export const TOOLBAR_POPUPS = {
  SEARCH: 'search',
  QUERY_BUILDER: 'queryBuilder',
  MULTI_SORT: 'multiSort',
  COLUMN_CHOOSER: 'columnChooser',
} as const;
export type FloatingPopupType = (typeof TOOLBAR_POPUPS)[keyof typeof TOOLBAR_POPUPS] | null;

export interface GridFloatingToolbarProps<T = any> {
  // Container & Placement
  gridContainerRef: React.RefObject<HTMLDivElement | null>;
  gridId?: string;
  persistState?: boolean;
  surfaceTheme?: SurfaceTheme;
  headerHeight?: number;

  // Feature Flags
  enableQuickSearch?: boolean;
  enableQueryBuilder?: boolean;
  enableMultiSort?: boolean;
  enableColumnChooser?: boolean;
  enableFullscreen?: boolean;
  enableColumnPinning?: boolean;
  enableColumnReorder?: boolean;
  enableColumnHide?: boolean;

  // 1. Quick Filter
  quickFilterText: string;
  onQuickFilterChange: (text: string) => void;
  isQuickFilterSmart: boolean;
  onToggleQuickFilterSmart: () => void;

  // 2. Query Builder
  appliedQueryTree: QueryGroup | null;
  onApplyQueryTree: (tree: QueryGroup | null) => void;
  totalFilteredRows: number;
  totalRowCount: number;
  data?: T[];
  getCellValue?: (rowIndex: number, colKey: string) => any;
  hasColumnEmptyCells?: (colKey: string) => boolean;
  getColumnDateBounds?: (colKey: string) => { min: string; max: string };

  // Multi-Sort (Sắp xếp phân cấp)
  sortRules?: SortConfig[];
  onApplySortRules?: (rules: SortConfig[]) => void;

  // 3. Column Chooser
  columns: ColumnDef<any>[];
  columnGroups?: BaseGroupDef[];
  visibleColKeys: string[];
  onVisibleColKeysChange: (keys: string[]) => void;
  columnPins: Record<string, PinPosition>;
  onColumnPinChange?: (colKey: string, pin: PinPosition) => void;
  onResetColumns: () => void;
  onAutoFitColumn?: (colKey: string) => void;
  onAutoFitAllColumns?: () => void;
  onReorderColumns?: (sourceKey: string, targetKey: string) => void;

  // Fullscreen
  isFullscreen: boolean;
  onToggleFullscreen: () => void;

  // Popup state sync for Grid interaction & scroll lock
  onActivePopupChange?: (hasOpenPopup: boolean) => void;
}
