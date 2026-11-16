# Nhật Ký 3 Lần Chỉnh Sửa Gần Nhất (Rolling Edit Log)

Tài liệu này lưu trữ thông tin chi tiết về file, vị trí dòng, phần tử/nội dung thay đổi của **3 lần chỉnh sửa code gần nhất**. Sau mỗi lần code mới, nhật ký này sẽ tự động cuốn chiếu (loại bỏ lần cũ nhất và bổ sung lần mới nhất).

---

## 🕒 Lần 3 (Mới nhất): Đóng Gói `gridv3` Thành Package Độc Lập (`src/lib/*`, `vite.lib.config.ts`, `tsconfig.lib.json`, `tailwind.lib.config.js`, `package.json`, `docs/API_GUIDE.md`)
- **Thời gian**: 2026-11-16 20:43
- **Files cập nhật**:
  - **Entry Points & Stylesheet cô lập thư viện (`src/lib/`)**:
    + [`src/lib/styles.css`](src/lib/styles.css): Khai báo `@import '../styles/design-tokens.css'`, `@tailwind components`/`utilities` (bỏ `@tailwind base` và `html, body, #root { overflow: hidden }`), cô lập Preflight `box-sizing`/`border` trong `.agv-grid-root`, `[data-agv-popup="true"]`, `.agv-control`, `.agv-btn`.
    + [`src/lib/index.ts`](src/lib/index.ts), [`src/lib/columns.ts`](src/lib/columns.ts), [`src/lib/grid.ts`](src/lib/grid.ts), [`src/lib/ui.ts`](src/lib/ui.ts), [`src/lib/themes.ts`](src/lib/themes.ts): Tạo 5 entry points tối ưu bundle, bảo toàn `DataGridEnterprise` tải lười ở chunk riêng khi entry chính chỉ dùng Basic View.
  - **Cấu hình Build Library & Type Declarations**:
    + [`tailwind.lib.config.js`](tailwind.lib.config.js), [`tsconfig.lib.json`](tsconfig.lib.json), [`vite.lib.config.ts`](vite.lib.config.ts): Tắt `preflight`, xuất `.d.ts` tối giản (`removeComments: true`, `declarationMap: false`), build Vite Library Mode ra `dist-lib/` (`sourcemap: false`, `cssCodeSplit: false`, `legalComments: 'none'`, `external: react/react-dom`).
  - **Cấu hình Package & Tài liệu**:
    + [`package.json`](package.json), [`.gitignore`](.gitignore), [`README.md`](README.md), [`docs/API_GUIDE.md`](docs/API_GUIDE.md): Bổ sung `exports`, `peerDependencies`, `files` (chỉ đóng gói `dist-lib/`, `docs/API_GUIDE.md`, `README.md`, không lộ `src/`), scripts `build:lib` / `pack:lib` và tạo tarball `gridv3-1.0.0.tgz`.

---

## 🕒 Lần 2: Tách Triệt Để Basic View (`BasicDataGridView` & `DataGridEnterprise`) Tối Ưu Dung Lượng & Số File Nạp (`DataGrid.tsx`, `DataGridEnterprise.tsx`, `normalizeColumns.ts`, `columnPresets.tsx`, `GridRow.tsx`, `AirportsPage.tsx`)
- **Thời gian**: 2026-11-15 23:46
- **Files cập nhật**:
  - **Tách Core Engine Basic View-Only khỏi Enterprise**:
    + [`src/components/grid/DataGrid.tsx`](src/components/grid/DataGrid.tsx): Chuyển thành Public Dispatcher siêu nhẹ tích hợp `BasicDataGridView` (chỉ import `gridCore.css`, `normalizeColumns`, `gridFormatUtils`, `useGridPopupLock`, `useGridOverlayScrollbar`, `AdvButton` + 2 lazy boundaries `LazyGridStatusBar` & `LazyDataGridEnterprise`), kiểm tra `canUseBasicViewEngine` và ảo hóa `CHUNK = 20` / `DEFAULT_ROW_HEIGHT = 32` cho chế độ `BasicViewModules` (không kéo `VirtualizedGrid`, 10 hooks Enterprise, `MorphCheckbox`, `GridMorphPrimitives`, `columnPresets`, `TwelveMonthChartCell`).
    + [`src/components/grid/DataGridEnterprise.tsx`](src/components/grid/DataGridEnterprise.tsx): Tách toàn bộ `useDataGridController` và `DataGridEnterprise` ra chunk lazy riêng biệt dùng cho các trang Standard / Enterprise.
  - **Cắt phụ thuộc tĩnh & Cảnh báo Chunk**:
    + [`src/components/grid/columns/normalizeColumns.ts`](src/components/grid/columns/normalizeColumns.ts): Bổ sung `BasicColumnHelper` & `createBasicColumnHelper` cùng type re-exports từ `./columnTypes`.
    + [`src/components/grid/columns/columnPresets.tsx`](src/components/grid/columns/columnPresets.tsx): Chuyển `TwelveMonthChartCell` sang `React.lazy` + `<Suspense fallback={null}>`.
    + [`src/components/grid/GridRow.tsx`](src/components/grid/GridRow.tsx): Chuyển `RowGroupChevronMorphIcon` (`./GridMorphPrimitives`) sang `React.lazy` + `<Suspense fallback={null}>` để triệt tiêu cảnh báo chunk tĩnh/động của Vite.
    + [`src/pages/AirportsPage.tsx`](src/pages/AirportsPage.tsx): Chuyển import helper cột sang `createBasicColumnHelper as createColumnHelper` từ `../components/grid/columns/normalizeColumns`.

---

## 🕒 Lần 1: Sân Bay Dùng `BasicViewModules` & Quốc Gia Bổ Sung Dòng `Đo thực tế` (`gridPageTelemetry.tsx`, `AirportsPage.tsx`, `CountriesPage.tsx`, `usePagedListQuery.ts`)
- **Thời gian**: 2026-11-15 23:11
- **Files cập nhật**:
  - **Module đo lường dùng chung & API Telemetry**:
    + [`src/pages/gridPageTelemetry.tsx`](src/pages/gridPageTelemetry.tsx) (`167` dòng): Tạo mới module dùng chung `captureRuntimeTelemetry`, `countGridDomNodes` (đo trực tiếp cây DOM của `.agv-grid-root`), hook `useGridStageTelemetry` (đo `renderMs` theo `requestAnimationFrame` + settle `120ms` cho lazy chunks) và component `<GridTelemetryLine />`.
    + [`src/pages/usePagedListQuery.ts`](src/pages/usePagedListQuery.ts) (`190` dòng): Bổ sung `apiLoadMs` (`0ms` khi hit LRU cache hoặc đo từ lúc gọi `fetcher` mạng) và `renderStartRef` (tương thích ngược `PartnersPage` / `BookingsPage`).
  - **Áp dụng trên Sân bay (`BasicViewModules`) & Quốc gia**:
    + [`src/pages/AirportsPage.tsx`](src/pages/AirportsPage.tsx) (`603` dòng): Đổi `modules={StandardGridModules}` sang `modules={BasicViewModules}`, gỡ `pinned: 'left'` trên cột `AirPortCode` và thay bộ đo cục bộ bằng `useGridStageTelemetry` + `<GridTelemetryLine />`.
    + [`src/pages/CountriesPage.tsx`](src/pages/CountriesPage.tsx) (`357` dòng): Gắn `useGridStageTelemetry` + `<GridTelemetryLine />` bên dưới thanh tìm kiếm trong `toolbarSlot` (`space-y-2`) và bọc stage `ref={pageStageRef}` đo `.agv-grid-root`.

---
