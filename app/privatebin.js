// PrivateBin v2 protocol: https://github.com/PrivateBin/PrivateBin/wiki/Encryption-format
// Only ciphertext leaves the browser. The secret key stays in the URL fragment.
export const PRIVATEBIN_ORIGIN = 'https://privatebin.net';
export const SHARE_LIFETIME = 3 * 24 * 60 * 60 * 1000;
const alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
const encoder = new TextEncoder();
const decoder = new TextDecoder('utf-8', { fatal: true });
const MAX_REPORT_BYTES = 512 * 1024;
const MAX_RESPONSE_BYTES = 2 * 1024 * 1024;
function toBase64(bytes) {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}
function fromBase64(text) {
  if (typeof text !== 'string' || text.length > MAX_RESPONSE_BYTES) throw new Error('Invalid encoded data.');
  return Uint8Array.from(atob(text), c => c.charCodeAt(0));
}
export function encodeKey(bytes) {
  let value = 0n;
  for (const byte of bytes) value = value * 256n + BigInt(byte);
  let result = '';
  while (value) { result = alphabet[Number(value % 58n)] + result; value /= 58n; }
  for (const byte of bytes) { if (byte !== 0) break; result = '1' + result; }
  return result;
}
export function decodeKey(text) {
  if (typeof text !== 'string' || text.length < 32 || text.length > 44) throw new Error('Invalid PrivateBin key.');
  let value = 0n;
  for (const c of text) {
    const digit = alphabet.indexOf(c);
    if (digit < 0) throw new Error('Invalid PrivateBin key.');
    value = value * 58n + BigInt(digit);
  }
  const bytes = [];
  while (value) { bytes.unshift(Number(value % 256n)); value /= 256n; }
  for (const c of text) { if (c !== '1') break; bytes.unshift(0); }
  if (bytes.length !== 32) throw new Error('Invalid PrivateBin key length.');
  return new Uint8Array(bytes);
}
async function deriveKey(keyBytes, salt, iterations, usage) {
  const material = await crypto.subtle.importKey('raw', keyBytes, 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations,hash:'SHA-256'},material,{name:'AES-GCM',length:256},false,[usage]);
}
export async function encryptReport(report, expiration = '3day') {
  if (typeof report !== 'string' || !report || encoder.encode(report).length > MAX_REPORT_BYTES) throw new Error('Report is empty or exceeds 512 KiB.');
  const keyBytes = crypto.getRandomValues(new Uint8Array(32));
  const iv = crypto.getRandomValues(new Uint8Array(16));
  const salt = crypto.getRandomValues(new Uint8Array(8));
  const adata = [[toBase64(iv),toBase64(salt),100000,256,128,'aes','gcm','none'],'plaintext',0,0];
  const key = await deriveKey(keyBytes,salt,100000,'encrypt');
  const ciphertext = await crypto.subtle.encrypt({name:'AES-GCM',iv,additionalData:encoder.encode(JSON.stringify(adata)),tagLength:128},key,encoder.encode(JSON.stringify({paste:report})));
  return { key:encodeKey(keyBytes), payload:{v:2,adata,ct:toBase64(new Uint8Array(ciphertext)),meta:{expire:expiration}} };
}
async function readBounded(stream, limit) {
  if (!stream) throw new Error('Empty response.');
  const reader = stream.getReader();
  const chunks = []; let length = 0;
  try {
    while (true) {
      const {done,value} = await reader.read();
      if (done) break;
      length += value.length;
      if (length > limit) { await reader.cancel(); throw new Error('Response exceeds size limit.'); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const result = new Uint8Array(length); let offset = 0;
  for (const chunk of chunks) { result.set(chunk,offset); offset += chunk.length; }
  return result;
}
export async function decryptReport(payload, encodedKey) {
  const adata = payload?.adata;
  const spec = adata?.[0];
  if (payload?.v !== 2 || !Array.isArray(adata) || adata.length !== 4 || !Array.isArray(spec) || spec.length !== 8) throw new Error('Unsupported PrivateBin format.');
  const [ivText,saltText,iterations,bits,tag,algorithm,mode,compression] = spec;
  if (!Number.isInteger(iterations) || iterations < 10000 || iterations > 1000000 || bits !== 256 || tag !== 128 || algorithm !== 'aes' || mode !== 'gcm' || !['none','zlib'].includes(compression)) throw new Error('Unsupported PrivateBin encryption settings.');
  const iv = fromBase64(ivText), salt = fromBase64(saltText);
  if (iv.length !== 16 || salt.length !== 8) throw new Error('Invalid PrivateBin encryption parameters.');
  const key = await deriveKey(decodeKey(encodedKey),salt,iterations,'decrypt');
  let data;
  try {
    data = new Uint8Array(await crypto.subtle.decrypt({name:'AES-GCM',iv,additionalData:encoder.encode(JSON.stringify(adata)),tagLength:128},key,fromBase64(payload.ct)));
  } catch { throw new Error('Unable to decrypt: the link key is incorrect, a password is required, or the paste was altered.'); }
  if (compression === 'zlib') data = await readBounded(new Blob([data]).stream().pipeThrough(new DecompressionStream('deflate')),MAX_RESPONSE_BYTES);
  const plain = JSON.parse(decoder.decode(data));
  if (typeof plain.paste !== 'string' || encoder.encode(plain.paste).length > MAX_REPORT_BYTES) throw new Error('Paste does not contain a supported result report.');
  return plain.paste;
}
export function parseShareURL(value) {
  let url;
  try { url = new URL(value); } catch { throw new Error('Invalid PrivateBin link.'); }
  if (url.origin !== PRIVATEBIN_ORIGIN || url.username || url.password || url.pathname !== '/' || !/^\?[a-f0-9]{16}$/.test(url.search)) throw new Error('Use a complete privatebin.net result link.');
  const key = url.hash.replace(/^#-?/, '');
  decodeKey(key);
  return { endpoint:`${PRIVATEBIN_ORIGIN}/${url.search}`, id:url.search.slice(1), key };
}
async function requestJSON(url, options = {}) {
  const response = await fetch(url,{credentials:'omit',redirect:'error',referrerPolicy:'no-referrer',signal:AbortSignal.timeout(20000),...options,headers:{'X-Requested-With':'JSONHttpRequest',...(options.headers || {})}});
  if (!response.ok) throw new Error(`PrivateBin request failed (HTTP ${response.status}).`);
  const body = JSON.parse(decoder.decode(await readBounded(response.body,MAX_RESPONSE_BYTES)));
  if (body.status !== 0) {
    const error = new Error('PrivateBin rejected the request or the paste is unavailable.');
    if (/wait.*seconds|too many|rate limit/i.test(body.message || '')) error.name = 'RateLimitError';
    throw error;
  }
  return body;
}
export async function createShare(report) {
  const encrypted = await encryptReport(report);
  const result = await requestJSON(`${PRIVATEBIN_ORIGIN}/`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(encrypted.payload)});
  if (!/^[a-f0-9]{16}$/.test(result.id)) throw new Error('Invalid paste ID returned by PrivateBin.');
  return {url:`${PRIVATEBIN_ORIGIN}/?${result.id}#${encrypted.key}`,createdAt:Date.now(),expiresAt:Date.now()+SHARE_LIFETIME};
}
export async function fetchSharedReport(url) {
  const parsed = parseShareURL(url);
  // Never send the URL fragment (decryption key) to the server.
  const payload = await requestJSON(parsed.endpoint);
  return {report:await decryptReport(payload,parsed.key),provenance:{kind:'privatebin',host:PRIVATEBIN_ORIGIN,pasteId:parsed.id}};
}
