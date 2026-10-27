import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';

const require = createRequire(import.meta.url);
const XLSX = require('xlsx');

const excelFilePath = 'C:\\Users\\Rio\\Desktop\\ExGD-24-10-2026.xlsx';
const outputDir = path.resolve('public', 'data');
const outputJsonPath = path.join(outputDir, 'airline_transactions.json');
const distJsonPath = path.resolve('dist', 'data', 'airline_transactions.json');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log('Reading Excel file:', excelFilePath);
console.time('readExcel');
const wb = XLSX.readFile(excelFilePath);
const sheetName = wb.SheetNames[0];
const sheet = wb.Sheets[sheetName];
const rawRows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
console.timeEnd('readExcel');

console.log(`Parsed ${rawRows.length} rows from sheet "${sheetName}".`);

function formatExcelDateTime(val) {
  if (val === '' || val === null || val === undefined) return '';
  if (typeof val === 'number') {
    const d = XLSX.SSF.parse_date_code(val);
    if (!d) return String(val);
    const day = String(d.d).padStart(2, '0');
    const month = String(d.m).padStart(2, '0');
    const year = d.y;
    const hour = String(d.H).padStart(2, '0');
    const min = String(d.M).padStart(2, '0');
    return `${day}/${month}/${year} ${hour}:${min}`;
  }
  return String(val).trim();
}

function parseNum(val) {
  if (typeof val === 'number') return val;
  if (!val) return 0;
  const n = Number(String(val).replace(/,/g, '').trim());
  return isNaN(n) ? 0 : n;
}

const COLUMN_KEYS = [
  'Ngày GD',
  'Mã Chỗ',
  'Phí hãng',
  'ID',
  'Loại vé',
  'Loại đối tác',
  'NV Giao Dịch',
  'Đối tác',
  'Hãng',
  'ĐVCC',
  'Số Vé VN',
  'Giá Net',
  'Giá Hệ Thống',
  'Tổng Thu',
  'Phí Hoàn',
  'Thu hồi CK',
  'Hãng Hoàn',
  'Giá Hoàn',
  'Chênh lệch',
  'Lợi Nhuận',
  'Hãng CK',
  'Tự xuất',
  'DS Booker',
];

console.log('Transforming to compact tuples...');
console.time('transform');

const tuples = new Array(rawRows.length);
for (let i = 0; i < rawRows.length; i++) {
  const r = rawRows[i];
  tuples[i] = [
    formatExcelDateTime(r['Ngày GD']),
    r['Mã Chỗ'] ? String(r['Mã Chỗ']).trim() : '',
    parseNum(r['Phí hãng']),
    r['ID'] ? String(r['ID']).trim() : '',
    r['Loại vé'] ? String(r['Loại vé']).trim() : '',
    r['Loại đối tác'] ? String(r['Loại đối tác']).trim() : '',
    r['NV Giao Dịch'] ? String(r['NV Giao Dịch']).trim() : '',
    r['Đối tác'] ? String(r['Đối tác']).trim() : '',
    r['Hãng'] ? String(r['Hãng']).trim() : '',
    r['ĐVCC'] ? String(r['ĐVCC']).trim() : '',
    r['Số Vé VN'] ? String(r['Số Vé VN']).trim() : '',
    parseNum(r['Giá Net']),
    parseNum(r['Giá Hệ Thống']),
    parseNum(r['Tổng Thu']),
    parseNum(r['Phí Hoàn']),
    parseNum(r['Thu hồi CK']),
    parseNum(r['Hãng Hoàn']),
    parseNum(r['Giá Hoàn']),
    parseNum(r['Chênh lệch']),
    parseNum(r['Lợi Nhuận']),
    parseNum(r['Hãng CK']),
    r['Tự xuất'] === true || r['Tự xuất'] === 'true' || r['Tự xuất'] === 1 ? 'True' : 'False',
    parseNum(r['DS Booker']),
  ];
}
console.timeEnd('transform');

const outputData = {
  totalRows: tuples.length,
  columns: COLUMN_KEYS,
  rows: tuples,
};

console.log('Writing JSON to:', outputJsonPath);
console.time('writeJson');
const jsonStr = JSON.stringify(outputData);
fs.writeFileSync(outputJsonPath, jsonStr, 'utf8');

if (fs.existsSync(path.dirname(distJsonPath))) {
  fs.writeFileSync(distJsonPath, jsonStr, 'utf8');
}
console.timeEnd('writeJson');

const stats = fs.statSync(outputJsonPath);
console.log(`Successfully written ${tuples.length} rows to ${outputJsonPath}. Size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
