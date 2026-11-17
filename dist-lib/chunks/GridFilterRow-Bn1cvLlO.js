import { jsxs as y, Fragment as be, jsx as r } from "react/jsx-runtime";
import c, { useState as k, useMemo as st, useEffect as ot } from "react";
import { A as dt } from "./AdvPopover-CVmyHBzb.js";
import { P as J, C as Q, F as Z, D as x, s as ut, a as m, u as ct, j as pt, m as ae, g as Ce, l as mt, b as ht, q as ft } from "./gridFormatUtils-wCKPmlrt.js";
import { a as _, F as Ee, g as vt } from "./FilterIcons-nsUh2HLg.js";
import { A as Ne, g as le, C as gt, N as yt, e as kt, f as xt } from "./AdvButton-Ck5SixaL.js";
import { h as bt, G as Ct } from "./DataGridEnterprise-DyOy-gAv.js";
import { X as ie } from "./x-CdrDtutQ.js";
import { S as Et } from "./common-29M8PlVv.js";
import { C as Nt } from "./check-KNrOhvEC.js";
const wt = c.lazy(
  () => import("./GridSmartNumberInputs-B2jzNczI.js").then((o) => ({ default: o.NumberRangeFilterInput }))
), $t = c.lazy(
  () => import("./GridSmartNumberInputs-B2jzNczI.js").then((o) => ({ default: o.SmartNumberFilterInput }))
), At = c.lazy(
  () => import("./GridTimeFilterInputs-VIGIdPv1.js").then((o) => ({ default: o.TimeRangeFilterInput }))
), Lt = c.lazy(
  () => import("./GridTimeFilterInputs-VIGIdPv1.js").then((o) => ({ default: o.TimeFilterInput }))
), St = c.lazy(
  () => import("./GridDateFilterCell-BkzTIaU-.js").then((o) => ({ default: o.GridDateFilterCell }))
), Tt = c.lazy(
  () => import("./AdvMultiFilterPopup-TSRsTZTt.js").then((o) => ({ default: o.AdvMultiFilterPopup }))
), Ot = c.lazy(
  () => import("./AdvCriteriaSummaryPopup-Csa8pebj.js").then((o) => ({ default: o.AdvCriteriaSummaryPopup }))
), jt = c.memo(({
  totalGridWidth: o,
  columns: S,
  colWidths: we,
  columnPins: $e,
  leftOffsets: Ae,
  rightOffsets: Le,
  centerDockStatus: Se = {},
  centerLeftOffsets: Te = {},
  centerRightOffsets: Oe = {},
  lastEffectiveLeftColKey: Fe,
  firstEffectiveRightColKey: Ie,
  surfaceTheme: B = Et.LIGHT,
  columnFilters: h = {},
  onColumnFilterChange: w,
  onClearAllColumnFilters: Re,
  onClearAllCriteria: se,
  activeFilterCount: oe = 0,
  hasColumnEmptyCells: de,
  getColumnDateBounds: ue,
  headerTopOffset: Pe = 64,
  columnSums: T = {},
  hasCheckedRows: De = !1,
  emptyColKeys: ze,
  groupByColumnKey: q,
  quickFilterText: V,
  sortConfig: H,
  sortRules: O,
  groupSortConfig: j,
  appliedQueryTree: G,
  pinnedRows: F = [],
  onUngroup: Me,
  onSortChange: _e,
  onRemoveSortRule: Be,
  onToggleGroupSort: Ve,
  onQuickFilterTextChange: He,
  onApplyQueryTree: je,
  onUnpinRow: Ge,
  onClearPinnedRows: We
}) => {
  const [ee, te] = k(!1), [Ue, Ke] = k(null), [Xe, Ye] = k(null), ce = (e) => {
    e.stopPropagation(), ee ? te(!1) : (Ke(e.currentTarget), Ye(e.currentTarget.getBoundingClientRect()), te(!0));
  }, pe = st(() => {
    let e = oe;
    q && (e += 1), V && V.trim().length > 0 && (e += 1);
    const n = O && O.length > 0 ? O.length : H && H.key ? 1 : 0;
    return e += n, j && j.colKey && (e += 1), G && bt(G) && (e += 1), F && F.length > 0 && (e += F.length), e;
  }, [
    oe,
    q,
    V,
    H,
    O,
    j,
    G,
    F
  ]), [f, b] = k(null), [Je, p] = k(null), [me, C] = k(null), [W, I] = k(null), [Qe, R] = k(null), he = (e, n) => {
    n.preventDefault(), n.stopPropagation(), b(null), C(null), window.dispatchEvent(
      new CustomEvent("agv-close-all-popups", {
        detail: { except: "multi-filter", source: "multi-filter" }
      })
    ), R(n.currentTarget), I(e);
  };
  ot(() => {
    const e = (n) => {
      const s = n;
      s.detail?.except !== "filter-op" && (b(null), C(null)), s.detail?.except !== "multi-filter" && (I(null), R(null));
    };
    return window.addEventListener("agv-close-all-popups", e), () => {
      window.removeEventListener("agv-close-all-popups", e);
    };
  }, []);
  const Ze = (e, n) => {
    if (n.stopPropagation(), I(null), R(null), window.dispatchEvent(
      new CustomEvent("agv-close-all-popups", {
        detail: { except: "filter-op", source: "filter-op" }
      })
    ), f === e) {
      b(null), C(null);
      return;
    }
    C(n.currentTarget), b(e);
  }, P = (e) => ft(e, S), qe = (e, n) => {
    const s = P(e), u = h[e] || { op: s, val: "" };
    w?.(e, {
      ...u,
      op: n,
      val: _[n]?.noInput ? "" : u.val
    }), b(null), C(null);
  }, $ = (e, n, s) => {
    const u = h[e], E = P(e);
    w?.(e, {
      ...u,
      op: s || u?.op || E,
      val: n,
      mode: u?.mode === Z.MULTI ? Z.SIMPLE : u?.mode
    });
  }, v = (e) => {
    const n = h[e], s = P(e);
    w?.(e, {
      ...n,
      op: n?.op || s,
      val: "",
      mode: Z.SIMPLE,
      multiValues: void 0,
      multiRanges: void 0
    });
  };
  return /* @__PURE__ */ y(be, { children: [
    /* @__PURE__ */ r(
      "div",
      {
        "data-agv-fullwidth": "true",
        style: {
          width: `var(--agv-total-grid-w, ${o}px)`,
          minWidth: `var(--agv-total-grid-w, ${o}px)`,
          height: "34px",
          top: `${Pe}px`,
          backgroundColor: "var(--agv-bg-header)",
          borderColor: "var(--agv-border)"
        },
        className: "flex items-center box-border h-[34px] min-h-[34px] max-h-[34px] border-b-2 border-b-[var(--agv-border)] select-none sticky z-20",
        onContextMenu: (e) => e.preventDefault(),
        children: S.map((e, n) => {
          const s = we[e.key] || e.defaultWidth, u = $e[e.key] || J.NONE, E = u === J.LEFT, fe = u === J.RIGHT, ve = u === J.CENTER ? Se[e.key] || Q.NORMAL : Q.NORMAL, re = ve === Q.LEFT, ne = ve === Q.RIGHT, et = E || re, tt = fe || ne, rt = e.key === Fe, nt = e.key === Ie, d = h[e.key], ge = d?.mode === Z.MULTI && !!(Array.isArray(d.multiValues) && d.multiValues.length > 0 || Array.isArray(d.multiRanges) && d.multiRanges.length > 0), A = ge || !!d && (d.val.trim().length > 0 || _[d.op]?.noInput), D = {
            width: `var(--agv-col-w-${e.key}, ${s}px)`,
            minWidth: `var(--agv-col-w-${e.key}, ${s}px)`,
            maxWidth: `var(--agv-col-w-${e.key}, ${s}px)`,
            height: "34px",
            backgroundColor: "var(--agv-bg-header)",
            ...E ? { position: "sticky", left: `var(--agv-left-offset-${e.key}, ${Ae[e.key]}px)`, zIndex: 25 } : re ? { position: "sticky", left: `var(--agv-center-left-offset-${e.key}, ${Te[e.key]}px)`, zIndex: 24 } : fe ? { position: "sticky", right: `var(--agv-right-offset-${e.key}, ${Le[e.key]}px)`, zIndex: 25 } : ne ? { position: "sticky", right: `var(--agv-center-right-offset-${e.key}, ${Oe[e.key]}px)`, zIndex: 24 } : {}
          }, at = et && (rt || re), lt = tt && (nt || ne), z = at ? kt() : "border-r border-r-[var(--agv-border)]", M = lt ? xt() : "";
          if (e.isDetailExpand || e.key === "col_detail_expand")
            return /* @__PURE__ */ r(
              "div",
              {
                "data-col-key": e.key,
                style: D,
                className: `flex items-center justify-center px-0.5 ${z} ${M} border-b-2 border-b-[var(--agv-border)] shrink-0 box-border h-[34px]`
              },
              `filter_${e.key}`
            );
          if (e.isRowNumber || e.dataType === x.SYSTEM && (e.title || n === 0))
            return /* @__PURE__ */ r(
              "div",
              {
                "data-col-key": e.key,
                style: D,
                className: `flex items-center justify-center px-0.5 ${z} ${M} border-b-2 border-b-[var(--agv-border)] shrink-0 box-border h-[34px]`,
                children: pe > 0 ? /* @__PURE__ */ y(
                  Ne,
                  {
                    variant: "destructive",
                    size: "sm",
                    "data-summary-trigger": "true",
                    "data-agv-popover-trigger": "true",
                    onClick: ce,
                    className: `w-full px-1 font-bold gap-0.5 select-none ${le()}`,
                    children: [
                      /* @__PURE__ */ r(ie, { size: 11, strokeWidth: 2.5, className: "shrink-0" }),
                      /* @__PURE__ */ y("span", { className: "text-xs font-bold leading-none", children: [
                        "(",
                        pe,
                        ")"
                      ] })
                    ]
                  }
                ) : /* @__PURE__ */ r(
                  Ne,
                  {
                    variant: "ghost",
                    size: "sm",
                    "data-summary-trigger": "true",
                    "data-agv-popover-trigger": "true",
                    onClick: ce,
                    className: `w-full px-1 text-[var(--agv-text-muted)] select-none ${le()}`,
                    children: "Lọc"
                  }
                )
              },
              `filter_${e.key}`
            );
          if (ut(e)) {
            const t = d?.val || m.ALL, a = t === m.ALL ? m.CHECKED : t === m.CHECKED ? m.UNCHECKED : m.ALL, i = t === m.ALL, L = t === m.CHECKED;
            return /* @__PURE__ */ r(
              "div",
              {
                "data-col-key": e.key,
                style: D,
                className: `flex items-center justify-center px-0.5 ${z} ${M} border-b-2 border-b-[var(--agv-border)] shrink-0 box-border h-[34px]`,
                children: /* @__PURE__ */ r(
                  "div",
                  {
                    role: "button",
                    tabIndex: 0,
                    onClick: () => {
                      w?.(
                        e.key,
                        ct(a === m.ALL ? "" : a)
                      );
                    },
                    className: "w-full h-[28px] min-h-[28px] bg-transparent flex items-center justify-center cursor-pointer select-none p-0 outline-none",
                    children: /* @__PURE__ */ r(
                      Ct,
                      {
                        checked: L,
                        indeterminate: i,
                        size: 16,
                        spring: "snappy",
                        className: "pointer-events-none"
                      }
                    )
                  }
                )
              },
              `filter_${e.key}`
            );
          }
          if (e.filterable === !1 || e.isChart)
            return /* @__PURE__ */ r(
              "div",
              {
                "data-col-key": e.key,
                style: D,
                className: `flex items-center justify-center px-1 ${z} ${M} border-b-2 border-b-[var(--agv-border)] shrink-0 box-border h-[34px]`,
                children: /* @__PURE__ */ r("span", { className: "text-xs text-[var(--agv-text-muted)] italic opacity-60", children: "—" })
              },
              `filter_${e.key}`
            );
          const U = e.dataType || x.TEXT, ye = P(e.key), N = d?.op || ye, K = _[N] || _[ye], X = pt(N), l = d?.val ?? "", ke = Je === e.key || f === e.key, xe = ke || A;
          let Y = ae(N) ? "VD: 10..50" : X ? K.label : `${K.label}...`;
          if (e.dataType === x.NUMBER && T && T[e.key] !== void 0) {
            const t = T[e.key] || 0, a = Math.abs(t) >= 1e3 ? Ce(Math.round(t)) : Ce(t, 2);
            Y = X ? K.label : a;
          }
          const g = !!ze?.has(e.key);
          return /* @__PURE__ */ r(
            "div",
            {
              "data-col-key": e.key,
              style: D,
              className: `flex items-center justify-center px-1 ${z} ${M} border-b-2 border-b-[var(--agv-border)] shrink-0 box-border h-[34px]`,
              children: /* @__PURE__ */ y(
                "div",
                {
                  onFocus: () => {
                    g || (p(e.key), b(null), C(null), I(null), R(null), window.dispatchEvent(
                      new CustomEvent("agv-close-all-popups", {
                        detail: {
                          except: U === x.DATE ? "datepicker" : "focus-cell",
                          source: "filter-cell"
                        }
                      })
                    ));
                  },
                  onBlur: (t) => {
                    t.currentTarget.contains(t.relatedTarget) || p((a) => a === e.key ? null : a);
                  },
                  onContextMenu: (t) => {
                    t.preventDefault(), t.stopPropagation(), !g && e.dataType !== x.SYSTEM && e.filterable !== !1 && !e.isChart && he(e.key, t);
                  },
                  className: `flex items-center w-full h-[28px] min-h-[28px] ${le()} overflow-hidden agv-filter-cell-box ${g ? "bg-muted/40 border border-border opacity-60 cursor-not-allowed" : `${gt} ${ke || xe ? "is-focused" : ""}`}`,
                  children: [
                    !g && /* @__PURE__ */ r(
                      "button",
                      {
                        type: "button",
                        "data-op-trigger": e.key,
                        "data-agv-popover-trigger": "true",
                        disabled: g,
                        onClick: (t) => !g && Ze(e.key, t),
                        className: `h-full pl-1.5 pr-0 flex items-center justify-center shrink-0 border-none bg-transparent transition-colors agv-filter-op-btn ${g ? "opacity-30 cursor-not-allowed text-[var(--agv-text-muted)]" : xe ? "cursor-pointer text-[var(--agv-accent)]" : "cursor-pointer text-[var(--agv-text-muted)] hover:text-[var(--agv-accent)]"}`,
                        children: /* @__PURE__ */ r(Ee, { op: N, size: 14 })
                      }
                    ),
                    /* @__PURE__ */ r("div", { className: "relative flex-1 h-full flex items-center min-w-0", children: g ? /* @__PURE__ */ r("div", { className: "w-full h-full cursor-not-allowed select-none" }) : ge ? (() => {
                      const t = mt(d?.op);
                      return /* @__PURE__ */ y(
                        "div",
                        {
                          onClick: (a) => he(e.key, a),
                          className: "w-full h-full flex items-center justify-between px-1.5 cursor-pointer select-none",
                          children: [
                            /* @__PURE__ */ y(
                              "span",
                              {
                                className: "px-1.5 py-0.5 rounded text-xs font-semibold flex items-center gap-1 truncate max-w-[calc(100%-20px)] bg-[var(--agv-accent)] text-[var(--agv-accent-text,#ffffff)]",
                                children: [
                                  t ? "AND: " : "OR: ",
                                  d?.multiRanges && d.multiRanges.length > 0 ? `${d.multiRanges.length} khoảng` : `${d?.multiValues?.length || 1} mục`
                                ]
                              }
                            ),
                            /* @__PURE__ */ r(
                              "button",
                              {
                                type: "button",
                                onClick: (a) => {
                                  a.stopPropagation(), v(e.key);
                                },
                                className: "agv-inline-clear-destructive w-4 h-4 shrink-0",
                                children: /* @__PURE__ */ r(ie, { size: 10, strokeWidth: 2.5 })
                              }
                            )
                          ]
                        }
                      );
                    })() : X ? /* @__PURE__ */ r("div", { className: "w-full h-full flex items-center px-2 text-xs italic text-[var(--agv-text-muted)] opacity-70", children: K.label }) : U === x.DATE ? /* @__PURE__ */ r(c.Suspense, { fallback: null, children: /* @__PURE__ */ r(
                      St,
                      {
                        col: e,
                        inputVal: l,
                        currentOp: N,
                        placeholderText: Y,
                        surfaceTheme: B,
                        getColumnDateBounds: ue,
                        onCommitValue: (t, a) => $(t, a)
                      }
                    ) }) : U === x.TIME ? /* @__PURE__ */ r(c.Suspense, { fallback: null, children: ae(N) ? /* @__PURE__ */ r(
                      At,
                      {
                        from: l.includes("..") ? l.split("..")[0]?.trim() || "" : l.includes(" - ") ? l.split(" - ")[0]?.trim() || "" : l.trim(),
                        to: l.includes("..") ? l.split("..")[1]?.trim() || "" : l.includes(" - ") && l.split(" - ")[1]?.trim() || "",
                        onChange: (t, a) => {
                          const i = t && a ? t === a ? t : `${t}..${a}` : t || (a ? `..${a}` : "");
                          $(e.key, i);
                        },
                        onFocus: () => p(e.key),
                        onBlur: () => p((t) => t === e.key ? null : t),
                        onClear: () => v(e.key),
                        hasValue: A
                      }
                    ) : /* @__PURE__ */ r(
                      Lt,
                      {
                        value: l,
                        onChange: (t) => $(e.key, t),
                        onFocus: () => p(e.key),
                        onBlur: () => p((t) => t === e.key ? null : t),
                        onClear: () => v(e.key),
                        placeholder: "HH:mm",
                        hasValue: A
                      }
                    ) }) : U === x.NUMBER ? /* @__PURE__ */ r(c.Suspense, { fallback: null, children: ae(N) ? (() => {
                      let t = "", a = "";
                      if (l.includes("..")) {
                        const i = l.split("..");
                        t = i[0]?.trim() || "", a = i[1]?.trim() || "";
                      } else if (l.includes(" - ")) {
                        const i = l.split(" - ");
                        t = i[0]?.trim() || "", a = i[1]?.trim() || "";
                      } else if (l.includes("/")) {
                        const i = l.split("/");
                        t = i[0]?.trim() || "", a = i[1]?.trim() || "";
                      } else if (l.includes("~")) {
                        const i = l.split("~");
                        t = i[0]?.trim() || "", a = i[1]?.trim() || "";
                      } else l.trim() && (t = l.trim());
                      return /* @__PURE__ */ r(
                        wt,
                        {
                          from: t,
                          to: a,
                          onChange: (i, L) => {
                            const it = i && L ? `${i}..${L}` : i ? `${i}..` : L ? `..${L}` : "";
                            $(e.key, it, ht.BETWEEN);
                          },
                          onFocus: () => p(e.key),
                          onBlur: () => p((i) => i === e.key ? null : i),
                          onClear: () => v(e.key),
                          hasValue: A
                        }
                      );
                    })() : /* @__PURE__ */ r(
                      $t,
                      {
                        value: l,
                        onChange: (t, a) => $(e.key, t, a),
                        onFocus: () => p(e.key),
                        onBlur: () => p((t) => t === e.key ? null : t),
                        onClear: () => v(e.key),
                        placeholder: Y,
                        hasValue: A,
                        isHighlightPlaceholder: !!(De && T && T[e.key] !== void 0 && !X)
                      }
                    ) }) : /* @__PURE__ */ y(be, { children: [
                      /* @__PURE__ */ r(
                        "input",
                        {
                          type: "text",
                          value: l,
                          onFocus: () => p(e.key),
                          onBlur: () => p((t) => t === e.key ? null : t),
                          onChange: (t) => $(e.key, t.target.value),
                          placeholder: Y,
                          ...yt,
                          className: "w-full h-full bg-transparent px-1.5 text-xs outline-none border-none placeholder:text-[var(--agv-text-muted)] placeholder:opacity-60 disabled:cursor-not-allowed",
                          style: {
                            color: "var(--agv-text-main)"
                          }
                        }
                      ),
                      A && /* @__PURE__ */ r(
                        "button",
                        {
                          type: "button",
                          onClick: () => v(e.key),
                          className: "agv-inline-clear-destructive absolute right-1 top-1/2 -translate-y-1/2 w-4 h-4",
                          children: /* @__PURE__ */ r(ie, { size: 10, strokeWidth: 2.5 })
                        }
                      )
                    ] }) })
                  ]
                }
              )
            },
            `filter_${e.key}`
          );
        })
      }
    ),
    /* @__PURE__ */ r(
      dt,
      {
        isOpen: !!(f && me),
        anchorEl: me,
        onClose: () => {
          b(null), C(null);
        },
        placement: "bottom-start",
        showArrow: !0,
        offset: 10,
        width: 192,
        minWidth: 192,
        paddingClassName: "agv-popup-menu",
        contentClassName: "text-xs flex flex-col gap-0.5 select-none",
        zIndex: 99999999,
        theme: B,
        ignoreClickOutsideSelectors: ".agv-filter-op-btn, [data-op-trigger], [data-agv-popover-trigger='true']",
        children: f && (() => {
          const e = vt(
            f,
            S,
            de
          ), n = h[f]?.op || P(f);
          return e.map((s) => {
            const u = _[s], E = s === n;
            return /* @__PURE__ */ y(
              "button",
              {
                type: "button",
                onClick: () => qe(f, s),
                className: `agv-popup-item ${E ? "is-selected" : ""}`,
                children: [
                  /* @__PURE__ */ r(Ee, { op: s, size: 14, className: "shrink-0" }),
                  /* @__PURE__ */ r("span", { className: "flex-1 truncate", children: u.label }),
                  E && /* @__PURE__ */ r(Nt, { size: 13, strokeWidth: 2.5, className: "shrink-0" })
                ]
              },
              s
            );
          });
        })()
      }
    ),
    W && (() => {
      const e = S.find((n) => n.key === W);
      return e ? /* @__PURE__ */ r(c.Suspense, { fallback: null, children: /* @__PURE__ */ r(
        Tt,
        {
          isOpen: !!W,
          onClose: () => {
            I(null), R(null);
          },
          anchorEl: Qe,
          column: e,
          currentFilter: h[W],
          onApply: (n, s) => {
            w?.(n, s);
          },
          onClear: (n) => {
            v(n);
          },
          hasColumnEmptyCells: de,
          getColumnDateBounds: ue,
          surfaceTheme: B
        }
      ) }) : null;
    })(),
    ee && /* @__PURE__ */ r(c.Suspense, { fallback: null, children: /* @__PURE__ */ r(
      Ot,
      {
        isOpen: ee,
        onClose: () => te(!1),
        anchorRect: Xe,
        anchorEl: Ue,
        surfaceTheme: B,
        columns: S,
        groupByColumnKey: q,
        columnFilters: h,
        quickFilterText: V,
        sortConfig: H,
        sortRules: O,
        groupSortConfig: j,
        appliedQueryTree: G,
        pinnedRows: F,
        onClearRowFilter: (e) => v(e),
        onClearChecklistFilter: (e) => {
          const n = h[e];
          w?.(e, {
            ...n,
            selectedValues: void 0,
            includeBlanks: void 0
          });
        },
        onClearGroup: Me,
        onClearQuickSearch: () => He?.(""),
        onClearSortRow: () => _e?.(null),
        onRemoveSortRule: Be,
        onClearSortGroup: () => Ve?.(""),
        onClearQueryTree: () => je?.(null),
        onUnpinRow: Ge,
        onClearAll: () => {
          We?.(), se ? se() : Re?.();
        }
      }
    ) })
  ] });
});
export {
  jt as GridFilterRow
};
