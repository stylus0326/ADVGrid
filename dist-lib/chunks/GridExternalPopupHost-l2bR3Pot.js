import { jsx as r, jsxs as O } from "react/jsx-runtime";
import d, { Suspense as Q } from "react";
import { A as k } from "./AdvPopover-CVmyHBzb.js";
import { S as N } from "./common-29M8PlVv.js";
const _ = d.lazy(
  () => import("./AdvQuickFilterFlyout-Bk6B78d_.js").then((t) => ({ default: t.AdvQuickFilterFlyout }))
), j = d.lazy(
  () => import("./AdvMultiSortPopup-BXLHdbFY.js").then((t) => ({ default: t.AdvMultiSortPopup }))
), q = d.lazy(
  () => import("./AdvColumnChooserModal-RSu6HIKz.js").then((t) => ({ default: t.AdvColumnChooserModal }))
), w = d.lazy(
  () => import("./AdvGridQueryBuilderModal-U9_6_5hu.js").then((t) => ({ default: t.AdvGridQueryBuilderModal }))
), D = {
  search: "p-2",
  queryBuilder: "p-0",
  columnChooser: "p-3",
  multiSort: "p-3"
}, Y = d.memo(function({
  popup: e,
  onClose: o,
  gridId: n,
  surfaceTheme: l = N.LIGHT,
  quickFilterText: u,
  onQuickFilterChange: m,
  isQuickFilterSmart: s,
  onToggleQuickFilterSmart: p,
  appliedQueryTree: y,
  onApplyQueryTree: c,
  totalFilteredRows: h,
  totalRowCount: a,
  data: A,
  getCellValue: v,
  hasColumnEmptyCells: f,
  getColumnDateBounds: x,
  columns: i,
  columnGroups: P,
  visibleColKeys: S,
  onVisibleColKeysChange: z,
  columnPins: E,
  onColumnPinChange: F,
  onResetColumns: M,
  onAutoFitColumn: b,
  onReorderColumns: G,
  enableColumnHide: g = !0,
  sortRules: B,
  onApplySortRules: L
}) {
  if (!e) return null;
  const C = D[e.type];
  return /* @__PURE__ */ r(
    k,
    {
      isOpen: !0,
      anchorEl: e.anchorEl,
      onClose: o,
      placement: "bottom-end",
      showArrow: !0,
      offset: 10,
      theme: l,
      paddingClassName: C,
      children: /* @__PURE__ */ O(
        Q,
        {
          fallback: /* @__PURE__ */ r("div", { className: "px-4 py-3 text-xs text-[var(--agv-text-muted)]", children: "Đang tải..." }),
          children: [
            e.type === "search" && /* @__PURE__ */ r(
              _,
              {
                embedded: !0,
                quickFilterText: u,
                isQuickFilterSmart: s,
                onToggleSmart: p,
                onCommitFilter: m,
                onClose: o
              }
            ),
            e.type === "queryBuilder" && /* @__PURE__ */ r(
              w,
              {
                embedded: !0,
                isOpen: !0,
                onClose: o,
                gridId: n,
                columns: i,
                appliedTree: y,
                onApply: (H) => c?.(H),
                totalFilteredRows: h ?? a,
                totalRowCount: a,
                surfaceTheme: l,
                data: A,
                getCellValue: v,
                hasColumnEmptyCells: f,
                getColumnDateBounds: x
              }
            ),
            e.type === "columnChooser" && /* @__PURE__ */ r(
              q,
              {
                embedded: !0,
                columns: i,
                columnGroups: P,
                visibleColKeys: S,
                onVisibleColKeysChange: z,
                columnPins: E,
                onColumnPinChange: F,
                onResetColumns: M,
                onAutoFitColumn: b,
                onReorderColumns: G,
                enableColumnHide: g,
                onClose: o,
                surfaceTheme: l
              }
            ),
            e.type === "multiSort" && /* @__PURE__ */ r(
              j,
              {
                embedded: !0,
                isOpen: !0,
                onClose: o,
                anchorPos: null,
                columns: i,
                sortRules: B,
                onApply: L,
                surfaceTheme: l
              }
            )
          ]
        }
      )
    }
  );
});
export {
  Y as GridExternalPopupHost
};
