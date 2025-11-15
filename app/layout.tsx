import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Agent ?ber den Menschen',
  description: 'Stelle Fragen ?ber den Menschen ? Biologie, Psyche, Kultur.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
