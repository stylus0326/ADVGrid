import type { TreeDataConfig } from './types';
export interface TreeNode<T = any> {
    key: string;
    record: T;
    sourceIndex: number;
    depth: number;
    parentKey: string | null;
    children: TreeNode<T>[];
}
export interface FlattenedTreeRow {
    sourceIndex: number;
    key: string;
    depth: number;
    hasChildren: boolean;
    isExpanded: boolean;
}
export interface TreeForestResult<T = any> {
    roots: TreeNode<T>[];
    nodeByKey: Map<string, TreeNode<T>>;
    flatRecords: T[];
    allExpandableKeys: string[];
    getKeysUpToDepth: (maxDepth: number) => string[];
}
export declare function buildTreeForest<T = any>(rows: readonly T[], getRowKey: (row: T, index: number) => string, config?: TreeDataConfig<T>): TreeForestResult<T>;
export declare function flattenVisibleTreeNodes<T = any>(params: {
    forest: TreeForestResult<T>;
    expandedKeys: ReadonlySet<string | number>;
    matchedIndexSet: ReadonlySet<number> | null;
    filterMode?: 'preserveAncestors' | 'strict';
    sortRankBySourceIndex?: Int32Array | null;
}): FlattenedTreeRow[];
