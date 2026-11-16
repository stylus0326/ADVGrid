import React, { memo } from 'react';
import { ALIGNMENTS, CellRenderParams, ColumnDef, SurfaceTheme } from '../types';
import { MorphCheckbox } from '../../ui/MorphCheckbox';
import { MorphChevronIcon } from '../../ui/MorphIcons';
import {
  compileTabletGroups,
  computeTabletTrackMinWidth,
  extractResponsiveRawValue,
  renderResponsiveField,
  type CompiledTabletGroup,
} from './responsiveColumnUtils';

export interface GridTabletRowProps<T = any> {
  row: T;
  rowIndex: number;
  rowKey: string | number;
  columns: ColumnDef<T>[];
  compiledGroups?: CompiledTabletGroup<T>[];
  rowHeight: number;
  isSelected: boolean;
  isChecked: boolean;
  showRowNumber?: boolean;
  showSelectionCol?: boolean;
  onSelectRow?: (rowIndex: number, row: T) => void;
  onToggleCheck?: (rowIndex: number, row: T, e: React.MouseEvent) => void;
  onCellContextMenu?: (rowIndex: number, row: T, colKey: string, e: React.MouseEvent) => void;
  surfaceTheme: SurfaceTheme;
  renderCell?: (params: CellRenderParams<T>) => React.ReactNode;
  allowTextSelection?: boolean;
}

function GridTabletRowInner<T = any>({
  row,
  rowIndex,
  columns,
  compiledGroups,
  rowHeight,
  isSelected,
  isChecked,
  showRowNumber = true,
  showSelectionCol = true,
  onSelectRow,
  onToggleCheck,
  onCellContextMenu,
  renderCell,
  allowTextSelection = false,
}: GridTabletRowProps<T>) {
  const isEven = rowIndex % 2 === 0;
  const r = row as any;
  const effectiveGroups =
    compiledGroups && compiledGroups.length > 0
      ? compiledGroups
      : compileTabletGroups(columns);
  const trackMinWidth = computeTabletTrackMinWidth(
    effectiveGroups,
    showRowNumber,
    showSelectionCol
  );

  if (r?._isGroupRow) {
    return (
      <div
        onClick={() => r.onToggleCollapse?.()}
        data-row-idx={rowIndex}
        style={{
          height: `${rowHeight}px`,
          maxHeight: `${rowHeight}px`,
          minWidth: trackMinWidth > 0 ? `${trackMinWidth}px` : undefined,
          boxSizing: 'border-box',
          borderColor: 'var(--agv-border)',
          backgroundColor: 'var(--agv-bg-header, var(--agv-bg-row-alt))',
        }}
        className="agv-group-row w-full flex items-center justify-between border-b px-3 text-xs cursor-pointer select-none"
      >
        <div className="flex items-center gap-2 min-w-0">
          <MorphChevronIcon expanded={Boolean(r.isExpanded)} size={16} spring="snappy" />
          <span className="font-semibold truncate" style={{ color: 'var(--agv-text-main)' }}>
            {String(r.groupValue ?? '')}
          </span>
          <span className="text-xs shrink-0" style={{ color: 'var(--agv-text-muted)' }}>
            ({r.count ?? 0})
          </span>
        </div>
      </div>
    );
  }

  const renderField = (col: ColumnDef<T>, colIndex: number) =>
    renderResponsiveField({
      row,
      rowIndex,
      colIndex,
      col,
      isSelected,
      isChecked,
      renderCell,
    });

  return (
    <div
      onClick={() => onSelectRow?.(rowIndex, row)}
      data-row-idx={rowIndex}
      data-row-parity={isEven ? 'even' : 'odd'}
      data-row-focused={isSelected ? 'true' : undefined}
      data-row-checked={isChecked ? 'true' : undefined}
      style={{
        height: `${rowHeight}px`,
        maxHeight: `${rowHeight}px`,
        minWidth: trackMinWidth > 0 ? `${trackMinWidth}px` : undefined,
        boxSizing: 'border-box',
        borderColor: 'var(--agv-border)',
        backgroundColor: 'var(--agv-row-data-bg)',
      }}
      className={`agv-grid-row w-full flex items-center border-b px-3 text-xs cursor-default ${
        allowTextSelection ? 'select-text' : 'select-none'
      } transition-colors`}
    >
      {/* Ô STT & Chọn */}
      {(showRowNumber || showSelectionCol) && (
        <div className="w-10 shrink-0 flex flex-col items-center justify-center gap-1 mr-2">
          {showRowNumber && (
            <span
              data-cell-role="stt"
              className="text-xs leading-4 tabular-nums font-mono font-semibold px-1 rounded transition-colors"
              style={{
                backgroundColor: isSelected ? 'var(--surface-selected)' : 'transparent',
                color: isSelected
                  ? 'var(--brand-gold-on-light, var(--brand-gold))'
                  : 'var(--agv-text-muted)',
              }}
            >
              {String(rowIndex + 1).padStart(2, '0')}
            </span>
          )}
          {showSelectionCol && (
            <div onClick={(e) => e.stopPropagation()}>
              <MorphCheckbox
                checked={isChecked}
                onChange={(e) => onToggleCheck?.(rowIndex, row, e)}
                size={16}
                spring="snappy"
              />
            </div>
          )}
        </div>
      )}

      {/* Siêu-cột xếp tối đa 3 dòng (không kẻ vạch dọc trong thân bảng) */}
      {effectiveGroups.map((group, groupIdx) => {
        const isFirst = groupIdx === 0;
        const isLast = groupIdx === effectiveGroups.length - 1;
        const padClass = isFirst ? 'pr-3' : isLast ? 'pl-3' : 'px-3';
        const alignClass =
          group.align === ALIGNMENTS.RIGHT
            ? 'items-end text-right'
            : group.align === ALIGNMENTS.CENTER
              ? 'items-center text-center'
              : 'items-start text-left';

        const sizeStyle: React.CSSProperties = group.width
          ? { width: `${group.width}px` }
          : { minWidth: `${group.minWidth}px` };

        return (
          <div
            key={group.id}
            style={sizeStyle}
            className={`flex flex-col justify-center gap-1 min-w-0 ${
              group.width ? 'shrink-0' : 'flex-1'
            } ${padClass} ${alignClass}`}
          >
            {group.lines.map((line) => {
              if (line.isChart) {
                return (
                  <div
                    key={line.col.key}
                    onContextMenu={
                      onCellContextMenu
                        ? (e) => onCellContextMenu(rowIndex, row, line.col.key, e)
                        : undefined
                    }
                    className={`${
                      group.hasStandaloneChart ? 'h-12' : 'h-9'
                    } w-full flex items-center`}
                  >
                    {renderField(line.col, line.colIndex)}
                  </div>
                );
              }

              const hasJoins = Boolean(line.joinCols && line.joinCols.length > 0);
              const isStrong = line.emphasis === 'strong' || line.isPrimaryFirstLine;
              const isMuted = line.emphasis === 'muted';
              const valueColor = isMuted ? 'var(--agv-text-muted)' : 'var(--agv-text-main)';

              const renderLineValue = () => {
                if (!hasJoins) {
                  return renderField(line.col, line.colIndex);
                }
                const candidateItems = [
                  { col: line.col, colIndex: line.colIndex },
                  ...line.joinCols!,
                ].filter((item) => {
                  const raw = extractResponsiveRawValue(row, item.col, rowIndex);
                  return raw !== null && raw !== undefined && String(raw).trim() !== '';
                });
                if (candidateItems.length === 0) {
                  return '—';
                }
                return candidateItems.map((item, idx) => (
                  <React.Fragment key={item.col.key}>
                    {idx > 0 && (
                      <span className="mx-1" style={{ color: 'var(--agv-text-muted)' }}>
                        {line.joinSeparator}
                      </span>
                    )}
                    {renderField(item.col, item.colIndex)}
                  </React.Fragment>
                ));
              };

              const effectiveLabel = line.labelGetter
                ? line.labelGetter(((row as any)?._baseRecord ?? row) as T, rowIndex)
                : line.label;

              return (
                <div
                  key={line.col.key}
                  onContextMenu={
                    onCellContextMenu
                      ? (e) => onCellContextMenu(rowIndex, row, line.col.key, e)
                      : undefined
                  }
                  className={`max-w-full truncate text-xs leading-4 ${
                    isStrong ? 'font-semibold' : ''
                  }`}
                  style={{
                    color: isStrong ? 'var(--agv-text-main)' : 'var(--agv-text-muted)',
                  }}
                >
                  {effectiveLabel && (
                    <span style={{ color: 'var(--agv-text-muted)' }}>{effectiveLabel}: </span>
                  )}
                  <span
                    className={
                      [
                        isStrong ? 'font-semibold' : '',
                        isMuted ? '[&_span]:!text-[var(--agv-text-muted)]' : '',
                      ]
                        .filter(Boolean)
                        .join(' ') || undefined
                    }
                    style={{ color: valueColor }}
                  >
                    {renderLineValue()}
                  </span>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export const GridTabletRow = memo(GridTabletRowInner) as <T = any>(
  props: GridTabletRowProps<T>
) => React.ReactElement | null;
