import type { ServerUserData } from '@cord-sdk/types';
import { fetchCordRESTApi } from './fetchCordRESTApi';
import { ClientAnswers } from '@/ui/Quiz';
import { saveGameProgress } from './progress';

export async function lockGame(id: string, answers: ClientAnswers) {
  await saveGameProgress(id, answers, { locked: true });
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
