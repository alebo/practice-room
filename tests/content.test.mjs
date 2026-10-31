import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readdir, readFile, mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { listSets, slug, root, copyImages } from '../scripts/lib/content.mjs';
test('content paths and quiz identities are distinct',async()=>{
  const sets=await listSets();
  assert.ok(sets.length>=2);
  assert.equal(new Set(sets.map(s=>s.quiz.id)).size,sets.length);
  assert.throws(()=>slug('../private'),/Invalid/);
});
test('private evidence and original sources are ignored by git',()=>{
  for(const file of ['private/learners/test/attempt.json','content/tests/biology-grade-8/sources/study-guide.txt']) {
    assert.equal(execFileSync('git',['check-ignore',file],{cwd:root,encoding:'utf8'}).trim(),file);
  }
});
test('asset copy only includes supported images',async()=>{
  const folder=await mkdtemp(path.join(tmpdir(),'quiz-assets-'));
  try {
    const source=path.join(folder,'source'),destination=path.join(folder,'dest');
    await mkdir(source);
    await writeFile(path.join(source,'diagram.svg'),'<svg/>');
    await writeFile(path.join(source,'report.txt'),'private');
    await copyImages(source,destination);
    assert.deepEqual(await readdir(destination),['diagram.svg']);
    assert.equal(await readFile(path.join(destination,'diagram.svg'),'utf8'),'<svg/>');
  } finally {await rm(folder,{recursive:true,force:true});}
});
