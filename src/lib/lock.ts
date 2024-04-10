import type { ServerGroupData } from '@cord-sdk/types';
import { fetchCordRESTApi } from './fetchCordRESTApi';
import { ClientAnswers } from '@/ui/Quiz';
import { saveGameProgress } from './progress';

export async function lockGame(id: string, answers: ClientAnswers) {
  await saveGameProgress(id, answers, { locked: true });
}

export async function assertGameNotLocked(id: string) {
  const group = 'g:' + id;
  const groupData: ServerGroupData = await fetchCordRESTApi(
    '/v1/groups/' + group,
    'GET',
  );

  const locked = groupData.metadata?.locked ?? false;
  if (locked) {
    throw new Error('Cannot keep playing locked game');
  }
}
