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
  const [_botAnswer, setBotAnswer] = useState(botAnswer || 0);

  let runningTotal = qq.question.length + 10;
  return (
    <div className={styles.questionContainer}>
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
                  text={indexToLetter(idx) + '.'}
                  delayBy={runningTotal}
                />
              </span>
              &nbsp;
              <span>
                <TickerText text={text} delayBy={runningTotal + 3} />
              </span>
              {_botAnswer === idx && (
                <span className={styles.botAvatar}>
                  <Image
                    src={'/bot.svg'}
                    width={12}
                    height={12}
                    alt="Bot"
                    title="Your AI teammate"
                  />
                </span>
              )}
              {_humanAnswer === idx && (
                <span className={styles.humanAvatar}>
                  <Image
                    src={'/avatar.svg'}
                    width={12}
                    height={12}
                    alt="You"
                    title="You"
                    className={styles.avatarImg}
                  />
                </span>
              )}
            </button>
          );

          runningTotal += text.length + 3;
          return q;
        })}
        {!humanAnswer &&
          !botAnswer &&
          _humanAnswer !== undefined &&
          _botAnswer !== undefined && (
            <button
              className={styles.submit}
              onClick={() => {
                onSubmit(_humanAnswer, _botAnswer);
              }}
            >
              Final answer?
            </button>
          )}
      </div>
      <Thread threadId={qq.cordThreadID} />
    </div>
  );
}
