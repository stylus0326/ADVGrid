import { N as J, i as Z, g as Q } from "./chunks/AdvButton-Ck5SixaL.js";
import { A as Se, B as Oe, k as Te, C as _e, l as he, m as Le, n as xe, o as Ne, p as ge, q as Re, r as be, s as we, t as Ae, u as Ee, v as Me, w as Pe, x as Ue, y as Be, z as ye, E as Ie, j as De, F as Fe, H as $e, d as He, I as ke, J as Ve, K as ze, P as je, L as We, M as Ge, O as Xe } from "./chunks/AdvButton-Ck5SixaL.js";
import { A as Ke, a as Ye, L as Je } from "./chunks/AdvSearchLookUpEdit-C7bSfQ7n.js";
import { a as Qe, b as et, A as tt } from "./chunks/AdvDatePicker-C4uBzJBl.js";
import { jsx as n, jsxs as P, Fragment as $ } from "react/jsx-runtime";
import F, { useContext as ee, useId as te, useRef as A, useState as I, useLayoutEffect as H, createContext as oe, useCallback as j, useEffect as D } from "react";
import { createPortal as W } from "react-dom";
import { a as G, g as X } from "./chunks/enterpriseEditorUtils-DJeTtQuh.js";
import { c as rt, n as st, u as nt } from "./chunks/enterpriseEditorUtils-DJeTtQuh.js";
import { g as q, S as K } from "./chunks/common-29M8PlVv.js";
import { A as it } from "./chunks/AdvOverlayScroll-CipuwW1l.js";
import { a as ct } from "./chunks/AdvPopover-CVmyHBzb.js";
import { A as ut } from "./chunks/AdvSelect-Bni0Pb7c.js";
import { D as ft, f as mt, h as vt, a as Ct, e as St, g as Ot, c as Tt, i as _t, j as ht, b as Lt, d as xt } from "./chunks/AdvDrawer-BPHcjNKA.js";
import { M as gt } from "./chunks/MorphCheckbox-S5ZNer1R.js";
import { e as bt } from "./chunks/gridFormatUtils-wCKPmlrt.js";
import { u as At } from "./chunks/useVirtualList-CH5KMFFG.js";
const re = F.forwardRef(function({
  size: m = "md",
  variant: i = "default",
  leadingIcon: l,
  endAdornment: e,
  allowAutofill: x = !1,
  invalid: N,
  type: C = "text",
  className: c = "",
  containerClassName: d = "",
  disabled: o = !1,
  readOnly: r,
  "aria-invalid": u,
  ...S
}, p) {
  const v = !!(N || u), T = x ? void 0 : J, L = l ? "pl-9" : "pl-3", _ = e ? "pr-12" : "pr-3", t = Z({
    size: m,
    variant: i,
    defaultRadiusClass: Q(),
    className: [
      "w-full min-w-0 py-1 outline-none placeholder:text-muted-foreground",
      "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
      r && i === "default" ? "text-muted-foreground" : "text-foreground",
      L,
      _,
      c
    ].filter(Boolean).join(" ")
  }), g = /* @__PURE__ */ n(
    "input",
    {
      ref: p,
      type: C,
      disabled: o,
      readOnly: r,
      "aria-invalid": v || void 0,
      className: t,
      ...T,
      ...S
    }
  );
  return !l && !e ? g : /* @__PURE__ */ P("div", { className: `relative flex items-center min-w-0 w-full ${d}`.trim(), children: [
    l ? /* @__PURE__ */ n(
      "span",
      {
        "aria-hidden": "true",
        className: "pointer-events-none absolute left-3 z-10 inline-flex items-center justify-center text-[var(--agv-text-muted)]",
        children: l
      }
    ) : null,
    g,
    e ? /* @__PURE__ */ n("div", { className: "absolute right-2 z-10 flex items-center", children: e }) : null
  ] });
});
re.displayName = "AdvInput";
const Y = oe(void 0);
function ue({
  labelPosition: a = "border",
  children: m
}) {
  return /* @__PURE__ */ n(Y.Provider, { value: a, children: m });
}
function z(...a) {
  const m = a.flatMap((i) => i ? i.split(/\s+/).filter(Boolean) : []);
  return m.length > 0 ? Array.from(new Set(m)).join(" ") : void 0;
}
const se = ({
  label: a,
  labelPosition: m,
  required: i = !1,
  error: l,
  hint: e,
  htmlFor: x,
  labelBackground: N,
  theme: C,
  className: c = "",
  labelClassName: d = "",
  children: o
}) => {
  const r = ee(Y), u = m ?? r ?? "top", S = te(), p = F.isValidElement(o), v = p ? o.props : {}, T = x || v.id || `${S}-control`, L = e ? `${S}-hint` : void 0, _ = !!l, t = _ ? `${S}-error` : void 0, g = z(v["aria-describedby"], L, t), s = !!(_ || v["aria-invalid"] || v.invalid), R = p ? F.cloneElement(o, {
    id: T,
    "aria-describedby": g,
    "aria-errormessage": z(v["aria-errormessage"], t),
    "aria-invalid": s || void 0,
    ...typeof o.type == "string" && i ? { required: v.required ?? !0 } : {}
  }) : o, f = u === "border", E = A(null), [M, b] = I(0);
  H(() => {
    if (!f) {
      b(0);
      return;
    }
    const w = E.current;
    if (!w) return;
    const y = () => {
      const k = Math.ceil(w.getBoundingClientRect().width);
      b((V) => V === k ? V : k);
    };
    if (y(), typeof ResizeObserver > "u") return;
    const U = new ResizeObserver(() => y());
    return U.observe(w), () => U.disconnect();
  }, [f, a, i]);
  const h = f && M > 0, B = f ? {
    ...N ? { "--form-field-label-background": N } : {},
    ...h ? { "--agv-notch-w": `${M}px` } : {}
  } : void 0, O = /* @__PURE__ */ P(
    "label",
    {
      ref: f ? E : void 0,
      htmlFor: T,
      className: [
        "text-xs leading-4 font-medium select-none flex items-center gap-1 min-w-0",
        f ? "agv-field-label absolute top-2 left-3 z-20 max-w-[calc(100%-24px)] -translate-y-1/2 bg-control-surface px-1 transition-colors" : "",
        s ? "text-[var(--destructive)]" : f ? "text-[var(--agv-text-main)]" : "text-[var(--agv-text-muted)]",
        d
      ].filter(Boolean).join(" "),
      children: [
        /* @__PURE__ */ n("span", { className: "min-w-0 truncate", children: a }),
        i ? /* @__PURE__ */ n("span", { className: "shrink-0 text-[var(--destructive)]", "aria-hidden": "true", children: "*" }) : null
      ]
    }
  );
  return /* @__PURE__ */ P(
    "div",
    {
      "data-theme": C || void 0,
      "data-label-position": u,
      className: `min-w-0 space-y-1 ${c}`.trim(),
      children: [
        f ? /* @__PURE__ */ P(
          "div",
          {
            style: B,
            "data-invalid": s ? "true" : void 0,
            "data-notch-ready": h ? "true" : void 0,
            className: "agv-field-border group/field relative min-w-0 pt-2",
            children: [
              O,
              R,
              /* @__PURE__ */ n("span", { "aria-hidden": "true", className: "agv-field-notch-frame" })
            ]
          }
        ) : /* @__PURE__ */ P($, { children: [
          O,
          R
        ] }),
        e ? /* @__PURE__ */ n("p", { id: L, className: "text-xs leading-4 text-[var(--agv-text-muted)]", children: e }) : null,
        _ ? /* @__PURE__ */ n(
          "div",
          {
            id: t,
            role: "alert",
            className: "text-xs leading-4 text-[var(--destructive)]",
            children: l
          }
        ) : null
      ]
    }
  );
}, pe = se, fe = ({
  trigger: a,
  content: m,
  openDelay: i = 150,
  closeDelay: l = 200,
  width: e = 280,
  theme: x = K.LIGHT,
  className: N = "",
  contentClassName: C = ""
}) => {
  const [c, d] = I(!1), o = A(null), r = A(null), u = A(null), S = A(null), [p, v] = I(null), T = j(() => {
    if (!u.current || typeof window > "u") return;
    const s = u.current.getBoundingClientRect(), R = window.innerHeight, f = window.innerWidth, E = typeof e == "number" ? e : 280, M = S.current ? S.current.offsetHeight : 160, b = R - s.bottom - 8, h = s.top - 8, B = b < M && h > b;
    let O = Math.round(s.left);
    O + E > f - 12 && (O = Math.max(12, f - E - 12)), O < 12 && (O = 12);
    const y = { top: B ? Math.max(12, Math.round(s.top - M - 6)) : Math.round(s.bottom + 6), left: O, isFlipUp: B };
    v((U) => U && G(U, y) ? U : y);
  }, [e]);
  H(() => {
    c && T();
  }, [c, T]);
  const L = () => {
    clearTimeout(r.current), o.current = setTimeout(() => {
      T(), d(!0);
    }, i);
  }, _ = () => {
    clearTimeout(o.current), r.current = setTimeout(() => {
      d(!1);
    }, l);
  };
  D(() => () => {
    clearTimeout(o.current), clearTimeout(r.current);
  }, []), D(() => {
    if (!c) return;
    const s = () => {
      clearTimeout(o.current), clearTimeout(r.current), d(!1);
    };
    return window.addEventListener("scroll", s, { passive: !0, capture: !0 }), () => window.removeEventListener("scroll", s, { capture: !0 });
  }, [c]);
  const t = X(), g = q(x);
  return /* @__PURE__ */ P($, { children: [
    /* @__PURE__ */ n(
      "div",
      {
        ref: u,
        onMouseEnter: L,
        onMouseLeave: _,
        className: `inline-flex shrink-0 ${N}`,
        children: a
      }
    ),
    c && p && typeof document < "u" && W(
      /* @__PURE__ */ n(
        "div",
        {
          className: `fixed inset-0 pointer-events-none z-[999999] ${g}`,
          style: t,
          children: /* @__PURE__ */ n(
            "div",
            {
              ref: S,
              onMouseEnter: L,
              onMouseLeave: _,
              className: `agv-popup-panel pointer-events-auto absolute p-3.5 select-none ${p.isFlipUp ? "agv-spring-up" : "agv-spring-down"} ${C}`,
              style: {
                top: `${p.top}px`,
                left: `${p.left}px`,
                width: typeof e == "number" ? `${e}px` : e,
                backgroundColor: "var(--popup-background)",
                borderColor: "var(--popup-border)",
                color: "var(--popover-foreground)",
                boxShadow: "var(--popup-shadow)"
              },
              children: m
            }
          )
        }
      ),
      document.body
    )
  ] });
}, me = ({
  content: a,
  children: m,
  delay: i = 200,
  placement: l = "auto",
  theme: e = K.LIGHT,
  disabled: x = !1,
  className: N = ""
}) => {
  const [C, c] = I(!1), d = A(null), o = A(null), r = A(null), [u, S] = I(null), p = j(() => {
    if (!o.current || typeof window > "u") return;
    const t = o.current.getBoundingClientRect(), g = window.innerHeight, s = window.innerWidth, R = r.current ? r.current.offsetWidth : 120, f = r.current ? r.current.offsetHeight : 28, E = g - t.bottom - 6, M = t.top - 6, b = l === "top" || l === "auto" && M > 36 && E < 40;
    let h = Math.round(t.left + t.width / 2 - R / 2);
    h + R > s - 8 && (h = Math.max(8, s - R - 8)), h < 8 && (h = 8);
    const O = { top: b ? Math.max(8, Math.round(t.top - f - 6)) : Math.round(t.bottom + 6), left: h, isFlipUp: b };
    S((w) => w && G(w, O) ? w : O);
  }, [l]);
  H(() => {
    C && p();
  }, [C, p]);
  const v = () => {
    x || !a || (clearTimeout(d.current), d.current = setTimeout(() => {
      p(), c(!0);
    }, i));
  }, T = () => {
    clearTimeout(d.current), c(!1);
  };
  D(() => () => clearTimeout(d.current), []), D(() => {
    if (!C) return;
    const t = () => {
      clearTimeout(d.current), c(!1);
    };
    return window.addEventListener("scroll", t, { passive: !0, capture: !0 }), () => window.removeEventListener("scroll", t, { capture: !0 });
  }, [C]);
  const L = X(), _ = q(e);
  return /* @__PURE__ */ P($, { children: [
    /* @__PURE__ */ n(
      "div",
      {
        ref: o,
        onMouseEnter: v,
        onMouseLeave: T,
        className: `inline-flex shrink-0 ${N}`,
        children: m
      }
    ),
    C && u && !x && !!a && typeof document < "u" && W(
      /* @__PURE__ */ n(
        "div",
        {
          className: `fixed inset-0 pointer-events-none z-[999999] ${_}`,
          style: L,
          children: /* @__PURE__ */ n(
            "div",
            {
              ref: r,
              className: `agv-popup-panel absolute px-2.5 py-1 text-xs font-sans select-none whitespace-nowrap ${u.isFlipUp ? "agv-spring-up" : "agv-spring-down"}`,
              style: {
                top: `${u.top}px`,
                left: `${u.left}px`,
                backgroundColor: "var(--popup-background)",
                color: "var(--popover-foreground)",
                borderColor: "var(--popup-border)",
                boxShadow: "var(--popup-shadow)"
              },
              children: a
            }
          )
        }
      ),
      document.body
    )
  ] });
};
export {
  Se as AdvButton,
  Ke as AdvComboBoxEdit,
  Qe as AdvDatePicker,
  et as AdvDatePresetSelect,
  tt as AdvDateRangePicker,
  se as AdvFormField,
  ue as AdvFormFieldOverlayScope,
  fe as AdvHoverCard,
  re as AdvInput,
  it as AdvOverlayScroll,
  ct as AdvPopover,
  Ye as AdvSearchLookUpEdit,
  ut as AdvSelect,
  me as AdvTooltip,
  Oe as BUTTON_FOCUS_VISIBLE_CLASS,
  Te as Button,
  _e as CONTROL_BOX_CLASS,
  he as CONTROL_BOX_MD_CLASS,
  Le as CONTROL_BOX_SM_CLASS,
  xe as CONTROL_BUTTON_DESTRUCTIVE_MD_CLASS,
  Ne as CONTROL_BUTTON_DESTRUCTIVE_SM_CLASS,
  ge as CONTROL_BUTTON_GHOST_MD_CLASS,
  Re as CONTROL_BUTTON_GHOST_SM_CLASS,
  be as CONTROL_BUTTON_OUTLINE_MD_CLASS,
  we as CONTROL_BUTTON_OUTLINE_SM_CLASS,
  Ae as CONTROL_BUTTON_PRIMARY_MD_CLASS,
  Ee as CONTROL_BUTTON_PRIMARY_SM_CLASS,
  Me as CONTROL_FOCUS_CLASS,
  Pe as CONTROL_HOVER_CLASS,
  Ue as CONTROL_ICON_BUTTON_DESTRUCTIVE_SM_CLASS,
  Be as CONTROL_ICON_BUTTON_GHOST_SM_CLASS,
  ye as CONTROL_ICON_BUTTON_OUTLINE_SM_CLASS,
  Ie as CONTROL_INPUT_MD_CLASS,
  De as CONTROL_INPUT_SM_CLASS,
  Fe as CONTROL_POPUP_OPEN_CLASS,
  $e as CONTROL_SIZE_CLASS,
  He as CONTROL_SURFACE_CLASS,
  ke as CONTROL_TEXTAREA_CLASS,
  ft as Drawer,
  mt as DrawerBody,
  vt as DrawerClose,
  Ct as DrawerContent,
  St as DrawerDescription,
  Ot as DrawerFooter,
  Tt as DrawerHeader,
  _t as DrawerOverlay,
  ht as DrawerPortal,
  Lt as DrawerSwipeHandle,
  xt as DrawerTitle,
  pe as FormField,
  Je as LOOKUP_FILTER_OPERATORS,
  gt as MorphCheckbox,
  Ve as POPUP_ITEM_CLASS,
  ze as POPUP_MENU_CLASS,
  je as POPUP_PANEL_CLASS,
  We as buttonVariants,
  rt as computeEditorCoords,
  bt as formatGridDateValue,
  Ge as getButtonClass,
  Xe as getControlSizeClass,
  Z as getControlSurfaceClasses,
  X as getPortalThemeVars,
  st as normalizeSearchText,
  nt as useClickOutside,
  At as useVirtualList
};
