import { execFileSync } from 'node:child_process';
import { mkdtemp, readdir, rm, cp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { root, listSets } from './lib/content.mjs';
const { values } = parseArgs({ options: { 'dry-run': { type: 'boolean', default: false } } });
const run=(cmd,args,cwd=root)=>execFileSync(cmd,args,{cwd,stdio:'inherit'});
const git=['-c','credential.helper=','-c','credential.helper=!gh auth git-credential'];
// Refuse to publish uncommitted source or scaffold questions.
const status=execFileSync('git',['status','--porcelain','--','app','content','scripts','package.json','package-lock.json'],{cwd:root,encoding:'utf8'});
if(status.trim()) throw new Error('Commit app, content, and publishing changes before publishing.');
for(const {quiz} of await listSets()) if(/Frage ergänzen|Antwort ergänzen|Alternative ergänzen/.test(JSON.stringify(quiz))) throw new Error('Replace all scaffold placeholders before publishing.');
run('npm',['test']);
run('node',['scripts/build.mjs']);
if (values['dry-run']) {
  console.log('Dry run complete. Validated committed source and built dist/. No remote changes made.');
  process.exit(0);
}
const checkout=await mkdtemp(path.join(tmpdir(),'quiz-pages-'));
try {
  run('git',[...git,'clone','--quiet','--single-branch','--branch','gh-pages','https://github.com/alebo/practice-room.git',checkout]);
  // Replace generated files, preserving only Git history. Never force-push.
  for(const entry of await readdir(checkout)) if(entry!=='.git') await rm(path.join(checkout,entry),{recursive:true,force:true});
  await cp(path.join(root,'dist'),checkout,{recursive:true});
  run('git',['add','.'],checkout);
  const changes=execFileSync('git',['status','--porcelain'],{cwd:checkout,encoding:'utf8'}).trim();
  if(changes) {
    run('git',['commit','-m','Publish exercise sets'],checkout);
    run('git',[...git,'push','origin','gh-pages'],checkout);
  } else console.log('Published files already match this build.');
} finally {await rm(checkout,{recursive:true,force:true});}
console.log('GitHub Pages: https://alebo.github.io/practice-room/');
console.log('Check deployment completion with: gh run list --repo alebo/practice-room --branch gh-pages');
