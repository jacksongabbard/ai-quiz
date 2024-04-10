import { NextResponse } from 'next/server';
import { ensureDidInit } from '@/lib/openai';
import { webhookReceived } from '@/lib/sdk-js-experimental-chatbot-packages/chatbot-base/bot';

export const maxDuration = 180;

export async function POST(req: Request) {
  await ensureDidInit();
  const didHandle = await webhookReceived(req);
  return didHandle ? NextResponse.json(true) : NextResponse.error();
}
