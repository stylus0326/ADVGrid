import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const XLSX = require('xlsx');

const filePath = 'C:\\Users\\Rio\\Downloads\\Final_DB_0109_3009_bo_cap_VN_Payment_Void.xlsx';

try {
  console.log('Reading file:', filePath);
  const workbook = XLSX.readFile(filePath);
  console.log('Sheet names:', workbook.SheetNames);

  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(sheet, { defval: '' });

  console.log(`Sheet "${sheetName}" total rows:`, data.length);
  if (data.length > 0) {
    const keys = Object.keys(data[0]);
    console.log('Total columns:', keys.length);
    console.log('Column headers:');
    keys.forEach((k, idx) => console.log(`  ${idx + 1}. "${k}"`));

    console.log('\nFirst 2 rows sample:');
    console.log(JSON.stringify(data.slice(0, 2), null, 2));
  }
} catch (err) {
  console.error('Error reading excel:', err);
}
