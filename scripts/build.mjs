import { createHash } from 'node:crypto';
import { cp, mkdir, rm, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { root, readJSON, listSets, latestTests, testLabel, copyImages } from './lib/content.mjs';
const { values } = parseArgs({ options: { test: {type:'string'}, set: {type:'string'}, fixtures: {type:'boolean',default:false} } });
if (Boolean(values.test) !== Boolean(values.set)) throw new Error('Specify both --test and --set.');
const active = values.test ? {test:values.test,set:values.set} : await readJSON(path.join(root,'content/active-set.json'));
const sets = await listSets();
const selected = sets.find(s=>s.test===active.test && s.set===active.set);
if (!selected) throw new Error(`Unknown active set: ${active.test}/${active.set}`);
// Each dated test opens its own highest numbered exercise set.
const tests = latestTests(sets);
const latestRoutes = {};
for (const item of sets) {
  const latest = tests.find(s=>s.test===item.test);
  for (const id of [item.test, ...(item.metadata.legacyIds || [])]) latestRoutes[id] = `tests/${latest.test}/${latest.set}/`;
}
const dist = path.join(root,'dist');
await rm(dist,{recursive:true,force:true});
await mkdir(dist,{recursive:true});
for (const file of ['app.js','quiz.js','storage.js','privatebin.js','styles.css']) await cp(path.join(root,'app',file),path.join(dist,file));
const styleVersion = createHash('sha256').update(await readFile(path.join(root,'app/styles.css'))).digest('hex').slice(0,12);
const appVersion = createHash('sha256').update(await readFile(path.join(root,'app/app.js'))).digest('hex').slice(0,12);
await writeFile(path.join(dist,'latest-sets.json'),JSON.stringify(latestRoutes));
const template = await readFile(path.join(root,'app/index.html'),'utf8');
const escape = value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
async function renderSet(item, destination, prefix, canonicalPath) {
  await mkdir(destination,{recursive:true});
  const questions = `export const quiz = ${JSON.stringify({...item.quiz,testId:item.test,canonicalPath},null,2)};\n`;
  const questionVersion = createHash('sha256').update(questions).digest('hex').slice(0,12);
  const html = template.replace('./questions.js', `./questions.js?v=${questionVersion}`).replace('./styles.css',`${prefix}styles.css?v=${styleVersion}`).replace('./app.js',`${prefix}app.js?v=${appVersion}`)
    .replace('data-test=""', `data-test="${escape(item.test)}"`)
    .replace(/<title>.*?<\/title>/,`<title>${escape(item.quiz.title)} · Lernraum</title>`)
    .replace('href="./"',`href="${prefix}"`)
    .replace('<select class="subject" id="subject-select" aria-label="Test auswählen"></select>', `<select class="subject" id="subject-select" aria-label="Test auswählen">${tests.map(subject=>`<option value="${prefix}tests/${subject.test}/${subject.set}/"${subject.test===item.test ? ' selected' : ''}>${escape(testLabel(subject))}</option>`).join('')}</select>`)
    .replace(/<meta name="description" content="[^"]*">/,`<meta name="description" content="${escape(item.quiz.subtitle || item.quiz.title)}">`);
  await writeFile(path.join(destination,'index.html'),html);
  await writeFile(path.join(destination,'questions.js'),questions);
  await copyImages(path.join(item.directory,'assets'),path.join(destination,'assets'));
}
await renderSet(selected,dist,'./',`./tests/${selected.test}/${selected.set}/`);
const routes = new Set(sets.map(item=>item.test));
for (const item of sets) {
  await renderSet(item,path.join(dist,'tests',item.test,item.set),'../../../','./');
  for (const legacy of item.metadata.legacyIds || []) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(legacy) || routes.has(legacy)) throw new Error(`Invalid or conflicting legacy route: ${legacy}`);
    await renderSet(item,path.join(dist,'tests',legacy,item.set),'../../../',`../../../tests/${item.test}/${item.set}/`);
  }
}
// Explicitly opt into test-only assets; ordinary and published builds exclude them.
if (values.fixtures) await copyImages(path.join(root,'tests/fixtures/assets'),path.join(dist,'assets'));
await mkdir(path.join(dist,'vendor/mermaid/chunks'),{recursive:true});
await cp(path.join(root,'node_modules/mermaid/dist/mermaid.esm.min.mjs'),path.join(dist,'vendor/mermaid/mermaid.esm.min.mjs'));
await cp(path.join(root,'node_modules/mermaid/dist/chunks/mermaid.esm.min'),path.join(dist,'vendor/mermaid/chunks/mermaid.esm.min'),{recursive:true,filter:source=>!source.endsWith('.map')});
await cp(path.join(root,'node_modules/mermaid/LICENSE'),path.join(dist,'vendor/mermaid/LICENSE'));
await writeFile(path.join(dist,'.nojekyll'),'');
console.log(`Built ${sets.length} sets. Default: ${selected.test}/${selected.set}`);
