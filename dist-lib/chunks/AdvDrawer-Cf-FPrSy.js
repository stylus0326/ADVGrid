import { jsx as c, jsxs as L } from "react/jsx-runtime";
import { useState as H, useId as B, useRef as E, useCallback as q, useLayoutEffect as R, useEffect as z, useMemo as A, createContext as X, useContext as U } from "react";
import { createPortal as V } from "react-dom";
import { g as _ } from "./enterpriseEditorUtils-DJeTtQuh.js";
import { g as K } from "./common-Bjggt86Z.js";
const O = X(null);
function k(t) {
  const r = U(O);
  if (!r)
    throw new Error(`${t} must be used inside <Drawer>.`);
  return r;
}
const j = ".agv-comboboxedit-dropdown, .agv-searchlookupedit-dropdown, .agv-calendar-popover, .agv-daterange-popover, .agv-preset-dropdown-menu", re = ({
  open: t,
  onOpenChange: r,
  surfaceTheme: a,
  dismissible: n = !0,
  children: i
}) => {
  const [f, g] = H(t ? "entering" : "closed"), [v, h] = H(0), [m, w] = H(!1), [b, x] = H(!1), y = B(), l = B(), N = E(null), I = E(r);
  I.current = r;
  const D = q(() => {
    n && I.current(!1);
  }, [n]), Y = q((s, d) => {
    w(s), h(d);
  }, []);
  R(() => {
    let s = 0, d = 0, T = 0;
    return t ? (w(!1), h(0), g("entering"), s = window.requestAnimationFrame(() => {
      d = window.requestAnimationFrame(() => {
        g("open");
      });
    })) : (g((S) => S === "closed" ? "closed" : "closing"), w(!1), T = window.setTimeout(() => {
      g("closed"), h(0), w(!1);
    }, 250)), () => {
      s && window.cancelAnimationFrame(s), d && window.cancelAnimationFrame(d), T && window.clearTimeout(T);
    };
  }, [t]), z(() => {
    if (!t || !n) return;
    const s = (d) => {
      d.key !== "Escape" || d.defaultPrevented || document.querySelector(j) || (d.preventDefault(), D());
    };
    return window.addEventListener("keydown", s), () => window.removeEventListener("keydown", s);
  }, [t, n, D]);
  const C = A(
    () => ({
      open: t,
      phase: f,
      dragY: v,
      isDragging: m,
      dismissible: n,
      surfaceTheme: a,
      titleId: y,
      descriptionId: l,
      hasDescription: b,
      setHasDescription: x,
      contentRef: N,
      requestClose: D,
      setDragState: Y
    }),
    [
      t,
      f,
      v,
      m,
      n,
      a,
      y,
      l,
      b,
      D,
      Y
    ]
  );
  return !t && f === "closed" ? null : /* @__PURE__ */ c(O.Provider, { value: C, children: i });
}, G = ({ children: t }) => {
  const { open: r, phase: a, surfaceTheme: n } = k("DrawerPortal");
  if (typeof document > "u" || !r && a === "closed") return null;
  const i = n ? K(n) : "", f = [
    r ? "agv-drawer-portal" : "pointer-events-none",
    "fixed inset-0 z-[10000] select-none",
    i
  ].filter(Boolean).join(" ");
  return V(
    /* @__PURE__ */ c(
      "div",
      {
        "data-slot": "drawer-portal",
        "data-theme": n || void 0,
        "data-agv-popup": r ? "true" : void 0,
        className: f,
        style: _(),
        children: t
      }
    ),
    document.body
  );
}, J = ({
  className: t = "",
  style: r,
  onClick: a,
  onPointerDownCapture: n,
  ...i
}) => {
  const { open: f, phase: g, dragY: v, isDragging: h, dismissible: m, contentRef: w, requestClose: b } = k("DrawerOverlay"), x = E(!1);
  let y = 0;
  if (f && g === "open") {
    const l = w.current?.offsetHeight || 360;
    y = v > 0 ? Math.max(0, 1 - Math.min(1, v / l)) : 1;
  }
  return /* @__PURE__ */ c(
    "div",
    {
      "data-slot": "drawer-overlay",
      "aria-hidden": "true",
      className: `fixed inset-0 ${t}`.trim(),
      style: {
        backgroundColor: "var(--agv-backdrop-bg)",
        opacity: y,
        transition: h ? "none" : "opacity 240ms cubic-bezier(0.32, 0.72, 0, 1)",
        ...r
      },
      onPointerDownCapture: (l) => {
        n?.(l), x.current = !!document.querySelector(j);
      },
      onClick: (l) => {
        if (a?.(l), x.current) {
          x.current = !1;
          return;
        }
        !l.defaultPrevented && l.target === l.currentTarget && m && b();
      },
      ...i
    }
  );
}, oe = ({
  className: t = "",
  style: r,
  children: a,
  onPointerDown: n,
  onPointerMove: i,
  onPointerUp: f,
  onPointerCancel: g,
  onClick: v,
  ...h
}) => {
  const {
    open: m,
    phase: w,
    dragY: b,
    isDragging: x,
    dismissible: y,
    titleId: l,
    descriptionId: N,
    hasDescription: I,
    contentRef: D,
    requestClose: Y,
    setDragState: C
  } = k("DrawerContent"), s = E(null), d = (e) => {
    if (n?.(e), e.defaultPrevented || !m || !y || e.button !== 0 || e.isPrimary === !1) {
      s.current = null;
      return;
    }
    const o = e.target instanceof Element ? e.target : null;
    if (!o) {
      s.current = null;
      return;
    }
    const p = !!o.closest(
      'input, textarea, select, button, a, [role="tab"], [role="listbox"], [role="radiogroup"], [role="radio"], .agv-control, .agv-comboboxedit-wrapper, .agv-datepicker-container, .agv-daterange-picker-wrap'
    ), u = !!(!p && o.closest('[data-slot="drawer-swipe-handle"], [data-slot="drawer-header"]')), P = o.closest('[data-slot="drawer-body"]'), M = !!(!u && P && P.scrollTop <= 1 && !p);
    if (!u && !M) {
      s.current = null;
      return;
    }
    s.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      lastY: e.clientY,
      lastTime: performance.now(),
      vy: 0,
      fromBody: M,
      active: !1
    };
  }, T = (e) => {
    i?.(e);
    const o = s.current;
    if (!o || o.pointerId !== e.pointerId) return;
    const p = e.clientX - o.startX, u = e.clientY - o.startY;
    if (!o.active) {
      if (o.fromBody && u < -6) {
        s.current = null;
        return;
      }
      if (Math.abs(p) > 6 && Math.abs(p) >= Math.abs(u)) {
        s.current = null;
        return;
      }
      if (u > 6 && u > Math.abs(p)) {
        o.active = !0, o.lastY = e.clientY, o.lastTime = performance.now();
        try {
          e.currentTarget.setPointerCapture?.(e.pointerId);
        } catch {
        }
        C(!0, u);
      }
      return;
    }
    const P = performance.now(), M = Math.max(1, P - o.lastTime);
    o.vy = (e.clientY - o.lastY) / M, o.lastY = e.clientY, o.lastTime = P, C(!0, Math.max(0, u));
  }, S = (e) => {
    f?.(e);
    try {
      e.currentTarget.hasPointerCapture?.(e.pointerId) && e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
    }
    const o = s.current;
    if (s.current = null, !o || o.pointerId !== e.pointerId || !o.active) return;
    const p = Math.max(0, e.clientY - o.startY), u = D.current?.offsetHeight || 360;
    p >= Math.min(96, u * 0.28) || o.vy > 0.55 && p >= 28 ? (C(!1, p), Y()) : C(!1, 0);
  }, F = (e) => {
    g?.(e);
    try {
      e.currentTarget.hasPointerCapture?.(e.pointerId) && e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
    }
    const o = s.current;
    s.current = null, o?.active && C(!1, 0);
  };
  let $ = "translate3d(0, 100%, 0)";
  return m && w === "open" && ($ = b > 0 ? `translate3d(0, ${Math.round(b)}px, 0)` : "translate3d(0, 0, 0)"), /* @__PURE__ */ L(G, { children: [
    /* @__PURE__ */ c(J, {}),
    /* @__PURE__ */ c("div", { className: "fixed inset-0 pointer-events-none flex items-end justify-center", children: /* @__PURE__ */ c(
      "div",
      {
        ref: D,
        "data-slot": "drawer-content",
        "data-state": m ? "open" : "closed",
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": l,
        "aria-describedby": I ? N : void 0,
        onPointerDown: d,
        onPointerMove: T,
        onPointerUp: S,
        onPointerCancel: F,
        onClick: (e) => {
          v?.(e), e.stopPropagation();
        },
        style: {
          backgroundColor: "var(--popup-background)",
          borderColor: "var(--popup-border)",
          color: "var(--popover-foreground)",
          boxShadow: "var(--popup-shadow)",
          transform: $,
          transition: x ? "none" : m ? "transform 320ms cubic-bezier(0.32, 0.72, 0, 1)" : "transform 240ms cubic-bezier(0.32, 0.72, 0, 1)",
          ...r
        },
        className: `agv-drawer-content pointer-events-auto relative flex flex-col w-full max-w-none md:mx-auto md:max-w-lg h-auto min-h-[132px] max-h-[min(90dvh,calc(100dvh-var(--safe-area-top,0px)))] rounded-t-xl border-t md:border-x overflow-hidden outline-none ${t}`.trim(),
        ...h,
        children: a
      }
    ) })
  ] });
}, ae = ({
  className: t = "",
  style: r,
  ...a
}) => /* @__PURE__ */ c(
  "div",
  {
    "data-slot": "drawer-swipe-handle",
    "aria-hidden": "true",
    className: `mx-auto mt-3 h-1 w-12 shrink-0 rounded-full touch-none cursor-grab active:cursor-grabbing ${t}`.trim(),
    style: {
      backgroundColor: "color-mix(in srgb, var(--muted-foreground) 30%, transparent)",
      ...r
    },
    ...a
  }
), ne = ({
  className: t = "",
  style: r,
  ...a
}) => /* @__PURE__ */ c(
  "div",
  {
    "data-slot": "drawer-header",
    className: `shrink-0 px-4 sm:px-5 py-3 border-b text-center touch-none ${t}`.trim(),
    style: {
      borderColor: "var(--agv-border)",
      ...r
    },
    ...a
  }
), se = ({
  className: t = "",
  id: r,
  ...a
}) => {
  const { titleId: n } = k("DrawerTitle");
  return /* @__PURE__ */ c(
    "h3",
    {
      id: r ?? n,
      "data-slot": "drawer-title",
      className: `text-xs font-bold uppercase tracking-wider text-foreground ${t}`.trim(),
      ...a
    }
  );
}, ie = ({
  className: t = "",
  id: r,
  ...a
}) => {
  const { descriptionId: n, setHasDescription: i } = k("DrawerDescription");
  return R(() => (i(!0), () => i(!1)), [i]), /* @__PURE__ */ c(
    "p",
    {
      id: r ?? n,
      "data-slot": "drawer-description",
      className: `text-xs mt-1 text-muted-foreground ${t}`.trim(),
      ...a
    }
  );
}, le = ({
  className: t = "",
  ...r
}) => /* @__PURE__ */ c(
  "div",
  {
    "data-slot": "drawer-body",
    className: `min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 sm:px-5 space-y-4 text-xs ${t}`.trim(),
    ...r
  }
), ce = ({
  className: t = "",
  style: r,
  ...a
}) => /* @__PURE__ */ c(
  "div",
  {
    "data-slot": "drawer-footer",
    className: `mt-auto shrink-0 grid grid-cols-2 gap-2 px-4 sm:px-5 pt-3 pb-[calc(0.75rem+var(--safe-area-bottom,0px))] border-t ${t}`.trim(),
    style: {
      backgroundColor: "var(--popup-background)",
      borderColor: "var(--agv-border)",
      ...r
    },
    ...a
  }
), de = ({
  type: t = "button",
  onClick: r,
  ...a
}) => {
  const { requestClose: n } = k("DrawerClose");
  return /* @__PURE__ */ c(
    "button",
    {
      type: t,
      "data-slot": "drawer-close",
      onClick: (i) => {
        r?.(i), i.defaultPrevented || n();
      },
      ...a
    }
  );
};
export {
  re as D,
  oe as a,
  ae as b,
  ne as c,
  se as d,
  ie as e,
  le as f,
  ce as g,
  de as h,
  J as i,
  G as j
};
