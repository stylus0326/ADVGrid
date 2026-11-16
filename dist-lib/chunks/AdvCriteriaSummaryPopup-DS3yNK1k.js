import { jsxs as n, Fragment as se, jsx as t } from "react/jsx-runtime";
import { useRef as be, useEffect as we, useMemo as i } from "react";
import { createPortal as ye } from "react-dom";
import { D as B, a as Z, F as Ne, j as ke, m as Te, E as Ae, f as Q, b as le, S as oe } from "./gridFormatUtils-wCKPmlrt.js";
import { A as Ee } from "./AdvOverlayScroll-CipuwW1l.js";
import { A as Se } from "./AdvPopover-D5QeywtP.js";
import { B as v, A as $e } from "./AdvButton-B7j0puyb.js";
import { a as Ce } from "./FilterIcons-nsUh2HLg.js";
import { g as Ie } from "./queryUtils-BNBxdE3H.js";
import { h as je } from "./DataGridEnterprise-CwIXrBzR.js";
import { X as g } from "./x-CdrDtutQ.js";
import { S as Me, g as De } from "./common-Bjggt86Z.js";
const Fe = ({
  isOpen: I,
  onClose: j,
  anchorRect: o,
  anchorEl: m = null,
  surfaceTheme: F = Me.LIGHT,
  columns: d,
  groupByColumnKey: M,
  columnFilters: D = {},
  quickFilterText: H,
  sortConfig: Y,
  sortRules: O,
  groupSortConfig: h,
  appliedQueryTree: V,
  pinnedRows: L = [],
  onClearRowFilter: ie,
  onClearChecklistFilter: ce,
  onClearGroup: de,
  onClearQuickSearch: xe,
  onClearSortRow: ve,
  onRemoveSortRule: q,
  onClearSortGroup: ge,
  onClearQueryTree: pe,
  onUnpinRow: me,
  onClearAll: he
}) => {
  const X = be(null);
  we(() => {
    if (!I || m) return;
    const e = (a) => {
      const r = a.target;
      r && (X.current && X.current.contains(r) || r.closest('[data-summary-trigger="true"]') || j());
    };
    return document.addEventListener("mousedown", e, !0), document.addEventListener("touchstart", e, !0), () => {
      document.removeEventListener("mousedown", e, !0), document.removeEventListener("touchstart", e, !0);
    };
  }, [I, j]);
  const c = i(() => {
    const e = {};
    for (const a of d)
      e[a.key] = a.title || a.key;
    return e;
  }, [d]), u = i(() => {
    const e = {};
    for (const a of d)
      e[a.key] = a;
    return e;
  }, [d]), W = i(() => M ? c[M] || M : null, [M, c]), f = i(() => {
    const e = [];
    for (const [a, r] of Object.entries(D)) {
      if (!r) continue;
      const s = c[a] || a, l = u[a];
      if (l?.isSelection || l?.dataType === B.SYSTEM && !l.title) {
        (r.val === Z.CHECKED || r.val === Z.UNCHECKED) && e.push({
          key: a,
          label: s,
          valueText: r.val === Z.CHECKED ? "Đã chọn" : "Chưa chọn"
        });
        continue;
      }
      const A = r.mode === Ne.MULTI && !!(Array.isArray(r.multiValues) && r.multiValues.length > 0 || Array.isArray(r.multiRanges) && r.multiRanges.length > 0), x = ke(r.op), E = typeof r.val == "string" && r.val.trim().length > 0, U = Ce[r.op]?.label || r.op;
      if (A)
        Array.isArray(r.multiValues) && r.multiValues.length > 0 ? e.push({
          key: a,
          label: s,
          valueText: `${U} (${r.multiValues.length} giá trị)`
        }) : Array.isArray(r.multiRanges) && r.multiRanges.length > 0 && e.push({
          key: a,
          label: s,
          valueText: `${r.multiRanges.length} khoảng`
        });
      else if (x)
        e.push({
          key: a,
          label: s,
          valueText: U
        });
      else if (Te(r.op)) {
        if (r.val) {
          const [S, $] = r.val.split(".."), C = u[a], ne = C?.dataType === B.DATE || C?.editorType === Ae.DATE || C?.isDateRange, ue = ne && S ? Q(S, !1) : S, fe = ne && $ ? Q($, !1) : $;
          e.push({
            key: a,
            label: s,
            valueText: `${ue || "..."} → ${fe || "..."}`
          });
        }
      } else E && e.push({
        key: a,
        label: s,
        valueText: r.op === le.CONTAINS || r.op === le.EQUALS ? `"${r.val}"` : `${U} "${r.val}"`
      });
    }
    return e;
  }, [D, c, u]), b = i(() => {
    const e = [];
    for (const [a, r] of Object.entries(D)) {
      if (!r) continue;
      const s = Array.isArray(r.selectedValues) && r.selectedValues.length > 0, l = !!r.includeBlanks;
      if (!s && !l) continue;
      const A = c[a] || a, x = u[a]?.dataType === B.DATE, E = [];
      if (s) {
        const S = (x ? r.selectedValues.slice(0, 2).map((C) => Q(C)) : r.selectedValues.slice(0, 2)).join(", "), $ = r.selectedValues.length > 2 ? ` (+${r.selectedValues.length - 2})` : "";
        E.push(`${S}${$}`);
      }
      l && E.push("(Trống)"), e.push({
        key: a,
        label: A,
        valueText: E.join(", ")
      });
    }
    return e;
  }, [D, c, u]), P = i(() => !H || !H.trim() ? null : `"${H.trim()}"`, [H]), w = i(() => {
    const e = O && O.length > 0 ? O : Y?.key ? [Y] : [];
    return e.map((a, r) => {
      const s = c[a.key] || a.key, l = a.direction === oe.ASC ? "Tăng dần" : "Giảm dần";
      return {
        key: a.key,
        label: e.length >= 2 ? `${r + 1}. ${s}` : s,
        dir: l
      };
    });
  }, [O, Y, c]), y = i(() => {
    if (!h || !h.colKey) return null;
    const e = c[h.colKey] || h.colKey, a = h.direction === oe.ASC ? "Tăng dần" : "Giảm dần";
    return { label: e, dir: a };
  }, [h, c]), _ = i(() => !V || !je(V) ? null : Ie(V, d), [V, d]), N = i(() => {
    if (!L || L.length === 0) return [];
    const e = d.filter(
      (a) => !a.isRowNumber && !a.isSelection && a.dataType !== B.SYSTEM && !a.isChart
    );
    return L.map((a) => {
      const s = (typeof a.row?.originalIndex == "number" ? a.row.originalIndex : a.rowIndex) + 1;
      let l = "";
      for (const A of e) {
        const x = a.row?.[A.key];
        if (x != null && String(x).trim() !== "") {
          l = String(x).trim();
          break;
        }
      }
      return l || (l = `${s}`), {
        rowKey: a.rowKey,
        label: `Dòng #${s}`,
        valueText: l
      };
    });
  }, [L, d]), z = i(() => (W ? 1 : 0) + f.length + b.length + (P ? 1 : 0) + w.length + (y ? 1 : 0) + (_ ? 1 : 0) + N.length, [
    W,
    f,
    b,
    P,
    w,
    y,
    _,
    N
  ]);
  if (!I || !m && !o) return null;
  const ee = typeof window < "u" ? window.innerWidth : 1280, G = typeof window < "u" ? window.innerHeight : 800, p = 8, K = 360;
  let k = o ? o.left : p;
  k + K > ee - p && (k = ee - K - p), k < p && (k = p);
  const R = o ? G - o.bottom - p : G - 120, te = o ? o.top - p : 120, J = !!(o && R < 260 && te > R), re = m ? Math.max(200, Math.min(520, G - 120)) : J ? Math.max(160, Math.min(520, te - 8)) : Math.max(160, Math.min(520, R - 8)), ae = /* @__PURE__ */ n(se, { children: [
    /* @__PURE__ */ t(
      Ee,
      {
        className: "flex-initial min-h-0",
        viewportClassName: "p-3 flex flex-col gap-2.5 overflow-y-auto overflow-x-hidden overscroll-contain",
        viewportStyle: { maxHeight: `${Math.max(160, re - (z > 0 ? 44 : 0))}px` },
        contentSignature: z,
        children: z === 0 ? /* @__PURE__ */ t("div", { className: "py-6 text-center text-xs text-[var(--agv-text-muted)] italic select-none", children: "Chưa có tiêu chí nào đang áp dụng" }) : /* @__PURE__ */ n(se, { children: [
          W && /* @__PURE__ */ n("div", { className: "flex flex-col gap-1.5", children: [
            /* @__PURE__ */ t("span", { className: "font-bold text-xs text-[var(--agv-text-muted)] uppercase tracking-wide", children: "NHÓM THEO (1)" }),
            /* @__PURE__ */ t("div", { className: "flex flex-wrap gap-1.5", children: /* @__PURE__ */ n("div", { className: "inline-flex items-center rounded border border-[var(--agv-border-strong)] bg-[var(--agv-bg-control)] overflow-hidden", children: [
              /* @__PURE__ */ t("span", { className: "min-h-[28px] h-7 px-2.5 flex items-center justify-center bg-agv-accent text-agv-accent-text font-bold text-xs select-none", children: W }),
              /* @__PURE__ */ t("span", { className: "min-h-[28px] h-7 px-2 flex items-center text-xs text-[var(--agv-text-main)] select-none border-l border-[var(--agv-border)]", children: "Nhóm" }),
              /* @__PURE__ */ t(
                "button",
                {
                  type: "button",
                  onClick: de,
                  className: `min-h-[28px] min-w-[28px] h-7 w-7 flex items-center justify-center text-xs text-[var(--agv-text-muted)] hover:text-[var(--agv-danger)] hover:bg-[var(--agv-danger-bg)] transition cursor-pointer select-none border-l border-[var(--agv-border)] ${v}`,
                  children: /* @__PURE__ */ t(g, { size: 11, strokeWidth: 2.5 })
                }
              )
            ] }) })
          ] }),
          f.length > 0 && /* @__PURE__ */ n("div", { className: "flex flex-col gap-1.5", children: [
            /* @__PURE__ */ n("span", { className: "font-bold text-xs text-[var(--agv-text-muted)] uppercase tracking-wide", children: [
              "LỌC THEO (",
              f.length,
              ")"
            ] }),
            /* @__PURE__ */ t("div", { className: "flex flex-wrap gap-1.5", children: f.map((e) => /* @__PURE__ */ n(
              "div",
              {
                className: "inline-flex items-center rounded border border-[var(--agv-border-strong)] bg-[var(--agv-bg-control)] overflow-hidden",
                children: [
                  /* @__PURE__ */ t("span", { className: "min-h-[28px] h-7 px-2.5 flex items-center justify-center bg-agv-accent text-agv-accent-text font-bold text-xs select-none", children: e.label }),
                  /* @__PURE__ */ t("span", { className: "min-h-[28px] h-7 px-2 flex items-center text-xs text-[var(--agv-text-main)] select-none border-l border-[var(--agv-border)] max-w-[180px] truncate", children: e.valueText }),
                  /* @__PURE__ */ t(
                    "button",
                    {
                      type: "button",
                      onClick: () => ie?.(e.key),
                      className: `min-h-[28px] min-w-[28px] h-7 w-7 flex items-center justify-center text-xs text-[var(--agv-text-muted)] hover:text-[var(--agv-danger)] hover:bg-[var(--agv-danger-bg)] transition cursor-pointer select-none border-l border-[var(--agv-border)] ${v}`,
                      children: /* @__PURE__ */ t(g, { size: 11, strokeWidth: 2.5 })
                    }
                  )
                ]
              },
              e.key
            )) })
          ] }),
          b.length > 0 && /* @__PURE__ */ n("div", { className: "flex flex-col gap-1.5", children: [
            /* @__PURE__ */ n("span", { className: "font-bold text-xs text-[var(--agv-text-muted)] uppercase tracking-wide", children: [
              "ĐANG CHỌN (",
              b.length,
              ")"
            ] }),
            /* @__PURE__ */ t("div", { className: "flex flex-wrap gap-1.5", children: b.map((e) => /* @__PURE__ */ n(
              "div",
              {
                className: "inline-flex items-center rounded border border-[var(--agv-border-strong)] bg-[var(--agv-bg-control)] overflow-hidden",
                children: [
                  /* @__PURE__ */ t("span", { className: "min-h-[28px] h-7 px-2.5 flex items-center justify-center bg-agv-accent text-agv-accent-text font-bold text-xs select-none", children: e.label }),
                  /* @__PURE__ */ t("span", { className: "min-h-[28px] h-7 px-2 flex items-center text-xs text-[var(--agv-text-main)] select-none border-l border-[var(--agv-border)] max-w-[180px] truncate", children: e.valueText }),
                  /* @__PURE__ */ t(
                    "button",
                    {
                      type: "button",
                      onClick: () => ce?.(e.key),
                      className: `min-h-[28px] min-w-[28px] h-7 w-7 flex items-center justify-center text-xs text-[var(--agv-text-muted)] hover:text-[var(--agv-danger)] hover:bg-[var(--agv-danger-bg)] transition cursor-pointer select-none border-l border-[var(--agv-border)] ${v}`,
                      children: /* @__PURE__ */ t(g, { size: 11, strokeWidth: 2.5 })
                    }
                  )
                ]
              },
              e.key
            )) })
          ] }),
          P && /* @__PURE__ */ n("div", { className: "flex flex-col gap-1.5", children: [
            /* @__PURE__ */ t("span", { className: "font-bold text-xs text-[var(--agv-text-muted)] uppercase tracking-wide", children: "TÌM GIÁ TRỊ THEO (1)" }),
            /* @__PURE__ */ t("div", { className: "flex flex-wrap gap-1.5", children: /* @__PURE__ */ n("div", { className: "inline-flex items-center rounded border border-[var(--agv-border-strong)] bg-[var(--agv-bg-control)] overflow-hidden", children: [
              /* @__PURE__ */ t("span", { className: "min-h-[28px] h-7 px-2.5 flex items-center text-xs text-[var(--agv-text-main)] select-none max-w-[280px] truncate", children: P }),
              /* @__PURE__ */ t(
                "button",
                {
                  type: "button",
                  onClick: xe,
                  className: `min-h-[28px] min-w-[28px] h-7 w-7 flex items-center justify-center text-xs text-[var(--agv-text-muted)] hover:text-[var(--agv-danger)] hover:bg-[var(--agv-danger-bg)] transition cursor-pointer select-none border-l border-[var(--agv-border)] ${v}`,
                  children: /* @__PURE__ */ t(g, { size: 11, strokeWidth: 2.5 })
                }
              )
            ] }) })
          ] }),
          w.length > 0 && /* @__PURE__ */ n("div", { className: "flex flex-col gap-1.5", children: [
            /* @__PURE__ */ n("span", { className: "font-bold text-xs text-[var(--agv-text-muted)] uppercase tracking-wide", children: [
              "SẮP XẾP DÒNG THEO (",
              w.length,
              ")"
            ] }),
            /* @__PURE__ */ t("div", { className: "flex flex-wrap gap-1.5", children: w.map((e) => /* @__PURE__ */ n(
              "div",
              {
                className: "inline-flex items-center rounded border border-[var(--agv-border-strong)] bg-[var(--agv-bg-control)] overflow-hidden",
                children: [
                  /* @__PURE__ */ t("span", { className: "min-h-[28px] h-7 px-2.5 flex items-center justify-center bg-agv-accent text-agv-accent-text font-bold text-xs select-none", children: e.label }),
                  /* @__PURE__ */ t("span", { className: "min-h-[28px] h-7 px-2 flex items-center text-xs text-[var(--agv-text-main)] select-none border-l border-[var(--agv-border)]", children: e.dir }),
                  /* @__PURE__ */ t(
                    "button",
                    {
                      type: "button",
                      onClick: () => q ? q(e.key) : ve?.(),
                      className: `min-h-[28px] min-w-[28px] h-7 w-7 flex items-center justify-center text-xs text-[var(--agv-text-muted)] hover:text-[var(--agv-danger)] hover:bg-[var(--agv-danger-bg)] transition cursor-pointer select-none border-l border-[var(--agv-border)] ${v}`,
                      children: /* @__PURE__ */ t(g, { size: 11, strokeWidth: 2.5 })
                    }
                  )
                ]
              },
              e.key
            )) })
          ] }),
          y && /* @__PURE__ */ n("div", { className: "flex flex-col gap-1.5", children: [
            /* @__PURE__ */ t("span", { className: "font-bold text-xs text-[var(--agv-text-muted)] uppercase tracking-wide", children: "SẮP XẾP NHÓM THEO (1)" }),
            /* @__PURE__ */ t("div", { className: "flex flex-wrap gap-1.5", children: /* @__PURE__ */ n("div", { className: "inline-flex items-center rounded border border-[var(--agv-border-strong)] bg-[var(--agv-bg-control)] overflow-hidden", children: [
              /* @__PURE__ */ t("span", { className: "min-h-[28px] h-7 px-2.5 flex items-center justify-center bg-agv-accent text-agv-accent-text font-bold text-xs select-none", children: y.label }),
              /* @__PURE__ */ t("span", { className: "min-h-[28px] h-7 px-2 flex items-center text-xs text-[var(--agv-text-main)] select-none border-l border-[var(--agv-border)]", children: y.dir }),
              /* @__PURE__ */ t(
                "button",
                {
                  type: "button",
                  onClick: ge,
                  className: `min-h-[28px] min-w-[28px] h-7 w-7 flex items-center justify-center text-xs text-[var(--agv-text-muted)] hover:text-[var(--agv-danger)] hover:bg-[var(--agv-danger-bg)] transition cursor-pointer select-none border-l border-[var(--agv-border)] ${v}`,
                  children: /* @__PURE__ */ t(g, { size: 11, strokeWidth: 2.5 })
                }
              )
            ] }) })
          ] }),
          _ && /* @__PURE__ */ n("div", { className: "flex flex-col gap-1.5", children: [
            /* @__PURE__ */ t("span", { className: "font-bold text-xs text-[var(--agv-text-muted)] uppercase tracking-wide", children: "CÂY ĐIỀU KIỆN (1)" }),
            /* @__PURE__ */ t("div", { className: "flex flex-wrap gap-1.5", children: /* @__PURE__ */ n("div", { className: "inline-flex items-center rounded border border-[var(--agv-border-strong)] bg-[var(--agv-bg-control)] overflow-hidden w-full max-w-full justify-between", children: [
              /* @__PURE__ */ t(
                "span",
                {
                  className: "min-h-[28px] h-auto py-1 px-2.5 flex items-center text-xs text-[var(--agv-text-main)] select-none flex-1 truncate",
                  children: _
                }
              ),
              /* @__PURE__ */ t(
                "button",
                {
                  type: "button",
                  onClick: pe,
                  className: `min-h-[28px] min-w-[28px] h-7 w-7 flex items-center justify-center text-xs text-[var(--agv-text-muted)] hover:text-[var(--agv-danger)] hover:bg-[var(--agv-danger-bg)] transition cursor-pointer select-none border-l border-[var(--agv-border)] shrink-0 ${v}`,
                  children: /* @__PURE__ */ t(g, { size: 11, strokeWidth: 2.5 })
                }
              )
            ] }) })
          ] }),
          N.length > 0 && /* @__PURE__ */ n("div", { className: "flex flex-col gap-1.5", children: [
            /* @__PURE__ */ n("span", { className: "font-bold text-xs text-[var(--agv-text-muted)] uppercase tracking-wide", children: [
              "DÒNG ĐANG GHIM (",
              N.length,
              ")"
            ] }),
            /* @__PURE__ */ t("div", { className: "flex flex-wrap gap-1.5", children: N.map((e) => /* @__PURE__ */ n(
              "div",
              {
                className: "inline-flex items-center rounded border border-[var(--agv-border-strong)] bg-[var(--agv-bg-control)] overflow-hidden",
                children: [
                  /* @__PURE__ */ t("span", { className: "min-h-[28px] h-7 px-2.5 flex items-center justify-center bg-agv-accent text-agv-accent-text font-bold text-xs select-none", children: e.label }),
                  /* @__PURE__ */ t("span", { className: "min-h-[28px] h-7 px-2 flex items-center text-xs text-[var(--agv-text-main)] select-none border-l border-[var(--agv-border)] max-w-[180px] truncate", children: e.valueText }),
                  /* @__PURE__ */ t(
                    "button",
                    {
                      type: "button",
                      onClick: () => me?.(e.rowKey),
                      className: `min-h-[28px] min-w-[28px] h-7 w-7 flex items-center justify-center text-xs text-[var(--agv-text-muted)] hover:text-[var(--agv-danger)] hover:bg-[var(--agv-danger-bg)] transition cursor-pointer select-none border-l border-[var(--agv-border)] ${v}`,
                      children: /* @__PURE__ */ t(g, { size: 11, strokeWidth: 2.5 })
                    }
                  )
                ]
              },
              String(e.rowKey)
            )) })
          ] })
        ] })
      }
    ),
    z > 0 && /* @__PURE__ */ t(
      "div",
      {
        className: `px-3 py-2 border-t border-[var(--agv-border)] shrink-0 min-h-[38px] flex items-center ${m ? "bg-transparent" : "bg-[var(--agv-bg-header)]"}`,
        children: /* @__PURE__ */ t(
          $e,
          {
            variant: "destructive",
            size: "sm",
            onClick: () => {
              he?.(), j();
            },
            className: "w-full",
            children: "Xóa tất cả tiêu chí"
          }
        )
      }
    )
  ] });
  if (m)
    return /* @__PURE__ */ t(
      Se,
      {
        isOpen: I,
        anchorEl: m,
        onClose: j,
        placement: "bottom-start",
        showArrow: !0,
        offset: 10,
        width: K,
        minWidth: 300,
        maxWidth: "calc(100vw - 24px)",
        paddingClassName: "p-0",
        contentClassName: "text-xs",
        zIndex: 99999999,
        theme: F,
        ignoreClickOutsideSelectors: ".agv-select-portal, .agv-portal-dropdown, .agv-floating-popup, [data-summary-trigger='true'], [data-agv-popover-trigger='true']",
        children: /* @__PURE__ */ t("div", { className: "flex flex-col text-xs overflow-hidden rounded-md select-none", children: ae })
      }
    );
  const T = {
    position: "fixed",
    left: `${k}px`,
    width: `${K}px`,
    maxWidth: "calc(100vw - 16px)",
    maxHeight: `${re}px`,
    zIndex: 99999999,
    backgroundColor: "var(--popup-background)",
    borderColor: "var(--popup-border)",
    boxShadow: "var(--popup-shadow)",
    color: "var(--agv-text-main)"
  };
  return J && o ? (T.bottom = `${G - o.top + 4}px`, T.top = "auto") : o && (T.top = `${o.bottom + 4}px`, T.bottom = "auto"), ye(
    /* @__PURE__ */ t(
      "div",
      {
        ref: X,
        style: T,
        className: `agv-criteria-summary-popup agv-popup-panel flex flex-col rounded-md border text-xs overflow-hidden select-none ${J ? "agv-spring-up" : "agv-spring-down"} ${De(
          F
        )}`,
        "data-theme": F,
        "data-agv-popup": "true",
        onClick: (e) => e.stopPropagation(),
        onWheel: (e) => e.stopPropagation(),
        children: ae
      }
    ),
    document.body
  );
};
export {
  Fe as AdvCriteriaSummaryPopup
};
