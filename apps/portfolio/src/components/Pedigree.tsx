import { Medal, Award, Code2, Terminal, ArrowUpRight, Atom, Wind, Box, Database, Component } from 'lucide-react';
import SectionTitle from './SectionTitle';
import { content } from '@/lib/content';

const pillars = [
  ['Desainer Web & Antarmuka (UI/UX)', 'Sistem visual yang dirancang dengan tujuan terukur, tipografi yang proporsional, hierarki informasi yang jernih, serta alur navigasi pengguna yang intuitif.'],
  ['Pengembang Situs Web Modern', 'Pengembangan antarmuka web responsif yang mengutamakan kecepatan muat halaman, kejelasan struktur kode, dan kenyamanan pengguna di berbagai perangkat.'],
  ['Pengembang Perangkat Lunak & Sistem CMS', 'Pembangunan perangkat lunak kustom dan dasbor manajemen konten mandiri yang memudahkan pemilik bisnis mengelola sistemnya tanpa bergantung pada pengembang.'],
];
const tools = [
  { name: 'TypeScript', detail: 'Fondasi kode bertipe ketat', icon: Code2 },
  { name: 'C++', detail: 'Komputasi & algoritma kompetitif', icon: Terminal },
  { name: 'Next.js', detail: 'Arsitektur aplikasi web modern', icon: ArrowUpRight },
  { name: 'React', detail: 'Sistem komponen antarmuka', icon: Atom },
  { name: 'Tailwind CSS', detail: 'Sistem token desain & tata letak', icon: Wind },
  { name: 'Node.js', detail: 'Pemrosesan logika sisi server', icon: Box },
  { name: 'PostgreSQL', detail: 'Manajemen basis data terstruktur', icon: Database },
  { name: 'Figma', detail: 'Eksplorasi desain & prototipe UI/UX', icon: Component },
];

export default function Pedigree() {
  return (
    <section id="pedigree" className="section pedigree">
      <div className="shell">
        <SectionTitle number="02" label="Rekam jejak" title="Diasah di arena olimpiade," italic="diuji di proyek nyata.">
          Pemrograman kompetitif melatih satu hal: menemukan solusi paling tepat di bawah batasan
          yang ketat. Kebiasaan yang sama saya bawa ke setiap situs dan sistem yang saya bangun.
        </SectionTitle>

        <div className="medals">
          {content.achievements.map((a, i) => {
            const Icon = a.isGoldHighlight ? Medal : Award;
            return (
              <article key={a.id} className={`medal ${a.isGoldHighlight ? 'is-gold' : ''}`} data-reveal style={{ '--d': i } as React.CSSProperties}>
                <div className="medal-top">
                  <span className="medal-emblem" aria-hidden="true"><Icon size={26} strokeWidth={1.4} /></span>
                  <span className="mono">{a.year}</span>
                </div>
                <p className="medal-rank">{a.title}</p>
                <h3>{a.organization}</h3>
                <p>{a.description}</p>
                {a.highlightScore && <p className="medal-chip mono">{a.highlightScore}</p>}
              </article>
            );
          })}
        </div>

        <ol className="pillars">
          {pillars.map(([name, text], i) => (
            <li key={name} data-reveal style={{ '--d': i } as React.CSSProperties}>
              <span className="mono">0{i + 1}</span>
              <h3>{name}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ol>

        <article className="toolbox" data-reveal>
          <div className="toolbox-heading">
            <span className="mono">Perangkat kerja &amp; teknologi</span>
            <h3>Beragam teknologi modern <em>dalam satu ekosistem terpadu.</em></h3>
            <p>Mulai dari perancangan antarmuka awal hingga pengelolaan kueri basis data produksi.</p>
          </div>
          <ul className="tool-grid">
            {tools.map(({ name, detail, icon: Icon }, i) => (
              <li className="tool" key={name} style={{ '--i': i } as React.CSSProperties}>
                <Icon size={22} strokeWidth={1.4} aria-hidden="true" />
                <strong>{name}</strong>
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}
