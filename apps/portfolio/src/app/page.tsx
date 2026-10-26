import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import Reveal from '@/components/Reveal';

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main-content">Lewati ke konten utama</a>
      <div className="grain" aria-hidden="true" />
      <Navigation />
      <main id="main-content">
        <div id="top" />
        <Hero />
      </main>
      <Reveal />
    </>
  );
}
