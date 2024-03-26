export type BaseQuizQuestion = {
  question: string;
  answers: string[];
  correctAnswerIndex: number;
};

export const questions: BaseQuizQuestion[] = [
  {
    question: 'Which of these is not like the others?',
    answers: ['tatlı rüzgar', '放屁', 'తీపి గాలి', 'afẹfẹ didun'],
    correctAnswerIndex: 1,
  },
  {
    question: 'One of these things is not like the others. Which one is it?',
    answers: ['l', 'I', 'l', 'l'],
    correctAnswerIndex: 1,
  },
  {
    question:
      'Which of these words, if you remove one letter, is an anagram of "China"?',
    answers: ['Chains', 'Chins', 'Panic', 'Change'],
    correctAnswerIndex: 0,
  },
  {
    question:
      `You have 100 cents in coins. The coins are separated into 10 piles.\n` +
      `The value of the piles are: 1, 1, 2, 3, 5, 8, 13, 21, 34, ____.\n\n` +
      `What's the value of the last pile?`,
    answers: ['55', '34', '12', '1'],
    correctAnswerIndex: 2,
  },
  {
    question:
      `Adam's net worth is $100. He gives half of that to Beth. She ` +
      `gives half of that to Charles. He adds $1 of his own and gives half of that ` +
      `to Denise. She gives all of that to Adam. Who of the following is the ` +
      `wealthiest person?`,
    answers: ['Adam', 'Taylor Swift', 'King Charles III', 'Elon Musk'],
    correctAnswerIndex: 3,
  },
  {
    question: 'Who was born earliest?',
    answers: [
      'Gaozu of Han',
      'Marcus Aurelius',
      'Pharoah Tutankhamun',
      'Sundiata Keita',
    ],
    correctAnswerIndex: 2,
  },
  {
    question:
      `In the following list, find a group of four related things.\n` +
      '\n' +
      'Racket, Fuji, Gale,\n' +
      'Signal, Grandmother, Envy,\n' +
      'Orange, Ambrosia, Typhoon,\n' +
      'Digital, Uncle, Opal',
    answers: [
      'Racket, Grandmother, Typhoon, Uncle',
      'Gale, Signal, Orange, Digital',
      'Fuji, Grandmother, Orange, Digital',
      'Fuji, Envy, Ambrosia, Opal',
    ],
    correctAnswerIndex: 3,
  },
];
