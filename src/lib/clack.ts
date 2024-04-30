import { fetchCordRESTApi } from '@/lib/fetchCordRESTApi';
import { getServerAuthToken } from '@cord-sdk/server';
import {
  CLACK_API_SECRET,
  CLACK_APPLICATION_ID,
  CLACK_CHANNEL,
} from '@/lib/env';
import type { MessageContent } from '@cord-sdk/types';

export async function addContentToClack(id: string, content: MessageContent) {
  if (!CLACK_APPLICATION_ID || !CLACK_API_SECRET || !CLACK_CHANNEL) {
    return;
  }

  const clackThreadID = `${CLACK_CHANNEL}-${id}`;

  await fetchCordRESTApi(
    `/v1/threads/${clackThreadID}/messages`,
    'POST',
    JSON.stringify({
      authorID: 'eventbot',
      skipLinkPreviews: true,
      content,
      createThread: {
        name: `AI Quiz Game ${id}`,
        url: `https://clack.cord.com/channel/${CLACK_CHANNEL}/thread/${clackThreadID}`,
        location: { channel: CLACK_CHANNEL },
        organizationID: 'clack_all',
      },
    }),
    getServerAuthToken(CLACK_APPLICATION_ID, CLACK_API_SECRET),
  );
}
