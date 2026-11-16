import { S as R, D as T } from "./gridFormatUtils-wCKPmlrt.js";
function C(g) {
  const {
    groupByColumnKey: s,
    pagedRowIndices: l,
    totalPageRowCount: i,
    getRowVal: u,
    colMap: p,
    numericColumnKeys: c
  } = g, d = l ? l.length : i, n = /* @__PURE__ */ new Map();
  for (let t = 0; t < d; t++) {
    const o = l ? l[t] : t, r = u(o, s), a = r === "" || r === null || r === void 0 ? "(Trống)" : String(r), f = n.get(a);
    f ? f.push(o) : n.set(a, [o]);
  }
  return {
    colTitle: p[s]?.title || s,
    entries: Array.from(n.entries()).map(([t, o]) => {
      const r = {};
      for (const a of c) {
        let f = 0;
        for (let m = 0; m < o.length; m++) {
          const w = Number(u(o[m], a));
          Number.isFinite(w) && (f += w);
        }
        r[a] = f;
      }
      return { groupValue: t, indices: o, sums: r };
    })
  };
}
function x(g) {
  const {
    groupBuckets: s,
    groupByColumnKey: l,
    groupSortConfig: i,
    expandedGroupPaths: u,
    onToggleCollapse: p
  } = g, c = [...s.entries];
  if (i?.colKey) {
    const n = i.direction === R.ASC;
    c.sort((e, t) => {
      const o = e.sums[i.colKey] || 0, r = t.sums[i.colKey] || 0;
      return n ? o - r : r - o;
    });
  }
  const d = [];
  return c.forEach((n, e) => {
    const t = `group_${n.groupValue}_${e}`, o = u.has(t);
    d.push({
      _isGroupRow: !0,
      path: t,
      groupColumnKey: l,
      groupColumnTitle: s.colTitle,
      groupValue: n.groupValue,
      groupIndex: e + 1,
      count: n.indices.length,
      isExpanded: o,
      isCollapsed: !o,
      onToggleCollapse: p,
      groupSums: n.sums,
      originalIndices: n.indices
    }), o && n.indices.forEach((r, a) => {
      d.push({
        _isGroupRow: !1,
        originalIndex: r,
        localIndex: a,
        groupIndex: e + 1,
        groupPath: t
      });
    });
  }), d;
}
async function y(g) {
  const { groupRow: s, includeHeaders: l = !1, orderedColumns: i, hiddenColKeys: u, getRowVal: p } = g;
  if (!s?.originalIndices?.length) return;
  const c = i.filter(
    (o) => o.dataType !== T.SYSTEM && !o.isRowNumber && !o.isSelection && !u.has(o.key)
  ), n = s.originalIndices.map(
    (o) => c.map((r) => {
      const a = p(o, r.key);
      return a != null ? String(a) : "";
    }).join("	")
  ).join(`
`), e = l ? `${c.map((o) => o.title).join("	")}
${n}` : n, { copyTextToClipboard: t } = await import("./gridClipboardUtils-CP1iXhvQ.js");
  await t(e);
}
function I(g) {
  const { currentTop: s, totalRows: l, actualRowHeight: i, getRowItem: u, getRowTop: p, findRowIndexAtOffset: c } = g;
  if (l <= 0 || s <= 0 || i <= 0) return null;
  const d = c ? c(s) : Math.floor(s / i), n = Math.min(l - 1, Math.max(0, d)), e = u(n);
  if (!e) return null;
  if (e._isGroupRow) {
    const t = p ? p(n) : n * i;
    return !e.isCollapsed && e.count > 0 && s > t ? n : null;
  }
  if (typeof e.localRowIndex == "number") {
    const t = n - e.localRowIndex - 1;
    if (t >= 0 && t < l) {
      const o = u(t);
      if (o && o._isGroupRow && !o.isCollapsed)
        return t;
    }
  }
  for (let t = n - 1; t >= 0; t--) {
    const o = u(t);
    if (o && o._isGroupRow)
      return o.isCollapsed ? null : t;
  }
  return null;
}
export {
  C as buildGroupBuckets,
  x as buildGroupedDisplayModel,
  I as computeStickyGroupIndexAtTop,
  y as copyGroupTableToClipboard
};
