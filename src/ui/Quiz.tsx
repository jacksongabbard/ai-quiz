'use client';

import { useCallback, useState } from 'react';
import { CordProvider } from '@cord-sdk/react';

import Question from '@/ui/Question';
import { Start } from '@/ui/Start';
import type { QuizData } from '@/app/page';

export function Quiz({
  questions,
  accessToken,
}: {
  questions: QuizData['questions'];
  accessToken: string;
}) {
  return (
    <CordProvider clientAuthToken={accessToken}>
      <QuizImpl questions={questions} />
    </CordProvider>
  );
}

function QuizImpl({ questions }: { questions: QuizData['questions'] }) {
  const [currentQuestion, setCurrentQuestion] = useState(-1);
  const showNextQuestion = useCallback(() => {
    const nextQuestion = currentQuestion + 1;
    void fetch('/api/begin-question', {
      body: JSON.stringify({ threadID: questions[nextQuestion].cordThreadID }),
      method: 'POST',
    });
    setCurrentQuestion(nextQuestion);
  }, [questions, currentQuestion]);

  if (currentQuestion === -1) {
    return <Start onStart={showNextQuestion} />;
  }

  let qs: React.ReactNode[] = [];
  for (let i = 0; i <= currentQuestion; i++) {
    qs.push(<Question qq={questions[currentQuestion]} />);
  }

  return <>{qs}</>;
}
