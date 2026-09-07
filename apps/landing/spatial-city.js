/* The same authored solids, viewed through a descending camera. No animation runs at rest. */
(() => {
'use strict';
const mix=(a,b,t)=>a+(b-a)*t;
const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t)};
const add=(a,b)=>a.map((v,i)=>v+b[i]),sub=(a,b)=>a.map((v,i)=>v-b[i]);
const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const unit=a=>{const length=Math.hypot(...a);return a.map(v=>v/length)};
const blend=(a,b,t)=>a.map((v,i)=>mix(v,b[i],t));
const iso=([x,y,z])=>[(x-y)*.86,(x+y)*.4-z];
const faceIds=[[1,2,6,5],[3,2,6,7],[0,1,2,3],[0,3,7,4],[0,1,5,4],[4,5,6,7]];
function vertices(b){if(b.poly)return [b.y,b.y+b.d].flatMap(y=>b.poly.map(([x,z])=>[x,y,z]));const z=b.z||0;return [[0,0,1],[1,0,1],[1,1,1],[0,1,1],[0,0,0],[1,0,0],[1,1,0],[0,1,0]].map(([u,v,k])=>[b.x+u*b.w,b.y+v*b.d,z+k*b.h])}
function camera(width,height,view,travel,entry=0){
 const t=smooth(travel),e=smooth(entry);
 const startTarget=[190,180,0],pitch=Math.atan(.4*Math.SQRT2);
 const startEye=add(startTarget,[Math.cos(pitch)*1272.792,Math.cos(pitch)*1272.792,Math.sin(pitch)*1800]);
 let target=blend(startTarget,[205,150,48],t),eye=blend(startEye,[230,420,24],t);
 target=blend(target,[229,102,14],e);eye=blend(eye,[229,123,14],e);
 const forward=unit(sub(target,eye)),right=unit(cross([0,0,1],forward)),up=cross(forward,right),distance=Math.hypot(...sub(target,eye));
 const perspective=1-(1-t)*(1-e),focal=Math.min(width*.90,height*1.12);
 const center=iso(startTarget);
 return {eye,forward,right,up,distance,perspective,
  x:mix(center[0]*view.s+view.x,width*.5,perspective),y:mix(center[1]*view.s+view.y,height*.56,perspective),
  sx:mix(Math.SQRT2*.86*view.s,focal/distance,perspective),sy:mix(view.s/Math.cos(pitch),focal/distance,perspective)};
}
function project(point,c){
 const relative=sub(point,c.eye),depth=dot(relative,c.forward);
 const denominator=1+c.perspective*(depth/c.distance-1);
 return [c.x+dot(relative,c.right)*c.sx/Math.max(.015,denominator),c.y-dot(relative,c.up)*c.sy/Math.max(.015,denominator),depth];
}
function clipNear(points,c){
 const result=[];
 for(let i=0;i<points.length;i++){
  const a=points[i],b=points[(i+1)%points.length],da=dot(sub(a,c.eye),c.forward)-8,db=dot(sub(b,c.eye),c.forward)-8;
  if(da>=0)result.push(a);
  if((da>=0)!==(db>=0))result.push(blend(a,b,da/(da-db)));
 }
 return result;
}
function hull(points){
 const sorted=points.slice().sort((a,b)=>a[0]-b[0]||a[1]-b[1]);
 const turn=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
 const half=list=>{const out=[];for(const p of list){while(out.length>1&&turn(out.at(-2),out.at(-1),p)<=0)out.pop();out.push(p)}return out.slice(0,-1)};
 return [...half(sorted),...half(sorted.slice().reverse())];
}
// Vertices carry their texture coordinates through every geometric cut.
function splitPolygon(polygon,normal,offset,epsilon=1e-7){
 const front=[],back=[],v=polygon.vertices;
 const distances=v.map(p=>dot(p,normal)-offset);
 for(let i=0;i<v.length;i++){
  const a=v[i],b=v[(i+1)%v.length],da=distances[i],db=distances[(i+1)%v.length];
  if(da>=-epsilon)front.push(a);
  if(da<=epsilon)back.push(a);
  if((da>epsilon&&db<-epsilon)||(da<-epsilon&&db>epsilon)){
   const cut=blend(a,b,da/(da-db));front.push(cut);back.push(cut);
  }
 }
 return {front:front.length>=3?{...polygon,vertices:front}:null,back:back.length>=3?{...polygon,vertices:back}:null,
  coplanar:distances.every(d=>Math.abs(d)<=epsilon)};
}
// Polygons are immutable during visibility sorting. Reuse each computed plane.
const polygonPlanes=new WeakMap();
function plane(polygon){
 if(polygonPlanes.has(polygon))return polygonPlanes.get(polygon);
 const [a,b]=polygon.vertices;
 for(let i=2;i<polygon.vertices.length;i++){
  const raw=cross(sub(b,a),sub(polygon.vertices[i],a));
  if(Math.hypot(...raw)>1e-10){const n=unit(raw);const result={n,d:dot(a,n)};polygonPlanes.set(polygon,result);return result}
 }
 return null;
}
// A BSP splits overlapping slabs at their actual planes. Average face depth
// cannot order the long, tilted members or a trace passing behind a building.
function depthOrder(polygons,eye){
 polygons=polygons.filter(p=>plane(p));
 if(polygons.length<2)return polygons;
 const build=list=>{
  if(!list.length)return null;
  let chosen=0,best=Infinity;
  for(let i=0;i<list.length;i+=Math.max(1,Math.floor(list.length/5))){
     const {n,d}=plane(list[i]);let f=0,b=0,s=0;
   for(const p of list){const ds=p.vertices.map(v=>dot(v,n)-d),front=ds.some(v=>v>1e-7),back=ds.some(v=>v< -1e-7);if(front)f++;if(back)b++;if(front&&back)s++}
   const score=s*3+Math.abs(f-b);if(score<best){best=score;chosen=i}
  }
  const {n,d}=plane(list[chosen]),same=[],front=[],back=[];
  for(const p of list){const cut=splitPolygon(p,n,d);if(cut.coplanar)same.push(p);else{if(cut.front&&plane(cut.front))front.push(cut.front);if(cut.back&&plane(cut.back))back.push(cut.back)}}
  return {n,d,same,front:build(front),back:build(back)};
 };
 const result=[],walk=node=>{if(!node)return;const forward=dot(eye,node.n)>=node.d;walk(forward?node.back:node.front);result.push(...node.same);walk(forward?node.front:node.back)};
 walk(build(polygons));return result;
}
function texturedTriangle(ctx,texture,vertices,c,depth){
 if(depth>0){
  const [a,b,d]=vertices,ab=blend(a,b,.5),bd=blend(b,d,.5),da=blend(d,a,.5);
  for(const tri of [[a,ab,da],[ab,b,bd],[da,bd,d],[ab,bd,da]])texturedTriangle(ctx,texture,tri,c,depth-1);
 }else triangle(ctx,texture.canvas,vertices.map(v=>v.slice(3)),vertices.map(v=>project(v,c)));
}
function triangle(ctx,image,source,dest){
 const [a,b,c]=source,[A,B,C]=dest;
 const x1=b[0]-a[0],y1=b[1]-a[1],x2=c[0]-a[0],y2=c[1]-a[1],det=x1*y2-x2*y1;
 if(Math.abs(det)<1e-8)return;
 const X1=B[0]-A[0],Y1=B[1]-A[1],X2=C[0]-A[0],Y2=C[1]-A[1];
 const m0=(X1*y2-X2*y1)/det,m2=(X2*x1-X1*x2)/det,m1=(Y1*y2-Y2*y1)/det,m3=(Y2*x1-Y1*x2)/det;
 ctx.save();ctx.beginPath();
 // Tiny overlap conceals raster seams between two portions of the same face.
 const center=[(A[0]+B[0]+C[0])/3,(A[1]+B[1]+C[1])/3];
 for(const [i,p] of dest.entries()){
  const dx=p[0]-center[0],dy=p[1]-center[1],n=Math.max(1,Math.hypot(dx,dy));
  const x=p[0]+dx/n*.3,y=p[1]+dy/n*.3;i?ctx.lineTo(x,y):ctx.moveTo(x,y);
 }
 ctx.closePath();ctx.clip();ctx.transform(m0,m1,m2,m3,A[0]-m0*a[0]-m2*a[1],A[1]-m1*a[0]-m3*a[1]);ctx.drawImage(image,0,0);ctx.restore();
}
// Geometry is authored once. Camera movement only changes its projection.
function prepareSolid(part){
 const original=vertices(part),ids=part.poly?CollapseModel.faces(part):faceIds;
 const center=original.reduce((out,p)=>add(out,p.map(v=>v/original.length)),[0,0,0]);
 return {part,original,center,faces:ids.map(indices=>{
  const points=indices.map(n=>original[n]),middle=points.reduce((out,p)=>add(out,p.map(v=>v/points.length)),[0,0,0]);
  let normal=cross(sub(points[1],points[0]),sub(points[2],points[0]));
  if(dot(normal,sub(middle,center))<0)normal=normal.map(v=>-v);
  return {ids:indices,points,middle,normal};
 })};
}
class SpatialCity{
 constructor({canvas,blocks,district,parts,structure,paintFace}){
  this.canvas=canvas;this.ctx=canvas.getContext('2d');this.blocks=blocks;this.structure=structure;this.paintFace=paintFace;
  this.district=district.flatMap((layer,li)=>layer.buildings.map(([x,y,w,d,h],n)=>({b:{x,y,w,d,h,z:0},id:`district-${li}-${n}`,alpha:[.28,.26,.18][li]})));
  this.records=[...this.district,...blocks.map((b,i)=>({b,id:'main-'+i,i,alpha:1}))].map(record=>({
   ...record,solids:(record.i===undefined?[record.b]:parts(record.b)).map(prepareSolid),
   intact:record.i===2?[prepareSolid({...record.b,z:0})]:null
  }));
  this.cache=new Map();this.facadeBindings=new Map();this.lastKey='';this.shapes=[];this.anchors=[];
 }
 invalidate(){this.cache.clear();this.facadeBindings.clear();this.lastKey=''}
 texture(id,points,tone,seed,fade){
  if(this.cache.has(id))return this.cache.get(id);
  const source=points.map(iso),xs=source.map(p=>p[0]),ys=source.map(p=>p[1]);
  const x=Math.min(...xs)-3,y=Math.min(...ys)-3,w=Math.max(...xs)-x+3,h=Math.max(...ys)-y+3;
  const ratio=Math.min(2,256/Math.max(w,h));
  const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.ceil(w*ratio));canvas.height=Math.max(1,Math.ceil(h*ratio));
  const ctx=canvas.getContext('2d');ctx.setTransform(ratio,0,0,ratio,-x*ratio,-y*ratio);
  this.paintFace(ctx,source,tone,seed,fade);
  const item={canvas,x,y,ratio,uv:source.map(p=>[(p[0]-x)*ratio,(p[1]-y)*ratio])};this.cache.set(id,item);return item;
 }
 render({width,height,ratio,view,travel,entry=0,collapse=0,hover=-1,keyboard=false,arrival=1,reveal=1}){
  const key=[width,height,ratio,view.x,view.y,view.s,arrival,reveal,travel.toFixed(5),entry.toFixed(5),collapse.toFixed(4),hover,keyboard].join('/');
  if(key===this.lastKey)return;this.lastKey=key;
  const canvas=this.canvas,ctx=this.ctx;
  if(canvas.width!==Math.round(width*ratio)||canvas.height!==Math.round(height*ratio)){canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio)}
  ctx.setTransform(ratio,0,0,ratio,0,0);ctx.clearRect(0,0,width,height);
  this.camera=camera(width,height,view,travel,entry);const c=this.camera;
  const faces=[],shapes=[],shadows=[];this.anchors=[];
  for(const record of this.records){
   const {b,id,i}=record,main=i!==undefined,alpha=record.alpha*(main?reveal:arrival),solids=i===2&&collapse===0?record.intact:record.solids,all=[];
   for(const [partIndex,solid] of solids.entries()){
    const {part,original}=solid,moving=main&&i===2&&part.poly;
    const world=moving?this.structure(part,collapse):original;
    if(main)shadows.push({points:world,alpha:reveal});
    const center=moving?world.reduce((out,p)=>add(out,p.map(v=>v/world.length)),[0,0,0]):solid.center;
    if(main&&(i!==2||collapse===0))all.push(...world.map(p=>project(p,c)).filter(p=>p[2]>8));
    solid.faces.forEach((face,j)=>{
     const {ids}=face,points=moving?ids.map(n=>world[n]):face.points;
     const middle=moving?points.reduce((out,p)=>add(out,p.map(v=>v/points.length)),[0,0,0]):face.middle;
     let normal=face.normal;
     if(moving){normal=cross(sub(points[1],points[0]),sub(points[2],points[0]));if(dot(normal,sub(middle,center))<0)normal=normal.map(v=>-v)};
     if(dot(normal,sub(c.eye,middle))<=0)return;
     const screen=clipNear(points,c).map(p=>project(p,c));if(screen.length<3)return;
     const xs=screen.map(p=>p[0]),ys=screen.map(p=>p[1]);
     if(Math.max(...xs)<-4||Math.min(...xs)>width+4||Math.max(...ys)<-4||Math.min(...ys)>height+4)return;
     const lift=main&&hover===i?4:0,lightNormal=part.poly?unit(normal):normal;
     const tone=(part.poly?(j===0?43:j===1?60:Math.round(Math.max(37,Math.min(76,48+lightNormal[2]*28-lightNormal[0]*6))/2)*2):(main?[45,60,76,55,43,37]:[39,51,67,46,36,31])[j])+lift;
     const seed=main?(i===2?218+partIndex*43+j*17:i*109+j*17):900+partIndex*73+j*17+b.x;
     const contact=main&&j<5&&j!==2&&i!==2?'contact':false;
     let texture;
     if(part.poly&&j<2){
      // Fractures share the unbroken façade texture, including its outer pencil edges.
      const binding=id+'/'+partIndex+'/'+j+'/'+lift;
      texture=this.facadeBindings.get(binding);
      if(!texture){
       const y=j?b.y+b.d:b.y,whole=[[b.x,y,b.h],[b.x+b.w,y,b.h],[b.x+b.w,y,0],[b.x,y,0]];
       const shared=this.texture(id+'/mass/'+j+'/'+lift,whole,tone,218+(j?17:68),false);
       texture={canvas:shared.canvas,uv:ids.map(n=>{const p=iso(original[n]);return [(p[0]-shared.x)*shared.ratio,(p[1]-shared.y)*shared.ratio]})};
       this.facadeBindings.set(binding,texture);
      }
     }else texture=this.texture(id+'/'+partIndex+'/'+j+'/'+lift+'/'+contact+'/'+tone,ids.map(n=>original[n]),tone,seed,contact);
     faces.push({vertices:points.map((p,n)=>[...p,...texture.uv[n]]),texture,alpha,main,i,j,tone});
    });
    if(part.poly&&part.release<20){
     const amount=smooth((collapse*14-part.release+.9)/.7),n=part.poly.length;
     if(amount)for(let j=0;j<n;j++){
      const k=(j+1)%n,A=part.poly[j],B=part.poly[k];
      if(Math.abs(A[0]-B[0])<1e-6&&(Math.abs(A[0]-b.x)<1e-6||Math.abs(A[0]-b.x-b.w)<1e-6))continue;
      if(Math.abs(A[1]-B[1])<1e-6&&(A[1]<1e-6||Math.abs(A[1]-b.h)<1e-6))continue;
      const a=add(world[j+n],[0,.012,0]),d=add(world[k+n],[0,.012,0]),delta=sub(d,a),length=Math.hypot(delta[0],delta[2]);
      const edge=[-delta[2]/length*.15,0,delta[0]/length*.15];
      faces.push({vertices:[a,d,add(d,edge),add(a,edge)],color:'#20221c',alpha:.55*amount*reveal});
     }
    }
   }
   if(main){
    if((i!==2||collapse===0)&&all.length)shapes.push({i,points:hull(all),depth:dot(sub([b.x+b.w/2,b.y+b.d/2,b.h/2],c.eye),c.forward)});
    this.anchors[i]=project([b.x+b.w/2,b.y+b.d/2,b.h],c);
   }
  }
  this.ground(ctx,c,arrival,shadows);
  if(collapse>.48){
   const roof=vertices({...this.blocks[2],z:0});
   const path=[roof[3],roof[0],roof[1]];
   for(let i=0;i<path.length-1;i++){
    const a=path[i],b=path[i+1];
    faces.push({vertices:[a,b,add(b,[0,0,.34]),add(a,[0,0,.34])],color:'#b6b5a8',alpha:.085*smooth((collapse-.48)/.35)*reveal});
   }
  }
  for(const [x,y,h] of [[249,191,8],[219,311,8.5]]){
   for(const shape of [[[x-.65,y,0],[x-.5,y,h*.7],[x+.45,y,h*.79],[x+.8,y,h*.37],[x+.45,y,0]],[[x-.43,y,h*.85],[x-.34,y,h],[x+.18,y,h*1.02],[x+.48,y,h*.91],[x+.27,y,h*.82]]])faces.push({vertices:shape,color:'#161b17',alpha:.68*reveal});
  }
  faces.push({vertices:[[224,102.015,0],[234,102.015,0],[234,102.015,25],[224,102.015,25]],color:'#181b18',alpha:.45*reveal});
  for(const face of depthOrder(faces,c.eye)){
   const clipped=clipNear(face.vertices,c);if(clipped.length<3)continue;
   const screen=clipped.map(p=>project(p,c)),{texture,alpha,main}=face;ctx.globalAlpha=alpha;
   if(main||face.color){
    // Opaque, world-fixed face shading is shared by the overhead and street views.
    ctx.fillStyle=face.color||`rgb(${face.tone},${face.tone},${face.tone-2})`;
    ctx.beginPath();
    screen.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();ctx.fill();
   }
   if(texture){
    ctx.save();ctx.beginPath();screen.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();ctx.clip();
    // Orthographic projection is affine already; subdivision adds no accuracy.
    const subdivisions=c.perspective===0?0:(main&&face.i!==2?2:1);
    for(let i=1;i<clipped.length-1;i++)texturedTriangle(ctx,texture,[clipped[0],clipped[i],clipped[i+1]],c,subdivisions);
    ctx.restore();
   }
   if(main&&keyboard&&hover===face.i){ctx.globalAlpha=.75;ctx.strokeStyle='#d4d0c1';ctx.lineWidth=1;ctx.beginPath();screen.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();ctx.stroke()}
  }
  ctx.globalAlpha=1;this.shapes=shapes.sort((a,b)=>b.depth-a.depth);
 }
 ground(ctx,c,arrival,shadows){
  ctx.save();
  const paint=(world,color,opacity)=>{
   const points=clipNear(world,c).map(p=>project(p,c));if(points.length<3)return;
   ctx.globalAlpha=opacity*arrival;ctx.fillStyle=color;ctx.beginPath();
   points.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();ctx.fill();
  };
  const mark=(a,b,opacity,width=.65)=>{
   let da=dot(sub(a,c.eye),c.forward)-8,db=dot(sub(b,c.eye),c.forward)-8;
   if(da<0&&db<0)return;
   if(da<0)a=blend(a,b,da/(da-db));else if(db<0)b=blend(a,b,da/(da-db));
   const A=project(a,c),B=project(b,c);ctx.globalAlpha=opacity*arrival;ctx.strokeStyle='#85877b';ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(A[0],A[1]);ctx.lineTo(B[0],B[1]);ctx.stroke();
  };
  // One continuous ground plane, with a lane and uneven pavement around the court.
  paint([[188,570,0],[276,570,0],[276,238,0],[270,218,0],[270,108,0],[198,108,0],[198,212,0],[188,226,0]],'#191c18',.22);
  paint([[146,116,0],[263,116,0],[263,229,0],[203,229,0],[186,210,0],[146,210,0]],'#77796c',.09);
  for(const b of this.blocks){
   const r=7;
   paint([[b.x-r,b.y-r,0],[b.x+b.w+r,b.y-r,0],[b.x+b.w+r,b.y+b.d+r,0],[b.x-r,b.y+b.d+r,0]],'#727569',.11);
  }
  // Fixed light direction: the shadow changes with geometry, never with the camera.
  for(const shadow of shadows){
   const cast=hull(shadow.points.map(([x,y,z])=>[x+z*.42,y-z*.30,0]));
   paint(cast,'#10130f',.15*shadow.alpha);
   const contact=hull(shadow.points.filter(p=>p[2]<1.2).map(([x,y])=>[x,y,0]));
   if(contact.length>2)paint(contact,'#0e120e',.27*shadow.alpha);
  }
  const edges=[[[190,565,0],[190,334,0]],[[190,325,0],[190,303,0]],[[190,287,0],[190,228,0]],[[275,557,0],[275,340,0]],[[274,324,0],[274,243,0]],[[146,116,0],[146,191,0]],[[153,116,0],[198,116,0]],[[263,147,0],[263,222,0]],[[198,108,0],[260,108,0]],[[198,212,0],[198,121,0]]];
  for(const [a,b] of edges)mark(a,b,.24);
  // Sparse transverse joints show the street receding, without a regular grid.
  for(const [y,x,end] of [[137,148,196],[178,148,190],[220,204,260],[248,191,205],[307,191,204],[359,191,206],[421,191,205],[482,191,203]])mark([x,y,0],[end,y+.8,0],.13,.5);
  for(const b of this.blocks)if(b.slug!=='ruin'){
   mark([b.x,b.y+b.d,0],[b.x+b.w*.63,b.y+b.d,0],.16,.8);
  }
  ctx.restore();
 }

}
globalThis.SpatialCity=SpatialCity;
globalThis.CityCamera={camera,project,vertices,clipNear,faceIds,splitPolygon,depthOrder};
})();
