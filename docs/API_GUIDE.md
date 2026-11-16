# Tài liệu Hướng dẫn Sử dụng API — Gridv3

Tài liệu tham chiếu đầy đủ cách sử dụng component bảng `<DataGrid />`, hệ thống module opt-in, API định nghĩa cột kiểu TanStack Table v8, các tính năng nâng cao Table-V2, giao diện đáp ứng PC ↔ Tablet ↔ Phone, điều khiển imperative và hệ thống UI Controls dùng chung của **Gridv3**.

---

## Mục lục
1. [Tổng quan Kiến trúc & Đường dẫn Import Tối ưu](#1-tổng-quan-kiến-trúc--đường-dẫn-import-tối-ưu)
2. [Bắt đầu nhanh (Quick Start)](#2-bắt-đầu-nhanh-quick-start)
3. [Hệ thống Module Opt-in (`modules={[...]}`) & Feature Flags](#3-hệ-thống-module-opt-in-modules--feature-flags)
4. [API Định nghĩa Cột (`ColumnHelper` & `DefaultColDef`)](#4-api-định-nghĩa-cột-columnhelper--defaultcoldef)
5. [Tham chiếu Props `<DataGrid<TRecord> />` & Phân trang](#5-tham-chiếu-props-datagridtrecord--phân-trang)
6. [4 Tính năng Nâng cao chuẩn Table-V2 (Cross Hover, Cell Span, Tree Data, Detail Row)](#6-4-tính-năng-nâng-cao-chuẩn-table-v2-cross-hover-cell-span-tree-data-detail-row)
7. [Cấu hình Giao diện Đáp ứng (`ResponsiveLayoutModule`: PC ↔ Tablet ↔ Phone)](#7-cấu-hình-giao-diện-đáp-ứng-responsivelayoutmodule-pc--tablet--phone)
8. [Điều khiển Imperative qua `gridRef` (`DataGridRef`) & Toolbar API](#8-điều-khiển-imperative-qua-gridref-datagridref--toolbar-api)
9. [Hệ thống UI Controls dùng chung (`src/components/ui`) & Chủ đề (`Theme`)](#9-hệ-thống-ui-controls-dùng-chung-srccomponentsui--chủ-đề-theme)

---

## 1. Tổng quan Kiến trúc & Đường dẫn Import Tối ưu

`<DataGrid<TRecord> />` dùng **1 API thống nhất** nhưng tự động phân nhánh thành 2 engine tùy theo `modules` và props truyền vào:

- **Basic View Engine (`BasicDataGridView`)**: Tự động kích hoạt khi chỉ bật `BasicViewModules` (`RowNumberModule`, `PaginationModule`, hoặc tắt cả 2) và không truyền prop/module nâng cao (`spanMethod`, `treeData`, `detailRow`, `gridRef`, cột group 2 tầng...). Chỉ nạp **10 file lõi** (hoặc **11 file** khi bật `PaginationModule`), ảo hóa cố định `CHUNK = 20` (`32px/dòng`), **không tải** `VirtualizedGrid`, bộ lọc, context menu, responsive hay `morphicons`.
- **Enterprise Engine (`DataGridEnterprise`)**: Tự động tải lười qua `React.lazy` khi bạn bật `StandardGridModules`, `AllEnterpriseModules` hoặc bất kỳ module/tính năng nâng cao nào.

### Bảng đường dẫn Import khuyến nghị

| Thành phần cần dùng | Đường dẫn Import | Ghi chú tối ưu bundle |
| --- | --- | --- |
| `<DataGrid />`, `DataGridProps`, `DataGridRef`, `DataGridToolbarApi` | `../components/grid/DataGrid` | Không kéo `DataGridEnterprise` khi chỉ dùng Basic View |
| `BasicViewModules`, `StandardGridModules`, `AllEnterpriseModules`, các `*Module` lẻ | `../components/grid/modules` | Chọn đúng module cần dùng |
| `createBasicColumnHelper`, `DefaultColDef`, `GridColumnDef`, `PaginationConfig` | `../components/grid/columns/normalizeColumns` | **Khuyên dùng cho Basic View** (tránh kéo `columnPresets`) |
| `createColumnHelper`, `createStandardDefaultColDef`, `formatCodeName`, `formatGridCurrency` | `../components/grid/columns` | Dùng cho trang Enterprise có cột `codeName`, `currency`, `twelveMonths` |
| `ALIGNMENTS`, `DATA_TYPES`, `EDITOR_TYPES`, `PIN_POSITIONS`, `SURFACE_THEMES`, `FILTER_OPS`, `GRID_LAYOUT_MODES`, `FORMULA_MODES` | `../components/grid/types` | Hằng số chuẩn và kiểu TypeScript |
| `NO_AUTOFILL_PROPS`, `DEFAULT_PAGE_SIZE`, `DEFAULT_PAGE_SIZE_OPTIONS` | `../components/grid/constants` | Hằng số phân trang & chặn autofill trình duyệt |
| `createAutoRowSpan`, `GridExternalPopupButtons` | `../components/grid` | Chỉ import khi trang có gộp ô / nút popup ngoài bảng |
| `formatGridNumber`, `formatGridDateValue` | `../components/grid/gridFormatUtils` | Hàm format số (`1.000`, `(500)`) & ngày (`DD/MM/YYYY`) dùng chung |
| `AdvButton`, `AdvSelect`, `AdvComboBoxEdit`, `AdvSearchLookUpEdit`, `AdvDatePicker`, `AdvDateRangePicker`, `Drawer` | `../components/ui` (hoặc từng file con) | Nếu cần nhẹ tối đa trên trang Basic, import trực tiếp từng control con |

### Khi cài dưới dạng Package độc lập (`gridv3`)

Cài đặt trực tiếp từ nhánh `release` trên GitHub (không kéo mã nguồn `src/`):

```bash
# npm
npm install github:stylus0326/ADVGrid#release

# pnpm
pnpm add github:stylus0326/ADVGrid#release

# yarn
yarn add stylus0326/ADVGrid#release
```

Hoặc cài offline từ file nén `.tgz`:

```bash
npm install ./duong-dan/gridv3-1.0.0.tgz
```

Sau khi cài đặt, nạp CSS cô lập 1 lần tại entry ứng dụng (`import 'gridv3/styles.css'`):

| Entry Point | Nội dung Export chính | Khi nào dùng |
| --- | --- | --- |
| `'gridv3'` | `DataGrid`, presets & 23 `*Module`, `createBasicColumnHelper`, types, constants, `formatGridNumber`/`formatGridDateValue`, theme helpers | Dùng mặc định; giữ gói Basic View siêu nhẹ (chỉ tải `DataGridEnterprise` lazy khi cần) |
| `'gridv3/columns'` | `createColumnHelper`, `createStandardDefaultColDef`, `formatCodeName`, `formatGridCurrency`, preset `twelveMonths`/`chart12m`/`formula12m` | Khi khai báo cột phân tích nâng cao cho bảng Standard / Enterprise |
| `'gridv3/grid'` | Tái xuất toàn bộ `'gridv3'` + `'gridv3/columns'` + `createAutoRowSpan`, `buildTreeForest`, `GridExternalPopupButtons` | Khi dùng tính năng Table-V2 (`CellSpan`, `TreeData`) hoặc nút toolbar ngoài |
| `'gridv3/ui'` | `AdvButton`, `AdvSelect`, `AdvComboBoxEdit`, `AdvSearchLookUpEdit`, `AdvDatePicker`, `AdvDateRangePicker`, `Drawer`, `controlFocus` | Khi tái sử dụng bộ UI controls chuẩn theme ở form/filter ngoài bảng |
| `'gridv3/themes'` | `SURFACE_THEMES`, `LIGHT_THEME_TOKENS`, `DARK_THEME_TOKENS`, `getThemeClass`, `getThemeTokens` | Khi đọc token hoặc đồng bộ giao diện Sáng/Tối |
| `'gridv3/styles.css'` | Stylesheet cô lập toàn bộ token `--agv-*`, Grid, Popups và Controls (không ép `html/body/#root` hay Preflight toàn cục) | Import 1 lần tại `main.tsx` / entry của Host App |

---

## 2. Bắt đầu nhanh (Quick Start)

### Mẫu 1: Bảng Basic View-Only gọn nhẹ nhất

Phù hợp cho trang tra cứu danh mục lớn chỉ cần xem dữ liệu, có STT, phân trang và bộ lọc đặt phía ngoài bảng:

```tsx
import React, { useMemo } from 'react';
import { DataGrid } from '../components/grid/DataGrid';
import { BasicViewModules } from '../components/grid/modules';
import {
  createBasicColumnHelper,
  type DefaultColDef,
} from '../components/grid/columns/normalizeColumns';
import { ALIGNMENTS, DATA_TYPES, type SurfaceTheme } from '../components/grid/types';

interface AirportRow {
  AirPortCode: string;
  AirPortNameVi: string;
  CountryCode: string;
  SortOrder: number;
}

const col = createBasicColumnHelper<AirportRow>();

export function BasicAirportsTable({
  rows,
  loading,
  surfaceTheme,
}: {
  rows: AirportRow[];
  loading?: boolean;
  surfaceTheme: SurfaceTheme;
}) {
  const columns = useMemo(
    () => [
      col.accessor('AirPortCode', {
        header: 'Mã IATA',
        size: 92,
        meta: {
          align: ALIGNMENTS.CENTER,
          dataType: DATA_TYPES.TEXT,
          className: 'agv-cell-code',
        },
      }),
      col.accessor('AirPortNameVi', {
        header: 'Tên sân bay',
        size: 260,
        meta: { align: ALIGNMENTS.LEFT, dataType: DATA_TYPES.TEXT },
      }),
      col.accessor('CountryCode', {
        header: 'Quốc gia',
        size: 96,
        meta: {
          align: ALIGNMENTS.CENTER,
          dataType: DATA_TYPES.TEXT,
          className: 'agv-cell-code',
        },
      }),
      col.accessor('SortOrder', {
        header: 'Thứ tự',
        size: 90,
        meta: { align: ALIGNMENTS.RIGHT, dataType: DATA_TYPES.NUMBER },
      }),
    ],
    []
  );

  const defaultColDef = useMemo<DefaultColDef<AirportRow>>(
    () => ({ minSize: 72 }),
    []
  );

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <DataGrid<AirportRow>
        gridId="demo_airports_basic"
        modules={BasicViewModules}
        data={rows}
        columns={columns}
        defaultColDef={defaultColDef}
        getRowId={(r) => r.AirPortCode}
        pagination={{ defaultPageSize: 50 }} // Truyền pagination={false} để gộp hết không phân trang
        loading={loading}
        surfaceTheme={surfaceTheme}
        emptyText="Chưa có dữ liệu sân bay."
      />
    </div>
  );
}
```

### Mẫu 2: Bảng B2B Tiêu chuẩn / Enterprise (Server Paging + Thanh công cụ mở rộng)

```tsx
import React, { useMemo, useState } from 'react';
import { DataGrid, type DataGridToolbarApi } from '../components/grid/DataGrid';
import { GridExternalPopupButtons } from '../components/grid/GridExternalPopupButtons';
import {
  ColumnChooserModule,
  QueryBuilderModule,
  StandardGridModules,
} from '../components/grid/modules';
import {
  createColumnHelper,
  createStandardDefaultColDef,
} from '../components/grid/columns';
import { ALIGNMENTS, DATA_TYPES, type SurfaceTheme } from '../components/grid/types';

interface CountryRow {
  CountryCode: string;
  CountryNameVi: string;
  ContinentCode: string;
}

const col = createColumnHelper<CountryRow>();
const COUNTRY_MODULES = [...StandardGridModules, QueryBuilderModule, ColumnChooserModule];

export function StandardCountriesTable({
  records,
  total,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  surfaceTheme,
}: {
  records: CountryRow[];
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (p: number) => void;
  onPageSizeChange: (s: number) => void;
  surfaceTheme: SurfaceTheme;
}) {
  const columns = useMemo(
    () => [
      col.accessor('CountryCode', {
        header: 'Mã ISO',
        size: 96,
        pinned: 'left',
        meta: {
          align: ALIGNMENTS.CENTER,
          dataType: DATA_TYPES.TEXT,
          className: 'agv-cell-code',
        },
      }),
      col.accessor('CountryNameVi', {
        header: 'Tên quốc gia',
        size: 240,
      }),
      col.accessor('ContinentCode', {
        header: 'Châu lục',
        size: 110,
        meta: { align: ALIGNMENTS.CENTER },
      }),
    ],
    []
  );

  const defaultColDef = useMemo(() => createStandardDefaultColDef<CountryRow>(), []);

  const toolbarSlot = (api: DataGridToolbarApi) => (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <span className="text-xs text-muted-foreground">Bộ lọc nhanh & công cụ bảng:</span>
      <GridExternalPopupButtons api={api} />
    </div>
  );

  return (
    <DataGrid<CountryRow>
      gridId="b2b_countries"
      title="Quản lý quốc gia"
      description="Danh mục quốc gia theo chuẩn ISO."
      modules={COUNTRY_MODULES}
      data={records}
      columns={columns}
      defaultColDef={defaultColDef}
      getRowId={(r) => r.CountryCode}
      pagination={{
        page,
        pageSize,
        serverTotal: total,
        onPageChange,
        onPageSizeChange,
      }}
      toolbarSlot={toolbarSlot}
      surfaceTheme={surfaceTheme}
    />
  );
}
```

---

## 3. Hệ thống Module Opt-in (`modules={[...]}`) & Feature Flags

Khi **không** truyền `modules`, hệ thống tự áp dụng `BasicViewModules` (chỉ có STT và phân trang khi truyền `pagination`). Bạn có thể chọn preset hoặc kết hợp từng module lẻ.

### 3 Preset dựng sẵn

| Preset | Số lượng | Bao gồm các module |
| --- | --- | --- |
| `BasicViewModules` | 2 | `RowNumberModule`, `PaginationModule` |
| `StandardGridModules` | 14 | `RowNumberModule`, `PaginationModule`, `SummaryRowModule`, `ColumnPinningModule`, `CenterDockModule`, `RowPinningModule`, `SortingModule`, `FilteringModule`, `ColumnSizingModule`, `ColumnVisibilityModule`, `RowGroupingModule`, `ContextMenuModule`, `FloatingToolbarModule`, `ResponsiveLayoutModule` |
| `AllEnterpriseModules` | 23 | Toàn bộ 14 module của `StandardGridModules` + `QueryBuilderModule`, `RowSelectionModule`, `CellEditingModule`, `ColumnChooserModule`, `FullscreenModule`, `CrossHoverModule`, `CellSpanModule`, `TreeDataModule`, `RowDetailModule` |

### Danh sách 23 Module lẻ & Feature Flags ghi đè

| Module (`modules={[...]}`) | Chức năng | Prop Boolean ghi đè trên `<DataGrid />` |
| --- | --- | --- |
| `RowNumberModule` | Cột STT (`col_stt`) đầu bảng | `enableRowNumber` |
| `PaginationModule` | Thanh phân trang đáy bảng (`GridStatusBar`) | `enableStatusBar`, `showStatusBar`, `pagination` |
| `SummaryRowModule` | Tổng hợp cột số (`columnSums`) | `enableSummary`, `showSummaryRow` |
| `ColumnPinningModule` | Ghim cột Trái / Phải | `enableColumnPinning` |
| `CenterDockModule` | Ghim cột kiểu Dock Giữa (tự dính Trái/Phải khi cuộn) | `enableCenterDock` |
| `RowPinningModule` | Ghim dòng cố định trên đầu bảng (`pinnedTopRowData`) | `enableRowPinning` |
| `SortingModule` | Sắp xếp 1 cột & đa cột (`Ctrl`/`Shift` + Click) | `enableSorting`, `enableMultiSort` |
| `FilteringModule` | Filter Row nội tuyến, Header Checklist Filter & Quick Search | `enableFiltering`, `showFilterRow`, `enableHeaderFilter`, `enableQuickSearch` |
| `QueryBuilderModule` | Trình tạo truy vấn điều kiện lồng AND/OR | `enableQueryBuilder` |
| `RowSelectionModule` | Cột checkbox chọn nhiều dòng (`col_chk`) | `enableSelection` |
| `RowGroupingModule` | Gom nhóm dữ liệu theo cột (kèm Sticky Group Header) | `enableGrouping` |
| `CellEditingModule` | Sửa dữ liệu trực tiếp trong ô (`GridInCellEditor`) | `enableCellEditing` |
| `ColumnSizingModule` | Kéo giãn độ rộng cột & kéo thả đổi thứ tự cột | `enableColumnResize`, `enableColumnReorder` |
| `ColumnVisibilityModule` | Ẩn/hiện cột qua Context Menu (kèm ẩn cột rỗng) | `enableColumnHide` |
| `ColumnChooserModule` | Popup chọn, sắp xếp & ghim cột | `enableColumnChooser` |
| `FullscreenModule` | Phóng to toàn màn hình từ thanh công cụ | `enableFullscreen` |
| `ContextMenuModule` | Menu chuột phải trên Header / Band / Row / Group | `enableContextMenu` |
| `FloatingToolbarModule` | Thanh công cụ nổi / API popup công cụ bảng | `enableFloatingToolbar` |
| `ResponsiveLayoutModule` | Tự động chuyển PC ↔ Tablet (`tabletGroups`) ↔ Phone (`phoneCard`) | `enableResponsiveLayout` |
| `CrossHoverModule` | Highlight đồng thời hàng + cột + giao điểm đang rê chuột | `enableCrossHover`, `crossHoverHighlightHeader` |
| `CellSpanModule` | Gộp ô ngang/dọc (`colSpan`, `rowSpan`, `spanMethod`) | `enableCellSpan` |
| `TreeDataModule` | Dữ liệu dạng cây phân cấp lồng hoặc phẳng | `enableTreeData` |
| `RowDetailModule` | Mở rộng chi tiết từng dòng (`detailRow`) | `enableRowDetail` |

Ngoài ra còn có 3 cờ điều khiển khung nhìn chung:
- `autoHeight?: boolean`: Co chiều cao bảng theo nội dung (khi `autoHeight={true}` và không giới hạn `height`/`maxHeight`, bảng dùng **Window Scroll**).
- `maxHeight?: number | string`: Giới hạn chiều cao tối đa khi bật `autoHeight`.
- `persistState?: boolean`: Tự động lưu thứ tự cột, độ rộng, cột ẩn, ghim cột, sắp xếp, gom nhóm vào `localStorage` theo `gridId` (tự động bật khi dùng module Pinning/Sorting/Sizing/Visibility/Grouping trừ khi đặt `persistState={false}`).

---

## 4. API Định nghĩa Cột (`ColumnHelper` & `DefaultColDef`)

### Khởi tạo Helper
- **Basic View-Only** (nhẹ nhất): `const col = createBasicColumnHelper<TRow>();` — có `col.accessor`, `col.display`, `col.group`.
- **Standard / Enterprise**: `const col = createColumnHelper<TRow>();` — có đầy đủ phương thức cơ bản cộng thêm 5 preset chuyên dụng: `codeName`, `currency`, `formula12m`, `chart12m`, `twelveMonths`.

### Các phương thức khai báo cột

1. **`col.accessor(accessorKey, options)` / `col.accessor(accessorFn, { id, ...options })`**
   - Hỗ trợ `accessorKey` phẳng (hoặc chấm lồng nhau kiểu `'user.profile.name'`).
   - Hỗ trợ `accessorFn: (row, index) => value` (bắt buộc kèm `id`).
   - Tuỳ chọn chính: `id`, `header` (chuỗi hoặc `(ctx) => ReactNode`), `size` (`150` mặc định), `minSize`, `maxSize`, `pinned?: 'left' | 'right' | 'center' | false`, `cell?: (ctx) => ReactNode`, `enableSorting`, `enableColumnFilter`, `enableGlobalFilter`, `enableResizing`, `enablePinning`, `enableHiding`, `enableGrouping`, `enableEditing`, `wrapText`, `colSpan`, `rowSpan`, `meta`.

2. **`col.display({ id, header, cell, ... })`**: Cột hiển thị tùy biến (nút hành động, trạng thái) không gắn trực tiếp field.

3. **`col.group({ id, header, isToggleable, isCollapsed, isAtomic, columns })`**: Tạo header 2 tầng chứa danh sách cột con.
   - `isToggleable`: Cho phép bấm nút thu gọn/mở rộng băng cột.
   - `isAtomic`: Ghim/ẩn cả nhóm như một khối.

4. **5 Preset cột Enterprise (`createColumnHelper` & `createStandardDefaultColDef`)**:
   - `createStandardDefaultColDef<T>()`: tự hiển thị `—` mờ khi ô rỗng và tự format cột `DATA_TYPES.DATE` theo `DD/MM/YYYY` (`HH:mm` nếu `showTime`).
   - `col.codeName({ id, header, code, name, pattern, separator, fallback })`: tự ghép Mã & Tên (`'code-dash-name'` mặc định `" — "` hoặc `'name-paren-code'` `"Tên (Mã)"`) và tự khử trùng khi Mã === Tên (không phân biệt hoa/thường).
   - `col.currency(accessorKeyOrFn, { header, suffix, formatValue, highlightNegative })`: tự căn phải, kiểu số, mặc định hậu tố `' đ'`, số âm hiển thị màu cảnh báo `var(--agv-danger)`.
   - `col.formula12m(options)` / `col.chart12m(options)` / `col.twelveMonths({ getMonths, formatValue, formulaColumn, chartColumn })`: tạo nhanh cặp cột công thức (`MAX` / `MIN` / `SUM` / `AVG`) và biểu đồ xu hướng 12 tháng (`LazyTwelveMonthChartCell`).

### Thuộc tính `meta: GridColumnMeta<T>`

| Trường | Kiểu | Mô tả |
| --- | --- | --- |
| `align` | `ALIGNMENTS.LEFT \| CENTER \| RIGHT` | Canh lề nội dung ô |
| `dataType` | `DATA_TYPES.TEXT \| NUMBER \| DATE \| TIME \| SYSTEM` | Xác định format hiển thị & bộ toán tử lọc phù hợp |
| `className` | `string` | Class CSS bổ sung (dùng `'agv-cell-code'` cho mã IATA/ISO/Code để căn chữ in hoa `tabular-nums`) |
| `cellPadding` | `string` | Ghi đè padding ô (vd: `'none'`, `'px-1'`) |
| `editorType` | `EDITOR_TYPES.*` | `'text' \| 'number' \| 'date' \| 'daterange' \| 'time' \| 'combobox' \| 'lookup'` |
| `editorOptions` | `any` | Danh sách tùy chọn cho editor `combobox` / `lookup` |
| `showTime` | `boolean` | Hiển thị thêm `HH:mm` với cột `DATE` |
| `isDateRange` | `boolean` | Xử lý giá trị chuỗi dải ngày (`from..to` / `from - to`) |
| `minDate` / `maxDate` | `string` | Giới hạn khoảng ngày trong bộ lọc & lịch (`YYYY-MM-DD`) |
| `wrapText` | `boolean` | Cho phép xuống dòng khi bật `dynamicRowHeight` |
| `disableHeaderContextMenu` | `boolean` | Tắt menu chuột phải trên header cột |
| `disableContextMenu` | `boolean` | Tắt menu chuột phải trên ô dữ liệu |
| `colSpan` / `rowSpan` | `(params: CellSpanParams<T>) => number` | Hàm tính gộp cột/dòng ở cấp độ cột |

---

## 5. Tham chiếu Props `<DataGrid<TRecord> />` & Phân trang

| Prop | Kiểu | Mặc định | Mô tả |
| --- | --- | --- | --- |
| `gridId` | `string` | `'default'` | ID duy nhất để lưu cấu hình cột vào `localStorage` |
| `data` (`rows` / `rowData`) | `TRecord[]` | `[]` | Mảng dữ liệu đầu vào (3 tên alias tương đương) |
| `columns` (`columnDefs`) | `readonly GridColumnDef<TRecord>[]` | — | Danh sách cấu hình cột |
| `defaultColDef` | `DefaultColDef<TRecord>` | — | Cấu hình mặc định gộp cho mọi cột |
| `getRowId` (`getRowKey` / `rowKey`) | `(row, idx) => string \| number \| keyof TRecord` | Tự dò `_rowKey`/`id`/`key`/`code` | Khóa định danh duy nhất cho mỗi dòng (khuyên luôn truyền rõ) |
| `modules` | `readonly GridModule[]` | `BasicViewModules` | Danh sách module opt-in |
| `pagination` | `boolean \| PaginationConfig` | theo module | `false` để tắt phân trang; truyền object để cấu hình Client hoặc Server Paging |
| `pinnedTopRowData` | `TRecord[]` | — | Các dòng ghim cố định phía trên đầu bảng (kích hoạt Enterprise Engine) |
| `onRowClick` | `(row: TRecord, index: number) => void` | — | Callback khi nhấp chuột chọn một dòng |
| `onRowDetail` | `(row: TRecord, index: number) => void` | — | Callback kích hoạt mở chi tiết ngoài (hoặc nút xem chi tiết trên Phone Card) |
| `title` / `description` | `string` | — | Tiêu đề & mô tả trong Header Banner phía trên bảng |
| `toolbarSlot` | `ReactNode \| ((api: DataGridToolbarApi) => ReactNode)` | — | Chèn bộ lọc hoặc thanh công cụ (dùng function API sẽ tải Enterprise Engine) |
| `loading` / `refreshing` | `boolean` | `false` | `loading` hiện trạng thái đang tải khi bảng trống hoặc badge nổi; `refreshing` hiện badge "Đang cập nhật..." |
| `error` / `onRetry` | `string \| null` / `() => void` | — | Hiển thị thông báo lỗi kèm nút `Thử lại` (`variant="default"`) |
| `emptyText` | `string` | `'Không tìm thấy dữ liệu phù hợp.'` | Thông báo khi không có dòng dữ liệu |
| `height` / `style` / `className` | `number \| string` / `CSSProperties` / `string` | `flex-1 min-h-0` | Chiều cao khung bảng (khi không truyền `height`, cần bọc trong container `flex flex-col flex-1 min-h-0`) |
| `dynamicRowHeight` / `estimatedRowHeight` / `getRowHeight` | `boolean` / `number` / `(row, idx) => number` | `false` / `32` | Dòng cao động PC theo nội dung (`wrapText`) hoặc hàm tính chiều cao tùy biến |
| `overscanRows` | `number` | `5` | Số dòng đệm render trước ở trên/dưới vùng nhìn thấy |
| `scrollbarAlwaysOn` | `boolean` | `false` | Luôn hiển thị thanh cuộn overlay thay vì chỉ khi hover/cuộn |
| `surfaceTheme` | `SURFACE_THEMES.LIGHT \| DARK` | `'light'` | Chủ đề sáng/tối đồng bộ biến CSS `--agv-*` |

### Cơ chế Phân trang (`PaginationConfig`)
- **Client Paging** (Grid tự cắt trang từ `data`): truyền `pagination={true}` hoặc `pagination={{ defaultPageSize: 50, pageSizeOptions: [20, 50, 100, 200] }}` và **không** truyền `onPageChange` / `onPageSizeChange`.
- **Server Paging** (Backend cắt trang): truyền đầy đủ `page`, `pageSize`, `serverTotal` (hoặc `total`), `onPageChange`, `onPageSizeChange`. Grid sẽ giữ nguyên mảng `data` của trang hiện tại và tự tính STT toàn cục theo `(page - 1) * pageSize + index + 1`.

---

## 6. 4 Tính năng Nâng cao chuẩn Table-V2 (Cross Hover, Cell Span, Tree Data, Detail Row)

Các tính năng này lấy cảm hứng từ Element Plus `el-table-v2`, tự động hoạt động qua `DataGridEnterprise`:

### 6.1. Cross Hover (`CrossHoverModule`)
Highlight đồng thời hàng ngang, cột dọc và ô giao điểm khi di chuột:
```tsx
<DataGrid
  modules={[...StandardGridModules, CrossHoverModule]}
  enableCrossHover={true}
  crossHoverHighlightHeader={true}
  data={rows}
  columns={columns}
/>
```

### 6.2. Cell Span — Colspan / Rowspan / Gộp 2×2 (`CellSpanModule`)
Có 2 cách khai báo (hoặc kết hợp):
1. **Dùng hàm `createAutoRowSpan` ở cột** để tự động gộp các ô liền kề trùng giá trị:
   ```tsx
   import { CellSpanModule, createAutoRowSpan } from '../components/grid';

   const regionCol = col.accessor('region', {
     header: 'Khu vực',
     size: 130,
     meta: {
       rowSpan: createAutoRowSpan<SalesRecord>('region', {
         maxSpan: 32, // Giới hạn lookback bảo toàn tốc độ cuộn ảo O(1)
         canMerge: (row) => !row.isSummary,
       }),
     },
   });
   ```
2. **Dùng prop `spanMethod` tổng quát** trả về `{ rowSpan, colSpan }` hoặc `[rowSpan, colSpan]` (ô bị gộp phủ phải trả về `[0, 0]` hoặc `[0, 1]`):
   ```tsx
   const spanMethod: GridSpanMethod<SpanRecord> = ({ row, rowIndex, column }) => {
     if (row.rowKind === 'summary') {
       if (column.key === 'region') return { rowSpan: 1, colSpan: 3 };
       if (column.key === 'department' || column.key === 'assignee') return [0, 0];
     }
     if (row.rowKind === 'matrix' && column.key === 'q1Target') {
       if (rowIndex % 2 === 0) return [2, 2]; // Ô neo gộp khối 2×2
       return [0, 0];
     }
   };

   <DataGrid modules={[RowNumberModule, CellSpanModule]} spanMethod={spanMethod} ... />
   ```

### 6.3. Tree Data (`TreeDataModule`)
Hỗ trợ cả **dữ liệu lồng** (`children` / `getSubRows`) và **dữ liệu phẳng** (`parentKeyField` / `rootParentValue`):
```tsx
<DataGrid<OrgNode>
  modules={[RowNumberModule, SortingModule, FilteringModule, TreeDataModule]}
  data={orgNodes}
  getRowId={(r) => r.id}
  treeData={{
    treeColumnKey: 'name',          // Cột hiển thị nút đóng/mở & thụt lề
    childrenField: 'children',      // Hoặc truyền parentKeyField: 'parentId' cho dữ liệu phẳng
    indentSize: 20,                 // Độ thụt lề (px) mỗi cấp
    defaultExpandedDepth: 1,        // Tự mở sẵn đến cấp 1
    filterMode: 'preserveAncestors', // Giữ cả nhánh cha khi lọc ('preserveAncestors' | 'strict')
    onRowExpand: ({ rowKey, expanded, depth }) => { ... },
  }}
/>
```

### 6.4. Detail Row (`RowDetailModule`)
Mở rộng hàng chi tiết ngay dưới dòng dữ liệu (hỗ trợ chiều cao cố định hoặc `'auto'` tự đo `ResizeObserver`):
```tsx
<DataGrid<OrderRecord>
  modules={[RowNumberModule, RowDetailModule]}
  data={orders}
  getRowId={(r) => r.id}
  detailRow={{
    height: 'auto',                 // Hoặc số px cố định (vd: 180)
    estimatedHeight: 160,
    accordion: true,                // Chỉ mở 1 dòng tại một thời điểm
    expandOnRowClick: false,        // Hoặc true để bấm vào cả hàng là mở
    defaultExpandedKeys: ['ord-1001'],
    canExpand: (row) => row.items.length > 0,
    renderDetail: ({ row, close }) => (
      <div className="p-3">
        <div className="flex justify-between items-center mb-2">
          <strong>Chi tiết đơn {row.orderCode}</strong>
          <AdvButton variant="ghost" size="sm" onClick={close}>Đóng</AdvButton>
        </div>
        {/* Nội dung chi tiết */}
      </div>
    ),
  }}
/>
```

---

## 7. Cấu hình Giao diện Đáp ứng (`ResponsiveLayoutModule`: PC ↔ Tablet ↔ Phone)

Khi dùng `ResponsiveLayoutModule` (đã có sẵn trong `StandardGridModules`), truyền thêm `tabletGroups` và `phoneCard` để tự động chuyển bố cục theo bề rộng màn hình (hoặc ép chế độ bằng prop `layoutMode="auto" | "pc" | "tablet" | "phone"`):

```tsx
import type { PhoneCardConfig, TabletColumnGroup } from '../components/grid/columns';

export const PARTNER_TABLET_GROUPS: TabletColumnGroup<PartnerRow>[] = [
  {
    id: 'tg_partner',
    header: 'Đại lý',
    minWidth: 210,
    lines: [
      { col: 'PartnerCode', join: ['PartnerNameDisplay'], emphasis: 'strong' },
      { col: 'ManagerUserCode', label: 'TK' },
      { col: 'CurrentBalance', label: 'Quỹ' },
    ],
  },
  {
    id: 'tg_creator',
    header: 'Người tạo / Ngày tạo',
    minWidth: 140,
    lines: [
      { col: 'CreatorDisplay', emphasis: 'strong' },
      { col: 'CreatedDateDisplay', emphasis: 'muted' },
    ],
  },
];

export const PARTNER_PHONE_CARD: PhoneCardConfig<PartnerRow> = {
  title: ['PartnerCode', 'PartnerNameDisplay'],
  badge: 'StatusLabel',
  summary: [
    { col: 'CurrentBalance', label: 'Quỹ' },
    { col: 'ManagerUserCode', label: 'TK' },
  ],
  details: ['PartnerPhone', 'SalesUserDisplay', 'PartnerEmail'],
  detailButtonLabel: 'Xem chi tiết', // Hoặc false để ẩn nút
};
```

> Lưu ý: Hệ thống thiết kế Tablet/Phone tuân thủ lưới `4px`, thẻ không có thanh cuộn bên trong và nút mở rộng/thu gọn card dùng `MorphChevronIcon`.

---

## 8. Điều khiển Imperative qua `gridRef` (`DataGridRef`) & Toolbar API

Khai báo `const gridRef = useRef<DataGridRef>(null)` và truyền `<DataGrid gridRef={gridRef} ... />` (khi truyền `gridRef`, bảng tự dùng `DataGridEnterprise`):

| Nhóm phương thức | Chữ ký hàm | Mô tả |
| --- | --- | --- |
| **Cuộn bảng** | `scrollToRow(rowIndex, behavior?)` | Cuộn đến đúng dòng (`'auto'` \| `'smooth'`) ở cả Container Scroll lẫn Window Scroll |
| | `scrollToChunk(chunkIndex, behavior?)` | Cuộn đến chunk chỉ định |
| | `getScrollContainer()` | Lấy phần tử DOM `.agv-scroll-viewport` |
| **Popup công cụ** | `openPopup(type, anchorEl)` | Mở `'search'` \| `'queryBuilder'` \| `'multiSort'` \| `'columnChooser'` |
| | `togglePopup(type, anchorEl)` | Bật/tắt popup tương ứng |
| | `closePopup()` | Đóng popup đang mở |
| **Tree Data** | `expandAllTree()` / `collapseAllTree()` | Mở rộng hoặc thu gọn toàn bộ cây |
| | `expandTreeToDepth(depth)` | Mở cây tới độ sâu mong muốn (`0`, `1`, `2`...) |
| | `toggleTreeRow(rowKey, forceExpanded?)` | Đóng/mở 1 node cây |
| **Detail Row** | `expandAllDetails()` / `collapseAllDetails()` | Mở rộng hoặc thu gọn tất cả dòng chi tiết |
| | `toggleDetailRow(rowKey, forceExpanded?)` | Đóng/mở chi tiết 1 dòng |

**Kết nối thanh công cụ ngoài bằng `DataGridToolbarApi`**: dùng `toolbarSlot={(api) => <GridExternalPopupButtons api={api} />}` hoặc đọc `api.state` (`activePopup`, `isQuickFilterActive`, `activeQueryRuleCount`, `visibleColumnCount`, `totalColumnCount`, `sortRuleCount`) để tự vẽ nút bấm riêng.

---

## 9. Hệ thống UI Controls dùng chung (`src/components/ui`) & Chủ đề (`Theme`)

### 9.1. Chuẩn 4 Phân loại Nút duy nhất (`AdvButton` / `Button`)
Mọi nút thao tác phải dùng `<AdvButton>` (hoặc `getButtonClass` từ `src/components/ui/controlFocus`) theo 4 biến thể chuẩn (`min-height >= 28px`, tuyệt đối không đặt viền đứt `border-dashed` hay chế nút thứ 5):

| `variant` | Nhóm nút | Ví dụ sử dụng |
| --- | --- | --- |
| `'default'` | Hành động chính / chốt xác nhận | `Áp dụng`, `Tìm kiếm`, `Đăng nhập`, `Xác nhận`, `Thử lại` |
| `'outline'` | Hành động tiêu chuẩn có khung viền | `Đăng xuất`, `Đóng`, `Đặt lại`, `Xem chi tiết`, nút mở công cụ (truyền `active={true}` để highlight nền accent chữ trắng) |
| `'ghost'` | Hành động phụ nội bộ, không viền | `+ Thêm điều kiện`, `Hiện tại`, `Cả ngày`, nút `< >` phân trang, nút `×` đóng popup |
| `'destructive'` | Hủy bỏ, xóa, làm sạch dữ liệu/bộ lọc | `Xóa`, `Xóa lọc`, `Hủy`, `Bỏ chọn`, `Xóa tất cả tiêu chí` |

Kích thước `size`: `'sm'` (`28px`), `'default'` (`36px` / `--control-height`), `'icon-sm'` (`28×28`), `'icon'` (`36×36`).

### 9.2. Các Control nhập liệu & Drawer hay dùng

```tsx
import {
  AdvButton,
  AdvSelect,
  AdvComboBoxEdit,
  AdvSearchLookUpEdit,
  AdvDatePicker,
  AdvDateRangePicker,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerBody,
  DrawerFooter,
} from '../components/ui';
import { NO_AUTOFILL_PROPS } from '../components/grid/constants';
import { CONTROL_INPUT_MD_CLASS } from '../components/ui/controlFocus';
```

- **Input `<input>` thuần**: Luôn spread `{...NO_AUTOFILL_PROPS}` và dùng class `CONTROL_INPUT_MD_CLASS` (`36px`) hoặc `CONTROL_INPUT_SM_CLASS` (`28px`) để chặn autofill trình duyệt và đồng bộ viền/focus theo theme.
- **`<AdvSelect />`**: Dropdown chọn 1 giá trị ảo hóa (`options`, `value`, `onChange`, `size="sm" | "md"`, `theme`).
- **`<AdvComboBoxEdit />`**: Combobox cho phép tìm nhanh / nhập tự do hoặc khóa danh sách (`allowCustomInput={false}`).
- **`<AdvSearchLookUpEdit />`**: Hộp tra cứu danh mục đa cột có thanh tìm kiếm & filter từng cột (`dataSource`, `valueMember`, `displayMember`, `columns`, `multiSelect`).
- **`<AdvDatePicker />` & `<AdvDateRangePicker />`**: Bộ chọn ngày đơn hoặc khoảng Từ → Đến hỗ trợ preset nhanh (`Hôm nay`, `Tháng này`...), nhập tay `DD/MM/YYYY`, có tuỳ chọn `showTime`, `showPreset`, `size="xs" | "sm" | "default" | "md"`.
- **`<Drawer open={open} onOpenChange={setOpen} surfaceTheme={theme}>`**: Ngăn kéo trượt từ đáy (tự khóa cuộn Grid, hỗ trợ vuốt xuống hoặc nhấn `Esc` để đóng).

### 9.3. Hệ thống Chủ đề & CSS Variables (`Theme Consistency`)
- Truyền `surfaceTheme={SURFACE_THEMES.LIGHT}` (`'light'`) hoặc `SURFACE_THEMES.DARK` (`'dark'`) cho `<DataGrid />`, các UI controls và `<Drawer />`.
- Toàn bộ giao diện tự phát triển thêm **bắt buộc** dùng CSS variables chuẩn hệ thống trong [`src/styles/design-tokens.css`](../src/styles/design-tokens.css) thay cho màu cứng (`#fff`, `bg-white`, `text-slate-700`...):
  - Bề mặt & viền: `var(--agv-bg-root)`, `var(--agv-bg-card)`, `var(--agv-bg-header)`, `var(--agv-bg-popup)`, `var(--agv-bg-hover)`, `var(--agv-bg-selected)`, `var(--agv-border)`, `var(--agv-border-strong)`
  - Chữ & trạng thái: `var(--agv-text-main)`, `var(--agv-text-muted)`, `var(--agv-accent)`, `var(--agv-accent-text)`, `var(--agv-danger)`, `var(--agv-danger-bg)`
