import styles from '@/ui/Start.module.css';

import { TickerText } from '@/ui/TickerText';
import classNames from 'classnames';

export function Start({ onStart }: { onStart?: () => void }) {
  return (
    <div className={styles.start}>
      <div>
        <TickerText text={'10 questions'} />
      </div>
      <div>
        <TickerText text={'1 AI teammate'} delayBy={20} />
      </div>
      <div>
        <TickerText text={'How will you fare?'} delayBy={40} />
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
  );
}
