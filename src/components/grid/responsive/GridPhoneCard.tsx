import React, { memo, useMemo } from 'react';
import { CellRenderParams, ColumnDef, SurfaceTheme } from '../types';
import { MorphCheckbox } from '../../ui/MorphCheckbox';
import { MorphChevronIcon } from '../../ui/MorphIcons';
import { AdvButton } from '../../ui/AdvButton';
import {
  type CompiledPhoneCard,
  type CompiledTabletLine,
  compilePhoneCard,
  extractResponsiveRawValue,
  renderResponsiveField,
  resolveCompiledLineLabel,
} from './responsiveColumnUtils';

export interface GridPhoneCardProps<T = any> {
  row: T;
  rowIndex: number;
  rowKey: string | number;
  columns: ColumnDef<T>[];
  compiledPhoneCard?: CompiledPhoneCard<T>;
  rowHeight: number;
  isSelected: boolean;
  isChecked: boolean;
  isExpanded?: boolean;
  showRowNumber?: boolean;
  showSelectionCol?: boolean;
  onToggleExpand?: (rowKey: string | number, rowIndex: number) => void;
  onSelectRow?: (rowIndex: number, row: T) => void;
  onRowDetail?: (row: T, rowIndex: number) => void;
  onToggleCheck?: (rowIndex: number, row: T, e: React.MouseEvent) => void;
  onCellContextMenu?: (rowIndex: number, row: T, colKey: string, e: React.MouseEvent) => void;
  surfaceTheme: SurfaceTheme;
  renderCell?: (params: CellRenderParams<T>) => React.ReactNode;
  allowTextSelection?: boolean;
}

function GridPhoneCardInner<T = any>({
  row,
  rowIndex,
  rowKey,
  columns,
  compiledPhoneCard,
  rowHeight = 108,
  isSelected,
  isChecked,
  isExpanded = false,
  showRowNumber = true,
  showSelectionCol = true,
  onToggleExpand,
  onSelectRow,
  onRowDetail,
  onToggleCheck,
  onCellContextMenu,
  renderCell,
  allowTextSelection = false,
}: GridPhoneCardProps<T>) {
  const plan = useMemo(
    () => compiledPhoneCard ?? compilePhoneCard(columns),
    [compiledPhoneCard, columns]
  );

  const r = row as any;
  const slotHeight =
    isExpanded && plan.hasExpandableDrawer ? rowHeight + plan.extraHeight : rowHeight;
  const cardHeight = slotHeight - 8;

  if (r?._isGroupRow) {
    return (
      <div
        style={{
          height: `${rowHeight}px`,
          maxHeight: `${rowHeight}px`,
          padding: '4px 8px',
          boxSizing: 'border-box',
        }}
        className="agv-phone-card-slot w-full shrink-0"
      >
        <div
          onClick={() => r.onToggleCollapse?.()}
          data-row-idx={rowIndex}
          style={{
            height: `${rowHeight - 8}px`,
            maxHeight: `${rowHeight - 8}px`,
            boxSizing: 'border-box',
            backgroundColor: 'var(--agv-bg-header, var(--agv-bg-row-alt))',
            borderColor: 'var(--agv-border)',
          }}
          className="agv-group-row w-full rounded-xl border p-3 text-xs select-none cursor-pointer flex items-center justify-between gap-2"
        >
          <div className="flex items-center gap-2 min-w-0">
            <MorphChevronIcon expanded={Boolean(r.isExpanded)} size={16} spring="snappy" />
            <span className="font-semibold truncate" style={{ color: 'var(--agv-text-main)' }}>
              {String(r.groupValue ?? '')}
            </span>
          </div>
          <span className="text-xs shrink-0" style={{ color: 'var(--agv-text-muted)' }}>
            ({r.count ?? 0})
          </span>
        </div>
      </div>
    );
  }

  const canExpand = plan.hasExpandableDrawer || isExpanded;

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

  const renderLineValue = (line: CompiledTabletLine<T>): React.ReactNode => {
    if (!line.joinCols || line.joinCols.length === 0) {
      return renderField(line.col, line.colIndex);
    }
    const candidates = [
      { col: line.col, colIndex: line.colIndex },
      ...line.joinCols,
    ].filter((item) => {
      const raw = extractResponsiveRawValue(row, item.col, rowIndex);
      return raw !== null && raw !== undefined && String(raw).trim() !== '';
    });
    if (candidates.length === 0) {
      return '—';
    }
    return candidates.map((item, idx) => (
      <React.Fragment key={item.col.key}>
        {idx > 0 && (
          <span className="mx-1 font-medium" style={{ color: 'var(--agv-text-muted)' }}>
            {line.joinSeparator.trim() || '·'}
          </span>
        )}
        {renderField(item.col, item.colIndex)}
      </React.Fragment>
    ));
  };

  const renderLabeledLine = (line: CompiledTabletLine<T>): React.ReactNode => {
    const label = resolveCompiledLineLabel(line, row, rowIndex);
    return (
      <>
        {label ? <span style={{ color: 'var(--agv-text-muted)' }}>{label}: </span> : null}
        <span
          className="font-semibold tabular-nums"
          style={{
            color:
              line.emphasis === 'muted' ? 'var(--agv-text-muted)' : 'var(--agv-text-main)',
          }}
        >
          {renderLineValue(line)}
        </span>
      </>
    );
  };

  return (
    <div
      style={{
        height: `${slotHeight}px`,
        maxHeight: `${slotHeight}px`,
        padding: '4px 8px',
        boxSizing: 'border-box',
      }}
      className="agv-phone-card-slot w-full shrink-0"
    >
      <article
        onClick={() => onSelectRow?.(rowIndex, row)}
        data-row-idx={rowIndex}
        data-card-focused={isSelected ? 'true' : undefined}
        data-card-checked={isChecked ? 'true' : undefined}
        style={{
          height: `${cardHeight}px`,
          maxHeight: `${cardHeight}px`,
          boxSizing: 'border-box',
        }}
        className={`agv-phone-card w-full rounded-xl border p-3 text-xs ${
          allowTextSelection ? 'select-text' : 'select-none'
        } transition-colors cursor-default flex flex-col overflow-hidden`}
      >
        {/* Hàng 1: Checkbox + STT + Định danh chính (trái) và Nhãn trạng thái (phải), cao chuẩn 28px */}
        <div className="h-7 min-h-[28px] flex items-center justify-between gap-2 min-w-0 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            {showSelectionCol && (
              <div onClick={(e) => e.stopPropagation()} className="shrink-0">
                <MorphCheckbox
                  checked={isChecked}
                  onChange={(e) => onToggleCheck?.(rowIndex, row, e)}
                  size={16}
                  spring="snappy"
                />
              </div>
            )}
            {showRowNumber && (
              <span
                data-cell-role="stt"
                className="text-xs leading-4 tabular-nums font-mono font-semibold shrink-0 transition-colors"
                style={{
                  color: isSelected
                    ? 'var(--brand-gold-on-light, var(--brand-gold))'
                    : 'var(--agv-text-muted)',
                }}
              >
                {String(rowIndex + 1).padStart(2, '0')}
              </span>
            )}
            {plan.title && (
              <div
                className="agv-phone-card-title min-w-0 truncate text-sm leading-5 font-bold"
                style={{ color: 'var(--agv-text-main)' }}
              >
                {renderLineValue(plan.title)}
              </div>
            )}
          </div>

          {plan.badge && (
            <div className="shrink-0 flex items-center text-xs" style={{ color: 'var(--agv-text-main)' }}>
              {renderLineValue(plan.badge)}
            </div>
          )}
        </div>

        {/* Đường kẻ 1 + Hàng 2: Thông tin tóm tắt + Nút đóng/mở (đối xứng 8px / 8px, cao 28px) */}
        <div
          className="mt-2 pt-2 border-t shrink-0"
          style={{ borderColor: 'var(--agv-border)' }}
        >
          <div className="h-7 min-h-[28px] flex items-center justify-between gap-2 text-xs">
            <div className="min-w-0 truncate">
              {plan.summary.map((item, idx) => (
                <React.Fragment key={item.col.key}>
                  {idx > 0 && (
                    <span className="mx-2" style={{ color: 'var(--agv-text-muted)' }}>
                      ·
                    </span>
                  )}
                  {renderLabeledLine(item)}
                </React.Fragment>
              ))}
            </div>

            {canExpand && (
              <AdvButton
                variant="ghost"
                size="icon-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleExpand?.(rowKey, rowIndex);
                }}
                aria-label={isExpanded ? 'Thu gọn' : 'Mở rộng'}
              >
                <MorphChevronIcon expanded={isExpanded} type="down-up" size={16} spring="snappy" />
              </AdvButton>
            )}
          </div>
        </div>

        {/* Đường kẻ 2 + Ngăn kéo mở rộng: Không cuộn bên trong, đồng nhất 8px với tầng trên */}
        {isExpanded && plan.hasExpandableDrawer && (
          <div
            className="mt-2 pt-2 border-t flex flex-col gap-2 overflow-hidden text-xs shrink-0"
            style={{ borderColor: 'var(--agv-border)' }}
          >
            {plan.chartBand && (
              <div
                onContextMenu={
                  onCellContextMenu
                    ? (e) => {
                        e.stopPropagation();
                        onCellContextMenu(
                          rowIndex,
                          row,
                          plan.chartBand!.formulaLine?.col.key ??
                            plan.chartBand!.chartLine.col.key,
                          e
                        );
                      }
                    : undefined
                }
                className="h-[52px] min-h-[52px] max-h-[52px] rounded-lg border p-2 flex items-center justify-between gap-2 shrink-0"
                style={{
                  backgroundColor: 'var(--agv-bg-root)',
                  borderColor: 'var(--agv-border)',
                }}
              >
                <div className="flex flex-col justify-center shrink-0 min-w-0">
                  {plan.chartBand.formulaLine ? (
                    <>
                      <span
                        className="text-xs leading-4 truncate"
                        style={{ color: 'var(--agv-text-muted)' }}
                      >
                        {resolveCompiledLineLabel(plan.chartBand.formulaLine, row, rowIndex) ??
                          plan.chartBand.formulaLine.col.title ??
                          plan.chartBand.formulaLine.col.key}
                      </span>
                      <div className="truncate leading-4">
                        {renderField(
                          plan.chartBand.formulaLine.col,
                          plan.chartBand.formulaLine.colIndex
                        )}
                      </div>
                    </>
                  ) : (
                    <span
                      className="text-xs leading-4 truncate"
                      style={{ color: 'var(--agv-text-muted)' }}
                    >
                      {plan.chartBand.chartLine.col.title || plan.chartBand.chartLine.col.key}
                    </span>
                  )}
                </div>

                <div className="w-[180px] h-8 shrink-0 flex items-center">
                  {renderField(plan.chartBand.chartLine.col, plan.chartBand.chartLine.colIndex)}
                </div>
              </div>
            )}

            {plan.infoRows.length > 0 && (
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
                {plan.infoRows.map((infoRow, idx) => {
                  const isButtonRow = Boolean(infoRow.showDetailButton && plan.detailButtonLabel);
                  return (
                    <React.Fragment key={`info_row_${idx}`}>
                      <div className="h-7 min-h-[28px] flex items-center min-w-0">
                        <div className="min-w-0 truncate">
                          {infoRow.left ? renderLabeledLine(infoRow.left) : null}
                        </div>
                      </div>
                      <div
                        className={`h-7 min-h-[28px] flex items-center justify-end ${
                          isButtonRow
                            ? 'whitespace-nowrap shrink-0'
                            : 'max-w-[176px] justify-self-end min-w-0'
                        }`}
                      >
                        {isButtonRow ? (
                          <AdvButton
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onRowDetail) onRowDetail(row, rowIndex);
                              else onSelectRow?.(rowIndex, row);
                            }}
                            className="whitespace-nowrap font-medium"
                          >
                            {plan.detailButtonLabel}
                          </AdvButton>
                        ) : infoRow.right ? (
                          <div className="truncate text-right">{renderLabeledLine(infoRow.right)}</div>
                        ) : null}
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </article>
    </div>
  );
}

export const GridPhoneCard = memo(GridPhoneCardInner) as <T = any>(
  props: GridPhoneCardProps<T>
) => React.ReactElement | null;
