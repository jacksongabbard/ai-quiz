import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '13 Tricky CoLLMaborative Quiz Questions',
  description: 'Can you and your AI buddy succeed together?',
  icons: {
    icon: '/favicon-32x32.png',
    shortcut: '/android-chrome-512x512.svg',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    title: '13 Tricky CoLLMaborative Quiz Questions',
    description: 'Can you and your AI buddy succeed together?',
    images: {
      url: 'https://quiz.cord.com/opengraph-image.png',
    },
    url: 'https://quiz.cord.com',
  },
  twitter: {
    title: '13 Tricky CoLLMaborative Quiz Questions',
    description: 'Can you and your AI buddy succeed together?',
    images: {
      url: 'https://quiz.cord.com/opengraph-image.png',
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          id="cord_css"
          rel="stylesheet"
          href="https://app.cord.com/sdk/v1/sdk.latest.css"
        ></link>
      </head>
      <script src="/analytics.js" async={true}></script>
      <body>{children}</body>
    </html>
  );
}
