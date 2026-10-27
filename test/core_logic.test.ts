import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  FILTER_OPS,
  ALIGNMENTS,
  DATA_TYPES,
} from '../src/components/grid/types';
import {
  matchFilterValue,
  isNoInputFilterOp,
  isBetweenFilterOp,
  isNegativeFilterOp,
  getAlignTextClass,
  getAlignJustifyClass,
  formatGridNumber,
  parseGridNumber,
} from '../src/components/grid/gridUtils';
import {
  formatNumberWithCommas,
  parseSmartNumericRange,
  expandAllShortcuts,
} from '../src/components/grid/smartNumberUtils';
import {
  NO_AUTOFILL_PROPS,
  getGridControlRadiusClass,
  GRID_CONTROL_RADIUS_CLASS,
} from '../src/components/grid/constants';

describe('Unit Test Suite: Grid Core Logic & Filter Engine', () => {
  describe('1. Alignment Helpers', () => {
    it('should return correct text-align classes for ALIGNMENTS', () => {
      assert.strictEqual(getAlignTextClass(ALIGNMENTS.LEFT), 'text-left');
      assert.strictEqual(getAlignTextClass(ALIGNMENTS.CENTER), 'text-center');
      assert.strictEqual(getAlignTextClass(ALIGNMENTS.RIGHT), 'text-right');
      assert.strictEqual(getAlignTextClass(undefined), 'text-left');
    });

    it('should return correct justify-content classes for ALIGNMENTS', () => {
      assert.strictEqual(getAlignJustifyClass(ALIGNMENTS.LEFT), 'justify-start');
      assert.strictEqual(getAlignJustifyClass(ALIGNMENTS.CENTER), 'justify-center');
      assert.strictEqual(getAlignJustifyClass(ALIGNMENTS.RIGHT), 'justify-end');
      assert.strictEqual(getAlignJustifyClass(undefined), 'justify-start');
    });
  });

  describe('2. Filter Operator Predicates', () => {
    it('isNoInputFilterOp should identify operators that require no input', () => {
      assert.strictEqual(isNoInputFilterOp(FILTER_OPS.IS_EMPTY), true);
      assert.strictEqual(isNoInputFilterOp(FILTER_OPS.IS_NOT_EMPTY), true);
      assert.strictEqual(isNoInputFilterOp(FILTER_OPS.IS_POSITIVE), true);
      assert.strictEqual(isNoInputFilterOp(FILTER_OPS.IS_NEGATIVE), true);
      assert.strictEqual(isNoInputFilterOp(FILTER_OPS.EQUALS), false);
      assert.strictEqual(isNoInputFilterOp(FILTER_OPS.CONTAINS), false);
    });

    it('isBetweenFilterOp should identify BETWEEN operator', () => {
      assert.strictEqual(isBetweenFilterOp(FILTER_OPS.BETWEEN), true);
      assert.strictEqual(isBetweenFilterOp(FILTER_OPS.EQUALS), false);
    });

    it('isNegativeFilterOp should identify negation operators', () => {
      assert.strictEqual(isNegativeFilterOp(FILTER_OPS.NOT_EQUALS), true);
      assert.strictEqual(isNegativeFilterOp(FILTER_OPS.NOT_CONTAINS), true);
      assert.strictEqual(isNegativeFilterOp(FILTER_OPS.EQUALS), false);
      assert.strictEqual(isNegativeFilterOp(FILTER_OPS.CONTAINS), false);
    });
  });

  describe('3. matchFilterValue - Text Filter Operations', () => {
    it('should match CONTAINS filter', () => {
      assert.strictEqual(matchFilterValue('Hà Nội', FILTER_OPS.CONTAINS, 'Nội', DATA_TYPES.TEXT), true);
      assert.strictEqual(matchFilterValue('Hà Nội', FILTER_OPS.CONTAINS, 'Sài Gòn', DATA_TYPES.TEXT), false);
      assert.strictEqual(matchFilterValue('Đà Nẵng', FILTER_OPS.CONTAINS, 'đà nẵng', DATA_TYPES.TEXT), true); // Case-insensitive
    });

    it('should match NOT_CONTAINS filter', () => {
      assert.strictEqual(matchFilterValue('Đà Nẵng', FILTER_OPS.NOT_CONTAINS, 'Hà', DATA_TYPES.TEXT), true);
      assert.strictEqual(matchFilterValue('Hà Nội', FILTER_OPS.NOT_CONTAINS, 'Hà', DATA_TYPES.TEXT), false);
    });

    it('should match EQUALS filter', () => {
      assert.strictEqual(matchFilterValue('Hoàn Kiếm', FILTER_OPS.EQUALS, 'Hoàn Kiếm', DATA_TYPES.TEXT), true);
      assert.strictEqual(matchFilterValue('Hoàn Kiếm', FILTER_OPS.EQUALS, 'Kiếm', DATA_TYPES.TEXT), false);
    });

    it('should match STARTS_WITH & ENDS_WITH filters', () => {
      assert.strictEqual(
        matchFilterValue('VN-1234', FILTER_OPS.STARTS_WITH, 'VN', DATA_TYPES.TEXT),
        true
      );
      assert.strictEqual(
        matchFilterValue('VN-1234', FILTER_OPS.STARTS_WITH, '12', DATA_TYPES.TEXT),
        false
      );
      assert.strictEqual(
        matchFilterValue('Report.xlsx', FILTER_OPS.ENDS_WITH, '.xlsx', DATA_TYPES.TEXT),
        true
      );
      assert.strictEqual(
        matchFilterValue('Report.xlsx', FILTER_OPS.ENDS_WITH, '.pdf', DATA_TYPES.TEXT),
        false
      );
    });

    it('should match IS_EMPTY and IS_NOT_EMPTY for text', () => {
      assert.strictEqual(matchFilterValue('', FILTER_OPS.IS_EMPTY, '', DATA_TYPES.TEXT), true);
      assert.strictEqual(matchFilterValue(null, FILTER_OPS.IS_EMPTY, '', DATA_TYPES.TEXT), true);
      assert.strictEqual(matchFilterValue('Có dữ liệu', FILTER_OPS.IS_EMPTY, '', DATA_TYPES.TEXT), false);
      assert.strictEqual(matchFilterValue('Có dữ liệu', FILTER_OPS.IS_NOT_EMPTY, '', DATA_TYPES.TEXT), true);
      assert.strictEqual(matchFilterValue('', FILTER_OPS.IS_NOT_EMPTY, '', DATA_TYPES.TEXT), false);
    });
  });

  describe('4. matchFilterValue - Number Filter Operations', () => {
    it('should match comparison operators (>, <, >=, <=, =)', () => {
      assert.strictEqual(matchFilterValue(100, FILTER_OPS.GREATER_THAN, '50', DATA_TYPES.NUMBER), true);
      assert.strictEqual(matchFilterValue(30, FILTER_OPS.GREATER_THAN, '50', DATA_TYPES.NUMBER), false);

      assert.strictEqual(matchFilterValue(40, FILTER_OPS.LESS_THAN, '50', DATA_TYPES.NUMBER), true);
      assert.strictEqual(matchFilterValue(60, FILTER_OPS.LESS_THAN, '50', DATA_TYPES.NUMBER), false);

      assert.strictEqual(matchFilterValue(50, FILTER_OPS.GREATER_THAN_OR_EQUAL, '50', DATA_TYPES.NUMBER), true);
      assert.strictEqual(matchFilterValue(50, FILTER_OPS.LESS_THAN_OR_EQUAL, '50', DATA_TYPES.NUMBER), true);

      assert.strictEqual(matchFilterValue(50, FILTER_OPS.EQUALS, '50', DATA_TYPES.NUMBER), true);
      assert.strictEqual(matchFilterValue(51, FILTER_OPS.NOT_EQUALS, '50', DATA_TYPES.NUMBER), true);
    });

    it('should match BETWEEN range operator for numbers', () => {
      assert.strictEqual(matchFilterValue(25, FILTER_OPS.BETWEEN, '10..50', DATA_TYPES.NUMBER), true);
      assert.strictEqual(matchFilterValue(10, FILTER_OPS.BETWEEN, '10..50', DATA_TYPES.NUMBER), true);
      assert.strictEqual(matchFilterValue(50, FILTER_OPS.BETWEEN, '10..50', DATA_TYPES.NUMBER), true);
      assert.strictEqual(matchFilterValue(5, FILTER_OPS.BETWEEN, '10..50', DATA_TYPES.NUMBER), false);
      assert.strictEqual(matchFilterValue(55, FILTER_OPS.BETWEEN, '10..50', DATA_TYPES.NUMBER), false);
    });

    it('should match IS_POSITIVE and IS_NEGATIVE operators', () => {
      assert.strictEqual(matchFilterValue(15, FILTER_OPS.IS_POSITIVE, '', DATA_TYPES.NUMBER), true);
      assert.strictEqual(matchFilterValue(-5, FILTER_OPS.IS_POSITIVE, '', DATA_TYPES.NUMBER), false);
      assert.strictEqual(matchFilterValue(-5, FILTER_OPS.IS_NEGATIVE, '', DATA_TYPES.NUMBER), true);
      assert.strictEqual(matchFilterValue(15, FILTER_OPS.IS_NEGATIVE, '', DATA_TYPES.NUMBER), false);
    });
  });

  describe('5. Smart Number Utilities', () => {
    it('should format numbers with dots as thousands separators and negative in parentheses', () => {
      assert.strictEqual(formatGridNumber(1000), '1.000');
      assert.strictEqual(formatGridNumber(1234567), '1.234.567');
      assert.strictEqual(formatGridNumber(1234.56), '1.234,56');
      assert.strictEqual(formatGridNumber(0), '0');
      // Số âm bỏ trong ngoặc đơn chuẩn kế toán #,###.##
      assert.strictEqual(formatGridNumber(-1000), '(1.000)');
      assert.strictEqual(formatGridNumber(-1234.56), '(1.234,56)');
      assert.strictEqual(formatGridNumber(-50), '(50)');
    });

    it('should accurately parse numbers with thousands dots and negative parentheses (fixing 1k -> 1.000 bug)', () => {
      // Sửa lỗi 1k -> 1.000 (trước đây parseGridNumber("1.000") trả về 1)
      assert.strictEqual(parseGridNumber('1.000'), 1000);
      assert.strictEqual(parseGridNumber('50.000'), 50000);
      assert.strictEqual(parseGridNumber('1.234.567'), 1234567);
      // Parse số âm trong ngoặc đơn
      assert.strictEqual(parseGridNumber('(1.000)'), -1000);
      assert.strictEqual(parseGridNumber('(1.234,56)'), -1234.56);
      assert.strictEqual(parseGridNumber('-500'), -500);
    });

    it('should expand shortcuts 1k, 100k, 1tr, 1b, (1k)', () => {
      assert.strictEqual(expandAllShortcuts('1k'), '1000');
      assert.strictEqual(expandAllShortcuts('100k'), '100000');
      assert.strictEqual(expandAllShortcuts('1tr'), '1000000');
      assert.strictEqual(expandAllShortcuts('1b'), '1000000000');
      assert.strictEqual(expandAllShortcuts('-1k'), '-1000');
      assert.strictEqual(expandAllShortcuts('(100k)'), '(100000)');
    });

    it('should parse smart numeric ranges', () => {
      const res = parseSmartNumericRange('10..50');
      assert.ok(res);
      assert.strictEqual(res.fromNum, 10);
      assert.strictEqual(res.toNum, 50);

      const res2 = parseSmartNumericRange('100/500');
      assert.ok(res2);
      assert.strictEqual(res2.fromNum, 100);
      assert.strictEqual(res2.toNum, 500);
    });
  });

  describe('6. Autofill Compliance & No Leakage Verification', () => {
    it('NO_AUTOFILL_PROPS should contain all 9 mandatory browser & extension autofill prevention flags', () => {
      assert.strictEqual(NO_AUTOFILL_PROPS.autoComplete, 'off');
      assert.strictEqual(NO_AUTOFILL_PROPS.autoCorrect, 'off');
      assert.strictEqual(NO_AUTOFILL_PROPS.autoCapitalize, 'off');
      assert.strictEqual(NO_AUTOFILL_PROPS.spellCheck, false);
      assert.strictEqual(NO_AUTOFILL_PROPS['aria-autocomplete'], 'none');
      assert.strictEqual(NO_AUTOFILL_PROPS['data-lpignore'], 'true');
      assert.strictEqual(NO_AUTOFILL_PROPS['data-form-type'], 'other');
      assert.strictEqual(NO_AUTOFILL_PROPS['data-1p-ignore'], 'true');
      assert.strictEqual(NO_AUTOFILL_PROPS['data-bwignore'], 'true');
    });
  });

  describe('7. Unified Border Radius Verification', () => {
    it('getGridControlRadiusClass should return the unified border radius class', () => {
      assert.strictEqual(typeof getGridControlRadiusClass(), 'string');
      assert.strictEqual(getGridControlRadiusClass(), GRID_CONTROL_RADIUS_CLASS);
      assert.ok(getGridControlRadiusClass().startsWith('rounded'));
    });
  });
});
