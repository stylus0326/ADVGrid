import { jsxs as o, jsx as a } from "react/jsx-runtime";
import { memo as g } from "react";
import { A as x } from "./AdvButton-Ck5SixaL.js";
import { A as p } from "./gridFormatUtils-wCKPmlrt.js";
import { c as b, a as u } from "./DataGridEnterprise-CT8bZb68.js";
const y = g(({
  surfaceTheme: f,
  columns: v = [],
  compiledGroups: r,
  showRowNumber: t = !0,
  showSelectionCol: d = !0,
  onOpenSortFilter: s,
  hasActiveFilterOrSort: m = !1,
  sortFilterLabel: l = "Lọc & Sắp Xếp"
}) => {
  const i = r && r.length > 0 ? r : b(v), c = u(
    i,
    t,
    d
  );
  return /* @__PURE__ */ o(
    "div",
    {
      "data-agv-responsive-header": "true",
      style: {
        minHeight: "44px",
        minWidth: c > 0 ? `${c}px` : void 0,
        backgroundColor: "var(--agv-bg-header, var(--agv-bg-root))",
        borderColor: "var(--agv-border)",
        color: "var(--agv-text-main)"
      },
      className: "w-full flex items-center border-b px-3 py-2 text-xs font-semibold select-none shrink-0",
      children: [
        (t || d) && /* @__PURE__ */ a("div", { className: "w-10 shrink-0 text-center mr-2", style: { color: "var(--agv-text-muted)" }, children: t ? "#" : "" }),
        i.map((e, n) => {
          const k = n === 0, h = n === i.length - 1, N = k ? "pr-3" : h ? "pl-3" : "px-3", T = e.align === p.RIGHT ? "justify-end text-right" : e.align === p.CENTER ? "justify-center text-center" : "justify-start text-left", C = e.width ? { width: `${e.width}px` } : { minWidth: `${e.minWidth}px` };
          return /* @__PURE__ */ o(
            "div",
            {
              style: C,
              className: `relative flex items-center gap-2 min-w-0 ${e.width ? "shrink-0" : "flex-1"} ${N} ${h && s ? "justify-between" : T}`,
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
                h && s && /* @__PURE__ */ a(
                  x,
                  {
                    variant: "outline",
                    size: "sm",
                    active: m,
                    onClick: s,
                    className: "font-semibold",
                    children: l
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
y.displayName = "GridTabletHeader";
const j = g(({
  activeMode: f,
  surfaceTheme: v,
  columns: r = [],
  compiledTabletGroups: t,
  showRowNumber: d = !0,
  showSelectionCol: s = !0,
  totalRows: m,
  onOpenSortFilter: l,
  hasActiveFilterOrSort: i = !1,
  sortFilterLabel: c = "Lọc & Sắp Xếp"
}) => {
  if (f === "tablet") {
    const e = t && t.length > 0 ? t : b(r), n = u(
      e,
      d,
      s
    );
    return /* @__PURE__ */ a(
      "div",
      {
        "data-agv-responsive-header": "true",
        className: "sticky top-0 z-30 w-full",
        style: {
          minWidth: n > 0 ? `${n}px` : void 0
        },
        children: /* @__PURE__ */ a(
          y,
          {
            surfaceTheme: v,
            columns: r,
            compiledGroups: e,
            showRowNumber: d,
            showSelectionCol: s,
            onOpenSortFilter: l,
            hasActiveFilterOrSort: i,
            sortFilterLabel: c
          }
        )
      }
    );
  }
  return /* @__PURE__ */ o(
    "div",
    {
      "data-agv-responsive-header": "true",
      className: "sticky top-0 z-30 min-h-[44px] px-3 py-2 border-b flex items-center justify-between gap-2 text-xs font-semibold select-none",
      style: {
        backgroundColor: "var(--agv-bg-header, var(--agv-bg-root))",
        borderColor: "var(--agv-border)",
        color: "var(--agv-text-main)"
      },
      children: [
        /* @__PURE__ */ o("span", { children: [
          "Tổng số: ",
          m.toLocaleString("vi-VN"),
          " dòng"
        ] }),
        l && /* @__PURE__ */ a(
          x,
          {
            variant: "outline",
            size: "sm",
            active: i,
            onClick: l,
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
