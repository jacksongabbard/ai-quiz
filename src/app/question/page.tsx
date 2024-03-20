import { questions } from '@/lib/questions';
import Question from '@/ui/Question';

export default function page() {
  return <Question qq={questions[0]} />;
}
