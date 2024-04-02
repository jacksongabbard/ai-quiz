import styles from '@/ui/Directions.module.css';
import classNames from 'classnames';
import { useEffect, useRef } from 'react';
import { TickerText } from './TickerText';

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
        <TickerText text={'Directions would go here if I wrote them.'} />
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
