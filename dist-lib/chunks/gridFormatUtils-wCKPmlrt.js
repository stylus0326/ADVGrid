const M = {
  NONE: "none",
  LEFT: "left",
  RIGHT: "right",
  CENTER: "center"
}, L = {
  LEFT: "left",
  RIGHT: "right",
  NORMAL: "normal"
}, $ = {
  ASC: "asc",
  DESC: "desc"
}, R = {
  VIEW: "view",
  SINGLE_CLICK: "single-click",
  DOUBLE_CLICK: "double-click"
}, F = {
  AUTO: "auto",
  PC: "pc",
  TABLET: "tablet",
  PHONE: "phone"
}, y = {
  AVG: "AVG",
  SUM: "SUM",
  MIN: "MIN",
  MAX: "MAX"
}, c = {
  CONTAINS: "contains",
  NOT_CONTAINS: "not_contains",
  STARTS_WITH: "starts_with",
  ENDS_WITH: "ends_with",
  EQUALS: "equals",
  NOT_EQUALS: "not_equals",
  GREATER_THAN: "greater_than",
  GREATER_EQUALS: "greater_equals",
  LESS_THAN: "less_than",
  LESS_EQUALS: "less_equals",
  BETWEEN: "between",
  IS_POSITIVE: "is_positive",
  IS_NEGATIVE: "is_negative",
  IS_EMPTY: "is_empty",
  IS_NOT_EMPTY: "is_not_empty"
}, h = {
  SIMPLE: "simple",
  CHECKLIST: "checklist",
  MULTI: "multi"
}, G = {
  ALL: "ALL",
  CHECKED: "CHECKED",
  UNCHECKED: "UNCHECKED"
}, x = {
  TEXT: "text",
  NUMBER: "number",
  DATE: "date",
  DATERANGE: "daterange",
  TIME: "time",
  COMBOBOX: "combobox",
  LOOKUP: "lookup"
}, T = {
  TEXT: "text",
  NUMBER: "number",
  DATE: "date",
  TIME: "time",
  SYSTEM: "system"
}, f = {
  LEFT: "left",
  CENTER: "center",
  RIGHT: "right"
}, U = {
  HEADER: "header",
  ROW: "row",
  BAND: "band",
  GROUP: "group"
}, m = /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/, d = /^(\d{1,2})[/-](\d{1,2})(?:[/-](\d{4}))?/, g = /(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?/;
function o(t) {
  const e = String(t);
  return e.length < 2 ? `0${e}` : e;
}
function A(t) {
  if (t == null || t === "") return null;
  if (t instanceof Date) {
    if (Number.isNaN(t.getTime())) return null;
    const a = t.getFullYear(), E = t.getMonth() + 1, u = t.getDate();
    return {
      year: a,
      month: E,
      day: u,
      key: `${a}-${o(E)}-${o(u)}`
    };
  }
  const e = String(t).trim();
  if (!e) return null;
  let n = 0, s = 0, r = 0;
  const i = m.exec(e);
  if (i)
    n = parseInt(i[1], 10), s = parseInt(i[2], 10), r = parseInt(i[3], 10);
  else {
    const a = d.exec(e);
    if (!a || !a[3]) return null;
    r = parseInt(a[1], 10), s = parseInt(a[2], 10), n = parseInt(a[3], 10);
  }
  return n < 1 || s < 1 || s > 12 || r < 1 || r > 31 ? null : {
    year: n,
    month: s,
    day: r,
    key: `${n}-${o(s)}-${o(r)}`
  };
}
function P(t) {
  return A(t)?.key ?? null;
}
function N(t, e = !1, n = !1) {
  if (!t) return "";
  if (t instanceof Date) {
    if (Number.isNaN(t.getTime())) return "";
    const u = o(t.getDate()), l = o(t.getMonth() + 1), S = n ? ` ${o(t.getHours())}:${o(t.getMinutes())}` : "";
    return e ? `${u}/${l}${S}` : `${u}/${l}/${t.getFullYear()}${S}`;
  }
  const s = String(t).trim();
  if (!s) return "";
  const r = g.exec(s), i = n && r ? ` ${o(r[1])}:${o(r[2])}` : "", a = m.exec(s);
  if (a) {
    const u = o(a[3]), l = o(a[2]);
    return e ? `${u}/${l}${i}` : `${u}/${l}/${a[1]}${i}`;
  }
  const E = d.exec(s);
  if (E) {
    const u = o(E[1]), l = o(E[2]);
    return e || !E[3] ? `${u}/${l}${i}` : `${u}/${l}/${E[3]}${i}`;
  }
  return s;
}
function b(t, e = !1) {
  if (t == null) return "";
  const n = String(t).trim();
  if (!n) return "";
  if (n.includes(" - ")) {
    const s = n.split(" - "), r = N(s[0], !1, e), i = N(s[1], !1, e);
    return r && i ? `${r} - ${i}` : r || i || n;
  }
  if (n.includes("..")) {
    const s = n.split(".."), r = N(s[0], !1, e), i = N(s[1], !1, e);
    return r && i ? `${r} - ${i}` : r || i || n;
  }
  return N(n, !1, e);
}
function H(t, e = "") {
  const s = Math.max(2, String(Math.max(1, t || 0)).length) * 7.2, r = e ? e.length * 7.5 : 0;
  return Math.max(36, Math.ceil(Math.max(s, r) + 10));
}
function p(t) {
  if (t == null || t === "") return NaN;
  if (typeof t == "number") return t;
  let e = String(t).trim();
  if (!e) return NaN;
  let n = !1;
  if (/^\s*\((.*)\)\s*$/.test(e) ? (n = !0, e = e.replace(/^\s*\((.*)\)\s*$/, "$1").trim()) : /^\s*-\s*(.*)$/.test(e) && (n = !0, e = e.replace(/^\s*-\s*/, "").trim()), e = e.replace(/[^0-9.,]/g, ""), !e) return NaN;
  let s = NaN;
  const r = e.lastIndexOf("."), i = e.lastIndexOf(",");
  return r !== -1 && i !== -1 ? r < i ? s = parseFloat(e.replace(/\./g, "").replace(",", ".")) : s = parseFloat(e.replace(/,/g, "")) : r !== -1 ? e.indexOf(".") !== r ? s = parseFloat(e.replace(/\./g, "")) : e.slice(r + 1).length === 3 ? s = parseFloat(e.replace(/\./g, "")) : s = parseFloat(e) : i !== -1 ? e.indexOf(",") !== i ? s = parseFloat(e.replace(/,/g, "")) : s = parseFloat(e.replace(",", ".")) : s = parseFloat(e), isNaN(s) ? NaN : n ? -s : s;
}
function Y(t, e) {
  const n = typeof t == "number" ? t : p(t);
  if (isNaN(n)) return typeof t == "string" ? t : "";
  const s = n < 0, r = Math.abs(n);
  let i = "";
  if (e !== void 0)
    i = r.toLocaleString("vi-VN", {
      minimumFractionDigits: e,
      maximumFractionDigits: e
    });
  else {
    const a = r % 1 !== 0;
    i = r.toLocaleString("vi-VN", {
      maximumFractionDigits: a ? 2 : 0
    });
  }
  return s ? `(${i})` : i;
}
const _ = {
  [f.LEFT]: "text-left",
  [f.CENTER]: "text-center",
  [f.RIGHT]: "text-right"
};
function B(t) {
  return t && _[t] || _[f.LEFT];
}
const I = {
  [f.LEFT]: "justify-start",
  [f.CENTER]: "justify-center",
  [f.RIGHT]: "justify-end"
};
function k(t) {
  return t && I[t] || I[f.LEFT];
}
function V(t) {
  return t ? t === c.IS_EMPTY || t === c.IS_NOT_EMPTY || t === c.IS_POSITIVE || t === c.IS_NEGATIVE : !1;
}
function W(t) {
  return t === c.BETWEEN;
}
function X(t) {
  return t === c.NOT_EQUALS || t === c.NOT_CONTAINS;
}
function K(t) {
  return t ? !!t.isSelection || t.key === "col_chk" : !1;
}
const O = {
  text: c.CONTAINS,
  number: c.CONTAINS,
  date: c.BETWEEN,
  time: c.BETWEEN
};
function D(t, e) {
  const n = e?.find((s) => s.key === t);
  return n?.isCurrency ? T.NUMBER : n?.dataType === T.DATE || n?.dataType === T.TIME || n?.dataType === T.NUMBER ? n.dataType : T.TEXT;
}
function Q(t, e) {
  const n = D(t, e);
  return O[n] || c.CONTAINS;
}
function q(t, e) {
  if (t) {
    if (t.cells instanceof Map) {
      const n = t.cells.get(e);
      return n?.value !== void 0 ? n.value : void 0;
    }
    if (typeof t == "object" && t[e] !== void 0)
      return t[e];
  }
}
function C(t, e = c.EQUALS) {
  return {
    op: e,
    val: t == null ? "" : String(t)
  };
}
function j(t) {
  return C(t, c.EQUALS);
}
export {
  f as A,
  L as C,
  T as D,
  x as E,
  h as F,
  R as G,
  M as P,
  $ as S,
  G as a,
  c as b,
  y as c,
  F as d,
  b as e,
  N as f,
  Y as g,
  H as h,
  B as i,
  V as j,
  q as k,
  X as l,
  W as m,
  U as n,
  D as o,
  p,
  Q as q,
  k as r,
  K as s,
  P as t,
  j as u,
  A as v
};
