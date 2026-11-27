export const isFRQ = question => question.type === 'frq';
export const isCloze = question => question.type === 'cloze';
const questionTypes = ['mcq', 'cloze', 'frq'];
const questionType = question => question.type || 'mcq';
export const clozeParts = question => question.sentence.split('{{blank}}');
const normalizeBlank = value => value.normalize('NFC').trim().replace(/\s+/g, ' ');
export const validClozeResponses = (question, responses) =>
  Array.isArray(responses) && responses.length === question.blanks.length &&
  responses.every(value => typeof value === 'string' && !/[\r\n]/.test(value));
export function blankResults(question, responses = []) {
  return question.blanks.map((accepted, index) => {
    const value = normalizeBlank(responses[index] ?? '');
    if (!value) return 'unanswered';
    return accepted.some(answer => normalizeBlank(answer) === value) ? 'correct' : 'incorrect';
  });
}
export const blankLabels = { correct: 'Richtig', incorrect: 'Falsch', unanswered: 'Nicht beantwortet' };
export const clozeReportHeading = 'LÜCKENTEXT-ANTWORTEN';
export const frqReportHeading = 'FREIE ANTWORTEN – nicht bewertet; externe Prüfung erforderlich';
export function clozeReportLines(question, responses) {
  return [
    question.sentence.replaceAll('{{blank}}', '___'),
    ...blankResults(question, responses).map((status, i) =>
      `Lücke ${i + 1}: ${JSON.stringify(responses[i])} · ${blankLabels[status]} · Lösungen: ${question.blanks[i].join(' / ')}`)
  ];
}
export function shuffle(items, random = Math.random) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
export function isCorrect(question, selected) {
  return questionType(question) === 'mcq' && selected.length === question.correct.length && new Set(selected).size === selected.length && selected.every(id => question.correct.includes(id));
}
export function createAttempt(quiz, ids = quiz.questions.map(q => q.id), mode = 'all') {
  const questions = ids.map(id => quiz.questions.find(q => q.id === id));
  return { version: quiz.version, mode,
    order: questionTypes.flatMap(type => shuffle(questions.filter(q => questionType(q) === type))).map(q => q.id),
    optionOrder: Object.fromEntries(quiz.questions.filter(q => questionType(q) === 'mcq').map(q => [q.id, shuffle(q.options.map(o => o.id))])),
    answers: {}, index: 0, done: false };
}
export function validateQuiz(quiz) {
  const ids = new Set();
  if (!quiz.questions.length) throw new Error('Der Test enthält keine Fragen.');
  for (const q of quiz.questions) {
    if (!q.id || ids.has(q.id) || !q.prompt || !questionTypes.includes(questionType(q))) throw new Error('Ungültige Frage: ' + q.id);
    if (isCloze(q)) {
      if (typeof q.sentence !== 'string' || !Array.isArray(q.blanks) || !q.blanks.length ||
          clozeParts(q).length !== q.blanks.length + 1 ||
          q.blanks.some(accepted => !Array.isArray(accepted) || !accepted.length ||
            accepted.some(value => typeof value !== 'string' || !normalizeBlank(value) || /[\r\n]/.test(value)))) {
        throw new Error('Ungültiger Lückentext: ' + q.id);
      }
    } else if (!isFRQ(q)) {
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
  const furthest = state.furthestIndex ?? state.index;
  if (!Number.isInteger(furthest) || furthest < state.index || furthest >= state.order.length) return false;
  let previousType = 0;
  return state.order.every((id, i) => {
    const q = quiz.questions.find(q => q.id === id);
    if (!q || (state.mode === 'missed' && isFRQ(q))) return false;
    const type = questionTypes.indexOf(questionType(q));
    if (type < previousType) return false;
    previousType = type;
    const a = state.answers[id];
    if (isFRQ(q)) {
      if (a && (typeof a.text !== 'string' || typeof a.checked !== 'boolean')) return false;
    } else if (isCloze(q)) {
      if (a && (!validClozeResponses(q, a.responses) || typeof a.checked !== 'boolean')) return false;
    } else {
      const order = state.optionOrder[id];
      if (!Array.isArray(order) || order.length !== q.options.length || new Set(order).size !== order.length || order.some(o => !q.options.some(x => x.id === o))) return false;
      if (a && (!Array.isArray(a.selected) || new Set(a.selected).size !== a.selected.length || a.selected.some(o => !order.includes(o)) || typeof a.checked !== 'boolean' || (q.correct.length === 1 && a.selected.length > 1))) return false;
    }
    if ((i < furthest || state.done) && !a?.checked) return false;
    if (i > furthest && a) return false;
    return true;
  });
}
export function mcqSummary(quiz, attempt) {
  const ids = attempt.order.filter(id => questionType(quiz.questions.find(q => q.id === id)) === 'mcq');
  const wrong = ids.filter(id => !isCorrect(quiz.questions.find(q => q.id === id), attempt.answers[id]?.selected || []));
  return { total: ids.length, correct: ids.length - wrong.length, wrong };
}
export function clozeSummary(quiz, attempt) {
  const questions = attempt.order.map(id => quiz.questions.find(q => q.id === id)).filter(isCloze);
  const results = questions.map(q => ({ id: q.id, blanks: blankResults(q, attempt.answers[q.id]?.responses) }));
  const blanks = results.flatMap(result => result.blanks);
  return {
    total: blanks.length,
    correct: blanks.filter(status => status === 'correct').length,
    wrong: results.filter(result => result.blanks.some(status => status !== 'correct')).map(result => result.id)
  };
}
export function buildReport(quiz, attempt, url) {
  const full = attempt.original || attempt;
  const score = mcqSummary(quiz, full);
  const lines = [quiz.label, `Test: ${quiz.title}`, `Testversion: ${quiz.version}`, `Link: ${url}`, '', 'MCQ – ursprünglicher vollständiger Versuch', `Ergebnis: ${score.correct} von ${score.total} richtig${score.total ? ` (${Math.round(score.correct / score.total * 100)} %)` : ''}`, 'Ein Punkt pro vollständig richtiger Antwort. Wiederholungen sind nicht enthalten.', ''];
  for (const type of questionTypes) {
    const ids = full.order.filter(id => questionType(quiz.questions.find(q => q.id === id)) === type);
    if (type === 'cloze' && !ids.length) continue;
    lines.push({ mcq: 'MULTIPLE-CHOICE-ANTWORTEN', cloze: clozeReportHeading, frq: frqReportHeading }[type], '');
    if (!ids.length) lines.push('Keine Fragen dieses Typs.', '');
    ids.forEach((id, index) => {
      const q = quiz.questions.find(q => q.id === id), a = full.answers[id];
      lines.push(`${index + 1}. ${q.prompt}`);
      if (q.image) lines.push(`Bildbeschreibung: ${q.image.alt}`);
      if (q.mermaid) lines.push(`Diagrammbeschreibung: ${q.diagramDescription || 'Siehe Testlink.'}`);
      if (isFRQ(q)) lines.push('Antwort:', a?.text.trim() ? a.text : 'Nicht beantwortet');
      else if (isCloze(q)) lines.push(...clozeReportLines(q, a.responses));
      else {
        const labels = ids => ids.map(oid => q.options.find(o => o.id === oid).text).join('; ');
        lines.push(`Ergebnis: ${!a.selected.length ? 'Nicht beantwortet' : isCorrect(q, a.selected) ? 'Richtig' : 'Falsch'}`, `Gewählt: ${labels(a.selected)}`, `Richtig: ${labels(q.correct)}`);
      }
      lines.push('');
    });
  }
  return lines.join('\n').trimEnd();
}
