import { NextResponse } from 'next/server';
import { BOT_ID, getChatbotRegistry } from '@/lib/openai';
import { MessageNodeType } from '@cord-sdk/types';
import { addContentToClack } from '@/lib/clack';
import { parseThreadID } from '@/lib/threadID';
import { assertGameNotLocked } from '@/lib/lock';
import { saveGameProgress } from '@/lib/progress';
import { SERVER } from '@/lib/env';

export const maxDuration = 180;

async function addGameProgressToClack(threadID: string) {
  const [id, questionNumber] = parseThreadID(threadID);

  await addContentToClack(id, [
    {
      type: MessageNodeType.PARAGRAPH,
      children: [
        {
          text: 'Progressing game ',
        },
        {
          text: id,
          code: true,
        },
        {
          text: ` to question ${Number(questionNumber) + 1}.`,
        },
      ],
    },
    {
      type: MessageNodeType.PARAGRAPH,
      children: [{ text: `${SERVER}/share/${id}` }],
    },
  ]);
}

export async function POST(req: Request) {
  const data = await req.json();
  console.log('begin-question', data);
  const threadID: string | undefined = data?.threadID;
  if (threadID === undefined) {
    throw new Error('Missing threadID');
  }

  const [id] = parseThreadID(threadID);
  await assertGameNotLocked(id);

  await Promise.all([
    getChatbotRegistry().then((registry) =>
      registry.forceRespond(BOT_ID, threadID),
    ),
    saveGameProgress(id, data?.answers ?? []),
    addGameProgressToClack(threadID),
  ]);

  return NextResponse.json(true);
}
