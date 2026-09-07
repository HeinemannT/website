import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
const source=await readFile(new URL('../reading.js',import.meta.url),'utf8');
function visit(referrer,destination,historyLength=2,eventOptions={}){
 let click,back=0,prevented=0;
 const origin='https://example.test';
 const context={URL,Date,location:{href:origin+'/gedanken.html'},history:{length:historyLength,back(){back++}},
  sessionStorage:{getItem(){throw Error('Disabled storage')},removeItem(){}},
  document:{referrer,querySelector(){return {href:origin+destination,addEventListener(type,listener){click=listener}}}}};
 vm.runInNewContext(source,context);
 click({button:0,preventDefault(){prevented++},...eventOptions});
 return {back,prevented};
}
assert.deepEqual(visit('https://example.test/','/'),{back:1,prevented:1},'Return to the city uses its saved history entry');
assert.deepEqual(visit('https://example.test/gedanken.html','/gedanken.html'),{back:1,prevented:1},'Article return preserves the index position');
for(const referrer of ['', 'https://elsewhere.test/', 'https://example.test/ich.html'])
 assert.deepEqual(visit(referrer,'/'),{back:0,prevented:0},'Unrelated/direct visits keep native fallback navigation');
assert.deepEqual(visit('https://example.test/','/',1),{back:0,prevented:0});
assert.deepEqual(visit('https://example.test/','/',2,{ctrlKey:true}),{back:0,prevented:0},'Modified clicks remain native');
const city=await readFile(new URL('../index.html',import.meta.url),'utf8');
assert.match(city,/thoughts:'',about:''/,'Draft reading pages are not linked from the city');
console.log('Passed: independent destinations and safe native/history return navigation.');
