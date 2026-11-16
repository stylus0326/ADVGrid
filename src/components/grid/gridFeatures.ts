import {
  GRID_MODULE_IDS,
  type GridModule,
  type GridModuleId,
  toModuleIdSet,
} from './modules';

export const GRID_VARIANTS = {
  FULL: 'full',
  BASIC: 'basic',
} as const;

export type GridVariant = (typeof GRID_VARIANTS)[keyof typeof GRID_VARIANTS];

export interface GridFeatureProps {
  /** Danh sách module kích hoạt theo chuẩn AG Grid (`modules={[...]}`) */
  modules?: readonly GridModule[];
  /** @deprecated Ưu tiên dùng `modules={[...]}` thay cho `variant` */
  variant?: GridVariant;
  autoHeight?: boolean;
  maxHeight?: number | string;
  persistState?: boolean;

  // Filtering & Search
  enableFiltering?: boolean;
  showFilterRow?: boolean;
  enableHeaderFilter?: boolean;
  enableQuickSearch?: boolean;
  enableQueryBuilder?: boolean;

  // Sorting & Column Operations
  enableSorting?: boolean;
  enableMultiSort?: boolean;
  enableColumnResize?: boolean;
  enableColumnReorder?: boolean;
  enableColumnPinning?: boolean;
  enableCenterDock?: boolean;
  enableColumnHide?: boolean;

  // Row, Grouping & Editing Operations
  enableRowNumber?: boolean;
  enableSelection?: boolean;
  enableGrouping?: boolean;
  enableRowPinning?: boolean;
  enableCellEditing?: boolean;

  // Summary & StatusBar
  enableSummary?: boolean;
  showSummaryRow?: boolean;
  enableStatusBar?: boolean;
  showStatusBar?: boolean;

  // Floating Toolbar, Context Menu & Responsive Layout
  enableContextMenu?: boolean;
  enableFloatingToolbar?: boolean;
  enableColumnChooser?: boolean;
  enableSettings?: boolean;
  enableFullscreen?: boolean;
  enableResponsiveLayout?: boolean;

  // Cross Hover, Cell Span, Tree Data & Detail View (Element Plus table-v2 extensions)
  enableCrossHover?: boolean;
  crossHoverHighlightHeader?: boolean;
  enableCellSpan?: boolean;
  enableTreeData?: boolean;
  enableRowDetail?: boolean;
}

export interface ResolvedGridFeatures {
  variant: GridVariant;
  autoHeight: boolean;
  maxHeight?: number | string;
  persistState: boolean;

  enableFiltering: boolean;
  showFilterRow: boolean;
  enableHeaderFilter: boolean;
  enableQuickSearch: boolean;
  enableQueryBuilder: boolean;

  enableSorting: boolean;
  enableMultiSort: boolean;
  enableColumnResize: boolean;
  enableColumnReorder: boolean;
  enableColumnPinning: boolean;
  enableCenterDock: boolean;
  enableColumnHide: boolean;

  enableRowNumber: boolean;
  enableSelection: boolean;
  enableGrouping: boolean;
  enableRowPinning: boolean;
  enableCellEditing: boolean;

  enableSummary: boolean;
  enableStatusBar: boolean;

  enableContextMenu: boolean;
  enableFloatingToolbar: boolean;
  enableColumnChooser: boolean;
  enableSettings: boolean;
  enableFullscreen: boolean;
  enableResponsiveLayout: boolean;
  hasAnyToolbarAction: boolean;

  enableCrossHover: boolean;
  crossHoverHighlightHeader: boolean;
  enableCellSpan: boolean;
  enableTreeData: boolean;
  enableRowDetail: boolean;

  enableResponsiveFilter: boolean;
  enableResponsiveSortFilter: boolean;
  responsiveSortFilterLabel: 'Lọc & Sắp Xếp' | 'Sắp Xếp' | 'Tìm & Lọc';
}

/**
 * Resolve `modules={[...]}` (hoặc fallback `variant="full" | "basic"`) hợp nhất cùng các prop ghi đè.
 */
export function resolveGridFeatures(input: GridFeatureProps = {}): ResolvedGridFeatures {
  if (input.modules !== undefined) {
    const modIds = toModuleIdSet(input.modules);
    const hasMod = (id: GridModuleId) => modIds.has(id);

    const baseFiltering = input.enableFiltering ?? hasMod(GRID_MODULE_IDS.FILTERING);
    const showFilterRow = input.showFilterRow ?? baseFiltering;
    const enableHeaderFilter = input.enableHeaderFilter ?? baseFiltering;
    const enableQuickSearch = input.enableQuickSearch ?? baseFiltering;
    const enableQueryBuilder = input.enableQueryBuilder ?? hasMod(GRID_MODULE_IDS.QUERY_BUILDER);
    const enableFiltering =
      input.enableFiltering ?? (baseFiltering || showFilterRow || enableHeaderFilter);

    const enableSorting = input.enableSorting ?? hasMod(GRID_MODULE_IDS.SORTING);
    const enableMultiSort =
      enableSorting && (input.enableMultiSort ?? hasMod(GRID_MODULE_IDS.SORTING));
    const enableColumnResize =
      input.enableColumnResize ?? hasMod(GRID_MODULE_IDS.COLUMN_SIZING);
    const enableColumnReorder =
      input.enableColumnReorder ?? hasMod(GRID_MODULE_IDS.COLUMN_SIZING);
    const enableColumnPinning =
      input.enableColumnPinning ?? hasMod(GRID_MODULE_IDS.COLUMN_PINNING);
    const enableCenterDock =
      input.enableCenterDock ?? hasMod(GRID_MODULE_IDS.CENTER_DOCK);
    const enableColumnHide =
      input.enableColumnHide ?? hasMod(GRID_MODULE_IDS.COLUMN_VISIBILITY);

    const enableRowNumber = input.enableRowNumber ?? hasMod(GRID_MODULE_IDS.ROW_NUMBER);
    const enableSelection = input.enableSelection ?? hasMod(GRID_MODULE_IDS.ROW_SELECTION);
    const enableGrouping = input.enableGrouping ?? hasMod(GRID_MODULE_IDS.ROW_GROUPING);
    const enableRowPinning = input.enableRowPinning ?? hasMod(GRID_MODULE_IDS.ROW_PINNING);
    const enableCellEditing = input.enableCellEditing ?? hasMod(GRID_MODULE_IDS.CELL_EDITING);

    const enableSummary =
      input.enableSummary ??
      (hasMod(GRID_MODULE_IDS.SUMMARY_ROW) || input.showSummaryRow === true);
    const enableStatusBar =
      input.enableStatusBar ??
      (hasMod(GRID_MODULE_IDS.PAGINATION) || input.showStatusBar === true);

    const enableContextMenu = input.enableContextMenu ?? hasMod(GRID_MODULE_IDS.CONTEXT_MENU);
    const enableColumnChooser =
      input.enableColumnChooser ?? hasMod(GRID_MODULE_IDS.COLUMN_CHOOSER);
    const enableSettings = false;
    const enableFullscreen = input.enableFullscreen ?? hasMod(GRID_MODULE_IDS.FULLSCREEN);
    const enableResponsiveLayout =
      input.enableResponsiveLayout ?? hasMod(GRID_MODULE_IDS.RESPONSIVE_LAYOUT);

    const enableCrossHover = input.enableCrossHover ?? hasMod(GRID_MODULE_IDS.CROSS_HOVER);
    const crossHoverHighlightHeader = input.crossHoverHighlightHeader ?? true;
    const enableCellSpan = input.enableCellSpan ?? hasMod(GRID_MODULE_IDS.CELL_SPAN);
    const enableTreeData = input.enableTreeData ?? hasMod(GRID_MODULE_IDS.TREE_DATA);
    const enableRowDetail = input.enableRowDetail ?? hasMod(GRID_MODULE_IDS.ROW_DETAIL);

    const hasAnyToolbarAction =
      enableQuickSearch ||
      enableQueryBuilder ||
      enableMultiSort ||
      enableColumnChooser ||
      enableFullscreen;

    const anyToolbarSubExplicit = Boolean(
      input.enableQuickSearch ||
        input.enableQueryBuilder ||
        input.enableMultiSort ||
        input.enableColumnChooser ||
        input.enableFullscreen
    );

    const enableFloatingToolbar =
      (input.enableFloatingToolbar ??
        (hasMod(GRID_MODULE_IDS.FLOATING_TOOLBAR) || anyToolbarSubExplicit)) &&
      hasAnyToolbarAction;

    const persistState =
      input.persistState ??
      Boolean(
        hasMod(GRID_MODULE_IDS.COLUMN_PINNING) ||
          hasMod(GRID_MODULE_IDS.CENTER_DOCK) ||
          hasMod(GRID_MODULE_IDS.SORTING) ||
          hasMod(GRID_MODULE_IDS.COLUMN_SIZING) ||
          hasMod(GRID_MODULE_IDS.COLUMN_VISIBILITY) ||
          hasMod(GRID_MODULE_IDS.ROW_GROUPING)
      );

    const autoHeight = input.autoHeight ?? false;
    const variant: GridVariant =
      input.variant ?? (modIds.size <= 2 ? GRID_VARIANTS.BASIC : GRID_VARIANTS.FULL);

    const enableResponsiveFilter = enableFiltering || enableQuickSearch;
    const enableResponsiveSortFilter =
      enableResponsiveLayout && (enableSorting || enableResponsiveFilter);
    const responsiveSortFilterLabel =
      enableSorting && enableResponsiveFilter
        ? 'Lọc & Sắp Xếp'
        : enableSorting
        ? 'Sắp Xếp'
        : 'Tìm & Lọc';

    return {
      variant,
      autoHeight,
      maxHeight: input.maxHeight,
      persistState,
      enableFiltering,
      showFilterRow,
      enableHeaderFilter,
      enableQuickSearch,
      enableQueryBuilder,
      enableSorting,
      enableMultiSort,
      enableColumnResize,
      enableColumnReorder,
      enableColumnPinning,
      enableCenterDock,
      enableColumnHide,
      enableRowNumber,
      enableSelection,
      enableGrouping,
      enableRowPinning,
      enableCellEditing,
      enableSummary,
      enableStatusBar,
      enableContextMenu,
      enableFloatingToolbar,
      enableColumnChooser,
      enableSettings,
      enableFullscreen,
      enableResponsiveLayout,
      hasAnyToolbarAction,
      enableCrossHover,
      crossHoverHighlightHeader,
      enableCellSpan,
      enableTreeData,
      enableRowDetail,
      enableResponsiveFilter,
      enableResponsiveSortFilter,
      responsiveSortFilterLabel,
    };
  }

  // Nhánh tương thích ngược khi không truyền `modules`
  const variant: GridVariant =
    input.variant === GRID_VARIANTS.BASIC ? GRID_VARIANTS.BASIC : GRID_VARIANTS.FULL;
  const isBasic = variant === GRID_VARIANTS.BASIC;

  const autoHeight = input.autoHeight ?? isBasic;
  const maxHeight = input.maxHeight;
  const persistState = input.persistState ?? !isBasic;

  const baseFiltering = input.enableFiltering ?? !isBasic;
  const showFilterRow = input.showFilterRow ?? baseFiltering;
  const enableHeaderFilter = input.enableHeaderFilter ?? baseFiltering;
  const enableQuickSearch = input.enableQuickSearch ?? baseFiltering;
  const enableQueryBuilder = input.enableQueryBuilder ?? false;
  const enableFiltering =
    input.enableFiltering ?? (baseFiltering || showFilterRow || enableHeaderFilter);

  const enableSorting = input.enableSorting ?? !isBasic;
  const enableMultiSort = enableSorting && (input.enableMultiSort ?? !isBasic);
  const enableColumnResize = input.enableColumnResize ?? !isBasic;
  const enableColumnReorder = input.enableColumnReorder ?? !isBasic;
  const enableColumnPinning = input.enableColumnPinning ?? !isBasic;
  const enableCenterDock = input.enableCenterDock ?? !isBasic;
  const enableColumnHide = input.enableColumnHide ?? !isBasic;

  const enableRowNumber = input.enableRowNumber ?? !isBasic;
  const enableSelection = input.enableSelection ?? false;
  const enableGrouping = input.enableGrouping ?? !isBasic;
  const enableRowPinning = input.enableRowPinning ?? !isBasic;
  const enableCellEditing = input.enableCellEditing ?? !isBasic;

  const enableSummary = input.enableSummary ?? (!isBasic || input.showSummaryRow === true);
  const enableStatusBar = input.enableStatusBar ?? (!isBasic || input.showStatusBar === true);

  const enableContextMenu = input.enableContextMenu ?? !isBasic;
  const enableColumnChooser = input.enableColumnChooser ?? false;
  const enableSettings = false;
  const enableFullscreen = input.enableFullscreen ?? false;
  const enableResponsiveLayout = input.enableResponsiveLayout ?? false;

  const enableCrossHover = input.enableCrossHover ?? false;
  const crossHoverHighlightHeader = input.crossHoverHighlightHeader ?? true;
  const enableCellSpan = input.enableCellSpan ?? false;
  const enableTreeData = input.enableTreeData ?? false;
  const enableRowDetail = input.enableRowDetail ?? false;

  const hasAnyToolbarAction =
    enableQuickSearch ||
    enableQueryBuilder ||
    enableMultiSort ||
    enableColumnChooser ||
    enableFullscreen;

  const anyToolbarSubExplicit = Boolean(
    input.enableQuickSearch ||
      input.enableQueryBuilder ||
      input.enableMultiSort ||
      input.enableColumnChooser ||
      input.enableFullscreen
  );

  const enableFloatingToolbar =
    (input.enableFloatingToolbar ?? (!isBasic || anyToolbarSubExplicit)) && hasAnyToolbarAction;

  const enableResponsiveFilter = enableFiltering || enableQuickSearch;
  const enableResponsiveSortFilter =
    enableResponsiveLayout && (enableSorting || enableResponsiveFilter);
  const responsiveSortFilterLabel =
    enableSorting && enableResponsiveFilter
      ? 'Lọc & Sắp Xếp'
      : enableSorting
      ? 'Sắp Xếp'
      : 'Tìm & Lọc';

  return {
    variant,
    autoHeight,
    maxHeight,
    persistState,
    enableFiltering,
    showFilterRow,
    enableHeaderFilter,
    enableQuickSearch,
    enableQueryBuilder,
    enableSorting,
    enableMultiSort,
    enableColumnResize,
    enableColumnReorder,
    enableColumnPinning,
    enableCenterDock,
    enableColumnHide,
    enableRowNumber,
    enableSelection,
    enableGrouping,
    enableRowPinning,
    enableCellEditing,
    enableSummary,
    enableStatusBar,
    enableContextMenu,
    enableFloatingToolbar,
    enableColumnChooser,
    enableSettings,
    enableFullscreen,
    enableResponsiveLayout,
    hasAnyToolbarAction,
    enableCrossHover,
    crossHoverHighlightHeader,
    enableCellSpan,
    enableTreeData,
    enableRowDetail,
    enableResponsiveFilter,
    enableResponsiveSortFilter,
    responsiveSortFilterLabel,
  };
}
