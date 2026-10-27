'use client';
import { useState } from 'react';
import { Check, Copy, ArrowUpRight } from 'lucide-react';

const tones = {
  sky: { name: 'Biru Langit', accent: '#7fb2e5', surface: '#0f1d33', text: '#eaf0f8', muted: '#9aa9bf', on: '#07101f' },
  snow: { name: 'Biru Salju', accent: '#3b82c4', surface: '#f2f7fc', text: '#0f172a', muted: '#475569', on: '#ffffff' },
  gold: { name: 'Emas Sampanye', accent: '#d4af6a', surface: '#17140e', text: '#f5ecd9', muted: '#b5a68a', on: '#1a1408' },
};
type Tone = keyof typeof tones;

export default function TokenStudio() {
  const [radius, setRadius] = useState(18);
  const [pad, setPad] = useState(24);
  const [tone, setTone] = useState<Tone>('sky');
  const [copied, setCopied] = useState<'ok' | 'fail' | ''>('');
  const t = tones[tone];
  const tokens: [string, string][] = [['--radius', `${radius}px`], ['--padding', `${pad}px`], ['--accent', t.accent], ['--surface', t.surface], ['--text', t.text]];
  const css = `.card {\n${tokens.map(([k, v]) => `  ${k}: ${v};`).join('\n')}\n}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(css);
      setCopied('ok');
      setTimeout(() => setCopied(''), 2000);
    } catch {
      setCopied('fail');
    }
  };

  return (
    <div className="studio">
      <div className="studio-controls">
        <label className="range-label" htmlFor="radius">Radius sudut <output>{radius}px</output></label>
        <input id="radius" type="range" min={0} max={40} value={radius} onChange={(e) => setRadius(Number(e.target.value))} />
        <label className="range-label" htmlFor="padding">Kepadatan <output>{pad}px</output></label>
        <input id="padding" type="range" min={12} max={36} step={2} value={pad} onChange={(e) => setPad(Number(e.target.value))} />
        <fieldset className="tones">
          <legend>Warna aksen utama</legend>
          {(Object.keys(tones) as Tone[]).map((k) => (
            <label key={k} className={tone === k ? 'is-on' : ''}>
              <input type="radio" name="tone" value={k} checked={tone === k} onChange={() => setTone(k)} />
              <span className="swatch" style={{ background: tones[k].accent, boxShadow: `inset 0 0 0 3px ${tones[k].surface}` }} />
              {tones[k].name}
            </label>
          ))}
        </fieldset>
      </div>

      <div
        className="studio-stage"
        style={{ '--r': `${radius}px`, '--pad': `${pad}px`, '--accent': t.accent, '--surface': t.surface, '--text': t.text, '--muted': t.muted, '--on': t.on } as React.CSSProperties}
      >
        <article className="token-card" aria-label="Pratinjau komponen dengan token saat ini">
          <img src="/projects/ikbar-640.webp" alt="" width={640} height={445} loading="lazy" decoding="async" />
          <div className="token-body">
            <span className="token-chip">Etalase digital</span>
            <h4>Ikbar Barbershop</h4>
            <p>Katalog layanan, harga transparan, dan reservasi yang cepat dari layar mana pun.</p>
            <div className="token-actions" aria-hidden="true">
              <span className="token-primary">Pesan jadwal <ArrowUpRight size={14} /></span>
              <span className="token-ghost">Detail</span>
            </div>
          </div>
        </article>

        <div className="token-code">
          <pre aria-label="Token CSS">
            <code>
              <span className="c-sel">.card</span> {'{\n'}
              {tokens.map(([k, v]) => (
                <span key={k}>{'  '}<span className="c-key">{k}</span>: <span className="c-val">{v}</span>;{'\n'}</span>
              ))}
              {'}'}
            </code>
          </pre>
          <button className="btn btn-light btn-sm" onClick={copy}>
            {copied === 'ok' ? <Check size={15} /> : <Copy size={15} />} {copied === 'ok' ? 'Token tersalin' : 'Salin Token CSS'}
          </button>
          <p className={copied === 'fail' ? 'studio-note' : 'sr-only'} aria-live="polite">
            {copied === 'ok' ? 'Token CSS tersalin' : copied === 'fail' ? 'Browser menolak akses papan klip. Salin manual dari blok kode di atas.' : ''}
          </p>
        </div>
      </div>
    </div>
  );
}
