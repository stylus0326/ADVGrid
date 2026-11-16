export declare const NUMERIC_SHORTCUT_REGEX: RegExp;
export declare function expandAllShortcuts(text: any): string;
export declare function formatNumberWithCommas(val: any): string;
export declare function cleanNumericInput(val: any): string;
export interface SmartNumericRange {
    isRange: boolean;
    from: string;
    to: string;
    fromNum: number;
    toNum: number;
    formatted: string;
}
export declare function parseSmartNumericRange(str: any, bounds?: any): SmartNumericRange | null;
export declare function formatSmartInputText(v: any, bounds?: any, _autoDashAtFrom?: boolean): string;
export declare function handleNumericKeyDown(e: React.KeyboardEvent): void;
