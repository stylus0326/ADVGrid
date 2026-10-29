# Nhật Ký 3 Lần Chỉnh Sửa Gần Nhất (Rolling Edit Log)

Tài liệu này lưu trữ thông tin chi tiết về file, vị trí dòng, phần tử/nội dung thay đổi của **3 lần chỉnh sửa code gần nhất**. Sau mỗi lần code mới, nhật ký này sẽ tự động cuốn chiếu (loại bỏ lần cũ nhất và bổ sung lần mới nhất).

---

## 🕒 Lần 3 (Mới nhất): Tinh Chỉnh Đo Vận Tốc Cuộn Trung Bình Theo Chu Kỳ 120ms (`windowAccumDistanceRef`) & Ổn Định Tốc Độ `px/s` Khi Test Cuộn Cao Tốc
- **Thời gian**: 2026-10-29 00:49
- **Files thay đổi**:
  - `src/components/grid/VirtualizedGrid.tsx` (2204 dòng):
    - Bổ sung `windowAccumDistanceRef` và `windowStartTimeRef` (Dòng 1347 - 1348, 1618 - 1692): Tích lũy tổng quãng đường cuộn `dy` trên toàn bộ cửa sổ 120ms (`windowAccumDistanceRef.current / measureDt * 1000`) thay vì chỉ lấy `dy / dt` của 1 frame 16ms cuối cùng; giữ ổn định tốc độ chuẩn `autoScrollSpeed * 60` (`1,920 px/s`) khi đang chạy `autoScrolling` và tự động đưa vận tốc hiển thị về `0 px/s` ngay khi tắt `autoScrolling` (Dòng 1554 - 1568).
  - `code_index.js`: Cập nhật đồng bộ số dòng `VirtualizedGrid.tsx`.

---

## 🕒 Lần 2: Khắc Phục Triệt Để Hiện Tượng Khựng Khi Test Cuộn Cao Tốc (`chunkRowsCacheRef`, `WeakMap` 12 Tháng & `React.memo` Toàn Diện)
- **Thời gian**: 2026-10-29 00:41
- **Files thay đổi**:
  - `src/components/grid/VirtualizedGrid.tsx` (2152 dòng):
    - **Cache mảng dòng theo Chunk (`chunkRowsCacheRef`)** (Dòng 1679 - 1725): Giữ nguyên 100% tham chiếu mảng `chunkRows` và từng object `row` cho các chunk đã nằm trên màn hình khi cuộn sang chunk mới.
    - **Tối ưu vòng lặp `autoScrolling` & `handleScroll`** (Dòng 73 - 85, 1514 - 1656): Cuộn mượt theo thời gian thực `dt` 60–144Hz, dùng `totalContentHeight` thay vì đọc `el.scrollHeight` gây Forced Synchronous Reflow; cache kết quả `isAnyPopupActive()` trong 64ms; bọc `React.memo` cho `VirtualizedGrid`.
  - `src/App.tsx` (1801 dòng):
    - **Cache thống kê 12 tháng bằng `WeakMap` (`monthStatsCacheRef`)** (Dòng 1407 - 1480) và **cố định `handleGetRowId` bằng `useCallback`** (Dòng 1585 - 1588, 1738).
  - `src/components/grid/GridHeader.tsx` (538 dòng) & `src/components/grid/GridFilterRow.tsx` (1298 dòng):
    - Bọc `React.memo` cho `GridHeader` và `GridFilterRow`.
  - `code_index.js`: Cập nhật đồng bộ số dòng và mô tả chức năng.

---

## 🕒 Lần 1: Tối Ưu Hóa Độ Mượt Giao Diện 4 Điểm Nghẽn (`React.memo` GridRow, Lọc/Sort, Gom Nhóm & Cuộn Chuột)
- **Thời gian**: 2026-10-29 00:26
- **Files thay đổi**:
  - `src/App.tsx` (1765 dòng):
    - **Bảo toàn `React.memo` của `GridRow` khi tích chọn dòng & kéo giãn cột** (Dòng 1358 - 1554): Tách `checkedRowIndices` khỏi dependency của `getRow` và `renderCell`.
    - **Loại bỏ chạy lại Lọc & Sort 50.000 dòng thừa khi tích checkbox** (Dòng 769 - 1080): Bổ sung `effectiveCheckedForFilter` và `effectiveCheckedForSort`.
    - **Tách riêng bước Chia nhóm (`rawGroupBuckets`) và Tính tổng (`baseGroupData`)** (Dòng 1085 - 1182).
  - `src/components/grid/GridChunkBlock.tsx` (198 dòng):
    - Đưa phép tìm cột `chkCol` ra ngoài vòng lặp `rows.map` và ưu tiên kiểm tra `checkedRowIndices.has(...)` trước tiên cho `isChecked` (Dòng 94 - 127).
  - `src/components/grid/VirtualizedGrid.tsx` (2112 dòng):
    - Bổ sung `lastMetricsEmitTimeRef` tiết lưu `onScrollMetrics` trong `handleScroll`.
  - `code_index.js`: Cập nhật đồng bộ số dòng và mô tả chức năng.
