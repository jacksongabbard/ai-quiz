import classnames from 'classnames';
import Image from 'next/image';
import type { TickerText } from '@/ui/TickerText';
import { indexToLetter } from '@/util/indexToLetter';
import type { BaseQuizQuestion } from '@/lib/questions';
import { RefObject } from 'react';
import styles from '@/ui/Question.module.css';
import { CordLogo } from '@/ui/CordLogo';

const startingAngle = 256;

type Props = {
  active: boolean;
  final: boolean;
  shellRef?: RefObject<HTMLDivElement>;
  idx: number;
  qq: BaseQuizQuestion;
  numQuestions: number;
  botAnswer: number | undefined;
  onSubmit: (questionIndex: number, botAnswer: number | undefined) => void;
  onNext: () => void;
  Text: typeof TickerText;
  Thread: () => JSX.Element;
};

function SubmitButton({
  final,
  idx,
  botAnswer,
  onSubmit,
  Text,
}: Pick<Props, 'final' | 'idx' | 'botAnswer' | 'onSubmit' | 'Text'>) {
  if (final) {
    return null;
  }

  return (
    <div className={styles.submitWrap}>
      <button
        disabled={botAnswer !== undefined}
        className={styles.submit}
        onClick={() => onSubmit(idx, -1)}
      >
        <Text text="Skip question" />
      </button>
      <button
        disabled={botAnswer === undefined}
        className={styles.submit}
        onClick={() => onSubmit(idx, botAnswer)}
      >
        <Text text="Final answer?" />
      </button>
    </div>
  );
}

export default function StaticQuestion({
  active,
  final,
  shellRef,
  idx,
  qq,
  numQuestions,
  botAnswer,
  onSubmit,
  onNext,
  Text,
  Thread,
}: Props) {
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
              <div
                key={idx}
                className={classnames({
                  [styles.answer]: true,
                  [styles.selectedAnswer]: botAnswer === idx,
                  [styles.correctAnswerBackground]:
                    final && idx === qq.correctAnswerIndex,
                  [styles.incorrectAnswerBackground]:
                    final && botAnswer === idx && idx !== qq.correctAnswerIndex,
                })}
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
                  botAnswer === idx &&
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
                </span>
              </div>
            );

            runningTotal += text.length + 3;
            return q;
          })}
          <SubmitButton
            final={final}
            idx={idx}
            botAnswer={botAnswer}
            onSubmit={onSubmit}
            Text={Text}
          />
          {final && (
            <div className={styles.outcome}>
              <Text
                text={
                  botAnswer === qq.correctAnswerIndex
                    ? 'Correct!'
                    : 'Incorrect!'
                }
              />
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
