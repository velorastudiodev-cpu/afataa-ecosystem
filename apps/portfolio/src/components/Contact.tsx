'use client';
import { useEffect, useState } from 'react';
import { ArrowUpRight, Check, Copy, Github, Instagram, Linkedin, Mail, MessageCircle, Video, CalendarDays, Hash } from 'lucide-react';
import type { Profile } from '@afataa/validators';
import { content } from '@/lib/content';

const topics = ['Situs web baru', 'Dasbor CMS mandiri', 'Desain ulang situs', 'Konsultasi teknis'];
const channels: { key: keyof Profile['socials']; name: string; icon: typeof Mail; copy?: boolean }[] = [
  { key: 'email', name: 'Email', icon: Mail, copy: true },
  { key: 'whatsapp', name: 'WhatsApp', icon: MessageCircle },
  { key: 'linkedin', name: 'LinkedIn', icon: Linkedin },
  { key: 'github', name: 'GitHub', icon: Github },
  { key: 'instagram', name: 'Instagram', icon: Instagram },
  { key: 'discord', name: 'Discord', icon: Hash, copy: true },
  { key: 'zoom', name: 'Zoom', icon: Video },
];
const dayName = new Intl.DateTimeFormat('id-ID', { weekday: 'short' });
const monthName = new Intl.DateTimeFormat('id-ID', { month: 'short' });
const isoDate = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
// Show the handle people will recognise, not the bare domain.
function handle(key: keyof Profile['socials'], value: string) {
  if (key === 'email' || key === 'discord') return value;
  if (key === 'zoom') return 'Ruang rapat daring';
  const last = new URL(value).pathname.split('/').filter(Boolean).pop() ?? value;
  if (key === 'whatsapp') return `+${last.slice(0, 2)} ${last.slice(2, 5)} ${last.slice(5, 9)} ${last.slice(9)}`;
  return key === 'instagram' ? `@${last}` : last;
}
const draft = (topic: string) => `Halo Afataa, saya tertarik membahas ${topic.toLowerCase()}. Secara singkat, kebutuhan saya adalah: `;

export default function Contact() {
  const { socials, calComLink, bookingVerified } = content.profile;
  const [topic, setTopic] = useState(topics[0]);
  const [message, setMessage] = useState(draft(topics[0]));
  const [copied, setCopied] = useState('');
  const [days, setDays] = useState<Date[]>([]);
  const calUrl = `https://cal.com/${calComLink}`;

  // Dates depend on the visitor's clock, so build them after hydration rather than at export time.
  useEffect(() => {
    const today = new Date();
    setDays(Array.from({ length: 14 }, (_, i) => new Date(today.getFullYear(), today.getMonth(), today.getDate() + i)));
  }, []);

  const pick = (t: string) => {
    // Only replace the message if the visitor has not written their own yet.
    if (message === draft(topic)) setMessage(draft(t));
    setTopic(t);
  };

  const copy = async (name: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(name);
      setTimeout(() => setCopied(''), 2000);
    } catch {
      setCopied('');
      prompt(`Salin ${name}:`, value);
    }
  };

  const href = (key: keyof Profile['socials'], value: string) =>
    key === 'email' ? `mailto:${value}` : key === 'whatsapp' ? `${value}?text=${encodeURIComponent(message)}` : key === 'discord' ? undefined : value;

  return (
    <section id="contact" className="section contact">
      <div className="shell">
        <p className="section-kicker mono" data-reveal><span>05</span>Kontak</p>
        <h2 className="contact-title" data-reveal style={{ '--d': 1 } as React.CSSProperties}>
          Punya proyek? <em>Mari bicara.</em>
        </h2>

        <div className="contact-grid">
          <form className="brief" data-reveal onSubmit={(e) => e.preventDefault()} aria-labelledby="brief-title">
            <h3 id="brief-title">Susun pesan singkat</h3>
            <fieldset>
              <legend className="mono">Apa yang ingin Anda bangun?</legend>
              <div className="chips">
                {topics.map((t) => (
                  <label key={t} className={`chip ${topic === t ? 'is-on' : ''}`}>
                    <input type="radio" name="topic" value={t} checked={topic === t} onChange={() => pick(t)} />
                    {t}
                  </label>
                ))}
              </div>
            </fieldset>
            <label className="mono" htmlFor="brief-message">Pesan</label>
            <textarea id="brief-message" rows={4} maxLength={800} value={message} onChange={(e) => setMessage(e.target.value)} />
            <div className="brief-actions">
              {socials.whatsapp && (
                <a className="btn btn-gold" href={`${socials.whatsapp}?text=${encodeURIComponent(message)}`} target="_blank" rel="noreferrer">
                  <MessageCircle size={17} /> Kirim via WhatsApp
                </a>
              )}
              {socials.email && (
                <a className="btn btn-ghost" href={`mailto:${socials.email}?subject=${encodeURIComponent(`Diskusi proyek — ${topic}`)}&body=${encodeURIComponent(message)}`}>
                  <Mail size={17} /> Kirim via Email
                </a>
              )}
            </div>
          </form>

          <div className="contact-side">
            {bookingVerified && (
              <div className="booking" data-reveal style={{ '--d': 1 } as React.CSSProperties}>
                <div className="booking-head">
                  <h3><CalendarDays size={18} /> Jadwalkan panggilan</h3>
                  <a className="link" href={calUrl} target="_blank" rel="noreferrer">Semua jadwal <ArrowUpRight size={14} /></a>
                </div>
                <p>Pilih tanggal, lalu tentukan jam yang tersedia di Cal.com.</p>
                <ul className="days" aria-label="Tanggal dua minggu ke depan">
                  {days.map((d, i) => (
                    <li key={isoDate(d)}>
                      <a href={`${calUrl}?date=${isoDate(d)}`} target="_blank" rel="noreferrer" aria-label={`Jadwalkan pada ${d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}`}>
                        <span>{i === 0 ? 'Hari ini' : dayName.format(d)}</span>
                        <b>{d.getDate()}</b>
                        <span>{monthName.format(d)}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <ul className="channels" data-reveal style={{ '--d': 2 } as React.CSSProperties}>
              {channels.map(({ key, name, icon: Icon, copy: canCopy }) => {
                const value = socials[key];
                if (!value) return null;
                const link = href(key, value);
                const shown = handle(key, value);
                return (
                  <li key={key}>
                    {link ? (
                      <a href={link} target={key === 'email' ? undefined : '_blank'} rel="noreferrer">
                        <Icon size={18} /><span>{name}</span><span className="mono">{shown}</span><ArrowUpRight size={15} />
                      </a>
                    ) : (
                      <span className="channel-static"><Icon size={18} /><span>{name}</span><span className="mono">{shown}</span></span>
                    )}
                    {canCopy && (
                      <button className="icon-btn" onClick={() => copy(name, value)} aria-label={`Salin ${name}`}>
                        {copied === name ? <Check size={15} /> : <Copy size={15} />}
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
            <p className="sr-only" aria-live="polite">{copied && `${copied} tersalin`}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
