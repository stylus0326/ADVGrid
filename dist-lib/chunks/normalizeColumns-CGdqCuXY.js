import { D as R, c as f, P as h } from "./gridFormatUtils-wCKPmlrt.js";
import { S as E } from "./common-Bjggt86Z.js";
function I() {
  return {
    accessor(n, l) {
      return typeof n == "function" ? {
        ...l,
        accessorFn: n
      } : {
        ...l,
        id: l?.id ?? n,
        accessorKey: n
      };
    },
    display(n) {
      return { ...n };
    },
    group(n) {
      return { ...n };
    }
  };
}
function x(n) {
  return !!(n && typeof n == "object" && "columns" in n && Array.isArray(n.columns));
}
function A(n, l) {
  if (n == null) return;
  if (Object.prototype.hasOwnProperty.call(n, l) || !l.includes("."))
    return n[l];
  const i = l.split(".");
  let u = n;
  for (let d = 0; d < i.length; d++) {
    if (u == null) return;
    u = u[i[d]];
  }
  return u;
}
function z(n, l, i, u, d) {
  const e = n, m = e.accessorKey, p = String(e.key ?? e.id ?? m ?? `col_${l}`), t = i?.meta || e.meta ? { ...i?.meta ?? {}, ...e.meta ?? {} } : void 0, s = e.header ?? i?.header, r = typeof s == "string" ? s : typeof e.title == "string" ? e.title : p, c = e.accessorFn ? (o, b) => e.accessorFn(o, b) : m ? m.includes(".") ? (o) => A(o, m) : (o) => o ? o[m] : void 0 : e.valueGetter ? e.valueGetter : (o) => o ? o[p] : void 0, a = {
    ...e,
    key: p,
    title: r,
    defaultWidth: e.size ?? e.defaultWidth ?? i?.size ?? 150,
    minWidth: e.minSize ?? e.minWidth ?? i?.minSize,
    maxWidth: e.maxSize ?? e.maxWidth ?? i?.maxSize,
    align: t?.align ?? e.align,
    dataType: t?.dataType ?? e.dataType ?? R.TEXT,
    className: t?.className ?? e.className,
    cellPadding: t?.cellPadding ?? e.cellPadding,
    editorType: t?.editorType ?? e.editorType,
    editorOptions: t?.editorOptions ?? e.editorOptions,
    showTime: t?.showTime ?? e.showTime,
    isDateRange: t?.isDateRange ?? e.isDateRange,
    minDate: t?.minDate ?? e.minDate,
    maxDate: t?.maxDate ?? e.maxDate,
    isFormula: t?.isFormula ?? e.isFormula,
    isChart: t?.isChart ?? e.isChart,
    wrapText: t?.wrapText ?? e.wrapText ?? i?.wrapText,
    colSpan: e.colSpan ?? t?.colSpan ?? i?.colSpan,
    rowSpan: e.rowSpan ?? t?.rowSpan ?? i?.rowSpan,
    disableHeaderContextMenu: t?.disableHeaderContextMenu ?? e.disableHeaderContextMenu,
    disableContextMenu: t?.disableContextMenu ?? e.disableContextMenu,
    sortable: e.enableSorting ?? e.sortable ?? i?.enableSorting,
    filterable: e.enableColumnFilter ?? e.filterable ?? i?.enableColumnFilter,
    enableGlobalFilter: e.enableGlobalFilter ?? i?.enableGlobalFilter,
    resizable: e.enableResizing ?? e.resizable ?? i?.enableResizing,
    pinnable: e.enablePinning ?? e.pinnable ?? i?.enablePinning,
    hideable: e.enableHiding ?? e.hideable ?? i?.enableHiding,
    groupable: e.enableGrouping ?? e.groupable ?? i?.enableGrouping,
    editable: e.enableEditing ?? e.editable ?? i?.enableEditing,
    meta: t,
    valueGetter: c
  };
  typeof s == "function" && !a.renderHeader && (a.renderHeader = () => s({ column: a }));
  const g = e.cell ?? i?.cell;
  !e.renderCell && g && (a.renderCell = (o) => {
    const b = o.row, w = b?._baseRecord ?? o.row, T = typeof b?.originalIndex == "number" ? b.originalIndex : o.rowIndex, S = b?._rowKey ?? b?.id ?? T, P = typeof S == "string" ? S : String(S), G = () => (a.valueGetter ?? c)(w, T);
    return g({
      getValue: G,
      renderValue: () => {
        const v = G();
        return v === void 0 ? null : v;
      },
      row: {
        original: w,
        index: T,
        id: P
      },
      column: a,
      isSelected: o.isSelected,
      isChecked: o.isChecked,
      isResponsive: o.isResponsive
    });
  }), t?.bindColumnRuntime && Object.assign(
    a,
    t.bindColumnRuntime({
      column: a,
      formulaMode: d.formulaMode ?? f.MAX,
      surfaceTheme: d.surfaceTheme ?? E.LIGHT
    })
  );
  const y = e.pinned;
  return y && y !== h.NONE && (y === h.CENTER ? d.enableCenterDock !== !1 && (u[p] = h.CENTER) : (y === h.LEFT || y === h.RIGHT) && d.enableColumnPinning !== !1 && (u[p] = y)), a;
}
function H(n, l, i = {}) {
  if (!n || n.length === 0)
    return { flatColumns: [], columnDefinedPins: {} };
  const u = [], d = {}, m = n.some((s) => x(s)) ? [] : void 0;
  let p = 0;
  const t = (s) => {
    const r = [];
    for (let c = 0; c < s.length; c++) {
      const a = s[c];
      if (x(a))
        r.push(...t(a.columns));
      else {
        const g = z(
          a,
          p++,
          l,
          d,
          i
        );
        u.push(g), r.push(g.key);
      }
    }
    return r;
  };
  for (let s = 0; s < n.length; s++) {
    const r = n[s];
    if (x(r)) {
      const c = t(r.columns);
      if (m && c.length > 0) {
        const a = r.id ?? `grp_${s}`, g = typeof r.header == "string" ? r.header : r.title ?? a;
        m.push({
          id: a,
          title: g,
          isStandalone: !1,
          keys: c,
          isToggleable: r.isToggleable,
          isCollapsed: r.isCollapsed,
          isAtomic: r.isAtomic
        });
      }
    } else {
      const c = z(
        r,
        p++,
        l,
        d,
        i
      );
      u.push(c), m && m.push({
        id: c.key,
        title: c.title,
        isStandalone: !0,
        keys: [c.key]
      });
    }
  }
  return {
    flatColumns: u,
    columnGroups: m,
    columnDefinedPins: d
  };
}
export {
  I as c,
  H as n
};
