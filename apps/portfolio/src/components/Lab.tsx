'use client';
import { useEffect, useRef, useState } from 'react';
import { Play, RotateCcw, Eraser, Shuffle } from 'lucide-react';
import { findPath, type Algorithm } from '@/lib/pathfinding';
import SectionTitle from './SectionTitle';

const cols = 16, rows = 9, start = 4 * cols + 1, end = 4 * cols + 14;
const startingWalls = [...[1, 2, 3, 4, 5].map((r) => r * cols + 6), ...[3, 4, 5, 6, 7].map((r) => r * cols + 10)];
const algorithms: Algorithm[] = ['dijkstra', 'astar'];
const label = { dijkstra: 'Dijkstra', astar: 'A*' };
type Lane = { visited: number; path: number[]; done: boolean; result: ReturnType<typeof findPath> | null };
const idle: Lane = { visited: 0, path: [], done: false, result: null };

export default function Lab() {
  const [walls, setWalls] = useState(() => new Set(startingWalls));
  const [lanes, setLanes] = useState<Record<Algorithm, Lane>>({ dijkstra: idle, astar: idle });
  const [running, setRunning] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const paint = useRef<boolean | null>(null);
  const host = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  // The two 144-cell grids only matter once the lab is near the viewport; mounting them late keeps hydration light.
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setMounted(true); io.disconnect(); } }, { rootMargin: '600px 0px' });
    if (host.current) io.observe(host.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  const clear = () => { clearTimeout(timer.current); setRunning(false); setLanes({ dijkstra: idle, astar: idle }); };

  const toggle = (i: number, add?: boolean) => {
    if (running || i === start || i === end) return;
    clear();
    setWalls((w) => {
      const next = new Set(w);
      if (add ?? !w.has(i)) next.add(i); else next.delete(i);
      return next;
    });
  };

  const race = () => {
    clear();
    const results = { dijkstra: findPath(cols, rows, start, end, walls, 'dijkstra'), astar: findPath(cols, rows, start, end, walls, 'astar') };
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setLanes({
        dijkstra: { visited: results.dijkstra.visited.length, path: results.dijkstra.path, done: true, result: results.dijkstra },
        astar: { visited: results.astar.visited.length, path: results.astar.path, done: true, result: results.astar },
      });
      return;
    }
    setRunning(true);
    let tick = 0;
    // Both lanes advance at the same rate, so the one that explores less finishes first.
    const step = () => {
      tick += 2;
      const next = Object.fromEntries(algorithms.map((a) => {
        const r = results[a], visited = Math.min(tick, r.visited.length), done = visited === r.visited.length;
        return [a, { visited, path: done ? r.path : [], done, result: r }];
      })) as Record<Algorithm, Lane>;
      setLanes(next);
      if (algorithms.every((a) => next[a].done)) setRunning(false);
      else timer.current = setTimeout(step, 28);
    };
    step();
  };

  const randomize = () => {
    clear();
    const next = new Set<number>();
    for (let i = 0; i < cols * rows; i++) if (i !== start && i !== end && Math.random() < 0.28) next.add(i);
    setWalls(next);
  };

  const cellAt = (x: number, y: number) => {
    const el = document.elementFromPoint(x, y)?.closest<HTMLElement>('[data-cell]');
    return el ? Number(el.dataset.cell) : -1;
  };

  const { dijkstra, astar } = lanes;
  const finished = dijkstra.done && astar.done && dijkstra.result && astar.result;
  let summary = 'Gambar dinding, lalu jalankan balapan.';
  if (running) summary = 'Kedua algoritma sedang menjelajah…';
  else if (finished) {
    summary = !astar.result!.path.length
      ? 'Tidak ada rute: titik tujuan tertutup dinding.'
      : `Rute sama-sama ${astar.result!.path.length - 1} langkah. A* hanya menjelajahi ${astar.visited} petak, Dijkstra ${dijkstra.visited} — ${Math.round((1 - astar.visited / dijkstra.visited) * 100)}% lebih hemat.`;
  }

  return (
    <section id="lab" className="section lab">
      <div className="shell">
        <SectionTitle number="04" label="Laboratorium" title="Dua algoritma, satu labirin." italic="Siapa yang lebih efisien?">
          Dijkstra menyebar ke segala arah, A* dipandu heuristik menuju tujuan. Keduanya menemukan rute
          terpendek, tetapi dengan biaya yang berbeda. Prinsip yang sama berlaku saat saya mengoptimalkan
          situs web: hasil yang tepat dengan kerja yang paling sedikit.
        </SectionTitle>

        <div className="lab-panel" data-reveal ref={host}>
          <div className="lab-toolbar">
            <button className="btn btn-gold btn-sm" onClick={race} disabled={running}>
              <Play size={15} /> {running ? 'Berjalan…' : 'Mulai Balapan'}
            </button>
            <button className="btn btn-ghost btn-sm" onClick={randomize} disabled={running}><Shuffle size={15} /> Acak</button>
            <button className="btn btn-ghost btn-sm" onClick={() => { clear(); setWalls(new Set(startingWalls)); }} disabled={running}><RotateCcw size={15} /> Atur ulang</button>
            <button className="btn btn-ghost btn-sm" onClick={() => { clear(); setWalls(new Set()); }} disabled={running}><Eraser size={15} /> Kosongkan</button>
          </div>

          <div className="lanes">
            {algorithms.map((a, laneIndex) => {
              const lane = lanes[a], r = lane.result;
              const visited = new Set(r?.visited.slice(0, lane.visited)), path = new Set(lane.path);
              const editable = laneIndex === 0;
              return (
                <div key={a} className={`lane ${lane.done && finished && a === 'astar' && astar.visited < dijkstra.visited ? 'is-winner' : ''}`}>
                  <div className="lane-head">
                    <h3>{label[a]}</h3>
                    <span className="mono">{lane.visited} petak · {lane.path.length ? `${lane.path.length - 1} langkah` : '—'}</span>
                  </div>
                  <div
                    className="maze"
                    role={editable ? 'group' : undefined}
                    aria-label={editable ? `Grid ${cols} kali ${rows}. Tekan petak untuk menambah atau menghapus dinding.` : undefined}
                    aria-hidden={editable ? undefined : true}
                    style={{ '--cols': cols } as React.CSSProperties}
                    onPointerDown={(e) => {
                      const i = cellAt(e.clientX, e.clientY);
                      if (i < 0 || running || i === start || i === end) return;
                      paint.current = !walls.has(i);
                      toggle(i, paint.current);
                    }}
                    onPointerMove={(e) => {
                      if (paint.current === null || e.pointerType === 'touch') return;
                      const i = cellAt(e.clientX, e.clientY);
                      if (i >= 0 && walls.has(i) !== paint.current) toggle(i, paint.current);
                    }}
                    onPointerUp={() => (paint.current = null)}
                    onPointerLeave={() => (paint.current = null)}
                  >
                    {mounted && Array.from({ length: cols * rows }, (_, i) => {
                      const state = i === start ? 'start' : i === end ? 'end' : walls.has(i) ? 'wall' : path.has(i) ? 'path' : visited.has(i) ? 'visited' : '';
                      const Cell = editable ? 'button' : 'span';
                      return (
                        <Cell
                          key={i}
                          data-cell={i}
                          className={`cell ${state}`}
                          {...(editable && {
                            'aria-label': i === start ? 'Titik awal' : i === end ? 'Titik tujuan' : `Baris ${Math.floor(i / cols) + 1}, kolom ${(i % cols) + 1}`,
                            'aria-pressed': walls.has(i),
                            disabled: running || i === start || i === end,
                            // Pointer input is handled on the grid; this only serves keyboard activation.
                            onClick: (e: React.MouseEvent) => e.detail === 0 && toggle(i),
                          })}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="lab-foot">
            <p className="lab-summary" aria-live="polite">{summary}</p>
            <ul className="legend mono" aria-label="Keterangan">
              <li><i className="start" />Awal</li>
              <li><i className="end" />Tujuan</li>
              <li><i className="wall" />Dinding</li>
              <li><i className="visited" />Dijelajahi</li>
              <li><i className="path" />Rute</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
