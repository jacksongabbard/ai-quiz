import classnames from 'classnames';
import Image from 'next/image';
import type { TickerText } from '@/ui/TickerText';
import { indexToLetter } from '@/util/indexToLetter';
import type { BaseQuizQuestion } from '@/lib/questions';
import { RefObject } from 'react';
import styles from '@/ui/Question.module.css';
import { CordLogo } from '@/ui/CordLogo';

const startingAngle = 256;

export default function StaticQuestion({
  active,
  final,
  shellRef,
  idx,
  qq,
  numQuestions,
  humanAnswer,
  botAnswer,
  onChangeHumanAnswer,
  onSubmit,
  onNext,
  Text,
  Thread,
}: {
  active: boolean;
  final: boolean;
  shellRef?: RefObject<HTMLDivElement>;
  idx: number;
  qq: BaseQuizQuestion;
  numQuestions: number;
  humanAnswer: number | undefined;
  botAnswer: number | undefined;
  onChangeHumanAnswer: (humanAnswer: number) => void;
  onSubmit: (
    questionIndex: number,
    humanAnswer: number,
    botAnswer: number | undefined,
  ) => void;
  onNext: () => void;
  Text: typeof TickerText;
  Thread: () => JSX.Element;
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
          <CordLogo />{' '}
          <span>
            {idx + 1} / {numQuestions}
          </span>
        </div>
        <div className={styles.question}>
          <div className={styles.questionText}>
            <Text text={qq.question} showDot={true} />
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
                onClick={
                  final
                    ? undefined
                    : () => {
                        onChangeHumanAnswer(idx);
                      }
                }
              >
                <span>
                  <span>
                    <Text
                      text={indexToLetter(idx) + '.'}
                      delayBy={runningTotal}
                    />
                  </span>
                  &nbsp;
                  <span>
                    <Text text={text} delayBy={runningTotal + 3} />
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
                onSubmit(idx, humanAnswer, botAnswer);
              }}
            >
              <Text text="Final answer?" />
            </button>
          )}
          {final && (
            <div className={styles.outcome}>
              {humanAnswer === qq.correctAnswerIndex &&
                botAnswer === qq.correctAnswerIndex && (
                  <Text text={'Correct! 10pts'} />
                )}

              {humanAnswer === qq.correctAnswerIndex &&
                botAnswer !== qq.correctAnswerIndex && (
                  <Text text={'Only you were right! 5pts'} />
                )}

              {humanAnswer !== qq.correctAnswerIndex &&
                botAnswer === qq.correctAnswerIndex && (
                  <Text text={'Only the AI was right! 5pts'} />
                )}

              {humanAnswer !== qq.correctAnswerIndex &&
                botAnswer !== qq.correctAnswerIndex && (
                  <Text text={'You were both wrong! 0pts'} />
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
                  <Text text="Next" delayBy={20} />
                </button>
              )}
            </div>
          )}
        </div>
        <Thread />
      </div>
    </div>
  );
}