'use client';
import { useEffect, useRef, useState } from 'react';
import { shortestPath, type Edge } from '@/lib/graph';

type Run = { order: number[]; path: number[]; distance: number; start: number; end: number; t0: number };
const SKY = '127,178,229', GOLD = '212,175,106';

// Deterministic PRNG so the layout is stable between visits.
function rng(seed: number) {
  return () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
}

export default function GraphField() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [stats, setStats] = useState('dijkstra · menyiapkan graf…');

  useEffect(() => {
    const el = canvas.current!, ctx = el.getContext('2d');
    if (!ctx) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let nodes: { x: number; y: number }[] = [], edges: Edge[] = [], run: Run | null = null;
    let w = 0, h = 0, frame = 0, visible = true, pointer = { x: -1e4, y: -1e4 };

    const build = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      w = el.clientWidth; h = el.clientHeight;
      el.width = w * dpr; el.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
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
      start();
    };

    const nearest = (x: number, y: number) =>
      nodes.reduce((best, n, i) => (Math.hypot(n.x - x, n.y - y) < Math.hypot(nodes[best].x - x, nodes[best].y - y) ? i : best), 0);

    const start = (from?: number) => {
      if (nodes.length < 2) return;
      const rand = Math.random;
      const s = from ?? Math.floor(rand() * nodes.length);
      // Aim for a far-away target so the search has room to spread.
      let e = s;
      for (let tries = 0; tries < 20; tries++) {
        const c = Math.floor(rand() * nodes.length);
        if (Math.hypot(nodes[c].x - nodes[s].x, nodes[c].y - nodes[s].y) > Math.min(w, h) * 0.6) { e = c; break; }
      }
      if (e === s) e = (s + Math.floor(nodes.length / 2)) % nodes.length;
      run = { ...shortestPath(nodes.length, edges, s, e), start: s, end: e, t0: performance.now() };
      setStats(run.path.length
        ? `dijkstra · ${nodes.length} simpul · ${run.order.length} dikunjungi · jarak ${run.distance}px`
        : `dijkstra · ${nodes.length} simpul · rute tidak ditemukan`);
    };

    const draw = (now: number) => {
      ctx.clearRect(0, 0, w, h);
      const t = run ? (reduced ? 1e9 : now - run.t0) : 0;
      const exploreMs = 2600, traceMs = 1100, holdMs = 1800;
      const visitedCount = run ? Math.min(run.order.length, Math.floor((t / exploreMs) * run.order.length)) : 0;
      const visited = new Map<number, number>();
      run?.order.slice(0, visitedCount).forEach((n, i) => visited.set(n, i));
      const fade = run && t > exploreMs + traceMs + holdMs ? Math.max(0, 1 - (t - exploreMs - traceMs - holdMs) / 700) : 1;

      ctx.lineWidth = 1;
      for (const [a, b] of edges) {
        const lit = visited.has(a) && visited.has(b);
        ctx.strokeStyle = `rgba(${SKY},${lit ? 0.22 * fade + 0.06 : 0.07})`;
        ctx.beginPath(); ctx.moveTo(nodes[a].x, nodes[a].y); ctx.lineTo(nodes[b].x, nodes[b].y); ctx.stroke();
      }
      nodes.forEach((n, i) => {
        const near = Math.max(0, 1 - Math.hypot(n.x - pointer.x, n.y - pointer.y) / 160);
        const lit = visited.has(i) ? fade : 0;
        ctx.fillStyle = `rgba(${SKY},${0.22 + near * 0.5 + lit * 0.45})`;
        ctx.beginPath(); ctx.arc(n.x, n.y, 1.6 + near * 1.6 + lit * 0.8, 0, Math.PI * 2); ctx.fill();
      });

      if (run && run.path.length) {
        const progress = Math.max(0, Math.min(1, (t - exploreMs) / traceMs)) * (run.path.length - 1);
        if (progress > 0) {
          ctx.strokeStyle = `rgba(${GOLD},${0.95 * fade})`;
          ctx.lineWidth = 2; ctx.lineCap = 'round';
          ctx.shadowColor = `rgba(${GOLD},.6)`; ctx.shadowBlur = 12;
          ctx.beginPath(); ctx.moveTo(nodes[run.path[0]].x, nodes[run.path[0]].y);
          const whole = Math.floor(progress);
          for (let i = 1; i <= whole; i++) ctx.lineTo(nodes[run.path[i]].x, nodes[run.path[i]].y);
          if (whole < run.path.length - 1) {
            const a = nodes[run.path[whole]], b = nodes[run.path[whole + 1]], f = progress - whole;
            ctx.lineTo(a.x + (b.x - a.x) * f, a.y + (b.y - a.y) * f);
          }
          ctx.stroke(); ctx.shadowBlur = 0;
        }
        for (const [n, color] of [[run.start, SKY], [run.end, GOLD]] as const) {
          ctx.strokeStyle = `rgba(${color},${0.9 * fade})`; ctx.lineWidth = 1.2;
          ctx.beginPath(); ctx.arc(nodes[n].x, nodes[n].y, 7 + Math.sin(now / 300) * (reduced ? 0 : 1.5), 0, Math.PI * 2); ctx.stroke();
          ctx.fillStyle = `rgba(${color},${fade})`;
          ctx.beginPath(); ctx.arc(nodes[n].x, nodes[n].y, 3, 0, Math.PI * 2); ctx.fill();
        }
      }
      if (!reduced && run && fade === 0) start();
      if (!reduced && visible && !document.hidden) frame = requestAnimationFrame(draw);
    };

    const resume = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(draw); };
    const resize = new ResizeObserver(() => { build(); resume(); });
    const seen = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) resume(); });
    const move = (e: PointerEvent) => { const r = el.getBoundingClientRect(); pointer = { x: e.clientX - r.left, y: e.clientY - r.top }; };
    const click = (e: PointerEvent) => {
      const r = el.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      if (x < 0 || y < 0 || x > w || y > h) return;
      // Ignore clicks on real controls layered above the canvas.
      if ((e.target as HTMLElement).closest('a,button,input,select,textarea')) return;
      start(nearest(x, y)); resume();
    };
    resize.observe(el); seen.observe(el);
    const host = el.parentElement!;
    host.addEventListener('pointermove', move);
    host.addEventListener('pointerdown', click);
    document.addEventListener('visibilitychange', resume);
    return () => {
      cancelAnimationFrame(frame); resize.disconnect(); seen.disconnect();
      host.removeEventListener('pointermove', move); host.removeEventListener('pointerdown', click);
      document.removeEventListener('visibilitychange', resume);
    };
  }, []);

  return (
    <>
      <canvas ref={canvas} className="graph-field" aria-hidden="true" />
      <p className="graph-hud mono" aria-hidden="true"><span className="hud-dot" />{stats}</p>
    </>
  );
}
