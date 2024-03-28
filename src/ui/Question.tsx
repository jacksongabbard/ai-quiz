import type { ClientQuizQuestion } from '@/app/page';
import { useCallback, useEffect, useRef } from 'react';

import styles from '@/ui/Question.module.css';
import { Thread as CordThread, thread } from '@cord-sdk/react';
import StaticQuestion from './StaticQuestion';
import { questions } from '@/lib/questions';
import { TickerText } from './TickerText';

export default function Question({
  active,
  idx,
  qq,
  botAnswer,
  onSubmit,
  onNext,
}: {
  active: boolean;
  idx: number;
  qq: ClientQuizQuestion;
  botAnswer?: number;
  onSubmit: (questionIndex: number, botAnswer: number) => void;
  onNext: () => void;
}) {
  const threadData = thread.useThread(qq.cordThreadID);
  let _botAnswer: number | undefined = Number(
    threadData.thread?.metadata?.botAnswer,
  );
  if (isNaN(_botAnswer)) {
    _botAnswer = undefined;
  }

  const shellRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (shellRef.current && active) {
      shellRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [active]);

  const Thread = useCallback(
    () => (
      <CordThread
        showHeader={false}
        showPlaceholder={false}
        threadId={qq.cordThreadID}
        className={styles.cordThread}
      />
    ),
    [qq.cordThreadID],
  );

  return (
    <StaticQuestion
      active={active}
      final={botAnswer !== undefined}
      shellRef={shellRef}
      idx={idx}
      qq={qq}
      numQuestions={questions.length}
      botAnswer={botAnswer ?? _botAnswer}
      onSubmit={onSubmit}
      onNext={onNext}
      Text={TickerText}
      Thread={Thread}
    />
  );
}
