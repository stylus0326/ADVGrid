import { jsxs as o, jsx as a } from "react/jsx-runtime";
import { memo as x } from "react";
import { A as g } from "./AdvButton-Ck5SixaL.js";
import { A as p } from "./gridFormatUtils-wCKPmlrt.js";
import { c as b, a as y } from "./DataGridEnterprise-DyOy-gAv.js";
const u = x(({
  surfaceTheme: h,
  columns: m = [],
  compiledGroups: s,
  showRowNumber: t = !0,
  showSelectionCol: l = !0,
  onOpenSortFilter: i,
  hasActiveFilterOrSort: v = !1,
  sortFilterLabel: d = "Lọc & Sắp Xếp"
}) => {
  const r = s && s.length > 0 ? s : b(m), c = y(
    r,
    t,
    l
  );
  return /* @__PURE__ */ o(
    "div",
    {
      style: {
        minHeight: "44px",
        minWidth: c > 0 ? `${c}px` : void 0,
        backgroundColor: "var(--agv-bg-header, var(--agv-bg-root))",
        borderColor: "var(--agv-border)",
        color: "var(--agv-text-main)"
      },
      className: "w-full flex items-center border-b px-3 py-2 text-xs font-semibold select-none shrink-0",
      children: [
        (t || l) && /* @__PURE__ */ a("div", { className: "w-10 shrink-0 text-center mr-2", style: { color: "var(--agv-text-muted)" }, children: t ? "#" : "" }),
        r.map((e, n) => {
          const k = n === 0, f = n === r.length - 1, N = k ? "pr-3" : f ? "pl-3" : "px-3", T = e.align === p.RIGHT ? "justify-end text-right" : e.align === p.CENTER ? "justify-center text-center" : "justify-start text-left", C = e.width ? { width: `${e.width}px` } : { minWidth: `${e.minWidth}px` };
          return /* @__PURE__ */ o(
            "div",
            {
              style: C,
              className: `relative flex items-center gap-2 min-w-0 ${e.width ? "shrink-0" : "flex-1"} ${N} ${f && i ? "justify-between" : T}`,
              children: [
                n > 0 && /* @__PURE__ */ a(
                  "span",
                  {
                    "aria-hidden": "true",
                    className: "pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 w-px h-4",
                    style: { backgroundColor: "var(--agv-border)" }
                  }
                ),
                /* @__PURE__ */ a("span", { className: "truncate", children: e.header }),
                f && i && /* @__PURE__ */ a(
                  g,
                  {
                    variant: "outline",
                    size: "sm",
                    active: v,
                    onClick: i,
                    className: "font-semibold",
                    children: d
                  }
                )
              ]
            },
            e.id
          );
        })
      ]
    }
  );
});
u.displayName = "GridTabletHeader";
const j = x(({
  activeMode: h,
  surfaceTheme: m,
  columns: s = [],
  compiledTabletGroups: t,
  showRowNumber: l = !0,
  showSelectionCol: i = !0,
  totalRows: v,
  onOpenSortFilter: d,
  hasActiveFilterOrSort: r = !1,
  sortFilterLabel: c = "Lọc & Sắp Xếp"
}) => {
  if (h === "tablet") {
    const e = t && t.length > 0 ? t : b(s), n = y(
      e,
      l,
      i
    );
    return /* @__PURE__ */ a(
      "div",
      {
        className: "sticky top-0 z-30 w-full",
        style: {
          minWidth: n > 0 ? `${n}px` : void 0
        },
        children: /* @__PURE__ */ a(
          u,
          {
            surfaceTheme: m,
            columns: s,
            compiledGroups: e,
            showRowNumber: l,
            showSelectionCol: i,
            onOpenSortFilter: d,
            hasActiveFilterOrSort: r,
            sortFilterLabel: c
          }
        )
      }
    );
  }
  return /* @__PURE__ */ o(
    "div",
    {
      className: "sticky top-0 z-30 min-h-[44px] px-3 py-2 border-b flex items-center justify-between gap-2 text-xs font-semibold select-none",
      style: {
        backgroundColor: "var(--agv-bg-header, var(--agv-bg-root))",
        borderColor: "var(--agv-border)",
        color: "var(--agv-text-main)"
      },
      children: [
        /* @__PURE__ */ o("span", { children: [
          "Tổng số: ",
          v.toLocaleString("vi-VN"),
          " dòng"
        ] }),
        d && /* @__PURE__ */ a(
          g,
          {
            variant: "outline",
            size: "sm",
            active: r,
            onClick: d,
            className: "font-semibold",
            children: c
          }
        )
      ]
    }
  );
});
j.displayName = "GridResponsiveHeader";
export {
  j as GridResponsiveHeader
};
