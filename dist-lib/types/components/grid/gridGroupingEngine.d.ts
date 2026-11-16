import { ColumnDef, GroupSortConfig } from './types';
export interface GroupBucketEntry {
    groupValue: string;
    indices: number[];
    sums: Record<string, number>;
}
export interface GroupBucketsResult {
    colTitle: string;
    entries: GroupBucketEntry[];
}
export declare function buildGroupBuckets<T>(params: {
    groupByColumnKey: string;
    pagedRowIndices: number[] | null;
    totalPageRowCount: number;
    getRowVal: (origIdx: number, colKey: string) => any;
    colMap: Record<string, ColumnDef<T>>;
    numericColumnKeys: string[];
}): GroupBucketsResult;
export declare function buildGroupedDisplayModel(params: {
    groupBuckets: GroupBucketsResult;
    groupByColumnKey: string;
    groupSortConfig: GroupSortConfig | null;
    expandedGroupPaths: Set<string>;
    onToggleCollapse: (path: string) => void;
}): any[];
export declare function copyGroupTableToClipboard<T>(params: {
    groupRow: any;
    includeHeaders?: boolean;
    orderedColumns: ColumnDef<T>[];
    hiddenColKeys: Set<string>;
    getRowVal: (origIdx: number, colKey: string) => any;
}): Promise<void>;
export declare function computeStickyGroupIndexAtTop(params: {
    currentTop: number;
    totalRows: number;
    actualRowHeight: number;
    getRowItem: (idx: number) => any;
    getRowTop?: (idx: number) => number;
    findRowIndexAtOffset?: (offsetY: number) => number;
}): number | null;
