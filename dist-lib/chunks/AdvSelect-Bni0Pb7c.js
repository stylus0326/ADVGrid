import { jsxs as D, jsx as s } from "react/jsx-runtime";
import { useState as m, useRef as h, useCallback as u, useMemo as j, useLayoutEffect as pe } from "react";
import { createPortal as fe } from "react-dom";
import { c as me, a as he, u as ge, s as ve, b as xe, d as ye, g as we } from "./enterpriseEditorUtils-DJeTtQuh.js";
import { i as be, P as Ce, g as ke } from "./AdvButton-Ck5SixaL.js";
import { A as Se } from "./AdvOverlayScroll-CipuwW1l.js";
import { u as $e } from "./useVirtualList-CH5KMFFG.js";
import { g as Ie, S as Ne } from "./common-29M8PlVv.js";
import { C as Ee } from "./chevron-down-CoESPSbY.js";
import { C as De } from "./check-KNrOhvEC.js";
const F = 30, q = 240, Le = ({
  id: G,
  value: k,
  defaultValue: W = "",
  onChange: H,
  options: R = [],
  placeholder: B = "Chọn một mục...",
  disabled: p = !1,
  className: X = "",
  style: Y = {},
  theme: A = Ne.LIGHT,
  size: J = "sm",
  variant: P = "default",
  leadingIcon: V,
  width: Q = "100%",
  invalid: Z,
  "aria-invalid": ee,
  "aria-describedby": te,
  "aria-errormessage": re
}) => {
  const ne = !!(Z || ee), g = k !== void 0, [oe, se] = m(g ? k : W), v = g ? k : oe, [o, M] = m(!1), [i, S] = m(-1), [ae, ie] = m(!1), f = h(null), T = h(null), x = h(null), y = h("init"), $ = h(!1), l = u((e) => {
    $.current !== e && ($.current = e, ie(e));
  }, []), [a, le] = m(null), r = j(() => R.map((e) => typeof e == "string" ? { value: e, label: e } : e), [R]), I = j(() => {
    const e = /* @__PURE__ */ new Map();
    for (let t = 0; t < r.length; t++) {
      const d = r[t].value;
      e.has(d) || e.set(d, t);
    }
    return e;
  }, [r]), O = I.get(v) ?? -1, N = O >= 0 ? r[O] : void 0, E = u(() => {
    if (!f.current) return;
    const e = me(f.current, 240, 140);
    le((t) => he(t, e) ? t : e);
  }, []), w = u((e = !1) => {
    if (p) return;
    E(), y.current = e ? "keyboard" : "init", l(e), M(!0);
    const t = I.get(v) ?? -1;
    S(t >= 0 ? t : 0);
  }, [p, E, I, v, l]), c = u(() => {
    M(!1), l(!1), S(-1);
  }, [l]), ce = u(() => {
    o ? c() : w(!1);
  }, [o, c, w]), z = a ? Math.min(q - 2, Math.max(118, a.maxHeight - 2)) : q - 2, n = $e({
    itemCount: r.length,
    itemHeight: F,
    viewportRef: x,
    overscan: 6,
    threshold: 40,
    enabled: o,
    defaultViewportHeight: z
  });
  ge(o, c, E, f, T), pe(() => {
    if (!o || y.current === "pointer") return;
    if (n.isVirtualized) {
      n.scrollToIndex(i, 4, 4);
      return;
    }
    const e = x.current;
    if (!e) return;
    const t = e.querySelector(`[data-select-idx="${i}"]`);
    t && ve(e, t, 4, 4);
  }, [o, i, r.length, n.isVirtualized, n.scrollToIndex]);
  const U = u(
    (e) => {
      g || se(e), H?.(e), c(), f.current?.focus();
    },
    [g, H, c]
  ), de = (e) => {
    if (!p)
      if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "PageDown" || e.key === "PageUp" || e.key === "Home" || e.key === "End") {
        if (e.preventDefault(), !o)
          (e.key === "ArrowDown" || e.key === "ArrowUp") && w(!0);
        else if (r.length > 0) {
          const t = x.current, d = t?.querySelector("[data-select-idx]"), b = xe(
            t?.clientHeight || 232,
            n.isVirtualized ? F : d?.offsetHeight || 28,
            6
          );
          y.current = "keyboard", l(!0), S((C) => {
            const K = ye(e.key, C, r.length, b);
            return K !== null ? K : C;
          });
        }
      } else if (e.key === "Enter" || e.key === " ") {
        if (e.preventDefault(), !o)
          w(!0);
        else if (i >= 0 && r[i]) {
          const t = r[i];
          t.disabled || U(t.value);
        }
      } else e.key === "Escape" && (e.preventDefault(), c());
  }, L = (e, t, d) => {
    const b = e.value === v, C = ae && t === i;
    return /* @__PURE__ */ D(
      "button",
      {
        type: "button",
        "data-select-idx": t,
        disabled: e.disabled,
        onClick: () => !e.disabled && U(e.value),
        className: `agv-popup-item justify-between ${d ? "h-[28px] min-h-[28px] mb-[2px]" : ""} ${b ? "is-selected" : C ? "is-highlighted" : ""}`.trim(),
        children: [
          /* @__PURE__ */ s("span", { className: "truncate", children: e.label }),
          b && /* @__PURE__ */ s(
            De,
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
  }, ue = we(), _ = Ie(A);
  return /* @__PURE__ */ D(
    "div",
    {
      "data-theme": A || void 0,
      className: `relative inline-block select-none ${_} ${X}`.trim(),
      style: { width: Q, ...Y },
      children: [
        /* @__PURE__ */ D(
          "button",
          {
            ref: f,
            id: G,
            type: "button",
            disabled: p,
            "data-agv-trigger": "true",
            "data-state": o ? "open" : "closed",
            "aria-expanded": o,
            "aria-invalid": ne || void 0,
            "aria-describedby": te,
            "aria-errormessage": re,
            onClick: ce,
            onKeyDown: de,
            className: be({
              size: J,
              variant: P,
              defaultRadiusClass: ke(),
              className: `w-full flex items-center justify-between gap-2 ${P === "auth" ? "px-3" : "px-2.5"} font-normal cursor-pointer outline-none ${N ? "text-foreground" : "text-muted-foreground"} ${p ? "opacity-50 cursor-not-allowed" : ""}`.trim()
            }),
            children: [
              V ? /* @__PURE__ */ s(
                "span",
                {
                  "aria-hidden": "true",
                  className: "shrink-0 inline-flex items-center text-[var(--agv-text-muted)]",
                  children: V
                }
              ) : null,
              /* @__PURE__ */ s("span", { className: "truncate text-left flex-1", children: N ? N.label : B }),
              /* @__PURE__ */ s(
                Ee,
                {
                  size: 14,
                  strokeWidth: 2,
                  className: `shrink-0 transition-transform duration-150 ${o ? "rotate-180 text-brand" : "text-muted-foreground"}`
                }
              )
            ]
          }
        ),
        o && a && typeof document < "u" && fe(
          /* @__PURE__ */ s(
            "div",
            {
              className: `fixed inset-0 pointer-events-none z-[999999] ${_}`,
              style: ue,
              children: /* @__PURE__ */ s(
                "div",
                {
                  ref: T,
                  "data-agv-popup": "true",
                  onMouseMove: () => {
                    $.current && (y.current = "pointer", l(!1));
                  },
                  onMouseDown: (e) => e.stopPropagation(),
                  onClick: (e) => e.stopPropagation(),
                  className: `agv-select-portal agv-portal-dropdown pointer-events-auto absolute ${Ce} overflow-hidden select-none ${a.isFlipUp ? "agv-spring-up" : "agv-spring-down"}`,
                  style: {
                    top: a.isFlipUp ? void 0 : `${a.top}px`,
                    bottom: a.isFlipUp ? `${a.bottom}px` : void 0,
                    left: `${a.left}px`,
                    width: `${a.width}px`
                  },
                  children: /* @__PURE__ */ s(
                    Se,
                    {
                      viewportRef: x,
                      onScroll: n.handleScroll,
                      viewportClassName: "overflow-y-auto overflow-x-hidden p-1",
                      viewportStyle: { maxHeight: `${z}px` },
                      contentSignature: `${r.length}:${n.startIndex}:${n.endIndex}`,
                      children: r.length === 0 ? /* @__PURE__ */ s("div", { className: "px-2.5 py-1.5 text-xs text-muted-foreground text-center", children: "Không có tùy chọn" }) : n.isVirtualized ? /* @__PURE__ */ s("div", { style: { height: `${n.totalHeight}px`, position: "relative" }, children: /* @__PURE__ */ s("div", { style: { transform: `translate3d(0, ${n.offsetY}px, 0)` }, children: r.slice(n.startIndex, n.endIndex).map((e, t) => L(e, n.startIndex + t, !0)) }) }) : /* @__PURE__ */ s("div", { className: "space-y-0.5", children: r.map((e, t) => L(e, t, !1)) })
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
  Le as A
};
