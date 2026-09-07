const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const code=fs.readFileSync(require('node:path').join(__dirname,'../spatial-city.js'),'utf8');
const context={Math};vm.createContext(context);vm.runInContext(code,context);
const {camera,project,vertices,clipNear,faceIds,splitPolygon,depthOrder}=context.CityCamera;
const edgeCounts=new Map();
for(const ids of faceIds)for(let i=0;i<ids.length;i++){
 const key=[ids[i],ids[(i+1)%ids.length]].sort().join('/');edgeCounts.set(key,(edgeCounts.get(key)||0)+1);
}
assert.equal(faceIds.length,6,'Slabs include their undersides');
assert.ok([...edgeCounts.values()].every(n=>n===2),'Every solid edge is shared by exactly two faces');
const textured={vertices:[[-2,-1,0,0,0],[2,-1,0,1,0],[2,1,0,1,1],[-2,1,0,0,1]]};
const split=splitPolygon(textured,[1,0,0],0);
for(const p of [...split.front.vertices,...split.back.vertices])if(p[0]===0)assert.equal(p[3],.5,'Cuts interpolate UVs instead of stretching a whole texture');
const near={eye:[0,0,0],forward:[0,0,1]};
const cut=clipNear([[0,0,4,0,0],[10,0,12,1,0],[10,10,12,1,1],[0,10,4,0,1]],near);
assert.equal(cut.length,4,'A partly visible plate survives camera clipping');
for(const p of cut){assert.ok(p[2]>=8);if(p[2]===8)assert.equal(p[3],.5)}
// Two intersecting slabs reverse their occlusion across the image. A single
// average depth cannot satisfy both sides; geometric splitting must do so.
const crossing=[{id:'a',vertices:[[-2,-1,-2],[2,-1,2],[2,1,2],[-2,1,-2]]},{id:'b',vertices:[[-2,-1,2],[2,-1,-2],[2,1,-2],[-2,1,2]]}];
const ordered=depthOrder(crossing,[0,0,10]);
assert.ok(ordered.length>2,'Intersecting faces are split at their common plane');
for(const x of [-1,1]){
 const covers=ordered.filter(p=>Math.min(...p.vertices.map(v=>v[0]))<x&&Math.max(...p.vertices.map(v=>v[0]))>x);
 assert.equal(covers.at(-1).id,x<0?'b':'a','The nearer slab paints last on each side of the intersection');
}
const solids=[{x:8,y:215,w:177,d:80,h:67},{x:205,y:38,w:49,d:64,h:158},{x:22,y:24,w:118,d:68,h:108},{x:280,y:266,w:101,d:58,h:49}];
for(const [width,height] of [[320,568],[390,844],[844,390],[1440,900],[3840,2160]]){
 const view={s:Math.min(width/700,height/600),x:width/2,y:height/2};
 const start=camera(width,height,view,0);
 for(const b of solids)for(const p of vertices(b)){
  const actual=project(p,start),expected=[(p[0]-p[1])*.86*view.s+view.x,((p[0]+p[1])*.4-p[2])*view.s+view.y];
  assert.ok(Math.hypot(actual[0]-expected[0],actual[1]-expected[1])<.001,'The spatial camera begins at the exact existing projection');
  for(let t=0;t<=1;t+=.025){
   const q=project(p,camera(width,height,view,t));assert.ok(q.every(Number.isFinite));assert.ok(q[2]>8,'Core solids do not cross the near plane during descent');
   const next=project(p,camera(width,height,view,Math.min(1,t+.0001)));
   assert.ok(Math.hypot(q[0]-next[0],q[1]-next[1])<width*.01,'No discontinuity along the camera path');
  }
 }
 const end=camera(width,height,view,1);assert.equal(end.eye[2],24,'Arrival is at human height relative to the tower');
 const street=clipNear([[188,570,0],[276,570,0],[276,238,0],[188,238,0]],end);
 assert.ok(street.length>=3,'The street remains visible when its near end passes the camera');
 for(const p of street){assert.equal(p[2],0,'Clipping keeps street vertices on the ground plane');assert.ok(project(p,end).every(Number.isFinite))}
 const door=project([229,102,14],camera(width,height,view,1,1));
 assert.ok(Math.abs(door[0]-width*.5)<.001&&Math.abs(door[1]-height*.56)<.001,'Tower entrance ends at the center of the approach');
}
// Rendering an unchanged frame must not repaint any textures or surfaces.
let draws=0,paints=0,partBuilds=0;
const ctx=new Proxy({globalAlpha:1,createLinearGradient:()=>({addColorStop(){}})},{get:(o,k)=>k in o?o[k]:()=>{draws++}});
context.document={createElement:()=>({width:0,height:0,getContext:()=>ctx})};
const scene=new context.SpatialCity({canvas:{width:0,height:0,getContext:()=>ctx},blocks:solids,district:[],parts:b=>{partBuilds++;return [b]},structure:b=>vertices(b),paintFace:()=>paints++});
const frame={width:640,height:800,ratio:1,view:{s:.8,x:320,y:350},travel:.6};
scene.render(frame);const firstDraws=draws,firstPaints=paints;
assert.ok(firstPaints>0&&firstDraws>0);
scene.render(frame);assert.equal(draws,firstDraws,'Static courtyard does not repaint');
scene.render({...frame,travel:.61});assert.equal(paints,firstPaints,'Camera movement reuses surface textures');
scene.render({...frame,view:{...frame.view,y:360}});assert.ok(draws>firstDraws,'The arrival projection invalidates the paint cache');
assert.equal(partBuilds,solids.length,'Camera movement reuses authored geometry instead of rebuilding it');
for(const texture of scene.cache.values())assert.ok(texture.canvas.width<=256&&texture.canvas.height<=256,'Surface textures have a fixed resolution budget');
// Exercise the real district and baked structural poses as well as isolated cuts.
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const between=(a,b)=>html.slice(html.indexOf(a),html.indexOf(b,html.indexOf(a)));
vm.runInContext(fs.readFileSync(require('node:path').join(__dirname,'../collapse.js'),'utf8'),context);
vm.runInContext(between('const blocks=[','const cityState=')+between('function buildingParts(','function partFaces(')+between('const districtPlans=[','let districtCache=')+'\nthis.spec={blocks,district:districtPlans,parts:buildingParts};this.model=new CollapseModel(buildingParts(blocks[2]),[blocks[1]]);',context);
let drawCalls=0;
const renderCtx=new Proxy({globalAlpha:1},{get:(o,k)=>k in o?o[k]:(...args)=>{if(k==='drawImage')drawCalls++;for(const arg of args)if(typeof arg==='number')assert.ok(Number.isFinite(arg),'Clipped geometry must not send NaN or Infinity to Canvas')}});
const full=new context.SpatialCity({...context.spec,canvas:{width:0,height:0,getContext:()=>renderCtx},structure:(part,p)=>context.model.vertices(part,p),paintFace:()=>{}});
const started=performance.now();
for(const travel of [0,.65,1])for(const collapse of [0,.12,.3,.55,1]){
 drawCalls=0;full.render({...frame,travel,collapse});
 assert.ok(drawCalls<6000,'Polygon splitting keeps the complete district within a bounded drawing workload');
 if(travel===0)assert.ok(drawCalls<500,'The overhead view does not pay for unnecessary perspective subdivision');
}
console.log(`Full district geometry: ${((performance.now()-started)/15).toFixed(1)} ms/frame in the Node VM (Canvas rasterization excluded).`);
console.log('Passed: exact initial projection, continuous descent across screen sizes, near-plane safety, centered entrance, texture reuse, and idle rendering.');
