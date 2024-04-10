import type { ClientAnswers } from '@/ui/Quiz';
import { EntityMetadata, ServerGroupData } from '@cord-sdk/types';
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

export async function loadGameProgress(
  id: string,
): Promise<{ answers: ClientAnswers; questions: BaseQuizQuestion[] } | null> {
  const group = 'g:' + id;

  try {
    const groupData = await fetchCordRESTApi<ServerGroupData>(
      '/v1/groups/' + group,
      'GET',
    );

    const questions: BaseQuizQuestion[] = JSON.parse(
      String(groupData.metadata!.questions),
    );

    const answers: ClientAnswers = JSON.parse(
      String(groupData.metadata!.answers),
    );

    return { questions, answers };
  } catch (_e) {
    return null;
  }
}
