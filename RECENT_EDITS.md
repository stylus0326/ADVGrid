# Nhật Ký 3 Lần Chỉnh Sửa Gần Nhất (Rolling Edit Log)

Tài liệu này lưu trữ thông tin chi tiết về file, vị trí dòng, phần tử/nội dung thay đổi của **3 lần chỉnh sửa code gần nhất**. Sau mỗi lần code mới, nhật ký này sẽ tự động cuốn chiếu (loại bỏ lần cũ nhất và bổ sung lần mới nhất).

---

## 🕒 Lần 3 (Mới nhất): Tối Ưu Thuật Toán Chọn Dòng Tại `gridUtils.ts` (Fast-Path O(1), Duyệt Tập k Phần Tử) & Chuẩn Hóa DRY `renderHeaderCellContent` Tại `GridHeader.tsx`
- **Thời gian**: 2026-10-27 23:42
- **Files thay đổi**:
  - `src/components/grid/gridUtils.ts` (971 dòng):
    - `isSelectionColumn`: Đóng gói điều kiện kiểm tra cột chọn dòng (`Boolean(col.isSelection) || col.key === 'col_chk'`) vào predicate duy nhất toàn hệ thống.
    - `computeFilteredSelectionState`: Tối ưu hóa thuật toán tính toán trạng thái chọn dòng. Khi bảng không bật bộ lọc (`activeRowIndices === null`) và số lượng dòng đang chọn nhỏ hơn tổng số dòng, hàm chỉ duyệt qua tập `checkedRowIndices` ($k$ phần tử) thay vì quét đủ 50.000 dòng.
    - `toggleFilteredRowsSelection`: Bổ sung Fast-path $O(1)$ khi bỏ chọn toàn bộ trên bảng đang không lọc, trả về ngay `new Set<number>()` trong $O(1)$ tức thì thay vì chạy 50.000 lệnh `.delete()`.
  - `src/components/grid/GridHeader.tsx` (535 dòng, giảm 120 dòng code trùng lặp):
    - Dọn dẹp sạch sẽ 100% các import không dùng tới (`ArrowUp`, `ArrowDown` từ `lucide-react`).
    - Chuẩn hóa DRY qua helper `renderHeaderCellContent`: gom 4 khối JSX lặp lại ở 4 vùng (Pinned Left, Middle Standalone, Middle Band Child, Pinned Right) vào một hàm duy nhất điều phối tiêu đề, biểu tượng biến hình lò xo `MorphSortIcon`, nút checklist filter popup và thanh kéo giãn độ rộng cột.
  - `src/components/grid/VirtualizedGrid.tsx`, `GridFilterRow.tsx`, `GridRow.tsx`, `useColumnAutoFit.ts`: Đồng bộ áp dụng predicate `isSelectionColumn`.
  - `test/core_logic.test.ts` (297 dòng): Bổ sung 5 unit tests toàn diện cho Suite 8 "Selection State & Fast-Path Optimization".
  - `code_index.js`: Cập nhật số dòng, mô tả `filesSummary` và đăng ký 4 hàm/helper mới vào `CODE_DICTIONARY.functions`.
- **Nội dung & Vị trí cụ thể**:
  1. Đáp ứng 100% yêu cầu tối ưu thuật toán chọn dòng và DRY GridHeader.
  2. `npm test` pass 24/24 tests 100% (247ms); `npm run build` thành công giảm kích thước index bundle từ 653.52 kB về 649.48 kB (0 errors).

---

## 🕒 Lần 2: Lưu Trữ Tài Liệu Kỹ Thuật Chuyên Sâu 2 Kỹ Thuật Xử Lý Deep Pagination (OFFSET Lớn) & Chống Hao Hụt Dòng Khi Xóa Dòng / Cuộn Nhảy Cóc
- **Thời gian**: 2026-10-27 21:18
- **Files thay đổi**:
  - `docs/DEEP_PAGINATION_AND_VIRTUAL_SCROLLING_TECHNIQUES.md` (219 dòng): Biên soạn tài liệu kỹ thuật hoàn chỉnh:
    - Phân tích bản chất Deep Offset Penalty (Database duyệt qua 90.000 dòng để lấy 60 dòng làm nghẽn CPU/Disk I/O).
    - Phân tích tử huyệt của Keyset Pagination (`WHERE id > @last_id`) khi bảng bị xóa cứng, xóa mềm hoặc người dùng kéo thanh cuộn nhảy cóc (Random Access Scroll Jump) làm mất mốc ID.
    - Kỹ thuật 1: **Deferred Join (Late Row Lookup)** trên SQL Server & PostgreSQL: Subquery chạy Index-Only Scan trên B-Tree RAM buffer chỉ lấy 4 bytes ID rồi mới INNER JOIN ngược lại, tăng tốc 50 - 100 lần (từ 2.000ms xuống 15ms), độ chính xác tuyệt đối không bị hao hụt dòng.
    - Kỹ thuật 2: **Mảng ID Snapshot trong RAM Redis** (Enterprise Standard): Lưu mảng 100.000 ID vào Redis (chỉ tốn 400KB RAM), cắt lát mảng LRANGE/ZRANGE 60 ID trong 0.01ms, truy vấn DB bằng Primary Key Index Seek. Triệt tiêu 100% lỗi hao hụt dòng và đưa tải DB về 0%.
    - Bảng so sánh 4 phương pháp và lời khuyên thực chiến (với quy mô 50k-100k dòng thì Client-side Virtualization của Gridv3 vẫn đạt 0ms nhanh nhất).
  - `deep_pagination_and_virtual_scrolling_techniques.md` (Artifact): Đồng bộ nội dung vào Artifact Directory phục vụ xem trực quan.
  - `code_index.js`: Đăng ký `docs/DEEP_PAGINATION_AND_VIRTUAL_SCROLLING_TECHNIQUES.md` vào `filesSummary` (219 dòng) và bổ sung 2 khái niệm kiến trúc `Deferred Join (Late Row Lookup)` & `ID Array Snapshot in Redis (Enterprise Pagination)` vào `concepts`.

---

## 🕒 Lần 1: Bổ Sung Kiến Trúc Tích Hợp MCP (Model Context Protocol) Server Vào Tài Liệu (`docs/BACKEND_ARCHITECTURE_100K_USERS.md`) Cho AI & Automation
- **Thời gian**: 2026-10-27 00:16
- **Files thay đổi**:
  - `docs/BACKEND_ARCHITECTURE_100K_USERS.md` (424 dòng): Bổ sung toàn diện Mục 8 "Kiến Trúc Tích Hợp MCP (Model Context Protocol) Server Cho AI & Tự Động Hóa":
    - Sơ đồ tương tác Mermaid giữa AI Clients qua giao thức MCP tới cụm Backend NestJS.
    - Danh mục MCP Tools: `query_grid_records`, `trigger_export_excel`, `get_column_analytics`.
    - Danh mục MCP Resources: `grid://schema`, `grid://system-health`.
    - Các hàng rào bảo mật (Guardrails): Chặn 100% SQL raw, phân quyền RBAC, rate-limiting qua Redis.
    - Mã nguồn mẫu `McpService` hoàn chỉnh trên nền `@modelcontextprotocol/sdk`.
  - `backend_architecture_100k_users.md` (Artifact): Đồng bộ Mục 8 phục vụ hiển thị trực quan.
  - `code_index.js`: Đồng bộ số dòng (424 dòng) và mô tả cập nhật.
