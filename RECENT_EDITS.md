# Nhật Ký 3 Lần Chỉnh Sửa Gần Nhất (Rolling Edit Log)

Tài liệu này lưu trữ thông tin chi tiết về file, vị trí dòng, phần tử/nội dung thay đổi của **3 lần chỉnh sửa code gần nhất**. Sau mỗi lần code mới, nhật ký này sẽ tự động cuốn chiếu (loại bỏ lần cũ nhất và bổ sung lần mới nhất).

---

## 🕒 Lần 3 (Mới nhất): Triển Khai Bộ Ba Cơ Chế Chống Rung Giật Bố Cục Khi Resize Chiều Ngang Liên Tục (1+2+3) (`useGridLayoutMode.ts`, `VirtualizedGrid.tsx`, `test/core_logic.test.ts`)
- **Thời gian**: 2026-10-31 16:40
- **Files thay đổi**:
  - `src/components/grid/responsive/useGridLayoutMode.ts` (195 dòng):
    + **Ý tưởng 1: Hysteresis Buffer ($\pm 16\text{px}$)**: Thiết lập hàm thuần túy `resolveActiveModeWithHysteresis` chống rung giật ranh giới 1px và triệt tiêu vòng lặp vô hạn do thanh cuộn dọc (Scrollbar Layout Shift ~15px). Khi ở Phone phải vượt $> 784\text{px}$ mới lên Tablet; khi ở Tablet phải tụt $< 752\text{px}$ mới về Phone; khi ở Tablet phải vượt $> 1040\text{px}$ mới lên PC; khi ở PC phải tụt $< 1008\text{px}$ mới về Tablet.
    + **Ý tưởng 2: Debounce Chuyển Bố Cục (120ms)**: Chiều rộng `containerWidth` vẫn cập nhật liên tục để CSS co giãn theo chuột, nhưng việc chuyển đổi `activeMode` được trì hoãn 120ms giúp bỏ qua các layout trung gian khi kéo nhanh (nhảy thẳng PC $\rightarrow$ Phone), bảo toàn 60 FPS.
    + Lần đo đầu tiên khi mount trang áp dụng `getInitialGridMode` tức thì (0ms delay) để trang tải chuẩn xác ngay lập tức.
  - `src/components/grid/VirtualizedGrid.tsx` (2477 dòng):
    + **Ý tưởng 3: Neo Giữ Vị Trí Dòng Đang Đọc (Anchor Row Preservation)**: Tích hợp `useLayoutEffect` chạy đồng bộ trước khi trình duyệt paint. Khi `activeMode` thay đổi, tính toán chỉ số dòng đang ở đỉnh khung nhìn `anchorRowIndex = Math.floor(currentScrollTop / prevRowHeight)`, khôi phục ngay `newScrollTop = anchorRowIndex * actualRowHeight` và đồng bộ `chunkWindow`. Người dùng đang đọc dòng nào thì dù co giãn sang Phone, Tablet hay PC, dòng đó vẫn nằm nguyên ở đỉnh tầm mắt mà không bị trôi lệch.
  - `test/core_logic.test.ts` (796 dòng):
    + Bổ sung Unit Test Suite 14 kiểm thử toàn diện: initial mode 0ms delay, buffer Phone $\leftrightarrow$ Tablet, buffer Tablet $\leftrightarrow$ PC, chống vòng lặp scrollbar shift 15px và bảo toàn chỉ số dòng cuộn (51/51 tests pass).

---

## 🕒 Lần 2: Khắc Phục Triệt Để Lỗi Khoảng Trắng 84px Giữa Các Chunk Trên Bố Cục Phone (`GridPhoneCard.tsx`, `test/core_logic.test.ts`)
- **Thời gian**: 2026-10-31 01:05
- **Files thay đổi**:
  - `src/components/grid/responsive/GridPhoneCard.tsx` (271 dòng):
    + **Nguyên nhân lỗi**: Trước đây thẻ dùng `margin: '4px 8px'`, theo đặc tả CSS Block Formatting Context, `margin-bottom` của thẻ trước và `margin-top` của thẻ sau bị **CSS Margin Collapse** về `max(4px, 4px) = 4px`. Khiến 20 thẻ chỉ chiếm $20 \times 96 + 19 \times 4 + 4 + 4 = 2004\text{px}$ thay vì $2080\text{px}$, hụt $76\text{px}$ ở đáy chunk. Khi cộng thêm $4\text{px}$ margin-top của thẻ đầu chunk sau và $4\text{px}$ margin-bottom của thẻ cuối chunk trước, tạo thành khoảng trống $84\text{px}$ (như giữa Card 180 và Card 181).
    + **Giải pháp dứt điểm**: Bọc mỗi card trong một slot container `.agv-phone-card-slot` có chiều cao chuẩn $104\text{px}$ ($254\text{px}$ khi mở rộng), `padding: 4px 8px`, `boxSizing: border-box`, loại bỏ hoàn toàn margin collapse.
    + Thẻ `<article>` bên trong có chiều cao $96\text{px}$ ($246\text{px}$ khi mở rộng), được bảo vệ trọn vẹn trong slot.
    + Khoảng cách giữa 2 thẻ kề nhau bất kỳ (cả trong cùng chunk lẫn giữa Chunk 8 và Chunk 9) luôn là $4\text{px} + 4\text{px} = \mathbf{8\text{px}}$ đều như vắt tranh, triệt tiêu 100% khoảng trắng rỗng.
  - `test/core_logic.test.ts` (697 dòng):
    + Bổ sung Unit Test vào Suite 10 chứng minh bằng toán học tọa độ pixel: khoảng cách từ Card 180 đến Card 181 và khoảng cách nội bộ trong chunk đều đồng nhất chính xác $8\text{px}$ (46/46 unit tests pass).

---

## 🕒 Lần 1: Tinh Gọn Toàn Bộ 4 Vùng Được Khoanh Trên Thanh PageToolbar Giúp Giao Diện Gọn Gàng, Thoáng Mắt (`PageToolbar.tsx`)
- **Thời gian**: 2026-10-31 00:47
- **Files thay đổi**:
  - `src/demo/PageToolbar.tsx` (354 dòng - giảm từ 803 dòng):
    + **Vùng 1 (Khoanh lớn trên cùng)**: Xóa bỏ hoàn toàn khối Header demo gồm Logo tầng, Tiêu đề `Hạ Tầng Điện Toán Đám Mây (50,000 Dòng)`, nút `Chế độ: 2 Cột Chart`, nút `Công Thức: Trung Bình (AVG)`, dòng chú thích và 4 ô chỉ số hiệu năng (`FPS THỰC`, `CHUNKS ACTIVE`, `DOM ROWS`, `TỐC ĐỘ CUỘN`), cùng nút `Ẩn Toolbar` ở đỉnh.
    + **Vùng 2 (Khoanh nhỏ)**: Xóa bỏ nút `[ Dòng Lọc ]` trên hàng công cụ.
    + **Vùng 3 (Khoanh cụm)**: Xóa bỏ form `Tới dòng (1-50000)` + nút `Nhảy` và khối phân đoạn `Chế độ: Xem / Sửa (1 click) / Sửa (2 click)`.
    + **Vùng 4 (Khoanh cuối)**: Xóa bỏ khối phân đoạn `Bố cục: Tự động / PC / Tablet / Phone` (chế độ bố cục tự động điều chỉnh mượt mà theo kích thước màn hình qua `useGridLayoutMode`).
    + Giữ lại đầy đủ các chức năng cần thiết: Ô `Tìm trong 50.000 dòng...`, nút `[ Bộ Lọc ]`, nút `[ 🧪 Primitives ]`, menu chọn Theme (`Balham Dark`, `Bezier Art House`...), nút `[ Nhập CSS ]`, nút chuyển `Ngày` / `Đêm`, nút `[ Test Cuộn Cao Tốc ]`, và nút `[ Ẩn Toolbar ^ ]`.
    + Giảm dung lượng build từ 726.97 kB xuống 714.93 kB (nhẹ hơn ~12 kB), tăng tốc độ render.
