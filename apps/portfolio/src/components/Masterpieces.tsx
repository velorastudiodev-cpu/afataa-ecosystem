'use client';
import { useState } from 'react';
import { ArrowUpRight, FileText, Maximize2, Link2 } from 'lucide-react';
import type { Masterpiece } from '@afataa/validators';
import SectionTitle from './SectionTitle';
import ProjectDialog from './ProjectDialog';

const categoryLabel: Record<Masterpiece['category'], string> = {
  FULLSTACK_ECOSYSTEM: 'Ekosistem full-stack',
  AUTONOMOUS_CMS: 'CMS mandiri',
  WEB_PLATFORM: 'Platform web',
  SOFTWARE_TOOL: 'Perangkat lunak',
};

export default function Masterpieces({ projects }: { projects: Masterpiece[] }) {
  const [open, setOpen] = useState<{ project: Masterpiece; mode: 'report' | 'preview' } | null>(null);
  const sorted = [...projects].sort((a, b) => a.featuredOrder - b.featuredOrder);
  const byUrl = new Map(projects.map((p) => [p.liveUrl, p]));

  return (
    <section id="work" className="section work">
      <div className="shell">
        <SectionTitle number="01" label="Karya terpilih" title="Sistem nyata yang sedang" italic="bekerja hari ini.">
          Etalase bisnis, pusat kendali konten, dan platform informasi ekspedisi. Tiga produk yang
          masing-masing dirancang dari kebutuhan penggunanya, bukan dari templat.
        </SectionTitle>

        <ol className="cases">
          {sorted.map((p, i) => {
            const [name, tagline] = p.title.split(' — ');
            const host = new URL(p.liveUrl).host + new URL(p.liveUrl).pathname.replace(/\/$/, '');
            const paired = p.pairedDashboardUrl ? byUrl.get(p.pairedDashboardUrl) : sorted.find((o) => o.pairedDashboardUrl === p.liveUrl);
            return (
              <li key={p.id} className="case" data-reveal>
                <figure className="case-visual">
                  <button className="case-frame" onClick={() => setOpen({ project: p, mode: 'preview' })} aria-label={`Buka pratinjau ${name}`}>
                    <span className="frame-bar" aria-hidden="true">
                      <i /><i /><i /><span className="mono">{host}</span>
                    </span>
                    <img
                      src={p.image}
                      srcSet={`${p.image.replace('.webp', '-640.webp')} 640w, ${p.image.replace('.webp', '-960.webp')} 960w, ${p.image} 1280w`}
                      sizes="(max-width: 960px) calc(100vw - 32px), 680px"
                      alt={`Tangkapan layar desktop ${name}`} loading="lazy" decoding="async" width={1280} height={889}
                    />
                  </button>
                  <img className="case-phone" src={p.image.replace('.webp', '-mobile-240.webp')} decoding="async" alt={`Tangkapan layar seluler ${name}`} loading="lazy" width={390} height={844} />
                </figure>
                <div className="case-copy">
                  <p className="case-meta mono">
                    <span className="case-index">{String(i + 1).padStart(2, '0')}</span>
                    {categoryLabel[p.category]} · {p.subtitle.split(' · ').pop()}
                  </p>
                  <h3>{name}</h3>
                  {tagline && <p className="case-tagline"><em>{tagline}</em></p>}
                  <p className="case-summary">{p.summary}</p>
                  {paired && (
                    <p className="case-pair mono"><Link2 size={14} /> Satu ekosistem dengan {paired.title.split(' — ')[0]}</p>
                  )}
                  <div className="case-actions">
                    <a className="btn btn-light btn-sm" href={p.liveUrl} target="_blank" rel="noreferrer">
                      {p.category === 'AUTONOMOUS_CMS' ? 'Buka Dasbor' : 'Kunjungi Situs'} <ArrowUpRight size={15} />
                    </a>
                    <button className="btn btn-ghost btn-sm" onClick={() => setOpen({ project: p, mode: 'preview' })}>
                      <Maximize2 size={14} /> Pratinjau
                    </button>
                    <button className="link" onClick={() => setOpen({ project: p, mode: 'report' })}>
                      <FileText size={15} /> Catatan proyek
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
      {open && <ProjectDialog project={open.project} mode={open.mode} onClose={() => setOpen(null)} />}
    </section>
  );
}
