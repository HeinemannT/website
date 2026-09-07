import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { createPreviewServer } from '../serve.mjs';
execFileSync(process.execPath,['build.mjs'],{cwd:new URL('../',import.meta.url)});
const html=await readFile(new URL('../dist/index.html',import.meta.url),'utf8');
assert.ok(Buffer.byteLength(html)<10_000,'HTML does not embed the two-megabyte drawing');
assert.ok(!html.includes('data:image'),'Artwork is independently cacheable');
const assets=[...html.matchAll(/(?:href|src)="(assets\/[^\"]+)"/g)].map(m=>m[1]);assert.equal(assets.length,3);
const server=createPreviewServer();await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const origin=`http://127.0.0.1:${server.address().port}`;
try{
 const page=await fetch(origin+'/?visit=test');assert.equal(page.status,200);assert.match(page.headers.get('content-type'),/text\/html/);
 assert.equal(page.headers.get('cache-control'),'no-cache');
 const thoughts=await fetch(origin+'/gedanken.html');assert.equal(thoughts.status,200);assert.match(thoughts.headers.get('content-type'),/text\/html/);
 assert.equal(thoughts.headers.get('cache-control'),'no-cache');
 for(const file of ['satoshi','satoshi-italic']){
  const font=await fetch(origin+'/fonts/'+file+'.woff2');assert.equal(font.status,200);
  assert.equal(font.headers.get('content-type'),'font/woff2');
  assert.equal(Buffer.from(await font.arrayBuffer()).subarray(0,4).toString(),'wOF2');
 }
 const index=await thoughts.text();assert.match(index,/Beispieltexte/);
 const about=await fetch(origin+'/ich.html');assert.equal(about.status,200);
 const aboutHTML=await about.text();assert.match(aboutHTML,/<h1[^>]*>Ich<\/h1>/);
 for(const body of [index,aboutHTML]){
  assert.match(body,/data-back href="\/"/,'Both independent pages return to the city without JavaScript');
  assert.ok(body.indexOf('class="back-bar"')<body.indexOf('<main>'),'Return navigation precedes page content');
  assert.doesNotMatch(body,/study-bar|IBM Plex|data-direction-link/);
  for(const match of body.matchAll(/(?:href|src)="(\/assets\/reading-[^\"]+)"/g)){
   const asset=await fetch(origin+match[1]);assert.equal(asset.status,200);
   assert.match(asset.headers.get('content-type'),match[1].endsWith('.css')?/text\/css/:/text\/javascript/);
  }
 }
 const postLinks=[...index.matchAll(/href="(gedanken\/[^\"]+\.html)"/g)].map(m=>m[1]);assert.equal(postLinks.length,3);
 for(const link of postLinks){
  const post=await fetch(origin+'/'+link);assert.equal(post.status,200);
  const body=await post.text();assert.equal((body.match(/<article>/g)||[]).length,1,'Each URL contains only its own post');
  assert.match(body,/data-back href="\/gedanken.html"/,'Direct arrivals have a native back path to the blog index');
 }
 for(const asset of assets){
  const response=await fetch(origin+'/'+asset);assert.equal(response.status,200);assert.match(response.headers.get('cache-control'),/immutable/);assert.equal(response.headers.get('x-content-type-options'),'nosniff');
  await response.arrayBuffer();
  const cached=await fetch(origin+'/'+asset,{headers:{'If-None-Match':response.headers.get('etag')}});assert.equal(cached.status,304,'Unchanged asset needs no new payload');
  const head=await fetch(origin+'/'+asset,{method:'HEAD'});assert.equal(head.status,200);assert.equal(await head.text(),'');
 }
 assert.equal((await fetch(origin+'/index.html/../../package.json')).status,404,'Source files are not served');
 assert.equal((await fetch(origin+'/',{method:'POST'})).status,405);
}finally{await new Promise(resolve=>server.close(resolve))}
console.log('Passed: small HTML, hashed assets, cache revalidation, MIME types, HEAD, query strings, and bounded file serving.');
