import { jsx as a, jsxs as g } from "react/jsx-runtime";
import { useState as I, useRef as De, useMemo as K, useEffect as Ne } from "react";
import { o as Q, D as c, j as O, m as L, b as P, F, E as qe, f as Ce, q as Ge } from "./gridFormatUtils-wCKPmlrt.js";
import { a as z, F as Je, g as Ze } from "./FilterIcons-nsUh2HLg.js";
import { expandAllShortcuts as Ke } from "./smartNumberUtils-CUYJXloj.js";
import { p as Qe } from "./queryUtils-DpX12s9D.js";
import { NumberRangeFilterInput as Re, SmartNumberFilterInput as et } from "./GridSmartNumberInputs-B2jzNczI.js";
import { TimeRangeFilterInput as we, TimeFilterInput as tt } from "./GridTimeFilterInputs-VIGIdPv1.js";
import { A as Ae, a as _e } from "./AdvDatePicker-C4uBzJBl.js";
import { N as ue, A as q } from "./AdvButton-Ck5SixaL.js";
import { D as rt, a as ot, b as lt, c as at, d as nt, e as it, f as st, g as mt } from "./AdvDrawer-BPHcjNKA.js";
import { X as pe } from "./x-CdrDtutQ.js";
const ct = [
  { dir: "asc", label: "Tăng dần" },
  { dir: "desc", label: "Giảm dần" }
], dt = [
  { mode: "simple", label: "Một giá trị" },
  { mode: "multi", label: "Nhiều giá trị" }
];
function ee(i) {
  if (!i.trim()) return [];
  const _ = i.split(/[\r\n,;\t]+/).map((d) => d.trim()).filter((d) => d.length > 0), A = /* @__PURE__ */ new Set(), D = [];
  for (const d of _) {
    const $ = d.toLowerCase();
    A.has($) || (A.add($), D.push(d));
  }
  return D;
}
function fe(i, _, A) {
  if (!i) return { from: "", to: "" };
  if (i.includes("..")) {
    const d = i.split("..");
    return { from: d[0]?.trim() || "", to: d[1]?.trim() || "" };
  }
  if (i.includes(" - ")) {
    const d = i.split(" - ");
    return { from: d[0]?.trim() || "", to: d[1]?.trim() || "" };
  }
  if (_ === c.NUMBER && i.includes("/")) {
    const d = i.split("/");
    return { from: d[0]?.trim() || "", to: d[1]?.trim() || "" };
  }
  if (i.includes("~")) {
    const d = i.split("~");
    return { from: d[0]?.trim() || "", to: d[1]?.trim() || "" };
  }
  const D = i.trim();
  return D ? _ === c.DATE ? { from: D, to: D } : { from: D, to: "" } : { from: "", to: "" };
}
function Ee(i) {
  return i ? O(i.op) || i.mode === F.MULTI && (Array.isArray(i.multiValues) && i.multiValues.length > 0 || Array.isArray(i.multiRanges) && i.multiRanges.length > 0) ? !0 : typeof i.val == "string" && i.val.trim().length > 0 : !1;
}
const Nt = ({
  isOpen: i,
  onClose: _,
  columns: A,
  totalRows: D,
  sortConfig: d,
  onSortChange: $,
  searchQuery: te = "",
  onSearchQueryChange: re,
  columnFilters: x = {},
  onColumnFilterChange: U,
  onClearAllColumnFilters: Ve,
  hasColumnEmptyCells: Se,
  getColumnDateBounds: Le,
  surfaceTheme: j = "light",
  enableSorting: $e = !0,
  enableFiltering: Ie = !0,
  enableQuickSearch: Oe = !0
}) => {
  const N = Oe && !!re, E = Ie && !!U, y = N || E, C = $e && !!$, he = C && y, [G, W] = I(y ? "filter" : "sort"), [X, J] = I(d?.key || ""), [ge, oe] = I(
    d?.direction || "asc"
  ), [Z, le] = I("__ALL__"), [ve, ae] = I(""), [R, ne] = I({}), [Me, ie] = I(""), H = De(/* @__PURE__ */ new Set()), be = De(!1), Be = K(() => A.filter(
    (e) => !e.isSelection && e.key !== "col_chk" && e.key !== "col_stt" && e.sortable !== !1 && !e.isChart
  ), [A]), V = K(() => A.filter(
    (e) => !e.isSelection && e.key !== "col_chk" && e.key !== "col_stt" && e.filterable !== !1 && !e.isChart
  ), [A]), xe = K(() => {
    const e = {};
    return V.forEach((t) => {
      e[t.key] = t;
    }), e;
  }, [V]), M = (e, t) => {
    const o = Ze(e.key, [e], Se);
    return t === "multi" ? o.filter((r) => !z[r]?.noInput) : o;
  }, Y = (e, t) => {
    const o = M(e, t);
    if (e.isDateRange && o.includes(P.BETWEEN))
      return P.BETWEEN;
    const r = Ge(e.key, [e]);
    return o.includes(r) && !z[r]?.noInput ? r : o.find((p) => !z[p]?.noInput) || o[0] || P.CONTAINS;
  }, T = (e, t) => {
    const o = Q(e.key, [e]), r = M(e, "simple"), n = M(e, "multi"), p = Y(e, "simple"), h = Y(e, "multi");
    if (t?.mode === F.MULTI && (Array.isArray(t.multiValues) && t.multiValues.length > 0 || Array.isArray(t.multiRanges) && t.multiRanges.length > 0) && t) {
      const v = t.op && n.includes(t.op) ? t.op : h, m = Array.isArray(t.multiValues) ? t.multiValues : [], f = Array.isArray(t.multiRanges) && t.multiRanges.length > 0 ? t.multiRanges.map((B) => ({ from: B.from || "", to: B.to || "" })) : [{ from: "", to: "" }];
      return {
        mode: "multi",
        op: v,
        singleVal: "",
        multiText: o === c.DATE ? "" : m.join(`
`),
        multiRanges: f,
        discreteDates: o === c.DATE ? [...m] : []
      };
    }
    if (t && Ee(t)) {
      const v = t.op && r.includes(t.op) ? t.op : p, m = typeof t.val == "string" ? t.val : "", f = fe(m, o, e.isDateRange), B = m.includes("..") || L(v);
      return {
        mode: "simple",
        op: v,
        singleVal: O(v) ? "" : m,
        multiText: !B && o !== c.DATE ? m : "",
        multiRanges: B && (f.from || f.to) ? [f] : [{ from: "", to: "" }],
        discreteDates: !B && o === c.DATE && m.trim() ? [m.trim()] : []
      };
    }
    return {
      mode: "simple",
      op: p,
      singleVal: "",
      multiText: "",
      multiRanges: [{ from: "", to: "" }],
      discreteDates: []
    };
  }, ye = K(() => {
    const e = [];
    return N && e.push({ label: "Tất cả các cột (Toàn văn)", value: "__ALL__" }), E && V.forEach((t) => {
      e.push({
        label: t.title || t.key,
        value: t.key
      });
    }), e;
  }, [N, E, V]);
  Ne(() => {
    if (i && !be.current) {
      J(d?.key || ""), oe(d?.direction || "asc"), ae(te || ""), ie("");
      const e = {};
      let t = "";
      V.forEach((r) => {
        const n = x[r.key];
        e[r.key] = T(r, n), !t && Ee(n) && (t = r.key);
      }), ne(e), H.current = /* @__PURE__ */ new Set();
      let o = "__ALL__";
      N && (te || "").trim().length > 0 ? o = "__ALL__" : E && t ? o = t : N ? o = "__ALL__" : o = V[0]?.key || "__ALL__", le(o), W(y ? "filter" : "sort");
    }
    be.current = i;
  }, [
    i,
    d,
    te,
    N,
    E,
    y,
    V,
    x
  ]), Ne(() => {
    G === "filter" && !y && C ? W("sort") : G === "sort" && !C && y && W("filter");
  }, [G, y, C]);
  const u = (e, t) => {
    H.current.add(e.key), ne((o) => {
      const r = o[e.key] ?? T(e, x[e.key]);
      return {
        ...o,
        [e.key]: {
          ...r,
          ...t
        }
      };
    });
  }, Pe = (e) => {
    H.current.add("__ALL__"), ae(e);
  }, ze = (e, t) => {
    const o = Q(e.key, [e]), r = R[e.key] ?? T(e, x[e.key]), n = M(e, t), p = Y(e, t);
    let h = r.op;
    if ((!n.includes(h) || O(h)) && (h = p), t === "multi") {
      const b = {
        mode: "multi",
        op: h
      };
      if (L(h)) {
        if (!r.multiRanges.some(
          (m) => m.from.trim().length > 0 || m.to.trim().length > 0
        ) && r.singleVal.trim()) {
          const m = fe(r.singleVal, o, e.isDateRange);
          (m.from || m.to) && (b.multiRanges = [m]);
        }
      } else if (o === c.DATE) {
        if (r.discreteDates.length === 0 && r.singleVal.trim() && !r.singleVal.includes("..")) {
          const v = Ce(r.singleVal.trim(), !1, !!e.showTime) || r.singleVal.trim();
          b.discreteDates = [v];
        }
      } else !r.multiText.trim() && r.singleVal.trim() && !r.singleVal.includes("..") && (b.multiText = r.singleVal.trim());
      u(e, b);
    } else {
      const b = {
        mode: "simple",
        op: h
      };
      if (!r.singleVal.trim())
        if (L(h)) {
          const v = r.multiRanges.find(
            (m) => m.from.trim().length > 0 || m.to.trim().length > 0
          );
          if (v) {
            const m = v.from.trim(), f = v.to.trim();
            b.singleVal = m && f ? `${m}..${f}` : m ? `${m}..` : f ? `..${f}` : "";
          }
        } else if (o === c.DATE && r.discreteDates.length === 1)
          b.singleVal = r.discreteDates[0];
        else {
          const v = ee(r.multiText);
          v.length === 1 && (b.singleVal = v[0]);
        }
      u(e, b);
    }
  }, Fe = (e, t) => {
    R[e.key] ?? T(e, x[e.key]), O(t) ? u(e, { mode: "simple", op: t }) : u(e, { op: t });
  }, Ue = (e, t) => {
    const o = t.clipboardData?.getData("text") ?? "";
    if (/[\r\n\t]/.test(o)) {
      t.preventDefault();
      const r = R[e.key] ?? T(e, x[e.key]), p = M(e, "multi").includes(r.op) && !O(r.op) ? r.op : Y(e, "multi"), h = r.singleVal.trim() ? `${r.singleVal.trim()}
${o}` : o;
      u(e, {
        mode: "multi",
        op: p,
        multiText: h
      });
    }
  }, se = (e, t) => {
    const o = t.trim();
    if (!o) return;
    const r = Ce(o, !1, !!e.showTime) || o, n = R[e.key] ?? T(e, x[e.key]);
    n.discreteDates.includes(r) || u(e, {
      discreteDates: [...n.discreteDates, r]
    }), ie("");
  }, je = (e, t) => {
    const o = R[e.key] ?? T(e, x[e.key]);
    u(e, {
      discreteDates: o.discreteDates.filter((r) => r !== t)
    });
  }, me = (e, t, o, r) => {
    const p = [...(R[e.key] ?? T(e, x[e.key])).multiRanges];
    p[t] = { from: o, to: r }, u(e, { multiRanges: p });
  }, We = (e, t) => {
    const o = R[e.key] ?? T(e, x[e.key]), r = o.multiRanges.length <= 1 ? [{ from: "", to: "" }] : o.multiRanges.filter((n, p) => p !== t);
    u(e, { multiRanges: r });
  }, Xe = (e) => {
    const t = R[e.key] ?? T(e, x[e.key]);
    u(e, {
      multiRanges: [...t.multiRanges, { from: "", to: "" }]
    });
  }, He = (e) => {
    J(X === e ? "" : e);
  }, ce = () => {
    C && $?.(X ? {
      key: X,
      direction: ge
    } : null), y && H.current.forEach((e) => {
      if (e === "__ALL__") {
        N && re?.(ve.trim());
        return;
      }
      if (!E) return;
      const t = xe[e], o = R[e];
      if (!t || !o) return;
      const r = x[e] || {}, n = Q(t.key, [t]);
      if (O(o.op)) {
        U?.(e, {
          ...r,
          op: o.op,
          val: "",
          mode: F.SIMPLE,
          multiValues: void 0,
          multiRanges: void 0
        });
        return;
      }
      if (o.mode === "multi") {
        let h, b;
        L(o.op) && (n === c.NUMBER || n === c.DATE || n === c.TIME) ? b = o.multiRanges.map((f) => ({ from: f.from.trim(), to: f.to.trim() })).filter((f) => f.from.length > 0 || f.to.length > 0) : n === c.DATE ? h = o.discreteDates.filter((f) => f.trim().length > 0) : n === c.NUMBER ? h = ee(o.multiText).map((f) => Ke(f)).filter((f) => !isNaN(parseFloat(f.replace(/,/g, "")))) : n === c.TIME || t.editorType === qe.TIME ? h = ee(o.multiText).filter(
          (f) => Qe(f) !== null
        ) : h = ee(o.multiText);
        const v = Array.isArray(h) && h.length > 0, m = Array.isArray(b) && b.length > 0;
        if (!v && !m) {
          U?.(e, {
            ...r,
            op: Y(t, "simple"),
            val: "",
            mode: F.SIMPLE,
            multiValues: void 0,
            multiRanges: void 0
          });
          return;
        }
        U?.(e, {
          ...r,
          op: o.op,
          val: v ? h.join("; ") : `${b.length} khoảng`,
          mode: F.MULTI,
          multiValues: h,
          multiRanges: b
        });
        return;
      }
      const p = o.singleVal.trim();
      U?.(e, {
        ...r,
        op: o.op,
        val: p,
        mode: F.SIMPLE,
        multiValues: void 0,
        multiRanges: void 0
      });
    }), _();
  }, Ye = () => {
    J(""), oe("asc"), le(N ? "__ALL__" : V[0]?.key || "__ALL__"), ae(""), ne({}), ie(""), H.current = /* @__PURE__ */ new Set(), C && $?.(null), N && re?.(""), E && Ve?.(), _();
  };
  if (!C && !y) return null;
  const ke = C && y ? "LỌC & SẮP XẾP" : C ? "SẮP XẾP" : "TÌM KIẾM & BỘ LỌC", w = he ? G : y ? "filter" : "sort", l = Z !== "__ALL__" ? xe[Z] : void 0, s = l ? R[l.key] ?? T(l, x[l.key]) : void 0, k = l ? Q(l.key, [l]) : c.TEXT, de = l && s ? M(l, s.mode) : [], Te = s ? O(s.op) : !1, S = l ? l.minDate && l.maxDate ? { min: l.minDate, max: l.maxDate } : Le?.(l.key) || { min: "2017-01-01", max: "2027-12-31" } : { min: "2017-01-01", max: "2027-12-31" };
  return /* @__PURE__ */ a(
    rt,
    {
      open: i,
      onOpenChange: (e) => {
        e || _();
      },
      surfaceTheme: j,
      children: /* @__PURE__ */ g(ot, { children: [
        /* @__PURE__ */ a(lt, {}),
        /* @__PURE__ */ g(at, { children: [
          /* @__PURE__ */ a(nt, { children: ke }),
          /* @__PURE__ */ g(it, { children: [
            "Áp dụng cho dữ liệu hiển thị (",
            D.toLocaleString("vi-VN"),
            ")"
          ] }),
          he && /* @__PURE__ */ g(
            "div",
            {
              role: "tablist",
              "aria-label": ke,
              className: "mt-3 grid grid-cols-2 rounded-md border overflow-hidden",
              style: { borderColor: "var(--control-border)" },
              children: [
                /* @__PURE__ */ a(
                  "button",
                  {
                    type: "button",
                    role: "tab",
                    "aria-selected": w === "filter",
                    onClick: () => W("filter"),
                    className: `h-9 min-h-[36px] px-3 text-xs font-semibold cursor-pointer touch-manipulation ${w === "filter" ? "" : "hover:bg-surface-hover"}`,
                    style: {
                      backgroundColor: w === "filter" ? "var(--popup-item-selected-bg)" : "var(--control-background)",
                      color: w === "filter" ? "var(--popup-item-selected-fg, #ffffff)" : "var(--agv-text-main)"
                    },
                    children: "Tìm kiếm & Lọc"
                  }
                ),
                /* @__PURE__ */ a(
                  "button",
                  {
                    type: "button",
                    role: "tab",
                    "aria-selected": w === "sort",
                    onClick: () => W("sort"),
                    className: `h-9 min-h-[36px] px-3 text-xs font-semibold border-l cursor-pointer touch-manipulation ${w === "sort" ? "" : "hover:bg-surface-hover"}`,
                    style: {
                      borderColor: "var(--agv-border)",
                      backgroundColor: w === "sort" ? "var(--popup-item-selected-bg)" : "var(--control-background)",
                      color: w === "sort" ? "var(--popup-item-selected-fg, #ffffff)" : "var(--agv-text-main)"
                    },
                    children: "Sắp xếp"
                  }
                )
              ]
            }
          )
        ] }),
        /* @__PURE__ */ g(st, { className: "space-y-3", children: [
          w === "filter" && y && /* @__PURE__ */ g("div", { role: "tabpanel", className: "space-y-3", children: [
            Z === "__ALL__" && N && /* @__PURE__ */ a(
              "input",
              {
                type: "text",
                value: ve,
                onChange: (e) => Pe(e.target.value),
                onKeyDown: (e) => {
                  e.key === "Enter" && ce();
                },
                placeholder: "Nhập dữ liệu cần tìm...",
                ...ue,
                className: "agv-control w-full h-10 md:h-9 min-h-[36px] px-3 text-xs"
              }
            ),
            l && s && /* @__PURE__ */ g("div", { className: "space-y-2", children: [
              /* @__PURE__ */ g("div", { className: "flex items-center justify-between gap-2", children: [
                /* @__PURE__ */ g(
                  "div",
                  {
                    className: "flex items-center gap-1 min-w-0 flex-1 text-xs font-medium",
                    style: { color: "var(--agv-text-muted)" },
                    children: [
                      /* @__PURE__ */ a("span", { className: "truncate", children: l.title || l.key }),
                      /* @__PURE__ */ g("span", { className: "shrink-0", children: [
                        "· ",
                        z[s.op]?.label || s.op
                      ] })
                    ]
                  }
                ),
                /* @__PURE__ */ a(
                  "div",
                  {
                    className: "inline-flex rounded-md border overflow-hidden shrink-0",
                    style: { borderColor: "var(--control-border)" },
                    children: dt.map((e, t) => {
                      const o = !Te && s.mode === e.mode;
                      return /* @__PURE__ */ a(
                        "button",
                        {
                          type: "button",
                          "aria-pressed": o,
                          onClick: () => ze(l, e.mode),
                          className: `h-8 min-h-[32px] px-3 text-xs font-medium cursor-pointer touch-manipulation ${t > 0 ? "border-l" : ""} ${o ? "" : "hover:bg-surface-hover"}`,
                          style: {
                            borderColor: t > 0 ? "var(--agv-border)" : void 0,
                            backgroundColor: o ? "var(--popup-item-selected-bg)" : "var(--control-background)",
                            color: o ? "var(--popup-item-selected-fg, #ffffff)" : "var(--agv-text-main)"
                          },
                          children: e.label
                        },
                        e.mode
                      );
                    })
                  }
                )
              ] }),
              de.length > 0 && /* @__PURE__ */ a(
                "div",
                {
                  role: "radiogroup",
                  "aria-label": `Toán tử lọc ${l.title || l.key}`,
                  className: "grid w-full rounded-md border overflow-hidden",
                  style: {
                    borderColor: "var(--control-border)",
                    gridTemplateColumns: `repeat(${de.length}, minmax(0, 1fr))`
                  },
                  children: de.map((e, t) => {
                    const o = s.op === e;
                    return /* @__PURE__ */ a(
                      "button",
                      {
                        type: "button",
                        role: "radio",
                        "aria-checked": o,
                        "aria-label": z[e]?.label || e,
                        onClick: () => Fe(l, e),
                        className: `h-9 min-h-[36px] flex items-center justify-center cursor-pointer touch-manipulation ${t > 0 ? "border-l" : ""} ${o ? "" : "hover:bg-surface-hover"}`,
                        style: {
                          borderColor: t > 0 ? "var(--agv-border)" : void 0,
                          backgroundColor: o ? "var(--popup-item-selected-bg)" : "var(--control-background)",
                          color: o ? "var(--popup-item-selected-fg, #ffffff)" : "var(--agv-text-main)"
                        },
                        children: /* @__PURE__ */ a(Je, { op: e, size: 14, className: "shrink-0" })
                      },
                      e
                    );
                  })
                }
              ),
              !Te && (s.mode === "simple" ? (() => {
                const e = z[s.op]?.label || "Nhập dữ liệu", t = s.singleVal.trim().length > 0, o = fe(
                  s.singleVal,
                  k,
                  l.isDateRange
                );
                return k === c.DATE ? l.isDateRange || L(s.op) ? /* @__PURE__ */ a(
                  Ae,
                  {
                    from: o.from,
                    to: o.to,
                    onChange: (r) => {
                      const n = r.from || "", p = r.to || "", h = n && p ? `${n}..${p}` : n ? `${n}..` : p ? `..${p}` : "";
                      u(l, {
                        singleVal: h,
                        op: P.BETWEEN
                      });
                    },
                    min: S.min,
                    max: S.max,
                    placeholderFrom: l.isDateRange ? "Ngày đi" : "Từ",
                    placeholderTo: l.isDateRange ? "Ngày về" : "Đến",
                    theme: j,
                    size: "md",
                    showPreset: !0,
                    dualMonth: !1,
                    showTime: !!l.showTime
                  }
                ) : /* @__PURE__ */ a(
                  _e,
                  {
                    value: s.singleVal,
                    onChange: (r, n) => {
                      n && n.from && n.to && n.from !== n.to ? u(l, {
                        singleVal: `${n.from}..${n.to}`,
                        op: P.BETWEEN
                      }) : u(l, { singleVal: r });
                    },
                    min: S.min,
                    max: S.max,
                    placeholder: `${e}...`,
                    showTime: !!l.showTime,
                    theme: j,
                    showPreset: !0,
                    size: "md",
                    className: "w-full"
                  }
                ) : k === c.TIME ? L(s.op) ? /* @__PURE__ */ a("div", { className: "agv-control agv-control-box w-full h-10 md:h-9 min-h-[36px] flex items-center px-2", children: /* @__PURE__ */ a(
                  we,
                  {
                    from: o.from,
                    to: o.to,
                    onChange: (r, n) => {
                      const p = r && n ? r === n ? r : `${r}..${n}` : r || (n ? `..${n}` : "");
                      u(l, { singleVal: p });
                    },
                    onClear: () => u(l, { singleVal: "" }),
                    hasValue: t
                  }
                ) }) : /* @__PURE__ */ a("div", { className: "agv-control agv-control-box w-full h-10 md:h-9 min-h-[36px] flex items-center px-2", children: /* @__PURE__ */ a(
                  tt,
                  {
                    value: s.singleVal,
                    onChange: (r) => u(l, { singleVal: r }),
                    onClear: () => u(l, { singleVal: "" }),
                    placeholder: "HH:mm",
                    hasValue: t
                  }
                ) }) : k === c.NUMBER ? L(s.op) ? /* @__PURE__ */ a("div", { className: "agv-control agv-control-box w-full h-10 md:h-9 min-h-[36px] flex items-center px-2", children: /* @__PURE__ */ a(
                  Re,
                  {
                    from: o.from,
                    to: o.to,
                    onChange: (r, n) => {
                      const p = r && n ? `${r}..${n}` : r ? `${r}..` : n ? `..${n}` : "";
                      u(l, {
                        singleVal: p,
                        op: P.BETWEEN
                      });
                    },
                    onClear: () => u(l, { singleVal: "" }),
                    hasValue: t
                  }
                ) }) : /* @__PURE__ */ a("div", { className: "agv-control agv-control-box w-full h-10 md:h-9 min-h-[36px] flex items-center px-2", children: /* @__PURE__ */ a(
                  et,
                  {
                    value: s.singleVal,
                    onChange: (r, n) => {
                      u(l, {
                        singleVal: r,
                        ...n ? { op: n } : {}
                      });
                    },
                    onClear: () => u(l, { singleVal: "" }),
                    placeholder: `${e}...`,
                    hasValue: t
                  }
                ) }) : /* @__PURE__ */ g("div", { className: "agv-control agv-control-box relative w-full h-10 md:h-9 min-h-[36px] flex items-center px-3", children: [
                  /* @__PURE__ */ a(
                    "input",
                    {
                      type: "text",
                      value: s.singleVal,
                      onChange: (r) => u(l, { singleVal: r.target.value }),
                      onPaste: (r) => Ue(l, r),
                      onKeyDown: (r) => {
                        r.key === "Enter" && ce();
                      },
                      placeholder: `${e}...`,
                      ...ue,
                      className: `w-full h-full bg-transparent text-xs outline-none border-none placeholder:text-[var(--agv-text-muted)] placeholder:opacity-60 ${t ? "pr-7" : ""}`,
                      style: { color: "var(--agv-text-main)", minHeight: "28px" }
                    }
                  ),
                  t && /* @__PURE__ */ a(
                    "button",
                    {
                      type: "button",
                      "aria-label": "Xóa giá trị lọc",
                      onClick: () => u(l, { singleVal: "" }),
                      className: "agv-inline-clear-destructive absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 min-h-[28px] min-w-[28px] rounded touch-manipulation",
                      children: /* @__PURE__ */ a(pe, { size: 13, strokeWidth: 2.2 })
                    }
                  )
                ] });
              })() : (
                /* CHẾ ĐỘ NHIỀU GIÁ TRỊ (MULTI) ĐỒNG BỘ THEO DẠNG CỘT & TOÁN TỬ NHƯ PC */
                (() => {
                  if (L(s.op) && (k === c.NUMBER || k === c.DATE || k === c.TIME)) {
                    const e = k === c.DATE ? "+ Thêm khoảng ngày" : k === c.TIME ? "+ Thêm khoảng giờ" : "+ Thêm khoảng số";
                    return /* @__PURE__ */ g("div", { className: "space-y-2", children: [
                      /* @__PURE__ */ a(
                        "div",
                        {
                          className: `space-y-2 ${s.multiRanges.length > 3 ? "max-h-[148px] overflow-y-auto pr-1" : ""}`,
                          children: s.multiRanges.map((t, o) => /* @__PURE__ */ g(
                            "div",
                            {
                              className: "flex items-center gap-2 w-full min-w-0",
                              children: [
                                /* @__PURE__ */ g(
                                  "span",
                                  {
                                    className: "text-xs w-6 min-w-[24px] shrink-0 text-center select-none tabular-nums",
                                    style: { color: "var(--agv-text-muted)" },
                                    children: [
                                      "#",
                                      o + 1
                                    ]
                                  }
                                ),
                                /* @__PURE__ */ a("div", { className: "flex-1 min-w-0", children: k === c.DATE ? /* @__PURE__ */ a(
                                  Ae,
                                  {
                                    from: t.from,
                                    to: t.to,
                                    onChange: (r) => me(
                                      l,
                                      o,
                                      r.from || "",
                                      r.to || ""
                                    ),
                                    min: S.min,
                                    max: S.max,
                                    placeholderFrom: "Từ",
                                    placeholderTo: "Đến",
                                    theme: j,
                                    size: "md",
                                    showPreset: !0,
                                    dualMonth: !1,
                                    showTime: !!l.showTime
                                  }
                                ) : k === c.TIME ? /* @__PURE__ */ a("div", { className: "agv-control agv-control-box w-full h-10 md:h-9 min-h-[36px] flex items-center px-2", children: /* @__PURE__ */ a(
                                  we,
                                  {
                                    from: t.from,
                                    to: t.to,
                                    onChange: (r, n) => me(l, o, r, n),
                                    hasValue: !1
                                  }
                                ) }) : /* @__PURE__ */ a("div", { className: "agv-control agv-control-box w-full h-10 md:h-9 min-h-[36px] flex items-center px-2", children: /* @__PURE__ */ a(
                                  Re,
                                  {
                                    from: t.from,
                                    to: t.to,
                                    onChange: (r, n) => me(l, o, r, n),
                                    hasValue: !1
                                  }
                                ) }) }),
                                /* @__PURE__ */ a(
                                  q,
                                  {
                                    variant: "destructive",
                                    size: "icon",
                                    "aria-label": `Xóa khoảng ${o + 1}`,
                                    onClick: () => We(l, o),
                                    className: "touch-manipulation",
                                    children: /* @__PURE__ */ a(pe, { size: 14, strokeWidth: 2.2 })
                                  }
                                )
                              ]
                            },
                            o
                          ))
                        }
                      ),
                      /* @__PURE__ */ a(
                        q,
                        {
                          variant: "ghost",
                          size: "default",
                          onClick: () => Xe(l),
                          className: "w-full text-[var(--agv-accent)] font-medium touch-manipulation",
                          children: e
                        }
                      )
                    ] });
                  }
                  return k === c.DATE ? /* @__PURE__ */ g("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ a(
                      _e,
                      {
                        value: Me,
                        onChange: (e, t) => {
                          t?.from && t?.to && t.from !== t.to ? (se(l, t.from), se(l, t.to)) : e && se(l, e);
                        },
                        min: S.min,
                        max: S.max,
                        placeholder: "Chọn ngày để thêm vào danh sách...",
                        showTime: !!l.showTime,
                        theme: j,
                        showPreset: !0,
                        size: "md",
                        className: "w-full"
                      }
                    ),
                    /* @__PURE__ */ a(
                      "div",
                      {
                        className: "flex flex-wrap gap-2 min-h-[52px] max-h-[120px] overflow-y-auto p-2 rounded-md border",
                        style: {
                          borderColor: "var(--control-border)",
                          backgroundColor: "var(--control-background)"
                        },
                        children: s.discreteDates.length === 0 ? /* @__PURE__ */ a(
                          "span",
                          {
                            className: "text-xs italic self-center",
                            style: { color: "var(--agv-text-muted)" },
                            children: "Chưa chọn ngày nào."
                          }
                        ) : s.discreteDates.map((e) => /* @__PURE__ */ g(
                          q,
                          {
                            variant: "destructive",
                            size: "sm",
                            onClick: () => je(l, e),
                            className: "px-2 gap-1 font-medium touch-manipulation",
                            children: [
                              /* @__PURE__ */ a("span", { className: "tabular-nums", children: e }),
                              /* @__PURE__ */ a(pe, { size: 12, strokeWidth: 2.2, className: "shrink-0" })
                            ]
                          },
                          e
                        ))
                      }
                    )
                  ] }) : /* @__PURE__ */ a(
                    "textarea",
                    {
                      rows: 3,
                      value: s.multiText,
                      onChange: (e) => u(l, { multiText: e.target.value }),
                      placeholder: "Dán hoặc nhập danh sách (mỗi dòng hoặc dấu phẩy)...",
                      ...ue,
                      className: "agv-control w-full min-h-[80px] max-h-[120px] px-3 py-2 text-xs leading-relaxed resize-y overflow-y-auto"
                    }
                  );
                })()
              ))
            ] }),
            E && ye.length > 1 && /* @__PURE__ */ g("div", { className: "space-y-2", children: [
              /* @__PURE__ */ a(
                "div",
                {
                  className: "text-xs font-medium",
                  style: { color: "var(--agv-text-muted)" },
                  children: "Chọn phạm vi tìm kiếm:"
                }
              ),
              /* @__PURE__ */ a("div", { className: "flex flex-wrap gap-2", children: ye.map((e) => {
                const t = Z === e.value;
                return /* @__PURE__ */ a(
                  "button",
                  {
                    type: "button",
                    "aria-pressed": t,
                    onClick: () => le(e.value),
                    className: `min-h-[36px] h-9 px-3 py-2 inline-flex items-center justify-center rounded-md border text-xs font-medium cursor-pointer touch-manipulation ${t ? "" : "hover:bg-surface-hover"}`,
                    style: {
                      backgroundColor: t ? "var(--popup-item-selected-bg)" : "var(--control-background)",
                      borderColor: t ? "var(--popup-item-selected-bg)" : "var(--control-border)",
                      color: t ? "var(--popup-item-selected-fg, #ffffff)" : "var(--agv-text-main)"
                    },
                    children: e.label
                  },
                  e.value
                );
              }) })
            ] })
          ] }),
          w === "sort" && C && /* @__PURE__ */ g("div", { role: "tabpanel", className: "space-y-3", children: [
            /* @__PURE__ */ g("div", { className: "flex items-center justify-between gap-3", children: [
              /* @__PURE__ */ a(
                "span",
                {
                  className: "text-xs font-medium shrink-0",
                  style: { color: "var(--agv-text-muted)" },
                  children: "Chiều sắp xếp"
                }
              ),
              /* @__PURE__ */ a(
                "div",
                {
                  className: "inline-flex rounded-md border overflow-hidden shrink-0",
                  style: { borderColor: "var(--control-border)" },
                  children: ct.map((e, t) => {
                    const o = !!X, r = o && ge === e.dir;
                    return /* @__PURE__ */ a(
                      "button",
                      {
                        type: "button",
                        disabled: !o,
                        "aria-pressed": r,
                        onClick: () => oe(e.dir),
                        className: `h-9 min-h-[36px] px-3 text-xs font-medium touch-manipulation ${t > 0 ? "border-l" : ""} ${o ? r ? "cursor-pointer" : "cursor-pointer hover:bg-surface-hover" : "opacity-50 cursor-not-allowed"}`,
                        style: {
                          borderColor: t > 0 ? "var(--agv-border)" : void 0,
                          backgroundColor: r ? "var(--popup-item-selected-bg)" : "var(--control-background)",
                          color: r ? "var(--popup-item-selected-fg, #ffffff)" : "var(--agv-text-main)"
                        },
                        children: e.label
                      },
                      e.dir
                    );
                  })
                }
              )
            ] }),
            /* @__PURE__ */ a(
              "div",
              {
                role: "listbox",
                "aria-label": "Danh sách cột sắp xếp",
                className: "rounded-md border overflow-hidden",
                style: {
                  borderColor: "var(--control-border)",
                  backgroundColor: "var(--control-background)"
                },
                children: Be.map((e, t) => {
                  const o = X === e.key;
                  return /* @__PURE__ */ a(
                    "button",
                    {
                      type: "button",
                      role: "option",
                      "aria-selected": o,
                      onClick: () => He(e.key),
                      className: `min-h-[40px] w-full px-3 py-2 text-left text-xs cursor-pointer touch-manipulation flex items-center ${t > 0 ? "border-t" : ""} ${o ? "font-semibold" : "font-medium hover:bg-surface-hover"}`,
                      style: {
                        borderColor: t > 0 ? "var(--agv-border)" : void 0,
                        backgroundColor: o ? "var(--popup-item-selected-bg)" : "var(--control-background)",
                        color: o ? "var(--popup-item-selected-fg, #ffffff)" : "var(--agv-text-main)"
                      },
                      children: /* @__PURE__ */ a("span", { className: "truncate", children: e.title || e.key })
                    },
                    e.key
                  );
                })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ g(mt, { children: [
          /* @__PURE__ */ a(
            q,
            {
              variant: "outline",
              size: "default",
              onClick: Ye,
              className: "w-full font-semibold touch-manipulation",
              children: "Đặt lại"
            }
          ),
          /* @__PURE__ */ a(
            q,
            {
              variant: "default",
              size: "default",
              onClick: ce,
              className: "w-full font-semibold touch-manipulation",
              children: "Áp dụng"
            }
          )
        ] })
      ] })
    }
  );
};
export {
  Nt as ResponsiveSortFilterModal,
  ee as parseMultiValueTokens
};
