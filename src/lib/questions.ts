export type QuizQuestion = {
  question: string;
  answers: string[];
  correctAnswerIndex: number;
};

export const questions: QuizQuestion[] = [
  {
    question:
      'Which of these words, if you remove one letter, is an anagram of "China"?',
    answers: ['Chains', 'Chins', 'Panic', 'Change'],
    correctAnswerIndex: 0,
  },
];
