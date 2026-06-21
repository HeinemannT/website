/* Shared risk-evaluation math, used by the heat map, the iso-contour figure,
   and (later) the portfolio aggregation view. Pure functions, no React. */

export const PROB_BINS = [{ max: 5, bin: 1 }, { max: 25, bin: 2 }, { max: 50, bin: 3 }, { max: 80, bin: 4 }, { max: Infinity, bin: 5 }];
export const IMP_BINS = [{ max: 50000, bin: 1 }, { max: 250000, bin: 2 }, { max: 1000000, bin: 3 }, { max: 3000000, bin: 4 }, { max: Infinity, bin: 5 }];
export const HEATCOLORS = { 1: '#3a875b', 2: '#8aae45', 3: '#e6c245', 4: '#dd8a36', 5: '#bf3d30' };

export function probBin(p) { for (const b of PROB_BINS) if (p <= b.max) return b.bin; return 5; }
export function impBin(i) { for (const b of IMP_BINS) if (i <= b.max) return b.bin; return 5; }
export function bandFor(heat, combine) {
  if (combine === 'sum') return heat <= 4 ? 1 : heat <= 6 ? 2 : heat <= 7 ? 3 : heat <= 8 ? 4 : 5;
  return heat <= 4 ? 1 : heat <= 9 ? 2 : heat <= 12 ? 3 : heat <= 16 ? 4 : 5;
}

export const SEED_REGISTER = [
  { name: 'Ransomware outage', p: 10, i: 5000000 },
  { name: 'Supplier price spike', p: 70, i: 400000 },
  { name: 'Key-person departure', p: 35, i: 600000 },
  { name: 'Regulatory fine (data)', p: 15, i: 2200000 },
  { name: 'Warehouse fire', p: 3, i: 4000000 },
  { name: 'Customer-credit default', p: 55, i: 300000 },
];

function rankBy(rows, key, out) {
  const sorted = [...rows].sort((a, b) => b[key] - a[key]);
  sorted.forEach((r, n) => { r[out] = n + 1; });
}

export function compute(risks, combine) {
  const rows = risks.map((r, idx) => {
    const pb = probBin(r.p), ib = impBin(r.i);
    const heat = combine === 'sum' ? pb + ib : pb * ib;
    const el = (r.p / 100) * r.i;
    return { idx, name: r.name, p: r.p, i: r.i, pb, ib, heat, el, band: bandFor(heat, combine) };
  });
  rankBy(rows, 'heat', 'heatRank');
  rankBy(rows, 'el', 'elRank');
  rows.forEach(a => {
    a.flag = false; a.partner = null; let best = -Infinity;
    rows.forEach(b => {
      if (a === b) return;
      if (a.heat > b.heat && a.el < b.el) { a.flag = true; if (b.el > best) { best = b.el; a.partner = b.name; } }
    });
  });
  return rows;
}

export function fmt(n) {
  if (n >= 1e6) return '€' + (n / 1e6).toFixed(n >= 1e7 ? 1 : 2) + 'M';
  if (n >= 1e3) return '€' + (n / 1e3).toFixed(0) + 'k';
  return '€' + Math.round(n);
}
