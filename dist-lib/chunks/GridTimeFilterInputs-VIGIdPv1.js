import { jsxs as b, jsx as r } from "react/jsx-runtime";
import { useState as S, useEffect as T } from "react";
import { R as $ } from "./FilterIcons-nsUh2HLg.js";
import { N } from "./AdvButton-Ck5SixaL.js";
import { X as I } from "./x-CdrDtutQ.js";
const R = ({ from: n, to: i, onChange: c, onFocus: u, onBlur: d, onClear: g, hasValue: v }) => {
  const [e, o] = S(n), [m, x] = S(i);
  T(() => {
    o(n);
  }, [n]), T(() => {
    x(i);
  }, [i]);
  const a = (t) => {
    const s = t.target.value.replace(/[^0-9:]/g, "").slice(0, 5);
    o(s), c(s, m);
  }, l = (t) => {
    const s = t.target.value.replace(/[^0-9:]/g, "").slice(0, 5);
    x(s), c(e, s);
  }, p = (t, s) => {
    if (!t) return;
    const f = t.match(/^(\d{1,2}):?(\d{0,2})$/);
    if (f) {
      let w = parseInt(f[1], 10);
      w > 23 && (w = 23);
      let y = f[2] ? parseInt(f[2], 10) : 0;
      y > 59 && (y = 59);
      const h = `${String(w).padStart(2, "0")}:${String(y).padStart(2, "0")}`;
      s ? (o(h), c(h, m)) : (x(h), c(e, h));
    }
  };
  return /* @__PURE__ */ b("div", { className: "relative w-full h-full flex items-center gap-1 px-1", children: [
    /* @__PURE__ */ r(
      "input",
      {
        type: "text",
        placeholder: "Từ",
        value: e,
        onChange: a,
        onFocus: u,
        onBlur: () => {
          p(e, !0), d?.();
        },
        ...N,
        className: "w-full h-full flex-1 min-w-0 bg-transparent text-xs font-medium outline-none text-center p-0 placeholder:text-[var(--agv-text-muted)] placeholder:opacity-60",
        style: { color: "var(--agv-text-main)" }
      }
    ),
    /* @__PURE__ */ r($, { className: "mx-0.5" }),
    /* @__PURE__ */ r(
      "input",
      {
        type: "text",
        placeholder: "Đến",
        value: m,
        onChange: l,
        onFocus: u,
        onBlur: () => {
          p(m, !1), d?.();
        },
        ...N,
        className: "w-full h-full flex-1 min-w-0 bg-transparent text-xs font-medium outline-none text-center p-0 placeholder:text-[var(--agv-text-muted)] placeholder:opacity-60",
        style: { color: "var(--agv-text-main)" }
      }
    ),
    v && /* @__PURE__ */ r(
      "button",
      {
        type: "button",
        onClick: g,
        className: "agv-inline-clear-destructive absolute right-0.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5",
        children: /* @__PURE__ */ r(I, { size: 10, strokeWidth: 2.5 })
      }
    )
  ] });
}, j = ({ value: n, onChange: i, onFocus: c, onBlur: u, onClear: d, placeholder: g = "HH:mm", hasValue: v }) => {
  const [e, o] = S(n);
  return T(() => {
    o(n);
  }, [n]), /* @__PURE__ */ b("div", { className: "relative w-full h-full flex items-center px-1", children: [
    /* @__PURE__ */ r(
      "input",
      {
        type: "text",
        placeholder: g,
        value: e,
        onChange: (a) => {
          const l = a.target.value.replace(/[^0-9:]/g, "").slice(0, 5);
          o(l), i(l);
        },
        onFocus: c,
        onBlur: () => {
          if (e) {
            const a = e.match(/^(\d{1,2}):?(\d{0,2})$/);
            if (a) {
              let l = parseInt(a[1], 10);
              l > 23 && (l = 23);
              let p = a[2] ? parseInt(a[2], 10) : 0;
              p > 59 && (p = 59);
              const t = `${String(l).padStart(2, "0")}:${String(p).padStart(2, "0")}`;
              o(t), i(t);
            }
          }
          u?.();
        },
        ...N,
        className: "w-full h-full bg-transparent text-xs font-medium outline-none text-center p-0 placeholder:text-[var(--agv-text-muted)] placeholder:opacity-60",
        style: { color: "var(--agv-text-main)" }
      }
    ),
    v && /* @__PURE__ */ r(
      "button",
      {
        type: "button",
        onClick: d,
        className: "agv-inline-clear-destructive absolute right-0.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5",
        children: /* @__PURE__ */ r(I, { size: 10, strokeWidth: 2.5 })
      }
    )
  ] });
};
export {
  j as TimeFilterInput,
  R as TimeRangeFilterInput
};
