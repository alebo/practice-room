const { quiz: publishedQuiz } = await import(new URL('./questions.js', document.baseURI).href);
let quiz = publishedQuiz;
import { restoreSavedAttempt, serializeAttempt } from './storage.js';
import { createShare } from './privatebin.js';
import { createAttempt, isCorrect, validateQuiz, isFRQ, mcqSummary, buildReport } from './quiz.js';
const app = document.querySelector('#app');
const key = `lernraum:${quiz.id}`;
const esc = text => String(text).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let state;
let reportView = false;
let shareInProgress = false;
let storageAvailable = true;
let storageReadable = true;
let recoveryRaw = null;
let mermaidPromise;
let renderNumber = 0;
try {
  validateQuiz(quiz);
  let raw = null;
  try { raw = localStorage.getItem(key); }
  catch { storageAvailable = false; storageReadable = false; }
  const restored = restoreSavedAttempt(publishedQuiz, raw);
  if (restored.mode === 'recovery') {
    recoveryRaw = restored.raw;
    renderRecovery();
  } else {
    quiz = restored.quiz;
    state = restored.state;
    save();
    render();
  }
} catch (error) {
  app.innerHTML = '<h1>Die Übung konnte nicht geladen werden.</h1><p>Bitte versuche es später erneut.</p>';
  console.error(error);
}
function save() {
  try {
    if (!storageReadable || recoveryRaw !== null) throw new Error('Saved data is protected.');
    localStorage.setItem(key, serializeAttempt(quiz, state)); storageAvailable = true;
  }
  catch { storageAvailable = false; }
  storageNote();
}
function storageNote() {
  document.querySelector('#storage-note').textContent = storageAvailable ? 'Deine Antworten bleiben gespeichert, bis du diesen Test neu startest.' : 'Speichern ist nicht verfügbar. Dieser Versuch bleibt nur bis zum Neuladen erhalten.';
}
function question(id) { return quiz.questions.find(q => q.id === id); }
function missed() { return mcqSummary(quiz, state).wrong; }
function fullAttempt() { return state.original || state; }
function reportText() { return buildReport(quiz, fullAttempt(), new URL(publishedQuiz.canonicalPath || './', location.href).href); }
function intro() {
  return `<section class="intro"><div class="eyebrow"><span class="dot"></span>${esc(quiz.label)}</div><h1>${esc(quiz.title)}</h1><p>${esc(quiz.subtitle)}</p><div class="sample-note"><span aria-hidden="true">✧</span> ${quiz.questions.length} Fragen · ohne Zeitdruck</div></section>`;
}
function render(focus = false) {
  renderNumber++;
  app.innerHTML = intro() + (quiz.version !== publishedQuiz.version ? `<aside class="retry-result"><p>Dein gespeicherter Versuch (Version ${esc(quiz.version)}) bleibt erhalten. Eine neue Testversion ist verfügbar. Du kannst deinen bisherigen Bericht weiterhin kopieren. Erst „Neu starten“ ersetzt deine Antworten.</p></aside>` : '') + (state.done || reportView ? results() : exercise());
  storageNote();
  if (!state.done && !reportView) bindExercise();
  else bindResults();
  const restart = document.querySelector('#restart');
  if (restart) restart.onclick = requestRestart;
  const showReport = document.querySelector('#show-report');
  if (showReport) showReport.onclick = () => { reportView = true; render(true); };
  if (focus) document.querySelector('#view-title').focus();
  renderDiagrams(renderNumber);
}
function media(q) {
  let html = '';
  if (q.image) html += `<figure><img src="${esc(q.image.src)}" alt="${esc(q.image.alt)}"></figure>`;
  if (q.mermaid) html += `<figure class="diagram" data-question="${esc(q.id)}"><div class="diagram-canvas" aria-hidden="true"></div><figcaption>${esc(q.diagramDescription || 'Diagramm zur Frage')}</figcaption></figure>`;
  return html;
}
async function renderDiagrams(generation) {
  const figures = [...document.querySelectorAll('.diagram')];
  if (!figures.length) return;
  try {
    mermaidPromise ||= import('./vendor/mermaid/mermaid.esm.min.mjs').then(({default: m}) => { m.initialize({ startOnLoad: false, securityLevel: 'strict', theme: 'base', themeVariables: { primaryColor: '#e9efdf', primaryTextColor: '#253e33', primaryBorderColor: '#92a886', lineColor: '#63836c', fontFamily: 'system-ui', fontSize: '16px' } }); return m; });
    const m = await mermaidPromise;
    for (const [index, figure] of figures.entries()) {
      if (generation !== renderNumber) return;
      const { svg } = await m.render(`diagram-${generation}-${index}`, question(figure.dataset.question).mermaid);
      if (figure.isConnected) {
        const canvas = figure.querySelector('.diagram-canvas');
        canvas.innerHTML = svg;
        const rendered = canvas.querySelector('svg');
        rendered.style.width = `${rendered.viewBox.baseVal.width}px`;
        rendered.style.maxWidth = 'none';
        canvas.tabIndex = 0;
        canvas.setAttribute('role', 'region');
        canvas.setAttribute('aria-label', 'Diagramm, bei Bedarf seitlich scrollen');
        canvas.removeAttribute('aria-hidden');
      }
    }
  } catch {
    for (const figure of figures) {
      const note = document.createElement('p'); note.textContent = 'Das Diagramm konnte nicht geladen werden. Die Beschreibung steht darunter.';
      figure.querySelector('.diagram-canvas').replaceChildren(note);
    }
  }
}
function exercise() {
  const q = question(state.order[state.index]);
  if (isFRQ(q)) return freeResponse(q);
  const answer = state.answers[q.id] || { selected: [], checked: false };
  const multiple = q.correct.length > 1;
  const completed = state.order.filter(id => state.answers[id]?.checked).length;
  return `<section class="workspace"><div class="progress-row"><span>${state.mode === 'missed' ? 'MCQ-Wiederholung' : 'Teil 1 · Multiple Choice'}</span><strong>${completed} / ${state.order.length} abgeschlossen</strong></div><progress value="${completed}" max="${state.order.length}" aria-label="Abgeschlossene Fragen"></progress><article class="question-card"><div class="question-meta"><span>FRAGE ${String(state.index + 1).padStart(2,'0')} <span class="muted">/ ${String(state.order.length).padStart(2,'0')}</span></span><span class="topic">MCQ · ${esc(q.topic || 'Übung')}</span></div><form id="answer-form"><fieldset ${answer.checked ? 'disabled' : ''}><legend id="view-title" tabindex="-1" lang="${esc(q.language || quiz.language)}">${esc(q.prompt)}</legend><p class="selection-hint" id="selection-hint">${multiple ? 'Mehrere Antworten sind richtig. Wähle alle passenden aus.' : 'Genau eine Antwort ist richtig.'}</p>${media(q)}<div class="options" lang="${esc(q.language || quiz.language)}">${state.optionOrder[q.id].map((id, i) => {
    const option = q.options.find(o => o.id === id);
    const selected = answer.selected.includes(id);
    const correct = q.correct.includes(id);
    const status = answer.checked ? correct ? 'correct' : selected ? 'incorrect' : '' : '';
    return `<label class="option ${status}"><input type="${multiple ? 'checkbox' : 'radio'}" name="answer" value="${esc(id)}" ${selected ? 'checked' : ''} aria-describedby="selection-hint"><span class="option-letter" aria-hidden="true">${String.fromCharCode(65+i)}</span><span class="option-text">${esc(option.text)}</span>${answer.checked && (correct || selected) ? `<span class="answer-tag">${correct ? '✓ Richtig' : '× Falsch'}</span>` : ''}</label>`;
  }).join('')}</div></fieldset><div id="feedback" aria-live="polite">${answer.checked ? feedback(q, answer) : ''}</div><div class="card-bottom"><span class="bottom-hint">${answer.checked ? 'Ein Schritt weiter.' : 'Nimm dir die Zeit, die du brauchst.'}</span>${answer.checked ? `<button class="primary" id="next" type="button">${state.index === state.order.length - 1 ? 'Ergebnis ansehen' : 'Nächste Frage'} <span aria-hidden="true">→</span></button>` : `<button class="secondary" id="skip" type="button">Weiß ich nicht</button><button class="primary" id="check" type="submit" ${answer.selected.length ? '' : 'disabled'}>Antwort prüfen <span aria-hidden="true">→</span></button>`}</div></form></article><div class="under-card"><span><span aria-hidden="true">✓</span> Lernen ohne Druck. Fehler gehören dazu.</span>${state.original ? '<button class="text-button" id="show-report">Gesamtbericht ansehen</button>' : ''}<button class="text-button" id="restart">Neu starten</button></div></section>`;
}
function feedback(q, answer) {
  const correct = isCorrect(q, answer.selected);
  return `<section class="feedback ${correct ? 'positive' : 'negative'}" tabindex="-1"><strong>${correct ? 'Richtig! Gut gemacht.' : !answer.selected.length ? 'Nicht beantwortet.' : 'Noch nicht ganz richtig.'}</strong>${!correct ? '<p>Die richtigen Antworten sind oben grün markiert.</p>' : ''}${q.explanation ? `<p lang="${esc(q.language || quiz.language)}">${esc(q.explanation)}</p>` : ''}</section>`;
}
function freeResponse(q) {
  const text = state.answers[q.id]?.text || '';
  const completed = state.order.filter(id => state.answers[id]?.checked).length;
  return `<section class="workspace"><div class="progress-row"><span>Teil 2 · Freie Antworten</span><strong>${completed} / ${state.order.length} abgeschlossen</strong></div><progress value="${completed}" max="${state.order.length}" aria-label="Abgeschlossene Fragen"></progress><article class="question-card"><div class="question-meta"><span>FRAGE ${state.index + 1} / ${state.order.length}</span><span class="topic">Freie Antwort · ${esc(q.topic || 'Übung')}</span></div><form id="answer-form"><h2 id="view-title" tabindex="-1" lang="${esc(q.language || quiz.language)}">${esc(q.prompt)}</h2><p id="frq-hint" class="selection-hint">Diese Antwort wird extern geprüft. Du kannst sie leer lassen und am Ende bearbeiten.</p>${media(q)}<label class="response-label" for="free-answer">Deine Antwort</label><textarea id="free-answer" rows="7" aria-describedby="frq-hint" lang="${esc(q.language || quiz.language)}" placeholder="Schreibe deine Gedanken hier auf …">${esc(text)}</textarea><div class="card-bottom"><span class="bottom-hint">${storageAvailable ? 'Entwurf wird automatisch gespeichert.' : 'Speichern im Browser ist nicht verfügbar.'}</span><button class="primary" type="submit">${state.index === state.order.length - 1 ? 'Ergebnis ansehen' : 'Weiter'} <span aria-hidden="true">→</span></button></div></form></article><div class="under-card"><span>Keine automatische Bewertung.</span><button class="text-button" id="restart">Neu starten</button></div></section>`;
}
function advance() {
  if (state.index === state.order.length - 1) state.done = true;
  else state.index++;
  save(); render(true);
}
function bindExercise() {
  const q = question(state.order[state.index]);
  const form = document.querySelector('#answer-form');
  if (isFRQ(q)) {
    const textarea = document.querySelector('#free-answer');
    textarea.oninput = () => { state.answers[q.id] = { text: textarea.value, checked: false }; save(); };
    form.onsubmit = event => {
      event.preventDefault();
      state.answers[q.id] = { text: textarea.value, checked: true };
      advance();
    };
    return;
  }
  form.onchange = () => {
    const selected = [...form.querySelectorAll('input:checked')].map(input => input.value);
    state.answers[q.id] = { selected, checked: false };
    save(); document.querySelector('#check').disabled = !selected.length;
  };
  form.onsubmit = event => {
    event.preventDefault();
    const answer = state.answers[q.id];
    if (!answer?.selected.length || answer.checked) return;
    answer.checked = true; save(); render(); document.querySelector('.feedback').focus();
  };
  const skip = document.querySelector('#skip');
  if (skip) skip.onclick = () => {
    state.answers[q.id] = { selected: [], checked: true };
    save(); render(); document.querySelector('.feedback').focus();
  };
  const next = document.querySelector('#next');
  if (next) next.onclick = advance;
}
function reviewQuestion(id, index, attempt) {
  const q = question(id), a = attempt.answers[id];
  if (isFRQ(q)) {
    return `<details class="frq-review" open><summary><span class="review-status pending" aria-label="Nicht bewertet">—</span><span lang="${esc(q.language || quiz.language)}">${index + 1}. ${esc(q.prompt)}</span><span aria-hidden="true">+</span></summary><div class="review-body">${media(q)}<p class="muted">Nicht bewertet · Prüfung durch eine andere Person</p><label class="response-label" for="edit-${esc(id)}">Deine Antwort bearbeiten</label><textarea id="edit-${esc(id)}" data-frq="${esc(id)}" rows="5" lang="${esc(q.language || quiz.language)}">${esc(a.text)}</textarea><p class="response-status" data-status="${esc(id)}">${a.text.trim() ? 'Antwort im Bericht enthalten.' : 'Nicht beantwortet'}</p></div></details>`;
  }
  const correct = isCorrect(q, a.selected);
  return `<details><summary><span class="review-status ${correct ? 'success' : 'failure'}" aria-label="${!a.selected.length ? 'Nicht beantwortet' : correct ? 'Richtig' : 'Falsch'}">${correct ? '✓' : '×'}</span><span lang="${esc(q.language || quiz.language)}">${index+1}. ${esc(q.prompt)}</span><span aria-hidden="true">+</span></summary><div class="review-body" lang="${esc(q.language || quiz.language)}">${media(q)}${!a.selected.length ? '<p>Nicht beantwortet</p>' : ''}<ul>${attempt.optionOrder[id].map(oid => { const o=q.options.find(o=>o.id===oid); return `<li class="${q.correct.includes(oid) ? 'review-correct' : ''}">${esc(o.text)} <small>${a.selected.includes(oid) ? '· Deine Auswahl ' : ''}${q.correct.includes(oid) ? '· Richtig' : ''}</small></li>`; }).join('')}</ul>${q.explanation ? `<p>${esc(q.explanation)}</p>` : ''}</div></details>`;
}
function results() {
  const full = fullAttempt();
  const score = mcqSummary(quiz, full);
  const frqs = full.order.filter(id => isFRQ(question(id)));
  const retryScore = state.original && state.done ? mcqSummary(quiz, state) : null;
  const wrong = state.done ? missed() : [];
  return `<section class="workspace"><article class="result-card"><div class="eyebrow">Gesamtbericht · ursprünglicher Versuch</div><h2 id="view-title" tabindex="-1">Deine Ergebnisse auf einen Blick.</h2>${score.total ? `<div class="score">${score.correct}<span> / ${score.total}</span></div><p>MCQ richtig beantwortet · ${Math.round(score.correct/score.total*100)} %</p>` : '<p>Dieser Test enthält keine MCQs.</p>'}${frqs.length ? `<p class="muted">${frqs.length} freie Antworten · nicht bewertet</p>` : ''}<p class="muted">Ein Punkt pro vollständig richtiger MCQ-Antwort.</p><div class="actions"><button class="primary" id="copy-report">Ergebnis kopieren</button>${wrong.length ? `<button class="secondary" id="retry-missed">${wrong.length} Fehler wiederholen <span aria-hidden="true">→</span></button>` : ''}${!state.done ? '<button class="secondary" id="continue-retry">Wiederholung fortsetzen</button>' : ''}<button class="secondary" id="retry-all">Gesamten Test neu starten</button></div><p id="copy-status" role="status" aria-live="polite"></p></article>${retryScore ? `<aside class="retry-result"><h2>MCQ-Wiederholung</h2><p><strong>${retryScore.correct} / ${retryScore.total}</strong> richtig. Dieser Übungsversuch verändert den Gesamtbericht nicht.</p></aside>` : ''}${sharePanel()}<section class="report-panel"><h2>Bericht zum Weitergeben</h2><p class="muted">${frqs.length ? 'Freie Antworten kannst du unten bearbeiten. Der Bericht wird sofort aktualisiert. ' : ''}Kopiere den Bericht und sende ihn zur Prüfung.</p><details><summary>Bericht als Text ansehen / manuell kopieren</summary><label class="response-label" for="report-text">Vollständiger Bericht</label><textarea id="report-text" rows="14" readonly>${esc(reportText())}</textarea><button class="text-button" id="select-report">Gesamten Text markieren</button></details></section><section class="review"><h2>Deine Antworten im Überblick</h2><p class="muted">MCQ-Ergebnisse stammen aus dem ursprünglichen Versuch.${frqs.length ? ' Freie Antworten bleiben bearbeitbar.' : ''}</p>${full.order.map((id, i) => reviewQuestion(id, i, full)).join('')}</section></section>`;
}
function sharePanel() {
  const share = fullAttempt().share;
  const expired = share && Date.now() >= share.expiresAt;
  const usable = share && !share.stale && !expired;
  return `<section class="report-panel" id="share-panel"><h2>Ergebnis als Link teilen</h2><p class="muted">Dein Bericht wird vor dem Hochladen verschlüsselt und auf privatebin.net für drei Tage gespeichert. Wer den vollständigen Link hat, kann ihn lesen. Deine Antworten bleiben in diesem Browser erhalten.</p>${share ? `<label class="response-label" for="share-url">${usable ? 'Link für die prüfende Person' : 'Bisheriger Link'}</label><input class="share-url" id="share-url" type="text" readonly value="${esc(share.url)}"><p class="response-status">${share.stale ? 'Deine Antworten wurden geändert. Erstelle einen neuen Link für den aktuellen Bericht.' : expired ? 'Dieser Link ist abgelaufen. Du kannst einen neuen erstellen.' : `Gültig bis ${esc(new Date(share.expiresAt).toLocaleString('de-DE'))}.`}</p>` : ''}<div class="actions"><button class="primary" id="create-share" ${shareInProgress ? 'disabled' : ''}>${usable ? 'Link anzeigen' : share ? 'Neuen Link erstellen' : 'Link erstellen'}</button>${usable ? '<button class="secondary" id="copy-share">Link kopieren</button>' : ''}</div><p id="share-status" role="status" aria-live="polite"></p></section>`;
}
function bindSharing() {
  const create = document.querySelector('#create-share');
  const select = () => { const input = document.querySelector('#share-url'); input?.focus(); input?.select(); };
  const copy = document.querySelector('#copy-share');
  if (copy) copy.onclick = async () => {
    try {
      await navigator.clipboard.writeText(fullAttempt().share.url);
      document.querySelector('#share-status').textContent = 'Link kopiert. Sende ihn innerhalb von drei Tagen an die prüfende Person.';
    } catch {
      select();
      document.querySelector('#share-status').textContent = 'Link markiert. Kopiere ihn mit Strg+C, ⌘C oder dem Kopiermenü.';
    }
  };
  create.onclick = async () => {
    const original = fullAttempt();
    if (original.share && !original.share.stale && Date.now() < original.share.expiresAt) { select(); return; }
    const report = reportText();
    shareInProgress = true;
    create.disabled = true;
    document.querySelector('#share-status').textContent = 'Bericht wird verschlüsselt und hochgeladen …';
    try {
      const shared = await createShare(report);
      // A reset or navigation during upload must not resurrect the old attempt.
      if (fullAttempt() !== original) return;
      original.share = {...shared,stale:report !== reportText()};
      save();
      if (state.done || reportView) {
        render();
        document.querySelector('#share-status').textContent = original.share.stale ? 'Link erstellt. Deine Antworten haben sich inzwischen geändert; erstelle einen neuen Link für den aktuellen Stand.' : 'Link erstellt. Kopiere ihn und sende ihn an die prüfende Person.';
        select();
      }
    } catch (error) {
      if (fullAttempt() === original && document.querySelector('#share-status')) document.querySelector('#share-status').textContent = error.name === 'RateLimitError' ? 'PrivateBin erlaubt momentan nur einen Upload pro Minute. Warte eine Minute und versuche es erneut. Deine Antworten bleiben gespeichert.' : 'Der Link konnte nicht erstellt werden. Deine Antworten bleiben gespeichert. Versuche es später erneut oder kopiere den Bericht als Text.';
    } finally {
      shareInProgress = false;
      const currentButton = document.querySelector('#create-share');
      if (currentButton) currentButton.disabled = false;
    }
  };
}
function bindResults() {
  bindSharing();
  document.querySelector('#retry-all').onclick = requestRestart;
  const retry = document.querySelector('#retry-missed');
  if (retry) retry.onclick = () => {
    const original = fullAttempt();
    state = { ...createAttempt(quiz, missed(), 'missed'), original };
    reportView = false; save(); render(true);
  };
  const resume = document.querySelector('#continue-retry');
  if (resume) resume.onclick = () => { reportView = false; render(true); };
  for (const editor of document.querySelectorAll('[data-frq]')) editor.oninput = () => {
    fullAttempt().answers[editor.dataset.frq].text = editor.value;
    if (fullAttempt().share) {
      fullAttempt().share.stale = true;
      document.querySelector('#share-panel').outerHTML = sharePanel();
      bindSharing();
    }
    save();
    editor.parentElement.querySelector('.response-status').textContent = editor.value.trim() ? 'Antwort im Bericht enthalten.' : 'Nicht beantwortet';
    document.querySelector('#report-text').value = reportText();
    document.querySelector('#copy-status').textContent = 'Bericht aktualisiert. Bitte erneut kopieren.';
  };
  document.querySelector('#select-report').onclick = selectReport;
  document.querySelector('#copy-report').onclick = async () => {
    const text = reportText();
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(text);
      document.querySelector('#copy-status').textContent = text === reportText() ? 'Bericht kopiert. Du kannst ihn jetzt zur Prüfung senden.' : 'Der Bericht wurde inzwischen geändert. Bitte erneut kopieren.';
    } catch {
      selectReport();
      document.querySelector('#copy-status').textContent = 'Automatisches Kopieren ist nicht verfügbar. Der Bericht ist markiert: Kopiere ihn mit Strg+C, ⌘C oder dem Kopiermenü.';
    }
  };
}
function selectReport() {
  const text = document.querySelector('#report-text');
  text.closest('details').open = true;
  text.value = reportText(); text.focus(); text.select();
}
function renderRecovery() {
  app.innerHTML = `<section class="intro"><h1 id="view-title" tabindex="-1">Deine gespeicherten Antworten bleiben erhalten.</h1><p>Dieser ältere oder beschädigte Speicherstand lässt sich nicht automatisch öffnen. Sichere die gespeicherten Daten, bevor du den Test neu startest.</p></section><section class="report-panel"><label class="response-label" for="saved-data">Gespeicherte Daten</label><textarea id="saved-data" rows="12" readonly>${esc(recoveryRaw)}</textarea><div class="actions"><button class="primary" id="copy-saved">Gespeicherte Daten kopieren</button><button class="secondary" id="reset-saved">Neu starten</button></div><p id="recovery-status" role="status"></p></section>`;
  storageNote();
  document.querySelector('#reset-saved').onclick = requestRestart;
  document.querySelector('#copy-saved').onclick = async () => {
    const data = document.querySelector('#saved-data');
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(recoveryRaw);
      document.querySelector('#recovery-status').textContent = 'Gespeicherte Daten kopiert.';
    } catch {
      data.focus(); data.select();
      document.querySelector('#recovery-status').textContent = 'Daten markiert. Kopiere sie mit Strg+C, ⌘C oder dem Kopiermenü.';
    }
  };
}
function requestRestart() { document.querySelector('#restart-dialog').showModal(); }
document.querySelector('#cancel-restart').onclick = () => document.querySelector('#restart-dialog').close();
document.querySelector('#confirm-restart').onclick = () => {
  document.querySelector('#restart-dialog').close();
  quiz = publishedQuiz; recoveryRaw = null; storageReadable = true;
  state = createAttempt(quiz); reportView = false; save(); render(true);
};
