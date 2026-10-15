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
        Skip to content
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
              <span>— developer &amp; designer</span>
            </motion.p>

            <motion.h1 variants={heroChild}>
              Crafting high-precision <em>web experiences.</em>
            </motion.h1>

            <motion.p className="hero-subheading" variants={heroChild}>
              And autonomous systems that put you in control.
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
                Explore masterpieces <span>↓</span>
              </a>
              <a className="text-link" href="#contact">
                Schedule a 1-on-1 <span>↗</span>
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
            Algorithmic logic <b>·</b> UI/UX craft <b>·</b> Full-stack
            architecture
          </span>
          <span className="mono">Scroll to explore ↓</span>
        </motion.div>

        <Pedigree />
        <Masterpieces projects={content.masterpieces} />
        <MiniWorkspace />
        <Contact />
      </main>

      <footer className="footer">
        <a className="brand" href="#top">
          <AAKLogo size={30} /><span style={{marginLeft:6}}>AAK<span style={{color:'var(--gold)'}}>.</span></span>
        </a>
        <span>© 2026 Ahmad Afataa Kusdianto</span>
        <span className="mono">
          Built with intent / {content.masterpieces.length} live systems
        </span>
      </footer>
    </>
  );
}
