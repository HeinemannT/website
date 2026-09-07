import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
const dist=new URL('./dist/',import.meta.url);
export function createPreviewServer(){
 return createServer(async (request,response)=>{
  response.setHeader('X-Content-Type-Options','nosniff');
  response.setHeader('Referrer-Policy','strict-origin-when-cross-origin');
  if(request.method!=='GET'&&request.method!=='HEAD'){response.writeHead(405,{'Allow':'GET, HEAD'});response.end();return}
  let pathname;try{pathname=new URL(request.url,'http://127.0.0.1').pathname}catch{response.writeHead(400);response.end();return}
  if(pathname==='/favicon.ico'){response.writeHead(204);response.end();return}
  const isAsset=/^\/assets\/(?:lake|scene|reading)-[a-f0-9]{12}\.(?:png|js|css)$/.test(pathname);
  const isPost=/^\/gedanken\/[a-z0-9-]+\.html$/.test(pathname);
  const isFont=/^\/fonts\/(?:satoshi(?:-italic)?\.woff2|Satoshi-FFL\.txt)$/.test(pathname);
  if(pathname!=='/'&&pathname!=='/gedanken.html'&&pathname!=='/ich.html'&&!isPost&&!isAsset&&!isFont){response.writeHead(404);response.end();return}
  const file=new URL(pathname==='/'?'index.html':pathname.slice(1),dist);
  try{
   const info=await stat(file),ext=pathname.split('.').pop();
   const etag=`"${isAsset?pathname.split('/').pop():info.size+'-'+info.mtimeMs}"`;
   response.setHeader('Content-Type',isFont?(ext==='woff2'?'font/woff2':'text/plain; charset=utf-8'):isAsset?({png:'image/png',js:'text/javascript; charset=utf-8',css:'text/css; charset=utf-8'}[ext]):'text/html; charset=utf-8');
   response.setHeader('Cache-Control',isAsset?'public, max-age=31536000, immutable':'no-cache');
   response.setHeader('ETag',etag);
   if(request.headers['if-none-match']===etag){response.writeHead(304);response.end();return}
   response.setHeader('Content-Length',info.size);
   if(request.method==='HEAD'){response.writeHead(200);response.end();return}
   const stream=createReadStream(file);stream.on('error',()=>response.destroy());stream.pipe(response);
  }catch(error){response.writeHead(error.code==='ENOENT'?404:500);response.end()}
 });
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 createPreviewServer().listen(5189,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:5189/'));
}
