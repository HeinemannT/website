/* Tiny statistics engine for the Part 4 tools. Hand-rolled so the methods are
   visible and dependency-light. Browser runtime — Math.random is fine here. */

export function randn() { // standard normal via Box–Muller
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

export function lognormal(median, sigma) { return median * Math.exp(sigma * randn()); }

export function poisson(lambda) { // Knuth
  const L = Math.exp(-lambda);
  let k = 0, p = 1;
  do { k++; p *= Math.random(); } while (p > L);
  return k - 1;
}

export function triangular(min, mode, max) {
  const u = Math.random();
  const c = (mode - min) / (max - min || 1);
  return u < c
    ? min + Math.sqrt(u * (max - min) * (mode - min))
    : max - Math.sqrt((1 - u) * (max - min) * (max - mode));
}

export function studentT(nu) { // heavy-tailed: normal / sqrt(chi2/nu), approx via sum
  // simple approximation: scale a normal by an inverse-gamma-ish factor
  let chi = 0;
  for (let i = 0; i < nu; i++) { const z = randn(); chi += z * z; }
  return randn() / Math.sqrt(chi / nu);
}

export function mean(a) { return a.length ? a.reduce((s, x) => s + x, 0) / a.length : 0; }
export function std(a) { const m = mean(a); return Math.sqrt(mean(a.map(x => (x - m) ** 2))); }

export function percentile(sorted, q) {
  if (!sorted.length) return 0;
  const idx = (sorted.length - 1) * q;
  const lo = Math.floor(idx), hi = Math.ceil(idx);
  return lo === hi ? sorted[lo] : sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo);
}

export function histogram(values, bins) {
  if (!values.length) return { bars: [], min: 0, max: 1, w: 1, maxCount: 1 };
  const min = Math.min(...values), max = Math.max(...values);
  const w = (max - min) / bins || 1;
  const h = new Array(bins).fill(0);
  values.forEach(v => { let b = Math.floor((v - min) / w); if (b >= bins) b = bins - 1; if (b < 0) b = 0; h[b]++; });
  return { bars: h, min, max, w, maxCount: Math.max(...h) };
}
