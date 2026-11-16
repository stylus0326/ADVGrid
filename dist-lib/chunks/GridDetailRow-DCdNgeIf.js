import { jsx as i } from "react/jsx-runtime";
import { memo as v } from "react";
function w({
  row: r,
  rowIndex: o,
  rowKey: n,
  totalRowWidth: e,
  renderDetailRow: t
}) {
  const a = r, d = typeof a?._detailFixedHeight == "number" && Number.isFinite(a._detailFixedHeight) ? Math.max(28, Math.round(a._detailFixedHeight)) : void 0, g = !!a?._detailUnstyled, l = t ? t(r) : null;
  return /* @__PURE__ */ i(
    "div",
    {
      "data-agv-detail-row": "true",
      "data-agv-detail-fixed": d !== void 0 ? "true" : void 0,
      "data-row-key": String(n),
      "data-row-idx": o,
      style: {
        width: `var(--agv-total-grid-w, ${e}px)`,
        minWidth: `var(--agv-total-grid-w, ${e}px)`,
        ...d !== void 0 ? { height: `${d}px`, minHeight: `${d}px` } : {},
        backgroundColor: "var(--agv-bg-root)"
      },
      className: "agv-detail-row border-b border-[var(--agv-border)] box-border",
      children: /* @__PURE__ */ i(
        "div",
        {
          style: {
            position: "sticky",
            left: 0,
            width: "var(--agv-viewport-w, 100%)",
            maxWidth: `var(--agv-total-grid-w, ${e}px)`
          },
          className: "p-3 box-border",
          children: g ? l : /* @__PURE__ */ i(
            "div",
            {
              className: "rounded-lg border p-3 box-border overflow-hidden",
              style: {
                backgroundColor: "var(--agv-bg-card, var(--agv-bg-row))",
                borderColor: "var(--agv-border)",
                color: "var(--agv-text-main)"
              },
              children: l
            }
          )
        }
      )
    }
  );
}
const c = v(
  w,
  (r, o) => r.row === o.row && r.rowIndex === o.rowIndex && r.rowKey === o.rowKey && r.totalRowWidth === o.totalRowWidth && r.renderDetailRow === o.renderDetailRow
);
export {
  c as GridDetailRow
};
