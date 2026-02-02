import './globals.css';
import { Manrope } from 'next/font/google';
import type { Metadata } from 'next';

const manrope = Manrope({ subsets: ['latin'], weight: ['400', '600', '700'] });

export const metadata: Metadata = {
  title: 'DigiArch GED',
  description: 'Gestion Electronique de Documents avec IA et MinIO',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${manrope.className} bg-surface text-slate-900`}>{children}</body>
    </html>
  );
}
