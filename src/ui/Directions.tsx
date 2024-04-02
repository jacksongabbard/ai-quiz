import styles from '@/ui/Directions.module.css';
import classNames from 'classnames';
import { useEffect, useRef } from 'react';

export function Directions({
  onStart,
  label,
}: {
  onStart?: () => void;
  label: string;
}) {
  const directionsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (directionsRef.current && onStart) {
      directionsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [onStart]);

  return (
    <div
      ref={directionsRef}
      className={styles.directionsContainer}
      style={{
        backgroundColor: `hsl(${256 - 20}, 66%, 34%)`,
      }}
    >
      <div className={styles.directions}>
        <div className={styles.directionsText}>
          <div>Just how smart is GPT-4 really?</div>
          <div>
            This quiz is designed to explore different aspects of GPT-4 and
            Large Language Models (LLMs). There are many things that LLMs are
            good at... and many that they are not.
          </div>
          <div>
            The quiz is a series of multiple-choice questions. After the
            question is revealed, GPT-4 will give its thoughts. Your goal is to
            get GPT-4 to give the correct answer on every question.
          </div>
          <div>
            For some questions, GPT-4 will answer faster and better than any
            human could. For these questions, bask in the AI&apos;s skill and
            move on.
          </div>
          <div>
            But for many questions, GPT-4 will get confused (sometimes very
            confused!) and will not give the correct answer. Chat back and forth
            with GPT-4 and help it figure out the correct answer. You can skip
            questions or move on even when GPT-4 is wrong, but it&apos;s much
            more fun to try to discuss with it and help it figure out the right
            answer!
          </div>
          <div>
            After every question is an explanation of why the LLM behaved as it
            did on that question. Finally, in this game, GPT-4 has not been
            modified or instructed to deliberately fail. This is genuinely the
            best that it can do!
          </div>
        </div>
        <button
          onClick={onStart}
          className={classNames({
            [styles.startButton]: true,
            [styles.hidden]: !onStart,
          })}
        >
          {label}
        </button>
      </div>
    </div>
  );
}
