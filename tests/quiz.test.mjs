import test from 'node:test';
import assert from 'node:assert/strict';
import { quiz } from '../site/questions.js';
import { createAttempt, isCorrect, shuffle, validAttempt, validateQuiz } from '../site/quiz.js';
test('sample content is valid', () => validateQuiz(quiz));
test('multiple answers require exact matching, with no partial or duplicate credit', () => {
  const q = quiz.questions.find(q => q.correct.length > 1);
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
  for (const q of quiz.questions) a.answers[q.id] = {selected:q.correct,checked:true};
  assert.equal(validAttempt(quiz,a),true);
  assert.equal(validAttempt(quiz,createAttempt(quiz,[quiz.questions[0].id],'missed')),true);
});
