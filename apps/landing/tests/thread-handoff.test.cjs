const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const between=(a,b)=>source.slice(source.indexOf(a),source.indexOf(b,source.indexOf(a)));
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),ease=t=>{t=clamp(t,0,1);return t*t*(3-2*t)};
const c={Math,clamp,ease,noise:n=>{const x=Math.sin(n*127.1)*43758.5453;return x-Math.floor(x)},lerp:(a,b,t)=>a+(b-a)*t,collapseProgress:0,cityView:{s:1,x:0,y:0}};
vm.createContext(c);vm.runInContext(fs.readFileSync(require('node:path').join(__dirname,'../collapse.js'),'utf8'),c);
vm.runInContext(between('const blocks=[','const cityState=')+between('const inCityMode=','function silhouette(')+between('function structuralVertices(','function drawStructure(')+between('function threadTransition(','function drawLines(')+'\nthis.blocks=blocks;this.project=project;',c);
assert.equal(c.threadTransition(2.15).bright,1,'Threads become pale in the darkness');
assert.equal(c.threadTransition(2.16).erosion,0,'Falling marks stay intact through the first dark interval');
assert.ok(c.threadTransition(2.76).erosion>1-1e-10);
assert.equal(c.threadTransition(2.82).handoff,1,'Keep lines visible until the geometry has landed');
assert.equal(c.threadTransition(3.06).handoff,0,'No duplicate outlines remain as the camera starts descending');
for(let j=0;j<180;j++){
 assert.equal(c.threadRetention(0,j,0,false),1);
 assert.equal(c.threadRetention(0,j,1,false),0);
 for(let e=0;e<=1;e+=.025){
  assert.ok(c.threadRetention(0,j,e+.025,false)<=c.threadRetention(0,j,e,false),'Erased marks cannot flicker back during forward scroll');
  assert.equal(c.threadRetention(0,j,e,true),1,'Architectural fragments survive the material erasure');
 }
}
for(const [width,height] of [[320,568],[390,844],[844,390],[1440,900]]){
 c.cityView={s:Math.min(width/800,height/700),x:width/2,y:height/2};
 for(const collapsed of [0,1]){
  c.collapseProgress=collapsed;
  for(const {index:i,points} of c.buildingThreadRoutes()){
   const b=c.blocks[[0,2,1,3][i]],path=c.threadArchitecture(i);
   for(const p of points)assert.ok((p[0]===b.x||p[0]===b.x+b.w)&&(p[1]===b.y||p[1]===b.y+b.d)&&(p[2]===0||p[2]===b.h),'Every target point is a real building corner');
   for(let j=1;j<points.length;j++)assert.equal(points[j].filter((v,k)=>v!==points[j-1][k]).length,1,'Target paths follow physical building edges');
   for(const [t,expected] of [[0,c.project(...points[0])],[1,c.project(...points.at(-1))]]){
    const point=c.architecturePoint(path,t);
    assert.ok(Math.hypot(point[0]-(expected[0]*c.cityView.s+c.cityView.x),point[1]-(expected[1]*c.cityView.s+c.cityView.y))<1e-8,'The same stroke finishes on the city geometry');
   }
   for(let t=0;t<=1;t+=.01)assert.ok(c.architecturePoint(path,t).every(Number.isFinite));
  }
 }
}
// A single set of samples remains visible through catch and outline formation.
vm.runInContext(between('function handPath(','const sampledGestures='),c);
c.linePoint=([x,y])=>[x*300,y*500+c.offset];
const gesture={g:0,samples:c.handPath([[.3,.8],[.32,1.4],[.28,2.18],[.34,2.94]])};
c.offset=0;c.cityView={s:.8,x:320,y:400};
c.progress=2.4;
const landed=c.fallingThread(gesture,0),roof=c.architecturePoint(c.threadArchitecture(0),1);
assert.ok(Math.hypot(landed.points[landed.tip][0]-roof[0],landed.points[landed.tip][1]-roof[1])<1e-8,'The falling mark catches the roof before folding');
const before=gesture.samples.map(p=>c.linePoint(p));
for(let j=1;j<before.length;j++)assert.ok(Math.abs(Math.hypot(...before[j].map((v,k)=>v-before[j-1][k]))-Math.hypot(...landed.points[j].map((v,k)=>v-landed.points[j-1][k])))<1e-8,'Landing translates the authored stroke without deforming it');
for(const index of [0,2,3]){
 const path=c.threadArchitecture(index),anchor=c.architecturePoint(path,1);
 for(let p=2.5;p<=2.91;p+=.005){
  c.progress=p;const shape=c.fallingThread(gesture,index);
  assert.equal(shape.points.length,gesture.samples.length,'There is no replacement stroke during the transformation');
  assert.ok(Math.hypot(...shape.points[shape.tip].map((v,k)=>v-anchor[k]))<1e-8,'The landed tip stays pinned while the body changes into edges');
  c.progress=p+.00001;const next=c.fallingThread(gesture,index);
  for(let j=0;j<=shape.tip;j++)assert.ok(Math.hypot(...shape.points[j].map((v,k)=>v-next.points[j][k]))<.1,'Continuous scroll produces continuous geometry');
 }
 c.progress=2.9;const finished=c.fallingThread(gesture,index);
 for(let j=0;j<=finished.tip;j++)assert.ok(Math.hypot(...finished.points[j].map((v,k)=>v-c.architectureSample(path,j,finished.tip)[k]))<1e-8);
 for(const corner of path.route){
  const expected=[corner[0]*c.cityView.s+c.cityView.x,corner[1]*c.cityView.s+c.cityView.y];
  assert.ok(finished.points.slice(0,finished.tip+1).some(p=>Math.hypot(...p.map((v,k)=>v-expected[k]))<1e-8),'A sample lands on every corner, without cutting across it');
 }
}
assert.equal(c.threadArchitecture(1),null,'The collapsing structure cannot drag a landing line through its slabs');
console.log('Passed: physical outline targets, visible catch, pinned tips, continuous single-stroke transformation, exact corners and complete handoff.');


