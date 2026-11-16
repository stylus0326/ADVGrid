import { jsxs as D, jsx as s } from "react/jsx-runtime";
import { useState as m, useRef as h, useCallback as u, useMemo as _, useLayoutEffect as re } from "react";
import { createPortal as se } from "react-dom";
import { c as ie, a as ae, u as le, s as ce, b as de, d as ue, g as pe } from "./enterpriseEditorUtils-DJeTtQuh.js";
import { d as fe, g as me, i as he, P as ge } from "./AdvButton-B7j0puyb.js";
import { A as ve } from "./AdvOverlayScroll-CipuwW1l.js";
import { u as xe } from "./useVirtualList-CH5KMFFG.js";
import { g as ye, S as we } from "./common-Bjggt86Z.js";
import { C as Ce } from "./chevron-down-CoESPSbY.js";
import { C as Se } from "./check-KNrOhvEC.js";
const K = 30, F = 240, Pe = ({
  value: k,
  defaultValue: j = "",
  onChange: H,
  options: A = [],
  placeholder: q = "Chọn một mục...",
  disabled: p = !1,
  className: G = "",
  style: W = {},
  theme: R = we.LIGHT,
  size: X = "sm",
  width: Y = "100%"
}) => {
  const g = k !== void 0, [B, J] = m(g ? k : j), v = g ? k : B, [r, P] = m(!1), [a, b] = m(-1), [Q, Z] = m(!1), f = h(null), O = h(null), x = h(null), y = h("init"), $ = h(!1), l = u((e) => {
    $.current !== e && ($.current = e, Z(e));
  }, []), [i, ee] = m(null), o = _(() => A.map((e) => typeof e == "string" ? { value: e, label: e } : e), [A]), I = _(() => {
    const e = /* @__PURE__ */ new Map();
    for (let t = 0; t < o.length; t++) {
      const d = o[t].value;
      e.has(d) || e.set(d, t);
    }
    return e;
  }, [o]), T = I.get(v) ?? -1, E = T >= 0 ? o[T] : void 0, N = u(() => {
    if (!f.current) return;
    const e = ie(f.current, 240, 140);
    ee((t) => ae(t, e) ? t : e);
  }, []), w = u((e = !1) => {
    if (p) return;
    N(), y.current = e ? "keyboard" : "init", l(e), P(!0);
    const t = I.get(v) ?? -1;
    b(t >= 0 ? t : 0);
  }, [p, N, I, v, l]), c = u(() => {
    P(!1), l(!1), b(-1);
  }, [l]), te = u(() => {
    r ? c() : w(!1);
  }, [r, c, w]), V = i ? Math.min(F - 2, Math.max(118, i.maxHeight - 2)) : F - 2, n = xe({
    itemCount: o.length,
    itemHeight: K,
    viewportRef: x,
    overscan: 6,
    threshold: 40,
    enabled: r,
    defaultViewportHeight: V
  });
  le(r, c, N, f, O), re(() => {
    if (!r || y.current === "pointer") return;
    if (n.isVirtualized) {
      n.scrollToIndex(a, 4, 4);
      return;
    }
    const e = x.current;
    if (!e) return;
    const t = e.querySelector(`[data-select-idx="${a}"]`);
    t && ce(e, t, 4, 4);
  }, [r, a, o.length, n.isVirtualized, n.scrollToIndex]);
  const M = u(
    (e) => {
      g || J(e), H?.(e), c(), f.current?.focus();
    },
    [g, H, c]
  ), oe = (e) => {
    if (!p)
      if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "PageDown" || e.key === "PageUp" || e.key === "Home" || e.key === "End") {
        if (e.preventDefault(), !r)
          (e.key === "ArrowDown" || e.key === "ArrowUp") && w(!0);
        else if (o.length > 0) {
          const t = x.current, d = t?.querySelector("[data-select-idx]"), C = de(
            t?.clientHeight || 232,
            n.isVirtualized ? K : d?.offsetHeight || 28,
            6
          );
          y.current = "keyboard", l(!0), b((S) => {
            const U = ue(e.key, S, o.length, C);
            return U !== null ? U : S;
          });
        }
      } else if (e.key === "Enter" || e.key === " ") {
        if (e.preventDefault(), !r)
          w(!0);
        else if (a >= 0 && o[a]) {
          const t = o[a];
          t.disabled || M(t.value);
        }
      } else e.key === "Escape" && (e.preventDefault(), c());
  }, z = (e, t, d) => {
    const C = e.value === v, S = Q && t === a;
    return /* @__PURE__ */ D(
      "button",
      {
        type: "button",
        "data-select-idx": t,
        disabled: e.disabled,
        onClick: () => !e.disabled && M(e.value),
        className: `agv-popup-item justify-between ${d ? "h-[28px] min-h-[28px] mb-[2px]" : ""} ${C ? "is-selected" : S ? "is-highlighted" : ""}`.trim(),
        children: [
          /* @__PURE__ */ s("span", { className: "truncate", children: e.label }),
          C && /* @__PURE__ */ s(
            Se,
            {
              size: 13,
              strokeWidth: 2.5,
              className: "shrink-0 ml-1.5"
            }
          )
        ]
      },
      e.value
    );
  }, ne = pe(), L = ye(R);
  return /* @__PURE__ */ D(
    "div",
    {
      "data-theme": R || void 0,
      className: `relative inline-block select-none ${L} ${G}`.trim(),
      style: { width: Y, ...W },
      children: [
        /* @__PURE__ */ D(
          "button",
          {
            ref: f,
            type: "button",
            disabled: p,
            "data-agv-trigger": "true",
            "data-state": r ? "open" : "closed",
            "aria-expanded": r,
            onClick: te,
            onKeyDown: oe,
            className: `w-full flex items-center justify-between gap-2 px-2.5 font-normal cursor-pointer outline-none ${fe} ${me()} ${he(
              X
            )} ${E ? "text-foreground" : "text-muted-foreground"} ${p ? "opacity-50 cursor-not-allowed" : ""}`.trim(),
            children: [
              /* @__PURE__ */ s("span", { className: "truncate text-left flex-1", children: E ? E.label : q }),
              /* @__PURE__ */ s(
                Ce,
                {
                  size: 14,
                  strokeWidth: 2,
                  className: `shrink-0 transition-transform duration-150 ${r ? "rotate-180 text-brand" : "text-muted-foreground"}`
                }
              )
            ]
          }
        ),
        r && i && typeof document < "u" && se(
          /* @__PURE__ */ s(
            "div",
            {
              className: `fixed inset-0 pointer-events-none z-[999999] ${L}`,
              style: ne,
              children: /* @__PURE__ */ s(
                "div",
                {
                  ref: O,
                  "data-agv-popup": "true",
                  onMouseMove: () => {
                    $.current && (y.current = "pointer", l(!1));
                  },
                  onMouseDown: (e) => e.stopPropagation(),
                  onClick: (e) => e.stopPropagation(),
                  className: `agv-select-portal agv-portal-dropdown pointer-events-auto absolute ${ge} overflow-hidden select-none ${i.isFlipUp ? "agv-spring-up" : "agv-spring-down"}`,
                  style: {
                    top: i.isFlipUp ? void 0 : `${i.top}px`,
                    bottom: i.isFlipUp ? `${i.bottom}px` : void 0,
                    left: `${i.left}px`,
                    width: `${i.width}px`
                  },
                  children: /* @__PURE__ */ s(
                    ve,
                    {
                      viewportRef: x,
                      onScroll: n.handleScroll,
                      viewportClassName: "overflow-y-auto overflow-x-hidden p-1",
                      viewportStyle: { maxHeight: `${V}px` },
                      contentSignature: `${o.length}:${n.startIndex}:${n.endIndex}`,
                      children: o.length === 0 ? /* @__PURE__ */ s("div", { className: "px-2.5 py-1.5 text-xs text-muted-foreground text-center", children: "Không có tùy chọn" }) : n.isVirtualized ? /* @__PURE__ */ s("div", { style: { height: `${n.totalHeight}px`, position: "relative" }, children: /* @__PURE__ */ s("div", { style: { transform: `translate3d(0, ${n.offsetY}px, 0)` }, children: o.slice(n.startIndex, n.endIndex).map((e, t) => z(e, n.startIndex + t, !0)) }) }) : /* @__PURE__ */ s("div", { className: "space-y-0.5", children: o.map((e, t) => z(e, t, !1)) })
                    }
                  )
                }
              )
            }
          ),
          document.body
        )
      ]
    }
  );
};
export {
  Pe as A
};
