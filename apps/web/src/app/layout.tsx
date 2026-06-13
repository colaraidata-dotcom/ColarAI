import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta' });

export const metadata: Metadata = {
  title: 'Guardian — Profile-Based Internet Control',
  description:
    'Smart internet control platform designed for family safety and personal focus. Every profile operates by its own rules.',
  keywords: ['parental controls', 'internet safety', 'family', 'screen time', 'content filter'],
  openGraph: {
    title: 'Guardian',
    description: 'Internet control is profile-based, not device-based.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body>{children}</body>
    </html>
  );
}
