# Nhật Ký 3 Lần Chỉnh Sửa Gần Nhất (Rolling Edit Log)

Tài liệu này lưu trữ thông tin chi tiết về file, vị trí dòng, phần tử/nội dung thay đổi của **3 lần chỉnh sửa code gần nhất**. Sau mỗi lần code mới, nhật ký này sẽ tự động cuốn chiếu (loại bỏ lần cũ nhất và bổ sung lần mới nhất).

---

## 🕒 Lần 3 (Mới nhất): Triển Khai Modal Nhập Theme Tùy Biến (Tweakcn Community) Hỗ Trợ Dán Raw CSS & JSON, Bền Vững LocalStorage (`src/demo/AdvThemeImportModal.tsx`, `src/themes/presets/customThemes.ts`, `src/themes/presets/index.ts`, `src/demo/PageToolbar.tsx`, `src/App.tsx`, `code_index.js`)
- **Thời gian**: 2026-10-30 09:12
- **Files thay đổi**:
  - `src/themes/presets/customThemes.ts` (260 dòng - Tạo mới):
    - Xây dựng bộ công cụ `parseTweakcnThemeInput`: trích xuất thông minh biến màu CSS (`:root`, `.dark`) hoặc cấu trúc JSON xuất từ tweakcn.com, chuyển đổi tức thì sang `ThemePreset` chuẩn.
    - Cung cấp các hàm quản lý `loadCustomPresets`, `saveCustomPreset`, `deleteCustomPreset` lưu trữ bền vững trong `localStorage`.
  - `src/themes/presets/index.ts` (58 dòng):
    - Mở rộng `getAllPresetOptions()` và `getPresetById()` để tra cứu và gộp tự động các theme tùy biến đã lưu vào danh sách của ComboBox 42 themes.
  - `src/demo/AdvThemeImportModal.tsx` (248 dòng - Tạo mới):
    - Tạo Modal "Nhập Theme Tùy Biến (Tweakcn Community)" đúng 100% bản vẽ mô phỏng: ô nhập tên theme (min-h 28px), ô textarea dán mã CSS/JSON, danh sách theme tùy biến đã lưu kèm nút [Xóa], nút [Hủy] và nút [Áp Dụng] nền `var(--agv-accent)` chữ trắng.
    - Tự động đóng khi nhấn ra ngoài (Click Outside) hoặc nhấn `Esc`, khóa cuộn bảng qua `data-agv-popup="true"`, zero autofill với `NO_AUTOFILL_PROPS`.
  - `src/demo/PageToolbar.tsx` (591 dòng):
    - Bổ sung nút bấm `[Nhập Theme]` (min-h 28px, 100% theme CSS variables, zero icon thừa) cạnh cụm ComboBox và nút Ngày/Đêm.
    - Cập nhật `presetOptions` tự động làm mới danh sách lựa chọn khi có theme mới được thêm hoặc xóa.
  - `src/App.tsx` (2084 dòng):
    - Quản lý trạng thái mở modal `isThemeImportOpen` và phiên bản theme `customThemeVersion`, kết nối `handleThemeApplied` áp dụng ngay bộ màu mới lên toàn bộ ứng dụng trong 0ms.
  - `code_index.js` (1092 dòng):
    - Cập nhật số dòng và mô tả chức năng của `AdvThemeImportModal.tsx`, `customThemes.ts`, `PageToolbar.tsx`, `App.tsx` và `src/themes/`.

---

## 🕒 Lần 2: Khắc Phục Triệt Để Lỗi Cuộn Bị Reset Về Đầu Khi Mở ComboBox/Select & Đồng Bộ Đồng Thời `isJustOpenedRef` + `requestAnimationFrame` (`src/components/ui/AdvComboBoxEdit.tsx`, `src/components/ui/AdvSelect.tsx`, `code_index.js`)
- **Thời gian**: 2026-10-30 00:54
- **Files thay đổi**:
  - `src/components/ui/AdvComboBoxEdit.tsx` (405 dòng):
    - Bổ sung `isJustOpenedRef` và đồng bộ `syncHighlightedToSelected()` ngay tức thì trong `handleTriggerClick` và phím mũi tên `ArrowDown` trước khi mount portal.
    - Bổ sung `requestAnimationFrame` kép trong `useLayoutEffect` để bảo toàn vị trí căn giữa ngay cả khi CSS Spring Animation (`agv-spring-down` / `agv-spring-up`) đang co giãn kích thước DOM.
  - `src/components/ui/AdvSelect.tsx` (317 dòng):
    - Đồng bộ cơ chế bảo vệ `isJustOpenedRef` và `requestAnimationFrame` tương tự cho primitive Select thuần túy.

---

## 🕒 Lần 1: Tự Động Cuộn Đến Mục Đã Chọn Sẵn & Theo Phím Mũi Tên Trong AdvComboBoxEdit và AdvSelect (`src/components/ui/AdvComboBoxEdit.tsx`, `src/components/ui/AdvSelect.tsx`)
- **Thời gian**: 2026-10-30 00:44
- **Files thay đổi**:
  - `src/components/ui/AdvComboBoxEdit.tsx` (380 dòng):
    - Gắn `data-item-index={idx}` và `data-selected={isSelected ? 'true' : undefined}` lên từng phần tử item dropdown.
    - Bổ sung `useLayoutEffect` tự động tính toán `scrollTop` căn giữa ngay tức thì mục đang chọn vào trung tâm khung nhìn dropdown khi vừa mở popup.
    - Bổ sung `useEffect` tự động cuộn bám theo phím mũi tên `ArrowUp` / `ArrowDown` (Nearest Boundary Scroll).
  - `src/components/ui/AdvSelect.tsx` (301 dòng):
    - Đồng bộ cơ chế auto-scroll to selected item khi mở dropdown và scroll tracking khi điều hướng bàn phím cho primitive Select thuần.
