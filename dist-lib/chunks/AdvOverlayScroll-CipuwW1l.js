import { jsxs as lt, jsx as O } from "react/jsx-runtime";
import { useRef as s, useCallback as x, useLayoutEffect as G, useEffect as K } from "react";
const E = 24, d = 2, at = 700, mt = ({
  children: J,
  className: Q = "",
  style: Z,
  viewportClassName: tt = "",
  viewportStyle: et,
  viewportRef: p,
  onScroll: Y,
  onViewportMouseMove: rt,
  scrollX: D = !1,
  trackTopInset: C = d,
  trackBottomInset: I = d,
  alwaysShow: $ = !1,
  contentSignature: nt
}) => {
  const V = s(null), b = s(null), X = s(null), W = s(null), j = s(null), P = s(null), N = s(!1), k = s(!1), H = s(null), v = s(null), g = s(null), _ = s(!1), n = s({
    maxScrollTop: 0,
    maxThumbTop: 0,
    thumbH: 0,
    maxScrollLeft: 0,
    maxThumbLeft: 0,
    thumbW: 0
  }), ot = x(
    (t) => {
      b.current = t, typeof p == "function" ? p(t) : p && "current" in p && (p.current = t);
    },
    [p]
  ), a = x(() => {
    const t = V.current;
    if (!t) return;
    const e = $ || N.current || k.current || H.current !== null;
    t.setAttribute("data-overlay-scroll-active", e ? "true" : "false");
  }, [$]), T = x(() => {
    const t = b.current, e = X.current, o = W.current;
    if (!t || !e || !o) return;
    const c = t.clientHeight, r = t.scrollHeight, l = t.clientWidth, i = t.scrollWidth, f = D ? Math.max(0, i - l) : 0, w = D && f > 1 && l > 32, u = Math.max(d, C), y = Math.max(d, I + (w ? 8 : 0)), M = Math.max(0, c - u - y), h = Math.max(0, r - c), q = h > 1 && M >= E;
    if (q) {
      const L = Math.min(M, Math.max(E, Math.round(c / r * M))), m = Math.max(0, M - L), R = h > 0 ? Math.min(m, t.scrollTop / h * m) : 0;
      e.style.display = "block", e.style.top = `${u}px`, e.style.bottom = `${y}px`, o.style.height = `${L}px`, o.style.transform = `translate3d(0, ${R}px, 0)`, n.current.maxScrollTop = h, n.current.maxThumbTop = m, n.current.thumbH = L;
    } else
      e.style.display = "none", n.current.maxScrollTop = 0, n.current.maxThumbTop = 0, n.current.thumbH = 0;
    const S = j.current, z = P.current;
    if (S && z) {
      const L = q ? 10 : d, m = Math.max(0, l - d - L);
      if (w && m >= E) {
        const R = Math.min(m, Math.max(E, Math.round(l / i * m))), B = Math.max(0, m - R), ct = f > 0 ? Math.min(B, t.scrollLeft / f * B) : 0;
        S.style.display = "block", S.style.left = `${d}px`, S.style.right = `${L}px`, z.style.width = `${R}px`, z.style.transform = `translate3d(${ct}px, 0, 0)`, n.current.maxScrollLeft = f, n.current.maxThumbLeft = B, n.current.thumbW = R;
      } else
        S.style.display = "none", n.current.maxScrollLeft = 0, n.current.maxThumbLeft = 0, n.current.thumbW = 0;
    }
  }, [D, C, I]), A = x(() => {
    g.current === null && (g.current = window.requestAnimationFrame(() => {
      g.current = null, T();
    }));
  }, [T]);
  G(() => {
    a(), T(), _.current = !0;
  }, [a, T, nt]), G(() => {
    if (_.current) {
      _.current = !1;
      return;
    }
    A();
  }), K(() => {
    const t = b.current;
    if (!t) return;
    const e = typeof ResizeObserver < "u" ? new ResizeObserver(() => A()) : null;
    e?.observe(t);
    const o = typeof MutationObserver < "u" ? new MutationObserver(() => A()) : null;
    return o?.observe(t, { childList: !0 }), () => {
      e?.disconnect(), o?.disconnect();
    };
  }, [A]), K(() => () => {
    v.current !== null && window.clearTimeout(v.current), g.current !== null && window.cancelAnimationFrame(g.current);
  }, []);
  const st = x(
    (t) => {
      T(), k.current = !0, a(), v.current !== null && window.clearTimeout(v.current), v.current = window.setTimeout(() => {
        v.current = null, k.current = !1, a();
      }, at), Y?.(t);
    },
    [T, a, Y]
  ), F = x(
    (t, e) => {
      e.preventDefault(), e.stopPropagation();
      const o = b.current;
      if (!o) return;
      const c = n.current, r = t === "y" ? {
        axis: "y",
        startPointer: e.clientY,
        startScroll: o.scrollTop,
        maxScroll: c.maxScrollTop,
        maxThumbOffset: c.maxThumbTop
      } : {
        axis: "x",
        startPointer: e.clientX,
        startScroll: o.scrollLeft,
        maxScroll: c.maxScrollLeft,
        maxThumbOffset: c.maxThumbLeft
      };
      if (r.maxThumbOffset <= 0 || r.maxScroll <= 0) return;
      H.current = r;
      const l = t === "y" ? W.current : P.current;
      l?.classList.add("is-dragging"), a();
      const i = (w) => {
        const u = H.current, y = b.current;
        if (!u || !y) return;
        const M = (u.axis === "y" ? w.clientY : w.clientX) - u.startPointer, h = u.startScroll + M / u.maxThumbOffset * u.maxScroll;
        u.axis === "y" ? y.scrollTop = h : y.scrollLeft = h;
      }, f = () => {
        H.current = null, l?.classList.remove("is-dragging"), a(), window.removeEventListener("mousemove", i), window.removeEventListener("mouseup", f);
      };
      window.addEventListener("mousemove", i), window.addEventListener("mouseup", f);
    },
    [a]
  ), U = x((t, e) => {
    if (e.target !== e.currentTarget) return;
    e.preventDefault(), e.stopPropagation();
    const o = b.current;
    if (!o) return;
    const c = e.currentTarget.getBoundingClientRect(), r = n.current;
    if (t === "y" && r.maxThumbTop > 0) {
      const l = e.clientY - c.top - r.thumbH / 2, i = Math.min(1, Math.max(0, l / r.maxThumbTop));
      o.scrollTop = i * r.maxScrollTop;
    } else if (t === "x" && r.maxThumbLeft > 0) {
      const l = e.clientX - c.left - r.thumbW / 2, i = Math.min(1, Math.max(0, l / r.maxThumbLeft));
      o.scrollLeft = i * r.maxScrollLeft;
    }
  }, []);
  return /* @__PURE__ */ lt(
    "div",
    {
      ref: V,
      "data-overlay-scroll-active": $ ? "true" : "false",
      onMouseEnter: () => {
        N.current = !0, a();
      },
      onMouseLeave: () => {
        N.current = !1, a();
      },
      className: `relative flex flex-col min-h-0 ${Q}`.trim(),
      style: Z,
      children: [
        /* @__PURE__ */ O(
          "div",
          {
            ref: ot,
            onScroll: st,
            onMouseMove: rt,
            className: `agv-overlay-scroll-viewport ${tt}`.trim(),
            style: et,
            children: J
          }
        ),
        /* @__PURE__ */ O(
          "div",
          {
            ref: X,
            onMouseDown: (t) => U("y", t),
            className: "agv-overlay-scroll-bar is-vertical",
            style: { display: "none" },
            "aria-hidden": "true",
            children: /* @__PURE__ */ O(
              "div",
              {
                ref: W,
                onMouseDown: (t) => F("y", t),
                className: "agv-overlay-scroll-thumb is-vertical"
              }
            )
          }
        ),
        D && /* @__PURE__ */ O(
          "div",
          {
            ref: j,
            onMouseDown: (t) => U("x", t),
            className: "agv-overlay-scroll-bar is-horizontal",
            style: { display: "none" },
            "aria-hidden": "true",
            children: /* @__PURE__ */ O(
              "div",
              {
                ref: P,
                onMouseDown: (t) => F("x", t),
                className: "agv-overlay-scroll-thumb is-horizontal"
              }
            )
          }
        )
      ]
    }
  );
};
export {
  mt as A
};
