# Nhật Ký 3 Lần Chỉnh Sửa Gần Nhất (Rolling Edit Log)

Tài liệu này lưu trữ thông tin chi tiết về file, vị trí dòng, phần tử/nội dung thay đổi của **3 lần chỉnh sửa code gần nhất**. Sau mỗi lần code mới, nhật ký này sẽ tự động cuốn chiếu (loại bỏ lần cũ nhất và bổ sung lần mới nhất).

---

## 🕒 Lần 3 (Mới nhất): Bổ Sung Hiệu Ứng Xuất Hiện Tinh Tế Cho Dòng Ảo Hóa Mới (`agv-row-enter`)
- **Thời gian**: 2026-10-29 01:12
- **Files thay đổi**:
  - `src/index.css` (636 dòng):
    - Bổ sung `@keyframes agv-row-enter` và class `.agv-row-enter` (Dòng 620 - 634): Hiệu ứng lướt nhẹ `opacity: 0.72 -> 1` và `translateY(3px) -> none` trong `140ms cubic-bezier(0.16, 1, 0.3, 1)` (không giữ `transform` sau khi kết thúc để bảo toàn 100% `position: sticky` của các cột ghim).
  - `src/components/grid/GridRow.tsx` (998 dòng):
    - Gắn class `agv-row-enter` kèm độ trễ phân tầng nhẹ theo vị trí dòng trong chunk (`animationDelay: ${(rowIndex % 20) * 4}ms`) cho cả dòng tiêu đề nhóm và dòng dữ liệu chuẩn (Dòng 546 - 548, 686 - 688).
  - `code_index.js`: Cập nhật đồng bộ số dòng và mô tả chức năng cho `GridRow.tsx` và `index.css`.

---

## 🕒 Lần 2: Tối Ưu Hóa Chuyển Dòng Chọn O(1) (`selectedDisplayIndexHintRef` & Range-Aware Chunk Memo), Kéo Giãn Cột `requestAnimationFrame` & Bảo Toàn `React.memo` Cho `GridFloatingToolbar`
- **Thời gian**: 2026-10-29 01:06
- **Files thay đổi**:
  - `src/components/grid/GridChunkBlock.tsx` (244 dòng):
    - Nâng cấp comparator `React.memo` (Dòng 181 - 228): Kiểm tra phạm vi dòng `[startRowIndex, endRowIndex]` của chunk khi `selectedRowIndex`, `selectedRowKey` hoặc `editingCell` thay đổi, giúp 6–7 chunk không chứa dòng cũ/mới bỏ qua render 100%.
  - `src/App.tsx` (1826 dòng):
    - Bổ sung `selectedDisplayIndexHintRef` (Dòng 655 - 664, 1591 - 1656): Lưu trực tiếp vị trí dòng hiển thị khi click dòng hoặc nhảy dòng, giúp `selectedDisplayIndex` đạt tốc độ $O(1)$ thay vì quét tuyến tính `indexOf`/`findIndex` trên 50.000 phần tử.
  - `src/components/grid/hooks/useColumnResize.ts` (80 dòng):
    - Gom (`coalesce`) sự kiện `mousemove` qua `requestAnimationFrame` (Dòng 37 - 65) để chỉ cập nhật độ rộng cột tối đa 1 lần mỗi khung hình màn hình.
  - `src/components/grid/VirtualizedGrid.tsx` (2210 dòng):
    - Bọc `useCallback` cho `handleToggleQuickFilterSmart` (Dòng 373 - 375, 2172) để bảo toàn 100% `React.memo` của `GridFloatingToolbar` khi cuộn.
  - `code_index.js`: Cập nhật đồng bộ số dòng và mô tả chức năng.

---

## 🕒 Lần 1: Tinh Chỉnh Đo Vận Tốc Cuộn Trung Bình Theo Chu Kỳ 120ms (`windowAccumDistanceRef`) & Ổn Định Tốc Độ `px/s` Khi Test Cuộn Cao Tốc
- **Thời gian**: 2026-10-29 00:49
- **Files thay đổi**:
  - `src/components/grid/VirtualizedGrid.tsx` (2204 dòng):
    - Bổ sung `windowAccumDistanceRef` và `windowStartTimeRef` (Dòng 1347 - 1348, 1618 - 1692): Tích lũy tổng quãng đường cuộn `dy` trên toàn bộ cửa sổ 120ms (`windowAccumDistanceRef.current / measureDt * 1000`) thay vì chỉ lấy `dy / dt` của 1 frame 16ms cuối cùng; giữ ổn định tốc độ chuẩn `autoScrollSpeed * 60` (`1,920 px/s`) khi đang chạy `autoScrolling` và tự động đưa vận tốc hiển thị về `0 px/s` ngay khi tắt `autoScrolling` (Dòng 1554 - 1568).
  - `code_index.js`: Cập nhật đồng bộ số dòng `VirtualizedGrid.tsx`.
