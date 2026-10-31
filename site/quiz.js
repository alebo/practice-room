export function shuffle(items, random = Math.random) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
export function isCorrect(question, selected) {
  return selected.length === question.correct.length && new Set(selected).size === selected.length && selected.every(id => question.correct.includes(id));
}
export function createAttempt(quiz, ids = quiz.questions.map(q => q.id), mode = 'all') {
  return { version: quiz.version, mode, order: shuffle(ids), optionOrder: Object.fromEntries(quiz.questions.map(q => [q.id, shuffle(q.options.map(o => o.id))])), answers: {}, index: 0, done: false };
}
export function validateQuiz(quiz) {
  const ids = new Set();
  if (!quiz.questions.length) throw new Error('Der Test enthält keine Fragen.');
  for (const q of quiz.questions) {
    const opts = new Set(q.options.map(o => o.id));
    if (ids.has(q.id) || opts.size !== q.options.length || !q.correct.length || new Set(q.correct).size !== q.correct.length || q.correct.some(id => !opts.has(id))) throw new Error('Ungültige Frage: ' + q.id);
    ids.add(q.id);
  }
}
export function validAttempt(quiz, state) {
  if (!state || state.version !== quiz.version || !['all','missed'].includes(state.mode) || !Array.isArray(state.order) || !state.order.length || new Set(state.order).size !== state.order.length || !Number.isInteger(state.index) || state.index < 0 || state.index >= state.order.length || typeof state.done !== 'boolean' || !state.answers || !state.optionOrder) return false;
  if (state.mode === 'all' && state.order.length !== quiz.questions.length) return false;
  if (Object.keys(state.answers).some(id => !state.order.includes(id))) return false;
  return state.order.every((id, i) => {
    const q = quiz.questions.find(q => q.id === id);
    if (!q) return false;
    const order = state.optionOrder[id];
    if (!Array.isArray(order) || order.length !== q.options.length || new Set(order).size !== order.length || order.some(o => !q.options.some(x => x.id === o))) return false;
    const a = state.answers[id];
    if (a && (!Array.isArray(a.selected) || new Set(a.selected).size !== a.selected.length || a.selected.some(o => !order.includes(o)) || typeof a.checked !== 'boolean' || (q.correct.length === 1 && a.selected.length > 1) || (a.checked && !a.selected.length))) return false;
    if ((i < state.index || state.done) && !a?.checked) return false;
    if (i > state.index && a) return false;
    return true;
  });
}
