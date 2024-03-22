import type { ClientAnswers } from '@/ui/Quiz';
import { EntityMetadata } from '@cord-sdk/types';
import { questions } from './questions';
import { fetchCordRESTApi } from './fetchCordRESTApi';

export async function saveGameProgress(
  id: string,
  answers: ClientAnswers,
  extra: EntityMetadata = {},
) {
  const bot = 'b:' + id;
  await fetchCordRESTApi(
    '/v1/users/' + bot,
    'PUT',
    JSON.stringify({
      metadata: {
        ...extra,
        answers: JSON.stringify(answers),
        questions: JSON.stringify(questions),
      },
    }),
  );
}
