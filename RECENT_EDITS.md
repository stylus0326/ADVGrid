# Nhật Ký 3 Lần Chỉnh Sửa Gần Nhất (Rolling Edit Log)

Tài liệu này lưu trữ thông tin chi tiết về file, vị trí dòng, phần tử/nội dung thay đổi của **3 lần chỉnh sửa code gần nhất**. Sau mỗi lần code mới, nhật ký này sẽ tự động cuốn chiếu (loại bỏ lần cũ nhất và bổ sung lần mới nhất).

---

## 🕒 Lần 3 (Mới nhất): Khắc Phục Triệt Để Lỗi Cuộn Bị Reset Về Đầu Khi Mở ComboBox/Select & Đồng Bộ Đồng Thời `isJustOpenedRef` + `requestAnimationFrame` (`src/components/ui/AdvComboBoxEdit.tsx`, `src/components/ui/AdvSelect.tsx`, `code_index.js`)
- **Thời gian**: 2026-10-30 00:54
- **Files thay đổi**:
  - `src/components/ui/AdvComboBoxEdit.tsx` (405 dòng):
    - Khắc phục triệt để nguyên nhân gốc rễ (Root Cause) khiến dropdown bị reset cuộn về đầu và highlight nhầm "Modern Minimal" (ảnh người dùng gửi): `useEffect` bám phím mũi tên chạy ngay sau `useLayoutEffect` với `highlightedIndex = 0` cũ làm ghi đè `scrollTop` về 0.
    - Bổ sung `isJustOpenedRef`: bảo vệ vị trí cuộn căn giữa được tính bởi `useLayoutEffect`, ngăn chặn triệt để hiệu ứng bàn phím ghi đè khi vừa mở popup.
    - Đồng bộ `syncHighlightedToSelected()` ngay tức thì trong `handleTriggerClick` và sự kiện nhấn phím mũi tên `ArrowDown` trước khi mount portal.
    - Bổ sung `requestAnimationFrame` kép trong `useLayoutEffect` để bảo toàn vị trí căn giữa ngay cả khi CSS Spring Animation (`agv-spring-down` / `agv-spring-up`) đang co giãn kích thước DOM.
  - `src/components/ui/AdvSelect.tsx` (317 dòng):
    - Đồng bộ cơ chế bảo vệ `isJustOpenedRef` và `requestAnimationFrame` tương tự cho primitive Select thuần túy.
  - `code_index.js` (1087 dòng):
    - Cập nhật số dòng `AdvComboBoxEdit.tsx` (405 dòng) và `AdvSelect.tsx` (317 dòng).

---

## 🕒 Lần 2: Tự Động Cuộn Đến Mục Đã Chọn Sẵn & Theo Phím Mũi Tên Trong AdvComboBoxEdit và AdvSelect (`src/components/ui/AdvComboBoxEdit.tsx`, `src/components/ui/AdvSelect.tsx`)
- **Thời gian**: 2026-10-30 00:44
- **Files thay đổi**:
  - `src/components/ui/AdvComboBoxEdit.tsx` (380 dòng):
    - Gắn `data-item-index={idx}` và `data-selected={isSelected ? 'true' : undefined}` lên từng phần tử item dropdown.
    - Bổ sung `useLayoutEffect` tự động tính toán `scrollTop` căn giữa ngay tức thì mục đang chọn vào trung tâm khung nhìn dropdown khi vừa mở popup.
    - Bổ sung `useEffect` tự động cuộn bám theo phím mũi tên `ArrowUp` / `ArrowDown` (Nearest Boundary Scroll).
  - `src/components/ui/AdvSelect.tsx` (301 dòng):
    - Đồng bộ cơ chế auto-scroll to selected item khi mở dropdown và scroll tracking khi điều hướng bàn phím cho primitive Select thuần.

---

## 🕒 Lần 1: Tích Hợp Thư Mục 42 Themes Tweakcn Chuẩn, Điều Khiển Qua AdvComboBoxEdit & Nút Chuyển Đổi Ngày/Đêm (`src/themes/presets/*`, `src/themes/common.ts`, `src/themes/index.ts`, `src/demo/PageToolbar.tsx`, `src/App.tsx`, `src/components/ui/AdvComboBoxEdit.tsx`)
- **Thời gian**: 2026-10-30 00:40
- **Files thay đổi**:
  - `src/themes/presets/` (4 files, 3819 dòng):
    - Khởi tạo thư mục presets chứa toàn bộ 42 themes từ tweakcn.com (`types.ts`, `data.ts`, `converter.ts`, `index.ts`), mỗi theme hỗ trợ song song 2 trạng thái `light` và `dark`.
    - Cung cấp hàm `convertPresetToGridTokens` và `generatePresetCssVariables` chuyển đổi tức thì từ cấu hình Tweakcn sang `GridThemeTokens` và biến CSS của hệ thống.
  - Xóa bỏ 5 file theme cũ: `light.ts`, `dark.ts`, `bezierArthouse.ts`, `eink.ts`, `tweakcnDemo.ts`.
  - `src/themes/common.ts` (348 dòng) & `src/themes/index.ts` (112 dòng):
    - Đăng ký toàn bộ 42 themes vào `SURFACE_THEMES`, `REGISTERED_THEMES`, `THEME_CLASS_MAP` và `THEME_SELECTORS`.
    - Bảo toàn tương thích ngược cho các hằng số theme cũ (`LIGHT`, `DARK`, `BEZIER_ARTHOUSE`, `E_INK`).
  - `src/demo/PageToolbar.tsx` (571 dòng):
    - Thay thế hàng nút theme cũ bằng cụm **ComboBox 42 Themes** (dùng `AdvComboBoxEdit`, width 175px, min-h 28px) và **Nút Ngày / Đêm** (`MorphIcon` Sun <-> Moon, min-h 28px, 100% theme CSS variables).
  - `src/App.tsx` (2058 dòng):
    - Quản lý 2 trạng thái song song `surfaceTheme` (42 themes) và `themeMode` (`light` / `dark`), tự động đồng bộ class `.dark`, `data-theme-mode` và nạp động CSS variables qua `generatePresetCssVariables` trong 0ms.
