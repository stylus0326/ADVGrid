import { jsxs as n, Fragment as T, jsx as r } from "react/jsx-runtime";
import { useState as re, useRef as te, useLayoutEffect as V } from "react";
import { createPortal as oe } from "react-dom";
import { M as A } from "./MorphCheckbox-S5ZNer1R.js";
import { A as ae } from "./AdvOverlayScroll-CipuwW1l.js";
import { A as ne } from "./AdvPopover-D5QeywtP.js";
import { u as se } from "./useVirtualList-CH5KMFFG.js";
import { s as ie, g as de } from "./enterpriseEditorUtils-DJeTtQuh.js";
import { F as E } from "./FilterIcons-nsUh2HLg.js";
import { i as U, b as F, j as le } from "./gridFormatUtils-wCKPmlrt.js";
import { P as ce, C as pe, B as he, N as ue, g as be } from "./AdvButton-B7j0puyb.js";
import { C as ge } from "./check-KNrOhvEC.js";
const K = 32;
function ze({
  theme: v,
  themeClass: S,
  coords: c,
  multiSelect: p,
  columns: h,
  hasAnySelection: m,
  isAllFilteredSelected: C,
  isFilterRowVisible: P,
  filterStates: z,
  filterOperators: N,
  filteredData: b,
  valueMember: j,
  selectedKeysSet: B,
  isKeyboardNav: R,
  highlightedIndex: x,
  activeOpMenuCol: i,
  dropdownRef: W,
  opMenuRef: G,
  tableBodyRef: f,
  theadRef: w,
  isKeyboardNavRef: X,
  navSourceRef: $,
  setKeyboardNavActive: q,
  setActiveOpMenuCol: I,
  handleListNavigationKeyDown: D,
  handleClearMultiAll: J,
  handleFilterRowChange: H,
  handleFilterOpChange: Q,
  handleToggleMultiRow: L,
  handleSelectSingleRow: Y
}) {
  const [g, Z] = re(0), y = te({});
  V(() => {
    const e = w.current;
    if (!e) return;
    const o = () => {
      const u = e.offsetHeight || 0;
      Z((s) => s === u ? s : u);
    };
    if (o(), typeof ResizeObserver > "u") return;
    const a = new ResizeObserver(o);
    return a.observe(e), () => a.disconnect();
  }, [w, P, h.length]);
  const O = Math.max(118, c.maxHeight - 2), t = se({
    itemCount: b.length,
    itemHeight: K,
    viewportRef: f,
    overscan: 6,
    threshold: 40,
    defaultViewportHeight: O,
    topOffset: g
  });
  V(() => {
    if ($.current === "pointer") return;
    if (t.isVirtualized) {
      t.scrollToIndex(x, 0, 0);
      return;
    }
    const e = f.current;
    if (!e) return;
    const o = e.querySelector(`tr[data-lookup-idx="${x}"]`);
    o && ie(e, o, g);
  }, [
    x,
    b.length,
    g,
    t.isVirtualized,
    t.scrollToIndex,
    f,
    $
  ]);
  const M = t.isVirtualized ? b.slice(t.startIndex, t.endIndex) : b, ee = t.isVirtualized ? t.startIndex : 0, _ = h.length + (p ? 1 : 0);
  return /* @__PURE__ */ n(T, { children: [
    oe(
      /* @__PURE__ */ r(
        "div",
        {
          ref: W,
          "data-theme": v || void 0,
          style: {
            position: "fixed",
            ...c.isFlipUp ? { bottom: `${c.bottom}px`, top: "auto" } : { top: `${c.top}px`, bottom: "auto" },
            left: `${c.left}px`,
            width: `${c.width}px`,
            maxHeight: `${c.maxHeight}px`,
            zIndex: 99999999,
            ...de()
          },
          className: `agv-searchlookupedit-dropdown ${ce} overflow-hidden flex flex-col text-xs ${c.isFlipUp ? "agv-spring-up" : "agv-spring-down"} ${S}`,
          "data-agv-popup": "true",
          tabIndex: -1,
          onMouseDown: (e) => e.stopPropagation(),
          onClick: (e) => e.stopPropagation(),
          onKeyDown: (e) => {
            !e.defaultPrevented && !i && D(e);
          },
          children: /* @__PURE__ */ r(
            ae,
            {
              className: "flex-initial min-h-0",
              viewportRef: f,
              onScroll: t.handleScroll,
              onViewportMouseMove: () => {
                X.current && ($.current = "pointer", q(!1));
              },
              viewportClassName: "overflow-auto bg-popover",
              viewportStyle: { maxHeight: `${O}px` },
              scrollX: !0,
              trackTopInset: g > 0 ? g + 2 : 2,
              contentSignature: `${b.length}:${t.startIndex}:${t.endIndex}:${g}`,
              children: /* @__PURE__ */ n("table", { className: "w-full table-fixed text-left border-separate border-spacing-0", children: [
                /* @__PURE__ */ n("colgroup", { children: [
                  p && /* @__PURE__ */ r("col", { style: { width: 36 } }),
                  h.map((e) => /* @__PURE__ */ r(
                    "col",
                    {
                      style: e.width ? { width: e.width } : void 0
                    },
                    `col_${String(e.key)}`
                  ))
                ] }),
                /* @__PURE__ */ n("thead", { ref: w, className: "bg-table-header sticky top-0 z-10 text-xs font-semibold text-foreground", children: [
                  /* @__PURE__ */ n("tr", { children: [
                    p && /* @__PURE__ */ r(
                      "th",
                      {
                        style: { width: 36 },
                        className: `px-1 py-0.5 text-center select-none bg-table-header border-b border-r border-[var(--agv-border)] ${m ? "cursor-pointer" : "cursor-default"}`,
                        onClick: m ? J : (e) => e.stopPropagation(),
                        children: /* @__PURE__ */ r(
                          A,
                          {
                            checked: C,
                            indeterminate: !C && m,
                            disabled: !m,
                            size: 16,
                            className: "pointer-events-none"
                          }
                        )
                      }
                    ),
                    h.map((e) => /* @__PURE__ */ r(
                      "th",
                      {
                        style: { width: e.width },
                        className: `px-2.5 py-1.5 select-none bg-table-header border-b border-r last:border-r-0 border-[var(--agv-border)] ${U(e.align)}`,
                        children: e.title
                      },
                      String(e.key)
                    ))
                  ] }),
                  P && /* @__PURE__ */ n("tr", { className: "bg-table-header", children: [
                    p && /* @__PURE__ */ r("th", { className: "px-1 py-1 text-center bg-table-header border-b border-r border-[var(--agv-border)]" }),
                    h.map((e) => {
                      const o = String(e.key), a = z[o] || { val: "", op: F.CONTAINS }, u = N.find((d) => d.id === a.op) || N[0], s = le(a.op);
                      return /* @__PURE__ */ r(
                        "th",
                        {
                          className: "p-1 font-normal bg-table-header border-b border-r last:border-r-0 border-[var(--agv-border)]",
                          children: /* @__PURE__ */ n("div", { className: `${pe} ${be()} flex h-7 min-h-[28px] items-center overflow-hidden`, children: [
                            /* @__PURE__ */ r(
                              "button",
                              {
                                ref: (d) => {
                                  y.current[o] = d;
                                },
                                type: "button",
                                "data-agv-popover-trigger": "true",
                                onClick: (d) => {
                                  d.stopPropagation(), I(i === o ? null : o);
                                },
                                className: `flex h-full w-7 shrink-0 items-center justify-center border-r border-[var(--agv-border)] bg-table-header text-muted-foreground hover:bg-surface-hover hover:text-foreground cursor-pointer select-none transition-colors p-0 ${he}`,
                                children: /* @__PURE__ */ r(E, { op: a.op, size: 13 })
                              }
                            ),
                            /* @__PURE__ */ n("div", { className: "relative flex flex-1 items-center h-full", children: [
                              /* @__PURE__ */ r(
                                "input",
                                {
                                  type: "text",
                                  value: s ? `(${u.label})` : a.val,
                                  disabled: s,
                                  onChange: (d) => H(o, d.target.value),
                                  placeholder: "Lọc...",
                                  ...ue,
                                  className: `w-full h-full bg-transparent border-0 px-2 text-xs text-foreground placeholder:text-muted-foreground outline-none ${s ? "italic opacity-70 select-none cursor-not-allowed" : ""}`
                                }
                              ),
                              !s && a.val && /* @__PURE__ */ r(
                                "button",
                                {
                                  type: "button",
                                  onClick: () => H(o, ""),
                                  className: "agv-inline-clear-ghost absolute right-1 text-xs select-none",
                                  children: "×"
                                }
                              )
                            ] })
                          ] })
                        },
                        `filter_${o}`
                      );
                    })
                  ] })
                ] }),
                /* @__PURE__ */ r("tbody", { className: "select-none", children: b.length === 0 ? /* @__PURE__ */ r("tr", { children: /* @__PURE__ */ r(
                  "td",
                  {
                    colSpan: h.length + (p ? 1 : 0),
                    className: "px-3 py-4 text-center text-xs text-muted-foreground border-b border-[var(--agv-border)]",
                    children: "Không tìm thấy dữ liệu phù hợp"
                  }
                ) }) : /* @__PURE__ */ n(T, { children: [
                  t.isVirtualized && t.topSpacer > 0 && /* @__PURE__ */ r("tr", { "aria-hidden": "true", style: { height: `${t.topSpacer}px` }, children: /* @__PURE__ */ r("td", { colSpan: _, className: "p-0 border-0" }) }),
                  M.map((e, o) => {
                    const a = ee + o, u = String(e[j]), s = B.has(u), d = R && a === x;
                    let k = "text-foreground hover:bg-surface-hover";
                    return s ? k = p ? "bg-surface-selected text-foreground font-medium" : "bg-[var(--popup-item-selected-bg)] text-[var(--popup-item-selected-fg)] font-medium" : d && (k = "bg-accent text-accent-foreground"), /* @__PURE__ */ n(
                      "tr",
                      {
                        "data-lookup-idx": a,
                        style: { height: `${K}px` },
                        onClick: (l) => {
                          p ? L(e, l) : Y(e);
                        },
                        className: `cursor-pointer select-none h-8 ${k}`,
                        children: [
                          p && /* @__PURE__ */ r(
                            "td",
                            {
                              className: "h-8 px-1 py-0 text-center border-b border-r border-[var(--agv-border)]",
                              onClick: (l) => L(e, l),
                              children: /* @__PURE__ */ r(
                                A,
                                {
                                  checked: s,
                                  size: 16,
                                  className: "pointer-events-none"
                                }
                              )
                            }
                          ),
                          h.map((l) => /* @__PURE__ */ r(
                            "td",
                            {
                              className: `h-8 px-2.5 py-0 truncate border-b border-r last:border-r-0 border-[var(--agv-border)] ${l.className ? `${l.className} ` : ""}${U(
                                l.align
                              )}`,
                              children: String(e[l.key] ?? "")
                            },
                            String(l.key)
                          ))
                        ]
                      },
                      u || a
                    );
                  }),
                  t.isVirtualized && t.bottomSpacer > 0 && /* @__PURE__ */ r("tr", { "aria-hidden": "true", style: { height: `${t.bottomSpacer}px` }, children: /* @__PURE__ */ r("td", { colSpan: _, className: "p-0 border-0" }) })
                ] }) })
              ] })
            }
          )
        }
      ),
      document.body
    ),
    /* @__PURE__ */ r(
      ne,
      {
        isOpen: !!(i && y.current[i]),
        anchorEl: i ? y.current[i] ?? null : null,
        onClose: () => I(null),
        placement: "bottom-start",
        showArrow: !0,
        offset: 10,
        width: "auto",
        minWidth: 165,
        paddingClassName: "p-0",
        contentClassName: "text-xs agv-lookup-op-menu",
        zIndex: 1e8,
        theme: v,
        ignoreClickOutsideSelectors: "",
        children: i && /* @__PURE__ */ r(
          "div",
          {
            ref: G,
            "data-theme": v || void 0,
            onMouseDown: (e) => e.stopPropagation(),
            className: `flex flex-col gap-0.5 rounded-md overflow-hidden p-1 text-xs min-w-[165px] ${S}`,
            children: N.map((e) => {
              const a = (z[i] || { op: F.CONTAINS }).op === e.id;
              return /* @__PURE__ */ n(
                "div",
                {
                  onClick: () => Q(i, e.id),
                  className: `agv-popup-item ${a ? "is-selected" : ""}`,
                  children: [
                    /* @__PURE__ */ r(E, { op: e.id, size: 14, className: "shrink-0" }),
                    /* @__PURE__ */ r("span", { className: "flex-1 truncate", children: e.label }),
                    a && /* @__PURE__ */ r(ge, { size: 13, strokeWidth: 2.5, className: "shrink-0" })
                  ]
                },
                e.id
              );
            })
          }
        )
      }
    )
  ] });
}
export {
  ze as AdvSearchLookUpPopup,
  ze as default
};
