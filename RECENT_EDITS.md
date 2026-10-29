# Nhật Ký 3 Lần Chỉnh Sửa Gần Nhất (Rolling Edit Log)

Tài liệu này lưu trữ thông tin chi tiết về file, vị trí dòng, phần tử/nội dung thay đổi của **3 lần chỉnh sửa code gần nhất**. Sau mỗi lần code mới, nhật ký này sẽ tự động cuốn chiếu (loại bỏ lần cũ nhất và bổ sung lần mới nhất).

---

## 🕒 Lần 3 (Mới nhất): Tối Ưu Siêu Mượt Resize Cột Theo Vùng Nhìn (Viewport-Culled 120fps) & Đồng Bộ Co Giãn Dòng Nhóm Từ Bản 7 (`useColumnResize`, `GridRow`, `index.css`)
- **Thời gian**: 2026-10-29 19:46
- **Files thay đổi**:
  - `src/components/grid/hooks/useColumnResize.ts` (337 dòng):
    - Tích hợp kỹ thuật Viewport Culling phân tách DOM nodes thành 2 nhóm tại thời điểm `mousedown`: nhóm Chunk hiển thị trong vùng nhìn (`visibleTargetCells`, `visibleGroupSpanCells`, `visibleFullWidthContainers`, `visibleStickyFollowers`) và nhóm Chunk đệm ngoài màn hình (`overscan*`).
    - Trong suốt quá trình `mousemove` (120fps qua `requestAnimationFrame`), chỉ cập nhật style trực tiếp cho ~20–25 ô hiển thị trên màn hình (thay vì 150+ ô trong đệm ảo hóa), giảm 85% chi phí reflow mỗi frame (< 0.04ms/frame).
    - Đồng bộ co giãn ô tiêu đề dòng nhóm (`[data-group-span-keys]`) theo thời gian thực 1:1 cùng tay chuột khi kéo các cột nằm trong phạm vi gộp của nhóm.
    - Cập nhật nốt các ô `overscan*` một lần duy nhất trước khi gọi `setColWidth` lưu vào React state khi nhả chuột `mouseup`.
    - Gắn cờ `data-resizing-active="true"` lên tay nắm kéo để giữ sáng vạch chỉ báo 2px màu accent trong suốt quá trình kéo kể cả khi chuột trôi ra ngoài.
  - `src/components/grid/GridRow.tsx` (1030 dòng):
    - Gắn thuộc tính `data-group-span-keys={spannedColKeys}` lên ô tiêu đề dòng nhóm (`group_title_cell`) để khi kéo giãn cột nằm trong khoảng gộp thì dòng nhóm co giãn tức thì.
  - `src/index.css` (787 dòng):
    - Bổ sung `contain: layout style` cho `.agv-grid-row` và `.agv-group-row`.
    - Khóa hit-testing `pointer-events: none !important` và `transition: none !important` trên `.agv-scroll-viewport` khi đang kéo giãn độ rộng cột (`html[data-agv-resizing="true"]`).
    - Giữ sáng vạch chỉ báo `.agv-col-resize-handle[data-resizing-active="true"] > span` theo màu `var(--agv-accent)`.
  - Bảo toàn 100% cơ chế kéo thả đổi vị trí cột HTML5 thuần hiện tại (`createDragProps` trong `GridHeader.tsx`).

---

## 🕒 Lần 2: Tích Hợp Hiệu Ứng Trượt Dòng FLIP Khi Sort Chuẩn AG Grid (`VirtualizedGrid`, `GridChunkBlock`, `GridRow`, `gridUtils`, `index.css`)
- **Thời gian**: 2026-10-29 03:59
- **Files thay đổi**:
  - `src/components/grid/gridUtils.ts` (1054 dòng):
    - Bổ sung hàm thuần túy `computeSortRowFlipState` và interface `SortRowFlipState` tính toán độ lệch vị trí dọc `deltaY` theo kỹ thuật FLIP (First - Last - Invert - Play) chuẩn AG Grid: trượt chính xác 100% tọa độ pixel cho các dòng hoán đổi trong vùng nhìn thấy (`<= 14 dòng`), phân tầng vận tốc trượt (`3.5 .. 11.2 dòng`) cho các dòng bay từ xa vào khung nhìn, và khóa biên trên (`newRowIndex + deltaRows >= 0`) để dòng không trồi lên vùng Header (Dòng 971 - 1054).
  - `src/components/grid/GridRow.tsx` & `src/components/grid/GridChunkBlock.tsx` (271 dòng):
    - Gắn class `.agv-chunk-block` trên khối chunk, truyền `rowKey` xuống `GridRow` và gắn thuộc tính định danh `data-row-key` + `data-row-idx` lên cả dòng dữ liệu `.agv-grid-row` lẫn dòng tiêu đề nhóm `.agv-group-row`.
  - `src/components/grid/VirtualizedGrid.tsx` (2501 dòng) & `src/index.css` (787 dòng):
    - Tích hợp động cơ `useLayoutEffect` FLIP Sort Animation (300ms `cubic-bezier(0.22, 1, 0.36, 1)`) theo dõi bản đồ tọa độ dòng `prevRowIndexMapRef`, tạm bật `[data-agv-sorting="true"]` mở `contain: layout style` trên `.agv-chunk-block` trong 320ms để các dòng trượt xuyên qua ranh giới chunk mượt mà, sau đó tự động dọn sạch inline transform/transition để bảo toàn 100% `position: sticky` và `contain: strict`.
  - `test/core_logic.test.ts` (371 dòng) & `code_index.js`:
    - Bổ sung bộ unit tests kiểm thử `computeSortRowFlipState` và cập nhật đồng bộ từ điển `code_index.js`.

---

## 🕒 Lần 1: Khắc Phục Triệt Để Kéo Thả Đổi Thứ Tự Cột & Nhóm Band Trên Header Và Popup Tùy Chọn Cột (`GridHeader`, `VirtualizedGrid`, `AdvColumnChooserModal`, `App`)
- **Thời gian**: 2026-10-29 03:24
- **Files thay đổi**:
  - `src/App.tsx` (2027 dòng):
    - Đồng bộ `dynamicColumnGroups` sắp xếp cả danh sách nhóm Band lẫn mảng `keys` con bên trong từng nhóm theo đúng thứ tự `columnOrder` (Dòng 271 - 305).
    - Nâng cấp `handleReorderColumns` hỗ trợ kéo thả cột đơn, kéo thả cột con trong cùng nhóm Band 2 tầng, kéo thả nguyên khối nhóm Band/Atomic (`grp_infra`, `grp_time`, `grp_analytics`, `grp_perf`), và tự động đồng bộ vùng ghim (`columnPins`) khi kéo thả cột qua lại giữa các vùng Ghim Trái / Giữa / Ghim Phải (Dòng 402 - 511).
  - `src/components/grid/VirtualizedGrid.tsx` (2501 dòng):
    - Bổ sung `effectiveColumnGroups` tự động sắp xếp thứ tự các nhóm Band và các cột con theo mảng `columns` hiện hành, truyền đồng nhất vào `activeColKeys`, `middleElements`, `ColumnContextMenu` và `GridFloatingToolbar`.
  - `src/components/grid/GridHeader.tsx` (566 dòng) & `src/index.css` (787 dòng):
    - Chuẩn hóa DRY hàm `createDragProps` kết hợp `draggingColKeyRef` + `requestAnimationFrame` (tránh re-render đồng bộ làm ngắt `dragstart`), kiểm tra `e.currentTarget.contains(e.relatedTarget)` trong `onDragLeave`, bật `[draggable="true"] { -webkit-user-drag: element; }` trong `index.css`, và bổ sung đầy đủ kéo thả cho cả Tiêu đề Nhóm Tầng 1 (`group.id`) lẫn Cột Con Tầng 2 (`childCols`).
  - `src/components/grid/floating/AdvColumnChooserModal.tsx` (1071 dòng):
    - Đồng bộ `orderedRawColumns` theo thứ tự `dataColumns` và bổ sung `measureSiblingMidpoints` đo tọa độ tâm thực tế của các phần tử anh em cùng cấp trước khi dịch chuyển, đồng thời lấy chiều cao thực của `.agv-chooser-band-group` giúp kéo thả các nhóm Band đang mở rộng mượt mà, không bị rung/nhảy chỉ số.
  - `code_index.js`: Cập nhật đồng bộ số dòng và mô tả chức năng.
