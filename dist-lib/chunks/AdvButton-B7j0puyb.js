import { jsx as h } from "react/jsx-runtime";
import C from "react";
const N = 20, A = 32, B = 20, R = [20, 50, 100, 200], U = {
  autoComplete: "off",
  autoCorrect: "off",
  autoCapitalize: "off",
  spellCheck: !1,
  "aria-autocomplete": "none",
  "data-lpignore": "true",
  "data-form-type": "other",
  "data-1p-ignore": "true",
  "data-bwignore": "true"
}, E = [
  ".agv-calendar-popover",
  ".agv-preset-dropdown-menu",
  ".agv-portal-dropdown",
  ".agv-comboboxedit-dropdown",
  ".agv-searchlookupedit-dropdown",
  ".agv-lookup-op-menu",
  ".agv-context-menu",
  ".agv-modal-portal",
  ".agv-drawer-portal",
  ".agv-filter-dropdown-menu",
  ".agv-column-chooser",
  ".agv-query-builder-modal",
  ".agv-multi-sort-popup",
  '[data-agv-popup="true"]'
].join(", "), T = "rounded-md", w = () => T, P = (o) => "border-r-2 border-r-[var(--agv-border)]", I = (o) => "border-l-2 border-l-[var(--agv-border)]", M = (o) => ({
  viewportBg: "bg-[var(--agv-bg-root)]",
  headerBg: "bg-[var(--agv-bg-header)] text-[var(--agv-text-header)]",
  headerBorderBottom: "border-b border-b-[var(--agv-border)]",
  systemBorderBottom: "border-b-2 border-b-[var(--agv-border)]",
  filterBorderBottom: "border-b-2 border-b-[var(--agv-border)]",
  headerBorderRight: "border-r border-r-[var(--agv-border)]",
  headerHoverBg: "hover:bg-[var(--agv-bg-hover)]",
  tier1Bg: "bg-[var(--agv-bg-header)] text-[var(--agv-text-header)]",
  tier1Border: "border-r-[var(--agv-border)] border-b-[var(--agv-border)]",
  chunkBg: "bg-[var(--agv-bg-root)]",
  borderBottom: "border-b border-b-[var(--agv-border)]",
  borderRight: "border-r border-r-[var(--agv-border)]",
  defaultTextColor: "text-[var(--agv-text-main)]",
  rowSelectedBg: "bg-[var(--agv-row-data-bg,var(--agv-bg-selected))]",
  rowEvenBg: "bg-[var(--agv-row-data-bg,var(--agv-bg-row))]",
  rowOddBg: "bg-[var(--agv-row-data-bg,var(--agv-bg-row-alt))]",
  rowHoverBg: "",
  sharedHeaderCellBg: "bg-[var(--agv-row-sticky-bg,var(--agv-bg-header))]",
  sharedHeaderCellSelectedBg: "bg-[var(--agv-row-sticky-bg,var(--agv-bg-selected))]",
  sharedHeaderCellHoverBg: "",
  contextMenuBg: "bg-[var(--agv-bg-popup)] text-[var(--agv-text-main)] border-[var(--agv-border-popup)] shadow-xl",
  contextMenuBtnBg: "bg-[var(--agv-btn-default-bg)] hover:bg-[var(--agv-btn-default-hover)] text-[var(--agv-btn-default-text)] border-[var(--agv-btn-default-border)]"
}), D = "outline-none", H = "", k = "", m = "agv-focus-ring", b = "agv-control", p = "agv-control agv-control-box", n = {
  sm: "h-7 min-h-[28px] text-xs",
  md: "h-control min-h-[28px] text-sm"
}, z = (o = "sm") => n[o], F = `${b} ${n.md} px-2.5 py-1 placeholder:text-muted-foreground`, $ = `${b} ${n.sm} px-2 placeholder:text-muted-foreground`, G = `${p} ${n.md} px-2.5`, y = `${p} ${n.sm} px-2`, V = `${b} p-2 text-xs placeholder:text-muted-foreground`, f = {
  default: "agv-btn agv-btn-default",
  outline: `agv-btn agv-btn-outline ${b}`,
  ghost: "agv-btn agv-btn-ghost",
  destructive: "agv-btn agv-btn-destructive"
};
function e({
  variant: o = "default",
  size: a = "default",
  active: d = !1,
  className: r = ""
} = {}) {
  const u = a === "icon" || a === "icon-sm", s = /(?:^|\s)!?h-/.test(r), g = /(?:^|\s)!?w-/.test(r), v = /\b!?p(?:x|l|r)?-/.test(r), l = /\b!?font-(?:thin|extralight|light|normal|medium|semibold|bold|extrabold|black)\b/.test(r), i = /\b!?text-(?:xs|sm|base|lg|xl|\[)/.test(r), t = [];
  a === "sm" ? (s || t.push("h-7"), t.push("min-h-[28px]"), v || t.push("px-3"), t.push("gap-1 leading-4"), i || t.push("text-xs")) : a === "default" || a === "md" ? (s || t.push("h-control"), t.push("min-h-[28px]"), v || t.push("px-4"), t.push("gap-2"), i || t.push("text-sm")) : a === "icon-sm" ? (s || t.push("h-7"), g || t.push("w-7"), t.push("min-h-[28px] min-w-[28px] shrink-0"), v || t.push("p-0"), i || t.push("text-xs")) : a === "icon" && (s || t.push("h-9"), g || t.push("w-9"), t.push("min-h-[36px] min-w-[36px] shrink-0"), v || t.push("p-0"), i || t.push("text-sm"));
  const c = u || l ? "" : o === "default" && a === "sm" ? "font-semibold" : "font-medium", O = o === "default" ? "shadow-sm" : "", S = d ? "is-active" : "";
  return [
    f[o],
    ...t,
    c,
    O,
    S,
    m,
    r
  ].filter(Boolean).join(" ");
}
const j = e, X = e({
  variant: "outline",
  size: "default"
}), Z = e({
  variant: "outline",
  size: "sm"
}), q = e({
  variant: "outline",
  size: "icon-sm"
}), K = e({
  variant: "default",
  size: "default"
}), W = e({
  variant: "default",
  size: "sm"
}), Y = e({
  variant: "ghost",
  size: "default"
}), J = e({
  variant: "ghost",
  size: "sm"
}), Q = e({
  variant: "ghost",
  size: "icon-sm"
}), tt = e({
  variant: "destructive",
  size: "default"
}), et = e({
  variant: "destructive",
  size: "sm"
}), ot = e({
  variant: "destructive",
  size: "icon-sm"
}), at = "agv-popup-panel rounded-md border border-border bg-popover text-popover-foreground", rt = "agv-popup-panel agv-popup-menu rounded-md border border-border bg-popover text-popover-foreground", st = "agv-popup-item", _ = C.forwardRef(
  ({
    variant: o = "default",
    size: a = "default",
    active: d = !1,
    type: r = "button",
    className: u = "",
    ...s
  }, g) => /* @__PURE__ */ h(
    "button",
    {
      ref: g,
      type: r,
      "data-variant": o,
      "data-size": a,
      "data-active": d ? "true" : void 0,
      className: e({ variant: o, size: a, active: d, className: u }),
      ...s
    }
  )
);
_.displayName = "AdvButton";
const nt = _;
export {
  _ as A,
  m as B,
  p as C,
  N as D,
  $ as E,
  k as F,
  T as G,
  n as H,
  V as I,
  st as J,
  rt as K,
  j as L,
  e as M,
  U as N,
  E as O,
  at as P,
  B as a,
  R as b,
  A as c,
  b as d,
  P as e,
  I as f,
  w as g,
  M as h,
  z as i,
  nt as j,
  G as k,
  y as l,
  tt as m,
  et as n,
  Y as o,
  J as p,
  X as q,
  Z as r,
  K as s,
  W as t,
  D as u,
  H as v,
  ot as w,
  Q as x,
  q as y,
  F as z
};
