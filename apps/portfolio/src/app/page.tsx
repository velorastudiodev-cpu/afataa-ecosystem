import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import Masterpieces from '@/components/Masterpieces';
import Pedigree from '@/components/Pedigree';
import Process from '@/components/Process';
import Lab from '@/components/Lab';
import Contact from '@/components/Contact';
import Reveal from '@/components/Reveal';
import { content } from '@/lib/content';

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main-content">Lewati ke konten utama</a>
      <div className="grain" aria-hidden="true" />
      <Navigation />
      <main id="main-content">
        <div id="top" />
        <Hero />
        <Masterpieces projects={content.masterpieces} />
        <Pedigree />
        <Process />
        <Lab />
        <Contact />
      </main>
      <footer className="footer">
        <div className="shell">
          <p className="footer-mark" aria-hidden="true">Afataa<b>.</b></p>
          <div className="footer-row">
            <span>© 2026 {content.profile.fullName}. Hak cipta dilindungi.</span>
            <span className="mono">{content.masterpieces.length} sistem produksi aktif · Dibangun dengan Next.js</span>
            <a href="#top">Kembali ke atas ↑</a>
          </div>
        </div>
      </footer>
      <Reveal />
    </>
  );
}
