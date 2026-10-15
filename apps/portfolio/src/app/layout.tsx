import type { Metadata } from 'next';
import './globals.css';

const origin = 'https://afataa-ecosystem.vercel.app';
const title = 'Ahmad Afataa Kusdianto — Pengembang Web, Desainer UI/UX & Pengembang Perangkat Lunak';
const description = 'Portofolio resmi Ahmad Afataa Kusdianto, peraih Medali Emas OSN Informatika serta pengembang web dan perangkat lunak spesialis situs web modern, sistem CMS mandiri, dan desain antarmuka presisi tinggi.';

export const metadata: Metadata = {
  title,
  description,
  metadataBase: new URL(origin),
  alternates: { canonical: '/' },
  keywords: ['Ahmad Afataa Kusdianto', 'pengembang web', 'desainer UI/UX', 'pengembang perangkat lunak', 'pengembangan situs web', 'sistem CMS kustom', 'Next.js', 'React', 'OSN Informatika'],
  authors: [{ name: 'Ahmad Afataa Kusdianto' }],
  creator: 'Ahmad Afataa Kusdianto',
  publisher: 'Ahmad Afataa Kusdianto',
  category: 'technology',
  icons: { icon: '/icon.svg' },
  openGraph: {
    title: 'Ahmad Afataa Kusdianto — Portofolio Pengembang Web & Arsitektur Perangkat Lunak',
    description: 'Jelajahi karya pengembangan situs web, sistem manajemen konten mandiri, dan rekayasa perangkat lunak berstandar tinggi oleh Ahmad Afataa Kusdianto.',
    type: 'website',
    url: origin,
    locale: 'id_ID',
    siteName: 'Ahmad Afataa Kusdianto',
    images: [{ url: '/social-preview.png', width: 1200, height: 630, alt: 'Portofolio Ahmad Afataa Kusdianto' }],
  },
  twitter: { card: 'summary_large_image', title: 'Ahmad Afataa Kusdianto — Portofolio Pengembang Web', description, images: ['/social-preview.png'] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large' } },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      name: 'Ahmad Afataa Kusdianto',
      url: origin,
      jobTitle: ['Pengembang Web', 'Desainer UI/UX', 'Pengembang Perangkat Lunak'],
      email: 'mailto:velorastudiodev@gmail.com',
      sameAs: ['https://github.com/velorastudiodev-cpu', 'https://id.linkedin.com/in/ahmad-afataa-kusdianto-a9b7ab421', 'https://www.instagram.com/velorastudio.hq/'],
      knowsAbout: ['Pengembangan Situs Web', 'Desain UI/UX', 'Next.js', 'React', 'TypeScript', 'Sistem CMS Kustom', 'Algoritma dan Struktur Data'],
      award: ['Peringkat 1 dan Medali Emas OSN Informatika Tingkat Kabupaten/Kota', 'Semifinalis OSN Informatika SMA Tingkat Nasional'],
    },
    { '@type': 'WebSite', name: 'Portofolio Ahmad Afataa Kusdianto', url: origin, description, inLanguage: 'id-ID', author: { '@type': 'Person', name: 'Ahmad Afataa Kusdianto' } },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <link rel="preload" href="/fonts/jakarta.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
