import { jsxs as Xe, jsx as k } from "react/jsx-runtime";
import { useState as m, useRef as v, useCallback as Ne, useMemo as X, useEffect as He, useLayoutEffect as ze, Suspense as wt, startTransition as Ge, lazy as St } from "react";
import { createPortal as kt } from "react-dom";
import { n as Ae, c as st, a as it, s as Tt, u as lt, g as Je, b as at, d as ct } from "./enterpriseEditorUtils-DJeTtQuh.js";
import { N as ut, P as It, i as dt, g as ft } from "./AdvButton-Ck5SixaL.js";
import { A as Nt } from "./AdvOverlayScroll-CipuwW1l.js";
import { u as At } from "./useVirtualList-CH5KMFFG.js";
import { g as pt, S as Ct } from "./common-29M8PlVv.js";
import { C as Rt } from "./check-KNrOhvEC.js";
import { b as x, j as nt } from "./gridFormatUtils-wCKPmlrt.js";
const rt = 30, zt = ({
  id: Me,
  value: P,
  defaultValue: Ke = "",
  onChange: W,
  options: T = [],
  allowCustomInput: g = !0,
  defaultOpen: le = !1,
  autoFocus: me = !1,
  placeholder: Be = "Nhập hoặc chọn...",
  size: Ce = "sm",
  variant: J = "default",
  leadingIcon: ae,
  disabled: y = !1,
  className: Re = "",
  style: qe = {},
  theme: xe = "",
  onClose: ce,
  invalid: Qe,
  "aria-invalid": We,
  "aria-describedby": je,
  "aria-errormessage": Ye
}) => {
  const _e = !!(Qe || We), L = P !== void 0, [Z, Ee] = m(L ? P : Ke), [i, I] = m(!1), [ue, ee] = m(""), p = L && !i ? P : Z, [l, te] = m(le), [Oe, o] = m(!1), [a, ve] = m({ top: 0, left: 0, width: 200, maxHeight: 220 }), D = v(null), de = v(null), ne = v(null), re = v(null), F = v("init"), oe = v(!1), $ = Ne((e) => {
    oe.current !== e && (oe.current = e, o(e));
  }, []), b = X(() => T.map((e) => typeof e == "string" ? { value: e, label: e } : e), [T]), z = X(() => {
    const e = /* @__PURE__ */ new Map();
    for (let n = 0; n < b.length; n++) {
      const c = b[n];
      e.has(c.value) || e.set(c.value, n), e.has(c.label) || e.set(c.label, n);
    }
    return e;
  }, [b]), j = L ? P : Z, ye = j !== void 0 ? z.get(j) ?? -1 : -1, be = ye >= 0 ? b[ye] : null, we = ye >= 0 ? ye : 0, Se = b[we] || null, N = !g, Ue = N ? l ? ue : be ? be.label : p : i ? Z : Se && (Se.value === p || Se.label === p) ? Se.label : p, Ve = N && l && be ? be.label : Be, [w, C] = m(we);
  He(() => {
    L && P !== void 0 && !i && Ee(P);
  }, [L, P, i]), ze(() => {
    if (l && !i) {
      const e = p !== void 0 ? z.get(p) ?? -1 : -1;
      F.current = "init", C(e >= 0 ? e : 0);
    }
  }, [l, p, z, i]);
  const Pe = v(null), h = X(() => {
    const e = N ? ue : i ? p : "";
    if (!e || !e.trim()) return b;
    const n = Ae(e);
    if (!n) return b;
    let c = Pe.current;
    if (!c || c.optionsRef !== b) {
      const S = b.length, q = new Array(S), ie = new Array(S);
      for (let Y = 0; Y < S; Y++) {
        const Fe = b[Y];
        q[Y] = Ae(Fe.label), ie[Y] = Ae(Fe.value);
      }
      c = { optionsRef: b, labels: q, values: ie }, Pe.current = c;
    }
    const E = [];
    for (let S = 0; S < b.length; S++)
      (c.labels[S].includes(n) || c.values[S].includes(n)) && E.push(b[S]);
    return E;
  }, [b, N, ue, i, p]), H = Ne(() => {
    if (D.current) {
      const e = st(D.current, 220, 180);
      ve((n) => it(n, e) ? n : e);
    }
  }, []);
  ze(() => {
    le && D.current && H();
  }, [le, H]);
  const R = Math.max(118, a.maxHeight - 2), s = At({
    itemCount: h.length,
    itemHeight: rt,
    viewportRef: ne,
    overscan: 6,
    threshold: 40,
    enabled: l,
    defaultViewportHeight: R
  });
  ze(() => {
    if (!l || F.current === "pointer") return;
    if (s.isVirtualized) {
      s.scrollToIndex(w, 4, 4);
      return;
    }
    const e = ne.current;
    if (!e) return;
    const n = e.querySelector(`[data-combo-idx="${w}"]`);
    n && Tt(e, n, 4, 4);
  }, [l, w, h.length, s.isVirtualized, s.scrollToIndex]), He(() => {
    me && re.current && (re.current.focus({ preventScroll: !0 }), re.current.select());
  }, [me]);
  const M = Ne(() => {
    te(!1), I(!1), ee(""), $(!1), ce?.();
  }, [$, ce]);
  lt(
    l,
    () => {
      i && g && W?.(Z), M();
    },
    H,
    D,
    de
  );
  const ke = (e) => {
    Ee(e), W?.(e), M();
  }, Te = (e) => {
    const n = e.target.value;
    if (N) {
      ee(n), F.current = "keyboard", $(n.trim().length > 0), C(0), s.resetScroll(), l || (H(), te(!0));
      return;
    }
    Ee(n), I(!0), F.current = "keyboard", $(n.trim().length > 0), C(0), s.resetScroll(), l || (H(), te(!0));
  }, B = () => {
    i && g && (W?.(Z), I(!1));
  }, se = (e) => {
    if (y) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "PageDown" || e.key === "PageUp" || N && !ue && (e.key === "Home" || e.key === "End")) {
      if (e.preventDefault(), l) {
        if (h.length > 0) {
          const c = ne.current, E = c?.querySelector("[data-combo-idx]"), S = at(
            c?.clientHeight || 212,
            s.isVirtualized ? rt : E?.offsetHeight || 28,
            6
          );
          F.current = "keyboard", $(!0), C((q) => {
            const ie = ct(e.key, q, h.length, S);
            return ie !== null ? ie : q;
          });
        }
      } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        H(), F.current = "init", I(!1), ee(""), $(!0), te(!0);
        const c = p !== void 0 ? z.get(p) ?? -1 : -1;
        C(c >= 0 ? c : 0);
      }
      return;
    }
    if (e.key === "Enter") {
      if (l && h.length > 0) {
        e.preventDefault();
        const c = w >= 0 && w < h.length ? w : 0, E = h[c];
        E && ke(E.value);
      } else l && N ? (e.preventDefault(), M()) : (i && g && (W?.(Z), I(!1)), $(!1), l && te(!1));
      return;
    }
    if (e.key === "Tab" && l) {
      i && g && W?.(Z), M();
      return;
    }
    if (e.key === "Escape") {
      l ? (e.preventDefault(), M()) : ce?.();
      return;
    }
  }, De = () => {
    if (!y) {
      if (!l) {
        H(), F.current = "init";
        const e = p !== void 0 ? z.get(p) ?? -1 : -1;
        C(e >= 0 ? e : 0), I(!1), ee(""), $(!1), te(!0);
      }
      re.current?.focus({ preventScroll: !0 });
    }
  }, $e = (e, n, c) => {
    const E = e.value === p || e.label === p;
    return /* @__PURE__ */ Xe(
      "div",
      {
        "data-combo-idx": n,
        onClick: (q) => {
          q.stopPropagation(), ke(e.value);
        },
        className: `agv-popup-item justify-between ${c ? "h-[28px] min-h-[28px] mb-[2px]" : ""} ${E ? "is-selected" : Oe && n === w ? "is-highlighted" : ""}`.trim(),
        children: [
          /* @__PURE__ */ k("span", { className: "truncate", children: e.label }),
          E && /* @__PURE__ */ k(Rt, { size: 13, strokeWidth: 2.5, className: "ml-1.5 shrink-0" })
        ]
      },
      e.value
    );
  }, Le = xe ? pt(xe) : "";
  return /* @__PURE__ */ Xe(
    "div",
    {
      ref: D,
      "data-agv-trigger": "true",
      "data-theme": xe || void 0,
      "data-state": l ? "open" : "closed",
      "aria-expanded": l,
      "aria-invalid": _e || void 0,
      "aria-disabled": y || void 0,
      style: {
        ...Je(),
        ...qe
      },
      onClick: De,
      className: dt({
        size: Ce,
        variant: J,
        box: !0,
        defaultRadiusClass: ft(),
        className: `agv-comboboxedit-wrapper relative inline-flex items-center w-full ${l ? "is-open" : ""} ${y ? "opacity-50 pointer-events-none" : "cursor-text"} ${Le} ${Re}`.trim()
      }),
      children: [
        ae ? /* @__PURE__ */ k(
          "span",
          {
            "aria-hidden": "true",
            className: "pl-3 pr-2 shrink-0 inline-flex items-center text-[var(--agv-text-muted)] pointer-events-none",
            children: ae
          }
        ) : null,
        /* @__PURE__ */ k(
          "input",
          {
            ref: re,
            id: Me,
            type: "text",
            disabled: y,
            value: Ue,
            onChange: Te,
            onBlur: B,
            onKeyDown: se,
            placeholder: Ve,
            "aria-invalid": _e || void 0,
            "aria-describedby": je,
            "aria-errormessage": Ye,
            ...ut,
            className: `agv-comboboxedit-input w-full min-w-0 h-full bg-transparent border-0 ${ae ? "pl-0 pr-3" : J === "auth" ? "px-3" : "px-2.5"} text-foreground outline-none placeholder:text-muted-foreground ${J === "auth" || Ce === "md" ? "text-sm" : "text-xs"}`
          }
        ),
        l && kt(
          /* @__PURE__ */ k(
            "div",
            {
              ref: de,
              "data-theme": xe || void 0,
              style: {
                position: "fixed",
                ...a.isFlipUp ? { bottom: `${a.bottom}px`, top: "auto" } : { top: `${a.top}px`, bottom: "auto" },
                left: `${a.left}px`,
                width: `${a.width}px`,
                maxHeight: `${a.maxHeight}px`,
                zIndex: 99999999,
                ...Je()
              },
              className: `agv-comboboxedit-dropdown ${It} overflow-hidden select-none text-xs ${a.isFlipUp ? "agv-spring-up" : "agv-spring-down"} ${Le}`,
              "data-agv-popup": "true",
              onMouseMove: () => {
                oe.current && (F.current = "pointer", $(!1));
              },
              onMouseDown: (e) => e.stopPropagation(),
              children: /* @__PURE__ */ k(
                Nt,
                {
                  viewportRef: ne,
                  onScroll: s.handleScroll,
                  viewportClassName: "overflow-y-auto overflow-x-hidden p-1",
                  viewportStyle: { maxHeight: `${R}px` },
                  contentSignature: `${h.length}:${s.startIndex}:${s.endIndex}`,
                  children: h.length === 0 ? /* @__PURE__ */ k("div", { className: "px-3 py-2 text-center text-xs text-muted-foreground select-none", children: "Không tìm thấy kết quả" }) : s.isVirtualized ? /* @__PURE__ */ k("div", { style: { height: `${s.totalHeight}px`, position: "relative" }, children: /* @__PURE__ */ k("div", { style: { transform: `translate3d(0, ${s.offsetY}px, 0)` }, children: h.slice(s.startIndex, s.endIndex).map(
                    (e, n) => $e(e, s.startIndex + n, !0)
                  ) }) }) : /* @__PURE__ */ k("div", { className: "flex flex-col gap-0.5", children: h.map((e, n) => $e(e, n, !1)) })
                }
              )
            }
          ),
          document.body
        )
      ]
    }
  );
}, Et = St(
  () => import("./AdvSearchLookUpPopup-Cy5IZCtF.js")
), ot = () => {
  import("./AdvSearchLookUpPopup-Cy5IZCtF.js");
}, Ot = [
  { id: x.CONTAINS, label: "Có chứa" },
  { id: x.STARTS_WITH, label: "Bắt đầu bằng" },
  { id: x.ENDS_WITH, label: "Kết thúc bằng" },
  { id: x.EQUALS, label: "Bằng" },
  { id: x.NOT_EQUALS, label: "Không bằng" },
  { id: x.NOT_CONTAINS, label: "Không chứa" },
  { id: x.IS_EMPTY, label: "Trống" },
  { id: x.IS_NOT_EMPTY, label: "Không trống" }
];
function Mt({
  id: Me,
  value: P,
  defaultValue: Ke,
  onChange: W,
  dataSource: T = [],
  valueMember: g,
  displayMember: le,
  columns: me = [],
  placeholder: Be = "Tìm kiếm hoặc chọn...",
  size: Ce = "sm",
  variant: J = "default",
  leadingIcon: ae,
  disabled: y = !1,
  dropdownWidth: Re = 460,
  className: qe = "",
  style: xe = {},
  theme: ce = Ct.LIGHT,
  invalid: Qe,
  "aria-invalid": We,
  "aria-describedby": je,
  "aria-errormessage": Ye,
  searchPlaceholder: _e = "Tìm kiếm nhanh trong danh mục...",
  searchFields: L,
  showFooterCount: Z = !0,
  showFilterRow: Ee = !1,
  multiSelect: i = !1,
  defaultOpen: I = !1,
  autoFocus: ue = !1,
  onClose: ee
}) {
  const p = !!(Qe || We), l = P !== void 0, [te, Oe] = m(
    l ? P : Ke !== void 0 ? Ke : i ? [] : void 0
  ), o = l ? P : te, [a, ve] = m(I), [D, de] = m(""), [ne, re] = m({}), [F, oe] = m(null), [$, b] = m(Ee), [z, j] = m(0), [ye, be] = m(!1), [we, Se] = m({ top: 0, left: 0, width: Re, maxHeight: 360 }), N = v(null), Ue = v(null), Ve = v(null), w = v(null), C = v(null), Pe = v(null), h = v("init"), H = v(!1), R = (t) => {
    H.current !== t && (H.current = t, be(t));
  }, s = X(() => {
    if (i) {
      const t = Array.isArray(o) ? o : o != null && o !== "" ? [o] : [];
      return new Set(t.map(String));
    }
    return new Set(o != null && o !== "" ? [String(o)] : []);
  }, [o, i]), [M, ke] = m(
    () => I ? new Set(s) : /* @__PURE__ */ new Set()
  ), Te = X(() => {
    const t = /* @__PURE__ */ new Map();
    for (let r = 0; r < T.length; r++) {
      const u = T[r], K = String(u[g]);
      t.has(K) || t.set(K, u);
    }
    return t;
  }, [T, g]), B = X(() => {
    if (i) {
      const u = [];
      return s.forEach((K) => {
        const _ = Te.get(K);
        _ && u.push(_);
      }), u;
    }
    const t = o != null && o !== "" ? String(o) : "", r = t ? Te.get(t) : void 0;
    return r ? [r] : [];
  }, [Te, s, o, i]), se = Ne(() => {
    if (N.current) {
      const t = st(N.current, 360, Re);
      Se((r) => it(r, t) ? r : t);
    }
  }, [Re]);
  ze(() => {
    I && N.current && se();
  }, [I, se]);
  const De = Ne(() => {
    ve(!1), ke(/* @__PURE__ */ new Set()), de(""), oe(null), R(!1), ee?.();
  }, [ee]), $e = Ne(() => {
    if (y) return;
    de("");
    const t = new Set(s);
    ke(t), h.current = "init", R(!1), j(0), se(), ve(!0);
  }, [y, s, se]), Le = () => {
    y || (a || $e(), w.current?.focus({ preventScroll: !0 }));
  };
  lt(
    a,
    De,
    se,
    N,
    Ue,
    Ve
  ), He(() => {
    (ue || I) && w.current && w.current.focus({ preventScroll: !0 });
  }, [ue, I]), He(() => {
    a && w.current && document.activeElement !== w.current && w.current.focus({ preventScroll: !0 });
  }, [a]);
  const e = v(null), n = X(() => {
    const t = Ae(D.trim()), r = Object.entries(ne).filter(([f, d]) => d ? nt(d.op) ? !0 : !!(d.val && d.val.trim().length > 0) : !1);
    if (!t && r.length === 0 && M.size === 0)
      return T;
    const u = (f) => {
      let d = e.current;
      (!d || d.dataSource !== T) && (d = { dataSource: T, byField: /* @__PURE__ */ new Map() }, e.current = d);
      let A = d.byField.get(f);
      if (!A) {
        const Q = T.length;
        A = new Array(Q);
        for (let O = 0; O < Q; O++)
          A[O] = Ae(String(T[O][f] ?? ""));
        d.byField.set(f, A);
      }
      return A;
    }, _ = (t ? (L && L.length > 0 ? L : me.map((f) => f.key)).map(String) : []).map((f) => u(f)), fe = r.map(([f, d]) => ({
      colKey: f,
      op: d.op,
      colQ: Ae(d.val?.trim() || ""),
      normCol: nt(d.op) ? null : u(f)
    })), U = M.size > 0, G = [], V = [];
    for (let f = 0; f < T.length; f++) {
      const d = T[f];
      if (t) {
        let A = !1;
        for (let Q = 0; Q < _.length; Q++)
          if (_[Q][f].includes(t)) {
            A = !0;
            break;
          }
        if (!A) continue;
      }
      if (fe.length > 0) {
        let A = !0;
        for (let Q = 0; Q < fe.length; Q++) {
          const O = fe[Q];
          if (O.op === x.IS_EMPTY) {
            const ge = d[O.colKey];
            if (!(ge == null || String(ge).trim() === "")) {
              A = !1;
              break;
            }
            continue;
          }
          if (O.op === x.IS_NOT_EMPTY) {
            const ge = d[O.colKey];
            if (!(ge != null && String(ge).trim() !== "")) {
              A = !1;
              break;
            }
            continue;
          }
          const pe = O.colQ;
          if (!pe) continue;
          const Ie = O.normCol[f];
          let he = !0;
          switch (O.op) {
            case x.EQUALS:
              he = Ie === pe;
              break;
            case x.NOT_EQUALS:
              he = Ie !== pe;
              break;
            case x.STARTS_WITH:
              he = Ie.startsWith(pe);
              break;
            case x.ENDS_WITH:
              he = Ie.endsWith(pe);
              break;
            case x.NOT_CONTAINS:
              he = !Ie.includes(pe);
              break;
            case x.CONTAINS:
            default:
              he = Ie.includes(pe);
              break;
          }
          if (!he) {
            A = !1;
            break;
          }
        }
        if (!A) continue;
      }
      U && M.has(String(d[g])) ? G.push(d) : V.push(d);
    }
    return G.length > 0 ? [...G, ...V] : V;
  }, [T, D, L, me, ne, M, g]);
  He(() => {
    if (a && !i && !D.trim() && o !== void 0 && o !== null && o !== "") {
      const t = String(o), r = n.findIndex((u) => String(u[g]) === t);
      r >= 0 && j(r);
    }
  }, [a, o, g, i, n, D]);
  const c = s.size > 0, E = X(() => !i || n.length === 0 || s.size < n.length ? !1 : n.every((t) => s.has(String(t[g]))), [i, n, s, g]), S = (t) => {
    const r = t[g];
    l || Oe(r), W?.(r, t), de(""), R(!1), oe(null), ve(!1), ee?.();
  }, q = (t, r) => {
    r?.stopPropagation();
    const u = t[g], K = String(u), _ = Array.isArray(o) ? [...o] : o != null && o !== "" ? [o] : [], fe = _.some((V) => String(V) === K);
    let U;
    fe ? U = _.filter((V) => String(V) !== K) : U = [..._, u], l || Oe(U);
    const G = [];
    for (let V = 0; V < U.length; V++) {
      const f = Te.get(String(U[V]));
      f && G.push(f);
    }
    W?.(U, G);
  }, ie = (t) => {
    t.stopPropagation(), c && (l || Oe([]), W?.([], []));
  }, Y = () => {
    C.current && C.current.scrollTop > 0 && (C.current.scrollTop = 0);
  }, Fe = (t) => {
    const r = t.target.value;
    de(r), a || (ke(new Set(s)), se(), ve(!0)), h.current = "keyboard", R(r.trim().length > 0), Y(), Ge(() => {
      j(0);
    });
  }, ht = (t, r) => {
    h.current = "keyboard", R(r.trim().length > 0), Y(), Ge(() => {
      re((u) => ({
        ...u,
        [t]: {
          op: u[t]?.op || x.CONTAINS,
          val: r
        }
      })), j(0);
    });
  }, gt = (t, r) => {
    h.current = "keyboard", R(!1), Y(), Ge(() => {
      re((u) => ({
        ...u,
        [t]: {
          val: u[t]?.val || "",
          op: r
        }
      })), oe(null), j(0);
    });
  }, Ze = (t) => {
    if (t.key === "ArrowDown" || t.key === "ArrowUp" || t.key === "PageDown" || t.key === "PageUp") {
      if (t.preventDefault(), n.length > 0) {
        const r = C.current, u = r?.querySelector("tbody tr[data-lookup-idx]"), K = n.length >= 40 ? 32 : u?.offsetHeight || 32, _ = r ? Math.max(K, r.clientHeight - (Pe.current?.offsetHeight || 0)) : 224, fe = at(_, K, 6);
        h.current = "keyboard", R(!0), j((U) => {
          const G = ct(t.key, U, n.length, fe);
          return G !== null ? G : U;
        });
      }
      return;
    }
    if (t.key === "Escape") {
      t.preventDefault(), De();
      return;
    }
  }, mt = (t) => {
    if (!y) {
      if (t.key === "ArrowDown" || t.key === "ArrowUp" || t.key === "PageDown" || t.key === "PageUp" || t.key === "Escape") {
        if (!a) {
          (t.key === "ArrowDown" || t.key === "ArrowUp") && (t.preventDefault(), $e(), R(!0));
          return;
        }
        Ze(t);
        return;
      }
      if (t.key === "Tab") {
        a && De();
        return;
      }
      if (t.key === "Enter" && a) {
        if (t.preventDefault(), n.length > 0) {
          const r = z >= 0 && z < n.length ? z : 0, u = n[r];
          i ? q(u) : S(u);
        }
        return;
      }
    }
  }, et = pt(ce), xt = X(() => i ? B.length === 0 ? "" : B.length === 1 ? String(B[0][le] ?? "") : `Đã chọn ${B.length} mục` : B.length > 0 ? String(B[0][le] ?? "") : "", [i, B, le]), tt = i && B.length > 0 && !y, vt = J === "auth" || Ce === "md" ? "text-sm" : "text-xs", yt = ae ? "pl-0" : J === "auth" ? "pl-3" : "pl-2.5", bt = tt ? "pr-0.5" : J === "auth" ? "pr-3" : "pr-2.5";
  return /* @__PURE__ */ Xe(
    "div",
    {
      ref: N,
      "data-agv-trigger": "true",
      "data-theme": ce || void 0,
      "data-state": a ? "open" : "closed",
      "aria-expanded": a,
      "aria-invalid": p || void 0,
      "aria-disabled": y || void 0,
      style: {
        ...Je(),
        ...xe
      },
      onMouseEnter: ot,
      onFocus: ot,
      onClick: Le,
      className: dt({
        size: Ce,
        variant: J,
        box: !0,
        defaultRadiusClass: ft(),
        className: `agv-searchlookupedit-wrapper relative inline-flex items-center w-full ${a ? "is-open" : ""} ${y ? "opacity-50 pointer-events-none" : "cursor-text"} ${et} ${qe}`.trim()
      }),
      children: [
        ae ? /* @__PURE__ */ k(
          "span",
          {
            "aria-hidden": "true",
            className: "pl-3 pr-2 shrink-0 inline-flex items-center text-[var(--agv-text-muted)] pointer-events-none",
            children: ae
          }
        ) : null,
        /* @__PURE__ */ k(
          "input",
          {
            ref: w,
            id: Me,
            type: "text",
            disabled: y,
            value: a ? D : xt,
            onChange: Fe,
            onKeyDown: mt,
            placeholder: a ? _e : Be,
            "aria-invalid": p || void 0,
            "aria-describedby": je,
            "aria-errormessage": Ye,
            ...ut,
            className: `agv-searchlookupedit-input flex-1 min-w-0 h-full bg-transparent border-0 ${yt} ${bt} text-foreground outline-none truncate placeholder:text-muted-foreground ${vt} ${y ? "" : a ? "cursor-text" : "cursor-pointer"}`
          }
        ),
        tt && /* @__PURE__ */ k(
          "button",
          {
            type: "button",
            tabIndex: -1,
            "aria-label": "Xóa tất cả lựa chọn",
            onClick: ie,
            className: "agv-inline-clear-destructive w-6 h-full shrink-0 text-sm leading-none",
            children: "×"
          }
        ),
        a && (we.top > 0 || (we.bottom ?? 0) > 0) && /* @__PURE__ */ k(wt, { fallback: null, children: /* @__PURE__ */ k(
          Et,
          {
            theme: ce,
            themeClass: et,
            coords: we,
            multiSelect: i,
            columns: me,
            hasAnySelection: c,
            isAllFilteredSelected: E,
            isFilterRowVisible: $,
            filterStates: ne,
            filterOperators: Ot,
            filteredData: n,
            valueMember: g,
            selectedKeysSet: s,
            isKeyboardNav: ye,
            highlightedIndex: z,
            activeOpMenuCol: F,
            dropdownRef: Ue,
            opMenuRef: Ve,
            tableBodyRef: C,
            theadRef: Pe,
            isKeyboardNavRef: H,
            navSourceRef: h,
            setKeyboardNavActive: R,
            setActiveOpMenuCol: oe,
            handleListNavigationKeyDown: Ze,
            handleClearMultiAll: ie,
            handleFilterRowChange: ht,
            handleFilterOpChange: gt,
            handleToggleMultiRow: q,
            handleSelectSingleRow: S
          }
        ) })
      ]
    }
  );
}
export {
  zt as A,
  Ot as L,
  Mt as a
};
