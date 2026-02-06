import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Neon Syntax - Phase 1',
  description: 'Programmable cyberpunk strategy game',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-gradient-to-br from-black via-purple-900/50 to-cyan-900/50 overflow-hidden`}>
        {children}
      </body>
    </html>
  );
}
