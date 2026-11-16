import { D as _, S as x, k as F, c as D, p, t as v, F as k, j as $, b as i, l as H, m as U, g as Y } from "./gridFormatUtils-wCKPmlrt.js";
import { expandAllShortcuts as O } from "./smartNumberUtils-CUYJXloj.js";
function C(e) {
  if (!e) return null;
  const r = e.trim();
  if (r.includes("..")) {
    const u = r.split("..");
    return [u[0].trim(), u[1].trim()];
  }
  if (/\s+-\s+|\s+đến\s+|\s+to\s+/i.test(r)) {
    const u = r.split(/\s+-\s+|\s+đến\s+|\s+to\s+/i);
    return [u[0].trim(), u[1].trim()];
  }
  return null;
}
function M(e, r = !1) {
  if (!e) return null;
  const u = e.trim(), l = u.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
  if (l) {
    const c = parseInt(l[1], 10), N = parseInt(l[2], 10) - 1, A = parseInt(l[3], 10);
    return new Date(A, N, c, r ? 23 : 0, r ? 59 : 0, r ? 59 : 0, r ? 999 : 0).getTime();
  }
  const s = u.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/);
  if (s) {
    const c = parseInt(s[1], 10), N = parseInt(s[2], 10) - 1, A = parseInt(s[3], 10);
    return new Date(c, N, A, r ? 23 : 0, r ? 59 : 0, r ? 59 : 0, r ? 999 : 0).getTime();
  }
  const T = u.match(/^(\d{4})$/);
  if (T) {
    const c = parseInt(T[1], 10);
    return r ? new Date(c, 11, 31, 23, 59, 59, 999).getTime() : new Date(c, 0, 1, 0, 0, 0, 0).getTime();
  }
  return null;
}
function Q(e) {
  if (!e) return null;
  const r = e.trim().match(/^(\d{1,2}):?(\d{0,2})$/);
  if (!r) return null;
  const u = parseInt(r[1], 10), l = r[2] ? parseInt(r[2], 10) : 0;
  return isNaN(u) || isNaN(l) ? null : u * 60 + l;
}
function w(e, r, u, l = _.TEXT, s) {
  if (!!(s && (Array.isArray(s.selectedValues) && s.selectedValues.length > 0 || s.includeBlanks))) {
    const { selectedValues: n = [], includeBlanks: t } = s;
    if (e == null || typeof e == "string" && e.trim() === "") {
      if (!t) return !1;
    } else if (n.length > 0) {
      const m = String(e).trim(), E = l === _.DATE, o = E ? v(e) : null;
      if (!n.some((R) => {
        const S = String(R).trim();
        if (S === m) return !0;
        if (E && o) {
          if (S === o) return !0;
          if (S.length !== 10) {
            const y = v(S);
            if (y && y === o) return !0;
          }
        }
        if (l === _.NUMBER) {
          const y = S.replace(/,/g, ""), G = m.replace(/,/g, "");
          if (y === G) return !0;
        }
        return !1;
      })) return !1;
    } else if (!t)
      return !1;
  }
  const c = s?.mode === k.MULTI && !!(Array.isArray(s.multiValues) && s.multiValues.length > 0 || Array.isArray(s.multiRanges) && s.multiRanges.length > 0), N = $(r), A = typeof u == "string" && u.trim().length > 0;
  if (!(c || N || A))
    return !0;
  if (r === i.IS_EMPTY)
    return e == null || String(e).trim() === "";
  if (r === i.IS_NOT_EMPTY)
    return e != null && String(e).trim() !== "";
  if (r === i.IS_POSITIVE) {
    const n = p(e);
    return !isNaN(n) && n > 0;
  }
  if (r === i.IS_NEGATIVE) {
    const n = p(e);
    return !isNaN(n) && n < 0;
  }
  if (c) {
    if (Array.isArray(s.multiRanges) && s.multiRanges.length > 0)
      return s.multiRanges.some((n) => {
        const t = String(n?.from ?? "").trim(), f = String(n?.to ?? "").trim();
        return !t && !f ? !1 : t && f ? w(e, i.BETWEEN, `${t}..${f}`, l) : t ? w(e, i.GREATER_EQUALS, t, l) : w(e, i.LESS_EQUALS, f, l);
      });
    if (Array.isArray(s.multiValues) && s.multiValues.length > 0) {
      const n = s.multiValues.map((t) => String(t ?? "").trim()).filter((t) => t.length > 0);
      return n.length === 0 ? !0 : H(r) ? n.every((t) => w(e, r, t, l)) : n.some((t) => w(e, r, t, l));
    }
  }
  const g = u.trim();
  if (!g) return !0;
  if (l === _.DATE) {
    const n = String(e ?? "").trim(), t = C(n);
    let f = null, m = null;
    t ? (f = M(t[0], !1), m = M(t[1], !0)) : (f = M(n, !1), m = M(n, !0));
    const E = C(g);
    let o = null, h = null;
    if (E ? (o = M(E[0], !1), h = M(E[1], !0)) : (o = M(g, !1), h = M(g, !0)), f !== null && m !== null && o !== null) {
      const R = h !== null ? h : o;
      if (E || U(r))
        return f <= R && m >= o;
      switch (r) {
        case i.EQUALS:
          return o >= f && o <= m;
        case i.NOT_EQUALS:
          return !(o >= f && o <= m);
        case i.GREATER_THAN:
          return m > R;
        case i.GREATER_EQUALS:
          return m >= o;
        case i.LESS_THAN:
          return f < o;
        case i.LESS_EQUALS:
          return f <= R;
      }
    }
    return n.toLowerCase().includes(g.toLowerCase());
  }
  if (l === _.TIME) {
    const n = String(e ?? "").trim(), t = Q(n);
    if (/\s*-\s*|\.\.|\~/.test(g) || U(r)) {
      const E = g.split(/\s*-\s*|\.\.|\~/), o = Q(E[0]?.trim() || ""), h = E.length > 1 ? Q(E[1]?.trim() || "") : null;
      if (t === null) return !1;
      if (o !== null && h !== null) {
        const R = Math.min(o, h), S = Math.max(o, h);
        return t >= R && t <= S;
      }
      return o !== null ? t >= o : h !== null ? t <= h : !0;
    }
    const m = Q(g);
    if (t !== null && m !== null)
      switch (r) {
        case i.EQUALS:
          return t === m;
        case i.NOT_EQUALS:
          return t !== m;
        case i.GREATER_EQUALS:
          return t >= m;
        case i.LESS_EQUALS:
          return t <= m;
      }
    return n.toLowerCase().includes(g.toLowerCase());
  }
  const a = O(g);
  if (U(r) || l === _.NUMBER && (a.includes("..") || a.includes(" - ") || a.includes("/") || a.includes("~"))) {
    let n = "", t = "";
    if (a.includes("..")) {
      const S = a.split("..");
      n = S[0]?.trim() || "", t = S[1]?.trim() || "";
    } else if (a.includes(" - ")) {
      const S = a.split(" - ");
      n = S[0]?.trim() || "", t = S[1]?.trim() || "";
    } else if (a.includes("/")) {
      const S = a.split("/");
      n = S[0]?.trim() || "", t = S[1]?.trim() || "";
    } else if (a.includes("~")) {
      const S = a.split("~");
      n = S[0]?.trim() || "", t = S[1]?.trim() || "";
    } else {
      const S = a.match(/^([^–—-]+)\s*[-–—]\s*(.*)$/);
      S ? (n = S[1]?.trim() || "", t = S[2]?.trim() || "") : n = a;
    }
    const f = p(n), m = p(t), E = p(e);
    if (!isNaN(E))
      return !isNaN(f) && !isNaN(m) ? E >= Math.min(f, m) && E <= Math.max(f, m) : isNaN(f) ? isNaN(m) ? !0 : E <= m : E >= f;
    const o = String(e ?? "").toLowerCase(), h = n.toLowerCase(), R = t.toLowerCase();
    return h && R ? o >= h && o <= R : h ? o >= h : R ? o <= R : o.includes(a.toLowerCase());
  }
  if (l === _.NUMBER) {
    const n = p(e), t = p(a);
    if (!isNaN(n) && !isNaN(t))
      switch (r) {
        case i.EQUALS:
          return Math.abs(n - t) < 1e-3;
        case i.NOT_EQUALS:
          return Math.abs(n - t) >= 1e-3;
        case i.GREATER_THAN:
          return n > t;
        case i.GREATER_EQUALS:
          return n >= t;
        case i.LESS_THAN:
          return n < t;
        case i.LESS_EQUALS:
          return n <= t;
        case i.CONTAINS: {
          const f = String(e ?? ""), m = Y(e), E = a.trim();
          return f.includes(E) || m.includes(E);
        }
      }
  }
  const d = String(e ?? "").toLowerCase(), I = g.toLowerCase();
  switch (r) {
    case i.CONTAINS:
      return d.includes(I);
    case i.NOT_CONTAINS:
      return !d.includes(I);
    case i.STARTS_WITH:
      return d.startsWith(I);
    case i.ENDS_WITH:
      return d.endsWith(I);
    case i.EQUALS:
      return d === I;
    case i.NOT_EQUALS:
      return d !== I;
    case i.GREATER_THAN:
      return d > I;
    case i.GREATER_EQUALS:
      return d >= I;
    case i.LESS_THAN:
      return d < I;
    case i.LESS_EQUALS:
      return d <= I;
    default:
      return d.includes(I);
  }
}
function B(e, r, u, l, s) {
  if (!e) return "";
  const T = F(e, r);
  if (l && (s === D.MIN || s === D.MAX)) {
    let c = 0, N = s === D.MIN ? 1 / 0 : -1 / 0;
    for (let A = 1; A <= 12; A++) {
      const L = Number(e[`col_m${A}`]) || 0;
      (s === D.MIN && L < N || s === D.MAX && L > N) && (N = L, c = A - 1);
    }
    return c;
  }
  if (u === _.NUMBER) {
    const c = p(T);
    return isNaN(c) ? 0 : c;
  }
  if (u === _.DATE) {
    const c = M(String(T ?? ""));
    return c !== null ? c : 0;
  }
  if (u === _.TIME) {
    const c = Q(String(T ?? ""));
    return c !== null ? c : 0;
  }
  return String(T ?? "").toLowerCase();
}
function X(e, r, u, l, s) {
  if (!u) return 0;
  const c = l?.find((g) => g.key === u.key)?.dataType || _.TEXT, N = B(e, u.key, c, u.sortByMonth, s), A = B(r, u.key, c, u.sortByMonth, s);
  if (N === A) return 0;
  if (N == null || N === "") return 1;
  if (A == null || A === "") return -1;
  const L = N < A ? -1 : 1;
  return u.direction === x.ASC ? L : -L;
}
function q(e, r, u, l = 300) {
  let s = 1 / 0, T = -1 / 0;
  const c = (a) => {
    if (a == null || a === "") return;
    const d = String(a).trim();
    if (!d) return;
    const I = C(d);
    if (I) {
      const n = M(I[0], !1), t = M(I[1], !0);
      n !== null && n < s && (s = n), t !== null && t > T && (T = t);
    } else {
      const n = M(d, !1);
      n !== null && (n < s && (s = n), n > T && (T = n));
    }
  }, N = Math.min(r, l);
  for (let a = 0; a < N; a++)
    c(e(a, u));
  if (s === 1 / 0 || T === -1 / 0)
    return { min: "2017-01-01", max: "2027-12-31" };
  const A = new Date(s), L = new Date(T), g = (a) => String(a).padStart(2, "0");
  return {
    min: `${A.getFullYear()}-${g(A.getMonth() + 1)}-${g(A.getDate())}`,
    max: `${L.getFullYear()}-${g(L.getMonth() + 1)}-${g(L.getDate())}`
  };
}
export {
  X as compareGridRows,
  q as getColumnDateBoundsFromGetter,
  B as getRowValueForSortGeneric,
  w as matchFilterValue,
  M as parseSingleDateTimestamp,
  Q as parseTimeToMinutes,
  C as splitDateRange
};
