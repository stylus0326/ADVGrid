# gridv3

Thư viện bảng dữ liệu React hiệu năng cao tích hợp kiến trúc module opt-in (**Basic View** siêu nhẹ tách riêng khỏi **Enterprise Engine** tải lười `React.lazy`), ảo hóa dòng cố định `CHUNK = 20`, chủ đề Sáng/Tối chuẩn CSS variables (`--agv-*`) và bộ UI controls dùng chung (`AdvButton`, `AdvSelect`, `AdvComboBoxEdit`, `AdvSearchLookUpEdit`, `AdvDatePicker`, `AdvDateRangePicker`, `Drawer`).

- **0 runtime dependencies** kèm theo (chỉ yêu cầu `react` & `react-dom` từ ứng dụng chủ).
- **CSS cô lập hoàn toàn**: không ép Tailwind Preflight toàn cục hay `html, body, #root { overflow: hidden }` lên ứng dụng chủ.
- **Bảo vệ mã nguồn**: nhánh `release` chỉ phát hành bản build nén `dist-lib/`, `.d.ts` và tài liệu (không chứa `src/`).

---

## Yêu cầu hệ thống

- Node.js `>= 18`
- `react`: `^18.0.0 || ^19.0.0`
- `react-dom`: `^18.0.0 || ^19.0.0`

---

## Hướng dẫn Cài đặt

### Cách 1: Cài trực tiếp từ nhánh `release` trên GitHub (Khuyên dùng)

Nhánh `release` chỉ chứa bản build hoàn chỉnh (`dist-lib/`), sẵn sàng cài đặt trực tiếp mà không lộ mã nguồn `src/`:

```bash
# npm
npm install github:stylus0326/ADVGrid#release

# pnpm
pnpm add github:stylus0326/ADVGrid#release

# yarn
yarn add stylus0326/ADVGrid#release
```

> **Lưu ý khi repo đặt ở chế độ Private:** Máy cài đặt cần đăng nhập sẵn GitHub qua SSH key hoặc Git Credential Manager có quyền đọc kho `stylus0326/ADVGrid`.

### Cách 2: Cài từ file đóng gói `.tgz` (Offline / nội bộ)

```bash
npm install ./duong-dan/gridv3-1.0.0.tgz
```

### Cách 3: Cập nhật phiên bản mới từ Git

```bash
# npm
npm update gridv3

# pnpm
pnpm up gridv3
```

---

## Hướng dẫn Sử dụng từng bước

### Bước 1: Nạp Stylesheet cô lập 1 lần tại file gốc (`main.tsx` hoặc `App.tsx`)

```tsx
import 'gridv3/styles.css';
```

> Lưu ý để `<DataGrid />` tự co giãn đúng trong layout: bọc bảng trong container có chiều cao xác định (ví dụ `style={{ height: 480, display: 'flex', flexDirection: 'column' }}` hoặc class flex `flex-1 min-h-0 flex flex-col`). Hoặc truyền `autoHeight={true}` để dùng chế độ cuộn theo nội dung / Window Scroll.

### Bước 2: Bảng Basic View-Only siêu nhẹ (`BasicViewModules`)

Dùng cho danh mục chỉ cần hiển thị nhanh (STT + ảo hóa `CHUNK = 20` + tùy chọn phân trang), không tải khối lọc/menu/responsive/morphicons:

```tsx
import React, { useMemo } from 'react';
import {
  DataGrid,
  BasicViewModules,
  createBasicColumnHelper,
  ALIGNMENTS,
  DATA_TYPES,
  SURFACE_THEMES,
} from 'gridv3';

interface AirportRow {
  AirPortCode: string;
  AirPortNameVi: string;
  CountryCode: string;
  SortOrder: number;
}

const col = createBasicColumnHelper<AirportRow>();

export function BasicAirportsTable({ rows }: { rows: AirportRow[] }) {
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
        meta: { align: ALIGNMENTS.CENTER, className: 'agv-cell-code' },
      }),
      col.accessor('SortOrder', {
        header: 'Thứ tự',
        size: 90,
        meta: { align: ALIGNMENTS.RIGHT, dataType: DATA_TYPES.NUMBER },
      }),
    ],
    []
  );

  return (
    <div style={{ height: 480, display: 'flex', flexDirection: 'column' }}>
      <DataGrid<AirportRow>
        gridId="basic_airports"
        modules={BasicViewModules}
        data={rows}
        columns={columns}
        getRowId={(r) => r.AirPortCode}
        pagination={{ defaultPageSize: 50 }} // Hoặc pagination={false} để gộp hết dòng
        surfaceTheme={SURFACE_THEMES.LIGHT}
        emptyText="Chưa có dữ liệu phù hợp."
      />
    </div>
  );
}
```

### Bước 3: Bảng Standard / Enterprise B2B (Phân trang Server + Thanh công cụ mở rộng)

Khi cần sắp xếp đa cột, filter row, ghim cột (`pinned: 'left'`), chọn cột, Query Builder hoặc responsive PC ↔ Tablet ↔ Phone:

```tsx
import React, { useMemo, useState } from 'react';
import {
  DataGrid,
  GridExternalPopupButtons,
  StandardGridModules,
  QueryBuilderModule,
  ColumnChooserModule,
  createColumnHelper,
  createStandardDefaultColDef,
  ALIGNMENTS,
  DATA_TYPES,
  SURFACE_THEMES,
  type DataGridToolbarApi,
} from 'gridv3/grid';

interface CountryRow {
  CountryCode: string;
  CountryNameVi: string;
  ContinentCode: string;
}

const col = createColumnHelper<CountryRow>();
const MODULES = [...StandardGridModules, QueryBuilderModule, ColumnChooserModule];

export function CountriesEnterpriseTable({
  records,
  total,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: {
  records: CountryRow[];
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (p: number) => void;
  onPageSizeChange: (s: number) => void;
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
      col.accessor('CountryNameVi', { header: 'Tên quốc gia', size: 240 }),
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
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
      <span>Công cụ bảng:</span>
      <GridExternalPopupButtons api={api} />
    </div>
  );

  return (
    <div style={{ height: 540, display: 'flex', flexDirection: 'column' }}>
      <DataGrid<CountryRow>
        gridId="b2b_countries"
        title="Quản lý quốc gia"
        modules={MODULES}
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
        surfaceTheme={SURFACE_THEMES.LIGHT}
      />
    </div>
  );
}
```

### Bước 4: Dùng Bộ UI Controls & Chủ đề Sáng/Tối (`gridv3/ui`)

Mọi nút thao tác dùng `<AdvButton>` theo đúng 4 phân loại (`variant="default" | "outline" | "ghost" | "destructive"`):

```tsx
import React, { useState } from 'react';
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
} from 'gridv3/ui';
import { SURFACE_THEMES } from 'gridv3';

export function FilterControlsSample() {
  const [theme, setTheme] = useState(SURFACE_THEMES.LIGHT);
  const [status, setStatus] = useState('all');
  const [range, setRange] = useState({ from: '', to: '' });

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
      <AdvSelect
        value={status}
        onChange={setStatus}
        options={[
          { value: 'all', label: 'Tất cả trạng thái' },
          { value: 'active', label: 'Hoạt động' },
        ]}
        size="md"
        width={180}
        theme={theme}
      />

      <AdvDateRangePicker
        from={range.from}
        to={range.to}
        onChange={(next) => setRange({ from: next.from, to: next.to })}
        size="md"
        theme={theme}
      />

      <AdvButton variant="default" size="default">
        Tìm kiếm
      </AdvButton>
      <AdvButton
        variant="outline"
        size="default"
        onClick={() =>
          setTheme((prev) =>
            prev === SURFACE_THEMES.LIGHT ? SURFACE_THEMES.DARK : SURFACE_THEMES.LIGHT
          )
        }
      >
        Đổi theme
      </AdvButton>
      <AdvButton variant="destructive" size="default" onClick={() => setRange({ from: '', to: '' })}>
        Xóa lọc
      </AdvButton>
    </div>
  );
}
```

---

## Bảng Tổng hợp 6 Subpath Exports

| Entry Point | Nội dung chính | Mục đích |
| --- | --- | --- |
| `gridv3` | `DataGrid`, 3 preset & 23 `*Module`, `createBasicColumnHelper`, types, constants, theme helpers | Mặc định cho dự án dùng Basic View siêu nhẹ (Enterprise tải lười khi cần) |
| `gridv3/columns` | `createColumnHelper`, `createStandardDefaultColDef`, `formatCodeName`, `formatGridCurrency`, preset `twelveMonths`/`chart12m`/`formula12m` | Khai báo cột nghiệp vụ nâng cao |
| `gridv3/grid` | Toàn bộ `gridv3` + `gridv3/columns` + `createAutoRowSpan`, `buildTreeForest`, `GridExternalPopupButtons` | Bảng Enterprise đầy đủ & tính năng Table-V2 (`CellSpan`, `TreeData`, `RowDetail`) |
| `gridv3/ui` | `AdvButton`, `AdvSelect`, `AdvComboBoxEdit`, `AdvSearchLookUpEdit`, `AdvDatePicker`, `AdvDateRangePicker`, `Drawer`, `controlFocus` | Tái sử dụng UI controls chuẩn theme ở form/filter |
| `gridv3/themes` | `SURFACE_THEMES`, `LIGHT_THEME_TOKENS`, `DARK_THEME_TOKENS`, `getThemeClass`, `getThemeTokens` | Đọc token & chuyển theme Sáng/Tối |
| `gridv3/styles.css` | Stylesheet cô lập toàn bộ token `--agv-*`, Grid, Popups và Controls (`gridv3/style.css` là alias tương thích) | Import 1 lần tại entry app chủ |

Xem hướng dẫn chi tiết toàn bộ API, Cell Span, Tree Data, Detail Row, `tabletGroups` / `phoneCard` và `gridRef` tại **[docs/API_GUIDE.md](docs/API_GUIDE.md)**.

---

## Quy trình Phát triển & Phát hành bản mới (Maintainer)

- `npm run dev` — Chạy Demo App phát triển nội bộ.
- `npm run build` — Kiểm tra TypeScript và build Demo App ra `dist/`.
- `npm run build:lib` — Build thư viện độc lập (ESM + `.d.ts` + CSS cô lập) ra `dist-lib/` (`sourcemap: false`, xóa comment).
- `npm run pack:lib` — Build thư viện và đóng gói thành `gridv3-1.0.0.tgz`.
- Để phát hành bản mới lên nhánh `release`, build `dist-lib/` mới nhất rồi cập nhật các file đóng gói (`dist-lib/`, `package.json`, `README.md`, `docs/API_GUIDE.md`) lên nhánh `release`.
