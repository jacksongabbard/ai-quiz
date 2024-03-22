import { addContentToClack } from '@/lib/clack';
import { SERVER } from '@/lib/env';
import { assertGameNotLocked, lockGame } from '@/lib/lock';
import { parseThreadID } from '@/lib/threadID';
import { MessageNodeType } from '@cord-sdk/types';
import { NextResponse } from 'next/server';

async function addGameCompleteToClack(threadID: string, copyString: string) {
  const [id] = parseThreadID(threadID);
  await addContentToClack(id, [
    {
      type: MessageNodeType.PARAGRAPH,
      children: [
        { text: 'Game ' },
        { text: id, code: true },
        { text: ' complete.' },
      ],
    },
    {
      type: MessageNodeType.PARAGRAPH,
      children: [{ text: `${SERVER}/share/${id}` }],
    },
    { type: MessageNodeType.CODE, children: [{ text: copyString }] },
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
    addGameCompleteToClack(threadID, data?.copyString ?? ''),
  ]);

  return NextResponse.json(true);
}
