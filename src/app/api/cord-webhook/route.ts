import { NextResponse } from 'next/server';
import { getChatbotRegistry } from '@/lib/openai';

export const maxDuration = 180;

export async function POST(req: Request) {
  const registry = await getChatbotRegistry();
  const didHandle = await registry.webhookReceived(req);
  return didHandle ? NextResponse.json(true) : NextResponse.error();
}
