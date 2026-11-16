import { A as oe, B as te, j as re, C as se, k as ne, l as ae, m as ce, n as ue, o as le, p as ie, q as pe, r as de, s as Se, t as Te, u as Oe, v as _e, w as Ce, x as fe, y as Le, z as me, E as ve, F as Ae, H as Ne, d as he, I as Re, J as Me, K as we, P as Ee, L as xe, M as ge, i as Ue } from "./chunks/AdvButton-B7j0puyb.js";
import { A as be, a as Be, L as De } from "./chunks/AdvSearchLookUpEdit-BgfrN8Y8.js";
import { a as ye, b as He, A as Fe } from "./chunks/AdvDatePicker-C36Zi9lB.js";
import { jsxs as y, Fragment as H, jsx as S } from "react/jsx-runtime";
import { useState as w, useRef as d, useCallback as F, useLayoutEffect as k, useEffect as E } from "react";
import { createPortal as $ } from "react-dom";
import { a as V, g as G } from "./chunks/enterpriseEditorUtils-DJeTtQuh.js";
import { c as $e, n as Ve, u as Ge } from "./chunks/enterpriseEditorUtils-DJeTtQuh.js";
import { g as z, S as W } from "./chunks/common-Bjggt86Z.js";
import { A as We } from "./chunks/AdvOverlayScroll-CipuwW1l.js";
import { a as Xe } from "./chunks/AdvPopover-D5QeywtP.js";
import { A as Ke } from "./chunks/AdvSelect-DRrnhZaQ.js";
import { D as Je, f as Ze, h as Qe, a as eo, e as oo, g as to, c as ro, i as so, j as no, b as ao, d as co } from "./chunks/AdvDrawer-Cf-FPrSy.js";
import { M as lo } from "./chunks/MorphCheckbox-S5ZNer1R.js";
import { e as po } from "./chunks/gridFormatUtils-wCKPmlrt.js";
import { u as To } from "./chunks/useVirtualList-CH5KMFFG.js";
const J = ({
  trigger: T,
  content: x,
  openDelay: g = 150,
  closeDelay: O = 200,
  width: n = 280,
  theme: m = W.LIGHT,
  className: U = "",
  contentClassName: i = ""
}) => {
  const [r, s] = w(!1), a = d(null), t = d(null), c = d(null), _ = d(null), [u, P] = w(null), C = F(() => {
    if (!c.current || typeof window > "u") return;
    const o = c.current.getBoundingClientRect(), f = window.innerHeight, N = window.innerWidth, h = typeof n == "number" ? n : 280, R = _.current ? _.current.offsetHeight : 160, L = f - o.bottom - 8, p = o.top - 8, B = L < R && p > L;
    let l = Math.round(o.left);
    l + h > N - 12 && (l = Math.max(12, N - h - 12)), l < 12 && (l = 12);
    const I = { top: B ? Math.max(12, Math.round(o.top - R - 6)) : Math.round(o.bottom + 6), left: l, isFlipUp: B };
    P((D) => D && V(D, I) ? D : I);
  }, [n]);
  k(() => {
    r && C();
  }, [r, C]);
  const v = () => {
    clearTimeout(t.current), a.current = setTimeout(() => {
      C(), s(!0);
    }, g);
  }, A = () => {
    clearTimeout(a.current), t.current = setTimeout(() => {
      s(!1);
    }, O);
  };
  E(() => () => {
    clearTimeout(a.current), clearTimeout(t.current);
  }, []), E(() => {
    if (!r) return;
    const o = () => {
      clearTimeout(a.current), clearTimeout(t.current), s(!1);
    };
    return window.addEventListener("scroll", o, { passive: !0, capture: !0 }), () => window.removeEventListener("scroll", o, { capture: !0 });
  }, [r]);
  const e = G(), b = z(m);
  return /* @__PURE__ */ y(H, { children: [
    /* @__PURE__ */ S(
      "div",
      {
        ref: c,
        onMouseEnter: v,
        onMouseLeave: A,
        className: `inline-flex shrink-0 ${U}`,
        children: T
      }
    ),
    r && u && typeof document < "u" && $(
      /* @__PURE__ */ S(
        "div",
        {
          className: `fixed inset-0 pointer-events-none z-[999999] ${b}`,
          style: e,
          children: /* @__PURE__ */ S(
            "div",
            {
              ref: _,
              onMouseEnter: v,
              onMouseLeave: A,
              className: `agv-popup-panel pointer-events-auto absolute p-3.5 select-none ${u.isFlipUp ? "agv-spring-up" : "agv-spring-down"} ${i}`,
              style: {
                top: `${u.top}px`,
                left: `${u.left}px`,
                width: typeof n == "number" ? `${n}px` : n,
                backgroundColor: "var(--popup-background)",
                borderColor: "var(--popup-border)",
                color: "var(--popover-foreground)",
                boxShadow: "var(--popup-shadow)"
              },
              children: x
            }
          )
        }
      ),
      document.body
    )
  ] });
}, Z = ({
  content: T,
  children: x,
  delay: g = 200,
  placement: O = "auto",
  theme: n = W.LIGHT,
  disabled: m = !1,
  className: U = ""
}) => {
  const [i, r] = w(!1), s = d(null), a = d(null), t = d(null), [c, _] = w(null), u = F(() => {
    if (!a.current || typeof window > "u") return;
    const e = a.current.getBoundingClientRect(), b = window.innerHeight, o = window.innerWidth, f = t.current ? t.current.offsetWidth : 120, N = t.current ? t.current.offsetHeight : 28, h = b - e.bottom - 6, R = e.top - 6, L = O === "top" || O === "auto" && R > 36 && h < 40;
    let p = Math.round(e.left + e.width / 2 - f / 2);
    p + f > o - 8 && (p = Math.max(8, o - f - 8)), p < 8 && (p = 8);
    const l = { top: L ? Math.max(8, Math.round(e.top - N - 6)) : Math.round(e.bottom + 6), left: p, isFlipUp: L };
    _((M) => M && V(M, l) ? M : l);
  }, [O]);
  k(() => {
    i && u();
  }, [i, u]);
  const P = () => {
    m || !T || (clearTimeout(s.current), s.current = setTimeout(() => {
      u(), r(!0);
    }, g));
  }, C = () => {
    clearTimeout(s.current), r(!1);
  };
  E(() => () => clearTimeout(s.current), []), E(() => {
    if (!i) return;
    const e = () => {
      clearTimeout(s.current), r(!1);
    };
    return window.addEventListener("scroll", e, { passive: !0, capture: !0 }), () => window.removeEventListener("scroll", e, { capture: !0 });
  }, [i]);
  const v = G(), A = z(n);
  return /* @__PURE__ */ y(H, { children: [
    /* @__PURE__ */ S(
      "div",
      {
        ref: a,
        onMouseEnter: P,
        onMouseLeave: C,
        className: `inline-flex shrink-0 ${U}`,
        children: x
      }
    ),
    i && c && !m && !!T && typeof document < "u" && $(
      /* @__PURE__ */ S(
        "div",
        {
          className: `fixed inset-0 pointer-events-none z-[999999] ${A}`,
          style: v,
          children: /* @__PURE__ */ S(
            "div",
            {
              ref: t,
              className: `agv-popup-panel absolute px-2.5 py-1 text-xs font-sans select-none whitespace-nowrap ${c.isFlipUp ? "agv-spring-up" : "agv-spring-down"}`,
              style: {
                top: `${c.top}px`,
                left: `${c.left}px`,
                backgroundColor: "var(--popup-background)",
                color: "var(--popover-foreground)",
                borderColor: "var(--popup-border)",
                boxShadow: "var(--popup-shadow)"
              },
              children: T
            }
          )
        }
      ),
      document.body
    )
  ] });
};
export {
  oe as AdvButton,
  be as AdvComboBoxEdit,
  ye as AdvDatePicker,
  He as AdvDatePresetSelect,
  Fe as AdvDateRangePicker,
  J as AdvHoverCard,
  We as AdvOverlayScroll,
  Xe as AdvPopover,
  Be as AdvSearchLookUpEdit,
  Ke as AdvSelect,
  Z as AdvTooltip,
  te as BUTTON_FOCUS_VISIBLE_CLASS,
  re as Button,
  se as CONTROL_BOX_CLASS,
  ne as CONTROL_BOX_MD_CLASS,
  ae as CONTROL_BOX_SM_CLASS,
  ce as CONTROL_BUTTON_DESTRUCTIVE_MD_CLASS,
  ue as CONTROL_BUTTON_DESTRUCTIVE_SM_CLASS,
  le as CONTROL_BUTTON_GHOST_MD_CLASS,
  ie as CONTROL_BUTTON_GHOST_SM_CLASS,
  pe as CONTROL_BUTTON_OUTLINE_MD_CLASS,
  de as CONTROL_BUTTON_OUTLINE_SM_CLASS,
  Se as CONTROL_BUTTON_PRIMARY_MD_CLASS,
  Te as CONTROL_BUTTON_PRIMARY_SM_CLASS,
  Oe as CONTROL_FOCUS_CLASS,
  _e as CONTROL_HOVER_CLASS,
  Ce as CONTROL_ICON_BUTTON_DESTRUCTIVE_SM_CLASS,
  fe as CONTROL_ICON_BUTTON_GHOST_SM_CLASS,
  Le as CONTROL_ICON_BUTTON_OUTLINE_SM_CLASS,
  me as CONTROL_INPUT_MD_CLASS,
  ve as CONTROL_INPUT_SM_CLASS,
  Ae as CONTROL_POPUP_OPEN_CLASS,
  Ne as CONTROL_SIZE_CLASS,
  he as CONTROL_SURFACE_CLASS,
  Re as CONTROL_TEXTAREA_CLASS,
  Je as Drawer,
  Ze as DrawerBody,
  Qe as DrawerClose,
  eo as DrawerContent,
  oo as DrawerDescription,
  to as DrawerFooter,
  ro as DrawerHeader,
  so as DrawerOverlay,
  no as DrawerPortal,
  ao as DrawerSwipeHandle,
  co as DrawerTitle,
  De as LOOKUP_FILTER_OPERATORS,
  lo as MorphCheckbox,
  Me as POPUP_ITEM_CLASS,
  we as POPUP_MENU_CLASS,
  Ee as POPUP_PANEL_CLASS,
  xe as buttonVariants,
  $e as computeEditorCoords,
  po as formatGridDateValue,
  ge as getButtonClass,
  Ue as getControlSizeClass,
  G as getPortalThemeVars,
  Ve as normalizeSearchText,
  Ge as useClickOutside,
  To as useVirtualList
};
