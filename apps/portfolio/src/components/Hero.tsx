import { ArrowDown, ArrowUpRight } from 'lucide-react';
import GraphField from './GraphField';
import { content } from '@/lib/content';

export default function Hero() {
  const { profile, achievements, masterpieces } = content;
  const stats = [
    ...achievements.map((a) => ({ value: a.isGoldHighlight ? 'Emas' : 'Semifinal',label: a.rankOrMedal, sub: `${a.organization} · ${a.year}`, gold: a.isGoldHighlight })),
    { value: String(masterpieces.length), label: 'Sistem produksi aktif', sub: 'Etalase, CMS & platform informasi', gold: false },
  ];

  return (
    <section id="hero" className="hero">
      <GraphField />
      <div className="hero-inner shell">
        <p className="hero-status anim" style={{ '--d': 0 } as React.CSSProperties}>
          <span className="pulse" /> {profile.availabilityText}
        </p>
        <p className="hero-name mono anim" style={{ '--d': 1 } as React.CSSProperties}>
          {profile.fullName} <span className="hide-sm">— {profile.roles.join(' / ')}</span>
        </p>
        <h1 className="anim" style={{ '--d': 2 } as React.CSSProperties}>
          Logika juara olimpiade, dirangkai menjadi <em>situs web yang presisi.</em>
        </h1>
        <div className="hero-row">
          <p className="hero-lede anim" style={{ '--d': 3 } as React.CSSProperties}>{profile.shortBio}</p>
          <div className="hero-actions anim" style={{ '--d': 4 } as React.CSSProperties}>
            <a className="btn btn-light" href="#work">Lihat Karya Terpilih <ArrowDown size={16} /></a>
            <a className="btn btn-ghost" href="#contact">Diskusikan Proyek <ArrowUpRight size={16} /></a>
          </div>
        </div>
        <p className="hero-hint mono anim" style={{ '--d': 5 } as React.CSSProperties}>
          ↳ Klik di mana saja pada graf untuk menjalankan Dijkstra dari titik itu.
        </p>
      </div>
      <dl className="hero-stats shell">
        {stats.map((s) => (
          <div key={s.label} className={s.gold ? 'is-gold' : ''}>
            <dt><span className="stat-value">{s.value}</span>{s.label}</dt>
            <dd>{s.sub}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
