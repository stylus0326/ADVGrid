function x(m) {
  const {
    rowKey: a,
    newRowIndex: i,
    oldRowIndex: p,
    rowHeight: d,
    maxDirectRows: f = 12
  } = m;
  if (d <= 0 || i < 0) return null;
  if (p !== void 0) {
    const e = p - i;
    if (e === 0) return null;
    if (Math.abs(e) <= f) {
      const c = Math.max(-i, e), w = Math.round(c * d);
      return w === 0 ? null : {
        deltaY: w,
        initialOpacity: 1,
        zIndex: e < 0 ? 3 : 2
      };
    }
  }
  const r = [2.5, 4, -2, -2, 3.5, -3, 3, -3.5], o = r[i % r.length];
  let n = 0;
  for (let e = 0; e < a.length; e++)
    n = n * 31 + a.charCodeAt(e) | 0;
  const y = (Math.abs(n) % 3 - 1) * 0.25, s = o + (o > 0 ? y : -y), t = Math.max(-i, Math.min(f, s)), l = Math.round(t * d);
  return l === 0 ? null : {
    deltaY: l,
    initialOpacity: 1,
    zIndex: t < 0 ? 3 : 2
  };
}
function h(m) {
  const {
    viewportEl: a,
    prevMap: i,
    prevStartRow: p,
    viewportCenterRow: d,
    actualRowHeight: f,
    activeAnimatedRowsRef: r,
    sortAnimRafRef: o,
    sortAnimTimeoutRef: n
  } = m;
  o.current !== null && (cancelAnimationFrame(o.current), o.current = null), n.current !== null && (window.clearTimeout(n.current), n.current = null);
  for (const t of r.current)
    t.style.transition = "", t.style.transform = "", t.style.opacity = "", t.style.zIndex = "", t.style.willChange = "";
  r.current = [];
  const y = a.querySelectorAll(
    ".agv-rows-canvas [data-row-key]"
  ), s = [];
  y.forEach((t) => {
    const l = t.getAttribute("data-row-key"), e = t.getAttribute("data-row-idx");
    if (!l || e === null) return;
    const c = parseInt(e, 10);
    if (Number.isNaN(c) || c < 0) return;
    const w = i.get(l), u = x({
      rowKey: l,
      newRowIndex: c,
      oldRowIndex: w,
      rowHeight: f
    });
    t.style.animation = "none", u && (t.style.transition = "none", t.style.willChange = "transform, opacity", t.style.transform = `translate3d(0px, ${u.deltaY}px, 0px)`, u.initialOpacity < 1 && (t.style.opacity = String(u.initialOpacity)), t.style.zIndex = String(u.zIndex), s.push(t));
  }), s.length > 0 && (a.setAttribute("data-agv-sorting", "true"), r.current = s, a.offsetHeight, o.current = requestAnimationFrame(() => {
    o.current = null;
    for (const t of s)
      t.style.transition = "transform 300ms cubic-bezier(0.22, 1, 0.36, 1), opacity 220ms ease-out", t.style.transform = "translate3d(0px, 0px, 0px)", t.style.opacity = "1";
  }), n.current = window.setTimeout(() => {
    n.current = null;
    for (const t of r.current)
      t.style.transition = "", t.style.transform = "", t.style.opacity = "", t.style.zIndex = "", t.style.willChange = "";
    r.current = [], a.removeAttribute("data-agv-sorting");
  }, 320));
}
export {
  x as computeSortRowFlipState,
  h as runSortFlipAnimation
};
