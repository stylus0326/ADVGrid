import { jsx as c, jsxs as C } from "react/jsx-runtime";
import { useMemo as L, useState as S, useRef as h, useEffect as w, useCallback as T } from "react";
import { E as g, D, e as k, p as N, g as M, i as I } from "./gridFormatUtils-wCKPmlrt.js";
import { C as K, N as A, g as b, d as U } from "./AdvButton-Ck5SixaL.js";
import { A as _, a as $ } from "./AdvDatePicker-C4uBzJBl.js";
import { expandAllShortcuts as O, handleNumericKeyDown as j } from "./smartNumberUtils-CUYJXloj.js";
import { A as B, a as F } from "./AdvSearchLookUpEdit-C7bSfQ7n.js";
const E = ({ initialValue: e, align: u, isNumeric: l, onSave: i, onCancel: f }) => {
  const [m, o] = S(() => {
    if (l && e !== void 0 && e !== null && e !== "") {
      const a = N(e);
      return isNaN(a) ? String(e) : M(a);
    }
    return String(e ?? "");
  }), n = h(null);
  w(() => {
    n.current && (n.current.focus({ preventScroll: !0 }), n.current.select());
  }, []);
  const t = T(() => {
    if (l) {
      const a = m.trim();
      if (!a) {
        i("");
        return;
      }
      const y = O(a), v = N(y);
      isNaN(v) ? f() : i(v);
    } else
      i(m);
  }, [l, m, i, f]);
  return /* @__PURE__ */ c(
    "input",
    {
      ref: n,
      type: "text",
      value: m,
      onChange: (a) => o(a.target.value),
      onKeyDown: (a) => {
        a.key === "Enter" ? (a.preventDefault(), a.stopPropagation(), t()) : a.key === "Escape" ? (a.preventDefault(), a.stopPropagation(), f()) : a.key === "Tab" ? (a.preventDefault(), a.stopPropagation(), t()) : ["ArrowUp", "ArrowDown", "PageUp", "PageDown"].includes(a.key) ? (a.preventDefault(), a.stopPropagation()) : l && j(a);
      },
      onPaste: (a) => {
        if (l) {
          const y = a.clipboardData.getData("text"), v = O(y.trim()), x = N(v);
          isNaN(x) && a.preventDefault();
        }
      },
      onBlur: t,
      ...A,
      className: `${U} is-focused agv-incell-control w-full px-1.5 py-0 text-xs outline-none ${b()} text-[var(--agv-text-main)] font-sans tabular-nums ${I(
        u
      )}`
    }
  );
}, G = ({ initialValue: e, showTime: u, theme: l, min: i, max: f, onSave: m, onCancel: o }) => /* @__PURE__ */ c("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ c(
  $,
  {
    value: e,
    showTime: u,
    theme: l,
    min: i,
    max: f,
    showPreset: !1,
    defaultOpen: !0,
    autoFocus: !1,
    allowClear: !1,
    size: "sm",
    onClose: o,
    onChange: (n) => {
      m(k(n, u));
    },
    className: "w-full h-full agv-incell-datepicker"
  }
) }), H = ({ initialValue: e, theme: u, min: l, max: i, onSave: f, onCancel: m }) => {
  let o = "", n = "";
  if (e.includes("..")) {
    const t = e.split("..");
    o = t[0]?.trim() || "", n = t[1]?.trim() || "";
  } else if (e.includes(" - ")) {
    const t = e.split(" - ");
    o = t[0]?.trim() || "", n = t[1]?.trim() || "";
  } else
    o = e.trim();
  return /* @__PURE__ */ c("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ c(
    _,
    {
      from: o,
      to: n,
      min: l,
      max: i,
      placeholderFrom: "Ngày đi",
      placeholderTo: "Ngày về",
      theme: u,
      size: "sm",
      showPreset: !1,
      dualMonth: !1,
      defaultOpen: !0,
      autoFocus: !1,
      allowClear: !1,
      onClose: m,
      onChange: (t) => {
        if (t.from && t.to) {
          const p = k(t.from, !1), d = k(t.to, !1);
          f(`${p} - ${d}`);
        }
      },
      className: "w-full h-full agv-incell-datepicker"
    }
  ) });
}, z = ({ initialValue: e, onSave: u, onCancel: l }) => {
  const i = L(() => {
    const r = (e || "").match(/(\d{1,2}):(\d{2})/);
    return r ? {
      h: r[1].padStart(2, "0"),
      m: r[2].padStart(2, "0")
    } : { h: "00", m: "00" };
  }, [e]), [f, m] = S(i.h), [o, n] = S(i.m), t = h(null), p = h(null), d = h(null);
  w(() => {
    t.current?.focus({ preventScroll: !0 }), t.current?.select();
  }, []);
  const a = T(() => {
    let r = parseInt(f, 10);
    (isNaN(r) || r < 0) && (r = 0), r > 23 && (r = 23);
    let s = parseInt(o, 10);
    (isNaN(s) || s < 0) && (s = 0), s > 59 && (s = 59);
    const R = `${String(r).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    u(R);
  }, [f, o, u]);
  w(() => {
    const r = (s) => {
      d.current && !d.current.contains(s.target) && a();
    };
    return document.addEventListener("mousedown", r, !0), () => document.removeEventListener("mousedown", r, !0);
  }, [a]);
  const y = (r) => {
    const s = r.target.value.replace(/\D/g, "").slice(0, 2);
    m(s), (s.length === 2 || parseInt(s, 10) > 2) && (p.current?.focus({ preventScroll: !0 }), p.current?.select());
  }, v = (r) => {
    const s = r.target.value.replace(/\D/g, "").slice(0, 2);
    n(s);
  }, x = (r) => {
    if (r.key === "Enter")
      a();
    else if (r.key === "Escape")
      l();
    else if (r.key === "ArrowRight")
      p.current?.focus({ preventScroll: !0 }), p.current?.select();
    else if (r.key === "ArrowUp") {
      r.preventDefault();
      let s = (parseInt(f, 10) || 0) + 1;
      s > 23 && (s = 0), m(String(s).padStart(2, "0"));
    } else if (r.key === "ArrowDown") {
      r.preventDefault();
      let s = (parseInt(f, 10) || 0) - 1;
      s < 0 && (s = 23), m(String(s).padStart(2, "0"));
    }
  }, P = (r) => {
    if (r.key === "Enter")
      a();
    else if (r.key === "Escape")
      l();
    else if (r.key === "ArrowLeft")
      t.current?.focus({ preventScroll: !0 }), t.current?.select();
    else if (r.key === "ArrowUp") {
      r.preventDefault();
      let s = (parseInt(o, 10) || 0) + 1;
      s > 59 && (s = 0), n(String(s).padStart(2, "0"));
    } else if (r.key === "ArrowDown") {
      r.preventDefault();
      let s = (parseInt(o, 10) || 0) - 1;
      s < 0 && (s = 59), n(String(s).padStart(2, "0"));
    }
  };
  return /* @__PURE__ */ c(
    "div",
    {
      ref: d,
      className: "w-full h-full flex items-center justify-center",
      style: { minHeight: "28px" },
      children: /* @__PURE__ */ C(
        "div",
        {
          className: `${K} is-focused agv-incell-control w-full inline-flex items-center justify-center px-2 py-0 ${b()}`,
          children: [
            /* @__PURE__ */ c(
              "input",
              {
                ref: t,
                type: "text",
                maxLength: 2,
                value: f,
                onChange: y,
                onKeyDown: x,
                ...A,
                className: "w-5 text-center text-xs font-semibold bg-transparent outline-none border-none p-0",
                style: { color: "var(--agv-text-main)" }
              }
            ),
            /* @__PURE__ */ c("span", { className: "text-xs font-bold px-0.5 select-none", style: { color: "var(--agv-text-muted)" }, children: ":" }),
            /* @__PURE__ */ c(
              "input",
              {
                ref: p,
                type: "text",
                maxLength: 2,
                value: o,
                onChange: v,
                onKeyDown: P,
                ...A,
                className: "w-5 text-center text-xs font-semibold bg-transparent outline-none border-none p-0",
                style: { color: "var(--agv-text-main)" }
              }
            )
          ]
        }
      )
    }
  );
};
function V({
  column: e,
  row: u,
  rowIndex: l,
  initialValue: i,
  surfaceTheme: f,
  getColumnDateBounds: m,
  onCellChange: o,
  onEndEditCell: n
}) {
  if (e.editorType === g.DATERANGE || e.isDateRange) {
    const t = e.minDate && e.maxDate ? { min: e.minDate, max: e.maxDate } : m?.(e.key) || { min: "2017-01-01", max: "2027-12-31" };
    return /* @__PURE__ */ c(
      H,
      {
        initialValue: i,
        theme: f,
        min: t.min,
        max: t.max,
        onSave: (p) => {
          o?.(l, u, e.key, p), n?.();
        },
        onCancel: () => {
          n?.();
        }
      }
    );
  }
  if (e.editorType === g.TIME || e.dataType === D.TIME)
    return /* @__PURE__ */ c(
      z,
      {
        initialValue: i,
        onSave: (t) => {
          o?.(l, u, e.key, t), n?.();
        },
        onCancel: () => {
          n?.();
        }
      }
    );
  if (e.editorType === g.DATE || e.dataType === D.DATE) {
    const t = e.minDate && e.maxDate ? { min: e.minDate, max: e.maxDate } : m?.(e.key) || { min: "2017-01-01", max: "2027-12-31" };
    return /* @__PURE__ */ c(
      G,
      {
        initialValue: i,
        showTime: !!e.showTime,
        theme: f,
        min: t.min,
        max: t.max,
        onSave: (p) => {
          o?.(l, u, e.key, p), n?.();
        },
        onCancel: () => {
          n?.();
        }
      }
    );
  }
  if (e.editorType === g.COMBOBOX) {
    const t = e.editorOptions || {};
    return /* @__PURE__ */ c("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ c(
      B,
      {
        value: i,
        options: t.options || [],
        allowCustomInput: t.allowCustomInput !== void 0 ? t.allowCustomInput : !0,
        defaultOpen: !0,
        autoFocus: !0,
        theme: f,
        size: "sm",
        className: "w-full agv-incell-control",
        onChange: (p) => {
          o?.(l, u, e.key, p), n?.();
        },
        onClose: () => {
          n?.();
        }
      }
    ) });
  }
  if (e.editorType === g.LOOKUP) {
    const t = e.editorOptions || {};
    return /* @__PURE__ */ c("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ c(
      F,
      {
        value: i,
        valueMember: t.valueMember || "id",
        displayMember: t.displayMember || "id",
        dataSource: t.dataSource || [],
        columns: t.columns || [],
        multiSelect: !!t.multiSelect,
        defaultOpen: !0,
        theme: f,
        dropdownWidth: t.dropdownWidth || 420,
        className: "w-full agv-incell-control",
        onChange: (p) => {
          o?.(l, u, e.key, p), n?.();
        },
        onClose: () => {
          n?.();
        }
      }
    ) });
  }
  return /* @__PURE__ */ c(
    E,
    {
      initialValue: i,
      align: e.align,
      isNumeric: e.dataType === D.NUMBER || e.key.startsWith("col_m"),
      onSave: (t) => {
        o?.(l, u, e.key, t), n?.();
      },
      onCancel: () => {
        n?.();
      }
    }
  );
}
export {
  V as GridInCellEditor,
  V as default
};
