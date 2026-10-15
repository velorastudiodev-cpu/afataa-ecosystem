'use client';
import { motion } from 'motion/react';
import { useScrollReveal } from '@/lib/useScrollReveal';
import {
  Award,
  Braces,
  PenTool,
  Layers,
  Code2,
  Database,
  Atom,
  Wind,
  Box,
  Terminal,
  Component,
  ArrowUpRight,
} from 'lucide-react';
import SectionTitle from './SectionTitle';
import { content } from '@/lib/content';
import {
  pedigreeAchievement,
  pedigreePillars,
  pedigreeToolbox,
  toolItemContainer,
  toolItem,
} from '@/lib/animations';

const tools = [
  { name: 'TypeScript', detail: 'Typed foundations', icon: Code2 },
  { name: 'C++', detail: 'Competitive logic', icon: Terminal },
  { name: 'Next.js', detail: 'Web architecture', icon: ArrowUpRight },
  { name: 'React', detail: 'Interface systems', icon: Atom },
  { name: 'Tailwind', detail: 'Design tokens', icon: Wind },
  { name: 'Node.js', detail: 'Server-side logic', icon: Box },
  { name: 'PostgreSQL', detail: 'Structured data', icon: Database },
  { name: 'Figma', detail: 'Design exploration', icon: Component },
];

export default function Pedigree() {
  const achievementReveal = useScrollReveal({ threshold: 0.15 });
  const pillarsReveal = useScrollReveal({ threshold: 0.15 });
  const toolboxReveal = useScrollReveal({ threshold: 0.1 });

  return (
    <section id="pedigree" className="section pedigree">
      <SectionTitle
        number="01"
        label="Algorithmic pedigree"
        title="Proof in the"
        italic="details."
      >
        Precision is a practice. From competitive programming to client
        systems, every decision has a reason.
      </SectionTitle>

      <div className="pedigree-grid">
        {/* Achievement panel — slides from left with a slight tilt */}
        <motion.article
          className="achievement-panel"
          ref={achievementReveal.ref as React.RefObject<HTMLElement>}
          variants={pedigreeAchievement}
          initial="hidden"
          animate={achievementReveal.controls}
        >
          <div className="card-top">
            <span className="mono">Competitive informatics</span>
            <span className="year">2026</span>
          </div>
          <div className="achievement-main">
            <div className="medallion">
              <Award size={33} strokeWidth={1} />
              <strong>01</strong>
              <span>OSN–K</span>
            </div>
            <div>
              <h3>
                Highest score.
                <br />
                <em>Gold standard.</em>
              </h3>
              <p>
                Algorithmic precision,
                <br />
                tested under pressure.
              </p>
            </div>
          </div>
          <div className="achievement-records">
            {content.achievements.map((a, i) => (
              <div className="achievement-record" key={a.id}>
                <span className={`record-dot ${i === 1 ? 'blue' : ''}`} />
                <div>
                  <h4>{a.rankOrMedal}</h4>
                  <p>{a.organization}</p>
                  <span className="record-detail">
                    {i === 0
                      ? 'Highest score · Algorithms, data structures & graph theory'
                      : 'Advanced computational problem-solving'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.article>

        {/* Pillars panel — slides from right with opposite tilt */}
        <motion.article
          className="pillars-panel"
          ref={pillarsReveal.ref as React.RefObject<HTMLElement>}
          variants={pedigreePillars}
          initial="hidden"
          animate={pillarsReveal.controls}
        >
          <span className="mono">Three ways I build</span>
          {[
            {
              icon: PenTool,
              name: 'Web Designer',
              text: 'A visual system with purpose. Measured typography, clear hierarchy, intuitive journeys.',
            },
            {
              icon: Braces,
              name: 'Web Developer',
              text: 'Responsive interfaces built around performance, clarity, and the person using them.',
            },
            {
              icon: Layers,
              name: 'Software Developer',
              text: 'Self-service tools and custom systems that put the controls in your hands.',
            },
          ].map(({ icon: Icon, name, text }, i) => (
            <div className="pillar" key={name}>
              <div className="pillar-icon">
                <Icon size={22} strokeWidth={1.3} />
              </div>
              <div>
                <span className="mono">0{i + 1}</span>
                <h3>{name}</h3>
                <p>{text}</p>
              </div>
            </div>
          ))}
        </motion.article>

        {/* Toolbox — pops up from below with staggered tool badges */}
        <motion.article
          className="toolbox"
          ref={toolboxReveal.ref as React.RefObject<HTMLElement>}
          variants={pedigreeToolbox}
          initial="hidden"
          animate={toolboxReveal.controls}
        >
          <div className="toolbox-heading">
            <span className="mono">The workbench</span>
            <h3>
              Different tools.
              <br />
              <em>One considered system.</em>
            </h3>
            <p>From the first sketch to the final query.</p>
          </div>
          <motion.div
            className="tool-grid"
            variants={toolItemContainer}
            initial="hidden"
            animate={toolboxReveal.controls}
          >
            {tools.map(({ name, detail, icon: Icon }) => (
              <motion.div className="tool" key={name} variants={toolItem}>
                <Icon size={23} strokeWidth={1.35} />
                <strong>{name}</strong>
                <span>{detail}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.article>
      </div>
    </section>
  );
}
