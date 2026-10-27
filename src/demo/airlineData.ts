import {
  ColumnDef,
  FilterOperation,
  ColumnFilterValue,
  ALIGNMENTS,
  DATA_TYPES,
  ColumnAlign,
  ColumnDataType,
} from '../components/grid/types';
import { matchFilterValue } from '../components/grid/gridUtils';
import { parseDateToNum, parseTimeToMinutes } from '../components/grid/floating/queryUtils';
import { expandAllShortcuts } from '../components/grid/smartNumberUtils';

export const TOTAL_AIRLINE_ROWS = 339737;
export const DEFAULT_CHUNK_SIZE = 20;
export const DEFAULT_ROW_HEIGHT = 32;

// Column key mapping: 23 real data columns from ExGD-24-10-2026.xlsx
export const AIRLINE_COL_DEF_MAP: Record<
  string,
  {
    idx: number;
    title: string;
    defaultWidth: number;
    align: ColumnAlign;
    dataType: ColumnDataType;
    isCurrency?: boolean;
  }
> = {
  col_ngaygd: { idx: 0, title: 'Ngày GD', defaultWidth: 140, align: ALIGNMENTS.CENTER, dataType: DATA_TYPES.DATE },
  col_macho: { idx: 1, title: 'Mã Chỗ', defaultWidth: 110, align: ALIGNMENTS.CENTER, dataType: DATA_TYPES.TEXT },
  col_phihang: { idx: 2, title: 'Phí hãng', defaultWidth: 110, align: ALIGNMENTS.RIGHT, dataType: DATA_TYPES.NUMBER, isCurrency: true },
  col_id: { idx: 3, title: 'ID', defaultWidth: 95, align: ALIGNMENTS.CENTER, dataType: DATA_TYPES.TEXT },
  col_loaive: { idx: 4, title: 'Loại vé', defaultWidth: 90, align: ALIGNMENTS.CENTER, dataType: DATA_TYPES.TEXT },
  col_loaidoitac: { idx: 5, title: 'Loại đối tác', defaultWidth: 100, align: ALIGNMENTS.CENTER, dataType: DATA_TYPES.TEXT },
  col_nvgiaodich: { idx: 6, title: 'NV Giao Dịch', defaultWidth: 120, align: ALIGNMENTS.CENTER, dataType: DATA_TYPES.TEXT },
  col_doitac: { idx: 7, title: 'Đối tác', defaultWidth: 160, align: ALIGNMENTS.LEFT, dataType: DATA_TYPES.TEXT },
  col_hang: { idx: 8, title: 'Hãng', defaultWidth: 75, align: ALIGNMENTS.CENTER, dataType: DATA_TYPES.TEXT },
  col_dvcc: { idx: 9, title: 'ĐVCC', defaultWidth: 90, align: ALIGNMENTS.CENTER, dataType: DATA_TYPES.TEXT },
  col_sovevn: { idx: 10, title: 'Số Vé VN', defaultWidth: 135, align: ALIGNMENTS.CENTER, dataType: DATA_TYPES.TEXT },
  col_gianet: { idx: 11, title: 'Giá Net', defaultWidth: 120, align: ALIGNMENTS.RIGHT, dataType: DATA_TYPES.NUMBER, isCurrency: true },
  col_giahethong: { idx: 12, title: 'Giá Hệ Thống', defaultWidth: 120, align: ALIGNMENTS.RIGHT, dataType: DATA_TYPES.NUMBER, isCurrency: true },
  col_tongthu: { idx: 13, title: 'Tổng Thu', defaultWidth: 125, align: ALIGNMENTS.RIGHT, dataType: DATA_TYPES.NUMBER, isCurrency: true },
  col_phihoan: { idx: 14, title: 'Phí Hoàn', defaultWidth: 110, align: ALIGNMENTS.RIGHT, dataType: DATA_TYPES.NUMBER, isCurrency: true },
  col_thuhoick: { idx: 15, title: 'Thu hồi CK', defaultWidth: 110, align: ALIGNMENTS.RIGHT, dataType: DATA_TYPES.NUMBER, isCurrency: true },
  col_hanghoan: { idx: 16, title: 'Hãng Hoàn', defaultWidth: 115, align: ALIGNMENTS.RIGHT, dataType: DATA_TYPES.NUMBER, isCurrency: true },
  col_giahoan: { idx: 17, title: 'Giá Hoàn', defaultWidth: 115, align: ALIGNMENTS.RIGHT, dataType: DATA_TYPES.NUMBER, isCurrency: true },
  col_chenhlech: { idx: 18, title: 'Chênh lệch', defaultWidth: 115, align: ALIGNMENTS.RIGHT, dataType: DATA_TYPES.NUMBER, isCurrency: true },
  col_loinhuan: { idx: 19, title: 'Lợi Nhuận', defaultWidth: 120, align: ALIGNMENTS.RIGHT, dataType: DATA_TYPES.NUMBER, isCurrency: true },
  col_hangck: { idx: 20, title: 'Hãng CK', defaultWidth: 110, align: ALIGNMENTS.RIGHT, dataType: DATA_TYPES.NUMBER, isCurrency: true },
  col_tuxuat: { idx: 21, title: 'Tự xuất', defaultWidth: 85, align: ALIGNMENTS.CENTER, dataType: DATA_TYPES.TEXT },
  col_dsbooker: { idx: 22, title: 'DS Booker', defaultWidth: 120, align: ALIGNMENTS.RIGHT, dataType: DATA_TYPES.NUMBER, isCurrency: true },
};

export interface AirlineRowData {
  rowIndex: number;
  originalIndex: number;
  chunkIndex: number;
  id: string;
  cells: Map<string, { colKey: string; value: any; type: string }>;
  rawTuple: any[];
}

export const INITIAL_AIRLINE_COLUMNS: ColumnDef<AirlineRowData>[] = [
  // Cột hệ thống cố định
  {
    key: 'col_stt',
    title: 'STT',
    defaultWidth: 46,
    align: ALIGNMENTS.CENTER,
    resizable: false,
    sortable: false,
    disableHeaderContextMenu: true,
    editable: false,
    dataType: DATA_TYPES.SYSTEM,
  },
  {
    key: 'col_chk',
    title: '',
    defaultWidth: 32,
    align: ALIGNMENTS.CENTER,
    resizable: false,
    disableHeaderContextMenu: true,
    editable: false,
    dataType: DATA_TYPES.SYSTEM,
  },
  // 23 Cột dữ liệu thực tế từ ExGD-24-10-2026.xlsx
  ...Object.entries(AIRLINE_COL_DEF_MAP).map(([key, def]) => ({
    key,
    title: def.title,
    defaultWidth: def.defaultWidth,
    align: def.align,
    dataType: def.dataType,
    sortable: true,
    editable: true,
  })),
];

// Bảng ánh xạ tự động chuyển đổi cấu hình từ các phiên bản cũ sang chuẩn 23 cột mới
export const LEGACY_KEY_MAP: Record<string, string> = {
  col_pnr: 'col_macho',
  col_ten_khach: 'col_doitac',
  col_tenkhach: 'col_doitac',
  col_so_ve: 'col_sovevn',
  col_nha_cung_cap: 'col_doitac',
  col_tendaydu: 'col_doitac',
  col_loai_khach: 'col_loaidoitac',
  col_loaikhach: 'col_loaidoitac',
  col_ngay_gd: 'col_ngaygd',
  col_gia_net: 'col_gianet',
  col_gia_he_thong: 'col_giahethong',
  col_gia_thu: 'col_tongthu',
  col_giathu: 'col_tongthu',
  col_loi_nhuan: 'col_loinhuan',
  col_hang_ck: 'col_hangck',
  col_gia_hoan: 'col_giahoan',
  col_hang_hoan: 'col_hanghoan',
  col_name: 'col_loaive',
  col_bi_danh: 'col_loaidoitac',
};

// Memory store for raw tuples
let airlineRows: any[][] = [];
export const rowCache = new Map<number, AirlineRowData>();
let cachedEmptyColumns: Set<string> | null = null;

export function setAirlineDataset(rows: any[][]) {
  airlineRows = rows;
  rowCache.clear();
  cachedEmptyColumns = null;
}

export function getAirlineDatasetLength(): number {
  return airlineRows.length;
}

export function getRawAirlineDataset(): any[][] {
  return airlineRows;
}

export function getAirlineEmptyColumns(): Set<string> {
  if (cachedEmptyColumns) return cachedEmptyColumns;
  const emptyKeys = new Set<string>();
  if (!airlineRows || airlineRows.length === 0) return emptyKeys;

  const entries = Object.entries(AIRLINE_COL_DEF_MAP);
  for (const [key, def] of entries) {
    let hasVal = false;
    for (let r = 0; r < airlineRows.length; r++) {
      const v = airlineRows[r][def.idx];
      if (v !== null && v !== undefined && v !== '') {
        hasVal = true;
        break;
      }
    }
    if (!hasVal) {
      emptyKeys.add(key);
    }
  }
  cachedEmptyColumns = emptyKeys;
  return emptyKeys;
}

export function getFastAirlineCellVal(r: number, colKey: string): any {
  if (r < 0 || r >= airlineRows.length) return '';
  const tuple = airlineRows[r];
  if (!tuple) return '';

  if (colKey === 'col_stt') return r + 1;
  if (colKey === 'col_chk') return false;

  let def = AIRLINE_COL_DEF_MAP[colKey];
  if (!def) {
    const migratedKey = LEGACY_KEY_MAP[colKey];
    if (migratedKey) def = AIRLINE_COL_DEF_MAP[migratedKey];
  }
  if (!def) return '';

  const rawVal = tuple[def.idx];
  return rawVal ?? '';
}

export function getAirlineRowValueForSort(r: number, colKey: string): any {
  const val = getFastAirlineCellVal(r, colKey);
  const def = AIRLINE_COL_DEF_MAP[colKey];
  if (def && def.dataType === DATA_TYPES.NUMBER) {
    return typeof val === 'number' ? val : (val ? Number(val) : 0);
  }
  return String(val ?? '');
}

export function getAirlineRowData(
  r: number,
  chunkSize: number = DEFAULT_CHUNK_SIZE,
  displayIndex?: number,
  isCheckedState = false
): AirlineRowData {
  const effectiveRowIndex = displayIndex !== undefined ? displayIndex : r;
  const effectiveChunkIndex = Math.floor(effectiveRowIndex / chunkSize);

  const tuple = airlineRows[r] || [];
  const cells = new Map<string, { colKey: string; value: any; type: string }>();

  cells.set('col_stt', {
    colKey: 'col_stt',
    value: effectiveRowIndex + 1,
    type: 'stt',
  });

  cells.set('col_chk', {
    colKey: 'col_chk',
    value: isCheckedState,
    type: 'checkbox',
  });

  Object.entries(AIRLINE_COL_DEF_MAP).forEach(([key, def]) => {
    const val = tuple[def.idx] ?? '';
    cells.set(key, {
      colKey: key,
      value: val,
      type: def.dataType,
    });
  });

  return {
    rowIndex: effectiveRowIndex,
    originalIndex: r,
    chunkIndex: effectiveChunkIndex,
    id: `row-${r}`,
    cells,
    rawTuple: tuple,
  };
}

export function updateAirlineCellValue(r: number, colKey: string, newValue: any) {
  if (r < 0 || r >= airlineRows.length) return;
  const def = AIRLINE_COL_DEF_MAP[colKey];
  if (!def) return;
  let valToSave = newValue;
  if (def.dataType === DATA_TYPES.NUMBER) {
    valToSave = Number(String(newValue).replace(/,/g, '')) || 0;
  }
  airlineRows[r][def.idx] = valToSave;
  rowCache.delete(r);
}

export function hasAirlineColumnEmptyCells(colKey: string): boolean {
  const def = AIRLINE_COL_DEF_MAP[colKey];
  if (!def) return false;
  const idx = def.idx;
  const len = Math.min(airlineRows.length, 2000);
  for (let i = 0; i < len; i++) {
    const v = airlineRows[i]?.[idx];
    if (v === '' || v === null || v === undefined) return true;
  }
  return false;
}

export function getAirlineColumnDateBounds(colKey: string): { min: string; max: string } {
  return { min: '01/03/2026', max: '30/09/2026' };
}

export function matchAirlineFilterValue(
  cellVal: any,
  op: FilterOperation,
  targetVal: string,
  dataType: string,
  filterObj?: ColumnFilterValue
): boolean {
  return matchFilterValue(cellVal, op, targetVal, dataType, filterObj);
}

