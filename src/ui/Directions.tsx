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
          <p>
            This is a quiz. But not you! It&apos;s designed to explore what
            GPT-4 and other Large Language Models (LLMs) are good at &mdash; and
            what they are not.
          </p>
          <p>
            You&apos;ll see a series of questions. After each question is
            revealed, GPT-4 will give its thoughts.
          </p>
          <p>
            Sometimes GPT-4 will get it right away.
            <br />
            And... sometimes it will get quite confused!
          </p>
          <p>
            Can you help GPT-4 get the right answer every time? You can skip
            questions or move on even when GPT-4 is wrong, but it&apos;s much
            more fun to try to discuss with it and help it figure out the right
            answer!
          </p>
          <p>
            GPT-4 has not been modified or instructed to deliberately fail. This
            is genuinely the best that it can do!
          </p>
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
