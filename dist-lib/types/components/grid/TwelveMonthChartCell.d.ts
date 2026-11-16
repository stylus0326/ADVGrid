import React from 'react';
import { FORMULA_MODES, FormulaMode, MONTH_ANALYTICS_MODES, MonthAnalyticsMode, SurfaceTheme } from './types';
export { FORMULA_MODES, MONTH_ANALYTICS_MODES };
export type { FormulaMode, MonthAnalyticsMode };
export declare const FORMULA_CYCLE: FormulaMode[];
export declare const FORMULA_META: Record<FormulaMode, {
    label: string;
    short: string;
    badgeDark: string;
    badgeLight: string;
}>;
export interface TwelveMonthChartProps {
    values: number[];
    minIdx: number;
    maxIdx: number;
    minVal: number;
    maxVal: number;
    avgVal?: number;
    surfaceTheme?: SurfaceTheme;
    width?: number;
    height?: number;
    formatValue?: (val: number) => string;
}
export declare const TwelveMonthChartCell: React.MemoExoticComponent<({ values, minIdx, maxIdx, minVal, maxVal, avgVal, width, height, surfaceTheme, formatValue, }: TwelveMonthChartProps) => React.JSX.Element>;
