import { D as L, l as H, b as n, m as v, j as C } from "./gridFormatUtils-wCKPmlrt.js";
import { h as Q, i as d, b as D } from "./DataGridEnterprise-DyOy-gAv.js";
const p = {
  AND: "and",
  OR: "or"
};
function y(t) {
  if (!t) return null;
  const i = String(t).trim(), f = i.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (f) {
    const r = parseInt(f[1], 10), s = parseInt(f[2], 10);
    return parseInt(f[3], 10) * 1e4 + s * 100 + r;
  }
  const h = i.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (h) {
    const r = parseInt(h[1], 10), s = parseInt(h[2], 10), o = parseInt(h[3], 10);
    return r * 1e4 + s * 100 + o;
  }
  return null;
}
function b(t) {
  if (!t) return null;
  const f = String(t).trim().match(/^(\d{1,2}):(\d{2})/);
  return f ? parseInt(f[1], 10) * 60 + parseInt(f[2], 10) : null;
}
function I(t, i, f, h = L.TEXT, r) {
  const s = t == null || t === "";
  if (i === n.IS_EMPTY) return s;
  if (i === n.IS_NOT_EMPTY) return !s;
  if (h === L.NUMBER) {
    const u = Number(t);
    if (isNaN(u)) return !1;
    if (i === n.IS_POSITIVE) return u > 0;
    if (i === n.IS_NEGATIVE) return u < 0;
    const e = Number(f);
    if (isNaN(e) && !v(i)) return !0;
    if (i === n.EQUALS) return u === e;
    if (i === n.NOT_EQUALS) return u !== e;
    if (i === n.GREATER_THAN) return u > e;
    if (i === n.GREATER_EQUALS) return u >= e;
    if (i === n.LESS_THAN) return u < e;
    if (i === n.LESS_EQUALS) return u <= e;
    if (v(i)) {
      const T = Number(r);
      return isNaN(T) ? u >= e : u >= Math.min(e, T) && u <= Math.max(e, T);
    }
  }
  if (h === L.DATE) {
    const u = y(t);
    if (u === null) return !1;
    const e = y(f);
    if (i === n.EQUALS) return e !== null && u === e;
    if (i === n.NOT_EQUALS) return e !== null && u !== e;
    if (i === n.GREATER_THAN) return e !== null && u > e;
    if (i === n.GREATER_EQUALS) return e !== null && u >= e;
    if (i === n.LESS_THAN) return e !== null && u < e;
    if (i === n.LESS_EQUALS) return e !== null && u <= e;
    if (v(i)) {
      const T = y(r);
      return e === null && T === null ? !0 : e !== null && T === null ? u >= e : e === null && T !== null ? u <= T : u >= Math.min(e, T) && u <= Math.max(e, T);
    }
  }
  if (h === L.TIME) {
    const u = b(t);
    if (u === null) return !1;
    const e = b(f);
    if (i === n.EQUALS) return e !== null && u === e;
    if (i === n.NOT_EQUALS) return e !== null && u !== e;
    if (i === n.GREATER_THAN) return e !== null && u > e;
    if (i === n.GREATER_EQUALS) return e !== null && u >= e;
    if (i === n.LESS_THAN) return e !== null && u < e;
    if (i === n.LESS_EQUALS) return e !== null && u <= e;
    if (v(i)) {
      const T = b(r);
      return e === null && T === null ? !0 : e !== null && T === null ? u >= e : e === null && T !== null ? u <= T : u >= Math.min(e, T) && u <= Math.max(e, T);
    }
    if (i === n.CONTAINS)
      return String(t).includes(String(f));
  }
  const o = String(t ?? "").toLowerCase(), c = String(f ?? "").toLowerCase();
  switch (i) {
    case n.CONTAINS:
      return o.includes(c);
    case n.NOT_CONTAINS:
      return !o.includes(c);
    case n.STARTS_WITH:
      return o.startsWith(c);
    case n.ENDS_WITH:
      return o.endsWith(c);
    case n.EQUALS:
      return o === c;
    case n.NOT_EQUALS:
      return o !== c;
    case n.GREATER_THAN:
      return o > c;
    case n.GREATER_EQUALS:
      return o >= c;
    case n.LESS_THAN:
      return o < c;
    case n.LESS_EQUALS:
      return o <= c;
    case n.BETWEEN: {
      const u = String(r ?? "").toLowerCase();
      return o >= c && o <= u;
    }
    default:
      return o.includes(c);
  }
}
function O(t, i, f, h, r = {}) {
  if (!t) return !0;
  if ("combinator" in t) {
    if (!Array.isArray(t.rules) || t.rules.length === 0) return !0;
    const N = t.rules.filter((m) => Q(m));
    return N.length === 0 ? !0 : t.combinator === p.AND ? N.every(
      (m) => O(m, i, f, h, r)
    ) : N.some(
      (m) => O(m, i, f, h, r)
    );
  }
  if (!d(t)) return !0;
  const { field: s, operator: o, value: c, valueTo: u } = t;
  let e;
  h ? e = h(f, s) : i && typeof i == "object" && (e = i.cells?.get ? i.cells.get(s)?.value : i[s]);
  const T = r[s] || L.TEXT;
  return Array.isArray(t.multiValues) && t.multiValues.length > 0 ? H(o) ? t.multiValues.every((m) => I(e, o, m, T)) : t.multiValues.some((m) => I(e, o, m, T)) : Array.isArray(t.multiRanges) && t.multiRanges.length > 0 ? t.multiRanges.some((N) => I(e, n.BETWEEN, N.from, T, N.to)) : I(e, o, c, T, u);
}
const w = {
  [n.CONTAINS]: "Có chứa",
  [n.NOT_CONTAINS]: "Không chứa",
  [n.STARTS_WITH]: "Bắt đầu với",
  [n.ENDS_WITH]: "Kết thúc với",
  [n.EQUALS]: "=",
  [n.NOT_EQUALS]: "≠",
  [n.GREATER_THAN]: ">",
  [n.GREATER_EQUALS]: "≥",
  [n.LESS_THAN]: "<",
  [n.LESS_EQUALS]: "≤",
  [n.BETWEEN]: "nằm giữa",
  [n.IS_POSITIVE]: "dương (> 0)",
  [n.IS_NEGATIVE]: "âm (< 0)",
  [n.IS_EMPTY]: "trống",
  [n.IS_NOT_EMPTY]: "không trống"
};
function G(t, i) {
  const h = i.find((o) => o.key === t.field)?.title || t.field, r = t.operator === n.BETWEEN ? "từ" : w[t.operator] || t.operator;
  if (Array.isArray(t.multiValues) && t.multiValues.length > 0) {
    const o = t.multiValues.length, c = t.multiValues.slice(0, 2).map((e) => `"${e}"`).join(", "), u = o > 2 ? ` +${o - 2}` : "";
    return `[${h}] ${r} (${c}${u})`;
  }
  if (Array.isArray(t.multiRanges) && t.multiRanges.length > 0)
    return `[${h}] (${t.multiRanges.length} khoảng)`;
  if (v(t.operator)) {
    const o = t.value !== void 0 && t.value !== "" ? `"${t.value}"` : "...", c = t.valueTo !== void 0 && t.valueTo !== "" ? `"${t.valueTo}"` : "...";
    return `[${h}] từ ${o} đến ${c}`;
  }
  if (C(t.operator))
    return `[${h}] là ${r}`;
  const s = t.value !== void 0 && t.value !== null && String(t.value).trim() !== "";
  return `[${h}] ${r} ${s ? `"${t.value}"` : "..."}`;
}
function k(t, i) {
  if (!t) return "";
  const f = new Map(i.map((s) => [s.key, s.title || s.key]));
  if ("combinator" in t) {
    const s = (t.rules || []).map((c) => k(c, i)).filter(Boolean);
    if (s.length === 0) return "";
    const o = t.combinator === p.AND ? " VÀ " : " HOẶC ";
    return s.length === 1 ? s[0] : `(${s.join(o)})`;
  }
  if (!d(t)) return "";
  const h = f.get(t.field) || t.field, r = w[t.operator] || t.operator;
  if (Array.isArray(t.multiValues) && t.multiValues.length > 0) {
    const s = t.multiValues.map((o) => `"${o}"`).join(", ");
    return `[${h}] ${r} (${s})`;
  }
  if (Array.isArray(t.multiRanges) && t.multiRanges.length > 0) {
    const s = t.multiRanges.map((o) => `từ "${o.from}" đến "${o.to}"`).join(", ");
    return `[${h}] trong các khoảng (${s})`;
  }
  return v(t.operator) ? `[${h}] từ "${t.value}" đến "${t.valueTo}"` : C(t.operator) ? `[${h}] là ${r}` : `[${h}] ${r} "${t.value}"`;
}
function M(t, i) {
  if (!t) return { isValid: !0 };
  const f = new Set(i.map((r) => r.key)), h = new Map(i.map((r) => [r.key, r.title || r.key]));
  if ("combinator" in t) {
    if (!Array.isArray(t.rules) || t.rules.length === 0) return { isValid: !0 };
    for (const r of t.rules) {
      const s = M(r, i);
      if (!s.isValid) return s;
    }
    return { isValid: !0 };
  }
  return t.field && !f.has(t.field) ? {
    isValid: !1,
    error: `Cột [${h.get(t.field) || t.field}] không tồn tại trên bảng dữ liệu hiện tại.`
  } : { isValid: !0 };
}
function P(t, i) {
  if (!t || typeof t != "string" || !t.trim())
    return { isValid: !1, error: "Chuỗi lệnh CMD không được để trống." };
  const f = t.trim().replace(/^>\s*/, ""), h = /* @__PURE__ */ new Map();
  for (const a of i)
    a.title && h.set(a.title.toLowerCase().trim(), a.key), a.key && h.set(a.key.toLowerCase().trim(), a.key);
  let r = 0;
  const s = f.length;
  function o() {
    return r < s ? f[r] : null;
  }
  function c() {
    for (; r < s && /\s/.test(f[r]); )
      r++;
  }
  let u = 0;
  for (let a = 0; a < s; a++) {
    const E = f[a];
    if (E === "(") u++;
    else if (E === ")" && (u--, u < 0))
      return { isValid: !1, error: 'Dấu ngoặc đơn thừa dấu ngoặc đóng ")".' };
  }
  if (u > 0)
    return { isValid: !1, error: 'Dấu ngoặc đơn thiếu dấu ngoặc đóng ")".' };
  function e() {
    return T();
  }
  function T() {
    const a = [], E = N();
    if (!E) return null;
    for (a.push(E); ; ) {
      c();
      const S = r;
      if (l("hoặc") || l("or") || A("||")) {
        const g = N();
        if (!g)
          throw new Error("Thiếu điều kiện sau từ nối HOẶC.");
        a.push(g);
      } else {
        r = S;
        break;
      }
    }
    return a.length === 1 ? a[0] : {
      combinator: p.OR,
      rules: a
    };
  }
  function N() {
    const a = [], E = m();
    if (!E) return null;
    for (a.push(E); ; ) {
      c();
      const S = r;
      if (l("và") || l("and") || A("&&")) {
        const g = m();
        if (!g)
          throw new Error("Thiếu điều kiện sau từ nối VÀ.");
        a.push(g);
      } else {
        r = S;
        break;
      }
    }
    return a.length === 1 ? a[0] : {
      combinator: p.AND,
      rules: a
    };
  }
  function m() {
    if (c(), o() === "(") {
      r++;
      const a = e();
      if (c(), o() !== ")")
        throw new Error('Thiếu dấu ngoặc đóng ")".');
      if (r++, !a) throw new Error("Biểu thức trong dấu ngoặc rỗng.");
      return "combinator" in a ? a : {
        combinator: p.AND,
        rules: [a]
      };
    }
    return U();
  }
  function l(a) {
    c();
    const E = a.length;
    if (r + E <= s && f.substring(r, r + E).toLowerCase() === a.toLowerCase()) {
      const g = r + E < s ? f[r + E] : " ";
      if (/[\s()\[\]]/.test(g) || g === " ")
        return r += E, !0;
    }
    return !1;
  }
  function A(a) {
    c();
    const E = a.length;
    return r + E <= s && f.substring(r, r + E) === a ? (r += E, !0) : !1;
  }
  function U() {
    if (c(), o() !== "[") {
      const _ = f.substring(r, Math.min(s, r + 20));
      throw new Error(`Kỳ vọng mở ngoặc vuông [Tên Cột], nhưng gặp: "${_}"`);
    }
    r++;
    const a = r;
    for (; r < s && f[r] !== "]"; )
      r++;
    if (r >= s)
      throw new Error('Thiếu dấu đóng ngoặc vuông "]" cho tên cột.');
    const E = f.substring(a, r).trim();
    r++;
    const S = h.get(E.toLowerCase());
    if (!S)
      throw new Error(`Cột [${E}] không tồn tại trên bảng dữ liệu hiện tại.`);
    if (c(), l("là trống") || l("trống") || l(n.IS_EMPTY) || l("is empty"))
      return { field: S, operator: n.IS_EMPTY, value: "" };
    if (l("là không trống") || l("không trống") || l(n.IS_NOT_EMPTY) || l("is not empty"))
      return { field: S, operator: n.IS_NOT_EMPTY, value: "" };
    if (l("là dương") || l("dương") || l("dương (> 0)") || l(n.IS_POSITIVE))
      return { field: S, operator: n.IS_POSITIVE, value: "" };
    if (l("là âm") || l("âm") || l("âm (< 0)") || l(n.IS_NEGATIVE))
      return { field: S, operator: n.IS_NEGATIVE, value: "" };
    if (l("từ") || l("nằm giữa") || l(n.BETWEEN)) {
      const _ = R();
      if (!l("đến") && !l("và") && !l(p.AND))
        throw new Error(`Toán tử "từ" cần có chữ "đến" (Ví dụ: [${E}] từ "10" đến "20").`);
      const V = R();
      return {
        field: S,
        operator: n.BETWEEN,
        value: _,
        valueTo: V
      };
    }
    let g = null;
    if (A(">=") || A("≥") || l("lớn hơn hoặc bằng") ? g = n.GREATER_EQUALS : A("<=") || A("≤") || l("nhỏ hơn hoặc bằng") ? g = n.LESS_EQUALS : A("!=") || A("≠") || A("<>") || l("khác") || l(n.NOT_EQUALS) ? g = n.NOT_EQUALS : A("==") || A("=") || l("bằng") || l(n.EQUALS) ? g = n.EQUALS : A(">") || l("lớn hơn") || l(n.GREATER_THAN) ? g = n.GREATER_THAN : A("<") || l("nhỏ hơn") || l(n.LESS_THAN) ? g = n.LESS_THAN : l("không chứa") || l(n.NOT_CONTAINS) ? g = n.NOT_CONTAINS : l("có chứa") || l("chứa") || l(n.CONTAINS) ? g = n.CONTAINS : l("bắt đầu với") || l("bắt đầu bằng") || l(n.STARTS_WITH) ? g = n.STARTS_WITH : (l("kết thúc với") || l("kết thúc bằng") || l(n.ENDS_WITH)) && (g = n.ENDS_WITH), !g) {
      const _ = f.substring(r, Math.min(s, r + 20));
      throw new Error(`Toán tử không hợp lệ sau cột [${E}]: "${_}"`);
    }
    if (c(), o() === "(") {
      r++;
      const _ = [];
      for (; r < s && o() !== ")"; )
        _.push(R()), c(), o() === "," && (r++, c());
      return o() === ")" && r++, {
        field: S,
        operator: g,
        value: _[0] || "",
        multiValues: _
      };
    }
    const $ = R();
    return {
      field: S,
      operator: g,
      value: $
    };
  }
  function R() {
    if (c(), r >= s)
      throw new Error("Thiếu giá trị so sánh.");
    const a = o();
    if (a === '"' || a === "'") {
      r++;
      const g = r;
      for (; r < s && f[r] !== a; )
        r++;
      if (r >= s)
        throw new Error(`Thiếu dấu đóng ngoặc kép ${a} cho giá trị.`);
      const $ = f.substring(g, r);
      return r++, $;
    }
    const E = r;
    for (; r < s && !/[\s()\[\]]/.test(f[r]); )
      r++;
    const S = f.substring(E, r);
    if (!S)
      throw new Error("Thiếu giá trị so sánh.");
    return S;
  }
  try {
    const a = e();
    if (!a)
      return { isValid: !1, error: "Không thể phân tích câu lệnh." };
    if (c(), r < s)
      return { isValid: !1, error: `Cú pháp dư thừa không nhận diện được: "${f.substring(r, Math.min(s, r + 20))}"` };
    let E;
    return "combinator" in a ? E = a : E = {
      combinator: p.AND,
      rules: [a]
    }, { isValid: !0, tree: E };
  } catch (a) {
    return { isValid: !1, error: a.message || "Lỗi cú pháp câu lệnh." };
  }
}
const Y = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  QUERY_OP_DISPLAY_MAP: w,
  countActiveQueryRules: D,
  evaluateQueryTreeNode: O,
  evaluateValueCondition: I,
  formatQueryRuleSummary: G,
  generateNaturalLanguage: k,
  hasActiveQueryRules: Q,
  isRuleActive: d,
  parseCmdToQueryTree: P,
  parseDateToNum: y,
  parseTimeToMinutes: b,
  validateQueryTreeAgainstColumns: M
}, Symbol.toStringTag, { value: "Module" }));
export {
  p as Q,
  y as a,
  P as b,
  O as e,
  G as f,
  k as g,
  b as p,
  Y as q,
  M as v
};
