import { jsxs as I, jsx as l, Fragment as Ht } from "react/jsx-runtime";
import { useRef as ot, useEffect as ye, memo as mt, useMemo as B, useCallback as Q, useState as ee } from "react";
import { createPortal as Ot } from "react-dom";
import { N as dt, g as Yt, A as It } from "./AdvButton-Ck5SixaL.js";
import { f as J } from "./gridFormatUtils-wCKPmlrt.js";
import { A as Mt } from "./arrow-right-11XxQBV1.js";
import { g as qt, S as en } from "./common-29M8PlVv.js";
import { c as jt } from "./createLucideIcon-BCMt_G8a.js";
import { M as tn } from "./MorphIcons-DW5eQGeo.js";
import { A as nn } from "./AdvOverlayScroll-CipuwW1l.js";
import { A as an, D as rn } from "./AdvPopover-CVmyHBzb.js";
import { C as on } from "./chevron-down-CoESPSbY.js";
import { C as sn } from "./chevron-right-CgsC9jVS.js";
const At = {
  name: "calendar",
  size: 24,
  node: [
    ["path", { d: "M8 2v3", key: "1ioesn" }],
    ["path", { d: "M16 2v3", key: "otl347" }],
    ["rect", { x: "3", y: "3", width: "18", height: "18", rx: "2", key: "h1oib" }],
    ["path", { d: "M3 9h18", key: "1pudct" }]
  ]
};
At.node;
const ln = jt(At);
const Ut = {
  name: "clock",
  size: 24,
  node: [
    ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
    ["path", { d: "M12 6v6l4 2", key: "mmk7yg" }]
  ]
};
Ut.node;
const cn = jt(Ut), Pt = "agv-datepicker-core-styles";
function Dt() {
  if (typeof document > "u") return;
  const o = `
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
    .agv-datepicker-input-box.is-auth,
    .agv-daterange-bar.is-auth,
    .agv-custom-select-trigger.is-auth {
      height: 48px;
      min-height: 48px;
      border-radius: var(--control-radius);
      font-size: var(--font-size-body, 14px);
      line-height: 20px;
      padding: 0 12px;
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
    .agv-datepicker-input-box[aria-invalid="true"],
    .agv-daterange-bar[aria-invalid="true"],
    .agv-custom-select-trigger[aria-invalid="true"],
    .agv-datepicker-input-box[aria-invalid="true"]:hover:not(.is-focused):not(:focus-within),
    .agv-daterange-bar[aria-invalid="true"]:hover:not(.is-focused):not(:focus-within),
    .agv-custom-select-trigger[aria-invalid="true"]:hover:not(.is-open) {
      border-color: var(--destructive);
    }
    .agv-datepicker-input-box[aria-invalid="true"].is-focused,
    .agv-datepicker-input-box[aria-invalid="true"]:focus-within,
    .agv-daterange-bar[aria-invalid="true"].is-focused,
    .agv-daterange-bar[aria-invalid="true"]:focus-within,
    .agv-custom-select-trigger[aria-invalid="true"].is-open,
    .agv-custom-select-trigger[aria-invalid="true"]:focus-visible {
      border-color: var(--destructive);
      box-shadow: inset 0 0 0 1px var(--destructive);
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
    .agv-liquid .agv-datepicker-input-box:not([aria-invalid="true"]).is-focused,
    .agv-liquid .agv-datepicker-input-box:not([aria-invalid="true"]):focus-within,
    .agv-liquid .agv-daterange-bar:not([aria-invalid="true"]).is-focused,
    .agv-liquid .agv-daterange-bar:not([aria-invalid="true"]):focus-within {
      background: var(--control-focus-background, var(--control-background));
      box-shadow: inset 0 0 0 1px var(--brand), 0 0 0 3px color-mix(in srgb, var(--brand) 18%, transparent);
    }
    .agv-liquid .agv-calendar-popover,
    .agv-calendar-popover.agv-liquid,
    .agv-liquid .agv-custom-select-dropdown {
      backdrop-filter: blur(40px) saturate(195%);
      -webkit-backdrop-filter: blur(40px) saturate(195%);
    }
  `;
  let t = document.getElementById(Pt);
  t || (t = document.createElement("style"), t.id = Pt, document.head.firstChild ? document.head.insertBefore(t, document.head.firstChild) : document.head.appendChild(t)), t.textContent !== o && (t.textContent = o);
}
typeof document < "u" && Dt();
const dn = [
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
], un = [
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
], gn = [
  { label: "CN", isWeekend: !0 },
  { label: "T2", isWeekend: !1 },
  { label: "T3", isWeekend: !1 },
  { label: "T4", isWeekend: !1 },
  { label: "T5", isWeekend: !1 },
  { label: "T6", isWeekend: !1 },
  { label: "T7", isWeekend: !0 }
], Qt = /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})(?:\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/, Gt = /^(\d{4})[/-](\d{1,2})[/-](\d{1,2})(?:\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/, pn = /^(\d{1,2})[/-](\d{1,2})$/, Et = /^data_week_(\d{4})_w(\d{1,2})$/, xt = /^data_quarter_(\d{4})_q([1-4])$/, bt = /^data_month_(\d{4})_m(\d{1,2})$/, Kt = /^data_year_(\d{4})$/, ct = /^(\d{4})$/, fn = /(?:data_year_|data_quarter_|data_month_|data_week_)(\d{4})/, mn = /_(\d{4})/, ut = /[,;]/, vn = /[;\u2014]|\.\.|\s-\s/, St = {
  1: "I",
  2: "II",
  3: "III",
  4: "IV"
};
function qe(o) {
  const t = String(o);
  return t.length < 2 ? `0${t}` : t;
}
function q(o, t = !1) {
  if (!o) return "";
  const u = o.getTime();
  if (Number.isNaN(u)) return "";
  const e = `${o.getFullYear()}-${qe(o.getMonth() + 1)}-${qe(o.getDate())}`;
  return t ? `${e} ${qe(o.getHours())}:${qe(o.getMinutes())}` : e;
}
function Ke(o, t = !1) {
  if (!o) return null;
  if (o instanceof Date) {
    const n = o.getTime();
    return Number.isNaN(n) ? null : n;
  }
  const u = String(o).trim();
  if (!u) return null;
  const e = Qt.exec(u);
  if (e) {
    const n = parseInt(e[1], 10), i = parseInt(e[2], 10) - 1, d = parseInt(e[3], 10), m = e[4] !== void 0 ? parseInt(e[4], 10) : t ? 23 : 0, p = e[5] !== void 0 ? parseInt(e[5], 10) : t ? 59 : 0, h = e[6] !== void 0 ? parseInt(e[6], 10) : t ? 59 : 0, k = t && e[4] === void 0 ? 999 : 0, T = new Date(d, i, n, m, p, h, k);
    return T.getFullYear() === d && T.getMonth() === i && T.getDate() === n ? T.getTime() : null;
  }
  const r = Gt.exec(u);
  if (r) {
    const n = parseInt(r[1], 10), i = parseInt(r[2], 10) - 1, d = parseInt(r[3], 10), m = r[4] !== void 0 ? parseInt(r[4], 10) : t ? 23 : 0, p = r[5] !== void 0 ? parseInt(r[5], 10) : t ? 59 : 0, h = r[6] !== void 0 ? parseInt(r[6], 10) : t ? 59 : 0, k = t && r[4] === void 0 ? 999 : 0, T = new Date(n, i, d, m, p, h, k);
    return T.getFullYear() === n && T.getMonth() === i && T.getDate() === d ? T.getTime() : null;
  }
  const v = Date.parse(u);
  return Number.isNaN(v) ? null : v;
}
function K(o, t) {
  if (!o) return null;
  if (o instanceof Date)
    return Number.isNaN(o.getTime()) ? null : new Date(o.getFullYear(), o.getMonth(), o.getDate(), o.getHours(), o.getMinutes());
  const u = String(o).trim();
  if (!u) return null;
  const e = Qt.exec(u);
  if (e) {
    const i = parseInt(e[1], 10), d = parseInt(e[2], 10) - 1, m = parseInt(e[3], 10), p = e[4] !== void 0 ? parseInt(e[4], 10) : 0, h = e[5] !== void 0 ? parseInt(e[5], 10) : 0, k = new Date(m, d, i, p, h, 0);
    if (k.getFullYear() === m && k.getMonth() === d && k.getDate() === i)
      return k;
  }
  const r = Gt.exec(u);
  if (r) {
    const i = parseInt(r[1], 10), d = parseInt(r[2], 10) - 1, m = parseInt(r[3], 10), p = r[4] !== void 0 ? parseInt(r[4], 10) : 0, h = r[5] !== void 0 ? parseInt(r[5], 10) : 0, k = new Date(i, d, m, p, h, 0);
    if (k.getFullYear() === i && k.getMonth() === d && k.getDate() === m)
      return k;
  }
  const v = pn.exec(u);
  if (v) {
    const i = parseInt(v[1], 10), d = parseInt(v[2], 10) - 1, m = t || (/* @__PURE__ */ new Date()).getFullYear(), p = new Date(m, d, i);
    if (p.getFullYear() === m && p.getMonth() === d && p.getDate() === i)
      return p;
  }
  const n = Ke(u);
  return n !== null ? new Date(n) : null;
}
function rt(o, t) {
  if (!o) return { from: "", to: "" };
  if (o.includes(",") || o.includes(";")) {
    const n = o.split(ut).map((m) => m.trim()).filter(Boolean);
    if (n.length === 0) return { from: "", to: "" };
    if (n.length === 1)
      return rt(n[0]);
    let i = "", d = "";
    for (let m = 0; m < n.length; m++) {
      const p = rt(n[m]);
      p.from && (!i || p.from < i) && (i = p.from), p.to && (!d || p.to > d) && (d = p.to);
    }
    return { from: i, to: d };
  }
  const u = /* @__PURE__ */ new Date(), e = u.getFullYear(), r = u.getMonth(), v = u.getDate();
  switch (o) {
    case "today": {
      const n = q(u);
      return { from: n, to: n };
    }
    case "yesterday": {
      const n = q(new Date(e, r, v - 1));
      return { from: n, to: n };
    }
    case "mon": {
      const n = (u.getDay() + 6) % 7, i = q(
        new Date(e, r, v - n)
      );
      return { from: i, to: i };
    }
    case "sat_prev_week": {
      const n = (u.getDay() + 6) % 7, i = q(
        new Date(e, r, v - n - 2)
      );
      return { from: i, to: i };
    }
    case "sun_prev_week": {
      const n = (u.getDay() + 6) % 7, i = q(
        new Date(e, r, v - n - 1)
      );
      return { from: i, to: i };
    }
    case "this_week": {
      const n = (u.getDay() + 6) % 7, i = new Date(e, r, v - n), d = new Date(e, r, v - n + 6);
      return { from: q(i), to: q(d) };
    }
    case "last_week": {
      const n = (u.getDay() + 6) % 7, i = new Date(e, r, v - n - 7), d = new Date(e, r, v - n - 1);
      return { from: q(i), to: q(d) };
    }
    case "this_month": {
      const n = new Date(e, r, 1), i = new Date(e, r + 1, 0);
      return { from: q(n), to: q(i) };
    }
    case "this_quarter": {
      const n = Math.floor(r / 3), i = new Date(e, n * 3, 1), d = new Date(e, n * 3 + 3, 0);
      return { from: q(i), to: q(d) };
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
      if (ct.test(o)) {
        const n = parseInt(o, 10);
        return { from: `${n}-01-01`, to: `${n}-12-31` };
      }
      if (o.startsWith("m")) {
        const n = parseInt(o.substring(1), 10);
        if (!Number.isNaN(n) && n >= 1 && n <= 12) {
          const i = e, d = new Date(i, n - 1, 1), m = new Date(i, n, 0);
          return { from: q(d), to: q(m) };
        }
      }
      if (o.startsWith("data_year_")) {
        const n = parseInt(o.slice(10), 10);
        if (!Number.isNaN(n))
          return { from: `${n}-01-01`, to: `${n}-12-31` };
      }
      if (o.startsWith("data_quarter_")) {
        const n = xt.exec(o);
        if (n) {
          const i = n[1], d = parseInt(n[2], 10), m = qe((d - 1) * 3 + 1), p = qe(d * 3), h = d === 1 || d === 4 ? "31" : "30";
          return { from: `${i}-${m}-01`, to: `${i}-${p}-${h}` };
        }
      }
      if (o.startsWith("data_week_")) {
        const n = Et.exec(o);
        if (n) {
          const i = parseInt(n[1], 10), d = parseInt(n[2], 10);
          if (d >= 1 && d <= 53)
            return Xt(i, d);
        }
      }
      if (o.startsWith("data_month_")) {
        const n = bt.exec(o);
        if (n) {
          const i = parseInt(n[1], 10), d = parseInt(n[2], 10), m = new Date(i, d - 1, 1), p = new Date(i, d, 0);
          return { from: q(m), to: q(p) };
        }
      }
      return { from: "", to: "" };
    }
  }
}
function hn(o) {
  const t = new Date(
    Date.UTC(o.getFullYear(), o.getMonth(), o.getDate())
  ), u = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - u);
  const e = t.getUTCFullYear(), r = new Date(Date.UTC(e, 0, 1));
  return { week: Math.ceil(
    ((t.getTime() - r.getTime()) / 864e5 + 1) / 7
  ), year: e };
}
function Xt(o, t) {
  const e = new Date(o, 0, 4).getDay() || 7, r = new Date(o, 0, 4 - (e - 1)), v = new Date(
    r.getFullYear(),
    r.getMonth(),
    r.getDate() + (t - 1) * 7
  ), n = new Date(
    v.getFullYear(),
    v.getMonth(),
    v.getDate() + 6
  );
  return {
    from: q(v),
    to: q(n)
  };
}
function xn(o) {
  const t = /* @__PURE__ */ new Set(), u = /* @__PURE__ */ new Set();
  for (let e = 0; e < o.length; e++) {
    const r = o[e];
    if (!r) continue;
    t.add(r);
    const v = mn.exec(r);
    v && u.add(Number(v[1]));
  }
  for (const e of u) {
    for (let m = 1; m <= 4; m++) {
      const p = `data_quarter_${e}_q${m}`, h = `data_month_${e}_m${(m - 1) * 3 + 1}`, k = `data_month_${e}_m${(m - 1) * 3 + 2}`, T = `data_month_${e}_m${(m - 1) * 3 + 3}`;
      t.has(h) && t.has(k) && t.has(T) && (t.delete(h), t.delete(k), t.delete(T), t.add(p)), t.has(p) && (t.delete(h), t.delete(k), t.delete(T));
    }
    const r = `data_year_${e}`, v = `data_quarter_${e}_q1`, n = `data_quarter_${e}_q2`, i = `data_quarter_${e}_q3`, d = `data_quarter_${e}_q4`;
    if (t.has(v) && t.has(n) && t.has(i) && t.has(d) && (t.delete(v), t.delete(n), t.delete(i), t.delete(d), t.add(r)), t.has(r)) {
      for (let m = 1; m <= 4; m++)
        t.delete(`data_quarter_${e}_q${m}`);
      for (let m = 1; m <= 12; m++)
        t.delete(`data_month_${e}_m${m}`);
    }
  }
  return Array.from(t);
}
function je(o, t) {
  if (!o) return "";
  if (o.includes(",") || o.includes(";")) {
    const e = o.split(ut).map((n) => n.trim()).filter(Boolean);
    if (e.length === 0) return "";
    if (e.length === 1) return je(e[0], t);
    const r = e.map((n) => {
      const i = Et.exec(n);
      if (i) return { type: "w", year: i[1], val: i[2], order: Number(i[2]) };
      const d = xt.exec(n);
      if (d) return { type: "q", year: d[1], val: d[2], order: Number(d[2]) * 10 };
      const m = bt.exec(n);
      if (m) return { type: "m", year: m[1], val: m[2], order: Number(m[2]) };
      const p = Kt.exec(n);
      return p ? { type: "y", year: p[1], val: p[1], order: 0 } : null;
    });
    if (r.every((n) => n !== null)) {
      const n = r, i = n[0].year;
      if (n.every((d) => d.year === i)) {
        const m = [...n].sort((p, h) => p.order - h.order).map((p) => p.type === "w" ? `Tuần ${p.val}` : p.type === "q" ? `Q${St[Number(p.val)] || "IV"}` : p.type === "m" ? `T${p.val}` : `Năm ${p.val}`);
        return m.length <= 4 ? `${m.join(", ")} (${i})` : `${m.slice(0, 3).join(", ")}... (+${m.length - 3}) (${i})`;
      }
    }
    const v = e.map((n) => je(n, t));
    return v.length <= 3 ? v.join(", ") : `${v.slice(0, 2).join(", ")}... (${v.length} mốc)`;
  }
  const u = (/* @__PURE__ */ new Date()).getFullYear();
  switch (o) {
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
      return `Năm nay (${u})`;
    case "last_year":
      return `Năm trước (${u - 1})`;
    case "q1":
      return t && t !== u ? `Quý I (${t})` : "Quý I";
    case "q2":
      return t && t !== u ? `Quý II (${t})` : "Quý II";
    case "q3":
      return t && t !== u ? `Quý III (${t})` : "Quý III";
    case "q4":
      return t && t !== u ? `Quý IV (${t})` : "Quý IV";
    default: {
      if (ct.test(o))
        return `Năm ${o}`;
      if (o.startsWith("m")) {
        const e = parseInt(o.substring(1), 10);
        if (!Number.isNaN(e) && e >= 1 && e <= 12)
          return t && t !== u ? `Tháng ${e} (${t})` : `Tháng ${e}`;
      }
      if (o.startsWith("data_year_"))
        return `Năm ${o.slice(10)}`;
      if (o.startsWith("data_quarter_")) {
        const e = xt.exec(o);
        if (e)
          return `Quý ${St[Number(e[2])] || "IV"} (${e[1]})`;
      }
      if (o.startsWith("data_week_")) {
        const e = Et.exec(o);
        if (e)
          return `Tuần ${e[2]} (${e[1]})`;
      }
      if (o.startsWith("data_month_")) {
        const e = bt.exec(o);
        if (e)
          return `Tháng ${e[2]} (${e[1]})`;
      }
      return o;
    }
  }
}
function yt(o, t, u) {
  const e = typeof o == "number" ? o : o.getTime();
  return t !== null && e < t || u !== null && e > u;
}
function ft(o, t, u) {
  let e = o + u, r = t;
  return e < 0 ? (e = 11, r--) : e > 11 && (e = 0, r++), { month: e, year: r };
}
function Ft(o, t) {
  const u = new Date(o, t, 1), e = new Date(o, t + 1, 0), r = u.getDay(), v = e.getDate(), n = new Date(o, t, 0).getDate(), i = new Array(42);
  let d = 0;
  for (let p = r - 1; p >= 0; p--) {
    const h = n - p, k = new Date(o, t - 1, h), T = k.getDay();
    i[d++] = {
      date: k,
      dayNum: h,
      isCurrentMonth: !1,
      ts: k.getTime(),
      isWeekend: T === 0 || T === 6
    };
  }
  for (let p = 1; p <= v; p++) {
    const h = new Date(o, t, p), k = h.getDay();
    i[d++] = {
      date: h,
      dayNum: p,
      isCurrentMonth: !0,
      ts: h.getTime(),
      isWeekend: k === 0 || k === 6
    };
  }
  const m = 42 - d;
  for (let p = 1; p <= m; p++) {
    const h = new Date(o, t + 1, p), k = h.getDay();
    i[d++] = {
      date: h,
      dayNum: p,
      isCurrentMonth: !1,
      ts: h.getTime(),
      isWeekend: k === 0 || k === 6
    };
  }
  return i;
}
function Jt(o, t, u, e, r) {
  const v = ot(t), n = ot(u);
  ye(() => {
    v.current = t, n.current = u;
  }), ye(() => {
    if (!o) return;
    let i = null;
    const d = (T) => {
      const Z = T.target;
      Z && (Z?.closest?.(
        ".agv-portal-dropdown, .agv-preset-dropdown-menu, .agv-calendar-popover, .agv-daterange-popover, .agv-custom-select-dropdown"
      ) || e?.current && e.current.contains(Z) || r?.current && r.current.contains(Z) || v.current());
    }, m = (T) => {
      T.key === "Escape" && (T.stopPropagation(), v.current());
    }, p = (T) => {
      T?.type === "scroll" && r?.current && typeof Node < "u" && T.target instanceof Node && r.current.contains(T.target) || i === null && (i = window.requestAnimationFrame(() => {
        i = null, n.current?.();
      }));
    }, h = (T) => {
      const Z = T.target;
      Z && (!r?.current || !r.current.contains(Z)) && v.current();
    }, k = (T) => {
      const Z = T;
      if (!(e?.current?.closest(".agv-multi-filter-popup") && Z.detail?.except === "multi-filter") && Z.detail?.except !== "datepicker") {
        if (Z.detail?.except === "focus-cell" && e?.current) {
          const se = e.current.closest(".agv-filter-cell-box");
          if (se && (se.contains(document.activeElement) || se === document.activeElement))
            return;
        }
        v.current();
      }
    };
    return document.addEventListener("mousedown", d, { passive: !0 }), document.addEventListener("contextmenu", h), window.addEventListener("agv-close-all-popups", k), document.addEventListener("keydown", m), window.addEventListener("resize", p, { passive: !0 }), window.addEventListener("scroll", p, {
      capture: !0,
      passive: !0
    }), () => {
      i !== null && window.cancelAnimationFrame(i), document.removeEventListener("mousedown", d), document.removeEventListener("contextmenu", h), window.removeEventListener("agv-close-all-popups", k), document.removeEventListener("keydown", m), window.removeEventListener("resize", p), window.removeEventListener("scroll", p, !0);
    };
  }, [o, e, r]);
}
function kt(o, t = 264, u = 310) {
  if (!o || typeof window > "u")
    return { top: 0, left: 0, bottom: 0, isFlipUp: !1 };
  const v = (o.closest(".agv-filter-cell-box") || o.closest(".agv-filter-cell") || o).getBoundingClientRect(), n = window.innerWidth, i = window.innerHeight;
  let d = Math.round(v.left);
  d + t > n - 12 && (d = Math.max(12, n - t - 12)), d < 12 && (d = 12);
  const m = i - v.bottom - 8, p = v.top - 8, h = m < u && p > m, k = h ? Math.max(8, Math.round(v.top - u - 4)) : Math.round(v.bottom + 4), T = Math.round(i - v.top + 4);
  return { top: k, left: d, bottom: T, isFlipUp: h };
}
function Rt(o, t, u, e) {
  if (o !== void 0) return o;
  let r;
  if (e?.minDate instanceof Date && !Number.isNaN(e.minDate.getTime()))
    r = e.minDate.getFullYear();
  else if (e?.minTs && e.minTs !== 1 / 0)
    r = new Date(e.minTs).getFullYear();
  else if (u?.minYear !== void 0 && u.minYear > 1900)
    r = u.minYear;
  else if (u?.minDate instanceof Date && !Number.isNaN(u.minDate.getTime()))
    r = u.minDate.getFullYear();
  else if (u?.yearCounts) {
    const i = Object.keys(u.yearCounts);
    for (let d = 0; d < i.length; d++) {
      const m = Number(i[d]);
      m > 1900 && (u.yearCounts[m] || 0) > 0 && (r === void 0 || m < r) && (r = m);
    }
  }
  let v;
  if (t && t.trim()) {
    const i = K(t);
    if (i)
      v = i.getFullYear();
    else {
      const d = parseInt(t.trim(), 10);
      !Number.isNaN(d) && d > 1900 && d < 2200 && (v = d);
    }
  }
  const n = r !== void 0 && v !== void 0 ? Math.min(r, v) : r !== void 0 ? r : v;
  return n !== void 0 && n < 2026 ? n : 2026;
}
const pt = mt(function({
  hours: t,
  minutes: u,
  onChangeTime: e,
  label: r = ""
}) {
  const [v, n] = ee(() => qe(t)), [i, d] = ee(() => qe(u));
  ye(() => {
    n(qe(t));
  }, [t]), ye(() => {
    d(qe(u));
  }, [u]);
  const m = () => {
    let h = parseInt(v, 10);
    (Number.isNaN(h) || h < 0) && (h = 0), h > 23 && (h = 23), n(qe(h)), e(h, u);
  }, p = () => {
    let h = parseInt(i, 10);
    (Number.isNaN(h) || h < 0) && (h = 0), h > 59 && (h = 59), d(qe(h)), e(t, h);
  };
  return /* @__PURE__ */ I("div", { className: "agv-time-picker-block", children: [
    r && /* @__PURE__ */ I("span", { className: "text-xs text-[var(--agv-text-subtle)] font-medium mr-1", children: [
      r,
      ":"
    ] }),
    /* @__PURE__ */ I("div", { className: "agv-time-input-wrap", children: [
      /* @__PURE__ */ l(cn, { className: "h-3 w-3 text-[var(--agv-text-subtle)] mr-1" }),
      /* @__PURE__ */ l(
        "input",
        {
          type: "text",
          maxLength: 2,
          value: v,
          onChange: (h) => n(h.target.value.replace(/\D/g, "")),
          onBlur: m,
          onKeyDown: (h) => h.key === "Enter" && m(),
          className: "agv-time-num-input",
          ...dt
        }
      ),
      /* @__PURE__ */ l("span", { className: "agv-time-sep", children: ":" }),
      /* @__PURE__ */ l(
        "input",
        {
          type: "text",
          maxLength: 2,
          value: i,
          onChange: (h) => d(h.target.value.replace(/\D/g, "")),
          onBlur: p,
          onKeyDown: (h) => h.key === "Enter" && p(),
          className: "agv-time-num-input",
          ...dt
        }
      )
    ] })
  ] });
}), ht = mt(
  function({
    calendarView: t,
    setCalendarView: u,
    navYear: e,
    setNavYear: r,
    navMonth: v,
    setNavMonth: n,
    calendarCells: i,
    renderDayCell: d,
    onGridMouseLeave: m,
    activeDate: p,
    minTs: h = null,
    maxTs: k = null,
    minYear: T,
    maxYear: Z,
    isMonthSelected: $e,
    getMonthRangeStatus: se,
    isYearSelected: L,
    hideNavLeft: Se = !1,
    hideNavRight: D = !1,
    onPrevMonth: me,
    onNextMonth: oe
  }) {
    const ge = B(() => {
      const x = /* @__PURE__ */ new Date();
      return { year: x.getFullYear(), month: x.getMonth() };
    }, []), Ne = Math.floor(e / 10) * 10, Re = Ne + 9, ze = B(() => {
      const x = [];
      for (let C = Ne - 1; C <= Ne + 10; C++)
        x.push({
          year: C,
          isOtherDecade: C < Ne || C > Re,
          startTs: new Date(C, 0, 1, 0, 0, 0, 0).getTime(),
          endTs: new Date(C, 11, 31, 23, 59, 59, 999).getTime()
        });
      return x;
    }, [Ne, Re]), Pe = B(() => un.map((x, C) => ({
      m: C,
      label: x,
      startTs: new Date(e, C, 1, 0, 0, 0, 0).getTime(),
      endTs: new Date(e, C + 1, 0, 23, 59, 59, 999).getTime()
    })), [e]), Me = B(() => {
      if (h === null && T === void 0) return !0;
      if (t === "days") {
        const C = new Date(
          e,
          v,
          0,
          23,
          59,
          59,
          999
        ).getTime();
        return h !== null ? C >= h : !0;
      }
      const x = T !== void 0 ? T : h !== null ? new Date(h).getFullYear() : 2026;
      return t === "months" ? e > x : t === "years" ? Ne > x : !0;
    }, [t, e, v, h, T, Ne]), Ce = B(() => {
      if (k === null && Z === void 0) return !0;
      if (t === "days") {
        const C = new Date(
          e,
          v + 1,
          1,
          0,
          0,
          0,
          0
        ).getTime();
        return k !== null ? C <= k : !0;
      }
      const x = Z !== void 0 ? Z : k !== null ? new Date(k).getFullYear() : ge.year + 1;
      return t === "months" ? e < x : t === "years" ? Re < x : !0;
    }, [t, e, v, k, Z, Re, ge.year]), Ae = Q(() => {
      if (Me) {
        if (me) {
          me();
          return;
        }
        if (t === "days") {
          const x = ft(v, e, -1);
          n(x.month), r(x.year);
        } else t === "months" ? r((x) => x - 1) : t === "years" && r((x) => x - 10);
      }
    }, [Me, me, t, v, e, n, r]), Ue = Q(() => {
      if (Ce) {
        if (oe) {
          oe();
          return;
        }
        if (t === "days") {
          const x = ft(v, e, 1);
          n(x.month), r(x.year);
        } else t === "months" ? r((x) => x + 1) : t === "years" && r((x) => x + 10);
      }
    }, [Ce, oe, t, v, e, n, r]), _ = Q(() => {
      t === "days" ? u("months") : t === "months" && u("years");
    }, [t, u]), E = t === "days" ? `${dn[v]}, ${e}` : t === "months" ? `${e}` : `${Ne} - ${Re}`;
    return /* @__PURE__ */ I("div", { className: "agv-calendar-body-wrap", children: [
      /* @__PURE__ */ I("div", { className: "agv-calendar-header", children: [
        Se ? /* @__PURE__ */ l("div", { className: "w-[28px]" }) : /* @__PURE__ */ l(
          "button",
          {
            type: "button",
            onClick: Ae,
            disabled: !Me,
            className: `agv-cal-nav-btn ${Me ? "" : "is-disabled"}`,
            children: "‹"
          }
        ),
        /* @__PURE__ */ l(
          "button",
          {
            type: "button",
            onClick: _,
            className: `agv-cal-title-btn ${t === "years" ? "is-static" : ""}`,
            children: E
          }
        ),
        D ? /* @__PURE__ */ l("div", { className: "w-[28px]" }) : /* @__PURE__ */ l(
          "button",
          {
            type: "button",
            onClick: Ue,
            disabled: !Ce,
            className: `agv-cal-nav-btn ${Ce ? "" : "is-disabled"}`,
            children: "›"
          }
        )
      ] }),
      t === "days" && /* @__PURE__ */ I(Ht, { children: [
        /* @__PURE__ */ l("div", { className: "agv-calendar-weekdays", children: gn.map((x) => /* @__PURE__ */ l(
          "div",
          {
            className: `agv-calendar-weekday ${x.isWeekend ? "is-weekend" : ""}`,
            children: x.label
          },
          x.label
        )) }),
        /* @__PURE__ */ l("div", { className: "agv-calendar-grid", onMouseLeave: m, children: i.map((x, C) => d(x, C)) })
      ] }),
      t === "months" && /* @__PURE__ */ l("div", { className: "agv-cal-matrix-grid", children: Pe.map(({ m: x, label: C, startTs: le, endTs: ie }) => {
        const A = se ? se(e, x) : {
          isStart: !1,
          isEnd: !1,
          inRange: !1,
          isSelected: $e ? $e(e, x) : !!(p && p.getFullYear() === e && p.getMonth() === x)
        }, te = ge.year === e && ge.month === x, s = h !== null && ie < h || k !== null && le > k;
        let b = "agv-cal-matrix-cell";
        return s ? b += " is-disabled" : A.isStart && A.isEnd ? b += " is-selected is-range-single" : A.isStart ? b += " is-range-start is-selected" : A.isEnd ? b += " is-range-end is-selected" : A.inRange ? b += " is-in-range" : A.isSelected ? b += " is-selected" : te && (b += " is-current"), /* @__PURE__ */ l(
          "button",
          {
            type: "button",
            disabled: s,
            className: b,
            onClick: () => {
              s || (n(x), u("days"));
            },
            children: C
          },
          x
        );
      }) }),
      t === "years" && /* @__PURE__ */ l("div", { className: "agv-cal-matrix-grid", children: ze.map(({ year: x, isOtherDecade: C, startTs: le, endTs: ie }) => {
        const A = L ? L(x) : !!(p && p.getFullYear() === x), te = ge.year === x, s = h !== null && ie < h || k !== null && le > k;
        let b = "agv-cal-matrix-cell";
        return C && (b += " is-other-decade"), s ? b += " is-disabled" : A ? b += " is-selected" : te && (b += " is-current"), /* @__PURE__ */ l(
          "button",
          {
            type: "button",
            disabled: s,
            className: b,
            onClick: () => {
              s || (r(x), u("months"));
            },
            children: x
          },
          x
        );
      }) })
    ] });
  }
), Ct = 16, Zt = mt(function({
  value: t,
  defaultOpen: u = !1,
  onSelect: e,
  dateAnalysis: r,
  label: v = "Mốc thời gian:",
  theme: n = "",
  size: i = "default",
  hideClear: d = !1,
  min: m = "",
  max: p = "",
  minYear: h,
  maxYear: k
}) {
  ye(() => {
    Dt();
  }, []);
  const [T, Z] = ee(u), [$e, se] = ee(!1);
  ye(() => {
    T || se(!1);
  }, [T]);
  const L = ot(null), Se = ot(null), [D, me] = ee(t || "");
  ye(() => {
    t !== void 0 && me(t);
  }, [t]);
  const oe = t !== void 0 ? t : D, ge = B(() => oe ? new Set(
    oe.split(ut).map((s) => s.trim()).filter(Boolean)
  ) : /* @__PURE__ */ new Set(), [oe]), Ne = Q(() => Z(!1), []), Re = Q(() => {
    Z((s) => {
      if (!s && !!!L.current?.closest(".agv-calendar-popover, .agv-daterange-popover")) {
        const ae = !!L.current?.closest(".agv-multi-filter-popup");
        window.dispatchEvent(
          new CustomEvent("agv-close-all-popups", {
            detail: {
              except: ae ? "multi-filter" : "datepicker",
              source: "datepicker-preset"
            }
          })
        );
      }
      return !s;
    });
  }, []);
  ye(() => {
    if (!T) return;
    const s = (b) => {
      const ae = b;
      if (!(L.current?.closest(".agv-multi-filter-popup") && ae.detail?.except === "multi-filter") && ae.detail?.except !== "datepicker") {
        if (ae.detail?.except === "focus-cell" && L.current) {
          const S = L.current.closest(".agv-filter-cell-box");
          if (S && (S.contains(document.activeElement) || S === document.activeElement))
            return;
        }
        Z(!1);
      }
    };
    return window.addEventListener("agv-close-all-popups", s), () => window.removeEventListener("agv-close-all-popups", s);
  }, [T]);
  const ze = B(() => (/* @__PURE__ */ new Date()).getFullYear(), []), Pe = B(
    () => Rt(h, m, r),
    [h, m, r]
  ), Me = B(() => {
    if (k !== void 0) return k;
    if (p && p.trim()) {
      const s = K(p);
      if (s) return s.getFullYear();
      const b = parseInt(p.trim(), 10);
      if (!Number.isNaN(b) && b > 1900 && b < 2200) return b;
    }
    return r?.maxDate instanceof Date && !Number.isNaN(r.maxDate.getTime()) ? r.maxDate.getFullYear() : ze + 1;
  }, [k, p, r, ze]), [Ce, Ae] = ee({}), Ue = Q((s, b) => {
    b.stopPropagation(), Ae((ae) => ({ ...ae, [s]: !ae[s] }));
  }, []), _ = B(() => m ? Ke(m, !1) : null, [m]), E = B(() => p ? Ke(p, !0) : null, [p]), x = Q(
    (s, b) => s === null && b === null ? !0 : !(_ !== null && b !== null && b < _ || E !== null && s !== null && s > E),
    [_, E]
  ), C = Q(
    (s) => {
      const b = oe ? oe.split(ut).map((Y) => Y.trim()).filter(Boolean) : [];
      let f = !b.every(
        (Y) => Y.startsWith("data_year_") || Y.startsWith("data_quarter_") || Y.startsWith("data_month_") || Y.startsWith("data_week_")
      ) || b.length === 0 ? [] : [...b];
      const S = bt.exec(s), re = xt.exec(s), w = Kt.exec(s);
      if (S) {
        const Y = Number(S[1]), N = Number(S[2]), U = Math.ceil(N / 3), j = `data_quarter_${Y}_q${U}`, F = `data_year_${Y}`;
        if (f.includes(s))
          f = f.filter((H) => H !== s);
        else if (f.includes(j)) {
          f = f.filter((H) => H !== j);
          for (let H = (U - 1) * 3 + 1; H <= U * 3; H++)
            H !== N && f.push(`data_month_${Y}_m${H}`);
        } else if (f.includes(F)) {
          f = f.filter((H) => H !== F);
          for (let H = 1; H <= 4; H++)
            if (H !== U)
              f.push(`data_quarter_${Y}_q${H}`);
            else
              for (let z = (U - 1) * 3 + 1; z <= U * 3; z++)
                z !== N && f.push(`data_month_${Y}_m${z}`);
        } else
          f.push(s);
      } else if (re) {
        const Y = Number(re[1]), N = Number(re[2]), U = `data_year_${Y}`;
        if (f.includes(s))
          f = f.filter((j) => j !== s);
        else if (f.includes(U)) {
          f = f.filter((j) => j !== U);
          for (let j = 1; j <= 4; j++)
            j !== N && f.push(`data_quarter_${Y}_q${j}`);
        } else {
          for (let j = (N - 1) * 3 + 1; j <= N * 3; j++) {
            const F = `data_month_${Y}_m${j}`;
            f = f.filter((H) => H !== F);
          }
          f.push(s);
        }
      } else if (w)
        if (f.includes(s))
          f = f.filter((Y) => Y !== s);
        else {
          const Y = Number(w[1]), N = `data_quarter_${Y}_`, U = `data_month_${Y}_`;
          f = f.filter(
            (j) => !j.startsWith(N) && !j.startsWith(U)
          ), f.push(s);
        }
      else
        f.includes(s) ? f = f.filter((Y) => Y !== s) : f.push(s);
      const O = xn(f).join(",");
      me(O), e?.(O, !0);
    },
    [oe, e]
  ), { weekItems: le, yearsData: ie } = B(() => {
    const s = r?.yearCounts || {}, b = r?.yearMonthCounts || {}, ae = r?.yearQuarterCounts || {}, f = r?.presetCounts || {}, S = !!(r && (Object.keys(s).length > 0 || Object.keys(f).length > 0)), { week: re, year: w } = hn(
      /* @__PURE__ */ new Date()
    ), P = [];
    for (let N = re; N >= 1; N--) {
      const U = `data_week_${w}_w${N}`, j = Xt(w, N), F = j.from ? Ke(j.from, !1) : null, H = j.to ? Ke(j.to, !0) : null;
      x(F, H) && P.push({ id: U, label: String(N) });
    }
    let O = [];
    if (r && Object.keys(s).length > 0 && (O = Object.keys(s).map(Number).filter((N) => {
      if ((s[N] || 0) <= 0) return !1;
      const U = new Date(N, 0, 1, 0, 0, 0, 0).getTime(), j = new Date(N, 11, 31, 23, 59, 59, 999).getTime();
      return x(U, j) ? N >= Pe && N <= Me : !1;
    }).sort((N, U) => U - N)), O.length === 0)
      for (let N = Me; N >= Pe; N--) {
        const U = new Date(N, 0, 1, 0, 0, 0, 0).getTime(), j = new Date(N, 11, 31, 23, 59, 59, 999).getTime();
        x(U, j) && O.push(N);
      }
    const Y = O.map((N) => {
      const U = [1, 2, 3, 4].map((F) => {
        const H = St[F], z = new Date(N, (F - 1) * 3, 1, 0, 0, 0, 0).getTime(), ke = new Date(N, F * 3, 0, 23, 59, 59, 999).getTime(), X = x(z, ke);
        return {
          q: F,
          id: `data_quarter_${N}_q${F}`,
          label: `Q${H}`,
          fullName: `Quý ${H}`,
          count: ae[N]?.[F] || 0,
          inRange: X
        };
      }).filter((F) => F.inRange ? S ? ge.has(F.id) || F.count > 0 : !0 : !1), j = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((F) => {
        const H = new Date(N, F - 1, 1, 0, 0, 0, 0).getTime(), z = new Date(N, F, 0, 23, 59, 59, 999).getTime(), ke = x(H, z);
        return {
          m: F,
          id: `data_month_${N}_m${F}`,
          label: `T${F}`,
          fullName: `Tháng ${F}`,
          count: b[N]?.[F] || 0,
          inRange: ke
        };
      }).filter((F) => F.inRange ? S ? ge.has(F.id) || F.count > 0 : !0 : !1);
      return {
        year: N,
        id: `data_year_${N}`,
        label: `Năm ${N}`,
        count: s[N] || 0,
        quarters: U,
        months: j
      };
    }).filter((N) => N.quarters.length > 0 || N.months.length > 0);
    return {
      weekItems: P,
      yearsData: Y
    };
  }, [
    r,
    Pe,
    Me,
    ge,
    x
  ]);
  ye(() => {
    if (T && ie.length > 0) {
      let s = ie[0].year;
      if (oe) {
        const b = fn.exec(oe);
        b && (s = parseInt(b[1], 10));
      } else ie.some((b) => b.year === ze) && (s = ze);
      Ae(
        (b) => b[s] ? b : { ...b, [s]: !0 }
      );
    }
  }, [oe, T, ze, ie]);
  const A = B(
    () => oe ? je(oe) : "",
    [oe]
  ), te = n ? qt(n) : "";
  return /* @__PURE__ */ I("div", { className: "agv-custom-select-wrap", children: [
    v && /* @__PURE__ */ l("label", { className: "agv-popup-label", children: v }),
    /* @__PURE__ */ I(
      "button",
      {
        ref: L,
        type: "button",
        "data-agv-popover-trigger": "true",
        onClick: Re,
        className: `agv-custom-select-trigger agv-preset-trigger ${Yt()} ${T ? "is-open" : ""} ${i === "xs" ? "is-xs" : i === "md" ? "is-md" : "is-sm"} ${oe ? "has-selected" : ""} ${te}`,
        children: [
          /* @__PURE__ */ l("div", { className: "agv-custom-select-trigger-content min-w-0 flex-1 text-left", children: /* @__PURE__ */ l(
            "span",
            {
              className: `agv-custom-select-trigger-label block truncate font-normal ${oe ? "text-foreground" : "text-muted-foreground"}`,
              children: A || "Chọn mốc..."
            }
          ) }),
          /* @__PURE__ */ I("div", { className: "flex flex-shrink-0 items-center gap-1", children: [
            oe && !d && /* @__PURE__ */ l(
              "span",
              {
                role: "button",
                tabIndex: 0,
                onClick: (s) => {
                  s.stopPropagation(), me(""), e?.("");
                },
                className: "agv-preset-trigger-clear",
                children: "×"
              }
            ),
            /* @__PURE__ */ l(
              on,
              {
                className: `${i === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} text-[var(--agv-text-subtle)] transition-transform duration-150 ${T ? "rotate-180 text-[var(--agv-accent)]" : ""}`
              }
            )
          ] })
        ]
      }
    ),
    /* @__PURE__ */ l(
      an,
      {
        isOpen: T,
        anchorEl: L.current,
        onClose: Ne,
        placement: "bottom-start",
        showArrow: !0,
        offset: 10,
        width: Math.max(L.current?.offsetWidth || 0, 320),
        minWidth: 320,
        paddingClassName: "p-0",
        contentClassName: "text-xs agv-preset-dropdown-menu agv-portal-dropdown",
        zIndex: 999999999,
        theme: n || en.LIGHT,
        ignoreClickOutsideSelectors: rn,
        children: /* @__PURE__ */ I(
          "div",
          {
            ref: Se,
            onMouseDown: (s) => s.stopPropagation(),
            className: `flex flex-col rounded-md overflow-hidden ${te}`,
            "data-theme": n || void 0,
            children: [
              /* @__PURE__ */ I(
                nn,
                {
                  className: "flex-initial min-h-0",
                  viewportClassName: "overflow-y-auto overflow-x-hidden p-1.5 overscroll-contain",
                  viewportStyle: {
                    maxHeight: ge.size > 0 ? "min(316px, calc(100vh - 140px))" : "min(358px, calc(100vh - 100px))"
                  },
                  contentSignature: `${$e ? le.length : Ct}-${ge.size}`,
                  children: [
                    le.length > 0 && /* @__PURE__ */ I("div", { className: "agv-preset-group agv-preset-matrix-group", children: [
                      /* @__PURE__ */ l("div", { className: "agv-preset-group-title", children: "Mốc theo tuần" }),
                      /* @__PURE__ */ l("div", { className: "agv-preset-week-grid", children: ($e ? le : le.slice(0, Ct)).map((s) => {
                        const b = ge.has(s.id);
                        return /* @__PURE__ */ l(
                          "button",
                          {
                            type: "button",
                            onClick: (ae) => {
                              if (ae.stopPropagation(), ae.ctrlKey || ae.metaKey) {
                                C(s.id);
                                return;
                              }
                              me(s.id), e?.(s.id, !1), Z(!1);
                            },
                            onContextMenu: (ae) => {
                              ae.preventDefault(), ae.stopPropagation(), C(s.id);
                            },
                            className: `agv-preset-chip is-week-chip ${b ? "is-active" : ""}`,
                            children: /* @__PURE__ */ l("span", { className: "agv-chip-label", children: s.label })
                          },
                          s.id
                        );
                      }) }),
                      le.length > Ct && /* @__PURE__ */ l("div", { className: "agv-preset-week-expand-wrap", children: /* @__PURE__ */ l(
                        "button",
                        {
                          type: "button",
                          "aria-label": $e ? "Thu gọn tuần" : "Mở rộng thêm tuần",
                          onClick: (s) => {
                            s.stopPropagation(), se((b) => !b);
                          },
                          className: "agv-preset-week-expand-btn",
                          children: /* @__PURE__ */ l(
                            tn,
                            {
                              expanded: $e,
                              type: "down-up",
                              size: 12,
                              spring: "snappy"
                            }
                          )
                        }
                      ) })
                    ] }),
                    ie.length > 0 && /* @__PURE__ */ l("div", { className: "agv-preset-group", children: ie.map((s) => {
                      const b = s.year, ae = !!Ce[b], f = ge.has(s.id), S = s.quarters.length > 0, re = s.months.length > 0;
                      return /* @__PURE__ */ I("div", { className: "agv-preset-year-group", children: [
                        /* @__PURE__ */ I(
                          "div",
                          {
                            role: "button",
                            tabIndex: 0,
                            onClick: (w) => Ue(b, w),
                            onKeyDown: (w) => {
                              (w.key === "Enter" || w.key === " ") && (w.preventDefault(), Ue(b, w));
                            },
                            onContextMenu: (w) => {
                              w.preventDefault(), w.stopPropagation(), Ue(b, w);
                            },
                            className: "agv-preset-item agv-preset-year-row",
                            children: [
                              /* @__PURE__ */ I("div", { className: "flex min-w-0 items-center gap-1.5 overflow-hidden", children: [
                                /* @__PURE__ */ l(
                                  "span",
                                  {
                                    className: "agv-preset-expand-btn",
                                    "aria-hidden": "true",
                                    children: /* @__PURE__ */ l(
                                      sn,
                                      {
                                        className: `h-3.5 w-3.5 text-[var(--agv-text-subtle)] transition-transform duration-150 ${ae ? "rotate-90 text-[var(--agv-accent)]" : ""}`
                                      }
                                    )
                                  }
                                ),
                                /* @__PURE__ */ l("span", { className: "agv-preset-item-text truncate font-medium", children: s.label })
                              ] }),
                              s.count !== void 0 && s.count > 0 && /* @__PURE__ */ l("div", { className: "flex flex-shrink-0 items-center gap-1.5", children: /* @__PURE__ */ l("span", { className: "agv-preset-item-count has-data", children: s.count.toLocaleString("vi-VN") }) })
                            ]
                          }
                        ),
                        ae && /* @__PURE__ */ I("div", { className: "agv-preset-subgrid", children: [
                          /* @__PURE__ */ I("div", { className: "agv-preset-chips-section", children: [
                            /* @__PURE__ */ l("span", { className: "agv-preset-chips-label", children: "Năm:" }),
                            /* @__PURE__ */ l("div", { className: "agv-preset-chips-list", children: /* @__PURE__ */ l(
                              "button",
                              {
                                type: "button",
                                onClick: (w) => {
                                  if (w.stopPropagation(), w.ctrlKey || w.metaKey) {
                                    C(s.id);
                                    return;
                                  }
                                  me(s.id), e?.(s.id, !1), Z(!1);
                                },
                                onContextMenu: (w) => {
                                  w.preventDefault(), w.stopPropagation(), C(s.id);
                                },
                                className: `agv-preset-chip ${f ? "is-active" : ""}`,
                                children: /* @__PURE__ */ l("span", { className: "agv-chip-label", children: "Cả năm" })
                              }
                            ) })
                          ] }),
                          S && /* @__PURE__ */ I("div", { className: "agv-preset-chips-section", children: [
                            /* @__PURE__ */ l("span", { className: "agv-preset-chips-label", children: "Quý:" }),
                            /* @__PURE__ */ l("div", { className: "agv-preset-chips-list", children: s.quarters.map((w) => {
                              const P = ge.has(w.id);
                              return /* @__PURE__ */ I(
                                "button",
                                {
                                  type: "button",
                                  onClick: (Y) => {
                                    if (Y.stopPropagation(), Y.ctrlKey || Y.metaKey) {
                                      C(w.id);
                                      return;
                                    }
                                    me(w.id), e?.(w.id, !1), Z(!1);
                                  },
                                  onContextMenu: (Y) => {
                                    Y.preventDefault(), Y.stopPropagation(), C(w.id);
                                  },
                                  className: `agv-preset-chip ${P ? "is-active" : ""} ${!P && f ? "is-included" : ""}`,
                                  children: [
                                    /* @__PURE__ */ l("span", { className: "agv-chip-label", children: w.label }),
                                    w.count !== void 0 && w.count > 0 && /* @__PURE__ */ l("span", { className: "agv-chip-count", children: w.count.toLocaleString("vi-VN") })
                                  ]
                                },
                                w.id
                              );
                            }) })
                          ] }),
                          re && /* @__PURE__ */ I("div", { className: "agv-preset-chips-section", children: [
                            /* @__PURE__ */ l("span", { className: "agv-preset-chips-label", children: "Tháng:" }),
                            /* @__PURE__ */ l("div", { className: "agv-preset-chips-list", children: s.months.map((w) => {
                              const P = ge.has(w.id), O = Math.ceil(w.m / 3), Y = ge.has(
                                `data_quarter_${b}_q${O}`
                              );
                              return /* @__PURE__ */ I(
                                "button",
                                {
                                  type: "button",
                                  onClick: (U) => {
                                    if (U.stopPropagation(), U.ctrlKey || U.metaKey) {
                                      C(w.id);
                                      return;
                                    }
                                    me(w.id), e?.(w.id, !1), Z(!1);
                                  },
                                  onContextMenu: (U) => {
                                    U.preventDefault(), U.stopPropagation(), C(w.id);
                                  },
                                  className: `agv-preset-chip ${P ? "is-active" : ""} ${!P && (Y || f) ? "is-included" : ""}`,
                                  children: [
                                    /* @__PURE__ */ l("span", { className: "agv-chip-label", children: w.label }),
                                    w.count !== void 0 && w.count > 0 && /* @__PURE__ */ l("span", { className: "agv-chip-count", children: w.count.toLocaleString("vi-VN") })
                                  ]
                                },
                                w.id
                              );
                            }) })
                          ] })
                        ] })
                      ] }, b);
                    }) })
                  ]
                }
              ),
              ge.size > 0 && /* @__PURE__ */ I("div", { className: "flex shrink-0 items-center justify-between border-t border-[var(--agv-border)] bg-[var(--agv-bg-popup)] px-2.5 py-1.5 text-xs", children: [
                /* @__PURE__ */ I("span", { className: "truncate font-medium text-[var(--agv-text-muted)]", children: [
                  "Đã chọn:",
                  " ",
                  /* @__PURE__ */ l("strong", { className: "text-[var(--agv-accent)]", children: A })
                ] }),
                /* @__PURE__ */ I("div", { className: "ml-2 flex shrink-0 items-center gap-1.5", children: [
                  /* @__PURE__ */ l(
                    It,
                    {
                      variant: "destructive",
                      size: "sm",
                      onClick: (s) => {
                        s.stopPropagation(), me(""), e?.("", !0);
                      },
                      className: "px-2",
                      children: "Bỏ chọn"
                    }
                  ),
                  /* @__PURE__ */ l(
                    It,
                    {
                      variant: "default",
                      size: "sm",
                      onClick: (s) => {
                        s.stopPropagation(), Z(!1);
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
}), Fn = mt(function({
  id: t,
  from: u,
  to: e,
  preset: r,
  onChange: v,
  onClose: n,
  min: i = "",
  max: d = "",
  placeholderFrom: m = "Từ",
  placeholderTo: p = "Đến",
  theme: h = "",
  dateAnalysis: k,
  bounds: T,
  size: Z = "default",
  variant: $e = "default",
  leadingIcon: se,
  showPreset: L = !0,
  dualMonth: Se = !0,
  showTime: D = !1,
  autoFocus: me = !1,
  defaultOpen: oe = !1,
  allowClear: ge = !0,
  className: Ne = "",
  invalid: Re,
  "aria-invalid": ze,
  "aria-describedby": Pe,
  "aria-errormessage": Me
}) {
  const Ce = !!(Re || ze);
  ye(() => {
    Dt();
  }, []);
  const [Ae, Ue] = ee({
    from: u || "",
    to: e || "",
    preset: r || ""
  }), _ = u !== void 0 ? u : Ae.from, E = e !== void 0 ? e : Ae.to, [x, C] = ee(!1), [le, ie] = ee(r || "");
  ye(() => {
    r !== void 0 && ie(r);
  }, [r]);
  const A = Q(
    (a) => {
      Ue({
        from: a.from,
        to: a.to,
        preset: a.preset || ""
      }), v?.(a);
    },
    [v]
  ), te = ot(null), s = ot(null), [b, ae] = ee({ top: 0, left: 0 }), f = B(() => _ ? K(_) : null, [_]), S = B(() => E ? K(E) : null, [E]), [re, w] = ee(() => ({
    h: f ? f.getHours() : 0,
    m: f ? f.getMinutes() : 0
  })), [P, O] = ee(() => ({
    h: S ? S.getHours() : 23,
    m: S ? S.getMinutes() : 59
  })), Y = !!(_ && E && (_ === E || f && S && f.toDateString() === S.toDateString())), N = !!(f && S && f.getFullYear() === S.getFullYear() || k?.yearCounts && Object.keys(k.yearCounts).length === 1 || k?.minDate && k?.maxDate && k.minDate.getFullYear() === k.maxDate.getFullYear()), U = m || "Từ", j = p || "Đến", [F, H] = ee("start"), [z, ke] = ee(() => f), [X, _e] = ee(() => S), [Qe, Fe] = ee(null), [Be, ve] = ee(() => {
    const a = !!(f && S && f.getFullYear() === S.getFullYear() && _ !== E);
    return J(_, a, D);
  }), [Xe, he] = ee(() => {
    const a = !!(f && S && f.getFullYear() === S.getFullYear() && _ !== E);
    return J(E, a, D);
  }), [Je, He] = ee("days");
  ye(() => {
    ke(f), _e(S), f && w({ h: f.getHours(), m: f.getMinutes() }), S && O({ h: S.getHours(), m: S.getMinutes() });
    const a = !!(f && S && f.getFullYear() === S.getFullYear() && _ !== E);
    ve(J(_, a, D)), he(J(E, a, D));
  }, [_, E, f, S, D]);
  const Ze = B(() => (/* @__PURE__ */ new Date()).getFullYear(), []), Ge = B(
    () => Rt(void 0, i, k, T),
    [i, k, T]
  ), Le = B(() => i && i.trim() ? i.trim() : `${Ge}-01-01`, [i, Ge]), Ye = d && d.trim() ? d.trim() : `${Ze + 1}-12-31`, Ee = B(() => {
    const a = K(Le);
    return a ? q(a, D) : "";
  }, [Le, D]), Te = B(() => {
    const a = K(Ye);
    return a ? q(a, D) : "";
  }, [Ye, D]), st = Q(
    (a) => {
      const y = a || /* @__PURE__ */ new Date(), g = K(Le) || new Date(Ge, 0, 1), M = K(Ye) || new Date(Ze + 1, 11, 31);
      return y.getTime() < g.getTime() ? g : y.getTime() > M.getTime() ? M : y;
    },
    [Le, Ye, Ge, Ze]
  ), [We, Ve] = ee(
    () => st(f).getFullYear()
  ), [Oe, et] = ee(
    () => st(f).getMonth()
  ), it = B(() => ft(Oe, We, 1), [Oe, We]), c = Se ? 518 : 264, R = (L ? 40 : 0) + 265 + (D ? Se ? 40 : 70 : 0), $ = Q(() => {
    const a = kt(te.current, c, R);
    ae(
      (y) => y.top === a.top && y.left === a.left && y.isFlipUp === a.isFlipUp ? y : a
    );
  }, [c, R]), G = Q(() => {
    if (C(!1), Fe(null), z && !X) {
      const a = q(z, D);
      A({ from: a, to: a, preset: "" }), he(J(a, !1, D));
    }
    n?.();
  }, [n, z, X, D, A]), ce = Q(
    (a) => {
      const y = st(a === "end" && S ? S : f);
      Ve(y.getFullYear()), et(y.getMonth()), H(a || (_ && !E ? "end" : "start")), ke(f), _e(S), Fe(null), He("days"), ae(kt(te.current, c, R));
      const g = !!te.current?.closest(".agv-multi-filter-popup");
      window.dispatchEvent(
        new CustomEvent("agv-close-all-popups", {
          detail: {
            except: g ? "multi-filter" : "datepicker",
            source: "datepicker"
          }
        })
      ), C(!0);
    },
    [st, f, S, _, E, c, R]
  );
  Jt(x, G, $, te, s), ye(() => {
    if (me && te.current) {
      const a = te.current.querySelector("input");
      a?.focus({ preventScroll: !0 }), a?.select();
    }
    oe && ce();
  }, [me, oe, ce]);
  const de = B(() => Ke(Le, !1), [Le]), be = B(() => Ke(Ye, !0), [Ye]), tt = B(
    () => Ft(We, Oe),
    [We, Oe]
  ), nt = B(
    () => Ft(it.year, it.month),
    [it]
  ), W = B(
    () => z ? new Date(
      z.getFullYear(),
      z.getMonth(),
      z.getDate()
    ).getTime() : null,
    [z]
  ), ue = B(
    () => X ? new Date(
      X.getFullYear(),
      X.getMonth(),
      X.getDate()
    ).getTime() : null,
    [X]
  ), we = Q(
    (a) => {
      if (!yt(a.ts, de, be))
        if (ie(""), F === "start" || !z && !X || z && X && F !== "end") {
          const y = new Date(a.date);
          y.setHours(re.h, re.m), ke(y), _e(null), Fe(null), H("end");
          const g = q(y, D);
          ve(J(g, !1, D)), he("");
        } else if (W !== null && a.ts < W) {
          const y = new Date(a.date);
          y.setHours(re.h, re.m);
          const g = z || y;
          ke(y), _e(g), Fe(null), H("start");
          const M = q(y, D), V = q(g, D);
          ve(J(M, !1, D)), he(J(V, !1, D)), A({ from: M, to: V, preset: "" }), D || (C(!1), n?.());
        } else {
          const y = new Date(a.date);
          y.setHours(P.h, P.m), _e(y), Fe(null), H("start");
          const g = q(z || y, D), M = q(y, D);
          he(J(M, !1, D)), A({ from: g, to: M, preset: "" }), D || (C(!1), n?.());
        }
    },
    [de, be, F, z, X, W, re, P, D, A, n]
  ), zt = Q(() => {
    if (z) {
      const a = new Date(z);
      a.setHours(re.h, re.m);
      const y = X ? new Date(X) : new Date(z);
      y.setHours(P.h, P.m);
      const g = q(a, D), M = q(y, D);
      A({ from: g, to: M, preset: "" }), ve(J(g, !1, D)), he(J(M, !1, D));
    }
    C(!1), n?.();
  }, [z, X, re, P, D, A, n]), Bt = Q(() => {
    if (x) return;
    if (ie(""), !Be.trim()) {
      A({ from: "", to: E, preset: "" });
      return;
    }
    const a = S ? S.getFullYear() : void 0, y = K(Be, a);
    if (y) {
      let g = q(y, D);
      Ee && g < Ee && (g = Ee), E && g > E && (g = E), A({ from: g, to: E, preset: "" });
      const M = !!(S && S.getFullYear() === y.getFullYear() && g !== E);
      ve(J(g, M, D));
    } else
      ve(J(_, N && !Y, D));
  }, [x, Be, E, S, Ee, _, N, Y, D, A]), Lt = Q(() => {
    if (x) return;
    if (ie(""), !Xe.trim()) {
      A({ from: _, to: "", preset: "" });
      return;
    }
    const a = f ? f.getFullYear() : void 0, y = K(Xe, a);
    if (y) {
      let g = q(y, D);
      _ && g < _ && (g = _), Te && g > Te && (g = Te), A({ from: _, to: g, preset: "" });
      const M = !!(f && f.getFullYear() === y.getFullYear() && _ !== g);
      he(J(g, M, D));
    } else
      he(J(E, N && !Y, D));
  }, [x, Xe, _, f, Te, E, N, Y, D, A]), Wt = Q(() => {
    if (x) return;
    ie("");
    const a = Be.trim();
    if (!a) {
      A({ from: "", to: "", preset: "" });
      return;
    }
    if (a.includes(";") || a.includes(" - ") || a.includes("—") || a.includes("..")) {
      const g = a.split(vn).map((M) => M.trim()).filter(Boolean);
      if (g.length >= 2) {
        const M = K(g[0]), V = K(g[1]);
        if (M && V) {
          let ne = q(M, D), pe = q(V, D);
          Ee && ne < Ee && (ne = Ee), Te && pe > Te && (pe = Te);
          const De = ne <= pe ? ne : pe, fe = ne <= pe ? pe : ne;
          A({ from: De, to: fe, preset: "" }), ve(J(De, !1, D)), he(J(fe, !1, D));
          return;
        }
      }
    }
    const y = K(a);
    if (y) {
      let g = q(y, D);
      Ee && g < Ee && (g = Ee), Te && g > Te && (g = Te), A({ from: g, to: g, preset: "" }), ve(J(g, !1, D)), he(J(g, !1, D));
    } else
      ve(J(_, !1, D)), he(J(E, !1, D));
  }, [x, Be, Ee, Te, _, E, D, A]), xe = B(() => {
    if (!le) return null;
    const a = le.split(ut).map((g) => g.trim()).filter(Boolean);
    if (a.length === 0) return null;
    const y = [];
    for (let g = 0; g < a.length; g++) {
      const M = rt(a[g]);
      if (!M.from && !M.to) continue;
      const V = M.from ? K(M.from) : null, ne = M.to ? K(M.to) : null;
      y.push({
        fromTs: V ? V.getTime() : null,
        toTs: ne ? ne.getTime() : null
      });
    }
    return y.length > 0 ? y : null;
  }, [le]), wt = Q(
    (a, y) => {
      const g = new Date(a, y, 1, 0, 0, 0, 0).getTime(), M = new Date(a, y + 1, 0, 23, 59, 59, 999).getTime();
      return xe && xe.length > 0 ? xe.some(
        (V) => V.fromTs !== null && V.toTs !== null && V.fromTs <= M && V.toTs >= g
      ) : W !== null && ue !== null ? W <= M && ue >= g : !!(z && z.getFullYear() === a && z.getMonth() === y || X && X.getFullYear() === a && X.getMonth() === y);
    },
    [xe, W, ue, z, X]
  ), Nt = Q(
    (a, y) => {
      const g = new Date(a, y, 1, 0, 0, 0, 0).getTime(), M = new Date(a, y + 1, 0, 23, 59, 59, 999).getTime();
      let V = !1, ne = !1, pe = !1;
      if (xe && xe.length > 0)
        for (let De = 0; De < xe.length; De++) {
          const fe = xe[De];
          if (fe.fromTs !== null && fe.toTs !== null) {
            const vt = fe.fromTs >= g && fe.fromTs <= M, gt = fe.toTs >= g && fe.toTs <= M;
            vt && (V = !0), gt && (ne = !0), fe.fromTs <= M && fe.toTs >= g && !vt && !gt && (pe = !0);
          }
        }
      else if (W !== null && ue !== null) {
        const De = W >= g && W <= M, fe = ue >= g && ue <= M;
        De && (V = !0), fe && (ne = !0), W <= M && ue >= g && !De && !fe && (pe = !0);
      } else W !== null && W >= g && W <= M && (V = !0, ne = !0);
      return {
        isStart: V,
        isEnd: ne,
        inRange: pe,
        isSelected: V || ne || pe
      };
    },
    [xe, W, ue]
  ), _t = Q(
    (a) => {
      const y = new Date(a, 0, 1, 0, 0, 0, 0).getTime(), g = new Date(a, 11, 31, 23, 59, 59, 999).getTime();
      return xe && xe.length > 0 ? xe.some(
        (M) => M.fromTs !== null && M.toTs !== null && M.fromTs <= g && M.toTs >= y
      ) : W !== null && ue !== null ? W <= g && ue >= y : !!(z && z.getFullYear() === a || X && X.getFullYear() === a);
    },
    [xe, W, ue, z, X]
  ), Tt = Q(() => {
    Fe((a) => a === null ? a : null);
  }, []), $t = Q(
    (a, y) => {
      const g = a.ts, M = yt(g, de, be);
      let V = !1, ne = !1, pe = !1, De = !1;
      if (xe && xe.length > 0)
        for (let lt = 0; lt < xe.length; lt++) {
          const at = xe[lt];
          at.fromTs !== null && g === at.fromTs && (V = !0), at.toTs !== null && g === at.toTs && (ne = !0), at.fromTs !== null && at.toTs !== null && g >= at.fromTs && g <= at.toTs && (pe = !0);
        }
      else
        V = W !== null && g === W, ne = ue !== null && g === ue, W !== null && ue !== null && g >= W && g <= ue && (pe = !0), F === "end" && W !== null && ue === null && Qe !== null && Qe >= W && g >= W && g <= Qe && (De = !0);
      const fe = a.date.getDay() === 0, vt = a.date.getDay() === 6, gt = V && ne;
      let Ie = "agv-cal-day-cell";
      return a.isWeekend && (Ie += " is-weekend"), a.isCurrentMonth || (Ie += " is-other-month"), M && (Ie += " is-disabled"), gt ? Ie += " is-selected is-range-single" : (V && (Ie += " is-range-start is-selected"), ne && (Ie += " is-range-end is-selected")), pe && !gt && (Ie += " is-in-range", fe && (Ie += " is-week-start"), vt && (Ie += " is-week-end")), De && !V && !ne && (Ie += " is-in-hover"), /* @__PURE__ */ l(
        "button",
        {
          type: "button",
          disabled: M,
          onClick: () => we(a),
          onMouseEnter: () => {
            F === "end" && Fe((lt) => lt === g ? lt : g);
          },
          className: Ie,
          children: a.dayNum
        },
        y
      );
    },
    [
      de,
      be,
      xe,
      W,
      ue,
      F,
      Qe,
      we
    ]
  ), Vt = $e === "auth" ? "is-auth" : Z === "xs" ? "is-xs" : Z === "md" ? "is-md" : "is-sm";
  return /* @__PURE__ */ I("div", { className: `agv-daterange-picker-wrap ${Ne}`, ref: te, children: [
    /* @__PURE__ */ I(
      "div",
      {
        "aria-invalid": Ce || void 0,
        className: `agv-daterange-bar ${Yt()} ${x ? "is-focused" : ""} ${Vt}`,
        onClick: () => x ? G() : ce(),
        children: [
          se ? /* @__PURE__ */ l(
            "span",
            {
              "aria-hidden": "true",
              className: "shrink-0 inline-flex items-center text-[var(--agv-text-muted)] pointer-events-none mr-1",
              children: se
            }
          ) : null,
          le ? /* @__PURE__ */ l("div", { className: "agv-daterange-segment flex w-full items-center justify-center overflow-hidden px-1", children: /* @__PURE__ */ l(
            "span",
            {
              className: "truncate font-normal text-foreground",
              children: je(le)
            }
          ) }) : Y ? /* @__PURE__ */ l("div", { className: "agv-daterange-segment", children: /* @__PURE__ */ l(
            "input",
            {
              id: t,
              type: "text",
              name: "agv_daterange_single",
              ...dt,
              value: Be,
              onClick: (a) => {
                a.stopPropagation(), ce("start");
              },
              onChange: (a) => {
                ve(a.target.value), he(a.target.value);
              },
              onBlur: Wt,
              onKeyDown: (a) => a.key === "Enter" && Wt(),
              placeholder: D ? "DD/MM/YYYY HH:mm" : "DD/MM/YYYY",
              "aria-invalid": Ce || void 0,
              "aria-describedby": Pe,
              "aria-errormessage": Me,
              className: "agv-daterange-text text-center font-normal"
            }
          ) }) : /* @__PURE__ */ I(Ht, { children: [
            /* @__PURE__ */ l("div", { className: "agv-daterange-segment", children: /* @__PURE__ */ l(
              "input",
              {
                id: t,
                type: "text",
                name: "agv_daterange_from",
                ...dt,
                value: Be,
                onClick: (a) => {
                  a.stopPropagation(), ce("start");
                },
                onChange: (a) => ve(a.target.value),
                onBlur: Bt,
                onKeyDown: (a) => a.key === "Enter" && Bt(),
                placeholder: U,
                "aria-invalid": Ce || void 0,
                "aria-describedby": Pe,
                "aria-errormessage": Me,
                className: "agv-daterange-text text-center font-normal"
              }
            ) }),
            /* @__PURE__ */ l("span", { className: "agv-daterange-sep inline-flex items-center justify-center shrink-0", children: /* @__PURE__ */ l(Mt, { size: 10, strokeWidth: 2, className: "opacity-50 select-none pointer-events-none" }) }),
            /* @__PURE__ */ l("div", { className: "agv-daterange-segment", children: /* @__PURE__ */ l(
              "input",
              {
                type: "text",
                name: "agv_daterange_to",
                ...dt,
                value: Xe,
                onClick: (a) => {
                  a.stopPropagation(), ce("end");
                },
                onChange: (a) => he(a.target.value),
                onBlur: Lt,
                onKeyDown: (a) => a.key === "Enter" && Lt(),
                placeholder: j,
                className: "agv-daterange-text text-center font-normal"
              }
            ) })
          ] }),
          ge && (_ || E || le) && /* @__PURE__ */ l(
            "button",
            {
              type: "button",
              onClick: (a) => {
                a.stopPropagation(), ie(""), ke(null), _e(null), Fe(null), ve(""), he(""), H("start"), A({ from: "", to: "", preset: "" });
              },
              className: "agv-datepicker-clear-btn agv-inline-clear-destructive",
              children: "×"
            }
          )
        ]
      }
    ),
    x && Ot(
      /* @__PURE__ */ I(
        "div",
        {
          ref: s,
          style: {
            position: "fixed",
            ...b.isFlipUp ? { bottom: `${b.bottom}px`, top: "auto" } : { top: `${b.top}px`, bottom: "auto" },
            left: `${b.left}px`,
            zIndex: 999999999
          },
          className: `agv-calendar-popover agv-daterange-popover agv-popup-panel ${b.isFlipUp ? "agv-spring-up" : "agv-spring-down"} ${Se ? "is-dual" : ""} ${h ? qt(h) : ""}`,
          "data-theme": h || void 0,
          "data-agv-popup": "true",
          onClick: (a) => a.stopPropagation(),
          onMouseDown: (a) => a.stopPropagation(),
          children: [
            L && /* @__PURE__ */ l("div", { className: "agv-daterange-preset-section mb-2 border-b border-[var(--agv-border)] pb-2", children: /* @__PURE__ */ l(
              Zt,
              {
                value: le,
                min: Le,
                max: Ye,
                dateAnalysis: k,
                label: "Mốc thời gian:",
                theme: h,
                onSelect: (a, y) => {
                  if (ie(a), a) {
                    const g = rt(a), M = K(Le), V = K(Ye);
                    let ne = g.from ? K(g.from) : null, pe = g.to ? K(g.to) : null, De = g.from, fe = g.to;
                    ne && M && ne.getTime() < M.getTime() && (ne = M, De = q(M, !1)), pe && V && pe.getTime() > V.getTime() && (pe = V, fe = q(V, !1)), ke(ne), _e(pe), ve(J(De, !1, D)), he(J(fe, !1, D)), A({
                      from: De,
                      to: fe,
                      preset: a
                    }), ne && (Ve(ne.getFullYear()), et(ne.getMonth())), He("days"), !y && !D && C(!1);
                  } else
                    ke(null), _e(null), ve(""), he(""), A({ from: "", to: "", preset: "" }), !y && !D && C(!1);
                }
              }
            ) }),
            Se && Je === "days" ? /* @__PURE__ */ I("div", { className: "agv-dual-calendars-container", children: [
              /* @__PURE__ */ l("div", { className: "agv-dual-calendar-pane", children: /* @__PURE__ */ l(
                ht,
                {
                  calendarView: Je,
                  setCalendarView: He,
                  navYear: We,
                  setNavYear: Ve,
                  navMonth: Oe,
                  setNavMonth: et,
                  calendarCells: tt,
                  activeDate: z || X,
                  minTs: de,
                  maxTs: be,
                  minYear: Ge,
                  isMonthSelected: wt,
                  getMonthRangeStatus: Nt,
                  isYearSelected: _t,
                  onGridMouseLeave: Tt,
                  renderDayCell: $t,
                  hideNavRight: !0,
                  onPrevMonth: () => {
                    const a = ft(Oe, We, -1);
                    et(a.month), Ve(a.year);
                  }
                }
              ) }),
              /* @__PURE__ */ l("div", { className: "agv-dual-divider" }),
              /* @__PURE__ */ l("div", { className: "agv-dual-calendar-pane", children: /* @__PURE__ */ l(
                ht,
                {
                  calendarView: Je,
                  setCalendarView: He,
                  navYear: it.year,
                  setNavYear: () => {
                  },
                  navMonth: it.month,
                  setNavMonth: () => {
                  },
                  calendarCells: nt,
                  activeDate: z || X,
                  minTs: de,
                  maxTs: be,
                  minYear: Ge,
                  isMonthSelected: wt,
                  getMonthRangeStatus: Nt,
                  isYearSelected: _t,
                  onGridMouseLeave: Tt,
                  renderDayCell: $t,
                  hideNavLeft: !0,
                  onNextMonth: () => {
                    const a = ft(Oe, We, 1);
                    et(a.month), Ve(a.year);
                  }
                }
              ) })
            ] }) : /* @__PURE__ */ l("div", { className: "w-full", children: /* @__PURE__ */ l(
              ht,
              {
                calendarView: Je,
                setCalendarView: He,
                navYear: We,
                setNavYear: Ve,
                navMonth: Oe,
                setNavMonth: et,
                calendarCells: tt,
                activeDate: z || X,
                minTs: de,
                maxTs: be,
                minYear: Ge,
                isMonthSelected: wt,
                getMonthRangeStatus: Nt,
                isYearSelected: _t,
                onGridMouseLeave: Tt,
                renderDayCell: $t
              }
            ) }),
            D && (Se ? (
              /* Dual Month: Giao diện 1 hàng ngang rộng rãi */
              /* @__PURE__ */ I("div", { className: "agv-time-footer", children: [
                /* @__PURE__ */ I("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ l(
                    pt,
                    {
                      label: "Từ",
                      hours: re.h,
                      minutes: re.m,
                      onChangeTime: (a, y) => w({ h: a, m: y })
                    }
                  ),
                  /* @__PURE__ */ l(Mt, { size: 10, strokeWidth: 2, className: "text-[var(--agv-text-subtle)] opacity-50 shrink-0 select-none pointer-events-none mx-0.5" }),
                  /* @__PURE__ */ l(
                    pt,
                    {
                      label: "Đến",
                      hours: P.h,
                      minutes: P.m,
                      onChangeTime: (a, y) => O({ h: a, m: y })
                    }
                  ),
                  /* @__PURE__ */ l(
                    "button",
                    {
                      type: "button",
                      onClick: () => {
                        w({ h: 0, m: 0 }), O({ h: 23, m: 59 });
                      },
                      className: "agv-time-quick-btn ml-1",
                      children: "Cả ngày"
                    }
                  )
                ] }),
                /* @__PURE__ */ l(
                  "button",
                  {
                    type: "button",
                    onClick: zt,
                    className: "agv-apply-btn",
                    children: "Áp dụng"
                  }
                )
              ] })
            ) : (
              /* Single Month: Giao diện 2 tầng chuyên nghiệp, không vỡ chữ */
              /* @__PURE__ */ I("div", { className: "agv-time-footer is-compact-range", children: [
                /* @__PURE__ */ I("div", { className: "agv-time-range-inputs", children: [
                  /* @__PURE__ */ l(
                    pt,
                    {
                      label: "Từ",
                      hours: re.h,
                      minutes: re.m,
                      onChangeTime: (a, y) => w({ h: a, m: y })
                    }
                  ),
                  /* @__PURE__ */ l(Mt, { size: 10, strokeWidth: 2, className: "text-[var(--agv-text-subtle)] opacity-50 shrink-0 select-none pointer-events-none mx-0.5" }),
                  /* @__PURE__ */ l(
                    pt,
                    {
                      label: "Đến",
                      hours: P.h,
                      minutes: P.m,
                      onChangeTime: (a, y) => O({ h: a, m: y })
                    }
                  )
                ] }),
                /* @__PURE__ */ I("div", { className: "agv-time-range-actions", children: [
                  /* @__PURE__ */ I("div", { className: "flex items-center gap-1.5", children: [
                    /* @__PURE__ */ l(
                      "button",
                      {
                        type: "button",
                        onClick: () => {
                          w({ h: 0, m: 0 }), O({ h: 23, m: 59 });
                        },
                        className: "agv-time-quick-btn",
                        children: "Cả ngày"
                      }
                    ),
                    /* @__PURE__ */ l(
                      "button",
                      {
                        type: "button",
                        onClick: () => {
                          const a = /* @__PURE__ */ new Date();
                          w({ h: a.getHours(), m: a.getMinutes() }), O({ h: a.getHours(), m: a.getMinutes() });
                        },
                        className: "agv-time-quick-btn",
                        children: "Hiện tại"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ l(
                    "button",
                    {
                      type: "button",
                      onClick: zt,
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
      te.current?.ownerDocument?.body || document.body
    )
  ] });
}), Yn = mt(function({
  id: t,
  value: u,
  preset: e,
  onChange: r,
  onClose: v,
  min: n = "",
  max: i = "",
  placeholder: d = "DD/MM/YYYY",
  disabled: m = !1,
  className: p = "",
  onDoubleClick: h,
  theme: k = "",
  size: T = "default",
  variant: Z = "default",
  leadingIcon: $e,
  showPreset: se = !1,
  showTime: L = !1,
  autoFocus: Se = !1,
  defaultOpen: D = !1,
  dateAnalysis: me,
  bounds: oe,
  showCalendarIcon: ge = !1,
  allowClear: Ne = !0,
  invalid: Re,
  "aria-invalid": ze,
  "aria-describedby": Pe,
  "aria-errormessage": Me
}) {
  const Ce = !!(Re || ze);
  ye(() => {
    Dt();
  }, []);
  const [Ae, Ue] = ee(u || ""), _ = u !== void 0 ? u : Ae, [E, x] = ee(() => se ? e || (u && (u.startsWith("data_") || ct.test(u.trim())) ? u.trim() : "") : "");
  ye(() => {
    if (!se) {
      x("");
      return;
    }
    e !== void 0 && x(e);
  }, [se, e]);
  const C = Q(
    (c, R) => {
      Ue(c), r?.(c, R);
    },
    [r]
  ), [le, ie] = ee(!1), [A, te] = ee(
    () => E ? je(E) : J(_, !1, L)
  ), s = B(() => _ ? K(_) : null, [_]), [b, ae] = ee(() => ({
    h: s ? s.getHours() : 0,
    m: s ? s.getMinutes() : 0
  })), f = ot(null), S = ot(null), [re, w] = ee({ top: 0, left: 0 });
  ye(() => {
    if (!_ && !E) {
      te("");
      return;
    }
    if (se && _ && (_.startsWith("data_") || ct.test(_.trim()))) {
      const c = ct.test(_.trim()) ? `data_year_${_.trim()}` : _.trim();
      x(c), te(je(c));
      return;
    }
    if (se && E) {
      const c = rt(E);
      if (_ === c.from || _ === E) {
        te(
          c.from && c.to && c.from === c.to ? J(c.from, !1, L) : je(E)
        );
        return;
      }
    }
    te(J(_, !1, L)), s && ae({ h: s.getHours(), m: s.getMinutes() });
  }, [_, E, se, L, s]);
  const P = B(() => {
    if (!E) return null;
    const c = E.split(ut).map(($) => $.trim()).filter(Boolean);
    if (c.length === 0) return null;
    const R = [];
    for (let $ = 0; $ < c.length; $++) {
      const G = rt(c[$]);
      if (!G.from && !G.to) continue;
      const ce = G.from ? K(G.from) : null, de = G.to ? K(G.to) : null;
      R.push({
        fromTs: ce ? ce.getTime() : null,
        toTs: de ? de.getTime() : null
      });
    }
    return R.length > 0 ? R : null;
  }, [E]), O = B(() => P && P.length > 0 && P[0].fromTs !== null ? new Date(P[0].fromTs) : _ ? K(_) : null, [_, P]), Y = B(
    () => O ? new Date(O.getFullYear(), O.getMonth(), O.getDate()).getTime() : null,
    [O]
  ), N = B(() => {
    const c = /* @__PURE__ */ new Date();
    return new Date(c.getFullYear(), c.getMonth(), c.getDate()).getTime();
  }, []), U = B(() => (/* @__PURE__ */ new Date()).getFullYear(), []), j = B(
    () => Rt(void 0, n, me, oe),
    [n, me, oe]
  ), F = B(() => n && n.trim() ? n.trim() : `${j}-01-01`, [n, j]), H = i && i.trim() ? i.trim() : `${U + 1}-12-31`, z = B(() => {
    const c = K(F);
    return c ? q(c, L) : "";
  }, [F, L]), ke = B(() => {
    const c = K(H);
    return c ? q(c, L) : "";
  }, [H, L]), X = B(() => Ke(F, !1), [F]), _e = B(() => Ke(H, !0), [H]), Qe = Q(
    (c) => {
      const R = c || /* @__PURE__ */ new Date(), $ = K(F) || new Date(j, 0, 1), G = K(H) || new Date(U + 1, 11, 31);
      return R.getTime() < $.getTime() ? $ : R.getTime() > G.getTime() ? G : R;
    },
    [F, H, j, U]
  ), [Fe, Be] = ee(() => Qe(O).getFullYear()), [ve, Xe] = ee(() => Qe(O).getMonth()), [he, Je] = ee("days"), He = 264, Ze = (se ? 40 : 0) + 265 + (L ? 40 : 0), Ge = Q(() => {
    const c = kt(
      f.current,
      He,
      Ze
    );
    w(
      (R) => R.top === c.top && R.left === c.left && R.isFlipUp === c.isFlipUp ? R : c
    );
  }, [He, Ze]), Le = Q(() => {
    ie(!1), v?.();
  }, [v]), Ye = Q(() => {
    if (m) return;
    const c = Qe(O);
    Be(c.getFullYear()), Xe(c.getMonth()), Je("days"), w(
      kt(
        f.current,
        He,
        Ze
      )
    );
    const R = !!f.current?.closest(".agv-multi-filter-popup");
    window.dispatchEvent(
      new CustomEvent("agv-close-all-popups", {
        detail: {
          except: R ? "multi-filter" : "datepicker",
          source: "datepicker"
        }
      })
    ), ie(!0);
  }, [m, Qe, O, He, Ze]);
  ye(() => {
    if (Se && f.current) {
      const c = f.current.querySelector("input");
      c?.focus({ preventScroll: !0 }), c?.select();
    }
    D && Ye();
  }, [Se, D, Ye]), Jt(le, Le, Ge, f, S);
  const Ee = B(
    () => Ft(Fe, ve),
    [Fe, ve]
  ), Te = Q(
    (c) => {
      if (yt(c.ts, X, _e)) return;
      x("");
      const R = new Date(c.date);
      R.setHours(b.h, b.m);
      const $ = q(R, L);
      te(J($, !1, L)), C($, { from: $, to: $, preset: "" }), L || (ie(!1), v?.());
    },
    [X, _e, b, L, C, v]
  ), st = Q(() => {
    const c = O || /* @__PURE__ */ new Date(), R = new Date(c.getFullYear(), c.getMonth(), c.getDate(), b.h, b.m), $ = q(R, L);
    te(J($, !1, L)), C($, { from: $, to: $, preset: "" }), ie(!1), v?.();
  }, [O, b, L, C, v]), We = Q(() => {
    if (le) return;
    const c = A.trim();
    if (!c) {
      x(""), C("", { from: "", to: "", preset: "" });
      return;
    }
    if (E && c === je(E))
      return;
    if (se && ct.test(c)) {
      const $ = `data_year_${c}`, G = rt($);
      x($), te(je($)), C(G.from, { from: G.from, to: G.to, preset: $ });
      return;
    }
    x("");
    const R = K(c);
    if (R) {
      let $ = q(R, L);
      const G = $.slice(0, 10), ce = z ? z.slice(0, 10) : "", de = ke ? ke.slice(0, 10) : "";
      ce && G < ce && ($ = z), de && G > de && ($ = ke), C($, { from: $, to: $, preset: "" }), te(J($, !1, L));
    } else
      te(J(_, !1, L));
  }, [le, A, E, se, z, ke, _, L, C]), Ve = Q(
    (c, R) => {
      if (P && P.length > 0) {
        const $ = new Date(c, R, 1, 0, 0, 0, 0).getTime(), G = new Date(c, R + 1, 0, 23, 59, 59, 999).getTime();
        return P.some(
          (ce) => ce.fromTs !== null && ce.toTs !== null && ce.fromTs <= G && ce.toTs >= $
        );
      }
      return !!(O && O.getFullYear() === c && O.getMonth() === R);
    },
    [P, O]
  ), Oe = Q(
    (c) => {
      if (P && P.length > 0) {
        const R = new Date(c, 0, 1, 0, 0, 0, 0).getTime(), $ = new Date(c, 11, 31, 23, 59, 59, 999).getTime();
        return P.some(
          (G) => G.fromTs !== null && G.toTs !== null && G.fromTs <= $ && G.toTs >= R
        );
      }
      return !!(O && O.getFullYear() === c);
    },
    [P, O]
  ), et = Q(
    (c, R) => {
      const $ = c.ts, G = yt($, X, _e), ce = $ === N;
      let de = !1, be = !1, tt = !1, nt = !1;
      if (P && P.length > 0)
        for (let ue = 0; ue < P.length; ue++) {
          const we = P[ue];
          we.fromTs !== null && $ === we.fromTs && (de = !0), we.toTs !== null && $ === we.toTs && (be = !0), we.fromTs !== null && we.toTs !== null && $ >= we.fromTs && $ <= we.toTs && (tt = !0);
        }
      else
        nt = Y !== null && $ === Y;
      let W = "agv-cal-day-cell";
      return c.isWeekend && (W += " is-weekend"), c.isCurrentMonth || (W += " is-other-month"), G && (W += " is-disabled"), de && (W += " is-range-start is-selected"), be && (W += " is-range-end is-selected"), tt && (W += " is-in-range"), nt && (W += " is-selected"), ce && !nt && !de && !be && (W += " is-today"), /* @__PURE__ */ l(
        "button",
        {
          type: "button",
          disabled: G,
          onClick: () => Te(c),
          className: W,
          children: c.dayNum
        },
        R
      );
    },
    [X, _e, N, P, Y, Te]
  ), it = Z === "auth" ? "is-auth" : T === "xs" ? "is-xs" : T === "md" ? "is-md" : "is-sm";
  return /* @__PURE__ */ I("div", { className: `agv-datepicker-container ${p}`, ref: f, children: [
    /* @__PURE__ */ I(
      "div",
      {
        "aria-invalid": Ce || void 0,
        className: `agv-datepicker-input-box ${Yt()} ${le ? "is-focused" : ""} ${it}`,
        children: [
          $e ? /* @__PURE__ */ l(
            "span",
            {
              "aria-hidden": "true",
              className: "shrink-0 inline-flex items-center text-[var(--agv-text-muted)] pointer-events-none mr-1",
              children: $e
            }
          ) : ge ? /* @__PURE__ */ l(ln, { className: "pointer-events-none h-3 w-3 shrink-0 text-[var(--agv-text-subtle)]" }) : null,
          /* @__PURE__ */ l(
            "input",
            {
              id: t,
              type: "text",
              name: "agv_date_picker",
              ...dt,
              disabled: m,
              value: A,
              onChange: (c) => te(c.target.value),
              onBlur: We,
              onKeyDown: (c) => c.key === "Enter" && We(),
              onClick: () => le ? Le() : Ye(),
              onDoubleClick: h,
              placeholder: L ? "DD/MM/YYYY HH:mm" : d,
              "aria-invalid": Ce || void 0,
              "aria-describedby": Pe,
              "aria-errormessage": Me,
              className: "agv-datepicker-text"
            }
          ),
          Ne && (_ || E) && !m && /* @__PURE__ */ l(
            "button",
            {
              type: "button",
              onClick: (c) => {
                c.stopPropagation(), x(""), te(""), C("", { from: "", to: "", preset: "" });
              },
              className: "agv-datepicker-clear-btn agv-inline-clear-destructive",
              children: "×"
            }
          )
        ]
      }
    ),
    le && Ot(
      /* @__PURE__ */ I(
        "div",
        {
          ref: S,
          style: {
            position: "fixed",
            ...re.isFlipUp ? { bottom: `${re.bottom}px`, top: "auto" } : { top: `${re.top}px`, bottom: "auto" },
            left: `${re.left}px`,
            zIndex: 999999999
          },
          className: `agv-calendar-popover agv-popup-panel ${re.isFlipUp ? "agv-spring-up" : "agv-spring-down"} ${se ? "agv-has-preset agv-daterange-popover" : ""} ${k ? qt(k) : ""}`,
          "data-theme": k || void 0,
          "data-agv-popup": "true",
          onClick: (c) => c.stopPropagation(),
          onMouseDown: (c) => c.stopPropagation(),
          children: [
            se && /* @__PURE__ */ l("div", { className: "agv-datepicker-preset-section agv-daterange-preset-section mb-2 border-b border-[var(--agv-border)] pb-2", children: /* @__PURE__ */ l(
              Zt,
              {
                value: E,
                min: F,
                max: H,
                dateAnalysis: me,
                label: "Mốc thời gian:",
                theme: k,
                onSelect: (c, R) => {
                  if (x(c), c) {
                    const $ = rt(c), G = K(F), ce = K(H);
                    let de = $.from, be = $.to, tt = $.from ? K($.from) : null, nt = $.to ? K($.to) : null;
                    tt && G && tt.getTime() < G.getTime() && (de = q(G, !1)), nt && ce && nt.getTime() > ce.getTime() && (be = q(ce, !1));
                    const W = de || be;
                    if (W) {
                      te(
                        !!(de && be) && de === be ? J(W, !1, L) : je(c)
                      ), C(W, {
                        from: de,
                        to: be,
                        preset: c
                      });
                      const we = K(W);
                      we && (Be(we.getFullYear()), Xe(we.getMonth()));
                    }
                    Je("days"), !R && !L && ie(!1);
                  } else
                    te(""), C("", { from: "", to: "", preset: "" }), !R && !L && ie(!1);
                }
              }
            ) }),
            /* @__PURE__ */ l(
              ht,
              {
                calendarView: he,
                setCalendarView: Je,
                navYear: Fe,
                setNavYear: Be,
                navMonth: ve,
                setNavMonth: Xe,
                calendarCells: Ee,
                activeDate: O,
                minTs: X,
                maxTs: _e,
                minYear: j,
                isMonthSelected: Ve,
                isYearSelected: Oe,
                renderDayCell: et
              }
            ),
            L && /* @__PURE__ */ I("div", { className: "agv-time-footer", children: [
              /* @__PURE__ */ I("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ l(
                  pt,
                  {
                    hours: b.h,
                    minutes: b.m,
                    onChangeTime: (c, R) => ae({ h: c, m: R })
                  }
                ),
                /* @__PURE__ */ l(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      const c = /* @__PURE__ */ new Date();
                      ae({ h: c.getHours(), m: c.getMinutes() });
                    },
                    className: "agv-time-quick-btn",
                    children: "Hiện tại"
                  }
                )
              ] }),
              /* @__PURE__ */ l(
                "button",
                {
                  type: "button",
                  onClick: st,
                  className: "agv-apply-btn",
                  children: "Áp dụng"
                }
              )
            ] })
          ]
        }
      ),
      f.current?.ownerDocument?.body || document.body
    )
  ] });
});
export {
  Fn as A,
  Yn as a,
  Zt as b
};
