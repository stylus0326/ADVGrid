const FALLBACK_STYLE_ID = 'agv-datepicker-core-styles';

function ensureDatePickerStyles() {
  if (typeof document === 'undefined') return;
  const cssText = `
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

  let style = document.getElementById(FALLBACK_STYLE_ID) as HTMLStyleElement | null;
  if (!style) {
    style = document.createElement('style');
    style.id = FALLBACK_STYLE_ID;
    if (document.head.firstChild) {
      document.head.insertBefore(style, document.head.firstChild);
    } else {
      document.head.appendChild(style);
    }
  }
  if (style.textContent !== cssText) {
    style.textContent = cssText;
  }
}

if (typeof document !== 'undefined') {
  ensureDatePickerStyles();
}
export { ensureDatePickerStyles };
