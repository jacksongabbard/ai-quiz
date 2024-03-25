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
  {
    question: 'The two letters "i" and "g" complete what word below?',
    answers: ['c__ap', 'we__h', 'g__st', 'try__'],
    correctAnswerIndex: 1,
  },
  {
    question:
      'When I was 6 years old, my sister was twice my age. I am now 30 years old. How old is my sister?',
    answers: ['6', '12', '36', '60'],
    correctAnswerIndex: 2,
  },
  {
    question: `You're standing at a point on the globe. You walk south 1 km. Then west 1 km. Then north 1 km. You feel hot, sandy air on your face. Where are you now?`,
    answers: [
      'North pole',
      'Chicago',
      'Back where you started',
      'Sahara Desert',
    ],
    correctAnswerIndex: 3,
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
      'Dumuzid the Fisherman',
      'Sundiata Keita',
    ],
    correctAnswerIndex: 2,
  },
  {
    question:
      'Three perfectly logical people are about to eat lunch. They all know exactly what they want.\n\n' +
      'The waiter asks the first person, "Would you all like today\'s special?"\n' +
      'The first person says, "Maybe."\n' +
      'The second person says, "Maybe."\n\n' +
      'Which of the following might the third person say?',
    answers: ['"Yes."', '"Maybe."', '"I\'m not sure what I want."'],
    correctAnswerIndex: 0,
  },
  {
    question:
      'Consider the well-known sequence 3, 7, 31, 127, 8191. Which of these numbers comes next?',
    answers: ['9001', '16383', '131071', '262104'],
    correctAnswerIndex: 2,
  },
  {
    question:
      `In the following list, find a group of four things.\n` +
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
  {
    question:
      'Given the following sequence, what comes next?\n' +
      '\n' +
      "'34, +39\n" +
      "'38, +39\n" +
      "'50, +598",
    answers: ["'42, +30", "'54, +49", "'62, +41", "'70, +89"],
    correctAnswerIndex: 1,
  },
];
