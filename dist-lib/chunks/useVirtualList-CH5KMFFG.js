import { useRef as G, useState as J, useCallback as T, useLayoutEffect as K, useEffect as N } from "react";
function E(s, r, o, d, b, p) {
  if (o <= 0) return { startIndex: 0, endIndex: 0 };
  const a = Math.max(0, s), M = Math.max(d, r - Math.max(0, p)), l = Math.max(0, Math.floor(a / d) - b), I = Math.min(
    o,
    Math.ceil((a + M) / d) + b
  );
  return { startIndex: l, endIndex: I };
}
function Q({
  itemCount: s,
  itemHeight: r,
  viewportRef: o,
  overscan: d = 6,
  threshold: b = 40,
  enabled: p = !0,
  defaultViewportHeight: a = 232,
  topOffset: M = 0
}) {
  const l = p && s >= b && r > 0, I = G(a), [L, q] = J(
    () => E(0, a, s, r, d, M)
  ), e = T(
    (n, c) => {
      const x = l ? E(
        n,
        c,
        s,
        r,
        d,
        M
      ) : E(
        0,
        a,
        s,
        r,
        d,
        M
      );
      q(
        (t) => t.startIndex === x.startIndex && t.endIndex === x.endIndex ? t : x
      );
    },
    [l, a, s, r, d, M]
  ), u = T(() => {
    const n = o.current, c = n && n.clientHeight > 0 ? n.clientHeight : a;
    I.current = c, e(n ? n.scrollTop : 0, c);
  }, [o, a, e]);
  K(() => {
    u();
  }, [u]), N(() => {
    const n = o.current;
    if (!n || !l || typeof ResizeObserver > "u") return;
    const c = new ResizeObserver(() => {
      u();
    });
    return c.observe(n), () => c.disconnect();
  }, [o, l, u]);
  const Y = T(
    (n) => {
      if (!l) return;
      const c = n.currentTarget, x = c.clientHeight > 0 ? c.clientHeight : I.current;
      I.current = x, e(c.scrollTop, x);
    },
    [l, e]
  ), k = T(
    (n, c = 0, x = 0) => {
      if (n < 0 || n >= s) return;
      const t = o.current;
      if (!t) return;
      const S = t.clientHeight > 0 ? t.clientHeight : a, z = Math.max(0, M), y = z + n * r, m = y + r, B = t.scrollTop + z + Math.max(0, c), D = t.scrollTop + S - Math.max(0, x);
      let h = t.scrollTop;
      y < B ? h = Math.max(0, y - z - Math.max(0, c)) : m > D && (h = Math.max(0, m - S + Math.max(0, x))), Math.abs(h - t.scrollTop) > 0.5 ? (t.scrollTop = h, e(h, S)) : e(t.scrollTop, S);
    },
    [s, o, a, M, r, e]
  ), F = T(() => {
    const n = o.current;
    n && n.scrollTop !== 0 && (n.scrollTop = 0);
    const c = n && n.clientHeight > 0 ? n.clientHeight : a;
    e(0, c);
  }, [o, a, e]);
  if (!l)
    return {
      isVirtualized: !1,
      startIndex: 0,
      endIndex: s,
      totalHeight: s * r,
      offsetY: 0,
      topSpacer: 0,
      bottomSpacer: 0,
      handleScroll: Y,
      scrollToIndex: k,
      resetScroll: F,
      syncFromViewport: u
    };
  const f = Math.min(L.startIndex, s), W = Math.min(Math.max(L.endIndex, f), s), v = s * r, j = f * r, A = Math.max(0, (s - W) * r);
  return {
    isVirtualized: !0,
    startIndex: f,
    endIndex: W,
    totalHeight: v,
    offsetY: j,
    topSpacer: j,
    bottomSpacer: A,
    handleScroll: Y,
    scrollToIndex: k,
    resetScroll: F,
    syncFromViewport: u
  };
}
export {
  Q as u
};
