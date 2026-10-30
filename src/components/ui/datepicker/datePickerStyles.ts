const FALLBACK_STYLE_ID = 'agv-datepicker-core-styles';

function ensureDatePickerStyles() {
  if (typeof document === 'undefined') return;
  let style = document.getElementById(FALLBACK_STYLE_ID) as HTMLStyleElement | null;
  if (style) return;

  style = document.createElement('style');
  style.id = FALLBACK_STYLE_ID;
  if (document.head.firstChild) {
    document.head.insertBefore(style, document.head.firstChild);
  } else {
    document.head.appendChild(style);
  }

  style.textContent = `
    .agv-datepicker-container,
    .agv-daterange-picker-wrap,
    .agv-custom-select-wrap {
      position: relative;
      display: block;
      width: 100%;
      box-sizing: border-box;
      font-family: var(--font-sans, inherit);
    }
    .agv-popup-label {
      display: block;
      font-size: 11px;
      font-weight: 600;
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
      background: var(--agv-bg-popup);
      border: 1px solid var(--agv-border);
      border-radius: 6px;
      color: var(--agv-text-main);
      font-size: 12px;
      transition: border-color 120ms ease;
      cursor: pointer;
      user-select: none;
    }
    .agv-datepicker-input-box.is-xs, .agv-daterange-bar.is-xs { height: 28px; min-height: 28px; font-size: 11px; padding: 0 5px; box-sizing: border-box; }
    .agv-datepicker-input-box.is-sm, .agv-daterange-bar.is-sm, .agv-custom-select-trigger.is-sm { height: 28px; min-height: 28px; font-size: 11.5px; padding: 0 6px; box-sizing: border-box; }
    .agv-datepicker-input-box.is-focused,
    .agv-daterange-bar.is-focused,
    .agv-custom-select-trigger.is-open {
      border-color: var(--agv-accent);
    }
    .agv-datepicker-text,
    .agv-daterange-text {
      width: 100%;
      min-width: 0;
      border: none;
      outline: none;
      background: transparent;
      color: var(--agv-text-main);
      font-size: inherit;
      padding: 2px 0;
    }
    .agv-datepicker-text::placeholder,
    .agv-daterange-text::placeholder {
      color: var(--agv-text-muted);
      opacity: 0.6;
    }
    .agv-filter-datepicker .agv-datepicker-input-box,
    .agv-filter-datepicker .agv-daterange-bar {
      border: none !important;
      background: transparent !important;
      border-radius: 0 !important;
      padding: 0 4px !important;
      box-shadow: none !important;
      min-height: 26px !important;
    }
    .agv-incell-datepicker .agv-datepicker-input-box,
    .agv-incell-datepicker .agv-daterange-bar {
      border: 2px solid var(--agv-accent) !important;
      box-shadow: none !important;
      font-size: 12px !important;
      padding: 0 6px !important;
      min-height: 28px !important;
      max-height: 30px !important;
      height: 100% !important;
      background: var(--agv-bg-root, var(--agv-bg-popup)) !important;
      color: var(--agv-text-main) !important;
      box-sizing: border-box !important;
    }
    .agv-incell-datepicker .agv-datepicker-text,
    .agv-incell-datepicker .agv-daterange-text {
      font-size: 12px !important;
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
      font-size: 11px;
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
      font-size: 13px;
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
      background: var(--agv-bg-popup);
      color: var(--agv-text-main);
      border: 1px solid var(--agv-border);
      border-radius: 6px;
      box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.22), 0 8px 10px -6px rgba(15, 23, 42, 0.12);
      padding: 8px 9px;
      width: 264px;
      max-width: 95vw;
      box-sizing: border-box;
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
      height: 220px;
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
      width: 24px;
      height: 24px;
      border-radius: 6px;
      border: 1px solid transparent;
      background: transparent;
      color: var(--agv-text-main);
      font-size: 15px;
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
      height: 24px;
      border: none;
      background: transparent;
      color: var(--agv-text-main);
      font-weight: 600;
      font-size: 12px;
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
      font-size: 10.5px;
      font-weight: 600;
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
      font-size: 11.5px;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 80ms ease, color 80ms ease;
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
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 100ms ease;
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
      font-size: 10px;
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
      padding: 3px 5px;
      border-radius: 6px;
      font-size: 11.5px;
      color: var(--agv-text-main);
      cursor: pointer;
      transition: background-color 80ms ease;
    }
    .agv-preset-item:hover {
      background: var(--agv-bg-item-hover);
    }
    .agv-preset-item.is-active {
      background: var(--agv-accent);
      color: var(--agv-accent-text);
      font-weight: 600;
    }
    .agv-preset-item-count {
      font-size: 9.5px;
      padding: 1px 4px;
      border-radius: 6px;
      background: var(--agv-bg-subtle);
      color: var(--agv-text-subtle);
    }
    .agv-preset-item.is-active .agv-preset-item-count {
      background: rgba(255, 255, 255, 0.2);
      color: var(--agv-accent-text);
    }
    .agv-preset-expand-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 17px;
      height: 17px;
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
      background: var(--agv-bg-subtle);
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
      font-size: 10.5px;
      font-weight: 600;
      color: var(--agv-text-subtle);
      min-width: 36px;
      padding-top: 2px;
    }
    .agv-preset-chips-list {
      display: flex;
      flex-wrap: wrap;
      gap: 3.5px;
      flex: 1;
    }
    .agv-preset-chip {
      display: inline-flex;
      align-items: center;
      gap: 2.5px;
      padding: 1.5px 5px;
      border-radius: 6px;
      border: 1px solid var(--agv-border);
      background: var(--agv-bg-popup);
      color: var(--agv-text-main);
      font-size: 10.5px;
      cursor: pointer;
      transition: all 80ms ease;
    }
    .agv-preset-chip:hover {
      border-color: var(--agv-accent);
    }
    .agv-preset-chip.is-active {
      background: var(--agv-accent);
      border-color: var(--agv-accent);
      color: var(--agv-accent-text);
      font-weight: 600;
    }
    .agv-preset-chip.is-included {
      background: var(--agv-accent-soft);
      border-color: var(--agv-accent);
      color: var(--agv-accent);
      font-weight: 500;
    }
    .agv-chip-count {
      font-size: 9px;
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
      font-size: 11px;
      font-weight: 500;
      color: var(--agv-text-muted);
    }
    .agv-time-input-wrap {
      display: inline-flex;
      align-items: center;
      background: var(--agv-bg-subtle);
      border: 1px solid var(--agv-border);
      border-radius: 6px;
      padding: 1.5px 4px;
      transition: border-color 120ms ease;
    }
    .agv-time-input-wrap:focus-within {
      border-color: var(--agv-accent);
    }
    .agv-time-num-input {
      width: 18px;
      border: none;
      outline: none;
      background: transparent;
      color: var(--agv-text-main);
      font-size: 11px;
      font-weight: 600;
      text-align: center;
      padding: 0;
    }
    .agv-time-sep {
      color: var(--agv-text-subtle);
      font-weight: 700;
      font-size: 10.5px;
      user-select: none;
      padding: 0 1px;
    }
    .agv-quick-time-btn,
    .agv-time-quick-btn {
      font-size: 10px;
      padding: 2.5px 6px;
      border-radius: 6px;
      border: 1px solid var(--agv-border);
      background: var(--agv-bg-subtle);
      color: var(--agv-text-muted);
      cursor: pointer;
      white-space: nowrap;
      transition: all 100ms ease;
    }
    .agv-quick-time-btn:hover,
    .agv-time-quick-btn:hover {
      border-color: var(--agv-accent);
      color: var(--agv-accent);
    }
    .agv-apply-btn {
      background: var(--agv-accent);
      color: var(--agv-accent-text);
      font-size: 10.5px;
      font-weight: 600;
      padding: 3.5px 11px;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      white-space: nowrap;
      flex-shrink: 0;
      transition: opacity 100ms ease, transform 80ms ease;
    }
    .agv-apply-btn:hover {
      opacity: 0.92;
    }
    .agv-apply-btn:active {
      transform: scale(0.98);
    }
  `;
}
export { ensureDatePickerStyles };
