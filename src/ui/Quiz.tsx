'use client';

import { useCallback, useEffect, useState } from 'react';
import { CordProvider } from '@cord-sdk/react';

import Question from '@/ui/Question';
import { Start } from '@/ui/Start';
import type { ClientQuizQuestion } from '@/app/page';
import { Scorecard } from '@/ui/Scorecard';

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
    setCurrentQuestion(nextQuestion);
    if (nextQuestion >= questions.length) {
      return;
    }
    let delay = questions[nextQuestion].question.length;
    for (let i = 0; i < questions[nextQuestion].answers.length; i++) {
      delay += questions[nextQuestion].answers[i].length;
    }
    setTimeout(() => {
      void fetch('/api/begin-question', {
        body: JSON.stringify({
          threadID: questions[nextQuestion].cordThreadID,
        }),
        method: 'POST',
      });
    }, delay * 35); // same as the ticker text
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
        idx={i}
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
    content.push(
      <Scorecard key="scorecard" answers={answers} questions={questions} />,
    );
  }

  return <>{content}</>;
}
