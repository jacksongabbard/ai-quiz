import type { ClientQuizQuestion } from '@/app/page';
import styles from '@/ui/Question.module.css';
import { TickerText } from '@/ui/TickerText';
import { indexToLetter } from '@/util/indexToLetter';
import { Thread } from '@cord-sdk/react';

export default function Question({
  qq,
  humanAnswer,
  botAnswer,
}: {
  qq: ClientQuizQuestion;
  humanAnswer?: number;
  botAnswer?: number;
}) {
  let runningTotal = qq.question.length + 10;
  return (
    <div className={styles.question}>
      <div className={styles.questionText}>
        <TickerText text={qq.question} showDot={true} />
      </div>
      {qq.answers.map((text, idx) => {
        const q = (
          <button key={idx} className={styles.answer}>
            <span>
              <TickerText
                text={indexToLetter(idx) + '. '}
                delayBy={runningTotal}
              />
            </span>
            <span>
              <TickerText text={text} delayBy={runningTotal + 3} />
            </span>
          </button>
        );

        runningTotal += text.length + 3;
        return q;
      })}
      <Thread threadId={qq.cordThreadID} />
    </div>
  );
}
