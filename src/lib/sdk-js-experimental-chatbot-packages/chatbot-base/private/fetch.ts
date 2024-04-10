import type { WebhookRequest } from '@cord-sdk/server';
import { fetchCordRESTApi, validateWebhookSignature } from '@cord-sdk/server';

type Creds = { id: string; secret: string };
let maybeCreds: Creds | undefined = undefined;

function getCreds(): Creds {
  if (maybeCreds) {
    return maybeCreds;
  }

  throw new Error('Must init() chat bots before calling any other function');
}

export function setCreds(creds: Creds): void {
  maybeCreds = creds;
}

export function validate(req: Request, data: WebhookRequest['body']): void {
  validateWebhookSignature(
    { header: (h) => req.headers.get(h) ?? '', body: data },
    getCreds().secret,
  );
}

export async function cordFetch<T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' = 'GET',
  body?: object,
): Promise<T> {
  const creds = getCreds();
  return await fetchCordRESTApi<T>(endpoint, {
    project_id: creds.id,
    project_secret: creds.secret,
    method,
    body,
  });
}
