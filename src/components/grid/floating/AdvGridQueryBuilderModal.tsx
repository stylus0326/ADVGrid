import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Plus,
  Trash2,
  Maximize2,
  Minimize2,
  Check,
  Copy,
  ListFilter,
} from 'lucide-react';
import { ColumnDef, SurfaceTheme, SURFACE_THEMES, FilterOperation, FILTER_OPS, FILTER_MODES, DATA_TYPES } from '../types';
import { NO_AUTOFILL_PROPS } from '../constants';
import { QueryGroup, QueryRule, QueryPreset, QUERY_COMBINATORS } from './types';
import {
  hasActiveQueryRules,
  countActiveQueryRules,
  evaluateQueryTreeNode,
  generateNaturalLanguage,
  formatQueryRuleSummary,
  isRuleActive,
  validateQueryTreeAgainstColumns,
  parseCmdToQueryTree,
} from './queryUtils';
import {
  computeEditorCoords,
  EditorCoords,
  getPortalThemeVars,
  useClickOutside,
  normalizeSearchText,
} from '../../ui/enterpriseEditorUtils';
import { MorphChevronIcon } from '../../ui/MorphIcons';
import { AdvDatePicker, AdvDateRangePicker } from '../../ui/AdvDatePicker';
import { TimeRangeFilterInput, TimeFilterInput } from '../GridFilterRow';
import {
  ALLOWED_OPS_BY_TYPE,
  DEFAULT_OP_BY_TYPE,
  FILTER_OP_META,
  FilterOpIcon,
  getColumnFilterType,
  getAllowedFilterOpsForColumn,
  getDefaultFilterOpForColumn,
  RangeArrowSeparator,
} from '../FilterIcons';
import { AdvMultiFilterPopup } from '../AdvMultiFilterPopup';
import { isNoInputFilterOp, isBetweenFilterOp } from '../gridUtils';

export interface AdvGridQueryBuilderModalProps<T = any> {
  isOpen: boolean;
  onClose: () => void;
  columns: ColumnDef<any>[];
  appliedTree: QueryGroup | null;
  onApply: (tree: QueryGroup | null) => void;
  totalFilteredRows: number;
  totalRowCount: number;
  surfaceTheme?: SurfaceTheme;
  data?: T[];
  getCellValue?: (rowIndex: number, colKey: string) => any;
  hasColumnEmptyCells?: (colKey: string) => boolean;
  getColumnDateBounds?: (colKey: string) => { min: string; max: string };
  style?: React.CSSProperties;
}

export const getColType = getColumnFilterType;

export interface QuerySelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

export interface QueryCustomSelectProps {
  value: string;
  options: QuerySelectOption[];
  onChange: (val: string) => void;
  className?: string;
  minWidth?: number;
  popupMinWidth?: number;
  theme?: string;
  showSearch?: boolean;
  iconOnly?: boolean;
}

export const QueryCustomSelect = React.memo(function QueryCustomSelect({
  value,
  options,
  onChange,
  className = '',
  minWidth = 130,
  popupMinWidth,
  theme = SURFACE_THEMES.BEZIER_ARTHOUSE,
  showSearch,
  iconOnly = false,
}: QueryCustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const effectiveMinWidth = popupMinWidth || minWidth;
  const [coords, setCoords] = useState<EditorCoords>({
    top: 0,
    bottom: 0,
    left: 0,
    width: effectiveMinWidth,
    maxHeight: 240,
    isFlipUp: false,
  });

  const shouldShowSearch = showSearch !== undefined ? showSearch : options.length > 8;

  const selectedOption = useMemo(
    () => options.find((opt) => opt.value === value) || options[0],
    [options, value]
  );

  const updateCoords = useCallback(() => {
    if (!triggerRef.current) return;
    const next = computeEditorCoords(triggerRef.current, 240, effectiveMinWidth);
    setCoords(next);
  }, [effectiveMinWidth]);

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => {
      if (!prev) {
        updateCoords();
        setSearch('');
      }
      return !prev;
    });
  }, [updateCoords]);

  useClickOutside(isOpen, () => setIsOpen(false), updateCoords, triggerRef, popupRef);

  useEffect(() => {
    if (isOpen && shouldShowSearch) {
      const t = setTimeout(() => searchInputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [isOpen, shouldShowSearch]);

  const filteredOptions = useMemo(() => {
    if (!search.trim()) return options;
    const q = normalizeSearchText(search);
    return options.filter((opt) => normalizeSearchText(opt.label).includes(q));
  }, [options, search]);

  return (
    <div
      ref={triggerRef}
      onClick={handleToggle}
      style={{
        minWidth: minWidth ? `${minWidth}px` : undefined,
      }}
      className={`relative inline-flex min-h-[28px] h-7 items-center justify-between gap-1 rounded border border-[var(--agv-border-strong)] bg-[var(--agv-bg-control)] ${
        iconOnly ? 'px-1.5' : 'px-2'
      } text-xs text-[var(--agv-text-main)] cursor-pointer select-none transition-colors hover:border-primary shrink-0 ${
        isOpen ? 'border-primary ring-1 ring-ring' : ''
      } ${className}`.trim()}
    >
      <div className="flex items-center gap-1 shrink-0">
        {selectedOption?.icon && (
          <span className="shrink-0 flex items-center">{selectedOption.icon}</span>
        )}
        {!iconOnly && (
          <span className="truncate font-medium">{selectedOption?.label || value}</span>
        )}
      </div>
      <MorphChevronIcon
        expanded={isOpen}
        size={12}
        type="down-up"
        className="text-[var(--agv-text-muted)] shrink-0"
      />

      {isOpen &&
        createPortal(
          <div
            ref={popupRef}
            data-agv-popup="true"
            style={{
              position: 'fixed',
              left: `${coords.left}px`,
              ...(coords.isFlipUp
                ? { bottom: `${coords.bottom}px`, top: 'auto' }
                : { top: `${coords.top}px`, bottom: 'auto' }),
              minWidth: `${Math.max(coords.width, effectiveMinWidth)}px`,
              maxHeight: `${coords.maxHeight}px`,
              zIndex: 99999999,
              boxShadow: '0 12px 28px -4px rgba(0, 0, 0, 0.25), 0 8px 12px -6px rgba(0, 0, 0, 0.15)',
              ...getPortalThemeVars(theme),
            }}
            className={`agv-query-dropdown flex flex-col rounded-md border border-[var(--agv-border-popup)] bg-[var(--agv-bg-popup)] py-1 overflow-hidden text-xs ${
              coords.isFlipUp ? 'agv-spring-up' : 'agv-spring-down'
            }`}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {shouldShowSearch && (
              <div className="p-1 border-b border-[var(--agv-border)]">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Tìm kiếm..."
                  {...NO_AUTOFILL_PROPS}
                  className="w-full min-h-[28px] h-7 rounded border border-[var(--agv-border)] bg-[var(--agv-bg-control)] px-2 text-xs text-[var(--agv-text-main)] outline-none focus:border-primary"
                />
              </div>
            )}
            <div className="overflow-y-auto max-h-[200px]">
              {filteredOptions.length === 0 ? (
                <div className="px-3 py-2 text-center text-xs text-[var(--agv-text-muted)]">
                  Không tìm thấy
                </div>
              ) : (
                filteredOptions.map((opt) => {
                  const isSelected = opt.value === value;
                  return (
                    <div
                      key={opt.value}
                      onClick={() => {
                        onChange(opt.value);
                        setIsOpen(false);
                      }}
                      className={`flex min-h-[28px] items-center justify-between px-2.5 py-1 cursor-pointer transition-colors text-xs select-none ${
                        isSelected
                          ? 'bg-primary text-primary-foreground font-medium'
                          : 'text-[var(--agv-text-main)] hover:bg-[var(--agv-bg-hover)]'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate mr-2">
                        {opt.icon && <span className="shrink-0 flex items-center">{opt.icon}</span>}
                        <span className="truncate">{opt.label}</span>
                      </div>
                      {isSelected && (
                        <Check size={12} strokeWidth={2.5} className="shrink-0" />
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
});

const LEVEL_PAREN_COLORS = [
  'var(--agv-accent)',
  'var(--agv-warning)',
  'var(--agv-info)',
  'var(--agv-danger)',
  'var(--agv-success)',
  'var(--agv-trend-up)',
];

const formatRuleDisplay = formatQueryRuleSummary;

export const AdvGridQueryBuilderModal = React.memo(
  function AdvGridQueryBuilderModal<T = any>({
    isOpen,
    onClose,
    columns,
    appliedTree,
    onApply,
    totalRowCount,
    surfaceTheme = SURFACE_THEMES.BEZIER_ARTHOUSE,
    data = [],
    getCellValue,
    hasColumnEmptyCells,
    getColumnDateBounds,
    style,
  }: AdvGridQueryBuilderModalProps<T>) {
    const [isMaximized, setIsMaximized] = useState(false);
    const [activeTab, setActiveTab] = useState<'builder' | 'presets'>('builder');
    const [presetNameInput, setPresetNameInput] = useState('');
    const [cmdInputText, setCmdInputText] = useState('');
    const [cmdError, setCmdError] = useState<string | null>(null);
    const [copiedCmd, setCopiedCmd] = useState(false);
    const [presetCopiedId, setPresetCopiedId] = useState<string | null>(null);
    const [hoveredParenPath, setHoveredParenPath] = useState<string | null>(null);
    const [multiFilterTarget, setMultiFilterTarget] = useState<{
      group: QueryGroup;
      rIdx: number;
      field: string;
      operator: QueryRule['operator'];
      anchorRect: { top: number; left: number; bottom: number; right: number; width?: number; height?: number };
    } | null>(null);
    const [expandedExplains, setExpandedExplains] = useState<Record<string, boolean>>({});
    const [presets, setPresets] = useState<QueryPreset[]>(() => {
      try {
        const saved = localStorage.getItem('AGV_QUERY_PRESETS_V1');
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    });

    const columnOptions = useMemo<QuerySelectOption[]>(() => {
      return columns.map((c) => ({
        value: c.key,
        label: c.title || c.key,
      }));
    }, [columns]);

    const columnDataTypes = useMemo(() => {
      const map: Record<string, string> = {};
      for (const c of columns) {
        map[c.key] = getColType(c.key, columns);
      }
      return map;
    }, [columns]);

    const [draftTree, setDraftTree] = useState<QueryGroup>(() => {
      if (appliedTree && Array.isArray(appliedTree.rules) && appliedTree.rules.length > 0) {
        return JSON.parse(JSON.stringify(appliedTree));
      }
      const firstCol = columns.find((c) => c.dataType !== DATA_TYPES.SYSTEM)?.key || columns[0]?.key || '';
      const defaultOp = getDefaultFilterOpForColumn(firstCol, columns);
      return {
        combinator: QUERY_COMBINATORS.AND,
        rules: [
          {
            field: firstCol,
            operator: defaultOp as QueryRule['operator'],
            value: '',
          },
        ],
      };
    });

    // Calculate match count live accurately across all rows (zero-closure getCellValue)
    const matchCount = useMemo(() => {
      if (!isOpen) return totalRowCount;
      if (!hasActiveQueryRules(draftTree)) return totalRowCount;
      if (totalRowCount <= 0) return 0;

      const hasDirectData = Boolean(data && Array.isArray(data) && data.length > 0);
      if (!hasDirectData && !getCellValue) return 0;

      const countTotal = hasDirectData ? data!.length : totalRowCount;
      let count = 0;

      for (let i = 0; i < countTotal; i++) {
        const rowItem = hasDirectData ? data![i] : null;
        if (evaluateQueryTreeNode(draftTree, rowItem, i, getCellValue, columnDataTypes)) {
          count++;
        }
      }

      return count;
    }, [isOpen, draftTree, data, totalRowCount, getCellValue, columnDataTypes]);

    // Jump to element in tree, focus it, and temporarily outline
    const jumpToTarget = useCallback((elementId: string) => {
      const el = document.getElementById(elementId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        const focusable = el.querySelector<HTMLElement>(
          'input, button, select, [tabindex="0"]'
        );
        focusable?.focus();
        el.style.outline = '2px solid var(--agv-accent)';
        el.style.outlineOffset = '1px';
        setTimeout(() => {
          el.style.outline = '';
          el.style.outlineOffset = '';
        }, 1500);
      }
    }, []);

    if (!isOpen) return null;

    // Save presets
    const handleSavePreset = () => {
      if (!presetNameInput.trim()) return;
      const newPreset: QueryPreset = {
        id: `preset_${Date.now()}`,
        name: presetNameInput.trim(),
        tree: JSON.parse(JSON.stringify(draftTree)),
        createdAt: Date.now(),
      };
      const updated = [newPreset, ...presets];
      setPresets(updated);
      setPresetNameInput('');
      try {
        localStorage.setItem('AGV_QUERY_PRESETS_V1', JSON.stringify(updated));
      } catch {}
    };

    const handleDeletePreset = (id: string) => {
      const updated = presets.filter((p) => p.id !== id);
      setPresets(updated);
      try {
        localStorage.setItem('AGV_QUERY_PRESETS_V1', JSON.stringify(updated));
      } catch {}
    };

    // Add preset from CMD text with validation
    const handleAddFromCmd = () => {
      if (!cmdInputText.trim()) {
        setCmdError('Vui lòng nhập chuỗi lệnh CMD.');
        return;
      }
      const result = parseCmdToQueryTree(cmdInputText, columns);
      if (!result.isValid || !result.tree) {
        setCmdError(`Lỗi: ${result.error || 'Cú pháp câu lệnh không hợp lệ.'}`);
        return;
      }

      const autoName =
        cmdInputText.trim().length > 35
          ? `${cmdInputText.trim().slice(0, 35)}...`
          : cmdInputText.trim();
      const newPreset: QueryPreset = {
        id: `preset_cmd_${Date.now()}`,
        name: autoName,
        tree: result.tree,
        createdAt: Date.now(),
        cmdText: cmdInputText.trim(),
      };
      const updated = [newPreset, ...presets];
      setPresets(updated);
      setCmdInputText('');
      setCmdError(null);
      try {
        localStorage.setItem('AGV_QUERY_PRESETS_V1', JSON.stringify(updated));
      } catch {}
    };

    // Clear all conditions and apply null
    const handleClearAll = () => {
      const firstCol = columns.find((c) => c.dataType !== DATA_TYPES.SYSTEM)?.key || columns[0]?.key || '';
      const defaultOp = getDefaultFilterOpForColumn(firstCol, columns);
      setDraftTree({
        combinator: QUERY_COMBINATORS.AND,
        rules: [
          {
            field: firstCol,
            operator: defaultOp as QueryRule['operator'],
            value: '',
          },
        ],
      });
      onApply(null);
      onClose();
    };

    // Tree actions
    const handleAddRule = (group: QueryGroup) => {
      const firstCol = columns.find((c) => c.dataType !== DATA_TYPES.SYSTEM)?.key || columns[0]?.key || '';
      const defaultOp = getDefaultFilterOpForColumn(firstCol, columns);
      const newRule: QueryRule = {
        field: firstCol,
        operator: defaultOp as QueryRule['operator'],
        value: '',
      };
      setDraftTree((prev) => {
        const next = JSON.parse(JSON.stringify(prev));
        const findAndAdd = (g: QueryGroup): boolean => {
          if (g === group || g.id === group.id) {
            g.rules.push(newRule);
            return true;
          }
          for (const r of g.rules) {
            if ('combinator' in r && findAndAdd(r)) return true;
          }
          return false;
        };
        if (!findAndAdd(next)) {
          next.rules.push(newRule);
        }
        return next;
      });
    };

    const handleAddGroup = (group: QueryGroup) => {
      const firstCol = columns.find((c) => c.dataType !== DATA_TYPES.SYSTEM)?.key || columns[0]?.key || '';
      const defaultOp = getDefaultFilterOpForColumn(firstCol, columns);
      const newSubGroup: QueryGroup = {
        id: `group_${Date.now()}`,
        combinator: QUERY_COMBINATORS.OR,
        rules: [
          {
            field: firstCol,
            operator: (defaultOp || FILTER_OPS.CONTAINS) as QueryRule['operator'],
            value: '',
          },
        ],
      };
      setDraftTree((prev) => {
        const next = JSON.parse(JSON.stringify(prev));
        const findAndAdd = (g: QueryGroup): boolean => {
          if (g === group || g.id === group.id) {
            g.rules.push(newSubGroup);
            return true;
          }
          for (const r of g.rules) {
            if ('combinator' in r && findAndAdd(r)) return true;
          }
          return false;
        };
        if (!findAndAdd(next)) {
          next.rules.push(newSubGroup);
        }
        return next;
      });
    };

    const handleDeleteItem = (parentGroup: QueryGroup, index: number) => {
      setDraftTree((prev) => {
        const next = JSON.parse(JSON.stringify(prev));
        const findAndDelete = (g: QueryGroup): boolean => {
          if (g.id === parentGroup.id || (parentGroup === draftTree && g === next)) {
            g.rules.splice(index, 1);
            if (g.rules.length === 0 && g === next) {
              const firstCol = columns.find((c) => c.dataType !== DATA_TYPES.SYSTEM)?.key || columns[0]?.key || '';
              const defaultOp = getDefaultFilterOpForColumn(firstCol, columns);
              g.rules.push({
                field: firstCol,
                operator: (defaultOp || FILTER_OPS.CONTAINS) as QueryRule['operator'],
                value: '',
              });
            }
            return true;
          }
          for (const r of g.rules) {
            if ('combinator' in r && findAndDelete(r)) return true;
          }
          return false;
        };
        findAndDelete(next);
        return next;
      });
    };

    const handleUpdateRule = (
      parentGroup: QueryGroup,
      ruleIndex: number,
      updater: (rule: QueryRule) => QueryRule
    ) => {
      setDraftTree((prev) => {
        const next = JSON.parse(JSON.stringify(prev));
        const findAndUpdate = (g: QueryGroup): boolean => {
          if (g.id === parentGroup.id || (parentGroup === draftTree && g === next)) {
            g.rules[ruleIndex] = updater(g.rules[ruleIndex] as QueryRule);
            return true;
          }
          for (const r of g.rules) {
            if ('combinator' in r && findAndUpdate(r)) return true;
          }
          return false;
        };
        findAndUpdate(next);
        return next;
      });
    };

    const handleToggleCombinator = (group: QueryGroup) => {
      setDraftTree((prev) => {
        const next = JSON.parse(JSON.stringify(prev));
        const findAndToggle = (g: QueryGroup): boolean => {
          if (g.id === group.id || (group === draftTree && g === next)) {
            g.combinator = g.combinator === QUERY_COMBINATORS.AND ? QUERY_COMBINATORS.OR : QUERY_COMBINATORS.AND;
            return true;
          }
          for (const r of g.rules) {
            if ('combinator' in r && findAndToggle(r)) return true;
          }
          return false;
        };
        findAndToggle(next);
        return next;
      });
    };

    // Interactive structured natural language tree (mỗi () là 1 màu theo cấp tầng, click để nhảy vào đúng nhóm/điều kiện)
    const renderInteractiveQueryTree = (
      node: QueryGroup,
      depth = 0,
      isRoot = true,
      path = '0',
      parentParenHovered = false
    ): React.ReactNode => {
      const levelColor = LEVEL_PAREN_COLORS[depth % LEVEL_PAREN_COLORS.length];
      const groupKey = node.id || `group_${path}`;
      const isThisParenHovered = hoveredParenPath === path;
      const isHighlighted = isThisParenHovered || parentParenHovered;

      return (
        <span
          key={groupKey}
          onClick={(e) => {
            e.stopPropagation();
            jumpToTarget(`agv-query-node-${path}`);
          }}
          className="inline-flex items-center flex-wrap gap-0.5 px-0.5 py-0.5 rounded select-text cursor-pointer transition-colors"
          style={{
            backgroundColor: isThisParenHovered
              ? `color-mix(in srgb, ${levelColor} 12%, transparent)`
              : undefined,
          }}
        >
          <span
            className="font-black text-sm select-none px-0.5 cursor-pointer rounded transition-transform hover:scale-125"
            style={{ color: levelColor }}
            onMouseEnter={() => setHoveredParenPath(path)}
            onMouseLeave={() => setHoveredParenPath(null)}
          >
            (
          </span>

          {node.rules.map((rule, idx) => {
            const isSubGroup = 'combinator' in rule;
            const glue = node.combinator === QUERY_COMBINATORS.AND ? 'VÀ' : 'HOẶC';
            const childPath = `${path}-${idx}`;

            return (
              <React.Fragment key={idx}>
                {idx > 0 && (
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded mx-0.5 select-none transition-colors"
                    style={{
                      color: levelColor,
                      border: `1px solid ${levelColor}`,
                      backgroundColor: isHighlighted
                        ? `color-mix(in srgb, ${levelColor} 22%, var(--agv-bg-popup))`
                        : 'var(--agv-bg-popup)',
                    }}
                  >
                    {glue}
                  </span>
                )}

                {isSubGroup ? (
                  renderInteractiveQueryTree(
                    rule as QueryGroup,
                    depth + 1,
                    false,
                    childPath,
                    isHighlighted
                  )
                ) : (
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      jumpToTarget(`agv-query-node-${childPath}`);
                    }}
                    className="inline-flex items-center font-medium text-xs px-2 py-0.5 rounded border text-[var(--agv-text-main)] cursor-pointer select-text transition-colors"
                    style={{
                      backgroundColor: isHighlighted
                        ? `color-mix(in srgb, ${levelColor} 22%, var(--agv-bg-popup))`
                        : 'var(--agv-bg-popup)',
                      borderColor: isHighlighted
                        ? levelColor
                        : 'var(--agv-border)',
                    }}
                  >
                    {formatRuleDisplay(rule as QueryRule, columns)}
                  </span>
                )}
              </React.Fragment>
            );
          })}

          <span
            className="font-black text-sm select-none px-0.5 cursor-pointer rounded transition-transform hover:scale-125"
            style={{ color: levelColor }}
            onMouseEnter={() => setHoveredParenPath(path)}
            onMouseLeave={() => setHoveredParenPath(null)}
          >
            )
          </span>
        </span>
      );
    };

    // Static structured natural language tree for saved presets (mỗi () là 1 màu theo tầng)
    const renderPresetQueryTree = (
      node: QueryGroup,
      depth = 0
    ): React.ReactNode => {
      if (!node || !Array.isArray(node.rules)) {
        return (
          <span className="text-[var(--agv-text-subtle)] italic select-none">
            (Không có điều kiện lọc)
          </span>
        );
      }
      const levelColor = LEVEL_PAREN_COLORS[depth % LEVEL_PAREN_COLORS.length];
      const activeRules = node.rules.filter((r) => {
        if ('combinator' in r) return hasActiveQueryRules(r);
        return isRuleActive(r);
      });

      if (activeRules.length === 0) {
        return (
          <span className="text-[var(--agv-text-subtle)] italic select-none">
            (Không có điều kiện lọc)
          </span>
        );
      }

      return (
        <span
          className="inline-flex items-center flex-wrap gap-0.5 px-0.5 py-0.5 rounded select-text"
        >
          <span
            className="font-black text-sm select-none px-0.5"
            style={{ color: levelColor }}
          >
            (
          </span>

          {activeRules.map((rule, idx) => {
            const isSubGroup = 'combinator' in rule;
            const glue = node.combinator === QUERY_COMBINATORS.AND ? 'VÀ' : 'HOẶC';

            return (
              <React.Fragment key={idx}>
                {idx > 0 && (
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded mx-0.5 select-none bg-[var(--agv-bg-popup)]"
                    style={{
                      color: levelColor,
                      border: `1px solid ${levelColor}`,
                    }}
                  >
                    {glue}
                  </span>
                )}

                {isSubGroup ? (
                  renderPresetQueryTree(rule as QueryGroup, depth + 1)
                ) : (
                  <span className="inline-flex items-center font-medium text-xs px-2 py-0.5 rounded border border-[var(--agv-border)] bg-[var(--agv-bg-popup)] text-[var(--agv-text-main)] select-text">
                    {formatRuleDisplay(rule as QueryRule, columns)}
                  </span>
                )}
              </React.Fragment>
            );
          })}

          <span
            className="font-black text-sm select-none px-0.5"
            style={{ color: levelColor }}
          >
            )
          </span>
        </span>
      );
    };

    // Recursive render of a group
    const renderGroup = (
      group: QueryGroup,
      depth = 0,
      ruleIndex?: number,
      parentGroup?: QueryGroup,
      path = '0'
    ): React.ReactNode => {
      const isRoot = depth === 0;
      const isAnd = group.combinator === QUERY_COMBINATORS.AND;
      const groupKey = group.id || `group_${path}`;
      // Nút giải nghĩa KHÔNG mở sẵn (mặc định đóng, chỉ mở khi bấm !)
      // Ở nhóm 1 (isRoot): Không hiển thị giải nghĩa tầng để không bị giải nghĩa 2 lần
      const isExplainOpen = !isRoot && !!expandedExplains[groupKey];
      const groupExplanation = generateNaturalLanguage(group, columns);

      return (
        <div
          id={`agv-query-node-${path}`}
          key={groupKey}
          className={`space-y-1.5 rounded-md border border-[var(--agv-border)] p-2 ${
            isRoot
              ? 'bg-[var(--agv-bg-popup)]'
              : 'bg-[var(--agv-bg-control)] ml-3'
          }`}
        >
          {/* Group Header: Combinator button + Add rule/group + [!] button giải nghĩa tầng (chỉ cho nhóm con) */}
          <div className="flex items-center justify-between gap-2 pb-1 border-b border-[var(--agv-border)]">
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => handleToggleCombinator(group)}
                className={`min-h-[28px] h-7 px-3 rounded text-xs font-bold transition-colors select-none cursor-pointer ${
                  isAnd
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-[var(--agv-warning)] text-primary-foreground'
                }`}
              >
                {isAnd ? 'VÀ' : 'HOẶC'}
              </button>

              <button
                type="button"
                onClick={() => handleAddRule(group)}
                className="flex min-h-[28px] h-7 items-center gap-1 rounded border border-[var(--agv-border-strong)] bg-[var(--agv-bg-control)] px-2.5 text-xs font-medium text-[var(--agv-text-main)] hover:bg-[var(--agv-bg-item-hover)] cursor-pointer"
              >
                <Plus className="h-3 w-3" />
                <span>Thêm điều kiện</span>
              </button>

              <button
                type="button"
                onClick={() => handleAddGroup(group)}
                className="flex min-h-[28px] h-7 items-center gap-1 rounded border border-[var(--agv-border-strong)] bg-[var(--agv-bg-control)] px-2.5 text-xs font-medium text-[var(--agv-text-subtle)] hover:text-[var(--agv-text-main)] hover:bg-[var(--agv-bg-item-hover)] cursor-pointer"
              >
                <Plus className="h-3 w-3" />
                <span>Thêm nhóm</span>
              </button>
            </div>

            {/* Right side: Nút [ ! ] giải nghĩa theo từng tầng (Chỉ hiển thị ở nhóm con !isRoot để nhóm 1 không giải nghĩa 2 lần) */}
            <div className="flex items-center gap-1.5 shrink-0 ml-auto">
              {!isRoot && (
                <button
                  type="button"
                  onClick={() => {
                    setExpandedExplains((prev) => ({
                      ...prev,
                      [groupKey]: !prev[groupKey],
                    }));
                  }}
                  className={`flex min-h-[28px] min-w-[28px] h-7 w-7 items-center justify-center rounded border text-xs font-bold transition-all cursor-pointer ${
                    isExplainOpen
                      ? 'bg-primary border-primary text-primary-foreground'
                      : 'border-[var(--agv-border-strong)] bg-[var(--agv-bg-control)] text-[var(--agv-text-muted)] hover:text-primary hover:border-primary'
                  }`}
                >
                  !
                </button>
              )}
              {!isRoot && parentGroup && ruleIndex !== undefined && (
                <button
                  type="button"
                  onClick={() => handleDeleteItem(parentGroup, ruleIndex)}
                  className="flex min-h-[28px] min-w-[28px] h-7 w-7 items-center justify-center rounded text-[var(--agv-text-subtle)] hover:bg-[var(--agv-danger-bg)] hover:text-[var(--agv-danger)] ml-0.5 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Group Natural Language Explanation Banner (Chỉ mở khi người dùng bấm nút [!] ở nhóm con) */}
          {isExplainOpen && (
            <div className="mt-1.5 mb-1 flex items-start gap-2 rounded border border-[var(--agv-border)] bg-[var(--agv-bg-root)] px-2.5 py-1.5 text-xs text-[var(--agv-text-main)]">
              <span className="font-bold text-primary shrink-0 select-none">
                Giải nghĩa:
              </span>
              <span className="leading-relaxed select-text font-medium text-[var(--agv-text-main)]">
                {groupExplanation || '(Chưa có điều kiện hợp lệ)'}
              </span>
            </div>
          )}

          {/* Group Rules List */}
          <div className="space-y-1.5 pt-1">
            {group.rules.map((ruleNode, rIdx) => {
              const rulePath = `${path}-${rIdx}`;
              if ('combinator' in ruleNode) {
                return renderGroup(ruleNode, depth + 1, rIdx, group, rulePath);
              }

              const rule = ruleNode as QueryRule;
              const colType = getColumnFilterType(rule.field, columns);
              const allowedOps = getAllowedFilterOpsForColumn(rule.field, columns, hasColumnEmptyCells);
              const currentOpOptions: QuerySelectOption[] = allowedOps.map((op) => ({
                value: op,
                label: FILTER_OP_META[op]?.label || op,
                icon: <FilterOpIcon op={op} size={14} className="shrink-0" />,
              }));

              const isBetween = isBetweenFilterOp(rule.operator);
              const isUnary = isNoInputFilterOp(rule.operator);

              return (
                <div
                  key={`rule_${rIdx}`}
                  id={`agv-query-node-${rulePath}`}
                  className="flex items-center gap-1.5 rounded border border-[var(--agv-border)] bg-[var(--agv-bg-popup)] p-1.5 text-xs transition-colors flex-nowrap min-w-0"
                >
                  {/* Field Selector */}
                  <QueryCustomSelect
                    value={rule.field}
                    options={columnOptions}
                    onChange={(newField) => {
                      const nextAllowed = getAllowedFilterOpsForColumn(newField, columns, hasColumnEmptyCells);
                      const nextOp = nextAllowed.includes(rule.operator as any)
                        ? rule.operator
                        : getDefaultFilterOpForColumn(newField, columns);
                      handleUpdateRule(group, rIdx, (r) => ({
                        ...r,
                        field: newField,
                        operator: nextOp as QueryRule['operator'],
                        value: '',
                        valueTo: '',
                      }));
                    }}
                    minWidth={130}
                    theme={surfaceTheme}
                    showSearch={true}
                  />

                  {/* Operator Selector (đồng bộ 100% toán tử và icon SVG theo hàm chung getAllowedFilterOpsForColumn) */}
                  <QueryCustomSelect
                    value={rule.operator}
                    options={currentOpOptions}
                    onChange={(newOp) =>
                      handleUpdateRule(group, rIdx, (r) => ({
                        ...r,
                        operator: newOp as QueryRule['operator'],
                        value: '',
                        valueTo: '',
                      }))
                    }
                    iconOnly={true}
                    minWidth={44}
                    popupMinWidth={175}
                    theme={surfaceTheme}
                    showSearch={false}
                  />

                  {/* Value Input (đồng bộ với rowfilter theo dataType & operator, hỗ trợ Lọc nhiều giá trị) */}
                  {!isUnary && (
                    <>
                      {(Array.isArray(rule.multiValues) && rule.multiValues.length > 0) ||
                      (Array.isArray(rule.multiRanges) && rule.multiRanges.length > 0) ? (
                        <div className="flex items-center gap-1.5 flex-1 min-w-[150px] max-w-[320px]">
                          <div
                            onClick={(e) => {
                              const rect = e.currentTarget.getBoundingClientRect();
                              setMultiFilterTarget({
                                group,
                                rIdx,
                                field: rule.field,
                                operator: rule.operator,
                                anchorRect: rect,
                              });
                            }}
                            className="flex min-h-[28px] h-7 flex-1 items-center justify-between rounded border border-[var(--agv-border-strong)] bg-[var(--agv-bg-control)] px-2.5 text-xs text-[var(--agv-text-main)] cursor-pointer hover:border-primary select-none truncate"
                          >
                            <span className="truncate font-medium">
                              {rule.multiValues
                                ? `${rule.multiValues.slice(0, 2).map((v) => `"${v}"`).join(', ')}${rule.multiValues.length > 2 ? ` (+${rule.multiValues.length - 2})` : ''}`
                                : `${rule.multiRanges?.length || 0} khoảng`}
                            </span>
                            <span className="ml-1.5 rounded bg-primary px-1.5 py-0.2 text-[10px] font-bold text-primary-foreground shrink-0">
                              {rule.multiValues ? `${rule.multiValues.length} giá trị` : 'Khoảng'}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              handleUpdateRule(group, rIdx, (r) => ({
                                ...r,
                                multiValues: undefined,
                                multiRanges: undefined,
                              }));
                            }}
                            className="min-h-[28px] min-w-[28px] h-7 w-7 flex items-center justify-center rounded border border-[var(--agv-border-strong)] bg-[var(--agv-bg-control)] text-xs text-[var(--agv-text-muted)] hover:text-[var(--agv-danger)] hover:border-[var(--agv-danger)] cursor-pointer select-none"
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 flex-1 min-w-0 flex-nowrap">
                          {colType === DATA_TYPES.DATE ? (
                            (() => {
                              const colDef = columns.find((c) => c.key === rule.field);
                              const dateBounds = colDef?.minDate && colDef?.maxDate
                                ? { min: colDef.minDate, max: colDef.maxDate }
                                : (getColumnDateBounds?.(rule.field) || { min: '2017-01-01', max: '2027-12-31' });

                              return isBetween ? (
                                <div className="flex-1 min-w-[170px] max-w-[280px]">
                                  <AdvDateRangePicker
                                    from={rule.value || ''}
                                    to={rule.valueTo || ''}
                                    onChange={(range) => {
                                      handleUpdateRule(group, rIdx, (r) => ({
                                        ...r,
                                        value: range.from || '',
                                        valueTo: range.to || '',
                                      }));
                                    }}
                                    min={dateBounds.min}
                                    max={dateBounds.max}
                                    placeholderFrom="Từ"
                                    placeholderTo="Đến"
                                    theme={surfaceTheme}
                                    size="xs"
                                    showPreset={true}
                                    dualMonth={false}
                                  />
                                </div>
                              ) : (
                                <div className="flex-1 min-w-[140px] max-w-[200px]">
                                  <AdvDatePicker
                                    value={rule.value || ''}
                                    onChange={(val, range) => {
                                      handleUpdateRule(group, rIdx, (r) => ({
                                        ...r,
                                        value: val || (range?.from ?? ''),
                                      }));
                                    }}
                                    min={dateBounds.min}
                                    max={dateBounds.max}
                                    placeholder="Chọn ngày..."
                                    theme={surfaceTheme}
                                    showPreset={true}
                                    size="xs"
                                    className="w-full h-full"
                                  />
                                </div>
                              );
                            })()
                          ) : colType === DATA_TYPES.TIME ? (
                            isBetween ? (
                              <div className="flex-1 min-w-[140px] max-w-[190px] rounded border border-[var(--agv-border-strong)] bg-[var(--agv-bg-control)] px-1">
                                <TimeRangeFilterInput
                                  from={rule.value || ''}
                                  to={rule.valueTo || ''}
                                  onChange={(from, to) => {
                                    handleUpdateRule(group, rIdx, (r) => ({
                                      ...r,
                                      value: from,
                                      valueTo: to,
                                    }));
                                  }}
                                  hasValue={Boolean(rule.value || rule.valueTo)}
                                />
                              </div>
                            ) : (
                              <div className="flex-1 min-w-[90px] max-w-[130px] rounded border border-[var(--agv-border-strong)] bg-[var(--agv-bg-control)] px-1">
                                <TimeFilterInput
                                  value={rule.value || ''}
                                  onChange={(val) => {
                                    handleUpdateRule(group, rIdx, (r) => ({
                                      ...r,
                                      value: val,
                                    }));
                                  }}
                                  placeholder="HH:mm"
                                  hasValue={Boolean(rule.value)}
                                />
                              </div>
                            )
                          ) : isBetween ? (
                            <div className="flex items-center gap-1 flex-1 min-w-[180px]">
                              <input
                                type="text"
                                value={rule.value ?? ''}
                                onChange={(e) =>
                                  handleUpdateRule(group, rIdx, (r) => ({
                                    ...r,
                                    value: e.target.value,
                                  }))
                                }
                                placeholder={colType === DATA_TYPES.NUMBER ? 'Từ số...' : 'Từ...'}
                                {...NO_AUTOFILL_PROPS}
                                className="min-h-[28px] h-7 flex-1 min-w-0 rounded border border-[var(--agv-border-strong)] bg-[var(--agv-bg-control)] px-2 text-xs text-[var(--agv-text-main)] outline-none focus:border-primary"
                              />
                              <RangeArrowSeparator className="mx-0.5" />
                              <input
                                type="text"
                                value={rule.valueTo ?? ''}
                                onChange={(e) =>
                                  handleUpdateRule(group, rIdx, (r) => ({
                                    ...r,
                                    valueTo: e.target.value,
                                  }))
                                }
                                placeholder={colType === DATA_TYPES.NUMBER ? 'Đến số...' : 'Đến...'}
                                {...NO_AUTOFILL_PROPS}
                                className="min-h-[28px] h-7 flex-1 min-w-0 rounded border border-[var(--agv-border-strong)] bg-[var(--agv-bg-control)] px-2 text-xs text-[var(--agv-text-main)] outline-none focus:border-primary"
                              />
                            </div>
                          ) : (
                            <input
                              type="text"
                              value={rule.value ?? ''}
                              onChange={(e) =>
                                handleUpdateRule(group, rIdx, (r) => ({
                                  ...r,
                                  value: e.target.value,
                                }))
                              }
                              placeholder={colType === DATA_TYPES.NUMBER ? 'Nhập số tiền...' : 'Nhập giá trị...'}
                              {...NO_AUTOFILL_PROPS}
                              className="min-h-[28px] h-7 flex-1 min-w-[120px] rounded border border-[var(--agv-border-strong)] bg-[var(--agv-bg-control)] px-2 text-xs text-[var(--agv-text-main)] outline-none focus:border-primary"
                            />
                          )}

                          {/* Nút SVG mở AdvMultiFilterPopup dán danh sách hàng loạt (không chữ, hiển thị chuẩn 1 dòng) */}
                          <button
                            type="button"
                            onClick={(e) => {
                              const rect = e.currentTarget.getBoundingClientRect();
                              setMultiFilterTarget({
                                group,
                                rIdx,
                                field: rule.field,
                                operator: rule.operator,
                                anchorRect: rect,
                              });
                            }}
                            className="flex min-h-[28px] min-w-[28px] h-7 w-7 items-center justify-center rounded border border-[var(--agv-border-strong)] bg-[var(--agv-bg-control)] text-[var(--agv-text-muted)] hover:text-primary hover:border-primary hover:bg-[var(--agv-bg-item-hover)] cursor-pointer select-none shrink-0 transition-colors"
                          >
                            <ListFilter className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                    </>
                  )}

                  {/* Delete Rule */}
                  <button
                    type="button"
                    onClick={() => handleDeleteItem(group, rIdx)}
                    className="flex min-h-[28px] min-w-[28px] h-7 w-7 items-center justify-center rounded text-[var(--agv-text-subtle)] hover:bg-[var(--agv-danger-bg)] hover:text-[var(--agv-danger)] ml-auto"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      );
    };

    const naturalSummary = generateNaturalLanguage(draftTree, columns);

    return (
      <div
        data-agv-popup="true"
        style={
          isMaximized
            ? {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 1250,
              }
            : {
                position: 'absolute',
                zIndex: 1250,
                width: '560px',
                maxWidth: 'calc(100% - 60px)',
                maxHeight: 'min(460px, calc(100% - 32px))',
                boxShadow: '0 12px 28px -4px rgba(0, 0, 0, 0.25), 0 8px 12px -6px rgba(0, 0, 0, 0.15)',
                ...style,
              }
        }
        className="agv-query-builder-modal flex flex-col rounded-md border border-[var(--agv-border-popup)] bg-[var(--agv-bg-popup)] text-[var(--agv-text-main)] overflow-hidden select-none agv-spring-left"
        onClick={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
      >
        {/* Unified Header & Tab Switcher (Gộp thành 1, bỏ text header) */}
        <div className="flex items-center justify-between border-b border-[var(--agv-border)] px-3 bg-[var(--agv-bg-header)] shrink-0 min-h-[36px]">
          <div className="flex items-center gap-1 h-full">
            <button
              type="button"
              onClick={() => setActiveTab('builder')}
              className={`min-h-[28px] h-full px-2.5 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'builder'
                  ? 'border-primary text-primary font-bold'
                  : 'border-transparent text-[var(--agv-text-muted)] hover:text-[var(--agv-text-main)]'
              }`}
            >
              <span>Cây Điều Kiện</span>
              {hasActiveQueryRules(draftTree) && (
                <span className="rounded bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground">
                  {countActiveQueryRules(draftTree)}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('presets')}
              className={`min-h-[28px] h-full px-2.5 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'presets'
                  ? 'border-primary text-primary font-bold'
                  : 'border-transparent text-[var(--agv-text-muted)] hover:text-[var(--agv-text-main)]'
              }`}
            >
              <span>Mẫu Đã Lưu ({presets.length})</span>
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setIsMaximized((prev) => !prev)}
              className="flex min-h-[28px] min-w-[28px] h-7 w-7 items-center justify-center rounded text-[var(--agv-text-subtle)] hover:bg-[var(--agv-bg-item-hover)] hover:text-[var(--agv-text-main)]"
            >
              {isMaximized ? (
                <Minimize2 className="h-3.5 w-3.5" />
              ) : (
                <Maximize2 className="h-3.5 w-3.5" />
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex min-h-[28px] min-w-[28px] h-7 w-7 items-center justify-center rounded text-[var(--agv-text-subtle)] hover:bg-[var(--agv-danger-bg)] hover:text-[var(--agv-danger)]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="agv-query-builder-scroll flex-1 min-h-0 overflow-y-auto p-3 space-y-2">
          {activeTab === 'builder' ? (
            <>
              {/* Thanh Câu Truy Vấn (Interactive: đã bỏ chữ "Giải nghĩa:", chip tinh gọn, icon sao chép góc phải bên dưới) */}
              {hasActiveQueryRules(draftTree) && (
                <div className="relative rounded-md border border-[var(--agv-border)] bg-[var(--agv-bg-control)] p-2 text-xs">
                  <div className="flex items-center flex-wrap gap-1 leading-relaxed pr-8">
                    {renderInteractiveQueryTree(draftTree, 0, true, '0')}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const cmd = generateNaturalLanguage(draftTree, columns);
                      if (cmd) {
                        navigator.clipboard?.writeText(cmd);
                        setCopiedCmd(true);
                        setTimeout(() => setCopiedCmd(false), 2000);
                      }
                    }}
                    className="absolute bottom-1.5 right-1.5 flex min-h-[28px] min-w-[28px] h-7 w-7 items-center justify-center rounded border border-[var(--agv-border-strong)] bg-[var(--agv-bg-popup)] text-[var(--agv-text-muted)] hover:text-primary hover:border-primary hover:bg-[var(--agv-bg-item-hover)] cursor-pointer select-none transition-colors"
                  >
                    {copiedCmd ? (
                      <Check className="h-3.5 w-3.5 text-primary" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              )}
              {renderGroup(draftTree, 0, undefined, undefined, '0')}
            </>
          ) : (
            <div className="space-y-3">
              {/* Card 1: Nạp Mẫu Mới Bằng Lệnh CMD */}
              <div className="rounded-md border border-[var(--agv-border)] bg-[var(--agv-bg-control)] p-2.5 space-y-2">
                <div className="text-xs font-bold text-[var(--agv-text-main)] select-none">
                  Nạp mẫu mới bằng lệnh CMD
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <input
                    type="text"
                    value={cmdInputText}
                    onChange={(e) => {
                      setCmdInputText(e.target.value);
                      if (cmdError) setCmdError(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddFromCmd();
                      }
                    }}
                    placeholder='Dán chuỗi lệnh CMD vào đây (ví dụ: [Hãng] = "VJ" VÀ [Mã Chỗ] chứa "A")...'
                    {...NO_AUTOFILL_PROPS}
                    className="min-h-[28px] h-7 flex-1 rounded border border-[var(--agv-border-strong)] bg-[var(--agv-bg-popup)] px-2 text-xs text-[var(--agv-text-main)] outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddFromCmd}
                    className="min-h-[28px] h-7 px-3 rounded bg-primary text-xs font-bold text-primary-foreground cursor-pointer select-none"
                  >
                    Kiểm tra & Thêm
                  </button>
                </div>
                {cmdError && (
                  <div className="text-xs font-medium text-[var(--agv-danger)] bg-[var(--agv-danger-bg)] p-1.5 rounded border border-[var(--agv-danger)]">
                    {cmdError}
                  </div>
                )}
              </div>

              {/* Card 2: Lưu Mẫu Từ Cây Điều Kiện Hiện Tại */}
              <div className="rounded-md border border-[var(--agv-border)] bg-[var(--agv-bg-control)] p-2.5 space-y-2">
                <div className="text-xs font-bold text-[var(--agv-text-main)] select-none">
                  Lưu mẫu từ cây điều kiện hiện tại
                </div>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={presetNameInput}
                    onChange={(e) => setPresetNameInput(e.target.value)}
                    placeholder="Đặt tên mẫu bộ lọc hiện tại..."
                    {...NO_AUTOFILL_PROPS}
                    className="min-h-[28px] h-7 flex-1 rounded border border-[var(--agv-border-strong)] bg-[var(--agv-bg-popup)] px-2 text-xs text-[var(--agv-text-main)] outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleSavePreset}
                    className="min-h-[28px] h-7 px-3 rounded border border-[var(--agv-border-strong)] bg-[var(--agv-bg-popup)] text-xs font-medium text-[var(--agv-text-main)] hover:bg-[var(--agv-bg-item-hover)] cursor-pointer select-none"
                  >
                    Lưu mẫu
                  </button>
                </div>
              </div>

              {/* Danh sách mẫu đã lưu */}
              {presets.length === 0 ? (
                <div className="py-6 text-center text-xs text-[var(--agv-text-subtle)] italic">
                  Chưa có mẫu nào được lưu
                </div>
              ) : (
                presets.map((preset) => {
                  const validation = validateQueryTreeAgainstColumns(preset.tree, columns);
                  const presetCmd = preset.cmdText || generateNaturalLanguage(preset.tree, columns);
                  const isCopied = presetCopiedId === preset.id;

                  return (
                    <div
                      key={preset.id}
                      className="flex flex-col gap-2 rounded-md border border-[var(--agv-border)] bg-[var(--agv-bg-control)] p-2.5 text-xs"
                    >
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[var(--agv-text-main)]">
                            {preset.name}
                          </span>
                          {validation.isValid ? (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary text-primary-foreground select-none">
                              Hợp lệ
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[var(--agv-danger-bg)] text-[var(--agv-danger)] border border-[var(--agv-danger)] select-none">
                              Không hợp lệ
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1 shrink-0 ml-auto">
                          <button
                            type="button"
                            onClick={() => {
                              if (presetCmd) {
                                navigator.clipboard?.writeText(presetCmd);
                                setPresetCopiedId(preset.id);
                                setTimeout(() => setPresetCopiedId(null), 2000);
                              }
                            }}
                            className="min-h-[28px] h-7 px-2 rounded border border-[var(--agv-border-strong)] bg-[var(--agv-bg-popup)] text-[var(--agv-text-main)] hover:bg-[var(--agv-bg-item-hover)] text-xs font-medium cursor-pointer"
                          >
                            {isCopied ? 'Đã chép!' : 'Sao chép CMD'}
                          </button>
                          <button
                            type="button"
                            disabled={!validation.isValid}
                            onClick={() => {
                              if (!validation.isValid) return;
                              setDraftTree(JSON.parse(JSON.stringify(preset.tree)));
                              setActiveTab('builder');
                            }}
                            className={`min-h-[28px] h-7 px-2.5 rounded font-medium text-xs select-none ${
                              validation.isValid
                                ? 'border border-[var(--agv-border-strong)] bg-[var(--agv-bg-popup)] text-[var(--agv-text-main)] hover:bg-[var(--agv-bg-item-hover)] cursor-pointer'
                                : 'opacity-40 cursor-not-allowed bg-[var(--agv-bg-control)] text-[var(--agv-text-muted)] border border-[var(--agv-border)]'
                            }`}
                          >
                            Nạp
                          </button>
                          <button
                            type="button"
                            disabled={!validation.isValid}
                            onClick={() => {
                              if (!validation.isValid) return;
                              onApply(JSON.parse(JSON.stringify(preset.tree)));
                              onClose();
                            }}
                            className={`min-h-[28px] h-7 px-2.5 rounded font-bold text-xs select-none ${
                              validation.isValid
                                ? 'bg-primary text-primary-foreground cursor-pointer hover:opacity-90'
                                : 'opacity-40 cursor-not-allowed bg-[var(--agv-bg-control)] text-[var(--agv-text-muted)] border border-[var(--agv-border)]'
                            }`}
                          >
                            Áp dụng
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeletePreset(preset.id)}
                            className="min-h-[28px] min-w-[28px] h-7 w-7 flex items-center justify-center rounded text-[var(--agv-text-subtle)] hover:bg-[var(--agv-danger-bg)] hover:text-[var(--agv-danger)] cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Hiển thị lỗi nếu không hợp lệ */}
                      {!validation.isValid && (
                        <div className="text-xs text-[var(--agv-danger)] font-medium bg-[var(--agv-danger-bg)] p-1.5 rounded border border-[var(--agv-danger)]">
                          {validation.error}
                        </div>
                      )}

                      {/* Câu lệnh CMD & Biểu thức cấu trúc */}
                      <div className="flex flex-col gap-1.5 rounded border border-[var(--agv-border)] bg-[var(--agv-bg-popup)] px-2.5 py-1.5 text-xs select-text">
                        <div className="flex items-center gap-1.5 overflow-hidden">
                          <span className="font-semibold text-primary select-none shrink-0">
                            Lệnh CMD:
                          </span>
                          <span className="font-mono text-xs text-[var(--agv-text-main)] truncate select-all">
                            {presetCmd || '(Trống)'}
                          </span>
                        </div>
                        <div className="flex items-center flex-wrap gap-1 leading-relaxed pt-0.5 border-t border-[var(--agv-border)]">
                          {renderPresetQueryTree(preset.tree, 0)}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Footer (Nút Hủy để clear sạch điều kiện & Nút Áp dụng) */}
        <div className="flex items-center justify-between border-t border-[var(--agv-border)] px-3 py-2 bg-[var(--agv-bg-header)] shrink-0">
          <div className="text-xs font-medium text-[var(--agv-text-muted)] tabular-nums whitespace-nowrap select-none">
            {matchCount.toLocaleString('vi-VN')}/{totalRowCount.toLocaleString('vi-VN')} ({totalRowCount > 0 ? Math.round((matchCount / totalRowCount) * 100) : 0}%)
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleClearAll}
              className="flex min-h-[28px] h-7 items-center justify-center rounded border border-[var(--agv-border-strong)] bg-[var(--agv-bg-control)] px-3 text-xs font-medium text-[var(--agv-text-main)] hover:bg-[var(--agv-bg-item-hover)] cursor-pointer select-none"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={() => {
                onApply(JSON.parse(JSON.stringify(draftTree)));
                onClose();
              }}
              className="flex min-h-[28px] h-7 items-center gap-1 rounded bg-primary px-3 text-xs font-bold text-primary-foreground cursor-pointer select-none"
            >
              <Check className="h-3 w-3 stroke-[3]" />
              <span>Áp dụng</span>
            </button>
          </div>
        </div>

        {/* AdvMultiFilterPopup tích hợp cho lọc nhiều giá trị */}
        {multiFilterTarget && (
          <AdvMultiFilterPopup
            isOpen={Boolean(multiFilterTarget)}
            onClose={() => setMultiFilterTarget(null)}
            anchorRect={multiFilterTarget.anchorRect}
            column={
              columns.find((c) => c.key === multiFilterTarget.field) || {
                key: multiFilterTarget.field,
                title: multiFilterTarget.field,
                defaultWidth: 100,
              }
            }
            currentFilter={(() => {
              const rule = multiFilterTarget.group.rules[multiFilterTarget.rIdx] as QueryRule;
              if (!rule) return undefined;
              return {
                op: (rule.operator as FilterOperation) || FILTER_OPS.EQUALS,
                val: rule.value || '',
                mode: FILTER_MODES.MULTI,
                multiValues: rule.multiValues,
                multiRanges: rule.multiRanges,
              };
            })()}
            onApply={(colKey, filterVal) => {
              const { group, rIdx } = multiFilterTarget;
              handleUpdateRule(group, rIdx, (r) => {
                const isMultiVal = Boolean(filterVal.multiValues && filterVal.multiValues.length > 0);
                const isMultiRng = Boolean(filterVal.multiRanges && filterVal.multiRanges.length > 0);
                return {
                  ...r,
                  operator: (filterVal.op as QueryRule['operator']) || r.operator,
                  value: isMultiVal ? (filterVal.multiValues![0] || '') : (filterVal.val || ''),
                  multiValues: isMultiVal ? filterVal.multiValues : undefined,
                  multiRanges: isMultiRng ? filterVal.multiRanges : undefined,
                };
              });
              setMultiFilterTarget(null);
            }}
            onClear={() => {
              const { group, rIdx } = multiFilterTarget;
              handleUpdateRule(group, rIdx, (r) => ({
                ...r,
                value: '',
                valueTo: '',
                multiValues: undefined,
                multiRanges: undefined,
              }));
              setMultiFilterTarget(null);
            }}
            hasColumnEmptyCells={hasColumnEmptyCells}
            getColumnDateBounds={getColumnDateBounds}
            surfaceTheme={surfaceTheme}
          />
        )}
      </div>
    );
  }
);
