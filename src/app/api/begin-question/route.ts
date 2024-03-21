import { NextResponse } from 'next/server';
import { addBotMessageToThread } from '@/lib/openai';
import { MessageNodeType } from '@cord-sdk/types';
import type { ClientAnswers } from '@/ui/Quiz';
import { addContentToClack } from '@/lib/clack';

async function addGameProgressToClack(
  threadID: string,
  answers: ClientAnswers,
) {
  const [sigil, id, questionNumber] = threadID.split(':');
  if (sigil !== 't' || questionNumber === undefined) {
    throw new Error('Invalid threadID');
  }

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
          text: ` to question ${Number(questionNumber) + 1}. Current answer set:`,
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

  void addBotMessageToThread(threadID);
  void addGameProgressToClack(threadID, data?.answers ?? []);

  return NextResponse.json(true);
}
