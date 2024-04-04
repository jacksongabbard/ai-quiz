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
      <div className={styles.banner}>
        <p>
          We&apos;re currently experiencing the full might of{' '}
          <strong>r/programming</strong>.<br />
          This quiz might be very, very slow while we unblock some pipes.
          <br />
          Sorry and thank you!
        </p>
      </div>
      <div className={styles.start}>
        <div
          style={{
            fontSize: 28,
            lineHeight: '40px',
            marginBottom: '36px',
            whiteSpace: 'nowrap',
          }}
        >
          Exploring LLM Weirdness:
          <br /> A Quiz Game
        </div>
        <div>
          <TickerText text={'9 questions'} delayBy={30} />
        </div>
        <div>
          <TickerText text={'1 advanced AI'} delayBy={60} />
        </div>
        <div className={styles.lastItem}>
          <TickerText text={'How hard could it be?'} delayBy={90} />
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
