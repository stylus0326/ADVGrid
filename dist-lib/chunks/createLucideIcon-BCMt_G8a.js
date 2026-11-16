import { useContext as I, createContext as $, forwardRef as S, createElement as x } from "react";
const j = (e) => e?.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
function P(e, t, i = []) {
  if (t == null)
    throw new Error("[lucide]: iconNode is required when icon name is used");
  return {
    name: j(e),
    size: 24,
    node: t,
    ...i.length > 0 ? { aliases: i } : {}
  };
}
const E = (e) => {
  let t = "", i = !1;
  for (const o of e) {
    if (o === "-" || o === "_" || o <= " ") {
      i = t.length > 0;
      continue;
    }
    t.length === 0 ? t += o.toLowerCase() : t += i ? o.toUpperCase() : o, i = !1;
  }
  return t;
};
const p = (e) => {
  const t = E(e);
  return t.charAt(0).toUpperCase() + t.slice(1);
};
const N = (...e) => e.filter((t, i, o) => !!t && t.trim() !== "" && o.indexOf(t) === i).join(" ").trim();
const c = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": 2,
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
};
function C(e) {
  return e != null;
}
function D(e, t = {}) {
  const i = t.attributeNames ?? {}, o = (n) => i[n] ?? n, l = e.size ?? e.width ?? c.width, h = e.size ?? e.height ?? c.height, d = e.aliases?.filter((n) => typeof n == "string" && n.trim() !== "").map((n) => `lucide-${n}`) ?? [], a = [...e.name ? [`lucide-${e.name}`] : [], ...d], s = t.className?.split(" ").filter(Boolean) ?? [], f = t.includeDefaultClasses === !1 ? N(...s) : N("lucide", ...a, ...s), g = t.absoluteStrokeWidth ? Number(t.strokeWidth ?? c["stroke-width"]) * Number(e.size ?? e.width ?? c.width) / Number(t.size ?? t.width ?? c.width) : t.strokeWidth ?? c["stroke-width"];
  return [
    "svg",
    {
      ...Object.entries(c).reduce((n, [r, u]) => (n[o(r)] = u, n), {}),
      ..."color" in t && t.color && {
        [o("stroke")]: t.color
      },
      ..."size" in t && C(t.size) && {
        [o("width")]: t.size,
        [o("height")]: t.size
      },
      ..."width" in t && C(t.width) && {
        [o("width")]: t.width
      },
      ..."height" in t && C(t.height) && {
        [o("height")]: t.height
      },
      [o("stroke-width")]: g,
      ...f && {
        [o("class")]: f
      },
      [o("viewBox")]: `0 0 ${l} ${h}`,
      ...t.hasA11yProp === !1 ? {
        [o("aria-hidden")]: "true"
      } : {},
      ..."attributes" in t && t.attributes
    },
    e.node.map((n) => {
      const [r, u, w] = n, k = t.nonScalingStroke ? { [o("vector-effect")]: "non-scaling-stroke", ...u } : u;
      return w ? [r, k, w] : [r, k];
    })
  ];
}
function F(e, t = {}) {
  return D(e, {
    ...t,
    attributeNames: {
      ...t.attributeNames,
      class: "className",
      "stroke-width": "strokeWidth",
      "stroke-linecap": "strokeLinecap",
      "stroke-linejoin": "strokeLinejoin",
      "vector-effect": "vectorEffect"
    }
  });
}
const R = (e) => {
  for (const t in e)
    if (t.startsWith("aria-") || t === "role" || t === "title")
      return !0;
  return !1;
}, U = $({}), q = () => I(U), H = S(
  ({
    color: e,
    size: t,
    width: i,
    height: o,
    strokeWidth: l,
    absoluteStrokeWidth: h,
    nonScalingStroke: d,
    className: a = "",
    children: s,
    iconNode: f = [],
    icon: g = {
      node: f,
      aliases: [],
      size: 24
    },
    ...b
  }, n) => {
    const {
      size: r = 24,
      strokeWidth: u = 2,
      absoluteStrokeWidth: w = !1,
      nonScalingStroke: k = !1,
      color: A = "currentColor",
      className: W = ""
    } = q() ?? {}, z = !!s || R(b), [m, v, L = []] = F(g, {
      color: e ?? A,
      width: i ?? t ?? r,
      height: o ?? t ?? r,
      strokeWidth: l ?? u,
      absoluteStrokeWidth: h ?? w,
      nonScalingStroke: d ?? k,
      className: N(W, a),
      hasA11yProp: z,
      attributes: b
    });
    return x(
      m,
      {
        ref: n,
        ...v
      },
      [
        ...L.map(([y, B]) => x(y, B)),
        ...Array.isArray(s) ? s : [s]
      ]
    );
  }
);
function Z(e, t = [], i = []) {
  const o = typeof e == "string" ? P(e, t, i) : e, l = S(
    ({ className: h, ...d }, a) => x(H, {
      ref: a,
      icon: o,
      className: h,
      ...d
    })
  );
  return o.name && (l.displayName = p(o.name)), l;
}
export {
  Z as c
};
