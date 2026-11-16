import { jsxs as Me, jsx as N } from "react/jsx-runtime";
import { useState as m, useRef as y, useCallback as Te, useMemo as J, useEffect as $e, useLayoutEffect as Ve, Suspense as dt, startTransition as ze, lazy as pt } from "react";
import { createPortal as ht } from "react-dom";
import { n as Ie, c as Xe, a as Je, s as gt, u as Ze, g as Be, b as et, d as tt } from "./enterpriseEditorUtils-DJeTtQuh.js";
import { N as nt, P as mt, C as rt, g as ot, i as st } from "./AdvButton-B7j0puyb.js";
import { A as xt } from "./AdvOverlayScroll-CipuwW1l.js";
import { u as yt } from "./useVirtualList-CH5KMFFG.js";
import { g as it, S as vt } from "./common-Bjggt86Z.js";
import { C as St } from "./check-KNrOhvEC.js";
import { b as x, j as je } from "./gridFormatUtils-wCKPmlrt.js";
const Ye = 30, Pt = ({
  value: P,
  defaultValue: Pe = "",
  onChange: j,
  options: k = [],
  allowCustomInput: g = !0,
  defaultOpen: se = !1,
  autoFocus: he = !1,
  placeholder: Le = "Nhập hoặc chọn...",
  size: Ae = "sm",
  disabled: v = !1,
  className: Ne = "",
  style: Fe = {},
  theme: ge = "",
  onClose: ie
}) => {
  const le = P !== void 0, [C, De] = m(le ? P : Pe), [T, u] = m(!1), [D, ae] = m(""), p = le && !T ? P : C, [i, Z] = m(se), [Ce, o] = m(!1), [l, me] = m({ top: 0, left: 0, width: 200, maxHeight: 220 }), H = y(null), ce = y(null), ee = y(null), te = y(null), z = y("init"), ne = y(!1), K = Te((e) => {
    ne.current !== e && (ne.current = e, o(e));
  }, []), S = J(() => k.map((e) => typeof e == "string" ? { value: e, label: e } : e), [k]), M = J(() => {
    const e = /* @__PURE__ */ new Map();
    for (let n = 0; n < S.length; n++) {
      const a = S[n];
      e.has(a.value) || e.set(a.value, n), e.has(a.label) || e.set(a.label, n);
    }
    return e;
  }, [S]), Y = le ? P : C, xe = Y !== void 0 ? M.get(Y) ?? -1 : -1, ye = xe >= 0 ? S[xe] : null, ve = xe >= 0 ? xe : 0, Se = S[ve] || null, I = !g, He = I ? i ? D : ye ? ye.label : p : T ? C : Se && (Se.value === p || Se.label === p) ? Se.label : p, Ke = I && i && ye ? ye.label : Le, [w, R] = m(ve);
  $e(() => {
    le && P !== void 0 && !T && De(P);
  }, [le, P, T]), Ve(() => {
    if (i && !T) {
      const e = p !== void 0 ? M.get(p) ?? -1 : -1;
      z.current = "init", R(e >= 0 ? e : 0);
    }
  }, [i, p, M, T]);
  const Re = y(null), h = J(() => {
    const e = I ? D : T ? p : "";
    if (!e || !e.trim()) return S;
    const n = Ie(e);
    if (!n) return S;
    let a = Re.current;
    if (!a || a.optionsRef !== S) {
      const b = S.length, Q = new Array(b), oe = new Array(b);
      for (let G = 0; G < b; G++) {
        const Ue = S[G];
        Q[G] = Ie(Ue.label), oe[G] = Ie(Ue.value);
      }
      a = { optionsRef: S, labels: Q, values: oe }, Re.current = a;
    }
    const E = [];
    for (let b = 0; b < S.length; b++)
      (a.labels[b].includes(n) || a.values[b].includes(n)) && E.push(S[b]);
    return E;
  }, [S, I, D, T, p]), _ = Te(() => {
    if (H.current) {
      const e = Xe(H.current, 220, 180);
      me((n) => Je(n, e) ? n : e);
    }
  }, []);
  Ve(() => {
    se && H.current && _();
  }, [se, _]);
  const O = Math.max(118, l.maxHeight - 2), s = yt({
    itemCount: h.length,
    itemHeight: Ye,
    viewportRef: ee,
    overscan: 6,
    threshold: 40,
    enabled: i,
    defaultViewportHeight: O
  });
  Ve(() => {
    if (!i || z.current === "pointer") return;
    if (s.isVirtualized) {
      s.scrollToIndex(w, 4, 4);
      return;
    }
    const e = ee.current;
    if (!e) return;
    const n = e.querySelector(`[data-combo-idx="${w}"]`);
    n && gt(e, n, 4, 4);
  }, [i, w, h.length, s.isVirtualized, s.scrollToIndex]), $e(() => {
    he && te.current && (te.current.focus({ preventScroll: !0 }), te.current.select());
  }, [he]);
  const B = Te(() => {
    Z(!1), u(!1), ae(""), K(!1), ie?.();
  }, [K, ie]);
  Ze(
    i,
    () => {
      T && g && j?.(C), B();
    },
    _,
    H,
    ce
  );
  const we = (e) => {
    De(e), j?.(e), B();
  }, be = (e) => {
    const n = e.target.value;
    if (I) {
      ae(n), z.current = "keyboard", K(n.trim().length > 0), R(0), s.resetScroll(), i || (_(), Z(!0));
      return;
    }
    De(n), u(!0), z.current = "keyboard", K(n.trim().length > 0), R(0), s.resetScroll(), i || (_(), Z(!0));
  }, q = () => {
    T && g && (j?.(C), u(!1));
  }, re = (e) => {
    if (v) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "PageDown" || e.key === "PageUp" || I && !D && (e.key === "Home" || e.key === "End")) {
      if (e.preventDefault(), i) {
        if (h.length > 0) {
          const a = ee.current, E = a?.querySelector("[data-combo-idx]"), b = et(
            a?.clientHeight || 212,
            s.isVirtualized ? Ye : E?.offsetHeight || 28,
            6
          );
          z.current = "keyboard", K(!0), R((Q) => {
            const oe = tt(e.key, Q, h.length, b);
            return oe !== null ? oe : Q;
          });
        }
      } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        _(), z.current = "init", u(!1), ae(""), K(!0), Z(!0);
        const a = p !== void 0 ? M.get(p) ?? -1 : -1;
        R(a >= 0 ? a : 0);
      }
      return;
    }
    if (e.key === "Enter") {
      if (i && h.length > 0) {
        e.preventDefault();
        const a = w >= 0 && w < h.length ? w : 0, E = h[a];
        E && we(E.value);
      } else i && I ? (e.preventDefault(), B()) : (T && g && (j?.(C), u(!1)), K(!1), i && Z(!1));
      return;
    }
    if (e.key === "Tab" && i) {
      T && g && j?.(C), B();
      return;
    }
    if (e.key === "Escape") {
      i ? (e.preventDefault(), B()) : ie?.();
      return;
    }
  }, Oe = () => {
    if (!v) {
      if (!i) {
        _(), z.current = "init";
        const e = p !== void 0 ? M.get(p) ?? -1 : -1;
        R(e >= 0 ? e : 0), u(!1), ae(""), K(!1), Z(!0);
      }
      te.current?.focus({ preventScroll: !0 });
    }
  }, Ee = (e, n, a) => {
    const E = e.value === p || e.label === p;
    return /* @__PURE__ */ Me(
      "div",
      {
        "data-combo-idx": n,
        onClick: (Q) => {
          Q.stopPropagation(), we(e.value);
        },
        className: `agv-popup-item justify-between ${a ? "h-[28px] min-h-[28px] mb-[2px]" : ""} ${E ? "is-selected" : Ce && n === w ? "is-highlighted" : ""}`.trim(),
        children: [
          /* @__PURE__ */ N("span", { className: "truncate", children: e.label }),
          E && /* @__PURE__ */ N(St, { size: 13, strokeWidth: 2.5, className: "ml-1.5 shrink-0" })
        ]
      },
      e.value
    );
  }, _e = ge ? it(ge) : "";
  return /* @__PURE__ */ Me(
    "div",
    {
      ref: H,
      "data-agv-trigger": "true",
      "data-theme": ge || void 0,
      "data-state": i ? "open" : "closed",
      "aria-expanded": i,
      "aria-disabled": v || void 0,
      style: {
        ...Be(),
        ...Fe
      },
      onClick: Oe,
      className: `agv-comboboxedit-wrapper relative inline-flex items-center ${rt} ${ot()} ${st(
        Ae
      )} w-full ${i ? "is-open" : ""} ${v ? "opacity-50 pointer-events-none" : "cursor-text"} ${_e} ${Ne}`.trim(),
      children: [
        /* @__PURE__ */ N(
          "input",
          {
            ref: te,
            type: "text",
            disabled: v,
            value: He,
            onChange: be,
            onBlur: q,
            onKeyDown: re,
            placeholder: Ke,
            ...nt,
            className: `agv-comboboxedit-input w-full h-full bg-transparent border-0 px-2.5 text-foreground outline-none placeholder:text-muted-foreground ${Ae === "md" ? "text-sm" : "text-xs"}`
          }
        ),
        i && ht(
          /* @__PURE__ */ N(
            "div",
            {
              ref: ce,
              "data-theme": ge || void 0,
              style: {
                position: "fixed",
                ...l.isFlipUp ? { bottom: `${l.bottom}px`, top: "auto" } : { top: `${l.top}px`, bottom: "auto" },
                left: `${l.left}px`,
                width: `${l.width}px`,
                maxHeight: `${l.maxHeight}px`,
                zIndex: 99999999,
                ...Be()
              },
              className: `agv-comboboxedit-dropdown ${mt} overflow-hidden select-none text-xs ${l.isFlipUp ? "agv-spring-up" : "agv-spring-down"} ${_e}`,
              "data-agv-popup": "true",
              onMouseMove: () => {
                ne.current && (z.current = "pointer", K(!1));
              },
              onMouseDown: (e) => e.stopPropagation(),
              children: /* @__PURE__ */ N(
                xt,
                {
                  viewportRef: ee,
                  onScroll: s.handleScroll,
                  viewportClassName: "overflow-y-auto overflow-x-hidden p-1",
                  viewportStyle: { maxHeight: `${O}px` },
                  contentSignature: `${h.length}:${s.startIndex}:${s.endIndex}`,
                  children: h.length === 0 ? /* @__PURE__ */ N("div", { className: "px-3 py-2 text-center text-xs text-muted-foreground select-none", children: "Không tìm thấy kết quả" }) : s.isVirtualized ? /* @__PURE__ */ N("div", { style: { height: `${s.totalHeight}px`, position: "relative" }, children: /* @__PURE__ */ N("div", { style: { transform: `translate3d(0, ${s.offsetY}px, 0)` }, children: h.slice(s.startIndex, s.endIndex).map(
                    (e, n) => Ee(e, s.startIndex + n, !0)
                  ) }) }) : /* @__PURE__ */ N("div", { className: "flex flex-col gap-0.5", children: h.map((e, n) => Ee(e, n, !1)) })
                }
              )
            }
          ),
          document.body
        )
      ]
    }
  );
}, wt = pt(
  () => import("./AdvSearchLookUpPopup-CvFIF9zg.js")
), Ge = () => {
  import("./AdvSearchLookUpPopup-CvFIF9zg.js");
}, bt = [
  { id: x.CONTAINS, label: "Có chứa" },
  { id: x.STARTS_WITH, label: "Bắt đầu bằng" },
  { id: x.ENDS_WITH, label: "Kết thúc bằng" },
  { id: x.EQUALS, label: "Bằng" },
  { id: x.NOT_EQUALS, label: "Không bằng" },
  { id: x.NOT_CONTAINS, label: "Không chứa" },
  { id: x.IS_EMPTY, label: "Trống" },
  { id: x.IS_NOT_EMPTY, label: "Không trống" }
];
function Dt({
  value: P,
  defaultValue: Pe,
  onChange: j,
  dataSource: k = [],
  valueMember: g,
  displayMember: se,
  columns: he = [],
  placeholder: Le = "Tìm kiếm hoặc chọn...",
  size: Ae = "sm",
  disabled: v = !1,
  dropdownWidth: Ne = 460,
  className: Fe = "",
  style: ge = {},
  theme: ie = vt.LIGHT,
  searchPlaceholder: le = "Tìm kiếm nhanh trong danh mục...",
  searchFields: C,
  showFooterCount: De = !0,
  showFilterRow: T = !1,
  multiSelect: u = !1,
  defaultOpen: D = !1,
  autoFocus: ae = !1,
  onClose: p
}) {
  const i = P !== void 0, [Z, Ce] = m(
    i ? P : Pe !== void 0 ? Pe : u ? [] : void 0
  ), o = i ? P : Z, [l, me] = m(D), [H, ce] = m(""), [ee, te] = m({}), [z, ne] = m(null), [K, S] = m(T), [M, Y] = m(0), [xe, ye] = m(!1), [ve, Se] = m({ top: 0, left: 0, width: Ne, maxHeight: 360 }), I = y(null), He = y(null), Ke = y(null), w = y(null), R = y(null), Re = y(null), h = y("init"), _ = y(!1), O = (t) => {
    _.current !== t && (_.current = t, ye(t));
  }, s = J(() => {
    if (u) {
      const t = Array.isArray(o) ? o : o != null && o !== "" ? [o] : [];
      return new Set(t.map(String));
    }
    return new Set(o != null && o !== "" ? [String(o)] : []);
  }, [o, u]), [B, we] = m(
    () => D ? new Set(s) : /* @__PURE__ */ new Set()
  ), be = J(() => {
    const t = /* @__PURE__ */ new Map();
    for (let r = 0; r < k.length; r++) {
      const c = k[r], U = String(c[g]);
      t.has(U) || t.set(U, c);
    }
    return t;
  }, [k, g]), q = J(() => {
    if (u) {
      const c = [];
      return s.forEach((U) => {
        const V = be.get(U);
        V && c.push(V);
      }), c;
    }
    const t = o != null && o !== "" ? String(o) : "", r = t ? be.get(t) : void 0;
    return r ? [r] : [];
  }, [be, s, o, u]), re = Te(() => {
    if (I.current) {
      const t = Xe(I.current, 360, Ne);
      Se((r) => Je(r, t) ? r : t);
    }
  }, [Ne]);
  Ve(() => {
    D && I.current && re();
  }, [D, re]);
  const Oe = Te(() => {
    me(!1), we(/* @__PURE__ */ new Set()), ce(""), ne(null), O(!1), p?.();
  }, [p]), Ee = Te(() => {
    if (v) return;
    ce("");
    const t = new Set(s);
    we(t), h.current = "init", O(!1), Y(0), re(), me(!0);
  }, [v, s, re]), _e = () => {
    v || (l || Ee(), w.current?.focus({ preventScroll: !0 }));
  };
  Ze(
    l,
    Oe,
    re,
    I,
    He,
    Ke
  ), $e(() => {
    (ae || D) && w.current && w.current.focus({ preventScroll: !0 });
  }, [ae, D]), $e(() => {
    l && w.current && document.activeElement !== w.current && w.current.focus({ preventScroll: !0 });
  }, [l]);
  const e = y(null), n = J(() => {
    const t = Ie(H.trim()), r = Object.entries(ee).filter(([d, f]) => f ? je(f.op) ? !0 : !!(f.val && f.val.trim().length > 0) : !1);
    if (!t && r.length === 0 && B.size === 0)
      return k;
    const c = (d) => {
      let f = e.current;
      (!f || f.dataSource !== k) && (f = { dataSource: k, byField: /* @__PURE__ */ new Map() }, e.current = f);
      let A = f.byField.get(d);
      if (!A) {
        const W = k.length;
        A = new Array(W);
        for (let $ = 0; $ < W; $++)
          A[$] = Ie(String(k[$][d] ?? ""));
        f.byField.set(d, A);
      }
      return A;
    }, V = (t ? (C && C.length > 0 ? C : he.map((d) => d.key)).map(String) : []).map((d) => c(d)), ue = r.map(([d, f]) => ({
      colKey: d,
      op: f.op,
      colQ: Ie(f.val?.trim() || ""),
      normCol: je(f.op) ? null : c(d)
    })), L = B.size > 0, X = [], F = [];
    for (let d = 0; d < k.length; d++) {
      const f = k[d];
      if (t) {
        let A = !1;
        for (let W = 0; W < V.length; W++)
          if (V[W][d].includes(t)) {
            A = !0;
            break;
          }
        if (!A) continue;
      }
      if (ue.length > 0) {
        let A = !0;
        for (let W = 0; W < ue.length; W++) {
          const $ = ue[W];
          if ($.op === x.IS_EMPTY) {
            const pe = f[$.colKey];
            if (!(pe == null || String(pe).trim() === "")) {
              A = !1;
              break;
            }
            continue;
          }
          if ($.op === x.IS_NOT_EMPTY) {
            const pe = f[$.colKey];
            if (!(pe != null && String(pe).trim() !== "")) {
              A = !1;
              break;
            }
            continue;
          }
          const fe = $.colQ;
          if (!fe) continue;
          const ke = $.normCol[d];
          let de = !0;
          switch ($.op) {
            case x.EQUALS:
              de = ke === fe;
              break;
            case x.NOT_EQUALS:
              de = ke !== fe;
              break;
            case x.STARTS_WITH:
              de = ke.startsWith(fe);
              break;
            case x.ENDS_WITH:
              de = ke.endsWith(fe);
              break;
            case x.NOT_CONTAINS:
              de = !ke.includes(fe);
              break;
            case x.CONTAINS:
            default:
              de = ke.includes(fe);
              break;
          }
          if (!de) {
            A = !1;
            break;
          }
        }
        if (!A) continue;
      }
      L && B.has(String(f[g])) ? X.push(f) : F.push(f);
    }
    return X.length > 0 ? [...X, ...F] : F;
  }, [k, H, C, he, ee, B, g]);
  $e(() => {
    if (l && !u && !H.trim() && o !== void 0 && o !== null && o !== "") {
      const t = String(o), r = n.findIndex((c) => String(c[g]) === t);
      r >= 0 && Y(r);
    }
  }, [l, o, g, u, n, H]);
  const a = s.size > 0, E = J(() => !u || n.length === 0 || s.size < n.length ? !1 : n.every((t) => s.has(String(t[g]))), [u, n, s, g]), b = (t) => {
    const r = t[g];
    i || Ce(r), j?.(r, t), ce(""), O(!1), ne(null), me(!1), p?.();
  }, Q = (t, r) => {
    r?.stopPropagation();
    const c = t[g], U = String(c), V = Array.isArray(o) ? [...o] : o != null && o !== "" ? [o] : [], ue = V.some((F) => String(F) === U);
    let L;
    ue ? L = V.filter((F) => String(F) !== U) : L = [...V, c], i || Ce(L);
    const X = [];
    for (let F = 0; F < L.length; F++) {
      const d = be.get(String(L[F]));
      d && X.push(d);
    }
    j?.(L, X);
  }, oe = (t) => {
    t.stopPropagation(), a && (i || Ce([]), j?.([], []));
  }, G = () => {
    R.current && R.current.scrollTop > 0 && (R.current.scrollTop = 0);
  }, Ue = (t) => {
    const r = t.target.value;
    ce(r), l || (we(new Set(s)), re(), me(!0)), h.current = "keyboard", O(r.trim().length > 0), G(), ze(() => {
      Y(0);
    });
  }, lt = (t, r) => {
    h.current = "keyboard", O(r.trim().length > 0), G(), ze(() => {
      te((c) => ({
        ...c,
        [t]: {
          op: c[t]?.op || x.CONTAINS,
          val: r
        }
      })), Y(0);
    });
  }, at = (t, r) => {
    h.current = "keyboard", O(!1), G(), ze(() => {
      te((c) => ({
        ...c,
        [t]: {
          val: c[t]?.val || "",
          op: r
        }
      })), ne(null), Y(0);
    });
  }, qe = (t) => {
    if (t.key === "ArrowDown" || t.key === "ArrowUp" || t.key === "PageDown" || t.key === "PageUp") {
      if (t.preventDefault(), n.length > 0) {
        const r = R.current, c = r?.querySelector("tbody tr[data-lookup-idx]"), U = n.length >= 40 ? 32 : c?.offsetHeight || 32, V = r ? Math.max(U, r.clientHeight - (Re.current?.offsetHeight || 0)) : 224, ue = et(V, U, 6);
        h.current = "keyboard", O(!0), Y((L) => {
          const X = tt(t.key, L, n.length, ue);
          return X !== null ? X : L;
        });
      }
      return;
    }
    if (t.key === "Escape") {
      t.preventDefault(), Oe();
      return;
    }
  }, ct = (t) => {
    if (!v) {
      if (t.key === "ArrowDown" || t.key === "ArrowUp" || t.key === "PageDown" || t.key === "PageUp" || t.key === "Escape") {
        if (!l) {
          (t.key === "ArrowDown" || t.key === "ArrowUp") && (t.preventDefault(), Ee(), O(!0));
          return;
        }
        qe(t);
        return;
      }
      if (t.key === "Tab") {
        l && Oe();
        return;
      }
      if (t.key === "Enter" && l) {
        if (t.preventDefault(), n.length > 0) {
          const r = M >= 0 && M < n.length ? M : 0, c = n[r];
          u ? Q(c) : b(c);
        }
        return;
      }
    }
  }, Qe = it(ie), ut = J(() => u ? q.length === 0 ? "" : q.length === 1 ? String(q[0][se] ?? "") : `Đã chọn ${q.length} mục` : q.length > 0 ? String(q[0][se] ?? "") : "", [u, q, se]), We = u && q.length > 0 && !v, ft = Ae === "md" ? "text-sm" : "text-xs";
  return /* @__PURE__ */ Me(
    "div",
    {
      ref: I,
      "data-agv-trigger": "true",
      "data-theme": ie || void 0,
      "data-state": l ? "open" : "closed",
      "aria-expanded": l,
      "aria-disabled": v || void 0,
      style: {
        ...Be(),
        ...ge
      },
      onMouseEnter: Ge,
      onFocus: Ge,
      onClick: _e,
      className: `agv-searchlookupedit-wrapper relative inline-flex items-center ${rt} ${ot()} ${st(
        Ae
      )} w-full ${l ? "is-open" : ""} ${v ? "opacity-50 pointer-events-none" : "cursor-text"} ${Qe} ${Fe}`.trim(),
      children: [
        /* @__PURE__ */ N(
          "input",
          {
            ref: w,
            type: "text",
            disabled: v,
            value: l ? H : ut,
            onChange: Ue,
            onKeyDown: ct,
            placeholder: l ? le : Le,
            ...nt,
            className: `agv-searchlookupedit-input flex-1 min-w-0 h-full bg-transparent border-0 pl-2.5 ${We ? "pr-0.5" : "pr-2.5"} text-foreground outline-none truncate placeholder:text-muted-foreground ${ft} ${v ? "" : l ? "cursor-text" : "cursor-pointer"}`
          }
        ),
        We && /* @__PURE__ */ N(
          "button",
          {
            type: "button",
            tabIndex: -1,
            "aria-label": "Xóa tất cả lựa chọn",
            onClick: oe,
            className: "agv-inline-clear-destructive w-6 h-full shrink-0 text-sm leading-none",
            children: "×"
          }
        ),
        l && (ve.top > 0 || (ve.bottom ?? 0) > 0) && /* @__PURE__ */ N(dt, { fallback: null, children: /* @__PURE__ */ N(
          wt,
          {
            theme: ie,
            themeClass: Qe,
            coords: ve,
            multiSelect: u,
            columns: he,
            hasAnySelection: a,
            isAllFilteredSelected: E,
            isFilterRowVisible: K,
            filterStates: ee,
            filterOperators: bt,
            filteredData: n,
            valueMember: g,
            selectedKeysSet: s,
            isKeyboardNav: xe,
            highlightedIndex: M,
            activeOpMenuCol: z,
            dropdownRef: He,
            opMenuRef: Ke,
            tableBodyRef: R,
            theadRef: Re,
            isKeyboardNavRef: _,
            navSourceRef: h,
            setKeyboardNavActive: O,
            setActiveOpMenuCol: ne,
            handleListNavigationKeyDown: qe,
            handleClearMultiAll: oe,
            handleFilterRowChange: lt,
            handleFilterOpChange: at,
            handleToggleMultiRow: Q,
            handleSelectSingleRow: b
          }
        ) })
      ]
    }
  );
}
export {
  Pt as A,
  bt as L,
  Dt as a
};
