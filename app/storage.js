import { createAttempt, validAttempt, validateQuiz } from './quiz.js';

// Keep the public quiz separate from the snapshot used by an existing attempt.
// Unknown or incompatible saved data must never be silently replaced.
export function restoreSavedAttempt(publishedQuiz, raw) {
  if (raw === null) return { mode: 'new', quiz: publishedQuiz, state: createAttempt(publishedQuiz) };
  try {
    const saved = JSON.parse(raw);
    if (saved?.storageVersion !== undefined && saved.storageVersion !== 1) return { mode: 'recovery', raw };
    const quiz = saved?.quizSnapshot || publishedQuiz;
    validateQuiz(quiz);
    if (quiz.id !== publishedQuiz.id || !validAttempt(quiz, saved)) return { mode: 'recovery', raw };
    const { quizSnapshot, storageVersion, ...state } = saved;
    return { mode: 'restored', quiz, state };
  } catch {
    return { mode: 'recovery', raw };
  }
}
export function serializeAttempt(quiz, state) {
  return JSON.stringify({ ...state, storageVersion: 1, quizSnapshot: quiz });
}
