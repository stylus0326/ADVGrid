import { jsx as a, jsxs as s, Fragment as W } from "react/jsx-runtime";
import T, { memo as H, useMemo as X } from "react";
import { A as V } from "./gridFormatUtils-wCKPmlrt.js";
import { M as J } from "./MorphCheckbox-S5ZNer1R.js";
import { M as E } from "./MorphIcons-DW5eQGeo.js";
import { c as Y, a as Z, d as q, e as O, f as w, g as A } from "./DataGridEnterprise-CwIXrBzR.js";
import { A as D } from "./AdvButton-B7j0puyb.js";
function K({
  row: l,
  rowIndex: r,
  columns: k,
  compiledGroups: g,
  rowHeight: m,
  isSelected: i,
  isChecked: u,
  showRowNumber: h = !0,
  showSelectionCol: o = !0,
  onSelectRow: $,
  onToggleCheck: z,
  onCellContextMenu: f,
  renderCell: N,
  allowTextSelection: C = !1
}) {
  const L = r % 2 === 0, x = l, y = g && g.length > 0 ? g : Y(k), b = Z(
    y,
    h,
    o
  );
  if (x?._isGroupRow)
    return /* @__PURE__ */ a(
      "div",
      {
        onClick: () => x.onToggleCollapse?.(),
        "data-row-idx": r,
        style: {
          height: `${m}px`,
          maxHeight: `${m}px`,
          minWidth: b > 0 ? `${b}px` : void 0,
          boxSizing: "border-box",
          borderColor: "var(--agv-border)",
          backgroundColor: "var(--agv-bg-header, var(--agv-bg-row-alt))"
        },
        className: "agv-group-row w-full flex items-center justify-between border-b px-3 text-xs cursor-pointer select-none",
        children: /* @__PURE__ */ s("div", { className: "flex items-center gap-2 min-w-0", children: [
          /* @__PURE__ */ a(E, { expanded: !!x.isExpanded, size: 16, spring: "snappy" }),
          /* @__PURE__ */ a("span", { className: "font-semibold truncate", style: { color: "var(--agv-text-main)" }, children: String(x.groupValue ?? "") }),
          /* @__PURE__ */ s("span", { className: "text-xs shrink-0", style: { color: "var(--agv-text-muted)" }, children: [
            "(",
            x.count ?? 0,
            ")"
          ] })
        ] })
      }
    );
  const t = (n, p) => q({
    row: l,
    rowIndex: r,
    col: n,
    isSelected: i,
    isChecked: u,
    renderCell: N
  });
  return /* @__PURE__ */ s(
    "div",
    {
      onClick: () => $?.(r, l),
      "data-row-idx": r,
      "data-row-parity": L ? "even" : "odd",
      "data-row-focused": i ? "true" : void 0,
      "data-row-checked": u ? "true" : void 0,
      style: {
        height: `${m}px`,
        maxHeight: `${m}px`,
        minWidth: b > 0 ? `${b}px` : void 0,
        boxSizing: "border-box",
        borderColor: "var(--agv-border)",
        backgroundColor: "var(--agv-row-data-bg)"
      },
      className: `agv-grid-row w-full flex items-center border-b px-3 text-xs cursor-default ${C ? "select-text" : "select-none"} transition-colors`,
      children: [
        (h || o) && /* @__PURE__ */ s("div", { className: "w-10 shrink-0 flex flex-col items-center justify-center gap-1 mr-2", children: [
          h && /* @__PURE__ */ a(
            "span",
            {
              "data-cell-role": "stt",
              className: "text-xs leading-4 tabular-nums font-mono font-semibold px-1 rounded transition-colors",
              style: {
                backgroundColor: i ? "var(--surface-selected)" : "transparent",
                color: i ? "var(--brand-gold-on-light, var(--brand-gold))" : "var(--agv-text-muted)"
              },
              children: String(r + 1).padStart(2, "0")
            }
          ),
          o && /* @__PURE__ */ a("div", { onClick: (n) => n.stopPropagation(), children: /* @__PURE__ */ a(
            J,
            {
              checked: u,
              onChange: (n) => z?.(r, l, n),
              size: 16,
              spring: "snappy"
            }
          ) })
        ] }),
        y.map((n, p) => {
          const S = p === 0, _ = p === y.length - 1, B = S ? "pr-3" : _ ? "pl-3" : "px-3", G = n.align === V.RIGHT ? "items-end text-right" : n.align === V.CENTER ? "items-center text-center" : "items-start text-left", F = n.width ? { width: `${n.width}px` } : { minWidth: `${n.minWidth}px` };
          return /* @__PURE__ */ a(
            "div",
            {
              style: F,
              className: `flex flex-col justify-center gap-1 min-w-0 ${n.width ? "shrink-0" : "flex-1"} ${B} ${G}`,
              children: n.lines.map((e) => {
                if (e.isChart)
                  return /* @__PURE__ */ a(
                    "div",
                    {
                      onContextMenu: f ? (j) => f(r, l, e.col.key, j) : void 0,
                      className: `${n.hasStandaloneChart ? "h-12" : "h-9"} w-full flex items-center`,
                      children: t(e.col, e.colIndex)
                    },
                    e.col.key
                  );
                const c = !!(e.joinCols && e.joinCols.length > 0), d = e.emphasis === "strong" || e.isPrimaryFirstLine, v = e.emphasis === "muted", Q = v ? "var(--agv-text-muted)" : "var(--agv-text-main)", U = () => {
                  if (!c)
                    return t(e.col, e.colIndex);
                  const j = [
                    { col: e.col, colIndex: e.colIndex },
                    ...e.joinCols
                  ].filter((M) => {
                    const P = O(l, M.col, r);
                    return P != null && String(P).trim() !== "";
                  });
                  return j.length === 0 ? "—" : j.map((M, P) => /* @__PURE__ */ s(T.Fragment, { children: [
                    P > 0 && /* @__PURE__ */ a("span", { className: "mx-1", style: { color: "var(--agv-text-muted)" }, children: e.joinSeparator }),
                    t(M.col, M.colIndex)
                  ] }, M.col.key));
                }, R = e.labelGetter ? e.labelGetter(l?._baseRecord ?? l, r) : e.label;
                return /* @__PURE__ */ s(
                  "div",
                  {
                    onContextMenu: f ? (j) => f(r, l, e.col.key, j) : void 0,
                    className: `max-w-full truncate text-xs leading-4 ${d ? "font-semibold" : ""}`,
                    style: {
                      color: d ? "var(--agv-text-main)" : "var(--agv-text-muted)"
                    },
                    children: [
                      R && /* @__PURE__ */ s("span", { style: { color: "var(--agv-text-muted)" }, children: [
                        R,
                        ": "
                      ] }),
                      /* @__PURE__ */ a(
                        "span",
                        {
                          className: [
                            d ? "font-semibold" : "",
                            v ? "[&_span]:!text-[var(--agv-text-muted)]" : ""
                          ].filter(Boolean).join(" ") || void 0,
                          style: { color: Q },
                          children: U()
                        }
                      )
                    ]
                  },
                  e.col.key
                );
              })
            },
            n.id
          );
        })
      ]
    }
  );
}
const I = H(K);
function ee({
  row: l,
  rowIndex: r,
  rowKey: k,
  columns: g,
  compiledPhoneCard: m,
  rowHeight: i = 108,
  isSelected: u,
  isChecked: h,
  isExpanded: o = !1,
  showRowNumber: $ = !0,
  showSelectionCol: z = !0,
  onToggleExpand: f,
  onSelectRow: N,
  onRowDetail: C,
  onToggleCheck: L,
  onCellContextMenu: x,
  renderCell: y,
  allowTextSelection: b = !1
}) {
  const t = X(
    () => m ?? w(g),
    [m, g]
  ), n = l, p = o && t.hasExpandableDrawer ? i + t.extraHeight : i, S = p - 8;
  if (n?._isGroupRow)
    return /* @__PURE__ */ a(
      "div",
      {
        style: {
          height: `${i}px`,
          maxHeight: `${i}px`,
          padding: "4px 8px",
          boxSizing: "border-box"
        },
        className: "agv-phone-card-slot w-full shrink-0",
        children: /* @__PURE__ */ s(
          "div",
          {
            onClick: () => n.onToggleCollapse?.(),
            "data-row-idx": r,
            style: {
              height: `${i - 8}px`,
              maxHeight: `${i - 8}px`,
              boxSizing: "border-box",
              backgroundColor: "var(--agv-bg-header, var(--agv-bg-row-alt))",
              borderColor: "var(--agv-border)"
            },
            className: "agv-group-row w-full rounded-xl border p-3 text-xs select-none cursor-pointer flex items-center justify-between gap-2",
            children: [
              /* @__PURE__ */ s("div", { className: "flex items-center gap-2 min-w-0", children: [
                /* @__PURE__ */ a(E, { expanded: !!n.isExpanded, size: 16, spring: "snappy" }),
                /* @__PURE__ */ a("span", { className: "font-semibold truncate", style: { color: "var(--agv-text-main)" }, children: String(n.groupValue ?? "") })
              ] }),
              /* @__PURE__ */ s("span", { className: "text-xs shrink-0", style: { color: "var(--agv-text-muted)" }, children: [
                "(",
                n.count ?? 0,
                ")"
              ] })
            ]
          }
        )
      }
    );
  const _ = t.hasExpandableDrawer || o, B = (e, c) => q({
    row: l,
    rowIndex: r,
    col: e,
    isSelected: u,
    isChecked: h,
    renderCell: y
  }), G = (e) => {
    if (!e.joinCols || e.joinCols.length === 0)
      return B(e.col, e.colIndex);
    const c = [
      { col: e.col, colIndex: e.colIndex },
      ...e.joinCols
    ].filter((d) => {
      const v = O(l, d.col, r);
      return v != null && String(v).trim() !== "";
    });
    return c.length === 0 ? "—" : c.map((d, v) => /* @__PURE__ */ s(T.Fragment, { children: [
      v > 0 && /* @__PURE__ */ a("span", { className: "mx-1 font-medium", style: { color: "var(--agv-text-muted)" }, children: e.joinSeparator.trim() || "·" }),
      B(d.col, d.colIndex)
    ] }, d.col.key));
  }, F = (e) => {
    const c = A(e, l, r);
    return /* @__PURE__ */ s(W, { children: [
      c ? /* @__PURE__ */ s("span", { style: { color: "var(--agv-text-muted)" }, children: [
        c,
        ": "
      ] }) : null,
      /* @__PURE__ */ a(
        "span",
        {
          className: "font-semibold tabular-nums",
          style: {
            color: e.emphasis === "muted" ? "var(--agv-text-muted)" : "var(--agv-text-main)"
          },
          children: G(e)
        }
      )
    ] });
  };
  return /* @__PURE__ */ a(
    "div",
    {
      style: {
        height: `${p}px`,
        maxHeight: `${p}px`,
        padding: "4px 8px",
        boxSizing: "border-box"
      },
      className: "agv-phone-card-slot w-full shrink-0",
      children: /* @__PURE__ */ s(
        "article",
        {
          onClick: () => N?.(r, l),
          "data-row-idx": r,
          "data-card-focused": u ? "true" : void 0,
          "data-card-checked": h ? "true" : void 0,
          style: {
            height: `${S}px`,
            maxHeight: `${S}px`,
            boxSizing: "border-box"
          },
          className: `agv-phone-card w-full rounded-xl border p-3 text-xs ${b ? "select-text" : "select-none"} transition-colors cursor-default flex flex-col overflow-hidden`,
          children: [
            /* @__PURE__ */ s("div", { className: "h-7 min-h-[28px] flex items-center justify-between gap-2 min-w-0 shrink-0", children: [
              /* @__PURE__ */ s("div", { className: "flex items-center gap-2 min-w-0", children: [
                z && /* @__PURE__ */ a("div", { onClick: (e) => e.stopPropagation(), className: "shrink-0", children: /* @__PURE__ */ a(
                  J,
                  {
                    checked: h,
                    onChange: (e) => L?.(r, l, e),
                    size: 16,
                    spring: "snappy"
                  }
                ) }),
                $ && /* @__PURE__ */ a(
                  "span",
                  {
                    "data-cell-role": "stt",
                    className: "text-xs leading-4 tabular-nums font-mono font-semibold shrink-0 transition-colors",
                    style: {
                      color: u ? "var(--brand-gold-on-light, var(--brand-gold))" : "var(--agv-text-muted)"
                    },
                    children: String(r + 1).padStart(2, "0")
                  }
                ),
                t.title && /* @__PURE__ */ a(
                  "div",
                  {
                    className: "agv-phone-card-title min-w-0 truncate text-sm leading-5 font-bold",
                    style: { color: "var(--agv-text-main)" },
                    children: G(t.title)
                  }
                )
              ] }),
              t.badge && /* @__PURE__ */ a("div", { className: "shrink-0 flex items-center text-xs", style: { color: "var(--agv-text-main)" }, children: G(t.badge) })
            ] }),
            /* @__PURE__ */ a(
              "div",
              {
                className: "mt-2 pt-2 border-t shrink-0",
                style: { borderColor: "var(--agv-border)" },
                children: /* @__PURE__ */ s("div", { className: "h-7 min-h-[28px] flex items-center justify-between gap-2 text-xs", children: [
                  /* @__PURE__ */ a("div", { className: "min-w-0 truncate", children: t.summary.map((e, c) => /* @__PURE__ */ s(T.Fragment, { children: [
                    c > 0 && /* @__PURE__ */ a("span", { className: "mx-2", style: { color: "var(--agv-text-muted)" }, children: "·" }),
                    F(e)
                  ] }, e.col.key)) }),
                  _ && /* @__PURE__ */ a(
                    D,
                    {
                      variant: "ghost",
                      size: "icon-sm",
                      onClick: (e) => {
                        e.stopPropagation(), f?.(k, r);
                      },
                      "aria-label": o ? "Thu gọn" : "Mở rộng",
                      children: /* @__PURE__ */ a(E, { expanded: o, type: "down-up", size: 16, spring: "snappy" })
                    }
                  )
                ] })
              }
            ),
            o && t.hasExpandableDrawer && /* @__PURE__ */ s(
              "div",
              {
                className: "mt-2 pt-2 border-t flex flex-col gap-2 overflow-hidden text-xs shrink-0",
                style: { borderColor: "var(--agv-border)" },
                children: [
                  t.chartBand && /* @__PURE__ */ s(
                    "div",
                    {
                      onContextMenu: x ? (e) => {
                        e.stopPropagation(), x(
                          r,
                          l,
                          t.chartBand.formulaLine?.col.key ?? t.chartBand.chartLine.col.key,
                          e
                        );
                      } : void 0,
                      className: "h-[52px] min-h-[52px] max-h-[52px] rounded-lg border p-2 flex items-center justify-between gap-2 shrink-0",
                      style: {
                        backgroundColor: "var(--agv-bg-root)",
                        borderColor: "var(--agv-border)"
                      },
                      children: [
                        /* @__PURE__ */ a("div", { className: "flex flex-col justify-center shrink-0 min-w-0", children: t.chartBand.formulaLine ? /* @__PURE__ */ s(W, { children: [
                          /* @__PURE__ */ a(
                            "span",
                            {
                              className: "text-xs leading-4 truncate",
                              style: { color: "var(--agv-text-muted)" },
                              children: A(t.chartBand.formulaLine, l, r) ?? t.chartBand.formulaLine.col.title ?? t.chartBand.formulaLine.col.key
                            }
                          ),
                          /* @__PURE__ */ a("div", { className: "truncate leading-4", children: B(
                            t.chartBand.formulaLine.col,
                            t.chartBand.formulaLine.colIndex
                          ) })
                        ] }) : /* @__PURE__ */ a(
                          "span",
                          {
                            className: "text-xs leading-4 truncate",
                            style: { color: "var(--agv-text-muted)" },
                            children: t.chartBand.chartLine.col.title || t.chartBand.chartLine.col.key
                          }
                        ) }),
                        /* @__PURE__ */ a("div", { className: "w-[180px] h-8 shrink-0 flex items-center", children: B(t.chartBand.chartLine.col, t.chartBand.chartLine.colIndex) })
                      ]
                    }
                  ),
                  t.infoRows.length > 0 && /* @__PURE__ */ a("div", { className: "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2", children: t.infoRows.map((e, c) => {
                    const d = !!(e.showDetailButton && t.detailButtonLabel);
                    return /* @__PURE__ */ s(T.Fragment, { children: [
                      /* @__PURE__ */ a("div", { className: "h-7 min-h-[28px] flex items-center min-w-0", children: /* @__PURE__ */ a("div", { className: "min-w-0 truncate", children: e.left ? F(e.left) : null }) }),
                      /* @__PURE__ */ a(
                        "div",
                        {
                          className: `h-7 min-h-[28px] flex items-center justify-end ${d ? "whitespace-nowrap shrink-0" : "max-w-[176px] justify-self-end min-w-0"}`,
                          children: d ? /* @__PURE__ */ a(
                            D,
                            {
                              variant: "outline",
                              size: "sm",
                              onClick: (v) => {
                                v.stopPropagation(), C ? C(l, r) : N?.(r, l);
                              },
                              className: "whitespace-nowrap font-medium",
                              children: t.detailButtonLabel
                            }
                          ) : e.right ? /* @__PURE__ */ a("div", { className: "truncate text-right", children: F(e.right) }) : null
                        }
                      )
                    ] }, `info_row_${c}`);
                  }) })
                ]
              }
            )
          ]
        }
      )
    }
  );
}
const ae = H(ee);
function ce({
  activeMode: l,
  row: r,
  rowIndex: k,
  rowKey: g,
  columns: m,
  compiledTabletGroups: i,
  compiledPhoneCard: u,
  rowHeight: h,
  isSelected: o,
  isChecked: $,
  isExpanded: z,
  showRowNumber: f,
  showSelectionCol: N,
  onToggleExpand: C,
  onSelectRow: L,
  onRowDetail: x,
  onToggleCheck: y,
  onCellContextMenu: b,
  surfaceTheme: t,
  renderCell: n,
  allowTextSelection: p
}) {
  return l === "tablet" ? /* @__PURE__ */ a(
    I,
    {
      row: r,
      rowIndex: k,
      rowKey: g,
      columns: m,
      compiledGroups: i,
      rowHeight: h,
      isSelected: o,
      isChecked: $,
      showRowNumber: f,
      showSelectionCol: N,
      onSelectRow: L,
      onToggleCheck: y,
      onCellContextMenu: b,
      surfaceTheme: t,
      renderCell: n,
      allowTextSelection: p
    }
  ) : /* @__PURE__ */ a(
    ae,
    {
      row: r,
      rowIndex: k,
      rowKey: g,
      columns: m,
      compiledPhoneCard: u,
      rowHeight: h,
      isSelected: o,
      isChecked: $,
      isExpanded: z,
      showRowNumber: f,
      showSelectionCol: N,
      onToggleExpand: C,
      onSelectRow: L,
      onRowDetail: x,
      onToggleCheck: y,
      onCellContextMenu: b,
      surfaceTheme: t,
      renderCell: n,
      allowTextSelection: p
    }
  );
}
export {
  ce as ResponsiveChunkRow,
  ce as default
};
