import { parseArgs } from 'node:util';
import { mkdir, writeFile, access } from 'node:fs/promises';
import path from 'node:path';
import { root, slug, listSets, loadSet } from './lib/content.mjs';
const action=process.argv[2];
const { values }=parseArgs({args:process.argv.slice(3),options:{test:{type:'string'},set:{type:'string'},title:{type:'string'}}});
if(action==='list') {
  for(const s of await listSets()) console.log(`${s.test}/${s.set}  v${s.quiz.version}  ${s.quiz.questions.length} questions  ${s.quiz.title}`);
} else if(action==='activate') {
  await loadSet(values.test,values.set);
  await writeFile(path.join(root,'content/active-set.json'),JSON.stringify({test:values.test,set:values.set},null,2)+'\n');
  console.log('Default set updated. Build to preview; publish to change the live site.');
} else if(action==='new') {
  const test=slug(values.test,'test'),set=slug(values.set,'set');
  if(!values.title) throw new Error('--title is required.');
  const directory=path.join(root,'content/tests',test,'sets',set);
  await mkdir(directory,{recursive:true});
  const quiz={id:`${test}-${set}`,version:1,language:'de',title:values.title,subtitle:'Wähle alle passenden Antworten.',label:`Übung · ${set}`,questions:[{id:`${set}-question-1`,type:'mcq',topic:'Thema ergänzen',skills:[],prompt:'Frage ergänzen',options:[{id:'a',text:'Antwort ergänzen'},{id:'b',text:'Alternative ergänzen'}],correct:['a'],explanation:'Erklärung ergänzen'}]};
  await writeFile(path.join(directory,'quiz.json'),JSON.stringify(quiz,null,2)+'\n',{flag:'wx'});
  const metadata=path.join(root,'content/tests',test,'test.json');
  try {await access(metadata);} catch {await writeFile(metadata,JSON.stringify({id:test,title:test,language:'de'},null,2)+'\n',{flag:'wx'});}
  console.log(`Created ${path.relative(root,directory)}/quiz.json. Replace placeholder content before publishing.`);
} else throw new Error('Usage: sets.mjs list | new --test ID --set ID --title TEXT | activate --test ID --set ID');
