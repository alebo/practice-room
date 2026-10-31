import test, { mock } from 'node:test';
import assert from 'node:assert/strict';
import { encodeKey, decodeKey, encryptReport, decryptReport, parseShareURL, createShare, fetchSharedReport } from '../app/privatebin.js';
const report='Testbericht: äöü 日本語\nKeine echten Antworten.';
test('PrivateBin base58 keys preserve leading zero bytes',()=>{
  for(const bytes of [new Uint8Array(32),Uint8Array.from({length:32},(_,i)=>i),crypto.getRandomValues(new Uint8Array(32))]) assert.deepEqual(decodeKey(encodeKey(bytes)),bytes);
  assert.throws(()=>decodeKey('bad'),/Invalid/);
});
test('authenticated encryption round-trips Unicode without leaking report or key',async()=>{
  const encrypted=await encryptReport(report);
  assert.equal(encrypted.payload.v,2);
  assert.deepEqual(encrypted.payload.adata.slice(1),['plaintext',0,0]);
  assert.equal(encrypted.payload.meta.expire,'3day');
  assert.ok(!JSON.stringify(encrypted.payload).includes(report));
  assert.ok(!JSON.stringify(encrypted.payload).includes(encrypted.key));
  assert.equal(await decryptReport(encrypted.payload,encrypted.key),report);
});
test('wrong keys and modified authenticated settings are rejected',async()=>{
  const encrypted=await encryptReport(report);
  await assert.rejects(()=>decryptReport(encrypted.payload,encodeKey(crypto.getRandomValues(new Uint8Array(32)))),/Unable to decrypt/);
  const altered=structuredClone(encrypted.payload);altered.adata[2]=1;
  await assert.rejects(()=>decryptReport(altered,encrypted.key),/Unable to decrypt/);
  const invalid=structuredClone(encrypted.payload);invalid.adata[0][2]=1e9;
  await assert.rejects(()=>decryptReport(invalid,encrypted.key),/Unsupported/);
});
test('import URLs are restricted to the approved HTTPS host and full fragment key',()=>{
  const key=encodeKey(crypto.getRandomValues(new Uint8Array(32)));
  const valid=`https://privatebin.net/?0123456789abcdef#${key}`;
  assert.equal(parseShareURL(valid).endpoint,'https://privatebin.net/?0123456789abcdef');
  assert.equal(parseShareURL(valid).key,key);
  for(const link of [valid.replace('https:','http:'),valid.replace('privatebin.net','localhost'),valid.replace('privatebin.net','privatebin.net.evil.example'),valid.split('#')[0],valid.replace('privatebin.net','user:pass@privatebin.net'),valid.replace('/?','/other?')]) assert.throws(()=>parseShareURL(link));
});
test('browser upload sends ciphertext only and returns a shareable link',async()=>{
  let sent;
  const mocked=mock.method(globalThis,'fetch',async(url,options)=>{
    assert.equal(url,'https://privatebin.net/');assert.equal(options.credentials,'omit');
    sent=JSON.parse(options.body);
    return new Response(JSON.stringify({status:0,id:'0123456789abcdef'}));
  });
  try {
    const shared=await createShare(report);
    const parsed=parseShareURL(shared.url);
    assert.equal(await decryptReport(sent,parsed.key),report);
    assert.ok(shared.expiresAt>shared.createdAt);
  } finally {mocked.mock.restore();}
});
test('import fetch omits the decryption key and records no key in provenance',async()=>{
  const encrypted=await encryptReport(report);
  const mocked=mock.method(globalThis,'fetch',async(url)=>{
    assert.equal(url,'https://privatebin.net/?0123456789abcdef');
    assert.ok(!url.includes(encrypted.key));
    return new Response(JSON.stringify({status:0,...encrypted.payload}));
  });
  try {
    const result=await fetchSharedReport(`https://privatebin.net/?0123456789abcdef#${encrypted.key}`);
    assert.equal(result.report,report);
    assert.ok(!JSON.stringify(result.provenance).includes(encrypted.key));
  } finally {mocked.mock.restore();}
});
test('oversized reports and rate limits fail without pretending to create a link',async()=>{
  await assert.rejects(()=>encryptReport('a'.repeat(512*1024+1)),/exceeds/);
  const mocked=mock.method(globalThis,'fetch',async()=>new Response(JSON.stringify({status:1,message:'Please wait 60 seconds between each post.'})));
  try {await assert.rejects(()=>createShare(report),{name:'RateLimitError'});} finally {mocked.mock.restore();}
});
