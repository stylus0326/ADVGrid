import { D as G } from "./gridFormatUtils-wCKPmlrt.js";
function U({
  key: u,
  event: C,
  colMap: B,
  colWidthsRef: O,
  setColWidth: $,
  resizingRef: f
}) {
  const v = B[u];
  if (!v || v.resizable === !1 || v.dataType === G.SYSTEM || v.isRowNumber || v.isSelection)
    return;
  const k = O.current[u] || v.defaultWidth || 100;
  f.current = {
    key: u,
    startX: C.clientX,
    startWidth: k
  };
  const j = document.body.style.cursor, z = document.body.style.userSelect;
  document.body.style.cursor = "col-resize", document.body.style.userSelect = "none", document.documentElement.setAttribute("data-agv-resizing", "true");
  const F = C.currentTarget;
  F?.setAttribute("data-resizing-active", "true");
  const c = F?.closest(".agv-scroll-viewport") || null, L = [], M = [], T = [], N = [], g = [];
  let R = 0;
  const K = [], X = [];
  let A = 0;
  const E = [], q = [];
  if (c) {
    const i = c.getBoundingClientRect(), h = /* @__PURE__ */ new Set();
    c.querySelectorAll(".agv-row-slot, .agv-chunk-block").forEach((t) => {
      const l = t.getBoundingClientRect();
      l.bottom >= i.top - 64 && l.top <= i.bottom + 64 && h.add(t);
    });
    const y = (t) => {
      const l = t.closest(".agv-row-slot, .agv-chunk-block");
      return !l || h.has(l);
    };
    c.querySelectorAll(
      `[data-col-key="${u}"], [data-tier2-col-key="${u}"]`
    ).forEach((t) => {
      const l = {
        el: t,
        hasMin: !!t.style.minWidth,
        hasMax: !!t.style.maxWidth
      };
      y(t) ? L.push(l) : M.push(l);
    }), c.querySelectorAll("[data-group-span-keys]").forEach((t) => {
      if ((t.getAttribute("data-group-span-keys") || "").split(",").includes(u)) {
        const p = parseFloat(t.style.width) || t.getBoundingClientRect().width, n = { el: t, startWidth: p };
        y(t) ? T.push(n) : N.push(n);
      }
    });
    const e = c.querySelector(`[data-tier2-col-key="${u}"]`)?.closest("[data-band-key]");
    if (e) {
      R = parseFloat(e.style.width) || e.getBoundingClientRect().width, g.push({ el: e, origWidthStyle: e.style.width });
      for (let t = 0; t < e.children.length; t++) {
        const l = e.children[t];
        l && l.style && g.push({ el: l, origWidthStyle: l.style.width });
      }
    }
    c.querySelectorAll(
      '[data-agv-fullwidth="true"], .agv-rows-canvas, .agv-row-slot, .agv-chunk-block, .agv-grid-row, .agv-group-row'
    ).forEach((t) => {
      A === 0 && (A = parseFloat(t.style.width) || t.getBoundingClientRect().width), y(t) ? K.push(t) : X.push(t);
    });
    const r = c.querySelector(
      `[data-agv-header-root="true"] [data-col-key="${u}"]`
    );
    if (r && r.style.position === "sticky") {
      if (r.style.left !== "") {
        const t = parseFloat(r.style.left) || 0, l = c.querySelectorAll(
          '[data-agv-header-root="true"] [data-col-key]'
        ), p = [];
        if (l.forEach((n) => {
          if (n.style.position === "sticky" && n.style.left !== "") {
            const o = parseFloat(n.style.left) || 0, a = n.getAttribute("data-col-key");
            a && a !== u && o > t && p.push(a);
          }
        }), p.length > 0) {
          const n = p.map((o) => `[data-col-key="${o}"]`).join(",");
          c.querySelectorAll(n).forEach((o) => {
            if (o.style.position === "sticky" && o.style.left !== "") {
              const a = {
                el: o,
                side: "left",
                startOffset: parseFloat(o.style.left) || 0
              };
              y(o) ? E.push(a) : q.push(a);
            }
          });
        }
      } else if (r.style.right !== "") {
        const t = parseFloat(r.style.right) || 0, l = c.querySelectorAll(
          '[data-agv-header-root="true"] [data-col-key]'
        ), p = [];
        if (l.forEach((n) => {
          if (n.style.position === "sticky" && n.style.right !== "") {
            const o = parseFloat(n.style.right) || 0, a = n.getAttribute("data-col-key");
            a && a !== u && o > t && p.push(a);
          }
        }), p.length > 0) {
          const n = p.map((o) => `[data-col-key="${o}"]`).join(",");
          c.querySelectorAll(n).forEach((o) => {
            if (o.style.position === "sticky" && o.style.right !== "") {
              const a = {
                el: o,
                side: "right",
                startOffset: parseFloat(o.style.right) || 0
              };
              y(o) ? E.push(a) : q.push(a);
            }
          });
        }
      }
    }
  }
  let b = null, P = C.clientX, S = k;
  const D = (i, h, d, y, m, w) => {
    const W = `${m}px`;
    for (let e = 0; e < i.length; e++) {
      const s = i[e];
      s.el.style.width = W, s.hasMin && (s.el.style.minWidth = W), s.hasMax && (s.el.style.maxWidth = W);
    }
    for (let e = 0; e < h.length; e++) {
      const s = h[e], r = `${s.startWidth + w}px`;
      s.el.style.width = r, s.el.style.minWidth = r, s.el.style.maxWidth = r;
    }
    if (d.length > 0 && A > 0) {
      const e = `${A + w}px`;
      for (let s = 0; s < d.length; s++)
        d[s].style.width = e;
    }
    for (let e = 0; e < y.length; e++) {
      const s = y[e], r = `${s.startOffset + w}px`;
      s.side === "left" ? s.el.style.left = r : s.el.style.right = r;
    }
  }, H = () => {
    if (b = null, !f.current) return;
    const i = P - f.current.startX, h = B[f.current.key], d = h?.minWidth || 50, y = h?.maxWidth || 1200, m = Math.round(
      Math.min(y, Math.max(d, f.current.startWidth + i))
    );
    if (m !== S)
      if (S = m, L.length > 0) {
        const w = m - k;
        if (D(
          L,
          T,
          K,
          E,
          m,
          w
        ), g.length > 0) {
          const W = `${R + w}px`;
          for (let e = 0; e < g.length; e++)
            g[e].el.style.width = W;
        }
      } else
        $(f.current.key, m);
  }, I = (i) => {
    f.current && (P = i.clientX, b === null && (b = window.requestAnimationFrame(H)));
  }, x = () => {
    b !== null && (window.cancelAnimationFrame(b), b = null, H()), F?.removeAttribute("data-resizing-active");
    const i = f.current;
    if (f.current = null, document.body.style.cursor = j, document.body.style.userSelect = z, document.documentElement.removeAttribute("data-agv-resizing"), window.removeEventListener("mousemove", I), window.removeEventListener("mouseup", x), window.removeEventListener("blur", x), i && S !== i.startWidth) {
      const h = S - k;
      D(
        M,
        N,
        X,
        q,
        S,
        h
      );
      for (let d = 0; d < g.length; d++)
        g[d].el.style.width = g[d].origWidthStyle;
      $(i.key, S);
    }
  };
  window.addEventListener("mousemove", I, { passive: !0 }), window.addEventListener("mouseup", x), window.addEventListener("blur", x);
}
export {
  U as startColumnResizeSession
};
