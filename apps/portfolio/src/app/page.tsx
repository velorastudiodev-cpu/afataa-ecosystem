import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import Reveal from '@/components/Reveal';
import Masterpieces from '@/components/Masterpieces';
import Pedigree from '@/components/Pedigree';
import Process from '@/components/Process';
import Lab from '@/components/Lab';
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
      </main>
      <Reveal />
    </>
  );
}
