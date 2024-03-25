'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CordProvider } from '@cord-sdk/react';

import Question from '@/ui/Question';
import { Start } from '@/ui/Start';
import { Scorecard, getShareURL } from '@/ui/Scorecard';
import type { InitResponse, QuizData } from '@/app/api/init/route';

const TOKEN_LOCALSTORAGE = 'cordAccessToken';
export function resetTokenAndRestartGame() {
  window.localStorage.removeItem(TOKEN_LOCALSTORAGE);
  window.location.href = '/';
}

export type ClientAnswers = {
  humanAnswer: number;
  botAnswer: number | undefined;
}[];

export function Quiz() {
  const [quizData, setQuizData] = useState<QuizData>();
  const [currentQuestion, setCurrentQuestion] = useState(-1);
  const [answers, setAnswers] = useState<ClientAnswers>([]);
  const [aboutToResume, setAboutToResume] = useState(false);

  const didFetch = useRef(false);

  useEffect(() => {
    if (didFetch.current) {
      return;
    }

    didFetch.current = true;
    void (async () => {
      let oldToken = null;
      try {
        oldToken = localStorage.getItem(TOKEN_LOCALSTORAGE);
      } catch (_e) {}

      const resp = await fetch('/api/init', {
        body: JSON.stringify({ token: oldToken }),
        method: 'POST',
      });

      const data: InitResponse = await resp.json();
      setQuizData(data.quizData);
      try {
        localStorage.setItem(TOKEN_LOCALSTORAGE, data.quizData.cordAccessToken);
      } catch (_e) {}

      const resume = data?.resume;
      if (resume) {
        if (resume.length === data.quizData.questions.length) {
          window.location.href = getShareURL(
            data.quizData.questions[0].cordThreadID,
          )!;
        } else {
          setAnswers(resume);
          setCurrentQuestion(resume.length);
          setAboutToResume(true);
        }
      }
    })();
  }, []);

  const questions = useMemo(
    () => quizData?.questions ?? [],
    [quizData?.questions],
  );
  const maybeAccessToken = quizData?.cordAccessToken;

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

    // This is the same as the ticker text,
    // but give 2 seconds of wait time for reading
    const ms = delay * 35 + 2000;
    setTimeout(() => {
      void fetch('/api/begin-question', {
        body: JSON.stringify({
          threadID: questions[nextQuestion].cordThreadID,
          answers,
        }),
        method: 'POST',
      });
    }, ms);
  }, [answers, questions, currentQuestion]);

  const onSubmit = useCallback(
    (
      questionIndex: number,
      humanAnswer: number,
      botAnswer: number | undefined,
    ) => {
      const newAnswers = [...answers];
      newAnswers[questionIndex] = { humanAnswer, botAnswer };
      setAnswers(newAnswers);
    },
    [answers, setAnswers],
  );

  const content: React.ReactNode[] = [
    <Start
      key="start"
      label={aboutToResume ? 'Resume Game' : 'Begin!'}
      onStart={
        aboutToResume
          ? () => setAboutToResume(false)
          : currentQuestion === -1 && questions.length > 0
            ? showNextQuestion
            : undefined
      }
      onRestart={aboutToResume ? resetTokenAndRestartGame : undefined}
    />,
  ];

  for (let i = 0; i <= Math.min(questions.length - 1, currentQuestion); i++) {
    content.push(
      <Question
        active={i === currentQuestion && !aboutToResume}
        idx={i}
        key={questions[i].question}
        qq={questions[i]}
        {...answers[i]}
        onSubmit={onSubmit}
        onNext={showNextQuestion}
      />,
    );
  }

  if (currentQuestion === questions.length) {
    content.push(
      <Scorecard
        key="scorecard"
        answers={answers}
        questions={questions}
        firstThreadID={questions[0].cordThreadID}
      />,
    );
  }

  return (
    <CordProvider clientAuthToken={maybeAccessToken}>{content}</CordProvider>
  );
}
