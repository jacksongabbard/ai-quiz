import { TickerText } from "@/ui/TickerText";
import styles from "@/app/question/page.module.css";
import { indexToLetter } from "@/util/indexToLetter";

const Q = {
  question: `A hundred people are divided into two groups based on food
preferences. The people in the first group individually believe they make up a
majority. What is likely to be true of the second group?`,
  answers: [
    `They believe they are a minority`,
    `They believe the groups are equal`,
    `They believe themselves to be a majority.`,
    `They have no consistent beliefs`,
  ],
  correctAnswerIndex: 2,
  playerChoice: 2,
  aiChoice: 1,
};

export default function Question() {
  return (
    <div className={styles.question}>
      <div>Question</div>
      <div>
        <TickerText text={Q.question} showDot={true} />
      </div>
      {Q.answers.map((text, idx) => {
        return (
          <button key={idx} className={styles.answer}>
            <span>
              <TickerText
                text={indexToLetter(idx) + ". "}
                delayBy={Q.question.length}
              />
            </span>
            <span>
              <TickerText text={text} delayBy={Q.question.length + 3} />
            </span>
          </button>
        );
      })}
    </div>
  );
}
