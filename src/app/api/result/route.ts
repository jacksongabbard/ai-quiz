import { addContentToClack } from '@/lib/clack';
import type { ClientAnswers } from '@/ui/Quiz';
import { MessageNodeType } from '@cord-sdk/types';
import { NextResponse } from 'next/server';

async function addGameCompleteToClack(
  threadID: string,
  answers: ClientAnswers,
  copyString: string,
) {
  const [sigil, id, _questionNumber] = threadID.split(':');
  if (sigil !== 't') {
    throw new Error('Invalid threadID');
  }

  await addContentToClack(id, [
    {
      type: MessageNodeType.PARAGRAPH,
      children: [{ text: `Game ${id} complete. Results:` }],
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

  void addGameCompleteToClack(
    threadID,
    data?.answers ?? [],
    data?.copyString ?? '',
  );

  return NextResponse.json(true);
}
