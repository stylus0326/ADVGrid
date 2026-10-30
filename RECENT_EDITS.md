# Nhật Ký 3 Lần Chỉnh Sửa Gần Nhất (Rolling Edit Log)

Tài liệu này lưu trữ thông tin chi tiết về file, vị trí dòng, phần tử/nội dung thay đổi của **3 lần chỉnh sửa code gần nhất**. Sau mỗi lần code mới, nhật ký này sẽ tự động cuốn chiếu (loại bỏ lần cũ nhất và bổ sung lần mới nhất).

---

## 🕒 Lần 3 (Mới nhất): Triển Khai Tính Năng Thu Gọn Toolbar Thành Strip Bar 34px Tinh Gọn Để Tối Ưu Diện Tích Test Grid (`PageToolbar.tsx`)
- **Thời gian**: 2026-10-30 20:36
- **Files thay đổi**:
  - `src/demo/PageToolbar.tsx` (804 dòng):
    - Triển khai **Phương án 1 (Dải Strip Bar 34px khi thu gọn)** theo đúng lựa chọn của người dùng:
      + Bổ sung state `isCollapsed` kết hợp lưu trữ `localStorage` (`agv_page_toolbar_collapsed`).
      + Khi thu gọn (`isCollapsed === true`): Thu nhỏ toàn bộ thanh điều khiển từ ~300px xuống chỉ còn đúng **34px** (tiết kiệm hơn 90% diện tích màn hình).
      + Trên thanh Strip Bar 34px: Giữ lại Segmented Control `Bố cục: [ Tự động | PC | Tablet | Phone ]` (min-h >= 28px, active nền màu chữ trắng chuẩn `AGENTS.md`) giúp người dùng chuyển đổi thử nghiệm nhanh giữa các chế độ màn hình mà không bị che khuất không gian Grid.
      + Trang bị nút `[ Hiện Toolbar ▼ ]` để bung mở lại toàn bộ thanh điều khiển bất kỳ lúc nào.
      + Khi thanh mở (`isCollapsed === false`): Bố trí nút `[ Ẩn Toolbar ▲ ]` (chuẩn theme, min-h 28px) ở cả 2 vị trí thuận tiện: cạnh khối Telemetry Metrics ở trên và cạnh nút Test Cuộn Cao Tốc ở dưới.

---

## 🕒 Lần 2: Triển Khai Bố Cục Thẻ Tài Chính 2 Cột Cho Biểu Đồ 12T Trên Phone & Triệt Tiêu Hoàn Toàn Lỗi Méo Mó Chấm Tròn Cực Trị (`TwelveMonthChartCell.tsx`, `GridPhoneCard.tsx`)
- **Thời gian**: 2026-10-30 20:28
- **Files thay đổi**:
  - `src/demo/TwelveMonthChartCell.tsx` (382 dòng): Tích hợp `ResizeObserver` tự động đo chiều rộng pixel container thực tế (`measuredWidth`), đồng bộ 1:1 giữa `viewBox` và khung hiển thị. Triệt tiêu 100% hiện tượng elip méo mó của chấm tròn cực đại Max (xanh lá) và cực tiểu Min (đỏ); đảm bảo đốm tròn luôn tròn xoe hoàn hảo.
  - `src/components/grid/responsive/GridPhoneCard.tsx` (236 dòng): Triển khai **Ý tưởng A (Bố cục Thẻ tài chính 2 Cột)**: Cột trái Biểu đồ 12T Catmull-Rom spline cao 50px thoáng đãng, vạch ngăn cách 1px, Cột phải Bảng tóm tắt số liệu cực trị xếp tầng dọc gọn gàng (Cao nhất, Thấp nhất, Trung bình).

---

## 🕒 Lần 1: Đồng Bộ Hóa Toàn Diện Biểu Đồ 12 Tháng Catmull-Rom Spline Giữa 3 Kiểu Hiển Thị PC, Tablet & Phone (`TwelveMonthChartCell.tsx`, `GridPhoneCard.tsx`, `GridTabletRow.tsx`, `GridTabletHeader.tsx`, `gridUtils.ts`)
- **Thời gian**: 2026-10-30 20:12
- **Files thay đổi**:
  - `src/components/grid/gridUtils.ts` (1117 dòng): Bổ sung hàm `getOrComputeMonthStats(recordObj)` dùng chung toàn hệ thống kết hợp bộ đệm `globalMonthStatsCache` (WeakMap $O(1)$) tránh cấp phát rác, trích xuất chính xác 12 tháng `mVals`, `minVal`, `maxVal`, `minIdx`, `maxIdx`, `avgVal`.
  - `src/demo/TwelveMonthChartCell.tsx`: Bổ sung prop tùy chọn `height?: number` (mặc định 24px) giúp component biểu đồ co giãn linh hoạt trên mọi kích thước.
  - `src/components/grid/responsive/GridPhoneCard.tsx`: Thay thế hoàn toàn đường polyline đơn điệu cũ bằng `TwelveMonthChartCell` chuẩn hệ thống: đầy đủ đường sóng Catmull-Rom spline, bóng gradient theo theme, chấm cực đại/cực tiểu, mốc trung bình và Animate UI Tooltip.
  - `src/components/grid/responsive/GridTabletRow.tsx` (177 dòng): Tích hợp biểu đồ 12T mini (`TwelveMonthChartCell` cao 22px, rộng 140px) trực tiếp vào Cụm 3 bên trên thông số AVG và giờ GD.
  - `src/components/grid/responsive/GridTabletHeader.tsx` (39 dòng): Cập nhật tiêu đề Cụm 3 thành "Biểu đồ 12T & AVG".
