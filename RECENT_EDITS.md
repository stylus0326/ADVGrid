# Nhật Ký 3 Lần Chỉnh Sửa Gần Nhất (Rolling Edit Log)

Tài liệu này lưu trữ thông tin chi tiết về file, vị trí dòng, phần tử/nội dung thay đổi của **3 lần chỉnh sửa code gần nhất**. Sau mỗi lần code mới, nhật ký này sẽ tự động cuốn chiếu (loại bỏ lần cũ nhất và bổ sung lần mới nhất).

---

## 🕒 Lần 3 (Mới nhất): Tính Tổng Toán Tử Theo Cột (`columnSums`) Dựa Trên Số Dòng Đang Chọn Thay Vì Toàn Bảng & Gỡ Bỏ Thống Kê Phụ Trên `PageFooter`
- **Thời gian**: 2026-10-27 20:28
- **Files thay đổi**:
  - `src/App.tsx` (1614 dòng):
    - Cập nhật `baseGroupData` / `columnSums` (Dòng 951 - 1039): Khi người dùng tích chọn dòng (`checkedRowIndices.size > 0`), toàn bộ giá trị tổng theo cột (`columnSums` hiển thị tại ô toán tử từng cột trên `GridFilterRow` và `groupSums` trên dòng nhóm) tự động tính theo các dòng đang chọn (`checkedRowIndices`) thay vì cộng toàn bảng; tích hợp fast-path $O(K)$ duyệt trực tiếp `checkedRowIndices` khi không có bộ lọc. Khi bỏ chọn hết (`checkedRowIndices.size === 0`), tự động khôi phục tính tổng toàn bảng.
    - Xóa `checkedRowStats` khỏi `src/App.tsx`.
  - `src/demo/PageFooter.tsx` (104 dòng):
    - Gỡ bỏ `checkedRowStats` khỏi thanh trạng thái đáy, giữ nguyên hiển thị `Đã chọn: {checkedRowCount} dòng` tinh gọn.
  - `code_index.js`: Cập nhật đồng bộ số dòng và mô tả `columnSums`.

---

## 🕒 Lần 2: Hoàn Thiện Bộ Themes (`bezierArthouse`, `--agv-bg-surface`/`--agv-bg-card`/`--agv-info`), Lưu `surfaceTheme` Vào `localStorage`, Điều Hướng Bàn Phím, Dính Tiêu Đề Nhóm (Sticky Group Header) & Ghim Dòng Lên Đầu
- **Thời gian**: 2026-10-27 19:52
- **Files thay đổi**:
  - `src/themes/bezierArthouse.ts` (44 dòng) & `src/themes/common.ts` (299 dòng):
    - Phân tách độ tương phản dòng chẵn/lẻ (`bgRowAlt: '#3D3D3D'`), đổi màu dòng đang chọn sang hổ phách trầm (`bgSelected: '#4A3B28'`, `bgItemActive: '#4A3B28'`), làm dịu đường kẻ lưới ô thường (`border: '#4A4A4A'`); khai báo đầy đủ 3 biến CSS `--agv-bg-surface`, `--agv-bg-card` và `--agv-info` trong `renderTokensCssBlock` cho cả 4 themes.
  - `src/components/grid/VirtualizedGrid.tsx` (2098 dòng):
    - **Mục II.1 (Sticky Group Header)**: Bổ sung `stickyGroupRowIndex` và `computeStickyGroupIdx` (O(1) qua `localRowIndex` kèm quét ngược an toàn), tái sử dụng `<GridRow />` trong khung sticky `height: 0; overflow: visible` ngay dưới `GridFilterRow` (và các dòng ghim) để giữ tiêu đề nhóm luôn hiển thị khi cuộn qua các dòng con đang mở rộng mà không gây dịch chuyển layout.
    - **Mục II.2 (Điều hướng bàn phím)**: Bổ sung `handleKeyDownNav` hỗ trợ `ArrowUp`, `ArrowDown`, `PageUp`, `PageDown` và `Space` chọn/bỏ chọn dòng đang focus, tự động cuộn viewport tôn trọng chiều cao sticky header + filter row + dòng ghim + tiêu đề nhóm dính và cơ chế `CHUNK = 20`.
    - **Mục III.1 (Ghim dòng lên đầu bảng)**: Quản lý `pinnedRows` (`handleTogglePinContextMenuRow`, `handleClearPinnedRows`, `handleInternalCellChange`), hiển thị các dòng đã ghim cố định ngay dưới `GridFilterRow` bằng `<GridRow />` kèm đường phân cách `border-b-2 border-b-[var(--agv-border-strong)]`.
  - `src/components/grid/ColumnContextMenu.tsx` (1141 dòng):
    - Tích hợp tùy chọn `Ghim dòng lên đầu` / `Bỏ ghim dòng` và `Bỏ ghim tất cả dòng (${pinnedRowCount})` trong menu chuột phải dòng (`CONTEXT_MENU_TYPES.ROW`), chuẩn `min-h-[28px]`, không icon, không tooltip, 100% biến CSS `var(--agv-*)`.
  - `src/App.tsx` (1614 dòng):
    - Bổ sung `surfaceTheme` vào `PersistedGridConfig` (`localStorage`), gắn `isCollapsed` và `onToggleCollapse` vào `groupRow` trong `groupedDisplayModel`.

---

## 🕒 Lần 1: Chuẩn Hóa DRY `formatQueryRuleSummary`, Fix Rules of Hooks & Đếm Chính Xác 100% `matchCount` Tại `AdvGridQueryBuilderModal.tsx`, Đồng Bộ `MorphCheckbox` / `MorphChevronIcon` / Biến CSS `var(--agv-*)`
- **Thời gian**: 2026-10-27 19:08
- **Files thay đổi**:
  - `src/components/grid/floating/queryUtils.ts` (669 dòng):
    - Xuất bản `QUERY_OP_DISPLAY_MAP` (100% khóa `[FILTER_OPS.*]`) và hàm `formatQueryRuleSummary(rule, columns)` dùng chung toàn hệ thống, loại bỏ hoàn toàn việc khai báo lặp `opMap`.
  - `src/components/grid/floating/AdvGridQueryBuilderModal.tsx` (1522 dòng):
    - Tái sử dụng `formatQueryRuleSummary` từ `queryUtils.ts` (giảm 35 dòng code trùng lặp).
    - Thay thế 5 mã màu Hex cứng trong `LEVEL_PAREN_COLORS` bằng hệ thống biến CSS chủ đề (`var(--agv-accent)`, `var(--agv-warning)`, `var(--agv-info)`, `var(--agv-danger)`, `var(--agv-success)`, `var(--agv-trend-up)`).
    - Thay ký tự unicode `▾` trong `QueryCustomSelect` bằng `MorphChevronIcon` (`type="down-up"`).
    - **Sửa lỗi Rules of Hooks**: Đưa `matchCount` (`useMemo`) và `jumpToTarget` (`useCallback`) lên trước câu lệnh `if (!isOpen) return null;`.
    - **Đếm chính xác 100% `matchCount`**: Bỏ giới hạn lấy mẫu 2.000 dòng, duyệt trực tiếp toàn bộ `countTotal` với `getCellValue` zero-closure cho kết quả khớp chính xác tuyệt đối.
  - `src/demo/TwelveMonthChartCell.tsx` (342 dòng):
    - Thay thế `stroke="#ffffff"` và `fill="#ffffff"` trên 3 thẻ `<circle>` (Max, Min, Hover) bằng `var(--agv-bg-surface)` và `var(--agv-trend-up)` / `var(--agv-trend-down)`.
  - `src/components/grid/AdvMultiFilterPopup.tsx` (901 dòng):
    - Thay thế toàn bộ ký tự unicode cứng (`✕`, `▼`, `✓`) và fallback hex `#ef4444` bằng Lucide Icons (`X`, `Check`), `MorphChevronIcon` và `var(--agv-danger)`.
  - `src/components/grid/floating/AdvGridSettingsPopup.tsx` (96 dòng):
    - Xóa `SettingsCheckbox` tự vẽ nội bộ, tái sử dụng `MorphCheckbox` chuẩn của hệ thống.
  - `src/demo/FilterModal.tsx` (281 dòng):
    - Bổ sung `onClick={onClose}` trên lớp nền backdrop và `onClick={(e) => e.stopPropagation()}` trên khung modal để tự động đóng khi click ra ngoài.
  - `code_index.js`: Cập nhật đồng bộ số dòng và mô tả `filesSummary`.
