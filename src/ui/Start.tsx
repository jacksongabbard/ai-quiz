import styles from '@/ui/Start.module.css';

import { TickerText } from '@/ui/TickerText';
import classNames from 'classnames';
import Image from 'next/image';

export function Start({ onStart }: { onStart?: () => void }) {
  return (
    <div className={styles.startContainer}>
      <div className={styles.start}>
        <div>
          <TickerText text={'10 evil questions'} />
        </div>
        <div>
          <TickerText text={'1 AI "teammate"'} delayBy={30} />
        </div>
        <div>
          <TickerText text={'How will you fare?'} delayBy={60} />
        </div>
        <button
          onClick={onStart}
          className={classNames({
            [styles.startButton]: true,
            [styles.hidden]: !onStart,
          })}
        >
          Start
        </button>
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
            title={
              'Cord ofers the most feature rich, mature chat SDK on the internet'
            }
          />
        </a>
      </div>
    </div>
  );
}
