import type { ClientQuizQuestion } from '@/app/page';
import { useState } from 'react';
import classnames from 'classnames';
import Image from 'next/image';

import { BaseQuizQuestion } from '@/lib/questions';
import styles from '@/ui/Question.module.css';
import { TickerText } from '@/ui/TickerText';
import { indexToLetter } from '@/util/indexToLetter';
import { Thread } from '@cord-sdk/react';

export default function Question({
  qq,
  humanAnswer,
  botAnswer,
  onSubmit,
}: {
  qq: ClientQuizQuestion;
  humanAnswer?: number;
  botAnswer?: number;
  onSubmit: (humanAnswer: number, botAnswer: number) => void;
}) {
  const [_humanAnswer, setHumanAnswer] = useState(humanAnswer);
  const [_botAnswer, setBotAnswer] = useState(botAnswer);

  let runningTotal = qq.question.length + 10;
  return (
    <div className={styles.question}>
      <div className={styles.questionText}>
        <TickerText text={qq.question} showDot={true} />
      </div>
      {qq.answers.map((text, idx) => {
        const q = (
          <button
            key={idx}
            className={classnames({
              [styles.answer]: true,
              [styles.selectedAnswer]:
                _humanAnswer === idx || _botAnswer === idx,
            })}
            onClick={() => {
              setHumanAnswer(idx);
            }}
          >
            <span>
              <TickerText
                text={indexToLetter(idx) + '. '}
                delayBy={runningTotal}
              />
            </span>
            <span>
              <TickerText text={text} delayBy={runningTotal + 3} />
            </span>
            {_botAnswer === idx && <span className={styles.botAvatar}>A</span>}
            {_humanAnswer === idx && (
              <span className={styles.humanAvatar}>Y</span>
            )}
          </button>
        );

        runningTotal += text.length + 3;
        return q;
      })}
      <Thread threadId={qq.cordThreadID} />
      {!humanAnswer && !botAnswer && !!_humanAnswer && !!_botAnswer && (
        <button
          onClick={() => {
            onSubmit(_humanAnswer, _botAnswer);
          }}
        >
          Final answer?
        </button>
      )}
    </div>
  );
}
