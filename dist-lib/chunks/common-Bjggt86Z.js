const n = {
  LIGHT: "light",
  DARK: "dark"
}, t = [
  {
    id: n.LIGHT,
    name: "Sáng",
    class: "",
    iconName: "Sun",
    iconColorClass: "text-status-warning-foreground"
  },
  {
    id: n.DARK,
    name: "Tối",
    class: "dark",
    iconName: "Moon",
    iconColorClass: "text-brand-gold-on-dark"
  }
], i = {
  [n.LIGHT]: "",
  [n.DARK]: "dark"
};
function r(a) {
  if (!a) return n.LIGHT;
  const e = a.trim().toLowerCase();
  return e === "dark" || e === "calibrated-dark" || e === "deep-dark" ? n.DARK : n.LIGHT;
}
function c(a, e = "") {
  return r(a) === n.DARK ? "dark" : "";
}
function s(a) {
  const e = r(a);
  return t.find((o) => o.id === e) || t[0];
}
function d(a) {
  return s(a).name;
}
function T(a) {
  return r(a) === n.DARK ? n.LIGHT : n.DARK;
}
export {
  t as R,
  n as S,
  i as T,
  T as a,
  s as b,
  d as c,
  c as g,
  r as n
};
