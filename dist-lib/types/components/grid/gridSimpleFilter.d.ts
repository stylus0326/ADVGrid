import { type FilterOperation } from './types';
export declare function needsFullFilterEngine(op: FilterOperation, query: string, dataType?: string, filterObj?: any): boolean;
export declare function matchSimpleFilterSync(cellVal: any, op: FilterOperation, query: string, dataType?: string, filterObj?: any): boolean;
