# Lưu trữ Thanh Công Cụ Nổi (Floating Toolbar Archive)

Thư mục này lưu giữ code thanh công cụ nổi ghim cạnh trái Grid (`GridFloatingToolbar.tsx` và `floatingToolbar.css`) để tái sử dụng sau này khi cần. Không xóa thư mục này.

- `GridFloatingToolbar.tsx`: Component thanh công cụ nổi bên trái Grid (kèm kéo dọc và giữ mở 5s sau hover).
- `floatingToolbar.css`: CSS tương ứng cho `.agv-floating-toolbar` và các hiệu ứng flyout nổi.
- Các popup con (`AdvQuickFilterFlyout`, `AdvGridQueryBuilderModal`, `AdvColumnChooserModal`, `AdvMultiSortPopup`) vẫn đang được sử dụng bởi hệ thống nút ngoài Grid thông qua `GridExternalPopupHost` + `AdvAnchoredPopover`.
