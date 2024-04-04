//import { CORD_API_SECRET } from '@/lib/env';
import { WebhookWrapperProperties } from '@cord-sdk/types';
//import { validateWebhookSignature } from '@cord-sdk/server';
import { NextResponse } from 'next/server';
import { addBotMessageToThread } from '@/lib/openai';
import { parseThreadID } from '@/lib/threadID';
import { assertGameNotLocked } from '@/lib/lock';

export const maxDuration = 180;

export async function POST(req: Request) {
  const data: WebhookWrapperProperties<'thread-message-added'> =
    await req.json();

  /*
  validateWebhookSignature(
    { header: (h) => req.headers.get(h) ?? '', body: data },
    CORD_API_SECRET,
  );
  */

  // For all types refer to https://docs.cord.com/reference/events-webhook
  let type = '';
  if ('type' in data && typeof data.type === 'string') {
    type = data.type;
  }
  console.log('webhook', type);

  if (!type) {
    return NextResponse.json(true);
  }

  if (type == 'url-verification') {
    return NextResponse.json(true);
  }

  if (type !== 'thread-message-added') {
    return NextResponse.json(true);
  }

  console.log(
    'webhook thread-message-added details',
    data.event.message.id,
    data.event.message.author.id,
  );
  if (data.event.message.author.id.startsWith('h:')) {
    const [id] = parseThreadID(data.event.threadID);
    await assertGameNotLocked(id);
    await addBotMessageToThread(data.event.threadID);
  }

  return NextResponse.json(true);
}
