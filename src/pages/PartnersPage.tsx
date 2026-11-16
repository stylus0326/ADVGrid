import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { DataGrid } from '../components/grid/DataGrid';
import { formatCodeName } from '../components/grid/columns';
import { StandardGridModules } from '../components/grid/modules';
import type { SurfaceTheme } from '../components/grid/types';
import { NO_AUTOFILL_PROPS } from '../components/grid/constants';
import { AdvSearchLookUpEdit } from '../components/ui/AdvSearchLookUpEdit';
import { StatusTabs } from '../components/shared/StatusTabs';
import { AdvButton } from '../components/ui/AdvButton';
import {
  CONTROL_INPUT_MD_CLASS,
} from '../components/ui/controlFocus';
import {
  PartnerListStatus,
  PartnerSalesUser,
  fetchPartnersPage,
  fetchPartnerSalesUsers,
} from '../services/b2bApi';
import { usePagedListQuery } from './usePagedListQuery';
import { buildTempTwelveMonthMonths } from './tempMock12Months';
import {
  PARTNER_COLUMNS,
  PARTNER_DEFAULT_COL_DEF,
  PARTNER_PHONE_CARD,
  PARTNER_TABLET_GROUPS,
  type PartnerGridRecord,
} from './partners.columns';

const PARTNER_STATUS_TABS: { value: PartnerListStatus; label: string }[] = [
  { value: 'all', label: 'Tất cả' },
  { value: 'active', label: 'Hoạt động' },
  { value: 'inactive', label: 'Ngừng hoạt động' },
  { value: 'deleted', label: 'Đã xóa' },
];

export interface PartnersPageProps {
  surfaceTheme: SurfaceTheme;
}

export const PartnersPage: React.FC<PartnersPageProps> = ({ surfaceTheme }) => {
  const [statusTab, setStatusTab] = useState<PartnerListStatus>('all');
  const [searchInput, setSearchInput] = useState('');
  const [salesUserId, setSalesUserId] = useState<string>('');

  const [appliedFilters, setAppliedFilters] = useState<{
    status: PartnerListStatus;
    search: string;
    salesUserId: number | null;
  }>({
    status: 'all',
    search: '',
    salesUserId: null,
  });

  const [salesUsers, setSalesUsers] = useState<PartnerSalesUser[]>([]);
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
  } = usePagedListQuery(appliedFilters, fetchPartnersPage, 'Không thể tải danh sách đại lý.');

  useEffect(() => {
    const controller = new AbortController();
    fetchPartnerSalesUsers(controller.signal)
      .then((list) => {
        if (!controller.signal.aborted && Array.isArray(list)) {
          setSalesUsers(list);
        }
      })
      .catch(() => {
        // Bỏ qua nếu không có quyền lấy danh sách nhân viên phụ trách
      });
    return () => controller.abort();
  }, []);

  const salesLookUpData = useMemo(
    () => [
      { id: '', code: 'Tất cả', fullName: 'Tất cả phụ trách', display: 'Tất cả phụ trách' },
      ...salesUsers.map((u) => ({
        id: String(u.UserId),
        code: u.UserCode || `#${u.UserId}`,
        fullName: u.FullName || '',
        display: formatCodeName(u.UserCode, u.FullName),
      })),
    ],
    [salesUsers]
  );

  const records = useMemo<PartnerGridRecord[]>(() => {
    return rawRows.map((row, idx) => ({
      ...row,
      _rowKey: row.PartnerId != null ? String(row.PartnerId) : `partner_${idx}`,
      // TEMPORARY: Chuỗi doanh số 12 tháng giả lập để test `twelveMonths`
      months12: buildTempTwelveMonthMonths(
        row.PartnerCode || String(row.PartnerId ?? idx),
        row.CurrentBalance
      ),
    }));
  }, [rawRows]);

  const getRowId = useCallback((row: PartnerGridRecord) => row._rowKey, []);

  const handleSelectStatusTab = (nextStatus: PartnerListStatus) => {
    setStatusTab(nextStatus);
    setAppliedFilters((prev) => ({ ...prev, status: nextStatus }));
    setPage(1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedSales = salesUserId ? Number(salesUserId) : null;
    const next = {
      status: statusTab,
      search: searchInput.trim(),
      salesUserId: parsedSales && Number.isFinite(parsedSales) ? parsedSales : null,
    };
    const isSame =
      next.status === appliedFilters.status &&
      next.search === appliedFilters.search &&
      next.salesUserId === appliedFilters.salesUserId;
    setAppliedFilters(next);
    if (isSame) {
      if (page !== 1) setPage(1);
      else refresh();
    } else {
      setPage(1);
    }
  };

  const handleResetFilters = () => {
    setStatusTab('all');
    setSearchInput('');
    setSalesUserId('');
    setAppliedFilters({ status: 'all', search: '', salesUserId: null });
    setPage(1);
  };

  const hasFilters = Boolean(
    appliedFilters.status !== 'all' || appliedFilters.search || appliedFilters.salesUserId
  );

  const toolbarSlot = (
    <div className="space-y-2.5">
      {/* Status Tabs (Gold underline theo b2b-pnt) */}
      <StatusTabs
        items={PARTNER_STATUS_TABS}
        value={statusTab}
        onChange={handleSelectStatusTab}
      />

      {/* Search & Sales Filter */}
      <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-2 text-xs">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Tìm mã, tên, SĐT, email đại lý..."
          {...NO_AUTOFILL_PROPS}
          className={`w-64 ${CONTROL_INPUT_MD_CLASS}`}
        />

        <div className="w-56">
          <AdvSearchLookUpEdit
            value={salesUserId}
            onChange={(val) => setSalesUserId(String(val ?? ''))}
            dataSource={salesLookUpData}
            valueMember="id"
            displayMember="display"
            columns={[
              { key: 'code', title: 'Mã NV', width: 90, className: 'agv-cell-code' },
              { key: 'fullName', title: 'Họ tên', width: 200 },
            ]}
            searchFields={['code', 'fullName']}
            placeholder="Tất cả phụ trách"
            searchPlaceholder="Tìm nhân viên phụ trách..."
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
      gridId="b2b_partners"
      title="Quản lý đại lý"
      description="Danh sách đại lý của hệ thống."
      modules={StandardGridModules}
      data={records}
      columns={PARTNER_COLUMNS}
      tabletGroups={PARTNER_TABLET_GROUPS}
      phoneCard={PARTNER_PHONE_CARD}
      defaultColDef={PARTNER_DEFAULT_COL_DEF}
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
      emptyText="Chưa có đại lý phù hợp."
    />
  );
};
