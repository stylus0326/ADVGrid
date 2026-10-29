# Nhật Ký 3 Lần Chỉnh Sửa Gần Nhất (Rolling Edit Log)

Tài liệu này lưu trữ thông tin chi tiết về file, vị trí dòng, phần tử/nội dung thay đổi của **3 lần chỉnh sửa code gần nhất**. Sau mỗi lần code mới, nhật ký này sẽ tự động cuốn chiếu (loại bỏ lần cũ nhất và bổ sung lần mới nhất).

---

## 🕒 Lần 3 (Mới nhất): Chuyển Độ Rộng Cột Sang Biến CSS (`var(--agv-col-w-<key>)`), Live Resize Trực Tiếp Trên DOM Không Re-render React (`requestAnimationFrame`) & Khóa Body Resize
- **Thời gian**: 2026-10-29 03:48
- **Files thay đổi**:
  - `src/components/grid/hooks/useColumnResize.ts` (183 dòng):
    - Cập nhật trực tiếp `--agv-col-w-<key>`, `--agv-total-grid-w` và các offset `--agv-left-offset-*` / `--agv-right-offset-*` lên `containerRef.current.style` trong RAF; tuyệt đối không gọi `setState` hay `setColWidth` khi `mousemove`; chỉ gọi `setColWidth` đúng 1 lần duy nhất khi `mouseup` (Dòng 48 - 180). Khóa `cursor: col-resize`, `user-select: none` và class `agv-resizing-column` trên body.
  - `src/index.css` (732 dòng):
    - Thêm rules cho `body.agv-resizing-column`: cưỡng chế `cursor: col-resize !important`, `user-select: none !important`, và vô hiệu hóa `-webkit-user-drag: none !important` trên `[draggable="true"]` (Dòng 720 - 731).
  - `src/components/grid/GridHeader.tsx` (543 dòng):
    - Chuyển toàn bộ width của cột đơn, cột ghim, nhóm Band (`groupWidthCalc` qua `calc(...)`), cột con tầng 2 và container bảng sang `var(--agv-col-w-*)` và `var(--agv-total-grid-w)` (Dòng 250 - 540); tắt `draggable` trong `createDragProps` khi đang kéo resize (Dòng 98 - 120).
  - `src/components/grid/GridRow.tsx` (1018 dòng):
    - Chuyển `totalRowWidth`, ô STT, ô tiêu đề nhóm (`titleWidthCalc` qua `calc(...)`), và toàn bộ các ô dữ liệu sang `var(--agv-col-w-*)`, `var(--agv-total-grid-w)`, `var(--agv-left-offset-*)`, `var(--agv-right-offset-*)` (Dòng 541 - 745).
  - `src/components/grid/GridFilterRow.tsx` (1301 dòng):
    - Chuyển container hàng filter và các ô lọc sang `var(--agv-col-w-*)` và `var(--agv-total-grid-w)` (Dòng 688 - 742).
  - `src/components/grid/GridChunkBlock.tsx` (269 dòng):
    - Chuyển width khối chunk 20 dòng sang `var(--agv-total-grid-w)` (Dòng 99 - 108).
  - `src/components/grid/VirtualizedGrid.tsx` (2346 dòng):
    - Khởi tạo và đưa `gridColVars` lên `containerRef.current` (`style={{ ...gridColVars, ...style }}`), truyền `containerRef`, `totalGridWidth`, `leftColumns`, `rightColumns`, `leftOffsets`, `rightOffsets` vào `useColumnResize` (Dòng 802 - 845, 1990 - 2005, 2165 - 2225).
  - `code_index.js`: Cập nhật đồng bộ số dòng và mô tả chức năng.

---

## 🕒 Lần 2: Khắc Phục Triệt Để Kéo Thả Đổi Thứ Tự Cột & Nhóm Band Trên Header Và Popup Tùy Chọn Cột (`GridHeader`, `VirtualizedGrid`, `AdvColumnChooserModal`, `App`)
- **Thời gian**: 2026-10-29 03:24
- **Files thay đổi**:
  - `src/App.tsx` (2027 dòng):
    - Đồng bộ `dynamicColumnGroups` sắp xếp cả danh sách nhóm Band lẫn mảng `keys` con bên trong từng nhóm theo đúng thứ tự `columnOrder` (Dòng 271 - 305).
    - Nâng cấp `handleReorderColumns` hỗ trợ kéo thả cột đơn, kéo thả cột con trong cùng nhóm Band 2 tầng, kéo thả nguyên khối nhóm Band/Atomic (`grp_infra`, `grp_time`, `grp_analytics`, `grp_perf`), và tự động đồng bộ vùng ghim (`columnPins`) khi kéo thả cột qua lại giữa các vùng Ghim Trái / Giữa / Ghim Phải (Dòng 402 - 511).
  - `src/components/grid/VirtualizedGrid.tsx` (2346 dòng):
    - Bổ sung `effectiveColumnGroups` tự động sắp xếp thứ tự các nhóm Band và các cột con theo mảng `columns` hiện hành, truyền đồng nhất vào `activeColKeys`, `middleElements`, `ColumnContextMenu` và `GridFloatingToolbar` (Dòng 483 - 521, 731 - 794, 2190, 2269).
  - `src/components/grid/GridHeader.tsx` (543 dòng) & `src/index.css` (732 dòng):
    - Chuẩn hóa DRY hàm `createDragProps` kết hợp `draggingColKeyRef` + `requestAnimationFrame` (tránh re-render đồng bộ làm ngắt `dragstart`), kiểm tra `e.currentTarget.contains(e.relatedTarget)` trong `onDragLeave`, bật `[draggable="true"] { -webkit-user-drag: element; }` trong `index.css`, và bổ sung đầy đủ kéo thả cho cả Tiêu đề Nhóm Tầng 1 (`group.id`) lẫn Cột Con Tầng 2 (`childCols`) (Dòng 96 - 164, 197, 291, 353, 428, 463).
  - `src/components/grid/floating/AdvColumnChooserModal.tsx` (1071 dòng):
    - Đồng bộ `orderedRawColumns` theo thứ tự `dataColumns` (Dòng 106 - 122) và bổ sung `measureSiblingMidpoints` đo tọa độ tâm thực tế của các phần tử anh em cùng cấp trước khi dịch chuyển, đồng thời lấy chiều cao thực của `.agv-chooser-band-group` giúp kéo thả các nhóm Band đang mở rộng mượt mà, không bị rung/nhảy chỉ số (Dòng 92, 273 - 289, 365 - 418, 556 - 622).
  - `code_index.js`: Cập nhật đồng bộ số dòng và mô tả chức năng.

---

## 🕒 Lần 1: Bổ Sung "Cuộn khớp dòng" Vào Popup Cài Đặt (`AdvGridSettingsPopup`) & Đồng Bộ 100% Màu Theme Cho Chart Tooltip Và Toàn Bộ Portals
- **Thời gian**: 2026-10-29 02:21
- **Files thay đổi**:
  - `src/components/grid/floating/AdvGridSettingsPopup.tsx` (113 dòng):
    - Bổ sung mục `Cuộn khớp dòng` với `MorphCheckbox` ở Nhóm 3 sau đường phân cách đúng 100% mockup đã duyệt (Dòng 94 - 110).
  - `src/components/grid/floating/types.ts` (116 dòng) & `src/components/grid/types.ts` (355 dòng):
    - Bổ sung `rowSnapMode: boolean` vào `GridSettingsState` (Dòng 68) và `onRowSnapModeChange?: (enabled: boolean) => void` vào `VirtualizedGridProps` (Dòng 317).
  - `src/components/grid/VirtualizedGrid.tsx` (2346 dòng):
    - Kết nối `gridSettings.rowSnapMode` với prop `rowSnapMode` / `onRowSnapModeChange` qua `handleUpdateGridSettings` (Dòng 116 - 117, 424 - 450, 2263).
  - `src/App.tsx` (2027 dòng):
    - Lưu trữ bền vững `rowSnapMode` trong `PersistedGridConfig` (`localStorage`), truyền `onRowSnapModeChange={handleRowSnapModeChange}` xuống `VirtualizedGrid` và gắn `agv-app-container ${getThemeClass(surfaceTheme)}` + `data-theme={surfaceTheme}` lên container gốc (Dòng 68, 109 - 117, 516, 1750 - 1751, 1845).
  - `src/demo/TwelveMonthChartCell.tsx` (358 dòng):
    - Gỡ bỏ các mã màu cứng fallback và biến `--agv-bg-panel` chưa định nghĩa trên Tooltip Portal của biểu đồ 12 tháng; đồng bộ 100% sang `var(--agv-bg-popup)`, `var(--agv-border-popup)`, `var(--agv-text-main)`, `var(--agv-trend-up)`, `var(--agv-trend-down)` kèm `getThemeClass(surfaceTheme)` và `getPortalThemeVars(surfaceTheme)` (Dòng 5 - 6, 171 - 183, 287 - 330).
  - `src/themes/common.ts` (311 dòng), `src/components/ui/enterpriseEditorUtils.ts` (152 dòng), `src/components/ui/datepicker/datePickerStyles.ts` (712 dòng), `src/components/ui/AdvSearchLookUpEdit.tsx` (766 dòng), `src/demo/PageToolbar.tsx` (572 dòng), `src/index.css` (732 dòng):
    - Định nghĩa đầy đủ `--agv-bg-panel`, `--agv-bg-subtle`, `--agv-border-subtle`, `--agv-pinned-shadow`, `--agv-accent-soft`, `--agv-weekend` trong `common.ts` và `getPortalThemeVars`; đồng bộ `datePickerStyles.ts` trực tiếp từ `LIGHT_THEME_TOKENS` / `DARK_THEME_TOKENS` / `BEZIER_ARTHOUSE_THEME_TOKENS` / `EINK_PAPER_THEME_TOKENS`; thay `#ffffff` cứng trên badge `Dòng Lọc` của `PageToolbar.tsx` bằng `var(--agv-accent-text)`.
  - `code_index.js`: Cập nhật đồng bộ số dòng và mô tả chức năng.
