import { jsx as O } from "react/jsx-runtime";
import C from "react";
const B = 20, A = 32, N = 20, R = [20, 50, 100, 200], U = {
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
].join(", "), T = "rounded-md", w = () => T, P = (e) => "border-r-2 border-r-[var(--agv-border)]", I = (e) => "border-l-2 border-l-[var(--agv-border)]", M = (e) => ({
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
}), D = "outline-none", H = "", k = "", m = "agv-focus-ring", u = "agv-control", _ = "agv-control agv-control-box", b = {
  sm: "h-7 min-h-[28px] text-xs",
  md: "h-control min-h-[28px] text-sm"
}, $ = (e = "sm") => b[e];
function z({
  size: e = "sm",
  variant: o = "default",
  box: g = !1,
  defaultRadiusClass: r = "rounded-md",
  className: s = ""
} = {}) {
  const n = /(?:^|\s)!?h-/.test(s), v = /\brounded(?:-[^\s]+)?\b/.test(s), d = /\btext-(?:xs|sm|base|lg|xl|\[)/.test(s), p = g ? _ : u, i = v ? "" : r;
  let t = "";
  if (!n)
    if (o === "auth")
      t = d ? "h-12 min-h-[48px]" : "h-12 min-h-[48px] text-sm";
    else {
      const l = d ? "" : e === "md" ? " text-sm" : " text-xs";
      t = e === "md" ? `h-control min-h-[28px]${l}` : `h-7 min-h-[28px]${l}`;
    }
  return [p, i, t, s].filter(Boolean).join(" ");
}
const F = `${u} ${b.md} px-2.5 py-1 placeholder:text-muted-foreground`, G = `${u} ${b.sm} px-2 placeholder:text-muted-foreground`, y = `${_} ${b.md} px-2.5`, V = `${_} ${b.sm} px-2`, j = `${u} p-2 text-xs placeholder:text-muted-foreground`, f = {
  default: "agv-btn agv-btn-default",
  outline: `agv-btn agv-btn-outline ${u}`,
  ghost: "agv-btn agv-btn-ghost",
  destructive: "agv-btn agv-btn-destructive"
};
function a({
  variant: e = "default",
  size: o = "default",
  active: g = !1,
  className: r = ""
} = {}) {
  const s = o === "icon" || o === "icon-sm", n = /(?:^|\s)!?h-/.test(r), v = /(?:^|\s)!?w-/.test(r), d = /\b!?p(?:x|l|r)?-/.test(r), p = /\b!?font-(?:thin|extralight|light|normal|medium|semibold|bold|extrabold|black)\b/.test(r), i = /\b!?text-(?:xs|sm|base|lg|xl|\[)/.test(r), t = [];
  o === "sm" ? (n || t.push("h-7"), t.push("min-h-[28px]"), d || t.push("px-3"), t.push("gap-1 leading-4"), i || t.push("text-xs")) : o === "default" || o === "md" ? (n || t.push("h-control"), t.push("min-h-[28px]"), d || t.push("px-4"), t.push("gap-2"), i || t.push("text-sm")) : o === "icon-sm" ? (n || t.push("h-7"), v || t.push("w-7"), t.push("min-h-[28px] min-w-[28px] shrink-0"), d || t.push("p-0"), i || t.push("text-xs")) : o === "icon" && (n || t.push("h-9"), v || t.push("w-9"), t.push("min-h-[36px] min-w-[36px] shrink-0"), d || t.push("p-0"), i || t.push("text-sm"));
  const l = s || p ? "" : e === "default" && o === "sm" ? "font-semibold" : "font-medium", h = e === "default" ? "shadow-sm" : "", S = g ? "is-active" : "";
  return [
    f[e],
    ...t,
    l,
    h,
    S,
    m,
    r
  ].filter(Boolean).join(" ");
}
const X = a, Z = a({
  variant: "outline",
  size: "default"
}), q = a({
  variant: "outline",
  size: "sm"
}), K = a({
  variant: "outline",
  size: "icon-sm"
}), W = a({
  variant: "default",
  size: "default"
}), Y = a({
  variant: "default",
  size: "sm"
}), J = a({
  variant: "ghost",
  size: "default"
}), Q = a({
  variant: "ghost",
  size: "sm"
}), tt = a({
  variant: "ghost",
  size: "icon-sm"
}), et = a({
  variant: "destructive",
  size: "default"
}), ot = a({
  variant: "destructive",
  size: "sm"
}), at = a({
  variant: "destructive",
  size: "icon-sm"
}), rt = "agv-popup-panel rounded-md border border-border bg-popover text-popover-foreground", st = "agv-popup-panel agv-popup-menu rounded-md border border-border bg-popover text-popover-foreground", nt = "agv-popup-item", c = C.forwardRef(
  ({
    variant: e = "default",
    size: o = "default",
    active: g = !1,
    type: r = "button",
    className: s = "",
    ...n
  }, v) => /* @__PURE__ */ O(
    "button",
    {
      ref: v,
      type: r,
      "data-variant": e,
      "data-size": o,
      "data-active": g ? "true" : void 0,
      className: a({ variant: e, size: o, active: g, className: s }),
      ...n
    }
  )
);
c.displayName = "AdvButton";
const dt = c;
export {
  c as A,
  m as B,
  _ as C,
  B as D,
  F as E,
  k as F,
  T as G,
  b as H,
  j as I,
  nt as J,
  st as K,
  X as L,
  a as M,
  U as N,
  $ as O,
  rt as P,
  E as Q,
  N as a,
  R as b,
  A as c,
  u as d,
  P as e,
  I as f,
  w as g,
  M as h,
  z as i,
  G as j,
  dt as k,
  y as l,
  V as m,
  et as n,
  ot as o,
  J as p,
  Q as q,
  Z as r,
  q as s,
  W as t,
  Y as u,
  D as v,
  H as w,
  at as x,
  tt as y,
  K as z
};
