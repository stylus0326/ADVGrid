import { jsx as n, jsxs as R } from "react/jsx-runtime";
import { memo as dt, useId as ht, useRef as _, useState as E, useEffect as nt, useMemo as ut } from "react";
import { createPortal as vt } from "react-dom";
import { g as pt, c as d } from "./gridFormatUtils-wCKPmlrt.js";
import { g as gt } from "./enterpriseEditorUtils-DJeTtQuh.js";
import { g as ft } from "./common-Bjggt86Z.js";
d.AVG, d.SUM, d.MIN, d.MAX;
d.AVG + "", d.SUM + "", d.MIN + "", d.MIN, d.MAX + "", d.MAX;
function xt(t, h, u, l = 5) {
  if (t.length === 0) return "";
  if (t.length === 1) return `M ${t[0].x} ${t[0].y}`;
  if (t.length === 2) return `M ${t[0].x} ${t[0].y} L ${t[1].x} ${t[1].y}`;
  let y = `M ${t[0].x} ${t[0].y}`;
  for (let v = 0; v < t.length - 1; v++) {
    const b = t[Math.max(0, v - 1)], f = t[v], p = t[v + 1], N = t[Math.min(t.length - 1, v + 2)], S = f.x + (p.x - b.x) / 6;
    let $ = f.y + (p.y - b.y) / 6;
    const O = p.x - (N.x - f.x) / 6;
    let W = p.y - (N.y - f.y) / 6;
    $ = Math.max(u, Math.min(h - l, $)), W = Math.max(u, Math.min(h - l, W)), y += ` C ${Math.round(S * 10) / 10} ${Math.round($ * 10) / 10}, ${Math.round(
      O * 10
    ) / 10} ${Math.round(W * 10) / 10}, ${Math.round(p.x * 10) / 10} ${Math.round(
      p.y * 10
    ) / 10}`;
  }
  return y;
}
const Nt = dt(
  ({
    values: t,
    minIdx: h,
    maxIdx: u,
    minVal: l,
    maxVal: y,
    avgVal: v,
    width: b,
    height: f,
    surfaceTheme: p,
    formatValue: N
  }) => {
    const S = ht(), $ = _(null), [O, W] = E(null), [j, rt] = E(null), [r, z] = E(null), [s, Y] = E(null), P = _(null), L = _(null), H = b !== void 0 && b > 0, X = f !== void 0 && f > 0;
    nt(() => {
      if (H && X) return;
      const e = $.current;
      if (!e) return;
      const o = () => {
        if (!H) {
          const a = e.clientWidth;
          a > 0 && W((g) => g !== a ? a : g);
        }
        if (!X) {
          const a = e.clientHeight;
          a > 0 && rt((g) => g !== a ? a : g);
        }
      };
      if (o(), typeof ResizeObserver < "u") {
        const a = new ResizeObserver(o);
        return a.observe(e), () => a.disconnect();
      }
    }, [H, X]);
    const k = Math.max(60, ((H ? b : O) || b || 150) - 4), ot = j && j >= 30 ? Math.min(42, Math.max(24, j - 6)) : 24, i = (X ? f : ot) || 24, x = 6, m = 6, C = 6, q = k - x * 2, T = i - m - C, B = Math.max(1, y - l), G = v !== void 0 ? v : t.reduce((e, o) => e + o, 0) / (t.length || 1), { points: c, linePath: J, areaPath: K, avgY: Q } = ut(() => {
      if (!t || t.length === 0)
        return { points: [], linePath: "", areaPath: "", avgY: i / 2 };
      const e = t.map((w, A) => {
        const F = x + A / Math.max(1, t.length - 1) * q, U = (w - l) / B, Z = m + (1 - U) * T;
        return { x: Math.round(F * 10) / 10, y: Math.round(Z * 10) / 10, val: w };
      }), o = xt(e, i, m, C), a = e.length > 0 ? `${o} L ${e[e.length - 1].x} ${i} L ${e[0].x} ${i} Z` : "", g = (G - l) / B, D = m + (1 - g) * T;
      return {
        points: e,
        linePath: o,
        areaPath: a,
        avgY: Math.max(m, Math.min(i - C, Math.round(D * 10) / 10))
      };
    }, [t, l, B, q, T, i, G]), at = (e) => {
      L.current = e.currentTarget.getBoundingClientRect();
    }, st = (e) => {
      const o = L.current || e.currentTarget.getBoundingClientRect();
      L.current = o;
      const a = e.clientX - o.left, g = Math.max(1, o.width), D = Math.max(0, Math.min(1, a / g)), w = Math.round(D * (t.length - 1));
      if (P.current === w) return;
      P.current = w, z(w);
      const A = c[w];
      if (A) {
        const F = o.width / k, U = o.height / i, Z = o.left + A.x * F, lt = o.top + A.y * U;
        Y({ x: Z, y: lt });
      }
    }, I = () => {
      P.current !== null && (P.current = null, L.current = null, z(null), Y(null));
    };
    if (nt(() => {
      if (r === null) return;
      const e = () => {
        P.current = null, L.current = null, z(null), Y(null);
      };
      return window.addEventListener("scroll", e, { passive: !0, capture: !0 }), () => {
        window.removeEventListener("scroll", e, { capture: !0 });
      };
    }, [r]), !t || t.length === 0)
      return /* @__PURE__ */ n("div", { className: "w-full h-full flex items-center justify-center text-xs opacity-40", children: "-" });
    const M = r !== null ? t[r] : null, it = M !== null && M >= G, V = r !== null && y > l && (r === u || M === y), tt = r !== null && y > l && (r === h || M === l), ct = V ? "var(--agv-trend-up)" : tt ? "var(--agv-trend-down)" : "var(--agv-text-main)", et = V ? "var(--agv-trend-up)" : tt ? "var(--agv-trend-down)" : it ? "var(--agv-trend-up)" : "var(--agv-trend-down)";
    return /* @__PURE__ */ R(
      "div",
      {
        ref: $,
        className: "relative w-full h-full flex items-center justify-center overflow-hidden select-none px-0",
        onMouseLeave: I,
        children: [
          /* @__PURE__ */ R(
            "svg",
            {
              width: "100%",
              height: i,
              viewBox: `0 0 ${k} ${i}`,
              preserveAspectRatio: "none",
              style: { touchAction: "pan-y" },
              className: "overflow-visible block shrink-0 cursor-crosshair",
              onPointerEnter: at,
              onPointerMove: st,
              onPointerLeave: I,
              children: [
                /* @__PURE__ */ n("defs", { children: /* @__PURE__ */ R("linearGradient", { id: S, x1: "0", y1: "0", x2: "0", y2: "1", children: [
                  /* @__PURE__ */ n("stop", { offset: "0%", stopColor: "var(--agv-accent)", stopOpacity: 0.32 }),
                  /* @__PURE__ */ n("stop", { offset: "100%", stopColor: "var(--agv-accent)", stopOpacity: 0.02 })
                ] }) }),
                /* @__PURE__ */ n(
                  "line",
                  {
                    x1: x,
                    y1: Q,
                    x2: k - x,
                    y2: Q,
                    stroke: "var(--agv-border)",
                    strokeWidth: "1",
                    strokeDasharray: "2 2",
                    strokeOpacity: "0.8"
                  }
                ),
                K && /* @__PURE__ */ n("path", { d: K, fill: `url(#${S})` }),
                J && /* @__PURE__ */ n(
                  "path",
                  {
                    d: J,
                    fill: "none",
                    stroke: "var(--agv-accent)",
                    strokeWidth: "1.75",
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    vectorEffect: "non-scaling-stroke"
                  }
                ),
                u !== -1 && c[u] && /* @__PURE__ */ n(
                  "circle",
                  {
                    cx: Math.max(x, Math.min(k - x, c[u].x)),
                    cy: Math.max(m, Math.min(i - C, c[u].y)),
                    r: r === u ? 4.2 : 3.2,
                    fill: "var(--agv-trend-up)",
                    stroke: "var(--agv-bg-surface)",
                    strokeWidth: 1.4,
                    className: "pointer-events-none transition-all"
                  }
                ),
                h !== -1 && c[h] && /* @__PURE__ */ n(
                  "circle",
                  {
                    cx: Math.max(x, Math.min(k - x, c[h].x)),
                    cy: Math.max(m, Math.min(i - C, c[h].y)),
                    r: r === h ? 4.2 : 3.2,
                    fill: "var(--agv-trend-down)",
                    stroke: "var(--agv-bg-surface)",
                    strokeWidth: 1.4,
                    className: "pointer-events-none transition-all"
                  }
                ),
                r !== null && c[r] && /* @__PURE__ */ R("g", { className: "pointer-events-none", children: [
                  /* @__PURE__ */ n(
                    "line",
                    {
                      x1: c[r].x,
                      y1: m,
                      x2: c[r].x,
                      y2: i,
                      stroke: et,
                      strokeWidth: "1",
                      strokeDasharray: "2 2"
                    }
                  ),
                  /* @__PURE__ */ n(
                    "circle",
                    {
                      cx: c[r].x,
                      cy: c[r].y,
                      r: 3.8,
                      fill: "var(--agv-bg-surface)",
                      stroke: et,
                      strokeWidth: 2
                    }
                  )
                ] })
              ]
            }
          ),
          r !== null && s && typeof document < "u" && vt(
            /* @__PURE__ */ n(
              "div",
              {
                className: `fixed pointer-events-none z-[999999] ${ft(p)}`,
                "data-theme": p,
                style: {
                  ...gt(),
                  left: `${s && typeof window < "u" ? Math.max(80, Math.min(window.innerWidth - 80, s.x)) : s?.x ?? 0}px`,
                  top: s.y < 65 ? `${s.y + 12}px` : `${s.y - 8}px`,
                  transition: "left 120ms cubic-bezier(0.2, 0.9, 0.3, 1), top 120ms cubic-bezier(0.2, 0.9, 0.3, 1)"
                },
                children: /* @__PURE__ */ R(
                  "div",
                  {
                    className: `relative flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-sans shadow-lg select-none ${s.y < 65 ? "agv-tooltip-spring-down" : "agv-tooltip-spring-up"}`,
                    style: {
                      backgroundColor: "var(--agv-bg-popup)",
                      color: "var(--agv-text-main)",
                      border: "1px solid var(--agv-border-popup)",
                      boxShadow: "var(--popup-shadow)"
                    },
                    children: [
                      /* @__PURE__ */ n(
                        "div",
                        {
                          className: `absolute left-1/2 flex items-center justify-center pointer-events-none ${s.y < 65 ? "-top-[5px]" : "-bottom-[5px]"}`,
                          style: {
                            transform: `translateX(calc(-50% + ${s.x - (typeof window < "u" ? Math.max(80, Math.min(window.innerWidth - 80, s.x)) : s.x)}px))`
                          },
                          children: /* @__PURE__ */ n("svg", { width: "10", height: "5", viewBox: "0 0 10 5", className: "block", children: s.y < 65 ? /* @__PURE__ */ n(
                            "path",
                            {
                              d: "M 0 5 L 5 0 L 10 5",
                              fill: "var(--agv-bg-popup)",
                              stroke: "var(--agv-border-popup)",
                              strokeWidth: "1"
                            }
                          ) : /* @__PURE__ */ n(
                            "path",
                            {
                              d: "M 0 0 L 5 5 L 10 0",
                              fill: "var(--agv-bg-popup)",
                              stroke: "var(--agv-border-popup)",
                              strokeWidth: "1"
                            }
                          ) })
                        }
                      ),
                      /* @__PURE__ */ n("span", { className: "font-medium text-xs text-[var(--agv-text-muted)] tracking-tight", children: `Tháng ${String(r + 1).padStart(2, "0")}` }),
                      /* @__PURE__ */ n("span", { className: "text-[var(--agv-text-muted)] opacity-50 text-xs leading-none", children: "•" }),
                      /* @__PURE__ */ n(
                        "span",
                        {
                          className: "font-bold tabular-nums text-xs",
                          style: { color: ct },
                          children: M !== null ? N ? N(M) : pt(M, Number.isInteger(M) ? 0 : 1) : ""
                        }
                      )
                    ]
                  }
                )
              }
            ),
            document.body
          )
        ]
      }
    );
  }
);
export {
  d as FORMULA_MODES,
  Nt as TwelveMonthChartCell
};
