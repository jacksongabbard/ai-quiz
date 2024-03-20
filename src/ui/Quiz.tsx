'use client';

import { useState } from 'react';
import { CordProvider } from '@cord-sdk/react';

import { QuizQuestion } from '@/lib/questions';
import Question from '@/ui/Question';

export function Quiz({
  questions,
  accessToken,
}: {
  questions: QuizQuestion[];
  accessToken: string;
}) {
  const [currentQuestion, setCurrentQuestion] = useState(-1);

  if (currentQuestion === -1) {
    return (
      <p>
        <button onClick={() => setCurrentQuestion(0)}>Start</button>
      </p>
    );
  }

  let qs: React.ReactNode[] = [];
  for (let i = 0; i <= currentQuestion; i++) {
    qs.push(<Question qq={questions[currentQuestion]} />);
  }

  return <CordProvider clientAuthToken={accessToken}>{qs}</CordProvider>;
}
