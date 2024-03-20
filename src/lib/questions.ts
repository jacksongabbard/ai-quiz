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
    preferences. No one knows how many people are in each group. The people in
    the first group individually believe they make up a majority. On average,
    what is likely to be true of each indvidual in the second group?`,
    answers: [
      'They each believe they are in the minority',
      'They each believe the groups are equal',
      'They each believe they are in the majority',
      'They each have no consistent beliefs',
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
  {
    question:
      "You have a dollar in coins. The coins are separated into 10 piles.\nThe value of the piles are: 1, 1, 2, 3, 5, 8, 13, 21, 34, ____.\n\nWhat's the value of the last pile?",
    answers: ['55', '34', '12', '1'],
    correctAnswerIndex: 2,
  },
];
