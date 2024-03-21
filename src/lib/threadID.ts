export function parseThreadID(threadID: string): [string, string] {
  const [sigil, id, questionNumber] = threadID.split(':');
  if (sigil !== 't') {
    throw new Error('Invalid threadID');
  }

  return [id, questionNumber];
}
