# Nhật Ký 3 Lần Chỉnh Sửa Gần Nhất (Rolling Edit Log)

Tài liệu này lưu trữ thông tin chi tiết về file, vị trí dòng, phần tử/nội dung thay đổi của **3 lần chỉnh sửa code gần nhất**. Sau mỗi lần code mới, nhật ký này sẽ tự động cuốn chiếu (loại bỏ lần cũ nhất và bổ sung lần mới nhất).

---

## 🕒 Lần 3 (Mới nhất): Tích Hợp Theme Mới Tweakcn Hổ Phách & Tweakcn Tối Vào Hệ Thống Giao Diện Demo (`src/themes/tweakcnDemo.ts`, `src/themes/common.ts`, `src/themes/index.ts`, `src/demo/PageToolbar.tsx`, `src/components/ui/MorphIcons.tsx`)
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

---

## 🕒 Lần 2: Chuẩn Hóa Toàn Bộ Code Theo Chuẩn Tweakcn & Chuyển Đổi Toàn Bộ Tên Class Về Dạng Chung Chuẩn Shadcn/UI (`src/index.css`, `postcss.config.js`, `tailwind.config.js`, `src/themes/*`, `src/components/grid/*`, `src/main.tsx`)
- **Thời gian**: 2026-10-29 20:34
- **Files thay đổi**:
  - `src/index.css` (1002 dòng):
    - Khởi tạo chuẩn Tailwind directives (`@tailwind base; @tailwind components; @tailwind utilities;`), `@custom-variant dark`, bộ biến `:root` và `.dark` chuẩn không gian màu `oklch(...)`, `@theme inline` và `@layer base { * { border-color: var(--border); outline-color: color-mix(...); } body { background-color: var(--background); color: var(--foreground); } }`.
    - Tích hợp cầu nối CSS variables hai chiều đồng bộ giữa các token chuẩn Shadcn (`--primary`, `--background`, `--border`...) và các biến nội bộ `--agv-*`.
    - Bảo toàn 100% định dạng Monospace `.agv-cell-code`, thanh cuộn, hiệu ứng FLIP sort animation và tối ưu hóa 120fps column resize.
  - `postcss.config.js` (6 dòng) & `vite.config.ts` (6 dòng):
    - Đưa `postcss.config.js` và `vite.config.ts` về cấu hình tinh giản, thuần chuẩn Vite và Tailwind v3 mà không dùng shim tạm bợ.
    - Khắc phục triệt để và dứt điểm lỗi `The border-border class does not exist` trên cả Vite dev server (HMR) lẫn production build.
  - `tailwind.config.js` (106 dòng):
    - Cấu hình toàn bộ nhóm màu (`primary`, `background`, `foreground`, `card`, `popover`, `muted`, `accent`, `border`, `input`, `ring`, `sidebar`, `chart`) ánh xạ trực tiếp sang `var(--...)` để tương thích hoàn hảo với không gian màu OKLCH.
  - `src/themes/light.ts`, `src/themes/dark.ts`, `src/themes/bezierArthouse.ts`, `src/themes/eink.ts` & `src/themes/common.ts`:
    - Chuẩn hóa 4 theme hệ thống sang bảng màu quang học `oklch(...)`, đồng bộ các token chuẩn Shadcn trong `renderTokensCssBlock`.
  - 10 components giao diện Grid (`AdvCheckbox.tsx`, `AdvChecklistFilterPopup.tsx`, `AdvCriteriaSummaryPopup.tsx`, `AdvMultiFilterPopup.tsx`, `ColumnContextMenu.tsx`, `AdvColumnChooserModal.tsx`, `AdvGridQueryBuilderModal.tsx`, `GridFilterRow.tsx`, `GridHeader.tsx`, `GridRow.tsx`):
    - Chuyển đổi 100% các class tự tạo (`bg-agv-accent`, `text-agv-accent`, `border-agv-accent`, `ring-agv-accent`, `text-agv-accent-text`, `bg-agv-bg-root`, `bg-agv-bg-card`, `bg-agv-bg-hover`, `text-agv-text-main`, `text-agv-text-muted`, `border-agv-border`) sang các tên class dạng chung chuẩn Shadcn/Tweakcn (`bg-primary`, `text-primary`, `border-primary`, `ring-ring`, `text-primary-foreground`, `bg-background`, `bg-card`, `bg-muted`, `text-foreground`, `text-muted-foreground`, `border-border`).
  - `src/main.tsx` (59 dòng):
    - Cập nhật bộ lắng nghe sự kiện `TWEAKCN_THEME_UPDATE` đồng bộ tức thì cả hệ biến Shadcn lẫn hệ biến AGV Engine khi người dùng chỉnh sửa giao diện trực tiếp trên tweakcn.com.

---

## 🕒 Lần 1: Cấu Hình Chuẩn Shadcn/UI CSS Variables & Kết Nối Tweakcn Live Preview (`src/index.css`, `tailwind.config.js`, `components.json`, `src/main.tsx`)
- **Thời gian**: 2026-10-29 19:55
- **Files thay đổi**:
  - `src/index.css`:
    - Khai báo đầy đủ 19 biến CSS bắt buộc của chuẩn shadcn/ui (`--radius`, `--background`, `--foreground`, `--card`, `--card-foreground`, `--popover`, `--popover-foreground`, `--primary`, `--primary-foreground`, `--secondary`, `--secondary-foreground`, `--muted`, `--muted-foreground`, `--accent`, `--accent-foreground`, `--destructive`, `--destructive-foreground`, `--border`, `--input`, `--ring`) trên cả `:root` lẫn `.dark`.
  - `tailwind.config.js` & `components.json`:
    - Bổ sung `darkMode: ['class']`, `borderRadius` và các nhóm màu chuẩn shadcn ánh xạ qua biến CSS, bảo toàn 100% các biến màu `agv` có sẵn.
    - Tạo tệp cấu hình chuẩn `components.json` xác nhận dự án sử dụng Tailwind CSS Variables (`"cssVariables": true`).
  - `src/main.tsx`:
    - Tích hợp bộ lắng nghe sự kiện `TWEAKCN_THEME_UPDATE` tự động đồng bộ màu chủ đạo `primary` sang `--agv-accent`, `background` sang `--agv-bg-root`, `foreground` sang `--agv-text-main` và `border` sang `--agv-border`.
