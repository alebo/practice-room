import { isCorrect, isFRQ } from '../../app/quiz.js';
const escapeRegex = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
function optionIds(text, options) {
  const solutions=[];
  function visit(rest, ids) {
    if(solutions.length>1) return;
    if(!rest) {solutions.push(ids);return;}
    for(const option of options) {
      if(ids.includes(option.id)) continue;
      if(rest===option.text) visit('',[...ids,option.id]);
      else if(rest.startsWith(option.text+'; ')) visit(rest.slice(option.text.length+2),[...ids,option.id]);
    }
  }
  visit(text,[]);
  if(solutions.length!==1) throw new Error('Cannot unambiguously match reported options to this quiz version.');
  return solutions[0];
}
export function parseReport(raw, quiz) {
  const text=raw.replace(/\r\n/g,'\n');
  if(!text.startsWith(`${quiz.label}\nTest: ${quiz.title}\nTestversion: ${quiz.version}\n`)) throw new Error('Report title, label, or version does not match the selected exercise. Use its original quiz version.');
  const starts=[];
  for(const q of quiz.questions) {
    const matches=[...text.matchAll(new RegExp(`^\\d+\\. ${escapeRegex(q.prompt)}$`,'gm'))];
    if(matches.length!==1) throw new Error(`Missing or ambiguous question in report: ${q.id}`);
    starts.push({q,index:matches[0].index,bodyStart:matches[0].index+matches[0][0].length+1});
  }
  starts.sort((a,b)=>a.index-b.index);
  const answers={};
  starts.forEach(({q,bodyStart},index)=>{
    let block=text.slice(bodyStart,starts[index+1]?.index ?? text.length).trimEnd();
    if(isFRQ(q)) {
      const marker=block.startsWith('Antwort:\n') ? 0 : block.indexOf('\nAntwort:\n')+1;
      if(marker<0 || !block.slice(marker).startsWith('Antwort:\n')) throw new Error(`Missing response field: ${q.id}`);
      const response=block.slice(marker+'Antwort:\n'.length);
      answers[q.id]={type:'frq',text:response==='Nicht beantwortet'?'':response,assessment:'unreviewed'};
    } else {
      block=block.split('\nFREIE ANTWORTEN –')[0].trimEnd();
      const match=block.match(/(?:^|\n)Ergebnis: (Richtig|Falsch|Nicht beantwortet)\nGewählt: ([\s\S]*?)\nRichtig: ([\s\S]+)$/);
      if(!match) throw new Error(`Missing MCQ fields: ${q.id}`);
      const selected=optionIds(match[2],q.options), key=optionIds(match[3],q.options);
      if(!isCorrect(q,key)) throw new Error(`Answer key mismatch: ${q.id}`);
      if ((match[1]==='Nicht beantwortet') !== (selected.length===0)) throw new Error(`Unanswered status disagrees with selected answers: ${q.id}`);
      const correct=isCorrect(q,selected);
      if(correct!==(match[1]==='Richtig')) throw new Error(`Reported score disagrees with selected answers: ${q.id}`);
      answers[q.id]={type:'mcq',selected,correct};
    }
  });
  return answers;
}
export function summarizeEvidence(attempts) {
  const skills=new Map();
  for(const {attempt,review} of attempts) {
    for(const q of attempt.quiz.questions) {
      const answer=attempt.answers[q.id];
      if(!answer) continue;
      const manual=review.questions?.[q.id];
      const assessment=isFRQ(q) ? manual?.assessment || 'unreviewed' : answer.correct ? 'correct' : 'incorrect';
      if(!['unreviewed','correct','partial','incorrect'].includes(assessment)) throw new Error(`Invalid review assessment for ${q.id}`);
      const evidence={attemptId:attempt.id,test:attempt.test,set:attempt.set,quizVersion:attempt.quiz.version,questionId:q.id,prompt:q.prompt,assessment,importedAt:attempt.importedAt,provenance:attempt.provenance || {kind:'copied-report'},notes:manual?.notes || ''};
      if(isFRQ(q)) evidence.response=answer.text;
      else {
        evidence.unanswered=answer.selected.length===0;
        evidence.selected=answer.selected;
        evidence.missedCorrect=q.correct.filter(id=>!answer.selected.includes(id)).map(id=>q.options.find(o=>o.id===id).text);
        evidence.selectedIncorrect=answer.selected.filter(id=>!q.correct.includes(id)).map(id=>q.options.find(o=>o.id===id).text);
      }
      for(const skill of q.skills?.length ? q.skills : [q.topic || 'unclassified']) {
        if(!skills.has(skill)) skills.set(skill,{skill,correct:0,incorrect:0,partial:0,unreviewed:0,evidence:[]});
        const item=skills.get(skill);item[assessment]++;item.evidence.push(evidence);
      }
    }
  }
  return { generatedAt:new Date().toISOString(), interpretation:'Observed answers only. Unreviewed FRQs are not knowledge gaps. Evidence includes dates and attempts; repeated attempts are not independent measurements.', skills:[...skills.values()].sort((a,b)=>(b.incorrect+b.partial)-(a.incorrect+a.partial) || a.skill.localeCompare(b.skill)) };
}
