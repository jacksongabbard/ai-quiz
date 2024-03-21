import { BaseQuizQuestion } from '@/lib/questions';
import { Quiz } from '@/ui/Quiz';

import styles from './page.module.css';

export type ClientQuizQuestion = BaseQuizQuestion & { cordThreadID: string };

export default function Home() {
  return (
    <>
      <div className="gradient"></div>
      <main className={styles.main}>
        <Quiz />
      </main>
    </>
  );
}
