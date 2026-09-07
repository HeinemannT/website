import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import yaml from 'js-yaml';
import { timelineBounds, nextTimelineYear, visibleEvents, formatRecordDate, renderGlossaryMarkdown, treeLayout, validateData } from '../utils/evidence.mjs';
const read=name=>yaml.load(fs.readFileSync(new URL(`../public/${name}`,import.meta.url),'utf8'));
const data=read('data.yaml'), tree=read('family_tree.yaml');
const c=(p,id)=>data.pages[p-1].columns.find(c=>c.id===id);
const person=id=>tree.people.find(p=>p.id===id);

test('all source, calendar, identity and relationship references validate',()=>assert.deepEqual(validateData(data,tree),[]));
test('all 36 page images and original column IDs remain aligned, including blank columns',()=>{
  const fixture=JSON.parse(fs.readFileSync(new URL('./source-alignment.json',import.meta.url),'utf8'));
  assert.deepEqual(data.pages.map(p=>({id:p.page_id,image:p.metadata.image_file,columns:p.columns.map(c=>c.id)})),fixture);
  assert.equal(c(31,3).text_zh,undefined);
  assert.equal(c(36,2).text_zh,undefined);
});
test('confirmed textual and calendar regression cases',()=>{
  assert.match(c(1,2).text_zh,/第二十一代/);
  assert.match(c(22,3).text_zh,/十二世/);
  assert.match(c(22,1).text_zh,/壽七十四/);
  assert.match(c(6,4).text_zh,/配甘竹黃氏/);
  assert.match(c(24,7).text_zh,/康熙十一年壬子/);
  assert.equal(c(24,7).map_data.year,1672);
  assert.equal(c(24,7).map_data.legacy_unverified_date,undefined);
  assert.equal(c(35,4).map_data.event_date,'1906-09-08');
  assert.equal(c(35,5).map_data.event_type,'spouse_death');
  assert.equal(c(35,6).map_data.event_type,'spouse_death');
  assert.equal(c(36,1).map_data.subject,'Zhenbei');
  assert.equal(c(36,1).map_data.year,1905);
  assert.match(c(36,6).text_zh,/皇后鎮西人墳場/);
  assert.doesNotMatch(c(36,6).text_zh,/伊梨沙白/);
  assert.equal(person('gen6_wang').name_en,'Ren');
  assert.equal(person('gen13_hui').name_en,'Huiding');
  assert.equal(person('gen13_wenyue_adopted').name_en,'Wenyao');
});
test('single identities and adoption render once with references under adoptive parent',()=>{
  assert.equal(tree.people.filter(p=>p.name_zh==='文顯').length,1);
  assert.equal(tree.people.filter(p=>p.name_zh==='宗榮').length,1);
  const layout=treeLayout(tree.people);
  assert.equal(layout.naturalParent.get('gen17_zongrong'),'gen16_guanxin');
  assert.equal(layout.adoptedParent.get('gen17_zongrong'),'gen16_guanzhi');
  assert.deepEqual(layout.adoptionReferences(person('gen16_guanzhi')),['gen17_zongrong']);
  assert.ok(layout.renderedChildren(person('gen12_tingyuan')).includes('gen13_wenyue_adopted'));
  const ids=[];const visit=id=>{ids.push(id);layout.renderedChildren(person(id)).forEach(visit)};visit(tree.root_id);
  assert.equal(ids.length,new Set(ids).size);
  assert.equal(ids.length,tree.people.length);
});
test('unknown events remain available and are excluded only by explicit filter',()=>{
  const bounds=timelineBounds(data.migration.points);
  assert.deepEqual(bounds,{min:1378,max:1955});
  const early=visibleEvents(data.migration.points,bounds.min);
  assert.ok(early.some(p=>p.id==='guangxi'));
  assert.ok(early.some(p=>p.id==='yuping' && p.coordinates===null));
  assert.ok(!early.some(p=>p.id==='port_elizabeth'));
  assert.ok(visibleEvents(data.migration.points,1955).some(p=>p.id==='port_elizabeth'));
  assert.ok(visibleEvents(data.migration.points,1955,false).every(p=>p.year!==null));
  for(const id of ['guangzhou','xiqiao','guangxi','yuezhou','baiyun','queenstown'])assert.equal(data.migration.points.find(p=>p.id===id).year,null);
  assert.equal(data.migration.points.find(p=>p.id==='port_elizabeth').event_type,'death');
  assert.equal(data.migration.points.find(p=>p.id==='nanxiong'),undefined);
  assert.deepEqual(data.migration.paths,[]);
});
test('timeline boundaries, end, restart, empty and undated-only datasets',()=>{
  assert.equal(nextTimelineYear(1954,{min:1378,max:1955}),1955);
  assert.equal(nextTimelineYear(1955,{min:1378,max:1955}),1955);
  assert.equal(nextTimelineYear(0,{min:1378,max:1955}),1378);
  assert.equal(timelineBounds([]),null);
  assert.equal(timelineBounds([{year:null}]),null);
  assert.equal(nextTimelineYear(0,null),null);
  assert.deepEqual(visibleEvents([{id:'unknown',year:null}],0),[{id:'unknown',year:null}]);
  assert.deepEqual(timelineBounds([{year:1850,year_end:1852},{year:1900}]),{min:1850,max:1900});
});
test('unverified Western-looking dates never render as verified dates',()=>{
  assert.equal(formatRecordDate({event_date:'1702-07-03',legacy_unverified_date:'1702-07-03',normalization_status:'unverified',date_precision:'source_expression',original_date:'康熙十一年壬子六月初九'}),'康熙十一年壬子六月初九');
  assert.match(formatRecordDate(c(35,4).map_data),/1906-09-08 \(verified Western date\)/);
  assert.match(formatRecordDate(c(4,3).map_data),/1378–1379 \(inferred\)/);
});
test('glossary matching preserves Markdown and HTML link URLs and query strings',()=>{
  const terms=[{term:'Jinshi'},{term:'Hao'},{term:'Li'}];
  const href='https://example.org/Jinshi?name=Hao&surname=Li';
  const html=renderGlossaryMarkdown(`[Jinshi research](${href}) and Hao`,terms);
  assert.ok(html.includes(`href="${href}"`));
  assert.match(html,/class="glossary-term/);
  assert.equal((html.match(/<a /g)||[]).length,1);
  assert.ok(renderGlossaryMarkdown(`<a href="${href}">Source</a>`,terms).includes(`href="${href}"`));
  assert.doesNotMatch(renderGlossaryMarkdown('At Zi hour, the Li family met at Si hour.',[{term:'Zi'},{term:'Li'},{term:'Si'}]),/glossary-term/);
});
test('validation detects dangling references, cycles, orphan loss and false exact dates',()=>{
  const t=structuredClone(tree);t.people[0].children.push('missing');assert.ok(validateData(data,t).some(e=>e.includes('missing child')));
  const cyclic=structuredClone(tree);cyclic.people.at(-1).children=[tree.root_id];assert.ok(validateData(data,cyclic).some(e=>e.includes('cycle')));
  const orphan=structuredClone(tree);orphan.people.push({id:'orphan',generation:1,name_en:'Unknown'});assert.ok(validateData(data,orphan).some(e=>e.includes('unreachable')));
  const d=structuredClone(data);d.pages[0].columns[0].map_data={event_date:'1450-01-01',normalization_status:'unverified'};assert.ok(validateData(d,tree).some(e=>e.includes('unverified exact date')));
});
