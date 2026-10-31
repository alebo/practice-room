import { test, expect } from '@playwright/test';
import { readJSON, loadSet } from '../../scripts/lib/content.mjs';
const active = await readJSON(new URL('../../content/active-set.json', import.meta.url));
const {quiz: activeQuiz} = await loadSet(active.test, active.set);
const {quiz} = await loadSet('biology-grade-8','002-nutrients-and-digestion');
test('published set: all ten multi-answer questions, explanations and copyable results', async ({page,context}) => {
  await context.grantPermissions(['clipboard-read','clipboard-write']);
  const errors=[]; page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/tests/biology-grade-8/002-nutrients-and-digestion/');
  await expect(page.locator('h1')).toHaveText(quiz.title);
  await expect(page.locator('.intro')).not.toContainText('Beispieltest');
  const seen=new Set();
  for(let i=0;i<quiz.questions.length;i++) {
    const prompt=await page.locator('#view-title').textContent();
    const q=quiz.questions.find(q=>q.prompt===prompt);
    expect(q).toBeTruthy(); expect(q.correct.length).toBeGreaterThan(1);
    seen.add(q.id);
    await expect(page.locator('input[type=radio]')).toHaveCount(0);
    await expect(page.locator('input[type=checkbox]')).toHaveCount(q.options.length);
    for(const id of q.correct) await page.locator(`input[value="${id}"]`).check();
    await page.getByRole('button',{name:'Antwort prüfen'}).click();
    await expect(page.locator('.feedback')).toContainText(q.explanation);
    await page.getByRole('button',{name:i===quiz.questions.length-1?'Ergebnis ansehen':'Nächste Frage'}).click();
  }
  expect(seen.size).toBe(10);
  await expect(page.locator('.score')).toHaveText('10 / 10');
  await page.reload();
  await expect(page.locator('.score')).toHaveText('10 / 10');
  await expect(page.locator('[data-frq]')).toHaveCount(0);
  await page.getByRole('button',{name:'Als Text kopieren',exact:true}).click();
  await expect(page.locator('#copy-status')).toContainText('Bericht kopiert');
  const report=await page.evaluate(()=>navigator.clipboard.readText());
  expect(report).toContain(quiz.label); expect(report).toContain('10 von 10');
  for(const q of quiz.questions) expect(report).toContain(q.prompt);
  expect(errors).toEqual([]);
});

test('each exercise has a permanent route and separate saved progress',async({page})=>{
  await page.goto('/tests/biology-grade-8/001-basics/');
  const title=await page.locator('#view-title').textContent();
  await page.locator('input').first().check();
  await page.goto('/tests/biology-grade-8/002-nutrients-and-digestion/');
  await expect(page.locator('h1')).toHaveText(quiz.title);
  await expect(page.locator('input:checked')).toHaveCount(0);
  await page.goto('/tests/biology-grade-8/001-basics/');
  await expect(page.locator('#view-title')).toHaveText(title);
  await expect(page.locator('input:checked')).toHaveCount(1);
  await page.goto('/');
  await expect(page.locator('h1')).toHaveText(activeQuiz.title);
});
