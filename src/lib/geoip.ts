import { IPSTACK_API_SECRET } from '@/lib/env';

export async function ipToLocation(ip: string): Promise<object | string> {
  if (!process.env.IPSTACK_API_SECRET) {
    return ip;
  }

  const resp = await fetch(
    'https://api.ipstack.com/' + ip + '?access_key=' + IPSTACK_API_SECRET,
    {
      method: 'GET',
    },
  );
  const json = await resp.json();

  if (json && typeof json === 'object') {
    if (ip === '80.249.216.101') {
      json.city = 'Cord Office';
    }
    return json;
  }

  return ip;
}
