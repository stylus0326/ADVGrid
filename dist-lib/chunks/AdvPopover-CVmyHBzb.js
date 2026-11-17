import { jsxs as T, Fragment as O, jsx as F } from "react/jsx-runtime";
import { useState as S, useRef as L, useCallback as $, useLayoutEffect as W, useEffect as P } from "react";
import { createPortal as q } from "react-dom";
import { u as _, a as B, g as D } from "./enterpriseEditorUtils-DJeTtQuh.js";
import { S as U, g as G } from "./common-29M8PlVv.js";
function V(r, t) {
  return B(r, t) && r.isFlipUp === t.isFlipUp && r.arrowLeft === t.arrowLeft;
}
function j(r, t) {
  if (t) {
    const n = t.width ?? 0, a = t.height ?? 0;
    return {
      left: t.left,
      top: t.top,
      right: t.right ?? t.left + n,
      bottom: t.bottom ?? t.top + a,
      width: n,
      height: a
    };
  }
  if (!r) return null;
  const o = r.getBoundingClientRect();
  return {
    left: o.left,
    top: o.top,
    right: o.right,
    bottom: o.bottom,
    width: o.width,
    height: o.height
  };
}
function z(r, t, o, n, a, w) {
  if (typeof window > "u") return null;
  const e = j(r, t);
  if (!e) return null;
  const b = window.innerHeight, k = window.innerWidth, i = o ? o.offsetWidth : w, u = o ? o.offsetHeight : 180, g = b - e.bottom - a - 12, h = e.top - a - 12, C = n === "top" || n === "top-start" || n === "top-end" ? !(h < u && g > h) : g < u && h > g;
  let p;
  const d = e.width > 0 && e.width < 32 ? Math.ceil((32 - e.width) / 2) : 0;
  n === "bottom-end" || n === "top-end" ? p = Math.round(e.right + d - i) : n === "bottom" || n === "top" ? p = Math.round(e.left + e.width / 2 - i / 2) : e.width === 0 ? p = Math.round(e.left - 15) : p = Math.round(e.left - d);
  const l = Math.max(12, k - i - 12);
  p > l && (p = l), p < 12 && (p = 12);
  const f = Math.round(C ? e.top - u - a : e.bottom + a), c = Math.max(12, Math.min(Math.max(12, b - u - 12), f)), y = e.left + e.width / 2, m = Math.max(
    10,
    Math.min(Math.max(10, i - 20), Math.round(y - p - 5))
  );
  return { top: c, left: p, isFlipUp: C, arrowLeft: m };
}
const H = ".agv-select-portal, .agv-portal-dropdown, .agv-calendar-popover, .agv-daterange-popover, .agv-preset-dropdown-menu, .agv-floating-popup, .agv-multi-filter-popup, .agv-multi-filter-op-menu, .agv-query-dropdown, .agv-lookup-op-menu", K = ({
  isOpen: r,
  anchorEl: t = null,
  virtualAnchor: o = null,
  onClose: n,
  children: a,
  placement: w = "bottom-end",
  showArrow: e = !0,
  offset: b,
  theme: k = U.LIGHT,
  width: i = "auto",
  minWidth: u = 200,
  maxWidth: g = "calc(100vw - 24px)",
  paddingClassName: h = "p-3",
  contentClassName: x = "",
  zIndex: C = 1250,
  ignoreClickOutsideSelectors: p = `${H}, [data-agv-popover-trigger="true"]`
}) => {
  const d = L(null), l = L(t);
  l.current = t;
  const f = L(o);
  f.current = o;
  const c = !!(t || o), y = b ?? (e ? 10 : 6), m = typeof i == "number" ? i : u, [v, E] = S(null), M = $(() => {
    const s = z(
      l.current,
      f.current,
      d.current,
      w,
      y,
      m
    );
    s && E((R) => R && V(R, s) ? R : s);
  }, [w, y, m]);
  if (W(() => {
    if (!r || !c) {
      E(null);
      return;
    }
    M();
    const s = requestAnimationFrame(M);
    return () => cancelAnimationFrame(s);
  }, [
    r,
    c,
    t,
    o?.left,
    o?.top,
    o?.width,
    o?.height,
    M
  ]), P(() => {
    if (!r || !d.current || typeof ResizeObserver > "u") return;
    const s = new ResizeObserver(() => {
      M();
    });
    return s.observe(d.current), () => s.disconnect();
  }, [r, M, v !== null]), _(
    r && c,
    n,
    M,
    l,
    d,
    void 0,
    p
  ), P(() => {
    if (!r) return;
    const s = (R) => {
      R.key === "Escape" && n();
    };
    return window.addEventListener("keydown", s), () => window.removeEventListener("keydown", s);
  }, [r, n]), !r || !c || !v || typeof document > "u")
    return null;
  const I = D(), N = G(k);
  return q(
    /* @__PURE__ */ F(
      "div",
      {
        className: `fixed inset-0 pointer-events-none ${N}`,
        style: { ...I, zIndex: C },
        children: /* @__PURE__ */ T(
          "div",
          {
            ref: d,
            "data-agv-popup": "true",
            onClick: (s) => s.stopPropagation(),
            onWheel: (s) => s.stopPropagation(),
            className: `agv-popup-panel pointer-events-auto absolute ${h} select-none ${v.isFlipUp ? "agv-spring-up" : "agv-spring-down"} ${x}`,
            style: {
              top: `${v.top}px`,
              left: `${v.left}px`,
              width: typeof i == "number" ? `${i}px` : i,
              minWidth: `${u}px`,
              maxWidth: g,
              backgroundColor: "var(--popup-background)",
              borderColor: "var(--popup-border)",
              color: "var(--popover-foreground)",
              boxShadow: "var(--popup-shadow)"
            },
            children: [
              e && /* @__PURE__ */ F(
                "div",
                {
                  "aria-hidden": "true",
                  className: `absolute w-2.5 h-2.5 rotate-45 border pointer-events-none ${v.isFlipUp ? "-bottom-[6px] border-t-0 border-l-0" : "-top-[6px] border-b-0 border-r-0"}`,
                  style: {
                    left: `${v.arrowLeft}px`,
                    backgroundColor: "var(--popup-background)",
                    borderColor: "var(--popup-border)"
                  }
                }
              ),
              a
            ]
          }
        )
      }
    ),
    document.body
  );
}, A = ({
  trigger: r,
  content: t,
  isOpen: o,
  defaultOpen: n = !1,
  onOpenChange: a,
  placement: w = "bottom-end",
  showArrow: e = !0,
  offset: b,
  theme: k = U.LIGHT,
  className: i = "",
  contentClassName: u = "",
  width: g = "auto",
  minWidth: h = 200
}) => {
  const x = o !== void 0, [C, p] = S(n), d = x ? o : C, l = L(null), f = $(
    (m) => {
      x || p(m), a?.(m);
    },
    [x, a]
  ), c = $(() => f(!1), [f]), y = $(() => {
    f(!d);
  }, [d, f]);
  return /* @__PURE__ */ T(O, { children: [
    /* @__PURE__ */ F(
      "div",
      {
        ref: l,
        onClick: y,
        className: `inline-flex shrink-0 ${i}`,
        children: r
      }
    ),
    /* @__PURE__ */ F(
      K,
      {
        isOpen: d,
        anchorEl: l.current,
        onClose: c,
        placement: w,
        showArrow: e,
        offset: b,
        theme: k,
        width: g,
        minWidth: h,
        contentClassName: u,
        ignoreClickOutsideSelectors: H,
        children: typeof t == "function" ? t({ close: c }) : t
      }
    )
  ] });
};
export {
  K as A,
  H as D,
  A as a
};
