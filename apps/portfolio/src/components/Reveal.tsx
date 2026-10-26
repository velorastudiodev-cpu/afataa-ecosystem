'use client';
import { useEffect } from 'react';

/** Adds `.in` to every [data-reveal] element as it scrolls into view. Renders nothing. */
export default function Reveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        observer.unobserve(e.target);
      }),
      { rootMargin: '0px 0px -10% 0px', threshold: 0.08 },
    );
    document.querySelectorAll('[data-reveal]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return null;
}
