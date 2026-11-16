import { useCallback } from 'react';
import { ColumnDef, BaseGroupDef, DATA_TYPES } from '../types';
import { isSelectionColumn } from '../gridFormatUtils';

interface UseColumnAutoFitParams<T> {
  colMap: Record<string, ColumnDef<T>>;
  effectiveColumns: ColumnDef<T>[];
  columnGroups?: BaseGroupDef[];
  getRowItem: (idx: number) => T;
  columnSums?: Record<string, number>;
  totalRows: number;
  setColWidth: (key: string, width: number) => void;
  setMultipleColWidths: (updates: Record<string, number>) => void;
}

function buildSummaryCollector<T>(
  sampleRows: T[],
  columnSums?: Record<string, number>
): (key: string) => (number | string)[] {
  return (key: string) => {
    const vals: (number | string)[] = [];
    if (columnSums && columnSums[key] !== undefined) {
      vals.push(columnSums[key]);
    }
    for (let i = 0; i < sampleRows.length; i++) {
      const r = sampleRows[i] as any;
      if (r?._isGroupRow && r?.groupSums?.[key] !== undefined) {
        vals.push(r.groupSums[key]);
      }
    }
    return vals;
  };
}

export function useColumnAutoFit<T>({
  colMap,
  effectiveColumns,
  columnGroups,
  getRowItem,
  columnSums,
  totalRows,
  setColWidth,
  setMultipleColWidths,
}: UseColumnAutoFitParams<T>) {
  const handleAutoFitColumn = useCallback(
    (colKey: string) => {
      const col = colMap[colKey];
      if (
        !col ||
        col.resizable === false ||
        col.dataType === DATA_TYPES.SYSTEM ||
        col.isRowNumber ||
        isSelectionColumn(col)
      ) {
        return;
      }
      void import('../gridAutoFitUtils').then(({ calcColAutoFitWidth, collectAutoFitSampleRows }) => {
        const sampleRows = collectAutoFitSampleRows(totalRows, getRowItem, 100);
        const collectColSummaryVals = buildSummaryCollector(sampleRows, columnSums);
        const newW = calcColAutoFitWidth(
          col,
          sampleRows,
          400,
          65,
          collectColSummaryVals(colKey),
          totalRows
        );
        setColWidth(colKey, newW);
      });
    },
    [colMap, getRowItem, columnSums, setColWidth, totalRows]
  );

  const handleAutoFitAllColumns = useCallback(() => {
    void import('../gridAutoFitUtils').then(({ calcColAutoFitWidth, collectAutoFitSampleRows }) => {
      const sampleRows = collectAutoFitSampleRows(totalRows, getRowItem, 100);
      const collectColSummaryVals = buildSummaryCollector(sampleRows, columnSums);
      const updates: Record<string, number> = {};
      effectiveColumns.forEach((col) => {
        if (
          col.resizable === false ||
          col.dataType === DATA_TYPES.SYSTEM ||
          col.isRowNumber ||
          isSelectionColumn(col)
        ) {
          return;
        }
        updates[col.key] = calcColAutoFitWidth(
          col,
          sampleRows,
          400,
          65,
          collectColSummaryVals(col.key),
          totalRows
        );
      });
      setMultipleColWidths(updates);
    });
  }, [effectiveColumns, getRowItem, columnSums, setMultipleColWidths, totalRows]);

  const handleAutoFitBandColumns = useCallback(
    (groupId: string) => {
      const group = columnGroups?.find((g) => g.id === groupId);
      if (!group) return;
      void import('../gridAutoFitUtils').then(({ calcColAutoFitWidth, collectAutoFitSampleRows }) => {
        const sampleRows = collectAutoFitSampleRows(totalRows, getRowItem, 100);
        const collectColSummaryVals = buildSummaryCollector(sampleRows, columnSums);
        const updates: Record<string, number> = {};
        group.keys.forEach((key) => {
          const col = colMap[key];
          if (
            col &&
            col.resizable !== false &&
            col.dataType !== DATA_TYPES.SYSTEM &&
            !col.isRowNumber &&
            !isSelectionColumn(col)
          ) {
            updates[key] = calcColAutoFitWidth(
              col,
              sampleRows,
              400,
              65,
              collectColSummaryVals(key),
              totalRows
            );
          }
        });
        setMultipleColWidths(updates);
      });
    },
    [columnGroups, colMap, getRowItem, columnSums, setMultipleColWidths, totalRows]
  );

  return {
    handleAutoFitColumn,
    handleAutoFitAllColumns,
    handleAutoFitBandColumns,
  };
}
