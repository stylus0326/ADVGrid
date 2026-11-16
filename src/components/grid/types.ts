import React from 'react';
import { SURFACE_THEMES, type GridTheme } from '../../themes';
import {
  GRID_VARIANTS,
  resolveGridFeatures,
  type GridVariant,
  type GridFeatureProps,
  type ResolvedGridFeatures,
} from './gridFeatures';
import type {
  GridColumnMeta,
  TabletFieldKey,
  TabletLineSlot,
  TabletGroupLines,
  TabletColumnGroup,
  PhoneCardConfig,
} from './columns/columnTypes';

export {
  SURFACE_THEMES,
  GRID_VARIANTS,
  resolveGridFeatures,
};
export type SurfaceTheme = GridTheme;
export type {
  GridVariant,
  GridFeatureProps,
  ResolvedGridFeatures,
  TabletFieldKey,
  TabletLineSlot,
  TabletGroupLines,
  TabletColumnGroup,
  PhoneCardConfig,
};

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

/**
 * Danh mục trạng thái neo cột ghim giữa (Center Dock Status)
 */
export const CENTER_DOCK_STATUSES = {
  LEFT: 'left',
  RIGHT: 'right',
  NORMAL: 'normal',
} as const;
export type CenterDockStatus = (typeof CENTER_DOCK_STATUSES)[keyof typeof CENTER_DOCK_STATUSES];

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
  isResponsive?: boolean;
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
 * Chế độ bố cục hiển thị Grid (PC, Tablet, Phone hoặc Tự động theo kích thước màn hình)
 */
export const GRID_LAYOUT_MODES = {
  AUTO: 'auto',
  PC: 'pc',
  TABLET: 'tablet',
  PHONE: 'phone',
} as const;
export type GridLayoutMode = (typeof GRID_LAYOUT_MODES)[keyof typeof GRID_LAYOUT_MODES];


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

export interface CellSpanParams<T = any> {
  row: T;
  rowIndex: number;
  column: ColumnDef<T>;
  colIndex: number;
  getRowAt: (rowIndex: number) => T | null;
}

export interface CellSpanResult {
  rowSpan?: number;
  colSpan?: number;
}

export type GridSpanMethod<T = any> = (
  params: CellSpanParams<T>
) => CellSpanResult | readonly [rowSpan: number, colSpan: number] | undefined | null;

export interface TreeRowExpandEvent<T = any> {
  row: T;
  rowKey: string | number;
  expanded: boolean;
  depth: number;
}

export interface TreeDataConfig<T = any> {
  treeColumnKey?: string;
  childrenField?: (keyof T & string) | (string & {});
  getSubRows?: (row: T) => readonly T[] | undefined | null;
  parentKeyField?: (keyof T & string) | (string & {});
  rootParentValue?: unknown;
  indentSize?: number;
  defaultExpandAll?: boolean;
  defaultExpandedDepth?: number;
  defaultExpandedKeys?: readonly (string | number)[];
  expandedKeys?: ReadonlySet<string | number> | readonly (string | number)[];
  onExpandedKeysChange?: (keys: (string | number)[]) => void;
  onRowExpand?: (event: TreeRowExpandEvent<T>) => void;
  filterMode?: 'preserveAncestors' | 'strict';
}

export interface DetailRowContext<T = any> {
  row: T;
  rowKey: string | number;
  rowIndex: number;
  close: () => void;
}

export interface DetailExpandChangeEvent<T = any> {
  row: T;
  rowKey: string | number;
  expanded: boolean;
}

export interface DetailRowConfig<T = any> {
  renderDetail: (ctx: DetailRowContext<T>) => React.ReactNode;
  height?: number | 'auto';
  estimatedHeight?: number;
  expandColumnKey?: string;
  showExpandColumn?: boolean;
  expandOnRowClick?: boolean;
  accordion?: boolean;
  unstyled?: boolean;
  canExpand?: (row: T, rowIndex: number) => boolean;
  defaultExpandedKeys?: readonly (string | number)[];
  expandedKeys?: ReadonlySet<string | number> | readonly (string | number)[];
  onExpandedKeysChange?: (keys: (string | number)[]) => void;
  onExpandChange?: (event: DetailExpandChangeEvent<T>) => void;
}

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
  enableGlobalFilter?: boolean;
  resizable?: boolean;
  pinnable?: boolean;
  hideable?: boolean;
  groupable?: boolean;
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
  isDetailExpand?: boolean;
  meta?: GridColumnMeta<T>;
  valueGetter?: (row: T, index: number) => any;
  colSpan?: (params: CellSpanParams<T>) => number;
  rowSpan?: (params: CellSpanParams<T>) => number;
  tabletLabelGetter?: (row: T, rowIndex: number) => string | undefined;
  monthIndexGetter?: (row: T, mode: FormulaMode) => number;
  wrapText?: boolean;
  renderHeader?: () => React.ReactNode;
  renderCell?: (params: CellRenderParams<T>) => React.ReactNode;
}

/**
 * Danh mục phân loại menu ngữ cảnh chuột phải
 */
export const CONTEXT_MENU_TYPES = {
  HEADER: 'header',
  ROW: 'row',
  BAND: 'band',
  GROUP: 'group',
} as const;
export type ContextMenuType = (typeof CONTEXT_MENU_TYPES)[keyof typeof CONTEXT_MENU_TYPES];

export type ContextMenuData =
  | {
      type: typeof CONTEXT_MENU_TYPES.HEADER;
      x: number;
      y: number;
      column: ColumnDef;
      currentPin: PinPosition;
      hasHiddenColumns?: boolean;
    }
  | {
      type: typeof CONTEXT_MENU_TYPES.BAND;
      x: number;
      y: number;
      groupDef: BaseGroupDef;
      childColumns: ColumnDef[];
      currentPin: PinPosition;
    }
  | {
      type: typeof CONTEXT_MENU_TYPES.ROW;
      x: number;
      y: number;
      rowIndex: number;
      row: any;
      column?: ColumnDef;
      cellValue?: any;
    }
  | {
      type: typeof CONTEXT_MENU_TYPES.GROUP;
      x: number;
      y: number;
      groupRow: any;
    };

export interface BaseGroupDef {
  id: string;
  title: string;
  isStandalone?: boolean;
  keys: string[];
  isToggleable?: boolean;
  isCollapsed?: boolean;
  isAtomic?: boolean;
}

export type GridToolbarPopupType = 'search' | 'queryBuilder' | 'multiSort' | 'columnChooser';

export interface GridToolbarState {
  activePopup: GridToolbarPopupType | null;
  quickFilterText: string;
  isQuickFilterActive: boolean;
  activeQueryRuleCount: number;
  visibleColumnCount: number;
  totalColumnCount: number;
  sortRuleCount: number;
  enableQuickSearch: boolean;
  enableQueryBuilder: boolean;
  enableColumnChooser: boolean;
  enableMultiSort: boolean;
}

export interface DataGridToolbarApi {
  state: GridToolbarState;
  openPopup: (type: GridToolbarPopupType, anchorEl: HTMLElement | null) => void;
  togglePopup: (type: GridToolbarPopupType, anchorEl: HTMLElement | null) => void;
  closePopup: () => void;
}

export interface VirtualizedGridRef {
  scrollToRow: (rowIndex: number, behavior?: ScrollBehavior) => void;
  scrollToChunk: (chunkIndex: number, behavior?: ScrollBehavior) => void;
  getScrollContainer: () => HTMLDivElement | null;
  openPopup: (type: GridToolbarPopupType, anchorEl: HTMLElement | null) => void;
  togglePopup: (type: GridToolbarPopupType, anchorEl: HTMLElement | null) => void;
  closePopup: () => void;
  expandAllTree?: () => void;
  collapseAllTree?: () => void;
  expandTreeToDepth?: (depth: number) => void;
  toggleTreeRow?: (rowKey: string | number, forceExpanded?: boolean) => void;
  toggleDetailRow?: (rowKey: string | number, forceExpanded?: boolean) => void;
  expandAllDetails?: () => void;
  collapseAllDetails?: () => void;
}

export interface GroupSortConfig {
  colKey: string;
  direction: SortDirection;
}

export interface VirtualizedGridProps<T = any> extends GridFeatureProps {
  // Data props (support either direct array or dynamic row getter)
  data?: T[];
  pinnedTopRowData?: T[];
  rowCount?: number;
  getRow?: (index: number) => T;
  getRowId?: (row: T, index: number) => string | number;
  dataVersion?: number;

  // Columns & Groups
  columns: ColumnDef<T>[];
  columnGroups?: BaseGroupDef[];
  tabletGroups?: readonly TabletColumnGroup<T>[];
  phoneCard?: PhoneCardConfig<T>;
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
  sortRules?: SortConfig[];
  onSortRulesChange?: (rules: SortConfig[]) => void;

  // Selection & Checkbox
  selectedRowIndex?: number | null;
  selectedRowKey?: string | number | null;
  onSelectRow?: (rowIndex: number, row: T) => void;
  checkedRowIndices?: Set<number | string>;
  onToggleCheck?: (rowIndex: number, row: T, e: React.MouseEvent) => void;
  onClearCheckedRows?: () => void;

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

  // Responsive Layout Mode (PC, Tablet, Phone hoặc Auto)
  layoutMode?: GridLayoutMode;
  onLayoutModeChange?: (mode: GridLayoutMode) => void;

  // Virtualization & Performance configs
  /** @deprecated Cửa sổ ảo hóa nay chạy theo từng dòng; giữ lại để tương thích scrollToChunk */
  chunkSize?: number;
  rowHeight?: number;
  /** @deprecated Dùng `overscanRows` thay thế */
  overscanChunks?: number;
  overscanRows?: number;
  scrollbarAlwaysOn?: boolean;
  dynamicRowHeight?: boolean;
  estimatedRowHeight?: number;
  getRowHeight?: (row: T, rowIndex: number) => number;
  antiGhostMode?: boolean;
  surfaceTheme?: SurfaceTheme;

  // Cross Hover, Cell Span, Tree Data & Detail View
  spanMethod?: GridSpanMethod<T>;
  maxRowSpanLookback?: number;
  treeColumnKey?: string;
  treeIndentSize?: number;
  onToggleTreeExpand?: (rowKey: string | number, row: T, depth?: number) => void;
  detailExpandColKey?: string;
  isRowDetailExpanded?: (rowKey: string | number) => boolean;
  canExpandRowDetail?: (row: T, rowIndex: number) => boolean;
  onToggleRowDetail?: (rowKey: string | number, row: T) => void;
  renderDetailRow?: (row: any) => React.ReactNode;
  hasDynamicDetailRows?: boolean;
  treeDetailActions?: {
    expandAllTree?: () => void;
    collapseAllTree?: () => void;
    expandTreeToDepth?: (depth: number) => void;
    toggleTreeRow?: (rowKey: string | number, forceExpanded?: boolean) => void;
    toggleDetailRow?: (rowKey: string | number, forceExpanded?: boolean) => void;
    expandAllDetails?: () => void;
    collapseAllDetails?: () => void;
  };

  // Callbacks
  onToggleGroup?: (groupId: string) => void;
  onQuickFilter?: (colKey: string, value: any) => void;
  formulaMode?: FormulaMode;
  onFormulaModeChange?: (mode: FormulaMode) => void;
  onRowDetail?: (row: T, index: number) => void;

  // Styling
  className?: string;
  style?: React.CSSProperties;

  // Floating Toolbar & Popups
  enableFloatingToolbar?: boolean;
  quickFilterText?: string;
  onQuickFilterTextChange?: (text: string) => void;
  appliedQueryTree?: any;
  onApplyQueryTree?: (tree: any) => void;
  onToolbarStateChange?: (state: GridToolbarState) => void;

  // Group Header Context Menu Callbacks
  onCollapseAllGroups?: () => void;
  onExpandAllGroups?: () => void;
  onUngroup?: () => void;
  onCopyGroupTable?: (groupRow: any, includeHeaders: boolean) => void;

  // Smart Empty Column Handling
  emptyColKeys?: Set<string>;

  // Group Sorting (Sắp xếp nhóm theo Tổng)
  groupSortConfig?: GroupSortConfig | null;
  onToggleGroupSort?: (colKey: string) => void;

  // Library Identity, Viewport States & Status Bar
  gridId?: string;
  loading?: boolean;
  refreshing?: boolean;
  error?: string | null;
  onRetry?: () => void;
  emptyText?: string;
  statusBar?: React.ReactNode;
  showSummaryRow?: boolean;
  onShowSummaryRowChange?: (show: boolean) => void;
  showStatusBar?: boolean;
  onShowStatusBarChange?: (show: boolean) => void;
  /** Internal pre-resolved feature flags passed from DataGrid to avoid double resolution */
  _resolvedFeatures?: ResolvedGridFeatures;
}
