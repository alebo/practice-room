import test from 'node:test';
import assert from 'node:assert/strict';
import { quiz } from './fixtures/sample-quiz.js';
import { createAttempt } from '../app/quiz.js';
import { restoreSavedAttempt, serializeAttempt } from '../app/storage.js';
test('saved question snapshot survives a newly published quiz version',()=>{
  const state=createAttempt(quiz);
  const q=quiz.questions.find(q=>q.id===state.order[0]);
  state.answers[q.id]={selected:q.correct,checked:true};
  const raw=serializeAttempt(quiz,state);
  const updated={...quiz,version:quiz.version+1,questions:[]};
  const restored=restoreSavedAttempt(updated,raw);
  assert.equal(restored.mode,'restored');
  assert.deepEqual(restored.quiz,quiz);
  assert.deepEqual(restored.state,state);
});
test('compatible legacy state is restored without losing answers',()=>{
  const state=createAttempt(quiz);
  const restored=restoreSavedAttempt(quiz,JSON.stringify(state));
  assert.equal(restored.mode,'restored');
  assert.deepEqual(restored.state,state);
  assert.equal(JSON.parse(serializeAttempt(restored.quiz,restored.state)).quizSnapshot.id,quiz.id);
});
test('incompatible, malformed and future storage stays available for recovery',()=>{
  for(const raw of ['bad json','null',JSON.stringify({...createAttempt(quiz),version:0}),JSON.stringify({storageVersion:99})]) {
    assert.deepEqual(restoreSavedAttempt(quiz,raw),{mode:'recovery',raw});
  }
  const wrongQuiz=serializeAttempt({...quiz,id:'another-test'},createAttempt(quiz));
  assert.equal(restoreSavedAttempt(quiz,wrongQuiz).mode,'recovery');
});
test('only missing storage creates a fresh attempt automatically',()=>{
  assert.equal(restoreSavedAttempt(quiz,null).mode,'new');
  assert.equal(restoreSavedAttempt(quiz,'').mode,'recovery');
});
