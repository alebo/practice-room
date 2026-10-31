import { cp, mkdir, rm, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { root, readJSON, listSets, copyImages } from './lib/content.mjs';
const { values } = parseArgs({ options: { test: {type:'string'}, set: {type:'string'}, fixtures: {type:'boolean',default:false} } });
if (Boolean(values.test) !== Boolean(values.set)) throw new Error('Specify both --test and --set.');
const active = values.test ? {test:values.test,set:values.set} : await readJSON(path.join(root,'content/active-set.json'));
const sets = await listSets();
const selected = sets.find(s=>s.test===active.test && s.set===active.set);
if (!selected) throw new Error(`Unknown active set: ${active.test}/${active.set}`);
const dist = path.join(root,'dist');
await rm(dist,{recursive:true,force:true});
await mkdir(dist,{recursive:true});
for (const file of ['app.js','quiz.js','storage.js','styles.css']) await cp(path.join(root,'app',file),path.join(dist,file));
const template = await readFile(path.join(root,'app/index.html'),'utf8');
const escape = value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
async function renderSet(item, destination, prefix, canonicalPath) {
  await mkdir(destination,{recursive:true});
  const html = template.replace('./styles.css',`${prefix}styles.css`).replace('./app.js',`${prefix}app.js`)
    .replace(/<title>.*?<\/title>/,`<title>${escape(item.quiz.title)} · Lernraum</title>`)
    .replace(/<span class="subject">.*?<\/span>/,`<span class="subject">${escape(item.metadata.title)}</span>`)
    .replace(/<meta name="description" content="[^"]*">/,`<meta name="description" content="${escape(item.quiz.subtitle || item.quiz.title)}">`);
  await writeFile(path.join(destination,'index.html'),html);
  await writeFile(path.join(destination,'questions.js'),`export const quiz = ${JSON.stringify({...item.quiz,canonicalPath},null,2)};\n`);
  await copyImages(path.join(item.directory,'assets'),path.join(destination,'assets'));
}
await renderSet(selected,dist,'./',`./tests/${selected.test}/${selected.set}/`);
for (const item of sets) await renderSet(item,path.join(dist,'tests',item.test,item.set),'../../../','./');
// Explicitly opt into test-only assets; ordinary and published builds exclude them.
if (values.fixtures) await copyImages(path.join(root,'tests/fixtures/assets'),path.join(dist,'assets'));
await mkdir(path.join(dist,'vendor/mermaid/chunks'),{recursive:true});
await cp(path.join(root,'node_modules/mermaid/dist/mermaid.esm.min.mjs'),path.join(dist,'vendor/mermaid/mermaid.esm.min.mjs'));
await cp(path.join(root,'node_modules/mermaid/dist/chunks/mermaid.esm.min'),path.join(dist,'vendor/mermaid/chunks/mermaid.esm.min'),{recursive:true,filter:source=>!source.endsWith('.map')});
await cp(path.join(root,'node_modules/mermaid/LICENSE'),path.join(dist,'vendor/mermaid/LICENSE'));
await writeFile(path.join(dist,'.nojekyll'),'');
console.log(`Built ${sets.length} sets. Default: ${selected.test}/${selected.set}`);
