'use client';
import { useEffect, useRef, useState } from 'react';
import { shortestPath, type Edge } from '@/lib/graph';

type Run = { order: number[]; path: number[]; distance: number; start: number; end: number; t0: number; rank: Int32Array };
const SKY = '127,178,229', GOLD = '212,175,106';
const EXPLORE = 2600, TRACE = 1100, HOLD = 1800, FADE = 700;

// Deterministic PRNG so the layout is stable between visits.
function rng(seed: number) {
  return () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
}

export default function GraphField() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [stats, setStats] = useState('dijkstra · menyiapkan graf…');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = canvas.current!, ctx = el.getContext('2d');
    if (!ctx) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const base = document.createElement('canvas'), baseCtx = base.getContext('2d')!;
    let nodes: { x: number; y: number }[] = [], edges: Edge[] = [], run: Run | null = null;
    let w = 0, h = 0, dpr = 1, frame = 0, visible = true, pointer = { x: -1e4, y: -1e4 };

    const build = () => {
      w = el.clientWidth; h = el.clientHeight;
      dpr = Math.min(devicePixelRatio || 1, w < 640 ? 1.5 : 2);
      for (const c of [el, base]) { c.width = w * dpr; c.height = h * dpr; }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      baseCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const rand = rng(20260), step = w < 640 ? 64 : 84;
      nodes = [];
      for (let y = step / 2; y < h; y += step)
        for (let x = step / 2; x < w; x += step)
          nodes.push({ x: x + (rand() - 0.5) * step * 0.8, y: y + (rand() - 0.5) * step * 0.8 });
      const seen = new Set<string>();
      edges = [];
      nodes.forEach((a, i) => {
        nodes.map((b, j) => [j, Math.hypot(a.x - b.x, a.y - b.y)] as const)
          .filter(([j]) => j !== i).sort((p, q) => p[1] - q[1]).slice(0, 3)
          .forEach(([j, d]) => {
            const key = i < j ? `${i}-${j}` : `${j}-${i}`;
            if (!seen.has(key)) { seen.add(key); edges.push([i, j, Math.round(d)]); }
          });
      });
      // The idle graph never changes, so paint it once and blit it every frame.
      baseCtx.clearRect(0, 0, w, h);
      baseCtx.strokeStyle = `rgba(${SKY},.07)`; baseCtx.lineWidth = 1;
      baseCtx.beginPath();
      for (const [a, b] of edges) { baseCtx.moveTo(nodes[a].x, nodes[a].y); baseCtx.lineTo(nodes[b].x, nodes[b].y); }
      baseCtx.stroke();
      baseCtx.fillStyle = `rgba(${SKY},.22)`;
      baseCtx.beginPath();
      for (const n of nodes) { baseCtx.moveTo(n.x + 1.6, n.y); baseCtx.arc(n.x, n.y, 1.6, 0, Math.PI * 2); }
      baseCtx.fill();
      start();
    };

    const nearest = (x: number, y: number) =>
      nodes.reduce((best, n, i) => (Math.hypot(n.x - x, n.y - y) < Math.hypot(nodes[best].x - x, nodes[best].y - y) ? i : best), 0);

    const start = (from?: number) => {
      if (nodes.length < 2) return;
      const s = from ?? Math.floor(Math.random() * nodes.length);
      // Aim for a far-away target so the search has room to spread.
      let e = s;
      for (let tries = 0; tries < 20; tries++) {
        const c = Math.floor(Math.random() * nodes.length);
        if (Math.hypot(nodes[c].x - nodes[s].x, nodes[c].y - nodes[s].y) > Math.min(w, h) * 0.6) { e = c; break; }
      }
      if (e === s) e = (s + Math.floor(nodes.length / 2)) % nodes.length;
      const result = shortestPath(nodes.length, edges, s, e);
      const rank = new Int32Array(nodes.length).fill(-1);
      result.order.forEach((n, i) => (rank[n] = i));
      run = { ...result, start: s, end: e, t0: performance.now(), rank };
      setStats(run.path.length
        ? `dijkstra · ${nodes.length} simpul · ${run.order.length} dikunjungi · jarak ${run.distance}px`
        : `dijkstra · ${nodes.length} simpul · rute tidak ditemukan`);
    };

    const draw = (now: number) => {
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(base, 0, 0, w, h);
      if (!run) return;
      const t = reduced ? 1e9 : now - run.t0;
      const lit = Math.min(run.order.length, Math.floor((t / EXPLORE) * run.order.length));
      const fade = reduced ? 1 : Math.max(0, Math.min(1, 1 - (t - EXPLORE - TRACE - HOLD) / FADE));
      const isLit = (n: number) => run!.rank[n] >= 0 && run!.rank[n] < lit;

      ctx.lineWidth = 1;
      ctx.strokeStyle = `rgba(${SKY},${0.24 * fade})`;
      ctx.beginPath();
      for (const [a, b] of edges) if (isLit(a) && isLit(b)) { ctx.moveTo(nodes[a].x, nodes[a].y); ctx.lineTo(nodes[b].x, nodes[b].y); }
      ctx.stroke();
      ctx.fillStyle = `rgba(${SKY},${0.6 * fade})`;
      ctx.beginPath();
      for (let i = 0; i < lit; i++) { const n = nodes[run.order[i]]; ctx.moveTo(n.x + 2.4, n.y); ctx.arc(n.x, n.y, 2.4, 0, Math.PI * 2); }
      ctx.fill();
      // Pointer glow: only nodes inside the radius are touched.
      if (pointer.x > -1e3) {
        for (const n of nodes) {
          const near = 1 - Math.hypot(n.x - pointer.x, n.y - pointer.y) / 160;
          if (near <= 0) continue;
          ctx.fillStyle = `rgba(${SKY},${near * 0.6})`;
          ctx.beginPath(); ctx.arc(n.x, n.y, 1.6 + near * 1.8, 0, Math.PI * 2); ctx.fill();
        }
      }

      if (run.path.length) {
        const progress = Math.max(0, Math.min(1, (t - EXPLORE) / TRACE)) * (run.path.length - 1);
        if (progress > 0) {
          ctx.beginPath(); ctx.moveTo(nodes[run.path[0]].x, nodes[run.path[0]].y);
          const whole = Math.floor(progress);
          for (let i = 1; i <= whole; i++) ctx.lineTo(nodes[run.path[i]].x, nodes[run.path[i]].y);
          if (whole < run.path.length - 1) {
            const a = nodes[run.path[whole]], b = nodes[run.path[whole + 1]], f = progress - whole;
            ctx.lineTo(a.x + (b.x - a.x) * f, a.y + (b.y - a.y) * f);
          }
          // Two strokes fake a glow far cheaper than shadowBlur.
          ctx.lineCap = 'round'; ctx.lineJoin = 'round';
          ctx.strokeStyle = `rgba(${GOLD},${0.18 * fade})`; ctx.lineWidth = 8; ctx.stroke();
          ctx.strokeStyle = `rgba(${GOLD},${0.95 * fade})`; ctx.lineWidth = 2; ctx.stroke();
        }
        for (const [n, color] of [[run.start, SKY], [run.end, GOLD]] as const) {
          ctx.strokeStyle = `rgba(${color},${0.9 * fade})`; ctx.lineWidth = 1.2;
          ctx.beginPath(); ctx.arc(nodes[n].x, nodes[n].y, 7 + (reduced ? 0 : Math.sin(now / 300) * 1.5), 0, Math.PI * 2); ctx.stroke();
          ctx.fillStyle = `rgba(${color},${fade})`;
          ctx.beginPath(); ctx.arc(nodes[n].x, nodes[n].y, 3, 0, Math.PI * 2); ctx.fill();
        }
      }
      if (!reduced && fade === 0) start();
    };

    const loop = (now: number) => {
      draw(now);
      if (!reduced && visible && !document.hidden) frame = requestAnimationFrame(loop);
    };
    const resume = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(loop); };
    const resize = new ResizeObserver(() => { if (el.clientWidth !== w || el.clientHeight !== h) { build(); resume(); } });
    const seen = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) resume(); });
    const move = (e: PointerEvent) => { const r = el.getBoundingClientRect(); pointer = { x: e.clientX - r.left, y: e.clientY - r.top }; };
    const leave = () => (pointer = { x: -1e4, y: -1e4 });
    const click = (e: PointerEvent) => {
      // Ignore clicks on real controls layered above the canvas.
      if ((e.target as HTMLElement).closest('a,button,input,select,textarea')) return;
      const r = el.getBoundingClientRect();
      start(nearest(e.clientX - r.left, e.clientY - r.top)); resume();
    };
    const host = el.parentElement!;

    // Defer the whole graph until the browser is idle so it never competes with first paint or hydration.
    const idle = window.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 200));
    let cancelled = false;
    const boot = () => {
      if (cancelled) return;
      build(); resume(); setReady(true);
      resize.observe(el); seen.observe(el);
      if (matchMedia('(pointer: fine)').matches) { host.addEventListener('pointermove', move, { passive: true }); host.addEventListener('pointerleave', leave); }
      host.addEventListener('pointerdown', click);
      document.addEventListener('visibilitychange', resume);
    };
    const kick = () => idle(boot, { timeout: 1500 });
    if (document.readyState === 'complete') kick(); else addEventListener('load', kick, { once: true });

    return () => {
      cancelled = true; cancelAnimationFrame(frame); resize.disconnect(); seen.disconnect();
      removeEventListener('load', kick);
      host.removeEventListener('pointermove', move); host.removeEventListener('pointerleave', leave); host.removeEventListener('pointerdown', click);
      document.removeEventListener('visibilitychange', resume);
    };
  }, []);

  return (
    <>
      <canvas ref={canvas} className={`graph-field ${ready ? 'is-ready' : ''}`} aria-hidden="true" />
      <p className="graph-hud mono" aria-hidden="true"><span className="hud-dot" />{stats}</p>
    </>
  );
}
