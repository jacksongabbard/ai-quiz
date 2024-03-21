import { NextResponse } from 'next/server';
import { addBotMessageToThread } from '@/lib/openai';
import { MessageNodeType } from '@cord-sdk/types';
import type { ClientAnswers } from '@/ui/Quiz';
import { addContentToClack } from '@/lib/clack';
import { parseThreadID } from '@/lib/threadID';
import { assertGameNotLocked } from '@/lib/lock';

export const maxDuration = 180;

async function addGameProgressToClack(
  threadID: string,
  answers: ClientAnswers,
) {
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
          text: ` to question ${
            Number(questionNumber) + 1
          }. Current answer set:`,
        },
      ],
    },
    {
      type: MessageNodeType.CODE,
      children: [{ text: JSON.stringify(answers, null, 2) }],
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
    addBotMessageToThread(threadID),
    addGameProgressToClack(threadID, data?.answers ?? []),
  ]);

  return NextResponse.json(true);
}
