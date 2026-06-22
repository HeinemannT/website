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

// The carried case — Meridian Industries' starter register (see the case bible).
// Tools read name/p/i; the richer fields drive the register intake and family lenses.
export const SEED_REGISTER = [
  { name: 'Resin supplier failure', cause: 'sole-source supplier insolvency', event: 'packaging line halts', consequence: 'cannot ship for ~2 weeks', owner: 'COO', category: 'Operational', p: 8, i: 9000000 },
  { name: 'Ransomware on ERP', cause: 'phishing intrusion', event: 'order/dispatch systems encrypted', consequence: 'fulfilment down for days', owner: 'CISO', category: 'Technology & cyber', p: 12, i: 6000000 },
  { name: 'Product contamination / recall', cause: 'process control failure', event: 'unsafe product reaches shelves', consequence: 'recall + regulatory action', owner: 'Quality Director', category: 'Compliance & conduct', p: 4, i: 18000000 },
  { name: 'Loss of top retailer contract', cause: 'price/ESG dispute', event: 'the 18%-of-revenue retailer exits', consequence: 'major revenue shortfall', owner: 'CEO', category: 'Strategic', p: 6, i: 40000000 },
  { name: 'Commodity price spike', cause: 'grain/cocoa market move', event: 'input costs jump', consequence: 'margin squeezed', owner: 'Treasurer', category: 'Financial', p: 60, i: 12000000 },
  { name: 'Distributor credit default', cause: 'a large distributor fails', event: 'receivables unpaid', consequence: 'write-off', owner: 'Treasurer', category: 'Financial', p: 20, i: 4000000 },
  { name: 'Flood at SE-Asia plant', cause: 'river flooding', event: 'plant output lost', consequence: 'supply gap + rebuild cost', owner: 'COO', category: 'Operational', p: 5, i: 15000000 },
  { name: 'Bribery by overseas agent', cause: 'weak third-party controls', event: 'corrupt payment by an agent', consequence: 'fine + market ban', owner: 'General Counsel', category: 'Compliance & conduct', p: 7, i: 8000000 },
  { name: 'Adverse FX move', cause: 'EUR vs USD/commodity currencies', event: 'unhedged exposure moves', consequence: 'higher input costs', owner: 'Treasurer', category: 'Financial', p: 55, i: 7000000 },
  { name: 'Demand-forecast model error', cause: 'model misspecification', event: 'forecast badly wrong', consequence: 'overstock write-offs / stockouts', owner: 'Head of Planning', category: 'Model risk', p: 35, i: 3000000 },
  { name: 'Covenant breach in a downturn', cause: 'recession cuts EBITDA', event: 'net debt/EBITDA passes 3.0×', consequence: 'facility at risk', owner: 'CFO', category: 'Financial', p: 10, i: 25000000 },
  { name: 'Private-label erosion', cause: 'retailer own-brands gain', event: 'core brand share falls', consequence: 'volume + margin loss', owner: 'CMO', category: 'Strategic', p: 50, i: 10000000 },
  { name: 'Packaging/carbon regulation', cause: 'new rules + retailer ESG demands', event: 'reformulation required', consequence: 'compliance + capex cost', owner: 'Sustainability Lead', category: 'Climate & ESG', p: 45, i: 6000000 },
  { name: 'Customer-data breach', cause: 'web vulnerability', event: 'customer data exposed', consequence: 'GDPR penalty + trust hit', owner: 'CISO', category: 'Technology & cyber', p: 9, i: 5000000 },
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
