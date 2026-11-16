import { jsxs as C, Fragment as At, jsx as g } from "react/jsx-runtime";
import Lt, { useState as tt, useRef as et, useMemo as ft } from "react";
import { D as Pt } from "./gridFormatUtils-wCKPmlrt.js";
import { A as mt } from "./AdvCheckbox-CRVR1r8W.js";
import { A as $t } from "./AdvOverlayScroll-CipuwW1l.js";
import { E as zt, N as Bt, A as Rt } from "./AdvButton-B7j0puyb.js";
import { S as Ht } from "./search-Bmmet712.js";
import { X as Wt } from "./x-CdrDtutQ.js";
import { c as It } from "./createLucideIcon-BCMt_G8a.js";
import { C as _t } from "./chevron-right-CgsC9jVS.js";
import { C as jt } from "./chevron-down-CoESPSbY.js";
const Et = {
  name: "layers",
  size: 24,
  node: [
    [
      "path",
      {
        d: "M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z",
        key: "zw3jo"
      }
    ],
    [
      "path",
      {
        d: "M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12",
        key: "1wduqc"
      }
    ],
    [
      "path",
      {
        d: "M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17",
        key: "kqbvx6"
      }
    ]
  ],
  aliases: ["layers-3"]
};
Et.node;
const Ot = It(Et);
const Nt = {
  name: "rotate-ccw",
  size: 24,
  node: [
    ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
    ["path", { d: "M3 3v5h5", key: "1xhq8a" }]
  ]
};
Nt.node;
const Ut = It(Nt), ie = Lt.memo(function({
  columns: ht,
  columnGroups: vt = [],
  visibleColKeys: M,
  onVisibleColKeysChange: _,
  columnPins: qt,
  onColumnPinChange: Gt,
  onResetColumns: St,
  onAutoFitColumn: Ft,
  onReorderColumns: H,
  enableColumnHide: Tt = !0,
  onClose: Jt,
  style: pt,
  embedded: j = !1
}) {
  const P = !!H, J = Tt !== !1, [ot, at] = tt(""), [Ct, xt] = tt({}), [yt, bt] = tt(240), it = et(!1), [Q, ct] = tt(null), O = et(null), nt = et(!1), [S, U] = tt(null), T = et(null), $ = et(!1), y = ot.trim().toLowerCase(), z = ft(() => ht.filter(
    (t) => t.dataType !== Pt.SYSTEM && !t.isRowNumber && !t.isSelection
  ), [ht]), { orderedRawColumns: lt, hasBands: wt, columnBandPaths: X } = ft(() => {
    const t = new Map(z.map((e) => [e.key, e])), s = new Map(z.map((e, f) => [e.key, f])), a = [], n = {}, l = vt.filter((e) => e.keys.some((f) => t.has(f))).map((e) => ({
      ...e,
      keys: [...e.keys].sort(
        (f, o) => (s.get(f) ?? 999999) - (s.get(o) ?? 999999)
      )
    })).sort((e, f) => {
      const o = Math.min(...e.keys.map((b) => s.get(b) ?? 999999)), u = Math.min(...f.keys.map((b) => s.get(b) ?? 999999));
      return o - u;
    }), m = l.some(
      (e) => !e.isStandalone && e.keys.length > 0
    );
    if (m) {
      l.forEach((o) => {
        if (o.isStandalone) {
          const u = t.get(o.keys[0]);
          u && (a.push({
            key: u.key,
            title: u.title,
            dataType: u.dataType,
            defaultWidth: u.defaultWidth
          }), n[u.key] = u.title);
        } else if (o.isAtomic) {
          const u = Array.from(new Set(o.keys));
          a.push({
            key: o.id,
            title: o.title,
            isAtomicGroup: !0,
            atomicKeys: u
          }), u.forEach((b) => {
            n[b] = o.title;
          });
        } else {
          const u = [];
          o.keys.forEach((b) => {
            const x = t.get(b);
            x && (u.push({
              key: x.key,
              title: x.title,
              dataType: x.dataType,
              defaultWidth: x.defaultWidth
            }), n[x.key] = `${o.title} › ${x.title}`);
          }), u.length > 0 && a.push({
            key: o.id,
            title: o.title,
            children: u
          });
        }
      });
      const e = new Set(
        l.filter((o) => o.isAtomic).flatMap((o) => o.keys)
      ), f = /* @__PURE__ */ new Set([
        ...l.flatMap((o) => o.keys),
        ...e
      ]);
      z.forEach((o) => {
        f.has(o.key) || (a.push({
          key: o.key,
          title: o.title,
          dataType: o.dataType,
          defaultWidth: o.defaultWidth
        }), n[o.key] = o.title);
      });
    } else
      z.forEach((e) => {
        a.push({
          key: e.key,
          title: e.title,
          dataType: e.dataType,
          defaultWidth: e.defaultWidth
        }), n[e.key] = e.title;
      });
    return {
      orderedRawColumns: a,
      hasBands: m,
      columnBandPaths: n
    };
  }, [z, vt]), rt = (t, s) => {
    t.preventDefault(), t.stopPropagation(), it.current = !0;
    const a = t.clientX, n = yt, l = (e) => {
      if (!it.current) return;
      const f = s === "left" ? a - e.clientX : e.clientX - a;
      bt(Math.max(220, Math.min(520, n + f)));
    }, m = () => {
      it.current = !1, window.removeEventListener("pointermove", l), window.removeEventListener("pointerup", m);
    };
    window.addEventListener("pointermove", l), window.addEventListener("pointerup", m);
  }, dt = (t) => t.isAtomicGroup && t.atomicKeys && t.atomicKeys.length > 0 ? t.atomicKeys : !t.children || t.children.length === 0 ? t.key ? [t.key] : [] : t.children.flatMap((s) => dt(s)), Dt = (t) => {
    const s = dt(t);
    if (s.length === 0) return;
    const a = s.every((n) => M.includes(n));
    _(a ? M.filter((n) => !s.includes(n)) : Array.from(/* @__PURE__ */ new Set([...M, ...s])));
  }, kt = (t, s) => {
    S !== null || Q !== null || $.current || nt.current || xt((a) => ({
      ...a,
      [t]: !s
    }));
  }, Mt = (t, s) => {
    if (!t) return [];
    const a = t.scrollTop, n = t.querySelectorAll("[data-sibling-parent]"), l = [];
    return n.forEach((m) => {
      if (m.getAttribute("data-sibling-parent") === s) {
        const e = parseInt(m.getAttribute("data-sibling-idx") || "", 10);
        if (!isNaN(e)) {
          const f = m.getBoundingClientRect();
          l.push({ idx: e, midY: f.top + a + f.height / 2 });
        }
      }
    }), l.sort((m, e) => m.idx - e.idx);
  }, Yt = (t, s = 0, a = 0, n = "root", l = lt) => {
    const m = !t.children || t.children.length === 0, e = t.key || t.title || String(a), f = `${n}/${e}`, o = !!(S && S.parentKey === n && S.key === e);
    let u = 0;
    if (S && S.parentKey === n && !o) {
      const { fromIdx: r, toIdx: h } = S, v = T.current?.itemHeight || 26;
      r < h && a > r && a <= h ? u = -v : r > h && a >= h && a < r && (u = v);
    }
    if (m) {
      if (!t.key) return null;
      const r = t.key, h = !!t.isAtomicGroup, v = t.atomicKeys || [r], w = h ? v.some((d) => M.includes(d)) : M.includes(r);
      if (y) {
        const d = t.title.toLowerCase().includes(y), E = (X[r] || "").toLowerCase().includes(y), Y = r.toLowerCase().includes(y);
        if (!d && !E && !Y) return null;
      }
      return /* @__PURE__ */ g(
        "div",
        {
          "data-sibling-parent": n,
          "data-sibling-idx": a,
          style: {
            paddingLeft: `${Math.max(8, s * 14 + 8)}px`,
            transform: o ? `translateY(${S.offsetY}px)` : u ? `translateY(${u}px)` : void 0,
            transition: o ? "none" : "transform 0.2s cubic-bezier(0.2, 0, 0, 1), box-shadow 0.2s ease",
            zIndex: o ? 50 : u ? 10 : 1,
            position: "relative",
            pointerEvents: o ? "none" : void 0
          },
          className: `agv-chooser-item flex items-center justify-between rounded px-1.5 py-0.5 text-xs select-none ${o ? "scale-[1.01] bg-[var(--agv-bg-control)] text-[var(--agv-text-main)] shadow-lg opacity-95 border border-[var(--agv-accent)]" : w ? `bg-[var(--agv-bg-item-active)] hover:bg-[var(--agv-bg-item-hover)] ${P ? "cursor-grab active:cursor-grabbing touch-none" : "cursor-pointer"}` : `opacity-60 hover:opacity-100 ${P ? "cursor-grab active:cursor-grabbing touch-none" : "cursor-pointer"}`}`,
          onPointerDown: P && l.length > 1 ? (d) => {
            if (d.button !== 0 || y) return;
            const E = d.target;
            if (E.closest("button") || E.closest(".agv-chooser-action-btn"))
              return;
            const Y = d.currentTarget, D = Y.closest(".agv-chooser-scroll"), W = Math.max(24, (Y.offsetHeight || 26) + 2), st = d.clientY, R = a, V = e, G = l.length;
            let N = !1;
            const A = (I) => {
              const L = I.clientY - st;
              if (!N)
                if (Math.abs(L) > 3) {
                  N = !0;
                  const k = Mt(D, n);
                  T.current = {
                    parentKey: n,
                    key: V,
                    fromIdx: R,
                    toIdx: R,
                    startY: st,
                    itemHeight: W,
                    totalCount: G,
                    scrollEl: D,
                    siblingMidpoints: k
                  }, document.body.style.cursor = "grabbing", document.body.style.userSelect = "none", U({
                    parentKey: n,
                    key: V,
                    fromIdx: R,
                    toIdx: R,
                    offsetY: L
                  });
                } else
                  return;
              if (!T.current) return;
              const i = T.current, p = I.clientY - i.startY, F = I.clientY + (i.scrollEl ? i.scrollEl.scrollTop : 0);
              let K = i.fromIdx;
              if (i.siblingMidpoints.length > 0) {
                if (p > 0)
                  for (const k of i.siblingMidpoints)
                    k.idx > i.fromIdx && F > k.midY && (K = k.idx);
                else if (p < 0)
                  for (let k = i.siblingMidpoints.length - 1; k >= 0; k--) {
                    const gt = i.siblingMidpoints[k];
                    gt.idx < i.fromIdx && F < gt.midY && (K = gt.idx);
                  }
              } else {
                const k = Math.round(p / i.itemHeight);
                K = Math.max(0, Math.min(i.totalCount - 1, i.fromIdx + k));
              }
              if (i.toIdx = K, U({
                parentKey: i.parentKey,
                key: i.key,
                fromIdx: i.fromIdx,
                toIdx: K,
                offsetY: p
              }), i.scrollEl) {
                const k = i.scrollEl.getBoundingClientRect();
                I.clientY < k.top + 25 ? i.scrollEl.scrollTop -= 5 : I.clientY > k.bottom - 25 && (i.scrollEl.scrollTop += 5);
              }
            }, c = () => {
              if (window.removeEventListener("pointermove", A), window.removeEventListener("pointerup", c), window.removeEventListener("pointercancel", c), document.body.style.cursor = "", document.body.style.userSelect = "", N) {
                const I = T.current;
                if (T.current = null, U(null), $.current = !0, setTimeout(() => {
                  $.current = !1;
                }, 350), I && H) {
                  const { fromIdx: L, toIdx: i } = I;
                  L !== i && l[L]?.key && l[i]?.key && H(l[L].key, l[i].key);
                }
              }
            };
            window.addEventListener("pointermove", A), window.addEventListener("pointerup", c), window.addEventListener("pointercancel", c);
          } : void 0,
          onClick: () => {
            !J || $.current || _(
              h ? w ? M.filter((d) => !v.includes(d)) : Array.from(/* @__PURE__ */ new Set([...M, ...v])) : w ? M.filter((d) => d !== r) : [...M, r]
            );
          },
          children: /* @__PURE__ */ C(
            "div",
            {
              className: "flex min-w-0 flex-1 cursor-pointer select-none items-center gap-2 py-0.5",
              children: [
                J && /* @__PURE__ */ g(
                  mt,
                  {
                    checked: w,
                    className: "agv-chooser-checkbox"
                  }
                ),
                /* @__PURE__ */ g(
                  "span",
                  {
                    className: `truncate text-xs ${w ? "font-semibold text-[var(--agv-text-main)]" : "text-[var(--agv-text-subtle)] line-through"}`,
                    children: t.title
                  }
                )
              ]
            }
          )
        },
        r
      );
    }
    const b = dt(t), x = b.filter((r) => M.includes(r)).length, q = b.length > 0 && x === b.length, ut = x > 0 && !q;
    if (y && !(b.some((h) => z.find((w) => w.key === h)?.title.toLowerCase().includes(y) || (X[h] || "").toLowerCase().includes(y)) || t.title.toLowerCase().includes(y)))
      return null;
    const B = y ? !1 : !!Ct[f];
    return /* @__PURE__ */ C(
      "div",
      {
        "data-sibling-parent": n,
        "data-sibling-idx": a,
        style: {
          transform: o ? `translateY(${S.offsetY}px)` : u ? `translateY(${u}px)` : void 0,
          transition: o ? "none" : "transform 0.2s cubic-bezier(0.2, 0, 0, 1), box-shadow 0.2s ease",
          zIndex: o ? 50 : u ? 10 : 1,
          position: "relative",
          pointerEvents: o ? "none" : void 0
        },
        className: `agv-chooser-band-group mb-1 transition-all ${o ? "scale-[1.01] rounded bg-[var(--agv-bg-control)] text-[var(--agv-text-main)] shadow-lg opacity-95 border border-[var(--agv-accent)]" : ""}`,
        children: [
          /* @__PURE__ */ C(
            "div",
            {
              className: `flex min-h-[28px] select-none items-center justify-between rounded border px-2 py-0.5 ${s === 0 ? `border-[var(--agv-border-strong)] bg-[var(--agv-bg-control)] font-bold text-[var(--agv-text-header)] hover:bg-[var(--agv-bg-item-hover)] ${P ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"}` : `ml-1.5 border-[var(--agv-border)] bg-[var(--agv-bg-control)] font-semibold text-[var(--agv-text-main)] hover:bg-[var(--agv-bg-item-hover)] ${P ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"}`}`,
              onPointerDown: P && l.length > 1 ? (r) => {
                if (r.button !== 0 || y) return;
                const h = r.target;
                if (h.closest("button") || h.closest(".agv-chooser-checkbox"))
                  return;
                const v = r.currentTarget, w = v.closest(".agv-chooser-band-group") || v, d = v.closest(".agv-chooser-scroll"), E = Math.max(28, (w.offsetHeight || 30) + 4), Y = r.clientY, D = a, W = e, st = l.length;
                let R = !1;
                const V = (N) => {
                  const A = N.clientY - Y;
                  if (!R)
                    if (Math.abs(A) > 4) {
                      R = !0;
                      const p = Mt(d, n);
                      T.current = {
                        parentKey: n,
                        key: W,
                        fromIdx: D,
                        toIdx: D,
                        startY: Y,
                        itemHeight: E,
                        totalCount: st,
                        scrollEl: d,
                        siblingMidpoints: p
                      }, document.body.style.cursor = "grabbing", document.body.style.userSelect = "none", U({
                        parentKey: n,
                        key: W,
                        fromIdx: D,
                        toIdx: D,
                        offsetY: A
                      });
                    } else
                      return;
                  if (!T.current) return;
                  const c = T.current, I = N.clientY - c.startY, L = N.clientY + (c.scrollEl ? c.scrollEl.scrollTop : 0);
                  let i = c.fromIdx;
                  if (c.siblingMidpoints.length > 0) {
                    if (I > 0)
                      for (const p of c.siblingMidpoints)
                        p.idx > c.fromIdx && L > p.midY && (i = p.idx);
                    else if (I < 0)
                      for (let p = c.siblingMidpoints.length - 1; p >= 0; p--) {
                        const F = c.siblingMidpoints[p];
                        F.idx < c.fromIdx && L < F.midY && (i = F.idx);
                      }
                  } else {
                    const p = Math.round(I / c.itemHeight);
                    i = Math.max(0, Math.min(c.totalCount - 1, c.fromIdx + p));
                  }
                  if (c.toIdx = i, U({
                    parentKey: c.parentKey,
                    key: c.key,
                    fromIdx: c.fromIdx,
                    toIdx: i,
                    offsetY: I
                  }), c.scrollEl) {
                    const p = c.scrollEl.getBoundingClientRect();
                    N.clientY < p.top + 25 ? c.scrollEl.scrollTop -= 5 : N.clientY > p.bottom - 25 && (c.scrollEl.scrollTop += 5);
                  }
                }, G = () => {
                  if (window.removeEventListener("pointermove", V), window.removeEventListener("pointerup", G), window.removeEventListener("pointercancel", G), document.body.style.cursor = "", document.body.style.userSelect = "", R) {
                    const N = T.current;
                    if (T.current = null, U(null), $.current = !0, setTimeout(() => {
                      $.current = !1;
                    }, 350), N && H) {
                      const { fromIdx: A, toIdx: c } = N;
                      A !== c && l[A]?.key && l[c]?.key && H(l[A].key, l[c].key);
                    }
                  }
                };
                window.addEventListener("pointermove", V), window.addEventListener("pointerup", G), window.addEventListener("pointercancel", G);
              } : void 0,
              onClick: (r) => {
                if ($.current || S !== null) return;
                const h = r.target;
                h.closest(".agv-chooser-checkbox") || h.closest("button") || kt(f, B);
              },
              children: [
                /* @__PURE__ */ C("div", { className: "flex min-w-0 items-center gap-1.5", children: [
                  /* @__PURE__ */ g(
                    "button",
                    {
                      type: "button",
                      onClick: (r) => {
                        r.stopPropagation(), !($.current || S !== null) && kt(f, B);
                      },
                      className: "agv-btn agv-btn-ghost flex h-5 w-5 shrink-0 items-center justify-center rounded text-[var(--agv-text-subtle)] hover:text-[var(--agv-text-main)] cursor-pointer",
                      children: B ? /* @__PURE__ */ g(_t, { className: "h-3.5 w-3.5 stroke-[2.5]" }) : /* @__PURE__ */ g(jt, { className: "h-3.5 w-3.5 stroke-[2.5]" })
                    }
                  ),
                  J && /* @__PURE__ */ g("div", { onPointerDown: (r) => r.stopPropagation(), children: /* @__PURE__ */ g(
                    mt,
                    {
                      checked: q,
                      indeterminate: ut,
                      onClick: (r) => {
                        r.stopPropagation(), Dt(t);
                      },
                      className: "agv-chooser-checkbox"
                    }
                  ) }),
                  /* @__PURE__ */ g(
                    Ot,
                    {
                      className: `h-3.5 w-3.5 shrink-0 ${s === 0 ? "text-[var(--agv-accent)]" : "text-[var(--agv-text-subtle)]"}`
                    }
                  ),
                  /* @__PURE__ */ g("span", { className: "truncate text-xs tracking-tight text-[var(--agv-text-main)]", children: t.title })
                ] }),
                /* @__PURE__ */ C(
                  "span",
                  {
                    className: `py-0.5 shrink-0 rounded-full px-1.5 text-xs font-semibold ${q ? "bg-[var(--agv-bg-item-active)] text-[var(--agv-accent)]" : x > 0 ? "bg-[var(--agv-warning-bg)] text-[var(--agv-warning)]" : "bg-[var(--agv-bg-control)] text-[var(--agv-text-subtle)]"}`,
                    children: [
                      x,
                      "/",
                      b.length
                    ]
                  }
                )
              ]
            }
          ),
          !B && /* @__PURE__ */ g("div", { className: "ml-3 mt-0.5 space-y-0.5 border-l-2 border-[var(--agv-border)] pl-1", children: t.children.map(
            (r, h) => Yt(r, s + 1, h, f, t.children)
          ) })
        ]
      },
      f
    );
  }, Z = ft(() => z.filter((t) => {
    if (!y) return !0;
    const s = t.title.toLowerCase().includes(y), a = t.key.toLowerCase().includes(y), n = (X[t.key] || "").toLowerCase().includes(y);
    return s || a || n;
  }), [z, y, X]);
  return /* @__PURE__ */ C(
    "div",
    {
      "data-agv-popup": "true",
      style: {
        ...pt,
        width: j ? "264px" : `${yt}px`,
        minWidth: "200px",
        maxWidth: j ? "calc(100vw - 48px)" : "min(450px, calc(100% - 58px))",
        maxHeight: pt?.maxHeight || (j ? "min(400px, calc(100vh - 120px))" : "calc(100% - 80px)"),
        height: "auto"
      },
      className: j ? "relative flex flex-col text-[var(--agv-text-main)] text-xs select-none" : "agv-column-chooser agv-popup-panel relative flex flex-col rounded-md border border-[var(--agv-border-popup)] bg-[var(--agv-bg-popup)] text-[var(--agv-text-main)] p-2 text-xs select-none agv-spring-right",
      onClick: (t) => t.stopPropagation(),
      onWheel: (t) => t.stopPropagation(),
      children: [
        !j && /* @__PURE__ */ C(At, { children: [
          /* @__PURE__ */ g(
            "div",
            {
              onMouseDown: (t) => rt(t, "left"),
              onPointerDown: (t) => rt(t, "left"),
              className: "agv-chooser-resizer-left absolute -left-1.5 top-0 bottom-0 w-3 cursor-ew-resize select-none touch-none z-30 group flex items-center justify-center",
              children: /* @__PURE__ */ g("div", { className: "w-[3px] h-8 rounded-full bg-[var(--agv-border-strong)] group-hover:bg-[var(--agv-accent)] group-active:bg-[var(--agv-accent-active,var(--agv-accent))] transition-colors" })
            }
          ),
          /* @__PURE__ */ g(
            "div",
            {
              onMouseDown: (t) => rt(t, "right"),
              onPointerDown: (t) => rt(t, "right"),
              className: "agv-chooser-resizer-right absolute -right-1.5 top-0 bottom-0 w-3 cursor-ew-resize select-none touch-none z-30 group flex items-center justify-center",
              children: /* @__PURE__ */ g("div", { className: "w-[3px] h-8 rounded-full bg-[var(--agv-border-strong)] group-hover:bg-[var(--agv-accent)] group-active:bg-[var(--agv-accent-active,var(--agv-accent))] transition-colors" })
            }
          )
        ] }),
        /* @__PURE__ */ C("div", { className: "mb-2 flex items-center gap-1.5 shrink-0", children: [
          /* @__PURE__ */ C("div", { className: "relative flex-1 flex items-center", children: [
            /* @__PURE__ */ g(Ht, { className: "absolute left-2 h-3.5 w-3.5 text-[var(--agv-text-subtle)] pointer-events-none" }),
            /* @__PURE__ */ g(
              "input",
              {
                type: "text",
                value: ot,
                onChange: (t) => at(t.target.value),
                placeholder: "Tìm kiếm tên cột...",
                ...Bt,
                className: `${zt} w-full pl-7 pr-7`
              }
            ),
            ot && /* @__PURE__ */ g(
              "button",
              {
                type: "button",
                onClick: () => at(""),
                className: "agv-inline-clear-ghost absolute right-1.5",
                children: /* @__PURE__ */ g(Wt, { className: "h-3 w-3" })
              }
            )
          ] }),
          /* @__PURE__ */ g(
            Rt,
            {
              variant: "outline",
              size: "icon-sm",
              onClick: () => {
                St(), xt({}), at(""), bt(240);
              },
              className: "text-[var(--agv-text-muted)] hover:text-[var(--agv-text-main)] select-none",
              children: /* @__PURE__ */ g(Ut, { className: "h-3.5 w-3.5 shrink-0" })
            }
          )
        ] }),
        /* @__PURE__ */ g(
          $t,
          {
            className: "flex-1 min-h-0",
            viewportClassName: "agv-chooser-scroll flex-1 min-h-0 overflow-y-auto overflow-x-hidden pr-0 overscroll-contain",
            contentSignature: Z.length,
            children: /* @__PURE__ */ g("div", { className: "space-y-0.5 min-w-full", children: wt ? lt.map(
              (t, s) => Yt(t, 0, s, "root", lt)
            ) : Z.length === 0 ? /* @__PURE__ */ C("div", { className: "py-6 text-center text-xs italic text-[var(--agv-text-subtle)]", children: [
              'Không tìm thấy cột phù hợp với từ khóa "',
              ot,
              '"'
            ] }) : Z.map((t, s) => {
              const a = M.includes(t.key), n = Q?.key === t.key;
              let l = 0;
              if (Q && !n) {
                const { fromIdx: m, toIdx: e } = Q, f = O.current?.itemHeight || 27;
                m < e && s > m && s <= e ? l = -f : m > e && s >= e && s < m && (l = f);
              }
              return /* @__PURE__ */ g(
                "div",
                {
                  style: {
                    transform: n ? `translateY(${Q.offsetY}px)` : l ? `translateY(${l}px)` : void 0,
                    transition: n ? "none" : "transform 0.2s cubic-bezier(0.2, 0, 0, 1), box-shadow 0.2s ease",
                    zIndex: n ? 50 : l ? 10 : 1,
                    position: "relative"
                  },
                  className: `agv-chooser-item flex items-center justify-between rounded px-1.5 py-0.5 select-none ${P ? "cursor-grab active:cursor-grabbing touch-none" : "cursor-pointer"} ${n ? "is-dragging bg-[var(--agv-bg-control)] text-[var(--agv-text-main)] shadow-lg scale-[1.01]" : a ? j ? "is-checked hover:bg-[var(--agv-bg-item-hover)]" : "is-checked bg-[var(--agv-bg-item-active)] hover:bg-[var(--agv-bg-item-hover)]" : "opacity-60 hover:opacity-100 hover:bg-[var(--agv-bg-item-hover)]"}`,
                  onPointerDown: P ? (m) => {
                    if (m.button !== 0) return;
                    const e = m.target;
                    if (e.closest("button") || e.closest(".agv-chooser-action-btn"))
                      return;
                    const f = m.currentTarget, o = f.closest(".agv-chooser-scroll"), u = f.offsetHeight + 2, b = m.clientY, x = s, q = t.key, ut = Z.length;
                    let B = !1;
                    const r = (v) => {
                      const w = v.clientY - b;
                      if (!B)
                        if (Math.abs(w) > 3)
                          B = !0, O.current = {
                            key: q,
                            fromIdx: x,
                            toIdx: x,
                            startY: b,
                            itemHeight: u,
                            itemCount: ut,
                            scrollEl: o
                          }, document.body.style.cursor = "grabbing", document.body.style.userSelect = "none", ct({
                            key: q,
                            fromIdx: x,
                            toIdx: x,
                            offsetY: w
                          });
                        else
                          return;
                      if (!O.current) return;
                      const d = O.current, E = v.clientY - d.startY, Y = Math.round(E / d.itemHeight), D = Math.max(
                        0,
                        Math.min(d.itemCount - 1, d.fromIdx + Y)
                      );
                      if (d.toIdx = D, ct({
                        key: d.key,
                        fromIdx: d.fromIdx,
                        toIdx: D,
                        offsetY: E
                      }), d.scrollEl) {
                        const W = d.scrollEl.getBoundingClientRect();
                        v.clientY < W.top + 25 ? d.scrollEl.scrollTop -= 5 : v.clientY > W.bottom - 25 && (d.scrollEl.scrollTop += 5);
                      }
                    }, h = () => {
                      if (window.removeEventListener("pointermove", r), window.removeEventListener("pointerup", h), window.removeEventListener("pointercancel", h), document.body.style.cursor = "", document.body.style.userSelect = "", B) {
                        const v = O.current;
                        if (O.current = null, ct(null), nt.current = !0, setTimeout(() => {
                          nt.current = !1;
                        }, 350), v && H) {
                          const { key: w, fromIdx: d, toIdx: E } = v;
                          if (d !== E) {
                            const Y = Z[E];
                            Y && Y.key !== w && H(w, Y.key);
                          }
                        }
                      }
                    };
                    window.addEventListener("pointermove", r), window.addEventListener("pointerup", h), window.addEventListener("pointercancel", h);
                  } : void 0,
                  onClick: () => {
                    !J || nt.current || _(
                      a ? M.filter((m) => m !== t.key) : [...M, t.key]
                    );
                  },
                  children: /* @__PURE__ */ C(
                    "div",
                    {
                      className: "flex min-w-0 flex-1 select-none items-center gap-1.5 py-0.5",
                      children: [
                        J && /* @__PURE__ */ g(
                          mt,
                          {
                            checked: a,
                            className: "agv-chooser-checkbox"
                          }
                        ),
                        /* @__PURE__ */ g(
                          "span",
                          {
                            className: `truncate text-xs ${a ? "font-semibold text-[var(--agv-text-main)]" : "text-[var(--agv-text-subtle)] line-through"}`,
                            children: t.title
                          }
                        ),
                        wt && X[t.key] && /* @__PURE__ */ g(
                          "span",
                          {
                            className: "mt-0.5 block truncate pl-2 text-xs text-[var(--agv-text-subtle)]",
                            children: X[t.key]
                          }
                        )
                      ]
                    }
                  )
                },
                t.key
              );
            }) })
          }
        )
      ]
    }
  );
});
export {
  ie as AdvColumnChooserModal
};
