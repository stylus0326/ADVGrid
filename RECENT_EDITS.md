# Nhật Ký 3 Lần Chỉnh Sửa Gần Nhất (Rolling Edit Log)

Tài liệu này lưu trữ thông tin chi tiết về file, vị trí dòng, phần tử/nội dung thay đổi của **3 lần chỉnh sửa code gần nhất**. Sau mỗi lần code mới, nhật ký này sẽ tự động cuốn chiếu (loại bỏ lần cũ nhất và bổ sung lần mới nhất).

---

## 🕒 Lần 3 (Mới nhất): Chọn Dải Dòng Liên Tiếp Bằng `Shift + Click` & Mục `Bỏ chọn tất cả dòng (N)` Trong `ColumnContextMenu`
- **Thời gian**: 2026-10-27 23:33
- **Files thay đổi**:
  - `src/App.tsx` (1742 dòng):
    - **Mục 1 (`Shift + Click` chọn dải dòng)**: Bổ sung `lastCheckedRowRef` và `activeRowIndicesRef` trong `handleToggleCheck` (Dòng 517 - 621), tự động chọn hoặc bỏ chọn toàn bộ dải dòng từ dòng vừa tích trước đó đến dòng hiện tại theo đúng thứ tự đang hiển thị (hỗ trợ cả khi đang gom nhóm, đang lọc/sắp xếp và bảng phẳng gốc).
    - **Mục 2 (`handleClearCheckedRows`)**: Bổ sung hàm `handleClearCheckedRows` (Dòng 624 - 635) xóa sạch tập `checkedRowIndices` và tự động gỡ lọc cột chọn `col_chk` nếu đang bật chế độ "Chỉ hiện dòng đang chọn".
  - `src/components/grid/ColumnContextMenu.tsx` (1163 dòng):
    - **Mục 2**: Bổ sung `checkedRowCount` và `onClearCheckedRows` vào `ColumnContextMenuProps`, render nút `Bỏ chọn tất cả dòng ({checkedRowCount})` (Dòng 1110 - 1122) trong menu chuột phải dòng (`CONTEXT_MENU_TYPES.ROW`) chuẩn `min-h-[28px]`, không icon, không tooltip, 100% biến CSS `var(--agv-*)`.
  - `src/components/grid/VirtualizedGrid.tsx` (2109 dòng) & `src/components/grid/types.ts` (353 dòng):
    - Bổ sung prop `onClearCheckedRows` và chuyển tiếp `checkedRowCount`, `onClearCheckedRows` xuống `ColumnContextMenu` (Dòng 2021 - 2022).
  - `code_index.js`: Cập nhật đồng bộ số dòng và mô tả chức năng.

---

## 🕒 Lần 2: Nhận Diện Màu Tổng Dòng Chọn Trên `GridFilterRow`, Nút 1 Chạm "Chỉ Hiện Dòng Đang Chọn" Tại `PageFooter` & Mục `DÒNG ĐANG GHIM` Trong `AdvCriteriaSummaryPopup`
- **Thời gian**: 2026-10-27 21:50
- **Files thay đổi**:
  - `src/components/grid/GridFilterRow.tsx` (1296 dòng):
    - **Mục 2**: Bổ sung `hasCheckedRows` và `isHighlightPlaceholder` cho `SmartNumberFilterInput` (Dòng 346 - 418, 1102 - 1109): Khi đang chọn dòng (`hasCheckedRows === true`), đổi màu chữ con số tổng sang `placeholder:text-[var(--agv-accent)] placeholder:opacity-100 placeholder:font-semibold`.
    - **Mục 4**: Bổ sung `pinnedRows`, `onUnpinRow`, `onClearPinnedRows` vào `GridFilterRowProps`, cộng `pinnedRows.length` vào `totalActiveCriteriaCount` (Dòng 472 - 488) và truyền xuống `AdvCriteriaSummaryPopup` (Dòng 1239 - 1265).
  - `src/components/grid/AdvCriteriaSummaryPopup.tsx` (606 dòng):
    - **Mục 4**: Tính toán `pinnedRowItems` (Dòng 244 - 276) hiển thị `Dòng #{STT}` kèm giá trị định danh tự nhiên của cột đầu tiên; render mục `DÒNG ĐANG GHIM ({pinnedRowItems.length})` (Dòng 553 - 582) chuẩn chip `min-h-[28px]` để gỡ từng dòng ghim hoặc gỡ toàn bộ khi bấm `Xóa tất cả tiêu chí`.
  - `src/components/grid/VirtualizedGrid.tsx` (2106 dòng):
    - Bổ sung `handleUnpinRow` (Dòng 993 - 995) và truyền `hasCheckedRows`, `pinnedRows`, `onUnpinRow`, `onClearPinnedRows` xuống `GridFilterRow` (Dòng 1790 - 1805).
  - `src/demo/PageFooter.tsx` (129 dòng):
    - **Mục 3**: Bổ sung `isFilterCheckedOnly` và `onToggleFilterCheckedOnly` (Dòng 87 - 115): Khi `checkedRowCount > 0`, mục `Đã chọn: {checkedRowCount} dòng` trở thành nút bấm `min-h-[28px]`, trạng thái active hiển thị nền `var(--agv-accent)` chữ trắng `var(--agv-accent-text, #ffffff)`.
  - `src/App.tsx` (1642 dòng):
    - Bổ sung `handleToggleFilterCheckedOnly` (Dòng 540 - 554) bật/tắt lọc cột `col_chk` (`CHECK_FILTER_STATES.CHECKED`), tự động gỡ lọc `col_chk` trong `handleToggleCheck` khi bỏ chọn hết dòng (`next.size === 0`).
  - `code_index.js`: Cập nhật đồng bộ số dòng và mô tả chức năng.

---

## 🕒 Lần 1: Tính Tổng Toán Tử Theo Cột (`columnSums`) Dựa Trên Số Dòng Đang Chọn Thay Vì Toàn Bảng & Gỡ Bỏ Thống Kê Phụ Trên `PageFooter`
- **Thời gian**: 2026-10-27 20:28
- **Files thay đổi**:
  - `src/App.tsx` (1614 dòng):
    - Cập nhật `baseGroupData` / `columnSums` (Dòng 951 - 1039): Khi người dùng tích chọn dòng (`checkedRowIndices.size > 0`), toàn bộ giá trị tổng theo cột (`columnSums` hiển thị tại ô toán tử từng cột trên `GridFilterRow` và `groupSums` trên dòng nhóm) tự động tính theo các dòng đang chọn (`checkedRowIndices`) thay vì cộng toàn bảng; tích hợp fast-path $O(K)$ duyệt trực tiếp `checkedRowIndices` khi không có bộ lọc. Khi bỏ chọn hết (`checkedRowIndices.size === 0`), tự động khôi phục tính tổng toàn bảng.
    - Xóa `checkedRowStats` khỏi `src/App.tsx`.
  - `src/demo/PageFooter.tsx` (104 dòng):
    - Gỡ bỏ `checkedRowStats` khỏi thanh trạng thái đáy, giữ nguyên hiển thị `Đã chọn: {checkedRowCount} dòng` tinh gọn.
  - `code_index.js`: Cập nhật đồng bộ số dòng và mô tả `columnSums`.
