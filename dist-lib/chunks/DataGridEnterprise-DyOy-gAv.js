import { jsxs as ut, jsx as T, Fragment as ti } from "react/jsx-runtime";
import un, { useRef as ne, useCallback as v, useLayoutEffect as Rr, useEffect as Be, memo as Il, useMemo as W, Suspense as Ut, lazy as vn, useState as be, forwardRef as ka, useImperativeHandle as Ea, useDeferredValue as bl } from "react";
import { D as ce, s as Rt, P as Se, C as vt, F as lr, S as bt, E as Gi, r as Ta, G as Vn, g as oi, e as $l, c as Yr, b as et, j as Xr, p as Jo, m as Ra, d as jr, A as ar, k as Ui, h as Ma, q as Cl, n as Tr, u as Ll, a as Wn } from "./gridFormatUtils-wCKPmlrt.js";
import { e as Qi, f as Yi, h as xo, A as qr, c as Gl, D as Fl, a as Fi, b as Da } from "./AdvButton-Ck5SixaL.js";
import { c as Pa } from "./createLucideIcon-BCMt_G8a.js";
import { a as _a, b as Aa, f as Na } from "./gridTreeDataEngine-Bn1JDPXI.js";
import { t as Hl, v as Ba, w as Ia, x as Hi } from "./DataGrid-m9TvRP_P.js";
import { S as qi, g as $a } from "./common-29M8PlVv.js";
import { M as La } from "./MorphCheckbox-S5ZNer1R.js";
import { n as Ga } from "./normalizeColumns-2pLF_8Qh.js";
const zl = {
  name: "funnel",
  size: 24,
  node: [
    [
      "path",
      {
        d: "M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z",
        key: "sc7q7i"
      }
    ]
  ],
  aliases: ["filter"]
};
zl.node;
const Fa = Pa(zl);
let mo = null, yo = null;
function Ha() {
  mo || yo || (yo = import("./columnResizeEngine-B_hr6Lk0.js").then((e) => (mo = e, e)));
}
function za({
  colMap: e,
  colWidths: t,
  setColWidth: f
}) {
  const s = ne(null), g = ne(t);
  return g.current = t, {
    handleMouseDownResize: v(
      (x, N) => {
        const w = e[x];
        if (!w || w.resizable === !1 || w.dataType === ce.SYSTEM || w.isRowNumber || w.isSelection)
          return;
        if (N.preventDefault(), N.stopPropagation(), mo) {
          mo.startColumnResizeSession({
            key: x,
            event: N,
            colMap: e,
            colWidthsRef: g,
            setColWidth: f,
            resizingRef: s
          });
          return;
        }
        const C = N.clientX, b = N.currentTarget, y = { clientX: C, currentTarget: b };
        yo || (yo = import("./columnResizeEngine-B_hr6Lk0.js").then((K) => (mo = K, K))), yo.then((K) => {
          K.startColumnResizeSession({
            key: x,
            event: y,
            colMap: e,
            colWidthsRef: g,
            setColWidth: f,
            resizingRef: s
          });
        });
      },
      [f, e]
    ),
    resizingRef: s
  };
}
let vo = null, bo = null;
function Ka() {
  vo || bo || (bo = import("./sortFlipEngine-BZscb-en.js").then((e) => (vo = e, e)));
}
function Oa({
  enabled: e = !0,
  scrollContainerRef: t,
  virtualScrollTopRef: f,
  sortConfig: s,
  sortRules: g,
  groupSortConfig: m,
  visibleRows: x,
  visibleChunksMap: N,
  chunkSize: w = 20,
  actualRowHeight: C,
  findRowIndexAtOffset: b,
  viewportHeight: y,
  getRowKey: K
}) {
  const ee = `${g && g.length > 0 ? g.map((u) => `${u.key}:${u.direction}:${u.sortByMonth ?? ""}`).join(",") : `${s?.key ?? ""}:${s?.direction ?? ""}:${s?.sortByMonth ?? ""}`}|${m?.colKey ?? ""}:${m?.direction ?? ""}`, q = ne(null), Q = ne(/* @__PURE__ */ new Map()), V = ne({
    startRow: 0,
    centerRow: 10
  }), E = ne(null), M = ne(null), Z = ne([]);
  Rr(() => {
    if (!e) return;
    const u = q.current !== null && q.current !== ee;
    q.current = ee;
    const G = t.current;
    if (!u || !G) return;
    const X = Q.current, { startRow: F, centerRow: Y } = V.current;
    if (vo) {
      vo.runSortFlipAnimation({
        viewportEl: G,
        prevMap: X,
        prevStartRow: F,
        viewportCenterRow: Y,
        actualRowHeight: C,
        activeAnimatedRowsRef: Z,
        sortAnimRafRef: E,
        sortAnimTimeoutRef: M
      });
      return;
    }
    bo || (bo = import("./sortFlipEngine-BZscb-en.js").then((fe) => (vo = fe, fe))), bo.then((fe) => {
      fe.runSortFlipAnimation({
        viewportEl: G,
        prevMap: X,
        prevStartRow: F,
        viewportCenterRow: Y,
        actualRowHeight: C,
        activeAnimatedRowsRef: Z,
        sortAnimRafRef: E,
        sortAnimTimeoutRef: M
      });
    });
  }, [e, t, ee, C]), Be(() => {
    if (!e) return;
    const u = /* @__PURE__ */ new Map();
    if (x)
      for (let fe = 0; fe < x.length; fe++) {
        const Ce = x[fe], ie = Ce.row, me = Ce.rowIndex, h = ie?._isGroupRow ? `group_${ie.groupColumnKey || ""}_${ie.groupValue ?? ie.path ?? me}` : String(K(ie, me));
        u.set(h, me);
      }
    else if (N)
      for (const [fe, Ce] of N.entries()) {
        const ie = fe * w;
        for (let me = 0; me < Ce.length; me++) {
          const h = Ce[me], ue = ie + me, j = h?._isGroupRow ? `group_${h.groupColumnKey || ""}_${h.groupValue ?? h.path ?? ue}` : String(K(h, ue));
          u.set(j, ue);
        }
      }
    Q.current = u;
    const G = f?.current || t.current?.scrollTop || 0, X = Math.max(
      0,
      b ? b(G) : Math.floor(G / C)
    ), F = b ? b(G + (y || 600)) : X + Math.max(1, Math.floor((y || 600) / C)), Y = Math.max(1, F - X + 1);
    V.current = {
      startRow: X,
      centerRow: X + Math.floor(Y / 2)
    };
  }, [
    e,
    t,
    f,
    x,
    N,
    w,
    C,
    b,
    y,
    K
  ]), Be(() => () => {
    E.current !== null && cancelAnimationFrame(E.current), M.current !== null && window.clearTimeout(M.current);
  }, []);
}
const Zo = () => {
  import("./GridMorphPrimitives-C4lfAub2.js"), Ka();
}, Wa = () => {
  import("./AdvChecklistFilterPopup-1gdPDCKD.js");
}, Va = un.lazy(
  () => import("./GridMorphPrimitives-C4lfAub2.js").then((e) => ({ default: e.HeaderSortMorphIcon }))
), xl = un.lazy(
  () => import("./GridMorphPrimitives-C4lfAub2.js").then((e) => ({ default: e.HeaderBandToggleMorphIcon }))
), Ua = un.memo(({
  totalGridWidth: e,
  leftColumns: t,
  middleElements: f,
  rightColumns: s,
  colWidths: g,
  columnPins: m,
  leftOffsets: x,
  rightOffsets: N,
  centerDockStatus: w,
  centerLeftOffsets: C,
  centerRightOffsets: b,
  lastEffectiveLeftColKey: y,
  firstEffectiveRightColKey: K,
  sortConfig: J,
  sortRules: ee,
  surfaceTheme: q,
  columnFilters: Q = {},
  activeChecklistColKey: V = null,
  emptyColKeys: E,
  onOpenChecklistFilter: M,
  onToggleSort: Z,
  onColumnContextMenu: u,
  onBandContextMenu: G,
  onMouseDownResize: X,
  onToggleGroup: F,
  onReorderColumns: Y,
  headerHeight: fe,
  hasFilterRow: Ce = !0,
  enableSorting: ie = !0,
  enableColumnResize: me = !0,
  enableContextMenu: h = !0
}) => {
  const ue = xo(), j = Ce ? ue.headerBorderBottom : ue.systemBorderBottom, Ae = f.some((R) => R.type === "group"), ye = `${fe ?? (Ae ? 64 : 34)}px`, [De, Pe] = un.useState(null), [We, xe] = un.useState(null), Ie = un.useRef(null), Le = (R, O = !1, D) => {
    const _ = typeof document < "u" && (document.documentElement.getAttribute("data-agv-resizing") === "true" || document.body.classList.contains("agv-resizing-column")), L = !O && !!Y && !_;
    return {
      draggable: L,
      onDragStart: (B) => {
        if (!L || typeof document < "u" && (document.documentElement.getAttribute("data-agv-resizing") === "true" || document.body.classList.contains("agv-resizing-column"))) {
          B.preventDefault();
          return;
        }
        B.stopPropagation(), Ie.current = R, B.dataTransfer.setData("text/plain", R), B.dataTransfer.effectAllowed = "move", requestAnimationFrame(() => {
          xe(R);
        });
      },
      onDragEnd: () => {
        Ie.current = null, xe(null), Pe(null);
      },
      onDragOver: (B) => {
        const k = Ie.current || We;
        L && k && k !== R && !D?.has(k) && (B.preventDefault(), B.stopPropagation(), B.dataTransfer.dropEffect = "move", De !== R && Pe(R));
      },
      onDragLeave: (B) => {
        const k = B.relatedTarget;
        k && B.currentTarget.contains(k) || De === R && Pe(null);
      },
      onDrop: (B) => {
        if (L) {
          B.preventDefault(), B.stopPropagation();
          const k = B.dataTransfer.getData("text/plain") || Ie.current || We;
          k && k !== R && !D?.has(k) && Y?.(k, R);
        }
        Ie.current = null, Pe(null), xe(null);
      }
    };
  }, Fe = (R, O = !1) => {
    const D = ie ? ee && ee.length > 0 ? ee : J?.key ? [J] : [] : [], _ = D.findIndex((Te) => Te.key === R.key), L = _ >= 0 ? D[_] : null, B = !!L, k = D.length >= 2, te = R.dataType === ce.SYSTEM || !!R.isRowNumber || Rt(R), de = Q[R.key], ae = !!(de && (de.mode === lr.CHECKLIST || Array.isArray(de.selectedValues) && de.selectedValues.length > 0 || de.includeBlanks)), we = V === R.key;
    return /* @__PURE__ */ ut(ti, { children: [
      /* @__PURE__ */ ut("div", { className: "inline-flex items-center justify-center gap-1 max-w-full px-0.5 min-w-0", children: [
        R.renderHeader ? /* @__PURE__ */ T(
          "div",
          {
            className: `inline-flex items-center justify-center max-w-full min-w-0 text-xs font-bold uppercase tracking-wider truncate text-center ${B ? "text-[var(--agv-accent)]" : ""}`,
            onClick: Rt(R) ? (Te) => Te.stopPropagation() : void 0,
            children: R.renderHeader()
          }
        ) : /* @__PURE__ */ T(
          "span",
          {
            className: `text-xs font-bold uppercase tracking-wider truncate text-center ${B ? "text-[var(--agv-accent)]" : ""}`,
            children: te && !R.title ? "" : R.title
          }
        ),
        L && /* @__PURE__ */ ut("span", { className: "shrink-0 inline-flex items-center text-[var(--agv-accent)]", children: [
          /* @__PURE__ */ T(un.Suspense, { fallback: null, children: /* @__PURE__ */ T(
            Va,
            {
              direction: L.direction === bt.ASC ? bt.ASC : bt.DESC,
              size: O ? 10 : 11
            }
          ) }),
          k && /* @__PURE__ */ T("span", { className: "text-xs font-extrabold leading-none tabular-nums ml-0.5", children: _ + 1 })
        ] })
      ] }),
      M && !te && R.filterable !== !1 && !E?.has(R.key) && /* @__PURE__ */ T(
        "div",
        {
          className: `absolute z-10 flex shrink-0 items-center ${O ? "right-0.5 top-1/2 -translate-y-1/2" : "right-1 top-1.5"}`,
          children: /* @__PURE__ */ T(
            "button",
            {
              type: "button",
              "data-checklist-trigger": R.key,
              "data-agv-popover-trigger": "true",
              onMouseEnter: Wa,
              onClick: (Te) => {
                Te.stopPropagation(), M(R.key, Te);
              },
              className: `agv-header-filter-btn flex items-center justify-center rounded transition-colors cursor-pointer border-none ${O ? "w-3.5 h-3.5" : "w-4 h-4"} ${we ? "bg-[var(--agv-bg-item-hover)] text-[var(--agv-accent)] opacity-100 ring-1 ring-[var(--agv-accent)]/40" : ae ? "bg-transparent text-[var(--agv-accent)] opacity-100" : "bg-transparent text-[var(--agv-text-muted)] opacity-0 group-hover/th:opacity-100 focus:opacity-100 focus-visible:opacity-100 hover:text-[var(--agv-accent)]"}`,
              children: /* @__PURE__ */ T(Fa, { size: O ? 10 : 11, strokeWidth: 2.5 })
            }
          )
        }
      ),
      me && X && R.resizable !== !1 && !te && /* @__PURE__ */ T(
        "div",
        {
          "data-col-resize-handle": R.key,
          draggable: !1,
          onMouseEnter: Ha,
          onDragStart: (Te) => {
            Te.preventDefault(), Te.stopPropagation();
          },
          onMouseDown: (Te) => {
            Te.stopPropagation(), X(R.key, Te);
          },
          onClick: (Te) => {
            Te.stopPropagation();
          },
          className: "agv-col-resize-handle absolute -right-[4px] top-0 bottom-0 w-[9px] cursor-col-resize z-50 flex items-center justify-center group/resize",
          children: /* @__PURE__ */ T("span", { className: "w-[2px] h-full transition-colors group-hover/resize:bg-[var(--agv-accent)] group-active/resize:bg-[var(--agv-accent)]" })
        }
      )
    ] });
  };
  return /* @__PURE__ */ ut(
    "div",
    {
      "data-agv-header-root": "true",
      "data-agv-fullwidth": "true",
      style: {
        width: `var(--agv-total-grid-w, ${e}px)`,
        minWidth: `var(--agv-total-grid-w, ${e}px)`,
        transform: "translateZ(0)",
        height: ye,
        backgroundColor: "var(--agv-bg-header)",
        color: "var(--agv-text-header, var(--agv-text-main))"
      },
      className: `sticky top-0 z-30 flex box-border ${ue.headerBg}`,
      children: [
        t.map((R) => {
          const O = g[R.key] || R.defaultWidth, D = R.key === y, _ = R.dataType === ce.SYSTEM || !!R.isRowNumber || Rt(R), L = ie && R.sortable !== !1, B = h && !!u && !_ && !R.disableHeaderContextMenu, k = De === R.key, te = `${j} ${ue.sharedHeaderCellBg} ${ue.headerHoverBg}`, de = D ? Qi() : ue.headerBorderRight;
          return /* @__PURE__ */ T(
            "div",
            {
              "data-col-key": R.key,
              ...Le(R.key, _),
              onMouseEnter: L ? Zo : void 0,
              onClick: (ae) => L && Z(R.key, ae),
              onContextMenu: (ae) => {
                B ? (ae.preventDefault(), ae.stopPropagation(), u?.(R.key, ae)) : h && (ae.preventDefault(), ae.stopPropagation());
              },
              style: {
                width: `var(--agv-col-w-${R.key}, ${O}px)`,
                minWidth: `var(--agv-col-w-${R.key}, ${O}px)`,
                maxWidth: `var(--agv-col-w-${R.key}, ${O}px)`,
                height: ye,
                position: "sticky",
                left: `var(--agv-left-offset-${R.key}, ${x[R.key]}px)`,
                backgroundColor: "var(--agv-bg-header)",
                color: "var(--agv-text-header, var(--agv-text-main))"
              },
              className: `group/th flex flex-col justify-center items-center text-center ${_ ? "px-0.5" : "px-1.5"} ${te} ${de} shrink-0 sticky z-40 select-none box-border ${L ? "cursor-pointer" : "cursor-default"} transition-colors relative ${k ? "ring-2 ring-inset ring-[var(--agv-accent)]" : ""}`,
              children: Fe(R)
            },
            `left_${R.key}`
          );
        }),
        f.map((R) => {
          if (R.type === "standalone") {
            const O = R.col, D = g[O.key] || O.defaultWidth, L = m[O.key] === Se.CENTER ? w[O.key] || vt.NORMAL : vt.NORMAL, B = L === vt.LEFT, k = L === vt.RIGHT, te = O.key === y, de = O.key === K, ae = O.dataType === ce.SYSTEM || !!O.isRowNumber || Rt(O), we = {
              width: `var(--agv-col-w-${O.key}, ${D}px)`,
              minWidth: `var(--agv-col-w-${O.key}, ${D}px)`,
              maxWidth: `var(--agv-col-w-${O.key}, ${D}px)`,
              height: ye,
              backgroundColor: "var(--agv-bg-header)",
              color: "var(--agv-text-header, var(--agv-text-main))",
              ...B ? { position: "sticky", left: `var(--agv-center-left-offset-${O.key}, ${C[O.key]}px)`, zIndex: 40 } : k ? { position: "sticky", right: `var(--agv-center-right-offset-${O.key}, ${b[O.key]}px)`, zIndex: 40 } : {}
            }, Te = `${j} ${ue.sharedHeaderCellBg} ${ue.headerHoverBg}`, ve = te ? Qi() : ue.headerBorderRight, Ue = de ? Yi() : "", Qe = ie && O.sortable !== !1, pt = h && !!u && !ae && !O.disableHeaderContextMenu, S = De === O.key;
            return /* @__PURE__ */ T(
              "div",
              {
                "data-col-key": O.key,
                ...Le(O.key, ae),
                onMouseEnter: Qe ? Zo : void 0,
                onClick: (i) => Qe && Z(O.key, i),
                onContextMenu: (i) => {
                  pt ? (i.preventDefault(), i.stopPropagation(), u?.(O.key, i)) : h && (i.preventDefault(), i.stopPropagation());
                },
                style: we,
                className: `group/th flex flex-col justify-center items-center text-center px-1.5 ${Te} ${ve} ${Ue} ${B || k ? "sticky z-40" : "relative z-10"} shrink-0 select-none box-border ${Qe ? "cursor-pointer" : "cursor-default"} transition-colors relative ${S ? "ring-2 ring-inset ring-[var(--agv-accent)]" : ""}`,
                children: Fe(O)
              },
              `mid_standalone_${O.key}`
            );
          } else {
            const O = R.def, D = R.children;
            D.reduce(
              (k, te) => k + (g[te.key] || te.defaultWidth),
              0
            );
            const _ = new Set(D.map((k) => k.key)), L = De === O.id, B = `calc(${D.map((k) => `var(--agv-col-w-${k.key}, ${g[k.key] || k.defaultWidth}px)`).join(" + ")})`;
            return /* @__PURE__ */ ut(
              "div",
              {
                "data-band-key": O.id,
                style: { width: B, minWidth: B, height: "64px" },
                className: "flex flex-col shrink-0 relative z-10 select-none box-border h-[64px] min-h-[64px] max-h-[64px]",
                children: [
                  /* @__PURE__ */ ut(
                    "div",
                    {
                      ...Le(O.id, !1, _),
                      style: {
                        width: B,
                        minWidth: B,
                        height: "32px",
                        backgroundColor: "var(--agv-bg-header)",
                        color: "var(--agv-text-header, var(--agv-text-main))"
                      },
                      onContextMenu: (k) => {
                        h && G ? (k.preventDefault(), k.stopPropagation(), G(O.id, D, k)) : h && (k.preventDefault(), k.stopPropagation());
                      },
                      className: `relative flex items-center justify-center text-center px-8 text-xs font-bold uppercase tracking-wider border-r border-b ${ue.tier1Border} ${ue.tier1Bg} shrink-0 box-border h-[32px] min-h-[32px] max-h-[32px] leading-[32px] cursor-pointer ${L ? "ring-2 ring-inset ring-[var(--agv-accent)]" : ""}`,
                      children: [
                        O.isToggleable && /* @__PURE__ */ T(
                          "button",
                          {
                            type: "button",
                            onClick: (k) => {
                              k.preventDefault(), k.stopPropagation(), F?.(O.id);
                            },
                            className: "absolute left-1.5 top-1/2 -translate-y-1/2 h-5 w-5 flex items-center justify-center p-0 border-none bg-transparent hover:opacity-75 transition cursor-pointer select-none outline-none",
                            style: {
                              background: "transparent",
                              border: "none",
                              color: "var(--agv-text-main)"
                            },
                            children: /* @__PURE__ */ T(un.Suspense, { fallback: null, children: /* @__PURE__ */ T(
                              xl,
                              {
                                direction: O.isCollapsed ? "right" : "left"
                              }
                            ) })
                          }
                        ),
                        /* @__PURE__ */ T("span", { className: "truncate text-center w-full", children: O.title }),
                        O.isToggleable && !O.isCollapsed && /* @__PURE__ */ T(
                          "button",
                          {
                            type: "button",
                            onClick: (k) => {
                              k.preventDefault(), k.stopPropagation(), F?.(O.id);
                            },
                            className: "absolute right-1.5 top-1/2 -translate-y-1/2 h-5 w-5 flex items-center justify-center p-0 border-none bg-transparent hover:opacity-75 transition cursor-pointer select-none outline-none",
                            style: {
                              background: "transparent",
                              border: "none",
                              color: "var(--agv-text-main)"
                            },
                            children: /* @__PURE__ */ T(un.Suspense, { fallback: null, children: /* @__PURE__ */ T(xl, { direction: "left" }) })
                          }
                        )
                      ]
                    }
                  ),
                  /* @__PURE__ */ T(
                    "div",
                    {
                      style: { width: B, minWidth: B, height: "32px" },
                      className: "flex items-center shrink-0 box-border h-[32px] min-h-[32px] max-h-[32px]",
                      children: D.map((k) => {
                        const te = g[k.key] || k.defaultWidth, de = k.dataType === ce.SYSTEM || !!k.isRowNumber || Rt(k), ae = ie && k.sortable !== !1, we = h && !!u && !de && !k.disableHeaderContextMenu, Te = De === k.key;
                        return /* @__PURE__ */ T(
                          "div",
                          {
                            "data-col-key": k.key,
                            "data-tier2-col-key": k.key,
                            ...Le(k.key, de, /* @__PURE__ */ new Set([O.id])),
                            onMouseEnter: ae ? Zo : void 0,
                            onClick: (ve) => ae && Z(k.key, ve),
                            onContextMenu: (ve) => {
                              we ? (ve.preventDefault(), ve.stopPropagation(), u?.(k.key, ve)) : h && (ve.preventDefault(), ve.stopPropagation());
                            },
                            style: {
                              width: `var(--agv-col-w-${k.key}, ${te}px)`,
                              minWidth: `var(--agv-col-w-${k.key}, ${te}px)`,
                              maxWidth: `var(--agv-col-w-${k.key}, ${te}px)`,
                              height: "32px",
                              backgroundColor: "var(--agv-bg-header)",
                              color: "var(--agv-text-header, var(--agv-text-main))"
                            },
                            className: `group/th flex items-center justify-center text-center px-1 text-xs font-bold uppercase tracking-wider ${ue.headerBorderRight} ${j} ${ue.sharedHeaderCellBg} ${ue.headerHoverBg} shrink-0 relative box-border h-[32px] min-h-[32px] max-h-[32px] leading-[32px] ${ae ? "cursor-pointer" : "cursor-default"} transition-colors ${Te ? "ring-2 ring-inset ring-[var(--agv-accent)]" : ""}`,
                            children: Fe(k, !0)
                          },
                          k.key
                        );
                      })
                    }
                  )
                ]
              },
              R.segmentKey
            );
          }
        }),
        s.map((R) => {
          const O = g[R.key] || R.defaultWidth, D = R.key === K, _ = R.dataType === ce.SYSTEM || !!R.isRowNumber || Rt(R), L = ie && R.sortable !== !1, B = h && !!u && !_ && !R.disableHeaderContextMenu, k = `${j} ${ue.sharedHeaderCellBg} ${ue.headerHoverBg}`, te = ue.headerBorderRight, de = De === R.key;
          return /* @__PURE__ */ T(
            "div",
            {
              "data-col-key": R.key,
              ...Le(R.key, _),
              onMouseEnter: L ? Zo : void 0,
              onClick: (ae) => L && Z(R.key, ae),
              onContextMenu: (ae) => {
                B ? (ae.preventDefault(), ae.stopPropagation(), u?.(R.key, ae)) : h && (ae.preventDefault(), ae.stopPropagation());
              },
              style: {
                width: `var(--agv-col-w-${R.key}, ${O}px)`,
                minWidth: `var(--agv-col-w-${R.key}, ${O}px)`,
                maxWidth: `var(--agv-col-w-${R.key}, ${O}px)`,
                height: ye,
                position: "sticky",
                right: `var(--agv-right-offset-${R.key}, ${N[R.key]}px)`,
                backgroundColor: "var(--agv-bg-header)",
                color: "var(--agv-text-header, var(--agv-text-main))"
              },
              className: `group/th flex flex-col justify-center items-center text-center px-1.5 ${k} ${te} shrink-0 sticky z-40 select-none box-border ${L ? "cursor-pointer" : "cursor-default"} transition-colors ${D ? Yi() : ""} relative ${de ? "ring-2 ring-inset ring-[var(--agv-accent)]" : ""}`,
              children: Fe(R)
            },
            `right_${R.key}`
          );
        })
      ]
    }
  );
}), Qa = (e) => e.editable !== !1 && e.dataType !== ce.SYSTEM;
function Kl(e) {
  const {
    columns: t,
    colWidths: f,
    rowHeight: s,
    surfaceTheme: g,
    columnPins: m,
    leftOffsets: x,
    rightOffsets: N,
    lastEffectiveLeftColKey: w,
    firstEffectiveRightColKey: C,
    centerDockStatus: b,
    centerLeftOffsets: y,
    centerRightOffsets: K,
    emptyColKeys: J,
    dynamicRowHeight: ee = !1
  } = e, q = xo(), Q = Qi(), V = Yi(), E = new Array(t.length);
  let M = 0;
  for (let Z = 0; Z < t.length; Z++) {
    const u = t[Z], G = f[u.key] || u.defaultWidth;
    M += G;
    const X = m[u.key] || Se.NONE, F = X === Se.LEFT, Y = X === Se.RIGHT, Ce = X === Se.CENTER ? b[u.key] || vt.NORMAL : vt.NORMAL, ie = Ce === vt.LEFT, me = Ce === vt.RIGHT, h = F || ie, ue = Y || me, j = u.key === w, Ae = u.key === C, Me = !!(u.isDetailExpand || u.key === "col_detail_expand"), ye = !!(!Me && (u.isRowNumber || u.key === "col_stt" || u.dataType === ce.SYSTEM && u.title)), De = !Me && Rt(u), Pe = ye ? "stt" : De ? "chk" : Me ? "expand" : "data", We = h || ue || u.dataType === ce.SYSTEM || ye || De || Me, xe = ee ? { width: `${G}px`, minHeight: `${s}px` } : { width: `${G}px`, height: `${s}px` }, Ie = F ? { ...xe, position: "sticky", left: `${x[u.key]}px`, zIndex: 20 } : ie ? { ...xe, position: "sticky", left: `${y[u.key]}px`, zIndex: 20 } : Y ? { ...xe, position: "sticky", right: `${N[u.key]}px`, zIndex: 20 } : me ? { ...xe, position: "sticky", right: `${K[u.key]}px`, zIndex: 20 } : xe, Le = `${q.borderBottom} ${j ? Q : q.borderRight}${Ae ? ` ${V}` : ""}`, Fe = !!J?.has(u.key), R = u.dataType === ce.NUMBER, O = u.dataType === ce.TIME || u.editorType === Gi.TIME, D = u.dataType === ce.DATE || u.editorType === Gi.DATE || u.editorType === Gi.DATERANGE || !!u.isDateRange, _ = R ? "agv-cell-number " : D || O ? "agv-cell-date " : u.className ? `${u.className} ` : "", L = u.cellPadding ? u.cellPadding : u.dataType === ce.SYSTEM ? "px-1" : "px-2.5", B = Ta(u.align), te = !!(ee && u.wrapText) ? "agv-cell-wrap whitespace-normal [overflow-wrap:anywhere] py-2 leading-4 min-h-[32px]" : ee ? "whitespace-nowrap min-h-[32px]" : "whitespace-nowrap min-h-[32px] max-h-[32px] leading-[32px]", de = `text-xs ${Le} shrink-0 overflow-hidden ${te} tabular-nums box-border ${_}${Fe ? "cursor-not-allowed select-none " : ""}${B}`, ae = Fe ? "bg-surface-subtle opacity-60" : We ? q.sharedHeaderCellBg : "", we = ae || q.rowEvenBg, Te = ae || q.rowOddBg, ve = ae || q.rowSelectedBg;
    E[Z] = {
      col: u,
      key: u.key,
      width: G,
      cellRole: Pe,
      editable: !Fe && Qa(u),
      isEmptyCol: Fe,
      isDisableContextMenu: !!(u.disableContextMenu || u.dataType === ce.SYSTEM),
      isNumber: R,
      isTime: O,
      isDateLike: D,
      hasCustomCellRender: !!u.renderCell,
      stickyStyle: Ie,
      classNameEven: `flex items-center ${L} ${de} ${we}`,
      classNameOdd: `flex items-center ${L} ${de} ${Te}`,
      classNameSelected: `flex items-center ${L} ${de} ${ve}`,
      classNameEditing: `flex items-center p-0.5 ${de} ${ve}`
    };
  }
  return { metas: E, totalWidth: M };
}
function Ya(e) {
  const { metas: t, totalWidth: f } = Kl(e), s = {};
  for (let m = 0; m < t.length; m++)
    s[t[m].key] = t[m];
  const g = !!e.dynamicRowHeight;
  return {
    columns: e.columns,
    colWidths: e.colWidths,
    rowHeight: e.rowHeight,
    totalRowWidth: f,
    rowBoxStyle: g ? { minHeight: `${e.rowHeight}px`, width: `${f}px` } : { height: `${e.rowHeight}px`, width: `${f}px` },
    colRenderMetas: t,
    colMetaByKey: s,
    surfaceTheme: e.surfaceTheme,
    columnPins: e.columnPins,
    leftOffsets: e.leftOffsets,
    rightOffsets: e.rightOffsets,
    lastEffectiveLeftColKey: e.lastEffectiveLeftColKey,
    firstEffectiveRightColKey: e.firstEffectiveRightColKey,
    centerDockStatus: e.centerDockStatus,
    centerLeftOffsets: e.centerLeftOffsets,
    centerRightOffsets: e.centerRightOffsets,
    emptyColKeys: e.emptyColKeys,
    dynamicRowHeight: g
  };
}
const zi = vn(
  () => import("./GridMorphPrimitives-C4lfAub2.js").then((e) => ({ default: e.RowGroupChevronMorphIcon }))
), ja = vn(
  () => import("./GridInCellEditor-CcamRG37.js")
), qa = vn(
  () => import("./GridGroupHeaderRow-wtyCtDAJ.js").then((e) => ({ default: e.GridGroupHeaderRow }))
), Xa = vn(
  () => import("./GridDetailRow-DCdNgeIf.js").then((e) => ({ default: e.GridDetailRow }))
), Ja = (e, t, f) => {
  if (t.valueGetter) {
    const s = t.valueGetter(e?._baseRecord ?? e, f);
    return s != null ? String(s) : "";
  }
  if (e?.cells instanceof Map) {
    const s = e.cells.get(t.key);
    return s?.value !== void 0 ? String(s.value) : "";
  }
  return e?.[t.key] !== void 0 ? String(e[t.key]) : "";
}, ji = Il(
  ({
    row: e,
    rowIndex: t,
    rowKey: f,
    columns: s,
    colWidths: g,
    colRenderMetas: m,
    layoutSnapshot: x,
    delegatedEvents: N = !1,
    dynamicRowHeight: w,
    totalRowWidth: C,
    rowHeight: b,
    isSelected: y,
    isChecked: K,
    onSelectRow: J,
    onToggleCheck: ee,
    surfaceTheme: q,
    columnPins: Q,
    leftOffsets: V,
    rightOffsets: E,
    lastEffectiveLeftColKey: M,
    firstEffectiveRightColKey: Z,
    centerDockStatus: u,
    centerLeftOffsets: G,
    centerRightOffsets: X,
    renderCell: F,
    onCellContextMenu: Y,
    onGroupContextMenu: fe,
    editMode: Ce = Vn.VIEW,
    editingCell: ie,
    onStartEditCell: me,
    onEndEditCell: h,
    onCellChange: ue,
    getColumnDateBounds: j,
    emptyColKeys: Ae,
    rowSpanPlan: Me,
    treeColumnKey: ye,
    treeIndentSize: De,
    onToggleTreeExpand: Pe,
    detailExpandColKey: We,
    isDetailExpanded: xe,
    canExpandDetail: Ie,
    onToggleRowDetail: Le,
    renderDetailRow: Fe
  }) => {
    const R = t % 2 === 0, O = y || K, D = xo(), _ = O ? D.rowSelectedBg : R ? D.rowEvenBg : D.rowOddBg, L = W(() => x || m && C !== void 0 ? null : Kl({
      columns: s,
      colWidths: g,
      rowHeight: b,
      surfaceTheme: q,
      columnPins: Q,
      leftOffsets: V,
      rightOffsets: E,
      lastEffectiveLeftColKey: M,
      firstEffectiveRightColKey: Z,
      centerDockStatus: u,
      centerLeftOffsets: G,
      centerRightOffsets: X,
      emptyColKeys: Ae
    }), [
      x,
      m,
      C,
      s,
      g,
      b,
      q,
      Q,
      V,
      E,
      M,
      Z,
      u,
      G,
      X,
      Ae
    ]), B = x ? x.colRenderMetas : m || L.metas, k = x ? x.totalRowWidth : C !== void 0 ? C : L.totalWidth, te = !!(w ?? x?.dynamicRowHeight), de = x ? x.rowBoxStyle : te ? { minHeight: `${b}px`, width: `${k}px` } : { height: `${b}px`, width: `${k}px` };
    if (e?._isGroupRow)
      return /* @__PURE__ */ T(
        Ut,
        {
          fallback: /* @__PURE__ */ T(
            "div",
            {
              style: { height: `${b}px`, width: `${k}px` },
              className: "agv-group-row border-b border-[var(--agv-border)]"
            }
          ),
          children: /* @__PURE__ */ T(
            qa,
            {
              row: e,
              rowIndex: t,
              columns: s,
              colWidths: g,
              rowHeight: b,
              totalRowWidth: k,
              surfaceTheme: q,
              columnPins: Q,
              leftOffsets: V,
              rightOffsets: E,
              lastEffectiveLeftColKey: M,
              firstEffectiveRightColKey: Z,
              centerDockStatus: u,
              centerLeftOffsets: G,
              centerRightOffsets: X,
              onGroupContextMenu: fe
            }
          )
        }
      );
    if (e?._isDetailRow)
      return /* @__PURE__ */ T(
        Ut,
        {
          fallback: /* @__PURE__ */ T(
            "div",
            {
              "data-agv-detail-row": "true",
              style: {
                width: `var(--agv-total-grid-w, ${k}px)`,
                minHeight: `${Math.max(28, e?._detailFixedHeight ?? b)}px`,
                backgroundColor: "var(--agv-bg-root)"
              },
              className: "agv-detail-row border-b border-[var(--agv-border)] box-border"
            }
          ),
          children: /* @__PURE__ */ T(
            Xa,
            {
              row: e,
              rowIndex: t,
              rowKey: f ?? e?.id ?? t,
              totalRowWidth: k,
              renderDetailRow: Fe
            }
          )
        }
      );
    const ae = String(
      f ?? e?.originalIndex ?? e?.id ?? t
    ), we = (i) => {
      const z = i?.closest?.("[data-col-key]")?.getAttribute("data-col-key");
      if (z) {
        for (let se = 0; se < B.length; se++)
          if (B[se].key === z) return B[se];
      }
    }, Te = N ? void 0 : (i) => {
      if (Ce === Vn.SINGLE_CLICK && me) {
        const A = we(i.target);
        if (A && !A.isEmptyCol && A.editable) {
          if (ie?.rowIndex === t && ie?.colKey === A.key) return;
          i.stopPropagation(), J?.(t, e), me(t, A.key);
          return;
        }
      }
      J?.(t, e);
    }, ve = !N && Ce === Vn.DOUBLE_CLICK && me ? (i) => {
      const A = we(i.target);
      !A || A.isEmptyCol || !A.editable || ie?.rowIndex === t && ie?.colKey === A.key || (i.stopPropagation(), J?.(t, e), me(t, A.key));
    } : void 0, Ue = !N && Y ? (i) => {
      const A = we(i.target);
      if (A) {
        if (A.isDisableContextMenu) {
          i.preventDefault(), i.stopPropagation();
          return;
        }
        i.preventDefault(), Y(t, e, A.key, i);
      }
    } : void 0, Qe = !!(Me?.hasVerticalSpan || Me?.hasCoveredFromAbove), pt = !!Me?.hasCoveredFromAbove, S = pt ? { ...de, backgroundColor: "transparent", pointerEvents: "none" } : de;
    return /* @__PURE__ */ T(
      "div",
      {
        onClick: Te,
        onDoubleClick: ve,
        onContextMenu: Ue,
        "data-agv-row": "true",
        "data-agv-span-row": Qe ? "true" : void 0,
        "data-row-key": ae,
        "data-row-idx": t,
        "data-row-parity": R ? "even" : "odd",
        "data-row-focused": y ? "true" : void 0,
        "data-row-checked": K ? "true" : void 0,
        style: S,
        className: `agv-grid-row flex ${te ? "items-stretch min-h-[32px]" : "items-center min-h-[32px] max-h-[32px]"} ${pt ? "bg-transparent" : _} ${D.defaultTextColor} cursor-default ${Y ? "select-none" : "select-text"} box-border`,
        children: B.map((i, A) => {
          const z = Me?.cells[A];
          if (z?.kind === "omit")
            return null;
          if (z?.kind === "spacer") {
            const pe = {
              ...i.stickyStyle,
              width: `${z.widthPx}px`,
              minWidth: `${z.widthPx}px`,
              backgroundColor: "transparent",
              border: "none",
              pointerEvents: "none"
            };
            return /* @__PURE__ */ T(
              "div",
              {
                "data-col-key": i.key,
                "data-span-spacer": "true",
                "aria-hidden": "true",
                style: pe,
                className: "shrink-0 box-border select-none"
              },
              i.key
            );
          }
          const se = i.col, he = !i.isEmptyCol && ie?.rowIndex === t && ie?.colKey === i.key;
          let H = null;
          if (he)
            H = /* @__PURE__ */ T(Ut, { fallback: null, children: /* @__PURE__ */ T(
              ja,
              {
                column: se,
                row: e,
                rowIndex: t,
                initialValue: Ja(e, se, t),
                surfaceTheme: q,
                getColumnDateBounds: j,
                onCellChange: ue,
                onEndEditCell: h
              }
            ) });
          else if (i.cellRole === "expand" && !i.hasCustomCellRender) {
            const pe = f ?? e?.id ?? t;
            Ie !== !1 && (H = /* @__PURE__ */ T(
              qr,
              {
                variant: "ghost",
                size: "icon-sm",
                onClick: (ke) => {
                  ke.stopPropagation(), Le?.(pe, e);
                },
                onDoubleClick: (ke) => ke.stopPropagation(),
                onMouseDown: (ke) => ke.stopPropagation(),
                "aria-expanded": !!xe,
                "aria-label": xe ? "Đóng chi tiết" : "Mở chi tiết",
                children: /* @__PURE__ */ T(Ut, { fallback: null, children: /* @__PURE__ */ T(zi, { expanded: !!xe }) })
              }
            ));
          } else if (i.hasCustomCellRender || F && i.cellRole !== "expand") {
            const pe = {
              column: se,
              row: e,
              rowIndex: t,
              isSelected: y,
              isChecked: K
            };
            H = i.hasCustomCellRender ? se.renderCell(pe) : F(pe);
          } else {
            const pe = e;
            if (se.valueGetter) {
              const ke = se.valueGetter(pe?._baseRecord ?? pe, t);
              H = ke != null ? String(ke) : "";
            } else if (pe?.cells instanceof Map) {
              const ke = pe.cells.get(i.key);
              H = ke?.value !== void 0 ? String(ke.value) : "";
            } else pe?.[i.key] !== void 0 && (H = String(pe[i.key]));
            if (i.isNumber)
              H = oi(H);
            else if (i.isTime) {
              const Ct = String(H || "").match(/(\d{1,2}):(\d{2})/);
              Ct && (H = `${Ct[1].padStart(2, "0")}:${Ct[2]}`);
            } else i.isDateLike && (H = $l(H, !!se.showTime));
          }
          if (!he && ye && i.key === ye) {
            const pe = e, ke = typeof pe?._treeDepth == "number" ? pe._treeDepth : 0, Ct = !!pe?._treeHasChildren, Qt = !!pe?._treeExpanded, cr = pe?._treeKey ?? f ?? pe?.id ?? t, zt = Math.max(0, ke * (De ?? 20));
            H = /* @__PURE__ */ ut("div", { className: "flex items-center min-w-0 w-full h-full", children: [
              zt > 0 && /* @__PURE__ */ T("span", { className: "shrink-0", style: { width: `${zt}px` }, "aria-hidden": "true" }),
              Ct ? /* @__PURE__ */ T(
                qr,
                {
                  variant: "ghost",
                  size: "icon-sm",
                  onClick: (dn) => {
                    dn.stopPropagation(), Pe?.(cr, e);
                  },
                  onDoubleClick: (dn) => dn.stopPropagation(),
                  onMouseDown: (dn) => dn.stopPropagation(),
                  "aria-expanded": Qt,
                  "aria-label": Qt ? "Thu gọn nhánh" : "Mở rộng nhánh",
                  className: "mr-1",
                  children: /* @__PURE__ */ T(Ut, { fallback: null, children: /* @__PURE__ */ T(zi, { expanded: Qt }) })
                }
              ) : /* @__PURE__ */ T("span", { className: "w-7 h-7 mr-1 shrink-0 inline-block", "aria-hidden": "true" }),
              /* @__PURE__ */ T("div", { className: "min-w-0 flex-1 truncate", children: H })
            ] });
          }
          if (!he && i.cellRole !== "expand" && We && i.key === We) {
            const pe = f ?? e?.id ?? t;
            H = /* @__PURE__ */ ut("div", { className: "flex items-center min-w-0 w-full h-full", children: [
              Ie !== !1 ? /* @__PURE__ */ T(
                qr,
                {
                  variant: "ghost",
                  size: "icon-sm",
                  onClick: (ke) => {
                    ke.stopPropagation(), Le?.(pe, e);
                  },
                  onDoubleClick: (ke) => ke.stopPropagation(),
                  onMouseDown: (ke) => ke.stopPropagation(),
                  "aria-expanded": !!xe,
                  "aria-label": xe ? "Đóng chi tiết" : "Mở chi tiết",
                  className: "mr-1",
                  children: /* @__PURE__ */ T(Ut, { fallback: null, children: /* @__PURE__ */ T(zi, { expanded: !!xe }) })
                }
              ) : /* @__PURE__ */ T("span", { className: "w-7 h-7 mr-1 shrink-0 inline-block", "aria-hidden": "true" }),
              /* @__PURE__ */ T("div", { className: "min-w-0 flex-1 truncate", children: H })
            ] });
          }
          let re = he ? i.classNameEditing : O ? i.classNameSelected : R ? i.classNameEven : i.classNameOdd;
          if (z?.kind === "anchor") {
            const pe = i.stickyStyle.position === "sticky", ke = B[A + z.colSpan - 1], Ct = i.stickyStyle.right !== void 0 && ke?.stickyStyle.right !== void 0 ? ke.stickyStyle.right : i.stickyStyle.right, Qt = z.hasRightPinnedDivider ? " border-r-2 border-r-[var(--agv-border)]" : "";
            if (z.rowSpan > 1) {
              const zt = z.heightPx ?? Math.max(b, z.rowSpan * b), dn = {
                width: `${z.widthPx}px`,
                minWidth: `${z.widthPx}px`,
                ...te ? { minHeight: `${b}px` } : { height: `${b}px` },
                position: pe ? "sticky" : "relative",
                ...pe && i.stickyStyle.left !== void 0 ? { left: i.stickyStyle.left } : {},
                ...pe && Ct !== void 0 ? { right: Ct } : {},
                zIndex: pe ? 21 : 2,
                overflow: "visible",
                backgroundColor: "transparent",
                border: "none",
                pointerEvents: pt ? "auto" : void 0
              }, ur = {
                position: "absolute",
                top: 0,
                left: 0,
                width: `${z.widthPx}px`,
                minWidth: `${z.widthPx}px`,
                height: `${zt}px`,
                minHeight: `${zt}px`,
                maxHeight: `${zt}px`,
                lineHeight: "normal",
                pointerEvents: "auto"
              };
              return /* @__PURE__ */ T(
                "div",
                {
                  "data-col-key": i.key,
                  "data-cell-role": i.isEmptyCol ? void 0 : i.cellRole,
                  "data-row-span": z.rowSpan,
                  "data-col-span": z.colSpan > 1 ? z.colSpan : void 0,
                  style: dn,
                  className: "shrink-0 box-border",
                  children: /* @__PURE__ */ T(
                    "div",
                    {
                      "data-span-anchor-inner": "true",
                      style: ur,
                      className: `${re}${Qt}`,
                      children: H
                    }
                  )
                },
                i.key
              );
            }
            const cr = {
              ...i.stickyStyle,
              ...Ct !== void 0 ? { right: Ct } : {},
              width: `${z.widthPx}px`,
              minWidth: `${z.widthPx}px`,
              ...pt ? { pointerEvents: "auto" } : {}
            };
            return /* @__PURE__ */ T(
              "div",
              {
                "data-col-key": i.key,
                "data-cell-role": i.isEmptyCol ? void 0 : i.cellRole,
                "data-col-span": z.colSpan,
                style: cr,
                className: `${re}${Qt}`,
                children: H
              },
              i.key
            );
          }
          const Xe = pt ? { ...i.stickyStyle, pointerEvents: "auto" } : i.stickyStyle;
          return /* @__PURE__ */ T(
            "div",
            {
              "data-col-key": i.key,
              "data-cell-role": i.isEmptyCol ? void 0 : i.cellRole,
              style: Xe,
              className: re,
              children: H
            },
            i.key
          );
        })
      }
    );
  },
  (e, t) => {
    const f = e.editingCell?.rowIndex === e.rowIndex, s = t.editingCell?.rowIndex === t.rowIndex;
    return (f || s) && (e.editingCell?.colKey !== t.editingCell?.colKey || e.editingCell?.rowIndex !== t.editingCell?.rowIndex) || e.editMode !== t.editMode || e.delegatedEvents !== t.delegatedEvents || e.row !== t.row || e.rowIndex !== t.rowIndex || e.isSelected !== t.isSelected || e.isChecked !== t.isChecked || e.renderCell !== t.renderCell || e.onGroupContextMenu !== t.onGroupContextMenu || e.rowSpanPlan !== t.rowSpanPlan || e.treeColumnKey !== t.treeColumnKey || e.treeIndentSize !== t.treeIndentSize || e.onToggleTreeExpand !== t.onToggleTreeExpand || e.detailExpandColKey !== t.detailExpandColKey || e.isDetailExpanded !== t.isDetailExpanded || e.canExpandDetail !== t.canExpandDetail || e.onToggleRowDetail !== t.onToggleRowDetail || e.renderDetailRow !== t.renderDetailRow ? !1 : e.layoutSnapshot || t.layoutSnapshot ? e.layoutSnapshot !== t.layoutSnapshot ? !1 : t.delegatedEvents ? !0 : e.onStartEditCell === t.onStartEditCell && e.onCellContextMenu === t.onCellContextMenu : e.rowHeight === t.rowHeight && e.surfaceTheme === t.surfaceTheme && e.colRenderMetas === t.colRenderMetas && e.totalRowWidth === t.totalRowWidth && e.colWidths === t.colWidths && e.columns === t.columns && e.columnPins === t.columnPins && e.leftOffsets === t.leftOffsets && e.rightOffsets === t.rightOffsets && e.lastEffectiveLeftColKey === t.lastEffectiveLeftColKey && e.firstEffectiveRightColKey === t.firstEffectiveRightColKey && e.centerDockStatus === t.centerDockStatus && e.centerLeftOffsets === t.centerLeftOffsets && e.centerRightOffsets === t.centerRightOffsets && e.onStartEditCell === t.onStartEditCell && e.emptyColKeys === t.emptyColKeys && e.onCellContextMenu === t.onCellContextMenu;
  }
), Za = vn(
  () => import("./ResponsiveChunkRow-CAIAB6FJ.js")
), es = ({
  row: e,
  rowIndex: t,
  rowKey: f,
  rowTop: s,
  rowHeight: g,
  slotHeight: m,
  dynamicRowHeight: x,
  columns: N,
  colWidths: w,
  layoutSnapshot: C,
  totalGridWidth: b,
  isSelected: y,
  isChecked: K,
  isCardExpanded: J,
  showRowNumber: ee,
  showSelectionCol: q,
  onToggleExpandPhoneCard: Q,
  onSelectRow: V,
  onRowDetail: E,
  onToggleCheck: M,
  onCellContextMenu: Z,
  onGroupContextMenu: u,
  antiGhostMode: G = !0,
  surfaceTheme: X,
  columnPins: F,
  leftOffsets: Y,
  rightOffsets: fe,
  lastEffectiveLeftColKey: Ce,
  firstEffectiveRightColKey: ie,
  centerDockStatus: me,
  centerLeftOffsets: h,
  centerRightOffsets: ue,
  renderCell: j,
  editMode: Ae,
  rowEditingCell: Me,
  onStartEditCell: ye,
  onEndEditCell: De,
  onCellChange: Pe,
  getColumnDateBounds: We,
  emptyColKeys: xe,
  activeMode: Ie = "pc",
  tabletTrackMinWidth: Le,
  compiledTabletGroups: Fe,
  compiledPhoneCard: R,
  delegatedEvents: O = !1,
  observeRowSlot: D,
  unobserveRowSlot: _,
  rowSpanPlan: L,
  treeColumnKey: B,
  treeIndentSize: k,
  onToggleTreeExpand: te,
  detailExpandColKey: de,
  isDetailExpanded: ae,
  canExpandDetail: we,
  onToggleRowDetail: Te,
  renderDetailRow: ve
}) => {
  const Ue = ne(null), Qe = Ie === "tablet" || Ie === "phone", pt = xo(), S = !!e?._isDetailRow, i = !!(S && typeof e?._detailFixedHeight == "number" && Number.isFinite(e._detailFixedHeight)), A = !!(x || S && !i), z = !!(L?.hasVerticalSpan || L?.hasCoveredFromAbove), se = !!L?.hasCoveredFromAbove;
  return Rr(() => {
    const he = Ue.current;
    !he || !D || D(he, f, t);
  }, [D, f, t, e, w, C, x]), Rr(() => {
    const he = Ue.current;
    if (!(!he || !_))
      return () => {
        _(he);
      };
  }, [_]), /* @__PURE__ */ T(
    "div",
    {
      ref: Ue,
      "data-agv-fullwidth": Qe ? void 0 : "true",
      "data-row-slot-idx": t,
      style: {
        position: "absolute",
        top: z ? `${Math.round(s)}px` : 0,
        left: 0,
        width: Qe ? "100%" : `var(--agv-total-grid-w, ${b}px)`,
        minWidth: Qe ? Le > 0 ? `${Le}px` : "100%" : `var(--agv-total-grid-w, ${b}px)`,
        ...A ? { minHeight: `${g}px` } : { height: `${m}px` },
        ...z ? {} : {
          transform: `translate3d(0px, ${Math.round(s)}px, 0px)`,
          willChange: G ? "transform" : void 0,
          backfaceVisibility: G ? "hidden" : void 0
        },
        ...se ? { pointerEvents: "none" } : {},
        contain: z ? "style" : G ? A ? "layout style" : Qe ? "layout paint" : "strict" : void 0
      },
      className: `agv-chunk-block agv-row-slot ${se ? "bg-transparent" : pt.chunkBg}`,
      children: Qe ? /* @__PURE__ */ T(Ut, { fallback: null, children: /* @__PURE__ */ T(
        Za,
        {
          activeMode: Ie,
          row: e,
          rowIndex: t,
          rowKey: f,
          columns: N,
          compiledTabletGroups: Fe,
          compiledPhoneCard: R,
          rowHeight: g,
          isSelected: y,
          isChecked: K,
          isExpanded: J,
          showRowNumber: ee,
          showSelectionCol: q,
          onToggleExpand: Q,
          onSelectRow: V,
          onRowDetail: E,
          onToggleCheck: M,
          onCellContextMenu: Z,
          surfaceTheme: X,
          renderCell: j,
          allowTextSelection: !Z
        }
      ) }) : /* @__PURE__ */ T(
        ji,
        {
          rowKey: f,
          row: e,
          rowIndex: t,
          columns: N,
          colWidths: w,
          colRenderMetas: C.colRenderMetas,
          layoutSnapshot: C,
          delegatedEvents: O,
          dynamicRowHeight: x,
          totalRowWidth: b,
          rowHeight: g,
          isSelected: y,
          isChecked: K,
          onSelectRow: V,
          onToggleCheck: M,
          surfaceTheme: X,
          columnPins: F,
          leftOffsets: Y,
          rightOffsets: fe,
          lastEffectiveLeftColKey: Ce,
          firstEffectiveRightColKey: ie,
          centerDockStatus: me,
          centerLeftOffsets: h,
          centerRightOffsets: ue,
          renderCell: j,
          onCellContextMenu: Z,
          onGroupContextMenu: u,
          editMode: Ae,
          editingCell: Me,
          onStartEditCell: ye,
          onEndEditCell: De,
          onCellChange: Pe,
          getColumnDateBounds: We,
          emptyColKeys: xe,
          rowSpanPlan: L,
          treeColumnKey: B,
          treeIndentSize: k,
          onToggleTreeExpand: te,
          detailExpandColKey: de,
          isDetailExpanded: ae,
          canExpandDetail: we,
          onToggleRowDetail: Te,
          renderDetailRow: ve
        }
      )
    }
  );
}, ts = Il(
  es,
  (e, t) => e.row === t.row && e.rowIndex === t.rowIndex && e.rowKey === t.rowKey && e.rowTop === t.rowTop && e.rowHeight === t.rowHeight && e.slotHeight === t.slotHeight && e.dynamicRowHeight === t.dynamicRowHeight && e.layoutSnapshot === t.layoutSnapshot && e.totalGridWidth === t.totalGridWidth && e.isSelected === t.isSelected && e.isChecked === t.isChecked && e.isCardExpanded === t.isCardExpanded && e.showRowNumber === t.showRowNumber && e.showSelectionCol === t.showSelectionCol && e.surfaceTheme === t.surfaceTheme && e.activeMode === t.activeMode && e.tabletTrackMinWidth === t.tabletTrackMinWidth && e.compiledTabletGroups === t.compiledTabletGroups && e.compiledPhoneCard === t.compiledPhoneCard && e.delegatedEvents === t.delegatedEvents && e.editMode === t.editMode && e.rowEditingCell?.colKey === t.rowEditingCell?.colKey && e.renderCell === t.renderCell && e.onSelectRow === t.onSelectRow && e.onRowDetail === t.onRowDetail && e.onToggleCheck === t.onToggleCheck && e.onToggleExpandPhoneCard === t.onToggleExpandPhoneCard && e.onCellContextMenu === t.onCellContextMenu && e.onGroupContextMenu === t.onGroupContextMenu && e.observeRowSlot === t.observeRowSlot && e.unobserveRowSlot === t.unobserveRowSlot && e.rowSpanPlan === t.rowSpanPlan && e.treeColumnKey === t.treeColumnKey && e.treeIndentSize === t.treeIndentSize && e.onToggleTreeExpand === t.onToggleTreeExpand && e.detailExpandColKey === t.detailExpandColKey && e.isDetailExpanded === t.isDetailExpanded && e.canExpandDetail === t.canExpandDetail && e.onToggleRowDetail === t.onToggleRowDetail && e.renderDetailRow === t.renderDetailRow
);
function sr(e, t) {
  const f = Array.isArray(e) ? e : t?.key ? [t] : [], s = /* @__PURE__ */ new Set(), g = [];
  for (const m of f) {
    if (!m || typeof m.key != "string") continue;
    const x = m.key.trim();
    !x || s.has(x) || (s.add(x), g.push({
      key: x,
      direction: m.direction === bt.DESC ? bt.DESC : bt.ASC,
      ...m.sortByMonth !== void 0 ? { sortByMonth: !!m.sortByMonth } : {}
    }));
  }
  return g;
}
function ns(e, t, f) {
  const s = sr(e);
  if (!!f?.multi && f?.enableMultiSort !== !1) {
    const m = s.findIndex((x) => x.key === t);
    return m < 0 ? [...s, { key: t, direction: bt.ASC }] : s[m].direction === bt.ASC ? s.map(
      (x, N) => N === m ? { ...x, direction: bt.DESC } : x
    ) : s.filter((x, N) => N !== m);
  }
  return s.length === 1 && s[0].key === t ? s[0].direction === bt.ASC ? [{ key: t, direction: bt.DESC }] : [] : s.length > 1 && s[0].key === t && s[0].direction === bt.ASC ? [{ key: t, direction: bt.DESC }] : [{ key: t, direction: bt.ASC }];
}
function Us(e, t, f) {
  if (t === f || t < 0 || f < 0 || t >= e.length || f >= e.length)
    return e;
  const s = [...e], [g] = s.splice(t, 1);
  return s.splice(f, 0, g), s;
}
function Sl({
  baseIndices: e,
  rules: t,
  colMap: f,
  getRowVal: s,
  rows: g,
  rowKeys: m,
  getRowKeyAt: x,
  checkedRowKeys: N,
  formulaMode: w
}) {
  const C = sr(t);
  if (C.length === 0 || e.length <= 1)
    return e;
  const b = new Intl.Collator("vi", { sensitivity: "base", numeric: !0 }), y = (Q, V) => {
    const E = C[Q], M = e[V];
    if (E.key === "col_stt") return M + 1;
    if (E.key === "col_chk") {
      if (N.size === 0) return 0;
      const Y = x ? x(M) : m[M];
      return N.has(Y) ? 1 : 0;
    }
    const Z = f[E.key];
    if (E.sortByMonth && (w === Yr.MIN || w === Yr.MAX)) {
      const Y = g[M], fe = Y?._baseRecord ?? Y;
      if (Z?.monthIndexGetter)
        return Z.monthIndexGetter(fe, w);
      let Ce = 0, ie = w === Yr.MIN ? 1 / 0 : -1 / 0;
      for (let me = 1; me <= 12; me++) {
        const h = Number(fe?.[`col_m${me}`]) || 0;
        (w === Yr.MIN && h < ie || w === Yr.MAX && h > ie) && (ie = h, Ce = me - 1);
      }
      return Ce;
    }
    const u = Z?.dataType || ce.TEXT, G = s(M, E.key);
    if (u === ce.NUMBER) {
      const Y = Number(G);
      return Number.isFinite(Y) ? Y : -1 / 0;
    }
    if (u === ce.DATE) {
      const Y = G ? Date.parse(String(G)) : NaN;
      return Number.isFinite(Y) ? Y : -1 / 0;
    }
    if (u === ce.TIME) {
      const Y = /^(\d{1,2}):?(\d{0,2})$/.exec(String(G ?? "").trim());
      if (!Y) return -1 / 0;
      const fe = parseInt(Y[1], 10) * 60 + (Y[2] ? parseInt(Y[2], 10) : 0);
      return Number.isFinite(fe) ? fe : -1 / 0;
    }
    const X = g[M];
    let F = G;
    return F === void 0 && X && (F = X.cells instanceof Map ? X.cells.get(E.key)?.value : X[E.key]), String(F ?? "").toLowerCase();
  }, K = e.map((Q, V) => y(0, V)), J = C.map(
    (Q, V) => V === 0 ? K : new Array(e.length)
  ), ee = (Q, V) => {
    const E = J[Q];
    let M = E[V];
    return M === void 0 && (M = y(Q, V), E[V] = M), M;
  }, q = Array.from({ length: e.length }, (Q, V) => V);
  return q.sort((Q, V) => {
    for (let E = 0; E < C.length; E++) {
      const M = ee(E, Q), Z = ee(E, V), u = C[E].direction === bt.ASC;
      let G = 0;
      if (typeof M == "number" && typeof Z == "number" ? M !== Z && (G = M < Z ? -1 : 1) : G = b.compare(String(M), String(Z)), G !== 0)
        return u ? G : -G;
    }
    return Q - V;
  }), q.map((Q) => e[Q]);
}
const rs = /\d\s*(k|m|tr|b|ty)\b/i;
function os(e, t, f = ce.TEXT, s) {
  if (s?.mode === lr.MULTI || e === et.BETWEEN) return !0;
  if (f === ce.DATE || f === ce.TIME)
    return typeof t == "string" && t.trim().length > 0 && !Xr(e);
  if (f === ce.NUMBER && typeof t == "string") {
    const g = t.trim();
    if (g.includes("..") || g.includes(" - ") || g.includes("/") || g.includes("~") || rs.test(g))
      return !0;
  }
  return !1;
}
function Ol(e, t, f, s = ce.TEXT, g) {
  if (!!(g && (Array.isArray(g.selectedValues) && g.selectedValues.length > 0 || g.includeBlanks))) {
    const { selectedValues: b = [], includeBlanks: y } = g;
    if (e == null || typeof e == "string" && e.trim() === "") {
      if (!y) return !1;
    } else if (b.length > 0) {
      const J = String(e).trim();
      if (!b.some((q) => {
        const Q = String(q).trim();
        return Q === J ? !0 : s === ce.NUMBER ? Q.replace(/,/g, "") === J.replace(/,/g, "") : !1;
      })) return !1;
    } else if (!y)
      return !1;
  }
  const x = Xr(t), N = typeof f == "string" ? f.trim() : "";
  if (!x && !N) return !0;
  if (t === et.IS_EMPTY)
    return e == null || String(e).trim() === "";
  if (t === et.IS_NOT_EMPTY)
    return e != null && String(e).trim() !== "";
  if (t === et.IS_POSITIVE) {
    const b = Jo(e);
    return !isNaN(b) && b > 0;
  }
  if (t === et.IS_NEGATIVE) {
    const b = Jo(e);
    return !isNaN(b) && b < 0;
  }
  if (s === ce.NUMBER) {
    const b = Jo(e), y = Jo(N);
    if (!isNaN(b) && !isNaN(y))
      switch (t) {
        case et.EQUALS:
          return Math.abs(b - y) < 1e-3;
        case et.NOT_EQUALS:
          return Math.abs(b - y) >= 1e-3;
        case et.GREATER_THAN:
          return b > y;
        case et.GREATER_EQUALS:
          return b >= y;
        case et.LESS_THAN:
          return b < y;
        case et.LESS_EQUALS:
          return b <= y;
        case et.CONTAINS: {
          const K = String(e ?? ""), J = oi(e);
          return K.includes(N) || J.includes(N);
        }
      }
  }
  const w = String(e ?? "").toLowerCase(), C = N.toLowerCase();
  switch (t) {
    case et.CONTAINS:
      return w.includes(C);
    case et.NOT_CONTAINS:
      return !w.includes(C);
    case et.STARTS_WITH:
      return w.startsWith(C);
    case et.ENDS_WITH:
      return w.endsWith(C);
    case et.EQUALS:
      return w === C;
    case et.NOT_EQUALS:
      return w !== C;
    case et.GREATER_THAN:
      return w > C;
    case et.GREATER_EQUALS:
      return w >= C;
    case et.LESS_THAN:
      return w < C;
    case et.LESS_EQUALS:
      return w <= C;
    default:
      return w.includes(C);
  }
}
function Wl(e) {
  if (!e || !e.field) return !1;
  if (Array.isArray(e.multiValues) && e.multiValues.length > 0 || Array.isArray(e.multiRanges) && e.multiRanges.length > 0) return !0;
  const t = e.operator;
  return Xr(t) ? !0 : Ra(t) ? e.value !== void 0 && e.value !== "" && e.valueTo !== void 0 && e.valueTo !== "" : e.value !== void 0 && e.value !== null && String(e.value).trim() !== "";
}
function Co(e) {
  return e ? "combinator" in e ? !Array.isArray(e.rules) || e.rules.length === 0 ? !1 : e.rules.some((t) => Co(t)) : Wl(e) : !1;
}
function Vl(e) {
  return e ? "combinator" in e ? Array.isArray(e.rules) ? e.rules.reduce((t, f) => t + Vl(f), 0) : 0 : Wl(e) ? 1 : 0 : 0;
}
function is({
  enabled: e = !0,
  layoutMode: t = jr.AUTO,
  containerRef: f,
  debounceMs: s = 120,
  hysteresisBuffer: g = 16
}) {
  const m = ne(
    e && typeof window < "u" ? window.innerWidth : 1200
  ), [x, N] = be(() => {
    if (!e) return "pc";
    const K = typeof window < "u" ? window.innerWidth : 1200;
    return K < 768 ? "phone" : K < 1024 ? "tablet" : "pc";
  }), w = ne(x);
  w.current = x;
  const C = ne(!0), b = ne(null);
  if (Be(() => () => {
    b.current && clearTimeout(b.current);
  }, []), Be(() => {
    if (!e) return;
    let K = !1, J;
    return import("./responsiveLayoutEngine-BxTPPoFk.js").then(({ attachResponsiveLayoutObserver: ee }) => {
      K || (J = ee({
        containerEl: f.current,
        layoutMode: t,
        debounceMs: s,
        hysteresisBuffer: g,
        currentModeRef: w,
        isFirstMeasurementRef: C,
        debounceTimerRef: b,
        containerWidthRef: m,
        setAutoActiveMode: N
      }));
    }), () => {
      K = !0, J?.();
    };
  }, [e, f, t, s, g]), !e)
    return { activeMode: "pc", containerWidthRef: m };
  let y = x;
  return t === jr.PC ? y = "pc" : t === jr.TABLET ? y = "tablet" : t === jr.PHONE && (y = "phone"), { activeMode: y, containerWidthRef: m };
}
function Qs(e, t, f) {
  return e.labelGetter ? e.labelGetter(t?._baseRecord ?? t, f) : e.label;
}
function ls(e, t, f) {
  return !e || e.length === 0 ? 0 : 24 + (t || f ? 48 : 0) + e.reduce((s, g) => s + (g.width ?? g.minWidth), 0);
}
function as(e) {
  return !!(!e || e.dataType === ce.SYSTEM || e.isRowNumber || e.isSelection || e.key === "col_stt" || e.key === "col_chk");
}
function Ul(e = []) {
  return e.filter((t) => !as(t));
}
function ss(e, t, f = 0) {
  return t.valueGetter ? t.valueGetter(e?._baseRecord ?? e, f) : Ui(e, t.key);
}
function cs(e, t) {
  return t == null || t === "" ? "—" : e.dataType === ce.NUMBER ? oi(t) : String(t);
}
function Ys(e) {
  const { row: t, rowIndex: f, col: s, isSelected: g, isChecked: m, renderCell: x } = e;
  if (s.renderCell) {
    const w = s.renderCell({
      column: s,
      row: t,
      rowIndex: f,
      isSelected: g,
      isChecked: m,
      isResponsive: !0
    });
    if (w != null)
      return w;
  }
  if (x) {
    const w = x({
      column: s,
      row: t,
      rowIndex: f,
      isSelected: g,
      isChecked: m,
      isResponsive: !0
    });
    if (w != null)
      return w;
  }
  const N = ss(t, s, f);
  return cs(s, N);
}
function wl(e, t) {
  const f = [], s = t?.idPrefix ?? "auto_tb";
  let g = 0;
  for (; g < e.length; ) {
    const m = e[g], x = e[g + 1];
    if (m.col.isFormula && x?.col.isChart) {
      f.push({
        id: `${s}_${f.length}`,
        header: t?.headerOverride ?? (m.col.title || m.col.key),
        width: 175,
        minWidth: 160,
        align: m.col.align ?? ar.RIGHT,
        hasStandaloneChart: !1,
        lines: [
          {
            col: m.col,
            colIndex: m.colIndex,
            label: m.col.tabletLabelGetter ? void 0 : m.col.title || m.col.key,
            labelGetter: m.col.tabletLabelGetter,
            joinSeparator: " · ",
            isChart: !1,
            isPrimaryFirstLine: !1,
            emphasis: "normal"
          },
          {
            col: x.col,
            colIndex: x.colIndex,
            joinSeparator: " · ",
            isChart: !0,
            isPrimaryFirstLine: !1,
            emphasis: "normal"
          }
        ]
      }), g += 2;
      continue;
    }
    if (m.col.isChart) {
      f.push({
        id: `${s}_${f.length}`,
        header: t?.headerOverride ?? (m.col.title || m.col.key),
        width: 165,
        minWidth: 150,
        align: ar.CENTER,
        hasStandaloneChart: !0,
        lines: [
          {
            col: m.col,
            colIndex: m.colIndex,
            joinSeparator: " · ",
            isChart: !0,
            isPrimaryFirstLine: !1,
            emphasis: "normal"
          }
        ]
      }), g += 1;
      continue;
    }
    const N = [];
    for (; g < e.length && N.length < 3; ) {
      const y = e[g];
      if (y.col.isChart || y.col.isFormula && e[g + 1]?.col.isChart) break;
      N.push(y), g += 1;
    }
    const w = !!t?.markFirstPrimary && f.length === 0, C = g >= e.length, b = N.map((y, K) => {
      const J = w && K === 0, ee = N.length > 1 && !J && !(C && N.length <= 2 && K === 0);
      return {
        col: y.col,
        colIndex: y.colIndex,
        label: ee ? y.col.title || y.col.key : void 0,
        joinSeparator: " · ",
        isChart: !1,
        isPrimaryFirstLine: J,
        emphasis: J ? "strong" : "normal"
      };
    });
    f.push({
      id: `${s}_${f.length}`,
      header: t?.headerOverride ?? (N[0].col.title || N[0].col.key),
      width: C && N.length <= 2 && f.length > 0 ? 156 : void 0,
      minWidth: w ? 175 : 150,
      align: C && N.length <= 2 && f.length > 0 ? ar.RIGHT : ar.LEFT,
      hasStandaloneChart: !1,
      lines: b
    });
  }
  return f;
}
function us(e, t, f, s) {
  const g = Ul(e);
  if (g.length === 0) return [];
  const m = /* @__PURE__ */ new Map();
  g.forEach((w, C) => {
    m.set(w.key, { col: w, colIndex: C });
  });
  const x = (w) => {
    if (s?.has(w)) return;
    const C = m.get(w);
    return C || Ql(w);
  };
  if (t && t.length > 0) {
    const w = [];
    if (t.forEach((C, b) => {
      const y = [];
      let K = !1;
      const J = C.lines.slice(0, 3);
      for (const Q of J) {
        const V = Dn(Q, x, { defaultLabel: !1 });
        V && (y.length === 0 && (K = typeof Q == "object" && !Yl(Q) && !!Q.emphasis), y.push(V));
      }
      if (y.length === 0) return;
      w.length === 0 && !y[0].isChart && (y[0].isPrimaryFirstLine = !0, K || (y[0].emphasis = "strong"));
      const ee = y.some((Q) => Q.isChart), q = y.length === 1 && y[0].isChart;
      w.push({
        id: C.id || `tg_${b}`,
        header: C.header,
        width: C.width,
        minWidth: C.minWidth ?? (ee ? 150 : 140),
        align: C.align ?? (y.length === 1 && y[0].col.align ? y[0].col.align : ar.LEFT),
        hasStandaloneChart: q,
        lines: y
      });
    }), w.length > 0) return w;
  }
  if (f && f.length > 0) {
    const w = [];
    if (f.forEach((C, b) => {
      if (C.isStandalone) return;
      const y = C.keys.map((J) => m.get(J)).filter((J) => !!J);
      if (y.length === 0) return;
      const K = wl(y, {
        idPrefix: `band_${C.id || b}`,
        headerOverride: C.title || void 0,
        markFirstPrimary: w.length === 0
      });
      w.push(...K);
    }), w.length > 0) return w;
  }
  const N = g.map((w, C) => ({ col: w, colIndex: C }));
  return wl(N, {
    idPrefix: "auto_tb",
    markFirstPrimary: !0
  });
}
function Ql(e) {
  return {
    col: {
      key: e,
      title: e,
      defaultWidth: 120,
      dataType: ce.TEXT
    },
    colIndex: -1
  };
}
function Yl(e) {
  return Array.isArray(e);
}
function Dn(e, t, f) {
  let s, g, m, x, N = " · ", w;
  const C = (b) => {
    b.col.tabletLabelGetter ? m = b.col.tabletLabelGetter : g = b.col.title || b.col.key;
  };
  if (Yl(e)) {
    const b = e.map((y) => t(y)).filter((y) => !!y);
    if (b.length === 0) return;
    s = b[0], b.length > 1 && (x = b.slice(1));
  } else {
    const b = typeof e == "string" ? e : e.col;
    if (s = t(b), !s) return;
    if (typeof e == "string")
      f?.defaultLabel && C(s);
    else {
      if (e.label === !1 ? (g = void 0, m = void 0) : typeof e.label == "function" ? m = e.label : e.label === !0 || e.label === void 0 && f?.defaultLabel ? C(s) : typeof e.label == "string" && e.label.trim().length > 0 && (g = e.label), e.join && e.join.length > 0) {
        const y = e.join.map((K) => t(K)).filter((K) => !!K);
        y.length > 0 && (x = y);
      }
      e.joinSeparator && (N = e.joinSeparator), e.emphasis && (w = e.emphasis);
    }
  }
  return {
    col: s.col,
    colIndex: s.colIndex,
    label: g,
    labelGetter: m,
    joinCols: x,
    joinSeparator: N,
    isChart: !!s.col.isChart,
    isPrimaryFirstLine: !1,
    emphasis: w ?? f?.defaultEmphasis ?? "normal"
  };
}
function ds(e, t, f) {
  const s = Ul(e), g = [], m = /* @__PURE__ */ new Map();
  s.forEach((u, G) => {
    if (f?.has(u.key)) return;
    const X = { col: u, colIndex: G };
    g.push(X), m.set(u.key, X);
  });
  const x = t?.detailButtonLabel === !1 ? void 0 : t?.detailButtonLabel || "Xem chi tiết";
  if (g.length === 0)
    return {
      summary: [],
      infoRows: [],
      detailButtonLabel: x,
      hasExpandableDrawer: !1,
      extraHeight: 0
    };
  const N = (u) => {
    if (f?.has(u)) return;
    const G = m.get(u);
    return G || Ql(u);
  };
  let w;
  if (t?.chart !== !1) {
    let u, G;
    if (typeof t?.chart == "object" ? (u = m.get(t.chart.chart), u && (G = t.chart.formula ? m.get(t.chart.formula) : g.find((X) => X.col.isFormula))) : (u = g.find((X) => X.col.isChart), u && (G = g.find((X) => X.col.isFormula))), u) {
      const X = {
        col: u.col,
        colIndex: u.colIndex,
        joinSeparator: " · ",
        isChart: !0,
        isPrimaryFirstLine: !1,
        emphasis: "normal"
      }, F = G ? {
        col: G.col,
        colIndex: G.colIndex,
        label: G.col.tabletLabelGetter ? void 0 : G.col.title || G.col.key,
        labelGetter: G.col.tabletLabelGetter,
        joinSeparator: " · ",
        isChart: !1,
        isPrimaryFirstLine: !1,
        emphasis: "strong"
      } : void 0;
      w = { chartLine: X, formulaLine: F };
    }
  }
  const C = /* @__PURE__ */ new Set(), b = (u) => {
    u && (C.add(u.col.key), u.joinCols?.forEach((G) => C.add(G.col.key)));
  };
  b(w?.chartLine), b(w?.formulaLine);
  const y = g.filter((u) => !u.col.isChart && !u.col.isFormula);
  let K;
  t?.title !== void 0 ? K = Dn(t.title, N, {
    defaultLabel: !1,
    defaultEmphasis: "strong"
  }) : y.length >= 2 ? K = Dn([y[0].col.key, y[1].col.key], N, {
    defaultLabel: !1,
    defaultEmphasis: "strong"
  }) : y.length === 1 && (K = Dn(y[0].col.key, N, {
    defaultLabel: !1,
    defaultEmphasis: "strong"
  })), b(K);
  let J;
  if (t?.badge !== void 0)
    J = Dn(t.badge, N, { defaultLabel: !1 });
  else {
    const u = y.find(
      (G) => !C.has(G.col.key) && /status|trạng\s*thái/i.test(`${G.col.key} ${G.col.title || ""}`)
    );
    u && (J = Dn(u.col.key, N, { defaultLabel: !1 }));
  }
  b(J);
  let ee = [];
  t?.summary !== void 0 ? ee = t.summary.map((u) => Dn(u, N, { defaultLabel: !0 })).filter((u) => !!u) : ee = y.filter((u) => !C.has(u.col.key)).slice(0, 2).map((u) => Dn(u.col.key, N, { defaultLabel: !0 })).filter((u) => !!u), ee.forEach(b);
  const q = t?.details !== void 0 ? t.details.map((u) => Dn(u, N, { defaultLabel: !0 })).filter((u) => !!u) : y.filter((u) => !C.has(u.col.key)).map((u) => Dn(u.col.key, N, { defaultLabel: !0 })).filter((u) => !!u), Q = w ? x ? 3 : 4 : x ? 5 : 6, V = q.slice(0, Q), E = [];
  for (let u = 0; u < V.length; u += 2)
    E.push({
      left: V[u],
      right: V[u + 1]
    });
  x && (E.length === 0 ? (w || t) && E.push({ showDetailButton: !0 }) : E[E.length - 1].right ? E.push({ showDetailButton: !0 }) : E[E.length - 1].showDetailButton = !0);
  const M = !!w || E.length > 0;
  let Z = 0;
  if (M) {
    let u = 16;
    w && (u += 52, E.length > 0 && (u += 8)), E.length > 0 && (u += E.length * 28 + (E.length - 1) * 8), Z = u;
  }
  return {
    title: K,
    badge: J,
    summary: ee,
    chartBand: w,
    infoRows: E,
    detailButtonLabel: x,
    hasExpandableDrawer: M,
    extraHeight: Z
  };
}
function Ki(e, t) {
  return (f) => {
    const s = [];
    t && t[f] !== void 0 && s.push(t[f]);
    for (let g = 0; g < e.length; g++) {
      const m = e[g];
      m?._isGroupRow && m?.groupSums?.[f] !== void 0 && s.push(m.groupSums[f]);
    }
    return s;
  };
}
function fs({
  colMap: e,
  effectiveColumns: t,
  columnGroups: f,
  getRowItem: s,
  columnSums: g,
  totalRows: m,
  setColWidth: x,
  setMultipleColWidths: N
}) {
  const w = v(
    (y) => {
      const K = e[y];
      !K || K.resizable === !1 || K.dataType === ce.SYSTEM || K.isRowNumber || Rt(K) || import("./gridAutoFitUtils-0iLVTMuy.js").then(({ calcColAutoFitWidth: J, collectAutoFitSampleRows: ee }) => {
        const q = ee(m, s, 100), Q = Ki(q, g), V = J(
          K,
          q,
          400,
          65,
          Q(y),
          m
        );
        x(y, V);
      });
    },
    [e, s, g, x, m]
  ), C = v(() => {
    import("./gridAutoFitUtils-0iLVTMuy.js").then(({ calcColAutoFitWidth: y, collectAutoFitSampleRows: K }) => {
      const J = K(m, s, 100), ee = Ki(J, g), q = {};
      t.forEach((Q) => {
        Q.resizable === !1 || Q.dataType === ce.SYSTEM || Q.isRowNumber || Rt(Q) || (q[Q.key] = y(
          Q,
          J,
          400,
          65,
          ee(Q.key),
          m
        ));
      }), N(q);
    });
  }, [t, s, g, N, m]), b = v(
    (y) => {
      const K = f?.find((J) => J.id === y);
      K && import("./gridAutoFitUtils-0iLVTMuy.js").then(({ calcColAutoFitWidth: J, collectAutoFitSampleRows: ee }) => {
        const q = ee(m, s, 100), Q = Ki(q, g), V = {};
        K.keys.forEach((E) => {
          const M = e[E];
          M && M.resizable !== !1 && M.dataType !== ce.SYSTEM && !M.isRowNumber && !Rt(M) && (V[E] = J(
            M,
            q,
            400,
            65,
            Q(E),
            m
          ));
        }), N(V);
      });
    },
    [f, e, s, g, N, m]
  );
  return {
    handleAutoFitColumn: w,
    handleAutoFitAllColumns: C,
    handleAutoFitBandColumns: b
  };
}
function hs({
  controlledEditingCell: e,
  onStartEditCell: t,
  onEndEditCell: f,
  scrollContainerRef: s
}) {
  const [g, m] = be(null), x = e !== void 0 ? e : g, N = v(
    (b, y) => {
      t?.(b, y), m({ rowIndex: b, colKey: y });
    },
    [t]
  ), w = v(() => {
    f?.(), m(null);
  }, [f]), C = ne(null);
  return Be(() => {
    const b = s.current;
    b && (x ? C.current = {
      top: b.scrollTop,
      left: b.scrollLeft
    } : C.current && (b.scrollTop = C.current.top, b.scrollLeft = C.current.left, C.current = null));
  }, [x, s]), {
    activeEditingCell: x,
    handleStartEditCell: N,
    handleEndEditCell: w,
    lockedScrollPosRef: C
  };
}
function ps({
  scrollContainerRef: e,
  activeContextMenu: t,
  activeEditingCell: f,
  isAnyPopupActive: s,
  totalRows: g,
  selectedRowIndex: m,
  onSelectRow: x,
  onToggleCheck: N,
  getRowItem: w,
  viewportHeight: C,
  actualRowHeight: b,
  getRowTop: y,
  getRowHeight: K,
  pinnedRowsHeight: J,
  customHeaderHeight: ee,
  middleElements: q,
  showFilterRow: Q,
  pinnedRowsLength: V,
  stickyGroupRow: E,
  isWindowScroll: M = !1
}) {
  const Z = ne({
    activeContextMenu: t,
    activeEditingCell: f,
    isAnyPopupActive: s,
    totalRows: g,
    selectedRowIndex: m,
    onSelectRow: x,
    onToggleCheck: N,
    getRowItem: w,
    viewportHeight: C,
    actualRowHeight: b,
    getRowTop: y,
    getRowHeight: K,
    pinnedRowsHeight: J,
    customHeaderHeight: ee,
    middleElements: q,
    showFilterRow: Q,
    pinnedRowsLength: V,
    stickyGroupRow: E,
    isWindowScroll: M
  });
  Z.current = {
    activeContextMenu: t,
    activeEditingCell: f,
    isAnyPopupActive: s,
    totalRows: g,
    selectedRowIndex: m,
    onSelectRow: x,
    onToggleCheck: N,
    getRowItem: w,
    viewportHeight: C,
    actualRowHeight: b,
    getRowTop: y,
    getRowHeight: K,
    pinnedRowsHeight: J,
    customHeaderHeight: ee,
    middleElements: q,
    showFilterRow: Q,
    pinnedRowsLength: V,
    stickyGroupRow: E,
    isWindowScroll: M
  }, Be(() => {
    const u = (X, F, Y, fe) => {
      let Ce = Math.max(0, Math.min(Y - 1, X));
      for (; Ce >= 0 && Ce < Y; ) {
        const ie = fe(Ce);
        if (ie && !ie._isGroupRow && !ie._isDetailRow) return Ce;
        Ce += F;
      }
      return null;
    }, G = (X) => {
      if (X.defaultPrevented) return;
      const F = Z.current;
      if (F.activeContextMenu || F.activeEditingCell || F.isAnyPopupActive()) return;
      const Y = X.target;
      if (Y && (Y.tagName === "INPUT" || Y.tagName === "TEXTAREA" || Y.tagName === "SELECT" || Y.isContentEditable) || F.totalRows <= 0) return;
      const fe = typeof F.selectedRowIndex == "number" && F.selectedRowIndex >= 0 && F.selectedRowIndex < F.totalRows;
      if (X.key === "ArrowDown" || X.key === "ArrowUp" || X.key === "PageDown" || X.key === "PageUp") {
        if (!F.onSelectRow) return;
        X.preventDefault();
        const Ce = Math.max(
          1,
          Math.floor((F.viewportHeight || 400) / F.actualRowHeight) - 1
        );
        let ie = null;
        if (!fe)
          ie = u(0, 1, F.totalRows, F.getRowItem);
        else {
          const ue = F.selectedRowIndex, j = X.key === "ArrowUp" || X.key === "PageUp", Ae = X.key === "PageDown" || X.key === "PageUp" ? Ce : 1, Me = j ? Math.max(0, ue - Ae) : Math.min(F.totalRows - 1, ue + Ae);
          if (Me === ue || (ie = u(
            Me,
            j ? -1 : 1,
            F.totalRows,
            F.getRowItem
          ), ie === null || ie === ue)) return;
        }
        if (ie === null) return;
        const me = F.getRowItem(ie);
        if (!me || me._isGroupRow || me._isDetailRow) return;
        F.onSelectRow(ie, me);
        const h = e.current;
        if (h) {
          const ue = F.getRowTop ? F.getRowTop(ie) : ie * F.actualRowHeight, j = F.getRowHeight ? F.getRowHeight(ie) : F.actualRowHeight, Ae = ue + j, Me = F.pinnedRowsHeight ?? F.pinnedRowsLength * F.actualRowHeight, ye = (F.customHeaderHeight ?? (F.middleElements.some((De) => De.type === "group") ? 64 : 34)) + (F.showFilterRow ? 34 : 0) + Me + (F.stickyGroupRow ? F.actualRowHeight : 0);
          if (F.isWindowScroll && typeof window < "u") {
            const De = h.getBoundingClientRect(), Pe = De.top + ye + ue, We = De.top + ye + Ae, xe = Math.max(0, De.top) + ye, Ie = window.innerHeight || 600;
            Pe < xe ? window.scrollTo({
              top: Math.max(0, window.scrollY + (Pe - xe))
            }) : We > Ie && window.scrollTo({
              top: Math.max(0, window.scrollY + (We - Ie))
            });
          } else {
            const De = h.scrollTop, Pe = Math.max(
              j,
              h.clientHeight - ye
            );
            ue < De ? h.scrollTop = ue : Ae > De + Pe && (h.scrollTop = Math.max(0, Ae - Pe));
          }
        }
      } else if (X.key === " " && fe && F.onToggleCheck && !Y?.closest?.('button, a, [role="button"], [role="checkbox"]')) {
        const Ce = F.selectedRowIndex, ie = F.getRowItem(Ce);
        ie && !ie._isGroupRow && !ie._isDetailRow && (X.preventDefault(), F.onToggleCheck(Ce, ie, X));
      }
    };
    return window.addEventListener("keydown", G), () => window.removeEventListener("keydown", G);
  }, [e]);
}
const gs = {}, kl = [], Oi = {}, ms = {};
function ys({
  columns: e,
  columnGroups: t,
  totalRows: f,
  features: s,
  controlledWidths: g,
  defaultColWidths: m,
  onColWidthsChange: x,
  controlledPins: N,
  defaultColumnPins: w,
  onColumnPinsChange: C,
  controlledHiddenColKeys: b,
  defaultHiddenColKeys: y,
  onHiddenColKeysChange: K,
  controlledOnResetColumns: J,
  scrollContainerRef: ee
}) {
  const [q, Q] = be(() => {
    const S = {};
    return e.forEach((i) => {
      S[i.key] = m?.[i.key] ?? i.defaultWidth;
    }), S;
  }), V = g ?? q, E = W(() => Ma(f), [f]), M = W(() => {
    const S = {};
    return e.forEach((i) => {
      S[i.key] = i;
    }), S;
  }, [e]), Z = W(() => {
    const S = { ...V || {} };
    for (const i of e)
      (i.dataType === ce.SYSTEM || i.isRowNumber || Rt(i) || i.isDetailExpand) && (i.isDetailExpand ? S[i.key] = S[i.key] || i.defaultWidth || 36 : i.isRowNumber || i.title ? S[i.key] = S[i.key] || E || i.defaultWidth || 46 : S[i.key] = S[i.key] || i.defaultWidth || 32);
    return S;
  }, [V, E, e]), u = ne(Z);
  u.current = Z;
  const G = v(
    (S, i) => {
      const A = M[S];
      !A || A.resizable === !1 || A.dataType === ce.SYSTEM || A.isRowNumber || Rt(A) || A.isDetailExpand || (x ? x({ ...u.current, [S]: i }) : Q((z) => ({ ...z, [S]: i })));
    },
    [x, M]
  ), X = v(
    (S) => {
      if (!S || Object.keys(S).length === 0) return;
      const i = {};
      for (const [A, z] of Object.entries(S)) {
        const se = M[A];
        se && se.resizable !== !1 && se.dataType !== ce.SYSTEM && !se.isRowNumber && !Rt(se) && !se.isDetailExpand && (i[A] = z);
      }
      Object.keys(i).length !== 0 && (x ? x({ ...u.current, ...i }) : Q((A) => ({ ...A, ...i })));
    },
    [x, M]
  ), [F, Y] = be(
    () => w ?? {}
  ), fe = W(() => {
    if (!s.enableColumnPinning && !s.enableCenterDock)
      return gs;
    const S = N ?? F;
    if (s.enableColumnPinning && s.enableCenterDock)
      return S;
    const i = {};
    for (const [A, z] of Object.entries(S))
      (s.enableColumnPinning && (z === Se.LEFT || z === Se.RIGHT) || s.enableCenterDock && z === Se.CENTER) && (i[A] = z);
    return i;
  }, [s.enableColumnPinning, s.enableCenterDock, N, F]), Ce = v(
    (S, i) => {
      if (i === Se.CENTER && !s.enableCenterDock || (i === Se.LEFT || i === Se.RIGHT) && !s.enableColumnPinning || i === Se.NONE && !s.enableColumnPinning && !s.enableCenterDock)
        return;
      const z = (fe[S] || Se.NONE) === i ? Se.NONE : i, se = { ...fe, [S]: z };
      C ? C(se) : Y(se);
    },
    [s.enableColumnPinning, s.enableCenterDock, fe, C]
  ), [ie, me] = be(
    () => y ?? /* @__PURE__ */ new Set()
  ), h = b ?? ie, ue = v(
    (S) => {
      const i = typeof S == "function" ? S(h) : S;
      K ? K(i) : me(i);
    },
    [h, K]
  ), j = W(
    () => e.filter((S) => !h.has(S.key)),
    [e, h]
  ), Ae = W(() => {
    const S = {};
    return e.forEach((i) => {
      S[i.key] = i.dataType || ce.TEXT;
    }), S;
  }, [e]), Me = W(() => {
    if (!t || t.length === 0) return t;
    const S = /* @__PURE__ */ new Map();
    return e.forEach((A, z) => S.set(A.key, z)), [...t.map((A) => {
      if (!A.keys || A.keys.length <= 1) return A;
      const z = [...A.keys].sort(
        (se, he) => (S.get(se) ?? 999999) - (S.get(he) ?? 999999)
      );
      return { ...A, keys: z };
    })].sort((A, z) => {
      const se = Math.min(...A.keys.map((H) => S.get(H) ?? 999999)), he = Math.min(...z.keys.map((H) => S.get(H) ?? 999999));
      return se - he;
    });
  }, [t, e]), ye = W(() => {
    const S = (i) => {
      const A = M[i];
      return !(!s.enableRowNumber && (A?.isRowNumber || A?.dataType === ce.SYSTEM && A?.title) || !s.enableSelection && Rt(A));
    };
    if (Me && Me.length > 0) {
      const i = [];
      return Me.forEach((A) => {
        A.keys.forEach((z) => {
          M[z] && !h.has(z) && S(z) && i.push(z);
        });
      }), i;
    }
    return j.filter((i) => S(i.key)).map((i) => i.key);
  }, [
    Me,
    M,
    j,
    h,
    s.enableRowNumber,
    s.enableSelection
  ]), De = W(
    () => e.filter((S) => !h.has(S.key)).map((S) => S.key),
    [e, h]
  ), Pe = v(
    (S) => {
      const i = /* @__PURE__ */ new Set();
      e.forEach((A) => {
        S.includes(A.key) || i.add(A.key);
      }), ue(i);
    },
    [e, ue]
  ), We = v(() => {
    if (J) {
      J();
      return;
    }
    ue(/* @__PURE__ */ new Set()), w && (s.enableColumnPinning || s.enableCenterDock) && (C ? C(w) : Y(w));
  }, [
    J,
    ue,
    w,
    s.enableColumnPinning,
    s.enableCenterDock,
    C
  ]), { leftColumns: xe, middleColumns: Ie, rightColumns: Le, flatColumns: Fe } = W(() => {
    const S = [], i = [], A = [];
    return ye.forEach((z) => {
      const se = fe[z] || Se.NONE, he = M[z];
      he && (se === Se.LEFT ? S.push(he) : se === Se.RIGHT ? i.push(he) : A.push(he));
    }), {
      leftColumns: S,
      middleColumns: A,
      rightColumns: i,
      flatColumns: [...S, ...A, ...i]
    };
  }, [ye, fe, M]), { leftOffsets: R, rightOffsets: O, totalLeftWidth: D, totalRightWidth: _ } = W(() => {
    const S = {};
    let i = 0;
    xe.forEach((se) => {
      S[se.key] = i, i += Z[se.key] || se.defaultWidth;
    });
    const A = {};
    let z = 0;
    for (let se = Le.length - 1; se >= 0; se--) {
      const he = Le[se];
      A[he.key] = z, z += Z[he.key] || he.defaultWidth;
    }
    return {
      leftOffsets: S,
      rightOffsets: A,
      totalLeftWidth: i,
      totalRightWidth: z
    };
  }, [xe, Le, Z]), L = W(() => {
    if (!s.enableCenterDock) return kl;
    const S = ye.filter((i) => fe[i] === Se.CENTER);
    return S.length > 0 ? S : kl;
  }, [s.enableCenterDock, ye, fe]), B = W(() => {
    if (L.length === 0) return ms;
    const S = {};
    let i = 0;
    return Fe.forEach((A) => {
      const z = Z[A.key] || A.defaultWidth;
      S[A.key] = { left: i, width: z }, i += z;
    }), S;
  }, [L.length, Fe, Z]), k = W(() => Fe.reduce((S, i) => S + (Z[i.key] || i.defaultWidth), 0), [Fe, Z]), [te, de] = be(Oi), ae = v(
    (S, i) => {
      if (L.length === 0) {
        de((he) => Object.keys(he).length === 0 ? he : Oi);
        return;
      }
      const A = {};
      let z = S + D, se = S + i - _;
      for (let he = 0; he < L.length; he++) {
        const H = L[he], re = B[H];
        re && (re.left < z ? (A[H] = vt.LEFT, z += re.width) : A[H] = vt.NORMAL);
      }
      for (let he = L.length - 1; he >= 0; he--) {
        const H = L[he];
        if (A[H] === vt.LEFT) continue;
        const re = B[H];
        re && re.left + re.width > se && (A[H] = vt.RIGHT, se -= re.width);
      }
      de((he) => {
        let H = Object.keys(he).length !== Object.keys(A).length;
        if (!H) {
          for (const re of L)
            if (he[re] !== A[re]) {
              H = !0;
              break;
            }
        }
        return H ? A : he;
      });
    },
    [L, D, _, B]
  );
  Be(() => {
    if (L.length === 0) {
      de((A) => Object.keys(A).length === 0 ? A : Oi);
      return;
    }
    const S = ee.current;
    if (!S) return;
    ae(S.scrollLeft, S.clientWidth);
    const i = new ResizeObserver(() => {
      ae(S.scrollLeft, S.clientWidth);
    });
    return i.observe(S), () => i.disconnect();
  }, [L.length, ae, ee]);
  const {
    centerLeftOffsets: we,
    centerRightOffsets: Te,
    lastEffectiveLeftColKey: ve,
    firstEffectiveRightColKey: Ue
  } = W(() => {
    const S = {}, i = {};
    let A = D, z = null;
    L.forEach((Xe) => {
      S[Xe] = A;
      const pe = Z[Xe] || 120;
      te[Xe] === vt.LEFT && (A += pe, z = Xe);
    });
    let se = _, he = null;
    for (let Xe = L.length - 1; Xe >= 0; Xe--) {
      const pe = L[Xe];
      i[pe] = se;
      const ke = Z[pe] || 120;
      te[pe] === vt.RIGHT && (se += ke, he = pe);
    }
    const H = z !== null ? z : xe.length > 0 ? xe[xe.length - 1].key : null, re = he !== null ? he : Le.length > 0 ? Le[0].key : null;
    return {
      centerLeftOffsets: S,
      centerRightOffsets: i,
      lastEffectiveLeftColKey: H,
      firstEffectiveRightColKey: re
    };
  }, [
    L,
    D,
    _,
    Z,
    te,
    xe,
    Le
  ]), Qe = W(() => {
    const S = [];
    return !Me || Me.length === 0 ? (Ie.forEach((i) => {
      S.push({
        type: "standalone",
        col: i,
        isCenterPinned: fe[i.key] === Se.CENTER
      });
    }), S) : (Me.forEach((i) => {
      if (i.isStandalone) {
        const A = i.keys[0], z = fe[A] || Se.NONE;
        if (ye.includes(A) && (z === Se.NONE || z === Se.CENTER)) {
          const se = M[A];
          se && S.push({
            type: "standalone",
            col: se,
            isCenterPinned: z === Se.CENTER
          });
        }
      } else {
        const A = i.keys.filter((he) => {
          if (h.has(he)) return !1;
          const H = fe[he] || Se.NONE;
          return H === Se.NONE || H === Se.CENTER;
        });
        let z = [], se = 0;
        A.forEach((he) => {
          const H = M[he];
          if (!H) return;
          const re = fe[he] || Se.NONE, Xe = re === Se.CENTER ? te[he] || vt.NORMAL : vt.NORMAL;
          re === Se.CENTER && (Xe === vt.LEFT || Xe === vt.RIGHT) ? (z.length > 0 && (S.push({
            type: "group",
            def: i,
            segmentKey: `${i.id}_seg_${se++}`,
            children: z
          }), z = []), S.push({ type: "standalone", col: H, isCenterPinned: !0 })) : z.push(H);
        }), z.length > 0 && S.push({
          type: "group",
          def: i,
          segmentKey: `${i.id}_seg_${se++}`,
          children: z
        });
      }
    }), S);
  }, [
    Me,
    Ie,
    fe,
    ye,
    M,
    te,
    h
  ]), pt = W(() => {
    const S = {};
    return Fe.forEach((i) => {
      const A = Z[i.key] || i.defaultWidth;
      S[`--agv-col-w-${i.key}`] = `${A}px`;
    }), S["--agv-total-grid-w"] = `${k}px`, xe.forEach((i) => {
      S[`--agv-left-offset-${i.key}`] = `${R[i.key]}px`;
    }), Le.forEach((i) => {
      S[`--agv-right-offset-${i.key}`] = `${O[i.key]}px`;
    }), L.forEach((i) => {
      S[`--agv-center-left-offset-${i}`] = `${we[i]}px`, S[`--agv-center-right-offset-${i}`] = `${Te[i]}px`;
    }), S;
  }, [
    Fe,
    Z,
    k,
    xe,
    R,
    Le,
    O,
    L,
    we,
    Te
  ]);
  return {
    colMap: M,
    colWidths: Z,
    setColWidth: G,
    setMultipleColWidths: X,
    columnPins: fe,
    setColumnPin: Ce,
    hiddenColKeys: h,
    setHiddenColKeys: ue,
    effectiveColumns: j,
    columnDataTypes: Ae,
    effectiveColumnGroups: Me,
    visibleColKeys: De,
    handleVisibleColKeysChange: Pe,
    handleResetColumns: We,
    leftColumns: xe,
    middleColumns: Ie,
    rightColumns: Le,
    flatColumns: Fe,
    leftOffsets: R,
    rightOffsets: O,
    centerPinnedColKeys: L,
    centerDockStatus: te,
    computeCenterDock: ae,
    centerLeftOffsets: we,
    centerRightOffsets: Te,
    lastEffectiveLeftColKey: ve,
    firstEffectiveRightColKey: Ue,
    totalGridWidth: k,
    middleElements: Qe,
    gridColVars: pt
  };
}
const vs = [], bs = /* @__PURE__ */ new Set();
function El(e, t, f) {
  if (t <= 0 || f <= 0) return 0;
  const s = e[t];
  if (f >= s) return t - 1;
  let g = 0, m = t - 1;
  for (; g <= m; ) {
    const x = g + m >>> 1, N = e[x], w = e[x + 1];
    if (f < N)
      m = x - 1;
    else if (f >= w)
      g = x + 1;
    else
      return x;
  }
  return Math.max(0, Math.min(t - 1, g));
}
function Tl(e, t) {
  if (e.length === 0) return 0;
  if (e.length <= 8) {
    let g = 0;
    for (let m = 0; m < e.length && e[m] < t; m++)
      g++;
    return g;
  }
  let f = 0, s = e.length;
  for (; f < s; ) {
    const g = f + s >>> 1;
    e[g] < t ? f = g + 1 : s = g;
  }
  return f;
}
function Cs({
  totalRows: e,
  baseRowHeight: t,
  dynamicRowHeight: f,
  hasDynamicDetailRows: s = !1,
  estimatedRowHeight: g,
  getRowHeightProp: m,
  getRowItem: x,
  getRowKey: N,
  overscanRows: w,
  isPhoneMode: C,
  phoneExpandedRows: b,
  expandedCardExtraHeight: y,
  dataVersion: K,
  layoutResetKey: J = "",
  scrollContainerRef: ee,
  virtualScrollTopRef: q,
  lastScrollTopRef: Q,
  isWindowScroll: V
}) {
  const E = !!(f || m || s), M = !!(f && !m || s), Z = Math.max(
    t,
    Math.round(g ?? t)
  ), u = W(() => !C || b.size === 0 ? vs : Array.from(b.values()).filter((D) => D >= 0 && D < e).sort((D, _) => D - _), [C, b, e]), G = W(() => u.length === 0 ? bs : new Set(u), [u]), X = ne(new Float32Array(0)), F = ne(new Float64Array(1)), Y = ne(/* @__PURE__ */ new Map()), fe = ne(J), Ce = ne(/* @__PURE__ */ new Map()), ie = ne(
    /* @__PURE__ */ new Map()
  ), me = ne(null), h = ne(null), [ue, j] = be(0), Ae = ne({
    totalRows: e,
    baseRowHeight: t,
    isDynamicActive: E,
    dynamicRowHeight: !!f,
    hasDynamicDetailRows: !!s,
    hasGetRowHeightProp: !!m,
    getRowItem: x,
    isWindowScroll: V,
    scrollContainerRef: ee,
    virtualScrollTopRef: q,
    lastScrollTopRef: Q,
    expandedIdxSet: G,
    expandedCardExtraHeight: y
  });
  Ae.current = {
    totalRows: e,
    baseRowHeight: t,
    isDynamicActive: E,
    dynamicRowHeight: !!f,
    hasDynamicDetailRows: !!s,
    hasGetRowHeightProp: !!m,
    getRowItem: x,
    isWindowScroll: V,
    scrollContainerRef: ee,
    virtualScrollTopRef: q,
    lastScrollTopRef: Q,
    expandedIdxSet: G,
    expandedCardExtraHeight: y
  }, fe.current !== J && (fe.current = J, Y.current.size > 0 && Y.current.clear());
  const Me = W(() => {
    if (!E)
      return X.current = new Float32Array(0), F.current = new Float64Array(1), e * t + u.length * y;
    if (e <= 0)
      return X.current = new Float32Array(0), F.current = new Float64Array(1), F.current[0] = 0, 0;
    const D = X.current.length === e ? X.current : new Float32Array(e), _ = F.current.length === e + 1 ? F.current : new Float64Array(e + 1);
    X.current = D, F.current = _;
    const L = Y.current;
    if (_[0] = 0, !m && !s && L.size === 0 && Z === t && G.size === 0) {
      D.fill(t);
      for (let B = 0; B < e; B++)
        _[B + 1] = _[B] + t;
      return _[e];
    }
    for (let B = 0; B < e; B++) {
      const k = x(B), te = k;
      let de = f ? Z : t;
      if (te && te._isGroupRow)
        de = t;
      else if (te && te._isDetailRow) {
        const ae = te._detailFixedHeight;
        if (typeof ae == "number" && Number.isFinite(ae))
          de = Math.max(28, Math.round(ae));
        else {
          const we = typeof te._detailEstimatedHeight == "number" && Number.isFinite(te._detailEstimatedHeight) ? Math.max(28, Math.round(te._detailEstimatedHeight)) : Math.max(t, 120), Te = N(k, B), ve = L.get(Te);
          de = ve !== void 0 ? ve : we;
        }
      } else if (m)
        de = Math.max(t, Math.round(m(k, B)));
      else if (f && k) {
        const ae = N(k, B), we = L.get(ae);
        we !== void 0 && (de = we);
      }
      G.size > 0 && G.has(B) && (de += y), D[B] = de, _[B + 1] = _[B] + de;
    }
    return _[e];
  }, [
    E,
    f,
    s,
    e,
    t,
    Z,
    m,
    x,
    N,
    u,
    G,
    y,
    K,
    J
  ]), ye = v(() => {
    me.current = null;
    const D = ie.current;
    if (D.size === 0) return;
    const _ = Ae.current;
    if (!_.isDynamicActive || _.totalRows <= 0) {
      D.clear();
      return;
    }
    const L = X.current, B = F.current;
    if (L.length !== _.totalRows || B.length !== _.totalRows + 1) {
      D.clear();
      return;
    }
    const k = _.scrollContainerRef.current, te = _.isWindowScroll ? _.virtualScrollTopRef.current : k ? k.scrollTop : _.lastScrollTopRef.current, de = te > 0 ? El(B, _.totalRows, te) : 0, ae = te > 0 ? Math.max(0, te - B[de]) : 0;
    let we = _.totalRows;
    const Te = Y.current;
    if (D.forEach(({ rowIndex: ve, height: Ue }, Qe) => {
      if (ve < 0 || ve >= _.totalRows) return;
      const S = _.getRowItem(ve)?._isDetailRow ? 28 : _.baseRowHeight, i = Math.max(S, Math.round(Ue)), A = _.expandedIdxSet.has(ve) ? _.expandedCardExtraHeight : 0, z = i + A, se = L[ve];
      Te.set(Qe, i), Math.abs(z - se) >= 1 && (L[ve] = z, ve < we && (we = ve));
    }), D.clear(), !(we >= _.totalRows)) {
      for (let ve = we; ve < _.totalRows; ve++)
        B[ve + 1] = B[ve] + L[ve];
      if (te > 0 && de > 0) {
        const Ue = B[de] + ae - te;
        if (Math.abs(Ue) >= 1) {
          if (_.isWindowScroll)
            typeof window < "u" && window.scrollBy(0, Ue), _.virtualScrollTopRef.current = Math.max(0, _.virtualScrollTopRef.current + Ue), _.lastScrollTopRef.current = Math.max(0, _.lastScrollTopRef.current + Ue);
          else if (k) {
            const Qe = Math.max(0, k.scrollTop + Ue);
            k.scrollTop = Qe, _.virtualScrollTopRef.current = Qe, _.lastScrollTopRef.current = Qe;
          }
        }
      }
      j((ve) => ve + 1);
    }
  }, []), De = v(() => {
    me.current !== null || typeof window > "u" || (me.current = window.requestAnimationFrame(ye));
  }, [ye]), Pe = v(
    (D, _) => {
      if (_.rowIndex < 0 || _.rowIndex >= Ae.current.totalRows) return;
      const L = D.firstElementChild;
      if (L?.getAttribute("data-agv-group-row") === "true" || L?.classList.contains("agv-group-row"))
        return;
      if (L?.getAttribute("data-agv-detail-row") === "true") {
        if (L?.getAttribute("data-agv-detail-fixed") === "true")
          return;
      } else if (!Ae.current.dynamicRowHeight || Ae.current.hasGetRowHeightProp)
        return;
      const k = L ? L.offsetHeight || Math.round(L.getBoundingClientRect().height) : D.offsetHeight || Math.round(D.getBoundingClientRect().height);
      k > 0 && (ie.current.set(_.rowKey, {
        rowIndex: _.rowIndex,
        height: k
      }), De());
    },
    [De]
  );
  Be(() => {
    if (!M || typeof ResizeObserver > "u") {
      h.current?.disconnect(), h.current = null;
      return;
    }
    const D = new ResizeObserver((_) => {
      const L = Ce.current;
      let B = !1;
      for (let k = 0; k < _.length; k++) {
        const te = _[k], de = te.target, ae = L.get(de);
        if (!ae || ae.rowIndex < 0 || ae.rowIndex >= Ae.current.totalRows) continue;
        const we = de.firstElementChild;
        if (we?.getAttribute("data-agv-group-row") === "true" || we?.classList.contains("agv-group-row"))
          continue;
        if (we?.getAttribute("data-agv-detail-row") === "true") {
          if (we?.getAttribute("data-agv-detail-fixed") === "true")
            continue;
        } else if (!Ae.current.dynamicRowHeight || Ae.current.hasGetRowHeightProp)
          continue;
        const ve = te.borderBoxSize && te.borderBoxSize.length > 0 ? Math.round(te.borderBoxSize[0].blockSize) : de.offsetHeight || Math.round(te.contentRect.height), Ue = we && we.offsetHeight > 0 ? we.offsetHeight : ve;
        Ue > 0 && (ie.current.set(ae.rowKey, {
          rowIndex: ae.rowIndex,
          height: Ue
        }), B = !0);
      }
      B && De();
    });
    return h.current = D, Ce.current.forEach((_, L) => {
      D.observe(L);
    }), () => {
      D.disconnect(), h.current === D && (h.current = null);
    };
  }, [M, De]), Rr(() => {
    M && Ce.current.size !== 0 && Ce.current.forEach((D, _) => {
      Pe(_, D);
    });
  }, [M, J, K, Pe]), Be(() => () => {
    me.current !== null && typeof window < "u" && (window.cancelAnimationFrame(me.current), me.current = null), h.current?.disconnect();
  }, []);
  const We = v(
    (D, _, L) => {
      if (!M) return;
      const B = Ce.current, k = h.current, te = B.get(D), de = { rowKey: _, rowIndex: L };
      B.set(D, de), te ? (te.rowKey !== _ || te.rowIndex !== L) && Pe(D, de) : (k?.observe(D), Pe(D, de));
    },
    [M, Pe]
  ), xe = v((D) => {
    Ce.current.delete(D), h.current?.unobserve(D);
  }, []), Ie = W(() => {
    if (!E) return Me;
    if (e <= 0) return 0;
    const D = F.current;
    return D.length === e + 1 ? D[e] : Me;
  }, [E, e, Me, ue]), Le = v(
    (D) => {
      if (e <= 0) return 0;
      const _ = Math.max(0, Math.min(e, D));
      if (E) {
        const B = F.current;
        if (B.length === e + 1)
          return B[_];
      }
      if (u.length === 0)
        return _ * t;
      const L = Tl(u, _);
      return _ * t + L * y;
    },
    [
      e,
      E,
      u,
      t,
      y,
      ue
    ]
  ), Fe = v(
    (D) => {
      if (e <= 0 || D < 0 || D >= e) return t;
      if (E) {
        const _ = X.current;
        if (_.length === e)
          return _[D];
      }
      return G.has(D) ? t + y : t;
    },
    [e, t, E, G, y, ue]
  ), R = v(
    (D) => {
      if (e <= 0 || D <= 0) return 0;
      if (E) {
        const B = F.current;
        if (B.length === e + 1)
          return El(B, e, D);
      }
      if (u.length === 0)
        return Math.min(e - 1, Math.max(0, Math.floor(D / t)));
      let _ = 0, L = e - 1;
      for (; _ <= L; ) {
        const B = _ + L >>> 1, k = B * t + Tl(u, B) * y, te = t + (G.has(B) ? y : 0);
        if (D < k)
          L = B - 1;
        else if (D >= k + te)
          _ = B + 1;
        else
          return B;
      }
      return Math.max(0, Math.min(e - 1, _));
    },
    [
      e,
      E,
      u,
      G,
      t,
      y,
      ue
    ]
  ), O = v(
    (D, _) => {
      if (e <= 0) return { start: 0, end: -1 };
      const L = Math.max(t, _ || 600), B = Math.max(0, Ie - L), k = Math.max(0, Math.min(D, B)), te = R(k), de = R(k + L - 1), ae = Math.max(0, te - w), we = Math.min(e - 1, Math.max(ae, de + w));
      return { start: ae, end: we };
    },
    [e, t, Ie, R, w]
  );
  return {
    isDynamicActive: E,
    totalContentHeight: Ie,
    measureVersion: ue,
    getRowTop: Le,
    getRowHeight: Fe,
    findRowIndexAtOffset: R,
    getVisibleRowRange: O,
    observeRowSlot: We,
    unobserveRowSlot: xe
  };
}
function Rl(e) {
  return typeof CSS < "u" && typeof CSS.escape == "function" ? CSS.escape(e) : e.replace(/["\\]/g, "\\$&");
}
function xs({
  enabled: e,
  highlightHeader: t = !0,
  isResponsiveMode: f = !1,
  isPopupLockActive: s = !1,
  scrollContainerRef: g,
  visibleVersion: m
}) {
  const x = ne(null), N = ne(null), w = ne(s);
  w.current = s, Be(() => {
    const C = g.current;
    if (!C) return;
    const b = () => {
      const ee = C.querySelectorAll("[data-cross-hover]");
      for (let q = 0; q < ee.length; q++)
        ee[q].removeAttribute("data-cross-hover");
      x.current = null, N.current = null;
    };
    if (!e || f) {
      b();
      return;
    }
    const y = (ee, q) => {
      const Q = Rl(ee), V = C.querySelectorAll(
        `.agv-grid-row [data-col-key="${Q}"]:not([data-span-spacer="true"])`
      );
      for (let E = 0; E < V.length; E++) {
        const M = V[E];
        M.setAttribute("data-cross-hover", M === q ? "cell" : "col");
      }
      if (t) {
        const E = C.querySelectorAll(
          `[data-agv-header-root="true"] [data-col-key="${Q}"]`
        );
        for (let M = 0; M < E.length; M++)
          E[M].setAttribute("data-cross-hover", "header");
      }
    }, K = (ee) => {
      if (w.current || C.getAttribute("data-agv-scrolling") === "true" || typeof document < "u" && document.documentElement.getAttribute("data-agv-resizing") === "true") {
        x.current !== null && b();
        return;
      }
      const q = ee.target;
      if (!q) return;
      if (q.closest('[data-agv-detail-row="true"], .agv-group-row')) {
        x.current !== null && b();
        return;
      }
      const Q = q.closest('[data-agv-row="true"]');
      if (!Q || !Q.classList.contains("agv-grid-row")) {
        x.current !== null && b();
        return;
      }
      const V = q.closest("[data-col-key]");
      if (!V || !Q.contains(V) || V.getAttribute("data-span-spacer") === "true") {
        x.current !== null && b();
        return;
      }
      const E = V.getAttribute("data-col-key"), M = V.getAttribute("data-cell-role");
      if (!E || M === "stt" || M === "chk" || M === "expand" || E === "col_detail_expand") {
        x.current !== null && b();
        return;
      }
      if (x.current === E) {
        N.current && N.current !== V && N.current.isConnected && N.current.setAttribute("data-cross-hover", "col"), V.setAttribute("data-cross-hover", "cell"), N.current = V;
        return;
      }
      b(), x.current = E, N.current = V, y(E, V);
    }, J = () => {
      b();
    };
    return C.addEventListener("pointerover", K, { passive: !0 }), C.addEventListener("pointerleave", J, { passive: !0 }), () => {
      C.removeEventListener("pointerover", K), C.removeEventListener("pointerleave", J), b();
    };
  }, [e, t, f, g]), Be(() => {
    const C = g.current, b = x.current;
    if (!C || !e || f || !b) return;
    const y = Rl(b), K = N.current, J = C.querySelectorAll(
      `.agv-grid-row [data-col-key="${y}"]:not([data-span-spacer="true"])`
    );
    for (let ee = 0; ee < J.length; ee++) {
      const q = J[ee], Q = q === K ? "cell" : "col";
      q.getAttribute("data-cross-hover") !== Q && q.setAttribute("data-cross-hover", Q);
    }
  }, [e, f, g, m]);
}
const Ss = vn(
  () => import("./GridFilterRow-Bn1cvLlO.js").then((e) => ({ default: e.GridFilterRow }))
), ws = vn(
  () => import("./ColumnContextMenu-Cmgll0Ao.js").then((e) => ({ default: e.ColumnContextMenu }))
), ks = vn(
  () => import("./AdvChecklistFilterPopup-1gdPDCKD.js").then((e) => ({ default: e.AdvChecklistFilterPopup }))
), Es = vn(
  () => import("./GridExternalPopupHost-kU7GDB-P.js").then((e) => ({ default: e.GridExternalPopupHost }))
), Ts = vn(
  () => import("./GridResponsiveHeader-DYnpcVW2.js").then((e) => ({
    default: e.GridResponsiveHeader
  }))
), Rs = vn(
  () => import("./ResponsiveSortFilterModal-DkAReVVe.js").then((e) => ({
    default: e.ResponsiveSortFilterModal
  }))
), jl = ka(
  ({
    data: e,
    rowCount: t,
    getRow: f,
    getRowId: s,
    columns: g,
    columnGroups: m,
    tabletGroups: x,
    phoneCard: N,
    columnPins: w,
    defaultColumnPins: C,
    onColumnPinsChange: b,
    colWidths: y,
    defaultColWidths: K,
    onColWidthsChange: J,
    sortConfig: ee,
    onSortChange: q,
    sortRules: Q,
    onSortRulesChange: V,
    selectedRowIndex: E,
    selectedRowKey: M,
    onSelectRow: Z,
    onRowDetail: u,
    checkedRowIndices: G,
    onToggleCheck: X,
    onClearCheckedRows: F,
    renderCell: Y,
    chunkSize: fe = Fl,
    rowHeight: Ce = Gl,
    overscanChunks: ie = 3,
    overscanRows: me = 5,
    scrollbarAlwaysOn: h = !1,
    dynamicRowHeight: ue = !1,
    estimatedRowHeight: j,
    getRowHeight: Ae,
    antiGhostMode: Me = !0,
    surfaceTheme: ye = qi.LIGHT,
    onToggleGroup: De,
    onQuickFilter: Pe,
    formulaMode: We,
    onFormulaModeChange: xe,
    editMode: Ie = Vn.VIEW,
    onEditModeChange: Le,
    editingCell: Fe,
    onStartEditCell: R,
    onEndEditCell: O,
    onCellChange: D,
    variant: _,
    autoHeight: L,
    maxHeight: B,
    persistState: k,
    enableFiltering: te,
    showFilterRow: de,
    enableHeaderFilter: ae,
    enableQuickSearch: we,
    enableQueryBuilder: Te,
    enableSorting: ve,
    enableMultiSort: Ue,
    enableColumnResize: Qe,
    enableColumnReorder: pt,
    enableColumnPinning: S,
    enableColumnHide: i,
    enableRowNumber: A,
    enableSelection: z,
    enableGrouping: se,
    enableRowPinning: he,
    enableSummary: H,
    enableStatusBar: re,
    enableContextMenu: Xe,
    columnFilters: pe = {},
    onColumnFilterChange: ke,
    onClearAllColumnFilters: Ct,
    onClearAllCriteria: Qt,
    hasColumnEmptyCells: cr,
    getColumnDateBounds: zt,
    formatChecklistDisplay: dn,
    getCellValue: ur,
    getDistinctValues: ii,
    className: Jr = "",
    style: Mt,
    enableFloatingToolbar: So,
    enableColumnChooser: Zr,
    enableFullscreen: Mr,
    quickFilterText: Un,
    onQuickFilterTextChange: Dr,
    appliedQueryTree: Pr,
    onApplyQueryTree: Yt,
    onToolbarStateChange: dr,
    hiddenColKeys: wo,
    defaultHiddenColKeys: li,
    onHiddenColKeysChange: ko,
    onReorderColumns: Eo,
    onResetColumns: ai,
    headerHeight: _r,
    groupByColumnKey: xt,
    onToggleGroupByColumn: Pn,
    columnSums: To,
    emptyColKeys: $,
    onCollapseAllGroups: ot,
    onExpandAllGroups: dt,
    onUngroup: Kt,
    onCopyGroupTable: _n,
    groupSortConfig: fr,
    onToggleGroupSort: An,
    matchFilterValue: Ro,
    dataVersion: fn = 0,
    layoutMode: Ze = jr.AUTO,
    gridId: si,
    loading: it = !1,
    refreshing: hr = !1,
    error: Nn = null,
    onRetry: Ye,
    emptyText: bn,
    statusBar: Mo,
    showSummaryRow: pr,
    showStatusBar: tt,
    modules: Qn,
    pinnedTopRowData: gr,
    enableCenterDock: Yn,
    enableCellEditing: eo,
    enableResponsiveLayout: jn,
    enableCrossHover: to,
    crossHoverHighlightHeader: Bn,
    enableCellSpan: qn,
    enableTreeData: no,
    enableRowDetail: Ar,
    spanMethod: Cn,
    maxRowSpanLookback: jt,
    treeColumnKey: ro,
    treeIndentSize: xn,
    onToggleTreeExpand: ci,
    detailExpandColKey: qt,
    isRowDetailExpanded: mr,
    canExpandRowDetail: Do,
    onToggleRowDetail: hn,
    renderDetailRow: yr,
    hasDynamicDetailRows: Nr,
    treeDetailActions: Dt,
    _resolvedFeatures: oo
  }, In) => {
    const d = W(
      () => oo ?? Hl({
        modules: Qn,
        variant: _,
        autoHeight: L,
        maxHeight: B,
        persistState: k,
        enableFiltering: te,
        showFilterRow: de,
        enableHeaderFilter: ae,
        enableQuickSearch: we,
        enableQueryBuilder: Te,
        enableSorting: ve,
        enableMultiSort: Ue,
        enableColumnResize: Qe,
        enableColumnReorder: pt,
        enableColumnPinning: S,
        enableCenterDock: Yn,
        enableColumnHide: i,
        enableRowNumber: A,
        enableSelection: z,
        enableGrouping: se,
        enableRowPinning: he,
        enableCellEditing: eo,
        enableResponsiveLayout: jn,
        enableCrossHover: to,
        crossHoverHighlightHeader: Bn,
        enableCellSpan: qn ?? (Cn !== void 0 ? !0 : void 0),
        enableTreeData: no,
        enableRowDetail: Ar,
        enableSummary: H,
        showSummaryRow: pr,
        enableStatusBar: re,
        showStatusBar: tt,
        enableContextMenu: Xe,
        enableFloatingToolbar: So,
        enableColumnChooser: Zr,
        enableFullscreen: Mr
      }),
      [
        oo,
        Qn,
        _,
        L,
        B,
        k,
        te,
        de,
        ae,
        we,
        Te,
        ve,
        Ue,
        Qe,
        pt,
        S,
        Yn,
        i,
        A,
        z,
        se,
        he,
        eo,
        jn,
        to,
        Bn,
        qn,
        Cn,
        no,
        Ar,
        H,
        pr,
        re,
        tt,
        Xe,
        So,
        Zr,
        Mr
      ]
    ), Xt = d.enableCellEditing ? Ie : Vn.VIEW, Po = W(() => Object.values(pe).filter((r) => {
      if (!r) return !1;
      const a = !!(r.includeBlanks || Array.isArray(r.selectedValues) && r.selectedValues.length > 0), p = r.mode === lr.MULTI && !!(Array.isArray(r.multiValues) && r.multiValues.length > 0 || Array.isArray(r.multiRanges) && r.multiRanges.length > 0), P = Xr(r.op), U = typeof r.val == "string" && r.val.trim().length > 0;
      return a || p || P || U;
    }).length, [pe]), Ee = t !== void 0 ? t : e ? e.length : 0, je = v(
      (r) => {
        if (f) return f(r);
        if (e) return e[r];
        throw new Error("VirtualizedGrid requires either data array or getRow function");
      },
      [e, f]
    ), Sn = v(
      (r, a) => {
        if (ur) return ur(r, a);
        const p = je(r);
        return Ui(p, a);
      },
      [ur, je]
    ), io = Ro || Ol, lo = v(
      (r) => {
        const a = Math.min(Ee, 300);
        for (let p = 0; p < a; p++) {
          const P = Sn(p, r);
          if (P != null && String(P).trim() === "") return !0;
        }
        return !1;
      },
      [Ee, Sn]
    ), Br = ne(null), [, _o] = be(0), ui = v(
      (r) => Br.current ? Br.current.getColumnDateBoundsFromGetter(
        Sn,
        Ee,
        r
      ) : (import("./gridFilterEngine-BDUqdZb-.js").then((a) => {
        Br.current = a, _o((p) => p + 1);
      }), { min: "", max: "" }),
      [Sn, Ee]
    ), Jt = cr || lo, lt = zt || ui, Re = ne(null), Je = ne(null), wn = ne(0), gt = ne(0), $n = ne(0), {
      activeEditingCell: At,
      handleStartEditCell: Ao,
      handleEndEditCell: Xn,
      lockedScrollPosRef: pn
    } = hs({
      controlledEditingCell: Fe,
      onStartEditCell: R,
      onEndEditCell: O,
      scrollContainerRef: Je
    }), mt = d.enableCellEditing ? At : null, Zt = d.enableCellEditing ? Ao : void 0, {
      colMap: Ln,
      colWidths: St,
      setColWidth: ao,
      setMultipleColWidths: No,
      columnPins: ft,
      setColumnPin: vr,
      hiddenColKeys: wt,
      setHiddenColKeys: at,
      effectiveColumns: Bo,
      columnDataTypes: Jn,
      effectiveColumnGroups: Ot,
      visibleColKeys: br,
      handleVisibleColKeysChange: Ir,
      handleResetColumns: $r,
      leftColumns: He,
      rightColumns: qe,
      flatColumns: _e,
      leftOffsets: Pt,
      rightOffsets: kn,
      centerPinnedColKeys: so,
      centerDockStatus: en,
      computeCenterDock: Gn,
      centerLeftOffsets: Nt,
      centerRightOffsets: nt,
      lastEffectiveLeftColKey: kt,
      firstEffectiveRightColKey: Fn,
      totalGridWidth: Bt,
      middleElements: Zn,
      gridColVars: Io
    } = ys({
      columns: g,
      columnGroups: m,
      totalRows: Ee,
      features: d,
      controlledWidths: y,
      defaultColWidths: K,
      onColWidthsChange: J,
      controlledPins: w,
      defaultColumnPins: C,
      onColumnPinsChange: b,
      controlledHiddenColKeys: wo,
      defaultHiddenColKeys: li,
      onHiddenColKeysChange: ko,
      controlledOnResetColumns: ai,
      scrollContainerRef: Je
    }), [En, Lr] = be(""), [Xi, er] = be(!0), [tn, $o] = be(null), [tr, Tn] = be(!1), [nn, Gr] = be(null), It = Un !== void 0 ? Un : En, Lo = v(
      (r) => {
        Dr ? Dr(r) : Lr(r), Pe && Pe("all", r);
      },
      [Dr, Pe]
    ), Fr = v(() => {
      er((r) => !r);
    }, []), $e = Pr !== void 0 ? Pr : tn, Wt = v(
      (r) => {
        Yt ? Yt(r) : $o(r);
      },
      [Yt]
    ), nr = v(() => {
      Tn((r) => !r);
    }, []);
    Be(() => {
      if (!d.enableFullscreen) {
        tr && Tn(!1);
        return;
      }
      const r = (a) => {
        a.altKey && a.shiftKey && (a.key === "f" || a.key === "F") ? (a.preventDefault(), nr()) : a.key === "Escape" && tr && (a.preventDefault(), Tn(!1));
      };
      return window.addEventListener("keydown", r), () => window.removeEventListener("keydown", r);
    }, [d.enableFullscreen, nr, tr]);
    const { activeMode: yt } = is({
      layoutMode: Ze,
      containerRef: Re,
      enabled: d.enableResponsiveLayout
    }), Rn = yt === "tablet", rn = yt === "phone", Ge = Rn || rn, di = d.enableSummary ? pr ?? !0 : !1, Go = d.enableStatusBar ? tt ?? !0 : !1, Ke = Rn ? 76 : rn ? 108 : Ce, Cr = W(
      () => Rn ? us(_e, x, Ot, wt) : void 0,
      [Rn, _e, x, Ot, wt]
    ), gn = W(
      () => rn ? ds(_e, N, wt) : void 0,
      [rn, _e, N, wt]
    ), fi = gn?.extraHeight ?? 140, [on, $t] = be(
      () => /* @__PURE__ */ new Map()
    ), Mn = v((r, a) => {
      $t((p) => {
        const P = new Map(p);
        return P.has(r) ? P.delete(r) : P.set(r, a), P;
      });
    }, []);
    Be(() => {
      yt !== "phone" && on.size > 0 && $t(/* @__PURE__ */ new Map());
    }, [yt, on.size]), Be(() => {
      on.size > 0 && $t(/* @__PURE__ */ new Map());
    }, [fn, Ee]);
    const [rt, st] = be(null), [co, Fo] = be(!1), {
      isToolbarPopupOpen: hi,
      setIsToolbarPopupOpen: Ho,
      isPopupLockActive: rr,
      popupLockedScrollPosRef: or,
      suppressNextGridClickRef: pi,
      handleContainerMouseDownCapture: gi,
      handleContainerSuppressClickCapture: zo,
      handleContainerContextMenuCapture: mi
    } = Ba({
      containerRef: Re,
      scrollContainerRef: Je,
      lastScrollTopRef: wn,
      lastScrollLeftRef: $n,
      activeContextMenu: rt,
      isSortFilterModalOpen: co,
      activeEditingCell: At
    });
    Be(() => {
      Ho(nn !== null);
    }, [nn, Ho]);
    const Lt = v(
      (r) => {
        switch (r) {
          case "search":
            return d.enableQuickSearch;
          case "queryBuilder":
            return d.enableQueryBuilder;
          case "columnChooser":
            return d.enableColumnChooser;
          case "multiSort":
            return d.enableMultiSort;
          default:
            return !1;
        }
      },
      [
        d.enableQuickSearch,
        d.enableQueryBuilder,
        d.enableColumnChooser,
        d.enableMultiSort
      ]
    ), Hr = v(
      (r, a) => {
        Lt(r) && (typeof window < "u" && window.dispatchEvent(
          new CustomEvent("agv-close-all-popups", { detail: { except: "external-popover" } })
        ), Gr({ type: r, anchorEl: a }));
      },
      [Lt]
    ), Ko = v(
      (r, a) => {
        Lt(r) && Gr((p) => p && p.type === r && p.anchorEl === a ? null : (typeof window < "u" && window.dispatchEvent(
          new CustomEvent("agv-close-all-popups", { detail: { except: "external-popover" } })
        ), { type: r, anchorEl: a }));
      },
      [Lt]
    ), ir = v(() => {
      Gr(null);
    }, []);
    Be(() => {
      nn && !Lt(nn.type) && Gr(null);
    }, [nn, Lt]);
    const { handleMouseDownResize: Oo } = za({
      colMap: Ln,
      colWidths: St,
      setColWidth: ao
    }), {
      handleAutoFitColumn: xr,
      handleAutoFitAllColumns: yi,
      handleAutoFitBandColumns: vi
    } = fs({
      colMap: Ln,
      effectiveColumns: Bo,
      columnGroups: m,
      getRowItem: je,
      columnSums: To,
      totalRows: Ee,
      setColWidth: ao,
      setMultipleColWidths: No
    }), Wo = v(
      (r, a) => {
        vr(r, a), st(null);
      },
      [vr]
    ), bi = v(
      (r, a) => {
        const p = m?.find((P) => P.id === r);
        p && (p.keys.forEach((P) => vr(P, a)), st(null));
      },
      [m, vr]
    ), Ci = v(
      (r) => {
        at((a) => new Set(a).add(r)), st(null);
      },
      [at]
    ), xi = v(() => {
      !$ || $.size === 0 || (at((r) => {
        const a = new Set(r);
        return $.forEach((p) => a.add(p)), a;
      }), st(null));
    }, [$, at]), Si = v(() => {
      at(/* @__PURE__ */ new Set()), st(null);
    }, [at]), wi = v(
      (r) => {
        const a = m?.find((p) => p.id === r);
        a && (at((p) => {
          const P = new Set(p);
          return a.keys.forEach((U) => P.add(U)), P;
        }), st(null));
      },
      [m, at]
    ), Vo = ne({});
    Be(() => {
      Vo.current = {};
    }, [pe, Un, Pr, fn]);
    const ln = ne(null), [ki, Ei] = be(!1), [Ti, Ri] = be(null), zr = ne(null), Mi = v((r) => {
      if (ln.current = r, r && zr.current) {
        const a = zr.current;
        zr.current = null, r.open(a.colKey, a.pos, a.curFilter);
      }
    }, []), Vt = W(
      () => sr(Q, ee),
      [Q, ee]
    ), Di = !!(d.enableSorting && Vt.length > 0 || d.enableQuickSearch && It && It.trim().length > 0 || d.enableFiltering && pe && Object.values(pe).some((r) => r && r.val !== void 0 && r.val !== ""));
    Be(() => {
      !d.enableContextMenu && rt && st(null);
    }, [d.enableContextMenu, rt]), Be(() => {
      const r = (a) => {
        const p = a;
        p.detail?.except !== "context-menu" && st(null), p.detail?.except !== lr.CHECKLIST && ln.current?.close();
      };
      return window.addEventListener("agv-close-all-popups", r), () => {
        window.removeEventListener("agv-close-all-popups", r);
      };
    }, []);
    const Pi = v(
      (r, a) => {
        if (!d.enableHeaderFilter || $?.has(r)) return;
        if (ln.current?.isOpenFor(r)) {
          ln.current.close();
          return;
        }
        window.dispatchEvent(
          new CustomEvent("agv-close-all-popups", {
            detail: { except: lr.CHECKLIST, source: lr.CHECKLIST }
          })
        ), st(null);
        const p = a.currentTarget, P = p.getBoundingClientRect(), U = window.innerHeight, ge = U - P.bottom - 8, le = P.top - 8, Ht = ge < 320 && le > ge;
        let cn = Math.round(P.left);
        cn + 270 > window.innerWidth - 10 && (cn = Math.max(10, window.innerWidth - 270 - 10));
        const po = {
          top: P.bottom + 4,
          bottom: Ht ? U - P.top + 4 : void 0,
          left: cn,
          isFlipUp: Ht,
          anchorEl: p
        }, go = pe[r];
        ln.current ? ln.current.open(r, po, go) : (zr.current = { colKey: r, pos: po, curFilter: go }, Ei(!0));
      },
      [d.enableHeaderFilter, pe, $]
    ), _i = v(
      (r, a, p) => {
        if (!ke) return;
        const P = pe[r] || {
          op: Cl(r, _e),
          val: ""
        };
        ke(r, {
          ...P,
          selectedValues: Array.from(a),
          includeBlanks: p
        });
      },
      [ke, pe, _e]
    ), Ai = v(
      (r) => {
        if (!ke) return;
        const a = pe[r] || {
          op: Cl(r, _e),
          val: ""
        };
        ke(r, {
          ...a,
          selectedValues: [],
          includeBlanks: !1
        });
      },
      [ke, pe, _e]
    ), n = v(() => {
      const r = Je.current;
      r && r.scrollTo({ top: 0, behavior: "smooth" }), st(null);
    }, []), o = v(() => {
      const r = Je.current;
      r && r.scrollTo({ top: r.scrollHeight, behavior: "smooth" }), st(null);
    }, []), l = v(
      (r, a) => s ? s(r, a) : r?.originalIndex ?? r?.id ?? a,
      [s]
    ), [c, I] = be([]), oe = W(() => {
      if (!d.enableRowPinning) return [];
      const r = (gr ?? []).map((p, P) => ({
        rowKey: l(p, -(P + 1)),
        rowIndex: -(P + 1),
        row: p
      }));
      if (r.length === 0) return c;
      if (c.length === 0) return r;
      const a = new Set(r.map((p) => p.rowKey));
      return [...r, ...c.filter((p) => !a.has(p.rowKey))];
    }, [d.enableRowPinning, gr, c, l]), Ne = W(
      () => new Set(c.map((r) => r.rowKey)),
      [c]
    ), Ve = v(() => {
      if (!rt || rt.type !== Tr.ROW) return;
      const { row: r, rowIndex: a } = rt;
      if (!r || r._isGroupRow) return;
      const p = l(r, a);
      I((P) => {
        if (P.some((le) => le.rowKey === p))
          return P.filter((le) => le.rowKey !== p);
        const U = typeof r?.rowIndex == "number" && r.rowIndex >= 0 ? r.rowIndex : a, ge = r?._rowKey !== void 0 && typeof r?.rowIndex == "number" ? r : {
          ...r,
          _baseRecord: r?._baseRecord ?? r,
          _rowKey: p,
          rowIndex: U,
          ...Y || r?.col_stt !== void 0 ? {} : { col_stt: U + 1 }
        };
        return [...P, { rowKey: p, rowIndex: U, row: ge }];
      });
    }, [rt, l, Y]), ze = v((r) => {
      I((a) => a.filter((p) => p.rowKey !== r));
    }, []), Gt = v(() => {
      I([]);
    }, []), ct = v(
      (r, a, p, P) => {
        I((U) => {
          if (U.length === 0) return U;
          const ge = l(a, r);
          return U.some((le) => le.rowKey === ge) ? U.map(
            (le) => le.rowKey === ge ? { ...le, row: { ...le.row, [p]: P } } : le
          ) : U;
        }), D?.(r, a, p, P);
      },
      [l, D]
    ), an = v(
      (r, a) => {
        a.preventDefault(), a.stopPropagation();
        const p = Ln[r];
        !p || p.dataType === ce.SYSTEM || p.isRowNumber || Rt(p) || p.disableHeaderContextMenu || (ln.current?.close(), window.dispatchEvent(
          new CustomEvent("agv-close-all-popups", {
            detail: { except: "context-menu", source: "context-menu" }
          })
        ), st({
          type: Tr.HEADER,
          x: a.clientX,
          y: a.clientY,
          column: p,
          currentPin: ft[r] || Se.NONE,
          hasHiddenColumns: wt.size > 0
        }));
      },
      [Ln, ft, wt]
    ), _t = v(
      (r, a, p) => {
        p.preventDefault(), p.stopPropagation();
        const P = m?.find((ge) => ge.id === r);
        if (!P) return;
        const U = a[0] ? ft[a[0].key] || Se.NONE : Se.NONE;
        ln.current?.close(), window.dispatchEvent(
          new CustomEvent("agv-close-all-popups", {
            detail: { except: "context-menu", source: "context-menu" }
          })
        ), st({
          type: Tr.BAND,
          x: p.clientX,
          y: p.clientY,
          groupDef: P,
          childColumns: a,
          currentPin: U
        });
      },
      [m, ft]
    ), Et = v(
      (r, a, p, P) => {
        P.preventDefault(), P.stopPropagation();
        const U = Ln[p];
        if (!U || U.disableContextMenu || U.dataType === ce.SYSTEM) return;
        if (ln.current?.close(), window.dispatchEvent(
          new CustomEvent("agv-close-all-popups", {
            detail: { except: "context-menu", source: "context-menu" }
          })
        ), $?.has(p) && U) {
          st({
            type: Tr.HEADER,
            x: P.clientX,
            y: P.clientY,
            column: U,
            currentPin: ft[p] || Se.NONE,
            hasHiddenColumns: wt.size > 0
          });
          return;
        }
        const ge = U.valueGetter ? U.valueGetter(a?._baseRecord ?? a, r) : Ui(a, p);
        st({
          type: Tr.ROW,
          x: P.clientX,
          y: P.clientY,
          rowIndex: r,
          row: a,
          column: U,
          cellValue: ge
        });
      },
      [Ln, $, ft, wt]
    ), Oe = v(
      (r, a) => {
        r && (ke ? ke(r, Ll(a)) : Pe && Pe(r, a));
      },
      [ke, Pe]
    ), Ft = v(
      (r, a) => {
        a.preventDefault(), a.stopPropagation(), ln.current?.close(), window.dispatchEvent(
          new CustomEvent("agv-close-all-popups", {
            detail: { except: "context-menu", source: "context-menu" }
          })
        ), st({
          type: Tr.GROUP,
          x: a.clientX,
          y: a.clientY,
          groupRow: r
        });
      },
      []
    ), sn = v(
      (r, a) => {
        if (!d.enableSorting || !q && !V) return;
        const p = !!a?.shiftKey && d.enableMultiSort, P = ns(Vt, r, {
          multi: p,
          enableMultiSort: d.enableMultiSort
        });
        V ? V(P) : q?.(P[0] ?? null);
      },
      [d.enableSorting, d.enableMultiSort, Vt, q, V]
    ), mn = v(
      (r) => {
        if (!d.enableSorting) return;
        const a = sr(r);
        V ? V(a) : q?.(a[0] ?? null);
      },
      [d.enableSorting, V, q]
    ), Sr = v(
      (r) => {
        const a = Vt.filter((p) => p.key !== r);
        mn(a);
      },
      [Vt, mn]
    ), [Tt, Kr] = be(600), wr = d.autoHeight && !tr, ht = wr && d.maxHeight === void 0 && (Mt?.height === void 0 || Mt?.height === "auto") && Mt?.maxHeight === void 0, Uo = v(
      (r, a) => s ? s(r, a) : r?.originalIndex ?? r?.id ?? a,
      [s]
    ), kr = !!(ue && !Ge), Jl = W(() => kr ? `${yt}:${_e.filter((r) => r.wrapText).map((r) => `${r.key}=${St[r.key] ?? r.defaultWidth}`).join("|")}` : "", [kr, yt, _e, St]), {
      isDynamicActive: Ji,
      totalContentHeight: Qo,
      measureVersion: Zi,
      getRowTop: yn,
      getRowHeight: el,
      findRowIndexAtOffset: Or,
      getVisibleRowRange: uo,
      observeRowSlot: Zl,
      unobserveRowSlot: ea
    } = Cs({
      totalRows: Ee,
      baseRowHeight: Ke,
      dynamicRowHeight: kr,
      hasDynamicDetailRows: !!Nr,
      estimatedRowHeight: j,
      getRowHeightProp: Ae,
      getRowItem: je,
      getRowKey: Uo,
      overscanRows: me,
      isPhoneMode: rn,
      phoneExpandedRows: on,
      expandedCardExtraHeight: fi,
      dataVersion: fn,
      layoutResetKey: Jl,
      scrollContainerRef: Je,
      virtualScrollTopRef: gt,
      lastScrollTopRef: wn,
      isWindowScroll: ht
    }), tl = W(
      () => uo(0, 600),
      // Chỉ tính dải dòng khởi tạo lần đầu khi mount
      // eslint-disable-next-line react-hooks/exhaustive-deps
      []
    ), [ta, na] = be(
      () => tl
    ), Ni = ne(tl), Hn = v(
      (r, a) => {
        const p = uo(r, a);
        (p.start !== Ni.current.start || p.end !== Ni.current.end) && (Ni.current = p, na(p));
      },
      [uo]
    ), [zn, Yo] = be(null), jo = ne(null), [ra, oa] = be(!1);
    Be(() => {
      if (!d.enableGrouping || !xt || jo.current) return;
      let r = !0;
      return import("./gridGroupingEngine-CIWGW2kx.js").then((a) => {
        jo.current = a, r && oa(!0);
      }), () => {
        r = !1;
      };
    }, [d.enableGrouping, xt]);
    const Wr = v(
      (r) => !d.enableGrouping || !xt || !jo.current ? null : jo.current.computeStickyGroupIndexAtTop({
        currentTop: r,
        totalRows: Ee,
        actualRowHeight: Ke,
        getRowItem: je,
        getRowTop: yn,
        findRowIndexAtOffset: Or
      }),
      [
        d.enableGrouping,
        xt,
        Ee,
        Ke,
        je,
        yn,
        Or,
        ra
      ]
    ), nl = ne(Wr);
    nl.current = Wr;
    const rl = ne(!1);
    rl.current = !!(rt || At || rr), Rr(() => {
      const r = Je.current;
      if (!r) return;
      if (ht) {
        const P = () => {
          if (rl.current || Hi()) return;
          r.style.setProperty("--agv-viewport-w", `${r.clientWidth || 600}px`);
          const U = r.getBoundingClientRect(), ge = Math.max(0, -U.top), le = window.innerHeight || 600;
          if (gt.current = ge, wn.current = ge, Kr((Ht) => Ht === le ? Ht : le), Hn(ge, le), d.enableGrouping && xt) {
            const Ht = nl.current(ge);
            Yo((cn) => cn === Ht ? cn : Ht);
          }
        };
        return P(), window.addEventListener("scroll", P, { passive: !0 }), window.addEventListener("resize", P, { passive: !0 }), () => {
          window.removeEventListener("scroll", P), window.removeEventListener("resize", P);
        };
      }
      const a = () => {
        r.style.setProperty("--agv-viewport-w", `${r.clientWidth || 600}px`);
        const P = r.clientHeight || 600;
        gt.current = r.scrollTop || 0, Kr((U) => U === P ? U : P), Hn(gt.current, P);
      };
      a();
      const p = new ResizeObserver(a);
      return p.observe(r), () => p.disconnect();
    }, [ht, Hn, d.enableGrouping, xt]), Be(() => {
      Hn(gt.current, Tt);
    }, [Hn, Tt]), Be(() => {
      if (!d.enableGrouping || !xt) {
        Yo((p) => p === null ? p : null);
        return;
      }
      const r = ht ? gt.current : Je.current?.scrollTop || 0, a = Wr(r);
      Yo((p) => p === a ? p : a);
    }, [d.enableGrouping, xt, Wr, fn, ht]);
    const Er = W(() => {
      if (!d.enableGrouping || !xt || zn === null || zn < 0 || zn >= Ee)
        return null;
      const r = je(zn);
      return r?._isGroupRow ? r : null;
    }, [d.enableGrouping, xt, zn, Ee, je, fn]), Vr = ne(null), qo = ne(!1), ol = ne(null), [il, ll] = be(0);
    Rr(() => {
      if (Ge || oe.length === 0) {
        ll(0);
        return;
      }
      const r = ol.current;
      if (!r) return;
      const a = () => {
        const P = r.offsetHeight || oe.length * Ke;
        ll((U) => U === P ? U : P);
      };
      if (a(), !kr || typeof ResizeObserver > "u") return;
      const p = new ResizeObserver(a);
      return p.observe(r), () => p.disconnect();
    }, [
      Ge,
      oe.length,
      Ke,
      kr,
      St
    ]);
    const Bi = !Ge && oe.length > 0 ? il > 0 ? il : oe.length * Ke : 0, Ur = (_r ?? (Zn.some((r) => r.type === "group") ? 64 : 34)) + (d.showFilterRow ? 34 : 0), ia = !!(d.enableGrouping && Er && Er._isGroupRow && zn !== null), la = (Ge ? 44 : Ur + Bi + (ia ? Ke : 0)) + 2, al = ne(null), sl = ne(!1);
    sl.current = !!(rt || At || rr);
    const {
      vBarRef: aa,
      vThumbRef: sa,
      hBarRef: ca,
      hThumbRef: ua,
      notifyScroll: cl,
      syncScrollbars: ul,
      hostInteractionProps: da,
      onVerticalTrackMouseDown: fa,
      onHorizontalTrackMouseDown: ha,
      onVerticalThumbPointerDown: pa,
      onHorizontalThumbPointerDown: ga
    } = Ia({
      overlayHostRef: al,
      scrollContainerRef: Je,
      alwaysShow: h,
      isWindowScroll: ht,
      verticalTrackTopInset: la,
      isLockedRef: sl,
      totalContentHeight: Qo,
      totalGridWidth: Bt,
      viewportHeight: Tt
    });
    Be(() => {
      ul();
    }, [Zi, ul]), Be(() => () => {
      Vr.current !== null && (window.clearTimeout(Vr.current), Vr.current = null);
    }, []);
    const ma = W(() => {
      if (typeof E == "number" && E >= 0)
        return E;
      if (M == null)
        return null;
      for (let r = 0; r < Ee; r++) {
        const a = je(r);
        if (a && !a._isGroupRow && !a._isDetailRow && Uo(a, r) === M)
          return r;
      }
      return null;
    }, [E, M, Ee, je, Uo]), fo = W(
      () => _e.find((r) => Rt(r))?.key,
      [_e]
    ), Xo = !!(d.enableSelection && fo);
    ps({
      scrollContainerRef: Je,
      activeContextMenu: rt,
      activeEditingCell: At,
      isAnyPopupActive: Hi,
      totalRows: Ee,
      selectedRowIndex: ma,
      onSelectRow: Z,
      onToggleCheck: Xo ? X : void 0,
      getRowItem: je,
      viewportHeight: Tt,
      actualRowHeight: Ke,
      getRowTop: yn,
      getRowHeight: el,
      pinnedRowsHeight: Bi,
      customHeaderHeight: _r,
      middleElements: Zn,
      showFilterRow: d.showFilterRow,
      pinnedRowsLength: oe.length,
      stickyGroupRow: Er,
      isWindowScroll: ht
    });
    const ya = v(
      (r) => {
        const a = r.currentTarget;
        if (rt || At || rr || Hi()) {
          const P = pn.current || or.current;
          ht || (a.scrollTop = P ? P.top : wn.current), a.scrollLeft = P ? P.left : $n.current;
          return;
        }
        const p = a.scrollLeft;
        if (p !== $n.current && ($n.current = p, so.length > 0 && Gn(p, a.clientWidth)), !ht) {
          const P = a.scrollTop;
          if (wn.current = P, gt.current = P, Hn(P, Tt), d.enableGrouping && xt) {
            const U = Wr(P);
            Yo((ge) => ge === U ? ge : U);
          }
        }
        cl(), qo.current || (qo.current = !0, a.setAttribute("data-agv-scrolling", "true")), Vr.current && window.clearTimeout(Vr.current), Vr.current = window.setTimeout(() => {
          qo.current && (qo.current = !1, Je.current?.removeAttribute("data-agv-scrolling"));
        }, 110);
      },
      [
        rt,
        At,
        rr,
        pn,
        or,
        so.length,
        Gn,
        ht,
        Hn,
        Tt,
        d.enableGrouping,
        xt,
        Wr,
        cl
      ]
    ), dl = W(
      () => _e.some((r) => !!(r.colSpan || r.rowSpan)),
      [_e]
    ), fl = !!(!Ge && (d.enableCellSpan || dl) && (Cn || dl)), Kn = W(() => {
      if (Ee <= 0) return { start: 0, end: -1 };
      const r = ht ? gt.current : Je.current?.scrollTop ?? gt.current;
      return uo(r, Tt || 600);
    }, [
      ta,
      Ee,
      uo,
      Tt,
      ht,
      Zi
    ]), ho = W(() => !fl || Ee <= 0 || Kn.end < Kn.start ? null : _a({
      startRow: Kn.start,
      endRow: Kn.end,
      totalRows: Ee,
      baseRowHeight: Ke,
      getRowTop: yn,
      columns: _e,
      colWidths: St,
      columnPins: ft,
      centerDockStatus: en,
      lastEffectiveLeftColKey: kt,
      getRowItem: je,
      spanMethod: Cn,
      maxLookback: jt
    }), [
      fl,
      Ee,
      Kn,
      Ke,
      yn,
      _e,
      St,
      ft,
      en,
      kt,
      je,
      Cn,
      jt,
      fn
    ]), hl = W(() => {
      if (Ee <= 0) return [];
      const { start: r, end: a } = Kn;
      if (a < r) return [];
      const p = [], P = /* @__PURE__ */ new Set();
      if (ho && ho.anchorRowsBeforeStart.length > 0) {
        const U = [...ho.anchorRowsBeforeStart].sort((ge, le) => ge - le);
        for (let ge = 0; ge < U.length; ge++) {
          const le = U[ge];
          le >= 0 && le < r && !P.has(le) && (P.add(le), p.push({ rowIndex: le, row: je(le) }));
        }
      }
      for (let U = r; U <= a; U++)
        P.has(U) || p.push({ rowIndex: U, row: je(U) });
      return p;
    }, [Ee, Kn, ho, je, fn]);
    xs({
      enabled: d.enableCrossHover,
      highlightHeader: d.crossHoverHighlightHeader,
      isResponsiveMode: Ge,
      isPopupLockActive: !!(rt || At || rr),
      scrollContainerRef: Je,
      visibleVersion: `${Kn.start}_${Kn.end}_${fn ?? 0}_${_e.length}`
    }), Oa({
      enabled: d.enableSorting && !Ge,
      scrollContainerRef: Je,
      virtualScrollTopRef: gt,
      sortConfig: ee,
      sortRules: Vt,
      groupSortConfig: fr,
      visibleRows: hl,
      actualRowHeight: Ke,
      findRowIndexAtOffset: Or,
      viewportHeight: Tt,
      getRowKey: l
    });
    const pl = ne(yt), gl = ne(Ke), Ii = ne(Or);
    Rr(() => {
      const r = pl.current, a = gl.current;
      if (r !== yt && a > 0 && Ke > 0) {
        const p = Je.current, P = ht ? gt.current : p ? p.scrollTop : wn.current, U = Math.max(
          0,
          Ii.current ? Ii.current(P) : Math.floor(P / a)
        );
        if (U > 0) {
          const ge = Math.max(0, Qo - (Tt || 600)), le = Math.min(ge, yn(U));
          p && !ht && (p.scrollTop = le), wn.current = le, gt.current = le, Hn(le, Tt || 600);
        }
      }
      pl.current = yt, gl.current = Ke, Ii.current = Or;
    }, [
      yt,
      Ke,
      ht,
      Qo,
      Tt,
      yn,
      Or,
      Hn
    ]);
    const ml = W(
      () => Vl($e),
      [$e]
    ), { visibleColumnCount: yl, totalColumnCount: vl } = W(() => {
      const r = g.filter(
        (le) => le.dataType !== ce.SYSTEM && !le.isRowNumber && !le.isSelection
      ), a = (Ot || []).filter((le) => le.isAtomic), p = new Set(a.flatMap((le) => le.keys)), P = r.filter((le) => !p.has(le.key)), U = P.filter((le) => br.includes(le.key)).length, ge = a.filter(
        (le) => le.keys.some((Ht) => br.includes(Ht))
      ).length;
      return {
        totalColumnCount: P.length + a.length,
        visibleColumnCount: U + ge
      };
    }, [g, Ot, br]);
    Be(() => {
      dr?.({
        activePopup: nn?.type ?? null,
        quickFilterText: It,
        isQuickFilterActive: !!It.trim(),
        activeQueryRuleCount: ml,
        visibleColumnCount: yl,
        totalColumnCount: vl,
        sortRuleCount: Vt.length,
        enableQuickSearch: d.enableQuickSearch,
        enableQueryBuilder: d.enableQueryBuilder,
        enableColumnChooser: d.enableColumnChooser,
        enableMultiSort: d.enableMultiSort
      });
    }, [
      dr,
      nn,
      It,
      ml,
      yl,
      vl,
      Vt.length,
      d.enableQuickSearch,
      d.enableQueryBuilder,
      d.enableColumnChooser,
      d.enableMultiSort
    ]), Ea(
      In,
      () => ({
        scrollToRow: (r, a = "auto") => {
          const p = Je.current;
          if (!p || Ee === 0) return;
          const P = Math.max(0, Math.min(Ee - 1, r)), U = yn(P);
          if (ht && typeof window < "u") {
            const ge = Math.max(
              0,
              window.scrollY + p.getBoundingClientRect().top + U - Ur
            );
            window.scrollTo({ top: ge, behavior: a });
            return;
          }
          a === "auto" ? p.scrollTop = U : p.scrollTo({ top: U, behavior: a });
        },
        scrollToChunk: (r, a = "auto") => {
          const p = Je.current;
          if (!p || Ee === 0) return;
          const P = Math.max(0, Math.min(Ee - 1, r * fe)), U = yn(P);
          if (ht && typeof window < "u") {
            const ge = Math.max(
              0,
              window.scrollY + p.getBoundingClientRect().top + U - Ur
            );
            window.scrollTo({ top: ge, behavior: a });
            return;
          }
          a === "auto" ? p.scrollTop = U : p.scrollTo({ top: U, behavior: a });
        },
        getScrollContainer: () => Je.current,
        openPopup: Hr,
        togglePopup: Ko,
        closePopup: ir,
        expandAllTree: Dt?.expandAllTree,
        collapseAllTree: Dt?.collapseAllTree,
        expandTreeToDepth: Dt?.expandTreeToDepth,
        toggleTreeRow: Dt?.toggleTreeRow,
        toggleDetailRow: Dt?.toggleDetailRow,
        expandAllDetails: Dt?.expandAllDetails,
        collapseAllDetails: Dt?.collapseAllDetails
      }),
      [
        Ee,
        fe,
        yn,
        ht,
        Ur,
        Hr,
        Ko,
        ir,
        Dt
      ]
    );
    const On = W(
      () => Ya({
        columns: _e,
        colWidths: St,
        rowHeight: Ke,
        surfaceTheme: ye,
        columnPins: ft,
        leftOffsets: Pt,
        rightOffsets: kn,
        lastEffectiveLeftColKey: kt,
        firstEffectiveRightColKey: Fn,
        centerDockStatus: en,
        centerLeftOffsets: Nt,
        centerRightOffsets: nt,
        emptyColKeys: $,
        dynamicRowHeight: kr
      }),
      [
        _e,
        St,
        Ke,
        ye,
        ft,
        Pt,
        kn,
        kt,
        Fn,
        en,
        Nt,
        nt,
        $,
        kr
      ]
    ), Qr = v(
      (r) => {
        const a = r;
        if (a?.closest?.('[data-agv-detail-row="true"]')) return null;
        const p = a?.closest?.('[data-agv-row="true"]');
        if (!p) return null;
        const P = p.getAttribute("data-row-idx");
        if (P === null) return null;
        const U = Number(P);
        if (!Number.isFinite(U)) return null;
        const ge = U < 0 ? oe[-1 - U]?.row : U < Ee ? je(U) : void 0;
        return ge ? { rowIndex: U, row: ge } : null;
      },
      [oe, Ee, je]
    ), va = v(
      (r) => {
        if (Ge) return;
        const a = Qr(r.target);
        if (!a) return;
        const { rowIndex: p, row: P } = a;
        if (Xt === Vn.SINGLE_CLICK && Zt) {
          const ge = r.target?.closest?.("[data-col-key]")?.getAttribute("data-col-key"), le = ge ? On.colMetaByKey[ge] : void 0;
          if (le && !le.isEmptyCol && le.editable) {
            if (mt?.rowIndex === p && mt?.colKey === le.key) return;
            r.stopPropagation(), Z?.(p, P), Zt(p, le.key);
            return;
          }
        }
        Z?.(p, P);
      },
      [
        Ge,
        Qr,
        Xt,
        Zt,
        On,
        mt,
        Z
      ]
    ), ba = v(
      (r) => {
        if (Ge || Xt !== Vn.DOUBLE_CLICK || !Zt)
          return;
        const a = Qr(r.target);
        if (!a) return;
        const { rowIndex: p, row: P } = a, ge = r.target?.closest?.("[data-col-key]")?.getAttribute("data-col-key"), le = ge ? On.colMetaByKey[ge] : void 0;
        !le || le.isEmptyCol || !le.editable || mt?.rowIndex === p && mt?.colKey === le.key || (r.stopPropagation(), Z?.(p, P), Zt(p, le.key));
      },
      [
        Ge,
        Xt,
        Zt,
        Qr,
        On,
        mt,
        Z
      ]
    ), Ca = v(
      (r) => {
        if (!d.enableContextMenu || (r.preventDefault(), Ge)) return;
        const a = Qr(r.target);
        if (!a) return;
        const P = r.target?.closest?.("[data-col-key]")?.getAttribute("data-col-key"), U = P ? On.colMetaByKey[P] : void 0;
        if (U) {
          if (U.isDisableContextMenu) {
            r.stopPropagation();
            return;
          }
          Et(a.rowIndex, a.row, U.key, r);
        }
      },
      [
        d.enableContextMenu,
        Ge,
        Qr,
        On,
        Et
      ]
    ), xa = xo(), Sa = (r) => !!(r?.isRowNumber || r?.key === "col_stt" || r?.dataType === ce.SYSTEM && r?.title), $i = !!(d.enableRowNumber && _e.some(Sa)), Li = Rn && Cr && Cr.length > 0 ? ls(Cr, $i, Xo) : 0, wa = wr && d.maxHeight !== void 0 ? {
      maxHeight: typeof d.maxHeight == "number" ? `${d.maxHeight}px` : d.maxHeight
    } : {};
    return /* @__PURE__ */ ut(
      "div",
      {
        ref: Re,
        "data-theme": ye,
        className: `relative ${wr ? "w-full" : "flex-1"} flex flex-col min-h-0 overflow-hidden agv-grid-root ${tr ? "agv-grid-fullscreen" : ""} ${$a(ye)} ${Jr}`,
        style: { ...Io, ...wa, ...Mt },
        onMouseDownCapture: gi,
        onClickCapture: zo,
        onDoubleClickCapture: zo,
        onContextMenuCapture: mi,
        onContextMenu: d.enableContextMenu ? (r) => {
          r.preventDefault();
        } : void 0,
        children: [
          /* @__PURE__ */ ut(
            "div",
            {
              ref: al,
              ...da,
              "data-overlay-scroll-active": h ? "true" : "false",
              className: `agv-grid-scroll-overlay-host relative ${wr ? "flex-initial min-h-0" : "flex-1 min-h-0"} flex flex-col`,
              children: [
                /* @__PURE__ */ ut(
                  "div",
                  {
                    ref: Je,
                    onScroll: ya,
                    onClick: Ge ? void 0 : va,
                    onDoubleClick: !Ge && Xt === Vn.DOUBLE_CLICK && Zt ? ba : void 0,
                    "data-agv-editing": mt ? "true" : void 0,
                    onContextMenu: d.enableContextMenu ? Ca : void 0,
                    style: {
                      willChange: "scroll-position",
                      WebkitOverflowScrolling: "touch",
                      backgroundColor: "var(--agv-bg-root)"
                    },
                    className: `agv-scroll-viewport agv-scroll-overlay ${wr ? "flex-initial min-h-0" : "flex-1"} overflow-auto relative ${xa.viewportBg}`,
                    children: [
                      Ge ? /* @__PURE__ */ T(Ut, { fallback: null, children: /* @__PURE__ */ T(
                        Ts,
                        {
                          activeMode: Rn ? "tablet" : "phone",
                          surfaceTheme: ye,
                          columns: _e,
                          compiledTabletGroups: Cr,
                          showRowNumber: $i,
                          showSelectionCol: Xo,
                          totalRows: Ee,
                          onOpenSortFilter: d.enableResponsiveSortFilter ? () => Fo(!0) : void 0,
                          hasActiveFilterOrSort: Di,
                          sortFilterLabel: d.responsiveSortFilterLabel
                        }
                      ) }) : /* @__PURE__ */ ut(ti, { children: [
                        /* @__PURE__ */ T(
                          Ua,
                          {
                            totalGridWidth: Bt,
                            leftColumns: He,
                            middleElements: Zn,
                            rightColumns: qe,
                            colWidths: St,
                            columnPins: ft,
                            leftOffsets: Pt,
                            rightOffsets: kn,
                            centerDockStatus: en,
                            centerLeftOffsets: Nt,
                            centerRightOffsets: nt,
                            lastEffectiveLeftColKey: kt,
                            firstEffectiveRightColKey: Fn,
                            sortConfig: ee,
                            sortRules: Vt,
                            surfaceTheme: ye,
                            columnFilters: pe,
                            activeChecklistColKey: Ti,
                            onOpenChecklistFilter: d.enableHeaderFilter ? Pi : void 0,
                            onToggleSort: sn,
                            onColumnContextMenu: d.enableContextMenu ? an : void 0,
                            onBandContextMenu: d.enableContextMenu ? _t : void 0,
                            onMouseDownResize: d.enableColumnResize ? Oo : void 0,
                            onToggleGroup: De,
                            onReorderColumns: d.enableColumnReorder ? Eo : void 0,
                            headerHeight: _r ?? (Zn.some((r) => r.type === "group") ? 64 : 34),
                            emptyColKeys: $,
                            hasFilterRow: d.showFilterRow,
                            enableSorting: d.enableSorting,
                            enableColumnResize: d.enableColumnResize,
                            enableContextMenu: d.enableContextMenu
                          }
                        ),
                        d.showFilterRow && /* @__PURE__ */ T(
                          Ut,
                          {
                            fallback: /* @__PURE__ */ T(
                              "div",
                              {
                                style: {
                                  height: "34px",
                                  width: `var(--agv-total-grid-w, ${Bt}px)`,
                                  minWidth: `var(--agv-total-grid-w, ${Bt}px)`,
                                  backgroundColor: "var(--agv-bg-header)"
                                },
                                className: "sticky z-25 border-b border-[var(--agv-border)] shrink-0"
                              }
                            ),
                            children: /* @__PURE__ */ T(
                              Ss,
                              {
                                totalGridWidth: Bt,
                                columns: _e,
                                colWidths: St,
                                columnPins: ft,
                                leftOffsets: Pt,
                                rightOffsets: kn,
                                centerDockStatus: en,
                                centerLeftOffsets: Nt,
                                centerRightOffsets: nt,
                                lastEffectiveLeftColKey: kt,
                                firstEffectiveRightColKey: Fn,
                                surfaceTheme: ye,
                                columnFilters: pe,
                                onColumnFilterChange: ke,
                                onClearAllColumnFilters: Ct,
                                onClearAllCriteria: Qt,
                                activeFilterCount: Po,
                                hasColumnEmptyCells: Jt,
                                getColumnDateBounds: lt,
                                headerTopOffset: _r ?? (Zn.some((r) => r.type === "group") ? 64 : 34),
                                columnSums: di ? To : void 0,
                                hasCheckedRows: !!(G && G.size > 0),
                                emptyColKeys: $,
                                groupByColumnKey: d.enableGrouping ? xt : null,
                                quickFilterText: Un,
                                sortConfig: ee,
                                sortRules: Vt,
                                groupSortConfig: fr,
                                appliedQueryTree: Pr,
                                pinnedRows: oe,
                                onUngroup: d.enableGrouping ? Kt : void 0,
                                onSortChange: d.enableSorting ? (r) => {
                                  V ? V(r ? [r] : []) : q?.(r);
                                } : void 0,
                                onRemoveSortRule: d.enableSorting ? Sr : void 0,
                                onToggleGroupSort: d.enableGrouping && d.enableSorting ? An : void 0,
                                onQuickFilterTextChange: Dr,
                                onApplyQueryTree: Yt,
                                onUnpinRow: ze,
                                onClearPinnedRows: Gt
                              }
                            )
                          }
                        )
                      ] }),
                      !Ge && oe.length > 0 && /* @__PURE__ */ T(
                        "div",
                        {
                          ref: ol,
                          "data-agv-fullwidth": "true",
                          style: {
                            position: "sticky",
                            top: `${Ur}px`,
                            width: `var(--agv-total-grid-w, ${Bt}px)`,
                            minWidth: `var(--agv-total-grid-w, ${Bt}px)`,
                            zIndex: 19,
                            backgroundColor: "var(--agv-bg-root)"
                          },
                          className: "border-b-2 border-b-[var(--agv-border-strong)] select-none",
                          children: oe.map((r, a) => {
                            const p = r.rowKey, P = M != null && M === p || E !== null && E === r.rowIndex, ge = _e.find(
                              (cn) => cn.isSelection || cn.dataType === ce.SYSTEM && !cn.title
                            )?.key, le = G ? G.has(p) || r.row?.originalIndex !== void 0 && G.has(r.row.originalIndex) : !!ge && r.row?.[ge] === !0 || r.row?.isChecked === !0, Ht = ge && G ? { ...r.row, [ge]: le } : r.row;
                            return /* @__PURE__ */ T(
                              ji,
                              {
                                row: Ht,
                                rowIndex: -1 - a,
                                columns: _e,
                                colWidths: St,
                                rowHeight: Ke,
                                isSelected: !!P,
                                isChecked: !!le,
                                onSelectRow: Z,
                                onToggleCheck: X,
                                surfaceTheme: ye,
                                columnPins: ft,
                                leftOffsets: Pt,
                                rightOffsets: kn,
                                lastEffectiveLeftColKey: kt,
                                firstEffectiveRightColKey: Fn,
                                centerDockStatus: en,
                                centerLeftOffsets: Nt,
                                centerRightOffsets: nt,
                                renderCell: Y,
                                onCellContextMenu: d.enableContextMenu ? Et : void 0,
                                onGroupContextMenu: d.enableContextMenu ? Ft : void 0,
                                editMode: Xt,
                                editingCell: mt,
                                onStartEditCell: Zt,
                                onEndEditCell: Xn,
                                onCellChange: ct,
                                getColumnDateBounds: zt,
                                emptyColKeys: $,
                                layoutSnapshot: On,
                                delegatedEvents: !Ge
                              },
                              `pinned_${p}`
                            );
                          })
                        }
                      ),
                      d.enableGrouping && Er && Er._isGroupRow && zn !== null && /* @__PURE__ */ T(
                        "div",
                        {
                          "data-agv-fullwidth": "true",
                          style: {
                            position: "sticky",
                            top: `${Ur + Bi}px`,
                            width: `var(--agv-total-grid-w, ${Bt}px)`,
                            minWidth: `var(--agv-total-grid-w, ${Bt}px)`,
                            height: 0,
                            overflow: "visible",
                            zIndex: 18
                          },
                          className: "select-none",
                          children: /* @__PURE__ */ T(
                            ji,
                            {
                              row: Er,
                              rowIndex: zn,
                              columns: _e,
                              colWidths: St,
                              rowHeight: Ke,
                              isSelected: !1,
                              isChecked: !1,
                              onSelectRow: Z,
                              onToggleCheck: X,
                              surfaceTheme: ye,
                              columnPins: ft,
                              leftOffsets: Pt,
                              rightOffsets: kn,
                              lastEffectiveLeftColKey: kt,
                              firstEffectiveRightColKey: Fn,
                              centerDockStatus: en,
                              centerLeftOffsets: Nt,
                              centerRightOffsets: nt,
                              renderCell: Y,
                              onCellContextMenu: d.enableContextMenu ? Et : void 0,
                              onGroupContextMenu: d.enableContextMenu ? Ft : void 0,
                              editMode: Xt,
                              editingCell: mt,
                              onStartEditCell: Zt,
                              onEndEditCell: Xn,
                              onCellChange: ct,
                              getColumnDateBounds: zt,
                              emptyColKeys: $,
                              layoutSnapshot: On,
                              delegatedEvents: !Ge
                            },
                            `sticky_group_${Er.path || zn}`
                          )
                        }
                      ),
                      /* @__PURE__ */ T(
                        "div",
                        {
                          className: "agv-rows-canvas",
                          "data-agv-fullwidth": Ge ? void 0 : "true",
                          style: {
                            height: `${Qo}px`,
                            width: Ge ? "100%" : `var(--agv-total-grid-w, ${Bt}px)`,
                            minWidth: Rn && Li > 0 ? `${Li}px` : Ge ? "100%" : `var(--agv-total-grid-w, ${Bt}px)`,
                            position: "relative",
                            isolation: "isolate",
                            zIndex: 1
                          },
                          children: hl.map(({ rowIndex: r, row: a }) => {
                            const p = Uo(a, r), P = M != null && M === p || E != null && E === r, U = G ? G.has(p) || a?.originalIndex !== void 0 && G.has(a.originalIndex) : !!fo && a?.cells?.get?.(fo)?.value === !0 || !!fo && a?.[fo] === !0 || a?.isChecked === !0, ge = rn ? !!on.has(p) : !1, le = yn(r), Ht = el(r), cn = mt && mt.rowIndex === r ? mt : null, po = !!(a?._isDetailRow || a?._isGroupRow), go = !!(Ji && !Ae || Nr);
                            return /* @__PURE__ */ T(
                              ts,
                              {
                                row: a,
                                rowIndex: r,
                                rowKey: p,
                                rowTop: le,
                                rowHeight: Ke,
                                slotHeight: Ht,
                                dynamicRowHeight: Ji,
                                columns: _e,
                                colWidths: St,
                                layoutSnapshot: On,
                                totalGridWidth: Bt,
                                isSelected: P,
                                isChecked: U,
                                isCardExpanded: ge,
                                showRowNumber: $i,
                                showSelectionCol: Xo,
                                onToggleExpandPhoneCard: Mn,
                                onSelectRow: Z,
                                onRowDetail: u,
                                onToggleCheck: X,
                                onCellContextMenu: d.enableContextMenu ? Et : void 0,
                                onGroupContextMenu: d.enableContextMenu ? Ft : void 0,
                                antiGhostMode: Me,
                                surfaceTheme: ye,
                                columnPins: ft,
                                leftOffsets: Pt,
                                rightOffsets: kn,
                                lastEffectiveLeftColKey: kt,
                                firstEffectiveRightColKey: Fn,
                                centerDockStatus: en,
                                centerLeftOffsets: Nt,
                                centerRightOffsets: nt,
                                renderCell: Y,
                                editMode: Xt,
                                rowEditingCell: cn,
                                onStartEditCell: Zt,
                                onEndEditCell: Xn,
                                onCellChange: ct,
                                getColumnDateBounds: zt,
                                emptyColKeys: $,
                                activeMode: yt,
                                tabletTrackMinWidth: Li,
                                compiledTabletGroups: Cr,
                                compiledPhoneCard: gn,
                                delegatedEvents: !Ge,
                                observeRowSlot: go ? Zl : void 0,
                                unobserveRowSlot: go ? ea : void 0,
                                rowSpanPlan: ho?.rowPlans.get(r),
                                treeColumnKey: d.enableTreeData ? ro : void 0,
                                treeIndentSize: xn,
                                onToggleTreeExpand: d.enableTreeData ? ci : void 0,
                                detailExpandColKey: d.enableRowDetail ? qt : void 0,
                                isDetailExpanded: d.enableRowDetail && !po ? !!mr?.(p) : !1,
                                canExpandDetail: d.enableRowDetail && !po ? Do ? Do(a, r) : !0 : !1,
                                onToggleRowDetail: d.enableRowDetail ? hn : void 0,
                                renderDetailRow: yr
                              },
                              p
                            );
                          })
                        }
                      ),
                      (it || hr) && Ee > 0 ? /* @__PURE__ */ T("div", { className: "sticky left-0 bottom-2 px-3 flex justify-end pointer-events-none z-20", children: /* @__PURE__ */ T(
                        "div",
                        {
                          className: "rounded-md border px-3 py-1 text-xs font-medium",
                          style: {
                            backgroundColor: "var(--agv-bg-popup, var(--agv-bg-root))",
                            borderColor: "var(--agv-border)",
                            color: "var(--agv-text-muted)"
                          },
                          children: "Đang cập nhật..."
                        }
                      ) }) : null,
                      !it && Nn && Ee > 0 ? /* @__PURE__ */ T("div", { className: "sticky left-0 bottom-2 px-3 z-20", children: /* @__PURE__ */ ut(
                        "div",
                        {
                          role: "alert",
                          className: "inline-flex flex-wrap items-center gap-3 rounded-md border px-3 py-2 text-xs",
                          style: {
                            backgroundColor: "var(--agv-danger-bg)",
                            borderColor: "var(--agv-danger)",
                            color: "var(--agv-danger)"
                          },
                          children: [
                            /* @__PURE__ */ T("span", { children: Nn }),
                            Ye ? /* @__PURE__ */ T(qr, { variant: "default", size: "sm", onClick: Ye, children: "Thử lại" }) : null
                          ]
                        }
                      ) }) : null,
                      Ee === 0 ? /* @__PURE__ */ T("div", { className: "sticky left-0 min-h-[200px] flex flex-col items-center justify-center gap-3 p-6 text-center select-none", children: it ? /* @__PURE__ */ T("span", { className: "text-xs font-medium", style: { color: "var(--agv-text-muted)" }, children: "Đang tải dữ liệu..." }) : Nn ? /* @__PURE__ */ ut(ti, { children: [
                        /* @__PURE__ */ T("span", { className: "text-xs font-medium", style: { color: "var(--agv-danger)" }, children: Nn }),
                        Ye ? /* @__PURE__ */ T(qr, { variant: "default", size: "sm", onClick: Ye, children: "Thử lại" }) : null
                      ] }) : /* @__PURE__ */ ut(ti, { children: [
                        /* @__PURE__ */ T("span", { className: "text-xs font-medium", style: { color: "var(--agv-text-muted)" }, children: bn || "Không có dữ liệu phù hợp" }),
                        (Po > 0 || It && It.trim().length > 0 || Co($e)) && (Qt || Ct) ? /* @__PURE__ */ T(
                          qr,
                          {
                            variant: "destructive",
                            size: "sm",
                            onClick: Qt || Ct,
                            children: "Xóa bộ lọc"
                          }
                        ) : null
                      ] }) }) : null
                    ]
                  }
                ),
                !ht && /* @__PURE__ */ T(
                  "div",
                  {
                    ref: aa,
                    "aria-hidden": "true",
                    onMouseDown: fa,
                    className: "agv-overlay-scroll-bar is-vertical",
                    style: { display: "none" },
                    children: /* @__PURE__ */ T(
                      "div",
                      {
                        ref: sa,
                        onPointerDown: pa,
                        className: "agv-overlay-scroll-thumb is-vertical"
                      }
                    )
                  }
                ),
                /* @__PURE__ */ T(
                  "div",
                  {
                    ref: ca,
                    "aria-hidden": "true",
                    onMouseDown: ha,
                    className: "agv-overlay-scroll-bar is-horizontal",
                    style: { display: "none" },
                    children: /* @__PURE__ */ T(
                      "div",
                      {
                        ref: ua,
                        onPointerDown: ga,
                        className: "agv-overlay-scroll-thumb is-horizontal"
                      }
                    )
                  }
                )
              ]
            }
          ),
          Go && Mo ? Mo : null,
          rr && !mt && /* @__PURE__ */ T(
            "div",
            {
              "aria-hidden": "true",
              className: "agv-grid-popup-shield absolute inset-0 bg-transparent pointer-events-auto select-none",
              style: { zIndex: hi ? 1150 : 1220 },
              onMouseDown: (r) => {
                pi.current = !0, r.preventDefault();
              },
              onClick: (r) => {
                r.preventDefault(), r.stopPropagation();
              },
              onDoubleClick: (r) => {
                r.preventDefault(), r.stopPropagation();
              },
              onContextMenu: (r) => {
                r.preventDefault(), r.stopPropagation();
              }
            }
          ),
          d.enableContextMenu && rt && /* @__PURE__ */ T(Ut, { fallback: null, children: /* @__PURE__ */ T(
            ws,
            {
              menu: rt,
              surfaceTheme: ye,
              columns: g,
              columnGroups: Ot,
              onClose: () => st(null),
              enableColumnPinning: d.enableColumnPinning,
              enableCenterDock: d.enableCenterDock,
              onSetPin: d.enableColumnPinning || d.enableCenterDock ? Wo : void 0,
              onAutoFitColumn: d.enableColumnResize ? xr : void 0,
              onAutoFitAllColumns: d.enableColumnResize ? yi : void 0,
              onHideColumn: d.enableColumnHide ? Ci : void 0,
              onShowAllHiddenColumns: d.enableColumnHide ? Si : void 0,
              onSetBandPin: d.enableColumnPinning || d.enableCenterDock ? bi : void 0,
              onAutoFitBandColumns: d.enableColumnResize ? vi : void 0,
              onHideBand: d.enableColumnHide ? wi : void 0,
              onFilterByValue: d.enableFiltering ? Oe : void 0,
              onScrollToTop: n,
              onScrollToBottom: o,
              isRowPinned: d.enableRowPinning && rt.type === Tr.ROW && rt.row ? Ne.has(l(rt.row, rt.rowIndex)) : !1,
              pinnedRowCount: d.enableRowPinning ? oe.length : 0,
              onTogglePinRow: d.enableRowPinning ? Ve : void 0,
              onClearPinnedRows: d.enableRowPinning ? Gt : void 0,
              checkedRowCount: d.enableSelection && G ? G.size : 0,
              onClearCheckedRows: d.enableSelection ? F : void 0,
              groupByColumnKey: d.enableGrouping ? xt : null,
              onToggleGroupByColumn: d.enableGrouping ? Pn : void 0,
              onCollapseAllGroups: d.enableGrouping ? ot : void 0,
              onExpandAllGroups: d.enableGrouping ? dt : void 0,
              onUngroup: d.enableGrouping ? Kt : void 0,
              onCopyGroupTable: d.enableGrouping ? _n : void 0,
              formulaMode: We,
              onSelectFormulaMode: xe,
              emptyColKeys: $,
              onHideAllEmptyColumns: d.enableColumnHide ? xi : void 0,
              groupSortConfig: fr,
              onToggleGroupSort: d.enableGrouping && d.enableSorting ? An : void 0,
              sortConfig: ee,
              onSortChange: d.enableSorting ? q : void 0
            }
          ) }),
          d.enableHeaderFilter && ki && /* @__PURE__ */ T(Ut, { fallback: null, children: /* @__PURE__ */ T(
            ks,
            {
              ref: Mi,
              data: e,
              getRowItem: je,
              totalRowCount: Ee,
              getCellValue: Sn,
              getDistinctValues: ii,
              columnDataTypes: Jn,
              distinctValuesCacheRef: Vo,
              surfaceTheme: ye,
              formatChecklistDisplay: dn,
              matchFilterValue: io,
              onApply: _i,
              onClear: Ai,
              onActiveColChange: Ri
            }
          ) }),
          d.enableResponsiveSortFilter && Ge && /* @__PURE__ */ T(Ut, { fallback: null, children: /* @__PURE__ */ T(
            Rs,
            {
              isOpen: co,
              onClose: () => Fo(!1),
              columns: _e,
              totalRows: Ee,
              sortConfig: ee,
              onSortChange: q,
              searchQuery: It,
              onSearchQueryChange: Lo,
              columnFilters: pe,
              onColumnFilterChange: ke,
              onClearAllColumnFilters: Ct,
              hasColumnEmptyCells: Jt,
              getColumnDateBounds: lt,
              surfaceTheme: ye,
              enableSorting: d.enableSorting,
              enableFiltering: d.enableFiltering,
              enableQuickSearch: d.enableQuickSearch
            }
          ) }),
          nn && /* @__PURE__ */ T(Ut, { fallback: null, children: /* @__PURE__ */ T(
            Es,
            {
              popup: nn,
              onClose: ir,
              gridId: si,
              surfaceTheme: ye,
              quickFilterText: It,
              onQuickFilterChange: Lo,
              isQuickFilterSmart: Xi,
              onToggleQuickFilterSmart: Fr,
              appliedQueryTree: $e,
              onApplyQueryTree: Wt,
              totalRowCount: Ee,
              data: e,
              getCellValue: Sn,
              hasColumnEmptyCells: Jt,
              getColumnDateBounds: lt,
              columns: g,
              columnGroups: Ot,
              visibleColKeys: br,
              onVisibleColKeysChange: Ir,
              columnPins: ft,
              onColumnPinChange: d.enableColumnPinning ? Wo : void 0,
              onResetColumns: $r,
              onAutoFitColumn: d.enableColumnResize ? xr : void 0,
              onReorderColumns: d.enableColumnReorder ? Eo : void 0,
              enableColumnHide: d.enableColumnHide,
              sortRules: Vt,
              onApplySortRules: mn
            }
          ) })
        ]
      }
    );
  }
);
jl.displayName = "VirtualizedGrid";
const Ms = un.memo(jl);
function Ds(e) {
  if (!e || typeof window > "u") return null;
  try {
    return window.localStorage ? window.localStorage.getItem(e) : null;
  } catch {
    return null;
  }
}
function Ps(e, t) {
  if (!(!e || typeof window > "u"))
    try {
      if (!window.localStorage) return;
      window.localStorage.setItem(e, t);
    } catch {
    }
}
function Ml(e, t) {
  const f = Ds(e);
  if (!f) return t;
  try {
    return JSON.parse(f) ?? t;
  } catch {
    return t;
  }
}
function Dl(e, t) {
  try {
    Ps(e, JSON.stringify(t));
  } catch {
  }
}
function ql(e) {
  return e ? e.trim().replace(/[^a-zA-Z0-9_-]/g, "_") : "";
}
function js(e) {
  const t = ql(e);
  return t ? `AGV_QUERY_PRESETS_V1_${t}` : "AGV_QUERY_PRESETS_V1";
}
function _s(e) {
  return `AGV_DATAGRID_CFG_V1_${ql(e) || "default"}`;
}
const Pl = (e) => /* @__PURE__ */ T(La, { ...e }), As = un.lazy(
  () => import("./GridStatusBar-B6ZqS4S3.js").then((e) => ({ default: e.GridStatusBar }))
);
let ni = null, Wi = null;
function _l() {
  return ni ? Promise.resolve(ni) : (Wi || (Wi = import("./gridFilterEngine-BDUqdZb-.js").then((e) => (ni = e, e))), Wi);
}
let ri = null, Vi = null;
function Al() {
  return ri ? Promise.resolve(ri) : (Vi || (Vi = import("./gridGroupingEngine-CIWGW2kx.js").then((e) => (ri = e, e))), Vi);
}
const ei = [], Ns = {}, Nl = {};
function Bl(e, t) {
  const f = e?._rowKey ?? e?.id ?? e?.Id ?? e?.ID ?? e?.key ?? e?.code;
  return f != null && String(f) !== "" ? String(f) : `row_${t}`;
}
function Bs(e, t) {
  return e ? e[t] : void 0;
}
function Xl({
  gridId: e,
  pageKey: t,
  rows: f,
  data: s,
  rowData: g,
  columns: m,
  columnDefs: x,
  columnGroups: N,
  tabletGroups: w,
  phoneCard: C,
  formulaMode: b,
  defaultFormulaMode: y = Yr.MAX,
  onFormulaModeChange: K,
  surfaceTheme: J = qi.LIGHT,
  dynamicRowHeight: ee = !1,
  defaultColDef: q,
  defaultPins: Q,
  getRowKey: V,
  getRowId: E,
  rowKey: M,
  getCellValue: Z,
  getSearchText: u,
  renderCell: G,
  pinnedTopRowData: X,
  onRowClick: F,
  onRowDetail: Y,
  modules: fe,
  variant: Ce,
  autoHeight: ie,
  maxHeight: me,
  persistState: h,
  enableFiltering: ue,
  showFilterRow: j,
  enableHeaderFilter: Ae,
  enableQuickSearch: Me,
  enableQueryBuilder: ye,
  enableSorting: De,
  enableMultiSort: Pe,
  enableColumnResize: We,
  enableColumnReorder: xe,
  enableColumnPinning: Ie,
  enableCenterDock: Le,
  enableColumnHide: Fe,
  enableRowNumber: R,
  enableSelection: O,
  enableGrouping: D,
  enableRowPinning: _,
  enableCellEditing: L,
  enableResponsiveLayout: B,
  enableSummary: k,
  showSummaryRow: te,
  enableStatusBar: de,
  showStatusBar: ae,
  enableContextMenu: we,
  enableFloatingToolbar: Te,
  enableColumnChooser: ve,
  enableSettings: Ue,
  enableFullscreen: Qe,
  enableCrossHover: pt,
  crossHoverHighlightHeader: S,
  enableCellSpan: i,
  enableTreeData: A,
  enableRowDetail: z,
  spanMethod: se,
  maxRowSpanLookback: he,
  treeData: H,
  detailRow: re,
  pagination: Xe,
  enablePagination: pe,
  page: ke,
  defaultPage: Ct = 1,
  pageSize: Qt,
  defaultPageSize: cr = Fi,
  pageSizeOptions: zt = Da,
  serverTotal: dn,
  onPageChange: ur,
  onPageSizeChange: ii
}) {
  const Jr = f ?? s ?? g ?? ei, Mt = typeof Xe == "object" && Xe !== null ? Xe : void 0, So = Mt?.defaultPage ?? Ct, Zr = Mt?.defaultPageSize ?? cr, Mr = Mt?.page ?? ke, Un = Mt?.pageSize ?? Qt, Dr = Mt?.pageSizeOptions ?? zt, Pr = Mt?.serverTotal ?? Mt?.total ?? dn, Yt = Mt?.onPageChange ?? ur, dr = Mt?.onPageSizeChange ?? ii, wo = Xe === !1 ? !1 : Xe === !0 || Mt !== void 0 ? !0 : de, [li, ko] = be(Math.max(1, So)), [Eo, ai] = be(
    Zr > 0 ? Zr : Fi
  ), [_r, xt] = be(y), Pn = b ?? _r, To = v(
    (n) => {
      b === void 0 && xt(n), K?.(n);
    },
    [b, K]
  ), $ = W(
    () => Hl({
      modules: fe,
      variant: Ce,
      autoHeight: ie,
      maxHeight: me,
      persistState: h,
      enableFiltering: ue,
      showFilterRow: j,
      enableHeaderFilter: Ae,
      enableQuickSearch: Me,
      enableQueryBuilder: ye,
      enableSorting: De,
      enableMultiSort: Pe,
      enableColumnResize: We,
      enableColumnReorder: xe,
      enableColumnPinning: Ie,
      enableCenterDock: Le,
      enableColumnHide: Fe,
      enableRowNumber: R,
      enableSelection: O,
      enableGrouping: D,
      enableRowPinning: _,
      enableCellEditing: L,
      enableResponsiveLayout: B,
      enableSummary: k,
      showSummaryRow: te,
      enableStatusBar: wo,
      showStatusBar: ae,
      enableContextMenu: we,
      enableFloatingToolbar: Te,
      enableColumnChooser: ve,
      enableFullscreen: Qe,
      enableCrossHover: pt,
      crossHoverHighlightHeader: S,
      enableCellSpan: i ?? (se !== void 0 ? !0 : void 0),
      enableTreeData: A ?? (H !== void 0 ? !0 : void 0),
      enableRowDetail: z ?? (re !== void 0 ? !0 : void 0)
    }),
    [
      fe,
      Ce,
      ie,
      me,
      h,
      ue,
      j,
      Ae,
      Me,
      ye,
      De,
      Pe,
      We,
      xe,
      Ie,
      Le,
      Fe,
      R,
      O,
      D,
      _,
      L,
      B,
      k,
      te,
      wo,
      ae,
      we,
      Te,
      ve,
      Ue,
      Qe,
      pt,
      S,
      i,
      se,
      A,
      H,
      z,
      re
    ]
  ), ot = !!($.enableTreeData && H), dt = !!($.enableRowDetail && re), Kt = (e || t || "default").trim() || "default", _n = W(
    () => _s(Kt),
    [Kt]
  ), fr = ne(null), {
    flatColumns: An,
    columnGroups: Ro,
    columnDefinedPins: fn
  } = W(
    () => Ga(m ?? x, q, {
      enableColumnPinning: $.enableColumnPinning,
      enableCenterDock: $.enableCenterDock,
      formulaMode: Pn,
      surfaceTheme: J
    }),
    [
      m,
      x,
      q,
      $.enableColumnPinning,
      $.enableCenterDock,
      Pn,
      J
    ]
  ), Ze = W(() => {
    const n = An.some((I) => I.isRowNumber || I.key === "col_stt"), o = An.some((I) => I.isSelection || I.key === "col_chk"), l = An.some(
      (I) => I.isDetailExpand || I.key === "col_detail_expand"
    ), c = [];
    return $.enableRowNumber && !n && c.push({
      key: "col_stt",
      title: "#",
      defaultWidth: 48,
      align: ar.CENTER,
      dataType: ce.SYSTEM,
      isRowNumber: !0,
      pinnable: !1,
      resizable: !1,
      sortable: !0,
      disableHeaderContextMenu: !0
    }), $.enableSelection && !o && c.push({
      key: "col_chk",
      title: "",
      defaultWidth: 36,
      align: ar.CENTER,
      dataType: ce.SYSTEM,
      isSelection: !0,
      pinnable: !1,
      resizable: !1,
      sortable: !0,
      filterable: !0,
      disableHeaderContextMenu: !0
    }), dt && re?.showExpandColumn !== !1 && !re?.expandColumnKey && !l && c.push({
      key: "col_detail_expand",
      title: "",
      defaultWidth: 36,
      minWidth: 36,
      maxWidth: 36,
      align: ar.CENTER,
      dataType: ce.SYSTEM,
      isDetailExpand: !0,
      pinnable: !1,
      resizable: !1,
      sortable: !1,
      filterable: !1,
      enableGlobalFilter: !1,
      hideable: !1,
      groupable: !1,
      disableHeaderContextMenu: !0,
      disableContextMenu: !0
    }), c.length > 0 ? [...c, ...An] : An;
  }, [
    An,
    $.enableRowNumber,
    $.enableSelection,
    dt,
    re?.showExpandColumn,
    re?.expandColumnKey
  ]), si = W(() => {
    const n = N ?? Ro;
    if (!n || n.length === 0) return n;
    const o = new Set(n.flatMap((c) => c.keys)), l = [];
    return Ze.forEach((c) => {
      (c.isRowNumber || c.isSelection || c.isDetailExpand) && !o.has(c.key) && l.push({
        id: c.key,
        title: c.title,
        isStandalone: !0,
        keys: [c.key]
      });
    }), l.length > 0 ? [...l, ...n] : n;
  }, [N, Ro, Ze]), it = W(() => {
    const n = {};
    return Ze.forEach((o) => {
      n[o.key] = o;
    }), n;
  }, [Ze]), hr = W(() => {
    if (!$.enableColumnPinning && !$.enableCenterDock) return Nl;
    const n = {};
    $.enableColumnPinning && $.enableRowNumber && Ze.some((c) => c.key === "col_stt") && (n.col_stt = Se.LEFT), $.enableColumnPinning && $.enableSelection && Ze.some((c) => c.key === "col_chk") && (n.col_chk = Se.LEFT), $.enableColumnPinning && Ze.some((c) => c.key === "col_detail_expand") && (n.col_detail_expand = Se.LEFT);
    const o = {
      ...n,
      ...fn,
      ...Q ?? {}
    };
    if ($.enableColumnPinning && $.enableCenterDock)
      return o;
    const l = {};
    for (const [c, I] of Object.entries(o))
      ($.enableColumnPinning && (I === Se.LEFT || I === Se.RIGHT) || $.enableCenterDock && I === Se.CENTER) && (l[c] = I);
    return l;
  }, [
    $.enableColumnPinning,
    $.enableCenterDock,
    $.enableRowNumber,
    $.enableSelection,
    fn,
    Q,
    Ze
  ]), Nn = v(
    () => $.persistState ? Ml(_n, null) : null,
    [$.persistState, _n]
  ), Ye = v(
    (n) => {
      if (!$.persistState) return;
      const o = Ml(_n, {});
      Dl(_n, { ...o, ...n });
    },
    [$.persistState, _n]
  ), bn = W(() => Nn(), [Nn]), [Mo, pr] = be(null), [tt, Qn] = be(() => /* @__PURE__ */ new Set()), gr = ne(tt);
  Be(() => {
    gr.current = tt;
  }, [tt]);
  const Yn = ne(null), eo = ne(null), jn = ne(null), [to, Bn] = be({}), qn = bl(to), [no, Ar] = be(""), Cn = bl(no), [jt, ro] = be(null), [xn, ci] = be(null);
  Be(() => {
    if (xn || !$.enableQueryBuilder && !Co(jt)) return;
    let n = !0;
    return import("./queryUtils-DpX12s9D.js").then((o) => o.q).then((o) => {
      n && ci(() => o.evaluateQueryTreeNode);
    }), () => {
      n = !1;
    };
  }, [xn, $.enableQueryBuilder, jt]);
  const [qt, mr] = be(
    () => sr(bn?.sortRules, bn?.sortConfig)
  ), Do = qt[0] ?? null, [hn, yr] = be(
    () => bn?.groupByColumnKey ?? null
  ), [Nr, Dt] = be(
    () => bn?.groupSortConfig ?? null
  ), [oo, In] = be(() => /* @__PURE__ */ new Set()), [d, Xt] = be(
    () => bn?.columnPins ?? hr
  ), [Po, Ee] = be(
    () => bn?.colWidths ?? {}
  ), [je, Sn] = be(
    () => new Set(bn?.hiddenColKeys ?? [])
  ), [io, lo] = be(() => bn?.columnOrder ?? []), Br = ne(Kt), _o = ne($.persistState);
  Be(() => {
    if (Br.current === Kt && _o.current === $.persistState)
      return;
    Br.current = Kt, _o.current = $.persistState;
    const n = Nn();
    pr(null), Qn(/* @__PURE__ */ new Set()), Yn.current = null, Bn({}), Ar(""), ro(null), mr(sr(n?.sortRules, n?.sortConfig)), yr(n?.groupByColumnKey ?? null), Dt(n?.groupSortConfig ?? null), In(/* @__PURE__ */ new Set()), Xt(n?.columnPins ?? hr), Ee(n?.colWidths ?? {}), Sn(new Set(n?.hiddenColKeys ?? [])), lo(n?.columnOrder ?? []);
  }, [Kt, $.persistState, Nn, hr]);
  const ui = W(() => {
    const n = !!($.enableColumnPinning && Ze.some((l) => l.key === "col_detail_expand"));
    if (!$.enableColumnPinning && !$.enableCenterDock) return Nl;
    if ($.enableColumnPinning && $.enableCenterDock)
      return n && !d.col_detail_expand ? { ...d, col_detail_expand: Se.LEFT } : d;
    const o = {};
    for (const [l, c] of Object.entries(d))
      ($.enableColumnPinning && (c === Se.LEFT || c === Se.RIGHT) || $.enableCenterDock && c === Se.CENTER) && (o[l] = c);
    return n && !o.col_detail_expand && (o.col_detail_expand = Se.LEFT), o;
  }, [$.enableColumnPinning, $.enableCenterDock, d, Ze]), Jt = W(() => V || (E ? (n, o) => String(E(n, o)) : typeof M == "function" ? (n, o) => String(M(n, o)) : M != null ? (n, o) => {
    const l = n?.[M];
    return l != null && String(l) !== "" ? String(l) : Bl(n, o);
  } : Bl), [V, E, M]), lt = W(
    () => ot ? Aa(Jr, Jt, H) : null,
    [ot, Jr, Jt, H]
  ), Re = lt ? lt.flatRecords : Jr, Je = ne(""), [wn, gt] = be(() => !ot || !lt || lt.roots.length === 0 ? new Set(H?.defaultExpandedKeys?.map(String) ?? []) : (Je.current = `${Kt}|${H?.defaultExpandAll ? "all" : ""}|${H?.defaultExpandedDepth ?? ""}|${H?.defaultExpandedKeys ? H.defaultExpandedKeys.join(",") : ""}`, H?.defaultExpandedKeys ? new Set(H.defaultExpandedKeys.map(String)) : H?.defaultExpandAll ? new Set(lt.allExpandableKeys) : typeof H?.defaultExpandedDepth == "number" ? new Set(lt.getKeysUpToDepth(H.defaultExpandedDepth)) : /* @__PURE__ */ new Set()));
  Be(() => {
    if (!ot || !lt || lt.roots.length === 0) return;
    const n = `${Kt}|${H?.defaultExpandAll ? "all" : ""}|${H?.defaultExpandedDepth ?? ""}|${H?.defaultExpandedKeys ? H.defaultExpandedKeys.join(",") : ""}`;
    Je.current !== n && (Je.current = n, H?.expandedKeys === void 0 && (H?.defaultExpandedKeys ? gt(new Set(H.defaultExpandedKeys.map(String))) : H?.defaultExpandAll ? gt(new Set(lt.allExpandableKeys)) : typeof H?.defaultExpandedDepth == "number" ? gt(new Set(lt.getKeysUpToDepth(H.defaultExpandedDepth))) : gt(/* @__PURE__ */ new Set())));
  }, [
    ot,
    lt,
    Kt,
    H?.expandedKeys,
    H?.defaultExpandAll,
    H?.defaultExpandedDepth,
    H?.defaultExpandedKeys
  ]);
  const $n = W(() => {
    if (H?.expandedKeys !== void 0) {
      const n = /* @__PURE__ */ new Set();
      return H.expandedKeys.forEach((o) => n.add(String(o))), n;
    }
    return wn;
  }, [H?.expandedKeys, wn]), At = ne(H);
  At.current = H;
  const Ao = ne($n);
  Ao.current = $n;
  const Xn = ne(lt);
  Xn.current = lt;
  const pn = v((n) => {
    At.current?.expandedKeys === void 0 && gt(n), At.current?.onExpandedKeysChange?.(Array.from(n));
  }, []), mt = v(
    (n, o) => {
      const l = String(n), c = Ao.current, I = o !== void 0 ? o : !c.has(l), oe = new Set(c);
      I ? oe.add(l) : oe.delete(l), pn(oe);
      const Ne = Xn.current?.nodeByKey.get(l);
      Ne && At.current?.onRowExpand && At.current.onRowExpand({
        row: Ne.record,
        rowKey: Ne.key,
        expanded: I,
        depth: Ne.depth
      });
    },
    [pn]
  ), Zt = v(
    (n) => {
      mt(n);
    },
    [mt]
  ), Ln = v(() => {
    const n = Xn.current;
    n && pn(new Set(n.allExpandableKeys));
  }, [pn]), St = v(() => {
    pn(/* @__PURE__ */ new Set());
  }, [pn]), ao = v(
    (n) => {
      const o = Xn.current;
      o && pn(new Set(o.getKeysUpToDepth(n)));
    },
    [pn]
  ), [No, ft] = be(
    () => new Set(re?.defaultExpandedKeys?.map(String) ?? [])
  ), vr = ne(
    re?.defaultExpandedKeys ? re.defaultExpandedKeys.join(",") : ""
  );
  Be(() => {
    const n = re?.defaultExpandedKeys ? re.defaultExpandedKeys.join(",") : "";
    vr.current !== n && (vr.current = n, re?.expandedKeys === void 0 && ft(new Set(re?.defaultExpandedKeys?.map(String) ?? [])));
  }, [re?.defaultExpandedKeys, re?.expandedKeys]);
  const wt = W(() => {
    if (re?.expandedKeys !== void 0) {
      const n = /* @__PURE__ */ new Set();
      return re.expandedKeys.forEach((o) => n.add(String(o))), n;
    }
    return No;
  }, [re?.expandedKeys, No]), at = ne(re);
  at.current = re;
  const Bo = ne(wt);
  Bo.current = wt;
  const Jn = v((n) => {
    at.current?.expandedKeys === void 0 && ft(n), at.current?.onExpandedKeysChange?.(Array.from(n));
  }, []), Ot = W(() => Z || ((n, o) => {
    const l = it[o];
    return l?.valueGetter ? l.valueGetter(n, 0) : Bs(n, o);
  }), [Z, it]), br = W(
    () => Ze.filter(
      (n) => n.dataType !== ce.SYSTEM && !n.isRowNumber && !n.isSelection && !n.isDetailExpand && n.enableGlobalFilter !== !1
    ).map((n) => n.key),
    [Ze]
  ), Ir = W(() => u || ((n) => br.map((o) => Ot(n, o)).filter((o) => o != null && String(o).trim() !== "").join(" ")), [u, br, Ot]), $r = ne({ rowsRef: Re, getRowKeyRef: Jt, arr: [] });
  ($r.current.rowsRef !== Re || $r.current.getRowKeyRef !== Jt) && ($r.current = {
    rowsRef: Re,
    getRowKeyRef: Jt,
    arr: new Array(Re.length)
  });
  const He = v((n) => {
    const o = $r.current;
    let l = o.arr[n];
    if (l === void 0) {
      const c = o.rowsRef[n];
      l = c !== void 0 ? o.getRowKeyRef(c, n) : `row_${n}`, o.arr[n] = l;
    }
    return l;
  }, []);
  Be(() => {
    if (gr.current.size === 0) return;
    const n = /* @__PURE__ */ new Set();
    for (let o = 0; o < Re.length; o++)
      n.add(He(o));
    Qn((o) => {
      if (o.size === 0) return o;
      let l = !1;
      const c = /* @__PURE__ */ new Set();
      return o.forEach((I) => {
        n.has(String(I)) ? c.add(I) : l = !0;
      }), l ? c : o;
    });
  }, [Re, Jt, He]);
  const qe = v(
    (n, o) => {
      const l = Re[n];
      if (l)
        return Ot(l, o);
    },
    [Re, Ot]
  ), _e = W(() => Object.entries(qn).filter(([n, o]) => {
    if (!o) return !1;
    if (n === "col_chk")
      return o.val === Wn.CHECKED || o.val === Wn.UNCHECKED;
    const l = !!(o.includeBlanks || Array.isArray(o.selectedValues) && o.selectedValues.length > 0), c = o.mode === lr.MULTI && !!(Array.isArray(o.multiValues) && o.multiValues.length > 0 || Array.isArray(o.multiRanges) && o.multiRanges.length > 0), I = Xr(o.op), oe = typeof o.val == "string" && o.val.trim().length > 0;
    return l || c || I || oe;
  }), [qn]), [Pt, kn] = be(() => ni), so = W(
    () => Ze.some((n) => n.dataType === ce.DATE || n.dataType === ce.TIME),
    [Ze]
  ), en = W(
    () => _e.some(
      ([n, o]) => os(o.op, o.val, it[n]?.dataType || ce.TEXT, o)
    ),
    [_e, it]
  );
  Be(() => {
    if (Pt || !en && !($.enableFiltering && so)) return;
    let n = !0;
    return _l().then((o) => {
      n && kn(() => o);
    }), () => {
      n = !1;
    };
  }, [Pt, en, $.enableFiltering, so]);
  const Gn = Pt ? Pt.matchFilterValue : Ol, Nt = qn.col_chk?.val, nt = Re.length, kt = W(() => {
    if (!$.enableFiltering && !$.enableQuickSearch && !$.enableQueryBuilder)
      return null;
    const n = Cn.trim().toLowerCase(), o = $.enableQuickSearch && n.length > 0, l = $.enableFiltering && _e.length > 0, c = $.enableQueryBuilder && Co(jt);
    if (!o && !l && !c) return null;
    const I = $.enableFiltering && Nt === Wn.CHECKED, oe = $.enableFiltering && Nt === Wn.UNCHECKED, Ne = I || oe, Ve = [];
    for (let ze = 0; ze < nt; ze++) {
      const Gt = Re[ze];
      if (Gt) {
        if (Ne) {
          const ct = He(ze);
          if (I && !tt.has(ct) || oe && tt.has(ct)) continue;
        }
        if (l) {
          let ct = !0;
          for (let an = 0; an < _e.length; an++) {
            const [_t, Et] = _e[an];
            if (_t === "col_chk") continue;
            const Oe = it[_t]?.dataType || ce.TEXT, Ft = qe(ze, _t);
            if (!Gn(Ft, Et.op, Et.val, Oe, Et)) {
              ct = !1;
              break;
            }
          }
          if (!ct) continue;
        }
        o && !Ir(Gt).toLowerCase().includes(n) || c && xn && !xn(jt, null, ze, qe) || Ve.push(ze);
      }
    }
    return Ve;
  }, [
    $.enableFiltering,
    $.enableQuickSearch,
    $.enableQueryBuilder,
    Cn,
    _e,
    jt,
    xn,
    Nt,
    nt,
    Re,
    He,
    tt,
    it,
    qe,
    Ir,
    Gn
  ]), Fn = v(
    (n) => {
      const o = Cn.trim().toLowerCase(), l = o.length > 0, c = Co(jt), I = Nt === Wn.CHECKED, oe = Nt === Wn.UNCHECKED, Ne = I || oe, Ve = _e.filter(([Oe]) => Oe !== n), ze = qn[n], Gt = !!(ze && (ze.val || ze.mode === lr.MULTI || Xr(ze.op))), ct = /* @__PURE__ */ new Set();
      let an = !1;
      for (let Oe = 0; Oe < nt; Oe++) {
        const Ft = Re[Oe];
        if (!Ft) continue;
        if (Ne) {
          const mn = He(Oe);
          if (I && !tt.has(mn) || oe && tt.has(mn)) continue;
        }
        if (Ve.length > 0) {
          let mn = !0;
          for (let Sr = 0; Sr < Ve.length; Sr++) {
            const [Tt, Kr] = Ve[Sr];
            if (Tt === "col_chk") continue;
            const wr = it[Tt]?.dataType || ce.TEXT;
            if (!Gn(qe(Oe, Tt), Kr.op, Kr.val, wr, Kr)) {
              mn = !1;
              break;
            }
          }
          if (!mn) continue;
        }
        if (Gt && ze) {
          const mn = it[n]?.dataType || ce.TEXT, Sr = {
            ...ze,
            selectedValues: void 0,
            includeBlanks: void 0
          };
          if (!Gn(
            qe(Oe, n),
            ze.op,
            ze.val,
            mn,
            Sr
          ))
            continue;
        }
        if (l && !Ir(Ft).toLowerCase().includes(o) || c && xn && !xn(jt, null, Oe, qe))
          continue;
        const sn = qe(Oe, n);
        sn == null || String(sn).trim() === "" ? an = !0 : ct.add(String(sn).trim());
      }
      const _t = Array.from(ct);
      if ((it[n]?.dataType || ce.TEXT) === ce.NUMBER)
        _t.sort((Oe, Ft) => Number(Oe) - Number(Ft));
      else {
        const Oe = new Intl.Collator("vi", { sensitivity: "base", numeric: !0 });
        _t.sort((Ft, sn) => Oe.compare(Ft, sn));
      }
      return { values: _t, hasBlanks: an };
    },
    [
      Cn,
      jt,
      xn,
      Nt,
      _e,
      qn,
      nt,
      Re,
      He,
      tt,
      it,
      qe,
      Ir,
      Gn
    ]
  ), Bt = v(
    (n) => Pt ? Pt.getColumnDateBoundsFromGetter(qe, nt, n) : (_l().then((o) => kn(() => o)), { min: "", max: "" }),
    [Pt, nt, qe]
  ), Zn = W(() => !ot || !kt ? null : new Set(kt), [ot, kt]), Io = W(() => {
    if (!ot || !$.enableSorting || qt.length === 0 || nt <= 0)
      return null;
    const n = Array.from({ length: nt }, (I, oe) => oe), o = $.enableMultiSort ? qt : qt.slice(0, 1), l = Sl({
      baseIndices: n,
      rules: o,
      colMap: it,
      getRowVal: qe,
      rows: Re,
      rowKeys: ei,
      getRowKeyAt: He,
      checkedRowKeys: tt,
      formulaMode: Pn
    }), c = new Int32Array(nt);
    for (let I = 0; I < l.length; I++)
      c[l[I]] = I;
    return c;
  }, [
    ot,
    $.enableSorting,
    $.enableMultiSort,
    qt,
    nt,
    it,
    qe,
    Re,
    He,
    tt,
    Pn
  ]), En = W(() => !ot || !lt ? null : Na({
    forest: lt,
    expandedKeys: $n,
    matchedIndexSet: Zn,
    filterMode: H?.filterMode ?? "preserveAncestors",
    sortRankBySourceIndex: Io
  }), [
    ot,
    lt,
    $n,
    Zn,
    H?.filterMode,
    Io
  ]), Lr = W(() => {
    if (!En) return null;
    const n = /* @__PURE__ */ new Map();
    for (let o = 0; o < En.length; o++)
      n.set(En[o].sourceIndex, En[o]);
    return n;
  }, [En]), er = W(() => {
    if (En)
      return En.map((l) => l.sourceIndex);
    let n = kt;
    if (!$.enableSorting || qt.length === 0) return n;
    n || (n = Array.from({ length: nt }, (l, c) => c));
    const o = $.enableMultiSort ? qt : qt.slice(0, 1);
    return Sl({
      baseIndices: n,
      rules: o,
      colMap: it,
      getRowVal: qe,
      rows: Re,
      rowKeys: ei,
      getRowKeyAt: He,
      checkedRowKeys: tt,
      formulaMode: Pn
    });
  }, [
    En,
    $.enableSorting,
    $.enableMultiSort,
    kt,
    qt,
    nt,
    it,
    tt,
    He,
    qe,
    Re,
    Pn
  ]) ?? kt, tn = er ? er.length : nt, $o = !!(Yt || dr), tr = Xe === !1 ? !1 : pe ?? $.enableStatusBar, Tn = Un !== void 0 && Un > 0 ? Math.floor(Un) : Eo, nn = Mr !== void 0 && Mr > 0 ? Math.floor(Mr) : li, Gr = $o ? Pr ?? tn : tn, It = tr && !$o, Lo = tn > 0 ? Math.max(1, Math.ceil(tn / Tn)) : 1, Fr = It ? tn > 0 ? Math.min(Math.max(1, nn), Lo) : 1 : Math.max(1, nn), $e = W(() => {
    if (!It) return er;
    if (tn === 0) return ei;
    const n = (Fr - 1) * Tn, o = Math.min(tn, n + Tn);
    if (er)
      return er.slice(n, o);
    const l = [];
    for (let c = n; c < o; c++)
      l.push(c);
    return l;
  }, [It, er, tn, Fr, Tn]);
  jn.current = $e;
  const Wt = It ? $e?.length ?? 0 : tn, nr = tr ? (Fr - 1) * Tn : 0, yt = W(() => {
    const n = $e ? $e.length : Wt;
    if (n === 0 || tt.size === 0)
      return { allChecked: !1, indeterminate: !1 };
    let o = 0;
    for (let l = 0; l < n; l++) {
      const c = $e ? $e[l] : l;
      tt.has(He(c)) && o++;
    }
    return {
      allChecked: o === n,
      indeterminate: o > 0 && o < n
    };
  }, [$e, Wt, tt, He]), Rn = v(() => {
    const n = $e ? $e.length : Wt;
    n !== 0 && Qn((o) => {
      const l = new Set(o);
      if (yt.allChecked) {
        if (!$e) return /* @__PURE__ */ new Set();
        for (let c = 0; c < n; c++)
          l.delete(He($e[c]));
      } else
        for (let c = 0; c < n; c++) {
          const I = $e ? $e[c] : c;
          l.add(He(I));
        }
      return l;
    });
  }, [$e, Wt, yt.allChecked, He]), rn = W(() => Ze.map((n) => n.key === "col_chk" ? {
    ...n,
    title: "",
    renderHeader: () => /* @__PURE__ */ T(
      Pl,
      {
        checked: yt.allChecked,
        indeterminate: yt.indeterminate,
        onChange: Rn,
        size: 16,
        spring: "snappy"
      }
    )
  } : n), [
    Ze,
    yt.allChecked,
    yt.indeterminate,
    Rn
  ]), Ge = W(() => {
    if (io.length === 0) return rn;
    const n = new Map(rn.map((l) => [l.key, l])), o = [];
    return io.forEach((l) => {
      const c = n.get(l);
      c && (o.push(c), n.delete(l));
    }), n.forEach((l) => o.push(l)), o;
  }, [rn, io]), di = W(() => {
    if (ot)
      return H?.treeColumnKey ? H.treeColumnKey : Ge.find(
        (n) => n.dataType !== ce.SYSTEM && !n.isRowNumber && !n.isSelection && !n.isDetailExpand && !je.has(n.key)
      )?.key;
  }, [ot, H?.treeColumnKey, Ge, je]), Go = v((n) => {
    In((o) => {
      const l = new Set(o);
      return l.has(n) ? l.delete(n) : l.add(n), l;
    });
  }, []), Ke = W(
    () => Ze.filter(
      (n) => n.dataType === ce.NUMBER && !n.isRowNumber && !n.isSelection && !n.isDetailExpand
    ).map((n) => n.key),
    [Ze]
  ), Cr = W(() => {
    if (!$.enableSummary || Ke.length === 0) return Ns;
    const n = {};
    for (const l of Ke)
      n[l] = 0;
    const o = $e ? $e.length : Wt;
    for (let l = 0; l < o; l++) {
      const c = $e ? $e[l] : l;
      for (const I of Ke) {
        const oe = qe(c, I);
        if (typeof oe == "number") {
          Number.isFinite(oe) && (n[I] += oe);
          continue;
        }
        if (oe == null || String(oe).trim() === "") continue;
        const Ne = Number(oe);
        Number.isFinite(Ne) && (n[I] += Ne);
      }
    }
    return n;
  }, [$.enableSummary, Ke, $e, Wt, qe]), [gn, fi] = be(() => ri);
  Be(() => {
    if (gn || !$.enableGrouping || !hn) return;
    let n = !0;
    return Al().then((o) => {
      n && fi(() => o);
    }), () => {
      n = !1;
    };
  }, [gn, $.enableGrouping, hn]);
  const on = W(() => !$.enableGrouping || !hn || !gn || ot ? null : gn.buildGroupBuckets({
    groupByColumnKey: hn,
    pagedRowIndices: $e,
    totalPageRowCount: Wt,
    getRowVal: qe,
    colMap: it,
    numericColumnKeys: Ke
  }), [
    gn,
    $.enableGrouping,
    hn,
    $e,
    Wt,
    qe,
    it,
    Ke
  ]), $t = W(() => !on || !hn || !gn ? null : gn.buildGroupedDisplayModel({
    groupBuckets: on,
    groupByColumnKey: hn,
    groupSortConfig: Nr,
    expandedGroupPaths: oo,
    onToggleCollapse: Go
  }), [
    gn,
    on,
    hn,
    Nr,
    oo,
    Go
  ]);
  Be(() => {
    eo.current = $t;
  }, [$t]);
  const Mn = v(
    (n, o, l, c) => {
      if (!dt) return;
      const I = String(n), oe = Bo.current, Ne = o !== void 0 ? o : !oe.has(I);
      if (Ne && l !== void 0 && at.current?.canExpand && !at.current.canExpand(l, c ?? 0))
        return;
      const Ve = at.current?.accordion && Ne ? /* @__PURE__ */ new Set([I]) : new Set(oe);
      Ne ? Ve.add(I) : Ve.delete(I), Jn(Ve), at.current?.onExpandChange?.({
        row: l,
        rowKey: I,
        expanded: Ne
      });
    },
    [dt, Jn]
  ), rt = v(
    (n, o) => {
      const l = typeof o?._dataPageIndex == "number" ? o._dataPageIndex : 0;
      Mn(n, void 0, o?._baseRecord ?? o, l);
    },
    [Mn]
  ), st = v(() => {
    if (!dt) return;
    const n = jn.current, o = n ? n.length : Re.length, l = /* @__PURE__ */ new Set();
    for (let c = 0; c < o; c++) {
      const I = n ? n[c] : c, oe = Re[I];
      if (oe && !(at.current?.canExpand && !at.current.canExpand(oe, c)) && (l.add(He(I)), at.current?.accordion))
        break;
    }
    Jn(l);
  }, [dt, Re, He, Jn]), co = v(() => {
    Jn(/* @__PURE__ */ new Set());
  }, [Jn]), Fo = v(
    (n) => wt.has(String(n)),
    [wt]
  ), hi = W(() => {
    if (!dt || !re?.canExpand) return;
    const n = re.canExpand;
    return (o, l) => n(o?._baseRecord ?? o, l);
  }, [dt, re?.canExpand]), Ho = W(() => {
    if (!(!dt || !re?.renderDetail))
      return (n) => re.renderDetail({
        row: n._parentRow,
        rowKey: n._parentKey,
        rowIndex: n._parentPageIndex ?? 0,
        close: () => Mn(n._parentKey, !1, n._parentRow)
      });
  }, [dt, re, Mn]), rr = !!(dt && (re?.height === void 0 || re?.height === "auto")), or = W(() => {
    if (!dt || $t || wt.size === 0)
      return null;
    const n = [];
    for (let o = 0; o < Wt; o++) {
      const l = $e ? $e[o] : o, c = Re[l];
      if (!c) continue;
      const I = He(l);
      n.push({ kind: "data", origIdx: l, dataPageIndex: o, rowKey: I }), wt.has(I) && (!re?.canExpand || re.canExpand(c, o)) && n.push({
        kind: "detail",
        origIdx: l,
        dataPageIndex: o,
        parentKey: I,
        baseRecord: c
      });
    }
    return n;
  }, [
    dt,
    $t,
    wt,
    Wt,
    $e,
    Re,
    He,
    re?.canExpand
  ]), pi = $t ? $t.length : or ? or.length : Wt, gi = v(
    (n) => {
      if ($t) {
        const c = $t[n];
        if (!c) return null;
        if (c._isGroupRow) return c;
        const I = Re[c.originalIndex];
        if (!I) return null;
        const oe = He(c.originalIndex);
        return {
          ...I,
          _baseRecord: I,
          _rowKey: oe,
          rowIndex: n,
          originalIndex: c.originalIndex,
          localRowIndex: c.localIndex,
          groupIndex: c.groupIndex,
          col_stt: c.localIndex + 1,
          col_chk: gr.current.has(oe)
        };
      }
      if (or) {
        const c = or[n];
        if (!c) return null;
        if (c.kind === "detail")
          return {
            _isDetailRow: !0,
            _rowKey: `__detail__${c.parentKey}`,
            _parentRow: c.baseRecord,
            _parentKey: c.parentKey,
            _parentPageIndex: c.dataPageIndex,
            _detailFixedHeight: typeof re?.height == "number" ? re.height : void 0,
            _detailEstimatedHeight: re?.estimatedHeight,
            _detailUnstyled: !!re?.unstyled
          };
        const I = Re[c.origIdx];
        if (!I) return null;
        const oe = Lr?.get(c.origIdx);
        return {
          ...I,
          _baseRecord: I,
          _rowKey: c.rowKey,
          originalIndex: c.origIdx,
          _dataPageIndex: c.dataPageIndex,
          col_stt: nr + c.dataPageIndex + 1,
          col_chk: gr.current.has(c.rowKey),
          ...oe ? {
            _treeDepth: oe.depth,
            _treeHasChildren: oe.hasChildren,
            _treeExpanded: oe.isExpanded,
            _treeKey: oe.key
          } : {}
        };
      }
      const o = $e ? $e[n] : n, l = Re[o] ?? null;
      if (!l) return null;
      if (ot && Lr) {
        const c = Lr.get(o), I = He(o);
        if (c)
          return {
            ...l,
            _baseRecord: l,
            _rowKey: I,
            originalIndex: o,
            _treeDepth: c.depth,
            _treeHasChildren: c.hasChildren,
            _treeExpanded: c.isExpanded,
            _treeKey: c.key
          };
      }
      return l;
    },
    [
      $t,
      or,
      re?.height,
      re?.estimatedHeight,
      re?.unstyled,
      Lr,
      ot,
      $e,
      Re,
      He,
      nr
    ]
  ), zo = v(
    (n) => {
      const o = Math.max(1, Math.floor(n));
      Yt ? Yt(o) : ko(o), fr.current?.scrollToRow(0);
    },
    [Yt]
  ), mi = v(
    (n) => {
      const o = n > 0 ? Math.floor(n) : Fi;
      dr ? dr(o) : (ai(o), Yt ? Yt(1) : ko(1)), fr.current?.scrollToRow(0);
    },
    [dr, Yt]
  ), Lt = v(
    (n, o) => {
      if (n?._isGroupRow) return n.path;
      if (n?._rowKey !== void 0) return String(n._rowKey);
      if (o >= 0) {
        const l = jn.current, c = l ? l[o] : o;
        if (c !== void 0 && c >= 0 && c < Re.length && Re[c] === n)
          return He(c);
      }
      return Jt(n, o);
    },
    [Re, He, Jt]
  ), Hr = v(
    (n, o, l) => {
      if (l.stopPropagation(), !o || o._isGroupRow || o._isDetailRow) return;
      const c = o?._rowKey !== void 0 ? String(o._rowKey) : Lt(o, n);
      if (!c) return;
      const I = typeof o?._dataPageIndex == "number" ? o._dataPageIndex : typeof o?.rowIndex == "number" ? o.rowIndex : n;
      Qn((oe) => {
        const Ne = new Set(oe), Ve = !Ne.has(c);
        if (l?.shiftKey && Yn.current !== null) {
          const ze = Yn.current, Gt = eo.current;
          if (Gt && Gt.length > 0) {
            const ct = Math.min(ze.displayIdx, I), an = Math.max(ze.displayIdx, I);
            for (let _t = ct; _t <= an; _t++) {
              const Et = Gt[_t];
              if (Et && !Et._isGroupRow) {
                const Oe = He(Et.originalIndex);
                Oe && (Ve ? Ne.add(Oe) : Ne.delete(Oe));
              }
            }
          } else {
            const ct = jn.current, an = ct ? ct.length : Re.length, _t = Math.max(0, Math.min(ze.displayIdx, I)), Et = Math.min(an - 1, Math.max(ze.displayIdx, I));
            for (let Oe = _t; Oe <= Et; Oe++) {
              const Ft = ct ? ct[Oe] : Oe, sn = He(Ft);
              sn && (Ve ? Ne.add(sn) : Ne.delete(sn));
            }
          }
        } else
          Ve ? Ne.add(c) : Ne.delete(c);
        return Ne.size === 0 && Bn((ze) => {
          if (ze.col_chk?.val === Wn.CHECKED) {
            const Gt = { ...ze };
            return delete Gt.col_chk, Gt;
          }
          return ze;
        }), Ne;
      }), Yn.current = { displayIdx: I, rowKey: c };
    },
    [Lt, He, Re.length]
  ), Ko = v(() => {
    Yn.current = null, Qn(/* @__PURE__ */ new Set()), Bn((n) => {
      if (n.col_chk?.val === Wn.CHECKED) {
        const o = { ...n };
        return delete o.col_chk, o;
      }
      return n;
    });
  }, []), ir = ne(F);
  ir.current = F;
  const Oo = ne(Y);
  Oo.current = Y;
  const xr = v(
    (n, o) => {
      const l = n._baseRecord ?? n, c = jn.current, I = typeof n.originalIndex == "number" ? n.originalIndex : o >= 0 && c ? c[o] ?? o : o;
      return [l, I];
    },
    []
  ), yi = v(
    (n, o) => {
      if (!o || o._isGroupRow || o._isDetailRow) return;
      const l = o._rowKey !== void 0 ? String(o._rowKey) : Lt(o, n);
      if (pr(l), dt && at.current?.expandOnRowClick) {
        const c = typeof o._dataPageIndex == "number" ? o._dataPageIndex : n;
        Mn(l, void 0, o._baseRecord ?? o, c);
      }
      if (ir.current) {
        const [c, I] = xr(o, n);
        ir.current(c, I);
      }
    },
    [Lt, xr, dt, Mn]
  ), vi = v(
    (n, o) => {
      if (!n || n._isGroupRow || n._isDetailRow) return;
      const l = n._rowKey !== void 0 ? String(n._rowKey) : Lt(n, o);
      pr(l);
      const c = Oo.current ?? ir.current;
      if (c) {
        const [I, oe] = xr(n, o);
        c(I, oe);
      }
    },
    [Lt, xr]
  ), Wo = v((n, o) => {
    Bn((l) => {
      if (n === "col_chk") {
        if (!o.val || o.val === Wn.ALL) {
          const c = { ...l };
          return delete c[n], c;
        }
        return { ...l, [n]: Ll(o.val) };
      }
      return { ...l, [n]: o };
    });
  }, []), bi = v(() => {
    Bn({});
  }, []), Ci = v(() => {
    Bn({}), Ar(""), mr([]), yr(null), Dt(null), ro(null), Ye({
      sortConfig: null,
      sortRules: [],
      groupByColumnKey: null,
      groupSortConfig: null
    });
  }, [Ye]), xi = v(
    (n) => {
      const o = sr(n);
      mr(o), Ye({ sortRules: o, sortConfig: o[0] ?? null });
    },
    [Ye]
  ), Si = v(
    (n) => {
      const o = n ? sr([n]) : [];
      mr(o), Ye({ sortRules: o, sortConfig: o[0] ?? null });
    },
    [Ye]
  ), wi = v(
    (n) => {
      Xt(n), Ye({ columnPins: n });
    },
    [Ye]
  ), Vo = v(
    (n) => {
      Ee(n), Ye({ colWidths: n });
    },
    [Ye]
  ), ln = v(
    (n) => {
      Sn(n), Ye({ hiddenColKeys: Array.from(n) });
    },
    [Ye]
  ), ki = v(
    (n, o) => {
      !n || !o || n === o || lo((l) => {
        const c = l.length > 0 ? [...l] : rn.map((Ve) => Ve.key), I = c.indexOf(n), oe = c.indexOf(o);
        if (I < 0 || oe < 0 || I === oe) return c;
        const [Ne] = c.splice(I, 1);
        return c.splice(oe, 0, Ne), Ye({ columnOrder: c }), c;
      });
    },
    [rn, Ye]
  ), Ei = v(() => {
    lo([]), Xt(hr), Sn(/* @__PURE__ */ new Set()), Ee({}), mr([]), yr(null), Dt(null), In(/* @__PURE__ */ new Set()), Dl(_n, {});
  }, [hr, _n]), Ti = v(
    (n) => {
      yr((o) => {
        const l = o === n ? null : n;
        return Ye({ groupByColumnKey: l, groupSortConfig: null }), l;
      }), Dt(null), In(/* @__PURE__ */ new Set());
    },
    [Ye]
  ), Ri = v(
    (n) => {
      Dt((o) => {
        let l;
        return !o || o.colKey !== n ? l = { colKey: n, direction: bt.DESC } : o.direction === bt.DESC ? l = { colKey: n, direction: bt.ASC } : l = null, Ye({ groupSortConfig: l }), l;
      });
    },
    [Ye]
  ), zr = v(() => {
    In(/* @__PURE__ */ new Set());
  }, []), Mi = v(() => {
    if (!on) return;
    const n = /* @__PURE__ */ new Set();
    on.entries.forEach((o, l) => {
      n.add(`group_${o.groupValue}_${l}`);
    }), In(n);
  }, [on]), Vt = v(() => {
    yr(null), Dt(null), In(/* @__PURE__ */ new Set()), Ye({ groupByColumnKey: null, groupSortConfig: null });
  }, [Ye]), Di = v(
    (n, o = !1) => {
      n?.originalIndices?.length && Al().then(
        (l) => l.copyGroupTableToClipboard({
          groupRow: n,
          includeHeaders: o,
          orderedColumns: Ge,
          hiddenColKeys: je,
          getRowVal: qe
        })
      );
    },
    [Ge, je, qe]
  ), Pi = v(
    (n) => {
      const { column: o, row: l, isChecked: c } = n;
      if (!l) return null;
      if (o.key === "col_stt" || o.isRowNumber) {
        const Ve = l.localRowIndex !== void 0 ? l.localRowIndex + 1 : l.col_stt !== void 0 ? l.col_stt : n.rowIndex >= 0 ? nr + n.rowIndex + 1 : typeof l.rowIndex == "number" && l.rowIndex >= 0 ? nr + l.rowIndex + 1 : 1;
        return /* @__PURE__ */ T(
          "span",
          {
            className: "w-full text-center text-xs font-semibold tabular-nums",
            style: { color: "var(--agv-text-muted)" },
            children: Ve
          }
        );
      }
      if (o.key === "col_detail_expand" || o.isDetailExpand)
        return null;
      if (o.key === "col_chk" || o.isSelection) {
        const Ve = typeof l._dataPageIndex == "number" ? l._dataPageIndex : typeof l.rowIndex == "number" ? l.rowIndex : n.rowIndex;
        return /* @__PURE__ */ T(
          Pl,
          {
            checked: !!c,
            onChange: (ze) => Hr(Ve, l, ze),
            size: 16,
            spring: "snappy"
          }
        );
      }
      if (G)
        return G(n);
      const I = Ot(l._baseRecord ?? l, o.key);
      if (I == null || I === "")
        return null;
      const Ne = !!(ee && o.wrapText) ? "whitespace-normal [overflow-wrap:anywhere]" : "truncate";
      if (o.dataType === ce.NUMBER) {
        const Ve = oi(I);
        return /* @__PURE__ */ T("span", { className: `${Ne} tabular-nums`, children: Ve || String(I) });
      }
      if (o.dataType === ce.DATE) {
        const Ve = $l(I);
        return /* @__PURE__ */ T("span", { className: `${Ne} tabular-nums`, children: Ve || String(I) });
      }
      return /* @__PURE__ */ T("span", { className: Ne, children: String(I) });
    },
    [Hr, G, Ot, nr, ee]
  ), _i = W(() => {
    const n = /* @__PURE__ */ new Set();
    if (Re.length === 0 || !$.enableColumnHide && !$.enableHeaderFilter && !$.showFilterRow)
      return n;
    const o = Math.min(Re.length, 300);
    for (const l of Ze) {
      if (l.dataType === ce.SYSTEM || l.isRowNumber || l.isSelection || l.isDetailExpand)
        continue;
      let c = !1;
      for (let I = 0; I < o; I++) {
        const oe = qe(I, l.key);
        if (oe != null && oe !== "" && (typeof oe != "string" || oe.trim() !== "")) {
          c = !0;
          break;
        }
      }
      c || n.add(l.key);
    }
    return n;
  }, [
    Re.length,
    Ze,
    qe,
    $.enableColumnHide,
    $.enableHeaderFilter,
    $.showFilterRow
  ]), Ai = W(
    () => ({
      expandAllTree: Ln,
      collapseAllTree: St,
      expandTreeToDepth: ao,
      toggleTreeRow: mt,
      toggleDetailRow: Mn,
      expandAllDetails: st,
      collapseAllDetails: co
    }),
    [
      Ln,
      St,
      ao,
      mt,
      Mn,
      st,
      co
    ]
  );
  return {
    features: $,
    effectiveGridId: Kt,
    gridRef: fr,
    rows: Re,
    totalFilteredRows: tn,
    totalVirtualRowCount: pi,
    getRow: gi,
    handleGetRowId: Lt,
    orderedColumns: Ge,
    columnGroups: si,
    columnPins: ui,
    handleColumnPinsChange: wi,
    colWidths: Po,
    handleColWidthsChange: Vo,
    hiddenColKeys: je,
    handleHiddenColKeysChange: ln,
    handleReorderColumns: ki,
    handleResetColumns: Ei,
    sortConfig: Do,
    sortRules: qt,
    handleSortChange: Si,
    handleSortRulesChange: xi,
    groupByColumnKey: hn,
    handleToggleGroupByColumn: Ti,
    groupSortConfig: Nr,
    handleToggleGroupSort: Ri,
    handleCollapseAllGroups: zr,
    handleExpandAllGroups: Mi,
    handleUngroup: Vt,
    handleCopyGroupTable: Di,
    selectedRowKey: Mo,
    handleSelectRow: yi,
    handleRowDetail: vi,
    checkedRowKeys: tt,
    handleToggleCheck: Hr,
    handleClearCheckedRows: Ko,
    columnFilters: to,
    handleColumnFilterChange: Wo,
    handleClearAllColumnFilters: bi,
    handleClearAllCriteria: Ci,
    getRowVal: qe,
    getDistinctValues: Fn,
    getColumnDateBounds: Bt,
    effectiveMatchFilter: Gn,
    renderCell: Pi,
    quickFilterText: no,
    setQuickFilterText: Ar,
    appliedQueryTree: jt,
    setAppliedQueryTree: ro,
    emptyColKeys: _i,
    columnSums: Cr,
    groupedDisplayModel: $t,
    currentPage: Fr,
    currentPageSize: Tn,
    pageSizeOptions: Dr,
    totalPagerItems: Gr,
    handlePageChange: zo,
    handlePageSizeChange: mi,
    formulaMode: Pn,
    handleFormulaModeChange: To,
    treeColumnKey: ot ? di : void 0,
    treeIndentSize: H?.indentSize ?? 20,
    onToggleTreeExpand: ot ? Zt : void 0,
    detailExpandColKey: dt ? re?.expandColumnKey : void 0,
    isRowDetailExpanded: Fo,
    canExpandRowDetail: hi,
    onToggleRowDetail: dt ? rt : void 0,
    renderDetailRow: Ho,
    hasDynamicDetailRows: rr,
    treeDetailActions: Ai
  };
}
function Is({
  surfaceTheme: e = qi.LIGHT,
  title: t,
  description: f,
  toolbarSlot: s,
  onToolbarStateChange: g,
  truncated: m = !1,
  loading: x = !1,
  refreshing: N = !1,
  error: w = null,
  onRetry: C,
  emptyText: b = "Không tìm thấy dữ liệu phù hợp.",
  height: y,
  style: K,
  className: J,
  onShowSummaryRowChange: ee,
  onShowStatusBarChange: q,
  showDebugChunkCount: Q = !1,
  overscanRows: V,
  scrollbarAlwaysOn: E,
  dynamicRowHeight: M,
  estimatedRowHeight: Z,
  getRowHeight: u,
  layoutMode: G,
  onLayoutModeChange: X,
  gridRef: F,
  ...Y
}) {
  const [fe, Ce] = be(
    jr.AUTO
  ), ie = G ?? fe, me = X ?? Ce, h = Xl({ ...Y, surfaceTheme: e, dynamicRowHeight: M }), ue = v(
    (O) => {
      h.gridRef.current = O, typeof F == "function" ? F(O) : F && typeof F == "object" && (F.current = O);
    },
    [h.gridRef, F]
  ), { features: j } = h, [Ae, Me] = be(() => ({
    activePopup: null,
    quickFilterText: h.quickFilterText,
    isQuickFilterActive: !!h.quickFilterText.trim(),
    activeQueryRuleCount: 0,
    visibleColumnCount: 0,
    totalColumnCount: 0,
    sortRuleCount: h.sortRules.length,
    enableQuickSearch: j.enableQuickSearch,
    enableQueryBuilder: j.enableQueryBuilder,
    enableColumnChooser: j.enableColumnChooser,
    enableMultiSort: j.enableMultiSort
  })), ye = v(
    (O) => {
      Me(O), g?.(O);
    },
    [g]
  ), De = W(
    () => ({
      state: Ae,
      openPopup: (O, D) => h.gridRef.current?.openPopup(O, D),
      togglePopup: (O, D) => h.gridRef.current?.togglePopup(O, D),
      closePopup: () => h.gridRef.current?.closePopup()
    }),
    [Ae, h.gridRef]
  ), Pe = W(
    () => typeof s == "function" ? s(De) : s,
    [s, De]
  ), We = typeof Y.pagination == "object" && Y.pagination !== null ? Y.pagination.serverTotal ?? Y.pagination.total ?? Y.serverTotal : Y.serverTotal, xe = j.autoHeight && y === void 0, Ie = W(
    () => j.autoHeight === xe ? j : { ...j, autoHeight: xe },
    [j, xe]
  ), Le = J ?? (xe ? "border-0 rounded-none" : "flex-1 min-h-0 border-0 rounded-none"), Fe = !!(t || f || Pe), R = j.enableStatusBar ? /* @__PURE__ */ T(un.Suspense, { fallback: null, children: /* @__PURE__ */ T(
    As,
    {
      page: h.currentPage,
      pageSize: h.currentPageSize,
      totalItems: h.totalPagerItems,
      pageSizeOptions: h.pageSizeOptions,
      onPageChange: h.handlePageChange,
      onPageSizeChange: h.handlePageSizeChange,
      surfaceTheme: e,
      disabled: x
    }
  ) }) : null;
  return /* @__PURE__ */ ut("div", { className: xe ? "w-full flex flex-col" : "flex-1 min-h-0 flex flex-col", children: [
    Fe ? /* @__PURE__ */ ut("section", { className: "px-4 py-3 border-b border-border bg-card text-card-foreground shrink-0 space-y-2.5", children: [
      t || f || We !== void 0 || m ? /* @__PURE__ */ ut("div", { className: "flex flex-wrap items-baseline justify-between gap-2", children: [
        /* @__PURE__ */ ut("div", { className: "flex flex-wrap items-baseline gap-2.5", children: [
          t ? /* @__PURE__ */ T("h2", { className: "text-section-title font-semibold text-foreground tracking-tight", children: t }) : null,
          f ? /* @__PURE__ */ T("span", { className: "text-caption text-muted-foreground", children: f }) : null
        ] }),
        /* @__PURE__ */ T("div", { className: "flex items-center gap-3 text-caption text-muted-foreground", children: /* @__PURE__ */ ut("span", { children: [
          "Đã tải",
          " ",
          /* @__PURE__ */ T("strong", { className: "font-mono tabular-nums text-foreground", children: h.rows.length.toLocaleString("vi-VN") }),
          We !== void 0 && We > h.rows.length ? ` / ${We.toLocaleString("vi-VN")}` : "",
          " ",
          "dòng",
          m ? " (giới hạn tải tối đa)" : ""
        ] }) })
      ] }) : null,
      Pe ? /* @__PURE__ */ T("div", { children: Pe }) : null
    ] }) : null,
    /* @__PURE__ */ T(
      Ms,
      {
        ref: ue,
        gridId: h.effectiveGridId,
        style: y !== void 0 ? { height: y, ...K } : K,
        rowCount: h.totalVirtualRowCount,
        getRow: h.getRow,
        getRowId: h.handleGetRowId,
        columns: h.orderedColumns,
        columnGroups: h.columnGroups,
        tabletGroups: Y.tabletGroups,
        phoneCard: Y.phoneCard,
        pinnedTopRowData: Y.pinnedTopRowData,
        modules: Y.modules,
        columnPins: h.columnPins,
        onColumnPinsChange: h.handleColumnPinsChange,
        colWidths: h.colWidths,
        onColWidthsChange: h.handleColWidthsChange,
        hiddenColKeys: h.hiddenColKeys,
        onHiddenColKeysChange: h.handleHiddenColKeysChange,
        onReorderColumns: h.handleReorderColumns,
        onResetColumns: h.handleResetColumns,
        sortConfig: h.sortConfig,
        onSortChange: h.handleSortChange,
        sortRules: h.sortRules,
        onSortRulesChange: h.handleSortRulesChange,
        groupByColumnKey: h.groupByColumnKey,
        onToggleGroupByColumn: h.handleToggleGroupByColumn,
        groupSortConfig: h.groupSortConfig,
        onToggleGroupSort: h.handleToggleGroupSort,
        onCollapseAllGroups: h.handleCollapseAllGroups,
        onExpandAllGroups: h.handleExpandAllGroups,
        onUngroup: h.handleUngroup,
        onCopyGroupTable: h.handleCopyGroupTable,
        selectedRowKey: h.selectedRowKey,
        onSelectRow: h.handleSelectRow,
        onRowDetail: h.handleRowDetail,
        checkedRowIndices: h.checkedRowKeys,
        onToggleCheck: h.handleToggleCheck,
        onClearCheckedRows: h.handleClearCheckedRows,
        variant: j.variant,
        autoHeight: xe,
        maxHeight: j.maxHeight,
        persistState: j.persistState,
        enableFiltering: j.enableFiltering,
        showFilterRow: j.showFilterRow,
        enableHeaderFilter: j.enableHeaderFilter,
        enableQuickSearch: j.enableQuickSearch,
        enableQueryBuilder: j.enableQueryBuilder,
        enableSorting: j.enableSorting,
        enableMultiSort: j.enableMultiSort,
        enableColumnResize: j.enableColumnResize,
        enableColumnReorder: j.enableColumnReorder,
        enableColumnPinning: j.enableColumnPinning,
        enableCenterDock: j.enableCenterDock,
        enableColumnHide: j.enableColumnHide,
        enableRowNumber: j.enableRowNumber,
        enableSelection: j.enableSelection,
        enableGrouping: j.enableGrouping,
        enableRowPinning: j.enableRowPinning,
        enableCellEditing: j.enableCellEditing,
        enableResponsiveLayout: j.enableResponsiveLayout,
        enableSummary: j.enableSummary,
        showSummaryRow: Y.showSummaryRow,
        enableStatusBar: j.enableStatusBar,
        showStatusBar: Y.showStatusBar,
        enableContextMenu: j.enableContextMenu,
        enableFloatingToolbar: j.enableFloatingToolbar,
        enableColumnChooser: j.enableColumnChooser,
        enableSettings: j.enableSettings,
        enableFullscreen: j.enableFullscreen,
        enableCrossHover: j.enableCrossHover,
        crossHoverHighlightHeader: j.crossHoverHighlightHeader,
        enableCellSpan: j.enableCellSpan,
        enableTreeData: j.enableTreeData,
        enableRowDetail: j.enableRowDetail,
        spanMethod: Y.spanMethod,
        maxRowSpanLookback: Y.maxRowSpanLookback,
        treeColumnKey: h.treeColumnKey,
        treeIndentSize: h.treeIndentSize,
        onToggleTreeExpand: h.onToggleTreeExpand,
        detailExpandColKey: h.detailExpandColKey,
        isRowDetailExpanded: h.isRowDetailExpanded,
        canExpandRowDetail: h.canExpandRowDetail,
        onToggleRowDetail: h.onToggleRowDetail,
        renderDetailRow: h.renderDetailRow,
        hasDynamicDetailRows: h.hasDynamicDetailRows,
        treeDetailActions: h.treeDetailActions,
        columnFilters: h.columnFilters,
        onColumnFilterChange: h.handleColumnFilterChange,
        onClearAllColumnFilters: h.handleClearAllColumnFilters,
        onClearAllCriteria: h.handleClearAllCriteria,
        getCellValue: h.getRowVal,
        getDistinctValues: h.getDistinctValues,
        getColumnDateBounds: h.getColumnDateBounds,
        matchFilterValue: h.effectiveMatchFilter,
        renderCell: h.renderCell,
        columnSums: h.columnSums,
        formulaMode: h.formulaMode,
        onFormulaModeChange: h.handleFormulaModeChange,
        editMode: Vn.VIEW,
        layoutMode: ie,
        onLayoutModeChange: me,
        chunkSize: Fl,
        overscanChunks: 3,
        overscanRows: V,
        scrollbarAlwaysOn: E,
        dynamicRowHeight: M,
        estimatedRowHeight: Z,
        getRowHeight: u,
        rowHeight: Gl,
        surfaceTheme: e,
        quickFilterText: h.quickFilterText,
        onQuickFilterTextChange: h.setQuickFilterText,
        appliedQueryTree: h.appliedQueryTree,
        onApplyQueryTree: h.setAppliedQueryTree,
        onToolbarStateChange: ye,
        emptyColKeys: h.emptyColKeys,
        loading: x,
        refreshing: N,
        error: w,
        onRetry: C,
        emptyText: b,
        statusBar: R,
        onShowSummaryRowChange: ee,
        onShowStatusBarChange: q,
        className: Le,
        _resolvedFeatures: Ie
      }
    )
  ] });
}
const qs = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DataGridEnterprise: Is,
  useDataGridController: Xl
}, Symbol.toStringTag, { value: "Module" }));
export {
  qs as D,
  Pl as G,
  ls as a,
  Vl as b,
  us as c,
  Ys as d,
  ss as e,
  ds as f,
  Qs as g,
  Co as h,
  Wl as i,
  js as j,
  Ml as k,
  sr as n,
  Us as r,
  Dl as w
};
