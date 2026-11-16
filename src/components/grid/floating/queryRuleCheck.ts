import type { QueryGroup, QueryRule, QueryTreeNode } from './types';
import { isBetweenFilterOp, isNoInputFilterOp } from '../gridFormatUtils';

export function isRuleActive(rule: QueryRule): boolean {
  if (!rule || !rule.field) return false;
  if (Array.isArray(rule.multiValues) && rule.multiValues.length > 0) return true;
  if (Array.isArray(rule.multiRanges) && rule.multiRanges.length > 0) return true;
  const op = rule.operator;
  if (isNoInputFilterOp(op)) {
    return true;
  }
  if (isBetweenFilterOp(op)) {
    return (
      rule.value !== undefined &&
      rule.value !== '' &&
      rule.valueTo !== undefined &&
      rule.valueTo !== ''
    );
  }
  return (
    rule.value !== undefined &&
    rule.value !== null &&
    String(rule.value).trim() !== ''
  );
}

export function hasActiveQueryRules(node: QueryTreeNode | null): boolean {
  if (!node) return false;
  if ('combinator' in node) {
    if (!Array.isArray(node.rules) || node.rules.length === 0) return false;
    return node.rules.some((child) => hasActiveQueryRules(child));
  }
  return isRuleActive(node);
}

export function countActiveQueryRules(node: QueryTreeNode | null): number {
  if (!node) return 0;
  if ('combinator' in node) {
    if (!Array.isArray(node.rules)) return 0;
    return node.rules.reduce((acc, child) => acc + countActiveQueryRules(child), 0);
  }
  return isRuleActive(node) ? 1 : 0;
}

export type { QueryGroup, QueryRule, QueryTreeNode };
