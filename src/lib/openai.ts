import { OpenAI } from 'openai';
import { OPENAI_API_SECRET } from '@/lib/env';
import {
  BaseQuizQuestion,
  questions as productionQuestions,
} from '@/lib/questions';
import { fetchCordRESTApi } from '@/lib/fetchCordRESTApi';
import { uuid } from '@/lib/uuid';
import type { CoreMessageData, MessageContent } from '@cord-sdk/types';
import { MessageNodeType } from '@cord-sdk/types';
import { loadGameProgress } from './progress';

export const BOT_ID = 'gpt4';

const openai = new OpenAI({
  apiKey: OPENAI_API_SECRET,
});

const baseSystemPrompt = `
You are playing a quiz game with your friend. You should use all your knowledge and capabilities to help answer the question. You prefer to keep your messages to one to three short sentences and mildly funny.

Your goal is to find the correct answer to the question. Your friend will try to help you.
Some of the questions involve trivia and knowledge. Others involve wordplay and riddles.

Since you are only an LLM, you do not have full information about the world. If you are confident in your answer, you should hold your ground. If you're unsure, you should avoid suggesting wrong answers and instead offer observations. If you are not confident but your teammate is, you may allow yourself to be convinced as long as they use evidence or logic in order to convince you.
Similarly, you should also explain your reasoning. If you are confident about your answer, you should try to convince your friend.
Stay on topic. You can discuss the quiz question and information related to the answer, but do not go off topic. Redirect off topic discussion back to the quiz.
Do your best to try to answer the question. If you do not have an answer, offer useful observations or connections. You can also ask your friend for help, but you should do as much work as possible first.
Because you are an LLM, you may make mistakes that a human will be able to spot easily.

Important: When you have an answer, you must end your message with exactly the words "So I think the answer is" followed by the single letter indicating your answer. If you do not have a good answer, leave this out, and ask your friend for help.
`;

const answerRegex = /I think the answer is ./i;

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

async function getSavedQuestion(
  id: string,
  questionNumber: number,
): Promise<BaseQuizQuestion> {
  const progress = await loadGameProgress(id);
  if (progress) {
    const question = progress.questions[questionNumber];
    if (question) {
      return question;
    }
  }

  return productionQuestions[questionNumber];
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

  const [question, existingMessages] = await Promise.all([
    getSavedQuestion(id, Number(questionNumber)),
    getMessagesInThread(threadID),
  ]);

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
  });

  await fetchCordRESTApi(
    `/v1/threads/${threadID}/messages`,
    'POST',
    JSON.stringify({ id: messageID, authorID: BOT_ID, content: [] }),
  );

  await typing(threadID, BOT_ID, true);

  let full = '';
  for await (const chunk of stream) {
    const content = chunk.choices[0].delta.content;
    if (content !== undefined) {
      full += content;
    }

    await Promise.all([
      typing(threadID, BOT_ID, true),
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
    typing(threadID, BOT_ID, false),
  ]);
}
