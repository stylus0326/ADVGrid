import { jsx as r } from "react/jsx-runtime";
import { l as p, C as s, n as t, M as e } from "./MorphIcons-DW5eQGeo.js";
const h = [["path", { d: "m15 18-6-6 6-6" }]], a = ({
  direction: o,
  size: n = 11
}) => /* @__PURE__ */ r(t, { direction: o, size: n, spring: "snappy" }), g = ({
  direction: o
}) => /* @__PURE__ */ r(
  p,
  {
    icon: o === "right" ? s : h,
    size: 14,
    strokeWidth: 2.5,
    spring: "bouncy"
  }
), M = ({
  expanded: o
}) => /* @__PURE__ */ r(e, { expanded: o, size: 14, spring: "bouncy" });
export {
  g as HeaderBandToggleMorphIcon,
  a as HeaderSortMorphIcon,
  M as RowGroupChevronMorphIcon
};
