'use client';
import { motion } from 'motion/react';
import { useScrollReveal } from '@/lib/useScrollReveal';
import {
  heroContainer,
  heroChild,
  heroRule,
} from '@/lib/animations';
import Navigation from '@/components/Navigation';
import Crystal from '@/components/Crystal';
import Pedigree from '@/components/Pedigree';
import Masterpieces from '@/components/Masterpieces';
import MiniWorkspace from '@/components/MiniWorkspace';
import Contact from '@/components/Contact';
import FooterCalendar from '@/components/FooterCalendar';
import AAKLogo from '@/components/AAKLogo';
import { content } from '@/lib/content';

export default function Home() {
  const heroReveal = useScrollReveal({ threshold: 0.05, once: true });
  const ruleReveal = useScrollReveal({ threshold: 0.8, once: true });

  return (
    <>
      <div className="grain" aria-hidden="true" />
      <Navigation />
      <a className="skip-link" href="#main-content">
        Lewati ke konten utama
      </a>
      <main id="main-content">
        <div id="top" />

        {/* ── Hero ── */}
        <section id="hero" className="hero section-grid">
          <motion.div
            className="hero-copy"
            ref={heroReveal.ref as React.RefObject<HTMLDivElement>}
            variants={heroContainer}
            initial="hidden"
            animate={heroReveal.controls}
          >
            <motion.div className="eyebrow" variants={heroChild}>
              <span>✦</span>
              {content.profile.headlineBadge}
            </motion.div>

            <motion.p className="hero-name" variants={heroChild}>
              Ahmad Afataa Kusdianto{' '}
              <span>— Pengembang Web &amp; Desainer Sistem Digital</span>
            </motion.p>

            <motion.h1 variants={heroChild}>
              Merancang Pengalaman Situs Web <em>Berpresisi Tinggi.</em>
            </motion.h1>

            <motion.p className="hero-subheading" variants={heroChild}>
              Serta Sistem Perangkat Lunak Mandiri yang Memberikan Kendali Penuh di Tangan Anda.
            </motion.p>

            <motion.p className="hero-lede" variants={heroChild}>
              {content.profile.shortBio}
            </motion.p>

            <motion.div className="role-row" variants={heroChild}>
              {content.profile.roles.map((r) => (
                <span key={r}>{r}</span>
              ))}
            </motion.div>

            <motion.div className="hero-actions" variants={heroChild}>
              <a className="button" href="#work">
                Jelajahi Karya Unggulan <span>↓</span>
              </a>
              <a className="text-link" href="#contact">
                Jadwalkan Sesi Konsultasi <span>↗</span>
              </a>
            </motion.div>

            <motion.div className="hero-meta" variants={heroChild}>
              <span className="availability-dot" />{' '}
              {content.profile.availabilityText}
              <span className="mono">/ 2026</span>
            </motion.div>
          </motion.div>

          <Crystal />
        </section>

        {/* ── Ticker bar ── */}
        <motion.div
          className="hero-rule"
          ref={ruleReveal.ref as React.RefObject<HTMLDivElement>}
          variants={heroRule}
          initial="hidden"
          animate={ruleReveal.controls}
        >
          <span className="mono">AAK / 001</span>
          <span>
            Logika Algoritmik <b>·</b> Desain Antarmuka (UI/UX) <b>·</b> Arsitektur
            Sistem Menyeluruh
          </span>
          <span className="mono">Gulir untuk Menjelajahi ↓</span>
        </motion.div>

        <Pedigree />
        <Masterpieces projects={content.masterpieces} />
        <MiniWorkspace />
        <Contact />
      </main>

      <footer className="footer">
        <FooterCalendar calLink={content.profile.calComLink} />
        <div className="footer-bottom">
          <a className="brand" href="#top">
            <AAKLogo size={30} /><span style={{marginLeft:6}}>AAK<span style={{color:'var(--gold)'}}>.</span></span>
          </a>
          <span>© 2026 Ahmad Afataa Kusdianto. Hak Cipta Dilindungi.</span>
          <span className="mono">
            Dirancang dengan Presisi Tinggi · {content.masterpieces.length} Sistem Produksi Aktif
          </span>
        </div>
      </footer>
    </>
  );
}
