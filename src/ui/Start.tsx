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
    <div className={styles.startContainer}>
      <div className={styles.start}>
        <div>
          <TickerText text={questions.length + ' evil questions'} />
        </div>
        <div>
          <TickerText text={'1 AI teammate'} delayBy={30} />
        </div>
        <div className={styles.lastItem}>
          <TickerText text={'Can you work together?'} delayBy={60} />
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
      <div className={styles.poweredBy}>
        Powered by the Cord SDK
        <br />
        for chat and message streaming
        <br />
        <a href="https://cord.com/" title="React chat UI library and backend">
          <Image
            className={styles.logo}
            src="/cord-logo.svg"
            width={180}
            height={59}
            alt={'Cord Logo'}
            title={'Cord offers the most feature-rich chat SDK on the internet'}
          />
        </a>
      </div>
    </div>
  );
}
