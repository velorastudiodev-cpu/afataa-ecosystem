import SectionTitle from './SectionTitle';
import GraphField from './GraphField';

const steps = [
  ['Pemetaan', 'Kita mulai dari tujuan bisnis, calon pengguna, dan konten yang Anda miliki. Hasilnya ruang lingkup yang jelas sebelum satu baris kode ditulis.'],
  ['Rancangan', 'Struktur halaman, hierarki informasi, dan arah visual disusun lebih dulu, lalu disempurnakan bersama Anda.'],
  ['Pembangunan', 'Situs dibangun responsif dan ringan, lalu diuji di desktop maupun seluler sebelum diluncurkan.'],
  ['Serah kendali', 'Bila dibutuhkan, dasbor CMS kustom disiapkan agar Anda bisa memperbarui konten, layanan, dan harga secara mandiri.'],
];

export default function Process() {
  return (
    <section id="process" className="section process">
      <GraphField hud={false} className="graph-soft" />
      <div className="shell process-grid">
        <SectionTitle number="03" label="Proses kerja" title="Dari percakapan pertama hingga" italic="kendali penuh di tangan Anda." />
        <div className="timeline" data-reveal style={{ '--n': steps.length } as React.CSSProperties}>
          <span className="runner" aria-hidden="true"><i /></span>
          <ol className="steps">
            {steps.map(([name, text], i) => (
              <li key={name} style={{ '--d': i } as React.CSSProperties}>
                <span className="step-node" aria-hidden="true" />
                <span className="mono">Langkah 0{i + 1}</span>
                <h3>{name}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
