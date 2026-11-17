import { jsx as i, jsxs as w } from "react/jsx-runtime";
import { memo as Z, Suspense as ee, lazy as te } from "react";
import { D as C, P as v, C as b, g as re, r as oe } from "./gridFormatUtils-wCKPmlrt.js";
import { e as P, f as ie, h as ne } from "./AdvButton-Ck5SixaL.js";
const ae = te(
  () => import("./GridMorphPrimitives-C4lfAub2.js").then((t) => ({ default: t.RowGroupChevronMorphIcon }))
);
function E({
  row: t,
  rowIndex: m,
  columns: n,
  colWidths: h,
  rowHeight: u,
  totalRowWidth: L,
  surfaceTheme: se,
  columnPins: S,
  leftOffsets: D,
  rightOffsets: I,
  lastEffectiveLeftColKey: z,
  firstEffectiveRightColKey: G,
  centerDockStatus: W,
  centerLeftOffsets: _,
  centerRightOffsets: B,
  onGroupContextMenu: N
}) {
  const d = ne(), M = !!t.isCollapsed, l = n[0], p = !!(l && (l.isRowNumber || l.dataType === C.SYSTEM && l.title)), y = l?.key || "", g = p && y ? h[y] || l?.defaultWidth || 44 : 0, f = n.filter(
    (e) => S[e.key] === v.LEFT || e.dataType === C.SYSTEM || e.isRowNumber || e.isSelection
  ), x = f.reduce(
    (e, r) => e + (h[r.key] || r.defaultWidth),
    0
  ), o = p ? 1 : 0;
  let s = 1, a = p ? x - g : x;
  if (a <= 0 || f.length <= o) {
    a = h[n[o]?.key] || n[o]?.defaultWidth || 180;
    let e = a;
    for (s = 1; o + s < n.length; ) {
      const r = n[o + s];
      if (t.groupSums?.[r.key] !== void 0 || r.dataType === C.NUMBER || e >= 220)
        break;
      e += h[r.key] || r.defaultWidth, s++;
    }
    a = e;
  } else
    s = f.length - o;
  const A = `group_${t.groupColumnKey || ""}_${t.groupValue ?? t.path ?? m}`;
  return /* @__PURE__ */ i(
    "div",
    {
      "data-row-key": A,
      "data-row-idx": m,
      onClick: (e) => {
        e.stopPropagation(), t.onToggleCollapse?.(t.path);
      },
      onContextMenu: N ? (e) => {
        e.preventDefault(), e.stopPropagation(), N(t, e);
      } : void 0,
      style: {
        height: `${u}px`,
        width: `${L}px`,
        borderColor: "var(--agv-border)",
        animationDelay: `${m % 20 * 4}ms`
      },
      className: "agv-group-row agv-row-enter flex items-center cursor-pointer select-none box-border min-h-[32px] max-h-[32px] font-semibold text-xs border-b border-[var(--agv-border)]",
      children: n.map((e, r) => {
        if (p && (e.key === y || r === 0)) {
          const c = x > 0;
          return /* @__PURE__ */ i(
            "div",
            {
              style: {
                position: c ? "sticky" : void 0,
                left: 0,
                zIndex: c ? 23 : void 0,
                width: `${g}px`,
                minWidth: `${g}px`,
                maxWidth: `${g}px`,
                height: `${u}px`,
                boxSizing: "border-box",
                backgroundColor: "var(--agv-group-row-bg, var(--agv-bg-card, var(--agv-bg-root)))"
              },
              className: `flex items-center justify-center font-bold text-xs shrink-0 select-none ${d.borderBottom} ${d.borderRight}`,
              children: /* @__PURE__ */ w("span", { style: { color: "var(--agv-text-muted)" }, children: [
                "[",
                t.groupIndexStr || t.groupIndex || 1,
                "]"
              ] })
            },
            "group_stt_cell"
          );
        }
        if (r > o && r < o + s)
          return null;
        if (r === o) {
          const c = x > 0, J = a + (p ? g : 0) === x, q = p ? g : 0, Q = n.slice(o, o + s).map((X) => X.key).join(",");
          return /* @__PURE__ */ w(
            "div",
            {
              "data-group-span-keys": Q,
              style: {
                position: c ? "sticky" : void 0,
                left: c ? `${q}px` : void 0,
                zIndex: c ? 22 : void 0,
                width: `${a}px`,
                minWidth: `${a}px`,
                maxWidth: `${a}px`,
                height: `${u}px`,
                boxSizing: "border-box",
                backgroundColor: "var(--agv-group-row-bg, var(--agv-bg-card, var(--agv-bg-root)))"
              },
              className: `flex items-center px-3 gap-2 truncate shrink-0 ${d.borderBottom} ${J ? P() : d.borderRight}`,
              children: [
                /* @__PURE__ */ i("span", { className: "w-4 h-4 flex items-center justify-center shrink-0 select-none rounded transition-colors hover:bg-[var(--agv-bg-item-hover)] text-[var(--agv-accent)]", children: /* @__PURE__ */ i(ee, { fallback: null, children: /* @__PURE__ */ i(ae, { expanded: !M }) }) }),
                /* @__PURE__ */ i("span", { className: "truncate font-bold text-[var(--agv-accent)]", children: t.groupValue || "(Trống)" }),
                /* @__PURE__ */ i("span", { className: "text-xs font-normal px-2 py-0.5 rounded-full border shrink-0 bg-[var(--agv-bg-root)] border-[var(--agv-border)] text-[var(--agv-text-muted)]", children: t.count.toLocaleString("vi-VN") })
              ]
            },
            "group_title_cell"
          );
        }
        const k = h[e.key] || e.defaultWidth, $ = S[e.key] || v.NONE, O = $ === v.LEFT, j = $ === v.RIGHT, R = $ === v.CENTER ? W[e.key] || b.NORMAL : b.NORMAL, K = R === b.LEFT, F = R === b.RIGHT, V = e.key === z, Y = e.key === G, H = {
          width: `${k}px`,
          minWidth: `${k}px`,
          maxWidth: `${k}px`,
          height: `${u}px`,
          boxSizing: "border-box",
          ...O ? { position: "sticky", left: `${D[e.key]}px`, zIndex: 20 } : K ? { position: "sticky", left: `${_[e.key]}px`, zIndex: 20 } : j ? { position: "sticky", right: `${I[e.key]}px`, zIndex: 20 } : F ? { position: "sticky", right: `${B[e.key]}px`, zIndex: 20 } : {}
        }, U = `${d.borderBottom} ${V ? P() : d.borderRight} ${Y ? ie() : ""}`, T = t.groupSums?.[e.key];
        return /* @__PURE__ */ i(
          "div",
          {
            "data-col-key": e.key,
            style: {
              ...H,
              backgroundColor: "var(--agv-group-row-bg, var(--agv-bg-card, var(--agv-bg-root)))"
            },
            className: `flex items-center px-2.5 text-xs tabular-nums shrink-0 truncate ${U} ${oe(
              e.align
            )}`,
            children: T !== void 0 ? /* @__PURE__ */ i("span", { className: "font-semibold tabular-nums", style: { color: "var(--agv-text-main)" }, children: re(T) }) : null
          },
          e.key
        );
      })
    }
  );
}
E.displayName = "GridGroupHeaderRow";
const he = Z(E);
export {
  he as GridGroupHeaderRow
};
