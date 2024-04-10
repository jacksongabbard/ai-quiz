import { fetchCordRESTApi } from '@/lib/fetchCordRESTApi';
import { getServerAuthToken } from '@cord-sdk/server';
import { CLACK_API_SECRET, CLACK_APPLICATION_ID } from '@/lib/env';
import type { MessageContent } from '@cord-sdk/types';

export async function addContentToClack(id: string, content: MessageContent) {
  // CLACK LOGGING DISABLED TO NOT SPAM THE CHANNEL WITH STUFF WE DO NOT CARE
  // ABOUT.
  return;
  const channel = 'ai-quiz-game-events';
  const clackThreadID = `ai-quiz-game-${id}`;

  await fetchCordRESTApi(
    `/v1/threads/${clackThreadID}/messages`,
    'POST',
    JSON.stringify({
      authorID: 'eventbot',
      skipLinkPreviews: true,
      content,
      createThread: {
        name: `AI Quiz Game ${id}`,
        url: `https://clack.cord.com/channel/${channel}/thread/${clackThreadID}`,
        location: { channel },
        organizationID: 'clack_all',
      },
    }),
    getServerAuthToken(CLACK_APPLICATION_ID, CLACK_API_SECRET),
  );
}
