# Nhật Ký 3 Lần Chỉnh Sửa Gần Nhất (Rolling Edit Log)

Tài liệu này lưu trữ thông tin chi tiết về file, vị trí dòng, phần tử/nội dung thay đổi của **3 lần chỉnh sửa code gần nhất**. Sau mỗi lần code mới, nhật ký này sẽ tự động cuốn chiếu (loại bỏ lần cũ nhất và bổ sung lần mới nhất).

---

## 🕒 Lần 3 (Mới nhất): Tự Động Cuộn Đến Mục Đã Chọn Sẵn & Theo Phím Mũi Tên Trong AdvComboBoxEdit và AdvSelect (`src/components/ui/AdvComboBoxEdit.tsx`, `src/components/ui/AdvSelect.tsx`, `code_index.js`)
- **Thời gian**: 2026-10-30 00:44
- **Files thay đổi**:
  - `src/components/ui/AdvComboBoxEdit.tsx` (380 dòng):
    - Gắn `data-item-index={idx}` và `data-selected={isSelected ? 'true' : undefined}` lên từng phần tử item dropdown.
    - Bổ sung `useLayoutEffect` tự động tính toán `scrollTop` căn giữa ngay tức thì mục đang chọn vào trung tâm khung nhìn dropdown khi vừa mở popup (triệt tiêu 100% việc phải cuộn mò mẫm qua 42 items).
    - Bổ sung `useEffect` tự động cuộn bám theo phím mũi tên `ArrowUp` / `ArrowDown` (Nearest Boundary Scroll), bảo đảm không gây trôi lệch thanh cuộn của Grid hoặc Window.
  - `src/components/ui/AdvSelect.tsx` (301 dòng):
    - Đồng bộ cơ chế auto-scroll to selected item khi mở dropdown và scroll tracking khi điều hướng bàn phím cho primitive Select thuần.
  - `code_index.js` (1087 dòng):
    - Cập nhật số dòng `AdvComboBoxEdit.tsx` (380 dòng) và `AdvSelect.tsx` (301 dòng).

---

## 🕒 Lần 2: Tích Hợp Thư Mục 42 Themes Tweakcn Chuẩn, Điều Khiển Qua AdvComboBoxEdit & Nút Chuyển Đổi Ngày/Đêm (`src/themes/presets/*`, `src/themes/common.ts`, `src/themes/index.ts`, `src/demo/PageToolbar.tsx`, `src/App.tsx`, `src/components/ui/AdvComboBoxEdit.tsx`)
- **Thời gian**: 2026-10-30 00:40
- **Files thay đổi**:
  - `src/themes/presets/` (4 files, 3819 dòng):
    - Khởi tạo thư mục presets chứa toàn bộ 42 themes từ tweakcn.com (`types.ts`, `data.ts`, `converter.ts`, `index.ts`), mỗi theme hỗ trợ song song 2 trạng thái `light` và `dark`.
    - Cung cấp hàm `convertPresetToGridTokens` và `generatePresetCssVariables` chuyển đổi tức thì từ cấu hình Tweakcn sang `GridThemeTokens` và biến CSS của hệ thống.
  - Xóa bỏ 5 file theme cũ: `light.ts`, `dark.ts`, `bezierArthouse.ts`, `eink.ts`, `tweakcnDemo.ts`.
  - `src/themes/common.ts` (348 dòng) & `src/themes/index.ts` (112 dòng):
    - Đăng ký toàn bộ 42 themes vào `SURFACE_THEMES`, `REGISTERED_THEMES`, `THEME_CLASS_MAP` và `THEME_SELECTORS`.
    - Bảo toàn tương thích ngược cho các hằng số theme cũ (`LIGHT`, `DARK`, `BEZIER_ARTHOUSE`, `E_INK`).
  - `src/components/ui/AdvComboBoxEdit.tsx` (345 dòng):
    - Cải tiến hiển thị label thân thiện của option đang chọn khi không gõ phím (`displayVal`), hỗ trợ gõ lọc tức thì trên cả mã và tên theme.
  - `src/demo/PageToolbar.tsx` (571 dòng):
    - Thay thế hàng nút theme cũ bằng cụm **ComboBox 42 Themes** (dùng `AdvComboBoxEdit`, width 175px, min-h 28px) và **Nút Ngày / Đêm** (`MorphIcon` Sun <-> Moon, min-h 28px, 100% theme CSS variables).
  - `src/App.tsx` (2058 dòng):
    - Quản lý 2 trạng thái song song `surfaceTheme` (42 themes) và `themeMode` (`light` / `dark`), tự động đồng bộ class `.dark`, `data-theme-mode` và nạp động CSS variables qua `generatePresetCssVariables` trong 0ms.

---

## 🕒 Lần 1: Khắc Phục Triệt Để Lỗi PostCSS `The border-border class does not exist` & Hỗ Trợ 100% Cú Pháp Raw Tweakcn (`vite.config.ts`, `src/index.css`, `code_index.js`)
- **Thời gian**: 2026-10-29 21:53
- **Files thay đổi**:
  - `vite.config.ts` (54 dòng):
    - Tích hợp Vite Plugin `tweakcnV4CompatPlugin` chạy ở giai đoạn `enforce: 'pre'`. Chặn và chuyển đổi trực tiếp trên stream bộ nhớ: `@import "tailwindcss";` -> `@tailwind base/components/utilities`, loại bỏ `@custom-variant dark`, chuyển `@apply border-border outline-ring/50;` và `@apply bg-background text-foreground;` thành các thuộc tính CSS tương ứng.
    - Loại bỏ hoàn toàn lỗi PostCSS `The border-border class does not exist` và `Unknown word "use strict"` mà không cần bất kỳ file shim hay cấu hình phức tạp nào.
  - `src/index.css` (1001 dòng):
    - Bảo toàn 100% định dạng raw CSS xuất từ tweakcn.com (`@import "tailwindcss";`, `@custom-variant dark (&:is(.dark *));`, `:root`, `.dark`, `@theme inline`, `@layer base { * { @apply border-border outline-ring/50; } body { @apply bg-background text-foreground; } }`).
    - Người dùng có thể copy/paste trực tiếp từ tweakcn.com vào `src/index.css` mà không cần chỉnh sửa tay bất kỳ dòng nào.
  - `code_index.js` (1087 dòng):
    - Bổ sung mã lỗi chẩn đoán `ERR_TWEAKCN_V4_BORDER_BORDER` hỗ trợ tra cứu tự động qua `node code_index.js --error "border-border"`.
    - Cập nhật số dòng `src/index.css` (1001 dòng) và bổ sung `vite.config.ts` (54 dòng).
