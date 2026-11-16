import { jsxs as Q, jsx as c } from "react/jsx-runtime";
import { useRef as f, useMemo as T, useState as Z, useCallback as de, useEffect as j, useLayoutEffect as Re } from "react";
import { createPortal as Ye } from "react-dom";
import { n as Me } from "./MorphIcons-DW5eQGeo.js";
import { D as Te, S as L } from "./gridFormatUtils-wCKPmlrt.js";
import { A as fe } from "./AdvSelect-DRrnhZaQ.js";
import { A as Le } from "./AdvOverlayScroll-CipuwW1l.js";
import { g as Ae } from "./enterpriseEditorUtils-DJeTtQuh.js";
import { n as ze, r as De } from "./DataGridEnterprise-CwIXrBzR.js";
import { B as He, A as me } from "./AdvButton-B7j0puyb.js";
import { g as Ne, S as $e } from "./common-Bjggt86Z.js";
import { c as je } from "./createLucideIcon-BCMt_G8a.js";
import { X as _e } from "./x-CdrDtutQ.js";
const pe = {
  name: "grip-vertical",
  size: 24,
  node: [
    ["circle", { cx: "9", cy: "12", r: "1", key: "1vctgf" }],
    ["circle", { cx: "9", cy: "5", r: "1", key: "hp0tcf" }],
    ["circle", { cx: "9", cy: "19", r: "1", key: "fkjjf6" }],
    ["circle", { cx: "15", cy: "12", r: "1", key: "1tmaij" }],
    ["circle", { cx: "15", cy: "5", r: "1", key: "19l28e" }],
    ["circle", { cx: "15", cy: "19", r: "1", key: "f4zoj3" }]
  ]
};
pe.node;
const Be = je(pe), et = ({
  isOpen: m,
  onClose: b,
  anchorPos: w,
  initialColumnKey: S,
  columns: ee,
  sortRules: _,
  onApply: A,
  surfaceTheme: B = $e.LIGHT,
  embedded: p = !1
}) => {
  const F = f(null), te = f(null), E = f(/* @__PURE__ */ new Map()), re = f(A);
  re.current = A;
  const C = T(
    () => ee.filter(
      (e) => e.dataType !== Te.SYSTEM && !e.isRowNumber && !e.isSelection && !e.isChart && e.sortable !== !1
    ),
    [ee]
  ), U = T(
    () => new Set(C.map((e) => e.key)),
    [C]
  ), [a, z] = Z([]), V = f(!1), [D, I] = Z(null), h = f(null), v = f(null), R = f(null), [ve, ge] = Z(0), Y = f(null), M = f(null), y = de(() => {
    Y.current !== null && (cancelAnimationFrame(Y.current), Y.current = null), M.current !== null && (window.clearTimeout(M.current), M.current = null);
  }, []);
  j(() => {
    if (!m) {
      V.current = !1, v.current?.(), v.current = null, h.current = null, I(null), R.current = null, y();
      return;
    }
    if (V.current) return;
    V.current = !0;
    const e = ze(_).filter((t) => U.has(t.key));
    if (e.length > 0)
      z(e);
    else if (S && U.has(S)) {
      const t = [{ key: S, direction: L.ASC }];
      z(t), re.current(t);
    } else
      z([]);
    I(null);
  }, [m, _, S, U, y]), j(() => () => {
    v.current?.(), v.current = null, y();
  }, [y]), Re(() => {
    const e = R.current;
    if (!e) return;
    R.current = null, y();
    const t = Array.from(E.current.entries()), r = E.current.get(e.movedKey);
    for (const [n, i] of t)
      n !== e.movedKey && (i.style.transition = "none", i.style.transform = "", i.style.zIndex = "");
    r && Math.abs(e.residualY) > 0.5 && (r.style.transition = "none", r.style.transform = `translateY(${e.residualY}px)`, r.style.zIndex = "40"), te.current?.offsetHeight, Y.current = requestAnimationFrame(() => {
      Y.current = null;
      for (const [n, i] of E.current.entries())
        n !== e.movedKey && (i.style.transition = "");
      r && Math.abs(e.residualY) > 0.5 && (r.style.transition = "transform 0.2s cubic-bezier(0.2, 0, 0, 1)", r.style.transform = "translateY(0px)");
    }), M.current = window.setTimeout(() => {
      M.current = null, r && (r.style.transition = "", r.style.transform = "", r.style.zIndex = "");
    }, 220);
  }, [a, ve, y]), j(() => {
    if (!m || p) return;
    const e = (t) => {
      t.detail?.except !== "multi-sort" && b();
    };
    return window.addEventListener("agv-close-all-popups", e), () => {
      window.removeEventListener("agv-close-all-popups", e);
    };
  }, [m, b, p]), j(() => {
    if (!m || p) return;
    const e = (r) => {
      if (h.current) return;
      const n = r.target;
      n && (F.current && F.current.contains(n) || n.closest?.(".agv-select-portal, .agv-portal-dropdown, .agv-float-toolbar-btn") || b());
    }, t = (r) => {
      r.key === "Escape" && b();
    };
    return document.addEventListener("mousedown", e, !0), document.addEventListener("touchstart", e, !0), document.addEventListener("keydown", t), () => {
      document.removeEventListener("mousedown", e, !0), document.removeEventListener("touchstart", e, !0), document.removeEventListener("keydown", t);
    };
  }, [m, b, p]);
  const W = T(() => new Set(a.map((e) => e.key)), [a]), ne = T(
    () => C.filter((e) => !W.has(e.key)),
    [C, W]
  ), H = 440, O = T(() => {
    if (!m || !w)
      return { left: 8, top: 8, maxListHeight: 260 };
    const e = Math.max(1, _.length || (S ? 1 : 0)), t = Math.max(128, Math.min(420, 88 + e * 40)), r = typeof window < "u" ? window.innerWidth : 1280, n = typeof window < "u" ? window.innerHeight : 800;
    let i = Math.round(w.x);
    i + H > r - 8 && (i = Math.max(8, r - H - 8)), i < 8 && (i = 8);
    let u = Math.round(w.y + 6);
    u + t > n - 8 && (u = Math.max(8, n - t - 8)), u < 8 && (u = 8);
    const o = Math.min(260, Math.max(116, n - u - 88));
    return { left: i, top: u, maxListHeight: o };
  }, [m, w?.x, w?.y]), k = de(
    (e) => {
      z(e), A(e);
    },
    [A]
  );
  if (!m || !p && (!w || typeof document > "u"))
    return null;
  const he = Ne(B), ye = Ae(), xe = (e, t) => {
    const r = a.map((n, i) => i === e ? { ...n, key: t } : n);
    k(r);
  }, we = (e, t) => {
    const r = a.map(
      (n, i) => i === e ? { ...n, direction: t } : n
    );
    k(r);
  }, ke = (e) => {
    const t = a.filter((r, n) => n !== e);
    k(t);
  }, be = (e) => {
    if (!e || W.has(e)) return;
    const t = [...a, { key: e, direction: L.ASC }];
    k(t);
  }, Se = () => {
    a.length !== 0 && k([]);
  }, P = a.length > 1, oe = /* @__PURE__ */ Q(
    "div",
    {
      ref: F,
      "data-agv-popup": "true",
      onClick: (e) => e.stopPropagation(),
      onContextMenu: (e) => e.preventDefault(),
      className: p ? "select-none" : "agv-multi-sort-popup agv-popup-panel pointer-events-auto fixed rounded-md border p-3 select-none agv-spring-zoom",
      style: p ? {
        width: `min(${H}px, calc(100vw - 48px))`,
        color: "var(--agv-text-main)"
      } : {
        left: `${O.left}px`,
        top: `${O.top}px`,
        width: `min(${H}px, calc(100vw - 16px))`,
        backgroundColor: "var(--popup-background)",
        borderColor: "var(--popup-border)",
        color: "var(--agv-text-main)",
        boxShadow: "var(--popup-shadow)"
      },
      children: [
        a.length === 0 ? /* @__PURE__ */ c(
          "div",
          {
            className: "py-4 text-center text-xs",
            style: { color: "var(--agv-text-muted)" },
            children: "Chưa có quy tắc sắp xếp nào"
          }
        ) : /* @__PURE__ */ c(
          Le,
          {
            viewportRef: te,
            viewportClassName: "agv-multisort-scroll overflow-y-auto overflow-x-hidden pr-0 space-y-1.5 overscroll-contain",
            viewportStyle: {
              maxHeight: `${O.maxListHeight}px`
            },
            contentSignature: a.length,
            children: a.map((e, t) => {
              const r = D?.key === e.key, n = e.direction === L.ASC, i = C.map((o) => ({
                value: o.key,
                label: o.title || o.key,
                disabled: a.some((x, d) => d !== t && x.key === o.key)
              }));
              let u = 0;
              if (D && !r) {
                const { fromIdx: o, toIdx: x } = D, d = h.current?.itemHeight || 38;
                o < x && t > o && t <= x ? u = -d : o > x && t >= x && t < o && (u = d);
              }
              return /* @__PURE__ */ Q(
                "div",
                {
                  ref: (o) => {
                    o ? E.current.set(e.key, o) : E.current.delete(e.key);
                  },
                  style: {
                    transform: r ? `translateY(${D.offsetY}px)` : u ? `translateY(${u}px)` : void 0,
                    transition: r ? "none" : "transform 0.2s cubic-bezier(0.2, 0, 0, 1), box-shadow 0.2s ease",
                    zIndex: r ? 50 : u ? 10 : 1,
                    position: "relative"
                  },
                  className: `agv-multisort-item flex items-center gap-2 rounded-md px-1.5 py-0.5 select-none ${P ? "cursor-grab active:cursor-grabbing touch-none" : ""} ${r ? "is-dragging bg-[var(--agv-bg-control)] shadow-lg scale-[1.01]" : "hover:bg-[var(--agv-bg-item-hover)]"}`,
                  onPointerDown: P ? (o) => {
                    if (o.button !== 0 || o.target.closest('button, input, select, textarea, [data-no-drag="true"]'))
                      return;
                    const d = o.currentTarget, Ee = d.closest(".agv-multisort-scroll"), q = d.parentElement ? Array.from(d.parentElement.children) : [];
                    let G = d.offsetHeight + 6;
                    if (q.length > 1) {
                      const s = q[t + 1], g = q[t - 1];
                      s ? G = s.offsetTop - d.offsetTop : g && (G = d.offsetTop - g.offsetTop);
                    }
                    const se = o.clientY, N = t, ie = e.key, le = a, Ce = le.length;
                    let K = !1;
                    const ae = (s) => {
                      const g = s.clientY - se;
                      if (!K)
                        if (Math.abs(g) > 3)
                          K = !0, y(), R.current = null, h.current = {
                            key: ie,
                            fromIdx: N,
                            toIdx: N,
                            startY: se,
                            itemHeight: G,
                            itemCount: Ce,
                            scrollEl: Ee,
                            lastOffsetY: g
                          }, document.body.style.cursor = "grabbing", document.body.style.userSelect = "none", I({
                            key: ie,
                            fromIdx: N,
                            toIdx: N,
                            offsetY: g
                          });
                        else
                          return;
                      const l = h.current;
                      if (!l) return;
                      const J = s.clientY - l.startY, Ie = Math.round(J / l.itemHeight), ce = Math.max(
                        0,
                        Math.min(l.itemCount - 1, l.fromIdx + Ie)
                      );
                      if (l.toIdx = ce, l.lastOffsetY = J, I({
                        key: l.key,
                        fromIdx: l.fromIdx,
                        toIdx: ce,
                        offsetY: J
                      }), l.scrollEl) {
                        const ue = l.scrollEl.getBoundingClientRect();
                        s.clientY < ue.top + 25 ? l.scrollEl.scrollTop -= 5 : s.clientY > ue.bottom - 25 && (l.scrollEl.scrollTop += 5);
                      }
                    }, X = () => {
                      window.removeEventListener("pointermove", ae), window.removeEventListener("pointerup", $), window.removeEventListener("pointercancel", $), document.body.style.cursor = "", document.body.style.userSelect = "", v.current === X && (v.current = null);
                    }, $ = () => {
                      if (X(), !K) return;
                      const s = h.current;
                      if (h.current = null, I(null), !s) return;
                      const g = s.lastOffsetY - (s.toIdx - s.fromIdx) * s.itemHeight;
                      if (R.current = {
                        movedKey: s.key,
                        residualY: g
                      }, s.fromIdx !== s.toIdx) {
                        const l = De(
                          le,
                          s.fromIdx,
                          s.toIdx
                        );
                        k(l);
                      } else
                        ge((l) => l + 1);
                    };
                    v.current?.(), v.current = X, window.addEventListener("pointermove", ae), window.addEventListener("pointerup", $), window.addEventListener("pointercancel", $);
                  } : void 0,
                  children: [
                    /* @__PURE__ */ c(
                      "span",
                      {
                        className: `inline-flex items-center justify-center shrink-0 ${P ? "" : "opacity-40"}`,
                        style: { color: "var(--agv-text-muted)" },
                        children: /* @__PURE__ */ c(Be, { size: 14, strokeWidth: 2 })
                      }
                    ),
                    /* @__PURE__ */ c(
                      "span",
                      {
                        className: "w-[84px] shrink-0 text-xs font-medium whitespace-nowrap",
                        style: { color: "var(--agv-text-muted)" },
                        children: t === 0 ? "Sắp xếp theo" : "Sau đó theo"
                      }
                    ),
                    /* @__PURE__ */ c("div", { className: "flex-1 min-w-[140px]", children: /* @__PURE__ */ c(
                      fe,
                      {
                        value: e.key,
                        onChange: (o) => xe(t, o),
                        options: i,
                        theme: B,
                        size: "sm",
                        width: "100%"
                      }
                    ) }),
                    /* @__PURE__ */ c(
                      "button",
                      {
                        type: "button",
                        onClick: () => we(
                          t,
                          n ? L.DESC : L.ASC
                        ),
                        "aria-label": n ? "Sắp xếp tăng dần" : "Sắp xếp giảm dần",
                        className: `min-h-[28px] min-w-[28px] h-7 w-7 inline-flex items-center justify-center rounded-md border transition cursor-pointer shrink-0 ${He}`,
                        style: {
                          backgroundColor: "var(--agv-accent)",
                          borderColor: "var(--agv-accent)",
                          color: "var(--agv-accent-text, #ffffff)"
                        },
                        children: /* @__PURE__ */ c(Me, { direction: e.direction, size: 14, spring: "snappy" })
                      }
                    ),
                    /* @__PURE__ */ c(
                      me,
                      {
                        variant: "destructive",
                        size: "icon-sm",
                        onClick: () => ke(t),
                        children: /* @__PURE__ */ c(_e, { size: 14, strokeWidth: 2.2 })
                      }
                    )
                  ]
                },
                e.key
              );
            })
          }
        ),
        /* @__PURE__ */ Q(
          "div",
          {
            className: "border-t pt-2.5 mt-2.5 flex items-center justify-between gap-2",
            style: { borderColor: "var(--agv-border)" },
            children: [
              /* @__PURE__ */ c("div", { className: "flex-1 min-w-[165px]", children: /* @__PURE__ */ c(
                fe,
                {
                  value: "",
                  onChange: be,
                  options: ne.map((e) => ({
                    value: e.key,
                    label: e.title || e.key
                  })),
                  placeholder: "Chọn thêm cột sắp xếp...",
                  disabled: ne.length === 0,
                  theme: B,
                  size: "sm",
                  width: "100%"
                }
              ) }),
              /* @__PURE__ */ c(
                me,
                {
                  variant: "destructive",
                  size: "sm",
                  disabled: a.length === 0,
                  onClick: Se,
                  className: "shrink-0",
                  children: "Xóa hết"
                }
              )
            ]
          }
        )
      ]
    }
  );
  return p ? oe : Ye(
    /* @__PURE__ */ c(
      "div",
      {
        className: `fixed inset-0 pointer-events-none z-[1250] ${he}`,
        style: ye,
        children: oe
      }
    ),
    document.body
  );
};
export {
  et as AdvMultiSortPopup
};
