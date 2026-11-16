import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from 'react';
import type { GridTheme as SurfaceTheme } from '../themes';
import { DataGrid } from '../components/grid/DataGrid';
import { BasicViewModules } from '../components/grid/modules';
import { GridTelemetryLine, useGridStageTelemetry } from './gridPageTelemetry';
import {
  createBasicColumnHelper as createColumnHelper,
  type DefaultColDef,
} from '../components/grid/columns/normalizeColumns';
import { formatGridNumber } from '../components/grid/gridFormatUtils';
import { ALIGNMENTS, DATA_TYPES } from '../components/grid/types';
import { NO_AUTOFILL_PROPS } from '../components/grid/constants';
import { AdvSelect, type AdvSelectOption } from '../components/ui/AdvSelect';
import { AdvSearchLookUpEdit } from '../components/ui/AdvSearchLookUpEdit';
import { StatusBadge } from '../components/shared/StatusBadge';
import { AdvButton } from '../components/ui/AdvButton';
import {
  BUTTON_FOCUS_VISIBLE_CLASS,
  CONTROL_INPUT_MD_CLASS,
} from '../components/ui/controlFocus';
import {
  type AirportInfoRow,
  type CountryOption,
  fetchAllAirports,
  fetchCountryDDL,
} from '../services/b2bApi';

type TriStateFilter = '-1' | '0' | '1';
type AirportRowMode = 'all' | 'paged';

type AirportGridRecord = AirportInfoRow & {
  _rowKey: string;
  StatusLabel: string;
  TypeLabel: string;
  TopSearchLabel: string;
};

const CONTINENT_OPTIONS: AdvSelectOption[] = [
  { value: '', label: 'Tất cả châu lục' },
  { value: 'AF', label: 'AF — Châu Phi' },
  { value: 'AS', label: 'AS — Châu Á' },
  { value: 'EU', label: 'EU — Châu Âu' },
  { value: 'NA', label: 'NA — Bắc Mỹ' },
  { value: 'SA', label: 'SA — Nam Mỹ' },
  { value: 'OC', label: 'OC — Châu Đại Dương' },
  { value: 'AN', label: 'AN — Châu Nam Cực' },
];

const STATUS_OPTIONS: AdvSelectOption[] = [
  { value: '-1', label: 'Mọi trạng thái' },
  { value: '1', label: 'Đang bật' },
  { value: '0', label: 'Đã ẩn' },
];

const TYPE_OPTIONS: AdvSelectOption[] = [
  { value: '-1', label: 'Tất cả loại' },
  { value: '0', label: 'Nội địa' },
  { value: '1', label: 'Quốc tế' },
];

const PROMINENCE_OPTIONS: AdvSelectOption[] = [
  { value: '-1', label: 'Mọi mức nổi bật' },
  { value: '1', label: 'Nổi bật' },
  { value: '0', label: 'Thường' },
];

function getAirportRowId(row: AirportGridRecord): string {
  return row._rowKey;
}

function useAirportDefaultColDef(): DefaultColDef<AirportGridRecord> {
  return useMemo<DefaultColDef<AirportGridRecord>>(
    () => ({
      cell: ({ getValue, column }) => {
        const rawVal = getValue();
        const hasVal = rawVal !== undefined && rawVal !== null && String(rawVal).trim() !== '';
        return (
          <span
            className={`truncate text-xs ${hasVal ? 'text-foreground' : 'text-muted-foreground'} ${
              hasVal && column.className ? column.className : ''
            }`}
          >
            {hasVal ? String(rawVal) : '—'}
          </span>
        );
      },
    }),
    []
  );
}

function useAirportGridColumns() {
  return useMemo(() => {
    const col = createColumnHelper<AirportGridRecord>();
    return [
      col.accessor('AirPortCode', {
        header: 'Mã IATA',
        size: 92,
        minSize: 72,
        meta: {
          align: ALIGNMENTS.CENTER,
          dataType: DATA_TYPES.TEXT,
          className: 'agv-cell-code',
        },
      }),
      col.accessor('AirPortNameVi', {
        header: 'Tên sân bay (VI)',
        size: 250,
        minSize: 150,
        meta: { align: ALIGNMENTS.LEFT, dataType: DATA_TYPES.TEXT },
      }),
      col.accessor('AirPortNameEn', {
        header: 'Tên sân bay (EN)',
        size: 250,
        minSize: 150,
        meta: { align: ALIGNMENTS.LEFT, dataType: DATA_TYPES.TEXT },
      }),
      col.accessor('CityNameVi', {
        header: 'Thành phố (VI)',
        size: 170,
        minSize: 110,
        meta: { align: ALIGNMENTS.LEFT, dataType: DATA_TYPES.TEXT },
      }),
      col.accessor('CityNameEn', {
        header: 'Thành phố (EN)',
        size: 170,
        minSize: 110,
        meta: { align: ALIGNMENTS.LEFT, dataType: DATA_TYPES.TEXT },
      }),
      col.accessor('CountryCode', {
        header: 'Quốc gia',
        size: 96,
        minSize: 76,
        meta: {
          align: ALIGNMENTS.CENTER,
          dataType: DATA_TYPES.TEXT,
          className: 'agv-cell-code',
        },
      }),
      col.accessor('ContinentCode', {
        header: 'Châu lục',
        size: 96,
        minSize: 76,
        meta: { align: ALIGNMENTS.CENTER, dataType: DATA_TYPES.TEXT },
      }),
      col.accessor('StatusLabel', {
        header: 'Trạng thái',
        size: 112,
        minSize: 92,
        meta: { align: ALIGNMENTS.CENTER, dataType: DATA_TYPES.TEXT },
        cell: ({ getValue, row }) => (
          <StatusBadge tone={row.original.IsActive !== false ? 'success' : 'muted'}>
            {getValue()}
          </StatusBadge>
        ),
      }),
      col.accessor('TypeLabel', {
        header: 'Loại sân bay',
        size: 112,
        minSize: 92,
        meta: { align: ALIGNMENTS.CENTER, dataType: DATA_TYPES.TEXT },
        cell: ({ getValue, row }) => (
          <StatusBadge tone={row.original.IsInternational ? 'brand' : 'muted'}>
            {getValue()}
          </StatusBadge>
        ),
      }),
      col.accessor('TopSearchLabel', {
        header: 'Mức nổi bật',
        size: 112,
        minSize: 92,
        meta: { align: ALIGNMENTS.CENTER, dataType: DATA_TYPES.TEXT },
        cell: ({ getValue, row }) => (
          <StatusBadge tone={row.original.IsTopSearch ? 'warning' : 'muted'}>
            {getValue()}
          </StatusBadge>
        ),
      }),
      col.accessor('SortOrder', {
        header: 'Thứ tự',
        size: 90,
        minSize: 72,
        enableGlobalFilter: false,
        meta: { align: ALIGNMENTS.RIGHT, dataType: DATA_TYPES.NUMBER },
        cell: ({ getValue }) => {
          const val = getValue();
          if (val == null) {
            return <span className="text-xs text-muted-foreground">—</span>;
          }
          return (
            <span className="text-xs font-mono tabular-nums text-foreground">
              {formatGridNumber(val)}
            </span>
          );
        },
      }),
    ];
  }, []);
}

function parseAirportRowMode(): AirportRowMode {
  if (typeof window === 'undefined') {
    return 'all';
  }
  const rawHash = window.location.hash || '';
  const queryIndex = rawHash.indexOf('?');
  const params =
    queryIndex >= 0 ? new URLSearchParams(rawHash.slice(queryIndex + 1)) : null;
  return params?.get('mode') === 'paged' ? 'paged' : 'all';
}

export interface AirportsPageProps {
  surfaceTheme: SurfaceTheme;
}

export const AirportsPage: React.FC<AirportsPageProps> = ({ surfaceTheme }) => {
  const [rowMode, setRowMode] = useState<AirportRowMode>(() => parseAirportRowMode());

  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState<TriStateFilter>('-1');
  const [countryFilter, setCountryFilter] = useState<string[]>([]);
  const [continentFilter, setContinentFilter] = useState('');
  const [internationalFilter, setInternationalFilter] = useState<TriStateFilter>('-1');
  const [topSearchFilter, setTopSearchFilter] = useState<TriStateFilter>('-1');

  const [appliedFilters, setAppliedFilters] = useState({
    search: '',
    status: '-1' as TriStateFilter,
    country: '',
    continent: '',
    international: '-1' as TriStateFilter,
    topSearch: '-1' as TriStateFilter,
  });

  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [rawRows, setRawRows] = useState<AirportInfoRow[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [apiLoadMs, setApiLoadMs] = useState<number | null>(null);
  const [reloadTick, setReloadTick] = useState<number>(0);

  const renderStartRef = useRef<number>(performance.now());
  const gridStageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const syncFromHash = () => {
      setRowMode(parseAirportRowMode());
    };
    window.addEventListener('hashchange', syncFromHash);
    return () => window.removeEventListener('hashchange', syncFromHash);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchCountryDDL(controller.signal)
      .then((list) => {
        if (!controller.signal.aborted) {
          setCountries(list);
        }
      })
      .catch(() => {
        // Bỏ qua nếu DDL quốc gia lỗi
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const t0 = performance.now();
    setLoading(true);
    setError(null);

    fetchAllAirports(appliedFilters, controller.signal)
      .then((res) => {
        if (controller.signal.aborted) return;
        const elapsed = Math.round(performance.now() - t0);
        renderStartRef.current = performance.now();
        setApiLoadMs(elapsed);
        setRawRows(res.items);
        setTotalCount(res.total);
        setLoading(false);
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        const msg =
          err instanceof Error && err.message
            ? err.message
            : 'Không thể tải danh sách sân bay.';
        setError(msg);
        setLoading(false);
      });

    return () => controller.abort();
  }, [appliedFilters, reloadTick]);

  const refresh = useCallback(() => {
    setReloadTick((tick) => tick + 1);
  }, []);

  const countryLookUpData = useMemo(
    () =>
      countries.map((c) => ({
        ...c,
        display: `${c.code} — ${c.nameVi}`,
      })),
    [countries]
  );

  const records = useMemo<AirportGridRecord[]>(() => {
    return rawRows.map((row, idx) => {
      const isActive = row.IsActive !== false;
      const isIntl = Boolean(row.IsInternational);
      const isTop = Boolean(row.IsTopSearch);
      return {
        ...row,
        _rowKey:
          row.AirPortInfoId != null
            ? String(row.AirPortInfoId)
            : row.AirPortCode
              ? `${row.AirPortCode}_${idx}`
              : `airport_${idx}`,
        StatusLabel: isActive ? 'Đang bật' : 'Đã ẩn',
        TypeLabel: isIntl ? 'Quốc tế' : 'Nội địa',
        TopSearchLabel: isTop ? 'Nổi bật' : 'Thường',
      };
    });
  }, [rawRows]);

  const columns = useAirportGridColumns();
  const defaultColDef = useAirportDefaultColDef();

  const gridPagination = useMemo(
    () => (rowMode === 'paged' ? { defaultPageSize: 20 } : (false as const)),
    [rowMode]
  );

  const telemetry = useGridStageTelemetry(
    gridStageRef,
    renderStartRef,
    [records, gridPagination],
    loading
  );

  const handleSelectRowMode = useCallback(
    (nextMode: AirportRowMode) => {
      if (nextMode === rowMode) return;
      renderStartRef.current = performance.now();
      setRowMode(nextMode);
      if (typeof window !== 'undefined') {
        window.history.replaceState(null, '', `#/airports?mode=${nextMode}`);
      }
    },
    [rowMode]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next = {
      search: searchInput.trim(),
      status: statusFilter,
      country: countryFilter.join(','),
      continent: continentFilter,
      international: internationalFilter,
      topSearch: topSearchFilter,
    };
    const isSame =
      next.search === appliedFilters.search &&
      next.status === appliedFilters.status &&
      next.country === appliedFilters.country &&
      next.continent === appliedFilters.continent &&
      next.international === appliedFilters.international &&
      next.topSearch === appliedFilters.topSearch;
    setAppliedFilters(next);
    if (isSame) {
      refresh();
    }
  };

  const handleResetFilters = () => {
    setSearchInput('');
    setStatusFilter('-1');
    setCountryFilter([]);
    setContinentFilter('');
    setInternationalFilter('-1');
    setTopSearchFilter('-1');
    setAppliedFilters({
      search: '',
      status: '-1',
      country: '',
      continent: '',
      international: '-1',
      topSearch: '-1',
    });
  };

  const hasFilters = Boolean(
    appliedFilters.search ||
      appliedFilters.status !== '-1' ||
      appliedFilters.country ||
      appliedFilters.continent ||
      appliedFilters.international !== '-1' ||
      appliedFilters.topSearch !== '-1'
  );

  const displayRowCount = records.length || totalCount;

  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-hidden bg-card text-card-foreground">
      {/* Page Title */}
      <section className="px-4 py-2.5 border-b border-border bg-card shrink-0">
        <div className="flex flex-wrap items-baseline gap-2.5">
          <h2 className="text-section-title font-semibold text-foreground tracking-tight">
            Quản lý sân bay
          </h2>
          <p className="text-caption text-muted-foreground">
            Danh mục sân bay phục vụ tìm kiếm chuyến bay và cấu hình nhà ga.
          </p>
        </div>
      </section>

      {/* Filter Bar + Row Mode Switcher + Live Telemetry */}
      <section className="px-4 py-2.5 border-b border-border bg-card shrink-0 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-2 text-xs">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Mã, tên sân bay..."
              {...NO_AUTOFILL_PROPS}
              className={`w-52 ${CONTROL_INPUT_MD_CLASS}`}
            />

            <div className="w-36">
              <AdvSelect
                value={statusFilter}
                onChange={(val) => setStatusFilter((val || '-1') as TriStateFilter)}
                options={STATUS_OPTIONS}
                theme={surfaceTheme}
                size="md"
              />
            </div>

            <div className="w-52">
              <AdvSearchLookUpEdit
                multiSelect
                value={countryFilter}
                onChange={(vals) =>
                  setCountryFilter(
                    Array.isArray(vals) ? vals.map(String) : vals ? [String(vals)] : []
                  )
                }
                dataSource={countryLookUpData}
                valueMember="code"
                displayMember="display"
                columns={[
                  { key: 'code', title: 'Mã', width: 64, className: 'agv-cell-code' },
                  { key: 'nameVi', title: 'Quốc gia (VI)', width: 170 },
                  { key: 'nameEn', title: 'Quốc gia (EN)', width: 170 },
                ]}
                searchFields={['code', 'nameVi', 'nameEn']}
                placeholder="Tất cả quốc gia"
                searchPlaceholder="Tìm mã hoặc tên quốc gia..."
                dropdownWidth={456}
                theme={surfaceTheme}
                size="md"
              />
            </div>

            <div className="w-44">
              <AdvSelect
                value={continentFilter}
                onChange={(val) => setContinentFilter(val)}
                options={CONTINENT_OPTIONS}
                theme={surfaceTheme}
                size="md"
              />
            </div>

            <div className="w-32">
              <AdvSelect
                value={internationalFilter}
                onChange={(val) => setInternationalFilter((val || '-1') as TriStateFilter)}
                options={TYPE_OPTIONS}
                theme={surfaceTheme}
                size="md"
              />
            </div>

            <div className="w-40">
              <AdvSelect
                value={topSearchFilter}
                onChange={(val) => setTopSearchFilter((val || '-1') as TriStateFilter)}
                options={PROMINENCE_OPTIONS}
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

          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground whitespace-nowrap">Chế độ dòng:</span>
            <div
              role="group"
              aria-label="Chế độ hiển thị dòng"
              className="inline-flex items-center rounded-md border border-control bg-control-surface p-0.5 gap-0.5"
            >
              <button
                type="button"
                data-testid="mode-all"
                aria-pressed={rowMode === 'all'}
                onClick={() => handleSelectRowMode('all')}
                style={
                  rowMode === 'all'
                    ? {
                        backgroundColor: 'var(--agv-accent)',
                        color: 'var(--agv-accent-text, #ffffff)',
                      }
                    : undefined
                }
                className={`min-h-[28px] px-2.5 py-1 text-xs font-medium rounded-sm whitespace-nowrap cursor-pointer transition-colors ${BUTTON_FOCUS_VISIBLE_CLASS} ${
                  rowMode === 'all' ? '' : 'text-foreground hover:bg-surface-hover'
                }`}
              >
                Gộp hết {displayRowCount.toLocaleString('vi-VN')} dòng
              </button>

              <button
                type="button"
                data-testid="mode-paged"
                aria-pressed={rowMode === 'paged'}
                onClick={() => handleSelectRowMode('paged')}
                style={
                  rowMode === 'paged'
                    ? {
                        backgroundColor: 'var(--agv-accent)',
                        color: 'var(--agv-accent-text, #ffffff)',
                      }
                    : undefined
                }
                className={`min-h-[28px] px-2.5 py-1 text-xs font-medium rounded-sm whitespace-nowrap cursor-pointer transition-colors ${BUTTON_FOCUS_VISIBLE_CLASS} ${
                  rowMode === 'paged' ? '' : 'text-foreground hover:bg-surface-hover'
                }`}
              >
                Phân trang
              </button>
            </div>
          </div>
        </div>

        <GridTelemetryLine apiLoadMs={apiLoadMs} {...telemetry} />
      </section>

      {/* Single DataGrid Stage */}
      <div
        ref={gridStageRef}
        data-testid="airport-grid-stage"
        className="flex-1 min-h-0 flex flex-col overflow-hidden"
      >
        <DataGrid
          gridId="b2b_airports"
          modules={BasicViewModules}
          autoHeight={false}
          data={records}
          columns={columns}
          defaultColDef={defaultColDef}
          getRowId={getAirportRowId}
          pagination={gridPagination}
          loading={loading}
          refreshing={loading && records.length > 0}
          error={error}
          onRetry={refresh}
          surfaceTheme={surfaceTheme}
          emptyText="Chưa có sân bay phù hợp."
        />
      </div>
    </div>
  );
};
