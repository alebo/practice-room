import { quiz as publishedQuiz } from '../site/questions.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import { quiz } from './fixtures/sample-quiz.js';
import { createAttempt, isCorrect, shuffle, validAttempt, validateQuiz, isFRQ, buildReport, mcqSummary } from '../site/quiz.js';
test('sample content is valid', () => validateQuiz(quiz));
test('multiple answers require exact matching, with no partial or duplicate credit', () => {
  const q = quiz.questions.find(q => q.correct?.length > 1);
  assert.equal(isCorrect(q, [...q.correct].reverse()), true);
  assert.equal(isCorrect(q, q.correct.slice(1)), false);
  assert.equal(isCorrect(q, q.options.map(o=>o.id)), false);
  assert.equal(isCorrect(q, [q.correct[0], q.correct[0]]), false);
});
test('shuffling preserves input and elements', () => {
  const original = [1,2,3,4];
  assert.deepEqual(shuffle(original, () => 0), [2,3,4,1]);
  assert.deepEqual(original, [1,2,3,4]);
});
test('restores valid attempts and rejects stale, malformed or skipped progress', () => {
  const a = createAttempt(quiz);
  assert.equal(validAttempt(quiz, JSON.parse(JSON.stringify(a))), true);
  assert.equal(validAttempt(quiz, {...a,version:0}), false);
  assert.equal(validAttempt(quiz, {...a,order:['missing']}), false);
  assert.equal(validAttempt(quiz, {...a,index:2}), false);
  assert.equal(validAttempt(quiz, {...a,done:true}), false);
  assert.equal(validAttempt(quiz, {...a,optionOrder:{}}), false);
  assert.equal(validAttempt(quiz, {...a,order:[a.order[0],a.order[0]]}), false);
});
test('completed attempts and missed-only attempts restore', () => {
  const a = createAttempt(quiz);
  a.index = a.order.length - 1;
  a.done = true;
  for (const q of quiz.questions) a.answers[q.id] = isFRQ(q) ? {text:'',checked:true} : {selected:q.correct,checked:true};
  assert.equal(validAttempt(quiz,a),true);
  assert.equal(validAttempt(quiz,{...createAttempt(quiz,[quiz.questions[0].id],'missed'),original:a}),true);
});

function completed(source = quiz) {
  const a = createAttempt(source);
  a.index = a.order.length - 1; a.done = true;
  for (const q of source.questions) a.answers[q.id] = isFRQ(q) ? {text:'',checked:true} : {selected:q.correct,checked:true};
  return a;
}
test('questions are shuffled within MCQ and FRQ sections',()=>{
  const a=createAttempt(quiz);
  const types=a.order.map(id=>isFRQ(quiz.questions.find(q=>q.id===id)));
  assert.deepEqual(types,[false,false,false,false,false,true,true]);
  const invalid={...a,order:[...a.order].reverse()};
  assert.equal(validAttempt(quiz,invalid),false);
});
test('FRQs are ungraded; skipped and multilingual answers appear verbatim in report',()=>{
  const a=completed();
  const frqs=quiz.questions.filter(isFRQ);
  const answer='Erste Zeile <script> & äöü\n日本語 — druga linia';
  a.answers[frqs[0].id].text=answer;
  assert.equal(validAttempt(quiz,a),true);
  assert.deepEqual(mcqSummary(quiz,a),{total:5,correct:5,wrong:[]});
  const report=buildReport(quiz,a,'https://example.org/test/');
  for(const expected of [answer,'Nicht beantwortet','5 von 5','Gewählt:','Richtig:','Bildbeschreibung:','Diagrammbeschreibung:','https://example.org/test/','nicht bewertet']) assert.ok(report.includes(expected),expected);
  assert.ok(!report.includes('flowchart'));
  assert.ok(!report.includes('NaN'));
});
test('report uses original MCQ answers after retry and current FRQ edits',()=>{
  const original=completed();
  const q=quiz.questions.find(q=>!isFRQ(q));
  original.answers[q.id].selected=[q.options.find(o=>!q.correct.includes(o.id)).id];
  const retry={...createAttempt(quiz,[q.id],'missed'), original};
  retry.answers[q.id]={selected:q.correct,checked:true}; retry.done=true;
  assert.equal(validAttempt(quiz,retry),true);
  assert.equal(mcqSummary(quiz,retry).correct,1);
  assert.ok(buildReport(quiz,retry,'https://example.org').includes('4 von 5'));
  const frq=quiz.questions.find(isFRQ);
  retry.original.answers[frq.id].text='Überarbeitete Antwort';
  assert.ok(buildReport(quiz,retry,'https://example.org').includes('Überarbeitete Antwort'));
  assert.equal(validAttempt(quiz,{...retry,original:undefined}),false);
  assert.equal(validAttempt(quiz,{...retry,original:{...original,done:false}}),false);
});
test('FRQ-only tests have no MCQ score and restore skipped answers',()=>{
  const source={...quiz,questions:quiz.questions.filter(isFRQ)};
  validateQuiz(source);
  const a=completed(source);
  assert.equal(validAttempt(source,a),true);
  assert.equal(mcqSummary(source,a).total,0);
  assert.ok(!buildReport(source,a,'https://example.org').includes('NaN'));
});

test('published content is valid', () => validateQuiz(publishedQuiz));
