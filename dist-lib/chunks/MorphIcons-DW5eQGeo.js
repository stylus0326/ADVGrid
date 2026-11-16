var fe = Object.defineProperty;
var he = (t, s, o) => s in t ? fe(t, s, { enumerable: !0, configurable: !0, writable: !0, value: o }) : t[s] = o;
var et = (t, s, o) => he(t, typeof s != "symbol" ? s + "" : s, o);
import { jsxs as me, jsx as lt } from "react/jsx-runtime";
import { forwardRef as de, useState as Ft, useRef as G, useCallback as ge, useEffect as nt, useImperativeHandle as pe, useLayoutEffect as be } from "react";
import { S as Me } from "./gridFormatUtils-wCKPmlrt.js";
function Kt(t) {
  return t.items.map(() => new Float64Array(2 * t.n));
}
function gt(t, s, o) {
  for (let e = 0; e < t.items.length; e++) {
    const n = t.items[e], c = o[e], r = t.n, l = Math.exp(n.lnSigma * s), a = n.theta * s, i = Math.cos(a) * l, u = Math.sin(a) * l;
    let f, g;
    if (n.block) {
      const [d, y] = n.block.off, [p, A] = n.block.drift;
      f = n.ca[0] + p * s + (d * i - y * u - d), g = n.ca[1] + A * s + (d * u + y * i - y);
    } else
      f = n.ca[0] + (n.cb[0] - n.ca[0]) * s, g = n.ca[1] + (n.cb[1] - n.ca[1]) * s;
    const b = n.half === void 0 ? s : Math.min(1, Math.max(0, 2 * s - n.half));
    for (let d = 0; d < r; d++) {
      const y = n.aC[2 * d] + (n.bT[2 * d] - n.aC[2 * d]) * b, p = n.aC[2 * d + 1] + (n.bT[2 * d + 1] - n.aC[2 * d + 1]) * b;
      c[2 * d] = f + y * i - p * u, c[2 * d + 1] = g + y * u + p * i;
    }
  }
}
var ye = class {
  constructor() {
    et(this, "x", 1);
    et(this, "v", 0);
    et(this, "k", 250);
    et(this, "c", 24);
  }
  config(t, s) {
    this.k = t, this.c = s;
  }
  /** Starts (or restarts mid-flight) preserving velocity. */
  start() {
    this.x = 0, this.v > 14 && (this.v = 14), this.v < -14 && (this.v = -14);
  }
  /** Advances dt seconds. Returns true on settle (|1−x| < 0.001 ∧ |v| < 0.02). */
  step(t) {
    const s = Math.max(1, Math.min(16, Math.ceil(t / 0.004166666666666667))), o = t / s;
    for (let e = 0; e < s; e++) {
      const n = this.k * (1 - this.x) - this.c * this.v;
      this.v += n * o, this.x += this.v * o;
    }
    return Math.abs(1 - this.x) < 1e-3 && Math.abs(this.v) < 0.02;
  }
};
const Lt = {
  /** ζ = 1.00 — critically damped, no overshoot. */
  smooth: {
    k: 170,
    c: 26
  },
  /** ζ = 0.73 — fast, subtle overshoot. */
  snappy: {
    k: 420,
    c: 30
  },
  /** ζ = 0.40 — playful. */
  bouncy: {
    k: 300,
    c: 14
  }
}, ke = "MmLlHhVvCcSsQqTtAaZz";
function jt(t) {
  const s = [], o = t.length;
  let e = 0, n = 0, c = 0, r = 0, l = 0, a = null, i = "", u = 0, f = 0, g = "", b = !1;
  const d = (k) => {
    throw new Error(`morphicons: ${k} at d[${e}]`);
  }, y = (k) => k >= 48 && k <= 57, p = () => {
    for (; e < o; ) {
      const k = t.charCodeAt(e);
      if (k === 32 || k === 9 || k === 10 || k === 13 || k === 12 || k === 44) e++;
      else break;
    }
  }, A = () => {
    p();
    const k = e;
    e < o && (t[e] === "+" || t[e] === "-") && e++;
    let x = !1;
    for (; e < o && y(t.charCodeAt(e)); )
      e++, x = !0;
    if (e < o && t[e] === ".")
      for (e++; e < o && y(t.charCodeAt(e)); )
        e++, x = !0;
    if (x || d("expected number"), e < o && (t[e] === "e" || t[e] === "E")) {
      const I = e;
      e++, e < o && (t[e] === "+" || t[e] === "-") && e++;
      let P = !1;
      for (; e < o && y(t.charCodeAt(e)); )
        e++, P = !0;
      P || (e = I);
    }
    return Number(t.slice(k, e));
  }, v = () => {
    p();
    const k = t[e];
    return k === "0" || k === "1" ? (e++, k === "1" ? 1 : 0) : d("expected arc flag (0|1)");
  }, h = () => (b || d("path must start with M/m"), a || (a = {
    x0: n,
    y0: c,
    segs: [],
    closed: !1
  }, s.push(a)), a);
  let m = !1;
  const w = () => A() + (m ? n : 0), S = () => A() + (m ? c : 0);
  for (; p(), !(e >= o); ) {
    const k = t[e];
    switch (ke.includes(k) ? (i = k, e++) : i === "" ? d("path must start with M/m") : i === "M" ? i = "L" : i === "m" ? i = "l" : (i === "Z" || i === "z") && d("stray data after Z"), m = i >= "a", m ? i.toUpperCase() : i) {
      case "M": {
        b = !0;
        const x = w(), I = S();
        n = x, c = I, r = x, l = I, a = {
          x0: x,
          y0: I,
          segs: [],
          closed: !1
        }, s.push(a), g = "";
        break;
      }
      case "L": {
        const x = w(), I = S();
        h().segs.push([
          "L",
          x,
          I
        ]), n = x, c = I, g = "";
        break;
      }
      case "H": {
        const x = w();
        h().segs.push([
          "L",
          x,
          c
        ]), n = x, g = "";
        break;
      }
      case "V": {
        const x = S();
        h().segs.push([
          "L",
          n,
          x
        ]), c = x, g = "";
        break;
      }
      case "C":
      case "S": {
        let x, I;
        i === "C" || i === "c" ? (x = w(), I = S()) : (x = g === "C" ? 2 * n - u : n, I = g === "C" ? 2 * c - f : c);
        const P = w(), R = S(), L = w(), E = S();
        h().segs.push([
          "C",
          x,
          I,
          P,
          R,
          L,
          E
        ]), u = P, f = R, n = L, c = E, g = "C";
        break;
      }
      case "Q":
      case "T": {
        let x, I;
        i === "Q" || i === "q" ? (x = w(), I = S()) : (x = g === "Q" ? 2 * n - u : n, I = g === "Q" ? 2 * c - f : c);
        const P = w(), R = S();
        h().segs.push([
          "Q",
          x,
          I,
          P,
          R
        ]), u = x, f = I, n = P, c = R, g = "Q";
        break;
      }
      case "A": {
        const x = A(), I = A(), P = A(), R = v(), L = v(), E = w(), O = S();
        h().segs.push([
          "A",
          x,
          I,
          P,
          R,
          L,
          E,
          O
        ]), n = E, c = O, g = "";
        break;
      }
      case "Z":
        a && (a.closed = !0, a = null), n = r, c = l, g = "";
        break;
      default:
        d(`unsupported command "${i}"`);
    }
  }
  return s.filter((k) => k.segs.length > 0);
}
function ct(t) {
  return String(Math.round(t * 100) / 100);
}
function pt(t, s) {
  let o = "";
  for (let e = 0; e < t.length; e++) {
    const n = t[e], c = n.length / 2;
    o += `M${ct(n[0])} ${ct(n[1])}`;
    for (let r = 1; r < c; r++) o += `L${ct(n[2 * r])} ${ct(n[2 * r + 1])}`;
    s?.[e] && (o += "Z");
  }
  return o;
}
function H(t) {
  return String(Math.round(t * 1e4) / 1e4);
}
function we(t) {
  let s = "";
  for (const { pts: o, closed: e } of t) {
    s += `M${H(o[0])} ${H(o[1])}`;
    for (let n = 2; n < o.length; n += 6) s += `C${H(o[n])} ${H(o[n + 1])} ${H(o[n + 2])} ${H(o[n + 3])} ${H(o[n + 4])} ${H(o[n + 5])}`;
    e && (s += "Z");
  }
  return s;
}
const it = 4 / 3 * Math.tan(Math.PI / 8), Ot = 2 * Math.PI;
function rt(t, s) {
  const o = [t, s];
  let e = t, n = s;
  const c = (u, f, g, b, d, y) => {
    o.push(u, f, g, b, d, y), e = d, n = y;
  }, r = (u, f) => {
    Math.abs(u - e) < 1e-12 && Math.abs(f - n) < 1e-12 || c(e + (u - e) / 3, n + (f - n) / 3, e + 2 * (u - e) / 3, n + 2 * (f - n) / 3, u, f);
  };
  return [
    c,
    r,
    (u, f, g, b) => {
      c(e + 2 / 3 * (u - e), n + 2 / 3 * (f - n), g + 2 / 3 * (u - g), b + 2 / 3 * (f - b), g, b);
    },
    (u, f, g, b, d, y, p) => {
      const A = e, v = n;
      if (Math.abs(y - A) < 1e-12 && Math.abs(p - v) < 1e-12) return;
      let h = Math.abs(u), m = Math.abs(f);
      if (h < 1e-12 || m < 1e-12) {
        r(y, p);
        return;
      }
      const w = g * Math.PI / 180, S = Math.cos(w), k = Math.sin(w), x = (A - y) / 2, I = (v - p) / 2, P = S * x + k * I, R = -k * x + S * I, L = P * P / (h * h) + R * R / (m * m);
      if (L > 1) {
        const $ = Math.sqrt(L);
        h *= $, m *= $;
      }
      const E = h * h, O = m * m, Z = P * P, N = R * R;
      let F = (E * O - E * N - O * Z) / (E * N + O * Z);
      F < 0 && (F = 0);
      const D = (b === d ? -1 : 1) * Math.sqrt(F), U = D * h * R / m, V = -D * m * P / h, M = S * U - k * V + (A + y) / 2, T = k * U + S * V + (v + p) / 2, C = Math.atan2((R - V) / m, (P - U) / h);
      let j = Math.atan2((-R - V) / m, (-P - U) / h) - C;
      d === 0 && j > 0 ? j -= Ot : d === 1 && j < 0 && (j += Ot);
      const q = Math.max(1, Math.ceil(Math.abs(j) / (Math.PI / 2) - 1e-9)), z = j / q, B = 4 / 3 * Math.tan(z / 4), ae = ($) => M + h * Math.cos($) * S - m * Math.sin($) * k, ue = ($) => T + h * Math.cos($) * k + m * Math.sin($) * S, Pt = ($) => -h * Math.sin($) * S - m * Math.cos($) * k, Ct = ($) => -h * Math.sin($) * k + m * Math.cos($) * S;
      let ft = C, Et = A, Rt = v;
      for (let $ = 1; $ <= q; $++) {
        const tt = C + z * $, ht = $ === q ? y : ae(tt), mt = $ === q ? p : ue(tt);
        c(Et + B * Pt(ft), Rt + B * Ct(ft), ht - B * Pt(tt), mt - B * Ct(tt), ht, mt), ft = tt, Et = ht, Rt = mt;
      }
    },
    (u) => (u && r(o[0], o[1]), o.length < 8 ? null : {
      pts: Float64Array.from(o),
      closed: u
    })
  ];
}
function $t(t) {
  const [s, o, e, n, c] = rt(t.x0, t.y0);
  for (const r of t.segs) switch (r[0]) {
    case "L":
      o(r[1], r[2]);
      break;
    case "C":
      s(r[1], r[2], r[3], r[4], r[5], r[6]);
      break;
    case "Q":
      e(r[1], r[2], r[3], r[4]);
      break;
    case "A":
      n(r[1], r[2], r[3], r[4], r[5], r[6], r[7]);
  }
  return c(t.closed);
}
function W(t, s, o = 0) {
  const e = t[s];
  if (e === void 0) return o;
  const n = typeof e == "number" ? e : Number(e);
  return Number.isFinite(n) ? n : o;
}
function Wt(t) {
  const s = String(t ?? "").trim();
  if (!s) return [];
  const o = s.split(/[\s,]+/).map(Number);
  if (o.some((e) => !Number.isFinite(e))) throw new Error(`morphicons: invalid points: "${s}"`);
  return o;
}
function bt(t, s) {
  if (t.length < 4) return null;
  const [, o, , , e] = rt(t[0], t[1]);
  for (let n = 2; n + 1 < t.length; n += 2) o(t[n], t[n + 1]);
  return e(s);
}
function qt(t, s, o, e) {
  if (o < 1e-12 || e < 1e-12) return null;
  const n = it * o, c = it * e, r = t + o, l = t - o, a = s + e, i = s - e, [u, , , , f] = rt(r, s);
  return u(r, s + c, t + n, a, t, a), u(t - n, a, l, s + c, l, s), u(l, s - c, t - n, i, t, i), u(t + n, i, r, s - c, r, s), f(!0);
}
function xe(t) {
  const s = W(t, "x"), o = W(t, "y"), e = W(t, "width"), n = W(t, "height");
  if (e < 1e-12 || n < 1e-12) return null;
  let c = W(t, "rx", NaN), r = W(t, "ry", NaN);
  if (Number.isNaN(c) && (c = Number.isNaN(r) ? 0 : r), Number.isNaN(r) && (r = c), c = Math.min(Math.max(c, 0), e / 2), r = Math.min(Math.max(r, 0), n / 2), c < 1e-12 || r < 1e-12) return bt([
    s,
    o,
    s + e,
    o,
    s + e,
    o + n,
    s,
    o + n
  ], !0);
  const l = s + c, a = s + e - c, i = s + e, u = o + r, f = o + n - r, g = o + n, b = it * c, d = it * r, [y, p, , , A] = rt(l, o);
  return p(a, o), y(a + b, o, i, u - d, i, u), p(i, f), y(i, f + d, a + b, g, a, g), p(l, g), y(l - b, g, s, f + d, s, f), p(s, u), y(s, u - d, l - b, o, l, o), A(!0);
}
function at(t) {
  const s = [], o = (e) => {
    e && s.push(e);
  };
  if (typeof t == "string") {
    for (const e of jt(t)) o($t(e));
    return s;
  }
  for (const [e, n] of t) switch (e) {
    case "path":
      for (const c of jt(String(n.d ?? ""))) o($t(c));
      break;
    case "line": {
      const [, c, , , r] = rt(W(n, "x1"), W(n, "y1"));
      c(W(n, "x2"), W(n, "y2")), o(r(!1));
      break;
    }
    case "circle": {
      const c = W(n, "r");
      o(qt(W(n, "cx"), W(n, "cy"), c, c));
      break;
    }
    case "ellipse":
      o(qt(W(n, "cx"), W(n, "cy"), W(n, "rx"), W(n, "ry")));
      break;
    case "rect":
      o(xe(n));
      break;
    case "polyline":
      o(bt(Wt(n.points), !1));
      break;
    case "polygon":
      o(bt(Wt(n.points), !0));
      break;
    default:
      throw new Error(`morphicons: unsupported tag <${e}>`);
  }
  return s;
}
const ve = 0.35, Ae = 0.05, Se = 5e-3, Ie = 8;
function K(t) {
  const s = t.length / 2;
  let o = 0, e = 0;
  for (let n = 0; n < s; n++)
    o += t[2 * n], e += t[2 * n + 1];
  return [o / s, e / s];
}
function Dt(t) {
  const s = t.length / 2;
  let o = 0;
  for (let e = 1; e < s; e++) o += Math.hypot(t[2 * e] - t[2 * e - 2], t[2 * e + 1] - t[2 * e - 1]);
  return o;
}
function Jt(t) {
  const s = t.length / 2, o = new Float64Array(2 * s);
  for (let e = 0; e < s; e++)
    o[2 * e] = t[2 * (s - 1 - e)], o[2 * e + 1] = t[2 * (s - 1 - e) + 1];
  return o;
}
function Ne(t, s) {
  const o = t.length / 2, e = new Float64Array(2 * o);
  for (let n = 0; n < o; n++) {
    const c = (n + s) % o;
    e[2 * n] = t[2 * c], e[2 * n + 1] = t[2 * c + 1];
  }
  return e;
}
function Mt(t, s, o, e) {
  const n = t.length / 2;
  let c = 0, r = 0, l = 0, a = 0, i = 0, u = 0;
  for (let p = 0; p < n; p++) {
    const A = t[2 * p] - o[0], v = t[2 * p + 1] - o[1], h = s[2 * p] - e[0], m = s[2 * p + 1] - e[1];
    c += A * h, a += v * m, r += A * m, l += v * h, i += A * A + v * v, u += h * h + m * m;
  }
  const f = Math.atan2(r - l, c + a), g = Math.cos(f) * (c + a) + Math.sin(f) * (r - l);
  let b = i > 1e-12 ? g / i : 1;
  b > 1e-6 || (b = 1e-6);
  const d = Math.max(0, b * b * i - 2 * b * g + u), y = u > 1e-12 ? Math.sqrt(d / u) : 0;
  return {
    theta: f,
    sigma: b,
    res: y
  };
}
function Te(t, s, o = !1, e = !1, n = !0, c = Ae) {
  const r = K(t), l = K(s), a = o && !e, i = a ? t : s, u = o || e ? i.length / 2 : 1;
  let f = Number.POSITIVE_INFINITY, g = i, b = {
    theta: 0,
    sigma: 1,
    res: 0
  };
  for (let d = 0; d < (n ? 2 : 1); d++) {
    const y = d ? Jt(i) : i;
    for (let p = 0; p < u; p++) {
      const A = p ? Ne(y, p) : y, v = a ? Mt(A, s, r, l) : Mt(t, A, r, l), h = v.res + c * Math.abs(v.theta) / Math.PI;
      h < f && (f = h, g = A, b = v);
    }
  }
  return a ? {
    ca: r,
    cb: l,
    a: g,
    b: s,
    ...b
  } : {
    ca: r,
    cb: l,
    a: t,
    b: g,
    ...b
  };
}
function dt(t, s) {
  const o = s.map(K), e = s.map(Dt);
  return t.map((n) => {
    const c = K(n), r = Dt(n);
    return o.map((l, a) => Math.hypot(c[0] - l[0], c[1] - l[1]) + ve * Math.abs(r - e[a]));
  });
}
function Pe(t) {
  const s = t.length;
  if (s > Ie) {
    const r = [];
    for (let i = 0; i < s; i++) for (let u = 0; u < s; u++) r.push([
      t[i][u],
      i,
      u
    ]);
    r.sort((i, u) => i[0] - u[0]);
    const l = new Array(s).fill(-1), a = new Array(s).fill(!1);
    for (const [, i, u] of r) l[i] < 0 && !a[u] && (l[i] = u, a[u] = !0);
    return l;
  }
  const o = Array.from({ length: s }, (r, l) => l);
  let e = o.slice(), n = Number.POSITIVE_INFINITY;
  const c = (r, l, a) => {
    if (!(a >= n)) {
      if (l === s) {
        n = a, e = r.slice();
        return;
      }
      for (let i = l; i < s; i++)
        [r[l], r[i]] = [r[i], r[l]], c(r, l + 1, a + t[l][r[l]]), [r[l], r[i]] = [r[i], r[l]];
    }
  };
  return c(o, 0, 0), e;
}
function _t(t) {
  const s = t.length, o = t[0].length;
  if (o ** s > 1e5) {
    const a = t.map((u) => {
      let f = 0;
      for (let g = 1; g < u.length; g++) u[g] < u[f] && (f = g);
      return f;
    }), i = new Array(o).fill(0);
    for (const u of a) i[u]++;
    for (let u = 0; u < o; u++) {
      if (i[u] > 0) continue;
      let f = -1, g = Number.POSITIVE_INFINITY;
      for (let b = 0; b < s; b++) {
        if (i[a[b]] < 2) continue;
        const d = t[b][u] - t[b][a[b]];
        d < g && (g = d, f = b);
      }
      i[a[f]]--, a[f] = u, i[u]++;
    }
    return a;
  }
  let e = null, n = Number.POSITIVE_INFINITY;
  const c = new Array(s), r = new Array(o).fill(0), l = (a, i, u) => {
    if (!(i >= n || o - u > s - a)) {
      if (a === s) {
        n = i, e = c.slice();
        return;
      }
      for (let f = 0; f < o; f++)
        c[a] = f, r[f]++, l(a + 1, i + t[a][f], u + (r[f] === 1 ? 1 : 0)), r[f]--;
    }
  };
  if (l(0, 0, 0), !e) throw new Error("morphicons: no valid surjection (B < S)");
  return e;
}
function Ce(t, s) {
  const o = t.length * s, e = new Float64Array(2 * o), n = new Float64Array(2 * o);
  t.forEach((f, g) => {
    e.set(f.a, 2 * s * g), n.set(f.bO, 2 * s * g);
  });
  const c = K(e), r = Mt(e, n, c, K(n));
  if (r.res >= Se) return;
  const l = Math.cos(-r.theta), a = Math.sin(-r.theta), i = Math.cos(r.theta), u = Math.sin(r.theta);
  for (const f of t) {
    let g = 0, b = 0;
    for (let w = 0; w < s; w++) {
      const S = f.bO[2 * w] - f.cb[0], k = f.bO[2 * w + 1] - f.cb[1];
      f.bT[2 * w] = (S * l - k * a) / r.sigma, f.bT[2 * w + 1] = (S * a + k * l) / r.sigma;
      const x = r.sigma * (i * f.aC[2 * w] - u * f.aC[2 * w + 1]) - S, I = r.sigma * (u * f.aC[2 * w] + i * f.aC[2 * w + 1]) - k;
      g += x * x + I * I, b += S * S + k * k;
    }
    f.theta = r.theta, f.lnSigma = Math.log(r.sigma), f.res = b > 1e-12 ? Math.sqrt(g / b) : 0;
    const d = Math.exp(f.lnSigma), y = Math.cos(f.theta) * d, p = Math.sin(f.theta) * d, A = f.ca[0] - c[0], v = f.ca[1] - c[1], h = A * y - v * p - A, m = A * p + v * y - v;
    f.block = {
      off: [A, v],
      drift: [f.cb[0] - f.ca[0] - h, f.cb[1] - f.ca[1] - m]
    };
  }
}
function Ee(t, s) {
  const o = t.length, e = s.length, n = [];
  if (o === e) {
    const c = Pe(dt(t, s));
    for (let r = 0; r < o; r++) n.push([r, c[r]]);
  } else if (o < e) {
    const c = _t(dt(s, t));
    for (let r = 0; r < e; r++) n.push([c[r], r]);
  } else {
    const c = _t(dt(t, s));
    for (let r = 0; r < o; r++) n.push([r, c[r]]);
  }
  return n;
}
function Re(t, s, o, e, n, c) {
  const r = t.length / 2, l = Te(t, s, o, e, n, c), a = l.a, i = new Float64Array(2 * r), u = new Float64Array(2 * r), f = new Float64Array(2 * r), g = Math.cos(-l.theta), b = Math.sin(-l.theta);
  for (let d = 0; d < r; d++) {
    i[2 * d] = a[2 * d] - l.ca[0], i[2 * d + 1] = a[2 * d + 1] - l.ca[1];
    const y = l.b[2 * d] - l.cb[0], p = l.b[2 * d + 1] - l.cb[1];
    u[2 * d] = (y * g - p * b) / l.sigma, u[2 * d + 1] = (y * b + p * g) / l.sigma, f[2 * d] = l.b[2 * d], f[2 * d + 1] = l.b[2 * d + 1];
  }
  return {
    a,
    aC: i,
    bT: u,
    bO: f,
    ca: l.ca,
    cb: l.cb,
    theta: l.theta,
    lnSigma: Math.log(l.sigma),
    res: l.res,
    closed: o && e,
    block: null
  };
}
function ut(t, s) {
  const o = t.length, e = s.length;
  if (o === 0 || e === 0) throw new Error("morphicons: icon has no subpaths");
  const n = t.map((l) => l.pts), c = s.map((l) => l.pts), r = Ee(n, c).map(([l, a]) => Re(n[l], c[a], t[l].closed, s[a].closed, !0));
  return r.length > 1 && Ce(r, n[0].length / 2), {
    items: r,
    n: n[0].length / 2
  };
}
const te = Math.PI / 8, zt = [
  0.18343464249564978,
  0.525532409916329,
  0.7966664774136267,
  0.9602898564975363
], Fe = [
  0.362683783378362,
  0.31370664587788727,
  0.22238103445337448,
  0.10122853629037626
];
function yt(t, s, o) {
  const e = 6 * s, n = 1 - o, c = 3 * n * n, r = 6 * n * o, l = 3 * o * o, a = c * (t[e + 2] - t[e]) + r * (t[e + 4] - t[e + 2]) + l * (t[e + 6] - t[e + 4]), i = c * (t[e + 3] - t[e + 1]) + r * (t[e + 5] - t[e + 3]) + l * (t[e + 7] - t[e + 5]);
  return Math.hypot(a, i);
}
function It(t, s, o = 1) {
  const e = o / 2;
  let n = 0;
  for (let c = 0; c < 4; c++) n += Fe[c] * (yt(t, s, e + e * zt[c]) + yt(t, s, e - e * zt[c]));
  return n * e;
}
function Le(t, s, o, e, n) {
  const c = 6 * s, r = 1 - o, l = r * r * r, a = 3 * r * r * o, i = 3 * r * o * o, u = o * o * o;
  e[n] = l * t[c] + a * t[c + 2] + i * t[c + 4] + u * t[c + 6], e[n + 1] = l * t[c + 1] + a * t[c + 3] + i * t[c + 5] + u * t[c + 7];
}
function Gt(t, s, o) {
  const e = 6 * s, n = o ? e + 6 : e, c = o ? -1 : 1;
  for (const r of o ? [
    4,
    2,
    0
  ] : [
    2,
    4,
    6
  ]) {
    const l = c * (t[e + r] - t[n]), a = c * (t[e + r + 1] - t[n + 1]);
    if (l * l + a * a > 1e-18) return [l, a];
  }
  return null;
}
function je(t, s = te) {
  const o = t.pts, e = (o.length / 2 - 1) / 3, n = [];
  for (let l = 0; l < e; l++) It(o, l) > 1e-9 && n.push(l);
  if (n.length === 0) return [];
  const c = /* @__PURE__ */ new Set(), r = (l, a) => {
    const i = Gt(o, l, !0), u = Gt(o, a, !1);
    !i || !u || Math.abs(Math.atan2(i[0] * u[1] - i[1] * u[0], i[0] * u[0] + i[1] * u[1])) > s && c.add(a);
  };
  for (let l = 0; l + 1 < n.length; l++) r(n[l], n[l + 1]);
  return t.closed && n.length > 1 && r(n[n.length - 1], n[0]), [...c].sort((l, a) => l - a);
}
function Oe(t, s, o, e) {
  if (o <= 0) return 0;
  if (o >= e) return 1;
  let n = 0, c = 1, r = o / e;
  for (let l = 0; l < 12; l++) {
    const a = It(t, s, r) - o;
    if (Math.abs(a) < 1e-10 * e + 1e-14) break;
    a > 0 ? c = r : n = r;
    const i = yt(t, s, r);
    let u = i > 1e-12 ? r - a / i : (n + c) / 2;
    u > n && u < c || (u = (n + c) / 2), r = u;
  }
  return r;
}
function ee(t, s = 64, o = te) {
  const e = t.pts, n = (e.length / 2 - 1) / 3, c = new Float64Array(2 * s), r = () => {
    for (let h = 0; h < s; h++)
      c[2 * h] = e[0], c[2 * h + 1] = e[1];
    return c;
  };
  if (n < 1) return r();
  const l = new Array(n);
  let a = 0;
  for (let h = 0; h < n; h++)
    l[h] = It(e, h), a += l[h];
  if (a < 1e-12) return r();
  const i = je(t, o), u = t.closed ? i.length > 0 ? i : [0] : [.../* @__PURE__ */ new Set([
    0,
    ...i,
    n
  ])].sort((h, m) => h - m), f = [];
  if (t.closed) for (let h = 0; h < u.length; h++) {
    const m = u[h], w = h + 1 < u.length ? u[h + 1] : u[0] + n;
    f.push([m, w]);
  }
  else for (let h = 0; h + 1 < u.length; h++) f.push([u[h], u[h + 1]]);
  const g = f.map(([h, m]) => {
    let w = 0;
    for (let S = h; S < m; S++) w += l[S % n];
    return w;
  }), b = t.closed ? s : s - 1;
  if (f.length > b) throw new Error(`morphicons: N=${s} too small (${f.length} runs)`);
  const d = g.reduce((h, m) => h + m, 0) || 1, y = g.map((h) => b * h / d), p = y.map((h) => Math.max(1, Math.floor(h)));
  let A = b - p.reduce((h, m) => h + m, 0);
  if (A > 0) {
    const h = y.map((m, w) => [Math.round((m - Math.floor(m)) * 1e9), w]).sort((m, w) => w[0] - m[0] || m[1] - w[1]);
    for (let m = 0; m < A; m++) p[h[m % p.length][1]]++;
  }
  for (; A < 0; ) {
    let h = 0;
    for (let m = 1; m < p.length; m++) p[m] > p[h] && (h = m);
    if (p[h] <= 1) break;
    p[h]--, A++;
  }
  let v = 0;
  for (let h = 0; h < f.length; h++) {
    const [m, w] = f[h], S = p[h], k = g[h], x = 6 * (m % n);
    c[2 * v] = e[x], c[2 * v + 1] = e[x + 1], v++;
    let I = m, P = 0;
    for (let R = 1; R < S; R++) {
      const L = k * R / S;
      for (; I < w - 1 && P + l[I % n] < L; )
        P += l[I % n], I++;
      const E = I % n, O = l[E];
      Le(e, E, O > 1e-12 ? Oe(e, E, L - P, O) : 0, c, 2 * v), v++;
    }
  }
  if (!t.closed) {
    const h = 6 * n;
    c[2 * v] = e[h], c[2 * v + 1] = e[h + 1];
  }
  return c;
}
function kt(t, s = 64) {
  return at(t).map((o) => ({
    pts: ee(o, s),
    closed: o.closed
  }));
}
const on = "data-region", wt = (t) => t !== void 0 && String(t).trim().toLowerCase() !== "none";
function _(t) {
  if (typeof t == "string") return "stroke";
  for (const [, s] of t) if (wt(s.fill)) return "fill";
  return "stroke";
}
const $e = (t) => Number.parseFloat(String(t.opacity)) < 0.5 || Number.parseFloat(String(t["fill-opacity"])) < 0.5;
function ne(t) {
  return typeof t == "string" || _(t) === "stroke" ? t : t.filter(([, s]) => !$e(s));
}
function rn(t) {
  return typeof t != "string" && t.length === 1 && "data-region" in t[0][1];
}
function We(t, s, o) {
  const e = o.length / 2;
  let n = !1;
  for (let c = 0, r = e - 1; c < e; r = c++) {
    const l = o[2 * c + 1], a = o[2 * r + 1];
    l > s != a > s && t < (o[2 * r] - o[2 * c]) * (s - l) / (a - l) + o[2 * c] && (n = !n);
  }
  return n;
}
function cn(t, s, o, e, n, c) {
  const r = n - o, l = c - e, a = r * r + l * l;
  let i = a > 0 ? ((t - o) * r + (s - e) * l) / a : 0;
  i = i < 0 ? 0 : i > 1 ? 1 : i;
  const u = t - o - i * r, f = s - e - i * l;
  return Math.sqrt(u * u + f * f);
}
function xt(t) {
  const s = t.length / 2;
  let o = 0;
  for (let e = 0, n = s - 1; e < s; n = e++) o += t[2 * n] * t[2 * e + 1] - t[2 * e] * t[2 * n + 1];
  return o / 2;
}
const ot = /* @__PURE__ */ new Set();
let X = 0, J = -1;
function se(t) {
  const s = J < 0 ? 0 : Math.min(Math.max((t - J) / 1e3, 0), 0.1);
  J = t;
  for (const o of [...ot]) o(s);
  ot.size > 0 ? X = requestAnimationFrame(se) : (X = 0, J = -1);
}
function qe(t) {
  ot.add(t), X === 0 && (J = -1, X = requestAnimationFrame(se));
}
function De(t) {
  ot.delete(t), ot.size === 0 && X !== 0 && (cancelAnimationFrame(X), X = 0, J = -1);
}
const Qt = /* @__PURE__ */ new WeakMap(), Ut = /* @__PURE__ */ new WeakMap(), Vt = /* @__PURE__ */ new WeakMap();
function oe(t) {
  return typeof t == "string" || _(t) === "stroke" ? at(t) : ne(t).flatMap((s) => {
    const o = at([s]), e = String(s[1]["fill-rule"]).trim() === "evenodd";
    let n = 0;
    for (const c of o) n += xt(c.pts);
    for (const c of o) {
      let r = n < 0;
      if (e) {
        let l = !0;
        for (const a of o) a !== c && We(c.pts[0], c.pts[1], a.pts) && (l = !l);
        r = xt(c.pts) > 0 !== l;
      }
      r && (c.pts = Jt(c.pts));
    }
    return o;
  });
}
function Y(t) {
  if (typeof t == "string") return kt(t);
  let s = Qt.get(t);
  return s || (s = oe(t).map((o) => ({
    pts: ee(o, 64),
    closed: o.closed
  })), Qt.set(t, s)), s;
}
function Nt(t) {
  if (typeof t == "string") return t;
  let s = Ut.get(t);
  return s || (s = we(oe(t)), Ut.set(t, s)), s;
}
function _e(t, s) {
  if (typeof t == "string" || typeof s == "string") return ut(Y(t), Y(s));
  let o = Vt.get(t);
  o || (o = /* @__PURE__ */ new WeakMap(), Vt.set(t, o));
  let e = o.get(s);
  return e || (e = ut(Y(t), Y(s)), o.set(s, e)), e;
}
let Q = null, st = null, vt = 0, Tt = !1, Ht, re = () => import("./region-DgNHtPyu.js");
const ze = (t) => new Promise((s, o) => {
  const e = document.createElement("script");
  e.type = "module", e.onload = e.onerror = () => {
    e.remove();
    const n = globalThis[Symbol.for("morphicons.region")];
    n ? s(n) : o(new Error(t));
  }, e.src = `${t}#${Date.now()}`, document.head.append(e);
}), Ge = () => {
  const t = /import\(\s*["'`]([^"'`]+)/.exec(String(re))?.[1], s = /\w+:\/\/[^\s)]+?(?=:\d+:\d+)/.exec(String((/* @__PURE__ */ new Error()).stack))?.[0];
  try {
    return t && new URL(t, s).href;
  } catch {
  }
};
function At() {
  if (Q) return Promise.resolve(Q);
  if (!st) {
    vt = Date.now();
    const t = Ht;
    st = re().catch((s) => t ? ze(t) : Promise.reject(s)).then((s) => (Q = s, s), (s) => {
      throw st = null, Tt = !0, Ht ?? (Ht = /dynamically imported module:?\s*(\S+)/i.exec(String(s?.message))?.[1] ?? Ge()), s;
    });
  }
  return st;
}
const Qe = () => new Promise((t, s) => {
  if (!(typeof navigator > "u") && navigator.connection?.saveData) return;
  const o = () => {
    Tt ? s() : At().then(t, s);
  };
  typeof requestIdleCallback == "function" ? requestIdleCallback(o, { timeout: 2e3 }) : setTimeout(o, 200);
}), Zt = 100, ce = (t) => t === "stroke" ? {
  fill: "none",
  stroke: "inherit"
} : {
  fill: "currentColor",
  stroke: t === "fill" ? "none" : "inherit",
  "fill-rule": "nonzero"
}, Bt = /* @__PURE__ */ new WeakMap();
function St(t) {
  if (typeof t == "string" || _(t) === "stroke") return "stroke";
  let s = Bt.get(t);
  if (s) return s;
  let o = 0, e = -1;
  s = "fill";
  for (const n of ne(t)) {
    const c = wt(n[1].stroke), r = wt(n[1].fill) || n[1].fill === void 0 && !c;
    c && (s = "both");
    let l = 0;
    for (const a of at([n])) l += Math.abs(xt(a.pts));
    r ? o += l : c && (e = Math.max(e, 0) + l);
  }
  return e > 1.5 * o && (s = "stroke"), Bt.set(t, s), s;
}
function Ue(t) {
  if (!(t === void 0 || _(t) === "stroke"))
    return ce(St(t));
}
function Ve(t, s) {
  const e = ({ pts: n, closed: c }, r) => {
    n.length > 128 && (n = n.filter((u, f) => f % 4 < 2));
    const l = K(n), a = n.map((u, f) => u - l[f & 1]), i = /* @__PURE__ */ new Float64Array(128);
    return {
      aC: r ? i : a,
      bT: r ? a : i,
      ca: l,
      cb: l,
      theta: 0,
      lnSigma: 0,
      closed: c,
      half: r,
      block: null
    };
  };
  return {
    n: 64,
    items: [...t.map((n) => e(n, 0)), ...s.map((n) => e(n, 1))]
  };
}
function He(t) {
  if (typeof t == "string") return Lt[t];
  const s = Lt.snappy;
  return {
    k: t?.stiffness ?? s.k,
    c: t?.damping ?? s.c
  };
}
function Yt(t, s, o) {
  const e = new ye();
  let n = o?.reducedMotion ?? "never", c = o?.strokeWidth ?? 2, r = s, l = !0, a = null, i = null, u = null, f = 1, g = !1, b = !1, d = !1, y = !1, p = null, A = "stroke", v = 0, h = "stroke", m = null;
  const w = (M) => {
    if (M !== A) {
      for (const [T, C] of Object.entries(ce(M))) t.setAttribute(T, C);
      A = M;
    }
  }, S = (M) => {
    const T = Q && _(M) === "fill" ? Q.regionOf(M, c) : M;
    t.setAttribute("d", Nt(T)), w(St(T));
  }, k = (M) => {
    const T = r;
    M.then(() => {
      !b && l && r === T && p === null && S(T);
    }, () => {
    });
  };
  S(s), _(s) === "fill" && !Q && k(Qe());
  const x = (M) => v ? M < 0.5 ? [0, v] : [v, a?.items.length ?? 0] : [0, a?.items.length ?? 0], I = (M) => {
    const T = a, C = i, j = u;
    if (!T || !C || !j) return;
    f = M, gt(T, M, C), y = !0;
    const [q, z] = x(M);
    v && w(M < 0.5 ? h : St(r)), t.setAttribute("d", pt(C.slice(q, z), j.slice(q, z)));
  }, P = () => {
    g && (g = !1, De(R));
  }, R = (M) => {
    const T = e.step(M);
    I(e.x), T && (P(), L());
  }, L = () => {
    l = !0, a = null, i = null, u = null, f = 1, e.x = 1, e.v = 0, d = !1, v = 0, S(r), _(r) === "fill" && !Q && (st || !Tt) && k(At());
  }, E = () => {
    const M = a, T = i;
    if (l || !M || !T) return Y(r);
    const [C, j] = x(f);
    return T.slice(C, j).map((q, z) => ({
      pts: Float64Array.from(q),
      closed: M.items[C + z].closed,
      hole: M.items[C + z].hole
    }));
  }, O = (M) => !l && d || _(M) === "fill" || _(r) === "fill", Z = (M, T) => {
    if (!l && a && i && !y && (f = 0, gt(a, 0, i)), T || !l && v) {
      const C = E();
      m = l ? r : null, h = A, a = Ve(C, Y(M)), v = C.length, d = !1;
    } else if (O(M)) {
      const C = Q;
      a = l || !i ? C.regionPlan(r, M, c) : C.regionPlanFrom(d ? E() : pt(i, u ?? void 0), M, c), d = !0, v = 0, w("fill");
    } else
      a = l ? _e(r, M) : ut(E(), Y(M)), d = !1;
    i = Kt(a), y = !1, u = a.items.map((C) => C.closed), r = M, l = !1;
  }, N = (M, T, C) => {
    if (Q || !l && v || !O(M)) return !1;
    const j = {};
    p = j;
    const q = () => {
      b || p !== j || (p = null, C());
    }, z = At();
    if (Date.now() - vt > Zt)
      return q(), !0;
    const B = setTimeout(q, Zt - (Date.now() - vt));
    return z.then(() => {
      clearTimeout(B), !(b || p !== j) && (p = null, T());
    }, () => {
      clearTimeout(B), q();
    }), !0;
  }, F = (M) => {
    P(), p = null, r = M, L();
  }, D = () => n === "always" ? !0 : n !== "user" || typeof matchMedia > "u" ? !1 : matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? !1, U = (M, T, C = !1) => {
    if (b || !C && N(M, () => U(M, T), () => U(M, T, !0))) return;
    p = null;
    let j = !l && a !== null && M === r;
    j && v && Q && m !== null && (r = m, l = !0, j = !1), P(), e.v = 0, j || Z(M, C), I(T);
  }, V = (M, T, C) => {
    if (b) return;
    if (M === r && (l || g)) {
      p = null;
      return;
    }
    if (D()) {
      F(M);
      return;
    }
    if (!C && N(M, () => V(M, T, !1), () => V(M, T, !0))) return;
    p = null;
    const { k: j, c: q } = He(T);
    e.config(j, q), Z(M, C), e.start(), g || (g = !0, qe(R));
  };
  return {
    morphTo: (M, T) => V(M, T, !1),
    set(M) {
      b || F(M);
    },
    seek: U,
    get progress() {
      return l ? 1 : f;
    },
    set progress(M) {
      b || U(r, M);
    },
    get reducedMotion() {
      return n;
    },
    set reducedMotion(M) {
      n = M;
    },
    get strokeWidth() {
      return c;
    },
    set strokeWidth(M) {
      c = M;
    },
    destroy() {
      P(), b = !0, p = null, a = null, i = null, u = null;
    }
  };
}
function le(t, s, o) {
  return o >= 1 ? s : o <= 0 || _(t) === "fill" || _(s) === "fill" ? t : null;
}
const Ze = typeof document > "u" ? nt : be;
function Be(t, s, o) {
  const e = le(t, s, o);
  if (e !== null) return Nt(e);
  const n = ut(kt(t), kt(s)), c = Kt(n);
  return gt(n, o, c), pt(c, n.items.map((r) => r.closed));
}
const ie = de(function(s, o) {
  const { icon: e, from: n, to: c, progress: r, spring: l, reducedMotion: a, size: i = 24, color: u = "currentColor", strokeWidth: f = 2, absoluteStrokeWidth: g, label: b, ...d } = s, y = n !== void 0 && c !== void 0, p = e ?? n ?? c, [A] = Ft(() => y ? Be(n, c, r ?? 0) : p !== void 0 ? Nt(p) : ""), [v] = Ft(() => {
    const N = Ue(y ? le(n, c, r ?? 0) ?? ((r ?? 0) < 0.5 ? n : c) : p);
    return N && {
      fill: N.fill,
      stroke: N.stroke,
      fillRule: N["fill-rule"]
    };
  }), h = G(null), m = G(null), w = G(l);
  w.current = l;
  const S = G(a);
  S.current = a;
  const k = Number(g ? Number(f) * 24 / Number(i) : f), x = G(k);
  x.current = k;
  const I = G(e), P = G(y), R = G(!1), L = G(!1), E = G(null), O = ge((N) => {
    if (m.current) return m.current;
    const F = h.current;
    return R.current || !F ? null : (m.current = Yt(F, N, {
      reducedMotion: S.current,
      strokeWidth: x.current
    }), m.current);
  }, []);
  Ze(() => {
    R.current = !1;
    const N = h.current;
    if (N && p !== void 0) {
      const F = Yt(N, y ? n : p, {
        reducedMotion: S.current,
        strokeWidth: x.current
      });
      if (m.current = F, y) {
        E.current = [n, c];
        const D = r ?? 0;
        D <= 0 ? F.set(n) : D >= 1 ? F.set(c) : (F.seek(c, D), L.current = !0);
      }
    }
    return () => {
      R.current = !0, m.current?.destroy(), m.current = null, L.current = !1, E.current = null;
    };
  }, []), nt(() => {
    const N = m.current;
    N && (N.reducedMotion = a ?? "never");
  }, [a]), nt(() => {
    const N = m.current;
    N && (N.strokeWidth = k);
  }, [k]), nt(() => {
    const N = P.current && !y;
    P.current = y;
    const F = e !== I.current;
    if (I.current = e, y || e === void 0 || !F && !N) return;
    E.current = null, L.current = !1;
    const D = m.current;
    D ? D.morphTo(e, w.current) : O(e);
  }, [
    e,
    y,
    O
  ]), nt(() => {
    if (!y) return;
    const N = m.current ?? O(n);
    if (!N) return;
    const F = r ?? 0;
    (!E.current || E.current[0] !== n || E.current[1] !== c) && (E.current = [n, c], L.current = !1), F <= 0 ? (N.set(n), L.current = !1) : F >= 1 ? (N.set(c), L.current = !1) : (L.current || (N.set(n), L.current = !0), N.seek(c, F));
  }, [
    y,
    n,
    c,
    r,
    O
  ]), pe(o, () => ({
    morphTo: (N, F) => {
      E.current = null, L.current = !1;
      const D = m.current;
      D ? D.morphTo(N, F ?? w.current) : O(N);
    },
    set: (N) => {
      E.current = null, L.current = !1;
      const F = m.current;
      F ? F.set(N) : O(N);
    }
  }), [O]);
  const Z = g ? Number(f) * 24 / Number(i) : f;
  return /* @__PURE__ */ me("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: i,
    height: i,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: u,
    color: u,
    strokeWidth: Z,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    role: b ? "img" : void 0,
    "aria-hidden": b ? void 0 : !0,
    ...d,
    children: [b ? /* @__PURE__ */ lt("title", { children: b }) : null, /* @__PURE__ */ lt("path", {
      ref: h,
      d: A,
      ...v
    })]
  });
});
const Ye = [
  ["path", { d: "M12 5v14" }],
  ["path", { d: "m19 12-7 7-7-7" }]
];
const Xe = [
  ["path", { d: "m5 12 7-7 7 7" }],
  ["path", { d: "M12 19V5" }]
];
const Xt = [["path", { d: "m6 9 6 6 6-6" }]];
const Ke = [["path", { d: "m9 18 6-6-6-6" }]];
const Je = [["path", { d: "m18 15-6-6-6 6" }]], ln = ({
  direction: t,
  size: s = 11,
  className: o = "",
  spring: e = "snappy"
}) => /* @__PURE__ */ lt(
  ie,
  {
    icon: t === Me.ASC ? Xe : Ye,
    size: s,
    spring: e,
    className: o
  }
), an = ({
  expanded: t,
  size: s = 14,
  className: o = "",
  spring: e = "bouncy",
  type: n = "right-down"
}) => /* @__PURE__ */ lt(
  ie,
  {
    icon: n === "down-up" ? t ? Je : Xt : t ? Xt : Ke,
    size: s,
    spring: e,
    className: o
  }
);
export {
  Ke as C,
  an as M,
  on as R,
  Ce as a,
  rn as b,
  dt as c,
  _ as d,
  at as e,
  K as f,
  Mt as g,
  Ne as h,
  We as i,
  ee as j,
  cn as k,
  ie as l,
  Re as m,
  ln as n,
  Ee as p,
  Jt as r,
  xt as s,
  $e as t
};
