import { readFile, readdir, lstat, mkdir, copyFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateQuiz } from '../../app/quiz.js';
export const root = fileURLToPath(new URL('../../', import.meta.url));
export function slug(value, label = 'identifier') {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value || '')) throw new Error(`Invalid ${label}: use lowercase English letters, digits and hyphens.`);
  return value;
}
export function testId(value) {
  slug(value, 'test');
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*-\d{4}-(?:0[1-9]|1[0-2])(?:-[a-z0-9]+)*$/.test(value)) throw new Error('Test ID must include a year-month suffix, for example biology-grade-8-2026-11.');
  return value;
}
export function latestTests(sets) {
  const latest = new Map();
  for (const item of [...sets].sort((a,b) => a.test.localeCompare(b.test,'en',{numeric:true}) || a.set.localeCompare(b.set,'en',{numeric:true}))) latest.set(item.test,item);
  return [...latest.values()].sort((a,b)=>a.metadata.title.localeCompare(b.metadata.title,'de') || b.test.localeCompare(a.test,'en',{numeric:true}));
}
export async function readJSON(file) { return JSON.parse(await readFile(file, 'utf8')); }
export async function loadSet(test, set) {
  testId(test); slug(set, 'set');
  const directory = path.join(root, 'content/tests', test, 'sets', set);
  const metadata = await readJSON(path.join(root, 'content/tests', test, 'test.json'));
  if (metadata.id !== test || !metadata.title || !metadata.subject || !/^\d{4}-(0[1-9]|1[0-2])$/.test(metadata.month) || !test.startsWith(`${metadata.subject}-${metadata.month}`)) throw new Error(`Invalid test metadata: ${test}`);
  const quiz = await readJSON(path.join(directory, 'quiz.json'));
  validateQuiz(quiz);
  if (!quiz.id || !Number.isInteger(quiz.version) || quiz.version < 1 || !quiz.title || !quiz.label || !quiz.language) throw new Error(`Missing quiz metadata in ${test}/${set}`);
  for (const q of quiz.questions) {
    if (q.skills && (!Array.isArray(q.skills) || q.skills.some(s => typeof s !== 'string' || !s.trim()))) throw new Error(`Invalid skills on ${q.id}`);
    if (q.image && (!/^\.\/assets\/[a-zA-Z0-9/_-]+\.(svg|png|jpe?g|gif|webp|avif)$/.test(q.image.src) || !q.image.alt)) throw new Error(`Use a relative image asset and alt text on ${q.id}`);
    if (q.image) {
      const info = await lstat(path.join(directory, q.image.src));
      if (!info.isFile() || info.isSymbolicLink()) throw new Error(`Image must be a regular file: ${q.image.src}`);
    }
    if (q.mermaid && !q.diagramDescription) throw new Error(`Missing diagram description on ${q.id}`);
  }
  return { test, set, directory, quiz, metadata };
}
export async function listSets() {
  const sets = [];
  for (const test of (await readdir(path.join(root, 'content/tests'), { withFileTypes: true })).filter(d => d.isDirectory()).sort((a,b)=>a.name.localeCompare(b.name))) {
    testId(test.name);
    // Source preparation may precede the first exercise and its metadata.
    try { await lstat(path.join(root, 'content/tests', test.name, 'test.json')); } catch (error) { if (error.code === 'ENOENT') continue; throw error; }
    for (const set of (await readdir(path.join(root, 'content/tests', test.name, 'sets'), { withFileTypes: true })).filter(d => d.isDirectory()).sort((a,b)=>a.name.localeCompare(b.name))) {
      sets.push(await loadSet(test.name, set.name));
    }
  }
  const ids = sets.map(s=>s.quiz.id);
  if (new Set(ids).size !== ids.length) throw new Error('Each exercise set needs a globally unique quiz ID.');
  return sets;
}
export async function copyImages(source, destination) {
  let entries;
  try { entries = await readdir(source, { withFileTypes: true }); } catch (error) { if (error.code === 'ENOENT') return; throw error; }
  for (const entry of entries) {
    if (entry.isSymbolicLink()) throw new Error(`Asset symlinks are not supported: ${entry.name}`);
    if (entry.isDirectory()) await copyImages(path.join(source,entry.name),path.join(destination,entry.name));
    else if (/\.(svg|png|jpe?g|gif|webp|avif)$/i.test(entry.name)) {
      await mkdir(destination,{recursive:true});
      await copyFile(path.join(source,entry.name),path.join(destination,entry.name));
    }
  }
}

export function testLabel(item) {
  const suffix = item.test.slice(`${item.metadata.subject}-${item.metadata.month}`.length);
  return `${item.metadata.title} · ${item.metadata.month}${suffix ? ` · ${suffix.slice(1)}` : ''}`;
}
