'use client';
import { useEffect, useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import AAKLogo from './AAKLogo';

const links = [
  ['Karya', 'work'],
  ['Rekam Jejak', 'pedigree'],
  ['Proses', 'process'],
  ['Lab', 'lab'],
  ['Kontak', 'contact'],
] as const;

export default function Navigation() {
  const [open, setOpen] = useState(false), [active, setActive] = useState(''), [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-35% 0px -55% 0px' },
    );
    ['hero', ...links.map(([, id]) => id)].forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    const onScroll = () => setScrolled(scrollY > 24);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    onScroll();
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('keydown', onKey);
    return () => { observer.disconnect(); removeEventListener('scroll', onScroll); removeEventListener('keydown', onKey); };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('menu-locked', open);
  }, [open]);

  return (
    <header className={`nav ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`}>
      <a className="brand" href="#top" aria-label="Ahmad Afataa Kusdianto, ke awal halaman">
        <AAKLogo size={30} />
        <span>Afataa<b>.</b></span>
      </a>
      <nav id="nav-links" className="nav-links" aria-label="Navigasi utama">
        {links.map(([name, id], i) => (
          <a key={id} href={`#${id}`} aria-current={active === id ? 'location' : undefined} onClick={() => setOpen(false)}>
            <span className="mono">0{i + 1}</span>{name}
          </a>
        ))}
      </nav>
      <a className="btn btn-light nav-cta" href="#contact">Mulai Proyek <ArrowUpRight size={15} /></a>
      <button
        className="menu-toggle"
        aria-controls="nav-links"
        aria-expanded={open}
        aria-label={open ? 'Tutup menu' : 'Buka menu'}
        onClick={() => setOpen(!open)}
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>
    </header>
  );
}
