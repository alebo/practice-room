import { parseArgs } from 'node:util';
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID, createHash } from 'node:crypto';
import { root, slug, loadSet, readJSON } from './lib/content.mjs';
import { parseReport, summarizeEvidence } from './lib/evidence.mjs';
const action=process.argv[2];
const {values}=parseArgs({args:process.argv.slice(3),options:{learner:{type:'string'},file:{type:'string'},test:{type:'string'},set:{type:'string'}}});
const learner=slug(values.learner,'learner');
const directory=path.join(root,'private/learners',learner);
const attemptsDirectory=path.join(directory,'attempts');
async function readAttempts() {
  let entries;
  try {entries=await readdir(attemptsDirectory,{withFileTypes:true});} catch(e) {if(e.code==='ENOENT') return [];throw e;}
  const result=[];
  for(const entry of entries.filter(e=>e.isDirectory())) {
    const folder=path.join(attemptsDirectory,entry.name);
    const attempt=await readJSON(path.join(folder,'attempt.json'));
    const review=await readJSON(path.join(folder,'review.json'));
    result.push({attempt,review});
  }
  return result;
}
if(action==='import') {
  if(!values.file) throw new Error('--file is required.');
  const {quiz,test,set}=await loadSet(values.test,values.set);
  const raw=await readFile(path.resolve(values.file),'utf8');
  const answers=parseReport(raw,quiz);
  const sourceHash=createHash('sha256').update(raw.replace(/\r\n/g,'\n').trim()).digest('hex');
  const existing=(await readAttempts()).find(({attempt})=>attempt.sourceHash===sourceHash);
  if(existing) throw new Error(`This report was already imported as ${existing.attempt.id}.`);
  const importedAt=new Date().toISOString();
  const id=importedAt.replace(/[:.]/g,'-')+'-'+randomUUID().slice(0,8);
  const folder=path.join(attemptsDirectory,id);
  await mkdir(folder,{recursive:true});
  await writeFile(path.join(folder,'report.txt'),raw,{flag:'wx'});
  await writeFile(path.join(folder,'attempt.json'),JSON.stringify({schemaVersion:1,id,learner,test,set,importedAt,sourceHash,quiz,answers},null,2)+'\n',{flag:'wx'});
  const questions=Object.fromEntries(quiz.questions.map(q=>[q.id,{assessment:answers[q.id].type==='frq'?'unreviewed':answers[q.id].correct?'correct':'incorrect',notes:''}]));
  await writeFile(path.join(folder,'review.json'),JSON.stringify({questions},null,2)+'\n',{flag:'wx'});
  console.log(`Imported locally: ${path.relative(root,folder)}`);
  console.log('Edit review.json to assess FRQs or record observations; then run answers:gaps.');
} else if(action==='gaps') {
  const attempts=await readAttempts();
  if(!attempts.length) throw new Error('No imported attempts for this learner.');
  const summary=summarizeEvidence(attempts);
  await writeFile(path.join(directory,'knowledge-gaps.json'),JSON.stringify(summary,null,2)+'\n');
  for(const item of summary.skills) console.log(`${item.skill}: ${item.incorrect} incorrect, ${item.partial} partial, ${item.correct} correct, ${item.unreviewed} unreviewed`);
  console.log(`Saved locally: private/learners/${learner}/knowledge-gaps.json`);
} else throw new Error('Usage: answers.mjs import --learner ID --test ID --set ID --file REPORT | gaps --learner ID');
