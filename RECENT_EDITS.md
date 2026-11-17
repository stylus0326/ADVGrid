# Nhật Ký 3 Lần Chỉnh Sửa Gần Nhất (Rolling Edit Log)

Tài liệu này lưu trữ thông tin chi tiết về file, vị trí dòng, phần tử/nội dung thay đổi của **3 lần chỉnh sửa code gần nhất**. Sau mỗi lần code mới, nhật ký này sẽ tự động cuốn chiếu (loại bỏ lần cũ nhất và bổ sung lần mới nhất).

---

## 🕒 Lần 3 (Mới nhất): Bổ Sung Chế Độ Giao Diện Liquid Glass Ngày & Đêm (`LiquidGlassBackdrop`, `design-tokens.css`, `themes/*`, `index.css`, `lib/styles.css`, `App.tsx`)
- **Thời gian**: 2026-11-17 20:40
- **Files cập nhật**:
  - **Hệ Thống Định Danh Theme Liquid Glass (`src/themes/`)**:
    + [`src/themes/common.ts`](src/themes/common.ts) (`149` dòng): Bổ sung `SURFACE_THEMES.LIQUID_LIGHT` (`'liquid-light'`) & `SURFACE_THEMES.LIQUID_DARK` (`'liquid-dark'`), thêm `isLiquidTheme`, cập nhật `normalizeThemeId`, `THEME_CLASS_MAP` và `getThemeClass` để Portal & Grid tự động nhận class `agv-liquid` + `dark`.
    + [`src/themes/index.ts`](src/themes/index.ts) (`50` dòng): Ánh xạ `LIQUID_LIGHT` / `LIQUID_DARK` vào `DAY_THEME_TOKENS`, `NIGHT_THEME_TOKENS` và `THEME_TOKENS`.
  - **Phông Nền Bầu Trời & Biển Mây Quad-Jet 747-8 (`src/components/shared/`)**:
    + [`src/components/shared/LiquidGlassBackdrop.tsx`](src/components/shared/LiquidGlassBackdrop.tsx) (`392` dòng): Tạo mới component SVG nền tầng bình lưu, biển mây Stratocumulus và tàu bay 747-8 chuyển thể từ thiết kế Wayfare/PNT ONE, tự co giãn responsive (`<768px`, `768–1023px`, `>=1024px`) và đổi bảng màu Ngày/Đêm đồng bộ tông teal sâu `#071c24` / `#0d2731` / `#70bdd2` theo `isDark`, không gắn `title`.
  - **CSS Tokens & Bề Mặt Kính Lỏng (`src/styles/`, `src/components/grid/`, `src/components/ui/`)**:
    + [`src/styles/design-tokens.css`](src/styles/design-tokens.css) (`549` dòng): Thêm CSS Variables cho `.agv-liquid:not(.dark)` / `[data-theme="liquid-light"]` (Ngày) và `.dark.agv-liquid` / `[data-theme="liquid-dark"]` (Đêm đồng bộ tông PNT Dark `#071c24` / `#0d2731` / `#70bdd2` / `#062a36` / `#5f7f89`) cùng khối ánh xạ `--agv-*` và `--agv-row-sticky-surface`.
    + [`src/components/grid/gridCore.css`](src/components/grid/gridCore.css) (`254` dòng): Cập nhật `--agv-row-sticky-bg` ưu tiên `var(--agv-row-sticky-surface / -hover / -selected)` để cột ghim trái/phải che kín chữ cuộn ngang mà không gắn `backdrop-filter` lên từng cell.
    + [`src/index.css`](src/index.css) (`767` dòng), [`src/lib/styles.css`](src/lib/styles.css) (`757` dòng), [`src/components/ui/datepicker/datePickerStyles.ts`](src/components/ui/datepicker/datePickerStyles.ts) (`805` dòng): Thêm chuyển động SVG (`@media (prefers-reduced-motion)`), `backdrop-filter` cho tầng vỏ & tầng nổi, hiệu ứng focus control + cơ chế cắt viền thật (`.agv-field-notch-frame` với `clip-path: polygon(...)`) giúp nhãn `.agv-field-label` trong suốt 100% không bị lộ nền trắng/đen trên kính lỏng.
    + [`src/components/ui/AdvFormField.tsx`](src/components/ui/AdvFormField.tsx) (`190` dòng): Đo chiều rộng nhãn bằng `useLayoutEffect` + `ResizeObserver` (`--agv-notch-w`, `data-notch-ready="true"`) và render `.agv-field-notch-frame` cắt khuyết đường viền trên trực tiếp theo đúng chiều rộng nhãn.
  - **Tích Hợp Khung Giao Diện & Nút Chuyển Chế Độ**:
    + [`src/components/shared/ListPagePanel.tsx`](src/components/shared/ListPagePanel.tsx) (`28` dòng), [`src/components/shared/PageShell.tsx`](src/components/shared/PageShell.tsx) (`30` dòng), [`src/components/b2b/LoginPanel.tsx`](src/components/b2b/LoginPanel.tsx) (`194` dòng), [`src/pages/UiPrimitivesPage.tsx`](src/pages/UiPrimitivesPage.tsx) (`953` dòng): Gắn hook class `.agv-list-page-panel`, `.agv-login-card`, `.agv-demo-card`, `.agv-ui-page-scroll` và `relative z-10`.
    + [`src/App.tsx`](src/App.tsx) (`361` dòng): Bổ sung state `isLiquid` (bật mặc định `true` để xem ngay, lưu `localStorage` `'agv_b2b_visual_mode'`), đồng bộ class `.agv-liquid` lên `html`/`body`, render `<LiquidGlassBackdrop isDark={isDark} />` và nút `Liquid Glass` cạnh nút `Sáng / Tối`.

---

## 🕒 Lần 2: Bổ Sung `AdvFormField` / `AdvInput` Nhãn Cắt Viền, Đồng Bộ Controls UI (`variant="auth"`, `leadingIcon`, `invalid`) & Thử Nghiệm Trên `UiPrimitivesPage`
- **Thời gian**: 2026-11-16 22:29
- **Files cập nhật**:
  - **Primitive & Helpers Mới Cho Border-Label Inputs**:
    + [`src/components/ui/AdvFormField.tsx`](src/components/ui/AdvFormField.tsx) (`161` dòng): Tạo mới wrapper `AdvFormField` (alias `FormField`) và `AdvFormFieldOverlayScope`, hỗ trợ `labelPosition="border" | "top"`, dấu `*` bắt buộc (`required`), lỗi kiểm tra hợp lệ (`error`), liên kết `id` / `htmlFor` / `aria-invalid` / `aria-describedby` / `aria-errormessage` qua `React.cloneElement` lên control con duy nhất, không dùng tooltip `title`.
    + [`src/components/ui/AdvInput.tsx`](src/components/ui/AdvInput.tsx) (`98` dòng): Tạo mới `AdvInput` hỗ trợ `size="sm" | "md"`, `variant="default" | "auth"` (`h-12` vs `h-control`, đồng bộ bo `8px` / `rounded-md`), `leadingIcon`, `endAdornment`, `invalid`, mặc định chống autofill trình duyệt (`allowAutofill = false`).
    + [`src/components/ui/controlFocus.ts`](src/components/ui/controlFocus.ts) (`236` dòng): Bổ sung `ControlVariant` và `getControlSurfaceClasses` tách class kích thước giữa `default` (`36px`/`28px`) và `auth` (`48px`), giữ bo góc đồng bộ `8px` (`var(--control-radius)` / `rounded-md`).
  - **Mở Rộng 5 Controls Hiện Có & Stylesheet Theme**:
    + [`src/components/ui/AdvSelect.tsx`](src/components/ui/AdvSelect.tsx), [`src/components/ui/AdvComboBoxEdit.tsx`](src/components/ui/AdvComboBoxEdit.tsx), [`src/components/ui/AdvSearchLookUpEdit.tsx`](src/components/ui/AdvSearchLookUpEdit.tsx): Bổ sung props `id`, `variant`, `leadingIcon`, `invalid`, `aria-invalid`, `aria-describedby`, `aria-errormessage`; giữ `triggerRef` trên khung hộp thật (không dính `pt-2` của nhãn cắt viền) để giữ nguyên vị trí popup và `GridFilterRow` / `GridInCellEditor`.
    + [`src/components/ui/AdvDatePicker.tsx`](src/components/ui/AdvDatePicker.tsx), [`src/components/ui/datepicker/AdvDateRangePicker.tsx`](src/components/ui/datepicker/AdvDateRangePicker.tsx), [`src/components/ui/datepicker/datePickerStyles.ts`](src/components/ui/datepicker/datePickerStyles.ts): Bổ sung class `.is-auth` (`height: 48px`, `border-radius: var(--control-radius)` đồng bộ `8px`) và rule `[aria-invalid="true"]` trong CSS DatePicker cùng props `id`, `variant`, `leadingIcon`, `invalid`, `aria-*`.
    + [`src/index.css`](src/index.css) & [`src/lib/styles.css`](src/lib/styles.css): Bổ sung rule đổi màu nhãn `.agv-field-border .agv-field-label` theo `var(--brand)` khi focus hoặc mở popup (khi không lỗi).
    + [`src/components/ui/index.ts`](src/components/ui/index.ts) (`104` dòng): Export `AdvInput`, `AdvFormField`, `FormField`, `AdvFormFieldOverlayScope` và các types liên quan.
  - **UI Test Trên Trang Thử Nghiệm**:
    + [`src/pages/UiPrimitivesPage.tsx`](src/pages/UiPrimitivesPage.tsx) (`953` dòng): Bổ sung khối demo tương tác *"Trường nhập nhãn cắt viền (Border-Label Inputs — đồng bộ b2b-pnt)"* kiểm thử `AdvInput`, `AdvSelect`, `AdvComboBoxEdit`, `AdvSearchLookUpEdit`, `AdvDatePicker`, `AdvDateRangePicker` với nút chuyển biến thể (`Auth 48px` / `Chuẩn 36px`), vị trí nhãn (`Cắt viền` / `Nhãn trên`) và mô phỏng trạng thái lỗi.

---

## 🕒 Lần 1: Đóng Gói `gridv3` Thành Package Độc Lập (`src/lib/*`, `vite.lib.config.ts`, `tsconfig.lib.json`, `tailwind.lib.config.js`, `package.json`, `docs/API_GUIDE.md`)
- **Thời gian**: 2026-11-16 20:43
- **Files cập nhật**:
  - **Entry Points & Stylesheet cô lập thư viện (`src/lib/`)**:
    + [`src/lib/styles.css`](src/lib/styles.css): Khai báo `@import '../styles/design-tokens.css'`, `@tailwind components`/`utilities` (bỏ `@tailwind base` và `html, body, #root { overflow: hidden }`), cô lập Preflight `box-sizing`/`border` trong `.agv-grid-root`, `[data-agv-popup="true"]`, `.agv-control`, `.agv-btn`.
    + [`src/lib/index.ts`](src/lib/index.ts), [`src/lib/columns.ts`](src/lib/columns.ts), [`src/lib/grid.ts`](src/lib/grid.ts), [`src/lib/ui.ts`](src/lib/ui.ts), [`src/lib/themes.ts`](src/lib/themes.ts): Tạo 5 entry points tối ưu bundle, bảo toàn `DataGridEnterprise` tải lười ở chunk riêng khi entry chính chỉ dùng Basic View.
  - **Cấu hình Build Library & Type Declarations**:
    + [`tailwind.lib.config.js`](tailwind.lib.config.js), [`tsconfig.lib.json`](tsconfig.lib.json), [`vite.lib.config.ts`](vite.lib.config.ts): Tắt `preflight`, xuất `.d.ts` tối giản (`removeComments: true`, `declarationMap: false`), build Vite Library Mode ra `dist-lib/` (`sourcemap: false`, `cssCodeSplit: false`, `legalComments: 'none'`, `external: react/react-dom`).
  - **Cấu hình Package & Tài liệu**:
    + [`package.json`](package.json), [`.gitignore`](.gitignore), [`README.md`](README.md), [`docs/API_GUIDE.md`](docs/API_GUIDE.md): Bổ sung `exports`, `peerDependencies`, `files` (chỉ đóng gói `dist-lib/`, `docs/API_GUIDE.md`, `README.md`, không lộ `src/`), scripts `build:lib` / `pack:lib` và tạo tarball `gridv3-1.0.0.tgz`.
