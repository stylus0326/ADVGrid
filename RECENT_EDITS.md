# Nhật Ký 3 Lần Chỉnh Sửa Gần Nhất (Rolling Edit Log)

Tài liệu này lưu trữ thông tin chi tiết về file, vị trí dòng, phần tử/nội dung thay đổi của **3 lần chỉnh sửa code gần nhất**. Sau mỗi lần code mới, nhật ký này sẽ tự động cuốn chiếu (loại bỏ lần cũ nhất và bổ sung lần mới nhất).

---

## 🕒 Lần 3 (Mới nhất): Bố Trí Song Song 2 Trường Thử Nghiệm `Quốc gia (Chọn Đơn Cell)` & `Quốc gia (Chọn Đa Cell)` ([`src/pages/UiPrimitivesPage.tsx`](src/pages/UiPrimitivesPage.tsx) `981` dòng)
- **Thời gian**: 2026-11-20 08:24
- **Files cập nhật**:
  - **Trang Thử Nghiệm UI ([`src/pages/UiPrimitivesPage.tsx`](src/pages/UiPrimitivesPage.tsx) `981` dòng)**:
    + Thêm state `fieldMultiCellCountry` (mặc định sẵn `['Việt Nam', 'KR']`) để người dùng kiểm thử ngay chế độ chọn nhiều ô mà không cần chuyển toggle.
    + Tách thành 2 trường riêng biệt đặt cạnh nhau trên lưới:
      1) `Quốc gia (Chọn Đơn Cell)`: `selectionMode="cell"`, `multiSelect={false}` (click 1 ô đổi giá trị và đóng popup ngay).
      2) `Quốc gia (Chọn Đa Cell)`: `selectionMode="cell"`, `multiSelect={true}` (click chọn/bỏ chọn độc lập nhiều ô rải rác, input gom chuỗi ngăn cách dấu phẩy, chân trang có số lượng ô, nút `Bỏ chọn` và nút `Áp dụng`).
    + Thu gọn thanh công cụ trên cùng (`Kiểu dáng control`, `Vị trí nhãn`, `Mô phỏng trạng thái lỗi`), loại bỏ các nút toggle dư thừa để giao diện gọn gàng trực quan.

---

## 🕒 Lần 2: Bổ Sung Chế Độ Chọn Theo Ô (`selectionMode="cell"`) Đơn & Nhiều Cho `AdvSearchLookUpEdit` (`AdvSearchLookUpEdit.tsx`, `AdvSearchLookUpPopup.tsx`, `ui/index.ts`)
- **Thời gian**: 2026-11-20 00:55
- **Files cập nhật**:
  - **Mở Rộng Engine Chọn Theo Ô & Đa Ô ([`src/components/ui/AdvSearchLookUpEdit.tsx`](src/components/ui/AdvSearchLookUpEdit.tsx) `900` dòng)**:
    + Bổ sung kiểu `AdvLookUpSelectionMode = 'row' | 'cell'` và `AdvLookUpSelectedCell<T>` ({ row, rowKey, colKey, value }), thêm prop `selectionMode?: AdvLookUpSelectionMode`.
    + Thêm state `selectedCells` và đồng bộ tự động `selectedCellKeysSet` (`${rowKey}:::${colKey}`) từ `curVal` đầu vào (cả single value, multi values hoặc cell objects).
    + Thêm hàm `handleSelectCell(item, colKey)`: ở chế độ đơn cell lập tức lấy giá trị ô `item[colKey]` đóng popup; ở chế độ nhiều cell toggle ô độc lập không ảnh hưởng các ô khác trong cùng dòng.
    + Cập nhật `selectedDisplayText` và `showMultiClear` để hiển thị trực tiếp chuỗi các ô đã chọn (ngăn cách dấu phẩy).
    + Thêm hàm `handleApplyMulti()` xác nhận đóng popup và cập nhật phím `Enter` hỗ trợ chọn ô.
  - **Giao Diện Popup & Chân Trang Thao Tác ([`src/components/ui/AdvSearchLookUpPopup.tsx`](src/components/ui/AdvSearchLookUpPopup.tsx) `504` dòng)**:
    + Ẩn cột Checkbox dòng khi `selectionMode === 'cell'`, chuyển toàn bộ tương tác click từ thẻ `<tr>` sang từng thẻ `<td>`.
    + Ô được chọn hiển thị nền accent chuẩn theme `bg-[var(--agv-accent)] text-[var(--agv-accent-text,#ffffff)] font-medium`, ô chưa chọn nhận hiệu ứng `hover:bg-surface-hover cursor-pointer`.
    + Bổ sung chân trang (`agv-lookup-footer`, `min-height: 36px`) khi `multiSelect`: bên trái hiển thị số ô/dòng đã chọn, bên phải gồm nút `Bỏ chọn` (`<AdvButton variant="destructive" size="sm">` = 28px) và nút `Áp dụng` (`<AdvButton variant="default" size="sm">` = 28px), tuân thủ 100% chuẩn nút 4 phân loại và lưới 4px.
  - **Export Types Toàn Hệ Thống ([`src/components/ui/index.ts`](src/components/ui/index.ts) `105` dòng)**:
    + Export `AdvLookUpSelectionMode` và `AdvLookUpSelectedCell`.

---

## 🕒 Lần 1: Gia Cố Kính Mờ `blur(40px)`, Viền Specular `::before`/`::after` & Triệt Tiêu Lộ Chữ Bên Dưới Cho Liquid Glass (`design-tokens.css`, `index.css`, `lib/styles.css`, `GridFilterRow.tsx`, `GridResponsiveHeader.tsx`, `GridTabletHeader.tsx`, `VirtualizedGrid.tsx`, `datePickerStyles.ts`)
- **Thời gian**: 2026-11-17 22:08
- **Files cập nhật**:
  - **Tokens Kính Mờ Chống Thấu Chữ ([`src/styles/design-tokens.css`](src/styles/design-tokens.css) `581` dòng)**:
    + Nâng độ đặc kính mờ của vùng header/filter sticky (`--table-header` & `--agv-bg-header` lên `0.96`, `--agv-row-sticky-surface` lên `0.97`, `--agv-bg-row`/`--agv-bg-row-alt` lên `0.72`/`0.74`, `--popover`/`--popup-background` lên `0.94`/`0.95`, `--control-background` lên `0.84`/`0.80`) cho cả Liquid Light & Liquid Dark.
    + Bổ sung biến viền phản chiếu cạnh trên/trái (`--liquid-specular-top`, `--liquid-specular-left`) cùng bóng đổ đa tầng + `inset 0 0 28–30px` mô phỏng hiệu ứng frosted `.glass-card` hài hòa cả 2 chế độ Sáng/Tối.
  - **Stylesheet App & Library ([`src/index.css`](src/index.css) `816` dòng, [`src/lib/styles.css`](src/lib/styles.css) `806` dòng, [`src/components/ui/datepicker/datePickerStyles.ts`](src/components/ui/datepicker/datePickerStyles.ts) `804` dòng)**:
    + Nâng toàn bộ `backdrop-filter` Liquid Glass lên `blur(40px) saturate(190%–195%)`.
    + Thêm pseudo-element `::before` và `::after` cho `.agv-list-page-panel`, `.agv-login-card`, `.agv-demo-card`.
    + Gắn `backdrop-filter: blur(40px) saturate(190%)` lên toàn bộ thanh sticky bảng & thead popup.
  - **Hook Attributes Cho Tầng Sticky Grid**:
    + [`src/components/grid/GridFilterRow.tsx`](src/components/grid/GridFilterRow.tsx) (`874` dòng), [`src/components/grid/responsive/GridResponsiveHeader.tsx`](src/components/grid/responsive/GridResponsiveHeader.tsx) (`94` dòng), [`src/components/grid/responsive/GridTabletHeader.tsx`](src/components/grid/responsive/GridTabletHeader.tsx) (`108` dòng), [`src/components/grid/VirtualizedGrid.tsx`](src/components/grid/VirtualizedGrid.tsx) (`2760` dòng).
