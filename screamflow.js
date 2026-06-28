"use strict";
// Stripped-down "screamflow" finale, adapted from the tixyvoid draft.
// Kept: the swirl stir + the screamflow expression. Removed: all UI/text,
// the camera rotation (yaw/pitch are fixed), and the scroll-hijacking wheel
// zoom, so the page scrolls normally over it. Pauses when off-screen.
(function () {
  const canvas = document.getElementById("rot");
  if (!canvas) return;
  const ctx = canvas.getContext("2d", { alpha: false });
  const reduce = matchMedia("(prefers-reduced-motion:reduce)").matches;
  const TAU = 6.28318530718;

  // ---------- value noise ----------
  function hash(x, y, z) {
    let n = (x | 0) * 374761393 + (y | 0) * 668265263 + (z | 0) * 1274126177;
    n = (n ^ (n >>> 13)) * 1274126177; n = (n ^ (n >>> 16)) >>> 0; return n / 4294967295;
  }
  const lerp = (a, b, t) => a + (b - a) * t, smooth = t => t * t * (3 - 2 * t);
  function noise3(x, y, z) {
    const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
    const xf = smooth(x - xi), yf = smooth(y - yi), zf = smooth(z - zi);
    const c = (dx, dy, dz) => hash(xi + dx, yi + dy, zi + dz);
    const x00 = lerp(c(0, 0, 0), c(1, 0, 0), xf), x10 = lerp(c(0, 1, 0), c(1, 1, 0), xf);
    const x01 = lerp(c(0, 0, 1), c(1, 0, 1), xf), x11 = lerp(c(0, 1, 1), c(1, 1, 1), xf);
    return lerp(lerp(x00, x10, yf), lerp(x01, x11, yf), zf);
  }
  const nfn = (p, q, s) => noise3((p || 0) * 1.7, (q || 0) * 1.7, (s || 0) * 1.7) * 2 - 1;
  function gauss() { let u = 0, v = 0; while (!u) u = Math.random(); while (!v) v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(TAU * v); }

  // ---------- rot palette (oil-slick decay) ----------
  const ROT = [
    [12, 18, 24], [20, 52, 60], [46, 98, 104], [78, 46, 92],
    [150, 72, 46], [122, 138, 62], [206, 184, 96], [96, 128, 150]
  ];
  const BONE = [232, 224, 207];
  function ramp(x) {
    x = x - Math.floor(x); const n = ROT.length; const f = x * n; let i = Math.floor(f); const fr = f - i;
    const a = ROT[i % n], b = ROT[(i + 1) % n];
    return [a[0] + (b[0] - a[0]) * fr, a[1] + (b[1] - a[1]) * fr, a[2] + (b[2] - a[2]) * fr];
  }

  // ---------- the one expression: "screamflow" ----------
  const fn = (t, i, x, y, z, r, a, m) =>
    Math.sin(t * 3 + i * 0.02) * Math.cos(r * 18 - t * 5) + m * 2;

  // ---------- the field ----------
  const ARMS = 2, SPIRAL = 4.7;
  let N = 3600, pts = [];
  function countForDevice() {
    let n = Math.round(W * H / 520);
    n = Math.max(1500, Math.min(4200, n));
    if (/Mobi|Android/i.test(navigator.userAgent)) n = Math.min(n, 1900);
    return n;
  }
  function spawn(p) {
    const rr = 0.12 + Math.pow(Math.random(), 0.7) * 1.18;
    const arm = (Math.random() * ARMS) | 0;
    const ang = rr * SPIRAL + arm * (TAU / ARMS) + gauss() * (0.22 + rr * 0.5);
    p.x = Math.cos(ang) * rr; p.z = Math.sin(ang) * rr;
    p.y = gauss() * 0.13 * (1 - rr * 0.4);
    p.px = p.x; p.py = p.y; p.pz = p.z;
    p.vx = 0; p.vz = 0; p.vy = 0;
    p.life = 2 + Math.random() * 6;
    p.hue = Math.random(); p.seed = Math.random();
  }
  function buildField() { N = countForDevice(); pts = new Array(N); for (let k = 0; k < N; k++) { pts[k] = { i: k }; spawn(pts[k]); } }

  let dust = [];
  function buildDust() { dust = []; const n = Math.round(W * H / 11000); for (let i = 0; i < n; i++) dust.push({ x: Math.random(), y: Math.random(), a: Math.random() * 0.22 + 0.03, s: Math.random() + 0.3 }); }

  // ---------- view (fixed orientation — no rotation) ----------
  let W = 0, H = 0, DPR = 1, cx = 0, cy = 0;
  const yaw = 0.0, pitch = -0.62, zoom = 1;
  const FOCAL = 2.6, CAMZ = 3.3;
  const cyaw = Math.cos(yaw), syaw = Math.sin(yaw), cpit = Math.cos(pitch), spit = Math.sin(pitch);
  function baseScale() { return (FOCAL / (FOCAL + CAMZ)) * zoom * Math.min(W, H) * 0.46; }

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.clientWidth || window.innerWidth;
    H = canvas.clientHeight || window.innerHeight;
    canvas.width = W * DPR; canvas.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    cx = W / 2; cy = H / 2; buildDust();
  }

  // ---------- mouse / stir (swirl only) ----------
  const mouse = { x: 0, y: 0, inside: false, strength: 0, vx: 0, vy: 0 };
  function setMouse(x, y) { mouse.vx = x - mouse.x; mouse.vy = y - mouse.y; mouse.x = x; mouse.y = y; mouse.inside = true; mouse.strength = 1; }

  // ---------- render ----------
  let last = performance.now(), glitch = 0, visible = true;
  function render(now) {
    if (!visible) { last = now; requestAnimationFrame(render); return; }
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    const t = now / 1000;

    const mspeed = Math.hypot(mouse.vx, mouse.vy); mouse.vx *= 0.6; mouse.vy *= 0.6;
    mouse.strength *= 0.94;
    let target = 1.0 + Math.sin(t * 0.21) * 0.8 + Math.min(2.4, mspeed * 0.03);
    const spike = noise3(t * 0.9, 11.3, 4.1); if (spike > 0.75) target += (spike - 0.75) * 44;
    if (reduce) target = Math.min(target, 1.1);
    glitch += (target - glitch) * 0.12;

    const S = baseScale();
    let Sx = 0, Sz = 0, stirOn = mouse.inside && mouse.strength > 0.02;
    if (stirOn) {
      const x1 = (mouse.x - cx) / S, y1 = (mouse.y - cy) / S;
      const z1 = -y1 / spit;
      Sx = x1 * cyaw + z1 * syaw; Sz = -x1 * syaw + z1 * cyaw;
    }
    const R = 0.55, FORCE = 2.4 * mouse.strength;
    const wedgeC = t * 0.16, wedgeW = 0.42 + Math.sin(t * 0.5) * 0.18;

    const moshing = glitch > 6;
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = moshing ? "rgba(5,6,10,0.05)" : "rgba(5,6,10,0.14)";
    ctx.fillRect(0, 0, W, H);

    ctx.globalCompositeOperation = "lighter";
    for (let i = 0; i < dust.length; i++) { const d = dust[i]; ctx.globalAlpha = d.a * (0.5 + 0.5 * Math.sin(t * 0.6 + i)); ctx.fillStyle = "#9fd8ff"; ctx.fillRect(d.x * W, d.y * H, d.s, d.s); }
    ctx.globalAlpha = 1; ctx.lineCap = "round";

    const gx = glitch * 0.9;
    const proj = (X, Y, Z) => {
      const x1 = X * cyaw - Z * syaw, z1b = X * syaw + Z * cyaw;
      const y1 = Y * cpit - z1b * spit, z2 = Y * spit + z1b * cpit;
      const denom = FOCAL + z2 + CAMZ; if (denom <= 0.05) return null;
      const s = (FOCAL / denom) * zoom * Math.min(W, H) * 0.46;
      return [cx + x1 * s, cy + y1 * s, z2, s];
    };

    for (let k = 0; k < N; k++) {
      const p = pts[k];
      const r = Math.hypot(p.x, p.z), ang = Math.atan2(p.z, p.x);

      const fa = noise3(p.x * 1.1, p.z * 1.1, t * 0.045) * TAU * 1.7;
      let bvx = Math.cos(fa) * 0.55, bvz = Math.sin(fa) * 0.55;
      const sw = 0.6 / (r + 0.3); bvx += -p.z * sw; bvz += p.x * sw;   // swirl
      bvx += 0.18; bvz += 0.10;                                        // diagonal current

      let mInf = 0;
      if (stirOn) {
        const dx = p.x - Sx, dz = p.z - Sz, dd = Math.hypot(dx, dz) + 1e-4;
        if (dd < R) { const w = 1 - dd / R; mInf = w; bvx += -dz / dd * w * FORCE; bvz += dx / dd * w * FORCE; }
      }

      let v; try { v = fn(t, p.i, p.x, p.y, p.z, r, ang, mInf); } catch (_) { v = 0; }
      if (!isFinite(v)) v = 0; if (v > 1) v = 1; else if (v < -1) v = -1;
      let mag = Math.abs(v);

      const aw = ((ang - wedgeC) % TAU + TAU) % TAU;
      if (aw < wedgeW || aw > TAU - wedgeW) { if (noise3(p.i * 0.3, t * 1.6, 0) > 0.4) mag *= 0.05; }

      p.vx = p.vx * 0.85 + bvx * 0.15; p.vz = p.vz * 0.85 + bvz * 0.15;
      p.vy = p.vy * 0.9 + (-p.y * 0.6 + gauss() * 0.04) * 0.1;
      const SPEED = 0.55;
      p.px = p.x; p.py = p.y; p.pz = p.z;
      p.x += p.vx * dt * SPEED; p.z += p.vz * dt * SPEED; p.y += p.vy * dt * SPEED;

      p.life -= dt * (mag < 0.12 ? 2.4 : 1);
      if (p.life <= 0 || r > 1.85) { spawn(p); continue; }

      const a2 = proj(p.x, p.y, p.z); if (!a2) continue;
      const b2 = proj(p.px, p.py, p.pz); if (!b2) continue;
      if (a2[0] < -60 || a2[0] > W + 60 || a2[1] < -60 || a2[1] > H + 60) continue;

      const depth = Math.max(0, Math.min(1, (1.9 - a2[2]) / 3.2));
      const tw = 0.8 + 0.2 * Math.sin(t * 2.1 + p.seed * 9);
      let bright = mag * depth * tw;
      if (mInf > 0) bright = Math.min(1.4, bright + mInf * 0.6);
      if (bright < 0.015) continue;

      let hueIdx = p.hue * 0.6 + v * 0.32 + depth * 0.15 + noise3(p.x, p.z, t * 0.1) * 0.25 + mInf * 0.3;
      let col = ramp(hueIdx);
      const hl = Math.min(1, Math.pow(bright, 1.5) * 1.2);
      let cr = col[0] + (BONE[0] - col[0]) * hl, cg = col[1] + (BONE[1] - col[1]) * hl, cb = col[2] + (BONE[2] - col[2]) * hl;

      const lw = Math.min(3.2, (0.45 + mag * 1.8) * (a2[3] * 0.012 + 0.5));

      ctx.globalAlpha = Math.min(1, bright * 0.9);
      ctx.strokeStyle = "rgb(" + (cr | 0) + "," + (cg | 0) + "," + (cb | 0) + ")";
      ctx.lineWidth = lw;
      ctx.beginPath(); ctx.moveTo(b2[0], b2[1]); ctx.lineTo(a2[0], a2[1]); ctx.stroke();

      if (bright > 0.5 && gx > 1.2) {
        const sp = gx * (0.6 + p.seed) * (0.4 + r);
        ctx.globalAlpha = Math.min(0.7, bright * 0.5);
        ctx.lineWidth = lw * 0.8;
        ctx.strokeStyle = "rgb(255,40,55)";
        ctx.beginPath(); ctx.moveTo(b2[0] - sp, b2[1]); ctx.lineTo(a2[0] - sp, a2[1]); ctx.stroke();
        ctx.strokeStyle = "rgb(50,160,255)";
        ctx.beginPath(); ctx.moveTo(b2[0] + sp, b2[1]); ctx.lineTo(a2[0] + sp, a2[1]); ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;

    if (!reduce && glitch > 2 && Math.random() < Math.min(0.6, glitch * 0.06)) {
      ctx.globalCompositeOperation = "source-over";
      const bands = 1 + (Math.random() * 3 | 0);
      for (let b = 0; b < bands; b++) {
        const by = Math.random() * H, bh = 4 + Math.random() * 46, off = (Math.random() - 0.5) * glitch * 5;
        ctx.drawImage(canvas, 0, by * DPR, W * DPR, bh * DPR, off, by, W, bh);
      }
    }

    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "rgba(0,0,0,0.14)";
    for (let y = 0; y < H; y += 3) ctx.fillRect(0, y, W, 1);

    if (mouse.inside) {
      ctx.globalCompositeOperation = "lighter";
      const g = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 46);
      const tint = "90,214,255";
      g.addColorStop(0, "rgba(" + tint + "," + (0.16 + mouse.strength * 0.22) + ")");
      g.addColorStop(1, "rgba(" + tint + ",0)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(mouse.x, mouse.y, 46, 0, TAU); ctx.fill();
      ctx.globalCompositeOperation = "source-over";
    }

    requestAnimationFrame(render);
  }

  // ---------- pointer: stir only (no drag-rotate, no wheel zoom) ----------
  function local(clientX, clientY) { const r = canvas.getBoundingClientRect(); return [clientX - r.left, clientY - r.top]; }
  window.addEventListener("mousemove", e => {
    const [x, y] = local(e.clientX, e.clientY);
    if (x >= 0 && y >= 0 && x <= W && y <= H) setMouse(x, y); else mouse.inside = false;
  });
  canvas.addEventListener("mouseleave", () => { mouse.inside = false; });
  canvas.addEventListener("touchmove", e => { const tch = e.touches[0]; const [x, y] = local(tch.clientX, tch.clientY); if (x >= 0 && y >= 0 && x <= W && y <= H) setMouse(x, y); }, { passive: true });
  canvas.addEventListener("touchend", () => { mouse.inside = false; });

  // ---------- boot ----------
  window.addEventListener("resize", resize);
  resize(); buildField();

  // Pause the simulation while the canvas is off-screen.
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(es => { visible = es[0].isIntersecting; }, { threshold: 0 }).observe(canvas);
  }

  requestAnimationFrame(render);
})();
