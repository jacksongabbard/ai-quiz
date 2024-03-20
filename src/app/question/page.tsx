import Question from '@/ui/Question';

const Q = {
  question: `A hundred people are divided into two groups based on food
preferences. The people in the first group individually believe they make up a
majority. What is likely to be true of the second group?`,
  answers: [
    `They believe they are a minority`,
    `They believe the groups are equal`,
    `They believe themselves to be a majority.`,
    `They have no consistent beliefs`,
  ],
  correctAnswerIndex: 2,
};

export default function page() {
  return <Question qq={Q} />;
}
