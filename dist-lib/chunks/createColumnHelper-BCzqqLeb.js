import { jsx as v, jsxs as B } from "react/jsx-runtime";
import H from "react";
import { c as o, D as S, A as F, e as k } from "./gridFormatUtils-wCKPmlrt.js";
import { S as U } from "./common-29M8PlVv.js";
const j = H.lazy(
  () => import("./TwelveMonthChartCell-Cde8Sqqa.js").then((e) => ({ default: e.TwelveMonthChartCell }))
), z = new Intl.NumberFormat("vi-VN");
function P(e, t, a) {
  const r = e != null ? String(e).trim() : "", l = t != null ? String(t).trim() : "";
  return r && l ? r.toLowerCase() === l.toLowerCase() ? l : a?.pattern === "name-paren-code" ? `${l} (${r})` : `${r}${a?.separator ?? " — "}${l}` : l || r || (a?.fallback ?? "");
}
function $(e, t = " đ") {
  if (e == null || e === "") return "—";
  const a = Number(e);
  return Number.isFinite(a) ? `${z.format(a)}${t}` : "—";
}
function te() {
  return {
    cell: ({ getValue: e, column: t, isResponsive: a }) => {
      const r = e(), l = t.dataType === S.DATE, n = l ? k(r, !!t.showTime) : r, i = n != null && String(n).trim() !== "";
      if (a) {
        if (!i)
          return /* @__PURE__ */ v("span", { style: { color: "var(--agv-text-muted)" }, children: "—" });
        const m = String(n);
        return t.className ? /* @__PURE__ */ v("span", { className: t.className, children: m }) : m;
      }
      return /* @__PURE__ */ v(
        "span",
        {
          className: `truncate text-xs ${i && t.className ? t.className : ""} ${l ? "tabular-nums" : ""}`.trim(),
          style: { color: i ? "var(--agv-text-main)" : "var(--agv-text-muted)" },
          children: i ? String(n) : "—"
        }
      );
    }
  };
}
function L(e, t) {
  return typeof t == "function" ? t(e) : e ? e[t] : void 0;
}
function K(e) {
  const { code: t, name: a, pattern: r, separator: l, fallback: n, meta: i, ...m } = e;
  return {
    ...m,
    accessorFn: (c) => {
      const b = L(c, t), u = L(c, a), f = typeof n == "function" ? n(c) : n;
      return P(b, u, { pattern: r, separator: l, fallback: f });
    },
    meta: {
      align: F.LEFT,
      dataType: S.TEXT,
      ...i
    }
  };
}
function Y(e, t) {
  const {
    suffix: a = " đ",
    formatValue: r,
    highlightNegative: l = !0,
    meta: n,
    enableGlobalFilter: i = !1,
    cell: m,
    ...c
  } = t, b = r ?? ((T) => $(T, a)), u = {
    align: F.RIGHT,
    dataType: S.NUMBER,
    ...n
  }, f = m ?? (({ getValue: T }) => {
    const h = T(), x = h != null && String(h).trim() !== "" && Number.isFinite(Number(h));
    return /* @__PURE__ */ v(
      "span",
      {
        className: "text-xs font-semibold font-mono tabular-nums",
        style: {
          color: x ? l && Number(h) < 0 ? "var(--agv-danger)" : "var(--agv-text-main)" : "var(--agv-text-muted)"
        },
        children: b(h)
      }
    );
  });
  return typeof e == "function" ? {
    ...c,
    accessorFn: e,
    enableGlobalFilter: i,
    meta: u,
    cell: f
  } : {
    ...c,
    id: c.id ?? e,
    accessorKey: e,
    enableGlobalFilter: i,
    meta: u,
    cell: f
  };
}
const E = {
  [o.AVG]: { columnHeader: "Doanh số TB (12T)", short: "TB" },
  [o.SUM]: { columnHeader: "Tổng doanh số (12T)", short: "Tổng" },
  [o.MIN]: { columnHeader: "Thấp nhất (12T)", short: "Thấp nhất" },
  [o.MAX]: { columnHeader: "Cao nhất (12T)", short: "Cao nhất" }
}, w = {
  values: [],
  minIdx: 0,
  maxIdx: 0,
  minVal: 0,
  maxVal: 0,
  avgVal: 0,
  sumVal: 0
};
function W(e, t) {
  if (t) {
    const n = t(e);
    return Array.isArray(n) && n.length > 0 ? n : null;
  }
  const a = e;
  if (Array.isArray(a.months12) && a.months12.length > 0)
    return a.months12;
  let r = !1;
  for (let n = 1; n <= 12; n++)
    if (a[`col_m${n}`] !== void 0) {
      r = !0;
      break;
    }
  if (!r) return null;
  const l = [];
  for (let n = 1; n <= 12; n++)
    l.push(Number(a[`col_m${n}`]) || 0);
  return l;
}
function q(e) {
  const t = e.length;
  if (t === 0) return w;
  const a = new Array(t);
  let r = 0, l = 1 / 0, n = -1 / 0, i = 0, m = 0;
  for (let c = 0; c < t; c++) {
    const b = Number(e[c]), u = Number.isFinite(b) ? b : 0;
    a[c] = u, r += u, u < l && (l = u, i = c), u > n && (n = u, m = c);
  }
  return {
    values: a,
    minIdx: i,
    maxIdx: m,
    minVal: l,
    maxVal: n,
    avgVal: Math.round(r / t),
    sumVal: r
  };
}
function D(e) {
  const t = /* @__PURE__ */ new WeakMap();
  return (a) => {
    const r = a?._baseRecord ?? a;
    if (!r || typeof r != "object") return w;
    const l = t.get(r);
    if (l) return l;
    const n = W(r, e), i = n ? q(n) : w;
    return t.set(r, i), i;
  };
}
function G(e, t) {
  if (e.values.length !== 0)
    switch (t) {
      case o.SUM:
        return e.sumVal;
      case o.MIN:
        return e.minVal;
      case o.MAX:
        return e.maxVal;
      case o.AVG:
      default:
        return e.avgVal;
    }
}
function X(e = {}, t) {
  const {
    id: a = "MonthlyFormulaVal",
    getMonths: r,
    formatValue: l,
    headerLabels: n,
    tabletLabels: i,
    size: m = 168,
    minSize: c = 136,
    enableGlobalFilter: b = !1,
    meta: u,
    header: f,
    cell: T,
    ...h
  } = e, x = t ?? D(r), V = l ?? ((s) => $(s)), A = typeof f == "string" ? f : n?.[o.MAX] ?? E[o.MAX].columnHeader, p = h.renderCell, I = !!(T || p), R = (s) => (d) => {
    const y = x(d.row), g = G(y, s);
    if (g === void 0 || !Number.isFinite(g))
      return /* @__PURE__ */ v("span", { className: "text-xs font-mono", style: { color: "var(--agv-text-muted)" }, children: "—" });
    const C = s === o.MAX ? { color: "var(--agv-trend-up)" } : s === o.MIN ? { color: "var(--agv-trend-down)" } : { color: "var(--agv-text-main)" };
    if (d.isResponsive)
      return /* @__PURE__ */ v(
        "span",
        {
          className: "text-xs font-semibold font-mono tabular-nums",
          style: C,
          children: V(g)
        }
      );
    if (s === o.MIN || s === o.MAX) {
      const N = s === o.MIN ? y.minIdx : y.maxIdx;
      return /* @__PURE__ */ B("div", { className: "flex items-center justify-between w-full font-medium tabular-nums text-xs", children: [
        /* @__PURE__ */ v(
          "span",
          {
            className: "text-[11px] font-semibold tracking-tight",
            style: { color: "var(--agv-text-muted)" },
            children: `T${N + 1}`
          }
        ),
        /* @__PURE__ */ v("span", { className: "font-semibold font-mono text-right", style: C, children: V(g) })
      ] });
    }
    return /* @__PURE__ */ v("div", { className: "flex items-center justify-end w-full font-semibold font-mono tabular-nums text-xs", children: /* @__PURE__ */ v("span", { style: C, children: V(g) }) });
  };
  return {
    ...h,
    id: a,
    header: f ?? A,
    size: m,
    minSize: c,
    enableGlobalFilter: b,
    accessorFn: (s) => G(x(s), o.MAX),
    cell: T,
    renderCell: I ? p : R(o.MAX),
    meta: {
      align: F.RIGHT,
      dataType: S.NUMBER,
      ...u,
      isFormula: !0,
      bindColumnRuntime: ({ formulaMode: s }) => {
        const y = {
          title: typeof f == "string" ? f : n?.[s] ?? E[s].columnHeader,
          valueGetter: (g) => G(x(g), s),
          monthIndexGetter: (g, C) => {
            const N = x(g);
            return C === o.MIN ? N.minIdx : N.maxIdx;
          },
          tabletLabelGetter: (g) => {
            const C = x(g);
            if (C.values.length === 0) return;
            const N = i?.[s] ?? E[s].short;
            return s === o.MAX ? `${N} T${C.maxIdx + 1}` : s === o.MIN ? `${N} T${C.minIdx + 1}` : N;
          }
        };
        return I || (y.renderCell = R(s)), y;
      }
    }
  };
}
function _(e = {}, t) {
  const {
    id: a = "MonthlyTrendChart",
    header: r = "Xu hướng 12 tháng",
    getMonths: l,
    formatValue: n,
    size: i = 172,
    minSize: m = 140,
    enableSorting: c = !1,
    enableColumnFilter: b = !1,
    enableGlobalFilter: u = !1,
    meta: f,
    cell: T,
    ...h
  } = e, x = t ?? D(l), V = n ?? ((M) => $(M)), A = h.renderCell, p = !!(T || A), I = (M) => (s) => {
    const d = x(s.row);
    return d.values.length === 0 ? null : /* @__PURE__ */ v(H.Suspense, { fallback: null, children: /* @__PURE__ */ v(
      j,
      {
        values: d.values,
        minIdx: d.minIdx,
        maxIdx: d.maxIdx,
        minVal: d.minVal,
        maxVal: d.maxVal,
        avgVal: d.avgVal,
        surfaceTheme: M,
        formatValue: V
      }
    ) });
  };
  return {
    ...h,
    id: a,
    header: r,
    size: i,
    minSize: m,
    enableSorting: c,
    enableColumnFilter: b,
    enableGlobalFilter: u,
    accessorFn: (M) => {
      const s = x(M);
      return s.values.length > 0 ? s.avgVal : void 0;
    },
    cell: T,
    renderCell: p ? A : I(U.LIGHT),
    meta: {
      align: F.CENTER,
      dataType: S.TEXT,
      cellPadding: "none",
      ...f,
      isChart: !0,
      bindColumnRuntime: ({ surfaceTheme: M }) => {
        const s = {
          valueGetter: (d) => {
            const y = x(d);
            return y.values.length > 0 ? y.avgVal : void 0;
          }
        };
        return p || (s.renderCell = I(M)), s;
      }
    }
  };
}
function J(e = {}) {
  const t = D(e.getMonths);
  return [
    X(
      {
        ...e.formulaColumn ?? {},
        ...e.formulaId ? { id: e.formulaId } : {},
        getMonths: e.getMonths,
        formatValue: e.formatValue
      },
      t
    ),
    _(
      {
        ...e.chartColumn ?? {},
        ...e.chartId ? { id: e.chartId } : {},
        getMonths: e.getMonths,
        formatValue: e.formatValue
      },
      t
    )
  ];
}
function ne() {
  return {
    accessor(e, t) {
      return typeof e == "function" ? {
        ...t,
        accessorFn: e
      } : {
        ...t,
        id: t?.id ?? e,
        accessorKey: e
      };
    },
    display(e) {
      return { ...e };
    },
    group(e) {
      return { ...e };
    },
    codeName(e) {
      return K(e);
    },
    currency(e, t) {
      return Y(e, t);
    },
    formula12m(e) {
      return X(e);
    },
    chart12m(e) {
      return _(e);
    },
    twelveMonths(e) {
      return J(e);
    }
  };
}
export {
  E as F,
  K as a,
  _ as b,
  Y as c,
  X as d,
  J as e,
  ne as f,
  te as g,
  D as h,
  P as i,
  $ as j
};
