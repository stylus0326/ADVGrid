import { jsxs as n, Fragment as K, jsx as r } from "react/jsx-runtime";
import { useState as he, useRef as ue, useLayoutEffect as R } from "react";
import { createPortal as ge } from "react-dom";
import { M as W } from "./MorphCheckbox-S5ZNer1R.js";
import { A as be } from "./AdvOverlayScroll-CipuwW1l.js";
import { A as me } from "./AdvPopover-CVmyHBzb.js";
import { u as fe } from "./useVirtualList-CH5KMFFG.js";
import { s as xe, g as ve } from "./enterpriseEditorUtils-DJeTtQuh.js";
import { F as G } from "./FilterIcons-nsUh2HLg.js";
import { i as X, b as q, j as Ne } from "./gridFormatUtils-wCKPmlrt.js";
import { P as we, C as ke, B as $e, N as ye, g as Se, A as D } from "./AdvButton-Ck5SixaL.js";
import { C as Ce } from "./check-KNrOhvEC.js";
const J = 32;
function Be({
  theme: k,
  themeClass: H,
  coords: c,
  selectionMode: p = "row",
  multiSelect: x,
  columns: u,
  hasAnySelection: m,
  isAllFilteredSelected: I,
  isFilterRowVisible: L,
  filterStates: O,
  filterOperators: $,
  filteredData: g,
  valueMember: Q,
  selectedKeysSet: _,
  selectedCellKeysSet: T,
  isKeyboardNav: Y,
  highlightedIndex: v,
  activeOpMenuCol: d,
  dropdownRef: Z,
  opMenuRef: M,
  tableBodyRef: N,
  theadRef: y,
  isKeyboardNavRef: ee,
  navSourceRef: S,
  setKeyboardNavActive: re,
  setActiveOpMenuCol: V,
  handleListNavigationKeyDown: te,
  handleClearMultiAll: A,
  handleFilterRowChange: E,
  handleFilterOpChange: oe,
  handleToggleMultiRow: U,
  handleSelectSingleRow: ae,
  handleSelectCell: ne,
  handleApplyMulti: se
}) {
  const [b, ie] = he(0), C = ue({});
  R(() => {
    const e = y.current;
    if (!e) return;
    const o = () => {
      const h = e.offsetHeight || 0;
      ie((s) => s === h ? s : h);
    };
    if (o(), typeof ResizeObserver > "u") return;
    const a = new ResizeObserver(o);
    return a.observe(e), () => a.disconnect();
  }, [y, L, u.length]);
  const B = Math.max(118, c.maxHeight - 2), t = fe({
    itemCount: g.length,
    itemHeight: J,
    viewportRef: N,
    overscan: 6,
    threshold: 40,
    defaultViewportHeight: B,
    topOffset: b
  });
  R(() => {
    if (S.current === "pointer") return;
    if (t.isVirtualized) {
      t.scrollToIndex(v, 0, 0);
      return;
    }
    const e = N.current;
    if (!e) return;
    const o = e.querySelector(`tr[data-lookup-idx="${v}"]`);
    o && xe(e, o, b);
  }, [
    v,
    g.length,
    b,
    t.isVirtualized,
    t.scrollToIndex,
    N,
    S
  ]);
  const le = t.isVirtualized ? g.slice(t.startIndex, t.endIndex) : g, de = t.isVirtualized ? t.startIndex : 0, f = x && p !== "cell", z = u.length + (f ? 1 : 0);
  return /* @__PURE__ */ n(K, { children: [
    ge(
      /* @__PURE__ */ n(
        "div",
        {
          ref: Z,
          "data-theme": k || void 0,
          style: {
            position: "fixed",
            ...c.isFlipUp ? { bottom: `${c.bottom}px`, top: "auto" } : { top: `${c.top}px`, bottom: "auto" },
            left: `${c.left}px`,
            width: `${c.width}px`,
            maxHeight: `${c.maxHeight}px`,
            zIndex: 99999999,
            ...ve()
          },
          className: `agv-searchlookupedit-dropdown ${we} overflow-hidden flex flex-col text-xs ${c.isFlipUp ? "agv-spring-up" : "agv-spring-down"} ${H}`,
          "data-agv-popup": "true",
          tabIndex: -1,
          onMouseDown: (e) => e.stopPropagation(),
          onClick: (e) => e.stopPropagation(),
          onKeyDown: (e) => {
            !e.defaultPrevented && !d && te(e);
          },
          children: [
            /* @__PURE__ */ r(
              be,
              {
                className: "flex-initial min-h-0",
                viewportRef: N,
                onScroll: t.handleScroll,
                onViewportMouseMove: () => {
                  ee.current && (S.current = "pointer", re(!1));
                },
                viewportClassName: "overflow-auto bg-popover",
                viewportStyle: { maxHeight: `${B}px` },
                scrollX: !0,
                trackTopInset: b > 0 ? b + 2 : 2,
                contentSignature: `${g.length}:${t.startIndex}:${t.endIndex}:${b}`,
                children: /* @__PURE__ */ n("table", { className: "w-full table-fixed text-left border-separate border-spacing-0", children: [
                  /* @__PURE__ */ n("colgroup", { children: [
                    f && /* @__PURE__ */ r("col", { style: { width: 36 } }),
                    u.map((e) => /* @__PURE__ */ r(
                      "col",
                      {
                        style: e.width ? { width: e.width } : void 0
                      },
                      `col_${String(e.key)}`
                    ))
                  ] }),
                  /* @__PURE__ */ n("thead", { ref: y, className: "bg-table-header sticky top-0 z-10 text-xs font-semibold text-foreground", children: [
                    /* @__PURE__ */ n("tr", { children: [
                      f && /* @__PURE__ */ r(
                        "th",
                        {
                          style: { width: 36 },
                          className: `px-1 py-0.5 text-center select-none bg-table-header border-b border-r border-[var(--agv-border)] ${m ? "cursor-pointer" : "cursor-default"}`,
                          onClick: m ? A : (e) => e.stopPropagation(),
                          children: /* @__PURE__ */ r(
                            W,
                            {
                              checked: I,
                              indeterminate: !I && m,
                              disabled: !m,
                              size: 16,
                              className: "pointer-events-none"
                            }
                          )
                        }
                      ),
                      u.map((e) => /* @__PURE__ */ r(
                        "th",
                        {
                          style: { width: e.width },
                          className: `px-2.5 py-1.5 select-none bg-table-header border-b border-r last:border-r-0 border-[var(--agv-border)] ${X(e.align)}`,
                          children: e.title
                        },
                        String(e.key)
                      ))
                    ] }),
                    L && /* @__PURE__ */ n("tr", { className: "bg-table-header", children: [
                      f && /* @__PURE__ */ r("th", { className: "px-1 py-1 text-center bg-table-header border-b border-r border-[var(--agv-border)]" }),
                      u.map((e) => {
                        const o = String(e.key), a = O[o] || { val: "", op: q.CONTAINS }, h = $.find((i) => i.id === a.op) || $[0], s = Ne(a.op);
                        return /* @__PURE__ */ r(
                          "th",
                          {
                            className: "p-1 font-normal bg-table-header border-b border-r last:border-r-0 border-[var(--agv-border)]",
                            children: /* @__PURE__ */ n("div", { className: `${ke} ${Se()} flex h-7 min-h-[28px] items-center overflow-hidden`, children: [
                              /* @__PURE__ */ r(
                                "button",
                                {
                                  ref: (i) => {
                                    C.current[o] = i;
                                  },
                                  type: "button",
                                  "data-agv-popover-trigger": "true",
                                  onClick: (i) => {
                                    i.stopPropagation(), V(d === o ? null : o);
                                  },
                                  className: `flex h-full w-7 shrink-0 items-center justify-center border-r border-[var(--agv-border)] bg-table-header text-muted-foreground hover:bg-surface-hover hover:text-foreground cursor-pointer select-none transition-colors p-0 ${$e}`,
                                  children: /* @__PURE__ */ r(G, { op: a.op, size: 13 })
                                }
                              ),
                              /* @__PURE__ */ n("div", { className: "relative flex flex-1 items-center h-full", children: [
                                /* @__PURE__ */ r(
                                  "input",
                                  {
                                    type: "text",
                                    value: s ? `(${h.label})` : a.val,
                                    disabled: s,
                                    onChange: (i) => E(o, i.target.value),
                                    placeholder: "Lọc...",
                                    ...ye,
                                    className: `w-full h-full bg-transparent border-0 px-2 text-xs text-foreground placeholder:text-muted-foreground outline-none ${s ? "italic opacity-70 select-none cursor-not-allowed" : ""}`
                                  }
                                ),
                                !s && a.val && /* @__PURE__ */ r(
                                  "button",
                                  {
                                    type: "button",
                                    onClick: () => E(o, ""),
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
                  /* @__PURE__ */ r("tbody", { className: "select-none", children: g.length === 0 ? /* @__PURE__ */ r("tr", { children: /* @__PURE__ */ r(
                    "td",
                    {
                      colSpan: z,
                      className: "px-3 py-4 text-center text-xs text-muted-foreground border-b border-[var(--agv-border)]",
                      children: "Không tìm thấy dữ liệu phù hợp"
                    }
                  ) }) : /* @__PURE__ */ n(K, { children: [
                    t.isVirtualized && t.topSpacer > 0 && /* @__PURE__ */ r("tr", { "aria-hidden": "true", style: { height: `${t.topSpacer}px` }, children: /* @__PURE__ */ r("td", { colSpan: z, className: "p-0 border-0" }) }),
                    le.map((e, o) => {
                      const a = de + o, h = String(e[Q]), s = _.has(h), i = Y && a === v;
                      let w = "text-foreground hover:bg-surface-hover";
                      return p === "cell" ? w = i ? "bg-accent/20 text-foreground" : "text-foreground" : s ? w = x ? "bg-surface-selected text-foreground font-medium" : "bg-[var(--popup-item-selected-bg)] text-[var(--popup-item-selected-fg)] font-medium" : i && (w = "bg-accent text-accent-foreground"), /* @__PURE__ */ n(
                        "tr",
                        {
                          "data-lookup-idx": a,
                          style: { height: `${J}px` },
                          onClick: (l) => {
                            p !== "cell" && (x ? U(e, l) : ae(e));
                          },
                          className: `${p === "cell" ? "select-none h-8" : "cursor-pointer select-none h-8"} ${w}`,
                          children: [
                            f && /* @__PURE__ */ r(
                              "td",
                              {
                                className: "h-8 px-1 py-0 text-center border-b border-r border-[var(--agv-border)]",
                                onClick: (l) => U(e, l),
                                children: /* @__PURE__ */ r(
                                  W,
                                  {
                                    checked: s,
                                    size: 16,
                                    className: "pointer-events-none"
                                  }
                                )
                              }
                            ),
                            u.map((l) => {
                              const F = String(l.key), ce = `${h}:::${F}`, pe = p === "cell" && !!T?.has(ce);
                              let P = `h-8 px-2.5 py-0 truncate border-b border-r last:border-r-0 border-[var(--agv-border)] ${l.className ? `${l.className} ` : ""}${X(l.align)}`;
                              return p === "cell" && (pe ? P += " bg-[var(--agv-accent)] text-[var(--agv-accent-text,#ffffff)] font-medium" : P += " hover:bg-surface-hover cursor-pointer transition-colors"), /* @__PURE__ */ r(
                                "td",
                                {
                                  className: P,
                                  onClick: (j) => {
                                    p === "cell" && (j.stopPropagation(), ne?.(e, l.key, j));
                                  },
                                  children: String(e[l.key] ?? "")
                                },
                                F
                              );
                            })
                          ]
                        },
                        h || a
                      );
                    }),
                    t.isVirtualized && t.bottomSpacer > 0 && /* @__PURE__ */ r("tr", { "aria-hidden": "true", style: { height: `${t.bottomSpacer}px` }, children: /* @__PURE__ */ r("td", { colSpan: z, className: "p-0 border-0" }) })
                  ] }) })
                ] })
              }
            ),
            x && /* @__PURE__ */ n(
              "div",
              {
                className: "agv-lookup-footer flex items-center justify-between px-3 py-2 border-t border-[var(--agv-border)] bg-table-header shrink-0 select-none",
                style: { minHeight: "36px" },
                children: [
                  /* @__PURE__ */ r("div", { className: "text-xs text-[var(--agv-text-muted)] truncate", children: p === "cell" ? `Đã chọn: ${T?.size ?? 0} ô` : `Đã chọn: ${_.size} dòng` }),
                  /* @__PURE__ */ n("div", { className: "flex items-center gap-2 shrink-0", children: [
                    m && /* @__PURE__ */ r(
                      D,
                      {
                        variant: "destructive",
                        size: "sm",
                        onClick: A,
                        children: "Bỏ chọn"
                      }
                    ),
                    /* @__PURE__ */ r(
                      D,
                      {
                        variant: "default",
                        size: "sm",
                        onClick: se,
                        children: "Áp dụng"
                      }
                    )
                  ] })
                ]
              }
            )
          ]
        }
      ),
      document.body
    ),
    /* @__PURE__ */ r(
      me,
      {
        isOpen: !!(d && C.current[d]),
        anchorEl: d ? C.current[d] ?? null : null,
        onClose: () => V(null),
        placement: "bottom-start",
        showArrow: !0,
        offset: 10,
        width: "auto",
        minWidth: 165,
        paddingClassName: "p-0",
        contentClassName: "text-xs agv-lookup-op-menu",
        zIndex: 1e8,
        theme: k,
        ignoreClickOutsideSelectors: "",
        children: d && /* @__PURE__ */ r(
          "div",
          {
            ref: M,
            "data-theme": k || void 0,
            onMouseDown: (e) => e.stopPropagation(),
            className: `flex flex-col gap-0.5 rounded-md overflow-hidden p-1 text-xs min-w-[165px] ${H}`,
            children: $.map((e) => {
              const a = (O[d] || { op: q.CONTAINS }).op === e.id;
              return /* @__PURE__ */ n(
                "div",
                {
                  onClick: () => oe(d, e.id),
                  className: `agv-popup-item ${a ? "is-selected" : ""}`,
                  children: [
                    /* @__PURE__ */ r(G, { op: e.id, size: 14, className: "shrink-0" }),
                    /* @__PURE__ */ r("span", { className: "flex-1 truncate", children: e.label }),
                    a && /* @__PURE__ */ r(Ce, { size: 13, strokeWidth: 2.5, className: "shrink-0" })
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
  Be as AdvSearchLookUpPopup,
  Be as default
};
