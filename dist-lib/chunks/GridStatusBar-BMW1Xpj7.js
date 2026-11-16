import { jsxs as l, jsx as o } from "react/jsx-runtime";
import y, { useState as F, useEffect as I, useMemo as D, useCallback as x } from "react";
import { A as L } from "./AdvSelect-DRrnhZaQ.js";
import { b as G, a as h, A as b, E as O, N as B } from "./AdvButton-B7j0puyb.js";
import { S as P } from "./common-Bjggt86Z.js";
import { c as C } from "./createLucideIcon-BCMt_G8a.js";
import { C as R } from "./chevron-right-CgsC9jVS.js";
const S = {
  name: "chevron-left",
  size: 24,
  node: [["path", { d: "m15 18-6-6 6-6", key: "1wnfg3" }]]
};
S.node;
const U = C(S), z = y.memo(({
  page: N = 1,
  pageSize: d = h,
  totalItems: u,
  pageSizeOptions: g = G,
  onPageChange: n,
  onPageSizeChange: p,
  surfaceTheme: M = P.LIGHT,
  disabled: m = !1
}) => {
  const s = Number.isFinite(d) && d > 0 ? Math.floor(d) : h, t = Number.isFinite(u) && u > 0 ? Math.floor(u) : 0, i = t > 0 ? Math.max(1, Math.ceil(t / s)) : 0, a = t > 0 ? Math.min(Math.max(1, Math.floor(N || 1)), i) : 0, T = t > 0 ? (a - 1) * s + 1 : 0, E = t > 0 ? Math.min(t, a * s) : 0, [f, c] = F(
    () => t > 0 ? String(a) : "0"
  );
  I(() => {
    c(t > 0 ? String(a) : "0");
  }, [a, t]);
  const _ = D(() => Array.from(
    new Set(
      [...g, s].filter(
        (r) => Number.isFinite(r) && r > 0
      )
    )
  ).map((r) => String(r)), [g, s]), v = x(() => {
    if (!n || t <= 0 || i <= 0) {
      c(t > 0 ? String(a) : "0");
      return;
    }
    const e = Number.parseInt(f.trim(), 10);
    if (!Number.isFinite(e)) {
      c(String(a));
      return;
    }
    const r = Math.min(Math.max(1, e), i);
    c(String(r)), r !== a && n(r);
  }, [n, t, i, f, a]), A = x(
    (e) => {
      const r = Number.parseInt(e, 10);
      Number.isFinite(r) && r > 0 && r !== s && p?.(r);
    },
    [p, s]
  ), w = !m && t > 0 && a > 1 && !!n, k = !m && t > 0 && a < i && !!n;
  return /* @__PURE__ */ l(
    "footer",
    {
      "data-testid": "agv-status-bar",
      className: "border-t px-3 py-2 text-xs flex flex-wrap items-center justify-between gap-2 shrink-0 select-none transition-colors",
      style: {
        backgroundColor: "var(--agv-bg-header)",
        borderColor: "var(--agv-border)",
        color: "var(--agv-text-muted)"
      },
      children: [
        /* @__PURE__ */ l("div", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ o(
            L,
            {
              value: String(s),
              options: _,
              onChange: A,
              size: "sm",
              width: 72,
              theme: M,
              disabled: m || !p
            }
          ),
          /* @__PURE__ */ o(
            b,
            {
              variant: "ghost",
              size: "icon-sm",
              "data-testid": "agv-pager-prev",
              "aria-label": "Trang trước",
              disabled: !w,
              onClick: () => n?.(Math.max(1, a - 1)),
              children: /* @__PURE__ */ o(U, { size: 15, strokeWidth: 2 })
            }
          ),
          /* @__PURE__ */ o(
            "input",
            {
              type: "text",
              inputMode: "numeric",
              "data-testid": "agv-pager-input",
              "aria-label": "Số trang",
              value: f,
              disabled: m || t <= 0,
              onChange: (e) => c(e.target.value.replace(/\D+/g, "")),
              onFocus: (e) => e.currentTarget.select(),
              onBlur: v,
              onKeyDown: (e) => {
                e.key === "Enter" ? (e.preventDefault(), v(), e.currentTarget.blur()) : e.key === "Escape" && (e.preventDefault(), c(t > 0 ? String(a) : "0"), e.currentTarget.blur());
              },
              ...B,
              className: `${O} w-11 px-1 text-center font-medium tabular-nums`
            }
          ),
          /* @__PURE__ */ l(
            "span",
            {
              "data-testid": "agv-pager-total-pages",
              className: "text-xs font-semibold tabular-nums text-[var(--agv-text-main)] whitespace-nowrap px-1",
              children: [
                "/ ",
                i
              ]
            }
          ),
          /* @__PURE__ */ o(
            b,
            {
              variant: "ghost",
              size: "icon-sm",
              "data-testid": "agv-pager-next",
              "aria-label": "Trang sau",
              disabled: !k,
              onClick: () => n?.(Math.min(i, a + 1)),
              children: /* @__PURE__ */ o(R, { size: 15, strokeWidth: 2 })
            }
          )
        ] }),
        /* @__PURE__ */ l(
          "div",
          {
            "data-testid": "agv-pager-range",
            className: "text-xs tabular-nums whitespace-nowrap text-[var(--agv-text-muted)]",
            children: [
              t > 0 ? `${T}-${E} / ` : "0 / ",
              /* @__PURE__ */ o("strong", { className: "font-semibold text-[var(--agv-accent)]", children: t })
            ]
          }
        )
      ]
    }
  );
});
z.displayName = "GridStatusBar";
export {
  z as GridStatusBar
};
