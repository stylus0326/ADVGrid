// TEMPORARY 12-MONTH MOCK DATA FOR FEATURE TESTING — XÓA FILE NÀY KHI CÓ API THẬT

function hashSeed(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function nextUnitRandom(state: number): [number, number] {
  const next = (Math.imul(state, 1664525) + 1013904223) >>> 0;
  return [next, next / 4294967296];
}

export function buildTempTwelveMonthMonths(
  seedKey: string,
  balanceHint?: number | null
): number[] {
  let state = hashSeed(seedKey || 'default_partner');

  const rawAbs =
    balanceHint !== null && balanceHint !== undefined ? Math.abs(Number(balanceHint)) : NaN;
  const [, baseRand] = nextUnitRandom(state);
  const baseLevel =
    Number.isFinite(rawAbs) && rawAbs >= 5_000_000
      ? Math.min(480_000_000, Math.max(25_000_000, rawAbs * 0.65))
      : 35_000_000 + baseRand * 165_000_000;

  let peakMonth = 0;
  [state, peakMonth] = (() => {
    const [ns, u] = nextUnitRandom(state);
    return [ns, Math.floor(u * 12)];
  })();

  let dipMonth = 0;
  [state, dipMonth] = (() => {
    const [ns, u] = nextUnitRandom(state);
    let d = Math.floor(u * 12);
    if (d === peakMonth) d = (d + 5) % 12;
    return [ns, d];
  })();

  const months12: number[] = [];
  for (let m = 0; m < 12; m++) {
    let u1 = 0;
    [state, u1] = nextUnitRandom(state);
    const wave = Math.sin(((m - peakMonth) / 12) * Math.PI * 2) * 0.24;
    let factor = 0.85 + wave + u1 * 0.38;
    if (m === peakMonth) factor += 0.28;
    if (m === dipMonth) factor = Math.max(0.28, factor - 0.34);

    months12.push(
      Math.max(5_000_000, Math.round((baseLevel * factor) / 100_000) * 100_000)
    );
  }

  return months12;
}
