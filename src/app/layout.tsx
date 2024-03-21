import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Quiz Challenge',
  description: 'Can you and your AI buddy succeed together?',
  icons: {
    icon: '/favicon-32x32.png',
    shortcut: '/android-chrome-512x512.svg',
    apple: '/apple-touch-icon.png',
  },
  viewport: 'width=device-width, user-scalable=no',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <script src="/analytics.js" async={true}></script>
      <body>{children}</body>
    </html>
  );
}
