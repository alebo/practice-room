import test from 'node:test';
import assert from 'node:assert/strict';
import { quiz } from './fixtures/sample-quiz.js';
import { buildReport, createAttempt, isFRQ } from '../app/quiz.js';
import { parseReport, summarizeEvidence } from '../scripts/lib/evidence.mjs';
function completed() {
  const a=createAttempt(quiz);a.done=true;a.index=a.order.length-1;
  for(const q of quiz.questions) a.answers[q.id]=isFRQ(q)?{text:'Antwort äöü\nSecond line.',checked:true}:{selected:[...q.correct],checked:true};
  const mcq=quiz.questions.find(q=>!isFRQ(q));
  a.answers[mcq.id].selected=[mcq.options.find(o=>!mcq.correct.includes(o.id)).id];
  a.answers[quiz.questions.filter(isFRQ)[1].id].text='';
  return a;
}
test('copied reports round-trip multilingual FRQs and exact MCQ answers',()=>{
  const a=completed();
  const answers=parseReport(buildReport(quiz,a,'https://example.org/test/'),quiz);
  for(const q of quiz.questions) {
    if(isFRQ(q)) assert.equal(answers[q.id].text,a.answers[q.id].text);
    else assert.deepEqual(answers[q.id].selected,a.answers[q.id].selected);
  }
});
test('report import rejects mismatched versions, missing questions and altered scoring',()=>{
  const report=buildReport(quiz,completed(),'https://example.org/test/');
  assert.throws(()=>parseReport(report,{...quiz,version:999}),/version/);
  assert.throws(()=>parseReport(report.replace(quiz.questions[0].prompt,'Missing prompt'),quiz),/Missing/);
  assert.throws(()=>parseReport(report.replace('Ergebnis: Falsch','Ergebnis: Richtig'),quiz),/disagrees/);
});
test('gap evidence contains missed options and separates unreviewed FRQs',()=>{
  const answers=parseReport(buildReport(quiz,completed(),'https://example.org'),quiz);
  const attempt={id:'attempt-1',test:'biology',set:'example',importedAt:'2026-10-31T12:00:00Z',quiz,answers};
  const summary=summarizeEvidence([{attempt,review:{questions:{}}}]);
  const evidence=summary.skills.flatMap(s=>s.evidence);
  assert.equal(evidence.filter(e=>e.assessment==='incorrect').length,1);
  assert.equal(evidence.filter(e=>e.assessment==='unreviewed').length,2);
  assert.ok(evidence.find(e=>e.assessment==='incorrect').missedCorrect.length);
  assert.ok(evidence.find(e=>e.assessment==='incorrect').selectedIncorrect.length);
  const id=quiz.questions.find(isFRQ).id;
  const reviewed=summarizeEvidence([{attempt,review:{questions:{[id]:{assessment:'partial',notes:'Needs explanation.'}}}}]);
  assert.ok(reviewed.skills.some(s=>s.evidence.some(e=>e.questionId===id&&e.assessment==='partial'&&e.notes==='Needs explanation.')));
});
