import React from 'react';
import { VirtualizedGridProps, VirtualizedGridRef } from './types';
import './grid.css';
export declare const VirtualizedGrid: <T = any>(props: VirtualizedGridProps<T> & {
    ref?: React.Ref<VirtualizedGridRef>;
}) => React.ReactElement | null;
