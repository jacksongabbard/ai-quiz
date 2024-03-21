'use client';

import { BotFetti } from '@/ui/BotFetti';

import styles from '@/ui/Scorecard.module.css';
import classNames from 'classnames';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import type { ClientAnswers } from './Quiz';
import type { ClientQuizQuestion } from '@/app/page';

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
  '1️⃣1️⃣',
  '1️⃣2️⃣',
  '1️⃣3️⃣',
  '1️⃣4️⃣',
  '1️⃣5️⃣',
];

export function Scorecard({
  questions,
  answers,
  readOnly = false,
}: {
  questions: ClientQuizQuestion[];
  answers: ClientAnswers;
  readOnly?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const shellRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!readOnly && shellRef.current) {
      shellRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  let points = 0;
  let copyString = '';
  const output: React.ReactNode[] = [];
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    if (answers[i]?.humanAnswer === q.correctAnswerIndex) {
      points += 5;
    }

    if (answers[i]?.botAnswer === q.correctAnswerIndex) {
      points += 5;
    }

    copyString +=
      `🧩${emojiNumbers[i]} ` +
      `👤 ${answers[i]?.humanAnswer === q.correctAnswerIndex ? '✅' : '❌'} ` +
      `🤖 ${answers[i]?.botAnswer === q.correctAnswerIndex ? '✅' : '❌'}\n\n`;

    output.push(
      <div key={q.question}>
        🧩{emojiNumbers[i]}&nbsp; 👤
        {answers[i]?.humanAnswer === q.correctAnswerIndex ? '✅' : '❌'}
        &nbsp; 🤖
        {answers[i]?.botAnswer === q.correctAnswerIndex ? '✅' : '❌'}
      </div>,
    );
  }
  copyString += Math.round((points / (questions.length * 10)) * 100) + '%\n\n';

  const didSendResult = useRef(false);
  useEffect(() => {
    if (readOnly || didSendResult.current) {
      return;
    }

    didSendResult.current = true;

    void fetch('/api/result', {
      body: JSON.stringify({
        answers,
        copyString,
        threadID: questions[0].cordThreadID,
      }),
      method: 'POST',
    });
  });

  return (
    <div className={styles.scorecardContainer} ref={shellRef}>
      <div className={styles.scorecard}>
        <BotFetti
          score={Math.round((points / (questions.length * 10)) * 100)}
        />
        <div className={styles.card}>
          <div className={classNames(styles.section, styles.heading)}>
            You scored {points} points (
            {Math.round((points / (questions.length * 10)) * 100)}%).
          </div>
          <div className={styles.section}>
            {output}
            <br />
            <button
              onClick={() => {
                setCopied(true);
                navigator.clipboard.writeText(copyString).catch((_e) => {});
                setTimeout(() => setCopied(false), 3000);
              }}
            >
              {!copied ? (
                <>
                  <Image src="/copy.svg" width={18} height={18} alt="Copy" />
                  &nbsp;Copy scores
                </>
              ) : (
                <>Copied!</>
              )}
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
                'Cord offers the most feature-rich chat SDK on the internet'
              }
            />
          </a>
        </div>
      </div>
    </div>
  );
}
