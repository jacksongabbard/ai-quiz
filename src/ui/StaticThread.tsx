/* eslint-disable @next/next/no-img-element */
'use client';

import type { CoreMessageData } from '@cord-sdk/types';

import questionStyles from '@/ui/Question.module.css';
import styles from '@/ui/StaticThread.module.css';
import { experimental } from '@cord-sdk/react';
import classNames from 'classnames';

function StaticMessage({ message }: { message: CoreMessageData }) {
  const isHuman = message.authorID.startsWith('h:');
  return (
    <div className="cord-message cord-no-reactions">
      <div className="cord-avatar-container cord-present">
        <img
          className="cord-avatar-image"
          src={isHuman ? '/avatar-black.svg' : '/bot-black.svg'}
          alt="avatar"
        />
      </div>
      <div className="cord-author-name cord-font-body-emphasis">
        {isHuman ? 'You' : 'Geppetto'}
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
    <div className={classNames(questionStyles.cordThread, styles.staticThread)}>
      {thread.map((m) => (
        <StaticMessage key={m.id} message={m} />
      ))}{' '}
    </div>
  );
}
