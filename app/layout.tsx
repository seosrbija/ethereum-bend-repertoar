import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ETHEREUM — Repertoar',
  description: 'Interni repertoar benda ETHEREUM',
  robots: 'noindex, nofollow',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sr">
      <head><meta name="robots" content="noindex, nofollow" /></head>
      <body>{children}</body>
    </html>
  );
}
