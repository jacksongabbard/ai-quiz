import { getClientAuthToken } from '@cord-sdk/server';

import { BaseQuizQuestion, questions } from '@/lib/questions';
import { uuid } from '@/lib/uuid';
import { fetchCordRESTApi } from '@/lib/fetchCordRESTApi';
import { CORD_API_SECRET, CORD_APPLICATION_ID, SERVER } from '@/lib/env';
import { NextResponse } from 'next/server';
import type { ClientQuizQuestion } from '@/app/page';
import { ipToLocation } from '@/lib/geoip';
import { addContentToClack } from '@/lib/clack';
import { MessageNodeType, ServerUserData } from '@cord-sdk/types';
import * as jwt from 'jsonwebtoken';
import type { ClientAnswers } from '@/ui/Quiz';

async function logToClack(req: Request, id: string) {
  let ip: string = 'no-ip';
  if (req.headers.get('ip')) {
    ip = (req.headers.get('ip') || '').toString();
  } else if (req.headers.get('x-forwarded-for')) {
    ip = (req.headers.get('x-forwarded-for') || '').toString();
  }

  const geoIPInfo: string[] = [];
  if (ip !== 'no-ip' && ip !== '::1') {
    const geoipData = await ipToLocation(ip);
    if (geoipData !== ip && typeof geoipData === 'object') {
      geoIPInfo.push((geoipData as any).city || '');
      geoIPInfo.push((geoipData as any).region_name || '');
      geoIPInfo.push((geoipData as any).country_name || '');
    }
  } else if (ip === '::1') {
    geoIPInfo.push('::1');
  }

  const ua = req.headers.get('user-agent') || 'unknown device';

  await addContentToClack(id, [
    {
      type: MessageNodeType.PARAGRAPH,
      children: [
        {
          text: 'Init (' + geoIPInfo.join(', ') + ') | ',
        },
        {
          text: id,
          code: true,
        },
      ],
    },
    {
      type: MessageNodeType.PARAGRAPH,
      children: [
        {
          text: ua,
        },
      ],
    },
  ]);
}

export type QuizData = {
  cordAccessToken: string;
  questions: ClientQuizQuestion[];
};

export type InitResponse = {
  quizData: QuizData;
  resume?: ClientAnswers;
};

async function createNewQuizData(req: Request): Promise<InitResponse> {
  const id = uuid();

  const human = 'h:' + id;
  const bot = 'b:' + id;
  const group = 'g:' + id;
  const thread = async (n: number) => {
    const threadID = 't:' + id + ':' + String(n);

    await fetchCordRESTApi(
      '/v1/threads',
      'POST',
      JSON.stringify({
        id: threadID,
        name: 'Question ' + String(n),
        url: SERVER,
        groupID: group,
        location: { id, n },
      }),
    );

    return threadID;
  };

  await fetchCordRESTApi(
    '/v1/groups/' + group,
    'PUT',
    JSON.stringify({
      name: 'Quiz Group for ' + id,
    }),
  );

  const [_humans, _bots, questionsWithThreadID] = await Promise.all([
    fetchCordRESTApi(
      '/v1/users/' + human,
      'PUT',
      JSON.stringify({
        name: 'You',
        profilePictureURL: SERVER + '/avatar-black.svg',
        addGroups: [group],
      }),
    ),
    fetchCordRESTApi(
      '/v1/users/' + bot,
      'PUT',
      JSON.stringify({
        name: 'Geppetto',
        profilePictureURL: SERVER + '/bot-black.svg',
        addGroups: [group],
      }),
    ),
    // Work around Cord issue with serializable txns when concurrently creating
    // threads by doing them serially. Flooey is looking into it -- when fixed,
    // we can replace this loop with simply:
    // Promise.all(questions.map(async (q, n) => ({ ...q, cordThreadID: await thread(n) })))
    (async () => {
      const result = [];
      for (let n = 0; n < questions.length; n++) {
        result.push({ ...questions[n], cordThreadID: await thread(n) });
      }
      return result;
    })(),
  ]);

  try {
    await logToClack(req, id);
  } catch (e) {
    console.error('Error logging new quiz to Clack', e);
  }

  return {
    quizData: {
      cordAccessToken: getClientAuthToken(
        CORD_APPLICATION_ID,
        CORD_API_SECRET,
        {
          user_id: human,
        },
      ),
      questions: questionsWithThreadID,
    },
  };
}

async function resumeOldQuiz(req: Request): Promise<InitResponse | null> {
  const data = await req.json();
  const token = data?.token;
  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, CORD_API_SECRET, {
      ignoreExpiration: true,
    });
    const userID = (decoded as Record<string, string>).user_id;
    const [_sigil, id] = userID.split(':');

    const userData: ServerUserData = await fetchCordRESTApi(
      '/v1/users/' + 'b:' + id,
      'GET',
    );

    if (!userData.metadata.answers || !userData.metadata.questions) {
      return null;
    }

    const answers: ClientAnswers = JSON.parse(
      String(userData.metadata.answers),
    );
    const questions: BaseQuizQuestion[] = JSON.parse(
      String(userData.metadata.questions),
    );
    if (answers && questions) {
      return {
        quizData: {
          cordAccessToken: getClientAuthToken(
            CORD_APPLICATION_ID,
            CORD_API_SECRET,
            { user_id: userID },
          ),
          questions: questions.map((q, idx) => ({
            ...q,
            cordThreadID: 't:' + id + ':' + idx,
          })),
        },
        resume: answers,
      };
    }
  } catch (e) {
    console.error('Error resuming old quiz', e);
  }

  return null;
}

export async function POST(req: Request) {
  const old = await resumeOldQuiz(req);
  if (old) {
    return NextResponse.json(old);
  } else {
    return NextResponse.json(await createNewQuizData(req));
  }
}
