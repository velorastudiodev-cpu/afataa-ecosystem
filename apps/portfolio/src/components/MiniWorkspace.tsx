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
  const [result, setResult] = useState('Ready when you are.');
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
    setResult('Searching…');

    const finish = () => {
      setPath(new Set(answer.path));
      setRunning(false);
      setResult(
        answer.path.length
          ? `${answer.path.length - 1} steps · ${answer.visited.length} cells explored · ${ms.toFixed(3)} ms compute`
          : `No route found · ${answer.visited.length} cells explored · ${ms.toFixed(3)} ms compute`
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
    setResult('Ready when you are.');
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
        label="Afataa's interactive lab"
        title="See the thinking"
        italic="in motion."
      >
        A small window into the work: finding a better path, then shaping the
        details. Try both sides of the process.
      </SectionTitle>

      <div className="lab">
        <motion.div
          className="lab-tabs"
          role="tablist"
          aria-label="Interactive lab"
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
              {i === 0 ? 'Pathfinding sandbox' : 'UI token customizer'}
            </button>
          ))}
        </motion.div>

        <div role="tabpanel" id="panel-path" aria-labelledby="tab-path" hidden={tab !== 'path'}>
          <div className="lab-panel">
            <div className="lab-copy">
              <span className="mono">ALGORITHMIC LOGIC</span>
              <h3>
                A shorter path.
                <br />
                <em>A clearer answer.</em>
              </h3>
              <p>
                Place walls on the grid. Compare Dijkstra with A* as they find
                a shortest route from start to finish.
              </p>
              <label className="field-label" htmlFor="algorithm">
                Search algorithm
              </label>
              <select
                id="algorithm"
                value={algorithm}
                disabled={running}
                onChange={(e) => {
                  setAlgorithm(e.target.value as Algorithm);
                  clearResult();
                  setResult('Ready when you are.');
                }}
              >
                <option value="dijkstra">Dijkstra — explore by distance</option>
                <option value="astar">A* — prioritize the destination</option>
              </select>
              <div className="lab-controls">
                <button className="button small" disabled={running} onClick={run}>
                  <Play size={14} />
                  {running ? 'Searching…' : `Run ${algorithm === 'astar' ? 'A*' : 'Dijkstra'}`}
                </button>
                <button
                  className="icon-button bordered"
                  onClick={() => reset()}
                  aria-label="Reset grid"
                >
                  <RotateCcw size={17} />
                </button>
                <button className="text-link" onClick={() => reset(true)}>
                  Clear walls
                </button>
              </div>
              <p className="runtime mono" aria-live="polite">
                {result}
              </p>
            </div>
            <div className="grid-wrap">
              <div className="grid-caption">
                <MousePointer2 size={13} />
                <span>CLICK OR TAP TO ADD A WALL</span>
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
                        ? 'Start'
                        : i === end
                        ? 'Destination'
                        : `Row ${Math.floor(i / cols) + 1}, column ${i % cols + 1}${
                            walls.has(i) ? ', wall' : ''
                          }`
                    }
                    aria-pressed={walls.has(i)}
                    style={{ '--cell-order': (i % cols) + Math.floor(i / cols) * 2 } as React.CSSProperties}
                    onClick={() => {
                      clearResult();
                      setResult('Ready when you are.');
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
                  Start
                </span>
                <span>
                  <i className="end" />
                  Destination
                </span>
                <span>
                  <i className="wall" />
                  Wall
                </span>
                <span>
                  <i className="path" />
                  Shortest path
                </span>
              </div>
            </div>
          </div>
        </div>

        <div role="tabpanel" id="panel-tokens" aria-labelledby="tab-tokens" hidden={tab !== 'tokens'}>
          <div className="lab-panel">
            <div className="lab-copy">
              <span className="mono">DESIGN SYSTEMS</span>
              <h3>
                Small changes.
                <br />
                <em>A different feel.</em>
              </h3>
              <p>
                Try the same component in three tones. Change the corners, then
                take the CSS tokens with you.
              </p>
              <label className="range-label" htmlFor="radius">
                Corner radius<output>{radius}px</output>
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
                <legend>Accent tone</legend>
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
                    {t === 'sky' ? 'Sky blue' : t === 'snow' ? 'Snow blue' : 'Champagne'}
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
                <span className="mono">YOUR LIVE COMPONENT</span>
                <span className="token-symbol" style={{ color: tone.accent }}>
                  ✦
                </span>
              </div>
              <h4>
                Precision,
                <br />
                <em style={{ color: tone.accent }}>in the details.</em>
              </h4>
              <p>One system. A thousand considered decisions.</p>
              <button
                className="button small"
                style={{ background: tone.accent }}
                onClick={copy}
              >
                {copied ? <Check size={15} /> : <Copy size={15} />}{' '}
                {copied ? 'Tokens copied' : 'Copy CSS tokens'}
              </button>
              {copyError && (
                <p role="status">
                  Copy manually: radius {radius}px; accent {tone.accent}; surface {tone.surface}.
                </p>
              )}
              <div className="token-spec mono">
                RADIUS {radius}px <span>ACCENT {tone.accent}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
