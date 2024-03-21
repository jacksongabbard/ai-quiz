'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { CordProvider } from '@cord-sdk/react';

import Question from '@/ui/Question';
import { Start } from '@/ui/Start';
import type { ClientQuizQuestion } from '@/app/page';
import { Scorecard } from '@/ui/Scorecard';
import type { QuizData } from '@/app/api/init/route';

export function Quiz() {
  const [quizData, setQuizData] = useState<QuizData>();
  const didFetch = useRef(false);

  useEffect(() => {
    // Force mobile phones to scroll to the top of the page
    // so we get the full viewport
    setTimeout(() => window.scrollTo(0, 0), 50);
  }, []);

  useEffect(() => {
    if (didFetch.current) {
      return;
    }

    didFetch.current = true;
    (async () => {
      const resp = await fetch('/api/init', { method: 'POST' });
      const data = await resp.json();
      setQuizData(data);
    })();
  });

  const questions = quizData?.questions ?? [];
  const maybeAccessToken = quizData?.cordAccessToken;
  const quiz = <QuizImpl questions={questions} />;

  return <CordProvider clientAuthToken={maybeAccessToken}>{quiz}</CordProvider>;
}

export type ClientAnswers = {
  humanAnswer: number;
  botAnswer: number | undefined;
}[];

function QuizImpl({ questions }: { questions: ClientQuizQuestion[] }) {
  const [currentQuestion, setCurrentQuestion] = useState(-1);
  const [answers, setAnswers] = useState<ClientAnswers>([]);

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
          answers,
        }),
        method: 'POST',
      });
    }, delay * 35); // same as the ticker text
  }, [answers, questions, currentQuestion]);

  let content: React.ReactNode[] = [
    <Start
      key="start"
      onStart={
        currentQuestion === -1 && questions.length > 0
          ? showNextQuestion
          : undefined
      }
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
        onSubmit={(humanAnswer: number, botAnswer: number | undefined) => {
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
