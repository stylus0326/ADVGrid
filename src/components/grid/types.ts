import React from 'react';
import type { GridTheme } from '../../themes/index.ts';

export type SurfaceTheme = GridTheme;

/**
 * Danh mục vị trí ghim cột toàn hệ thống
 */
export const PIN_POSITIONS = {
  NONE: 'none',
  LEFT: 'left',
  RIGHT: 'right',
  CENTER: 'center',
} as const;
export type PinPosition = (typeof PIN_POSITIONS)[keyof typeof PIN_POSITIONS];

export type CenterDockStatus = 'left' | 'right' | 'normal';

/**
 * Danh mục chiều sắp xếp dữ liệu
 */
export const SORT_DIRECTIONS = {
  ASC: 'asc',
  DESC: 'desc',
} as const;
export type SortDirection = (typeof SORT_DIRECTIONS)[keyof typeof SORT_DIRECTIONS];

export interface SortConfig {
  key: string;
  direction: SortDirection;
  sortByMonth?: boolean;
}

export interface CellRenderParams<T = any> {
  column: ColumnDef<T>;
  row: T;
  rowIndex: number;
  isSelected: boolean;
  isChecked: boolean;
}

/**
 * Danh mục chế độ tương tác chỉnh sửa bảng (Xem, 1 click, 2 click)
 */
export const GRID_EDIT_MODES = {
  VIEW: 'view',
  SINGLE_CLICK: 'single-click',
  DOUBLE_CLICK: 'double-click',
} as const;
export type GridEditMode = (typeof GRID_EDIT_MODES)[keyof typeof GRID_EDIT_MODES];

/**
 * Danh mục chế độ tính toán công thức cột 12 tháng
 */
export const FORMULA_MODES = {
  AVG: 'AVG',
  SUM: 'SUM',
  MIN: 'MIN',
  MAX: 'MAX',
} as const;
export type FormulaMode = (typeof FORMULA_MODES)[keyof typeof FORMULA_MODES];

/**
 * Danh mục chế độ phân tích 12 tháng (13 Cột đầy đủ <-> 2 Cột thu gọn Chart)
 */
export const MONTH_ANALYTICS_MODES = {
  THIRTEEN_COLS: '13cols',
  TWO_COLS: '2cols',
} as const;
export type MonthAnalyticsMode = (typeof MONTH_ANALYTICS_MODES)[keyof typeof MONTH_ANALYTICS_MODES];

/**
 * Danh mục hằng số toán tử lọc toàn hệ thống (Filter Operations Enum / Constants)
 * Dùng trực tiếp FILTER_OPS.<TÊN_TOÁN_TỬ> thay vì gõ text thủ công
 */
export const FILTER_OPS = {
  CONTAINS: 'contains',
  NOT_CONTAINS: 'not_contains',
  STARTS_WITH: 'starts_with',
  ENDS_WITH: 'ends_with',
  EQUALS: 'equals',
  NOT_EQUALS: 'not_equals',
  GREATER_THAN: 'greater_than',
  GREATER_EQUALS: 'greater_equals',
  LESS_THAN: 'less_than',
  LESS_EQUALS: 'less_equals',
  BETWEEN: 'between',
  IS_POSITIVE: 'is_positive',
  IS_NEGATIVE: 'is_negative',
  IS_EMPTY: 'is_empty',
  IS_NOT_EMPTY: 'is_not_empty',
} as const;

export type FilterOperation = (typeof FILTER_OPS)[keyof typeof FILTER_OPS];

/**
 * Danh mục chế độ lọc dữ liệu của cột
 */
export const FILTER_MODES = {
  SIMPLE: 'simple',
  CHECKLIST: 'checklist',
  MULTI: 'multi',
} as const;
export type FilterMode = (typeof FILTER_MODES)[keyof typeof FILTER_MODES];

/**
 * Danh mục trạng thái lọc của cột Checkbox (Tất cả, Đã chọn, Chưa chọn)
 */
export const CHECK_FILTER_STATES = {
  ALL: 'ALL',
  CHECKED: 'CHECKED',
  UNCHECKED: 'UNCHECKED',
} as const;
export type CheckFilterState = (typeof CHECK_FILTER_STATES)[keyof typeof CHECK_FILTER_STATES];

export interface ColumnFilterValue {
  op: FilterOperation;
  val: string;
  mode?: FilterMode;
  selectedValues?: any[];
  includeBlanks?: boolean;
  multiValues?: string[];
  multiRanges?: Array<{ from: string; to: string }>;
}

/**
 * Danh mục kiểu control sửa dữ liệu ô (Cell Editor Type)
 */
export const EDITOR_TYPES = {
  TEXT: 'text',
  NUMBER: 'number',
  DATE: 'date',
  DATERANGE: 'daterange',
  TIME: 'time',
  COMBOBOX: 'combobox',
  LOOKUP: 'lookup',
} as const;
export type ColumnEditorType = (typeof EDITOR_TYPES)[keyof typeof EDITOR_TYPES];

/**
 * Danh mục kiểu dữ liệu cột chuẩn toàn hệ thống
 */
export const DATA_TYPES = {
  TEXT: 'text',
  NUMBER: 'number',
  DATE: 'date',
  TIME: 'time',
  SYSTEM: 'system',
} as const;
export type ColumnDataType = (typeof DATA_TYPES)[keyof typeof DATA_TYPES];

/**
 * Danh mục canh lề hiển thị của ô
 */
export const ALIGNMENTS = {
  LEFT: 'left',
  CENTER: 'center',
  RIGHT: 'right',
} as const;
export type ColumnAlign = (typeof ALIGNMENTS)[keyof typeof ALIGNMENTS];

export interface ColumnDef<T = any> {
  key: string;
  title: string;
  defaultWidth: number;
  minWidth?: number;
  maxWidth?: number;
  align?: ColumnAlign;
  dataType?: ColumnDataType;
  editorType?: ColumnEditorType;
  showTime?: boolean;
  isDateRange?: boolean;
  editorOptions?: any;
  sortable?: boolean;
  filterable?: boolean;
  resizable?: boolean;
  pinnable?: boolean;
  disableHeaderContextMenu?: boolean;
  disableContextMenu?: boolean;
  editable?: boolean;
  minDate?: string;
  maxDate?: string;
  className?: string;
  cellPadding?: string;
  isFormula?: boolean;
  isChart?: boolean;
  isRowNumber?: boolean;
  isSelection?: boolean;
  renderCell?: (params: CellRenderParams<T>) => React.ReactNode;
}

export interface BaseGroupDef {
  id: string;
  title: string;
  isStandalone?: boolean;
  keys: string[];
  isToggleable?: boolean;
  isCollapsed?: boolean;
  isAtomic?: boolean;
}

export interface GridScrollMetrics {
  fps: number;
  velocity: number;
  startChunk: number;
  endChunk: number;
  mountedRowCount: number;
  totalRows: number;
}

export interface VirtualizedGridRef {
  scrollToRow: (rowIndex: number, behavior?: ScrollBehavior) => void;
  scrollToChunk: (chunkIndex: number, behavior?: ScrollBehavior) => void;
  getScrollContainer: () => HTMLDivElement | null;
}

export interface GroupSortConfig {
  colKey: string;
  direction: 'asc' | 'desc';
}

export interface VirtualizedGridProps<T = any> {
  // Data props (support either direct array or dynamic row getter)
  data?: T[];
  rowCount?: number;
  getRow?: (index: number) => T;
  getRowId?: (row: T, index: number) => string | number;
  dataVersion?: number;

  // Columns & Groups
  columns: ColumnDef<T>[];
  columnGroups?: BaseGroupDef[];
  columnPins?: Record<string, PinPosition>;
  defaultColumnPins?: Record<string, PinPosition>;
  onColumnPinsChange?: (pins: Record<string, PinPosition>) => void;

  colWidths?: Record<string, number>;
  defaultColWidths?: Record<string, number>;
  onColWidthsChange?: (widths: Record<string, number>) => void;

  hiddenColKeys?: Set<string>;
  defaultHiddenColKeys?: Set<string>;
  onHiddenColKeysChange?: (hidden: Set<string>) => void;

  onReorderColumns?: (sourceKey: string, targetKey: string) => void;
  onResetColumns?: () => void;
  headerHeight?: number;

  // Grouping
  groupByColumnKey?: string | null;
  onToggleGroupByColumn?: (colKey: string) => void;

  // Column Summaries for hints
  columnSums?: Record<string, number>;

  // Sorting
  sortConfig?: SortConfig | null;
  onSortChange?: (sort: SortConfig | null) => void;

  // Selection & Checkbox
  selectedRowIndex?: number | null;
  selectedRowKey?: string | number | null;
  onSelectRow?: (rowIndex: number, row: T) => void;
  checkedRowIndices?: Set<number | string>;
  onToggleCheck?: (rowIndex: number, row: T, e: React.MouseEvent) => void;

  // Inline Filter Row
  showFilterRow?: boolean;
  columnFilters?: Record<string, ColumnFilterValue>;
  onColumnFilterChange?: (colKey: string, filter: ColumnFilterValue) => void;
  onClearAllColumnFilters?: () => void;
  onClearAllCriteria?: () => void;
  hasColumnEmptyCells?: (colKey: string) => boolean;
  getColumnDateBounds?: (colKey: string) => { min: string; max: string };
  formatChecklistDisplay?: (colKey: string, val: any) => string;
  getCellValue?: (rowIndex: number, colKey: string) => any;
  getDistinctValues?: (colKey: string) => { values: string[]; hasBlanks: boolean };
  matchFilterValue?: (
    cellVal: any,
    op: FilterOperation,
    targetVal: string,
    dataType: string,
    filterObj?: ColumnFilterValue
  ) => boolean;

  // Custom Cell Rendering
  renderCell?: (params: CellRenderParams<T>) => React.ReactNode;

  // In-Cell Editing (3 modes: view, single-click, double-click)
  editMode?: GridEditMode;
  onEditModeChange?: (mode: GridEditMode) => void;
  editingCell?: { rowIndex: number; colKey: string } | null;
  onStartEditCell?: (rowIndex: number, colKey: string) => void;
  onEndEditCell?: () => void;
  onCellChange?: (rowIndex: number, row: T, colKey: string, newValue: any) => void;

  // Virtualization & Performance configs
  chunkSize?: number;
  rowHeight?: number;
  overscanChunks?: number;
  antiGhostMode?: boolean;
  surfaceTheme?: SurfaceTheme;

  // Scroll Behaviors
  rowSnapMode?: boolean;
  rowsPerWheelStep?: number;
  autoScrolling?: boolean;
  autoScrollSpeed?: number;

  // Callbacks
  onScrollMetrics?: (metrics: GridScrollMetrics) => void;
  onToggleGroup?: (groupId: string) => void;
  onQuickFilter?: (colKey: string, value: any) => void;
  formulaMode?: 'AVG' | 'SUM' | 'MIN' | 'MAX';
  onFormulaModeChange?: (mode: 'AVG' | 'SUM' | 'MIN' | 'MAX') => void;

  // Styling
  className?: string;
  style?: React.CSSProperties;

  // Floating Toolbar & Popups
  enableFloatingToolbar?: boolean;
  quickFilterText?: string;
  onQuickFilterTextChange?: (text: string) => void;
  appliedQueryTree?: any;
  onApplyQueryTree?: (tree: any) => void;
  onExportExcel?: () => void;
  isExporting?: boolean;

  // Group Header Context Menu Callbacks
  onCollapseAllGroups?: () => void;
  onExpandAllGroups?: () => void;
  onUngroup?: () => void;
  onCopyGroupTable?: (groupRow: any, includeHeaders: boolean) => void;
  onExportGroupExcel?: (groupRow: any) => void;

  // Smart Empty Column Handling
  emptyColKeys?: Set<string>;

  // Group Sorting (Sắp xếp nhóm theo Tổng)
  groupSortConfig?: GroupSortConfig | null;
  onToggleGroupSort?: (colKey: string) => void;
}
