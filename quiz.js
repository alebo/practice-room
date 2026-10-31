export const isFRQ = question => question.type === 'frq';
export function shuffle(items, random = Math.random) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
export function isCorrect(question, selected) {
  return !isFRQ(question) && selected.length === question.correct.length && new Set(selected).size === selected.length && selected.every(id => question.correct.includes(id));
}
export function createAttempt(quiz, ids = quiz.questions.map(q => q.id), mode = 'all') {
  const questions = ids.map(id => quiz.questions.find(q => q.id === id));
  return { version: quiz.version, mode,
    order: [...shuffle(questions.filter(q => !isFRQ(q))), ...shuffle(questions.filter(isFRQ))].map(q => q.id),
    optionOrder: Object.fromEntries(quiz.questions.filter(q => !isFRQ(q)).map(q => [q.id, shuffle(q.options.map(o => o.id))])),
    answers: {}, index: 0, done: false };
}
export function validateQuiz(quiz) {
  const ids = new Set();
  if (!quiz.questions.length) throw new Error('Der Test enthält keine Fragen.');
  for (const q of quiz.questions) {
    if (!q.id || ids.has(q.id) || !q.prompt || (q.type && !['mcq','frq'].includes(q.type))) throw new Error('Ungültige Frage: ' + q.id);
    if (!isFRQ(q)) {
      const opts = new Set(q.options.map(o => o.id));
      if (opts.size !== q.options.length || !q.correct.length || new Set(q.correct).size !== q.correct.length || q.correct.some(id => !opts.has(id))) throw new Error('Ungültige Frage: ' + q.id);
    }
    ids.add(q.id);
  }
}
export function validAttempt(quiz, state, allowOriginal = true) {
  if (!state || state.version !== quiz.version || !['all','missed'].includes(state.mode) || !Array.isArray(state.order) || !state.order.length || new Set(state.order).size !== state.order.length || !Number.isInteger(state.index) || state.index < 0 || state.index >= state.order.length || typeof state.done !== 'boolean' || !state.answers || !state.optionOrder) return false;
  if (state.mode === 'all' && state.order.length !== quiz.questions.length) return false;
  if (state.original && (!allowOriginal || state.mode !== 'missed' || state.original.mode !== 'all' || !state.original.done || !validAttempt(quiz, state.original, false))) return false;
  if (state.mode === 'missed' && !state.original) return false;
  if (Object.keys(state.answers).some(id => !state.order.includes(id))) return false;
  let sawFRQ = false;
  return state.order.every((id, i) => {
    const q = quiz.questions.find(q => q.id === id);
    if (!q || (state.mode === 'missed' && isFRQ(q))) return false;
    if (isFRQ(q)) sawFRQ = true;
    else if (sawFRQ) return false;
    const a = state.answers[id];
    if (isFRQ(q)) {
      if (a && (typeof a.text !== 'string' || typeof a.checked !== 'boolean')) return false;
    } else {
      const order = state.optionOrder[id];
      if (!Array.isArray(order) || order.length !== q.options.length || new Set(order).size !== order.length || order.some(o => !q.options.some(x => x.id === o))) return false;
      if (a && (!Array.isArray(a.selected) || new Set(a.selected).size !== a.selected.length || a.selected.some(o => !order.includes(o)) || typeof a.checked !== 'boolean' || (q.correct.length === 1 && a.selected.length > 1))) return false;
    }
    if ((i < state.index || state.done) && !a?.checked) return false;
    if (i > state.index && a) return false;
    return true;
  });
}
export function mcqSummary(quiz, attempt) {
  const ids = attempt.order.filter(id => !isFRQ(quiz.questions.find(q => q.id === id)));
  const wrong = ids.filter(id => !isCorrect(quiz.questions.find(q => q.id === id), attempt.answers[id]?.selected || []));
  return { total: ids.length, correct: ids.length - wrong.length, wrong };
}
export function buildReport(quiz, attempt, url) {
  const full = attempt.original || attempt;
  const score = mcqSummary(quiz, full);
  const lines = [quiz.label, `Test: ${quiz.title}`, `Testversion: ${quiz.version}`, `Link: ${url}`, '', 'MCQ – ursprünglicher vollständiger Versuch', `Ergebnis: ${score.correct} von ${score.total} richtig${score.total ? ` (${Math.round(score.correct / score.total * 100)} %)` : ''}`, 'Ein Punkt pro vollständig richtiger Antwort. Wiederholungen sind nicht enthalten.', ''];
  for (const type of ['mcq','frq']) {
    lines.push(type === 'mcq' ? 'MULTIPLE-CHOICE-ANTWORTEN' : 'FREIE ANTWORTEN – nicht bewertet; externe Prüfung erforderlich', '');
    const ids = full.order.filter(id => isFRQ(quiz.questions.find(q => q.id === id)) === (type === 'frq'));
    if (!ids.length) lines.push('Keine Fragen dieses Typs.', '');
    ids.forEach((id, index) => {
      const q = quiz.questions.find(q => q.id === id), a = full.answers[id];
      lines.push(`${index + 1}. ${q.prompt}`);
      if (q.image) lines.push(`Bildbeschreibung: ${q.image.alt}`);
      if (q.mermaid) lines.push(`Diagrammbeschreibung: ${q.diagramDescription || 'Siehe Testlink.'}`);
      if (isFRQ(q)) lines.push('Antwort:', a?.text.trim() ? a.text : 'Nicht beantwortet');
      else {
        const labels = ids => ids.map(oid => q.options.find(o => o.id === oid).text).join('; ');
        lines.push(`Ergebnis: ${!a.selected.length ? 'Nicht beantwortet' : isCorrect(q, a.selected) ? 'Richtig' : 'Falsch'}`, `Gewählt: ${labels(a.selected)}`, `Richtig: ${labels(q.correct)}`);
      }
      lines.push('');
    });
  }
  return lines.join('\n').trimEnd();
}
