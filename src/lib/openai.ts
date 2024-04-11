import {
  CORD_API_SECRET,
  CORD_APPLICATION_ID,
  OPENAI_API_SECRET,
  SERVER,
} from '@/lib/env';
import {
  BaseQuizQuestion,
  questions as productionQuestions,
} from '@/lib/questions';
import { fetchCordRESTApi } from '@/lib/fetchCordRESTApi';
import { loadGameProgress } from './progress';
import {
  ChatBot,
  eventIsFromBot,
  chatbots,
  ChatBotRegistry,
} from './sdk-js-experimental-chatbot-packages/chatbot-base/bot';
import {
  messageToOpenaiMessage,
  openaiCompletion,
} from './sdk-js-experimental-chatbot-packages/chatbot-openai/openai';
import { parseThreadID } from './threadID';
import { assertGameNotLocked } from './lock';

export const BOT_ID = 'gpt4';

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

const bot: ChatBot = {
  cordUser: {
    name: 'GPT-4',
    profilePictureURL: SERVER + '/bot-black.svg',
  },
  async shouldRespondToEvent(event) {
    if (eventIsFromBot(event)) {
      return false;
    }

    const [id] = parseThreadID(event.event.threadID);
    await assertGameNotLocked(id);
    return true;
  },
  getResponse: openaiCompletion(OPENAI_API_SECRET, async (messages, thread) => {
    const [sigil, id, questionNumber] = thread.id.split(':');
    if (sigil !== 't' || questionNumber === undefined) {
      throw new Error('Invalid threadID');
    }

    const question = await getSavedQuestion(id, Number(questionNumber));
    return [
      {
        role: 'system',
        content: questionSystemPrompt(question),
      },
      { role: 'user', content: "I'm not sure, what do you think?" },
      ...messages.map(messageToOpenaiMessage),
    ];
  }),
  async onResponseSent(response, messages, thread) {
    const matches = response.plaintext.match(answerRegex) ?? [];
    if (matches.length < 1) {
      return;
    }

    const match = matches[matches.length - 1];
    const botAnswer = match.charCodeAt(match.length - 1) - asciiCapitalsOffset;

    console.log('updating bot answer for thread', thread.id, botAnswer);
    await fetchCordRESTApi(
      `/v1/threads/${thread.id}`,
      'PUT',
      JSON.stringify({ metadata: { botAnswer } }),
    );
  },
};

let registry: ChatBotRegistry | undefined = undefined;
export async function getChatbotRegistry(): Promise<ChatBotRegistry> {
  if (!registry) {
    registry = chatbots(CORD_APPLICATION_ID, CORD_API_SECRET);
    await registry.register(BOT_ID, bot);
  }

  return registry;
}
