/**
 * animations.ts — Centralized animation variants for Framer Motion (motion/react).
 * Each section gets a distinct personality: no two sections animate the same way.
 */

import type { Variants } from 'motion/react';

// ─── Shared easing curves ────────────────────────────────────────────────────

export const SPRING_SOFT = { type: 'spring', stiffness: 180, damping: 24 } as const;
export const SPRING_SNAPPY = { type: 'spring', stiffness: 320, damping: 28 } as const;
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

// ─── Hero section ────────────────────────────────────────────────────────────
// Staggered children rising from below, each with a slight blur-in for depth.

export const heroContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.11, delayChildren: 0.1 },
  },
};

export const heroChild: Variants = {
  hidden: { opacity: 0, y: 28, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.75, ease: EASE_OUT_EXPO },
  },
};

// ─── Hero rule / ticker bar ──────────────────────────────────────────────────
// Clips in from the left edge — feels like a print/reveal.

export const heroRule: Variants = {
  hidden: { scaleX: 0, originX: 0, opacity: 0 },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: { duration: 0.9, ease: EASE_OUT_EXPO, delay: 0.6 },
  },
};

// ─── Pedigree section ────────────────────────────────────────────────────────
// Cards slide in from different directions — achievement from left, pillars
// from the right, toolbox rising from below with a pop.

export const pedigreeAchievement: Variants = {
  hidden: { opacity: 0, x: -60, rotate: -1.5 },
  visible: {
    opacity: 1,
    x: 0,
    rotate: 0,
    transition: { ...SPRING_SOFT, delay: 0.1 },
  },
};

export const pedigreePillars: Variants = {
  hidden: { opacity: 0, x: 60, rotate: 1.5 },
  visible: {
    opacity: 1,
    x: 0,
    rotate: 0,
    transition: { ...SPRING_SOFT, delay: 0.2 },
  },
};

export const pedigreeToolbox: Variants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { ...SPRING_SNAPPY, delay: 0.3 },
  },
};

export const toolItemContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.055, delayChildren: 0.45 } },
};

export const toolItem: Variants = {
  hidden: { opacity: 0, scale: 0.7, y: 12 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { ...SPRING_SNAPPY },
  },
};

// ─── SectionTitle ────────────────────────────────────────────────────────────
// Number label clips up, then heading word-by-word, then body fades.

export const sectionLabelVariant: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: EASE_OUT_EXPO },
  },
};

export const sectionHeadingVariant: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: EASE_OUT_EXPO, delay: 0.1 },
  },
};

export const sectionBodyVariant: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: EASE_OUT_EXPO, delay: 0.22 },
  },
};

// ─── Masterpieces section ────────────────────────────────────────────────────
// Already has its own AnimatePresence. The section wrapper does a "curtain"
// effect — fades in with a vertical clip (clipPath reveal from top).

export const masterpiecesSection: Variants = {
  hidden: { opacity: 0, clipPath: 'inset(6% 0% 0% 0%)' },
  visible: {
    opacity: 1,
    clipPath: 'inset(0% 0% 0% 0%)',
    transition: { duration: 0.9, ease: EASE_OUT_EXPO },
  },
};

export const projectGridItem: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { ...SPRING_SOFT, delay: 0.15 + i * 0.12 },
  }),
};

// ─── MiniWorkspace section ───────────────────────────────────────────────────
// Diagonal slide — enters from the bottom-right corner with a skew twist.

export const workspaceSection: Variants = {
  hidden: { opacity: 0, x: 40, skewX: '-1.5deg' },
  visible: {
    opacity: 1,
    x: 0,
    skewX: '0deg',
    transition: { duration: 0.85, ease: EASE_OUT_EXPO },
  },
};

export const workspaceTabs: Variants = {
  hidden: { opacity: 0, y: -12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE_OUT_EXPO, delay: 0.3 },
  },
};

// ─── Contact section ─────────────────────────────────────────────────────────
// Split: copy fades in from left, hub from right. Social cards pop in stagger.

export const contactCopy: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { ...SPRING_SOFT, delay: 0.1 },
  },
};

export const contactHub: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { ...SPRING_SOFT, delay: 0.2 },
  },
};

export const socialCardContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.35 } },
};

export const socialCard: Variants = {
  hidden: { opacity: 0, scale: 0.88, y: 8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { ...SPRING_SNAPPY },
  },
};

// ─── Footer ──────────────────────────────────────────────────────────────────

export const footerVariant: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.1 },
  },
};
