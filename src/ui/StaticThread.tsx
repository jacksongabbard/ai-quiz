'use client';

import type { CoreMessageData } from '@cord-sdk/types';

import styles from '@/ui/Question.module.css';

function StaticMessage({ message }: { message: CoreMessageData }) {
  return (
    <div>
      <div>{message.authorID.startsWith('h:') ? 'You' : 'AI'}</div>
      <div>{message.plaintext}</div>
    </div>
  );
}

export function StaticThread({ thread }: { thread: CoreMessageData[] }) {
  return (
    <div className={styles.cordThread}>
      {thread.map((m) => (
        <StaticMessage key={m.id} message={m} />
      ))}{' '}
    </div>
  );
}
