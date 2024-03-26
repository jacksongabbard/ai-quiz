import type { Metadata } from 'next';
import './globals.css';
import { questions } from '@/lib/questions';

const description =
  'Can you and an LLM work together to win? ' +
  'You and your GPT-4-powered teammate are pitted against 7 nasty questions. ' +
  'Will the LLM help or hinder you?';
export const metadata: Metadata = {
  title: `${questions.length} Tricky CoLLMaborative Quiz Questions`,
  description,
  icons: {
    icon: '/favicon-32x32.png',
    shortcut: '/android-chrome-512x512.svg',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    title: `${questions.length} Tricky CoLLMaborative Quiz Questions`,
    description,
    images: {
      url: 'https://quiz.cord.com/opengraph-image.png',
    },
    url: 'https://quiz.cord.com',
  },
  twitter: {
    title: `${questions.length} Tricky CoLLMaborative Quiz Questions`,
    description,
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
