'use client';
import { motion } from 'motion/react';
import { useScrollReveal } from '@/lib/useScrollReveal';
import {
  Award,
  Braces,
  PenTool,
  Layers,
  Code2,
  Database,
  Atom,
  Wind,
  Box,
  Terminal,
  Component,
  ArrowUpRight,
} from 'lucide-react';
import SectionTitle from './SectionTitle';
import { content } from '@/lib/content';
import {
  pedigreeAchievement,
  pedigreePillars,
  pedigreeToolbox,
  toolItemContainer,
  toolItem,
} from '@/lib/animations';

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
  const achievementReveal = useScrollReveal({ threshold: 0.15 });
  const pillarsReveal = useScrollReveal({ threshold: 0.15 });
  const toolboxReveal = useScrollReveal({ threshold: 0.1 });

  return (
    <section id="pedigree" className="section pedigree">
      <SectionTitle
        number="01"
        label="Rekam jejak algoritmik & keahlian"
        title="Keunggulan teknis yang terbukti di setiap"
        italic="detail."
      >
        Presisi adalah standar kerja yang dibangun melalui latihan ketat. Mulai dari
        pemrograman kompetitif tingkat nasional hingga arsitektur sistem klien, setiap
        keputusan teknis dirancang dengan landasan yang terukur.
      </SectionTitle>

      <div className="pedigree-grid">
        {/* Achievement panel — slides from left with a slight tilt */}
        <motion.article
          className="achievement-panel"
          ref={achievementReveal.ref as React.RefObject<HTMLElement>}
          variants={pedigreeAchievement}
          initial="hidden"
          animate={achievementReveal.controls}
        >
          <div className="card-top">
            <span className="mono">Kompetisi informatika &amp; algoritma</span>
            <span className="year">2026</span>
          </div>
          <div className="achievement-main">
            <div className="medallion">
              <Award size={33} strokeWidth={1} />
              <strong>01</strong>
              <span>OSN–K</span>
            </div>
            <div>
              <h3>
                Peraih skor tertinggi
                <br />
                <em>&amp; standar medali emas.</em>
              </h3>
              <p>
                Ketepatan logika algoritmik
                <br />
                yang teruji dalam batasan ketat.
              </p>
            </div>
          </div>
          <div className="achievement-records">
            {content.achievements.map((a, i) => (
              <div className="achievement-record" key={a.id}>
                <span className={`record-dot ${i === 1 ? 'blue' : ''}`} />
                <div>
                  <h4>{a.rankOrMedal}</h4>
                  <p>{a.organization}</p>
                  <span className="record-detail">
                    {i === 0
                      ? 'Peraih skor tertinggi · Algoritma, struktur data & teori graf'
                      : 'Pemecahan masalah komputasi tingkat lanjut'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.article>

        {/* Pillars panel — slides from right with opposite tilt */}
        <motion.article
          className="pillars-panel"
          ref={pillarsReveal.ref as React.RefObject<HTMLElement>}
          variants={pedigreePillars}
          initial="hidden"
          animate={pillarsReveal.controls}
        >
          <span className="mono">Tiga pilar pengembangan solusi digital</span>
          {[
            {
              icon: PenTool,
              name: 'Desainer Web & Antarmuka (UI/UX)',
              text: 'Sistem visual yang dirancang dengan tujuan terukur, tipografi yang proporsional, hierarki informasi yang jernih, serta alur navigasi pengguna yang intuitif.',
            },
            {
              icon: Braces,
              name: 'Pengembang Situs Web Modern',
              text: 'Pengembangan antarmuka web responsif yang mengutamakan kecepatan muat halaman, kejelasan struktur kode, dan kenyamanan pengguna di berbagai perangkat.',
            },
            {
              icon: Layers,
              name: 'Pengembang Perangkat Lunak & Sistem CMS',
              text: 'Pembangunan perangkat lunak kustom dan dasbor manajemen konten mandiri yang memudahkan pemilik bisnis mengelola sistemnya tanpa bergantung pada pengembang.',
            },
          ].map(({ icon: Icon, name, text }, i) => (
            <div className="pillar" key={name}>
              <div className="pillar-icon">
                <Icon size={22} strokeWidth={1.3} />
              </div>
              <div>
                <span className="mono">0{i + 1}</span>
                <h3>{name}</h3>
                <p>{text}</p>
              </div>
            </div>
          ))}
        </motion.article>

        {/* Toolbox — pops up from below with staggered tool badges */}
        <motion.article
          className="toolbox"
          ref={toolboxReveal.ref as React.RefObject<HTMLElement>}
          variants={pedigreeToolbox}
          initial="hidden"
          animate={toolboxReveal.controls}
        >
          <div className="toolbox-heading">
            <span className="mono">Perangkat kerja &amp; teknologi</span>
            <h3>
              Beragam teknologi modern
              <br />
              <em>dalam satu ekosistem terpadu.</em>
            </h3>
            <p>Mulai dari perancangan antarmuka awal hingga pengelolaan kueri basis data produksi.</p>
          </div>
          <motion.div
            className="tool-grid"
            variants={toolItemContainer}
            initial="hidden"
            animate={toolboxReveal.controls}
          >
            {tools.map(({ name, detail, icon: Icon }) => (
              <motion.div className="tool" key={name} variants={toolItem}>
                <Icon size={23} strokeWidth={1.35} />
                <strong>{name}</strong>
                <span>{detail}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.article>
      </div>
    </section>
  );
}
