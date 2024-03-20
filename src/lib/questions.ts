export type BaseQuizQuestion = {
  question: string;
  answers: string[];
  correctAnswerIndex: number;
};

export const questions: BaseQuizQuestion[] = [
  {
    question:
      'Which of these words, if you remove one letter, is an anagram of "China"?',
    answers: ['Chains', 'Chins', 'Panic', 'Change'],
    correctAnswerIndex: 0,
  },
  {
    question: `A hundred people are divided into two groups based on food
preferences. The people in the first group individually believe they make up a
majority. What is likely to be true of the second group?`,
    answers: [
      'They believe they are a minority',
      'They believe the groups are equal',
      'They believe themselves to be a majority',
      'They have no consistent beliefs',
    ],
    correctAnswerIndex: 2,
  },
  {
    question:
      'Consider the sequence 3, 7, 31, 127, 8191. Which of these numbers comes next?',
    answers: ['9001', '16383', '131071', '262104'],
    correctAnswerIndex: 2,
  },
  {
    question: `Adam's net worth is $100. He gives half of that to Beth. She
gives half of that to Charles. He adds $1 of his own and gives half of that
to Denise. She gives all of that to Adam. Who of the following is the
wealthiest person?`,
    answers: ['Adam', 'Taylor Swift', 'King Charles III', 'Elon Musk'],
    correctAnswerIndex: 3,
  },
  {
    question:
      'Sally sat on the seashore slurping a slushie. In what style should she sing after she swallows her snack?',
    answers: ['Loudly', 'Softly', 'Angrily', 'Lazily'],
    correctAnswerIndex: 1,
  },
];
