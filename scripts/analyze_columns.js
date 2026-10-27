import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const XLSX = require('xlsx');

const filePath = 'C:\\Users\\Rio\\Downloads\\Final_DB_0109_3009_bo_cap_VN_Payment_Void.xlsx';

const wb = XLSX.readFile(filePath);
const sheet = wb.Sheets['Sheet1'];
const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });

console.log('Total rows:', rows.length);

const keys = Object.keys(rows[0]);
const colStats = {};

keys.forEach(k => {
  colStats[k] = {
    samples: new Set(),
    nonEmptyCount: 0,
    isNumeric: true,
    isDateCandidate: false,
    minVal: Infinity,
    maxVal: -Infinity,
  };
});

rows.forEach((r, idx) => {
  keys.forEach(k => {
    const val = r[k];
    const stats = colStats[k];
    if (val !== '' && val !== null && val !== undefined) {
      stats.nonEmptyCount++;
      if (stats.samples.size < 5) stats.samples.add(val);
      if (typeof val === 'number') {
        if (val < stats.minVal) stats.minVal = val;
        if (val > stats.maxVal) stats.maxVal = val;
        // Check if looks like Excel date serial (around 40000 - 50000)
        if (val >= 40000 && val <= 50000 && (k.toLowerCase().includes('ngay') || k.toLowerCase().includes('gio'))) {
          stats.isDateCandidate = true;
        }
      } else {
        stats.isNumeric = false;
      }
    }
  });
});

console.log('\nCOLUMN ANALYSIS:');
keys.forEach((k, idx) => {
  const s = colStats[k];
  const samplesArr = Array.from(s.samples);
  const type = s.isDateCandidate ? 'date/datetime' : (s.isNumeric && s.nonEmptyCount > 0) ? 'number' : 'text';
  console.log(`${idx + 1}. [${k}] (Type: ${type}, NonEmpty: ${s.nonEmptyCount}/${rows.length})`);
  console.log(`   Samples: ${JSON.stringify(samplesArr)}`);
  if (s.isNumeric && s.nonEmptyCount > 0) {
    console.log(`   Range: ${s.minVal} -> ${s.maxVal}`);
  }
});
