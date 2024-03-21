import type { ClientQuizQuestion } from '@/app/page';
import { RefObject, useEffect, useRef, useState } from 'react';
import classnames from 'classnames';
import Image from 'next/image';

import styles from '@/ui/Question.module.css';
import { TickerText } from '@/ui/TickerText';
import { indexToLetter } from '@/util/indexToLetter';
import { Thread, thread } from '@cord-sdk/react';
import { questions } from '@/lib/questions';

const startingAngle = 256;

export default function Question({
  active,
  idx,
  qq,
  humanAnswer,
  botAnswer,
  onSubmit,
  onNext,
}: {
  active: boolean;
  idx: number;
  qq: ClientQuizQuestion;
  humanAnswer?: number;
  botAnswer?: number;
  onSubmit: (humanAnswer: number, botAnswer: number | undefined) => void;
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

  return (
    <QuestionImpl
      active={active}
      final={!!(humanAnswer || botAnswer)}
      shellRef={shellRef}
      idx={idx}
      qq={qq}
      humanAnswer={humanAnswer ?? _humanAnswer}
      botAnswer={botAnswer ?? _botAnswer}
      onChangeHumanAnswer={setHumanAnswer}
      onSubmit={onSubmit}
      onNext={onNext}
    />
  );
}

function QuestionImpl({
  active,
  final,
  shellRef,
  idx,
  qq,
  humanAnswer,
  botAnswer,
  onChangeHumanAnswer,
  onSubmit,
  onNext,
}: {
  active: boolean;
  final: boolean;
  shellRef: RefObject<HTMLDivElement>;
  idx: number;
  qq: ClientQuizQuestion;
  humanAnswer: number | undefined;
  botAnswer: number | undefined;
  onChangeHumanAnswer: (humanAnswer: number) => void;
  onSubmit: (humanAnswer: number, botAnswer: number | undefined) => void;
  onNext: () => void;
}) {
  let runningTotal = qq.question.length + 10;
  return (
    <div
      style={{
        backgroundColor: `hsl(${startingAngle - idx * 15}, 66%, 34%)`,
      }}
      ref={shellRef}
    >
      <div className={styles.questionContainer}>
        <div className={styles.questionNumber}>
          {idx + 1} / {questions.length}
        </div>
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
                    humanAnswer === idx || botAnswer === idx,
                  [styles.correctAnswerBackground]:
                    final && idx === qq.correctAnswerIndex,
                  [styles.incorrectAnswerBackground]:
                    final &&
                    (humanAnswer === idx || botAnswer === idx) &&
                    idx !== qq.correctAnswerIndex,
                })}
                onClick={() => {
                  !final && onChangeHumanAnswer(idx);
                }}
              >
                <span>
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
                </span>
                {idx === qq.correctAnswerIndex && final && (
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
                  (botAnswer === idx || humanAnswer === idx) &&
                  final && (
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
                <span className={styles.avatars}>
                  {botAnswer === idx && (
                    <span className={styles.botAvatar}>
                      <Image
                        src={'/bot.svg'}
                        width={16}
                        height={16}
                        alt="Bot"
                        title="Your AI teammate"
                      />
                    </span>
                  )}
                  {humanAnswer === idx && (
                    <span className={styles.humanAvatar}>
                      <Image
                        src={'/avatar.svg'}
                        width={16}
                        height={16}
                        alt="You"
                        title="You"
                        className={styles.avatarImg}
                      />
                    </span>
                  )}
                </span>
              </button>
            );

            runningTotal += text.length + 3;
            return q;
          })}
          {!final && humanAnswer !== undefined && botAnswer !== undefined && (
            <button
              className={styles.submit}
              onClick={() => {
                onSubmit(humanAnswer, botAnswer);
              }}
            >
              <TickerText text="Final answer?" />
            </button>
          )}
          {final && (
            <div className={styles.outcome}>
              {humanAnswer === qq.correctAnswerIndex &&
                botAnswer === qq.correctAnswerIndex && (
                  <TickerText text={'Correct!'} />
                )}

              {humanAnswer === qq.correctAnswerIndex &&
                botAnswer !== qq.correctAnswerIndex && (
                  <TickerText text={'You were right!'} />
                )}

              {humanAnswer !== qq.correctAnswerIndex &&
                botAnswer === qq.correctAnswerIndex && (
                  <TickerText text={'The AI was right!'} />
                )}

              {humanAnswer !== qq.correctAnswerIndex &&
                botAnswer !== qq.correctAnswerIndex && (
                  <TickerText text={'You were both wrong!'} />
                )}
              {active && (
                <button onClick={onNext} className={styles.nextQuestion}>
                  <Image
                    src="/right-arrow.svg"
                    width={14}
                    height={14}
                    alt="Right arrow"
                  />
                  &nbsp;
                  <TickerText text="Next" delayBy={20} />
                </button>
              )}
            </div>
          )}
        </div>
        <Thread
          showHeader={false}
          showPlaceholder={false}
          threadId={qq.cordThreadID}
          className={styles.cordThread}
        />
      </div>
    </div>
  );
}
