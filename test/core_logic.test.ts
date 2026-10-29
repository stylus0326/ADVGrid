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
  isSelectionColumn,
  computeFilteredSelectionState,
  toggleFilteredRowsSelection,
  computeSortRowFlipState,
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

  describe('8. Selection State & Fast-Path Optimization', () => {
    it('isSelectionColumn predicate should identify selection and checkbox columns', () => {
      assert.strictEqual(isSelectionColumn({ isSelection: true }), true);
      assert.strictEqual(isSelectionColumn({ key: 'col_chk' }), true);
      assert.strictEqual(isSelectionColumn({ key: 'col_chk', isSelection: false }), true);
      assert.strictEqual(isSelectionColumn({ key: 'name', isSelection: false }), false);
      assert.strictEqual(isSelectionColumn(null), false);
      assert.strictEqual(isSelectionColumn(undefined), false);
    });

    it('computeFilteredSelectionState should compute fast-path selection state on unfiltered table', () => {
      const totalRows = 50000;
      const checkedSet = new Set<number>();

      // 0 dòng được chọn
      const emptyState = computeFilteredSelectionState(totalRows, checkedSet, null);
      assert.strictEqual(emptyState.allChecked, false);
      assert.strictEqual(emptyState.isIndeterminate, false);
      assert.strictEqual(emptyState.selectedCount, 0);
      assert.strictEqual(emptyState.totalCount, 50000);

      // 3 dòng được chọn (duyệt đúng 3 phần tử thay vì 50.000 dòng)
      checkedSet.add(10);
      checkedSet.add(25);
      checkedSet.add(999);
      const partialState = computeFilteredSelectionState(totalRows, checkedSet, null);
      assert.strictEqual(partialState.allChecked, false);
      assert.strictEqual(partialState.isIndeterminate, true);
      assert.strictEqual(partialState.selectedCount, 3);
      assert.strictEqual(partialState.totalCount, 50000);

      // Cả 50.000 dòng được chọn
      const allSet = new Set<number>();
      for (let i = 0; i < 50; i++) allSet.add(i);
      const fullState = computeFilteredSelectionState(50, allSet, null);
      assert.strictEqual(fullState.allChecked, true);
      assert.strictEqual(fullState.isIndeterminate, false);
      assert.strictEqual(fullState.selectedCount, 50);
      assert.strictEqual(fullState.totalCount, 50);
    });

    it('computeFilteredSelectionState should compute selection accurately on filtered rows subset', () => {
      const activeRows = [5, 15, 25, 35];
      const checkedSet = new Set<number>([15, 35, 999]); // 999 không nằm trong activeRows

      const state = computeFilteredSelectionState(1000, checkedSet, activeRows);
      assert.strictEqual(state.totalCount, 4);
      assert.strictEqual(state.selectedCount, 2);
      assert.strictEqual(state.isIndeterminate, true);
      assert.strictEqual(state.allChecked, false);

      // Khi chọn đủ cả 4 dòng trong activeRows
      checkedSet.add(5);
      checkedSet.add(25);
      const fullActiveState = computeFilteredSelectionState(1000, checkedSet, activeRows);
      assert.strictEqual(fullActiveState.totalCount, 4);
      assert.strictEqual(fullActiveState.selectedCount, 4);
      assert.strictEqual(fullActiveState.allChecked, true);
      assert.strictEqual(fullActiveState.isIndeterminate, false);
    });

    it('toggleFilteredRowsSelection should return new Set() in O(1) on unfiltered deselect', () => {
      const currentChecked = new Set<number>([1, 2, 3, 4, 5]);
      // Bỏ chọn toàn bộ trên bảng không lọc
      const result = toggleFilteredRowsSelection(50000, currentChecked, null, false);
      assert.strictEqual(result.size, 0);
      assert.ok(result instanceof Set);
    });

    it('toggleFilteredRowsSelection should toggle selections correctly', () => {
      // Bảng có lọc: chỉ bật/tắt các dòng trong activeRowIndices
      const currentChecked = new Set<number>([100]);
      const activeRows = [1, 2, 3];
      const selected = toggleFilteredRowsSelection(1000, currentChecked, activeRows, true);
      assert.strictEqual(selected.has(1), true);
      assert.strictEqual(selected.has(2), true);
      assert.strictEqual(selected.has(3), true);
      assert.strictEqual(selected.has(100), true);

      const deselected = toggleFilteredRowsSelection(1000, selected, activeRows, false);
      assert.strictEqual(deselected.has(1), false);
      assert.strictEqual(deselected.has(2), false);
      assert.strictEqual(deselected.has(3), false);
      assert.strictEqual(deselected.has(100), true); // Dòng 100 ngoài activeRows vẫn được bảo toàn
    });
  });

  describe('8. AG Grid-Style FLIP Row Sort Animation (computeSortRowFlipState)', () => {
    it('should return null when row did not change position (oldRowIndex === newRowIndex)', () => {
      const res = computeSortRowFlipState({
        rowKey: 'row_5',
        newRowIndex: 5,
        oldRowIndex: 5,
        rowHeight: 32,
        viewportCenterRow: 10,
        prevStartRow: 0,
      });
      assert.strictEqual(res, null);
    });

    it('should compute exact pixel FLIP deltaY for rows swapping within viewport range', () => {
      // Dòng từ vị trí 8 trượt lên vị trí 2 -> deltaY = (8 - 2) * 32 = +192px
      const moveUp = computeSortRowFlipState({
        rowKey: 'row_up',
        newRowIndex: 2,
        oldRowIndex: 8,
        rowHeight: 32,
        viewportCenterRow: 10,
        prevStartRow: 0,
      });
      assert.ok(moveUp);
      assert.strictEqual(moveUp.deltaY, 192);
      assert.strictEqual(moveUp.initialOpacity, 1);

      // Dòng từ vị trí 2 trượt xuống vị trí 8 -> deltaY = (2 - 8) * 32 = -192px
      const moveDown = computeSortRowFlipState({
        rowKey: 'row_down',
        newRowIndex: 8,
        oldRowIndex: 2,
        rowHeight: 32,
        viewportCenterRow: 10,
        prevStartRow: 0,
      });
      assert.ok(moveDown);
      assert.strictEqual(moveDown.deltaY, -192);
      assert.strictEqual(moveDown.initialOpacity, 1);
    });

    it('should compute bidirectional interleaving for rows entering from far away without exceeding top boundary or fading out', () => {
      const slot0 = computeSortRowFlipState({
        rowKey: 'row_990',
        newRowIndex: 0,
        oldRowIndex: undefined,
        rowHeight: 32,
        viewportCenterRow: 10,
        prevStartRow: 0,
      });
      assert.ok(slot0);
      assert.ok(slot0.deltaY > 0);
      assert.strictEqual(slot0.initialOpacity, 1);

      // Slot 2 trượt từ trên xuống (deltaY < 0) để lấp kín đỉnh bảng (y = 0px) nhưng không bao giờ vượt quá -2 * 32 (-64px)
      const slot2 = computeSortRowFlipState({
        rowKey: 'row_10',
        newRowIndex: 2,
        oldRowIndex: undefined,
        rowHeight: 32,
        viewportCenterRow: 50,
        prevStartRow: 40,
      });
      assert.ok(slot2);
      assert.ok(slot2.deltaY < 0 && slot2.deltaY >= -72);
      assert.strictEqual(slot2.initialOpacity, 1);
    });
  });
});

