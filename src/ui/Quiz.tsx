'use client';

import { useState } from 'react';
import { CordProvider } from '@cord-sdk/react';

import { QuizQuestion } from '@/lib/questions';
import Question from '@/ui/Question';
import { Start } from '@/ui/Start';

export function Quiz({
  questions,
  accessToken,
}: {
  questions: QuizQuestion[];
  accessToken: string;
}) {
  const [currentQuestion, setCurrentQuestion] = useState(-1);

  if (currentQuestion === -1) {
    return <Start onStart={() => setCurrentQuestion(0)} />;
  }

  let qs: React.ReactNode[] = [];
  for (let i = 0; i <= currentQuestion; i++) {
    qs.push(<Question qq={questions[currentQuestion]} />);
  }

  return <CordProvider clientAuthToken={accessToken}>{qs}</CordProvider>;
}
