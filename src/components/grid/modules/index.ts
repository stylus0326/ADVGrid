export const GRID_MODULE_IDS = {
  ROW_NUMBER: 'rowNumber',
  PAGINATION: 'pagination',
  SUMMARY_ROW: 'summaryRow',
  COLUMN_PINNING: 'columnPinning',
  CENTER_DOCK: 'centerDock',
  ROW_PINNING: 'rowPinning',
  SORTING: 'sorting',
  FILTERING: 'filtering',
  QUERY_BUILDER: 'queryBuilder',
  ROW_SELECTION: 'rowSelection',
  ROW_GROUPING: 'rowGrouping',
  CELL_EDITING: 'cellEditing',
  COLUMN_SIZING: 'columnSizing',
  COLUMN_VISIBILITY: 'columnVisibility',
  COLUMN_CHOOSER: 'columnChooser',
  FULLSCREEN: 'fullscreen',
  CONTEXT_MENU: 'contextMenu',
  FLOATING_TOOLBAR: 'floatingToolbar',
  RESPONSIVE_LAYOUT: 'responsiveLayout',
  CROSS_HOVER: 'crossHover',
  CELL_SPAN: 'cellSpan',
  TREE_DATA: 'treeData',
  ROW_DETAIL: 'rowDetail',
} as const;

export type GridModuleId = (typeof GRID_MODULE_IDS)[keyof typeof GRID_MODULE_IDS];

export interface GridModule {
  readonly moduleId: GridModuleId;
  readonly moduleName: string;
}

function defineGridModule(moduleId: GridModuleId, moduleName: string): GridModule {
  return Object.freeze({ moduleId, moduleName });
}

export const RowNumberModule = defineGridModule(GRID_MODULE_IDS.ROW_NUMBER, 'RowNumberModule');
export const PaginationModule = defineGridModule(GRID_MODULE_IDS.PAGINATION, 'PaginationModule');
export const SummaryRowModule = defineGridModule(GRID_MODULE_IDS.SUMMARY_ROW, 'SummaryRowModule');
export const ColumnPinningModule = defineGridModule(
  GRID_MODULE_IDS.COLUMN_PINNING,
  'ColumnPinningModule'
);
export const CenterDockModule = defineGridModule(GRID_MODULE_IDS.CENTER_DOCK, 'CenterDockModule');
export const RowPinningModule = defineGridModule(GRID_MODULE_IDS.ROW_PINNING, 'RowPinningModule');
export const SortingModule = defineGridModule(GRID_MODULE_IDS.SORTING, 'SortingModule');
export const FilteringModule = defineGridModule(GRID_MODULE_IDS.FILTERING, 'FilteringModule');
export const QueryBuilderModule = defineGridModule(
  GRID_MODULE_IDS.QUERY_BUILDER,
  'QueryBuilderModule'
);
export const RowSelectionModule = defineGridModule(
  GRID_MODULE_IDS.ROW_SELECTION,
  'RowSelectionModule'
);
export const RowGroupingModule = defineGridModule(
  GRID_MODULE_IDS.ROW_GROUPING,
  'RowGroupingModule'
);
export const CellEditingModule = defineGridModule(
  GRID_MODULE_IDS.CELL_EDITING,
  'CellEditingModule'
);
export const ColumnSizingModule = defineGridModule(
  GRID_MODULE_IDS.COLUMN_SIZING,
  'ColumnSizingModule'
);
export const ColumnVisibilityModule = defineGridModule(
  GRID_MODULE_IDS.COLUMN_VISIBILITY,
  'ColumnVisibilityModule'
);
export const ColumnChooserModule = defineGridModule(
  GRID_MODULE_IDS.COLUMN_CHOOSER,
  'ColumnChooserModule'
);
export const FullscreenModule = defineGridModule(GRID_MODULE_IDS.FULLSCREEN, 'FullscreenModule');
export const ContextMenuModule = defineGridModule(
  GRID_MODULE_IDS.CONTEXT_MENU,
  'ContextMenuModule'
);
export const FloatingToolbarModule = defineGridModule(
  GRID_MODULE_IDS.FLOATING_TOOLBAR,
  'FloatingToolbarModule'
);
export const ResponsiveLayoutModule = defineGridModule(
  GRID_MODULE_IDS.RESPONSIVE_LAYOUT,
  'ResponsiveLayoutModule'
);
export const CrossHoverModule = defineGridModule(
  GRID_MODULE_IDS.CROSS_HOVER,
  'CrossHoverModule'
);
export const CellSpanModule = defineGridModule(
  GRID_MODULE_IDS.CELL_SPAN,
  'CellSpanModule'
);
export const TreeDataModule = defineGridModule(
  GRID_MODULE_IDS.TREE_DATA,
  'TreeDataModule'
);
export const RowDetailModule = defineGridModule(
  GRID_MODULE_IDS.ROW_DETAIL,
  'RowDetailModule'
);

/** Bộ module tối giản cho bảng chỉ xem có STT và phân trang */
export const BasicViewModules: readonly GridModule[] = Object.freeze([
  RowNumberModule,
  PaginationModule,
]);

/** Bộ module tiêu chuẩn B2B PC + Responsive (tự chuyển Tablet/Phone theo khung nhìn, tách CellEditing) */
export const StandardGridModules: readonly GridModule[] = Object.freeze([
  RowNumberModule,
  PaginationModule,
  SummaryRowModule,
  ColumnPinningModule,
  CenterDockModule,
  RowPinningModule,
  SortingModule,
  FilteringModule,
  ColumnSizingModule,
  ColumnVisibilityModule,
  RowGroupingModule,
  ContextMenuModule,
  FloatingToolbarModule,
  ResponsiveLayoutModule,
]);

/** Toàn bộ module doanh nghiệp */
export const AllEnterpriseModules: readonly GridModule[] = Object.freeze([
  RowNumberModule,
  PaginationModule,
  SummaryRowModule,
  ColumnPinningModule,
  CenterDockModule,
  RowPinningModule,
  SortingModule,
  FilteringModule,
  QueryBuilderModule,
  RowSelectionModule,
  RowGroupingModule,
  CellEditingModule,
  ColumnSizingModule,
  ColumnVisibilityModule,
  ColumnChooserModule,
  FullscreenModule,
  ContextMenuModule,
  FloatingToolbarModule,
  ResponsiveLayoutModule,
  CrossHoverModule,
  CellSpanModule,
  TreeDataModule,
  RowDetailModule,
]);

export function toModuleIdSet(modules?: readonly GridModule[]): Set<GridModuleId> {
  const ids = new Set<GridModuleId>();
  if (!modules) return ids;
  for (let i = 0; i < modules.length; i++) {
    const mod = modules[i];
    if (mod?.moduleId) {
      ids.add(mod.moduleId);
    }
  }
  return ids;
}

export function hasGridModule(
  modules: readonly GridModule[] | undefined,
  moduleId: GridModuleId
): boolean {
  if (!modules) return false;
  for (let i = 0; i < modules.length; i++) {
    if (modules[i]?.moduleId === moduleId) {
      return true;
    }
  }
  return false;
}
