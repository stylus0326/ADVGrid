import { D as b, h as T } from "./gridFormatUtils-wCKPmlrt.js";
let u = null;
const m = '12px Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', k = 'bold 12px Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', v = 'bold 12px Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
function p(e, i = m) {
  if (typeof document > "u") return 100;
  u || (u = document.createElement("canvas"));
  const s = u.getContext("2d");
  return s ? (s.font = i, s.measureText(String(e ?? "")).width) : 100;
}
function _(e, i = [], s = 380, c = 65, r, l, o) {
  if (!e) return 120;
  if (e.dataType === b.SYSTEM)
    return e.title ? T(l || (Array.isArray(i) ? i.length : 100), e.title) : e.defaultWidth || 32;
  if (e.isChart) return e.minWidth || e.defaultWidth || 150;
  const d = o || 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', S = `12px ${d}`, A = `bold 12px ${d}`, g = `bold 12px ${d}`, x = p(e.title || e.key, o ? A : k) + 36;
  let a = 0;
  (Array.isArray(i) ? i.slice(0, 100) : []).forEach((t) => {
    let n = "";
    if (t?._isGroupRow ? n = t.groupSums?.[e.key] : t?.cells instanceof Map ? n = t.cells.get(e.key)?.value : t?.cells && typeof t.cells == "object" && t.cells[e.key] !== void 0 ? n = t.cells[e.key]?.value ?? t.cells[e.key] : t?.[e.key] !== void 0 ? n = t[e.key] : e.isFormula && (n = "T12: 100.0"), n != null && n !== "" && typeof n != "boolean") {
      const f = typeof n == "number" ? n.toLocaleString("vi-VN") : String(n), h = p(f, o ? S : m);
      h > a && (a = h);
    }
  }), Array.isArray(r) && r.length > 0 && r.forEach((t) => {
    if (t != null && t !== "") {
      const n = typeof t == "number" ? t.toLocaleString("vi-VN") : String(t), f = p(n, o ? g : v);
      f > a && (a = f);
    }
  });
  const F = a > 0 ? a + 28 : 0, M = Math.max(x, F), y = Math.max(e.minWidth || c, Math.ceil(M));
  return s ? Math.min(s, y) : y;
}
function N(e, i, s = 100) {
  if (!i || e <= 0) return [];
  const c = Math.min(e, s), r = [];
  for (let l = 0; l < c; l++) {
    const o = i(l);
    o !== void 0 && r.push(o);
  }
  return r;
}
export {
  _ as calcColAutoFitWidth,
  N as collectAutoFitSampleRows,
  p as measureTextWidth
};
