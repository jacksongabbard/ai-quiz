import styles from '@/ui/Start.module.css';

import { TickerText } from '@/ui/TickerText';

export function Start({ onStart }: { onStart: () => void }) {
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
      <button onClick={onStart} className={styles.startButton}>
        Start
      </button>
    </div>
  );
}
