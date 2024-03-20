import { OpenAI } from 'openai';
import { OPENAI_API_SECRET } from '@/lib/env';
import { BaseQuizQuestion, questions } from '@/lib/questions';
import { fetchCordRESTApi } from '@/lib/fetchCordRESTApi';
import { uuid } from '@/lib/uuid';
import {
  CoreMessageData,
  MessageContent,
  MessageNodeType,
} from '@cord-sdk/types';

const openai = new OpenAI({
  apiKey: OPENAI_API_SECRET,
});

const baseSystemPrompt = `
You are playing a quiz game with a friend. You should use your knowledge to try to answer the questions. You and your friend must agree on an answer to the question. Each question has only a single correct answer. Some of the questions involve trivia and knowledge. Others involve wordplay and riddles.
Since you are only an LLM, you do not have full information about the world. If you are confident in your answer, you should hold your ground. If you are not, you should allow yourself to be convinced by your friend. Your friend needs to use evidence or logic in order to convince you.
Similarly, you should also explain your reasoning. If you are confident about your answer, you should try to convince your friend.
You should end your message with "So I think the answer is" followed by the single letter indicating your answer.
`;

const answerRegex = /So,? I think the answer is ./;

const asciiCapitalsOffset = 'A'.charCodeAt(0);

function questionSystemPrompt(q: BaseQuizQuestion): string {
  let prompt =
    baseSystemPrompt +
    '\nThe question is:\n' +
    q.question +
    '\nThe possible answers are:\n';

  q.answers.forEach(
    (a, i) =>
      (prompt += `${String.fromCharCode(asciiCapitalsOffset + i)}. ${a}\n`),
  );

  return prompt;
}

async function typing(threadID: string, userID: string, present: boolean) {
  return await fetchCordRESTApi(
    `/v1/threads/${threadID}`,
    'PUT',
    JSON.stringify({ typing: present ? [userID] : [] }),
  );
}

function stringToMessageContent(s: string): MessageContent {
  return s.split('\n').map((ss) => ({
    type: MessageNodeType.PARAGRAPH,
    children: [{ text: ss }],
  }));
}

async function getMessagesInThread(
  threadID: string,
): Promise<OpenAI.ChatCompletionMessageParam[]> {
  const messages: CoreMessageData[] = await fetchCordRESTApi(
    `/v1/threads/${threadID}/messages?sortDirection=ascending`,
  );

  return messages.map((m) => ({
    role: m.authorID.startsWith('h:') ? 'user' : 'assistant',
    content: m.plaintext,
  }));
}

async function maybeUpdateBotAnswer(threadID: string, full: string) {
  const matches = full.match(answerRegex) ?? [];
  if (matches.length < 1) {
    return;
  }

  const match = matches[matches.length - 1];
  const botAnswer = match.charCodeAt(match.length - 1) - asciiCapitalsOffset;

  console.log('updating bot answer for thread', threadID, botAnswer);
  await fetchCordRESTApi(
    `/v1/threads/${threadID}`,
    'PUT',
    JSON.stringify({ metadata: { botAnswer } }),
  );
}

export async function addBotMessageToThread(threadID: string) {
  const [sigil, id, questionNumber] = threadID.split(':');
  if (sigil !== 't' || questionNumber === undefined) {
    throw new Error('Invalid threadID');
  }

  const question = questions[Number(questionNumber)];
  const existingMessages = await getMessagesInThread(threadID);

  const botID = 'b:' + id;
  const messageID = uuid();

  const openaiMessages: OpenAI.ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content: questionSystemPrompt(question),
    },
    { role: 'user', content: "I'm not sure, what do you think?" },
    ...existingMessages,
  ];

  console.log(
    'calling openai to add a message to thread',
    threadID,
    existingMessages.length,
    messageID,
  );
  const stream = await openai.chat.completions.create({
    model: 'gpt-4-0613',
    messages: openaiMessages,
    stream: true,
    max_tokens: 200,
  });

  await fetchCordRESTApi(
    `/v1/threads/${threadID}/messages`,
    'POST',
    JSON.stringify({ id: messageID, authorID: botID, content: [] }),
  );

  await typing(threadID, botID, true);

  let full = '';
  for await (let chunk of stream) {
    const content = chunk.choices[0].delta.content;
    if (content !== undefined) {
      full += content;
    }

    await Promise.all([
      typing(threadID, botID, true),
      fetchCordRESTApi(
        `/v1/threads/${threadID}/messages/${messageID}`,
        'PUT',
        JSON.stringify({
          content: stringToMessageContent(full),
          updatedTimestamp: null,
        }),
      ),
    ]);
  }

  await Promise.all([
    maybeUpdateBotAnswer(threadID, full),
    typing(threadID, botID, false),
  ]);
}
