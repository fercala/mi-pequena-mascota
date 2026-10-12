import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const context={window:{}};vm.createContext(context);vm.runInContext(readFileSync('docs/model.js','utf8'),context);
const M=context.window.PetModel;
let s=M.fresh();s.pet='rabbit';s.name='Nube';
assert.equal(M.finishDay(s),null,'Cannot skip time to grow');
M.care(s,'food');M.care(s,'food');assert.equal(Object.keys(s.cared).length,1,'Repeating a care does not add variety');
M.care(s,'bath');M.care(s,'sleep');assert.equal(M.finishDay(s),null,'Sleep alone cannot skip day');
assert.equal(M.tick(s,360),true);let summary=M.finishDay(s);assert.equal(summary.qualified,true);assert.equal(s.caredDays,1);assert.equal(s.day,2);assert.equal(s.elapsed,0);
for(let day=2;day<=9;day++){M.care(s,'food');M.care(s,'bath');M.care(s,'sleep');M.tick(s,360);summary=M.finishDay(s);assert.ok(summary);if(day===2)assert.equal(M.stage(s),1);if(day===5)assert.equal(M.stage(s),2);}
assert.equal(M.stage(s),3);assert.equal(s.caredDays,9);assert.equal(M.unlocked('crown',s.caredDays),true);
const prev=s.caredDays;M.tick(s,360);M.care(s,'sleep');summary=M.finishDay(s);assert.equal(summary.qualified,false);assert.equal(s.caredDays,prev);
for(let i=0;i<100;i++)M.care(s,'love');assert.equal(s.stickers.filter(x=>x==='love').length,1);
const restored=M.normalize(JSON.parse(JSON.stringify(s)));assert.equal(restored.caredDays,s.caredDays);assert.equal(restored.name,'Nube');assert.equal(restored.elapsed,0);
const bad=M.normalize({version:1,pet:'cat',name:'<Mimo>',day:-1,caredDays:Infinity,elapsed:999999,settings:{duration:-3},needs:{food:NaN},stickers:['unknown','love','love'],accessory:'crown'});
assert.equal(bad.day,1);assert.equal(bad.caredDays,0);assert.equal(bad.settings.duration,60);assert.equal(bad.elapsed,60);assert.equal(bad.needs.food,80);assert.equal(bad.name,'Mimo');assert.equal(bad.accessory,'none');assert.equal(bad.stickers.length,1);
assert.equal(M.normalize(null).pet,null);assert.equal(M.normalize({version:2}).pet,null);
console.log('PASS: day duration, varied care, all growth stages, rewards, adult unlocks, save restoration, invalid saved data.');
