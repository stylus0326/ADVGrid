export interface ScrollableElementMetrics {
    clientHeight: number;
    scrollHeight: number;
    scrollTop: number;
    clientWidth: number;
    scrollWidth: number;
    scrollLeft: number;
}
export declare function resolveEventTargetElement(target: EventTarget | null): Element | null;
export declare function isTargetInsidePopupSelector(target: EventTarget | null, popupSelector: string): boolean;
export declare function isScrollableOverflowValue(overflow: string): boolean;
export declare function canElementScrollOnAxis(el: ScrollableElementMetrics, axis: 'y' | 'x', delta: number): boolean;
export declare function canWheelScrollInsidePopup(target: EventTarget | null, deltaX: number, deltaY: number, popupSelector: string): boolean;
export declare function shouldBlockGridInteractionWhenPopupOpen(hasPopupOpen: boolean, target: EventTarget | null, popupSelector: string): boolean;
