'use client';
import { motion } from 'motion/react';
import { useScrollReveal } from '@/lib/useScrollReveal';
import {
  sectionLabelVariant,
  sectionHeadingVariant,
  sectionBodyVariant,
} from '@/lib/animations';

export default function SectionTitle({
  number,
  label,
  title,
  italic,
  children,
}: {
  number: string;
  label: string;
  title: string;
  italic: string;
  children: React.ReactNode;
}) {
  const { ref, controls } = useScrollReveal({ threshold: 0.2 });

  return (
    <>
      <motion.div
        ref={ref as React.RefObject<HTMLDivElement>}
        className="section-label"
        variants={sectionLabelVariant}
        initial="hidden"
        animate={controls}
      >
        <span className="mono">{number}</span>
        <span>{label}</span>
      </motion.div>

      {/* Keep section-intro wrapper intact so existing CSS grid/flex works */}
      <div className="section-intro">
        <motion.h2
          variants={sectionHeadingVariant}
          initial="hidden"
          animate={controls}
        >
          {title} <em>{italic}</em>
        </motion.h2>
        <motion.p
          variants={sectionBodyVariant}
          initial="hidden"
          animate={controls}
        >
          {children}
        </motion.p>
      </div>
    </>
  );
}
