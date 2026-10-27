import { useCallback } from 'react';
import { ColumnDef, BaseGroupDef, DATA_TYPES } from '../types';
import { calcColAutoFitWidth } from '../gridUtils';

interface UseColumnAutoFitParams<T> {
  colMap: Record<string, ColumnDef<T>>;
  effectiveColumns: ColumnDef<T>[];
  columnGroups?: BaseGroupDef[];
  sampleRows: T[];
  columnSums?: Record<string, number>;
  totalRows: number;
  setColWidth: (key: string, width: number) => void;
  setMultipleColWidths: (updates: Record<string, number>) => void;
}

export function useColumnAutoFit<T>({
  colMap,
  effectiveColumns,
  columnGroups,
  sampleRows,
  columnSums,
  totalRows,
  setColWidth,
  setMultipleColWidths,
}: UseColumnAutoFitParams<T>) {
  // Tập hợp các giá trị tổng (Grand Total & Group Sums) để vừa độ rộng tối ưu không bị cắt số
  const collectColSummaryVals = useCallback(
    (key: string) => {
      const vals: (number | string)[] = [];
      if (columnSums && columnSums[key] !== undefined) {
        vals.push(columnSums[key]);
      }
      sampleRows.forEach((r: any) => {
        if (r?._isGroupRow && r?.groupSums?.[key] !== undefined) {
          vals.push(r.groupSums[key]);
        }
      });
      return vals;
    },
    [columnSums, sampleRows]
  );

  const handleAutoFitColumn = useCallback(
    (colKey: string) => {
      const col = colMap[colKey];
      if (
        !col ||
        col.resizable === false ||
        col.dataType === DATA_TYPES.SYSTEM ||
        col.isRowNumber ||
        col.isSelection
      ) {
        return;
      }
      const newW = calcColAutoFitWidth(
        col,
        sampleRows,
        400,
        65,
        collectColSummaryVals(colKey),
        totalRows
      );
      setColWidth(colKey, newW);
    },
    [colMap, sampleRows, setColWidth, collectColSummaryVals, totalRows]
  );

  const handleAutoFitAllColumns = useCallback(() => {
    const updates: Record<string, number> = {};
    effectiveColumns.forEach((col) => {
      if (
        col.resizable === false ||
        col.dataType === DATA_TYPES.SYSTEM ||
        col.isRowNumber ||
        col.isSelection
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
  }, [effectiveColumns, sampleRows, setMultipleColWidths, collectColSummaryVals, totalRows]);

  const handleAutoFitBandColumns = useCallback(
    (groupId: string) => {
      const group = columnGroups?.find((g) => g.id === groupId);
      if (!group) return;
      const updates: Record<string, number> = {};
      const targetKeys = group.keys;

      targetKeys.forEach((key) => {
        const col = colMap[key];
        if (
          col &&
          col.resizable !== false &&
          col.dataType !== DATA_TYPES.SYSTEM &&
          !col.isRowNumber &&
          !col.isSelection
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
    },
    [columnGroups, colMap, sampleRows, setMultipleColWidths, collectColSummaryVals, totalRows]
  );

  return {
    handleAutoFitColumn,
    handleAutoFitAllColumns,
    handleAutoFitBandColumns,
  };
}
