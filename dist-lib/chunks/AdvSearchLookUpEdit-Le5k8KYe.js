import { jsxs as Ze, jsx as O } from "react/jsx-runtime";
import { useState as T, useRef as C, useCallback as Ce, useMemo as M, useEffect as Ne, useLayoutEffect as Fe, Suspense as Nt, startTransition as Je, lazy as Ct } from "react";
import { createPortal as $t } from "react-dom";
import { n as $e, c as ct, a as ft, s as Kt, u as ut, g as Me, b as dt, d as pt } from "./enterpriseEditorUtils-DJeTtQuh.js";
import { N as ht, P as Rt, i as gt, g as yt } from "./AdvButton-Ck5SixaL.js";
import { A as Ot } from "./AdvOverlayScroll-CipuwW1l.js";
import { u as Et } from "./useVirtualList-CH5KMFFG.js";
import { g as xt, S as Pt } from "./common-29M8PlVv.js";
import { C as Dt } from "./check-KNrOhvEC.js";
import { b as A, j as it } from "./gridFormatUtils-wCKPmlrt.js";
const lt = 30, Yt = ({
  id: ze,
  value: j,
  defaultValue: He = "",
  onChange: L,
  options: m = [],
  allowCustomInput: h = !0,
  defaultOpen: ce = !1,
  autoFocus: E = !1,
  placeholder: Be = "Nhập hoặc chọn...",
  size: Ke = "sm",
  variant: ne = "default",
  leadingIcon: fe,
  disabled: $ = !1,
  className: Re = "",
  style: je = {},
  theme: Se = "",
  onClose: ue,
  invalid: qe,
  "aria-invalid": Qe,
  "aria-describedby": We,
  "aria-errormessage": Ye
}) => {
  const Ve = !!(qe || Qe), X = j !== void 0, [re, Oe] = T(X ? j : He), [a, u] = T(!1), [q, de] = T(""), y = X && !a ? j : re, [c, P] = T(ce), [Ge, pe] = T(!1), [n, S] = T({ top: 0, left: 0, width: 200, maxHeight: 220 }), F = C(null), oe = C(null), Q = C(null), ee = C(null), W = C("init"), Ee = C(!1), I = Ce((t) => {
    Ee.current !== t && (Ee.current = t, pe(t));
  }, []), N = M(() => m.map((t) => typeof t == "string" ? { value: t, label: t } : t), [m]), ke = M(() => {
    const t = /* @__PURE__ */ new Map();
    for (let s = 0; s < N.length; s++) {
      const f = N[s];
      t.has(f.value) || t.set(f.value, s), t.has(f.label) || t.set(f.label, s);
    }
    return t;
  }, [N]), he = X ? j : re, Y = he !== void 0 ? ke.get(he) ?? -1 : -1, be = Y >= 0 ? N[Y] : null, _e = Y >= 0 ? Y : 0, se = N[_e] || null, te = !h, ge = te ? c ? q : be ? be.label : y : a ? re : se && (se.value === y || se.label === y) ? se.label : y, Ue = te && c && be ? be.label : Be, [J, D] = T(_e);
  Ne(() => {
    X && j !== void 0 && !a && Oe(j);
  }, [X, j, a]), Fe(() => {
    if (c && !a) {
      const t = y !== void 0 ? ke.get(y) ?? -1 : -1;
      W.current = "init", D(t >= 0 ? t : 0);
    }
  }, [c, y, ke, a]);
  const ie = C(null), H = M(() => {
    const t = te ? q : a ? y : "";
    if (!t || !t.trim()) return N;
    const s = $e(t);
    if (!s) return N;
    let f = ie.current;
    if (!f || f.optionsRef !== N) {
      const K = N.length, x = new Array(K), ae = new Array(K);
      for (let xe = 0; xe < K; xe++) {
        const De = N[xe];
        x[xe] = $e(De.label), ae[xe] = $e(De.value);
      }
      f = { optionsRef: N, labels: x, values: ae }, ie.current = f;
    }
    const z = [];
    for (let K = 0; K < N.length; K++)
      (f.labels[K].includes(s) || f.values[K].includes(s)) && z.push(N[K]);
    return z;
  }, [N, te, q, a, y]), V = Ce(() => {
    if (F.current) {
      const t = ct(F.current, 220, 180);
      S((s) => ft(s, t) ? s : t);
    }
  }, []);
  Fe(() => {
    ce && F.current && V();
  }, [ce, V]);
  const Te = Math.max(118, n.maxHeight - 2), l = Et({
    itemCount: H.length,
    itemHeight: lt,
    viewportRef: Q,
    overscan: 6,
    threshold: 40,
    enabled: c,
    defaultViewportHeight: Te
  });
  Fe(() => {
    if (!c || W.current === "pointer") return;
    if (l.isVirtualized) {
      l.scrollToIndex(J, 4, 4);
      return;
    }
    const t = Q.current;
    if (!t) return;
    const s = t.querySelector(`[data-combo-idx="${J}"]`);
    s && Kt(t, s, 4, 4);
  }, [c, J, H.length, l.isVirtualized, l.scrollToIndex]), Ne(() => {
    E && ee.current && (ee.current.focus({ preventScroll: !0 }), ee.current.select());
  }, [E]);
  const b = Ce(() => {
    P(!1), u(!1), de(""), I(!1), ue?.();
  }, [I, ue]);
  ut(
    c,
    () => {
      a && h && L?.(re), b();
    },
    V,
    F,
    oe
  );
  const le = (t) => {
    Oe(t), L?.(t), b();
  }, _ = (t) => {
    const s = t.target.value;
    if (te) {
      de(s), W.current = "keyboard", I(s.trim().length > 0), D(0), l.resetScroll(), c || (V(), P(!0));
      return;
    }
    Oe(s), u(!0), W.current = "keyboard", I(s.trim().length > 0), D(0), l.resetScroll(), c || (V(), P(!0));
  }, Le = () => {
    a && h && (L?.(re), u(!1));
  }, Ae = (t) => {
    if ($) return;
    if (t.key === "ArrowDown" || t.key === "ArrowUp" || t.key === "PageDown" || t.key === "PageUp" || te && !q && (t.key === "Home" || t.key === "End")) {
      if (t.preventDefault(), c) {
        if (H.length > 0) {
          const f = Q.current, z = f?.querySelector("[data-combo-idx]"), K = dt(
            f?.clientHeight || 212,
            l.isVirtualized ? lt : z?.offsetHeight || 28,
            6
          );
          W.current = "keyboard", I(!0), D((x) => {
            const ae = pt(t.key, x, H.length, K);
            return ae !== null ? ae : x;
          });
        }
      } else if (t.key === "ArrowDown" || t.key === "ArrowUp") {
        V(), W.current = "init", u(!1), de(""), I(!0), P(!0);
        const f = y !== void 0 ? ke.get(y) ?? -1 : -1;
        D(f >= 0 ? f : 0);
      }
      return;
    }
    if (t.key === "Enter") {
      if (c && H.length > 0) {
        t.preventDefault();
        const f = J >= 0 && J < H.length ? J : 0, z = H[f];
        z && le(z.value);
      } else c && te ? (t.preventDefault(), b()) : (a && h && (L?.(re), u(!1)), I(!1), c && P(!1));
      return;
    }
    if (t.key === "Tab" && c) {
      a && h && L?.(re), b();
      return;
    }
    if (t.key === "Escape") {
      c ? (t.preventDefault(), b()) : ue?.();
      return;
    }
  }, Pe = () => {
    if (!$) {
      if (!c) {
        V(), W.current = "init";
        const t = y !== void 0 ? ke.get(y) ?? -1 : -1;
        D(t >= 0 ? t : 0), u(!1), de(""), I(!1), P(!0);
      }
      ee.current?.focus({ preventScroll: !0 });
    }
  }, ye = (t, s, f) => {
    const z = t.value === y || t.label === y;
    return /* @__PURE__ */ Ze(
      "div",
      {
        "data-combo-idx": s,
        onClick: (x) => {
          x.stopPropagation(), le(t.value);
        },
        className: `agv-popup-item justify-between ${f ? "h-[28px] min-h-[28px] mb-[2px]" : ""} ${z ? "is-selected" : Ge && s === J ? "is-highlighted" : ""}`.trim(),
        children: [
          /* @__PURE__ */ O("span", { className: "truncate", children: t.label }),
          z && /* @__PURE__ */ O(Dt, { size: 13, strokeWidth: 2.5, className: "ml-1.5 shrink-0" })
        ]
      },
      t.value
    );
  }, G = Se ? xt(Se) : "";
  return /* @__PURE__ */ Ze(
    "div",
    {
      ref: F,
      "data-agv-trigger": "true",
      "data-theme": Se || void 0,
      "data-state": c ? "open" : "closed",
      "aria-expanded": c,
      "aria-invalid": Ve || void 0,
      "aria-disabled": $ || void 0,
      style: {
        ...Me(),
        ...je
      },
      onClick: Pe,
      className: gt({
        size: Ke,
        variant: ne,
        box: !0,
        defaultRadiusClass: yt(),
        className: `agv-comboboxedit-wrapper relative inline-flex items-center w-full ${c ? "is-open" : ""} ${$ ? "opacity-50 pointer-events-none" : "cursor-text"} ${G} ${Re}`.trim()
      }),
      children: [
        fe ? /* @__PURE__ */ O(
          "span",
          {
            "aria-hidden": "true",
            className: "pl-3 pr-2 shrink-0 inline-flex items-center text-[var(--agv-text-muted)] pointer-events-none",
            children: fe
          }
        ) : null,
        /* @__PURE__ */ O(
          "input",
          {
            ref: ee,
            id: ze,
            type: "text",
            disabled: $,
            value: ge,
            onChange: _,
            onBlur: Le,
            onKeyDown: Ae,
            placeholder: Ue,
            "aria-invalid": Ve || void 0,
            "aria-describedby": We,
            "aria-errormessage": Ye,
            ...ht,
            className: `agv-comboboxedit-input w-full min-w-0 h-full bg-transparent border-0 ${fe ? "pl-0 pr-3" : ne === "auth" ? "px-3" : "px-2.5"} text-foreground outline-none placeholder:text-muted-foreground ${ne === "auth" || Ke === "md" ? "text-sm" : "text-xs"}`
          }
        ),
        c && $t(
          /* @__PURE__ */ O(
            "div",
            {
              ref: oe,
              "data-theme": Se || void 0,
              style: {
                position: "fixed",
                ...n.isFlipUp ? { bottom: `${n.bottom}px`, top: "auto" } : { top: `${n.top}px`, bottom: "auto" },
                left: `${n.left}px`,
                width: `${n.width}px`,
                maxHeight: `${n.maxHeight}px`,
                zIndex: 99999999,
                ...Me()
              },
              className: `agv-comboboxedit-dropdown ${Rt} overflow-hidden select-none text-xs ${n.isFlipUp ? "agv-spring-up" : "agv-spring-down"} ${G}`,
              "data-agv-popup": "true",
              onMouseMove: () => {
                Ee.current && (W.current = "pointer", I(!1));
              },
              onMouseDown: (t) => t.stopPropagation(),
              children: /* @__PURE__ */ O(
                Ot,
                {
                  viewportRef: Q,
                  onScroll: l.handleScroll,
                  viewportClassName: "overflow-y-auto overflow-x-hidden p-1",
                  viewportStyle: { maxHeight: `${Te}px` },
                  contentSignature: `${H.length}:${l.startIndex}:${l.endIndex}`,
                  children: H.length === 0 ? /* @__PURE__ */ O("div", { className: "px-3 py-2 text-center text-xs text-muted-foreground select-none", children: "Không tìm thấy kết quả" }) : l.isVirtualized ? /* @__PURE__ */ O("div", { style: { height: `${l.totalHeight}px`, position: "relative" }, children: /* @__PURE__ */ O("div", { style: { transform: `translate3d(0, ${l.offsetY}px, 0)` }, children: H.slice(l.startIndex, l.endIndex).map(
                    (t, s) => ye(t, l.startIndex + s, !0)
                  ) }) }) : /* @__PURE__ */ O("div", { className: "flex flex-col gap-0.5", children: H.map((t, s) => ye(t, s, !1)) })
                }
              )
            }
          ),
          document.body
        )
      ]
    }
  );
}, Ht = Ct(
  () => import("./AdvSearchLookUpPopup-CVsQgJDX.js")
), at = () => {
  import("./AdvSearchLookUpPopup-CVsQgJDX.js");
}, Vt = [
  { id: A.CONTAINS, label: "Có chứa" },
  { id: A.STARTS_WITH, label: "Bắt đầu bằng" },
  { id: A.ENDS_WITH, label: "Kết thúc bằng" },
  { id: A.EQUALS, label: "Bằng" },
  { id: A.NOT_EQUALS, label: "Không bằng" },
  { id: A.NOT_CONTAINS, label: "Không chứa" },
  { id: A.IS_EMPTY, label: "Trống" },
  { id: A.IS_NOT_EMPTY, label: "Không trống" }
];
function Gt({
  id: ze,
  value: j,
  defaultValue: He,
  onChange: L,
  dataSource: m = [],
  valueMember: h,
  displayMember: ce,
  columns: E = [],
  placeholder: Be = "Tìm kiếm hoặc chọn...",
  size: Ke = "sm",
  variant: ne = "default",
  leadingIcon: fe,
  disabled: $ = !1,
  dropdownWidth: Re = 460,
  className: je = "",
  style: Se = {},
  theme: ue = Pt.LIGHT,
  invalid: qe,
  "aria-invalid": Qe,
  "aria-describedby": We,
  "aria-errormessage": Ye,
  searchPlaceholder: Ve = "Tìm kiếm nhanh trong danh mục...",
  searchFields: X,
  showFooterCount: re = !0,
  showFilterRow: Oe = !1,
  selectionMode: a = "row",
  multiSelect: u = !1,
  defaultOpen: q = !1,
  autoFocus: de = !1,
  onClose: y
}) {
  const c = !!(qe || Qe), P = j !== void 0, [Ge, pe] = T(
    P ? j : He !== void 0 ? He : u ? [] : void 0
  ), n = P ? j : Ge, [S, F] = T(q), [oe, Q] = T(""), [ee, W] = T({}), [Ee, I] = T(null), [N, ke] = T(Oe), [he, Y] = T(0), [be, _e] = T(!1), [se, te] = T({ top: 0, left: 0, width: Re, maxHeight: 360 }), ge = C(null), Ue = C(null), J = C(null), D = C(null), ie = C(null), H = C(null), V = C("init"), Te = C(!1), l = (e) => {
    Te.current !== e && (Te.current = e, _e(e));
  }, [b, le] = T([]), _ = M(() => {
    if (a === "cell")
      return /* @__PURE__ */ new Set();
    if (u) {
      const e = Array.isArray(n) ? n : n != null && n !== "" ? [n] : [];
      return new Set(e.map(String));
    }
    return new Set(n != null && n !== "" ? [String(n)] : []);
  }, [n, u, a]), Le = M(() => {
    if (a !== "cell") return /* @__PURE__ */ new Set();
    if (b.length > 0)
      return new Set(b.map((e) => `${String(e.rowKey)}:::${String(e.colKey)}`));
    if (n != null && n !== "") {
      const e = /* @__PURE__ */ new Set(), r = Array.isArray(n) ? n : [n];
      for (const o of r)
        if (o && typeof o == "object" && "rowKey" in o && "colKey" in o)
          e.add(`${String(o.rowKey)}:::${String(o.colKey)}`);
        else
          for (let v = 0; v < m.length; v++) {
            const d = m[v];
            let w = !1;
            for (let g = 0; g < E.length; g++) {
              const k = E[g];
              if (d[k.key] === o || String(d[k.key]) === String(o)) {
                e.add(`${String(d[h])}:::${String(k.key)}`), w = !0;
                break;
              }
            }
            if (w) break;
          }
      return e;
    }
    return /* @__PURE__ */ new Set();
  }, [a, b, n, m, E, h]);
  Ne(() => {
    if (a !== "cell") return;
    if (n == null || Array.isArray(n) && n.length === 0) {
      le([]);
      return;
    }
    const e = Array.isArray(n) ? n : [n], r = [];
    for (const o of e)
      if (o && typeof o == "object" && "rowKey" in o && "colKey" in o)
        r.push(o);
      else {
        let v = !1;
        for (let d = 0; d < m.length; d++) {
          const w = m[d];
          for (let g = 0; g < E.length; g++) {
            const k = E[g];
            if (w[k.key] === o || String(w[k.key]) === String(o)) {
              r.push({
                row: w,
                rowKey: w[h],
                colKey: k.key,
                value: w[k.key]
              }), v = !0;
              break;
            }
          }
          if (v) break;
        }
      }
    le(r);
  }, [n, a, m, E, h]);
  const [Ae, Pe] = T(
    () => q ? new Set(_) : /* @__PURE__ */ new Set()
  ), ye = M(() => {
    const e = /* @__PURE__ */ new Map();
    for (let r = 0; r < m.length; r++) {
      const o = m[r], v = String(o[h]);
      e.has(v) || e.set(v, o);
    }
    return e;
  }, [m, h]), G = M(() => {
    if (u) {
      const o = [];
      return _.forEach((v) => {
        const d = ye.get(v);
        d && o.push(d);
      }), o;
    }
    const e = n != null && n !== "" ? String(n) : "", r = e ? ye.get(e) : void 0;
    return r ? [r] : [];
  }, [ye, _, n, u]), t = Ce(() => {
    if (ge.current) {
      const e = ct(ge.current, 360, Re);
      te((r) => ft(r, e) ? r : e);
    }
  }, [Re]);
  Fe(() => {
    q && ge.current && t();
  }, [q, t]);
  const s = Ce(() => {
    F(!1), Pe(/* @__PURE__ */ new Set()), Q(""), I(null), l(!1), y?.();
  }, [y]), f = Ce(() => {
    if ($) return;
    Q("");
    const e = new Set(_);
    Pe(e), V.current = "init", l(!1), Y(0), t(), F(!0);
  }, [$, _, t]), z = () => {
    $ || (S || f(), D.current?.focus({ preventScroll: !0 }));
  };
  ut(
    S,
    s,
    t,
    ge,
    Ue,
    J
  ), Ne(() => {
    (de || q) && D.current && D.current.focus({ preventScroll: !0 });
  }, [de, q]), Ne(() => {
    S && D.current && document.activeElement !== D.current && D.current.focus({ preventScroll: !0 });
  }, [S]);
  const K = C(null), x = M(() => {
    const e = $e(oe.trim()), r = Object.entries(ee).filter(([p, i]) => i ? it(i.op) ? !0 : !!(i.val && i.val.trim().length > 0) : !1);
    if (!e && r.length === 0 && Ae.size === 0)
      return m;
    const o = (p) => {
      let i = K.current;
      (!i || i.dataSource !== m) && (i = { dataSource: m, byField: /* @__PURE__ */ new Map() }, K.current = i);
      let U = i.byField.get(p);
      if (!U) {
        const Z = m.length;
        U = new Array(Z);
        for (let B = 0; B < Z; B++)
          U[B] = $e(String(m[B][p] ?? ""));
        i.byField.set(p, U);
      }
      return U;
    }, d = (e ? (X && X.length > 0 ? X : E.map((p) => p.key)).map(String) : []).map((p) => o(p)), w = r.map(([p, i]) => ({
      colKey: p,
      op: i.op,
      colQ: $e(i.val?.trim() || ""),
      normCol: it(i.op) ? null : o(p)
    })), g = Ae.size > 0, k = [], R = [];
    for (let p = 0; p < m.length; p++) {
      const i = m[p];
      if (e) {
        let U = !1;
        for (let Z = 0; Z < d.length; Z++)
          if (d[Z][p].includes(e)) {
            U = !0;
            break;
          }
        if (!U) continue;
      }
      if (w.length > 0) {
        let U = !0;
        for (let Z = 0; Z < w.length; Z++) {
          const B = w[Z];
          if (B.op === A.IS_EMPTY) {
            const we = i[B.colKey];
            if (!(we == null || String(we).trim() === "")) {
              U = !1;
              break;
            }
            continue;
          }
          if (B.op === A.IS_NOT_EMPTY) {
            const we = i[B.colKey];
            if (!(we != null && String(we).trim() !== "")) {
              U = !1;
              break;
            }
            continue;
          }
          const ve = B.colQ;
          if (!ve) continue;
          const Ie = B.normCol[p];
          let me = !0;
          switch (B.op) {
            case A.EQUALS:
              me = Ie === ve;
              break;
            case A.NOT_EQUALS:
              me = Ie !== ve;
              break;
            case A.STARTS_WITH:
              me = Ie.startsWith(ve);
              break;
            case A.ENDS_WITH:
              me = Ie.endsWith(ve);
              break;
            case A.NOT_CONTAINS:
              me = !Ie.includes(ve);
              break;
            case A.CONTAINS:
            default:
              me = Ie.includes(ve);
              break;
          }
          if (!me) {
            U = !1;
            break;
          }
        }
        if (!U) continue;
      }
      g && Ae.has(String(i[h])) ? k.push(i) : R.push(i);
    }
    return k.length > 0 ? [...k, ...R] : R;
  }, [m, oe, X, E, ee, Ae, h]);
  Ne(() => {
    if (S && !u && !oe.trim() && n !== void 0 && n !== null && n !== "") {
      const e = String(n), r = x.findIndex((o) => String(o[h]) === e);
      r >= 0 && Y(r);
    }
  }, [S, n, h, u, x, oe]);
  const ae = a === "cell" ? (Le?.size ?? 0) > 0 : _.size > 0, xe = M(() => !u || x.length === 0 || _.size < x.length ? !1 : x.every((e) => _.has(String(e[h]))), [u, x, _, h]), De = (e) => {
    const r = e[h];
    P || pe(r), L?.(r, e), Q(""), l(!1), I(null), F(!1), y?.();
  }, et = (e, r) => {
    r?.stopPropagation();
    const o = e[h], v = String(o), d = Array.isArray(n) ? [...n] : n != null && n !== "" ? [n] : [], w = d.some((R) => String(R) === v);
    let g;
    w ? g = d.filter((R) => String(R) !== v) : g = [...d, o], P || pe(g);
    const k = [];
    for (let R = 0; R < g.length; R++) {
      const p = ye.get(String(g[R]));
      p && k.push(p);
    }
    L?.(g, k);
  }, tt = (e, r, o) => {
    o?.stopPropagation();
    const v = e[h], d = e[r], w = {
      row: e,
      rowKey: v,
      colKey: r,
      value: d
    }, g = `${String(v)}:::${String(r)}`;
    if (!u) {
      P || pe(d), le([w]), L?.(d, w), Q(""), l(!1), I(null), F(!1), y?.();
      return;
    }
    const R = b.some(
      (i) => `${String(i.rowKey)}:::${String(i.colKey)}` === g
    ) ? b.filter((i) => `${String(i.rowKey)}:::${String(i.colKey)}` !== g) : [...b, w], p = R.map((i) => i.value);
    P || pe(p), le(R), L?.(p, R);
  }, nt = (e) => {
    e.stopPropagation(), ae && (P || pe([]), a === "cell" ? (le([]), L?.([], [])) : L?.([], []));
  }, vt = () => {
    Q(""), l(!1), I(null), F(!1), y?.();
  }, Xe = () => {
    ie.current && ie.current.scrollTop > 0 && (ie.current.scrollTop = 0);
  }, mt = (e) => {
    const r = e.target.value;
    Q(r), S || (Pe(new Set(_)), t(), F(!0)), V.current = "keyboard", l(r.trim().length > 0), Xe(), Je(() => {
      Y(0);
    });
  }, wt = (e, r) => {
    V.current = "keyboard", l(r.trim().length > 0), Xe(), Je(() => {
      W((o) => ({
        ...o,
        [e]: {
          op: o[e]?.op || A.CONTAINS,
          val: r
        }
      })), Y(0);
    });
  }, St = (e, r) => {
    V.current = "keyboard", l(!1), Xe(), Je(() => {
      W((o) => ({
        ...o,
        [e]: {
          val: o[e]?.val || "",
          op: r
        }
      })), I(null), Y(0);
    });
  }, rt = (e) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "PageDown" || e.key === "PageUp") {
      if (e.preventDefault(), x.length > 0) {
        const r = ie.current, o = r?.querySelector("tbody tr[data-lookup-idx]"), v = x.length >= 40 ? 32 : o?.offsetHeight || 32, d = r ? Math.max(v, r.clientHeight - (H.current?.offsetHeight || 0)) : 224, w = dt(d, v, 6);
        V.current = "keyboard", l(!0), Y((g) => {
          const k = pt(e.key, g, x.length, w);
          return k !== null ? k : g;
        });
      }
      return;
    }
    if (e.key === "Escape") {
      e.preventDefault(), s();
      return;
    }
  }, kt = (e) => {
    if (!$) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "PageDown" || e.key === "PageUp" || e.key === "Escape") {
        if (!S) {
          (e.key === "ArrowDown" || e.key === "ArrowUp") && (e.preventDefault(), f(), l(!0));
          return;
        }
        rt(e);
        return;
      }
      if (e.key === "Tab") {
        S && s();
        return;
      }
      if (e.key === "Enter" && S) {
        if (e.preventDefault(), x.length > 0) {
          const r = he >= 0 && he < x.length ? he : 0, o = x[r];
          a === "cell" ? E.length > 0 && tt(o, E[0].key) : u ? et(o) : De(o);
        }
        return;
      }
    }
  }, ot = xt(ue), bt = M(() => a === "cell" ? u ? b.length === 0 ? "" : b.map((e) => String(e.value ?? "")).join(", ") : b.length > 0 ? String(b[0].value ?? "") : n != null && n !== "" ? String(n) : "" : u ? G.length === 0 ? "" : G.length === 1 ? String(G[0][ce] ?? "") : `Đã chọn ${G.length} mục` : G.length > 0 ? String(G[0][ce] ?? "") : "", [a, u, b, n, G, ce]), st = u && (a === "cell" ? b.length > 0 : G.length > 0) && !$, Tt = ne === "auth" || Ke === "md" ? "text-sm" : "text-xs", At = fe ? "pl-0" : ne === "auth" ? "pl-3" : "pl-2.5", It = st ? "pr-0.5" : ne === "auth" ? "pr-3" : "pr-2.5";
  return /* @__PURE__ */ Ze(
    "div",
    {
      ref: ge,
      "data-agv-trigger": "true",
      "data-theme": ue || void 0,
      "data-state": S ? "open" : "closed",
      "aria-expanded": S,
      "aria-invalid": c || void 0,
      "aria-disabled": $ || void 0,
      style: {
        ...Me(),
        ...Se
      },
      onMouseEnter: at,
      onFocus: at,
      onClick: z,
      className: gt({
        size: Ke,
        variant: ne,
        box: !0,
        defaultRadiusClass: yt(),
        className: `agv-searchlookupedit-wrapper relative inline-flex items-center w-full ${S ? "is-open" : ""} ${$ ? "opacity-50 pointer-events-none" : "cursor-text"} ${ot} ${je}`.trim()
      }),
      children: [
        fe ? /* @__PURE__ */ O(
          "span",
          {
            "aria-hidden": "true",
            className: "pl-3 pr-2 shrink-0 inline-flex items-center text-[var(--agv-text-muted)] pointer-events-none",
            children: fe
          }
        ) : null,
        /* @__PURE__ */ O(
          "input",
          {
            ref: D,
            id: ze,
            type: "text",
            disabled: $,
            value: S ? oe : bt,
            onChange: mt,
            onKeyDown: kt,
            placeholder: S ? Ve : Be,
            "aria-invalid": c || void 0,
            "aria-describedby": We,
            "aria-errormessage": Ye,
            ...ht,
            className: `agv-searchlookupedit-input flex-1 min-w-0 h-full bg-transparent border-0 ${At} ${It} text-foreground outline-none truncate placeholder:text-muted-foreground ${Tt} ${$ ? "" : S ? "cursor-text" : "cursor-pointer"}`
          }
        ),
        st && /* @__PURE__ */ O(
          "button",
          {
            type: "button",
            tabIndex: -1,
            "aria-label": "Xóa tất cả lựa chọn",
            onClick: nt,
            className: "agv-inline-clear-destructive w-6 h-full shrink-0 text-sm leading-none",
            children: "×"
          }
        ),
        S && (se.top > 0 || (se.bottom ?? 0) > 0) && /* @__PURE__ */ O(Nt, { fallback: null, children: /* @__PURE__ */ O(
          Ht,
          {
            theme: ue,
            themeClass: ot,
            coords: se,
            multiSelect: u,
            columns: E,
            hasAnySelection: ae,
            isAllFilteredSelected: xe,
            isFilterRowVisible: N,
            filterStates: ee,
            filterOperators: Vt,
            filteredData: x,
            valueMember: h,
            selectedKeysSet: _,
            isKeyboardNav: be,
            highlightedIndex: he,
            activeOpMenuCol: Ee,
            dropdownRef: Ue,
            opMenuRef: J,
            tableBodyRef: ie,
            theadRef: H,
            isKeyboardNavRef: Te,
            navSourceRef: V,
            setKeyboardNavActive: l,
            setActiveOpMenuCol: I,
            handleListNavigationKeyDown: rt,
            handleClearMultiAll: nt,
            handleFilterRowChange: wt,
            handleFilterOpChange: St,
            handleToggleMultiRow: et,
            handleSelectSingleRow: De,
            selectionMode: a,
            selectedCellKeysSet: Le,
            handleSelectCell: tt,
            handleApplyMulti: vt
          }
        ) })
      ]
    }
  );
}
export {
  Yt as A,
  Vt as L,
  Gt as a
};
