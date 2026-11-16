import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { DataGrid } from '../components/grid/DataGrid';
import { createColumnHelper, type DefaultColDef } from '../components/grid/columns';
import { StandardGridModules } from '../components/grid/modules';
import { ALIGNMENTS, DATA_TYPES, type SurfaceTheme } from '../components/grid/types';
import { NO_AUTOFILL_PROPS } from '../components/grid/constants';
import { AdvSelect, AdvSelectOption } from '../components/ui/AdvSelect';
import { AdvSearchLookUpEdit } from '../components/ui/AdvSearchLookUpEdit';
import { AdvDateRangePicker } from '../components/ui/AdvDatePicker';
import { StatusBadge } from '../components/shared/StatusBadge';
import { StatusTabs } from '../components/shared/StatusTabs';
import { usePagedListQuery } from './usePagedListQuery';
import { AdvButton } from '../components/ui/AdvButton';
import {
  CONTROL_INPUT_MD_CLASS,
} from '../components/ui/controlFocus';
import {
  BookingListItem,
  BookingLookupOption,
  BookingStatusFilterValue,
  BookingStatusTone,
  defaultBookingFromDate,
  defaultBookingToDate,
  fetchBookingsPage,
  fetchBookingCarriersDDL,
  fetchBookingPartnersDDL,
  fetchBookingUsersDDL,
  getBookingItineraryDisplay,
  getBookingRepresentativeCustomer,
  resolveBookingStatusMeta,
  toShortBookingSystemCode,
} from '../services/b2bApi';

type BookingGridRecord = BookingListItem & {
  _rowKey: string;
  SystemShort: string;
  ItineraryRoute: string;
  ItineraryDates: string;
  RepresentativeCustomer: string;
  StatusLabel: string;
  StatusTone: BookingStatusTone;
  PartnerDisplay: string;
  CreatorDisplay: string;
  BookingExpiredSort: string;
  BookingExpiredDisplay: string;
  CreatedDateSort: string;
  CreatedDateDisplay: string;
};

const BOOKING_STATUS_TABS: { value: BookingStatusFilterValue; label: string }[] = [
  { value: '-1', label: 'Tất cả' },
  { value: '100', label: 'Giữ chỗ' },
  { value: '300', label: 'Đã xuất vé' },
  { value: '400', label: 'Lỗi' },
  { value: '500', label: 'Đã hoàn' },
  { value: '600', label: 'Hủy vé' },
  { value: '200', label: 'Đã hủy' },
];

function formatVnd(amount: number | undefined | null): string {
  if (amount === undefined || amount === null || !Number.isFinite(Number(amount))) return '—';
  return `${new Intl.NumberFormat('vi-VN').format(Number(amount))} đ`;
}

function formatDateTimeDisplay(raw: string | undefined | null): string {
  if (!raw) return '';
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return String(raw);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
}

function toGridDateSortValue(raw: string | undefined | null): string {
  if (!raw) return '';
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return String(raw);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export interface BookingsPageProps {
  surfaceTheme: SurfaceTheme;
}

export const BookingsPage: React.FC<BookingsPageProps> = ({ surfaceTheme }) => {
  const initialFromDate = useMemo(() => defaultBookingFromDate(), []);
  const initialToDate = useMemo(() => defaultBookingToDate(), []);

  const [statusTab, setStatusTab] = useState<BookingStatusFilterValue>('-1');
  const [searchInput, setSearchInput] = useState('');
  const [fromDate, setFromDate] = useState(initialFromDate);
  const [toDate, setToDate] = useState(initialToDate);
  const [systemCode, setSystemCode] = useState('');
  const [partnerId, setPartnerId] = useState('');
  const [userId, setUserId] = useState('');

  const [appliedFilters, setAppliedFilters] = useState<{
    status: BookingStatusFilterValue;
    search: string;
    fromDate: string;
    toDate: string;
    systemCode: string;
    partnerId: number | null;
    createdBy: number | null;
  }>({
    status: '-1',
    search: '',
    fromDate: initialFromDate,
    toDate: initialToDate,
    systemCode: '',
    partnerId: null,
    createdBy: null,
  });

  const [carriers, setCarriers] = useState<BookingLookupOption[]>([]);
  const [partners, setPartners] = useState<BookingLookupOption[]>([]);
  const [users, setUsers] = useState<BookingLookupOption[]>([]);

  const {
    page,
    setPage,
    pageSize,
    handlePageSizeChange,
    rows: rawRows,
    serverTotal,
    loading,
    error,
    refresh,
  } = usePagedListQuery(appliedFilters, fetchBookingsPage, 'Không thể tải danh sách đặt chỗ.');

  useEffect(() => {
    const controller = new AbortController();
    fetchBookingCarriersDDL(controller.signal)
      .then((list) => {
        if (!controller.signal.aborted) setCarriers(list);
      })
      .catch(() => {
        // Bỏ qua nếu DDL hệ thống không sẵn sàng
      });
    fetchBookingPartnersDDL(controller.signal)
      .then((list) => {
        if (!controller.signal.aborted) setPartners(list);
      })
      .catch(() => {
        // Bỏ qua nếu tài khoản không có quyền xem toàn bộ đại lý
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const parsedPartner = partnerId ? Number(partnerId) : null;
    fetchBookingUsersDDL(
      parsedPartner && Number.isFinite(parsedPartner) ? parsedPartner : null,
      controller.signal
    )
      .then((list) => {
        if (!controller.signal.aborted) setUsers(list);
      })
      .catch(() => {
        // Bỏ qua nếu tài khoản không có quyền xem danh sách người tạo
      });
    return () => controller.abort();
  }, [partnerId]);

  const systemOptions = useMemo<AdvSelectOption[]>(
    () => [
      { value: '', label: 'Tất cả hệ thống' },
      ...carriers.map((c) => ({ value: c.id, label: c.label })),
    ],
    [carriers]
  );

  const partnerLookUpData = useMemo(
    () => [
      { id: '', code: 'Tất cả', name: 'Tất cả đại lý', label: 'Tất cả đại lý' },
      ...partners,
    ],
    [partners]
  );

  const userLookUpData = useMemo(
    () => [
      { id: '', code: 'Tất cả', name: 'Tất cả người tạo', label: 'Tất cả người tạo' },
      ...users,
    ],
    [users]
  );

  const records = useMemo<BookingGridRecord[]>(() => {
    return rawRows.map((row, idx) => {
      const itinerary = getBookingItineraryDisplay(row);
      const passenger = getBookingRepresentativeCustomer(row);
      const statusMeta = resolveBookingStatusMeta(row.BookingStatusId, row.BookingStatusName);
      const systemShort = toShortBookingSystemCode(row.SystemCode || row.CarrierCode);
      const partnerDisplay =
        row.PartnerCode && row.PartnerName
          ? `${row.PartnerCode} — ${row.PartnerName}`
          : row.PartnerCode || row.PartnerName || (row.PartnerId ? `#${row.PartnerId}` : '');
      const creatorDisplay =
        row.CreatedByName && row.CreatedByCode
          ? `${row.CreatedByName} (${row.CreatedByCode})`
          : row.CreatedByName || row.CreatedByCode || (row.CreatedBy ? `#${row.CreatedBy}` : '');

      return {
        ...row,
        _rowKey:
          row.BookingId != null
            ? String(row.BookingId)
            : row.BookingCode
            ? `${row.BookingCode}_${idx}`
            : `booking_${idx}`,
        SystemShort: systemShort,
        ItineraryRoute: itinerary.route,
        ItineraryDates: itinerary.dates,
        RepresentativeCustomer: passenger,
        StatusLabel: statusMeta.label,
        StatusTone: statusMeta.tone,
        PartnerDisplay: partnerDisplay,
        CreatorDisplay: creatorDisplay,
        BookingExpiredSort: toGridDateSortValue(row.BookingExpired),
        BookingExpiredDisplay: formatDateTimeDisplay(row.BookingExpired),
        CreatedDateSort: toGridDateSortValue(row.CreatedDate),
        CreatedDateDisplay: formatDateTimeDisplay(row.CreatedDate),
      };
    });
  }, [rawRows]);

  const defaultColDef = useMemo<DefaultColDef<BookingGridRecord>>(
    () => ({
      cell: ({ getValue, column }) => {
        const rawVal = getValue();
        const hasVal = rawVal !== undefined && rawVal !== null && String(rawVal).trim() !== '';
        return (
          <span
            className={`truncate text-xs ${hasVal ? 'text-foreground' : 'text-muted-foreground'} ${
              hasVal && column.className ? column.className : ''
            }`.trim()}
          >
            {hasVal ? String(rawVal) : '—'}
          </span>
        );
      },
    }),
    []
  );

  const columns = useMemo(() => {
    const col = createColumnHelper<BookingGridRecord>();
    return [
      col.accessor('BookingCode', {
        header: 'Mã đặt chỗ',
        size: 115,
        minSize: 92,
        pinned: 'left',
        meta: {
          align: ALIGNMENTS.CENTER,
          dataType: DATA_TYPES.TEXT,
          className: 'agv-cell-code',
        },
      }),
      col.accessor('SystemShort', {
        header: 'Hệ thống',
        size: 92,
        minSize: 76,
        meta: { align: ALIGNMENTS.CENTER, dataType: DATA_TYPES.TEXT },
      }),
      col.accessor('ItineraryRoute', {
        header: 'Hành trình',
        size: 155,
        minSize: 110,
        meta: { align: ALIGNMENTS.LEFT, dataType: DATA_TYPES.TEXT },
      }),
      col.accessor('ItineraryDates', {
        header: 'Ngày bay',
        size: 116,
        minSize: 92,
        enableGlobalFilter: false,
        meta: { align: ALIGNMENTS.CENTER, dataType: DATA_TYPES.TEXT },
      }),
      col.accessor('RepresentativeCustomer', {
        header: 'Hành khách',
        size: 205,
        minSize: 140,
        meta: { align: ALIGNMENTS.LEFT, dataType: DATA_TYPES.TEXT },
      }),
      col.accessor('StatusLabel', {
        header: 'Trạng thái',
        size: 128,
        minSize: 108,
        meta: { align: ALIGNMENTS.CENTER, dataType: DATA_TYPES.TEXT },
        cell: ({ getValue, row }) => {
          const tone: BookingStatusTone = row.original.StatusTone || 'muted';
          return <StatusBadge tone={tone}>{getValue()}</StatusBadge>;
        },
      }),
      col.accessor('TotalAmount', {
        header: 'Tổng tiền (VND)',
        size: 145,
        minSize: 115,
        enableGlobalFilter: false,
        meta: { align: ALIGNMENTS.RIGHT, dataType: DATA_TYPES.NUMBER },
        cell: ({ getValue }) => {
          const val = getValue();
          const hasVal = val !== undefined && val !== null;
          return (
            <span
              className={`text-xs font-semibold font-mono tabular-nums ${
                hasVal ? 'text-foreground' : 'text-muted-foreground'
              }`}
            >
              {formatVnd(val)}
            </span>
          );
        },
      }),
      col.accessor('ContactName', {
        header: 'Người liên hệ',
        size: 165,
        minSize: 120,
        meta: { align: ALIGNMENTS.LEFT, dataType: DATA_TYPES.TEXT },
      }),
      col.accessor('ContactPhone', {
        header: 'SĐT',
        size: 128,
        minSize: 100,
        meta: { align: ALIGNMENTS.LEFT, dataType: DATA_TYPES.TEXT },
      }),
      col.accessor('ContactEmail', {
        header: 'Email',
        size: 195,
        minSize: 135,
        meta: { align: ALIGNMENTS.LEFT, dataType: DATA_TYPES.TEXT },
      }),
      col.accessor('PartnerDisplay', {
        header: 'Đại lý',
        size: 170,
        minSize: 120,
        meta: { align: ALIGNMENTS.LEFT, dataType: DATA_TYPES.TEXT },
      }),
      col.accessor('CreatorDisplay', {
        header: 'Người tạo',
        size: 170,
        minSize: 120,
        meta: { align: ALIGNMENTS.LEFT, dataType: DATA_TYPES.TEXT },
      }),
      col.accessor('BookingExpiredSort', {
        header: 'Hạn giữ chỗ',
        size: 138,
        minSize: 115,
        enableGlobalFilter: false,
        meta: { align: ALIGNMENTS.CENTER, dataType: DATA_TYPES.DATE },
        cell: ({ row }) => {
          const text = row.original.BookingExpiredDisplay;
          return (
            <span
              className={`truncate text-xs font-mono tabular-nums ${
                text ? 'text-status-danger-foreground' : 'text-muted-foreground'
              }`}
            >
              {text || '—'}
            </span>
          );
        },
      }),
      col.accessor('CreatedDateSort', {
        header: 'Ngày tạo',
        size: 138,
        minSize: 115,
        enableGlobalFilter: false,
        meta: { align: ALIGNMENTS.CENTER, dataType: DATA_TYPES.DATE },
        cell: ({ row }) => {
          const text = row.original.CreatedDateDisplay;
          return (
            <span
              className={`truncate text-xs font-mono tabular-nums ${
                text ? 'text-foreground' : 'text-muted-foreground'
              }`}
            >
              {text || '—'}
            </span>
          );
        },
      }),
    ];
  }, []);

  const getRowId = useCallback((row: BookingGridRecord) => row._rowKey, []);

  const handleSelectStatusTab = (nextStatus: BookingStatusFilterValue) => {
    setStatusTab(nextStatus);
    setAppliedFilters((prev) => ({ ...prev, status: nextStatus }));
    setPage(1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedPartner = partnerId ? Number(partnerId) : null;
    const parsedUser = userId ? Number(userId) : null;
    const next = {
      status: statusTab,
      search: searchInput.trim(),
      fromDate,
      toDate,
      systemCode,
      partnerId: parsedPartner && Number.isFinite(parsedPartner) ? parsedPartner : null,
      createdBy: parsedUser && Number.isFinite(parsedUser) ? parsedUser : null,
    };
    const isSame =
      next.status === appliedFilters.status &&
      next.search === appliedFilters.search &&
      next.fromDate === appliedFilters.fromDate &&
      next.toDate === appliedFilters.toDate &&
      next.systemCode === appliedFilters.systemCode &&
      next.partnerId === appliedFilters.partnerId &&
      next.createdBy === appliedFilters.createdBy;
    setAppliedFilters(next);
    if (isSame) {
      if (page !== 1) setPage(1);
      else refresh();
    } else {
      setPage(1);
    }
  };

  const handleResetFilters = () => {
    setStatusTab('-1');
    setSearchInput('');
    setFromDate(initialFromDate);
    setToDate(initialToDate);
    setSystemCode('');
    setPartnerId('');
    setUserId('');
    setAppliedFilters({
      status: '-1',
      search: '',
      fromDate: initialFromDate,
      toDate: initialToDate,
      systemCode: '',
      partnerId: null,
      createdBy: null,
    });
    setPage(1);
  };

  const hasFilters = Boolean(
    appliedFilters.status !== '-1' ||
      appliedFilters.search ||
      appliedFilters.fromDate !== initialFromDate ||
      appliedFilters.toDate !== initialToDate ||
      appliedFilters.systemCode ||
      appliedFilters.partnerId ||
      appliedFilters.createdBy
  );

  const toolbarSlot = (
    <div className="space-y-2.5">
      {/* Status Tabs (Gold underline theo b2b-pnt) */}
      <StatusTabs
        items={BOOKING_STATUS_TABS}
        value={statusTab}
        onChange={handleSelectStatusTab}
      />

      {/* Server Filter Bar */}
      <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-2 text-xs">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Tìm mã đặt chỗ, hành khách, SĐT, email..."
          {...NO_AUTOFILL_PROPS}
          className={`w-72 ${CONTROL_INPUT_MD_CLASS}`}
        />

        <div className="w-[240px]">
          <AdvDateRangePicker
            from={fromDate}
            to={toDate}
            onChange={(range) => {
              setFromDate(range.from || '');
              setToDate(range.to || '');
            }}
            placeholderFrom="Từ ngày"
            placeholderTo="Đến ngày"
            theme={surfaceTheme}
            size="md"
            allowClear
          />
        </div>

        <div className="w-44">
          <AdvSelect
            value={systemCode}
            onChange={setSystemCode}
            options={systemOptions}
            placeholder="Tất cả hệ thống"
            theme={surfaceTheme}
            size="md"
          />
        </div>

        <div className="w-52">
          <AdvSearchLookUpEdit
            value={partnerId}
            onChange={(val) => {
              setPartnerId(String(val ?? ''));
              setUserId('');
            }}
            dataSource={partnerLookUpData}
            valueMember="id"
            displayMember="label"
            columns={[
              { key: 'code', title: 'Mã ĐL', width: 90, className: 'agv-cell-code' },
              { key: 'name', title: 'Tên đại lý', width: 200 },
            ]}
            searchFields={['code', 'name']}
            placeholder="Tất cả đại lý"
            searchPlaceholder="Tìm đại lý..."
            dropdownWidth={340}
            theme={surfaceTheme}
            size="md"
          />
        </div>

        <div className="w-52">
          <AdvSearchLookUpEdit
            value={userId}
            onChange={(val) => setUserId(String(val ?? ''))}
            dataSource={userLookUpData}
            valueMember="id"
            displayMember="label"
            columns={[
              { key: 'code', title: 'Mã NV', width: 90, className: 'agv-cell-code' },
              { key: 'name', title: 'Họ tên', width: 200 },
            ]}
            searchFields={['code', 'name']}
            placeholder="Tất cả người tạo"
            searchPlaceholder="Tìm người tạo..."
            dropdownWidth={340}
            theme={surfaceTheme}
            size="md"
          />
        </div>

        <AdvButton
          type="submit"
          variant="default"
          size="default"
          disabled={loading}
        >
          Tìm kiếm
        </AdvButton>

        {hasFilters ? (
          <AdvButton
            variant="destructive"
            size="default"
            onClick={handleResetFilters}
          >
            Xóa lọc
          </AdvButton>
        ) : null}
      </form>
    </div>
  );

  return (
    <DataGrid
      gridId="b2b_bookings"
      title="Quản lý đặt chỗ"
      description="Danh sách đặt chỗ của hệ thống."
      modules={StandardGridModules}
      data={records}
      columns={columns}
      defaultColDef={defaultColDef}
      getRowId={getRowId}
      pagination={{
        page,
        pageSize,
        serverTotal,
        onPageChange: setPage,
        onPageSizeChange: handlePageSizeChange,
      }}
      loading={loading}
      refreshing={loading && records.length > 0}
      error={error}
      onRetry={refresh}
      toolbarSlot={toolbarSlot}
      surfaceTheme={surfaceTheme}
      emptyText="Chưa có đặt chỗ phù hợp."
    />
  );
};
