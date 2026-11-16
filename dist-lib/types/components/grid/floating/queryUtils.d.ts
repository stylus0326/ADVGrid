import { QueryGroup, QueryRule, QueryTreeNode } from './types';
import { ColumnDef } from '../types';
import { isRuleActive, hasActiveQueryRules, countActiveQueryRules } from './queryRuleCheck';
export { isRuleActive, hasActiveQueryRules, countActiveQueryRules };
export declare function parseDateToNum(val: any): number | null;
export declare function parseTimeToMinutes(val: any): number | null;
export declare function evaluateValueCondition(cellVal: any, operator: QueryRule['operator'], targetVal: any, dataType?: string, targetValTo?: any): boolean;
export declare function evaluateQueryTreeNode(node: QueryTreeNode | null, rowItem: any, rowIndex: number, getCellValue?: (rowIndex: number, colKey: string) => any, columnDataTypes?: Record<string, string>): boolean;
export declare const QUERY_OP_DISPLAY_MAP: Record<string, string>;
export declare function formatQueryRuleSummary(rule: QueryRule, columns: ColumnDef<any>[]): string;
export declare function generateNaturalLanguage(node: QueryTreeNode | null, columns: ColumnDef<any>[]): string;
export declare function validateQueryTreeAgainstColumns(node: QueryTreeNode | null, columns: ColumnDef<any>[]): {
    isValid: boolean;
    error?: string;
};
export declare function parseCmdToQueryTree(cmdText: string, columns: ColumnDef<any>[]): {
    isValid: boolean;
    tree?: QueryGroup;
    error?: string;
};
