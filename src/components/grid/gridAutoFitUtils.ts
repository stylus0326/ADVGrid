import { ColumnDef, DATA_TYPES } from './types';
import { getSttColWidth } from './gridFormatUtils';

let _measureCanvas: HTMLCanvasElement | null = null;

const DEFAULT_MEASURE_FONT =
  '12px Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
const DEFAULT_HEADER_FONT =
  'bold 12px Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
const DEFAULT_SUMMARY_FONT =
  'bold 12px Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

/**
 * Đo chiều rộng văn bản chính xác theo pixel bằng HTML5 Canvas ẩn
 */
export function measureTextWidth(
  text: string | number,
  font = DEFAULT_MEASURE_FONT
): number {
  if (typeof document === 'undefined') return 100;
  if (!_measureCanvas) _measureCanvas = document.createElement('canvas');
  const ctx = _measureCanvas.getContext('2d');
  if (!ctx) return 100;
  ctx.font = font;
  return ctx.measureText(String(text ?? '')).width;
}

/**
 * Tự động tính toán độ rộng tối ưu cho cột (Auto-Fit Column Width) bao gồm cả Dữ liệu, Tổng nhóm và Tổng bảng
 */
export function calcColAutoFitWidth<T = any>(
  col: ColumnDef<T>,
  sampleData: T[] = [],
  maxLimit = 380,
  minLimit = 65,
  summaryValues?: (number | string)[],
  totalRows?: number,
  fontFamily?: string
): number {
  if (!col) return 120;
  if (col.dataType === DATA_TYPES.SYSTEM) {
    if (!col.title) return col.defaultWidth || 32;
    return getSttColWidth(totalRows || (Array.isArray(sampleData) ? sampleData.length : 100), col.title);
  }
  if (col.isChart) return col.minWidth || col.defaultWidth || 150;

  const baseFamily = fontFamily || 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  const textFont = `12px ${baseFamily}`;
  const headerFont = `bold 12px ${baseFamily}`;
  const summaryFont = `bold 12px ${baseFamily}`;

  // 1. Kích thước cần thiết cho Tiêu đề cột (Header Title + khoảng cách an toàn)
  const titleW = measureTextWidth(col.title || col.key, fontFamily ? headerFont : DEFAULT_HEADER_FONT);
  const headerNeeded = titleW + 36; // 36px cho padding 2 bên và icon sắp xếp

  // 2. Kích thước cần thiết cho Dữ liệu các dòng (lấy mẫu 100 dòng đầu để đạt hiệu năng tức thì)
  let maxDataW = 0;
  const sample = Array.isArray(sampleData) ? sampleData.slice(0, 100) : [];
  sample.forEach((row: any) => {
    let val: any = '';
    if (row?._isGroupRow) {
      val = row.groupSums?.[col.key];
    } else if (row?.cells instanceof Map) {
      val = row.cells.get(col.key)?.value;
    } else if (row?.cells && typeof row.cells === 'object' && row.cells[col.key] !== undefined) {
      val = row.cells[col.key]?.value ?? row.cells[col.key];
    } else if (row?.[col.key] !== undefined) {
      val = row[col.key];
    } else if (col.isFormula) {
      val = 'T12: 100.0';
    }
    if (val !== undefined && val !== null && val !== '' && typeof val !== 'boolean') {
      const str = typeof val === 'number' ? val.toLocaleString('vi-VN') : String(val);
      const w = measureTextWidth(str, fontFamily ? textFont : DEFAULT_MEASURE_FONT);
      if (w > maxDataW) maxDataW = w;
    }
  });

  // 3. Kích thước cần thiết cho các giá trị Tổng nhóm (Group Sums) & Tổng toàn bảng (Column Sums)
  if (Array.isArray(summaryValues) && summaryValues.length > 0) {
    summaryValues.forEach((s) => {
      if (s !== undefined && s !== null && s !== '') {
        const str = typeof s === 'number' ? s.toLocaleString('vi-VN') : String(s);
        const w = measureTextWidth(str, fontFamily ? summaryFont : DEFAULT_SUMMARY_FONT);
        if (w > maxDataW) maxDataW = w;
      }
    });
  }

  const dataNeeded = maxDataW > 0 ? maxDataW + 28 : 0; // 28px padding ô (px-2.5) + an toàn
  const needed = Math.max(headerNeeded, dataNeeded);
  const calculated = Math.max(col.minWidth || minLimit, Math.ceil(needed));
  return maxLimit ? Math.min(maxLimit, calculated) : calculated;
}

/**
 * Thu thập tối đa N dòng mẫu on-demand khi người dùng Auto-Fit cột (không giữ sampleRows ở cold-start).
 */
export function collectAutoFitSampleRows<T = any>(
  totalRows: number,
  getRowItem?: (idx: number) => T | undefined,
  sampleLimit = 100
): T[] {
  if (!getRowItem || totalRows <= 0) return [];
  const limit = Math.min(totalRows, sampleLimit);
  const rows: T[] = [];
  for (let i = 0; i < limit; i++) {
    const item = getRowItem(i);
    if (item !== undefined) rows.push(item);
  }
  return rows;
}
