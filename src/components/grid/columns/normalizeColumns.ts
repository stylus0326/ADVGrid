import type {
  BaseGroupDef,
  CellRenderParams,
  ColumnDef,
  FormulaMode,
  PinPosition,
  SurfaceTheme,
} from '../types';
import { DATA_TYPES, FORMULA_MODES, PIN_POSITIONS, SURFACE_THEMES } from '../types';
import type {
  AccessorColumnDef,
  DefaultColDef,
  DisplayColumnDef,
  GridColumnDef,
  GroupColumnDef,
  NormalizedGridColumnsResult,
} from './columnTypes';

export type {
  AccessorColumnDef,
  DefaultColDef,
  DisplayColumnDef,
  GridColumnDef,
  GroupColumnDef,
  PaginationConfig,
} from './columnTypes';

export interface BasicColumnHelper<TData> {
  accessor<TAccessor extends keyof TData & string>(
    accessorKey: TAccessor,
    column: Omit<AccessorColumnDef<TData, TData[TAccessor]>, 'accessorKey' | 'accessorFn'>
  ): AccessorColumnDef<TData, TData[TAccessor]>;
  accessor<TValue = any>(
    accessorKey: string & {},
    column: Omit<AccessorColumnDef<TData, TValue>, 'accessorKey' | 'accessorFn'>
  ): AccessorColumnDef<TData, TValue>;
  accessor<TValue>(
    accessorFn: (row: TData, index: number) => TValue,
    column: Omit<AccessorColumnDef<TData, TValue>, 'accessorKey' | 'accessorFn'> & { id: string }
  ): AccessorColumnDef<TData, TValue>;
  display(column: DisplayColumnDef<TData>): DisplayColumnDef<TData>;
  group(column: GroupColumnDef<TData>): GroupColumnDef<TData>;
}

/**
 * Factory cột cơ bản siêu nhẹ (không kéo `columnPresets` / `TwelveMonthChartCell`).
 */
export function createBasicColumnHelper<TData>(): BasicColumnHelper<TData> {
  return {
    accessor(accessorOrFn: any, column: any): any {
      if (typeof accessorOrFn === 'function') {
        return {
          ...column,
          accessorFn: accessorOrFn,
        };
      }
      return {
        ...column,
        id: column?.id ?? accessorOrFn,
        accessorKey: accessorOrFn,
      };
    },
    display(column) {
      return { ...column };
    },
    group(column) {
      return { ...column };
    },
  };
}

export interface NormalizeColumnsOptions {
  enableColumnPinning?: boolean;
  enableCenterDock?: boolean;
  formulaMode?: FormulaMode;
  surfaceTheme?: SurfaceTheme;
}

function isGroupColumnDef<TData>(def: GridColumnDef<TData, any>): def is GroupColumnDef<TData> {
  return Boolean(def && typeof def === 'object' && 'columns' in def && Array.isArray(def.columns));
}

function getByAccessorPath(obj: any, path: string): any {
  if (obj == null) return undefined;
  if (Object.prototype.hasOwnProperty.call(obj, path)) {
    return obj[path];
  }
  if (!path.includes('.')) {
    return obj[path];
  }
  const parts = path.split('.');
  let current = obj;
  for (let i = 0; i < parts.length; i++) {
    if (current == null) return undefined;
    current = current[parts[i]];
  }
  return current;
}

function normalizeLeafColumn<TData>(
  def: Exclude<GridColumnDef<TData, any>, GroupColumnDef<TData>>,
  leafIndex: number,
  defaultColDef: DefaultColDef<TData> | undefined,
  columnDefinedPins: Record<string, PinPosition>,
  options: NormalizeColumnsOptions
): ColumnDef<TData> {
  const anyDef = def as AccessorColumnDef<TData, any> & ColumnDef<TData>;
  const accessorKey = anyDef.accessorKey;
  const key = String(anyDef.key ?? anyDef.id ?? accessorKey ?? `col_${leafIndex}`);

  const mergedMeta =
    defaultColDef?.meta || anyDef.meta
      ? { ...(defaultColDef?.meta ?? {}), ...(anyDef.meta ?? {}) }
      : undefined;

  const headerProp = anyDef.header ?? defaultColDef?.header;
  const title =
    typeof headerProp === 'string'
      ? headerProp
      : typeof anyDef.title === 'string'
      ? anyDef.title
      : key;

  const valueGetter: (row: TData, index: number) => any = anyDef.accessorFn
    ? (row, index) => anyDef.accessorFn!(row, index)
    : accessorKey
    ? accessorKey.includes('.')
      ? (row) => getByAccessorPath(row, accessorKey)
      : (row) => (row ? (row as any)[accessorKey] : undefined)
    : anyDef.valueGetter
    ? anyDef.valueGetter
    : (row) => (row ? (row as any)[key] : undefined);

  const normalizedCol: ColumnDef<TData> = {
    ...(anyDef as ColumnDef<TData>),
    key,
    title,
    defaultWidth: anyDef.size ?? anyDef.defaultWidth ?? defaultColDef?.size ?? 150,
    minWidth: anyDef.minSize ?? anyDef.minWidth ?? defaultColDef?.minSize,
    maxWidth: anyDef.maxSize ?? anyDef.maxWidth ?? defaultColDef?.maxSize,
    align: mergedMeta?.align ?? anyDef.align,
    dataType: mergedMeta?.dataType ?? anyDef.dataType ?? DATA_TYPES.TEXT,
    className: mergedMeta?.className ?? anyDef.className,
    cellPadding: mergedMeta?.cellPadding ?? anyDef.cellPadding,
    editorType: mergedMeta?.editorType ?? anyDef.editorType,
    editorOptions: mergedMeta?.editorOptions ?? anyDef.editorOptions,
    showTime: mergedMeta?.showTime ?? anyDef.showTime,
    isDateRange: mergedMeta?.isDateRange ?? anyDef.isDateRange,
    minDate: mergedMeta?.minDate ?? anyDef.minDate,
    maxDate: mergedMeta?.maxDate ?? anyDef.maxDate,
    isFormula: mergedMeta?.isFormula ?? anyDef.isFormula,
    isChart: mergedMeta?.isChart ?? anyDef.isChart,
    wrapText: mergedMeta?.wrapText ?? anyDef.wrapText ?? defaultColDef?.wrapText,
    colSpan: anyDef.colSpan ?? mergedMeta?.colSpan ?? defaultColDef?.colSpan,
    rowSpan: anyDef.rowSpan ?? mergedMeta?.rowSpan ?? defaultColDef?.rowSpan,
    disableHeaderContextMenu:
      mergedMeta?.disableHeaderContextMenu ?? anyDef.disableHeaderContextMenu,
    disableContextMenu: mergedMeta?.disableContextMenu ?? anyDef.disableContextMenu,
    sortable: anyDef.enableSorting ?? anyDef.sortable ?? defaultColDef?.enableSorting,
    filterable:
      anyDef.enableColumnFilter ?? anyDef.filterable ?? defaultColDef?.enableColumnFilter,
    enableGlobalFilter: anyDef.enableGlobalFilter ?? defaultColDef?.enableGlobalFilter,
    resizable: anyDef.enableResizing ?? anyDef.resizable ?? defaultColDef?.enableResizing,
    pinnable: anyDef.enablePinning ?? anyDef.pinnable ?? defaultColDef?.enablePinning,
    hideable: anyDef.enableHiding ?? anyDef.hideable ?? defaultColDef?.enableHiding,
    groupable: anyDef.enableGrouping ?? anyDef.groupable ?? defaultColDef?.enableGrouping,
    editable: anyDef.enableEditing ?? anyDef.editable ?? defaultColDef?.enableEditing,
    meta: mergedMeta,
    valueGetter,
  };

  if (typeof headerProp === 'function' && !normalizedCol.renderHeader) {
    normalizedCol.renderHeader = () => headerProp({ column: normalizedCol });
  }

  const cellFn = anyDef.cell ?? defaultColDef?.cell;
  if (!anyDef.renderCell && cellFn) {
    normalizedCol.renderCell = (params: CellRenderParams<TData>) => {
      const rowAny = params.row as any;
      const original = (rowAny?._baseRecord ?? params.row) as TData;
      const rowIdx =
        typeof rowAny?.originalIndex === 'number' ? rowAny.originalIndex : params.rowIndex;
      const rawKey = rowAny?._rowKey ?? rowAny?.id ?? rowIdx;
      const rowId = typeof rawKey === 'string' ? rawKey : String(rawKey);
      const getValue = () => (normalizedCol.valueGetter ?? valueGetter)(original, rowIdx);
      const renderValue = () => {
        const val = getValue();
        return val === undefined ? null : val;
      };
      return cellFn({
        getValue,
        renderValue,
        row: {
          original,
          index: rowIdx,
          id: rowId,
        },
        column: normalizedCol,
        isSelected: params.isSelected,
        isChecked: params.isChecked,
        isResponsive: params.isResponsive,
      });
    };
  }

  if (mergedMeta?.bindColumnRuntime) {
    Object.assign(
      normalizedCol,
      mergedMeta.bindColumnRuntime({
        column: normalizedCol,
        formulaMode: options.formulaMode ?? FORMULA_MODES.MAX,
        surfaceTheme: options.surfaceTheme ?? SURFACE_THEMES.LIGHT,
      })
    );
  }

  const rawPin = anyDef.pinned;
  if (rawPin && rawPin !== PIN_POSITIONS.NONE) {
    if (rawPin === PIN_POSITIONS.CENTER) {
      if (options.enableCenterDock !== false) {
        columnDefinedPins[key] = PIN_POSITIONS.CENTER;
      }
    } else if (rawPin === PIN_POSITIONS.LEFT || rawPin === PIN_POSITIONS.RIGHT) {
      if (options.enableColumnPinning !== false) {
        columnDefinedPins[key] = rawPin;
      }
    }
  }

  return normalizedCol;
}

/**
 * Chuẩn hóa định nghĩa cột từ chuẩn TanStack Table v8 / AG Grid về ColumnDef nội bộ
 * (tự trải phẳng GroupColumnDef thành header 2 tầng và gộp defaultColDef).
 */
export function normalizeGridColumns<TData = any>(
  defs: readonly GridColumnDef<TData, any>[] | undefined,
  defaultColDef?: DefaultColDef<TData>,
  options: NormalizeColumnsOptions = {}
): NormalizedGridColumnsResult<TData> {
  if (!defs || defs.length === 0) {
    return { flatColumns: [], columnDefinedPins: {} };
  }

  const flatColumns: ColumnDef<TData>[] = [];
  const columnDefinedPins: Record<string, PinPosition> = {};
  const hasAnyGroup = defs.some((d) => isGroupColumnDef(d));
  const columnGroups: BaseGroupDef[] | undefined = hasAnyGroup ? [] : undefined;
  let leafIndex = 0;

  const collectLeavesFromGroup = (
    items: readonly GridColumnDef<TData, any>[]
  ): string[] => {
    const childKeys: string[] = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (isGroupColumnDef(item)) {
        childKeys.push(...collectLeavesFromGroup(item.columns));
      } else {
        const normalized = normalizeLeafColumn(
          item,
          leafIndex++,
          defaultColDef,
          columnDefinedPins,
          options
        );
        flatColumns.push(normalized);
        childKeys.push(normalized.key);
      }
    }
    return childKeys;
  };

  for (let i = 0; i < defs.length; i++) {
    const def = defs[i];
    if (isGroupColumnDef(def)) {
      const childKeys = collectLeavesFromGroup(def.columns);
      if (columnGroups && childKeys.length > 0) {
        const groupId = def.id ?? `grp_${i}`;
        const groupTitle =
          typeof def.header === 'string' ? def.header : def.title ?? groupId;
        columnGroups.push({
          id: groupId,
          title: groupTitle,
          isStandalone: false,
          keys: childKeys,
          isToggleable: def.isToggleable,
          isCollapsed: def.isCollapsed,
          isAtomic: def.isAtomic,
        });
      }
    } else {
      const normalized = normalizeLeafColumn(
        def,
        leafIndex++,
        defaultColDef,
        columnDefinedPins,
        options
      );
      flatColumns.push(normalized);
      if (columnGroups) {
        columnGroups.push({
          id: normalized.key,
          title: normalized.title,
          isStandalone: true,
          keys: [normalized.key],
        });
      }
    }
  }

  return {
    flatColumns,
    columnGroups,
    columnDefinedPins,
  };
}
