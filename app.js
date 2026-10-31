import { quiz } from './questions.js';
import { createAttempt, isCorrect, validAttempt, validateQuiz } from './quiz.js';
const app = document.querySelector('#app');
const key = `lernraum:${quiz.id}`;
const esc = text => String(text).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let state;
let storageAvailable = true;
let mermaidPromise;
let renderNumber = 0;
try {
  validateQuiz(quiz);
  try { const saved = JSON.parse(localStorage.getItem(key)); if (validAttempt(quiz, saved)) state = saved; }
  catch { storageAvailable = false; }
  state ||= createAttempt(quiz);
  save();
  render();
} catch (error) {
  app.innerHTML = '<h1>Die Übung konnte nicht geladen werden.</h1><p>Bitte versuche es später erneut.</p>';
  console.error(error);
}
function save() {
  try { localStorage.setItem(key, JSON.stringify(state)); storageAvailable = true; }
  catch { storageAvailable = false; }
  storageNote();
}
function storageNote() {
  document.querySelector('#storage-note').textContent = storageAvailable ? 'Dein Fortschritt bleibt in diesem Browser.' : 'Speichern ist nicht verfügbar. Dieser Versuch bleibt nur bis zum Neuladen erhalten.';
}
function question(id) { return quiz.questions.find(q => q.id === id); }
function missed() { return state.order.filter(id => !isCorrect(question(id), state.answers[id]?.selected || [])); }
function intro() {
  return `<section class="intro"><div class="eyebrow"><span class="dot"></span>${esc(quiz.label)}</div><h1>${esc(quiz.title)}</h1><p>${esc(quiz.subtitle)}</p><div class="sample-note"><span aria-hidden="true">✧</span> Beispieltest zum Ausprobieren · ${quiz.questions.length} Fragen · ohne Zeitdruck</div></section>`;
}
function render(focus = false) {
  renderNumber++;
  app.innerHTML = intro() + (state.done ? results() : exercise());
  storageNote();
  if (!state.done) bindExercise();
  else {
    document.querySelector('#retry-all').onclick = requestRestart;
    const retry = document.querySelector('#retry-missed');
    if (retry) retry.onclick = () => { state = createAttempt(quiz, missed(), 'missed'); save(); render(true); };
  }
  const restart = document.querySelector('#restart');
  if (restart) restart.onclick = requestRestart;
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
  const answer = state.answers[q.id] || { selected: [], checked: false };
  const multiple = q.correct.length > 1;
  const completed = state.order.filter(id => state.answers[id]?.checked).length;
  return `<section class="workspace"><div class="progress-row"><span>${state.mode === 'missed' ? 'Wiederholung' : 'Dein Fortschritt'}</span><strong>${completed} / ${state.order.length} beantwortet</strong></div><progress value="${completed}" max="${state.order.length}" aria-label="Beantwortete Fragen"></progress><article class="question-card"><div class="question-meta"><span>FRAGE ${String(state.index + 1).padStart(2,'0')} <span class="muted">/ ${String(state.order.length).padStart(2,'0')}</span></span><span class="topic">${esc(q.topic || 'Übung')}</span></div><form id="answer-form"><fieldset ${answer.checked ? 'disabled' : ''}><legend id="view-title" tabindex="-1" lang="${esc(q.language || quiz.language)}">${esc(q.prompt)}</legend><p class="selection-hint" id="selection-hint">${multiple ? 'Mehrere Antworten sind richtig. Wähle alle passenden aus.' : 'Genau eine Antwort ist richtig.'}</p>${media(q)}<div class="options" lang="${esc(q.language || quiz.language)}">${state.optionOrder[q.id].map((id, i) => {
    const option = q.options.find(o => o.id === id);
    const selected = answer.selected.includes(id);
    const correct = q.correct.includes(id);
    const status = answer.checked ? correct ? 'correct' : selected ? 'incorrect' : '' : '';
    return `<label class="option ${status}"><input type="${multiple ? 'checkbox' : 'radio'}" name="answer" value="${esc(id)}" ${selected ? 'checked' : ''} aria-describedby="selection-hint"><span class="option-letter" aria-hidden="true">${String.fromCharCode(65+i)}</span><span class="option-text">${esc(option.text)}</span>${answer.checked && (correct || selected) ? `<span class="answer-tag">${correct ? '✓ Richtig' : '× Falsch'}</span>` : ''}</label>`;
  }).join('')}</div></fieldset><div id="feedback" aria-live="polite">${answer.checked ? feedback(q, answer) : ''}</div><div class="card-bottom"><span class="bottom-hint">${answer.checked ? 'Ein Schritt weiter.' : 'Nimm dir die Zeit, die du brauchst.'}</span>${answer.checked ? `<button class="primary" id="next" type="button">${state.index === state.order.length - 1 ? 'Ergebnis ansehen' : 'Nächste Frage'} <span aria-hidden="true">→</span></button>` : `<button class="primary" id="check" type="submit" ${answer.selected.length ? '' : 'disabled'}>Antwort prüfen <span aria-hidden="true">→</span></button>`}</div></form></article><div class="under-card"><span><span aria-hidden="true">✓</span> Lernen ohne Druck. Fehler gehören dazu.</span><button class="text-button" id="restart">Neu starten</button></div></section>`;
}
function feedback(q, answer) {
  const correct = isCorrect(q, answer.selected);
  return `<section class="feedback ${correct ? 'positive' : 'negative'}" tabindex="-1"><strong>${correct ? 'Richtig! Gut gemacht.' : 'Noch nicht ganz richtig.'}</strong>${!correct ? '<p>Die richtigen Antworten sind oben grün markiert.</p>' : ''}${q.explanation ? `<p lang="${esc(q.language || quiz.language)}">${esc(q.explanation)}</p>` : ''}</section>`;
}
function bindExercise() {
  const q = question(state.order[state.index]);
  const form = document.querySelector('#answer-form');
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
  const next = document.querySelector('#next');
  if (next) next.onclick = () => {
    if (state.index === state.order.length - 1) state.done = true;
    else state.index++;
    save(); render(true);
  };
}
function results() {
  const wrong = missed();
  const score = state.order.length - wrong.length;
  return `<section class="workspace"><article class="result-card"><div class="eyebrow">${state.mode === 'missed' ? 'Wiederholung abgeschlossen' : 'Übung abgeschlossen'}</div><h2 id="view-title" tabindex="-1">${wrong.length ? 'Du bist einen Schritt weiter.' : 'Alles richtig. Stark gemacht!'}</h2><div class="score">${score}<span> / ${state.order.length}</span></div><p>Fragen richtig beantwortet · ${Math.round(score/state.order.length*100)} %</p><p class="muted">Ein Punkt pro vollständig richtiger Antwort.</p><div class="actions">${wrong.length ? `<button class="primary" id="retry-missed">${wrong.length} Fehler wiederholen <span aria-hidden="true">→</span></button>` : ''}<button class="secondary" id="retry-all">Gesamten Test neu starten</button></div></article><section class="review"><h2>Deine Antworten im Überblick</h2><p class="muted">Öffne eine Frage, um Antworten und Erklärung anzusehen.</p>${state.order.map((id, i) => {
    const q = question(id); const a = state.answers[id]; const correct = isCorrect(q,a.selected);
    return `<details><summary><span class="review-status ${correct ? 'success' : 'failure'}" aria-label="${correct ? 'Richtig' : 'Falsch'}">${correct ? '✓' : '×'}</span><span lang="${esc(q.language || quiz.language)}">${i+1}. ${esc(q.prompt)}</span><span aria-hidden="true">+</span></summary><div class="review-body" lang="${esc(q.language || quiz.language)}">${media(q)}<ul>${state.optionOrder[id].map(oid => { const o=q.options.find(o=>o.id===oid); return `<li class="${q.correct.includes(oid) ? 'review-correct' : ''}">${esc(o.text)} <small>${a.selected.includes(oid) ? '· Deine Auswahl ' : ''}${q.correct.includes(oid) ? '· Richtig' : ''}</small></li>`; }).join('')}</ul>${q.explanation ? `<p>${esc(q.explanation)}</p>` : ''}</div></details>`;
  }).join('')}</section></section>`;
}
function requestRestart() { document.querySelector('#restart-dialog').showModal(); }
document.querySelector('#cancel-restart').onclick = () => document.querySelector('#restart-dialog').close();
document.querySelector('#confirm-restart').onclick = () => {
  document.querySelector('#restart-dialog').close();
  state = createAttempt(quiz); save(); render(true);
};
