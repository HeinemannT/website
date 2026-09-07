const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const between=(a,b)=>source.slice(source.indexOf(a),source.indexOf(b,source.indexOf(a)));
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),ease=t=>{t=clamp(t,0,1);return t*t*(3-2*t)},noise=n=>{const v=Math.sin(n*127.1+43.7)*43758.5453;return v-Math.floor(v)};
const context={Math,clamp,ease,noise,lerp:(a,b,t)=>a+(b-a)*t,progress:3,W:1280,H:800,DPR:1,city:{style:{}},cityState:{hover:-1,revision:0},keyboard:false,cityWasActive:true,cityPaintKey:'',cityView:{},cityShapes:[],collapseProgress:0,status:{},cityNavigation:{},buildingNote:{replaceChildren(){}},writtenNote:'',cityCtx:new Proxy({globalAlpha:1},{get:(obj,k)=>k in obj?obj[k]:()=>{}})};
vm.createContext(context);vm.runInContext(fs.readFileSync(require('node:path').join(__dirname,'../collapse.js'),'utf8'),context);
vm.runInContext(between('const blocks=[','const cityState=')+between('const inCityMode=','const cityNavigation=')+'\nthis.blocks=blocks;',context);
vm.runInContext(between('function scrollPhases(', 'function drawGraphite(')+between('function structuralVertices(', 'function drawCity(){'),context);
const parts=context.buildingParts(context.blocks[2]);
assert.equal(parts.length,12);
assert.equal(parts.filter(p=>p.release<5).length,9,'Local deterioration precedes large failures');
const distance=(a,b)=>Math.hypot(...a.map((v,i)=>v-b[i]));
for(const part of parts){
 const original=context.structuralVertices(part,0);
 for(let p=0;p<=1.001;p+=.025){
  const vertices=context.structuralVertices(part,p);
  assert.ok(vertices.every(v=>v[2]>=-1e-8),'No structural member penetrates the ground');
  for(let i=0;i<vertices.length;i++)for(let j=i+1;j<vertices.length;j++)assert.ok(Math.abs(distance(vertices[i],vertices[j])-distance(original[i],original[j]))<1e-7,'Members retain their solid dimensions throughout collapse');
 }
 if(part.kind==='slab')assert.ok(context.structuralVertices(part,1).every((v,i)=>v[2]<original[i][2]),'Every slab settles below its original position');
}
for(let p=0;p<=3;p+=.01){const phase=context.scrollPhases(p);if(phase.arrival>0||phase.reveal>0)assert.equal(phase.dark,1,'City can only appear after graphite is complete')}
assert.equal(context.scrollPhases(2.25).arrival,0,'There is a dark interval with no city');
assert.equal(context.scrollPhases(2.25).dark,1);
context.drawCityGround=()=>{};context.drawBuilding=()=>{};context.districtLayer=()=>{};context.polygon=()=>{};context.concreteFace=()=>{};context.drawCityDetails=()=>{};context.positionCityLinks=()=>{};
vm.runInContext(between('function drawCity(){','function cityHit('),context);
for(const [W,H] of [[1440,900],[1280,720],[390,844],[320,568],[844,390]]){
 Object.assign(context,{W,H,progress:3,cityPaintKey:''});context.drawCity();
 for(const shape of context.cityShapes)for(const [x,y] of shape.points)assert.ok(x>=0&&x<=W&&y>=0&&y<=H,`Complete building fits ${W}x${H}`);
 const settled=JSON.stringify(context.cityView);context.progress=2.86;context.cityPaintKey='';context.drawCity();assert.equal(JSON.stringify(context.cityView),settled,'Camera settles before interactions activate');
}
assert.ok(!source.includes('roomContent')&&!source.includes('id="room"'),'No drafted interior pages');
assert.equal((source.match(/<img /g)||[]).length,1,'Only the original lake image is used');
assert.ok(source.includes("phrase:'Gedanken'")&&source.includes("phrase:'Ich'"));
assert.ok(source.includes("sessionStorage.setItem('what-remains:structure:time-v1','fallen')"),'Rubble persists during the visit');
console.log('Passed: rigid structural members; grounded slabs; darkness before city; settled camera; all buildings fit desktop, phone and landscape; no interior pages or extra images.');

const selected=[],activated=[],links=[];
const nav={blocks:context.blocks,destinations:{},touchPreview:-1,keyboard:false,collapseProgress:0,cityState:{selected:0},selectCity:i=>selected.push(i),activateBuilding:i=>activated.push(i),cityNavigation:{append:a=>links.push(a)},document:{createElement:()=>({dataset:{},events:{},setAttribute(){},addEventListener(name,fn){this.events[name]=fn},focus(){this.events.focus()},blur(){}})}};
vm.createContext(nav);vm.runInContext(between('const cityLinks=blocks.map',"let positionedLinksKey="),nav);
const click=(i,event={})=>links[i].events.click({preventDefault(){},...event});
click(1,{pointerType:'touch',detail:1});assert.equal(selected.at(-1),1);assert.equal(activated.length,0,'First tap selects the building');
click(1,{pointerType:'touch',detail:1});assert.equal(activated.at(-1),1,'Second tap activates thoughts');
click(0,{pointerType:'touch',detail:1});assert.equal(activated.at(-1),0,'Unlabelled gallery activates in one tap');
click(2,{pointerType:'touch',detail:1});assert.equal(activated.at(-1),2,'Unlabelled ruin crumbles in one tap');
links[3].events.keydown({key:'Enter',preventDefault(){}});assert.equal(activated.at(-1),3,'Keyboard activates the about destination');
nav.collapseProgress=1;links[1].events.keydown({key:'ArrowRight',preventDefault(){}});assert.equal(selected.at(-1),3,'Keyboard skips the collapsed building');
const stored=[],collapse={sessionStorage:{getItem:()=>null,setItem:(...args)=>stored.push(args)},performance:{now:()=>100},reduced:{matches:true},cityState:{revision:0},status:{},request(){},selectCity(){}};
vm.createContext(collapse);vm.runInContext(between('let collapseStarted=','function selectCity('),collapse);vm.runInContext('crumble();this.value=collapseProgress;crumble();',collapse);
assert.equal(collapse.value,1,'Reduced motion shows settled rubble immediately');assert.equal(stored.length,1,'Repeated activation cannot restart the collapse');
console.log('Passed: touch preview, one-tap gallery and collapse, keyboard navigation, reduced motion, and idempotent persistence.');

// Cached drawings must not repaint their pencil grain on scroll or repeated hover.
let facePaints=0,grainStrokes=0;
Object.assign(context,{buildingCache:new Map(),faceGrainCache:new Map(),material:{width:100,height:100},document:{createElement:()=>({width:0,height:0,getContext:()=>new Proxy({globalAlpha:1},{get:(o,k)=>k in o?o[k]:()=>{}})})},stroke:()=>grainStrokes++,concreteFace:()=>facePaints++,collapseProgress:0});
vm.runInContext(between('function faceGrain(', 'function concreteFace('),context);
context.faceGrain(17,80,100);context.faceGrain(17,80,100);assert.equal(grainStrokes,230,'Face grain is painted once');
context.drawBuilding(context.blocks[0],0);assert.equal(facePaints,3);
context.drawBuilding(context.blocks[0],0);assert.equal(facePaints,3,'Static gallery reuses its drawing');
context.cityState.hover=0;context.drawBuilding(context.blocks[0],0);assert.equal(facePaints,6,'Hover gets one cached drawing');
context.drawBuilding(context.blocks[0],0);assert.equal(facePaints,6,'Repeated hover does not repaint grain');
context.buildingCache.clear();context.drawBuilding(context.blocks[0],0);assert.equal(facePaints,9,'Resize can invalidate the cached drawing');
let movingFrames=0;context.drawStructure=()=>movingFrames++;context.collapseProgress=.5;
context.drawBuilding(context.blocks[2],2);context.drawBuilding(context.blocks[2],2);assert.equal(movingFrames,2,'Moving structure still updates each frame');
console.log('Passed: static and hover drawing reuse, one-time pencil grain, resize invalidation, and live collapse.');

// A quiet initial interval, local damage first, then substantial structural failure.
const rigidParts=context.buildingParts(context.blocks[2]),sim=new context.CollapseModel(rigidParts);
for(const part of rigidParts){
 assert.deepEqual(sim.vertices(part,0),sim.vertices(part,.025),'No initial frame is exposed before deterioration begins');
 const end=sim.vertices(part,1);
 assert.deepEqual(end,sim.vertices(part,1.2),'Playback clamps to a persistent resting state');
 if(part.release>5&&part.release<20){
  assert.deepEqual(sim.vertices(part,0),sim.vertices(part,4/14),'Large masses stay intact through the early surface loss');
  const center=vs=>vs.reduce((z,v)=>z+v[2]/vs.length,0);
  assert(center(end)<center(sim.vertices(part,0))-5,'Heavy masses end materially lower');
 }
 // Every convex prism is closed, including its underside and fracture faces.
 const edges=new Map();for(const face of context.CollapseModel.faces(part))for(let i=0;i<face.length;i++){
  const key=[face[i],face[(i+1)%face.length]].sort((a,b)=>a-b).join('/');edges.set(key,(edges.get(key)||0)+1);
 }
 assert([...edges.values()].every(count=>count===2),'Every edge belongs to two faces');
 for(let p=0;p<=1;p+=.025)for(const v of sim.vertices(part,p)){
  assert(v[0]<context.blocks[1].x,'The fall stays clear of the thoughts tower');
 }
}
const flat=part=>sim.vertices(part,1).slice(0,part.poly.length).map(p=>[p[0],p[2]]);
for(let i=0;i<rigidParts.length;i++)for(let j=i+1;j<rigidParts.length;j++){
 const A=flat(rigidParts[i]),B=flat(rigidParts[j]);let penetration=Infinity;
 for(const P of [A,B])for(let k=0;k<P.length;k++){
  const q=P[(k+1)%P.length],dx=q[0]-P[k][0],dz=q[1]-P[k][1],len=Math.hypot(dx,dz),n=[-dz/len,dx/len];
  const x=A.map(p=>p[0]*n[0]+p[1]*n[1]),y=B.map(p=>p[0]*n[0]+p[1]*n[1]);
  penetration=Math.min(penetration,Math.min(Math.max(...x),Math.max(...y))-Math.max(Math.min(...x),Math.min(...y)));
 }
 assert.ok(penetration<.15,'Settled masses do not overlap materially');
}
assert.equal(new context.CollapseModel(rigidParts).tracks,sim.tracks,'Every instance shares the baked motion data');
console.log('Passed: deterioration before heavy failure; closed convex solids; rigid dimensions; tower clearance; bounded contacts; shared playback.');

