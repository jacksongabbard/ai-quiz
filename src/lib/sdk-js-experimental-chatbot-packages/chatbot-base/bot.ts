import { cordFetch, setCreds, validate } from './private/fetch';
import { isAsyncIterable, stringToMessageContent } from './private/util';
import type {
  CoreMessageData,
  CoreThreadData,
  ServerUserData,
  WebhookWrapperProperties,
} from '@cord-sdk/types';

type MessageCreatedWebhookEvent =
  WebhookWrapperProperties<'thread-message-added'>;

export type ChatBot = {
  cordUser: Partial<Omit<ServerUserData, 'id' | 'createdTimestamp'>>;
  shouldRespondToEvent: (
    event: MessageCreatedWebhookEvent,
  ) => boolean | Promise<boolean>;
  getResponse: (
    messages: CoreMessageData[],
    thread: CoreThreadData,
  ) =>
    | string
    | null
    | undefined
    // TODO: support MessageContent.
    | Promise<string | null | undefined>
    | AsyncIterable<string | null | undefined>;
  onResponseSent?: (
    response: CoreMessageData,
    messages: CoreMessageData[],
    thread: CoreThreadData,
  ) => void | Promise<void>;
};

async function typing(threadID: string, userID: string, present: boolean) {
  return await cordFetch(`v1/threads/${threadID}`, 'PUT', {
    typing: present ? [userID] : [],
  });
}

const BOT_METADATA_KEY = '__chatBot';
export function eventIsFromBot(event: MessageCreatedWebhookEvent): boolean {
  return !!event.event.author.metadata[BOT_METADATA_KEY];
}
export function messageIsFromBot(message: CoreMessageData): boolean {
  return !!message.metadata[BOT_METADATA_KEY];
}

const bots: Map<string, ChatBot> = new Map();

export function init(project_id: string, project_secret: string) {
  setCreds({ id: project_id, secret: project_secret });
}

export async function register(botID: string, bot: ChatBot): Promise<void> {
  const cordUserWithMetadata: ChatBot['cordUser'] = {
    ...bot.cordUser,
    metadata: { [BOT_METADATA_KEY]: true, ...bot.cordUser.metadata },
  };
  await cordFetch<unknown>(`v1/users/${botID}`, 'PUT', cordUserWithMetadata);
  bots.set(botID, bot);
}

export async function forceRespond(
  botID: string,
  threadID: string,
): Promise<void> {
  // TODO: create thread if it doesn't already exist.
  const [thread, messages] = await Promise.all([
    cordFetch<CoreThreadData>(`v1/threads/${threadID}`),
    cordFetch<CoreMessageData[]>(
      `v1/threads/${threadID}/messages?sortDirection=ascending`,
    ),
  ]);

  await doRespond(botID, messages, thread);
}

export async function webhookReceived(req: Request): Promise<boolean> {
  const data: MessageCreatedWebhookEvent = await req.json();
  validate(req, data);

  let type = '';
  if ('type' in data && typeof data.type === 'string') {
    type = data.type;
  }

  if (!type) {
    return false;
  }

  if (type === 'url-verification') {
    return true;
  }

  if (type !== 'thread-message-added') {
    return false;
  }

  const respondingBotIDs: string[] = [];
  await Promise.all(
    [...bots.entries()].map(async ([botID, bot]) => {
      const shouldRespond = await bot.shouldRespondToEvent(data);
      if (shouldRespond) {
        respondingBotIDs.push(botID);
      }
    }),
  );

  if (respondingBotIDs.length > 0) {
    const thread: CoreThreadData = data.event.thread;
    const messages = await cordFetch<CoreMessageData[]>(
      `v1/threads/${thread.id}/messages?sortDirection=ascending`,
    );

    await Promise.all(
      respondingBotIDs.map(
        async (botID) => await doRespond(botID, messages, thread),
      ),
    );
  }

  return true;
}

async function doRespond(
  botID: string,
  messages: CoreMessageData[],
  thread: CoreThreadData,
) {
  await cordFetch(`v1/groups/${thread.groupID}/members`, 'POST', {
    add: [botID],
  });

  const bot = bots.get(botID);
  if (!bot) {
    throw new Error(`Invalid botID: ${botID}`);
  }

  let messageID: string;
  const response = await bot.getResponse(messages, thread);
  if (response === null || response === undefined) {
    return;
  } else if (typeof response === 'string') {
    ({ messageID } = await cordFetch<{ messageID: string }>(
      `v1/threads/${thread.id}/messages`,
      'POST',
      {
        authorID: botID,
        content: stringToMessageContent(response),
        metadata: { [BOT_METADATA_KEY]: true },
      },
    ));
  } else if (isAsyncIterable(response)) {
    [{ messageID }] = await Promise.all([
      cordFetch<{ messageID: string }>(
        `v1/threads/${thread.id}/messages`,
        'POST',
        {
          authorID: botID,
          content: [],
          metadata: { [BOT_METADATA_KEY]: true },
        },
      ),
      typing(thread.id, botID, true),
    ]);

    // TODO: is this the right way to do this? Is it too "eager", do we have any
    // backpressure issues?
    // TODO: should we provide a way to cancel an ongoing answer if someone else
    // adds a message to the thread, or some other cancellation mechanism?
    let full = '';
    for await (const chunk of response) {
      if (chunk !== null && chunk !== undefined) {
        full += chunk;
      }

      await Promise.all([
        typing(thread.id, botID, true),
        cordFetch(`v1/threads/${thread.id}/messages/${messageID}`, 'PUT', {
          content: stringToMessageContent(full),
          updatedTimestamp: null,
        }),
      ]);
    }

    await typing(thread.id, botID, false);
  } else {
    throw new Error('Unknown response type: ' + typeof response);
  }

  if (bot.onResponseSent) {
    const resopnseMessage = await cordFetch<CoreMessageData>(
      `v1/threads/${thread.id}/messages/${messageID}`,
    );
    await bot.onResponseSent(resopnseMessage, messages, thread);
  }
}
