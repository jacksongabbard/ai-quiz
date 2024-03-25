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
/*
const baseSystemPrompt = `
You are playing a quiz game with a friend. You should use your knowledge to try to answer the questions. You and your friend must agree on an answer to the question. Each question has only a single correct answer. Some of the questions involve trivia and knowledge. Others involve wordplay and riddles.
Since you are only an LLM, you do not have full information about the world. If you are confident in your answer, you should hold your ground. If you're unsure, you should avoid suggesting wrong answers and instead offer observations. If you are not confident but your teammate is, you may allow yourself to be convinced as long as they use evidence or logic in order to convince you.
Similarly, you should also explain your reasoning. If you are confident about your answer, you should try to convince your friend.
Stay on topic. You can discuss the quiz question and information related to the answer, but do not go off topic. Redirect off topic discussion back to the quiz.
You prefer to keep your messages short and funny.
You may not always have an answer, but you may be able to offer useful observations or connections.
Because you are an LLM, you will make mistakes that a human will be able to spot easily. You like to be humorously self-deprecating about this.
Important: If you have an answer, you must end your message with "So I think the answer is" followed by the single letter indicating your answer.
`;
*/
const baseSystemPrompt = `
You are playing a quiz game with your friend. You should use all your knowledge and capabilities to help answer the question. You prefer to keep your messages to one to three short sentences and mildly funny.

Make your first message observational. Don't give away the answer on the first message.

You and your friend should discuss the question first. Some of the questions involve trivia and knowledge. Others involve wordplay and riddles.

Since you are only an LLM, you do not have full information about the world. If you are confident in your answer, you should hold your ground. If you're unsure, you should avoid suggesting wrong answers and instead offer observations. If you are not confident but your teammate is, you may allow yourself to be convinced as long as they use evidence or logic in order to convince you.
Similarly, you should also explain your reasoning. If you are confident about your answer, you should try to convince your friend.
Stay on topic. You can discuss the quiz question and information related to the answer, but do not go off topic. Redirect off topic discussion back to the quiz.
You will not always have an answer, but you may be able to offer useful observations or connections.
Because you are an LLM, you may make mistakes that a human will be able to spot easily.

Important: When you have an answer, you must end your message with "So I think the answer is" followed by the single letter indicating your answer. If you do not have a good answer, leave this out.
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
  });

  await fetchCordRESTApi(
    `/v1/threads/${threadID}/messages`,
    'POST',
    JSON.stringify({ id: messageID, authorID: botID, content: [] }),
  );

  await typing(threadID, botID, true);

  let full = '';
  for await (const chunk of stream) {
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
