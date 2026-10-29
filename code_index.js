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
    lastUpdated: '2026-10-27',
    filesSummary: {
      'src/App.tsx': { lines: 2027, role: 'Main Application Shell: nạp 50.000 bản ghi dữ liệu từ apiService.fetchGridData(50000), xuất Excel qua apiService.exportGridExcelApi() hỗ trợ 2 tầng Banded Headers, phân tầng dòng nhóm (Group Header) và AutoFilter có sẵn, lưu trữ bền vững cấu hình cột, surfaceTheme & rowSnapMode qua localStorage (agv_mock_grid_config_v2026) với debounce 150ms (saveColWidthsTimerRef) cho colWidths tránh nghẽn I/O khi kéo giãn cột 60fps, đồng bộ dynamicColumnGroups theo columnOrder và hỗ trợ kéo thả đổi vị trí cột đơn, cột con trong nhóm 2 tầng, cả nhóm Band/Atomic và tự động đồng bộ vùng ghim trong handleReorderColumns, ưu tiên phản hồi gõ tìm kiếm 0ms qua deferredSearchQuery (useDeferredValue), hỗ trợ bật/tắt Cuộn khớp dòng (rowSnapMode, mặc định true ở nấc 3d rowsPerWheelStep = 3) từ AdvGridSettingsPopup, gắn agv-app-container + getThemeClass(surfaceTheme) trên container gốc đồng bộ 100% theme cho PageToolbar & PageFooter, tính toán động tổng toán tử theo cột (columnSums) với bộ đệm uncheckedBaseGroupData O(1) 0ms khi bỏ chọn về 0 dòng và fast-path O(K) theo checkedRowIndices, hỗ trợ Shift + Click chọn/bỏ chọn dải dòng liên tiếp theo thứ tự đang hiển thị và Bỏ chọn tất cả dòng (handleClearCheckedRows), bật/tắt 1 chạm "Chỉ hiện các dòng đang chọn" qua handleToggleFilterCheckedOnly dưới PageFooter, đồng bộ màu chữ ô STT (--agv-stt-cell-text) phục vụ hiệu ứng Đầu kim Focus Kiểu A, cố định useCallback cho các handlers của PageToolbar bảo toàn 100% React.memo, quản lý React State chuẩn mảng Plain JSON, renderCell trực tiếp từ row[col.key] với WeakMap cache 12 tháng (monthStatsCacheRef), selectedDisplayIndexHintRef tra cứu O(1) dòng đang chọn không cần quét tuyến tính 50.000 phần tử, truyền trực tiếp getRowVal vào evaluateQueryTreeNode (zero closure allocation), tái sử dụng trực tiếp hiddenColKeys Set, đồng bộ cập nhật col_formula theo formulaMode trong handleCellChange, chuẩn hóa 100% SURFACE_THEMES, PIN_POSITIONS, GRID_EDIT_MODES, CHECK_FILTER_STATES, DATA_TYPES, FILTER_MODES, SORT_DIRECTIONS, FORMULA_MODES, MONTH_ANALYTICS_MODES và biến màu CSS var(--agv-*), Sort pipeline Int32Array, Single-Pass Stream Grouping & Summaries Float64Array, virtualized scroll engine CHUNK = 20' },
      'src/services/apiService.ts': { lines: 988, role: 'RESTful API Service Layer: fetchGridData(count = 50000) trả về Promise<GridRecord[]> chứa 50.000 bản ghi Plain JSON objects, updateGridRecordApi(id, colKey, val), exportGridExcelApi(params) sinh tệp Excel .xlsx chuẩn OpenXML thuần native (zero-dependency) có nén Deflate (Method 8) giảm dung lượng 50.000 dòng từ 37.2 MB xuống còn ~1.6 MB (tiết kiệm 95% dung lượng), định dạng ngày/giờ chuẩn Excel Serial Number và numFmt giúp AutoFilter của Excel tự động nhận diện 100% Date Filters & cây phân cấp Năm/Tháng/Ngày, mặc định kẻ viền (border) toàn bộ các ô, tắt đường lưới Excel (showGridLines="0"), tô màu Header 2 tầng (Navy #0F172A & Slate #1E293B, chữ trắng in đậm), dòng nhóm Group Header nền #F1F5F9 in đậm kèm tổng sum số, bật sẵn AutoFilter của Excel trên hàng cột con, format chuẩn số #,##0 / #,##0.00 và ngày DD/MM/YYYY chống tràn ###, hỗ trợ async/await kết nối API backend thật bằng fetch("/api/v1/..."), tái xuất khẩu FORMULA_MODES, MONTH_ANALYTICS_MODES từ types.ts (100% biến màu CSS var(--agv-*)), định nghĩa INITIAL_COLUMNS (100% ALIGNMENTS, DATA_TYPES, EDITOR_TYPES), BASE_GROUPS_DEF, FilterState, REGIONS' },
      'src/demo/airlineData.ts': { lines: 272, role: 'Định nghĩa 23 cột dữ liệu thực tế từ ExGD-24-10-2026.xlsx với 100% tiêu đề tiếng Việt chuẩn, TOTAL_AIRLINE_ROWS = 339737, chuẩn hóa 100% ALIGNMENTS và DATA_TYPES, xuất LEGACY_KEY_MAP, matchAirlineFilterValue ủy quyền trực tiếp sang matchFilterValue của gridUtils, col_stt (46px, resizable: false) và col_chk (32px, title rỗng, resizable: false)' },
      'src/demo/PageToolbar.tsx': { lines: 572, role: 'Top command bar (bọc React.memo): tiêu đề Hạ Tầng Điện Toán Đám Mây (50.000 Dòng), nút chuyển đổi chế độ 13 Cột <-> 2 Cột Chart chuẩn hóa MONTH_ANALYTICS_MODES, nút Xoay vòng Công thức FORMULA_MODES, Dòng Lọc toggle button (badge 100% var(--agv-accent-text)), Theme switcher chuẩn hóa SURFACE_THEMES, Segmented Control 3 tương tác chuẩn hóa GRID_EDIT_MODES, SORT_DIRECTIONS, đã gỡ bỏ cụm nút Khớp Dòng trên giao diện chính, 100% biến màu CSS var(--agv-*), đã gỡ sạch toàn bộ title tooltip, tích hợp NO_AUTOFILL_PROPS' },
      'src/demo/FilterModal.tsx': { lines: 281, role: 'Modal lọc nâng cao 5 tiêu chí: nạp FilterState, REGIONS từ apiService, chuẩn hóa SURFACE_THEMES và 100% biến màu CSS var(--agv-*), click outside backdrop auto-close' },
      'src/components/grid/VirtualizedGrid.tsx': { lines: 2501, role: 'Core Virtualized Grid Engine: Tự động cung cấp các fallback mặc định giúp bảng Zero-Config, chuẩn hóa 100% SURFACE_THEMES, CENTER_DOCK_STATUSES, DENSITY_MODES, GRID_EDIT_MODES, DATA_TYPES, PIN_POSITIONS, SORT_DIRECTIONS, FILTER_MODES, CONTEXT_MENU_TYPES, tích hợp các custom hooks chuyên trách (useColumnResize, useColumnAutoFit, useInCellEditor), tích hợp động cơ trượt dòng FLIP khi Sort chuẩn AG Grid (useLayoutEffect 300ms cubic-bezier(0.22, 1, 0.36, 1) qua prevRowIndexMapRef & computeSortRowFlipState, tạm bật data-agv-sorting="true" trong 320ms rồi dọn sạch transform bảo toàn 100% position: sticky và contain: strict), đồng bộ effectiveColumnGroups theo thứ tự mảng columns hiện hành đảm bảo kéo thả đổi vị trí cột & nhóm Band phản hồi tức thì, đồng bộ gridSettings.rowSnapMode với prop rowSnapMode / onRowSnapModeChange qua handleUpdateGridSettings, cố định tham chiếu setColWidth / setMultipleColWidths qua colWidthsRef khi kéo giãn cột, tự động gắn cờ DOM data-agv-scrolling="true" qua isScrollingAttrSetRef trên .agv-scroll-viewport khi đang cuộn nhanh / auto-scroll để khóa tính toán :hover chống sụt FPS, in-cell editing scroll lock, dính tiêu đề nhóm trên đỉnh khi cuộn dọc (Sticky Group Header), ghim dòng cố định lên đầu bảng (Pin Row to Top) đồng bộ với AdvCriteriaSummaryPopup qua GridFilterRow, chuyển tiếp checkedRowCount & onClearCheckedRows sang ColumnContextMenu, điều hướng dòng bằng bàn phím cố định listener qua keyNavStateRef (ArrowUp, ArrowDown, PageUp, PageDown, Space), fit STT và Chọn, truyền hasFilterRow={showFilterRow} sang GridHeader để điều phối đường kẻ 2px phân tách hệ thống & dữ liệu, cố định handleToggleQuickFilterSmart bảo toàn React.memo cho GridFloatingToolbar, phím tắt Alt + Shift + F Fullscreen toggle, CHUNK = 20' },
      'src/components/grid/GridFloatingToolbar.tsx': { lines: 580, role: 'Thanh công cụ nổi (Right-docked Floating Toolbar): 6 nút chuẩn Toolbar3, 4 popups, chuẩn hóa 100% SURFACE_THEMES, TOOLBAR_POPUPS enum và DATA_TYPES, áp dụng Code Splitting (React.lazy + Suspense) tải động cho 2 modals lớn (AdvColumnChooserModal, AdvGridQueryBuilderModal) giảm >51KB main bundle, Toggle On/Off luân chuyển, click outside toàn màn hình tự đóng khi click ra ngoài bảng, drag handle kẹp biên trong Grid, giữ nguyên bung rộng 38px khi kéo thả, computePopupGeometry giới hạn chiều cao chống tràn viền Grid & Viewport, Alt + Shift + F toàn màn hình, Ctrl+F Quick Search, Esc đóng popups' },
      'src/components/grid/floating/AdvQuickFilterFlyout.tsx': { lines: 111, role: 'Popup 1: Tìm kiếm nhanh flyout sang trái, Smart mode toggle, debounce 250ms, autoFocus, Esc đóng, chuẩn hóa luxury shadow theo phong cách nút lọc STT, đã gỡ sạch title tooltip, tích hợp NO_AUTOFILL_PROPS' },
      'src/components/grid/floating/AdvGridQueryBuilderModal.tsx': { lines: 1522, role: 'Popup 2: Bộ lọc nâng cao cây điều kiện lồng nhau VÀ/HOẶC: chuẩn hóa 100% SURFACE_THEMES, QUERY_COMBINATORS, FILTER_OPS, FILTER_MODES, DATA_TYPES, tái sử dụng formatQueryRuleSummary từ queryUtils, tích hợp MorphChevronIcon trong QueryCustomSelect, LEVEL_PAREN_COLORS dùng 100% biến CSS var(--agv-*), tuân thủ tuyệt đối Rules of Hooks, đếm chính xác 100% matchCount trên toàn bộ 50.000 dòng, tích hợp NO_AUTOFILL_PROPS cho toàn bộ 6 ô input, tải động qua React.lazy, ẩn chữ ô toán tử (iconOnly: chỉ hiện icon SVG và MorphChevronIcon gọn gàng 44px, đã gỡ sạch title tooltip), nút SVG ListFilter mở AdvMultiFilterPopup, QueryCustomSelect hỗ trợ coords.isFlipUp, agv-spring-up/down và luxury shadow' },
      'src/components/grid/floating/AdvColumnChooserModal.tsx': { lines: 1071, role: 'Popup 3: Tùy chọn cột tinh gọn: chuẩn hóa 100% Data-Driven, tải động qua React.lazy, chuẩn hóa bo góc rounded-md (6px), chuẩn hóa luxury shadow theo phong cách nút lọc STT, đã xóa toàn bộ title tooltip, tích hợp NO_AUTOFILL_PROPS, chống thu gọn khi đang kéo di chuyển vị trí, đồng bộ orderedRawColumns theo thứ tự dataColumns và đo tọa độ tâm thực tế measureSiblingMidpoints giúp kéo thả sắp xếp translateY mượt mà cho cả cột đơn, cột con và nhóm Band/Atomic đang mở rộng, giới hạn chiều cao nằm gọn trong Grid' },
      'src/components/grid/AdvCheckbox.tsx': { lines: 60, role: 'Hệ thống Checkbox chuẩn AdvCheckbox hỗ trợ checked, indeterminate (gạch ngang), hover focus và theme CSS variables (đã gỡ title tooltip)' },
      'src/components/grid/floating/AdvGridSettingsPopup.tsx': { lines: 113, role: 'Popup 4: Cài đặt bảng dữ liệu tinh gọn (tái sử dụng MorphCheckbox chuẩn của hệ thống, chuẩn hóa bo góc rounded-md 6px, chuẩn hóa luxury shadow theo phong cách nút lọc STT, đã gỡ sạch title tooltip): Cột số thứ tự, Cột chọn dòng, Dòng công thức, Dòng chọn trang, Cuộn khớp dòng (rowSnapMode)' },
      'src/components/grid/floating/queryUtils.ts': { lines: 669, role: 'Hàm lượng giá và xử lý chuỗi CMD Query Tree: chuẩn hóa 100% QUERY_COMBINATORS, FILTER_OPS enum, DATA_TYPES, QUERY_OP_DISPLAY_MAP, formatQueryRuleSummary, hỗ trợ multiValues và multiRanges, parseCmdToQueryTree, validateQueryTreeAgainstColumns, evaluateQueryTreeNode, evaluateValueCondition, generateNaturalLanguage' },
      'src/components/grid/GridHeader.tsx': { lines: 566, role: 'Header component: linh hoạt 1 tầng (34px) hoặc 2 tầng (64px), chuẩn hóa DRY qua renderHeaderCellContent & createDragProps gom toàn bộ xử lý kéo thả cột/nhóm cho cả 5 vùng (Pinned Left, Middle Standalone, Middle Band Tier-1 Group, Middle Band Tier-2 Child, Pinned Right) với draggingColKeyRef, dọn sạch 100% import thừa, chuẩn hóa 100% PIN_POSITIONS, CENTER_DOCK_STATUSES, DATA_TYPES, FILTER_MODES, SORT_DIRECTIONS và biến màu var(--agv-accent) cho thanh kéo cột (loại bỏ hoàn toàn text & màu hardcode), nhận prop hasFilterRow để tự động chuyển viền đáy thành 1px border-b khi có hàng lọc, đã gỡ sạch 100% title tooltip, tối ưu padding px-0.5 cho STT và Chọn, xóa chữ tiêu đề cột Chọn, ẩn thanh resize handle cho STT và Chọn, vô hiệu hóa chuột phải trên cột STT và Chọn, tích hợp MorphSortIcon biến hình lò xo ArrowUp <-> ArrowDown ASC/DESC mượt mà' },
      'src/components/grid/GridFilterRow.tsx': { lines: 1306, role: 'Inline Filter Row component: trang bị đường kẻ 2px đáy (border-b-2 border-b-[var(--agv-border-strong)]) trên cả khung container lẫn từng cell (STT, Chọn, Không lọc, Data) để phân tách rõ ràng dứt khoát giữa dòng hệ thống và khối dữ liệu, chuẩn hóa 100% SURFACE_THEMES, CENTER_DOCK_STATUSES, FILTER_OPS, CHECK_FILTER_STATES, DATA_TYPES, FILTER_MODES, PIN_POSITIONS và helper predicates, tích hợp NO_AUTOFILL_PROPS cho toàn bộ 6 ô input, áp dụng 100% Design Tokens Tailwind (bg-agv-accent, text-agv-accent-text, text-agv-accent), hiển thị tổng Sum columnSums cho các cột number kèm đổi màu chữ sang var(--agv-accent) khi đang tính theo dòng chọn (hasCheckedRows), đã gỡ sạch 100% title tooltip, tối ưu padding px-0.5 cho ô STT và Chọn, click/tái nhấn ô STT bật/tắt AdvCriteriaSummaryPopup (gồm cả dòng đang ghim pinnedRows), nút toán tử lọc hỗ trợ Toggle On/Off luân chuyển, tích hợp agv-spring-up/down, tự động lật flip-up và luxury shadow' },
      'src/components/grid/AdvCriteriaSummaryPopup.tsx': { lines: 606, role: 'Popup tập hợp tiêu chí tinh gọn: chuẩn hóa 100% SURFACE_THEMES, CHECK_FILTER_STATES, DATA_TYPES, EDITOR_TYPES, FILTER_MODES, SORT_DIRECTIONS, đã gỡ sạch title tooltip, Segmented Chip layout theo mockup cho 8 nhóm tiêu chí (bao gồm DÒNG ĐANG GHIM pinnedRows), tích hợp spring directional popup (agv-spring-down / agv-spring-up), chuẩn hóa toàn bộ nút xóa chip bằng Lucide Icon X, bỏ header thừa và nút đóng, tái nhấn nút STT để tắt popup, Tìm giá trị theo và Cây điều kiện bỏ tag xanh hiển thị trực tiếp giá trị/công thức, chuẩn hóa ngày DD/MM/YYYY cho toán tử between, chỉ hiện danh mục có tiêu chí, xóa từng mục riêng lẻ hoặc xóa tất cả, neo dưới ô STT dòng lọc, 100% theme CSS variables, luxury shadow, min-height 28px' },
      'src/components/grid/AdvMultiFilterPopup.tsx': { lines: 901, role: 'Popup lọc nhiều điều kiện OR / AND (IN / NOT IN clause) khi chuột phải vào ô filter trên GridFilterRow hoặc bấm nút SVG trên QueryBuilder: chuẩn hóa 100% SURFACE_THEMES, DATA_TYPES, EDITOR_TYPES, FILTER_MODES, FILTER_OPS, Lucide Icons (X, Check), MorphChevronIcon và biến CSS var(--agv-danger), tích hợp {...NO_AUTOFILL_PROPS} cho toàn bộ 4 ô input dải số/giờ và 3 ô textarea đa dòng, đã gỡ sạch title tooltip, tính toán vị trí động neo dính sát nút bấm, onApply bảo toàn selectedValues & includeBlanks, menu toán tử Portal document.body tích hợp agv-spring-up/down và luxury shadow, logic phủ định AND loại trừ chuẩn De Morgan cho toán tử Khác (≠) và Không chứa, xóa sạch dòng đếm trung gian, khống chế max-h kéo dọc textarea (max 220px)' },
      'src/components/grid/FilterIcons.tsx': { lines: 410, role: '15 DevExtreme SVG filter operation vector icons (stroke=currentColor), chuẩn hóa 100% DATA_TYPES và FILTER_OPS, hàm duy nhất toàn hệ thống getAllowedFilterOpsForColumn & getDefaultFilterOpForColumn đồng bộ danh sách toán tử nhạy theo hasColumnEmptyCells, getColumnFilterType, FILTER_OP_META labels & allowed operations by data type định nghĩa 100% qua FILTER_OPS' },
      'src/components/grid/GridRow.tsx': { lines: 1030, role: 'Individual row renderer: chuẩn hóa 100% CENTER_DOCK_STATUSES, ALIGNMENTS, DATA_TYPES, EDITOR_TYPES, PIN_POSITIONS, GRID_EDIT_MODES, gắn class .agv-grid-row / .agv-group-row cùng data-row-key, data-row-idx, data-row-parity, data-row-focused, data-row-checked và data-cell-role (stt/chk/data) phục vụ hiệu ứng trượt dòng FLIP khi Sort chuẩn AG Grid, phân biệt Focus/Chọn Kiểu A và hiệu ứng rê chuột phủ màu nhẹ toàn dòng Zero-Reflow qua kế thừa biến CSS cấp dòng (--agv-row-data-bg, --agv-row-sticky-bg, --agv-group-row-bg), tích hợp hiệu ứng xuất hiện mượt mà agv-row-enter kèm stagger nhẹ theo vị trí dòng trong chunk ((rowIndex % 20) * 4ms), tích hợp CellEditor thông minh cho vùng số (chặn 100% chữ cái rác, cho phép phím tắt 1k/1tr/1b, mở rộng tự động và lưu số number), đồng bộ viền border-2 border-agv-accent và cỡ chữ 12px (text-xs) cho 100% các In-Cell Editors (CellEditor, DateCellEditor, DateRangeCellEditor, TimeCellEditor, ComboBox, LookUp) loại bỏ thụt lề p-0.5, tích hợp NO_AUTOFILL_PROPS và getGridControlRadiusClass() đồng bộ bo góc 6px, render Group Header Row với MorphChevronIcon biến hình lò xo, mở/đóng titleColSpan Toolbar3 (diff=0px), sticky cells' },
      'src/components/ui/AdvDatePicker.tsx': { lines: 662, role: 'Single DatePicker component & Barrel entry point cho bộ DatePicker suite: đã phân rã gọn gàng thành 5 sub-modules trong src/components/ui/datepicker/ (datePickerStyles.ts, datePickerUtils.ts, AdvCalendarPrimitives.tsx, AdvDatePresetSelect.tsx, AdvDateRangePicker.tsx), chuẩn hóa SURFACE_THEMES, hỗ trợ agv-incell-datepicker, NO_AUTOFILL_PROPS, 4 Themes, min-h 28px, re-export đầy đủ 100% API đảm bảo tương thích ngược' },
      'src/components/ui/datepicker/datePickerUtils.ts': { lines: 945, role: 'Module toán học ngày tháng, regex, format/parse (formatGridDateValue, parseDMYToDate, computePresetDateRange, normalizePresetList, getPresetLabel), buildCalendarCells, usePopupDismiss, computeCalendarCoords và computeDropdownMenuCoords, chuẩn hóa SURFACE_THEMES' },
      'src/components/ui/datepicker/AdvCalendarPrimitives.tsx': { lines: 340, role: 'Module chứa các UI Primitives dùng chung cho lịch: TimePickerBlock (chọn giờ:phút HH:mm) và AdvDevExpressCalendarBody (ma trận lịch Ngày/Tháng/Năm phong cách DevExpress)' },
      'src/components/ui/datepicker/AdvDatePresetSelect.tsx': { lines: 795, role: 'Module chọn mốc thời gian nhanh (AdvDatePresetSelect): chuẩn hóa SURFACE_THEMES, hỗ trợ chọn đơn/đa mốc Năm/Quý/Tháng thông minh, tự động lọc theo min/max dữ liệu' },
      'src/components/ui/datepicker/AdvDateRangePicker.tsx': { lines: 1040, role: 'Module chọn khoảng ngày kép (AdvDateRangePicker): chuẩn hóa SURFACE_THEMES, hỗ trợ lịch đôi dualMonth, tự động đảo chiều ngày khi chọn ngược, tích hợp chọn giờ và mốc nhanh' },
      'src/components/ui/datepicker/datePickerStyles.ts': { lines: 712, role: 'Module quản lý CSS động cho DatePicker: hàm ensureDatePickerStyles() inject keyframes và biến CSS ánh xạ trực tiếp từ LIGHT_THEME_TOKENS, DARK_THEME_TOKENS, BEZIER_ARTHOUSE_THEME_TOKENS, EINK_PAPER_THEME_TOKENS theo 4 themes, hỗ trợ agv-incell-datepicker đồng bộ viền 2px accent và cỡ chữ 12px với CellEditor (loại bỏ shadow)' },
      'docs/BACKEND_ARCHITECTURE_100K_USERS.md': { lines: 424, role: 'Tài liệu thiết kế kiến trúc hệ thống 100k người dùng: Cụm NestJS + Podman, BullMQ Worker xuất Excel ngầm, PostgreSQL 16 + PgBouncer, Managed Redis 1GB, Cloudflare R2 Storage (Zero Egress Fee), Frontend TAURI v2 cho Windows (Multi-Tab Keep-Alive 0ms), tích hợp MCP (Model Context Protocol) Server cho AI Agents' },
      'docs/DEEP_PAGINATION_AND_VIRTUAL_SCROLLING_TECHNIQUES.md': { lines: 219, role: 'Tài liệu kỹ thuật chuyên sâu về 2 kỹ thuật giải quyết bài toán Deep Pagination (OFFSET lớn) và Hao hụt dòng khi ảo hóa bảng dữ liệu lớn: Kỹ thuật 1 Deferred Join (quét trên B-Tree Index RAM buffer nhanh gấp 50-100 lần) và Kỹ thuật 2 Mảng ID Snapshot trong RAM Redis (Enterprise Standard: cắt lát mảng 0.01ms, triệt tiêu 100% lỗi hao hụt dòng khi nhảy cóc/xóa cứng)' },
      'src/components/grid/hooks/useColumnResize.ts': { lines: 337, role: 'Động cơ resize siêu tốc Viewport-Culled 120fps từ bản 7: phân tách DOM nodes thành visibleTargetCells (~20-25 ô trong màn hình) và overscanTargetCells, cập nhật trực tiếp style trong lúc di chuột (giảm 85% chi phí reflow, <0.04ms/frame), đồng bộ co giãn ô tiêu đề dòng nhóm [data-group-span-keys] theo thời gian thực 1:1 cùng tay chuột, giữ sáng vạch chỉ báo 2px [data-resizing-active="true"] màu accent, khóa pointer-events và transition trên viewport, chỉ gọi setColWidth đồng bộ React state và localStorage đúng 1 lần duy nhất khi nhả chuột (mouseup)' },
      'src/components/grid/hooks/useColumnAutoFit.ts': { lines: 128, role: 'Custom Hook chuyên trách vừa độ rộng tối ưu: quản lý canvas text measurement, collectColSummaryVals tính cả tổng nhóm và tổng bảng, handleAutoFitColumn, handleAutoFitAllColumns, handleAutoFitBandColumns' },
      'src/components/grid/hooks/useInCellEditor.ts': { lines: 98, role: 'Custom Hook chuyên trách sửa ô in-cell: quản lý activeEditingCell, handleStartEditCell, handleEndEditCell, In-Cell Editing Scroll Lock và Global Event Lock' },
      'test/run_tests.mjs': { lines: 59, role: 'Native Test Runner siêu tốc: sử dụng Vite programmatic API biên dịch TypeScript không cần external packages, thực thi unit tests qua Node.js native test runner' },
      'src/components/ui/AdvComboBoxEdit.tsx': { lines: 335, role: 'Hộp chọn ComboBoxEdit chuẩn Animate UI (Base UI architecture): chuẩn hóa SURFACE_THEMES, nhấn vào là mở popup tức thì, loại bỏ 100% icon thừa trên ô nhập, lọc tức thì, phím mũi tên Lên/Xuống/Enter/Esc, viền active border-2 border-[var(--agv-accent)] tràn khít cell, min-h 28px, 100% theme CSS variables, zero autofill với NO_AUTOFILL_PROPS, tích hợp isFlipUp, spring-up/down và luxury shadow, popup scroll lock' },
      'src/components/ui/AdvSearchLookUpEdit.tsx': { lines: 766, role: 'Bảng tra cứu danh mục LookUp nhiều cột: chuẩn hóa 100% SURFACE_THEMES, ALIGNMENTS, DATA_TYPES, FILTER_OPS và tích hợp getAlignTextClass, chuẩn hóa bo góc rounded-md (6px), viền active border-2 border-[var(--agv-accent)] tràn khít cell, nhấn vào ô mở popup tức thì, loại bỏ 100% icon thừa trên ô kích hoạt, Find panel trên đầu, Filter Row từng cột, đã xóa hoàn toàn thanh footer đáy, hỗ trợ Chọn đơn & Chọn nhiều + Checkbox (multiSelect=true) tích hợp Lucide Icon Check, tích hợp isFlipUp, spring-up/down và luxury shadow, tích hợp NO_AUTOFILL_PROPS, min-h 28px' },
      'src/components/ui/enterpriseEditorUtils.ts': { lines: 152, role: 'Tiện ích enterprise editor: chuẩn hóa SURFACE_THEMES, getPortalThemeVars (bao phủ toàn diện --agv-bg-popup, --agv-bg-panel, --agv-bg-surface, --agv-bg-subtle, --agv-trend-up, --agv-trend-down, --agv-danger, --agv-weekend), computeEditorCoords, useClickOutside, normalizeSearchText' },
      'src/components/ui/AdvPopover.tsx': { lines: 184, role: 'Primitive Popover chuẩn Animate UI (Base UI): chuẩn hóa SURFACE_THEMES, trigger click toggle, tính tọa độ đồng bộ trước khi mở, loại bỏ hoàn toàn lỗi bay/trượt từ góc trái trên (0,0) xuống, Portal document.body, spring animation agv-spring-down/up, flip-up thông minh, useClickOutside, data-agv-popup="true" khóa cuộn bảng, 100% theme tokens' },
      'src/components/ui/AdvSelect.tsx': { lines: 266, role: 'Primitive Select (Dropdown chọn 1 giá trị thuần túy): chuẩn hóa SURFACE_THEMES, tách từ nền tảng Combobox, mở tức thì khi click, điều hướng phím Lên/Xuống/Enter/Esc, check icon Lucide, mục active nền var(--agv-accent) chữ trắng, min-h 28px, Portal, spring animation' },
      'src/components/ui/AdvHoverCard.tsx': { lines: 146, role: 'Primitive Hover Card: chuẩn hóa SURFACE_THEMES, mở khi rê chuột với openDelay 150ms và closeDelay 200ms chống nhấp nháy, Portal document.body, spring animation, kẹp biên màn hình, tự đóng khi cuộn trang' },
      'src/components/ui/AdvTooltip.tsx': { lines: 133, role: 'Primitive Tooltip chuẩn Base UI Motion: chuẩn hóa SURFACE_THEMES, Portal document.body, spring keyframes agv-tooltip-spring-up/down, SVG arrow định vị, tự động lật ngược, tự đóng khi cuộn' },
      'src/components/ui/AdvProgress.tsx': { lines: 77, role: 'Primitive Progress Bar: hiển thị tiến độ % với transition width 300ms ease, hỗ trợ chế độ indeterminate lướt sóng vô hạn khi tải dữ liệu, 100% theme tokens' },
      'src/components/ui/AdvPreviewLinkCard.tsx': { lines: 195, role: 'Primitive Preview Link Card: chuẩn hóa SURFACE_THEMES, thẻ xem trước liên kết web dạng card nổi khi rê chuột, hiển thị thumbnail, tiêu đề, mô tả và tên miền, mở link ngoài an toàn target="_blank"' },
      'src/components/ui/index.ts': { lines: 55, role: 'Barrel re-export sạch sẽ toàn bộ 8 controls và primitives UI chuẩn Animate UI' },
      'src/demo/AnimateUIPrimitivesDemoModal.tsx': { lines: 379, role: 'Showcase tương tác thử nghiệm trực tiếp 6 Primitives mới với đầy đủ dữ liệu mẫu và chuyển đổi theme, chuẩn hóa 100% biến màu CSS var(--agv-*)' },
      'src/components/grid/GridChunkBlock.tsx': { lines: 271, role: 'Virtualized chunk container (CHUNK = 20): gắn class .agv-chunk-block và truyền rowKey xuống GridRow, GPU transform translate3d, chuẩn hóa DATA_TYPES.SYSTEM, tracking isSelected & isChecked linh hoạt chuẩn Data-Driven qua chkCol và rowKey chống trôi khi sắp xếp, React.memo comparator kiểm tra phạm vi dòng [startRowIndex, endRowIndex] cho cả checkedRowIndices, selectedRowIndex và editingCell giúp bỏ qua 100% các chunk không bị ảnh hưởng, forwarding editing states & onGroupContextMenu callback, forwarding emptyColKeys' },
      'src/components/grid/ColumnContextMenu.tsx': { lines: 1163, role: 'Enterprise Context Menu: chuẩn hóa 100% CONTEXT_MENU_TYPES, PIN_POSITIONS, SORT_DIRECTIONS, DATA_TYPES, FORMULA_MODES và biến màu CSS var(--agv-warning) (loại bỏ sạch sẽ toàn bộ hardcode text và màu cứng), áp dụng 100% Design Tokens Tailwind (bg-agv-accent, text-agv-accent-text, bg-agv-bg-root, border-agv-border, text-agv-text-main, bg-agv-bg-hover), tích hợp nút 1 chạm đổi luân phiên 3 trạng thái sắp xếp theo tháng/theo số cho cột công thức khi ở MIN/MAX, nút ghim cột/tầng, thanh mỏng mũi tên biến hình lò xo MorphChevronIcon thu gọn/mở rộng, Menu Tiêu Đề Nhóm, nút chuyển đổi luân phiên Sắp xếp nhóm theo Tổng, Smart Disable Empty Columns, Row/Cell menu hỗ trợ Ghim dòng lên đầu / Bỏ ghim dòng / Bỏ ghim tất cả dòng / Bỏ chọn tất cả dòng (N) và "Lọc theo" đưa giá trị lên ô filter với toán tử =, 100% theme tokens, click outside auto-close' },
      'src/components/grid/gridUtils.ts': { lines: 1054, role: 'Utility engine: formatGridNumber chuẩn tài chính #,###.## (số âm bỏ trong ngoặc đơn (1.000)), parseGridNumber thông minh nhận diện số âm ngoặc đơn và chuẩn chấm hàng nghìn (khắc phục triệt để lỗi 1k -> 1.000 -> 1), isSelectionColumn đóng gói chuẩn hóa kiểm tra cột chọn dòng (col.isSelection || col.key === "col_chk"), computeFilteredSelectionState tính toán trạng thái chọn tối ưu chỉ quét tập checkedRowIndices (k phần tử) khi không lọc thay vì quét 50.000 dòng, toggleFilteredRowsSelection (Fast-path O(1) trả về new Set() rỗng ngay lập tức khi bỏ chọn bảng không lọc thay vì chạy 50.000 lệnh .delete()), computeSortRowFlipState tính toán độ lệch dọc FLIP deltaY cho hiệu ứng trượt dòng khi Sort chuẩn AG Grid, chuẩn hóa 100% FILTER_OPS, DATA_TYPES, FILTER_MODES, SORT_DIRECTIONS, ALIGNMENTS, FORMULA_MODES enum và helper predicates (isNoInputFilterOp, isBetweenFilterOp, isNegativeFilterOp, createEqualsFilter, createContainsFilter, createBetweenFilter), tích hợp ALIGN_TEXT_CLASSES, getAlignTextClass, ALIGN_JUSTIFY_CLASSES, getAlignJustifyClass, matchFilterValue, splitDateRange, parseSingleDateTimestamp, parseTimeToMinutes, getGridCellValue, compareGridRows & getRowValueForSortGeneric, getColumnDateBoundsFromGetter, đo độ rộng tối ưu (auto-fit) cột tính luôn cả tổng nhóm groupSums và tổng bảng summaryValues, clipboard copier, boundary clamping' },
      'src/components/grid/types.ts': { lines: 355, role: 'TypeScript type definitions: SURFACE_THEMES, CENTER_DOCK_STATUSES, PIN_POSITIONS, SORT_DIRECTIONS, GRID_EDIT_MODES, FORMULA_MODES, MONTH_ANALYTICS_MODES, ALIGNMENTS, DATA_TYPES, EDITOR_TYPES, FILTER_MODES, CHECK_FILTER_STATES, FILTER_OPS (danh mục hằng số chuẩn hóa toàn hệ thống loại bỏ 100% hardcode text), FilterOperation, ColumnDef, SortConfig, ColumnEditorType, ColumnDataType, ColumnAlign, PinPosition, CenterDockStatus, SortDirection, FilterMode, CheckFilterState, GroupSortConfig, ColumnFilterValue, GridEditMode, VirtualizedGridProps (bao gồm rowSnapMode & onRowSnapModeChange)' },
      'src/components/grid/floating/types.ts': { lines: 116, role: 'Floating toolbar type definitions: QUERY_COMBINATORS, TOOLBAR_POPUPS, DENSITY_MODES, DensityMode, QueryRule, QueryGroup, QueryTreeNode, QueryPreset, FloatingPopupType, GridSettingsState (bao gồm rowSnapMode)' },
      'src/components/grid/AdvChecklistFilterPopup.tsx': { lines: 602, role: 'Popup lọc danh sách giá trị phân biệt (Checklist): chuẩn hóa SURFACE_THEMES, FILTER_MODES.MULTI, DATA_TYPES, đã gỡ sạch title tooltip, tích hợp NO_AUTOFILL_PROPS, tích hợp Lucide Icons (Search, X, FilterX), ưu tiên props.getDistinctValues chỉ hiển thị các giá trị từ các dòng thỏa mãn các bộ lọc đang active (AND logic chuẩn), bỏ qua _isGroupRow trong extractVal, nút SVG FilterX xóa các mục đã chọn ở góc phải ô tìm kiếm, tuân thủ Rules of Hooks, nhận matchFilterValue, tự động lọc danh sách giá trị theo điều kiện của RowFilter đang active (AND logic), bảo toàn độc lập không ghi đè RowFilter, 0ms phản hồi với distinctValuesCacheRef, ảo hóa 20 items' },
      'src/components/grid/constants.ts': { lines: 80, role: 'Grid constants & helpers: DEFAULT_CHUNK_SIZE = 20, DEFAULT_ROW_HEIGHT = 32, NO_AUTOFILL_PROPS (bộ 9 cờ chặn triệt để autofill của trình duyệt, 1Password, Bitwarden), GRID_CONTROL_RADIUS_CLASS & getGridControlRadiusClass() (hàm đồng bộ bo góc duy nhất cho toàn bộ Controls & Editors), POPUP_SELECTORS dùng chung cho In-Cell Editing và Popup Scroll Lock, getPinnedDividerClass, getRightPinnedDividerClass, getThemeClasses (kế thừa biến CSS cấp dòng --agv-row-data-bg & --agv-row-sticky-bg)' },
      'src/components/ui/MorphIcons.tsx': { lines: 172, role: 'Universal Morphicons adapter & spring physics suite: chuẩn hóa SORT_DIRECTIONS, tích hợp MorphCheckbox, MorphActionIcon, MorphSortIcon (ArrowUp <-> ArrowDown), MorphChevronIcon (ChevronRight <-> ChevronDown hoặc type down-up ChevronDown <-> ChevronUp) kết hợp mượt mà giữa morphicons và Lucide (đã gỡ title tooltip)' },
      'src/demo/PageFooter.tsx': { lines: 130, role: 'Bottom status bar (bọc React.memo): chuẩn hóa SORT_DIRECTIONS, hiển thị bộ đếm nhóm/dòng, trạng thái ghim cột, sắp xếp, nút 1 chạm Đã chọn: X dòng (min-h 28px, active nền var(--agv-accent) chữ trắng) để bật/tắt lọc chỉ hiện các dòng đang chọn và số Chunks đang vẽ' },
      'src/components/grid/smartNumberUtils.ts': { lines: 240, role: 'Bộ công cụ số thông minh: formatNumberWithCommas, parseSmartNumericRange, expandAllShortcuts, handleNumericKeyDown chặn chữ cái rác, đồng bộ 100% chuẩn phân cách hàng nghìn dấu chấm và thập phân dấu phẩy Việt Nam' },
      'src/demo/TwelveMonthChartCell.tsx': { lines: 358, role: 'Biểu đồ Sparkline 12 tháng: Sóng Catmull-Rom spline, cache DOMRect qua svgRectRef và chặn re-render thừa qua hoveredIdxRef khi rê chuột trong cùng tháng, tích hợp Animate UI Tooltip (Base UI + Motion style) qua Portal đồng bộ 100% biến màu theme (var(--agv-bg-popup), var(--agv-border-popup), getThemeClass & getPortalThemeVars) với Spring Physics keyframes agv-tooltip-spring-up/down, lướt trượt mượt mà (smooth sliding glide 120ms) khi di chuyển giữa các tháng, tự động đổi màu số liệu theo đốm cực đại (var(--agv-trend-up)) và cực tiểu (var(--agv-trend-down)) với viền var(--agv-bg-surface) trên đường line, SVG tooltip arrow, tự động lật ngược nếu gần mép trên (y < 65), kẹp biên an toàn, định dạng số formatGridNumber, tự đóng khi cuộn' },
      'src/themes/': { lines: 579, role: 'Design Tokens: SURFACE_THEMES, 4 themes (light, dark, bezierArthouse đã tinh chỉnh bgRowAlt/bgSelected/border, eink), khai báo đầy đủ --agv-bg-row-hover, --agv-bg-selected-hover, --agv-bg-focused, --agv-bg-focused-hover, --agv-bg-checked-focused, --agv-bg-checked-focused-hover, --agv-bg-panel, --agv-bg-surface, --agv-bg-subtle, --agv-bg-card, --agv-border-subtle, --agv-pinned-shadow, --agv-accent-soft, --agv-weekend, --agv-info trong common.ts, scrollbar tokens, generateThemeCssVariables helper, 100% biến màu CSS var(--agv-*)' },
      'src/index.css': { lines: 787, role: 'Global styles, font hệ thống chuẩn Montserrat (--font-sans), font đơn cách .agv-cell-code (JetBrains Mono, letter-spacing 0.08em, font-weight 600, uppercase), synchronized scrollbar, tích hợp Spring Directional Popups keyframes (down, up, left, zoom), Animate UI Tooltip keyframes agv-tooltip-spring-up/down, Subtle Virtualized Row Entry Animation (.agv-row-enter), quy tắc tạm mở contain: layout style trên .agv-chunk-block khi chạy FLIP Sort Animation (.agv-scroll-viewport[data-agv-sorting="true"]), [draggable="true"] (-webkit-user-drag: element) & cơ chế phân biệt dòng Focus / Chọn Kiểu A kết hợp Zero-Reflow Row Hover cấp dòng (.agv-grid-row / .agv-group-row) và tự động khóa :hover khi cuộn nhanh (.agv-scroll-viewport:not([data-agv-scrolling="true"]))' },
      'AGENTS.md': { lines: 26, role: 'Ponytail Senior Dev Guidelines, Recent Edits & Dictionary First & 14 Core Rules (bao gồm Strict Mockup Fidelity & Popup Scroll Lock)' }
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
        file: 'src/components/grid/VirtualizedGrid.tsx',
        startLine: 31,
        endLine: 46,
        anchorFunction: 'isAnyPopupActive, handleWheelLock, handleScroll, lockedScrollPosRef'
      },
      rootCause: '1) Thiếu chặn wheel và chốt tọa độ scroll khi popup đang mở hoặc cell đang sửa. 2) Khi đang sửa ô in-cell, scrollbar vẫn có thể bị kéo, wheel/trackpad horizontal swipe chưa bị chặn toàn cục capture phase, hoặc focus() input làm browser tự ý scrollIntoView. 3) POPUP_SELECTORS chứa class tĩnh của container bao ngoài khiến isAnyPopupActive() vĩnh viễn bằng true.',
      solution: [
        '1. Khi đang sửa ô (activeEditingCell): Áp dụng thuộc tính [data-agv-editing="true"] trên viewport (overflow: hidden !important; touch-action: none; overscroll-behavior: none), khóa cố định tọa độ cuộn cả ngang lẫn dọc qua lockedScrollPosRef.',
        '2. Bắt sự kiện wheel & touchmove toàn cục ở capture phase trên window: chặn toàn bộ hành vi cuộn nền, chỉ cho phép cuộn nội dung bên trong danh sách dropdown của editor.',
        '3. Tất cả các editor in-cell (CellEditor, TimeCellEditor, AdvComboBoxEdit, AdvSearchLookUpEdit, AdvDatePicker) kích hoạt focus({ preventScroll: true }) và chặn các phím cuộn trang (ArrowUp, ArrowDown, PageUp, PageDown) khi đang gõ.',
        '4. Khai báo danh sách POPUP_SELECTORS CHỈ CHỨA các phần tử popup/portal động sinh ra khi mở, tuyệt đối không đưa class tĩnh vào bộ chọn.',
        '5. Khi kết thúc sửa (Enter, Esc, Tab, Blur, Click outside), activeEditingCell trở về null, khôi phục nguyên vẹn 100% tọa độ scroll và quyền cuộn tự nhiên cho Grid.'
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
      symptom: 'Khi chuyển sang theme Bezier Art House hoặc E-Ink, một số nút bấm, viền header hoặc ô trong bảng vẫn giữ màu xanh `bg-slate-900`, `text-indigo-500` hoặc trắng bệch `bg-white`.',
      keywords: ['màu cứng', 'hardcode', 'sai màu theme', 'daylight', 'bg-slate', 'text-indigo', 'lỗi màu'],
      location: {
        file: 'src/components/grid/constants.ts & GridHeader.tsx & App.tsx',
        startLine: 10,
        endLine: 85,
        anchorFunction: 'getThemeClasses, renderCell, INITIAL_COLUMNS'
      },
      rootCause: 'Tồn tại class Tailwind tĩnh như `bg-slate-900`, `border-slate-800` hoặc điều kiện `theme === "daylight"` cũ chưa được chuyển đổi 100% sang biến CSS `var(--agv-*)`.',
      solution: [
        '1. Tuyệt đối không dùng class màu Tailwind tĩnh. Thay bằng `bg-[var(--agv-bg-root)]`, `border-[var(--agv-border)]`, `text-[var(--agv-text-main)]`.',
        '2. Mọi màu trong constants.ts phải ánh xạ trực tiếp sang các biến CSS chung.',
        '3. Các theme mới (như E-Ink) phải được khai báo đầy đủ các tokens: root, header, row, selected, accent, border, scrollThumb.'
      ],
      ruleReference: 'Quy tắc "Tuân thủ triệt để chủ đề chung (Theme Consistency)"'
    },
    {
      code: 'ERR_POPUP_CLICK_OUTSIDE',
      title: 'Lỗi menu ngữ cảnh hoặc popup không tự đóng khi bấm ra ngoài (hoặc đóng nhầm khi click vào portal con)',
      symptom: '1) Chuột phải mở ColumnContextMenu hoặc mở FilterModal, sau đó click ra vị trí khác trên trang nhưng popup vẫn treo nguyên trên màn hình. 2) Hoặc trong AdvMultiFilterPopup, khi bấm chọn ngày lịch con thì popup tự tắt do nhận diện nhầm portal của lịch là bấm ra ngoài.',
      keywords: ['không tự đóng', 'treo popup', 'click ngoài', 'context menu', 'click outside', 'FilterModal', 'chọn ngày tự tắt', 'AdvMultiFilterPopup'],
      location: {
        file: 'src/components/grid/ColumnContextMenu.tsx, src/demo/FilterModal.tsx & src/components/grid/AdvMultiFilterPopup.tsx',
        startLine: 25,
        endLine: 175,
        anchorFunction: 'useEffect click outside listener'
      },
      rootCause: 'Thiếu `useEffect` đăng ký sự kiện mousedown/click toàn cục trên `document`; hoặc khi popup cha chứa controls mở portal ra document.body (như AdvDatePicker), listener của popup cha không loại trừ các class selector của portal con (.agv-calendar-popover, .agv-preset-dropdown-menu...) dẫn đến nhận diện nhầm là nhấp ngoài.',
      solution: [
        '1. Trong component popup, luôn đăng ký listener: `const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); }; document.addEventListener("mousedown", handleClick);`.',
        '2. Nếu popup chứa controls có portal ngoài (AdvDatePicker, Presets), BẮT BUỘC kiểm tra loại trừ: `if (target.closest?.(".agv-calendar-popover, .agv-daterange-popover, .agv-preset-dropdown-menu, .agv-portal-dropdown, .agv-custom-select-dropdown")) return;`.',
        '3. Nhớ return hàm cleanup `document.removeEventListener("mousedown", handleClick)` khi component unmount.',
        '4. Trong GridRow/GridHeader, hạn chế dùng `stopPropagation` không cần thiết để sự kiện click outside hoạt động mượt mà.'
      ],
      ruleReference: 'Quy tắc "Tất cả các popup đều phải tự tắt khi chuột thao tác bên ngoài (Click Outside)"'
    },
    {
      code: 'ERR_INPUT_AUTOFILL_LEAK',
      title: 'Lỗi hiển thị gợi ý thông tin của trình duyệt (Browser Autofill Popup)',
      symptom: 'Khi click vào ô tìm kiếm trên thanh toolbar hoặc ô filter, trình duyệt tự động xổ danh sách gợi ý địa chỉ, số điện thoại, mật khẩu làm che khuất giao diện bảng.',
      keywords: ['autofill', 'autocomplete', 'gợi ý trình duyệt', 'gợi ý tìm kiếm', 'che khuất'],
      location: {
        file: 'src/demo/PageToolbar.tsx & src/demo/FilterModal.tsx',
        startLine: 260,
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
      term: 'Column Pinning & Center Docking',
      vietnameseName: 'Ghim cột Trái / Phải / Dock Trung tâm',
      description: 'Cơ chế cố định vị trí các cột quan trọng (STT, Chọn, Mã Dòng, Thao Tác) khi bảng cuộn ngang. Sử dụng CSS `position: sticky` kết hợp mảng `leftOffsets` và `rightOffsets` được tính toán tự động dựa trên độ rộng thực tế của các cột ghim.',
      keyFiles: 'src/components/grid/VirtualizedGrid.tsx & GridRow.tsx & GridHeader.tsx',
      keyLines: 'VirtualizedGrid.tsx:140-195, GridRow.tsx:90-135'
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
      term: 'Theme CSS Variables Engine (var(--agv-*))',
      vietnameseName: 'Bộ biến giao diện CSS động',
      description: 'Hệ sinh thái biến CSS động quản lý toàn bộ màu sắc, viền, thanh cuộn, nền bảng của 4 giao diện chuẩn: Light, Dark, Bezier Art House và E-Ink. Đảm bảo 100% components không bị hardcode màu.',
      keyFiles: 'src/themes/ & src/components/grid/constants.ts',
      keyLines: 'src/themes/common.ts:1-264, constants.ts:12-35'
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
      description: 'Hỗ trợ 3 chế độ tương tác ô trên toàn bảng. Chế độ Xem (chỉ đọc); Chế độ Sửa (1 click) kích hoạt ngay in-cell editor khi click vào ô; Chế độ Sửa (2 click) nhấp đúp để sửa, click đơn để chọn dòng. Cột Biểu Đồ col_chart và Công Thức col_formula được bảo vệ an toàn (chỉ đọc). Khi sửa đổi các tháng, sóng Catmull-Rom sparkline và công thức tự động tính toán lại và co giãn tức thì.',
      keyFiles: 'src/components/grid/GridRow.tsx & VirtualizedGrid.tsx & PageToolbar.tsx & apiService.ts',
      keyLines: 'GridRow.tsx:50-145, VirtualizedGrid.tsx:520-565, PageToolbar.tsx:260-295, apiService.ts:206-302'
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
    // --- src/components/grid/gridUtils.ts ---
    { name: 'measureTextWidth', file: 'src/components/grid/gridUtils.ts', line: 10, desc: 'Đo chiều rộng pixel thực tế của chuỗi văn bản bằng thẻ HTML5 Canvas 2D ẩn với font Montserrat' },
    { name: 'getSttColWidth', file: 'src/components/grid/gridUtils.ts', line: 22, desc: 'Tự động tính toán độ rộng tối ưu cho cột STT dựa trên số chữ số của tổng số dòng' },
    { name: 'calcColAutoFitWidth', file: 'src/components/grid/gridUtils.ts', line: 33, desc: 'Tính độ rộng tối ưu (auto-fit) cho cột bằng cách lấy mẫu dòng dữ liệu kết hợp summaryValues tổng nhóm & tổng bảng format toLocaleString vi-VN font Montserrat, kẹp giữa minWidth và maxLimit (400px)' },
    { name: 'computeContextMenuCoords', file: 'src/components/grid/gridUtils.ts', line: 89, desc: 'Giới hạn tọa độ mở context menu chống tràn mép phải và mép dưới viewport' },
    { name: 'copyTextToClipboard', file: 'src/components/grid/gridUtils.ts', line: 126, desc: 'Cơ chế sao chép văn bản vào clipboard an toàn 2 tầng: navigator.clipboard + textarea fallback' },
    { name: 'parseGridNumber', file: 'src/components/grid/gridUtils.ts', line: 174, desc: 'Chuyển đổi mọi giá trị chuỗi hoặc số thành kiểu number chuẩn xác, tự động nhận diện cả chuẩn VN (1.234,56), quốc tế (1,234.56) và số âm ngoặc đơn (1.000)' },
    { name: 'formatGridNumber', file: 'src/components/grid/gridUtils.ts', line: 222, desc: 'Định dạng số chuẩn kế toán/tài chính #,###.##: chấm (.) hàng nghìn, phẩy (,) thập phân, số âm đặt trong ngoặc đơn (1.000)' },
    { name: 'isSelectionColumn', file: 'src/components/grid/gridUtils.ts', line: 856, desc: 'Predicate kiểm tra cột chọn dòng: đóng gói tập trung điều kiện col.isSelection hoặc col.key === "col_chk"' },
    { name: 'computeFilteredSelectionState', file: 'src/components/grid/gridUtils.ts', line: 876, desc: 'Tính toán trạng thái chọn dòng tối ưu: khi không lọc (activeRowIndices === null) chỉ duyệt qua tập checkedRowIndices (k phần tử) thay vì quét 50.000 dòng' },
    { name: 'toggleFilteredRowsSelection', file: 'src/components/grid/gridUtils.ts', line: 931, desc: 'Đảo/bật/tắt chọn hàng loạt: Fast-path O(1) khi bỏ chọn toàn bộ trên bảng không lọc trả về ngay new Set() rỗng thay vì gọi 50.000 lệnh .delete()' },
    { name: 'computeSortRowFlipState', file: 'src/components/grid/gridUtils.ts', line: 989, desc: 'Tính toán trạng thái trượt FLIP khi Sort chuẩn AG Grid: trượt deltaY chính xác cho các dòng hoán đổi trong viewport, phân tầng vận tốc dòng từ xa và khóa biên trên' },

    // --- src/components/grid/GridHeader.tsx ---
    { name: 'renderHeaderCellContent', file: 'src/components/grid/GridHeader.tsx', line: 179, desc: 'Helper chuẩn hóa DRY cho nội dung ô header (tiêu đề, icon sort, nút checklist filter, thanh resize) gom 4 khối JSX lặp lại ở 4 vùng: Pinned Left, Middle Standalone, Middle Band Child, Pinned Right' },

    // --- src/components/grid/smartNumberUtils.ts ---
    { name: 'expandAllShortcuts', file: 'src/components/grid/smartNumberUtils.ts', line: 18, desc: 'Mở rộng tất cả các ký tự phím tắt đơn vị số (1k->1000, 1tr->1000000, 1t/1b->1000000000) thành chuỗi số nguyên thực tế' },
    { name: 'formatNumberWithCommas', file: 'src/components/grid/smartNumberUtils.ts', line: 43, desc: 'Định dạng số hiển thị chuẩn Việt Nam với formatGridNumber' },
    { name: 'cleanNumericInput', file: 'src/components/grid/smartNumberUtils.ts', line: 54, desc: 'Làm sạch chuỗi nhập số, mở rộng phím tắt ghi gọn' },
    { name: 'parseSmartNumericRange', file: 'src/components/grid/smartNumberUtils.ts', line: 77, desc: 'Phân tích khoảng số thông minh từ các cú pháp .., /, -, ~ hỗ trợ phím tắt ghi gọn' },
    { name: 'formatSmartNumericInput', file: 'src/components/grid/smartNumberUtils.ts', line: 169, desc: 'Tự động định dạng chuỗi nhập số hoặc dải số với phím tắt ghi gọn' },
    { name: 'handleNumericKeyDown', file: 'src/components/grid/smartNumberUtils.ts', line: 217, desc: 'Chặn ký tự chữ cái rác khi gõ vào ô số, chỉ cho phép số, dấu phân cách, ngoặc đơn âm và phím tắt ghi gọn (k, tr, m, b, t, ty, tỷ)' },

    // --- src/components/grid/VirtualizedGrid.tsx ---
    { name: 'VirtualizedGrid', file: 'src/components/grid/VirtualizedGrid.tsx', line: 59, desc: 'Component bảng ảo hóa hiệu năng cao chính cho 50,000 dòng dữ liệu' },
    { name: 'setColWidth', file: 'src/components/grid/VirtualizedGrid.tsx', line: 223, desc: 'Cập nhật độ rộng của một cột đơn lẻ qua functional state update' },
    { name: 'setMultipleColWidths', file: 'src/components/grid/VirtualizedGrid.tsx', line: 235, desc: 'Cập nhật độ rộng hàng loạt cột trong 1 lần render duy nhất (Batch Width Update)' },
    { name: 'effectiveColumns', file: 'src/components/grid/VirtualizedGrid.tsx', line: 334, desc: 'Danh sách cột hiệu dụng sau khi đã lọc bỏ các cột thuộc hiddenColKeys' },
    { name: 'handleMouseDownResize', file: 'src/components/grid/VirtualizedGrid.tsx', line: 837, desc: 'Bắt đầu thao tác kéo thả thay đổi độ rộng cột (Column Resizing)' },
    { name: 'handleAutoFitColumn', file: 'src/components/grid/VirtualizedGrid.tsx', line: 733, desc: 'Tự động vừa độ rộng cho một cột dựa trên canvas text measurement' },
    { name: 'handleAutoFitAllColumns', file: 'src/components/grid/VirtualizedGrid.tsx', line: 744, desc: 'Tự động vừa độ rộng cho toàn bộ các cột đang hiển thị trong bảng (Batch Auto-Fit)' },
    { name: 'handleAutoFitBandColumns', file: 'src/components/grid/VirtualizedGrid.tsx', line: 753, desc: 'Tự động vừa độ rộng cho tất cả các cột thuộc nhóm tầng 1 (Batch Band Auto-Fit)' },
    { name: 'handleSetPin', file: 'src/components/grid/VirtualizedGrid.tsx', line: 781, desc: 'Thay đổi vị trí ghim của cột (left, middle, right)' },
    { name: 'handleSetBandPin', file: 'src/components/grid/VirtualizedGrid.tsx', line: 789, desc: 'Thay đổi vị trí ghim của toàn bộ nhóm cột tầng 1' },
    { name: 'handleHideColumn', file: 'src/components/grid/VirtualizedGrid.tsx', line: 761, desc: 'Thêm cột vào danh sách ẩn hiddenColKeys' },
    { name: 'handleHideAllEmptyColumns', file: 'src/components/grid/VirtualizedGrid.tsx', line: 766, desc: 'Ẩn toàn bộ 16 cột rỗng trong dataset vào danh sách hiddenColKeys và lưu LocalStorage' },
    { name: 'handleShowAllHiddenColumns', file: 'src/components/grid/VirtualizedGrid.tsx', line: 775, desc: 'Khôi phục toàn bộ các cột đã bị ẩn' },
    { name: 'handleHideBand', file: 'src/components/grid/VirtualizedGrid.tsx', line: 484, desc: 'Ẩn toàn bộ các cột thuộc nhóm tầng 1' },
    { name: 'handleScrollToTop', file: 'src/components/grid/VirtualizedGrid.tsx', line: 499, desc: 'Cuộn tức thì lên dòng đầu tiên của bảng' },
    { name: 'handleScrollToBottom', file: 'src/components/grid/VirtualizedGrid.tsx', line: 507, desc: 'Cuộn tức thì xuống dòng cuối cùng của bảng' },
    { name: 'handleColumnContextMenu', file: 'src/components/grid/VirtualizedGrid.tsx', line: 885, desc: 'Mở menu chuột phải trên tiêu đề cột con hoặc cột độc lập' },
    { name: 'handleBandContextMenu', file: 'src/components/grid/VirtualizedGrid.tsx', line: 904, desc: 'Mở menu chuột phải trên tiêu đề nhóm tầng 1 (Band Menu)' },
    { name: 'handleCellContextMenu', file: 'src/components/grid/VirtualizedGrid.tsx', line: 923, desc: 'Mở menu chuột phải trên cell của dòng dữ liệu (Row/Cell Menu)' },
    { name: 'handleGroupContextMenu', file: 'src/components/grid/VirtualizedGrid.tsx', line: 951, desc: 'Mở menu ngữ cảnh chuột phải trên dòng tiêu đề nhóm (Group Header Row Menu)' },
    { name: 'handleKeyDown', file: 'src/components/grid/VirtualizedGrid.tsx', line: 666, desc: 'Điều hướng phím mũi tên Lên/Xuống/PageUp/PageDown giữa các dòng' },
    { name: 'toggleFullscreen', file: 'src/components/grid/VirtualizedGrid.tsx', line: 376, desc: 'Bật/tắt chế độ toàn màn hình Grid (phóng to 100vw x 100vh hoặc thu nhỏ về ban đầu), kích hoạt bằng nút Floating Toolbar hoặc phím tắt Alt + Shift + F' },
    { name: 'handleFilterByValue', file: 'src/components/grid/VirtualizedGrid.tsx', line: 1121, desc: 'Hàm chuẩn hóa lọc theo giá trị cell: gọi createEqualsFilter(val) và chuyển trực tiếp lên dòng filter của cột' },
    { name: 'useColumnResize', file: 'src/components/grid/hooks/useColumnResize.ts', line: 10, desc: 'Custom hook kéo dãn độ rộng cột qua biến CSS: quản lý resizingRef, bắt đầu kéo mousedown, di chuyển mousemove cập nhật DOM biến CSS, thả chuột mouseup đồng bộ React state' },
    { name: 'useColumnAutoFit', file: 'src/components/grid/hooks/useColumnAutoFit.ts', line: 16, desc: 'Custom hook vừa độ rộng tối ưu: đo chữ canvas calcColAutoFitWidth, bảo toàn tổng nhóm và tổng bảng, vừa cột đơn, toàn bộ cột hoặc nhóm tầng' },
    { name: 'useInCellEditor', file: 'src/components/grid/hooks/useInCellEditor.ts', line: 11, desc: 'Custom hook chỉnh sửa ô in-cell: quản lý ô activeEditingCell, lockedScrollPosRef bảo vệ cuộn, chặn 100% cuộn ngoài popup khi đang sửa' },
    { name: 'ensureDatePickerStyles', file: 'src/components/ui/datepicker/datePickerStyles.ts', line: 5, desc: 'Hàm inject style keyframes và biến CSS ánh xạ theo 4 themes cho DatePicker suite, tách rời khỏi TSX' },
    // --- Hằng Số Chuẩn Hóa Toàn Hệ Thống (Standard Enum-like Constants & Types) ---
    { name: 'PIN_POSITIONS', file: 'src/components/grid/types.ts', line: 9, desc: 'Hằng số danh mục vị trí ghim cột (NONE, LEFT, RIGHT, CENTER), loại bỏ hoàn toàn hardcode text' },
    { name: 'SORT_DIRECTIONS', file: 'src/components/grid/types.ts', line: 22, desc: 'Hằng số danh mục chiều sắp xếp dữ liệu (ASC, DESC), đồng bộ MorphSortIcon và sort pipeline' },
    { name: 'GRID_EDIT_MODES', file: 'src/components/grid/types.ts', line: 45, desc: 'Hằng số danh mục chế độ sửa ô trên lưới (VIEW, SINGLE_CLICK, DOUBLE_CLICK)' },
    { name: 'FORMULA_MODES', file: 'src/components/grid/types.ts', line: 55, desc: 'Hằng số danh mục phép tính công thức cột tháng (AVG, SUM, MIN, MAX)' },
    { name: 'MONTH_ANALYTICS_MODES', file: 'src/components/grid/types.ts', line: 66, desc: 'Hằng số danh mục chế độ hiển thị phân tích 12 tháng (THIRTEEN_COLS: 13cols, TWO_COLS: 2cols)' },
    { name: 'FILTER_OPS', file: 'src/components/grid/types.ts', line: 77, desc: 'Hằng số danh mục toán tử lọc toàn hệ thống (FILTER_OPS.<OP>), loại bỏ 100% hardcode chuỗi text' },
    { name: 'FILTER_MODES', file: 'src/components/grid/types.ts', line: 100, desc: 'Hằng số danh mục chế độ lọc dữ liệu (SIMPLE, CHECKLIST, MULTI) của cột' },
    { name: 'CHECK_FILTER_STATES', file: 'src/components/grid/types.ts', line: 110, desc: 'Hằng số danh mục trạng thái lọc của cột Checkbox (ALL, CHECKED, UNCHECKED)' },
    { name: 'EDITOR_TYPES', file: 'src/components/grid/types.ts', line: 130, desc: 'Hằng số danh mục kiểu control sửa ô (TEXT, NUMBER, DATE, DATERANGE, TIME, COMBOBOX, LOOKUP)' },
    { name: 'DATA_TYPES', file: 'src/components/grid/types.ts', line: 144, desc: 'Hằng số danh mục kiểu dữ liệu cột chuẩn toàn hệ thống (TEXT, NUMBER, DATE, TIME, SYSTEM)' },
    { name: 'ALIGNMENTS', file: 'src/components/grid/types.ts', line: 156, desc: 'Hằng số danh mục canh lề hiển thị của ô (LEFT, CENTER, RIGHT)' },
    { name: 'Design Tokens (agv)', file: 'tailwind.config.js', line: 14, desc: 'Bảng màu Design Tokens hệ thống ánh xạ 100% biến CSS var(--agv-...) vào Tailwind (agv-accent, agv-accent-text, agv-border, agv-bg-root, agv-text-main)' },
    { name: 'QUERY_COMBINATORS', file: 'src/components/grid/floating/types.ts', line: 17, desc: 'Hằng số danh mục toán tử kết hợp cây điều kiện (AND, OR) trong Query Builder' },
    { name: 'TOOLBAR_POPUPS', file: 'src/components/grid/floating/types.ts', line: 42, desc: 'Hằng số định danh popup thanh công cụ nổi (SEARCH, QUERY_BUILDER, COLUMN_CHOOSER, SETTINGS)' },
    { name: 'CONTEXT_MENU_TYPES', file: 'src/components/grid/ColumnContextMenu.tsx', line: 23, desc: 'Hằng số danh mục phân loại menu ngữ cảnh chuột phải (HEADER, ROW, BAND, GROUP)' },
    { name: 'ALIGN_TEXT_CLASSES', file: 'src/components/grid/gridUtils.ts', line: 257, desc: 'Bản đồ lớp CSS căn chỉnh văn bản Tailwind (text-left, text-center, text-right) từ ALIGNMENTS' },
    { name: 'getAlignTextClass', file: 'src/components/grid/gridUtils.ts', line: 263, desc: 'Hàm helper trả về class CSS text-align chuẩn từ ColumnAlign, mặc định text-left' },
    { name: 'ALIGN_JUSTIFY_CLASSES', file: 'src/components/grid/gridUtils.ts', line: 270, desc: 'Bản đồ lớp CSS căn chỉnh Flexbox Tailwind (justify-start, justify-center, justify-end) từ ALIGNMENTS' },
    { name: 'getAlignJustifyClass', file: 'src/components/grid/gridUtils.ts', line: 276, desc: 'Hàm helper trả về class CSS justify chuẩn từ ColumnAlign, mặc định justify-start' },
    { name: 'isNoInputFilterOp', file: 'src/components/grid/gridUtils.ts', line: 341, desc: 'Hàm helper kiểm tra toán tử không cần giá trị nhập liệu (is_empty, is_not_empty, is_positive, is_negative)' },
    { name: 'isBetweenFilterOp', file: 'src/components/grid/gridUtils.ts', line: 354, desc: 'Hàm helper kiểm tra toán tử nằm trong khoảng (between)' },
    { name: 'isNegativeFilterOp', file: 'src/components/grid/gridUtils.ts', line: 361, desc: 'Hàm helper kiểm tra toán tử phủ định (not_equals, not_contains)' },
    { name: 'createColumnFilter', file: 'src/components/grid/gridUtils.ts', line: 368, desc: 'Hàm tiện ích chuẩn hóa khởi tạo ColumnFilterValue với toán tử (mặc định FILTER_OPS.EQUALS) và giá trị string' },
    { name: 'createEqualsFilter', file: 'src/components/grid/gridUtils.ts', line: 378, desc: 'Hàm factory tiện ích tạo cấu hình lọc theo giá trị bằng (=) chuẩn hóa' },
    { name: 'handleScroll', file: 'src/components/grid/VirtualizedGrid.tsx', line: 791, desc: 'Xử lý cuộn dọc và cuộn ngang, cập nhật virtualScrollTop và chunk buffer' },

    // --- src/components/grid/GridHeader.tsx ---
    { name: 'GridHeader', file: 'src/components/grid/GridHeader.tsx', line: 57, desc: 'Component thanh tiêu đề 2 tầng (64px) hỗ trợ nhóm cột, ghim vị trí và context menu' },
    { name: 'renderPinnedLeftHeaders', file: 'src/components/grid/GridHeader.tsx', line: 77, desc: 'Vẽ các cột ghim trái span trọn 64px độc lập' },
    { name: 'renderMiddleHeaders', file: 'src/components/grid/GridHeader.tsx', line: 125, desc: 'Vẽ khu vực tiêu đề nhóm tầng 1 (onBandContextMenu) và cột con tầng 2 cuộn tự do' },
    { name: 'renderPinnedRightHeaders', file: 'src/components/grid/GridHeader.tsx', line: 260, desc: 'Vẽ các cột ghim phải cố định' },

    // --- src/components/grid/GridFilterRow.tsx & FilterIcons.tsx ---
    { name: 'AdvChecklistFilterPopup',
      file: 'src/components/grid/AdvChecklistFilterPopup.tsx',
      line: 165,
      desc: 'Popup lọc danh sách giá trị phân biệt: Tối ưu 0ms phản hồi với distinctValuesCacheRef, ảo hóa 20 items, tìm kiếm không dấu'
    },
    {
      name: 'GridFilterRow', file: 'src/components/grid/GridFilterRow.tsx', line: 260, desc: 'Dòng lọc trực tiếp sticky: ô STT click hoặc tái nhấn mở/tắt toggle AdvCriteriaSummaryPopup tập hợp 7 tiêu chí (Nhóm theo, Lọc theo, Đang chọn, Tìm giá trị theo, Sắp xếp dòng theo, Sắp xếp nhóm theo, Cây điều kiện), ô Chọn bỏ viền ngoài hiển thị checkbox thuần 3 trạng thái, ô lọc cột rỗng để trống hoàn toàn (không chữ không icon), nút toán tử hover đổi màu chữ chủ đạo tắt màu hover bg, tích hợp TimeRangeFilterInput, TimeFilterInput, AdvDatePicker, chuột phải mở AdvMultiFilterPopup' },
    { name: 'AdvCriteriaSummaryPopup', file: 'src/components/grid/AdvCriteriaSummaryPopup.tsx', line: 30, desc: 'Popup tập hợp tiêu chí tinh gọn (Segmented Chip layout, bỏ header thừa và nút đóng, tái nhấn nút để tắt, Tìm giá trị theo và Cây điều kiện không dùng tag xanh, chỉ hiện danh mục có tiêu chí, xóa từng mục riêng lẻ hoặc xóa tất cả, neo dưới ô STT dòng lọc, 100% theme CSS variables, min-height 28px)' },
    { name: 'AdvMultiFilterPopup', file: 'src/components/grid/AdvMultiFilterPopup.tsx', line: 26, desc: 'Popup lọc nhiều điều kiện OR / AND (IN / NOT IN clause) khi chuột phải vào ô filter: Menu toán tử đưa ra ngoài Portal body tránh cắt mép, logic loại trừ phủ định AND De Morgan cho toán tử Khác (≠) và Không chứa, xóa dòng đếm trung gian tránh trùng lặp text với footer, khống chế max-h kéo dọc textarea (max 220px) và popup viewport safety, Richtextbox nhận diện đa từ khóa cho text, 2 tab dán số & nhiều khoảng số cho number, date tự động theo toán tử, min-h 28px, zero autofill, data-agv-popup="true" scroll lock' },
    { name: 'TimeRangeFilterInput', file: 'src/components/grid/GridFilterRow.tsx', line: 92, desc: 'Bộ lọc dải giờ phút [Từ HH:mm — Đến HH:mm]: 2 ô nhập chuẩn hóa thời gian, separator gạch ngang, nút x xóa nhanh, zero autofill, min-h 28px' },
    { name: 'TimeFilterInput', file: 'src/components/grid/GridFilterRow.tsx', line: 190, desc: 'Bộ lọc giờ phút đơn lẻ (HH:mm) cho các toán tử =, !=, >=, <=, có chứa: Tự động format HH:mm khi blur, zero autofill, min-h 28px' },
    { name: 'FilterOpIcon', file: 'src/components/grid/FilterIcons.tsx', line: 332, desc: 'Component render biểu tượng toán tử lọc SVG chuẩn DevExtreme với stroke=currentColor tự động theo theme và focus' },
    { name: 'getAllowedFilterOpsForColumn', file: 'src/components/grid/FilterIcons.tsx', line: 387, desc: 'Hàm DUY NHẤT toàn hệ thống trả về danh sách toán tử lọc chuẩn cho 1 cột, đồng bộ 100% giữa GridFilterRow và AdvGridQueryBuilderModal, tự lọc bỏ is_empty & is_not_empty khi cột không có ô trống' },
    { name: 'getDefaultFilterOpForColumn', file: 'src/components/grid/FilterIcons.tsx', line: 407, desc: 'Hàm DUY NHẤT toàn hệ thống trả về toán tử mặc định cho 1 cột, đồng bộ 100% giữa GridFilterRow và AdvGridQueryBuilderModal' },

    // --- src/components/grid/GridRow.tsx ---
    { name: 'GridRow', file: 'src/components/grid/GridRow.tsx', line: 440, desc: 'Component dòng dữ liệu đơn lẻ (Grid Row) với sticky cells, đồng bộ highlight check/select/hover toàn dòng, onCellContextMenu' },
    { name: 'CellEditor', file: 'src/components/grid/GridRow.tsx', line: 109, desc: 'Component input chỉnh sửa ô in-cell dạng text/số: Tự động focus, bôi đen toàn bộ văn bản khi mở, Enter/Tab lưu, Escape hủy, vô hiệu hóa 100% autofill' },
    { name: 'DateCellEditor', file: 'src/components/grid/GridRow.tsx', line: 202, desc: 'Component chỉnh sửa ô ngày in-cell: Tích hợp AdvDatePicker với showPreset={false} (ẩn mốc nhanh), kết nối min/max dữ liệu cột' },
    { name: 'DateRangeCellEditor', file: 'src/components/grid/GridRow.tsx', line: 234, desc: 'Component chỉnh sửa ô dải ngày in-cell: Tích hợp AdvDateRangePicker với showPreset={false} (ẩn mốc nhanh), kết nối min/max dữ liệu cột' },
    { name: 'TimeCellEditor', file: 'src/components/grid/GridRow.tsx', line: 291, desc: 'Component chỉnh sửa ô giờ in-cell (HH:mm): Nhập 2 số giờ tự nhảy phút, phím mũi tên tăng giảm, Enter/Click outside lưu, Esc hủy, zero autofill, min-h 28px' },
    { name: 'isCellEditable', file: 'src/components/grid/GridRow.tsx', line: 93, desc: 'Hàm bảo vệ an toàn kiểm tra ô có thể chỉnh sửa không: Chặn tuyệt đối các cột hệ thống STT, Chọn, Biểu Đồ 12 Tháng col_chart và Công Thức col_formula' },

    // --- src/components/ui/AdvDatePicker.tsx & src/components/ui/datepicker/* ---
    { name: 'AdvDatePicker', file: 'src/components/ui/AdvDatePicker.tsx', line: 105, desc: 'Component chọn ngày/giờ đơn chuẩn DevExpress: Tích hợp chọn nhanh mốc trên đỉnh, footer giờ không còn chữ thời gian thừa, đồng bộ triệt để 4 Theme hệ thống [Light, Dark, Bezier Art House, E-Ink], portal data-theme sync, min-h 28px' },
    { name: 'AdvDateRangePicker', file: 'src/components/ui/datepicker/AdvDateRangePicker.tsx', line: 54, desc: 'Component chọn dải ngày kép (Từ ngày - Đến ngày) với mốc trên đỉnh popover, dualMonth false/true, click mở theo start/end, swap ngày thông minh, tự động commit khi đóng, đồng bộ 4 Theme, portal data-theme sync, min-h 28px' },
    { name: 'AdvDatePresetSelect', file: 'src/components/ui/datepicker/AdvDatePresetSelect.tsx', line: 44, desc: 'Component dropdown mốc nhanh (Hôm nay, Hôm qua, Tuần này, Tháng này, Quý này, Năm nay...): tự động loại trừ và ẩn triệt để các mốc Quý, Tháng, Ngày nằm ngoài phạm vi min/max dữ liệu như lịch' },
    { name: 'AdvDevExpressCalendarBody', file: 'src/components/ui/datepicker/AdvCalendarPrimitives.tsx', line: 104, desc: 'Component ma trận lịch Ngày/Tháng/Năm phong cách DevExpress hỗ trợ điều hướng thập kỷ, tháng và ngày' },
    { name: 'TimePickerBlock', file: 'src/components/ui/datepicker/AdvCalendarPrimitives.tsx', line: 19, desc: 'Component khối nhập giờ:phút (HH:mm) tích hợp NO_AUTOFILL_PROPS dùng chung cho lịch đơn và lịch kép' },
    { name: 'formatGridDateValue', file: 'src/components/ui/datepicker/datePickerUtils.ts', line: 207, desc: 'Hàm chuẩn hóa và format ngày/tháng/năm sang DD/MM/YYYY (hoặc DD/MM/YYYY HH:mm khi includeTime=true), loại bỏ giây thừa :ss, đồng bộ triệt để giữa dữ liệu và date controls' },

    // --- src/components/grid/GridFloatingToolbar.tsx & floating suite ---
    { name: 'GridFloatingToolbar', file: 'src/components/grid/GridFloatingToolbar.tsx', line: 35, desc: 'Thanh công cụ nổi (Right-docked Floating Toolbar): gồm tay nắm kéo drag handle, đúng 6 nút menu, 4 popup, clamp kẹp biên trong Grid' },
    { name: 'AdvQuickFilterFlyout', file: 'src/components/grid/floating/AdvQuickFilterFlyout.tsx', line: 15, desc: 'Popup 1: Ô tìm kiếm nhanh dạng flyout sang trái với nút bật/tắt Smart search, debounce 250ms, autoFocus, Esc đóng' },
    { name: 'AdvGridQueryBuilderModal', file: 'src/components/grid/floating/AdvGridQueryBuilderModal.tsx', line: 273, desc: 'Popup 2: Bộ lọc nâng cao cây điều kiện lồng nhau VÀ/HOẶC: ẩn chữ ô toán tử (iconOnly: chỉ hiện icon SVG và ▾ gọn gàng 44px, tooltip hover, popup chọn hiển thị đủ nhãn), nút SVG ListFilter (không chữ, chuẩn 1 dòng không rớt dòng) mở AdvMultiFilterPopup (thẻ chip tóm tắt tinh gọn 1 dòng kèm nút x, dán hàng loạt từ Excel), tô màu nền phần tử con khi rê chuột vào cặp ngoặc ( ), nút VÀ/HOẶC dùng màu nhóm đang nằm (levelColor), bỏ hiệu ứng hover riêng lẻ, nạp mẫu bằng lệnh CMD với kiểm tra tính hợp lệ (validate cú pháp & tên cột thực tế trên bảng), nút Sao chép CMD thu nhỏ thành icon góc phải bên dưới tránh chiếm chỗ hiển thị, bỏ chữ Giải nghĩa để tối ưu 100% vùng hiển thị, chip điều kiện tinh gọn, khóa nút Nạp/Áp dụng khi câu lệnh không hợp lệ, sửa lỗi đếm trực tiếp matchCount ảo hóa, click giải nghĩa nhảy vào ô sửa, bỏ nút [!] ở nhóm 1, nút [!] ở nhóm con mặc định đóng, nút Hủy clear sạch điều kiện, giới hạn kích thước popup chống tràn viền Grid & Viewport' },
    { name: 'QueryCustomSelect', file: 'src/components/grid/floating/AdvGridQueryBuilderModal.tsx', line: 79, desc: 'Component Dropdown tùy chỉnh cho Query Builder: hỗ trợ iconOnly ẩn chữ hiển thị icon SVG gọn gàng, dropitem chuẩn theme (min-h 28px, hover/active nền màu chữ trắng, checkmark ✓), hỗ trợ showSearch bật/tắt ô tìm kiếm, tự đóng click outside' },
    { name: 'AdvColumnChooserModal', file: 'src/components/grid/floating/AdvColumnChooserModal.tsx', line: 25, desc: 'Popup 3: Tùy chọn cột ẩn/hiện, ghim cột (Trái/Giữa/Phải), tìm kiếm tên cột, kéo thả đổi thứ tự, phục hồi mặc định' },
    { name: 'AdvGridSettingsPopup', file: 'src/components/grid/floating/AdvGridSettingsPopup.tsx', line: 12, desc: 'Popup 4: Cài đặt bảng dữ liệu tinh gọn: Cột số thứ tự, Cột chọn dòng, Dòng công thức, Dòng chọn trang, Cuộn khớp dòng (rowSnapMode)' },
    { name: 'evaluateQueryTreeNode', file: 'src/components/grid/floating/queryUtils.ts', line: 183, desc: 'Hàm lượng giá cây điều kiện lồng nhau cho 300,000 dòng dữ liệu siêu tốc: hỗ trợ chuẩn hóa ngày DD/MM/YYYY, giờ HH:mm, số và văn bản' },
    { name: 'parseCmdToQueryTree', file: 'src/components/grid/floating/queryUtils.ts', line: 313, desc: 'Bộ phân tích cú pháp chuỗi lệnh CMD tự nhiên thành Cây điều kiện QueryGroup, hỗ trợ ngoặc đơn lồng nhau, toán tử so sánh, giấu 100% tên trường backend' },
    { name: 'validateQueryTreeAgainstColumns', file: 'src/components/grid/floating/queryUtils.ts', line: 282, desc: 'Kiểm tra tính hợp lệ của cây điều kiện so với danh sách cột thực tế của bảng dữ liệu' },

    // --- src/components/ui/AdvComboBoxEdit.tsx & AdvSearchLookUpEdit.tsx ---
    { name: 'AdvComboBoxEdit', file: 'src/components/ui/AdvComboBoxEdit.tsx', line: 40, desc: 'Hộp chọn kết hợp vừa gõ tự do vừa chọn Dropdown chuẩn Animate UI: nhấn vào mở popup tức thì (không icon thừa), lọc tức thì, phím mũi tên Lên/Xuống/Enter/Esc, min-h 28px, 100% theme CSS variables, zero autofill' },
    { name: 'AdvSearchLookUpEdit', file: 'src/components/ui/AdvSearchLookUpEdit.tsx', line: 73, desc: 'Bảng tra cứu danh mục LookUp nhiều cột: nhấn vào mở popup tức thì, loại bỏ 100% icon thừa trên ô nhập, Find panel trên đầu, Filter Row từng cột, đã xóa sạch thanh footer đáy, hỗ trợ Chọn đơn & Chọn nhiều, min-h 28px' },

    // --- src/components/grid/GridChunkBlock.tsx ---
    { name: 'GridChunkBlock', file: 'src/components/grid/GridChunkBlock.tsx', line: 50, desc: 'Khối chứa 20 dòng ảo hóa với GPU transform translate3d, chuyển tiếp state chỉnh sửa ô và forwarding onCellContextMenu' },

    // --- src/components/grid/ColumnContextMenu.tsx ---
    { name: 'ColumnContextMenu', file: 'src/components/grid/ColumnContextMenu.tsx', line: 50, desc: 'Menu ngữ cảnh chuột phải 4 phạm vi: header, band, row/cell, group header với 100% theme tokens, chuẩn hóa toàn bộ 5 khối menu sang rounded-md (6px)' },
    { name: 'renderHeaderMenu', file: 'src/components/grid/ColumnContextMenu.tsx', line: 120, desc: 'Giao diện menu cho cột: Ghim trái/giữa/phải, Vừa nội dung, Ẩn/Hiện cột, Nhóm theo cột' },
    { name: 'renderBandMenu', file: 'src/components/grid/ColumnContextMenu.tsx', line: 250, desc: 'Giao diện menu cho nhóm tầng 1: Ghim nhóm, Vừa nội dung nhóm, Ẩn nhóm' },
    { name: 'renderRowMenu', file: 'src/components/grid/ColumnContextMenu.tsx', line: 370, desc: 'Giao diện menu cho dòng: Sao chép ô, Lọc nhanh giá trị, Sao chép dòng kèm tiêu đề, Cuộn lên/xuống' },
    { name: 'renderGroupMenu', file: 'src/components/grid/ColumnContextMenu.tsx', line: 585, desc: 'Giao diện menu cho dòng tiêu đề nhóm: Thu gọn tất cả, Mở rộng tất cả, Hủy nhóm, Sao chép bảng, Sao chép bảng kèm tên cột, Xuất Excel bảng' },

    // --- src/components/ui/MorphIcons.tsx ---
    { name: 'MorphCheckbox', file: 'src/components/ui/MorphIcons.tsx', line: 36, desc: 'Control checkbox biến hình mượt mà giữa Square <-> Check với spring physics' },
    { name: 'MorphIcon', file: 'src/components/ui/MorphIcons.tsx', line: 25, desc: 'Wrapper cho thư viện morphicons, vẽ SVG path động với zero layout shift' },
    { name: 'MorphActionIcon', file: 'src/components/ui/MorphIcons.tsx', line: 68, desc: 'Nút icon biến hình theo trạng thái active/inactive' },
    { name: 'MorphSortIcon', file: 'src/components/ui/MorphIcons.tsx', line: 89, desc: 'Icon sắp xếp header biến hình lò xo ArrowUp <-> ArrowDown snappy' },
    { name: 'MorphChevronIcon', file: 'src/components/ui/MorphIcons.tsx', line: 110, desc: 'Icon đóng mở nhóm dòng biến hình lò xo ChevronRight <-> ChevronDown bouncy' },

    // --- src/components/ui/ (Animate UI Primitives Suite) ---
    { name: 'AdvPopover', file: 'src/components/ui/AdvPopover.tsx', line: 24, desc: 'Primitive Popover chuẩn Animate UI (Base UI): trigger click toggle, tính tọa độ đồng bộ trước khi mở, loại bỏ hoàn toàn lỗi bay/trượt từ góc trái trên (0,0) xuống, Portal document.body, spring animation agv-spring-down/up, flip-up thông minh, useClickOutside, data-agv-popup="true" khóa cuộn bảng, 100% theme tokens' },
    { name: 'AdvSelect', file: 'src/components/ui/AdvSelect.tsx', line: 40, desc: 'Primitive Select (Dropdown chọn 1 giá trị thuần túy): mở tức thì khi click, điều hướng phím Lên/Xuống/Enter/Esc, check icon Lucide, mục active nền var(--agv-accent) chữ trắng, min-h 28px, Portal, spring animation' },
    { name: 'AdvHoverCard', file: 'src/components/ui/AdvHoverCard.tsx', line: 20, desc: 'Primitive Hover Card: mở khi rê chuột với openDelay 150ms và closeDelay 200ms chống nhấp nháy, Portal document.body, spring animation, kẹp biên màn hình, tự đóng khi cuộn trang' },
    { name: 'AdvPreviewLinkCard', file: 'src/components/ui/AdvPreviewLinkCard.tsx', line: 17, desc: 'Primitive Preview Link Card: thẻ xem trước liên kết web dạng card nổi khi rê chuột, hiển thị thumbnail, tiêu đề, mô tả và tên miền, mở link ngoài an toàn target="_blank"' },
    { name: 'AdvTooltip', file: 'src/components/ui/AdvTooltip.tsx', line: 18, desc: 'Primitive Tooltip chuẩn Base UI Motion: Portal document.body, spring keyframes agv-tooltip-spring-up/down, SVG arrow định vị, tự động lật ngược, tự đóng khi cuộn' },
    { name: 'AdvProgress', file: 'src/components/ui/AdvProgress.tsx', line: 12, desc: 'Primitive Progress Bar: hiển thị tiến độ % với transition width 300ms ease, hỗ trợ chế độ indeterminate lướt sóng vô hạn khi tải dữ liệu, 100% theme tokens' },

    // --- src/demo/FilterModal.tsx ---
    { name: 'FilterModal', file: 'src/demo/FilterModal.tsx', line: 30, desc: 'Hộp thoại lọc nâng cao 5 tiêu chí với click outside auto-close' },

    // --- src/demo/PageToolbar.tsx ---
    { name: 'PageToolbar', file: 'src/demo/PageToolbar.tsx', line: 55, desc: 'Thanh công cụ điều khiển giao diện: Theme, Nút bật/tắt Dòng Lọc, Segmented Control 3 chế độ Xem / Sửa 1 click / Sửa 2 click, Search, Chunk Size, Formula Mode' },

    // --- src/services/apiService.ts ---
    { name: 'fetchGridData', file: 'src/services/apiService.ts', line: 206, desc: 'Tầng API Service gọi dữ liệu bất đồng bộ trả về Promise<GridRecord[]> chứa 50.000 bản ghi Plain JSON objects, có hướng dẫn đổi sang URL backend thật' },
    { name: 'updateGridRecordApi', file: 'src/services/apiService.ts', line: 287, desc: 'Cập nhật một ô dữ liệu qua API backend (PATCH / PUT)' },
    { name: 'createXlsxZip', file: 'src/services/apiService.ts', line: 404, desc: 'Động cơ đóng gói file ZIP .xlsx chuẩn OpenXML tích hợp nén Deflate (Method 8) bằng Web Streams API CompressionStream, giảm dung lượng 50.000 dòng từ 37.2 MB xuống ~1.6 MB' },
    { name: 'parseToExcelSerialDate', file: 'src/services/apiService.ts', line: 525, desc: 'Chuyển đổi chuỗi ngày tháng / giờ sang Excel Serial Date Number chuẩn 1900 Date System của Microsoft Excel, hỗ trợ dd/mm/yyyy, dd/mm/yyyy hh:mm, hh:mm' },
    { name: 'exportGridExcelApi', file: 'src/services/apiService.ts', line: 635, desc: 'Tầng API Service sinh file Excel .xlsx thuần OpenXML native (zero-dependency) có nén Deflate siêu nhẹ (~1.6 MB): Lưu trữ ngày/giờ chuẩn Excel Serial Number và numFmt (dd/mm/yyyy, dd/mm/yyyy hh:mm, hh:mm) giúp AutoFilter của Excel nhận diện 100% Date Filters và gom nhóm cây Năm/Tháng/Ngày, mặc định kẻ viền (border) toàn bộ các ô, tắt đường lưới Excel (showGridLines="0"), tô màu Header 2 tầng (Navy #0F172A & Slate #1E293B, chữ trắng in đậm), dòng nhóm Group Header nền #F1F5F9 in đậm kèm tổng sum số, bật sẵn AutoFilter của Excel trên hàng cột con, format chuẩn số #,##0 / #,##0.00 chống tràn ###' },

    // --- src/components/grid/gridUtils.ts ---
    { name: 'matchFilterValue', file: 'src/components/grid/gridUtils.ts', line: 302, desc: 'Động cơ so khớp toán tử lọc theo kiểu dữ liệu text, number, date, time chuẩn DevExtreme tích hợp trong thư viện' },

    // --- src/demo/TwelveMonthChartCell.tsx ---
    { name: 'TwelveMonthChartCell', file: 'src/demo/TwelveMonthChartCell.tsx', line: 62, desc: 'Biểu đồ Sparkline 12 tháng: Sóng Catmull-Rom spline, tích hợp Animate UI Tooltip (Base UI + Motion style) qua Portal với Spring Physics và Shared Sliding Glide mượt mà 120ms, tự động đổi màu số liệu theo đốm cực đại (var(--agv-trend-up)) và cực tiểu (var(--agv-trend-down)) trên đường line, SVG arrow định vị, tự động lật ngược flip-up, kẹp biên an toàn, định dạng số formatGridNumber, tự đóng khi cuộn' },

    // --- src/demo/airlineData.ts ---
    { name: 'LEGACY_KEY_MAP', file: 'src/demo/airlineData.ts', line: 75, desc: 'Bảng ánh xạ tự động chuyển đổi cấu hình từ các phiên bản cũ sang chuẩn 23 cột mới' },
    { name: 'getRawAirlineDataset', file: 'src/demo/airlineData.ts', line: 110, desc: 'Cung cấp trực tiếp mảng tuple dữ liệu gốc 339.737 dòng phục vụ tính tổng và gom nhóm cực tốc Single-Pass Stream' },
    { name: 'getFastAirlineCellVal', file: 'src/demo/airlineData.ts', line: 114, desc: 'Trích xuất giá trị ô siêu tốc O(1) không sinh rác GC từ 339.737 dòng tuple dữ liệu vé máy bay' },
    { name: 'getAirlineRowValueForSort', file: 'src/demo/airlineData.ts', line: 135, desc: 'Trích xuất giá trị cột để phục vụ pipeline sắp xếp mảng kiểu dữ liệu nhanh cho vé máy bay' },
    { name: 'getAirlineRowData', file: 'src/demo/airlineData.ts', line: 145, desc: 'Tạo đối tượng AirlineRowData cho dòng hiển thị theo chunk' },
    { name: 'updateAirlineCellValue', file: 'src/demo/airlineData.ts', line: 185, desc: 'Cập nhật giá trị ô vào bộ nhớ đệm cho dữ liệu hàng không' },
    { name: 'matchAirlineFilterValue', file: 'src/demo/airlineData.ts', line: 260, desc: 'Động cơ so khớp toán tử lọc theo text, number, date (hỗ trợ contains/not_contains/starts_with/ends_with theo số và chuỗi, date/time parseDateToNum, dải số và ngày between, toán tử Khác ≠ và Không chứa loại trừ AND De Morgan)' },
    { name: 'getAirlineEmptyColumns', file: 'src/demo/airlineData.ts', line: 137, desc: 'Phát hiện nhanh các cột rỗng hoàn toàn trong bộ dữ liệu (~0ms) và cache cho các lần truy vấn tiếp theo' },

    // --- src/App.tsx ---
    { name: 'renderCell', file: 'src/App.tsx', line: 1398, desc: 'Bộ render ô tùy biến: bảo toàn 100% React.memo của GridRow bằng cách đọc trực tiếp prop isChecked từ CellRenderParams và phụ thuộc đúng giá trị số chartColumnWidth thay vì cả object colWidths' },
    { name: 'handleReorderColumns', file: 'src/App.tsx', line: 375, desc: 'Kéo thả đổi thứ tự cột và tự động lưu vào localStorage' },
    { name: 'handleToggleCheck', file: 'src/App.tsx', line: 521, desc: 'Chuyển đổi trạng thái chọn/bỏ chọn dòng trong Set checkedRowIndices (hỗ trợ Shift + Click chọn dải dòng liên tiếp)' },
    { name: 'handleToggleGroupByColumn', file: 'src/App.tsx', line: 414, desc: 'Chuyển đổi trạng thái nhóm theo cột từ chuột phải Context Menu, tự động thiết lập mặc định thu gọn tất cả (collapsed by default), lưu localStorage' },
    { name: 'handleToggleGroupSort', file: 'src/App.tsx', line: 241, desc: 'Chuyển đổi luân phiên 3 trạng thái sắp xếp nhóm theo tổng của cột số: Giảm dần -> Tăng dần -> Mặc định (Option B Toolbar3) và lưu localStorage' },
    { name: 'handleToggleGroupCollapse', file: 'src/App.tsx', line: 425, desc: 'Đóng/mở nhóm dòng phân cấp khi click vào dòng Group Header' },
    { name: 'handleCollapseAllGroups', file: 'src/App.tsx', line: 1243, desc: 'Thu gọn toàn bộ tất cả các nhóm trên bảng' },
    { name: 'handleExpandAllGroups', file: 'src/App.tsx', line: 1247, desc: 'Mở rộng toàn bộ tất cả các nhóm trên bảng' },
    { name: 'handleUngroup', file: 'src/App.tsx', line: 1256, desc: 'Hủy nhóm theo cột, khôi phục bảng phẳng 50.000 dòng' },
    { name: 'handleCopyGroupTable', file: 'src/App.tsx', line: 1263, desc: 'Sao chép toàn bộ dữ liệu của nhóm sang định dạng TSV vào clipboard (có/không kèm tên cột)' },
    { name: 'handleExportGroupExcel', file: 'src/App.tsx', line: 1293, desc: 'Ủy quyền sang apiService.exportGridExcelApi xuất Excel cho nhóm dữ liệu' },
    { name: 'handleExportAllExcel', file: 'src/App.tsx', line: 1323, desc: 'Ủy quyền sang apiService.exportGridExcelApi xuất Excel cho toàn bộ bảng dữ liệu' },
    { name: 'rawGroupBuckets', file: 'src/App.tsx', line: 1086, desc: 'Chia nhóm cấu trúc 50.000 dòng tách biệt khỏi luồng tính tổng (không phải gom nhóm lại khi tích chọn dòng)' },
    { name: 'columnSums', file: 'src/App.tsx', line: 1181, desc: 'Tính toán tổng giá trị cho tất cả các cột số bằng động cơ Single-Pass Stream O(N); khi có dòng được chọn (checkedRowIndices.size > 0) tự động tính theo các dòng đang chọn với fast-path O(K)' },
    { name: 'groupedDisplayModel', file: 'src/App.tsx', line: 1184, desc: 'Động cơ nhóm dòng, cộng dồn tổng và sắp xếp các nhóm theo tổng số tiền (groupSortConfig) trong đúng 1 vòng lặp duy nhất' },
    { name: 'renderGroupHeaderRow', file: 'src/components/grid/GridRow.tsx', line: 446, desc: 'Render dòng tiêu đề nhóm dữ liệu: icon mở/đóng ▼/▶, line ngang borderBottom liền mạch qua toàn bộ ô, ẩn tiền tố tên cột chỉ hiển thị trực tiếp giá trị nhóm và badge số lượng bản ghi, tổng sum các cột số căn đúng vị trí cột' }
  ],

  // ============================================================================
  // PHẦN D: TỪ ĐIỂN BIẾN CSS THEME & Z-INDEX (CSS TOKENS & STACKING)
  // ============================================================================
  cssTokens: [
    { token: '--agv-bg-root', desc: 'Màu nền chính của viewport / ứng dụng', defaultLight: '#ffffff', defaultDark: '#0f172a' },
    { token: '--agv-bg-header', desc: 'Màu nền thanh tiêu đề GridHeader (Tier 1 & Tier 2)', defaultLight: '#f8fafc', defaultDark: '#1e293b' },
    { token: '--agv-text-header', desc: 'Màu chữ thanh tiêu đề', defaultLight: '#475569', defaultDark: '#cbd5e1' },
    { token: '--agv-text-main', desc: 'Màu chữ nội dung chính trong bảng', defaultLight: '#0f172a', defaultDark: '#f8fafc' },
    { token: '--agv-text-muted', desc: 'Màu chữ phụ / nhãn mờ', defaultLight: '#94a3b8', defaultDark: '#64748b' },
    { token: '--agv-border', desc: 'Màu đường viền giữa các ô và cột trong bảng', defaultLight: '#e2e8f0', defaultDark: '#334155' },
    { token: '--agv-border-strong', desc: 'Màu đường viền đáy header / phân tách vùng', defaultLight: '#cbd5e1', defaultDark: '#475569' },
    { token: '--agv-accent', desc: 'Màu chủ đạo / điểm nhấn tương tác (Buttons, Checkbox checked, Pinned divider)', defaultLight: '#2563eb', defaultDark: '#38bdf8' },
    { token: '--agv-accent-text', desc: 'Màu chữ trên nền chủ đạo (luôn là màu trắng)', defaultLight: '#ffffff', defaultDark: '#ffffff' },
    { token: '--agv-bg-selected', desc: 'Màu nền dòng đang được chọn (Selected Row)', defaultLight: '#eff6ff', defaultDark: '#1e293b' },
    { token: '--agv-bg-row', desc: 'Màu nền dòng chẵn', defaultLight: '#ffffff', defaultDark: '#0f172a' },
    { token: '--agv-bg-row-alt', desc: 'Màu nền dòng lẻ', defaultLight: '#f8fafc', defaultDark: '#111827' },
    { token: '--agv-bg-hover', desc: 'Màu nền khi rê chuột qua dòng (Row Hover)', defaultLight: '#f1f5f9', defaultDark: '#1e293b' },
    { token: '--scroll-thumb', desc: 'Màu thanh cuộn (Scrollbar thumb) đồng bộ theme', defaultLight: '#cbd5e1', defaultDark: '#3E4D63' },
    { token: '--scroll-thumb-hover', desc: 'Màu thanh cuộn khi rê chuột vào', defaultLight: '#94a3b8', defaultDark: '#64748B' }
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
      fileName: 'src/components/grid/VirtualizedGrid.tsx',
      totalLines: 2238,
      description: 'Động cơ chính của Grid (bọc React.memo): Điều khiển ảo hóa chunkRowsCacheRef giữ nguyên 100% tham chiếu chunk cũ khi cuộn cao tốc, cuộn mượt theo dt 60-144Hz, đo vận tốc trung bình cửa sổ 120ms (windowAccumDistanceRef), cố định handleToggleQuickFilterSmart bảo toàn React.memo cho GridFloatingToolbar, cố định listener bàn phím qua keyNavStateRef, ghim cột, kéo độ rộng, phím tắt, menu ngữ cảnh & 3 chế độ tương tác ô, In-Cell Editing Scroll Lock, Popup Scroll Lock (cache 64ms), dynamic header height, columnSums and grouping props forwarding',
      sections: [
        { lineRange: '1 - 85', category: 'Imports, Prop Types & Cached Popup Selectors', functions: ['POPUP_SELECTORS', 'isAnyPopupActive (64ms cached)', 'VirtualizedGridProps', 'VirtualizedGridRef'] },
        { lineRange: '86 - 350', category: 'State & Refs Initialization', functions: ['colWidths', 'columnPins', 'hiddenColKeys', 'effectiveColumns', 'setColWidth', 'setMultipleColWidths'] },
        { lineRange: '351 - 660', category: 'Column Offsets & Pin Calculation', functions: ['calculatePinnedOffsets', 'leftOffsets', 'rightOffsets'] },
        { lineRange: '661 - 745', category: 'Column Group Definitions & Memoization', functions: ['flatColumns', 'middleElements', 'collapsedBands'] },
        { lineRange: '746 - 1020', category: 'Column Resize, Auto-Fit, Pinning, Hide/Show & Context Menu Handlers', functions: ['handleMouseDownResize', 'handleAutoFitColumn', 'handleAutoFitAllColumns', 'handleSetPin', 'handleHideColumn', 'handleColumnContextMenu', 'handleBandContextMenu', 'handleCellContextMenu', 'handleGroupContextMenu'] },
        { lineRange: '1260 - 1545', category: 'Sticky Group Header, Wheel Snapping, Popup Scroll Lock & Stable Ref Keyboard Navigation', functions: ['computeStickyGroupIdx', 'handleWheelSnap', 'handleWheelLock', 'keyNavStateRef', 'handleKeyDownNav'] },
        { lineRange: '1546 - 1790', category: 'High-Speed AutoScroll Loop, 120ms Window Velocity Scroll Engine & Chunk Row Cache (chunkRowsCacheRef)', functions: ['autoScrolling dt loop', 'windowAccumDistanceRef', 'handleScroll', 'visibleChunkIndices', 'chunkRowsCacheRef', 'visibleChunksMap'] },
        { lineRange: '1791 - 2238', category: 'JSX Render Viewport, Memoized GridHeader & GridFilterRow, Chunks Block, FloatingToolbar & ContextMenu Portal', functions: ['GridHeader (React.memo)', 'GridFilterRow (React.memo)', 'GridChunkBlock iteration', 'GridFloatingToolbar', 'ColumnContextMenu', 'React.memo(VirtualizedGridComponent)'] }
      ]
    },
    {
      fileName: 'src/components/grid/GridHeader.tsx',
      totalLines: 700,
      description: 'Thanh tiêu đề linh hoạt 1 tầng (34px) hoặc 2 tầng (64px), tích hợp MorphSortIcon biến hình lò xo ArrowUp <-> ArrowDown theo hướng ASC/DESC, HTML5 Drag & Drop đổi thứ tự cột, drop indicator, ghim vị trí, thu gọn nhóm, tắt chuột phải STT/Chọn và context menu',
      sections: [
        { lineRange: '1 - 50', category: 'Imports & Header Props', functions: ['GridHeaderProps'] },
        { lineRange: '51 - 95', category: 'Header Outer Container, Height Calculation & Theme Classes', functions: ['GridHeader outer wrapper', 'dynamic header height 34px/64px'] },
        { lineRange: '96 - 200', category: 'HTML5 Drag & Drop Column Reordering', functions: ['handleDragStart', 'handleDragOver', 'handleDrop', 'dropIndicator'] },
        { lineRange: '201 - 350', category: 'Khu vực ghim trái (Pinned Left Tier 1 & 2)', functions: ['renderPinnedLeftHeaders', 'tắt chuột phải STT/Chọn'] },
        { lineRange: '351 - 550', category: 'Khu vực giữa: Cột phẳng 1 tầng hoặc Nhóm tầng 1 & Cột con tầng 2', functions: ['renderMiddleHeaders', 'onBandContextMenu', 'collapsible group toggle'] },
        { lineRange: '551 - 700', category: 'Khu vực ghim phải (Pinned Right)', functions: ['renderPinnedRightHeaders', 'resize handle'] }
      ]
    },
    {
      fileName: 'src/components/grid/GridRow.tsx',
      totalLines: 1008,
      description: 'Renderer của dòng dữ liệu: gắn data-row-focused, data-row-checked và data-cell-role (stt/chk/data) cho cơ chế phân biệt dòng Focus / Chọn Kiểu A không dùng border, tích hợp hiệu ứng xuất hiện mượt mà .agv-row-enter (140ms spring cubic-bezier(0.16, 1, 0.3, 1), animationDelay theo vị trí dòng trong chunk, tự động xóa transform sau khi chạy xong để bảo toàn 100% position: sticky), hỗ trợ Group Header Row với MorphChevronIcon biến hình lò xo ChevronRight <-> ChevronDown khi đóng mở nhóm, mở/đóng với thuật toán titleColSpan Toolbar3 (không lệch cột, diff=0px, đường line ngang theme.borderBottom liền mạch, tổng sum cột số, sticky tiêu đề nhóm khi cuộn ngang, kích hoạt onGroupContextMenu chuột phải), sticky cells, highlight check/select/hover toàn dòng, in-cell editing với showPreset={false}, DateRangeCellEditor, DateCellEditor (bỏ agv-filter-datepicker, allowClear={false}, bo tròn rounded-md), TimeCellEditor và CellEditor (tích hợp preventScroll và chặn phím cuộn Lên/Xuống/PageUp/PageDown khi đang gõ)',
      sections: [
        { lineRange: '1 - 60', category: 'Imports & GridRowProps', functions: ['GridRowProps', 'isCellEditable guard'] },
        { lineRange: '61 - 114', category: 'In-Cell Text/Number Editor (Zero Autofill)', functions: ['CellEditor', 'auto-focus preventScroll', 'select-all', 'onKeyDown (Enter/Tab/Esc/Arrow/PageUp/PageDown)', 'onBlur save'] },
        { lineRange: '115 - 180', category: 'In-Cell Date & DateRange Editors', functions: ['DateCellEditor (AdvDatePicker integration)', 'DateRangeCellEditor (AdvDateRangePicker integration)'] },
        { lineRange: '181 - 285', category: 'In-Cell Time Editor (HH:mm) & ComboBox/LookUp Editors', functions: ['TimeCellEditor (preventScroll)', 'AdvComboBoxEdit (preventScroll)', 'AdvSearchLookUpEdit (preventScroll)'] },
        { lineRange: '286 - 440', category: 'Row Background & Sticky Style Calculations', functions: ['GridRow wrapper', 'isRowActive', 'cellBgClasses', 'stickyStyle'] },
        { lineRange: '441 - 575', category: 'Group Header Row Renderer (Row Grouping titleColSpan Toolbar3)', functions: ['_isGroupRow guard', 'titleColSpan dynamic calculation (Toolbar3)', 'diff 0px column alignment', 'MorphChevronIcon toggle (ChevronRight <-> ChevronDown)', 'group badge count', 'group numeric column sums', 'sticky left title', 'onGroupContextMenu contextmenu event'] },
        { lineRange: '576 - 745', category: 'In-Cell Editing Render Delegation', functions: ['DateRangeCellEditor trigger', 'DateCellEditor trigger', 'TimeCellEditor trigger', 'CellEditor trigger'] },
        { lineRange: '746 - 994', category: 'Cell Container JSX & Memo Equality Check', functions: ['cell render params', 'memo comparer'] }
      ]
    },
    {
      fileName: 'src/components/ui/AdvDatePicker.tsx',
      totalLines: 3821,
      description: 'Hệ thống chọn ngày/giờ cao cấp chuẩn DevExpress: tích hợp 100% Lucide Icons, AdvDatePicker đơn lẻ, AdvDateRangePicker dải ngày kép, AdvDatePresetSelect mốc thời gian nhanh, hỗ trợ allowClear={false} ẩn dấu x, tích hợp getGridControlRadiusClass() bo tròn 6px đồng nhất hệ thống, 100% theme CSS variables, min-h 28px, điều hướng chọn năm 2017',
      sections: [
        { lineRange: '1 - 150', category: 'Imports from Lucide & Theme Utility Functions', functions: ['Calendar', 'Clock', 'Check', 'ChevronRight', 'ChevronDown', 'getThemeClass'] },
        { lineRange: '151 - 700', category: 'CSS Variables & Dynamic Styles Injection', functions: ['ensureDatePickerStyles', 'theme variables (Light, Dark, Bezier, E-Ink)', 'min-height 28px constraint'] },
        { lineRange: '701 - 1400', category: 'Date Parsing & Formatting Utilities', functions: ['formatDateToYMD', 'parseDateToTimestamp', 'formatDisplayDate', 'computeCalendarCoords', 'usePopupDismiss'] },
        { lineRange: '1401 - 2200', category: 'Preset Selection System (Mốc Thời Gian Nhanh)', functions: ['AdvDatePresetSelect', 'computePresetDateRange', 'getPresetLabel', 'PRESET_OPTIONS'] },
        { lineRange: '2201 - 2760', category: 'DevExpress Calendar Body (Ngày / Tháng / Năm)', functions: ['AdvDevExpressCalendarBody', 'CalendarDayView', 'CalendarMonthView', 'CalendarYearView'] },
        { lineRange: '2761 - 4020', category: 'AdvDateRangePicker Component (Dải Ngày Kép)', functions: ['AdvDateRangePicker', 'dual input bar', 'preset section on top (mb-2 border-b)', 'range selection hover', 'openCalendar(preferredState)', 'smart date swap'] },
        { lineRange: '4021 - 4564', category: 'AdvDatePicker Component (Ngày Đơn & Giờ Phút)', functions: ['AdvDatePicker', 'single input bar', 'preset section on top', 'TimePickerBlock integration', 're-exports'] }
      ]
    },
    {
      fileName: 'src/components/grid/GridChunkBlock.tsx',
      totalLines: 267,
      description: 'Khối chứa 20 dòng ảo hóa với GPU transform translate3d, tracking isSelected & isChecked theo dữ liệu/rowKey chống trôi khi sắp xếp, React.memo comparator lọc theo phạm vi dòng của chunk cho cả checkedRowIndices, selectedRowIndex và editingCell (bỏ qua 100% các chunk không bị ảnh hưởng), forwarding editing states & onGroupContextMenu callback, forwarding emptyColKeys',
      sections: [
        { lineRange: '1 - 45', category: 'Imports & GridChunkBlockProps', functions: ['GridChunkBlockProps'] },
        { lineRange: '46 - 105', category: 'GPU Positioning & AntiGhost Containment', functions: ['GridChunkBlock wrapper', 'translate3d offset'] },
        { lineRange: '106 - 168', category: 'Rows Iteration via GridRow with stable key, data selection & editMode forwarding', functions: ['rows.map GridRow', 'rowKey', 'isSelected', 'isChecked', 'editMode', 'editingCell', 'onGroupContextMenu forwarding'] },
        { lineRange: '170 - 267', category: 'Memo Comparator Optimization (Range-aware for checkedRowIndices, selectedRow & editingCell)', functions: ['chunk memo comparer with range check [startRowIndex, endRowIndex]'] }
      ]
    },
    {
      fileName: 'src/components/grid/ColumnContextMenu.tsx',
      totalLines: 1039,
      description: 'Menu ngữ cảnh chuột phải 4 phạm vi (Header, Band, Row/Cell, Group Header): thanh mỏng mũi tên biến hình lò xo MorphChevronIcon thu gọn/mở rộng các tùy chọn Vừa độ rộng & tác vụ sao chép/xuất ở đáy menu (mặc định ẩn, không chữ, chiều cao mỏng 18px), Row/Cell menu tinh gọn (đã xóa bỏ 2 mục Sao chép dòng & Sao chép kèm Tên cột), Smart Disable Empty Columns (tinh gọn siêu nhỏ chỉ giữ Ẩn cột rỗng & Ẩn tất cả cột rỗng), Menu Tiêu Đề Nhóm đồng bộ 100% CSS và text "Hủy nhóm cột" (chữ màu accent font-semibold, bỏ icon cọc cạch), đưa lên đầu kèm Thu gọn/Mở rộng tất cả và thanh mỏng mở rộng 3 tác vụ Sao chép/Xuất Excel, Nhóm theo cột / Hủy nhóm cột trên header, chọn công thức cho col_formula, 100% theme tokens, click outside auto-close',
      sections: [
        { lineRange: '1 - 120', category: 'Imports & Component State/ClickOutside & Safe Coords', functions: ['ColumnContextMenu', 'useRef', 'isAutoFitExpanded state', 'computeContextMenuCoords'] },
        { lineRange: '121 - 380', category: 'Header Menu View (Nhóm theo cột, Pin, Công thức col_formula [TB, Tổng, Min, Max], Auto-fit đơn lựa chọn, Hide/Restore)', functions: ['renderHeaderMenu', 'Nhóm theo cột / Hủy nhóm cột', 'Pin options', 'FormulaMode selection', 'Single Auto-fit rule', 'Restore hidden'] },
        { lineRange: '381 - 500', category: 'Band Menu View (Pin band, Auto-fit band, Hide band)', functions: ['renderBandMenu', 'Pin band left/mid/right', 'Auto-fit band cols', 'Hide entire band'] },
        { lineRange: '501 - 584', category: 'Row/Cell Menu View (Công thức col_formula, Copy cell, Quick Filter, Copy row with headers, Scroll to top/bottom)', functions: ['renderRowMenu', 'Cell formula options', 'Copy cell value', 'Filter by value', 'ScrollToTop/Bottom'] },
        { lineRange: '585 - 720', category: 'Group Header Menu View (Thu gọn tất cả, Mở rộng tất cả, Hủy nhóm, Sao chép bảng, Sao chép bảng kèm tên cột, Xuất Excel bảng)', functions: ['renderGroupMenu', 'handleCollapseAllGroups', 'handleExpandAllGroups', 'handleUngroup', 'handleCopyGroupTable', 'handleExportGroupExcel'] },
        { lineRange: '721 - 890', category: 'Portal Container, Backdrop & Keyboard Listener', functions: ['context menu portal', 'fixed position styling', 'escape key listener'] }
      ]
    },
    {
      fileName: 'src/components/grid/gridUtils.ts',
      totalLines: 852,
      description: 'Bộ công cụ đo Canvas Auto-Fit, sao chép Clipboard an toàn, tính toán tọa độ Context Menu và động cơ định dạng số chuẩn tài chính #,###.## (số âm bỏ trong ngoặc đơn (1.000)), parseGridNumber nhận diện số âm ngoặc đơn và chuẩn chấm hàng nghìn (khắc phục lỗi 1k -> 1.000)',
      sections: [
        { lineRange: '1 - 22', category: 'Canvas Text Width Measurement', functions: ['measureTextWidth', 'offscreen canvas singleton'] },
        { lineRange: '23 - 70', category: 'Auto-Fit Column Width Engine', functions: ['calcColAutoFitWidth', '100-row sampling', 'minWidth/maxWidth clamping', 'Map & object cell resilience'] },
        { lineRange: '71 - 105', category: 'Safe Clipboard Copier', functions: ['copyTextToClipboard', 'navigator.clipboard', 'textarea fallback'] },
        { lineRange: '106 - 169', category: 'Context Menu Safe Coordinates Calculation', functions: ['computeContextMenuCoords', 'boundary overflow clamping'] },
        { lineRange: '170 - 245', category: 'Vietnamese Accounting Number Parsing & Formatting Engine', functions: ['parseGridNumber', 'formatGridNumber', 'accounting negative parentheses (1.000)', 'dot thousand separator', 'comma decimal separator'] },
        { lineRange: '246 - 450', category: 'Alignments & Filter Operator Helpers', functions: ['ALIGN_TEXT_CLASSES', 'ALIGN_JUSTIFY_CLASSES', 'isNoInputFilterOp', 'isBetweenFilterOp', 'createColumnFilter'] },
        { lineRange: '451 - 852', category: 'Row Sorting & Filter Match Engine', functions: ['matchFilterValue', 'compareGridRows', 'getRowValueForSortGeneric', 'splitDateRange', 'parseSingleDateTimestamp'] }
      ]
    },
    {
      fileName: 'src/components/grid/smartNumberUtils.ts',
      totalLines: 240,
      description: 'Bộ công cụ số thông minh: xử lý phím tắt ghi gọn (1k, 100k, 1tr, 1b, t, ty, tỷ), phân tích khoảng số (.., /, -, ~) và bộ lọc phím bấm chặn chữ cái rác',
      sections: [
        { lineRange: '1 - 50', category: 'Shortcuts Regex & Expansion Engine', functions: ['NUMERIC_SHORTCUT_REGEX', 'expandAllShortcuts', 'formatNumberWithCommas'] },
        { lineRange: '51 - 168', category: 'Smart Numeric Range Parser', functions: ['cleanNumericInput', 'parseSmartNumericRange'] },
        { lineRange: '169 - 213', category: 'Smart Numeric Input Formatter', functions: ['formatSmartNumericInput'] },
        { lineRange: '214 - 240', category: 'Strict Numeric Keydown Filter', functions: ['handleNumericKeyDown'] }
      ]
    },
    {
      fileName: 'src/components/ui/MorphIcons.tsx',
      totalLines: 172,
      description: 'Bộ điều khiển biểu tượng biến hình lò xo (morphicons & Lucide)',
      sections: [
        { lineRange: '1 - 25', category: 'Imports & Base Wrapper', functions: ['MorphIcon'] },
        { lineRange: '26 - 65', category: 'MorphCheckbox (Square <-> Check)', functions: ['MorphCheckbox single-layer morphing'] },
        { lineRange: '66 - 88', category: 'MorphActionIcon', functions: ['MorphActionIcon'] },
        { lineRange: '89 - 110', category: 'MorphSortIcon (Header Sort)', functions: ['MorphSortIcon (ArrowUp <-> ArrowDown snappy)'] },
        { lineRange: '111 - 135', category: 'MorphChevronIcon (Group Row & Menu Toggle)', functions: ['MorphChevronIcon (ChevronRight <-> ChevronDown hoặc ChevronDown <-> ChevronUp snappy)'] },
        { lineRange: '136 - 172', category: 'Lucide Icon Exports', functions: ['Check', 'X', 'ChevronLeft', 'Moon', 'Sun', 'Search', 'Filter', 'Calendar', 'Clock', 'ChevronRight', 'ChevronDown', 'ChevronUp'] }
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
      totalLines: 662,
      description: 'Thanh công cụ nổi 6 nút Toolbar3, tích hợp Shared Sliding Tooltip lướt tọa độ Y với spring physics, giữ nguyên mở rộng không thu gọn khi đang di chuyển (is-dragging), computePopupGeometry giới hạn chiều cao & vị trí 4 popup nằm gọn trong khung Grid, kéo thả dọc kẹp biên, phím tắt Ctrl+F, badge đếm cột dữ liệu',
      sections: [
        { lineRange: '1 - 85', category: 'Imports & Toolbar Props Type', functions: ['GridFloatingToolbarProps', 'isDraggingToolbar state'] },
        { lineRange: '86 - 150', category: 'Data Columns Filter & Atomic Group Badge Counts', functions: ['dataColumns', 'totalChooserItemCount', 'visibleChooserItemCount'] },
        { lineRange: '151 - 250', category: 'computePopupGeometry & Vertical Drag Clamping', functions: ['computePopupGeometry', 'window resize listener', 'handleDragStart'] },
        { lineRange: '251 - 325', category: 'Shared Sliding Tooltip System (Spring Physics)', functions: ['tooltipState', 'handleShowTooltip', 'handleHideTooltip', 'relativeTop clamping'] },
        { lineRange: '326 - 520', category: 'Floating Bar Buttons with Sliding Tooltips (QuickFilter, Query, Chooser, Settings, Export, Excel)', functions: ['toolbar buttons JSX', 'count badges', 'sliding tooltip pill'] },
        { lineRange: '521 - 662', category: 'Portals / Popups Renderer Bounded in Grid', functions: ['AdvQuickFilterFlyout', 'AdvGridQueryBuilderModal', 'AdvColumnChooserModal', 'AdvGridSettingsPopup'] }
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
