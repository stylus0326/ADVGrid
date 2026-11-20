import { jsxs as l, Fragment as te, jsx as t } from "react/jsx-runtime";
import { useRef as ae, useMemo as E, useState as I, useEffect as X } from "react";
import { createPortal as be } from "react-dom";
import { M as ke } from "./MorphIcons-DW5eQGeo.js";
import { D as m, q as ne, b as se, l as ye, F as z, E as Te, m as y, f as Ce } from "./gridFormatUtils-wCKPmlrt.js";
import { g as Ae, F as le, a as K, R as oe } from "./FilterIcons-nsUh2HLg.js";
import { A as O } from "./AdvOverlayScroll-CipuwW1l.js";
import { A as ie, D as De } from "./AdvPopover-CVmyHBzb.js";
import { A as x, N as S } from "./AdvButton-Ck5SixaL.js";
import { A as Ee, a as ze } from "./AdvDatePicker-DZSz8jci.js";
import { a as Se, p as Me } from "./queryUtils-8YODRuOW.js";
import { expandAllShortcuts as Ie, handleNumericKeyDown as re, formatSmartInputText as ce } from "./smartNumberUtils-CUYJXloj.js";
import { X as L } from "./x-CdrDtutQ.js";
import { S as Oe, g as Le } from "./common-29M8PlVv.js";
import { C as Re } from "./check-KNrOhvEC.js";
const Je = ({
  isOpen: T,
  onClose: w,
  anchorEl: A,
  anchorRect: f,
  column: d,
  currentFilter: s,
  onApply: me,
  onClear: Q,
  hasColumnEmptyCells: G,
  getColumnDateBounds: de,
  surfaceTheme: C = Oe.LIGHT
}) => {
  const V = ae(null), r = d.dataType || m.TEXT, N = E(() => Ae(d.key, [d], G), [d, G]), [p, U] = I(() => {
    if (s?.op && N.includes(s.op))
      return s.op;
    const e = ne(d.key, [d]);
    return N.includes(e) ? e : N[0] || se.EQUALS;
  }), [$, R] = I(!1), Y = ae(null), q = ye(p), pe = () => {
    R((e) => !e);
  }, [b, k] = I(() => s?.mode === z.MULTI && s.multiValues ? s.multiValues.join(`
`) : s?.val && s.mode !== z.MULTI ? s.val : ""), [v, h] = I(() => s?.mode === z.MULTI && s.multiRanges && s.multiRanges.length > 0 ? s.multiRanges.map((e) => ({ ...e })) : [{ from: "", to: "" }]), [u, M] = I(() => s?.mode === z.MULTI && s.multiValues && r === m.DATE ? [...s.multiValues] : []), [he, xe] = I("");
  X(() => {
    if (T) {
      if (s?.op && N.includes(s.op))
        U(s.op);
      else {
        const e = ne(d.key, [d]);
        U(N.includes(e) ? e : N[0] || se.EQUALS);
      }
      if (s?.mode === z.MULTI && s.multiRanges && s.multiRanges.length > 0)
        h(s.multiRanges.map((e) => ({ ...e })));
      else if (s?.val && s.val.includes("..")) {
        const [e, a] = s.val.split("..");
        h([{ from: e?.trim() || "", to: a?.trim() || "" }]);
      } else
        h([{ from: "", to: "" }]);
      s?.mode === z.MULTI && s.multiValues ? (k(s.multiValues.join(`
`)), r === m.DATE && M([...s.multiValues])) : s?.val ? (k(s.val), r === m.DATE && !s.val.includes("..") && M([s.val])) : (k(""), M([])), R(!1);
    }
  }, [T, s, d.key, N, r]), X(() => {
    if (!T) return;
    const e = (a) => {
      a.detail?.except !== "multi-filter" && w();
    };
    return window.addEventListener("agv-close-all-popups", e), () => {
      window.removeEventListener("agv-close-all-popups", e);
    };
  }, [T, w]), X(() => {
    if (!T || A) return;
    const e = (a) => {
      const n = a.target;
      n && (V.current && V.current.contains(n) || n.closest?.(
        ".agv-calendar-popover, .agv-daterange-popover, .agv-preset-dropdown-menu, .agv-portal-dropdown, .agv-custom-select-dropdown, .agv-datepicker-popup, .agv-modal-portal, .agv-multi-filter-op-menu"
      ) || w());
    };
    return document.addEventListener("mousedown", e, !0), document.addEventListener("touchstart", e, !0), () => {
      document.removeEventListener("mousedown", e, !0), document.removeEventListener("touchstart", e, !0);
    };
  }, [T, A, w]);
  const g = E(() => {
    if (!b.trim()) return [];
    const e = b.split(/[\r\n,;\t]+/).map((o) => o.trim()).filter((o) => o.length > 0), a = /* @__PURE__ */ new Set(), n = [];
    for (const o of e) {
      const i = o.toLowerCase();
      a.has(i) || (a.add(i), n.push(o));
    }
    return n;
  }, [b]), W = E(() => r !== m.NUMBER ? [] : g.map((e) => Ie(e)).filter((e) => {
    const a = parseFloat(e.replace(/,/g, ""));
    return !isNaN(a);
  }), [g, r]), ve = E(() => r !== m.DATE ? [] : g.filter((e) => Se(e) !== null), [g, r]), _ = E(() => r !== m.TIME && d.editorType !== Te.TIME ? [] : g.filter((e) => Me(e) !== null), [g, r, d.editorType]), D = E(() => v.filter((e) => e.from.trim().length > 0 || e.to.trim().length > 0), [v]), J = E(() => r === m.TEXT ? g.length : r === m.NUMBER ? y(p) ? D.length : W.length : r === m.DATE ? y(p) ? D.length : u.length : r === m.TIME ? y(p) ? D.length : _.length : g.length, [
    r,
    p,
    g.length,
    W.length,
    ve.length,
    _.length,
    D.length,
    u.length
  ]), ge = () => {
    let e, a;
    r === m.TEXT ? e = g : r === m.NUMBER ? y(p) ? a = D : e = W : r === m.DATE ? y(p) ? a = D : e = u : r === m.TIME ? y(p) ? a = D : e = _ : e = g;
    const n = Array.isArray(e) && e.length > 0, o = Array.isArray(a) && a.length > 0;
    if (!n && !o) {
      Q(d.key), w();
      return;
    }
    me(d.key, {
      ...s,
      op: p,
      val: n ? e.join("; ") : `${a.length} khoảng`,
      mode: z.MULTI,
      multiValues: e,
      multiRanges: a
    }), w();
  }, H = (e) => {
    const a = e.trim();
    if (!a) return;
    const n = Ce(a, !1, !1) || a;
    u.includes(n) || M((o) => [...o, n]), xe("");
  }, fe = (e) => {
    M((a) => a.filter((n) => n !== e));
  };
  if (!T || !A && !f) return null;
  const P = de?.(d.key) || { min: "01/09/2026", max: "30/09/2026" }, Z = /* @__PURE__ */ l(te, { children: [
    /* @__PURE__ */ l("div", { className: "flex items-center justify-between px-3 py-2 border-b border-[var(--agv-border)] bg-[var(--agv-bg-header)] shrink-0", children: [
      /* @__PURE__ */ l("div", { className: "flex items-center gap-1.5 min-w-0", children: [
        /* @__PURE__ */ t("span", { className: "font-semibold text-xs text-[var(--agv-text-main)] truncate", children: q ? "Lọc loại trừ (AND)" : "Lọc nhiều điều kiện (OR)" }),
        /* @__PURE__ */ l("span", { className: "text-xs text-[var(--agv-text-muted)] truncate", children: [
          ": ",
          d.title || d.key
        ] })
      ] }),
      /* @__PURE__ */ t(
        x,
        {
          variant: "ghost",
          size: "icon-sm",
          onClick: w,
          className: "text-[var(--agv-text-muted)]",
          children: /* @__PURE__ */ t(L, { size: 14, strokeWidth: 2.2 })
        }
      )
    ] }),
    /* @__PURE__ */ l("div", { className: "flex items-center justify-between px-3 py-1.5 border-b border-[var(--agv-border)] bg-[var(--agv-bg-header)] shrink-0", children: [
      /* @__PURE__ */ t("span", { className: "text-xs text-[var(--agv-text-muted)] font-medium", children: "Toán tử so khớp:" }),
      /* @__PURE__ */ t("div", { className: "relative", children: /* @__PURE__ */ l(
        "button",
        {
          ref: Y,
          type: "button",
          "data-agv-trigger": "true",
          "data-agv-popover-trigger": "true",
          "aria-expanded": $,
          onClick: pe,
          className: "agv-control flex items-center gap-1.5 rounded-md px-2 h-[28px] min-h-[28px] text-xs text-[var(--agv-text-main)] cursor-pointer outline-none",
          children: [
            /* @__PURE__ */ t(le, { op: p, size: 13 }),
            /* @__PURE__ */ t("span", { className: "font-medium", children: K[p]?.label || p }),
            /* @__PURE__ */ t(
              ke,
              {
                expanded: $,
                size: 12,
                type: "down-up",
                className: "text-[var(--agv-text-muted)] shrink-0"
              }
            )
          ]
        }
      ) })
    ] }),
    /* @__PURE__ */ l(
      O,
      {
        className: "flex-initial min-h-0",
        viewportClassName: "p-3 flex flex-col gap-2.5 overflow-y-auto overflow-x-hidden max-h-[calc(100vh-140px)] overscroll-contain",
        contentSignature: `${r}-${v.length}-${u.length}`,
        children: [
          r === m.TEXT && /* @__PURE__ */ l("div", { className: "flex flex-col gap-1.5", children: [
            /* @__PURE__ */ l("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ t("span", { className: "text-xs text-[var(--agv-text-muted)]", children: "Dán hoặc nhập danh sách từ khóa (mỗi dòng 1 từ):" }),
              b && /* @__PURE__ */ t(
                x,
                {
                  variant: "destructive",
                  size: "sm",
                  onClick: () => k(""),
                  className: "px-2",
                  children: "Xóa trắng"
                }
              )
            ] }),
            /* @__PURE__ */ t(
              "textarea",
              {
                value: b,
                onChange: (e) => k(e.target.value),
                placeholder: `VD:
VN123
VJ456
QH789
(hỗ trợ phân tách bằng xuống dòng, dấu phẩy, tab)`,
                ...S,
                rows: 6,
                className: "agv-control w-full p-2 text-xs text-[var(--agv-text-main)] placeholder:text-[var(--agv-text-muted)] resize-y min-h-[120px] max-h-[220px]"
              }
            )
          ] }),
          r === m.NUMBER && /* @__PURE__ */ t("div", { className: "flex flex-col gap-2", children: y(p) ? /* @__PURE__ */ l("div", { className: "flex flex-col gap-2", children: [
            /* @__PURE__ */ t(
              O,
              {
                className: "flex-initial min-h-0",
                viewportClassName: `flex flex-col gap-1.5 py-0.5 pr-0.5 overflow-x-hidden ${v.length > 3 ? "max-h-[140px] overflow-y-auto overscroll-contain" : "overflow-hidden"}`,
                contentSignature: v.length,
                children: v.map((e, a) => /* @__PURE__ */ l("div", { className: "flex items-center gap-1.5 w-full min-w-0 h-[28px] min-h-[28px]", children: [
                  /* @__PURE__ */ l("span", { className: "text-xs text-[var(--agv-text-muted)] min-w-[20px] shrink-0 text-center select-none font-mono tabular-nums", children: [
                    "#",
                    a + 1
                  ] }),
                  /* @__PURE__ */ t(
                    "input",
                    {
                      type: "text",
                      value: e.from,
                      onChange: (n) => {
                        const o = ce(n.target.value);
                        h((i) => {
                          const c = [...i];
                          return c[a] = { ...c[a], from: o }, c;
                        });
                      },
                      onKeyDown: re,
                      placeholder: "Từ...",
                      ...S,
                      className: "agv-control flex-1 min-w-0 h-[28px] min-h-[28px] box-border px-1.5 text-xs tabular-nums"
                    }
                  ),
                  /* @__PURE__ */ t(oe, { className: "mx-0.5" }),
                  /* @__PURE__ */ t(
                    "input",
                    {
                      type: "text",
                      value: e.to,
                      onChange: (n) => {
                        const o = ce(n.target.value);
                        h((i) => {
                          const c = [...i];
                          return c[a] = { ...c[a], to: o }, c;
                        });
                      },
                      onKeyDown: re,
                      placeholder: "Đến...",
                      ...S,
                      className: "agv-control flex-1 min-w-0 h-[28px] min-h-[28px] box-border px-1.5 text-xs tabular-nums"
                    }
                  ),
                  /* @__PURE__ */ t(
                    x,
                    {
                      variant: "destructive",
                      size: "icon-sm",
                      onClick: () => {
                        h((n) => n.length <= 1 ? [{ from: "", to: "" }] : n.filter((o, i) => i !== a));
                      },
                      children: /* @__PURE__ */ t(L, { size: 12, strokeWidth: 2.2, className: "shrink-0" })
                    }
                  )
                ] }, a))
              }
            ),
            /* @__PURE__ */ t(
              x,
              {
                variant: "ghost",
                size: "sm",
                onClick: () => h((e) => [...e, { from: "", to: "" }]),
                className: "w-full text-agv-accent",
                children: "+ Thêm khoảng số"
              }
            )
          ] }) : /* @__PURE__ */ l("div", { className: "flex flex-col gap-1.5", children: [
            /* @__PURE__ */ l("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ t("span", { className: "text-xs text-[var(--agv-text-muted)]", children: "Dán hoặc nhập danh sách số (mỗi dòng 1 số):" }),
              b && /* @__PURE__ */ t(
                x,
                {
                  variant: "destructive",
                  size: "sm",
                  onClick: () => k(""),
                  className: "px-2",
                  children: "Xóa trắng"
                }
              )
            ] }),
            /* @__PURE__ */ t(
              "textarea",
              {
                value: b,
                onChange: (e) => k(e.target.value),
                placeholder: "Nhập hoặc dán các số (VD: 10, 25, 50, 100)...",
                ...S,
                rows: 5,
                className: "agv-control w-full p-2 text-xs text-[var(--agv-text-main)] placeholder:text-[var(--agv-text-muted)] resize-y min-h-[100px] max-h-[200px]"
              }
            )
          ] }) }),
          r === m.DATE && /* @__PURE__ */ t("div", { className: "flex flex-col gap-2", children: y(p) ? (
            /* Trường hợp 1: Toán tử "Trong khoảng" (between) -> Dùng AdvDateRangePicker cho từng khoảng */
            /* @__PURE__ */ l("div", { className: "flex flex-col gap-2", children: [
              /* @__PURE__ */ t(
                O,
                {
                  className: "flex-initial min-h-0",
                  viewportClassName: `flex flex-col gap-1.5 py-0.5 pr-0.5 overflow-x-hidden ${v.length > 3 ? "max-h-[140px] overflow-y-auto overscroll-contain" : "overflow-hidden"}`,
                  contentSignature: v.length,
                  children: v.map((e, a) => /* @__PURE__ */ l("div", { className: "flex items-center gap-1.5 w-full min-w-0 h-[28px] min-h-[28px]", children: [
                    /* @__PURE__ */ l("span", { className: "text-xs text-[var(--agv-text-muted)] min-w-[20px] shrink-0 text-center select-none font-mono tabular-nums", children: [
                      "#",
                      a + 1
                    ] }),
                    /* @__PURE__ */ t("div", { className: "flex-1 min-w-0 h-[28px] min-h-[28px] box-border", children: /* @__PURE__ */ t(
                      Ee,
                      {
                        from: e.from,
                        to: e.to,
                        onChange: (n) => {
                          h((o) => {
                            const i = [...o];
                            return i[a] = { from: n.from || "", to: n.to || "" }, i;
                          });
                        },
                        min: P.min,
                        max: P.max,
                        placeholderFrom: "Từ",
                        placeholderTo: "Đến",
                        theme: C,
                        size: "xs",
                        showPreset: !0,
                        dualMonth: !1,
                        showTime: !!d.showTime
                      }
                    ) }),
                    /* @__PURE__ */ t(
                      x,
                      {
                        variant: "destructive",
                        size: "icon-sm",
                        onClick: () => {
                          h((n) => n.length <= 1 ? [{ from: "", to: "" }] : n.filter((o, i) => i !== a));
                        },
                        children: /* @__PURE__ */ t(L, { size: 12, strokeWidth: 2.2, className: "shrink-0" })
                      }
                    )
                  ] }, a))
                }
              ),
              /* @__PURE__ */ t(
                x,
                {
                  variant: "ghost",
                  size: "sm",
                  onClick: () => h((e) => [...e, { from: "", to: "" }]),
                  className: "w-full text-agv-accent",
                  children: "+ Thêm khoảng ngày"
                }
              )
            ] })
          ) : (
            /* Trường hợp 2: Toán tử Bằng, Khác, Lớn hơn, Nhỏ hơn... -> Chọn ngày tích lũy chip qua AdvDatePicker */
            /* @__PURE__ */ l("div", { className: "flex flex-col gap-2", children: [
              /* @__PURE__ */ t("div", { className: "flex items-center gap-1.5", children: /* @__PURE__ */ t("div", { className: "flex-1 h-[28px] min-h-[28px]", children: /* @__PURE__ */ t(
                ze,
                {
                  value: he,
                  onChange: (e, a) => {
                    a?.from && a?.to && a.from !== a.to ? (H(a.from), H(a.to)) : e && H(e);
                  },
                  min: P.min,
                  max: P.max,
                  placeholder: "Chọn ngày để thêm vào danh sách...",
                  theme: C,
                  showPreset: !0,
                  size: "xs"
                }
              ) }) }),
              /* @__PURE__ */ t(
                O,
                {
                  className: "rounded border border-[var(--agv-border)] bg-[var(--agv-bg-control)]",
                  viewportClassName: "flex flex-wrap gap-1 max-h-[140px] overflow-y-auto overflow-x-hidden p-1.5 min-h-[60px] overscroll-contain",
                  contentSignature: u.length,
                  children: u.length === 0 ? /* @__PURE__ */ t("span", { className: "text-xs text-[var(--agv-text-muted)] italic self-center", children: "Chưa chọn ngày nào. Click lịch ở trên để chọn." }) : u.map((e) => /* @__PURE__ */ l(
                    "span",
                    {
                      className: "inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-[var(--agv-bg-card)] border border-[var(--agv-border)] text-[var(--agv-text-main)]",
                      children: [
                        e,
                        /* @__PURE__ */ t(
                          "button",
                          {
                            type: "button",
                            onClick: () => fe(e),
                            className: "agv-inline-clear-destructive p-0.5",
                            children: /* @__PURE__ */ t(L, { size: 11, strokeWidth: 2.2 })
                          }
                        )
                      ]
                    },
                    e
                  ))
                }
              ),
              u.length > 0 && /* @__PURE__ */ l("div", { className: "flex justify-between items-center text-xs text-[var(--agv-text-muted)]", children: [
                /* @__PURE__ */ l("span", { children: [
                  "Đã chọn: ",
                  /* @__PURE__ */ t("strong", { className: "text-agv-accent", children: u.length }),
                  " ngày"
                ] }),
                /* @__PURE__ */ t(
                  x,
                  {
                    variant: "destructive",
                    size: "sm",
                    onClick: () => M([]),
                    className: "px-2",
                    children: "Xóa tất cả"
                  }
                )
              ] })
            ] })
          ) }),
          r === m.TIME && /* @__PURE__ */ t("div", { className: "flex flex-col gap-2", children: y(p) ? /* @__PURE__ */ l("div", { className: "flex flex-col gap-2", children: [
            /* @__PURE__ */ t(
              O,
              {
                className: "flex-initial min-h-0",
                viewportClassName: `flex flex-col gap-1.5 py-0.5 pr-0.5 overflow-x-hidden ${v.length > 3 ? "max-h-[140px] overflow-y-auto overscroll-contain" : "overflow-hidden"}`,
                contentSignature: v.length,
                children: v.map((e, a) => /* @__PURE__ */ l("div", { className: "flex items-center gap-1.5 w-full min-w-0 h-[28px] min-h-[28px]", children: [
                  /* @__PURE__ */ l("span", { className: "text-xs text-[var(--agv-text-muted)] min-w-[20px] shrink-0 text-center select-none font-mono tabular-nums", children: [
                    "#",
                    a + 1
                  ] }),
                  /* @__PURE__ */ t(
                    "input",
                    {
                      type: "text",
                      value: e.from,
                      onChange: (n) => {
                        const o = n.target.value;
                        h((i) => {
                          const c = [...i];
                          return c[a] = { ...c[a], from: o }, c;
                        });
                      },
                      placeholder: "HH:mm",
                      ...S,
                      className: "agv-control flex-1 min-w-0 h-[28px] min-h-[28px] box-border px-1.5 text-xs tabular-nums"
                    }
                  ),
                  /* @__PURE__ */ t(oe, { className: "mx-0.5" }),
                  /* @__PURE__ */ t(
                    "input",
                    {
                      type: "text",
                      value: e.to,
                      onChange: (n) => {
                        const o = n.target.value;
                        h((i) => {
                          const c = [...i];
                          return c[a] = { ...c[a], to: o }, c;
                        });
                      },
                      placeholder: "HH:mm",
                      ...S,
                      className: "agv-control flex-1 min-w-0 h-[28px] min-h-[28px] box-border px-1.5 text-xs tabular-nums"
                    }
                  ),
                  /* @__PURE__ */ t(
                    x,
                    {
                      variant: "destructive",
                      size: "icon-sm",
                      onClick: () => {
                        h((n) => n.length <= 1 ? [{ from: "", to: "" }] : n.filter((o, i) => i !== a));
                      },
                      children: /* @__PURE__ */ t(L, { size: 12, strokeWidth: 2.2, className: "shrink-0" })
                    }
                  )
                ] }, a))
              }
            ),
            /* @__PURE__ */ t(
              x,
              {
                variant: "ghost",
                size: "sm",
                onClick: () => h((e) => [...e, { from: "", to: "" }]),
                className: "w-full text-agv-accent",
                children: "+ Thêm khoảng giờ"
              }
            )
          ] }) : /* @__PURE__ */ l("div", { className: "flex flex-col gap-1.5", children: [
            /* @__PURE__ */ l("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ t("span", { className: "text-xs text-[var(--agv-text-muted)]", children: "Dán hoặc nhập danh sách giờ (mỗi dòng 1 mốc giờ HH:mm):" }),
              b && /* @__PURE__ */ t(
                x,
                {
                  variant: "destructive",
                  size: "sm",
                  onClick: () => k(""),
                  className: "px-2",
                  children: "Xóa trắng"
                }
              )
            ] }),
            /* @__PURE__ */ t(
              "textarea",
              {
                value: b,
                onChange: (e) => k(e.target.value),
                placeholder: `VD:
08:30
12:00
17:45`,
                ...S,
                rows: 5,
                className: "agv-control w-full p-2 text-xs text-[var(--agv-text-main)] placeholder:text-[var(--agv-text-muted)] resize-y min-h-[100px] max-h-[200px]"
              }
            )
          ] }) })
        ]
      }
    ),
    /* @__PURE__ */ l("div", { className: "flex items-center justify-between px-3 py-2 border-t border-[var(--agv-border)] bg-[var(--agv-bg-header)] shrink-0", children: [
      /* @__PURE__ */ t("div", { className: "text-xs text-[var(--agv-text-muted)]", children: J > 0 ? /* @__PURE__ */ l("span", { children: [
        "Tổng cộng: ",
        /* @__PURE__ */ t("strong", { className: "text-agv-accent", children: J }),
        " điều kiện (",
        q ? "AND" : "OR",
        ")"
      ] }) : /* @__PURE__ */ t("span", { className: "italic", children: "Chưa có điều kiện" }) }),
      /* @__PURE__ */ l("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ t(
          x,
          {
            variant: "destructive",
            size: "sm",
            onClick: () => {
              Q(d.key), w();
            },
            className: "px-2.5",
            children: "Xóa"
          }
        ),
        /* @__PURE__ */ t(
          x,
          {
            variant: "default",
            size: "sm",
            onClick: ge,
            children: "Áp dụng"
          }
        )
      ] })
    ] })
  ] }), ue = () => {
    if (!f) return null;
    const e = 390, a = 8, n = window.innerWidth, o = window.innerHeight;
    let i = f.width && f.width <= 120 ? f.right - e : f.left;
    i + e > n - a && (i = n - e - a), i < a && (i = a);
    const c = o - f.bottom - a, ee = f.top - a, j = c < 260 && ee > c, we = j ? Math.max(160, Math.min(520, ee - 8)) : Math.max(160, Math.min(520, c - 8)), Ne = {
      position: "fixed",
      left: `${i}px`,
      width: `${e}px`,
      maxWidth: "calc(100vw - 16px)",
      maxHeight: `${we}px`,
      zIndex: 99999999,
      backgroundColor: "var(--popup-background)",
      borderColor: "var(--popup-border)",
      boxShadow: "var(--popup-shadow)",
      color: "var(--agv-text-main)",
      ...j ? { bottom: `${o - f.top + 4}px`, top: "auto" } : { top: `${f.bottom + 4}px`, bottom: "auto" }
    };
    return be(
      /* @__PURE__ */ t(
        "div",
        {
          ref: V,
          style: Ne,
          className: `agv-multi-filter-popup agv-popup-panel flex flex-col rounded-md border text-xs overflow-hidden select-none ${j ? "agv-spring-up" : "agv-spring-down"} ${Le(C)}`,
          "data-theme": C,
          "data-agv-popup": "true",
          onClick: (B) => B.stopPropagation(),
          onWheel: (B) => B.stopPropagation(),
          children: Z
        }
      ),
      document.body
    );
  }, F = A ? A.getBoundingClientRect().width : 0;
  return /* @__PURE__ */ l(te, { children: [
    A ? /* @__PURE__ */ t(
      ie,
      {
        isOpen: T,
        anchorEl: A,
        onClose: w,
        placement: F > 0 && F <= 120 ? "bottom-end" : "bottom-start",
        showArrow: !0,
        offset: 10,
        width: 390,
        minWidth: 320,
        maxWidth: "calc(100vw - 16px)",
        paddingClassName: "p-0",
        contentClassName: "text-xs agv-multi-filter-popup",
        zIndex: 99999999,
        theme: C,
        ignoreClickOutsideSelectors: `${De}, .agv-custom-select-dropdown, .agv-datepicker-popup, .agv-modal-portal, [data-agv-popover-trigger="true"]`,
        children: /* @__PURE__ */ t(
          "div",
          {
            "data-theme": C,
            className: "flex flex-col max-h-[min(520px,calc(100vh-80px))] rounded-md overflow-hidden text-xs text-[var(--agv-text-main)] select-none",
            children: Z
          }
        )
      }
    ) : ue(),
    /* @__PURE__ */ t(
      ie,
      {
        isOpen: $,
        anchorEl: Y.current,
        onClose: () => R(!1),
        placement: "bottom-end",
        showArrow: !0,
        offset: 10,
        width: 192,
        minWidth: 192,
        paddingClassName: "p-0",
        contentClassName: "text-xs agv-multi-filter-op-menu",
        zIndex: 1e8,
        theme: C,
        ignoreClickOutsideSelectors: "",
        children: /* @__PURE__ */ t(
          "div",
          {
            "data-theme": C,
            onMouseDown: (e) => e.stopPropagation(),
            className: "w-full rounded-md overflow-hidden flex flex-col select-none",
            children: /* @__PURE__ */ t(
              O,
              {
                className: "flex-initial min-h-0",
                viewportClassName: "p-1 overflow-y-auto overflow-x-hidden flex flex-col gap-0.5 overscroll-contain",
                viewportStyle: { maxHeight: "222px" },
                contentSignature: N.length,
                children: N.filter((e) => !K[e]?.noInput).map((e) => {
                  const a = e === p;
                  return /* @__PURE__ */ l(
                    "div",
                    {
                      onClick: () => {
                        U(e), R(!1);
                      },
                      className: `agv-popup-item ${a ? "is-selected" : ""}`,
                      children: [
                        /* @__PURE__ */ t(le, { op: e, size: 14, className: "shrink-0" }),
                        /* @__PURE__ */ t("span", { className: "flex-1 truncate", children: K[e]?.label }),
                        a && /* @__PURE__ */ t(Re, { size: 13, strokeWidth: 2.5, className: "shrink-0" })
                      ]
                    },
                    e
                  );
                })
              }
            )
          }
        )
      }
    )
  ] });
};
export {
  Je as AdvMultiFilterPopup
};
