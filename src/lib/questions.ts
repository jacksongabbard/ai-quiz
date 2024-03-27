export type BaseQuizQuestion = {
  question: string;
  answers: string[];
  correctAnswerIndex: number;
};

export const questions: BaseQuizQuestion[] = [
  {
    question:
      `Lionardo Fibonacci has exactly 100 coins. His coins are separated into 10 piles.\n\n` +
      `The number of coins in the first 9 piles are as follows:\n1, 1, 2, 3, 5, 8, 13, 21, 34.\n\n` +
      `How many coins are in the last pile?`,
    answers: ['55', '34', '12', '1'],
    correctAnswerIndex: 2,
  },
  {
    question: 'One of these things is not like the others. Which one is it?',
    answers: ['l', 'I', 'l', 'l'],
    correctAnswerIndex: 1,
  },
  {
    question:
      'If you take the first, second, and last letter from each of the following, for which do those three letters spell a new word?',
    answers: ['SLIMY', 'PLANTS', 'TRAIN', 'CRYING'],
    correctAnswerIndex: 0,
  },
  {
    question: 'What is 23 * 24 * 102 * 407 + 1?',
    answers: ['22915726', '22915727', '22915728', '22915729'],
    correctAnswerIndex: 3,
  },
  {
    question: ['W I O P T', 'H S N L W', 'A   E U O', 'T     S'].join('\n'),
    answers: ['1', '2', '3', '4'],
    correctAnswerIndex: 2,
  },
  {
    question: [
      `Where should the next move be?`,
      '',
      ` x |   |   `,
      `-----------`,
      `   | o |   `,
      `-----------`,
      ` o | x | x `,
    ].join('\n'),
    answers: ['Middle left', 'Top left', 'Bottom middle', 'None of these'],
    correctAnswerIndex: 3,
  },
];
