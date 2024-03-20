import { BaseQuizQuestion } from '@/lib/questions';

import styles from '@/ui/Scorecard.module.css';
import classNames from 'classnames';
import { useEffect, useRef } from 'react';

const emojiNumbers = [
  '0️⃣1️⃣',
  '0️⃣2️⃣',
  '0️⃣3️⃣',
  '0️⃣4️⃣',
  '0️⃣5️⃣',
  '0️⃣6️⃣',
  '0️⃣7️⃣',
  '0️⃣8️⃣',
  '0️⃣9️⃣',
  '1️⃣0️⃣',
];

export function Scorecard({
  questions,
  answers,
}: {
  questions: BaseQuizQuestion[];
  answers: { humanAnswer: number; botAnswer: number }[];
}) {
  const shellRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (shellRef.current) {
      shellRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <div className={styles.scorecardContainer} ref={shellRef}>
      <div className={styles.scorecard}>
        <div className={classNames(styles.section, styles.heading)}>
          Scorecard
        </div>
        {questions.map((q, idx) => {
          return (
            <div key={q.question} className={classNames(styles.section)}>
              {emojiNumbers[idx]}
              👤
              {answers[idx]?.humanAnswer === q.correctAnswerIndex ? '✅' : '❌'}
              🤖{answers[idx]?.botAnswer === q.correctAnswerIndex ? '✅' : '❌'}
            </div>
          );
        })}
        <div className={classNames(styles.section, styles.footer)}></div>
      </div>
    </div>
  );
}
