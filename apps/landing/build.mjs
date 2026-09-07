import { mkdir, readFile, writeFile, readdir, unlink } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import vm from 'node:vm';
const project=new URL('./',import.meta.url),dist=new URL('dist/',project),assets=new URL('assets/',dist);
let source=await readFile(new URL('index.html',project),'utf8');
const physics=await readFile(new URL('collapse.js',project),'utf8');
// The selected motion is already baked; no physics runs at build or page load.
const script=physics+'\n'+(await readFile(new URL('spatial-city.js',project),'utf8'))+'\n'+source.match(/<script>([\s\S]*?)<\/script>/)?.[1],css=source.match(/<style>([\s\S]*?)<\/style>/)?.[1];
source=source.replace('<script src="spatial-city.js"></script>','').replace('<script src="collapse.js"></script>','');
if(!script||!css)throw new Error('Missing scene script or styles');
new vm.Script(script);
const bytes=await readFile(new URL('assets/rough-lake.png',project));
if(!bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))throw new Error('Invalid pencil drawing');
if((source.match(/<img /g)||[]).length!==1||(source.match(/<section /g)||[]).length!==3)throw new Error('Three sections and one original drawing are required');
await mkdir(assets,{recursive:true});
const generated=[];
async function asset(name,ext,content){
 const hash=createHash('sha256').update(content).digest('hex').slice(0,12),filename=`${name}-${hash}.${ext}`;
 await writeFile(new URL(filename,assets),content);generated.push(filename);return `assets/${filename}`;
}
const image=await asset('lake','png',bytes),js=await asset('scene','js',script),style=await asset('scene','css',css);
source=source.replace('src="assets/rough-lake.png"',`src="${image}" fetchpriority="high" decoding="async"`)
 .replace(/<style>[\s\S]*?<\/style>/,`<link rel="stylesheet" href="${style}">`)
 .replace(/<script>[\s\S]*?<\/script>/,`<script src="${js}" defer></script>`);
await writeFile(new URL('index.html',dist),source);
const readingScript=await readFile(new URL('reading.js',project),'utf8');
new vm.Script(readingScript);
const readingStyle=await asset('reading','css',await readFile(new URL('reading.css',project)));
const readingJS=await asset('reading','js',readingScript);
const readingPage=html=>html.replace('href="/reading.css"',`href="/${readingStyle}"`).replace('src="/reading.js"',`src="/${readingJS}"`);
await mkdir(new URL('fonts/',dist),{recursive:true});
for(const file of ['satoshi.woff2','satoshi-italic.woff2','Satoshi-FFL.txt'])await writeFile(new URL('fonts/'+file,dist),await readFile(new URL('assets/fonts/'+file,project)));
for(const file of ['gedanken.html','ich.html'])await writeFile(new URL(file,dist),readingPage(await readFile(new URL(file,project),'utf8')));
await mkdir(new URL('gedanken/',dist),{recursive:true});
for(const file of await readdir(new URL('gedanken/',project))){
 if(!/^[a-z0-9-]+\.html$/.test(file))continue;
 const post=await readFile(new URL('gedanken/'+file,project),'utf8');
 await writeFile(new URL('gedanken/'+file,dist),readingPage(post));
}
// Only remove this builder's superseded, content-addressed files in dist/assets.
for(const file of await readdir(assets))if(/^(?:lake|scene|reading)-[a-f0-9]{12}\.(?:png|js|css)$/.test(file)&&!generated.includes(file))await unlink(new URL(file,assets));
console.log(`Built the city, separate Gedanken and Ich pages, and articles with shared reading assets. City HTML: ${Buffer.byteLength(source)} bytes.`);
