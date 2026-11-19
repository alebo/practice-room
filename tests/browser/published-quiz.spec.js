import { test, expect } from '@playwright/test';
import { readJSON, loadSet, testLabel } from '../../scripts/lib/content.mjs';
const active = await readJSON(new URL('../../content/active-set.json', import.meta.url));
const {quiz: activeQuiz} = await loadSet(active.test, active.set);
const {quiz} = await loadSet('biology-grade-8-2026-11','002-nutrients-and-digestion');
test('published set: all ten multi-answer questions, explanations and copyable results', async ({page,context}) => {
  await context.grantPermissions(['clipboard-read','clipboard-write']);
  const errors=[]; page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/tests/biology-grade-8-2026-11/002-nutrients-and-digestion/');
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
  await page.goto('/tests/biology-grade-8-2026-11/001-basics/');
  const title=await page.locator('#view-title').textContent();
  await page.locator('input').first().check();
  await page.goto('/tests/biology-grade-8-2026-11/002-nutrients-and-digestion/');
  await expect(page.locator('h1')).toHaveText(quiz.title);
  await expect(page.locator('input:checked')).toHaveCount(0);
  await page.goto('/tests/biology-grade-8-2026-11/001-basics/');
  await expect(page.locator('#view-title')).toHaveText(title);
  await expect(page.locator('input:checked')).toHaveCount(1);
  await page.goto('/');
  await expect(page.locator('h1')).toHaveText(activeQuiz.title);
});

test('test selector opens latest sets and retains progress across subjects and direct links',async({page})=>{
  const {listSets}=await import('../../scripts/lib/content.mjs');
  const sets=await listSets();
  const latest=test=>sets.filter(s=>s.test===test).sort((a,b)=>a.set.localeCompare(b.set,'en',{numeric:true})).at(-1);
  const biology=latest('biology-grade-8-2026-11'),politics=latest('politics-grade-8-2026-11');
  await page.goto('/tests/biology-grade-8-2026-11/001-basics/');
  await expect(page.getByRole('combobox',{name:'Test auswählen'}).locator('option:checked')).toHaveText(testLabel(biology));
  await page.locator('input[name="answer"]').first().check();
  await page.getByRole('combobox').selectOption({label:testLabel(politics)});
  await expect(page).toHaveURL(new RegExp(`/tests/${politics.test}/${politics.set}/$`));
  const prompt=await page.locator('#view-title').textContent();
  await page.locator('input[name="answer"]').first().check();
  await page.getByRole('combobox').selectOption({label:testLabel(biology)});
  await expect(page).toHaveURL(new RegExp(`/tests/${biology.test}/${biology.set}/$`));
  await expect(page.locator('h1')).toHaveText(biology.quiz.title);
  await page.getByRole('combobox').selectOption({label:testLabel(politics)});
  await expect(page.locator('#view-title')).toHaveText(prompt);
  await expect(page.locator('input:checked')).toHaveCount(1);
  await page.goto('/tests/biology-grade-8-2026-11/001-basics/');
  await expect(page.locator('input:checked')).toHaveCount(1);
  await page.setViewportSize({width:375,height:812});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  for (const width of [320,375,768,1280]) {
    await page.setViewportSize({width,height:812});
    const brand=await page.locator('.brand').boundingBox();
    const selector=await page.getByRole('combobox').boundingBox();
    expect(Math.abs(brand.y+brand.height/2-selector.y-selector.height/2)).toBeLessThan(2);
  }
  await expect(page.locator('link[rel="stylesheet"]')).toHaveAttribute('href', /styles\.css\?v=[a-f0-9]{12}$/);
  await page.screenshot({path:'.playwright/results/subject-selector-mobile.png'});
  await page.getByRole('link',{name:'Lernraum – aktuelle Übung'}).click();
  await expect(page).toHaveURL('http://127.0.0.1:4173/');
  await expect(page.getByRole('combobox')).toBeVisible();
});

test('latest button fetches current test destination and preserves answers across refreshes', async ({page}) => {
  await page.goto('/tests/biology-grade-8-2026-11/001-basics/');
  await page.locator('input[name="answer"]').first().check();
  const saved = await page.evaluate(() => localStorage.getItem('lernraum:biology-001-basics'));
  expect(saved).not.toBeNull();
  // Simulate a deployment newer than the already-open page's subject selector.
  await page.route('**/latest-sets.json?*', route => route.fulfill({json:{'biology-grade-8-2026-11':'tests/biology-grade-8-2026-11/002-nutrients-and-digestion/'}}));
  const manifest = page.waitForRequest('**/latest-sets.json?*');
  await page.getByRole('button',{name:'Neueste Übung laden'}).click();
  expect((await manifest).url()).toContain('refresh=');
  await expect(page).toHaveURL(/002-nutrients-and-digestion\/\?refresh=\d+$/);
  await expect(page.locator('h1')).toHaveText(quiz.title);
  await page.locator('input[name="answer"]').first().check();
  const prompt = await page.locator('#view-title').textContent();
  const questions = page.waitForRequest('**/questions.js?*refresh=*');
  await page.getByRole('button',{name:'Neueste Übung laden'}).click();
  await questions;
  await expect(page.locator('#view-title')).toHaveText(prompt);
  await expect(page.locator('input:checked')).toHaveCount(1);
  expect(await page.evaluate(() => localStorage.getItem('lernraum:biology-001-basics'))).toBe(saved);
  await page.goto('/tests/biology-grade-8-2026-11/001-basics/');
  await expect(page.locator('input:checked')).toHaveCount(1);
});

test('latest button handles network failure without leaving the attempt', async ({page}) => {
  await page.goto('/');
  await page.locator('input[name="answer"]').first().check();
  await page.route('**/latest-sets.json?*', route => route.abort());
  await page.getByRole('button',{name:'Neueste Übung laden'}).click();
  await expect(page.locator('#latest-status')).toContainText('Bitte versuche es erneut');
  await expect(page.getByRole('button',{name:'Neueste Übung laden'})).toBeEnabled();
  await expect(page.locator('input:checked')).toHaveCount(1);
  await page.setViewportSize({width:320,height:812});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

test('legacy test URLs retain progress and report the dated canonical URL',async({page})=>{
  await page.goto('/tests/biology-grade-8/001-basics/');
  await expect(page.locator('#view-title')).toBeVisible();
  await page.locator('input[name=answer]').first().check();
  const selected=await page.locator('input:checked').getAttribute('value');
  await page.goto('/tests/biology-grade-8-2026-11/001-basics/');
  await expect(page.locator('input:checked')).toHaveAttribute('value',selected);
  const quiz=await page.evaluate(async()=> (await import('./questions.js')).quiz);
  expect(quiz.canonicalPath).toBe('./');
  await page.goto('/tests/biology-grade-8/001-basics/');
  const legacy=await page.evaluate(async()=> (await import('./questions.js')).quiz);
  expect(legacy.id).toBe(quiz.id);
  expect(legacy.canonicalPath).toBe('../../../tests/biology-grade-8-2026-11/001-basics/');
});

test('homepage loads versioned questions and keeps its specific test selected',async({page})=>{
  // A cached pre-migration homepage module must not supply the current questions.
  await page.route('**/questions.js',route=>route.fulfill({contentType:'text/javascript',body:`export const quiz = ${JSON.stringify(quiz)};`}));
  const request=page.waitForRequest(url=>/questions\.js\?v=[a-f0-9]{12}$/.test(url.url()));
  await page.goto('/');
  await request;
  await expect(page.locator('h1')).toHaveText(activeQuiz.title);
  const {metadata}=await loadSet(active.test,active.set);
  await expect(page.locator('#subject-select option:checked')).toHaveText(testLabel({test:active.test,metadata}));
  const value=await page.locator('#subject-select').inputValue();
  await page.evaluate(()=>{
    const select=document.querySelector('#subject-select');
    select.selectedIndex=(select.selectedIndex+1)%select.options.length;
    window.dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true}));
  });
  await expect(page.locator('#subject-select')).toHaveValue(value);
});
