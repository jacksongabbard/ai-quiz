import { BaseQuizQuestion } from '@/lib/questions';

import styles from '@/ui/Scorecard.module.css';
import classNames from 'classnames';
import Image from 'next/image';
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

  let copyString = '';
  const output: React.ReactNode[] = [];
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];

    copyString +=
      `${emojiNumbers[i]} ` +
      `👤 ${answers[i]?.humanAnswer === q.correctAnswerIndex ? '✅' : '❌'} ` +
      `🤖 ${answers[i]?.botAnswer === q.correctAnswerIndex ? '✅' : '❌'}\n\n`;

    output.push(
      <div key={q.question}>
        {emojiNumbers[i]}&nbsp; 👤
        {answers[i]?.humanAnswer === q.correctAnswerIndex ? '✅' : '❌'}
        &nbsp; 🤖
        {answers[i]?.botAnswer === q.correctAnswerIndex ? '✅' : '❌'}
      </div>,
    );
  }

  return (
    <div className={styles.scorecardContainer} ref={shellRef}>
      <div className={styles.scorecard}>
        <div className={styles.card}>
          <div className={classNames(styles.section, styles.heading)}>
            Scorecard
          </div>
          <div className={styles.section}>
            {output}
            <br />
            <button
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(copyString);
                } catch (e) {}
              }}
            >
              <Image src="/copy.svg" width={18} height={18} alt="Copy" />
              &nbsp;Copy scores
            </button>
          </div>
          <div className={classNames(styles.section, styles.footer)}></div>
        </div>
        <div className={styles.poweredBy}>
          Powered by the Cord SDK
          <br />
          for chat and message streaming
          <br />
          <a href="https://cord.com/" title="React chat UI library and backend">
            <Image
              className={styles.logo}
              src="/cord-logo.svg"
              width={180}
              height={59}
              alt={'Cord Logo'}
              title={
                'Cord ofers the most feature rich, mature chat SDK on the internet'
              }
            />
          </a>
        </div>
      </div>
    </div>
  );
}
