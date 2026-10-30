# Nhật Ký 3 Lần Chỉnh Sửa Gần Nhất (Rolling Edit Log)

Tài liệu này lưu trữ thông tin chi tiết về file, vị trí dòng, phần tử/nội dung thay đổi của **3 lần chỉnh sửa code gần nhất**. Sau mỗi lần code mới, nhật ký này sẽ tự động cuốn chiếu (loại bỏ lần cũ nhất và bổ sung lần mới nhất).

---

## 🕒 Lần 3 (Mới nhất): Khắc Phục Triệt Để Lỗi Màu Custom Theme Bị Ghi Đè Bởi Modern Minimal: Nhận Diện Custom Id & Tăng Cường Độ Ưu Tiên CSS Variables Tuyệt Đối (`src/themes/common.ts`, `src/themes/presets/converter.ts`, `src/App.tsx`, `src/components/ui/enterpriseEditorUtils.ts`, `code_index.js`)
- **Thời gian**: 2026-10-30 09:20
- **Files thay đổi**:
  - `src/themes/common.ts` (350 dòng):
    - Khắc phục nguyên nhân cốt lõi khiến theme nhập tùy biến (như AstroVista) bị biến thành màu xanh của Modern Minimal: `normalizeThemeId` trước đó không nhận diện tiền tố `custom-`, làm trả về `modern-minimal` và gắn nhầm class `.agv-theme-modern-minimal` lên root container.
    - Cập nhật `normalizeThemeId` và `getThemeClass` nhận diện chính xác các custom theme ID (`custom-*`).
  - `src/themes/presets/converter.ts` (126 dòng):
    - Cập nhật `generatePresetCssVariables`: gán trực tiếp giá trị màu gốc (`${styles.primary}`, `${styles.background}`, v.v.) vào các biến `--agv-*` thay vì tham chiếu qua biến trung gian, triệt tiêu hoàn toàn nguy cơ bị ghi đè màu.
  - `src/App.tsx` (2086 dòng):
    - Nâng cấp bộ chọn CSS trong `activePresetCss` bao gồm `:root, .agv-app-container, .agv-app-container.${themeCls}, .agv-app-container[data-theme="${surfaceTheme}"]` để đảm bảo độ ưu tiên (specificity) tuyệt đối của theme đang kích hoạt.
    - Bổ sung `customThemeVersion` vào dependency của `activePresetCss` để làm mới biến màu tức thì khi người dùng nạp theme mới.
  - `src/components/ui/enterpriseEditorUtils.ts` (154 dòng):
    - Đồng bộ chế độ dark/light động trong `getPortalThemeVars` để các portal dropdown của theme tùy biến hiển thị đúng màu theo chế độ Ngày/Đêm.
  - `code_index.js` (1092 dòng):
    - Cập nhật số dòng `src/themes/common.ts` (350 dòng), `src/themes/presets/converter.ts` (126 dòng), `src/App.tsx` (2086 dòng) và `enterpriseEditorUtils.ts` (154 dòng).

---

## 🕒 Lần 2: Triển Khai Modal Nhập Theme Tùy Biến (Tweakcn Community) Hỗ Trợ Dán Raw CSS & JSON, Bền Vững LocalStorage (`src/demo/AdvThemeImportModal.tsx`, `src/themes/presets/customThemes.ts`, `src/themes/presets/index.ts`, `src/demo/PageToolbar.tsx`, `src/App.tsx`)
- **Thời gian**: 2026-10-30 09:12
- **Files thay đổi**:
  - `src/themes/presets/customThemes.ts` (260 dòng):
    - Xây dựng bộ công cụ `parseTweakcnThemeInput`: trích xuất thông minh biến màu CSS (`:root`, `.dark`) hoặc cấu trúc JSON xuất từ tweakcn.com, chuyển đổi tức thì sang `ThemePreset` chuẩn.
    - Cung cấp các hàm quản lý `loadCustomPresets`, `saveCustomPreset`, `deleteCustomPreset` lưu trữ bền vững trong `localStorage`.
  - `src/themes/presets/index.ts` (58 dòng):
    - Mở rộng `getAllPresetOptions()` và `getPresetById()` để tra cứu và gộp tự động các theme tùy biến đã lưu vào danh sách của ComboBox 42 themes.
  - `src/demo/AdvThemeImportModal.tsx` (248 dòng):
    - Tạo Modal "Nhập Theme Tùy Biến (Tweakcn Community)" đúng 100% bản vẽ mô phỏng: ô nhập tên theme, textarea dán mã CSS/JSON, danh sách theme đã lưu kèm nút [Xóa], nút [Hủy] và [Áp Dụng].
  - `src/demo/PageToolbar.tsx` (591 dòng):
    - Bổ sung nút bấm `[Nhập Theme]` cạnh cụm ComboBox và nút Ngày/Đêm.

---

## 🕒 Lần 1: Khắc Phục Triệt Để Lỗi Cuộn Bị Reset Về Đầu Khi Mở ComboBox/Select & Đồng Bộ Đồng Thời `isJustOpenedRef` + `requestAnimationFrame` (`src/components/ui/AdvComboBoxEdit.tsx`, `src/components/ui/AdvSelect.tsx`)
- **Thời gian**: 2026-10-30 00:54
- **Files thay đổi**:
  - `src/components/ui/AdvComboBoxEdit.tsx` (405 dòng):
    - Bổ sung `isJustOpenedRef` và đồng bộ `syncHighlightedToSelected()` ngay tức thì trong `handleTriggerClick` và phím mũi tên `ArrowDown` trước khi mount portal.
    - Bổ sung `requestAnimationFrame` kép trong `useLayoutEffect` để bảo toàn vị trí căn giữa ngay cả khi CSS Spring Animation (`agv-spring-down` / `agv-spring-up`) đang co giãn kích thước DOM.
  - `src/components/ui/AdvSelect.tsx` (317 dòng):
    - Đồng bộ cơ chế bảo vệ `isJustOpenedRef` và `requestAnimationFrame` tương tự cho primitive Select thuần túy.
