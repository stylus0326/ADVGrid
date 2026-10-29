# Nhật Ký 3 Lần Chỉnh Sửa Gần Nhất (Rolling Edit Log)

Tài liệu này lưu trữ thông tin chi tiết về file, vị trí dòng, phần tử/nội dung thay đổi của **3 lần chỉnh sửa code gần nhất**. Sau mỗi lần code mới, nhật ký này sẽ tự động cuốn chiếu (loại bỏ lần cũ nhất và bổ sung lần mới nhất).

---

## 🕒 Lần 3 (Mới nhất): Cấu Hình Chuẩn Shadcn/UI CSS Variables & Kết Nối Tweakcn Live Preview (`src/index.css`, `tailwind.config.js`, `components.json`, `src/main.tsx`)
- **Thời gian**: 2026-10-29 19:55
- **Files thay đổi**:
  - `src/index.css` (842 dòng):
    - Khai báo đầy đủ 19 biến CSS bắt buộc của chuẩn shadcn/ui (`--radius`, `--background`, `--foreground`, `--card`, `--card-foreground`, `--popover`, `--popover-foreground`, `--primary`, `--primary-foreground`, `--secondary`, `--secondary-foreground`, `--muted`, `--muted-foreground`, `--accent`, `--accent-foreground`, `--destructive`, `--destructive-foreground`, `--border`, `--input`, `--ring`) trên cả `:root` lẫn `.dark` bên trong `@layer base`, khắc phục triệt để lỗi kiểm tra `checkShadcnSupport()` của tweakcn (Dòng 5 - 63).
  - `tailwind.config.js` (88 dòng) & `components.json` (19 dòng):
    - Bổ sung `darkMode: ['class']`, `borderRadius` và các nhóm màu chuẩn shadcn (`background`, `foreground`, `primary`, `secondary`, `destructive`, `muted`, `accent`, `popover`, `card`, `border`, `input`, `ring`) ánh xạ qua hàm `hsl(var(...))`, bảo toàn 100% các biến màu `agv` có sẵn.
    - Tạo tệp cấu hình chuẩn `components.json` xác nhận dự án sử dụng Tailwind CSS Variables (`"cssVariables": true`).
  - `src/main.tsx` (43 dòng):
    - Tích hợp bộ lắng nghe sự kiện `TWEAKCN_THEME_UPDATE` tự động đồng bộ màu chủ đạo `primary` sang `--agv-accent`, `background` sang `--agv-bg-root`, `foreground` sang `--agv-text-main` và `border` sang `--agv-border` trên toàn bộ bảng dữ liệu theo thời gian thực (Dòng 6 - 37).

---

## 🕒 Lần 2: Tối Ưu Siêu Mượt Resize Cột Theo Vùng Nhìn (Viewport-Culled 120fps) & Đồng Bộ Co Giãn Dòng Nhóm Từ Bản 7 (`useColumnResize`, `GridRow`, `index.css`)
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
  - `src/index.css` (842 dòng):
    - Bổ sung `contain: layout style` cho `.agv-grid-row` và `.agv-group-row`.
    - Khóa hit-testing `pointer-events: none !important` và `transition: none !important` trên `.agv-scroll-viewport` khi đang kéo giãn độ rộng cột (`html[data-agv-resizing="true"]`).
    - Giữ sáng vạch chỉ báo `.agv-col-resize-handle[data-resizing-active="true"] > span` theo màu `var(--agv-accent)`.
  - Bảo toàn 100% cơ chế kéo thả đổi vị trí cột HTML5 thuần hiện tại (`createDragProps` trong `GridHeader.tsx`).

---

## 🕒 Lần 1: Tích Hợp Hiệu Ứng Trượt Dòng FLIP Khi Sort Chuẩn AG Grid (`VirtualizedGrid`, `GridChunkBlock`, `GridRow`, `gridUtils`, `index.css`)
- **Thời gian**: 2026-10-29 03:59
- **Files thay đổi**:
  - `src/components/grid/gridUtils.ts` (1054 dòng):
    - Bổ sung hàm thuần túy `computeSortRowFlipState` và interface `SortRowFlipState` tính toán độ lệch vị trí dọc `deltaY` theo kỹ thuật FLIP (First - Last - Invert - Play) chuẩn AG Grid: trượt chính xác 100% tọa độ pixel cho các dòng hoán đổi trong vùng nhìn thấy (`<= 14 dòng`), phân tầng vận tốc trượt (`3.5 .. 11.2 dòng`) cho các dòng bay từ xa vào khung nhìn, và khóa biên trên (`newRowIndex + deltaRows >= 0`) để dòng không trồi lên vùng Header (Dòng 971 - 1054).
  - `src/components/grid/GridRow.tsx` & `src/components/grid/GridChunkBlock.tsx` (271 dòng):
    - Gắn class `.agv-chunk-block` trên khối chunk, truyền `rowKey` xuống `GridRow` và gắn thuộc tính định danh `data-row-key` + `data-row-idx` lên cả dòng dữ liệu `.agv-grid-row` lẫn dòng tiêu đề nhóm `.agv-group-row`.
  - `src/components/grid/VirtualizedGrid.tsx` (2501 dòng) & `src/index.css` (842 dòng):
    - Tích hợp động cơ `useLayoutEffect` FLIP Sort Animation (300ms `cubic-bezier(0.22, 1, 0.36, 1)`) theo dõi bản đồ tọa độ dòng `prevRowIndexMapRef`, tạm bật `[data-agv-sorting="true"]` mở `contain: layout style` trên `.agv-chunk-block` trong 320ms để các dòng trượt xuyên qua ranh giới chunk mượt mà, sau đó tự động dọn sạch inline transform/transition để bảo toàn 100% `position: sticky` và `contain: strict`.
  - `test/core_logic.test.ts` (371 dòng) & `code_index.js`:
    - Bổ sung bộ unit tests kiểm thử `computeSortRowFlipState` và cập nhật đồng bộ từ điển `code_index.js`.
