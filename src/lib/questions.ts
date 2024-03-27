export type BaseQuizQuestion = {
  question: string;
  answers: string[];
  correctAnswerIndex: number;
  explanation: string;
};

export const questions: BaseQuizQuestion[] = [
  {
    question:
      `Lionardo Fibonacci has exactly 100 coins. His coins are separated into 10 piles.\n\n` +
      `The number of coins in the first 9 piles are as follows:\n1, 1, 2, 3, 5, 8, 13, 21, 34.\n\n` +
      `How many coins are in the last pile?`,
    answers: ['55', '34', '12', '1'],
    correctAnswerIndex: 2,
    explanation: [
      'An LLM is basically just an extremely fancy autocomplete engine. It continues the conversation with whatever it thinks the most "likely" continuation is.',
      "That means that it's pretty susceptible to being caught out by irrelevant patterns which appear a lot in its training data.",
    ].join(' '),
  },
  {
    question: 'One of these things is not like the others. Which one is it?',
    answers: ['l', 'I', 'l', 'l'],
    correctAnswerIndex: 1,
    explanation:
      "An LLM isn't going to be tricked by the visual similarity of items. It has an easy time seeing the difference between the digital data!",
  },
  {
    question: 'Who is the current monarch of the United Kingdom?',
    answers: ['King George VI', 'Queen Elizabeth II', 'King Charles III'],
    correctAnswerIndex: 2,
    explanation: [
      "It takes a long time to train an LLM, and so they won't have great knowledge of current events.",
      'GPT-4 was trained on data from 2021, well before Queen Elizabeth II died in 2022.',
    ].join(' '),
  },
  {
    question:
      'If you take the first, second, and last letter from each of the following, for which do those three letters spell a new word?',
    answers: ['SLIMY', 'PLANTS', 'TRAIN', 'CRYING'],
    correctAnswerIndex: 0,
    explanation: '',
  },
  {
    question: 'What is 23 * 24 * 102 * 407 + 1?',
    answers: ['22915726', '22915727', '22915728', '22915729'],
    correctAnswerIndex: 3,
    explanation: '',
  },
  {
    question: ['W I O P T', 'H S N L W', 'A   E U O', 'T     S'].join('\n'),
    answers: ['1', '2', '3', '4'],
    correctAnswerIndex: 2,
    explanation: '',
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
    explanation: '',
  },
];
