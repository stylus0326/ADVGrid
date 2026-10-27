import {
  ColumnDef,
  BaseGroupDef,
  ALIGNMENTS,
  DATA_TYPES,
  EDITOR_TYPES,
  FORMULA_MODES,
  FormulaMode,
  MONTH_ANALYTICS_MODES,
  MonthAnalyticsMode,
} from '../components/grid/types';

export { FORMULA_MODES, MONTH_ANALYTICS_MODES };
export type { FormulaMode, MonthAnalyticsMode };

export const FORMULA_CYCLE: FormulaMode[] = [
  FORMULA_MODES.AVG,
  FORMULA_MODES.SUM,
  FORMULA_MODES.MIN,
  FORMULA_MODES.MAX,
];
export const FORMULA_META: Record<
  FormulaMode,
  { label: string; short: string; badgeDark: string; badgeLight: string }
> = {
  [FORMULA_MODES.AVG]: {
    label: 'Trung Bình (AVG)',
    short: 'TB',
    badgeDark: 'bg-sky-950 text-sky-300 border-sky-600/60',
    badgeLight: 'bg-sky-50 text-sky-800 border-sky-300',
  },
  [FORMULA_MODES.SUM]: {
    label: 'Tổng Cộng (SUM)',
    short: 'TỔNG',
    badgeDark: 'bg-indigo-950 text-indigo-300 border-indigo-500/60',
    badgeLight: 'bg-indigo-50 text-indigo-800 border-indigo-300',
  },
  [FORMULA_MODES.MIN]: {
    label: 'Thấp Nhất (MIN)',
    short: 'MIN',
    badgeDark: 'bg-rose-950 text-rose-300 border-rose-500/60',
    badgeLight: 'bg-rose-50 text-rose-800 border-rose-300',
  },
  [FORMULA_MODES.MAX]: {
    label: 'Cao Nhất (MAX)',
    short: 'MAX',
    badgeDark: 'bg-emerald-950 text-emerald-300 border-emerald-500/60',
    badgeLight: 'bg-emerald-50 text-emerald-800 border-emerald-300',
  },
};

export const REGIONS = ['VN-SGN-01', 'VN-HAN-02', 'SG-SIN-01', 'JP-TYO-03', 'US-WST-02', 'DE-FRA-01'];

export interface FilterState {
  onlyChecked: boolean;
  status: {
    ONLINE: boolean;
    DEGRADED: boolean;
    OVERLOAD: boolean;
  };
  regions: Record<string, boolean>;
  highCpu: boolean;
  lowSla: boolean;
}

export const DEFAULT_FILTERS: FilterState = {
  onlyChecked: false,
  status: {
    ONLINE: true,
    DEGRADED: true,
    OVERLOAD: true,
  },
  regions: REGIONS.reduce((acc, r) => ({ ...acc, [r]: true }), {}),
  highCpu: false,
  lowSla: false,
};

/**
 * Cấu trúc đối tượng JSON thuần túy (Plain JSON Record) trả về từ API backend
 */
export interface GridRecord {
  col_id: string;
  col_node: string;
  col_status: 'ONLINE' | 'DEGRADED' | 'OVERLOAD';
  col_region: string;
  col_int_req: number;
  col_dec_cpu: number;
  col_dec_ram: number;
  col_date: string;
  col_datetime: string;
  col_time: string;
  col_daterange: string;
  col_m1: number;
  col_m2: number;
  col_m3: number;
  col_m4: number;
  col_m5: number;
  col_m6: number;
  col_m7: number;
  col_m8: number;
  col_m9: number;
  col_m10: number;
  col_m11: number;
  col_m12: number;
  col_formula?: number;
  col_int_iops: number;
  col_dec_p99: number;
  col_dec_sla: number;
}

/**
 * Khai báo danh sách cột của Bảng theo chuẩn Data-Driven
 */
export const INITIAL_COLUMNS: ColumnDef<GridRecord>[] = [
  // Cột gốc độc lập
  { key: 'col_stt', title: 'STT', defaultWidth: 46, align: ALIGNMENTS.CENTER, resizable: false, sortable: false, disableHeaderContextMenu: true, editable: false, dataType: DATA_TYPES.SYSTEM, isRowNumber: true },
  { key: 'col_chk', title: '', defaultWidth: 32, align: ALIGNMENTS.CENTER, resizable: false, disableHeaderContextMenu: true, editable: false, dataType: DATA_TYPES.SYSTEM, isSelection: true },
  { key: 'col_id', title: 'Mã Dòng', defaultWidth: 120, align: ALIGNMENTS.LEFT, dataType: DATA_TYPES.TEXT },
  { key: 'col_chunk', title: 'Chunk #', defaultWidth: 95, align: ALIGNMENTS.CENTER, dataType: DATA_TYPES.NUMBER },
  { key: 'col_node', title: 'Mã Node', defaultWidth: 115, align: ALIGNMENTS.LEFT, dataType: DATA_TYPES.TEXT },
  { key: 'col_status', title: 'Trạng Thái', defaultWidth: 120, align: ALIGNMENTS.CENTER, dataType: DATA_TYPES.TEXT, editorType: EDITOR_TYPES.COMBOBOX },
  { key: 'col_region', title: 'Khu Vực', defaultWidth: 110, align: ALIGNMENTS.LEFT, dataType: DATA_TYPES.TEXT, editorType: EDITOR_TYPES.LOOKUP, className: 'agv-cell-code' },

  // Cột Hạ Tầng
  { key: 'col_int_req', title: 'Request', defaultWidth: 120, align: ALIGNMENTS.RIGHT, dataType: DATA_TYPES.NUMBER },
  { key: 'col_dec_cpu', title: 'CPU %', defaultWidth: 140, align: ALIGNMENTS.RIGHT, dataType: DATA_TYPES.NUMBER },
  { key: 'col_dec_ram', title: 'RAM GB', defaultWidth: 145, align: ALIGNMENTS.RIGHT, dataType: DATA_TYPES.NUMBER },

  // Cột Mốc Thời Gian
  { key: 'col_date', title: 'Ngày Tạo', defaultWidth: 125, align: ALIGNMENTS.CENTER, dataType: DATA_TYPES.DATE, editorType: EDITOR_TYPES.DATE },
  { key: 'col_datetime', title: 'Cập Nhật', defaultWidth: 165, align: ALIGNMENTS.CENTER, dataType: DATA_TYPES.DATE, editorType: EDITOR_TYPES.DATE, showTime: true },
  { key: 'col_time', title: 'Giờ Chốt', defaultWidth: 130, minWidth: 105, align: ALIGNMENTS.CENTER, dataType: DATA_TYPES.TIME, editorType: EDITOR_TYPES.TIME },
  { key: 'col_daterange', title: 'Lịch Trình', defaultWidth: 230, align: ALIGNMENTS.CENTER, dataType: DATA_TYPES.DATE, editorType: EDITOR_TYPES.DATERANGE, isDateRange: true },

  // 12 Cột Tháng
  { key: 'col_m1', title: 'Tháng 01', defaultWidth: 100, align: ALIGNMENTS.RIGHT, dataType: DATA_TYPES.NUMBER },
  { key: 'col_m2', title: 'Tháng 02', defaultWidth: 100, align: ALIGNMENTS.RIGHT, dataType: DATA_TYPES.NUMBER },
  { key: 'col_m3', title: 'Tháng 03', defaultWidth: 100, align: ALIGNMENTS.RIGHT, dataType: DATA_TYPES.NUMBER },
  { key: 'col_m4', title: 'Tháng 04', defaultWidth: 100, align: ALIGNMENTS.RIGHT, dataType: DATA_TYPES.NUMBER },
  { key: 'col_m5', title: 'Tháng 05', defaultWidth: 100, align: ALIGNMENTS.RIGHT, dataType: DATA_TYPES.NUMBER },
  { key: 'col_m6', title: 'Tháng 06', defaultWidth: 100, align: ALIGNMENTS.RIGHT, dataType: DATA_TYPES.NUMBER },
  { key: 'col_m7', title: 'Tháng 07', defaultWidth: 100, align: ALIGNMENTS.RIGHT, dataType: DATA_TYPES.NUMBER },
  { key: 'col_m8', title: 'Tháng 08', defaultWidth: 100, align: ALIGNMENTS.RIGHT, dataType: DATA_TYPES.NUMBER },
  { key: 'col_m9', title: 'Tháng 09', defaultWidth: 100, align: ALIGNMENTS.RIGHT, dataType: DATA_TYPES.NUMBER },
  { key: 'col_m10', title: 'Tháng 10', defaultWidth: 100, align: ALIGNMENTS.RIGHT, dataType: DATA_TYPES.NUMBER },
  { key: 'col_m11', title: 'Tháng 11', defaultWidth: 100, align: ALIGNMENTS.RIGHT, dataType: DATA_TYPES.NUMBER },
  { key: 'col_m12', title: 'Tháng 12', defaultWidth: 100, align: ALIGNMENTS.RIGHT, dataType: DATA_TYPES.NUMBER },

  // Công thức & Chart
  { key: 'col_chart', title: 'Biểu Đồ 12 Tháng', defaultWidth: 150, minWidth: 150, align: ALIGNMENTS.CENTER, sortable: false, filterable: false, editable: false, disableContextMenu: true, isChart: true, cellPadding: 'px-[2px]' },
  { key: 'col_formula', title: 'Công Thức 12T', defaultWidth: 160, align: ALIGNMENTS.RIGHT, editable: false, dataType: DATA_TYPES.NUMBER, isFormula: true },

  // Chỉ số SLA
  { key: 'col_int_iops', title: 'IOPS', defaultWidth: 115, align: ALIGNMENTS.RIGHT, dataType: DATA_TYPES.NUMBER },
  { key: 'col_dec_p99', title: 'P99 ms', defaultWidth: 145, align: ALIGNMENTS.RIGHT, dataType: DATA_TYPES.NUMBER },
  { key: 'col_dec_sla', title: 'SLA %', defaultWidth: 140, align: ALIGNMENTS.RIGHT, dataType: DATA_TYPES.NUMBER },
];

/**
 * Khai báo Banded Columns 2 tầng
 */
export const BASE_GROUPS_DEF: BaseGroupDef[] = [
  { id: 'grp_stt', title: 'STT', isStandalone: true, keys: ['col_stt'] },
  { id: 'grp_chk', title: '', isStandalone: true, keys: ['col_chk'] },
  { id: 'grp_id', title: 'Mã Dòng', isStandalone: true, keys: ['col_id'] },
  { id: 'grp_chunk', title: 'Chunk #', isStandalone: true, keys: ['col_chunk'] },
  { id: 'grp_node', title: 'Mã Node', isStandalone: true, keys: ['col_node'] },
  { id: 'grp_status', title: 'Trạng Thái', isStandalone: true, keys: ['col_status'] },
  { id: 'grp_region', title: 'Khu Vực', isStandalone: true, keys: ['col_region'] },

  {
    id: 'grp_infra',
    title: 'Tài Nguyên Hạ Tầng',
    isStandalone: false,
    keys: ['col_int_req', 'col_dec_cpu', 'col_dec_ram'],
  },
  {
    id: 'grp_time',
    title: 'Mốc Thời Gian',
    isStandalone: false,
    keys: ['col_date', 'col_datetime', 'col_time', 'col_daterange'],
  },
  {
    id: 'grp_analytics',
    title: 'Phân Tích Chu Kỳ Năm & Công Thức',
    isStandalone: false,
    isToggleable: true,
    isAtomic: true,
    isCollapsed: true,
    keys: ['col_chart', 'col_formula'],
  },
  {
    id: 'grp_perf',
    title: 'Chỉ Số SLA & Hiệu Năng',
    isStandalone: false,
    keys: ['col_int_iops', 'col_dec_p99', 'col_dec_sla'],
  },
];

/**
 * TẦNG GỌI API (API SERVICE LAYER)
 * 
 * Khi kết nối với API backend thật:
 * Mở comment phần `fetch('/api/...')` và thay URL endpoint của bạn.
 */
export async function fetchGridData(count: number = 50000): Promise<GridRecord[]> {
  // =========================================================================
  // 🔌 CẤU HÌNH API BACKEND THỰC TẾ:
  //
  // try {
  //   const res = await fetch('/api/v1/grid-records');
  //   if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  //   const json = await res.json();
  //   return json.data ?? json; // Trả về mảng Plain JSON Records từ backend
  // } catch (err) {
  //   console.error('Lỗi khi gọi API:', err);
  //   throw err;
  // }
  // =========================================================================

  // Giả lập độ trễ mạng async (Network Latency) 100ms
  await new Promise((resolve) => setTimeout(resolve, 100));

  const records: GridRecord[] = new Array(count);

  for (let r = 0; r < count; r++) {
    const seed = ((r + 1) * 2654435761) >>> 0;
    const statusRoll = (r * 17 + 3) % 10;
    const status: 'ONLINE' | 'DEGRADED' | 'OVERLOAD' =
      statusRoll < 7 ? 'ONLINE' : statusRoll < 9 ? 'DEGRADED' : 'OVERLOAD';

    const day = String((r % 28) + 1).padStart(2, '0');
    const month = String(((r * 3) % 12) + 1).padStart(2, '0');
    const year = 2017 + (r % 11);
    const hour = String((r * 7) % 24).padStart(2, '0');
    const minute = String((r * 13) % 60).padStart(2, '0');

    // 12 tháng số liệu dạng plain number
    const mVals: number[] = [];
    let sumVal = 0;
    for (let m = 0; m < 12; m++) {
      const v = Math.round((Math.sin(r * 0.1 + m * 0.5) * 40 + 55 + (seed % 15)) * 10) / 10;
      mVals.push(v);
      sumVal += v;
    }

    const rangeDay = (r % 23) + 1;

    records[r] = {
      col_id: `ROW-${String(r + 1).padStart(6, '0')}`,
      col_node: `NODE-${String(((r * 7) % 8999) + 1000)}`,
      col_status: status,
      col_region: r % 19 === 0 ? '' : REGIONS[r % REGIONS.length],
      col_int_req: (seed % 95000) + 5000,
      col_dec_cpu: Math.round(((seed % 8800) / 100 + 8.25) * 100) / 100,
      col_dec_ram: Math.round(((seed % 6000) / 100 + 4.5) * 100) / 100,
      col_date: `${day}/${month}/${year}`,
      col_datetime: `${day}/${month}/${year} ${hour}:${minute}`,
      col_time: `${hour}:${minute}`,
      col_daterange: r % 19 === 0 ? '' : `${String(rangeDay).padStart(2, '0')}/${month}/${year} - ${String(rangeDay + 5).padStart(2, '0')}/${month}/${year}`,
      col_m1: mVals[0],
      col_m2: mVals[1],
      col_m3: mVals[2],
      col_m4: mVals[3],
      col_m5: mVals[4],
      col_m6: mVals[5],
      col_m7: mVals[6],
      col_m8: mVals[7],
      col_m9: mVals[8],
      col_m10: mVals[9],
      col_m11: mVals[10],
      col_m12: mVals[11],
      col_formula: Math.round((sumVal / 12) * 100) / 100,
      col_int_iops: (seed % 48000) + 1200,
      col_dec_p99: Math.round(((seed % 9200) / 100 + 11.4) * 100) / 100,
      col_dec_sla: status === 'ONLINE' ? 99.8 : status === 'DEGRADED' ? 98.4 : 94.2,
    };
  }

  return records;
}

/**
 * Cập nhật một ô dữ liệu qua API backend (PATCH / PUT)
 */
export async function updateGridRecordApi(
  id: string,
  colKey: string,
  newValue: any
): Promise<boolean> {
  // try {
  //   const res = await fetch(`/api/v1/grid-records/${id}`, {
  //     method: 'PATCH',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ [colKey]: newValue }),
  //   });
  //   return res.ok;
  // } catch {
  //   return false;
  // }
  return true;
}

/**
 * Tham số gửi lên API xuất Excel
 */
export interface ExportExcelParams {
  scope: 'all' | 'group';
  filename?: string;
  groupKey?: string;
  groupValue?: string;
  columns?: ColumnDef<GridRecord>[];
  groupsDef?: BaseGroupDef[];
  records?: GridRecord[];
  rowIndices?: number[];
  groupedData?: any[] | null;
  getRowVal?: (rowIndex: number, colKey: string) => any;
  filters?: Record<string, any>;
  searchQuery?: string;
}

/**
 * Bảng mã CRC32 tối ưu cho nén ZIP chuẩn OpenXML
 */
const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c >>> 0;
  }
  return table;
})();

function computeCrc32(buf: Uint8Array): number {
  let crc = 0 ^ -1;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ CRC_TABLE[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ -1) >>> 0;
}

function getExcelColName(colIdx: number): string {
  let temp = colIdx + 1;
  let letter = '';
  while (temp > 0) {
    const mod = (temp - 1) % 26;
    letter = String.fromCharCode(65 + mod) + letter;
    temp = Math.floor((temp - mod) / 26);
  }
  return letter;
}

function escapeXml(str: any): string {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Nén dữ liệu theo chuẩn Deflate-raw bằng Web Streams API có sẵn trong trình duyệt (Zero-Dependency)
 */
async function compressDeflateRaw(bytes: Uint8Array): Promise<Uint8Array> {
  if (typeof CompressionStream !== 'undefined') {
    try {
      const cs = new CompressionStream('deflate-raw');
      const writer = cs.writable.getWriter();
      writer.write(bytes as any);
      writer.close();
      const reader = cs.readable.getReader();
      const chunks: Uint8Array[] = [];
      let totalLen = 0;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) {
          chunks.push(value);
          totalLen += value.length;
        }
      }
      const out = new Uint8Array(totalLen);
      let offset = 0;
      for (const chunk of chunks) {
        out.set(chunk, offset);
        offset += chunk.length;
      }
      return out;
    } catch {
      return bytes;
    }
  }
  return bytes;
}

/**
 * Động cơ đóng gói file ZIP .xlsx chuẩn OpenXML có nén Deflate (Method 8) (Zero-Dependency)
 * Tự động nén Deflate giúp giảm dung lượng 50.000 dòng từ 37.2 MB xuống chỉ còn ~1.6 MB
 */
async function createXlsxZip(files: { name: string; content: string }[]): Promise<Uint8Array> {
  const encoder = new TextEncoder();
  const fileEntries: {
    nameBuf: Uint8Array;
    crc: number;
    compressedSize: number;
    rawSize: number;
    method: number;
    offset: number;
  }[] = [];
  let offset = 0;

  const processedFiles = await Promise.all(
    files.map(async (f) => {
      const rawBuf = encoder.encode(f.content);
      const nameBuf = encoder.encode(f.name);
      const crc = computeCrc32(rawBuf);
      const compressedBuf = await compressDeflateRaw(rawBuf);
      const useDeflate = compressedBuf.length < rawBuf.length;
      return {
        nameBuf,
        dataBuf: useDeflate ? compressedBuf : rawBuf,
        crc,
        rawSize: rawBuf.length,
        compressedSize: useDeflate ? compressedBuf.length : rawBuf.length,
        method: useDeflate ? 8 : 0,
      };
    })
  );

  let totalLocalSize = 0;
  processedFiles.forEach((f) => {
    totalLocalSize += 30 + f.nameBuf.length + f.compressedSize;
  });

  let totalCdSize = 0;
  processedFiles.forEach((f) => {
    totalCdSize += 46 + f.nameBuf.length;
  });

  const totalSize = totalLocalSize + totalCdSize + 22;
  const out = new Uint8Array(totalSize);
  const view = new DataView(out.buffer);

  // 1. Ghi Local Headers & Dữ liệu file (Method 8 Deflate hoặc Method 0 Store)
  processedFiles.forEach((f) => {
    const localOffset = offset;
    view.setUint32(offset, 0x04034b50, true);
    view.setUint16(offset + 4, 20, true);      // Version 2.0 (hỗ trợ Deflate)
    view.setUint16(offset + 6, 0x0800, true);  // cờ UTF-8
    view.setUint16(offset + 8, f.method, true); // 8: Deflate, 0: Store
    view.setUint16(offset + 10, 0, true);
    view.setUint16(offset + 12, 0, true);
    view.setUint32(offset + 14, f.crc, true);
    view.setUint32(offset + 18, f.compressedSize, true);
    view.setUint32(offset + 22, f.rawSize, true);
    view.setUint16(offset + 26, f.nameBuf.length, true);
    view.setUint16(offset + 28, 0, true);

    offset += 30;
    out.set(f.nameBuf, offset);
    offset += f.nameBuf.length;
    out.set(f.dataBuf, offset);
    offset += f.compressedSize;

    fileEntries.push({
      nameBuf: f.nameBuf,
      crc: f.crc,
      compressedSize: f.compressedSize,
      rawSize: f.rawSize,
      method: f.method,
      offset: localOffset,
    });
  });

  // 2. Ghi Central Directory
  const cdOffset = offset;
  fileEntries.forEach((e) => {
    view.setUint32(offset, 0x02014b50, true);
    view.setUint16(offset + 4, 20, true);
    view.setUint16(offset + 6, 20, true);
    view.setUint16(offset + 8, 0x0800, true);
    view.setUint16(offset + 10, e.method, true);
    view.setUint16(offset + 12, 0, true);
    view.setUint16(offset + 14, 0, true);
    view.setUint32(offset + 16, e.crc, true);
    view.setUint32(offset + 20, e.compressedSize, true);
    view.setUint32(offset + 24, e.rawSize, true);
    view.setUint16(offset + 28, e.nameBuf.length, true);
    view.setUint16(offset + 30, 0, true);
    view.setUint16(offset + 32, 0, true);
    view.setUint16(offset + 34, 0, true);
    view.setUint16(offset + 36, 0, true);
    view.setUint32(offset + 38, 0, true);
    view.setUint32(offset + 42, e.offset, true);

    offset += 46;
    out.set(e.nameBuf, offset);
    offset += e.nameBuf.length;
  });

  // 3. Ghi End of Central Directory
  const cdSize = offset - cdOffset;
  view.setUint32(offset, 0x06054b50, true);
  view.setUint16(offset + 4, 0, true);
  view.setUint16(offset + 6, 0, true);
  view.setUint16(offset + 8, processedFiles.length, true);
  view.setUint16(offset + 10, processedFiles.length, true);
  view.setUint32(offset + 12, cdSize, true);
  view.setUint32(offset + 16, cdOffset, true);
  view.setUint16(offset + 20, 0, true);

  return out;
}

/**
 * Chuyển đổi ngày tháng / giờ sang Excel Serial Date Number
 * Hệ thống 1900 Date System của Excel: mốc 1899-12-30 UTC tương ứng serial 0.
 * Ngày 01/01/1900 là serial 1.
 */
function parseToExcelSerialDate(val: any): { serial: number; hasTime: boolean; isTimeOnly: boolean } | null {
  if (val === null || val === undefined || val === '') return null;

  if (val instanceof Date) {
    if (isNaN(val.getTime())) return null;
    const utcMs = Date.UTC(
      val.getFullYear(),
      val.getMonth(),
      val.getDate(),
      val.getHours(),
      val.getMinutes(),
      val.getSeconds(),
      val.getMilliseconds()
    );
    const excelEpoch = Date.UTC(1899, 11, 30);
    const serial = (utcMs - excelEpoch) / 86400000;
    const hasTime = val.getHours() !== 0 || val.getMinutes() !== 0 || val.getSeconds() !== 0;
    return { serial, hasTime, isTimeOnly: false };
  }

  const str = String(val).trim();
  if (!str) return null;

  // Nếu là daterange (có dấu gạch ngang nối 2 khoảng ngày) -> giữ nguyên text
  if (str.includes(' - ')) return null;

  // Định dạng chỉ có giờ: "HH:mm" hoặc "HH:mm:ss"
  if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(str)) {
    const parts = str.split(':');
    const h = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    const s = parts[2] ? parseInt(parts[2], 10) : 0;
    if (h >= 0 && h < 24 && m >= 0 && m < 60 && s >= 0 && s < 60) {
      const serial = (h * 3600 + m * 60 + s) / 86400;
      return { serial, hasTime: true, isTimeOnly: true };
    }
    return null;
  }

  // Tách ngày và giờ nếu có
  const spaceIdx = str.indexOf(' ');
  const datePart = spaceIdx !== -1 ? str.slice(0, spaceIdx) : str;
  const timePart = spaceIdx !== -1 ? str.slice(spaceIdx + 1).trim() : '';

  let day = 0;
  let month = 0;
  let year = 0;

  if (datePart.includes('/')) {
    const parts = datePart.split('/');
    if (parts.length === 3) {
      day = parseInt(parts[0], 10);
      month = parseInt(parts[1], 10);
      year = parseInt(parts[2], 10);
    }
  } else if (datePart.includes('-')) {
    const parts = datePart.split('-');
    if (parts.length === 3) {
      if (parts[0].length === 4) {
        year = parseInt(parts[0], 10);
        month = parseInt(parts[1], 10);
        day = parseInt(parts[2], 10);
      } else {
        day = parseInt(parts[0], 10);
        month = parseInt(parts[1], 10);
        year = parseInt(parts[2], 10);
      }
    }
  }

  if (!day || !month || !year || isNaN(day) || isNaN(month) || isNaN(year)) {
    return null;
  }

  if (month < 1 || month > 12 || day < 1 || day > 31 || year < 1900 || year > 2200) {
    return null;
  }

  let h = 0;
  let m = 0;
  let s = 0;
  let hasTime = false;

  if (timePart) {
    const timeParts = timePart.split(':');
    if (timeParts.length >= 2) {
      h = parseInt(timeParts[0], 10) || 0;
      m = parseInt(timeParts[1], 10) || 0;
      s = timeParts[2] ? parseInt(timeParts[2], 10) : 0;
      hasTime = true;
    }
  }

  const utcMs = Date.UTC(year, month - 1, day, h, m, s);
  const excelEpoch = Date.UTC(1899, 11, 30);
  const serial = (utcMs - excelEpoch) / 86400000;
  return { serial, hasTime, isTimeOnly: false };
}

/**
 * TẦNG GỌI API: Xuất Excel qua Backend Service
 * Khi kết nối backend thật: Backend sinh file .xlsx và stream Blob về trình duyệt
 * Trong chế độ demo: Tự động tạo file .xlsx chuẩn OpenXML với đầy đủ:
 *  - Mặc định kẻ viền (border) sẵn toàn bộ các ô bảng tính
 *  - Tô màu tiêu đề 2 tầng (Tầng 1 Navy #0F172A, Tầng 2 Slate #1E293B, chữ trắng in đậm)
 *  - Tắt đường lưới mờ của Excel (showGridLines="0") giúp trang tính trắng sạch chuyên nghiệp
 *  - Bật sẵn tính năng AutoFilter của Excel trên hàng tiêu đề cột con
 *  - Phân tầng dòng nhóm (Group Header) in đậm nền #F1F5F9 kèm tổng số lượng và sum cột số
 *  - Format số có phân cách hàng nghìn #,##0 và #,##0.00 (số âm trong ngoặc đơn)
 *  - Tự động co giãn độ rộng cột chống lỗi tràn ô ###
 */
export async function exportGridExcelApi(
  params: ExportExcelParams,
  dataFallback?: { headers: string[]; rows: (string | number)[][] }
): Promise<boolean> {
  // =========================================================================
  // 🔌 CẤU HÌNH API BACKEND THỰC TẾ:
  //
  // try {
  //   const res = await fetch('/api/v1/grid-records/export-excel', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify(params),
  //   });
  //   if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  //   const blob = await res.blob();
  //   const downloadUrl = window.URL.createObjectURL(blob);
  //   const a = document.createElement('a');
  //   a.href = downloadUrl;
  //   a.download = `${params.filename || 'Export'}.xlsx`;
  //   document.body.appendChild(a);
  //   a.click();
  //   a.remove();
  //   window.URL.revokeObjectURL(downloadUrl);
  //   return true;
  // } catch (err) {
  //   console.error('Lỗi khi gọi API xuất Excel:', err);
  //   throw err;
  // }
  // =========================================================================

  // Giả lập độ trễ mạng khi gọi API backend (150ms)
  await new Promise((resolve) => setTimeout(resolve, 150));

  try {
    const { columns = [], groupsDef = [], records = [], rowIndices, groupedData, getRowVal } = params;

    const totalCols = columns.length;
    if (totalCols === 0) return false;

    const colWidths: number[] = new Array(totalCols).fill(12);

    // Ánh xạ Band cha sang các cột con
    const colToBand: Record<string, string> = {};
    groupsDef.forEach((g) => {
      if (!g.isStandalone && g.title) {
        g.keys.forEach((k) => {
          colToBand[k] = g.title;
        });
      }
    });

    const mergeCells: string[] = [];

    // 1. TẠO TIÊU ĐỀ 2 TẦNG (BANDED HEADERS)
    // Tầng 1 (Row 1): Nền Navy #0F172A, chữ trắng in đậm (s="1")
    // Tầng 2 (Row 2): Nền Slate #1E293B, chữ trắng in đậm (s="2")
    let row1Cells = '';
    let row2Cells = '';

    let cIdx = 0;
    while (cIdx < totalCols) {
      const col = columns[cIdx];
      const bandTitle = colToBand[col.key];
      const colLetter = getExcelColName(cIdx);

      if (!bandTitle) {
        // Cột độc lập: Merge dọc dòng 1 và dòng 2
        row1Cells += `<c r="${colLetter}1" s="1" t="inlineStr"><is><t>${escapeXml(col.title || col.key)}</t></is></c>`;
        row2Cells += `<c r="${colLetter}2" s="2" t="inlineStr"><is><t></t></is></c>`;
        mergeCells.push(`${colLetter}1:${colLetter}2`);
        colWidths[cIdx] = Math.max(colWidths[cIdx], (col.title || col.key).length + 5);
        cIdx++;
      } else {
        // Cột thuộc nhóm Band: Tìm điểm kết thúc của Band này
        let endIdx = cIdx;
        while (endIdx + 1 < totalCols && colToBand[columns[endIdx + 1].key] === bandTitle) {
          endIdx++;
        }

        const startLetter = getExcelColName(cIdx);
        const endLetter = getExcelColName(endIdx);

        // Tầng 1: Tên Band cha (Merge ngang từ startLetter -> endLetter)
        row1Cells += `<c r="${startLetter}1" s="1" t="inlineStr"><is><t>${escapeXml(bandTitle)}</t></is></c>`;
        for (let i = cIdx + 1; i <= endIdx; i++) {
          row1Cells += `<c r="${getExcelColName(i)}1" s="1" t="inlineStr"><is><t></t></is></c>`;
        }
        if (endIdx > cIdx) {
          mergeCells.push(`${startLetter}1:${endLetter}1`);
        }

        // Tầng 2: Tên từng Cột con
        for (let i = cIdx; i <= endIdx; i++) {
          const subCol = columns[i];
          const subLetter = getExcelColName(i);
          row2Cells += `<c r="${subLetter}2" s="2" t="inlineStr"><is><t>${escapeXml(subCol.title || subCol.key)}</t></is></c>`;
          colWidths[i] = Math.max(colWidths[i], (subCol.title || subCol.key).length + 5);
        }
        cIdx = endIdx + 1;
      }
    }

    const rowNodes: string[] = [`<row r="1">${row1Cells}</row>`, `<row r="2">${row2Cells}</row>`];
    let currRow = 3;

    // Helper render ô dữ liệu chuẩn OpenXML với style border và format
    const renderCellXml = (rowNum: number, cIdxLocal: number, col: ColumnDef<GridRecord>, rawVal: any): string => {
      const colLetter = getExcelColName(cIdxLocal);
      const cellRef = `${colLetter}${rowNum}`;

      if (rawVal === undefined || rawVal === null || rawVal === '') {
        return `<c r="${cellRef}" s="6" t="inlineStr"><is><t></t></is></c>`;
      }

      if (col.dataType === DATA_TYPES.NUMBER) {
        const num = Number(rawVal);
        if (isNaN(num)) {
          return `<c r="${cellRef}" s="6" t="inlineStr"><is><t>${escapeXml(rawVal)}</t></is></c>`;
        }
        const isInt = col.key.includes('_int_') || col.key === 'col_chunk' || col.key === 'col_stt';
        colWidths[cIdxLocal] = Math.max(colWidths[cIdxLocal], String(rawVal).length + 6);
        return `<c r="${cellRef}" s="${isInt ? 7 : 8}"><v>${num}</v></c>`;
      }

      if (col.dataType === DATA_TYPES.DATE || col.key === 'col_date' || col.key === 'col_datetime' || col.key === 'col_time') {
        const parsed = parseToExcelSerialDate(rawVal);
        if (parsed !== null) {
          const styleIdx = parsed.isTimeOnly ? 11 : parsed.hasTime ? 10 : 9;
          colWidths[cIdxLocal] = Math.max(colWidths[cIdxLocal], parsed.hasTime ? 18 : 14);
          // Ghi ô kiểu số thực serial với style Date numFmt để Excel kích hoạt Date Filters & Date Hierarchy
          return `<c r="${cellRef}" s="${styleIdx}"><v>${parsed.serial}</v></c>`;
        }
        const strVal = String(rawVal);
        colWidths[cIdxLocal] = Math.max(colWidths[cIdxLocal], strVal.length + 4);
        return `<c r="${cellRef}" s="6" t="inlineStr"><is><t>${escapeXml(strVal)}</t></is></c>`;
      }

      const strVal = String(rawVal);
      colWidths[cIdxLocal] = Math.max(colWidths[cIdxLocal], strVal.length + 4);
      return `<c r="${cellRef}" s="6" t="inlineStr"><is><t>${escapeXml(strVal)}</t></is></c>`;
    };

    // 2. GHI DỮ LIỆU: PHÂN TẦNG NHÓM (GROUP ROWS) HOẶC BẢNG PHẲNG
    if (groupedData && groupedData.length > 0) {
      groupedData.forEach((item) => {
        if (item._isGroupRow) {
          // Dòng tiêu đề Nhóm (Group Header Row): Nền #F1F5F9, chữ đậm #0F172A
          let groupCells = '';
          const groupLabel = `▶ [${item.groupColumnTitle || 'Nhóm'}]: ${item.groupValue} (${item.count} bản ghi)`;
          groupCells += `<c r="A${currRow}" s="3" t="inlineStr"><is><t>${escapeXml(groupLabel)}</t></is></c>`;

          // Điền tổng nhóm (Group Sums) vào các cột số
          for (let i = 1; i < totalCols; i++) {
            const col = columns[i];
            const colLetter = getExcelColName(i);
            const sumVal = item.groupSums ? item.groupSums[col.key] : undefined;

            if (sumVal !== undefined && sumVal !== null) {
              const num = Number(sumVal);
              const isInt = col.key.includes('_int_') || col.key === 'col_chunk';
              groupCells += `<c r="${colLetter}${currRow}" s="${isInt ? 4 : 5}"><v>${num}</v></c>`;
            } else {
              groupCells += `<c r="${colLetter}${currRow}" s="3" t="inlineStr"><is><t></t></is></c>`;
            }
          }

          rowNodes.push(`<row r="${currRow}">${groupCells}</row>`);
          currRow++;
        } else {
          // Dòng con thuộc nhóm
          const rowIdx = item.originalIndex;
          let childCells = '';
          for (let i = 0; i < totalCols; i++) {
            const col = columns[i];
            const val = getRowVal ? getRowVal(rowIdx, col.key) : (records[rowIdx] as any)?.[col.key];
            childCells += renderCellXml(currRow, i, col, val);
          }
          rowNodes.push(`<row r="${currRow}">${childCells}</row>`);
          currRow++;
        }
      });
    } else {
      // Bảng phẳng không gom nhóm
      const indices = rowIndices || Array.from({ length: records.length }, (_, i) => i);
      indices.forEach((rowIdx) => {
        let cellLine = '';
        for (let i = 0; i < totalCols; i++) {
          const col = columns[i];
          const val = getRowVal ? getRowVal(rowIdx, col.key) : (records[rowIdx] as any)?.[col.key];
          cellLine += renderCellXml(currRow, i, col, val);
        }
        rowNodes.push(`<row r="${currRow}">${cellLine}</row>`);
        currRow++;
      });
    }

    const lastRow = currRow - 1;
    const lastColLetter = getExcelColName(totalCols - 1);
    const rowsXml = rowNodes.join('');

    // 3. THIẾT LẬP ĐỘ RỘNG CỘT TỰ ĐỘNG CHỐNG TRÀN Ô ###
    let colsXml = '<cols>';
    columns.forEach((col, idx) => {
      let minW = 14;
      if (col.dataType === DATA_TYPES.DATE) minW = col.showTime || col.key === 'col_datetime' ? 22 : 16;
      if (col.key === 'col_daterange') minW = 28;
      if (col.dataType === DATA_TYPES.NUMBER) minW = 15;
      const finalW = Math.min(Math.max(colWidths[idx] || 12, minW), 45);
      colsXml += `<col min="${idx + 1}" max="${idx + 1}" width="${finalW}" customWidth="1"/>`;
    });
    colsXml += '</cols>';

    // 4. MERGE CELLS VÀ AUTOFILTER
    let mergeXml = '';
    if (mergeCells.length > 0) {
      mergeXml = `<mergeCells count="${mergeCells.length}">` +
        mergeCells.map((m) => `<mergeCell ref="${m}"/>`).join('') +
        '</mergeCells>';
    }

    // TẮT GRIDLINES: <sheetViews><sheetView workbookViewId="0" showGridLines="0"/></sheetViews>
    const sheet1Xml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <dimension ref="A1:${lastColLetter}${lastRow}"/>
  <sheetViews>
    <sheetView workbookViewId="0" showGridLines="0"/>
  </sheetViews>
  ${colsXml}
  <sheetData>${rowsXml}</sheetData>
  <autoFilter ref="A2:${lastColLetter}${lastRow}"/>
  ${mergeXml}
</worksheet>`;

    // 5. STYLES XML ĐẦY ĐỦ: BORDER CHO MỌI Ô, TÔ MÀU HEADER NAVY & SLATE, DATE FORMAT & GROUP
    const stylesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <numFmts count="5">
    <numFmt numFmtId="164" formatCode="#,##0;(#,##0);&quot;-&quot;"/>
    <numFmt numFmtId="165" formatCode="#,##0.00;(#,##0.00);&quot;-&quot;"/>
    <numFmt numFmtId="166" formatCode="dd/mm/yyyy"/>
    <numFmt numFmtId="167" formatCode="dd/mm/yyyy hh:mm"/>
    <numFmt numFmtId="168" formatCode="hh:mm"/>
  </numFmts>
  <fonts count="4">
    <font><sz val="10"/><color rgb="FF0F172A"/><name val="Segoe UI"/></font>
    <font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Segoe UI"/></font>
    <font><b/><sz val="10"/><color rgb="FFFFFFFF"/><name val="Segoe UI"/></font>
    <font><b/><sz val="10"/><color rgb="FF0F172A"/><name val="Segoe UI"/></font>
  </fonts>
  <fills count="5">
    <fill><patternFill patternType="none"/></fill>
    <fill><patternFill patternType="gray125"/></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FF0F172A"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FF1E293B"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFF1F5F9"/></patternFill></fill>
  </fills>
  <borders count="2">
    <border><left/><right/><top/><bottom/><diagonal/></border>
    <border>
      <left style="thin"><color rgb="FFCBD5E1"/></left>
      <right style="thin"><color rgb="FFCBD5E1"/></right>
      <top style="thin"><color rgb="FFCBD5E1"/></top>
      <bottom style="thin"><color rgb="FFCBD5E1"/></bottom>
    </border>
  </borders>
  <cellStyleXfs count="1">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0"/>
  </cellStyleXfs>
  <cellXfs count="12">
    <!-- s="0": Default Normal -->
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>
    <!-- s="1": Tier 1 Band Header (Navy #0F172A, Bold White, Border, Center) -->
    <xf numFmtId="0" fontId="1" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>
    <!-- s="2": Tier 2 Column Header (Slate #1E293B, Bold White, Border, Center) -->
    <xf numFmtId="0" fontId="2" fillId="3" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>
    <!-- s="3": Group Header Text (#F1F5F9, Bold Dark, Border, Left) -->
    <xf numFmtId="0" fontId="3" fillId="4" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="left" vertical="center"/></xf>
    <!-- s="4": Group Header Sum Int (#F1F5F9, Bold Dark, Border, Right, #,##0) -->
    <xf numFmtId="164" fontId="3" fillId="4" borderId="1" xfId="0" applyFont="1" applyFill="1" applyNumberFormat="1" applyBorder="1" applyAlignment="1"><alignment horizontal="right" vertical="center"/></xf>
    <!-- s="5": Group Header Sum Dec (#F1F5F9, Bold Dark, Border, Right, #,##0.00) -->
    <xf numFmtId="165" fontId="3" fillId="4" borderId="1" xfId="0" applyFont="1" applyFill="1" applyNumberFormat="1" applyBorder="1" applyAlignment="1"><alignment horizontal="right" vertical="center"/></xf>
    <!-- s="6": Data Text (Border, Left) -->
    <xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1"><alignment horizontal="left" vertical="center"/></xf>
    <!-- s="7": Data Int (Border, Right, #,##0) -->
    <xf numFmtId="164" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1" applyAlignment="1"><alignment horizontal="right" vertical="center"/></xf>
    <!-- s="8": Data Dec (Border, Right, #,##0.00) -->
    <xf numFmtId="165" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1" applyAlignment="1"><alignment horizontal="right" vertical="center"/></xf>
    <!-- s="9": Data Date dd/mm/yyyy (Border, Center) -->
    <xf numFmtId="166" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>
    <!-- s="10": Data DateTime dd/mm/yyyy hh:mm (Border, Center) -->
    <xf numFmtId="167" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>
    <!-- s="11": Data Time hh:mm (Border, Center) -->
    <xf numFmtId="168" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>
  </cellXfs>
  <cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>
  <dxfs count="0"/>
</styleSheet>`;

    const contentTypesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
</Types>`;

    const dotRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`;

    const workbookRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`;

    const workbookXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets>
    <sheet name="DuLieu" sheetId="1" r:id="rId1"/>
  </sheets>
</workbook>`;

    // 6. ĐÓNG GÓI THÀNH FILE .XLSX ZIP NATIVE VÀ TẢI VỀ TRÌNH DUYỆT (NÉN DEFLATE SIÊU NHẸ)
    const zipData = await createXlsxZip([
      { name: '[Content_Types].xml', content: contentTypesXml },
      { name: '_rels/.rels', content: dotRelsXml },
      { name: 'xl/_rels/workbook.xml.rels', content: workbookRelsXml },
      { name: 'xl/workbook.xml', content: workbookXml },
      { name: 'xl/styles.xml', content: stylesXml },
      { name: 'xl/worksheets/sheet1.xml', content: sheet1Xml },
    ]);

    const blob = new Blob([zipData.buffer as ArrayBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `${params.filename || 'HaTang_DienToanDamMay'}.xlsx`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(downloadUrl);

    return true;
  } catch (err) {
    console.error('Lỗi khi xuất file Excel:', err);
    return false;
  }
}
