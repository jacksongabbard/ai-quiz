import { BaseQuizQuestion } from '@/lib/questions';
import { Quiz } from '@/ui/Quiz';

import styles from './page.module.css';
import Head from 'next/head';

export type ClientQuizQuestion = BaseQuizQuestion & { cordThreadID: string };

export default function Home() {
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
        <Quiz />
      </main>
    </>
  );
}
