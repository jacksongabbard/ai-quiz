'use client';

import type { CoreMessageData } from '@cord-sdk/types';

import styles from '@/ui/Question.module.css';
import { experimental } from '@cord-sdk/react';

function StaticMessage({ message }: { message: CoreMessageData }) {
  return (
    <div>
      <div>{message.authorID.startsWith('h:') ? 'You' : 'AI'}</div>
      <experimental.MessageContent
        content={message.content as any}
        attachments={[]}
        edited={false}
      />
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
