import React, { memo } from 'react';

export interface GridDetailRowProps<T = any> {
  row: T;
  rowIndex: number;
  rowKey: string | number;
  totalRowWidth: number;
  renderDetailRow?: (row: T) => React.ReactNode;
}

function GridDetailRowInner<T = any>({
  row,
  rowIndex,
  rowKey,
  totalRowWidth,
  renderDetailRow,
}: GridDetailRowProps<T>) {
  const rowAny = row as any;
  const fixedHeight =
    typeof rowAny?._detailFixedHeight === 'number' && Number.isFinite(rowAny._detailFixedHeight)
      ? Math.max(28, Math.round(rowAny._detailFixedHeight))
      : undefined;
  const isUnstyled = Boolean(rowAny?._detailUnstyled);
  const content = renderDetailRow ? renderDetailRow(row) : null;

  return (
    <div
      data-agv-detail-row="true"
      data-agv-detail-fixed={fixedHeight !== undefined ? 'true' : undefined}
      data-row-key={String(rowKey)}
      data-row-idx={rowIndex}
      style={{
        width: `var(--agv-total-grid-w, ${totalRowWidth}px)`,
        minWidth: `var(--agv-total-grid-w, ${totalRowWidth}px)`,
        ...(fixedHeight !== undefined
          ? { height: `${fixedHeight}px`, minHeight: `${fixedHeight}px` }
          : {}),
        backgroundColor: 'var(--agv-bg-root)',
      }}
      className="agv-detail-row border-b border-[var(--agv-border)] box-border"
    >
      <div
        style={{
          position: 'sticky',
          left: 0,
          width: 'var(--agv-viewport-w, 100%)',
          maxWidth: `var(--agv-total-grid-w, ${totalRowWidth}px)`,
        }}
        className="p-3 box-border"
      >
        {isUnstyled ? (
          content
        ) : (
          <div
            className="rounded-lg border p-3 box-border overflow-hidden"
            style={{
              backgroundColor: 'var(--agv-bg-card, var(--agv-bg-row))',
              borderColor: 'var(--agv-border)',
              color: 'var(--agv-text-main)',
            }}
          >
            {content}
          </div>
        )}
      </div>
    </div>
  );
}

export const GridDetailRow = memo(
  GridDetailRowInner,
  (prev, next) =>
    prev.row === next.row &&
    prev.rowIndex === next.rowIndex &&
    prev.rowKey === next.rowKey &&
    prev.totalRowWidth === next.totalRowWidth &&
    prev.renderDetailRow === next.renderDetailRow
) as <T = any>(props: GridDetailRowProps<T>) => React.ReactElement | null;
