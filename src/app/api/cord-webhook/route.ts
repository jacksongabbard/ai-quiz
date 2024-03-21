import { createHmac } from 'crypto';
import { CORD_API_SECRET } from '@/lib/env';
import { WebhookWrapperProperties } from '@cord-sdk/types';
import { NextResponse } from 'next/server';
import { addBotMessageToThread } from '@/lib/openai';
import { parseThreadID } from '@/lib/threadID';
import { assertGameNotLocked } from '@/lib/lock';

export const maxDuration = 180;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function verifySignature(req: Request) {
  const cordTimestamp = req.headers.get('x-cord-timestamp'); // XXX check if this is recent?
  const cordSignature = req.headers.get('x-cord-signature');
  // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
  const verifyStr = cordTimestamp + ':' + req.body;

  const hmac = createHmac('sha256', CORD_API_SECRET);
  hmac.update(verifyStr);
  const mySignature = hmac.digest('base64');

  if (cordSignature !== mySignature) {
    throw new Error('Invalid signature');
  }
}

export async function POST(req: Request) {
  // verifySignature(req); // XXX
  const data: WebhookWrapperProperties<'thread-message-added'> =
    await req.json();

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
