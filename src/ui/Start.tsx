import { questions } from '@/lib/questions';
import styles from '@/ui/Start.module.css';

import { TickerText } from '@/ui/TickerText';
import classNames from 'classnames';
import Image from 'next/image';

export function Start({
  onStart,
  onRestart,
  label,
}: {
  onStart?: () => void;
  onRestart?: () => void;
  label: string;
}) {
  return (
    <div
      className={styles.startContainer}
      style={{
        backgroundColor: `hsl(${256 - 10}, 66%, 34%)`,
      }}
    >
      <div className={styles.start}>
        <div>
          <TickerText text={questions.length + ' tricky questions'} />
        </div>
        <div>
          <TickerText text={'1 advanced AI'} delayBy={30} />
        </div>
        <div className={styles.lastItem}>
          <TickerText text={'How smart is'} delayBy={60} />
          <br />
          <TickerText text={'GPT-4 really?'} delayBy={75} />
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
        {onRestart && (
          <button onClick={onRestart} className={styles.startButton}>
            Start Over
          </button>
        )}
      </div>
      <a
        className={styles.poweredBy}
        href="https://cord.com/"
        title="React chat UI library and backend"
      >
        <Image
          className={styles.logo}
          src="/cord-logo.svg"
          width={90}
          height={30}
          alt={'Cord Logo'}
          title={'Cord offers the most feature-rich chat SDK on the internet'}
        />
        <span>
          Powered by the Cord SDK
          <br />
          for chat and message streaming
        </span>
      </a>
    </div>
  );
}
