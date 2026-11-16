import type { QueryGroup, QueryRule, QueryTreeNode } from './types';
export declare function isRuleActive(rule: QueryRule): boolean;
export declare function hasActiveQueryRules(node: QueryTreeNode | null): boolean;
export declare function countActiveQueryRules(node: QueryTreeNode | null): number;
export type { QueryGroup, QueryRule, QueryTreeNode };
