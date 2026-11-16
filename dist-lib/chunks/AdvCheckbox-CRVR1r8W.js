import { jsx as i } from "react/jsx-runtime";
import { M as C } from "./MorphCheckbox-S5ZNer1R.js";
const x = ({
  checked: o = !1,
  indeterminate: s = !1,
  disabled: r = !1,
  onChange: a,
  onClick: l,
  className: t = "",
  title: e,
  style: f,
  size: p = 16,
  spring: c = "snappy"
}) => /* @__PURE__ */ i(
  C,
  {
    checked: o,
    indeterminate: s,
    disabled: r,
    onClick: (n) => {
      r || (l?.(n), a?.(!o, n));
    },
    size: p,
    spring: c,
    title: e,
    style: f,
    className: t
  }
);
export {
  x as A
};
