import { jsxs as H, jsx as c, Fragment as Rt } from "react/jsx-runtime";
import { useRef as Xe, useEffect as _e, memo as it, useMemo as I, useCallback as A, useState as X } from "react";
import { createPortal as qt } from "react-dom";
import { N as nt, g as _t, A as Ft } from "./AdvButton-B7j0puyb.js";
import { f as G } from "./gridFormatUtils-wCKPmlrt.js";
import { A as yt } from "./arrow-right-11XxQBV1.js";
import { g as Tt, S as Ut } from "./common-Bjggt86Z.js";
import { c as Bt } from "./createLucideIcon-BCMt_G8a.js";
import { M as Qt } from "./MorphIcons-DW5eQGeo.js";
import { A as Gt } from "./AdvOverlayScroll-CipuwW1l.js";
import { A as Kt, D as Xt } from "./AdvPopover-D5QeywtP.js";
import { C as Jt } from "./chevron-down-CoESPSbY.js";
import { C as Zt } from "./chevron-right-CgsC9jVS.js";
const zt = {
  name: "calendar",
  size: 24,
  node: [
    ["path", { d: "M8 2v3", key: "1ioesn" }],
    ["path", { d: "M16 2v3", key: "otl347" }],
    ["rect", { x: "3", y: "3", width: "18", height: "18", rx: "2", key: "h1oib" }],
    ["path", { d: "M3 9h18", key: "1pudct" }]
  ]
};
zt.node;
const Vt = Bt(zt);
const Lt = {
  name: "clock",
  size: 24,
  node: [
    ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
    ["path", { d: "M12 6v6l4 2", key: "mmk7yg" }]
  ]
};
Lt.node;
const en = Bt(Lt), Yt = "agv-datepicker-core-styles";
function ft() {
  if (typeof document > "u") return;
  const s = `
    .agv-datepicker-container,
    .agv-daterange-picker-wrap,
    .agv-custom-select-wrap {
      position: relative;
      display: block;
      width: 100%;
      box-sizing: border-box;
      font-family: var(--font-app-sans, 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif);
      font-size: 12px;
      line-height: 16px;
    }
    .agv-popup-label {
      display: block;
      font-size: 12px;
      line-height: 16px;
      font-weight: 500;
      color: var(--agv-text-muted);
      margin-bottom: 4px;
    }
    .agv-datepicker-input-box,
    .agv-daterange-bar,
    .agv-custom-select-trigger {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 5px;
      width: 100%;
      height: 28px;
      min-height: 28px;
      box-sizing: border-box;
      padding: 0 8px;
      background: var(--form-field-label-background, var(--control-background));
      border: 1px solid var(--control-border);
      border-radius: var(--control-radius);
      color: var(--foreground);
      font-family: inherit;
      font-size: 12px;
      line-height: 16px;
      transition: border-color var(--motion-fast, 120ms) var(--motion-ease-standard, ease), box-shadow var(--motion-fast, 120ms) var(--motion-ease-standard, ease);
      cursor: pointer;
      user-select: none;
    }
    .agv-datepicker-input-box:hover:not(.is-focused):not(:focus-within),
    .agv-daterange-bar:hover:not(.is-focused):not(:focus-within),
    .agv-custom-select-trigger:hover:not(.is-open) {
      border-color: var(--control-border-hover);
    }
    .agv-datepicker-input-box.is-xs, .agv-daterange-bar.is-xs { height: 28px; min-height: 28px; font-size: 12px; line-height: 16px; padding: 0 6px; box-sizing: border-box; }
    .agv-datepicker-input-box.is-sm, .agv-daterange-bar.is-sm, .agv-custom-select-trigger.is-sm { height: 28px; min-height: 28px; font-size: 12px; line-height: 16px; padding: 0 8px; box-sizing: border-box; }
    .agv-datepicker-input-box.is-md, .agv-daterange-bar.is-md, .agv-custom-select-trigger.is-md {
      height: var(--control-height, 36px);
      min-height: var(--control-height, 36px);
      font-size: var(--font-size-body, 14px);
      line-height: 20px;
      padding: 0 10px;
      box-sizing: border-box;
    }
    .agv-datepicker-input-box.is-focused,
    .agv-datepicker-input-box:focus-within,
    .agv-daterange-bar.is-focused,
    .agv-daterange-bar:focus-within,
    .agv-custom-select-trigger.is-open,
    .agv-custom-select-trigger:focus-visible {
      outline: none;
      border-color: var(--brand);
      box-shadow: inset 0 0 0 1px var(--brand);
    }
    .agv-datepicker-text,
    .agv-daterange-text {
      width: 100%;
      min-width: 0;
      border: none;
      outline: none;
      background: transparent;
      color: var(--foreground);
      font-family: inherit;
      font-size: inherit;
      line-height: inherit;
      font-variant-numeric: tabular-nums;
      padding: 2px 0;
    }
    .agv-datepicker-text::placeholder,
    .agv-daterange-text::placeholder {
      color: var(--muted-foreground);
      opacity: 1;
    }
    .agv-filter-datepicker .agv-datepicker-input-box,
    .agv-filter-datepicker .agv-daterange-bar {
      border: none !important;
      background: transparent !important;
      border-radius: 0 !important;
      padding: 0 4px !important;
      box-shadow: none !important;
      min-height: 28px !important;
    }
    .agv-incell-datepicker .agv-datepicker-input-box,
    .agv-incell-datepicker .agv-daterange-bar {
      border: 1px solid var(--brand) !important;
      box-shadow: inset 0 0 0 1px var(--brand) !important;
      font-size: 12px !important;
      line-height: 16px !important;
      padding: 0 6px !important;
      min-height: 28px !important;
      max-height: 30px !important;
      height: 100% !important;
      background: var(--form-field-label-background, var(--control-background)) !important;
      color: var(--foreground) !important;
      box-sizing: border-box !important;
    }
    .agv-incell-datepicker .agv-datepicker-text,
    .agv-incell-datepicker .agv-daterange-text {
      font-size: 12px !important;
      line-height: 16px !important;
      font-family: var(--font-sans, inherit) !important;
      font-variant-numeric: tabular-nums !important;
      color: var(--agv-text-main) !important;
    }
    .agv-daterange-segment {
      display: flex;
      align-items: center;
      flex: 1 1 0%;
      min-width: 0;
    }
    .agv-daterange-sep {
      color: var(--agv-text-subtle);
      font-size: 12px;
      line-height: 16px;
      padding: 0 1px;
      flex-shrink: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .agv-datepicker-clear-btn,
    .agv-preset-trigger-clear {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 16px;
      height: 16px;
      border-radius: 9999px;
      font-size: 12px;
      line-height: 1;
      color: var(--agv-text-subtle);
      background: transparent;
      border: none;
      cursor: pointer;
      flex-shrink: 0;
      transition: background-color 100ms ease, color 100ms ease;
    }
    .agv-datepicker-clear-btn:hover,
    .agv-preset-trigger-clear:hover {
      background: var(--agv-bg-item-hover);
      color: var(--agv-text-main);
    }
    .agv-calendar-popover,
    .agv-custom-select-dropdown {
      background: var(--popup-background);
      color: var(--popover-foreground);
      border: 1px solid var(--popup-border);
      border-radius: var(--popup-radius);
      box-shadow: var(--popup-shadow);
      padding: 8px 9px;
      width: 264px;
      max-width: 95vw;
      box-sizing: border-box;
      font-family: var(--font-app-sans, 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif);
      font-size: 12px;
      line-height: 16px;
      user-select: none;
      will-change: transform, opacity;
      contain: layout style;
    }
    .agv-calendar-popover.is-dual {
      width: 518px;
      max-width: 96vw;
    }
    .agv-dual-calendars-container {
      display: flex;
      gap: 8px;
    }
    .agv-dual-calendar-pane {
      flex: 1 1 0%;
      min-width: 0;
    }
    .agv-dual-divider {
      width: 1px;
      background: var(--agv-border);
      margin: 1px 0;
    }
    .agv-calendar-body-wrap {
      display: flex;
      flex-direction: column;
      height: 224px;
      width: 100%;
      box-sizing: border-box;
    }
    .agv-custom-select-dropdown {
      overflow-y: auto;
      overscroll-behavior: contain;
      padding: 6px;
    }
    .agv-calendar-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 4px;
      flex-shrink: 0;
    }
    .agv-cal-nav-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      min-width: 28px;
      height: 28px;
      min-height: 28px;
      border-radius: 6px;
      border: 1px solid transparent;
      background: transparent;
      color: var(--agv-text-main);
      font-family: inherit;
      font-size: 12px;
      line-height: 1;
      cursor: pointer;
      transition: background-color 100ms ease;
    }
    .agv-cal-nav-btn:hover:not(.is-disabled) {
      background: var(--agv-bg-item-hover);
    }
    .agv-cal-nav-btn.is-disabled {
      opacity: 0.35;
      cursor: not-allowed;
    }
    .agv-cal-title-btn {
      flex: 1;
      height: 28px;
      min-height: 28px;
      border: none;
      background: transparent;
      color: var(--agv-text-main);
      font-family: inherit;
      font-weight: 500;
      font-size: 12px;
      line-height: 16px;
      border-radius: 6px;
      cursor: pointer;
      transition: background-color 100ms ease;
    }
    .agv-cal-title-btn:hover:not(.is-static) {
      background: var(--agv-bg-item-hover);
    }
    .agv-calendar-weekdays {
      display: grid;
      grid-template-columns: repeat(7, minmax(0, 1fr));
      margin-bottom: 3px;
      border-bottom: 1px solid var(--agv-border);
      padding-bottom: 3px;
      flex-shrink: 0;
    }
    .agv-calendar-weekday {
      text-align: center;
      font-size: 12px;
      line-height: 16px;
      font-weight: 500;
      color: var(--agv-text-subtle);
    }
    .agv-calendar-weekday.is-weekend {
      color: var(--agv-weekend);
    }
    .agv-calendar-grid {
      flex: 1 1 0%;
      min-height: 0;
      display: grid;
      grid-template-columns: repeat(7, minmax(0, 1fr));
      grid-template-rows: repeat(6, minmax(0, 1fr));
      gap: 1.5px;
    }
    .agv-cal-day-cell {
      height: 100%;
      width: 100%;
      min-height: 0;
      border: none;
      border-radius: 6px;
      background: transparent;
      color: var(--agv-text-main);
      font-family: inherit;
      font-size: 12px;
      line-height: 16px;
      font-variant-numeric: tabular-nums;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }
    .agv-cal-day-cell.is-weekend {
      color: var(--agv-weekend);
    }
    .agv-cal-day-cell.is-other-month {
      opacity: 0.38;
    }
    .agv-cal-day-cell.is-today {
      box-shadow: inset 0 0 0 1px var(--agv-accent);
      font-weight: 700;
    }
    .agv-cal-day-cell:hover:not(.is-disabled):not(.is-selected):not(.is-in-range) {
      background: var(--agv-bg-item-hover);
    }
    .agv-cal-day-cell.is-in-range,
    .agv-cal-day-cell.is-in-hover {
      background-color: var(--agv-accent-soft) !important;
      color: var(--agv-accent) !important;
      font-weight: 600 !important;
      border-radius: 0;
    }
    .agv-cal-day-cell.is-in-range.is-week-start {
      border-top-left-radius: 6px;
      border-bottom-left-radius: 6px;
    }
    .agv-cal-day-cell.is-in-range.is-week-end {
      border-top-right-radius: 6px;
      border-bottom-right-radius: 6px;
    }
    .agv-cal-day-cell.is-range-start:not(.is-range-single) {
      background-color: var(--agv-accent) !important;
      color: var(--agv-accent-text, #ffffff) !important;
      font-weight: 600 !important;
      border-top-left-radius: 6px !important;
      border-bottom-left-radius: 6px !important;
      border-top-right-radius: 0 !important;
      border-bottom-right-radius: 0 !important;
    }
    .agv-cal-day-cell.is-range-end:not(.is-range-single) {
      background-color: var(--agv-accent) !important;
      color: var(--agv-accent-text, #ffffff) !important;
      font-weight: 600 !important;
      border-top-right-radius: 6px !important;
      border-bottom-right-radius: 6px !important;
      border-top-left-radius: 0 !important;
      border-bottom-left-radius: 0 !important;
    }
    .agv-cal-day-cell.is-selected,
    .agv-cal-day-cell.is-range-single {
      background-color: var(--agv-accent) !important;
      color: var(--agv-accent-text, #ffffff) !important;
      font-weight: 600 !important;
      border-radius: 6px !important;
    }
    .agv-cal-day-cell.is-disabled {
      opacity: 0.25;
      cursor: not-allowed;
    }
    .agv-cal-matrix-grid {
      flex: 1 1 0%;
      min-height: 0;
      width: 100%;
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      grid-template-rows: repeat(3, minmax(0, 1fr));
      gap: 6px;
      padding: 2px 0;
      box-sizing: border-box;
    }
    .agv-cal-matrix-cell {
      height: 100%;
      width: 100%;
      min-height: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid transparent;
      border-radius: 6px;
      background: transparent;
      color: var(--agv-text-main);
      font-family: inherit;
      font-size: 12px;
      line-height: 16px;
      font-weight: 500;
      cursor: pointer;
    }
    .agv-cal-matrix-cell:hover:not(.is-disabled):not(.is-selected):not(.is-in-range) {
      background: var(--agv-bg-item-hover);
    }
    .agv-cal-matrix-cell.is-current {
      border-color: var(--agv-accent);
      color: var(--agv-accent);
      font-weight: 600;
    }
    .agv-cal-matrix-cell.is-in-range {
      background-color: var(--agv-accent-soft) !important;
      color: var(--agv-accent) !important;
      font-weight: 600 !important;
      border-radius: 0 !important;
    }
    .agv-cal-matrix-cell.is-range-start {
      background-color: var(--agv-accent) !important;
      color: var(--agv-accent-text, #ffffff) !important;
      font-weight: 600 !important;
      border-top-left-radius: 6px !important;
      border-bottom-left-radius: 6px !important;
      border-top-right-radius: 0 !important;
      border-bottom-right-radius: 0 !important;
    }
    .agv-cal-matrix-cell.is-range-end {
      background-color: var(--agv-accent) !important;
      color: var(--agv-accent-text, #ffffff) !important;
      font-weight: 600 !important;
      border-top-right-radius: 6px !important;
      border-bottom-right-radius: 6px !important;
      border-top-left-radius: 0 !important;
      border-bottom-left-radius: 0 !important;
    }
    .agv-cal-matrix-cell.is-selected,
    .agv-cal-matrix-cell.is-range-single {
      background-color: var(--agv-accent) !important;
      color: var(--agv-accent-text, #ffffff) !important;
      font-weight: 600 !important;
      border-radius: 6px !important;
    }
    .agv-cal-matrix-cell.is-other-decade {
      opacity: 0.45;
    }
    .agv-cal-matrix-cell.is-disabled {
      opacity: 0.25;
      cursor: not-allowed;
    }
    .agv-preset-group {
      margin-bottom: 6px;
    }
    .agv-preset-group-title,
    .agv-preset-col-title {
      font-size: 12px;
      line-height: 16px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      color: var(--agv-text-subtle);
      margin-bottom: 3px;
      padding: 0 3px;
    }
    .agv-preset-columns-grid {
      display: flex;
      gap: 5px;
    }
    .agv-preset-col {
      flex: 1 1 0%;
      min-width: 0;
    }
    .agv-preset-col-divider {
      width: 1px;
      background: var(--agv-border);
      margin: 1px 0;
    }
    .agv-preset-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 5px;
      min-height: 28px;
      box-sizing: border-box;
      padding: 3px 6px;
      border-radius: 4px;
      font-size: 12px;
      line-height: 16px;
      color: var(--agv-text-main);
      cursor: pointer;
    }
    .agv-preset-item:hover:not(.is-active) {
      background: var(--popup-item-hover-bg, var(--surface-hover));
    }
    .agv-preset-item.is-active {
      background: var(--popup-item-selected-bg);
      color: var(--popup-item-selected-fg);
      box-shadow: none;
      font-weight: 500;
    }
    .agv-preset-item-count {
      font-size: 12px;
      line-height: 16px;
      padding: 1px 4px;
      border-radius: 6px;
      background: var(--muted);
      color: var(--muted-foreground);
    }
    .agv-preset-item.is-active .agv-preset-item-count {
      background: rgb(255 255 255 / 0.2);
      color: var(--popup-item-selected-fg);
    }
    .agv-preset-expand-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      min-width: 28px;
      height: 28px;
      min-height: 28px;
      border-radius: 6px;
      border: none;
      background: transparent;
      cursor: pointer;
      padding: 0;
    }
    .agv-preset-subgrid {
      margin: 3px 0 5px 12px;
      padding: 4px 6px;
      border-left: 2px solid var(--agv-border);
      background: var(--agv-bg-subtle, var(--agv-bg-row-alt, var(--agv-bg-root)));
      border-radius: 0 6px 6px 0;
    }
    .agv-preset-chips-section {
      display: flex;
      align-items: flex-start;
      gap: 5px;
      margin-bottom: 3px;
    }
    .agv-preset-chips-section:last-child {
      margin-bottom: 0;
    }
    .agv-preset-chips-label {
      font-size: 12px;
      line-height: 16px;
      font-weight: 500;
      color: var(--agv-text-subtle);
      min-width: 42px;
      padding-top: 6px;
    }
    .agv-preset-chips-list {
      display: flex;
      flex-wrap: wrap;
      gap: 3.5px;
      flex: 1;
    }
    .agv-preset-week-grid {
      display: grid;
      grid-template-columns: repeat(8, minmax(0, 1fr));
      gap: 4px;
      padding: 0 4px;
    }
    .agv-preset-chip.is-week-chip {
      min-width: 0;
      width: 100%;
      padding: 2px 0;
      justify-content: center;
    }
    .agv-preset-week-expand-wrap {
      margin-top: 4px;
      padding-top: 4px;
      border-top: 1px solid var(--agv-border);
    }
    .agv-preset-week-expand-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 14px;
      min-height: 14px;
      line-height: 1;
      padding: 0;
      border: none;
      border-radius: 4px;
      background: transparent;
      color: var(--agv-text-muted);
      cursor: pointer;
      transition: background-color 120ms ease, color 120ms ease;
    }
    .agv-preset-week-expand-btn:hover {
      background: var(--popup-item-hover-bg, var(--surface-hover));
      color: var(--agv-text-main);
    }
    .agv-preset-chip {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      min-height: 28px;
      box-sizing: border-box;
      padding: 2px 7px;
      border-radius: 6px;
      border: 1px solid var(--agv-border);
      background: var(--agv-bg-control, var(--agv-bg-popup));
      color: var(--agv-text-main);
      font-family: inherit;
      font-size: 12px;
      line-height: 16px;
      cursor: pointer;
    }
    .agv-preset-chip:hover {
      border-color: var(--agv-accent);
    }
    .agv-preset-chip.is-active {
      background: var(--popup-item-selected-bg);
      border-color: var(--popup-item-selected-bg);
      color: var(--popup-item-selected-fg);
      font-weight: 600;
    }
    .agv-preset-chip.is-included {
      background: var(--agv-accent-soft);
      border-color: var(--agv-accent);
      color: var(--agv-accent);
      font-weight: 500;
    }
    .agv-chip-count {
      font-size: 12px;
      line-height: 16px;
      opacity: 0.75;
    }
    /* TIME PICKER FOOTER BAR - COMPACT 6PX CONTROLS */
    .agv-time-footer {
      margin-top: 7px;
      padding-top: 7px;
      border-top: 1px solid var(--agv-border);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 6px;
      box-sizing: border-box;
      width: 100%;
    }
    .agv-time-footer.is-compact-range {
      flex-direction: column;
      gap: 6px;
    }
    .agv-time-range-inputs {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      gap: 5px;
    }
    .agv-time-range-actions {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      gap: 5px;
    }
    .agv-time-picker-block {
      display: flex;
      align-items: center;
      gap: 3px;
      font-size: 12px;
      line-height: 16px;
      font-weight: 500;
      color: var(--agv-text-muted);
    }
    .agv-time-input-wrap {
      display: inline-flex;
      align-items: center;
      background: var(--agv-bg-subtle);
      border: 1px solid var(--control-border, var(--agv-border));
      border-radius: 6px;
      padding: 1.5px 5px;
      min-height: 28px;
      box-sizing: border-box;
      transition: border-color 120ms ease, box-shadow 120ms ease;
    }
    .agv-time-input-wrap:hover:not(:focus-within) {
      border-color: var(--control-border-hover, var(--agv-border-strong));
    }
    .agv-time-input-wrap:focus-within {
      outline: none;
      border-color: var(--brand, var(--agv-accent));
      box-shadow: inset 0 0 0 1px var(--brand, var(--agv-accent));
    }
    .agv-time-num-input {
      width: 22px;
      border: none;
      outline: none;
      background: transparent;
      color: var(--agv-text-main);
      font-family: inherit;
      font-size: 12px;
      line-height: 16px;
      font-variant-numeric: tabular-nums;
      font-weight: 500;
      text-align: center;
      padding: 0;
    }
    .agv-time-sep {
      color: var(--agv-text-subtle);
      font-weight: 500;
      font-size: 12px;
      line-height: 16px;
      user-select: none;
      padding: 0 1px;
    }
    .agv-quick-time-btn,
    .agv-time-quick-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 28px;
      box-sizing: border-box;
      font-family: inherit;
      font-size: 12px;
      line-height: 16px;
      padding: 4px 8px;
      border-radius: 6px;
      border: 1px solid transparent;
      background: transparent;
      color: var(--agv-text-muted);
      cursor: pointer;
      white-space: nowrap;
      transition: background-color 120ms ease, color 120ms ease;
    }
    .agv-quick-time-btn:hover,
    .agv-time-quick-btn:hover {
      background: var(--agv-bg-item-hover, var(--agv-bg-hover));
      color: var(--agv-text-main);
    }
    .agv-apply-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 28px;
      box-sizing: border-box;
      background: var(--primary, var(--agv-accent));
      color: var(--primary-foreground, var(--agv-accent-text, #ffffff));
      font-family: inherit;
      font-size: 12px;
      line-height: 16px;
      font-weight: 500;
      padding: 4px 12px;
      border-radius: 6px;
      border: 1px solid var(--primary, var(--agv-accent));
      cursor: pointer;
      white-space: nowrap;
      flex-shrink: 0;
      transition: opacity 100ms ease, transform 80ms ease;
    }
    .agv-apply-btn:hover {
      opacity: 0.9;
    }
    .agv-apply-btn:active {
      transform: scale(0.98);
    }
  `;
  let t = document.getElementById(Yt);
  t || (t = document.createElement("style"), t.id = Yt, document.head.firstChild ? document.head.insertBefore(t, document.head.firstChild) : document.head.appendChild(t)), t.textContent !== s && (t.textContent = s);
}
typeof document < "u" && ft();
const tn = [
  "Tháng 1",
  "Tháng 2",
  "Tháng 3",
  "Tháng 4",
  "Tháng 5",
  "Tháng 6",
  "Tháng 7",
  "Tháng 8",
  "Tháng 9",
  "Tháng 10",
  "Tháng 11",
  "Tháng 12"
], nn = [
  "Thg 1",
  "Thg 2",
  "Thg 3",
  "Thg 4",
  "Thg 5",
  "Thg 6",
  "Thg 7",
  "Thg 8",
  "Thg 9",
  "Thg 10",
  "Thg 11",
  "Thg 12"
], an = [
  { label: "CN", isWeekend: !0 },
  { label: "T2", isWeekend: !1 },
  { label: "T3", isWeekend: !1 },
  { label: "T4", isWeekend: !1 },
  { label: "T5", isWeekend: !1 },
  { label: "T6", isWeekend: !1 },
  { label: "T7", isWeekend: !0 }
], Wt = /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})(?:\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/, It = /^(\d{4})[/-](\d{1,2})[/-](\d{1,2})(?:\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/, rn = /^(\d{1,2})[/-](\d{1,2})$/, Dt = /^data_week_(\d{4})_w(\d{1,2})$/, dt = /^data_quarter_(\d{4})_q([1-4])$/, ut = /^data_month_(\d{4})_m(\d{1,2})$/, Pt = /^data_year_(\d{4})$/, tt = /^(\d{4})$/, on = /(?:data_year_|data_quarter_|data_month_|data_week_)(\d{4})/, sn = /_(\d{4})/, at = /[,;]/, ln = /[;\u2014]|\.\.|\s-\s/, wt = {
  1: "I",
  2: "II",
  3: "III",
  4: "IV"
};
function Fe(s) {
  const t = String(s);
  return t.length < 2 ? `0${t}` : t;
}
function R(s, t = !1) {
  if (!s) return "";
  const m = s.getTime();
  if (Number.isNaN(m)) return "";
  const e = `${s.getFullYear()}-${Fe(s.getMonth() + 1)}-${Fe(s.getDate())}`;
  return t ? `${e} ${Fe(s.getHours())}:${Fe(s.getMinutes())}` : e;
}
function He(s, t = !1) {
  if (!s) return null;
  if (s instanceof Date) {
    const n = s.getTime();
    return Number.isNaN(n) ? null : n;
  }
  const m = String(s).trim();
  if (!m) return null;
  const e = Wt.exec(m);
  if (e) {
    const n = parseInt(e[1], 10), i = parseInt(e[2], 10) - 1, d = parseInt(e[3], 10), v = e[4] !== void 0 ? parseInt(e[4], 10) : t ? 23 : 0, u = e[5] !== void 0 ? parseInt(e[5], 10) : t ? 59 : 0, g = e[6] !== void 0 ? parseInt(e[6], 10) : t ? 59 : 0, M = t && e[4] === void 0 ? 999 : 0, D = new Date(d, i, n, v, u, g, M);
    return D.getFullYear() === d && D.getMonth() === i && D.getDate() === n ? D.getTime() : null;
  }
  const r = It.exec(m);
  if (r) {
    const n = parseInt(r[1], 10), i = parseInt(r[2], 10) - 1, d = parseInt(r[3], 10), v = r[4] !== void 0 ? parseInt(r[4], 10) : t ? 23 : 0, u = r[5] !== void 0 ? parseInt(r[5], 10) : t ? 59 : 0, g = r[6] !== void 0 ? parseInt(r[6], 10) : t ? 59 : 0, M = t && r[4] === void 0 ? 999 : 0, D = new Date(n, i, d, v, u, g, M);
    return D.getFullYear() === n && D.getMonth() === i && D.getDate() === d ? D.getTime() : null;
  }
  const p = Date.parse(m);
  return Number.isNaN(p) ? null : p;
}
function Q(s, t) {
  if (!s) return null;
  if (s instanceof Date)
    return Number.isNaN(s.getTime()) ? null : new Date(s.getFullYear(), s.getMonth(), s.getDate(), s.getHours(), s.getMinutes());
  const m = String(s).trim();
  if (!m) return null;
  const e = Wt.exec(m);
  if (e) {
    const i = parseInt(e[1], 10), d = parseInt(e[2], 10) - 1, v = parseInt(e[3], 10), u = e[4] !== void 0 ? parseInt(e[4], 10) : 0, g = e[5] !== void 0 ? parseInt(e[5], 10) : 0, M = new Date(v, d, i, u, g, 0);
    if (M.getFullYear() === v && M.getMonth() === d && M.getDate() === i)
      return M;
  }
  const r = It.exec(m);
  if (r) {
    const i = parseInt(r[1], 10), d = parseInt(r[2], 10) - 1, v = parseInt(r[3], 10), u = r[4] !== void 0 ? parseInt(r[4], 10) : 0, g = r[5] !== void 0 ? parseInt(r[5], 10) : 0, M = new Date(i, d, v, u, g, 0);
    if (M.getFullYear() === i && M.getMonth() === d && M.getDate() === v)
      return M;
  }
  const p = rn.exec(m);
  if (p) {
    const i = parseInt(p[1], 10), d = parseInt(p[2], 10) - 1, v = t || (/* @__PURE__ */ new Date()).getFullYear(), u = new Date(v, d, i);
    if (u.getFullYear() === v && u.getMonth() === d && u.getDate() === i)
      return u;
  }
  const n = He(m);
  return n !== null ? new Date(n) : null;
}
function Ke(s, t) {
  if (!s) return { from: "", to: "" };
  if (s.includes(",") || s.includes(";")) {
    const n = s.split(at).map((v) => v.trim()).filter(Boolean);
    if (n.length === 0) return { from: "", to: "" };
    if (n.length === 1)
      return Ke(n[0]);
    let i = "", d = "";
    for (let v = 0; v < n.length; v++) {
      const u = Ke(n[v]);
      u.from && (!i || u.from < i) && (i = u.from), u.to && (!d || u.to > d) && (d = u.to);
    }
    return { from: i, to: d };
  }
  const m = /* @__PURE__ */ new Date(), e = m.getFullYear(), r = m.getMonth(), p = m.getDate();
  switch (s) {
    case "today": {
      const n = R(m);
      return { from: n, to: n };
    }
    case "yesterday": {
      const n = R(new Date(e, r, p - 1));
      return { from: n, to: n };
    }
    case "mon": {
      const n = (m.getDay() + 6) % 7, i = R(
        new Date(e, r, p - n)
      );
      return { from: i, to: i };
    }
    case "sat_prev_week": {
      const n = (m.getDay() + 6) % 7, i = R(
        new Date(e, r, p - n - 2)
      );
      return { from: i, to: i };
    }
    case "sun_prev_week": {
      const n = (m.getDay() + 6) % 7, i = R(
        new Date(e, r, p - n - 1)
      );
      return { from: i, to: i };
    }
    case "this_week": {
      const n = (m.getDay() + 6) % 7, i = new Date(e, r, p - n), d = new Date(e, r, p - n + 6);
      return { from: R(i), to: R(d) };
    }
    case "last_week": {
      const n = (m.getDay() + 6) % 7, i = new Date(e, r, p - n - 7), d = new Date(e, r, p - n - 1);
      return { from: R(i), to: R(d) };
    }
    case "this_month": {
      const n = new Date(e, r, 1), i = new Date(e, r + 1, 0);
      return { from: R(n), to: R(i) };
    }
    case "this_quarter": {
      const n = Math.floor(r / 3), i = new Date(e, n * 3, 1), d = new Date(e, n * 3 + 3, 0);
      return { from: R(i), to: R(d) };
    }
    case "this_year":
      return { from: `${e}-01-01`, to: `${e}-12-31` };
    case "last_year":
      return {
        from: `${e - 1}-01-01`,
        to: `${e - 1}-12-31`
      };
    case "q1": {
      const n = e;
      return { from: `${n}-01-01`, to: `${n}-03-31` };
    }
    case "q2": {
      const n = e;
      return { from: `${n}-04-01`, to: `${n}-06-30` };
    }
    case "q3": {
      const n = e;
      return { from: `${n}-07-01`, to: `${n}-09-30` };
    }
    case "q4": {
      const n = e;
      return { from: `${n}-10-01`, to: `${n}-12-31` };
    }
    default: {
      if (tt.test(s)) {
        const n = parseInt(s, 10);
        return { from: `${n}-01-01`, to: `${n}-12-31` };
      }
      if (s.startsWith("m")) {
        const n = parseInt(s.substring(1), 10);
        if (!Number.isNaN(n) && n >= 1 && n <= 12) {
          const i = e, d = new Date(i, n - 1, 1), v = new Date(i, n, 0);
          return { from: R(d), to: R(v) };
        }
      }
      if (s.startsWith("data_year_")) {
        const n = parseInt(s.slice(10), 10);
        if (!Number.isNaN(n))
          return { from: `${n}-01-01`, to: `${n}-12-31` };
      }
      if (s.startsWith("data_quarter_")) {
        const n = dt.exec(s);
        if (n) {
          const i = n[1], d = parseInt(n[2], 10), v = Fe((d - 1) * 3 + 1), u = Fe(d * 3), g = d === 1 || d === 4 ? "31" : "30";
          return { from: `${i}-${v}-01`, to: `${i}-${u}-${g}` };
        }
      }
      if (s.startsWith("data_week_")) {
        const n = Dt.exec(s);
        if (n) {
          const i = parseInt(n[1], 10), d = parseInt(n[2], 10);
          if (d >= 1 && d <= 53)
            return Ht(i, d);
        }
      }
      if (s.startsWith("data_month_")) {
        const n = ut.exec(s);
        if (n) {
          const i = parseInt(n[1], 10), d = parseInt(n[2], 10), v = new Date(i, d - 1, 1), u = new Date(i, d, 0);
          return { from: R(v), to: R(u) };
        }
      }
      return { from: "", to: "" };
    }
  }
}
function cn(s) {
  const t = new Date(
    Date.UTC(s.getFullYear(), s.getMonth(), s.getDate())
  ), m = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - m);
  const e = t.getUTCFullYear(), r = new Date(Date.UTC(e, 0, 1));
  return { week: Math.ceil(
    ((t.getTime() - r.getTime()) / 864e5 + 1) / 7
  ), year: e };
}
function Ht(s, t) {
  const e = new Date(s, 0, 4).getDay() || 7, r = new Date(s, 0, 4 - (e - 1)), p = new Date(
    r.getFullYear(),
    r.getMonth(),
    r.getDate() + (t - 1) * 7
  ), n = new Date(
    p.getFullYear(),
    p.getMonth(),
    p.getDate() + 6
  );
  return {
    from: R(p),
    to: R(n)
  };
}
function dn(s) {
  const t = /* @__PURE__ */ new Set(), m = /* @__PURE__ */ new Set();
  for (let e = 0; e < s.length; e++) {
    const r = s[e];
    if (!r) continue;
    t.add(r);
    const p = sn.exec(r);
    p && m.add(Number(p[1]));
  }
  for (const e of m) {
    for (let v = 1; v <= 4; v++) {
      const u = `data_quarter_${e}_q${v}`, g = `data_month_${e}_m${(v - 1) * 3 + 1}`, M = `data_month_${e}_m${(v - 1) * 3 + 2}`, D = `data_month_${e}_m${(v - 1) * 3 + 3}`;
      t.has(g) && t.has(M) && t.has(D) && (t.delete(g), t.delete(M), t.delete(D), t.add(u)), t.has(u) && (t.delete(g), t.delete(M), t.delete(D));
    }
    const r = `data_year_${e}`, p = `data_quarter_${e}_q1`, n = `data_quarter_${e}_q2`, i = `data_quarter_${e}_q3`, d = `data_quarter_${e}_q4`;
    if (t.has(p) && t.has(n) && t.has(i) && t.has(d) && (t.delete(p), t.delete(n), t.delete(i), t.delete(d), t.add(r)), t.has(r)) {
      for (let v = 1; v <= 4; v++)
        t.delete(`data_quarter_${e}_q${v}`);
      for (let v = 1; v <= 12; v++)
        t.delete(`data_month_${e}_m${v}`);
    }
  }
  return Array.from(t);
}
function We(s, t) {
  if (!s) return "";
  if (s.includes(",") || s.includes(";")) {
    const e = s.split(at).map((n) => n.trim()).filter(Boolean);
    if (e.length === 0) return "";
    if (e.length === 1) return We(e[0], t);
    const r = e.map((n) => {
      const i = Dt.exec(n);
      if (i) return { type: "w", year: i[1], val: i[2], order: Number(i[2]) };
      const d = dt.exec(n);
      if (d) return { type: "q", year: d[1], val: d[2], order: Number(d[2]) * 10 };
      const v = ut.exec(n);
      if (v) return { type: "m", year: v[1], val: v[2], order: Number(v[2]) };
      const u = Pt.exec(n);
      return u ? { type: "y", year: u[1], val: u[1], order: 0 } : null;
    });
    if (r.every((n) => n !== null)) {
      const n = r, i = n[0].year;
      if (n.every((d) => d.year === i)) {
        const v = [...n].sort((u, g) => u.order - g.order).map((u) => u.type === "w" ? `Tuần ${u.val}` : u.type === "q" ? `Q${wt[Number(u.val)] || "IV"}` : u.type === "m" ? `T${u.val}` : `Năm ${u.val}`);
        return v.length <= 4 ? `${v.join(", ")} (${i})` : `${v.slice(0, 3).join(", ")}... (+${v.length - 3}) (${i})`;
      }
    }
    const p = e.map((n) => We(n, t));
    return p.length <= 3 ? p.join(", ") : `${p.slice(0, 2).join(", ")}... (${p.length} mốc)`;
  }
  const m = (/* @__PURE__ */ new Date()).getFullYear();
  switch (s) {
    case "today":
      return "Hôm nay";
    case "yesterday":
      return "Hôm qua";
    case "mon":
      return "Thứ 2";
    case "sat_prev_week":
      return "Thứ 7 tuần trước";
    case "sun_prev_week":
      return "Chủ nhật tuần trước";
    case "this_week":
      return "Tuần này";
    case "last_week":
      return "Tuần trước";
    case "this_month":
      return "Tháng này";
    case "this_quarter":
      return "Quý này";
    case "this_year":
      return `Năm nay (${m})`;
    case "last_year":
      return `Năm trước (${m - 1})`;
    case "q1":
      return t && t !== m ? `Quý I (${t})` : "Quý I";
    case "q2":
      return t && t !== m ? `Quý II (${t})` : "Quý II";
    case "q3":
      return t && t !== m ? `Quý III (${t})` : "Quý III";
    case "q4":
      return t && t !== m ? `Quý IV (${t})` : "Quý IV";
    default: {
      if (tt.test(s))
        return `Năm ${s}`;
      if (s.startsWith("m")) {
        const e = parseInt(s.substring(1), 10);
        if (!Number.isNaN(e) && e >= 1 && e <= 12)
          return t && t !== m ? `Tháng ${e} (${t})` : `Tháng ${e}`;
      }
      if (s.startsWith("data_year_"))
        return `Năm ${s.slice(10)}`;
      if (s.startsWith("data_quarter_")) {
        const e = dt.exec(s);
        if (e)
          return `Quý ${wt[Number(e[2])] || "IV"} (${e[1]})`;
      }
      if (s.startsWith("data_week_")) {
        const e = Dt.exec(s);
        if (e)
          return `Tuần ${e[2]} (${e[1]})`;
      }
      if (s.startsWith("data_month_")) {
        const e = ut.exec(s);
        if (e)
          return `Tháng ${e[2]} (${e[1]})`;
      }
      return s;
    }
  }
}
function gt(s, t, m) {
  const e = typeof s == "number" ? s : s.getTime();
  return t !== null && e < t || m !== null && e > m;
}
function st(s, t, m) {
  let e = s + m, r = t;
  return e < 0 ? (e = 11, r--) : e > 11 && (e = 0, r++), { month: e, year: r };
}
function Nt(s, t) {
  const m = new Date(s, t, 1), e = new Date(s, t + 1, 0), r = m.getDay(), p = e.getDate(), n = new Date(s, t, 0).getDate(), i = new Array(42);
  let d = 0;
  for (let u = r - 1; u >= 0; u--) {
    const g = n - u, M = new Date(s, t - 1, g), D = M.getDay();
    i[d++] = {
      date: M,
      dayNum: g,
      isCurrentMonth: !1,
      ts: M.getTime(),
      isWeekend: D === 0 || D === 6
    };
  }
  for (let u = 1; u <= p; u++) {
    const g = new Date(s, t, u), M = g.getDay();
    i[d++] = {
      date: g,
      dayNum: u,
      isCurrentMonth: !0,
      ts: g.getTime(),
      isWeekend: M === 0 || M === 6
    };
  }
  const v = 42 - d;
  for (let u = 1; u <= v; u++) {
    const g = new Date(s, t + 1, u), M = g.getDay();
    i[d++] = {
      date: g,
      dayNum: u,
      isCurrentMonth: !1,
      ts: g.getTime(),
      isWeekend: M === 0 || M === 6
    };
  }
  return i;
}
function Ot(s, t, m, e, r) {
  const p = Xe(t), n = Xe(m);
  _e(() => {
    p.current = t, n.current = m;
  }), _e(() => {
    if (!s) return;
    let i = null;
    const d = (D) => {
      const $ = D.target;
      $ && ($?.closest?.(
        ".agv-portal-dropdown, .agv-preset-dropdown-menu, .agv-calendar-popover, .agv-daterange-popover, .agv-custom-select-dropdown"
      ) || e?.current && e.current.contains($) || r?.current && r.current.contains($) || p.current());
    }, v = (D) => {
      D.key === "Escape" && (D.stopPropagation(), p.current());
    }, u = (D) => {
      D?.type === "scroll" && r?.current && typeof Node < "u" && D.target instanceof Node && r.current.contains(D.target) || i === null && (i = window.requestAnimationFrame(() => {
        i = null, n.current?.();
      }));
    }, g = (D) => {
      const $ = D.target;
      $ && (!r?.current || !r.current.contains($)) && p.current();
    }, M = (D) => {
      const $ = D;
      if (!(e?.current?.closest(".agv-multi-filter-popup") && $.detail?.except === "multi-filter") && $.detail?.except !== "datepicker") {
        if ($.detail?.except === "focus-cell" && e?.current) {
          const x = e.current.closest(".agv-filter-cell-box");
          if (x && (x.contains(document.activeElement) || x === document.activeElement))
            return;
        }
        p.current();
      }
    };
    return document.addEventListener("mousedown", d, { passive: !0 }), document.addEventListener("contextmenu", g), window.addEventListener("agv-close-all-popups", M), document.addEventListener("keydown", v), window.addEventListener("resize", u, { passive: !0 }), window.addEventListener("scroll", u, {
      capture: !0,
      passive: !0
    }), () => {
      i !== null && window.cancelAnimationFrame(i), document.removeEventListener("mousedown", d), document.removeEventListener("contextmenu", g), window.removeEventListener("agv-close-all-popups", M), document.removeEventListener("keydown", v), window.removeEventListener("resize", u), window.removeEventListener("scroll", u, !0);
    };
  }, [s, e, r]);
}
function pt(s, t = 264, m = 310) {
  if (!s || typeof window > "u")
    return { top: 0, left: 0, bottom: 0, isFlipUp: !1 };
  const p = (s.closest(".agv-filter-cell-box") || s.closest(".agv-filter-cell") || s).getBoundingClientRect(), n = window.innerWidth, i = window.innerHeight;
  let d = Math.round(p.left);
  d + t > n - 12 && (d = Math.max(12, n - t - 12)), d < 12 && (d = 12);
  const v = i - p.bottom - 8, u = p.top - 8, g = v < m && u > v, M = g ? Math.max(8, Math.round(p.top - m - 4)) : Math.round(p.bottom + 4), D = Math.round(i - p.top + 4);
  return { top: M, left: d, bottom: D, isFlipUp: g };
}
function $t(s, t, m, e) {
  if (s !== void 0) return s;
  let r;
  if (e?.minDate instanceof Date && !Number.isNaN(e.minDate.getTime()))
    r = e.minDate.getFullYear();
  else if (e?.minTs && e.minTs !== 1 / 0)
    r = new Date(e.minTs).getFullYear();
  else if (m?.minYear !== void 0 && m.minYear > 1900)
    r = m.minYear;
  else if (m?.minDate instanceof Date && !Number.isNaN(m.minDate.getTime()))
    r = m.minDate.getFullYear();
  else if (m?.yearCounts) {
    const i = Object.keys(m.yearCounts);
    for (let d = 0; d < i.length; d++) {
      const v = Number(i[d]);
      v > 1900 && (m.yearCounts[v] || 0) > 0 && (r === void 0 || v < r) && (r = v);
    }
  }
  let p;
  if (t && t.trim()) {
    const i = Q(t);
    if (i)
      p = i.getFullYear();
    else {
      const d = parseInt(t.trim(), 10);
      !Number.isNaN(d) && d > 1900 && d < 2200 && (p = d);
    }
  }
  const n = r !== void 0 && p !== void 0 ? Math.min(r, p) : r !== void 0 ? r : p;
  return n !== void 0 && n < 2026 ? n : 2026;
}
const ot = it(function({
  hours: t,
  minutes: m,
  onChangeTime: e,
  label: r = ""
}) {
  const [p, n] = X(() => Fe(t)), [i, d] = X(() => Fe(m));
  _e(() => {
    n(Fe(t));
  }, [t]), _e(() => {
    d(Fe(m));
  }, [m]);
  const v = () => {
    let g = parseInt(p, 10);
    (Number.isNaN(g) || g < 0) && (g = 0), g > 23 && (g = 23), n(Fe(g)), e(g, m);
  }, u = () => {
    let g = parseInt(i, 10);
    (Number.isNaN(g) || g < 0) && (g = 0), g > 59 && (g = 59), d(Fe(g)), e(t, g);
  };
  return /* @__PURE__ */ H("div", { className: "agv-time-picker-block", children: [
    r && /* @__PURE__ */ H("span", { className: "text-xs text-[var(--agv-text-subtle)] font-medium mr-1", children: [
      r,
      ":"
    ] }),
    /* @__PURE__ */ H("div", { className: "agv-time-input-wrap", children: [
      /* @__PURE__ */ c(en, { className: "h-3 w-3 text-[var(--agv-text-subtle)] mr-1" }),
      /* @__PURE__ */ c(
        "input",
        {
          type: "text",
          maxLength: 2,
          value: p,
          onChange: (g) => n(g.target.value.replace(/\D/g, "")),
          onBlur: v,
          onKeyDown: (g) => g.key === "Enter" && v(),
          className: "agv-time-num-input",
          ...nt
        }
      ),
      /* @__PURE__ */ c("span", { className: "agv-time-sep", children: ":" }),
      /* @__PURE__ */ c(
        "input",
        {
          type: "text",
          maxLength: 2,
          value: i,
          onChange: (g) => d(g.target.value.replace(/\D/g, "")),
          onBlur: u,
          onKeyDown: (g) => g.key === "Enter" && u(),
          className: "agv-time-num-input",
          ...nt
        }
      )
    ] })
  ] });
}), ct = it(
  function({
    calendarView: t,
    setCalendarView: m,
    navYear: e,
    setNavYear: r,
    navMonth: p,
    setNavMonth: n,
    calendarCells: i,
    renderDayCell: d,
    onGridMouseLeave: v,
    activeDate: u,
    minTs: g = null,
    maxTs: M = null,
    minYear: D,
    maxYear: $,
    isMonthSelected: ke,
    getMonthRangeStatus: x,
    isYearSelected: be,
    hideNavLeft: Ie = !1,
    hideNavRight: Je = !1,
    onPrevMonth: Te,
    onNextMonth: re
  }) {
    const ge = I(() => {
      const w = /* @__PURE__ */ new Date();
      return { year: w.getFullYear(), month: w.getMonth() };
    }, []), T = Math.floor(e / 10) * 10, S = T + 9, te = I(() => {
      const w = [];
      for (let h = T - 1; h <= T + 10; h++)
        w.push({
          year: h,
          isOtherDecade: h < T || h > S,
          startTs: new Date(h, 0, 1, 0, 0, 0, 0).getTime(),
          endTs: new Date(h, 11, 31, 23, 59, 59, 999).getTime()
        });
      return w;
    }, [T, S]), ae = I(() => nn.map((w, h) => ({
      m: h,
      label: w,
      startTs: new Date(e, h, 1, 0, 0, 0, 0).getTime(),
      endTs: new Date(e, h + 1, 0, 23, 59, 59, 999).getTime()
    })), [e]), oe = I(() => {
      if (g === null && D === void 0) return !0;
      if (t === "days") {
        const h = new Date(
          e,
          p,
          0,
          23,
          59,
          59,
          999
        ).getTime();
        return g !== null ? h >= g : !0;
      }
      const w = D !== void 0 ? D : g !== null ? new Date(g).getFullYear() : 2026;
      return t === "months" ? e > w : t === "years" ? T > w : !0;
    }, [t, e, p, g, D, T]), pe = I(() => {
      if (M === null && $ === void 0) return !0;
      if (t === "days") {
        const h = new Date(
          e,
          p + 1,
          1,
          0,
          0,
          0,
          0
        ).getTime();
        return M !== null ? h <= M : !0;
      }
      const w = $ !== void 0 ? $ : M !== null ? new Date(M).getFullYear() : ge.year + 1;
      return t === "months" ? e < w : t === "years" ? S < w : !0;
    }, [t, e, p, M, $, S, ge.year]), J = A(() => {
      if (oe) {
        if (Te) {
          Te();
          return;
        }
        if (t === "days") {
          const w = st(p, e, -1);
          n(w.month), r(w.year);
        } else t === "months" ? r((w) => w - 1) : t === "years" && r((w) => w - 10);
      }
    }, [oe, Te, t, p, e, n, r]), ne = A(() => {
      if (pe) {
        if (re) {
          re();
          return;
        }
        if (t === "days") {
          const w = st(p, e, 1);
          n(w.month), r(w.year);
        } else t === "months" ? r((w) => w + 1) : t === "years" && r((w) => w + 10);
      }
    }, [pe, re, t, p, e, n, r]), De = A(() => {
      t === "days" ? m("months") : t === "months" && m("years");
    }, [t, m]), me = t === "days" ? `${tn[p]}, ${e}` : t === "months" ? `${e}` : `${T} - ${S}`;
    return /* @__PURE__ */ H("div", { className: "agv-calendar-body-wrap", children: [
      /* @__PURE__ */ H("div", { className: "agv-calendar-header", children: [
        Ie ? /* @__PURE__ */ c("div", { className: "w-[28px]" }) : /* @__PURE__ */ c(
          "button",
          {
            type: "button",
            onClick: J,
            disabled: !oe,
            className: `agv-cal-nav-btn ${oe ? "" : "is-disabled"}`,
            children: "‹"
          }
        ),
        /* @__PURE__ */ c(
          "button",
          {
            type: "button",
            onClick: De,
            className: `agv-cal-title-btn ${t === "years" ? "is-static" : ""}`,
            children: me
          }
        ),
        Je ? /* @__PURE__ */ c("div", { className: "w-[28px]" }) : /* @__PURE__ */ c(
          "button",
          {
            type: "button",
            onClick: ne,
            disabled: !pe,
            className: `agv-cal-nav-btn ${pe ? "" : "is-disabled"}`,
            children: "›"
          }
        )
      ] }),
      t === "days" && /* @__PURE__ */ H(Rt, { children: [
        /* @__PURE__ */ c("div", { className: "agv-calendar-weekdays", children: an.map((w) => /* @__PURE__ */ c(
          "div",
          {
            className: `agv-calendar-weekday ${w.isWeekend ? "is-weekend" : ""}`,
            children: w.label
          },
          w.label
        )) }),
        /* @__PURE__ */ c("div", { className: "agv-calendar-grid", onMouseLeave: v, children: i.map((w, h) => d(w, h)) })
      ] }),
      t === "months" && /* @__PURE__ */ c("div", { className: "agv-cal-matrix-grid", children: ae.map(({ m: w, label: h, startTs: q, endTs: Z }) => {
        const fe = x ? x(e, w) : {
          isStart: !1,
          isEnd: !1,
          inRange: !1,
          isSelected: ke ? ke(e, w) : !!(u && u.getFullYear() === e && u.getMonth() === w)
        }, j = ge.year === e && ge.month === w, o = g !== null && Z < g || M !== null && q > M;
        let y = "agv-cal-matrix-cell";
        return o ? y += " is-disabled" : fe.isStart && fe.isEnd ? y += " is-selected is-range-single" : fe.isStart ? y += " is-range-start is-selected" : fe.isEnd ? y += " is-range-end is-selected" : fe.inRange ? y += " is-in-range" : fe.isSelected ? y += " is-selected" : j && (y += " is-current"), /* @__PURE__ */ c(
          "button",
          {
            type: "button",
            disabled: o,
            className: y,
            onClick: () => {
              o || (n(w), m("days"));
            },
            children: h
          },
          w
        );
      }) }),
      t === "years" && /* @__PURE__ */ c("div", { className: "agv-cal-matrix-grid", children: te.map(({ year: w, isOtherDecade: h, startTs: q, endTs: Z }) => {
        const fe = be ? be(w) : !!(u && u.getFullYear() === w), j = ge.year === w, o = g !== null && Z < g || M !== null && q > M;
        let y = "agv-cal-matrix-cell";
        return h && (y += " is-other-decade"), o ? y += " is-disabled" : fe ? y += " is-selected" : j && (y += " is-current"), /* @__PURE__ */ c(
          "button",
          {
            type: "button",
            disabled: o,
            className: y,
            onClick: () => {
              o || (r(w), m("months"));
            },
            children: w
          },
          w
        );
      }) })
    ] });
  }
), kt = 16, jt = it(function({
  value: t,
  defaultOpen: m = !1,
  onSelect: e,
  dateAnalysis: r,
  label: p = "Mốc thời gian:",
  theme: n = "",
  size: i = "default",
  hideClear: d = !1,
  min: v = "",
  max: u = "",
  minYear: g,
  maxYear: M
}) {
  _e(() => {
    ft();
  }, []);
  const [D, $] = X(m), [ke, x] = X(!1);
  _e(() => {
    D || x(!1);
  }, [D]);
  const be = Xe(null), Ie = Xe(null), [Je, Te] = X(t || "");
  _e(() => {
    t !== void 0 && Te(t);
  }, [t]);
  const re = t !== void 0 ? t : Je, ge = I(() => re ? new Set(
    re.split(at).map((o) => o.trim()).filter(Boolean)
  ) : /* @__PURE__ */ new Set(), [re]), T = A(() => $(!1), []), S = A(() => {
    $((o) => {
      if (!o && !!!be.current?.closest(".agv-calendar-popover, .agv-daterange-popover")) {
        const V = !!be.current?.closest(".agv-multi-filter-popup");
        window.dispatchEvent(
          new CustomEvent("agv-close-all-popups", {
            detail: {
              except: V ? "multi-filter" : "datepicker",
              source: "datepicker-preset"
            }
          })
        );
      }
      return !o;
    });
  }, []);
  _e(() => {
    if (!D) return;
    const o = (y) => {
      const V = y;
      if (!(be.current?.closest(".agv-multi-filter-popup") && V.detail?.except === "multi-filter") && V.detail?.except !== "datepicker") {
        if (V.detail?.except === "focus-cell" && be.current) {
          const ve = be.current.closest(".agv-filter-cell-box");
          if (ve && (ve.contains(document.activeElement) || ve === document.activeElement))
            return;
        }
        $(!1);
      }
    };
    return window.addEventListener("agv-close-all-popups", o), () => window.removeEventListener("agv-close-all-popups", o);
  }, [D]);
  const te = I(() => (/* @__PURE__ */ new Date()).getFullYear(), []), ae = I(
    () => $t(g, v, r),
    [g, v, r]
  ), oe = I(() => {
    if (M !== void 0) return M;
    if (u && u.trim()) {
      const o = Q(u);
      if (o) return o.getFullYear();
      const y = parseInt(u.trim(), 10);
      if (!Number.isNaN(y) && y > 1900 && y < 2200) return y;
    }
    return r?.maxDate instanceof Date && !Number.isNaN(r.maxDate.getTime()) ? r.maxDate.getFullYear() : te + 1;
  }, [M, u, r, te]), [pe, J] = X({}), ne = A((o, y) => {
    y.stopPropagation(), J((V) => ({ ...V, [o]: !V[o] }));
  }, []), De = I(() => v ? He(v, !1) : null, [v]), me = I(() => u ? He(u, !0) : null, [u]), w = A(
    (o, y) => o === null && y === null ? !0 : !(De !== null && y !== null && y < De || me !== null && o !== null && o > me),
    [De, me]
  ), h = A(
    (o) => {
      const y = re ? re.split(at).map((k) => k.trim()).filter(Boolean) : [];
      let F = !y.every(
        (k) => k.startsWith("data_year_") || k.startsWith("data_quarter_") || k.startsWith("data_month_") || k.startsWith("data_week_")
      ) || y.length === 0 ? [] : [...y];
      const ve = ut.exec(o), se = dt.exec(o), N = Pt.exec(o);
      if (ve) {
        const k = Number(ve[1]), _ = Number(ve[2]), O = Math.ceil(_ / 3), z = `data_quarter_${k}_q${O}`, W = `data_year_${k}`;
        if (F.includes(o))
          F = F.filter((Y) => Y !== o);
        else if (F.includes(z)) {
          F = F.filter((Y) => Y !== z);
          for (let Y = (O - 1) * 3 + 1; Y <= O * 3; Y++)
            Y !== _ && F.push(`data_month_${k}_m${Y}`);
        } else if (F.includes(W)) {
          F = F.filter((Y) => Y !== W);
          for (let Y = 1; Y <= 4; Y++)
            if (Y !== O)
              F.push(`data_quarter_${k}_q${Y}`);
            else
              for (let we = (O - 1) * 3 + 1; we <= O * 3; we++)
                we !== _ && F.push(`data_month_${k}_m${we}`);
        } else
          F.push(o);
      } else if (se) {
        const k = Number(se[1]), _ = Number(se[2]), O = `data_year_${k}`;
        if (F.includes(o))
          F = F.filter((z) => z !== o);
        else if (F.includes(O)) {
          F = F.filter((z) => z !== O);
          for (let z = 1; z <= 4; z++)
            z !== _ && F.push(`data_quarter_${k}_q${z}`);
        } else {
          for (let z = (_ - 1) * 3 + 1; z <= _ * 3; z++) {
            const W = `data_month_${k}_m${z}`;
            F = F.filter((Y) => Y !== W);
          }
          F.push(o);
        }
      } else if (N)
        if (F.includes(o))
          F = F.filter((k) => k !== o);
        else {
          const k = Number(N[1]), _ = `data_quarter_${k}_`, O = `data_month_${k}_`;
          F = F.filter(
            (z) => !z.startsWith(_) && !z.startsWith(O)
          ), F.push(o);
        }
      else
        F.includes(o) ? F = F.filter((k) => k !== o) : F.push(o);
      const ie = dn(F).join(",");
      Te(ie), e?.(ie, !0);
    },
    [re, e]
  ), { weekItems: q, yearsData: Z } = I(() => {
    const o = r?.yearCounts || {}, y = r?.yearMonthCounts || {}, V = r?.yearQuarterCounts || {}, F = r?.presetCounts || {}, ve = !!(r && (Object.keys(o).length > 0 || Object.keys(F).length > 0)), { week: se, year: N } = cn(
      /* @__PURE__ */ new Date()
    ), B = [];
    for (let _ = se; _ >= 1; _--) {
      const O = `data_week_${N}_w${_}`, z = Ht(N, _), W = z.from ? He(z.from, !1) : null, Y = z.to ? He(z.to, !0) : null;
      w(W, Y) && B.push({ id: O, label: String(_) });
    }
    let ie = [];
    if (r && Object.keys(o).length > 0 && (ie = Object.keys(o).map(Number).filter((_) => {
      if ((o[_] || 0) <= 0) return !1;
      const O = new Date(_, 0, 1, 0, 0, 0, 0).getTime(), z = new Date(_, 11, 31, 23, 59, 59, 999).getTime();
      return w(O, z) ? _ >= ae && _ <= oe : !1;
    }).sort((_, O) => O - _)), ie.length === 0)
      for (let _ = oe; _ >= ae; _--) {
        const O = new Date(_, 0, 1, 0, 0, 0, 0).getTime(), z = new Date(_, 11, 31, 23, 59, 59, 999).getTime();
        w(O, z) && ie.push(_);
      }
    const k = ie.map((_) => {
      const O = [1, 2, 3, 4].map((W) => {
        const Y = wt[W], we = new Date(_, (W - 1) * 3, 1, 0, 0, 0, 0).getTime(), de = new Date(_, W * 3, 0, 23, 59, 59, 999).getTime(), Be = w(we, de);
        return {
          q: W,
          id: `data_quarter_${_}_q${W}`,
          label: `Q${Y}`,
          fullName: `Quý ${Y}`,
          count: V[_]?.[W] || 0,
          inRange: Be
        };
      }).filter((W) => W.inRange ? ve ? ge.has(W.id) || W.count > 0 : !0 : !1), z = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((W) => {
        const Y = new Date(_, W - 1, 1, 0, 0, 0, 0).getTime(), we = new Date(_, W, 0, 23, 59, 59, 999).getTime(), de = w(Y, we);
        return {
          m: W,
          id: `data_month_${_}_m${W}`,
          label: `T${W}`,
          fullName: `Tháng ${W}`,
          count: y[_]?.[W] || 0,
          inRange: de
        };
      }).filter((W) => W.inRange ? ve ? ge.has(W.id) || W.count > 0 : !0 : !1);
      return {
        year: _,
        id: `data_year_${_}`,
        label: `Năm ${_}`,
        count: o[_] || 0,
        quarters: O,
        months: z
      };
    }).filter((_) => _.quarters.length > 0 || _.months.length > 0);
    return {
      weekItems: B,
      yearsData: k
    };
  }, [
    r,
    ae,
    oe,
    ge,
    w
  ]);
  _e(() => {
    if (D && Z.length > 0) {
      let o = Z[0].year;
      if (re) {
        const y = on.exec(re);
        y && (o = parseInt(y[1], 10));
      } else Z.some((y) => y.year === te) && (o = te);
      J(
        (y) => y[o] ? y : { ...y, [o]: !0 }
      );
    }
  }, [re, D, te, Z]);
  const fe = I(
    () => re ? We(re) : "",
    [re]
  ), j = n ? Tt(n) : "";
  return /* @__PURE__ */ H("div", { className: "agv-custom-select-wrap", children: [
    p && /* @__PURE__ */ c("label", { className: "agv-popup-label", children: p }),
    /* @__PURE__ */ H(
      "button",
      {
        ref: be,
        type: "button",
        "data-agv-popover-trigger": "true",
        onClick: S,
        className: `agv-custom-select-trigger agv-preset-trigger ${_t()} ${D ? "is-open" : ""} ${i === "xs" ? "is-xs" : i === "md" ? "is-md" : "is-sm"} ${re ? "has-selected" : ""} ${j}`,
        children: [
          /* @__PURE__ */ c("div", { className: "agv-custom-select-trigger-content min-w-0 flex-1 text-left", children: /* @__PURE__ */ c(
            "span",
            {
              className: `agv-custom-select-trigger-label block truncate font-normal ${re ? "text-foreground" : "text-muted-foreground"}`,
              children: fe || "Chọn mốc..."
            }
          ) }),
          /* @__PURE__ */ H("div", { className: "flex flex-shrink-0 items-center gap-1", children: [
            re && !d && /* @__PURE__ */ c(
              "span",
              {
                role: "button",
                tabIndex: 0,
                onClick: (o) => {
                  o.stopPropagation(), Te(""), e?.("");
                },
                className: "agv-preset-trigger-clear",
                children: "×"
              }
            ),
            /* @__PURE__ */ c(
              Jt,
              {
                className: `${i === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} text-[var(--agv-text-subtle)] transition-transform duration-150 ${D ? "rotate-180 text-[var(--agv-accent)]" : ""}`
              }
            )
          ] })
        ]
      }
    ),
    /* @__PURE__ */ c(
      Kt,
      {
        isOpen: D,
        anchorEl: be.current,
        onClose: T,
        placement: "bottom-start",
        showArrow: !0,
        offset: 10,
        width: Math.max(be.current?.offsetWidth || 0, 320),
        minWidth: 320,
        paddingClassName: "p-0",
        contentClassName: "text-xs agv-preset-dropdown-menu agv-portal-dropdown",
        zIndex: 999999999,
        theme: n || Ut.LIGHT,
        ignoreClickOutsideSelectors: Xt,
        children: /* @__PURE__ */ H(
          "div",
          {
            ref: Ie,
            onMouseDown: (o) => o.stopPropagation(),
            className: `flex flex-col rounded-md overflow-hidden ${j}`,
            "data-theme": n || void 0,
            children: [
              /* @__PURE__ */ H(
                Gt,
                {
                  className: "flex-initial min-h-0",
                  viewportClassName: "overflow-y-auto overflow-x-hidden p-1.5 overscroll-contain",
                  viewportStyle: {
                    maxHeight: ge.size > 0 ? "min(316px, calc(100vh - 140px))" : "min(358px, calc(100vh - 100px))"
                  },
                  contentSignature: `${ke ? q.length : kt}-${ge.size}`,
                  children: [
                    q.length > 0 && /* @__PURE__ */ H("div", { className: "agv-preset-group agv-preset-matrix-group", children: [
                      /* @__PURE__ */ c("div", { className: "agv-preset-group-title", children: "Mốc theo tuần" }),
                      /* @__PURE__ */ c("div", { className: "agv-preset-week-grid", children: (ke ? q : q.slice(0, kt)).map((o) => {
                        const y = ge.has(o.id);
                        return /* @__PURE__ */ c(
                          "button",
                          {
                            type: "button",
                            onClick: (V) => {
                              if (V.stopPropagation(), V.ctrlKey || V.metaKey) {
                                h(o.id);
                                return;
                              }
                              Te(o.id), e?.(o.id, !1), $(!1);
                            },
                            onContextMenu: (V) => {
                              V.preventDefault(), V.stopPropagation(), h(o.id);
                            },
                            className: `agv-preset-chip is-week-chip ${y ? "is-active" : ""}`,
                            children: /* @__PURE__ */ c("span", { className: "agv-chip-label", children: o.label })
                          },
                          o.id
                        );
                      }) }),
                      q.length > kt && /* @__PURE__ */ c("div", { className: "agv-preset-week-expand-wrap", children: /* @__PURE__ */ c(
                        "button",
                        {
                          type: "button",
                          "aria-label": ke ? "Thu gọn tuần" : "Mở rộng thêm tuần",
                          onClick: (o) => {
                            o.stopPropagation(), x((y) => !y);
                          },
                          className: "agv-preset-week-expand-btn",
                          children: /* @__PURE__ */ c(
                            Qt,
                            {
                              expanded: ke,
                              type: "down-up",
                              size: 12,
                              spring: "snappy"
                            }
                          )
                        }
                      ) })
                    ] }),
                    Z.length > 0 && /* @__PURE__ */ c("div", { className: "agv-preset-group", children: Z.map((o) => {
                      const y = o.year, V = !!pe[y], F = ge.has(o.id), ve = o.quarters.length > 0, se = o.months.length > 0;
                      return /* @__PURE__ */ H("div", { className: "agv-preset-year-group", children: [
                        /* @__PURE__ */ H(
                          "div",
                          {
                            role: "button",
                            tabIndex: 0,
                            onClick: (N) => ne(y, N),
                            onKeyDown: (N) => {
                              (N.key === "Enter" || N.key === " ") && (N.preventDefault(), ne(y, N));
                            },
                            onContextMenu: (N) => {
                              N.preventDefault(), N.stopPropagation(), ne(y, N);
                            },
                            className: "agv-preset-item agv-preset-year-row",
                            children: [
                              /* @__PURE__ */ H("div", { className: "flex min-w-0 items-center gap-1.5 overflow-hidden", children: [
                                /* @__PURE__ */ c(
                                  "span",
                                  {
                                    className: "agv-preset-expand-btn",
                                    "aria-hidden": "true",
                                    children: /* @__PURE__ */ c(
                                      Zt,
                                      {
                                        className: `h-3.5 w-3.5 text-[var(--agv-text-subtle)] transition-transform duration-150 ${V ? "rotate-90 text-[var(--agv-accent)]" : ""}`
                                      }
                                    )
                                  }
                                ),
                                /* @__PURE__ */ c("span", { className: "agv-preset-item-text truncate font-medium", children: o.label })
                              ] }),
                              o.count !== void 0 && o.count > 0 && /* @__PURE__ */ c("div", { className: "flex flex-shrink-0 items-center gap-1.5", children: /* @__PURE__ */ c("span", { className: "agv-preset-item-count has-data", children: o.count.toLocaleString("vi-VN") }) })
                            ]
                          }
                        ),
                        V && /* @__PURE__ */ H("div", { className: "agv-preset-subgrid", children: [
                          /* @__PURE__ */ H("div", { className: "agv-preset-chips-section", children: [
                            /* @__PURE__ */ c("span", { className: "agv-preset-chips-label", children: "Năm:" }),
                            /* @__PURE__ */ c("div", { className: "agv-preset-chips-list", children: /* @__PURE__ */ c(
                              "button",
                              {
                                type: "button",
                                onClick: (N) => {
                                  if (N.stopPropagation(), N.ctrlKey || N.metaKey) {
                                    h(o.id);
                                    return;
                                  }
                                  Te(o.id), e?.(o.id, !1), $(!1);
                                },
                                onContextMenu: (N) => {
                                  N.preventDefault(), N.stopPropagation(), h(o.id);
                                },
                                className: `agv-preset-chip ${F ? "is-active" : ""}`,
                                children: /* @__PURE__ */ c("span", { className: "agv-chip-label", children: "Cả năm" })
                              }
                            ) })
                          ] }),
                          ve && /* @__PURE__ */ H("div", { className: "agv-preset-chips-section", children: [
                            /* @__PURE__ */ c("span", { className: "agv-preset-chips-label", children: "Quý:" }),
                            /* @__PURE__ */ c("div", { className: "agv-preset-chips-list", children: o.quarters.map((N) => {
                              const B = ge.has(N.id);
                              return /* @__PURE__ */ H(
                                "button",
                                {
                                  type: "button",
                                  onClick: (k) => {
                                    if (k.stopPropagation(), k.ctrlKey || k.metaKey) {
                                      h(N.id);
                                      return;
                                    }
                                    Te(N.id), e?.(N.id, !1), $(!1);
                                  },
                                  onContextMenu: (k) => {
                                    k.preventDefault(), k.stopPropagation(), h(N.id);
                                  },
                                  className: `agv-preset-chip ${B ? "is-active" : ""} ${!B && F ? "is-included" : ""}`,
                                  children: [
                                    /* @__PURE__ */ c("span", { className: "agv-chip-label", children: N.label }),
                                    N.count !== void 0 && N.count > 0 && /* @__PURE__ */ c("span", { className: "agv-chip-count", children: N.count.toLocaleString("vi-VN") })
                                  ]
                                },
                                N.id
                              );
                            }) })
                          ] }),
                          se && /* @__PURE__ */ H("div", { className: "agv-preset-chips-section", children: [
                            /* @__PURE__ */ c("span", { className: "agv-preset-chips-label", children: "Tháng:" }),
                            /* @__PURE__ */ c("div", { className: "agv-preset-chips-list", children: o.months.map((N) => {
                              const B = ge.has(N.id), ie = Math.ceil(N.m / 3), k = ge.has(
                                `data_quarter_${y}_q${ie}`
                              );
                              return /* @__PURE__ */ H(
                                "button",
                                {
                                  type: "button",
                                  onClick: (O) => {
                                    if (O.stopPropagation(), O.ctrlKey || O.metaKey) {
                                      h(N.id);
                                      return;
                                    }
                                    Te(N.id), e?.(N.id, !1), $(!1);
                                  },
                                  onContextMenu: (O) => {
                                    O.preventDefault(), O.stopPropagation(), h(N.id);
                                  },
                                  className: `agv-preset-chip ${B ? "is-active" : ""} ${!B && (k || F) ? "is-included" : ""}`,
                                  children: [
                                    /* @__PURE__ */ c("span", { className: "agv-chip-label", children: N.label }),
                                    N.count !== void 0 && N.count > 0 && /* @__PURE__ */ c("span", { className: "agv-chip-count", children: N.count.toLocaleString("vi-VN") })
                                  ]
                                },
                                N.id
                              );
                            }) })
                          ] })
                        ] })
                      ] }, y);
                    }) })
                  ]
                }
              ),
              ge.size > 0 && /* @__PURE__ */ H("div", { className: "flex shrink-0 items-center justify-between border-t border-[var(--agv-border)] bg-[var(--agv-bg-popup)] px-2.5 py-1.5 text-xs", children: [
                /* @__PURE__ */ H("span", { className: "truncate font-medium text-[var(--agv-text-muted)]", children: [
                  "Đã chọn:",
                  " ",
                  /* @__PURE__ */ c("strong", { className: "text-[var(--agv-accent)]", children: fe })
                ] }),
                /* @__PURE__ */ H("div", { className: "ml-2 flex shrink-0 items-center gap-1.5", children: [
                  /* @__PURE__ */ c(
                    Ft,
                    {
                      variant: "destructive",
                      size: "sm",
                      onClick: (o) => {
                        o.stopPropagation(), Te(""), e?.("", !0);
                      },
                      className: "px-2",
                      children: "Bỏ chọn"
                    }
                  ),
                  /* @__PURE__ */ c(
                    Ft,
                    {
                      variant: "default",
                      size: "sm",
                      onClick: (o) => {
                        o.stopPropagation(), $(!1);
                      },
                      className: "px-3",
                      children: "Áp dụng"
                    }
                  )
                ] })
              ] })
            ]
          }
        )
      }
    )
  ] });
}), Nn = it(function({
  from: t,
  to: m,
  preset: e,
  onChange: r,
  onClose: p,
  min: n = "",
  max: i = "",
  placeholderFrom: d = "Từ",
  placeholderTo: v = "Đến",
  theme: u = "",
  dateAnalysis: g,
  bounds: M,
  size: D = "default",
  showPreset: $ = !0,
  dualMonth: ke = !0,
  showTime: x = !1,
  autoFocus: be = !1,
  defaultOpen: Ie = !1,
  allowClear: Je = !0,
  className: Te = ""
}) {
  _e(() => {
    ft();
  }, []);
  const [re, ge] = X({
    from: t || "",
    to: m || "",
    preset: e || ""
  }), T = t !== void 0 ? t : re.from, S = m !== void 0 ? m : re.to, [te, ae] = X(!1), [oe, pe] = X(e || "");
  _e(() => {
    e !== void 0 && pe(e);
  }, [e]);
  const J = A(
    (a) => {
      ge({
        from: a.from,
        to: a.to,
        preset: a.preset || ""
      }), r?.(a);
    },
    [r]
  ), ne = Xe(null), De = Xe(null), [me, w] = X({ top: 0, left: 0 }), h = I(() => T ? Q(T) : null, [T]), q = I(() => S ? Q(S) : null, [S]), [Z, fe] = X(() => ({
    h: h ? h.getHours() : 0,
    m: h ? h.getMinutes() : 0
  })), [j, o] = X(() => ({
    h: q ? q.getHours() : 23,
    m: q ? q.getMinutes() : 59
  })), y = !!(T && S && (T === S || h && q && h.toDateString() === q.toDateString())), V = !!(h && q && h.getFullYear() === q.getFullYear() || g?.yearCounts && Object.keys(g.yearCounts).length === 1 || g?.minDate && g?.maxDate && g.minDate.getFullYear() === g.maxDate.getFullYear()), F = d || "Từ", ve = v || "Đến", [se, N] = X("start"), [B, ie] = X(() => h), [k, _] = X(() => q), [O, z] = X(null), [W, Y] = X(() => {
    const a = !!(h && q && h.getFullYear() === q.getFullYear() && T !== S);
    return G(T, a, x);
  }), [we, de] = X(() => {
    const a = !!(h && q && h.getFullYear() === q.getFullYear() && T !== S);
    return G(S, a, x);
  }), [Be, ze] = X("days");
  _e(() => {
    ie(h), _(q), h && fe({ h: h.getHours(), m: h.getMinutes() }), q && o({ h: q.getHours(), m: q.getMinutes() });
    const a = !!(h && q && h.getFullYear() === q.getFullYear() && T !== S);
    Y(G(T, a, x)), de(G(S, a, x));
  }, [T, S, h, q, x]);
  const Oe = I(() => (/* @__PURE__ */ new Date()).getFullYear(), []), Pe = I(
    () => $t(void 0, n, g, M),
    [n, g, M]
  ), Ye = I(() => n && n.trim() ? n.trim() : `${Pe}-01-01`, [n, Pe]), Se = i && i.trim() ? i.trim() : `${Oe + 1}-12-31`, Ee = I(() => {
    const a = Q(Ye);
    return a ? R(a, x) : "";
  }, [Ye, x]), Ce = I(() => {
    const a = Q(Se);
    return a ? R(a, x) : "";
  }, [Se, x]), Ve = A(
    (a) => {
      const b = a || /* @__PURE__ */ new Date(), f = Q(Ye) || new Date(Pe, 0, 1), E = Q(Se) || new Date(Oe + 1, 11, 31);
      return b.getTime() < f.getTime() ? f : b.getTime() > E.getTime() ? E : b;
    },
    [Ye, Se, Pe, Oe]
  ), [Re, je] = X(
    () => Ve(h).getFullYear()
  ), [Le, Ae] = X(
    () => Ve(h).getMonth()
  ), Ze = I(() => st(Le, Re, 1), [Le, Re]), l = ke ? 518 : 264, L = ($ ? 40 : 0) + 265 + (x ? ke ? 40 : 70 : 0), C = A(() => {
    const a = pt(ne.current, l, L);
    w(
      (b) => b.top === a.top && b.left === a.left && b.isFlipUp === a.isFlipUp ? b : a
    );
  }, [l, L]), U = A(() => {
    if (ae(!1), z(null), B && !k) {
      const a = R(B, x);
      J({ from: a, to: a, preset: "" }), de(G(a, !1, x));
    }
    p?.();
  }, [p, B, k, x, J]), le = A(
    (a) => {
      const b = Ve(a === "end" && q ? q : h);
      je(b.getFullYear()), Ae(b.getMonth()), N(a || (T && !S ? "end" : "start")), ie(h), _(q), z(null), ze("days"), w(pt(ne.current, l, L));
      const f = !!ne.current?.closest(".agv-multi-filter-popup");
      window.dispatchEvent(
        new CustomEvent("agv-close-all-popups", {
          detail: {
            except: f ? "multi-filter" : "datepicker",
            source: "datepicker"
          }
        })
      ), ae(!0);
    },
    [Ve, h, q, T, S, l, L]
  );
  Ot(te, U, C, ne, De), _e(() => {
    if (be && ne.current) {
      const a = ne.current.querySelector("input");
      a?.focus({ preventScroll: !0 }), a?.select();
    }
    Ie && le();
  }, [be, Ie, le]);
  const ce = I(() => He(Ye, !1), [Ye]), Ne = I(() => He(Se, !0), [Se]), Ue = I(
    () => Nt(Re, Le),
    [Re, Le]
  ), Qe = I(
    () => Nt(Ze.year, Ze.month),
    [Ze]
  ), P = I(
    () => B ? new Date(
      B.getFullYear(),
      B.getMonth(),
      B.getDate()
    ).getTime() : null,
    [B]
  ), ue = I(
    () => k ? new Date(
      k.getFullYear(),
      k.getMonth(),
      k.getDate()
    ).getTime() : null,
    [k]
  ), Me = A(
    (a) => {
      if (!gt(a.ts, ce, Ne))
        if (pe(""), se === "start" || !B && !k || B && k && se !== "end") {
          const b = new Date(a.date);
          b.setHours(Z.h, Z.m), ie(b), _(null), z(null), N("end");
          const f = R(b, x);
          Y(G(f, !1, x)), de("");
        } else if (P !== null && a.ts < P) {
          const b = new Date(a.date);
          b.setHours(Z.h, Z.m);
          const f = B || b;
          ie(b), _(f), z(null), N("start");
          const E = R(b, x), K = R(f, x);
          Y(G(E, !1, x)), de(G(K, !1, x)), J({ from: E, to: K, preset: "" }), x || (ae(!1), p?.());
        } else {
          const b = new Date(a.date);
          b.setHours(j.h, j.m), _(b), z(null), N("start");
          const f = R(B || b, x), E = R(b, x);
          de(G(E, !1, x)), J({ from: f, to: E, preset: "" }), x || (ae(!1), p?.());
        }
    },
    [ce, Ne, se, B, k, P, Z, j, x, J, p]
  ), Mt = A(() => {
    if (B) {
      const a = new Date(B);
      a.setHours(Z.h, Z.m);
      const b = k ? new Date(k) : new Date(B);
      b.setHours(j.h, j.m);
      const f = R(a, x), E = R(b, x);
      J({ from: f, to: E, preset: "" }), Y(G(f, !1, x)), de(G(E, !1, x));
    }
    ae(!1), p?.();
  }, [B, k, Z, j, x, J, p]), Ct = A(() => {
    if (te) return;
    if (pe(""), !W.trim()) {
      J({ from: "", to: S, preset: "" });
      return;
    }
    const a = q ? q.getFullYear() : void 0, b = Q(W, a);
    if (b) {
      let f = R(b, x);
      Ee && f < Ee && (f = Ee), S && f > S && (f = S), J({ from: f, to: S, preset: "" });
      const E = !!(q && q.getFullYear() === b.getFullYear() && f !== S);
      Y(G(f, E, x));
    } else
      Y(G(T, V && !y, x));
  }, [te, W, S, q, Ee, T, V, y, x, J]), Et = A(() => {
    if (te) return;
    if (pe(""), !we.trim()) {
      J({ from: T, to: "", preset: "" });
      return;
    }
    const a = h ? h.getFullYear() : void 0, b = Q(we, a);
    if (b) {
      let f = R(b, x);
      T && f < T && (f = T), Ce && f > Ce && (f = Ce), J({ from: T, to: f, preset: "" });
      const E = !!(h && h.getFullYear() === b.getFullYear() && T !== f);
      de(G(f, E, x));
    } else
      de(G(S, V && !y, x));
  }, [te, we, T, h, Ce, S, V, y, x, J]), St = A(() => {
    if (te) return;
    pe("");
    const a = W.trim();
    if (!a) {
      J({ from: "", to: "", preset: "" });
      return;
    }
    if (a.includes(";") || a.includes(" - ") || a.includes("—") || a.includes("..")) {
      const f = a.split(ln).map((E) => E.trim()).filter(Boolean);
      if (f.length >= 2) {
        const E = Q(f[0]), K = Q(f[1]);
        if (E && K) {
          let ee = R(E, x), he = R(K, x);
          Ee && ee < Ee && (ee = Ee), Ce && he > Ce && (he = Ce);
          const $e = ee <= he ? ee : he, xe = ee <= he ? he : ee;
          J({ from: $e, to: xe, preset: "" }), Y(G($e, !1, x)), de(G(xe, !1, x));
          return;
        }
      }
    }
    const b = Q(a);
    if (b) {
      let f = R(b, x);
      Ee && f < Ee && (f = Ee), Ce && f > Ce && (f = Ce), J({ from: f, to: f, preset: "" }), Y(G(f, !1, x)), de(G(f, !1, x));
    } else
      Y(G(T, !1, x)), de(G(S, !1, x));
  }, [te, W, Ee, Ce, T, S, x, J]), ye = I(() => {
    if (!oe) return null;
    const a = oe.split(at).map((f) => f.trim()).filter(Boolean);
    if (a.length === 0) return null;
    const b = [];
    for (let f = 0; f < a.length; f++) {
      const E = Ke(a[f]);
      if (!E.from && !E.to) continue;
      const K = E.from ? Q(E.from) : null, ee = E.to ? Q(E.to) : null;
      b.push({
        fromTs: K ? K.getTime() : null,
        toTs: ee ? ee.getTime() : null
      });
    }
    return b.length > 0 ? b : null;
  }, [oe]), mt = A(
    (a, b) => {
      const f = new Date(a, b, 1, 0, 0, 0, 0).getTime(), E = new Date(a, b + 1, 0, 23, 59, 59, 999).getTime();
      return ye && ye.length > 0 ? ye.some(
        (K) => K.fromTs !== null && K.toTs !== null && K.fromTs <= E && K.toTs >= f
      ) : P !== null && ue !== null ? P <= E && ue >= f : !!(B && B.getFullYear() === a && B.getMonth() === b || k && k.getFullYear() === a && k.getMonth() === b);
    },
    [ye, P, ue, B, k]
  ), vt = A(
    (a, b) => {
      const f = new Date(a, b, 1, 0, 0, 0, 0).getTime(), E = new Date(a, b + 1, 0, 23, 59, 59, 999).getTime();
      let K = !1, ee = !1, he = !1;
      if (ye && ye.length > 0)
        for (let $e = 0; $e < ye.length; $e++) {
          const xe = ye[$e];
          if (xe.fromTs !== null && xe.toTs !== null) {
            const lt = xe.fromTs >= f && xe.fromTs <= E, rt = xe.toTs >= f && xe.toTs <= E;
            lt && (K = !0), rt && (ee = !0), xe.fromTs <= E && xe.toTs >= f && !lt && !rt && (he = !0);
          }
        }
      else if (P !== null && ue !== null) {
        const $e = P >= f && P <= E, xe = ue >= f && ue <= E;
        $e && (K = !0), xe && (ee = !0), P <= E && ue >= f && !$e && !xe && (he = !0);
      } else P !== null && P >= f && P <= E && (K = !0, ee = !0);
      return {
        isStart: K,
        isEnd: ee,
        inRange: he,
        isSelected: K || ee || he
      };
    },
    [ye, P, ue]
  ), ht = A(
    (a) => {
      const b = new Date(a, 0, 1, 0, 0, 0, 0).getTime(), f = new Date(a, 11, 31, 23, 59, 59, 999).getTime();
      return ye && ye.length > 0 ? ye.some(
        (E) => E.fromTs !== null && E.toTs !== null && E.fromTs <= f && E.toTs >= b
      ) : P !== null && ue !== null ? P <= f && ue >= b : !!(B && B.getFullYear() === a || k && k.getFullYear() === a);
    },
    [ye, P, ue, B, k]
  ), xt = A(() => {
    z((a) => a === null ? a : null);
  }, []), bt = A(
    (a, b) => {
      const f = a.ts, E = gt(f, ce, Ne);
      let K = !1, ee = !1, he = !1, $e = !1;
      if (ye && ye.length > 0)
        for (let et = 0; et < ye.length; et++) {
          const Ge = ye[et];
          Ge.fromTs !== null && f === Ge.fromTs && (K = !0), Ge.toTs !== null && f === Ge.toTs && (ee = !0), Ge.fromTs !== null && Ge.toTs !== null && f >= Ge.fromTs && f <= Ge.toTs && (he = !0);
        }
      else
        K = P !== null && f === P, ee = ue !== null && f === ue, P !== null && ue !== null && f >= P && f <= ue && (he = !0), se === "end" && P !== null && ue === null && O !== null && O >= P && f >= P && f <= O && ($e = !0);
      const xe = a.date.getDay() === 0, lt = a.date.getDay() === 6, rt = K && ee;
      let qe = "agv-cal-day-cell";
      return a.isWeekend && (qe += " is-weekend"), a.isCurrentMonth || (qe += " is-other-month"), E && (qe += " is-disabled"), rt ? qe += " is-selected is-range-single" : (K && (qe += " is-range-start is-selected"), ee && (qe += " is-range-end is-selected")), he && !rt && (qe += " is-in-range", xe && (qe += " is-week-start"), lt && (qe += " is-week-end")), $e && !K && !ee && (qe += " is-in-hover"), /* @__PURE__ */ c(
        "button",
        {
          type: "button",
          disabled: E,
          onClick: () => Me(a),
          onMouseEnter: () => {
            se === "end" && z((et) => et === f ? et : f);
          },
          className: qe,
          children: a.dayNum
        },
        b
      );
    },
    [
      ce,
      Ne,
      ye,
      P,
      ue,
      se,
      O,
      Me
    ]
  ), At = D === "xs" ? "is-xs" : D === "md" ? "is-md" : "is-sm";
  return /* @__PURE__ */ H("div", { className: `agv-daterange-picker-wrap ${Te}`, ref: ne, children: [
    /* @__PURE__ */ H(
      "div",
      {
        className: `agv-daterange-bar ${_t()} ${te ? "is-focused" : ""} ${At}`,
        onClick: () => te ? U() : le(),
        children: [
          oe ? /* @__PURE__ */ c("div", { className: "agv-daterange-segment flex w-full items-center justify-center overflow-hidden px-1", children: /* @__PURE__ */ c(
            "span",
            {
              className: "truncate font-normal text-foreground",
              children: We(oe)
            }
          ) }) : y ? /* @__PURE__ */ c("div", { className: "agv-daterange-segment", children: /* @__PURE__ */ c(
            "input",
            {
              type: "text",
              name: "agv_daterange_single",
              ...nt,
              value: W,
              onClick: (a) => {
                a.stopPropagation(), le("start");
              },
              onChange: (a) => {
                Y(a.target.value), de(a.target.value);
              },
              onBlur: St,
              onKeyDown: (a) => a.key === "Enter" && St(),
              placeholder: x ? "DD/MM/YYYY HH:mm" : "DD/MM/YYYY",
              className: "agv-daterange-text text-center font-normal"
            }
          ) }) : /* @__PURE__ */ H(Rt, { children: [
            /* @__PURE__ */ c("div", { className: "agv-daterange-segment", children: /* @__PURE__ */ c(
              "input",
              {
                type: "text",
                name: "agv_daterange_from",
                ...nt,
                value: W,
                onClick: (a) => {
                  a.stopPropagation(), le("start");
                },
                onChange: (a) => Y(a.target.value),
                onBlur: Ct,
                onKeyDown: (a) => a.key === "Enter" && Ct(),
                placeholder: F,
                className: "agv-daterange-text text-center font-normal"
              }
            ) }),
            /* @__PURE__ */ c("span", { className: "agv-daterange-sep inline-flex items-center justify-center shrink-0", children: /* @__PURE__ */ c(yt, { size: 10, strokeWidth: 2, className: "opacity-50 select-none pointer-events-none" }) }),
            /* @__PURE__ */ c("div", { className: "agv-daterange-segment", children: /* @__PURE__ */ c(
              "input",
              {
                type: "text",
                name: "agv_daterange_to",
                ...nt,
                value: we,
                onClick: (a) => {
                  a.stopPropagation(), le("end");
                },
                onChange: (a) => de(a.target.value),
                onBlur: Et,
                onKeyDown: (a) => a.key === "Enter" && Et(),
                placeholder: ve,
                className: "agv-daterange-text text-center font-normal"
              }
            ) })
          ] }),
          Je && (T || S || oe) && /* @__PURE__ */ c(
            "button",
            {
              type: "button",
              onClick: (a) => {
                a.stopPropagation(), pe(""), ie(null), _(null), z(null), Y(""), de(""), N("start"), J({ from: "", to: "", preset: "" });
              },
              className: "agv-datepicker-clear-btn agv-inline-clear-destructive",
              children: "×"
            }
          )
        ]
      }
    ),
    te && qt(
      /* @__PURE__ */ H(
        "div",
        {
          ref: De,
          style: {
            position: "fixed",
            ...me.isFlipUp ? { bottom: `${me.bottom}px`, top: "auto" } : { top: `${me.top}px`, bottom: "auto" },
            left: `${me.left}px`,
            zIndex: 999999999
          },
          className: `agv-calendar-popover agv-daterange-popover agv-popup-panel ${me.isFlipUp ? "agv-spring-up" : "agv-spring-down"} ${ke ? "is-dual" : ""} ${u ? Tt(u) : ""}`,
          "data-theme": u || void 0,
          "data-agv-popup": "true",
          onClick: (a) => a.stopPropagation(),
          onMouseDown: (a) => a.stopPropagation(),
          children: [
            $ && /* @__PURE__ */ c("div", { className: "agv-daterange-preset-section mb-2 border-b border-[var(--agv-border)] pb-2", children: /* @__PURE__ */ c(
              jt,
              {
                value: oe,
                min: Ye,
                max: Se,
                dateAnalysis: g,
                label: "Mốc thời gian:",
                theme: u,
                onSelect: (a, b) => {
                  if (pe(a), a) {
                    const f = Ke(a), E = Q(Ye), K = Q(Se);
                    let ee = f.from ? Q(f.from) : null, he = f.to ? Q(f.to) : null, $e = f.from, xe = f.to;
                    ee && E && ee.getTime() < E.getTime() && (ee = E, $e = R(E, !1)), he && K && he.getTime() > K.getTime() && (he = K, xe = R(K, !1)), ie(ee), _(he), Y(G($e, !1, x)), de(G(xe, !1, x)), J({
                      from: $e,
                      to: xe,
                      preset: a
                    }), ee && (je(ee.getFullYear()), Ae(ee.getMonth())), ze("days"), !b && !x && ae(!1);
                  } else
                    ie(null), _(null), Y(""), de(""), J({ from: "", to: "", preset: "" }), !b && !x && ae(!1);
                }
              }
            ) }),
            ke && Be === "days" ? /* @__PURE__ */ H("div", { className: "agv-dual-calendars-container", children: [
              /* @__PURE__ */ c("div", { className: "agv-dual-calendar-pane", children: /* @__PURE__ */ c(
                ct,
                {
                  calendarView: Be,
                  setCalendarView: ze,
                  navYear: Re,
                  setNavYear: je,
                  navMonth: Le,
                  setNavMonth: Ae,
                  calendarCells: Ue,
                  activeDate: B || k,
                  minTs: ce,
                  maxTs: Ne,
                  minYear: Pe,
                  isMonthSelected: mt,
                  getMonthRangeStatus: vt,
                  isYearSelected: ht,
                  onGridMouseLeave: xt,
                  renderDayCell: bt,
                  hideNavRight: !0,
                  onPrevMonth: () => {
                    const a = st(Le, Re, -1);
                    Ae(a.month), je(a.year);
                  }
                }
              ) }),
              /* @__PURE__ */ c("div", { className: "agv-dual-divider" }),
              /* @__PURE__ */ c("div", { className: "agv-dual-calendar-pane", children: /* @__PURE__ */ c(
                ct,
                {
                  calendarView: Be,
                  setCalendarView: ze,
                  navYear: Ze.year,
                  setNavYear: () => {
                  },
                  navMonth: Ze.month,
                  setNavMonth: () => {
                  },
                  calendarCells: Qe,
                  activeDate: B || k,
                  minTs: ce,
                  maxTs: Ne,
                  minYear: Pe,
                  isMonthSelected: mt,
                  getMonthRangeStatus: vt,
                  isYearSelected: ht,
                  onGridMouseLeave: xt,
                  renderDayCell: bt,
                  hideNavLeft: !0,
                  onNextMonth: () => {
                    const a = st(Le, Re, 1);
                    Ae(a.month), je(a.year);
                  }
                }
              ) })
            ] }) : /* @__PURE__ */ c("div", { className: "w-full", children: /* @__PURE__ */ c(
              ct,
              {
                calendarView: Be,
                setCalendarView: ze,
                navYear: Re,
                setNavYear: je,
                navMonth: Le,
                setNavMonth: Ae,
                calendarCells: Ue,
                activeDate: B || k,
                minTs: ce,
                maxTs: Ne,
                minYear: Pe,
                isMonthSelected: mt,
                getMonthRangeStatus: vt,
                isYearSelected: ht,
                onGridMouseLeave: xt,
                renderDayCell: bt
              }
            ) }),
            x && (ke ? (
              /* Dual Month: Giao diện 1 hàng ngang rộng rãi */
              /* @__PURE__ */ H("div", { className: "agv-time-footer", children: [
                /* @__PURE__ */ H("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ c(
                    ot,
                    {
                      label: "Từ",
                      hours: Z.h,
                      minutes: Z.m,
                      onChangeTime: (a, b) => fe({ h: a, m: b })
                    }
                  ),
                  /* @__PURE__ */ c(yt, { size: 10, strokeWidth: 2, className: "text-[var(--agv-text-subtle)] opacity-50 shrink-0 select-none pointer-events-none mx-0.5" }),
                  /* @__PURE__ */ c(
                    ot,
                    {
                      label: "Đến",
                      hours: j.h,
                      minutes: j.m,
                      onChangeTime: (a, b) => o({ h: a, m: b })
                    }
                  ),
                  /* @__PURE__ */ c(
                    "button",
                    {
                      type: "button",
                      onClick: () => {
                        fe({ h: 0, m: 0 }), o({ h: 23, m: 59 });
                      },
                      className: "agv-time-quick-btn ml-1",
                      children: "Cả ngày"
                    }
                  )
                ] }),
                /* @__PURE__ */ c(
                  "button",
                  {
                    type: "button",
                    onClick: Mt,
                    className: "agv-apply-btn",
                    children: "Áp dụng"
                  }
                )
              ] })
            ) : (
              /* Single Month: Giao diện 2 tầng chuyên nghiệp, không vỡ chữ */
              /* @__PURE__ */ H("div", { className: "agv-time-footer is-compact-range", children: [
                /* @__PURE__ */ H("div", { className: "agv-time-range-inputs", children: [
                  /* @__PURE__ */ c(
                    ot,
                    {
                      label: "Từ",
                      hours: Z.h,
                      minutes: Z.m,
                      onChangeTime: (a, b) => fe({ h: a, m: b })
                    }
                  ),
                  /* @__PURE__ */ c(yt, { size: 10, strokeWidth: 2, className: "text-[var(--agv-text-subtle)] opacity-50 shrink-0 select-none pointer-events-none mx-0.5" }),
                  /* @__PURE__ */ c(
                    ot,
                    {
                      label: "Đến",
                      hours: j.h,
                      minutes: j.m,
                      onChangeTime: (a, b) => o({ h: a, m: b })
                    }
                  )
                ] }),
                /* @__PURE__ */ H("div", { className: "agv-time-range-actions", children: [
                  /* @__PURE__ */ H("div", { className: "flex items-center gap-1.5", children: [
                    /* @__PURE__ */ c(
                      "button",
                      {
                        type: "button",
                        onClick: () => {
                          fe({ h: 0, m: 0 }), o({ h: 23, m: 59 });
                        },
                        className: "agv-time-quick-btn",
                        children: "Cả ngày"
                      }
                    ),
                    /* @__PURE__ */ c(
                      "button",
                      {
                        type: "button",
                        onClick: () => {
                          const a = /* @__PURE__ */ new Date();
                          fe({ h: a.getHours(), m: a.getMinutes() }), o({ h: a.getHours(), m: a.getMinutes() });
                        },
                        className: "agv-time-quick-btn",
                        children: "Hiện tại"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ c(
                    "button",
                    {
                      type: "button",
                      onClick: Mt,
                      className: "agv-apply-btn",
                      children: "Áp dụng"
                    }
                  )
                ] })
              ] })
            ))
          ]
        }
      ),
      ne.current?.ownerDocument?.body || document.body
    )
  ] });
}), _n = it(function({
  value: t,
  preset: m,
  onChange: e,
  onClose: r,
  min: p = "",
  max: n = "",
  placeholder: i = "DD/MM/YYYY",
  disabled: d = !1,
  className: v = "",
  onDoubleClick: u,
  theme: g = "",
  size: M = "default",
  showPreset: D = !1,
  showTime: $ = !1,
  autoFocus: ke = !1,
  defaultOpen: x = !1,
  dateAnalysis: be,
  bounds: Ie,
  showCalendarIcon: Je = !1,
  allowClear: Te = !0
}) {
  _e(() => {
    ft();
  }, []);
  const [re, ge] = X(t || ""), T = t !== void 0 ? t : re, [S, te] = X(() => D ? m || (t && (t.startsWith("data_") || tt.test(t.trim())) ? t.trim() : "") : "");
  _e(() => {
    if (!D) {
      te("");
      return;
    }
    m !== void 0 && te(m);
  }, [D, m]);
  const ae = A(
    (l, L) => {
      ge(l), e?.(l, L);
    },
    [e]
  ), [oe, pe] = X(!1), [J, ne] = X(
    () => S ? We(S) : G(T, !1, $)
  ), De = I(() => T ? Q(T) : null, [T]), [me, w] = X(() => ({
    h: De ? De.getHours() : 0,
    m: De ? De.getMinutes() : 0
  })), h = Xe(null), q = Xe(null), [Z, fe] = X({ top: 0, left: 0 });
  _e(() => {
    if (!T && !S) {
      ne("");
      return;
    }
    if (D && T && (T.startsWith("data_") || tt.test(T.trim()))) {
      const l = tt.test(T.trim()) ? `data_year_${T.trim()}` : T.trim();
      te(l), ne(We(l));
      return;
    }
    if (D && S) {
      const l = Ke(S);
      if (T === l.from || T === S) {
        ne(
          l.from && l.to && l.from === l.to ? G(l.from, !1, $) : We(S)
        );
        return;
      }
    }
    ne(G(T, !1, $)), De && w({ h: De.getHours(), m: De.getMinutes() });
  }, [T, S, D, $, De]);
  const j = I(() => {
    if (!S) return null;
    const l = S.split(at).map((C) => C.trim()).filter(Boolean);
    if (l.length === 0) return null;
    const L = [];
    for (let C = 0; C < l.length; C++) {
      const U = Ke(l[C]);
      if (!U.from && !U.to) continue;
      const le = U.from ? Q(U.from) : null, ce = U.to ? Q(U.to) : null;
      L.push({
        fromTs: le ? le.getTime() : null,
        toTs: ce ? ce.getTime() : null
      });
    }
    return L.length > 0 ? L : null;
  }, [S]), o = I(() => j && j.length > 0 && j[0].fromTs !== null ? new Date(j[0].fromTs) : T ? Q(T) : null, [T, j]), y = I(
    () => o ? new Date(o.getFullYear(), o.getMonth(), o.getDate()).getTime() : null,
    [o]
  ), V = I(() => {
    const l = /* @__PURE__ */ new Date();
    return new Date(l.getFullYear(), l.getMonth(), l.getDate()).getTime();
  }, []), F = I(() => (/* @__PURE__ */ new Date()).getFullYear(), []), ve = I(
    () => $t(void 0, p, be, Ie),
    [p, be, Ie]
  ), se = I(() => p && p.trim() ? p.trim() : `${ve}-01-01`, [p, ve]), N = n && n.trim() ? n.trim() : `${F + 1}-12-31`, B = I(() => {
    const l = Q(se);
    return l ? R(l, $) : "";
  }, [se, $]), ie = I(() => {
    const l = Q(N);
    return l ? R(l, $) : "";
  }, [N, $]), k = I(() => He(se, !1), [se]), _ = I(() => He(N, !0), [N]), O = A(
    (l) => {
      const L = l || /* @__PURE__ */ new Date(), C = Q(se) || new Date(ve, 0, 1), U = Q(N) || new Date(F + 1, 11, 31);
      return L.getTime() < C.getTime() ? C : L.getTime() > U.getTime() ? U : L;
    },
    [se, N, ve, F]
  ), [z, W] = X(() => O(o).getFullYear()), [Y, we] = X(() => O(o).getMonth()), [de, Be] = X("days"), ze = 264, Oe = (D ? 40 : 0) + 265 + ($ ? 40 : 0), Pe = A(() => {
    const l = pt(
      h.current,
      ze,
      Oe
    );
    fe(
      (L) => L.top === l.top && L.left === l.left && L.isFlipUp === l.isFlipUp ? L : l
    );
  }, [ze, Oe]), Ye = A(() => {
    pe(!1), r?.();
  }, [r]), Se = A(() => {
    if (d) return;
    const l = O(o);
    W(l.getFullYear()), we(l.getMonth()), Be("days"), fe(
      pt(
        h.current,
        ze,
        Oe
      )
    );
    const L = !!h.current?.closest(".agv-multi-filter-popup");
    window.dispatchEvent(
      new CustomEvent("agv-close-all-popups", {
        detail: {
          except: L ? "multi-filter" : "datepicker",
          source: "datepicker"
        }
      })
    ), pe(!0);
  }, [d, O, o, ze, Oe]);
  _e(() => {
    if (ke && h.current) {
      const l = h.current.querySelector("input");
      l?.focus({ preventScroll: !0 }), l?.select();
    }
    x && Se();
  }, [ke, x, Se]), Ot(oe, Ye, Pe, h, q);
  const Ee = I(
    () => Nt(z, Y),
    [z, Y]
  ), Ce = A(
    (l) => {
      if (gt(l.ts, k, _)) return;
      te("");
      const L = new Date(l.date);
      L.setHours(me.h, me.m);
      const C = R(L, $);
      ne(G(C, !1, $)), ae(C, { from: C, to: C, preset: "" }), $ || (pe(!1), r?.());
    },
    [k, _, me, $, ae, r]
  ), Ve = A(() => {
    const l = o || /* @__PURE__ */ new Date(), L = new Date(l.getFullYear(), l.getMonth(), l.getDate(), me.h, me.m), C = R(L, $);
    ne(G(C, !1, $)), ae(C, { from: C, to: C, preset: "" }), pe(!1), r?.();
  }, [o, me, $, ae, r]), Re = A(() => {
    if (oe) return;
    const l = J.trim();
    if (!l) {
      te(""), ae("", { from: "", to: "", preset: "" });
      return;
    }
    if (S && l === We(S))
      return;
    if (D && tt.test(l)) {
      const C = `data_year_${l}`, U = Ke(C);
      te(C), ne(We(C)), ae(U.from, { from: U.from, to: U.to, preset: C });
      return;
    }
    te("");
    const L = Q(l);
    if (L) {
      let C = R(L, $);
      const U = C.slice(0, 10), le = B ? B.slice(0, 10) : "", ce = ie ? ie.slice(0, 10) : "";
      le && U < le && (C = B), ce && U > ce && (C = ie), ae(C, { from: C, to: C, preset: "" }), ne(G(C, !1, $));
    } else
      ne(G(T, !1, $));
  }, [oe, J, S, D, B, ie, T, $, ae]), je = A(
    (l, L) => {
      if (j && j.length > 0) {
        const C = new Date(l, L, 1, 0, 0, 0, 0).getTime(), U = new Date(l, L + 1, 0, 23, 59, 59, 999).getTime();
        return j.some(
          (le) => le.fromTs !== null && le.toTs !== null && le.fromTs <= U && le.toTs >= C
        );
      }
      return !!(o && o.getFullYear() === l && o.getMonth() === L);
    },
    [j, o]
  ), Le = A(
    (l) => {
      if (j && j.length > 0) {
        const L = new Date(l, 0, 1, 0, 0, 0, 0).getTime(), C = new Date(l, 11, 31, 23, 59, 59, 999).getTime();
        return j.some(
          (U) => U.fromTs !== null && U.toTs !== null && U.fromTs <= C && U.toTs >= L
        );
      }
      return !!(o && o.getFullYear() === l);
    },
    [j, o]
  ), Ae = A(
    (l, L) => {
      const C = l.ts, U = gt(C, k, _), le = C === V;
      let ce = !1, Ne = !1, Ue = !1, Qe = !1;
      if (j && j.length > 0)
        for (let ue = 0; ue < j.length; ue++) {
          const Me = j[ue];
          Me.fromTs !== null && C === Me.fromTs && (ce = !0), Me.toTs !== null && C === Me.toTs && (Ne = !0), Me.fromTs !== null && Me.toTs !== null && C >= Me.fromTs && C <= Me.toTs && (Ue = !0);
        }
      else
        Qe = y !== null && C === y;
      let P = "agv-cal-day-cell";
      return l.isWeekend && (P += " is-weekend"), l.isCurrentMonth || (P += " is-other-month"), U && (P += " is-disabled"), ce && (P += " is-range-start is-selected"), Ne && (P += " is-range-end is-selected"), Ue && (P += " is-in-range"), Qe && (P += " is-selected"), le && !Qe && !ce && !Ne && (P += " is-today"), /* @__PURE__ */ c(
        "button",
        {
          type: "button",
          disabled: U,
          onClick: () => Ce(l),
          className: P,
          children: l.dayNum
        },
        L
      );
    },
    [k, _, V, j, y, Ce]
  ), Ze = M === "xs" ? "is-xs" : M === "md" ? "is-md" : "is-sm";
  return /* @__PURE__ */ H("div", { className: `agv-datepicker-container ${v}`, ref: h, children: [
    /* @__PURE__ */ H(
      "div",
      {
        className: `agv-datepicker-input-box ${_t()} ${oe ? "is-focused" : ""} ${Ze}`,
        children: [
          Je && /* @__PURE__ */ c(Vt, { className: "pointer-events-none h-3 w-3 shrink-0 text-[var(--agv-text-subtle)]" }),
          /* @__PURE__ */ c(
            "input",
            {
              type: "text",
              name: "agv_date_picker",
              ...nt,
              disabled: d,
              value: J,
              onChange: (l) => ne(l.target.value),
              onBlur: Re,
              onKeyDown: (l) => l.key === "Enter" && Re(),
              onClick: () => oe ? Ye() : Se(),
              onDoubleClick: u,
              placeholder: $ ? "DD/MM/YYYY HH:mm" : i,
              className: "agv-datepicker-text"
            }
          ),
          Te && (T || S) && !d && /* @__PURE__ */ c(
            "button",
            {
              type: "button",
              onClick: (l) => {
                l.stopPropagation(), te(""), ne(""), ae("", { from: "", to: "", preset: "" });
              },
              className: "agv-datepicker-clear-btn agv-inline-clear-destructive",
              children: "×"
            }
          )
        ]
      }
    ),
    oe && qt(
      /* @__PURE__ */ H(
        "div",
        {
          ref: q,
          style: {
            position: "fixed",
            ...Z.isFlipUp ? { bottom: `${Z.bottom}px`, top: "auto" } : { top: `${Z.top}px`, bottom: "auto" },
            left: `${Z.left}px`,
            zIndex: 999999999
          },
          className: `agv-calendar-popover agv-popup-panel ${Z.isFlipUp ? "agv-spring-up" : "agv-spring-down"} ${D ? "agv-has-preset agv-daterange-popover" : ""} ${g ? Tt(g) : ""}`,
          "data-theme": g || void 0,
          "data-agv-popup": "true",
          onClick: (l) => l.stopPropagation(),
          onMouseDown: (l) => l.stopPropagation(),
          children: [
            D && /* @__PURE__ */ c("div", { className: "agv-datepicker-preset-section agv-daterange-preset-section mb-2 border-b border-[var(--agv-border)] pb-2", children: /* @__PURE__ */ c(
              jt,
              {
                value: S,
                min: se,
                max: N,
                dateAnalysis: be,
                label: "Mốc thời gian:",
                theme: g,
                onSelect: (l, L) => {
                  if (te(l), l) {
                    const C = Ke(l), U = Q(se), le = Q(N);
                    let ce = C.from, Ne = C.to, Ue = C.from ? Q(C.from) : null, Qe = C.to ? Q(C.to) : null;
                    Ue && U && Ue.getTime() < U.getTime() && (ce = R(U, !1)), Qe && le && Qe.getTime() > le.getTime() && (Ne = R(le, !1));
                    const P = ce || Ne;
                    if (P) {
                      ne(
                        !!(ce && Ne) && ce === Ne ? G(P, !1, $) : We(l)
                      ), ae(P, {
                        from: ce,
                        to: Ne,
                        preset: l
                      });
                      const Me = Q(P);
                      Me && (W(Me.getFullYear()), we(Me.getMonth()));
                    }
                    Be("days"), !L && !$ && pe(!1);
                  } else
                    ne(""), ae("", { from: "", to: "", preset: "" }), !L && !$ && pe(!1);
                }
              }
            ) }),
            /* @__PURE__ */ c(
              ct,
              {
                calendarView: de,
                setCalendarView: Be,
                navYear: z,
                setNavYear: W,
                navMonth: Y,
                setNavMonth: we,
                calendarCells: Ee,
                activeDate: o,
                minTs: k,
                maxTs: _,
                minYear: ve,
                isMonthSelected: je,
                isYearSelected: Le,
                renderDayCell: Ae
              }
            ),
            $ && /* @__PURE__ */ H("div", { className: "agv-time-footer", children: [
              /* @__PURE__ */ H("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ c(
                  ot,
                  {
                    hours: me.h,
                    minutes: me.m,
                    onChangeTime: (l, L) => w({ h: l, m: L })
                  }
                ),
                /* @__PURE__ */ c(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      const l = /* @__PURE__ */ new Date();
                      w({ h: l.getHours(), m: l.getMinutes() });
                    },
                    className: "agv-time-quick-btn",
                    children: "Hiện tại"
                  }
                )
              ] }),
              /* @__PURE__ */ c(
                "button",
                {
                  type: "button",
                  onClick: Ve,
                  className: "agv-apply-btn",
                  children: "Áp dụng"
                }
              )
            ] })
          ]
        }
      ),
      h.current?.ownerDocument?.body || document.body
    )
  ] });
});
export {
  Nn as A,
  _n as a,
  jt as b
};
