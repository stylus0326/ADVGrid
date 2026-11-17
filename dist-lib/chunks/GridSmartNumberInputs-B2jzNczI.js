import { jsxs as I, jsx as d } from "react/jsx-runtime";
import { useState as w, useEffect as T } from "react";
import { b as E } from "./gridFormatUtils-wCKPmlrt.js";
import { R as W } from "./FilterIcons-nsUh2HLg.js";
import { N as S } from "./AdvButton-Ck5SixaL.js";
import { X as K } from "./x-CdrDtutQ.js";
let l = null, N = null;
function i() {
  return l ? Promise.resolve(l) : (N || (N = import("./smartNumberUtils-CUYJXloj.js").then((e) => (l = e, e))), N);
}
const k = [
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
];
function D(e) {
  if (l) {
    l.handleNumericKeyDown(e);
    return;
  }
  i(), !(e.ctrlKey || e.metaKey || e.altKey) && (k.includes(e.key) || /^[0-9/,\-. ;kmtrby()~]$/i.test(e.key) || e.preventDefault());
}
const _ = ({ from: e, to: n, onChange: u, onFocus: v, onBlur: x, onClear: b, hasValue: h }) => {
  const [p, c] = w(e), [s, m] = w(n);
  T(() => {
    c(e);
  }, [e]), T(() => {
    m(n);
  }, [n]);
  const f = (o, r) => {
    if (l) {
      const t = l.formatSmartInputText(o);
      r ? (c(t), u(t, s)) : (m(t), u(p, t));
      return;
    }
    r ? (c(o), u(o, s)) : (m(o), u(p, o)), i().then((t) => {
      const a = t.formatSmartInputText(o);
      a !== o && (r ? (c(a), u(a, s)) : (m(a), u(p, a)));
    });
  };
  return /* @__PURE__ */ I("div", { className: "relative w-full h-full flex items-center gap-1 px-1", children: [
    /* @__PURE__ */ d(
      "input",
      {
        type: "text",
        placeholder: "Từ",
        value: p,
        onChange: (o) => f(o.target.value, !0),
        onKeyDown: D,
        onMouseEnter: () => void i(),
        onFocus: () => {
          i(), v?.();
        },
        onBlur: () => {
          f(p, !0), x?.();
        },
        ...S,
        className: "w-full h-full flex-1 min-w-0 bg-transparent text-xs font-medium outline-none text-center p-0 placeholder:text-[var(--agv-text-muted)] placeholder:opacity-60 tabular-nums",
        style: { color: "var(--agv-text-main)" }
      }
    ),
    /* @__PURE__ */ d(W, { className: "mx-0.5" }),
    /* @__PURE__ */ d(
      "input",
      {
        type: "text",
        placeholder: "Đến",
        value: s,
        onChange: (o) => f(o.target.value, !1),
        onKeyDown: D,
        onMouseEnter: () => void i(),
        onFocus: () => {
          i(), v?.();
        },
        onBlur: () => {
          f(s, !1), x?.();
        },
        ...S,
        className: "w-full h-full flex-1 min-w-0 bg-transparent text-xs font-medium outline-none text-center p-0 placeholder:text-[var(--agv-text-muted)] placeholder:opacity-60 tabular-nums",
        style: { color: "var(--agv-text-main)" }
      }
    ),
    h && /* @__PURE__ */ d(
      "button",
      {
        type: "button",
        onClick: b,
        className: "agv-inline-clear-destructive absolute right-0.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5",
        children: /* @__PURE__ */ d(K, { size: 10, strokeWidth: 2.5 })
      }
    )
  ] });
}, O = ({ value: e, onChange: n, onFocus: u, onBlur: v, onClear: x, placeholder: b, hasValue: h, isHighlightPlaceholder: p }) => {
  const [c, s] = w(e || "");
  T(() => {
    s(e || "");
  }, [e]);
  const m = (r, t) => {
    const a = t.formatSmartInputText(r);
    s(a);
    const y = a.trim(), g = t.parseSmartNumericRange(a);
    if (g && g.from && g.to) {
      n(g.formatted, E.BETWEEN);
      return;
    }
    if (y.length > 1 && (y.endsWith("-") || y.endsWith("/") || y.endsWith(".."))) {
      n(a, E.BETWEEN);
      return;
    }
    n(a);
  };
  return /* @__PURE__ */ I("div", { className: "relative w-full h-full flex items-center min-w-0", children: [
    /* @__PURE__ */ d(
      "input",
      {
        type: "text",
        value: c,
        onMouseEnter: () => void i(),
        onFocus: () => {
          i(), u?.();
        },
        onBlur: () => {
          if (l) {
            const r = l.formatSmartInputText(c);
            s(r);
            const t = l.parseSmartNumericRange(r);
            t && t.from && t.to ? n(t.formatted, E.BETWEEN) : n(r);
          } else
            i().then((r) => m(c, r));
          v?.();
        },
        onChange: (r) => {
          const t = r.target.value;
          if (l) {
            m(t, l);
            return;
          }
          s(t), n(t), i().then((a) => m(t, a));
        },
        onKeyDown: D,
        placeholder: b,
        ...S,
        className: `w-full h-full bg-transparent px-1 text-xs outline-none border-none tabular-nums disabled:cursor-not-allowed ${p ? "placeholder:text-[var(--agv-accent)] placeholder:opacity-100 placeholder:font-semibold" : "placeholder:text-[var(--agv-text-muted)] placeholder:opacity-60"} ${h ? "pr-5" : "pr-1"}`,
        style: {
          color: "var(--agv-text-main)"
        }
      }
    ),
    h && /* @__PURE__ */ d(
      "button",
      {
        type: "button",
        onClick: x,
        className: "agv-inline-clear-destructive absolute right-1 top-1/2 -translate-y-1/2 w-4 h-4",
        children: /* @__PURE__ */ d(K, { size: 10, strokeWidth: 2.5 })
      }
    )
  ] });
};
export {
  _ as NumberRangeFilterInput,
  O as SmartNumberFilterInput
};
