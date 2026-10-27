import React from 'react';
import { ColumnDef, BaseGroupDef, PinPosition, SurfaceTheme, FilterOperation } from '../types';

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
  COLUMN_CHOOSER: 'columnChooser',
  SETTINGS: 'settings',
} as const;
export type FloatingPopupType = (typeof TOOLBAR_POPUPS)[keyof typeof TOOLBAR_POPUPS] | null;

export interface GridSettingsState {
  quickSearchEnabled: boolean;
  pinnedShadowEnabled: boolean;
  showVerticalGridlines: boolean;
  showRowNumber: boolean;
  showSelectionCol: boolean;
  densityMode: 'compact' | 'standard';
  showSummaryRow: boolean;
  showPagerBar: boolean;
}

export interface GridFloatingToolbarProps<T = any> {
  // Container & Placement
  gridContainerRef: React.RefObject<HTMLDivElement | null>;
  surfaceTheme?: SurfaceTheme;
  headerHeight?: number;

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

  // 3. Column Chooser
  columns: ColumnDef<any>[];
  columnGroups?: BaseGroupDef[];
  visibleColKeys: string[];
  onVisibleColKeysChange: (keys: string[]) => void;
  columnPins: Record<string, PinPosition>;
  onColumnPinChange: (colKey: string, pin: PinPosition) => void;
  onResetColumns: () => void;
  onAutoFitColumn?: (colKey: string) => void;
  onAutoFitAllColumns?: () => void;
  onReorderColumns?: (sourceKey: string, targetKey: string) => void;

  // 4. Grid Settings
  settings: GridSettingsState;
  onUpdateSettings: (updater: (prev: GridSettingsState) => GridSettingsState) => void;

  // 5. Excel Export
  onExportExcel?: () => void;
  isExporting?: boolean;

  // 6. Fullscreen
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}
