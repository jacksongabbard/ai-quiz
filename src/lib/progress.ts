import type { ClientAnswers } from '@/ui/Quiz';
import {
  EntityMetadata,
  ServerGroupData,
  ServerUserData,
} from '@cord-sdk/types';
import { questions as productionQuestions } from './questions';
import type { BaseQuizQuestion } from './questions';
import { fetchCordRESTApi } from './fetchCordRESTApi';

export async function saveGameProgress(
  id: string,
  answers: ClientAnswers,
  extra: EntityMetadata = {},
) {
  const oldProgress = await loadGameProgress(id);

  const group = 'g:' + id;
  await fetchCordRESTApi(
    '/v1/groups/' + group,
    'PUT',
    JSON.stringify({
      metadata: {
        ...extra,
        answers: JSON.stringify(answers),
        questions: JSON.stringify(
          oldProgress ? oldProgress.questions : productionQuestions,
        ),
      },
    }),
  );
}

export async function loadGameProgress(id: string): Promise<{
  answers: ClientAnswers;
  questions: BaseQuizQuestion[];
  locked: boolean;
} | null> {
  const bot = 'b:' + id;
  const group = 'g:' + id;

  try {
    // We used to store on the bot, now on the group. Fetch both for BC.
    const [botData, groupData] = await Promise.all([
      fetchCordRESTApi<ServerUserData>('/v1/users/' + bot, 'GET'),
      fetchCordRESTApi<ServerGroupData>('/v1/groups/' + group, 'GET'),
    ]);

    const combinedMetadata = { ...botData.metadata, ...groupData.metadata };

    const questions: BaseQuizQuestion[] = JSON.parse(
      String(combinedMetadata.questions),
    );

    const answers: ClientAnswers = JSON.parse(String(combinedMetadata.answers));

    return { questions, answers, locked: !!combinedMetadata.locked };
  } catch (_e) {
    return null;
  }
}
