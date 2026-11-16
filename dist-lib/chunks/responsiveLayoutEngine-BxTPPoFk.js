import { d as A } from "./gridFormatUtils-wCKPmlrt.js";
const n = {
  PHONE: 768,
  TABLET: 1024,
  DEFAULT_HYSTERESIS: 16
};
function R(e, i, o = n.DEFAULT_HYSTERESIS) {
  return e <= 0 ? i : i === "phone" ? e >= n.TABLET + o ? "pc" : e >= n.PHONE + o ? "tablet" : "phone" : i === "tablet" ? e < n.PHONE - o ? "phone" : e >= n.TABLET + o ? "pc" : "tablet" : e < n.PHONE - o ? "phone" : e < n.TABLET - o ? "tablet" : "pc";
}
function O(e) {
  return e < n.PHONE ? "phone" : e < n.TABLET ? "tablet" : "pc";
}
function L(e) {
  const {
    containerEl: i,
    layoutMode: o,
    debounceMs: l,
    hysteresisBuffer: d,
    currentModeRef: u,
    isFirstMeasurementRef: a,
    debounceTimerRef: r,
    containerWidthRef: p,
    setAutoActiveMode: T
  } = e, E = (t) => {
    if (t <= 0 || (p.current = t, o !== A.AUTO)) return;
    if (a.current) {
      a.current = !1;
      const s = O(t);
      u.current = s, T(s);
      return;
    }
    const c = R(t, u.current, d);
    if (c === u.current) {
      r.current && (clearTimeout(r.current), r.current = null);
      return;
    }
    r.current && clearTimeout(r.current), r.current = setTimeout(() => {
      u.current = c, T(c), r.current = null;
    }, l);
  }, f = () => {
    const t = i ? i.clientWidth : window.innerWidth;
    E(t);
  };
  if (f(), typeof ResizeObserver < "u" && i) {
    const t = new ResizeObserver((c) => {
      for (const s of c)
        E(s.contentRect.width);
    });
    return t.observe(i), () => {
      t.disconnect(), r.current && clearTimeout(r.current);
    };
  }
  return window.addEventListener("resize", f), () => {
    window.removeEventListener("resize", f), r.current && clearTimeout(r.current);
  };
}
export {
  n as GRID_BREAKPOINTS,
  L as attachResponsiveLayoutObserver,
  O as getInitialGridMode,
  R as resolveActiveModeWithHysteresis
};
