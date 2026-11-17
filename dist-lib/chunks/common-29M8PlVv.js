const a = {
  LIGHT: "light",
  DARK: "dark",
  LIQUID_LIGHT: "liquid-light",
  LIQUID_DARK: "liquid-dark"
}, t = [
  {
    id: a.LIGHT,
    name: "Sáng",
    class: "",
    iconName: "Sun",
    iconColorClass: "text-status-warning-foreground"
  },
  {
    id: a.DARK,
    name: "Tối",
    class: "dark",
    iconName: "Moon",
    iconColorClass: "text-brand-gold-on-dark"
  }
], l = {
  [a.LIGHT]: "",
  [a.DARK]: "dark",
  [a.LIQUID_LIGHT]: "agv-liquid",
  [a.LIQUID_DARK]: "dark agv-liquid"
};
function s(i) {
  if (!i) return !1;
  const n = i.trim().toLowerCase();
  return n === "liquid" || n === "liquid-light" || n === "liquid-dark" || n === "glass";
}
function e(i) {
  if (!i) return a.LIGHT;
  const n = i.trim().toLowerCase();
  return n === "dark" || n === "calibrated-dark" || n === "deep-dark" || n === "liquid-dark" ? a.DARK : a.LIGHT;
}
function u(i, n = "") {
  const r = e(i) === a.DARK, o = s(i);
  return [r ? "dark" : "", o ? "agv-liquid" : ""].filter(Boolean).join(" ");
}
function d(i) {
  const n = e(i);
  return t.find((r) => r.id === n) || t[0];
}
function c(i) {
  return d(i).name;
}
function T(i) {
  return e(i) === a.DARK ? a.LIGHT : a.DARK;
}
export {
  t as R,
  a as S,
  l as T,
  T as a,
  d as b,
  c,
  u as g,
  s as i,
  e as n
};
