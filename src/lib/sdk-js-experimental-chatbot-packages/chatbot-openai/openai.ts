import { OpenAI } from 'openai';
import type { ChatBot } from '../chatbot-base/bot.ts';
import { messageIsFromBot } from '../chatbot-base/bot.ts';
import type { CoreMessageData } from '@cord-sdk/types';

export function messageToOpenaiMessage(
  m: CoreMessageData,
): OpenAI.ChatCompletionMessageParam {
  return {
    role: messageIsFromBot(m) ? 'assistant' : 'user',
    content: m.plaintext,
  };
}

export function openaiCompletion(
  apiKey: string,
  getOpenaiMessages: (
    ...p: Parameters<ChatBot['getResponse']>
  ) =>
    | OpenAI.ChatCompletionMessageParam[]
    | Promise<OpenAI.ChatCompletionMessageParam[]>,
): ChatBot['getResponse'] {
  const openai = new OpenAI({
    apiKey,
  });

  return async function* response(messages, thread) {
    const openaiMessages = await getOpenaiMessages(messages, thread);

    const stream = await openai.chat.completions.create({
      model: 'gpt-4-0613',
      messages: openaiMessages,
      stream: true,
    });

    // TODO: is this the right way to do this? Is it too "eager", do we have any
    // backpressure issues?
    for await (const chunk of stream) {
      yield chunk.choices[0].delta.content;
    }
  };
}

export function openaiSimpleAssistant(
  apiKey: string,
  systemPrompt: string,
): ChatBot['getResponse'] {
  return openaiCompletion(apiKey, (messages, _thread) => [
    { role: 'system', content: systemPrompt },
    ...messages.map(messageToOpenaiMessage),
  ]);
}
