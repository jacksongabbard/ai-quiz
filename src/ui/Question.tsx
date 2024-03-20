import type { ClientQuizQuestion } from '@/app/page';
import { useEffect, useRef, useState } from 'react';
import classnames from 'classnames';
import Image from 'next/image';

import styles from '@/ui/Question.module.css';
import { TickerText } from '@/ui/TickerText';
import { indexToLetter } from '@/util/indexToLetter';
import { Thread, thread } from '@cord-sdk/react';

export default function Question({
  active,
  qq,
  humanAnswer,
  botAnswer,
  onSubmit,
  onNext,
}: {
  active: boolean;
  qq: ClientQuizQuestion;
  humanAnswer?: number;
  botAnswer?: number;
  onSubmit: (humanAnswer: number, botAnswer: number) => void;
  onNext: () => void;
}) {
  const [_humanAnswer, setHumanAnswer] = useState(humanAnswer);
  const threadData = thread.useThread(qq.cordThreadID);
  let _botAnswer: number | undefined = Number(
    threadData.thread?.metadata?.botAnswer,
  );
  if (isNaN(_botAnswer)) {
    _botAnswer = undefined;
  }

  const shellRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (shellRef.current && active) {
      shellRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [active]);

  let runningTotal = qq.question.length + 10;

  return (
    <div className={styles.questionContainer} ref={shellRef}>
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
              {idx === qq.correctAnswerIndex &&
                (botAnswer !== undefined || humanAnswer !== undefined) && (
                  <span className={styles.correctAnswer}>
                    <span className={styles.inner}>
                      <Image
                        src={'/check.svg'}
                        width={16}
                        height={16}
                        alt="Correct!"
                        title="Correct!"
                      />
                    </span>
                  </span>
                )}
              {idx !== qq.correctAnswerIndex &&
                (botAnswer === idx || humanAnswer === idx) && (
                  <span className={styles.incorrectAnswer}>
                    <span className={styles.inner}>
                      <Image
                        src={'/x.svg'}
                        width={16}
                        height={16}
                        alt="Incorrect!"
                        title="Incorrect!"
                      />
                    </span>
                  </span>
                )}
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
        {humanAnswer === undefined &&
          botAnswer === undefined &&
          _humanAnswer !== undefined &&
          _botAnswer !== undefined && (
            <button
              className={styles.submit}
              onClick={() => {
                onSubmit(_humanAnswer, _botAnswer);
              }}
            >
              <TickerText text="Final answer?" />
            </button>
          )}

        {humanAnswer !== undefined && botAnswer !== undefined && (
          <div className={styles.outcome}>
            {humanAnswer === qq.correctAnswerIndex ||
            botAnswer === qq.correctAnswerIndex ? (
              <TickerText text={'Correct!'} />
            ) : (
              <TickerText text={'Incorrect!'} />
            )}
            {active && (
              <button onClick={onNext} className={styles.nextQuestion}>
                <TickerText text="Next" delayBy={20} />
              </button>
            )}
          </div>
        )}
      </div>
      <Thread threadId={qq.cordThreadID} className={styles.cordThread} />
    </div>
  );
}
