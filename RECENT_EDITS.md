# Nhật Ký 3 Lần Chỉnh Sửa Gần Nhất (Rolling Edit Log)

Tài liệu này lưu trữ thông tin chi tiết về file, vị trí dòng, phần tử/nội dung thay đổi của **3 lần chỉnh sửa code gần nhất**. Sau mỗi lần code mới, nhật ký này sẽ tự động cuốn chiếu (loại bỏ lần cũ nhất và bổ sung lần mới nhất).

---

## 🕒 Lần 3 (Mới nhất): Đồng Bộ Hoàn Chỉnh Bộ Màu Chuẩn Theme Qrafthive (`cmjgilzlg000404ju2wgs7uj9`) Từ Tweakcn & Bổ Sung Đầy Đủ 100% Tokens Grid Engine (`src/index.css`, `src/themes/presets/converter.ts`, `code_index.js`)
- **Thời gian**: 2026-10-30 09:45
- **Files thay đổi**:
  - `src/index.css` (1024 dòng):
    - Thay thế toàn bộ khối `:root`, `.dark`, `@theme inline` bằng bộ màu OKLCH chuẩn của theme **qrafthive** trích xuất từ tweakcn.com (`cmjgilzlg000404ju2wgs7uj9`).
    - Hoàn thiện cầu nối hai chiều `--agv-*`: bổ sung `--agv-success`, `--agv-warning`, `--agv-danger`, `--agv-trend-up`, `--agv-trend-down`, triệt tiêu hoàn toàn hiện tượng lệch màu/màu lung tung.
  - `src/themes/presets/converter.ts` (135 dòng):
    - Cập nhật `generatePresetCssVariables`: bổ sung các tokens trạng thái (`--agv-success`, `--agv-success-bg`, `--agv-warning`, `--agv-warning-bg`, `--agv-danger`, `--agv-trend-up`, `--agv-trend-down`) trực tiếp vào khối style sinh ra để đảm bảo 100% tính nhất quán.
  - `code_index.js` (1095 dòng):
    - Cập nhật số dòng `src/index.css` (1024 dòng), bổ sung `src/themes/presets/converter.ts` (135 dòng).

---

## 🕒 Lần 2: Xây Dựng Hàm Kiểm Tra Tính Đối Xứng `checkThemeSymmetry` Giữa 2 Bên `:root` & `.dark` Và Ánh Xạ Chuẩn Sang 32 Tokens Grid Engine (`src/themes/presets/customThemes.ts`, `code_index.js`)
- **Thời gian**: 2026-10-30 09:35
- **Files thay đổi**:
  - `src/themes/presets/customThemes.ts` (339 dòng):
    - Xây dựng hàm `checkThemeSymmetry(rawCss: string): ThemeSymmetryReport` tự động bóc tách 2 khối `:root` và `.dark`.
    - Đối chiếu tính đối xứng 100% giữa các biến màu của 2 bên (Light vs Dark).
    - Cung cấp ma trận ánh xạ trực tiếp sang 32 tokens `--agv-*` của Grid Engine (`--agv-accent`, `--agv-bg-root`, `--agv-border`, `--agv-text-main`, v.v.).
    - Trả về báo cáo chi tiết: số lượng biến, danh sách biến thiếu ở mỗi bên, và bảng đối chiếu giá trị Light/Dark.

---

## 🕒 Lần 1: Khắc Phục Triệt Để Lỗi Màu Custom Theme Bị Ghi Đè Bởi Modern Minimal: Nhận Diện Custom Id & Tăng Cường Độ Ưu Tiên CSS Variables Tuyệt Đối (`src/themes/common.ts`, `src/themes/presets/converter.ts`, `src/App.tsx`, `src/components/ui/enterpriseEditorUtils.ts`, `code_index.js`)
- **Thời gian**: 2026-10-30 09:20
- **Files thay đổi**:
  - `src/themes/common.ts` (350 dòng):
    - Khắc phục nguyên nhân cốt lõi khiến theme nhập tùy biến (như AstroVista) bị biến thành màu xanh của Modern Minimal: `normalizeThemeId` trước đó không nhận diện tiền tố `custom-`, làm trả về `modern-minimal` và gắn nhầm class `.agv-theme-modern-minimal` lên root container.
    - Cập nhật `normalizeThemeId` và `getThemeClass` nhận diện chính xác các custom theme ID (`custom-*`).
  - `src/App.tsx` (2086 dòng):
    - Nâng cấp bộ chọn CSS trong `activePresetCss` bao gồm `:root, .agv-app-container, .agv-app-container.${themeCls}, .agv-app-container[data-theme="${surfaceTheme}"]` để đảm bảo độ ưu tiên (specificity) tuyệt đối của theme đang kích hoạt.
  - `src/components/ui/enterpriseEditorUtils.ts` (154 dòng):
    - Đồng bộ chế độ dark/light động trong `getPortalThemeVars` để các portal dropdown của theme tùy biến hiển thị đúng màu theo chế độ Ngày/Đêm.
