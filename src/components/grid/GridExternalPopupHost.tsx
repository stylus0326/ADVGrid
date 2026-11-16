import React, { Suspense } from 'react';
import { AdvAnchoredPopover } from '../ui/AdvPopover';
import { BaseGroupDef, ColumnDef, GridToolbarPopupType, PinPosition, SortConfig, SurfaceTheme } from './types';
import { SURFACE_THEMES } from './types';

const LazyAdvQuickFilterFlyout = React.lazy(() =>
  import('./floating/AdvQuickFilterFlyout').then((m) => ({ default: m.AdvQuickFilterFlyout }))
);
const LazyAdvMultiSortPopup = React.lazy(() =>
  import('./AdvMultiSortPopup').then((m) => ({ default: m.AdvMultiSortPopup }))
);
const LazyAdvColumnChooserModal = React.lazy(() =>
  import('./floating/AdvColumnChooserModal').then((m) => ({ default: m.AdvColumnChooserModal }))
);
const LazyAdvGridQueryBuilderModal = React.lazy(() =>
  import('./floating/AdvGridQueryBuilderModal').then((m) => ({ default: m.AdvGridQueryBuilderModal }))
);

export interface GridExternalPopupTarget {
  type: GridToolbarPopupType;
  anchorEl: HTMLElement | null;
}

export interface GridExternalPopupHostProps<T = any> {
  popup: GridExternalPopupTarget | null;
  onClose: () => void;
  gridId?: string;
  surfaceTheme?: SurfaceTheme;
  quickFilterText: string;
  onQuickFilterChange: (text: string) => void;
  isQuickFilterSmart: boolean;
  onToggleQuickFilterSmart: () => void;
  appliedQueryTree?: any;
  onApplyQueryTree?: (tree: any) => void;
  totalFilteredRows?: number;
  totalRowCount: number;
  data?: T[];
  getCellValue?: (rowIndex: number, colKey: string) => any;
  hasColumnEmptyCells?: (colKey: string) => boolean;
  getColumnDateBounds?: (colKey: string) => { min: string; max: string };
  columns: ColumnDef<any>[];
  columnGroups?: BaseGroupDef[];
  visibleColKeys: string[];
  onVisibleColKeysChange: (keys: string[]) => void;
  columnPins?: Record<string, PinPosition>;
  onColumnPinChange?: (colKey: string, pin: PinPosition) => void;
  onResetColumns: () => void;
  onAutoFitColumn?: (colKey: string) => void;
  onReorderColumns?: (sourceKey: string, targetKey: string) => void;
  enableColumnHide?: boolean;
  sortRules: SortConfig[];
  onApplySortRules: (rules: SortConfig[]) => void;
}

const PADDING_BY_POPUP: Record<GridToolbarPopupType, string> = {
  search: 'p-2',
  queryBuilder: 'p-0',
  columnChooser: 'p-3',
  multiSort: 'p-3',
};

export const GridExternalPopupHost = React.memo(function GridExternalPopupHost<T = any>({
  popup,
  onClose,
  gridId,
  surfaceTheme = SURFACE_THEMES.LIGHT,
  quickFilterText,
  onQuickFilterChange,
  isQuickFilterSmart,
  onToggleQuickFilterSmart,
  appliedQueryTree,
  onApplyQueryTree,
  totalFilteredRows,
  totalRowCount,
  data,
  getCellValue,
  hasColumnEmptyCells,
  getColumnDateBounds,
  columns,
  columnGroups,
  visibleColKeys,
  onVisibleColKeysChange,
  columnPins,
  onColumnPinChange,
  onResetColumns,
  onAutoFitColumn,
  onReorderColumns,
  enableColumnHide = true,
  sortRules,
  onApplySortRules,
}: GridExternalPopupHostProps<T>) {
  if (!popup) return null;

  const paddingClassName = PADDING_BY_POPUP[popup.type];

  return (
    <AdvAnchoredPopover
      isOpen={true}
      anchorEl={popup.anchorEl}
      onClose={onClose}
      placement="bottom-end"
      showArrow={true}
      offset={10}
      theme={surfaceTheme}
      paddingClassName={paddingClassName}
    >
      <Suspense
        fallback={
          <div className="px-4 py-3 text-xs text-[var(--agv-text-muted)]">
            Đang tải...
          </div>
        }
      >
        {popup.type === 'search' && (
          <LazyAdvQuickFilterFlyout
            embedded={true}
            quickFilterText={quickFilterText}
            isQuickFilterSmart={isQuickFilterSmart}
            onToggleSmart={onToggleQuickFilterSmart}
            onCommitFilter={onQuickFilterChange}
            onClose={onClose}
          />
        )}

        {popup.type === 'queryBuilder' && (
          <LazyAdvGridQueryBuilderModal
            embedded={true}
            isOpen={true}
            onClose={onClose}
            gridId={gridId}
            columns={columns}
            appliedTree={appliedQueryTree}
            onApply={(tree) => onApplyQueryTree?.(tree)}
            totalFilteredRows={totalFilteredRows ?? totalRowCount}
            totalRowCount={totalRowCount}
            surfaceTheme={surfaceTheme}
            data={data}
            getCellValue={getCellValue}
            hasColumnEmptyCells={hasColumnEmptyCells}
            getColumnDateBounds={getColumnDateBounds}
          />
        )}

        {popup.type === 'columnChooser' && (
          <LazyAdvColumnChooserModal
            embedded={true}
            columns={columns}
            columnGroups={columnGroups}
            visibleColKeys={visibleColKeys}
            onVisibleColKeysChange={onVisibleColKeysChange}
            columnPins={columnPins}
            onColumnPinChange={onColumnPinChange}
            onResetColumns={onResetColumns}
            onAutoFitColumn={onAutoFitColumn}
            onReorderColumns={onReorderColumns}
            enableColumnHide={enableColumnHide}
            onClose={onClose}
            surfaceTheme={surfaceTheme}
          />
        )}

        {popup.type === 'multiSort' && (
          <LazyAdvMultiSortPopup
            embedded={true}
            isOpen={true}
            onClose={onClose}
            anchorPos={null}
            columns={columns}
            sortRules={sortRules}
            onApply={onApplySortRules}
            surfaceTheme={surfaceTheme}
          />
        )}
      </Suspense>
    </AdvAnchoredPopover>
  );
});
