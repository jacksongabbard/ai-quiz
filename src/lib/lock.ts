import type { ServerUserData } from '@cord-sdk/types';
import { fetchCordRESTApi } from './fetchCordRESTApi';
import { ClientAnswers } from '@/ui/Quiz';
import { questions } from './questions';

export async function lockGame(id: string, answers: ClientAnswers) {
  const bot = 'b:' + id;
  await fetchCordRESTApi(
    '/v1/users/' + bot,
    'PUT',
    JSON.stringify({
      metadata: {
        locked: true,
        answers: JSON.stringify(answers),
        questions: JSON.stringify(questions),
      },
    }),
  );
}

export async function assertGameNotLocked(id: string) {
  const bot = 'b:' + id;
  const botData: ServerUserData = await fetchCordRESTApi(
    '/v1/users/' + bot,
    'GET',
  );

  const locked = botData.metadata?.locked ?? false;
  if (locked) {
    throw new Error('Cannot keep playing locked game');
  }
}
