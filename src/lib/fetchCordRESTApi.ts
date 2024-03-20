import { getServerAuthToken } from '@cord-sdk/server';
import { CORD_API_SECRET, CORD_APPLICATION_ID, CORD_SERVER } from './env';

export async function fetchCordRESTApi<T>(
  endpoint: string,
  method: 'GET' | 'PUT' | 'POST' | 'DELETE' = 'GET',
  body?: string,
): Promise<T> {
  const serverAuthToken = getServerAuthToken(CORD_APPLICATION_ID, CORD_API_SECRET);
  const response = await fetch(`${CORD_SERVER}${endpoint}`, {
    method,
    body,
    headers: {
      Authorization: `Bearer ${serverAuthToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (response.ok) {
    return response.json();
  } else {
    const responseText = await response.text();
    throw new Error(
      `Error making Cord API call: ${response.status} ${response.statusText} ${responseText}`,
    );
  }
}
