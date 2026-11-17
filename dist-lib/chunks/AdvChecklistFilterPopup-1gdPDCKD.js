import { jsxs as E, Fragment as Ae, jsx as a } from "react/jsx-runtime";
import ue, { forwardRef as we, useState as B, useRef as G, useEffect as O, useImperativeHandle as De, useMemo as he } from "react";
import { createPortal as Ee } from "react-dom";
import { n as H } from "./enterpriseEditorUtils-DJeTtQuh.js";
import { A as me } from "./AdvOverlayScroll-CipuwW1l.js";
import { A as $e } from "./AdvPopover-CVmyHBzb.js";
import { u as fe } from "./useVirtualList-CH5KMFFG.js";
import { A as R } from "./AdvCheckbox-CRVR1r8W.js";
import { M as ie } from "./MorphIcons-DW5eQGeo.js";
import { N as Le, A as ce } from "./AdvButton-Ck5SixaL.js";
import { D as U, t as Te, j as Ie, F as Me, v as Ve } from "./gridFormatUtils-wCKPmlrt.js";
import { S as Be, g as Re } from "./common-29M8PlVv.js";
import { S as Fe } from "./search-Bmmet712.js";
import { X as Pe } from "./x-CdrDtutQ.js";
import { c as Ke } from "./createLucideIcon-BCMt_G8a.js";
const ge = {
  name: "funnel-x",
  size: 24,
  node: [
    [
      "path",
      {
        d: "M12.531 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14v6a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341l.427-.473",
        key: "ol2ft2"
      }
    ],
    ["path", { d: "m16.5 3.5 5 5", key: "15e6fa" }],
    ["path", { d: "m21.5 3.5-5 5", key: "m0lwru" }]
  ],
  aliases: ["filter-x"]
};
ge.node;
const _e = Ke(ge), de = typeof Intl < "u" && Intl.Collator ? new Intl.Collator("vi", { sensitivity: "base", numeric: !0 }) : null;
function pe(l) {
  if (typeof l == "number") return l;
  const u = String(l ?? "").replace(/,/g, "").trim(), v = parseFloat(u);
  return isNaN(v) ? NaN : v;
}
function ze(l, u, v, k, S, b, N) {
  if (k?.current?.[l])
    return k.current[l];
  const d = /* @__PURE__ */ new Set();
  let C = !1;
  if (N && b && b > 0)
    for (let r = 0; r < b; r++) {
      const e = N(r, l);
      e == null || String(e).trim() === "" ? C = !0 : d.add(String(e).trim());
    }
  else {
    const r = (e, o) => {
      if (!(!e || e._isGroupRow)) {
        if (e.cells && typeof e.cells.get == "function") {
          const t = e.cells.get(l);
          if (t !== void 0) return t?.value;
        }
        if (e[l] !== void 0)
          return e[l];
      }
    };
    if (Array.isArray(u) && u.length > 0) {
      const e = u.length;
      for (let o = 0; o < e; o++) {
        const t = r(u[o]);
        t == null || String(t).trim() === "" ? C = !0 : d.add(String(t).trim());
      }
    } else if (S && b && b > 0)
      for (let e = 0; e < b; e++) {
        const o = S(e), t = r(o);
        t == null || String(t).trim() === "" ? C = !0 : d.add(String(t).trim());
      }
  }
  const x = v === U.NUMBER, i = v === U.DATE || v === U.TIME;
  let h;
  x ? h = Array.from(d).sort((r, e) => {
    const o = pe(r), t = pe(e);
    return !isNaN(o) && !isNaN(t) ? o - t : r.localeCompare(e);
  }) : i ? h = Array.from(d).sort((r, e) => r < e ? -1 : r > e ? 1 : 0) : de ? h = Array.from(d).sort(de.compare) : h = Array.from(d).sort(
    (r, e) => String(r).localeCompare(String(e), "vi", { sensitivity: "base", numeric: !0 })
  );
  const s = {
    values: h,
    hasBlanks: C
  };
  return k?.current && (k.current[l] = s), s;
}
const ve = ue.memo(
  ({ items: l, selectedSet: u, onToggle: v, formatDisplay: k, colKey: S, showBlanksInList: b }) => {
    const N = G(null), d = fe({
      itemCount: l.length,
      itemHeight: 28,
      viewportRef: N,
      overscan: 6,
      threshold: 1,
      defaultViewportHeight: 224
    }), C = l.slice(d.startIndex, d.endIndex);
    return O(() => {
      d.resetScroll();
    }, [l]), l.length === 0 && !b ? /* @__PURE__ */ a("div", { className: "max-h-52 px-2 py-4 text-center text-xs italic text-[var(--agv-text-muted)]", children: "Không tìm thấy giá trị phù hợp" }) : /* @__PURE__ */ E(
      me,
      {
        viewportRef: N,
        onScroll: d.handleScroll,
        viewportClassName: "max-h-56 overflow-y-auto overflow-x-hidden p-1 overscroll-contain select-none",
        viewportStyle: { maxHeight: "224px" },
        contentSignature: l.length,
        children: [
          d.topSpacer > 0 && /* @__PURE__ */ a(
            "div",
            {
              className: "agv-checklist-spacer-top pointer-events-none select-none",
              style: { height: `${d.topSpacer}px` },
              "aria-hidden": "true"
            }
          ),
          C.map((x) => {
            const i = u.has(x), h = k(S, x);
            return /* @__PURE__ */ E(
              "div",
              {
                onClick: () => v(x),
                className: "flex h-[28px] min-h-[28px] cursor-pointer select-none items-center gap-2 rounded-sm px-2 text-xs text-[var(--agv-text-main)] hover:bg-[var(--popup-item-hover-bg)]",
                children: [
                  /* @__PURE__ */ a(R, { checked: i }),
                  /* @__PURE__ */ a("span", { className: "truncate", children: h })
                ]
              },
              String(x)
            );
          }),
          d.bottomSpacer > 0 && /* @__PURE__ */ a(
            "div",
            {
              className: "agv-checklist-spacer-bottom pointer-events-none select-none",
              style: { height: `${d.bottomSpacer}px` },
              "aria-hidden": "true"
            }
          )
        ]
      }
    );
  }
);
ve.displayName = "AdvChecklistVirtualList";
function ne(l) {
  return l < 10 ? `0${l}` : String(l);
}
function Oe(l, u, v) {
  const k = /* @__PURE__ */ new Map(), S = [], b = /* @__PURE__ */ new Set();
  for (let i = 0; i < l.length; i++) {
    const h = l[i], s = Ve(h);
    if (!s) {
      const o = String(h).trim();
      o && !b.has(o) && (b.add(o), S.push(o));
      continue;
    }
    let r = k.get(s.year);
    r || (r = /* @__PURE__ */ new Map(), k.set(s.year, r));
    let e = r.get(s.month);
    if (e || (e = /* @__PURE__ */ new Map(), r.set(s.month, e)), !e.has(s.day)) {
      const o = ne(s.day), t = ne(s.month);
      e.set(s.day, {
        key: s.key,
        day: s.day,
        dayLabel: o,
        fullLabel: `${o}/${t}/${s.year}`
      });
    }
  }
  const N = Array.from(k.keys()).sort((i, h) => h - i), d = [], C = [];
  for (let i = 0; i < N.length; i++) {
    const h = N[i], s = String(h), r = !!u && s.includes(u), e = k.get(h), o = Array.from(e.keys()).sort((f, p) => f - p), t = [], y = [];
    for (let f = 0; f < o.length; f++) {
      const p = o[f], T = ne(p), F = `Tháng ${T}`, A = `${F} thang ${p} thang ${T} ${T}/${s} ${p}/${s} ${s}-${T}`.toLowerCase(), L = !!u && (A.includes(u) || H(A).includes(v)), w = e.get(p), M = Array.from(w.keys()).sort((V, D) => V - D), g = [], W = [];
      for (let V = 0; V < M.length; V++) {
        const D = w.get(M[V]);
        u && !r && !L && !(D.dayLabel.includes(u) || D.fullLabel.includes(u) || D.key.includes(u)) || (g.push(D), W.push(D.key), y.push(D.key), C.push(D.key));
      }
      g.length > 0 && t.push({
        key: `${s}-${T}`,
        year: h,
        month: p,
        label: F,
        days: g,
        dayKeys: W
      });
    }
    t.length > 0 && d.push({
      key: s,
      year: h,
      label: s,
      months: t,
      dayKeys: y,
      isDefaultExpanded: i === 0
    });
  }
  const x = u ? S.filter((i) => {
    const h = i.toLowerCase();
    return h.includes(u) || H(h).includes(v);
  }) : S;
  for (let i = 0; i < x.length; i++)
    C.push(x[i]);
  return { years: d, unparsed: x, matchingKeys: C };
}
const xe = ue.memo(
  ({
    years: l,
    unparsed: u,
    isSearching: v,
    selectedSet: k,
    onToggleMany: S,
    expandedMap: b,
    onToggleExpand: N,
    showBlanksInList: d
  }) => {
    const C = G(null), x = he(() => {
      const s = [];
      for (let r = 0; r < l.length; r++) {
        const e = l[r], o = v ? !0 : b[e.key] ?? e.isDefaultExpanded;
        if (s.push({ kind: "year", node: e, isExpanded: o }), !!o)
          for (let t = 0; t < e.months.length; t++) {
            const y = e.months[t], f = v ? !0 : !!b[y.key];
            if (s.push({ kind: "month", node: y, isExpanded: f }), !!f)
              for (let p = 0; p < y.days.length; p++)
                s.push({ kind: "day", node: y.days[p] });
          }
      }
      for (let r = 0; r < u.length; r++)
        s.push({ kind: "raw", value: u[r] });
      return s;
    }, [l, u, v, b]), i = fe({
      itemCount: x.length,
      itemHeight: 28,
      viewportRef: C,
      overscan: 6,
      threshold: 1,
      defaultViewportHeight: 224
    }), h = x.slice(i.startIndex, i.endIndex);
    return O(() => {
      v && i.resetScroll();
    }, [v, l.length]), x.length === 0 && !d ? /* @__PURE__ */ a("div", { className: "max-h-52 px-2 py-4 text-center text-xs italic text-[var(--agv-text-muted)]", children: "Không tìm thấy giá trị phù hợp" }) : /* @__PURE__ */ E(
      me,
      {
        viewportRef: C,
        onScroll: i.handleScroll,
        viewportClassName: "max-h-56 overflow-y-auto overflow-x-hidden p-1 overscroll-contain select-none",
        viewportStyle: { maxHeight: "224px" },
        contentSignature: x.length,
        children: [
          i.topSpacer > 0 && /* @__PURE__ */ a(
            "div",
            {
              className: "agv-checklist-spacer-top pointer-events-none select-none",
              style: { height: `${i.topSpacer}px` },
              "aria-hidden": "true"
            }
          ),
          h.map((s) => {
            if (s.kind === "year") {
              const { node: e, isExpanded: o } = s;
              let t = 0;
              for (let p = 0; p < e.dayKeys.length; p++)
                k.has(e.dayKeys[p]) && t++;
              const y = t > 0 && t === e.dayKeys.length, f = t > 0 && t < e.dayKeys.length;
              return /* @__PURE__ */ E(
                "div",
                {
                  onClick: () => S(e.dayKeys, !y),
                  className: "flex h-[28px] min-h-[28px] cursor-pointer select-none items-center gap-1 rounded-sm pl-1 pr-2 text-xs font-medium text-[var(--agv-text-main)] hover:bg-[var(--popup-item-hover-bg)]",
                  children: [
                    /* @__PURE__ */ a(
                      ce,
                      {
                        variant: "ghost",
                        size: "icon-sm",
                        onClick: (p) => {
                          p.stopPropagation(), N(e.key, e.isDefaultExpanded);
                        },
                        "aria-label": o ? `Thu gọn năm ${e.label}` : `Mở rộng năm ${e.label}`,
                        className: "rounded-sm",
                        children: /* @__PURE__ */ a(ie, { expanded: o, size: 14, spring: "snappy" })
                      }
                    ),
                    /* @__PURE__ */ a(R, { checked: y, indeterminate: f }),
                    /* @__PURE__ */ a("span", { className: "ml-1 truncate", children: e.label })
                  ]
                },
                `y:${e.key}`
              );
            }
            if (s.kind === "month") {
              const { node: e, isExpanded: o } = s;
              let t = 0;
              for (let p = 0; p < e.dayKeys.length; p++)
                k.has(e.dayKeys[p]) && t++;
              const y = t > 0 && t === e.dayKeys.length, f = t > 0 && t < e.dayKeys.length;
              return /* @__PURE__ */ E(
                "div",
                {
                  onClick: () => S(e.dayKeys, !y),
                  className: "flex h-[28px] min-h-[28px] cursor-pointer select-none items-center gap-1 rounded-sm pl-4 pr-2 text-xs text-[var(--agv-text-main)] hover:bg-[var(--popup-item-hover-bg)]",
                  children: [
                    /* @__PURE__ */ a(
                      ce,
                      {
                        variant: "ghost",
                        size: "icon-sm",
                        onClick: (p) => {
                          p.stopPropagation(), N(e.key, !1);
                        },
                        "aria-label": o ? `Thu gọn ${e.label}` : `Mở rộng ${e.label}`,
                        className: "rounded-sm",
                        children: /* @__PURE__ */ a(ie, { expanded: o, size: 14, spring: "snappy" })
                      }
                    ),
                    /* @__PURE__ */ a(R, { checked: y, indeterminate: f }),
                    /* @__PURE__ */ a("span", { className: "ml-1 truncate", children: e.label })
                  ]
                },
                `m:${e.key}`
              );
            }
            if (s.kind === "day") {
              const { node: e } = s, o = k.has(e.key);
              return /* @__PURE__ */ E(
                "div",
                {
                  onClick: () => S([e.key], !o),
                  className: "flex h-[28px] min-h-[28px] cursor-pointer select-none items-center gap-2 rounded-sm pl-[60px] pr-2 text-xs text-[var(--agv-text-main)] hover:bg-[var(--popup-item-hover-bg)]",
                  children: [
                    /* @__PURE__ */ a(R, { checked: o }),
                    /* @__PURE__ */ a("span", { className: "truncate", children: e.dayLabel })
                  ]
                },
                `d:${e.key}`
              );
            }
            const r = k.has(s.value);
            return /* @__PURE__ */ E(
              "div",
              {
                onClick: () => S([s.value], !r),
                className: "flex h-[28px] min-h-[28px] cursor-pointer select-none items-center gap-2 rounded-sm px-2 text-xs text-[var(--agv-text-main)] hover:bg-[var(--popup-item-hover-bg)]",
                children: [
                  /* @__PURE__ */ a(R, { checked: r }),
                  /* @__PURE__ */ a("span", { className: "truncate", children: s.value })
                ]
              },
              `r:${s.value}`
            );
          }),
          i.bottomSpacer > 0 && /* @__PURE__ */ a(
            "div",
            {
              className: "agv-checklist-spacer-bottom pointer-events-none select-none",
              style: { height: `${i.bottomSpacer}px` },
              "aria-hidden": "true"
            }
          )
        ]
      }
    );
  }
);
xe.displayName = "AdvChecklistDateTreeList";
const He = we((l, u) => {
  const {
    data: v,
    getRowItem: k,
    totalRowCount: S,
    getCellValue: b,
    getDistinctValues: N,
    columnDataTypes: d = {},
    distinctValuesCacheRef: C,
    surfaceTheme: x = Be.LIGHT,
    portalRoot: i,
    formatChecklistDisplay: h = (n, m) => String(m ?? ""),
    matchFilterValue: s,
    onApply: r,
    onClear: e,
    onActiveColChange: o
  } = l, [t, y] = B(null), [f, p] = B({ top: 0, left: 0 }), [T, F] = B(""), [A, L] = B(/* @__PURE__ */ new Set()), [w, M] = B(!1), [g, W] = B(null), [V, D] = B({}), X = G(d);
  X.current = d;
  const J = G(null);
  O(() => {
    o?.(t);
  }, [t, o]), O(() => () => {
    o?.(null);
  }, [o]), De(
    u,
    () => ({
      open: (n, m, c) => {
        if (y(n), p(m), F(""), D({}), W(c || null), Array.isArray(c?.selectedValues) && c.selectedValues.length > 0) {
          const _ = X.current[n] === U.DATE;
          L(
            _ ? new Set(
              c.selectedValues.map((le) => Te(le) || String(le).trim())
            ) : new Set(c.selectedValues)
          );
        } else
          L(/* @__PURE__ */ new Set());
        M(!!c?.includeBlanks);
      },
      close: () => {
        y(null);
      },
      updateCoords: (n) => {
        p(n);
      },
      isOpen: () => t !== null,
      isOpenFor: (n) => t === n,
      getActiveCol: () => t
    }),
    [t]
  ), O(() => {
    if (!t || f.anchorEl) return;
    const n = (m) => {
      const c = m.target;
      c && (J.current && J.current.contains(c) || c.closest && (c.closest(".agv-header-filter-btn") || c.closest("[data-checklist-trigger]")) || y(null));
    };
    return document.addEventListener("mousedown", n, !0), document.addEventListener("touchstart", n, !0), () => {
      document.removeEventListener("mousedown", n, !0), document.removeEventListener("touchstart", n, !0);
    };
  }, [t, f.anchorEl]);
  const Q = he(() => g ? Ie(g.op) || g.mode === Me.MULTI && (Array.isArray(g.multiValues) && g.multiValues.length > 0 || Array.isArray(g.multiRanges) && g.multiRanges.length > 0) ? !0 : typeof g.val == "string" && g.val.trim().length > 0 : !1, [g]);
  if (!t) return null;
  const se = N ? N(t) : ze(
    t,
    v || [],
    d[t],
    C,
    k,
    S,
    b
  ), Z = d && d[t] || "text", re = se.values || [], oe = Q && g ? {
    ...g,
    selectedValues: void 0,
    includeBlanks: void 0
  } : void 0, q = Q && s && g ? re.filter(
    (n) => s(n, g.op, g.val, Z, oe)
  ) : re, ye = !!se.hasBlanks && (!Q || !s || !g ? !0 : s("", g.op, g.val, Z, oe)), I = T.trim().toLowerCase(), z = I ? H(I) : "", ee = Z === U.DATE, j = ee ? Oe(q, I, z) : null, P = ee ? j.matchingKeys : I ? q.filter((n) => {
    const m = String(n).toLowerCase();
    if (m.includes(I) || H(m).includes(z)) return !0;
    const c = h(t, n).toLowerCase();
    return !!(c !== m && (c.includes(I) || H(c).includes(z)));
  }) : q, $ = ye && (!I || "(trống)".includes(I) || "trong".includes(z) || "rong".includes(z)), ke = A.size;
  let K = !1, Y = !1;
  P.length > 0 ? ke === 0 ? (K = !1, Y = $ && w) : (K = P.every((n) => A.has(n)) && (!$ || w), Y = !K && ($ && w || P.some((n) => A.has(n)))) : (K = $ && w, Y = !1);
  const be = () => {
    if (K) {
      const n = new Set(A);
      P.forEach((c) => n.delete(c)), L(n);
      const m = $ ? !1 : w;
      $ && M(!1), r(t, n, m);
    } else {
      const n = new Set(A);
      P.forEach((c) => n.add(c)), L(n);
      const m = $ ? !0 : w;
      $ && M(!0), r(t, n, m);
    }
  }, Se = (n, m) => {
    const c = new Set(A);
    for (let _ = 0; _ < n.length; _++)
      m ? c.add(n[_]) : c.delete(n[_]);
    L(c), r(t, c, w);
  }, Ce = (n, m) => {
    D((c) => ({
      ...c,
      [n]: !(c[n] ?? m)
    }));
  }, te = A.size > 0 || w, Ne = (n) => {
    n.stopPropagation(), L(/* @__PURE__ */ new Set()), M(!1), e(t);
  }, ae = /* @__PURE__ */ E(Ae, { children: [
    /* @__PURE__ */ a("div", { className: "border-b border-[var(--agv-border)] p-1.5", children: /* @__PURE__ */ E("div", { className: "agv-control agv-control-box relative flex items-center w-full h-[28px] min-h-[28px] px-2", children: [
      /* @__PURE__ */ a(Fe, { size: 14, className: "text-[var(--agv-text-muted)] mr-1.5 shrink-0" }),
      /* @__PURE__ */ a(
        "input",
        {
          name: "agv_checklist_search_no_autofill",
          ...Le,
          placeholder: "Tìm kiếm giá trị...",
          value: T,
          onChange: (n) => F(n.target.value),
          onKeyDown: (n) => {
            n.key === "Escape" && y(null);
          },
          className: "w-full bg-transparent border-none outline-none text-xs text-[var(--agv-text-main)] placeholder-[var(--agv-text-muted)]",
          autoFocus: !0
        }
      ),
      T && /* @__PURE__ */ a(
        "button",
        {
          type: "button",
          onClick: () => F(""),
          className: "agv-inline-clear-ghost p-0.5 shrink-0 mr-1",
          children: /* @__PURE__ */ a(Pe, { size: 10, strokeWidth: 2.5 })
        }
      ),
      /* @__PURE__ */ a(
        "button",
        {
          type: "button",
          onClick: te ? Ne : void 0,
          disabled: !te,
          className: `p-1 transition shrink-0 flex items-center justify-center rounded ${te ? "text-[var(--agv-danger)] hover:bg-[var(--agv-danger-bg)] cursor-pointer" : "text-[var(--agv-text-muted)] opacity-25 cursor-not-allowed"}`,
          children: /* @__PURE__ */ a(_e, { size: 13, strokeWidth: 2.2 })
        }
      )
    ] }) }),
    /* @__PURE__ */ E("div", { className: "border-b border-[var(--agv-border)] bg-[var(--agv-bg-popup)] p-1 text-xs", children: [
      /* @__PURE__ */ E(
        "div",
        {
          onClick: be,
          className: "flex min-h-[28px] cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1 text-[var(--agv-text-main)] hover:bg-[var(--popup-item-hover-bg)]",
          children: [
            /* @__PURE__ */ a(R, { checked: K, indeterminate: Y }),
            /* @__PURE__ */ a("span", { className: "font-medium text-[var(--agv-text-main)]", children: "(Tất cả)" })
          ]
        }
      ),
      $ && /* @__PURE__ */ E(
        "div",
        {
          onClick: () => {
            const n = !w;
            M(n), r(t, A, n);
          },
          className: "flex min-h-[28px] cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1 text-[var(--agv-text-main)] hover:bg-[var(--popup-item-hover-bg)]",
          children: [
            /* @__PURE__ */ a(R, { checked: w }),
            /* @__PURE__ */ a("span", { className: "italic text-[var(--agv-text-muted)]", children: "(Trống)" })
          ]
        }
      )
    ] }),
    ee && j ? /* @__PURE__ */ a(
      xe,
      {
        years: j.years,
        unparsed: j.unparsed,
        isSearching: I.length > 0,
        selectedSet: A,
        onToggleMany: Se,
        expandedMap: V,
        onToggleExpand: Ce,
        showBlanksInList: $
      }
    ) : /* @__PURE__ */ a(
      ve,
      {
        items: P,
        selectedSet: A,
        onToggle: (n) => {
          const m = new Set(A);
          m.has(n) ? m.delete(n) : m.add(n), L(m), r(t, m, w);
        },
        formatDisplay: h,
        colKey: t,
        showBlanksInList: $
      }
    )
  ] });
  return f.anchorEl ? /* @__PURE__ */ a(
    $e,
    {
      isOpen: !!t,
      anchorEl: f.anchorEl,
      onClose: () => y(null),
      placement: "bottom-end",
      showArrow: !0,
      offset: 10,
      width: 270,
      minWidth: 240,
      maxWidth: "90vw",
      paddingClassName: "p-0",
      contentClassName: "text-xs",
      zIndex: 99999999,
      theme: x,
      ignoreClickOutsideSelectors: ".agv-header-filter-btn, [data-checklist-trigger], [data-agv-popover-trigger='true']",
      children: /* @__PURE__ */ a("div", { className: "flex max-h-[calc(100vh-80px)] flex-col overflow-hidden rounded-md text-xs select-none", children: ae })
    }
  ) : Ee(
    /* @__PURE__ */ a(
      "div",
      {
        ref: J,
        style: {
          position: "fixed",
          ...f.isFlipUp ? { bottom: `${f.bottom}px`, top: "auto" } : { top: `${f.top}px`, bottom: "auto" },
          left: `${f.left}px`,
          zIndex: 99999999,
          backgroundColor: "var(--popup-background)",
          borderColor: "var(--popup-border)",
          boxShadow: "var(--popup-shadow)",
          color: "var(--agv-text-main)",
          width: "270px",
          maxWidth: "90vw",
          maxHeight: "calc(100vh - 20px)",
          display: "flex",
          flexDirection: "column"
        },
        className: `agv-checklist-filter-popup agv-popup-panel flex flex-col rounded-md border text-xs overflow-hidden select-none ${f.isFlipUp ? "agv-spring-up" : "agv-spring-down"} ${Re(
          x
        )}`,
        "data-theme": x,
        "data-agv-popup": "true",
        onClick: (n) => n.stopPropagation(),
        onWheel: (n) => n.stopPropagation(),
        children: ae
      }
    ),
    i || (typeof document < "u" ? document.body : null)
  );
});
He.displayName = "AdvChecklistFilterPopup";
export {
  He as AdvChecklistFilterPopup,
  ve as AdvChecklistVirtualList,
  ze as getDistinctColumnValues
};
