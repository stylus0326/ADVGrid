import { jsxs as r, jsx as t, Fragment as ge } from "react/jsx-runtime";
import ue, { useState as b, useMemo as W, useEffect as Le, useCallback as Fe, useRef as $e } from "react";
import { D as O, q as U, F as ut, b as pe, o as Ie, m as vt, j as pt } from "./gridFormatUtils-wCKPmlrt.js";
import { A as Je } from "./AdvOverlayScroll-CipuwW1l.js";
import { B as xe, A as x, j as K, N as q, C as je } from "./AdvButton-Ck5SixaL.js";
import { Q as $, e as xt, g as ce, v as ht, b as ft, f as gt } from "./queryUtils-DpX12s9D.js";
import { n as De } from "./enterpriseEditorUtils-DJeTtQuh.js";
import { A as bt, D as Nt } from "./AdvPopover-CVmyHBzb.js";
import { M as yt } from "./MorphIcons-DW5eQGeo.js";
import { A as kt, a as wt } from "./AdvDatePicker-C4uBzJBl.js";
import { TimeRangeFilterInput as Ct, TimeFilterInput as Tt } from "./GridTimeFilterInputs-VIGIdPv1.js";
import { g as Ee, a as St, F as Ot, R as At } from "./FilterIcons-nsUh2HLg.js";
import { AdvMultiFilterPopup as Mt } from "./AdvMultiFilterPopup-TSRsTZTt.js";
import { j as Re, k as ze, h as de, b as $t, w as he, i as Dt } from "./DataGridEnterprise-DyOy-gAv.js";
import { c as G } from "./createLucideIcon-BCMt_G8a.js";
import { X as Et } from "./x-CdrDtutQ.js";
import { C as be } from "./check-KNrOhvEC.js";
import { S as Be } from "./common-29M8PlVv.js";
const He = {
  name: "copy",
  size: 24,
  node: [
    ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2", key: "17jyea" }],
    ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2", key: "zix9uf" }]
  ]
};
He.node;
const Rt = G(He);
const Qe = {
  name: "list-filter",
  size: 24,
  node: [
    ["path", { d: "M2 5h20", key: "1fs1ex" }],
    ["path", { d: "M6 12h12", key: "8npq4p" }],
    ["path", { d: "M9 19h6", key: "456am0" }]
  ]
};
Qe.node;
const zt = G(Qe);
const Ue = {
  name: "maximize-2",
  size: 24,
  node: [
    ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
    ["path", { d: "m21 3-7 7", key: "1l2asr" }],
    ["path", { d: "m3 21 7-7", key: "tjx5ai" }],
    ["path", { d: "M9 21H3v-6", key: "wtvkvv" }]
  ]
};
Ue.node;
const _t = G(Ue);
const Ke = {
  name: "minimize-2",
  size: 24,
  node: [
    ["path", { d: "m14 10 7-7", key: "oa77jy" }],
    ["path", { d: "M20 10h-6V4", key: "mjg0md" }],
    ["path", { d: "m3 21 7-7", key: "tjx5ai" }],
    ["path", { d: "M4 14h6v6", key: "rmj7iw" }]
  ]
};
Ke.node;
const Pt = G(Ke);
const qe = {
  name: "plus",
  size: 24,
  node: [
    ["path", { d: "M5 12h14", key: "1ays0h" }],
    ["path", { d: "M12 5v14", key: "s699le" }]
  ]
};
qe.node;
const _e = G(qe);
const We = {
  name: "trash",
  size: 24,
  node: [
    ["path", { d: "M10 11v6", key: "nco0om" }],
    ["path", { d: "M14 11v6", key: "outv1u" }],
    ["path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6", key: "miytrc" }],
    ["path", { d: "M3 6h18", key: "d0wm0j" }],
    ["path", { d: "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2", key: "e791ji" }]
  ],
  aliases: ["trash-2"]
};
We.node;
const fe = G(We), Vt = Ie, Pe = ue.memo(function({
  value: D,
  options: N,
  onChange: Y,
  className: c = "",
  minWidth: E = 130,
  popupMinWidth: X,
  theme: k = Be.LIGHT,
  showSearch: R,
  iconOnly: A = !1
}) {
  const [w, P] = b(!1), [V, Z] = b(""), z = $e(null), L = $e(null), ne = X || E, F = R !== void 0 ? R : N.length > 8, I = W(
    () => N.find((v) => v.value === D) || N[0],
    [N, D]
  ), ee = Fe(() => {
    P((v) => (v || Z(""), !v));
  }, []);
  Le(() => {
    if (w && F) {
      const v = setTimeout(() => L.current?.focus(), 50);
      return () => clearTimeout(v);
    }
  }, [w, F]);
  const H = W(() => {
    if (!V.trim()) return N;
    const v = De(V);
    return N.filter((_) => De(_.label).includes(v));
  }, [N, V]), M = Math.max(z.current?.offsetWidth || 0, ne);
  return /* @__PURE__ */ r(ge, { children: [
    /* @__PURE__ */ r(
      "div",
      {
        ref: z,
        "data-agv-trigger": "true",
        "data-agv-popover-trigger": "true",
        "aria-expanded": w,
        onClick: ee,
        style: {
          minWidth: E ? `${E}px` : void 0
        },
        className: `${je} relative inline-flex min-h-[28px] h-7 items-center justify-between gap-1 ${A ? "px-1.5" : "px-2"} text-xs text-[var(--agv-text-main)] cursor-pointer select-none shrink-0 ${w ? "is-open" : ""} ${c}`.trim(),
        children: [
          /* @__PURE__ */ r("div", { className: "flex items-center gap-1 shrink-0", children: [
            I?.icon && /* @__PURE__ */ t("span", { className: "shrink-0 flex items-center", children: I.icon }),
            !A && /* @__PURE__ */ t("span", { className: "truncate font-medium", children: I?.label || D })
          ] }),
          /* @__PURE__ */ t(
            yt,
            {
              expanded: w,
              size: 12,
              type: "down-up",
              className: "text-[var(--agv-text-muted)] shrink-0"
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ t(
      bt,
      {
        isOpen: w,
        anchorEl: z.current,
        onClose: () => P(!1),
        placement: "bottom-start",
        showArrow: !0,
        offset: 10,
        width: M,
        minWidth: ne,
        paddingClassName: "p-0",
        contentClassName: "text-xs agv-query-dropdown",
        zIndex: 1e8,
        theme: k,
        ignoreClickOutsideSelectors: Nt,
        children: /* @__PURE__ */ r(
          "div",
          {
            "data-theme": k || void 0,
            onMouseDown: (v) => v.stopPropagation(),
            className: "flex flex-col rounded-md overflow-hidden text-xs max-h-[240px]",
            children: [
              F && /* @__PURE__ */ t("div", { className: "p-1.5 border-b border-[var(--agv-border)]", children: /* @__PURE__ */ t(
                "input",
                {
                  ref: L,
                  type: "text",
                  value: V,
                  onChange: (v) => Z(v.target.value),
                  placeholder: "Tìm kiếm...",
                  ...q,
                  className: `${K} w-full px-2`
                }
              ) }),
              /* @__PURE__ */ t(
                Je,
                {
                  className: "flex-initial min-h-0",
                  viewportClassName: "p-1 overflow-y-auto overflow-x-hidden max-h-[200px] overscroll-contain flex flex-col gap-0.5",
                  contentSignature: H.length,
                  children: H.length === 0 ? /* @__PURE__ */ t("div", { className: "px-3 py-2 text-center text-xs text-[var(--agv-text-muted)]", children: "Không tìm thấy" }) : H.map((v) => {
                    const _ = v.value === D;
                    return /* @__PURE__ */ r(
                      "div",
                      {
                        onClick: () => {
                          Y(v.value), P(!1);
                        },
                        className: `agv-popup-item justify-between ${_ ? "is-selected" : ""}`,
                        children: [
                          /* @__PURE__ */ r("div", { className: "flex items-center gap-2 truncate mr-2", children: [
                            v.icon && /* @__PURE__ */ t("span", { className: "shrink-0 flex items-center", children: v.icon }),
                            /* @__PURE__ */ t("span", { className: "truncate", children: v.label })
                          ] }),
                          _ && /* @__PURE__ */ t(be, { size: 13, strokeWidth: 2.5, className: "shrink-0" })
                        ]
                      },
                      v.value
                    );
                  })
                }
              )
            ]
          }
        )
      }
    )
  ] });
}), me = [
  "var(--agv-accent)",
  "var(--agv-warning)",
  "var(--agv-info)",
  "var(--agv-danger)",
  "var(--agv-success)",
  "var(--agv-trend-up)"
], Ve = gt, ra = ue.memo(
  function({
    isOpen: D,
    onClose: N,
    gridId: Y,
    columns: c,
    appliedTree: E,
    onApply: X,
    totalRowCount: k,
    surfaceTheme: R = Be.LIGHT,
    data: A = [],
    getCellValue: w,
    hasColumnEmptyCells: P,
    getColumnDateBounds: V,
    style: Z,
    embedded: z = !1
  }) {
    const [L, ne] = b(!1), [F, I] = b("builder"), [ee, H] = b(""), [M, v] = b(""), [_, se] = b(null), [Ye, Ne] = b(!1), [Xe, ye] = b(null), [Ze, ie] = b(null), [C, te] = b(null), ae = W(() => Re(Y), [Y]), [et, tt] = b({}), [Q, le] = b(
      () => ze(Re(Y), [])
    );
    Le(() => {
      le(ze(ae, []));
    }, [ae]);
    const at = W(() => c.map((e) => ({
      value: e.key,
      label: e.title || e.key
    })), [c]), ke = W(() => {
      const e = {};
      for (const a of c)
        e[a.key] = Vt(a.key, c);
      return e;
    }, [c]), [g, J] = b(() => {
      if (E && Array.isArray(E.rules) && E.rules.length > 0)
        return JSON.parse(JSON.stringify(E));
      const e = c.find((l) => l.dataType !== O.SYSTEM)?.key || c[0]?.key || "", a = U(e, c);
      return {
        combinator: $.AND,
        rules: [
          {
            field: e,
            operator: a,
            value: ""
          }
        ]
      };
    }), we = W(() => {
      if (!D || !de(g)) return k;
      if (k <= 0) return 0;
      const e = !!(A && Array.isArray(A) && A.length > 0);
      if (!e && !w) return 0;
      const a = e ? A.length : k;
      let l = 0;
      for (let s = 0; s < a; s++) {
        const o = e ? A[s] : null;
        xt(g, o, s, w, ke) && l++;
      }
      return l;
    }, [D, g, A, k, w, ke]), Ce = Fe((e) => {
      const a = document.getElementById(e);
      a && (a.scrollIntoView({ behavior: "smooth", block: "nearest" }), a.querySelector(
        'input, button, select, [tabindex="0"]'
      )?.focus(), a.style.outline = "2px solid var(--agv-accent)", a.style.outlineOffset = "1px", setTimeout(() => {
        a.style.outline = "", a.style.outlineOffset = "";
      }, 1500));
    }, []);
    if (!D) return null;
    const rt = () => {
      if (!ee.trim()) return;
      const a = [{
        id: `preset_${Date.now()}`,
        name: ee.trim(),
        tree: JSON.parse(JSON.stringify(g)),
        createdAt: Date.now()
      }, ...Q];
      le(a), H(""), he(ae, a);
    }, nt = (e) => {
      const a = Q.filter((l) => l.id !== e);
      le(a), he(ae, a);
    }, Te = () => {
      if (!M.trim()) {
        se("Vui lòng nhập chuỗi lệnh CMD.");
        return;
      }
      const e = ft(M, c);
      if (!e.isValid || !e.tree) {
        se(`Lỗi: ${e.error || "Cú pháp câu lệnh không hợp lệ."}`);
        return;
      }
      const a = M.trim().length > 35 ? `${M.trim().slice(0, 35)}...` : M.trim(), s = [{
        id: `preset_cmd_${Date.now()}`,
        name: a,
        tree: e.tree,
        createdAt: Date.now(),
        cmdText: M.trim()
      }, ...Q];
      le(s), v(""), se(null), he(ae, s);
    }, st = () => {
      const e = c.find((l) => l.dataType !== O.SYSTEM)?.key || c[0]?.key || "", a = U(e, c);
      J({
        combinator: $.AND,
        rules: [
          {
            field: e,
            operator: a,
            value: ""
          }
        ]
      }), X(null), N();
    }, it = (e) => {
      const a = c.find((o) => o.dataType !== O.SYSTEM)?.key || c[0]?.key || "", l = U(a, c), s = {
        field: a,
        operator: l,
        value: ""
      };
      J((o) => {
        const n = JSON.parse(JSON.stringify(o)), m = (u) => {
          if (u === e || u.id === e.id)
            return u.rules.push(s), !0;
          for (const f of u.rules)
            if ("combinator" in f && m(f)) return !0;
          return !1;
        };
        return m(n) || n.rules.push(s), n;
      });
    }, lt = (e) => {
      const a = c.find((o) => o.dataType !== O.SYSTEM)?.key || c[0]?.key || "", l = U(a, c), s = {
        id: `group_${Date.now()}`,
        combinator: $.OR,
        rules: [
          {
            field: a,
            operator: l || pe.CONTAINS,
            value: ""
          }
        ]
      };
      J((o) => {
        const n = JSON.parse(JSON.stringify(o)), m = (u) => {
          if (u === e || u.id === e.id)
            return u.rules.push(s), !0;
          for (const f of u.rules)
            if ("combinator" in f && m(f)) return !0;
          return !1;
        };
        return m(n) || n.rules.push(s), n;
      });
    }, Se = (e, a) => {
      J((l) => {
        const s = JSON.parse(JSON.stringify(l)), o = (n) => {
          if (n.id === e.id || e === g && n === s) {
            if (n.rules.splice(a, 1), n.rules.length === 0 && n === s) {
              const m = c.find((f) => f.dataType !== O.SYSTEM)?.key || c[0]?.key || "", u = U(m, c);
              n.rules.push({
                field: m,
                operator: u || pe.CONTAINS,
                value: ""
              });
            }
            return !0;
          }
          for (const m of n.rules)
            if ("combinator" in m && o(m)) return !0;
          return !1;
        };
        return o(s), s;
      });
    }, y = (e, a, l) => {
      J((s) => {
        const o = JSON.parse(JSON.stringify(s)), n = (m) => {
          if (m.id === e.id || e === g && m === o)
            return m.rules[a] = l(m.rules[a]), !0;
          for (const u of m.rules)
            if ("combinator" in u && n(u)) return !0;
          return !1;
        };
        return n(o), o;
      });
    }, ot = (e) => {
      J((a) => {
        const l = JSON.parse(JSON.stringify(a)), s = (o) => {
          if (o.id === e.id || e === g && o === l)
            return o.combinator = o.combinator === $.AND ? $.OR : $.AND, !0;
          for (const n of o.rules)
            if ("combinator" in n && s(n)) return !0;
          return !1;
        };
        return s(l), l;
      });
    }, Oe = (e, a = 0, l = !0, s = "0", o = !1) => {
      const n = me[a % me.length], m = e.id || `group_${s}`, u = Ze === s, f = u || o;
      return /* @__PURE__ */ r(
        "span",
        {
          onClick: (j) => {
            j.stopPropagation(), Ce(`agv-query-node-${s}`);
          },
          className: "inline-flex items-center flex-wrap gap-0.5 px-0.5 py-0.5 rounded select-text cursor-pointer transition-colors",
          style: {
            backgroundColor: u ? `color-mix(in srgb, ${n} 12%, transparent)` : void 0
          },
          children: [
            /* @__PURE__ */ t(
              "span",
              {
                className: "font-black text-xs select-none px-0.5 cursor-pointer rounded transition-transform hover:scale-125",
                style: { color: n },
                onMouseEnter: () => ie(s),
                onMouseLeave: () => ie(null),
                children: "("
              }
            ),
            e.rules.map((j, T) => {
              const p = "combinator" in j, oe = e.combinator === $.AND ? "VÀ" : "HOẶC", i = `${s}-${T}`;
              return /* @__PURE__ */ r(ue.Fragment, { children: [
                T > 0 && /* @__PURE__ */ t(
                  "span",
                  {
                    className: "text-xs font-bold px-1.5 py-0.5 rounded mx-0.5 select-none transition-colors",
                    style: {
                      color: n,
                      border: `1px solid ${n}`,
                      backgroundColor: f ? `color-mix(in srgb, ${n} 22%, var(--agv-bg-popup))` : "var(--agv-bg-popup)"
                    },
                    children: oe
                  }
                ),
                p ? Oe(
                  j,
                  a + 1,
                  !1,
                  i,
                  f
                ) : /* @__PURE__ */ t(
                  "span",
                  {
                    onClick: (B) => {
                      B.stopPropagation(), Ce(`agv-query-node-${i}`);
                    },
                    className: "inline-flex items-center font-medium text-xs px-2 py-0.5 rounded border text-[var(--agv-text-main)] cursor-pointer select-text transition-colors",
                    style: {
                      backgroundColor: f ? `color-mix(in srgb, ${n} 22%, var(--agv-bg-popup))` : "var(--agv-bg-popup)",
                      borderColor: f ? n : "var(--agv-border)"
                    },
                    children: Ve(j, c)
                  }
                )
              ] }, T);
            }),
            /* @__PURE__ */ t(
              "span",
              {
                className: "font-black text-xs select-none px-0.5 cursor-pointer rounded transition-transform hover:scale-125",
                style: { color: n },
                onMouseEnter: () => ie(s),
                onMouseLeave: () => ie(null),
                children: ")"
              }
            )
          ]
        },
        m
      );
    }, Ae = (e, a = 0) => {
      if (!e || !Array.isArray(e.rules))
        return /* @__PURE__ */ t("span", { className: "text-[var(--agv-text-subtle)] italic select-none", children: "(Không có điều kiện lọc)" });
      const l = me[a % me.length], s = e.rules.filter((o) => "combinator" in o ? de(o) : Dt(o));
      return s.length === 0 ? /* @__PURE__ */ t("span", { className: "text-[var(--agv-text-subtle)] italic select-none", children: "(Không có điều kiện lọc)" }) : /* @__PURE__ */ r(
        "span",
        {
          className: "inline-flex items-center flex-wrap gap-0.5 px-0.5 py-0.5 rounded select-text",
          children: [
            /* @__PURE__ */ t(
              "span",
              {
                className: "font-black text-xs select-none px-0.5",
                style: { color: l },
                children: "("
              }
            ),
            s.map((o, n) => {
              const m = "combinator" in o, u = e.combinator === $.AND ? "VÀ" : "HOẶC";
              return /* @__PURE__ */ r(ue.Fragment, { children: [
                n > 0 && /* @__PURE__ */ t(
                  "span",
                  {
                    className: "text-xs font-bold px-1.5 py-0.5 rounded mx-0.5 select-none bg-[var(--agv-bg-popup)]",
                    style: {
                      color: l,
                      border: `1px solid ${l}`
                    },
                    children: u
                  }
                ),
                m ? Ae(o, a + 1) : /* @__PURE__ */ t("span", { className: "inline-flex items-center font-medium text-xs px-2 py-0.5 rounded border border-[var(--agv-border)] bg-[var(--agv-bg-popup)] text-[var(--agv-text-main)] select-text", children: Ve(o, c) })
              ] }, n);
            }),
            /* @__PURE__ */ t(
              "span",
              {
                className: "font-black text-xs select-none px-0.5",
                style: { color: l },
                children: ")"
              }
            )
          ]
        }
      );
    }, Me = (e, a = 0, l, s, o = "0") => {
      const n = a === 0, m = e.combinator === $.AND, u = e.id || `group_${o}`, f = !n && !!et[u], j = ce(e, c);
      return /* @__PURE__ */ r(
        "div",
        {
          id: `agv-query-node-${o}`,
          className: `space-y-1.5 rounded-md border border-[var(--agv-border)] p-2 ${n ? "bg-[var(--agv-bg-popup)]" : "bg-[var(--agv-bg-control)] ml-3"}`,
          children: [
            /* @__PURE__ */ r("div", { className: "flex items-center justify-between gap-2 pb-1 border-b border-[var(--agv-border)]", children: [
              /* @__PURE__ */ r("div", { className: "flex items-center gap-1.5 flex-wrap", children: [
                /* @__PURE__ */ t(
                  "button",
                  {
                    type: "button",
                    onClick: () => ot(e),
                    className: `min-h-[28px] h-7 px-3 rounded text-xs font-bold transition-colors select-none cursor-pointer ${m ? "bg-[var(--agv-accent)] text-[var(--agv-accent-text,#ffffff)]" : "bg-[var(--agv-warning)] text-[var(--agv-accent-text,#ffffff)]"}`,
                    children: m ? "VÀ" : "HOẶC"
                  }
                ),
                /* @__PURE__ */ r(
                  x,
                  {
                    variant: "ghost",
                    size: "sm",
                    onClick: () => it(e),
                    className: "px-2",
                    children: [
                      /* @__PURE__ */ t(_e, { className: "h-3 w-3" }),
                      /* @__PURE__ */ t("span", { children: "Thêm điều kiện" })
                    ]
                  }
                ),
                /* @__PURE__ */ r(
                  x,
                  {
                    variant: "ghost",
                    size: "sm",
                    onClick: () => lt(e),
                    className: "px-2 text-[var(--agv-text-subtle)]",
                    children: [
                      /* @__PURE__ */ t(_e, { className: "h-3 w-3" }),
                      /* @__PURE__ */ t("span", { children: "Thêm nhóm" })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ r("div", { className: "flex items-center gap-1.5 shrink-0 ml-auto", children: [
                !n && /* @__PURE__ */ t(
                  x,
                  {
                    variant: "outline",
                    size: "icon-sm",
                    active: f,
                    onClick: () => {
                      tt((T) => ({
                        ...T,
                        [u]: !T[u]
                      }));
                    },
                    className: `font-bold ${f ? "" : "text-[var(--agv-text-muted)] hover:text-[var(--agv-accent)]"}`,
                    children: "!"
                  }
                ),
                !n && s && l !== void 0 && /* @__PURE__ */ t(
                  x,
                  {
                    variant: "destructive",
                    size: "icon-sm",
                    onClick: () => Se(s, l),
                    className: "ml-0.5",
                    children: /* @__PURE__ */ t(fe, { className: "h-3.5 w-3.5" })
                  }
                )
              ] })
            ] }),
            f && /* @__PURE__ */ r("div", { className: "mt-1.5 mb-1 flex items-start gap-2 rounded border border-[var(--agv-border)] bg-[var(--agv-bg-root)] px-2.5 py-1.5 text-xs text-[var(--agv-text-main)]", children: [
              /* @__PURE__ */ t("span", { className: "font-bold text-[var(--agv-accent)] shrink-0 select-none", children: "Giải nghĩa:" }),
              /* @__PURE__ */ t("span", { className: "leading-relaxed select-text font-medium text-[var(--agv-text-main)]", children: j || "(Chưa có điều kiện hợp lệ)" })
            ] }),
            /* @__PURE__ */ t("div", { className: "space-y-1.5 pt-1", children: e.rules.map((T, p) => {
              const oe = `${o}-${p}`;
              if ("combinator" in T)
                return Me(T, a + 1, p, e, oe);
              const i = T, B = Ie(i.field, c), ct = Ee(i.field, c, P).map((d) => ({
                value: d,
                label: St[d]?.label || d,
                icon: /* @__PURE__ */ t(Ot, { op: d, size: 14, className: "shrink-0" })
              })), ve = vt(i.operator), dt = pt(i.operator);
              return /* @__PURE__ */ r(
                "div",
                {
                  id: `agv-query-node-${oe}`,
                  className: "flex items-center gap-1.5 rounded border border-[var(--agv-border)] bg-[var(--agv-bg-popup)] p-1.5 text-xs transition-colors flex-nowrap min-w-0",
                  children: [
                    /* @__PURE__ */ t(
                      Pe,
                      {
                        value: i.field,
                        options: at,
                        onChange: (d) => {
                          const S = Ee(d, c, P).includes(i.operator) ? i.operator : U(d, c);
                          y(e, p, (re) => ({
                            ...re,
                            field: d,
                            operator: S,
                            value: "",
                            valueTo: ""
                          }));
                        },
                        minWidth: 130,
                        theme: R,
                        showSearch: !0
                      }
                    ),
                    /* @__PURE__ */ t(
                      Pe,
                      {
                        value: i.operator,
                        options: ct,
                        onChange: (d) => y(e, p, (h) => ({
                          ...h,
                          operator: d,
                          value: "",
                          valueTo: ""
                        })),
                        iconOnly: !0,
                        minWidth: 44,
                        popupMinWidth: 175,
                        theme: R,
                        showSearch: !1
                      }
                    ),
                    !dt && /* @__PURE__ */ t(ge, { children: Array.isArray(i.multiValues) && i.multiValues.length > 0 || Array.isArray(i.multiRanges) && i.multiRanges.length > 0 ? /* @__PURE__ */ r("div", { className: "flex items-center gap-1.5 flex-1 min-w-[150px] max-w-[320px]", children: [
                      /* @__PURE__ */ r(
                        "div",
                        {
                          onClick: (d) => {
                            te({
                              group: e,
                              rIdx: p,
                              field: i.field,
                              operator: i.operator,
                              anchorEl: d.currentTarget
                            });
                          },
                          className: `${je} ${xe} flex min-h-[28px] h-7 flex-1 items-center justify-between rounded-md px-2.5 text-xs text-[var(--agv-text-main)] cursor-pointer select-none truncate`,
                          children: [
                            /* @__PURE__ */ t("span", { className: "truncate font-medium", children: i.multiValues ? `${i.multiValues.slice(0, 2).map((d) => `"${d}"`).join(", ")}${i.multiValues.length > 2 ? ` (+${i.multiValues.length - 2})` : ""}` : `${i.multiRanges?.length || 0} khoảng` }),
                            /* @__PURE__ */ t("span", { className: "ml-1.5 rounded bg-[var(--agv-accent)] px-1.5 py-0.2 text-xs font-bold text-[var(--agv-accent-text,#ffffff)] shrink-0", children: i.multiValues ? `${i.multiValues.length} giá trị` : "Khoảng" })
                          ]
                        }
                      ),
                      /* @__PURE__ */ t(
                        x,
                        {
                          variant: "destructive",
                          size: "icon-sm",
                          onClick: () => {
                            y(e, p, (d) => ({
                              ...d,
                              multiValues: void 0,
                              multiRanges: void 0
                            }));
                          },
                          children: "×"
                        }
                      )
                    ] }) : /* @__PURE__ */ r("div", { className: "flex items-center gap-1.5 flex-1 min-w-0 flex-nowrap", children: [
                      B === O.DATE ? (() => {
                        const d = c.find((S) => S.key === i.field), h = d?.minDate && d?.maxDate ? { min: d.minDate, max: d.maxDate } : V?.(i.field) || { min: "2017-01-01", max: "2027-12-31" };
                        return ve ? /* @__PURE__ */ t("div", { className: "flex-1 min-w-[170px] max-w-[280px]", children: /* @__PURE__ */ t(
                          kt,
                          {
                            from: i.value || "",
                            to: i.valueTo || "",
                            onChange: (S) => {
                              y(e, p, (re) => ({
                                ...re,
                                value: S.from || "",
                                valueTo: S.to || ""
                              }));
                            },
                            min: h.min,
                            max: h.max,
                            placeholderFrom: "Từ",
                            placeholderTo: "Đến",
                            theme: R,
                            size: "xs",
                            showPreset: !0,
                            dualMonth: !1
                          }
                        ) }) : /* @__PURE__ */ t("div", { className: "flex-1 min-w-[140px] max-w-[200px]", children: /* @__PURE__ */ t(
                          wt,
                          {
                            value: i.value || "",
                            onChange: (S, re) => {
                              y(e, p, (mt) => ({
                                ...mt,
                                value: S || (re?.from ?? "")
                              }));
                            },
                            min: h.min,
                            max: h.max,
                            placeholder: "Chọn ngày...",
                            theme: R,
                            showPreset: !0,
                            size: "xs",
                            className: "w-full h-full"
                          }
                        ) });
                      })() : B === O.TIME ? ve ? /* @__PURE__ */ t("div", { className: "flex-1 min-w-[140px] max-w-[190px] rounded border border-[var(--agv-border-strong)] bg-[var(--agv-bg-control)] px-1", children: /* @__PURE__ */ t(
                        Ct,
                        {
                          from: i.value || "",
                          to: i.valueTo || "",
                          onChange: (d, h) => {
                            y(e, p, (S) => ({
                              ...S,
                              value: d,
                              valueTo: h
                            }));
                          },
                          hasValue: !!(i.value || i.valueTo)
                        }
                      ) }) : /* @__PURE__ */ t("div", { className: "flex-1 min-w-[90px] max-w-[130px] rounded border border-[var(--agv-border-strong)] bg-[var(--agv-bg-control)] px-1", children: /* @__PURE__ */ t(
                        Tt,
                        {
                          value: i.value || "",
                          onChange: (d) => {
                            y(e, p, (h) => ({
                              ...h,
                              value: d
                            }));
                          },
                          placeholder: "HH:mm",
                          hasValue: !!i.value
                        }
                      ) }) : ve ? /* @__PURE__ */ r("div", { className: "flex items-center gap-1 flex-1 min-w-[180px]", children: [
                        /* @__PURE__ */ t(
                          "input",
                          {
                            type: "text",
                            value: i.value ?? "",
                            onChange: (d) => y(e, p, (h) => ({
                              ...h,
                              value: d.target.value
                            })),
                            placeholder: B === O.NUMBER ? "Từ số..." : "Từ...",
                            ...q,
                            className: `${K} flex-1 min-w-0 px-2`
                          }
                        ),
                        /* @__PURE__ */ t(At, { className: "mx-0.5" }),
                        /* @__PURE__ */ t(
                          "input",
                          {
                            type: "text",
                            value: i.valueTo ?? "",
                            onChange: (d) => y(e, p, (h) => ({
                              ...h,
                              valueTo: d.target.value
                            })),
                            placeholder: B === O.NUMBER ? "Đến số..." : "Đến...",
                            ...q,
                            className: `${K} flex-1 min-w-0 px-2`
                          }
                        )
                      ] }) : /* @__PURE__ */ t(
                        "input",
                        {
                          type: "text",
                          value: i.value ?? "",
                          onChange: (d) => y(e, p, (h) => ({
                            ...h,
                            value: d.target.value
                          })),
                          placeholder: B === O.NUMBER ? "Nhập số tiền..." : "Nhập giá trị...",
                          ...q,
                          className: `${K} flex-1 min-w-[120px] px-2`
                        }
                      ),
                      /* @__PURE__ */ t(
                        x,
                        {
                          variant: "outline",
                          size: "icon-sm",
                          onClick: (d) => {
                            te({
                              group: e,
                              rIdx: p,
                              field: i.field,
                              operator: i.operator,
                              anchorEl: d.currentTarget
                            });
                          },
                          className: "text-[var(--agv-text-muted)] hover:text-[var(--agv-accent)]",
                          children: /* @__PURE__ */ t(zt, { className: "h-3.5 w-3.5 shrink-0" })
                        }
                      )
                    ] }) }),
                    /* @__PURE__ */ t(
                      x,
                      {
                        variant: "destructive",
                        size: "icon-sm",
                        onClick: () => Se(e, p),
                        className: "ml-auto",
                        children: /* @__PURE__ */ t(fe, { className: "h-3.5 w-3.5" })
                      }
                    )
                  ]
                },
                `rule_${p}`
              );
            }) })
          ]
        },
        u
      );
    };
    return ce(g, c), /* @__PURE__ */ r(
      "div",
      {
        "data-agv-popup": "true",
        style: L ? z ? {
          position: "fixed",
          inset: "16px",
          zIndex: 1260
        } : {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1250
        } : z ? {
          position: "relative",
          width: "560px",
          maxWidth: "calc(100vw - 48px)",
          maxHeight: "min(440px, calc(100vh - 120px))",
          ...Z
        } : {
          position: "absolute",
          zIndex: 1250,
          width: "560px",
          maxWidth: "calc(100% - 60px)",
          maxHeight: "min(460px, calc(100% - 32px))",
          ...Z
        },
        className: z && !L ? "flex flex-col text-[var(--agv-text-main)] overflow-hidden select-none rounded-md" : "agv-query-builder-modal agv-popup-panel flex flex-col rounded-md border border-[var(--agv-border-popup)] bg-[var(--agv-bg-popup)] text-[var(--agv-text-main)] overflow-hidden select-none agv-spring-right",
        onClick: (e) => e.stopPropagation(),
        onWheel: (e) => e.stopPropagation(),
        children: [
          /* @__PURE__ */ r(
            "div",
            {
              className: `flex items-center justify-between border-b border-[var(--agv-border)] px-3 shrink-0 min-h-[36px] ${z && !L ? "bg-transparent" : "bg-[var(--agv-bg-header)]"}`,
              children: [
                /* @__PURE__ */ r("div", { className: "flex items-center gap-1 h-full", children: [
                  /* @__PURE__ */ r(
                    "button",
                    {
                      type: "button",
                      onClick: () => I("builder"),
                      className: `min-h-[28px] h-full px-2.5 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 ${xe} ${F === "builder" ? "border-[var(--agv-accent)] text-[var(--agv-accent)] font-bold" : "border-transparent text-[var(--agv-text-muted)] hover:text-[var(--agv-text-main)]"}`,
                      children: [
                        /* @__PURE__ */ t("span", { children: "Cây Điều Kiện" }),
                        de(g) && /* @__PURE__ */ t("span", { className: "rounded bg-[var(--agv-accent)] px-1.5 py-0.5 text-xs font-bold text-[var(--agv-accent-text,#ffffff)]", children: $t(g) })
                      ]
                    }
                  ),
                  /* @__PURE__ */ t(
                    "button",
                    {
                      type: "button",
                      onClick: () => I("presets"),
                      className: `min-h-[28px] h-full px-2.5 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 ${xe} ${F === "presets" ? "border-[var(--agv-accent)] text-[var(--agv-accent)] font-bold" : "border-transparent text-[var(--agv-text-muted)] hover:text-[var(--agv-text-main)]"}`,
                      children: /* @__PURE__ */ r("span", { children: [
                        "Mẫu Đã Lưu (",
                        Q.length,
                        ")"
                      ] })
                    }
                  )
                ] }),
                /* @__PURE__ */ r("div", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ t(
                    x,
                    {
                      variant: "ghost",
                      size: "icon-sm",
                      onClick: () => ne((e) => !e),
                      className: "text-[var(--agv-text-subtle)]",
                      children: L ? /* @__PURE__ */ t(Pt, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ t(_t, { className: "h-3.5 w-3.5" })
                    }
                  ),
                  /* @__PURE__ */ t(
                    x,
                    {
                      variant: "ghost",
                      size: "icon-sm",
                      onClick: N,
                      className: "text-[var(--agv-text-subtle)]",
                      children: /* @__PURE__ */ t(Et, { className: "h-4 w-4" })
                    }
                  )
                ] })
              ]
            }
          ),
          /* @__PURE__ */ t(
            Je,
            {
              className: "flex-1 min-h-0",
              viewportClassName: "agv-query-builder-scroll flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-3 space-y-2 overscroll-contain",
              children: F === "builder" ? /* @__PURE__ */ r(ge, { children: [
                de(g) && /* @__PURE__ */ r("div", { className: "relative rounded-md border border-[var(--agv-border)] bg-[var(--agv-bg-control)] p-2 text-xs", children: [
                  /* @__PURE__ */ t("div", { className: "flex items-center flex-wrap gap-1 leading-relaxed pr-8", children: Oe(g, 0, !0, "0") }),
                  /* @__PURE__ */ t(
                    x,
                    {
                      variant: "outline",
                      size: "icon-sm",
                      onClick: () => {
                        const e = ce(g, c);
                        e && (navigator.clipboard?.writeText(e), Ne(!0), setTimeout(() => Ne(!1), 2e3));
                      },
                      className: "absolute bottom-1.5 right-1.5 text-[var(--agv-text-muted)] hover:text-[var(--agv-accent)]",
                      children: Ye ? /* @__PURE__ */ t(be, { className: "h-3.5 w-3.5 shrink-0 text-[var(--agv-accent)]" }) : /* @__PURE__ */ t(Rt, { className: "h-3.5 w-3.5 shrink-0" })
                    }
                  )
                ] }),
                Me(g, 0, void 0, void 0, "0")
              ] }) : /* @__PURE__ */ r("div", { className: "space-y-3", children: [
                /* @__PURE__ */ r("div", { className: "rounded-md border border-[var(--agv-border)] bg-[var(--agv-bg-control)] p-2.5 space-y-2", children: [
                  /* @__PURE__ */ t("div", { className: "text-xs font-bold text-[var(--agv-text-main)] select-none", children: "Nạp mẫu mới bằng lệnh CMD" }),
                  /* @__PURE__ */ r("div", { className: "flex items-center gap-1.5 flex-wrap", children: [
                    /* @__PURE__ */ t(
                      "input",
                      {
                        type: "text",
                        value: M,
                        onChange: (e) => {
                          v(e.target.value), _ && se(null);
                        },
                        onKeyDown: (e) => {
                          e.key === "Enter" && (e.preventDefault(), Te());
                        },
                        placeholder: 'Dán chuỗi lệnh CMD vào đây (ví dụ: [Hãng] = "VJ" VÀ [Mã Chỗ] chứa "A")...',
                        ...q,
                        className: `${K} flex-1 px-2`
                      }
                    ),
                    /* @__PURE__ */ t(
                      x,
                      {
                        variant: "default",
                        size: "sm",
                        onClick: Te,
                        className: "font-bold",
                        children: "Kiểm tra & Thêm"
                      }
                    )
                  ] }),
                  _ && /* @__PURE__ */ t("div", { className: "text-xs font-medium text-[var(--agv-danger)] bg-[var(--agv-danger-bg)] p-1.5 rounded border border-[var(--agv-danger)]", children: _ })
                ] }),
                /* @__PURE__ */ r("div", { className: "rounded-md border border-[var(--agv-border)] bg-[var(--agv-bg-control)] p-2.5 space-y-2", children: [
                  /* @__PURE__ */ t("div", { className: "text-xs font-bold text-[var(--agv-text-main)] select-none", children: "Lưu mẫu từ cây điều kiện hiện tại" }),
                  /* @__PURE__ */ r("div", { className: "flex items-center gap-1.5", children: [
                    /* @__PURE__ */ t(
                      "input",
                      {
                        type: "text",
                        value: ee,
                        onChange: (e) => H(e.target.value),
                        placeholder: "Đặt tên mẫu bộ lọc hiện tại...",
                        ...q,
                        className: `${K} flex-1 px-2`
                      }
                    ),
                    /* @__PURE__ */ t(
                      x,
                      {
                        variant: "outline",
                        size: "sm",
                        onClick: rt,
                        children: "Lưu mẫu"
                      }
                    )
                  ] })
                ] }),
                Q.length === 0 ? /* @__PURE__ */ t("div", { className: "py-6 text-center text-xs text-[var(--agv-text-subtle)] italic", children: "Chưa có mẫu nào được lưu" }) : Q.map((e) => {
                  const a = ht(e.tree, c), l = e.cmdText || ce(e.tree, c), s = Xe === e.id;
                  return /* @__PURE__ */ r(
                    "div",
                    {
                      className: "flex flex-col gap-2 rounded-md border border-[var(--agv-border)] bg-[var(--agv-bg-control)] p-2.5 text-xs",
                      children: [
                        /* @__PURE__ */ r("div", { className: "flex items-center justify-between gap-2 flex-wrap", children: [
                          /* @__PURE__ */ r("div", { className: "flex items-center gap-2", children: [
                            /* @__PURE__ */ t("span", { className: "font-bold text-[var(--agv-text-main)]", children: e.name }),
                            a.isValid ? /* @__PURE__ */ t("span", { className: "text-xs font-bold px-1.5 py-0.5 rounded bg-[var(--agv-accent)] text-[var(--agv-accent-text,#ffffff)] select-none", children: "Hợp lệ" }) : /* @__PURE__ */ t("span", { className: "text-xs font-bold px-1.5 py-0.5 rounded bg-[var(--agv-danger-bg)] text-[var(--agv-danger)] border border-[var(--agv-danger)] select-none", children: "Không hợp lệ" })
                          ] }),
                          /* @__PURE__ */ r("div", { className: "flex items-center gap-1 shrink-0 ml-auto", children: [
                            /* @__PURE__ */ t(
                              x,
                              {
                                variant: "outline",
                                size: "sm",
                                onClick: () => {
                                  l && (navigator.clipboard?.writeText(l), ye(e.id), setTimeout(() => ye(null), 2e3));
                                },
                                className: "px-2",
                                children: s ? "Đã chép!" : "Sao chép CMD"
                              }
                            ),
                            /* @__PURE__ */ t(
                              x,
                              {
                                variant: "outline",
                                size: "sm",
                                disabled: !a.isValid,
                                onClick: () => {
                                  a.isValid && (J(JSON.parse(JSON.stringify(e.tree))), I("builder"));
                                },
                                className: "px-2.5",
                                children: "Nạp"
                              }
                            ),
                            /* @__PURE__ */ t(
                              x,
                              {
                                variant: "default",
                                size: "sm",
                                disabled: !a.isValid,
                                onClick: () => {
                                  a.isValid && (X(JSON.parse(JSON.stringify(e.tree))), N());
                                },
                                className: "px-2.5 font-bold",
                                children: "Áp dụng"
                              }
                            ),
                            /* @__PURE__ */ t(
                              x,
                              {
                                variant: "destructive",
                                size: "icon-sm",
                                onClick: () => nt(e.id),
                                children: /* @__PURE__ */ t(fe, { className: "h-3.5 w-3.5" })
                              }
                            )
                          ] })
                        ] }),
                        !a.isValid && /* @__PURE__ */ t("div", { className: "text-xs text-[var(--agv-danger)] font-medium bg-[var(--agv-danger-bg)] p-1.5 rounded border border-[var(--agv-danger)]", children: a.error }),
                        /* @__PURE__ */ r("div", { className: "flex flex-col gap-1.5 rounded border border-[var(--agv-border)] bg-[var(--agv-bg-popup)] px-2.5 py-1.5 text-xs select-text", children: [
                          /* @__PURE__ */ r("div", { className: "flex items-center gap-1.5 overflow-hidden", children: [
                            /* @__PURE__ */ t("span", { className: "font-semibold text-[var(--agv-accent)] select-none shrink-0", children: "Lệnh CMD:" }),
                            /* @__PURE__ */ t("span", { className: "font-mono text-xs text-[var(--agv-text-main)] truncate select-all", children: l || "(Trống)" })
                          ] }),
                          /* @__PURE__ */ t("div", { className: "flex items-center flex-wrap gap-1 leading-relaxed pt-0.5 border-t border-[var(--agv-border)]", children: Ae(e.tree, 0) })
                        ] })
                      ]
                    },
                    e.id
                  );
                })
              ] })
            }
          ),
          /* @__PURE__ */ r("div", { className: "flex items-center justify-between border-t border-[var(--agv-border)] px-3 py-2 bg-[var(--agv-bg-header)] shrink-0", children: [
            /* @__PURE__ */ r("div", { className: "text-xs font-medium text-[var(--agv-text-muted)] tabular-nums whitespace-nowrap select-none", children: [
              we.toLocaleString("vi-VN"),
              "/",
              k.toLocaleString("vi-VN"),
              " (",
              k > 0 ? Math.round(we / k * 100) : 0,
              "%)"
            ] }),
            /* @__PURE__ */ r("div", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ t(
                x,
                {
                  variant: "destructive",
                  size: "sm",
                  onClick: st,
                  children: "Hủy"
                }
              ),
              /* @__PURE__ */ r(
                x,
                {
                  variant: "default",
                  size: "sm",
                  onClick: () => {
                    X(JSON.parse(JSON.stringify(g))), N();
                  },
                  className: "font-bold",
                  children: [
                    /* @__PURE__ */ t(be, { className: "h-3 w-3 stroke-[3]" }),
                    /* @__PURE__ */ t("span", { children: "Áp dụng" })
                  ]
                }
              )
            ] })
          ] }),
          C && /* @__PURE__ */ t(
            Mt,
            {
              isOpen: !!C,
              onClose: () => te(null),
              anchorEl: C.anchorEl,
              column: c.find((e) => e.key === C.field) || {
                key: C.field,
                title: C.field,
                defaultWidth: 100
              },
              currentFilter: (() => {
                const e = C.group.rules[C.rIdx];
                if (e)
                  return {
                    op: e.operator || pe.EQUALS,
                    val: e.value || "",
                    mode: ut.MULTI,
                    multiValues: e.multiValues,
                    multiRanges: e.multiRanges
                  };
              })(),
              onApply: (e, a) => {
                const { group: l, rIdx: s } = C;
                y(l, s, (o) => {
                  const n = !!(a.multiValues && a.multiValues.length > 0), m = !!(a.multiRanges && a.multiRanges.length > 0);
                  return {
                    ...o,
                    operator: a.op || o.operator,
                    value: n ? a.multiValues[0] || "" : a.val || "",
                    multiValues: n ? a.multiValues : void 0,
                    multiRanges: m ? a.multiRanges : void 0
                  };
                }), te(null);
              },
              onClear: () => {
                const { group: e, rIdx: a } = C;
                y(e, a, (l) => ({
                  ...l,
                  value: "",
                  valueTo: "",
                  multiValues: void 0,
                  multiRanges: void 0
                })), te(null);
              },
              hasColumnEmptyCells: P,
              getColumnDateBounds: V,
              surfaceTheme: R
            }
          )
        ]
      }
    );
  }
);
export {
  ra as AdvGridQueryBuilderModal,
  Pe as QueryCustomSelect,
  Vt as getColType
};
