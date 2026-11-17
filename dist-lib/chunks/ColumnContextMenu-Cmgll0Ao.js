import { jsxs as n, jsx as e, Fragment as b } from "react/jsx-runtime";
import { useState as Be } from "react";
import { M as ne } from "./MorphIcons-DW5eQGeo.js";
import { A as ae } from "./AdvButton-Ck5SixaL.js";
import { A as Fe } from "./AdvPopover-CVmyHBzb.js";
import { n as ie, P as y, D as Te, c as d, S as x } from "./gridFormatUtils-wCKPmlrt.js";
import { copyTextToClipboard as _e } from "./gridClipboardUtils-CP1iXhvQ.js";
const Ge = ({
  menu: g,
  surfaceTheme: Ie,
  onClose: r,
  onSetPin: H,
  onAutoFitColumn: L,
  onAutoFitAllColumns: se,
  onHideColumn: O,
  onShowAllHiddenColumns: C,
  onSetBandPin: R,
  onAutoFitBandColumns: B,
  onHideBand: F,
  onFilterByValue: ce,
  onScrollToTop: U,
  onScrollToBottom: X,
  isRowPinned: G = !1,
  pinnedRowCount: le = 0,
  onTogglePinRow: Y,
  onClearPinnedRows: oe,
  checkedRowCount: W = 0,
  onClearCheckedRows: q,
  columns: Pe = [],
  columnGroups: De = [],
  groupByColumnKey: T,
  onToggleGroupByColumn: I,
  onCollapseAllGroups: pe,
  onExpandAllGroups: de,
  onUngroup: me,
  onCopyGroupTable: D,
  formulaMode: M = d.MAX,
  onSelectFormulaMode: $,
  emptyColKeys: he,
  onHideAllEmptyColumns: xe,
  groupSortConfig: ve,
  onToggleGroupSort: J,
  sortConfig: S,
  onSortChange: E,
  enableColumnPinning: ue = !0,
  enableCenterDock: be = !0
}) => {
  const [_, ge] = Be(!1), [fe, $e] = Be(!1), ye = (o, s, A, Q) => {
    const v = [];
    if (s && v.push({ pin: y.LEFT, label: "Trái" }), A && v.push({ pin: y.CENTER, label: "Giữa" }), s && v.push({ pin: y.RIGHT, label: "Phải" }), v.length === 0) return null;
    const Z = v.length === 3 ? "grid-cols-3" : v.length === 2 ? "grid-cols-2" : "grid-cols-1";
    return /* @__PURE__ */ e("div", { className: `grid ${Z} gap-1`, children: v.map(({ pin: t, label: i }) => {
      const l = o === t;
      return /* @__PURE__ */ e(
        "button",
        {
          type: "button",
          onClick: () => {
            Q(l ? y.NONE : t), r();
          },
          className: `flex flex-col items-center justify-center py-1 px-1 rounded-sm border text-center cursor-pointer select-none min-h-[28px] ${l ? "bg-[var(--popup-item-selected-bg)] border-[var(--popup-item-selected-bg)] text-[var(--popup-item-selected-fg)]" : "bg-[var(--agv-bg-root)] border-[var(--agv-border)] text-[var(--agv-text-main)] hover:bg-[var(--popup-item-hover-bg)]"}`,
          children: /* @__PURE__ */ e("span", { className: "text-xs font-semibold", children: i })
        },
        t
      );
    }) });
  }, P = (() => {
    if (g.type === ie.HEADER) {
      const { column: t, currentPin: i, hasHiddenColumns: l } = g, p = !!t.isFormula, m = !!t.isChart, c = !!he?.has(t.key), u = t.title || t.key, f = ue && !!H && t.pinnable !== !1, N = be && !!H && t.pinnable !== !1, K = f || N, Oe = f && (i === y.LEFT || i === y.RIGHT) || N && i === y.CENTER;
      if (c) {
        const a = !!O && t.hideable !== !1, k = !!xe, w = !!(l && C);
        return !a && !k && !w ? null : {
          width: 190,
          content: /* @__PURE__ */ n("div", { className: "py-0.5 space-y-0.5", children: [
            a && /* @__PURE__ */ e(
              "button",
              {
                type: "button",
                onClick: () => {
                  O?.(t.key), r();
                },
                className: "w-full flex items-center px-2.5 py-1.5 rounded-sm text-left text-xs cursor-pointer min-h-[28px] hover:bg-[var(--popup-item-hover-bg)]",
                style: { color: "var(--agv-text-main)" },
                children: /* @__PURE__ */ e("span", { children: "Ẩn cột rỗng" })
              }
            ),
            k && /* @__PURE__ */ e(
              "button",
              {
                type: "button",
                onClick: () => {
                  xe?.(), r();
                },
                className: "w-full flex items-center px-2.5 py-1.5 rounded-sm text-left text-xs cursor-pointer min-h-[28px] hover:bg-[var(--popup-item-hover-bg)]",
                style: { color: "var(--agv-text-main)" },
                children: /* @__PURE__ */ e("span", { children: "Ẩn tất cả cột rỗng" })
              }
            ),
            w && /* @__PURE__ */ n(b, { children: [
              (a || k) && /* @__PURE__ */ e("div", { className: "my-1 border-b border-[var(--agv-border)]" }),
              /* @__PURE__ */ e(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    C?.(), r();
                  },
                  className: "w-full flex items-center px-2.5 py-1.5 rounded-sm text-left text-xs cursor-pointer min-h-[28px] hover:bg-[var(--popup-item-hover-bg)] text-[var(--agv-accent)]",
                  children: /* @__PURE__ */ e("span", { className: "font-semibold", children: "Hiện lại các cột đã ẩn" })
                }
              )
            ] })
          ] })
        };
      }
      const V = p && !!$, ee = !!I && t.groupable !== !1 && t.dataType !== Te.SYSTEM && !t.isRowNumber && !t.isSelection && !m && !p, h = De?.find((a) => a.keys.includes(t.key)), z = t.hideable !== !1 && (h?.isAtomic ? !!F : !!O), te = !!(l && C), Ne = !!T && t.dataType === Te.NUMBER && !!J, ke = !!(h && !h.isStandalone && B), we = !!((!h || h.isStandalone) && se), Se = !m && (!!L || ke || we || p && !!I), Ee = ee || z || te || Ne, j = Ee || Se;
      if (!K && !V && !j)
        return null;
      const Ae = /* @__PURE__ */ n(b, { children: [
        p && I && /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            disabled: c,
            onClick: () => {
              c || (I(t.key), r());
            },
            className: `w-full flex items-center px-2.5 py-1.5 rounded-sm text-left text-xs min-h-[28px] ${c ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:bg-[var(--popup-item-hover-bg)]"} ${T === t.key ? "text-[var(--agv-accent)] font-semibold" : "text-[var(--agv-text-main)]"}`,
            children: /* @__PURE__ */ e("span", { children: T === t.key ? "Hủy nhóm cột" : "Nhóm theo cột" })
          }
        ),
        L && /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            onClick: () => {
              L(t.key), r();
            },
            className: "w-full flex items-center px-2.5 py-1.5 rounded-sm text-left text-xs cursor-pointer min-h-[28px] hover:bg-[var(--popup-item-hover-bg)]",
            style: { color: "var(--agv-text-main)" },
            children: /* @__PURE__ */ e("span", { children: "Vừa độ rộng cột" })
          }
        ),
        ke && h && /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            onClick: () => {
              B?.(h.id), r();
            },
            className: "w-full flex items-center px-2.5 py-1.5 rounded-sm text-left text-xs cursor-pointer min-h-[28px] hover:bg-[var(--popup-item-hover-bg)]",
            style: { color: "var(--agv-text-main)" },
            children: /* @__PURE__ */ e("span", { children: "Vừa độ rộng các cột trong tầng" })
          }
        ),
        we && /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            onClick: () => {
              se?.(), r();
            },
            className: "w-full flex items-center px-2.5 py-1.5 rounded-sm text-left text-xs cursor-pointer min-h-[28px] hover:bg-[var(--popup-item-hover-bg)]",
            style: { color: "var(--agv-text-main)" },
            children: /* @__PURE__ */ e("span", { children: "Vừa độ rộng tất cả cột" })
          }
        )
      ] });
      return {
        width: 215,
        content: /* @__PURE__ */ n(b, { children: [
          K && /* @__PURE__ */ n("div", { className: `p-1 ${V || j ? "border-b border-[var(--agv-border)]" : ""}`, children: [
            /* @__PURE__ */ n(
              "div",
              {
                className: "text-xs font-bold uppercase tracking-wider mb-1.5 px-0.5 truncate flex items-center justify-between gap-1.5",
                style: { color: "var(--agv-text-muted)" },
                children: [
                  /* @__PURE__ */ n("span", { className: "truncate", children: [
                    "Ghim: ",
                    /* @__PURE__ */ e("span", { className: "font-extrabold text-[var(--agv-accent)]", children: u })
                  ] }),
                  Oe && /* @__PURE__ */ e("span", { className: "shrink-0 text-xs font-normal text-[var(--agv-warning)] lowercase", children: "bỏ ghim" })
                ]
              }
            ),
            ye(i, f, N, (a) => {
              H?.(t.key, a);
            })
          ] }),
          V && $ && /* @__PURE__ */ n("div", { className: `py-1 ${j ? "border-b border-[var(--agv-border)]" : ""}`, children: [
            /* @__PURE__ */ e(
              "div",
              {
                className: "text-xs font-bold uppercase tracking-wider mb-1 px-2.5 truncate",
                style: { color: "var(--agv-text-muted)" },
                children: "Công thức"
              }
            ),
            /* @__PURE__ */ e("div", { className: "space-y-0.5", children: [
              { id: d.AVG, label: "Trung Bình" },
              { id: d.SUM, label: "Tổng" },
              { id: d.MIN, label: "Nhỏ Nhất" },
              { id: d.MAX, label: "Cao Nhất" }
            ].map((a) => {
              const k = M === a.id;
              return /* @__PURE__ */ e(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    $(a.id), r();
                  },
                  className: `w-full flex items-center px-2.5 py-1.5 rounded-sm text-left text-xs cursor-pointer min-h-[28px] ${k ? "bg-[var(--popup-item-selected-bg)] text-[var(--popup-item-selected-fg)] font-semibold" : "text-[var(--agv-text-main)] hover:bg-[var(--popup-item-hover-bg)]"}`,
                  children: /* @__PURE__ */ e("span", { children: a.label })
                },
                a.id
              );
            }) }),
            (M === d.MIN || M === d.MAX) && E && t && /* @__PURE__ */ e("div", { className: "pt-1 mt-1 border-t border-[var(--agv-border)]", children: (() => {
              const a = t.key, w = S?.key === a && !!S?.sortByMonth, Me = w && S?.direction === x.ASC, Ce = w && S?.direction === x.DESC;
              let re = "Sắp xếp: Theo số (Mặc định)";
              return Me ? re = "Sắp xếp: Theo tháng (T1 → T12)" : Ce && (re = "Sắp xếp: Theo tháng (T12 → T1)"), /* @__PURE__ */ e(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    E(w ? Me ? { key: a, direction: x.DESC, sortByMonth: !0 } : { key: a, direction: x.ASC, sortByMonth: !1 } : { key: a, direction: x.ASC, sortByMonth: !0 });
                  },
                  className: `w-full flex items-center px-2.5 py-1.5 rounded-sm text-left text-xs cursor-pointer min-h-[28px] ${w ? "bg-[var(--popup-item-selected-bg)] text-[var(--popup-item-selected-fg)] font-semibold" : "text-[var(--agv-text-main)] hover:bg-[var(--popup-item-hover-bg)]"}`,
                  children: /* @__PURE__ */ e("span", { children: re })
                }
              );
            })() })
          ] }),
          j && /* @__PURE__ */ n("div", { className: "py-1 space-y-0.5", children: [
            ee && /* @__PURE__ */ e(
              "button",
              {
                type: "button",
                disabled: c,
                onClick: () => {
                  c || (I?.(t.key), r());
                },
                className: `w-full flex items-center px-2.5 py-1.5 rounded-sm text-left text-xs min-h-[28px] ${c ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:bg-[var(--popup-item-hover-bg)]"} ${T === t.key ? "text-[var(--agv-accent)] font-semibold" : "text-[var(--agv-text-main)]"}`,
                children: /* @__PURE__ */ e("span", { children: T === t.key ? "Hủy nhóm cột" : "Nhóm theo cột" })
              }
            ),
            z && h?.isAtomic && /* @__PURE__ */ e(
              "button",
              {
                type: "button",
                onClick: () => {
                  F?.(h.id), r();
                },
                className: "w-full flex items-center px-2.5 py-1.5 rounded-sm text-left text-xs cursor-pointer min-h-[28px] hover:bg-[var(--popup-item-hover-bg)] text-[var(--agv-text-main)]",
                children: /* @__PURE__ */ n("span", { children: [
                  "Ẩn nhóm ",
                  h.title || h.id || ""
                ] })
              }
            ),
            z && !h?.isAtomic && /* @__PURE__ */ e(
              "button",
              {
                type: "button",
                onClick: () => {
                  O?.(t.key), r();
                },
                className: "w-full flex items-center px-2.5 py-1.5 rounded-sm text-left text-xs cursor-pointer min-h-[28px] hover:bg-[var(--popup-item-hover-bg)] text-[var(--agv-text-main)]",
                children: /* @__PURE__ */ e("span", { children: "Ẩn cột này" })
              }
            ),
            te && /* @__PURE__ */ e(
              "button",
              {
                type: "button",
                onClick: () => {
                  C?.(), r();
                },
                className: "w-full flex items-center px-2.5 py-1.5 rounded-sm text-left text-xs cursor-pointer min-h-[28px] hover:bg-[var(--popup-item-hover-bg)] text-[var(--agv-accent)]",
                children: /* @__PURE__ */ e("span", { className: "font-semibold", children: "Hiện lại các cột đã ẩn" })
              }
            ),
            Ne && J && /* @__PURE__ */ e("div", { className: ee || z || te ? "pt-1 mt-1 border-t border-[var(--agv-border)]" : "", children: (() => {
              const a = ve?.colKey === t.key, k = a ? ve.direction : null, w = k === x.DESC ? "Sắp xếp nhóm: Tổng giảm dần" : k === x.ASC ? "Sắp xếp nhóm: Tổng tăng dần" : "Sắp xếp nhóm theo Tổng";
              return /* @__PURE__ */ e(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    J(t.key), r();
                  },
                  className: `w-full flex items-center justify-center px-2.5 py-1.5 rounded-md text-center text-xs font-semibold cursor-pointer select-none min-h-[28px] ${a ? "bg-[var(--popup-item-selected-bg)] text-[var(--popup-item-selected-fg)]" : "text-[var(--agv-text-main)] bg-[var(--agv-bg-popup)] border border-[var(--agv-border)] hover:bg-[var(--popup-item-hover-bg)]"}`,
                  children: /* @__PURE__ */ e("span", { children: w })
                }
              );
            })() }),
            Se && (K || V || Ee ? /* @__PURE__ */ n("div", { className: "pt-0.5 mt-0.5 border-t border-[var(--agv-border)]", children: [
              /* @__PURE__ */ e(
                ae,
                {
                  variant: "ghost",
                  size: "sm",
                  onClick: () => ge((a) => !a),
                  className: "w-full",
                  children: /* @__PURE__ */ e(
                    ne,
                    {
                      expanded: _,
                      type: "down-up",
                      size: 12,
                      spring: "snappy"
                    }
                  )
                }
              ),
              _ && /* @__PURE__ */ e("div", { className: "pt-0.5 space-y-0.5 animate-in fade-in duration-150", children: Ae })
            ] }) : /* @__PURE__ */ e("div", { className: "space-y-0.5", children: Ae }))
          ] })
        ] })
      };
    }
    if (g.type === ie.BAND) {
      const { groupDef: t, currentPin: i } = g, l = ue && !!R, p = be && !!R, m = l || p, c = l && (i === y.LEFT || i === y.RIGHT) || p && i === y.CENTER, u = !!F && g.childColumns.every((N) => N.hideable !== !1), f = t.id !== "grp_analytics" && !!B;
      return !m && !u && !f ? null : {
        width: 215,
        content: /* @__PURE__ */ n(b, { children: [
          m && /* @__PURE__ */ n("div", { className: `p-1 ${u || f ? "border-b border-[var(--agv-border)]" : ""}`, children: [
            /* @__PURE__ */ n(
              "div",
              {
                className: "text-xs font-bold uppercase tracking-wider mb-1.5 px-0.5 truncate flex items-center justify-between gap-1.5",
                style: { color: "var(--agv-text-muted)" },
                children: [
                  /* @__PURE__ */ n("span", { className: "truncate", children: [
                    "Ghim tầng: ",
                    /* @__PURE__ */ e("span", { className: "font-extrabold text-[var(--agv-accent)]", children: t.title })
                  ] }),
                  c && /* @__PURE__ */ e("span", { className: "shrink-0 text-xs font-normal text-[var(--agv-warning)] lowercase", children: "bỏ ghim" })
                ]
              }
            ),
            ye(i, l, p, (N) => {
              R?.(t.id, N);
            })
          ] }),
          (u || f) && /* @__PURE__ */ n("div", { className: "py-1 space-y-0.5", children: [
            u && /* @__PURE__ */ e(
              "button",
              {
                type: "button",
                onClick: () => {
                  F?.(t.id), r();
                },
                className: "w-full flex items-center px-2.5 py-1.5 rounded-sm text-left text-xs cursor-pointer min-h-[28px] hover:bg-[var(--popup-item-hover-bg)]",
                style: { color: "var(--agv-text-main)" },
                children: /* @__PURE__ */ e("span", { children: "Ẩn toàn bộ nhóm tầng" })
              }
            ),
            f && (m || u ? /* @__PURE__ */ n("div", { className: "pt-0.5 mt-0.5 border-t border-[var(--agv-border)]", children: [
              /* @__PURE__ */ e(
                ae,
                {
                  variant: "ghost",
                  size: "sm",
                  onClick: () => ge((N) => !N),
                  className: "w-full",
                  children: /* @__PURE__ */ e(
                    ne,
                    {
                      expanded: _,
                      type: "down-up",
                      size: 12,
                      spring: "snappy"
                    }
                  )
                }
              ),
              _ && /* @__PURE__ */ e("div", { className: "pt-0.5 space-y-0.5 animate-in fade-in duration-150", children: /* @__PURE__ */ e(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    B?.(t.id), r();
                  },
                  className: "w-full flex items-center px-2.5 py-1.5 rounded-sm text-left text-xs cursor-pointer min-h-[28px] hover:bg-[var(--popup-item-hover-bg)]",
                  style: { color: "var(--agv-text-main)" },
                  children: /* @__PURE__ */ e("span", { children: "Vừa độ rộng các cột trong tầng" })
                }
              ) })
            ] }) : /* @__PURE__ */ e(
              "button",
              {
                type: "button",
                onClick: () => {
                  B?.(t.id), r();
                },
                className: "w-full flex items-center px-2.5 py-1.5 rounded-sm text-left text-xs cursor-pointer min-h-[28px] hover:bg-[var(--popup-item-hover-bg)]",
                style: { color: "var(--agv-text-main)" },
                children: /* @__PURE__ */ e("span", { children: "Vừa độ rộng các cột trong tầng" })
              }
            ))
          ] })
        ] })
      };
    }
    if (g.type === ie.GROUP) {
      const { groupRow: t } = g, i = !!me, l = !!pe, p = !!de, m = !!D, c = l || p, u = m;
      return !i && !c && !u ? null : {
        width: 215,
        content: /* @__PURE__ */ n(b, { children: [
          i && /* @__PURE__ */ e(
            "button",
            {
              type: "button",
              onClick: () => {
                me?.(), r();
              },
              className: "w-full flex items-center px-2.5 py-1.5 rounded-sm text-left text-xs cursor-pointer min-h-[28px] hover:bg-[var(--popup-item-hover-bg)] text-[var(--agv-accent)] font-semibold",
              children: /* @__PURE__ */ e("span", { children: "Hủy nhóm cột" })
            }
          ),
          i && c && /* @__PURE__ */ e("div", { className: "my-1 border-b border-[var(--agv-border)]" }),
          l && /* @__PURE__ */ e(
            "button",
            {
              type: "button",
              onClick: () => {
                pe?.(), r();
              },
              className: "w-full flex items-center px-2.5 py-1.5 rounded-sm text-left text-xs cursor-pointer min-h-[28px] hover:bg-[var(--popup-item-hover-bg)]",
              style: { color: "var(--agv-text-main)" },
              children: /* @__PURE__ */ e("span", { children: "Thu gọn tất cả" })
            }
          ),
          p && /* @__PURE__ */ e(
            "button",
            {
              type: "button",
              onClick: () => {
                de?.(), r();
              },
              className: "w-full flex items-center px-2.5 py-1.5 rounded-sm text-left text-xs cursor-pointer min-h-[28px] hover:bg-[var(--popup-item-hover-bg)]",
              style: { color: "var(--agv-text-main)" },
              children: /* @__PURE__ */ e("span", { children: "Mở rộng tất cả" })
            }
          ),
          u && /* @__PURE__ */ e("div", { className: i || c ? "pt-0.5 mt-0.5 border-t border-[var(--agv-border)]" : "", children: i || c ? /* @__PURE__ */ n(b, { children: [
            /* @__PURE__ */ e(
              ae,
              {
                variant: "ghost",
                size: "sm",
                onClick: () => $e((f) => !f),
                className: "w-full",
                children: /* @__PURE__ */ e(
                  ne,
                  {
                    expanded: fe,
                    type: "down-up",
                    size: 12,
                    spring: "snappy"
                  }
                )
              }
            ),
            fe && /* @__PURE__ */ e("div", { className: "pt-0.5 space-y-0.5 animate-in fade-in duration-150", children: m && /* @__PURE__ */ n(b, { children: [
              /* @__PURE__ */ e(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    D?.(t, !1), r();
                  },
                  className: "w-full flex items-center px-2.5 py-1.5 rounded-sm text-left text-xs cursor-pointer min-h-[28px] hover:bg-[var(--popup-item-hover-bg)]",
                  style: { color: "var(--agv-text-main)" },
                  children: /* @__PURE__ */ e("span", { children: "Sao chép bảng" })
                }
              ),
              /* @__PURE__ */ e(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    D?.(t, !0), r();
                  },
                  className: "w-full flex items-center px-2.5 py-1.5 rounded-sm text-left text-xs cursor-pointer min-h-[28px] hover:bg-[var(--popup-item-hover-bg)]",
                  style: { color: "var(--agv-text-main)" },
                  children: /* @__PURE__ */ e("span", { children: "Sao chép bảng kèm tên cột" })
                }
              )
            ] }) })
          ] }) : /* @__PURE__ */ e("div", { className: "space-y-0.5", children: m && /* @__PURE__ */ n(b, { children: [
            /* @__PURE__ */ e(
              "button",
              {
                type: "button",
                onClick: () => {
                  D?.(t, !1), r();
                },
                className: "w-full flex items-center px-2.5 py-1.5 rounded-sm text-left text-xs cursor-pointer min-h-[28px] hover:bg-[var(--popup-item-hover-bg)]",
                style: { color: "var(--agv-text-main)" },
                children: /* @__PURE__ */ e("span", { children: "Sao chép bảng" })
              }
            ),
            /* @__PURE__ */ e(
              "button",
              {
                type: "button",
                onClick: () => {
                  D?.(t, !0), r();
                },
                className: "w-full flex items-center px-2.5 py-1.5 rounded-sm text-left text-xs cursor-pointer min-h-[28px] hover:bg-[var(--popup-item-hover-bg)]",
                style: { color: "var(--agv-text-main)" },
                children: /* @__PURE__ */ e("span", { children: "Sao chép bảng kèm tên cột" })
              }
            )
          ] }) }) })
        ] })
      };
    }
    const { row: o, column: s, cellValue: A } = g, Q = !!s?.isFormula, v = s ? !!he?.has(s.key) : !1, Z = () => {
      let t = "";
      A != null ? t = String(A) : s && o && (o.cells instanceof Map ? t = String(o.cells.get(s.key)?.value ?? "") : o[s.key] !== void 0 && (t = String(o[s.key]))), _e(t), r();
    };
    return {
      width: 215,
      content: /* @__PURE__ */ n("div", { className: "py-0.5 space-y-0.5", children: [
        Q && $ && /* @__PURE__ */ n("div", { className: "pb-1 mb-1 border-b border-[var(--agv-border)]", children: [
          /* @__PURE__ */ e(
            "div",
            {
              className: "text-xs font-bold uppercase tracking-wider mb-1 px-2.5 truncate",
              style: { color: "var(--agv-text-muted)" },
              children: "Công thức"
            }
          ),
          /* @__PURE__ */ e("div", { className: "space-y-0.5", children: [
            { id: d.AVG, label: "Trung Bình" },
            { id: d.SUM, label: "Tổng" },
            { id: d.MIN, label: "Nhỏ Nhất" },
            { id: d.MAX, label: "Cao Nhất" }
          ].map((t) => {
            const i = M === t.id;
            return /* @__PURE__ */ e(
              "button",
              {
                type: "button",
                onClick: () => {
                  $(t.id), r();
                },
                className: `w-full flex items-center px-2.5 py-1.5 rounded-sm text-left text-xs cursor-pointer min-h-[28px] ${i ? "bg-[var(--popup-item-selected-bg)] text-[var(--popup-item-selected-fg)] font-semibold" : "text-[var(--agv-text-main)] hover:bg-[var(--popup-item-hover-bg)]"}`,
                children: /* @__PURE__ */ e("span", { children: t.label })
              },
              t.id
            );
          }) }),
          (M === d.MIN || M === d.MAX) && E && s && /* @__PURE__ */ e("div", { className: "pt-1 mt-1 border-t border-[var(--agv-border)]", children: (() => {
            const t = s.key, l = S?.key === t && !!S?.sortByMonth, p = l && S?.direction === x.ASC, m = l && S?.direction === x.DESC;
            let c = "Sắp xếp: Theo số (Mặc định)";
            return p ? c = "Sắp xếp: Theo tháng (T1 → T12)" : m && (c = "Sắp xếp: Theo tháng (T12 → T1)"), /* @__PURE__ */ e(
              "button",
              {
                type: "button",
                onClick: () => {
                  E(l ? p ? { key: t, direction: x.DESC, sortByMonth: !0 } : { key: t, direction: x.ASC, sortByMonth: !1 } : { key: t, direction: x.ASC, sortByMonth: !0 });
                },
                className: `w-full flex items-center px-2.5 py-1.5 rounded-sm text-left text-xs cursor-pointer min-h-[28px] ${l ? "bg-[var(--popup-item-selected-bg)] text-[var(--popup-item-selected-fg)] font-semibold" : "text-[var(--agv-text-main)] hover:bg-[var(--popup-item-hover-bg)]"}`,
                children: /* @__PURE__ */ e("span", { children: c })
              }
            );
          })() })
        ] }),
        /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            onClick: Z,
            className: "w-full flex items-center px-2.5 py-1.5 rounded-sm text-left text-xs cursor-pointer min-h-[28px] hover:bg-[var(--popup-item-hover-bg)]",
            style: { color: "var(--agv-text-main)" },
            children: /* @__PURE__ */ e("span", { children: "Sao chép giá trị ô" })
          }
        ),
        s && ce && /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            disabled: v || s.filterable === !1,
            onClick: () => {
              if (v || s.filterable === !1) return;
              const t = A !== void 0 ? A : o?.cells instanceof Map ? o.cells.get(s.key)?.value : o?.[s.key];
              ce(s.key, t), r();
            },
            className: `w-full flex items-center px-2.5 py-1.5 rounded-sm text-left text-xs min-h-[28px] ${v || s.filterable === !1 ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:bg-[var(--popup-item-hover-bg)]"}`,
            style: { color: "var(--agv-text-main)" },
            children: /* @__PURE__ */ e("span", { children: "Lọc theo" })
          }
        ),
        (Y && !o?._isGroupRow || W > 0 && q) && /* @__PURE__ */ n(b, { children: [
          /* @__PURE__ */ e("div", { className: "my-1 border-b border-[var(--agv-border)]" }),
          Y && !o?._isGroupRow && /* @__PURE__ */ n(b, { children: [
            /* @__PURE__ */ e(
              "button",
              {
                type: "button",
                onClick: () => {
                  Y(), r();
                },
                className: `w-full flex items-center px-2.5 py-1.5 rounded-sm text-left text-xs cursor-pointer min-h-[28px] hover:bg-[var(--popup-item-hover-bg)] ${G ? "text-[var(--agv-accent)] font-semibold" : ""}`,
                style: G ? void 0 : { color: "var(--agv-text-main)" },
                children: /* @__PURE__ */ e("span", { children: G ? "Bỏ ghim dòng" : "Ghim dòng lên đầu" })
              }
            ),
            le > 0 && oe && /* @__PURE__ */ e(
              "button",
              {
                type: "button",
                onClick: () => {
                  oe(), r();
                },
                className: "w-full flex items-center px-2.5 py-1.5 rounded-sm text-left text-xs cursor-pointer min-h-[28px] hover:bg-[var(--popup-item-hover-bg)]",
                style: { color: "var(--agv-text-main)" },
                children: /* @__PURE__ */ n("span", { children: [
                  "Bỏ ghim tất cả dòng (",
                  le,
                  ")"
                ] })
              }
            )
          ] }),
          W > 0 && q && /* @__PURE__ */ e(
            "button",
            {
              type: "button",
              onClick: () => {
                q(), r();
              },
              className: "w-full flex items-center px-2.5 py-1.5 rounded-sm text-left text-xs cursor-pointer min-h-[28px] hover:bg-[var(--popup-item-hover-bg)]",
              style: { color: "var(--agv-text-main)" },
              children: /* @__PURE__ */ n("span", { children: [
                "Bỏ chọn tất cả dòng (",
                W.toLocaleString("vi-VN"),
                ")"
              ] })
            }
          )
        ] }),
        (U || X) && /* @__PURE__ */ n(b, { children: [
          /* @__PURE__ */ e("div", { className: "my-1 border-b border-[var(--agv-border)]" }),
          U && /* @__PURE__ */ e(
            "button",
            {
              type: "button",
              onClick: () => {
                U(), r();
              },
              className: "w-full flex items-center px-2.5 py-1.5 rounded-sm text-left text-xs cursor-pointer min-h-[28px] hover:bg-[var(--popup-item-hover-bg)]",
              style: { color: "var(--agv-text-main)" },
              children: /* @__PURE__ */ e("span", { children: "Cuộn lên đầu" })
            }
          ),
          X && /* @__PURE__ */ e(
            "button",
            {
              type: "button",
              onClick: () => {
                X(), r();
              },
              className: "w-full flex items-center px-2.5 py-1.5 rounded-sm text-left text-xs cursor-pointer min-h-[28px] hover:bg-[var(--popup-item-hover-bg)]",
              style: { color: "var(--agv-text-main)" },
              children: /* @__PURE__ */ e("span", { children: "Cuộn cuối trang" })
            }
          )
        ] })
      ] })
    };
  })();
  return P ? /* @__PURE__ */ e(
    Fe,
    {
      isOpen: !0,
      virtualAnchor: { left: g.x, top: g.y },
      onClose: r,
      placement: "bottom-start",
      showArrow: !0,
      offset: 10,
      width: P.width,
      minWidth: P.width,
      paddingClassName: "p-0",
      contentClassName: "text-xs agv-context-menu",
      zIndex: 9999,
      theme: Ie,
      ignoreClickOutsideSelectors: "",
      children: /* @__PURE__ */ e(
        "div",
        {
          onContextMenu: (o) => o.preventDefault(),
          className: "p-1 rounded-md overflow-hidden select-none",
          children: P.content
        }
      )
    }
  ) : null;
};
export {
  ie as CONTEXT_MENU_TYPES,
  Ge as ColumnContextMenu,
  d as FORMULA_MODES
};
