import React, { useMemo, useRef, useState } from 'react';
import {
  ALIGNMENTS,
  CellSpanModule,
  ColumnPinningModule,
  ColumnSizingModule,
  CrossHoverModule,
  DATA_TYPES,
  DataGrid,
  FilteringModule,
  PIN_POSITIONS,
  RowDetailModule,
  RowNumberModule,
  RowSelectionModule,
  SortingModule,
  TreeDataModule,
  createAutoRowSpan,
  type DataGridRef,
  type DetailRowContext,
  type GridColumnDef,
  type GridSpanMethod,
  type SurfaceTheme,
} from '../components/grid';
import { AdvButton } from '../components/ui/AdvButton';

export interface GridTableV2FeaturesDemoProps {
  surfaceTheme: SurfaceTheme;
}

type FeatureDemoTab = 'span' | 'tree' | 'detail';

interface SpanRecord {
  id: string;
  region: string;
  department: string;
  assignee: string;
  status: string;
  q1Target: number;
  q2Target: number;
  actualRevenue: number;
  notes: string;
  totalValue: number;
  rowKind?: 'summary' | 'matrix';
  summaryTitle?: string;
  matrixLabel?: string;
}

interface TreeOrgRecord {
  id: string;
  parentId?: string | null;
  code: string;
  name: string;
  lead: string;
  headcount: number;
  budget: number;
  status: string;
  children?: TreeOrgRecord[];
}

interface OrderLineItem {
  sku: string;
  name: string;
  qty: number;
  amount: number;
}

interface DetailOrderRecord {
  id: string;
  orderCode: string;
  customer: string;
  channel: string;
  createdAt: string;
  status: string;
  totalAmount: number;
  items: OrderLineItem[];
}

const TAB_ITEMS: Array<{ id: FeatureDemoTab; label: string }> = [
  { id: 'span', label: 'Gộp ô & Cross Hover' },
  { id: 'tree', label: 'Tree Data' },
  { id: 'detail', label: 'Detail View' },
];

const SPAN_ROWS: SpanRecord[] = [
  {
    id: 'sp-01',
    region: 'Miền Bắc',
    department: 'Kinh doanh B2B',
    assignee: 'Nguyễn Minh An',
    status: 'Đạt KPI',
    q1Target: 1250000000,
    q2Target: 1420000000,
    actualRevenue: 2780000000,
    notes: 'Hợp đồng khung doanh nghiệp quý I',
    totalValue: 2780000000,
  },
  {
    id: 'sp-02',
    region: 'Miền Bắc',
    department: 'Kinh doanh B2B',
    assignee: 'Trần Thu Hà',
    status: 'Đang theo dõi',
    q1Target: 1850000000,
    q2Target: 1850000000,
    actualRevenue: 1790000000,
    notes: 'Khối hợp nhất chỉ tiêu H1 (2×2)',
    totalValue: 1790000000,
    rowKind: 'matrix',
    matrixLabel: 'Hợp nhất Q1–Q2 (2×2)',
  },
  {
    id: 'sp-03',
    region: 'Miền Bắc',
    department: 'Khối Đại lý',
    assignee: 'Lê Hoàng Long',
    status: 'Vượt mức',
    q1Target: 1850000000,
    q2Target: 1850000000,
    actualRevenue: 2140000000,
    notes: 'Mở mới 14 đại lý cấp 1',
    totalValue: 2140000000,
  },
  {
    id: 'sp-04',
    region: 'Miền Bắc',
    department: 'Khối Đại lý',
    assignee: 'Phạm Bảo Ngọc',
    status: 'Đạt KPI',
    q1Target: 980000000,
    q2Target: 1120000000,
    actualRevenue: 2180000000,
    notes: 'Tái ký tuyến đường bay nội địa',
    totalValue: 2180000000,
  },
  {
    id: 'sp-sum-1',
    region: 'Tổng miền Bắc',
    department: 'Tổng hợp vùng Miền Bắc (Gộp ngang Colspan 3 cột)',
    assignee: '—',
    status: '—',
    q1Target: 4080000000,
    q2Target: 4390000000,
    actualRevenue: 8890000000,
    notes: 'Dòng tổng kết gộp 3 cột thông tin',
    totalValue: 8890000000,
    rowKind: 'summary',
    summaryTitle: 'Tổng kết vùng Miền Bắc — Gộp ngang 3 cột (Colspan = 3)',
  },
  {
    id: 'sp-05',
    region: 'Miền Trung',
    department: 'Vận hành Sân bay',
    assignee: 'Đặng Quốc Việt',
    status: 'Ổn định',
    q1Target: 760000000,
    q2Target: 840000000,
    actualRevenue: 1620000000,
    notes: 'Cụm cảng Đà Nẵng - Huế',
    totalValue: 1620000000,
  },
  {
    id: 'sp-06',
    region: 'Miền Trung',
    department: 'Vận hành Sân bay',
    assignee: 'Võ Thảo Ly',
    status: 'Đạt KPI',
    q1Target: 690000000,
    q2Target: 750000000,
    actualRevenue: 1495000000,
    notes: 'Hỗ trợ khai thác cao điểm hè',
    totalValue: 1495000000,
  },
  {
    id: 'sp-07',
    region: 'Miền Trung',
    department: 'Khối Du lịch',
    assignee: 'Bùi Đức Thịnh',
    status: 'Tăng trưởng',
    q1Target: 910000000,
    q2Target: 1050000000,
    actualRevenue: 2050000000,
    notes: 'Tuyến Nha Trang - Quy Nhơn',
    totalValue: 2050000000,
  },
  {
    id: 'sp-08',
    region: 'Miền Nam',
    department: 'Thương mại Điện tử',
    assignee: 'Huỳnh Tấn Phát',
    status: 'Vượt mức',
    q1Target: 2200000000,
    q2Target: 2200000000,
    actualRevenue: 4510000000,
    notes: 'Tối ưu luồng thanh toán QR',
    totalValue: 4510000000,
    rowKind: 'matrix',
    matrixLabel: 'Chỉ tiêu sàn TMĐT (2×2)',
  },
  {
    id: 'sp-09',
    region: 'Miền Nam',
    department: 'Thương mại Điện tử',
    assignee: 'Ngô Mỹ Duyên',
    status: 'Đạt KPI',
    q1Target: 2200000000,
    q2Target: 2200000000,
    actualRevenue: 2340000000,
    notes: 'Chiến dịch khách hàng thân thiết',
    totalValue: 2340000000,
  },
  {
    id: 'sp-10',
    region: 'Miền Nam',
    department: 'Khối Đại lý',
    assignee: 'Trương Gia Huy',
    status: 'Vượt mức',
    q1Target: 1640000000,
    q2Target: 1890000000,
    actualRevenue: 3680000000,
    notes: 'Tăng sản lượng vé quốc tế',
    totalValue: 3680000000,
  },
  {
    id: 'sp-11',
    region: 'Miền Nam',
    department: 'Khối Đại lý',
    assignee: 'Đỗ Thanh Tú',
    status: 'Ổn định',
    q1Target: 1410000000,
    q2Target: 1520000000,
    actualRevenue: 2990000000,
    notes: 'Đối tác lữ hành TP.HCM',
    totalValue: 2990000000,
  },
  {
    id: 'sp-sum-2',
    region: 'Tổng miền Nam',
    department: 'Tổng hợp vùng Miền Nam (Gộp ngang Colspan 3 cột)',
    assignee: '—',
    status: '—',
    q1Target: 5250000000,
    q2Target: 5610000000,
    actualRevenue: 13520000000,
    notes: 'Dòng tổng kết vùng Miền Nam',
    totalValue: 13520000000,
    rowKind: 'summary',
    summaryTitle: 'Tổng kết vùng Miền Nam — Gộp ngang 3 cột (Colspan = 3)',
  },
  {
    id: 'sp-12',
    region: 'Quốc tế',
    department: 'Đông Nam Á',
    assignee: 'Phan Quốc Khánh',
    status: 'Mở rộng',
    q1Target: 1920000000,
    q2Target: 2150000000,
    actualRevenue: 4180000000,
    notes: 'Bangkok - Singapore - Kuala Lumpur',
    totalValue: 4180000000,
  },
  {
    id: 'sp-13',
    region: 'Quốc tế',
    department: 'Đông Bắc Á',
    assignee: 'Lý Gia Hân',
    status: 'Đạt KPI',
    q1Target: 2450000000,
    q2Target: 2680000000,
    actualRevenue: 5210000000,
    notes: 'Seoul - Tokyo - Đài Bắc',
    totalValue: 5210000000,
  },
  {
    id: 'sp-14',
    region: 'Quốc tế',
    department: 'Đông Bắc Á',
    assignee: 'Hoàng Nhật Minh',
    status: 'Vượt mức',
    q1Target: 1750000000,
    q2Target: 1980000000,
    actualRevenue: 3890000000,
    notes: 'Đường bay charter mùa thu',
    totalValue: 3890000000,
  },
];

const TREE_NESTED_DATA: TreeOrgRecord[] = [
  {
    id: 'org-corp',
    code: 'CORP-01',
    name: 'Tổng công ty Hàng không & Lữ hành',
    lead: 'Nguyễn Thành Đạt',
    headcount: 148,
    budget: 28500000000,
    status: 'Đang vận hành',
    children: [
      {
        id: 'org-tech',
        code: 'DIV-TECH',
        name: 'Khối Công nghệ & Nền tảng Số',
        lead: 'Trần Quang Khải',
        headcount: 54,
        budget: 11200000000,
        status: 'Ưu tiên',
        children: [
          {
            id: 'org-grid',
            code: 'TEAM-FE',
            name: 'Nhóm Lưới dữ liệu & Giao diện',
            lead: 'Phạm Minh Tuấn',
            headcount: 14,
            budget: 3400000000,
            status: 'Đúng tiến độ',
          },
          {
            id: 'org-api',
            code: 'TEAM-BE',
            name: 'Nhóm Tích hợp Vé & API',
            lead: 'Lê Thu Trang',
            headcount: 22,
            budget: 4800000000,
            status: 'Đúng tiến độ',
          },
          {
            id: 'org-qa',
            code: 'TEAM-QA',
            name: 'Nhóm Kiểm thử Tự động',
            lead: 'Đặng Hải Yến',
            headcount: 18,
            budget: 3000000000,
            status: 'Đang rà soát',
          },
        ],
      },
      {
        id: 'org-sales',
        code: 'DIV-SALES',
        name: 'Khối Kinh doanh Toàn quốc',
        lead: 'Hoàng Lan Anh',
        headcount: 62,
        budget: 12400000000,
        status: 'Tăng trưởng',
        children: [
          {
            id: 'org-b2b',
            code: 'DEPT-B2B',
            name: 'Phòng Đại lý Doanh nghiệp',
            lead: 'Vũ Đức Mạnh',
            headcount: 34,
            budget: 7600000000,
            status: 'Vượt KPI',
            children: [
              {
                id: 'org-b2b-hn',
                code: 'UNIT-HN',
                name: 'Chi nhánh Miền Bắc',
                lead: 'Nguyễn Hải Nam',
                headcount: 16,
                budget: 3900000000,
                status: 'Vượt KPI',
              },
              {
                id: 'org-b2b-hcm',
                code: 'UNIT-HCM',
                name: 'Chi nhánh Miền Nam',
                lead: 'Trần Bảo Châu',
                headcount: 18,
                budget: 3700000000,
                status: 'Đạt KPI',
              },
            ],
          },
          {
            id: 'org-ota',
            code: 'DEPT-OTA',
            name: 'Phòng Kênh Trực tuyến',
            lead: 'Bùi Khánh Linh',
            headcount: 28,
            budget: 4800000000,
            status: 'Ổn định',
          },
        ],
      },
    ],
  },
  {
    id: 'org-ops',
    code: 'CORP-02',
    name: 'Trung tâm Điều hành & Chăm sóc',
    lead: 'Đoàn Thanh Sơn',
    headcount: 32,
    budget: 4900000000,
    status: 'Ổn định',
    children: [
      {
        id: 'org-cs',
        code: 'TEAM-CS',
        name: 'Tổng đài Hỗ trợ 24/7',
        lead: 'Nguyễn Ngọc Mai',
        headcount: 20,
        budget: 2700000000,
        status: 'Đạt SLA',
      },
      {
        id: 'org-fin',
        code: 'TEAM-FIN',
        name: 'Đối soát Công nợ Đại lý',
        lead: 'Phạm Hữu Phước',
        headcount: 12,
        budget: 2200000000,
        status: 'Đúng hạn',
      },
    ],
  },
];

function flattenNestedForParentKeyMode(nodes: TreeOrgRecord[]): TreeOrgRecord[] {
  const flat: TreeOrgRecord[] = [];
  const walk = (items: TreeOrgRecord[], parentId: string | null) => {
    for (const item of items) {
      const { children, ...rest } = item;
      flat.push({ ...rest, parentId });
      if (children && children.length > 0) {
        walk(children, item.id);
      }
    }
  };
  walk(nodes, null);
  return flat;
}

const TREE_FLAT_DATA = flattenNestedForParentKeyMode(TREE_NESTED_DATA);

const INITIAL_DETAIL_ORDERS: DetailOrderRecord[] = [
  {
    id: 'ord-1001',
    orderCode: 'DH-2026-001',
    customer: 'Phương Nam Travel',
    channel: 'Đại lý Cấp 1',
    createdAt: '2026-11-10',
    status: 'Đã xác nhận',
    totalAmount: 18450000,
    items: [
      { sku: 'VJ-HAN-SGN', name: 'Vé khứ hồi Hà Nội – TP.HCM (Eco)', qty: 3, amount: 8850000 },
      { sku: 'VN-DAD-HAN', name: 'Vé một chiều Đà Nẵng – Hà Nội (Flex)', qty: 2, amount: 6400000 },
      { sku: 'BAG-20KG', name: 'Gói hành lý ký gửi bổ sung 20kg', qty: 4, amount: 3200000 },
    ],
  },
  {
    id: 'ord-1002',
    orderCode: 'DH-2026-002',
    customer: 'Công ty TNHH Ánh Dương',
    channel: 'Doanh nghiệp B2B',
    createdAt: '2026-11-11',
    status: 'Chờ xuất hóa đơn',
    totalAmount: 42100000,
    items: [
      { sku: 'VN-SGN-NRT', name: 'Vé khứ hồi TP.HCM – Tokyo Narita', qty: 2, amount: 28400000 },
      { sku: 'SEAT-PREM', name: 'Chọn chỗ trước hàng ghế rộng chân', qty: 2, amount: 2400000 },
      { sku: 'INS-TRV', name: 'Bảo hiểm du lịch quốc tế 5 ngày', qty: 2, amount: 1800000 },
      { sku: 'LOUNGE-VIP', name: 'Thẻ vào phòng chờ thương gia', qty: 2, amount: 3100000 },
      { sku: 'FAST-TRACK', name: 'Dịch vụ đón tiễn ưu tiên sân bay', qty: 2, amount: 6400000 },
    ],
  },
  {
    id: 'ord-1003',
    orderCode: 'DH-2026-003',
    customer: 'Nguyễn Quốc Thế',
    channel: 'Trực tuyến Web',
    createdAt: '2026-11-12',
    status: 'Đã thanh toán',
    totalAmount: 4250000,
    items: [
      { sku: 'QH-HAN-PQC', name: 'Vé một chiều Hà Nội – Phú Quốc', qty: 1, amount: 4250000 },
    ],
  },
  {
    id: 'ord-1004',
    orderCode: 'DH-2026-004',
    customer: 'Đơn giữ chỗ trống (Không có chi tiết)',
    channel: 'Nội bộ',
    createdAt: '2026-11-13',
    status: 'Nháp',
    totalAmount: 0,
    items: [],
  },
  {
    id: 'ord-1005',
    orderCode: 'DH-2026-005',
    customer: 'Lữ hành Hoàn Mỹ',
    channel: 'Đại lý Cấp 1',
    createdAt: '2026-11-14',
    status: 'Hoàn tất',
    totalAmount: 15900000,
    items: [
      { sku: 'VJ-SGN-BKK', name: 'Vé khứ hồi TP.HCM – Bangkok (Đoàn)', qty: 4, amount: 13600000 },
      { sku: 'MEAL-COMBO', name: 'Suất ăn nóng & đồ uống trên tàu bay', qty: 4, amount: 2300000 },
    ],
  },
  {
    id: 'ord-1006',
    orderCode: 'DH-2026-006',
    customer: 'Trần Minh Khôi',
    channel: 'Ứng dụng Di động',
    createdAt: '2026-11-15',
    status: 'Đã xác nhận',
    totalAmount: 7600000,
    items: [
      { sku: 'VN-SGN-ICN', name: 'Vé một chiều TP.HCM – Seoul Incheon', qty: 1, amount: 7600000 },
    ],
  },
];

const SPAN_MODULES = [
  RowNumberModule,
  ColumnPinningModule,
  ColumnSizingModule,
  CellSpanModule,
  CrossHoverModule,
];

const TREE_MODULES = [
  RowNumberModule,
  TreeDataModule,
  CrossHoverModule,
  FilteringModule,
  SortingModule,
  ColumnSizingModule,
  ColumnPinningModule,
];

const DETAIL_MODULES = [
  RowNumberModule,
  RowSelectionModule,
  RowDetailModule,
  CrossHoverModule,
  ColumnSizingModule,
  ColumnPinningModule,
];

export const GridTableV2FeaturesDemo: React.FC<GridTableV2FeaturesDemoProps> = ({
  surfaceTheme,
}) => {
  const [activeTab, setActiveTab] = useState<FeatureDemoTab>('span');
  const [crossHoverEnabled, setCrossHoverEnabled] = useState(true);
  const [highlightHeader, setHighlightHeader] = useState(true);
  const [treeMode, setTreeMode] = useState<'nested' | 'flat'>('nested');
  const [accordionMode, setAccordionMode] = useState(false);
  const [detailOrders, setDetailOrders] = useState<DetailOrderRecord[]>(INITIAL_DETAIL_ORDERS);

  const treeGridRef = useRef<DataGridRef | null>(null);
  const detailGridRef = useRef<DataGridRef | null>(null);

  const spanColumns = useMemo<GridColumnDef<SpanRecord>[]>(() => {
    const autoRegionSpan = createAutoRowSpan<SpanRecord>('region', {
      canMerge: (r) => r.rowKind !== 'summary',
    });
    const autoDeptSpan = createAutoRowSpan<SpanRecord>((r) => `${r.region}__${r.department}`, {
      canMerge: (r) => r.rowKind !== 'summary',
    });

    return [
      {
        key: 'region',
        title: 'Khu vực (Rowspan)',
        defaultWidth: 140,
        pin: PIN_POSITIONS.LEFT,
        rowSpan: autoRegionSpan,
      },
      {
        key: 'department',
        title: 'Bộ phận',
        defaultWidth: 180,
        rowSpan: autoDeptSpan,
        renderCell: ({ row }) =>
          row.rowKind === 'summary' ? (
            <span className="font-semibold">{row.summaryTitle}</span>
          ) : (
            <span>{row.department}</span>
          ),
      },
      {
        key: 'assignee',
        title: 'Phụ trách',
        defaultWidth: 165,
      },
      {
        key: 'status',
        title: 'Trạng thái',
        defaultWidth: 130,
        align: ALIGNMENTS.CENTER,
      },
      {
        key: 'q1Target',
        title: 'Mục tiêu Q1',
        defaultWidth: 150,
        dataType: DATA_TYPES.NUMBER,
        align: ALIGNMENTS.RIGHT,
        renderCell: ({ row }) =>
          row.rowKind === 'matrix' ? (
            <div className="w-full h-full flex items-center justify-center font-semibold text-center">
              {row.matrixLabel}
            </div>
          ) : (
            <span className="tabular-nums">{row.q1Target.toLocaleString('vi-VN')}</span>
          ),
      },
      {
        key: 'q2Target',
        title: 'Mục tiêu Q2',
        defaultWidth: 150,
        dataType: DATA_TYPES.NUMBER,
        align: ALIGNMENTS.RIGHT,
      },
      {
        key: 'actualRevenue',
        title: 'Thực đạt H1',
        defaultWidth: 155,
        dataType: DATA_TYPES.NUMBER,
        align: ALIGNMENTS.RIGHT,
      },
      {
        key: 'notes',
        title: 'Ghi chú triển khai',
        defaultWidth: 230,
      },
      {
        key: 'totalValue',
        title: 'Tổng giá trị',
        defaultWidth: 150,
        pin: PIN_POSITIONS.RIGHT,
        dataType: DATA_TYPES.NUMBER,
        align: ALIGNMENTS.RIGHT,
      },
    ];
  }, []);

  const spanMethod = useMemo<GridSpanMethod<SpanRecord>>(() => {
    return ({ row, column }) => {
      if (row.rowKind === 'summary') {
        if (column.key === 'department') return { rowSpan: 1, colSpan: 3 };
        if (column.key === 'assignee' || column.key === 'status') {
          return { rowSpan: 0, colSpan: 0 };
        }
      }
      if (row.rowKind === 'matrix') {
        if (column.key === 'q1Target') return { rowSpan: 2, colSpan: 2 };
        if (column.key === 'q2Target') return { rowSpan: 0, colSpan: 0 };
      }
      return undefined;
    };
  }, []);

  const treeColumns = useMemo<GridColumnDef<TreeOrgRecord>[]>(
    () => [
      { key: 'name', title: 'Đơn vị / Phòng ban', defaultWidth: 320, pin: PIN_POSITIONS.LEFT },
      { key: 'code', title: 'Mã đơn vị', defaultWidth: 120 },
      { key: 'lead', title: 'Trưởng phụ trách', defaultWidth: 170 },
      {
        key: 'headcount',
        title: 'Nhân sự',
        defaultWidth: 100,
        dataType: DATA_TYPES.NUMBER,
        align: ALIGNMENTS.RIGHT,
      },
      {
        key: 'budget',
        title: 'Ngân sách (VND)',
        defaultWidth: 170,
        dataType: DATA_TYPES.NUMBER,
        align: ALIGNMENTS.RIGHT,
      },
      { key: 'status', title: 'Trạng thái', defaultWidth: 140, align: ALIGNMENTS.CENTER },
    ],
    []
  );

  const detailColumns = useMemo<GridColumnDef<DetailOrderRecord>[]>(
    () => [
      { key: 'orderCode', title: 'Mã đơn', defaultWidth: 140, pin: PIN_POSITIONS.LEFT },
      { key: 'customer', title: 'Khách hàng / Đại lý', defaultWidth: 240 },
      { key: 'channel', title: 'Kênh bán', defaultWidth: 150 },
      {
        key: 'createdAt',
        title: 'Ngày tạo',
        defaultWidth: 130,
        dataType: DATA_TYPES.DATE,
        align: ALIGNMENTS.CENTER,
      },
      { key: 'status', title: 'Trạng thái', defaultWidth: 150, align: ALIGNMENTS.CENTER },
      {
        key: 'totalAmount',
        title: 'Tổng tiền',
        defaultWidth: 160,
        pin: PIN_POSITIONS.RIGHT,
        dataType: DATA_TYPES.NUMBER,
        align: ALIGNMENTS.RIGHT,
      },
    ],
    []
  );

  const handleAppendMockDetailLine = (orderId: string) => {
    setDetailOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;
        const nextIdx = ord.items.length + 1;
        const addedAmount = 950000;
        return {
          ...ord,
          totalAmount: ord.totalAmount + addedAmount,
          items: [
            ...ord.items,
            {
              sku: `SVC-00${nextIdx}`,
              name: `Dịch vụ bổ sung kiểm tra chiều cao động #${nextIdx}`,
              qty: 1,
              amount: addedAmount,
            },
          ],
        };
      })
    );
  };

  const renderOrderDetail = ({ row, rowIndex, close }: DetailRowContext<DetailOrderRecord>) => (
    <div className="space-y-3 text-xs">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="space-y-1">
          <div className="font-bold text-sm" style={{ color: 'var(--agv-text-main)' }}>
            Chi tiết đơn {row.orderCode} — {row.customer}
          </div>
          <div style={{ color: 'var(--agv-text-muted)' }}>
            Dòng dữ liệu #{rowIndex + 1} · {row.items.length} hạng mục · Kênh {row.channel}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <AdvButton
            variant="ghost"
            size="sm"
            onClick={() => handleAppendMockDetailLine(row.id)}
          >
            Thêm hạng mục
          </AdvButton>
          <AdvButton variant="outline" size="sm" onClick={close}>
            Đóng
          </AdvButton>
        </div>
      </div>

      <div
        className="rounded-md border overflow-hidden"
        style={{ borderColor: 'var(--agv-border)' }}
      >
        {row.items.map((item, idx) => (
          <div
            key={`${item.sku}-${idx}`}
            className="grid grid-cols-12 items-center gap-2 px-3 py-2"
            style={{
              borderTop: idx > 0 ? '1px solid var(--agv-border)' : undefined,
              backgroundColor:
                idx % 2 === 0
                  ? 'var(--agv-bg-row)'
                  : 'var(--agv-bg-row-alt, var(--agv-bg-card, var(--agv-bg-row)))',
              color: 'var(--agv-text-main)',
            }}
          >
            <div className="col-span-3 font-mono font-medium truncate">{item.sku}</div>
            <div className="col-span-5 truncate">{item.name}</div>
            <div
              className="col-span-1 text-right tabular-nums"
              style={{ color: 'var(--agv-text-muted)' }}
            >
              ×{item.qty}
            </div>
            <div className="col-span-3 text-right font-semibold tabular-nums">
              {item.amount.toLocaleString('vi-VN')} đ
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          className="inline-flex flex-wrap items-center gap-1 p-1 rounded-lg border"
          style={{
            backgroundColor: 'var(--agv-bg-root)',
            borderColor: 'var(--agv-border)',
          }}
        >
          {TAB_ITEMS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className="h-7 min-h-[28px] px-3 rounded-md text-xs font-semibold transition-colors cursor-pointer"
                style={
                  isActive
                    ? {
                        backgroundColor: 'var(--agv-accent)',
                        color: 'var(--agv-accent-text, #ffffff)',
                      }
                    : {
                        backgroundColor: 'transparent',
                        color: 'var(--agv-text-muted)',
                      }
                }
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {activeTab === 'span' && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setCrossHoverEnabled((v) => !v)}
              className="h-7 min-h-[28px] px-3 rounded-md border text-xs font-medium transition-colors cursor-pointer"
              style={
                crossHoverEnabled
                  ? {
                      backgroundColor: 'var(--agv-accent)',
                      borderColor: 'var(--agv-accent)',
                      color: 'var(--agv-accent-text, #ffffff)',
                    }
                  : {
                      backgroundColor: 'var(--agv-bg-card, var(--agv-bg-row))',
                      borderColor: 'var(--agv-border)',
                      color: 'var(--agv-text-main)',
                    }
              }
            >
              Cross Hovering
            </button>
            <button
              type="button"
              onClick={() => setHighlightHeader((v) => !v)}
              disabled={!crossHoverEnabled}
              className="h-7 min-h-[28px] px-3 rounded-md border text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
              style={
                highlightHeader && crossHoverEnabled
                  ? {
                      backgroundColor: 'var(--agv-accent)',
                      borderColor: 'var(--agv-accent)',
                      color: 'var(--agv-accent-text, #ffffff)',
                    }
                  : {
                      backgroundColor: 'var(--agv-bg-card, var(--agv-bg-row))',
                      borderColor: 'var(--agv-border)',
                      color: 'var(--agv-text-main)',
                    }
              }
            >
              Tô sáng Header
            </button>
          </div>
        )}

        {activeTab === 'tree' && (
          <div className="flex flex-wrap items-center gap-2">
            <AdvButton
              variant="outline"
              size="sm"
              onClick={() => treeGridRef.current?.expandAllTree?.()}
            >
              Mở tất cả
            </AdvButton>
            <AdvButton
              variant="outline"
              size="sm"
              onClick={() => treeGridRef.current?.expandTreeToDepth?.(1)}
            >
              Mở cấp 1
            </AdvButton>
            <AdvButton
              variant="outline"
              size="sm"
              onClick={() => treeGridRef.current?.collapseAllTree?.()}
            >
              Thu gọn
            </AdvButton>
            <div
              className="inline-flex items-center gap-1 p-1 rounded-lg border"
              style={{
                backgroundColor: 'var(--agv-bg-root)',
                borderColor: 'var(--agv-border)',
              }}
            >
              <button
                type="button"
                onClick={() => setTreeMode('nested')}
                className="h-7 min-h-[28px] px-3 rounded-md text-xs font-medium transition-colors cursor-pointer"
                style={
                  treeMode === 'nested'
                    ? {
                        backgroundColor: 'var(--agv-accent)',
                        color: 'var(--agv-accent-text, #ffffff)',
                      }
                    : {
                        backgroundColor: 'transparent',
                        color: 'var(--agv-text-muted)',
                      }
                }
              >
                Lồng children
              </button>
              <button
                type="button"
                onClick={() => setTreeMode('flat')}
                className="h-7 min-h-[28px] px-3 rounded-md text-xs font-medium transition-colors cursor-pointer"
                style={
                  treeMode === 'flat'
                    ? {
                        backgroundColor: 'var(--agv-accent)',
                        color: 'var(--agv-accent-text, #ffffff)',
                      }
                    : {
                        backgroundColor: 'transparent',
                        color: 'var(--agv-text-muted)',
                      }
                }
              >
                Phẳng parentId
              </button>
            </div>
          </div>
        )}

        {activeTab === 'detail' && (
          <div className="flex flex-wrap items-center gap-2">
            <AdvButton
              variant="outline"
              size="sm"
              onClick={() => detailGridRef.current?.expandAllDetails?.()}
            >
              Mở tất cả
            </AdvButton>
            <AdvButton
              variant="outline"
              size="sm"
              onClick={() => detailGridRef.current?.collapseAllDetails?.()}
            >
              Đóng tất cả
            </AdvButton>
            <button
              type="button"
              onClick={() => setAccordionMode((v) => !v)}
              className="h-7 min-h-[28px] px-3 rounded-md border text-xs font-medium transition-colors cursor-pointer"
              style={
                accordionMode
                  ? {
                      backgroundColor: 'var(--agv-accent)',
                      borderColor: 'var(--agv-accent)',
                      color: 'var(--agv-accent-text, #ffffff)',
                    }
                  : {
                      backgroundColor: 'var(--agv-bg-card, var(--agv-bg-row))',
                      borderColor: 'var(--agv-border)',
                      color: 'var(--agv-text-main)',
                    }
              }
            >
              Chế độ Accordion
            </button>
          </div>
        )}
      </div>

      <div
        className="w-full h-[360px] rounded-lg border overflow-hidden flex flex-col"
        style={{ borderColor: 'var(--agv-border)' }}
      >
        {activeTab === 'span' && (
          <DataGrid<SpanRecord>
            gridId="ui-table-v2-span-cross-hover"
            modules={SPAN_MODULES}
            rows={SPAN_ROWS}
            columns={spanColumns}
            getRowId={(r) => r.id}
            spanMethod={spanMethod}
            enableCrossHover={crossHoverEnabled}
            crossHoverHighlightHeader={highlightHeader}
            persistState={false}
            pagination={false}
            enableStatusBar={false}
            surfaceTheme={surfaceTheme}
          />
        )}

        {activeTab === 'tree' && (
          <DataGrid<TreeOrgRecord>
            key={treeMode}
            gridId={`ui-table-v2-tree-${treeMode}`}
            gridRef={treeGridRef}
            modules={TREE_MODULES}
            rows={treeMode === 'nested' ? TREE_NESTED_DATA : TREE_FLAT_DATA}
            columns={treeColumns}
            getRowId={(r) => r.id}
            treeData={{
              treeColumnKey: 'name',
              parentKeyField: treeMode === 'flat' ? 'parentId' : undefined,
              defaultExpandedDepth: 1,
              indentSize: 20,
              filterMode: 'preserveAncestors',
            }}
            persistState={false}
            pagination={false}
            enableStatusBar={false}
            surfaceTheme={surfaceTheme}
          />
        )}

        {activeTab === 'detail' && (
          <DataGrid<DetailOrderRecord>
            gridId="ui-table-v2-row-detail"
            gridRef={detailGridRef}
            modules={DETAIL_MODULES}
            rows={detailOrders}
            columns={detailColumns}
            getRowId={(r) => r.id}
            detailRow={{
              renderDetail: renderOrderDetail,
              height: 'auto',
              estimatedHeight: 160,
              accordion: accordionMode,
              defaultExpandedKeys: ['ord-1001'],
              canExpand: (r) => r.items.length > 0,
            }}
            persistState={false}
            pagination={false}
            enableStatusBar={false}
            surfaceTheme={surfaceTheme}
          />
        )}
      </div>
    </div>
  );
};
