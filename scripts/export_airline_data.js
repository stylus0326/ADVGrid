import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';

const require = createRequire(import.meta.url);
const XLSX = require('xlsx');

const excelFilePath = 'C:\\Users\\Rio\\Downloads\\Final_DB_0109_3009_bo_cap_VN_Payment_Void.xlsx';
const outputDir = path.resolve('public', 'data');
const outputJsonPath = path.join(outputDir, 'airline_transactions.json');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log('Reading Excel file...');
const wb = XLSX.readFile(excelFilePath);
const sheet = wb.Sheets['Sheet1'];
const rawRows = XLSX.utils.sheet_to_json(sheet, { defval: '' });

console.log(`Parsed ${rawRows.length} rows.`);

// Helper functions for date formatting
function formatExcelDate(val) {
  if (val === '' || val === null || val === undefined) return '';
  if (typeof val === 'number') {
    const d = XLSX.SSF.parse_date_code(val);
    if (!d) return String(val);
    const day = String(d.d).padStart(2, '0');
    const month = String(d.m).padStart(2, '0');
    const year = d.y;
    return `${day}/${month}/${year}`;
  }
  return String(val).trim();
}

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

// 38 Active columns ordered logically
const COLUMN_KEYS = [
  'Name',         // col_name: Nghiệp vụ
  'LoaiKhach',    // col_loai_khach: Đối tượng
  'TenDayDu',     // col_nha_cung_cap: Nhà cung cấp
  'Hang',         // col_hang: Hãng bay
  'MaCho',        // col_pnr: Mã chỗ
  'TenKhach',     // col_ten_khach: Tên khách
  'BiDanh',       // col_bi_danh: Loại khách (ADT, CHD, INF)
  'SoVeVN',       // col_so_ve: Số vé
  'MaAGS99',      // col_ma_ags: Mã AGS
  'NgayGD',       // col_ngay_gd: Ngày GD
  'NgayHT',       // col_ngay_ht: Ngày HT
  'TuyenBayDi',   // col_tuyen_di: Chặng đi
  'GioBayDi',     // col_gio_di: Giờ bay đi
  'LoaiVeDi',     // col_loai_di: Hạng vé đi
  'TuyenBayVe',   // col_tuyen_ve: Chặng về
  'GioBayVe',     // col_gio_ve: Giờ bay về
  'LoaiVeVe',     // col_loai_ve: Hạng vé về
  'Fare',         // col_fare: Giá vé (Fare)
  'GiaNet',       // col_gia_net: Giá Net
  'Thue',         // col_thue: Thuế
  'ThuHo',        // col_thu_ho: Thu hộ
  'PhiQuanTri',   // col_phi_quan_tri: Phí quản trị
  'PhiCoDinh',    // col_phi_tu_dong: Phí tự động
  'PhiCK',        // col_phi_ck: Chiết khấu tự động
  'HangCK',       // col_hang_ck: Hãng chiết khấu
  'PhiKhac',      // col_phi_khac: Phí khác
  'PhiThuNT',     // col_phi_nhap_tay: Phí nhập tay
  'GiaHeThong',   // col_gia_he_thong: Giá hệ thống
  'GiaThu',       // col_gia_thu: Tổng thu
  'LoiNhuan',     // col_loi_nhuan: Lợi nhuận
  'TaiKhoanCo',   // col_chuyen_khoan: Chuyển khoản
  'LuyKe',        // col_luy_ke: Lũy kế công nợ
  'NganHang',     // col_ngan_hang: Ngân hàng
  'GiaHoan',      // col_gia_hoan: Giá hoàn
  'HangHoan',     // col_hang_hoan: Hãng hoàn
  'TinhCongNo',   // col_tinh_cong_no: Tính công nợ
  'An',           // col_an: Hiển thị
  'GhiChu',       // col_ghi_chu: Ghi chú
];

console.log('Transforming rows to compact tuple arrays...');
const processedRows = rawRows.map((r, idx) => {
  return [
    r.Name || '',
    r.LoaiKhach || '',
    r.TenDayDu || '',
    r.Hang || '',
    r.MaCho || '',
    r.TenKhach || '',
    r.BiDanh || '',
    r.SoVeVN ? String(r.SoVeVN) : '',
    r.MaAGS99 || '',
    formatExcelDate(r.NgayGD),
    formatExcelDate(r.NgayHT),
    r.TuyenBayDi || '',
    formatExcelDateTime(r.GioBayDi),
    r.LoaiVeDi || '',
    r.TuyenBayVe || '',
    formatExcelDateTime(r.GioBayVe),
    r.LoaiVeVe || '',
    typeof r.Fare === 'number' ? r.Fare : (r.Fare ? Number(r.Fare) : 0),
    typeof r.GiaNet === 'number' ? r.GiaNet : (r.GiaNet ? Number(r.GiaNet) : 0),
    typeof r.Thue === 'number' ? r.Thue : (r.Thue ? Number(r.Thue) : 0),
    typeof r.ThuHo === 'number' ? r.ThuHo : (r.ThuHo ? Number(r.ThuHo) : 0),
    typeof r.PhiQuanTri === 'number' ? r.PhiQuanTri : (r.PhiQuanTri ? Number(r.PhiQuanTri) : 0),
    typeof r.PhiCoDinh === 'number' ? r.PhiCoDinh : (r.PhiCoDinh ? Number(r.PhiCoDinh) : 0),
    typeof r.PhiCK === 'number' ? r.PhiCK : (r.PhiCK ? Number(r.PhiCK) : 0),
    typeof r.HangCK === 'number' ? r.HangCK : (r.HangCK ? Number(r.HangCK) : 0),
    typeof r.PhiKhac === 'number' ? r.PhiKhac : (r.PhiKhac ? Number(r.PhiKhac) : 0),
    typeof r.PhiThuNT === 'number' ? r.PhiThuNT : (r.PhiThuNT ? Number(r.PhiThuNT) : 0),
    typeof r.GiaHeThong === 'number' ? r.GiaHeThong : (r.GiaHeThong ? Number(r.GiaHeThong) : 0),
    typeof r.GiaThu === 'number' ? r.GiaThu : (r.GiaThu ? Number(r.GiaThu) : 0),
    typeof r.LoiNhuan === 'number' ? r.LoiNhuan : (r.LoiNhuan ? Number(r.LoiNhuan) : 0),
    typeof r.TaiKhoanCo === 'number' ? r.TaiKhoanCo : (r.TaiKhoanCo ? Number(r.TaiKhoanCo) : 0),
    typeof r.LuyKe === 'number' ? r.LuyKe : (r.LuyKe ? Number(r.LuyKe) : 0),
    r.NganHang || '',
    typeof r.GiaHoan === 'number' ? r.GiaHoan : (r.GiaHoan ? Number(r.GiaHoan) : 0),
    typeof r.HangHoan === 'number' ? r.HangHoan : (r.HangHoan ? Number(r.HangHoan) : 0),
    r.TinhCongNo === 1 || r.TinhCongNo === '1' ? 1 : 0,
    r.An === 1 || r.An === '1' ? 1 : 0,
    r.GhiChu ? String(r.GhiChu).replace(/\s+/g, ' ').trim() : '',
  ];
});

const outputData = {
  totalRows: processedRows.length,
  columns: COLUMN_KEYS,
  rows: processedRows,
};

console.log(`Writing JSON to ${outputJsonPath}...`);
fs.writeFileSync(outputJsonPath, JSON.stringify(outputData));
const stats = fs.statSync(outputJsonPath);
console.log(`Successfully exported ${processedRows.length} rows. File size: ${(stats.size / (1024 * 1024)).toFixed(2)} MB`);
