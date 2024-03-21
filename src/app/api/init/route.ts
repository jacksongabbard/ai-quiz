import { getClientAuthToken } from '@cord-sdk/server';

import { questions } from '@/lib/questions';
import { uuid } from '@/lib/uuid';
import { fetchCordRESTApi } from '@/lib/fetchCordRESTApi';
import { CORD_API_SECRET, CORD_APPLICATION_ID, SERVER } from '@/lib/env';
import { NextResponse } from 'next/server';
import type { ClientQuizQuestion } from '@/app/page';

export type QuizData = {
  cordAccessToken: string;
  questions: ClientQuizQuestion[];
};

async function getQuizData(): Promise<QuizData> {
  const id = uuid();

  const human = 'h:' + id;
  const bot = 'b:' + id;
  const group = 'g:' + id;
  const thread = (n: number) => {
    const threadID = 't:' + id + ':' + String(n);

    // Work around Cord issue with serializable txns when creating threads in
    // quick succession by not doing them in such quick succession.  Flooey is
    // looking into it -- when fixed, we can remove this setTimeout and just
    // call the function directly.
    setTimeout(
      () =>
        void fetchCordRESTApi(
          '/v1/threads',
          'POST',
          JSON.stringify({
            id: threadID,
            name: 'Question ' + String(n),
            url: 'https://www.cord.com/',
            groupID: group,
            location: { id, n },
          }),
        ),
      1000 * Math.random(),
    );

    return threadID;
  };

  await fetchCordRESTApi(
    '/v1/groups/' + group,
    'PUT',
    JSON.stringify({
      name: 'Quiz Group for ' + id,
    }),
  );

  await Promise.all([
    fetchCordRESTApi(
      '/v1/users/' + human,
      'PUT',
      JSON.stringify({
        name: 'You',
        profilePictureURL: SERVER + '/avatar-black.svg',
        addGroups: [group],
      }),
    ),
    fetchCordRESTApi(
      '/v1/users/' + bot,
      'PUT',
      JSON.stringify({
        name: 'AI',
        profilePictureURL: SERVER + '/bot-black.svg',
        addGroups: [group],
      }),
    ),
  ]);

  return {
    cordAccessToken: getClientAuthToken(CORD_APPLICATION_ID, CORD_API_SECRET, {
      user_id: human,
    }),
    questions: questions.map((q, n) => ({ ...q, cordThreadID: thread(n) })),
  };
}

export async function GET(req: Request) {
  const data = await getQuizData();
  return NextResponse.json(data);
}
