import { NextResponse } from 'next/server';
import { getBots } from '@/lib/openai';

export const maxDuration = 180;

export async function POST(req: Request) {
  const bots = await getBots();
  const didHandle = await bots.webhookReceived(req);
  return didHandle ? NextResponse.json(true) : NextResponse.error();
}
