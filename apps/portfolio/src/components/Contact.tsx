'use client';
import dynamic from 'next/dynamic';
import {
  ArrowUpRight,
  Copy,
  Mail,
  MessageCircle,
  Instagram,
  Linkedin,
  Github,
  Video,
  Check,
  CalendarDays,
  ArrowRight,
} from 'lucide-react';
import { useState } from 'react';
import { motion } from 'motion/react';
import { content } from '@/lib/content';
import type { Profile } from '@afataa/validators';
import { useScrollReveal } from '@/lib/useScrollReveal';
import {
  contactCopy,
  contactHub,
  socialCardContainer,
  socialCard,
} from '@/lib/animations';

const BookingEmbed = dynamic(() => import('./BookingEmbed'), {
  ssr: false,
  loading: () => <p role="status">Loading calendar…</p>,
});

const channels = [
  { name: 'GitHub', detail: 'Code & contributions', key: 'github', icon: Github },
  { name: 'LinkedIn', detail: 'Professional network', key: 'linkedin', icon: Linkedin },
  { name: 'Instagram', detail: 'Visual notes & work', key: 'instagram', icon: Instagram },
  { name: 'WhatsApp', detail: 'Start a conversation', key: 'whatsapp', icon: MessageCircle },
  { name: 'Discord', detail: 'Not shared yet', key: 'discord', icon: MessageCircle },
  { name: 'Zoom', detail: 'By arrangement', key: 'zoom', icon: Video },
  { name: 'Email', detail: 'velorastudiodev@gmail.com', key: 'email', icon: Mail },
] as const;

export default function Contact() {
  const { profile } = content;
  const socials = profile.socials;
  const email = socials.email;

  const [copied, setCopied] = useState('');
  const [status, setStatus] = useState('');
  const [topic, setTopic] = useState('A new website');
  const [embed, setEmbed] = useState(false);

  const message = `Hi Ahmad, I'd like to discuss ${topic.toLowerCase()}. Could we arrange a discovery call?`;
  const emailUrl = email
    ? `mailto:${email}?subject=${encodeURIComponent('Project enquiry — ' + topic)}&body=${encodeURIComponent(message)}`
    : undefined;
  const whatsappUrl = socials.whatsapp
    ? `${socials.whatsapp}?text=${encodeURIComponent(message)}`
    : undefined;

  async function copy(key: string, value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      setStatus(`${key} copied`);
      setTimeout(() => setCopied(''), 2200);
    } catch {
      setStatus(`Copy manually: ${value}`);
    }
  }

  function link(key: keyof Profile['socials'], value: string) {
    return key === 'email'
      ? `mailto:${value}`
      : key === 'whatsapp'
      ? `${value}?text=${encodeURIComponent(message)}`
      : value;
  }

  // Two independent reveals: copy from left, hub from right
  const copyReveal = useScrollReveal({ threshold: 0.15 });
  const hubReveal = useScrollReveal({ threshold: 0.12 });

  return (
    <section id="contact" className="section contact">
      <div className="section-label">
        <span className="mono">04</span>
        <span>Open channel</span>
      </div>

      <div className="contact-layout">
        {/* Copy — slides in from the left */}
        <motion.div
          className="contact-copy"
          ref={copyReveal.ref as React.RefObject<HTMLDivElement>}
          variants={contactCopy}
          initial="hidden"
          animate={copyReveal.controls}
        >
          <h2>
            Let's make the
            <br />
            <em>next thing clear.</em>
          </h2>
          <p>
            Have a product to shape, a system to simplify, or a difficult
            problem worth solving? Let's talk it through.
          </p>
          <div className="contact-actions">
            <a className="button" href={emailUrl}>
              Start a conversation
              <ArrowUpRight size={16} />
            </a>
            {email && (
              <button className="text-link" onClick={() => copy('Email', email)}>
                {copied === 'Email' ? <Check size={15} /> : <Copy size={15} />}
                Copy email
              </button>
            )}
          </div>
          <div className="contact-signature">
            <span className="signature-mark">aak.</span>
            <div>
              <strong>Ahmad Afataa Kusdianto</strong>
              <span>Web · Design · Software</span>
            </div>
          </div>
        </motion.div>

        {/* Hub — slides in from the right, social cards stagger in */}
        <motion.div
          className="contact-hub"
          ref={hubReveal.ref as React.RefObject<HTMLDivElement>}
          variants={contactHub}
          initial="hidden"
          animate={hubReveal.controls}
        >
          <div className="booking-card">
            <div className="booking-card-head">
              <span className="mono">Let's find a time</span>
              <CalendarDays size={20} />
            </div>
            <h3>
              A conversation.
              <br />
              <em>A clear starting point.</em>
            </h3>
            <p>
              Tell me what you have in mind. We'll arrange a time to discuss
              the brief, scope, and next steps.
            </p>
            <label className="field-label" htmlFor="enquiry-topic">
              What are you working on?
            </label>
            <select
              id="enquiry-topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            >
              <option>A new website</option>
              <option>An interface redesign</option>
              <option>A custom software system</option>
              <option>A technical consultation</option>
            </select>
            <div className="booking-links">
              {whatsappUrl && (
                <a href={whatsappUrl} target="_blank" rel="noreferrer">
                  <MessageCircle size={16} />
                  Discuss on WhatsApp
                  <ArrowUpRight size={14} />
                </a>
              )}
              {emailUrl && (
                <a href={emailUrl}>
                  <Mail size={16} />
                  Send a brief
                  <ArrowRight size={14} />
                </a>
              )}
            </div>
            {profile.bookingVerified ? (
              <>
                <button
                  className="text-link calendar-toggle"
                  onClick={() => setEmbed(!embed)}
                >
                  {embed ? 'Hide' : 'Open'} booking calendar
                  <CalendarDays size={15} />
                </button>
                {embed && <BookingEmbed slug={profile.calComLink} />}
              </>
            ) : (
              <p className="booking-note">
                Appointments arranged by message. Online calendar coming later.
              </p>
            )}
          </div>

          {/* Social grid — staggered pop-in */}
          <motion.div
            className="social-grid"
            variants={socialCardContainer}
            initial="hidden"
            animate={hubReveal.controls}
          >
            {channels.map(({ name, detail, key, icon: Icon }) => {
              const value = socials[key];
              return (
                <motion.div
                  key={key}
                  className={`social-card ${value ? '' : 'inactive'}`}
                  variants={socialCard}
                >
                  <span className="social-icon">
                    <Icon size={17} />
                  </span>
                  {value && key !== 'discord' ? (
                    <a
                      className="social-main"
                      href={link(key, value)}
                      target={key === 'email' ? undefined : '_blank'}
                      rel={key === 'email' ? undefined : 'noreferrer'}
                    >
                      <b>
                        {name}
                        <ArrowUpRight size={12} />
                      </b>
                      <small>{detail}</small>
                    </a>
                  ) : (
                    <div className="social-main">
                      <b>{name}</b>
                      <small>{value || detail}</small>
                    </div>
                  )}
                  {value && (
                    <button
                      className="icon-button copy-channel"
                      aria-label={`Copy ${name}`}
                      onClick={() =>
                        copy(name, key === 'whatsapp' ? '+6685179681576' : value)
                      }
                    >
                      {copied === name ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  )}
                </motion.div>
              );
            })}
          </motion.div>

          <p className="copy-status" role="status">
            {status}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
