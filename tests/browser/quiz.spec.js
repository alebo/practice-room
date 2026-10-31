import { test, expect } from '@playwright/test';
import { isFRQ, createAttempt } from '../../app/quiz.js';
import { quiz } from '../fixtures/sample-quiz.js';
test.beforeEach(async ({page}) => {
  await page.route('**/questions.js', route => route.fulfill({contentType:'text/javascript', body:`export const quiz = ${JSON.stringify(quiz)};`}));
});
const key = `lernraum:${quiz.id}`;
async function current(page) {
  const prompt = await page.locator('#view-title').textContent();
  return quiz.questions.find(q=>q.prompt===prompt);
}
test('complete, reload, review, retry missed, and restart', async ({page}) => {
  const errors=[]; page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/');
  const first = await current(page);
  const initialOrder = await page.locator('.option-text').allTextContents();
  await expect(page.getByRole('button',{name:'Antwort prüfen'})).toBeDisabled();
  const wrong = first.options.find(o=>!first.correct.includes(o.id)).id;
  await page.locator(`input[value="${wrong}"]`).check();
  await page.reload();
  expect(await page.locator('.option-text').allTextContents()).toEqual(initialOrder);
  await expect(page.locator(`input[value="${wrong}"]`)).toBeChecked();
  await page.getByRole('button',{name:'Antwort prüfen'}).click();
  await expect(page.locator('.feedback')).toContainText('Noch nicht ganz richtig');
  await page.reload();
  await expect(page.locator('.feedback')).toBeVisible();
  await expect(page.locator('input').first()).toBeDisabled();
  await page.getByRole('button',{name:'Nächste Frage'}).click();
  for(let i=1;i<quiz.questions.length;i++){
    const q=await current(page);
    if(q.mermaid) await expect(page.locator('.diagram-canvas svg')).toBeVisible();
    if(q.image) await expect.poll(()=>page.locator('figure img').evaluate(img=>img.complete && img.naturalWidth>0)).toBe(true);
    if(isFRQ(q)) {
      await page.getByRole('button',{name:i===quiz.questions.length-1?'Ergebnis ansehen':'Weiter',exact:true}).click();
      continue;
    }
    for(const id of q.correct) await page.locator(`input[value="${id}"]`).check();
    await page.getByRole('button',{name:'Antwort prüfen'}).click();
    await expect(page.locator('.feedback')).toContainText('Richtig!');
    await page.getByRole('button',{name:i===quiz.questions.length-1?'Ergebnis ansehen':'Nächste Frage'}).click();
  }
  await expect(page.locator('.score')).toHaveText('4 / 5');
  await page.reload();
  await expect(page.locator('.score')).toHaveText('4 / 5');
  await expect(page.locator('.review details')).toHaveCount(7);
  await page.locator('.review summary').first().click();
  await expect(page.locator('.review details').first().locator('.review-body')).toBeVisible();
  await page.getByRole('button',{name:'1 Fehler wiederholen'}).click();
  expect((await current(page)).id).toBe(first.id);
  for(const id of first.correct) await page.locator(`input[value="${id}"]`).check();
  await page.getByRole('button',{name:'Antwort prüfen'}).click();
  await page.getByRole('button',{name:'Ergebnis ansehen'}).click();
  await expect(page.locator('.score')).toHaveText('4 / 5');
  await expect(page.locator('.retry-result')).toContainText('1 / 1');
  await expect(page.getByRole('button',{name:/Fehler wiederholen/})).toHaveCount(0);
  await page.getByRole('button',{name:'Gesamten Test neu starten'}).click();
  await page.getByRole('button',{name:'Weiterüben',exact:true}).click();
  await expect(page.locator('.score')).toHaveText('4 / 5');
  await expect(page.locator('.retry-result')).toContainText('1 / 1');
  await page.getByRole('button',{name:'Gesamten Test neu starten'}).click();
  await page.getByRole('button',{name:'Neu starten',exact:true}).click();
  await expect(page.locator('legend')).toBeVisible();
  expect(JSON.parse(await page.evaluate(k=>localStorage.getItem(k),key)).order).toHaveLength(7);
  expect(errors).toEqual([]);
});
test('mobile layout, blocked storage, and keyboard selection', async({page})=>{
  await page.setViewportSize({width:375,height:812});
  await page.addInitScript(()=>{
    Storage.prototype.setItem=()=>{throw new Error('blocked');};
  });
  await page.goto('/');
  await page.locator('input').first().focus();
  await page.keyboard.press('Space');
  await expect(page.locator('#storage-note')).toContainText('Speichern ist nicht verfügbar');
  await page.getByRole('button',{name:'Antwort prüfen'}).click();
  await expect(page.locator('.feedback')).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
test('invalid saved data is preserved until a confirmed reset', async({page})=>{
  const raw='{"version":1,"order":["bad"]}';
  await page.addInitScript(({key,raw})=>{if(!sessionStorage.getItem('seeded')){localStorage.setItem(key,raw);sessionStorage.setItem('seeded','1');}},{key,raw});
  await page.goto('/');
  await expect(page.locator('#saved-data')).toHaveValue(raw);
  await page.reload();
  await expect(page.locator('#saved-data')).toHaveValue(raw);
  expect(await page.evaluate(k=>localStorage.getItem(k),key)).toBe(raw);
  await page.getByRole('button',{name:'Neu starten',exact:true}).click();
  await page.getByRole('button',{name:'Weiterüben',exact:true}).click();
  await expect(page.locator('#saved-data')).toHaveValue(raw);
  await page.getByRole('button',{name:'Neu starten',exact:true}).click();
  await page.locator('#confirm-restart').click();
  const before=await page.locator('legend').textContent();
  const options=await page.locator('.option-text').allTextContents();
  await page.reload();
  await expect(page.locator('legend')).toHaveText(before);
  expect(await page.locator('.option-text').allTextContents()).toEqual(options);
});

test('image and Mermaid render at desktop and mobile widths', async({page})=>{
  for(const id of ['cell','digestion']) {
    await page.goto('/');
    await page.evaluate(({key,id})=>{localStorage.removeItem(key); sessionStorage.setItem('visual-question',id);},{key,id});
    await page.reload();
    await expect(page.locator('#view-title')).toBeVisible();
    await page.evaluate(({key,id})=>{
      const a=JSON.parse(localStorage.getItem(key));
      a.order=[id,...a.order.filter(q=>q!==id)];
      localStorage.setItem(key,JSON.stringify(a));
    },{key,id});
    await page.reload();
    if(id==='cell') await expect.poll(()=>page.locator('figure img').evaluate(i=>i.complete&&i.naturalWidth>0)).toBe(true);
    else await expect(page.locator('.diagram-canvas svg')).toBeVisible();
    await page.setViewportSize({width:1440,height:1100});
    await page.screenshot({path:`.playwright/results/${id}-desktop.png`,fullPage:true});
    await page.setViewportSize({width:375,height:812});
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    await page.screenshot({path:`.playwright/results/${id}-mobile.png`,fullPage:true});
  }
});

async function seedAtFRQ(page) {
  const a=createAttempt(quiz);
  a.index=a.order.findIndex(id=>isFRQ(quiz.questions.find(q=>q.id===id)));
  for(const id of a.order.slice(0,a.index)) a.answers[id]={selected:quiz.questions.find(q=>q.id===id).correct,checked:true};
  const first=a.order[0], q=quiz.questions.find(q=>q.id===first);
  a.answers[first].selected=[q.options.find(o=>!q.correct.includes(o.id)).id];
  await page.goto('/');
  await expect(page.locator('#view-title')).toBeVisible();
  await page.evaluate(({key,a})=>localStorage.setItem(key,JSON.stringify(a)),{key,a});
  await page.reload();
  return a;
}
test('FRQ drafts, skipped answers, edits, copying, fallback and original report during retries',async({page,context})=>{
  await context.grantPermissions(['clipboard-read','clipboard-write']);
  const a=await seedAtFRQ(page);
  const text='Meine Antwort: äöü & <script>alert(1)</script>\nZweite Zeile 日本語';
  await expect(page.locator('#free-answer')).toBeVisible();
  await page.locator('#free-answer').fill(text);
  await page.reload();
  await expect(page.locator('#free-answer')).toHaveValue(text);
  await page.getByRole('button',{name:'Weiter',exact:true}).click();
  await page.getByRole('button',{name:'Ergebnis ansehen',exact:true}).click();
  await expect(page.locator('.score')).toHaveText('4 / 5');
  await expect(page.locator('.response-status').last()).toHaveText('Nicht beantwortet');
  await page.getByRole('button',{name:'Ergebnis kopieren',exact:true}).click();
  await expect(page.locator('#copy-status')).toContainText('Bericht kopiert');
  let copied=await page.evaluate(()=>navigator.clipboard.readText());
  expect(copied).toContain(text); expect(copied).toContain('Nicht beantwortet');
  expect(copied).toContain('4 von 5'); expect(copied).toContain('Gewählt:');
  const editor=page.locator('[data-frq]').first();
  await editor.fill(text+'\nErgänzung');
  await expect(page.locator('#copy-status')).toContainText('erneut kopieren');
  await page.reload();
  await expect(page.locator('[data-frq]').first()).toHaveValue(text+'\nErgänzung');
  await page.getByRole('button',{name:'1 Fehler wiederholen'}).click();
  await page.reload();
  await page.getByRole('button',{name:'Gesamtbericht ansehen'}).click();
  await expect(page.locator('[data-frq]').first()).toHaveValue(text+'\nErgänzung');
  await page.locator('[data-frq]').last().fill('Nachgetragen');
  await page.getByRole('button',{name:'Wiederholung fortsetzen'}).click();
  const q=await current(page);
  for(const id of q.correct) await page.locator(`input[value="${id}"]`).check();
  await page.getByRole('button',{name:'Antwort prüfen'}).click();
  await page.getByRole('button',{name:'Ergebnis ansehen'}).click();
  await page.reload();
  await expect(page.locator('.score')).toHaveText('4 / 5');
  await expect(page.locator('.retry-result')).toContainText('1 / 1');
  await page.getByRole('button',{name:'Ergebnis kopieren',exact:true}).click();
  await expect(page.locator('#copy-status')).toContainText('Bericht kopiert');
  copied=await page.evaluate(()=>navigator.clipboard.readText());
  expect(copied).toContain('4 von 5'); expect(copied).toContain('Ergänzung'); expect(copied).toContain('Nachgetragen');
  await page.evaluate(()=>{navigator.clipboard.writeText=async()=>{throw new Error('denied');};});
  await page.getByRole('button',{name:'Ergebnis kopieren',exact:true}).click();
  await expect(page.locator('#copy-status')).toContainText('Automatisches Kopieren ist nicht verfügbar');
  await expect(page.locator('#report-text')).toBeVisible();
  expect(await page.locator('#report-text').evaluate(e=>e.selectionEnd-e.selectionStart)).toBe(copied.length);
  await page.setViewportSize({width:375,height:812});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.screenshot({path:'.playwright/results/frq-results-mobile.png',fullPage:true});
});

test('completed answers remain copyable after reopening and a content update until explicit reset',async({page,context})=>{
  await context.grantPermissions(['clipboard-read','clipboard-write']);
  await seedAtFRQ(page);
  await page.locator('#free-answer').fill('Gespeicherte Antwort vor dem Update.');
  await page.getByRole('button',{name:'Weiter',exact:true}).click();
  await page.getByRole('button',{name:'Ergebnis ansehen',exact:true}).click();
  await expect(page.locator('.score')).toHaveText('4 / 5');
  const saved=await page.evaluate(k=>localStorage.getItem(k),key);
  const updated={...quiz,version:quiz.version+1,title:'Aktualisierter Test'};
  await context.route('**/questions.js',route=>route.fulfill({contentType:'text/javascript',body:`export const quiz = ${JSON.stringify(updated)};`}));
  await page.close();
  const reopened=await context.newPage();
  await reopened.goto('/');
  await expect(reopened.locator('h1')).toHaveText(quiz.title);
  await expect(reopened.locator('.score')).toHaveText('4 / 5');
  await expect(reopened.locator('[data-frq]').first()).toHaveValue('Gespeicherte Antwort vor dem Update.');
  await reopened.getByRole('button',{name:'Ergebnis kopieren',exact:true}).click();
  await expect(reopened.locator('#copy-status')).toContainText('Bericht kopiert');
  const copied=await reopened.evaluate(()=>navigator.clipboard.readText());
  expect(copied).toContain(`Testversion: ${quiz.version}`);
  expect(copied).toContain('Gespeicherte Antwort vor dem Update.');
  expect(await reopened.evaluate(k=>localStorage.getItem(k),key)).toBe(saved);
  await reopened.getByRole('button',{name:'Gesamten Test neu starten'}).click();
  await reopened.getByRole('button',{name:'Weiterüben',exact:true}).click();
  await expect(reopened.locator('.score')).toHaveText('4 / 5');
  await reopened.getByRole('button',{name:'Gesamten Test neu starten'}).click();
  await reopened.locator('#confirm-restart').click();
  await expect(reopened.locator('h1')).toHaveText(updated.title);
  const reset=JSON.parse(await reopened.evaluate(k=>localStorage.getItem(k),key));
  expect(reset.answers).toEqual({});
  expect(reset.quizSnapshot.version).toBe(updated.version);
});

test('MCQs can be explicitly left unanswered, persist on reload and enter retry',async({page})=>{
  await page.goto('/');
  const first=await current(page);
  await page.getByRole('button',{name:'Weiß ich nicht',exact:true}).click();
  await expect(page.locator('.feedback')).toContainText('Nicht beantwortet');
  await page.reload();
  await expect(page.locator('.feedback')).toContainText('Nicht beantwortet');
  await page.getByRole('button',{name:'Nächste Frage'}).click();
  for(let i=1;i<quiz.questions.length;i++){
    const q=await current(page);
    if(!isFRQ(q)) {
      await page.locator('input[name="answer"]').first().check();
      await page.getByRole('button',{name:'Weiß ich nicht',exact:true}).click();
    }
    await page.getByRole('button',{name:i===quiz.questions.length-1?'Ergebnis ansehen':isFRQ(q)?'Weiter':'Nächste Frage',exact:true}).click();
  }
  await expect(page.locator('.score')).toHaveText('0 / 5');
  await page.reload();
  await expect(page.locator('.score')).toHaveText('0 / 5');
  await page.getByRole('button',{name:'5 Fehler wiederholen'}).click();
  const saved=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),key);
  expect(JSON.stringify(saved)).toContain(first.id);
  await expect(page.getByRole('button',{name:'Weiß ich nicht',exact:true})).toBeVisible();
});

test('back navigation preserves FRQ drafts, edits, and locked MCQs across reloads',async({page})=>{
  const a=createAttempt(quiz);
  a.index=a.order.findIndex(id=>isFRQ(quiz.questions.find(q=>q.id===id)));
  for(const id of a.order.slice(0,a.index)) a.answers[id]={selected:[],checked:true};
  await page.goto('/');
  await page.evaluate(({key,a})=>localStorage.setItem(key,JSON.stringify(a)),{key,a});
  await page.reload();
  await page.locator('#free-answer').fill('First response');
  await page.getByRole('button',{name:'Weiter',exact:true}).click();
  await page.locator('#free-answer').fill('Second draft');
  await page.getByRole('button',{name:'← Zurück',exact:true}).click();
  await expect(page.locator('#free-answer')).toHaveValue('First response');
  await page.locator('#free-answer').fill('Edited first response');
  await page.getByRole('button',{name:'← Zurück',exact:true}).click();
  await page.reload();
  await expect(page.locator('input[name="answer"]').first()).toBeDisabled();
  await page.getByRole('button',{name:'Nächste Frage'}).click();
  await expect(page.locator('#free-answer')).toHaveValue('Edited first response');
  await page.getByRole('button',{name:'Weiter',exact:true}).click();
  await expect(page.locator('#free-answer')).toHaveValue('Second draft');
  await page.getByRole('button',{name:'Ergebnis ansehen',exact:true}).click();
  await expect(page.locator('[data-frq]').first()).toHaveValue('Edited first response');
  await expect(page.locator('[data-frq]').last()).toHaveValue('Second draft');
});
