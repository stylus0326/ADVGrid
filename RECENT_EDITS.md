# Nhật Ký 3 Lần Chỉnh Sửa Gần Nhất (Rolling Edit Log)

Tài liệu này lưu trữ thông tin chi tiết về file, vị trí dòng, phần tử/nội dung thay đổi của **3 lần chỉnh sửa code gần nhất**. Sau mỗi lần code mới, nhật ký này sẽ tự động cuốn chiếu (loại bỏ lần cũ nhất và bổ sung lần mới nhất).

---

## 🕒 Lần 3 (Mới nhất): Chuyển Hoạt Ảnh Checkbox Toàn Hệ Thống Sang Snappy Nhanh & Dứt Khoát (`MorphIcons.tsx`, `AdvCheckbox.tsx`, `App.tsx`, `GridFilterRow.tsx`, `FilterModal.tsx`)
- **Thời gian**: 2026-10-30 17:14
- **Files thay đổi**:
  - `src/components/ui/MorphIcons.tsx` (199 dòng):
    - Đổi cấu hình `spring` mặc định của `MorphCheckbox` sang `'snappy'` (`stiffness: 420`, `damping: 30`).
    - Tốc độ chuyển đổi siêu tốc, phản hồi dứt khoát tức thì khi click chọn dòng/lọc dữ liệu với bộ ba `Square` <-> `SquareCheck` <-> `SquareMinus`.
  - `src/components/grid/AdvCheckbox.tsx` (54 dòng):
    - Đồng bộ `spring = 'snappy'` mặc định cho toàn bộ các control dùng chung kế thừa `AdvCheckbox` (Phễu lọc Checklist, Modal chọn cột, v.v.).
  - `src/App.tsx` (2096 dòng):
    - Cập nhật cột chọn dòng Grid (`col_chk`) sang `spring="snappy"`.
  - `src/components/grid/GridFilterRow.tsx` (1303 dòng):
    - Cập nhật checkbox 3 trạng thái trên hàng Filter Row sang `spring="snappy"`.
  - `src/demo/FilterModal.tsx` (280 dòng):
    - Đồng bộ toàn bộ 5 khối Checkbox điều kiện lọc sang `spring="snappy"`.

---

## 🕒 Lần 2: Đồng Bộ Hóa Toàn Diện Checkbox Hệ Thống Sang MorphIcons Lò Xo Với SquareCheck Chuẩn Lucide (`MorphIcons.tsx`, `AdvCheckbox.tsx`, `GridFilterRow.tsx`)
- **Thời gian**: 2026-10-30 16:53
- **Files thay đổi**:
  - `src/components/ui/MorphIcons.tsx` (199 dòng):
    - Thay thế icon trạng thái Checked bằng `SquareCheck` từ `lucide` (`https://lucide.dev/icons/square-check`) thay cho `SquareCheckBig`, mang lại hình ảnh dấu tick gọn gàng chuẩn xác bên trong khung viền vuông khép kín.
    - Bộ ba trạng thái của `MorphCheckbox`:
      + Chưa chọn (`unchecked`): `Square` (`https://lucide.dev/icons/square`)
      + Đã chọn (`checked`): `SquareCheck` (`https://lucide.dev/icons/square-check`)
      + Bán chọn (`indeterminate`): `SquareMinus` (`https://lucide.dev/icons/square-minus`)
    - Chuyển đổi trạng thái bằng `MorphIcon`, màu sắc chuẩn CSS tokens `var(--agv-accent)` và `var(--agv-text-muted)`.
  - `src/components/grid/AdvCheckbox.tsx` (54 dòng):
    - Tái sử dụng trực tiếp `MorphCheckbox` với bộ ba `Square` <-> `SquareCheck` <-> `SquareMinus`.
    - Tự động mang lại hiệu ứng biến hình cho toàn bộ các nơi dùng `AdvCheckbox`: Phễu lọc giá trị (`AdvChecklistFilterPopup.tsx`), Modal chọn cột (`AdvColumnChooserModal.tsx`), v.v.
  - `src/components/grid/GridFilterRow.tsx` (1303 dòng):
    - Tích hợp `MorphCheckbox` 3 trạng thái cho các cột checkbox trên hàng Filter Row (`ALL` -> `indeterminate` / `SquareMinus`, `CHECKED` -> `checked` / `SquareCheck`, `UNCHECKED` -> `unchecked` / `Square`), đồng bộ triệt để hiệu ứng động và màu sắc theo theme.

---

## 🕒 Lần 1: Khắc Phục Triệt Để Lỗi Giật Dòng Sau Mỗi Lần Cuộn & Đồng Bộ 100% Theme Tokens Cho ComboBox, DatePicker & Toàn Bộ Portals (`index.css`, `App.tsx`, `themes/index.ts`, `customCssBridge.ts`, `AdvComboBoxEdit.tsx`, `AdvSearchLookUpEdit.tsx`, `datePickerStyles.ts`, `AdvGridQueryBuilderModal.tsx`)
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
