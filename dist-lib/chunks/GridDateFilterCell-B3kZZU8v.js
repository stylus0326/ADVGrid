import { jsx as f } from "react/jsx-runtime";
import { A as w, a as D } from "./AdvDatePicker-DZSz8jci.js";
import { m as k } from "./gridFormatUtils-wCKPmlrt.js";
const T = ({
  col: e,
  inputVal: i,
  currentOp: d,
  placeholderText: h,
  surfaceTheme: n,
  getColumnDateBounds: x,
  onCommitValue: l
}) => {
  const r = e.minDate && e.maxDate ? { min: e.minDate, max: e.maxDate } : x?.(e.key) || { min: "2017-01-01", max: "2027-12-31" };
  if (e.isDateRange || k(d)) {
    let m = "", t = "";
    if (i.includes("..")) {
      const s = i.split("..");
      m = s[0]?.trim() || "", t = s[1]?.trim() || "";
    } else if (i.includes(" - ")) {
      const s = i.split(" - ");
      m = s[0]?.trim() || "", t = s[1]?.trim() || "";
    } else i.trim() && (m = i.trim(), t = i.trim());
    return /* @__PURE__ */ f("div", { className: "w-full h-full agv-filter-datepicker flex items-center", children: /* @__PURE__ */ f(
      w,
      {
        from: m,
        to: t,
        onChange: (s) => {
          const a = s.from || "", o = s.to || "", c = a && o ? `${a}..${o}` : a ? `${a}..` : o ? `..${o}` : "";
          l(e.key, c);
        },
        min: r.min,
        max: r.max,
        placeholderFrom: e.isDateRange ? "Ngày đi" : "Từ",
        placeholderTo: e.isDateRange ? "Ngày về" : "Đến",
        theme: n,
        size: "xs",
        showPreset: !0,
        dualMonth: !1,
        showTime: !!e.showTime
      }
    ) });
  }
  return /* @__PURE__ */ f("div", { className: "w-full h-full agv-filter-datepicker flex items-center", children: /* @__PURE__ */ f(
    D,
    {
      value: i,
      onChange: (m, t) => {
        t && t.from && t.to && t.from !== t.to ? l(e.key, `${t.from}..${t.to}`) : l(e.key, m);
      },
      min: r.min,
      max: r.max,
      placeholder: h,
      showTime: !!e.showTime,
      theme: n,
      showPreset: !0,
      size: "xs",
      className: "w-full h-full"
    }
  ) });
};
export {
  T as GridDateFilterCell
};
