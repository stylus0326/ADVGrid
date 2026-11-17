import { jsxs as x, jsx as r } from "react/jsx-runtime";
import b, { useState as y, useRef as i, useEffect as p } from "react";
import { N as w } from "./AdvButton-Ck5SixaL.js";
import { S as k } from "./search-Bmmet712.js";
import { X as C } from "./x-CdrDtutQ.js";
const A = b.memo(function({
  quickFilterText: o,
  isQuickFilterSmart: a,
  onToggleSmart: m,
  onCommitFilter: f,
  onClose: g,
  inputRef: h,
  embedded: u = !1
}) {
  const [s, c] = y(o || ""), v = i(null), l = h || v, t = i(null);
  p(() => {
    c(o || "");
  }, [o]), p(() => () => {
    t.current && clearTimeout(t.current);
  }, []);
  const n = (e) => {
    t.current && clearTimeout(t.current), t.current = null, c(e), f(e);
  }, d = (e) => {
    c(e), t.current && clearTimeout(t.current), t.current = setTimeout(() => {
      n(e);
    }, 250);
  };
  return /* @__PURE__ */ x(
    "div",
    {
      "data-agv-popup": "true",
      className: u ? "relative flex w-[280px] max-w-[calc(100vw-48px)] min-h-[28px] h-7 items-center gap-1.5" : "agv-popup-panel absolute left-[calc(100%+8px)] top-1/2 -translate-y-1/2 z-[1210] flex w-[280px] min-h-[32px] items-center gap-1.5 rounded-md border px-1.5 py-0.5 agv-spring-right",
      style: u ? void 0 : {
        backgroundColor: "var(--popup-background)",
        borderColor: "var(--brand, var(--agv-accent))",
        boxShadow: "var(--popup-shadow)"
      },
      onClick: (e) => e.stopPropagation(),
      children: [
        /* @__PURE__ */ r(
          "button",
          {
            type: "button",
            onMouseDown: (e) => e.preventDefault(),
            onClick: () => {
              m(), l.current?.focus();
            },
            className: "flex h-6 w-6 min-h-[24px] min-w-[24px] shrink-0 items-center justify-center rounded transition-colors cursor-pointer",
            style: {
              color: a ? "var(--agv-accent)" : "var(--agv-text-muted)",
              backgroundColor: a ? "color-mix(in srgb, var(--agv-accent) 12%, transparent)" : "transparent"
            },
            "aria-label": a ? "Chế độ tìm kiếm tách từ đang bật" : "Chế độ tìm kiếm nguyên cụm đang bật",
            children: /* @__PURE__ */ r(k, { className: "h-3.5 w-3.5" })
          }
        ),
        /* @__PURE__ */ r(
          "input",
          {
            ref: l,
            type: "text",
            ...w,
            name: "agv_quick_filter_floating",
            autoFocus: !0,
            value: s,
            onChange: (e) => d(e.target.value),
            onKeyDown: (e) => {
              e.key === "Enter" ? n(e.currentTarget.value) : e.key === "Escape" && (n(""), g());
            },
            placeholder: "Tìm kiếm nhanh...",
            className: "h-7 min-h-[28px] flex-1 min-w-0 border-none bg-transparent px-1 text-xs outline-none placeholder:text-[var(--agv-text-muted)]",
            style: { color: "var(--agv-text-main)" }
          }
        ),
        s && /* @__PURE__ */ r(
          "button",
          {
            type: "button",
            onMouseDown: (e) => e.preventDefault(),
            onClick: () => {
              n(""), l.current?.focus();
            },
            className: "agv-inline-clear-ghost flex h-5 w-5 shrink-0 items-center justify-center rounded cursor-pointer",
            children: /* @__PURE__ */ r(C, { className: "h-3 w-3" })
          }
        )
      ]
    }
  );
});
export {
  A as AdvQuickFilterFlyout
};
