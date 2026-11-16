import React from 'react';
import {
  ColumnDef,
  PinPosition,
  PIN_POSITIONS,
  DATA_TYPES,
  EDITOR_TYPES,
  CenterDockStatus,
  CENTER_DOCK_STATUSES,
  SurfaceTheme,
} from './types';
import {
  getPinnedDividerClass,
  getRightPinnedDividerClass,
  getThemeClasses,
} from './constants';
import { getAlignJustifyClass, isSelectionColumn } from './gridFormatUtils';

export interface ColRenderMeta<T = any> {
  col: ColumnDef<T>;
  key: string;
  width: number;
  cellRole: 'stt' | 'chk' | 'expand' | 'data';
  editable: boolean;
  isEmptyCol: boolean;
  isDisableContextMenu: boolean;
  isNumber: boolean;
  isTime: boolean;
  isDateLike: boolean;
  hasCustomCellRender: boolean;
  stickyStyle: React.CSSProperties;
  classNameEven: string;
  classNameOdd: string;
  classNameSelected: string;
  classNameEditing: string;
}

export interface GridLayoutSnapshot<T = any> {
  columns: ColumnDef<T>[];
  colWidths: Record<string, number>;
  rowHeight: number;
  totalRowWidth: number;
  rowBoxStyle: React.CSSProperties;
  colRenderMetas: ColRenderMeta<T>[];
  colMetaByKey: Record<string, ColRenderMeta<T>>;
  surfaceTheme: SurfaceTheme;
  columnPins: Record<string, PinPosition>;
  leftOffsets: Record<string, number>;
  rightOffsets: Record<string, number>;
  lastEffectiveLeftColKey: string | null;
  firstEffectiveRightColKey: string | null;
  centerDockStatus: Record<string, CenterDockStatus>;
  centerLeftOffsets: Record<string, number>;
  centerRightOffsets: Record<string, number>;
  emptyColKeys?: Set<string>;
  dynamicRowHeight?: boolean;
}

const isCellEditable = (col: ColumnDef<any>): boolean =>
  col.editable !== false && col.dataType !== DATA_TYPES.SYSTEM;

export function buildColRenderMetas<T = any>(params: {
  columns: ColumnDef<T>[];
  colWidths: Record<string, number>;
  rowHeight: number;
  surfaceTheme: SurfaceTheme;
  columnPins: Record<string, PinPosition>;
  leftOffsets: Record<string, number>;
  rightOffsets: Record<string, number>;
  lastEffectiveLeftColKey: string | null;
  firstEffectiveRightColKey: string | null;
  centerDockStatus: Record<string, CenterDockStatus>;
  centerLeftOffsets: Record<string, number>;
  centerRightOffsets: Record<string, number>;
  emptyColKeys?: Set<string>;
  dynamicRowHeight?: boolean;
}): { metas: ColRenderMeta<T>[]; totalWidth: number } {
  const {
    columns,
    colWidths,
    rowHeight,
    surfaceTheme,
    columnPins,
    leftOffsets,
    rightOffsets,
    lastEffectiveLeftColKey,
    firstEffectiveRightColKey,
    centerDockStatus,
    centerLeftOffsets,
    centerRightOffsets,
    emptyColKeys,
    dynamicRowHeight = false,
  } = params;

  const theme = getThemeClasses(surfaceTheme);
  const leftDividerCls = getPinnedDividerClass(surfaceTheme);
  const rightDividerCls = getRightPinnedDividerClass(surfaceTheme);
  const metas: ColRenderMeta<T>[] = new Array(columns.length);
  let totalWidth = 0;

  for (let i = 0; i < columns.length; i++) {
    const col = columns[i];
    const width = colWidths[col.key] || col.defaultWidth;
    totalWidth += width;

    const pinPos = columnPins[col.key] || PIN_POSITIONS.NONE;
    const isPinnedLeft = pinPos === PIN_POSITIONS.LEFT;
    const isPinnedRight = pinPos === PIN_POSITIONS.RIGHT;
    const isCenterPinned = pinPos === PIN_POSITIONS.CENTER;
    const dock = isCenterPinned
      ? centerDockStatus[col.key] || CENTER_DOCK_STATUSES.NORMAL
      : CENTER_DOCK_STATUSES.NORMAL;

    const isDockedLeft = dock === CENTER_DOCK_STATUSES.LEFT;
    const isDockedRight = dock === CENTER_DOCK_STATUSES.RIGHT;
    const isEffectiveLeft = isPinnedLeft || isDockedLeft;
    const isEffectiveRight = isPinnedRight || isDockedRight;

    const isLeftDivider = col.key === lastEffectiveLeftColKey;
    const isRightDivider = col.key === firstEffectiveRightColKey;

    const isExpandCol = Boolean(col.isDetailExpand || col.key === 'col_detail_expand');
    const isSttCol = Boolean(
      !isExpandCol &&
        (col.isRowNumber ||
          col.key === 'col_stt' ||
          (col.dataType === DATA_TYPES.SYSTEM && Boolean(col.title)))
    );
    const isChkCol = !isExpandCol && isSelectionColumn(col);
    const cellRole = isSttCol ? 'stt' : isChkCol ? 'chk' : isExpandCol ? 'expand' : 'data';

    const usesSharedHeaderBg =
      isEffectiveLeft ||
      isEffectiveRight ||
      col.dataType === DATA_TYPES.SYSTEM ||
      isSttCol ||
      isChkCol ||
      isExpandCol;

    const cellHeightStyle: React.CSSProperties = dynamicRowHeight
      ? { width: `${width}px`, minHeight: `${rowHeight}px` }
      : { width: `${width}px`, height: `${rowHeight}px` };

    const stickyStyle: React.CSSProperties = isPinnedLeft
      ? { ...cellHeightStyle, position: 'sticky', left: `${leftOffsets[col.key]}px`, zIndex: 20 }
      : isDockedLeft
      ? { ...cellHeightStyle, position: 'sticky', left: `${centerLeftOffsets[col.key]}px`, zIndex: 20 }
      : isPinnedRight
      ? { ...cellHeightStyle, position: 'sticky', right: `${rightOffsets[col.key]}px`, zIndex: 20 }
      : isDockedRight
      ? { ...cellHeightStyle, position: 'sticky', right: `${centerRightOffsets[col.key]}px`, zIndex: 20 }
      : cellHeightStyle;

    const borderClasses = `${theme.borderBottom} ${
      isLeftDivider ? leftDividerCls : theme.borderRight
    }${isRightDivider ? ` ${rightDividerCls}` : ''}`;

    const isEmptyCol = Boolean(emptyColKeys?.has(col.key));
    const isNumber = col.dataType === DATA_TYPES.NUMBER;
    const isTime = col.dataType === DATA_TYPES.TIME || col.editorType === EDITOR_TYPES.TIME;
    const isDateLike =
      col.dataType === DATA_TYPES.DATE ||
      col.editorType === EDITOR_TYPES.DATE ||
      col.editorType === EDITOR_TYPES.DATERANGE ||
      Boolean(col.isDateRange);

    const typeCls = isNumber
      ? 'agv-cell-number '
      : isDateLike || isTime
      ? 'agv-cell-date '
      : col.className
      ? `${col.className} `
      : '';

    const padNormal = col.cellPadding
      ? col.cellPadding
      : col.dataType === DATA_TYPES.SYSTEM
      ? 'px-1'
      : 'px-2.5';

    const alignCls = getAlignJustifyClass(col.align);
    const shouldWrap = Boolean(dynamicRowHeight && col.wrapText);
    const heightAndWrapCls = shouldWrap
      ? 'agv-cell-wrap whitespace-normal [overflow-wrap:anywhere] py-2 leading-4 min-h-[32px]'
      : dynamicRowHeight
      ? 'whitespace-nowrap min-h-[32px]'
      : 'whitespace-nowrap min-h-[32px] max-h-[32px] leading-[32px]';
    const tailCommon = `text-xs ${borderClasses} shrink-0 overflow-hidden ${heightAndWrapCls} tabular-nums box-border ${typeCls}${
      isEmptyCol ? 'cursor-not-allowed select-none ' : ''
    }${alignCls}`;

    const bgFixed = isEmptyCol
      ? 'bg-surface-subtle opacity-60'
      : usesSharedHeaderBg
      ? theme.sharedHeaderCellBg
      : '';

    const bgEven = bgFixed || theme.rowEvenBg;
    const bgOdd = bgFixed || theme.rowOddBg;
    const bgSelected = bgFixed || theme.rowSelectedBg;

    metas[i] = {
      col,
      key: col.key,
      width,
      cellRole,
      editable: !isEmptyCol && isCellEditable(col),
      isEmptyCol,
      isDisableContextMenu: Boolean(col.disableContextMenu || col.dataType === DATA_TYPES.SYSTEM),
      isNumber,
      isTime,
      isDateLike,
      hasCustomCellRender: Boolean(col.renderCell),
      stickyStyle,
      classNameEven: `flex items-center ${padNormal} ${tailCommon} ${bgEven}`,
      classNameOdd: `flex items-center ${padNormal} ${tailCommon} ${bgOdd}`,
      classNameSelected: `flex items-center ${padNormal} ${tailCommon} ${bgSelected}`,
      classNameEditing: `flex items-center p-0.5 ${tailCommon} ${bgSelected}`,
    };
  }

  return { metas, totalWidth };
}

export function buildGridLayoutSnapshot<T = any>(params: {
  columns: ColumnDef<T>[];
  colWidths: Record<string, number>;
  rowHeight: number;
  surfaceTheme: SurfaceTheme;
  columnPins: Record<string, PinPosition>;
  leftOffsets: Record<string, number>;
  rightOffsets: Record<string, number>;
  lastEffectiveLeftColKey: string | null;
  firstEffectiveRightColKey: string | null;
  centerDockStatus: Record<string, CenterDockStatus>;
  centerLeftOffsets: Record<string, number>;
  centerRightOffsets: Record<string, number>;
  emptyColKeys?: Set<string>;
  dynamicRowHeight?: boolean;
}): GridLayoutSnapshot<T> {
  const { metas, totalWidth } = buildColRenderMetas(params);
  const colMetaByKey: Record<string, ColRenderMeta<T>> = {};
  for (let i = 0; i < metas.length; i++) {
    colMetaByKey[metas[i].key] = metas[i];
  }
  const isDynamic = Boolean(params.dynamicRowHeight);
  return {
    columns: params.columns,
    colWidths: params.colWidths,
    rowHeight: params.rowHeight,
    totalRowWidth: totalWidth,
    rowBoxStyle: isDynamic
      ? { minHeight: `${params.rowHeight}px`, width: `${totalWidth}px` }
      : { height: `${params.rowHeight}px`, width: `${totalWidth}px` },
    colRenderMetas: metas,
    colMetaByKey,
    surfaceTheme: params.surfaceTheme,
    columnPins: params.columnPins,
    leftOffsets: params.leftOffsets,
    rightOffsets: params.rightOffsets,
    lastEffectiveLeftColKey: params.lastEffectiveLeftColKey,
    firstEffectiveRightColKey: params.firstEffectiveRightColKey,
    centerDockStatus: params.centerDockStatus,
    centerLeftOffsets: params.centerLeftOffsets,
    centerRightOffsets: params.centerRightOffsets,
    emptyColKeys: params.emptyColKeys,
    dynamicRowHeight: isDynamic,
  };
}
