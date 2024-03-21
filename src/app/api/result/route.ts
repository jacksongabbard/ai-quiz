import { addContentToClack } from '@/lib/clack';
import { SERVER } from '@/lib/env';
import { assertGameNotLocked, lockGame } from '@/lib/lock';
import { parseThreadID } from '@/lib/threadID';
import type { ClientAnswers } from '@/ui/Quiz';
import { MessageNodeType } from '@cord-sdk/types';
import { NextResponse } from 'next/server';

async function addGameCompleteToClack(
  threadID: string,
  answers: ClientAnswers,
  copyString: string,
) {
  const [id] = parseThreadID(threadID);
  await addContentToClack(id, [
    {
      type: MessageNodeType.PARAGRAPH,
      children: [
        { text: 'Game ' },
        { text: id, code: true },
        { text: ' complete. Results: ' + SERVER + '/share/' + id },
      ],
    },
    { type: MessageNodeType.CODE, children: [{ text: copyString }] },
    {
      type: MessageNodeType.CODE,
      children: [{ text: JSON.stringify(answers, null, 2) }],
    },
  ]);
}

export async function POST(req: Request) {
  const data = await req.json();
  console.log('complete', data);
  const threadID: string | undefined = data?.threadID;
  if (threadID === undefined) {
    throw new Error('Missing threadID');
  }

  const [id] = parseThreadID(threadID);
  await assertGameNotLocked(id);
  await Promise.all([
    lockGame(id, data?.answers ?? []),
    addGameCompleteToClack(
      threadID,
      data?.answers ?? [],
      data?.copyString ?? '',
    ),
  ]);

  return NextResponse.json(true);
}
