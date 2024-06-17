'use client';

import { BaseQuizQuestion } from '@/lib/questions';

import styles from './page.module.css';
import Head from 'next/head';
import { useEffect } from 'react';

export type ClientQuizQuestion = BaseQuizQuestion & { cordThreadID: string };

export default function Home() {
  useEffect(() => {
    setTimeout(() => {
      window.location.href = 'https://cord.com/';
    }, 3000);
  }, []);

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </Head>
      <div className="gradient"></div>
      <main className={styles.main}>
        <a href="https://cord.com/">Redirecting to Cord.com...</a>
      </main>
    </>
  );
}
