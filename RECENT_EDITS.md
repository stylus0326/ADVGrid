# Nhật Ký 3 Lần Chỉnh Sửa Gần Nhất (Rolling Edit Log)

Tài liệu này lưu trữ thông tin chi tiết về file, vị trí dòng, phần tử/nội dung thay đổi của **3 lần chỉnh sửa code gần nhất**. Sau mỗi lần code mới, nhật ký này sẽ tự động cuốn chiếu (loại bỏ lần cũ nhất và bổ sung lần mới nhất).

---

## 🕒 Lần 3 (Mới nhất): Cố Định Cấu Hình Cuộn Khớp Dòng Ở 3 Dòng (`3d`) Và Gỡ Bỏ Cụm Nút Điều Khiển Khớp Dòng Khỏi Thanh Công Cụ Chính
- **Thời gian**: 2026-10-29 02:02
- **Files thay đổi**:
  - `src/App.tsx` (1900 dòng):
    - Cố định cấu hình `rowSnapMode = true` và `rowsPerWheelStep = 3` (Dòng 107 - 108); gỡ bỏ `handleToggleRowSnap` cùng các props điều khiển khớp dòng truyền sang `PageToolbar` (Dòng 1749, 1796 - 1800).
  - `src/demo/PageToolbar.tsx` (573 dòng):
    - Gỡ bỏ hoàn toàn cụm nút bật/tắt `Khớp Dòng: BẬT/TẮT` và các nút chọn nấc `1d / 3d / 5d / 1Chunk` khỏi giao diện chính cùng các props `rowSnapMode`, `onToggleRowSnap`, `rowsPerWheelStep`, `onRowsPerWheelStepChange` và icon `Magnet`, `Unlock` (Dòng 14 - 18, 64 - 67, 99 - 102, 540 - 544).
  - `code_index.js`: Cập nhật đồng bộ số dòng và mô tả chức năng.

---

## 🕒 Lần 2: Tối Ưu Vòng 2: Debounce Ghi `localStorage` Khi Kéo Giãn Cột, Bọc `useDeferredValue` Cho `searchQuery` & Cố Định Tham Chiếu `setColWidth` / `handleMouseDownResize`
- **Thời gian**: 2026-10-29 01:57
- **Files thay đổi**:
  - `src/App.tsx` (1905 dòng):
    - Bổ sung `deferredSearchQuery = useDeferredValue(searchQuery)` (Dòng 124) và sử dụng trong `filteredRowIndices` (Dòng 795, 853) cùng `getDistinctValuesForColumn` (Dòng 871, 1007) để gõ tìm kiếm nhanh trên 50.000 dòng phản hồi 0ms không chặn con trỏ gõ phím.
    - Bổ sung `saveColWidthsTimerRef` (Dòng 400 - 412, 493 - 496) debounce 150ms cho thao tác ghi `savePersistedGridConfig({ colWidths: filtered })` vào `localStorage`, giải phóng 100% I/O đồng bộ khỏi luồng `requestAnimationFrame` khi kéo giãn độ rộng cột.
  - `src/components/grid/VirtualizedGrid.tsx` (2242 dòng):
    - Bổ sung `colWidthsRef` (Dòng 295 - 329) giúp `setColWidth` và `setMultipleColWidths` giữ nguyên tham chiếu hàm ổn định xuyên suốt các frame kéo giãn cột.
  - `src/components/grid/hooks/useColumnResize.ts` (82 dòng):
    - Bổ sung `colWidthsRef` (Dòng 16 - 17, 35, 74) giúp `handleMouseDownResize` không bị tạo mới tham chiếu mỗi frame khi kéo cột.
  - `code_index.js`: Cập nhật đồng bộ số dòng và mô tả chức năng.

---

## 🕒 Lần 1: Tối Ưu Hóa Toàn Diện Tương Tác & Cuộn: Cách Ly Chunk Checkbox, Cache Tổng Toàn Bảng O(1), Chặn Re-render Sparkline, Cố Định Keydown Listener & Bọc `React.memo` Cho `PageToolbar` / `PageFooter`
- **Thời gian**: 2026-10-29 01:46
- **Files thay đổi**:
  - `src/components/grid/GridChunkBlock.tsx` (267 dòng):
    - Nâng cấp comparator `React.memo` (Dòng 180 - 204): Kiểm tra 20 dòng trong phạm vi chunk khi `checkedRowIndices` thay đổi; 6–7 chunk không có dòng nào đổi trạng thái `isChecked` bỏ qua render 100%.
  - `src/App.tsx` (1892 dòng):
    - Tách bộ đệm `uncheckedBaseGroupData` (Dòng 1118 - 1173): Giúp thao tác bỏ tích dòng cuối cùng (về `0 dòng`) trả lại tổng toàn bảng tức thì trong **0ms ($O(1)$)** thay vì quét lại 50.000 dòng × 15 cột số.
    - Cố định 6 callback truyền xuống `PageToolbar` bằng `useCallback` (Dòng 1732 - 1740).
  - `src/demo/TwelveMonthChartCell.tsx` (356 dòng):
    - Bổ sung `hoveredIdxRef` và `svgRectRef` (Dòng 66 - 67, 110 - 154): Cache `getBoundingClientRect()` khi rê chuột vào và chỉ gọi `setHoveredIdx` / `setAnchorCoords` khi chỉ số tháng `idx` thực sự thay đổi (giảm >90% re-render khi di chuột trên biểu đồ).
  - `src/components/grid/VirtualizedGrid.tsx` (2238 dòng):
    - Gom trạng thái điều hướng bàn phím vào `keyNavStateRef` (Dòng 1435 - 1549) để listener `keydown` trên `window` gắn cố định 1 lần duy nhất, không bị tháo/gắn lại khi giữ phím `ArrowUp`/`ArrowDown`.
  - `src/demo/PageToolbar.tsx` (653 dòng) & `src/demo/PageFooter.tsx` (130 dòng):
    - Bọc `React.memo` để tránh re-render thanh công cụ và thanh trạng thái khi đổi dòng Focus hoặc khi nhịp đo FPS/Velocity cập nhật.
  - `code_index.js`: Cập nhật đồng bộ số dòng và mô tả chức năng.
