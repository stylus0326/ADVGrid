# Nhật Ký 3 Lần Chỉnh Sửa Gần Nhất (Rolling Edit Log)

Tài liệu này lưu trữ thông tin chi tiết về file, vị trí dòng, phần tử/nội dung thay đổi của **3 lần chỉnh sửa code gần nhất**. Sau mỗi lần code mới, nhật ký này sẽ tự động cuốn chiếu (loại bỏ lần cũ nhất và bổ sung lần mới nhất).

---

## 🕒 Lần 3 (Mới nhất): Lưu Trữ Tài Liệu Kỹ Thuật Chuyên Sâu 2 Kỹ Thuật Xử Lý Deep Pagination (OFFSET Lớn) & Chống Hao Hụt Dòng Khi Xóa Dòng / Cuộn Nhảy Cóc
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
- **Nội dung & Vị trí cụ thể**:
  1. Đáp ứng trọn vẹn yêu cầu: *"lưu 2 kỹ thuật này lại 1 file riêng sau tôi đọc lại"*.
  2. Tra cứu tức thì bằng `node code_index.js pagination` hoặc `node code_index.js "deferred join"`.

---

## 🕒 Lần 2: Bổ Sung Kiến Trúc Tích Hợp MCP (Model Context Protocol) Server Vào Tài Liệu (`docs/BACKEND_ARCHITECTURE_100K_USERS.md`) Cho AI & Automation
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

---

## 🕒 Lần 1: Bổ Sung Kiến Trúc Frontend Đa Nền Tảng Vào Tài Liệu (`docs/BACKEND_ARCHITECTURE_100K_USERS.md`): Tích Hợp TAURI v2 Cho App Windows & Cơ Chế Multi-Tab Keep-Alive 0ms Không Bị Load Lại
- **Thời gian**: 2026-10-27 00:05
- **Files thay đổi**:
  - `docs/BACKEND_ARCHITECTURE_100K_USERS.md`: Bổ sung Mục 7 về chiến lược 1 codebase ra 4 nền tảng (Web, Windows, Android, iOS), so sánh TAURI v2 vs Electron và cơ chế Multi-Tab Keep-Alive (Off-Screen DOM Pattern) chuyển tab 0ms.
