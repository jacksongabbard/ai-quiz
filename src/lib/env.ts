function env(k: string): string {
  const v = process.env[k];
  if (v !== undefined) {
    return v;
  }

  throw new Error('Missing key from .env: ' + k);
}

export const CORD_APPLICATION_ID = env('CORD_APPLICATION_ID');
export const CORD_API_SECRET = env('CORD_API_SECRET');

export const CLACK_APPLICATION_ID = env('CLACK_APPLICATION_ID');
export const CLACK_API_SECRET = env('CLACK_API_SECRET');

export const CORD_SERVER = env('CORD_SERVER');

export const OPENAI_API_SECRET = env('OPENAI_API_SECRET');
export const SERVER = env('SERVER');

export const IPSTACK_API_SECRET = env('IPSTACK_API_SECRET');
