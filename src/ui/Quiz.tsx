'use client';

import { useCallback, useEffect, useState } from 'react';
import { CordProvider } from '@cord-sdk/react';

import Question from '@/ui/Question';
import { Start } from '@/ui/Start';
import type { ClientQuizQuestion } from '@/app/page';

export function Quiz({
  questions,
  accessToken,
}: {
  questions: ClientQuizQuestion[];
  accessToken: string;
}) {
  return (
    <CordProvider clientAuthToken={accessToken}>
      <QuizImpl questions={questions} />
    </CordProvider>
  );
}

function QuizImpl({ questions }: { questions: ClientQuizQuestion[] }) {
  const [currentQuestion, setCurrentQuestion] = useState(-1);
  const [answers, setAnswers] = useState<
    { humanAnswer: number; botAnswer: number }[]
  >([]);

  const showNextQuestion = useCallback(() => {
    const nextQuestion = currentQuestion + 1;
    void fetch('/api/begin-question', {
      body: JSON.stringify({ threadID: questions[nextQuestion].cordThreadID }),
      method: 'POST',
    });
    setCurrentQuestion(nextQuestion);
  }, [questions, currentQuestion]);

  let content: React.ReactNode[] = [
    <Start
      key="start"
      onStart={currentQuestion === -1 ? showNextQuestion : undefined}
    />,
  ];
  if (currentQuestion === -1) {
    return content;
  }

  for (let i = 0; i <= Math.min(questions.length - 1, currentQuestion); i++) {
    content.push(
      <Question
        active={i === currentQuestion}
        key={questions[i].question}
        qq={questions[i]}
        {...answers[i]}
        onSubmit={(humanAnswer: number, botAnswer: number) => {
          const newAnswers = [...answers];
          newAnswers[i] = { humanAnswer, botAnswer };
          setAnswers(newAnswers);
        }}
        onNext={showNextQuestion}
      />,
    );
  }

  if (currentQuestion === questions.length) {
    content.push(<p>All done!</p>);
  }

  return <>{content}</>;
}
