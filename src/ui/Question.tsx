import { QuizQuestion } from '@/lib/questions';
import styles from '@/ui/Question.module.css';
import { TickerText } from '@/ui/TickerText';
import { indexToLetter } from '@/util/indexToLetter';

export default function Question({
  qq,
  humanAnswer,
  botAnswer,
}: {
  qq: QuizQuestion;
  humanAnswer?: number;
  botAnswer?: number;
}) {
  return (
    <div className={styles.question}>
      <div className={styles.questionText}>
        <TickerText text={qq.question} showDot={true} />
      </div>
      {qq.answers.map((text, idx) => {
        return (
          <button key={idx} className={styles.answer}>
            <span>
              <TickerText
                text={indexToLetter(idx) + '. '}
                delayBy={qq.question.length}
              />
            </span>
            <span>
              <TickerText text={text} delayBy={qq.question.length + 3} />
            </span>
          </button>
        );
      })}
    </div>
  );
}
