import { p as a, g as p } from "./gridFormatUtils-wCKPmlrt.js";
const h = /(^|[^a-zA-Z0-9à-ỹÀ-Ỹ])(\d+(?:[.,]\d+)*)\s*(tr|ty|k|m|b)(?:\s*(\d+))?(?=$|[^a-zA-Z0-9à-ỹÀ-Ỹ])/gi;
function N(n) {
  return n == null ? "" : String(n).replace(
    h,
    (s, u, m, r, o) => {
      const i = a(m);
      if (isNaN(i)) return s;
      const t = String(r).toLowerCase();
      let e = 1;
      t === "k" ? e = 1e3 : t === "m" || t === "tr" ? e = 1e6 : (t === "b" || t === "ty") && (e = 1e9);
      let l = 0;
      o && (l = parseFloat(String(o)) / Math.pow(10, String(o).length));
      const g = Math.round((i + l) * e * 1e6) / 1e6;
      return u + g;
    }
  );
}
function f(n) {
  if (n == null || n === "") return "";
  const s = String(n).trim();
  if (/[a-zA-Zà-ỹÀ-Ỹ]/.test(s)) return s;
  const u = a(s);
  return isNaN(u) ? s : p(u);
}
function c(n) {
  if (n == null) return "";
  const s = String(n).trim();
  return N(s);
}
function d(n, s) {
  if (n == null) return null;
  const u = String(n).trim();
  if (!u) return null;
  if (u.includes("..")) {
    const r = u.split(".."), o = c(r[0]?.trim() || ""), i = c(r[1]?.trim() || ""), t = o ? f(o) : "", e = i ? f(i) : "";
    return !t && !e ? null : {
      isRange: !0,
      from: t,
      to: e,
      fromNum: t ? a(t) : NaN,
      toNum: e ? a(e) : NaN,
      formatted: `${t}..${e}`
    };
  }
  if (u.includes("/")) {
    const r = u.split("/"), o = c(r[0]?.trim() || ""), i = c(r[1]?.trim() || ""), t = o ? f(o) : "", e = i ? f(i) : "";
    return !t && !e ? null : {
      isRange: !0,
      from: t,
      to: e,
      fromNum: t ? a(t) : NaN,
      toNum: e ? a(e) : NaN,
      formatted: `${t} / ${e}`
    };
  }
  if (u.includes("~")) {
    const r = u.split("~"), o = c(r[0]?.trim() || ""), i = c(r[1]?.trim() || ""), t = o ? f(o) : "", e = i ? f(i) : "";
    return !t && !e ? null : {
      isRange: !0,
      from: t,
      to: e,
      fromNum: t ? a(t) : NaN,
      toNum: e ? a(e) : NaN,
      formatted: `${t} - ${e}`
    };
  }
  const m = u.match(/^([^–—-]+)\s*[-–—]\s*(.*)$/);
  if (m) {
    const r = c(m[1]), o = c(m[2]), i = r ? f(r) : "", t = o ? f(o) : "";
    return !i && !t ? null : {
      isRange: !0,
      from: i,
      to: t,
      fromNum: i ? a(i) : NaN,
      toNum: t ? a(t) : NaN,
      formatted: `${i} - ${t}`
    };
  }
  return null;
}
function $(n, s, u = !1) {
  if (n == null) return "";
  const m = String(n), r = N(m);
  if (r.includes(";") && !r.includes(".."))
    return r.split(";").map((i) => {
      const t = i.trim();
      if (!t) return "";
      if (t.includes("/") || t.includes("-")) {
        const l = d(t);
        return l ? l.formatted : t;
      }
      if (/[a-zA-Zà-ỹÀ-Ỹ]/.test(t) || /\d[.,]$/.test(t)) return t;
      const e = c(t);
      return e ? f(e) : t;
    }).join("; ");
  if (r.includes("..") || r.includes("/") || r.includes("-") || r.includes("~")) {
    const i = d(r);
    if (i)
      return m.trim().endsWith("-") || m.trim().endsWith("/") ? i.from ? `${i.from} - ` : "" : i.formatted;
  }
  if (/[a-zA-Zà-ỹÀ-Ỹ]/.test(r) || /\d[.,]$/.test(r))
    return r;
  const o = c(r);
  return o ? f(o) : r;
}
function S(n) {
  n.ctrlKey || n.metaKey || n.altKey || [
    "Backspace",
    "Delete",
    "ArrowLeft",
    "ArrowRight",
    "ArrowUp",
    "ArrowDown",
    "Tab",
    "Home",
    "End",
    "PageUp",
    "PageDown",
    "Enter",
    "Escape"
  ].includes(n.key) || /^[0-9/,\-. ;kmtrby()~]$/i.test(n.key) || n.preventDefault();
}
export {
  h as NUMERIC_SHORTCUT_REGEX,
  c as cleanNumericInput,
  N as expandAllShortcuts,
  f as formatNumberWithCommas,
  $ as formatSmartInputText,
  S as handleNumericKeyDown,
  d as parseSmartNumericRange
};
