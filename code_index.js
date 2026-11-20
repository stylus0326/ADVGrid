/**
 * ==============================================================================
 * TỪ ĐIỂN CODEBASE & SỔ TAY CHẨN ĐOÁN LỖI (CODEBASE DICTIONARY & ERROR MAP)
 * ==============================================================================
 * Dự án: Gridv3 - High-Performance Virtualized Chunk Grid Engine (50,000 Rows)
 * 
 * File này đóng vai trò là "BỘ TỪ ĐIỂN KỸ THUẬT & TRUY VẾT LỖI" toàn diện cho toàn bộ codebase:
 * 1. Từ điển Chẩn đoán Lỗi (Error Diagnostic Dictionary): Gặp lỗi -> Tra cứu ngay nguyên nhân, file, dòng & cách sửa.
 * 2. Từ điển Thuật ngữ & Cơ chế (Architecture Glossary): Bản chất của Chunk Virtualization = 20, Ghim cột, Morphicons, Theme Tokens.
 * 3. Từ điển Hàm, Component & State (Functions & Controls): Vị trí chính xác từng dòng của các hàm/control cốt lõi.
 * 4. Từ điển Biến CSS & Z-Index (CSS Tokens & Stacking): Hệ thống Theme Tokens và phân cấp z-index tránh che khuất.
 * 5. Mục lục phân đoạn dòng (Line Range Directory): Bản đồ chi tiết từng khối code theo file.
 * 
 * ------------------------------------------------------------------------------
 * CÁCH SỬ DỤNG TRONG TERMINAL:
 * ------------------------------------------------------------------------------
 * 1. Tra cứu từ khóa bất kỳ (hàm, control, biến, thuật ngữ):
 *    node code_index.js <từ khóa>
 *    Ví dụ: node code_index.js MorphCheckbox
 *           node code_index.js "ghim cột"
 *           node code_index.js VirtualizedGrid
 * 
 * 2. Chẩn đoán khi gặp lỗi cụ thể:
 *    node code_index.js --error <mô tả lỗi hoặc triệu chứng>
 *    Ví dụ: node code_index.js --error "ô vuông tĩnh"
 *           node code_index.js --error "cuộn giật"
 *           node code_index.js --error "lệch cột ghim"
 * 
 * 3. Liệt kê toàn bộ danh mục mã lỗi và cẩm nang xử lý:
 *    node code_index.js --list-errors
 * 
 * 4. Tra cứu vị trí một dòng cụ thể thuộc phân đoạn / tính năng nào:
 *    node code_index.js --line VirtualizedGrid.tsx 250
 * 
 * 5. In toàn bộ mục lục phân đoạn dòng:
 *    node code_index.js --all
 * 
 * ------------------------------------------------------------------------------
 * CÁCH IMPORT VÀO MÃ NGUỒN:
 * ------------------------------------------------------------------------------
 * import CODE_DICTIONARY, {
 *   searchDictionary,
 *   diagnoseError,
 *   findByLine,
 *   listAllErrors
 * } from './code_index.js';
 */

export const CODE_DICTIONARY = {
  metadata: {
    projectName: 'Gridv3 High-Performance Virtualized Chunk Grid',
    version: '3.0.0-modular',
    lastUpdated: '2026-11-17',
    filesSummary: {
      'vite.config.ts': { lines: 19, role: 'Cấu hình Vite dev/preview server & proxy /be-crm -> BE_CRM_TARGET (mặc định https://agency-sandbox.phuongnamtravel.com), hỗ trợ rewrite đường dẫn, changeOrigin và cookieDomainRewrite' },
      'src/styles/design-tokens.css': { lines: 581, role: 'Single Source of Truth bộ token màu, typography (Roboto đồng bộ kể cả --font-mono), nền đặc popup (--popup-background: var(--popover)), safe area, spacing & control tokens Light (:root), Dark (.dark) và Liquid Glass Ngày (.agv-liquid:not(.dark)) / Đêm (.dark.agv-liquid) đồng bộ từ D:\\Dự án\\b2b-pnt kèm ánh xạ động --agv-*, --table-header (0.96), --agv-row-sticky-surface (0.97), --liquid-specular-top/left & --liquid-sheet/demo-card-shadow' },
      'src/App.tsx': { lines: 360, role: 'B2B-PNT Read-Only Application Shell (Lazy-Loaded Pages + LoginPanel): tách hoàn toàn khỏi barrel `./components/grid`, nạp lười `LoginPanel` & 5 trang con qua `React.lazy`, hỗ trợ hash query `#/airports?grid=...&mode=...`, quản lý `isDark` + `isLiquid` (class `.dark`, `.agv-liquid`, `<LiquidGlassBackdrop />`, nút `Liquid Glass` cạnh `Sáng / Tối`)' },
      'src/services/b2bAuth.ts': { lines: 312, role: 'B2B-PNT Auth & Session Client tách khỏi `b2bApi.ts`: quản lý sessionStorage (`agv_b2b_session_v1`), token memory, `apiCall` single-flight RefreshToken khi 401, `loginAccount`, `verifyTwoFaCode`, `logoutAccount`' },
      'src/services/b2bApi.ts': { lines: 910, role: 'B2B-PNT BE-CRM Catalog & Booking Endpoints: tái sử dụng `apiCall` từ `./b2bAuth`, chuẩn hóa phân trang (`normalizePaged`), xuất `fetchCountriesPage`, `fetchAirportsPage`, `fetchAllAirports`, `fetchPartnersPage`, `fetchBookingsPage` (không kéo Auth login logic vào chunk trang)' },
      'src/components/b2b/LoginPanel.tsx': { lines: 193, role: 'Màn hình đăng nhập BE-CRM (Password + xác thực 2FA 6 số): tuân thủ PNT B2B design tokens (.agv-login-card, bg-card, border-control, bg-control-surface, CTA bg-primary h-9), NO_AUTOFILL_PROPS, không tooltip' },
      'src/components/shared/LiquidGlassBackdrop.tsx': { lines: 391, role: 'SVG nền tầng bình lưu, biển mây Stratocumulus & tàu bay Quad-Jet 747-8 cho chế độ Liquid Glass Ngày/Đêm, responsive theo viewport (<768px, 768-1023px, >=1024px)' },
      'src/components/shared/PageShell.tsx': { lines: 29, role: 'Shell bố cục chuẩn trang PNT B2B (min-h-screen relative z-10 bg-background text-foreground, header tiêu đề + container responsive)' },
      'src/components/shared/ListPagePanel.tsx': { lines: 27, role: 'Panel nội dung chính chuẩn b2b-pnt (.agv-list-page-panel border-y bg-card text-card-foreground sm:rounded-xl sm:border sm:shadow-sm, hỗ trợ fillHeight)' },
      'src/components/shared/StatusBadge.tsx': { lines: 45, role: 'Badge trạng thái semantic (success | danger | muted | warning | info | brand) dùng class semantic tokens PNT Light/Dark' },
      'src/components/shared/StatusTabs.tsx': { lines: 65, role: 'Thanh tab lọc trạng thái với gạch chân Gold active (border-b-2 border-brand-gold text-brand-gold-on-light)' },
      'src/components/ui/controlFocus.ts': { lines: 236, role: 'SSOT class & size helpers chuẩn hóa toàn bộ controls và nút 4 biến thể (`getButtonClass`/`buttonVariants`, `getControlSurfaceClasses` hỗ trợ `ControlVariant: default | auth` 48px, `ControlSize: sm | md`, `CONTROL_BUTTON_*`, `CONTROL_SURFACE_CLASS`, `CONTROL_BOX_CLASS`, `BUTTON_FOCUS_VISIBLE_CLASS="agv-focus-ring"`)' },
      'src/components/ui/AdvButton.tsx': { lines: 52, role: 'Component `<AdvButton>` (`Button` alias) nguồn đơn 4 biến thể (`default`, `outline`, `ghost`, `destructive`), `size` (`sm`, `default`, `md`, `icon-sm`, `icon`), `active` state (`data-active="true"`)' },
      'src/components/ui/AdvInput.tsx': { lines: 98, role: 'Ô nhập liệu `.agv-control` hỗ trợ `size="sm" | "md"`, `variant="default" | "auth"` (48px), `leadingIcon`, `endAdornment`, `invalid`, mặc định chặn autofill (`allowAutofill = false`)' },
      'src/components/ui/AdvFormField.tsx': { lines: 189, role: 'Wrapper nhãn trường nhập (`AdvFormField`, `FormField`, `AdvFormFieldOverlayScope`) hỗ trợ `labelPosition="border" | "top"`, đo bề rộng nhãn qua `ResizeObserver` (`--agv-notch-w`, `data-notch-ready="true"`) + `.agv-field-notch-frame` cắt viền trên thật trong suốt trên Liquid Glass' },
      'src/pages/usePagedListQuery.ts': { lines: 190, role: 'Shared React hook quản lý phân trang server-side kèm LRU Page Cache 0ms (`page=1`, `pageSize=20`, `serverTotal`, `loading`, `error`, `refresh`, `apiLoadMs`, `renderStartRef`) cho các trang danh mục B2B-PNT' },
      'src/pages/gridPageTelemetry.tsx': { lines: 168, role: 'Module đo lường hiệu năng runtime dùng chung cho các trang Grid (`captureRuntimeTelemetry`, `countGridDomNodes`, `useGridStageTelemetry`, `<GridTelemetryLine />`)' },
      'src/pages/CountriesPage.tsx': { lines: 357, role: 'Trang tra cứu Quốc gia: GeographyDDL + bộ lọc h-9 + dòng `Đo thực tế` (`GridTelemetryLine`) + cột qua `createColumnHelper<CountryRow>()` & `defaultColDef` + `<DataGrid gridId="b2b_countries" modules={[...StandardGridModules, QueryBuilderModule, ColumnChooserModule]} data={...} getRowId={...} pagination={...} />`' },
      'src/pages/AirportsPage.tsx': { lines: 603, role: 'Trang tra cứu Sân bay trên 2.771 dòng (`fetchAllAirports`): dùng `<DataGrid modules={BasicViewModules} />` (`mode=all|paged`), bộ lọc BE-CRM và thanh `Đo thực tế` dùng `useGridStageTelemetry` + `<GridTelemetryLine />`' },
      'src/pages/PartnersPage.tsx': { lines: 409, role: 'Trang tra cứu Đại lý: StatusTabs Gold, bộ lọc h-9 + cột qua `createColumnHelper<PartnerListItem>()` & `defaultColDef` + `<DataGrid gridId="b2b_partners" modules={StandardGridModules} data={...} getRowId={...} pagination={...} />`' },
      'src/pages/BookingsPage.tsx': { lines: 605, role: 'Trang tra cứu Đặt chỗ B2B: 7 tab StatusTabs, AdvDateRangePicker size="md", cột qua `createColumnHelper<BookingListItem>()` (`valueGetter`) & `defaultColDef` + `<DataGrid gridId="b2b_bookings" modules={StandardGridModules} data={...} getRowId={...} pagination={...} />`' },
      'src/pages/UiPrimitivesPage.tsx': { lines: 981, role: 'Trang `Thử nghiệm UI` (mở xem không cần đăng nhập B2B): kiểm thử toàn bộ UI controls (`AdvPopover` + `AdvSelect`, `AdvHoverCard`, `AdvTooltip`, `AdvFormField` + `AdvInput` / `AdvComboBoxEdit` / `AdvSearchLookUpEdit` chọn đơn/đa cell & row / `AdvDatePicker` / `AdvDateRangePicker` biến thể `Auth 48px` / `Chuẩn 36px` & `GridTableV2FeaturesDemo`) theo theme Light/Dark/Liquid Glass' },
      'src/components/grid/modules/index.ts': { lines: 156, role: 'Module hóa kiểu AG Grid React: 19 hằng số `GridModule` (tách riêng `ColumnPinningModule` Trái/Phải, `CenterDockModule` Giữa, `RowPinningModule` ghim dòng, `ResponsiveLayoutModule` PC/Tablet/Phone), 3 preset (`BasicViewModules`, `StandardGridModules`, `AllEnterpriseModules`), `toModuleIdSet`, `hasGridModule`' },
      'src/components/grid/columns/columnTypes.ts': { lines: 136, role: 'Kiểu Column API hợp nhất AG Grid + TanStack Table v8: `ColumnHelperAccessorColumn`, `ColumnHelperGroupColumn`, `AnyGridColumnInput`, `DefaultColDef`, `PaginationConfig` (`total`/`serverTotal`), `GridColumnInput`' },
      'src/components/grid/columns/createColumnHelper.ts': { lines: 49, role: 'Helper tạo định nghĩa cột typed kiểu TanStack v8: `createColumnHelper<TData>()` với `.accessor(...)`, `.display(...)`, `.group(...)`' },
      'src/components/grid/columns/normalizeColumns.ts': { lines: 241, role: 'Bộ chuyển đổi `normalizeGridColumns(columns, columnDefs, defaultColDef, features)` biến `ColumnHelper*` / `GridColumnInput` / `ColumnDef` lồng `columns` sang phẳng + `BaseGroupDef[]`, tự sinh `renderHeader`, `valueGetter`, `renderCell`, `hideable`, `groupable`, `enableGlobalFilter` và tách riêng gate ghim Trái/Phải vs Giữa' },
      'src/components/grid/columns/index.ts': { lines: 3, role: 'Barrel export `createColumnHelper`, `normalizeGridColumns` và toàn bộ types cột từ `./columns/*`' },
      'src/components/grid/gridStorage.ts': { lines: 67, role: 'Bộ helper localStorage an toàn SSR (check typeof window !== "undefined") & sinh storage key cô lập theo `gridId` cho đa instance (`getDataGridConfigStorageKey`, `getQueryPresetsStorageKey`, `getFloatingToolbarTopKey`)' },
      'src/components/grid/gridFeatures.ts': { lines: 340, role: 'Single source of truth quản lý Module & Feature Flags (`GRID_VARIANTS`, `GridFeatureProps`, `ResolvedGridFeatures`, `resolveGridFeatures`): ưu tiên `modules?: readonly GridModule[]` (fallback `BasicViewModules`), tách biệt `enableColumnPinning`, `enableCenterDock`, `enableRowPinning`, `enableCellEditing`, `enableResponsiveLayout` và biến thể `variant="full" | "basic"`' },
      'src/components/grid/multiSortUtils.ts': { lines: 215, role: 'Động cơ sắp xếp phân cấp nhiều cột: `normalizeSortRules`, `toggleColumnSortRules` (nhấn thường / `Shift+Click`), `reorderSortRules` (đổi thứ tự ưu tiên) và `sortRowIndicesMulti` (thuật toán Lazy Tie-Breaker tối ưu O(N) chỉ tính tầng sau khi các tầng trước bằng nhau)' },
      'src/components/grid/popupLockUtils.ts': { lines: 117, role: 'Pure utilities khóa cuộn & tương tác Grid khi mở Popup: `resolveEventTargetElement`, `isTargetInsidePopupSelector`, `isScrollableOverflowValue`, `canElementScrollOnAxis` (ngưỡng subpixel DPI 0.5/0.2), `canWheelScrollInsidePopup` (hỗ trợ Text node & chống scroll-chaining), `shouldBlockGridInteractionWhenPopupOpen`' },
      'src/components/grid/AdvMultiSortPopup.tsx': { lines: 647, role: 'Popup Portal Sắp xếp phân cấp đa cột gắn neo theo nút trên Floating Toolbar (áp dụng tức thì, không nút Áp dụng): kéo thả mượt theo pointer drag + translateY (`AdvColumnChooserModal`) + FLIP settle chống giật khung, AdvSelect chọn cột, nút icon toggle MorphSortIcon + `BUTTON_FOCUS_VISIBLE_CLASS`, footer 1 hàng Thêm cột/Xóa hết (`CONTROL_BUTTON_OUTLINE_SM_CLASS`), wrapper `pointer-events-none z-[1250]` + click outside (ngoại trừ `.agv-float-toolbar-btn`) & scroll lock' },
      'src/components/grid/DataGrid.tsx': { lines: 2689, role: 'Core Library Component (`<DataGrid<TRecord> />` & `useDataGridController`): gỡ static `gridUtils` & `MorphCheckbox`, dùng fast-path `gridSimpleFilter` + dynamic `gridFilterEngine`/`gridGroupingEngine`, uncloned `getRow`, cache `getRowKeyAt`, `GridSelectionCheckbox` & truyền `_resolvedFeatures`' },
      'src/components/grid/GridStatusBar.tsx': { lines: 184, role: 'Thanh phân trang đáy tích hợp core Grid (`statusBar` prop): tái sử dụng `AdvSelect` (`20 / 50 / 100 / 200`), nút `<` / `>` (`AdvButton` ghost), ô nhập số trang (`CONTROL_INPUT_SM_CLASS` + `NO_AUTOFILL_PROPS`), `/ {totalPages}` và khoảng dòng `start-end / totalItems`, toàn bộ controls min-h 28px' },
      'src/components/grid/gridCore.css': { lines: 253, role: 'CSS lõi cho `DataGrid` / `VirtualizedGrid` (`.agv-grid-root`, `.agv-cell-*`, `[data-agv-editing="true"]`, scrollbar overlay, `[data-agv-popup="true"]` overscroll, `--agv-row-sticky-bg` ưu tiên `--agv-row-sticky-surface` cho cột ghim trên Liquid Glass, `@keyframes agv-row-enter`, `.agv-group-row`, `.agv-grid-row`, cross-hover & cell span)' },
      'src/components/grid/floatingToolbar.css': { lines: 409, role: 'CSS tách riêng cho `GridFloatingToolbar` & popup flyout (kèm `:focus-visible` `var(--ring)` trên `.agv-float-toolbar-btn` & `:focus-within` `inset 1px var(--brand)` trên `.agv-float-search-flyout`), chỉ tải khi chunk toolbar mount' },
      'src/components/grid/phoneCard.css': { lines: 48, role: 'CSS tách riêng cho `.agv-phone-card`, chỉ tải cùng `ResponsiveChunkRow`' },
      'src/components/grid/filterRow.css': { lines: 24, role: 'CSS tách riêng cho `GridFilterRow` (đã gỡ outset box-shadow xung đột SSOT, giữ highlight `.agv-filter-op-btn` theo `var(--brand)`)' },
      'src/components/grid/floating/columnChooser.css': { lines: 34, role: 'CSS tách riêng cho `AdvColumnChooserModal`' },
      'src/components/grid/floating/queryBuilder.css': { lines: 7, role: 'CSS tách riêng cho `AdvGridQueryBuilderModal`' },
      'src/components/grid/grid.css': { lines: 121, role: 'Stylesheet riêng cho `DataGrid`/`VirtualizedGrid`: `@import "./gridCore.css"`, backdrop fullscreen, spring left/right/zoom & column resize (đã tách CSS lõi/toolbar/responsive/modal ra file riêng)' },
      'tailwind.config.js': { lines: 176, role: 'Cấu hình Tailwind CSS đồng bộ b2b-pnt: `darkMode: "class"`, helper `withVar`/`withCssExpr` (`color-mix` hỗ trợ opacity modifiers), đầy đủ thang màu PNT (`brand`, `primary`, `control`, `surface`, `status`, `table-header`, `--agv-*`), typography, spacing, borderRadius & zIndex' },
      'src/components/grid/VirtualizedGrid.tsx': { lines: 2760, role: 'Core Virtualized Grid Engine: tiếp nhận `_resolvedFeatures`, tách `useGridColumnLayout` & `useGridPopupLock`, bỏ `viewportWidth` thừa, lazy `AdvChecklistFilterPopup`/`GridGroupHeaderRow`/`gridGroupingEngine`/`gridFilterEngine`/`GridResponsiveHeader`, `virtualScrollTopRef` an toàn cho `isWindowScroll`, đo 1-pass `useLayoutEffect`, CHUNK = 20, gắn `data-agv-filter-row`, `data-agv-pinned-rows`, `data-agv-sticky-group` cho nền kính mờ Liquid Glass chống thấu chữ' },
      'src/components/grid/hooks/useGridColumnLayout.ts': { lines: 660, role: 'Custom Hook tách từ `VirtualizedGrid`: quản lý độ rộng/ghim/ẩn cột, `GridMiddleElement`, bỏ qua đo `columnNaturalPositions` & `ResizeObserver` khi không có cột center-pinned' },
      'src/components/grid/hooks/useGridPopupLock.ts': { lines: 200, role: 'Custom Hook tách từ `VirtualizedGrid`: `isAnyPopupActive` zero-alloc qua `document.body.children`, khóa cuộn `wheel`/`touchmove` & chặn tương tác khi popup mở' },
      'src/components/grid/GridSelectionCheckbox.tsx': { lines: 23, role: 'Wrapper chọn dòng nhẹ dùng cho `DataGrid` và `GridFilterRow` mà không kéo static `MorphCheckbox` vào bundle chính' },
      'src/components/grid/GridGroupHeaderRow.tsx': { lines: 267, role: 'Component dòng tiêu đề nhóm (`React.lazy` tách khỏi `GridRow`)' },
      'src/components/grid/gridGroupingEngine.ts': { lines: 191, role: 'Động cơ gom nhóm dòng (`buildGroupedDisplayModel`, `copyGroupTableToClipboard`, `computeStickyGroupIndexAtTop`) tách lazy khỏi `DataGrid`/`VirtualizedGrid`' },
      'src/components/grid/colRenderMeta.ts': { lines: 186, role: 'Tạo sẵn metadata cột (`buildColRenderMetas`) chuẩn hóa sticky/align/divider dùng chung giữa `GridChunkBlock` và `GridRow`' },
      'src/components/grid/GridFloatingToolbar.tsx': { lines: 667, role: 'Thanh công cụ nổi cạnh trái (`floatingToolbar.css`): lazy-load `AdvQuickFilterFlyout`, `AdvMultiSortPopup`, `AdvGridQueryBuilderModal`, `AdvColumnChooserModal` (kèm hover preload trên nút mở), cô lập Y theo `gridId`, `onActivePopupChange`, Ctrl+F / Alt+Shift+F' },
      'src/components/grid/floating/AdvQuickFilterFlyout.tsx': { lines: 111, role: 'Popup 1: Tìm kiếm nhanh flyout sang trái, Smart mode toggle, debounce 250ms, autoFocus, Esc đóng, chuẩn hóa luxury shadow theo phong cách nút lọc STT, đã gỡ sạch title tooltip, tích hợp NO_AUTOFILL_PROPS' },
      'src/components/grid/floating/AdvGridQueryBuilderModal.tsx': { lines: 1541, role: 'Popup 2: Bộ lọc nâng cao cây điều kiện lồng nhau VÀ/HOẶC (`./queryBuilder.css`): lưu preset cô lập theo `gridId` qua `gridStorage.ts`, chuẩn hóa SSOT `CONTROL_BOX_CLASS`, `CONTROL_INPUT_SM_CLASS`, `CONTROL_BUTTON_OUTLINE_SM_CLASS`, `CONTROL_BUTTON_PRIMARY_SM_CLASS`, `BUTTON_FOCUS_VISIBLE_CLASS`, `QueryCustomSelect`, `NO_AUTOFILL_PROPS`, React.lazy' },
      'src/components/grid/floating/AdvColumnChooserModal.tsx': { lines: 1093, role: 'Popup 3: Tùy chọn cột tinh gọn (`./columnChooser.css`): tuân thủ `enableColumnHide`, `onColumnPinChange`, `onReorderColumns`, SSOT `CONTROL_INPUT_SM_CLASS` & `CONTROL_BUTTON_OUTLINE_SM_CLASS`, React.lazy, bo góc rounded-md (6px), kéo thả translateY mượt mà' },
      'src/components/grid/AdvCheckbox.tsx': { lines: 54, role: 'Hệ thống Checkbox chuẩn AdvCheckbox: bọc MorphCheckbox hiệu ứng Morph Line 3 trạng thái (unchecked / checked / indeterminate), 100% theme CSS variables, zero tooltip' },
      'src/components/grid/floating/queryRuleCheck.ts': { lines: 45, role: 'Helpers siêu nhẹ (`isRuleActive`, `hasActiveQueryRules`, `countActiveQueryRules`) tách khỏi `queryUtils.ts` để `DataGrid`/`VirtualizedGrid`/`GridFilterRow` kiểm tra rule active mà không kéo `queryUtils` & parser vào cold bundle' },
      'src/components/grid/floating/queryUtils.ts': { lines: 630, role: 'Hàm lượng giá và xử lý chuỗi CMD Query Tree (nạp lười qua dynamic `import()`): chuẩn hóa QUERY_COMBINATORS, FILTER_OPS, DATA_TYPES, `evaluateQueryTreeNode`, `parseCmdToQueryTree`, `validateQueryTreeAgainstColumns`' },
      'src/components/grid/GridHeader.tsx': { lines: 642, role: 'Header component 1/2 tầng: lazy-load `LazyHeaderSortMorphIcon` & `LazyHeaderBandToggleMorphIcon` từ `./GridMorphPrimitives` (preload khi rê chuột lên cột sortable), hỗ trợ Drag & Drop, ghim cột, `useGridColumnLayout` & context menu' },
      'src/components/grid/GridDateFilterCell.tsx': { lines: 93, role: 'Ô lọc ngày (`AdvDatePicker`) tách khỏi `GridFilterRow` để nạp lười qua `React.lazy`, giúp trang chỉ có cột text/số không kéo `AdvDatePicker` (74 kB) vào bundle bảng' },
      'src/components/grid/GridTimeFilterInputs.tsx': { lines: 170, role: 'Ô lọc giờ `TimeFilterInput` & dải giờ `TimeRangeFilterInput` tách lazy qua `React.lazy` khỏi `GridFilterRow` (`h-full`, bỏ `minHeight: 28px` nội bộ)' },
      'src/components/grid/GridSmartNumberInputs.tsx': { lines: 265, role: 'Ô lọc số thông minh `SmartNumberFilterInput` & dải số `NumberRangeFilterInput` tách lazy qua `React.lazy` khỏi `GridFilterRow` (`h-full`, bỏ `minHeight: 28px` nội bộ)' },
      'src/components/grid/GridMorphPrimitives.tsx': { lines: 42, role: 'Cầu nối các biểu tượng `morphicons` (`HeaderSortMorphIcon`, `HeaderBandToggleMorphIcon`, `RowGroupChevronMorphIcon`) tách riêng để `GridHeader` & `GridRow` lazy-load khi tương tác' },
      'src/components/grid/GridFilterRow.tsx': { lines: 874, role: 'Inline Filter Row component (`./filterRow.css`, `data-agv-filter-row="true"`): lazy-load `GridDateFilterCell`, `GridTimeFilterInputs`, `GridSmartNumberInputs`, `AdvMultiFilterPopup`, `AdvCriteriaSummaryPopup`, dùng `CONTROL_BOX_CLASS`, `GridSelectionCheckbox` & Portal operator menu' },
      'src/components/grid/AdvCriteriaSummaryPopup.tsx': { lines: 627, role: 'Popup tập hợp tiêu chí tinh gọn: hiển thị Segmented Chip cho 8 nhóm tiêu chí (gồm nhiều quy tắc sắp xếp `sortRules` và `pinnedRows`), xóa từng quy tắc sắp xếp riêng lẻ hoặc xóa tất cả, agv-spring-up/down, Lucide Icon X, zero tooltip, min-height 28px' },
      'src/components/grid/AdvMultiFilterPopup.tsx': { lines: 938, role: 'Popup lọc nhiều điều kiện OR / AND (IN / NOT IN clause) khi chuột phải vào ô filter trên GridFilterRow hoặc bấm nút SVG trên QueryBuilder: chuẩn hóa 100% SSOT (`CONTROL_BUTTON_OUTLINE_SM_CLASS`, `CONTROL_BUTTON_PRIMARY_SM_CLASS`, `BUTTON_FOCUS_VISIBLE_CLASS`, `.agv-control`), `SURFACE_THEMES`, `NO_AUTOFILL_PROPS`, Lucide Icons, MorphChevronIcon & `AdvOverlayScroll`' },
      'src/components/grid/FilterIcons.tsx': { lines: 383, role: '15 DevExtreme SVG filter operation vector icons (`stroke=currentColor`), `FILTER_OP_META`, `ALLOWED_OPS_BY_TYPE`, `getAllowedFilterOpsForColumn` (tái sử dụng predicate từ `./gridFormatUtils`, cắt đứt leak sang `AdvDatePicker`)' },
      'src/components/grid/editors/GridInCellEditor.tsx': { lines: 495, role: 'Chunk lazy In-Cell Editor tách riêng khỏi GridRow (`CellEditor`, `DateCellEditor`, `DateRangeCellEditor`, `TimeCellEditor`, `GridInCellEditor`): áp dụng `CONTROL_SURFACE_CLASS`/`CONTROL_BOX_CLASS` + `.agv-incell-control` (`1px` border + `1px` inset ring `--brand`, vừa ô 30px)' },
      'src/components/grid/GridRow.tsx': { lines: 405, role: 'Fast row renderer dùng `ColRenderMeta`, row-level event delegation, tải lười `LazyGridGroupHeaderRow` & `LazyGridInCellEditor`, sticky cells, `col.valueGetter`, hỗ trợ `dynamicRowHeight`' },
      'src/components/ui/AdvDatePicker.tsx': { lines: 752, role: 'Single DatePicker component & Barrel entry point cho bộ DatePicker suite: phân rã 5 sub-modules, size="md" (36px) / sm (28px), hỗ trợ `variant="default" | "auth"` (48px), `leadingIcon`, `invalid`, PNT Light/Dark/Liquid Glass tokens, NO_AUTOFILL_PROPS' },
      'src/components/ui/datepicker/datePickerUtils.ts': { lines: 1014, role: 'Module toán học ngày tháng, regex (kèm REGEX_DATA_WEEK), format/parse (formatGridDateValue, parseDMYToDate, getISOWeekAndYear, getISOWeekDateRange, computePresetDateRange, normalizePresetList, getPresetLabel cho cả data_week_), buildCalendarCells, usePopupDismiss (bỏ qua scroll nội bộ popupRef), computeCalendarCoords và computeDropdownMenuCoords, chuẩn hóa SURFACE_THEMES' },
      'src/components/ui/datepicker/AdvCalendarPrimitives.tsx': { lines: 417, role: 'Module chứa các UI Primitives dùng chung cho lịch: TimePickerBlock (chọn giờ:phút HH:mm) và AdvDevExpressCalendarBody (ma trận lịch Ngày/Tháng/Năm phong cách DevExpress), spacer w-[28px] cân xứng nút nav 28px, cỡ chữ 12px đồng nhất' },
      'src/components/ui/datepicker/AdvDatePresetSelect.tsx': { lines: 764, role: 'Module chọn mốc thời gian nhanh (AdvDatePresetSelect): chuẩn hóa SURFACE_THEMES, size="md" vs sm/xs, Tuần đến hiện tại (chip số giảm dần về 1), Mốc theo năm, cỡ chữ 12px đồng nhất' },
      'src/components/ui/datepicker/AdvDateRangePicker.tsx': { lines: 1105, role: 'Module chọn khoảng ngày kép (AdvDateRangePicker): chuẩn hóa SURFACE_THEMES, size="md" (36px) / sm (28px), hỗ trợ `variant="default" | "auth"` (48px), `leadingIcon`, `invalid`, lịch đôi dualMonth, đảo chiều ngày thông minh, chọn giờ và mốc nhanh' },
      'src/components/ui/datepicker/datePickerStyles.ts': { lines: 804, role: 'Module quản lý CSS động cho DatePicker: đồng bộ tokens PNT B2B (`--control-border`, `--control-background`, `--brand`, `--surface-selected`, `--popover`), `.is-md`, `.is-auth` (`height: 48px`, `border-radius: var(--control-radius)`), `[aria-invalid="true"]` & `.agv-liquid` blur bề mặt' },
      'docs/BACKEND_ARCHITECTURE_100K_USERS.md': { lines: 424, role: 'Tài liệu thiết kế kiến trúc hệ thống 100k người dùng: Cụm NestJS + Podman, BullMQ Worker xuất Excel ngầm, PostgreSQL 16 + PgBouncer, Managed Redis 1GB, Cloudflare R2 Storage (Zero Egress Fee), Frontend TAURI v2 cho Windows (Multi-Tab Keep-Alive 0ms), tích hợp MCP (Model Context Protocol) Server cho AI Agents' },
      'docs/DEEP_PAGINATION_AND_VIRTUAL_SCROLLING_TECHNIQUES.md': { lines: 219, role: 'Tài liệu kỹ thuật chuyên sâu về 2 kỹ thuật giải quyết bài toán Deep Pagination (OFFSET lớn) và Hao hụt dòng khi ảo hóa bảng dữ liệu lớn: Kỹ thuật 1 Deferred Join (quét trên B-Tree Index RAM buffer nhanh gấp 50-100 lần) và Kỹ thuật 2 Mảng ID Snapshot trong RAM Redis (Enterprise Standard: cắt lát mảng 0.01ms, triệt tiêu 100% lỗi hao hụt dòng khi nhảy cóc/xóa cứng)' },
      'src/components/grid/hooks/useColumnResize.ts': { lines: 86, role: 'Hook mỏng quản lý vòng đời resize cột, ủy quyền toàn bộ thao tác DOM 120fps sang dynamic import `columnResizeEngine.ts` để giữ bundle initial của `VirtualizedGrid` nhỏ gọn' },
      'src/components/grid/hooks/columnResizeEngine.ts': { lines: 313, role: 'Động cơ resize siêu tốc Viewport-Culled 120fps tải lười khi `pointerdown`: phân tách visible/overscan cells, cập nhật trực tiếp DOM/CSS var `--agv-col-w-*`, đồng bộ group span & bandContainers, commit React state + localStorage đúng 1 lần khi `mouseup`' },
      'src/components/grid/hooks/useColumnAutoFit.ts': { lines: 140, role: 'Custom Hook vừa độ rộng cột tối ưu: đo bề rộng qua lazy `gridAutoFitUtils.calcColAutoFitWidth`, collectColSummaryVals, handleAutoFitColumn, handleAutoFitAllColumns, handleAutoFitBandColumns' },
      'src/components/grid/hooks/useInCellEditor.ts': { lines: 63, role: 'Custom Hook mỏng quản lý sửa ô in-cell (`activeEditingCell`, `handleStartEditCell`, `handleEndEditCell`), phối hợp khóa cuộn cùng `useGridPopupLock`' },
      'src/components/grid/hooks/useGridKeyboardNav.ts': { lines: 156, role: 'Custom Hook chuyên trách điều hướng bàn phím trên Grid (ArrowUp, ArrowDown, PageUp, PageDown, Space): cố định listener qua keyNavStateRef giúp giữ phím cuộn liên tục 60fps không re-bind event' },
      'src/components/grid/hooks/useGridSortFlipAnimation.ts': { lines: 153, role: 'Custom Hook điều phối hiệu ứng trượt dòng FLIP khi Sort: giữ `prevRowIndexMapRef` & đồng bộ `sortSignature`, gọi dynamic `sortFlipEngine.ts` khi có thay đổi thứ tự' },
      'src/components/grid/hooks/sortFlipEngine.ts': { lines: 177, role: 'Engine tính toán delta và chạy FLIP animation 300ms (`computeSortRowFlipState`, `runSortFlipAnimation`) tải lười khi người dùng thực sự sort bảng' },
      'test/run_tests.mjs': { lines: 59, role: 'Native Test Runner siêu tốc: sử dụng Vite programmatic API biên dịch TypeScript không cần external packages, thực thi unit tests qua Node.js native test runner' },
      'src/components/ui/AdvComboBoxEdit.tsx': { lines: 557, role: 'Hộp chọn ComboBoxEdit chuẩn PNT B2B & Animate UI: `CONTROL_BOX_CLASS`, `getControlSurfaceClasses` (`sm = 28px`, `md = 36px`, `variant="auth"` 48px), `leadingIcon`, `invalid`, `useVirtualList`, `optionIndexMap` O(1), cache tìm kiếm lười + ASCII fast-path, `scrollDropdownItemIntoView`, zero autofill' },
      'src/components/ui/AdvSearchLookUpPopup.tsx': { lines: 503, role: 'Popup Portal danh mục `AdvSearchLookUpEdit` tách chunk lazy riêng (`React.lazy` + preload khi hover/focus): hỗ trợ `selectionMode="row" | "cell"`, chân trang thao tác đa chọn (nút Bỏ chọn & Áp dụng), filter row dùng `CONTROL_BOX_CLASS` + `BUTTON_FOCUS_VISIBLE_CLASS`, menu toán tử, bảng `table-fixed` + `useVirtualList`, `<MorphCheckbox />`, `isKeyboardNav`' },
      'src/components/ui/AdvSearchLookUpEdit.tsx': { lines: 900, role: 'Trigger gọn nhẹ bảng tra cứu LookUp nhiều cột chuẩn PNT B2B (`getControlSurfaceClasses`, `variant="default" | "auth"`, `selectionMode="row" | "cell"`, `selectedCells`, `leadingIcon`, `invalid`, `rowByKeyMap` O(1), lọc 1 lượt + `searchCacheRef`, short-circuit `isAllFilteredSelected`, lazy-load `AdvSearchLookUpPopup`, `NO_AUTOFILL_PROPS`)' },
      'src/components/ui/enterpriseEditorUtils.ts': { lines: 234, role: 'Tiện ích enterprise editor: getPortalThemeVars, computeEditorCoords, areEditorCoordsEqual, computeDropdownPageStep, computeNextHighlightedIndex, scrollDropdownItemIntoView (bù `scaleY`), useClickOutside (lọc scroll nội bộ), normalizeSearchText (có ASCII fast-path bỏ qua NFD/regex)' },
      'src/components/ui/AdvPopover.tsx': { lines: 193, role: 'Primitive Popover chuẩn Animate UI (Base UI): chuẩn hóa SURFACE_THEMES, trigger click toggle, tính tọa độ đồng bộ trước khi mở & so sánh `areEditorCoordsEqual`, Portal document.body, spring animation agv-spring-down/up, flip-up thông minh, useClickOutside bỏ qua portal con (`.agv-select-portal`), data-agv-popup="true" khóa cuộn bảng, 100% theme tokens' },
      'src/components/ui/AdvSelect.tsx': { lines: 376, role: 'Primitive Select chuẩn PNT B2B: `useVirtualList` + `AdvOverlayScroll`, `optionIndexMap` O(1), trigger `getControlSurfaceClasses` (`sm = 28px`, `md = 36px`, `variant="auth"` 48px), `leadingIcon`, `invalid`, `data-state="open"`, backdrop `pointer-events-none` + `useClickOutside`, `isKeyboardNav`, Portal' },
      'src/components/ui/useVirtualList.ts': { lines: 205, role: 'Hook ảo hóa danh sách cố định chiều cao dòng (`useVirtualList`): luôn khởi tạo và thu gọn `range` theo `computeVirtualWindow` ngay cả khi `enabled=false` (đóng popup), tránh render N nghìn dòng DOM ở khung mở đầu tiên' },
      'src/components/ui/AdvOverlayScroll.tsx': { lines: 368, role: 'Container cuộn kèm thanh cuộn nổi overlay chỉ hiện khi hover/scroll: `syncedInCommitRef` loại bỏ `requestAnimationFrame(syncMetrics)` trùng lặp sau khi đã sync đồng bộ trong `useLayoutEffect`' },
      'src/components/ui/AdvHoverCard.tsx': { lines: 156, role: 'Primitive Hover Card: chuẩn hóa SURFACE_THEMES (mặc định LIGHT), mở khi rê chuột với openDelay 150ms và closeDelay 200ms, useLayoutEffect + areEditorCoordsEqual đo kích thước chính xác trước paint, Portal document.body, agv-spring-up/down, kẹp biên màn hình, tự đóng khi cuộn trang' },
      'src/components/ui/AdvTooltip.tsx': { lines: 143, role: 'Primitive Tooltip chuẩn Base UI Motion: chuẩn hóa SURFACE_THEMES (mặc định LIGHT), Portal document.body, sửa lệch tọa độ bằng agv-spring-up/down + useLayoutEffect + areEditorCoordsEqual, tự động lật ngược, tự đóng khi cuộn' },
      'src/components/ui/AdvDrawer.tsx': { lines: 598, role: 'Bộ primitives Drawer chuẩn shadcn/ui Base UI & kích thước tối đa b2b-pnt (Drawer, DrawerPortal, DrawerOverlay, DrawerContent, DrawerSwipeHandle, DrawerHeader, DrawerTitle, DrawerDescription, DrawerBody, DrawerFooter, DrawerClose): z-[10000], nền đặc var(--popup-background), Phone w-full max-w-none, Tablet md:max-w-lg (512px) md:mx-auto, max-h 90dvh kèm --safe-area-top, vuốt xuống để đóng (chặn bắt nhầm trên nút/tab/radiogroup/datepicker tương tác), chỉ gắn .agv-drawer-portal & data-agv-popup="true" khi open=true, CHILD_POPUP_SELECTOR (gồm .agv-daterange-popover) + hadChildPopupOnDownRef chống đóng nhầm Drawer khi tắt lịch con' },
      'src/components/ui/index.ts': { lines: 103, role: 'Barrel re-export sạch sẽ toàn bộ controls, `AdvButton`/`Button`/`getButtonClass`/`buttonVariants`, `AdvInput`, `AdvFormField`/`FormField`/`AdvFormFieldOverlayScope` & `AdvDrawer` primitives' },
      'src/components/grid/GridChunkBlock.tsx': { lines: 346, role: 'Virtualized chunk container (CHUNK = 20): gắn class .agv-chunk-block, trên PC render trực tiếp GridRow, khi ở Tablet/Phone tải lười `LazyResponsiveChunkRow` (`Suspense`), giữ GPU translate3d, `allowTextSelection`, showRowNumber/showSelectionCol, `contain: "layout paint"' },
      'src/components/grid/responsive/ResponsiveChunkRow.tsx': { lines: 88, role: 'Chunk lazy bridge render `GridTabletRow` / `GridPhoneCard` tách khỏi `GridChunkBlock` để PC read-only không tải code responsive' },
      'src/components/grid/responsive/responsiveColumnUtils.ts': { lines: 56, role: 'Helper data-driven cho Tablet & Phone: `isResponsiveSystemColumn`, `getResponsiveDataColumns`, `extractResponsiveRawValue`, `formatResponsiveFieldValue`, `renderResponsiveField` (trả kết quả trực tiếp từ `columns` và `renderCell`, 0% demo code)' },
      'src/components/grid/responsive/GridTabletRow.tsx': { lines: 186, role: 'Renderer dòng dữ liệu 100% Data-Driven cho Tablet (768px - 1023px): chiều cao 68px, bảo toàn CHUNK = 20, phân bổ động các cột từ `columns` & `renderCell`, hỗ trợ `allowTextSelection` cho copy tự nhiên khi tắt context menu, đồng bộ hover/focus/checked và showRowNumber/showSelectionCol với PC' },
      'src/components/grid/responsive/GridPhoneCard.tsx': { lines: 236, role: 'Renderer thẻ dữ liệu 100% Data-Driven cho Phone (< 768px): slot container `.agv-phone-card-slot` cao 104px (254px khi mở rộng drawer 140px + 10px), hiển thị 4 cột đầu trên mặt thẻ & toàn bộ cột phụ trong drawer qua `columns` và `renderCell`, hỗ trợ `allowTextSelection`, triệt tiêu margin collapse ranh giới chunk' },
      'src/components/grid/responsive/GridTabletHeader.tsx': { lines: 108, role: 'Header tinh gọn 34px 100% Data-Driven cho Tablet sinh nhãn nhóm cột từ `columns` (`data-agv-responsive-header="true"`), ẩn nút sort/filter khi `onOpenSortFilter` undefined, hỗ trợ nhãn động `sortFilterLabel`, ẩn/hiện nhãn TT theo showRowNumber/showSelectionCol, 100% theme CSS variables' },
      'src/components/grid/responsive/ResponsiveSortFilterModal.tsx': { lines: 1441, role: 'Drawer Lọc & Sắp xếp cạnh dưới (`bottom-0`) tối ưu Mobile chia 2 phân đoạn (`Tìm kiếm & Lọc` | `Sắp xếp`): đồng bộ 100% toán tử PC theo dạng cột (`text`, `number`, `date`, `time`) qua thanh icon DevExtreme 1 hàng chia đều (`FilterOpIcon`, 0 cuộn ngang, 0 dropdown toán tử con, 0 tooltip `title=`) + chế độ `Một giá trị` / `Nhiều giá trị` (tái sử dụng `SmartNumberFilterInput`, `NumberRangeFilterInput`, `AdvDatePicker`, `AdvDateRangePicker`, `TimeFilterInput`, `TimeRangeFilterInput`, đa khoảng `multiRanges` & De Morgan `multiValues`) + Chip chọn phạm vi (`min-h-[36px]`, giữ `MobileColDraft` độc lập theo từng cột); Tab `Sắp xếp` có `Chiều sắp xếp` + danh sách dọc cột `min-h-[40px]`' },
      'src/components/grid/responsive/useGridLayoutMode.ts': { lines: 202, role: 'Custom Hook điều phối chế độ PC / Tablet / Phone: nhận `enabled = false` để bypass hoàn toàn `ResizeObserver` khi tắt `ResponsiveLayoutModule` (trả về "pc"), còn khi bật dùng Hysteresis (+-16px) & Debounce (120ms)' },
      'src/components/grid/ColumnContextMenu.tsx': { lines: 1190, role: 'Enterprise Context Menu (Header / Band / Row / Group Header): tái sử dụng `CONTEXT_MENU_TYPES` từ `./types`, tách biệt `enableColumnPinning` (Trái/Phải) và `enableCenterDock` (Giữa) qua helper `renderPinButtons`, tôn trọng `groupable !== false` & `hideable !== false`, orphan dividers, xuat default cho React.lazy' },
      'src/components/grid/gridFormatUtils.ts': { lines: 252, role: 'Pure formatting & predicate utilities siêu nhẹ (0 dependency UI): `formatDisplayDate`, `formatGridDateValue` (cắt leak khỏi `AdvDatePicker`), `getSttColWidth`, `parseGridNumber`, `formatGridNumber`, `ALIGN_*_CLASSES`, `isNoInputFilterOp`/`isBetweenFilterOp`/`isNegativeFilterOp`/`isSelectionColumn`/`getColumnFilterType`/`getDefaultFilterOpForColumn`' },
      'src/components/grid/gridUtils.ts': { lines: 941, role: 'Utility engine cho `DataGrid` (re-export `./gridFormatUtils` giữ tương thích ngược): đo Canvas Auto-Fit (Roboto >= 12px), clipboard, tọa độ context menu, lọc `matchFilterValue`, `compareGridRows`, `computeFilteredSelectionState`, `toggleFilteredRowsSelection`, `computeSortRowFlipState`' },
      'src/components/grid/types.ts': { lines: 429, role: 'TypeScript type definitions: SURFACE_THEMES, GRID_LAYOUT_MODES, CENTER_DOCK_STATUSES, PIN_POSITIONS, SORT_DIRECTIONS, GRID_EDIT_MODES, DATA_TYPES, FILTER_OPS, FORMULA_MODES, MONTH_ANALYTICS_MODES, `CONTEXT_MENU_TYPES`/`ContextMenuType`/`ContextMenuData`, `ColumnDef` (`valueGetter`, `renderHeader`, `hideable`, `groupable`, `enableGlobalFilter`, `meta`), `pinnedTopRowData` & `VirtualizedGridProps`' },
      'src/components/grid/floating/types.ts': { lines: 137, role: 'Floating toolbar type definitions: QUERY_COMBINATORS, TOOLBAR_POPUPS, DENSITY_MODES, GridSettingsState, GridFloatingToolbarProps (bổ sung feature flags, `persistState`, `onActivePopupChange` & 5 `allow*Setting` flags)' },
      'src/components/grid/AdvChecklistFilterPopup.tsx': { lines: 602, role: 'Popup lọc danh sách giá trị phân biệt (Checklist): chuẩn hóa SURFACE_THEMES, FILTER_MODES.MULTI, DATA_TYPES, đã gỡ sạch title tooltip, tích hợp NO_AUTOFILL_PROPS, tích hợp Lucide Icons (Search, X, FilterX), ưu tiên props.getDistinctValues chỉ hiển thị các giá trị từ các dòng thỏa mãn các bộ lọc đang active (AND logic chuẩn), bỏ qua _isGroupRow trong extractVal, nút SVG FilterX xóa các mục đã chọn ở góc phải ô tìm kiếm, tuân thủ Rules of Hooks, nhận matchFilterValue, tự động lọc danh sách giá trị theo điều kiện của RowFilter đang active (AND logic), bảo toàn độc lập không ghi đè RowFilter, 0ms phản hồi với distinctValuesCacheRef, ảo hóa 20 items' },
      'src/components/grid/constants.ts': { lines: 82, role: 'Grid constants & helpers: DEFAULT_CHUNK_SIZE = 20, DEFAULT_ROW_HEIGHT = 32, NO_AUTOFILL_PROPS (bộ 9 cờ chặn triệt để autofill), GRID_CONTROL_RADIUS_CLASS & getGridControlRadiusClass(), POPUP_SELECTORS (gồm .agv-multi-sort-popup, .agv-drawer-portal), getPinnedDividerClass (border-r-2 border-r-border), getRightPinnedDividerClass (border-l-2 border-l-border), getThemeClasses' },
      'src/components/ui/MorphCheckbox.tsx': { lines: 132, role: 'Control checkbox Morph Line 3 trạng thái thuần SVG CSS-keyframe (`unchecked` / `checked` / `indeterminate`, `viewBox="0 0 13 10"`, hitbox >= 28px), 0 dependency vào `morphicons`/`lucide`' },
      'src/components/ui/MorphIcons.tsx': { lines: 104, role: 'Universal Morphicons suite (`MorphIcon`, `MorphActionIcon`, `MorphSortIcon`, `MorphChevronIcon` + 6 Lucide icon dùng cho morph; re-export `MorphCheckbox` từ `./MorphCheckbox`), cắt giảm từ 25 icon Lucide xuống 6 icon' },
      'src/components/grid/smartNumberUtils.ts': { lines: 232, role: 'Bộ công cụ số thông minh theo quy ước chuẩn (k x1000, m/tr x1000000, b/ty x1000000000): formatNumberWithCommas, parseSmartNumericRange, expandAllShortcuts, formatSmartInputText (không tự thêm " - " gây đổi toán tử), handleNumericKeyDown, đồng bộ dấu chấm hàng nghìn và dấu phẩy thập phân Việt Nam' },
      'src/components/grid/TwelveMonthChartCell.tsx': { lines: 427, role: 'Biểu đồ Sparkline 12 tháng + FORMULA_CYCLE/FORMULA_META (di trú vào grid module & re-export qua `src/components/grid/index.ts`): Sóng Catmull-Rom spline, ResizeObserver, Portal Tooltip (agv-tooltip-spring-up/down, boxShadow: var(--popup-shadow)), đổi màu theo cực trị, tự đóng khi cuộn' },
      'src/components/grid/index.ts': { lines: 60, role: 'Barrel export chính thư viện Grid (`DataGrid`, `VirtualizedGrid`, `modules/*`, `columns/*`, `gridCellSpanEngine`, `gridTreeDataEngine`, `queryUtils`, types, constants, dùng `export type` cho các UI chunk lazy để giữ code-splitting sạch)' },
      'src/themes/': { lines: 305, role: 'PNT B2B Theme Registry (Light/Dark + Liquid Glass Ngày/Đêm): SURFACE_THEMES = { LIGHT, DARK, LIQUID_LIGHT, LIQUID_DARK }, isLiquidTheme, THEME_CLASS_MAP, common.ts (148 dòng), light.ts (54 dòng), dark.ts (54 dòng), index.ts (49 dòng) ánh xạ DAY/NIGHT/THEME_TOKENS nối vào `src/styles/design-tokens.css`' },
      'src/index.css': { lines: 816, role: 'Entry CSS app host: `@import "./styles/design-tokens.css";`, `@tailwind base/components/utilities;`, `.agv-btn*`, `.agv-control`, `.agv-field-border`/`.agv-field-notch-frame`, `.agv-liquid` (`blur(40px)` cho header/sheet/demo-card/popups/tất cả sticky bars bảng & `::before`/`::after` viền sáng specular 1px chống thấy rõ phần tử bên dưới), `.agv-popup-*`, MorphCheckbox & `.agv-incell-control`' },
      'src/lib/styles.css': { lines: 806, role: 'Entry CSS cô lập cho package `gridv3` (`dist-lib/styles.css`): đồng bộ `.agv-btn*`, `.agv-control`, `.agv-field-notch-frame`, `.agv-liquid` (`blur(40px)`, specular `::before`/`::after`, sticky header/filter/pinned/group/status-bar chống thấu chữ) & Grid CSS nhưng không gắn Preflight toàn cục hay rule lên `html`/`body`/`#root`' },
      'AGENTS.md': { lines: 37, role: 'Ponytail Senior Dev Guidelines, Recent Edits & Dictionary First & Core Rules (gồm Strict Mockup Fidelity, Popup Scroll Lock & Chuẩn Nút 4 Biến Thể `default | outline | ghost | destructive`)' }
    }
  },

  // ============================================================================
  // PHẦN A: TỪ ĐIỂN CHẨN ĐOÁN LỖI & SỰ CỐ (ERROR DIAGNOSTIC & TROUBLESHOOTING)
  // ============================================================================
  errors: [
    {
      code: 'ERR_INITIAL_RENDER_STALE_CHUNKS',
      title: 'Lỗi ô bảng bị trắng rỗng khi mới mở trang, phải cuộn chuột 1 cái mới chịu vẽ dữ liệu (Initial Render Stale Chunks)',
      symptom: 'Khi vừa tải trang, các ô STT và Checkbox hiển thị nhưng toàn bộ các ô dữ liệu khác bị trắng rỗng; chỉ sau khi người dùng lăn chuột hoặc cuộn bảng 1 cái thì dữ liệu mới bất ngờ xuất hiện.',
      keywords: ['phải cuộn 1 cái giao diện mới vẽ', 'cuộn mới hiện', 'trắng ô', 'mất dữ liệu ban đầu', 'rỗng bảng khi load', 'visibleChunksMap', 'stale chunks', 'initial render'],
      location: {
        file: 'src/App.tsx & src/components/grid/VirtualizedGrid.tsx',
        startLine: 165,
        endLine: 1375,
        anchorFunction: 'visibleChunksMap, getRow, isDataLoaded, dataVersion'
      },
      rootCause: '1) Do file JSON 18MB tải bất đồng bộ (mất ~150ms). Khi VirtualizedGrid mount lần đầu, totalRowCount bị hardcode là 55.873 trong khi airlineRows đang là mảng rỗng [], khiến visibleChunksMap được tính toán và memoize sẵn 6 chunk ô rỗng. 2) Khi fetch xong, isDataLoaded = true nhưng totalRowCount không đổi (vẫn 55.873), dataVersion không tăng, getRow giữ nguyên tham chiếu cũ, VirtualizedGrid không có prop dataVersion để kích hoạt tính toán lại visibleChunksMap. Chỉ khi người dùng cuộn chuột, scroll event làm đổi chunkWindow thì getRowItem mới được gọi lại để đọc dữ liệu thật.',
      solution: [
        '1. Khởi tạo isDataLoaded kiểm tra getAirlineDatasetLength() > 0.',
        '2. Cho totalRowCount = isDataLoaded ? getAirlineDatasetLength() : 0 (tránh tính trước chunk rỗng khi chưa có dữ liệu).',
        '3. Khi fetch hoàn tất, gọi setDataVersion(v => v + 1).',
        '4. Bổ sung dataVersion vào props của VirtualizedGrid, getRow dependency array, visibleChunksMap và sampleRows để bảng tự động kích hoạt render dữ liệu thật ngay tức thì mà không cần cuộn chuột.'
      ],
      ruleReference: 'Quy tắc "Tuân thủ triệt để kiến trúc ảo hóa theo Chunk (Chunk Virtualization Compliance CHUNK = 20)" trong AGENTS.md'
    },
    {
      code: 'ERR_POPUP_SCROLL_LEAK',
      title: 'Lỗi cuộn trôi bảng khi mở Popup / Đang sửa ô hoặc kẹt cứng không cuộn được khi đã đóng (Popup & Editing Scroll Lock)',
      symptom: '1) Khi đang sửa ô (in-cell editing) hoặc mở DatePicker, Dropdown ComboBoxEdit, SearchLookUpEdit, lăn chuột/vuốt touchpad khiến Grid bị cuộn ngang hoặc dọc làm lệch vị trí ô đang sửa. 2) Hoặc sau khi đóng popup/kết thúc sửa, Grid vẫn bị khóa cứng không cuộn được.',
      keywords: ['lệch popup', 'trôi menu', 'cuộn khi mở dropdown', 'popup scroll lock', 'cuộn nền', 'khóa cuộn', 'POPUP_SELECTORS', 'popup tắt rồi', 'không cuộn được', 'kẹt cuộn', 'khi đang sửa', 'cuộn ngang hoặc dọc', 'data-agv-editing'],
      location: {
        file: 'src/components/grid/VirtualizedGrid.tsx & popupLockUtils.ts',
        startLine: 78,
        endLine: 1320,
        anchorFunction: 'isAnyPopupActive, canWheelScrollInsidePopup, handleLockedWheel, handleScroll, agv-grid-popup-shield'
      },
      rootCause: '1) Cache 64ms hoặc thiếu capture-phase wheel/touchmove lock khiến popup không có thanh cuộn (AdvMultiSortPopup, ColumnContextMenu) truyền scroll-chaining xuống Grid/window. 2) Dùng selector wildcard `[data-agv-popup="true"] * { overscroll-behavior: contain }` chặn scroll-chaining qua các ô `<td>.truncate`/`<span>.truncate` (`overflow: hidden`) khiến chỉ cuộn được khi trỏ trực tiếp vào thanh cuộn. 3) Portal backdrop hoặc lớp shield cho phép tương tác xuyên xuống ô và header.',
      solution: [
        '1. Dùng popupLockUtils.ts (`canWheelScrollInsidePopup`, `shouldBlockGridInteractionWhenPopupOpen`) ở cả `VirtualizedGrid` lẫn `useInCellEditor`; chỉ gắn `overscroll-behavior: contain` trên `[data-agv-popup="true"]` và vùng cuộn thực sự (`.overflow-auto`, `.overflow-y-auto`, `.overflow-x-auto`, `.agv-chooser-scroll`), TUYỆT ĐỐI không gắn wildcard `[data-agv-popup="true"] *`.',
        '2. Đồng bộ `isPopupLockActive` (kết hợp state nội bộ, `GridFloatingToolbar.onActivePopupChange` và `MutationObserver` trên `document.body`), khóa `wheel`/`touchmove` capture trên `window` và chốt `popupLockedScrollPosRef` trong `handleScroll`.',
        '3. Render lớp phủ `.agv-grid-popup-shield` trong `containerRef` khi mở popup (nhường zIndex cho `.agv-floating-toolbar` khi mở toolbar popup, bỏ qua khi đang `activeEditingCell`), chuyển backdrop portal `AdvMultiSortPopup`/`AdvSelect` sang `pointer-events-auto` và chuyển click-outside của `ColumnContextMenu` sang capture phase.'
      ],
      ruleReference: 'Quy tắc "Có popup là Grid không được cuộn (Popup Scroll Lock)" trong AGENTS.md'
    },
    {
      code: 'ERR_CHECKBOX_STATIC_SQUARE',
      title: 'Lỗi ô checkbox có cảm giác 2 ô đè lên nhau hoặc có ô vuông tĩnh bên dưới',
      symptom: 'Khi click vào ô chọn (checkbox) trong bảng hoặc modal lọc, thấy có 1 ô vuông tĩnh nằm lì bên dưới, hoặc có cảm giác 2 ô checkbox nằm đè lên nhau.',
      keywords: ['ô vuông tĩnh', 'checkbox đè nhau', 'hai ô checkbox', 'ô chọn', 'CheckSquare', 'MorphCheckbox', 'fill thừa'],
      location: {
        file: 'src/components/ui/MorphIcons.tsx & src/App.tsx',
        startLine: 35,
        endLine: 62,
        anchorFunction: 'MorphCheckbox, MorphIcon'
      },
      rootCause: 'MorphCheckbox sử dụng CheckSquare thay vì Check. Trong Lucide, CheckSquare gồm 2 path riêng biệt (1 khung viền vuông hở góc + 1 nét dấu tích ✓), kết hợp với class tô màu fill-[var(--agv-accent)]/15. Khi morphicons morph từ Square sang CheckSquare, nó giữ nguyên khung vuông (biến thành ô vuông tĩnh) và vẽ thêm nét dấu tích lên trên, sinh ra hiệu ứng chồng lớp.',
      solution: [
        '1. Đổi cặp icon morphing trong MorphCheckbox thành `Square <-> Check` (dùng Check từ lucide, KHÔNG dùng CheckSquare).',
        '2. Gỡ bỏ hoàn toàn class fill màu nền thừa (fill-[var(--agv-accent)]/15).',
        '3. Khi chưa tick: Chỉ vẽ 1 ô vuông Square thanh mảnh duy nhất.',
        '4. Khi tick: 4 cạnh của ô vuông tự động co gập và biến đổi mượt mà thành dấu tích Check (✓) bằng spring physics của morphicons.'
      ],
      ruleReference: 'Quy tắc "Không dùng icon khi chưa có sự yêu cầu" & "Tối ưu hiệu ứng morphing đơn tầng"'
    },
    {
      code: 'ERR_CHUNK_GHOST_EMPTY',
      title: 'Lỗi rỗng bảng hoặc cuộn giật mất dòng (Chunk Bypass / Ghost Empty)',
      symptom: 'Khi cuộn ngang trên bảng hoặc khi ở chế độ cuộn trang (Window Scroll mode), thân bảng bất ngờ bị trắng xóa (không thấy dữ liệu) hoặc bị giật reset về các dòng đầu tiên.',
      keywords: ['rỗng bảng', 'mất dòng', 'cuộn giật', 'trắng xóa', 'virtualScrollTop', 'chunk 20', 'ghost empty'],
      location: {
        file: 'src/components/grid/VirtualizedGrid.tsx & GridChunkBlock.tsx',
        startLine: 350,
        endLine: 430,
        anchorFunction: 'handleScroll, syncChunkOffsets, GridChunkBlock memo'
      },
      rootCause: 'Sự kiện cuộn ngang (body.scrollLeft) vô tình đọc `body.scrollTop` (đang bằng 0 ở chế độ Window Scroll) rồi ghi đè lên `virtualScrollTop`, làm reset phạm vi chunk tính toán về 0..3 (60 dòng đầu), khiến vùng nhìn thực tế bị rỗng.',
      solution: [
        '1. Luôn phân tách riêng rẽ luồng cuộn ngang (chỉ cập nhật scrollLeft/horizontal offset) và luồng cuộn dọc.',
        '2. Ở Window Scroll mode, chỉ có listener của window mới được phép cập nhật `virtualScrollTop`.',
        '3. Kiểm tra thuộc tính `antiGhostMode`: sử dụng `contain: strict`, `backface-visibility: hidden` và `will-change: transform` trên GridChunkBlock để GPU giữ nguyên bộ nhớ đệm khung hình.'
      ],
      ruleReference: 'Quy tắc "Tuân thủ triệt để kiến trúc ảo hóa theo Chunk (CHUNK = 20)"'
    },
    {
      code: 'ERR_PIN_COLUMN_OVERLAP',
      title: 'Lỗi lệch cột ghim (Pinned Column Desync / Stacking Overlap)',
      symptom: 'Khi cuộn ngang, các cột ghim trái hoặc ghim phải bị che khuất nội dung, đè lên cột khác hoặc xuất hiện khoảng hở giữa các cột ghim.',
      keywords: ['ghim cột', 'lệch cột ghim', 'pinned left', 'pinned right', 'center dock', 'đè cột', 'leftOffsets'],
      location: {
        file: 'src/components/grid/VirtualizedGrid.tsx & GridHeader.tsx & GridRow.tsx',
        startLine: 120,
        endLine: 210,
        anchorFunction: 'calculatePinnedOffsets, stickyStyle'
      },
      rootCause: 'Mảng leftOffsets hoặc rightOffsets được tính toán dựa trên `defaultWidth` thay vì độ rộng thực tế trong state `colWidths`, hoặc thứ tự cột ghim bị đảo lộn sau khi kéo thả resize/reorder.',
      solution: [
        '1. Hàm tính offset bắt buộc phải ưu tiên `colWidths[col.key] || col.defaultWidth`.',
        '2. Đảm bảo z-index phân cấp chuẩn: Cột ghim góc Header (z-40) > Header thường (z-30) > Cột ghim Cell (z-20) > Cell thường (z-10).',
        '3. Kiểm tra biến `lastEffectiveLeftColKey` để chỉ áp dụng viền chia ghim (divider border) lên cột ghim cuối cùng bên trái.'
      ],
      ruleReference: 'Quy tắc "Tuân thủ triệt để chủ đề chung & Phân cấp Z-Index"'
    },
    {
      code: 'ERR_THEME_HARDCODED_COLOR',
      title: 'Lỗi lộ màu cứng không theo theme (Hardcoded Color Token Violation)',
      symptom: 'Khi chuyển sang chế độ Tối (.dark) của PNT B2B, một số nút bấm, viền header hoặc ô trong bảng vẫn giữ màu trắng sáng hoặc class màu cứng.',
      keywords: ['màu cứng', 'hardcode', 'sai màu theme', 'daylight', 'bg-slate', 'text-indigo', 'lỗi màu'],
      location: {
        file: 'src/styles/design-tokens.css & src/components/grid/constants.ts & src/App.tsx',
        startLine: 10,
        endLine: 85,
        anchorFunction: 'getThemeClasses, design-tokens.css, CONTROL_FOCUS_CLASS'
      },
      rootCause: 'Tồn tại class Tailwind tĩnh như `bg-slate-900`, `border-slate-800` hoặc màu hex cứng thay vì dùng biến `design-tokens.css` / class Tailwind semantic (`bg-card`, `border-control`, `bg-primary`, `bg-surface-selected`, `--agv-*`).',
      solution: [
        '1. Dùng class Tailwind semantic của `b2b-pnt` (`bg-background`, `bg-card`, `bg-control-surface`, `border-control`, `text-foreground`) hoặc biến `var(--agv-*)` được ánh xạ động trong `src/styles/design-tokens.css`.',
        '2. Dùng `CONTROL_FOCUS_CLASS` / `CONTROL_HOVER_CLASS` / `CONTROL_POPUP_OPEN_CLASS` từ `controlFocus.ts` cho hover & focus control; reserved Gold (`--brand-gold`) cho gạch chân tab active và vạch trái dòng/mục đang chọn (`--surface-selected`), Teal (`--primary`) chỉ cho CTA và focus ring.',
        '3. Mọi portal tự kế thừa `:root` / `.dark` từ `design-tokens.css`, không cần bơm `<style>` thủ công.'
      ],
      ruleReference: 'Quy tắc "Tuân thủ triệt để chủ đề chung (Theme Consistency)"'
    },
    {
      code: 'ERR_POPUP_CLICK_OUTSIDE',
      title: 'Lỗi menu ngữ cảnh hoặc popup không tự đóng khi bấm ra ngoài (hoặc đóng nhầm khi click vào portal con)',
      symptom: '1) Chuột phải mở ColumnContextMenu hoặc mở AdvPopover, sau đó click ra vị trí khác trên trang nhưng popup vẫn treo nguyên trên màn hình. 2) Hoặc trong AdvMultiFilterPopup / AdvPopover, khi bấm chọn portal con bên trong thì popup tự tắt do nhận diện nhầm portal con là bấm ra ngoài.',
      keywords: ['không tự đóng', 'treo popup', 'click ngoài', 'context menu', 'click outside', 'AdvPopover', 'chọn ngày tự tắt', 'AdvMultiFilterPopup'],
      location: {
        file: 'src/components/grid/ColumnContextMenu.tsx, src/components/ui/AdvPopover.tsx & src/components/grid/AdvMultiFilterPopup.tsx',
        startLine: 25,
        endLine: 193,
        anchorFunction: 'useEffect / useClickOutside listener'
      },
      rootCause: 'Thiếu `useEffect` đăng ký sự kiện mousedown/click toàn cục trên `document`; hoặc khi popup cha chứa controls mở portal ra document.body (như AdvDatePicker, AdvSelect), listener của popup cha không loại trừ các class selector của portal con (.agv-calendar-popover, .agv-select-portal, .agv-preset-dropdown-menu...) dẫn đến nhận diện nhầm là nhấp ngoài.',
      solution: [
        '1. Trong component popup, luôn đăng ký listener hoặc dùng `useClickOutside` hỗ trợ `ignoreSelector` cho portal con.',
        '2. Nếu popup chứa controls có portal ngoài (AdvDatePicker, AdvSelect, Presets), BẮT BUỘC kiểm tra loại trừ: `if (target.closest?.(".agv-select-portal, .agv-calendar-popover, .agv-daterange-popover, .agv-preset-dropdown-menu, .agv-portal-dropdown, .agv-custom-select-dropdown")) return;`.',
        '3. Nhớ return hàm cleanup `document.removeEventListener("mousedown", handleClick)` khi component unmount.',
        '4. Trong GridRow/GridHeader, hạn chế dùng `stopPropagation` không cần thiết để sự kiện click outside hoạt động mượt mà.'
      ],
      ruleReference: 'Quy tắc "Tất cả các popup đều phải tự tắt khi chuột thao tác bên ngoài (Click Outside)"'
    },
    {
      code: 'ERR_INPUT_AUTOFILL_LEAK',
      title: 'Lỗi hiển thị gợi ý thông tin của trình duyệt (Browser Autofill Popup)',
      symptom: 'Khi click vào ô tìm kiếm trên trang danh mục hoặc ô filter, trình duyệt tự động xổ danh sách gợi ý địa chỉ, số điện thoại, mật khẩu làm che khuất giao diện bảng.',
      keywords: ['autofill', 'autocomplete', 'gợi ý trình duyệt', 'gợi ý tìm kiếm', 'che khuất'],
      location: {
        file: 'src/pages/CountriesPage.tsx & src/components/grid/GridFilterRow.tsx',
        startLine: 240,
        endLine: 340,
        anchorFunction: 'input search render'
      },
      rootCause: 'Thẻ `<input>` chỉ đặt `autoComplete="off"` đơn giản, trình duyệt hiện đại (Chrome/Edge) bỏ qua và vẫn tự động hiển thị popup autofill.',
      solution: [
        'Sử dụng hằng số chuẩn Single Source of Truth `{...NO_AUTOFILL_PROPS}` từ `src/components/grid/constants`:',
        '• autoComplete="off"',
        '• autoCorrect="off"',
        '• autoCapitalize="off"',
        '• spellCheck={false}',
        '• aria-autocomplete="none"',
        '• data-lpignore="true"',
        '• data-form-type="other"'
      ],
      ruleReference: 'Quy tắc "Tất cả controls tuyệt đối không được gợi ý thông tin (No Autofill / Autocomplete)"'
    },
    {
      code: 'ERR_CONTEXT_MENU_BOUNDARY',
      title: 'Lỗi Menu chuột phải bị tràn màn hình hoặc che khuất (Context Menu Viewport Overflow)',
      symptom: 'Khi chuột phải ở các cột hoặc dòng sát mép phải hoặc mép dưới màn hình, menu ngữ cảnh bị che khuất một phần hoặc kích hoạt thanh cuộn bất thường.',
      keywords: ['tràn màn hình', 'menu chuột phải', 'context menu', 'overflow', 'computeContextMenuCoords', 'mép dưới'],
      location: {
        file: 'src/components/grid/gridUtils.ts & ColumnContextMenu.tsx',
        startLine: 95,
        endLine: 132,
        anchorFunction: 'computeContextMenuCoords'
      },
      rootCause: 'Tọa độ mở menu (e.clientX, e.clientY) được gán trực tiếp làm style top/left mà không tính đến độ rộng (menuWidth ~ 200px) và chiều cao (menuHeight ~ 280px) của menu so với kích thước viewport (window.innerWidth, window.innerHeight).',
      solution: [
        '1. Sử dụng hàm `computeContextMenuCoords(clickX, clickY, menuWidth, menuHeight, padding)` từ `gridUtils.ts`.',
        '2. Nếu `clickX + menuWidth > innerWidth`, tự động đảo tọa độ sang trái (`clickX - menuWidth`).',
        '3. Nếu `clickY + menuHeight > innerHeight`, tự động đảo tọa độ lên trên (`clickY - menuHeight`).',
        '4. Luôn đảm bảo tọa độ không bao giờ nhỏ hơn khoảng đệm an toàn padding (8px).'
      ],
      ruleReference: 'Quy tắc "Theme Consistency" & "Chiều cao tối thiểu toàn bộ Controls hệ thống"'
    },
    {
      code: 'ERR_BATCH_AUTOFIT_STALE_STATE',
      title: 'Lỗi Vừa độ rộng tất cả cột hoặc trong tầng chỉ đổi đúng 1 cột (Batch Auto-Fit Stale State Overwrite)',
      symptom: 'Khi chọn "Vừa độ rộng tất cả cột" hoặc "Vừa độ rộng các cột trong tầng", chỉ có duy nhất cột cuối cùng trong danh sách đổi độ rộng, các cột còn lại giữ nguyên kích thước cũ.',
      keywords: ['vừa độ rộng', 'tất cả cột', 'trong tầng', 'auto-fit', 'calcColAutoFitWidth', 'handleAutoFitAllColumns', 'handleAutoFitBandColumns', 'bị ghi đè'],
      location: {
        file: 'src/components/grid/VirtualizedGrid.tsx',
        startLine: 94,
        endLine: 450,
        anchorFunction: 'setMultipleColWidths, handleAutoFitAllColumns, handleAutoFitBandColumns'
      },
      rootCause: 'Vòng lặp forEach gọi hàm đơn lẻ setColWidth(key, w). Vì setColWidth đọc colWidths tĩnh từ scope render, mỗi lần lặp đều tạo ra object mới chỉ chứa 1 cột mới và các cột cũ ở độ rộng ban đầu, làm ghi đè mất các cột đã tính trước đó. Trong React batching, chỉ giá trị cuối cùng được lưu lại.',
      solution: [
        '1. Xây dựng hàm `setMultipleColWidths(updates: Record<string, number>)`.',
        '2. Trong handleAutoFitAllColumns và handleAutoFitBandColumns, gom toàn bộ độ rộng mới của các cột vào đối tượng `updates`.',
        '3. Gọi `setMultipleColWidths(updates)` đúng 1 lần để cập nhật đồng bộ toàn bộ bảng.'
      ],
      ruleReference: 'Quy tắc "Ưu tiên tái sử dụng và cải tiến control có sẵn" & "Chunk Virtualization Compliance"'
    },
    {
      code: 'ERR_FILTER_OP_RESET',
      title: 'Lỗi không đổi được toán tử lọc trên FilterRow khi ô input đang rỗng (Operator Reset Bug)',
      symptom: 'Người dùng click vào menu toán tử lọc trên dòng GridFilterRow để chuyển sang toán tử khác, nhưng toán tử lập tức bị nhảy ngược về toán tử mặc định ban đầu.',
      keywords: ['toán tử', 'đổi toán tử', 'operator', 'filter operation', 'không đổi được', 'reset toán tử', 'isValEmpty'],
      location: {
        file: 'src/App.tsx & src/components/grid/GridFilterRow.tsx',
        startLine: 190,
        endLine: 210,
        anchorFunction: 'handleColumnFilterChange, handleSelectOp'
      },
      rootCause: 'Hàm handleColumnFilterChange kiểm tra `if (isValEmpty && !isNoInput)` và thực hiện `delete next[colKey]`. Do người dùng chọn đổi toán tử trước khi gõ nội dung (val === ""), key của cột bị xóa khỏi state columnFilters khiến GridFilterRow tự động fallback về toán tử mặc định.',
      solution: [
        '1. Trong `handleColumnFilterChange`, lưu toàn bộ object filter `{ op, val }` vào state `columnFilters` kể cả khi `val === ""` để bảo lưu lựa chọn của người dùng.',
        '2. Chỉ bỏ qua các điều kiện lọc có `val === ""` khi thực hiện pipeline lọc dữ liệu (`activeColEntries`), không được xóa khỏi state.',
        '3. Trong `handleSelectOp` của GridFilterRow, fallback theo `getDefaultOpForCol(colKey)` để đảm bảo đúng loại dữ liệu.'
      ],
      ruleReference: 'Quy tắc "Ưu tiên kiểm tra RECENT_EDITS.md & code_index.js"'
    }
  ],

  // ============================================================================
  // PHẦN B: TỪ ĐIỂN THUẬT NGỮ & CƠ CHẾ KIẾN TRÚC (ARCHITECTURE GLOSSARY)
  // ============================================================================
  concepts: [
    {
      term: 'Chunk Virtualization (CHUNK = 20)',
      vietnameseName: 'Ảo hóa theo khối 20 dòng',
      description: 'Thay vì render 50,000 DOM rows cùng lúc gây tràn RAM và giật lag, hệ thống chia dữ liệu thành từng khối (chunks), mỗi chunk chứa đúng 20 dòng. Chỉ các chunks nằm trong vùng nhìn thấy (viewport + buffer) mới được render lên DOM bằng thẻ GridChunkBlock tuyệt đối hóa vị trí via GPU `translate3d(0, topOffset, 0)`.',
      keyFiles: 'src/components/grid/GridChunkBlock.tsx & VirtualizedGrid.tsx',
      keyLines: 'GridChunkBlock.tsx:67-90, VirtualizedGrid.tsx:320-360'
    },
    {
      term: 'Two-Tier Header Bands (64px)',
      vietnameseName: 'Tiêu đề 2 tầng 64px độc lập',
      description: 'Tầng 1 (32px trên) dành cho nhóm cột (Group Bands) hoặc cột độc lập span trọn 64px. Tầng 2 (32px dưới) dành cho các cột con bên trong nhóm. Hỗ trợ thu gọn/mở rộng nhóm cột (Group Collapse) và ghim vị trí (Pin Left/Right) đồng bộ mượt mà.',
      keyFiles: 'src/components/grid/GridHeader.tsx',
      keyLines: 'GridHeader.tsx:65-210'
    },
    {
      term: 'Modular Grid Architecture & Column Helper (AG Grid + TanStack Table v8)',
      vietnameseName: 'Kiến trúc Grid Module hóa (Opt-in) & API Cột Chuẩn Hóa',
      description: 'Tách biệt chế độ xem cơ bản (`BasicViewModules`: `RowNumberModule` + `PaginationModule`) khỏi 23 module tính năng (`ColumnPinningModule`, `CenterDockModule`, `RowPinningModule`, `SortingModule`, `FilteringModule`, `CellEditingModule`, `ResponsiveLayoutModule`, `CrossHoverModule`, `CellSpanModule`, `TreeDataModule`, `RowDetailModule`...) với 3 preset (`BasicViewModules`, `StandardGridModules`, `AllEnterpriseModules`). Kết hợp API cột `createColumnHelper<T>()` + `defaultColDef` + `normalizeGridColumns`, tách UI nặng qua `React.lazy` + `<Suspense>` và barrel `export type`.',
      keyFiles: 'src/components/grid/modules/index.ts & src/components/grid/columns/ & src/components/grid/gridFeatures.ts',
      keyLines: 'modules/index.ts:34-181, createColumnHelper.ts:27-49, normalizeColumns.ts:183-264, gridFeatures.ts:120-375'
    },
    {
      term: 'Column Pinning, Center Docking & Row Pinning',
      vietnameseName: 'Ghim cột Trái/Phải, Dock Giữa & Ghim dòng (3 Module Độc Lập)',
      description: 'Tách thành 3 module độc lập: `ColumnPinningModule` (ghim cột Trái/Phải qua CSS `position: sticky` & `leftOffsets`/`rightOffsets`), `CenterDockModule` (giữ cột tại trung tâm viewport) và `RowPinningModule` (ghim dòng top qua `pinnedTopRowData` hoặc context menu). Không bật khi dùng bảng PC xem thuần.',
      keyFiles: 'src/components/grid/modules/index.ts & VirtualizedGrid.tsx & ColumnContextMenu.tsx & GridRow.tsx',
      keyLines: 'modules/index.ts:37-42, ColumnContextMenu.tsx:183-260, GridHeader.tsx:29-420'
    },
    {
      term: 'Context Menu Architecture & Canvas Auto-Fit Engine',
      vietnameseName: 'Hệ thống Menu Chuột Phải 3 Phạm Vi & Tự Động Vừa Cột Canvas',
      description: 'Hệ thống menu chuột phải tương tự Toolbar hỗ trợ 3 phạm vi: Header (Ghim cột, Vừa nội dung, Ẩn/Hiện cột), Band (Ghim nhóm tầng 1, Vừa nội dung cả nhóm, Ẩn nhóm), Row/Cell (Sao chép giá trị ô, Lọc nhanh theo giá trị, Sao chép dòng kèm tiêu đề, Cuộn lên đỉnh/xuống đáy). Sử dụng thẻ HTML5 Canvas ẩn để đo pixel chính xác của tiêu đề và 100 dòng mẫu mà không gây đơ lag với 50.000 dòng dữ liệu.',
      keyFiles: 'src/components/grid/gridUtils.ts & ColumnContextMenu.tsx & VirtualizedGrid.tsx',
      keyLines: 'gridUtils.ts:1-132, ColumnContextMenu.tsx:1-585, VirtualizedGrid.tsx:400-690'
    },
    {
      term: 'Morphicons Universal Spring Physics',
      vietnameseName: 'Động cơ biểu tượng biến hình lò xo',
      description: 'Thư viện morphicons tích hợp vật lý lò xo (spring physics) cho phép biến đổi mượt mà giữa các icon mà không cần thư viện nặng. Ở checkbox, 4 cạnh của Square tự co gập mượt thành Check (✓) với độ nảy bouncy, hoàn toàn không sinh ra ô vuông tĩnh thừa.',
      keyFiles: 'src/components/ui/MorphIcons.tsx',
      keyLines: 'MorphIcons.tsx:35-62'
    },
    {
      term: 'Theme CSS Variables Engine (PNT B2B Design Tokens + var(--agv-*))',
      vietnameseName: 'Bộ biến giao diện PNT Light/Dark đồng bộ D:\\Dự án\\b2b-pnt',
      description: 'Single source of truth tại `src/styles/design-tokens.css` khai báo đầy đủ token Light (`:root`) và Dark (`.dark`) của `b2b-pnt` (`--background`, `--card`, `--primary`, `--brand-gold`, `--surface-selected`, `--table-header`, `--control-border`...) kèm ánh xạ trực tiếp sang toàn bộ `--agv-*`.',
      keyFiles: 'src/styles/design-tokens.css & src/themes/common.ts & src/components/grid/constants.ts',
      keyLines: 'src/styles/design-tokens.css:1-274, src/themes/common.ts:1-128, constants.ts:1-81'
    },
    {
      term: 'Atomic Band Mechanism (isAtomic: true)',
      vietnameseName: 'Cơ chế Nhóm Cột Nguyên Khối (Chu kỳ 12 tháng & Công thức)',
      description: 'Đối với các nhóm cột đặc thù có quan hệ chặt chẽ (như 12 tháng col_m1..col_m12 kèm biểu đồ/công thức), hệ thống gom toàn bộ nhóm thành một đơn vị nguyên khối (Atomic Group) trong Column Chooser và Context Menu. Không cho phép ẩn/hiện lẻ từng tháng nhằm chống vỡ cấu trúc và tiết kiệm không gian danh sách (từ 14 dòng thu gọn thành 1 dòng). Bật/tắt, Ghim hoặc Vừa độ rộng sẽ áp dụng đồng thời cho toàn bộ các cột trong nhóm.',
      keyFiles: 'src/components/grid/floating/AdvColumnChooserModal.tsx & src/components/grid/ColumnContextMenu.tsx & VirtualizedGrid.tsx',
      keyLines: 'AdvColumnChooserModal.tsx:237-295, ColumnContextMenu.tsx:425-455, VirtualizedGrid.tsx:455-520'
    },
    {
      term: 'Dual Scroll Modes (Window vs Container)',
      vietnameseName: 'Chế độ cuộn kép (Trang vs Khung)',
      description: 'Grid có thể chạy ở chế độ cuộn khung cố định (`height: 600px`) hoặc chế độ cuộn toàn trang (`height: auto`). Ở chế độ cuộn trang, thanh cuộn của trình duyệt điều khiển vị trí ảo hóa thông qua listener `window.addEventListener("scroll")`.',
      keyFiles: 'src/components/grid/VirtualizedGrid.tsx',
      keyLines: 'VirtualizedGrid.tsx:360-420'
    },
    {
      term: 'Grid Interaction Modes (Xem, Sửa 1 click, Sửa 2 click)',
      vietnameseName: '3 hình thức tương tác ô: Xem, Sửa (1 click), Sửa (2 click)',
      description: 'Hỗ trợ 3 chế độ tương tác ô trên toàn bảng. Chế độ Xem (chỉ đọc); Chế độ Sửa (1 click) kích hoạt ngay in-cell editor khi click vào ô; Chế độ Sửa (2 click) nhấp đúp để sửa, click đơn để chọn dòng. Cột Biểu Đồ col_chart và Công Thức (`FORMULA_CYCLE`/`FORMULA_META`) được bảo vệ an toàn (chỉ đọc). Khi sửa đổi các tháng, sóng Catmull-Rom sparkline và công thức tự động tính toán lại và co giãn tức thì.',
      keyFiles: 'src/components/grid/GridRow.tsx & VirtualizedGrid.tsx & TwelveMonthChartCell.tsx',
      keyLines: 'GridRow.tsx:50-145, VirtualizedGrid.tsx:520-565, TwelveMonthChartCell.tsx:1-60'
    },
    {
      term: 'Deferred Join (Late Row Lookup)',
      vietnameseName: 'Kỹ thuật Deferred Join giải quyết Deep Offset Penalty (OFFSET lớn)',
      description: 'Tách truy vấn thành 2 giai đoạn: Subquery chỉ quét trên Index B-Tree trong RAM buffer (chỉ đọc 4 bytes cột ID) kết hợp OFFSET/LIMIT để lấy đúng 60 ID, sau đó mới INNER JOIN ngược lại bảng chính để lấy dữ liệu chi tiết qua Clustered Index Seek. Nhanh gấp 50-100 lần so với OFFSET thông thường (từ 2.000ms xuống ~15ms) và bảo toàn 100% độ chính xác dòng khi có xóa dòng hoặc lọc.',
      keyFiles: 'docs/DEEP_PAGINATION_AND_VIRTUAL_SCROLLING_TECHNIQUES.md',
      keyLines: 'DEEP_PAGINATION_AND_VIRTUAL_SCROLLING_TECHNIQUES.md:33-92'
    },
    {
      term: 'ID Array Snapshot in Redis (Enterprise Pagination)',
      vietnameseName: 'Kỹ thuật Mảng ID Snapshot trong RAM Redis cho 500k - 10M dòng',
      description: 'Khi người dùng lọc dữ liệu, backend chỉ truy vấn 1 cột ID và lưu mảng ID vào Redis (100k ID chỉ tốn 400KB RAM). Khi người dùng cuộn nhảy cóc tới dòng bất kỳ (ví dụ dòng 90.000), Redis cắt lát mảng LRANGE/ZRANGE trong 0.01ms lấy đúng 60 ID thực tế, sau đó truy vấn Database WHERE id IN (...) bằng Index Seek. Triệt tiêu 100% rủi ro hao hụt dòng khi bảng có xóa cứng, xóa mềm và giảm 99% tải Database.',
      keyFiles: 'docs/DEEP_PAGINATION_AND_VIRTUAL_SCROLLING_TECHNIQUES.md',
      keyLines: 'DEEP_PAGINATION_AND_VIRTUAL_SCROLLING_TECHNIQUES.md:94-196'
    }
  ],

  // ============================================================================
  // PHẦN C: TỪ ĐIỂN HÀM, COMPONENT & STATE (FUNCTIONS & CONTROLS REGISTRY)
  // ============================================================================
  functions: [
    // --- src/components/grid/gridFormatUtils.ts, gridUtils.ts & lazy engines ---
    { name: 'formatDisplayDate', file: 'src/components/grid/gridFormatUtils.ts', line: 19, desc: 'Chuẩn hóa ngày hiển thị DD/MM/YYYY độc lập khỏi AdvDatePicker' },
    { name: 'formatGridDateValue', file: 'src/components/grid/gridFormatUtils.ts', line: 65, desc: 'Format ngày chuẩn DD/MM/YYYY (hoặc DD/MM/YYYY HH:mm), loại bỏ giây thừa :ss (tách khỏi datePickerUtils để cắt transitive leak)' },
    { name: 'measureTextWidth', file: 'src/components/grid/gridAutoFitUtils.ts', line: 16, desc: 'Đo chiều rộng pixel thực tế của chuỗi văn bản bằng thẻ HTML5 Canvas 2D ẩn với font Roboto >= 12px (tách lazy khỏi gridUtils)' },
    { name: 'getSttColWidth', file: 'src/components/grid/gridFormatUtils.ts', line: 92, desc: 'Tự động tính toán độ rộng tối ưu cho cột STT dựa trên số chữ số của tổng số dòng' },
    { name: 'calcColAutoFitWidth', file: 'src/components/grid/gridAutoFitUtils.ts', line: 31, desc: 'Tính độ rộng tối ưu (auto-fit) cho cột bằng cách lấy mẫu dòng dữ liệu kết hợp summaryValues tổng nhóm & tổng bảng format toLocaleString vi-VN font Roboto >= 12px, kẹp giữa minWidth và maxLimit (380px)' },
    { name: 'computeContextMenuCoords', file: 'src/components/grid/gridClipboardUtils.ts', line: 4, desc: 'Giới hạn tọa độ mở context menu chống tràn mép phải và mép dưới viewport (tách lazy)' },
    { name: 'copyTextToClipboard', file: 'src/components/grid/gridClipboardUtils.ts', line: 43, desc: 'Cơ chế sao chép văn bản vào clipboard an toàn 2 tầng: navigator.clipboard + textarea fallback (tách lazy)' },
    { name: 'parseGridNumber', file: 'src/components/grid/gridFormatUtils.ts', line: 105, desc: 'Chuyển đổi mọi giá trị chuỗi hoặc số thành kiểu number chuẩn xác, tự động nhận diện cả chuẩn VN (1.234,56), quốc tế (1,234.56) và số âm ngoặc đơn (1.000)' },
    { name: 'formatGridNumber', file: 'src/components/grid/gridFormatUtils.ts', line: 161, desc: 'Định dạng số chuẩn kế toán/tài chính #,###.##: chấm (.) hàng nghìn, phẩy (,) thập phân, số âm đặt trong ngoặc đơn (1.000)' },
    { name: 'isSelectionColumn', file: 'src/components/grid/gridFormatUtils.ts', line: 222, desc: 'Predicate kiểm tra cột chọn dòng: đóng gói tập trung điều kiện col.isSelection hoặc col.key === "col_chk"' },
    { name: 'computeFilteredSelectionState', file: 'src/components/grid/gridSelectionUtils.ts', line: 16, desc: 'Tính toán trạng thái chọn dòng tối ưu: khi không lọc (activeRowIndices === null) chỉ duyệt qua tập checkedRowIndices (tách lazy)' },
    { name: 'toggleFilteredRowsSelection', file: 'src/components/grid/gridSelectionUtils.ts', line: 68, desc: 'Đảo/bật/tắt chọn hàng loạt: Fast-path O(1) khi bỏ chọn toàn bộ trên bảng không lọc trả về ngay new Set() rỗng (tách lazy)' },
    { name: 'computeSortRowFlipState', file: 'src/components/grid/hooks/sortFlipEngine.ts', line: 18, desc: 'Tính toán trạng thái trượt FLIP khi Sort chuẩn AG Grid: trượt deltaY chính xác cho các dòng hoán đổi trong viewport (tách lazy)' },
    { name: 'runSortFlipAnimation', file: 'src/components/grid/hooks/sortFlipEngine.ts', line: 74, desc: 'Thực thi hiệu ứng GPU translate3d + cubic-bezier 300ms cho các dòng trượt FLIP sau khi sort' },

    // --- src/components/grid/GridHeader.tsx ---
    { name: 'GridHeader', file: 'src/components/grid/GridHeader.tsx', line: 42, desc: 'Component thanh tiêu đề 1 hoặc 2 tầng hỗ trợ renderHeader(), nhóm cột, ghim vị trí, lazy sort morph icon và context menu' },
    { name: 'middleElements', file: 'src/components/grid/hooks/useGridColumnLayout.ts', line: 505, desc: 'Cấu trúc gom cột/nhóm vùng giữa (`GridMiddleElement[]`) tính sẵn cho Header & ColumnLayout' },
    { name: 'renderHeaderCellContent', file: 'src/components/grid/GridHeader.tsx', line: 204, desc: 'Helper chuẩn hóa DRY cho nội dung ô header (hỗ trợ `col.renderHeader()`, icon sort `LazyHeaderSortMorphIcon`, nút checklist filter, thanh resize)' },

    // --- src/components/grid/smartNumberUtils.ts ---
    { name: 'expandAllShortcuts', file: 'src/components/grid/smartNumberUtils.ts', line: 18, desc: 'Mở rộng các phím tắt đơn vị số theo quy ước chuẩn (k x1000, m/tr x1000000, b/ty x1000000000), dùng parseGridNumber để hỗ trợ cả 1000k lẫn 1,5tr / 1tr5' },
    { name: 'formatNumberWithCommas', file: 'src/components/grid/smartNumberUtils.ts', line: 44, desc: 'Định dạng số hiển thị chuẩn Việt Nam với formatGridNumber (giữ nguyên chuỗi còn chữ cái phím tắt dở dang như 1t để gõ tiếp 1tr/1ty)' },
    { name: 'cleanNumericInput', file: 'src/components/grid/smartNumberUtils.ts', line: 56, desc: 'Làm sạch chuỗi nhập số, mở rộng phím tắt ghi gọn' },
    { name: 'parseSmartNumericRange', file: 'src/components/grid/smartNumberUtils.ts', line: 79, desc: 'Phân tích khoảng số thông minh từ các cú pháp .., /, -, ~ hỗ trợ phím tắt ghi gọn' },
    { name: 'formatSmartInputText', file: 'src/components/grid/smartNumberUtils.ts', line: 162, desc: 'Định dạng chuỗi nhập số/dải số giữ nguyên dấu thập phân đang gõ (1, / 1.) và không tự chèn " - " sau 1k/1m/1tr/1b/1ty' },
    { name: 'handleNumericKeyDown', file: 'src/components/grid/smartNumberUtils.ts', line: 210, desc: 'Chặn ký tự chữ cái rác khi gõ vào ô số, chỉ cho phép số, dấu phân cách, ngoặc đơn âm và phím tắt ghi gọn (k, m, tr, b, ty)' },

    // --- src/components/grid/VirtualizedGrid.tsx & Hooks ---
    { name: 'VirtualizedGrid', file: 'src/components/grid/VirtualizedGrid.tsx', line: 2758, desc: 'Component bảng ảo hóa hiệu năng cao theo module opt-in & Lazy UI chunks (`VirtualizedGridComponent` dòng 87)' },
    { name: 'setColWidth', file: 'src/components/grid/hooks/useGridColumnLayout.ts', line: 94, desc: 'Cập nhật độ rộng của một cột đơn lẻ qua functional state update (tách sang `useGridColumnLayout`)' },
    { name: 'setMultipleColWidths', file: 'src/components/grid/hooks/useGridColumnLayout.ts', line: 115, desc: 'Cập nhật độ rộng hàng loạt cột trong 1 lần render duy nhất (Batch Width Update)' },
    { name: 'effectiveColumns', file: 'src/components/grid/hooks/useGridColumnLayout.ts', line: 205, desc: 'Danh sách cột hiệu dụng sau khi đã lọc bỏ các cột thuộc hiddenColKeys' },
    { name: 'useGridColumnLayout', file: 'src/components/grid/hooks/useGridColumnLayout.ts', line: 41, desc: 'Custom hook quản lý bố cục cột/ghim/band/ẩn cột; bỏ qua ResizeObserver đo vị trí tự nhiên khi không có cột center-pinned' },
    { name: 'isAnyPopupActive', file: 'src/components/grid/hooks/useGridPopupLock.ts', line: 10, desc: 'Kiểm tra nhanh zero-allocation trên `document.body.children` xem có popup/modal nào đang mở không' },
    { name: 'useGridPopupLock', file: 'src/components/grid/hooks/useGridPopupLock.ts', line: 25, desc: 'Custom hook khóa cuộn & chặn tương tác Grid khi popup/context menu/editor đang mở' },
    { name: 'handleMouseDownResize', file: 'src/components/grid/VirtualizedGrid.tsx', line: 563, desc: 'Bắt đầu thao tác kéo thả thay đổi độ rộng cột (từ useColumnResize)' },
    { name: 'handleAutoFitColumn', file: 'src/components/grid/VirtualizedGrid.tsx', line: 570, desc: 'Tự động vừa độ rộng cho một cột dựa trên canvas text measurement (từ useColumnAutoFit)' },
    { name: 'handleAutoFitAllColumns', file: 'src/components/grid/VirtualizedGrid.tsx', line: 570, desc: 'Tự động vừa độ rộng cho toàn bộ các cột đang hiển thị trong bảng (từ useColumnAutoFit)' },
    { name: 'handleAutoFitBandColumns', file: 'src/components/grid/VirtualizedGrid.tsx', line: 570, desc: 'Tự động vừa độ rộng cho tất cả các cột thuộc nhóm tầng 1 (từ useColumnAutoFit)' },
    { name: 'handleSetPin', file: 'src/components/grid/VirtualizedGrid.tsx', line: 585, desc: 'Thay đổi vị trí ghim của cột (left, middle, right) — tách biệt `enableColumnPinning` vs `enableCenterDock`' },
    { name: 'handleSetBandPin', file: 'src/components/grid/VirtualizedGrid.tsx', line: 593, desc: 'Thay đổi vị trí ghim của toàn bộ nhóm cột tầng 1 — tách biệt `enableColumnPinning` vs `enableCenterDock`' },
    { name: 'handleHideColumn', file: 'src/components/grid/VirtualizedGrid.tsx', line: 604, desc: 'Thêm cột vào danh sách ẩn hiddenColKeys' },
    { name: 'handleHideAllEmptyColumns', file: 'src/components/grid/VirtualizedGrid.tsx', line: 612, desc: 'Ẩn toàn bộ cột rỗng vào danh sách hiddenColKeys và lưu LocalStorage' },
    { name: 'handleShowAllHiddenColumns', file: 'src/components/grid/VirtualizedGrid.tsx', line: 622, desc: 'Khôi phục toàn bộ các cột đã bị ẩn' },
    { name: 'handleHideBand', file: 'src/components/grid/VirtualizedGrid.tsx', line: 627, desc: 'Ẩn toàn bộ các cột thuộc nhóm tầng 1' },
    { name: 'handleScrollToTop', file: 'src/components/grid/VirtualizedGrid.tsx', line: 777, desc: 'Cuộn tức thì lên dòng đầu tiên của bảng' },
    { name: 'handleScrollToBottom', file: 'src/components/grid/VirtualizedGrid.tsx', line: 785, desc: 'Cuộn tức thì xuống dòng cuối cùng của bảng' },
    { name: 'handleColumnContextMenu', file: 'src/components/grid/VirtualizedGrid.tsx', line: 879, desc: 'Mở menu chuột phải trên tiêu đề cột con hoặc cột độc lập' },
    { name: 'handleBandContextMenu', file: 'src/components/grid/VirtualizedGrid.tsx', line: 903, desc: 'Mở menu chuột phải trên tiêu đề nhóm tầng 1 (Band Menu)' },
    { name: 'handleCellContextMenu', file: 'src/components/grid/VirtualizedGrid.tsx', line: 928, desc: 'Mở menu chuột phải trên cell của dòng dữ liệu (Row/Cell Menu)' },
    { name: 'handleFilterByValue', file: 'src/components/grid/VirtualizedGrid.tsx', line: 973, desc: 'Hàm chuẩn hóa lọc theo giá trị cell: gọi createEqualsFilter(val) và chuyển trực tiếp lên dòng filter của cột' },
    { name: 'handleGroupContextMenu', file: 'src/components/grid/VirtualizedGrid.tsx', line: 986, desc: 'Mở menu ngữ cảnh chuột phải trên dòng tiêu đề nhóm (Group Header Row Menu)' },
    { name: 'handleKeyDown', file: 'src/components/grid/VirtualizedGrid.tsx', line: 486, desc: 'Điều hướng phím trên Grid' },
    { name: 'toggleFullscreen', file: 'src/components/grid/VirtualizedGrid.tsx', line: 475, desc: 'Bật/tắt chế độ toàn màn hình Grid (Alt + Shift + F khi bật FullscreenModule)' },
    { name: 'useColumnResize', file: 'src/components/grid/hooks/useColumnResize.ts', line: 22, desc: 'Hook mỏng kéo dãn độ rộng cột qua dynamic import `columnResizeEngine.ts`' },
    { name: 'startColumnResizeSession', file: 'src/components/grid/hooks/columnResizeEngine.ts', line: 13, desc: 'Engine DOM 120fps Viewport-Culled cập nhật trực tiếp biến CSS `--agv-col-w-*` & đồng bộ state khi mouseup' },
    { name: 'useColumnAutoFit', file: 'src/components/grid/hooks/useColumnAutoFit.ts', line: 35, desc: 'Custom hook vừa độ rộng tối ưu: đo chữ canvas lazy `calcColAutoFitWidth`, bảo toàn tổng nhóm và tổng bảng' },
    { name: 'useInCellEditor', file: 'src/components/grid/hooks/useInCellEditor.ts', line: 10, desc: 'Custom hook mỏng chỉnh sửa ô in-cell (`activeEditingCell`, `handleStartEditCell`, `handleEndEditCell`)' },
    { name: 'useGridKeyboardNav', file: 'src/components/grid/hooks/useGridKeyboardNav.ts', line: 22, desc: 'Custom hook điều hướng bàn phím trên Grid (ArrowUp, ArrowDown, PageUp, PageDown, Space) giữ cố định listener qua keyNavStateRef' },
    { name: 'useGridSortFlipAnimation', file: 'src/components/grid/hooks/useGridSortFlipAnimation.ts', line: 30, desc: 'Custom hook điều phối hiệu ứng trượt dòng FLIP khi Sort (gọi lazy `sortFlipEngine.ts`)' },
    { name: 'ensureDatePickerStyles', file: 'src/components/ui/datepicker/datePickerStyles.ts', line: 3, desc: 'Hàm inject style keyframes và biến CSS cho DatePicker suite, đối chiếu và cập nhật style.textContent khi cssText thay đổi (HMR-safe) và tự gọi ngay khi nạp module' },
    { name: 'GridTabletRow', file: 'src/components/grid/responsive/GridTabletRow.tsx', line: 20, desc: 'Component render dòng cho Tablet: Bảng gộp trường đa tầng 4 cụm cột, trích xuất chuẩn col_id ("Mã Dòng"), ẩn/hiện STT và Checkbox theo showRowNumber/showSelectionCol đồng bộ với PC, 68px, tích hợp TwelveMonthChartCell mini 22px, STT nền accent chữ trắng khi focus' },
    { name: 'GridPhoneCard', file: 'src/components/grid/responsive/GridPhoneCard.tsx', line: 23, desc: 'Component render thẻ card cho Phone: Thẻ độc lập chuẩn kích thước 96px slot 104px (246px khi mở rộng) bọc trong .agv-phone-card-slot triệt tiêu hoàn toàn margin collapse và khoảng hở 84px giữa các chunk, khoảng cách đều 8px, ẩn/hiện STT và Checkbox theo showRowNumber/showSelectionCol đồng bộ với PC, cố định mở rộng 150px, tích hợp TwelveMonthChartCell 48px Catmull-Rom spline' },
    { name: 'ResponsiveChunkRow', file: 'src/components/grid/responsive/ResponsiveChunkRow.tsx', line: 26, desc: 'Chunk lazy bridge render GridTabletRow / GridPhoneCard tách khỏi GridChunkBlock' },
    { name: 'GridTabletHeader', file: 'src/components/grid/responsive/GridTabletHeader.tsx', line: 8, desc: 'Thanh tiêu đề 4 siêu cột chuẩn hóa cho Tablet (34px), tích hợp nút mở modal Lọc & Sắp Xếp, ẩn/hiện nhãn TT theo showRowNumber/showSelectionCol, 100% theme CSS variables' },
    { name: 'GridResponsiveHeader', file: 'src/components/grid/responsive/GridResponsiveHeader.tsx', line: 5, desc: 'Header responsive hợp nhất cho Tablet/Phone: nút lọc & sắp xếp chuẩn theme CSS variables' },
    { name: 'ResponsiveSortFilterModal', file: 'src/components/grid/responsive/ResponsiveSortFilterModal.tsx', line: 148, desc: 'Drawer Lọc & Sắp xếp cạnh dưới (`bottom-0`) tối ưu Mobile chia 2 phân đoạn (`Tìm kiếm & Lọc` | `Sắp xếp`): đồng bộ 100% toán tử PC theo dạng cột (`text`, `number`, `date`, `time`) bằng thanh icon DevExtreme 1 hàng chia đều (`FilterOpIcon`, 0 cuộn ngang, 0 dropdown toán tử con, 0 tooltip `title=`), chuyển `Một giá trị` / `Nhiều giá trị` (tái sử dụng `SmartNumberFilterInput`, `NumberRangeFilterInput`, `AdvDatePicker`, `AdvDateRangePicker`, `TimeFilterInput`, `TimeRangeFilterInput`, `multiRanges` & De Morgan `multiValues`), Chip chọn phạm vi (`min-h-[36px]`), danh sách dọc các cột `min-h-[40px]`, footer `h-11 md:h-9`' },
    { name: 'useGridLayoutMode', file: 'src/components/grid/responsive/useGridLayoutMode.ts', line: 17, desc: 'Hook mỏng điều phối chế độ PC / Tablet / Phone: trả về `pc` ngay khi `enabled = false`, khi bật nạp lười `responsiveLayoutEngine.ts`' },
    { name: 'GRID_BREAKPOINTS', file: 'src/components/grid/responsive/responsiveLayoutEngine.ts', line: 3, desc: 'Ngưỡng kích thước màn hình Phone/Tablet/PC của Grid' },
    { name: 'resolveActiveModeWithHysteresis', file: 'src/components/grid/responsive/responsiveLayoutEngine.ts', line: 10, desc: 'Tính chế độ layout PC/Tablet/Phone kèm vùng đệm Hysteresis +-16px chống nhấp nháy ranh giới' },
    // --- Hằng Số Chuẩn Hóa Toàn Hệ Thống (Standard Enum-like Constants & Types) ---
    { name: 'PIN_POSITIONS', file: 'src/components/grid/types.ts', line: 23, desc: 'Hằng số danh mục vị trí ghim cột (NONE, LEFT, RIGHT, CENTER), loại bỏ hoàn toàn hardcode text' },
    { name: 'SORT_DIRECTIONS', file: 'src/components/grid/types.ts', line: 44, desc: 'Hằng số danh mục chiều sắp xếp dữ liệu (ASC, DESC), đồng bộ MorphSortIcon và sort pipeline' },
    { name: 'GRID_EDIT_MODES', file: 'src/components/grid/types.ts', line: 67, desc: 'Hằng số danh mục chế độ sửa ô trên lưới (VIEW, SINGLE_CLICK, DOUBLE_CLICK)' },
    { name: 'FORMULA_MODES', file: 'src/components/grid/types.ts', line: 89, desc: 'Hằng số danh mục phép tính công thức cột tháng (AVG, SUM, MIN, MAX)' },
    { name: 'MONTH_ANALYTICS_MODES', file: 'src/components/grid/types.ts', line: 100, desc: 'Hằng số danh mục chế độ hiển thị phân tích 12 tháng (THIRTEEN_COLS: 13cols, TWO_COLS: 2cols)' },
    { name: 'FILTER_OPS', file: 'src/components/grid/types.ts', line: 110, desc: 'Hằng số danh mục toán tử lọc toàn hệ thống (FILTER_OPS.<OP>), loại bỏ 100% hardcode chuỗi text' },
    { name: 'FILTER_MODES', file: 'src/components/grid/types.ts', line: 133, desc: 'Hằng số danh mục chế độ lọc dữ liệu (SIMPLE, CHECKLIST, MULTI) của cột' },
    { name: 'CHECK_FILTER_STATES', file: 'src/components/grid/types.ts', line: 143, desc: 'Hằng số danh mục trạng thái lọc của cột Checkbox (ALL, CHECKED, UNCHECKED)' },
    { name: 'EDITOR_TYPES', file: 'src/components/grid/types.ts', line: 163, desc: 'Hằng số danh mục kiểu control sửa ô (TEXT, NUMBER, DATE, DATERANGE, TIME, COMBOBOX, LOOKUP)' },
    { name: 'DATA_TYPES', file: 'src/components/grid/types.ts', line: 177, desc: 'Hằng số danh mục kiểu dữ liệu cột chuẩn toàn hệ thống (TEXT, NUMBER, DATE, TIME, SYSTEM)' },
    { name: 'ALIGNMENTS', file: 'src/components/grid/types.ts', line: 189, desc: 'Hằng số danh mục canh lề hiển thị của ô (LEFT, CENTER, RIGHT)' },
    { name: 'CONTEXT_MENU_TYPES', file: 'src/components/grid/types.ts', line: 235, desc: 'Hằng số danh mục phân loại menu ngữ cảnh chuột phải (HEADER, ROW, BAND, GROUP) dùng chung giữa types & ColumnContextMenu' },
    { name: 'Design Tokens (PNT + agv)', file: 'tailwind.config.js', line: 12, desc: 'Bảng màu & Design Tokens đồng bộ D:\\Dự án\\b2b-pnt (`brand`, `primary`, `control`, `surface`, `status`, `table-header`, `--agv-*`) với helper `color-mix` hỗ trợ opacity modifier trên Tailwind v3' },
    { name: 'CONTROL_SURFACE_CLASS / CONTROL_BOX_CLASS', file: 'src/components/ui/controlFocus.ts', line: 24, desc: 'Hợp đồng nguồn đơn CSS classes cho toàn hệ thống (`agv-control`, `agv-control-box`, `getControlSizeClass`, `CONTROL_INPUT_SM/MD_CLASS`, `CONTROL_BUTTON_*`, `BUTTON_FOCUS_VISIBLE_CLASS="agv-focus-ring"`); phần hover/focus/open/invalid/button unlayered nằm ở cuối `src/index.css`' },
    { name: 'AdvButton / Button & getButtonClass (4-Variant Button Standard)', file: 'src/components/ui/AdvButton.tsx', line: 22, desc: 'Component `<AdvButton>` (`Button` alias, dòng 22 & 51) và helper `getButtonClass` / `buttonVariants` (`src/components/ui/controlFocus.ts` dòng 68 & 131): chuẩn hóa toàn bộ nút hành động hệ thống chỉ quanh 4 biến thể `default` | `outline` | `ghost` | `destructive` với `size` (`sm`, `default`, `md`, `icon-sm`, `icon`) và `active` (`data-active="true"`)' },
    { name: 'PageShell', file: 'src/components/shared/PageShell.tsx', line: 11, desc: 'Khung trang nền `--background` & header chuẩn b2b-pnt' },
    { name: 'ListPagePanel', file: 'src/components/shared/ListPagePanel.tsx', line: 11, desc: 'Panel chính nền `--card` (`border-y bg-card sm:rounded-xl sm:border sm:shadow-sm`) bọc bảng & thanh lọc' },
    { name: 'StatusBadge', file: 'src/components/shared/StatusBadge.tsx', line: 31, desc: 'Badge trạng thái semantic (success | danger | muted | warning | info | brand)' },
    { name: 'StatusTabs', file: 'src/components/shared/StatusTabs.tsx', line: 22, desc: 'Thanh tab lọc với đường gạch chân Gold active (`border-b-2 border-brand-gold text-brand-gold-on-light`)' },
    { name: 'QUERY_COMBINATORS', file: 'src/components/grid/floating/types.ts', line: 17, desc: 'Hằng số danh mục toán tử kết hợp cây điều kiện (AND, OR) trong Query Builder' },
    { name: 'TOOLBAR_POPUPS', file: 'src/components/grid/floating/types.ts', line: 42, desc: 'Hằng số định danh popup thanh công cụ nổi (SEARCH, QUERY_BUILDER, COLUMN_CHOOSER, SETTINGS)' },
    { name: 'ALIGN_TEXT_CLASSES', file: 'src/components/grid/gridFormatUtils.ts', line: 184, desc: 'Bản đồ lớp CSS căn chỉnh văn bản Tailwind (text-left, text-center, text-right) từ ALIGNMENTS' },
    { name: 'getAlignTextClass', file: 'src/components/grid/gridFormatUtils.ts', line: 190, desc: 'Hàm helper trả về class CSS text-align chuẩn từ ColumnAlign, mặc định text-left' },
    { name: 'ALIGN_JUSTIFY_CLASSES', file: 'src/components/grid/gridFormatUtils.ts', line: 194, desc: 'Bản đồ lớp CSS căn chỉnh Flexbox Tailwind (justify-start, justify-center, justify-end) từ ALIGNMENTS' },
    { name: 'getAlignJustifyClass', file: 'src/components/grid/gridFormatUtils.ts', line: 200, desc: 'Hàm helper trả về class CSS justify chuẩn từ ColumnAlign, mặc định justify-start' },
    { name: 'isNoInputFilterOp', file: 'src/components/grid/gridFormatUtils.ts', line: 204, desc: 'Hàm helper kiểm tra toán tử không cần giá trị nhập liệu (is_empty, is_not_empty, is_positive, is_negative)' },
    { name: 'isBetweenFilterOp', file: 'src/components/grid/gridFormatUtils.ts', line: 214, desc: 'Hàm helper kiểm tra toán tử nằm trong khoảng (between)' },
    { name: 'isNegativeFilterOp', file: 'src/components/grid/gridFormatUtils.ts', line: 218, desc: 'Hàm helper kiểm tra toán tử phủ định (not_equals, not_contains)' },
    { name: 'createColumnFilter', file: 'src/components/grid/gridFormatUtils.ts', line: 272, desc: 'Hàm tiện ích chuẩn hóa khởi tạo ColumnFilterValue với toán tử (mặc định FILTER_OPS.EQUALS) và giá trị string' },
    { name: 'createEqualsFilter', file: 'src/components/grid/gridFormatUtils.ts', line: 282, desc: 'Hàm factory tiện ích tạo cấu hình lọc theo giá trị bằng (=) chuẩn hóa' },
    { name: 'handleScroll', file: 'src/components/grid/VirtualizedGrid.tsx', line: 1283, desc: 'Xử lý cuộn dọc và cuộn ngang, cập nhật virtualScrollTop và chunk buffer (`visibleChunksMap` dòng 1378, `useImperativeHandle` dòng 1474)' },

    // --- src/components/grid/GridHeader.tsx ---
    { name: 'GridHeader', file: 'src/components/grid/GridHeader.tsx', line: 42, desc: 'Component thanh tiêu đề 1 hoặc 2 tầng hỗ trợ renderHeader(), nhóm cột (`middleElements`), ghim vị trí, lazy sort morph icon và context menu' },
    { name: 'GridHeader_renderHeaderCellContent', file: 'src/components/grid/GridHeader.tsx', line: 204, desc: 'Render nội dung ô tiêu đề cho cả 4 vùng ghim Trái / Giữa (`middleElements` dòng 114) / Phải với `LazyHeaderSortMorphIcon`' },

    // --- src/components/grid/GridFilterRow.tsx, lazy Filter Inputs & FilterIcons.tsx ---
    { name: 'AdvChecklistFilterPopup',
      file: 'src/components/grid/AdvChecklistFilterPopup.tsx',
      line: 165,
      desc: 'Popup lọc danh sách giá trị phân biệt: Tối ưu 0ms phản hồi với distinctValuesCacheRef, ảo hóa 20 items, tìm kiếm không dấu'
    },
    {
      name: 'GridFilterRow', file: 'src/components/grid/GridFilterRow.tsx', line: 67, desc: 'Dòng lọc trực tiếp sticky (`./filterRow.css`): lazy-load `GridDateFilterCell`, `GridTimeFilterInputs`, `GridSmartNumberInputs`, `AdvMultiFilterPopup`, `AdvCriteriaSummaryPopup`, dùng `GridSelectionCheckbox` & Portal operator menu' },
    { name: 'GridSelectionCheckbox', file: 'src/components/grid/GridSelectionCheckbox.tsx', line: 8, desc: 'Checkbox chọn dòng siêu nhẹ tách `MorphCheckbox` khỏi cold bundle của `DataGrid` và `GridFilterRow`' },
    { name: 'GridDateFilterCell', file: 'src/components/grid/GridDateFilterCell.tsx', line: 16, desc: 'Ô lọc ngày (`AdvDatePicker`) tách khỏi `GridFilterRow` để lazy-load chỉ khi bảng có cột DATE' },
    { name: 'NumberRangeFilterInput', file: 'src/components/grid/GridSmartNumberInputs.tsx', line: 55, desc: 'Ô lọc khoảng số [Từ .. Đến] hỗ trợ phím tắt `k`/`m`/`tr`/`b`/`ty`, tách `React.lazy` khỏi `GridFilterRow`' },
    { name: 'SmartNumberFilterInput', file: 'src/components/grid/GridSmartNumberInputs.tsx', line: 165, desc: 'Ô lọc số thông minh (tự format hàng nghìn, shortcut k/m/tr), tách `React.lazy` khỏi `GridFilterRow`' },
    { name: 'AdvCriteriaSummaryPopup', file: 'src/components/grid/AdvCriteriaSummaryPopup.tsx', line: 30, desc: 'Popup tập hợp tiêu chí tinh gọn (Segmented Chip layout, bỏ header thừa và nút đóng, tái nhấn nút để tắt, Tìm giá trị theo và Cây điều kiện không dùng tag xanh, chỉ hiện danh mục có tiêu chí, xóa từng mục riêng lẻ hoặc xóa tất cả, neo dưới ô STT dòng lọc, 100% theme CSS variables, min-height 28px)' },
    { name: 'AdvMultiFilterPopup', file: 'src/components/grid/AdvMultiFilterPopup.tsx', line: 26, desc: 'Popup lọc nhiều điều kiện OR / AND (IN / NOT IN clause) khi chuột phải vào ô filter: Menu toán tử đưa ra ngoài Portal body tránh cắt mép, logic loại trừ phủ định AND De Morgan cho toán tử Khác (≠) và Không chứa, xóa dòng đếm trung gian tránh trùng lặp text với footer, khống chế max-h kéo dọc textarea (max 220px) và popup viewport safety, Richtextbox nhận diện đa từ khóa cho text, 2 tab dán số & nhiều khoảng số cho number, date tự động theo toán tử, min-h 28px, zero autofill, data-agv-popup="true" scroll lock' },
    { name: 'TimeRangeFilterInput', file: 'src/components/grid/GridTimeFilterInputs.tsx', line: 10, desc: 'Bộ lọc dải giờ phút [Từ HH:mm — Đến HH:mm] tách lazy khỏi GridFilterRow: 2 ô nhập chuẩn hóa thời gian, zero autofill, min-h 28px' },
    { name: 'TimeFilterInput', file: 'src/components/grid/GridTimeFilterInputs.tsx', line: 108, desc: 'Bộ lọc giờ phút đơn lẻ (HH:mm) tách lazy khỏi GridFilterRow cho =, !=, >=, <=, có chứa: Tự động format HH:mm khi blur, zero autofill, min-h 28px' },
    { name: 'FilterOpIcon', file: 'src/components/grid/FilterIcons.tsx', line: 351, desc: 'Component render biểu tượng toán tử lọc SVG chuẩn DevExtreme với stroke=currentColor tự động theo theme và focus' },
    { name: 'getAllowedFilterOpsForColumn', file: 'src/components/grid/FilterIcons.tsx', line: 368, desc: 'Hàm DUY NHẤT toàn hệ thống trả về danh sách toán tử lọc chuẩn cho 1 cột, đồng bộ 100% giữa GridFilterRow và AdvGridQueryBuilderModal, tự lọc bỏ is_empty & is_not_empty khi cột không có ô trống' },
    { name: 'getDefaultFilterOpForColumn', file: 'src/components/grid/gridFormatUtils.ts', line: 246, desc: 'Hàm trả về toán tử mặc định cho 1 cột (tách sang `gridFormatUtils.ts` & re-export từ `FilterIcons.tsx`)' },

    // --- src/components/grid/GridRow.tsx, colRenderMeta.ts & editors/GridInCellEditor.tsx ---
    { name: 'buildColRenderMetas', file: 'src/components/grid/colRenderMeta.ts', line: 40, desc: 'Tạo sẵn metadata cột (`stickySide`, `stickyOffset`, `dividerClass`, `alignTextClass`) chuẩn hóa giữa `GridChunkBlock` và `GridRow`' },
    { name: 'GridRow', file: 'src/components/grid/GridRow.tsx', line: 73, desc: 'Fast row renderer dùng `ColRenderMeta`, row-level event delegation, sticky cells, `col.valueGetter`, tải lười `LazyGridGroupHeaderRow` & `LazyGridInCellEditor` qua `<Suspense>` (`GridRowProps` dòng 24)' },
    { name: 'CellEditor', file: 'src/components/grid/editors/GridInCellEditor.tsx', line: 15, desc: 'Component input chỉnh sửa ô in-cell dạng text/số: Tự động focus, bôi đen toàn bộ văn bản khi mở, Enter/Tab lưu, Escape hủy, zero autofill' },
    { name: 'DateCellEditor', file: 'src/components/grid/editors/GridInCellEditor.tsx', line: 108, desc: 'Component chỉnh sửa ô ngày in-cell: Tích hợp AdvDatePicker với showPreset={false} (ẩn mốc nhanh), kết nối min/max dữ liệu cột' },
    { name: 'DateRangeCellEditor', file: 'src/components/grid/editors/GridInCellEditor.tsx', line: 140, desc: 'Component chỉnh sửa ô dải ngày in-cell: Tích hợp AdvDateRangePicker với showPreset={false} (ẩn mốc nhanh), kết nối min/max dữ liệu cột' },
    { name: 'TimeCellEditor', file: 'src/components/grid/editors/GridInCellEditor.tsx', line: 197, desc: 'Component chỉnh sửa ô giờ in-cell (HH:mm): Nhập 2 số giờ tự nhảy phút, phím mũi tên tăng giảm, Enter/Click outside lưu, Esc hủy, zero autofill, min-h 28px' },
    { name: 'GridInCellEditor', file: 'src/components/grid/editors/GridInCellEditor.tsx', line: 355, desc: 'Router chọn editor in-cell (Date/DateRange/Time/ComboBox/LookUp/Text) tách chunk lazy khỏi GridRow' },

    // --- src/components/ui/AdvDatePicker.tsx & src/components/ui/datepicker/* ---
    { name: 'AdvDatePicker', file: 'src/components/ui/AdvDatePicker.tsx', line: 114, desc: 'Component chọn ngày/giờ đơn chuẩn PNT B2B & DevExpress: size="md" dùng var(--control-height) (36px), mặc định/sm 28px cho ô lọc, tích hợp mốc nhanh, đồng bộ PNT Light/Dark CSS tokens, min-h 28px' },
    { name: 'AdvDateRangePicker', file: 'src/components/ui/datepicker/AdvDateRangePicker.tsx', line: 54, desc: 'Component chọn dải ngày kép (Từ ngày - Đến ngày): size="md" cao 36px cho filter bar, default/sm 28px cho in-cell/grid filter, lịch đôi, swap ngày thông minh, đồng bộ PNT Light/Dark, min-h 28px' },
    { name: 'AdvDatePresetSelect', file: 'src/components/ui/datepicker/AdvDatePresetSelect.tsx', line: 48, desc: 'Component dropdown mốc nhanh: Tuần đến hiện tại (46->1) + Mốc theo năm, size="md" vs sm/xs, active dùng `--surface-selected` + vạch Gold (`--brand-gold`)' },
    { name: 'AdvDevExpressCalendarBody', file: 'src/components/ui/datepicker/AdvCalendarPrimitives.tsx', line: 104, desc: 'Component ma trận lịch Ngày/Tháng/Năm phong cách DevExpress hỗ trợ điều hướng thập kỷ, tháng và ngày' },
    { name: 'TimePickerBlock', file: 'src/components/ui/datepicker/AdvCalendarPrimitives.tsx', line: 19, desc: 'Component khối nhập giờ:phút (HH:mm) tích hợp NO_AUTOFILL_PROPS dùng chung cho lịch đơn và lịch kép' },
    { name: 'formatGridDateValue', file: 'src/components/ui/datepicker/datePickerUtils.ts', line: 207, desc: 'Bản gốc định dạng ngày trong datePickerUtils (Grid ưu tiên dùng `gridFormatUtils.ts` để không kéo AdvDatePicker)' },
    { name: 'getISOWeekAndYear', file: 'src/components/ui/datepicker/datePickerUtils.ts', line: 462, desc: 'Hàm xác định số tuần ISO (1-53) và năm ISO tương ứng với một Date' },
    { name: 'getISOWeekDateRange', file: 'src/components/ui/datepicker/datePickerUtils.ts', line: 477, desc: 'Hàm tính khoảng ngày Thứ 2 -> Chủ nhật (YYYY-MM-DD) cho tuần ISO trong năm ISO' },

    // --- src/components/grid/GridFloatingToolbar.tsx & floating suite ---
    { name: 'GridFloatingToolbar', file: 'src/components/grid/GridFloatingToolbar.tsx', line: 36, desc: 'Thanh công cụ nổi cạnh trái (`floatingToolbar.css`): lazy-load `AdvQuickFilterFlyout`, `AdvMultiSortPopup`, `AdvGridQueryBuilderModal`, `AdvColumnChooserModal` kèm hover preload, clamp kẹp biên trong Grid' },
    { name: 'AdvQuickFilterFlyout', file: 'src/components/grid/floating/AdvQuickFilterFlyout.tsx', line: 15, desc: 'Popup 1: Ô tìm kiếm nhanh dạng flyout sang trái với nút bật/tắt Smart search, debounce 250ms, autoFocus, Esc đóng' },
    { name: 'AdvGridQueryBuilderModal', file: 'src/components/grid/floating/AdvGridQueryBuilderModal.tsx', line: 273, desc: 'Popup 2: Bộ lọc nâng cao cây điều kiện lồng nhau VÀ/HOẶC (`queryBuilder.css`), ẩn chữ ô toán tử (iconOnly), AdvMultiFilterPopup, nạp mẫu CMD' },
    { name: 'QueryCustomSelect', file: 'src/components/grid/floating/AdvGridQueryBuilderModal.tsx', line: 79, desc: 'Component Dropdown tùy chỉnh cho Query Builder: hỗ trợ iconOnly ẩn chữ hiển thị icon SVG gọn gàng, dropitem hover 0ms chuẩn theme (min-h 28px, hover/active nền màu chữ trắng, checkmark ✓), hỗ trợ showSearch bật/tắt ô tìm kiếm, tự đóng click outside' },
    { name: 'AdvColumnChooserModal', file: 'src/components/grid/floating/AdvColumnChooserModal.tsx', line: 25, desc: 'Popup 3: Tùy chọn cột ẩn/hiện (`columnChooser.css`), ghim cột, tìm kiếm tên cột, kéo thả đổi thứ tự, phục hồi mặc định' },
    { name: 'hasActiveQueryRules', file: 'src/components/grid/floating/queryRuleCheck.ts', line: 27, desc: 'Helper siêu nhẹ kiểm tra QueryGroup có rule active mà không kéo `queryUtils.ts` vào cold bundle' },
    { name: 'evaluateQueryTreeNode', file: 'src/components/grid/floating/queryUtils.ts', line: 149, desc: 'Hàm lượng giá cây điều kiện lồng nhau cho 300,000 dòng dữ liệu siêu tốc (nạp lười via dynamic import trong `DataGrid.tsx`)' },
    { name: 'parseCmdToQueryTree', file: 'src/components/grid/floating/queryUtils.ts', line: 323, desc: 'Bộ phân tích cú pháp chuỗi lệnh CMD tự nhiên thành Cây điều kiện QueryGroup, hỗ trợ ngoặc đơn lồng nhau, toán tử so sánh, giấu 100% tên trường backend' },
    { name: 'validateQueryTreeAgainstColumns', file: 'src/components/grid/floating/queryUtils.ts', line: 292, desc: 'Kiểm tra tính hợp lệ của cây điều kiện so với danh sách cột thực tế của bảng dữ liệu' },

    // --- src/components/ui/AdvComboBoxEdit.tsx, AdvSearchLookUpEdit.tsx, useVirtualList.ts & AdvOverlayScroll.tsx ---
    { name: 'AdvComboBoxEdit', file: 'src/components/ui/AdvComboBoxEdit.tsx', line: 55, desc: 'Hộp chọn ComboBoxEdit chuẩn PNT B2B & Animate UI: `useVirtualList` giữ cửa sổ ảo gọn kể cả khi đóng, `optionIndexMap` O(1), cache tìm kiếm lười `searchCacheRef`, gõ tìm realtime cả `allowCustomInput={false|true}`, `size="md"` `h-9`, Gold 2px, `isKeyboardNav`, min-h 28px, zero autofill' },
    { name: 'AdvSearchLookUpEdit', file: 'src/components/ui/AdvSearchLookUpEdit.tsx', line: 105, desc: 'Trigger gọn nhẹ bảng tra cứu LookUp nhiều cột chuẩn PNT B2B (`h-9`, `rowByKeyMap` O(1), lọc 1 lượt + `searchCacheRef`, short-circuit `isAllFilteredSelected`, lazy-load `AdvSearchLookUpPopup`, NO_AUTOFILL_PROPS)' },
    { name: 'useVirtualList', file: 'src/components/ui/useVirtualList.ts', line: 55, desc: 'Hook ảo hóa cửa sổ dọc cố định chiều cao dòng cho Select/ComboBox/LookUp: luôn giới hạn `range` theo `computeVirtualWindow` ngay cả khi `enabled=false`' },
    { name: 'AdvOverlayScroll', file: 'src/components/ui/AdvOverlayScroll.tsx', line: 34, desc: 'Vùng cuộn thanh cuộn nổi hiện khi hover/scroll: có `syncedInCommitRef` tránh `scheduleSync()` rAF trùng lặp trong cùng commit' },
    { name: 'AdvSearchLookUpPopup', file: 'src/components/ui/AdvSearchLookUpPopup.tsx', line: 62, desc: 'Popup Portal LookUp tách chunk lazy khỏi `AdvSearchLookUpEdit`: `pinnedOpenKeys`, `<MorphCheckbox />`, Filter Row, hover 0ms, `isKeyboardNav`, `table-fixed`' },
    { name: 'Drawer (AdvDrawer)', file: 'src/components/ui/AdvDrawer.tsx', line: 60, desc: 'Bộ primitives Bottom Sheet Drawer chuẩn shadcn/ui Base UI & b2b-pnt: Phone full-width, Tablet md:max-w-lg (512px), max-h 90dvh, DrawerSwipeHandle 48x6 vuốt đóng, z-[10000], nền đặc var(--popup-background), mở khóa cuộn Grid tức thì khi đóng' },

    // --- src/components/grid/GridChunkBlock.tsx ---
    { name: 'GridChunkBlock', file: 'src/components/grid/GridChunkBlock.tsx', line: 63, desc: 'Khối chứa 20 dòng ảo hóa GPU translate3d (`GridChunkBlockProps` dòng 20): render GridRow trên PC, tải lười LazyResponsiveChunkRow khi responsive mode, bảo toàn editing & onGroupContextMenu' },

    // --- src/components/grid/ColumnContextMenu.tsx ---
    { name: 'ColumnContextMenu', file: 'src/components/grid/ColumnContextMenu.tsx', line: 77, desc: 'Menu ngữ cảnh chuột phải 4 phạm vi (HEADER 225, BAND 659, GROUP 783, ROW): tái sử dụng `CONTEXT_MENU_TYPES` từ `./types`, export default cho React.lazy' },
    { name: 'renderPinButtons', file: 'src/components/grid/ColumnContextMenu.tsx', line: 183, desc: 'Helper dùng chung cho Header & Band menu: tách biệt nút Ghim trái/phải (`enableColumnPinning`) và Ghim giữa (`enableCenterDock`)' },
    { name: 'renderHeaderMenu', file: 'src/components/grid/ColumnContextMenu.tsx', line: 225, desc: 'Nhánh menu HEADER: Ghim trái/phải vs Giữa độc lập, Vừa nội dung, Ẩn/Hiện cột (`hideable`), Nhóm theo cột (`groupable`)' },
    { name: 'renderBandMenu', file: 'src/components/grid/ColumnContextMenu.tsx', line: 659, desc: 'Nhánh menu BAND tầng 1: Ghim nhóm (theo cờ Trái/Phải vs Giữa), Vừa nội dung nhóm, Ẩn nhóm' },
    { name: 'renderGroupMenu', file: 'src/components/grid/ColumnContextMenu.tsx', line: 783, desc: 'Nhánh menu GROUP & ROW: Thu gọn/Mở rộng/Hủy nhóm, Sao chép ô/dòng/bảng, Lọc nhanh giá trị, Cuộn lên/xuống' },

    // --- src/components/ui/MorphCheckbox.tsx & MorphIcons.tsx ---
    { name: 'MorphCheckbox', file: 'src/components/ui/MorphCheckbox.tsx', line: 33, desc: 'Control checkbox Morph Line thuần SVG CSS-keyframe (`viewBox="0 0 13 10"`, 3 trạng thái, hitbox >= 28px), 0 dependency `morphicons`/`lucide`' },
    { name: 'AdvCheckbox', file: 'src/components/grid/AdvCheckbox.tsx', line: 23, desc: 'Component Checkbox chuẩn toàn hệ thống kế thừa MorphCheckbox Morph Line, hỗ trợ indeterminate, disabled, 100% theme CSS variables' },
    { name: 'MorphIcon', file: 'src/components/ui/MorphIcons.tsx', line: 14, desc: 'Re-export wrapper cho thư viện morphicons (`MorphIcons.tsx` giữ 6 icon Lucide; `GridHeader`/`GridRow` lazy-load qua `GridMorphPrimitives.tsx`)' },
    { name: 'HeaderSortMorphIcon', file: 'src/components/grid/GridMorphPrimitives.tsx', line: 16, desc: 'Bridge lazy cho `MorphSortIcon` dùng ở `GridHeader`' },
    { name: 'RowGroupChevronMorphIcon', file: 'src/components/grid/GridMorphPrimitives.tsx', line: 40, desc: 'Bridge lazy cho `MorphChevronIcon` dùng ở `GridRow`' },
    { name: 'MorphActionIcon', file: 'src/components/ui/MorphIcons.tsx', line: 24, desc: 'Nút icon biến hình theo trạng thái active/inactive' },
    { name: 'MorphSortIcon', file: 'src/components/ui/MorphIcons.tsx', line: 47, desc: 'Icon sắp xếp header biến hình lò xo ArrowUp <-> ArrowDown snappy' },
    { name: 'MorphChevronIcon', file: 'src/components/ui/MorphIcons.tsx', line: 71, desc: 'Icon đóng mở nhóm dòng biến hình lò xo ChevronRight <-> ChevronDown bouncy' },

    // --- src/components/ui/ (Animate UI Primitives Suite) ---
    { name: 'AdvPopover', file: 'src/components/ui/AdvPopover.tsx', line: 26, desc: 'Primitive Popover chuẩn Animate UI (Base UI): trigger click toggle, tính tọa độ đồng bộ với areEditorCoordsEqual chống setCoords thừa khi scroll, Portal document.body, spring animation agv-spring-down/up, flip-up thông minh, useClickOutside bỏ qua portal con (`.agv-select-portal`), data-agv-popup="true" khóa cuộn bảng, 100% theme tokens' },
    { name: 'AdvSelect', file: 'src/components/ui/AdvSelect.tsx', line: 48, desc: 'Primitive Select chuẩn PNT B2B: `useVirtualList` (~14 DOM rows ngay khi mở) + `AdvOverlayScroll`, `optionIndexMap` O(1), trigger `border-control bg-control-surface` + `CONTROL_HOVER_CLASS` + `CONTROL_FOCUS_CLASS`/`CONTROL_POPUP_OPEN_CLASS` (`h-9`), backdrop `pointer-events-none` + `useClickOutside`, hover 0ms, Gold 2px, `isKeyboardNav`, min-h 28px, Portal' },
    { name: 'areEditorCoordsEqual', file: 'src/components/ui/enterpriseEditorUtils.ts', line: 63, desc: 'So sánh 2 object tọa độ popup {top, bottom, left, width, placement} để skip setCoords dư thừa khi scroll nội bộ hoặc chưa đổi vị trí' },
    { name: 'computeDropdownPageStep', file: 'src/components/ui/enterpriseEditorUtils.ts', line: 82, desc: 'Tính số dòng nhảy cho phím PageUp/PageDown theo chiều cao vùng cuộn dropdown (trừ sticky header nếu có)' },
    { name: 'computeNextHighlightedIndex', file: 'src/components/ui/enterpriseEditorUtils.ts', line: 101, desc: 'Tính index highlight kế tiếp chuẩn hóa cho ArrowDown/ArrowUp/PageDown/PageUp/Home/End (bỏ qua wrap ở PageDown/PageUp)' },
    { name: 'scrollDropdownItemIntoView', file: 'src/components/ui/enterpriseEditorUtils.ts', line: 136, desc: 'Cuộn container dropdown vừa đủ đưa item active vào khung nhìn (`topInsetPx` & `bottomInsetPx`), dùng `clientTop`/`clientHeight` và tự bù tỷ lệ `scaleY` của animation `.agv-spring-*` để không cắt mép dưới' },
    { name: 'useClickOutside', file: 'src/components/ui/enterpriseEditorUtils.ts', line: 165, desc: 'Hook đóng popup khi click ngoài & cập nhật tọa độ khi scroll/resize ngoài popup (bỏ qua scroll nội bộ popupRef/secondaryPopupRef & hỗ trợ `ignoreSelector` cho portal con, giữ callback qua ref ổn định listener)' },
    { name: 'normalizeSearchText', file: 'src/components/ui/enterpriseEditorUtils.ts', line: 226, desc: 'Chuẩn hóa chuỗi tìm kiếm tiếng Việt không dấu, có ASCII fast-path (`/[^\\x00-\\x7F]/`) bỏ qua NFD & regex khi chuỗi thuần ASCII' },
    { name: 'AdvHoverCard', file: 'src/components/ui/AdvHoverCard.tsx', line: 20, desc: 'Primitive Hover Card: mở khi rê chuột với openDelay 150ms và closeDelay 200ms chống nhấp nháy, useLayoutEffect + areEditorCoordsEqual đo kích thước trước paint, Portal document.body, agv-spring-up/down, kẹp biên màn hình, tự đóng khi cuộn trang' },
    { name: 'AdvTooltip', file: 'src/components/ui/AdvTooltip.tsx', line: 18, desc: 'Primitive Tooltip chuẩn Base UI Motion: Portal document.body, sửa lệch tọa độ bằng agv-spring-up/down + useLayoutEffect + areEditorCoordsEqual, tự động lật ngược, tự đóng khi cuộn' },

    // --- src/components/grid/gridStorage.ts & responsiveColumnUtils.ts ---
    { name: 'readGridStorageJson', file: 'src/components/grid/gridStorage.ts', line: 25, desc: 'Đọc JSON từ localStorage an toàn SSR (trả fallback nếu không có window/localStorage)' },
    { name: 'writeGridStorageJson', file: 'src/components/grid/gridStorage.ts', line: 36, desc: 'Ghi JSON vào localStorage an toàn SSR cô lập theo key gridId' },
    { name: 'getResponsiveDataColumns', file: 'src/components/grid/responsive/responsiveColumnUtils.ts', line: 16, desc: 'Lọc danh sách cột dữ liệu thuần (bỏ STT, Checkbox, DATA_TYPES.SYSTEM) dùng chung cho GridTabletHeader, GridTabletRow, GridPhoneCard' },
    { name: 'GridStatusBar', file: 'src/components/grid/GridStatusBar.tsx', line: 21, desc: 'Thanh phân trang đáy core Grid: AdvSelect chọn số dòng/trang (20/50/100/200), nút Trước/Sau (`ChevronLeft`/`ChevronRight`), ô nhập số trang (`NO_AUTOFILL_PROPS`), `/ {totalPages}` và khoảng dòng `start-end / totalItems`' },

    // --- src/components/grid/gridSimpleFilter.ts, gridFilterEngine.ts & gridGroupingEngine.ts ---
    { name: 'needsFullFilterEngine', file: 'src/components/grid/gridSimpleFilter.ts', line: 9, desc: 'Kiểm tra nhanh bộ lọc cột đang active có cần nạp lười `gridFilterEngine.ts` (range/multi/date/time/number) hay chạy fast-path đồng bộ' },
    { name: 'matchSimpleFilterSync', file: 'src/components/grid/gridSimpleFilter.ts', line: 38, desc: 'Động cơ lọc text/equals đồng bộ siêu nhẹ trên main thread giúp `DataGrid` không phải tải `gridFilterEngine` khi khởi tạo' },
    { name: 'matchFilterValue', file: 'src/components/grid/gridFilterEngine.ts', line: 83, desc: 'Động cơ lọc nâng cao tải lười (date, time, number, multiValues De Morgan, multiRanges) tách khỏi `DataGrid` initial bundle' },
    { name: 'buildGroupedDisplayModel', file: 'src/components/grid/gridGroupingEngine.ts', line: 68, desc: 'Xây dựng cấu trúc hiển thị dòng nhóm + tổng nhóm (tải lười chỉ khi `RowGroupingModule` được kích hoạt)' },
    { name: 'copyGroupTableToClipboard', file: 'src/components/grid/gridGroupingEngine.ts', line: 127, desc: 'Sao chép bảng tóm tắt nhóm vào clipboard (tách lazy cùng `gridGroupingEngine.ts`)' },
    { name: 'computeStickyGroupIndexAtTop', file: 'src/components/grid/gridGroupingEngine.ts', line: 157, desc: 'Tính chỉ số tiêu đề nhóm đang ghim đỉnh khi cuộn dọc' },

    // --- src/components/grid/TwelveMonthChartCell.tsx ---
    { name: 'FORMULA_CYCLE', file: 'src/components/grid/TwelveMonthChartCell.tsx', line: 17, desc: 'Chu kỳ xoay chế độ công thức thống kê (AVG -> SUM -> MIN -> MAX) di trú về module grid' },
    { name: 'FORMULA_META', file: 'src/components/grid/TwelveMonthChartCell.tsx', line: 24, desc: 'Metadata nhãn & style token badge theo từng FormulaMode (AVG/SUM/MIN/MAX)' },
    { name: 'TwelveMonthChartCell', file: 'src/components/grid/TwelveMonthChartCell.tsx', line: 110, desc: 'Biểu đồ Sparkline 12 tháng: Sóng Catmull-Rom spline, tích hợp Animate UI Tooltip qua Portal (agv-tooltip-spring-up/down, boxShadow var(--popup-shadow)), đổi màu theo cực trị, SVG arrow, tự đóng khi cuộn' },

    // --- src/App.tsx, src/themes/common.ts, src/components/ui & src/pages/UiPrimitivesPage.tsx ---
    { name: 'App', file: 'src/App.tsx', line: 122, desc: 'Shell điều hướng PNT B2B (Light/Dark/Liquid Glass) nạp lười `LoginPanel` & 5 trang con qua React.lazy: hỗ trợ hash query, phiên đăng nhập, `<LiquidGlassBackdrop />`, bật/tắt `.dark` & `.agv-liquid`' },
    { name: 'handleSelectPage', file: 'src/App.tsx', line: 153, desc: 'Chuyển trang tra cứu (countries/airports/partners/bookings/ui-test) đồng bộ URL hash và localStorage' },
    { name: 'handleToggleColorScheme', file: 'src/App.tsx', line: 165, desc: 'Chuyển nhanh chế độ Sáng / Tối PNT B2B và đồng bộ surfaceTheme (`light`/`dark`/`liquid-light`/`liquid-dark`)' },
    { name: 'handleToggleLiquidMode', file: 'src/App.tsx', line: 185, desc: 'Bật/tắt chế độ Liquid Glass (`agv_b2b_visual_mode`) và đồng bộ class `.agv-liquid`' },
    { name: 'isLiquidTheme', file: 'src/themes/common.ts', line: 103, desc: 'Kiểm tra theme có thuộc chế độ kính lỏng (liquid-light / liquid-dark / liquid / glass)' },
    { name: 'LiquidGlassBackdrop', file: 'src/components/shared/LiquidGlassBackdrop.tsx', line: 35, desc: 'Phông nền SVG bầu trời tầng bình lưu, biển mây Stratocumulus & tàu bay Quad-Jet 747-8 cho Liquid Glass Ngày/Đêm' },
    { name: 'AdvInput', file: 'src/components/ui/AdvInput.tsx', line: 24, desc: 'Ô nhập liệu `.agv-control` hỗ trợ `variant="default" | "auth"` (48px), `leadingIcon`, `endAdornment`, `invalid`, chặn autofill' },
    { name: 'AdvFormField', file: 'src/components/ui/AdvFormField.tsx', line: 46, desc: 'Wrapper nhãn trường nhập (`border` | `top`), tự đo bề rộng nhãn (`--agv-notch-w`) & render `.agv-field-notch-frame` cắt viền trên thật trong suốt' },
    { name: 'UiPrimitivesPage', file: 'src/pages/UiPrimitivesPage.tsx', line: 169, desc: 'Trang `Thử nghiệm UI`: kiểm thử controls Nhóm B, khối demo Border-Label Inputs (`AdvFormField` + `AdvInput`/`AdvSelect`/`AdvComboBoxEdit`/`AdvSearchLookUpEdit`/`AdvDatePicker`/`AdvDateRangePicker`) & `GridTableV2FeaturesDemo`' },

    // --- src/services/b2bAuth.ts & src/services/b2bApi.ts ---
    { name: 'apiCall', file: 'src/services/b2bAuth.ts', line: 161, desc: 'Fetch wrapper cho BE-CRM (tách về `b2bAuth.ts`): tự gắn Bearer token, single-flight RefreshToken khi 401 và chuẩn hóa envelope {Id, Message, Data}' },
    { name: 'loginAccount', file: 'src/services/b2bAuth.ts', line: 245, desc: 'Đăng nhập tài khoản BE-CRM qua /api/Auth/Login (hỗ trợ bước 2FA)' },
    { name: 'verifyTwoFaCode', file: 'src/services/b2bAuth.ts', line: 275, desc: 'Xác thực mã 2FA qua /api/Auth/Verify2FA' },
    { name: 'normalizePaged', file: 'src/services/b2bApi.ts', line: 150, desc: 'Chuẩn hóa dữ liệu phân trang từ nhiều biến thể payload BE-CRM' },
    { name: 'fetchCountriesPage', file: 'src/services/b2bApi.ts', line: 225, desc: 'Tải 1 trang danh sách Quốc gia theo `page`/`pageSize` và bộ lọc từ /api/Country/SearchList' },
    { name: 'fetchAirportsPage', file: 'src/services/b2bApi.ts', line: 283, desc: 'Tải trang danh sách Sân bay từ /api/AirPortInfo/SearchList (nếu filters.country có >=2 mã như "SA,AF,EG" thì tách bắn song song rồi gộp/cắt trang)' },
    { name: 'fetchAllAirports', file: 'src/services/b2bApi.ts', line: 374, desc: 'Tải toàn bộ danh sách sân bay (2.771 dòng) qua collectAllPages + fetchAirportsPage theo lô 5 trang x 200 dòng' },
    { name: 'fetchPartnersPage', file: 'src/services/b2bApi.ts', line: 466, desc: 'Tải 1 trang danh sách Đại lý theo `page`/`pageSize`, trạng thái & SalesUser từ /api/Partner/GetList' },
    { name: 'usePagedListQuery', file: 'src/pages/usePagedListQuery.ts', line: 80, desc: 'Shared hook quản lý phân trang server-side + LRU Page Cache 0ms (`page=1`, `pageSize=20`, `serverTotal`, `loading`, `error`, `refresh`, `apiLoadMs`, `renderStartRef`) cho các trang B2B-PNT' },
    { name: 'captureRuntimeTelemetry / useGridStageTelemetry / GridTelemetryLine', file: 'src/pages/gridPageTelemetry.tsx', line: 10, desc: 'Bộ đo hiệu năng runtime dùng chung cho các trang Grid: đo `Tải API` (ms), `Render bảng` (ms qua rAF + settle 120ms), `JS đã nạp` (kB/files), `RAM JS Heap` (MB) và `DOM trong bảng` (.agv-grid-root nodes)' },

    // --- src/components/grid/modules/, columns/, gridFeatures.ts, DataGrid.tsx ---
    { name: 'GRID_MODULE_IDS', file: 'src/components/grid/modules/index.ts', line: 1, desc: 'Danh mục 19 ID module tính năng Grid (`rowNumber`, `pagination`, `columnPinning`, `centerDock`, `rowPinning`, `responsiveLayout`, ...)' },
    { name: 'RowNumberModule', file: 'src/components/grid/modules/index.ts', line: 34, desc: 'Module hiển thị cột STT (`col_stt`)' },
    { name: 'ColumnPinningModule', file: 'src/components/grid/modules/index.ts', line: 37, desc: 'Module ghim cột Trái / Phải độc lập khỏi lõi PC read-only' },
    { name: 'CenterDockModule', file: 'src/components/grid/modules/index.ts', line: 41, desc: 'Module Dock giữa (tách riêng hoàn toàn khỏi ColumnPinningModule)' },
    { name: 'RowPinningModule', file: 'src/components/grid/modules/index.ts', line: 42, desc: 'Module ghim dòng (qua context menu hoặc `pinnedTopRowData`)' },
    { name: 'ResponsiveLayoutModule', file: 'src/components/grid/modules/index.ts', line: 82, desc: 'Module chuyển đổi tự động PC <-> Tablet <-> Phone (tách riêng khỏi PC read-only)' },
    { name: 'BasicViewModules', file: 'src/components/grid/modules/index.ts', line: 88, desc: 'Preset tối giản chỉ có `[RowNumberModule, PaginationModule]`' },
    { name: 'StandardGridModules', file: 'src/components/grid/modules/index.ts', line: 94, desc: 'Preset chuẩn B2B gồm 13 module (STT, Pagination, Summary, Pinning/CenterDock/RowPinning, Sort, Filter, Sizing, Chooser, Fullscreen, ContextMenu, Toolbar)' },
    { name: 'AllEnterpriseModules', file: 'src/components/grid/modules/index.ts', line: 111, desc: 'Preset đầy đủ 19 module (kèm QueryBuilder, RowSelection, RowGrouping, CellEditing, ResponsiveLayout)' },
    { name: 'toModuleIdSet', file: 'src/components/grid/modules/index.ts', line: 133, desc: 'Chuyển mảng `GridModule[]` thành `Set<GridModuleId>`' },
    { name: 'hasGridModule', file: 'src/components/grid/modules/index.ts', line: 145, desc: 'Kiểm tra một module có tồn tại trong `Set<GridModuleId>` hay không' },
    { name: 'createColumnHelper', file: 'src/components/grid/columns/createColumnHelper.ts', line: 27, desc: 'Factory kiểu TanStack Table v8 tạo cột typed `.accessor(...)`, `.display(...)`, `.group(...)`' },
    { name: 'normalizeGridColumns', file: 'src/components/grid/columns/normalizeColumns.ts', line: 159, desc: 'Chuẩn hóa `ColumnHelper*`/`ColumnDef`/nhóm lồng + `defaultColDef` thành `flatColumns` & `columnGroups` cho `DataGrid`' },
    { name: 'GRID_VARIANTS', file: 'src/components/grid/gridFeatures.ts', line: 8, desc: 'Enum preset chế độ Grid (`full` | `basic`)' },
    { name: 'resolveGridFeatures', file: 'src/components/grid/gridFeatures.ts', line: 107, desc: 'Single source of truth giải quyết `modules` (ưu tiên nếu truyền, mặc định `BasicViewModules`) kết hợp `variant` và từng cờ `enable*` riêng (`enableColumnPinning`, `enableCenterDock`, `enableRowPinning`, `enableCellEditing`, `enableResponsiveLayout`...)' },
    { name: 'useDataGridController', file: 'src/components/grid/DataGrid.tsx', line: 165, desc: 'Core controller hook tổng quát: dùng `gridSimpleFilter` fast-path + dynamic `gridFilterEngine`/`gridGroupingEngine`/`queryUtils`, không clone object khi không sort/edit, cache `getRowKeyAt`, hỗ trợ `modules`, `columns`/`columnDefs`/`defaultColDef`/`data`/`pagination`/`pinnedTopRowData`' },
    { name: 'DataGrid', file: 'src/components/grid/DataGrid.tsx', line: 2407, desc: 'Component thư viện `<DataGrid<TRecord> />` hỗ trợ `modules`, `createColumnHelper`, `defaultColDef`, `pagination`, `pinnedTopRowData`, `GridSelectionCheckbox`, lazy `LazyGridStatusBar` và hybrid server/client paging' },
    { name: 'LoginPanel', file: 'src/components/b2b/LoginPanel.tsx', line: 9, desc: 'Form đăng nhập BE-CRM 2 bước (tài khoản/mật khẩu và mã 2FA 6 số)' },

    // --- src/pages/CountriesPage.tsx, AirportsPage.tsx, PartnersPage.tsx, BookingsPage.tsx ---
    { name: 'CountriesPage', file: 'src/pages/CountriesPage.tsx', line: 38, desc: 'Trang tra cứu Quốc gia: cột `createColumnHelper<CountryRow>()` + `defaultColDef` + dòng `Đo thực tế` (`GridTelemetryLine`) + `<DataGrid gridId="b2b_countries" modules={[...StandardGridModules, QueryBuilderModule, ColumnChooserModule]} data={...} getRowId={...} pagination={...} />`' },
    { name: 'AirportsPage', file: 'src/pages/AirportsPage.tsx', line: 219, desc: 'Trang tra cứu 2.771 dòng Sân bay (`fetchAllAirports`): dùng `<DataGrid modules={BasicViewModules} />` (`mode=all|paged`) và thanh `Đo thực tế` (`useGridStageTelemetry` + `GridTelemetryLine`)' },
    { name: 'PartnersPage', file: 'src/pages/PartnersPage.tsx', line: 64, desc: 'Trang tra cứu Đại lý: 4 status tabs + cột `createColumnHelper<PartnerListItem>()` + `defaultColDef` + `<DataGrid gridId="b2b_partners" modules={StandardGridModules} data={...} getRowId={...} pagination={...} />`' },
    { name: 'BookingsPage', file: 'src/pages/BookingsPage.tsx', line: 97, desc: 'Trang tra cứu Đặt chỗ B2B: 7 status tabs + 14 cột phẳng qua `createColumnHelper<BookingListItem>()` (`valueGetter`) & `defaultColDef` + `<DataGrid gridId="b2b_bookings" modules={StandardGridModules} data={...} getRowId={...} pagination={...} />`' },
    { name: 'fetchBookingsPage', file: 'src/services/b2bApi.ts', line: 880, desc: 'Tải 1 trang danh sách Đặt chỗ B2B theo `page`/`pageSize` và bộ lọc từ /api/Booking/SearchListBooking' },
    { name: 'normalizeSortRules', file: 'src/components/grid/multiSortUtils.ts', line: 12, desc: 'Chuẩn hóa mảng quy tắc sắp xếp đa cột (loại bỏ key rỗng/trùng lặp, fallback từ sortConfig đơn)' },
    { name: 'toggleColumnSortRules', file: 'src/components/grid/multiSortUtils.ts', line: 44, desc: 'Chuyển đổi quy tắc sắp xếp khi click (thay thế đơn) hoặc Shift+Click (xếp chồng/luân chuyển đa cột)' },
    { name: 'reorderSortRules', file: 'src/components/grid/multiSortUtils.ts', line: 86, desc: 'Đổi vị trí quy tắc sắp xếp từ `fromIndex` sang `toIndex` bất biến và kiểm tra biên an toàn' },
    { name: 'sortRowIndicesMulti', file: 'src/components/grid/multiSortUtils.ts', line: 120, desc: 'Động cơ sắp xếp đa cấp Lazy Tie-Breaker: chỉ tính mảng tầng 0 ở O(N) và trích xuất lười các tầng sau khi tầng trước bằng nhau' },
    { name: 'AdvMultiSortPopup', file: 'src/components/grid/AdvMultiSortPopup.tsx', line: 40, desc: 'Popup Portal Sắp xếp phân cấp đa cột áp dụng tức thì (pointer drag + translateY mượt như AdvColumnChooserModal với hover 0ms, FLIP settle, AdvSelect cột, nút icon toggle MorphSortIcon arrowUp/Down, Xóa hết, backdrop pointer-events-auto)' },
    { name: 'resolveEventTargetElement', file: 'src/components/grid/popupLockUtils.ts', line: 13, desc: 'Chuẩn hóa EventTarget (kể cả Text node có nodeType === 3) về Element/parentElement an toàn để gọi closest()' },
    { name: 'isTargetInsidePopupSelector', file: 'src/components/grid/popupLockUtils.ts', line: 25, desc: 'Kiểm tra EventTarget (kể cả Text node) có nằm trong selector popup hay không' },
    { name: 'canWheelScrollInsidePopup', file: 'src/components/grid/popupLockUtils.ts', line: 65, desc: 'Kiểm tra wheel (kể cả trên Text node & HiDPI subpixel tolerance 0.2/0.5) có đang nằm trên vùng con có thể cuộn tiếp bên trong popup hay không để chống scroll-chaining xuống Grid' },
    { name: 'shouldBlockGridInteractionWhenPopupOpen', file: 'src/components/grid/popupLockUtils.ts', line: 110, desc: 'Xác định target (kể cả Text node) có nằm ngoài popup hay không để Grid chặn tương tác khi popup đang mở' },
    { name: 'renderGroupHeaderRow', file: 'src/components/grid/GridGroupHeaderRow.tsx', line: 22, desc: 'Component `GridGroupHeaderRow` tách `React.lazy` khỏi `GridRow`: lazy `LazyRowGroupChevronMorphIcon`, giá trị nhóm, badge số lượng & summary tổng các cột số' }
  ],

  // ============================================================================
  // PHẦN D: TỪ ĐIỂN BIẾN CSS THEME & Z-INDEX (CSS TOKENS & STACKING)
  // ============================================================================
  cssTokens: [
    { token: '--background / --agv-bg-root', desc: 'Màu nền chính của trang PNT B2B', defaultLight: '#f4f7f8', defaultDark: '#071c24' },
    { token: '--table-header / --agv-bg-header', desc: 'Màu nền thanh tiêu đề GridHeader & thead LookUp', defaultLight: '#f0f6f8', defaultDark: '#12313b' },
    { token: '--foreground / --agv-text-header', desc: 'Màu chữ thanh tiêu đề & nội dung chính', defaultLight: '#102a33', defaultDark: '#f1f7f8' },
    { token: '--muted-foreground / --agv-text-muted', desc: 'Màu chữ phụ / nhãn mờ', defaultLight: '#5a717a', defaultDark: '#aec0c6' },
    { token: '--border / --agv-border', desc: 'Màu đường viền giữa các ô và bảng', defaultLight: '#d5e1e4', defaultDark: '#29454e' },
    { token: '--control-border / --agv-border-strong', desc: 'Màu đường viền controls nhập liệu', defaultLight: '#7e959d', defaultDark: '#5f7f89' },
    { token: '--primary / --agv-accent', desc: 'Teal chủ đạo cho nút CTA chính và focus ring', defaultLight: '#1c6987', defaultDark: '#70bdd2' },
    { token: '--primary-foreground / --agv-accent-text', desc: 'Màu chữ trên nền --primary CTA', defaultLight: '#ffffff', defaultDark: '#062a36' },
    { token: '--brand-gold / --brand-gold-on-light', desc: 'Gold nhấn tab gạch chân, viền 1px đồng đều thẻ chọn Phone & chữ STT dòng focus', defaultLight: '#d49f4f / #8f6227', defaultDark: '#d49f4f / #d6a55d' },
    { token: '--surface-selected / --agv-bg-selected', desc: 'Màu nền dòng/mục đang chọn (không tô đậm teal tràn hàng)', defaultLight: '#e5eff3', defaultDark: '#173d49' },
    { token: '--card / --agv-bg-row', desc: 'Màu nền card & dòng dữ liệu bảng', defaultLight: '#ffffff', defaultDark: '#0d2731' },
    { token: '--surface-hover / --agv-bg-hover', desc: 'Màu nền khi rê chuột qua dòng/item', defaultLight: '#f8fbfc', defaultDark: '#153640' },
    { token: '--scrollbar-thumb / --scroll-thumb', desc: 'Màu thanh cuộn (Scrollbar thumb 8px) đồng bộ PNT B2B', defaultLight: 'color-mix(in srgb, #7e959d 35%, transparent)', defaultDark: 'color-mix(in srgb, #5f7f89 45%, transparent)' },
    { token: '--scrollbar-thumb-hover / --scroll-thumb-hover', desc: 'Màu thanh cuộn khi rê chuột vào', defaultLight: 'color-mix(in srgb, #7e959d 55%, transparent)', defaultDark: 'color-mix(in srgb, #5f7f89 65%, transparent)' },
    { token: '--popup-background / --agv-bg-popup', desc: 'Màu nền đặc cho Popup, Dropdown, Menu, Drawer & Modal (tránh bị trong suốt)', defaultLight: '#ffffff', defaultDark: '#0d2731' },
    { token: '--safe-area-top / --safe-area-bottom', desc: 'Vùng an toàn tai thỏ / thanh điều hướng cảm ứng cho Drawer & Responsive Footer', defaultLight: 'env(safe-area-inset-*, 0px)', defaultDark: 'env(safe-area-inset-*, 0px)' }
  ],

  zIndexes: [
    { level: 'z-50', desc: 'Tay cầm kéo độ rộng cột (Resize Handle), Menu ngữ cảnh (ContextMenu), Modal' },
    { level: 'z-40', desc: 'Giao điểm tiêu đề cột ghim trái/phải với Header (Sticky Header Pinned Corners)' },
    { level: 'z-30', desc: 'Toàn bộ thanh tiêu đề GridHeader (Sticky Top Header)' },
    { level: 'z-20', desc: 'Các ô dữ liệu thuộc cột ghim trái/phải trong GridRow (Sticky Cell Columns)' },
    { level: 'z-10 / auto', desc: 'Các ô dữ liệu cuộn tự do thông thường trong dòng' }
  ],

  // ============================================================================
  // PHẦN E: MỤC LỤC PHÂN ĐOẠN DÒNG CHI TIẾT (LINE RANGE DIRECTORY)
  // ============================================================================
  files: [
    {
      fileName: 'src/App.tsx',
      totalLines: 360,
      description: 'Application Shell B2B-PNT nạp lười `LoginPanel` & 5 trang qua React.lazy (không kéo `./components/grid` vào `index.js`), hỗ trợ hash query, xác thực BE-CRM, bật/tắt `.dark`, `.agv-liquid`, `<LiquidGlassBackdrop />` & AppHeaderFrame Gold tabs',
      sections: [
        { lineRange: '1 - 120', category: 'Lazy Imports, parseHashPageKey(), Light/Dark & Liquid Visual Mode Readers', functions: ['parseHashPageKey', 'readInitialPage', 'readInitialDarkMode', 'readInitialLiquidMode'] },
        { lineRange: '122 - 240', category: 'Session, Hash, Dark Mode & Liquid Glass Class Sync Handlers', functions: ['App', 'handleSelectPage', 'handleToggleColorScheme', 'handleToggleLiquidMode'] },
        { lineRange: '248 - 360', category: 'LiquidGlassBackdrop, AppHeaderFrame, Gold Tabs & Suspense Lazy PageShell Router JSX', functions: ['LiquidGlassBackdrop', 'LoginPanel', 'PageShell', 'ListPagePanel', 'CountriesPage', 'AirportsPage', 'PartnersPage', 'BookingsPage', 'UiPrimitivesPage'] }
      ]
    },
    {
      fileName: 'src/services/b2bAuth.ts',
      totalLines: 312,
      description: 'BE-CRM Auth & Session Client tách khỏi `b2bApi.ts` để tách chunk `App` nhẹ không kéo Catalog/Booking endpoints',
      sections: [
        { lineRange: '1 - 160', category: 'Auth Types, SessionStorage Store & Refresh Single-Flight', functions: ['AuthSession', 'loadAuthSession', 'getB2bToken'] },
        { lineRange: '161 - 312', category: 'Fetch Wrapper & Auth Endpoints (Login / Verify2FA / Logout)', functions: ['apiCall', 'loginAccount', 'verifyTwoFaCode', 'logoutAccount'] }
      ]
    },
    {
      fileName: 'src/services/b2bApi.ts',
      totalLines: 910,
      description: 'BE-CRM Catalog & Booking Endpoints: tái sử dụng `apiCall` từ `./b2bAuth`, chuẩn hóa phân trang `normalizePaged`, các hàm `fetch*Page` & `fetchAllAirports`',
      sections: [
        { lineRange: '1 - 149', category: 'Geography, Country, Airport & Partner Types + DDL Loaders', functions: ['CountryRow', 'AirportInfoRow', 'PartnerListItem', 'PartnerSalesUser', 'fetchGeographyDDL'] },
        { lineRange: '150 - 465', category: 'Pagination Helper, Countries, Airports & AllAirports Fetchers', functions: ['normalizePaged', 'collectAllPages', 'fetchCountriesPage', 'fetchCountryDDL', 'fetchAirportsPage', 'fetchAllAirports'] },
        { lineRange: '466 - 910', category: 'Partner & Bookings Types, MSSQL Date Helpers & Fetchers', functions: ['fetchPartnerSalesUsers', 'fetchPartnersPage', 'toBookingListFromDate', 'toBookingListToDate', 'fetchBookingCarriersDDL', 'fetchBookingPartnersDDL', 'fetchBookingUsersDDL', 'fetchBookingsPage'] }
      ]
    },
    {
      fileName: 'src/components/b2b/LoginPanel.tsx',
      totalLines: 193,
      description: 'Form đăng nhập BE-CRM (Account/Password + Verify2FA) dùng design tokens b2b-pnt (`.agv-login-card`, `bg-card`, `CTA bg-primary h-9`) và NO_AUTOFILL_PROPS',
      sections: [
        { lineRange: '1 - 75', category: 'State & Submit Handlers (Login + 2FA)', functions: ['LoginPanel', 'handleLoginSubmit', 'handleVerify2Fa'] },
        { lineRange: '76 - 193', category: 'Credentials & 2FA Form JSX', functions: ['NO_AUTOFILL_PROPS', 'CONTROL_SURFACE_CLASS'] }
      ]
    },
    {
      fileName: 'src/components/grid/DataGrid.tsx',
      totalLines: 1928,
      description: 'Core Library Component (`<DataGrid<TRecord> />` & `useDataGridController`): gỡ static `gridUtils` & `MorphCheckbox`, dùng fast-path `gridSimpleFilter` + dynamic `gridFilterEngine`/`gridGroupingEngine`/`queryUtils`, uncloned `getRow`, cache `getRowKeyAt`, `GridSelectionCheckbox` & truyền `_resolvedFeatures`',
      sections: [
        { lineRange: '1 - 149', category: 'Imports (gridFormatUtils + gridSimpleFilter + queryRuleCheck), Feature/Column Types', functions: ['UseDataGridControllerOptions'] },
        { lineRange: '150 - 740', category: 'Default RowKey/Accessors, Module/Column Normalization & Dynamic Lazy Engine Refs', functions: ['defaultGetRowKey', 'useDataGridController', 'resolveGridFeatures', 'normalizeGridColumns'] },
        { lineRange: '741 - 1226', category: 'Filtering (Simple Fast-Path + Lazy Full Engine), Multi-Sort, Pagination Slice, Sums & Lazy Grouping', functions: ['filteredRowIndices', 'displayRowIndices', 'pagedRowIndices', 'columnSums', 'groupedDisplayModel'] },
        { lineRange: '1227 - 1726', category: 'Page Handlers, Selection, Column/Filter Mutations & Cell Rendering', functions: ['handlePageChange', 'handlePageSizeChange', 'renderCell'] },
        { lineRange: '1727 - 1928', category: 'DataGrid Component JSX, GridSelectionCheckbox, AutoHeight Wrapper & VirtualizedGrid + LazyGridStatusBar', functions: ['DataGrid', 'GridSelectionCheckbox', 'VirtualizedGrid', 'LazyGridStatusBar'] }
      ]
    },
    {
      fileName: 'src/components/grid/GridStatusBar.tsx',
      totalLines: 182,
      description: 'Thanh phân trang đáy tích hợp vào core Grid (`statusBar` prop): tái sử dụng `AdvSelect` (`20 / 50 / 100 / 200`), nút `<`/`>` (`ChevronLeft`/`ChevronRight`), ô nhập số trang (`NO_AUTOFILL_PROPS`), `/ {totalPages}` và khoảng dòng `start-end / totalItems`',
      sections: [
        { lineRange: '1 - 75', category: 'Props, Page Bounds Calculation & Draft Page Input Commit', functions: ['GridStatusBarProps', 'GridStatusBar', 'commitDraftPage'] },
        { lineRange: '76 - 182', category: 'Pager Controls JSX (AdvSelect PageSize, Prev/Input/Next, Item Range)', functions: ['AdvSelect', 'ChevronLeft', 'ChevronRight', 'NO_AUTOFILL_PROPS'] }
      ]
    },
    {
      fileName: 'src/pages/usePagedListQuery.ts',
      totalLines: 190,
      description: 'Shared hook quản lý phân trang server-side kèm LRU Page Cache 0ms (`page=1`, `pageSize=20`, `serverTotal`, `loading`, `error`, `refresh`, `apiLoadMs`, `renderStartRef`) cho các trang danh mục B2B-PNT',
      sections: [
        { lineRange: '1 - 79', category: 'LRU Page Cache Helpers & Key Serialization', functions: ['serializeStableValue', 'buildCacheKey', 'getCachedEntry', 'setCachedEntry'] },
        { lineRange: '80 - 190', category: 'State, Abortable Page Query Effect, API Timing & Reset Handlers', functions: ['usePagedListQuery', 'handlePageSizeChange', 'refresh'] }
      ]
    },
    {
      fileName: 'src/pages/gridPageTelemetry.tsx',
      totalLines: 168,
      description: 'Module đo lường hiệu năng runtime dùng chung cho các trang Grid (`captureRuntimeTelemetry`, `countGridDomNodes`, `useGridStageTelemetry`, `<GridTelemetryLine />`)',
      sections: [
        { lineRange: '1 - 74', category: 'JS Payload, Memory Heap & `.agv-grid-root` DOM Counter', functions: ['captureRuntimeTelemetry', 'countGridDomNodes'] },
        { lineRange: '75 - 168', category: 'rAF + Lazy Settle Telemetry Hook & Telemetry Line JSX', functions: ['useGridStageTelemetry', 'GridTelemetryLine'] }
      ]
    },
    {
      fileName: 'src/pages/CountriesPage.tsx',
      totalLines: 357,
      description: 'Trang tra cứu Quốc gia: lọc server h-9 + dòng `Đo thực tế` (`GridTelemetryLine`) + cột `createColumnHelper<CountryRow>()` & `defaultColDef` + `<DataGrid gridId="b2b_countries" modules={[...StandardGridModules, QueryBuilderModule, ColumnChooserModule]} data={...} getRowId={...} pagination={...} />`',
      sections: [
        { lineRange: '1 - 37', category: 'Imports, ColumnHelper & DefaultColDef Config', functions: ['createColumnHelper'] },
        { lineRange: '38 - 357', category: 'CountriesPage Query, Telemetry Stage, Columns, Filter Bar & DataGrid JSX', functions: ['CountriesPage', 'useGridStageTelemetry', 'GridTelemetryLine', 'DataGrid'] }
      ]
    },
    {
      fileName: 'src/pages/AirportsPage.tsx',
      totalLines: 603,
      description: 'Trang tra cứu 2.771 dòng Sân bay (`fetchAllAirports`): dùng `<DataGrid modules={BasicViewModules} />` (`?mode=all|paged`), bộ lọc BE-CRM & thanh `Đo thực tế` dùng `useGridStageTelemetry` + `GridTelemetryLine`',
      sections: [
        { lineRange: '1 - 214', category: 'Filter Options, ColumnHelper Definitions (`BasicViewModules`) & Hash Parser', functions: ['useAirportGridColumns', 'parseAirportRowMode'] },
        { lineRange: '215 - 405', category: 'AirportsPage Full Fetch (`fetchAllAirports`), Telemetry Hook & Mode Switcher', functions: ['AirportsPage', 'useGridStageTelemetry', 'handleSelectRowMode', 'refresh'] },
        { lineRange: '406 - 603', category: 'Filter Bar, Row Mode Switcher, Telemetry Line & DataGrid Stage JSX', functions: ['GridTelemetryLine', 'DataGrid'] }
      ]
    },
    {
      fileName: 'src/pages/PartnersPage.tsx',
      totalLines: 409,
      description: 'Trang tra cứu Đại lý: StatusTabs Gold, bộ lọc h-9 + cột `createColumnHelper<PartnerListItem>()` & `defaultColDef` + `<DataGrid gridId="b2b_partners" modules={StandardGridModules} data={...} getRowId={...} pagination={...} />`',
      sections: [
        { lineRange: '1 - 63', category: 'Imports, StatusTabs & SalesUser LookUp Config', functions: ['createColumnHelper'] },
        { lineRange: '64 - 409', category: 'PartnersPage Query, Columns, Filter Bar & DataGrid JSX', functions: ['PartnersPage', 'handleSelectStatusTab', 'handleSubmit', 'DataGrid'] }
      ]
    },
    {
      fileName: 'src/pages/BookingsPage.tsx',
      totalLines: 605,
      description: 'Trang tra cứu Đặt chỗ B2B: 7 tab StatusTabs, AdvDateRangePicker size="md", 14 cột phẳng qua `createColumnHelper<BookingListItem>()` (`valueGetter`) & `defaultColDef` + `<DataGrid gridId="b2b_bookings" modules={StandardGridModules} data={...} getRowId={...} pagination={...} />`',
      sections: [
        { lineRange: '1 - 96', category: 'Imports, Status Tabs, LookUp Columns & ColumnHelper', functions: ['BOOKING_STATUS_TABS', 'PARTNER_LOOKUP_COLUMNS', 'USER_LOOKUP_COLUMNS'] },
        { lineRange: '97 - 420', category: 'BookingsPage DDL Loaders, Server Query Loader & 14 Typed Columns', functions: ['BookingsPage', 'fetchBookingsPage', 'columns'] },
        { lineRange: '421 - 605', category: 'Filter Bar JSX & DataGrid Render', functions: ['DataGrid'] }
      ]
    },
    {
      fileName: 'src/components/grid/multiSortUtils.ts',
      totalLines: 215,
      description: 'Động cơ sắp xếp phân cấp đa cột + `reorderSortRules` + Lazy Tie-Breaker tối ưu hiệu năng khi dữ liệu không trùng khóa',
      sections: [
        { lineRange: '1 - 119', category: 'Rule Normalization, Click/Shift+Click Stack & Reorder Transitions', functions: ['normalizeSortRules', 'toggleColumnSortRules', 'reorderSortRules'] },
        { lineRange: '120 - 215', category: 'Lazy Tie-Breaker Multi-Level Comparator', functions: ['sortRowIndicesMulti'] }
      ]
    },
    {
      fileName: 'src/components/grid/popupLockUtils.ts',
      totalLines: 117,
      description: 'Tiện ích thuần chuẩn hóa EventTarget Text node (`resolveEventTargetElement`), kiểm tra điều kiện cuộn trong popup với ngưỡng subpixel HiDPI (`canWheelScrollInsidePopup`) và chặn tương tác xuyên Grid (`shouldBlockGridInteractionWhenPopupOpen`)',
      sections: [
        { lineRange: '1 - 64', category: 'Target Resolution, Overflow & Axis Scroll Bounds Helpers', functions: ['resolveEventTargetElement', 'isTargetInsidePopupSelector', 'isScrollableOverflowValue', 'canElementScrollOnAxis'] },
        { lineRange: '65 - 117', category: 'Popup Wheel Containment & Grid Guard Predicates', functions: ['canWheelScrollInsidePopup', 'shouldBlockGridInteractionWhenPopupOpen'] }
      ]
    },
    {
      fileName: 'src/components/grid/AdvMultiSortPopup.tsx',
      totalLines: 646,
      description: 'Popup Portal Sắp xếp phân cấp nhiều cột gắn neo nút trên GridFloatingToolbar (áp dụng tức thì, không nút Áp dụng): Pointer Drag (`translateY`) + FLIP settle mượt như AdvColumnChooserModal, AdvSelect chọn cột, nút icon toggle MorphSortIcon, wrapper pointer-events-none z-[1250] + ngoại lệ `.agv-float-toolbar-btn` & scroll lock',
      sections: [
        { lineRange: '1 - 196', category: 'Props, Settle FLIP Layout Effect & Click Outside', functions: ['AdvMultiSortPopup', 'useLayoutEffect settle FLIP'] },
        { lineRange: '197 - 646', category: 'Stable Anchor Coords, Pointer Drag Reorder (translateY), MorphSortIcon Toggle & Footer Clear All', functions: ['AdvSelect', 'GripVertical', 'MorphSortIcon', 'reorderSortRules'] }
      ]
    },
    {
      fileName: 'src/components/grid/VirtualizedGrid.tsx',
      totalLines: 2760,
      description: 'Động cơ chính của Grid (bọc React.memo): tiếp nhận `_resolvedFeatures`, tách `useGridColumnLayout` & `useGridPopupLock`, bỏ `viewportWidth` thừa, tải lười 6 UI chunks + `gridGroupingEngine` + `gridFilterEngine`, 1-pass `useLayoutEffect`, CHUNK = 20, gắn `data-agv-filter-row` (dòng 2156), `data-agv-pinned-rows` (dòng 2223), `data-agv-sticky-group` (dòng 2301) cho nền kính mờ Liquid Glass chống thấu chữ',
      sections: [
        { lineRange: '1 - 86', category: 'Imports, Lazy UI Chunks & Prop Types', functions: ['LazyGridFilterRow', 'LazyColumnContextMenu', 'LazyAdvChecklistFilterPopup', 'LazyGridFloatingToolbar', 'LazyGridResponsiveHeader', 'LazyResponsiveSortFilterModal', 'VirtualizedGridProps'] },
        { lineRange: '87 - 650', category: 'Component Entry, Hook Composition (`useGridColumnLayout`, Resize/AutoFit/Pin/Hide)', functions: ['VirtualizedGridComponent', 'toggleFullscreen', 'handleMouseDownResize', 'handleAutoFitColumn', 'handleSetPin', 'handleSetBandPin', 'handleHideColumn', 'handleHideBand'] },
        { lineRange: '651 - 1165', category: 'Scroll To Top/Bottom, Context Menu Triggers, Dynamic Engine & Group Sticky', functions: ['handleScrollToTop', 'handleScrollToBottom', 'handleColumnContextMenu', 'handleBandContextMenu', 'handleCellContextMenu', 'handleFilterByValue', 'handleGroupContextMenu', 'computeStickyGroupIdx'] },
        { lineRange: '1166 - 1510', category: 'Popup Scroll Lock Sync, Scroll Handler, Chunk Row Map & Imperative Handle', functions: ['useGridPopupLock', 'handleScroll', 'visibleChunksMap', 'useImperativeHandle'] },
        { lineRange: '1511 - 2760', category: 'JSX Render Viewport, GridHeader, Suspense Lazy Modals & Export', functions: ['GridHeader', 'LazyGridFilterRow', 'GridChunkBlock', 'LazyGridFloatingToolbar', 'LazyResponsiveSortFilterModal', 'LazyColumnContextMenu', 'VirtualizedGrid'] }
      ]
    },
    {
      fileName: 'src/components/grid/GridHeader.tsx',
      totalLines: 642,
      description: 'Thanh tiêu đề linh hoạt 1 tầng (34px) hoặc 2 tầng (64px), dùng `middleElements` precomputed từ `useGridColumnLayout`, lazy-load `LazyHeaderSortMorphIcon` & `LazyHeaderBandToggleMorphIcon`, Drag & Drop & context menu',
      sections: [
        { lineRange: '1 - 41', category: 'Imports, Lazy Morph Primitives & Header Props', functions: ['LazyHeaderSortMorphIcon', 'LazyHeaderBandToggleMorphIcon', 'GridHeaderProps'] },
        { lineRange: '42 - 203', category: 'Header Outer Container, Drag & Drop Column Reordering & Multi-Tier Detection', functions: ['GridHeader', 'middleElements'] },
        { lineRange: '204 - 642', category: 'Shared Header Cell Content (`col.renderHeader()`), Pinned Left/Middle/Right Headers & Resize Handles', functions: ['renderHeaderCellContent', 'onBandContextMenu'] }
      ]
    },
    {
      fileName: 'src/components/grid/GridRow.tsx',
      totalLines: 381,
      description: 'Fast row renderer dùng `ColRenderMeta`, row-level event delegation, tải lười `LazyGridGroupHeaderRow` & `LazyGridInCellEditor`, sticky cells & `col.valueGetter`',
      sections: [
        { lineRange: '1 - 72', category: 'Imports, LazyGroupHeaderRow/LazyInCellEditor & Raw Value Getter', functions: ['LazyGridInCellEditor', 'LazyGridGroupHeaderRow', 'GridRowProps', 'getRawCellValue'] },
        { lineRange: '73 - 200', category: 'GridRow Entry, Group Row Lazy Delegate & Sticky Offsets', functions: ['GridRow', 'LazyGridGroupHeaderRow'] },
        { lineRange: '201 - 381', category: 'Cells (`colRenderMetas`, `col.valueGetter`), `<Suspense><LazyGridInCellEditor /></Suspense>` & Memo Comparator', functions: ['ColRenderMeta', 'LazyGridInCellEditor'] }
      ]
    },
    {
      fileName: 'src/components/ui/AdvDatePicker.tsx',
      totalLines: 718,
      description: 'Component chọn ngày/giờ đơn chuẩn PNT B2B & DevExpress (và barrel re-exports cho bộ datepicker/*): `size="md"` dùng `var(--control-height)` (36px), mặc định/sm 28px cho ô lọc, đồng bộ PNT Light/Dark CSS tokens, min-h 28px',
      sections: [
        { lineRange: '1 - 150', category: 'Imports, Re-exports & Prop Types', functions: ['AdvDatePickerProps', 'getThemeClass'] },
        { lineRange: '151 - 718', category: 'AdvDatePicker Component & Portal Calendar/Preset/Time Integration', functions: ['AdvDatePicker', 'ensureDatePickerStyles', 'computeCalendarCoords'] }
      ]
    },
    {
      fileName: 'src/components/grid/GridChunkBlock.tsx',
      totalLines: 380,
      description: 'Khối chứa 20 dòng ảo hóa GPU translate3d: dùng `ColRenderMeta`, render trực tiếp GridRow trên PC và tải lười `LazyResponsiveChunkRow` qua `<Suspense>` khi ở Tablet/Phone, bảo toàn React.memo range-aware',
      sections: [
        { lineRange: '1 - 62', category: 'Imports, LazyResponsiveChunkRow & GridChunkBlockProps', functions: ['LazyResponsiveChunkRow', 'GridChunkBlockProps'] },
        { lineRange: '63 - 260', category: 'GPU Positioning, PC GridRow Render & Responsive Suspense Branch', functions: ['GridChunkBlock', 'GridRow', 'LazyResponsiveChunkRow'] },
        { lineRange: '261 - 380', category: 'Memo Comparator Optimization (Range-aware for checkedRowIndices, selectedRow & editingCell)', functions: ['chunk memo comparer with range check [startRowIndex, endRowIndex]'] }
      ]
    },
    {
      fileName: 'src/components/grid/ColumnContextMenu.tsx',
      totalLines: 1190,
      description: 'Menu ngữ cảnh chuột phải 4 phạm vi (HEADER, BAND, GROUP, ROW): tái sử dụng `CONTEXT_MENU_TYPES` từ `./types`, tách biệt `enableColumnPinning` (Trái/Phải) và `enableCenterDock` (Giữa) qua `renderPinButtons`, tôn trọng `groupable !== false` & `hideable !== false`, click outside capture, export default cho React.lazy',
      sections: [
        { lineRange: '1 - 224', category: 'Imports, ClickOutside Capture, Safe Coords & `renderPinButtons`', functions: ['ColumnContextMenu', 'renderPinButtons', 'CONTEXT_MENU_TYPES'] },
        { lineRange: '225 - 658', category: 'HEADER Menu Branch (Pinning Left/Right vs Center, Formula, AutoFit, Hide, Group)', functions: ['renderPinButtons', 'hideable', 'groupable'] },
        { lineRange: '659 - 782', category: 'BAND Menu Branch (Band Pinning Left/Right vs Center, AutoFit, Hide)', functions: ['CONTEXT_MENU_TYPES.BAND', 'renderPinButtons'] },
        { lineRange: '783 - 1190', category: 'GROUP & ROW/CELL Menu Branches, Portal Container & Default Export', functions: ['CONTEXT_MENU_TYPES.GROUP', 'CONTEXT_MENU_TYPES.ROW', 'handleCopyCell'] }
      ]
    },
    {
      fileName: 'src/components/grid/gridFormatUtils.ts',
      totalLines: 296,
      description: 'Pure formatting, predicate & filter factory helpers siêu nhẹ (chỉ import `./types`, cắt đứt leak sang `AdvDatePicker`): `formatDisplayDate`, `formatGridDateValue`, `getSttColWidth`, `parseGridNumber`, `formatGridNumber`, `createColumnFilter`, `createEqualsFilter`',
      sections: [
        { lineRange: '1 - 104', category: 'Date Formatting & STT Width Helpers', functions: ['formatDisplayDate', 'formatGridDateValue', 'getSttColWidth'] },
        { lineRange: '105 - 296', category: 'Number Format/Parse, Alignment Classes, Predicates & Filter Factories', functions: ['parseGridNumber', 'formatGridNumber', 'getAlignTextClass', 'isNoInputFilterOp', 'isSelectionColumn', 'getColumnFilterType', 'getDefaultFilterOpForColumn', 'createColumnFilter', 'createEqualsFilter'] }
      ]
    },
    {
      fileName: 'src/components/grid/gridUtils.ts',
      totalLines: 42,
      description: 'Barrel siêu nhẹ re-export `./gridFormatUtils`, `./gridFilterEngine`, `./gridAutoFitUtils`, `./gridClipboardUtils`, `./gridSelectionUtils` giữ tương thích ngược 100%',
      sections: [
        { lineRange: '1 - 42', category: 'Pure Backward-Compatible Re-exports', functions: ['gridFormatUtils', 'gridFilterEngine', 'gridAutoFitUtils', 'gridClipboardUtils', 'gridSelectionUtils'] }
      ]
    },
    {
      fileName: 'src/components/grid/smartNumberUtils.ts',
      totalLines: 232,
      description: 'Bộ công cụ số thông minh theo quy ước k x1000, m/tr x1000000, b/ty x1000000000; phân tích khoảng số (.., /, -, ~) và bộ lọc phím bấm chặn chữ cái rác',
      sections: [
        { lineRange: '1 - 52', category: 'Shortcuts Regex & Expansion Engine (k, m, tr, b, ty)', functions: ['NUMERIC_SHORTCUT_REGEX', 'expandAllShortcuts', 'formatNumberWithCommas'] },
        { lineRange: '53 - 158', category: 'Smart Numeric Range Parser', functions: ['cleanNumericInput', 'parseSmartNumericRange'] },
        { lineRange: '159 - 206', category: 'Smart Numeric Input Formatter', functions: ['formatSmartInputText'] },
        { lineRange: '207 - 232', category: 'Strict Numeric Keydown Filter', functions: ['handleNumericKeyDown'] }
      ]
    },
    {
      fileName: 'src/components/ui/MorphCheckbox.tsx',
      totalLines: 132,
      description: 'Control Checkbox Morph Line 3 trạng thái thuần React + SVG CSS-keyframe (`viewBox="0 0 13 10"`, hitbox >= 28px), 0 dependency `morphicons`/`lucide`',
      sections: [
        { lineRange: '1 - 32', category: 'Morph Line SVG Paths & Keyframe Map', functions: ['MORPH_LINE_PATHS', 'MorphCheckboxProps'] },
        { lineRange: '33 - 132', category: 'MorphCheckbox Component', functions: ['MorphCheckbox'] }
      ]
    },
    {
      fileName: 'src/components/ui/MorphIcons.tsx',
      totalLines: 104,
      description: 'Bộ biểu tượng biến hình (`MorphIcon`, `MorphActionIcon`, `MorphSortIcon`, `MorphChevronIcon` + 6 Lucide icon thiết yếu; re-export `MorphCheckbox`)',
      sections: [
        { lineRange: '1 - 39', category: 'Imports, Re-exports (MorphIcon, MorphCheckbox) & MorphActionIcon', functions: ['MorphIcon', 'MorphCheckbox', 'MorphActionIcon'] },
        { lineRange: '40 - 62', category: 'MorphSortIcon (Header Sort ArrowUp <-> ArrowDown snappy)', functions: ['MorphSortIcon'] },
        { lineRange: '63 - 104', category: 'MorphChevronIcon & 6 Trimmed Lucide Icon Exports', functions: ['MorphChevronIcon', 'ChevronLeft', 'ChevronRight', 'ChevronDown', 'ChevronUp', 'ArrowUp', 'ArrowDown'] }
      ]
    },
    {
      fileName: 'src/components/grid/floating/AdvColumnChooserModal.tsx',
      totalLines: 1054,
      description: 'Popup 3: Tùy chọn cột tinh gọn (đã xóa toàn bộ bộ nút hành động), chống thu gọn khi đang kéo di chuyển vị trí, hỗ trợ kéo nhóm tầng, gom nhóm nguyên khối Atomic Group cho 12 tháng, resizer 2 mép, co giãn chiều cao linh hoạt nằm gọn trong Grid',
      sections: [
        { lineRange: '1 - 50', category: 'Imports & Props Type Definitions', functions: ['AdvColumnChooserModalProps', 'ColumnTreeNode'] },
        { lineRange: '51 - 240', category: 'Tree Construction & Atomic Band Consolidation', functions: ['buildBandedColumnTree', 'isAtomicGroup consolidation', 'groupedKeySet exclusion'] },
        { lineRange: '241 - 325', category: 'Resizer 2 Mép & Helper Visibility/Collapse Cycles', functions: ['handleResizeStart', 'getAllDescendantLeafKeys', 'toggleBandGroupVisibility', 'toggleBandCollapse (chống thu gọn khi kéo)'] },
        { lineRange: '326 - 770', category: 'Tree Chooser Node Rendering & Pointer Drag', functions: ['renderTreeChooserNode', 'pointerDrag state', 'atomicKeys toggle', 'band drag reorder'] },
        { lineRange: '771 - 1054', category: 'Flat Columns Fallback & Modal Shell JSX', functions: ['filteredFlatColumns', 'resizer handles', 'search input', 'reset button'] }
      ]
    },
    {
      fileName: 'src/components/grid/GridFloatingToolbar.tsx',
      totalLines: 667,
      description: 'Thanh công cụ nổi cạnh trái (`floatingToolbar.css`): lazy-load toàn bộ 4 popup (`AdvQuickFilterFlyout`, `AdvMultiSortPopup`, `AdvGridQueryBuilderModal`, `AdvColumnChooserModal`) kèm hover preload, cô lập vị trí Y theo `gridId`, đồng bộ `onActivePopupChange`, `computePopupGeometry` & scroll lock',
      sections: [
        { lineRange: '1 - 120', category: 'Imports (`floatingToolbar.css` + Lazy Popups), Props & onActivePopupChange Sync', functions: ['GridFloatingToolbar', 'LazyQuickFilterFlyout', 'LazyMultiSortPopup', 'onActivePopupChange'] },
        { lineRange: '121 - 270', category: 'Data Columns Filter, Atomic Group Badge Counts & computePopupGeometry', functions: ['dataColumns', 'computePopupGeometry', 'handleDragStart'] },
        { lineRange: '271 - 425', category: 'Drag Clamping & Keyboard Shortcuts (Ctrl+F, Alt+Shift+F, Escape)', functions: ['useEffect keydown'] },
        { lineRange: '426 - 667', category: 'Floating Bar Buttons & Lazy Portals / Popups Renderer Bounded in Grid', functions: ['AdvQuickFilterFlyout', 'AdvMultiSortPopup', 'AdvGridQueryBuilderModal', 'AdvColumnChooserModal'] }
      ]
    },
    {
      fileName: 'src/components/ui/AdvDrawer.tsx',
      totalLines: 598,
      description: 'Bottom Sheet Drawer chuẩn shadcn/ui Base UI & kích thước tối đa D:\\Dự án\\b2b-pnt: Phone w-full max-w-none, Tablet md:max-w-lg (512px) md:mx-auto, max-h 90dvh, z-[10000], nền đặc var(--popup-background), CHILD_POPUP_SELECTOR + hadChildPopupOnDownRef chống đóng nhầm Drawer khi tắt lịch con, mở khóa cuộn Grid tức thì khi đóng',
      sections: [
        { lineRange: '1 - 170', category: 'Drawer Context, Lifecycle & Escape/Body Lock', functions: ['Drawer', 'DrawerProps', 'CHILD_POPUP_SELECTOR'] },
        { lineRange: '171 - 262', category: 'DrawerPortal & DrawerOverlay (z-[10000] + hadChildPopupOnDownRef)', functions: ['DrawerPortal', 'DrawerOverlay'] },
        { lineRange: '263 - 464', category: 'DrawerContent, Downward Swipe-to-Dismiss & Outside Click Guard', functions: ['DrawerContent', 'w-full max-w-none md:max-w-lg', 'max-h-[min(90dvh,calc(100dvh-var(--safe-area-top,0px)))]'] },
        { lineRange: '465 - 598', category: 'DrawerSwipeHandle, Header, Title, Description, Body, Footer & Close', functions: ['DrawerSwipeHandle', 'DrawerHeader', 'DrawerTitle', 'DrawerDescription', 'DrawerBody', 'DrawerFooter', 'DrawerClose'] }
      ]
    },
    {
      fileName: 'src/components/grid/responsive/ResponsiveSortFilterModal.tsx',
      totalLines: 1441,
      description: 'Drawer Lọc & Sắp xếp cạnh dưới (`bottom-0`) tối ưu Mobile chia 2 phân đoạn (`Tìm kiếm & Lọc` | `Sắp xếp`): đồng bộ 100% toán tử PC theo dạng cột (`text`, `number`, `date`, `time`) qua thanh icon DevExtreme 1 hàng chia đều (`FilterOpIcon`, 0 cuộn ngang, 0 dropdown con, 0 tooltip) + `Một giá trị` / `Nhiều giá trị` (`MobileColDraft` độc lập từng cột) + Chip chọn phạm vi (`min-h-[36px]`), danh sách dọc các cột `min-h-[40px]` chạm chọn/bỏ, `Chiều sắp xếp` và footer 2 cột `h-11` / `md:h-9`',
      sections: [
        { lineRange: '1 - 719', category: 'Props, Multi-Value Token/Range Parsers, Per-Column Draft State (`MobileColDraft`), Operator Sync (`getAllowedFilterOpsForColumn`) & Apply/Reset Builders', functions: ['parseMultiValueTokens', 'splitRangePair', 'hasActiveColFilter', 'ResponsiveSortFilterModalProps', 'buildDraftForColumn', 'buildFilterValueFromDraft', 'handleApply', 'handleReset'] },
        { lineRange: '720 - 1441', category: 'AdvDrawer Header Tablist, 1-Row Icon-Only Operator Radiogroup, Type-Aware Single/Multi Inputs (`text`/`number`/`date`/`time`), Scope Chips, Sort Listbox & Footer', functions: ['ResponsiveSortFilterModal', 'role="tablist"', 'role="radiogroup" (FilterOpIcon)', 'SmartNumberFilterInput', 'NumberRangeFilterInput', 'AdvDatePicker', 'AdvDateRangePicker', 'TimeFilterInput', 'TimeRangeFilterInput'] }
      ]
    },
    {
      fileName: 'src/components/grid/TwelveMonthChartCell.tsx',
      totalLines: 427,
      description: 'Biểu đồ 12 tháng tích hợp vào `src/components/grid/` (module nội bộ của grid): giữ nguyên chế độ phân tích `FORMULA_MODES` / `MONTH_ANALYTICS_MODES` / `FORMULA_CYCLE` / `FORMULA_META`, tooltip đồng bộ bóng đổ `var(--popup-shadow)` và re-export qua `src/components/grid/index.ts`',
      sections: [
        { lineRange: '1 - 109', category: 'Types, Formula Constants & Exports (`FORMULA_MODES`, `MONTH_ANALYTICS_MODES`)', functions: ['FORMULA_CYCLE', 'FORMULA_META', 'FORMULA_MODES', 'MONTH_ANALYTICS_MODES'] },
        { lineRange: '110 - 427', category: 'TwelveMonthChartCell Component & var(--popup-shadow) Tooltip', functions: ['TwelveMonthChartCell'] }
      ]
    },
    {
      fileName: 'src/pages/UiPrimitivesPage.tsx',
      totalLines: 981,
      description: 'Trang `Thử nghiệm UI` (tab `ui-test`, truy cập trực tiếp không cần đăng nhập B2B) thử nghiệm Nhóm B (`AdvTooltip`, `AdvHoverCard`, `AdvPopover` + `AdvSelect`), khối Border-Label Inputs (`AdvFormField` + `AdvInput` / `AdvComboBoxEdit` / `AdvSearchLookUpEdit` chọn đơn/đa cell & row / `AdvDatePicker` / `AdvDateRangePicker` biến thể `Auth 48px`/`Chuẩn 36px`) và `GridTableV2FeaturesDemo` theo theme Light/Dark/Liquid Glass',
      sections: [
        { lineRange: '1 - 168', category: 'Imports, Sample Data, DemoCard, OptionSegment & OptionToggleRow Helpers', functions: ['DemoCard', 'OptionSegment', 'OptionToggleRow'] },
        { lineRange: '169 - 981', category: 'UiPrimitivesPage Component Render (UI Controls, Border-Label Inputs & GridTableV2FeaturesDemo)', functions: ['UiPrimitivesPage', 'AdvFormField', 'AdvInput', 'AdvPopover', 'AdvSelect', 'AdvComboBoxEdit', 'AdvSearchLookUpEdit', 'AdvDatePicker', 'AdvDateRangePicker', 'AdvHoverCard', 'AdvTooltip', 'GridTableV2FeaturesDemo'] }
      ]
    },
    {
      fileName: 'src/components/grid/modules/index.ts',
      totalLines: 156,
      description: 'Module hóa kiểu AG Grid React: 19 hằng số GridModule, 3 preset (`BasicViewModules`, `StandardGridModules`, `AllEnterpriseModules`), `toModuleIdSet`, `hasGridModule`',
      sections: [
        { lineRange: '1 - 33', category: 'GRID_MODULE_IDS Enum & Core Types', functions: ['GRID_MODULE_IDS', 'GridModuleId', 'GridModule'] },
        { lineRange: '34 - 87', category: '19 GridModule Definitions (RowNumber, ColumnPinning, CenterDock, RowPinning, ResponsiveLayout...)', functions: ['RowNumberModule', 'ColumnPinningModule', 'CenterDockModule', 'RowPinningModule', 'ResponsiveLayoutModule'] },
        { lineRange: '88 - 156', category: 'Presets & Module Resolution Helpers', functions: ['BasicViewModules', 'StandardGridModules', 'AllEnterpriseModules', 'toModuleIdSet', 'hasGridModule'] }
      ]
    },
    {
      fileName: 'src/components/grid/columns/columnTypes.ts',
      totalLines: 136,
      description: 'Types hợp nhất TanStack Table v8 + AG Grid (`createColumnHelper`, `defaultColDef`, `PaginationConfig` hỗ trợ `total`/`serverTotal`, nested group columns)',
      sections: [
        { lineRange: '1 - 136', category: 'Column Input, DefaultColDef & PaginationConfig Types', functions: ['ColumnHelperAccessorColumn', 'ColumnHelperGroupColumn', 'DefaultColDef', 'PaginationConfig'] }
      ]
    },
    {
      fileName: 'src/components/grid/columns/createColumnHelper.ts',
      totalLines: 49,
      description: 'Helper tạo định nghĩa cột typed kiểu TanStack Table v8 (`createColumnHelper<TData>()`) với `.accessor()`, `.display()`, `.group()`',
      sections: [
        { lineRange: '1 - 26', category: 'Imports & ColumnHelper Interface', functions: ['ColumnHelper'] },
        { lineRange: '27 - 49', category: 'createColumnHelper Implementation', functions: ['createColumnHelper'] }
      ]
    },
    {
      fileName: 'src/components/grid/columns/normalizeColumns.ts',
      totalLines: 241,
      description: 'Chuẩn hóa cột từ ColumnHelper / ColumnDef / nhóm lồng + `defaultColDef` thành `flatColumns` & `columnGroups`, tự gắn `renderHeader`, `valueGetter`, `renderCell` và tách gate ghim Trái/Phải vs Giữa',
      sections: [
        { lineRange: '1 - 158', category: 'DefaultColDef Merge, Accessor/ValueGetter & Pin Isolation Helpers', functions: ['ColumnNormalizationResult'] },
        { lineRange: '159 - 241', category: 'normalizeGridColumns Flatten & Band Group Builder', functions: ['normalizeGridColumns'] }
      ]
    },
    {
      fileName: 'src/components/grid/GridDateFilterCell.tsx',
      totalLines: 93,
      description: 'Ô lọc ngày (`AdvDatePicker`) tách riêng để `GridFilterRow` lazy-load qua `React.lazy` chỉ khi bảng có cột DATE',
      sections: [
        { lineRange: '1 - 93', category: 'GridDateFilterCell Component', functions: ['GridDateFilterCell'] }
      ]
    },
    {
      fileName: 'src/components/grid/GridMorphPrimitives.tsx',
      totalLines: 42,
      description: 'Cầu nối lazy-load `morphicons` cho `GridHeader` (`HeaderSortMorphIcon`, `HeaderBandToggleMorphIcon`) và `GridRow` (`RowGroupChevronMorphIcon`)',
      sections: [
        { lineRange: '1 - 42', category: 'Lazy Morph Bridge Components', functions: ['HeaderSortMorphIcon', 'HeaderBandToggleMorphIcon', 'RowGroupChevronMorphIcon'] }
      ]
    },
    {
      fileName: 'src/components/grid/floating/queryRuleCheck.ts',
      totalLines: 45,
      description: 'Helpers siêu nhẹ kiểm tra active query rules tách khỏi `queryUtils.ts`',
      sections: [
        { lineRange: '1 - 45', category: 'isRuleActive, hasActiveQueryRules, countActiveQueryRules', functions: ['isRuleActive', 'hasActiveQueryRules', 'countActiveQueryRules'] }
      ]
    },
    {
      fileName: 'src/components/ui/AdvSearchLookUpPopup.tsx',
      totalLines: 503,
      description: 'Popup Portal danh mục `AdvSearchLookUpEdit` tách chunk lazy (`React.lazy` + preload khi hover/focus): hỗ trợ `selectionMode="row" | "cell"`, chân trang thao tác đa chọn (nút Bỏ chọn & Áp dụng), filter row, menu toán tử, bảng `table-fixed` + `useVirtualList`, `<MorphCheckbox />`, `isKeyboardNav`',
      sections: [
        { lineRange: '1 - 503', category: 'AdvSearchLookUpPopup Portal Table & Filter Row & useVirtualList', functions: ['AdvSearchLookUpPopup'] }
      ]
    },
    {
      fileName: 'src/components/grid/gridFeatures.ts',
      totalLines: 340,
      description: 'Single source of truth giải quyết `modules?: readonly GridModule[]` (mặc định `BasicViewModules`), `variant="full" | "basic"` và từng cờ `enable*` độc lập',
      sections: [
        { lineRange: '1 - 106', category: 'GRID_VARIANTS, GridFeatureProps & ResolvedGridFeatures Types', functions: ['GRID_VARIANTS', 'GridFeatureProps', 'ResolvedGridFeatures'] },
        { lineRange: '107 - 340', category: 'resolveGridFeatures Module + Override Resolver', functions: ['resolveGridFeatures'] }
      ]
    },
    {
      fileName: 'src/components/grid/editors/GridInCellEditor.tsx',
      totalLines: 497,
      description: 'Chunk lazy chứa toàn bộ bộ sửa ô in-cell tách khỏi `GridRow.tsx` (`CellEditor`, `DateCellEditor`, `DateRangeCellEditor`, `TimeCellEditor`, `GridInCellEditor`), chỉ tải khi bật `CellEditingModule`',
      sections: [
        { lineRange: '1 - 196', category: 'Text/Number & Date/DateRange In-Cell Editors', functions: ['CellEditor', 'DateCellEditor', 'DateRangeCellEditor'] },
        { lineRange: '197 - 354', category: 'TimeCellEditor (HH:mm)', functions: ['TimeCellEditor'] },
        { lineRange: '355 - 497', category: 'GridInCellEditor Router Component (ComboBox/LookUp/Date/Time/Text)', functions: ['GridInCellEditor'] }
      ]
    },
    {
      fileName: 'src/components/grid/responsive/ResponsiveChunkRow.tsx',
      totalLines: 88,
      description: 'Chunk lazy bridge render `GridTabletRow` / `GridPhoneCard` tách khỏi `GridChunkBlock.tsx` để bảng PC read-only không tải code responsive',
      sections: [
        { lineRange: '1 - 25', category: 'Imports & ResponsiveChunkRowProps', functions: ['ResponsiveChunkRowProps'] },
        { lineRange: '26 - 88', category: 'ResponsiveChunkRow Component', functions: ['ResponsiveChunkRow'] }
      ]
    },
    {
      fileName: 'src/components/grid/hooks/useGridColumnLayout.ts',
      totalLines: 660,
      description: 'Custom hook tách khỏi `VirtualizedGrid.tsx`: quản lý độ rộng/ghim/band/ẩn cột, `middleElements`, bỏ qua đo vị trí tự nhiên & `ResizeObserver` khi không có cột center-pinned',
      sections: [
        { lineRange: '1 - 40', category: 'Types & Helper Definitions', functions: ['GridMiddleElement'] },
        { lineRange: '41 - 660', category: 'useGridColumnLayout Width/Pin/Hide/Offset State & Center-Dock Observer', functions: ['useGridColumnLayout', 'setColWidth', 'setMultipleColWidths', 'effectiveColumns', 'middleElements'] }
      ]
    },
    {
      fileName: 'src/components/grid/hooks/useGridPopupLock.ts',
      totalLines: 200,
      description: 'Custom hook khóa cuộn & chặn tương tác Grid tách khỏi `VirtualizedGrid.tsx`, dùng `isAnyPopupActive` zero-allocation qua `document.body.children`',
      sections: [
        { lineRange: '1 - 24', category: 'isAnyPopupActive Zero-Alloc Guard', functions: ['isAnyPopupActive'] },
        { lineRange: '25 - 200', category: 'useGridPopupLock Wheel/TouchMove & Global Interaction Listeners', functions: ['useGridPopupLock'] }
      ]
    },
    {
      fileName: 'src/components/grid/hooks/columnResizeEngine.ts',
      totalLines: 313,
      description: 'Engine DOM 120fps Viewport-Culled cho thao tác kéo giãn cột, nạp lười khi pointerdown từ `useColumnResize.ts`',
      sections: [
        { lineRange: '1 - 313', category: 'Viewport-Culled Resize Session Engine', functions: ['startColumnResizeSession'] }
      ]
    },
    {
      fileName: 'src/components/grid/hooks/sortFlipEngine.ts',
      totalLines: 177,
      description: 'Engine FLIP Sort Animation 300ms nạp lười từ `useGridSortFlipAnimation.ts`',
      sections: [
        { lineRange: '1 - 73', category: 'FLIP Delta Calculation', functions: ['computeSortRowFlipState'] },
        { lineRange: '74 - 177', category: 'GPU FLIP Animation Runner', functions: ['runSortFlipAnimation'] }
      ]
    },
    {
      fileName: 'src/components/grid/gridSimpleFilter.ts',
      totalLines: 148,
      description: 'Động cơ lọc nhanh đồng bộ cho text/equals & router kiểm tra khi nào cần tải lười `gridFilterEngine.ts`',
      sections: [
        { lineRange: '1 - 37', category: 'needsFullFilterEngine Predicate', functions: ['needsFullFilterEngine'] },
        { lineRange: '38 - 148', category: 'matchSimpleFilterSync Fast-Path', functions: ['matchSimpleFilterSync'] }
      ]
    },
    {
      fileName: 'src/components/grid/gridFilterEngine.ts',
      totalLines: 505,
      description: 'Engine lọc nâng cao (date/time/number/multiValues/multiRanges) tách lazy khỏi `DataGrid`',
      sections: [
        { lineRange: '1 - 82', category: 'Date/Time/Range Parsers', functions: ['gridFilterEngine'] },
        { lineRange: '83 - 505', category: 'Full matchFilterValue Engine', functions: ['matchFilterValue'] }
      ]
    },
    {
      fileName: 'src/components/grid/gridGroupingEngine.ts',
      totalLines: 191,
      description: 'Engine gom nhóm dòng & copy bảng nhóm tách lazy khỏi `DataGrid`/`VirtualizedGrid`',
      sections: [
        { lineRange: '1 - 126', category: 'Group Model Builder', functions: ['buildGroupedDisplayModel'] },
        { lineRange: '127 - 191', category: 'Clipboard & Sticky Group Top Index', functions: ['copyGroupTableToClipboard', 'computeStickyGroupIndexAtTop'] }
      ]
    },
    {
      fileName: 'src/components/grid/gridAutoFitUtils.ts',
      totalLines: 113,
      description: 'Tiện ích đo Canvas Text Width & Auto-Fit tách lazy khỏi `gridUtils.ts`',
      sections: [
        { lineRange: '1 - 113', category: 'measureTextWidth & calcColAutoFitWidth', functions: ['measureTextWidth', 'calcColAutoFitWidth'] }
      ]
    },
    {
      fileName: 'src/components/grid/gridClipboardUtils.ts',
      totalLines: 73,
      description: 'Tiện ích tọa độ Menu ngữ cảnh & Clipboard tách lazy khỏi `gridUtils.ts`',
      sections: [
        { lineRange: '1 - 73', category: 'computeContextMenuCoords & copyTextToClipboard', functions: ['computeContextMenuCoords', 'copyTextToClipboard'] }
      ]
    },
    {
      fileName: 'src/components/grid/gridSelectionUtils.ts',
      totalLines: 106,
      description: 'Tiện ích chọn hàng loạt theo tập đã lọc tách lazy khỏi `gridUtils.ts`',
      sections: [
        { lineRange: '1 - 106', category: 'computeFilteredSelectionState & toggleFilteredRowsSelection', functions: ['computeFilteredSelectionState', 'toggleFilteredRowsSelection'] }
      ]
    },
    {
      fileName: 'src/components/grid/colRenderMeta.ts',
      totalLines: 186,
      description: 'Tính sẵn metadata cột sticky/divider/align dùng chung cho `GridChunkBlock` và `GridRow`',
      sections: [
        { lineRange: '1 - 186', category: 'buildColRenderMetas', functions: ['buildColRenderMetas'] }
      ]
    },
    {
      fileName: 'src/components/grid/GridSelectionCheckbox.tsx',
      totalLines: 23,
      description: 'Checkbox chọn dòng siêu nhẹ tách `MorphCheckbox` khỏi cold bundle của `DataGrid` và `GridFilterRow`',
      sections: [
        { lineRange: '1 - 23', category: 'GridSelectionCheckbox', functions: ['GridSelectionCheckbox'] }
      ]
    },
    {
      fileName: 'src/components/grid/GridGroupHeaderRow.tsx',
      totalLines: 267,
      description: 'Component dòng tiêu đề nhóm tách lazy qua `React.lazy` khỏi `GridRow.tsx`',
      sections: [
        { lineRange: '1 - 267', category: 'GridGroupHeaderRow Component', functions: ['GridGroupHeaderRow'] }
      ]
    },
    {
      fileName: 'src/components/grid/GridFilterRow.tsx',
      totalLines: 874,
      description: 'Dòng lọc trực tiếp sticky (`data-agv-filter-row="true"`, `./filterRow.css`): lazy-load toàn bộ input đặc thù (Date, Time, SmartNumber, MultiFilter, CriteriaSummary)',
      sections: [
        { lineRange: '1 - 66', category: 'Lazy Imports (GridDateFilterCell, GridTimeFilterInputs, GridSmartNumberInputs, Popups)', functions: ['LazyNumberRangeFilterInput', 'LazySmartNumberFilterInput'] },
        { lineRange: '67 - 874', category: 'GridFilterRow Component, Portal Operator Menu & Suspense Inputs', functions: ['GridFilterRow', 'GridSelectionCheckbox'] }
      ]
    },
    {
      fileName: 'src/components/grid/GridTimeFilterInputs.tsx',
      totalLines: 170,
      description: 'Ô lọc giờ `TimeFilterInput` & dải giờ `TimeRangeFilterInput` tách `React.lazy` khỏi `GridFilterRow.tsx`',
      sections: [
        { lineRange: '1 - 107', category: 'TimeRangeFilterInput', functions: ['TimeRangeFilterInput'] },
        { lineRange: '108 - 170', category: 'TimeFilterInput', functions: ['TimeFilterInput'] }
      ]
    },
    {
      fileName: 'src/components/grid/GridSmartNumberInputs.tsx',
      totalLines: 266,
      description: 'Ô lọc số thông minh `SmartNumberFilterInput` & dải số `NumberRangeFilterInput` tách `React.lazy` khỏi `GridFilterRow.tsx`',
      sections: [
        { lineRange: '1 - 164', category: 'Types & NumberRangeFilterInput', functions: ['NumberRangeFilterInput'] },
        { lineRange: '165 - 266', category: 'SmartNumberFilterInput', functions: ['SmartNumberFilterInput'] }
      ]
    },
    {
      fileName: 'src/components/grid/responsive/responsiveLayoutEngine.ts',
      totalLines: 127,
      description: 'Engine `ResizeObserver` & Hysteresis +-16px cho Responsive Layout Mode, tải lười từ `useGridLayoutMode.ts`',
      sections: [
        { lineRange: '1 - 127', category: 'GRID_BREAKPOINTS, Hysteresis & ResizeObserver Attachment', functions: ['GRID_BREAKPOINTS', 'resolveActiveModeWithHysteresis', 'getInitialGridMode', 'attachResponsiveLayoutObserver'] }
      ]
    },
    {
      fileName: 'src/components/grid/responsive/GridResponsiveHeader.tsx',
      totalLines: 94,
      description: 'Header responsive sticky (`data-agv-responsive-header="true"`) hợp nhất Tablet/Phone theo chuẩn theme CSS variables',
      sections: [
        { lineRange: '1 - 94', category: 'GridResponsiveHeader Component', functions: ['GridResponsiveHeader'] }
      ]
    }
  ]
};

// ==============================================================================
// CÁC HÀM TRA CỨU TIỆN ÍCH DÙNG TRONG CODE HOẶC CLI
// ==============================================================================

/**
 * Tra cứu toàn diện từ khóa trong từ điển
 */
export function searchDictionary(query) {
  if (!query || typeof query !== 'string') return { errors: [], concepts: [], functions: [], cssTokens: [], files: [] };
  const q = query.trim().toLowerCase();

  const matchedErrors = CODE_DICTIONARY.errors.filter(e => 
    e.code.toLowerCase().includes(q) ||
    e.title.toLowerCase().includes(q) ||
    e.symptom.toLowerCase().includes(q) ||
    e.keywords.some(k => k.toLowerCase().includes(q)) ||
    (e.rootCause && e.rootCause.toLowerCase().includes(q))
  );

  const matchedConcepts = CODE_DICTIONARY.concepts.filter(c =>
    c.term.toLowerCase().includes(q) ||
    c.vietnameseName.toLowerCase().includes(q) ||
    c.description.toLowerCase().includes(q)
  );

  const matchedFunctions = CODE_DICTIONARY.functions.filter(f =>
    f.name.toLowerCase().includes(q) ||
    f.desc.toLowerCase().includes(q) ||
    f.file.toLowerCase().includes(q)
  );

  const matchedCssTokens = CODE_DICTIONARY.cssTokens.filter(t =>
    t.token.toLowerCase().includes(q) ||
    t.desc.toLowerCase().includes(q)
  );

  const matchedFiles = CODE_DICTIONARY.files.filter(file =>
    file.fileName.toLowerCase().includes(q) ||
    file.description.toLowerCase().includes(q) ||
    file.sections.some(s => s.category.toLowerCase().includes(q) || s.functions.some(fn => fn.toLowerCase().includes(q)))
  );

  return {
    errors: matchedErrors,
    concepts: matchedConcepts,
    functions: matchedFunctions,
    cssTokens: matchedCssTokens,
    files: matchedFiles
  };
}

/**
 * Chẩn đoán lỗi cụ thể theo triệu chứng hoặc mã lỗi
 */
export function diagnoseError(errQuery) {
  if (!errQuery) return [];
  const q = errQuery.trim().toLowerCase();
  return CODE_DICTIONARY.errors.filter(e =>
    e.code.toLowerCase().includes(q) ||
    e.title.toLowerCase().includes(q) ||
    e.symptom.toLowerCase().includes(q) ||
    e.keywords.some(k => k.toLowerCase().includes(q))
  );
}

/**
 * Tra cứu một số dòng cụ thể thuộc phân đoạn nào
 */
export function findByLine(fileNameQuery, lineNum) {
  const line = Number(lineNum);
  if (isNaN(line)) return null;

  const fileEntry = CODE_DICTIONARY.files.find(f => 
    f.fileName.toLowerCase().includes(fileNameQuery.toLowerCase())
  );
  if (!fileEntry) return null;

  const section = fileEntry.sections.find(s => {
    const parts = s.lineRange.split('-').map(p => Number(p.trim()));
    return line >= parts[0] && line <= parts[1];
  });

  const relatedFunc = CODE_DICTIONARY.functions.find(f => 
    f.file.toLowerCase().includes(fileNameQuery.toLowerCase()) && Math.abs(f.line - line) < 30
  );

  return {
    fileName: fileEntry.fileName,
    line,
    section: section || { category: 'Phân đoạn chung trong file', functions: [] },
    relatedFunc: relatedFunc || null
  };
}

/**
 * Liệt kê toàn bộ danh mục mã lỗi
 */
export function listAllErrors() {
  return CODE_DICTIONARY.errors;
}

// ==============================================================================
// GIAO DIỆN DÒNG LỆNH (CLI RUNNER)
// ==============================================================================
if (process.argv[1] && process.argv[1].endsWith('code_index.js')) {
  const args = process.argv.slice(2);
  const command = args[0];

  console.log('==============================================================================');
  console.log('📖 TỪ ĐIỂN CODEBASE & SỔ TAY CHẨN ĐOÁN LỖI (GRIDV3 ENGINE)');
  console.log('==============================================================================\n');

  if (!command) {
    console.log('HƯỚNG DẪN SỬ DỤNG:');
    console.log('  • Tra cứu từ khóa bất kỳ:       node code_index.js <từ khóa>');
    console.log('  • Chẩn đoán khi gặp lỗi:        node code_index.js --error <mô tả lỗi>');
    console.log('  • Liệt kê toàn bộ mã lỗi:       node code_index.js --list-errors');
    console.log('  • Tra cứu theo số dòng của file: node code_index.js --line <tên file> <số dòng>');
    console.log('  • In toàn bộ mục lục codebase:  node code_index.js --all\n');
    console.log('Ví dụ:');
    console.log('  node code_index.js MorphCheckbox');
    console.log('  node code_index.js --error "ô vuông tĩnh"');
    console.log('  node code_index.js --line VirtualizedGrid.tsx 365\n');
  } else if (command === '--list-errors') {
    console.log('🚨 DANH MỤC MÃ LỖI & SỰ CỐ ĐÃ ĐƯỢC CHUẨN HÓA:\n');
    CODE_DICTIONARY.errors.forEach((err, idx) => {
      console.log(`${idx + 1}. [${err.code}] ${err.title}`);
      console.log(`   • Triệu chứng: ${err.symptom}`);
      console.log(`   • Vị trí     : ${err.location.file} (Dòng ${err.location.startLine} - ${err.location.endLine})`);
      console.log(`   • Nguyên nhân: ${err.rootCause}`);
      console.log(`   • Hướng xử lý: ${err.solution ? err.solution.join(' ') : err.fixGuideline || ''}\n`);
    });
  } else if (command === '--error') {
    const errQuery = args.slice(1).join(' ');
    console.log(`🔍 KẾT QUẢ CHẨN ĐOÁN CHO: "${errQuery}"\n`);
    const results = diagnoseError(errQuery);
    if (results.length === 0) {
      console.log('Không tìm thấy mã lỗi khớp chính xác. Hãy thử từ khóa ngắn hơn (ví dụ: "ô vuông", "cuộn", "ghim").');
    } else {
      results.forEach(err => {
        console.log(`🚨 MÃ LỖI: ${err.code}`);
        console.log(`📌 TIÊU ĐỀ: ${err.title}`);
        console.log(`⚠️ TRIỆU CHỨNG: ${err.symptom}`);
        console.log(`📍 VỊ TRÍ: ${err.location.file} (Dòng ${err.location.startLine} - ${err.location.endLine})`);
        console.log(`⚙️ HÀM/CONTROL LIÊN QUAN: ${err.location.anchorFunction}`);
        console.log(`🔬 NGUYÊN NHÂN GỐC RỄ: ${err.rootCause}`);
        console.log('🛠️ CÁCH XỬ LÝ TRIỆT ĐỂ:');
        if (err.solution) {
          err.solution.forEach(s => console.log(`   ${s}`));
        } else if (err.fixGuideline) {
          console.log(`   ${err.fixGuideline}`);
        }
        console.log(`📋 QUY TẮC LIÊN QUAN: ${err.ruleReference}\n`);
      });
    }
  } else if (command === '--line') {
    const fileName = args[1];
    const lineNum = args[2];
    if (!fileName || !lineNum) {
      console.log('Cú pháp: node code_index.js --line <tên file> <số dòng>');
      console.log('Ví dụ  : node code_index.js --line VirtualizedGrid.tsx 365');
    } else {
      const res = findByLine(fileName, lineNum);
      if (!res) {
        console.log(`Không tìm thấy file hoặc thông tin phân đoạn cho ${fileName} tại dòng ${lineNum}.`);
      } else {
        console.log(`📍 FILE: ${res.fileName} - DÒNG ${res.line}`);
        console.log(`📌 PHÂN ĐOẠN: ${res.section.category}`);
        if (res.section.functions) console.log(`   Hàm trong phân đoạn: ${res.section.functions.join(', ')}`);
        if (res.relatedFunc) {
          console.log(`\n⭐ HÀM GẦN NHẤT: ${res.relatedFunc.name} (Dòng ${res.relatedFunc.line})`);
          console.log(`   Mục đích: ${res.relatedFunc.desc}`);
        }
      }
    }
  } else if (command === '--all') {
    CODE_DICTIONARY.files.forEach(f => {
      console.log(`📁 File: ${f.fileName} (${f.totalLines} dòng)`);
      console.log(`   Mô tả: ${f.description}`);
      console.log('   --------------------------------------------------------------------------');
      f.sections.forEach(s => {
        console.log(`   📌 [${s.lineRange.padEnd(15)}] : ${s.category}`);
        if (s.functions) console.log(`      • Hàm/Hệ thống: ${s.functions.join(', ')}`);
        console.log('');
      });
      console.log('==============================================================================\n');
    });
  } else {
    // Tra cứu từ khóa thông thường
    const query = args.join(' ');
    console.log(`🔍 KẾT QUẢ TRA CỨU TỪ ĐIỂN CHO: "${query}"\n`);
    const results = searchDictionary(query);

    let hasResult = false;

    if (results.errors.length > 0) {
      hasResult = true;
      console.log('🚨 MÃ LỖI LIÊN QUAN:');
      results.errors.forEach(err => {
        console.log(`   • [${err.code}] ${err.title}`);
        console.log(`     Vị trí: ${err.location.file} (Dòng ${err.location.startLine} - ${err.location.endLine})`);
        console.log(`     Hàm: ${err.location.anchorFunction}`);
        console.log(`     Triệu chứng: ${err.symptom}\n`);
      });
    }

    if (results.concepts.length > 0) {
      hasResult = true;
      console.log('💡 KHÁI NIỆM & CƠ CHẾ KIẾN TRÚC:');
      results.concepts.forEach(c => {
        console.log(`   • ${c.term} (${c.vietnameseName}):`);
        console.log(`     ${c.description}`);
        console.log(`     Vị trí: ${c.keyLines}\n`);
      });
    }

    if (results.functions.length > 0) {
      hasResult = true;
      console.log('⚙️ HÀM & CONTROLS LIÊN QUAN:');
      results.functions.slice(0, 15).forEach(f => {
        console.log(`   • ${f.name.padEnd(28)} [Dòng ${String(f.line).padStart(4)} in ${f.file}] : ${f.desc}`);
      });
      if (results.functions.length > 15) {
        console.log(`     ... và còn ${results.functions.length - 15} hàm khác.`);
      }
      console.log('');
    }

    if (results.cssTokens.length > 0) {
      hasResult = true;
      console.log('🎨 BIẾN CSS THEME TOKENS:');
      results.cssTokens.forEach(t => {
        console.log(`   • ${t.token.padEnd(22)} : ${t.desc} (Light: ${t.defaultLight}, Dark: ${t.defaultDark})`);
      });
      console.log('');
    }

    if (results.files && results.files.length > 0) {
      hasResult = true;
      console.log('📁 FILE & MỤC LỤC TÀI LIỆU LIÊN QUAN:');
      results.files.forEach(f => {
        console.log(`   • ${f.fileName.padEnd(35)} (${f.totalLines} dòng) : ${f.description}`);
      });
      console.log('');
    }

    if (!hasResult) {
      console.log('Không tìm thấy kết quả phù hợp. Bạn có thể:');
      console.log('  • Dùng `node code_index.js --list-errors` để xem danh mục lỗi');
      console.log('  • Dùng `node code_index.js --all` để duyệt toàn bộ mục lục phân đoạn dòng');
    }
  }
}

export default CODE_DICTIONARY;
