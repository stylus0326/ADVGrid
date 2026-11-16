import { useRef as f, useEffect as h } from "react";
function M(t, e) {
  return {};
}
function x(t, e = 260, n = 200) {
  if (!t) return { top: 0, bottom: 0, left: 0, width: n, maxHeight: e, isFlipUp: !1 };
  const o = t.getBoundingClientRect(), r = window.innerHeight, i = window.innerWidth, s = r - o.bottom - 10, a = o.top - 10, u = Math.max(n, Math.round(o.width));
  let c = Math.round(o.left);
  c + u > i - 10 && (c = Math.max(10, i - u - 10)), c < 10 && (c = 10);
  const l = s < e && a > s, m = Math.min(e, Math.max(120, l ? a : s)), w = l ? Math.max(10, Math.round(o.top - m - 4)) : Math.round(o.bottom + 4), p = Math.round(r - o.top + 4);
  return {
    top: w,
    bottom: p,
    left: c,
    width: u,
    maxHeight: m,
    isFlipUp: l
  };
}
function E(t, e) {
  return t === e ? !0 : !t || !e ? !1 : t.top === e.top && t.bottom === e.bottom && t.left === e.left && t.width === e.width && t.maxHeight === e.maxHeight && !!t.isFlipUp == !!e.isFlipUp;
}
function b(t, e = 28, n = 6) {
  return !Number.isFinite(t) || t <= 0 || !Number.isFinite(e) || e <= 0 ? Math.max(1, n) : Math.max(1, Math.floor(t / e));
}
function D(t, e, n, o = 6) {
  if (n <= 0) return null;
  if (e < 0 || e >= n)
    return t === "ArrowUp" || t === "End" ? n - 1 : t === "ArrowDown" || t === "PageDown" || t === "PageUp" || t === "Home" ? 0 : null;
  const r = Math.max(1, o);
  switch (t) {
    case "ArrowDown":
      return (e + 1) % n;
    case "ArrowUp":
      return (e - 1 + n) % n;
    case "PageDown":
      return Math.min(n - 1, e + r);
    case "PageUp":
      return Math.max(0, e - r);
    case "Home":
      return 0;
    case "End":
      return n - 1;
    default:
      return null;
  }
}
function L(t, e, n = 0, o = 0) {
  if (!t || !e) return;
  const r = t.getBoundingClientRect(), i = e.getBoundingClientRect(), s = t.offsetHeight > 0 && r.height > 0 ? r.height / t.offsetHeight : 1, a = r.top + (t.clientTop + Math.max(0, n)) * s, u = r.top + (t.clientTop + t.clientHeight - Math.max(0, o)) * s;
  i.top < a ? t.scrollTop -= (a - i.top) / s : i.bottom > u && (t.scrollTop += (i.bottom - u) / s);
}
function U(t, e, n, o, r, i, s) {
  const a = f(e), u = f(n);
  h(() => {
    a.current = e, u.current = n;
  }), h(() => {
    if (!t) return;
    const c = (d) => {
      const m = d.target;
      o?.current && o.current.contains(m) || r?.current && r.current.contains(m) || i?.current && i.current.contains(m) || s && m instanceof Element && m.closest(s) || a.current();
    }, l = (d) => {
      d.type === "scroll" && typeof Node < "u" && d.target instanceof Node && (r?.current && r.current.contains(d.target) || i?.current && i.current.contains(d.target)) || u.current?.();
    };
    return document.addEventListener("mousedown", c, !0), document.addEventListener("touchstart", c, !0), window.addEventListener("resize", l, { passive: !0 }), window.addEventListener("scroll", l, { passive: !0, capture: !0 }), () => {
      document.removeEventListener("mousedown", c, !0), document.removeEventListener("touchstart", c, !0), window.removeEventListener("resize", l), window.removeEventListener("scroll", l, !0);
    };
  }, [t, o, r, i]);
}
const v = /[^\x00-\x7F]/;
function F(t) {
  if (!t) return "";
  const e = t.toLowerCase();
  return v.test(e) ? e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d") : e;
}
export {
  E as a,
  b,
  x as c,
  D as d,
  M as g,
  F as n,
  L as s,
  U as u
};
