import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { DataGrid, type DataGridToolbarApi } from '../components/grid/DataGrid';
import { GridExternalPopupButtons } from '../components/grid/GridExternalPopupButtons';
import { createColumnHelper, type DefaultColDef } from '../components/grid/columns';
import {
  ColumnChooserModule,
  QueryBuilderModule,
  StandardGridModules,
} from '../components/grid/modules';
import { ALIGNMENTS, DATA_TYPES, type SurfaceTheme } from '../components/grid/types';
import { NO_AUTOFILL_PROPS } from '../components/grid/constants';
import { formatGridNumber } from '../components/grid/gridFormatUtils';
import { AdvSelect, AdvSelectOption } from '../components/ui/AdvSelect';
import { AdvComboBoxEdit } from '../components/ui/AdvComboBoxEdit';
import { AdvButton } from '../components/ui/AdvButton';
import {
  CONTROL_INPUT_MD_CLASS,
} from '../components/ui/controlFocus';
import {
  CountryRow,
  GeographyCatalog,
  fetchCountriesPage,
  fetchGeographyDDL,
} from '../services/b2bApi';
import { usePagedListQuery } from './usePagedListQuery';
import { GridTelemetryLine, useGridStageTelemetry } from './gridPageTelemetry';

type CountryGridRecord = CountryRow & {
  _rowKey: string;
  ContinentLabel: string;
  RegionLabel: string;
};

export interface CountriesPageProps {
  surfaceTheme: SurfaceTheme;
}

export const CountriesPage: React.FC<CountriesPageProps> = ({ surfaceTheme }) => {
  const [searchInput, setSearchInput] = useState('');
  const [continentFilter, setContinentFilter] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [appliedFilters, setAppliedFilters] = useState({
    search: '',
    continent: '',
    region: '',
  });

  const [geography, setGeography] = useState<GeographyCatalog | null>(null);
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
    apiLoadMs,
    renderStartRef,
  } = usePagedListQuery(appliedFilters, fetchCountriesPage, 'Không thể tải danh sách quốc gia.');

  const pageStageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetchGeographyDDL(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) {
          setGeography(data);
        }
      })
      .catch(() => {
        // Bỏ qua nếu DDL phụ chưa sẵn sàng; bảng vẫn hiển thị theo tên trả về từ SearchList
      });
    return () => controller.abort();
  }, []);

  const continentOptions = useMemo<AdvSelectOption[]>(() => {
    const base: AdvSelectOption[] = [{ value: '', label: 'Tất cả châu lục' }];
    if (!geography?.Continents) return base;
    return [
      ...base,
      ...geography.Continents.map((c) => ({
        value: c.Code,
        label: `${c.Code} — ${c.NameVi || c.NameEn || c.Code}`,
      })),
    ];
  }, [geography]);

  const regionOptions = useMemo<AdvSelectOption[]>(() => {
    const base: AdvSelectOption[] = [{ value: '', label: 'Tất cả vùng' }];
    if (!geography?.Regions) return base;
    return [
      ...base,
      ...geography.Regions.filter(
        (r) => !continentFilter || r.ContinentCode === continentFilter
      ).map((r) => ({
        value: r.Code,
        label: r.NameVi || r.NameEn || r.Code,
      })),
    ];
  }, [geography, continentFilter]);

  const records = useMemo<CountryGridRecord[]>(() => {
    return rawRows.map((row, idx) => ({
      ...row,
      _rowKey:
        row.Id != null
          ? String(row.Id)
          : row.IsoAlpha2
            ? String(row.IsoAlpha2)
            : `country_${idx}`,
      ContinentLabel: row.ContinentNameVi || row.ContinentNameEn || row.ContinentCode || '',
      RegionLabel: row.RegionNameVi || row.RegionNameEn || row.RegionCode || '',
    }));
  }, [rawRows]);

  const defaultColDef = useMemo<DefaultColDef<CountryGridRecord>>(
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

  const columns = useMemo(() => {
    const col = createColumnHelper<CountryGridRecord>();
    return [
      col.accessor('IsoAlpha2', {
        header: 'ISO-2',
        size: 86,
        minSize: 68,
        meta: {
          align: ALIGNMENTS.CENTER,
          dataType: DATA_TYPES.TEXT,
          className: 'agv-cell-code',
        },
      }),
      col.accessor('NameVi', {
        header: 'Tên (VI)',
        size: 250,
        minSize: 140,
        meta: { align: ALIGNMENTS.LEFT, dataType: DATA_TYPES.TEXT },
      }),
      col.accessor('NameEn', {
        header: 'Tên (EN)',
        size: 250,
        minSize: 140,
        meta: { align: ALIGNMENTS.LEFT, dataType: DATA_TYPES.TEXT },
      }),
      col.accessor('IsoAlpha3', {
        header: 'ISO-3',
        size: 92,
        minSize: 72,
        meta: {
          align: ALIGNMENTS.CENTER,
          dataType: DATA_TYPES.TEXT,
          className: 'agv-cell-code',
        },
      }),
      col.accessor('IsoNumeric', {
        header: 'ISO numeric',
        size: 124,
        minSize: 90,
        meta: { align: ALIGNMENTS.RIGHT, dataType: DATA_TYPES.NUMBER },
        cell: ({ getValue }) => {
          const val = getValue();
          if (val == null || String(val).trim() === '') {
            return (
              <span className="text-xs" style={{ color: 'var(--agv-text-muted)' }}>
                —
              </span>
            );
          }
          return <span className="text-xs font-medium tabular-nums">{formatGridNumber(val)}</span>;
        },
      }),
      col.accessor('ContinentLabel', {
        header: 'Châu lục',
        size: 196,
        minSize: 120,
        meta: { align: ALIGNMENTS.LEFT, dataType: DATA_TYPES.TEXT },
      }),
      col.accessor('RegionLabel', {
        header: 'Vùng',
        size: 246,
        minSize: 130,
        meta: { align: ALIGNMENTS.LEFT, dataType: DATA_TYPES.TEXT },
        cell: ({ getValue }) => {
          const val = getValue();
          const hasVal = Boolean(val);
          return (
            <span
              className={`truncate text-xs ${hasVal ? 'text-foreground' : 'text-muted-foreground'}`}
            >
              {hasVal ? val : 'Chưa phân vùng'}
            </span>
          );
        },
      }),
    ];
  }, []);

  const getRowId = useCallback((row: CountryGridRecord) => row._rowKey, []);

  const telemetry = useGridStageTelemetry(
    pageStageRef,
    renderStartRef,
    [records, page, pageSize],
    loading
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next = {
      search: searchInput.trim(),
      continent: continentFilter,
      region: regionFilter,
    };
    const isSame =
      next.search === appliedFilters.search &&
      next.continent === appliedFilters.continent &&
      next.region === appliedFilters.region;
    setAppliedFilters(next);
    if (isSame) {
      if (page !== 1) setPage(1);
      else refresh();
    } else {
      setPage(1);
    }
  };

  const handleResetFilters = () => {
    setSearchInput('');
    setContinentFilter('');
    setRegionFilter('');
    setAppliedFilters({ search: '', continent: '', region: '' });
    setPage(1);
  };

  const hasFilters = Boolean(
    appliedFilters.search || appliedFilters.continent || appliedFilters.region
  );

  const toolbarSlot = (gridApi: DataGridToolbarApi) => (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-2 text-xs">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Tên hoặc mã ISO..."
            {...NO_AUTOFILL_PROPS}
            className={`w-60 ${CONTROL_INPUT_MD_CLASS}`}
          />

          <div className="w-48">
            <AdvSelect
              value={continentFilter}
              onChange={(val) => {
                setContinentFilter(val);
                setRegionFilter('');
              }}
              options={continentOptions}
              placeholder="Tất cả châu lục"
              theme={surfaceTheme}
              size="md"
            />
          </div>

          <div className="w-52">
            <AdvComboBoxEdit
              value={regionFilter}
              onChange={(val) => setRegionFilter(val)}
              options={regionOptions}
              allowCustomInput={false}
              placeholder="Tất cả vùng"
              disabled={!geography}
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

        <GridExternalPopupButtons api={gridApi} />
      </div>

      <GridTelemetryLine apiLoadMs={apiLoadMs} {...telemetry} />
    </div>
  );

  return (
    <div
      ref={pageStageRef}
      data-testid="country-grid-stage"
      className="flex-1 min-h-0 flex flex-col overflow-hidden"
    >
      <DataGrid
        gridId="b2b_countries"
        title="Quản lý quốc gia"
        description="Danh mục quốc gia theo chuẩn ISO, phục vụ tra cứu và cấu hình địa lý."
        modules={[...StandardGridModules, QueryBuilderModule, ColumnChooserModule]}
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
        emptyText="Chưa có quốc gia phù hợp."
      />
    </div>
  );
};
