import type { ClientQuizQuestion } from '@/app/page';
import { fetchCordRESTApi } from '@/lib/fetchCordRESTApi';
import type { BaseQuizQuestion } from '@/lib/questions';
import type { ClientAnswers } from '@/ui/Quiz';
import { Scorecard } from '@/ui/Scorecard';
import StaticQuestion from '@/ui/StaticQuestion';
import type { TickerText } from '@/ui/TickerText';
import type { ServerUserData } from '@cord-sdk/types';

const error = <div>Invalid game ID.</div>;

const StaticText: typeof TickerText = ({ text }) => <>{text}</>;

export default async function Share({ params }: { params: { id: string } }) {
  const bot = 'b:' + params.id;

  let botData: ServerUserData;
  try {
    botData = await fetchCordRESTApi('/v1/users/' + bot, 'GET');
  } catch (e) {
    console.log(e);
    return error;
  }

  if (botData.metadata.locked !== true) {
    return error;
  }

  const baseQuestions: BaseQuizQuestion[] = JSON.parse(
    String(botData.metadata.questions),
  );
  const clientQuestions: ClientQuizQuestion[] = baseQuestions.map((q, n) => ({
    ...q,
    cordThreadID: 't:' + params.id + ':' + n,
  }));

  const answers: ClientAnswers = JSON.parse(String(botData.metadata.answers));

  return (
    <div>
      {baseQuestions.map((qq, idx) => (
        <StaticQuestion
          key={idx}
          active={false}
          final={true}
          idx={idx}
          qq={qq}
          numQuestions={baseQuestions.length}
          humanAnswer={answers[idx].humanAnswer}
          botAnswer={answers[idx].botAnswer}
          onChangeHumanAnswer={(_) => {}}
          onSubmit={(_a, _b) => {}}
          onNext={() => {}}
          Text={StaticText}
          Thread={() => <div>read-only thread goes here eventually</div>}
        />
      ))}
      <Scorecard readOnly answers={answers} questions={clientQuestions} />
    </div>
  );
}
