import { s as ce, D as ie, P as $, C as Q } from "./gridFormatUtils-wCKPmlrt.js";
function L(o) {
  return !!(!o || o._isGroupRow || o._isDetailRow);
}
function le(o) {
  return !!(o.isRowNumber || o.key === "col_stt" || ce(o) || o.isDetailExpand || o.key === "col_detail_expand" || o.dataType === ie.SYSTEM);
}
function fe(o, a, S) {
  const f = a[o] || $.NONE;
  if (f === $.LEFT) return "left";
  if (f === $.RIGHT) return "right";
  if (f === $.CENTER) {
    const k = S[o] || Q.NORMAL;
    if (k === Q.LEFT) return "left";
    if (k === Q.RIGHT) return "right";
  }
  return "center";
}
function he(o) {
  if (!o) return { rowSpan: 1, colSpan: 1 };
  if (Array.isArray(o))
    return {
      rowSpan: typeof o[0] == "number" && Number.isFinite(o[0]) ? Math.max(0, Math.floor(o[0])) : 1,
      colSpan: typeof o[1] == "number" && Number.isFinite(o[1]) ? Math.max(0, Math.floor(o[1])) : 1
    };
  const a = o;
  return {
    rowSpan: typeof a.rowSpan == "number" && Number.isFinite(a.rowSpan) ? Math.max(0, Math.floor(a.rowSpan)) : 1,
    colSpan: typeof a.colSpan == "number" && Number.isFinite(a.colSpan) ? Math.max(0, Math.floor(a.colSpan)) : 1
  };
}
function pe(o, a = {}) {
  const S = Math.max(2, Math.min(64, Math.floor(a.maxSpan ?? 32))), f = typeof o == "function" ? o : (u) => u ? u[o] : void 0, k = (u) => u == null || u === "";
  return ({ row: u, rowIndex: h, getRowAt: x }) => {
    if (L(u) || a.canMerge && !a.canMerge(u, h)) return 1;
    const M = f(u);
    if (k(M)) return 1;
    let R = 0;
    for (let m = 1; m < S && h - m >= 0; m++) {
      const t = x(h - m);
      if (L(t) || a.canMerge && !a.canMerge(t, h - m) || f(t) !== M) break;
      R++;
    }
    if (R > 0)
      return 0;
    let w = 1;
    for (let m = 1; m < S; m++) {
      const t = x(h + m);
      if (L(t) || a.canMerge && !a.canMerge(t, h + m) || f(t) !== M) break;
      w++;
    }
    return w;
  };
}
function ye(o) {
  const {
    startRow: a,
    endRow: S,
    totalRows: f,
    baseRowHeight: k,
    getRowTop: u,
    columns: h,
    colWidths: x,
    columnPins: M,
    centerDockStatus: R,
    lastEffectiveLeftColKey: w,
    getRowItem: m,
    spanMethod: t,
    maxLookback: d = 32
  } = o, c = /* @__PURE__ */ new Map(), l = [];
  let e = !1;
  if (f <= 0 || h.length === 0 || S < a)
    return { rowPlans: c, anchorRowsBeforeStart: l, hasAnyVerticalSpan: e };
  const n = h.length, s = new Float64Array(n), y = new Uint8Array(n), A = new Array(n), C = new Int32Array(n);
  let I = !!t;
  for (let r = 0; r < n; r++) {
    const g = h[r];
    s[r] = x[g.key] || g.defaultWidth, y[r] = le(g) ? 1 : 0, A[r] = fe(g.key, M, R), (g.colSpan || g.rowSpan) && (I = !0);
  }
  if (!I)
    return { rowPlans: c, anchorRowsBeforeStart: l, hasAnyVerticalSpan: e };
  for (let r = 0; r < n; r++) {
    if (y[r]) {
      C[r] = 1;
      continue;
    }
    const g = A[r];
    let E = 1;
    for (; r + E < n && !y[r + E] && A[r + E] === g; )
      E++;
    C[r] = E;
  }
  const K = Math.max(1, Math.min(64, Math.floor(d))), v = Math.max(0, a - K), Y = Math.min(f - 1, S), O = Y - v + 1, B = new Uint8Array(O * n), j = new Array(O), z = (r) => {
    if (r < 0 || r >= f) return null;
    if (r >= v && r <= Y) {
      const g = r - v;
      return j[g] === void 0 && (j[g] = m(r) ?? null), j[g];
    }
    return m(r) ?? null;
  };
  for (let r = v; r <= Y; r++) {
    const g = r - v, E = g * n, X = z(r), oe = r <= S;
    if (L(X))
      continue;
    const F = new Array(n);
    let H = !1, U = !1, Z = !1;
    for (let p = 0; p < n; p++) {
      const N = B[E + p];
      if (N === 1) {
        F[p] = { kind: "omit" }, H = !0;
        continue;
      }
      if (N === 2) {
        F[p] = { kind: "spacer", widthPx: s[p] }, H = !0, Z = !0;
        continue;
      }
      const b = h[p];
      if (y[p] || !t && !b.colSpan && !b.rowSpan) {
        F[p] = { kind: "normal" };
        continue;
      }
      const q = {
        row: X,
        rowIndex: r,
        column: b,
        colIndex: p,
        getRowAt: z
      };
      let D = 1, _ = 1;
      if (t) {
        const i = he(t(q));
        D = i.rowSpan, _ = i.colSpan;
      }
      if (D === 1 && b.rowSpan) {
        const i = b.rowSpan(q);
        typeof i == "number" && Number.isFinite(i) && (D = Math.max(0, Math.floor(i)));
      }
      if (_ === 1 && b.colSpan) {
        const i = b.colSpan(q);
        typeof i == "number" && Number.isFinite(i) && (_ = Math.max(0, Math.floor(i)));
      }
      if (D <= 0 || _ <= 0) {
        F[p] = { kind: "normal" };
        continue;
      }
      let P = Math.min(_, C[p]);
      for (let i = 1; i < P; i++)
        if (B[E + p + i] !== 0) {
          P = i;
          break;
        }
      let T = Math.min(D, f - r, K);
      for (let i = 1; i < T; i++) {
        const G = z(r + i);
        if (L(G)) {
          T = i;
          break;
        }
        const W = g + i;
        if (W < O) {
          const V = W * n;
          let ne = !1;
          for (let J = 0; J < P; J++)
            if (B[V + p + J] !== 0) {
              ne = !0;
              break;
            }
          if (ne) {
            T = i;
            break;
          }
        }
      }
      if (P <= 1 && T <= 1) {
        F[p] = { kind: "normal" };
        continue;
      }
      for (let i = 1; i < P; i++)
        B[E + p + i] = 1;
      if (T > 1)
        for (let i = 1; i < T; i++) {
          const G = g + i;
          if (G >= O) break;
          const W = G * n;
          for (let V = 0; V < P; V++)
            B[W + p + V] = 2;
        }
      let ee = 0;
      for (let i = 0; i < P; i++)
        ee += s[p + i];
      const se = h[p + P - 1]?.key, ae = !!(w && se === w);
      let te;
      T > 1 && (U = !0, e = !0, te = Math.max(k, u(r + T) - u(r))), F[p] = {
        kind: "anchor",
        rowSpan: T,
        colSpan: P,
        widthPx: ee,
        heightPx: te,
        hasRightPinnedDivider: ae
      }, H = !0;
    }
    const re = r >= a || U && r + K >= a;
    if (H && oe && re) {
      let p = r >= a;
      if (!p && U)
        for (let N = 0; N < n; N++) {
          const b = F[N];
          if (b.kind === "anchor" && b.rowSpan > 1 && r + b.rowSpan - 1 >= a) {
            p = !0, l.push(r);
            break;
          }
        }
      p && c.set(r, {
        cells: F,
        hasVerticalSpan: U,
        hasCoveredFromAbove: Z
      });
    }
  }
  return { rowPlans: c, anchorRowsBeforeStart: l, hasAnyVerticalSpan: e };
}
function ue(o, a, S) {
  if (S) {
    const k = S(o);
    return Array.isArray(k) && k.length > 0 ? k : void 0;
  }
  const f = o ? o[a] : void 0;
  return Array.isArray(f) && f.length > 0 ? f : void 0;
}
function Se(o, a, S) {
  const f = [], k = /* @__PURE__ */ new Map(), u = [], h = [];
  if (!o || o.length === 0)
    return {
      roots: f,
      nodeByKey: k,
      flatRecords: u,
      allExpandableKeys: h,
      getKeysUpToDepth: () => []
    };
  const x = String(S?.childrenField ?? "children"), M = S?.getSubRows, R = S?.parentKeyField ? String(S.parentKeyField) : void 0, w = S?.rootParentValue;
  if (R) {
    const t = [], d = /* @__PURE__ */ new Set();
    for (let e = 0; e < o.length; e++) {
      const n = o[e];
      if (!n) continue;
      let s = String(a(n, e));
      d.has(s) && (s = `${s}_${e}`), d.add(s);
      const y = n[R], C = y == null || y === "" || w !== void 0 && y === w ? null : String(y), I = u.length;
      u.push(n);
      const K = {
        key: s,
        record: n,
        sourceIndex: I,
        depth: 0,
        parentKey: C,
        children: []
      };
      t.push(K), k.set(s, K);
    }
    for (let e = 0; e < t.length; e++) {
      const n = t[e];
      if (n.parentKey !== null) {
        const s = k.get(n.parentKey);
        if (s && s.key !== n.key) {
          s.children.push(n);
          continue;
        }
      }
      n.parentKey = null, f.push(n);
    }
    const c = (e, n, s) => {
      if (!s.has(e.key)) {
        if (s.add(e.key), e.depth = n, e.children.length > 0) {
          h.push(e.key);
          for (let y = 0; y < e.children.length; y++)
            c(e.children[y], n + 1, s);
        }
        s.delete(e.key);
      }
    }, l = /* @__PURE__ */ new Set();
    for (let e = 0; e < f.length; e++)
      c(f[e], 0, l);
  } else {
    const t = /* @__PURE__ */ new Set(), d = (c, l, e) => {
      if (!c) return null;
      const n = u.length;
      let s = String(a(c, n));
      t.has(s) && (s = `${s}_${n}`), t.add(s), u.push(c);
      const y = {
        key: s,
        record: c,
        sourceIndex: n,
        depth: l,
        parentKey: e,
        children: []
      };
      k.set(s, y);
      const A = ue(c, x, M);
      if (A && A.length > 0) {
        h.push(s);
        for (let C = 0; C < A.length; C++) {
          const I = d(A[C], l + 1, s);
          I && y.children.push(I);
        }
      }
      return y;
    };
    for (let c = 0; c < o.length; c++) {
      const l = d(o[c], 0, null);
      l && f.push(l);
    }
  }
  return {
    roots: f,
    nodeByKey: k,
    flatRecords: u,
    allExpandableKeys: h,
    getKeysUpToDepth: (t) => {
      if (t <= 0) return [];
      const d = [];
      return k.forEach((c) => {
        c.children.length > 0 && c.depth < t && d.push(c.key);
      }), d;
    }
  };
}
function ke(o) {
  const {
    forest: a,
    expandedKeys: S,
    matchedIndexSet: f,
    filterMode: k = "preserveAncestors",
    sortRankBySourceIndex: u
  } = o, h = [];
  if (a.roots.length === 0) return h;
  const x = (t) => S.has(t), M = (t) => !u || t.length <= 1 ? t : [...t].sort((d, c) => {
    const l = u[d.sourceIndex] ?? d.sourceIndex, e = u[c.sourceIndex] ?? c.sourceIndex;
    return l - e;
  });
  if (f === null) {
    const t = (d) => {
      const c = M(d);
      for (let l = 0; l < c.length; l++) {
        const e = c[l], n = e.children.length > 0, s = n && x(e.key);
        h.push({
          sourceIndex: e.sourceIndex,
          key: e.key,
          depth: e.depth,
          hasChildren: n,
          isExpanded: s
        }), s && t(e.children);
      }
    };
    return t(a.roots), h;
  }
  if (k === "strict") {
    const t = (d) => {
      const c = M(d);
      for (let l = 0; l < c.length; l++) {
        const e = c[l], n = e.children.length > 0, s = n && x(e.key);
        f.has(e.sourceIndex) && h.push({
          sourceIndex: e.sourceIndex,
          key: e.key,
          depth: e.depth,
          hasChildren: n,
          isExpanded: s
        }), n && (s || f.has(e.sourceIndex)) && t(e.children);
      }
    };
    return t(a.roots), h;
  }
  const R = /* @__PURE__ */ new Map(), w = (t) => {
    let d = !1;
    for (let e = 0; e < t.children.length; e++)
      w(t.children[e]) && (d = !0);
    const l = f.has(t.sourceIndex) || d;
    return R.set(t.key, d), l;
  };
  for (let t = 0; t < a.roots.length; t++)
    w(a.roots[t]);
  const m = (t) => {
    const d = M(t);
    for (let c = 0; c < d.length; c++) {
      const l = d[c], e = f.has(l.sourceIndex), n = R.get(l.key) ?? !1;
      if (!e && !n) continue;
      const s = l.children.length > 0, y = s && (n || x(l.key));
      h.push({
        sourceIndex: l.sourceIndex,
        key: l.key,
        depth: l.depth,
        hasChildren: s,
        isExpanded: y
      }), y && m(l.children);
    }
  };
  return m(a.roots), h;
}
export {
  ye as a,
  Se as b,
  pe as c,
  ke as f
};
