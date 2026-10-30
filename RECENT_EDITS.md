# Nhật Ký 3 Lần Chỉnh Sửa Gần Nhất (Rolling Edit Log)

Tài liệu này lưu trữ thông tin chi tiết về file, vị trí dòng, phần tử/nội dung thay đổi của **3 lần chỉnh sửa code gần nhất**. Sau mỗi lần code mới, nhật ký này sẽ tự động cuốn chiếu (loại bỏ lần cũ nhất và bổ sung lần mới nhất).

---

## 🕒 Lần 3 (Mới nhất): Sửa Lỗi Hiển Thị Mã Dòng Chuẩn Xác (`r.col_id`) Trên Bố Cục Phone & Tablet Thay Vì Hiển Thị Số Index Thô (`GridPhoneCard.tsx`, `GridTabletRow.tsx`)
- **Thời gian**: 2026-10-30 23:18
- **Files thay đổi**:
  - `src/components/grid/responsive/GridPhoneCard.tsx` (253 dòng):
    + Cập nhật logic trích xuất `rowId`: Ưu tiên đọc trực tiếp trường `r.col_id` từ dataset thay vì fallback vào `rowKey` (vốn là số index `1, 2, 3...` dẫn đến việc dòng 1 hiện `ROW-000001` nhưng dòng 2-5 bị hiện số `1, 2, 3, 4`).
    + Cập nhật trích xuất đồng bộ các trường dữ liệu chuẩn của Grid: `col_node`, `col_region`, `col_status`, `col_dec_cpu`, `col_dec_sla`, `col_date`, `col_time`.
  - `src/components/grid/responsive/GridTabletRow.tsx` (187 dòng):
    + Cập nhật logic trích xuất `rowId` tương tự: Ưu tiên đọc `r.col_id`, giải quyết triệt để tình trạng lệch định dạng mã dòng trên Tablet.
    + Trích xuất đồng bộ `col_node`, `col_region`, `col_status`, `col_dec_cpu`, `col_dec_sla`, `col_date`, `col_time`.

---

## 🕒 Lần 2: Đồng Bộ Hóa Cột Số Thứ Tự (STT) Giữa 3 Bố Cục PC, Tablet & Phone Qua Biến Chung `showRowNumber` (`GridTabletHeader.tsx`, `GridTabletRow.tsx`, `GridPhoneCard.tsx`, `GridChunkBlock.tsx`, `VirtualizedGrid.tsx`, `test/core_logic.test.ts`)
- **Thời gian**: 2026-10-30 23:11
- **Files thay đổi**:
  - `src/components/grid/VirtualizedGrid.tsx` (2389 dòng):
    + Xác định biến chung duy nhất toàn hệ thống `showRowNumber = Boolean(gridSettings.showRowNumber && flatColumns.some(isRowNumberCol))` phản ánh tức thì trạng thái bật/tắt trong Cài đặt bảng (`AdvGridSettingsPopup`) cũng như ẩn cột STT qua Menu ngữ cảnh / Column Chooser (`hiddenColKeys`).
    + Truyền `showRowNumber` trực tiếp xuống `<GridTabletHeader>` và `<GridChunkBlock>`.
  - `src/components/grid/GridChunkBlock.tsx` (357 dòng):
    + Tiếp nhận prop `showRowNumber?: boolean`, tính `effectiveShowRowNumber` và chuyển tiếp vào `<GridTabletRow>` và `<GridPhoneCard>`. Memo comparator kiểm tra `prev.showRowNumber !== next.showRowNumber`.
  - `src/components/grid/responsive/GridTabletHeader.tsx` (47 dòng) & `GridTabletRow.tsx` (187 dòng):
    + Tiếp nhận `showRowNumber`, ẩn STT khi tắt. Khi cả STT và Checkbox cùng tắt, ẩn luôn khối `w-10` đầu để nội dung tràn sát mép trái.
  - `src/components/grid/responsive/GridPhoneCard.tsx` (253 dòng):
    + Ẩn hoàn toàn thẻ STT pill ở Header của Phone Card khi `showRowNumber === false`.
  - `test/core_logic.test.ts` (570 dòng):
    + Bổ sung Unit Test Suite 12 (40/40 unit tests pass).

---

## 🕒 Lần 1: Đồng Bộ Hóa Cột Chọn Dòng (Checkbox Column) Giữa 3 Bố Cục PC, Tablet & Phone Qua Biến Chung `showSelectionCol` (`GridTabletRow.tsx`, `GridPhoneCard.tsx`, `GridChunkBlock.tsx`, `VirtualizedGrid.tsx`, `test/core_logic.test.ts`)
- **Thời gian**: 2026-10-30 23:04
- **Files thay đổi**:
  - `src/components/grid/VirtualizedGrid.tsx`: Xác định biến chung duy nhất `showSelectionCol = Boolean(gridSettings.showSelectionCol && flatColumns.some(isSelectionColumn))`, truyền xuống GridChunkBlock.
  - `src/components/grid/GridChunkBlock.tsx`: Tiếp nhận `showSelectionCol`, chuyển tiếp sang `GridTabletRow` và `GridPhoneCard`, memo comparator kiểm tra thay đổi.
  - `src/components/grid/responsive/GridTabletRow.tsx`: Ẩn `<MorphCheckbox>` khi `showSelectionCol === false`.
  - `src/components/grid/responsive/GridPhoneCard.tsx`: Ẩn `<MorphCheckbox>` trên Header của Phone Card khi `showSelectionCol === false`.
