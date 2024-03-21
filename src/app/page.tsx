import Head from 'next/head';
import { getClientAuthToken } from '@cord-sdk/server';

import { BaseQuizQuestion, questions } from '@/lib/questions';
import { uuid } from '@/lib/uuid';
import { fetchCordRESTApi } from '@/lib/fetchCordRESTApi';
import { CORD_API_SECRET, CORD_APPLICATION_ID, SERVER } from '@/lib/env';
import { Quiz } from '@/ui/Quiz';

import styles from './page.module.css';

export type ClientQuizQuestion = BaseQuizQuestion & { cordThreadID: string };

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

export default async function Home() {
  const data = await getQuizData();
  return (
    <>
      <div className="gradient"></div>
      <main className={styles.main}>
        <Quiz questions={data.questions} accessToken={data.cordAccessToken} />
      </main>
    </>
  );
}
