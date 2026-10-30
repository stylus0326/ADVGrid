# Nhật Ký 3 Lần Chỉnh Sửa Gần Nhất (Rolling Edit Log)

Tài liệu này lưu trữ thông tin chi tiết về file, vị trí dòng, phần tử/nội dung thay đổi của **3 lần chỉnh sửa code gần nhất**. Sau mỗi lần code mới, nhật ký này sẽ tự động cuốn chiếu (loại bỏ lần cũ nhất và bổ sung lần mới nhất).

---

## 🕒 Lần 3 (Mới nhất): Khắc Phục Triệt Để Lỗi Gắn Class CSS & Inline Style Khiến ComboBox Bị Trắng Toát Trên Theme Dark (`enterpriseEditorUtils.ts`, `themes/index.ts`)
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

---

## 🕒 Lần 2: Triển Khai Segmented Control Ngày/Đêm Chuẩn Mockup 1, Đồng Bộ 100% Ngày/Đêm Cho 4 Theme & Custom CSS, Khắc Phục Triệt Để Lệch Màu Popup ComboBox & DatePicker (`PageToolbar.tsx`, `App.tsx`, `AdvComboBoxEdit.tsx`, `datePickerStyles.ts`, `customCssBridge.ts`, `themes/common.ts`, `themes/index.ts`)
- **Thời gian**: 2026-10-30 11:45
- **Files thay đổi**:
  - `src/demo/PageToolbar.tsx` (626 dòng):
    - Mở rộng `PageToolbarProps` với `isDark?: boolean; onToggleColorScheme?: (isDark: boolean) => void;`.
    - Tích hợp cụm Segmented Control 2 nấc `[ ☀️ Ngày | 🌙 Đêm ]` chuẩn 100% Mockup 1: chiều cao tối thiểu $\ge 28$px, mục active có nền màu theme `var(--agv-accent)` và chữ màu trắng `var(--agv-accent-text, #ffffff)`, mục inactive có nền `transparent` và chữ `var(--agv-text-muted)`.
    - Sử dụng Lucide Icons `Sun` và `Moon` size 13px đồng bộ chuẩn hệ thống.
  - `src/App.tsx` (2090 dòng):
    - Bổ sung state `isDark` và handler `handleToggleColorScheme` lưu vào `localStorage.agv_color_scheme`.
    - Tự động đồng bộ `isDark` khi đổi giữa các theme Sáng/Tối.
    - Đồng bộ class `dark` lên thẻ gốc `document.documentElement` và container `.agv-app-container`.
    - Truyền `isDark={isDark}` và `onToggleColorScheme={handleToggleColorScheme}` vào `<PageToolbar />`.
  - `src/components/ui/AdvComboBoxEdit.tsx` (346 dòng):
    - Khắc phục lỗi UX: chỉ mục đang được chọn (`isSelected`) mới nhận nền `var(--agv-accent)` chữ trắng; mục di chuột hover qua (`isHighlighted && !isSelected`) nhận nền hover `var(--agv-bg-item-hover)` và giữ màu chữ `var(--agv-text-main)`.
  - `src/components/ui/datepicker/datePickerStyles.ts` (639 dòng):
    - Dọn dẹp triệt để các khối hardcode biến CSS ở đầu file, cho phép DatePicker, Calendar và DatePresetSelect kế thừa 100% tự nhiên bộ biến màu `--agv-*`.
  - `src/themes/common.ts` (345 dòng) & `src/themes/index.ts` (219 dòng):
    - Nâng cấp `setCustomTokens(rootTokens, darkTokens)` và `getCustomTokens(isDark)` lưu trữ và trả về token độc lập cho cả Ngày và Đêm của CSS Tùy Biến.
  - `src/themes/customCssBridge.ts` (330 dòng):
    - Phân tích và sinh đồng thời cả 2 bộ token `rootTokens` (cho `:root`) và `darkTokens` (cho `.dark`), đăng ký vào engine theme.

---

## 🕒 Lần 1: Xóa Bỏ Triệt Để Toàn Bộ Màu Cứng, Đồng Bộ 100% Cầu Nối CSS Variables Toàn Hệ Thống (`customCssBridge.ts`, `common.ts`, `themes/index.ts`, `enterpriseEditorUtils.ts`, `datePickerStyles.ts`, `AdvComboBoxEdit.tsx`, `AdvDatePicker.tsx`, `AdvDateRangePicker.tsx`, `AdvDatePresetSelect.tsx`, `test/core_logic.test.ts`)
- **Thời gian**: 2026-10-30 11:15
- **Files thay đổi**:
  - `src/themes/customCssBridge.ts`: Bổ sung hàm `mapVarsToGridThemeTokens` chuyển đổi 100% biến người dùng sang đầy đủ 50+ GridThemeTokens.
  - `src/themes/common.ts` & `src/themes/index.ts`: Thêm cơ chế tham chiếu token động `setCustomTokens()` và `getCustomTokens()`, đăng ký `SURFACE_THEMES.CUSTOM`.
  - `src/components/ui/enterpriseEditorUtils.ts`: Trả về `{}` rỗng cho theme custom để tránh sinh Inline Style đè biến CSS.
  - `src/components/ui/AdvComboBoxEdit.tsx`, `AdvDatePicker.tsx`, `AdvDateRangePicker.tsx`, `AdvDatePresetSelect.tsx`: Loại bỏ giá trị mặc định ép cứng theme, kế thừa tự nhiên từ `document.documentElement`.
  - `test/core_logic.test.ts`: Bổ sung Test Suite 9 xác thực 100% biến `--agv-*` và tính toàn vẹn CSS Portal (30/30 tests pass).
