import { jsxs as l, jsx as o } from "react/jsx-runtime";
import d from "react";
const C = ({
  checked: p = !1,
  indeterminate: n = !1,
  onChange: u,
  onClick: x,
  size: i = 16,
  className: f = "",
  disabled: e = !1,
  title: m,
  style: g
}) => {
  const c = d.useRef(null), r = p && !n, k = n ? "indeterminate" : r ? "checked" : "unchecked";
  d.useEffect(() => {
    c.current && (c.current.indeterminate = n);
  }, [n]);
  const a = i === 16 ? 18 : Math.max(14, i), h = Math.max(28, a), v = Math.max(4, Math.round(a * 0.25)), s = +(a * 0.58).toFixed(1), b = +(s * (10 / 13)).toFixed(1);
  return /* @__PURE__ */ l(
    "div",
    {
      role: "checkbox",
      tabIndex: e ? -1 : 0,
      "aria-checked": n ? "mixed" : r,
      "aria-disabled": e || void 0,
      onClick: (t) => {
        e || (x?.(t), u?.(t));
      },
      onKeyDown: (t) => {
        e || t.key === " " && (t.preventDefault(), t.currentTarget.click());
      },
      title: m,
      className: `agv-morph-checkbox relative inline-flex items-center justify-center border-none bg-transparent p-0 select-none outline-none ${e ? "cursor-not-allowed opacity-50" : "cursor-pointer"} ${f}`,
      style: {
        minWidth: `${h}px`,
        minHeight: `${h}px`,
        ...g
      },
      children: [
        /* @__PURE__ */ o(
          "input",
          {
            ref: c,
            type: "checkbox",
            checked: r,
            disabled: e,
            readOnly: !0,
            tabIndex: -1,
            "aria-hidden": "true",
            autoComplete: "off",
            "data-lpignore": "true",
            "data-form-type": "other",
            className: "pointer-events-none absolute m-0 h-0 w-0 opacity-0"
          }
        ),
        /* @__PURE__ */ o(
          "span",
          {
            "data-cb": "check-box",
            "data-state": k,
            className: "agv-cb-morph-box relative inline-flex shrink-0 items-center justify-center box-border",
            style: {
              width: `${a}px`,
              height: `${a}px`,
              borderRadius: `${v}px`
            },
            children: /* @__PURE__ */ l(
              "svg",
              {
                width: s,
                height: b,
                viewBox: "0 0 13 10",
                fill: "none",
                "aria-hidden": "true",
                children: [
                  /* @__PURE__ */ o(
                    "path",
                    {
                      d: "M 1.5 5 L 5 8.5 L 11.5 1.5",
                      pathLength: 1,
                      className: "agv-cb-check-path"
                    }
                  ),
                  /* @__PURE__ */ o(
                    "path",
                    {
                      d: "M 2.5 5 L 10.5 5",
                      pathLength: 1,
                      className: "agv-cb-indeterminate-path"
                    }
                  )
                ]
              }
            )
          }
        )
      ]
    }
  );
};
export {
  C as M
};
