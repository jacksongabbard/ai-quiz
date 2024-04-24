import { ClientAnswers } from '@/ui/Quiz';
import { loadGameProgress, saveGameProgress } from './progress';

export async function lockGame(id: string, answers: ClientAnswers) {
  await saveGameProgress(id, answers, { locked: true });
}

export async function assertGameNotLocked(id: string) {
  const progress = await loadGameProgress(id);
  const locked = !!progress?.locked;
  if (locked) {
    throw new Error('Cannot keep playing locked game');
  }
}
