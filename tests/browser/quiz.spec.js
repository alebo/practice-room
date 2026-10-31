import { test, expect } from '@playwright/test';
import { quiz } from '../../site/questions.js';
const key = `lernraum:${quiz.id}`;
async function current(page) {
  const prompt = await page.locator('legend').textContent();
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
    for(const id of q.correct) await page.locator(`input[value="${id}"]`).check();
    await page.getByRole('button',{name:'Antwort prüfen'}).click();
    await expect(page.locator('.feedback')).toContainText('Richtig!');
    await page.getByRole('button',{name:i===quiz.questions.length-1?'Ergebnis ansehen':'Nächste Frage'}).click();
  }
  await expect(page.locator('.score')).toHaveText('4 / 5');
  await page.reload();
  await expect(page.locator('.score')).toHaveText('4 / 5');
  await expect(page.locator('details')).toHaveCount(5);
  await page.locator('summary').first().click();
  await expect(page.locator('details').first().locator('.review-body')).toBeVisible();
  await page.getByRole('button',{name:'1 Fehler wiederholen'}).click();
  expect((await current(page)).id).toBe(first.id);
  for(const id of first.correct) await page.locator(`input[value="${id}"]`).check();
  await page.getByRole('button',{name:'Antwort prüfen'}).click();
  await page.getByRole('button',{name:'Ergebnis ansehen'}).click();
  await expect(page.locator('.score')).toHaveText('1 / 1');
  await expect(page.getByRole('button',{name:/Fehler wiederholen/})).toHaveCount(0);
  await page.getByRole('button',{name:'Gesamten Test neu starten'}).click();
  await page.getByRole('button',{name:'Weiterüben',exact:true}).click();
  await expect(page.locator('.score')).toHaveText('1 / 1');
  await page.getByRole('button',{name:'Gesamten Test neu starten'}).click();
  await page.getByRole('button',{name:'Neu starten',exact:true}).click();
  await expect(page.locator('legend')).toBeVisible();
  expect(JSON.parse(await page.evaluate(k=>localStorage.getItem(k),key)).order).toHaveLength(5);
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
test('invalid saved data recovers and unanswered shuffle survives refresh', async({page})=>{
  await page.addInitScript(k=>{if(!sessionStorage.getItem('seeded')){localStorage.setItem(k,'{"version":1,"order":["bad"]}');sessionStorage.setItem('seeded','1');}},key);
  await page.goto('/');
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
    await page.evaluate(({key,id})=>{
      const a=JSON.parse(localStorage.getItem(key));
      a.order=[id,...a.order.filter(q=>q!==id)];
      localStorage.setItem(key,JSON.stringify(a));
    },{key,id});
    await page.reload();
    if(id==='cell') await expect.poll(()=>page.locator('figure img').evaluate(i=>i.complete&&i.naturalWidth>0)).toBe(true);
    else await expect(page.locator('.diagram-canvas svg')).toBeVisible();
    await page.setViewportSize({width:1440,height:1100});
    await page.screenshot({path:`test-results/${id}-desktop.png`,fullPage:true});
    await page.setViewportSize({width:375,height:812});
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    await page.screenshot({path:`test-results/${id}-mobile.png`,fullPage:true});
  }
});
