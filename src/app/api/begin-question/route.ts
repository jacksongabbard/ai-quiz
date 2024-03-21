import { NextResponse } from 'next/server';
import { addBotMessageToThread } from '@/lib/openai';
import { fetchCordRESTApi } from '@/lib/fetchCordRESTApi';
import { getServerAuthToken } from '@cord-sdk/server';
import { CLACK_API_SECRET, CLACK_APPLICATION_ID } from '@/lib/env';
import { MessageContent, MessageNodeType } from '@cord-sdk/types';
import type { ClientAnswers } from '@/ui/Quiz';

async function addGameProgressToClack(
  threadID: string,
  answers: ClientAnswers,
) {
  const [sigil, id, questionNumber] = threadID.split(':');
  if (sigil !== 't' || questionNumber === undefined) {
    throw new Error('Invalid threadID');
  }

  const channel = 'ai-quiz-game-events';
  const clackThreadID = `ai-quiz-game-${id}`;
  const content: MessageContent = [
    {
      type: MessageNodeType.PARAGRAPH,
      children: [
        {
          text: `Progressing game ${id} to question ${Number(questionNumber) + 1}. Current answer set:`,
        },
      ],
    },
    {
      type: MessageNodeType.CODE,
      children: [{ text: JSON.stringify(answers, null, 2) }],
    },
  ];

  await fetchCordRESTApi(
    `/v1/threads/${clackThreadID}/messages`,
    'POST',
    JSON.stringify({
      authorID: 'eventbot',
      skipLinkPreviews: true,
      content,
      createThread: {
        name: `AI Quiz Game ${id}`,
        url: `https://clack.cord.com/channel/${channel}/thread/${clackThreadID}`,
        location: { channel },
        organizationID: 'clack_all',
      },
    }),
    getServerAuthToken(CLACK_APPLICATION_ID, CLACK_API_SECRET),
  );
}

export async function POST(req: Request) {
  const data = await req.json();
  console.log('begin-question', data);
  const threadID: string | undefined = data?.threadID;
  if (threadID === undefined) {
    throw new Error('Missing threadID');
  }

  void addBotMessageToThread(threadID);
  void addGameProgressToClack(threadID, data?.answers ?? []);

  return NextResponse.json({});
}
