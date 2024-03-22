/* eslint-disable @next/next/no-img-element */
'use client';

import type { CoreMessageData } from '@cord-sdk/types';

import styles from '@/ui/Question.module.css';
import { experimental } from '@cord-sdk/react';

function StaticMessage({ message }: { message: CoreMessageData }) {
  const isHuman = message.authorID.startsWith('h:');
  return (
    <div className="cord-message cord-no-reactions">
      <div className="cord-avatar-container cord-present">
        <img
          src={isHuman ? '/avatar-black.svg' : '/bot-black.svg'}
          alt="avatar"
        />
      </div>
      <div className="cord-author-name cord-font-body-emphasis">
        {isHuman ? 'You' : 'AI'}
      </div>
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
