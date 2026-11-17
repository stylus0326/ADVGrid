import { jsx as d, jsxs as Re, Fragment as Mn } from "react/jsx-runtime";
import { useState as Ge, useRef as M, useEffect as Ne, useCallback as O, useMemo as Fe, Suspense as _t, useLayoutEffect as Tn, lazy as Bt } from "react";
import { Q as Te, a as mt, b as Nn, c as At, h as En, A as Nt, D as Ln } from "./AdvButton-Ck5SixaL.js";
import { h as Pn, D as He, A as On, E as ht, r as In, g as Dn, e as Hn } from "./gridFormatUtils-wCKPmlrt.js";
import { n as kn } from "./normalizeColumns-2pLF_8Qh.js";
import { S as Ft, g as Gt } from "./common-29M8PlVv.js";
const o = {
  ROW_NUMBER: "rowNumber",
  PAGINATION: "pagination",
  SUMMARY_ROW: "summaryRow",
  COLUMN_PINNING: "columnPinning",
  CENTER_DOCK: "centerDock",
  ROW_PINNING: "rowPinning",
  SORTING: "sorting",
  FILTERING: "filtering",
  QUERY_BUILDER: "queryBuilder",
  ROW_SELECTION: "rowSelection",
  ROW_GROUPING: "rowGrouping",
  CELL_EDITING: "cellEditing",
  COLUMN_SIZING: "columnSizing",
  COLUMN_VISIBILITY: "columnVisibility",
  COLUMN_CHOOSER: "columnChooser",
  FULLSCREEN: "fullscreen",
  CONTEXT_MENU: "contextMenu",
  FLOATING_TOOLBAR: "floatingToolbar",
  RESPONSIVE_LAYOUT: "responsiveLayout",
  CROSS_HOVER: "crossHover",
  CELL_SPAN: "cellSpan",
  TREE_DATA: "treeData",
  ROW_DETAIL: "rowDetail"
};
function I(e, t) {
  return Object.freeze({ moduleId: e, moduleName: t });
}
const gt = I(o.ROW_NUMBER, "RowNumberModule"), ft = I(o.PAGINATION, "PaginationModule"), zt = I(o.SUMMARY_ROW, "SummaryRowModule"), $t = I(
  o.COLUMN_PINNING,
  "ColumnPinningModule"
), Ut = I(o.CENTER_DOCK, "CenterDockModule"), Wt = I(o.ROW_PINNING, "RowPinningModule"), Vt = I(o.SORTING, "SortingModule"), Yt = I(o.FILTERING, "FilteringModule"), _n = I(
  o.QUERY_BUILDER,
  "QueryBuilderModule"
), Bn = I(
  o.ROW_SELECTION,
  "RowSelectionModule"
), Qt = I(
  o.ROW_GROUPING,
  "RowGroupingModule"
), An = I(
  o.CELL_EDITING,
  "CellEditingModule"
), jt = I(
  o.COLUMN_SIZING,
  "ColumnSizingModule"
), Xt = I(
  o.COLUMN_VISIBILITY,
  "ColumnVisibilityModule"
), Fn = I(
  o.COLUMN_CHOOSER,
  "ColumnChooserModule"
), Gn = I(o.FULLSCREEN, "FullscreenModule"), Zt = I(
  o.CONTEXT_MENU,
  "ContextMenuModule"
), Kt = I(
  o.FLOATING_TOOLBAR,
  "FloatingToolbarModule"
), qt = I(
  o.RESPONSIVE_LAYOUT,
  "ResponsiveLayoutModule"
), zn = I(
  o.CROSS_HOVER,
  "CrossHoverModule"
), $n = I(
  o.CELL_SPAN,
  "CellSpanModule"
), Un = I(
  o.TREE_DATA,
  "TreeDataModule"
), Wn = I(
  o.ROW_DETAIL,
  "RowDetailModule"
), uo = Object.freeze([
  gt,
  ft
]), mo = Object.freeze([
  gt,
  ft,
  zt,
  $t,
  Ut,
  Wt,
  Vt,
  Yt,
  jt,
  Xt,
  Qt,
  Zt,
  Kt,
  qt
]), ho = Object.freeze([
  gt,
  ft,
  zt,
  $t,
  Ut,
  Wt,
  Vt,
  Yt,
  _n,
  Bn,
  Qt,
  An,
  jt,
  Xt,
  Fn,
  Gn,
  Zt,
  Kt,
  qt,
  zn,
  $n,
  Un,
  Wn
]);
function Vn(e) {
  const t = /* @__PURE__ */ new Set();
  if (!e) return t;
  for (let n = 0; n < e.length; n++) {
    const h = e[n];
    h?.moduleId && t.add(h.moduleId);
  }
  return t;
}
function bo(e, t) {
  if (!e) return !1;
  for (let n = 0; n < e.length; n++)
    if (e[n]?.moduleId === t)
      return !0;
  return !1;
}
const Ue = {
  FULL: "full",
  BASIC: "basic"
};
function Yn(e = {}) {
  if (e.modules !== void 0) {
    const X = Vn(e.modules), l = (st) => X.has(st), $ = e.enableFiltering ?? l(o.FILTERING), ee = e.showFilterRow ?? $, re = e.enableHeaderFilter ?? $, A = e.enableQuickSearch ?? $, C = e.enableQueryBuilder ?? l(o.QUERY_BUILDER), le = e.enableFiltering ?? ($ || ee || re), Y = e.enableSorting ?? l(o.SORTING), Z = Y && (e.enableMultiSort ?? l(o.SORTING)), pe = e.enableColumnResize ?? l(o.COLUMN_SIZING), _e = e.enableColumnReorder ?? l(o.COLUMN_SIZING), Le = e.enableColumnPinning ?? l(o.COLUMN_PINNING), ve = e.enableCenterDock ?? l(o.CENTER_DOCK), Ce = e.enableColumnHide ?? l(o.COLUMN_VISIBILITY), te = e.enableRowNumber ?? l(o.ROW_NUMBER), We = e.enableSelection ?? l(o.ROW_SELECTION), Ve = e.enableGrouping ?? l(o.ROW_GROUPING), lt = e.enableRowPinning ?? l(o.ROW_PINNING), Ye = e.enableCellEditing ?? l(o.CELL_EDITING), Pe = e.enableSummary ?? (l(o.SUMMARY_ROW) || e.showSummaryRow === !0), U = e.enableStatusBar ?? (l(o.PAGINATION) || e.showStatusBar === !0), qe = e.enableContextMenu ?? l(o.CONTEXT_MENU), de = e.enableColumnChooser ?? l(o.COLUMN_CHOOSER), Qe = !1, Be = e.enableFullscreen ?? l(o.FULLSCREEN), je = e.enableResponsiveLayout ?? l(o.RESPONSIVE_LAYOUT), at = e.enableCrossHover ?? l(o.CROSS_HOVER), Se = e.crossHoverHighlightHeader ?? !0, Je = e.enableCellSpan ?? l(o.CELL_SPAN), et = e.enableTreeData ?? l(o.TREE_DATA), tt = e.enableRowDetail ?? l(o.ROW_DETAIL), me = A || C || Z || de || Be, xe = !!(e.enableQuickSearch || e.enableQueryBuilder || e.enableMultiSort || e.enableColumnChooser || e.enableFullscreen), ye = (e.enableFloatingToolbar ?? (l(o.FLOATING_TOOLBAR) || xe)) && me, ze = e.persistState ?? !!(l(o.COLUMN_PINNING) || l(o.CENTER_DOCK) || l(o.SORTING) || l(o.COLUMN_SIZING) || l(o.COLUMN_VISIBILITY) || l(o.ROW_GROUPING)), Oe = e.autoHeight ?? !1, $e = e.variant ?? (X.size <= 2 ? Ue.BASIC : Ue.FULL), K = le || A, Ie = je && (Y || K), nt = Y && K ? "Lọc & Sắp Xếp" : Y ? "Sắp Xếp" : "Tìm & Lọc";
    return {
      variant: $e,
      autoHeight: Oe,
      maxHeight: e.maxHeight,
      persistState: ze,
      enableFiltering: le,
      showFilterRow: ee,
      enableHeaderFilter: re,
      enableQuickSearch: A,
      enableQueryBuilder: C,
      enableSorting: Y,
      enableMultiSort: Z,
      enableColumnResize: pe,
      enableColumnReorder: _e,
      enableColumnPinning: Le,
      enableCenterDock: ve,
      enableColumnHide: Ce,
      enableRowNumber: te,
      enableSelection: We,
      enableGrouping: Ve,
      enableRowPinning: lt,
      enableCellEditing: Ye,
      enableSummary: Pe,
      enableStatusBar: U,
      enableContextMenu: qe,
      enableFloatingToolbar: ye,
      enableColumnChooser: de,
      enableSettings: Qe,
      enableFullscreen: Be,
      enableResponsiveLayout: je,
      hasAnyToolbarAction: me,
      enableCrossHover: at,
      crossHoverHighlightHeader: Se,
      enableCellSpan: Je,
      enableTreeData: et,
      enableRowDetail: tt,
      enableResponsiveFilter: K,
      enableResponsiveSortFilter: Ie,
      responsiveSortFilterLabel: nt
    };
  }
  const t = e.variant === Ue.BASIC ? Ue.BASIC : Ue.FULL, n = t === Ue.BASIC, h = e.autoHeight ?? n, S = e.maxHeight, q = e.persistState ?? !n, T = e.enableFiltering ?? !n, F = e.showFilterRow ?? T, se = e.enableHeaderFilter ?? T, W = e.enableQuickSearch ?? T, G = e.enableQueryBuilder ?? !1, k = e.enableFiltering ?? (T || F || se), N = e.enableSorting ?? !n, x = N && (e.enableMultiSort ?? !n), D = e.enableColumnResize ?? !n, ne = e.enableColumnReorder ?? !n, H = e.enableColumnPinning ?? !n, J = e.enableCenterDock ?? !n, a = e.enableColumnHide ?? !n, b = e.enableRowNumber ?? !n, g = e.enableSelection ?? !1, R = e.enableGrouping ?? !n, E = e.enableRowPinning ?? !n, L = e.enableCellEditing ?? !n, ie = e.enableSummary ?? (!n || e.showSummaryRow === !0), V = e.enableStatusBar ?? (!n || e.showStatusBar === !0), be = e.enableContextMenu ?? !n, ce = e.enableColumnChooser ?? !1, we = !1, oe = e.enableFullscreen ?? !1, ue = e.enableResponsiveLayout ?? !1, Ee = e.enableCrossHover ?? !1, ge = e.crossHoverHighlightHeader ?? !0, fe = e.enableCellSpan ?? !1, i = e.enableTreeData ?? !1, w = e.enableRowDetail ?? !1, m = W || G || x || ce || oe, f = !!(e.enableQuickSearch || e.enableQueryBuilder || e.enableMultiSort || e.enableColumnChooser || e.enableFullscreen), _ = (e.enableFloatingToolbar ?? (!n || f)) && m, z = k || W;
  return {
    variant: t,
    autoHeight: h,
    maxHeight: S,
    persistState: q,
    enableFiltering: k,
    showFilterRow: F,
    enableHeaderFilter: se,
    enableQuickSearch: W,
    enableQueryBuilder: G,
    enableSorting: N,
    enableMultiSort: x,
    enableColumnResize: D,
    enableColumnReorder: ne,
    enableColumnPinning: H,
    enableCenterDock: J,
    enableColumnHide: a,
    enableRowNumber: b,
    enableSelection: g,
    enableGrouping: R,
    enableRowPinning: E,
    enableCellEditing: L,
    enableSummary: ie,
    enableStatusBar: V,
    enableContextMenu: be,
    enableFloatingToolbar: _,
    enableColumnChooser: ce,
    enableSettings: we,
    enableFullscreen: oe,
    enableResponsiveLayout: ue,
    hasAnyToolbarAction: m,
    enableCrossHover: Ee,
    crossHoverHighlightHeader: ge,
    enableCellSpan: fe,
    enableTreeData: i,
    enableRowDetail: w,
    enableResponsiveFilter: z,
    enableResponsiveSortFilter: ue && (N || z),
    responsiveSortFilterLabel: N && z ? "Lọc & Sắp Xếp" : N ? "Sắp Xếp" : "Tìm & Lọc"
  };
}
function pt(e) {
  return !e || typeof Element > "u" ? null : e instanceof Element ? e : typeof Node < "u" && e instanceof Node ? e.parentElement : null;
}
function bt(e, t) {
  const n = pt(e);
  return !!(n && typeof n.closest == "function" && n.closest(t));
}
function Et(e) {
  return e === "auto" || e === "scroll" || e === "overlay";
}
function Lt(e, t, n) {
  if (n === 0) return !1;
  if (t === "y") {
    const S = Math.max(0, e.scrollHeight - e.clientHeight);
    return S <= 0.5 ? !1 : n > 0 ? e.scrollTop < S - 0.2 : e.scrollTop > 0.2;
  }
  const h = Math.max(0, e.scrollWidth - e.clientWidth);
  return h <= 0.5 ? !1 : n > 0 ? e.scrollLeft < h - 0.2 : e.scrollLeft > 0.2;
}
function Qn(e, t, n, h) {
  const S = pt(e);
  if (!S)
    return !1;
  const q = S.closest(h);
  if (!q)
    return !1;
  let T = S;
  for (; T; ) {
    const F = window.getComputedStyle(T);
    if (Math.abs(n) > 0 && Et(F.overflowY) && Lt(T, "y", n) || Math.abs(t) > 0 && Et(F.overflowX) && Lt(T, "x", t))
      return !0;
    if (T === q) break;
    T = T.parentElement;
  }
  return !1;
}
function Pt(e, t, n) {
  return e ? !bt(t, n) : !1;
}
function ke() {
  return typeof document > "u" ? !1 : !!document.querySelector(Te);
}
function jn({
  containerRef: e,
  scrollContainerRef: t,
  lastScrollTopRef: n,
  lastScrollLeftRef: h,
  activeContextMenu: S,
  isSortFilterModalOpen: q,
  activeEditingCell: T
}) {
  const [F, se] = Ge(!1), [W, G] = Ge(!1), k = M(null), N = M(!1), x = !!(S || q || F || W);
  Ne(() => {
    if (typeof document > "u" || !document.body) return;
    const a = () => {
      if (document.body.childElementCount <= 1) {
        G((L) => L && !1);
        return;
      }
      const g = e.current, R = document.body.children;
      let E = !1;
      for (let L = 0; L < R.length; L++) {
        const ie = R[L];
        if (!(g && ie.contains(g)) && (ie.matches(Te) || ie.querySelector(Te))) {
          E = !0;
          break;
        }
      }
      G((L) => L === E ? L : E);
    };
    a();
    const b = new MutationObserver(a);
    return b.observe(document.body, { childList: !0, subtree: !1 }), () => b.disconnect();
  }, [e]), Ne(() => {
    const a = t.current;
    x ? k.current || (k.current = {
      top: a ? a.scrollTop : n.current,
      left: a ? a.scrollLeft : h.current
    }) : k.current = null;
  }, [x, t, n, h]), Ne(() => {
    if (!x && !T) return;
    const a = (g) => {
      Qn(g.target, g.deltaX, g.deltaY, Te) || (g.preventDefault(), g.stopPropagation());
    }, b = (g) => {
      bt(g.target, Te) || (g.preventDefault(), g.stopPropagation());
    };
    return window.addEventListener("wheel", a, { passive: !1, capture: !0 }), window.addEventListener("touchmove", b, { passive: !1, capture: !0 }), () => {
      window.removeEventListener("wheel", a, !0), window.removeEventListener("touchmove", b, !0);
    };
  }, [x, T]), Ne(() => {
    const a = t.current;
    if (!a) return;
    const b = (g) => {
      bt(g.target, Te) || (S || T || x || ke()) && (g.preventDefault(), g.stopPropagation());
    };
    return a.addEventListener("wheel", b, { passive: !1 }), () => a.removeEventListener("wheel", b);
  }, [t, S, T, x]);
  const D = O(
    (a) => {
      const b = pt(a);
      return b ? !!(b.closest(Te) || F && b.closest(".agv-floating-toolbar")) : !1;
    },
    [F]
  ), ne = O(
    (a) => {
      !(x || ke()) || D(a.target) || (N.current = !0, a.preventDefault());
    },
    [x, D]
  ), H = O(
    (a) => {
      if (N.current && !D(a.target)) {
        N.current = !1, a.preventDefault(), a.stopPropagation();
        return;
      }
      const b = x || ke();
      Pt(b, a.target, Te) && !D(a.target) && (a.preventDefault(), a.stopPropagation());
    },
    [x, D]
  ), J = O(
    (a) => {
      const b = x || ke();
      Pt(b, a.target, Te) && !D(a.target) && (N.current = !0, a.preventDefault(), a.stopPropagation());
    },
    [x, D]
  );
  return {
    isToolbarPopupOpen: F,
    setIsToolbarPopupOpen: se,
    isPopupLockActive: x,
    popupLockedScrollPosRef: k,
    suppressNextGridClickRef: N,
    handleContainerMouseDownCapture: ne,
    handleContainerSuppressClickCapture: H,
    handleContainerContextMenuCapture: J
  };
}
const Ot = 24, It = 700, Ze = 2, Dt = 10;
function Xn({
  overlayHostRef: e,
  scrollContainerRef: t,
  alwaysShow: n = !1,
  isWindowScroll: h,
  verticalTrackTopInset: S,
  isLockedRef: q,
  totalContentHeight: T,
  totalGridWidth: F,
  viewportHeight: se
}) {
  const W = M(null), G = M(null), k = M(null), N = M(null), x = M(!1), D = M(!1), ne = M(!1), H = M(null), J = M(null), a = M({
    alwaysShow: n,
    isWindowScroll: h,
    verticalTrackTopInset: S,
    isLockedRef: q
  });
  a.current = {
    alwaysShow: n,
    isWindowScroll: h,
    verticalTrackTopInset: S,
    isLockedRef: q
  };
  const b = M({ trackLen: 0, thumbLen: 0, maxScroll: 0 }), g = M({ trackLen: 0, thumbLen: 0, maxScroll: 0 }), R = O(() => {
    const i = e.current;
    if (!i) return;
    const w = a.current.alwaysShow || x.current || D.current || ne.current;
    i.setAttribute("data-overlay-scroll-active", w ? "true" : "false");
  }, [e]), E = O(() => {
    J.current = null;
    const i = t.current;
    if (!i) return;
    const { isWindowScroll: w, verticalTrackTopInset: m } = a.current, f = Math.max(Ze, Math.round(m)), _ = i.clientHeight, z = i.scrollHeight, B = i.clientWidth, P = i.scrollWidth, X = Math.max(0, z - _), l = Math.max(0, P - B), $ = !w && X > 1, ee = l > 1, re = W.current, A = G.current;
    if (re && A)
      if (!$)
        re.style.display = "none", b.current = { trackLen: 0, thumbLen: 0, maxScroll: 0 };
      else {
        const Y = ee ? Dt : Ze, Z = Math.max(0, _ - f - Y), pe = Math.min(
          Z,
          Math.max(Ot, Math.round(_ / z * Z))
        ), _e = Math.max(0, Z - pe), Le = X > 0 ? Math.min(1, Math.max(0, i.scrollTop / X)) : 0, ve = Math.round(Le * _e);
        re.style.display = "block", re.style.top = `${f}px`, re.style.bottom = `${Y}px`, A.style.height = `${pe}px`, A.style.transform = `translate3d(0px, ${ve}px, 0px)`, b.current = { trackLen: Z, thumbLen: pe, maxScroll: X };
      }
    const C = k.current, le = N.current;
    if (C && le)
      if (!ee)
        C.style.display = "none", g.current = { trackLen: 0, thumbLen: 0, maxScroll: 0 };
      else {
        const Y = $ ? Dt : Ze;
        if (w) {
          const Ce = i.getBoundingClientRect(), te = typeof window < "u" ? window.innerHeight : 800;
          if (Ce.height <= f + 16 || Ce.bottom <= 44 || Ce.top >= te - 10) {
            C.style.display = "none", g.current = { trackLen: 0, thumbLen: 0, maxScroll: 0 };
            return;
          }
          const We = Math.max(f, Math.min(Ce.height - 8, te - Ce.top - 8));
          C.style.top = "0px", C.style.bottom = "auto", C.style.transform = `translate3d(0px, ${Math.round(We)}px, 0px)`;
        } else
          C.style.top = "", C.style.bottom = `${Ze}px`, C.style.transform = "";
        const Z = Math.max(0, B - Ze - Y), pe = Math.min(
          Z,
          Math.max(Ot, Math.round(B / P * Z))
        ), _e = Math.max(0, Z - pe), Le = l > 0 ? Math.min(1, Math.max(0, i.scrollLeft / l)) : 0, ve = Math.round(Le * _e);
        C.style.display = "block", C.style.right = `${Y}px`, le.style.width = `${pe}px`, le.style.transform = `translate3d(${ve}px, 0px, 0px)`, g.current = { trackLen: Z, thumbLen: pe, maxScroll: l };
      }
  }, [t]), L = O(() => {
    J.current !== null || typeof window > "u" || (J.current = window.requestAnimationFrame(E));
  }, [E]), ie = O(() => {
    if (E(), a.current.alwaysShow) {
      R();
      return;
    }
    D.current = !0, R(), H.current !== null && typeof window < "u" && window.clearTimeout(H.current), typeof window < "u" && (H.current = window.setTimeout(() => {
      D.current = !1, H.current = null, R();
    }, It));
  }, [E, R]);
  Ne(() => {
    R(), E();
  }, [
    n,
    h,
    S,
    T,
    F,
    se,
    R,
    E
  ]), Ne(() => {
    const i = t.current;
    if (!i) return;
    const w = typeof ResizeObserver < "u" ? new ResizeObserver(() => {
      L();
    }) : null;
    w?.observe(i);
    const m = () => {
      L();
    };
    return typeof window < "u" && (h && window.addEventListener("scroll", m, { passive: !0 }), window.addEventListener("resize", m, { passive: !0 })), () => {
      w?.disconnect(), typeof window < "u" && (window.removeEventListener("scroll", m), window.removeEventListener("resize", m));
    };
  }, [t, h, L]), Ne(() => () => {
    H.current !== null && typeof window < "u" && window.clearTimeout(H.current), J.current !== null && typeof window < "u" && window.cancelAnimationFrame(J.current);
  }, []);
  const V = () => a.current.isLockedRef.current || ke(), be = O(() => {
    x.current = !0, R(), L();
  }, [R, L]), ce = O(() => {
    x.current = !1, R();
  }, [R]), we = O(() => {
    a.current.alwaysShow || (D.current = !0, R(), H.current !== null && typeof window < "u" && window.clearTimeout(H.current), typeof window < "u" && (H.current = window.setTimeout(() => {
      D.current = !1, H.current = null, R();
    }, It)));
  }, [R]), oe = O(
    (i, w) => {
      if (w.button !== 0 || V()) return;
      const m = t.current;
      if (!m) return;
      const f = i === "vertical" ? b.current : g.current, _ = Math.max(0, f.trackLen - f.thumbLen);
      if (_ <= 0 || f.maxScroll <= 0) return;
      w.preventDefault(), w.stopPropagation();
      const z = i === "vertical" ? w.clientY : w.clientX, B = i === "vertical" ? m.scrollTop : m.scrollLeft, P = i === "vertical" ? G.current : N.current;
      ne.current = !0, P?.classList.add("is-dragging"), R();
      const X = ($) => {
        if (V()) return;
        const ee = (i === "vertical" ? $.clientY : $.clientX) - z, re = B + ee / _ * f.maxScroll, A = Math.max(0, Math.min(f.maxScroll, re));
        i === "vertical" ? m.scrollTop = A : m.scrollLeft = A, E();
      }, l = () => {
        ne.current = !1, P?.classList.remove("is-dragging"), R(), window.removeEventListener("pointermove", X), window.removeEventListener("pointerup", l), window.removeEventListener("pointercancel", l);
      };
      window.addEventListener("pointermove", X), window.addEventListener("pointerup", l), window.addEventListener("pointercancel", l);
    },
    [t, R, E]
  ), ue = O(
    (i) => oe("vertical", i),
    [oe]
  ), Ee = O(
    (i) => oe("horizontal", i),
    [oe]
  ), ge = O(
    (i) => {
      if (i.target !== W.current || V()) return;
      const w = t.current, m = W.current;
      if (!w || !m) return;
      const f = b.current, _ = Math.max(0, f.trackLen - f.thumbLen);
      if (_ <= 0 || f.maxScroll <= 0) return;
      i.preventDefault(), i.stopPropagation();
      const z = m.getBoundingClientRect(), B = i.clientY - z.top - f.thumbLen / 2, P = Math.max(0, Math.min(1, B / _));
      w.scrollTop = P * f.maxScroll, E();
    },
    [t, E]
  ), fe = O(
    (i) => {
      if (i.target !== k.current || V()) return;
      const w = t.current, m = k.current;
      if (!w || !m) return;
      const f = g.current, _ = Math.max(0, f.trackLen - f.thumbLen);
      if (_ <= 0 || f.maxScroll <= 0) return;
      i.preventDefault(), i.stopPropagation();
      const z = m.getBoundingClientRect(), B = i.clientX - z.left - f.thumbLen / 2, P = Math.max(0, Math.min(1, B / _));
      w.scrollLeft = P * f.maxScroll, E();
    },
    [t, E]
  );
  return {
    vBarRef: W,
    vThumbRef: G,
    hBarRef: k,
    hThumbRef: N,
    notifyScroll: ie,
    syncScrollbars: L,
    hostInteractionProps: {
      onMouseEnter: be,
      onMouseLeave: ce,
      onTouchStart: we
    },
    onVerticalTrackMouseDown: ge,
    onHorizontalTrackMouseDown: fe,
    onVerticalThumbPointerDown: ue,
    onHorizontalThumbPointerDown: Ee
  };
}
const Zn = Bt(
  () => import("./GridStatusBar-B6ZqS4S3.js").then((e) => ({ default: e.GridStatusBar }))
), Kn = Bt(
  () => import("./DataGridEnterprise-DyOy-gAv.js").then((e) => e.D).then((e) => ({ default: e.DataGridEnterprise }))
), Ht = [], Ke = Math.max(600, Ln * At);
function qn(e, t) {
  const n = e?._rowKey ?? e?.id ?? e?.Id ?? e?.ID ?? e?.key ?? e?.code;
  return n != null && String(n) !== "" ? String(n) : `row_${t}`;
}
function kt(e, t, n, h, S) {
  return n ? String(n(e, t)) : h ? h(e, t) : typeof S == "function" ? String(S(e, t)) : S !== void 0 && e && e[S] !== void 0 && e[S] !== null ? String(e[S]) : qn(e, t);
}
function Jn(e) {
  const t = String(e ?? ""), n = t.match(/(\d{1,2}):(\d{2})/);
  return n ? `${n[1].padStart(2, "0")}:${n[2]}` : t;
}
function eo(e) {
  if (!e || e.length === 0) return !1;
  for (let t = 0; t < e.length; t++) {
    const n = e[t];
    if (!(!n || typeof n != "object") && ("columns" in n && Array.isArray(n.columns) || n.colSpan || n.rowSpan || n.meta?.colSpan || n.meta?.rowSpan))
      return !0;
  }
  return !1;
}
function to(e, t) {
  if (t.enableFiltering || t.showFilterRow || t.enableHeaderFilter || t.enableQuickSearch || t.enableQueryBuilder || t.enableSorting || t.enableMultiSort || t.enableColumnResize || t.enableColumnReorder || t.enableColumnPinning || t.enableCenterDock || t.enableColumnHide || t.enableSelection || t.enableGrouping || t.enableRowPinning || t.enableCellEditing || t.enableResponsiveLayout || t.enableSummary || t.enableContextMenu || t.enableFloatingToolbar || t.enableColumnChooser || t.enableFullscreen || t.enableCrossHover || t.enableCellSpan || t.enableTreeData || t.enableRowDetail || e.gridRef || e.columnGroups && e.columnGroups.length > 0 || e.pinnedTopRowData && e.pinnedTopRowData.length > 0 || e.dynamicRowHeight || e.getRowHeight || e.spanMethod || e.treeData || e.detailRow || typeof e.toolbarSlot == "function")
    return !1;
  const n = e.columns ?? e.columnDefs;
  return !eo(n);
}
function no({
  props: e,
  features: t,
  effectiveEnableStatusBar: n,
  isAutoSized: h
}) {
  const {
    rows: S,
    data: q,
    rowData: T,
    columns: F,
    columnDefs: se,
    defaultColDef: W,
    getRowId: G,
    getRowKey: k,
    rowKey: N,
    getCellValue: x,
    renderCell: D,
    onRowClick: ne,
    pagination: H,
    page: J,
    defaultPage: a = 1,
    pageSize: b,
    defaultPageSize: g = mt,
    pageSizeOptions: R = Nn,
    serverTotal: E,
    onPageChange: L,
    onPageSizeChange: ie,
    surfaceTheme: V = Ft.LIGHT,
    title: be,
    description: ce,
    toolbarSlot: we,
    truncated: oe = !1,
    loading: ue = !1,
    refreshing: Ee = !1,
    error: ge = null,
    onRetry: fe,
    emptyText: i = "Không tìm thấy dữ liệu phù hợp.",
    height: w,
    style: m,
    className: f,
    overscanRows: _ = 5,
    scrollbarAlwaysOn: z = !1
  } = e, B = S ?? q ?? T ?? Ht, P = typeof H == "object" && H !== null ? H : void 0, X = P?.defaultPage ?? a, l = P?.defaultPageSize ?? g, $ = P?.page ?? J, ee = P?.pageSize ?? b, re = P?.pageSizeOptions ?? R, A = P?.serverTotal ?? P?.total ?? E, C = P?.onPageChange ?? L, le = P?.onPageSizeChange ?? ie, [Y, Z] = Ge(
    () => Math.max(1, X)
  ), [pe, _e] = Ge(
    () => l > 0 ? l : mt
  ), Le = !!(C || le), ve = ee !== void 0 && ee > 0 ? Math.floor(ee) : pe, Ce = $ !== void 0 && $ > 0 ? Math.floor($) : Y, te = B.length, We = Le ? A ?? te : te, Ve = n && !Le, lt = te > 0 ? Math.max(1, Math.ceil(te / ve)) : 1, Ye = Ve ? te > 0 ? Math.min(Math.max(1, Ce), lt) : 1 : Math.max(1, Ce), Pe = Ve ? (Ye - 1) * ve : 0, U = Ve ? Math.max(0, Math.min(te, Pe + ve) - Pe) : te, qe = n ? (Ye - 1) * ve : 0, de = At, Qe = Math.max(1, _), Be = U * de, [je, at] = Ge(null), [Se, Je] = Ge(Ke), et = M(null), tt = M(null), me = M(null), xe = M(0), ye = M(0), ze = M(0), Oe = M(null), $e = M(!1), K = t.autoHeight && t.maxHeight === void 0 && (m?.height === void 0 || m?.height === "auto") && m?.maxHeight === void 0, Ie = O(
    (r, s) => {
      if (U <= 0) return { start: 0, end: -1 };
      const p = Math.max(de, s || Ke), c = Math.max(0, Be - p), y = Math.max(0, Math.min(r, c)), u = Math.min(
        U - 1,
        Math.max(0, Math.floor(y / de))
      ), v = Math.min(
        U - 1,
        Math.max(u, Math.floor((y + p - 1) / de))
      ), j = Math.max(0, u - Qe), ae = Math.min(U - 1, Math.max(j, v + Qe));
      return { start: j, end: ae };
    },
    [U, Be, de, Qe]
  ), [nt, st] = Ge(
    () => Ie(0, Ke)
  ), it = M(nt), Me = O(
    (r, s) => {
      const p = Ie(r, s);
      (p.start !== it.current.start || p.end !== it.current.end) && (it.current = p, st(p));
    },
    [Ie]
  ), Xe = Fe(() => {
    const r = K ? xe.current : me.current?.scrollTop ?? xe.current;
    return Ie(r, Se);
  }, [nt, Ie, Se, K]), {
    isPopupLockActive: Ae,
    popupLockedScrollPosRef: vt,
    suppressNextGridClickRef: Jt,
    handleContainerMouseDownCapture: en,
    handleContainerSuppressClickCapture: St,
    handleContainerContextMenuCapture: tn
  } = jn({
    containerRef: et,
    scrollContainerRef: me,
    lastScrollTopRef: ye,
    lastScrollLeftRef: ze,
    activeContextMenu: null,
    isSortFilterModalOpen: !1,
    activeEditingCell: null
  }), wt = M(!1);
  wt.current = Ae, Tn(() => {
    const r = me.current;
    if (!r) return;
    if (K) {
      const c = () => {
        if (wt.current || ke()) return;
        r.style.setProperty("--agv-viewport-w", `${r.clientWidth || 600}px`);
        const y = r.getBoundingClientRect(), u = Math.max(0, -y.top), v = window.innerHeight || Ke;
        xe.current = u, ye.current = u, Je((j) => j === v ? j : v), Me(u, v);
      };
      return c(), window.addEventListener("scroll", c, { passive: !0 }), window.addEventListener("resize", c, { passive: !0 }), () => {
        window.removeEventListener("scroll", c), window.removeEventListener("resize", c);
      };
    }
    const s = () => {
      r.style.setProperty("--agv-viewport-w", `${r.clientWidth || 600}px`);
      const c = r.clientHeight || Ke, y = r.scrollTop || 0;
      xe.current = y, ye.current = y, Je((u) => u === c ? u : c), Me(y, c);
    };
    s();
    const p = new ResizeObserver(s);
    return p.observe(r), () => p.disconnect();
  }, [K, Me]), Ne(() => {
    const r = K ? xe.current : me.current?.scrollTop ?? xe.current;
    Me(r, Se);
  }, [Ie, Se, K, Me]), Ne(() => () => {
    Oe.current !== null && (window.clearTimeout(Oe.current), Oe.current = null);
  }, []);
  const Q = Fe(() => En(), [V]), { flatColumns: ot } = Fe(
    () => kn(F ?? se, W, {
      enableColumnPinning: !1,
      enableCenterDock: !1,
      surfaceTheme: V
    }),
    [F, se, W, V]
  ), Ct = Math.max(U, qe + U), xt = Fe(() => Pn(Ct), [Ct]), { basicCols: Rt, totalGridWidth: De } = Fe(() => {
    const r = ot.some((y) => y.isRowNumber || y.key === "col_stt"), s = t.enableRowNumber && !r ? [
      {
        key: "col_stt",
        title: "#",
        defaultWidth: 48,
        align: On.CENTER,
        dataType: He.SYSTEM,
        isRowNumber: !0
      },
      ...ot
    ] : ot, p = new Array(s.length);
    let c = 0;
    for (let y = 0; y < s.length; y++) {
      const u = s[y], v = !!(u.isRowNumber || u.key === "col_stt" || u.dataType === He.SYSTEM && u.title), j = v ? u.defaultWidth || xt || 48 : u.defaultWidth;
      c += j;
      const ae = u.dataType === He.NUMBER, he = u.dataType === He.TIME || u.editorType === ht.TIME, Tt = u.dataType === He.DATE || u.editorType === ht.DATE || u.editorType === ht.DATERANGE || !!u.isDateRange, wn = ae ? "agv-cell-number " : Tt || he ? "agv-cell-date " : u.className ? `${u.className} ` : "", ct = u.cellPadding ? u.cellPadding : u.dataType === He.SYSTEM || v ? "px-1" : "px-2.5", Cn = In(u.align), ut = `text-xs ${`${Q.borderBottom} ${Q.borderRight}`} shrink-0 overflow-hidden whitespace-nowrap min-h-[32px] max-h-[32px] leading-[32px] tabular-nums box-border ${wn}${Cn}`, dt = v || u.dataType === He.SYSTEM ? Q.sharedHeaderCellBg : "", xn = dt || Q.rowEvenBg, Rn = dt || Q.rowOddBg, yn = dt || Q.rowSelectedBg;
      p[y] = {
        col: u,
        key: u.key,
        width: j,
        isStt: v,
        isNumber: ae,
        isTime: he,
        isDateLike: Tt,
        hasCustomRender: !!u.renderCell,
        cellStyle: { width: `${j}px`, height: `${de}px` },
        classNameEven: `flex items-center ${ct} ${ut} ${xn}`,
        classNameOdd: `flex items-center ${ct} ${ut} ${Rn}`,
        classNameSelected: `flex items-center ${ct} ${ut} ${yn}`
      };
    }
    return { basicCols: p, totalGridWidth: c };
  }, [ot, t.enableRowNumber, xt, Q, de]), yt = M(!1);
  yt.current = Ae;
  const {
    vBarRef: nn,
    vThumbRef: on,
    hBarRef: rn,
    hThumbRef: ln,
    notifyScroll: Mt,
    hostInteractionProps: an,
    onVerticalTrackMouseDown: sn,
    onHorizontalTrackMouseDown: cn,
    onVerticalThumbPointerDown: un,
    onHorizontalThumbPointerDown: dn
  } = Xn({
    overlayHostRef: tt,
    scrollContainerRef: me,
    alwaysShow: z,
    isWindowScroll: K,
    verticalTrackTopInset: 36,
    isLockedRef: yt,
    totalContentHeight: Be,
    totalGridWidth: De,
    viewportHeight: Se
  }), mn = O(
    (r) => {
      const s = r.currentTarget;
      if (Ae || ke()) {
        const c = vt.current;
        K || (s.scrollTop = c ? c.top : ye.current), s.scrollLeft = c ? c.left : ze.current;
        return;
      }
      const p = s.scrollLeft;
      if (p !== ze.current && (ze.current = p), !K) {
        const c = s.scrollTop;
        c !== ye.current && (ye.current = c, xe.current = c, Me(c, Se));
      }
      Mt(), $e.current || ($e.current = !0, s.setAttribute("data-agv-scrolling", "true")), Oe.current !== null && window.clearTimeout(Oe.current), Oe.current = window.setTimeout(() => {
        $e.current && ($e.current = !1, me.current?.removeAttribute("data-agv-scrolling"));
      }, 110);
    },
    [
      Ae,
      vt,
      K,
      Me,
      Se,
      Mt
    ]
  ), hn = O(
    (r) => {
      if (Ae || ke()) return;
      const s = r.target;
      if (!s || s.closest(
        'button, a, input, select, textarea, [role="button"], [role="checkbox"], [contenteditable="true"]'
      ))
        return;
      const p = s.closest('[data-agv-row="true"]');
      if (!p) return;
      const c = Number(p.getAttribute("data-row-idx"));
      if (!Number.isFinite(c) || c < 0 || c >= U) return;
      const y = Pe + c, u = B[y];
      if (!u) return;
      const v = kt(u, y, G, k, N);
      at(v), ne?.(u, c);
    },
    [
      Ae,
      U,
      Pe,
      B,
      G,
      k,
      N,
      ne
    ]
  ), rt = O(() => {
    me.current && (me.current.scrollTop = 0), xe.current = 0, ye.current = 0, Me(0, Se);
  }, [Me, Se]), bn = O(
    (r) => {
      const s = Math.max(1, Math.floor(r));
      C ? C(s) : Z(s), rt();
    },
    [C, rt]
  ), gn = O(
    (r) => {
      const s = r > 0 ? Math.floor(r) : mt;
      le ? le(s) : (_e(s), C ? C(1) : Z(1)), rt();
    },
    [le, C, rt]
  ), fn = Fe(() => {
    if (U <= 0 || Xe.end < Xe.start)
      return Ht;
    const r = [];
    for (let s = Xe.start; s <= Xe.end; s++) {
      const p = Pe + s, c = B[p];
      c && r.push({
        rowIndex: s,
        row: c,
        key: kt(c, p, G, k, N)
      });
    }
    return r;
  }, [
    U,
    Xe,
    Pe,
    B,
    G,
    k,
    N
  ]), pn = !!(be || ce || we), vn = f ?? (h ? "border-0 rounded-none" : "flex-1 min-h-0 border-0 rounded-none"), Sn = t.autoHeight && t.maxHeight !== void 0 ? {
    maxHeight: typeof t.maxHeight == "number" ? `${t.maxHeight}px` : t.maxHeight
  } : {};
  return /* @__PURE__ */ Re("div", { className: h ? "w-full flex flex-col" : "flex-1 min-h-0 flex flex-col", children: [
    pn ? /* @__PURE__ */ Re("section", { className: "px-4 py-3 border-b border-border bg-card text-card-foreground shrink-0 space-y-2.5", children: [
      be || ce || A !== void 0 || oe ? /* @__PURE__ */ Re("div", { className: "flex flex-wrap items-baseline justify-between gap-2", children: [
        /* @__PURE__ */ Re("div", { className: "flex flex-wrap items-baseline gap-2.5", children: [
          be ? /* @__PURE__ */ d("h2", { className: "text-section-title font-semibold text-foreground tracking-tight", children: be }) : null,
          ce ? /* @__PURE__ */ d("span", { className: "text-caption text-muted-foreground", children: ce }) : null
        ] }),
        /* @__PURE__ */ d("div", { className: "flex items-center gap-3 text-caption text-muted-foreground", children: /* @__PURE__ */ Re("span", { children: [
          "Đã tải",
          " ",
          /* @__PURE__ */ d("strong", { className: "font-mono tabular-nums text-foreground", children: te.toLocaleString("vi-VN") }),
          A !== void 0 && A > te ? ` / ${A.toLocaleString("vi-VN")}` : "",
          " ",
          "dòng",
          oe ? " (giới hạn tải tối đa)" : ""
        ] }) })
      ] }) : null,
      we ? /* @__PURE__ */ d("div", { children: we }) : null
    ] }) : null,
    /* @__PURE__ */ Re(
      "div",
      {
        ref: et,
        "data-theme": V,
        className: `relative ${h ? "w-full" : "flex-1"} flex flex-col min-h-0 overflow-hidden agv-grid-root ${Gt(V)} ${vn}`,
        style: {
          "--agv-total-grid-w": `${De}px`,
          ...Sn,
          ...w !== void 0 ? { height: w, ...m } : m
        },
        onMouseDownCapture: en,
        onClickCapture: St,
        onDoubleClickCapture: St,
        onContextMenuCapture: tn,
        children: [
          /* @__PURE__ */ Re(
            "div",
            {
              ref: tt,
              ...an,
              "data-overlay-scroll-active": z ? "true" : "false",
              className: `agv-grid-scroll-overlay-host relative ${h ? "flex-initial min-h-0" : "flex-1 min-h-0"} flex flex-col`,
              children: [
                /* @__PURE__ */ Re(
                  "div",
                  {
                    ref: me,
                    onScroll: mn,
                    onClick: hn,
                    style: {
                      willChange: "scroll-position",
                      WebkitOverflowScrolling: "touch",
                      backgroundColor: "var(--agv-bg-root)"
                    },
                    className: `agv-scroll-viewport agv-scroll-overlay ${h ? "flex-initial min-h-0" : "flex-1"} overflow-auto relative ${Q.viewportBg}`,
                    children: [
                      /* @__PURE__ */ d(
                        "div",
                        {
                          "data-agv-header-root": "true",
                          "data-agv-fullwidth": "true",
                          style: {
                            width: `var(--agv-total-grid-w, ${De}px)`,
                            minWidth: `var(--agv-total-grid-w, ${De}px)`,
                            transform: "translateZ(0)",
                            height: "34px",
                            backgroundColor: "var(--agv-bg-header)",
                            color: "var(--agv-text-header, var(--agv-text-main))"
                          },
                          className: `sticky top-0 z-30 flex box-border ${Q.headerBg}`,
                          children: Rt.map((r) => {
                            const { col: s, key: p, width: c, isStt: y } = r, u = y || s.dataType === He.SYSTEM;
                            return /* @__PURE__ */ d(
                              "div",
                              {
                                "data-col-key": p,
                                style: {
                                  width: `${c}px`,
                                  minWidth: `${c}px`,
                                  maxWidth: `${c}px`,
                                  height: "34px",
                                  backgroundColor: "var(--agv-bg-header)",
                                  color: "var(--agv-text-header, var(--agv-text-main))"
                                },
                                className: `group/th flex flex-col justify-center items-center text-center ${u ? "px-0.5" : "px-1.5"} ${Q.systemBorderBottom} ${Q.sharedHeaderCellBg} ${Q.headerHoverBg} ${Q.headerBorderRight} relative z-10 shrink-0 select-none box-border cursor-default transition-colors`,
                                children: /* @__PURE__ */ d("div", { className: "inline-flex items-center justify-center gap-1 max-w-full px-0.5 min-w-0", children: s.renderHeader ? /* @__PURE__ */ d("div", { className: "inline-flex items-center justify-center max-w-full min-w-0 text-xs font-bold uppercase tracking-wider truncate text-center", children: s.renderHeader() }) : /* @__PURE__ */ d("span", { className: "text-xs font-bold uppercase tracking-wider truncate text-center", children: u && !s.title ? "" : s.title }) })
                              },
                              p
                            );
                          })
                        }
                      ),
                      /* @__PURE__ */ d(
                        "div",
                        {
                          className: "agv-rows-canvas",
                          "data-agv-fullwidth": "true",
                          style: {
                            height: `${Be}px`,
                            width: `var(--agv-total-grid-w, ${De}px)`,
                            minWidth: `var(--agv-total-grid-w, ${De}px)`,
                            position: "relative",
                            isolation: "isolate",
                            zIndex: 1
                          },
                          children: fn.map(({ rowIndex: r, row: s, key: p }) => {
                            const c = r % 2 === 0, y = je !== null && je === p, u = r * de;
                            return /* @__PURE__ */ d(
                              "div",
                              {
                                "data-agv-row": "true",
                                "data-agv-fullwidth": "true",
                                "data-row-key": p,
                                "data-row-idx": r,
                                "data-row-parity": c ? "even" : "odd",
                                "data-row-focused": y ? "true" : void 0,
                                style: {
                                  position: "absolute",
                                  top: 0,
                                  left: 0,
                                  width: `var(--agv-total-grid-w, ${De}px)`,
                                  minWidth: `var(--agv-total-grid-w, ${De}px)`,
                                  height: `${de}px`,
                                  transform: `translate3d(0px, ${u}px, 0px)`,
                                  willChange: "transform",
                                  backfaceVisibility: "hidden",
                                  contain: "strict"
                                },
                                className: `agv-grid-row flex items-center min-h-[32px] max-h-[32px] ${c ? Q.rowEvenBg : Q.rowOddBg} ${Q.defaultTextColor} cursor-default select-text box-border`,
                                children: Rt.map((v) => {
                                  const j = v.col;
                                  let ae = null;
                                  if (v.isStt && !v.hasCustomRender)
                                    ae = /* @__PURE__ */ d(
                                      "span",
                                      {
                                        className: "w-full text-center text-xs font-semibold tabular-nums",
                                        style: { color: "var(--agv-text-muted)" },
                                        children: qe + r + 1
                                      }
                                    );
                                  else if (v.hasCustomRender)
                                    ae = j.renderCell({
                                      column: j,
                                      row: s,
                                      rowIndex: r,
                                      isSelected: y,
                                      isChecked: !1
                                    });
                                  else if (D)
                                    ae = D({
                                      column: j,
                                      row: s,
                                      rowIndex: r,
                                      isSelected: y,
                                      isChecked: !1
                                    });
                                  else {
                                    const he = x ? x(s, v.key) : j.valueGetter ? j.valueGetter(s, r) : s?.[v.key];
                                    he != null && he !== "" && (v.isNumber ? ae = /* @__PURE__ */ d("span", { className: "truncate tabular-nums", children: Dn(he) || String(he) }) : v.isTime ? ae = /* @__PURE__ */ d("span", { className: "truncate tabular-nums", children: Jn(he) }) : v.isDateLike ? ae = /* @__PURE__ */ d("span", { className: "truncate tabular-nums", children: Hn(he, !!j.showTime) || String(he) }) : ae = /* @__PURE__ */ d("span", { className: "truncate", children: String(he) }));
                                  }
                                  return /* @__PURE__ */ d(
                                    "div",
                                    {
                                      "data-col-key": v.key,
                                      "data-cell-role": v.isStt ? "stt" : "data",
                                      style: v.cellStyle,
                                      className: y ? v.classNameSelected : c ? v.classNameEven : v.classNameOdd,
                                      children: ae
                                    },
                                    v.key
                                  );
                                })
                              },
                              p
                            );
                          })
                        }
                      ),
                      (ue || Ee) && U > 0 ? /* @__PURE__ */ d("div", { className: "sticky left-0 bottom-2 px-3 flex justify-end pointer-events-none z-20", children: /* @__PURE__ */ d(
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
                      !ue && ge && U > 0 ? /* @__PURE__ */ d("div", { className: "sticky left-0 bottom-2 px-3 z-20", children: /* @__PURE__ */ Re(
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
                            /* @__PURE__ */ d("span", { children: ge }),
                            fe ? /* @__PURE__ */ d(Nt, { variant: "default", size: "sm", onClick: fe, children: "Thử lại" }) : null
                          ]
                        }
                      ) }) : null,
                      U === 0 ? /* @__PURE__ */ d("div", { className: "sticky left-0 min-h-[200px] flex flex-col items-center justify-center gap-3 p-6 text-center select-none", children: ue ? /* @__PURE__ */ d("span", { className: "text-xs font-medium", style: { color: "var(--agv-text-muted)" }, children: "Đang tải dữ liệu..." }) : ge ? /* @__PURE__ */ Re(Mn, { children: [
                        /* @__PURE__ */ d("span", { className: "text-xs font-medium", style: { color: "var(--agv-danger)" }, children: ge }),
                        fe ? /* @__PURE__ */ d(Nt, { variant: "default", size: "sm", onClick: fe, children: "Thử lại" }) : null
                      ] }) : /* @__PURE__ */ d("span", { className: "text-xs font-medium", style: { color: "var(--agv-text-muted)" }, children: i }) }) : null
                    ]
                  }
                ),
                !K && /* @__PURE__ */ d(
                  "div",
                  {
                    ref: nn,
                    "aria-hidden": "true",
                    onMouseDown: sn,
                    className: "agv-overlay-scroll-bar is-vertical",
                    style: { display: "none" },
                    children: /* @__PURE__ */ d(
                      "div",
                      {
                        ref: on,
                        onPointerDown: un,
                        className: "agv-overlay-scroll-thumb is-vertical"
                      }
                    )
                  }
                ),
                /* @__PURE__ */ d(
                  "div",
                  {
                    ref: rn,
                    "aria-hidden": "true",
                    onMouseDown: cn,
                    className: "agv-overlay-scroll-bar is-horizontal",
                    style: { display: "none" },
                    children: /* @__PURE__ */ d(
                      "div",
                      {
                        ref: ln,
                        onPointerDown: dn,
                        className: "agv-overlay-scroll-thumb is-horizontal"
                      }
                    )
                  }
                )
              ]
            }
          ),
          n ? /* @__PURE__ */ d(_t, { fallback: null, children: /* @__PURE__ */ d(
            Zn,
            {
              page: Ye,
              pageSize: ve,
              totalItems: We,
              pageSizeOptions: re,
              onPageChange: bn,
              onPageSizeChange: gn,
              surfaceTheme: V,
              disabled: ue
            }
          ) }) : null,
          Ae ? /* @__PURE__ */ d(
            "div",
            {
              "aria-hidden": "true",
              className: "agv-grid-popup-shield absolute inset-0 bg-transparent pointer-events-auto select-none",
              style: { zIndex: 1220 },
              onMouseDown: (r) => {
                Jt.current = !0, r.preventDefault();
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
          ) : null
        ]
      }
    )
  ] });
}
function go(e) {
  const {
    pagination: t,
    enablePagination: n,
    enableStatusBar: h,
    enableCellSpan: S,
    spanMethod: q,
    enableTreeData: T,
    treeData: F,
    enableRowDetail: se,
    detailRow: W,
    modules: G,
    variant: k,
    autoHeight: N,
    maxHeight: x,
    persistState: D,
    enableFiltering: ne,
    showFilterRow: H,
    enableHeaderFilter: J,
    enableQuickSearch: a,
    enableQueryBuilder: b,
    enableSorting: g,
    enableMultiSort: R,
    enableColumnResize: E,
    enableColumnReorder: L,
    enableColumnPinning: ie,
    enableCenterDock: V,
    enableColumnHide: be,
    enableRowNumber: ce,
    enableSelection: we,
    enableGrouping: oe,
    enableRowPinning: ue,
    enableCellEditing: Ee,
    enableResponsiveLayout: ge,
    enableSummary: fe,
    showSummaryRow: i,
    showStatusBar: w,
    enableContextMenu: m,
    enableFloatingToolbar: f,
    enableColumnChooser: _,
    enableSettings: z,
    enableFullscreen: B,
    enableCrossHover: P,
    crossHoverHighlightHeader: X,
    height: l,
    style: $,
    surfaceTheme: ee = Ft.LIGHT
  } = e, A = t === !1 ? !1 : t === !0 || (typeof t == "object" && t !== null ? t : void 0) !== void 0 ? !0 : h, C = Fe(
    () => Yn({
      modules: G,
      variant: k,
      autoHeight: N,
      maxHeight: x,
      persistState: D,
      enableFiltering: ne,
      showFilterRow: H,
      enableHeaderFilter: J,
      enableQuickSearch: a,
      enableQueryBuilder: b,
      enableSorting: g,
      enableMultiSort: R,
      enableColumnResize: E,
      enableColumnReorder: L,
      enableColumnPinning: ie,
      enableCenterDock: V,
      enableColumnHide: be,
      enableRowNumber: ce,
      enableSelection: we,
      enableGrouping: oe,
      enableRowPinning: ue,
      enableCellEditing: Ee,
      enableResponsiveLayout: ge,
      enableSummary: fe,
      showSummaryRow: i,
      enableStatusBar: A,
      showStatusBar: w,
      enableContextMenu: m,
      enableFloatingToolbar: f,
      enableColumnChooser: _,
      enableFullscreen: B,
      enableCrossHover: P,
      crossHoverHighlightHeader: X,
      enableCellSpan: S ?? (q !== void 0 ? !0 : void 0),
      enableTreeData: T ?? (F !== void 0 ? !0 : void 0),
      enableRowDetail: se ?? (W !== void 0 ? !0 : void 0)
    }),
    [
      G,
      k,
      N,
      x,
      D,
      ne,
      H,
      J,
      a,
      b,
      g,
      R,
      E,
      L,
      ie,
      V,
      be,
      ce,
      we,
      oe,
      ue,
      Ee,
      ge,
      fe,
      i,
      A,
      w,
      m,
      f,
      _,
      z,
      B,
      P,
      X,
      S,
      q,
      T,
      F,
      se,
      W
    ]
  ), le = t === !1 ? !1 : n ?? C.enableStatusBar, Y = C.autoHeight && l === void 0;
  return to(e, C) ? /* @__PURE__ */ d(
    no,
    {
      props: e,
      features: C,
      effectiveEnableStatusBar: le,
      isAutoSized: Y
    }
  ) : /* @__PURE__ */ d(
    _t,
    {
      fallback: /* @__PURE__ */ d(
        "div",
        {
          "data-theme": ee,
          className: `${Y ? "w-full" : "flex-1 min-h-0"} flex flex-col agv-grid-root ${Gt(ee)}`,
          style: l !== void 0 ? { height: l, ...$ } : $
        }
      ),
      children: /* @__PURE__ */ d(Kn, { ...e })
    }
  );
}
export {
  ho as A,
  uo as B,
  An as C,
  go as D,
  Yt as F,
  o as G,
  ft as P,
  _n as Q,
  qt as R,
  Vt as S,
  Un as T,
  $n as a,
  Ut as b,
  Fn as c,
  $t as d,
  jt as e,
  Xt as f,
  Zt as g,
  zn as h,
  Kt as i,
  Gn as j,
  Ue as k,
  Wn as l,
  Qt as m,
  gt as n,
  Wt as o,
  Bn as p,
  mo as q,
  zt as r,
  bo as s,
  Yn as t,
  Vn as u,
  jn as v,
  Xn as w,
  ke as x
};
