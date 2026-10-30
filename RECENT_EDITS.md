# Nhật Ký 3 Lần Chỉnh Sửa Gần Nhất (Rolling Edit Log)

Tài liệu này lưu trữ thông tin chi tiết về file, vị trí dòng, phần tử/nội dung thay đổi của **3 lần chỉnh sửa code gần nhất**. Sau mỗi lần code mới, nhật ký này sẽ tự động cuốn chiếu (loại bỏ lần cũ nhất và bổ sung lần mới nhất).

---

## 🕒 Lần 3 (Mới nhất): Khắc Phục Triệt Để Lỗi Giật Dòng Sau Mỗi Lần Cuộn & Đồng Bộ 100% Theme Tokens Cho ComboBox, DatePicker & Toàn Bộ Portals (`index.css`, `App.tsx`, `themes/index.ts`, `customCssBridge.ts`, `AdvComboBoxEdit.tsx`, `AdvSearchLookUpEdit.tsx`, `datePickerStyles.ts`, `AdvGridQueryBuilderModal.tsx`)
- **Thời gian**: 2026-10-30 14:40
- **Files thay đổi**:
  - `src/index.css` (784 dòng):
    - Khắc phục triệt để lỗi giật dòng sau mỗi lần cuộn: Loại bỏ selector `.agv-scroll-viewport[data-agv-scrolling="true"] .agv-row-enter` can thiệp vào `animation: none !important`. Trước đó khi dừng cuộn (sau 110ms timeout), cờ `data-agv-scrolling` bị xóa khiến CSS engine re-trigger lại keyframe `agv-row-enter` từ 0% làm các hàng bị giật nhảy 3px.
    - Loại bỏ hoàn toàn `transform: translateY(3px)` khỏi `@keyframes agv-row-enter` (chỉ chuyển đổi độ mờ `opacity: 0.88 -> 1` trong 100ms), bảo toàn 100% `position: sticky` và loại bỏ nguy cơ xô lệch pixel theo trục dọc $Y$ khi virtualizing chunk.
  - `src/App.tsx` (2096 dòng):
    - Sửa lỗi gốc lệch màu theme trên Portals: Đồng bộ đồng thời class Theme (`agv-light`, `agv-dark`, `agv-theme-custom`...), class `dark` và thuộc tính `data-theme={surfaceTheme}` lên cả `document.documentElement` (`<html>`) VÀ `document.body` (`<body>`). Ngăn chặn triệt để tình trạng thẻ `body` không có class `.dark` khiến selector `body:not(.dark)` bị match nhầm trong chế độ Đêm.
  - `src/themes/index.ts` (246 dòng) & `src/themes/customCssBridge.ts` (337 dòng):
    - Chuẩn hóa toàn diện các bộ selectors Ngày và Đêm cho cả 4 Theme chuẩn và Custom CSS: các biến chế độ Ngày chỉ kích hoạt khi `:not(.dark)`, các biến chế độ Đêm luôn áp dụng với độ đặc hiệu cao khi có `.dark`, đảm bảo khi người dùng nhập bất kỳ đoạn mã CSS nào thì toàn bộ hệ thống đều tự động cập nhật đồng nhất không ngoại lệ.
  - `src/components/ui/AdvComboBoxEdit.tsx` (371 dòng) & `src/components/ui/AdvSearchLookUpEdit.tsx` (781 dòng) & `src/components/grid/floating/AdvGridQueryBuilderModal.tsx` (1525 dòng):
    - Thêm `data-theme={theme}` và gắn inline style trực tiếp (`backgroundColor: 'var(--agv-bg-control, var(--agv-bg-root))'`, `color: 'var(--agv-text-main)'`, `backgroundColor: 'var(--agv-bg-popup)'`, `borderColor: 'var(--agv-border-popup)'`) cho trigger wrapper và dropdown portal.
    - Dropdown item của `AdvComboBoxEdit`: mục được chọn (`isSelected`) luôn nhận `var(--agv-accent)` chữ trắng `var(--agv-accent-text, #ffffff)`, mục hover nhận `var(--agv-bg-item-hover)` chữ `var(--agv-text-main)`, đồng bộ 100% với Theme hiện tại.
  - `src/components/ui/datepicker/datePickerStyles.ts` (639 dòng):
    - Khắc phục lỗi tương phản tách rời Quý/Tháng trên Popup DatePicker: chuyển `background` của `.agv-preset-subgrid` sang `var(--agv-bg-subtle, var(--agv-bg-row-alt, var(--agv-bg-root)))` và `.agv-preset-chip` sang `var(--agv-bg-control, var(--agv-bg-popup))`, giúp khối mốc nhanh hòa hợp 100% với nền popup.

---

## 🕒 Lần 2: Tối Ưu Toàn Diện Hiệu Năng 0% CPU Idle, Độ Mượt Cuộn Cao Tốc & Tái Cấu Trúc Module Chuẩn Data-Driven (`VirtualizedGrid.tsx`, `App.tsx`, `GridRow.tsx`, `apiService.ts`, `useColumnResize.ts`, `useGridKeyboardNav.ts`, `useGridSortFlipAnimation.ts`, `datePickerStyles.ts`, `index.css`, `themes/index.ts`)
- **Thời gian**: 2026-10-30 14:15
- **Files thay đổi**:
  - `src/components/grid/VirtualizedGrid.tsx` (2260 dòng):
    - Thay thế vòng lặp `requestAnimationFrame` đo FPS chạy ngầm 24/7 bằng cơ chế **On-Demand FPS Monitor** (`startFpsMonitor` / `stopFpsMonitor`): chỉ kích hoạt đo FPS khi bảng thực sự đang cuộn hoặc bật `autoScrolling`, tự động ngủ 0% CPU khi bảng đứng yên (idle).
    - Gộp 2 listener `wheel` (`handleWheelSnap` & `handleWheelLock`) thành 1 listener duy nhất `handleWheel`, kiểm tra `target.closest(POPUP_SELECTORS)` ở đầu hàm giúp cuộn tự nhiên bên trong mọi popup con trước khi khóa cuộn Grid hoặc căn dòng `rowSnapMode`.
    - Dùng chung `POPUP_SELECTORS` từ `src/components/grid/constants.ts` (xóa khai báo trùng lặp).
    - Tách 2 khối logic lớn sang custom hooks độc lập: `useGridKeyboardNav` và `useGridSortFlipAnimation`.
  - `src/components/grid/hooks/useGridKeyboardNav.ts` (156 dòng) & `src/components/grid/hooks/useGridSortFlipAnimation.ts` (180 dòng) & `src/components/grid/hooks/index.ts`:
    - Đóng gói hoàn chỉnh điều hướng bàn phím (`ArrowUp/Down/PageUp/Down/Space`) và động cơ trượt dòng FLIP khi Sort chuẩn AG Grid.
  - `src/App.tsx` (2078 dòng):
    - Nâng cấp `monthStatsCacheRef` (`WeakMap`) gắn trực tiếp vào `baseRecord` gốc (`apiData[r]`) thông qua hàm `getOrComputeMonthStats(recordObj)` và thuộc tính `_baseRecord` trong `getRow`.
    - Tái sử dụng $O(1)$ `getOrComputeMonthStats` trong cả `getRowVal(r, 'col_formula')` lẫn `renderCell`, loại bỏ triệt để việc cấp phát 50.000 mảng tạm `mVals` trên Heap khi lọc dữ liệu, đổi công thức `AVG/SUM/MIN/MAX` hoặc tính tổng nhóm.
    - Dùng chung `DEFAULT_CHUNK_SIZE` và `DEFAULT_ROW_HEIGHT` từ `./components/grid`.
  - `src/components/grid/GridRow.tsx` (1000 dòng) & `src/services/apiService.ts` (1045 dòng):
    - Chuyển các danh mục `STATUS_COMBO_OPTIONS`, `REGION_LOOKUP_DATA`, `REGION_LOOKUP_COLUMNS` từ `GridRow.tsx` sang `apiService.ts` và truyền qua `col.editorOptions` của `INITIAL_COLUMNS`, giúp `GridRow.tsx` thuần khiết 100% Data-Driven.
  - `src/components/grid/hooks/useColumnResize.ts` (340 dòng):
    - Lưu trữ và khôi phục biểu thức `origWidthStyle` (`calc(var(--agv-col-w-...))`) trên `bandContainers` sau khi kết thúc kéo giãn cột (`cleanupResize`).
  - `src/components/ui/datepicker/datePickerStyles.ts` (640 dòng):
    - Tối ưu `ensureDatePickerStyles()` thoát sớm $O(1)$ (`if (style) return;`) khi thẻ `#agv-datepicker-core-styles` đã tồn tại, không ghi đè lại 600+ dòng CSS mỗi lần mở DatePicker.
  - `src/themes/index.ts` (211 dòng):
    - Xóa khối `scrollbarCss` trùng lặp trong `src/themes/index.ts`.

---

## 🕒 Lần 1: Khắc Phục Triệt Để Lỗi Gắn Class CSS & Inline Style Khiến ComboBox Bị Trắng Toát Trên Theme Dark (`enterpriseEditorUtils.ts`, `themes/index.ts`)
- **Thời gian**: 2026-10-30 12:45
- **Files thay đổi**:
  - `src/components/ui/enterpriseEditorUtils.ts` (114 dòng):
    - Khắc phục lỗi gốc: `getPortalThemeVars()` trước đó gọi `getThemeTokens(theme)` với `isDark = false` mặc định, sinh ra 30 biến CSS của Balham Light (`--agv-bg-popup: #ffffff`, `--agv-bg-control: #ffffff`, `--agv-text-main: #182230`) gắn thẳng vào `style={{ ...getPortalThemeVars(theme) }}` đè bẹp CSS variables của theme và dark mode.
    - Cập nhật `getPortalThemeVars` luôn trả về `{}` rỗng 100%, xóa bỏ triệt để việc inline style đè biến CSS. Cho phép tất cả controls và portals kế thừa tự nhiên từ `document.documentElement`.
  - `src/themes/index.ts` (242 dòng):
    - Sửa lỗi gắn class CSS: xóa bỏ hoàn toàn các selector sai ngữ nghĩa `.agv-dark:not(.dark)` và `.agv-bezier-arthouse:not(.dark)`. Những selector này vốn tác động sai lên chính các phần tử con (như `agv-comboboxedit-wrapper` hay `agv-comboboxedit-dropdown`) vì phần tử con không mang class `.dark` dù thẻ `<html>` cha đang ở chế độ Đêm.
    - Chuẩn hóa toàn bộ selector Ngày/Đêm gắn chặt với trạng thái của thẻ gốc:
      - Ngày: `html:not(.dark) .agv-dark`, `html:not(.dark).agv-dark`, `body:not(.dark) .agv-dark`...
      - Đêm: `html.dark .agv-dark`, `html.dark.agv-dark`, `body.dark .agv-dark`, `body.dark.agv-dark`, `.dark .agv-dark`, `.dark.agv-dark`...
    - Giúp Theme ComboBox (`AdvComboBoxEdit`) hiển thị đúng 100% màu nền và chữ của Balham Dark (nền `#182230`, viền `#2e3d4f`, chữ `#f0f4f8`), tự động chuyển đổi hoàn hảo giữa 5 theme và 2 chế độ Ngày/Đêm.
