# Nhật Ký 3 Lần Chỉnh Sửa Gần Nhất (Rolling Edit Log)

Tài liệu này lưu trữ thông tin chi tiết về file, vị trí dòng, phần tử/nội dung thay đổi của **3 lần chỉnh sửa code gần nhất**. Sau mỗi lần code mới, nhật ký này sẽ tự động cuốn chiếu (loại bỏ lần cũ nhất và bổ sung lần mới nhất).

---

## 🕒 Lần 3 (Mới nhất): Khắc Phục Triệt Để Lỗi PostCSS `The border-border class does not exist` & Hỗ Trợ 100% Cú Pháp Raw Tweakcn (`vite.config.ts`, `src/index.css`, `code_index.js`)
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

---

## 🕒 Lần 2: Đồng Bộ Triệt Để Bộ Tokens Theme Sáng (Light) & Bổ Sung Biến --radius Vào Render Tokens (`src/themes/light.ts`, `src/themes/common.ts`, `code_index.js`)
- **Thời gian**: 2026-10-29 21:32
- **Files thay đổi**:
  - `src/themes/light.ts` (44 dòng):
    - Đồng bộ 100% các giá trị màu quang học OKLCH: `warning` & `warningBg` khớp `--secondary` / `--chart-2` (`oklch(0.8567 0.1164 81.0092)`), `trendUp` khớp `--chart-3` / `--accent` (`oklch(0.6896 0.0714 234.0387)`), `trendDown` khớp `--destructive` (`oklch(0.2611 0.0376 322.5267)`).
  - `src/themes/common.ts` (353 dòng):
    - Bổ sung `--radius: 0.5rem;` trực tiếp vào hàm `renderTokensCssBlock` đảm bảo mọi theme khi kích hoạt đều tự động xuất token bo góc đồng bộ chuẩn Shadcn.
  - `code_index.js` (1066 dòng):
    - Cập nhật số dòng `src/themes/` (735 dòng).

---

## 🕒 Lần 1: Tích Hợp Theme Mới Tweakcn Hổ Phách & Tweakcn Tối Vào Hệ Thống Giao Diện Demo (`src/themes/tweakcnDemo.ts`, `src/themes/common.ts`, `src/themes/index.ts`, `src/demo/PageToolbar.tsx`, `src/components/ui/MorphIcons.tsx`)
- **Thời gian**: 2026-10-29 21:12
- **Files thay đổi**:
  - `src/themes/tweakcnDemo.ts` (87 dòng):
    - Khởi tạo bộ tokens `TWEAKCN_DEMO_LIGHT_THEME_TOKENS` và `TWEAKCN_DEMO_DARK_THEME_TOKENS` theo đúng bảng màu quang học OKLCH trích xuất từ tweakcn: Primary hổ phách `oklch(0.6397 0.1720 36.4421)`, Background sáng `oklch(0.9383 0.0042 236.4993)`, Background tối `oklch(0.2598 0.0306 262.6666)`, Card/Popover `oklch(1 0 0)` / `oklch(0.3106 0.0301 268.6365)`.
  - `src/themes/common.ts` (352 dòng):
    - Bổ sung `TWEAKCN_DEMO: 'tweakcn-demo'` và `TWEAKCN_DEMO_DARK: 'tweakcn-demo-dark'` vào `SURFACE_THEMES`.
    - Đăng ký 2 mục theme mới vào `REGISTERED_THEMES` với `iconName: 'Sparkles'`, bổ sung vào `THEME_CLASS_MAP` và `THEME_SELECTORS`.
  - `src/themes/index.ts` (109 dòng):
    - Xuất khẩu toàn bộ từ `./tweakcnDemo` và đăng ký token vào `THEME_TOKENS` phục vụ sinh động biến CSS qua `generateThemeCssVariables()`.
  - `src/components/ui/MorphIcons.tsx` (174 dòng):
    - Tích hợp và xuất khẩu `SparklesIcon` từ `lucide` tương thích chuẩn tuple `IconNode` của bộ biến hình lò xo `morphicons`.
  - `src/demo/PageToolbar.tsx` (575 dòng):
    - Hỗ trợ icon `SparklesIcon` cho các nút theme mới trên thanh công cụ điều khiển giao diện, đảm bảo min-height 28px và tương thích 100% theme active styling.
