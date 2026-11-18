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

test('unanswered MCQs survive storage validation and report import without invented choices',async()=>{
  const {validAttempt}=await import('../app/quiz.js');
  const a=completed();
  const q=quiz.questions.find(q=>!isFRQ(q));
  a.answers[q.id]={selected:[],checked:true};
  assert.equal(validAttempt(quiz,a),true);
  const report=buildReport(quiz,a,'https://example.org');
  assert.match(report,/Ergebnis: Nicht beantwortet\nGewählt: \n/);
  const answers=parseReport(report,quiz);
  assert.deepEqual(answers[q.id],{type:'mcq',selected:[],correct:false});
  assert.throws(()=>parseReport(report.replace('Ergebnis: Nicht beantwortet','Ergebnis: Richtig'),quiz),/disagrees/);
  const summary=summarizeEvidence([{attempt:{id:'skip',quiz,answers},review:{questions:{}}}]);
  assert.ok(summary.skills.some(s=>s.evidence.some(e=>e.questionId===q.id&&e.unanswered&&e.selectedIncorrect.length===0)));
});

test('evidence summaries refuse to combine different tests',()=>{
  assert.throws(()=>summarizeEvidence([
    {attempt:{test:'biology-grade-8-2026-11'}},
    {attempt:{test:'politics-grade-8-2026-11'}}
  ]),/different tests/);
});

test('answer CLI stores imports and summaries separately per learner and test',async()=>{
  const {execFileSync}=await import('node:child_process');
  const {mkdir,writeFile,readFile,rm,access}=await import('node:fs/promises');
  const {listSets,root}=await import('../scripts/lib/content.mjs');
  const learner=`test-isolation-${process.pid}`;
  const directory=`${root}/private/learners/${learner}`;
  const selected=[...new Map((await listSets()).map(s=>[s.test,s])).values()];
  const run=args=>execFileSync(process.execPath,['scripts/answers.mjs',...args],{cwd:root,stdio:'pipe'});
  try {
    await mkdir(directory,{recursive:true});
    for (const item of selected) {
      const attempt=createAttempt(item.quiz);
      for (const q of item.quiz.questions) attempt.answers[q.id]=isFRQ(q)?{text:'Synthetic response',checked:true}:{selected:q.correct,checked:true};
      const file=`${directory}/${item.test}.txt`;
      await writeFile(file,buildReport(item.quiz,attempt,'https://example.org/'));
      run(['import','--learner',learner,'--test',item.test,'--set',item.set,'--file',file]);
      run(['gaps','--learner',learner,'--test',item.test]);
      const summary=JSON.parse(await readFile(`${directory}/tests/${item.test}/knowledge-gaps.json`,'utf8'));
      assert.equal(summary.test,item.test);
      assert.ok(summary.skills.flatMap(s=>s.evidence).every(e=>e.test===item.test));
      assert.throws(()=>run(['import','--learner',learner,'--test',item.test,'--set',item.set,'--file',file]),/already imported/);
    }
    assert.throws(()=>run(['gaps','--learner',learner]),/Invalid test/);
    await assert.rejects(access(`${directory}/knowledge-gaps.json`));
  } finally {await rm(directory,{recursive:true,force:true});}
});
