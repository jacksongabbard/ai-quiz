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
      "That means that it's pretty susceptible to being caught out by irrelevant patterns which appear a lot in its training data -- they seem extremely likely since they appear so often, even if they are (to a human) obviously inapplicable.",
    ].join(' '),
  },
  {
    question: 'One of these things is not like the others. Which one is it?',
    answers: ['l', 'I', 'l', 'l'],
    correctAnswerIndex: 1,
    explanation:
      "An LLM isn't going to be tricked by the visual similarity of these characters. LLMs work on the concept of 'tokens', which are basically numbers that represent characters of text. A human eye sees no difference, but an LLM sees 326, 358, 326, and 326. Clear as day.",
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
    explanation: [
      "LLMs don't really see words like we do. They break text down into tokens. Tokens can be individual characters, portions of words, and sometimes entire words.",
      "That means that they can have a hard time manipulating things which don't cleanly line up at token boundaries, such as slicing apart words.",
      "If the problem is one that has come up a lot in training data, the LLM can typically pattern match against that well enough (they don't have a lot of difficulty reading backwards, for example).",
      'But for something even slightly novel, they are pretty lost.',
    ].join('\n'),
  },
  {
    question: 'What is 23 * 24 * 102 * 407 + 1?',
    answers: ['22915726', '22915727', '22915728', '22915729'],
    correctAnswerIndex: 3,
    explanation: [
      "An LLM can't really do arithmetic. For simple or common problems, it can easily match against problems it's seen before.",
      "But for complex problems it hasn't seen before, it has nothing to match against.",
      "In this particular case, the multiplication is simple enough that it doesn't have much trouble with it -- but the addition at the end throws things off.",
    ].join(' '),
  },
  {
    question: [
      'C A P T C H A',
      'H N I H O E N',
      'O D C E S A S',
      'O   K   M V W',
      'S       I E E',
      'E       C N R',
      '          L',
      '          Y',
    ].join('\n'),
    answers: ['The Milky Way', 'Alan Turing', 'Reggae', 'Scotland'],
    correctAnswerIndex: 0,
    explanation: [
      "An LLM can only pattern match against what it's seen before. It has no ability to reason or think latteraly (or read vertically).",
      "In this case, while it's seen word searches and acrostics before, it doesn't really understand them, so its pattern matching goes completely haywire.",
      "It can't read vertically, and sees all sorts of things that aren't there.",
      "If you didn't notice, you can convince it of just about any answer by saying that it appears in the puzzle, and it will agree!",
    ].join(' '),
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
    explanation: [
      "Even though it's trivial for humans, LLMs have no ability to do any sort of spatial reasoning.",
      'They are restricted both by their nature as text completion engines and by their tokenization. Both prevent them from "seeing" the board the way a human does.',
      'This, combined with the "best" move being "none of the above" -- so that it doesn\'t appear in the answers to match against -- gives the LLM no hope.',
    ].join(' '),
  },
];
