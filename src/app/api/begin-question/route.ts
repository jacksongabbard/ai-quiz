import { NextResponse } from 'next/server';
import { addBotMessageToThread } from '@/lib/openai';

export async function POST(req: Request) {
  const data = await req.json();
  console.log('begin-question', data);
  const threadID: string | undefined = data?.threadID;
  if (threadID === undefined) {
    throw new Error('Missing threadID');
  }

  void addBotMessageToThread(threadID);

  return NextResponse.json({});
}
