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

function defaultExtractChildren<T>(
  row: T,
  childrenField: string,
  getSubRows?: (row: T) => readonly T[] | undefined | null
): readonly T[] | undefined {
  if (getSubRows) {
    const res = getSubRows(row);
    return Array.isArray(res) && res.length > 0 ? res : undefined;
  }
  const raw = row ? (row as any)[childrenField] : undefined;
  return Array.isArray(raw) && raw.length > 0 ? raw : undefined;
}

/**
 * Xây dựng cấu trúc cây từ mảng lồng (`children` / `getSubRows`) hoặc mảng phẳng tự tham chiếu (`parentKeyField`).
 * Xuất ra danh sách bản ghi phẳng (`flatRecords`) để tái sử dụng toàn bộ bộ lọc, tìm kiếm và sắp xếp của DataGrid.
 */
export function buildTreeForest<T = any>(
  rows: readonly T[],
  getRowKey: (row: T, index: number) => string,
  config?: TreeDataConfig<T>
): TreeForestResult<T> {
  const roots: TreeNode<T>[] = [];
  const nodeByKey = new Map<string, TreeNode<T>>();
  const flatRecords: T[] = [];
  const allExpandableKeys: string[] = [];

  if (!rows || rows.length === 0) {
    return {
      roots,
      nodeByKey,
      flatRecords,
      allExpandableKeys,
      getKeysUpToDepth: () => [],
    };
  }

  const childrenField = String(config?.childrenField ?? 'children');
  const getSubRows = config?.getSubRows;
  const parentKeyField = config?.parentKeyField ? String(config.parentKeyField) : undefined;
  const rootParentValue = config?.rootParentValue;

  if (parentKeyField) {
    const nodes: TreeNode<T>[] = [];
    const seenKeys = new Set<string>();

    for (let i = 0; i < rows.length; i++) {
      const rec = rows[i];
      if (!rec) continue;
      let key = String(getRowKey(rec, i));
      if (seenKeys.has(key)) {
        key = `${key}_${i}`;
      }
      seenKeys.add(key);

      const rawParent = (rec as any)[parentKeyField];
      const isRootParent =
        rawParent === undefined ||
        rawParent === null ||
        rawParent === '' ||
        (rootParentValue !== undefined && rawParent === rootParentValue);
      const parentKey = isRootParent ? null : String(rawParent);

      const idx = flatRecords.length;
      flatRecords.push(rec);
      const node: TreeNode<T> = {
        key,
        record: rec,
        sourceIndex: idx,
        depth: 0,
        parentKey,
        children: [],
      };
      nodes.push(node);
      nodeByKey.set(key, node);
    }

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if (node.parentKey !== null) {
        const parent = nodeByKey.get(node.parentKey);
        if (parent && parent.key !== node.key) {
          parent.children.push(node);
          continue;
        }
      }
      node.parentKey = null;
      roots.push(node);
    }

    const assignDepths = (node: TreeNode<T>, depth: number, trail: Set<string>) => {
      if (trail.has(node.key)) return;
      trail.add(node.key);
      node.depth = depth;
      if (node.children.length > 0) {
        allExpandableKeys.push(node.key);
        for (let i = 0; i < node.children.length; i++) {
          assignDepths(node.children[i], depth + 1, trail);
        }
      }
      trail.delete(node.key);
    };

    const trail = new Set<string>();
    for (let i = 0; i < roots.length; i++) {
      assignDepths(roots[i], 0, trail);
    }
  } else {
    const seenKeys = new Set<string>();

    const visit = (rec: T, depth: number, parentKey: string | null): TreeNode<T> | null => {
      if (!rec) return null;
      const idx = flatRecords.length;
      let key = String(getRowKey(rec, idx));
      if (seenKeys.has(key)) {
        key = `${key}_${idx}`;
      }
      seenKeys.add(key);
      flatRecords.push(rec);

      const node: TreeNode<T> = {
        key,
        record: rec,
        sourceIndex: idx,
        depth,
        parentKey,
        children: [],
      };
      nodeByKey.set(key, node);

      const subRows = defaultExtractChildren(rec, childrenField, getSubRows);
      if (subRows && subRows.length > 0) {
        allExpandableKeys.push(key);
        for (let i = 0; i < subRows.length; i++) {
          const childNode = visit(subRows[i], depth + 1, key);
          if (childNode) {
            node.children.push(childNode);
          }
        }
      }
      return node;
    };

    for (let i = 0; i < rows.length; i++) {
      const rootNode = visit(rows[i], 0, null);
      if (rootNode) roots.push(rootNode);
    }
  }

  const getKeysUpToDepth = (maxDepth: number): string[] => {
    if (maxDepth <= 0) return [];
    const keys: string[] = [];
    nodeByKey.forEach((node) => {
      if (node.children.length > 0 && node.depth < maxDepth) {
        keys.push(node.key);
      }
    });
    return keys;
  };

  return {
    roots,
    nodeByKey,
    flatRecords,
    allExpandableKeys,
    getKeysUpToDepth,
  };
}

/**
 * Làm phẳng danh sách các nút cây đang hiển thị theo trạng thái mở rộng, bộ lọc (tự giữ nhánh cha)
 * và sắp xếp giữa các nút anh em cùng cấp (`sortRankBySourceIndex`).
 */
export function flattenVisibleTreeNodes<T = any>(params: {
  forest: TreeForestResult<T>;
  expandedKeys: ReadonlySet<string | number>;
  matchedIndexSet: ReadonlySet<number> | null;
  filterMode?: 'preserveAncestors' | 'strict';
  sortRankBySourceIndex?: Int32Array | null;
}): FlattenedTreeRow[] {
  const {
    forest,
    expandedKeys,
    matchedIndexSet,
    filterMode = 'preserveAncestors',
    sortRankBySourceIndex,
  } = params;

  const result: FlattenedTreeRow[] = [];
  if (forest.roots.length === 0) return result;

  const isExpandedKey = (key: string) => expandedKeys.has(key);

  const sortSiblings = (nodes: TreeNode<T>[]): TreeNode<T>[] => {
    if (!sortRankBySourceIndex || nodes.length <= 1) return nodes;
    return [...nodes].sort((a, b) => {
      const ra = sortRankBySourceIndex[a.sourceIndex] ?? a.sourceIndex;
      const rb = sortRankBySourceIndex[b.sourceIndex] ?? b.sourceIndex;
      return ra - rb;
    });
  };

  if (matchedIndexSet === null) {
    const walk = (nodes: TreeNode<T>[]) => {
      const ordered = sortSiblings(nodes);
      for (let i = 0; i < ordered.length; i++) {
        const node = ordered[i];
        const hasChildren = node.children.length > 0;
        const isExpanded = hasChildren && isExpandedKey(node.key);
        result.push({
          sourceIndex: node.sourceIndex,
          key: node.key,
          depth: node.depth,
          hasChildren,
          isExpanded,
        });
        if (isExpanded) {
          walk(node.children);
        }
      }
    };
    walk(forest.roots);
    return result;
  }

  if (filterMode === 'strict') {
    const walkStrict = (nodes: TreeNode<T>[]) => {
      const ordered = sortSiblings(nodes);
      for (let i = 0; i < ordered.length; i++) {
        const node = ordered[i];
        const hasChildren = node.children.length > 0;
        const isExpanded = hasChildren && isExpandedKey(node.key);
        if (matchedIndexSet.has(node.sourceIndex)) {
          result.push({
            sourceIndex: node.sourceIndex,
            key: node.key,
            depth: node.depth,
            hasChildren,
            isExpanded,
          });
        }
        if (hasChildren && (isExpanded || matchedIndexSet.has(node.sourceIndex))) {
          walkStrict(node.children);
        }
      }
    };
    walkStrict(forest.roots);
    return result;
  }

  // preserveAncestors: giữ nhánh cha nếu con cháu khớp bộ lọc
  const descendantMatchMap = new Map<string, boolean>();
  const computeMatch = (node: TreeNode<T>): boolean => {
    let anyChildMatch = false;
    for (let i = 0; i < node.children.length; i++) {
      if (computeMatch(node.children[i])) {
        anyChildMatch = true;
      }
    }
    const selfMatch = matchedIndexSet.has(node.sourceIndex);
    const keep = selfMatch || anyChildMatch;
    descendantMatchMap.set(node.key, anyChildMatch);
    return keep;
  };

  for (let i = 0; i < forest.roots.length; i++) {
    computeMatch(forest.roots[i]);
  }

  const walkFiltered = (nodes: TreeNode<T>[]) => {
    const ordered = sortSiblings(nodes);
    for (let i = 0; i < ordered.length; i++) {
      const node = ordered[i];
      const selfMatch = matchedIndexSet.has(node.sourceIndex);
      const hasMatchedDescendant = descendantMatchMap.get(node.key) ?? false;
      if (!selfMatch && !hasMatchedDescendant) continue;

      const hasChildren = node.children.length > 0;
      const isExpanded = hasChildren && (hasMatchedDescendant || isExpandedKey(node.key));
      result.push({
        sourceIndex: node.sourceIndex,
        key: node.key,
        depth: node.depth,
        hasChildren,
        isExpanded,
      });
      if (isExpanded) {
        walkFiltered(node.children);
      }
    }
  };

  walkFiltered(forest.roots);
  return result;
}
