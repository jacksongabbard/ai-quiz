import type { Metadata } from 'next';
import './globals.css';
import Head from 'next/head';

export const metadata: Metadata = {
  title: 'AI Quiz Challenge',
  description: 'Can you and your AI buddy succeed together?',
  icons: {
    icon: '/favicon-32x32.png',
    shortcut: '/safari-pinned-tab.svg',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
