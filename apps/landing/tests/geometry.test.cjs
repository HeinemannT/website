const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const between=(a,b)=>source.slice(source.indexOf(a),source.indexOf(b,source.indexOf(a)));
const c={Math,reduced:{matches:false},glReady:true,progress:0,H:844,sheet:{left:16,top:32,width:360,height:480},centers:[.337,.497,.765],clamp:(v,a,b)=>Math.max(a,Math.min(b,v)),lerp:(a,b,t)=>a+(b-a)*t,ease:t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t)}};
vm.createContext(c);vm.runInContext(between('class Reflections{','const pulls=new Reflections();')+'\nthis.Model=Reflections;',c);c.pulls=new c.Model();
vm.runInContext(between('function reflectionShift(', 'function handPath(')+between('function drawingResolution(', 'function resize('),c);
c.pulls.links=[{a:0,b:1,x:.514,y:1.28,rest:0,weight:.5},{a:1,b:2,x:.642,y:2.18,rest:0,weight:.5}];
for(const [width,height] of [[320,568],[390,844],[844,390],[1440,900],[3840,2160],[7680,4320]]){
 c.H=height;c.sheet={left:24,top:31,width:Math.min(width*.92,height*.645),height:Math.min(width*.92,height*.645)*4/3};
 for(const ratio of [1,1.25,2,3]){const r=c.drawingResolution(width,height,ratio);assert.ok(width*height*r*r<=4_000_000+1e-6,'Fine canvas memory remains bounded');assert.ok(r<=ratio&&r<=2)}
 for(const p of [0,.8,1.3,1.8,2.15])for(const pos of [[0,0,0],[-.012,.018,.009],[.024,-.014,.021]]){
  c.progress=p;c.pulls.position=pos;
  for(const link of c.pulls.links){const a=c.linePoint([link.x,link.y],link.a),b=c.linePoint([link.x,link.y],link.b);assert.ok(Math.hypot(a[0]-b[0],a[1]-b[1])<1e-7,'Shared thread crossing remains a single point at every viewport and scroll position')}
  const step=1e-6,a=c.linePoint([.5,1-step],0),b=c.linePoint([.5,1],0),d=c.linePoint([.5,1+step],0);
  assert.ok(Math.hypot(d[0]-a[0],d[1]-a[1])<.03,'No jump at the image edge');
  assert.ok(Math.abs((b[1]-a[1])-(d[1]-b[1]))/step<.15,'Vertical scale changes smoothly at the image edge');
  const ref=c.linePoint([.514,1.28],0);c.sheet.top-=73;const moved=c.linePoint([.514,1.28],0);c.sheet.top+=73;assert.ok(Math.abs(ref[1]-moved[1]-73)<1e-7,'All parts share the same sheet translation');
 }
}
c.glReady=false;for(const x of [.1,.5,.9])assert.equal(c.reflectionShift(x,.8),0,'Fallback image and threads agree when WebGL is unavailable');
for(const height of [568,844,900]){
 c.H=height;c.sheet={left:16,width:360,height:480,top:0};
 let previous=-Infinity;
 for(const p of [1.9,2,2.1,2.2]){
  c.progress=p;c.sheet.top=32-p*height*.72;
  const y=c.linePoint([.514,1.28],0)[1];
  assert.ok(y>previous,'Released marks visibly fall against upward scrolling');previous=y;
 }
}
c.reduced.matches=true;
assert.equal(c.linePoint([.514,1.28],0)[1],c.linePoint([.514,1.28],0,false)[1],'Reduced motion retains the quiet sheet descent');
console.log('Passed: shared crossings, continuous scale at image join, shared translation, bounded canvas resolution, and WebGL fallback.');
