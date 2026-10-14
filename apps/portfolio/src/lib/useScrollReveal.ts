'use client';

/**
 * useScrollReveal — triggers Framer Motion's "visible" state when an element
 * enters the viewport. Respects prefers-reduced-motion automatically.
 *
 * Usage:
 *   const { ref, controls } = useScrollReveal();
 *   <motion.div ref={ref} variants={myVariants} initial="hidden" animate={controls} />
 */

import { useEffect } from 'react';
import { useInView } from 'motion/react';
import { useAnimation, useReducedMotion } from 'motion/react';
import { useRef } from 'react';

interface Options {
  /** Fraction of element that must be visible (default 0.15) */
  threshold?: number;
  /** Only trigger once (default true) */
  once?: boolean;
}

export function useScrollReveal({ threshold = 0.15, once = true }: Options = {}) {
  const ref = useRef<HTMLElement>(null);
  const controls = useAnimation();
  const reduced = useReducedMotion();
  const inView = useInView(ref as React.RefObject<Element>, { amount: threshold, once });

  useEffect(() => {
    if (inView || reduced) {
      controls.start('visible');
    } else if (!once) {
      controls.start('hidden');
    }
  }, [inView, reduced, controls, once]);

  return { ref, controls };
}
