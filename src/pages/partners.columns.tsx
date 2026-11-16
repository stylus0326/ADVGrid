import {
  createColumnHelper,
  createStandardDefaultColDef,
  type DefaultColDef,
  type GridColumnDef,
  type PhoneCardConfig,
  type TabletColumnGroup,
} from '../components/grid/columns';
import { ALIGNMENTS, DATA_TYPES } from '../components/grid/types';
import { StatusBadge } from '../components/shared/StatusBadge';
import type { PartnerListItem } from '../services/b2bApi';

export type PartnerGridRecord = PartnerListItem & {
  _rowKey: string;
  // TEMPORARY: Chuỗi doanh số 12 tháng giả lập để test `twelveMonths`
  months12: number[];
};

const col = createColumnHelper<PartnerGridRecord>();

export const PARTNER_DEFAULT_COL_DEF: DefaultColDef<PartnerGridRecord> =
  createStandardDefaultColDef<PartnerGridRecord>();

export const PARTNER_COLUMNS: readonly GridColumnDef<PartnerGridRecord, any>[] = [
  col.accessor('PartnerCode', {
    header: 'Mã',
    size: 96,
    minSize: 76,
    pinned: 'left',
    meta: {
      align: ALIGNMENTS.CENTER,
      dataType: DATA_TYPES.TEXT,
      className: 'agv-cell-code',
    },
  }),
  col.accessor((row) => row.PartnerName || row.TradingName || '', {
    id: 'PartnerNameDisplay',
    header: 'Tên đại lý',
    size: 240,
    minSize: 150,
    meta: { align: ALIGNMENTS.LEFT, dataType: DATA_TYPES.TEXT },
  }),
  col.accessor('ManagerUserCode', {
    header: 'Tài khoản',
    size: 135,
    minSize: 100,
    meta: { align: ALIGNMENTS.LEFT, dataType: DATA_TYPES.TEXT },
  }),
  col.currency('CurrentBalance', {
    header: 'Quỹ (VND)',
    size: 145,
    minSize: 110,
  }),
  // TEMPORARY: Cặp cột Công thức + Biểu đồ 12 tháng từ lõi Grid
  ...col.twelveMonths({
    getMonths: (row) => row.months12,
  }),
  col.accessor('PartnerPhone', {
    header: 'SĐT',
    size: 130,
    minSize: 100,
    meta: { align: ALIGNMENTS.LEFT, dataType: DATA_TYPES.TEXT },
  }),
  col.accessor('PartnerEmail', {
    header: 'Email',
    size: 210,
    minSize: 140,
    meta: { align: ALIGNMENTS.LEFT, dataType: DATA_TYPES.TEXT },
  }),
  col.codeName({
    id: 'SalesUserDisplay',
    header: 'Phụ trách',
    code: 'SalesUserCode',
    name: 'SalesUserName',
    size: 160,
    minSize: 110,
  }),
  col.accessor(
    (row) =>
      row.IsDelete
        ? 'Đã xóa'
        : row.IsActive === false
          ? 'Ngừng hoạt động'
          : 'Hoạt động',
    {
      id: 'StatusLabel',
      header: 'Trạng thái',
      size: 132,
      minSize: 108,
      meta: { align: ALIGNMENTS.CENTER, dataType: DATA_TYPES.TEXT },
      cell: ({ getValue, row }) => {
        const isDeleted = Boolean(row.original.IsDelete);
        const isInactive = row.original.IsActive === false;
        const tone = isDeleted ? 'danger' : isInactive ? 'muted' : 'success';
        return <StatusBadge tone={tone}>{getValue()}</StatusBadge>;
      },
    }
  ),
  col.accessor('DiscountPolicy', {
    header: 'Chính sách chiết khấu',
    size: 190,
    minSize: 120,
    meta: { align: ALIGNMENTS.LEFT, dataType: DATA_TYPES.TEXT },
  }),
  col.accessor('CreditPolicy', {
    header: 'Chính sách thanh toán',
    size: 190,
    minSize: 120,
    meta: { align: ALIGNMENTS.LEFT, dataType: DATA_TYPES.TEXT },
  }),
  col.accessor('PartnerNote', {
    header: 'Ghi chú',
    size: 200,
    minSize: 120,
    meta: { align: ALIGNMENTS.LEFT, dataType: DATA_TYPES.TEXT },
  }),
  col.accessor('CreatedDate', {
    id: 'CreatedDateDisplay',
    header: 'Ngày tạo',
    size: 118,
    minSize: 100,
    enableGlobalFilter: false,
    meta: { align: ALIGNMENTS.CENTER, dataType: DATA_TYPES.DATE },
  }),
  col.codeName({
    id: 'CreatorDisplay',
    header: 'Người tạo',
    code: 'CreatedByCode',
    name: 'CreatedByName',
    pattern: 'name-paren-code',
    fallback: (row) => (row.CreatedBy ? `#${row.CreatedBy}` : ''),
    size: 170,
    minSize: 120,
  }),
];

export const PARTNER_TABLET_GROUPS: readonly TabletColumnGroup<PartnerGridRecord>[] = [
  {
    id: 'tg_partner',
    header: 'Đại lý/Quản lý',
    minWidth: 185,
    lines: [
      ['PartnerCode', 'PartnerNameDisplay'],
      { col: 'ManagerUserCode', label: true },
      { col: 'CurrentBalance', label: 'Quỹ' },
    ],
  },
  {
    id: 'tg_contact',
    header: 'Liên hệ',
    minWidth: 165,
    lines: [
      'PartnerPhone',
      'PartnerEmail',
      { col: 'SalesUserDisplay', label: true },
    ],
  },
  {
    id: 'tg_policy_note',
    header: 'Chính sách/Ghi chú',
    minWidth: 195,
    lines: [
      { col: 'DiscountPolicy', label: true },
      { col: 'CreditPolicy', label: true },
      { col: 'PartnerNote', label: true },
    ],
  },
  {
    id: 'tg_creator',
    header: 'Người tạo/ngày tạo',
    minWidth: 135,
    lines: [
      { col: 'CreatorDisplay', emphasis: 'strong' },
      { col: 'CreatedDateDisplay', emphasis: 'muted' },
    ],
  },
  {
    id: 'tg_sales_12m',
    header: 'Doanh số 12 tháng',
    width: 196,
    align: ALIGNMENTS.RIGHT,
    lines: [{ col: 'MonthlyFormulaVal', label: true }, 'MonthlyTrendChart'],
  },
  {
    id: 'tg_status',
    header: 'Trạng thái',
    width: 124,
    lines: ['StatusLabel'],
  },
];

export const PARTNER_PHONE_CARD: PhoneCardConfig<PartnerGridRecord> = {
  title: ['PartnerCode', 'PartnerNameDisplay'],
  badge: 'StatusLabel',
  summary: [
    { col: 'CurrentBalance', label: 'Quỹ' },
    { col: 'ManagerUserCode', label: 'TK' },
  ],
  details: ['PartnerPhone', 'SalesUserDisplay', 'PartnerEmail'],
};
