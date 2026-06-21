import React from 'react';
import { histogram } from './statlib.js';
import { fmt } from './riskmath.js';

/* Shared histogram with optional vertical marker lines (e.g. mean, VaR, ES). */
export function Histogram({ values, bins = 40, lines = [], width = 640, height = 220, fmtX = fmt }) {
  const { bars, min, max, w, maxCount } = histogram(values, bins);
  const m = { l: 8, r: 8, t: 10, b: 30 };
  const W = width, H = height;
  const px = v => m.l + ((v - min) / ((max - min) || 1)) * (W - m.l - m.r);
  const bw = (W - m.l - m.r) / bins;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} aria-label="distribution" style={{ width: '100%' }}>
      <rect x="0" y="0" width={W} height={H} fill="#fff" />
      {bars.map((c, i) => {
        const h = (c / (maxCount || 1)) * (H - m.t - m.b);
        return <rect key={i} x={m.l + i * bw + 0.5} y={H - m.b - h} width={Math.max(bw - 1, 1)} height={h} fill="#2c5750" opacity="0.55" />;
      })}
      {lines.map((ln, i) => {
        const x = px(ln.value);
        return (
          <g key={i}>
            <line x1={x} y1={m.t} x2={x} y2={H - m.b} stroke={ln.color || '#bf3d30'} strokeWidth="1.6" strokeDasharray={ln.dash || '0'} />
            <text x={x} y={m.t + 10 + (i % 2) * 13} fontFamily="Inter,sans-serif" fontSize="10" fill={ln.color || '#bf3d30'} textAnchor="middle">{ln.label}</text>
          </g>
        );
      })}
      <text x={m.l} y={H - 8} fontFamily="Inter,sans-serif" fontSize="10" fill="#857f72">{fmtX(min)}</text>
      <text x={W - m.r} y={H - 8} fontFamily="Inter,sans-serif" fontSize="10" fill="#857f72" textAnchor="end">{fmtX(max)}</text>
    </svg>
  );
}
