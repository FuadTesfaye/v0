import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AlgoWars - Tactical Coding Strategy',
  description: ' programmable cyberpunk strategy game where code is your weapon.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-gradient-to-br from-black via-purple-900/50 to-cyan-900/50">
        {children}
      </body>
    </html>
  );
}
