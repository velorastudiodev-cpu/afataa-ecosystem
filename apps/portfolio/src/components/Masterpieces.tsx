'use client';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Pause,
  Play,
  Scan,
  FileText,
  LockKeyhole,
} from 'lucide-react';
import type { Masterpiece } from '@afataa/validators';
import ProjectDialog from './ProjectDialog';
import SectionTitle from './SectionTitle';
import { useScrollReveal } from '@/lib/useScrollReveal';
import { masterpiecesSection, projectGridItem } from '@/lib/animations';

export default function Masterpieces({ projects }: { projects: Masterpiece[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hover, setHover] = useState(false);
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [dialog, setDialog] = useState<{
    project: Masterpiece;
    mode: 'report' | 'preview';
  } | null>(null);

  const reduced = useReducedMotion();
  const region = useRef<HTMLDivElement>(null);
  const touch = useRef<number | null>(null);
  const project = projects[index];
  const categoryLabel = project.category === 'FULLSTACK_ECOSYSTEM'
    ? 'Ekosistem full-stack'
    : project.category === 'AUTONOMOUS_CMS'
    ? 'Sistem manajemen konten (CMS)'
    : 'Platform web & informasi';

  // Scroll reveal for the whole section
  const sectionReveal = useScrollReveal({ threshold: 0.08 });

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => setVisible(e.isIntersecting),
      { threshold: 0.2 }
    );
    if (region.current) obs.observe(region.current);
    const change = () => setHidden(document.hidden);
    document.addEventListener('visibilitychange', change);
    return () => {
      obs.disconnect();
      document.removeEventListener('visibilitychange', change);
    };
  }, []);

  useEffect(() => {
    if (paused || hover || focused || hidden || !visible || reduced || dialog) return;
    const timer = setInterval(
      () => setIndex((i) => (i + 1) % projects.length),
      8000
    );
    return () => clearInterval(timer);
  }, [paused, hover, focused, hidden, visible, reduced, dialog, projects.length]);

  const choose = (n: number) => {
    setPaused(true);
    setIndex((n + projects.length) % projects.length);
  };

  const actions = (p: Masterpiece, compact = false) => (
    <div className={`project-actions ${compact ? 'compact' : ''}`}>
      <a href={p.liveUrl} target="_blank" rel="noreferrer" className="text-link">
        {p.id === 'cms' ? 'Buka Dasbor Admin' : 'Buka Situs Langsung'}
        <ArrowUpRight size={15} />
      </a>
      <button className="text-link" onClick={() => setDialog({ project: p, mode: 'preview' })}>
        <Scan size={15} />
        Pratinjau Interaktif
      </button>
      <button className="text-link" onClick={() => setDialog({ project: p, mode: 'report' })}>
        <FileText size={15} />
        Laporan Arsitektur Teknis
      </button>
    </div>
  );

  return (
    <motion.section
      id="work"
      className="work section"
      ref={sectionReveal.ref as React.RefObject<HTMLElement>}
      variants={masterpiecesSection}
      initial="hidden"
      animate={sectionReveal.controls}
    >
      <SectionTitle
        number="02"
        label="Portofolio karya unggulan"
        title="Solusi digital nyata yang bekerja lebih"
        italic="efektif."
      >
        Etalase digital bisnis, pusat kendali manajemen konten, dan platform informasi
        ekspedisi. Tiga produk digital berbeda yang masing-masing dirancang mengikuti
        kebutuhan penggunanya.
      </SectionTitle>

      <div
        className="showcase"
        ref={region}
        aria-roledescription="carousel"
        aria-label="Karya unggulan"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onFocusCapture={() => setFocused(true)}
        onBlurCapture={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node))
            setFocused(false);
        }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') choose(index - 1);
          if (e.key === 'ArrowRight') choose(index + 1);
        }}
      >
        <div className="showcase-rail">
          <div className="project-select" role="group" aria-label="Pilih karya unggulan">
            {projects.map((p, i) => (
              <button
                key={p.id}
                aria-label={`Show ${p.title}`}
                aria-pressed={index === i}
                onClick={() => choose(i)}
              >
                <span className="project-index">0{i + 1}</span>
                <span className="project-name project-name-desktop">
                  {['Etalase Digital', 'Dasbor Manajemen', 'Platform Ekspedisi'][i]}
                </span>
                <span className="project-name project-name-mobile">
                  {p.id === 'cms' ? 'Ikbar CMS' : p.id === 'dzikri' ? 'Dzikri Mount' : 'Ikbar Barbershop'}
                </span>
              </button>
            ))}
          </div>
          <span className="showcase-hint">Geser pratinjau · pilih proyek</span>
          <button
            className="icon-button"
            aria-label={paused ? 'Mulai rotasi otomatis' : 'Jeda rotasi otomatis'}
            aria-pressed={!paused}
            onClick={() => setPaused(!paused)}
          >
            {paused ? <Play size={15} /> : <Pause size={15} />}
          </button>
        </div>

        <div className="spotlight">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={project.id}
              className="spotlight-copy"
              initial={{ opacity: 0, y: reduced ? 0 : 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 220, damping: 26 }}
            >
              <span className="mono project-category">
                {categoryLabel}
              </span>
              <h3>
                {project.id === 'ikbar' ? (
                  <>
                    Ikbar Barbershop
                    <br />
                    <em>Platform Web Layanan Grooming Modern</em>
                  </>
                ) : project.id === 'cms' ? (
                  <>
                    Ikbar Autonomous CMS
                    <br />
                    <em>Dasbor Kendali Situs Web Mandiri</em>
                  </>
                ) : (
                  <>
                    Dzikri Mount Guide
                    <br />
                    <em>Platform Panduan Ekspedisi &amp; Pendakian Gunung</em>
                  </>
                )}
              </h3>
              <p>{project.summary}</p>
              {project.id !== 'dzikri' && (
                <div className="ecosystem-note">
                  <span className="connection-line" />
                  Satu merek bisnis dalam dua ekosistem sistem yang saling terhubung.
                </div>
              )}
              {actions(project)}
            </motion.div>
          </AnimatePresence>

          <div
            className="screen-wrap"
            onTouchStart={(e) => {
              touch.current = e.touches[0].clientX;
            }}
            onTouchEnd={(e) => {
              if (touch.current !== null) {
                const diff = e.changedTouches[0].clientX - touch.current;
                if (Math.abs(diff) > 55) choose(index + (diff < 0 ? 1 : -1));
                touch.current = null;
              }
            }}
          >
            <div className="browser-bar">
              <div className="browser-dots">
                <i />
                <i />
                <i />
              </div>
              <span>
                <LockKeyhole size={10} />
                {new URL(project.liveUrl).host}
                {project.id === 'cms' ? '/dashboard' : ''}
              </span>
              <ArrowUpRight size={12} />
            </div>
            <button
              className="screen-image-button"
              aria-label={`Buka pratinjau interaktif ${project.title}`}
              onClick={() => setDialog({ project, mode: 'preview' })}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.img
                  key={project.id}
                  className="project-image"
                  src={project.image}
                  width={1280}
                  height={889}
                  alt={`${project.title} screenshot captured from the live website`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduced ? 0 : 0.3 }}
                />
              </AnimatePresence>
              <span className="screen-hover">
                <Scan size={16} />
                Jelajahi Pratinjau
              </span>
            </button>
            <div className="screen-foot">
              <span className="mono">
                {project.id === 'cms'
                  ? 'Memerlukan autentikasi pemilik sistem'
                  : 'Tampilan langsung dari situs produksi'}
              </span>
              <div>
                <button className="icon-button" aria-label="Proyek sebelumnya" onClick={() => choose(index - 1)}>
                  <ArrowLeft size={16} />
                </button>
                <span className="mono">0{index + 1} / 03</span>
                <button className="icon-button" aria-label="Proyek berikutnya" onClick={() => choose(index + 1)}>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Project grid cards — each stagger-pops in */}
      <div className="project-grid">
        {projects.slice(1).map((p, i) => (
          <motion.article
            className="project-card"
            key={p.id}
            custom={i}
            variants={projectGridItem}
            initial="hidden"
            animate={sectionReveal.controls}
          >
            <div className="card-top">
              <span className="mono">
                0{i + 2} / {i === 0 ? 'Sistem Manajemen Konten (CMS)' : 'Platform Web & Informasi'}
              </span>
              <ArrowUpRight size={18} />
            </div>
            <h3>{p.title}</h3>
            <p>{p.summary}</p>
            {actions(p, true)}
          </motion.article>
        ))}
      </div>

      {dialog && (
        <ProjectDialog
          key={`${dialog.project.id}-${dialog.mode}`}
          {...dialog}
          onClose={() => setDialog(null)}
        />
      )}
    </motion.section>
  );
}
