'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, RotateCcw, Play, Copy, Check, MousePointer2 } from 'lucide-react';
import { findPath, type Algorithm } from '@/lib/pathfinding';
import SectionTitle from './SectionTitle';
import { useScrollReveal } from '@/lib/useScrollReveal';
import { workspaceSection, workspaceTabs } from '@/lib/animations';

const cols = 16, rows = 8, start = 17, end = 110;
const startingWalls = [23, 39, 55, 71, 87, 45, 61, 77, 93];

export default function MiniWorkspace() {
  const [tab, setTab] = useState('path');
  const [walls, setWalls] = useState(new Set(startingWalls));
  const [visited, setVisited] = useState(new Set<number>());
  const [path, setPath] = useState(new Set<number>());
  const [running, setRunning] = useState(false);
  const [algorithm, setAlgorithm] = useState<Algorithm>('dijkstra');
  const [result, setResult] = useState('Siap dijalankan kapan saja.');
  const [radius, setRadius] = useState(18);
  const [accent, setAccent] = useState('sky');
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const generation = useRef(0);
  const reduced = useReducedMotion();
  const gridRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  // Section scroll reveal — diagonal skew enter
  const sectionReveal = useScrollReveal({ threshold: 0.1 });
  const tabsReveal = useScrollReveal({ threshold: 0.2 });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (gridRef.current) observer.observe(gridRef.current);
    return () => observer.disconnect();
  }, []);

  const stop = () => {
    generation.current++;
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    setRunning(false);
  };

  useEffect(
    () => () => {
      generation.current++;
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );

  const clearResult = () => {
    setVisited(new Set());
    setPath(new Set());
  };

  const run = () => {
    stop();
    clearResult();
    setRunning(true);
    const token = generation.current;
    const t = performance.now();
    const answer = findPath(cols, rows, start, end, walls, algorithm);
    const ms = performance.now() - t;
    let cursor = 0;
    setResult('Sedang mencari…');

    const finish = () => {
      setPath(new Set(answer.path));
      setRunning(false);
      setResult(
        answer.path.length
          ? `${answer.path.length - 1} langkah · ${answer.visited.length} petak dijelajahi · ${ms.toFixed(3)} ms komputasi`
          : `Rute tidak ditemukan · ${answer.visited.length} petak dijelajahi · ${ms.toFixed(3)} ms komputasi`
      );
    };

    if (reduced) {
      setVisited(new Set(answer.visited));
      finish();
      return;
    }

    const step = () => {
      if (generation.current !== token) return;
      cursor = Math.min(cursor + 3, answer.visited.length);
      setVisited(new Set(answer.visited.slice(0, cursor)));
      if (cursor < answer.visited.length) timer.current = setTimeout(step, 24);
      else finish();
    };
    step();
  };

  const reset = (empty = false) => {
    stop();
    clearResult();
    setWalls(new Set(empty ? [] : startingWalls));
    setResult('Siap dijalankan kapan saja.');
  };

  const colors = {
    sky: { accent: '#3B82C4', surface: '#E3EFFB', text: '#1E3A5F' },
    snow: { accent: '#1E3A5F', surface: '#F2F7FC', text: '#1E3A5F' },
    gold: { accent: '#9E7B3B', surface: '#FBF6EB', text: '#0F172A' },
  };
  const tone = colors[accent as keyof typeof colors];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(
        `--card-radius: ${radius}px;\n--card-accent: ${tone.accent};\n--card-surface: ${tone.surface};`
      );
      setCopied(true);
      setCopyError(false);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopyError(true);
    }
  };

  return (
    <motion.section
      id="workspace"
      className="section workspace"
      ref={sectionReveal.ref as React.RefObject<HTMLElement>}
      variants={workspaceSection}
      initial="hidden"
      animate={sectionReveal.controls}
    >
      <SectionTitle
        number="03"
        label="Laboratorium interaktif Afataa"
        title="Simulasi logika algoritma & sistem desain"
        italic="secara langsung."
      >
        Gambaran langsung mengenai cara kerja saya: menemukan jalur komputasi paling
        efisien, lalu menyempurnakan setiap detail visualnya. Silakan uji kedua sisi
        proses rekayasa tersebut di bawah ini.
      </SectionTitle>

      <div className="lab">
        <motion.div
          className="lab-tabs"
          role="tablist"
          aria-label="Laboratorium interaktif"
          ref={tabsReveal.ref as React.RefObject<HTMLDivElement>}
          variants={workspaceTabs}
          initial="hidden"
          animate={tabsReveal.controls}
        >
          {['path', 'tokens'].map((t, i) => (
            <button
              key={t}
              id={`tab-${t}`}
              role="tab"
              aria-selected={tab === t}
              aria-controls={`panel-${t}`}
              tabIndex={tab === t ? 0 : -1}
              onClick={() => setTab(t)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                  const next = t === 'path' ? 'tokens' : 'path';
                  setTab(next);
                  document.getElementById(`tab-${next}`)?.focus();
                }
              }}
            >
              <span className="mono">0{i + 1}</span>
              {i === 0 ? 'Simulasi Pencarian Jalur' : 'Kustomisasi Token Antarmuka'}
            </button>
          ))}
        </motion.div>

        <div role="tabpanel" id="panel-path" aria-labelledby="tab-path" hidden={tab !== 'path'}>
          <div className="lab-panel">
            <div className="lab-copy">
              <span className="mono">Logika algoritmik</span>
              <h3>
                Jalur terpendek
                <br />
                <em>dengan komputasi paling efisien.</em>
              </h3>
              <p>
                Tambahkan rintangan dinding pada petak permainan, lalu bandingkan kinerja
                algoritma Dijkstra dan A* dalam menemukan rute terpendek dari titik awal
                menuju titik tujuan.
              </p>
              <label className="field-label" htmlFor="algorithm">
                Algoritma pencarian
              </label>
              <select
                id="algorithm"
                value={algorithm}
                disabled={running}
                onChange={(e) => {
                  setAlgorithm(e.target.value as Algorithm);
                  clearResult();
                  setResult('Siap dijalankan kapan saja.');
                }}
              >
                <option value="dijkstra">Dijkstra — eksplorasi berdasarkan jarak terdekat</option>
                <option value="astar">A* (A-Star) — pencarian terarah berbasis heuristik</option>
              </select>
              <div className="lab-controls">
                <button className="button small" disabled={running} onClick={run}>
                  <Play size={14} />
                  {running ? 'Sedang mencari…' : `Jalankan Algoritma ${algorithm === 'astar' ? 'A*' : 'Dijkstra'}`}
                </button>
                <button
                  className="icon-button bordered"
                  onClick={() => reset()}
                  aria-label="Atur ulang petak"
                >
                  <RotateCcw size={17} />
                </button>
                <button className="text-link" onClick={() => reset(true)}>
                  Bersihkan Rintangan
                </button>
              </div>
              <p className="runtime mono" aria-live="polite">
                {result}
              </p>
            </div>
            <div className="grid-wrap">
              <div className="grid-caption">
                <MousePointer2 size={13} />
                <span>Klik atau ketuk petak untuk menambahkan rintangan</span>
                <span>16 × 8</span>
              </div>
              <div
                ref={gridRef}
                className={`path-grid ${revealed ? 'grid-revealed' : ''}`}
                aria-label="Pathfinding grid, 16 columns and 8 rows"
              >
                {Array.from({ length: cols * rows }, (_, i) => (
                  <button
                    key={i}
                    className={`cell ${
                      i === start
                        ? 'start'
                        : i === end
                        ? 'end'
                        : walls.has(i)
                        ? 'wall'
                        : path.has(i)
                        ? 'path'
                        : visited.has(i)
                        ? 'visited'
                        : ''
                    }`}
                    disabled={running || i === start || i === end}
                    aria-label={
                      i === start
                        ? 'Titik Awal'
                        : i === end
                        ? 'Titik Tujuan'
                        : `Baris ${Math.floor(i / cols) + 1}, kolom ${i % cols + 1}${
                            walls.has(i) ? ', rintangan' : ''
                          }`
                    }
                    aria-pressed={walls.has(i)}
                    style={{ '--cell-order': (i % cols) + Math.floor(i / cols) * 2 } as React.CSSProperties}
                    onClick={() => {
                      clearResult();
                      setResult('Siap dijalankan kapan saja.');
                      setWalls((w) => {
                        const n = new Set(w);
                        if (n.has(i)) n.delete(i);
                        else n.add(i);
                        return n;
                      });
                    }}
                  >
                    {i === start ? 'S' : i === end ? 'E' : ''}
                  </button>
                ))}
              </div>
              <div className="grid-legend">
                <span>
                  <i className="start" />
                  Titik Awal
                </span>
                <span>
                  <i className="end" />
                  Titik Tujuan
                </span>
                <span>
                  <i className="wall" />
                  Rintangan Dinding
                </span>
                <span>
                  <i className="path" />
                  Jalur Terpendek
                </span>
              </div>
            </div>
          </div>
        </div>

        <div role="tabpanel" id="panel-tokens" aria-labelledby="tab-tokens" hidden={tab !== 'tokens'}>
          <div className="lab-panel">
            <div className="lab-copy">
              <span className="mono">Sistem desain antarmuka</span>
              <h3>
                Penyesuaian presisi
                <br />
                <em>untuk karakter visual yang berbeda.</em>
              </h3>
              <p>
                Uji tampilan komponen yang sama dalam tiga nuansa warna aksen, sesuaikan
                lengkungan sudutnya, lalu salin konfigurasi token CSS secara langsung.
              </p>
              <label className="range-label" htmlFor="radius">
                Radius sudut<output>{radius}px</output>
              </label>
              <input
                id="radius"
                type="range"
                min={0}
                max={40}
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
              />
              <fieldset className="accent-options">
                <legend>Warna aksen utama</legend>
                {['sky', 'snow', 'gold'].map((t) => (
                  <label key={t} className={accent === t ? 'active' : ''}>
                    <input
                      type="radio"
                      name="accent"
                      value={t}
                      checked={accent === t}
                      onChange={() => setAccent(t)}
                    />
                    <span className={`color-dot ${t}`} />
                    {t === 'sky' ? 'Biru Langit' : t === 'snow' ? 'Biru Salju' : 'Emas Sampanye'}
                  </label>
                ))}
              </fieldset>
            </div>
            <div
              className="token-demo"
              style={{
                borderRadius: radius,
                background: tone.surface,
                borderColor: tone.accent,
              }}
            >
              <div className="card-top">
                <span className="mono">Pratinjau komponen langsung</span>
                <span className="token-symbol" style={{ color: tone.accent }}>
                  ✦
                </span>
              </div>
              <h4>
                Presisi di setiap detail
                <br />
                <em style={{ color: tone.accent }}>desain.</em>
              </h4>
              <p>Satu sistem terpadu melalui ribuan keputusan desain yang terukur.</p>
              <button
                className="button small"
                style={{ background: tone.accent }}
                onClick={copy}
              >
                {copied ? <Check size={15} /> : <Copy size={15} />}{' '}
                {copied ? 'Token tersalin' : 'Salin Token CSS'}
              </button>
              {copyError && (
                <p role="status">
                  Salin manual: radius {radius}px; aksen {tone.accent}; permukaan {tone.surface}.
                </p>
              )}
              <div className="token-spec mono">
                Radius {radius}px <span>Aksen {tone.accent}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
