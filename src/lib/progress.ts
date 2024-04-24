import type { ClientAnswers } from '@/ui/Quiz';
import { EntityMetadata, ServerUserData } from '@cord-sdk/types';
import { questions as productionQuestions } from './questions';
import type { BaseQuizQuestion } from './questions';
import { fetchCordRESTApi } from './fetchCordRESTApi';

export async function saveGameProgress(
  id: string,
  answers: ClientAnswers,
  extra: EntityMetadata = {},
) {
  const oldProgress = await loadGameProgress(id);

  const bot = 'b:' + id;
  await fetchCordRESTApi(
    '/v1/users/' + bot,
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

  try {
    const botData = await fetchCordRESTApi<ServerUserData>(
      '/v1/users/' + bot,
      'GET',
    );

    const questions: BaseQuizQuestion[] = JSON.parse(
      String(botData.metadata.questions),
    );

    const answers: ClientAnswers = JSON.parse(String(botData.metadata.answers));

    return { questions, answers, locked: !!botData.metadata.locked };
  } catch (_e) {
    return null;
  }
}
